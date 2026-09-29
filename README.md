# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
### Nodo GeoAbierto — Caso Piloto: Barrio Brasil · Universidad Alberto Hurtado (Santiago, Chile)

Plataforma web de código abierto para consultar, evaluar, visualizar y documentar **Información Geográfica Voluntaria (VGI)** en el territorio de Barrio Brasil. Desarrollado en el Departamento de Geografía de la Universidad Alberto Hurtado (2026), en el marco de la investigación sobre VGI, infraestructuras de datos espaciales y gestión territorial.

Integra un **visor cartográfico interactivo 2D de alta resolución (Leaflet 1.9.4)**, métricas de calidad de datos (ohsome API / Índice de Calidad VGI), evaluación normativa territorial (PRC Santiago / OGUC), **119 capas cartográficas integradas** (10 categorías maestras VGI y 109 capas oficiales del Estado de Chile desde GEOMOP, MINVU, Geoportal, DGA, DIFROL, MINAGRI, BiDat, INE Censo 2024 multiescalar, UOCT / MTT y CNE), base de datos espacial en la nube **PostgreSQL 17.6 + PostGIS 3.3 (Supabase)** con entidades espaciales vectorizadas e indexadas con GIST, bucket público de almacenamiento CDN (`atlas-geojson`), consultas espaciales en milisegundos por RPC y exportación a GeoJSON, CSV, metadatos ISO 19115/19139 y catálogos Excel sincronizados.

> **Acceso libre y código abierto.** Toda la funcionalidad opera con CDN públicos, APIs abiertas (OpenStreetMap, GBIF, ohsome, IDE Chile) y base de datos PostGIS gratuita en la nube con fallback local transparente.

---

## 1. Contexto y motivación

Cuando una institución pública, organización comunitaria o voluntario quiere usar datos colaborativos como OpenStreetMap o GBIF para un diagnóstico urbano local, normalmente enfrenta tres problemas:

1. **Dispersión y heterogeneidad:** APIs con sintaxis disímiles y sin normalización de atributos.
2. **Incertidumbre de calidad:** ¿Cuántos colaboradores han editado? ¿Cuándo fue la última actualización? ¿Cómo distinguir datos confiables?
3. **Falta de interoperabilidad oficial:** Los datos casi nunca tienen metadatos compatibles con el estándar IDE Chile (ISO 19115 / ISO 19139).

El **Atlas VGI** resuelve esto integrando consulta espacial, visor cartográfico interactivo, métricas de calidad, evaluación normativa territorial, base de datos relacional espacial y exportación estructurada.

---

## 2. Territorio piloto

**Barrio Brasil**, Santiago Centro (EPSG:4326):
- **Bounding Box:** `[-70.6720, -33.4505, -70.6580, -33.4350]` (Barrio Brasil Completo) / `[-70.6675, -33.4505, -70.6565, -33.4385]` (Manzana Campus UAH)
- Campus UAH (Almirante Barroso, Erasmo Escala, Cienfuegos), Plaza Brasil, eje Alameda, Metro Los Héroes (L1/L2), Santa Ana (L2/L5) y Cumming (L5).

---

## 3. Usuarios de la plataforma (Perfiles de Actor Territorial)

| Tipo | Ejemplos | Foco Operativo |
|---|---|---|
| **🏛️ Institucional / Autoridades** | Municipalidad de Santiago, SECPLAN, SEREMI MINVU RM, IDE Chile | Fiscalización de IPT (PRC Santiago), microdatos Censo 2024, exportación XML ISO 19139 |
| **👥 Organizaciones Comunitarias / JJVV** | JJVV Barrio Brasil, Santa Ana, Capuchinos, Concha y Toro | Diagnóstico barrial en 1 clic (salud, ferias, áreas verdes), cartografía vecinal en UMap |
| **🧭 Voluntarios / Mapeadores OSM** | Colaboradores OSM activos, colectivos ciclistas | Consultas Overpass QL avanzadas, Taginfo API, control de cambios en OSMCha y vacíos de accesibilidad |
| **🔬 ONGs / Territoriales** | UAH, TECHO-Chile, SUR, Fundación TERRAM, MapBiomas, Colectivos Barriales | Reproyección métrica EPSG:32719, densidades territoriales, series históricas ohsome, citas APA |

