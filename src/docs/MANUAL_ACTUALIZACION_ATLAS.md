# Manual de Actualización y Mantención Técnica — Atlas de Información Geográfica Voluntaria (Atlas VGI · UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Versión de Arquitectura Consolidada:** 131 Capas Operativas (121 Oficiales + 10 VGI) · 140 Descriptores en Diccionario · 10 Módulos (`00` al `09`) · 7 Storyboards Territoriales.

---

## 1. Objeto y Alcance Metodológico

El presente documento formaliza el protocolo técnico de mantención, actualización de coberturas, edición de módulos analíticos y despliegue en producción del **Atlas de Información Geográfica Voluntaria (`atlas_vgi_uah`)**. Su estructura permite que investigadores, analistas SIG o desarrolladores sin participación previa en la construcción del sistema puedan intervenir la plataforma manteniendo la integridad topológica, semántica y normativa del repositorio.

La arquitectura actual constituye la estructura consolidada de la plataforma. Las adecuaciones correspondientes a la etapa final de cierre del proyecto —incorporación de resultados de validación con actores territoriales y ajustes analíticos puntuales— se articulan directamente sobre esta base conforme al procedimiento descrito en la **Sección 7**.

---

## 2. Principios de Diseño e Ingeniería del Sistema

1. **Arquitectura Estática Autónoma (HTML5 + CSS3 + Vanilla JavaScript ES6+)**:
   La plataforma se ejecuta íntegramente en el navegador del cliente mediante **Leaflet 1.9.4** (cartografía vectorial 2D), un motor geodésico propio (`src/js/modulos/geodesia.js`) basado en la proyección conforme de Transverse Mercator (`EPSG:32719`, Snyder, 1987) y conexiones asíncronas (`fetch`) hacia servicios de datos abiertos (**Overpass API**, **ohsome API v1/v2**, **GBIF API**). Esta decisión prescinde de servidores de pago o dependencias compiladas, garantizando la sostenibilidad operativa de costo cero en **Netlify** y **GitHub Pages**.

2. **Sincronización Simétrica entre Raíz y Directorio de Publicación (`src/`)**:
   El archivo de configuración `netlify.toml` establece `publish = "src"` como raíz del servidor web en producción, mientras que los scripts Python de auditoría e integración operan sobre la raíz del repositorio:
   - Toda cobertura espacial incorporada o actualizada en `data/` se replica de forma idéntica en `src/data/`.
   - Todo documento técnico o matriz en `docs/` se replica simétricamente en `src/docs/`.

3. **Almacenamiento Cartográfico Dual (`.geojson` + `.gpkg`)**:
   - **Formato de Renderizado Web (`.geojson`)**: Las 131 capas servidas al navegador se almacenan bajo el estándar `GeoJSON` (RFC 7946; Butler et al., 2016) en coordenadas geográficas **`EPSG:4326` (WGS84 / SIRGAS-Chile)**.
   - **Formato de Persistencia de Esquemas (`.gpkg`)**: En aquellas fuentes estatales que incorporan diccionarios técnicos nativos como comentarios en la definición SQLite de cada columna —específicamente las **13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios (SUBDERE 2024, `bbdd_86` a `bbdd_98`)**—, se conservan los archivos originales `.gpkg` junto a sus derivados `.geojson` tanto en `data/` como en `src/data/`.

---

## 3. Estructura de Directorios y Componentes del Repositorio

