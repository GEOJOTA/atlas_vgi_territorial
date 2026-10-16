# Manual de Actualización y Mantención Técnica — Atlas de Información Geográfica Voluntaria (Atlas VGI · UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Versión de Arquitectura Consolidada:** 131 Capas Operativas (121 Oficiales + 10 VGI) · 140 Descriptores en Diccionario · 10 Módulos (`00` al `09`) · 7 Storyboards Territoriales.

---

## 1. Alcance del Documento

Este documento establece el protocolo técnico completo para modificar, actualizar, ampliar y desplegar el **Atlas de Información Geográfica Voluntaria (`atlas_vgi_uah`)** sin requerir conocimiento previo del desarrollo del proyecto.

La arquitectura actual constituye la estructura definitiva de la plataforma; las etapas finales del proyecto (incorporación de resultados de validación por usuarios y ajustes analíticos puntuales) se integran directamente sobre esta estructura siguiendo los procedimientos descritos en la **Sección 7**.

---

## 2. Principios de Arquitectura del Sistema

1. **Arquitectura Estática Autónoma (HTML5 + CSS3 + Vanilla JavaScript ES6+)**:
   El sistema opera íntegramente en el navegador del cliente mediante **Leaflet 1.9** (cartografía 2D), **Turf / Geodesia propia** (`EPSG:4326` y `EPSG:32719`) y conexiones directas vía `fetch` a servicios abiertos (**Overpass API**, **ohsome API**, **GBIF API**). No depende de servidores de mapas de pago ni motores de bases de datos propietarios, garantizando su continuidad operativa en alojamientos estáticos (**Netlify** / **GitHub Pages**).

2. **Sincronización Espejo entre Raíz y Directorio de Publicación (`src/`)**:
   El archivo `netlify.toml` define `publish = "src"` como directorio público de producción, mientras que los scripts de control y auditoría operan desde la raíz del repositorio:
   - Todo archivo de datos incorporado o modificado en `data/` debe replicarse de forma idéntica en `src/data/`.
   - Todo documento actualizado en `docs/` debe replicarse en `src/docs/`.

3. **Almacenamiento Cartográfico Dual (`.geojson` + `.gpkg`)**:
   - **Renderizado Web (`.geojson`)**: Las 131 capas visualizables en el navegador se almacenan en formato `GeoJSON` bajo el sistema de coordenadas geográficas **`EPSG:4326` (WGS84 / SIRGAS-Chile)**.
   - **Persistencia de Metadatos de Columnas (`.gpkg`)**: Para bases de datos que incluyen diccionarios técnicos nativos en comentarios de columnas SQLite —como las **13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios (SUBDERE 2024, `bbdd_86` a `bbdd_98`)**—, se conservan los archivos originales `.gpkg` junto a sus `.geojson` en `data/` y `src/data/`.

---

## 3. Estructura de Directorios y Archivos Clave