---

## 4. Las 10 categorías maestras VGI

Estandarizadas bajo las taxonomías de **OpenStreetMap**, **GBIF Darwin Core** y el estándar **ISO 19110 / ISO 19115**:

| Cód. | Categoría Maestra | Entidades RM (Geofabrik) | Fuente OSM / GBIF | Enfoque Territorial Barrio Brasil y Región Metropolitana |
|---|---|:---:|---|---|
| **CAT-01** | Educación y Universidad | **7.503** | `amenity=university|college|school|library`, relaciones campus | Campus patrimonial UAH (Barroso, Erasmo Escala), facultades, colegios, liceos y bibliotecas de la RM |
| **CAT-02** | Servicios, Comercio y Abastecimiento | **53.555** | `shop=*`, `amenity=*`, `power=*`, `emergency=*`, sitios comerciales | Comercio de proximidad, farmacias de barrio, ferias libres, CESFAM, bancos, redes eléctricas y de emergencia |
| **CAT-03** | Movilidad y Transporte Público | **325.476** | `highway=*` (red completa), `railway=*`, `restriction=*`, `destination=*` | Red vial completa (384k líneas), Red Metro, paraderos y rutas Red Movilidad, ferrocarriles, señalética y restricciones |
| **CAT-04** | Movilidad Activa y Ciclovías | **128.891** | `highway=cycleway`, `cycleway=*`, `footway|pedestrian|path`, `traffic_calming=*` | Ciclovías segregadas Rosas y Brasil, sendas peatonales, veredas, escaleras, cicloparqueaderos y calma de tráfico |
| **CAT-05** | Áreas Verdes y Espacio Público | **38.949** | `leisure=park|playground|pitch`, `amenity=bench`, `landuse=grass` | Parques metropolitanos, plazas barriales, canchas comunitarias, juegos infantiles, mobiliario y bebederos |
| **CAT-06** | Patrimonio Histórico y Cultura | **2.576** | `historic=*`, `heritage=*`, `amenity=theatre|place_of_worship` | Zonas Típicas, Inmuebles de Conservación Histórica (ICH), monumentos, templos religiosos y museos |
| **CAT-07** | Accesibilidad Universal y Cruces | **93.346** | `kerb=lowered`, `tactile_paving=*`, `traffic_signals:sound`, `barrier=bollard|gate` | Vados peatonales D.S. 50 MINVU, pavimentos podotáctiles, cruces semaforizados, bolardos y control peatonal |
| **CAT-08** | Biodiversidad Urbana y Arbolado | **120.627** | `natural=tree|wood|water`, redes hidrográficas + GBIF | Arbolado urbano, Río Mapocho, Zanjón de la Aguada, canales, redes fluviales complejas y biodiversidad |
| **CAT-09** | Edificaciones y Huella Urbana | **697.243** | `building=*`, `addr:housenumber`, `barrier=wall|fence` [EPSG:32719] | Catastro exhaustivo de huellas urbanas sin recortes (multipolígonos, direcciones, predios, muros y relaciones 3D) |
| **CAT-10** | Coberturas y Usos de Suelo | **78.886** | `landuse=*`, `natural=*`, `leisure=*`, complejos de suelo | Zonificación funcional del suelo urbano (residencial, comercial, dotacional, recreativo, biofísico y deportivo) |
| **TOTAL** | **Región Metropolitana Completa** | **1.547.052** | **Geofabrik (Extracto RM 5 archivos) + Overpass QL** | **Base regional completa sin recortes (697.243 edificaciones y 325.476 de transporte) con superposición semántica** |

