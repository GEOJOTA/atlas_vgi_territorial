# Manual de Uso — Atlas de Información Geográfica Voluntaria
### Guía Operativa para Geógrafos, Analistas y Gestores Territoriales

Este manual describe el funcionamiento de la plataforma web del Atlas VGI y sus herramientas de línea de comandos, orientado a cuatro perfiles territoriales específicos (autoridades, organizaciones vecinales, mapeadores y analistas SIG).

---

## 0. Perfiles de Actor Territorial

En la cabecera de la plataforma encontrarás el selector **"Perfil de Actor Territorial"**, el cual resalta las herramientas clave según tu rol:
1. **🏛️ Perfil Institucional / Autoridades (IDE Chile / Municipios / SECPLAN):** Prioriza la auditoría de capas oficiales (25 capas) frente a brechas VGI (65 capas), metadatos ISO 19139 XML y matrices de equipamiento en Excel.
2. **👥 Perfil Comunitario / Organizaciones Vecinales y Ciudadanía:** Facilita diagnósticos barriales inmediatos con consultas en 1 clic (farmacias, áreas verdes, paraderos, reciclaje), mapeo colaborativo en UMap y toponimia barrial sin jerga técnica.
3. **🧭 Perfil Voluntario / Mapeadores OSM y Ciencia Ciudadana:** Enfocado en la formulación de consultas Overpass QL avanzadas, validación global con **Taginfo API**, auditoría de changesets con **OSMCha** y detección de vacíos de microatributos (`wheelchair`, `surface`, `lit`).
4. **🎓 Perfil Académico / Geógrafos, Analistas SIG e Investigadores:** Proporciona cálculo de densidades territoriales rigurosas mediante reproyección conforme a **EPSG:32719**, métricas de calidad ISO 19157 con **ohsome (v1/v2)**, exportación a GeoJSON para QGIS y 104 fuentes bibliográficas APA 7ª ed.

---

## 1. Visor y Atlas VGI (Panel 00)

El visor cartográfico principal permite consultar e inspeccionar espacialmente el territorio de estudio en tiempo real.

### 1.1 Selección de territorio y encuadre
- **Selector de Territorio:** En la barra superior puedes alternar entre:
  - *Barrio Brasil — Manzana UAH (Santiago Centro)* (predeterminado).
  - *Barrio Brasil Completo (hasta Plaza Brasil)*.
  - *Santiago Centro (Casco Cívico)*
- **Botón "Encuadrar":** Restablece la vista del mapa centrando el área seleccionada.

### 1.2 Herramienta "Dibujar Bbox" (Área personalizada)
1. Haz clic en el botón **"📐 Dibujar Bbox"** en la barra de herramientas.
2. Haz clic sobre el mapa en una esquina del área deseada y arrastra el cursor sin soltar hasta la esquina opuesta.
3. Al soltar el ratón, se dibujará el rectángulo punteado y se actualizarán automáticamente las coordenadas numéricas en todos los paneles de la plataforma.

### 1.3 Activación de Capas Temáticas VGI
Debajo del mapa encontrarás la botonera con las 8 categorías territoriales:
- 🎓 **CAT-01: Educación y Universidad** (Campus UAH, facultades, bibliotecas)
- 🏪 **CAT-02: Servicios y Comercio** (locales comerciales, farmacias, bancos)
- 🚌 **CAT-03: Movilidad y Transporte** (Metro Los Héroes, paraderos Red)
- 🚲 **CAT-04: Movilidad Activa** (ciclovías, ciclobandas, estacionamiento de bicicletas)
- 🌳 **CAT-05: Áreas Verdes y Plazas** (Plaza Brasil, juegos, bandejones)
- 🏛️ **CAT-06: Patrimonio y Cultura** (casonas Zona Típica, teatros, iglesias)
- ♿ **CAT-07: Accesibilidad Universal** (rebajes de cordón, cruces accesibles)
- 🌿 **CAT-08: Biodiversidad Urbana** (arbolado urbano OSM + observaciones biológicas GBIF)

**Interacción:**
- Haz clic en cualquier botón de categoría para consultar en vivo y cargar los elementos en el mapa.
- Al activarse, se muestra el recuento de entidades en el botón.
- Haz clic sobre cualquier punto o polígono en el mapa para abrir el **popup informativo** con nombre, subtipo, operador, dirección, accesibilidad, fuente y licencia legal.
- Si vuelves a hacer clic en el botón de una capa activa, se oculta del mapa.

