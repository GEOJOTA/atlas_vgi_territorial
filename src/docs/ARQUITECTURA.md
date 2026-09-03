# Arquitectura del Sistema — Atlas de Información Geográfica Voluntaria

## 1. Principio de diseño y desacoplamiento

Todo lo que se pueda resolver en el cliente (navegador del usuario), se resuelve en el cliente sin servidores propios de backend, garantizando costo de infraestructura cero y alta portabilidad. Para usuarios de línea de comandos o procesamiento por lotes, se dispone de un pipeline en Python 3 puro (`scripts/extractor_vgi.py`) que replica el modelo de datos.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           Navegador del Usuario (Frontend Web)                         │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │               Visor Cartográfico Interactivo (Leaflet 1.9.4 / mapa.js)          │   │
│   │      Bbox dinámico | 8 Capas Temáticas | Popups Normalizados | Export GeoJSON   │   │
│   └───────────────┬───────────────────────┬─────────────────────────┬───────────────┘   │
│                   │                       │                         │                   │
│   ┌───────────────▼───────────┐ ┌─────────▼─────────────┐ ┌─────────▼───────────────┐   │
│   │          osm.js           │ │       ohsome.js       │ │        gbif.js          │   │
│   │  Presets CAT-01 a CAT-08  │ │ Horizon Detect (Meta) │ │ Occurrence Search (WKT) │   │
│   │  Mirror Fallback & GeoJSON│ │ 5-Year Temporal Series│ │ Taxonomic GeoJSON Mapper│   │
│   └───────────────┬───────────┘ └─────────┬─────────────┘ └─────────┬───────────────┘   │
│                   │                       │                         │                   │
│   ┌───────────────▼───────────────────────▼─────────────────────────▼───────────────┐   │
│   │                 Generador Dual de Metadatos (metadatos.js)                      │   │
│   │          ISO 19115 (JSON Núcleo) + ISO 19139 (XML Perfil IDE Chile)            │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────┼───────────────────────┼─────────────────────────┼───────────────────┘
                    │                       │                         │
                    ▼                       ▼                         ▼
            Overpass Mirrors           ohsome API                 GBIF API
           (overpass-api.de,         (api.ohsome.org)          (api.gbif.org)
           lz4, z mirrors)
```

---

## 2. Componentes de la Solución

### 2.1 Visor Cartográfico (`src/js/modulos/mapa.js`)
- Motor: Leaflet 1.9.4.
- Capas base gratuitas sin API key: CartoDB Positron, OpenStreetMap Estándar y OpenTopoMap.
- Herramienta de dibujo y arrastre de Bounding Box para definir dinámicamente el área de estudio.
- Simbología vectorial SVG/divIcon por categoría temática según la paleta de estilos (`estilos.css`).
- Inspección interactiva: popups con atributos normalizados (`id_vgi`, `categoria`, `subtipo`, `nombre`, `operador`, `direccion`, `accesibilidad`, `fuente`, `licencia`).

### 2.2 Consultas a OpenStreetMap (`src/js/modulos/osm.js`)
- Implementa filtros Overpass QL optimizados para las 8 categorías temáticas (CAT-01 a CAT-08).
- Resiliencia de red: lista de servidores espejo con reintento automático (`overpass-api.de`, `lz4.overpass-api.de`, `z.overpass-api.de`).
- Conversor de nodos, vías y relaciones a `FeatureCollection` GeoJSON estándar con geometrías de punto y polígono.

### 2.3 Métricas Espacio-Temporales (`src/js/modulos/ohsome.js`)
- Detección automática del horizonte temporal máximo del extracto (`toTimestamp` vía `/metadata`) para evitar errores 400 por fechas no sincronizadas.
- Consulta de evolución a 5 años (`/elements/count` y `/users/count` con periodicidad anual `P1Y`).
- Algoritmo de densidad de información (elementos por km² calculado en base al elipsoide WGS84).

### 2.4 Biodiversidad y Ciencia Ciudadana (`src/js/modulos/gbif.js`)
- Conexión a la API pública de GBIF (`/v1/occurrence/search`).
- Filtrado por coordenadas de extensión (`decimalLatitude`, `decimalLongitude`) y taxonomía (especie, reino, familia).
- Mapeo directo a GeoJSON para visualización conjunta con la infraestructura urbana.

### 2.5 Generador Dual de Metadatos (`src/js/modulos/metadatos.js`)
- **JSON:** Estructura simplificada basada en los elementos núcleo de ISO 19115-1:2014.
- **XML:** Documento validado conforme a **ISO 19139 / Perfil Nacional de Metadatos de Chile (IDE Chile / SNIT)**, con namespaces OGC oficiales (`xmlns:gmd`, `xmlns:gco`, `xmlns:gml`) y etiquetas requeridas para importación directa en catálogos como GeoNetwork o GeoNode.

---

## 3. Modelo de Datos y Taxonomía VGI

El sistema normaliza todas las entidades bajo un esquema unificado de 11 atributos esenciales:
1. `id_vgi`: Identificador único global (`fuente/tipo/id`).
2. `categoria`: Código temático (CAT-01 a CAT-08).
3. `subtipo`: Valor semántico primario (`amenity`, `shop`, `highway`, etc.).
4. `nombre`: Nombre propio, comercial o denominación científica.
5. `operador`: Entidad administradora o publicador institucional.
6. `direccion`: Dirección catastral o referencia espacial.
7. `accesibilidad`: Condición de accesibilidad universal (`wheelchair`).
8. `fuente`: Plataforma de procedencia (OpenStreetMap, GBIF, etc.).
9. `fecha`: Fecha de registro o última edición.
10. `licencia`: Marco legal (ODbL 1.0, CC-BY, etc.).
11. `coordenadas`: Geometría en WGS84 (EPSG:4326).

---

## 4. Documentación Estructurada en Excel (.xlsx)

En `docs/` residen los tres documentos de referencia para la práctica:
- `catalogo_fuentes_vgi.xlsx`: Catálogo formal de fuentes, escala, cobertura y licencia.
- `perfil_metadatos_vgi.xlsx`: Diccionario y jerarquía ISO 19115 / IDE Chile.
- `categorias_tematicas_osm.xlsx`: Taxonomía y equivalencias de etiquetas OSM.

Generados mediante `scripts/generar_catalogos_excel.py` utilizando la biblioteca `openpyxl`.

---

## 5. Pipeline CLI para Geógrafos (`scripts/extractor_vgi.py`)

Herramienta autónoma en Python 3 (sin dependencias externas) que permite:
- Descargar cualquiera de las 8 categorías o el catálogo completo para el Bbox de Barrio Brasil / UAH.
- Exportar capas GeoJSON individuales en `data/capa_<categoria>.geojson`.
- Generar una capa integral consolidada `data/atlas_vgi_barrio_brasil_uah_completo.geojson`.
- Exportar una tabla tabular plana `data/resumen_catastro_vgi.csv` para análisis en Excel, R o Pandas.
