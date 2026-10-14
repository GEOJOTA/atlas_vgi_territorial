#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/empaquetar_base_datos_completa.py
-----------------------------------------
Genera el paquete comprimido oficial (.zip) de toda la base de datos del
Atlas de Información Geográfica Voluntaria (VGI) — Caso Barrio Brasil / UAH.

Estructura del paquete:
geodatabase_completa_atlas_vgi.zip
├── LEAME_PRIMERO_ATLAS_VGI.txt
├── INVENTARIO_BASE_DATOS.json
├── 01_vgi_comunitario_osm/
│   ├── atlas_vgi_barrio_brasil_uah_completo.geojson
│   └── capa_*.geojson (10 macro-categorías VGI)
├── 02_geofabrik_chile_rm/
│   ├── capa_osm_rm_cat01_educacion.geojson
│   ├── capa_osm_rm_cat06_patrimonio.geojson
│   ├── ENLACES_Y_METADATOS_GEOFABRIK.json
│   └── GUIA_IMPORTACION_GEOFABRIK_QGIS.md
├── 03_capas_oficiales_estado/
│   ├── ide_censo2024_*.geojson
│   ├── Areas_Verdes_MINVU_INE_2023.geojson
│   ├── ZCH_ICH_RM_Patrimonio_IPT.geojson
│   ├── semaforos_rm_uoct_2026.geojson
│   ├── capa_unidades_vecinales_bidat.geojson
│   ├── capa_antenas_subtel.geojson
│   ├── capa_areas_funcionales_urbanas.geojson
│   ├── bip_inversiones_santiago.csv
│   └── INVENTARIO_108_CAPAS_OFICIALES.json
├── 04_catalogos_matrices_excel/
│   ├── categorias_tematicas_osm.xlsx
│   ├── catalogo_fuentes_vgi.xlsx
│   └── perfil_metadatos_vgi.xlsx
└── 05_metadatos_y_gobernanza/
    ├── MANUAL_USO.md
    ├── INFORME_PROYECTO_ATLAS_VGI.md
    ├── ANALISIS_METACALIDAD.md
    ├── matriz_metacalidad.json
    ├── metadatos_iso19139_atlas_vgi.xml
    └── LICENSE
"""

import os
import sys
import json
import zipfile
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(BASE_DIR, "src")
DATA_DIR = os.path.join(SRC_DIR, "data")
DOCS_DIR = os.path.join(SRC_DIR, "docs")

OUTPUT_ZIP = os.path.join(SRC_DIR, "docs", "geodatabase_completa_atlas_vgi.zip")
MIRROR_ZIP = os.path.join(BASE_DIR, "docs", "geodatabase_completa_atlas_vgi.zip")

print("=" * 75)
print("EMPAQUETANDO BASE DE DATOS COMPLETA ATLAS VGI (.ZIP)")
print("=" * 75)

# 1. Crear LEAME_PRIMERO
LEAME_TEXT = """================================================================================
ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA (VGI) PARA LA GESTIÓN TERRITORIAL
CASO PILOTO: BARRIO BRASIL Y CAMPUS UNIVERSIDAD ALBERTO HURTADO (SANTIAGO, CHILE)
PROYECTO FONDECYT REGULAR F1261256 · DEPARTAMENTO DE GEOGRAFÍA UAH 2026
================================================================================

Este archivo comprimido (.zip) contiene la base de datos íntegra, normalizada y
multifuente desarrollada en el marco del Atlas VGI Territorial. Cualquier usuario,
investigador, funcionario municipal o colectivo comunitario puede acceder a todos
los datos de forma integrada y abierta.

--------------------------------------------------------------------------------
1. ESTRUCTURA DE CARPETAS Y CONTENIDOS
--------------------------------------------------------------------------------

01_vgi_comunitario_osm/
   Contiene las 10 Macro-categorías VGI del territorio piloto (Barrio Brasil y UAH):
   - CAT-01: Educación y Universidades (capa_educacion.geojson)
   - CAT-02: Salud y Servicios Comunitarios (capa_servicios.geojson)
   - CAT-03: Transporte y Movilidad (capa_transporte.geojson)
   - CAT-04: Movilidad Activa y Ciclovías (capa_movilidad_activa.geojson)
   - CAT-05: Áreas Verdes y Espacio Público (capa_espacio_publico.geojson)
   - CAT-06: Patrimonio y Memoria (capa_patrimonio.geojson)
   - CAT-07: Accesibilidad Universal (capa_accesibilidad.geojson)
   - CAT-08: Biodiversidad Urbana (capa_biodiversidad.geojson)
   - CAT-09: Edificaciones y Huella Urbana (capa_edificaciones.geojson)
   - CAT-10: Coberturas y Usos de Suelo (capa_cobertura_suelo.geojson)
   - Dataset Unificado: atlas_vgi_barrio_brasil_uah_completo.geojson (todas las
     entidades consolidadas en una sola capa con atributos maestros).

