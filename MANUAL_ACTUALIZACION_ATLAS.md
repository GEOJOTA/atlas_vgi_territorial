# Manual de Actualización y Mantención Técnica — Atlas de Información Geográfica Voluntaria (Atlas VGI · UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Versión de Arquitectura Consolidada:** 131 Capas Operativas (121 Oficiales + 10 VGI) · 140 Descriptores en Diccionario · 10 Módulos Funcionales (`00` al `09`) · 7 Storyboards Territoriales · 5 Dimensiones Analíticas.

---

## 1. Objeto, Alcance Metodológico y Principios de Continuidad Operativa

### 1.1. Propósito del Documento
El presente manual formaliza la totalidad de directrices de ingeniería, arquitectura de software, especificación geodésica, estándares de diseño, catalogación de metadatos, gestión de licencias y protocolos de control de versiones requeridos para la mantención, actualización y extensión del **Atlas de Información Geográfica Voluntaria (`atlas_vgi_uah`)**. 

Este documento está redactado con un estándar de reporte técnico-profesional y artículo metodológico en tercera persona. Su propósito es garantizar que cualquier investigador, analista SIG, geógrafo o desarrollador web sin participación previa en el proyecto pueda comprender la totalidad de la estructura, modificar capas, reescribir módulos, incorporar nueva normativa urbana o desplegar mejoras a producción con total autonomía y sin riesgo de inducir regresiones en el sistema.

### 1.2. Ámbito Territorial y Escalas de Análisis
La plataforma articula tres escalas espaciales interdependientes:
1. **Escala Local / Barrial Núcleo (Barrio Brasil)**: Polígono consolidado de $74,85\text{ ha}$ (delimitado por Av. Brasil, Alameda, Cumming y San Pablo), caracterizado por una morfología de baja altura (135 inmuebles tradicionales de 1 a 2 pisos), 9 cités catastrados y 4 torres residenciales en altura.
2. **Escala de Transición / Manzana Universitaria (Campus UAH)**: Área de influencia directa de $136,10\text{ ha}$ sobre el eje Alameda y Metro Los Héroes / Moneda / Santa Ana / República.
3. **Escala Metropolitana / Pericentral (Santiago Poniente y Gran Santiago)**: Polígono extendido de $223,75\text{ ha}$ y coberturas regionales de la Región Metropolitana de Santiago (EPSG:4326 / EPSG:32719).

### 1.3. Estado de Consolidación de la Estructura
La arquitectura actual constituye la estructura definitiva del Atlas. Si bien la etapa final del proyecto contempla actividades de validación participativa con vecinos y ajustes analíticos menores, dichas adecuaciones se insertan directamente sobre los módulos, catálogos y storyboards ya operativos, sin alterar la topología de software documentada en este manual.

---

## 2. Paradigma Tecnológico, Arquitectura de Software y Stack de Lenguajes

### 2.1. Filosofía de Ingeniería: Serverless Static Spatial Architecture
La plataforma implementa una arquitectura estática autónoma del lado del cliente (*Client-Side Serverless Static Architecture*). A diferencia de los sistemas de información geográfica tradicionales dependientes de servidores de mapas propietarios y costosos (ArcGIS Server, GeoServer con bases de datos PostgreSQL/PostGIS dedicadas), el Atlas VGI UAH opera íntegramente en el navegador del cliente mediante tecnologías web abiertas y peticiones asíncronas optimizadas (`Fetch API`).

Esta decisión de diseño ofrece ventajas estructurales críticas:
- **Cero Costo Operativo y Máxima Sostenibilidad**: La plataforma no requiere infraestructura de pago, desplegándose de forma continua y gratuita sobre **Netlify** y **GitHub Pages**.
- **Independencia de Entornos Compilados**: No utiliza empaquetadores complejos (Webpack, Vite, Rollup) ni frameworks reactivos monolíticos (React, Angular, Vue) que sufren obsolescencia rápida de dependencias (`npm audit vulnerabilities`). Se fundamenta en estándares puros de la web.
- **Portabilidad Eterna**: El repositorio completo puede clonarse y ejecutarse en cualquier computador local sin conexión a internet o montarse en cualquier servidor estático básico mediante `python -m http.server`.

### 2.2. Stack de Lenguajes y Estándares Utilizados
- **HTML5 Semántico**: Maquetación accesible conforme a las directrices W3C / WHATWG, con roles y atributos ARIA (`aria-expanded`, `aria-label`, `aria-hidden`) para navegación asistida y estructuración por módulos.
- **CSS3 Puro**: Hojas de estilo estructuradas (`src/css/estilos.css`) con variables personalizadas (`:root`), maquetación con CSS Grid y Flexbox, efectos de translucidez (*glassmorphism*) y compatibilidad responsive completa (breakpoints en 768px y 1024px).
- **Vanilla JavaScript ES6+**: Arquitectura de software modular basada en el patrón de módulo revelador (*Revealing Module Pattern*) mediante Funciones Ejecutadas Inmediatamente (IIFE, `const Modulo = (() => { ... return { ... }; })();`). Cada módulo encapsula su estado interno y expone una API pública limpia en `window`.
- **Python 3.10+**: Suite de geoprocesamiento, análisis espacial multivariado, cálculo del Índice Global de MetaCalidad (ISO 19115/19157) y scripts de auditoría automatizada pre-despliegue.
- **Estándar GeoJSON (RFC 7946; Butler et al., 2016)**: Formato de intercambio vectorial para las 131 capas visualizadas en web, codificado en UTF-8 y coordenadas geográficas decimales WGS84 (`EPSG:4326`).
- **Estándar OGC GeoPackage v1.2 (ISO/IEC 19162)**: Formato de persistencia de bases de datos espaciales SQLite utilizado para resguardar esquemas y diccionarios nativos de columnas de fuentes estatales (SUBDERE RSD 2024).
- **Markdown (CommonMark / GFM) y LaTeX KaTeX**: Documentación técnica, manuales y formulación matemática en tercera persona.

### 2.3. Sincronización Simétrica en Directorios Espejo
El archivo de configuración de producción `netlify.toml` declara `publish = "src"` como directorio raíz para la distribución web:

```toml
[build]
  publish = "src"

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

Dado que los scripts de auditoría y geoprocesamiento en Python se ejecutan desde la raíz del repositorio, existe una **regla de sincronización estricta**:
- Todo archivo cartográfico `.geojson` o `.gpkg` en `data/` debe tener su réplica idéntica en `src/data/`.
- Todo documento técnico, manual o catálogo `.md`, `.json` o `.xlsx` en `docs/` debe replicarse simétricamente en `src/docs/`.

---

## 3. Estructura de Directorios del Repositorio

```text
atlas_vgi_uah/
├── netlify.toml                         # Configuración del servidor de producción (publish = "src")
├── README.md                            # Resumen institucional y ficha técnica del proyecto
├── MANUAL_USO.md                        # Manual de Uso del Atlas (espejado en docs/ y src/docs/)
├── MANUAL_ACTUALIZACION_ATLAS.md        # Este documento maestro (espejado en docs/ y src/docs/)
├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md  # Protocolo técnico de verificación pre-despliegue
│
├── data/                                # REPOSITORIO MAESTRO DE DATOS ESPACIALES (Espejo de src/data/)
│   ├── *.geojson                        # 131 capas cartográficas vectoriales en EPSG:4326
│   ├── *.gpkg                           # Geodatabases originales con diccionarios de columnas (SUBDERE RSD)
│   ├── geodatabase_completa_atlas_vgi.zip # Paquete maestro comprimido descargable (542 MB)
│   └── matriz_sintesis_barrio_brasil_manzanas.geojson # Matriz de 51 manzanas y 44 variables
│
├── docs/                                # DOCUMENTACIÓN Y CATÁLOGOS ABIERTOS (Espejo de src/docs/)
│   ├── ARQUITECTURA.md                  # Especificación de ingeniería y flujo de datos
│   ├── BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md# 125 referencias bibliográficas completas en APA 7ª ed.
│   ├── TRAZABILIDAD_ACADEMICA.md        # Memoria técnica del Fondecyt F1261256
│   ├── ANALISIS_METACALIDAD.md          # Reporte de calidad cuantitativa y cualitativa ISO 19157
│   ├── matriz_metacalidad.json          # Matriz de métricas calculada por scripts
│   ├── categorias_tematicas_osm.xlsx    # Catálogo OpenXML de categorías VGI
│   ├── catalogo_fuentes_vgi.xlsx        # Catálogo OpenXML de fuentes oficiales
│   └── perfil_metadatos_vgi.xlsx        # Catálogo OpenXML del perfil de metadatos IDE Chile
│
├── scripts/                             # BATERÍA DE AUTOMATIZACIÓN Y AUDITORÍA EN PYTHON
│   ├── verificar_conteo_capas.py        # Audita cuadratura: 131 capas, 140 descriptores y dimensiones
│   ├── verificar_integridad_despliegue.py # Verifica sintaxis JSON, ausencia de LFS y paridad data/ <-> src/data/
│   ├── analisis_metacalidad.py          # Calcula el Índice Global de MetaCalidad (ISO 19115 / 19157)
│   └── procesar_bbdd_vgi.py             # Utilidad de reproyección e ingesta batch
│
└── src/                                 # DIRECTORIO DE PUBLICACIÓN WEB EN PRODUCCIÓN
    ├── index.html                       # Interfaz única: 10 pestañas (00-09), visor Leaflet y subpaneles
    ├── data/                            # Espejo idéntico de data/ consumido asíncronamente por el navegador
    ├── docs/                            # Espejo idéntico de docs/ para descargas directas del usuario
    ├── css/
    │   └── estilos.css                  # Sistema de diseño, paleta cromática y estilos responsivos
    └── js/
        ├── config.js                    # Bbox barrial, coordenadas de inicio y 10 categorías VGI (NODO_CONFIG)
        ├── app.js                       # Controlador maestro, eventos de mapa, filtros e ICV dinámico
        └── modulos/
            ├── geodesia.js              # Motor geodésico propio: proyecciones UTM 19S (EPSG:32719) y áreas
            ├── mapa.js                  # Inicialización de Leaflet, capas base y controladores cartográficos
            ├── ide_chile.js             # Catálogo de las 121 capas oficiales del Estado (CAPAS_OFICIALES)
            ├── evaluador_normativo.js   # Inspector Normativo PRC/OGUC, Certificado CIN-VGI e hitos 1990-2024
            ├── osm.js                   # Módulo 01: Consultas en tiempo real vía Overpass API (OSM)
            ├── ohsome.js                # Módulo 02: Series temporales ohsome API (HeiGIT) y auditoría OSMCha
            ├── evaluador_calidad_cuantitativa.js # Módulo 02: Matriz multicriterio WLC/AHP (ISO 19157)
            ├── gbif.js                  # Módulo 03: Registros de biodiversidad GBIF / iNaturalist (Darwin Core)
            ├── umap.js                  # Módulo 04: Integración de lienzos participativos uMap
            ├── metadatos.js             # Módulo 05: Generador de fichas XML/JSON (ISO 19115 / ISO 19139)
            ├── diccionario.js           # Módulo 06: Diccionario de Datos (140 descriptores, ISO 19110)
            ├── licencias.js             # Módulo 07: Régimen jurídico de datos abiertos y descarga de .xlsx
            ├── manual.js                # Módulo 08: Renderizador interactivo del Manual de Uso y Actualización
            ├── indicadores_analisis.js  # Módulo 09: 5 Dimensiones Analíticas y 7 Storyboards territoriales
            ├── taginfo.js               # Utilidad de validación de etiquetas OSM con Taginfo API
            ├── calidad_analyst.js       # Asistente analítico de consistencia espacial
            ├── db_client.js             # Conector de persistencia cliente (Supabase)
            └── importador_capas.js      # Procesador cliente de subida de archivos GeoJSON/KML/Shapefile (.zip)
```

---

## 4. Front-End, Sistema de Diseño y Accesibilidad

### 4.1. Maquetación y Distribución Espacial (`src/index.html`)
La interfaz del Atlas se estructura sobre una distribución de mando unificado orientada a la toma de decisiones territoriales:
1. **Barra Superior Táctica**: Exhibe la marca institucional (Universidad Alberto Hurtado, Departamento de Geografía, Fondecyt F1261256) y la barra horizontal de navegación única con las 10 pestañas de módulos (`00` al `09`).
2. **Lienzo Cartográfico Central (`#mapa`)**: Ocupa el 100% del espacio visual del visor, gestionando los eventos de puntero, paneo, zoom geográfico, renderizado vectorial y cuadros modales.
3. **Barra Flotante de Controles Territoriales**:
   - Selector de encuadre barrial: *Barrio Brasil Completo* ($223,75\text{ ha}$), *Manzana UAH* ($136,10\text{ ha}$) o *Región Metropolitana*.
   - Herramienta **⛶ Dibujar Bbox**: Habilita el trazado de un polígono personalizado con cálculo dinámico de superficie en $\text{m}^2$ y hectáreas reproyectado en tiempo real a `EPSG:32719`.
   - Control de capas base: Alternancia entre CartoDB DarkMatter, OpenStreetMap Standard y Satélite ESRI.
   - Herramienta **📦 Base de Datos (.zip)**: Descarga directa del paquete comprimido maestro.
