# Arquitectura Técnica del Atlas de Información Geográfica Voluntaria (Atlas VGI · UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**

---

## 🧭 Índice de Contenidos

1. [Principios de Diseño e Ingeniería](#1-principios-de-diseño-e-ingeniería)
2. [Estructura de Datos: 131 Coberturas Operativas y Base Dual (.geojson + .gpkg)](#2-estructura-de-datos-131-coberturas-operativas-y-base-dual-geojson--gpkg)
3. [Diagrama de Flujo Modular (00 al 09)](#3-diagrama-de-flujo-modular-00-al-09)
4. [Sincronización de Directorios (data/ y src/data/)](#4-sincronización-de-directorios-data--srcdata)

---

## 1. Principios de Diseño e Ingeniería

El **Atlas de Información Geográfica Voluntaria (Atlas VGI)** se fundamenta en una arquitectura estática autónoma (**HTML5 + CSS3 + Vanilla JavaScript ES6+**) diseñada para garantizar la sostenibilidad operativa de costo cero y la transferencia institucional sin dependencia de servidores propietarios ni motores de bases de datos de pago. El procesamiento espacial, la reproyección geodésica (`EPSG:32719`, Snyder, 1987) y el consumo de servicios abiertos (**Overpass API**, **ohsome API**, **GBIF API**) se ejecutan en el navegador del cliente sobre infraestructura estática distribuida (**Netlify** y **GitHub Pages**).

---

## 2. Estructura de Datos: 131 Coberturas Operativas y Base Dual (`.geojson` + `.gpkg`)

El repositorio integra un inventario auditado de **131 capas geográficas** normalizadas bajo el sistema de referencia **`EPSG:4326` (WGS84 / SIRGAS-Chile)**:

1. **121 Capas Oficiales del Estado de Chile (`src/js/modulos/ide_chile.js`)**:
   - **23 coberturas institucionales base**: Censo 2024 (INE), Planes Reguladores Comunales (PRC MINVU), Plan Regulador Metropolitano de Santiago (PRMS), Zonas e Inmuebles de Conservación Histórica, Monumentos Nacionales (CMN), Red Vial MOP, Red Metro, Paraderos DTPM, Ciclovías, Cruces Semaforizados UOCT, Ferias Libres, Establecimientos de Salud (DEIS/MINSAL), Educación (MINEDUC), Peligros Geológicos (SERNAGEOMIN) y Humedales Urbanos (MMA).
   - **98 coberturas de la Geodatabase Territorial (`bbdd_01` a `bbdd_98`)**: Indicadores sociodemográficos, socioeconómicos (RSH / BiDat MDSF), unidades vecinales, cités patrimoniales, avalúos fiscales SII, islas de calor, arbolado urbano y las **13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios (SUBDERE 2024, `bbdd_86` a `bbdd_98`)**.
2. **10 Categorías Colaborativas VGI (`src/js/config.js`)**:
   - Registros comunitarios de **OpenStreetMap (OSM)** y **GBIF / iNaturalist**: `cat01_movilidad`, `cat02_vivienda`, `cat03_comercio`, `cat04_areas_verdes`, `cat05_seguridad`, `cat06_educacion`, `cat07_patrimonio`, `cat08_biodiversidad`, `cat09_cuidados` y `cat10_percepcion`.
3. **140 Descriptores Técnicos en el Diccionario de Datos (`src/js/modulos/diccionario.js`)**:
   - Documenta las 131 capas geográficas más 9 tablas de referencia conforme al estándar **ISO 19110:2016**.
   - Conserva simétricamente en `data/` y `src/data/` tanto los archivos `.geojson` (para renderizado web) como las geodatabases originales `.gpkg` del catastro SUBDERE RSD 2024 que almacenan los descriptores técnicos nativos por columna.

---

## 3. Diagrama de Flujo Modular (00 al 09)

```mermaid
flowchart TD
    UI["src/index.html (Interfaz Única de 10 Módulos: 00 a 09)"]
    CFG["src/js/config.js (Coordenadas, 10 Categorías VGI y Comunas RM)"]
    APP["src/js/app.js (Motor Leaflet 2D, Filtros Espaciales e ICV Dinámico)"]
    
    UI --> CFG
    UI --> APP
    
    APP --> M00["Módulo 00: ide_chile.js (121 Capas Oficiales) + evaluador_normativo.js (PRC/OGUC e Historial 1990-2024)"]
    APP --> M01["Módulo 01: osm.js (Consultas Overpass QL en tiempo real)"]
    APP --> M02["Módulo 02: ohsome.js + evaluador_calidad_cuantitativa.js (ISO 19157 / ohsome / OSMCha)"]
    APP --> M03["Módulo 03: gbif.js (Biodiversidad GBIF / iNaturalist - Darwin Core)"]
    APP --> M04["Módulo 04: umap.js (Cartografía Participativa uMap)"]
    APP --> M05["Módulo 05: metadatos.js (Catálogo ISO 19115 / ISO 19139)"]
    APP --> M06["Módulo 06: diccionario.js (131 Capas / 140 Descriptores ISO 19110)"]
    APP --> M07["Módulo 07: licencias.js (ODbL 1.0, CC BY-SA 4.0, AGPLv3, Ley 20.285)"]
    APP --> M08["Módulo 08: manual.js (Manual de Uso y Manual de Actualización Técnica)"]
    APP --> M09["Módulo 09: indicadores_analisis.js (5 Dimensiones y 7 Storyboards de Barrio Brasil)"]
```

---

## 4. Sincronización de Directorios (`data/` $\leftrightarrow$ `src/data/`)

Dado que `netlify.toml` define `publish = "src"`, todo archivo incorporado en `data/` o `docs/` se replica de forma idéntica en `src/data/` y `src/docs/`. Los scripts alojados en `scripts/` auditan automáticamente esta paridad antes de cada despliegue en producción, según se detalla en [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).