02_geofabrik_chile_rm/
   Información derivada del extracto regional de Geofabrik para Chile y la Región
   Metropolitana (chile-latest.osm.pbf / chile-latest-free.shp.zip):
   - Capas temáticas regionales seleccionadas.
   - ENLACES_Y_METADATOS_GEOFABRIK.json: URLs oficiales y directas a los servidores
     de Geofabrik GmbH para descarga de dumps diarios completos en PBF y SHP.
   - GUIA_IMPORTACION_GEOFABRIK_QGIS.md: Procedimiento técnico para importar y
     consultar extractos masivos con índices espaciales R-Tree.
   - Scripts reproducibles en Python para procesamiento y filtrado por BBox.

03_capas_oficiales_estado/
   Cartografía oficial de contraste provista por ministerios y servicios del Estado
   (IDE Chile / SNIT / Ley N° 20.285 de Transparencia):
   - Censo INE 2024: Manzanas, Zonas, Localidades, Límites Urbanos y Marco Regional.
   - MINVU: Áreas verdes públicas actualizadas.
   - Monumentos / IPT: Zonas de Conservación Histórica e Inmuebles Patrimoniales (ZCH/ICH).
   - UOCT / MTT: Catastro de cruces semaforizados conectados al Sistema de Control RM.
   - Subtel: Catastro georreferenciado de antenas de telecomunicaciones.
   - BIP MBN: Inversiones públicas en Santiago Centro.
   - MIDESO: Unidades Vecinales y cobertura socioeconómica RSH.
   - INVENTARIO_108_CAPAS_OFICIALES.json: Fichas técnicas de las 108 capas oficiales.

04_catalogos_matrices_excel/
   Matrices metodológicas OpenXML (.xlsx) del Departamento de Geografía UAH:
   - categorias_tematicas_osm.xlsx: Libro maestro de 4 hojas (Taxonomías CAT-01 a CAT-10,
     catálogo de etiquetas Chile, diccionario de atributos y 125 citas APA 7ª ed.).
   - catalogo_fuentes_vgi.xlsx: Inventario evaluado de fuentes colaborativas y oficiales.
   - perfil_metadatos_vgi.xlsx: Perfil de metadatos ISO 19115 / SNIT y matriz de calidad.

05_metadatos_y_gobernanza/
   Documentación técnica, estándares internacionales y licencias:
   - MANUAL_USO.md: Manual exhaustivo de la plataforma y guía territorial.
   - INFORME_PROYECTO_ATLAS_VGI.md: Memoria académica del Atlas VGI.
   - ANALISIS_METACALIDAD.md: Informe de auditoría bajo norma ISO 19157:2013/2023.
   - matriz_metacalidad.json: Matriz computacional de calidad de las 118 capas.
   - metadatos_iso19139_atlas_vgi.xml: Ficha XML para catálogos GeoNetwork / GeoNode.
   - LICENSE: Marco tripartito (ODbL 1.0 + CC BY-SA 4.0 + GNU AGPLv3).

--------------------------------------------------------------------------------
2. SISTEMA DE REFERENCIA ESPACIAL (CRS)
--------------------------------------------------------------------------------
- Coordenadas geográficas nativas: WGS 84 (EPSG:4326), formato GeoJSON (RFC 7946).
- Proyección métrica oficial de cálculo: SIRGAS-Chile / UTM huso 19S (EPSG:32719).

--------------------------------------------------------------------------------
3. INSTRUCCIONES DE USO EN SOFTWARE SIG (QGIS / ARCGIS / PYTHON)
--------------------------------------------------------------------------------
- QGIS: Arrastre cualquier archivo .geojson directamente sobre el panel de capas.
- ArcGIS Pro / ArcMap: Utilice la herramienta "JSON To Features" (Conversion Tools).
- Python / GeoPandas:
  >>> import geopandas as gpd
  >>> gdf = gpd.read_file("01_vgi_comunitario_osm/atlas_vgi_barrio_brasil_uah_completo.geojson")
  >>> gdf_utm = gdf.to_crs(epsg=32719)