### 1.4 Exportación a GeoJSON (para QGIS o ArcGIS)
- Haz clic en **"📥 Exportar GeoJSON"** en la barra superior.
- Se descargará un archivo `.geojson` con todas las capas actualmente visibles, con geometrías en coordenadas EPSG:4326 y atributos normalizados, listo para arrastrar y soltar en QGIS.

---

## 2. Consultas y Explorador OSM con Taginfo (Panel 01)

Permite realizar consultas Overpass QL específicas para usuarios que conocen etiquetas OSM o desean explorar una sola categoría con mayor nivel de detalle tabular:
1. Define o confirma las cuatro coordenadas del Bounding Box.
2. Selecciona una categoría sugerida en el desplegable o escribe una clave/valor manual (ej: `amenity=pharmacy`, `building=yes`).
3. **Validador Taginfo API:** Pulsa el botón `[⚡ Validar en Taginfo]` para auditar el volumen global de nodos, vías, relaciones y valores más frecuentes en la base planetaria de OpenStreetMap.
4. Haz clic en **"🚀 Ejecutar y Mapear"** para ver la tabla resumen y proyectarla sobre el mapa Leaflet.

---

## 3. Calidad de Datos, OQT y Control de Cambios con OSMCha (Panel 02)

Permite auditar cuantitativamente la madurez de la información en el sector y validar la integridad de las contribuciones:
- **Submódulo A (ohsome API Dual v1 / v2 & OQT):** Conteo de elementos vigentes, densidad métrica por km² y serie cronológica anual de colaboradores y ediciones. Estimación intrínseca del *Índice de Saturación de Mapeo* y clasificación de la tendencia espacial (levantamiento activo vs. consolidación).
- **Submódulo B (Control de Cambios y Validación con OSMCha):** Permite inspeccionar las ediciones recientes en el Bbox barrial o buscar un Changeset específico por su ID numérico. Evalúa reglas heurísticas de calidad (volumen de modificaciones, comentarios de edición, herramientas de mapeo como JOSM o StreetComplete) con enlaces de validación directa a `osmcha.org`.

---

## 4. Biodiversidad Urbana con GBIF y Ciencia Ciudadana (Panel 03)

Permite explorar avistamientos de flora y fauna procedentes de instituciones científicas y plataformas ciudadanas como iNaturalist:
- **Autocompletado Taxonómico (Species API):** Al escribir en el buscador se despliegan sugerencias científicas y su rango taxonómico en tiempo real.
- **Banderas de Calidad Darwin Core:** La tabla de ocurrencias incluye la columna *Validación Darwin Core (Issues)*, verificando la consistencia geodésica de las coordenadas.
- Haz clic en **"Cargar al Mapa Atlas"** para desplegar los puntos biológicos junto con la infraestructura urbana.

---

## 5. Modelamiento 3D, Fotogrametría y Teledetección VGI (Panel 04)

Permite analizar la tercera dimensión y la resolución fotogramétrica del territorio combinando datos vectoriales y sensores remotos:
- **Submódulo A (Visualizador Axonométrico 3D de Edificaciones):** Proyección cartesiana en tiempo real de las huellas de edificios sobre canvas interactivo (estética *backrooms* sobria). Las alturas se derivan del estándar `building:levels` (*3.2 m de entrepiso estándar), `height` y cubiertas (`roof:shape`). Controles de rotación en 45°, inclinación y factor de exageración vertical Z.
- **Submódulo B (Fotogrametría y Nivel de Calle con Mapillary API v4):** Consulta de secuencias fotográficas a nivel de calle con orientación de compás, altitud geodésica y enlace al visor 3D oficial basado en Structure-from-Motion (OpenSfM).
- **Submódulo C (Teledetección y Drones con OpenAerialMap):** Catálogo federado de ortomosaicos aéreos con especificación de Ground Sample Distance (GSD cm/píxel), plataforma UAV, sensor y servicios de teselas TMS para superposición directa.

---

## 6. Cartografía Temática Comunitaria con UMap (Panel 05)

