# Guía de Contribución Abierta, Trazabilidad y Arquitectura del Código — Atlas VGI UAH

¡Te damos la bienvenida al proyecto **Atlas de Información Geográfica Voluntaria (VGI) para la Gestión Territorial en el Barrio Brasil**!

Este Atlas es una iniciativa de ciencia abierta, soberanía de datos y cartografía colaborativa desarrollada en el marco del **Proyecto de Investigación F1261256 (ANID)** por el **Departamento de Geografía de la Universidad Alberto Hurtado (UAH)**, Santiago de Chile.

Nuestro propósito es democratizar el acceso a la información territorial, articulando la cartografía oficial del Estado de Chile (**109 capas oficiales**) con el conocimiento vivo de comunidades, organizaciones barriales y voluntarias/os (**10 macro-categorías VGI**, conformando **119 capas cartográficas en total**).

Este documento detalla la filosofía del proyecto, la anatomía técnica archivo por archivo, los lenguajes utilizados y las guías prácticas paso a paso para que cualquier persona —desde una dirigenta social hasta una desarrolladora SIG— pueda contribuir con código, capas, documentación o mapeo de campo bajo los más altos estándares de fuente abierta.

---

## 🧭 Índice de Contenidos

1. [Manifiesto de Ciencia Abierta y Filosofía Zero-Build](#1-manifiesto-de-ciencia-abierta-y-filosofía-zero-build)
2. [¿Cómo Contribuir según tu Perfil? (Elige tu Camino)](#2-cómo-contribuir-según-tu-perfil-elige-tu-camino)
   - [Vía 1: Mapeo Territorial en OpenStreetMap (Sin Programar)](#vía-1-mapeo-territorial-en-openstreetmap-sin-programar)
   - [Vía 2: Reporte o Propuesta de Capa vía GitHub Issues](#vía-2-reporte-o-propuesta-de-capa-vía-github-issues)
   - [Vía 3: Carga Local en el Visor (Uso en Cabildos y Asambleas)](#vía-3-carga-local-en-el-visor-uso-en-cabildos-y-asambleas)
   - [Vía 4: Contribución Técnica de Código y Capas (Fork & Pull Request)](#vía-4-contribución-técnica-de-código-y-capas-fork--pull-request)
3. [Entorno de Desarrollo Local en 5 Segundos](#3-entorno-de-desarrollo-local-en-5-segundos)
4. [Anatomía del Proyecto: Archivo por Archivo y Lenguaje](#4-anatomía-del-proyecto-archivo-por-archivo-y-lenguaje)
   - [Frontend Vanilla JavaScript (ES6+ / IIFE SPA)](#frontend-vanilla-javascript-es6--iife-spa)
   - [Hojas de Estilo CSS Puro (Variables Nativas y Diseño Responsivo)](#hojas-de-estilo-css-puro-variables-nativas-y-diseño-responsivo)
   - [Capa Geoespacial GeoJSON (WGS 84 / EPSG:4326)](#capa-geoespacial-geojson-wgs-84--epsg4326)
   - [Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3](#base-de-datos-espacial-postgresql-17--postgis-33)
   - [Pipeline CLI, Automatización y ETL en Python 3](#pipeline-cli-automatización-y-etl-en-python-3)
   - [Documentación Académica y Metadatos Markdown](#documentación-académica-y-metadatos-markdown)
5. [Guías Paso a Paso para Nuevas Contribuciones](#5-guías-paso-a-paso-para-nuevas-contribuciones)
   - [Cómo agregar una nueva Capa Oficial del Estado](#cómo-agregar-una-nueva-capa-oficial-del-estado)
   - [Cómo agregar o calibrar una Macro-Categoría VGI](#cómo-agregar-o-calibrar-una-macro-categoría-vgi)
   - [Cómo modificar estilos y componentes visuales](#cómo-modificar-estilos-y-componentes-visuales)
   - [Cómo sincronizar catálogos Excel y base de datos SQL](#cómo-sincronizar-catálogos-excel-y-base-de-datos-sql)
6. [Estándares de Código Abierto y Buenas Prácticas](#6-estándares-de-código-abierto-y-buenas-prácticas)
   - [Convención de Commits (Conventional Commits)](#convención-de-commits-conventional-commits)
   - [Tríada de Licencias Abiertas](#tríada-de-licencias-abiertas)
   - [Trazabilidad, Linaje y Normas APA 7ª Edición](#trazabilidad-linaje-y-normas-apa-7ª-edición)
7. [Contacto y Soporte Institucional](#7-contacto-y-soporte-institucional)

---

## 1. Manifiesto de Ciencia Abierta y Filosofía Zero-Build

El Atlas VGI Barrio Brasil se rige por tres principios innegociables:

1. **Cero Barreras Técnicas (*Zero-Build Architecture*):** El software no utiliza Webpack, Vite, Babel ni gestores de paquetes obligatorios para ser ejecutado o modificado. Cualquier persona con un navegador web y un editor de texto puede clonar el repositorio, editar una línea y ver el resultado de inmediato.
2. **Soberanía y Transparencia de Datos:** La información del Estado de Chile (Ley N° 20.285) se complementa con la cartografía comunitaria libre (OpenStreetMap, GBIF). El código es 100% auditable y no incluye rastreadores, cookies ni telemetría comercial.
3. **Reproducibilidad Científica:** Cada indicador, capa y polígono cuenta con linaje documentado bajo estándares internacionales ISO (ISO 19115-1:2014 para metadatos, ISO 19157:2013 para calidad de datos e ISO 19110:2016 para catalogación de objetos geográficos) y citas bibliográficas normalizadas en formato APA 7ª edición.

---

## 2. ¿Cómo Contribuir según tu Perfil? (Elige tu Camino)

### Vía 1: Mapeo Territorial en OpenStreetMap (Sin Programar)
OpenStreetMap (OSM) es el corazón colaborativo del Atlas. Cualquier dato que agregues o corrijas en OSM se refleja en vivo en las consultas del visor.

1. Crea tu cuenta gratuita en [OpenStreetMap.org](https://www.openstreetmap.org/).
2. Haz clic en **"Editar"** para abrir el editor web visual **iD** (funciona en cualquier navegador en computadores o tablets).
3. Ubica el polígono del **Barrio Brasil y campus UAH** (Santiago Centro) y releva elementos del territorio:
   - **Comercio barrial y salud:** Almacenes de barrio, panaderías, farmacias, veterinarias (`shop=*`, `amenity=*`).
   - **Movilidad y accesibilidad universal:** Rebajes de vereda (`kerb=lowered`), rampas peatonales, cruces semaforizados (`highway=crossing` + `crossing=traffic_signals`), estacionamientos de bicicletas (`amenity=bicycle_parking`).
   - **Espacio público y naturaleza urbana:** Arbolado de calle (`natural=tree`), bancas públicas (`amenity=bench`), luminarias (`highway=street_lamp`), contenedores de reciclaje (`amenity=recycling`).
4. Al guardar tus cambios, agrega en el comentario del conjunto de cambios (*changeset comment*) el hashtag:
   ```text
   #AtlasVGI_UAH #BarrioBrasil
   ```
   > [!TIP]
   > El uso de `#AtlasVGI_UAH` permite que el módulo de calidad y cambios del Atlas (OSMCha / ohsome) certifique tu aporte con trazabilidad comunitaria.

---

### Vía 2: Reporte o Propuesta de Capa vía GitHub Issues
Si detectas un desfase cartográfico, una capa desactualizada o tu colectivo levantó información en terreno:

1. Ingresa a [GitHub Issues](https://github.com/GEOJOTA/atlas_vgi_uah/issues).
2. Haz clic en **"New Issue"** y utiliza la siguiente plantilla:

```markdown
### 📍 Propuesta / Reporte de Datos Territoriales

- **Tipo de aporte:** [Corrección de dato existente / Propuesta de nueva capa / Reporte de inconsistencia]
- **Nombre de la capa o fenómeno:** (Ej: "Bicicleteros públicos y talleres comunitarios en calle Erasmo Escala")
- **Categoría Temática:** (Ej: CAT-04 Movilidad Activa, o Capa Oficial MINVU/MOP)
- **Ubicación o Delimitación:** (Ej: Erasmo Escala entre Av. Brasil y Ricardo Cumming)
- **Fuente o Verificación:** (Ej: Levantamiento en terreno 2026, enlace a geoportal, documento oficial)
- **Organización / Colaborador:** (Ej: Junta de Vecinos N° 1 Barrio Brasil, colectivo ciclista, investigador/a)
- **Detalle de la observación:** (Describe brevemente el dato y por qué es relevante para la gestión del barrio)
```

El equipo mantenedor del Departamento de Geografía UAH auditará la geometría y la incorporará formalmente al catálogo.

---

### Vía 3: Carga Local en el Visor (Uso en Cabildos y Asambleas)
Para contrastar levantamientos propios de inmediato sin necesidad de software GIS pesado (QGIS o ArcGIS):

1. Ingresa al Atlas en producción: [atlasvgiuah.netlify.app](https://atlasvgiuah.netlify.app/).
2. En el **Panel 00 (Visor Cartográfico)**, haz clic en el botón **"📂 Cargar Archivo Local"**.
3. Arrastra tu archivo en formato **.GeoJSON**, **.KML**, **.KMZ**, **.GPX** o **.CSV** (con columnas de latitud/longitud).
4. El visor lo superpondrá al instante sobre las **109 capas oficiales del Estado** y las **10 macro-categorías VGI**, permitiendo auditar normativas urbanísticas (PRC Santiago) y densidades de equipamiento de forma 100% privada (los datos se procesan en la memoria RAM del navegador y nunca salen de tu equipo).

---

### Vía 4: Contribución Técnica de Código y Capas (Fork & Pull Request)
Si eres desarrollador/a web, analista geoespacial o investigadora/or:

1. Realiza un **Fork** del repositorio a tu cuenta personal de GitHub.
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/atlas_vgi_uah.git
   cd atlas_vgi_uah
   ```
3. Crea una rama descriptiva siguiendo la convención de ramas:
   ```bash
   git checkout -b feat/nueva-capa-equipamiento
   ```
4. Desarrolla tus mejoras respetando las directrices de arquitectura explicadas a continuación.
5. Verifica la integridad del sistema:
   ```bash
   python3 scripts/verificar_conteo_capas.py
   ```
6. Envía un **Pull Request (PR)** hacia la rama `main` del repositorio oficial describiendo los cambios realizados.

---

## 3. Entorno de Desarrollo Local en 5 Segundos

Al tratarse de una arquitectura *zero-build*, no requieres ejecutar `npm install` ni compilar activos. Para levantar un servidor de desarrollo local y probar tus cambios en tiempo real, utiliza cualquiera de estas opciones:

```bash
# Opción 1: Python 3 nativo (Recomendada)
python3 -m http.server 8000 -d src

# Opción 2: Extensión Live Server de VS Code / Cursor
# Abre la carpeta 'src' y haz clic en "Go Live" en la barra inferior.

# Opción 3: Servidor Node ligero (si tienes Node.js instalado)
npx serve src -l 8000
```

Abre tu navegador en `http://localhost:8000` y el Atlas estará plenamente operativo con recarga en vivo.

---

## 4. Anatomía del Proyecto: Archivo por Archivo y Lenguaje

El repositorio está organizado de forma modular, separando estrictamente la presentación, la lógica analítica, los datos espaciales y los scripts de soporte.

```
atlas_vgi_uah/
├── src/                               # Raíz de la aplicación web estática (SPA)
│   ├── index.html                     # Maqueta estructural accesible y navegación por 9 módulos
│   ├── css/                           # Sistema de diseño y hojas de estilo modulares
│   │   ├── variables.css              # Tokens de diseño, paleta cromática UAH y tema oscuro
│   │   ├── estilos.css                # Estilos base y tipografías
│   │   ├── layout.css                 # Grillas de navegación, sidebar y paneles principales
│   │   ├── mapa.css                   # Overlays de Leaflet, simbología cartográfica y popups
│   │   ├── componentes.css            # Botones, switches, chips de filtro y badges
│   │   └── responsive.css             # Reglas para dispositivos móviles, tablets y escritorios
│   ├── js/                            # Lógica cliente en Vanilla JavaScript ES6+
│   │   ├── app.js                     # Enrutador SPA, gestión del estado global y perfiles
│   │   ├── config.js                  # Bbox Barrio Brasil, endpoints de APIs y taxonomía VGI
│   │   └── modulos/                   # Módulos temáticos independientes
│   │       ├── mapa.js                # Instancia Leaflet 1.9.4, capas vectoriales, inspector PRC
│   │       ├── ide_chile.js           # Catálogo maestro de las 109 capas oficiales del Estado
│   │       ├── overpass.js            # Constructor de consultas Overpass QL en tiempo real
│   │       ├── ohsome.js              # Ingesta ohsome API v1/v2 y cálculo de calidad ISO 19157
│   │       ├── gbif.js                # Consultas taxonómicas de biodiversidad urbana
│   │       ├── umap.js                # Integración de proyectos colaborativos uMap
│   │       ├── metadatos.js           # Generador de metadatos ISO 19115 / ISO 19139 (XML/JSON)
│   │       ├── diccionario.js         # Glosario territorial interactivo y catálogo de etiquetas
│   │       ├── licencias.js           # Matriz jurídica y descargador de catálogos Excel
│   │       └── manual.js              # Manual de usuario, arquitectura y trazabilidad
│   ├── data/                          # Almacén de coberturas GeoJSON locales (espejo de data/)
│   └── docs/                          # Documentación académica y catálogos Excel (.xlsx)
├── data/                              # Directorio raíz de datos espaciales GeoJSON
├── docs/                              # Documentos maestros de arquitectura y trazabilidad
│   ├── ARQUITECTURA.md                # Diagrama detallado de flujos y arquitectura de sistemas
│   ├── TRAZABILIDAD_ACADEMICA.md      # Marco metodológico, linaje de fuentes y citas APA
│   ├── GUIA_BASE_DATOS_SUPABASE.md    # Guía de conexión e índices espaciales PostGIS 3.3
│   └── BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md # Corpus bibliográfico extendido (127 fuentes APA)
├── scripts/                           # Pipeline CLI y automatización en Python 3
│   ├── db/                            # Scripts SQL para PostgreSQL 17 + PostGIS 3.3
│   │   ├── 01_schema_postgis.sql      # Tablas, índices GIST y funciones RPC de Bbox
│   │   └── 02_seed_metadata.sql       # Semilla SQL con los 109 registros oficiales
│   ├── generar_catalogos_excel.py     # Generador de libros OpenXML (.xlsx) con openpyxl
│   ├── verificar_conteo_capas.py      # Script de verificación y auditoría matemática de capas
│   ├── generar_seed_sql.py            # Sincronizador desde ide_chile.js hacia SQL
│   └── compactar_geojsons_pesados.py  # Optimizador topológico y reductor de decimales
├── .github/workflows/                 # Integración continua y automatizaciones
│   └── supabase_keepalive.yml         # Ping de telemetría cada 3 días para PostGIS libre
├── CONTRIBUTING.md                    # Esta guía integral de contribución
└── README.md                          # Portada institucional del proyecto
```

---

### Frontend Vanilla JavaScript (ES6+ / IIFE SPA)

- **Tecnología:** JavaScript moderno nativo (ES6+), organizado mediante módulos desacoplados y patrón revelador (*revealing module pattern*) montados sobre el objeto global `window.AtlasVGI`.
- **Ventajas:** Máxima velocidad de carga, sin dependencias frágiles de compiladores, depuración directa en las herramientas de desarrollo del navegador (`DevTools`).
- **Principales archivos a modificar:**
  - `src/js/config.js`: Modifica aquí los Bbox territoriales, las ponderaciones del Índice de Calidad VGI (ICV) o las claves de las 10 categorías temáticas (CAT-01 a CAT-10).
  - `src/js/modulos/ide_chile.js`: Contiene el objeto maestro `CAPAS_OFICIALES` con la totalidad de capas estatales (109 en total). Aquí se configuran los identificadores (`bbdd_XX`), nombres temáticos, organismos custodios, URLs de descarga y citas bibliográficas en formato APA 7ª edición.
  - `src/js/modulos/mapa.js`: Controla la inicialización de Leaflet, la conmutación de mapas base (CartoDB Positron, Dark Matter, OpenStreetMap, Ortofoto Esri), el motor de popups informativos y el **Inspector Normativo del Plan Regulador Comunal (PRC Santiago)**.
  - `src/js/modulos/overpass.js`: Gestiona las consultas en sintaxis Overpass QL hacia los servidores de Overpass API (`overpass-api.de`, `kumi-systems`, `openstreetmap.fr`), extrayendo geometrías vivas de nodos, vías y relaciones.

---

### Hojas de Estilo CSS Puro (Variables Nativas y Diseño Responsivo)

- **Tecnología:** CSS3 puro con variables nativas (*custom properties*), CSS Grid, Flexbox y media queries fluidas.
- **Sistema de Diseño (Design Tokens):** Ubicado en `src/css/variables.css`.
  - Color Primario Institucional (Musgo): `#10B981` (rgb: `16, 185, 129`)
  - Acento Geográfico (Agua): `#38BDF8` (rgb: `56, 189, 248`)
  - Acento Comunitario (Ocre): `#FBBF24` (rgb: `251, 191, 36`)
  - Fondo Base Oscuro: `#0F172A` / `#0B0F19`
  - Contraste Tipográfico: Texto principal `#FFFFFF` y secundario `#94A3B8`.
- **Regla de Oro:** No utilices colores fijos en los componentes; referencia siempre las variables declaradas (`var(--musgo)`, `var(--fondo-tarjeta)`, etc.) para garantizar la consistencia visual y el soporte de contraste accesible WCAG 2.1 AA.

---

### Capa Geoespacial GeoJSON (WGS 84 / EPSG:4326)

- **Estándar:** RFC 7946 GeoJSON.
- **Sistema de Referencia de Coordenadas (CRS):** Obligatoriamente **EPSG:4326 (WGS 84)** en coordenadas geográficas (longitud, latitud en grados decimales).
- **Esquema Normalizado de Atributos VGI (14 campos):**
  Toda entidad capturada en terreno o integrada al Atlas debe incluir la siguiente estructura en su objeto `properties`:
  1. `id`: Identificador alfanumérico único.
  2. `nombre`: Topónimo o denominación del elemento.
  3. `categoria_vgi`: Código maestro (`CAT-01` a `CAT-10`).
  4. `osm_key`: Clave principal de OpenStreetMap (ej: `amenity`).
  5. `osm_value`: Valor asociado (ej: `bicycle_parking`).
  6. `fuente`: Origen del dato (`OpenStreetMap`, `GBIF`, `Terreno JJVV`).
  7. `autor_contribucion`: Usuario OSM o colectivo responsable.
  8. `fecha_relevamiento`: Fecha ISO 8601 (`YYYY-MM-DD`).
  9. `calidad_icv`: Puntaje de calidad estimado (0.0 a 1.0).
  10. `comuna`: Denominación administrativa (`Santiago`).
  11. `barrio`: Unidad territorial barrial (`Barrio Brasil`).
  12. `licencia`: Licencia legal del registro (`ODbL 1.0`, `CC BY-SA 4.0`).
  13. `cita_fuente`: Cita bibliográfica abreviada.
  14. `atributos_extra`: Objeto JSON con propiedades específicas del fenómeno.
- **Git LFS (Large File Storage):** Los archivos GeoJSON que superen los 10 MB están gestionados mediante Git LFS para mantener la agilidad del repositorio. Al incorporar archivos de gran volumen, verifica que queden registrados en `.gitattributes`.

---

### Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3

- **Infraestructura:** Clúster relacional en la nube (Supabase) con extensión espacial PostGIS 3.3.
- **Arquitectura de Consultas Espaciales:**
  - Tabla `public.capas_entidades`: Almacena más de 129.000 geometrías vectoriales indexadas con índices R-Tree `GIST(geom)`.
  - Función RPC `fn_obtener_capa_bbox`: Permite recortar y extraer geometrías en milisegundos basadas en el polígono visible del usuario:
    ```sql
    SELECT * FROM public.fn_obtener_capa_bbox('semaforos_rm_uoct_2026', -70.6720, -33.4505, -70.6580, -33.4350);
    ```
  - Tabla `public.capas_metadata`: Catálogo relacional con los metadatos de las 109 capas oficiales.

---

### Pipeline CLI, Automatización y ETL en Python 3

- **Ubicación:** Carpeta `scripts/`.
- **Dependencias Python:** `openpyxl` (para generación de hojas de cálculo Excel), `requests` (para consultas HTTP a APIs espaciales).
- **Scripts Principales:**
  - `python3 scripts/verificar_conteo_capas.py`: Verifica que el conteo de capas en `src/js/modulos/ide_chile.js` sea exactamente de **109 capas oficiales** y **119 capas totales**.
  - `python3 scripts/generar_catalogos_excel.py`: Lee la definición de capas desde `ide_chile.js` y genera automáticamente los tres libros Excel institucionales sincronizándolos en `docs/` y `src/docs/`:
    - `catalogo_fuentes_vgi.xlsx`
    - `perfil_metadatos_vgi.xlsx`
    - `categorias_tematicas_osm.xlsx`
  - `python3 scripts/generar_seed_sql.py`: Sincroniza las 109 capas hacia el archivo `scripts/db/02_seed_metadata.sql` para poblar el clúster PostGIS en la nube.

---

## 5. Guías Paso a Paso para Nuevas Contribuciones

### Cómo agregar una nueva Capa Oficial del Estado

1. **Obtén y prepara el archivo GeoJSON:**
   - Asegúrate de que esté en **EPSG:4326 (WGS 84)**.
   - Si proviene de un Shapefile (.shp), reproyéctalo con GDAL:
     ```bash
     ogr2ogr -f GeoJSON -t_srs EPSG:4326 mi_nueva_capa.geojson mi_capa_original.shp
     ```
   - Nómbralo con un identificador claro (ej: `capa_nueva_salud.geojson`).
   - Cópialo en `data/` y en `src/data/`.
2. **Registra la capa en `src/js/modulos/ide_chile.js`:**
   Agrega una nueva entrada dentro del objeto `const CAPAS_OFICIALES = { ... }`:
   ```javascript
   'nueva_capa_id': {
     id: 'nueva_capa_id',
     num_bbdd: 110,
     nombre: "Nombre Oficial de la Capa o Indicador",
     institucion: "Ministerio de Salud / Subsecretaría de Redes Asistenciales",
     ministerio: "Ministerio de Salud (MINSAL)",
     tipoServicio: "Vectorial GeoJSON / OGC WFS",
     urlServicio: "https://geoportal.cl/...",
     archivoLocal: "data/capa_nueva_salud.geojson",
     color: "#10B981",
     icono: "🏥",
     geometria: "Puntos / Polígonos",
     grupo: "equipamiento_servicios", // normativa_urbanismo, medio_ambiente_riesgos, comunidad_demografia, movilidad_transporte
     joinInfo: "ORIGINAL",
     descripcion: "Descripción técnica e institucional del indicador catastrado para el Atlas VGI.",
     declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
     citaAPA: "Ministerio de Salud. (2026). Catastro Nacional de Centros de Salud (Capa N° 110). IDE Chile / Geoportal. https://geoportal.cl"
   },
   ```
3. **Sincroniza los catálogos y la base de datos:**
   ```bash
   python3 scripts/generar_seed_sql.py
   python3 scripts/generar_catalogos_excel.py
   ```
4. **Verifica la consistencia global:**
   Actualiza los números de conteo correspondientes y ejecuta:
   ```bash
   python3 scripts/verificar_conteo_capas.py
   ```

---

### Cómo agregar o calibrar una Macro-Categoría VGI

1. Abre `src/js/config.js`.
2. Localiza el objeto `TAXONOMIA_VGI` o `MACRO_CATEGORIAS`.
3. Ajusta las etiquetas OSM (`osmKeys`), la paleta cromática o los filtros sugeridos en sintaxis Overpass QL.
4. Si agregas descriptores al glosario, edita la sección correspondiente en `src/js/modulos/diccionario.js`.

---

### Cómo modificar estilos y componentes visuales

1. Si deseas ajustar un color, margen o tipografía, dirígete a `src/css/variables.css`.
2. Para alterar el comportamiento de botones, tarjetas o modales, modifica `src/css/componentes.css`.
3. Abre `src/index.html` en tu navegador con un servidor local para verificar que los cambios mantengan la responsividad en móviles y escritorios.

---

### Cómo sincronizar catálogos Excel y base de datos SQL

Cada vez que se modifique un nombre de capa, una institución o una cita bibliográfica en `src/js/modulos/ide_chile.js`:

```bash
# 1. Regenerar el seed SQL para PostGIS
python3 scripts/generar_seed_sql.py

# 2. Regenerar los 3 libros Excel OpenXML
python3 scripts/generar_catalogos_excel.py

# 3. Validar consistencia de conteos
python3 scripts/verificar_conteo_capas.py
```

---

## 6. Estándares de Código Abierto y Buenas Prácticas

### Convención de Commits (Conventional Commits)

Utilizamos el estándar formal de mensajes de confirmación de Git para mantener un historial trazable y legible:

- `feat(modulo):` Nueva funcionalidad o capa cartográfica (ej: `feat(capas): agregar red de ciclovías comunales`).
- `fix(modulo):` Corrección de error o inconsistencia (ej: `fix(overpass): resolver timeout en consulta de arbolado`).
- `docs(modulo):` Actualizaciones en manuales o referencias (ej: `docs(conteo): actualizar a 109 capas oficiales`).
- `style(css):` Ajustes visuales, diseño responsive o contrastes (ej: `style(visor): mejorar padding de popups`).
- `refactor(codigo):` Reestructuración de código sin alterar su comportamiento externo.
- `chore(scripts):` Mantenimiento de scripts de soporte, pipelines o dependencias.

---

### Tríada de Licencias Abiertas

El Atlas implementa una arquitectura jurídica plural y compatible:

1. **Código Fuente del Software (Frontend SPA & Scripts):**
   - Licencia: **GNU Affero General Public License v3.0 (AGPLv3)**.
   - Garantiza que cualquier software derivado o servicio web basado en este Atlas permanezca libre, abierto y disponible para la comunidad bajo la misma licencia.
2. **Datos Cartográficos Colaborativos (OpenStreetMap):**
   - Licencia: **Open Database License (ODbL) 1.0** (Open Data Commons).
   - Cualquier enriquecimiento o derivado de datos OSM debe compartirse bajo ODbL atribuyendo a *© Colaboradores de OpenStreetMap*.
3. **Observaciones Biológicas y Biodiversidad (GBIF):**
   - Licencia: **Creative Commons Atribución (CC BY 4.0)** o **Dominio Público (CC0 1.0)**.
4. **Documentación, Metadatos y Mapas Temáticos:**
   - Licencia: **Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)**.
5. **Capas Cartográficas del Estado de Chile:**
   - Amparadas por la **Ley N° 20.285 de Transparencia y Acceso a la Información Pública**. Datos públicos de libre uso con obligación de citar al organismo emisor.

---

### Trazabilidad, Linaje y Normas APA 7ª Edición

Todo dato incorporado al Atlas debe cumplir con la regla de **"Cero Inventos"**:
- Cada capa debe contar con su institución de origen verificada y enlace web activo.
- Las referencias bibliográficas deben formularse rigurosamente bajo el estándar **APA 7ª edición**:
  ```text
  Institución Emisora. (Año). Título Oficial de la Capa (Capa N° XX). Portal o Geoportal Oficial. URL_Persistente
  ```
- No se admiten capas espaciales sin linaje ni atribución legal explícita.

---

## 7. Contacto y Soporte Institucional

- **Repositorio Oficial:** [https://github.com/GEOJOTA/atlas_vgi_uah](https://github.com/GEOJOTA/atlas_vgi_uah)
- **Plataforma Web en Producción:** [https://atlasvgiuah.netlify.app](https://atlasvgiuah.netlify.app)
- **Institución:** Departamento de Geografía, Facultad de Ciencias Sociales, Universidad Alberto Hurtado (UAH), Santiago de Chile.
- **Marco de Investigación:** Proyecto F1261256 (ANID).
- **Canal de Discusión y Reportes:** [GitHub Discussions & Issues](https://github.com/GEOJOTA/atlas_vgi_uah/issues)

¡Gracias por ser parte de la construcción de un territorio más justo, transparente y colaborativo! 🗺️✨