--------------------------------------------------------------------------------
4. CRÉDITOS Y CONTACTO
--------------------------------------------------------------------------------
- Practicante: Juan Pablo Lescano Villegas (GEOJOTA)
- Supervisor: Prof. Manuel Fuenzalida — Departamento de Geografía, Universidad Alberto Hurtado.
- Repositorio y Actualizaciones: https://github.com/GEOJOTA/atlas_vgi_uah
- Visor en Línea: https://atlasvgiuah.netlify.app/
================================================================================
"""

# 2. Crear documento de enlaces Geofabrik
GEOFABRIK_META = {
    "proveedor": "Geofabrik GmbH (Karlsruhe, Alemania)",
    "origen_datos": "OpenStreetMap contributors (ODbL 1.0)",
    "cobertura": "Chile y Región Metropolitana de Santiago",
    "frecuencia_actualizacion": "Diaria (00:00 UTC)",
    "descargas_oficiales_directas": {
        "osm_pbf_chile": {
            "nombre": "Chile OSM PBF (Formato binario comprimido optimizado)",
            "url": "https://download.geofabrik.de/south-america/chile-latest.osm.pbf",
            "descripcion": "Extracto completo de todas las entidades de OpenStreetMap en Chile.",
            "formato": "OSM PBF",
            "herramientas_recomendadas": ["osmium", "osmconvert", "osm2pgsql", "QGIS (QuickOSM)"]
        },
        "shapefiles_chile": {
            "nombre": "Chile Shapefiles (Capas temáticas ESRI Shapefile)",
            "url": "https://download.geofabrik.de/south-america/chile-latest-free.shp.zip",
            "descripcion": "Paquete comprimido con capas Shapefile: roads, buildings, points of interest, landuse, water, etc.",
            "formato": "ESRI Shapefile (.shp.zip)",
            "herramientas_recomendadas": ["QGIS", "ArcGIS", "GeoPandas"]
        },
        "osm_bz2_chile": {
            "nombre": "Chile XML OSM comprimido BZ2",
            "url": "https://download.geofabrik.de/south-america/chile-latest.osm.bz2",
            "descripcion": "Extracto XML clásico comprimido con bzip2.",
            "formato": "OSM XML BZ2"
        }
    },
    "extracto_regional_atlas": {
        "region": "Región Metropolitana de Santiago (DPA 2023)",
        "poligono_recorte": "Bounding Box Barrio Brasil / Campus UAH / Gran Santiago",
        "total_entidades_clasificadas": 1552144,
        "macrocategorias_vgi": 10
    }
}

GUIA_GEOFABRIK_MD = """# Guía Técnica: Uso de Extractos Geofabrik en el Atlas VGI UAH

## 1. ¿Qué es Geofabrik?
Geofabrik es el principal proveedor de extractos regionales depurados de OpenStreetMap a nivel mundial. Cada noche procesa el planet dump de OSM y genera archivos recortados por países y continentes sin costo de acceso.