```text
atlas_vgi_uah/
├── netlify.toml                         # Configuración de despliegue en producción (publish = "src")
├── README.md                            # Documentación general del repositorio
├── MANUAL_USO.md                        # Manual de Uso del sistema (espejado en docs/ y src/docs/)
├── MANUAL_ACTUALIZACION_ATLAS.md        # Manual de Actualización Técnica (espejado en docs/ y src/docs/)
├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md  # Síntesis de comandos de verificación pre-despliegue
│
├── data/                                # Repositorio de datos raíz (espejo exacto de src/data/)
│   ├── *.geojson                        # 131 capas vectoriales en EPSG:4326
│   ├── *.gpkg                           # Geodatabases originales con metadatos nativos de columnas (SUBDERE RSD)
│   └── reporte_metacalidad_vgi.json     # Reporte cuantitativo ISO 19157 generado por script
│
├── docs/                                # Documentación técnica y paquetes descargables (espejo de src/docs/)
│   ├── ARQUITECTURA.md
│   ├── MANUAL_USO.md
│   └── MANUAL_ACTUALIZACION_ATLAS.md
│
├── scripts/                             # Scripts Python de auditoría e integración automatizada
│   ├── verificar_conteo_capas.py        # Audita la paridad de 131 capas y 140 descriptores entre módulos
│   ├── verificar_integridad_despliegue.py # Valida existencia, sintaxis JSON y sincronización data/ <-> src/data/
│   ├── analisis_metacalidad.py          # Calcula métricas ISO 19157 sobre los GeoJSON locales
│   └── integrar_nuevas_bbdd.py          # Utilidad de reproyección e integración por lotes
│
└── src/                                 # DIRECTORIO PUBLICADO EN PRODUCCIÓN WEB
    ├── index.html                       # Interfaz única: barra de 10 módulos (00-09), visor y subpaneles
    ├── data/                            # Espejo exacto de data/ servido al navegador
    ├── docs/                            # Espejo exacto de docs/ servido al navegador
    ├── css/
    │   └── estilos.css                  # Hoja de estilos general de la plataforma
    └── js/
        ├── config.js                    # Coordenadas base, Bbox, 10 categorías VGI (NODO_CONFIG) y comunas RM
        ├── app.js                       # Controlador central, eventos de mapa, recorte espacial e ICV dinámico
        └── modulos/
            ├── ide_chile.js             # Catálogo maestro de las 121 capas oficiales (CAPAS_OFICIALES)
            ├── evaluador_normativo.js   # Inspector Normativo PRC/OGUC, Certificado CIN-VGI e historial PRC (1990-2024)
            ├── osm.js                   # Módulo 01: Consultas Overpass QL a OpenStreetMap
            ├── ohsome.js                # Módulo 02: Series históricas ohsome API (HeiGIT) y validación OSMCha
            ├── evaluador_calidad_cuantitativa.js # Módulo 02: Matriz WLC e índice cuantitativo ISO 19157
            ├── gbif.js                  # Módulo 03: Registros biológicos GBIF / iNaturalist
            ├── umap.js                  # Módulo 04: Integración de lienzos participativos uMap
            ├── metadatos.js             # Módulo 05: Generador y exportador XML/JSON ISO 19115 / 19139
            ├── diccionario.js           # Módulo 06: Diccionario de Datos (140 descriptores técnicos)
            ├── licencias.js             # Módulo 07: Licenciamiento abierto y descarga de matrices Excel (.xlsx)
            ├── manual.js                # Módulo 08: Renderizador interactivo de Manual de Uso y Actualización
            └── indicadores_analisis.js  # Módulo 09: 5 Dimensiones Analíticas y 7 Storyboards de Barrio Brasil
```

---

## 4. Inventario y Cuadratura de Capas (131 Capas / 140 Descriptores)

El sistema mantiene una paridad estricta entre sus módulos, auditada por `scripts/verificar_conteo_capas.py`:

1. **10 Categorías Colaborativas VGI (`cat01` a `cat10`)**:
   Definidas en `src/js/config.js` (`NODO_CONFIG.categorias_osm`).
2. **121 Capas Oficiales del Estado**:
   Definidas en `src/js/modulos/ide_chile.js` (`CAPAS_OFICIALES`), compuestas por 23 capas institucionales troncales y 98 capas de la Geodatabase Territorial (`bbdd_01` a `bbdd_98`, incluyendo las 13 capas SUBDERE RSD 2024 `bbdd_86` a `bbdd_98`).
3. **131 Capas Operativas en Visor (`Módulo 00`) e Indicadores (`Módulo 09`)**:
   $$\text{121 Capas Oficiales} + \text{10 Categorías VGI} = \mathbf{131\text{ Capas}}$$
   En `src/js/modulos/indicadores_analisis.js` (`DIMENSIONES`), las 131 capas se distribuyen exactamente en:
   - Dimensión 01 · Sociodemográfica: `19 capas`
   - Dimensión 02 · Socioeconómica: `18 capas`
   - Dimensión 03 · Socioambiental: `36 capas`
   - Dimensión 04 · Sociosanitaria: `3 capas`
   - Dimensión 05 · Sociourbana o Habitabilidad: `55 capas`
   - Total: $19 + 18 + 36 + 3 + 55 = \mathbf{131\text{ capas}}$.
4. **140 Descriptores en el Diccionario de Datos (`Módulo 06`)**:
   Definidos en `src/js/modulos/diccionario.js` (`CATALOGO_DICCIONARIO`): corresponden a las **131 capas geográficas** más **9 tablas de referencia y esquemas normalizados**.

---

## 5. Procedimiento para Integrar una Nueva Capa Geográfica (6 Pasos)

### Paso 1. Normalización Cartográfica (`EPSG:4326`)
1. Verifique que la capa se encuentre proyectada en coordenadas geográficas **`EPSG:4326` (WGS84 / SIRGAS-Chile, grados decimales)**. No utilice coordenadas métricas UTM (`EPSG:32719`) en los archivos `.geojson` servidos a Leaflet.
2. Exporte el archivo en formato `GeoJSON` con codificación `UTF-8` y nombre en minúsculas sin espacios (ejemplo: `bbdd_99.geojson`).

