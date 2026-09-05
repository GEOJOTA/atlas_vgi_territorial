# Bitácora de Continuidad y Trazabilidad de Desarrollo
### Proyecto: Atlas de Información Geográfica Voluntaria para la Gestión Territorial (nodo-geoabierto)

Este documento registra la evolución técnica, decisiones metodológicas y entregas de turno del proyecto, asegurando trazabilidad integral de antecedentes ante el comité académico de evaluación de la práctica profesional de Geografía (2026).

## Entrega de turno 10 — Septiembre 2026 (Manual de Uso del Atlas Web estilo Librería, Diccionario Territorial Interactivo y Cliqueable, Sustitución de Licencia MIT por Marco Tripartito CC BY-SA 4.0 / ODbL / AGPL-3.0 y Robustecimiento Bibliográfico Extendido)

### Contexto y Requerimiento de Desarrollo

En cumplimiento con el requerimiento de accesibilidad conceptual, gobernanza de datos y robustecimiento de la documentación técnica ("*El diccionario territorial no se entiende muy bien, añade las opciones 'cliqueables' o directamente que cada una (8) tenga un enlace de dirección que te lleve al manual de uso del atlas. Que debe ser robusto, facil de entender, en línea con los estándares mencionados. El manual de uso debe estar dentro de la pagina... como una libreria de un paquete digamos (estilo documentación, con referencia al proyecto en git, abierto a contribuciones por permiso (por ahora)) no quiero que tenga la licencia de MIT ¿puede ser otra más adaptada a la realidad chilena? que vaya en concordancia con los datos libres y voluntarios... Robustece la bibliografía... estilo 'backrooms' bien sobrio...*"), se diseñó e implementó una modernización profunda de la plataforma web, sus componentes interactivos y su base documental.

---

### Diagnóstico de Brechas Previas Resueltas

1. **Incomprensión del Diccionario Territorial por Usuarios No Técnicos:**
   - La versión previa presentaba únicamente dos tablas densas con 14 atributos normalizados y 63 etiquetas de OpenStreetMap en inglés, resultando abrumadora para vecinos, dirigentes sociales y estudiantes que ingresaban por primera vez al ecosistema VGI. Carecía de un puente visual intuitivo entre los descriptores barriales y su explicación metodológica.
2. **Carencia de un Manual de Uso Integrado en la Aplicación Web:**
   - El Panel 08 contenía únicamente un resumen esquemático de hitos sin documentación técnica navegable, sin diagramas explicativos del flujo de datos y sin ejemplos reproducibles para las 8 categorías territoriales.
3. **Inadecuación Ética y Jurídica de la Licencia MIT para la VGI en Chile:**
   - La licencia permisiva MIT permitía que cualquier actor privado o consultora comercial empaquetara el código y los datos comunitarios en software cerrado privativo sin transferir mejoras a la comunidad (*enclosure* de datos abiertos), vulnerando la soberanía de los datos públicos y el espíritu solidario de OpenStreetMap.
4. **Falta de un Protocolo Explícito de Contribuciones en Git:**
   - No se explicitaba cómo la comunidad académica o los estudiantes podían colaborar con nuevas capas o etiquetas territoriales en el repositorio oficial de GitHub sin poner en riesgo la estabilidad técnica del Atlas.
5. **Potencial Bibliográfico Subutilizado:**
   - Se requería incorporar el extenso cuerpo teórico revisado en la literatura especializada sobre VGI (epistemología crítica de los SIG, calidad espacial ISO 19157, detección de vandalismo, geoseguridad y principios FAIR), proyectándolo hacia investigaciones contemporáneas 2024-2026 sin incurrir en auto-citaciones.

---

### Soluciones Implementadas y Mejoras del Sistema

1. **Nuevo Módulo de Manual de Uso y Documentación Oficial (`src/js/modulos/manual.js`):**
   - Diseñado bajo la metáfora de una **librería o paquete de software técnico (estilo *documentation docsite* sobrio 'backrooms')**, articulado en 7 secciones exhaustivas con navegación fija superior y accesos directos:
     - **01. Quickstart:** Guías diferenciadas de 3 pasos para ciudadanos no técnicos vs geógrafos y analistas SIG.
     - **02. Guía de Módulos (00 al 07):** Descripción pormenorizada de entradas, salidas y casos de uso para cada panel del sistema.
     - **03. Catálogo Exhaustivo de Macro-Categorías (CAT-01 a CAT-08):** Fichas técnicas individuales con anclas directas (`#manual-cat-01` a `#manual-cat-08`), detallando su función territorial en Barrio Brasil, contrapartes públicas (MTT, MINEDUC, MINSAL, INE, SENAPRED, IND, CMN, SENADIS), estándar legal vinculado, código de consulta Overpass QL con botón interactivo de copia (`✓ ¡Copiado!`) y ejemplos de aplicación en la manzana universitaria UAH.
     - **04. Geodesia Conforme EPSG:32719 (WGS 84 / UTM Huso 19 Sur):** Demostración analítica de por qué no medir en grados (distorsión de ~19.3% a latitud -33.45°), ecuaciones conformes de Transverse Mercator (Snyder, 1987) y algoritmo de Gauss / Shoelace para áreas en $m^2$ y hectáreas.
     - **05. Evaluación de Calidad ISO 19157 & ohsome:** Métricas de completitud, exactitud temporal, densidad espacial por $km^2$ y linaje de colaboradores únicos con soporte dual v1 (OSHDB) y v2 (ohsomeDB).
     - **06. Marco Legal Abierto y Gobernanza Git:** Fundamentación del reemplazo de MIT y directrices para contribuir al repositorio mediante *Fork & Pull Request* bajo auditoría del mantenedor.
     - **07. Aparato Bibliográfico Extendido:** Compendio estructurado de literatura científica y normas técnicas.
   - **4 Diagramas Vectoriales Técnicos Estilo "Backrooms":**
     - *Figura 1:* Flujo de trabajo metodológico y arquitectura de ingesta/distribución VGI.
     - *Figura 2:* Transformación geodésica del elipsoide angular WGS 84 al plano conforme UTM 19S (Snyder, 1987).
     - *Figura 3:* Marco tripartito de licenciamiento abierto con reciprocidad comunitaria (*copyleft*).
     - *Figura 4:* Flujo de trabajo de contribución Git con revisión por permiso.