### 4.1. Doble Flujo de Adquisición y Diferenciación Estricta de Fuentes
El Atlas distingue formalmente dos metodologías de adquisición desacopladas:
1. **`Geofabrik (Extracto RM)`**: Descarga y procesamiento de los 5 archivos del dump regional (1.547.052 entidades clasificadas con superposición semántica, 697.243 edificaciones completas, 325.476 elementos de transporte, 128.891 de movilidad activa y 78.886 coberturas de suelo en las 52 comunas de la RM). Latencia 0 ms, Bbox AABB precomputado por entidad y almacenamiento en GeoPackage con índices R-Tree nativos.
2. **`OpenStreetMap (API Overpass)`**: Consultas bajo demanda en tiempo real a los servidores de Overpass QL (balanceado en 4 espejos) en la ventana territorial activa.
Ambas fuentes se presentan de forma independiente en fichas, leyendas y popups (dorado para Geofabrik, azul para Overpass API) y **no se mezclan**, salvo en superposiciones analíticas expresas como `GBIF + OSM`.

### 4.2. Modalidades Duales de Consulta Espacial
El Módulo 01 del Atlas ofrece dos opciones pedagógicas:
- **`🗺️ Modo 1: Bbox Dinámico del Mapa`**: Al navegar, hacer zoom o arrastrar el visor en cualquier comuna de la RM, el Bbox se sincroniza en tiempo real y permite consultar instantáneamente los elementos en pantalla.
- **`📌 Modo 2: Coordenadas Numéricas Manuales`**: Permite a investigadores, estudiantes o funcionarios ingresar coordenadas exactas `[Oeste, Sur, Este, Norte]` en WGS 84, o cargar directamente el encuadre macro de toda la Región Metropolitana o el caso piloto Barrio Brasil.

---

## 5. Capas oficiales del Estado de Chile integradas (109 capas oficiales + 10 VGI = 119 capas)

El visor integra **109 capas cartográficas oficiales de la Administración del Estado de Chile**, amparadas por la **Ley N° 20.285 de Transparencia**, organizadas en la nueva **Consola Técnica GIS (Workbench Profesional)** con buscador dinámico, filtros por categoría y macro-grupos temáticos:

1. 📜 **Normativa Urbanística & Instrumentos de Planificación Territorial (MINVU / PRC Santiago / PRMS / DPA):**
2. 🌳 **Medio Ambiente, Parques, Espacio Público & Recursos Hídricos (MMA / MINVU / DGA / CONAF / CIREN):**
3. 👥 **Comunidades, RSH, Vulnerabilidad Socioterritorial & Demografía Multiescalar (MDSF / MINVU / INE Censo 2024):**
   - **Integración Multiescalar Censo 2024 (INE / Región Metropolitana):** 
4. 🏛️ **Equipamiento Público, Educación, Salud, Catastro Predial SII & Patrimonio (SII / CMN / MINEDUC / MINSAL / IND):**
5. 🛡️ **Seguridad, Bomberos & Emergencias (Carabineros / CBS / SENAPRED / DIFROL):**
6. 🚲 **Movilidad, Transporte, Red Semafórica UOCT, Red Metro, Inversión Pública & Economía (UOCT / MTT / MOP / BIP / CNE / ODEPA):**

---

## 6. Base de Datos Espacial en la Nube (PostgreSQL 17.6 + PostGIS 3.3 en Supabase)

El Atlas cuenta con un clúster espacial en la nube **PostgreSQL 17.6 con extensión PostGIS 3.3**, 100% libre, gratuito y permanente:

- **129.262 Entidades Vectoriales Vectorizadas:** Almacenadas en la tabla relacional `public.capas_entidades`, optimizando más de 630 MB de archivos GeoJSON de texto a 210 MB binarios con geometrías validadas.
- **Catálogo de Metadatos Relacional:** Tabla `public.capas_metadata` con los 109 registros oficiales, citas APA 7ª ed., instituciones de procedencia y conteos de entidades.
- **Índices Espaciales R-Tree GIST:** Consultas espaciales ultrarrápidas mediante la función RPC `fn_obtener_capa_bbox`, permitiendo al visor Leaflet consultar únicamente las geometrías contenidas en el Bbox activo en milisegundos.
- **Storage CDN (`atlas-geojson`):** Bucket público de alta disponibilidad para descarga directa de coberturas completas.
- **Arquitectura con Fallback de Triple Contingencia:** Si falla la conexión a internet o no se han configurado credenciales, el visor conmuta de forma transparente al directorio local `data/`.
- **Mantenimiento Keep-Alive Permanente a Costo $0:** El workflow [`.github/workflows/supabase_keepalive.yml`](.github/workflows/supabase_keepalive.yml) ejecuta un ping de telemetría cada 3 días desde GitHub Actions, asegurando que la base de datos nunca se suspenda por inactividad.

---

## 7. Módulos y características
 
| Módulo | Descripción |
|---|---|
| **Visor Cartográfico 2D** | Leaflet 1.9.4 + OpenStreetMap; activación interactiva por categoría VGI y consola de capas oficial, popups con atributos, cita APA y zoom automático |
| **Consola GIS de Capas** | Workbench profesional con buscador dinámico (`#busqueda-capas-atlas`), chips de filtro rápido por categoría, switches interactivos, badges de conteo y descarga directa de GeoJSONs oficiales sin simplificar |
| **BD PostGIS** | Pestaña de conexión y telemetría en tiempo real con clúster PostgreSQL 17 + PostGIS 3.3 en Supabase con fallback local autónomo |
| **Calidad VGI (ohsome)** | ohsome API v1/v2: completitud, evolución temporal P1Y, densidad espacial métrica (EPSG:32719), OQT Score, contribuyentes activos; OSMCha para integridad de changesets |
| **Índice de Calidad VGI (ICV)** | Score compuesto por categoría: completitud + actualidad + consistencia geométrica + densidad |
| **CIN-VGI (Inspector Normativo)** | Inspector territorial por clic: PRC Santiago, usos permitidos/prohibidos (Art. 2.1.24 OGUC), riesgos (Art. 2.1.17 OGUC), patrimonio; exporta certificado .txt con disclaimer legal (Art. 116 LGUC) |
| **Importador de capas locales** | KMZ (JSZip en memoria), KML, GeoJSON, GPX, CSV con detección automática de coordenadas y auditoría normativa directa |
| **Taginfo API Explorer** | Telemetría planetaria en tiempo real de claves y valores OSM con recuentos globales |
| **Biodiversidad Urbana GBIF** | Ocurrencias biológicas de ciencia ciudadana con autocompletado taxonómico (Species API) y banderas Darwin Core |
| **Metadatos ISO 19115 / 19139** | Fichas técnicas exportables a JSON y XML oficial de IDE Chile (SNIT / GeoNetwork) |
| **Catálogos Excel (.xlsx)** | Libros OpenXML de 4 hojas con 10 categorías VGI, 134 descriptores territoriales, 109 capas oficiales y 125 citas APA |

---

## 8. Estructura del repositorio

