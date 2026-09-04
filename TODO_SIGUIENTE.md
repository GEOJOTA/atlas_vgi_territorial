# Bitácora de Continuidad y Trazabilidad de Desarrollo
### Proyecto: Atlas de Información Geográfica Voluntaria para la Gestión Territorial (nodo-geoabierto)

Este documento registra la evolución técnica, decisiones metodológicas y entregas de turno del proyecto, asegurando trazabilidad integral de antecedentes ante el comité académico de evaluación de la práctica profesional de Geografía (2026).

## Entrega de turno 4 — Septiembre 2026 (Accesibilidad Ciudadana, Diccionario Territorial, Perfiles de Actor y Métricas Geométricas ohsome v1)

### Estado alcanzado en este turno

1. **Democratización de Consultas OSM para Usuarios No Técnicos (1 Clic):**
   - Incorporación de **10 tarjetas de consultas ciudadanas rápidas** en el panel `01 / Consultas y Explorador`:
     - 💊 Farmacias y Boticas comunales (`amenity=pharmacy`)
     - 🍞 Panaderías y Almacenes de barrio (`shop=bakery`)
     - 🎓 Sedes y Facultades Universidad Alberto Hurtado (`amenity=university`)
     - 🚌 Paraderos de Buses del sistema Red Movilidad (`highway=bus_stop`)
     - 🚲 Biciestacionamientos comunitarios (`amenity=bicycle_parking`)
     - 🌳 Plazas y Parques urbanos (`leisure=park`)
     - 🏛️ Casonas Patrimoniales y Monumentos (`historic=*`)
     - ♿ Rebajes de Cordón y Accesibilidad Peatonal (`kerb=lowered`)
     - 🚒 Bomberos y Servicios de Rescate (`amenity=fire_station`)
     - ☕ Cafeterías y Espacios de Encuentro Barrial (`amenity=cafe`)
   - Cada tarjeta preconfigura automáticamente el constructor visual, el color, el nombre descriptivo y ejecuta la consulta espacial mapeándola dinámicamente en Leaflet sin requerir conocimientos de sintaxis Overpass QL.