### Paso 2. Almacenamiento en Directorios Espejo
Copie el archivo `.geojson` (y su `.gpkg` original si dispone de metadatos de columnas) en ambas rutas:
- `data/bbdd_99.geojson`
- `src/data/bbdd_99.geojson`

### Paso 3. Registro en el Catálogo Oficial (`src/js/modulos/ide_chile.js`)
Agregue la definición de la capa dentro del objeto `CAPAS_OFICIALES` en `src/js/modulos/ide_chile.js`:

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
    descripcion: 'Catastro georreferenciado de puntos de reciclaje en el Barrio Brasil.'
  },
```

### Paso 4. Incorporación del Control en la Interfaz (`src/index.html`)
En `src/index.html`, ubique el acordeón temático correspondiente dentro del subpanel `#subpanel-ide` e inserte el botón con el atributo `data-capa` idéntico al `id` registrado:

```html
<button type="button" class="chip-oficial" id="btn-oficial-bbdd_99" data-capa="bbdd_99" title="Ilustre Municipalidad de Santiago / MMA">
  <span class="dot-color" style="background:#10b981;"></span>
  <span class="nombre-chip">99. Puntos Limpios y Reciclaje Barrial</span>
  <span class="badge-institucion-chip">MUNISTGO</span>
  <span class="badge-geom-chip">● PUN</span>
</button>
```

### Paso 5. Asignación Dimensional (`indicadores_analisis.js`) y Documentación de Atributos (`diccionario.js`)
1. En `src/js/modulos/indicadores_analisis.js`:
   - Añada `'bbdd_99': 'Puntos Limpios y Reciclaje Barrial (BBDD-99)'` en `NOMBRES_OFICIALES_FALLBACK`.
   - Añada `'bbdd_99'` al arreglo `capasIds` de la dimensión correspondiente en `DIMENSIONES`.
2. En `src/js/modulos/diccionario.js`:
   - Añada el descriptor de la capa y el listado de sus columnas (`atributos`) en el arreglo `CATALOGO_DICCIONARIO`.

### Paso 6. Actualización de Contadores en el Script de Auditoría
Si el número total de capas cambia (por ejemplo, de 131 a 132), actualice la constante de validación en `scripts/verificar_conteo_capas.py` y ejecute la verificación (Sección 8).

---

## 6. Actualización de Capas Existentes, Módulos Analíticos y Normativa

### 6.1. Reemplazo de Geometrías o Atributos en Capas Existentes
Si actualiza los datos de una capa manteniendo su nombre de archivo (por ejemplo, `minvu_prc.geojson` o `capa_percepcion.geojson`):
1. Sobrescriba el archivo en `data/` y en `src/data/` en formato `EPSG:4326`.
2. No se requiere modificar código JavaScript: el visor lee las entidades en tiempo real y actualiza los popups y métricas automáticamente.

### 6.2. Extracción de Diccionarios de Columnas desde Archivos GeoPackage (`.gpkg`)
Cuando una institución pública entrega bases en formato `.gpkg` con descripciones técnicas almacenadas en la definición SQL de la tabla (como las 13 capas SUBDERE RSD 2024), puede extraer dichos descriptores ejecutando en Python:

```python
import sqlite3
con = sqlite3.connect("data/archivo.gpkg")
for name, sql in con.execute("SELECT name, sql FROM sqlite_master WHERE type='table'"):
    if not name.startswith(("gpkg_", "rtree_")):
        print(name, sql)
```

### 6.3. Cálculo Dinámico del Índice de Calidad VGI (ICV)
El cálculo en vivo del panel **📊 Métricas** reside en la función `actualizarTelemetriaCapasActivas()` dentro de `src/js/app.js` (líneas 2549–2745). Evalúa dinámicamente cada entidad de las capas activas en tres dimensiones:
- **Completitud Espacial y Atributiva**: Proporción de entidades con geometría válida y campos no nulos.
- **Actualidad Reciente**: Detección automática del año/trimestre más reciente en los atributos temporales y metadatos de las capas activas.
- **Atribución Completa**: Proporción de registros con trazabilidad institucional y licencia definida.

### 6.4. Edición de Storyboards (`src/js/modulos/indicadores_analisis.js`)
Los 7 Storyboards se definen en el arreglo `STORYBOARDS` de `src/js/modulos/indicadores_analisis.js`. Para editar textos, cifras o agregar un nuevo storyboard, modifique o agregue un objeto con las propiedades: `id`, `titulo`, `bajada`, `dimensionId`, `dimensionNombre`, `tiempoLectura`, `imagen`, `tags`, `capasRelevantes` y `contenido` (`resumenEjecutivo`, `kpis`, `parrafos`, `graficoComparativo`, `diagramaVisual`, `tablaResumen`, `analisisPorActor` y `apartadoBibliografico`).
- *Nota de sincronización con `src/index.html`*: Dado que `#panel-indicadores` se re-renderiza dinámicamente al ejecutarse `ModuloIndicadoresAnalisis.inicializar()`, cualquier cambio en `STORYBOARDS` o `DIMENSIONES` se refleja automáticamente en la interfaz al cargar la página.

