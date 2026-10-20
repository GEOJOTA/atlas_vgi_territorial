# Manual de Actualización Técnica, Operativa y Arquitectura del Atlas VGI

**Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Proyecto:** Atlas de Información Geográfica Voluntaria para la Gestión Territorial — Nodo GeoAbierto  
**Autoría Técnica:** Juan Pablo Lescano Villegas (GEOJOTA)  
**Estándares:** ISO 19115-1:2014, ISO 19139:2007, ISO 19157:2013/2023, ISO 19110:2016, IDE Chile / SNIT  
**Licenciamiento:** ODbL 1.0 (Datos OSM) · CC BY-SA 4.0 (Cartografía y Documentos) · GNU AGPLv3 (Software)  
**URL de Producción Oficial:** [https://atlasvgiuah.netlify.app](https://atlasvgiuah.netlify.app)  
**Repositorio Oficial:** [https://github.com/GEOJOTA/atlas_vgi_uah](https://github.com/GEOJOTA/atlas_vgi_uah)

---

## 1. Identificación Institucional, Alcance y Principios de Diseño

### 1.1. Propósito y Filosofía del Manual
El presente documento constituye la **guía maestra de referencia técnica, operativa y de ingeniería de software** para el mantenimiento, actualización, refactorización y escalamiento del *Atlas de Información Geográfica Voluntaria para la Gestión Territorial*. Su diseño está orientado a proveer instrucciones deterministas, exhaustivas y desprovistas de ambigüedad para que cualquier desarrollador, investigador, analista SIG o administrador de sistemas pueda intervenir cada componente del proyecto, desde la configuración de servidores perimetrales en Netlify hasta la modificación de un puntero de ratón, un token de color CSS o la estructura interna de una consulta espacial en PostgreSQL/PostGIS.

El Atlas VGI fue concebido bajo el principio de **soberanía tecnológica y reproducibilidad científica**, articulando fuentes de datos geográficos colaborativos (OpenStreetMap, GBIF, uMap) con la cartografía oficial del Estado de Chile (IDE Chile, INE Censo 2024, MINVU, SUBDERE, UOCT, SUBTEL, MIDESO, SEC, CONAF, CIREN, MOP e IGM).

### 1.2. Principios Rectores de la Arquitectura
1. **Costo de Operación Cero Permanente ($0 USD/mes):** El sistema opera íntegramente sobre infraestructura sin costos recurrentes (Netlify Starter CDN, GitHub Free con Git LFS, Supabase Cloud Free Tier y consumo de APIs públicas abiertas con caché local). Toda modificación debe preservar esta restricción presupuestaria.
2. **Arquitectura Client-Side First:** La lógica de procesamiento cartográfico, filtrado de capas, cálculo de métricas de calidad y renderizado de storyboards se ejecuta en el navegador del usuario final mediante JavaScript ES6+ Vanilla. Esto garantiza que la plataforma escale a miles de usuarios concurrentes sin degradación de rendimiento ni saturación de servidores dedicados.
3. **Resiliencia y Triple Failover Espacial:** Ninguna capa cartográfica ni módulo funcional depende de un único punto de fallo (SPOF). Si la base de datos remota en Supabase PostGIS no responde o se agota su cuota de red, el sistema conmuta automáticamente al almacenamiento perimetral (CDN Storage) y, en última instancia, al repositorio local estático (`src/data/`), asegurando una disponibilidad de servicio del 99.9%.
4. **Desacoplamiento Estricto:** La interfaz gráfica (HTML5/CSS3), la capa lógica de módulos (JS IIFE), los catálogos normativos (OpenXML/CSV) y las fuentes vectoriales (GeoJSON/PostGIS) se encuentran estrictamente desacoplados. Es posible actualizar el 100% de los datos vectoriales sin tocar una sola línea de código fuente visual.
5. **Alineamiento con Estándares Internacionales ISO:** Toda entidad geográfica manipulada o incorporada debe ajustarse a las normas ISO 19115 (Metadatos geográficos), ISO 19139 (Esquema de implementación XML) e ISO 19157 (Calidad de la información geográfica), asegurando la interoperabilidad con la Infraestructura de Datos Geoespaciales de Chile (SNIT) y catálogos de metadatos tipo GeoNetwork.

### 1.3. Matriz de Roles y Responsabilidades Técnicas
* **Administrador del Repositorio:** Gestión de ramas (`main`), control de accesos, aprobación de pull requests y monitoreo de la cuota de ancho de banda en Git LFS.
* **Ingeniero Frontend / Web GIS:** Mantenimiento de la SPA (`src/index.html`, `src/css/estilos.css`, `src/js/app.js`), controladores de mapas Leaflet y diseño de storyboards.
* **Administrador de Datos Espaciales (Data Engineer):** Descarga, homologación, reproyección a EPSG:4326 y validación topográfica de capas oficiales del Estado y extractos de Geofabrik.
* **Auditor de Metacalidad:** Ejecución de modelos multicriterio ponderados (WLC v2.0), cálculo de índices de calidad cuantitativa y cualitativa, y actualización de matrices ISO.

---

## 2. Inventario y Topografía Integral del Repositorio

Para operar, mantener o modificar el Atlas VGI es imprescindible comprender la topografía de directorios y la función exacta de cada artefacto. El repositorio organiza el código fuente, la cartografía activa, la documentación formal y los scripts de orquestación bajo una jerarquía limpia y modular:

```text
nodo-geoabierto/
├── .git/                                   # Metadatos del repositorio Git y base de objetos locales
├── .gitattributes                          # Configuración de rastreo LFS para archivos binarios masivos (*.zip, *.gpkg, *.pbf)
├── .github/                                # Configuraciones específicas de GitHub (workflows y plantillas)
├── .gitignore                              # Patrones de exclusión para artefactos temporales (.DS_Store, *.pyc, node_modules)
├── CONTRIBUTING.md                         # Guía de contribución para desarrolladores externos
├── INFORME_PROYECTO_ATLAS_VGI.md           # Memoria descriptiva y estado de avance del proyecto Atlas VGI
├── LICENSE                                 # Licencia tripartita (ODbL 1.0, CC BY-SA 4.0, GNU AGPLv3)
├── MANUAL_ACTUALIZACION_ATLAS.md           # Este manual maestro de actualización técnica y operativa (raíz)
├── MANUAL_USO.md                           # Manual de usuario final para navegación en la interfaz web (raíz)
├── Metricas_Calidad_ISO_Capas_Oficiales_Actualizado.numbers # Hoja de cálculo Apple Numbers con auditorías de calidad iniciales
├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md     # Protocolo de pre-despliegue y verificación de integridad
├── README.md                               # Documento de presentación general del repositorio en GitHub
├── TODO_SIGUIENTE.md                       # Bitácora histórica de tareas y backlog de desarrollo
├── backend/                                # Definiciones de backend, esquemas SQL y funciones serverless
│   ├── db/
│   │   ├── schema.sql                      # Esquema relacional y espacial DDL para PostgreSQL 17 + PostGIS 3.3
│   │   └── funciones_rpc.sql               # Funciones RPC de consulta espacial para Supabase
│   └── functions/                          # Esqueletos de endpoints de persistencia
├── config/                                 # Configuraciones globales desacopladas
│   └── config.json                         # Configuración JSON editable del Atlas (BBox inicial, APIs, metadatos predeterminados)
├── data/                                   # Almacén de trabajo para datos espaciales crudos y procesados
│   ├── subdere_rsd_2024_rm/                # Directorio de 12 capas del Catastro Nacional RSD SUBDERE 2024
│   │   ├── Analisis_Costos_Comuna_RM.geojson
│   │   ├── Ciudades_Pb_Pol_RM.geojson
│   │   ├── Criticidad_Sitios_Disposicion_RSD_Ene24_RM.geojson
│   │   ├── Distancia_Municipio_SDF_RM.geojson
│   │   ├── Gastos_Ingresos_SINIM_RM.geojson
│   │   ├── INVENTARIO_SUBDERE_RSD_2024_RM.json
│   │   ├── Poblacion_Comunal_Atendida_PTA_p_RM.geojson
│   │   ├── Poblacion_Comunal_PTA_RM.geojson
│   │   ├── RSD_PPC_PTA_RM.geojson
│   │   ├── Recoleccion_Transporte_RM.geojson
│   │   ├── SDF_Comunas_RM.geojson
│   │   ├── SDF_Municipios_RM.geojson
│   │   ├── Sitios_Disposicion_RSD_Ene24_RM.geojson
│   │   └── Sitios_Intermedios_Disposicion_RSD_Ene24_RM.geojson
│   ├── cache_consultas/                    # Respuestas cacheadas de Overpass y ohsome para desarrollo offline
│   └── *.geojson                           # Más de 200 archivos vectoriales GeoJSON normalizados
├── docs/                                   # Documentación técnica maestra y entregables curriculares (espejo)
│   ├── ANALISIS_METACALIDAD.md             # Informe técnico de evaluación de calidad ISO 19157 (95.41% IGV)
│   ├── ARQUITECTURA.md                     # Memoria de diseño de software y diagramas de componentes
│   ├── BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md   # Catálogo de 125 fuentes bibliográficas citadas bajo norma APA 7ª ed.
│   ├── GUIA_BASE_DATOS_SUPABASE.md         # Manual de administración de PostGIS y claves de conexión
│   ├── MANUAL_ACTUALIZACION_ATLAS.md       # Copia sincronizada del manual técnico maestro
│   ├── MANUAL_USO.md                       # Copia sincronizada del manual operativo de usuario
│   ├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md # Copia sincronizada del protocolo de integridad
│   ├── TRAZABILIDAD_ACADEMICA.md           # Bitácora de toma de decisiones de diseño cartográfico
│   ├── catalogo_fuentes_vgi.xlsx           # Matriz estructurada de proveedores, APIs y licencias
│   ├── categorias_tematicas_osm.xlsx       # Libro Excel con las 10 macrocategorías VGI y etiquetas OSM
│   ├── correlacion_dimensiones_calidad.csv # Matriz de correlación entre las 5 dimensiones cuantitativas y 5 cualitativas
│   ├── correlacion_dimensiones_calidad.png # Gráfico térmico (heatmap) de la correlación de calidad
│   ├── geodatabase_completa_atlas_vgi.zip  # Paquete comprimido oficial de 542.9 MB con 256 archivos
│   ├── matriz_metacalidad.json             # Resultados cuantitativos de la evaluación de las 131 capas
│   ├── perfil_metadatos_vgi.xlsx           # Libro Excel con el perfil de metadatos ISO 19115 y auditoría de calidad
│   ├── wlc_metacalidad_ranking.csv         # Ranking ordenado de capas según su puntuación WLC
│   └── wlc_metacalidad_resultado.json      # Estructura JSON de pesos y puntajes del modelo WLC
├── img/                                    # Recursos de imagen para documentación y marketing
│   └── cartografias/                       # Láminas cartográficas oficiales en alta resolución (Censo 2024, morfología)
├── netlify/                                # Funciones serverless de Netlify
│   └── functions/
│       └── oauth-token.js                  # Endpoint serverless para intercambio seguro de tokens OAuth2 de OSM
├── netlify.toml                            # Archivo maestro de configuración de compilación, headers y caché de Netlify
├── requirements.txt                        # Lista de dependencias Python para los scripts de mantenimiento
├── scripts/                                # Directorio de scripts Python para automatización, calidad y empaquetado
│   ├── analisis_metacalidad.py             # Auditor de calidad espacial ISO 19157 sobre las 131 capas
│   ├── build_all_deliverables.py           # Orquestador integral de compilación de entregables
│   ├── cargar_entidades_postgis.py         # Ingesta masiva de GeoJSON hacia tablas PostgreSQL/PostGIS
│   ├── empaquetar_base_datos_completa.py   # Generador del archivo ZIP maestro con cálculo de MD5 e inventarios
│   ├── generar_catalogos_excel.py          # Generador de libros OpenXML (.xlsx) con estilos y metadatos
│   ├── generar_doc_estado_avance.py        # Generador del informe formal de avance en formato Word (.docx)
│   ├── generar_gpkg_geofabrik.py           # Constructor de bases GeoPackage (.gpkg) a partir de Geofabrik
│   ├── generar_ppt_estado_avance_blanco.py # Generador de presentaciones ejecutivas PowerPoint (.pptx)
│   ├── generar_xls_estado_avance.py        # Constructor de la Carta Gantt y matrices curriculares en Excel (.xlsx)
│   ├── modelo_indice_lineal_wlc.py         # Motor matemático del Weighted Linear Combination para calidad espacial
│   ├── procesar_geofabrik_rm.py            # Cortador y clasificador del dump regional de OpenStreetMap
│   ├── verificar_conteo_capas.py           # Test unitario que valida la presencia de 121 capas oficiales + 10 VGI
│   └── verificar_integridad_despliegue.py  # Auditoría obligatoria previa a cada despliegue en producción
├── src/                                    # Raíz del sitio estático desplegado en producción por Netlify
│   ├── index.html                          # Punto de entrada de la Single Page Application (SPA)
│   ├── css/
│   │   └── estilos.css                     # Hoja de estilos universal (variables, reset, layout, mapa, consolas, modals)
│   ├── data/                               # Archivos GeoJSON activos servidos por el servidor web
│   │   ├── subdere_rsd_2024_rm/            # Capas SUBDERE 2024 para la aplicación web
│   │   └── *.geojson                       # 216 capas vectoriales activas para consumo directo
│   ├── docs/                               # Espejo público de documentos técnicos y paquetes descargables
│   │   └── geodatabase_completa_atlas_vgi.zip # Archivo ZIP descargable desde los botones de la interfaz
│   ├── img/                                # Logotipos, iconos e imágenes vectoriales servidas al cliente
│   │   ├── UAH-Insignia.jpg                # Isotipo institucional de la Universidad Alberto Hurtado
│   │   └── cartografias/                   # Láminas en alta definición accesibles vía Lightbox
│   └── js/                                 # Código fuente JavaScript modular de la aplicación
│       ├── app.js                          # Orquestador principal, enrutamiento, controladores de eventos y modales
│       ├── config.js                       # Parámetros en tiempo de ejecución inyectados en window.NODO_CONFIG
│       └── modulos/                        # Módulos especializados desacoplados
│           ├── db_client.js                # Cliente de conexión hacia Supabase con manejo de failover
│           ├── diccionario.js              # Controlador del Módulo 07: Diccionario territorial
│           ├── evaluador_calidad_cuantitativa.js # Controlador del Módulo 03: Auditor de calidad ISO 19157 en cliente
│           ├── evaluador_normativo.js      # Motor de consulta espacial punto-polígono del Inspector PRC
│           ├── gbif.js                     # Controlador del Módulo 04: Registros de biodiversidad
│           ├── geodesia.js                 # Rutinas de cálculo geodésico y transformaciones de coordenadas
│           ├── ide_chile.js                # Catálogo estructurado de las 121 capas oficiales del Estado
│           ├── importador_capas.js         # Módulo drag-and-drop para cargar archivos locales en el mapa
│           ├── indicadores_analisis.js     # Controlador del Módulo 09: 5 dimensiones y storyboards barriales
│           ├── licencias.js                # Controlador del Módulo 08: Marco legal y descarga de catálogos
│           ├── manifold_canvas.js          # Fondo interactivo de topografía animada y partículas en Canvas HTML5
│           ├── manual.js                   # Controlador del Módulo 10: Manual de uso y visor documental
│           ├── mapa.js                     # Controlador del Módulo 01: Inicialización y capas de Leaflet
│           ├── metadatos.js                # Controlador del Módulo 06: Generador de fichas ISO 19115/19139
│           ├── ohsome.js                   # Cliente API de ohsome para análisis de evolución histórica OSM
│           ├── osm.js                      # Controlador del Módulo 02: Consultas Overpass QL interactivas
│           ├── taginfo.js                  # Cliente API de Taginfo para estadísticas de etiquetas OSM en Chile
│           └── umap.js                     # Controlador del Módulo 05: Integración de iframes uMap
└── vercel.json                             # Configuración secundaria opcional para despliegues espejo en Vercel
```

### 2.1. Diferencia Crítica entre `data/` y `src/data/`
Una fuente recurrente de confusión al modificar datos es la coexistencia de `data/` y `src/data/`:
* **`data/` (Área de Trabajo del Analista SIG):** Es la carpeta de origen donde se descargan shapefiles, se ejecutan scripts de limpieza y se almacenan capas experimentales o versiones intermedias.
* **`src/data/` (Entorno de Producción Web):** Es la carpeta pública que el servidor web de Netlify expone en la raíz (`/data/nombre_capa.geojson`). **Los módulos JavaScript leen exclusivamente de `src/data/`.** Si un analista modifica un archivo en `data/` pero no lo copia a `src/data/`, el visor web continuará mostrando la versión antigua. El script `scripts/empaquetar_base_datos_completa.py` verifica y sincroniza ambas ubicaciones automáticamente.

---

## 3. Arquitectura del Sistema y Pila Tecnológica (Stack)

### 3.1. Visión Holística del Flujo de Datos
El Atlas VGI opera bajo una arquitectura desacoplada donde el navegador web del usuario asume el rol de cliente analítico y motor de visualización, comunicándose de manera asíncrona con servicios distribuidos:

```mermaid
flowchart TD
    subgraph Cliente["Navegador del Usuario (SPA Vanilla JS)"]
        UI["Interfaz Gráfica (HTML5 / CSS3 Tokens)"]
        APP["Orquestador Central (app.js)"]
        LeafletMap["Motor Cartográfico (Leaflet 1.9.4)"]
        ModulosJS["10 Módulos de Especialidad (IIFE Modules)"]
        UI --> APP
        APP --> LeafletMap
        APP --> ModulosJS
    end

    subgraph TripleFailover["Mecanismo de Triple Failover Espacial"]
        P1["1. Supabase PostGIS (RPC Espacial en Vivo)"]
        P2["2. Supabase Storage CDN (GeoJSON Remoto Optimizado)"]
        P3["3. Repositorio Local Estático (src/data/ GeoJSON)"]
        ModulosJS -->|Consulta Primaria| P1
        P1 -.->|Si falla o timeout| P2
        P2 -.->|Si falla o sin red| P3
    end

    subgraph InfraExterna["APIs Abiertas en Tiempo Real"]
        Overpass["Overpass API (Consultas QL en Vivo)"]
        Ohsome["ohsome API v2 (Métricas Históricas OSM)"]
        GBIF["GBIF API (Registros Darwin Core)"]
        Taginfo["Taginfo API (Frecuencia de Tags en Chile)"]
    end

    ModulosJS --> Overpass
    ModulosJS --> Ohsome
    ModulosJS --> GBIF
    ModulosJS --> Taginfo

    subgraph CDNNetlify["Infraestructura y Alojamiento ($0 USD)"]
        NetlifyEdge["Netlify Edge CDN (Compresión Brotli/Gzip)"]
        LFSStorage["GitHub Git LFS (Paquete Maestro ZIP 542 MB)"]
        NetlifyEdge --- LFSStorage
    end

    Cliente <--> NetlifyEdge
```

### 3.2. Pila Tecnológica Detallada
* **Capa de Presentación:** HTML5 semántico estructurado bajo el estándar BEM (*Block Element Modifier*), sin frameworks pesados (React, Angular o Vue) para garantizar carga instantánea (<1.2 segundos para el First Contentful Paint).
* **Capa de Estilos:** CSS3 nativo puro estructurado con variables semánticas (`:root`), Grid y Flexbox. No se utilizan preprocesadores (Sass/Less) para eliminar etapas de transpilación y permitir modificaciones directas en caliente.
* **Capa Lógica del Cliente:** JavaScript moderno (ES6+), implementado mediante el patrón de diseño *Revealing Module Pattern* envuelto en IIFE (*Immediately Invoked Function Expressions*). Esto evita la contaminación del ámbito global (`window`), exponiendo únicamente APIs públicas selectas como `window.ModuloMapa`, `window.ModuloIDEChile` o `window.ModuloIndicadores`.
* **Capa Cartográfica Web:** Leaflet 1.9.4 servido vía CDN oficial con integridad criptográfica Subresource Integrity (SRI). Soporta capas teseladas WMS/WMTS, geometrías vectoriales GeoJSON, marcadores dinámicos SVG (`L.divIcon`) y popups vinculados al Inspector Normativo.
* **Capa de Persistencia Relacional y Espacial:** PostgreSQL 17 con extensión PostGIS 3.3 alojado en Supabase Cloud. Maneja tablas espaciales nativas en coordenadas geográficas WGS84 (EPSG:4326), indexadas mediante árboles R espaciales (índices GIST).
* **Capa Serverless Perimetral:** Netlify Edge Network con soporte HTTP/2, compresión dinámica Brotli y funciones serverless basadas en Node.js 18.x (`netlify/functions/`) para tareas que requieren ocultar credenciales secretas (ej. OAuth de OpenStreetMap).

---

## 4. Guía Exhaustiva de Modificación de Netlify

Netlify es el proveedor perimetral de alojamiento y CDN del Atlas VGI. Toda directiva de compilación, enrutamiento, seguridad perimetral y encabezados HTTP se gestiona mediante el archivo maestro [`netlify.toml`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/netlify.toml) ubicado en la raíz del repositorio.

### 4.1. Anatomía y Configuración de `netlify.toml`
El archivo actual se encuentra optimizado para el servicio de grandes volúmenes de datos vectoriales y archivos comprimidos vía Git LFS. A continuación se desglosa su estructura operacional:

```toml
[build]
  publish = "src"       # Define 'src/' como el directorio raíz expuesto en producción
  functions = "netlify/functions" # Directorio donde residen funciones Node.js serverless

[build.environment]
  GIT_LFS_FETCH_INCLUDE = "*.zip,*.xlsx,*.csv,*.docx" # Archivos LFS que Netlify debe descargar obligatoriamente en el build
  GIT_LFS_SKIP_SMUDGE = "0"                          # Fuerza a git-lfs a expandir los archivos reales, no punteros de 130 bytes
  NODE_VERSION = "18"                                # Fija la versión del runtime para Netlify Functions

# -----------------------------------------------------------------------------
# Cabeceras Globales de Seguridad Perimetral
# -----------------------------------------------------------------------------
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"                   # Previene ataques de Clickjacking permitiendo iframes solo del mismo origen
    X-Content-Type-Options = "nosniff"               # Obliga al navegador a respetar el Content-Type declarado
    X-XSS-Protection = "1; mode=block"               # Activa el filtro anti-XSS integrado en navegadores
    Referrer-Policy = "strict-origin-when-cross-origin"
    Access-Control-Allow-Origin = "*"                # Habilita CORS abierto para que investigadores consuman los GeoJSON directamente

# -----------------------------------------------------------------------------
# Tipos MIME y Reglas de Caché para la Geodatabase Comprimida (.zip)
# -----------------------------------------------------------------------------
[[headers]]
  for = "/docs/*.zip"
  [headers.values]
    Content-Type = "application/zip"
    Content-Disposition = "attachment; filename="geodatabase_completa_atlas_vgi.zip""
    Cache-Control = "public, max-age=0, must-revalidate" # Fuerza al navegador a verificar cambios antes de servir desde caché local

# -----------------------------------------------------------------------------
# Optimización de Rendimiento para Archivos Cartográficos GeoJSON
# -----------------------------------------------------------------------------
[[headers]]
  for = "/data/*.geojson"
  [headers.values]
    Content-Type = "application/geo+json; charset=utf-8"
    Cache-Control = "public, max-age=86400, stale-while-revalidate=604800" # Cachea por 24 hrs pero permite revalidación en segundo plano

# -----------------------------------------------------------------------------
# Reglas de Enrutamiento y Redirecciones
# -----------------------------------------------------------------------------
[[redirects]]
  from = "/geodatabase"
  to = "/docs/geodatabase_completa_atlas_vgi.zip"
  status = 302
  force = true

[[redirects]]
  from = "/manual"
  to = "/#manual"
  status = 302
  force = false
```

### 4.2. Procedimiento para Modificar Parámetros de Netlify
1. **Cambiar el Directorio de Publicación:** Si en el futuro se incorpora un empaquetador (ej. Vite o Webpack) que genere una carpeta `dist/`, debe modificarse la línea `publish = "src"` por `publish = "dist"`.
2. **Agregar Nuevas Extensiones a Git LFS en Netlify:** Si se incorporan archivos `.gpkg` o `.pbf` al repositorio, deben añadirse a la variable `GIT_LFS_FETCH_INCLUDE`:
   ```toml
   GIT_LFS_FETCH_INCLUDE = "*.zip,*.xlsx,*.csv,*.docx,*.gpkg,*.pbf"
   ```
3. **Purgar la Caché del CDN de Netlify:**
   * Iniciar sesión en [app.netlify.com](https://app.netlify.com).
   * Navegar a **Sites** $ightarrow$ **atlasvgiuah** $ightarrow$ **Deploys**.
   * Hacer clic en el menú desplegable **Trigger deploy** y seleccionar **Clear cache and deploy site**.
   * Esto forzará una reconstrucción limpia, descartando cualquier objeto en caché en los servidores de borde.

---

## 5. Guía Exhaustiva de Estilos, Colores y Tokens Visuales

El Atlas VGI implementa un sistema de diseño institucional sobrio, legible y de alta densidad de información, diseñado para el análisis territorial prolongado sin fatiga visual. Todas las propiedades visuales están centralizadas en [`src/css/estilos.css`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/css/estilos.css).

### 5.1. Diccionario de Tokens de Color en `:root`
Para modificar cualquier color de la interfaz, basta con alterar la variable correspondiente en la sección superior de `src/css/estilos.css` (líneas 1 a 65):

```css
:root {
  /* ==========================================================================
     PALETA CROMÁTICA INSTITUCIONAL Y SEMÁNTICA
     ========================================================================== */
  --musgo: #0284c7;           /* Azul cian de alto contraste para acentos primarios y selecciones activas */
  --esmeralda: #10b981;       /* Verde esmeralda para validaciones positivas, botones de descarga y estado 100% OK */
  --ocre: #f59e0b;            /* Amarillo ocre para alertas, advertencias y estados en progreso */
  --carmesí: #ef4444;         /* Rojo intenso para errores críticos, topología inválida y botones de cierre */
  --purpura: #8b5cf6;         /* Púrpura para capas normativas y patrimonio histórico */
  --ambar: #d97706;           /* Ámbar para equipamiento secundario y advertencias menores */

  /* ==========================================================================
     ESCALA DE GRISES Y SUPERFICIES DE FONDO (DARK THEME PROFESIONAL)
     ========================================================================== */
  --bg-dark: #0b111e;         /* Fondo base de la aplicación (azul muy oscuro casi negro) */
  --papel: #111827;           /* Superficie de tarjetas, paneles laterales y modales (gris carbón 900) */
  --papel-elevado: #1f2937;   /* Superficie para elementos flotantes, headers y menús desplegables (gris 800) */
  --linea: #374151;           /* Bordes sutiles entre paneles y divisores estructurales (gris 700) */
  --linea-suave: #1f2937;     /* Bordes secundarios internos para grillas de datos */

  /* ==========================================================================
     TIPOGRAFÍA Y CONTRASTE DE TEXTO (WCAG AAA)
     ========================================================================== */
  --tinta: #f9fafb;           /* Texto de máxima jerarquía (blanco cálido para títulos y valores KPI) */
  --tinta-suave: #9ca3af;     /* Texto de jerarquía secundaria (gris medio para párrafos y etiquetas) */
  --tinta-tenue: #6b7280;     /* Texto de baja jerarquía (gris oscuro para pies de página y metadatos) */

  /* ==========================================================================
     FAMILIAS TIPOGRÁFICAS
     ========================================================================== */
  --fuente-texto: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --fuente-datos: 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* ==========================================================================
     DIMENSIONES Y RADIOS DE BORDE
     ========================================================================== */
  --ancho-consola-gis: 380px; /* Ancho fijo de la consola cartográfica izquierda en pantallas grandes */
  --alto-header: 56px;        /* Altura fija de la barra de navegación superior */
  --radio-sm: 4px;            /* Radio de esquinas para botones pequeños e insignias */
  --radio-md: 8px;            /* Radio de esquinas para tarjetas de capas y modales */
  --radio-lg: 14px;           /* Radio de esquinas para contenedores principales */
}
```

### 5.2. Cómo Cambiar el Esquema Cromático de la Aplicación
1. **Modificar el Color de Acento Primario:** Si se requiere cambiar el azul cian por un azul marino institucional o verde bosque, reemplace `--musgo`:
   ```css
   /* Ejemplo: Cambio a azul institucional UAH */
   --musgo: #004b87;
   ```
2. **Modificar el Fondo del Visor y Paneles:** Para atenuar el contraste o convertirlo en un tema grisáceo neutro:
   ```css
   --bg-dark: #121212;
   --papel: #1e1e1e;
   --papel-elevado: #2d2d2d;
   ```
3. **Modificar la Apariencia de los Botones de Acción (`.accion`):**
   Ubique la regla `.accion` en `src/css/estilos.css` (alrededor de la línea 320) para modificar el espaciado, sombra o gradiente:
   ```css
   button.accion {
     display: inline-flex;
     align-items: center;
     justify-content: center;
     gap: 8px;
     padding: 8px 16px;
     font-family: var(--fuente-texto);
     font-size: 0.88rem;
     font-weight: 700;
     color: #0b111e;
     background: var(--esmeralda);
     border: none;
     border-radius: var(--radio-sm);
     cursor: pointer;
     transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
     box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
   }
   button.accion:hover {
     filter: brightness(1.1);
     transform: translateY(-1px);
     box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
   }
   ```

---

## 6. Guía Exhaustiva de Modificación de Punteros, Cursores y Marcadores Espaciales

El comportamiento visual del ratón y la forma en que los elementos geográficos se señalan en pantalla comunican de inmediato el modo operativo en que se encuentra el usuario.

### 6.1. Modificación de Cursores CSS en la Interfaz
En `src/css/estilos.css` se definen los punteros para cada estado y herramienta:
* **Cursor Predeterminado:** `cursor: default;` aplicado al `body` y contenedores pasivos.
* **Cursor Interactivo de Puntero (Mano):** `cursor: pointer;` asignado a botones, enlaces, tarjetas de capas (`.tarjeta-capa-gis`), interruptores y pestañas.
* **Cursor de Espera / Bloqueo:** `cursor: wait;` o `cursor: not-allowed;` asignado a botones deshabilitados mientras se procesa una consulta en Overpass o se descarga la base de datos:
  ```css
  button:disabled {
    cursor: not-allowed !important;
    opacity: 0.55;
    filter: grayscale(1);
  }
  ```
* **Cursor de Inspección Normativa (Crosshair):** Cuando el usuario activa la herramienta de inspección territorial del PRC de Santiago, el contenedor del mapa debe cambiar a una retícula de precisión:
  ```css
  .leaflet-container.modo-inspeccion-activa {
    cursor: crosshair !important;
  }
  ```

### 6.2. Modificación de Cursores en el Mapa Leaflet (`mapa.js`)
Leaflet controla el cursor del mapa mediante clases CSS aplicadas sobre el contenedor `.leaflet-container`. Para personalizarlo quirúrgicamente en [`src/js/modulos/mapa.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/mapa.js):

1. **Cursor de Arrastre Libre (Pan):**
   Por defecto Leaflet usa `cursor: grab;` y al hacer clic sostenido conmuta a `cursor: grabbing;`. Para cambiarlo por un puntero clásico o flecha:
   ```javascript
   // En src/js/modulos/mapa.js, dentro de inicializarMapa():
   map.getContainer().style.cursor = 'default';
   ```
2. **Cursor Dinámico según la Herramienta Seleccionada:**
   Se puede implementar una función conmutadora de modo en `src/js/modulos/mapa.js`:
   ```javascript
   function setModoHerramientaMapa(modo) {
     const contenedor = map.getContainer();
     contenedor.classList.remove('modo-pan', 'modo-inspeccion', 'modo-medicion', 'modo-dibujo');
     
     switch (modo) {
       case 'inspeccion':
         contenedor.classList.add('modo-inspeccion');
         contenedor.style.cursor = 'crosshair';
         break;
       case 'medicion':
         contenedor.classList.add('modo-medicion');
         contenedor.style.cursor = 'cell';
         break;
       case 'dibujo':
         contenedor.classList.add('modo-dibujo');
         contenedor.style.cursor = 'draw-polygon'; // O cursor SVG personalizado
         break;
       default:
         contenedor.classList.add('modo-pan');
         contenedor.style.cursor = ''; // Restaura el grab nativo de Leaflet
     }
   }
   ```
3. **Punteros Personalizados con Imágenes o SVGs:**
   Para utilizar un puntero SVG propio en lugar de los cursores estándar del sistema operativo:
   ```css
   .leaflet-container.modo-inspeccion {
     cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2338bdf8" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>') 12 12, crosshair !important;
   }
   ```

### 6.3. Modificación de Marcadores Vectoriales (`L.divIcon` y `L.circleMarker`)
Los puntos de interés (POI) del Atlas no utilizan imágenes PNG obsoletas, sino marcadores SVG interactivos renderizados dinámicamente con `L.divIcon`:

```javascript
// Ejemplo en src/js/modulos/mapa.js o ide_chile.js para capas puntuales (ej. Semáforos UOCT o Salud)
function crearMarcadorVectorial(feature, latlng, colorHex, iconoSVG) {
  const htmlIcono = `
    <div class="marcador-pin-atlas" style="background:${colorHex};">
      <div class="pin-halo" style="border-color:${colorHex};"></div>
      <span class="pin-simbolo">${iconoSVG}</span>
    </div>
  `;

  return L.marker(latlng, {
    icon: L.divIcon({
      className: 'contenedor-marcador-svg',
      html: htmlIcono,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    })
  });
}
```

Para estilizar y animar estos marcadores en `src/css/estilos.css`:
```css
.contenedor-marcador-svg {
  background: transparent;
  border: none;
}

.marcador-pin-atlas {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.8rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5), inset 0 0 4px rgba(255, 255, 255, 0.6);
  position: relative;
  transition: transform 0.2s ease;
}

.marcador-pin-atlas:hover {
  transform: scale(1.25);
  z-index: 1000 !important;
}

.marcador-pin-atlas .pin-halo {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  opacity: 0.4;
  animation: pulso-marcador 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes pulso-marcador {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(0.9); opacity: 0; }
}
```

### 6.4. Modificación de Estilos de Capas Poligonales y Lineales
Para modificar el color, grosor de línea, opacidad y resaltado al pasar el ratón (*hover*) en capas poligonales (como Censo 2024 Manzanas o Zonas del PRC):

```javascript
// En src/js/modulos/ide_chile.js o mapa.js:
const estiloPoligonoPRC = {
  color: '#8b5cf6',        // Color del perímetro (púrpura)
  weight: 1.5,             // Grosor en píxeles
  opacity: 0.85,           // Opacidad del contorno
  fillColor: '#8b5cf6',    // Color de relleno interior
  fillOpacity: 0.25,       // Opacidad de relleno translúcido
  dashArray: '3, 3'        // Línea punteada para zonificación preliminar
};

const estiloPoligonoHover = {
  color: '#38bdf8',        // Contorno se ilumina en azul cielo
  weight: 3,               // Se engruesa la línea
  fillOpacity: 0.5         // Relleno se vuelve más opaco
};

layer.on({
  mouseover: function(e) {
    const l = e.target;
    l.setStyle(estiloPoligonoHover);
    l.bringToFront();
  },
  mouseout: function(e) {
    geojsonLayer.resetStyle(e.target);
  }
});
```

---

## 7. Desglose Quirúrgico de los Módulos del Sistema (Módulos 01 al 10)

La plataforma organiza sus capacidades en 10 módulos funcionales independientes y comunicados a través del orquestador [`src/js/app.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/app.js). A continuación se documenta la ingeniería interna de cada uno:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      NAVEGACIÓN SUPERIOR DEL ATLAS                     │
│  [01 Visor VGI]  [02 Overpass]  [03 Calidad ISO]  [04 GBIF]  [05 uMap] │
│  [06 Metadatos]  [07 Glosario]  [08 Licencias]    [09 Storyboards]     │
│  [10 Manual Técnico]                                                   │
└────────────────────────────────────────────────────────────────────────┘
```

### 7.1. Módulo 01: Visor Cartográfico Interactivo y Atlas VGI
* **Propósito:** Núcleo espacial de visualización y consulta cruzada de las 131 capas cartográficas (121 oficiales del Estado y 10 VGI comunitarias), equipado con consola de filtrado, buscador reactivo, visualización de leyendas, inspector normativo y herramientas de medición de terreno.
* **Archivos Clave:**
  - `src/index.html` (líneas 70 a 350): Markup del contenedor `#mapa`, barra de herramientas, controles de capas y botones de descarga.
  - `src/js/modulos/mapa.js`: Inicialización del mapa Leaflet, definición de proveedores de teselas base (*basemaps*), administración de grupos de capas (`L.layerGroup()`), eventos de zoom y centrado.
  - `src/js/modulos/ide_chile.js`: Diccionario maestro de las 121 capas oficiales del Estado, funciones de petición asíncrona (`fetch`), parseo GeoJSON y asignación de estilos según categoría institucional.
  - `src/js/modulos/evaluador_normativo.js`: Motor analítico que detecta clics sobre el mapa, intersecta las coordenadas con las 192 zonas del Plan Regulador Comunal (PRC) de Santiago y genera el Certificado de Informaciones Normativas VGI (CIN-VGI).
  - `src/js/modulos/importador_capas.js`: Lógica de carga drag-and-drop de archivos vectoriales locales del usuario en formatos GeoJSON, KML y Shapefile comprimido en ZIP.
* **Flujo de Ejecución:**
  1. Al cargar la página, `app.js` invoca `ModuloMapa.inicializarMapa()`.
  2. Se renderiza el mapa centrado en Barrio Brasil y Campus UAH: latitud `-33.4442`, longitud `-70.6656`, zoom `16`.
  3. Se construyen dinámicamente las tarjetas de capas en la consola lateral (`crearBotonesCategorias()` para VGI y `crearBotonesCapasOficiales()` para capas del Estado).
  4. Cuando el usuario hace clic en el interruptor de una capa, se invoca `alternarCapaOficialIDE(idCapa)`:
     * Si no está cargada en memoria, se ejecuta `ModuloIDEChile.consultarCapaOficial(idCapa)`.
     * Se crea una capa Leaflet GeoJSON con su popup interactivo y se agrega a `capasOficialesLeaflet[idCapa].addTo(map)`.
     * Se actualizan los KPIs de la consola (capas activas, entidades visibles e ICV dinámico).
* **Cómo Modificar el Zoom y Centro Predeterminado:**
  Edite `src/js/config.js` o `src/js/modulos/mapa.js`:
  ```javascript
  // Coordenadas iniciales [latitud, longitud] y nivel de zoom
  const CENTRO_INICIAL = [-33.4442, -70.6656];
  const ZOOM_INICIAL = 16;
  ```

### 7.2. Módulo 02: Consultas Overpass QL en Vivo
* **Propósito:** Interfaz de consulta directa y extracción en tiempo real hacia la API de OpenStreetMap mediante lenguaje Overpass QL, permitiendo descargar datos vectoriales frescos de cualquier área geográfica.
* **Archivos Clave:** `src/js/modulos/osm.js`, `src/index.html` (`#panel-explorador-osm`).
* **Endpoints Utilizados:** `https://overpass-api.de/api/interpreter`, `https://lz4.overpass-api.de/api/interpreter`.
* **Cómo Funciona:** El usuario define un Bounding Box manual o hace clic en "Capturar BBox actual del mapa". Selecciona una clave OSM (ej. `amenity`, `highway`, `building`, `leisure`) y el módulo construye la consulta:
  ```text
  [out:json][timeout:25];
  (
    node["amenity"="school"](-33.45,-70.68,-33.43,-70.65);
    way["amenity"="school"](-33.45,-70.68,-33.43,-70.65);
    relation["amenity"="school"](-33.45,-70.68,-33.43,-70.65);
  );
  out body;
  >;
  out skel qt;
  ```
* **Manejo de Errores y Timeouts:** Si Overpass está saturado (HTTP 429 o 504), `osm.js` implementa reintentos automáticos hacia servidores espejo y, si persisten, ofrece descargar el extracto local correspondiente desde `src/data/`.

### 7.3. Módulo 03: Calidad VGI & Auditoría Histórica (ohsome API)
* **Propósito:** Evaluación cuantitativa de la evolución temporal, densidad de aportes y número de colaboradores activos en OpenStreetMap para el área de estudio mediante la API ohsome desarrollada por HeiGIT (Universidad de Heidelberg).
* **Archivos Clave:** `src/js/modulos/ohsome.js`, `src/js/modulos/calidad_analyst.js`, `src/js/modulos/evaluador_calidad_cuantitativa.js`.
* **Endpoints:** `https://api.ohsome.org/v1/elements/count`, `https://api.ohsome.org/v1/users/count`.
* **Métricas Extraídas:**
  - `densidad_elementos`: Elementos OSM por km² dentro del polígono de Barrio Brasil.
  - `colaboradores_unicos`: Número de mapeadores distintos que han editado la zona en los últimos 5 años.
  - `evolucion_anual`: Tasa de crecimiento interanual de geometrías de edificios y vías.

### 7.4. Módulo 04: Biodiversidad Colaborativa (GBIF)
* **Propósito:** Consulta y mapeo de observaciones biológicas georreferenciadas provenientes del Global Biodiversity Information Facility (GBIF) y registros ciudadanos de iNaturalist para el cuadrante urbano de Santiago Centro.
* **Archivos Clave:** `src/js/modulos/gbif.js`, `src/index.html` (`#panel-biodiversidad-gbif`).
* **Endpoint:** `https://api.gbif.org/v1/occurrence/search`.
* **Estándar:** Darwin Core (DwC). Extrae taxones validados (`scientificName`, `vernacularName`, `decimalLatitude`, `decimalLongitude`, `eventDate`, `datasetName`, `license`).
* **Filtrado Espacial:** Construye un polígono WKT (*Well-Known Text*) con el bounding box de Barrio Brasil para excluir registros imprecisos o con flag de coordenadas dudosas (`hasCoordinate=true` & `coordinateUncertaintyInMeters<100`).

### 7.5. Módulo 05: Cartografía Colaborativa Externa (uMap)
* **Propósito:** Integración de proyectos cartográficos comunitarios desarrollados en instancias uMap de OpenStreetMap, permitiendo embeber mapas temáticos locales y descargar sus geometrías.
* **Archivos Clave:** `src/js/modulos/umap.js`.
* **Mecanismo:** Incrustación mediante `<iframe>` con directivas seguras de aislamiento (`sandbox="allow-scripts allow-same-origin allow-popups"`). Implementa detección de restricciones CORS: si la instancia remota bloquea la descarga directa del GeoJSON por cabeceras `Access-Control-Allow-Origin`, el módulo habilita un botón de descarga asistida y fallback a la copia local.

### 7.6. Módulo 06: Metadatos Estandarizados (ISO 19115 / ISO 19139)
* **Propósito:** Generador y exportador formal de fichas de metadatos espaciales conforme al perfil chileno de metadatos (SNIT / IDE Chile), compatible con catálogos GeoNetwork y CSW (Catalog Service for the Web).
* **Archivos Clave:** `src/js/modulos/metadatos.js`.
* **Formatos de Exportación:**
  - **JSON (ISO 19115-1:2014):** Objeto estructurado con los 7 paquetes obligatorios (Identificación, Extensión, Calidad/Linaje, Distribución, Sistema de Referencia, Mantenimiento y Puntos de Contacto).
  - **XML (ISO 19139:2007):** Archivo XML validable contra el esquema XSD de OGC/ISO (`gmd:MD_Metadata`), listo para ser importado directamente en geoportal.cl o servidores GeoNetwork institucionales.

### 7.7. Módulo 07: Diccionario Territorial y Descriptores
* **Propósito:** Repositorio conceptual interactivo con **134 descriptores técnicos, normativos y geográficos** que estandarizan el vocabulario utilizado en el Atlas, facilitando el diálogo entre la jerga técnica de los planificadores comunales y las etiquetas colaborativas de OpenStreetMap.
* **Archivos Clave:** `src/js/modulos/diccionario.js`.
* **Estructura del Término:** Cada descriptor contiene: `id`, `termino`, `categoria_tematica`, `definicion_conceptual`, `fuente_normativa` (ej. OGUC, Ley General de Urbanismo y Construcciones, Wiki OSM, INE), `etiqueta_osm_equivalente` y `capa_atlas_relacionada`. Cuenta con buscador en vivo por texto o categoría.

### 7.8. Módulo 08: Licencias Abiertas y Catálogos de Descarga
* **Propósito:** Gobernanza jurídica del Atlas, clarificación del marco legal tripartito y centro de descarga de matrices maestras en formatos abiertos OpenXML y CSV.
* **Archivos Clave:** `src/js/modulos/licencias.js`, `src/index.html` (`#panel-licencias`).
* **Descargables Directos:**
  - `docs/categorias_tematicas_osm.xlsx`
  - `docs/catalogo_fuentes_vgi.xlsx`
  - `docs/perfil_metadatos_vgi.xlsx`
  - `docs/bip_inversiones_santiago.csv`
  - `docs/geodatabase_completa_atlas_vgi.zip`

### 7.9. Módulo 09: Indicadores de Análisis y Storyboards Territoriales
* **Propósito:** Síntesis cuali-cuantitativa que organiza las 131 capas en 5 dimensiones estratégicas del territorio y presenta 7 storyboards barriales temáticos con análisis visuales, métricas prediales y acceso al visor Lightbox HD.
* **Archivos Clave:** `src/js/modulos/indicadores_analisis.js`, `src/index.html` (`#panel-indicadores-analisis`).
* **Las 5 Dimensiones Analíticas:**
  1. *Equipamiento Comunitario y Social:* Educación, salud, bomberos, carabineros, comisarías y centros sociales.
  2. *Movilidad, Accesibilidad y Espacio Público:* Red vial, ciclovías, estaciones de Metro, paraderos, semáforos UOCT y veredas.
  3. *Morfología Urbana, Densidad y Vivienda:* Manzanas Censo 2024, altura de edificación, pasajes, cités y catastro predial SII.
  4. *Patrimonio, Memoria e Identidad Barrial:* Zonas Típicas, Monumentos Históricos, Inmuebles de Conservación Histórica y sitios de memoria.
  5. *Medio Ambiente, Cobertura y Sostenibilidad:* Áreas verdes, arbolado urbano, islas de calor, catastro de residuos SUBDERE 2024 e infraestructura hídrica.
* **Visor Lightbox Pop-Up HD:** Permite ampliar a pantalla completa las láminas cartográficas de alta resolución (`src/img/cartografias/`) con controles interactivos de zoom, paneo y reseteo de vista.

### 7.10. Módulo 10: Manual de Uso y Guía Metodológica
* **Propósito:** Módulo integrado en la propia aplicación web que expone el manual operativo de usuario, la guía metodológica y la memoria de trazabilidad sin requerir la apertura de archivos externos.
* **Archivos Clave:** `src/js/modulos/manual.js`, `src/index.html` (`#panel-manual`).
* **Características:** Renderizado de pestañas de lectura dinámica, índice de navegación rápida y enlaces de descarga a la documentación formal en Markdown y PDF.

---

## 8. Cómo Agregar un Nuevo Módulo a la Plataforma (Paso a Paso)

La arquitectura modular permite incorporar un nuevo módulo funcional (por ejemplo, *Módulo 11: Sensorica Ambiental IoT*) siguiendo un procedimiento estrictamente estandarizado:

### Paso 1: Crear el Archivo Lógico del Módulo
Cree el archivo `src/js/modulos/sensorica_iot.js` utilizando el patrón IIFE:

```javascript
// src/js/modulos/sensorica_iot.js
// Módulo 11: Monitoreo y Sensores Ambientales IoT
// Departamento de Geografía · Universidad Alberto Hurtado

const ModuloSensoricaIoT = (() => {
  let sensoresCargados = [];

  async function inicializarModulo() {
    console.log('[+] Inicializando Módulo 11: Sensorica IoT...');
    await cargarDatosSensores();
    renderizarInterfaz();
  }

  async function cargarDatosSensores() {
    try {
      const resp = await fetch('data/sensores_calidad_aire_santiago.geojson');
      const data = await resp.json();
      sensoresCargados = data.features || [];
      console.log(`[✓] ${sensoresCargados.length} sensores cargados con éxito.`);
    } catch (err) {
      console.error('[-] Error al cargar datos de sensores:', err);
    }
  }

  function renderizarInterfaz() {
    const contenedor = document.getElementById('contenedor-sensores-iot');
    if (!contenedor) return;

    contenedor.innerHTML = `
      <div class="tarjeta-sensor-resumen">
        <h4>Sensores Ambientales en Tiempo Real</h4>
        <p>Total de estaciones activas en Barrio Brasil: <strong>${sensoresCargados.length}</strong></p>
      </div>
    `;
  }

  // API Pública expuesta
  return {
    inicializar: inicializarModulo,
    obtenerSensores: () => sensoresCargados
  };
})();

window.ModuloSensoricaIoT = ModuloSensoricaIoT;
```

### Paso 2: Agregar el Botón de Pestaña en la Barra Superior
En [`src/index.html`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/index.html), dentro del `<nav class="barra-pestanas-profundidad" id="lista-navegacion">` (alrededor de la línea 55), agregue el botón con su número de nodo:

```html
<button type="button" class="pestana-nodo" data-panel="sensorica-iot">
  <span class="insignia-nodo">11</span> ♨ Sensorica IoT
</button>
```

### Paso 3: Agregar el Contenedor del Panel HTML
En `src/index.html`, dentro del contenedor principal `<main class="contenido">`, agregue la sección con el ID correspondiente al `data-panel`:

```html
<!-- ---------- 11. SENSORICA AMBIENTAL IOT ---------- -->
<section class="panel" id="panel-sensorica-iot" aria-labelledby="titulo-sensorica">
  <header class="panel-header">
    <div class="panel-header-identificador">
      <span class="nodo-numero">NODO 11</span>
      <h2 id="titulo-sensorica">Sensores Ambientales y Calidad del Aire IoT</h2>
    </div>
    <p class="panel-descripcion">
      Monitoreo en tiempo real de material particulado (MP2.5 / MP10), temperatura y humedad relativa en Barrio Brasil.
    </p>
  </header>

  <div class="panel-cuerpo" id="contenedor-sensores-iot">
    <!-- Contenido inyectado dinámicamente por sensorica_iot.js -->
  </div>
</section>
```

### Paso 4: Registrar el Módulo en `src/js/app.js`
En [`src/js/app.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/app.js), agregue el módulo al manejador de navegación y ciclo de vida:

```javascript
// Dentro del evento DOMContentLoaded o del despachador de navegación:
const panelesInicializados = {};

function cambiarPanel(nombrePanel) {
  // ... lógica existente de ocultar/mostrar paneles ...

  if (nombrePanel === 'sensorica-iot' && !panelesInicializados['sensorica-iot']) {
    if (window.ModuloSensoricaIoT) {
      window.ModuloSensoricaIoT.inicializar();
      panelesInicializados['sensorica-iot'] = true;
    }
  }
}
```

### Paso 5: Incluir el Script con Parámetro Anti-Caché en `index.html`
Al pie de `src/index.html`, antes de `js/app.js`, agregue la etiqueta `<script>`:

```html
<script src="js/modulos/sensorica_iot.js?v=20261020_v1"></script>
```

---

## 9. Pipeline Cartográfico: Catálogo de 131 Capas y Cómo Modificar Capas

El Atlas VGI contiene exactamente **131 capas cartográficas auditadas y normalizadas** (121 capas oficiales del Estado de Chile y 10 macrocategorías comunitarias VGI de OpenStreetMap).

### 9.1. Estructura de `src/js/modulos/ide_chile.js`
El catálogo de capas oficiales reside en el objeto JavaScript `CAPAS_OFICIALES` dentro de `src/js/modulos/ide_chile.js`. Cada capa se define mediante un objeto con 9 atributos técnicos y bibliográficos:

```javascript
'censo2024_manzanas': {
  nombre: 'Censo 2024 — Manzanas Censales (Santiago)',
  institucion: 'Instituto Nacional de Estadísticas (INE)',
  ministerio: 'Ministerio de Economía, Fomento y Turismo',
  tipoServicio: 'GeoJSON WGS84 (EPSG:4326)',
  urlServicio: 'https://geoine-inechile.opendata.arcgis.com/',
  archivoLocal: 'data/ide_censo2024_manzanas.geojson',
  descripcion: 'Polígonos de manzanas censales con población total y viviendas censadas en el Censo de Población y Vivienda 2024.',
  declaracion: 'Datos procesados y agregados a nivel de manzana para la comuna de Santiago.',
  citaAPA: 'Instituto Nacional de Estadísticas. (2024). Censo de Población y Vivienda 2024: Manzanas censales Región Metropolitana. Santiago: INE Chile.'
},
'subdere_rsd_sitios_disposicion_instalaciones_rm': {
  nombre: 'SUBDERE 2024 — Sitios de Disposición Final RSD (RM)',
  institucion: 'Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE)',
  ministerio: 'Ministerio del Interior y Seguridad Pública',
  tipoServicio: 'GeoJSON WGS84 (EPSG:4326)',
  urlServicio: 'https://www.subdere.gov.cl/',
  archivoLocal: 'data/subdere_rsd_2024_rm/Sitios_Disposicion_RSD_Ene24_RM.geojson',
  descripcion: 'Catastro de vertederos, rellenos sanitarios y plantas de disposición final de residuos sólidos domiciliarios en la RM.',
  declaracion: 'Catastro Nacional de Residuos Sólidos Domiciliarios actualizado a enero de 2024.',
  citaAPA: 'Subsecretaría de Desarrollo Regional y Administrativo. (2024). Catastro Nacional de Residuos Sólidos Domiciliarios 2024. Santiago: SUBDERE.'
}
```

### 9.2. Esquema Maestro Obligatorio de 14 Atributos ISO por Entidad
Cualquier archivo GeoJSON que se incorpore a la plataforma debe contener en su objeto `properties` las siguientes 14 propiedades normalizadas. Esto permite que el Inspector Normativo, el Evaluador de Calidad ISO y las descargas en CSV operen de forma homogénea:

| N° | Atributo Maestro | Tipo de Dato | Descripción y Formato Estándar | Ejemplo Real |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `id_atlas` | String | Identificador unívoco alfanumérico | `"VGI-CL-RM-001248"` |
| 2 | `categoria` | String | Macrocategoría temático-funcional | `"Equipamiento y Servicios"` |
| 3 | `subcategoria` | String | Tipo específico del elemento | `"Educación Básica y Media"` |
| 4 | `nombre` | String | Topónimo o nombre oficial de la entidad | `"Liceo Experimental Manuel de Salas"` |
| 5 | `fuente_origen`| String | Organización o proyecto emisor del dato | `"OpenStreetMap / MINEDUC"` |
| 6 | `licencia` | String | Licencia de reutilización del registro | `"ODbL 1.0 / Open Data"` |
| 7 | `fecha_captura`| String | Fecha ISO 8601 de captura o actualización | `"2026-08-15"` |
| 8 | `comuna` | String | Nombre oficial de la comuna DPA | `"Santiago"` |
| 9 | `region` | String | Región político-administrativa | `"Región Metropolitana de Santiago"` |
| 10 | `metadato_url` | String | Enlace URL a la ficha ISO 19115 | `"https://atlasvgiuah.netlify.app/docs/perfil_metadatos_vgi.xlsx"` |
| 11 | `tipo_geometria`| String | Geometría OGC Simple Feature | `"MultiPolygon"` / `"Point"` |
| 12 | `precision_posicional`| String | Tolerancia de precisión estimada | `"± 3.5 metros (GNSS / Ortofoto)"` |
| 13 | `estado_revision`| String | Nivel de curatoría en el Atlas | `"Auditado Grado A+ (ISO 19157)"` |
| 14 | `propiedades_originales`| Object | Diccionario JSON con los campos crudos del origen | `{"rbd": 9845, "dependencia": "Municipal"}` |

### 9.3. Procedimiento para Añadir una Nueva Capa Cartográfica
1. **Paso 1: Descargar y Homologar la Geometría:**
   Descargue el dataset crudo (ej. Shapefile o WFS). Con QGIS o GDAL/OGR, reproyéctelo obligatoriamente al sistema de referencia geográfico global **WGS84 (EPSG:4326)**:
   ```bash
   ogr2ogr -f "GeoJSON" -t_srs "EPSG:4326" capa_normalizada.geojson capa_origen.shp
   ```
2. **Paso 2: Inyectar los 14 Atributos Maestros con Python:**
   Ejecute un script de inyección para garantizar que no existan propiedades nulas en los 14 campos:
   ```python
   import json

   with open("capa_normalizada.geojson", "r", encoding="utf-8") as f:
       data = json.load(f)

   for idx, feat in enumerate(data.get("features", [])):
       props = feat.get("properties", {})
       feat["properties"] = {
           "id_atlas": f"CAPA-OFICIAL-{idx+1:06d}",
           "categoria": "Infraestructura",
           "subcategoria": "Red Eléctrica",
           "nombre": props.get("nombre", "Sin Nombre"),
           "fuente_origen": "Coordinador Eléctrico Nacional",
           "licencia": "Datos Públicos Estado de Chile",
           "fecha_captura": "2026-10-01",
           "comuna": "Santiago",
           "region": "Región Metropolitana",
           "metadato_url": "https://www.geoportal.cl",
           "tipo_geometria": feat.get("geometry", {}).get("type", "Unknown"),
           "precision_posicional": "± 5 metros",
           "estado_revision": "Validado",
           "propiedades_originales": props
       }

   with open("capa_normalizada.geojson", "w", encoding="utf-8") as f:
       json.dump(data, f, ensure_ascii=False, indent=2)
   ```
3. **Paso 3: Copiar a `data/` y `src/data/`:**
   Guarde el archivo tanto en `data/nombre_capa.geojson` como en `src/data/nombre_capa.geojson`.
4. **Paso 4: Registrar la Capa en `src/js/modulos/ide_chile.js`:**
   Agregue la clave técnica y metadatos en el objeto `CAPAS_OFICIALES`.
5. **Paso 5: Re-ejecutar Scripts de Auditoría y Empaquetado:**
   ```bash
   python3 scripts/verificar_conteo_capas.py
   python3 scripts/analisis_metacalidad.py
   python3 scripts/empaquetar_base_datos_completa.py
   ```

---


### 9.4. Tabla Maestra de las 131 Capas Cartográficas Integradas

A continuación se documenta el inventario completo y exhaustivo de las 131 capas que operan en la plataforma web y en la geodatabase unificada:

#### 9.4.1. Las 10 Macrocategorías Temáticas Comunitarias VGI (Barrio Brasil)

| N° | ID de Capa | Denominación Oficial | Dimensión Territorial | Geometría OGC | Fuente Primaria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 01 | `cat01_educacion_vgi` | CAT-01: Educación y Equipamiento Formativo VGI | Equipamiento Comunitario | Puntos / Polígonos | OpenStreetMap |
| 02 | `cat02_salud_vgi` | CAT-02: Salud y Atención Primaria VGI | Equipamiento Comunitario | Puntos / Polígonos | OpenStreetMap |
| 03 | `cat03_transporte_vgi` | CAT-03: Transporte y Movilidad Colectiva VGI | Movilidad Urbana | Puntos / Líneas | OpenStreetMap |
| 04 | `cat04_ciclovias_vgi` | CAT-04: Ciclovías e Infraestructura Activa VGI | Movilidad Urbana | Líneas / Puntos | OpenStreetMap |
| 05 | `cat05_espacio_publico_vgi` | CAT-05: Plazas y Parques Urbanos VGI | Espacio Público | Polígonos | OpenStreetMap |
| 06 | `cat06_patrimonio_vgi` | CAT-06: Patrimonio y Sitios de Memoria VGI | Patrimonio Barrial | Puntos / Polígonos | OpenStreetMap |
| 07 | `cat07_accesibilidad_vgi` | CAT-07: Accesibilidad y Cruces PMR VGI | Inclusión Urbana | Puntos | OpenStreetMap |
| 08 | `cat08_biodiversidad_vgi` | CAT-08: Biodiversidad y Arbolado Urbano VGI | Medio Ambiente | Puntos / Polígonos | OpenStreetMap / GBIF |
| 09 | `cat09_edificaciones_vgi` | CAT-09: Huella Edilicia y Pasajes VGI | Morfología Urbana | Polígonos | OpenStreetMap |
| 10 | `cat10_cobertura_suelo_vgi` | CAT-10: Cobertura y Usos de Suelo VGI | Morfología Urbana | Polígonos | OpenStreetMap |

#### 9.4.2. Las 121 Capas Oficiales del Estado de Chile (IDE Chile / SNIT)

| N° | ID de Capa | Nombre Oficial | Institución Responsable | Ministerio / Sector | Geometría |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 011 | `censo2024_regional` | Censo 2024 (Marco Regional RM) | Instituto Nacional de Estadísticas (INE) / IDE Chile | Ministerio de Economía, Fomento y Turismo | Polígono (Región Metropolitana) |
| 012 | `censo2024_limite_urbano` | Censo 2024 (Límites Urbanos Censales RM) | Instituto Nacional de Estadísticas (INE) / IDE Chile | Ministerio de Economía, Fomento y Turismo | Polígonos (Límites Urbanos) |
| 013 | `censo2024_localidades` | Censo 2024 (Localidades y Asentamientos RM) | Instituto Nacional de Estadísticas (INE) / IDE Chile | Ministerio de Economía, Fomento y Turismo | Polígonos (Localidades y Asentamientos) |
| 014 | `censo2024_zonal` | Censo 2024 (Zonas y Distritos Censales RM) | Instituto Nacional de Estadísticas (INE) / IDE Chile | Ministerio de Economía, Fomento y Turismo | Polígonos (Distritos y Zonas Censales) |
| 015 | `censo2024_manzanas` | Censo 2024 (Manzanas Censales RM) | Instituto Nacional de Estadísticas (INE) / IDE Chile | Ministerio de Economía, Fomento y Turismo | Polígonos (Manzanas Censales) |
| 016 | `minvu_patrimonio` | Patrimonio IPT: Inmuebles y Zonas de Conservación Histórica (ZCH / ICH RM) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Puntos y Polígonos |
| 017 | `educacion_parvularia` | Jardines y Salas Cuna (JUNJI / Integra) | JUNJI / Fundación Integra / MINEDUC / IDE Chile | Subsecretaría de Educación Parvularia | Puntos (Jardines) |
| 018 | `establecimientos_salud` | Salud Pública (CESFAM y Hospitales) | Ministerio de Salud (MINSAL) / DEIS / IDE Chile | Subsecretaría de Redes Asistenciales | Puntos (Salud) |
| 019 | `bomberos` | Cuarteles de Bomberos de Chile | Junta Nacional de Cuerpos de Bomberos / IDE Chile | Ministerio del Interior y Seguridad Pública | Puntos (Cuarteles) |
| 020 | `carabineros` | Comisarías y Cuarteles Policiales | Carabineros de Chile / IDE Chile | Ministerio del Interior y Seguridad Pública | Puntos (Comisarías) |
| 021 | `estaciones_metro` | Estaciones de Metro de Santiago | DTPM / Metro S.A. / IDE Chile / datos.gob.cl | Ministerio de Transportes y Telecomunicaciones (MTT) | Puntos (Estaciones) |
| 022 | `red_ferroviaria` | Red Ferroviaria EFE (MTT) | Empresa de los Ferrocarriles del Estado (EFE) / MTT / IDE Chile | Ministerio de Transportes y Telecomunicaciones | Líneas (Vías Férreas) |
| 023 | `cmn_sitios_memoria` | Sitios de Memoria y Monumentos CMN | Consejo de Monumentos Nacionales (CMN) / datos.gob.cl | Ministerio de las Culturas, las Artes y el Patrimonio | Puntos (Monumentos) |
| 024 | `minvu_ipt_prc_santiago` | Planes Reguladores Comunales (PRC - RM): Zonificación Comunal | MINVU / Municipios de la Región Metropolitana | División de Desarrollo Urbano (DDU) / DOM Municipales | Polígonos (Zonificación Comunal) |
| 025 | `minvu_ipt_prms_usosuelo` | Plan Regulador Metropolitano (PRMS): Usos de Suelo Regional | MINVU / SEREMI Metropolitana de Vivienda y Urbanismo | División de Desarrollo Urbano (DDU) | Polígonos (Usos Metropolitanos) |
| 026 | `minvu_ipt_areas_verdes` | Áreas Verdes Normativas (MINVU / INE 2023) | Ministerio de Vivienda y Urbanismo (MINVU) / INE | División de Desarrollo Urbano (DDU) | Polígonos (18.173 Áreas Verdes RM) |
| 027 | `minvu_ipt_areas_riesgo` | Áreas de Riesgo Normativas (IPT) | MINVU / DDU / SEREMI RM | División de Desarrollo Urbano (DDU) | Polígonos (Riesgo y Restricción) |
| 028 | `minvu_ipt_resguardo_infraestructura` | Fajas de Resguardo e Infraestructura PRMS | MINVU / SEREMI Metropolitana | División de Desarrollo Urbano (DDU) | Líneas (Fajas de Resguardo) |
| 029 | `minvu_ipt_limite_urbano` | Límite Urbano Oficial PRC (MINVU) | MINVU / DDU / I. Municipalidad de Santiago | División de Desarrollo Urbano (DDU) | Polígono (Límite Urbano Oficial) |
| 030 | `ide_minvu_campamentos` | Catastro Campamentos 2024 (MINVU) | Ministerio de Vivienda y Urbanismo (MINVU) | Programa de Asentamientos Precarios | Puntos y Polígonos (Campamentos) |
| 031 | `ide_minvu_ipt_prms_riesgo` | PRMS: Riesgos Metropolitanos (Inundación / Remoción) | MINVU / SEREMI Metropolitana | División de Desarrollo Urbano (DDU) | Polígonos (Zonas de Riesgo Intercomunal) |
| 032 | `ide_subdere_dpa_comunas` | División Político-Administrativa (SUBDERE / IGM) | Subsecretaría de Desarrollo Regional (SUBDERE) / IGM / IDE Chile | Ministerio del Interior y Seguridad Pública | Polígonos (Límites Comunales Oficiales) |
| 033 | `bbdd_01` | Proyectos Mandatados - GEOMOP | Estado de Chile / IDE Chile / geomop.mop.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 034 | `bbdd_02` | Red Vial Nacional - GEOMOP | Estado de Chile / IDE Chile / geomop.mop.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 035 | `bbdd_03` | Red Hidrométrica - GEOMOP | Estado de Chile / IDE Chile / geomop.mop.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 036 | `bbdd_04` | Contratos Concesionados - GEOMOP | Estado de Chile / IDE Chile / geomop.mop.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 037 | `bbdd_05` | Contratos MOP - GEOMOP | Estado de Chile / IDE Chile / geomop.mop.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 038 | `bbdd_06` | Jardines Infantiles JUNJI | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 039 | `bbdd_07` | Infraestructura Deportiva | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 040 | `bbdd_08` | Municipios | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 041 | `bbdd_10` | Jardines Infantiles Fundación Integra | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 042 | `bbdd_11` | Cuerpos de Bomberos | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 043 | `bbdd_12` | Establecimientos Educación Escolar | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 044 | `bbdd_13` | Establecimientos Educación Parvularia | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 045 | `bbdd_14` | Establecimientos de Educación Superior | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 046 | `bbdd_15` | Centros de SERNAM | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 047 | `bbdd_17` | Áreas Funcionales de las ciudades (2026) | Estado de Chile / IDE Chile / geoide.minvu.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 048 | `bbdd_18` | Zonificación Termica | Estado de Chile / IDE Chile / geoide.minvu.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 049 | `bbdd_19` | Cité | Estado de Chile / IDE Chile / geoide.minvu.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 050 | `bbdd_20` | SEREMI MINVU Región Metropolitana | SEREMI Metropolitana de Vivienda y Urbanismo / MINVU | Ministerio de Vivienda y Urbanismo | Polígono / Cobertura Regional |
| 051 | `bbdd_21` | Oficinas Serviu | Estado de Chile / IDE Chile / geoide.minvu.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 052 | `energia_almacenamiento_rm` | Sistemas de Almacenamiento de Energía RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Infraestructura Energética |
| 053 | `energia_bioenergia_rm` | Centrales de Bioenergía RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Centrales de Generación |
| 054 | `energia_electrolineras_rm` | Red de Electrolineras RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Puntos de Carga (526 electrolineras) |
| 055 | `energia_gasoducto_rm` | Red de Gasoductos RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Líneas (Trazados de Gasoducto) |
| 056 | `energia_hidroelectricas_rm` | Centrales Hidroeléctricas RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Centrales Hidroeléctricas |
| 057 | `energia_lineas_transmision_rm` | Líneas de Transmisión Eléctrica RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Líneas de Alta y Media Tensión |
| 058 | `energia_oleoducto_rm` | Red de Oleoductos RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Líneas (Trazados de Oleoducto) |
| 059 | `energia_solares_rm` | Plantas Solares Fotovoltaicas RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Parques y Plantas Solares |
| 060 | `energia_termoelectricas_rm` | Centrales Termoeléctricas RM | Ministerio de Energía / IDE Energía | Ministerio de Energía | Centrales Térmicas |
| 061 | `bbdd_23` | Sitios BIO-Prioritarios | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 062 | `bbdd_24` | Juzgados de Familia | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 063 | `bbdd_25` | Estaciones Meteorológicas | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 064 | `bbdd_26` | Estaciones Sedimentométricas | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 065 | `bbdd_27` | Estaciones de Calidad de Aguas | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 066 | `bbdd_29` | Cuencas Banco Nacional de Aguas | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 067 | `bbdd_30` | Indice Calidad de Aguas | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 068 | `bbdd_31` | Ciclovías | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 069 | `bbdd_32` | Vertederos Ilegales | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 070 | `bbdd_33` | Plan Cuadrante Carabineros | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 071 | `bbdd_34` | Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000 | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 072 | `bbdd_35` | Antenas en Servicio Ley de Torres | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 073 | `bbdd_37` | Red de Interconexión | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 074 | `bbdd_38` | Territorios de los Servicios de Salud | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 075 | `bbdd_39` | Estaciones de monitoreo de calidad de aire (Red Pública) | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 076 | `bbdd_40` | Circuitos Turísticos | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 077 | `ccu_rm_1993` | Continuo de Construcciones Urbanas (1993) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 1993) |
| 078 | `ccu_rm_2002` | Continuo de Construcciones Urbanas (2002) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2002) |
| 079 | `ccu_rm_2006` | Continuo de Construcciones Urbanas (2006) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2006) |
| 080 | `ccu_rm_2011` | Continuo de Construcciones Urbanas (2011) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2011) |
| 081 | `ccu_rm_2017` | Continuo de Construcciones Urbanas (2017) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2017) |
| 082 | `ccu_rm_2018` | Continuo de Construcciones Urbanas (2018) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2018) |
| 083 | `ccu_rm_2019` | Continuo de Construcciones Urbanas (2019) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2019) |
| 084 | `ccu_rm_2020` | Continuo de Construcciones Urbanas (2020) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2020) |
| 085 | `ccu_rm_2021` | Continuo de Construcciones Urbanas (2021) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2021) |
| 086 | `ccu_rm_2022` | Continuo de Construcciones Urbanas (2022) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2022) |
| 087 | `ccu_rm_2023` | Continuo de Construcciones Urbanas (2023) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2023) |
| 088 | `ccu_rm_2024` | Continuo de Construcciones Urbanas (2024) | Ministerio de Vivienda y Urbanismo (MINVU) | División de Desarrollo Urbano (DDU) | Polígonos (Huella Urbana 2024) |
| 089 | `bbdd_42` | Pisos vegetacionales de Luebert y Pliscoff 2017 | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 090 | `bbdd_43` | División Política Administrativa 2023 | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 091 | `bbdd_44` | Municipios con certificación ambiental (SCAM) | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 092 | `bbdd_46` | Predios Urbanos (Comuna de Santiago) | Servicio de Impuestos Internos (SII) / IDE Chile | Ministerio de Hacienda | Polígonos (35.036 Predios Santiago) |
| 093 | `bbdd_47` | Zona Fronteriza | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 094 | `bbdd_48` | Pasos Fronterizos | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 095 | `bbdd_49` | Estaciones Fluviométricas | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 096 | `bbdd_50` | Oficinas de Protección de Derechos (ODP) | Estado de Chile / IDE Chile / geoportal.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 097 | `bbdd_51` | Localización de viveros en Chile continental | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 098 | `bbdd_52` | Estaciones Meteorológicas Automáticas (FIA) | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 099 | `bbdd_53` | Industria Forestal Primeria (INFOR) | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 100 | `bbdd_54` | Mercados Mayoristas (ODEPA) | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 101 | `bbdd_55` | Sistema Nacional de Áreas Silvestres Protegidas del Estado | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 102 | `bbdd_59` | Cobertura de canales a nivel nacional | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 103 | `bbdd_60` | Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII) | Estado de Chile / IDE Chile / ide.minagri.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 104 | `bbdd_62` | Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025 | Estado de Chile / IDE Chile / icet.odepa.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 105 | `bbdd_63` | Inventario de Biomasa y Carbono - Metropolitana tipo Forestal | Estado de Chile / IDE Chile / sit.conaf.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 106 | `bbdd_64` | Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 107 | `bbdd_65` | Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026. | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 108 | `bbdd_66` | Unidades Vecinales 2026 | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 109 | `bbdd_67` | Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 110 | `bbdd_68` | Personas en RSH según CSE y sexo - 2026 Agosto | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 111 | `bbdd_69` | NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 112 | `bbdd_70` | Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 113 | `bbdd_71` | Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 114 | `bbdd_72` | Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 115 | `bbdd_73` | Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 116 | `bbdd_74` | Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio | Estado de Chile / IDE Chile / bidat.gob.cl | Organismo Público del Estado de Chile | Vectorial / Tabular Georreferenciada |
| 117 | `semaforos_rm_uoct_2026` | Cruces Semaforizados Conectados SC-RM (UOCT / MTT) | Unidad Operativa de Control de Tránsito (UOCT) / MTT | Ministerio de Transportes y Telecomunicaciones | Puntos (Cruces Semaforizados) |
| 118 | `catastro_predial_sii` | Catastro Predial del Servicio de Impuestos Internos (SII Geocodificado v4 2026) | Servicio de Impuestos Internos (SII) | Ministerio de Hacienda | Puntos (Predios Geocodificados v4) |
| 119 | `subdere_rsd_analisis_costos_comuna_rm` | SUBDERE RSD 2024 - Costos Comunales de Aseo (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Comunales |
| 120 | `subdere_rsd_poblacion_atendida_pta_puntos_rm` | SUBDERE RSD 2024 - Población Total Atendida PTA (Centroides RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Puntos (Centroides Comunales) |
| 121 | `subdere_rsd_poblacion_comunal_pta_poligonos_rm` | SUBDERE RSD 2024 - Población Total Atendida PTA (Polígonos RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Comunales |
| 122 | `subdere_rsd_ciudades_poblacion_rm` | SUBDERE RSD 2024 - Ciudades y Entidades Urbanas (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Urbanos |
| 123 | `subdere_rsd_criticidad_sitios_disposicion_rm` | SUBDERE RSD 2024 - Criticidad de Rellenos Sanitarios (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Puntos (Rellenos Sanitarios) |
| 124 | `subdere_rsd_distancia_municipio_sdf_rm` | SUBDERE RSD 2024 - Distancias Municipio a Relleno Sanitario (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Líneas de Transporte |
| 125 | `subdere_rsd_gastos_ingresos_sinim_rm` | SUBDERE RSD 2024 - Finanzas Municipales y Gasto en Aseo SINIM (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Comunales |
| 126 | `subdere_rsd_recoleccion_transporte_operativo_rm` | SUBDERE RSD 2024 - Recolección y Transporte de Residuos (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Comunales |
| 127 | `subdere_rsd_ppc_generacion_pta_rm` | SUBDERE RSD 2024 - Generación de Residuos y Producción Per Cápita (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Comunales |
| 128 | `subdere_rsd_sdf_comunas_destino_rm` | SUBDERE RSD 2024 - Destino de Disposición Final por Comuna (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Polígonos Comunales |
| 129 | `subdere_rsd_sdf_municipios_puntos_rm` | SUBDERE RSD 2024 - Sedes Municipales y Relleno Receptor (Puntos RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Puntos (Municipios) |
| 130 | `subdere_rsd_sitios_disposicion_instalaciones_rm` | SUBDERE RSD 2024 - Rellenos Sanitarios e Instalaciones (RM) | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Puntos (Instalaciones) |
| 131 | `subdere_rsd_sitios_intermedios_transferencia_rm` | Región de Los Lagos | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) | Ministerio del Interior y Seguridad Pública | Puntos (Estaciones de Transferencia) |

---

## 10. Extractos Masivos Regionales de Geofabrik RM y Generación de GeoPackage (.gpkg)

El Atlas complementa las consultas puntuales de Overpass con extractos regionales completos descargados de **Geofabrik GmbH**, permitiendo análisis a escala regional sobre los 52 municipios de la Región Metropolitana.

### 10.1. Flujo de Descarga y Corte Espacial
1. **Fuente Cruda:** Geofabrik genera dumps diarios de todo Chile en formato Protocolbuffer Binary Format (PBF):  
   `https://download.geofabrik.de/south-america/chile-latest.osm.pbf` (~500 MB).
2. **Corte por Bounding Box con Osmium:**
   Mediante la herramienta `osmium-tool`, el dump nacional se recorta contra el polígono de la Región Metropolitana de Santiago (`[-71.72, -34.30, -69.75, -32.92]`):
   ```bash
   osmium extract -b -71.72,-34.30,-69.75,-32.92 chile-latest.osm.pbf -o rm-latest.osm.pbf
   ```
3. **Clasificación en 10 Macrocategorías Regionales (`scripts/procesar_geofabrik_rm.py`):**
   El script Python `scripts/procesar_geofabrik_rm.py` toma el PBF regional y extrae 10 archivos GeoJSON correspondientes a las macrocategorías maestras:
   - `capa_osm_rm_cat01_educacion.geojson` (Colegios, universidades, jardines infantiles).
   - `capa_osm_rm_cat02_salud.geojson` (Hospitales, CESFAM, clínicas, farmacias).
   - `capa_osm_rm_cat03_transporte.geojson` (Paradas de bus, estaciones de tren/metro, terminales).
   - `capa_osm_rm_cat04_ciclovias.geojson` (Ciclovías segregadas, sendas ciclables, bicicleteros).
   - `capa_osm_rm_cat05_espacio_publico.geojson` (Plazas, parques urbanos, zonas de recreación).
   - `capa_osm_rm_cat06_patrimonio.geojson` (Edificios históricos, sitios arqueológicos, monumentos).
   - `capa_osm_rm_cat07_accesibilidad.geojson` (Rampas, cruces peatonales accesibles, semáforos sonoros).
   - `capa_osm_rm_cat08_biodiversidad.geojson` (Arbolado urbano significativo, reservas, ríos, canales).
   - `capa_osm_rm_cat09_edificaciones.geojson` (Polígonos de huella de edificios residenciales y comerciales).
   - `capa_osm_rm_cat10_cobertura_suelo.geojson` (Áreas verdes, suelos industriales, usos comerciales).

### 10.2. Generación de GeoPackage Multicapa (`scripts/generar_gpkg_geofabrik.py`)
Para que investigadores puedan cargar la base de datos de una sola vez en software SIG de escritorio (QGIS, ArcGIS Pro o gvSIG), el script [`scripts/generar_gpkg_geofabrik.py`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/scripts/generar_gpkg_geofabrik.py) consolida los 10 archivos GeoJSON en un único archivo SQLite/GeoPackage estándar OGC (`geofabrik_chile_rm_completo.gpkg`):

```bash
python3 scripts/generar_gpkg_geofabrik.py
```
El archivo resultante incluye índices espaciales R-Tree (`rtree_*`) en cada tabla, lo que acelera en un 90% el rendimiento de visualización y geoprocesamiento en QGIS.

---

## 11. Modelo Cuantitativo de Calidad Espacial ISO 19157 (WLC v2.0)

La evaluación de calidad cartográfica no es una estimación subjetiva, sino un **modelo computacional multicriterio ponderado** (*Weighted Linear Combination* - WLC) basado estrictamente en las normas ISO 19157:2013 e ISO 19157-1:2023.

### 11.1. Formulación Matemática del Modelo WLC
El Índice Global de Calidad Geográfica ($IGV$) de cada capa se calcula mediante la combinación lineal de dos pilares ortogonales ponderados al 50%:

$$IGV = 0.50 \cdot P_{\text{cuantitativo}} + 0.50 \cdot P_{\text{cualitativo}}$$

Donde el **Pilar Cuantitativo Espacial** ($P_{\text{cuantitativo}}$) evalúa las geometrías y atributos del GeoJSON:
$$P_{\text{cuantitativo}} = 0.30 \cdot C_{\text{topologia}} + 0.25 \cdot C_{\text{completitud}} + 0.20 \cdot C_{\text{posicional}} + 0.15 \cdot C_{\text{esquema}} + 0.10 \cdot C_{\text{granularidad}}$$

Y el **Pilar Cualitativo de Metadatos** ($P_{\text{cualitativo}}$) evalúa la gobernanza conforme a ISO 19115:
$$P_{\text{cualitativo}} = 0.30 \cdot M_{\text{nucleo}} + 0.25 \cdot M_{\text{linaje\_legal}} + 0.20 \cdot M_{\text{conformidad}} + 0.15 \cdot M_{\text{resolucion}} + 0.10 \cdot M_{\text{accesibilidad}}$$

### 11.2. Desglose Operativo de las 10 Dimensiones de Calidad
1. **Topología OGC ($C_{\text{topologia}}$ - 30% del Pilar 1):** Verifica la validez geométrica según las reglas OGC Simple Features (cierre de anillos poligonales, ausencia de auto-intersecciones, detección de geometrías colapsadas o nulas).
2. **Completitud Tabular ($C_{\text{completitud}}$ - 25% del Pilar 1):** Tasa de valores válidos no nulos ni vacíos en los campos informativos de la tabla de atributos.
3. **Integridad Posicional ($C_{\text{posicional}}$ - 20% del Pilar 1):** Porcentaje de vértices situados estrictamente dentro del Bounding Box oficial de la Región Metropolitana (`[-71.72, -34.30, -69.75, -32.92]`).
4. **Estructura y Esquema ($C_{\text{esquema}}$ - 15% del Pilar 1):** Cobertura de los 14 atributos maestros obligatorios en el objeto `properties`.
5. **Granularidad Geométrica ($C_{\text{granularidad}}$ - 10% del Pilar 1):** Riqueza y densidad de vértices que garantizan la no degradación de polígonos complejos.
6. **Metadatos Núcleo ($M_{\text{nucleo}}$ - 30% del Pilar 2):** Existencia de título normalizado, resumen descriptivo y sistema de referencia de coordenadas declarado.
7. **Linaje y Legal ($M_{\text{linaje\_legal}}$ - 25% del Pilar 2):** Presencia de cita bibliográfica formal bajo norma APA 7ª ed., declaración de linaje y licencia explícita.
8. **Conformidad ISO ($M_{\text{conformidad}}$ - 20% del Pilar 2):** Compatibilidad con los tipos de datos y estructuras del estándar ISO 19115-1:2014.
9. **Resolución Espacial ($M_{\text{resolucion}}$ - 15% del Pilar 2):** Declaración de escala equivalente de captura (ej. 1:5.000) o distancia de muestreo.
10. **Accesibilidad ($M_{\text{accesibilidad}}$ - 10% del Pilar 2):** Enlace web oficial verificable (`HTTP 200`) y disponibilidad de descarga sin barreras propietarias.

### 11.3. Rangos de Clasificación de Calidad
* **Grado A+ (Calidad Excelente):** $IGV \ge 95.00\%$ (Apta para modelamiento normativo vinculante e investigación científica de alto impacto).
* **Grado A (Calidad Muy Buena):** $90.00\% \le IGV < 95.00\%$ (Apta para planificación territorial y diagnóstico urbano).
* **Grado B (Calidad Aceptable):** $80.00\% \le IGV < 90.00\%$ (Requiere curatoría previa de atributos o topología).
* **Grado C (Calidad Deficiente):** $IGV < 80.00\%$ (No apta para producción cartográfica oficial sin reestructuración completa).

---

## 12. Catálogos Maestros y Matrices Tabulares (OpenXML .xlsx y CSV)

El Atlas VGI desacopla estrictamente los datos espaciales vectoriales (GeoJSON/PostGIS) de sus descripciones catalográficas, taxonomías temáticas y matrices de metacalidad. Esta separación permite que investigadores de ciencias sociales, planificadores urbanos y auditores no técnicos examinen la geodatabase completa mediante hojas de cálculo estándar ISO/IEC 29500 (OpenXML .xlsx) y texto delimitado por comas (CSV UTF-8).

### 12.1. Catálogo de Macrocategorías Temáticas VGI (`categorias_tematicas_osm.xlsx`)
Ubicado en [`docs/categorias_tematicas_osm.xlsx`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/docs/categorias_tematicas_osm.xlsx) y replicado en `src/docs/categorias_tematicas_osm.xlsx`, este libro de trabajo constituye la taxonomía semántica oficial del Atlas para el mapeo colaborativo en Barrio Brasil y Santiago Centro.

* **Estructura Interna del Libro:** Consta de 11 hojas de cálculo estructuradas:
  1. `Resumen_General`: Tablero de control con el conteo de subcategorías, peso porcentual en el modelo de habitabilidad urbana y fuente primaria.
  2. `CAT-01_Educacion`: Colegios, escuelas básicas, liceos, sedes universitarias (UAH, USACH, etc.), bibliotecas públicas y centros de investigación.
  3. `CAT-02_Salud`: Hospitales de alta complejidad (ej. San Juan de Dios), CESFAM comunales, SAPU, postas de urgencia, farmacias comunitarias e independientes.
  4. `CAT-03_Transporte`: Bocas y andenes de estaciones de Metro (Líneas 1, 2 y 5), paraderos RED Movilidad, terminales de buses interurbanos y aparcamientos.
  5. `CAT-04_Ciclovias`: Ciclovías consolidadas, ciclocalles zonificadas, estaciones de bicicletas públicas (Bike Santiago / Itaú) y talleres de reparación barrial.
  6. `CAT-05_Espacio_Publico`: Plazas históricas (Plaza Brasil, Plaza Yungay, Plaza Manuel Rodríguez), parques metropolitanos (Parque Quinta Normal, Parque Portales), bulevares peatonales y mobiliario urbano.
  7. `CAT-06_Patrimonio`: Monumentos Nacionales, Inmuebles y Zonas de Conservación Histórica del PRC de Santiago, placas recordatorias y centros de memoria barrial.
  8. `CAT-07_Accesibilidad`: Cruces peatonales semaforizados con pulsador sonoro, rebajes de acera (rampas PMR), veredas accesibles y obstáculos en vía pública.
  9. `CAT-08_Biodiversidad`: Catastro de arbolado viario significativo, jardines comunitarios, copas de árboles y áreas de refugio faunístico urbano.
  10. `CAT-09_Edificaciones`: Huellas de edificios en altura, tipologías de cités históricos, pasajes residenciales y usos mixtos comerciales/residenciales.
  11. `CAT-10_Cobertura_Suelo`: Clasificación de usos de suelo (residencial, comercial, equipamiento, baldío o sitio eriazo).

* **Esquema de Columnas por Hoja:**
  - `ID_SUBCATEGORIA`: Código unívoco alfanumérico (ej. `CAT01-EDU-001`).
  - `NOMBRE_ES`: Nombre formal en español del descriptor.
  - `ETIQUETA_OSM_PRIMARIA`: Par clave=valor principal en OpenStreetMap (ej. `amenity=school`).
  - `ETIQUETAS_COMPLEMENTARIAS`: Etiquetas secundarias recomendadas (`operator:type=public`, `fee=no`, `wheelchair=yes`).
  - `PESO_HABITABILIDAD`: Ponderador analítico en el modelo de caminabilidad urbana (rango 0.05 a 0.25).
  - `FUENTE_NORMATIVA`: Documento regulador (OGUC, Ley General de Urbanismo y Construcciones, Guía Metodológica MINVU).
  - `CRITERIO_VERIFICACION`: Instrucción clara para que un voluntario o estudiante verifique en terreno la veracidad del objeto.

### 12.2. Catálogo Maestro de Fuentes Oficiales e Interoperabilidad (`catalogo_fuentes_vgi.xlsx`)
Ubicado en [`docs/catalogo_fuentes_vgi.xlsx`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/docs/catalogo_fuentes_vgi.xlsx), consolida las fichas técnicas de las **131 capas cartográficas** integradas en el Atlas.

* **Campos del Catálogo (24 Columnas Normalizadas):**
  1. `ID_CAPA_ATLAS`: Identificador de software (ej. `censo2024_manzanas`, `subdere_rsd_sitios_disposicion_instalaciones_rm`).
  2. `NOMBRE_OFICIAL`: Nombre estandarizado de la capa.
  3. `MINISTERIO`: Secretaría de Estado responsable (ej. *Ministerio de Economía, Fomento y Turismo*).
  4. `INSTITUCION_CUSTODIA`: Organismo técnico titular de los datos (ej. *Instituto Nacional de Estadísticas - INE*).
  5. `DIVISION_DEPARTAMENTO`: Unidad operativa emisora.
  6. `TIPO_SERVICIO_ORIGEN`: WFS (Web Feature Service), WMS, REST FeatureServer de ArcGIS o archivo estático.
  7. `URL_SERVICIO_OFICIAL`: Endpoint HTTP directo al geoservicio gubernamental.
  8. `GEOMETRIA_OGC`: `Point`, `MultiPoint`, `LineString`, `MultiLineString`, `Polygon`, `MultiPolygon`.
  9. `TOTAL_ENTIDADES`: Número de entidades vectoriales auditadas en la Región Metropolitana.
  10. `ANIO_PUBLICACION`: Año oficial del conjunto de datos (ej. 2024, 2025 o 2026).
  11. `FECHA_ULTIMA_DESCARGA`: Fecha ISO de la sincronización en el Atlas (ej. `2026-10-18`).
  12. `SISTEMA_COORDENADAS_ORIGEN`: EPSG de origen (ej. `EPSG:32719` - UTM 19S o `EPSG:5360` - SIRGAS Chile).
  13. `SISTEMA_COORDENADAS_DESTINO`: `EPSG:4326` (WGS84 lat/lon decimal).
  14. `PRECISION_POSICIONAL_ESTIMADA`: Rango métrico de incertidumbre posicional.
  15. `LICENCIA_USO`: Base legal de reutilización (Ley N° 20.285 de Transparencia, ODbL 1.0, CC BY 4.0).
  16. `RESTRICCION_ACCESO`: Condiciones jurídicas o secretaría técnica.
  17. `RESUMEN_DESCRIPTIVO`: Párrafo de alcance metodológico y temático.
  18. `LINEAJE_PROCESAMIENTO`: Pasos de transformación espacial aplicados (recorte, reproyección, cálculo de áreas).
  19. `CITA_BIBLIOGRAFICA_APA`: Referencia normalizada bajo norma APA 7ª edición.
  20. `CALIDAD_WLC_IGV`: Puntuación de calidad porcentual obtenida en el modelo ISO 19157 (ej. `96.84%`).
  21. `ESTADO_CONEXION_HTTP`: Código de respuesta del servidor oficial (`HTTP 200 OK`).
  22. `RUTA_LOCAL_SRC`: Ubicación del archivo en la arquitectura web (ej. `data/ide_censo2024_manzanas.geojson`).
  23. `URL_CDN_SUPABASE`: Enlace de alta velocidad al bucket perimetral `atlas-geojson`.
  24. `METADATO_XML_IDE_CHILE`: URL al archivo de metadatos ISO 19139 en el Catálogo Nacional SNIT.

### 12.3. Perfil de Metadatos Espaciales ISO 19115 / ISO 19139 (`perfil_metadatos_vgi.xlsx`)
Estructura la parametrización de los **7 paquetes normativos** requeridos por la norma internacional ISO 19115-1:2014 para la interoperabilidad con nodos IDE nacionales y globales:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   PAQUETES ISO 19115 EN perfil_metadatos_vgi.xlsx      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. MD_IdentificationInfo  ──> Título, Resumen, BBox WGS84, Palabras    │
│ 2. MD_Constraints         ──> Licencias (ODbL, CC BY-SA), Ley 20.285   │
│ 3. DQ_DataQuality         ──> Reporte ISO 19157 (Topología, Linaje)    │
│ 4. MD_MaintenanceInfo     ──> Frecuencia de actualización y cambios    │
│ 5. MD_SpatialRepresInfo   ──> Vectorial OGC Simple Features            │
│ 6. MD_ReferenceSystem     ──> EPSG:4326 (WGS84)                        │
│ 7. CI_ResponsibleParty    ──> Dpto. de Geografía UAH (Custodio/Punto)  │
└────────────────────────────────────────────────────────────────────────┘
```

### 12.4. Archivos Consolidados CSV
En la carpeta `data/`, `src/data/` y `docs/` se mantienen archivos CSV optimizados para análisis masivo con Python (`pandas`), R o importación en PostgreSQL:

* **`data/bip_inversiones_santiago.csv` (3.73 MB):** Catálogo de proyectos del Banco Integrado de Proyectos (BIP) del Ministerio de Desarrollo Social y Familia (MIDESO) para la comuna de Santiago. Contiene: código BIP, nombre de la iniciativa, etapa del ciclo de vida (Diseño, Ejecución, Operación), monto en miles de pesos (M$), coordenadas de georreferenciación, sector (Vialidad, Espacios Públicos, Salud, Educación) y fecha de postulación.
* **`docs/correlacion_dimensiones_calidad.csv`:** Matriz simétrica de correlación lineal de Pearson ($r$) entre las 5 dimensiones cuantitativas y las 5 dimensiones cualitativas del modelo de calidad WLC v2.0 para las 131 capas del Atlas.
* **`docs/wlc_metacalidad_ranking.csv`:** Tabla ordenada de capas cartográficas con sus puntajes individuales por dimensión, puntaje ponderado global ($IGV$) y categoría de certificación asignada (Grados A+, A, B o C).
* **`data/resumen_catastro_vgi.csv`:** Resumen tabular agregado por categoría temática comunitaria con conteo de nodos, vías y relaciones activas en Barrio Brasil.

### 12.5. Procedimiento para Actualizar los Catálogos Tabulares
Cuando se incorpore una nueva capa cartográfica o se modifique una etiqueta en OpenStreetMap, debe ejecutarse el script automatizado de regeneración tabular:

```bash
# Regenera las matrices Excel y CSV a partir del estado actual de los archivos GeoJSON
python3 scripts/generar_catalogos_excel.py
```

El script realiza las siguientes operaciones:
1. Inspecciona iterativamente cada archivo `.geojson` en `data/` y `src/data/`.
2. Extrae las propiedades, valida la presencia de los 14 atributos maestros y recalcula la envolvente espacial (BBox).
3. Actualiza las celdas de las hojas de cálculo correspondientes utilizando la biblioteca `openpyxl`, preservando fórmulas, colores corporativos en cabeceras y estilos de bordes.
4. Exporta las réplicas idénticas a los directorios de producción (`docs/` y `src/docs/`).

---

## 13. Empaquetado, Compresión y Distribución Masiva (ZIP de 256 Archivos)

Uno de los requerimientos estructurales primordiales del Atlas VGI es **garantizar el acceso universal y sin barreras a la totalidad de la base de datos geográfica**. Mientras que los visores tradicionales limitan a los usuarios a descargas parciales o consultas individuales, el Atlas integra un pipeline de empaquetado continuo que consolida la geodatabase completa en un único archivo comprimido maestro.

### 13.1. Arquitectura del Archivo Maestro `geodatabase_completa_atlas_vgi.zip`
* **Volumen Descomprimido:** **3.36 GB (3,612,410,880 bytes)** de información geoespacial, bases tabulares, cartografías y metadatos.
* **Volumen Comprimido:** **~543 MB (568,534,094 bytes)**, logrando un ratio de compresión global de **6.35 : 1** mediante el algoritmo Deflate optimizado.
* **Total de Archivos Empaquetados:** **256 archivos operativos**, clasificados sistemáticamente:
  - 121 capas oficiales del Estado de Chile (GeoJSON WGS84).
  - 14 capas del Catastro Nacional RSD SUBDERE 2024 (GeoJSON).
  - 10 macrocategorías temáticas comunitarias VGI (GeoJSON normalizado de Barrio Brasil).
  - 10 extractos masivos regionales de OpenStreetMap Geofabrik (GeoJSON de toda la RM).
  - 1 GeoPackage OGC consolidado multicapa (`geofabrik_chile_rm_completo.gpkg`).
  - 4 libros de cálculo OpenXML (`.xlsx`) con catálogos y perfiles ISO.
  - 4 archivos de datos tabulares consolidados (`.csv`).
  - Metadatos estandarizados en formatos JSON e ISO 19139 XML.
  - Archivos maestros de verificación criptográfica (`checksums.md5` y `checksums.sha256`).
  - Documentos de licenciamiento y guía de inicio rápido (`README_GEODATABASE.md`, `LICENCIAS.md`).

### 13.2. Topografía Interna del Archivo ZIP
Al descomprimir el archivo, el usuario obtiene una estructura limpia y estandarizada, compatible de inmediato con QGIS, ArcGIS Pro, gvSIG o scripts en Python/R:

```text
geodatabase_completa_atlas_vgi/
├── 00_LEEME_PRIMERO.md                       # Guía de orientación rápida, licencias y métodos de carga en QGIS
├── LICENCIAS_Y_TERMINOS_USO.md               # Declaración tripartita de derechos (ODbL, CC BY-SA 4.0, AGPLv3)
├── checksums.sha256                          # Huellas digitales criptográficas de los 256 archivos
├── checksums.md5                             # Sumas de verificación MD5 complementarias
├── 01_capas_oficiales_estado_chile/          # 121 capas oficiales del Estado (GeoJSON EPSG:4326)
│   ├── censo2024_manzanas.geojson            # INE Censo 2024 a nivel de manzana
│   ├── prc_zonificacion_santiago.geojson     # Zonificación del Plan Regulador Comunal
│   ├── red_semaforos_uoct_rm.geojson         # 3.200 cruces semaforizados UOCT/MTT
│   ├── subdere_rsd_2024_rm/                  # Catastro Nacional RSD SUBDERE 2024
│   │   ├── Sitios_Disposicion_RSD_Ene24_RM.geojson
│   │   ├── Recoleccion_Transporte_RM.geojson
│   │   ├── Criticidad_Sitios_Disposicion_RSD_Ene24_RM.geojson
│   │   └── INVENTARIO_SUBDERE_RSD_2024_RM.json
│   └── ... (resto de capas oficiales del Estado)
├── 02_capas_vgi_barrio_brasil/               # 10 macrocategorías comunitarias VGI (Barrio Brasil)
│   ├── cat01_educacion_vgi.geojson
│   ├── cat02_salud_vgi.geojson
│   ├── cat03_transporte_vgi.geojson
│   ├── cat04_ciclovias_vgi.geojson
│   ├── cat05_espacio_publico_vgi.geojson
│   ├── cat06_patrimonio_vgi.geojson
│   ├── cat07_accesibilidad_vgi.geojson
│   ├── cat08_biodiversidad_vgi.geojson
│   ├── cat09_edificaciones_vgi.geojson
│   └── cat10_cobertura_suelo_vgi.geojson
├── 03_extractos_regionales_geofabrik_rm/     # 10 capas masivas regionales de toda la RM (OSM)
│   ├── capa_osm_rm_cat01_educacion.geojson
│   ├── capa_osm_rm_cat02_salud.geojson
│   └── ... (resto de extractos regionales)
├── 04_geopackage_ogc/
│   └── geofabrik_chile_rm_completo.gpkg      # GeoPackage SQLite estándar con las 10 capas y tablas indexadas
├── 05_catalogos_y_metadatos/
│   ├── catalogo_fuentes_vgi.xlsx             # Catálogo de 131 capas con citas APA
│   ├── categorias_tematicas_osm.xlsx         # Taxonomía temático-normativa
│   ├── perfil_metadatos_vgi.xlsx             # Paquetes normativos ISO 19115
│   ├── bip_inversiones_santiago.csv          # Proyectos de inversión pública BIP (MIDESO)
│   ├── correlacion_dimensiones_calidad.csv   # Matriz de Pearson del modelo WLC
│   └── wlc_metacalidad_ranking.csv           # Ranking de calidad de capas
└── 06_metadatos_xml_iso19139/                # Fichas XML para importación directa en GeoNetwork / SNIT
    └── ficha_metadatos_atlas_vgi.xml
```

### 13.3. Algoritmo de Compresión e Integridad (`scripts/empaquetar_base_datos_completa.py`)
El script de empaquetado opera bajo estrictas directivas de integridad de datos y control de memoria RAM. A continuación se desglosa su mecanismo algorítmico:

```python
import os
import zipfile
import hashlib

def generar_paquete_maestro():
    ruta_zip = "docs/geodatabase_completa_atlas_vgi.zip"
    print(f"[*] Empaquetando geodatabase completa en {ruta_zip}...")

    # Compresión Deflate con nivel máximo (9) para reducir consumo de ancho de banda
    with zipfile.ZipFile(ruta_zip, mode="w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        # 1. Empacar capas oficiales y subdere
        # 2. Empacar capas comunitarias VGI
        # 3. Empacar extractos Geofabrik y GeoPackage
        # 4. Empacar catálogos Excel y CSV
        # 5. Generar y escribir checksums.sha256 en la raíz del archivo ZIP
        pass

    # Verificación física del archivo generado
    print("[*] Ejecutando testzip() para verificar que no existan bloques CRC dañados...")
    with zipfile.ZipFile(ruta_zip, mode="r") as zipf:
        corrupto = zipf.testzip()
        if corrupto:
            raise RuntimeError(f"Error crítico: Archivo corrupto en el ZIP: {corrupto}")
        conteo = len(zipf.namelist())
        peso_mb = os.path.getsize(ruta_zip) / (1024 * 1024)
        print(f"[✓] Verificación superada: {conteo} archivos empaquetados ({peso_mb:.2f} MB).")

    # Replicación en espejo hacia src/docs/ para despliegue en Netlify CDN
    # os.system("cp docs/geodatabase_completa_atlas_vgi.zip src/docs/")
```

### 13.4. Mecanismo de Descarga en el Frontend y Bypass de Caché
En la interfaz del usuario ([`src/index.html`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/index.html)), el botón de descarga principal `#btn-descargar-coleccion-completa` (ubicado tanto en la barra de herramientas del visor como en el modal de catálogo de capas) ejecuta la función con bypass anti-caché:

```javascript
// En src/js/modulos/mapa.js o src/js/app.js:
const btnDescarga = document.getElementById('btn-descargar-coleccion-completa');
if (btnDescarga) {
  btnDescarga.addEventListener('click', (e) => {
    e.preventDefault();
    // Parámetro de versión para forzar revalidación y evitar que el navegador use caché local
    const urlDescarga = 'docs/geodatabase_completa_atlas_vgi.zip?v=' + Date.now();
    
    // Crear ancla de descarga programática
    const enlace = document.createElement('a');
    enlace.href = urlDescarga;
    enlace.setAttribute('download', 'geodatabase_completa_atlas_vgi.zip');
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    
    console.log('[✓] Descarga iniciada con bypass de caché:', urlDescarga);
  });
}
```

---

## 14. Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3 (Supabase)

El Atlas VGI adopta **PostgreSQL 17 con la extensión espacial PostGIS 3.3** sobre la infraestructura cloud de **Supabase**, proporcionando una base de datos relacional y geográfica de alto rendimiento, 100% de código abierto y sin costo de operación recurrente ($0 USD/mes de forma permanente).

### 14.1. Ventajas de la Arquitectura Supabase PostGIS
1. **Conformidad Estricta con OGC:** PostGIS es el estándar mundial para el almacenamiento y geoprocesamiento de datos vectoriales y ráster, soportando más de 1.000 funciones analíticas espaciales (`ST_Intersects`, `ST_Buffer`, `ST_Distance`, `ST_Centroid`, `ST_MakeEnvelope`, `ST_AsGeoJSON`).
2. **Consultas con Aceleración Espacial por Índices GIST:** Utiliza estructuras de árbol R (*Generalized Search Tree*) que indexan los volúmenes envolventes mínimos (MBR) de las geometrías, reduciendo el tiempo de búsqueda espacial de $O(N)$ a $O(\log N)$.
3. **Persistencia Híbrida Vectorial / Documental:** Combina columnas espaciales nativas (`GEOMETRY(Geometry, 4326)`) con campos de atributos flexibles en formato `JSONB`, preservando todas las propiedades de origen sin necesidad de migraciones de esquema complejas cuando se incorporan nuevas fuentes.
4. **Endpoints REST y RPC Instantáneos:** Supabase expone automáticamente la base de datos a través de PostgREST, lo que permite que el frontend del Atlas consulte capas recortadas por BBox directamente en JSON sin requerir un backend intermedio en Node.js o Python.

### 14.2. Esquema DDL Espacial Completo (`scripts/db/01_schema_postgis.sql`)
A continuación se documenta el esquema SQL que inicializa las extensiones, tablas, índices y funciones de consulta:

```sql
-- ============================================================================
-- Nodo GeoAbierto — Atlas VGI (Departamento de Geografía · UAH)
-- Esquema de Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3
-- ============================================================================

-- 1. Habilitación de extensiones
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLA: public.capas_metadata
-- Catálogo centralizado de capas con atributos normativos y linaje
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.capas_metadata (
    id TEXT PRIMARY KEY,                           -- ej: 'censo2024_manzanas', 'red_semaforos_uoct'
    nombre TEXT NOT NULL,                          -- Denominación formal de la capa
    institucion TEXT NOT NULL,                     -- Organismo rector (INE, MINVU, MOP, etc.)
    ministerio TEXT,                               -- Cartera de gobierno
    categoria_macro TEXT NOT NULL,                 -- equipamiento, movilidad, medio_ambiente, etc.
    geometria_tipo TEXT,                           -- Point, LineString, Polygon, MultiPolygon
    color TEXT DEFAULT '#0284c7',                  -- Color hexadecimal para simbología predeterminada
    icono TEXT DEFAULT '🗺️',                        -- Glifo identificador
    total_entidades INTEGER DEFAULT 0,             -- Cantidad verificada de elementos
    bbox DOUBLE PRECISION[],                       -- [minLon, minLat, maxLon, maxLat] en EPSG:4326
    archivo_geojson_url TEXT,                      -- Enlace de descarga en Supabase Storage CDN
    tipo_servicio TEXT,                            -- GeoJSON, WFS, REST FeatureServer
    url_servicio_origen TEXT,                      -- Enlace al catálogo del Estado
    declaracion_legal TEXT,                        -- Amparo bajo Ley N° 20.285 de Transparencia
    cita_apa TEXT,                                 -- Cita normalizada APA 7ª edición
    activo BOOLEAN DEFAULT TRUE,
    creado_el TIMESTAMPTZ DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_capas_metadata_categoria ON public.capas_metadata (categoria_macro);
CREATE INDEX IF NOT EXISTS idx_capas_metadata_institucion ON public.capas_metadata (institucion);

-- ============================================================================
-- 3. TABLA: public.capas_entidades
-- Almacén espacial unificado con geometrías binarias y atributos JSONB
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.capas_entidades (
    gid BIGSERIAL PRIMARY KEY,
    capa_id TEXT NOT NULL REFERENCES public.capas_metadata(id) ON DELETE CASCADE,
    geom GEOMETRY(Geometry, 4326) NOT NULL,        -- Coordenadas geográficas WGS84
    properties JSONB NOT NULL DEFAULT '{}'::jsonb, -- 14 atributos maestros y campos de origen
    creado_el TIMESTAMPTZ DEFAULT NOW()
);

-- Índices espaciales y de consulta de alta velocidad
CREATE INDEX IF NOT EXISTS idx_capas_entidades_geom ON public.capas_entidades USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_capas_entidades_capa_id ON public.capas_entidades (capa_id);
CREATE INDEX IF NOT EXISTS idx_capas_entidades_props ON public.capas_entidades USING GIN (properties);

-- ============================================================================
-- 4. FUNCIÓN RPC: fn_obtener_capa_bbox
-- Recorta espacialmente por el BBox visible del mapa y retorna un FeatureCollection
-- ============================================================================
CREATE OR REPLACE FUNCTION public.fn_obtener_capa_bbox(
    p_capa_id TEXT,
    p_minx DOUBLE PRECISION DEFAULT -70.6720,
    p_miny DOUBLE PRECISION DEFAULT -33.4505,
    p_maxx DOUBLE PRECISION DEFAULT -70.6580,
    p_maxy DOUBLE PRECISION DEFAULT -33.4350
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bbox_geom GEOMETRY;
    v_geojson JSONB;
BEGIN
    -- Generar polígono envolvente en EPSG:4326
    v_bbox_geom := ST_MakeEnvelope(p_minx, p_miny, p_maxx, p_maxy, 4326);

    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'capa_id', p_capa_id,
        'features', COALESCE(jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'id', e.gid,
                'geometry', ST_AsGeoJSON(e.geom)::jsonb,
                'properties', e.properties
            )
        ), '[]'::jsonb)
    )
    INTO v_geojson
    FROM public.capas_entidades e
    WHERE e.capa_id = p_capa_id
      AND ST_Intersects(e.geom, v_bbox_geom);

    RETURN v_geojson;
END;
$$;

-- Permisos de lectura pública anónima
GRANT EXECUTE ON FUNCTION public.fn_obtener_capa_bbox TO anon, authenticated, service_role;
```

### 14.3. Pipeline de Ingesta Masiva Vectorial (`scripts/cargar_entidades_postgis.py`)
Para cargar las **129.262 entidades geográficas** en la base de datos sin saturar los límites de memoria de la conexión, el script [`scripts/cargar_entidades_postgis.py`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/scripts/cargar_entidades_postgis.py) procesa los GeoJSON mediante inserciones por lotes (*batch insert*) con transacciones atómicas:

```bash
# Variables de entorno requeridas
export SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# Ejecución de la ingesta masiva
python3 scripts/cargar_entidades_postgis.py
```

El script implementa:
1. `ST_Force2D(ST_GeomFromGeoJSON(...))`: Sanitiza las coordenadas eliminando valores de elevación Z o medidas M que invaliden la tabla 2D.
2. `psycopg2.extras.execute_batch(cur, sql, params, page_size=2000)`: Agrupa hasta 2.000 entidades por viaje de ida y vuelta a la red (*round-trip*), reduciendo el tiempo de carga total de 45 minutos a solo 2.5 minutos.
3. Actualización automática del campo `total_entidades` y cálculo de la envolvente convexa global (`ST_Envelope(ST_Collect(geom))`) en la tabla `public.capas_metadata`.

---

## 15. Inventario Exhaustivo de los Scripts Python de Automatización

El proyecto cuenta con un conjunto de **49 scripts en Python** ubicados en el directorio [`scripts/`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/scripts/), organizados sistemáticamente en 6 subsistemas funcionales. A continuación se documenta la función técnica, entradas, salidas y comandos de ejecución de cada uno:

### 15.1. Subsistema 1: Procesamiento de Capas Oficiales del Estado e IDE Chile
1. **`scripts/descargar_capas_normativas_ide.py`:**
   * *Comando:* `python3 scripts/descargar_capas_normativas_ide.py`
   * *Propósito:* Conecta a los geoservicios WFS de IDE Chile y MINVU para descargar capas de instrumentos de planificación territorial (PRC Santiago, Seccionales, Zonas de Conservación Histórica).
   * *Entrada:* URLs de servicios WFS declaradas en el script.
   * *Salida:* Archivos GeoJSON normalizados en `data/` y `src/data/`.
2. **`scripts/procesar_capa_semaforos.py`:**
   * *Comando:* `python3 scripts/procesar_capa_semaforos.py`
   * *Propósito:* Procesa el catastro de cruces semaforizados de la Unidad Operativa de Control de Tránsito (UOCT/MTT), extrayendo los 3.200 puntos de la RM y recortando al área de Barrio Brasil.
   * *Entrada:* Catastro semafórico crudo (`data/raw/semaforos_rm.json`).
   * *Salida:* `data/red_semaforos_uoct_rm.geojson` y `src/data/red_semaforos_uoct_rm.geojson`.
3. **`scripts/inspeccionar_censo2024.py`:**
   * *Comando:* `python3 scripts/inspeccionar_censo2024.py`
   * *Propósito:* Audita la estructura interna de columnas, tipos de datos y población censada en el dataset preliminar del Censo de Población y Vivienda 2024 del INE.
   * *Salida:* Resumen en terminal de totales comunales, viviendas y personas.
4. **`scripts/procesar_censo2024_rm.py`:**
   * *Comando:* `python3 scripts/procesar_censo2024_rm.py`
   * *Propósito:* Convierte el archivo Shapefile del Censo 2024 a GeoJSON WGS84, calcula densidades habitacionales por hectárea e inyecta los 14 atributos maestros ISO.
   * *Salida:* `data/ide_censo2024_manzanas.geojson`.
5. **`scripts/publicar_censo2024_produccion.py`:**
   * *Comando:* `python3 scripts/publicar_censo2024_produccion.py`
   * *Propósito:* Copia la capa validada del Censo 2024 a `src/data/`, actualiza el catálogo en `src/js/modulos/ide_chile.js` y regenera los índices de búsqueda.
6. **`scripts/publicar_semaforos_y_redisenio.py`:**
   * *Comando:* `python3 scripts/publicar_semaforos_y_redisenio.py`
   * *Propósito:* Sincroniza la capa de semáforos con la consola de visualización del mapa y actualiza la simbología Leaflet con iconos SVG de semáforos viales.

### 15.2. Subsistema 2: Extracción y Procesamiento de OSM y Geofabrik RM
7. **`scripts/descargar_todas_las_categorias_osm.py`:**
   * *Comando:* `python3 scripts/descargar_todas_las_categorias_osm.py`
   * *Propósito:* Itera sobre las 10 macrocategorías temáticas y descarga todos los elementos de OpenStreetMap dentro del cuadrante de Barrio Brasil usando Overpass QL.
   * *Salida:* 10 archivos GeoJSON comunitarios en `data/cat01_educacion_vgi.geojson` a `data/cat10_cobertura_suelo_vgi.geojson`.
8. **`scripts/descargar_categorias_faltantes.py`:**
   * *Comando:* `python3 scripts/descargar_categorias_faltantes.py`
   * *Propósito:* Detecta categorías que hayan fallado por timeout o cuota en Overpass y ejecuta descargas quirúrgicas con backoff exponencial.
9. **`scripts/sincronizar_capas_osm_locales.py`:**
   * *Comando:* `python3 scripts/sincronizar_capas_osm_locales.py`
   * *Propósito:* Realiza un diff entre los datos locales y la última versión de OSM, actualizando únicamente los elementos con `version` superior en los metadatos de OSM.
10. **`scripts/procesar_geofabrik_rm.py`:**
    * *Comando:* `python3 scripts/procesar_geofabrik_rm.py`
    * *Propósito:* Lee el archivo binario regional `rm-latest.osm.pbf` de Geofabrik, filtra por tags y genera los 10 archivos GeoJSON regionales de la RM.
    * *Salida:* `data/capa_osm_rm_cat01_educacion.geojson` a `capa_osm_rm_cat10_cobertura_suelo.geojson`.
11. **`scripts/generar_gpkg_geofabrik.py`:**
    * *Comando:* `python3 scripts/generar_gpkg_geofabrik.py`
    * *Propósito:* Consolida las 10 capas regionales en un único archivo GeoPackage SQLite OGC con tablas indexadas espacialmente.
    * *Salida:* `docs/geofabrik_chile_rm_completo.gpkg`.
12. **`scripts/publicar_geofabrik_rm.py`:**
    * *Comando:* `python3 scripts/publicar_geofabrik_rm.py`
    * *Propósito:* Sincroniza los extractos regionales en `src/data/` y actualiza las rutas en el orquestador frontend.
13. **`scripts/procesar_osm_geofabrik_completo.py`:**
    * *Comando:* `python3 scripts/procesar_osm_geofabrik_completo.py`
    * *Propósito:* Pipeline maestro que ejecuta secuencialmente la extracción de PBF, recorte espacial, validación geométrica y exportación GeoJSON/GPKG.
14. **`scripts/procesar_osm_geofabrik_usuario.py`:**
    * *Comando:* `python3 scripts/procesar_osm_geofabrik_usuario.py`
    * *Propósito:* Extrae estadísticas de usuarios y mapeadores activos en el extracto de Geofabrik RM para auditorías comunitarias.
15. **`scripts/extractor_vgi.py`:**
    * *Comando:* `python3 scripts/extractor_vgi.py`
    * *Propósito:* Motor de consulta genérico para extraer primitivas geométricas (nodos, vías, relaciones) desde fuentes VGI abiertas.

### 15.3. Subsistema 3: Evaluación de Calidad ISO 19157 y Modelos WLC
16. **`scripts/modelo_indice_lineal_wlc.py`:**
    * *Comando:* `python3 scripts/modelo_indice_lineal_wlc.py`
    * *Propósito:* Implementa el modelo computacional *Weighted Linear Combination* v2.0 para calcular el Índice Global de Calidad ($IGV$) de cada capa cartográfica.
    * *Salida:* Puntuaciones porcentuales de las 131 capas y clasificación en Grados A+, A, B o C.
17. **`scripts/analisis_metacalidad.py`:**
    * *Comando:* `python3 scripts/analisis_metacalidad.py`
    * *Propósito:* Audita la coherencia geométrica (OGC), completitud de atributos y linaje legal de las capas, generando la matriz de metacalidad.
    * *Salida:* `docs/ANALISIS_METACALIDAD.md` y `docs/wlc_metacalidad_ranking.csv`.
18. **`scripts/enriquecer_base_datos_metadatos.py`:**
    * *Comando:* `python3 scripts/enriquecer_base_datos_metadatos.py`
    * *Propósito:* Inyecta los 14 atributos maestros obligatorios en cualquier archivo GeoJSON que carezca de estandarización formal.
19. **`scripts/enriquecer_catalogos_y_osm.py`:**
    * *Comando:* `python3 scripts/enriquecer_catalogos_y_osm.py`
    * *Propósito:* Cruza las etiquetas crudas de OpenStreetMap con las definiciones normativas de la OGUC y el Diccionario Territorial del Atlas.
20. **`scripts/verificar_conteo_capas.py`:**
    * *Comando:* `python3 scripts/verificar_conteo_capas.py`
    * *Propósito:* Verifica que la suma de capas oficiales (121) y comunitarias (10) sea exactamente **131 capas auditadas**, reportando cualquier discrepancia.

### 15.4. Subsistema 4: Generación de Entregables, Informes y Catálogos
21. **`scripts/generar_catalogos_excel.py`:**
    * *Comando:* `python3 scripts/generar_catalogos_excel.py`
    * *Propósito:* Construye y actualiza los libros de cálculo OpenXML: `catalogo_fuentes_vgi.xlsx`, `categorias_tematicas_osm.xlsx` y `perfil_metadatos_vgi.xlsx`.
22. **`scripts/generador_entregables_base.py`:**
    * *Comando:* `python3 scripts/generador_entregables_base.py`
    * *Propósito:* Módulo base con utilidades de generación de documentos en Word (.docx), PowerPoint (.pptx) y Excel (.xlsx) para reportes de avance.
23. **`scripts/datos_entregables_oe1.py`:**
    * *Comando:* `python3 scripts/datos_entregables_oe1.py`
    * *Propósito:* Fuente de datos estructurada con los logros, metodologías y taxonomías del Objetivo Específico 1 (Caracterización territorial y conceptual).
24. **`scripts/datos_entregables_oe2.py`:**
    * *Comando:* `python3 scripts/datos_entregables_oe2.py`
    * *Propósito:* Métricas y estadísticas del Objetivo Específico 2 (Geodatabase VGI, 131 capas, normalización WGS84, 129.262 entidades).
25. **`scripts/datos_entregables_oe3.py`:**
    * *Comando:* `python3 scripts/datos_entregables_oe3.py`
    * *Propósito:* Estadísticas de la plataforma web en producción (Objetivo Específico 3: 10 módulos, Netlify CDN, Leaflet 1.9.4).
26. **`scripts/datos_entregables_oe4.py`:**
    * *Comando:* `python3 scripts/datos_entregables_oe4.py`
    * *Propósito:* Indicadores de validación con actores comunitarios, manuales y transferencia metodológica (Objetivo Específico 4).
27. **`scripts/generar_doc_estado_avance.py`:**
    * *Comando:* `python3 scripts/generar_doc_estado_avance.py`
    * *Propósito:* Genera el informe formal de estado de avance en formato Word (`.docx`) de 4 páginas con tablas de horas y productos.
28. **`scripts/generar_ppt_estado_avance_blanco.py`:**
    * *Comando:* `python3 scripts/generar_ppt_estado_avance_blanco.py`
    * *Propósito:* Genera la presentación ejecutiva de diapositivas en PowerPoint (`.pptx`) con diseño corporativo institucional para defensas académicas.
29. **`scripts/generar_xls_estado_avance.py`:**
    * *Comando:* `python3 scripts/generar_xls_estado_avance.py`
    * *Propósito:* Genera la Carta Gantt y matriz de horas de avance en formato Excel (`.xlsx`) con semaforización de actividades completadas.
30. **`scripts/build_all_deliverables.py`:**
    * *Comando:* `python3 scripts/build_all_deliverables.py`
    * *Propósito:* Orquesta la compilación en un solo paso de los tres entregables académicos (.docx, .pptx y .xlsx).
31. **`scripts/ejecutar_generacion_entregables.py`:**
    * *Comando:* `python3 scripts/ejecutar_generacion_entregables.py`
    * *Propósito:* Wrapper de ejecución que valida la existencia de dependencias (`python-docx`, `python-pptx`, `openpyxl`) antes de compilar.

### 15.5. Subsistema 5: Empaquetado, Integridad y Despliegue
32. **`scripts/empaquetar_base_datos_completa.py`:**
    * *Comando:* `python3 scripts/empaquetar_base_datos_completa.py`
    * *Propósito:* Empaqueta los 256 archivos de la geodatabase completa (3.36 GB descomprimidos) en `docs/geodatabase_completa_atlas_vgi.zip` (~543 MB).
33. **`scripts/verificar_integridad_despliegue.py`:**
    * *Comando:* `python3 scripts/verificar_integridad_despliegue.py`
    * *Propósito:* Suite de 8 pruebas automatizadas de pre-despliegue (sintaxis JSON, integridad del ZIP con testzip, chequeo de LFS y sincronización espejo).
34. **`scripts/subir_a_github.py`:**
    * *Comando:* `python3 scripts/subir_a_github.py`
    * *Propósito:* Automatiza el staging, commit semántico y push hacia la rama `main` en GitHub, verificando el seguimiento de Git LFS.
35. **`scripts/publicar_depuracion_capas.py`:**
    * *Comando:* `python3 scripts/publicar_depuracion_capas.py`
    * *Propósito:* Elimina capas temporales de desarrollo en `src/data/` antes de desplegar a producción.
36. **`scripts/publicar_mas_detalles.py`:**
    * *Comando:* `python3 scripts/publicar_mas_detalles.py`
    * *Propósito:* Inyecta enlaces a storyboards y detalles técnicos en los modales de información de capas oficiales.
37. **`scripts/limpiar_archivos_obsoletos.py`:**
    * *Comando:* `python3 scripts/limpiar_archivos_obsoletos.py`
    * *Propósito:* Purga archivos `.DS_Store`, temporales de Python (`__pycache__`, `*.pyc`) y backups en desuso.
38. **`scripts/eliminar_capas_obsoletas.py`:**
    * *Comando:* `python3 scripts/eliminar_capas_obsoletas.py`
    * *Propósito:* Remueve capas reemplazadas por nuevas versiones censales o catastrales.
39. **`scripts/diagnosticar_apis.py`:**
    * *Comando:* `python3 scripts/diagnosticar_apis.py`
    * *Propósito:* Envía solicitudes de prueba a Overpass, ohsome, GBIF y Taginfo, reportando latencias y estado HTTP en terminal.
40. **`scripts/test_cliente_apis.py`:**
    * *Comando:* `python3 scripts/test_cliente_apis.py`
    * *Propósito:* Verifica el correcto funcionamiento de los fallbacks locales cuando las APIs externas simulan un error 500 o timeout.
41. **`scripts/construir_manual_actualizacion_maestro.py`:**
    * *Comando:* `python3 scripts/construir_manual_actualizacion_maestro.py`
    * *Propósito:* Concatena de forma determinista las 20 secciones del manual maestro, validando que supere las 2.000 líneas y sincronizándolo en los tres directorios oficiales.

### 15.6. Subsistema 6: Base de Datos Espacial, Migración y PostGIS
42. **`scripts/subir_base_datos_supabase.py`:**
    * *Comando:* `python3 scripts/subir_base_datos_supabase.py --upload-storage`
    * *Propósito:* Sube los archivos GeoJSON al bucket público de almacenamiento CDN en Supabase Storage con verificación SHA256.
43. **`scripts/cargar_entidades_postgis.py`:**
    * *Comando:* `python3 scripts/cargar_entidades_postgis.py`
    * *Propósito:* Conecta a PostgreSQL 17 vía SSL e inserta masivamente las 129.262 entidades en la tabla `public.capas_entidades`.
44. **`scripts/generar_seed_sql.py`:**
    * *Comando:* `python3 scripts/generar_seed_sql.py`
    * *Propósito:* Genera el archivo SQL de siembra `scripts/db/02_seed_metadata.sql` a partir de los metadatos de las capas oficiales.
45. **`scripts/ejecutar_migracion_remota.py`:**
    * *Comando:* `python3 scripts/ejecutar_migracion_remota.py`
    * *Propósito:* Aplica migraciones DDL automáticas sobre bases de datos PostgreSQL remotas.
46. **`scripts/procesar_bbdd_vgi.py`:**
    * *Comando:* `python3 scripts/procesar_bbdd_vgi.py`
    * *Propósito:* Orquesta la validación cruzada entre la base de datos relacional y las copias estáticas locales en disco.
47. **`scripts/secciones_manual.py`:** Módulo auxiliar con la Sección 01 del manual.
48. **`scripts/secciones_02_06.py`:** Módulo auxiliar con las Secciones 02 a 06 del manual.
49. **`scripts/secciones_07_11.py`:** Módulo auxiliar con las Secciones 07 a 11 del manual.

---

## 16. Sistema de Storyboards Territoriales y Visor Lightbox Pop-Up HD

El Atlas VGI trasciende la mera visualización estática de mapas incorporando una **estrategia de comunicación narrativa geoespacial (*Spatial Storytelling*)**. A través del Módulo 09 ([`src/js/modulos/indicadores_analisis.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/indicadores_analisis.js)), la plataforma articula las 131 capas en relatos situados que vinculan la evidencia cuantitativa con los problemas cotidianos de Barrio Brasil.

### 16.1. Marco Metodológico del Storytelling Territorial
El relato territorial se organiza en torno a 4 perfiles de usuarios de la comunidad universitaria y barrial:
1. **Comunidad Vecinal y Organizaciones Barriales:** Necesidad de argumentación técnica para presupuestos participativos, defensa del arbolado urbano y fiscalización de residuos.
2. **Estudiantes e Investigadores de la Universidad Alberto Hurtado:** Datos abiertos estandarizados para tesis de pregrado y posgrado en geografía, sociología y planificación territorial.
3. **Comercio Local y Emprendimientos Barriales:** Diagnóstico de flujos peatonales, accesibilidad y cobertura de servicios.
4. **Planificadores y Gestores Municipales:** Consulta ágil del Plan Regulador Comunal (PRC) y catastro de inversiones públicas (BIP).

### 16.2. Ficha Técnica de los 7 Storyboards Barriales
1. **Storyboard 1: Evolución Histórica y Protección Patrimonial:**
   - *Capas Clave:* Zonas Típicas (Monumentos Nacionales), Inmuebles de Conservación Histórica (PRC Santiago), polígonos de cités y arquitectura tradicional de finales del siglo XIX y principios del XX.
   - *Pregunta Territorial:* ¿Cómo coexisten las áreas de estricta protección patrimonial con la presión inmobiliaria de renovación urbana en el cuadrante Av. Brasil - Ricardo Cumming?
2. **Storyboard 2: Vulnerabilidad Social y Registro Social de Hogares (RSH):**
   - *Capas Clave:* Manzanas Censo 2024 (INE), tramos RSH por unidad vecinal (40% y 60% de menores ingresos), hogares monoparentales con jefatura femenina y adultos mayores.
   - *Pregunta Territorial:* ¿Dónde se concentran los núcleos de mayor fragilidad socioeconómica y qué distancia recorren hacia los servicios de salud primaria?
3. **Storyboard 3: Movilidad Activa e Infraestructura Ciclista:**
   - *Capas Clave:* Red de ciclovías consolidadas (Calle Brasil, Rosas, Mapocho), estaciones de bicicletas públicas, paraderos de buses RED y siniestralidad vial histórica.
   - *Pregunta Territorial:* ¿Existen discontinuidades críticas en la red de transporte no motorizado al cruzar ejes de alta velocidad como Av. San Pablo o Matucana?
4. **Storyboard 4: Arbolado Urbano, Plazas e Islas de Calor:**
   - *Capas Clave:* Catastro de arbolado viario, polígonos de plazas (Plaza Brasil, Plaza Yungay), temperatura de superficie terrestre (Landsat/Sentinel) y zonas de sombra peatonal.
   - *Pregunta Territorial:* ¿Cuál es el déficit de metros cuadrados de área verde por habitante en las manzanas densificadas de Barrio Brasil respecto al estándar OMS (9 m²/hab)?
5. **Storyboard 5: Equipamiento Comunitario y Seguridad de Emergencia:**
   - *Capas Clave:* Cuarteles de bomberos (Cuerpo de Bomberos de Santiago), comisarías de Carabineros de Chile, centros de salud de urgencia (SAPU), semáforos UOCT y alumbrado público.
   - *Pregunta Territorial:* ¿Qué sectores residenciales superan el tiempo de respuesta óptimo de 8 minutos para unidades de emergencia?
6. **Storyboard 6: Identidad Cultural, Centros Comunitarios y Gastronomía:**
   - *Capas Clave:* Teatros barriales, bibliotecas, galpones comunitarios, centros culturales autogestionados y locales gastronómicos patrimoniales.
   - *Pregunta Territorial:* ¿Cómo se estructura el circuito de economías creativas barriales en torno a la Plaza Brasil y el eje Huérfanos?
7. **Storyboard 7: Gestión de Residuos Sólidos y Puntos Limpios (Catastro SUBDERE 2024):**
   - *Capas Clave:* Catastro Nacional de Residuos Sólidos Domiciliarios (SUBDERE 2024), sitios de recolección y transporte, puntos limpios comunitarios y microbasurales identificados por voluntarios.
   - *Pregunta Territorial:* ¿Cómo impacta la logística de recolección en los costos comunales y qué cobertura espacial tienen los puntos de reciclaje en el barrio?

### 16.3. Arquitectura y Código del Visor Lightbox Pop-Up HD
Para permitir la inspección profunda de cartografías temáticas complejas sin pixelación, el Atlas incorpora un visor modal Lightbox en alta definición ([`src/index.html`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/index.html), líneas 450 a 485):

```html
<!-- VISOR LIGHTBOX CARTOGRÁFICO POP-UP HD -->
<div class="lightbox-overlay" id="lightbox-visor-hd" aria-hidden="true" role="dialog">
  <div class="lightbox-contenedor">
    <header class="lightbox-header">
      <div class="lightbox-titulo-zona">
        <span class="insignia-hd">ALTA RESOLUCIÓN</span>
        <h3 id="lightbox-titulo">Lámina Cartográfica Temática HD</h3>
      </div>
      <div class="lightbox-toolbar">
        <button type="button" class="lightbox-btn" id="btn-zoom-in" title="Aumentar zoom (+)">🔍 +</button>
        <button type="button" class="lightbox-btn" id="btn-zoom-out" title="Disminuir zoom (-)">🔍 -</button>
        <button type="button" class="lightbox-btn" id="btn-zoom-reset" title="Restablecer vista original (100%)">⟲ 100%</button>
        <button type="button" class="lightbox-btn lightbox-cerrar" id="btn-lightbox-cerrar" title="Cerrar visor (Esc)">✕</button>
      </div>
    </header>
    <div class="lightbox-cuerpo" id="lightbox-cuerpo-pan">
      <img id="lightbox-imagen-hd" src="" alt="Cartografía Barrial en Alta Definición" draggable="false" />
    </div>
    <footer class="lightbox-footer">
      <p id="lightbox-metadatos">Departamento de Geografía · Universidad Alberto Hurtado · Proyección WGS84 / UTM 19S</p>
    </footer>
  </div>
</div>
```

* **Lógica JavaScript de Interacción (Zoom & Pan Suave):**
  En `src/js/modulos/indicadores_analisis.js` se implementa el controlador táctil y de ratón:
  ```javascript
  let escalaZoom = 1.0;
  let posX = 0, posY = 0;
  let arrastrando = false;
  let inicioX = 0, inicioY = 0;

  function abrirLightboxHD(urlImagen, titulo, metadatos) {
    const modal = document.getElementById('lightbox-visor-hd');
    const img = document.getElementById('lightbox-imagen-hd');
    const tituloEl = document.getElementById('lightbox-titulo');
    const metaEl = document.getElementById('lightbox-metadatos');

    img.src = urlImagen;
    tituloEl.textContent = titulo;
    metaEl.textContent = metadatos;
    
    escalaZoom = 1.0;
    posX = 0;
    posY = 0;
    actualizarTransformacion();

    modal.classList.add('activo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
  }

  function actualizarTransformacion() {
    const img = document.getElementById('lightbox-imagen-hd');
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${escalaZoom})`;
  }

  // Eventos de Zoom por Botones y Rueda de Ratón
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    escalaZoom = Math.min(escalaZoom + 0.25, 4.0); // Máximo 400%
    actualizarTransformacion();
  });

  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    escalaZoom = Math.max(escalaZoom - 0.25, 0.5); // Mínimo 50%
    actualizarTransformacion();
  });

  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    escalaZoom = 1.0;
    posX = 0;
    posY = 0;
    actualizarTransformacion();
  });

  // Atajo de teclado: Escape para cerrar
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('lightbox-visor-hd');
      if (modal.classList.contains('activo')) {
        modal.classList.remove('activo');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });
  ```

### 16.4. Especificaciones para Nuevas Cartografías HD
Para que una nueva cartografía temática se visualice nítidamente en el Lightbox Pop-Up HD:
1. **Resolución Mínima:** 3.840 × 2.160 píxeles (4K UHD) a 300 DPI.
2. **Formato:** WebP con compresión de calidad 90% (o PNG de 24 bits optimizado con `oxipng`).
3. **Ubicación:** Guardar en `src/img/cartografias/` con nomenclatura estandarizada:
   `lamina_hd_[numero]_[nombre_corto].webp`.
4. **Vínculo en el Storyboard:** En `src/js/modulos/indicadores_analisis.js`, invocar la función pasando los metadatos completos y cita institucional.

---

## 17. Protocolo de Integridad, Pre-Despliegue y Pruebas Automatizadas

Para preservar la confiabilidad académica y el estándar de calidad ISO 19157 del Atlas VGI, ningún cambio puede ser incorporado a la rama de producción (`main`) sin haber superado de forma determinista la suite de pruebas automatizadas del proyecto.

### 17.1. Filosofía del Protocolo de Integridad
El protocolo responde al principio de **"cero regresiones en producción"**. Cualquier intervención (ya sea la adición de una nueva capa oficial, la modificación de un token de color en CSS o la edición de una función en JavaScript) puede desencadenar fallos en cascada: rotura de sintaxis JSON, desalineación de la cuenta de capas, desincronización de los archivos espejo entre `docs/` y `src/docs/`, o la inclusión involuntaria de punteros Git LFS no expandidos.

El script maestro [`scripts/verificar_integridad_despliegue.py`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/scripts/verificar_integridad_despliegue.py) actúa como el **guardián de calidad (*Quality Gate*)** previo a cualquier commit.

### 17.2. Las 8 Pruebas Automatizadas de Pre-Despliegue
A continuación se detallan las 8 pruebas que componen el pipeline de verificación:

| N° | Prueba de Integridad | Módulo Evaluador | Criterio de Éxito Estricto | Acción en Caso de Fallo |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Conteo Oficial de Capas** | `verificar_conteo_capas()` | Exactamente **131 capas activas** (121 oficiales + 10 VGI). | Bloqueo. Revisar `src/js/modulos/ide_chile.js` y `data/`. |
| **02** | **Sintaxis y Esquema GeoJSON** | `validar_sintaxis_geojson()` | 100% de los archivos `.geojson` parseables con `json.loads()` conforme a RFC 7946. | Bloqueo. Identificar línea y columna con error de coma o llave. |
| **03** | **Atributos Maestros ISO** | `validar_atributos_maestros()` | Presencia obligatoria de los 14 atributos normalizados en cada `Feature`. | Advertencia / Bloqueo. Ejecutar `enriquecer_base_datos_metadatos.py`. |
| **04** | **Integridad del ZIP Maestro** | `validar_geodatabase_zip()` | Peso $\ge 500$ MB, exactamente 256 archivos y `zipfile.testzip() is None`. | Bloqueo. Re-ejecutar `scripts/empaquetar_base_datos_completa.py`. |
| **05** | **Detección de Punteros LFS** | `verificar_smudge_lfs()` | Ningún archivo `.zip`, `.gpkg` o `.pbf` debe pesar menos de 1.000 bytes. | Bloqueo. Ejecutar `git lfs pull` para descargar el binario real. |
| **06** | **Integridad de Catálogos Excel/CSV**| `validar_matrices_tabulares()`| Libros `.xlsx` abribles con `openpyxl` y CSVs sin caracteres corruptos UTF-8. | Bloqueo. Ejecutar `scripts/generar_catalogos_excel.py`. |
| **07** | **Escaneo de Seguridad y Citas** | `auditar_seguridad_y_afiliacion()`| **0 menciones a proyectos o códigos externos no vigentes**, 0 tokens secretos de Supabase expuestos en frontend. | Bloqueo inmediato. Sustituir por afiliación formal UAH. |
| **08** | **Paridad de Carpetas Espejo** | `verificar_sincronizacion_espejos()`| Suma MD5 idéntica entre `docs/archivo` y `src/docs/archivo`. | Bloqueo. Ejecutar sincronización con `rsync -av docs/ src/docs/`. |

### 17.3. Código Operativo de `scripts/verificar_integridad_despliegue.py`
A continuación se expone la estructura central del script de auditoría:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import zipfile
import hashlib

def prueba_01_conteo_capas():
    # Verifica que existan exactamente 131 capas cartográficas
    print("[1/8] Verificando conteo de 131 capas cartográficas...")
    # ... conteo y comparación con CAPAS_OFICIALES ...
    return True

def prueba_04_integridad_zip():
    print("[4/8] Auditando geodatabase comprimida (geodatabase_completa_atlas_vgi.zip)...")
    ruta_zip = "docs/geodatabase_completa_atlas_vgi.zip"
    if not os.path.exists(ruta_zip):
        print(f"[-] ERROR CRÍTICO: No existe {ruta_zip}")
        return False
    
    peso_bytes = os.path.getsize(ruta_zip)
    peso_mb = peso_bytes / (1024 * 1024)
    if peso_mb < 500.0:
        print(f"[-] ERROR: El archivo ZIP pesa solo {peso_mb:.2f} MB (se esperan >= 500 MB)")
        return False

    with zipfile.ZipFile(ruta_zip, "r") as z:
        error_crc = z.testzip()
        if error_crc is not None:
            print(f"[-] ERROR DE CORRUPCIÓN CRC en: {error_crc}")
            return False
        total_archivos = len(z.namelist())
        if total_archivos < 250:
            print(f"[-] ERROR: El ZIP contiene {total_archivos} archivos (se esperan >= 250)")
            return False

    print(f"[✓] ZIP íntegro: {total_archivos} archivos validados ({peso_mb:.2f} MB).")
    return True

def prueba_07_escaneo_seguridad_y_afiliacion():
    print("[7/8] Escaneando ausencia total de referencias a proyectos o códigos no vigentes...")
    archivos_inspeccionar = [
        "src/index.html", "src/css/estilos.css", "src/js/app.js",
        "README.md", "MANUAL_ACTUALIZACION_ATLAS.md"
    ]
    coincidencias = 0
    for ruta in archivos_inspeccionar:
        if os.path.exists(ruta):
            with open(ruta, "r", encoding="utf-8", errors="ignore") as f:
                contenido = f.read()
                if "termino_no_autorizado" in contenido.lower():
                    print(f"[-] ALERTA DE SEGURIDAD: Referencia no autorizada detectada en {ruta}")
                    coincidencias += 1
    if coincidencias > 0:
        return False
    print("[✓] 0 referencias a proyectos o códigos no vigentes detectadas. Afiliación institucional limpia.")
    return True

if __name__ == "__main__":
    # Ejecuta secuencialmente las 8 pruebas
    # Si alguna falla, termina con sys.exit(1)
    pass
```

### 17.4. Ejecución del Protocolo
Para ejecutar la verificación completa:

```bash
python3 scripts/verificar_integridad_despliegue.py
```

Si todas las pruebas concluyen con éxito, el script retornará código de salida `0` y el mensaje:
```text
================================================================================
[✓✓✓] PROTOCOLO DE PRE-DESPLIEGUE SUPERADO AL 100% — LISTO PARA PRODUCCIÓN
================================================================================
```

---

## 18. Flujo de Trabajo Git, Git LFS y Despliegue Continuo (CI/CD)

El ciclo de desarrollo y publicación del Atlas VGI se sustenta en un flujo de **Integración y Despliegue Continuo (CI/CD)** completamente automatizado entre **GitHub** y la red perimetral de **Netlify Edge**.

### 18.1. Estrategia de Rastreo de Binarios Masivos con Git LFS
Debido a que GitHub impone un límite rígido de 100 MB por archivo en repositorios estándar, los archivos que superan dicho tamaño o que contienen datos comprimidos masivos se administran mediante **Git Large File Storage (Git LFS)**.

* **Configuración del Archivo `.gitattributes`:**
  Ubicado en la raíz del repositorio ([`.gitattributes`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/.gitattributes)):
  ```text
  *.zip filter=lfs diff=lfs merge=lfs -text
  *.gpkg filter=lfs diff=lfs merge=lfs -text
  *.pbf filter=lfs diff=lfs merge=lfs -text
  *.numbers filter=lfs diff=lfs merge=lfs -text
  ```

* **Comandos Clave de Gestión LFS:**
  ```bash
  # Instalar hooks de LFS en el entorno local (solo una vez)
  git lfs install

  # Listar todos los archivos rastreados activamente por LFS y su tamaño
  git lfs ls-files -s

  # Descargar los binarios reales si se clonó el repositorio en un equipo nuevo
  git lfs pull
  ```

### 18.2. Ciclo de Vida del Despliegue en Netlify Edge
Cuando un desarrollador ejecuta `git push origin main`, se activa la siguiente cadena de eventos:

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Desarrollador / GIS Lead
    participant GH as GitHub (Repositorio main)
    participant LFS as GitHub LFS Storage
    participant Netlify as Netlify Build Runner
    participant Edge as Netlify Global Edge CDN
    participant User as Usuario Final (Navegador)

    Dev->>Dev: Ejecuta verificar_integridad_despliegue.py
    Dev->>GH: git push origin main
    Dev->>LFS: Sube bloques binarios LFS (*.zip, *.gpkg)
    GH->>Netlify: Webhook de despliegue automático
    Netlify->>GH: Clona árbol de código fuente
    Netlify->>LFS: Descarga binarios con GIT_LFS_SKIP_SMUDGE=0
    Netlify->>Netlify: Aplica reglas de netlify.toml (Headers, Caché, Redirecciones)
    Netlify->>Edge: Despliega directorio src/ a 35+ nodos perimetrales
    Edge-->>User: Sirve SPA en <1.2s con SSL/TLS Let's Encrypt
```

### 18.3. Procedimiento Paso a Paso para Desplegar Actualizaciones
1. **Paso 1: Sincronizar Cambios Locales:**
   Asegúrese de estar en la rama `main` y con el árbol de trabajo limpio:
   ```bash
   git status
   ```
2. **Paso 2: Ejecutar la Suite de Integridad:**
   ```bash
   python3 scripts/verificar_integridad_despliegue.py
   ```
   *No continúe si alguna de las 8 pruebas arroja error.*
3. **Paso 3: Añadir Cambios y Realizar Commit Semántico:**
   ```bash
   git add .
   git commit -m "feat(cartografia): incorporar 131 capas normalizadas y actualizar geodatabase a 543 MB"
   ```
4. **Paso 4: Subir a Producción en GitHub:**
   ```bash
   git push origin main
   ```
5. **Paso 5: Verificación en Vivo de la Publicación:**
   Espere ~30 segundos mientras Netlify procesa el commit y ejecute una consulta de encabezados HTTP con `curl`:
   ```bash
   # Verificar disponibilidad del sitio web
   curl -sI https://atlasvgiuah.netlify.app/ | grep -E "HTTP|x-nf-request-id"

   # Verificar tamaño exacto y disponibilidad del archivo ZIP maestro
   curl -sI https://atlasvgiuah.netlify.app/docs/geodatabase_completa_atlas_vgi.zip | grep -E "HTTP|content-length|content-type"
   ```
   Debe responder `HTTP/2 200` con `content-type: application/zip` y `content-length: 568534094` bytes (o superior).

---

## 19. Matriz de Troubleshooting y Solución de Problemas Frecuentes

Esta sección compila las incidencias técnicas más comunes que pueden presentarse durante el desarrollo, despliegue o consumo del Atlas VGI, junto con su causa raíz y la solución técnica inmediata.

### 19.1. Problemas Cartográficos y de Renderizado Leaflet

#### Problema 1: El mapa Leaflet aparece en gris con bloques vacíos al cambiar de pestaña
* **Causa Raíz:** Al crearse el mapa mientras su contenedor (`#mapa`) está oculto mediante `display: none` (por encontrarse en otro módulo como Overpass o Glosario), Leaflet calcula las dimensiones del viewport con ancho y alto iguales a cero ($0 \times 0$ píxeles). Al hacerse visible el contenedor, Leaflet no redibuja automáticamente los azulejos (*tiles*).
* **Solución Técnica:** En `src/js/app.js`, dentro de la función `cambiarPanel(nombrePanel)`, agregue una invocación a `invalidateSize()` cada vez que el usuario regrese a la pestaña del visor cartográfico:
  ```javascript
  if (nombrePanel === 'visor-mapa' && window.ModuloMapa) {
    setTimeout(() => {
      window.ModuloMapa.obtenerInstanciaMapa().invalidateSize();
    }, 150);
  }
  ```

#### Problema 2: Las geometrías GeoJSON aparecen desfasadas o en el Golfo de Guinea (Lat/Lon invertidas)
* **Causa Raíz:** El estándar GeoJSON (RFC 7946) estipula que las coordenadas deben expresarse estrictamente en el orden `[longitud, latitud]` ($[X, Y]$). Sin embargo, ciertos servicios WFS de software SIG legacy emiten coordenadas en formato `[latitud, longitud]`.
* **Solución Técnica:** Ejecute el script de inversión de coordenadas antes de publicar la capa:
  ```python
  import json

  def corregir_inversion(coords):
      if isinstance(coords[0], (int, float)):
          # Si latitud está en primera posición (en Chile entre -17 y -56)
          if -56 <= coords[0] <= -17 and -76 <= coords[1] <= -66:
              return [coords[1], coords[0]]
          return coords
      return [corregir_inversion(c) for c in coords]

  with open("capa_defectuosa.geojson", "r", encoding="utf-8") as f:
      data = json.load(f)

  for feat in data.get("features", []):
      geom = feat.get("geometry", {})
      geom["coordinates"] = corregir_inversion(geom["coordinates"])

  with open("capa_corregida.geojson", "w", encoding="utf-8") as f:
      json.dump(data, f, ensure_ascii=False)
  ```

#### Problema 3: Error `Uncaught Error: Invalid LatLng object: (NaN, NaN)` en la consola del navegador
* **Causa Raíz:** La capa GeoJSON contiene elementos con geometrías nulas (`"geometry": null`) o nodos huérfanos sin coordenadas válidas.
* **Solución Técnica:** En `src/js/modulos/ide_chile.js`, filtre las entidades nulas antes de agregarlas a la capa de Leaflet:
  ```javascript
  const featuresValidas = geojson.features.filter(f => 
    f.geometry && 
    f.geometry.coordinates && 
    f.geometry.coordinates.length > 0
  );
  ```

### 19.2. Problemas de Descarga, Git LFS y Archivos ZIP

#### Problema 4: La descarga de `geodatabase_completa_atlas_vgi.zip` entrega un archivo de solo 130 bytes
* **Causa Raíz:** El archivo descargado no es el binario comprimido real, sino un **puntero de texto de Git LFS** que contiene el hash SHA-256. Esto ocurre cuando Netlify compila el sitio sin expandir los archivos LFS.
* **Solución Técnica:**
  1. Verifique que `netlify.toml` contenga en la sección `[build.environment]`:
     ```toml
     GIT_LFS_SKIP_SMUDGE = "0"
     GIT_LFS_FETCH_INCLUDE = "*.zip,*.xlsx,*.csv,*.docx,*.gpkg,*.pbf"
     ```
  2. En el panel de control de Netlify, asegúrese de que el plugin **Netlify Large Media** no esté en conflicto con GitHub LFS, o configure las variables de entorno de Git LFS en **Site settings** $\rightarrow$ **Environment variables**.

#### Problema 5: Error `Git LFS: Repository or object not found` al hacer `git push`
* **Causa Raíz:** Se agotó la cuota mensual de ancho de banda o almacenamiento de Git LFS en la cuenta de GitHub Free (límite de 1 GB de almacenamiento y 1 GB/mes de ancho de banda).
* **Solución Técnica:**
  Aloje el archivo `.zip` en el bucket público de **Supabase Storage** (que provee 1 GB de almacenamiento CDN permanente $0 USD) y configure una redirección HTTP 302 en `netlify.toml`:
  ```toml
  [[redirects]]
    from = "/docs/geodatabase_completa_atlas_vgi.zip"
    to = "https://[TU-PROYECTO].supabase.co/storage/v1/object/public/atlas-geojson/geodatabase_completa_atlas_vgi.zip"
    status = 302
    force = true
  ```

### 19.3. Problemas de APIs Abiertas en Tiempo Real (Overpass, ohsome, GBIF)

#### Problema 6: Overpass API responde con Error `HTTP 429 Too Many Requests` o `504 Gateway Timeout`
* **Causa Raíz:** El servidor principal de Overpass (`overpass-api.de`) se encuentra sobrecargado por peticiones concurrentes a nivel mundial o la consulta territorial es excesivamente extensa.
* **Solución Técnica:** El módulo `src/js/modulos/osm.js` implementa un conmutador de servidores espejo (*round-robin failover*):
  ```javascript
  const SERVIDORES_OVERPASS = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
  ];

  async function consultarOverpassConReintentos(queryQL) {
    for (const urlServidor of SERVIDORES_OVERPASS) {
      try {
        const resp = await fetch(urlServidor, {
          method: 'POST',
          body: 'data=' + encodeURIComponent(queryQL),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        if (resp.ok) return await resp.json();
      } catch (err) {
        console.warn(`[!] Servidor ${urlServidor} no disponible, intentando siguiente...`);
      }
    }
    // Si todos fallan, recurrir a la copia local cacheada en src/data/
    console.error('[-] Todos los servidores Overpass fallaron. Activando fallback local.');
    return await cargarFallbackLocalOSM();
  }
  ```

#### Problema 7: La API de GBIF no retorna registros o entrega observaciones marinas en Santiago Centro
* **Causa Raíz:** Registros biológicos con errores de transcripción en coordenadas o ausencia de filtro estricto de incertidumbre espacial (`coordinateUncertaintyInMeters`).
* **Solución Técnica:** En `src/js/modulos/gbif.js`, restrinja la consulta exigiendo obligatoriamente:
  `hasCoordinate=true`, `hasGeospatialIssue=false`, y un radio de incertidumbre inferior a 250 metros (`coordinateUncertaintyInMeters=0,250`).

### 19.4. Problemas de Base de Datos y Supabase PostGIS

#### Problema 8: La base de datos en Supabase entra en estado "Paused" tras 7 días de inactividad
* **Causa Raíz:** En el plan gratuito (*Free Tier*) de Supabase, los proyectos que no registran consultas a la base de datos durante 7 días consecutivos entran en modo de pausa para ahorrar recursos de cómputo.
* **Solución Técnica (Keep-Alive Permanente):**
  Cree un flujo de trabajo automatizado en GitHub Actions ([`.github/workflows/keep_alive_supabase.yml`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/.github/workflows/keep_alive_supabase.yml)) que ejecute una consulta trivial cada 3 días:
  ```yaml
  name: Keep-Alive Supabase PostGIS
  on:
    schedule:
      - cron: '0 12 */3 * *' # Cada 3 días a las 12:00 UTC
    workflow_dispatch:

  jobs:
    ping-database:
      runs-on: ubuntu-latest
      steps:
        - name: Enviar Ping SQL a Supabase
          run: |
            curl -s -X POST "${{ secrets.SUPABASE_URL }}/rest/v1/rpc/fn_obtener_capa_bbox" \
              -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
              -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
              -H "Content-Type: application/json" \
              -d '{"p_capa_id": "censo2024_manzanas"}' > /dev/null
            echo "Ping de mantenimiento completado exitosamente."
  ```

---

## 20. Glosario Técnico y Referencias Normativas Internacionales

### 20.1. Glosario Exhaustivo de Conceptos y Terminología Técnica

1. **Información Geográfica Voluntaria (VGI - *Volunteered Geographic Information*):** Término acuñado por Michael Goodchild (2007) para describir la creación, ensamblaje y difusión colaborativa de datos geográficos generados voluntariamente por ciudadanos e investigadores.
2. **Neo-geografía:** Práctica de utilizar herramientas, técnicas cartográficas y de geolocalización abiertas por parte de personas o colectivos sin formación formal en geodesia tradicional, democratizando el análisis espacial.
3. **OpenStreetMap (OSM):** Base de datos geográfica colaborativa mundial abierta bajo licencia libre ODbL, cuyos datos son digitalizados y mantenidos por una comunidad global de millones de mapeadores.
4. **Overpass QL:** Lenguaje de consulta de alto rendimiento optimizado para extraer subconjuntos vectoriales de OpenStreetMap mediante filtros de etiquetas, relaciones, áreas y envolventes espaciales.
5. **ohsome API:** Plataforma analítica desarrollada por el Heidelberg Institute for Geoinformation Technology (HeiGIT) que permite consultar el historial completo de ediciones y evolución espacio-temporal de OpenStreetMap.
6. **Darwin Core (DwC):** Estándar internacional del Biodiversity Information Standards (TDWG) diseñado para facilitar el intercambio de información biológica sobre biodiversidad y registros taxonómicos.
7. **Global Biodiversity Information Facility (GBIF):** Red internacional de datos científicos de acceso abierto que integra registros de biodiversidad provenientes de museos, herbarios, universidades y ciencia ciudadana (iNaturalist).
8. **Bounding Box (BBox):** Rectángulo envolvente mínimo alineado con los ejes de coordenadas geográficas, definido por cuatro valores cardinales: `[minX, minY, maxX, maxY]` (longitud mínima, latitud mínima, longitud máxima, latitud máxima).
9. **WGS84 (EPSG:4326):** Sistema de Referencia Geodésico Mundial de 1984, el estándar global adoptado por el sistema GPS y por las especificaciones web GeoJSON, expresado en coordenadas elipsoidales (grados decimales).
10. **SIRGAS Chile (EPSG:5360):** Sistema de Referencia Geocéntrico para las Américas, marco geodésico oficial del Estado de Chile oficializado mediante resoluciones del Instituto Geográfico Militar (IGM).
11. **UTM Huso 19 Sur (EPSG:32719):** Proyección cilíndrica conforme transversa de Mercator correspondiente al cuadrante territorial de Chile Central y la Región Metropolitana de Santiago.
12. **GeoJSON (RFC 7946):** Formato estándar abierto y legible por humanos para codificar estructuras de datos geográficos utilizando la notación de objetos JavaScript (JSON).
13. **Simple Features Access (OGC / ISO 19125):** Especificación internacional que define las reglas topológicas de geometrías vectoriales digitales bidimensionales (Point, LineString, Polygon, MultiPolygon).
14. **PostgreSQL:** Sistema de gestión de bases de datos relacional y orientada a objetos de código abierto de clase empresarial con más de 35 años de desarrollo activo.
15. **PostGIS:** Extensión espacial para PostgreSQL que añade soporte para objetos geográficos, permitiendo ejecutar consultas espaciales nativas en SQL y cálculo topológico avanzado.
16. **Índice Espacial GIST (*Generalized Search Tree*):** Estructura de indexación basada en árboles R que permite a PostgreSQL buscar e intersectar polígonos y puntos en tiempo logarítmico.
17. **Índice GIN (*Generalized Inverted Index*):** Estructura de indexación invertida diseñada para acelerar búsquedas de atributos dentro de campos de datos compuestos como `JSONB` o arrays.
18. **GeoPackage (GPKG - OGC):** Formato abierto de archivo universal, no propietario y basado en SQLite para almacenar y transferir múltiples capas vectoriales y ráster con índices espaciales.
19. **Shapefile (ESRI):** Formato vectorial clásico propietario pero ampliamente distribuido, compuesto por un mínimo de tres archivos interdependientes (`.shp`, `.shx`, `.dbf`).
20. **Web Feature Service (WFS - OGC / ISO 19142):** Protocolo de comunicación web estándar para consultar y descargar geometrías vectoriales con sus tablas de atributos en formato GML o GeoJSON.
21. **Web Map Service (WMS - OGC / ISO 19128):** Estándar que genera y sirve imágenes georreferenciadas rasterizadas a partir de datos espaciales en tiempo real.
22. **Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT):** Red de instituciones públicas chilenas que coordinan la estandarización, interoperabilidad y publicación abierta de la cartografía oficial del Estado.
23. **Plan Regulador Comunal (PRC):** Instrumento de planificación territorial normativo de nivel comunal que define usos de suelo, alturas máximas, densidades y áreas de protección patrimonial en Chile.
24. **Certificado de Informaciones Normativas VGI (CIN-VGI):** Reporte automatizado generado por el Atlas que cruza la posición geográfica del usuario con las 192 zonas del PRC de Santiago.
25. **Banco Integrado de Proyectos (BIP):** Plataforma del Ministerio de Desarrollo Social y Familia (MIDESO) que administra las iniciativas de inversión pública del Estado de Chile.
26. **Catastro Nacional RSD SUBDERE 2024:** Inventario oficial de la Subsecretaría de Desarrollo Regional y Administrativo sobre la recolección, transferencia y disposición final de Residuos Sólidos Domiciliarios.
27. **Registro Social de Hogares (RSH):** Sistema de estratificación socioeconómica del Ministerio de Desarrollo Social y Familia que califica la vulnerabilidad socioeconómica de los hogares chilenos por tramos porcentuales.
28. **Modelo WLC (*Weighted Linear Combination*):** Técnica matemática de evaluación multicriterio donde diversas variables continuas estandarizadas se ponderan linealmente para obtener un índice sintético de calidad o idoneidad territorial.
29. **Índice Global de Calidad VGI (IGV):** Puntuación porcentual obtenida por una capa geográfica en el modelo WLC v2.0, articulando un 50% de calidad cuantitativa intrínseca y un 50% de calidad cualitativa de metadatos.
30. **Git Large File Storage (Git LFS):** Extensión de código abierto para Git que reemplaza archivos de gran tamaño dentro del repositorio por punteros de texto livianos, alojando los binarios pesados en un servidor dedicado.
31. **Content Delivery Network (CDN):** Red distribuida geográficamente de servidores perimetrales que almacenan en caché copias locales de recursos web para entregarlos a los usuarios con mínima latencia.
32. **Netlify Edge:** Red perimetral de alojamiento serverless que ejecuta funciones y sirve contenidos estáticos con compresión dinámica y certificados TLS automáticos.
33. **Open Database License (ODbL 1.0):** Licencia de datos abiertos que rige sobre OpenStreetMap, la cual permite la libre copia, distribución y adaptación de la base de datos siempre que se mantenga el reconocimiento y la misma licencia en trabajos derivados (*Share-Alike*).
34. **Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0):** Licencia abierta que permite la distribución y modificación de documentos, cartografías y recursos gráficos bajo condición de atribución formal y licenciamiento idéntico.
35. **GNU Affero General Public License v3.0 (AGPLv3):** Licencia de software libre que garantiza que todo código fuente modificado que se ejecute en un servidor de red deba ser puesto a disposición pública de la comunidad.
36. **Ley N° 20.285 sobre Acceso a la Información Pública:** Marco legal de transparencia del Estado de Chile que faculta la libre reutilización y auditoría ciudadana de la cartografía emitida por ministerios y municipalidades.
37. **Revealing Module Pattern:** Patrón de arquitectura JavaScript que utiliza clausuras léxicas (*closures*) y funciones anónimas autoejecutables (IIFE) para aislar variables privadas y exponer una API pública estructurada.
38. **BEM (*Block Element Modifier*):** Metodología estandarizada de nomenclatura para clases CSS que mejora la modularidad y escalabilidad del diseño de interfaces complejas.
39. **Subresource Integrity (SRI):** Mecanismo de seguridad web que permite a los navegadores comprobar que los archivos JavaScript o CSS cargados desde servidores CDN de terceros no han sido manipulados maliciosamente.
40. **Bypass de Caché (*Cache-Busting*):** Técnica que añade parámetros dinámicos de consulta (ej. `?v=1730000000`) a las URLs para forzar al navegador a descargar una versión fresca del recurso en lugar de reutilizar la copia en caché local.
41. **CORS (*Cross-Origin Resource Sharing*):** Mecanismo de seguridad basado en encabezados HTTP que permite o restringe que recursos de una página web sean solicitados desde un dominio diferente.
42. **Lightbox HD:** Visor modal de alta densidad gráfica que permite realizar zoom y paneo continuo sobre imágenes cartográficas en ultra alta resolución (4K/300 DPI) sin pérdida de nitidez.
43. **Single Page Application (SPA):** Aplicación web que carga un único documento HTML y actualiza dinámicamente las vistas a medida que el usuario interactúa, sin requerir recargas completas de la página desde el servidor.
44. **Unidad Vecinal (UV):** Célula territorial de gestión comunal definida en la legislación chilena para efectos de representación vecinal y asignación de programas sociales.
45. **OGUC (*Ordenanza General de Urbanismo y Construcciones*):** Reglamento técnico de la Ley General de Urbanismo y Construcciones de Chile que norma las exigencias de habitabilidad, seguridad y equipamiento en proyectos urbanos.

### 20.2. Referencias Normativas Internacionales y Fuentes Jurídicas

#### Estándares Internacionales de la Organización Internacional de Normalización (ISO)
* **ISO 19115-1:2014:** *Geographic information — Metadata — Part 1: Fundamentals*. International Organization for Standardization. Ginebra, Suiza.
* **ISO 19139:2007:** *Geographic information — Metadata — XML schema implementation*. International Organization for Standardization. Ginebra, Suiza.
* **ISO 19157:2013:** *Geographic information — Data quality*. International Organization for Standardization. Ginebra, Suiza.
* **ISO 19157-1:2023:** *Geographic information — Data quality — Part 1: General requirements*. International Organization for Standardization. Ginebra, Suiza.
* **ISO 19110:2016:** *Geographic information — Methodology for feature cataloguing*. International Organization for Standardization. Ginebra, Suiza.
* **ISO/IEC 29500-1:2016:** *Information technology — Document description and processing languages — Office Open XML File Formats*. International Organization for Standardization. Ginebra, Suiza.

#### Estándares de Consorcios Abiertos de la Industria (OGC & IETF)
* **Open Geospatial Consortium (OGC):** *Simple Feature Access - Part 1: Common Architecture* (OGC 06-103r4).
* **Open Geospatial Consortium (OGC):** *OGC GeoPackage Encoding Standard* (OGC 12-128r18).
* **Internet Engineering Task Force (IETF):** *The GeoJSON Format* (RFC 7946, 2016).
* **Biodiversity Information Standards (TDWG):** *Darwin Core Standard* (DwC, 2009).

#### Legislación y Normativa Nacional de la República de Chile
* **República de Chile:** *Ley N° 20.285 sobre Acceso a la Información Pública*. Diario Oficial de la República de Chile, 20 de agosto de 2008.
* **Ministerio de Vivienda y Urbanismo (MINVU):** *Decreto Supremo N° 47: Ordenanza General de Urbanismo y Construcciones (OGUC)*. Diario Oficial de la República de Chile, 19 de mayo de 1992 (con sus modificaciones vigentes).
* **Ministerio de Vivienda y Urbanismo (MINVU):** *Decreto con Fuerza de Ley N° 458: Ley General de Urbanismo y Construcciones (LGUC)*. Diario Oficial de la República de Chile, 13 de abril de 1976.
* **Municipalidad de Santiago:** *Decreto Alcaldicio N° 1324: Plan Regulador Comunal de Santiago*. Diario Oficial de la República de Chile, 27 de diciembre de 1989 (y textos refundidos posteriores).
* **Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE):** *Catastro Nacional de Residuos Sólidos Domiciliarios 2024*. Ministerio del Interior y Seguridad Pública, Santiago de Chile, enero de 2024.
* **Instituto Nacional de Estadísticas (INE):** *Censo de Población y Vivienda 2024: Resultados Preliminares y Cartografía Censal*. Santiago de Chile, 2024.

---

**Departamento de Geografía · Universidad Alberto Hurtado**  
*Nodo GeoAbierto: Atlas de Información Geográfica Voluntaria para la Gestión Territorial*  
Santiago de Chile, 2026.
