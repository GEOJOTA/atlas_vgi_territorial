#!/usr/bin/env python3
"""
extractor_vgi.py
----------------
Herramienta de línea de comandos (CLI) para geógrafos e investigadores territoriales.
Permite descargar, normalizar y exportar capas de Información Geográfica Voluntaria (VGI)
desde OpenStreetMap (Overpass API) y GBIF para un Bounding Box o comuna de interés.

No requiere librerías externas (opera 100% con la biblioteca estándar de Python 3).

Uso:
  python3 scripts/extractor_vgi.py
  python3 scripts/extractor_vgi.py --categoria educacion --output-dir data/
  python3 scripts/extractor_vgi.py --bbox -70.6675 -33.4505 -70.6565 -33.4385
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import argparse
import csv
from datetime import datetime

# Rutas del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, "config", "config.json")

# Bbox por defecto: Barrio Brasil — Universidad Alberto Hurtado (Santiago Centro, Chile)
BBOX_DEFECTO = [-70.6675, -33.4505, -70.6565, -33.4385]

OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter"
]

# Manejo de certificados SSL en macOS
import ssl
try:
    SSL_CONTEXT = ssl._create_unverified_context()
except Exception:
    SSL_CONTEXT = None

FILTROS_CATEGORIAS = {
    "educacion": {
        "nombre": "Educación y Universidad",
        "filtro_osm": 'nwr["amenity"~"university|college|library|school"]({bbox}); nwr["building"="university"]({bbox});'
    },
    "servicios": {
        "nombre": "Servicios y Comercio",
        "filtro_osm": 'nwr["shop"]({bbox}); nwr["amenity"~"cafe|restaurant|bank|pharmacy|post_office"]({bbox});'
    },
    "transporte": {
        "nombre": "Movilidad y Transporte",
        "filtro_osm": 'node["railway"="station"]({bbox}); node["highway"="bus_stop"]({bbox}); way["highway"~"primary|secondary|tertiary|trunk"]({bbox});'
    },
    "movilidad_activa": {
        "nombre": "Movilidad Activa y Ciclovías",
        "filtro_osm": 'way["highway"="cycleway"]({bbox}); way["cycleway"]({bbox}); node["amenity"~"bicycle_parking|bicycle_rental"]({bbox});'
    },
    "espacio_publico": {
        "nombre": "Áreas Verdes y Plazas",
        "filtro_osm": 'nwr["leisure"~"park|playground|garden|pitch"]({bbox}); nwr["landuse"~"grass|village_green"]({bbox});'
    },
    "patrimonio": {
        "nombre": "Patrimonio y Cultura",
        "filtro_osm": 'nwr["historic"]({bbox}); nwr["heritage"]({bbox}); nwr["amenity"~"theatre|arts_centre|place_of_worship|museum"]({bbox});'
    },
    "accesibilidad": {
        "nombre": "Accesibilidad Universal",
        "filtro_osm": 'node["kerb"]({bbox}); node["highway"="crossing"]({bbox}); node["wheelchair"]({bbox});'
    },
    "biodiversidad": {
        "nombre": "Biodiversidad Urbana (Arbolado)",
        "filtro_osm": 'nwr["natural"~"tree|wood|scrub"]({bbox});'
    }
}

def consultar_overpass(cuerpo_ql, bbox):
    oeste, sur, este, norte = bbox
    bbox_str = f"{sur},{oeste},{norte},{este}"
    filtro_reemplazado = cuerpo_ql.replace("{bbox}", bbox_str)
    
    query = f"""
    [out:json][timeout:35];
    (
      {filtro_reemplazado}
    );
    out center tags qt 350;
    """
    
    data_encoded = urllib.parse.urlencode({"data": query}).encode("utf-8")
    
    for srv in OVERPASS_SERVERS:
        try:
            req = urllib.request.Request(srv, data=data_encoded, headers={"User-Agent": "AtlasVGI-UAH-Practica/1.0"})
            with urllib.request.urlopen(req, timeout=40, context=SSL_CONTEXT) as res:
                if res.status == 200:
                    datos = json.loads(res.read().decode("utf-8"))
                    return datos.get("elements", [])
        except Exception as e:
            print(f"  [!] Falló servidor Overpass {srv}: {e}. Probando espejo...")
            continue
    return []

def consultar_gbif(bbox, limite=50):
    oeste, sur, este, norte = bbox
    params = urllib.parse.urlencode({
        "limit": str(limite),
        "hasCoordinate": "true",
        "decimalLatitude": f"{sur},{norte}",
        "decimalLongitude": f"{oeste},{este}"
    })
    url = f"https://api.gbif.org/v1/occurrence/search?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AtlasVGI-UAH-Practica/1.0"})
        with urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT) as res:
            if res.status == 200:
                datos = json.loads(res.read().decode("utf-8"))
                return datos.get("results", [])
    except Exception as e:
        print(f"  [!] Error al consultar GBIF: {e}")
    return []

def normalizar_elementos(elementos, categoria_id):
    features = []
    filas_csv = []
    
    for el in elementos:
        lat = el.get("lat") or (el.get("center", {}).get("lat") if "center" in el else None)
        lon = el.get("lon") or (el.get("center", {}).get("lon") if "center" in el else None)
        if not lat or not lon:
            continue
            
        tags = el.get("tags", {})
        nombre = tags.get("name") or tags.get("name:es") or tags.get("description") or "Sin denominación"
        subtipo = tags.get("amenity") or tags.get("shop") or tags.get("highway") or tags.get("leisure") or tags.get("historic") or "VGI"
        operador = tags.get("operator", "")
        direccion = f"{tags.get('addr:street', '')} {tags.get('addr:housenumber', '')}".strip()
        accesibilidad = tags.get("wheelchair", "")
        el_id = f"{el.get('type')}/{el.get('id')}"
        
        feat = {
            "type": "Feature",
            "id": el_id,
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {
                "id_vgi": f"OSM/{el_id}",
                "categoria": categoria_id,
                "subtipo": subtipo,
                "nombre": nombre,
                "operador": operador,
                "direccion": direccion,
                "accesibilidad": accesibilidad,
                "fuente": "OpenStreetMap",
                "fecha": el.get("timestamp", datetime.now().strftime("%Y-%m-%d")),
                "licencia": "ODbL 1.0"
            }
        }
        features.append(feat)
        filas_csv.append([
            f"OSM/{el_id}", categoria_id, subtipo, nombre, operador, direccion, accesibilidad,
            "OpenStreetMap", el.get("timestamp", datetime.now().strftime("%Y-%m-%d")), "ODbL 1.0", lat, lon
        ])
        
    return features, filas_csv

def main():
    parser = argparse.ArgumentParser(description="Extractor VGI territorial para geografía y gestión urbana.")
    parser.add_argument("--bbox", nargs=4, type=float, default=BBOX_DEFECTO, help="Oeste Sur Este Norte (EPSG:4326)")
    parser.add_argument("--categoria", type=str, choices=list(FILTROS_CATEGORIAS.keys()) + ["todas"], default="todas", help="Categoría temática a descargar")
    parser.add_argument("--output-dir", type=str, default=os.path.join(BASE_DIR, "data"), help="Directorio de exportación")
    args = parser.parse_args()
    
    os.makedirs(args.output_dir, exist_ok=True)
    bbox = args.bbox
    print("==========================================================================")
    print("   EXTRACTOR TERRITORIAL VGI — ATLAS BARRIO BRASIL & UAH (CHILE)")
    print("==========================================================================")
    print(f"[*] Bbox: {bbox}")
    print(f"[*] Carpeta destino: {args.output_dir}\n")
    
    categorias_a_procesar = list(FILTROS_CATEGORIAS.keys()) if args.categoria == "todas" else [args.categoria]
    
    todas_filas_csv = []
    features_totales = []
    
    for cat_id in categorias_a_procesar:
        info_cat = FILTROS_CATEGORIAS[cat_id]
        print(f"[>] Procesando {cat_id}: '{info_cat['nombre']}'...")
        
        elementos_osm = consultar_overpass(info_cat["filtro_osm"], bbox)
        feats, filas = normalizar_elementos(elementos_osm, cat_id)
        
        # Si es biodiversidad, agregamos además registros de GBIF
        if cat_id == "biodiversidad":
            print("    Consultando observaciones biológicas en GBIF...")
            regs_gbif = consultar_gbif(bbox, limite=40)
            for r in regs_gbif:
                lat = r.get("decimalLatitude")
                lon = r.get("decimalLongitude")
                if lat and lon:
                    esp = r.get("scientificName") or r.get("species") or "Especie indeterminada"
                    nom_c = r.get("vernacularName", "")
                    nombre_bio = f"{nom_c} ({esp})" if nom_c else esp
                    pub = r.get("institutionCode") or r.get("publishingOrgKey") or "GBIF/iNaturalist"
                    r_id = f"GBIF/{r.get('key')}"
                    feats.append({
                        "type": "Feature",
                        "id": r_id,
                        "geometry": {"type": "Point", "coordinates": [lon, lat]},
                        "properties": {
                            "id_vgi": r_id,
                            "categoria": "biodiversidad",
                            "subtipo": "Registro Biológico",
                            "nombre": nombre_bio,
                            "operador": pub,
                            "direccion": "",
                            "accesibilidad": "",
                            "fuente": "GBIF / iNaturalist",
                            "fecha": (r.get("eventDate") or "")[:10],
                            "licencia": r.get("license", "CC-BY 4.0")
                        }
                    })
                    filas.append([
                        r_id, "biodiversidad", "Registro Biológico", nombre_bio, pub, "", "",
                        "GBIF / iNaturalist", (r.get("eventDate") or "")[:10], r.get("license", "CC-BY 4.0"), lat, lon
                    ])
                    
        print(f"    [+] {len(feats)} entidades extraídas y normalizadas.")
        features_totales.extend(feats)
        todas_filas_csv.extend(filas)
        
        # Guardar archivo GeoJSON por categoría
        ruta_geojson_cat = os.path.join(args.output_dir, f"capa_{cat_id}.geojson")
        fc_cat = {
            "type": "FeatureCollection",
            "name": f"AtlasVGI_{cat_id}",
            "features": feats
        }
        with open(ruta_geojson_cat, "w", encoding="utf-8") as f:
            json.dump(fc_cat, f, indent=2, ensure_ascii=False)
            
    # Guardar GeoJSON integral
    ruta_integral = os.path.join(args.output_dir, "atlas_vgi_barrio_brasil_uah_completo.geojson")
    fc_integral = {
        "type": "FeatureCollection",
        "name": "AtlasVGI_BarrioBrasil_UAH_Completo",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features_totales
    }
    with open(ruta_integral, "w", encoding="utf-8") as f:
        json.dump(fc_integral, f, indent=2, ensure_ascii=False)
    print(f"\n[+] Capa GeoJSON integral generada: {ruta_integral}")
    
    # Guardar CSV resumen
    ruta_csv = os.path.join(args.output_dir, "resumen_catastro_vgi.csv")
    with open(ruta_csv, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id_vgi", "categoria", "subtipo", "nombre", "operador", "direccion", "accesibilidad",
            "fuente", "fecha_registro", "licencia", "latitud", "longitud"
        ])
        writer.writerows(todas_filas_csv)
    print(f"[+] Tabla normalizada CSV generada: {ruta_csv}")
    print("\n[OK] Extracción territorial completada exitosamente.")

if __name__ == "__main__":
    main()