```
atlas_vgi_uah/
├── src/
│   ├── index.html                      # Aplicación principal SPA (no requiere build)
│   ├── css/estilos.css                 # Paleta institucional de alto contraste (WCAG AAA)
│   ├── js/
│   │   ├── app.js                      # Controlador principal y enrutador de eventos
│   │   ├── config.js                   # Configuración centralizada y credenciales
│   │   └── modulos/
│   │       ├── mapa.js                 # Visor 2D Leaflet y control de capas
│   │       ├── db_client.js            # Cliente PostGIS RPC y Supabase Storage CDN
│   │       ├── ide_chile.js            # Catálogo oficial de 109 capas del Estado (UOCT/MTT incluido)
│   │       ├── evaluador_normativo.js  # Motor CIN-VGI / PRC Santiago / OGUC
│   │       ├── ohsome.js               # Métricas calidad VGI (ohsome API dual v1/v2)
│   │       ├── calidad_analyst.js      # ICV e inspector changesets OSMCha
│   │       ├── importador_capas.js     # Importador multi-formato (KMZ/KML/GeoJSON/GPX/CSV)
│   │       ├── taginfo.js              # Validador planetario Taginfo API
│   │       ├── gbif.js                 # Biodiversidad urbana y Darwin Core
│   │       ├── geodesia.js             # Reproyección Snyder EPSG:32719 UTM 19S
│   │       └── metadatos.js            # Generador ISO 19115 (JSON) e ISO 19139 (XML)
│   ├── data/                           # 109 capas GeoJSON oficiales + 10 VGI (119 capas totales)
│   ├── config/config.json              # Configuración JSON sincronizada
│   └── docs/                           # Catálogos Excel (.xlsx) de acceso público
├── backend/servidor_vgi.py             # Servidor proxy Flask opcional para CORS
├── netlify/functions/                  # Endpoints serverless ligeros para Netlify
├── netlify.toml                        # Configuración de despliegue y headers de seguridad
├── scripts/
│   ├── db/
│   │   ├── 01_schema_postgis.sql       # Esquema DDL PostGIS, tablas, índices GIST y RPC
│   │   └── 02_seed_metadata.sql        # Inserción de metadatos de las 109 capas oficiales
│   ├── subir_base_datos_supabase.py    # Pipeline CLI de sincronización y subida CDN
│   ├── cargar_entidades_postgis.py     # Ingesta masiva de 129.262 entidades en PostGIS
│   ├── generar_catalogos_excel.py      # Generador de matrices Excel (.xlsx) con openpyxl
│   └── extractor_vgi.py                # Extractor automatizado Overpass QL
├── docs/
│   ├── ARQUITECTURA.md                 # Especificación técnica del sistema y diagramas
│   ├── BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md # Compendio de 125 fuentes APA (Corpus Científico + Atlas)
│   ├── GUIA_BASE_DATOS_SUPABASE.md     # Manual de aprovisionamiento PostGIS en la nube
│   ├── TRAZABILIDAD_ACADEMICA.md       # Memoria metodológica y epistemológica (Fondecyt)
│   ├── catalogo_fuentes_vgi.xlsx       # Matriz analítica de fuentes colaborativas
│   ├── categorias_tematicas_osm.xlsx   # Matriz de categorías, descriptores y 125 citas APA
│   └── perfil_metadatos_vgi.xlsx       # Estructura ISO 19115 nacional
├── MANUAL_USO.md                       # Manual operativo para los 4 perfiles territoriales
├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md # Protocolo de integridad cartográfica y CI/CD
└── .github/workflows/
    ├── deploy.yml                      # Despliegue continuo
    └── supabase_keepalive.yml          # Ping automático cada 3 días anti-pausa
```

---

## 9. Arranque rápido y Pipeline CLI

```bash
# 1. Clonar el repositorio
git clone https://github.com/GEOJOTA/atlas_vgi_uah.git
cd atlas_vgi_uah

# Opción A: Abrir directamente en el navegador (cliente estático puro)
open src/index.html

# Opción B: Servidor local simple
python3 -m http.server 8080 --directory src
# → http://localhost:8080

# 2. Pipeline CLI de Procesamiento y Base de Datos (Python 3):
# Auditoría de integridad de capas GeoJSON:
python3 scripts/subir_base_datos_supabase.py --dry-run

# Sincronización con Supabase Storage CDN:
export SUPABASE_URL="https://[TU-PROYECTO].supabase.co"
export SUPABASE_KEY="TU_SERVICE_ROLE_KEY"
python3 scripts/subir_base_datos_supabase.py --upload-storage

# Regeneración de catálogos Excel:
python3 scripts/generar_catalogos_excel.py
```

---

## 10. Fuentes de datos y licencias

