# Trazabilidad Académica y Memoria Metodológica
### Proyecto de Práctica Profesional (2026 S2): Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Nodo GeoAbierto)

**Autor:** Juan Pablo Lescano Villegas (`GEOJOTA` <juanpablolescanovillegas@gmail.com>)  
**Área:** Geografía, Sistemas de Información Geográfica y Gestión Territorial  
**Caso Piloto:** Barrio Brasil — Universidad Alberto Hurtado (Santiago Centro, Chile)  
**Institución de Referencia:** Universidad Alberto Hurtado (UAH)  

---

## 1. Fundamentación Epistemológica: La VGI en la Geografía Contemporánea

Tradicionalmente, la producción de datos geográficos ha sido monopolio de agencias estatales centralizadas (institutos geográficos militares, ministerios de bienes nacionales, catastros municipales). Aunque rigurosos, estos catastros sufren de tres limitaciones estructurales:
1. **Altos costos presupuestarios y ciclos de actualización prolongados** (a menudo superiores a 5 o 10 años).
2. **Escala macro u homogénea**, incapaz de captar la microdinámica urbana (arbolado barrial, rebajes peatonales en cruces de calles, comercio vecinal).
3. **Brecha de acceso comunitario**: los datos quedan encapsulados en formatos propietarios y visores burocráticos.

Desde la formulación conceptual de Michael Goodchild (2007) sobre la *Información Geográfica Voluntaria* (VGI) y los trabajos de Muki Haklay (2010) sobre la calidad de OpenStreetMap, la geografía reconoce a la ciudadanía y a las comunidades universitarias como **sensores espaciales activos**.

El **Atlas VGI (Nodo GeoAbierto)** operacionaliza esta corriente epistemológica: transforma el dato colaborativo no estructurado en **información geográfica estandarizada, auditable y directamente aplicable a la toma de decisiones territoriales**.

---

## 2. Marco Normativo, Estándares ISO y Política Geoespacial Chilena y Global

Para que este proyecto posea validez epistemológica, sea defendible ante un comité académico riguroso y resulte directamente integrable en los sistemas de gestión territorial de municipios, ministerios y organizaciones comunitarias, su arquitectura se fundamenta explícitamente en la normativa técnica internacional y la política geoespacial chilena:

### 2.1 Especificación de Formatos y Estándares ISO (Proveniencia y Enlaces Oficiales)