4. **Subpaneles Acordeón Desplegables**:
   - `#subpanel-ide`: Acordeón temático que clasifica las 121 capas oficiales por institución custodia (MINVU, INE Censo 2024, MTT/UOCT, MDSF/RSH, SUBDERE Residuos, CMN, MMA, SII).
   - `#subpanel-metricas`: Telemetría del Índice de Calidad VGI (ICV) dinámico, conteo de entidades activas y atributos de completitud.
5. **Inspector Normativo Flotante (`#panel-normativa-flotante`)**: Formulario para la inspección de usos de suelo, zonificación PRC/PRMS, restricciones de riesgo y emisión del Certificado CIN-VGI.
6. **Contenedor Modal de Storyboards (`#lamina-storyboard-overlay`)**: Vista de lectura expandida (*Full-Screen Analytical Sheet*) con tipografía optimizada, diagramas vectoriales SVG, gráficos comparativos de barras, tablas cuantitativas y análisis específico para los 4 usuarios-tipo.

### 4.2. Sistema de Diseño (`src/css/estilos.css`)
El Atlas implementa una identidad visual funcional en modo oscuro (*Tactical Dark Theme*), optimizada para reducir la fatiga visual durante sesiones prolongadas de análisis espacial y resaltar los gradientes cromáticos de las entidades vectoriales:

```css
:root {
  --fondo-principal: #0b1329;       /* Pizarra ultramar profundo */
  --fondo-tarjeta: rgba(15, 23, 42, 0.75); /* Slate 900 translúcido */
  --linea-tarjeta: rgba(56, 189, 248, 0.18); /* Cyan suave para bordes */
  --tinta: #f8fafc;                 /* Blanco nieve de alta legibilidad */
  --tinta-suave: #cbd5e1;           /* Slate 300 para texto secundario */
  --tinta-tenue: #94a3b8;           /* Slate 400 para metadatos */
  --color-primario: #38bdf8;        /* Cyan 400: Coberturas oficiales y navegación */
  --color-vgi: #10b981;             /* Esmeralda 500: Coberturas colaborativas VGI */
  --color-advertencia: #f59e0b;     /* Ámbar 500: Alertas y Storyboards normativos */
  --color-peligro: #ef4444;         /* Rojo 500: Incompatibilidades normativas */
  --color-purpura: #a855f7;         /* Púrpura 500: Patrimonio y conservación */
}
```

### 4.3. Convenciones Visuales y Badges de Geometría
Para facilitar la identificación cognitiva de las 131 capas en las listas de selección, cada control incluye insignias estandarizadas:
- **Puntos (`● PUN`)**: Color verde esmeralda (`#10b981`). Identifica equipamientos puntuales, semáforos, árboles, monumentos o estaciones de transferencia.
- **Líneas (`― LÍN`)**: Color cyan (`#38bdf8`). Identifica ejes viales, rutas de transporte, redes de ciclovías o flujos de residuos.
- **Polígonos (`■ POL`)**: Color púrpura (`#a855f7`). Identifica manzanas censales, predios SII, zonas normativas del PRC, Zonas de Conservación Histórica o áreas verdes.

### 4.4. Estándar de Accesibilidad Web (WCAG 2.1 Nivel AA)
- **Contraste Cromático**: Las combinaciones de texto y fondo superan el ratio mínimo de 4.5:1 para texto normal y 3:1 para texto grande.
- **Navegabilidad por Teclado**: Todos los botones de módulos, selectores y enlaces cuentan con estilos visuales explícitos de foco (`:focus-visible`).
- **Compatibilidad con Lectores de Pantalla**: Los elementos interactivos incorporan etiquetas descriptivas `aria-label` y los paneles ocultos gestionan dinámicamente `aria-hidden="true"` y `aria-hidden="false"`.

---

## 5. Motor Cartográfico y Algoritmos Geodésicos Propios

### 5.1. Inicialización Cartográfica con Leaflet 1.9.4
En `src/js/modulos/mapa.js`, el mapa se inicializa sobre el contenedor `#mapa` fijando el centro geográfico en la Plaza Brasil:
- **Coordenadas de inicio**: Latitud `-33.4410`, Longitud `-70.6660`.
- **Nivel de zoom inicial**: `15` (escala barrial directa).
- **Límites de visualización (MaxBounds)**: Restringido a la Región Metropolitana (`[[-33.9, -71.2], [-33.0, -70.1]]`) con `minZoom: 11` y `maxZoom: 19`.

### 5.2. Motor Geodésico Conforme (`src/js/modulos/geodesia.js`)
El Atlas incorpora una biblioteca geodésica propia desarrollada para resolver la inconsistencia clásica de los visores web mercatorianos: la distorsión del cálculo de distancias y superficies en latitudes medias del hemisferio sur cuando se utiliza la proyección Web Mercator (`EPSG:3857`).

La formulación implementa rigurosamente las ecuaciones de proyección conforme Transversa de Mercator (Snyder, 1987) para el elipsoide WGS84 en la **Zona UTM 19 Sur (`EPSG:32719`)**:
- Semieje mayor ($a$): $6.378.137,0\text{ m}$.
- Achatamiento ($f$): $1 / 298,257223563$.
- Meridiano central ($\lambda_0$): $-69,0^\circ\text{ W}$ ($69^\circ\text{ Oeste}$).
- Falso Este ($X_0$): $500.000,0\text{ m}$.
- Falso Norte ($Y_0$): $10.000.000,0\text{ m}$.
- Factor de escala en el meridiano central ($k_0$): $0,9996$.

#### Funciones Públicas Expuestas por `ModuloGeodesia`:
1. `ModuloGeodesia.geograficasAUTM(lat, lon)`: Convierte coordenadas geográficas $(\phi, \lambda)$ en grados decimales (`EPSG:4326`) a coordenadas métricas proyectadas Este ($X$) y Norte ($Y$) en metros (`EPSG:32719`).
2. `ModuloGeodesia.utmAGeograficas(este, norte)`: Ejecuta la transformación inversa desde coordenadas proyectadas hacia latitud y longitud geodésicas.
3. `ModuloGeodesia.calcularAreaPoligono(coordsGeograficas)`: Reproyecta cada vértice a UTM 19S y aplica el algoritmo de la fórmula del área de Gauss (Shoelace Algorithm):
   $$A = \frac{1}{2} \left| \sum_{i=0}^{n-1} (X_i Y_{i+1} - X_{i+1} Y_i) \right|$$
   Retorna la superficie exacta en metros cuadrados ($\text{m}^2$) y hectáreas ($\text{ha}$) con compensación de convergencia de meridianos.
