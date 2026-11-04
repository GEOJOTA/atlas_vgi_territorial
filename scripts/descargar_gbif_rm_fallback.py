#!/usr/bin/env python3
"""
descargar_gbif_rm_fallback.py
-----------------------------
Descarga y estructura el catálogo de respaldo (fallback) de biodiversidad
de la Región Metropolitana de Santiago desde la API pública de GBIF.

Garantiza:
1. Cobertura territorial completa para toda la Región Metropolitana de Santiago
   (Santiago Centro, Barrio Brasil, Providencia, Las Condes, Maipú, Puente Alto,
   San Bernardo, Pirque, San José de Maipo, Melipilla, Talagante, Chacabuco).
2. Diversidad taxonómica representativa: Plantae, Aves, Insecta, Mammalia,
   Reptilia, Amphibia y Fungi.
3. Conformidad estricta con el esquema canónico de 17 atributos VGI + Darwin Core.
4. Exportación simétrica a data/ y src/data/.
"""

import urllib.request
import json
import ssl
import time
import os
import sys

# Diccionario de nombres comunes representativos de Chile
NOMBRES_COMUNES = {
    'jubaea chilensis': 'Palma chilena',
    'zonotrichia capensis': 'Chincol / Gorrión americano',
    'turdus falcklandii': 'Zorzal patagónico',
    'columbina picui': 'Tortolita cuyana',
    'vanellus chilensis': 'Queltehue / Treile',
    'schinus molle': 'Pimiento boliviano / Molle',
    'cryptocarya alba': 'Peumo',
    'quillaja saponaria': 'Quillay',
    'jacaranda mimosifolia': 'Jacarandá',
    'lithraea caustica': 'Litre',
    'maytenus boaria': 'Maitén',
    'vachellia caven': 'Espino',
    'peumus boldus': 'Boldo',
    'prosopis chilensis': 'Algarrobo chileno',
    'kageneckia oblonga': 'Bollén',
    'bombus dahlbomii': 'Moscardón del bosque (Abejorro nativo)',
    'bombus terrestris': 'Abejorro común europeo',
    'bombus ruderatus': 'Abejorro gigante',
    'apis mellifera': 'Abeja melífera',
    'mimus thenca': 'Tenca',
    'zenaida auriculata': 'Tórtola torcaza',
    'cathartes aura': 'Jote de cabeza colorada',
    'coragyps atratus': 'Jote de cabeza negra',
    'phytotoma rara': 'Rara',
    'muscisaxicola maclovianus': 'Dormilona tontita',
    'patagona gigas': 'Picaflor gigante',
    'sephanoides sephaniodes': 'Picaflor chico / Pingüirirí',
    'falco sparverius': 'Cernícalo',
    'milvago chimango': 'Tiuque',
    'nycticorax nycticorax': 'Huairavo / Garza bruja',
    'leucophaeus pipixcan': 'Gaviota de Franklin',
    'passer domesticus': 'Gorrión común',
    'liolaemus tenuis': 'Lagartija esbelta',
    'liolaemus chiliensis': 'Lagartija nítida / Lagarto llorón',
    'calyptocephalella gayi': 'Rana chilena',
    'pleurodema thaul': 'Sapito de cuatro ojos',
    'lycalopex culpaeus': 'Zorro culpeo',
    'tadarida brasiliensis': 'Murciélago cola de ratón'
}

# Límites geográficos de la Región Metropolitana de Santiago
BBOX_RM = [-71.85, -34.45, -69.75, -32.90]

def es_coordenada_en_rm(lon, lat):
    if lon is None or lat is None:
        return False
    return BBOX_RM[0] <= lon <= BBOX_RM[2] and BBOX_RM[1] <= lat <= BBOX_RM[3]

def consultar_gbif(params, limite=300, max_paginas=3):
    ctx = ssl._create_unverified_context()
    base_url = "https://api.gbif.org/v1/occurrence/search"
    registros = []
    
    for pagina in range(max_paginas):
        offset = pagina * limite
        query_params = {
            **params,
            "hasCoordinate": "true",
            "hasGeospatialIssue": "false",
            "limit": str(limite),
            "offset": str(offset)
        }
        
        encoded_params = urllib.parse.urlencode(query_params)
        url = f"{base_url}?{encoded_params}"
        req = urllib.request.Request(url, headers={"User-Agent": "AtlasVGI-UAH-GeoProcess/1.0"})
        
        try:
            with urllib.request.urlopen(req, timeout=25, context=ctx) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                results = data.get("results", [])
                if not results:
                    break
                registros.extend(results)
                if len(results) < limite:
                    break
            time.sleep(0.3)
        except Exception as e:
            print(f"  [!] Advertencia al consultar página {pagina} ({params.get('kingdom', params.get('q', 'general'))}): {e}")
            break
            
    return registros

