#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
procesar_censo2024_rm.py
-------------------------
Procesa, estandariza y exporta los 5 niveles escalares del Censo 2024 (Región Metropolitana)
desde los GeoPackages oficiales en 'Base de datos VGI/CENSO 2024' hacia GeoJSON estándar
EPSG:4326 (WGS84) para el Atlas VGI UAH.

Escalas generadas:
1. ide_censo2024_regional.geojson       -> Escala Regional RM (1 polígono)
2. ide_censo2024_limite_urbano.geojson  -> Escala Límites Urbanos Censales (106 polígonos)
3. ide_censo2024_localidades.geojson    -> Escala Localidades y Asentamientos (511 polígonos)
4. ide_censo2024_zonal.geojson          -> Escala Zonas y Distritos Censales (1.865 polígonos)
5. ide_censo2024_manzanas.geojson       -> Escala Manzanas Comuna de Santiago / Barrio Brasil (1.711 polígonos)
"""

import os
import sys
import json
import geopandas as gpd
import shapely

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CENSO_DIR = r"C:\Users\PT1261256\Desktop\16_09_2026\Base de datos VGI\CENSO 2024"
SRC_DATA_DIR = os.path.join(BASE_DIR, "src", "data")
ROOT_DATA_DIR = os.path.join(BASE_DIR, "data")

os.makedirs(SRC_DATA_DIR, exist_ok=True)
os.makedirs(ROOT_DATA_DIR, exist_ok=True)

def round_coords(geom, precision=6):
    if not geom:
        return geom
    coords = geom.get('coordinates')
    def _round(c):
        if isinstance(c, (float, int)):
            return round(c, precision)
        elif isinstance(c, list):
            return [_round(x) for x in c]
        return c
    geom['coordinates'] = _round(coords)
    return geom

def exportar_capa(gdf, nombre_archivo, descripcion, tolerance=0.0):
    print(f"\n[*] Procesando: {descripcion} ({len(gdf):,} entidades)...")
    
    # Asegurar proyección EPSG:4326 WGS84
    if gdf.crs is None or gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs(epsg=4326)
        
    # Limpiar geometrías no válidas si las hay
    gdf['geometry'] = gdf['geometry'].make_valid()
    
    # Simplificación topológica si se especifica
    if tolerance > 0:
        gdf['geometry'] = gdf['geometry'].simplify(tolerance, preserve_topology=True)
    
    # Exportar a GeoJSON y redondear coordenadas a 6 decimales (~10 cm de precisión)
    geojson_str = gdf.to_json(drop_id=True)
    d = json.loads(geojson_str)
    for feat in d.get('features', []):
        feat['geometry'] = round_coords(feat.get('geometry'), 6)
    
    # Guardar en src/data y en data/ con separadores compactos
    for dest_dir in [SRC_DATA_DIR, ROOT_DATA_DIR]:
        dest_path = os.path.join(dest_dir, nombre_archivo)
        with open(dest_path, 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
        peso_mb = os.path.getsize(dest_path) / (1024 * 1024)
        print(f"    -> Guardado en {dest_path} ({peso_mb:.2f} MB)")
        
    return len(gdf), [float(gdf.total_bounds[0]), float(gdf.total_bounds[1]), float(gdf.total_bounds[2]), float(gdf.total_bounds[3])]

def main():
    print("=" * 80)
    print("PROCESAMIENTO MULTIESCALAR CENSO 2024 — REGIÓN METROPOLITANA")
    print("=" * 80)
    
    resumen = {}
    
    # 1. ESCALA REGIONAL (RM)
    path_reg = os.path.join(CENSO_DIR, "RM_Region.gpkg")
    gdf_reg = gpd.read_file(path_reg)
    cnt, bbox = exportar_capa(gdf_reg, "ide_censo2024_regional.geojson", "Escala 1: Marco Regional RM", tolerance=0.00003)
    resumen["censo2024_regional"] = {"count": cnt, "bbox": bbox, "file": "ide_censo2024_regional.geojson"}
    
    # 2. ESCALA LÍMITES URBANOS CENSALES
    path_urb = os.path.join(CENSO_DIR, "RM_Limite_Urbano.gpkg")
    gdf_urb = gpd.read_file(path_urb)
    cnt, bbox = exportar_capa(gdf_urb, "ide_censo2024_limite_urbano.geojson", "Escala 2: Límites Urbanos Censales RM", tolerance=0.00002)
    resumen["censo2024_limite_urbano"] = {"count": cnt, "bbox": bbox, "file": "ide_censo2024_limite_urbano.geojson"}
    
    # 3. ESCALA LOCALIDADES Y ASENTAMIENTOS
    path_loc = os.path.join(CENSO_DIR, "RM_Localidades.gpkg")
    gdf_loc = gpd.read_file(path_loc)
    cnt, bbox = exportar_capa(gdf_loc, "ide_censo2024_localidades.geojson", "Escala 3: Localidades y Asentamientos RM", tolerance=0.00002)
    resumen["censo2024_localidades"] = {"count": cnt, "bbox": bbox, "file": "ide_censo2024_localidades.geojson"}
    
    # 4. ESCALA ZONAS Y DISTRITOS CENSALES
    path_zon = os.path.join(CENSO_DIR, "RM_Zonal.gpkg")
    gdf_zon = gpd.read_file(path_zon)
    cnt, bbox = exportar_capa(gdf_zon, "ide_censo2024_zonal.geojson", "Escala 4: Zonas y Distritos Censales RM", tolerance=0.00002)
    resumen["censo2024_zonal"] = {"count": cnt, "bbox": bbox, "file": "ide_censo2024_zonal.geojson"}
    
    # 5. ESCALA MANZANAS CENSALES (COMUNA DE SANTIAGO / BARRIO BRASIL)
    path_mnz = os.path.join(CENSO_DIR, "RM_Manzanas.gpkg")
    # Filtrar para la Comuna de Santiago (sede de Barrio Brasil y Campus UAH)
    gdf_mnz = gpd.read_file(path_mnz, where="COMUNA = 'SANTIAGO'")
    cnt, bbox = exportar_capa(gdf_mnz, "ide_censo2024_manzanas.geojson", "Escala 5: Manzanas Censales (Comuna de Santiago / Barrio Brasil)", tolerance=0.0)
    resumen["censo2024_manzanas"] = {"count": cnt, "bbox": bbox, "file": "ide_censo2024_manzanas.geojson"}
    
    print("\n" + "=" * 80)
    print("RESUMEN DE CAPAS GENERADAS")
    print("=" * 80)
    for k, v in resumen.items():
        print(f"[{k:25}] {v['count']:5} entidades | BBox: {[round(x, 4) for x in v['bbox']]} | {v['file']}")
        
    print("\n[+] Proceso completado exitosamente.")

if __name__ == "__main__":
    main()