4. `ModuloGeodesia.calcularDistanciaMetros(p1, p2)`: Calcula la distancia geodésica sobre el elipsoide mediante la formulación de Haversine o distancia euclidiana en el plano proyectado UTM 19S.

---

## 6. Cuadratura del Inventario Cartográfico (131 Capas / 140 Descriptores)

El sistema mantiene una consistencia matemática verificada por pruebas unitarias automatizadas (`scripts/verificar_conteo_capas.py`):

```text
  121 Capas Oficiales del Estado (ide_chile.js)
+  10 Macro-categorías VGI Comunitarias (config.js)
--------------------------------------------------------
= 131 Capas Cartográficas Operativas en el Visor
```

```text
  131 Capas Cartográficas Operativas
+   9 Tablas de Referencia y Esquemas Normalizados
--------------------------------------------------------
= 140 Descriptores Técnicos en el Diccionario (diccionario.js)
```

### 6.1. Distribución en las 5 Dimensiones Analíticas (Módulo 09)
En `src/js/modulos/indicadores_analisis.js` (`DIMENSIONES`), las 131 coberturas se distribuyen sin omisiones ni solapamientos:

| Dimensión Analítica | Identificador | Número de Capas | Temáticas Territoriales Cubiertas |
| :--- | :--- | :---: | :--- |
| **Dimensión 01 · Sociodemográfica** | `dim-sociodemografica` | **19 capas** | Censo 2024 (población, edad, género, pueblos originarios, inmigración), RSH y densidad. |
| **Dimensión 02 · Socioeconómica** | `dim-socioeconomica` | **18 capas** | Vulnerabilidad RSH (CSE tramos $\le 40\%$), inversión pública BIP, patentes comerciales y avalúos SII. |
| **Dimensión 03 · Socioambiental** | `dim-socioambiental` | **36 capas** | Arbolado urbano, áreas verdes, ruido ambiental MMA, biodiversidad GBIF y 13 capas de residuos SUBDERE 2024. |
| **Dimensión 04 · Sociosanitaria** | `dim-sociosanitaria` | **3 capas** | Red asistencial de salud (CESFAM N° 1), farmacias comunitarias y personas en situación de dependencia. |
| **Dimensión 05 · Sociourbana o Habitabilidad** | `dim-sociourbana` | **55 capas** | Zonificación PRC Santiago, PRMS, alturas de edificación, 9 cités catastrados, ZCH, ICH y movilidad UOCT. |
| **TOTAL CONSOLIDADO** | **5 Dimensiones** | **131 capas** | **Cuadratura íntegra sin duplicidades ni vacíos.** |

