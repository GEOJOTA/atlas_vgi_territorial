# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
## Informe de Puesta al Día — 16 Septiembre 2026

---

## 1. Identidad del Proyecto

| Campo | Detalle |
|---|---|
| **Nombre** | Atlas de Información Geográfica Voluntaria para la Gestión Territorial |
| **Autor** | Juan Pablo Lescano Villegas |
| **Contacto** | juanpablolescanovillegas@gmail.com |
| **Institución** | Práctica Profesional — Escuela de Geografía, Universidad Alberto Hurtado (UAH) |
| **Marco investigativo** | Proyecto Fondecyt Regular sobre VGI y Gobernanza Territorial (Dr. Manuel Fuenzalida, UAH) |
| **Territorio piloto** | Barrio Brasil + Campus UAH — Santiago Centro, Chile |
| **URL de producción** | https://atlasvgiuah.netlify.app/ |
| **Repositorio** | https://github.com/GEOJOTA/atlas_vgi_uah (privado) |
| **Base de datos** | https://supabase.com/dashboard/project/tkfzmmlhhxqhzgqavsqr |
| **CI/CD** | https://app.netlify.com/projects/geomanifold/overview |

---

## 2. Bounding Box del Territorio de Estudio

| Zona | Bbox (Lon_min, Lat_min, Lon_max, Lat_max) | Centro | Zoom |
|---|---|---|---|
| Barrio Brasil Completo | `[-70.6720, -33.4505, -70.6580, -33.4350]` | [-33.4425, -70.6650] | 15 |
| Manzana Campus UAH | `[-70.6675, -33.4505, -70.6565, -33.4385]` | [-33.4445, -70.6620] | 16 |

**Sistema geodésico:** EPSG:4326 (WGS84) → reproyeccion metrica EPSG:32719 (UTM Huso 19 Sur)

---

## 3. Arquitectura del Sistema

```
+------------------------------------------------------------------+
|           NAVEGADOR DEL USUARIO (SPA — Zero Build)               |
|                                                                  |
|  src/index.html + css/estilos.css                                |
|  +------------------------------------------------------------+  |
|  |  js/app.js  (orquestador central)                          |  |
|  |  js/config.js  (configuracion y endpoints)                 |  |
|  |  js/modulos/  (16 modulos desacoplados)                    |  |
|  +------------------------------------------------------------+  |
+--------+------------+----------+----------+----------+-----------+
         |            |          |          |          |
         v            v          v          v          v
   Supabase       Overpass     ohsome    Taginfo     GBIF
 PostGIS 17.6      API QL    API v1/v2   API v4   Occurrence
 129.262 entidades CAT-01..10  HeiGIT   Geofabrik  Darwin Core
 R-Tree GIST       3 mirrors  OSMCha    Taginfo    iNaturalist
```

### Stack tecnologico

| Capa | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript (Zero Build / Sin frameworks) |
| Cartografia | Leaflet 1.9.4 |
| Importacion | JSZip 3.10.1 + toGeoJSON (KMZ/KML/GeoJSON/GPX/CSV) |
| Base de datos | PostgreSQL 17.6 + PostGIS 3.3 (Supabase, plan gratuito) |
| CDN | Supabase Storage (atlas-geojson) |
| Despliegue | Netlify (integracion continua desde rama main) |
| Keep-alive | GitHub Actions (ping cada 3 dias) |
| Scripts CLI | Python 3 (openpyxl, supabase-py, requests) |

---

## 4. Modulos JavaScript (16 modulos en src/js/modulos/)

| Modulo | Funcion |
|---|---|
| `mapa.js` | Visor Leaflet 1.9.4, control de capas, bbox dinamico |
| `db_client.js` | Cliente PostGIS RPC + Supabase Storage CDN + fallback local |
| `ide_chile.js` | 107 capas oficiales del Estado en 6 macro-grupos con acordeones |
| `evaluador_normativo.js` | Inspector CIN-VGI: PRC Santiago, OGUC, patrimonio, certificado .txt |
| `osm.js` | Consultas Overpass QL, CAT-01 a CAT-10, 3 servidores espejo |
| `taginfo.js` | Telemetria global OSM en tiempo real (Taginfo API v4) |
| `ohsome.js` | Series historicas P1Y, evolucion temporal, masa critica (ohsome v1/v2) |
| `calidad_analyst.js` | OQT Score, OSMCha changesets, Indice de Saturacion de Mapeo |
| `gbif.js` | Biodiversidad urbana, autocompletado taxonomico, Darwin Core flags |
| `importador_capas.js` | Importacion multi-formato 100% en cliente (KMZ/KML/GeoJSON/GPX/CSV) |
| `metadatos.js` | Generador dual ISO 19115 (JSON) + ISO 19139 (XML IDE Chile) |
| `geodesia.js` | Reproyeccion Snyder WGS84 → EPSG:32719 UTM 19S |
| `diccionario.js` | 134 descriptores territoriales (48 oficiales IDE vs 86 brechas VGI) |
| `licencias.js` | Marco juridico ODbL 1.0 / CC BY-SA 4.0 / GNU GPL v3 |
| `manual.js` | Manual metodologico integrado |
| `manifold_canvas.js` | Efecto visual "Backrooms" estetico del fondo |
| `umap.js` | Embebido de proyectos UMap colaborativos |

