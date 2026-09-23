# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
### Nodo GeoAbierto — Caso Piloto: Barrio Brasil · Universidad Alberto Hurtado (Santiago, Chile)

Plataforma web de código abierto para consultar, evaluar, visualizar y documentar **Información Geográfica Voluntaria (VGI)** en el territorio de Barrio Brasil. Desarrollado en el Departamento de Geografía de la Universidad Alberto Hurtado (2026), en el marco de la investigación sobre VGI, infraestructuras de datos espaciales y gestión territorial.

Integra un **visor cartográfico interactivo 2D de alta resolución (Leaflet 1.9.4)**, métricas de calidad de datos (ohsome API / Índice de Calidad VGI), evaluación normativa territorial (PRC Santiago / OGUC), **122 capas cartográficas integradas** (10 categorías maestras VGI y 112 capas oficiales del Estado de Chile desde GEOMOP, MINVU, Geoportal, DGA, DIFROL, MINAGRI, BiDat, INE Censo 2024 multiescalar, UOCT / MTT y CNE), base de datos espacial en la nube **PostgreSQL 17.6 + PostGIS 3.3 (Supabase)** con entidades espaciales vectorizadas e indexadas con GIST, bucket público de almacenamiento CDN (`atlas-geojson`), consultas espaciales en milisegundos por RPC y exportación a GeoJSON, CSV, metadatos ISO 19115/19139 y catálogos Excel sincronizados.

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
| **🔬 Investigadores / ONGs** | UAH, TECHO-Chile, SUR, Fundación TERRAM, MapBiomas | Reproyección métrica EPSG:32719, densidades territoriales, series históricas ohsome, citas APA |

---

## 4. Las 10 categorías maestras VGI

Estandarizadas bajo las taxonomías de **OpenStreetMap**, **GBIF Darwin Core** y el estándar **ISO 19110 / ISO 19115**:

| Cód. | Categoría Maestra | Fuente OSM / GBIF | Enfoque Territorial Barrio Brasil |
|---|---|---|---|
| **CAT-01** | Educación y Universidad | `amenity=university|college|school|library` | Campus patrimonial UAH (Almirante Barroso, Erasmo Escala), facultades, colegios, liceos y bibliotecas |
| **CAT-02** | Servicios, Comercio y Salud Barrial | `shop=*`, `amenity=pharmacy|clinic|doctors|cafe|bank` | Comercio de proximidad Av. Brasil/Huérfanos, farmacias, CESFAM N° 5, clínicas comunitarias y bancos |
| **CAT-03** | Movilidad y Transporte Público | `railway=station|subway_entrance`, `highway=bus_stop` | Red Movilidad, paraderos de buses, estaciones de Metro Los Héroes (L1/L2), Santa Ana (L2/L5) y Cumming (L5) |
| **CAT-04** | Movilidad Activa y Ciclovías | `highway=cycleway`, `amenity=bicycle_parking|bicycle_rental` | Ciclovías segregadas Rosas y Brasil, ciclobandas, estacionamientos de bicicletas públicos/UAH y talleres |
| **CAT-05** | Áreas Verdes, Deporte y Espacio Público | `leisure=park|playground|pitch`, `landuse=grass` | Plaza Brasil, bandejones arbolados Alameda, canchas comunitarias, juegos infantiles y bebederos |
| **CAT-06** | Patrimonio Histórico y Cultura | `historic=*`, `heritage=*`, `amenity=arts_centre|theatre` | Zona Típica Barrio Brasil, Inmuebles de Conservación Histórica (ICH), Basílica del Salvador, Casonas UAH y teatros |
| **CAT-07** | Accesibilidad Universal y Caminabilidad | `kerb=*`, `wheelchair=*`, `tactile_paving=*`, `highway=crossing` | Vados peatonales y rebajes de solera D.S. 50 MINVU, baldosas táctiles podotáctiles y cruces semaforizados |
| **CAT-08** | Biodiversidad Urbana y Arbolado | `natural=tree|tree_row|wood` + GBIF Occurrence API | Arbolado viario de alineación (plátano oriental, jacarandá, quillay) y registros biológicos Darwin Core |
| **CAT-09** | Edificaciones y Huella Urbana | `way["building"]`, `relation["building"]` | Catastro poligonal de edificaciones, huellas de manzanas, volumetría construida y cálculo de superficie en m² (EPSG:32719) |
| **CAT-10** | Coberturas y Usos de Suelo | `landuse=*`, `natural=*`, `leisure=*` | Zonificación funcional del suelo urbano (residencial, comercial, dotacional, recreativo) y superficies biofísicas |