2. **Diccionario Territorial Interactivo y Cliqueable (`src/js/modulos/diccionario.js`):**
   - **Cuadrícula Superior de 8 Tarjetas Visuales:** Cada tarjeta presenta código (`CAT-01`), ícono temático, denominación formal, síntesis en lenguaje barrial claro y dos acciones inmediatas:
     - `[🔍 Filtrar]`: Inyecta el filtro en el buscador para aislar al instante las etiquetas de esa categoría.
     - `[📖 Manual ↗]`: Dispara la función `ModuloDiccionario.irACategoriaManual()`, conmutando automáticamente al Panel 08 y desplazándose con scroll suave hasta la ficha correspondiente.
   - **Insignias Cliqueables en Tablas:** En la tabla de 63 etiquetas OSM, la columna de categoría contiene botones dinámicos (`CAT-01 ↗`, `CAT-02 ↗`, etc.) que enlazan directamente con la sección metodológica del Manual. En la tabla de 14 atributos normalizados, los campos `categoria`, `superficie_m2` y `licencia` incorporan accesos directos a las secciones de Geodesia, Categorías y Gobernanza.

3. **Navegación Global Intermodular Suave (`window.navegarAManual` en `src/js/app.js`):**
   - Función global que conmuta el panel activo hacia `panel-manual`, calcula el offset de scroll y aplica una animación sutil de resaltado temporal (`.resaltado-temporal`) sobre el elemento destino para no desorientar al usuario.
   - Integración de `ModuloManual.render()` en el ciclo de carga de `cargarResumenMetodologia()`.

4. **Sustitución de la Licencia MIT por el Marco Abierto Tripartito (Chile / VGI):**
   - Se actualizó el archivo [`LICENSE`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/LICENSE), el módulo [`src/js/modulos/licencias.js`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/licencias.js), el [`README.md`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/README.md) y la [`docs/TRAZABILIDAD_ACADEMICA.md`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/docs/TRAZABILIDAD_ACADEMICA.md) (Sección 2.4):
     - **Contenido, Cartografía, Metadatos y Manual:** **CC BY-SA 4.0** (Creative Commons Atribución-CompartirIgual 4.0 Internacional), armonizado con la Ley N° 17.336 de Propiedad Intelectual y la Ley N° 20.285 de Datos Abiertos del Estado de Chile.
     - **Bases de Datos Espaciales VGI:** **ODbL 1.0** (Open Database License) de OpenStreetMap Foundation, obligando a compartir las bases derivadas bajo la misma licencia.
     - **Código Fuente Web y Backend:** **GNU AGPLv3** (Affero General Public License), garantizando que cualquier versión alojada en la web deba publicar su código fuente modificado.

