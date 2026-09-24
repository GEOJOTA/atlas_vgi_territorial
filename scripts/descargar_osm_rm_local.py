#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/descargar_osm_rm_local.py
---------------------------------
Descarga e indexa la totalidad de las geometrías de OpenStreetMap (OSM) para la Región Metropolitana.
Clasifica cada entidad en una de las 10 Macro-Categorías VGI del Atlas:
  - CAT-01: Educación y Universidad
  - CAT-02: Servicios y Comercio Barrial
  - CAT-03: Movilidad y Transporte Público
  - CAT-04: Movilidad Activa y Ciclovías
  - CAT-05: Áreas Verdes, Deporte y Espacio Público
  - CAT-06: Patrimonio Histórico y Cultura
  - CAT-07: Accesibilidad Universal y Caminabilidad
  - CAT-08: Biodiversidad Urbana y Arbolado
  - CAT-09: Edificaciones y Huella Urbana
  - CAT-10: Coberturas y Usos de Suelo

Genera archivos GeoJSON offline en data/ y src/data/ para permitir fallback local instantáneo
cuando la API de Overpass esté saturada o no disponible.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
import ssl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
SRC_DATA_DIR = os.path.join(BASE_DIR, "src", "data")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SRC_DATA_DIR, exist_ok=True)

try:
    SSL_CTX = ssl._create_unverified_context()
except Exception:
    SSL_CTX = None

OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter"
]

# Bounding Box Región Metropolitana ampliado: [south, west, north, east]
BBOX_RM = "-33.95,-71.55,-33.00,-70.15"
# Bounding Box Barrio Brasil / UAH / Santiago Centro para descargas de alta densidad
BBOX_BRASIL = "-33.4600,-70.6800,-33.4300,-70.6400"

CATEGORIAS_VGI = [
    {
        "id": "educacion",
        "codigo": "CAT-01",
        "nombre": "Educación y Universidad",
        "query": f'nwr["amenity"~"university|college|library|school|kindergarten|student_accommodation|research_institute|music_school|training_centre"]({BBOX_RM}); nwr["building"~"university|school|college|kindergarten|library"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat01_educacion.geojson"
    },
    {
        "id": "servicios",
        "codigo": "CAT-02",
        "nombre": "Servicios y Comercio Barrial",
        "query": f'nwr["shop"]({BBOX_BRASIL}); nwr["amenity"~"cafe|restaurant|bar|fast_food|pub|pharmacy|clinic|doctors|dentist|veterinary|bank|atm|post_office|marketplace|police|fire_station|townhall|community_centre|recycling|waste_basket|laundry|hairdresser|car_wash|fuel|cinema"]({BBOX_RM}); nwr["emergency"~"ambulance_station|defibrillator|fire_hydrant"]({BBOX_RM}); nwr["man_made"="surveillance"]({BBOX_BRASIL}); nwr["office"="government"]({BBOX_RM}); node["highway"="street_lamp"]({BBOX_BRASIL}); nwr["building"~"retail|commercial|supermarket"]({BBOX_BRASIL});',
        "archivo": "capa_osm_rm_cat02_servicios.geojson"
    },
    {
        "id": "transporte",
        "codigo": "CAT-03",
        "nombre": "Movilidad y Transporte",
        "query": f'node["highway"="bus_stop"]({BBOX_RM}); node["railway"~"station|subway_entrance|halt"]({BBOX_RM}); node["public_transport"~"platform|stop_position"]({BBOX_RM}); way["highway"~"primary|secondary|tertiary|trunk|motorway"]({BBOX_RM}); way["railway"~"subway|rail|tram"]({BBOX_RM}); nwr["amenity"~"bus_station|ferry_terminal|taxi"]({BBOX_RM}); node["vending"="public_transport_tickets"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat03_transporte.geojson"
    },
    {
        "id": "movilidad_activa",
        "codigo": "CAT-04",
        "nombre": "Movilidad Activa y Ciclovías",
        "query": f'way["highway"="cycleway"]({BBOX_RM}); way["cycleway"]({BBOX_RM}); way["cycleway:left"]({BBOX_RM}); way["cycleway:right"]({BBOX_RM}); way["cycleway:both"]({BBOX_RM}); way["highway"~"footway|path"]["bicycle"~"yes|designated"]({BBOX_RM}); nwr["amenity"~"bicycle_parking|bicycle_rental|bicycle_repair_station|charging_station"]({BBOX_RM}); nwr["shop"="bicycle"]({BBOX_RM}); way["highway"~"living_street|pedestrian"]({BBOX_RM}); node["highway"="speed_display"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat04_movilidad_activa.geojson"
    },
    {
        "id": "espacio_publico",
        "codigo": "CAT-05",
        "nombre": "Áreas Verdes y Espacio Público",
        "query": f'nwr["leisure"~"park|playground|garden|pitch|sports_centre|fitness_station|stadium|track|dog_park"]({BBOX_RM}); nwr["landuse"~"grass|village_green|recreation_ground|cemetery"]({BBOX_RM}); node["amenity"~"bench|drinking_water|fountain|waste_basket"]({BBOX_BRASIL});',
        "archivo": "capa_osm_rm_cat05_espacio_publico.geojson"
    },
    {
        "id": "patrimonio",
        "codigo": "CAT-06",
        "nombre": "Patrimonio y Cultura",
        "query": f'nwr["historic"]({BBOX_RM}); nwr["heritage"]({BBOX_RM}); nwr["building"~"church|cathedral|chapel|shrine|temple|monastery"]({BBOX_RM}); nwr["amenity"~"theatre|arts_centre|place_of_worship|museum|community_centre|events_venue|cinema"]({BBOX_RM}); nwr["tourism"~"museum|artwork|gallery|attraction|monument|memorial"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat06_patrimonio.geojson"
    },
    {
        "id": "accesibilidad",
        "codigo": "CAT-07",
        "nombre": "Accesibilidad Universal",
        "query": f'node["kerb"]({BBOX_BRASIL}); node["highway"="crossing"]({BBOX_RM}); node["tactile_paving"]({BBOX_BRASIL}); node["traffic_signals:sound"="yes"]({BBOX_BRASIL}); node["highway"="traffic_signals"]({BBOX_RM}); nwr["wheelchair"]({BBOX_BRASIL}); way["highway"~"footway|pedestrian"]({BBOX_BRASIL}); way["highway"="steps"]["ramp"~"yes|separate"]({BBOX_RM}); way["ramp"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat07_accesibilidad.geojson"
    },
    {
        "id": "biodiversidad",
        "codigo": "CAT-08",
        "nombre": "Biodiversidad Urbana",
        "query": f'node["natural"="tree"]({BBOX_BRASIL}); way["natural"="tree_row"]({BBOX_RM}); nwr["natural"~"wood|scrub|heath|grassland"]({BBOX_RM}); nwr["genus"~"Platanus|Jacaranda|Jubaea|Schinus|Quillaja"]({BBOX_RM}); nwr["leisure"="garden"]({BBOX_RM}); nwr["landuse"="forest"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat08_biodiversidad.geojson"
    },
    {
        "id": "edificaciones",
        "codigo": "CAT-09",
        "nombre": "Edificaciones y Huella Urbana",
        "query": f'way["building"]({BBOX_BRASIL}); relation["building"]({BBOX_BRASIL});',
        "archivo": "capa_osm_rm_cat09_edificaciones.geojson"
    },
    {
        "id": "cobertura_suelo",
        "codigo": "CAT-10",
        "nombre": "Coberturas y Usos de Suelo",
        "query": f'nwr["landuse"]({BBOX_BRASIL}); nwr["natural"~"wood|scrub|water|grassland|tree_row"]({BBOX_RM}); nwr["waterway"]({BBOX_RM});',
        "archivo": "capa_osm_rm_cat10_cobertura_suelo.geojson"
    }
]