---

## 5. Capas del Atlas (117 totales)

### 5.1 Categorias VGI (10 — fuente OpenStreetMap + GBIF)

| Codigo | Categoria | Filtro OSM Principal |
|---|---|---|
| CAT-01 | Educacion y Universidad | amenity=university/college/school/library |
| CAT-02 | Servicios, Comercio y Salud | shop=*, amenity=pharmacy/clinic/cafe/bank |
| CAT-03 | Movilidad y Transporte | highway=bus_stop, railway=station/subway_entrance |
| CAT-04 | Movilidad Activa y Ciclovias | highway=cycleway, amenity=bicycle_parking/bicycle_rental |
| CAT-05 | Areas Verdes y Espacio Publico | leisure=park/playground/pitch, landuse=grass |
| CAT-06 | Patrimonio Historico y Cultura | historic=*, heritage=*, amenity=arts_centre/theatre |
| CAT-07 | Accesibilidad Universal | kerb=*, wheelchair=*, highway=crossing |
| CAT-08 | Biodiversidad Urbana | natural=tree/tree_row/wood + GBIF Occurrence API |
| CAT-09 | Edificaciones y Huella Urbana | way["building"], relation["building"] |
| CAT-10 | Coberturas y Usos de Suelo | landuse=*, natural=*, leisure=* |

### 5.2 Capas Oficiales del Estado de Chile (107 — 6 macro-grupos)

1. Normativa Urbanistica e IPT (MINVU / PRC Santiago / PRMS)
2. Medio Ambiente, Parques y Recursos Hidricos (MMA / DGA / CONAF / CIREN)
3. Comunidades, RSH, Vulnerabilidad y Demografia (MDSF / INE Censo 2024)
4. Equipamiento Publico, Educacion, Salud y Patrimonio (CMN / MINEDUC / MINSAL)
5. Seguridad, Bomberos y Emergencias (Carabineros / CBS / DIFROL)
6. Movilidad, Metro, Inversion Publica y Economia (MOP / MTT / CNE / ODEPA)

---

## 6. Base de Datos Supabase (PostGIS)

| Parametro | Valor |
|---|---|
| **Proyecto** | tkfzmmlhhxqhzgqavsqr |
| **URL** | https://tkfzmmlhhxqhzgqavsqr.supabase.co |
| **Motor** | PostgreSQL 17.6 + PostGIS 3.3 |
| **Entidades** | 129.262 vectoriales indexadas con GIST R-Tree |
| **Tabla metadatos** | public.capas_metadata (107 registros) |
| **Tabla entidades** | public.capas_entidades |
| **RPC espacial** | fn_obtener_capa_bbox(capa_id, min_lon, min_lat, max_lon, max_lat) |
| **Storage CDN** | Bucket publico atlas-geojson |
| **Keep-alive** | GitHub Actions cada 3 dias |