Los datos geográficos y metadatos implementados en el Atlas se rigen por la familia de normas del Comité Técnico **ISO/TC 211 (Geographic information/Geomatics)** ([https://committee.iso.org/home/tc211](https://committee.iso.org/home/tc211)) y el **Open Geospatial Consortium (OGC)** ([https://www.ogc.org/](https://www.ogc.org/)):

1. **ISO 19115-1:2014 — Geographic information — Metadata — Part 1: Fundamentals:**
   - *Enlace oficial:* [https://www.iso.org/standard/53798.html](https://www.iso.org/standard/53798.html)
   - *Rol en el Atlas:* Define el esquema conceptual y los elementos núcleo obligatorios y condicionales para documentar la información espacial: identificación del recurso (`MD_DataIdentification`), categorías temáticas (`MD_TopicCategoryCode`), extensión geográfica delimitadora (`EX_GeographicBoundingBox`), linaje y proceso metodológico (`LI_Lineage`), sistema de referencia espacial (`MD_ReferenceSystem`) y puntos de contacto institucional con responsabilidades tipificadas (`CI_RoleCode`).
   - *Implementación:* El módulo [`metadatos.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/metadatos.js) genera la ficha estructurada en formato JSON estándar conforme a estos elementos núcleo.

2. **ISO 19139:2007 — Geographic information — Metadata — XML schema implementation:**
   - *Enlace oficial:* [https://www.iso.org/standard/32574.html](https://www.iso.org/standard/32574.html)
   - *Rol en el Atlas:* Proporciona la regla de codificación formal en XML (Extensible Markup Language) que viabiliza la interoperabilidad máquina-a-máquina y la cosecha automatizada (harvesting) de catálogos mediante protocolos CSW (Catalog Service for the Web).
   - *Implementación:* El Atlas genera y permite descargar con 1 clic el documento XML con el namespace `<gmd:MD_Metadata>` y esquemas validados (`http://www.isotc211.org/2005/gmd`), directamente compatible con los catálogos nacionales e internacionales (GeoNetwork, GeoNode, CKAN).

3. **ISO 19157:2013 / ISO 19157-1:2023 — Geographic information — Data quality:**
   - *Enlace oficial:* [https://www.iso.org/standard/32575.html](https://www.iso.org/standard/32575.html)
   - *Rol en el Atlas:* Establece los principios para describir la calidad de los datos geográficos a través de componentes cuantitativos: completitud (omisión/comisión), consistencia lógica (adherencia topológica), exactitud temporal (validez cronológica del dato) y linaje (historial de modificaciones y contribuciones).
   - *Implementación:* Operacionalizado a través de la API v1 de ohsome (HeiGIT), evaluando la masa crítica comunitaria, el ratio de edición por colaborador, la densidad espacial por km² y la evolución quinquenal sobre la base OSHDB.

4. **ISO 19110:2016 — Geographic information — Methodology for feature cataloguing:**
   - *Enlace oficial:* [https://www.iso.org/standard/57303.html](https://www.iso.org/standard/57303.html)
   - *Rol en el Atlas:* Define el método para estructurar catálogos de objetos y diccionarios de conceptos geográficos.
   - *Implementación:* El módulo [`diccionario.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/diccionario.js) y el panel `06 / Diccionario Territorial` formalizan el esquema de 10 atributos VGI normalizados y 28 etiquetas OSM clasificadas por dominios, garantizando que cada registro cuente con definición inequívoca, tipo de dato y correlación con los estándares IDE.

5. **Darwin Core Standard (Biodiversity Information Standards - TDWG):**
   - *Enlace oficial:* [https://dwc.tdwg.org/](https://dwc.tdwg.org/)
   - *Rol en el Atlas:* Estándar global de metadatos biológicos adoptado por GBIF (*Global Biodiversity Information Facility* - [https://www.gbif.org/](https://www.gbif.org/)). Permite que las observaciones de ciencia ciudadana (iNaturalist, eBird) se mapeen con taxones validados, fechas de registro y bases de registro tipificadas (`HUMAN_OBSERVATION`, `PRESERVED_SPECIMEN`).

### 2.2 Relación con la Política Nacional de Información Geoespacial (PNIG) de Chile e IDE Chile

El Atlas VGI se articula directamente con la política pública del Estado chileno:

- **Política Nacional de Información Geoespacial (PNIG):** ([https://www.ide.cl/index.php/informacion-institucional/politica-nacional](https://www.ide.cl/index.php/informacion-institucional/politica-nacional))  
  Promovida por el Ministerio de Bienes Nacionales a través de la Secretaría Ejecutiva del SNIT / IDE Chile, la PNIG mandata la coordinación, estandarización y difusión de la información territorial para optimizar el diseño de políticas públicas, la gestión de emergencias y el ordenamiento territorial descentralizado.
- **Decreto Supremo N° 28/2006 (Ministerio de Bienes Nacionales):**  
  Crea y regula la Comisión Asesora de Coordinación Nacional del Sistema Nacional de Información Territorial (SNIT), instituyendo las mesas de trabajo sectoriales (Metadatos, Estándares, Marco Legal y Tecnologías).
- **Perfil Nacional de Metadatos de Chile (IDE Chile / SNIT):**  
  Documento técnico oficial que adopta el subconjunto de elementos de ISO 19115 e ISO 19139 de uso mandatorio para todos los órganos de la Administración del Estado. El Atlas adopta este perfil estricto, incorporando categorías temáticas (`topicCategory`), sistemas de referencia geodésicos nacionales (SIRGAS-Chile 2016 / EPSG:5361 y WGS84 / EPSG:4326), linaje de procesamiento y responsabilidades institucionales.
- **Ley N° 20.285 sobre Acceso a la Información Pública y Transparencia:** ([https://www.leychile.cl/Navegar?idNorma=278858](https://www.leychile.cl/Navegar?idNorma=278858))  
  Consagra el derecho ciudadano a acceder a la información en poder del Estado y mandata la publicación proactiva de datos en formatos abiertos, reutilizables y sin barreras propietarias. El Atlas materializa este principio al basarse 100% en software abierto, formatos interoperables (GeoJSON, CSV, XML) y licenciamiento transparente.

### 2.3 Alineación con Marcos Globales: UN-GGIM e IGIF

A nivel global, la iniciativa se alinea con el **Comité de Expertos de las Naciones Unidas sobre la Gestión Global de la Información Geoespacial (UN-GGIM)** ([https://ggim.un.org/](https://ggim.un.org/)) y su **Marco Integrado de Información Geoespacial (IGIF - *Integrated Geospatial Information Framework*)**:
- **Vía Estratégica 4 (Datos):** Fomenta la integración de fuentes no tradicionales y datos generados por la comunidad (VGI y ciencia ciudadana) para complementar los censos y registros administrativos.
- **Vía Estratégica 6 (Estándares):** Promueve la aplicación de normas abiertas de ISO y OGC para evitar silos de información.
- **Vía Estratégica 7 (Innovación):** Promueve herramientas livianas, de código abierto y computación en el borde accesibles para gobiernos locales.

### 2.4 Régimen de Licencias y Propiedad Intelectual
- **OpenStreetMap:** Se rige por la licencia **Open Database License (ODbL 1.0)** ([https://opendatacommons.org/licenses/odbl/](https://opendatacommons.org/licenses/odbl/)). La plataforma documenta en cada entidad consultada la atribución requerida (*"© Colaboradores de OpenStreetMap"*).
- **GBIF:** Las observaciones de biodiversidad se licencian individualmente por los publicadores bajo licencias Creative Commons (CC0 1.0, CC-BY 4.0).
- **Código Fuente del Atlas:** Licenciado bajo **MIT License**, garantizando que sea una herramienta 100% comunitaria, transferible y sin costos de licenciamiento para municipios u organizaciones sociales.

### 2.5 Arquitectura Dual: Inclusión Coexistente de Usuarios Técnicos y No Técnicos

Un requerimiento metodológico esencial del proyecto es **garantizar la usabilidad simultánea para actores técnicos y no técnicos sin degradar las capacidades de ninguno de los dos**:

1. **Para Personas No Técnicas (Vecinos, Dirigentes Sociales, Estudiantes, Autoridades):**
   - **Listas desplegables y opciones seleccionables:** Desplegables temáticos en todos los módulos (claves frecuentes OSM, valores frecuentes clasificados por función barrial, presets de especies urbanas en GBIF, mapas colaborativos precargados en UMap, códigos SRS y licencias en metadatos).
   - **Tarjetas de 1 Clic:** 10 consultas ciudadanas inmediatas en el panel de inicio (farmacias, panaderías, sedes UAH, paraderos Red, ciclovías, plazas, patrimonio, cruces accesibles, bomberos, cafés).
   - **Diccionario Territorial Interactivo (Panel 06):** Traducción directa de la jerga informática de etiquetas a lenguaje natural, con ejemplos concretos en Barrio Brasil y equivalencias IDE Chile.
   - **Cajas Guía de Referencia y Ayuda Contextual:** Explicaciones sencillas sobre qué es un Bbox, cómo se compone una clave/valor y cómo interpretar las métricas de calidad sin fórmulas matemáticas complejas.

2. **Para Usuarios Técnicos (Geógrafos, Analistas SIG, Mapeadores OSM, Investigadores):**
   - **No se eliminaron ni limitaron las consultas complejas:** El sistema mantiene intacto el **Modo Overpass QL interactivo**, permitiendo escribir consultas libres con sintaxis de expresiones regulares, filtros anidados y selector de geometrías (`node`, `way`, `relation`, `nwr`).
   - **Control de Parámetros Avanzados:** Filtros de calidad condicional (`[name]`, `[wheelchair=yes]`, `[addr:street]`, `[operator]`), selección de operadores (`=`, `~`, `!=`, `*`), e intervalo temporal en ohsome (`P1Y`, `P6M`, `P1M`).
   - **Exportación Multi-Formato Estándar:** Descarga de capas en GeoJSON y CSV estructurado, exportación de metadatos en JSON (ISO 19115) y XML (ISO 19139 para IDE Chile / GeoNetwork).
   - **Pipeline CLI para Geógrafos:** Script independiente en Python 3 puro (`scripts/extractor_vgi.py`) para extracciones masivas y servidor backend local con caché (`backend/servidor_vgi.py`).

---

## 3. Evaluación de Calidad de Datos Espaciales (ISO 19157 y Soporte Dual ohsome API v1 y v2)

Una de las críticas históricas a la VGI por parte de comités académicos tradicionales es la *incertidumbre sobre la calidad del dato*. El proyecto refuta esta crítica implementando una auditoría cuantitativa en vivo en base al estándar **ISO 19157:2013 (Data Quality)** y la tecnología de análisis de historia espacial del HeiGIT (Heidelberg University):

### 3.1 Transición Tecnológica: ohsome API v1 (OSHDB) vs ohsome API v2 (ohsomeDB)

El Atlas incorpora soporte dual para las dos generaciones del motor de análisis histórico de OpenStreetMap:

| Dimensión Técnica | ohsome API v1 (Línea Base Abierta) | ohsome API v2-rc (Nueva Generación) |
|---|---|---|
| **Base de Datos / Motor** | **OSHDB** (OpenStreetMap History Database) sobre Java, H2 e Ignite. | **ohsomeDB** (PostgreSQL / PostGIS / Citus), reescrito completamente en Python. |
| **Autenticación** | Acceso 100% público y abierto **sin requerir API Key**. | **API Key obligatoria** gestionada por Tyk API Gateway (`Authorization: Bearer <token>`). |
| **Rendimiento** | Consultas agregadas con tiempos estándar (15 a 60 segundos). | Procesamiento distribuido en Citus de alto rendimiento (respuestas en 1 a 5 segundos). |
| **Nuevas Funcionalidades** | Métricas de elementos, longitud, área y usuarios. | Filtrado por hashtags de mapeo (HOT, MapRoulette), metadatos de changesets y extracción en Apache Parquet. |
| **Endpoints Principales** | `/elements/count`, `/elements/length`, `/elements/area`, `/users/count`. | `/stats/features/{measure}`, `/stats/contributors/count`, `/extraction/features.parquet`. |
| **Horizonte Temporal** | Soporte oficial garantizado por HeiGIT hasta el **30 de noviembre de 2026**. | Versión candidata (v2-rc) destinada a sustituir definitivamente a v1 a partir de fines de 2026. |

### 3.2 Arquitectura Resiliente con Conmutación Transparente (Fallback)

Para evitar que una persona no técnica o un estudiante se enfrente a errores HTTP 401 (Unauthorized) por no poseer una clave de HeiGIT:
1. **Modo Predeterminado Abierto (v1):** Por defecto, la plataforma consulta `api.ohsome.org/v1`, permitiendo que cualquier persona use el Atlas de inmediato sin registros previos.
2. **Modo Avanzado (v2):** Si el usuario selecciona ohsome API v2 e ingresa su API Key (almacenable de forma segura en `localStorage`), el Atlas consulta los endpoints de alto rendimiento en `api.heigit.org/ohsome-api/v2-rc`.
3. **Mecanismo de Conmutación Automática:** Si la petición a v2 se realiza sin token o la API rechaza la solicitud, el módulo intercepta el fallo y conmuta de manera inmediata y transparente a la API v1, desplegando un aviso informativo para que el análisis territorial nunca se interrumpa.

### 3.3 Dimensiones de Calidad Auditadas (ISO 19157)

1. **Sensibilidad al Tipo de Geometría:**
   - **Entidades Lineales (Vialidad y Movilidad Activa):** Consulta de longitud computando la longitud real de red en kilómetros y metros lineales (red vial de Barrio Brasil y ciclovías). Permite evaluar continuidad de red y conectividad territorial.
   - **Entidades Poligonales (Edificaciones y Espacio Público):** Consulta de superficie computando el área en metros cuadrados y hectáreas de la huella construida (`building=*`) y áreas verdes (`leisure=park`), clave para calcular índices de espacio público por habitante.
   - **Entidades Puntuales (Equipamiento y Accesibilidad):** Consulta de conteo cuantificando nodos discretos (paraderos, farmacias, rebajes de cordón).
2. **Completitud y Densidad Espacial Coherente:** El panel `02 / Calidad de Datos (ohsome)` calcula la densidad real de entidades por kilómetro cuadrado y por hectárea mediante una reproyección rigurosa a **EPSG:32719 (UTM Huso 19 Sur)**, eliminando las distorsiones de superficie que se originan al computar áreas en coordenadas angulares o sobre esferas simplificadas.
3. **Consistencia Temporal y Dinámica Histórica:** Mediante series anualizadas a 5 años (o pasos semestrales/mensuales), el sistema monitorea el crecimiento acumulado del catastro y detecta posibles estancamientos o fases de aceleración comunitaria.
4. **Linaje, Masa Crítica y Ratio de Intensidad:** Mediante el cruce de colaboradores y contribuciones, el sistema calcula el **Ratio de Ediciones por Colaborador**, permitiendo diferenciar empíricamente entre un territorio mapeado por un único voluntario aislado versus uno respaldado por una comunidad plural y sostenida en el tiempo.
5. **Aparato Crítico y Referencias Científicas:**
   - **Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019):** *OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data.* EPJ Data Science, 8(1), 1-18. doi:10.1186/s40965-019-0061-3.
   - **HeiGIT (2025/2026):** *ohsome API v2 Documentation: High-performance OSM History Analysis with ohsomeDB and Citus.* Heidelberg Institute for Geoinformation Technology. https://api.heigit.org/ohsome-api/v2-rc/docs
   - **Neis, P. & Zipf, A. (2012):** *Analyzing the Contributor Activity of OpenStreetMap and Its Development for the Community.* ISPRS International Journal of Geo-Information, 1(2), 146-177. doi:10.3390/ijgi1020146.
   - **Haklay, M. (2010):** *How good is volunteered geographical information? A case study of OpenStreetMap in the UK.* Environment and Planning B: Planning and Design, 37(4), 682-703. doi:10.1068/b35097.

### 3.4 Fundamentación Geodésica y Reproyección Cartográfica Oficial (ISO 19111 / EPSG:32719 / IGM Chile / IDE Chile)

El cálculo de áreas y densidades en el Atlas VGI cumple estrictamente con el estándar **ISO 19111:2019 (Referencing by coordinates)** y las especificaciones cartográficas oficiales de la República de Chile:

1. **Inadecuación de Medidas Euclidianas en Grados Decimales:**
   - Los datos brutos de OpenStreetMap se almacenan en coordenadas geográficas elipsoidales $(\phi, \lambda)$ en grados decimales sobre el datum WGS84 (EPSG:4326).
   - A la latitud de Santiago Centro y Barrio Brasil ($\phi \approx -33.44^\circ$), un grado de longitud equivale a aproximadamente $92.9\text{ km}$, mientras que un grado de latitud equivale a $110.9\text{ km}$. Calcular superficies multiplicando directamente incrementos angulares ($\Delta \lambda \times \Delta \phi$) o asumir una esfera terrestre simplificada introduce errores significativos en el cálculo métrico de huellas construidas y áreas de estudio.

2. **Reproyección Conforme a EPSG:32719 (WGS 84 / UTM Huso 19 Sur):**
   - El sistema implementa la proyección conforme de **Transverse Mercator** basada en las ecuaciones rigurosas de Snyder (1987) y adoptadas por el Instituto Geográfico Militar (IGM) y la Infraestructura de Datos Espaciales de Chile (IDE Chile / SNIT):
     - **Elipsoide de Referencia:** WGS 84 ($a = 6378137.0\text{ m}$, $f = 1/298.257223563$).
     - **Meridiano Central:** $69^\circ\text{ Oeste}$ ($\lambda_0 = -69.0^\circ$).
     - **Factor de Escala:** $k_0 = 0.9996$.
     - **Falso Este:** $500.000\text{ m}$.
     - **Falso Norte:** $10.000.000\text{ m}$ (Hemisferio Sur).
   - Esta formulación garantiza compatibilidad geodésica con el marco de referencia geocéntrico nacional **SIRGAS-Chile 2016** (EPSG:5361).

3. **Cálculo de Superficies mediante la Fórmula de Gauss (Shoelace) y Métricas en Metros Cuadrados ($m^2$):**
   - Una vez transformados los vértices $[(\text{lon}_i, \text{lat}_i) \rightarrow (E_i, N_i)]$ a un plano métrico proyectado UTM 19S euclidiano, el área se evalúa mediante la fórmula de Gauss para polígonos cerrados:
     $$\text{Área} = \frac{1}{2} \left| \sum_{i=1}^{n-1} (E_i \cdot N_{i+1} - E_{i+1} \cdot N_i) \right|$$
   - La unidad base fundamental del cálculo geodésico es el **metro cuadrado ($m^2$)**, a partir del cual se derivan coherentemente las hectáreas ($1\text{ ha} = 10.000\text{ m}^2$) y los kilómetros cuadrados ($1\text{ km}^2 = 1.000.000\text{ m}^2$).
   - Este algoritmo se aplica sistemáticamente tanto a polígonos vectoriales (`building`, `leisure=park`, `landuse=residential`, campus universitarios UAH) como a los Bounding Boxes territoriales y tablas de resultados, entregando valores exactos en metros cuadrados ($m^2$), hectáreas ($ha$) y kilómetros cuadrados ($km^2$).

4. **Transparencia y Expresión Sistemática en la Interfaz de Usuario:**
   - La reproyección y las métricas en $m^2$ no son un proceso oculto: se explicitan en toda la experiencia de usuario para garantizar total auditabilidad por personas no técnicas y revisores académicos:
     - **Popups de Leaflet:** Cada entidad poligonal muestra su superficie destacada en $m^2$ y $ha$ con la etiqueta visible `[EPSG:32719]`.
     - **Tooltip Interactivo de Bbox:** Al encuadrar o dibujar un área en el mapa, el rótulo dinámico indica el área calculada en metros cuadrados, hectáreas y $km^2$: `Área Bbox: X m² (Y ha / Z km²) [EPSG:32719]`.
     - **Panel ohsome (Indicadores de Calidad):** La tarjeta de densidad reporta la superficie del encuadre en $m^2$, $ha$ y $km^2$, calculando densidades en elementos/$km^2$, elementos/ha y elementos por cada 1.000 $m^2$, con el rótulo destacado: *Reproyectado a EPSG:32719 (UTM 19S)*. En consultas de polígonos, la métrica geométrica principal reporta el metraje cuadrado total cubierto ($m^2$).
     - **Ficha Territorial de Estudio:** Muestra la superficie calculada en metros cuadrados para Barrio Brasil completo ($2.237.461\text{ m}^2 / 223.75\text{ ha} / 2.2375\text{ km}^2$) y para la manzana UAH ($1.361.006\text{ m}^2 / 136.1\text{ ha} / 1.361\text{ km}^2$).
     - **Tablas de Consultas y Estadísticas:** Tanto la tabla de consultas rápidas como la de consultas personalizadas incluyen la columna `Superficie (m²)` y una insignia de conteo de área total acumulada en $m^2$.
     - **Exportación CSV y GeoJSON:** Incluyen los atributos normalizados `superficie_m2`, `superficie_ha`, `superficie_km2` y `srs_superficie: "EPSG:32719 (WGS 84 / UTM Huso 19 Sur)"`.

---

## 4. Decisiones de Arquitectura y Defensa Técnica

Ante la comisión de práctica profesional, cada componente técnico responde a una justificación deliberada:

| Decisión Técnica | Alternativa Descartada | Justificación y Defensa Metodológica |
|---|---|---|
| **Arquitectura de Costo Cero (Static + Serverless + Local Python)** | Backend tradicional con servidor dedicado (Django/Express en VPS de pago) | Un servidor dedicado cuesta entre $5 y $20 USD mensuales y requiere mantenimiento de parches de seguridad. Al optar por Netlify Serverless, GitHub Pages y un servidor local en Python estándar, el costo es estrictamente cero y cualquier estudiante o municipio rural puede levantarlo sin presupuesto informático. |
| **JavaScript Nativo (Vanilla JS) sin frameworks pesados** | React, Angular, Vue | Reduce la barrera de entrada para geógrafos no programadores. Cualquier usuario puede inspeccionar y modificar `mapa.js` o `osm.js` con un simple editor de texto sin instalar Node.js, Webpack ni dependencias NPM efímeras. |
| **Leaflet 1.9.4 con teselas abiertas** | Mapbox GL, Google Maps JavaScript API | No requiere tarjetas de crédito ni tokens que expiren. Utiliza Carto Positron, OSM Estándar y OpenTopoMap libres. |
| **Diferenciación por Perfiles de Actor Territorial** | Interfaz única monolítica genérica | Modula la experiencia para tres actores clave (autoridades/instituciones, organizaciones comunitarias/vecinos y voluntarios/mapeadores), reduciendo la brecha digital y destacando herramientas según necesidades de gestión. |
| **Diccionario Territorial y Metadatos Normalizados** | Consulta a bases de datos sin glosario explicativo | Desmitifica la jerga informática de etiquetas de OpenStreetMap traduciéndola a 10 atributos estándar compatibles con IDE Chile (SNIT) e ISO 19115. |
| **Constructor de Consultas Espaciales Dual + Sugerencias 1 Clic** | Búsqueda solo tabular predefinida o solo Overpass QL | Democratiza la consulta territorial permitiendo que vecinos ejecuten consultas en un solo clic, mientras que investigadores avanzados pueden construir expresiones complejas y descargar GeoJSON/CSV. |
| **Delimitación Territorial Operativa (Barrio Brasil Completo y Manzana UAH)** | Catálogo metropolitano disperso (Providencia, Lo Barnechea, Casco Cívico) | Focaliza los recursos computacionales y de consulta en el área de estudio directa de la práctica profesional de Geografía, garantizando consistencia empírica en las 8 categorías y evitando consultas descontextualizadas o sobrecarga innecesaria de APIs en Bboxes metropolitanos ajenos al caso piloto. |
| **Taxonomía Multi-Entidad y Geometrías Mixtas (Puntos, Líneas y Polígonos)** | Modelo simplificado mono-entidad puntual (`out center`) | Supera la limitación reduccionista de representar fenómenos urbanos complejos como meros puntos. Permite capturar la verdadera morfología espacial (huellas poligonales de campus universitarios y plazas, redes lineales de ciclovías y vías de transporte, y equipamientos puntuales de servicios), cumpliendo con el principio de fidelidad topológica de ISO 19157. |
| **Reproyección Geodésica a EPSG:32719 para Cálculo de Superficies y Densidad** | Cálculos euclidianos en grados o esferas simplificadas | Los grados decimales ($\Delta \lambda \times \Delta \phi$) no constituyen unidades métricas y distorsionan las áreas a la latitud de Santiago (-33.44°). La reproyección conforme a EPSG:32719 (WGS 84 / UTM Huso 19 Sur, elipsoide WGS84, meridiano central 69°O) mediante las ecuaciones de Snyder (1987) y la fórmula de Gauss garantiza exactitud métrica en $m^2$, $ha$ y $km^2$ bajo las normas del IGM e IDE Chile. |
| **Respaldo Local Automático (Fallback)** | Bloqueo o error 429 cuando Overpass satura | Si la red pública de Overpass sufre congestión durante una defensa académica, el sistema conmuta automáticamente a los 1.316 registros locales pre-extraídos de Barrio Brasil y UAH. |

---

## 5. Validación Empírica en el Caso Piloto: Barrio Brasil y Campus UAH

Para el polígono de estudio delimitado por las coordenadas WGS84 `[-70.6675, -33.4505, -70.6565, -33.4385]`, se extrajo y validó un universo real de **1.316 entidades geográficas**, categorizadas bajo la taxonomía del Atlas:

- **CAT-01 Educación (137 entidades):** Casas centrales y facultades de la Universidad Alberto Hurtado (calles Almirante Barroso, Cienfuegos, Erasmo Escala), sedes UDP, UTEM, colegios e institutos.
- **CAT-02 Servicios y Comercio (250 entidades):** Comercio de barrio, farmacias, cafés en Av. Brasil y Huérfanos.
- **CAT-03 Movilidad y Transporte (191 entidades):** Estaciones intermodales Metro Los Héroes (L1/L2) y Santa Ana (L2/L5), paraderos del sistema Red Movilidad.
- **CAT-04 Movilidad Activa (11 entidades):** Eje ciclovía Rosas, ciclobanda Brasil, estacionamientos de bicicletas UAH.
- **CAT-05 Áreas Verdes y Plazas (107 entidades):** Plaza Brasil, arbolado y bandejones centrales de la Alameda.
- **CAT-06 Patrimonio y Cultura (45 entidades):** Inmuebles de Conservación Histórica, casonas Zona Típica Barrio Brasil, Basílica del Salvador.
- **CAT-07 Accesibilidad Universal (185 entidades):** Catastro de rebajes de cordón (`kerb`), cruces peatonales accesibles y condiciones de vereda.
- **CAT-08 Biodiversidad Urbana (390 entidades):** Catastro del arbolado urbano OSM cruzado con registros de avifauna y flora de GBIF / iNaturalist.

---

## 6. Respuestas a Preguntas Críticas del Comité Académico

### P1: *"¿Por qué confiar en datos de voluntarios si el Estado tiene datos oficiales?"*
> **Respuesta:** No se trata de reemplazar la cartografía oficial, sino de complementarla en escalas y temáticas donde el Estado no llega a tiempo. El catálogo de IDE Chile no cuenta con un catastro actualizado a nivel de calle de la accesibilidad universal para personas en silla de ruedas o de la ubicación exacta de biciestacionamientos en la manzana universitaria. La VGI llena ese vacío y, gracias a nuestras herramientas de calidad y metadatos ISO 19139, se puede evaluar objetivamente el nivel de confianza de cada capa antes de usarla en un informe.

### P2: *"¿Cómo se garantiza la reproducibilidad de la plataforma en otros territorios?"*
> **Respuesta:** Toda la configuración territorial está desacoplada en `config/config.json`. Si otra universidad o municipalidad (por ejemplo, en Valparaíso o Concepción) desea implementar su propio Atlas VGI, únicamente debe cambiar cuatro números de Bbox en el JSON, sin tocar una sola línea de código JavaScript o Python.

### P3: *"¿Qué ocurre si la plataforma se queda sin conexión a internet en terreno o en una exposición?"*
> **Respuesta:** La plataforma cuenta con una triple capa de resiliencia: (1) servidor backend local en Python (`backend/servidor_vgi.py`) que funciona sin conexión con caché en disco, (2) catálogo local pre-extraído en `data/` para Barrio Brasil / UAH con 1.316 entidades, y (3) exportación a GeoJSON y CSV directamente utilizables de forma offline en QGIS.

### P4: *"¿Cómo se calculan las superficies de las entidades territoriales y las densidades espaciales para que sean métricamente coherentes?"*
> **Respuesta:** Ninguna superficie se calcula multiplicando grados decimales ni asumiendo la Tierra como una esfera perfecta. El Atlas implementa un motor geodésico riguroso (`ModuloGeodesia`) que reproyecta cada coordenada WGS 84 a **EPSG:32719 (WGS 84 / UTM Huso 19 Sur)** mediante las ecuaciones conformes de Transverse Mercator (Snyder, 1987), el estándar métrico oficial adoptado por el Instituto Geográfico Militar (IGM) y la IDE Chile para la Región Metropolitana. Sobre estas coordenadas planas métricas se aplica la fórmula del área de Gauss (Shoelace), garantizando superficies precisas en $m^2$, hectáreas y $km^2$ tanto en los polígonos del mapa como en los indicadores de calidad de ohsome, todo debidamente explicitado en la interfaz para personas no técnicas y revisores expertos.