## 2. Enlaces de Descarga Directa Oficial
- **OSM PBF Chile (Recomendado):** [chile-latest.osm.pbf](https://download.geofabrik.de/south-america/chile-latest.osm.pbf)
- **Shapefiles Chile (ZIP):** [chile-latest-free.shp.zip](https://download.geofabrik.de/south-america/chile-latest-free.shp.zip)
- **Metadatos y Servidor Geofabrik:** https://download.geofabrik.de/south-america/chile.html

## 3. Apertura en QGIS
1. Descargue el archivo `.shp.zip` de Geofabrik y descomprímalo.
2. En QGIS, abra el menú `Capa` → `Añadir Capa` → `Añadir Capa Vectorial`.
3. Seleccione las capas de interés (ej. `gis_osm_buildings_a_free_1.shp` para edificaciones o `gis_osm_roads_free_1.shp` para vialidad).
4. Aplique un filtro espacial mediante la delimitación de Barrio Brasil contenida en `01_vgi_comunitario_osm/atlas_vgi_barrio_brasil_uah_completo.geojson`.

## 4. Filtrado con Osmium Tool (CLI)
Para recortar el archivo `.osm.pbf` al BBox exacto de Barrio Brasil:
```bash
osmium extract -b -70.6720,-33.4505,-70.6580,-33.4350 chile-latest.osm.pbf -o barrio_brasil_geofabrik.osm.pbf
```
"""

# Archivos a incluir
VGI_FILES = [
    'atlas_vgi_barrio_brasil_uah_completo.geojson',
    'capa_educacion.geojson',
    'capa_servicios.geojson',
    'capa_transporte.geojson',
    'capa_movilidad_activa.geojson',
    'capa_espacio_publico.geojson',
    'capa_patrimonio.geojson',
    'capa_accesibilidad.geojson',
    'capa_biodiversidad.geojson',
    'capa_edificaciones.geojson',
    'capa_cobertura_suelo.geojson'
]

GEOFABRIK_FILES = [
    'capa_osm_rm_cat01_educacion.geojson',
    'capa_osm_rm_cat06_patrimonio.geojson'
]

OFFICIAL_FILES = [
    'ide_censo2024_manzanas.geojson',
    'ide_censo2024_zonal.geojson',
    'ide_censo2024_localidades.geojson',
    'ide_censo2024_limite_urbano.geojson',
    'ide_censo2024_regional.geojson',
    'Areas_Verdes_MINVU_INE_2023.geojson',
    'ZCH_ICH_RM_Patrimonio_IPT.geojson',
    'semaforos_rm_uoct_2026.geojson',
    'capa_unidades_vecinales_bidat.geojson',
    'capa_antenas_subtel.geojson',
    'capa_areas_funcionales_urbanas.geojson',
    'bip_inversiones_santiago.csv'
]

EXCEL_FILES = [
    'categorias_tematicas_osm.xlsx',
    'catalogo_fuentes_vgi.xlsx',
    'perfil_metadatos_vgi.xlsx'
]

DOC_FILES = [
    'MANUAL_USO.md',
    'INFORME_PROYECTO_ATLAS_VGI.md',
    'ANALISIS_METACALIDAD.md',
    'matriz_metacalidad.json'
]

# Construir ZIP
with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    # Textos base
    zf.writestr('geodatabase_completa_atlas_vgi/LEAME_PRIMERO_ATLAS_VGI.txt', LEAME_TEXT.strip())
    zf.writestr('geodatabase_completa_atlas_vgi/02_geofabrik_chile_rm/ENLACES_Y_METADATOS_GEOFABRIK.json', json.dumps(GEOFABRIK_META, indent=2, ensure_ascii=False))
    zf.writestr('geodatabase_completa_atlas_vgi/02_geofabrik_chile_rm/GUIA_IMPORTACION_GEOFABRIK_QGIS.md', GUIA_GEOFABRIK_MD.strip())

    # 1. VGI
    for f in VGI_FILES:
        p = os.path.join(DATA_DIR, f)
        if os.path.exists(p):
            zf.write(p, f'geodatabase_completa_atlas_vgi/01_vgi_comunitario_osm/{f}')
            print(f" [+] VGI: {f}")

    # 2. Geofabrik
    for f in GEOFABRIK_FILES:
        p = os.path.join(DATA_DIR, f)
        if os.path.exists(p):
            zf.write(p, f'geodatabase_completa_atlas_vgi/02_geofabrik_chile_rm/{f}')
            print(f" [+] Geofabrik: {f}")

    # Scripts Geofabrik
    for sf in ['procesar_geofabrik_rm.py', 'generar_gpkg_geofabrik.py']:
        sp = os.path.join(BASE_DIR, 'scripts', sf)
        if os.path.exists(sp):
            zf.write(sp, f'geodatabase_completa_atlas_vgi/02_geofabrik_chile_rm/scripts/{sf}')

    # 3. Oficiales
    for f in OFFICIAL_FILES:
        p = os.path.join(DATA_DIR, f)
        if os.path.exists(p):
            zf.write(p, f'geodatabase_completa_atlas_vgi/03_capas_oficiales_estado/{f}')
            print(f" [+] Oficial: {f}")

    # 4. Excel
    for f in EXCEL_FILES:
        p = os.path.join(DOCS_DIR, f)
        if os.path.exists(p):
            zf.write(p, f'geodatabase_completa_atlas_vgi/04_catalogos_matrices_excel/{f}')
            print(f" [+] Excel: {f}")

    # 5. Docs
    for f in DOC_FILES:
        p = os.path.join(DOCS_DIR, f)
        if os.path.exists(p):
            zf.write(p, f'geodatabase_completa_atlas_vgi/05_metadatos_y_gobernanza/{f}')
            print(f" [+] Doc: {f}")

    # Licencia
    lic_p = os.path.join(BASE_DIR, 'LICENSE')
    if os.path.exists(lic_p):
        zf.write(lic_p, 'geodatabase_completa_atlas_vgi/05_metadatos_y_gobernanza/LICENSE')

# Espejar a docs/
shutil.copy2(OUTPUT_ZIP, MIRROR_ZIP)

sz_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
print("=" * 75)
print(f"✅ PAQUETE GENERADO CON ÉXITO: {OUTPUT_ZIP}")
print(f"   Tamaño: {sz_mb:.2f} MB")
print("=" * 75)