### Failover de Triple Contingencia
1. Nivel 1: Consulta RPC PostGIS (recorte espacial por Bbox en milisegundos)
2. Nivel 2: Descarga desde Supabase Storage CDN
3. Nivel 3: Fallback local autonomo desde data/*.geojson

---

## 7. APIs Externas Integradas (10 servicios)

| API | Endpoint | Funcion | Estado Auditado (16/09/2026) |
|---|---|---|---|
| Overpass API v0.7 | https://overpass-api.de/api/interpreter | Extraccion vectorial OSM CAT-01..10 | 🟢 Operativo (1.7s) |
| Overpass Espejo z | https://z.overpass-api.de/api/interpreter | Espejo activo de alta velocidad | 🟢 Operativo (1.4s) |
| Overpass Kumi | https://overpass.kumi.systems/api/interpreter | Espejo de contingencia | 🟢 Operativo |
| ohsome API v1 | https://api.ohsome.org/v1 | Series historicas P1Y sin auth | 🟢 Operativo (Snapshot 2026-07-27) |
| ohsome API v2 | https://api.heigit.org/ohsome-api/v2-rc | Citus/ohsomeDB (HeiGIT) | 🟡 Requiere API Key HeiGIT (CORS restringido) |
| Taginfo API v4 | https://taginfo.openstreetmap.org/api/4/ | Telemetria global OSM | 🟢 Operativo (1.1s, CORS *) |
| OSM Changesets | https://api.openstreetmap.org/api/0.6/changesets | Validacion de ediciones | 🟢 Operativo (6.9s) |
| OSMCha | https://osmcha.org/changesets/{id} | Auditoria de cambios | 🟢 Operativo |
| GBIF Occurrence | https://api.gbif.org/v1/occurrence/search | Biodiversidad urbana | 🟢 Operativo (1.3s) |
| GBIF Species | https://api.gbif.org/v1/species/suggest | Autocompletado taxonomico | 🟢 Operativo (1.3s) |
| UMap | https://umap.openstreetmap.fr/ | Cartografia colaborativa | 🟢 Operativo |
| MINVU GeoIDE WMS | https://geoide.minvu.cl/server/rest/services/ | Capas IPT en vivo | 🟢 Operativo (395ms) |

### Diagnostico y Correcciones Aplicadas a ohsome y Overpass:
1. **ohsome v1 (Horizonte Temporal):** HeiGIT mantiene un snapshot vigente hasta `2026-07-27`. Cualquier consulta que utilizaba fechas posteriores (como `2026-09-16`) recibía error `404: The given time parameter is not completely within the timeframe`. Se implementó detección automática de metadata y tope seguro a `2026-07-27`.
2. **Timeouts en ohsome.js:** El timeout estaba en 10s, pero consultas analíticas como `/users/count` y capas densas como `natural=tree` tardan entre 12 y 19s. Se incrementó el timeout a 25s y se agregó tolerancia a fallos con recuperación automática de la serie histórica.
3. **Overpass Espejos:** El espejo `lz4.overpass-api.de` arrojaba `504 Gateway Timeout`. Se reemplazó por el espejo oficial `z.overpass-api.de` (1.4s) y `overpass.kumi.systems`, con timeout por servidor elevado a 15s.
4. **Supabase PostGIS:** Se vinculó el proyecto `https://tkfzmmlhhxqhzgqavsqr.supabase.co` en la configuración centralizada.

---

## 8. Diccionario Territorial — Hallazgo Clave

El Atlas documenta 134 descriptores territoriales:
- 48 tienen capa homologa oficial en el Geoportal IDE Chile / SNIT
- 86 representan BRECHAS VGI — microelementos de la vida cotidiana que NO existen en ningun catastro del Estado de Chile

HALLAZGO METODOLOGICO: La VGI no duplica la cartografia estatal — cubre vacios de micro-escala donde las instituciones publicas no tienen capacidad de inventario continuo.

---

## 9. Estructura del Repositorio (local en este equipo)

```
C:\Users\PT1261256\Desktop\16_09_2026\
├── atlas_vgi_uah\                 -- Repositorio completo (clonado 16/09/2026)
│   ├── src\                       -- Frontend SPA principal
│   │   ├── index.html
│   │   ├── css\estilos.css
│   │   ├── js\app.js + config.js
│   │   ├── js\modulos\ (16 modulos)
│   │   ├── data\ (107 GeoJSON + 10 VGI)
│   │   └── docs\ (catalogos .xlsx)
│   ├── backend\servidor_vgi.py    -- Servidor Flask CORS opcional
│   ├── scripts\                   -- Pipeline CLI Python
│   ├── docs\                      -- Documentacion tecnica
│   ├── .github\workflows\         -- CI/CD + keep-alive
│   ├── README.md
│   ├── TODO_SIGUIENTE.md          -- Bitacora de desarrollo (798 lineas)
│   └── MANUAL_USO.md
├── herramientas\
│   ├── Git-2.47.1-64-bit.exe      -- Instalador Git (INSTALADO)
│   ├── python-3.12.7-amd64.exe    -- Instalador Python (INSTALADO)
│   └── atlas_vgi_uah_main.zip     -- Backup ZIP del repositorio
├── INFORME_PROYECTO_ATLAS_VGI.md  -- Este archivo
├── Atlas_VGI_Abrir_Local.lnk      -- Acceso directo: abrir en navegador
├── Atlas_VGI_Carpeta_Proyecto.lnk -- Acceso directo: carpeta del proyecto
├── Atlas_VGI_Sitio_Produccion.url -- https://atlasvgiuah.netlify.app/
├── Atlas_VGI_GitHub.url           -- https://github.com/GEOJOTA/atlas_vgi_uah
├── Atlas_VGI_Supabase_PostGIS.url -- Dashboard Supabase
└── Atlas_VGI_Netlify_CICD.url     -- Panel Netlify CI/CD
```

---

## 10. Herramientas instaladas en este equipo

| Herramienta | Version | Ubicacion |
|---|---|---|
| Python | 3.12.7 | C:\Users\PT1261256\AppData\Local\Programs\Python\Python312\ |
| Git | 2.47.1 | C:\Program Files\Git\ |
| Paquetes pip | supabase, openpyxl, requests | (instalados via pip) |
| Git credentials | GEOJOTA configurado | ~/.git-credentials |

---

## 11. Scripts CLI Python disponibles

```bash
# Servidor local de desarrollo
python -m http.server 8080 --directory src/
# Abrir http://localhost:8080

# Auditoria de integridad (dry-run)
python scripts/subir_base_datos_supabase.py --dry-run

# Sincronizacion con Supabase Storage CDN
python scripts/subir_base_datos_supabase.py --upload-storage

# Ingesta masiva de entidades en PostGIS
python scripts/cargar_entidades_postgis.py

# Regenerar catalogos Excel (.xlsx)
python scripts/generar_catalogos_excel.py

# Extractor automatizado Overpass QL
python scripts/extractor_vgi.py
```

---

## 12. Perfiles de Usuario del Atlas

| Perfil | Ejemplos | Funcion principal |
|---|---|---|
| Institucional | Municipalidad Santiago, SECPLAN, IDE Chile | IPT/PRC, Censo 2024, XML ISO 19139 |
| Comunitario | JJVV, vecinos, organizaciones barriales | Diagnostico en 1 clic, UMap |
| Voluntario | Mapeadores OSM, colectivos | Overpass QL avanzado, Taginfo, OSMCha |
| Investigador | UAH, ONGs, geografos | EPSG:32719, series ohsome, APA 7a edicion |

## 13. Integración Multiescalar del Censo de Población y Vivienda 2024 (Región Metropolitana)

En septiembre de 2026 se llevó a cabo el reemplazo e integración exhaustiva de las capas oficiales del **Censo 2024** provistas por el Instituto Nacional de Estadísticas (INE) y la Infraestructura de Datos Geoespaciales de Chile (IDE Chile), estructuradas en **cinco niveles escalares independientes** (filtradas para la Región Metropolitana y con máxima resolución en la Comuna de Santiago / Barrio Brasil):

| Nivel Escalar | Capa ID | Archivo GeoJSON | Entidades | Geometría | Variables Clave y Enfoque |
|---|---|---|---|---|---|
| **Escala 1: Regional** | `censo2024_regional` | `ide_censo2024_regional.geojson` | 1 | Polígono (RM) | Marco macroterritorial de la Región Metropolitana (Código CUT 13), delimitación regional oficial. |
| **Escala 2: Límites Urbanos** | `censo2024_limite_urbano` | `ide_censo2024_limite_urbano.geojson` | 106 | Polígonos (Áreas Urbanas) | Delimitación de las 106 áreas urbanas censales consolidadas de la RM, con población total, hombres, mujeres y viviendas. |
| **Escala 3: Localidades** | `censo2024_localidades` | `ide_censo2024_localidades.geojson` | 511 | Polígonos (Asentamientos) | Localidades pobladas y entidades urbanas y rurales con categoría censal, conurbación y distribución de habitantes. |
| **Escala 4: Distritos y Zonas** | `censo2024_zonal` | `ide_censo2024_zonal.geojson` | 1.865 | Polígonos (Zonas/Distritos) | Zonas y distritos censales de toda la RM, agregando 186 variables demográficas (población, etnias, inmigración, vivienda). |
| **Escala 5: Manzanas Censales** | `censo2024_manzanas` | `ide_censo2024_manzanas.geojson` | 1.711 | Polígonos (Manzanas) | Microdatos a nivel predial/manzana censal para la Comuna de Santiago (Barrio Brasil, Campus UAH y centro histórico) con desglose por tramos de edad (NNA 0-17, adultos mayores 60+), inmigrantes y viviendas particulares. |

### Optimizaciones Técnicas Realizadas:
- **Transformación de Coordenadas:** Reproyección desde SIRGAS-Chile (EPSG:4674) a WGS 84 (EPSG:4326) con redondeo geodésico a 6 decimales (~10 cm de precisión).
- **Simplificación Topológica Web:** Tolerancia topológica preservada de 2 a 3 metros en escalas macro, logrando reducciones de hasta 70% en peso de transferencia sin pérdida visual ni geométrica.
- **Microdatos Preservados:** Conservación íntegra de las variables demográficas oficiales del INE en cada registro.
- **Sincronización en Producción:** Actualización de `src/js/modulos/ide_chile.js`, `src/js/modulos/mapa.js`, `scripts/db/02_seed_metadata.sql`, catálogos Excel OpenXML y despliegue a GitHub / Netlify.

---

*Actualizado el 22-09-2026 tras la integración multiescalar del Censo 2024 y sincronización de APIs.*
*Repositorio en GitHub: https://github.com/GEOJOTA/atlas_vgi_uah*