### 6.2. Matriz de Síntesis Multivariada y Diagnóstico Territorial
El archivo [`src/data/matriz_sintesis_barrio_brasil_manzanas.geojson`](file:///d:/17082025/2026/Practica%20profesional/atlas_vgi_uah/src/data/matriz_sintesis_barrio_brasil_manzanas.geojson) condensa el modelamiento espacial avanzado del proyecto sobre las **51 manzanas censales consolidadas de Barrio Brasil**:
- **44 Atributos Cuantitativos**: Densidad poblacional, porcentaje de vivienda en arriendo, avalúo fiscal promedio SII, número de cités, nivel de ruido ponderado diurno/nocturno (MMA), áreas verdes per cápita a 300m y 500m, proximidad a estaciones de Metro y oferta de servicios comunitarios VGI.
- **Descomposición PCA**: Cuatro componentes ortogonales que explican el $60,85\%$ de la varianza territorial.
- **Tipologías Urbanas por Clustering Ward**: Clasificación de las 51 manzanas en 4 grupos morfológicos y sociohabitacionales.
- **Autocorrelación Espacial Local (LISA de Anselin)**: Cálculo de clusters espaciales (*High-High*, *Low-Low*, *High-Low*, *Low-High*) con matriz de contigüidad espacial tipo Queen y $999$ permutaciones de Monte Carlo.

---

## 7. Desglose Funcional de los 10 Módulos de la Plataforma (`00` al `09`)

| Pestaña | Módulo / Archivo JS | Propósito Metodológico y Capacidades Funcionales |
| :---: | :--- | :--- |
| **`00`** | **Visor Territorial y Calidad**<br>`src/js/app.js`<br>`src/js/modulos/mapa.js`<br>`src/js/modulos/evaluador_normativo.js` | Despliegue interactivo de las 131 capas cartográficas; cálculo en tiempo real del Índice de Calidad VGI (ICV) dinámico; trazado de Bbox geodésico; **Inspector Normativo PRC/OGUC** que analiza la zonificación comunal/intercomunal, evalúa usos permitidos/prohibidos según el Art. 2.1.24 OGUC, emite el **Certificado CIN-VGI** e incorpora la síntesis de las **10 modificaciones históricas al PRC de Santiago (1990–2024)** vinculadas al repositorio oficial de Asesoría Urbana; e importación local de archivos espaciales. |
| **`01`** | **Consultas Overpass (OSM)**<br>`src/js/modulos/osm.js` | Constructor visual de consultas y ejecutor de sentencias en lenguaje Overpass QL para la descarga y análisis en tiempo real de geometrías y etiquetas desde los servidores de OpenStreetMap. |
| **`02`** | **Calidad & ICV (ISO 19157)**<br>`src/js/modulos/ohsome.js`<br>`src/js/modulos/evaluador_calidad_cuantitativa.js` | Evaluación multicriterio espacial basada en la norma ISO 19157:2013 mediante ponderación lineal ponderada (WLC / AHP); series temporales históricas de aportes cartográficos mediante la API ohsome de HeiGIT (Universidad de Heidelberg); y auditoría de conjuntos de cambios con OSMCha. |
| **`03`** | **Biodiversidad GBIF**<br>`src/js/modulos/gbif.js` | Conexión directa a la API de la Infraestructura Mundial de Información en Biodiversidad (GBIF) e iNaturalist para la consulta y mapeo de flora, fauna y funga urbana bajo el estándar Darwin Core. |
| **`04`** | **Cartografía uMap**<br>`src/js/modulos/umap.js` | Galería interactiva e integración vía marcos embebidos (*iframes*) de proyectos territoriales colaborativos desarrollados en la plataforma comunitaria uMap para talleres barriales. |
| **`05`** | **Metadatos ISO 19115**<br>`src/js/modulos/metadatos.js` | Formulario dinámico de catalogación y exportador de fichas de metadatos espaciales en formatos JSON y XML (ISO 19139:2007) homologadas con el Perfil Nacional de Metadatos de IDE Chile (SNIT). |
| **`06`** | **Diccionario de Datos**<br>`src/js/modulos/diccionario.js` | Especificación de los **140 descriptores técnicos** de capas y atributos conforme a la norma ISO 19110:2016, incluyendo los diccionarios nativos de columnas de las 13 geodatabases SUBDERE RSD 2024. |
| **`07`** | **Licencias & Catálogos**<br>`src/js/modulos/licencias.js` | Marco jurídico de datos abiertos (ODbL 1.0, CC BY-SA 4.0, AGPLv3, Ley N° 20.285 de Transparencia y Ley N° 19.628 de Protección de Datos Personales) y descarga de catálogos en formato Microsoft Excel (.xlsx). |
| **`08`** | **Manual de Uso y Actualización**<br>`src/js/modulos/manual.js` | Sistema interactivo de documentación que renderiza la Parte I (Manual de Uso) y Parte II (Manual de Actualización Técnica) con filtros de búsqueda por palabra clave y descarga de manuales en Markdown. |
| **`09`** | **Indicadores & Storyboards**<br>`src/js/modulos/indicadores_analisis.js` | Matriz de síntesis territorial clasificada en 5 Dimensiones Analíticas y 7 Storyboards de profundidad empírica sobre Barrio Brasil. |

---

## 8. Catálogo de los 7 Storyboards Territoriales (Módulo 09)

Cada storyboard constituye un estudio territorial monográfico que cruza las capas del Atlas para responder a problemáticas socioterritoriales concretas:

1. **Storyboard 1 · Habitar, Altura y Presión sobre el Tejido Patrimonial**:
   - *Foco analítico*: Tensión entre los 135 predios históricos de 1 a 2 pisos protegidos bajo ZCH B1 frente a la densificación en altura por rasantes en el eje Alameda.
   - *Capas clave*: `minvu_patrimonio`, `minvu_ipt_prc_santiago`, `catastro_predial_sii`, `bbdd_19`, `cat09_edificaciones`.
2. **Storyboard 2 · Movilidad Sustentable y Caminabilidad Peatonal**:
   - *Foco analítico*: Isócronas de caminata hacia las estaciones de Metro (Línea 1, 2 y 5), infraestructura ciclovial y seguridad en cruces semaforizados UOCT.
   - *Capas clave*: `cat05_transporte`, `lineas_metro`, `estaciones_metro`, `ciclovias_subdere`, `semaforos_rm_uoct_2026`.
3. **Storyboard 3 · El Oasis Verde del Barrio Brasil: Cobertura Arbórea y Biodiversidad**:
   - *Foco analítico*: Déficit de áreas verdes de proximidad ($2,1\text{ m}^2/\text{hab}$ en manzanas interiores vs. $46\text{ m}^2$ en torno a Plaza Brasil) y mitigación de islas de calor.
   - *Capas clave*: `cat08_espaciopublico`, `bbdd_40`, `bbdd_42`, `mma_ruido_gran_santiago_2010`, `catastro_vegetacional`.
4. **Storyboard 4 · Campus UAH y Vitalidad Económica Cotidiana**:
   - *Foco analítico*: La universidad como nodo estructurante del poniente, carga de población flotante y sinergia con los 381 locales comerciales y gastronómicos.
   - *Capas clave*: `cat01_educacion`, `cat03_comercio`, `bbdd_12`, `bbdd_14`, `red_vial_caminera`.
5. **Storyboard 5 · Cuidados, Género y Salud Comunitaria**:
   - *Foco analítico*: Demografía del envejecimiento (índice de $118,4$ adultos mayores por cada 100 menores), feminización del cuidado informal ($84,6\%$) y barreras arquitectónicas en casonas y cités.
   - *Capas clave*: `establecimientos_salud`, `bbdd_67`, `bbdd_70`, `bbdd_66`, `bbdd_73`.
6. **Storyboard 6 · Metabolismo Urbano y Residuos Sólidos Domiciliarios (SUBDERE RSD 2024)**:
   - *Foco analítico*: Trazabilidad logística de las 189.510 toneladas anuales de residuos generadas en Santiago Centro ($500,78\text{ kg/hab/año}$), traslado de 12,1 km a la Estación de Transferencia Quilicura y transporte ferroviario de 49 km hasta el Relleno Sanitario Loma Los Colorados en Tiltil ($61,1\text{ km}$ totales), con un gasto municipal de $\$14.845$ millones CLP anuales.
   - *Capas clave*: `bbdd_86`, `bbdd_87`, `bbdd_89`, `bbdd_91`, `bbdd_94`, `cat03_comercio`.
7. **Storyboard 7 · Treinta Años de Disputa Normativa: Las Modificaciones al PRC en Barrio Brasil (1990–2024)**:
   - *Foco analítico*: Cómo 10 modificaciones históricas al Plan Regulador Comunal (Seccional Brasil, Modificaciones N° 16, 21, 26 y 31, Enmienda N° 2 de Cités, Enmiendas de Altura N° 1, 3 y 6) contuvieron la demolición indiscriminada, blindaron los **9 cités catastrados** y protegieron el $80,4\%$ del barrio bajo Conservación Histórica frente a la brecha de renta inmobiliaria (*Rent Gap*).
   - *Capas clave*: `minvu_prc`, `minvu_patrimonio`, `cmn_monumentos`, `cat02_vivienda`.

---

## 9. Procedimientos Imprescindibles de Mantención y Actualización

### Procedimiento 1: Ingesta de una Nueva Cobertura Oficial del Estado (6 Pasos)

#### Paso 1. Normalización Geodésica y Formato
- Asegurar que la capa vectorial se encuentre en coordenadas geográficas **`EPSG:4326` (WGS84 / SIRGAS-Chile)** con coordenadas en grados decimales (longitud negativa, latitud negativa).
- Exportar en formato `GeoJSON` con codificación de caracteres `UTF-8` y nombre en minúsculas y guiones bajos (ejemplo: `bbdd_99.geojson`). Si proviene de una geodatabase con comentarios SQLite de columnas, conservar paralelamente el archivo original `.gpkg`.

#### Paso 2. Depósito en Directorios Espejo
Copiar simétricamente el archivo en ambas ubicaciones:
```bash
# Copia en directorio maestro
cp ruta/origen/bbdd_99.geojson data/bbdd_99.geojson

# Copia en directorio de publicación web
cp ruta/origen/bbdd_99.geojson src/data/bbdd_99.geojson
```

#### Paso 3. Registro en el Catálogo Oficial (`src/js/modulos/ide_chile.js`)
Abrir `src/js/modulos/ide_chile.js` e incorporar la definición en el objeto `CAPAS_OFICIALES`:
```javascript
  bbdd_99: {
    id: 'bbdd_99',
    nombre: 'Puntos Limpios y Reciclaje Barrial (BBDD-99)',
    institucion: 'Ilustre Municipalidad de Santiago / MMA',
    urlServicio: 'https://ide.minvu.cl/',
    archivoLocal: 'data/bbdd_99.geojson',
    color: '#10b981',
    peso: 2,
    opacidadRelleno: 0.35,
    geometria: 'Punto', // 'Punto' | 'Línea' | 'Polígono'
    num_bbdd: 99,
    licencia: 'Datos Abiertos / Ley 20.285',
    descripcion: 'Catastro georreferenciado de infraestructura de reciclaje en el Barrio Brasil.'
  },
```

#### Paso 4. Incorporación del Botón de Activación en la Interfaz (`src/index.html`)
En `src/index.html`, localizar el acordeón temático correspondiente dentro de `#subpanel-ide` y añadir el elemento interactivo:
```html
<button type="button" class="chip-oficial" id="btn-oficial-bbdd_99" data-capa="bbdd_99" title="Ilustre Municipalidad de Santiago / MMA">
  <span class="dot-color" style="background:#10b981;"></span>
  <span class="nombre-chip">99. Puntos Limpios y Reciclaje Barrial</span>
  <span class="badge-institucion-chip">MUNISTGO</span>
  <span class="badge-geom-chip">● PUN</span>
</button>
```

#### Paso 5. Asignación Dimensional y Documentación en el Diccionario
1. En `src/js/modulos/indicadores_analisis.js`:
   - Añadir `'bbdd_99': 'Puntos Limpios y Reciclaje Barrial (BBDD-99)'` en `NOMBRES_OFICIALES_FALLBACK`.
   - Incorporar `'bbdd_99'` al arreglo `capasIds` de la dimensión pertinente en `DIMENSIONES`.
2. En `src/js/modulos/diccionario.js`:
   - Registrar la cobertura y el desglose de sus campos en `CATALOGO_DICCIONARIO`.

#### Paso 6. Ajuste de Umbrales de Auditoría
Actualizar el número esperado de capas (por ejemplo, de 121 a 122 oficiales y de 131 a 132 totales) en `scripts/verificar_conteo_capas.py` y ejecutar las pruebas de verificación.

---

### Procedimiento 2: Actualización de Geometrías o Atributos sin Cambio de Identificador
Cuando se dispone de una versión más reciente de una cobertura existente (por ejemplo, una nueva entrega del Censo, catastro predial del SII o áreas verdes):
1. Verificar que el archivo resultante mantenga el CRS `EPSG:4326` y conserve la estructura de nombres de columnas preexistente.
2. Sobrescribir el archivo de manera idéntica en `data/` y en `src/data/` (por ejemplo, `data/capa_bbdd_40.geojson` y `src/data/capa_bbdd_40.geojson`).
3. El motor cartográfico Leaflet y la telemetría dinámica de `app.js` leerán las nuevas entidades y propiedades en la siguiente carga sin requerir modificaciones en el código JavaScript.

---

### Procedimiento 3: Creación o Edición de un Storyboard en el Módulo 09

Cada entrada del arreglo `STORYBOARDS` en `src/js/modulos/indicadores_analisis.js` debe cumplir rigurosamente el esquema requerido por la función modal `abrirLaminaStoryboard`:

```javascript
{
  id: 'storyboard-nuevo-identificador',
  titulo: 'Título Académico del Storyboard',
  bajada: 'Resumen descriptivo en una o dos oraciones sintéticas.',
  dimensionId: 'dim-socioambiental', // dim-sociodemografica | dim-socioeconomica | dim-socioambiental | dim-sociosanitaria | dim-sociourbana
  dimensionNombre: 'Nombre Visible de la Dimensión',
  fecha: 'Octubre 2026',
  autor: 'Equipo Fondecyt F1261256 · Geografía UAH',
  tiempoLectura: '6 min lectura',
  imagen: 'https://images.unsplash.com/...',
  tags: ['Etiqueta 1', 'Etiqueta 2', 'Etiqueta 3'],
  capasRelevantes: ['bbdd_86', 'cat03_comercio'],
  contenido: {
    introduccion: `Texto introductorio de apertura (lead paragraph)...`,
    datosClave: [
      { valor: '189.510 t', label: 'Tonelaje anual', sub: 'RSD Santiago Centro' }
    ],
    porcentajesClave: [
      { label: 'Generación per cápita', valor: '+19.8%', porcentaje: 78.5, contexto: 'Contexto comparativo...' }
    ],
    graficoComparativo: {
      titulo: 'Título del Gráfico de Barras',
      filas: [
        { label: 'Santiago Centro', valor: '500,8 kg', porcentaje: 83.5 }
      ]
    },
    diagramaSVG: () => `
      <svg viewBox="0 0 760 200" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
        <!-- Elementos vectoriales SVG limpios -->
      </svg>
    `,
    tablaIndicadores: [
      { variable: 'Nombre Variable', valor: '100', referencial: '80', fuente: 'Fuente Oficial' }
    ],
    cuerpo: [
      `Primer párrafo analítico profundo...`,
      `Segundo párrafo analítico profundo...`,
      `Tercer párrafo analítico profundo...`
    ],
    conclusion: `Conclusión sintética de gestión territorial y política pública.`,
    analisisPorActor: [
      { id: 'institucion', icono: '🏛️', nombre: 'Institución / Autoridad Pública', subtitulo: '...', utilidad: '...' },
      { id: 'comunidad', icono: '🏘️', nombre: 'Comunidad / Vecinal', subtitulo: '...', utilidad: '...' },
      { id: 'voluntario', icono: '🗺️', nombre: 'Mapeador / Voluntario OSM', subtitulo: '...', utilidad: '...' },
      { id: 'ong', icono: '🔬', nombre: 'ONGs / Investigadores / Academia', subtitulo: '...', utilidad: '...' }
    ],
    apartadoBibliografico: {
      fuentesDatos: [
        { codigo: 'bbdd_86', nombre: 'Nombre Capa', institucion: 'Custodio', crs: 'EPSG:4326', tipo: 'Punto' }
      ],
      referenciasAcademicas: [
        { cita: 'Autor, A. (2024). Título. Editorial.', concepto: 'Aporte conceptual al análisis.' }
      ]
    }
  }
}
```

---

### Procedimiento 4: Actualización del Evaluador Normativo e Historial del PRC
En `src/js/modulos/evaluador_normativo.js`:
- Para añadir o modificar normativas urbanas, intervenir el objeto `FUENTES_ORDENANZAS_IPT`.
- Para registrar una nueva enmienda o seccional al Plan Regulador Comunal de Santiago, añadir un elemento en `HITOS_HISTORICOS_PRC_BRASIL`:
  ```javascript
  { 
    anio: '2026', 
    hito: 'Modificación N° 35 (Nombre de la Enmienda)', 
    detalle: 'Descripción precisa del impacto en alturas, coeficientes de constructibilidad y usos de suelo.' 
  }
  ```
  La modificación se reflejará automáticamente en la tarjeta modal del inspector y en el Certificado CIN-VGI descargable.

---

### Procedimiento 5: Extracción de Diccionarios Nativos desde Archivos GeoPackage (`.gpkg`)
Para inspeccionar comentarios de columnas o esquemas incrustados en archivos GeoPackage de SUBDERE o ministerios, ejecutar el siguiente script Python interactivo:

```python
import sqlite3

def extraer_comentarios_gpkg(ruta_gpkg):
    con = sqlite3.connect(ruta_gpkg)
    cursor = con.cursor()
    # Tablas de usuario en GeoPackage
    cursor.execute("SELECT table_name FROM gpkg_contents WHERE data_type='features'")
    tablas = [r[0] for r in cursor.fetchall()]
    
    for tabla in tablas:
        print(f"\n=== TABLA: {tabla} ===")
        cursor.execute(f"PRAGMA table_info('{tabla}')")
        columnas = cursor.fetchall()
        for col in columnas:
            cid, name, col_type, notnull, dflt_value, pk = col
            print(f"  Columna: {name:25} | Tipo: {col_type}")

extraer_comentarios_gpkg("data/CATASTRO_RSD_SUBDERE_2024.gpkg")
```

---

### Procedimiento 6: Control de Versión de Caché (`Cache-Busting`)
Dado que los navegadores web almacenan agresivamente en caché los archivos `.js` y `.css`, **siempre** que se realice una modificación en el código fuente debe incrementarse el parámetro de versión en `src/index.html`:

```html
<!-- En <head> -->
<link rel="stylesheet" href="css/estilos.css?v=20261015_v6">

<!-- Al final del <body> -->
<script src="js/config.js?v=20261015_v6"></script>
<script src="js/modulos/app.js?v=20261015_v6"></script>
<!-- (repetir para todos los módulos .js) -->
```

---

### Procedimiento 7: Pruebas en Servidor Local
Para verificar la interacción en navegador previo al despliegue:
```bash
# Navegar al directorio de publicación
cd src

# Iniciar servidor HTTP en puerto 8080
python -m http.server 8080
```
Abrir el navegador en `http://localhost:8080` y comprobar la apertura de capas, visualización de storyboards y funcionamiento del evaluador normativo.

---

### Procedimiento 8: Suite de Verificación Automatizada Pre-Despliegue
Desde la raíz del repositorio (`atlas_vgi_uah`), ejecutar obligatoriamente los tres scripts de aseguramiento de calidad:

```bash
# 1. Auditoría de cuadratura de 131 capas y 140 descriptores
python scripts/verificar_conteo_capas.py

# 2. Auditoría de integridad física de GeoJSONs y simetría data/ <-> src/data/
python scripts/verificar_integridad_despliegue.py

# 3. Recálculo del Índice Global de MetaCalidad (ISO 19115 / ISO 19157)
python scripts/analisis_metacalidad.py
```

Los tres scripts deben concluir con código de salida `0` y mensaje de éxito `[OK]`.

---

### Procedimiento 9: Publicación a Producción (GitHub y Netlify)
Una vez superada la suite de verificación automatizada:
```bash
# 1. Inspeccionar cambios pendientes
git status

# 2. Agregar todos los archivos modificados y agregados
git add -A

# 3. Generar commit con mensaje técnico descriptivo
git commit -m "Actualización técnica y documental del Atlas VGI"

# 4. Enviar a la rama principal de producción
git push origin main
```
Netlify detectará el push en la rama `main` y publicará los cambios en producción en aproximadamente 30 segundos.

---

## 10. Matriz de Diagnóstico y Resolución de Incidencias

| N° | Síntoma Observado | Causa Técnica Raíz | Protocolo de Resolución |
| :---: | :--- | :--- | :--- |
| **1** | La capa se activa en la lista pero no se dibuja en el mapa. | El archivo `.geojson` fue exportado en coordenadas métricas UTM (`EPSG:32719`) en lugar de grados decimales WGS84 (`EPSG:4326`). | Reproyectar la capa a `EPSG:4326` en QGIS o mediante `pyproj` en Python y sobrescribir el archivo en `data/` y `src/data/`. |
| **2** | Error `404 Not Found` en la consola al activar una cobertura. | Discrepancia entre la ruta declarada en `archivoLocal` (`src/js/modulos/ide_chile.js`) y el archivo físico en `src/data/`, o fallo por mayúsculas/minúsculas en servidores Linux. | Verificar coincidencia exacta de caracteres en minúscula entre `archivoLocal: 'data/nombre.geojson'` y `src/data/nombre.geojson`. |
| **3** | Al pulsar *Leer Lámina ↗* en un storyboard, la ventana modal no abre. | Error de ejecución JavaScript: el objeto en `STORYBOARDS` omite alguna propiedad obligatoria (`datosClave`, `porcentajesClave`, `filas`, `diagramaSVG()`, etc.). | Inspeccionar la consola de herramientas de desarrollo (`F12`), revisar el objeto en `indicadores_analisis.js` y asegurar que cumpla el esquema del **Procedimiento 3**. |
| **4** | Las modificaciones en archivos `.js` o `.css` no se ven en el navegador. | Caché local retenida por el navegador del cliente. | Incrementar el parámetro de versión `?v=...` en `src/index.html` (Procedimiento 6) y realizar una recarga forzada (`Ctrl + F5` o `Cmd + Shift + R`). |
| **5** | Fallo en `verificar_integridad_despliegue.py` por punteros Git LFS. | Un archivo GeoJSON de gran tamaño fue subyugado a Git LFS y contiene texto plano puntero en lugar de datos binarios reales. | Ejecutar `git lfs pull` o restaurar el GeoJSON real en `data/` y `src/data/` antes de realizar el commit. |
| **6** | Descuadre en `verificar_conteo_capas.py` (ej: 130 o 132 capas). | Se incorporó una capa en `ide_chile.js` pero se omitió en `indicadores_analisis.js` (`DIMENSIONES`) o en `diccionario.js`. | Revisar el reporte emitido por el script, el cual indicará exactamente cuál identificador falta por incorporar o se encuentra duplicado. |
| **7** | El Inspector Normativo no arroja información al hacer clic en el mapa. | La capa `minvu_prc.geojson` o `minvu_patrimonio.geojson` no se encuentra cargada o el punto seleccionado cae fuera de las geometrías normativas. | Verificar que las capas regulatorias existan en `src/data/` y que la geometría cubra el sector consultado. |
| **8** | Caracteres corruptos o signos extraños (ej: `Ã³`, `Â°`). | Archivo guardado con codificación Windows-1252 o Latin-1 en lugar de UTF-8. | Reabrir el archivo en el editor de código y guardarlo con codificación explícita `UTF-8 sin BOM`. |
| **9** | El cálculo de área en la herramienta Bbox difiere del SIG de escritorio. | Se utilizó cálculo euclidiano plano en grados decimales sin proyección geodésica conforme. | Verificar que se esté invocando `ModuloGeodesia.calcularAreaPoligono()`, la cual transforma los pares a UTM 19S (`EPSG:32719`) previo al cálculo métrico. |
| **10** | Error de conexión al consultar Overpass API o GBIF en el navegador. | Bloqueo por CORS o saturación temporal de los servidores públicos de Overpass (`overpass-api.de`). | En `src/js/modulos/osm.js`, conmutar al endpoint alternativo de respaldo (`https://overpass.kumi.systems/api/interpreter`). |

---

## 11. Marco Jurídico, Licenciamiento y Trazabilidad de Datos Abiertos

El repositorio articula un régimen de licenciamiento múltiple (*Multi-Licensing Framework*) conforme al derecho chileno e internacional:

1. **Datos Colaborativos de OpenStreetMap (Categorías VGI `cat01` a `cat10`)**:
   - Amparados por la **Open Database License (ODbL 1.0)** de la OpenStreetMap Foundation (OSMF). Permite copiar, distribuir, transmitir y adaptar los datos siempre que se atribuya la autoría a *"© Colaboradores de OpenStreetMap"* y cualquier base derivada se comparta bajo la misma licencia (*Share-Alike*).
2. **Capas Cartográficas de Síntesis y Productos Derivados UAH**:
   - Licenciados bajo **Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)**. Permite el uso académico, profesional y comercial citando la autoría institucional: *"Atlas de Información Geográfica Voluntaria — Universidad Alberto Hurtado, Fondecyt Regular F1261256 (2026)"*.