### 6.5. Actualización del Evaluador Normativo e Historial PRC (`src/js/modulos/evaluador_normativo.js`)
- Las fuentes oficiales y el vínculo al expediente histórico de modificaciones al PRC de la Municipalidad de Santiago (`https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz`) se encuentran en la constante `FUENTES_ORDENANZAS_IPT`.
- Los 10 hitos históricos de modificación normativa del Barrio Brasil (1990–2024) se almacenan en `HITOS_HISTORICOS_PRC_BRASIL`. Cualquier nuevo decreto o enmienda añadido a este arreglo se incorpora automáticamente tanto al modal interactivo del mapa como al Certificado descargable `.txt`.

---

## 7. Integración de Ajustes Finales (Análisis y Validación por Usuarios)

Para incorporar los ajustes menores derivados de las sesiones de validación con usuarios y cierres analíticos:

1. **Ajustes de terminología o etiquetas de interfaz**: Edite los encabezados en `src/index.html`, los nombres de capas oficiales en `src/js/modulos/ide_chile.js` o las categorías VGI en `src/js/config.js`.
2. **Incorporación de levantamientos participativos validados en talleres**: Exporte los registros de uMap/OSM en `EPSG:4326` y actualice `data/capa_percepcion.geojson` y `src/data/capa_percepcion.geojson` (`cat10_percepcion`), o integre una nueva capa según la Sección 5.
3. **Ajuste de ponderaciones de calidad (WLC / ISO 19157)**: Modifique los pesos de los criterios en `src/js/modulos/evaluador_calidad_cuantitativa.js` o los umbrales de clasificación en `actualizarTelemetriaCapasActivas()` (`src/js/app.js`).

---

## 8. Verificación, Control de Caché y Despliegue a Producción

### 8.1. Ejecución en Servidor Local de Desarrollo
Desde la carpeta `src/`, ejecute:
```bash
python -m http.server 8080
```
Y acceda en el navegador a `http://localhost:8080`.

### 8.2. Actualización de Versión de Caché (`Cache-Busting`)
Al modificar archivos `.js` o `.css`, actualice el parámetro de versión `?v=...` en las etiquetas `<link>` y `<script>` de `src/index.html` (por ejemplo, `?v=20261015_v4`) para asegurar que los navegadores descarguen la versión más reciente.

### 8.3. Batería de Verificación Pre-Despliegue
Desde la raíz del repositorio (`atlas_vgi_uah`), ejecute los tres scripts de validación:

```bash
python scripts/verificar_conteo_capas.py
python scripts/verificar_integridad_despliegue.py
python scripts/analisis_metacalidad.py
```

### 8.4. Publicación en Producción (GitHub / Netlify)
Confirmado el estado `[OK] EXITO` en los tres verificadores, publique los cambios en la rama principal:

```bash
git add -A
git commit -m "Actualización técnica y documental del Atlas VGI"
git push origin main
```

---

## 9. Diagnóstico y Resolución de Problemas Frecuentes

| Síntoma Detectado | Causa Técnica | Solución |
| :--- | :--- | :--- |
| **Una capa se activa pero no se visualiza en el mapa.** | Geometrías exportadas en coordenadas métricas UTM (`EPSG:32719`) en lugar de grados decimales (`EPSG:4326`). | Reproyectar la capa a `EPSG:4326` en QGIS o Python y actualizar el `.geojson` en `data/` y `src/data/`. |
| **Error `404 Not Found` al activar una capa en producción.** | El archivo `.geojson` fue copiado en `data/` pero falta en `src/data/`, o difiere en mayúsculas/minúsculas. | Copiar el archivo en `src/data/` verificando coincidencia exacta con la propiedad `archivoLocal` en `ide_chile.js`. |
| **Cambios en archivos `.js` o `.css` no se reflejan en el navegador.** | Almacenamiento en caché del navegador cliente. | Actualizar el sufijo `?v=...` en `src/index.html` y recargar con `Ctrl + F5`. |
| **Fallo en `verificar_integridad_despliegue.py` por asimetría.** | Diferencia de archivos entre `data/` y `src/data/`. | Sincronizar ambos directorios y re-ejecutar el verificador. |