Visualiza iniciativas cartográficas vecinales y colectivas desarrolladas en UMap:
- Selector de proyectos colaborativos predefinidos (casonas patrimoniales, ciclovías, huertos urbanos).
- Carga de proyectos externos mediante URL pública.
- Exportación directa de capas vectoriales GeoJSON comunitarias.

---

## 7. Fichas de Metadatos Estandarizadas (Panel 06)

Permite generar la documentación técnica oficial del catastro territorial:
1. Haz clic en **"Prellenar con datos de la última consulta"** para autocompletar el título, Bbox y linaje a partir del área de trabajo.
2. Ajusta el resumen, sistema de referencia (EPSG:4326 / EPSG:32719) o datos de contacto si lo requieres.
3. Para exportar la ficha, dispones de dos formatos oficiales:
   - **"📄 Exportar JSON (ISO 19115)":** Ficha estructurada en JSON según los elementos núcleo de ISO 19115.
   - **"🏛️ Exportar XML (ISO 19139 / IDE Chile)":** Archivo XML válido compatible con catálogos de datos como GeoNetwork, GeoNode o el Sistema Nacional de Información Territorial (SNIT / IDE Chile).

---

## 8. Diccionario Territorial de 110 Descriptores (Panel 07)

Permite consultar la definición toponímica y la homología institucional de cada etiqueta con alcance nacional:
- **Sinceramiento riguroso:** Distinción explícita entre 36 capas oficiales con soporte fiscal en IDE Chile vs. 74 Brechas VGI no catastradas por el Estado.
- **Filtros de un clic:** Alterna rápidamente entre `[⚡ Solo Brechas VGI (74)]` y `[🏛️ Capas Oficiales IDE (36)]`.
- **Inspección Taginfo:** Cada tarjeta incluye botón de telemetría directa con la API oficial de Taginfo.

---

## 9. Catálogos Oficiales en Excel (.xlsx) y Licencias (Panel 08)

En la carpeta `docs/` y `src/docs/` del repositorio se encuentran disponibles los tres libros de cálculo listos para anexar al informe formal de práctica:
- **`docs/categorias_tematicas_osm.xlsx`:** Matriz integral de 4 hojas (Categorías Maestras, Catálogo Chile de 110 descriptores escalables, Perfil de 14 Atributos VGI y 104 Citas Bibliográficas APA 7ª ed.).
- **`docs/catalogo_fuentes_vgi.xlsx`:** Matriz analítica de 12 fuentes/servicios (Hoja 1) e inventario técnico de 13 endpoints de APIs (Hoja 2, incluyendo Mapillary v4 y OpenAerialMap).
- **`docs/perfil_metadatos_vgi.xlsx`:** Estructura de campos y equivalencias con el estándar nacional chileno (IDE Chile).

---

## 10. Manual de Uso y Documentación Oficial (Panel 09)

Módulo in-app con el compendio metodológico, justificación geodésica EPSG:32719, marco jurídico de datos abiertos en Chile y repositorio Git.

---

## 8. Extracción Automatizada por Terminal (Python CLI)

Para usuarios técnicos o geógrafos que requieran procesar por lotes sin abrir el navegador:

```bash
# Ejecutar extractor integral para Barrio Brasil / UAH:
python3 scripts/extractor_vgi.py --categoria todas

# Archivos generados en data/:
# - data/capa_educacion.geojson
# - data/capa_servicios.geojson
# - data/capa_transporte.geojson
# - data/capa_movilidad_activa.geojson
# - data/capa_espacio_publico.geojson
# - data/capa_patrimonio.geojson
# - data/capa_accesibilidad.geojson
# - data/capa_biodiversidad.geojson
# - data/atlas_vgi_barrio_brasil_uah_completo.geojson
# - data/resumen_catastro_vgi.csv
```

---

## 8. Preguntas Frecuentes

**¿Se requiere conexión a Internet para usar el visor?**
Sí, para las consultas en vivo a las APIs públicas de Overpass, ohsome y GBIF, así como para la carga de teselas del mapa base. Los datos previamente exportados a `data/` o descargados en GeoJSON pueden utilizarse de forma 100% desconectada en QGIS.

**¿Puedo usar el visor para otra comuna de Chile?**
Sí. Puedes seleccionar comunas precargadas en el menú o dibujar libremente un Bbox sobre cualquier lugar de Chile. Todo el flujo de consulta, métricas y metadatos se adaptará al nuevo cuadrante geográfico.
