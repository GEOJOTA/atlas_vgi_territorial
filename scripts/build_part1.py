# -*- coding: utf-8 -*-
"""
scripts/build_part1.py
Genera scripts/manual_p01_genesis_metodologia.py
Capítulos 01 al 04: Ficha Técnica y Alcance Operativo, Formulación Estratégica (Objetivo General y OE 1 a OE 4),
Matriz de Fases e Hitos del Plan de Trabajo (11 Semanas / 300 Horas) y los Cuatro Perfiles de Actores Territoriales.
"""

import os

BASE_DIR = "/Users/geojplescano/Programas/Práctica profesional 2026 S2/nodo-geoabierto"
OUTPUT_FILE = os.path.join(BASE_DIR, "scripts", "manual_p01_genesis_metodologia.py")

part1_text = r"""# PARTE I: ALCANCE OPERATIVO, FORMULACIÓN ESTRATÉGICA Y PERFILES TERRITORIALES

---

## Identificación y Alcance Operativo del Proyecto

El **Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Nodo GeoAbierto)** es una infraestructura sociotécnica de datos espaciales, análisis urbano y visualización cartográfica interactiva desarrollada en el marco del **Programa de Práctica Profesional de la Carrera de Geografía** de la **Universidad Alberto Hurtado (UAH)** durante el segundo semestre académico del año 2026.



### Propósito y Misión Operativa
El proyecto surge de la necesidad de subsanar los vacíos de información territorial a microescala existentes en los instrumentos tradicionales de planificación y en las bases de datos catastrales del Estado de Chile. Mientras la información oficial presenta desactualización temporal y baja granularidad para equipamientos de escala barrial, la dinámica urbana cotidiana evoluciona con rapidez.

El Atlas opera como una **plataforma abierta y reproducible que articula geodatos abiertos (OpenStreetMap y GBIF), capas oficiales del Estado (IDE Chile, MINVU, INE, MTT/UOCT, MDSF) y herramientas analíticas multicriterio**, democratizando el acceso a diagnósticos territoriales a escala de Manzana Censal y Unidad Vecinal.

### Delimitación Geodésica y Cobertura Territorial
El área de estudio piloto corresponde a un polígono continuo de **223,75 hectáreas** emplazado en el sector poniente de la comuna de Santiago Centro. Su delimitación geodésica estricta se encuentra definida en coordenadas geográficas WGS84 (EPSG:4326) y en su proyección métrica conforme oficial SIRGAS-Chile / UTM Huso 19 Sur (EPSG:32719):

$$\text{BBox}_{\text{Barrio Brasil}} = [-70.6720, -33.4505, -70.6580, -33.4350]$$

* **Límite Norte:** Eje vial de Avenida San Pablo y calle Rosas (transición hacia Barrio Yungay).
* **Límite Sur:** Eje estructurante de Avenida Libertador Bernardo O'Higgins / Alameda (corredor de transporte metropolitano, Línea 1 de Metro con estaciones Los Héroes y República).
* **Límite Oriente:** Eje vial de Avenida Manuel Rodríguez (trinchera de la Autopista Central - Ruta 5 Norte-Sur).
* **Límite Poniente:** Eje vial de Avenida Ricardo Cumming y calle García Reyes.

---

## Formulación Estratégica: Objetivos del Plan de Trabajo

La estructura estratégica y operativa del proyecto se organiza rigurosamente conforme al plan de trabajo formal de la Práctica Profesional de Geografía (2026), articulado en un **Objetivo General** y **cuatro Objetivos Específicos (OE 1 a OE 4)** con asignación horaria explícita y metas verificables:

```text
┌────────────────────────────────────────────────────────────────────────┐
│             ESTRUCTURA ESTRATÉGICA FORMAL (300 HORAS / 11 SEMANAS)     │
├────────────────────────────────────────────────────────────────────────┤
│ • OE 1: Caracterización y Diseño Conceptual (Sem 1–3 · 72 Horas)       │
│ • OE 2: Geodatabase y Calidad Espacial (Sem 4–7 · 120 Horas)           │
│ • OE 3: Geoportal Web Interactivo (Sem 8–10 · 72 Horas)                │
│ • OE 4: Validación y Transferibilidad (Sem 11 · 36 Horas)              │
└────────────────────────────────────────────────────────────────────────┘
```

### Objetivo General de la Práctica Profesional
> **Desarrollar un prototipo de Atlas de Información Geográfica Voluntaria (VGI) reproducible, interoperable y centrado en usuarios que subsane vacíos de información territorial en Barrio Brasil y campus UAH, articulando geodatos abiertos, cartografía participativa y herramientas analíticas para la gestión local y la investigación académica.**

---

### Objetivos Específicos y Metas Operativas

#### Objetivo Específico 1 (OE 1): Caracterización y Diseño Conceptual
* **Asignación Horaria:** Semanas 1 a 3 · 72 Horas Planificadas · **100% Cerrado (Hitos 1, 2 y 3).**
* **Definición Formal:**
  > Diagnosticar el escenario territorial de Barrio Brasil, revisar plataformas VGI referenciales (OSM, GBIF, IDE Chile) y estructurar la arquitectura conceptual: 10 macrocategorías VGI y 4 perfiles de actores territoriales.
* **Componentes Ejecutados:**
  - Delimitación operativa del polígono piloto de 223,75 ha que articula el casco patrimonial poniente y las sedes del campus UAH.
  - Revisión exhaustiva de plataformas de geodatos abiertos (OpenStreetMap, GBIF, ohsome API v1/v2) y servicios WFS/WMS de IDE Chile.
  - Estructuración de las **10 Macrocategorías Comunitarias VGI (CAT-01 a CAT-10)** normalizadas bajo etiquetas OSM y Darwin Core.
  - Modelamiento conceptual de los **4 Perfiles de Actores Territoriales** bajo el estándar de Diseño Centrado en el Usuario (ISO 9241-210).
* **Entregables Acreditados:** Ficha técnica del proyecto, documento metodológico de arquitectura conceptual y catálogo preliminar de fuentes VGI.

#### Objetivo Específico 2 (OE 2): Geodatabase y Calidad Espacial
* **Asignación Horaria:** Semanas 4 a 7 · 120 Horas Planificadas · **Hitos 4 y 5 Cerrados / Hito 6 en Proceso.**
* **Definición Formal:**
  > Diseñar y poblar la geodatabase espacial: descarga de 118 capas (108 oficiales + 10 VGI, 2,56 GB). Auditoría completa de MetaCalidad ISO 19157 (97,88%) e inyección universal de 14 columnas ISO en descargas.
* **Componentes Ejecutados:**
  - Descarga, normalización y geoprocesamiento de 118 coberturas vectoriales (108 oficiales del Estado de Chile + 10 VGI comunitarias), totalizando 2,56 GB de datos en EPSG:4326 y EPSG:32719.
  - Almacenamiento espacial estructurado en clúster relacional PostgreSQL 17 + PostGIS 3.3 (Supabase Cloud) con más de 1.552.000 entidades indexadas mediante árboles GiST y claves JSONB con índices GIN.
  - Formulación y ejecución del **Modelo de MetaCalidad WLC v2.0 bajo norma ISO 19157:2013**, integrando 5 componentes cuantitativos (topología, completitud, geodésica, esquema y granularidad) y 5 componentes cualitativos (metadatos núcleo, linaje, conformidad ISO, escala y accesibilidad), certificando un **97,88% de metacalidad global (Grado A+ Excelente)**.
  - Inyección algorítmica universal del **Esquema Maestro de 14 Atributos Normalizados ISO** en la totalidad de capas vectoriales para descargas transparentes.
* **Entregables Acreditados:** Geodatabase espacial PostGIS/GeoJSON, matriz analítica de calidad ISO 19157 en XLSX/JSON y catálogo maestro de 131 capas cartográficas.

#### Objetivo Específico 3 (OE 3): Geoportal Web Interactivo
* **Asignación Horaria:** Semanas 8 a 10 · 72 Horas Planificadas · **80% Anticipado (Hitos 7 y 8).**
* **Definición Formal:**
  > Implementar el geoportal interactivo con visor Leaflet 1.9.4, conexión a APIs en vivo (Overpass, ohsome, GBIF), generador de metadatos ISO 19115/19139, diccionario territorial y despliegue continuo en Netlify.
* **Componentes Ejecutados:**
  - Desarrollo de una Single Page Application (SPA) bajo arquitectura Zero-Build Vanilla JavaScript (ES6+), garantizando portabilidad absoluta y costo recurrente $0.
  - Implementación del visor cartográfico interactivo (Leaflet 1.9.4) con control de capas en acordeón jerárquico, selectores de mapas base y herramientas de medición de distancias y superficies.
  - Programación del **Inspector Normativo Territorial del PRC de Santiago**, que ejecuta en el navegador el algoritmo de geometría computacional *Ray-Casting (Point-in-Polygon)* para emitir instantáneamente el Certificado de Informaciones Normativas VGI (CIN-VGI).
  - Integración dinámica en tiempo real con Overpass QL API, ohsome API v1/v2 (HeiGIT) y GBIF Occurrence API.
  - Generador de fichas de metadatos estandarizadas en XML ISO 19139 conforme al Perfil Nacional de Metadatos de IDE Chile / SNIT v2.0.
  - Despliegue continuo (CI/CD) alojado en la red perimetral de **Netlify Edge CDN** (`https://atlasvgiuah.netlify.app/`).
* **Entregables Acreditados:** Plataforma web en producción activa, 10 módulos funcionales operativos y código fuente sincronizado en GitHub.

#### Objetivo Específico 4 (OE 4): Validación y Transferibilidad
* **Asignación Horaria:** Semanas 10 a 11 · 36 Horas Planificadas · **En Ejecución (Hitos 9 y 10).**
* **Definición Formal:**
  > Evaluar empíricamente la plataforma mediante pruebas guiadas con usuarios reales bajo estándar ISO 9241-11, redactar manuales metodológicos de administración y elaborar el informe final de titulación.
* **Componentes en Ejecución:**
  - Protocolo de pruebas de usabilidad guiadas con actores territoriales reales pertenecientes a los 4 perfiles de usuarios definidos, midiendo efectividad, eficiencia y satisfacción percibida conforme a la norma ISO 9241-11.
  - Redacción y publicación del **Manual de Actualización Técnica y Transferibilidad** (>5000 líneas), documentando exhaustivamente la arquitectura, scripts Python, PostGIS, netlify.toml y resolución de incidentes.
  - Compilación del archivo comprimido maestro unificado `atlas_vgi_uah_base_datos_completa.zip` (543 MB comprimidos / 3,33 GB crudos, 256 archivos) para descarga pública.
  - Elaboración de la memoria final de práctica profesional y preparación para el examen de título.

---

## Matriz de Cumplimiento de los 10 Hitos del Plan de Trabajo

```mermaid
flowchart TD
    subgraph FASE1["FASE I: Caracterización y Diseño Conceptual (Sem 1–3 · 72h)"]
        H1["Hito 1: Diagnóstico Territorial & Revisión de Fuentes"] --> H2["Hito 2: Taxonomía 10 Cat. VGI & 4 Perfiles Actor"]
        H2 --> H3["Hito 3: Inventario de Fuentes & Detección de Brechas"]
    end

    subgraph FASE2["FASE II: Geodatabase Espacial & Calidad ISO (Sem 4–7 · 120h)"]
        H4["Hito 4: Extracción Overpass QL & Descarga 118 Capas"] --> H5["Hito 5: Modelo WLC ISO 19157 (97,88%) & 14 Atributos"]
        H5 --> H6["Hito 6: Cruces Espaciales & Análisis Multidimensional"]
    end

    subgraph FASE3["FASE III: Geoportal Web & Despliegue (Sem 8–10 · 72h)"]
        H7["Hito 7: SPA Leaflet 1.9.4 & APIs en Vivo"] --> H8["Hito 8: Inspector PRC & Despliegue Netlify CDN"]
    end

    subgraph FASE4["FASE IV: Validación & Transferibilidad (Sem 10–11 · 36h)"]
        H9["Hito 9: Pruebas de Usabilidad ISO 9241-11"] --> H10["Hito 10: Manual Maestro, ZIP 543MB & Cierre Titulación"]
    end

    FASE1 --> FASE2
    FASE2 --> FASE3
    FASE3 --> FASE4
```

| Hito | Denominación Oficial | OE Asociado | Semanas | Horas | Estado | Entregable Acreditado |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **Hito 1** | Diagnóstico territorial, delimitación y revisión de plataformas VGI. | **OE 1** | Sem 01–02 | 36 hrs | **100% Cerrado** | Ficha de proyecto, BBox oficial y revisión de fuentes. |
| **Hito 2** | Estructuración de 10 macrocategorías VGI y 4 perfiles multiactor. | **OE 1** | Sem 02–03 | 24 hrs | **100% Cerrado** | Taxonomía temática y perfiles de usuario DCU. |
| **Hito 3** | Inventario exhaustivo de fuentes colaborativas y oficiales. | **OE 1** | Sem 03 | 12 hrs | **100% Cerrado** | Catálogo formal de fuentes y matriz de brechas. |
| **Hito 4** | Pipeline de descarga y extracción automatizada de geodatos. | **OE 2** | Sem 04–05 | 40 hrs | **100% Cerrado** | Scripts Python y 118 capas vectoriales pobladas. |
| **Hito 5** | Auditoría de calidad ISO 19157 (WLC v2.0) e inyección de 14 atributos. | **OE 2** | Sem 05–06 | 40 hrs | **100% Cerrado** | Certificación 97,88% IGV y esquema universal inyectado. |
| **Hito 6** | Cruces espaciales barriales y análisis en 5 dimensiones territoriales. | **OE 2** | Sem 06–07 | 40 hrs | **En Progreso** | Matrices de priorización y densidades de equipamiento. |
| **Hito 7** | Arquitectura SPA Zero-Build, visor Leaflet 1.9.4 y APIs en vivo. | **OE 3** | Sem 08–09 | 40 hrs | **100% Cerrado** | Geoportal web operativo con 10 módulos interactivos. |
| **Hito 8** | Inspector Normativo PRC, Storyboards barriales y Netlify Edge CDN. | **OE 3** | Sem 09–10 | 32 hrs | **100% Cerrado** | Certificado CIN-VGI Ray-Casting y URL en producción. |
| **Hito 9** | Validación empírica con usuarios reales bajo estándar ISO 9241-11. | **OE 4** | Sem 10–11 | 18 hrs | **En Ejecución** | Pautas de usabilidad y registro de retroalimentación. |
| **Hito 10** | Suite de integridad (8 tests), ZIP masivo 543 MB y Manual Maestro. | **OE 4** | Sem 11 | 18 hrs | **En Ejecución** | Validador 8/8 PASS, paquete ZIP y manual de +5000 líneas. |

---

## Los Cuatro Perfiles de Actores Territoriales (Alineación con Plataforma Web en Vivo)

En estricta coherencia con la interfaz web desplegada en producción (`https://atlasvgiuah.netlify.app/`) y el selector dinámico `#sel-perfil-usuario` configurado en `src/index.html` y `src/js/app.js`, el Atlas estructura sus herramientas y accesos en torno a **cuatro perfiles de actores territoriales** formulados bajo el enfoque de Diseño Centrado en el Usuario (*User-Centered Design*, ISO 9241-210):

```text
┌────────────────────────────────────────────────────────────────────────┐
│             LOS 4 PERFILES DE ACTORES TERRITORIALES (EN VIVO)          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 🏛 Autoridades / Instituciones (IDE / Municipio)      [institucion]  │
│ 2. 🗫 Organizaciones Comunitarias / Vecinos               [comunidad]    │
│ 3. ⌖ Mapeadores / Voluntarios OSM                        [voluntario]   │
│ 4. 🔬 ONGs / Territoriales                                [ong]          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Perfil 1: Autoridades / Instituciones (IDE / Municipio) [`institucion`]
* **Definición Canónica en Plataforma:**
  > *"🏛 Perfil Institucional / Municipal / IDE Chile: Prioriza metadatos normalizados (ISO 19115/19139), catastro de equipamiento crítico, licencias abiertas y control de calidad espacial."*
* **Actores Destinatarios:** Profesionales de la Secretaría Comunal de Planificación (SECPLA), Dirección de Obras Municipales (DOM), Dirección de Medio Ambiente, Aseo y Ornato (DIMAO) de la Municipalidad de Santiago; analistas sectoriales de ministerios (MINVU, MOP, MIDESO/RSH, MTT/UOCT) y equipo de IDE Chile / SNIT.
* **Requerimientos Territoriales Críticos:**
  - Consulta y verificación espacial de las 192 zonas normativas del Plan Regulador Comunal de Santiago (PRC) mediante el **Inspector Normativo Territorial**, obteniendo usos de suelo permitidos (UPERM), usos prohibidos (UPROH), alturas máximas y coeficientes de constructibilidad.
  - Cruce de iniciativas de inversión pública del Banco Integrado de Proyectos (BIP / MDSF) con la cobertura censal del INE Censo 2024 a nivel de Manzana y Zona Censal.
  - Auditoría de metadatos conforme al Perfil Nacional de Metadatos de Chile (Decreto N° 28 de Bienes Nacionales) y descarga de archivos XML estructurados bajo norma ISO 19139:2007.
* **Paneles y Módulos Prioritarios en la SPA:**
  1. `metadatos-iso`: Generador y visualizador de metadatos estandarizados ISO 19115 / ISO 19139.
  2. `inicio` (Módulo 00): Inspector Normativo PRC (Certificado CIN-VGI) y árbol de 108 capas oficiales.
  3. `diccionario`: Homologación de descriptores territoriales entre la OGUC, el PRC y la cartografía.
  4. `licencias`: Matriz de gobernanza legal, licencias estatales y catálogo de capas en OpenXML (.xlsx).

---

### Perfil 2: Organizaciones Comunitarias / Vecinos [`comunidad`]
* **Definición Canónica en Plataforma:**
  > *"🗫 Perfil Comunitario / Vecinal: Facilita consultas rápidas en 1 clic para plazas, patrimonio, ciclovías, comercios locales y mapeo barrial colaborativo en UMap."*
* **Actores Destinatarios:** Junta de Vecinos N° 1 Barrio Brasil, comités de vivienda de cités y pasajes residenciales, colectivos de patrimonio barrial, asambleas vecinales, comerciantes tradicionales y residentes locales.
* **Requerimientos Territoriales Críticos:**
  - Acceso inmediato en 1 clic a la ubicación de servicios de proximidad: centros de salud familiar (CESFAM DEIS), farmacias populares, puntos limpios y áreas verdes.
  - Reconocimiento y visibilización de la microred habitacional de cités y pasajes peatonales no detallados en los catastros prediales del Estado.
  - Detección de barreras de accesibilidad universal: esquinas sin rebajes peatonales normativos (rampas PMR) y pavimentos deteriorados.
  - Integración con proyectos cartográficos comunitarios mediante la plataforma uMap para el mapeo colaborativo barrial.
* **Paneles y Módulos Prioritarios en la SPA:**
  1. `inicio` (Módulo 00): Visor cartográfico intuitivo con filtros táctiles rápidos por categoría barrial.
  2. `explorador-osm`: Consultas temáticas directas sobre arbolado, patrimonio y comercio local.
  3. `proyectos-umap`: Visualizador de mapas colaborativos y participativos comunitarios embebidos.
  4. `diccionario`: Glosario simplificado de términos urbanos y zonificaciones patrimoniales.

---

### Perfil 3: Mapeadores / Voluntarios OSM [`voluntario`]
* **Definición Canónica en Plataforma:**
  > *"⌖ Perfil Mapeador / Voluntario OSM: Herramientas analíticas avanzadas, métricas geométricas ohsome v1 (longitud/área/densidad), editor Overpass QL y taxonomía."*
* **Actores Destinatarios:** Comunidad de mapeadores voluntarios de OpenStreetMap Chile, colaboradores de HOT (Humanitarian OpenStreetMap Team), estudiantes de geografía y entusiastas de la geoinformación colaborativa.
* **Requerimientos Territoriales Críticos:**
  - Consola interactiva con soporte de consultas Overpass QL en tiempo real parametrizadas sobre el Bounding Box de Barrio Brasil.
  - Monitoreo histórico y analítico de aportes mediante **ohsome API v1/v2 (HeiGIT)**: recuento de ediciones por usuario, densidad temporal de nodos y evolución de huellas edilicias.
  - Homologación de etiquetas semánticas y taxonomías temáticas contrastadas con el servicio Taginfo.
  - Control de consistencia topológica y detección de geometrías nulas o duplicadas para enriquecer la base global de OSM.
* **Paneles y Módulos Prioritarios en la SPA:**
  1. `explorador-osm`: Editor y ejecutor de consultas Overpass QL con descarga directa en GeoJSON.
  2. `calidad-ohsome`: Analítica temporal de contribuciones y densidad de mapeo colaborativo.
  3. `diccionario`: Taxonomía exhaustiva de etiquetas OSM aplicadas a la realidad chilena.
  4. `manual`: Especificaciones de ingeniería de datos y esquemas de atributos normalizados.

---

### Perfil 4: ONGs / Territoriales [`ong`]
* **Definición Canónica en Plataforma:**
  > *"🔬 Perfil ONGs / Territoriales: Proporciona cálculo de densidades territoriales rigurosas mediante reproyección EPSG:32719, calidad ISO 19157 con ohsome v1/v2, exportación GeoJSON para QGIS, articulación comunitaria y fuentes bibliográficas (Departamento de Geografía UAH 2026)."*
* **Actores Destinatarios:** Organizaciones no gubernamentales (ONGs) de derecho a la ciudad, corporaciones de desarrollo barrial, centros de investigación socioespacial, tesistas y estudiantes de posgrado de la Universidad Alberto Hurtado y universidades metropolitanas.
* **Requerimientos Territoriales Críticos:**
  - Descarga masiva de coberturas vectoriales en formatos geográficos interoperables (GeoJSON WGS84, GeoPackage SQLite OGC y tablas CSV UTF-8) listas para procesamiento en software SIG de escritorio (QGIS, ArcGIS Pro).
  - Cálculo de densidades y métricas espaciales geodésicamente rigurosas mediante reproyección conforme a SIRGAS-Chile / UTM 19S (EPSG:32719).
  - Certificación y trazabilidad de calidad espacial conforme a la norma ISO 19157 (matriz WLC v2.0 al 97,88%).
  - Trazabilidad documental y bibliográfica formal con 125 referencias en norma APA 7ª edición para fundamentar estudios urbanos y propuestas de política pública local.
* **Paneles y Módulos Prioritarios en la SPA:**
  1. `indicadores-analisis`: Diagnóstico barrial en las 5 dimensiones territoriales y Storyboards analíticos.
  2. `calidad-ohsome`: Certificación de metacalidad ISO 19157 y métricas de completitud espacial.
  3. `licencias`: Descarga de catálogos maestros en OpenXML (.xlsx) y paquete ZIP unificado (543 MB).
  4. `metadatos-iso`: Fichas técnicas completas con linaje de captura y fechas de actualización.

---
"""

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("# -*- coding: utf-8 -*-\n")
    f.write('PARTE_01 = r"""' + part1_text + '"""\n')
    f.write('print("[+] Parte 01 enriquecida cargada exitosamente")\n')

print("[+] scripts/build_part1.py ejecutado correctamente.")
