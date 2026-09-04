# Manual de Uso — Atlas de Información Geográfica Voluntaria
### Guía Operativa para Geógrafos, Analistas y Gestores Territoriales

Este manual describe el funcionamiento de la plataforma web del Atlas VGI y sus herramientas de línea de comandos, orientado tanto a personas con conocimientos SIG como a usuarios territoriales no técnicos.

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

## 2. Explorador OSM por Etiquetas (Panel 01)

Permite realizar consultas Overpass QL específicas para usuarios que conocen etiquetas OSM o desean explorar una sola categoría con mayor nivel de detalle tabular:
1. Define o confirma las cuatro coordenadas del Bounding Box.
2. Selecciona una categoría sugerida en el desplegable o escribe una etiqueta manual (ej: `amenity=pharmacy`, `building=yes`).
3. Haz clic en **"Consultar Overpass"** para ver la tabla resumen, o en **"Visualizar en Mapa Atlas"** para proyectarla sobre el mapa Leaflet.

---

## 3. Calidad de Datos con ohsome (Panel 02)

Permite auditar cuantitativamente la madurez de la información en el sector:
- **Elementos vigentes:** Total de geometrías coincidentes con el filtro.
- **Densidad:** Número de elementos por km² calculados sobre el Bbox.
- **Colaboradores únicos:** Cantidad de personas distintas que han editado el área en el último año.
- **Evolución Histórica (5 años):** Tabla con la serie temporal anual que permite verificar si el territorio sigue siendo editado activamente o si quedó abandonado.

---

## 4. Biodiversidad con GBIF y Ciencia Ciudadana (Panel 03)

Permite explorar avistamientos de flora y fauna procedentes de instituciones científicas y plataformas ciudadanas como iNaturalist:
- Permite filtrar por taxón o nombre común (ej: *Puma concolor*, *Zonotrichia capensis*, *Aves*).
- Haz clic en **"Cargar al Mapa Atlas"** para desplegar los puntos biológicos junto con la infraestructura urbana.

---

## 5. Fichas de Metadatos Estandarizadas (Panel 05)

Permite generar la documentación técnica oficial del catastro territorial:
1. Haz clic en **"Prellenar con datos de la última consulta"** para autocompletar el título, Bbox y linaje a partir del área de trabajo.
2. Ajusta el resumen, sistema de referencia o datos de contacto si lo requieres.
3. Para exportar la ficha, dispones de dos formatos oficiales:
   - **"📄 Exportar JSON (ISO 19115)":** Ficha estructurada en JSON según los elementos núcleo de ISO 19115.
   - **"🏛️ Exportar XML (ISO 19139 / IDE Chile)":** Archivo XML válido compatible con catálogos de datos como GeoNetwork, GeoNode o el Sistema Nacional de Información Territorial (SNIT / IDE Chile).

---

## 6. Catálogos Oficiales en Excel (.xlsx) (Panel 06)

En la carpeta `docs/` del repositorio se encuentran disponibles tres libros de cálculo listos para anexar al informe formal de práctica:
- **`docs/catalogo_fuentes_vgi.xlsx`:** Matriz analítica de fuentes VGI y oficiales.
- **`docs/perfil_metadatos_vgi.xlsx`:** Estructura de campos y equivalencias con el estándar nacional chileno.
- **`docs/categorias_tematicas_osm.xlsx`:** Taxonomía de 8 categorías, filtros Overpass QL y diccionario de datos.

---

## 7. Extracción Automatizada por Terminal (Python CLI)

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