---

## 5. Capas oficiales del Estado de Chile integradas (112 capas oficiales + 10 VGI = 122 capas)

El visor integra **112 capas cartográficas oficiales de la Administración del Estado de Chile**, amparadas por la **Ley N° 20.285 de Transparencia**, organizadas en la nueva **Consola Técnica GIS (Workbench Profesional)** con buscador dinámico, filtros por categoría y 6 macro-grupos temáticos:

1. 📜 **Normativa Urbanística & Instrumentos de Planificación Territorial (MINVU / PRC Santiago / PRMS / DPA):**
   - Zonificación PRC Santiago (192 polígonos zonales), Usos de Suelo PRMS, Áreas Verdes Normativas IPT, Zonas de Riesgo IPT (Art. 2.1.17 OGUC), Fajas de Resguardo y Límites Urbanos Oficiales (Art. 52 LGUC).
2. 🌳 **Medio Ambiente, Parques, Espacio Público & Recursos Hídricos (MMA / MINVU / DGA / CONAF / CIREN):**
   - Catastro de Parques Urbanos MINVU, Red Hidrométrica Nacional BNA (DGA), Inventario de Humedales Urbanos (Ley 21.202), Sistema Nacional de Áreas Silvestres Protegidas (SNASPE CONAF), Cobertura de Canales de Riego (CNR), Cuencas Hidrográficas BNA y Carbono Orgánico del Suelo (COS CIREN).
3. 👥 **Comunidades, RSH, Vulnerabilidad Socioterritorial & Demografía Multiescalar (MDSF / MINVU / INE Censo 2024):**
   - **Integración Multiescalar Censo 2024 (INE / Región Metropolitana):** 5 niveles territoriales independientes:
     - **Escala 1 — Marco Regional RM:** 1 polígono macroterritorial con delimitación oficial regional.
     - **Escala 2 — Límites Urbanos Censales RM:** 106 áreas urbanas censales consolidadas con población y sexo.
     - **Escala 3 — Localidades y Asentamientos RM:** 511 entidades pobladas urbanas y rurales con desglose demográfico.
     - **Escala 4 — Zonas y Distritos Censales RM:** 1.865 polígonos distritales con variables sociodemográficas avanzadas.
     - **Escala 5 — Manzanas Censales Santiago / Barrio Brasil:** 1.711 manzanas censales con microdatos completos de población, grupos etarios, inmigración y viviendas.
   - Unidades Vecinales Oficiales 2026 (Ley 19.418), Catastro Oficial de Campamentos MINVU, Condominios Sociales (Ley 21.442) y 10 conjuntos de datos sociodemográficos y de inversión pública del Registro Social de Hogares (RSH), IGVUST e iniciativas BIP (BiDat MDSF / Hacienda).
4. 🏛️ **Equipamiento Público, Educación, Salud & Patrimonio (CMN / MINEDUC / MINSAL / IND):**
   - Monumentos Históricos e Inmuebles de Conservación Histórica (ICH), Sitios de Memoria CMN, Jardines Infantiles (JUNJI e Integra), Establecimientos de Educación Escolar y Superior (MINEDUC), Hospitales y CESFAM (DEIS MINSAL), Infraestructura Deportiva IND y Jardines Botánicos.
5. 🛡️ **Seguridad, Bomberos & Emergencias (Carabineros / CBS / SENAPRED / DIFROL):**
   - Cuarteles del Cuerpo de Bomberos de Santiago, Comisarías de Carabineros de Chile (Plan Cuadrante), Pasos Fronterizos Internacionales Oficiales (DIFROL) y Zonas de Seguridad Fronteriza (DFL N° 4).
6. 🚲 **Movilidad, Transporte, Red Semafórica UOCT, Red Metro, Inversión Pública & Economía (UOCT / MTT / MOP / BIP / CNE / ODEPA):**
   - **Red de Semáforos Conectados UOCT RM (Oficio N° 26105 / 2026 - Solicitud AN001T0026930):** 3.483 intersecciones semaforizadas operativas y centralizadas en las 47 comunas de la RM, con datos técnicos completos de tecnología, controlador, enlace de comunicación y coordenadas WGS 84.
   - Red de Estaciones de Metro de Santiago (Líneas 1, 2 y 5), Red Ferroviaria EFE, Red Vial Nacional (GEOMOP), Contratos Concesionados MOP, Banco Integrado de Proyectos (BIP 2019-2027), Subestaciones Eléctricas SEN (CNE) y Ferias Libres (ODEPA).

