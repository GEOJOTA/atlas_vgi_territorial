# Manual de Uso — Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Atlas VGI · UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Caso de Estudio:** Barrio Brasil, Campus Universidad Alberto Hurtado, Comuna de Santiago y Región Metropolitana de Chile.

---

## 🧭 Índice de Contenidos

1. [Fundamentación y Alcance del Sistema](#1-fundamentación-y-alcance-del-sistema)
2. [Arquitectura de la Interfaz](#2-arquitectura-de-la-interfaz)
3. [Operación Funcional por Módulo (00 al 09)](#3-operación-funcional-por-módulo-00-al-09)
   - [3.1. Módulo 00 · Visor para la Gestión Territorial](#31-módulo-00--visor-para-la-gestión-territorial)
   - [3.2. Módulo 01 · Consultas Overpass (Explorador OSM)](#32-módulo-01--consultas-overpass-explorador-osm)
   - [3.3. Módulo 02 · Calidad & ICV (ISO 19157 / ohsome / OSMCha)](#33-módulo-02--calidad--icv-iso-19157--ohsome--osmcha)
   - [3.4. Módulo 03 · Biodiversidad GBIF](#34-módulo-03--biodiversidad-gbif)
   - [3.5. Módulo 04 · Cartografía Participativa uMap](#35-módulo-04--cartografía-participativa-umap)
   - [3.6. Módulo 05 · Metadatos ISO 19115 / ISO 19139](#36-módulo-05--metadatos-iso-19115--iso-19139)
   - [3.7. Módulo 06 · Diccionario de Datos (131 Capas / 140 Descriptores)](#37-módulo-06--diccionario-de-datos-131-capas--140-descriptores)
   - [3.8. Módulo 07 · Licencias & Catálogos](#38-módulo-07--licencias--catálogos)
   - [3.9. Módulo 08 · Manual de Uso y Manual de Actualización Técnica](#39-módulo-08--manual-de-uso-y-manual-de-actualización-técnica)
   - [3.10. Módulo 09 · Indicadores & Storyboards Territoriales](#310-módulo-09--indicadores--storyboards-territoriales)
4. [Referencias Bibliográficas y Normativas (Norma APA 7ª Edición)](#4-referencias-bibliográficas-y-normativas-norma-apa-7ª-edición)

---

## 1. Fundamentación y Alcance del Sistema

El **Atlas de Información Geográfica Voluntaria (Atlas VGI)** constituye una plataforma web de código abierto diseñada para articular la cartografía oficial del Estado de Chile con información geográfica voluntaria (*Volunteered Geographic Information*, VGI; Goodchild, 2007; Haklay, 2010) en procesos de diagnóstico multiescalar, evaluación normativa e investigación aplicada sobre el **Barrio Brasil** y su contexto metropolitano.

La arquitectura consolidada del sistema integra:

- **131 coberturas geográficas operativas (`EPSG:4326`, WGS84 / SIRGAS-Chile)**:
  - **121 capas oficiales del Estado**: Infraestructura de Datos Espaciales de Chile (IDE Chile / SNIT), Ministerio de Vivienda y Urbanismo (MINVU: PRC, PRMS, ZCH/ICH, Cités), Instituto Nacional de Estadísticas (INE: Censo 2024), Ministerio de Transportes y Telecomunicaciones (MTT / DTPM / UOCT), Ministerio de Desarrollo Social y Familia (MDSF: RSH / BiDat), Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE: 13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios 2024), Ministerio del Medio Ambiente (MMA), SERNAGEOMIN, Consejo de Monumentos Nacionales (CMN), Ministerio de Salud (MINSAL / DEIS) y Servicio de Impuestos Internos (SII).
  - **10 macro-categorías colaborativas VGI (`CAT-01` a `CAT-10`)**: Levantamientos comunitarios en OpenStreetMap (OSM) y registros biológicos georreferenciados en GBIF / iNaturalist.
- **140 descriptores técnicos normalizados** en el Diccionario de Datos (conformes a ISO 19110:2016), incluyendo los diccionarios nativos de columnas extraídos desde las geodatabases `.gpkg` del catastro SUBDERE RSD 2024.
- **10 módulos funcionales (`00` al `09`)** y **7 Storyboards territoriales** estructurados según los cuatro perfiles de actor territorial del proyecto (*Institución Pública*, *Comunidad Vecinal*, *Mapeador Voluntario* y *Academia/ONGs*).

---

## 2. Arquitectura de la Interfaz

La interfaz de usuario se estructura en tres unidades operativas interconectadas:

1. **Barra superior de navegación modular (Módulos `00` a `09`)**: Permite la conmutación entre el visor cartográfico y los módulos de extracción, auditoría de calidad, metadatos, diccionario, licenciamiento, documentación e indicadores sin alterar el estado de las capas cargadas en memoria.
2. **Lienzo cartográfico interactivo (Módulo 00)**: Representación espacial 2D/3D dotada de selector de encuadre territorial (*Barrio Brasil Completo* de $223,75\text{ ha}$ o *Manzana UAH* de $136,10\text{ ha}$), delimitación manual de recuadros de consulta (*Bounding Box* con cálculo métrico en $\text{m}^2$ y $\text{ha}$ bajo proyección `EPSG:32719`), importación de archivos vectoriales locales (`.kmz`, `.kml`, `.geojson`, `.gpx`, `.csv`) y exportación directa de coberturas individuales (`.geojson`) o de la geodatabase íntegra (`.zip`).
3. **Panel lateral de gestión territorial**:
   - **📊 Métricas**: Reporta en tiempo real el conteo de capas y entidades activas junto al cálculo dinámico del **Índice de Calidad VGI (ICV)** (*Completitud Espacial*, *Actualidad Reciente*, *Atribución Completa* y *Calidad Estimada*).
   - **🏛 Capas IDE**: Buscador indexado y acordeones temáticos para la activación selectiva de las 121 capas estatales y las 10 categorías VGI.
   - **⚖ Normativa**: Inspector espacial de instrumentos de planificación territorial (PRC/PRMS/OGUC), restricciones de riesgo y protección patrimonial.
   - **⬚ Cargar / ⚡ BD PostGIS**: Ingesta de coberturas locales en sesión y enlace opcional a motor espacial PostGIS.

---

## 3. Operación Funcional por Módulo (00 al 09)

### 3.1. Módulo 00 · Visor para la Gestión Territorial
- **Superposición y consulta de coberturas**: La activación de capas desde el panel lateral renderiza las geometrías sobre el lienzo principal (recomendándose la superposición simultánea de 2 a 4 coberturas para preservar la legibilidad cartográfica). La selección de cualquier entidad despliega su tabla de atributos normalizados, la institución custodia, la superficie proyectada en `EPSG:32719` (para polígonos) y el enlace de descarga individual en formato `GeoJSON` (RFC 7946; Butler et al., 2016).
- **Evaluación Normativa e Historial del PRC de Santiago (1990–2024)**: La activación del **⚖ Inspector Normativo** ejecuta una intersección espacial punto-en-polígono sobre la ubicación seleccionada, emitiendo el **Certificado de Informaciones Normativas VGI (CIN-VGI)**. Dicho reporte sistematiza:
  1. La zonificación comunal (`PRC`) e intercomunal (`PRMS`).
  2. Los usos de suelo permitidos (`UPERM`) y prohibidos (`UPROH`) conforme al principio de exclusión negativa del **Art. 2.1.24 de la OGUC**.
  3. Las áreas de riesgo (**Art. 2.1.17 OGUC**) y regímenes de protección patrimonial (**Zonas e Inmuebles de Conservación Histórica y Ley N° 17.288 del CMN**).
  4. El **Expediente Histórico de Modificaciones al PRC de Santiago incidentes en el Barrio Brasil (1990–2024)**, que documenta los 10 hitos regulatorios del sector (Res. N° 26/1990, Seccional Brasil, Modificaciones N° 16, 21, 26 y 31, Enmienda N° 2 de Cités, Enmiendas de Altura N° 1, 3 y 6 y postergaciones selectivas Art. 117 LGUC), vinculando directamente al repositorio documental oficial de Asesoría Urbana de la Ilustre Municipalidad de Santiago (`https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz`).

### 3.2. Módulo 01 · Consultas Overpass (Explorador OSM)
Ejecuta extracciones en tiempo real sobre la base de datos de OpenStreetMap acotadas al *Bounding Box* activo, operando tanto mediante consultas temáticas preconfiguradas (educación, salud, transporte, movilidad activa, espacio público, patrimonio, accesibilidad y arbolado) como mediante código libre en lenguaje **Overpass QL** (Olbricht, 2023), con exportación directa a `GeoJSON`.

### 3.3. Módulo 02 · Calidad & ICV (ISO 19157 / ohsome / OSMCha)
Instrumenta la auditoría cuantitativa de calidad espacial bajo el estándar **ISO 19157:2013** en tres niveles:
- **Submódulo A (Evaluador Multicriterio WLC / ISO 19157)**: Cuantifica completitud, exactitud posicional, consistencia lógica y vigencia temporal sobre las coberturas cargadas.
- **Submódulo B (ohsome API — HeiGIT)**: Procesa series históricas de evolución del mapeo colaborativo (conteo de nodos, longitud de redes en metros y área poligonal en $\text{m}^2$ reproyectada a `EPSG:32719`; Raifer et al., 2019).
- **Submódulo C (OSMCha / Changesets)**: Audita los conjuntos de cambios recientes en el área de estudio para verificar autoría, semántica de etiquetas y consistencia topológica (Wille, 2023).

### 3.4. Módulo 03 · Biodiversidad GBIF
Integra ocurrencias biológicas georreferenciadas de flora, fauna y funga urbana provenientes de **GBIF** e **iNaturalist Chile** estructuradas bajo el estándar *Darwin Core (DwC)* (TDWG, 2023; Chapman, 2005a), permitiendo la filtración taxonómica y su representación cartográfica.

### 3.5. Módulo 04 · Cartografía Participativa uMap
Incorpora proyectos colaborativos alojados en **uMap** destinados a talleres de cartografía social, levantamiento de percepciones barriales y validación comunitaria en terreno, habilitando la transferencia de sus capas hacia el visor principal.

### 3.6. Módulo 05 · Metadatos ISO 19115 / ISO 19139
Genera y exporta fichas formales de metadatos conforme a **ISO 19115-1:2014**, **ISO 19139:2007** y el **Perfil Nacional de Metadatos de Chile v2.0 (IDE Chile / SNIT, 2018)**, documentando identificación, linaje metodológico, sistemas de referencia (`EPSG:4326`, `EPSG:5361`, `EPSG:32719`), custodia institucional y régimen de licencias en formatos `JSON` y `XML`.

### 3.7. Módulo 06 · Diccionario de Datos (131 Capas / 140 Descriptores)
Formaliza el catálogo de objetos y atributos según **ISO 19110:2016**, especificando definición semántica, dominio de valores, fuente institucional y correspondencia con el catálogo nacional de IDE Chile para las **131 capas geográficas** y **9 tablas de referencia** (140 descriptores en total). Incluye el diccionario íntegro de las 13 coberturas del **Catastro Nacional de Residuos Sólidos Domiciliarios (SUBDERE 2024, `BBDD-86` a `BBDD-98`)**.

### 3.8. Módulo 07 · Licencias & Catálogos
Documenta el régimen jurídico tripartito del proyecto —**ODbL 1.0** para bases de datos OpenStreetMap, **CC BY-SA 4.0 / CC-BY 4.0** para cartografía y registros GBIF, **GNU AGPLv3** para el código fuente, **Ley N° 20.285** de Transparencia y **Ley N° 19.628** de resguardo estadístico de datos personales— y provee acceso directo a las matrices consolidadas en formato Excel (`.xlsx`).

### 3.9. Módulo 08 · Manual de Uso y Manual de Actualización Técnica
Disponibiliza en interfaz tanto el presente **Manual de Uso** como el **Manual de Actualización y Mantención Técnica (`MANUAL_ACTUALIZACION_ATLAS.md`)**, junto con el inventario dinámico filtrable de las 131 coberturas y enlaces de descarga documental en formato Markdown (`.md`).

### 3.10. Módulo 09 · Indicadores & Storyboards Territoriales
Articula el análisis aplicado del Barrio Brasil en dos niveles:
1. **Clasificación en 5 Dimensiones Analíticas (131 capas)**:
   - **01 · Sociodemográfica** (`19 capas`): Censo 2024 (INE), densidad poblacional, estructura etaria, migración e índice socioeconómico.
   - **02 · Socioeconómica** (`18 capas`): Inversión pública BIP, comercio barrial, ferias libres, patentes municipales y avalúo fiscal SII.
   - **03 · Socioambiental** (`36 capas`): Áreas verdes, arbolado viario, islas de calor, biodiversidad GBIF, amenazas naturales y las **13 capas de Residuos Sólidos Domiciliarios SUBDERE 2024**.
   - **04 · Sociosanitaria** (`3 capas`): Red asistencial MINSAL/DEIS, territorios de servicios de salud y dependencia funcional RSH.
   - **05 · Sociourbana o Habitabilidad** (`55 capas`): Zonificación PRC/PRMS, patrimonio ZCH/ICH, cités, movilidad (Metro, DTPM, UOCT, ciclovías) y seguridad urbana.
2. **7 Storyboards Territoriales**:
   Estudios empíricos que integran indicadores clave (KPIs), gráficos comparativos, diagramas vectoriales SVG, tablas sintéticas, utilidad diferenciada por perfil de actor territorial y aparato bibliográfico en norma APA 7ª edición:
   - *1. Metamorfosis del Habitar: Entre Casonas, Cités y Presión Inmobiliaria.*
   - *2. Caminar y Pedalear el Barrio: Rebajes Peatonales, Ciclovías y la Malla UOCT.*
   - *3. Oasis Bioclimático: Plaza Brasil y la Red de Biodiversidad Vegetal Oculta.*
   - *4. Universidad, Estudiantes y Almacenes: El Ecosistema de Proximidad UAH.*
   - *5. Cuidados Invisibles y Envejecimiento: Radiografía de la Salud en el RSH.*
   - *6. Metabolismo Urbano y Residuos Sólidos Domiciliarios (SUBDERE RSD 2024).*
   - *7. Treinta Años de Disputa Normativa: Las Modificaciones al PRC en Barrio Brasil (1990–2024).*

---

## 4. Referencias Bibliográficas y Normativas (Norma APA 7ª Edición)

El aparato crítico completo del proyecto (125 referencias formales) se encuentra sistematizado en [`docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`](docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md) y en [`docs/TRAZABILIDAD_ACADEMICA.md`](docs/TRAZABILIDAD_ACADEMICA.md):

- Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016). *The GeoJSON Format* (RFC No. 7946). Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC7946
- Goodchild, M. F. (2007). Citizens as sensors: The world of volunteered geography. *GeoJournal*, 69(4), 211–221. https://doi.org/10.1007/s10708-007-9111-y
- Haklay, M. (2010). How good is volunteered geographical information? A case study of OpenStreetMap in the UK. *Environment and Planning B: Planning and Design*, 37(4), 682–703. https://doi.org/10.1068/b35097
- Heynen, N., Kaika, M., & Swyngedouw, E. (2006). *In the nature of cities: Urban political ecology and the politics of urban metabolism*. Routledge.
- Ilustre Municipalidad de Santiago — Asesoría Urbana. (1990–2024). *Repositorio Oficial de Modificaciones Históricas al Plan Regulador Comunal de Santiago* [Expedientes digitales: Mod. N° 16, N° 21, N° 26, N° 31, Enmiendas N° 1, 2, 3 y 6]. https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz
- Infraestructura de Datos Espaciales de Chile [IDE Chile]. (2018). *Perfil Nacional de Metadatos de Chile v2.0 (Basado en ISO 19115:2003 / ISO 19139:2007)*. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. https://www.ide.cl/
- International Organization for Standardization [ISO]. (2013). *Geographic information — Data quality* (ISO Standard No. 19157:2013). ISO. https://www.iso.org/standard/32575.html
- International Organization for Standardization [ISO]. (2014). *Geographic information — Metadata — Part 1: Fundamentals* (ISO Standard No. 19115-1:2014). ISO. https://www.iso.org/standard/53798.html
- International Organization for Standardization [ISO]. (2016). *Geographic information — Methodology for feature cataloguing* (ISO Standard No. 19110:2016). ISO. https://www.iso.org/standard/57303.html
- López-Morales, E. (2015). Gentrification by ground rent dispossession: The shadows cast by large-scale urban renewal in Santiago de Chile. *International Journal of Urban and Regional Research*, 39(4), 756–772.
- Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019). OSHDB: A framework for spatio-temporal analysis of OpenStreetMap history data. *EPJ Data Science*, 8(1), 1–18. https://doi.org/10.1140/epjds/s13688-019-0208-0
- Smith, N. (1987). Gentrification and the rent gap. *Annals of the Association of American Geographers*, 77(3), 462–465.
- Snyder, J. P. (1987). *Map projections: A working manual* (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. https://doi.org/10.3133/pp1395
- Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE]. (2024). *Catastro Nacional de Instalaciones de Recepción y Disposición Final de Residuos Sólidos Domiciliarios (RSD) y Diccionario Técnico Geodatabase*. Gobierno de Chile.
