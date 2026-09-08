# Arquitectura del Sistema — Atlas de Información Geográfica Voluntaria para la Gestión Territorial

**Repositorio Oficial:** [`https://github.com/GEOJOTA/atlas_vgi_uah.git`](https://github.com/GEOJOTA/atlas_vgi_uah.git)  
**Entorno Operativo:** Web estática desacoplada + Funciones Serverless + Pipeline CLI en Python 3  
**Área Piloto:** Barrio Brasil / Manzana Campus Universidad Alberto Hurtado (Santiago Centro, Chile)  
**Sistema Geodésico Oficial:** WGS 84 / UTM Huso 19 Sur (EPSG:32719)  
**Estándares Clave:** ISO 19115-1:2014, ISO 19139:2007, ISO 19157:2013, ISO 19110:2016, IDE Chile (SNIT)

---

## 1. Principios de Diseño y Arquitectura General

El sistema sigue una arquitectura centrada en el cliente (*client-side first*) con alta resiliencia de red y costo de infraestructura cero:
1. **Desacoplamiento e Inmediatez:** La totalidad de las consultas espaciales, transformaciones geodésicas, renderizado cartográfico y validación de metadatos se ejecuta directamente en el navegador del usuario final sin requerir base de datos privativa ni servidores intermediarios obligatorios.
2. **Resiliencia y Conmutación de Espejos (Failover):** Los módulos clientes incorporan listas de servidores alternativos, conmutación automática de versiones (ej: ohsome v2 a v1) y controladores de tiempo de espera (`AbortController`).
3. **Capa Serverless Auxiliar:** Para entornos corporativos con restricciones estrictas de CORS o límites de peticiones, se dispone de endpoints serverless en Netlify Functions (`netlify/functions/`) y un servidor local en Python (`backend/servidor_vgi.py`).
4. **Pipeline CLI Científico:** Se incluye un motor paralelo en Python 3 puro (`scripts/extractor_vgi.py` y `scripts/generar_catalogos_excel.py`) que replica el modelo de datos y genera productos reproducibles en GeoJSON, CSV y hojas de cálculo OpenXML (.xlsx).

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              NAVEGADOR DEL USUARIO (FRONTEND WEB)                                │
│                                                                                                   │
│   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                 SELECTOR DE ACTOR TERRITORIAL (PERFILES DE USUARIO)                       │   │
│   │   🏛️ Institucional (IDE/Muni) │ 👥 Comunitario │ 🧭 Voluntario OSM │ 🏢 ONG / Fondos Públicos │   │
│   └─────────────────────────────────────────────┬─────────────────────────────────────────────┘   │
│                                                 │                                                 │
│   ┌─────────────────────────────────────────────▼─────────────────────────────────────────────┐   │
│   │                  VISOR DUAL 2D/3D (mapa.js / Leaflet 1.9.4 & globo.js / Globe.gl 3D)         │   │
│   │   Bbox Dinámico Interactivo │ 8 Capas Temáticas VGI │ Popups Normalizados │ Export QGIS   │   │
│   └──────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬──────────┬───────┘   │
│          │             │             │             │             │             │          │           │
│   ┌──────▼──────┐┌─────▼──────┐┌─────▼──────┐┌─────▼──────┐┌─────▼──────┐┌─────▼────┐┌───▼───────┐│
│   │   osm.js    ││ taginfo.js ││  ohsome.js ││calidad_a.js││  gbif.js   ││ umap.js  ││geodesia.js││
│   │ Overpass QL ││ Taginfo v4 ││ ohsome Dual││ OQT / OSMCha││Occur/Specs││ UMap Geo ││EPSG:32719 ││
│   │ CAT-01..10  ││ Telemetría ││ v1/v2 HeiGIT││ Changesets ││DarwinCore ││ Embebido ││Snyder UTM ││
│   └──────┬──────┘└─────┬──────┘└─────┬──────┘└─────┬──────┘└─────┬──────┘└─────┬────┘└───┬───────┘│
│          │             │             │             │             │             │         │          │
│          └─────────────┴─────────────┼─────────────┴─────────────┴─────────────┴─────────┘          │
│                                      │                                                               │
│   ┌──────────────────────────────────▼────────────────────────────────────────────────────────┐   │
│   │                          DICCIONARIO TERRITORIAL (diccionario.js)                         │   │
│   │     118 Descriptores Chile: 37 Capas Oficiales IDE Chile vs 81 Brechas VGI Comunitarias  │   │
│   └──────────────────────────────────┬────────────────────────────────────────────────────────┘   │
│                                      │                                                               │
│   ┌──────────────────────────────────▼────────────────────────────────────────────────────────┐   │
│   │                    GENERADOR DUAL DE METADATOS ESPACIALES (metadatos.js)                  │   │
│   │            ISO 19115:2014 (Núcleo JSON) + ISO 19139:2007 (XML Oficial IDE Chile)          │   │
│   └───────────────────────────────────────────────────────────────────────────────────────────┘   │
└──────────────────┬──────────┬──────────┬──────────┬──────────┬────────────────────────────────────┘
                   │          │          │          │          │
                   ▼          ▼          ▼          ▼          ▼
             ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
             │ Overpass ││ Taginfo  ││  ohsome  ││  OSMCha  ││   GBIF   │
             │ API OSMF ││  API v4  ││ API v1/v2││Changesets││ Species/ │
             │ Mirrors  ││Geofabrik ││  HeiGIT  ││ Community││Occurrence│
             └──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
```

---

## 2. Inventario de APIs Externas Integradas en el Frontend

El Atlas articula 8 servicios y protocolos de datos geoespaciales y colaborativos de escala planetaria:

| API / Servicio | Endpoint Base Oficial | Módulo Integrador | Función y Aplicación en el Atlas |
|---|---|---|---|
| **Overpass API v0.7** | `https://overpass-api.de/api/interpreter`<br>`https://lz4.overpass-api.de/api/interpreter`<br>`https://z.overpass-api.de/api/interpreter` | `src/js/modulos/osm.js` | Extracción vectorial de geometrías (nodos, vías, relaciones) según las 8 macro-categorías temáticas y filtros personalizados Overpass QL dentro del Bbox territorial. |
| **Taginfo API v4** | `https://taginfo.openstreetmap.org/api/4/` | `src/js/modulos/taginfo.js` | Consulta interactiva en tiempo real del recuento global de objetos (nodos, vías, relaciones), porcentaje de representatividad en el planeta y valores más frecuentes para cualquier clave OSM. |
| **ohsome API (Dual v1 / v2)** | `https://api.ohsome.org/v1` (OSHDB Java)<br>`https://api.ohsome.org/v2` (Citus Python) | `src/js/modulos/ohsome.js` | Auditoría de evolución histórica espacio-temporal (series anuales P1Y), volumen de elementos vigentes, masa crítica de colaboradores activos e intensidad de contribución comunitaria. |
| **ohsome Quality Analyst (OQT)** | Marco conceptual Herfort et al. (2023) / HeiGIT | `src/js/modulos/calidad_analyst.js` | Estimación del **Índice de Saturación de Mapeo**, clasificación de la tendencia territorial (*Levantamiento Dinámico* vs. *Consolidación Barrial*) y completitud de atributos críticos (`name`, `addr:street`, `wheelchair`, `operator`). |
| **OSM Changesets API & OSMCha** | `https://api.openstreetmap.org/api/0.6/changesets`<br>`https://osmcha.org/changesets/{id}` | `src/js/modulos/calidad_analyst.js` | Control de cambios y validación de ediciones recientes en el Bbox de Barrio Brasil o por ID numérico de changeset con evaluación heurística y enlace directo a OSMCha. |
| **GBIF Occurrence & Species API** | `https://api.gbif.org/v1/occurrence/search`<br>`https://api.gbif.org/v1/species/suggest` | `src/js/modulos/gbif.js` | Monitoreo de biodiversidad urbana y ciencia ciudadana (iNaturalist, museos), autocompletado taxonómico en vivo y extracción de banderas de calidad científica Darwin Core (`issues`). |
| **UMap OpenStreetMap France** | `https://umap.openstreetmap.fr/es/map/...` | `src/js/modulos/umap.js` | Integración de proyectos cartográficos colaborativos locales, visualizador embebido y extracción de datos GeoJSON comunitarios. |
| **ArcGIS FeatureServer (INE / IDE Chile)** | `https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/CPV2024_Microdato_gdb/FeatureServer/7` | `src/js/modulos/ide_chile.js` | Microdatos georreferenciados del Censo de Población y Vivienda 2024 a nivel de manzana con recuento de población, hombres, mujeres y viviendas. |
| **ArcGIS FeatureServer & WMS (MINVU / DDU)** | `https://geoide.minvu.cl/server/rest/services/` (IPT/Patrimonio, Catastro Parques, Barrios Históricos) | `src/js/modulos/ide_chile.js` | Catastro oficial de Inmuebles de Conservación Histórica (ICH), Zonas Típicas, Parques Urbanos y polígonos del Programa Quiero Mi Barrio. |
| **MINVU IPT FeatureServer (Normativa Urbanística)** | `https://geoide.minvu.cl/server/rest/services/IPT/` (PRC Santiago, PRMS Uso Suelo, Áreas Verdes IPT, Áreas de Riesgo, Resguardo, Límite Urbano) | `src/js/modulos/ide_chile.js` | Instrumentos de Planificación Territorial (IPT) y capas normativas: zonificación comunal (192 zonas), usos permitidos/prohibidos, ordenanza metropolitana PRMS, áreas de riesgo natural y fajas de protección. |
| **MINVU Catastros & Programas** | `https://geoide.minvu.cl/server/rest/services/Catastros/` y `Planes_Programas/` | `src/js/modulos/ide_chile.js` | Catastro Oficial de Campamentos 2024, Condominios Sociales (Ley 21.442), Inventario de Humedales (Ley 21.202), Unidades Vecinales con RSH (MDS) y Red de Ciclovías. |
| **Evaluador Normativo Territorial** | Motor cliente JS Point-in-Polygon + Ficha HUD | `src/js/modulos/evaluador_normativo.js` | Consulta interactiva por clic de zonificación PRC Santiago (UPERM/UPROH), afectación por riesgo (Art. 2.1.17 OGUC), límites urbanos y emisión de Certificados CIN-VGI. |
| **Globe.gl / Three.js WebGL** | `https://unpkg.com/globe.gl@2.46.2/dist/globe.gl.min.js` | `src/js/modulos/globo.js` | Perspectiva esférica 3D moderna sobre globo terráqueo con proyección plana 2D de entidades (polígonos, líneas y puntos sin alturas artificiales) y sincronización reactiva instantánea. |

---

## 3. Módulos del Sistema Frontend (`src/js/modulos/`)

La lógica de la aplicación se distribuye en 16 módulos desacoplados que exportan sus interfaces al objeto global `window`:

### 3.1 `mapa.js` (Visor Cartográfico Leaflet)
- Motor: Leaflet 1.9.4.
- Capas base libres: CartoDB Positron, OpenStreetMap Estándar y OpenTopoMap.
- Herramienta de encuadre y selector reactivo de Bounding Box con dibujo interactivo.
- Carga dinámica, agrupación y toggle de las 8 capas temáticas VGI.
- Popups estandarizados con atributos normalizados, enlaces al diccionario y licencias.

### 3.2 `osm.js` (Cliente Overpass API)
- Construcción y serialización de consultas espaciales Overpass QL para CAT-01 a CAT-08.
- Sistema de failover con conmutación automática entre 3 servidores espejo.
- Conversión de respuestas XML/JSON a GeoJSON FeatureCollection con coordenadas WGS84.

### 3.3 `taginfo.js` (Cliente Taginfo API v4)
- Consulta asíncrona de telemetría global (`/tag/stats` y `/key/values`).
- Renderizado de tarjetas interactivas de uso planetario en Panel 01 y Panel 06.

### 3.4 `calidad_analyst.js` (Control de Calidad OQT y Validación OSMCha)
- Parser XML de `changesets?bbox=...` e inspección directa de changesets individuales por ID (`/changeset/{id}`).
- Motor de reglas heurísticas de calidad (longitud de comentarios, volumen de cambios >500, identificación de software de edición como JOSM, iD, StreetComplete, Vespucci).
- Algoritmo de cálculo del Índice de Saturación de Mapeo y evaluación de madurez barrial.

### 3.5 `ohsome.js` (Motor Histórico HeiGIT)
- Detección automática del horizonte temporal máximo (`toTimestamp` vía `/metadata`).
- Cálculo de series cronológicas anuales (elementos, usuarios, contribuciones).
- Soporte dual: v1 libre sin token (OSHDB) y v2 optimizada con API Key opcional.

### 3.6 `gbif.js` (Biodiversidad y Taxonomía)
- Autocompletado taxonómico en vivo (`sugerirTaxon`) conectado a la Species API.
- Búsqueda de registros por Bbox y extracción de banderas Darwin Core (`issues`).

### 3.7 `umap.js` (Cartografía Colaborativa)
- Extracción de identificadores y normalización de URLs de UMap.
- Detección de capas vectoriales GeoJSON subyacentes.

### 3.8 `geodesia.js` (Motor Geodésico Conforme EPSG:32719)
- Implementación conforme de las ecuaciones de Snyder (USGS Bulletin 1532 / 1395) para proyección Transverse Mercator desde elipsoide WGS84 a **UTM Huso 19 Sur (EPSG:32719)**.
- Parámetros geodésicos: $a = 6.378.137\text{ m}$, $1/f = 298,257223563$, $\lambda_0 = -69^\circ\text{ O}$, $k_0 = 0.9996$, Falso Este $= 500.000\text{ m}$, Falso Norte $= 10.000.000\text{ m}$.
- Conversión sistemática de superficies a metros cuadrados ($\text{m}^2$), hectáreas ($\text{ha}$) y kilómetros cuadrados ($\text{km}^2$), eliminando distorsiones angulares a la latitud de Santiago (-33.45°).

### 3.9 `metadatos.js` (Generador Dual ISO 19115 / ISO 19139)
- Generación de JSON con elementos núcleo de ISO 19115-1:2014.
- Generación y descarga de XML conforme a **ISO 19139 / Perfil Nacional de Metadatos de Chile (IDE Chile / SNIT)**, validado con namespaces OGC (`gmd`, `gco`, `gml`) para interoperabilidad en GeoNetwork y GeoNode.

### 3.10 `diccionario.js` (Catálogo Territorial de 118 Descriptores)
- 118 etiquetas y descriptores territoriales estratégicos y escalables para Chile clasificados en 8 macro-categorías (incorporando etiquetas OpenStreetMap y descriptores Darwin Core de GBIF).
- **Sinceramiento riguroso:** 37 capas con homología oficial demostrable en IDE Chile vs. 81 brechas VGI comunitarias (`"Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)"`).
- Filtros interactivos de un clic: `[🌐 Todos]`, `[⚡ Solo Brechas VGI (81)]`, `[🏛️ Capas Oficiales IDE (37)]`, `[🏛️ Esquema VGI]`, y filtros temáticos CAT.

### 3.11 `licencias.js` (Marco Jurídico de Licenciamiento)
- Gestión del marco tripartito copyleft (ODbL 1.0 para datos espaciales OSM, CC BY-SA 4.0 para contenidos y fichas, GNU GPL v3 para código fuente).
- Panel de descarga directa de los libros Excel (.xlsx) de catálogos y trazabilidad.

### 3.12 `manual.js` (Documentación Técnica y Manual de Uso in-app)
- Documentación exhaustiva estructurada en 9 secciones temáticas correspondientes a los paneles `00` a `08`.
- Guía de inicio rápido perfilada por actores territoriales.
- Fichas metodológicas de las 8 macro-categorías con ejemplos Overpass QL, consultas ohsome y bibliografía APA.

### 3.13 `app.js` (Orquestador Central de Interfaz)
- Coordinación de eventos entre los 15 submódulos, sincronización del Bbox entre paneles, actualización de previsualizaciones Overpass QL, gestión de perfiles de usuario y renderizado de resultados.

### 3.14 `importador_capas.js` (Motor de Importación de Capas Espaciales Multi-formato)
- Ingestión client-side de archivos espaciales locales en formatos estándar:
  - **.kmz (Google Earth)**: Descompresión binaria en memoria del navegador mediante **JSZip** y conversión a GeoJSON mediante `@tmcw/togeojson` con fallback XML nativo.
  - **.kml (Keyhole Markup Language)**: Parseo directo de Placemarks de puntos, líneas y polígonos.
  - **.geojson / .json**: Colecciones de objetos espaciales RFC 7946 en WGS84.
  - **.gpx (GPS Exchange Format)**: Waypoints, tracks y rutas de navegación comunitaria.
  - **.csv / .tsv (Tablas delimitadas)**: Detección inteligente de variantes de columnas de coordenadas (`lat`, `latitude`, `y` / `lon`, `longitude`, `x`), normalización de decimales y generación de entidades puntuales.
- Asignación cromática rotativa y metadatos unificados (`_capaId`, `_color`, `_colorGlobo`, `_fuente`).
- Sincronización inmediata con el visor Leaflet 2D y el Globo 3D, junto a control de encuadre, alternancia de visibilidad y auditoría normativa directa.

### 3.15 `evaluador_normativo.js` (Motor de Consulta y Evaluación Espacial Normativa Territorial)
- Auditoría espacial puntual y cruzada mediante algoritmos point-in-polygon en tiempo real:
  - **Zonificación PRC Santiago y Diccionario Normativo**: Resuelve de forma específica las zonas normativas comunales (`Zona D`, `Zona E`, `Zona B`, `Zona A`, `Zona F`, `Zona G`), asociando sus artículos respectivos de la Ordenanza Local y decretos del Diario Oficial.
  - **Desglose Exhaustivo de Prohibiciones (UPROH)**: Supera la fórmula genérica de la base de datos MINVU ("Todo uso no mencionado..."), detallando taxativamente las actividades prohibidas (industrias contaminantes, bodegas de acopio logístico masivo, talleres pesados con emanaciones, servitecas en pasajes interiores y ocio con impacto acústico vecinal D.S. 38/2011 MMA), fundamentado en el **Principio de Exclusión Negativa del Art. 2.1.24 de la OGUC**.
  - **Límite Urbano Oficial**: Verificación de área urbana amparada en Art. 52 LGUC.
  - **Áreas de Riesgo Normativas**: Alertas de inundación y remoción en masa (Art. 2.1.17 OGUC).
  - **Áreas Verdes y Resguardos**: Afectaciones de utilidad pública (Art. 59 LGUC) y franjas de amortiguación.
  - **Protección Patrimonial**: Zonas de Conservación Histórica (ZCH) e Inmuebles de Conservación Histórica (ICH) amparados por la Ley N° 17.288 (CMN) y Art. 60 LGUC.
- **Catálogo de Ordenanzas Oficiales y Guía de Acceso**: Provee hipervínculos directos al expediente oficial del MINVU (Portal IPT Código 13101: ordenanza en PDF, memoria y planos 1:5.000), portal de la DOM Santiago y LeyChile de la Biblioteca del Congreso Nacional.
- **Aviso Legal y Descargo de Responsabilidad (Disclaimer)**: Incorporación preceptiva en el visor y en el informe descargable del aviso legal que estipula el carácter referencial/académico del informe, aclarando que bajo ninguna circunstancia reemplaza o sustituye al Certificado de Informaciones Previas (CIP) emitido privativamente por el Director de Obras Municipales conforme al Art. 116 de la LGUC.
- Emisión instantánea y descarga del **Certificado de Informaciones Normativas VGI (CIN-VGI)** estructurado en 6 secciones oficiales en formato `.txt`.

### 3.16 `globo.js` (Visualizador Esférico 3D WebGL / Three.js vía Globe.gl)
- Proyección tridimensional de geometrías 2D sobre la esfera terrestre sin inventar alturas verticales artificiales ni extrusiones distorsionadas (`polygonAltitude: 0.005`).
- Eliminación de mapas de relieve (*bump maps*) y halos atmosféricos oclusivos para evitar el ocultamiento y enterramiento de polígonos bajo el terreno.
- Normalización cromática estricta en RGBA nativo para evitar fallos de renderizado en Three.js causados por cadenas hexadecimales con canal alfa de 8 dígitos.
- Líneas 1px estándar nítidas en Three.js (`pathStroke: null`) y marcadores de puntos cilíndricos proporcionados a la escala barrial (`pointRadius: 0.0012`).
- Ajuste de plano de corte cercano (`camera.near: 0.005`) para permitir zoom orbital ultra cercano sin desaparecer geometrías por frustum culling.
- Encuadre exclusivo centrado en **Barrio Brasil y entorno UAH** (`volarABarrioBrasil`), con soporte de vuelo hacia capas importadas (`volarACoordenadas`).
- Precarga automática de cartografía base barrial (edificaciones, patrimonio, espacio público) al conmutar a la vista 3D si no existen capas activas en sesión.

---

## 4. Perfiles de Actor Territorial (Gestión Orientada a Usuarios)

El sistema incorpora un conmutador de perfil en la cabecera (`#sel-perfil-usuario`) que adapta dinámicamente las prioridades del Atlas:

1. **🏛️ Perfil Institucional / Autoridades (IDE Chile / Municipalidad / SECPLAN):**
   - Prioriza la fiscalización del catastro comunal, el contraste de capas oficiales vs. brechas comunitarias, la exportación de metadatos ISO 19139 XML y la descarga de matrices Excel para sustentar instrumentos de planificación (PLADECO, PRC).
2. **👥 Perfil Comunitario / Organizaciones Vecinales y Ciudadanía:**
   - Facilita consultas inmediatas de 1 clic para equipamiento cotidiano (farmacias, panaderías, áreas verdes, paraderos, zonas de reciclaje), mapeo participativo en UMap y consulta toponímica en lenguaje claro.
3. **🧭 Perfil Voluntario / Mapeadores OSM y Ciencia Ciudadana:**
   - Habilita el constructor avanzado Overpass QL, validación global de etiquetas con Taginfo API, control de changesets en OSMCha e identificación de vacíos en microatributos (`wheelchair`, `surface`, `lit`).
4. **🎓 Perfil Académico / Geógrafos, Analistas SIG e Investigadores:**
   - Enfocado en análisis espacial cuantitativo, rigor geodésico con reproyección a EPSG:32719, cálculo de densidades por km², exportación GeoJSON para QGIS y trazabilidad con 104 fuentes bibliográficas en norma APA 7ª ed.

---

## 5. Modelo de Datos y Esquema Normalizado VGI (14 Atributos)

Cada entidad capturada desde las distintas plataformas se normaliza bajo un esquema de 14 campos compatibles con la norma ISO 19110 y el Catálogo de Objetos Geográficos de Chile:

| Campo Normalizado | Tipo de Dato | Equivalencia IDE Chile / ISO 19115 | Descripción y Función Territorial |
|---|---|---|---|
| `id_vgi` | Alfanumérico | `ID_OBJETO` (`gmd:identifier`) | Identificador unívoco global (`fuente/tipo/id`). |
| `categoria` | Código CAT | `gmd:topicCategory` (ISO 19115) | Clasificación en una de las 8 macro-categorías del Atlas. |
| `subtipo` | Texto | `SubclaseCatastral` | Denominación funcional específica (`pharmacy`, `park`, etc.). |
| `nombre` | Texto | `ToponimiaOficial` (`gmd:title`) | Nombre propio barrial o comercial del recinto. |
| `operador` | Texto | `PuntoDeContacto` (`gmd:CI_ResponsibleParty`) | Institución o empresa administradora responsable. |
| `direccion` | Texto | `LocalizacionDomiciliaria` | Calle y número catastral de acceso principal. |
| `accesibilidad` | Texto | `CalidadDeAccesoUniversal` | Condición para silla de ruedas (`yes`, `limited`, `no`). |
| `superficie_m2` | Numérico (Float) | `SuperficieMetricaM2` | Área euclidiana calculada en proyección EPSG:32719. |
| `superficie_ha` | Numérico (Float) | `SuperficieMetricaHa` | Superficie expresada en hectáreas ($1\text{ ha} = 10.000\text{ m}^2$). |
| `fuente` | Texto | `LinajeProcedencia` (`gmd:LI_Lineage`) | Plataforma de adquisición primaria (OSM, GBIF, UMap). |
| `fecha` | Fecha (ISO 8601) | `FechaDeRegistro` | Timestamp de captura o última edición registrada. |
| `licencia` | Texto | `RestriccionesLegales` (`gmd:MD_LegalConstraints`) | Marco jurídico aplicable (ODbL 1.0, CC-BY 4.0). |
| `coordenadas` | Array [Lon, Lat] | `SIRGAS_Chile` (EPSG:4326 / EPSG:5361) | Geometría espacial absoluta en grados decimales WGS84. |
| `ide_chile` | Texto | `CapaHomologaEstatal` | Homología oficial demostrable o declaración de Brecha VGI. |

---

## 6. Sistema Estético "Backrooms" (Atmósfera Liminal y Sobriedad)

La interfaz gráfica prescinde de componentes SaaS genéricos para adoptar un diseño sobrio y riguroso de archivo analógico:
- **Paleta Institucional Liminal:** Papel de archivo desaturado (`#D7D0B4`), niveles de panel elevado (`#E3DCC3`), tinta carbón profundo (`#1B1E15`), tinta de máquina de escribir desgastada (`#424939`), verde terminal búnker (`#2D4436`), ámbar de lámpara de sodio (`#A06D1A`), azul plomo de tubería (`#294455`) y juntas acústicas (`#B9B08C`).
- **Trama de Fondo Continua:** Rejilla ortogonal de **48px × 48px** que evoca placas de cielo falso acústico de oficinas gubernamentales o tablero milimétrico.
- **Geometría Rectilínea y Telemetría:** Bordes estrictamente en ángulo recto (`border-radius: 0;`), botones planos táctiles, tipografía monoespaciada de consola analógica (`IBM Plex Mono`) y marcador con pulso tenue de telemetría de fósforo CRT (`.marcador-parpadeo`).

---

## 7. Catálogos Estructurados en Excel (.xlsx) y Trazabilidad APA

En las carpetas `docs/` y `src/docs/` residen los libros de trabajo generados por `scripts/generar_catalogos_excel.py`:
1. `categorias_tematicas_osm.xlsx`:
   - Hoja 1: *Categorías Maestras* (10 macro-categorías escalables a nivel nacional, incluyendo Huella Construida y Coberturas de Suelo, calidad ISO 19157 y normativas chilenas).
   - Hoja 2: *Catálogo de Etiquetas Chile* (134 etiquetas y descriptores depurados y escalables a regiones: 48 capas oficiales vs 86 brechas VGI, integrando descriptores Darwin Core de GBIF).
   - Hoja 3: *Perfil de Atributos VGI* (14 campos normalizados con reproyección EPSG:32719).
   - Hoja 4: *Bibliografía APA 7ª ed.* (104 referencias formales científicas, institucionales y normativas, con restricción estricta de cero autocitación).
2. `catalogo_fuentes_vgi.xlsx`:
   - Hoja 1: *Catálogo Fuentes VGI* (10 fuentes y plataformas abiertas: OSM, ohsome, OQT, OSM Changesets, OSMCha, Taginfo, GBIF, UMap, iNaturalist, IDE Chile).
   - Hoja 2: *Inventario APIs y Endpoints* (11 especificaciones técnicas de endpoints, métodos HTTP, formatos, parámetros, cuotas de rate limit y módulos cliente).
3. `perfil_metadatos_vgi.xlsx`: Especificación de jerarquía y tipos de datos ISO 19115.

---

## 8. Infraestructura de Despliegue y Pruebas

- **Alojamiento:** Netlify con integración continua (`CI/CD`) vinculada a la rama `main` del repositorio `https://github.com/GEOJOTA/atlas_vgi_uah.git`.
- **Configuración Serverless:** `netlify.toml` con redirecciones y headers de seguridad.
- **Validación Automatizada:**
  - Sintaxis JavaScript validada mediante motor JavaScriptCore (`jsc -s`).
  - Verificación del generador de catálogos mediante `python3 scripts/generar_catalogos_excel.py`.
  - Verificación de paridad binaria entre `docs/` y `src/docs/`.

### 3.13 `ide_chile.js` (Integración de Servicios Oficiales IDE Chile & MINVU)
- Consumo directo de servicios **ArcGIS FeatureServer** filtrados por envolvente espacial (Bbox) con salida nativa en GeoJSON.
- Integración de capas **OGC WMS** de MINVU (`IPT/Patrimonio` y `Catastro_de_parques_urbanos`).
- Resiliencia y fallback a conjuntos de respaldo locales validados en `src/data/` (Censo 2024, Patrimonio IPT, Parques Urbanos, Barrios Históricos, Monumentos CMN).
- Generación de declaraciones institucionales completas, citas formales APA y conformidad con la Ley N° 20.285 de Transparencia y Acceso a la Información Pública.

### 3.14 `globo.js` (Visualización Tridimensional Esférica — Globo 3D)
- Motor de renderizado esférico WebGL / Three.js mediante `Globe.gl`.
- Representación realista del planeta Tierra desde el espacio exterior con textura Blue Marble de la NASA, topografía en relieve (bump map), atmósfera dispersiva y fondo estelar.
- Proyección tridimensional sincronizada de todas las capas vectoriales cargadas en el Atlas:
  * **Polígonos 3D (`polygonsData`):** Huellas de edificaciones (`building=*`), uso de suelo (`landuse=*`), manzanas censales 2024 y patrimonio IPT con altitud de extrusión proporcional.
  * **Líneas 3D (`pathsData`):** Redes viales, corredores de transporte y ciclovías elevadas con grosor dinámico.
  * **Puntos 3D (`pointsData`):** Equipamientos urbanos, paraderos, registros de biodiversidad GBIF y monumentos CMN con columnas y esferas luminosas.
- Cinemática de cámara: vuelo suave hacia Barrio Brasil / UAH (`lat: -33.4445, lng: -70.6620`), rotación orbital continua y vista de planeta completo.
