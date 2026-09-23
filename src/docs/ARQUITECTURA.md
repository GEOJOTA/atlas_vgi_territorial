# Arquitectura del Sistema — Atlas de Información Geográfica Voluntaria para la Gestión Territorial

**Repositorio Oficial:** [`https://github.com/GEOJOTA/atlas_vgi_uah.git`](https://github.com/GEOJOTA/atlas_vgi_uah.git)  
**Entorno Operativo:** Web estática desacoplada (SPA) + Clúster Espacial PostgreSQL 17 / PostGIS 3.3 (Supabase) + Storage CDN + Funciones Serverless + Pipeline CLI en Python 3  
**Caso Piloto:** Barrio Brasil / Manzana Campus Universidad Alberto Hurtado (Santiago Centro, Chile)  
**Sistema Geodésico Oficial:** WGS 84 / UTM Huso 19 Sur (EPSG:32719)  
**Estándares Clave:** ISO 19115-1:2014, ISO 19139:2007, ISO 19157:2013, ISO 19110:2016, OGC WMS/WFS, PostGIS 3.3, IDE Chile (SNIT)

---

## 1. Principios de Diseño y Arquitectura General

El sistema implementa una **arquitectura híbrida desacoplada y resiliente (*client-side first* con aceleración espacial en la nube)**, concebida para operar permanentemente con costo de infraestructura cero (\$0/mes):

1. **Desacoplamiento e Inmediatez:** La totalidad de la interfaz de usuario, renderizado cartográfico (Leaflet 1.9.4), cálculo geodésico y evaluación de calidad opera directamente en el navegador del usuario final sin dependencias obligatorias de compilación (*zero-build architecture*).
2. **Capa de Base de Datos Espacial en la Nube (Supabase PostGIS):**
   - Aloja las **112 capas oficiales del Estado** (incorporando la desagregación multiescalar del Censo 2024 en 5 niveles territoriales independientes y la red de semáforos conectados UOCT/MTT) y más de **130.000 entidades vectoriales** en un clúster relacional **PostgreSQL 17.6 con extensión PostGIS 3.3**.
   - Incorpora índices espaciales R-Tree `GIST` y la función RPC `fn_obtener_capa_bbox`, permitiendo consultas espaciales filtradas por el Bbox del usuario en milisegundos.
   - Aloja los archivos GeoJSON completos en el bucket público de CDN `atlas-geojson`.
3. **Resiliencia y Conmutación de Triple Contingencia (Failover):**
   - **Nivel 1:** Consulta espacial PostGIS RPC en la nube (recorte geométrico instantáneo en servidor).
   - **Nivel 2:** Descarga directa desde Supabase Storage CDN (`atlas-geojson`).
   - **Nivel 3:** Fallback local autónomo desde el directorio local `data/` en caso de corte de red o ausencia de credenciales.
4. **Mantenimiento Autónomo de Por Vida (Keep-Alive Anti-Pausa):**
   - El workflow [`.github/workflows/supabase_keepalive.yml`](../.github/workflows/supabase_keepalive.yml) ejecuta una consulta ligera de telemetría cada 3 días en GitHub Actions, garantizando que el clúster gratuito nunca se pause por inactividad.
5. **Pipeline CLI Científico Reproducible:** Motor en Python 3 (`scripts/subir_base_datos_supabase.py`, `scripts/cargar_entidades_postgis.py`, `scripts/generar_catalogos_excel.py`) para auditoría criptográfica SHA256, ingesta masiva y regeneración de catálogos Excel OpenXML (.xlsx).

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              NAVEGADOR DEL USUARIO (FRONTEND WEB SPA)                             │
│                                                                                                   │
│   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                 SELECTOR DE ACTOR TERRITORIAL (PERFILES DE USUARIO)                       │   │
│   │   🏛️ Institucional (IDE/Muni) │ 👥 Comunitario │ 🧭 Voluntario OSM │ 🔬 ONG / Investigador │   │
│   └─────────────────────────────────────────────┬─────────────────────────────────────────────┘   │
│                                                 │                                                 │
│   ┌─────────────────────────────────────────────▼─────────────────────────────────────────────┐   │
│   │                  VISOR CARTOGRÁFICO INTERACTIVO (mapa.js / Leaflet 1.9.4)                     │   │
│   │   Bbox Dinámico │ 10 Categorías VGI (CAT-01..10) │ 112 Capas Oficiales IDE │ Export QGIS  │   │
│   └──────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬──────────┬───────┘   │
│          │             │             │             │             │             │          │           │
│   ┌──────▼──────┐┌─────▼──────┐┌─────▼──────┐┌─────▼──────┐┌─────▼──────┐┌─────▼────┐┌───▼───────┐│
│   │  db_client  ││   osm.js   ││ taginfo.js ││  ohsome.js ││calidad_a.js││  gbif.js ││geodesia.js││
│   │PostGIS RPC /││Overpass QL ││ Taginfo v4 ││ ohsome Dual││ OQT/OSMCha ││Occur/Specs││EPSG:32719 ││
│   │ Storage CDN ││CAT-01..10  ││ Telemetría ││ v1/v2 HeiGIT││ Changesets││DarwinCore││Snyder UTM ││
│   └──────┬──────┘└─────┬──────┘└─────┬──────┘└─────┬──────┘└─────┬──────┘└─────┬────┘└───┬───────┘│
│          │             │             │             │             │             │         │          │
│          └─────────────┴─────────────┼─────────────┴─────────────┴─────────────┴─────────┘          │
│                                      │                                                               │
│   ┌──────────────────────────────────▼────────────────────────────────────────────────────────┐   │
│   │                 MOTOR DE EVALUACIÓN NORMATIVA TERRITORIAL (evaluador_normativo.js)        │   │
│   │       PRC Santiago (192 zonas) │ OGUC Art. 2.1.24 / 2.1.17 │ Certificado CIN-VGI (.txt)   │   │
│   └──────────────────────────────────┬────────────────────────────────────────────────────────┘   │
│                                      │                                                               │
│   ┌──────────────────────────────────▼────────────────────────────────────────────────────────┐   │
│   │                          DICCIONARIO TERRITORIAL (diccionario.js)                         │   │
│   │     134 Descriptores Chile: 48 Capas Oficiales IDE Chile vs 86 Brechas VGI Comunitarias   │   │
│   └──────────────────────────────────┬────────────────────────────────────────────────────────┘   │
│                                      │                                                               │
│   ┌──────────────────────────────────▼────────────────────────────────────────────────────────┐   │
│   │                    GENERADOR DUAL DE METADATOS ESPACIALES (metadatos.js)                  │   │
│   │            ISO 19115:2014 (Núcleo JSON) + ISO 19139:2007 (XML Oficial IDE Chile)          │   │
│   └───────────────────────────────────────────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────┬──────────┬──────────┬──────────┬──────────┬─────────────────────┘
               │                  │          │          │          │          │
               ▼                  ▼          ▼          ▼          ▼          ▼
 ┌────────────────────────┐ ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
 │    SUPABASE CLOUD      │ │ Overpass ││ Taginfo  ││  ohsome  ││  OSMCha  ││   GBIF   │
 │ PostgreSQL 17+PostGIS  │ │ API OSMF ││  API v4  ││ API v1/v2││Changesets││ Species/ │
 │ • 112 capas_metadata   │ │ Mirrors  ││Geofabrik ││  HeiGIT  ││ Community││Occurrence│
 │ • 129.262 entidades GIST│ └──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
 │ • Storage atlas-geojson│
 └────────────────────────┘
               │
   (Fallback si no hay red)
               ▼
 ┌────────────────────────┐
 │   data/*.geojson       │
 │ Almacenamiento Local   │
 └────────────────────────┘
```

---

## 2. Inventario de APIs Externas y Servicios en la Nube Integrados

El Atlas articula 10 servicios y protocolos de datos geoespaciales y colaborativos:

| API / Servicio | Endpoint Base Oficial | Módulo Integrador | Función y Aplicación en el Atlas |
|---|---|---|---|
| **Supabase PostGIS RPC** | `https://[TU-PROYECTO].supabase.co/rest/v1/rpc/fn_obtener_capa_bbox` | `src/js/modulos/db_client.js` | Consultas espaciales de alta velocidad con recorte geométrico en servidor mediante índices R-Tree `GIST` sobre 129.262 entidades vectoriales. |
| **Supabase Storage CDN** | `https://[TU-PROYECTO].supabase.co/storage/v1/object/public/atlas-geojson/` | `src/js/modulos/db_client.js` | Descarga directa de archivos GeoJSON optimizados servidos a través de la red de distribución de contenido (CDN) global. |
| **Overpass API v0.7** | `https://overpass-api.de/api/interpreter`<br>`https://lz4.overpass-api.de/api/interpreter`<br>`https://z.overpass-api.de/api/interpreter` | `src/js/modulos/osm.js` | Extracción vectorial en vivo de geometrías (nodos, vías, relaciones) para las 10 macro-categorías VGI (CAT-01 a CAT-10) dentro del Bbox territorial con rotación automática entre 3 espejos. |
| **Taginfo API v4** | `https://taginfo.openstreetmap.org/api/4/` | `src/js/modulos/taginfo.js` | Validación en tiempo real del recuento global de objetos, representatividad porcentual en el planeta y valores más frecuentes para cualquier clave OSM. |
| **ohsome API (Dual v1 / v2)** | `https://api.ohsome.org/v1` (OSHDB Java)<br>`https://api.ohsome.org/v2` (Citus Python) | `src/js/modulos/ohsome.js` | Auditoría de evolución histórica espacio-temporal (series anuales P1Y), volumen de elementos vigentes, masa crítica de colaboradores activos e intensidad de contribución. |
| **ohsome Quality Analyst (OQT)** | Marco conceptual Herfort et al. (2023) / HeiGIT | `src/js/modulos/calidad_analyst.js` | Estimación del **Índice de Saturación de Mapeo**, clasificación de la madurez territorial (*Levantamiento Dinámico* vs. *Consolidación Barrial*) y completitud de atributos críticos. |
| **OSM Changesets API & OSMCha** | `https://api.openstreetmap.org/api/0.6/changesets`<br>`https://osmcha.org/changesets/{id}` | `src/js/modulos/calidad_analyst.js` | Control de cambios y validación de ediciones recientes en el Bbox de Barrio Brasil o por ID numérico de changeset con enlace directo a OSMCha. |
| **GBIF Occurrence & Species API** | `https://api.gbif.org/v1/occurrence/search`<br>`https://api.gbif.org/v1/species/suggest` | `src/js/modulos/gbif.js` | Monitoreo de biodiversidad urbana y ciencia ciudadana (iNaturalist, museos), autocompletado taxonómico en vivo y extracción de banderas Darwin Core (`issues`). |
| **UMap OpenStreetMap France** | `https://umap.openstreetmap.fr/` | `src/js/modulos/umap.js` | Visualización de iniciativas cartográficas vecinales y extracción de capas vectoriales GeoJSON comunitarias. |
| **ArcGIS FeatureServer & WMS (MINVU / IDE Chile)** | `https://geoide.minvu.cl/server/rest/services/` | `src/js/modulos/ide_chile.js` | Superposición WMS de patrimonio en vivo y capas de Instrumentos de Planificación Territorial (PRC Santiago, PRMS). |

---

## 3. Módulos del Sistema Frontend (`src/js/modulos/`)

La arquitectura se articula en 16 módulos desacoplados coordinados por el controlador central:

### 3.1 `db_client.js` (Conector Cloud PostGIS / Supabase Storage)
- Administrador central de la conexión con el clúster **PostgreSQL 17.6 + PostGIS 3.3 en Supabase**.
- Implementa la estrategia de **triple failover**:
  1. Consulta la función RPC `fn_obtener_capa_bbox` para recorte espacial exacto en servidor.
  2. Si no responde, descarga la capa completa desde el bucket público CDN `atlas-geojson`.
  3. Si no hay conexión a internet o fallan las credenciales, activa el fallback local descargando desde `data/capa_bbdd_XX.geojson`.
- Persistencia de credenciales seguras en `localStorage`.
- Monitoreo del estado en tiempo real con alertas visuales (`🟢 PostGIS Activo` / `📁 Modo Local`).

### 3.2 `mapa.js` (Visor Cartográfico Leaflet 1.9.4)
- Motor cartográfico 2D de alto rendimiento.
- Capas base intercambiables: CartoDB Positron, OpenStreetMap Estándar y OpenTopoMap.
- Herramienta interactiva "📐 Dibujar Bbox" para redelimitar el polígono de estudio dinámicamente.
- Coordinación de capas de las 10 categorías VGI y las 112 capas oficiales del Estado (122 capas totales).
- Panel lateral de «Más detalles» con alerta visual destacada para datasets con alta densidad de columnas (>15 atributos, RSH, Censo 2024, BIP, IGVUST, CONAF, UOCT) y botón de descarga directa de la capa completa (.geojson) sin recortes espaciales ni de columnas.
- Popups normalizados con atributos clave, citas bibliográficas APA 7ª ed. y enlace al diccionario.

### 3.3 `ide_chile.js` (Catálogo Oficial de 112 Capas del Estado)
- Renderiza los **6 macro-grupos temáticos oficiales** dentro de la Consola Técnica GIS (Workbench Profesional):
  - *Normativa Urbanística & IPT* (MINVU / PRC Santiago / PRMS / DPA)
  - *Medio Ambiente, Parques & Recursos Hídricos* (MMA / DGA / CONAF / CIREN)
  - *Comunidades, RSH, Vulnerabilidad & Demografía* (MDSF / INE Censo 2024 multiescalar / MINVU / BiDat)
  - *Equipamiento Público, Educación, Salud & Patrimonio* (CMN / MINEDUC / MINSAL / IND)
  - *Seguridad, Bomberos & Emergencias* (Carabineros / CBS / DIFROL)
  - *Movilidad, Transporte, Red Semafórica UOCT, Red Metro, Inversión Pública & Economía* (UOCT / MTT / MOP / BIP / CNE / ODEPA)
- Badges dinámicos de conteo de entidades y estado de carga.
- Botón directo de descarga `📥` en cada tarjeta de capa oficial.
- Conexión con `db_client.js` para descarga inteligente vía PostGIS RPC o Storage CDN.

### 3.4 `evaluador_normativo.js` (Motor de Evaluación Normativa Territorial CIN-VGI)
- Algoritmo Point-in-Polygon (PIP) en cliente para auditar cualquier coordenada en Santiago Centro:
  - Cruce con las 192 zonas del **Plan Regulador Comunal de Santiago (PRC)**.
  - Usos de suelo permitidos y prohibidos fundados en el **Principio de Exclusión Negativa (Art. 2.1.24 OGUC)**.
  - Afectaciones por riesgo de inundación o remoción en masa (Art. 2.1.17 OGUC).
  - Afectaciones patrimoniales (Zonas Típicas e Inmuebles de Conservación Histórica, Ley 17.288 / Art. 60 LGUC).
- Generación y descarga del **Certificado CIN-VGI (.txt)** con fecha, coordenadas UTM 19S y advertencia legal (Art. 116 LGUC).

### 3.5 `importador_capas.js` (Motor Multi-formato de Ingesta Local)
- Ingestión 100% en cliente sin subir datos a servidores de terceros:
  - **.kmz**: Descompresión binaria en memoria con **JSZip** y parseo XML con toGeoJSON.
  - **.kml**: Parseo directo de Placemarks.
  - **.geojson / .json**: GeoJSON estándar RFC 7946 en WGS84.
  - **.gpx**: Waypoints y tracks de GPS.
  - **.csv / .tsv**: Detección inteligente de columnas geográficas (`lat`, `lon`, `x`, `y`).
- Integración inmediata en el mapa Leaflet con auditoría normativa por clic.

### 3.6 `osm.js` (Cliente Overpass API)
- Serialización de consultas Overpass QL para CAT-01 a CAT-10.
- Mecanismo de failover con conmutación automática entre 3 servidores espejo (de, lz4, z).

### 3.7 `taginfo.js` (Cliente Taginfo API v4)
- Consulta asíncrona de estadísticas globales de uso de etiquetas en OpenStreetMap (`/tag/stats` y `/key/values`).

### 3.8 `calidad_analyst.js` (Control de Calidad OQT y OSMCha)
- Parser XML de changesets en el Bbox barrial y evaluación heurística de calidad.
- Cálculo del Índice de Saturación de Mapeo y evaluación de madurez barrial.

### 3.9 `ohsome.js` (Motor Histórico HeiGIT)
- Series cronológicas anuales P1Y sobre OSHDB.
- Soporte dual: v1 libre sin autenticación y v2 con clave opcional.

### 3.10 `gbif.js` (Biodiversidad y Taxonomía Darwin Core)
- Autocompletado taxonómico (Species API) y extracción de ocurrencias con banderas de calidad (`issues`).

### 3.11 `umap.js` (Cartografía Colaborativa UMap)
- Normalización de URLs de UMap y renderizado de proyectos cartográficos comunitarios locales.

### 3.12 `geodesia.js` (Motor Geodésico Conforme EPSG:32719)
- Ecuaciones conformes de Snyder (USGS) para reproyección desde WGS84 a **UTM Huso 19 Sur (EPSG:32719)**.
- Cálculo exacto de superficies en metros cuadrados ($	ext{m}^2$) y hectáreas ($	ext{ha}$) sin distorsión angular.

### 3.13 `metadatos.js` (Generador Dual ISO 19115 / ISO 19139)
- Generación de JSON con elementos núcleo de ISO 19115-1:2014.
- Generación de XML conforme a **ISO 19139 / Perfil Nacional de Metadatos de Chile (IDE Chile / SNIT)**, listo para cosechar en GeoNetwork y GeoNode.

### 3.14 `diccionario.js` (Catálogo Territorial de 134 Descriptores)
- 134 descriptores depurados y escalables para Chile clasificados en las 10 categorías VGI.
- Sinceramiento estricto: 48 capas oficiales IDE vs. 86 brechas VGI ciudadanas.

### 3.15 `licencias.js` (Marco Jurídico de Licenciamiento)
- Gestión del marco tripartito: ODbL 1.0 (datos OSM), CC BY-SA 4.0 (fichas y contenidos), GNU GPL v3 (código fuente).

### 3.16 `app.js` (Orquestador Central de Interfaz)
- Gestión de ciclo de vida de la aplicación, cambio de perfiles territoriales, sincronización de Bbox y control de paneles.

---

## 4. Base de Datos Espacial en la Nube (PostgreSQL 17.6 + PostGIS 3.3 en Supabase)

### 4.1 Esquema Relacional DDL (`scripts/db/01_schema_postgis.sql`)

```sql
-- 1. Extensión espacial PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabla de Metadatos de las 112 Capas Oficiales (Censo 2024 Multiescalar & Semáforos UOCT)
CREATE TABLE IF NOT EXISTS public.capas_metadata (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    subcategoria TEXT,
    institucion TEXT,
    geometria_tipo TEXT,
    conteo_entidades INTEGER DEFAULT 0,
    fuente_url TEXT,
    cita_apa TEXT,
    archivo_geojson TEXT,
    actualizado_al TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Entidades Espaciales Vectorizadas (129.262 registros)
CREATE TABLE IF NOT EXISTS public.capas_entidades (
    id BIGSERIAL PRIMARY KEY,
    capa_id TEXT NOT NULL REFERENCES public.capas_metadata(id) ON DELETE CASCADE,
    nombre TEXT,
    tipo TEXT,
    propiedades JSONB DEFAULT '{}'::jsonb,
    geom GEOMETRY NOT NULL
);

-- 4. Índice Espacial R-Tree GIST y de búsqueda
CREATE INDEX IF NOT EXISTS idx_capas_entidades_geom ON public.capas_entidades USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_capas_entidades_capa_id ON public.capas_entidades (capa_id);
```

### 4.2 Función Espacial RPC para Recortes Dinámicos por Bbox

```sql
CREATE OR REPLACE FUNCTION public.fn_obtener_capa_bbox(
    p_capa_id TEXT,
    p_min_lon DOUBLE PRECISION,
    p_min_lat DOUBLE PRECISION,
    p_max_lon DOUBLE PRECISION,
    p_max_lat DOUBLE PRECISION
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bbox GEOMETRY;
    v_geojson JSONB;
BEGIN
    v_bbox := ST_MakeEnvelope(p_min_lon, p_min_lat, p_max_lon, p_max_lat, 4326);
    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(ST_Force2D(e.geom))::jsonb,
                'properties', e.propiedades || jsonb_build_object(
                    '_nombre', e.nombre,
                    '_tipo', e.tipo,
                    '_capaId', e.capa_id
                )
            )
        ), '[]'::jsonb)
    ) INTO v_geojson
    FROM public.capas_entidades e
    WHERE e.capa_id = p_capa_id
      AND e.geom && v_bbox
      AND ST_Intersects(e.geom, v_bbox);

    RETURN v_geojson;
END;
$$;
```

---

## 5. Perfiles de Actor Territorial (Gestión Orientada a Usuarios)

El sistema adapta su comportamiento según el perfil seleccionado en la cabecera:
1. **🏛️ Perfil Institucional / Autoridades (IDE Chile / Municipalidad / SECPLAN):** Prioriza IPT (PRC Santiago), microdatos Censo 2024, exportación XML ISO 19139 y auditoría de metadatos.
2. **👥 Perfil Comunitario / Organizaciones Vecinales y Ciudadanía:** Diagnósticos en 1 clic de servicios cotidianos (farmacias, áreas verdes, paraderos, ferias), mapas colaborativos en UMap.
3. **🧭 Perfil Voluntario / Mapeadores OSM y Ciencia Ciudadana:** Constructor Overpass QL avanzado, validación Taginfo API, control de changesets en OSMCha y vacíos de microatributos de accesibilidad.
4. **🔬 Perfil Investigadores / ONGs y Gestores:** Reproyección métrica EPSG:32719, series anuales ohsome, densidades espaciales por km² y citas APA 7ª ed.

---

## 6. Modelo de Datos y Esquema Normalizado VGI (14 Atributos)

| Campo Normalizado | Tipo de Dato | Equivalencia IDE Chile / ISO 19115 | Descripción y Función Territorial |
|---|---|---|---|
| `id_vgi` | Alfanumérico | `ID_OBJETO` (`gmd:identifier`) | Identificador unívoco global (`fuente/tipo/id`). |
| `categoria` | Código CAT | `gmd:topicCategory` (ISO 19115) | Clasificación en una de las 10 macro-categorías (CAT-01 a CAT-10) del Atlas. |
| `subtipo` | Texto | `SubclaseCatastral` | Denominación funcional específica (`pharmacy`, `park`, etc.). |
| `nombre` | Texto | `ToponimiaOficial` (`gmd:title`) | Nombre propio barrial o comercial del recinto. |
| `operador` | Texto | `PuntoDeContacto` (`gmd:CI_ResponsibleParty`) | Institución o empresa administradora responsable. |
| `direccion` | Texto | `LocalizacionDomiciliaria` | Calle y número catastral de acceso principal. |
| `accesibilidad` | Texto | `CalidadDeAccesoUniversal` | Condición para silla de ruedas (`yes`, `limited`, `no`). |
| `superficie_m2` | Numérico (Float) | `SuperficieMetricaM2` | Área euclidiana calculada en proyección EPSG:32719 UTM 19S. |
| `superficie_ha` | Numérico (Float) | `SuperficieMetricaHa` | Superficie expresada en hectáreas ($1	ext{ ha} = 10.000	ext{ m}^2$). |
| `fuente` | Texto | `LinajeProcedencia` (`gmd:LI_Lineage`) | Plataforma de adquisición primaria (OSM, GBIF, UMap, PostGIS). |
| `fecha` | Fecha (ISO 8601) | `FechaDeRegistro` | Timestamp de captura o última edición registrada. |
| `licencia` | Texto | `RestriccionesLegales` (`gmd:MD_LegalConstraints`) | Marco jurídico aplicable (ODbL 1.0, CC-BY 4.0, Ley 20.285). |
| `coordenadas` | Array [Lon, Lat] | `SIRGAS_Chile` (EPSG:4326 / EPSG:5361) | Geometría espacial absoluta en grados decimales WGS84. |
| `ide_chile` | Texto | `CapaHomologaEstatal` | Homología oficial demostrable o declaración de Brecha VGI. |

---

## 7. Catálogos Estructurados en Excel (.xlsx) y Trazabilidad APA

Ubicados en `docs/` y `src/docs/`, generados automáticamente mediante `scripts/generar_catalogos_excel.py`:
1. `categorias_tematicas_osm.xlsx`:
   - Hoja 1: *Categorías Maestras* (10 macro-categorías territoriales, calidad ISO 19157 y normativas chilenas).
   - Hoja 2: *Catálogo de Etiquetas Chile* (134 descriptores depurados: 48 oficiales vs. 86 brechas VGI).
   - Hoja 3: *Perfil de Atributos VGI* (14 campos normalizados con reproyección EPSG:32719).
   - Hoja 4: *Bibliografía APA 7ª ed.* (125 referencias formales científicas, institucionales y normativas, detalladas en `docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`).
2. `catalogo_fuentes_vgi.xlsx`: Matriz de fuentes colaborativas e inventario técnico de endpoints.
3. `perfil_metadatos_vgi.xlsx`: Especificación de jerarquía y tipos de datos ISO 19115 nacional.
4. `BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`: Compendio académico completo con trazabilidad metodológica (Corpus Científico UAH & Atlas VGI).

---

## 8. Infraestructura de Despliegue, CI/CD y Mantenimiento

- **Frontend Estático:** Alojado en **Netlify** con integración continua vinculada a la rama `main`.
- **Variables de Entorno Netlify:** `SUPABASE_URL` y `SUPABASE_ANON_KEY` configuradas como variables protegidas.
- **Workflow Keep-Alive Anti-Pausa:** [`.github/workflows/supabase_keepalive.yml`](../.github/workflows/supabase_keepalive.yml) ejecuta un ping automático cada 3 días en GitHub Actions.
- **Auditoría Automatizada:**
  - Sintaxis JavaScript verificada con el motor JavaScriptCore (`jsc -s`).
  - Verificación de catálogos y consistencia de datos mediante Python 3.
  - Sincronización estricta entre `docs/` y `src/docs/`.

---

*Atlas VGI Barrio Brasil — Departamento de Geografía, Universidad Alberto Hurtado.*  
*Investigación sobre VGI, Infraestructuras de Datos Espaciales y Gestión Territorial 2026.*
