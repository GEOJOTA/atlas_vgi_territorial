# Bitácora de continuidad

Este archivo existe para que quien retome el proyecto —humano o modelo de
lenguaje— no tenga que reconstruir las decisiones desde cero leyendo todo
el código. Está escrito como una entrega de turno, no como documentación
formal.

---

## Entrega de turno 2 — Septiembre 2026 (Profundización y Operacionalización Barrio Brasil / UAH)

### Estado alcanzado en este turno

1. **Visor Cartográfico Real en Leaflet (1.9.4):**
   - Se reemplazó la interfaz puramente tabular por un visor interactivo integrado (`src/js/modulos/mapa.js`) con capas base gratuitas (Carto Positron, OpenStreetMap Estándar, OpenTopoMap) y la paleta editorial de carta topográfica/libreta de campo definida en `src/css/estilos.css`.
   - Incluye herramienta para **dibujar el Bounding Box** directamente en el mapa haciendo clic y arrastre, sincronizando bidireccionalmente los valores numéricos con todos los paneles (`osm`, `oh`, `gbif`, `md`).
   - Botón directo para **exportar todas las capas activas a GeoJSON**, listo para abrir en QGIS.

2. **Foco Territorial: Barrio Brasil y Universidad Alberto Hurtado (UAH):**
   - Territorio principal predeterminado fijado en `[-70.6675, -33.4505, -70.6565, -33.4385]` (Santiago Centro, Chile), cubriendo el campus patrimonial de la UAH (calles Almirante Barroso, Erasmo Escala, Cienfuegos, Metro Los Héroes) y el sector tradicional de Plaza Brasil.
   - Selector rápido con territorios preconfigurados (Manzana UAH, Barrio Brasil ampliado, Santiago Centro cívico, Providencia, Lo Barnechea).

3. **8 Categorías Temáticas VGI Operativas (basadas en OSM):**
   - Implementadas en `src/js/modulos/osm.js` y en la botonera interactiva del mapa:
     - 🎓 CAT-01: Educación y Universidad (UAH, facultades, bibliotecas)
     - 🏪 CAT-02: Servicios, Comercio y Abastecimiento
     - 🚌 CAT-03: Movilidad y Transporte Público (Metro Los Héroes/Santa Ana, paraderos)
     - 🚲 CAT-04: Movilidad Activa y Ciclovías (calles Rosas, Brasil, biciestacionamientos)
     - 🌳 CAT-05: Áreas Verdes y Plazas (Plaza Brasil, bandejones)
     - 🏛️ CAT-06: Patrimonio y Cultura (Zona Típica, casonas patrimoniales, Basílica del Salvador)
     - ♿ CAT-07: Accesibilidad Universal (rebajes de cordón, cruces, veredas)
     - 🌿 CAT-08: Biodiversidad Urbana (arbolado OSM + observaciones GBIF/iNaturalist)

4. **Verificación y robustecimiento de APIs en vivo:**
   - **Overpass API**: soporte de servidores espejo (`overpass-api.de`, `lz4.overpass-api.de`, `z.overpass-api.de`) con fallback automático y conversor de geometrías a GeoJSON FeatureCollection.
   - **ohsome API (HeiGIT)**: se agregó detección de `toTimestamp` mediante `/metadata` para evitar errores 400 por fechas futuras, calculando series anuales exactas de 5 años hacia atrás.
   - **GBIF Occurrence API**: consulta por rangos de latitud/longitud en Bbox, normalización taxonómica y renderizado directo en el mapa como GeoJSON.
   - **Ruta de config.json**: corregida para soportar tanto servidor desde raíz como desde `src/` (se creó copia espejo en `src/config/config.json` y carga multiruta en `src/js/config.js`).

5. **Documentos Oficiales en Formato Excel (.xlsx):**
   - Generados mediante script Python `scripts/generar_catalogos_excel.py` (usando `openpyxl`) y guardados en `docs/`:
     - `docs/catalogo_fuentes_vgi.xlsx`: matriz de fuentes (OSM, ohsome, GBIF, UMap, iNaturalist, IDE Chile).
     - `docs/perfil_metadatos_vgi.xlsx`: campos núcleo ISO 19115 y perfil IDE Chile / SNIT.
     - `docs/categorias_tematicas_osm.xlsx`: taxonomía de 8 categorías, filtros Overpass y diccionario de datos normalizado.

6. **Metadatos Duales ISO 19115 (JSON) e ISO 19139 (XML para IDE Chile):**
   - El módulo `metadatos.js` ahora genera tanto el JSON núcleo como el documento XML conforme al esquema oficial de IDE Chile / GeoNetwork (`<gmd:MD_Metadata>`), descargables directamente con un clic.

7. **Pipeline CLI para Geógrafos (`scripts/extractor_vgi.py`):**
   - Herramienta en Python 3 estándar (sin dependencias externas) que permite a geógrafos descargar y exportar cualquier categoría territorial en archivos GeoJSON y un archivo consolidado `data/resumen_catastro_vgi.csv` con atributos normalizados.

8. **Automatización Git (`scripts/deploy_git.sh`):**
   - Script con permisos de ejecución para inicializar el repositorio, configurar el autor `GEOJOTA <juanpablolescanovillegas@gmail.com>`, commitear y preparar la sincronización con GitHub.

### Decisiones tomadas en este turno por indicación del usuario
- Se pospuso temporalmente el cálculo de índices sintéticos de cobertura y el manual de actualización a 6 meses.
- Se priorizó el caso específico de Barrio Brasil y la Universidad Alberto Hurtado.

---

## Entrega de turno 1 (Estado inicial previo)

Hay un prototipo funcional de sitio estático (`src/`) que consulta en vivo
Overpass, ohsome y GBIF, embebe mapas UMap, genera fichas de metadatos
ISO 19115 y muestra licencias por fuente. No tiene backend propio salvo un
esqueleto sin terminar para OAuth de OSM. No se ha probado con usuarios
reales todavía.