```text
atlas_vgi_uah/
├── netlify.toml                         # Configuración de despliegue web (publish = "src")
├── README.md                            # Síntesis institucional y operativa del repositorio
├── MANUAL_USO.md                        # Manual de Uso del sistema (espejado en docs/ y src/docs/)
├── MANUAL_ACTUALIZACION_ATLAS.md        # Manual de Actualización Técnica (espejado en docs/ y src/docs/)
├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md  # Protocolo de verificación pre-despliegue
│
├── data/                                # Repositorio maestro de datos (espejo exacto de src/data/)
│   ├── *.geojson                        # 131 coberturas vectoriales en EPSG:4326
│   ├── *.gpkg                           # Geodatabases con metadatos nativos de columnas (SUBDERE RSD)
│   └── reporte_metacalidad_vgi.json     # Reporte cuantitativo ISO 19157 generado por script
│
├── docs/                                # Documentación, trazabilidad y matrices (espejo de src/docs/)
│   ├── ARQUITECTURA.md
│   ├── BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md
│   ├── TRAZABILIDAD_ACADEMICA.md
│   ├── MANUAL_USO.md
│   └── MANUAL_ACTUALIZACION_ATLAS.md
│
├── scripts/                             # Scripts Python de auditoría y procesamiento
│   ├── verificar_conteo_capas.py        # Audita la paridad de 131 capas y 140 descriptores entre módulos
│   ├── verificar_integridad_despliegue.py # Valida existencia, sintaxis JSON y paridad data/ <-> src/data/
│   ├── analisis_metacalidad.py          # Calcula el Índice Global de MetaCalidad (ISO 19115 / 19157)
│   └── integrar_nuevas_bbdd.py          # Utilidad de reproyección e ingesta por lotes
│
└── src/                                 # DIRECTORIO PUBLICADO EN PRODUCCIÓN WEB
    ├── index.html                       # Interfaz única: barra de 10 módulos (00-09), visor y subpaneles
    ├── data/                            # Espejo exacto de data/ consumido por el navegador
    ├── docs/                            # Espejo exacto de docs/ consumido por el navegador
    ├── css/
    │   └── estilos.css                  # Hoja de estilos principal de la plataforma
    └── js/
        ├── config.js                    # Coordenadas base, Bbox, 10 categorías VGI (NODO_CONFIG) y comunas RM
        ├── app.js                       # Controlador central, eventos de mapa, filtros espaciales e ICV dinámico
        └── modulos/
            ├── ide_chile.js             # Catálogo maestro de las 121 capas oficiales (CAPAS_OFICIALES)
            ├── evaluador_normativo.js   # Inspector Normativo PRC/OGUC, Certificado CIN-VGI e historial PRC (1990-2024)
            ├── osm.js                   # Módulo 01: Consultas Overpass QL sobre OpenStreetMap
            ├── ohsome.js                # Módulo 02: Series históricas ohsome API (HeiGIT) y auditoría OSMCha
            ├── evaluador_calidad_cuantitativa.js # Módulo 02: Matriz multicriterio WLC (ISO 19157)
            ├── gbif.js                  # Módulo 03: Registros biológicos GBIF / iNaturalist (Darwin Core)
            ├── umap.js                  # Módulo 04: Integración de lienzos participativos uMap
            ├── metadatos.js             # Módulo 05: Generador de fichas XML/JSON (ISO 19115 / ISO 19139)
            ├── diccionario.js           # Módulo 06: Diccionario de Datos (140 descriptores técnicos, ISO 19110)
            ├── licencias.js             # Módulo 07: Régimen jurídico abierto y descarga de matrices Excel (.xlsx)
            ├── manual.js                # Módulo 08: Renderizador interactivo del Manual de Uso y Actualización
            └── indicadores_analisis.js  # Módulo 09: 5 Dimensiones Analíticas y 7 Storyboards de Barrio Brasil
```

---

## 4. Cuadratura del Inventario Cartográfico (131 Capas / 140 Descriptores)

El sistema mantiene una correspondencia estricta entre sus catálogos internos, verificada programáticamente por `scripts/verificar_conteo_capas.py`:

1. **10 Categorías Colaborativas VGI (`cat01` a `cat10`)**:
   Definidas en `src/js/config.js` (`NODO_CONFIG.categorias_osm`).
2. **121 Capas Oficiales del Estado**:
   Definidas en `src/js/modulos/ide_chile.js` (`CAPAS_OFICIALES`), integradas por 23 coberturas institucionales troncales y 98 capas de la Geodatabase Territorial (`bbdd_01` a `bbdd_98`, incluyendo las 13 capas SUBDERE RSD 2024 `bbdd_86` a `bbdd_98`).
