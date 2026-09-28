#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/publicar_geofabrik_rm.py
---------------------------------
Publica a producción en GitHub (rama main) y Netlify:
1. Capas espaciales de la RM extraídas directamente del extracto Geofabrik Chile (chile-260927.osm.pbf)
   con recorte oficial por shapefile DPA 2023 de la Región Metropolitana.
2. Geodatabase espacial regional 'data/geodatabase_osm_rm_geofabrik.gpkg' con índices R-Tree nativos
   por macrocategoría.
3. 10 capas temáticas GeoJSON optimizadas en 'data/' y 'src/data/' con índice de Bbox por feature
   y metadatos oficiales de procedencia: Fuente (Geofabrik, local-api).
4. Actualización del módulo OSM (osm.js) y app.js con filtrado acelerado O(1) y trazabilidad completa.
"""

import os
import sys
import json
import base64
import time
import hashlib
import requests

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

OWNER = "GEOJOTA"
REPO = "atlas_vgi_uah"
BRANCH = "main"
TOKEN = "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"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LFS_URL = f"https://github.com/{OWNER}/{REPO}.git/info/lfs/objects/batch"

ARCHIVOS_CODIGO = [
    ".gitattributes",
    "src/js/modulos/osm.js",
    "src/js/app.js",
    "scripts/procesar_geofabrik_rm.py",
    "scripts/publicar_geofabrik_rm.py"
]

CATEGORIAS = [
    "cat01_educacion",
    "cat02_servicios",
    "cat03_transporte",
    "cat04_movilidad_activa",
    "cat05_espacio_publico",
    "cat06_patrimonio",
    "cat07_accesibilidad",
    "cat08_biodiversidad",
    "cat09_edificaciones",
    "cat10_cobertura_suelo"
]

ARCHIVOS_LFS = []
for cat in CATEGORIAS:
    ARCHIVOS_LFS.append(f"data/capa_osm_rm_{cat}.geojson")
    ARCHIVOS_LFS.append(f"src/data/capa_osm_rm_{cat}.geojson")



def obtener_headers_api():
    return {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Atlas-VGI-Deployer"
    }

def obtener_headers_lfs():
    return {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.git-lfs+json",
        "Content-Type": "application/vnd.git-lfs+json",
        "User-Agent": "Atlas-VGI-Deployer"
    }

def calcular_sha256_y_tamano(filepath):
    h = hashlib.sha256()
    size = os.path.getsize(filepath)
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest(), size

def crear_blob(contenido_bytes):
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/blobs"
    b64_content = base64.b64encode(contenido_bytes).decode("utf-8")
    payload = {
        "content": b64_content,
        "encoding": "base64"
    }
    r = requests.post(url, json=payload, headers=obtener_headers_api(), timeout=45)
    if r.status_code != 201:
        raise Exception(f"Error creando blob: HTTP {r.status_code} - {r.text[:200]}")
    return r.json()["sha"]

def asegurar_y_subir_lfs():
    print("=" * 80)
    print("FASE 1: VERIFICACIÓN Y SUBIDA DE CAPAS ESPACIALES A GITHUB LFS S3")
    print("=" * 80)
    
    objetos_unicos = {}
    punteros = {}
    
    for rel_path in ARCHIVOS_LFS:
        full_path = os.path.join(BASE_DIR, rel_path)
        if not os.path.exists(full_path):
            print(f"[-] Advertencia: {rel_path} no encontrado, se omite.")
            continue
        sha, size = calcular_sha256_y_tamano(full_path)
        ptr = f"version https://git-lfs.github.com/spec/v1\noid sha256:{sha}\nsize {size}\n"
        punteros[rel_path] = ptr
        if sha not in objetos_unicos:
            objetos_unicos[sha] = {
                "size": size,
                "local_path": full_path,
                "paths": [rel_path]
            }
        else:
            objetos_unicos[sha]["paths"].append(rel_path)

    print(f"Total de archivos LFS a registrar: {len(punteros)}")
    print(f"Total de objetos binarios únicos: {len(objetos_unicos)}")

    for idx, (sha, meta) in enumerate(objetos_unicos.items(), 1):
        sz_mb = meta["size"] / (1024 * 1024)
        sample = meta["paths"][0]
        print(f"\n[{idx}/{len(objetos_unicos)}] LFS: {sample} ({sz_mb:.2f} MB)...")
        
        batch_payload = {
            "operation": "upload",
            "transfers": ["basic"],
            "objects": [{"oid": sha, "size": meta["size"]}]
        }
        r_batch = requests.post(LFS_URL, json=batch_payload, headers=obtener_headers_lfs(), timeout=30)
        if r_batch.status_code != 200:
            print(f"[-] Error en LFS Batch API: HTTP {r_batch.status_code} - {r_batch.text}")
            sys.exit(1)
            
        obj = r_batch.json().get("objects", [{}])[0]
        actions = obj.get("actions", {})
        
        if "upload" in actions:
            up_info = actions["upload"]
            put_url = up_info["href"]
            put_headers = up_info.get("header", {})
            print(f"  [*] Subiendo bytes a S3 ({sz_mb:.2f} MB)...", end=" ", flush=True)
            with open(meta["local_path"], "rb") as fp:
                data_bytes = fp.read()
            
            subido_ok = False
            for intento in range(1, 5):
                try:
                    t0 = time.time()
                    r_put = requests.put(put_url, data=data_bytes, headers=put_headers, timeout=600)
                    t_el = time.time() - t0
                    if r_put.status_code in (200, 201):
                        print(f"OK ({t_el:.1f}s)")
                        subido_ok = True
                        break
                    else:
                        print(f"[Reintento {intento} HTTP {r_put.status_code}]", end=" ", flush=True)
                        time.sleep(3)
                except Exception as e_s3:
                    print(f"[Reintento {intento} por {e_s3.__class__.__name__}]", end=" ", flush=True)
                    time.sleep(5)
            
            if not subido_ok:
                print("ERROR: Fallo definitivo tras 4 intentos en S3.")
                sys.exit(1)
        else:
            print(f"  [=] Objeto binario ya existente en LFS S3.")

        if "verify" in actions:
            ver_info = actions["verify"]
            ver_url = ver_info["href"]
            ver_headers = {**obtener_headers_lfs(), **ver_info.get("header", {})}
            print("  [*] Verificando objeto con GitHub LFS...", end=" ", flush=True)
            r_ver = requests.post(ver_url, json={"oid": sha, "size": meta["size"]}, headers=ver_headers, timeout=30)
            if r_ver.status_code not in (200, 201):
                print(f"ERROR verify: HTTP {r_ver.status_code}")
                sys.exit(1)
            print("VERIFICADO OK")

    return punteros

def main():
    punteros_lfs = asegurar_y_subir_lfs()
    
    print("\n" + "=" * 80)
    print("FASE 2: CREACIÓN DE COMMITS Y DESPLIEGUE EN GITHUB MAIN")
    print("=" * 80)
    
    headers_api = obtener_headers_api()
    
    ref_url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}"
    r_ref = requests.get(ref_url, headers=headers_api, timeout=20)
    commit_sha = r_ref.json()["object"]["sha"]
    print(f"[*] Commit base actual en '{BRANCH}': {commit_sha}")

    r_commit = requests.get(f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits/{commit_sha}", headers=headers_api, timeout=20)
    base_tree_sha = r_commit.json()["tree"]["sha"]
    print(f"[*] Base tree SHA: {base_tree_sha}")

    tree_entries = []

    # 1. Archivos de código
    for rel_path in ARCHIVOS_CODIGO:
        full_path = os.path.join(BASE_DIR, rel_path)
        if not os.path.exists(full_path):
            continue
        with open(full_path, "rb") as f:
            data = f.read()
        blob_sha = crear_blob(data)
        tree_entries.append({
            "path": rel_path.replace("\\", "/"),
            "mode": "100644",
            "type": "blob",
            "sha": blob_sha
        })
        print(f"  [+] Código {rel_path} -> {blob_sha[:8]}")

    # 2. Punteros Git LFS (132 bytes estándar)
    for rel_path, ptr_content in punteros_lfs.items():
        ptr_bytes = ptr_content.encode("utf-8")
        blob_sha = crear_blob(ptr_bytes)
        tree_entries.append({
            "path": rel_path.replace("\\", "/"),
            "mode": "100644",
            "type": "blob",
            "sha": blob_sha
        })
        print(f"  [+] Puntero LFS {rel_path} -> {blob_sha[:8]}")

    # 3. Crear Tree
    print("\n[*] Creando Tree en GitHub...", flush=True)
    tree_url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees"
    payload_tree = {
        "base_tree": base_tree_sha,
        "tree": tree_entries
    }
    r_tree = requests.post(tree_url, json=payload_tree, headers=headers_api, timeout=30)
    if r_tree.status_code != 201:
        raise Exception(f"Error creando tree: HTTP {r_tree.status_code} - {r_tree.text}")
    new_tree_sha = r_tree.json()["sha"]
    print(f"[*] Nuevo Tree SHA: {new_tree_sha}")

    # 4. Crear Commit
    mensaje = "feat(geofabrik-rm): integrar extracto oficial de Geofabrik con filtro regional e indices espaciales (Geofabrik, local-api)\n\n- Filtro espacial oficial con region_rm_base_5360_sirgas.shp sobre chile-260927.osm.pbf.\n- Generacion de geodatabase regional data/geodatabase_osm_rm_geofabrik.gpkg con indices R-Tree.\n- Generacion de las 10 capas tematicas locales en data/ y src/data/ con indice de Bbox por feature.\n- Fuente acreditada explicitamente como (Geofabrik, local-api) en propiedades, metadatos y visor.\n- Aceleracion O(1) de recorte por pantalla en ModuloOSM.geometriaIntersecaBbox."

    r_new_commit = requests.post(
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits",
        json={"message": mensaje, "tree": new_tree_sha, "parents": [commit_sha]},
        headers=headers_api,
        timeout=30
    )
    if r_new_commit.status_code != 201:
        raise Exception(f"Error creando commit: HTTP {r_new_commit.status_code} - {r_new_commit.text}")
    new_commit_sha = r_new_commit.json()["sha"]
    print(f"[*] Nuevo Commit SHA: {new_commit_sha}")

    # 5. Actualizar ref
    r_update_ref = requests.patch(ref_url, json={"sha": new_commit_sha}, headers=headers_api, timeout=30)
    if r_update_ref.status_code != 200:
        raise Exception(f"Error actualizando ref: HTTP {r_update_ref.status_code} - {r_update_ref.text}")

    print(f"\n✅ ¡Rama '{BRANCH}' actualizada exitosamente al commit {new_commit_sha[:8]} en produccion!")

if __name__ == "__main__":
    main()
