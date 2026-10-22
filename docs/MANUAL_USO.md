# Manual de Uso — Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Atlas VGI · UAH)

**Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Versión del Sistema:** 132 Capas Operativas (122 Oficiales + 10 VGI) · 146 Descriptores Técnicos (ISO 19110) · 10 Módulos Funcionales (`01` al `10`) · 9 Storyboards Territoriales con Modal Interactivo · 5 Dimensiones Analíticas.

---

## 🧭 Índice de Contenidos

1. [Fundamentación y Alcance del Sistema](#1-fundamentación-y-alcance-del-sistema)
2. [Arquitectura de la Interfaz y Navegación](#2-arquitectura-de-la-interfaz-y-navegación)
3. [Operación Funcional por Módulo (01 al 10)](#3-operación-funcional-por-módulo-01-al-10)
   - [3.1. Módulo 01 · Visor para la Gestión Territorial](#31-módulo-01--visor-para-la-gestión-territorial)
   - [3.2. Módulo 02 · Consultas Overpass (Explorador OSM)](#32-módulo-02--consultas-overpass-explorador-osm)
   - [3.3. Módulo 03 · Biodiversidad GBIF](#33-módulo-03--biodiversidad-gbif)
   - [3.4. Módulo 04 · Cartografía Participativa uMap](#34-módulo-04--cartografía-participativa-umap)
   - [3.5. Módulo 05 · Indicadores & Storyboards Territoriales (con Modal HD)](#35-módulo-05--indicadores--storyboards-territoriales-con-modal-hd)
   - [3.6. Módulo 06 · Calidad & ICV (ISO 19157 / ohsome / OSMCha)](#36-módulo-06--calidad--icv-iso-19157--ohsome--osmcha)
   - [3.7. Módulo 07 · Manual de Uso y Manual de Actualización Técnica](#37-módulo-07--manual-de-uso-y-manual-de-actualización-técnica)
   - [3.8. Módulo 08 · Metadatos ISO 19115 / ISO 19139](#38-módulo-08--metadatos-iso-19115--iso-19139)
   - [3.9. Módulo 09 · Diccionario de Datos (132 Capas / 146 Descriptores)](#39-módulo-09--diccionario-de-datos-131-capas--140-descriptores)
   - [3.10. Módulo 10 · Licencias & Catálogos](#310-módulo-10--licencias--catálogos)
4. [Referencias Bibliográficas y Normativas (Norma APA 7ª Edición)](#4-referencias-bibliográficas-y-normativas-norma-apa-7ª-edición)

---

## 1. Fundamentación y Alcance del Sistema

El **Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Atlas VGI · UAH)** es una plataforma web abierta diseñada para articular la cartografía oficial del Estado de Chile con levantamientos comunitarios y colaborativos (*Volunteered Geographic Information*, VGI; Goodchild, 2007; Haklay, 2010).

El sistema aborda las tensiones y transformaciones del territorio a tres escalas operacionales:
1. **Escala Micro / Barrial**: Diagnóstico exhaustivo del **Barrio Brasil** y el entorno del Campus Patrimonial de la Universidad Alberto Hurtado.
2. **Escala Comunal**: La **Comuna de Santiago**, analizando su zonificación urbana, el Plan Regulador Comunal (PRC), sus 10 modificaciones históricas (1990–2024) y su catastro predial.
3. **Escala Macro / Metropolitana**: El **Gran Santiago y la Región Metropolitana**, integrando el Plan Regulador Metropolitano de Santiago (PRMS 100), redes de movilidad pública (Metro, Red Movilidad, paraderos DTPM, semáforos UOCT), amenazas naturales (SERNAGEOMIN) y gestión ambiental de residuos (SUBDERE).

> [!NOTE]
> Para conocer la arquitectura de software, el protocolo de sincronización o las pautas para incorporar o modificar componentes del sistema, consulte el documento maestro: [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

## 2. Arquitectura de la Interfaz y Navegación

La interfaz de usuario implementa un diseño táctico oscuro (*dark mode*), organizado en tres componentes persistentes:
- **Barra de Navegación Superior**: Permite alternar instantáneamente entre los 10 módulos (`01` al `10`), desplegar métricas globales de capas y acceder a la documentación.
- **Lienzo Cartográfico Central (Leaflet 1.9.4)**: Visor espacial con controles de capas base (CartoDB DarkMatter, OpenStreetMap Standard, Satélite ESRI), navegación 2D/3D, escala gráfica y herramientas de selección.
- **Panel Lateral Contextual**: Muestra controles específicos de capa, fichas atributivas, formularios de consulta, calculadoras de calidad e informes normativos según el módulo activo.

---

## 3. Operación Funcional por Módulo (01 al 10)

### 3.1. Módulo 01 · Visor para la Gestión Territorial
- **Visualización y Cruce de Coberturas**: Permite activar y desactivar cualquiera de las **132 capas operativas** (122 oficiales y 10 colaborativas VGI). Al seleccionar un elemento en el mapa, se despliega una ficha emergente con sus atributos normalizados, institución custodia, superficie proyectada métrica y enlace de descarga GeoJSON individual.
- **Cálculo en Tiempo Real del Índice de Calidad VGI (ICV)**: Evalúa dinámicamente el encuadre cartográfico activo (*Bounding Box*), reportando el grado de confiabilidad y densidad de información geográfica.
- **Inspector Normativo PRC/OGUC (Certificado CIN-VGI)**: Al hacer clic en cualquier punto de la Comuna de Santiago, el sistema realiza una intersección espacial y emite el **Certificado de Informaciones Normativas VGI**, detallando:
  1. Zonificación comunal (`PRC`) e intercomunal (`PRMS`).
  2. Usos de suelo permitidos y prohibidos según el Art. 2.1.24 de la OGUC.
  3. Áreas de riesgo (Art. 2.1.17 OGUC) y zonas de protección patrimonial (ZCH/ICH y Ley N° 17.288).
  4. Expediente histórico de las **10 modificaciones al PRC de Santiago (1990–2024)** incidentes en Barrio Brasil, con hipervínculo a los expedientes oficiales de Asesoría Urbana.
- **Importación Local de Archivos**: Herramienta de arrastrar y soltar (*drag & drop*) que admite archivos `.geojson`, `.kml`, `.gpx` y Shapefiles comprimidos (`.zip`), procesados localmente en la memoria del navegador.

> 🛠️ **Referencia de Actualización:** Para añadir nuevas capas oficiales o modificar el Inspector Normativo, consulte los **Procedimientos 1 y 5** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.2. Módulo 02 · Consultas Overpass (Explorador OSM)
- **Extracción de Datos en Tiempo Real**: Ejecuta sentencias en lenguaje Overpass QL contra los servidores de OpenStreetMap dentro del área visualizada en el mapa.
- **Plantillas Preconfiguradas**: Cuenta con filtros inmediatos para equipamientos educativos, centros de salud, comercio de proximidad, movilidad activa, arbolado y accesibilidad universal.
- **Consola Libre y Descarga**: Permite editar código Overpass QL avanzado y descargar las geometrías recuperadas directamente en formato GeoJSON.

> 🛠️ **Referencia de Actualización:** Para modificar o incorporar nuevas plantillas de consulta Overpass, consulte el **Procedimiento 10** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.3. Módulo 03 · Biodiversidad GBIF
- **Ocurrencias Biológicas Darwin Core**: Conexión directa a la API pública de GBIF y registros validados de iNaturalist para consultar observaciones de flora, fauna y funga urbana en la Región Metropolitana.
- **Filtros Taxonómicos**: Clasificación rápida por reinos (Plantae, Animalia, Fungi) y clases (Aves, Insecta, Magnoliopsida), con despliegue de fecha, observador y fotografía de validación comunitaria.

> 🛠️ **Referencia de Actualización:** Para ajustar endpoints o parámetros taxonómicos en GBIF, consulte el **Procedimiento 11** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.4. Módulo 04 · Cartografía Participativa uMap
- **Integración de Mapas Colaborativos**: Espacio dedicado a la incrustación y vinculación de proyectos colaborativos en uMap generados en talleres vecinales y jornadas de cartografía social.
- **Intercambio Espacial**: Permite transferir capas comunitarias levantadas en terreno hacia el lienzo del Visor Territorial para su cruce con datos del Estado.

> 🛠️ **Referencia de Actualización:** Para incrustar o enlazar nuevos proyectos uMap, consulte el **Procedimiento 12** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.5. Módulo 05 · Indicadores & Storyboards Territoriales (con Modal HD)
El módulo articula el análisis aplicado en dos dimensiones complementarias:
1. **5 Dimensiones Analíticas de las 132 Capas**:
   - **01 · Sociodemográfica** (19 capas): Censo 2024 (INE), densidad, hogares y migración.
   - **02 · Socioeconómica** (18 capas): Inversión pública BIP, patentes comerciales y avalúo fiscal SII.
   - **03 · Socioambiental** (36 capas): Áreas verdes, arbolado, islas de calor, ruido y las 13 capas de Residuos Sólidos Domiciliarios (SUBDERE RSD 2024).
   - **04 · Sociosanitaria** (3 capas): Red de salud primaria/hospitalaria MINSAL y vulnerabilidad RSH.
   - **05 · Sociourbana o Habitabilidad** (55 capas): Zonificación PRC/PRMS, patrimonio ZCH, cités, red de transporte (Metro, Red, UOCT) y ciclovías.

2. **9 Storyboards Territoriales con Modal Interactivo**:
   Láminas monográficas con fundamentación teórica, indicadores clave (KPIs), tablas sintéticas y material gráfico:
   - *Lámina 1 · Habitar, Altura y Presión sobre el Tejido Patrimonial.*
   - *Lámina 2 · Caminar y Pedalear el Barrio: Rebajes Peatonales, Ciclovías y la Malla UOCT.*
   - *Lámina 3 · El Oasis Verde del Barrio Brasil: Cobertura Arbórea y Biodiversidad.*
   - *Lámina 4 · Campus UAH y Vitalidad Económica Cotidiana.*
   - *Lámina 5 · Cuidados, Envejecimiento y Salud Comunitaria.*
   - *Lámina 6 · Metabolismo Urbano y Gestión de Residuos Sólidos Domiciliarios (SUBDERE RSD 2024).*
   - *Lámina 7 · Treinta Años de Disputa Normativa: Las 10 Modificaciones al PRC en Barrio Brasil (1990–2024).*
   - *Lámina 8 · Dinámicas Demográficas y Censo 2024: Densidad, Hogares y Envejecimiento.*
   - *Lámina 9 · Morfología Urbana, Segmentos Viales y Vértices Espaciales.*

- **Ampliación de Figuras y Gráficos (Modal HD)**: Al hacer clic sobre cualquier imagen, gráfico comparativo o diagrama SVG dentro de los storyboards, se abre un visor modal a pantalla completa para su inspección visual de alta resolución, con epígrafe metodológico y controles de cierre (tecla `Escape`, botón de cierre o clic externo).

> 🛠️ **Referencia de Actualización:** Para redactar, enriquecer o modificar storyboards y sus gráficos, consulte el **Procedimiento 4** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.6. Módulo 06 · Calidad & ICV (ISO 19157 / ohsome / OSMCha)
- **Evaluación de Calidad Multicriterio (ISO 19157:2013)**: Combina linealmente (WLC / AHP) cinco dimensiones de calidad cartográfica: completitud, consistencia lógica, exactitud posicional, exactitud temática y calidad temporal.
- **Series Temporales Históricas (ohsome API - HeiGIT)**: Consulta la evolución diacrónica de nodos, vías y polígonos creados en OpenStreetMap desde 2008 hasta el presente.
- **Auditoría de Conjuntos de Cambios (OSMCha)**: Conexión con OSMCha para auditar usuarios, fuentes declaradas (*imagery*, terreno) y detectar potenciales actos de vandalismo o errores topológicos en el área de estudio.

> 🛠️ **Referencia de Actualización:** Para calibrar ponderadores de calidad o consultar endpoints ohsome, consulte el **Procedimiento 13** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.7. Módulo 07 · Manual de Uso y Manual de Actualización Técnica
- **Centro Documental Embebido**: Despliega la documentación interactiva del Atlas dentro de la propia interfaz de usuario.
- Permite alternar entre el **Manual de Uso** (orientado a la operación funcional y analítica) y el **Manual de Actualización Técnica** (orientado a la mantención de código, ingesta de capas y despliegue continuo), con enlaces de descarga directa en formato Markdown.

> 🛠️ **Referencia de Actualización:** Para actualizar el contenido de las guías interactivas, consulte `src/js/modulos/manual.js` y el **Procedimiento 7** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.8. Módulo 08 · Metadatos ISO 19115 / ISO 19139
- **Generación y Exportación Formal de Metadatos**: Produce fichas de metadatos espaciales normalizadas bajo **ISO 19115-1:2014**, **ISO 19139:2007** y el **Perfil Nacional de Metadatos de Chile v2.0 (IDE Chile / SNIT)**.
- Documenta: título, resumen, propósito, linaje, sistema de referencia de coordenadas (`EPSG:4326`, `EPSG:32719`), restricciones de uso y custodia institucional, con exportación en esquemas `XML` y `JSON`.

> 🛠️ **Referencia de Actualización:** Para agregar o actualizar registros de metadatos institucionales, consulte el **Procedimiento 8** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.9. Módulo 09 · Diccionario de Datos (132 Capas / 146 Descriptores)
- **Catálogo de Objetos y Atributos (ISO 19110:2016)**: Provee la definición técnica, tipo de dato, dominio de valores y significado conceptual de los **146 descriptores de atributos** correspondientes a las 132 coberturas del Atlas.
- Incluye el diccionario íntegro de las 13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios (**SUBDERE 2024**, `bbdd_86` a `bbdd_98`), preservando la correspondencia con las geodatabases `.gpkg` originales.

> 🛠️ **Referencia de Actualización:** Para modificar descriptores o incorporar atributos de nuevas capas, consulte el **Procedimiento 9** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

### 3.10. Módulo 10 · Licencias & Catálogos
- **Marco Jurídico de Licenciamiento Abierto**: Informa sobre los regímenes legales aplicables: **ODbL 1.0** para OpenStreetMap, **CC BY-SA 4.0 / CC-BY 4.0** para cartografías derivadas y registros GBIF, **GNU AGPLv3** para el código fuente del Atlas, **Ley N° 20.285** de Transparencia Pública y **Ley N° 19.628** de Protección de la Vida Privada.
- **Descarga de Matrices en Formato Excel**: Enlaces directos para descargar los catálogos consolidados del proyecto en formato `.xlsx` (`catalogo_fuentes_vgi.xlsx`, `categorias_tematicas_osm.xlsx` y `perfil_metadatos_vgi.xlsx`).

> 🛠️ **Referencia de Actualización:** Para actualizar términos legales o regenerar los archivos Excel, consulte el **Procedimiento 14** del [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

## 4. Referencias Bibliográficas y Normativas (Norma APA 7ª Edición)

- Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016). *The GeoJSON Format* (RFC No. 7946). Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC7946
- Goodchild, M. F. (2007). Citizens as sensors: The world of volunteered geography. *GeoJournal*, 69(4), 211–221. https://doi.org/10.1007/s10708-007-9111-y
- Haklay, M. (2010). How good is volunteered geographical information? A case study of OpenStreetMap in the UK. *Environment and Planning B: Planning and Design*, 37(4), 682–703. https://doi.org/10.1068/b35097
- Ilustre Municipalidad de Santiago — Asesoría Urbana. (1990–2024). *Repositorio Oficial de Modificaciones Históricas al Plan Regulador Comunal de Santiago* [Expedientes digitales: Mod. N° 16, N° 21, N° 26, N° 31, Enmiendas N° 1, 2, 3 y 6]. https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz
- Infraestructura de Datos Espaciales de Chile [IDE Chile]. (2018). *Perfil Nacional de Metadatos de Chile v2.0 (Basado en ISO 19115:2003 / ISO 19139:2007)*. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. https://www.ide.cl/
- International Organization for Standardization [ISO]. (2013). *Geographic information — Data quality* (ISO Standard No. 19157:2013). ISO. https://www.iso.org/standard/32575.html
- International Organization for Standardization [ISO]. (2014). *Geographic information — Metadata — Part 1: Fundamentals* (ISO Standard No. 19115-1:2014). ISO. https://www.iso.org/standard/53798.html
- International Organization for Standardization [ISO]. (2016). *Geographic information — Methodology for feature cataloguing* (ISO Standard No. 19110:2016). ISO. https://www.iso.org/standard/57303.html
- International Organization for Standardization [ISO]. (2019). *Geographic information — Referencing by coordinates* (ISO Standard No. 19111:2019). ISO. https://www.iso.org/standard/74033.html
- Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE]. (2024). *Catastro Nacional de Instalaciones de Recepción y Disposición Final de Residuos Sólidos Domiciliarios (RSD) y Diccionario Técnico Geodatabase*. Gobierno de Chile.