3. **131 Capas Operativas en el Visor (`Módulo 00`) y en Indicadores (`Módulo 09`)**:
   $$\text{121 Capas Oficiales} + \text{10 Categorías VGI} = \mathbf{131\text{ Capas}}$$
   En `src/js/modulos/indicadores_analisis.js` (`DIMENSIONES`), las 131 capas se distribuyen sin omisiones ni duplicidades en:
   - Dimensión 01 · Sociodemográfica: `19 capas`
   - Dimensión 02 · Socioeconómica: `18 capas`
   - Dimensión 03 · Socioambiental: `36 capas`
   - Dimensión 04 · Sociosanitaria: `3 capas`
   - Dimensión 05 · Sociourbana o Habitabilidad: `55 capas`
   - Suma total: $19 + 18 + 36 + 3 + 55 = \mathbf{131\text{ capas}}$.
4. **140 Descriptores en el Diccionario de Datos (`Módulo 06`)**:
   Definidos en `src/js/modulos/diccionario.js` (`CATALOGO_DICCIONARIO`), compuestos por las **131 capas geográficas** más **9 tablas de referencia y esquemas normalizados**.

---

## 5. Procedimiento de Integración de Nuevas Coberturas Geográficas (6 Etapas)

### Etapa 1. Normalización Geodésica (`EPSG:4326`)
1. Se verifica que la cobertura espacial se encuentre proyectada en coordenadas geográficas **`EPSG:4326` (WGS84 / SIRGAS-Chile, grados decimales)**. Los archivos `.geojson` consumidos por Leaflet no deben almacenarse en coordenadas planas UTM (`EPSG:32719`).
2. El archivo se exporta en formato `GeoJSON` con codificación `UTF-8` e identificador en minúsculas sin espacios (por ejemplo, `bbdd_99.geojson`).

### Etapa 2. Almacenamiento en Directorios Espejo
El archivo `.geojson` (junto a su archivo `.gpkg` original cuando incorpora metadatos de columnas) se deposita simétricamente en ambas rutas del repositorio:
- `data/bbdd_99.geojson`
- `src/data/bbdd_99.geojson`

### Etapa 3. Registro en el Catálogo Oficial (`src/js/modulos/ide_chile.js`)
Se incorpora el descriptor de la cobertura dentro del objeto `CAPAS_OFICIALES` en `src/js/modulos/ide_chile.js`:

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

### Etapa 4. Incorporación del Control en la Interfaz (`src/index.html`)
En `src/index.html`, se inserta el botón de activación dentro del acordeón temático correspondiente de `#subpanel-ide`, manteniendo la coincidencia exacta entre el atributo `data-capa` y el `id` registrado:

```html
<button type="button" class="chip-oficial" id="btn-oficial-bbdd_99" data-capa="bbdd_99" title="Ilustre Municipalidad de Santiago / MMA">
  <span class="dot-color" style="background:#10b981;"></span>
  <span class="nombre-chip">99. Puntos Limpios y Reciclaje Barrial</span>
  <span class="badge-institucion-chip">MUNISTGO</span>
  <span class="badge-geom-chip">● PUN</span>
</button>
```

### Etapa 5. Asignación Dimensional (`indicadores_analisis.js`) y Catalogación de Atributos (`diccionario.js`)
1. En `src/js/modulos/indicadores_analisis.js`:
   - Se registra el par `'bbdd_99': 'Puntos Limpios y Reciclaje Barrial (BBDD-99)'` en `NOMBRES_OFICIALES_FALLBACK`.
   - Se incorpora el identificador `'bbdd_99'` al arreglo `capasIds` de la dimensión analítica correspondiente en `DIMENSIONES`.
2. En `src/js/modulos/diccionario.js`:
   - Se añade el objeto descriptor de la cobertura junto con la especificación de sus columnas (`atributos`) en `CATALOGO_DICCIONARIO`.

### Etapa 6. Ajuste de Parámetros de Auditoría Automatizada
Cuando la incorporación modifica el número total de coberturas del sistema, se actualiza el umbral esperado en `scripts/verificar_conteo_capas.py` y se ejecuta la batería de validación descrita en la **Sección 8**.

---

## 6. Mantención de Coberturas Existentes, Módulos Analíticos y Normativa

### 6.1. Actualización de Geometrías o Atributos sin Cambio de Identificador
Cuando se actualiza el contenido de una capa existente conservando su nombre de archivo (por ejemplo, `minvu_prc.geojson` o `capa_percepcion.geojson`), basta con sobrescribir el archivo en `data/` y en `src/data/` bajo proyección `EPSG:4326`. El motor del visor procesa las entidades en tiempo real y actualiza automáticamente los cuadros de diálogo y los indicadores de telemetría sin requerir modificaciones en el código fuente.