2. **Diccionario Interactivo de Metadatos y Atributos Territoriales (`diccionario.js` y Panel 06):**
   - Creación del módulo [`src/js/modulos/diccionario.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/diccionario.js) y habilitación de la sección `06 / Diccionario Territorial` en [`src/index.html`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/index.html):
     - **10 Atributos Normalizados del Esquema VGI:** `id_vgi`, `categoria`, `subtipo`, `nombre`, `operador`, `direccion`, `accesibilidad`, `fuente`, `licencia`, `coordenadas`, especificando tipo de dato, definición ciudadana, ejemplos reales en Barrio Brasil y equivalencia técnica con el Perfil Nacional de Metadatos de Chile (IDE Chile / SNIT / ISO 19115).
     - **Glosario Territorial de 17 Etiquetas Colaborativas OSM:** traducción directa de tags técnicos a conceptos territoriales comprensibles y su aplicación específica en la manzana universitaria UAH.
     - **Buscador Reactivo en Tiempo Real:** filtrado instantáneo por texto en atributos y etiquetas.

3. **Adaptación de la Experiencia a Tres Perfiles de Actores Territoriales:**
   - Incorporación del selector `#sel-perfil-usuario` en la barra de navegación:
     - 🏛️ **Autoridades / Instituciones (IDE Chile / Municipalidades):** Prioriza metadatos normalizados (ISO 19115/19139), catastro de equipamiento crítico, licencias de datos abiertos y control de calidad espacial.
     - 👥 **Organizaciones Comunitarias / Vecinos:** Facilita consultas en 1 clic para plazas, patrimonio, ciclovías, comercio vecinal y cartografía colaborativa barrial en UMap.
     - 🧭 **Voluntarios / Mapeadores OSM:** Enfocado en calidad ohsome v1, constructor Overpass QL avanzado y taxonomía geográfica.
   - Lógica de sincronización reactiva en `manejarCambioPerfilUsuario`: destaca con insignias estrella (★) los paneles prioritarios en la barra lateral y aplica resaltado/atenuación visual sobre las tarjetas temáticas ciudadanas.

4. **Profundización en Métricas Multidimensionales de Calidad ohsome API v1 (HeiGIT):**
   - **Sensibilidad al Tipo de Geometría:** Conforme a las restricciones de la API v1 de ohsome, el sistema clasifica las entidades según el filtro de consulta:
     - *Entidades Lineales* (calles, ciclovías, pasajes): consulta `/elements/length` para reportar longitud total de red en kilómetros y metros lineales.
     - *Entidades Poligonales* (edificaciones, áreas verdes, predios): consulta `/elements/area` para reportar superficie cubierta y huella construida en metros cuadrados y hectáreas.
     - *Entidades Puntuales* (equipamientos, paraderos, mobiliario): consulta `/elements/count` de nodos discretos.
   - **Métricas de Linaje y Masa Crítica Colaborativa:**
     - Conteo de colaboradores históricos y activos en el último período (`/users/count`).
     - Conteo acumulado de contribuciones y transacciones de edición (`/contributions/count`).
     - Derivación del *Ratio de Intensidad Comunitaria* (contribuciones por usuario) para contrastar mapeos individuales esporádicos versus comunidades activas recurrentes.
     - Cálculo geométrico de densidad espacial (`elem/km²`) sobre el Bounding Box activo.
   - **Soporte Backend Dual Actualizado:** tanto [`netlify/functions/calidad.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/netlify/functions/calidad.js) como [`backend/servidor_vgi.py`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/backend/servidor_vgi.py) replican de manera idéntica el cálculo geométrico y de contribuciones con soporte de caché.
   - **Aparato Crítico y Citas Académicas:** Integración directa en la interfaz de referencias bibliográficas con DOI (Raifer et al., 2019; Neis & Zipf, 2012; HeiGIT) para respaldar la calidad del dato ante comités evaluadores.

5. **Consistencia de Archivos y Trazabilidad:**
   - Supresión canónica del archivo transitorio `TODO_SIGUIENTE_IA.md` y unificación en [`TODO_SIGUIENTE.md`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/TODO_SIGUIENTE.md), preservando intactos todos los antecedentes de los Turnos 1, 2 y 3.

---

## Entrega de turno 3 — Septiembre 2026 (Backend Robusto, Constructor de Consultas Propias, Trazabilidad Académica y Despliegue Multi-Plataforma)

### Estado alcanzado en este turno

1. **Desarrollo del Backend Dual para Consultas Propias:**
   - **Backend Serverless (Netlify Functions):**
     - [`netlify/functions/consulta.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/netlify/functions/consulta.js): Endpoint `/api/consulta` con método POST. Acepta consultas espaciales personalizadas con Bbox, entidad (`nwr`, `node`, `way`), filtros de clave/operador/valor o código Overpass QL libre, resolviendo reintentos sobre servidores espejo y devolviendo GeoJSON normalizado con encabezados CORS y control de caché.
     - [`netlify/functions/calidad.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/netlify/functions/calidad.js): Endpoint `/api/calidad` para consultas de densidad y series anuales a 5 años en la API de ohsome (HeiGIT).
   - **Backend Local en Python 3 Puro:**
     - [`backend/servidor_vgi.py`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/backend/servidor_vgi.py): Servidor HTTP local ejecutable que atiende la interfaz web y replica idénticamente los endpoints `/api/consulta` y `/api/calidad`, incorporando un sistema de caché en disco (`data/cache_consultas/`). Permite levantar toda la plataforma localmente con `python3 backend/servidor_vgi.py` sin requerir Node.js ni dependencias externas de `pip`.

2. **Constructor de Consultas Propias en la Interfaz (Frontend):**
   - En el panel `01 / Consultas Personalizadas y Explorador OSM` de [`src/index.html`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/index.html):
     - Selector de tipo de entidad (`nwr`, `node`, `way`).
     - Desplegable de claves frecuentes (`amenity`, `shop`, `historic`, `highway`, `building`, `leisure`, `healthcare`, `tourism`, `emergency`) + opción de clave manual libre.
     - Selector de operadores (`=`, `~` contiene, `!=`, `*` cualquiera).
     - Campo de valor de etiqueta con autocompletado y sugerencias.
     - Asignación de nombre y color personalizado para la capa en el mapa Leaflet.
     - Modo avanzado con editor de código Overpass QL interactivo (con marcador `{{bbox}}`).
     - Botón "🚀 Ejecutar y Mapear" que agrega la capa vectorial dinámica en Leaflet.
     - Botón "💾 Guardar Consulta" que almacena filtros favoritos en `localStorage` con chips de acceso rápido.
     - Botones de descarga directa de los resultados de la consulta en **GeoJSON** y **CSV**, más botón de envío automático a la ficha de metadatos ISO 19115/19139.

3. **Arquitectura de Despliegue Multi-Plataforma Abierto:**
   - **Netlify:** Configuración en [`netlify.toml`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/netlify.toml) con redirecciones automáticas `/api/*` hacia funciones serverless, control de caché y encabezados MIME para `.geojson` y `.xlsx`.
   - **GitHub Pages:** Workflow de GitHub Actions en [`.github/workflows/deploy.yml`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/.github/workflows/deploy.yml) que compila y publica automáticamente la carpeta `src/` en GitHub Pages con cada `push` a la rama `main`.
   - **Vercel:** Archivo de configuración en [`vercel.json`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/vercel.json) con cabeceras de datos abiertos y URLs limpias.

4. **Documentación de Trazabilidad y Memoria Académica:**
   - Creación del documento formal [`docs/TRAZABILIDAD_ACADEMICA.md`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/docs/TRAZABILIDAD_ACADEMICA.md) estructurado para responder a las preguntas de defensa ante la comisión evaluadora de Geografía (marco legal chileno, estándares ISO 19115/19139, validación de calidad y reproducibilidad territorial).
   - Preservación textual de todos los antecedentes de turnos anteriores en este documento.

---

## Entrega de turno 2 — Septiembre 2026 (Profundización y Operacionalización Barrio Brasil / UAH)

### Estado alcanzado en el Turno 2

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
   - Herramienta en Python 3 estándar (sin dependencias externas) que permite a geógrafos descargar y exportar cualquier categoría territorial en archivos GeoJSON y un archivo consolidado `data/resumen_catastro_vgi.csv` con atributos normalizados (se extrajeron 1.316 entidades en el piloto).

8. **Automatización Git (`scripts/deploy_git.sh`):**
   - Script con permisos de ejecución para inicializar el repositorio, configurar el autor `GEOJOTA <juanpablolescanovillegas@gmail.com>`, commitear y preparar la sincronización con GitHub.

---

## Entrega de turno 1 (Estado inicial previo — Fundamentos y Prototipo)

### Estado inicial (resumen)

Hay un prototipo funcional de sitio estático (`src/`) que consulta en vivo
Overpass, ohsome y GBIF, embebe mapas UMap, genera fichas de metadatos
ISO 19115 y muestra licencias por fuente. No tiene backend propio salvo un
esqueleto sin terminar para OAuth de OSM. No se ha probado con usuarios
reales todavía.

### Lo que funciona probado (Turno 1)

- Consulta a Overpass con bbox + etiqueta (`osm.js` + panel Explorador).
- Formulario y generación/exportación de fichas de metadatos (`metadatos.js`).
- Navegación entre paneles y carga de `config.json`.

### Lo que estaba implementado pero sin probar contra las APIs reales (Turno 1)

Al construir este prototipo se escribió la lógica de `ohsome.js` y
`gbif.js` siguiendo la documentación pública de cada API, pero **no se
verificó en vivo la respuesta exacta de cada endpoint** (nombres de campos
como `fromTimestamp` vs `timestamp` en ohsome, por ejemplo, pueden variar
según la versión de la API). Antes de mostrarle esto a un usuario real,
alguien debería:

1. Abrir el panel "Calidad de datos" con un área pequeña y revisar en la
   consola del navegador si `ModuloOhsome.calcularIndicadores()` devuelve
   lo esperado. Si los nombres de campo cambiaron, ajustar el `.map()`
   correspondiente en `ohsome.js`.
2. Lo mismo para GBIF: confirmar que `geometry` con WKT efectivamente
   filtra por el bbox (GBIF a veces prefiere `decimalLatitude`/
   `decimalLongitude` con rangos en vez de WKT, según el volumen de la
   consulta).
3. Probar `umap.js` contra al menos dos instancias UMap distintas
   (umap.openstreetmap.fr y alguna instancia municipal, si existe), porque
   la ruta de descarga de GeoJSON no está estandarizada entre versiones.

### Decisiones de diseño iniciales que vale la pena conocer

- **Por qué no hay framework (React, Vue, etc.):** para que el proyecto
  sea reproducible por alguien sin herramientas de build instaladas.
  Cualquier persona con un editor de texto y un navegador puede
  modificarlo. Si el proyecto crece mucho y esto empieza a doler, migrar a
  un framework es razonable, pero hay que evaluar si vale la pena el costo
  de complejidad para el público objetivo (organizaciones territoriales,
  no equipos de desarrollo).
- **Por qué la configuración vive en un JSON separado:** para que adaptar
  el proyecto a otra comuna u organización no requiera tocar JavaScript.
- **Por qué no hay base de datos:** para mantener el costo en cero. El
  primer paso natural si se necesita persistencia real (guardar consultas
  de varios usuarios, por ejemplo) es evaluar Supabase (tiene plan
  gratuito con Postgres) antes que montar un backend propio.

### Próximos pasos sugeridos inicialmente (Turno 1)

1. Probar las tres APIs (ohsome, GBIF, UMap) contra casos reales y ajustar
   el parseo de respuestas donde haga falta.
2. Completar el flujo OAuth de OSM (`netlify/functions/oauth-token.js`)
   si la subida de datos es un requisito real del proyecto, no solo
   deseable.
3. Contrastar la ficha de metadatos contra el perfil oficial de la
   Infraestructura de Datos Geoespaciales de Chile vigente, y ajustar los
   campos de `metadatos.js` / `index.html` si hay elementos obligatorios
   que falten.
4. Sumar un mapa interactivo real (Leaflet, que es liviano y gratuito) en
   el panel Explorador OSM, para dibujar el bbox en vez de escribirlo a
   mano.
5. Conversar con una organización territorial real para revisar si el
   lenguaje de la interfaz es el que ellos usarían.

### Cosas que se decidió no hacer inicialmente y por qué

- No agregar autenticación de usuarios para la plataforma en general: el
  prototipo es de solo lectura salvo la ficha de metadatos, que se guarda
  local. No hay nada que proteger todavía.
- No usar un CDN de mapas de pago (Mapbox, Google Maps) para no introducir una
  dependencia con llave de API paga. Se resolvió con teselas de Carto Positron,
  OpenStreetMap y OpenTopoMap.