5. **Gobernanza Git y Modelo de Contribución por Permiso:**
   - Se documentó el repositorio oficial en GitHub ([`https://github.com/GEOJOTA/atlas_vgi_uah`](https://github.com/GEOJOTA/atlas_vgi_uah)) y el protocolo de colaboración: clonación mediante *Fork*, creación de ramas temáticas (*feature branches*), envío de *Pull Request* con justificación temática y cita APA, y auditoría técnica obligatoria previa al merge en `main`.

6. **Robustecimiento Bibliográfico Extendido (64 Fuentes APA 7ª ed. sin Auto-Citación):**
   - Se incorporó en Hoja 4 de [`docs/categorias_tematicas_osm.xlsx`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/docs/categorias_tematicas_osm.xlsx), en el Manual web y en `docs/TRAZABILIDAD_ACADEMICA.md` la amplia revisión bibliográfica sobre VGI (Schuurman, Amano et al., Mooney et al., Tempelmeier & Demidova, Ballatore et al., Shahi, Burghardt et al., Seto et al., See et al., Antoniou & Skopeliti, Skopeliti & Antoniou, Kounadi & Leitner, Goodchild & Li, Soriano, Pastor, Magaña & Valverde, Jacobs & Zipf, Chapman, Wilkinson et al.) cruzada con las directrices contemporáneas 2024-2026 de UN-GGIM y DTPM, sin incluir auto-citaciones.
   - La función `sincronizar_todos_los_catalogos()` en [`scripts/generar_catalogos_excel.py`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/scripts/generar_catalogos_excel.py) sincroniza automáticamente tanto los archivos `.xlsx` como `TRAZABILIDAD_ACADEMICA.md` entre `docs/` y `src/docs/`.

---

### Verificación y Control de Calidad

- **Generación Excel:** `python3 scripts/generar_catalogos_excel.py` ejecutado con código 0. Verificado con `openpyxl`: Hoja 4 contiene exactamente **64 referencias bibliográficas oficiales y académicas** completas.
- **Sintaxis JavaScript:** Ejecución de pruebas con motor JavaScriptCore (`jsc`) sobre `manual.js`, `diccionario.js`, `licencias.js` y `app.js`: **0 errores léxicos o sintácticos**.
- **Consistencia de Archivos:** Comprobación de suma de comprobación entre `docs/TRAZABILIDAD_ACADEMICA.md` y `src/docs/TRAZABILIDAD_ACADEMICA.md`: idénticos al 100%.

---

## Entrega de turno 9 — Septiembre 2026 (Robustecimiento de Categorías Temáticas OSM para Chile, Catálogo Excel de 4 Hojas y Aparato Bibliográfico APA 7ª ed.)

### Contexto y Requerimiento de Desarrollo

En cumplimiento con el requerimiento de robustecimiento conceptual y documental del sistema ("*Robustece las categorías temáticas (archivo .xlsx en git) de OSM, integrando las más utilizadas en Chile (añade fuentes de donde lo sacaste, etc, todo debe ser trazable, en el mismo momento que la información se comparte, tipo APA y bibliografía)*"), se desarrolló una modernización integral del catálogo de entidades geoespaciales voluntarias, su representación en hojas de cálculo estandarizadas, el diccionario interactivo en la interfaz de usuario y la fundamentación epistemológica de la tesis de práctica profesional.

---

### Diagnóstico de Brechas Previas en el Esquema de Categorías

1. **Desconexión Ontológica entre el Estándar Internacional OSM y la Realidad Chilena:**
   - Las taxonomías genéricas de OpenStreetMap no contemplan singularidades institucionales críticas para la gestión del territorio en Chile, tales como la estructuración de la Atención Primaria de Salud (CESFAM, CECOSF, SAPU) bajo `amenity=clinic`, el sistema metropolitano de transporte Red Movilidad con codificación de paradas (`ref=PA...`), la normativa de accesibilidad universal establecida por el Decreto Supremo N° 50 del MINVU (OGUC Art. 2.2.8: rebajes de acera `kerb=lowered`/`flush`), o las tipologías patrimoniales vernáculas como los cités residenciales (`heritage=cite`).
2. **Ausencia de Trazabilidad Inmediata y Aparato Bibliográfico en el Archivo Excel:**
   - El archivo Excel previo solo contenía un listado plano de 8 categorías sin justificación empírica de frecuencias, sin correlación con capas del Sistema Nacional de Información Territorial (IDE Chile / SNIT), sin diccionario de datos atributivos y sin referencias bibliográficas formales que respaldaran la selección de etiquetas ante un comité académico.
3. **Falta de Sincronización entre Repositorio Git y Despliegue Web:**
   - Los archivos Excel generados en `docs/` no siempre se propagaban de forma transparente a `src/docs/`, provocando enlaces rotos o descargas de versiones desactualizadas en la plataforma web desplegada en Netlify.

---

### Soluciones Implementadas y Mejoras del Sistema

1. **Reestructuración y Generación Automatizada del Catálogo Excel (`scripts/generar_catalogos_excel.py`):**
   - Se rediseñó por completo la función `crear_categorias_tematicas_osm()` para generar un libro de trabajo en formato OpenXML (`.xlsx`) estructurado en **4 hojas complementarias con diseño visual editorial**:
     - **Hoja 1: `Categorías Maestras (Chile)`**: Define las 8 macro-categorías (CAT-01 Movilidad, CAT-02 Educación y Social, CAT-03 Salud, CAT-04 Comercio, CAT-05 Seguridad y Emergencias, CAT-06 Espacio Público y Deporte, CAT-07 Patrimonio Urbano, CAT-08 Medio Ambiente y Accesibilidad), su código temático ISO 19115 (`topicCategory`), contraparte ministerial del Estado, consulta base Overpass QL, frecuencia regional en Taginfo Chile y cita APA de respaldo.
     - **Hoja 2: `Catálogo de Etiquetas Chile`**: Tabula **63 etiquetas territoriales específicas de alta frecuencia en Chile**, detallando clave OSM, valor, denominación chilena en lenguaje natural, geometría admitida (punto, línea, polígono), capa homóloga en IDE Chile, institución estatal responsable, frecuencia regional observada, caso de aplicación real en el polígono piloto Barrio Brasil / Campus UAH y referencia APA vinculada.
     - **Hoja 3: `Diccionario Atributos VGI`**: Define los **14 atributos normalizados** del modelo de datos (`id_vgi`, `osm_id`, `categoria_codigo`, `nombre`, `tipo_geometria`, `operador_institucional`, `direccion_normalizada`, `accesibilidad_universal`, `superficie_m2`, `superficie_ha`, `srs_superficie`, `fecha_captura_vgi`, `linaje_procesamiento`, `licencia_datos`), incorporando explícitamente el cálculo geodésico proyectado a **EPSG:32719 (WGS 84 / UTM Huso 19 Sur)** según estándares del IGM e IDE Chile, con correspondencia a la norma ISO 19110:2016.
     - **Hoja 4: `Bibliografía y Fuentes APA`**: Consolida **33 fuentes oficiales, jurídicas, técnicas y científicas** redactadas rigurosamente bajo la norma **APA 7ª edición**, clasificadas por tipología documental (normas ISO/OGC, leyes y decretos de Chile, manuales y catálogos ministeriales, plataformas VGI colaborativas y literatura científica internacional de geografía).
   - Se implementó la función `sincronizar_todos_los_catalogos()`, garantizando la sincronización bidireccional automática entre la carpeta de documentación (`docs/`) y la raíz pública del frontend (`src/docs/`).

2. **Modernización del Diccionario Territorial Interactivo (`src/js/modulos/diccionario.js`):**
   - Se amplió el array `ETIQUETAS_TERRITORIALES_OSM` con la definición detallada de las 63 etiquetas chilenas, su tipología geométrica, organismo rector, equivalente oficial en IDE Chile y su respectiva cita bibliográfica APA con enlace hipertextual activo.
   - Se rediseñó la interfaz del Panel 06 con un encabezado descriptivo que incluye la justificación metodológica basada en [Taginfo Chile](https://taginfo.geofabrik.de/south-america:chile) y [WikiProject Chile](https://wiki.openstreetmap.org/wiki/WikiProject_Chile), sumando un botón de descarga directa para obtener [`docs/categorias_tematicas_osm.xlsx`](file:///Users/geojplescano/Programas/Pr%C3%A1ctica%20profesional%202026%20S2/nodo-geoabierto/docs/categorias_tematicas_osm.xlsx).
   - La tabla de etiquetas incorpora columnas dinámicas para la institución estatal, homólogo IDE Chile y botón modal de citación bibliográfica APA inmediata.

3. **Consolidación en la Documentación Académica (`docs/TRAZABILIDAD_ACADEMICA.md`):**
   - **Sección 2.6 ("Taxonomía de Categorías OSM Adaptada a Chile y Trazabilidad Bibliográfica APA")**: Desarrolla la fundamentación epistemológica de la traducción ontológica anglosajona-chilena, la matriz de las 8 macro-categorías, la justificación de las 63 etiquetas y la arquitectura de 4 hojas del catálogo Excel.
   - **Sección 7 ("Referencias Bibliográficas y Fuentes Oficiales - Norma APA 7ª Edición")**: Registra de forma exhaustiva las 33 fuentes documentales estructuradas en 5 sub-apartados temáticos, permitiendo al evaluador académico contrastar cualquier afirmación del proyecto con fuentes primarias del Estado de Chile o de la comunidad académica internacional.

---

### Verificación y Control de Calidad

- **Generación de Archivos Excel:** Ejecución exitosa de `python3 scripts/generar_catalogos_excel.py`. Se verificó mediante `openpyxl` que las 4 hojas poseen contenido íntegro, fórmulas correctas y celdas sin errores en ambos destinos (`docs/` y `src/docs/`).
- **Validación Sintáctica JavaScript:** Evaluación de `src/js/modulos/diccionario.js` con el motor JavaScriptCore (`jsc`), confirmando cero errores léxicos o de sintaxis y la carga íntegra de las 63 etiquetas territoriales.
- **Trazabilidad Git:** Todos los artefactos fueron preparados y versionados en la rama `main` del repositorio oficial.

---

## Entrega de turno 8 — Septiembre 2026 (Solución Integral a ohsome API v1/v2, Coherencia Intermodular entre Paneles y Autocarga Reactiva de Metadatos ISO 19115/19139)

### Diagnóstico de Fallos Identificados en ohsome API

1. **Bloqueo por Política de CORS y Restricciones en ohsome API v2 (`api.heigit.org`):**
   - Las consultas directas desde el navegador hacia el endpoint de HeiGIT `https://api.heigit.org/ohsome-api/v2-rc/` eran bloqueadas de forma estricta por el navegador debido a la política CORS (Cross-Origin Resource Sharing): las peticiones preflight OPTIONS retornaban HTTP 204 sin los encabezados `Access-Control-Allow-Origin: *`, y cualquier llamada GET no autenticada retornaba HTTP 401 Unauthorized sin cabeceras permisivas.
   - Se requería una arquitectura de intermediación a través de una función serverless (`/api/calidad` en Netlify) y un proxy local (`servidor_vgi.py`) para evitar las restricciones de origen cruzado en el cliente web.

2. **Disparidad Estructural en Esquemas JSON entre ohsome v1 (OSHDB) y v2 (ohsomeDB):**
   - La API v1 entrega los resultados y series cronológicas históricas bajo la propiedad `.result`, mientras que la API v2 los emite bajo la propiedad `.data`.
   - El código anterior asumía rígidamente la existencia de `.result`, lo que provocaba excepciones de tipo `TypeError: Cannot read properties of undefined` cuando se conmutaba a la versión 2.

3. **Incompatibilidad de `Array.prototype.at(-1)` en Navegadores:**
   - En `src/js/app.js` (líneas 1417 y 1418), se utilizaba la sintaxis moderna `array?.at(-1)`. En entornos de ejecución o navegadores legacy (Safari < 15.4, Firefox ESR institucional o webviews incrustados), este método no está disponible en el prototipo, provocando el fallo de la ejecución (`at is not a function`) y dejando el panel de resultados de calidad en blanco.

4. **Falta de Timeouts y Control de Bloqueos en Llamadas Asíncronas:**
   - Las llamadas a HeiGIT no contaban con límites estrictos de tiempo por sub-métrica, lo que causaba que si el endpoint de densidad o usuarios tardaba más de 10 segundos, la función serverless de Netlify caía en HTTP 504 Timeout o el navegador permanecía en estado de carga indefinido.

---

### Soluciones Implementadas y Mejoras del Sistema

1. **Reestructuración de `netlify/functions/calidad.js` (Arquitectura Proxy Dual):**
   - **Soporte Unificado v1 y v2:** Extracción dinámica y flexible mediante función auxiliar que procesa homogéneamente tanto `json.result` (v1) como `json.data` (v2).
   - **Control de Tiempos con `AbortController`:** Cada llamada outbound a HeiGIT cuenta con un timeout estricto de **5.500 ms**, garantizando que la función completa responda dentro del presupuesto de ejecución de 10 segundos de Netlify.
   - **Resiliencia ante Métricas Parciales:** Cada sub-petición (`/elements/count`, `/users/count`, `/contributions/count`, `/length`, `/area`) está encapsulada con `.catch(() => null)`. Si una métrica opcional no responde, el servicio entrega los datos de elementos y densidad sin interrumpir la experiencia del usuario.
   - **Identidad de Cliente Oficial:** Se incorporó el encabezado `User-Agent: AtlasVGI-UAH/2.0 (nodo.geoabierto@uahurtado.cl)` para prevenir bloqueos por filtrado anti-scraping de HeiGIT.

2. **Robustecimiento de `src/js/modulos/ohsome.js` (Doble Nivel de Tolerancia a Fallos):**
   - **Nivel 1 (Proxy Serverless / Backend Local):** Intenta consultar a través de `/api/calidad` con timeout de 7 segundos, eliminando cualquier bloqueo de CORS en el navegador.
   - **Nivel 2 (Conmutación Automática a ohsome v1 OSHDB):** Si la consulta v2 requiere API key o si el proxy no está disponible, el cliente web conmuta automáticamente y sin errores a `https://api.ohsome.org/v1` directo en el navegador, notificando de forma transparente al usuario con un aviso informativo.
   - **Sustitución Universal de `at(-1)`:** Reemplazo por acceso estándar indexado `arr[arr.length - 1]` con validación previa de longitud en todos los módulos de la aplicación.
   - **Sensibilidad Geométrica:** Soporte para entidades lineales (longitud en km) y poligonales (superficie en m² y ha).

3. **Caché y Proxy en Backend Local (`backend/servidor_vgi.py`):**
   - Implementación de almacenamiento en caché en disco (`data/cache_consultas/calidad_*.json`) para permitir funcionamiento fluido 100% offline durante demostraciones académicas o fallos de red internacional.

4. **Coherencia Intermodular entre Paneles de Consulta:**
   - Se diseñó e integró la matriz ontológica `MAPA_COHERENCIA_CATEGORIAS` en `src/js/app.js`, que conecta de forma semántica y funcional:
     - Las 8 categorías temáticas (Educación, Servicios, Transporte, Movilidad Activa, Espacio Público, Patrimonio, Accesibilidad, Biodiversidad).
     - Presets y sintaxis de Overpass QL (`amenity=university`, `highway=bus_stop`, `historic=*`, etc.).
     - Constructor de consultas personalizadas (claves, valores, operadores y entidad `nwr`).
     - Presets y filtros sintácticos de ohsome API (`building=* and type:way`, etc.).
     - Taxonomía urbana de GBIF (fauna, flora, insectos).
     - Metadatos ISO 19115 (Título, resumen temático, linaje y categoría ISO `MD_TopicCategoryCode`).
   - **Sincronización Reactiva:** Cualquier interacción en los botones de categoría del mapa atlas, las sugerencias ciudadanas de 1-clic, el selector de presets Overpass o el selector de ohsome propaga instantáneamente los parámetros coherentes a todos los demás paneles.
   - **Feedback Visual:** Incorporación de la insignia `#badge-sincronizacion` en la barra superior y la clase `.sincronizado-activo` en los botones temáticos.

5. **Autocarga Reactiva de Metadatos ISO 19115 / ISO 19139:**
   - La función `autocargarMetadatos()` actualiza en tiempo real los campos de título, resumen descriptivo, linaje, sistema de referencia (EPSG:32719 / EPSG:4326) y extensión Bbox en el panel de metadatos.
   - Se calcula e inyecta la superficie territorial en metros cuadrados ($m^2$) y hectáreas ($ha$) calculada bajo la proyección UTM Huso 19 Sur.
   - Genera automáticamente la vista previa formateada en el DOM y activa de inmediato los botones de descarga en JSON (ISO 19115) y XML (ISO 19139 / IDE Chile) sin requerir acciones manuales repetitivas.

---

## Entrega de turno 7 — Septiembre 2026 (Diagnóstico y Solución Integral de Consultas Overpass API, Sustitución de Espejos Caídos, Sanitización QL y Control de Timeouts)

### Diagnóstico de Fallos Identificados

1. **Servidores Espejo Caídos y Sobrecargados en Configuración Global:**
   - En `config/config.json`, `src/config/config.json` y `src/js/config.js`, los servidores configurados eran `overpass-api.de`, `overpass.kumi.systems` y `maps.mail.ru`.
   - Pruebas empíricas con cURL revelaron que `kumi.systems` y `maps.mail.ru` están permanentemente caídos (connection timeout), mientras que `overpass-api.de` sufría sobrecarga/bloqueo de IP con timeouts superiores a 15 segundos y errores HTTP 504 Gateway Timeout.
   - En contraste, los mirrors `https://overpass.openstreetmap.fr/api/interpreter` (Francia) y `https://lz4.overpass-api.de/api/interpreter` (Alemania LZ4) respondieron en menos de 2 segundos con código HTTP 200 y encabezados CORS abiertos (`Access-Control-Allow-Origin: *`).

2. **Ausencia de Declaración `out` en Consultas Personalizadas de Netlify Functions:**
   - En `netlify/functions/consulta.js`, cuando se enviaba una expresión QL como `nwr["amenity"="pharmacy"]({{bbox}});`, el backend le anteponía `[out:json]`, pero **nunca le agregaba la cláusula de salida `out geom tags qt 400;`**.
   - Sin una sentencia `out`, Overpass procesaba el filtro en memoria pero retornaba una lista vacía (`"elements": []`), provocando que todas las consultas de la interfaz mostraran "0 elementos encontrados".

3. **Inexistencia de Timeouts con `AbortController` en el Cliente Web (`osm.js`):**
   - Las llamadas `fetch(endpoint, ...)` en `src/js/modulos/osm.js` no contaban con señal de cancelación. Al intentar conectar con servidores caídos (`kumi.systems`, `mail.ru`), el navegador se quedaba congelado esperando el timeout de red por más de 90 segundos por cada servidor (más de 3 minutos de bloqueo total).

4. **Error de Referencia Nula en DOM (`osm-etiqueta`):**
   - En `src/js/app.js`, `manejarConsultaOSM` intentaba acceder a `document.getElementById('osm-etiqueta').value` directamente. Al no existir dicho campo en el formulario de presets, se disparaba un `TypeError: Cannot read properties of null (reading 'value')`, interrumpiendo la ejecución antes de emitir la petición HTTP.

### Soluciones Aplicadas y Verificación

1. **Renovación Completa de la Lista de Espejos Overpass:**
   - Se actualizaron todos los archivos de configuración (`config.json`, `src/config.json`, `config.js`, `consulta.js`, `servidor_vgi.py`, `extractor_vgi.py`) priorizando:
     1. `https://overpass.openstreetmap.fr/api/interpreter` (Principal activo, rápido y con CORS)
     2. `https://lz4.overpass-api.de/api/interpreter` (Mirror LZ4 de alta velocidad)
     3. `https://z.overpass-api.de/api/interpreter` (Espejo secundario Z)
     4. `https://overpass-api.de/api/interpreter` (Servidor principal como contingencia tardía)

2. **Timeouts Rápidos con `AbortController`:**
   - En `src/js/modulos/osm.js`: se incorporó un timeout estricto de **10 segundos por servidor**. Si un mirror no responde en 10s, se aborta inmediatamente y se conmuta al siguiente mirror en milisegundos.
   - En `netlify/functions/consulta.js`: se configuró un timeout de **6 segundos por servidor** para evitar agotar el presupuesto de 10s de las funciones serverless de Netlify.
   - En el cliente web: `fetch('/api/consulta')` ahora cuenta con timeout de 8 segundos, pasando de inmediato a la resolución directa en navegador si el backend tarda en responder.

3. **Sanitización Inteligente de Overpass QL:**
   - Tanto en `consulta.js` como en `servidor_vgi.py` y `osm.js`, se verifica si la consulta ya contiene directivas `[out:` y `out `. Si no tiene sentencia `out`, se le agrega automáticamente `\nout geom tags qt 400;` para asegurar el retorno de coordenadas vectoriales completas.
   - Se previene la doble anidación de bloques `( ... );` que causaba errores de sintaxis en Overpass.

4. **Corrección de Interfaz y Manejo de Errores Robustecido:**
   - Se añadió el campo `<input id="osm-etiqueta">` en `src/index.html` y se implementó encadenamiento opcional (`?.value`) en `src/js/app.js`.
   - Pruebas en vivo con CLI y cURL confirmaron la extracción inmediata de **192 elementos de educación** y **15 farmacias** en menos de 2 segundos.

---

## Entrega de turno 6 — Septiembre 2026 (Integración Sistemática de m² en Cálculos de Superficie, Densidades Territoriales y Geodesia Rigurosa EPSG:32719)

### Estado alcanzado en este turno

1. **Adopción del Metro Cuadrado ($m^2$) como Unidad Fundamental del Motor Geodésico:**
   - Se estableció el **metro cuadrado ($m^2$)** de manera homogénea y prioritaria en todos los componentes del sistema que cuantifican áreas espaciales, coberturas de suelo, huellas de edificación, extensiones de Bbox e indicadores de densidad.
   - Correspondencia matemática directa y documentada:
     $$1\text{ ha} = 10.000\text{ m}^2 \quad \Longleftrightarrow \quad 1\text{ km}^2 = 1.000.000\text{ m}^2$$
   - Todos los cálculos proyectados en UTM Huso 19 Sur devuelven métricas en $m^2$ euclidianos no distorsionados mediante la fórmula de Gauss (Shoelace), garantizando fidelidad topológica y geodésica.

2. **Cálculo de Superficies de Polígonos y Bounding Boxes en $m^2$:**
   - **Encuadres Territoriales Oficiales:**
     - *Barrio Brasil Completo:* $2.237.461\text{ m}^2$ ($223.75\text{ ha} / 2.2375\text{ km}^2$).
     - *Manzana Universidad Alberto Hurtado (UAH):* $1.361.006\text{ m}^2$ ($136.1\text{ ha} / 1.361\text{ km}^2$).
   - **Tooltip Dinámico del Bbox en Leaflet:** Al arrastrar o encuadrar el mapa, el indicador flotante reporta: `Área Bbox: X m² (Y ha / Z km²) [EPSG:32719]`.
   - **Ficha Territorial del Entorno:** Despliega de inmediato la *Superficie métrica calculada: X m² (Y ha / Z km²)*.

3. **Métricas de Densidad Multidimensional por $m^2$ en ohsome (v1 y v2):**
   - El módulo `src/js/modulos/ohsome.js` calcula y retorna ahora `densidadM2` (elementos/$m^2$) y `densidad1000m2` (elementos por cada 1.000 $m^2$), además de `densidadHa` (elementos/ha) y `densidad` (elementos/$km^2$).
   - La tarjeta de densidad territorial reporta la superficie de encuadre en $m^2$ y la densidad correspondiente, manteniendo visible el rótulo de reproyección a EPSG:32719.
   - En consultas de entidades poligonales (`building=*`, `leisure=park`), la métrica geométrica principal reporta el metraje cuadrado total cubierto ($m^2$), además de hectáreas y $km^2$.

4. **Tablas de Resultados y Catastro Vectorial:**
   - Tanto la tabla de consultas rápidas como la de consultas personalizadas incorporan la columna **Superficie ($m^2$)** para todas las entidades poligonales.
   - Insignia de totalización métrica (`#badge-area-total`): suma dinámicamente los $m^2$ de todos los polígonos mapeados y reporta la superficie acumulada en metros cuadrados y hectáreas.

5. **Estandarización Full-Stack (Metadatos, Diccionario, Exportaciones y CLI):**
   - **Metadatos ISO 19115/19139 (`metadatos.js`):** La ficha incorpora `superficie_m2`, `superficie_ha`, `superficie_km2` y `srs_superficie` en el bloque `extensionGeografica`, y la exportación XML añade el desglose métrico al elemento `<gmd:description>`.
   - **Diccionario Territorial (`diccionario.js`):** Nuevas entradas formales en `ATRIBUTOS_NORMALIZADOS` para `superficie_m2`, `superficie_ha` y `srs_superficie`, vinculadas a estándares IDE Chile y normas ISO.
   - **Exportación CSV y GeoJSON:** Los archivos descargados por el usuario contienen las columnas `superficie_m2`, `superficie_ha` y `srs_superficie`.
   - **Backend Serverless y Local (`calidad.js` y `servidor_vgi.py`):** Retornan `densidad_m2`, `densidad_ha`, `areaM2`, `areaHa`, `areaKm2` en sus respuestas JSON.
   - **Extractor CLI Python (`scripts/extractor_vgi.py`):** Añade `superficie_ha` al CSV de catastro e imprime en consola la superficie acumulada en metros cuadrados ($m^2$) y hectáreas ($ha$).

---

## Entrega de turno 5 — Septiembre 2026 (Listas Seleccionables Duales, Soporte Coexistente Técnico / No-Técnico, Robustecimiento de Referencias y Estándares ISO / PNIG)

### Estado alcanzado en este turno

1. **Listas Desplegables y Opciones Seleccionables en Todas las APIs (Soporte No Técnico):**
   - **Panel 01 (OSM / Overpass QL):**
     - Selector dinámico `#custom-valor-select` con más de 40 opciones temáticas comunes agrupadas por función barrial según la clave elegida (`amenity`, `shop`, `historic`, `highway`, `leisure`, `building`, `healthcare`, `emergency`, `tourism`), prellenando nombre de capa y color representativo automáticamente.
     - Selector de filtros de calidad y atributos condicionales `#custom-filtro-extra` (`con_nombre` [name], `accesibles` [wheelchair=yes], `con_direccion` [addr:street], `con_operador` [operator]).
   - **Panel 02 (ohsome API v1):**
     - Selector temático y geométrico `#oh-preset-selector` ampliado con 12 presets organizados en `optgroup` por tipo de geometría (Polígonos: conteo y superficie en m²/ha; Líneas: conteo y longitud en km; Puntos: conteo de nodos discretos).
     - Selector de intervalo temporal `#oh-intervalo-selector` (`P1Y` anual a 5 años, `P6M` semestral a 3 años, `P1M` mensual a 1 año).
   - **Panel 03 (GBIF Occurrence API):**
     - Selector de especies y grupos biológicos urbanos `#gbif-taxa-selector` clasificado por aves de Santiago Centro (chincol, zorzal, queltehue), flora y arbolado patrimonial nativo (peumo, quillay, palma chilena, jacarandá, pimiento) y polinizadores/insectos.
     - Selector de base de registro biológico `#gbif-basis-selector` (`ALL`, `HUMAN_OBSERVATION` para ciencia ciudadana como iNaturalist/eBird, `PRESERVED_SPECIMEN` para museos).
   - **Panel 04 (UMap):**
     - Selector de proyectos cartográficos comunitarios `#umap-preset-selector` con 5 mapas territoriales preconfigurados de Santiago Centro y Barrio Brasil (patrimonio arquitectónico, ciclovías, huertos urbanos, rutas accesibles y centros culturales).
   - **Panel 05 (Metadatos ISO):**
     - Selector de SRS `#md-srs-select` (WGS84 EPSG:4326, SIRGAS-Chile 2016 EPSG:5361, UTM Huso 19 Sur EPSG:32719).
     - Selector de régimen de licencias `#md-licencia-select` (ODbL 1.0, CC-BY 4.0, Datos Abiertos Gob Chile, Licencia Mixta VGI).
     - Selectores normalizados ISO de categoría temática `#md-categoria-iso` (`gmd:topicCategory`), frecuencia de mantenimiento `#md-frecuencia` (`asNeeded`, `monthly`, `quarterly`, `annually`, `continual`) y rol institucional `#md-rol-select` (`author`, `custodian`, `pointOfContact`, `distributor`).
   - **Panel 06 (Diccionario Territorial):**
     - Pestañas de filtrado rápido `#contenedor-filtros-diccionario` (Esquema VGI 10 atributos IDE, Educación/Servicios, Movilidad/Transporte, Plazas/Patrimonio, Accesibilidad/Biodiversidad).

2. **Preservación Estricta de Capacidades Avanzadas para Usuarios Técnicos (Arquitectura Dual):**
   - No se eliminó ninguna consulta compleja:
     - El **Modo Overpass QL libre** (`#custom-ql-codigo`) se mantiene 100% operativo con comodín `{{bbox}}` y botón toggle para analistas SIG.
     - Sincronización bidireccional: la selección de opciones actualiza el código QL en tiempo real y, a la inversa, cualquier usuario técnico puede editar el código a mano o ingresar valores libres usando la opción "✍️ manual".
     - Exportación de capas en **GeoJSON** y **CSV** estructurado directamente utilizables en QGIS y R/Python.
     - Script CLI `scripts/extractor_vgi.py` y servidor backend local `backend/servidor_vgi.py` con sistema de caché en disco (`data/cache_consultas/`).

3. **Aparato Crítico, Cajas Guías de Referencia y Documentación Exhaustiva:**
   - Incorporación en la interfaz de **5 cajas de guía metodológica (`.caja-guia-referencia`)**:
     - *OSM:* Explicación de nodos/vías/relaciones, clave=valor, Bbox y estándar ISO 19110.
     - *ohsome:* Dimensiones de calidad según ISO 19157 y tecnología OSHDB del HeiGIT.
     - *GBIF:* Estándar Darwin Core (TDWG) e integración de ciencia ciudadana.
     - *UMap:* Principios de cartografía social y comunitaria.
     - *Metadatos:* Perfil Nacional de Metadatos de Chile (ISO 19115 / ISO 19139), SNIT / IDE Chile y Ley 20.285.
   - Cada métrica, capa y etiqueta cuenta con explicación accesible para personas no técnicas y referencias académicas con DOI/URL para revisión formal por comités evaluadores.

4. **Especificación de Formatos ISO, Enlaces Oficiales y Relación con la PNIG (Chile) y UN-GGIM:**
   - Formalización en [`docs/TRAZABILIDAD_ACADEMICA.md`](docs/TRAZABILIDAD_ACADEMICA.md) de los estándares:
     - **ISO 19115-1:2014:** `https://www.iso.org/standard/53798.html`
     - **ISO 19139:2007:** `https://www.iso.org/standard/32574.html`
     - **ISO 19157:2013 / 19157-1:2023:** `https://www.iso.org/standard/32575.html`
     - **ISO 19110:2016:** `https://www.iso.org/standard/57303.html`
     - **Comité ISO/TC 211:** `https://committee.iso.org/home/tc211`
     - **Darwin Core (TDWG):** `https://dwc.tdwg.org/`
     - **Política Nacional de Información Geoespacial (PNIG):** `https://www.ide.cl/index.php/informacion-institucional/politica-nacional` (Decreto N° 28/2006 MBN).
     - **Ley N° 20.285 de Transparencia y Datos Abiertos:** `https://www.leychile.cl/Navegar?idNorma=278858`
     - **UN-GGIM / Marco IGIF:** `https://ggim.un.org/` (Vías 4, 6 y 7).

5. **Soporte Dual para ohsome API v1 y ohsome API v2 (HeiGIT) con Fallback Automático:**
   - **Arquitectura de Coexistencia Tecnológica:**
     - Soporte nativo para **ohsome API v1** (`https://api.ohsome.org/v1/`, motor OSHDB/Java) como motor predeterminado y 100% abierto (sin requerir credenciales ni registro previo, garantizando acceso universal a estudiantes y comunidades).
     - Soporte para la nueva **ohsome API v2-rc** (`https://api.heigit.org/ohsome-api/v2-rc/`, motor ohsomeDB con PostgreSQL/PostGIS/Citus y Python) con campo seguro para HeiGIT API Key (gestor Tyk Gateway) y persistencia en `localStorage`.
   - **Mecanismo de Resiliencia y Fallback Transparente:**
     - Si el usuario opta por la v2 sin clave o si la consulta es rechazada por el gateway (HTTP 401), el cliente conmuta de forma automática y transparente al motor v1, asegurando que ninguna persona no técnica experimente una pantalla de error.
   - **Implementación Homogénea Full-Stack:**
     - Actualizado el cliente web (`src/js/modulos/ohsome.js` y `src/js/app.js`), la función serverless (`netlify/functions/calidad.js`) y el servidor local en Python (`backend/servidor_vgi.py`).

6. **Delimitación Estricta del Alcance Territorial Operativo (Barrio Brasil Completo y Manzana UAH):**
   - **Depuración de Territorios Predefinidos:**
     - Se eliminaron del catálogo de selección los sectores metropolitanos externos (Santiago Centro casco cívico, Providencia y Lo Barnechea), concentrando el alcance de análisis 100% en el caso de estudio prioritario de la práctica profesional de Geografía.
   - **Territorios Operativos Disponibles:**
     - **Barrio Brasil Completo (hasta Plaza Brasil):** `[-70.6720, -33.4505, -70.6580, -33.4350]`, abarcando la Zona Típica, Plaza Brasil, Huérfanos, Compañía, Av. Brasil y el eje Alameda.
     - **Manzana Universidad Alberto Hurtado (UAH):** `[-70.6675, -33.4505, -70.6565, -33.4385]`, cubriendo el campus patrimonial (calles Almirante Barroso, Erasmo Escala, Cienfuegos y estación de Metro Los Héroes).
   - **Sincronización Integral Full-Stack:**
     - Actualización de `config/config.json`, `src/config/config.json`, el selector en `src/index.html`, la función reactiva `poblarSelectorTerritorios()` en `src/js/app.js` y la configuración de contingencia en `src/js/config.js`.

7. **Abordaje Multi-Entidad Coherente y Geometrías Mixtas en las 8 Categorías Temáticas VGI:**
   - **Enriquecimiento Taxonómico y Temático Coherente:**
     - Cada una de las 8 categorías temáticas oficiales del Atlas se amplió para capturar múltiples entidades territoriales interconectadas metodológicamente:
       - *CAT-01 Educación:* Universidades, institutos, colegios, jardines infantiles, bibliotecas públicas y huellas de edificios/campus.
       - *CAT-02 Servicios y Comercio Barrial:* Locales de proximidad (almacenes, panaderías, ferias), gastronomía comunitaria, farmacias, consultorios, bancos, cajeros y centros cívicos.
       - *CAT-03 Movilidad y Transporte:* Paraderos Red, estaciones de Metro (Los Héroes, Santa Ana, Cumming), bocas de acceso, andenes, terminales y ejes viales primarios.
       - *CAT-04 Movilidad Activa y Ciclovías:* Ciclovías segregadas, ciclobandas, sendas compartidas, biciestacionamientos públicos y UAH, arriendos y talleres mecánicos de bicicletas.
       - *CAT-05 Áreas Verdes y Espacio Público:* Plazas mayores (Plaza Brasil), plazoletas, multicanchas, juegos infantiles, bandejones arbolados, bancos de reposo y bebederos.
       - *CAT-06 Patrimonio y Cultura:* Inmuebles de Conservación Histórica (ICH), Zona Típica Barrio Brasil, Casonas Neoclásicas UAH, Basílica del Salvador, iglesias, museos, murales y memoriales.
       - *CAT-07 Accesibilidad Universal:* Rebajes de cordón/solera, cruces peatonales, guías podotáctiles, rampas, veredas continuas y equipamientos accesibles.
       - *CAT-08 Biodiversidad Urbana:* Arbolado de alineación (Av. Brasil), filas de árboles, parches de vegetación, jardines comunitarios y registros de avifauna/flora de GBIF.
   - **Soporte de Geometrías Mixtas (Puntos, Líneas y Polígonos Reales):**
     - Se actualizó el formato de salida Overpass a `out geom tags qt 400;` para recibir los nodos y geometrías vectoriales completas de vías (`way`).
     - El normalizador GeoJSON (`elementosAGeoJSON` y `elementos_a_geojson`) discrimina ahora automáticamente entre:
       - *Polígonos:* Huellas cerradas de edificios, plazas, recintos universitarios y áreas verdes (`Polygon`).
       - *Líneas:* Trazados de ciclovías, ejes viales estructurantes, sendas peatonales y filas arbóreas (`LineString`).
       - *Puntos:* Equipamientos discretos, paraderos, rebajes de solera, árboles individuales y especímenes biológicos (`Point`).
   - **Renderizado Cartográfico y Popups Dinámicos:**
     - El visor Leaflet (`src/js/modulos/mapa.js`) dibuja ahora polígonos con relleno y contorno, líneas vectoriales continuas y marcadores de círculo, e incluye una insignia visual con el tipo de geometría (`Punto 📍`, `Línea 〰️`, `Polígono ⬡`) en cada popup informativo.

8. **Reproyección Geodésica a EPSG:32719 para Cálculo Coherente de Superficies y Densidad:**
   - **Formulación Conforme Oficial (ISO 19111 / Snyder, 1987 / IGM Chile / IDE Chile):**
     - Creación de `src/js/modulos/geodesia.js` con las ecuaciones analíticas de Transverse Mercator para proyectar de WGS 84 (EPSG:4326) a **EPSG:32719** (WGS 84 / UTM Huso 19 Sur, elipsoide WGS84, meridiano central 69°O, factor de escala $k_0=0.9996$, falso este $500.000\text{ m}$, falso norte $10.000.000\text{ m}$).
     - Cálculo de áreas métricas euclidianas mediante la fórmula de Gauss (Shoelace) sobre coordenadas proyectadas UTM 19S, eliminando distorsiones angulares en grados decimales o esferas simplificadas a la latitud de Santiago (-33.44°).
   - **Integración Full-Stack en Cliente, Backend y CLI:**
     - `src/js/modulos/geodesia.js`: funciones exportadas `wgs84aUTM19S`, `calcularSuperficiePoligono`, `calcularSuperficieBbox`.
     - `src/js/modulos/ohsome.js`: `calcularDensidad(bbox, cantidad)` evalúa el área métrica del Bbox con EPSG:32719, retornando $m^2$, $ha$, $km^2$ y densidad coherente.
     - `src/js/modulos/osm.js`: `elementosAGeoJSON` calcula `superficie_m2`, `superficie_ha`, `superficie_km2` y `srs_superficie` para toda geometría `Polygon`.
     - `src/js/modulos/mapa.js`: muestra la superficie ($m^2$ y $ha$) con insignia `(EPSG:32719)` en cada popup y actualiza dinámicamente el tooltip del Bbox con su superficie en hectáreas y $km^2$.
     - `src/js/app.js`: actualiza la ficha del territorio seleccionado con su superficie reprojectada exacta (Barrio Brasil: $223.75\text{ ha}$; Manzana UAH: $136.1\text{ ha}$), tarjeta de densidad ohsome con badge destacado de reproyección a EPSG:32719 y párrafo explicativo en rigor metodológico.
     - `netlify/functions/calidad.js` & `backend/servidor_vgi.py`: funciones geodésicas en Node.js y Python 3 estándar para cálculo métrico de Bbox y polígonos.
     - `scripts/extractor_vgi.py`: cálculo de superficie métrica proyectada en GeoJSON y adición de columnas `superficie_m2` y `srs_superficie` en CSV exportado.
   - **Transparencia y Expresión Explícita para Usuarios Técnicos y No Técnicos:**
     - Documentación teórica y fórmulas matemáticas incorporadas en `docs/TRAZABILIDAD_ACADEMICA.md`, `.caja-guia-referencia` del panel ohsome en `src/index.html` y badges visuales en el visor cartográfico y paneles de indicadores.

---

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