### 6.2. Extracción de Diccionarios Nativos desde Archivos GeoPackage (`.gpkg`)
En bases de datos distribuidas en formato `.gpkg` que documentan la semántica de sus atributos mediante comentarios SQL en la definición de tabla (como el catastro SUBDERE RSD 2024), la extracción programática del esquema se realiza mediante Python (`sqlite3`):

```python
import sqlite3
con = sqlite3.connect("data/archivo.gpkg")
for name, sql in con.execute("SELECT name, sql FROM sqlite_master WHERE type='table'"):
    if not name.startswith(("gpkg_", "rtree_")):
        print(name, sql)
```

### 6.3. Motor de Cálculo Dinámico del Índice de Calidad VGI (ICV)
La evaluación en tiempo real del subpanel **📊 Métricas** es ejecutada por la función `actualizarTelemetriaCapasActivas()` en `src/js/app.js` (líneas 2549–2745). El algoritmo inspecciona las entidades de las coberturas activas en tres dimensiones:
- **Completitud Espacial y Atributiva**: Proporción de entidades con geometría válida y atributos poblados.
- **Actualidad Reciente**: Identificación automática del período más reciente registrado en los campos temporales y metadatos de las capas encendidas.
- **Atribución Completa**: Proporción de registros con trazabilidad institucional y licencia declarada.

### 6.4. Mantención de Storyboards (`src/js/modulos/indicadores_analisis.js`)
Los 7 Storyboards territoriales se estructuran en la constante `STORYBOARDS` dentro de `src/js/modulos/indicadores_analisis.js`. Cada unidad analítica se compone de las propiedades `id`, `titulo`, `bajada`, `dimensionId`, `dimensionNombre`, `tiempoLectura`, `imagen`, `tags`, `capasRelevantes` y `contenido` (`resumenEjecutivo`, `kpis`, `parrafos`, `graficoComparativo`, `diagramaVisual`, `tablaResumen`, `analisisPorActor` y `apartadoBibliografico`). Al ejecutarse `ModuloIndicadoresAnalisis.inicializar()`, el contenedor `#panel-indicadores` se renderiza dinámicamente a partir de dicha constante.

### 6.5. Mantención del Evaluador Normativo e Historial PRC (`src/js/modulos/evaluador_normativo.js`)
- Las referencias normativas y el enlace al expediente histórico de modificaciones al Plan Regulador Comunal de la Ilustre Municipalidad de Santiago (`https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz`) se definen en la estructura `FUENTES_ORDENANZAS_IPT`.
- Los 10 hitos históricos de modificación normativa incidentes en el Barrio Brasil (1990–2024) se almacenan en el arreglo `HITOS_HISTORICOS_PRC_BRASIL`. Toda incorporación a este arreglo se propaga automáticamente tanto a la vista modal del visor como al Certificado `.txt` descargable.

---

## 7. Protocolo para la Integración de Ajustes Finales (Validación y Cierre Analítico)

Las adecuaciones derivadas de las sesiones finales de validación con usuarios y revisión analítica se integran mediante tres operaciones acotadas:

1. **Refinamiento de terminología o etiquetas de interfaz**: Se edita directamente el texto en `src/index.html`, las denominaciones oficiales en `src/js/modulos/ide_chile.js` o las descripciones de las categorías VGI en `src/js/config.js`.
2. **Incorporación de cartografía participativa validada en talleres**: Los levantamientos consolidados en uMap u OpenStreetMap se exportan en `EPSG:4326` y se actualizan en `data/capa_percepcion.geojson` y `src/data/capa_percepcion.geojson` (`cat10_percepcion`), o bien se integran como nueva cobertura siguiendo la **Sección 5**.
3. **Recalibración de ponderaciones de calidad (WLC / AHP, ISO 19157)**: Los pesos relativos de los criterios se ajustan en `src/js/modulos/evaluador_calidad_cuantitativa.js` y en los umbrales de `actualizarTelemetriaCapasActivas()` (`src/js/app.js`).

---

## 8. Auditoría Automatizada, Control de Caché y Despliegue a Producción