---

## 6. Base de Datos Espacial en la Nube (PostgreSQL 17.6 + PostGIS 3.3 en Supabase)

El Atlas cuenta con un clúster espacial en la nube **PostgreSQL 17.6 con extensión PostGIS 3.3**, 100% libre, gratuito y permanente:

- **129.262 Entidades Vectoriales Vectorizadas:** Almacenadas en la tabla relacional `public.capas_entidades`, optimizando más de 630 MB de archivos GeoJSON de texto a 210 MB binarios con geometrías validadas.
- **Catálogo de Metadatos Relacional:** Tabla `public.capas_metadata` con los 107 registros oficiales, citas APA 7ª ed., instituciones de procedencia y conteos de entidades.
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
| **⚡ BD PostGIS** | Pestaña de conexión y telemetría en tiempo real con clúster PostgreSQL 17 + PostGIS 3.3 en Supabase con fallback local autónomo |
| **Calidad VGI (ohsome)** | ohsome API v1/v2: completitud, evolución temporal P1Y, densidad espacial métrica (EPSG:32719), OQT Score, contribuyentes activos; OSMCha para integridad de changesets |
| **Índice de Calidad VGI (ICV)** | Score compuesto por categoría: completitud + actualidad + consistencia geométrica + densidad |
| **CIN-VGI (Inspector Normativo)** | Inspector territorial por clic: PRC Santiago, usos permitidos/prohibidos (Art. 2.1.24 OGUC), riesgos (Art. 2.1.17 OGUC), patrimonio; exporta certificado .txt con disclaimer legal (Art. 116 LGUC) |
| **Importador de capas locales** | KMZ (JSZip en memoria), KML, GeoJSON, GPX, CSV con detección automática de coordenadas y auditoría normativa directa |
| **Taginfo API Explorer** | Telemetría planetaria en tiempo real de claves y valores OSM con recuentos globales |
| **Biodiversidad Urbana GBIF** | Ocurrencias biológicas de ciencia ciudadana con autocompletado taxonómico (Species API) y banderas Darwin Core |
| **Metadatos ISO 19115 / 19139** | Fichas técnicas exportables a JSON y XML oficial de IDE Chile (SNIT / GeoNetwork) |
| **Catálogos Excel (.xlsx)** | Libros OpenXML de 4 hojas con 10 categorías VGI, 134 descriptores territoriales, 112 capas oficiales y 125 citas APA |

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
│   │       ├── ide_chile.js            # Catálogo oficial de 112 capas del Estado (UOCT/MTT incluido)
│   │       ├── evaluador_normativo.js  # Motor CIN-VGI / PRC Santiago / OGUC
│   │       ├── ohsome.js               # Métricas calidad VGI (ohsome API dual v1/v2)
│   │       ├── calidad_analyst.js      # ICV e inspector changesets OSMCha
│   │       ├── importador_capas.js     # Importador multi-formato (KMZ/KML/GeoJSON/GPX/CSV)
│   │       ├── taginfo.js              # Validador planetario Taginfo API
│   │       ├── gbif.js                 # Biodiversidad urbana y Darwin Core
│   │       ├── geodesia.js             # Reproyección Snyder EPSG:32719 UTM 19S
│   │       └── metadatos.js            # Generador ISO 19115 (JSON) e ISO 19139 (XML)
│   ├── data/                           # 112 capas GeoJSON oficiales + 10 VGI
│   ├── config/config.json              # Configuración JSON sincronizada
│   └── docs/                           # Catálogos Excel (.xlsx) de acceso público
├── backend/servidor_vgi.py             # Servidor proxy Flask opcional para CORS
├── netlify/functions/                  # Endpoints serverless ligeros para Netlify
├── netlify.toml                        # Configuración de despliegue y headers de seguridad
├── scripts/
│   ├── db/
│   │   ├── 01_schema_postgis.sql       # Esquema DDL PostGIS, tablas, índices GIST y RPC
│   │   └── 02_seed_metadata.sql        # Inserción de metadatos de las 107 capas
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

## 11. Cita académica y marco de investigación

```bibtex
@misc{lescano2026atlas,
  author       = {Lescano Villegas, Juan Pablo},
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