3. **Código Fuente de la Plataforma de Software**:
   - Distribuido bajo licencia **GNU Affero General Public License v3.0 (AGPLv3)**. Garantiza la libertad de acceso, auditoría, modificación y redistribución del código, exigiendo que cualquier servicio web que utilice o modifique el software publique su código fuente bajo los mismos términos.
4. **Datos Oficiales de Organismos del Estado de Chile**:
   - Regulados por la **Ley N° 20.285 sobre Acceso a la Información Pública** (Ley de Transparencia). Son datos públicos de libre disposición institucional (MINVU, INE, MTT, MDSF, SUBDERE, CMN, MMA, SII).
5. **Privacidad y Protección de Datos Sensibles**:
   - Cumplimiento estricto de la **Ley N° 19.628 sobre Protección de la Vida Privada**. Las capas del Registro Social de Hogares (RSH), Censo 2024 y Catastro Predial del SII se encuentran agregadas a nivel de manzana censal o unidad vecinal, sin contener nombres, RUTs ni datos personales individualizables.

---

## 12. Referencias Normativas y Bibliográficas (Norma APA 7ª Edición)

El compendio bibliográfico íntegro del proyecto (125 referencias académicas y metodológicas) se encuentra a disposición en [`docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`](docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md):

- Anselin, L. (1995). Local indicators of spatial association—LISA. *Geographical Analysis*, 27(2), 93–115. https://doi.org/10.1111/j.1538-4632.1995.tb00338.x
- Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016). *The GeoJSON Format* (RFC No. 7946). Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC7946
- Goodchild, M. F. (2007). Citizens as sensors: The world of volunteered geography. *GeoJournal*, 69(4), 211–221. https://doi.org/10.1007/s10708-007-9111-y
- Haklay, M. (2010). How good is volunteered geographical information? A case study of OpenStreetMap for the UK. *Environment and Planning B: Planning and Design*, 37(4), 682–703. https://doi.org/10.1068/b35097
- Harvey, D. (2012). *Ciudades rebeldes: del derecho a la ciudad a la revolución urbana*. Ediciones Akal.
- Heynen, N., Kaika, M., & Swyngedouw, E. (Eds.). (2006). *In the nature of cities: Urban political ecology and the politics of urban metabolism*. Routledge. https://doi.org/10.4324/9780203027523
- Ilustre Municipalidad de Santiago — Asesoría Urbana. (1990–2024). *Repositorio Oficial de Modificaciones Históricas al Plan Regulador Comunal de Santiago* [Expedientes digitales: Mod. N° 16, N° 21, N° 26, N° 31, Enmiendas N° 1, 2, 3 y 6]. https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz
- Infraestructura de Datos Espaciales de Chile [IDE Chile]. (2017). *Marco Técnico y Metodológico para la Evaluación de la Calidad de la Información Geográfica en Chile (Norma ISO 19157)*. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. https://www.ide.cl/
- Infraestructura de Datos Espaciales de Chile [IDE Chile]. (2018). *Perfil Nacional de Metadatos de Chile v2.0 (Basado en ISO 19115:2003 / ISO 19139:2007)*. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. https://www.ide.cl/
- International Organization for Standardization [ISO]. (2013). *Geographic information — Data quality* (ISO Standard No. 19157:2013). ISO. https://www.iso.org/standard/32575.html
- International Organization for Standardization [ISO]. (2014). *Geographic information — Metadata — Part 1: Fundamentals* (ISO Standard No. 19115-1:2014). ISO. https://www.iso.org/standard/53798.html
- International Organization for Standardization [ISO]. (2016). *Geographic information — Methodology for feature cataloguing* (ISO Standard No. 19110:2016). ISO. https://www.iso.org/standard/57303.html
- Lefebvre, H. (1974). *La production de l'espace*. Éditions Anthropos.
- López-Morales, E. (2015). Gentrification by ground rent dispossession: The shadows cast by large-scale urban renewal in Santiago de Chile. *International Journal of Urban and Regional Research*, 39(4), 756–772. https://doi.org/10.1111/1468-2427.12261
- Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019). OSHDB: A framework for spatio-temporal analysis of OpenStreetMap history data. *Open Geospatial Data, Software and Standards*, 4(1), Article 3. https://doi.org/10.1186/s40965-019-0061-3
- Smith, N. (1987). Gentrification and the rent gap. *Annals of the Association of American Geographers*, 77(3), 462–465. https://doi.org/10.1111/j.1467-8306.1987.tb00171.x
- Snyder, J. P. (1987). *Map projections: A working manual* (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. https://doi.org/10.3133/pp1395
- Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE]. (2024). *Catastro Nacional de Instalaciones de Recepción y Disposición Final de Residuos Sólidos Domiciliarios (RSD) y Diccionario Técnico Geodatabase*. Gobierno de Chile.