### 8.1. Entorno Local de Pruebas
El despliegue local para verificación en navegador se inicia desde el directorio `src/`:
```bash
python -m http.server 8080
```
El sistema queda disponible en la dirección `http://localhost:8080`.

### 8.2. Control de Versión de Caché (`Cache-Busting`)
Tras modificar archivos `.js` o `.css`, se incrementa el sufijo de versión `?v=...` en las referencias `<link>` y `<script>` de `src/index.html` (por ejemplo, `?v=20261015_v5`), garantizando la invalidación de caché en los navegadores clientes.

### 8.3. Batería de Verificación Pre-Despliegue
Desde la raíz del repositorio (`atlas_vgi_uah`), se ejecutan los tres scripts de auditoría:

```bash
python scripts/verificar_conteo_capas.py
python scripts/verificar_integridad_despliegue.py
python scripts/analisis_metacalidad.py
```

### 8.4. Publicación en Producción (GitHub / Netlify)
Verificado el estado `[OK] EXITO` en los tres controles automatizados, la actualización se envía a la rama principal de producción:

```bash
git add -A
git commit -m "Actualización técnica y documental del Atlas VGI"
git push origin main
```

---

## 9. Matriz de Diagnóstico y Resolución de Incidencias

| Incidencia Observada | Causa Técnica Identificada | Procedimiento de Resolución |
| :--- | :--- | :--- |
| **La cobertura se activa pero no se dibuja sobre el lienzo.** | El archivo `.geojson` fue exportado en coordenadas métricas UTM (`EPSG:32719`) en lugar de grados decimales (`EPSG:4326`). | Reproyectar la cobertura a `EPSG:4326` en QGIS o Python y actualizar el archivo en `data/` y `src/data/`. |
| **Error `404 Not Found` al activar una cobertura en producción.** | El archivo `.geojson` fue copiado únicamente en `data/` y omitido en `src/data/`, o presenta discrepancia de mayúsculas/minúsculas. | Replicar el archivo en `src/data/` verificando correspondencia exacta con el atributo `archivoLocal` en `ide_chile.js`. |
| **Las modificaciones en `.js` o `.css` no se reflejan en el cliente.** | Retención de archivos estáticos previos en la caché del navegador. | Actualizar el parámetro `?v=...` en `src/index.html` y forzar la recarga (`Ctrl + F5`). |
| **Alerta de asimetría en `verificar_integridad_despliegue.py`.** | Diferencia en el número o tamaño de archivos entre `data/` y `src/data/`. | Sincronizar ambos directorios y repetir la ejecución del script verificador. |

---

## 10. Referencias Normativas y Técnicas (Norma APA 7ª Edición)

El repertorio bibliográfico completo del proyecto (125 referencias) se encuentra disponible en [`docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`](docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md):

- Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016). *The GeoJSON Format* (RFC No. 7946). Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC7946
- Infraestructura de Datos Espaciales de Chile [IDE Chile]. (2017). *Marco Técnico y Metodológico para la Evaluación de la Calidad de la Información Geográfica en Chile (Norma ISO 19157)*. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. https://www.ide.cl/
- Infraestructura de Datos Espaciales de Chile [IDE Chile]. (2018). *Perfil Nacional de Metadatos de Chile v2.0 (Basado en ISO 19115:2003 / ISO 19139:2007)*. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. https://www.ide.cl/
- International Organization for Standardization [ISO]. (2013). *Geographic information — Data quality* (ISO Standard No. 19157:2013). ISO. https://www.iso.org/standard/32575.html
- International Organization for Standardization [ISO]. (2014). *Geographic information — Metadata — Part 1: Fundamentals* (ISO Standard No. 19115-1:2014). ISO. https://www.iso.org/standard/53798.html
- International Organization for Standardization [ISO]. (2016). *Geographic information — Methodology for feature cataloguing* (ISO Standard No. 19110:2016). ISO. https://www.iso.org/standard/57303.html
- Snyder, J. P. (1987). *Map projections: A working manual* (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. https://doi.org/10.3133/pp1395
- Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE]. (2024). *Catastro Nacional de Instalaciones de Recepción y Disposición Final de Residuos Sólidos Domiciliarios (RSD) y Diccionario Técnico Geodatabase*. Gobierno de Chile.