def ejecutar_query_overpass(q_body):
    full_q = f"[out:json][timeout:180];\n(\n{q_body}\n);\nout body geom;\n"
    data_bytes = f"data={urllib.parse.quote(full_q)}".encode("utf-8")
    
    for srv in OVERPASS_SERVERS:
        try:
            req = urllib.request.Request(srv, data=data_bytes, headers={"User-Agent": "AtlasVGI_UAH/2026"})
            with urllib.request.urlopen(req, context=SSL_CTX, timeout=120) as resp:
                raw = resp.read().decode("utf-8")
                res = json.loads(raw)
                elems = res.get("elements", [])
                if elems:
                    return elems
        except Exception as e:
            print(f"    [!] Error en servidor {srv}: {e}")
            time.sleep(1)
    return []

def elemento_a_feature(el, cat_info):
    el_type = el.get("type", "node")
    el_id = el.get("id")
    tags = el.get("tags", {})
    
    id_vgi = f"OSM/{el_type}/{el_id}"
    
    geom = None
    if el_type == "node":
        if "lon" in el and "lat" in el:
            geom = {"type": "Point", "coordinates": [round(el["lon"], 5), round(el["lat"], 5)]}
    elif el_type in ("way", "relation"):
        bounds = el.get("bounds")
        geometry_pts = el.get("geometry", [])
        if geometry_pts:
            coords = [[round(p["lon"], 5), round(p["lat"], 5)] for p in geometry_pts if "lon" in p and "lat" in p]
            if len(coords) >= 3 and coords[0] == coords[-1]:
                geom = {"type": "Polygon", "coordinates": [coords]}
            elif len(coords) >= 2:
                geom = {"type": "LineString", "coordinates": coords}
            elif len(coords) == 1:
                geom = {"type": "Point", "coordinates": coords[0]}
        elif bounds:
            c_lon = (bounds["minlon"] + bounds["maxlon"]) / 2.0
            c_lat = (bounds["minlat"] + bounds["maxlat"]) / 2.0
            geom = {"type": "Point", "coordinates": [round(c_lon, 5), round(c_lat, 5)]}

    if not geom:
        return None

    name = tags.get("name") or tags.get("official_name") or tags.get("alt_name") or tags.get("operator") or tags.get("ref") or f"{cat_info['nombre']} {el_id}"
    subtype = tags.get("amenity") or tags.get("shop") or tags.get("highway") or tags.get("building") or tags.get("leisure") or tags.get("historic") or tags.get("landuse") or tags.get("natural") or "elemento_urbano"
    
    props = {
        "id_vgi": id_vgi,
        "categoria": cat_info["codigo"],
        "nombre": name,
        "subtipo": subtype,
        "operador": tags.get("operator", ""),
        "direccion": f"{tags.get('addr:street', '')} {tags.get('addr:housenumber', '')}".strip(),
        "accesibilidad": tags.get("wheelchair", "desconocido"),
        "fuente": "OpenStreetMap Contributors (ODbL 1.0)",
        "licencia": "ODbL 1.0",
        "osm_id": el_id,
        "osm_type": el_type
    }
    
    # Preservar todas las llaves secundarias importantes
    for k, v in tags.items():
        clean_k = k.replace(":", "_")
        if clean_k not in props:
            props[clean_k] = str(v)

    return {
        "type": "Feature",
        "properties": props,
        "geometry": geom
    }