| Fuente | Licencia | Rol en el Atlas |
|---|---|---|
| **OpenStreetMap** | ODbL 1.0 (© colaboradores OSM) | Capas VGI temáticas (CAT-01 a CAT-10) |
| **GBIF / iNaturalist** | CC-BY 4.0 / CC0 | Biodiversidad urbana y ciencia ciudadana (CAT-08) |
| **MINVU GeoIDE** | Datos Públicos del Estado (Ley 20.285) | IPT PRC Santiago, PRMS, parques urbanos, campamentos |
| **IDE Chile / SUBDERE** | Datos Públicos del Estado | DPA, sedes municipales, juzgados de familia |
| **INE Censo 2024** | Datos Públicos del Estado | Microdatos censales de población y vivienda a nivel de manzana |
| **MOP / GEOMOP / DGA** | Datos Públicos del Estado | Red vial, obras concesionadas, estaciones hidrométricas y cuencas |
| **CMN** | Datos Públicos del Estado | Monumentos Históricos, Zonas Típicas y Sitios de Memoria |
| **MDSF (BiDat)** | Datos Públicos del Estado | Unidades Vecinales Oficiales e indicadores del Registro Social de Hogares |
| **DIFROL** | Datos Públicos del Estado | Pasos fronterizos internacionales y faja de seguridad |
| **CNE** | Datos Públicos del Estado | Infraestructura de transmisión y subestaciones eléctricas |

---

## 11. Cómo Contribuir al Atlas (Guía Simple y Trazabilidad Ciudadana)

Cualquier persona u organización (vecinos, dirigentas/es, colectivos barriales, estudiantes, ONGs) puede aportar información al Atlas de forma simple:

- **1. Mapeo Directo en OpenStreetMap:** Utiliza el editor web [iD en openstreetmap.org](https://www.openstreetmap.org/) para registrar o actualizar almacenes, cruces accesibles, veredas o árboles en Barrio Brasil. Al guardar, usa el hashtag `#AtlasVGI_UAH` para asegurar su trazabilidad comunitaria.
- **2. Reporte o Propuesta de Nuevas Capas:** Abre un [Issue en GitHub](https://github.com/GEOJOTA/atlas_vgi_uah/issues) con el nombre de la capa, fuente, ubicación y organización responsable.
- **3. Carga Local en el Visor:** Arrastra archivos `.GeoJSON`, `.KML` o `.CSV` al [Visor Web](https://atlasvgiuah.netlify.app/) para cruzar tus datos territoriales en tiempo real de forma privada y sin costo.
- **4. Desarrollo y Datos (Fork & PR):** Consulta nuestra [Guía de Contribución Abierta, Trazabilidad y Arquitectura (CONTRIBUTING.md)](CONTRIBUTING.md) para detalles completos de desarrollo *zero-build* en Vanilla JS, CSS puro, scripts Python (openpyxl/ETL), clúster PostGIS 3.3, esquemas normalizados de 14 atributos y la tríada de licencias abiertas (AGPLv3, ODbL 1.0, CC BY-SA 4.0).

---

## 12. Cita académica y marco de investigación

```bibtex
@misc{MF2026atlas,
  author       = {Fuenzalida, Manuel},
  title        = {Atlas de Información Geográfica Voluntaria para la Gestión Territorial: Caso Piloto Barrio Brasil},
  year         = {2026},
  howpublished = {Departamento de Geografía, Universidad Alberto Hurtado},
  address      = {Santiago, Chile},
  url          = {https://github.com/GEOJOTA/atlas_vgi_uah}
}
```

_Desarrollado en el marco del Proyecto Fondecyt Regular sobre VGI y Gobernanza Territorial — Investigador Responsable: Dr. Manuel Fuenzalida (Universidad Alberto Hurtado)._

---

*Atlas VGI Barrio Brasil — Nodo GeoAbierto. Plataforma optimizada con PostgreSQL 17 + PostGIS 3.3. Septiembre 2026.*