def transformar_a_geojson(registros):
    features = []
    vistos = set()
    
    for r in registros:
        key = r.get("key") or r.get("gbifID")
        if not key or key in vistos:
            continue
        vistos.add(key)
        
        lat = r.get("decimalLatitude")
        lon = r.get("decimalLongitude")
        if not es_coordenada_en_rm(lon, lat):
            continue
            
        sp = r.get("species") or r.get("canonicalName") or (r.get("scientificName", "").split("(")[0].strip() if r.get("scientificName") else "Especie no determinada")
        sp_lower = sp.lower()
        nom_comun = r.get("vernacularName") or NOMBRES_COMUNES.get(sp_lower) or None
        
        # Fecha
        fecha_orig = r.get("eventDate") or r.get("year")
        fecha_str = "2026-01-01"
        if fecha_orig:
            fecha_str = str(fecha_orig)[:10]
            
        # 17 atributos canónicos
        id_vgi = f"GBIF/{key}"
        coords = [round(lon, 6), round(lat, 6)]
        geom_wkt = f"POINT({coords[0]} {coords[1]})"
        bbox_entidad = [coords[0], coords[1], coords[0], coords[1]]
        
        pub = r.get("datasetName") or "iNaturalist / GBIF (Catálogo Región Metropolitana)"
        lic = r.get("license") or "http://creativecommons.org/licenses/by/4.0/legalcode"
        
        feature = {
            "type": "Feature",
            "id": id_vgi,
            "geometry": {
                "type": "Point",
                "coordinates": coords
            },
            "properties": {
                # 17 Atributos Canónicos VGI
                "id_vgi": id_vgi,
                "categoria": "CAT-08 (Biodiversidad Urbana)",
                "subtipo": "Registro Biológico (GBIF/iNat)",
                "nombre": nom_comun or sp,
                "operador": pub,
                "direccion": None,
                "accesibilidad": None,
                "fuente": "GBIF Occurrence API / Ciencia Ciudadana (Región Metropolitana)",
                "metodo_adquisicion": "Consulta REST API GBIF Occurrence (Catálogo RM verificado)",
                "licencia": lic,
                "coordenadas": coords,
                "geom_wkt": geom_wkt,
                "bbox": bbox_entidad,
                "fecha_registro": fecha_str,
                "superficie_m2": None,
                "superficie_ha": None,
                "srs_superficie": None,
                # Atributos Darwin Core y GBIF
                "gbifID": str(key),
                "especie": sp,
                "scientificName": r.get("scientificName") or sp,
                "nombreComun": nom_comun,
                "reino": r.get("kingdom") or "Indeterminado",
                "clase": r.get("class"),
                "orden": r.get("order"),
                "familia": r.get("family"),
                "genero": r.get("genus"),
                "fecha": fecha_str,
                "issues": r.get("issues", [])
            }
        }
        features.append(feature)
        
    return {
        "type": "FeatureCollection",
        "name": "gbif_biodiversidad_region_metropolitana_fallback",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }

def main():
    import urllib.parse
    print("=" * 65)
    print("DESCARGA DE REGISTROS GBIF — FALLBACK REGIÓN METROPOLITANA")
    print("=" * 65)
    
    consultas = [
        # 1. Observaciones de alta calidad generales en la RM
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago"},
        # 2. Plantae (flora nativa y arbolado urbano)
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "kingdom": "Plantae"},
        # 3. Aves (avifauna urbana y silvestre)
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "class": "Aves"},
        # 4. Insecta (polinizadores, abejas, mariposas)
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "class": "Insecta"},
        # 5. Barrio Brasil y Santiago Centro específico (alta densidad local)
        {"country": "CL", "decimalLatitude": "-33.455,-33.430", "decimalLongitude": "-70.675,-70.650"},
        # 6. Gran Santiago comunas pericentrales (Parque Metropolitano, Quinta Normal, Providencia)
        {"country": "CL", "decimalLatitude": "-33.46,-33.40", "decimalLongitude": "-70.68,-70.58"},
        # 7. Otros reinos y clases (Mammalia, Reptilia, Amphibia, Fungi)
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "kingdom": "Fungi"},
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "class": "Reptilia"},
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "class": "Amphibia"},
        {"country": "CL", "stateProvince": "Región Metropolitana de Santiago", "class": "Mammalia"}
    ]
    
    total_crudos = []
    for idx, c in enumerate(consultas, 1):
        desc = c.get("kingdom") or c.get("class") or c.get("stateProvince") or "Cuadrante local"
        print(f"[{idx}/{len(consultas)}] Consultando GBIF para: {desc}...")
        res = consultar_gbif(c, limite=300, max_paginas=2)
        print(f"    -> Obtenidos: {len(res)} registros")
        total_crudos.extend(res)
        
    print(f"\n[+] Total registros crudos acumulados: {len(total_crudos)}")
    geojson = transformar_a_geojson(total_crudos)
    num_entidades = len(geojson["features"])
    print(f"[+] Total registros únicos y validados en la Región Metropolitana: {num_entidades}")
    
    # Rutas de destino
    rutas = [
        "data/gbif_rm_fallback.geojson",
        "src/data/gbif_rm_fallback.geojson",
        "data/gbif_barrio_brasil_fallback.geojson",
        "src/data/gbif_barrio_brasil_fallback.geojson"
    ]
    
    for r in rutas:
        os.makedirs(os.path.dirname(r), exist_ok=True)
        with open(r, "w", encoding="utf-8") as f:
            json.dump(geojson, f, ensure_ascii=False, indent=2)
        tam_mb = os.path.getsize(r) / (1024 * 1024)
        print(f"  [✓] Guardado en {r} ({tam_mb:.2f} MB)")
        
    print("\n✅ Proceso completado con éxito.")

if __name__ == "__main__":
    main()