def main():
    print("=" * 80)
    print("EXTRACTOR Y NODO LOCAL OSM — REGIÓN METROPOLITANA DE SANTIAGO")
    print("=" * 80)
    
    todas_las_features = []
    inventario_descargas = []
    
    for idx, cat in enumerate(CATEGORIAS_VGI, 1):
        print(f"[{idx}/10] Procesando {cat['codigo']}: {cat['nombre']}...")
        elems = ejecutar_query_overpass(cat["query"])
        
        feats = []
        for el in elems:
            f = elemento_a_feature(el, cat)
            if f:
                feats.append(f)
                todas_las_features.append(f)
                
        fc = {
            "type": "FeatureCollection",
            "name": cat["archivo"].replace(".geojson", ""),
            "metadata": {
                "categoria": cat["codigo"],
                "nombre_categoria": cat["nombre"],
                "total_entidades": len(feats),
                "fuente": "OpenStreetMap (Overpass API / Extraído para Región Metropolitana)",
                "fecha_actualizacion": time.strftime("%Y-%m-%d %H:%M:%S")
            },
            "features": feats
        }
        
        # Guardar en data/ y src/data/
        out_p1 = os.path.join(DATA_DIR, cat["archivo"])
        out_p2 = os.path.join(SRC_DATA_DIR, cat["archivo"])
        
        with open(out_p1, "w", encoding="utf-8") as f:
            json.dump(fc, f, ensure_ascii=False, separators=(',', ':'))
            
        with open(out_p2, "w", encoding="utf-8") as f:
            json.dump(fc, f, ensure_ascii=False, separators=(',', ':'))
            
        peso_mb = os.path.getsize(out_p1) / (1024 * 1024)
        print(f"    [OK] {cat['archivo']}: {len(feats):,} entidades ({peso_mb:.2f} MB)")
        inventario_descargas.append({"categoria": cat["codigo"], "entidades": len(feats), "peso_mb": round(peso_mb, 2)})
        time.sleep(1)

    # Consolidar capa maestra offline completa
    print("\n[+] Generando capa maestra offline consolidada (capa_osm_rm_completo_vgi.geojson)...")
    fc_maestra = {
        "type": "FeatureCollection",
        "name": "capa_osm_rm_completo_vgi",
        "metadata": {
            "descripcion": "Base de datos vectoriales integrales de OpenStreetMap para la Región Metropolitana de Santiago (10 Macro-Categorías VGI). Usada para fallback local instantáneo ante saturación de Overpass API.",
            "total_entidades": len(todas_las_features),
            "fuente": "OpenStreetMap Contributors (ODbL 1.0)",
            "fecha_extraccion": time.strftime("%Y-%m-%d %H:%M:%S")
        },
        "features": todas_las_features
    }
    
    m_p1 = os.path.join(DATA_DIR, "capa_osm_rm_completo_vgi.geojson")
    m_p2 = os.path.join(SRC_DATA_DIR, "capa_osm_rm_completo_vgi.geojson")
    
    with open(m_p1, "w", encoding="utf-8") as f:
        json.dump(fc_maestra, f, ensure_ascii=False, separators=(',', ':'))
        
    with open(m_p2, "w", encoding="utf-8") as f:
        json.dump(fc_maestra, f, ensure_ascii=False, separators=(',', ':'))

    print(f"    [OK] capa_osm_rm_completo_vgi.geojson: {len(todas_las_features):,} entidades en total ({os.path.getsize(m_p1)/(1024*1024):.2f} MB)")
    print("=" * 80)
    print("Descarga local completada con éxito para las 10 macro-categorías VGI.")

if __name__ == "__main__":
    main()
