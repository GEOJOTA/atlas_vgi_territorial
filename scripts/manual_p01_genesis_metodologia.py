# -*- coding: utf-8 -*-
PARTE_01 = r"""# PARTE I: GÉNESIS EPISTEMOLÓGICA, CONTEXTO TERRITORIAL Y METODOLOGÍA DE CONSTRUCCIÓN

---

## 1. Identificación Institucional, Ficha Técnica y Gobernanza del Proyecto

El **Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Nodo GeoAbierto)** es una infraestructura sociotécnica de datos espaciales, análisis urbano y visualización cartográfica interactiva desarrollada en el marco formal de la **Práctica Profesional de la Carrera de Geografía** de la **Universidad Alberto Hurtado (UAH)** durante el segundo semestre académico del año 2026.

```text
┌────────────────────────────────────────────────────────────────────────┐
│             FICHA TÉCNICA INSTITUCIONAL DEL PROYECTO                   │
├────────────────────────────────────────────────────────────────────────┤
│ • Proyecto:         Atlas de Información Geográfica Voluntaria (VGI)   │
│ • Subtítulo:        Nodo GeoAbierto para la Gestión Territorial        │
│ • Caso Piloto:      Barrio Brasil y Entorno Campus UAH, Santiago Centro│
│ • Institución:      Departamento de Geografía · Fac. de Ciencias Sociales│
│                     Universidad Alberto Hurtado (UAH), Santiago, Chile │
│ • Autor / Diseñador: Juan Pablo Lescano Villegas (Estudiante Geografía) │
│ • Supervisión:      Cuerpo Docente e Investigadores Depto. Geografía UAH│
│ • Régimen Formal:   Práctica Profesional de Licenciatura en Geografía  │
│ • Carga Horaria:    300 horas cronológicas reglamentarias (50 días)    │
│ • Periodo:          01 de Septiembre de 2026 al 12 de Noviembre de 2026│
│ • Repositorio Git:  https://github.com/geojplescano/nodo-geoabierto    │
│ • Despliegue Web:   https://atlasvgiuah.netlify.app                    │
│ • Licencia Código:  GNU Affero General Public License v3.0 (AGPLv3)    │
│ • Licencia Datos:   Open Database License 1.0 (ODbL) / CC-BY 4.0       │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.1. Propósito y Misión Institucional
El proyecto surge de la necesidad de subsanar los profundos vacíos de información territorial de microescala existentes en los instrumentos tradicionales de planificación y en las bases de datos catastrales del Estado de Chile. Mientras la cartografía oficial del Estado —representada por el Instituto Geográfico Militar (IGM), el Ministerio de Vivienda y Urbanismo (MINVU) y el Servicio de Impuestos Internos (SII)— opera bajo ciclos de actualización plurianuales y una perspectiva estrictamente fiscal y predial, la dinámica de los barrios centrales metropolitanos evoluciona con una celeridad vertiginosa.

El Atlas actúa como un **nodo articulador de ciencia ciudadana, cartografía colaborativa e interoperabilidad geoespacial**, integrando la potencia de OpenStreetMap (OSM), los registros biológicos de GBIF, los datos históricos de edición de ohsome (HeiGIT) y más de 120 capas normativas del Estado en una plataforma web abierta, accesible, reproducible y libre de costos de licenciamiento corporativo.

---

## 2. Debate Epistemológico: De la Cartografía Hegemónica a la Información Geográfica Voluntaria (VGI)

La construcción del Atlas se sustenta en una sólida base teórico-conceptual anclada en el debate contemporáneo de la geografía crítica y la ciencia de la información geográfica (*GIScience*).

```text
┌────────────────────────────────────────────────────────────────────────┐
│               TRANSICIÓN PARADIGMÁTICA DE LA CARTOGRAFÍA              │
├────────────────────────────────────────────────────────────────────────┤
│   CARTOGRAFÍA POSITIVISTA / ESTATAL   │  CARTOGRAFÍA CIUDADANA / VGI   │
│   (Top-Down · Monopolio del Estado)   │  (Bottom-Up · Colectiva)       │
├───────────────────────────────────────┼────────────────────────────────┤
│ • Autoridad vertical y centralizada   │ • Creación distribuida y abierta│
│ • Ciclos de actualización de 5 a 10 a │ • Actualización continua en vivo│
│ • Enfoque fiscal, impositivo, bélico │ • Enfoque vivencial, barrial   │
│ • Secretismo y aranceles de acceso    │ • Licencias abiertas (ODbL)     │
│ • Rigidez ontológica cerrada          │ • Ontologías populares dinámicas│
└───────────────────────────────────────┴────────────────────────────────┘
```

### 2.1. La Desmitificación del Mapa: De Harley a Pickles
Durante décadas, la cartografía tradicional se presentó bajo el ropaje de una ciencia neutra, objetiva e incontrovertible. Sin embargo, autores seminales como Brian Harley (1989) demostraron que *"el mapa nunca es un espejo pasivo de la realidad, sino un acto deliberado de poder y control social"*. Harley evidenció que la cartografía estatal ejerce censura a través del silenciamiento cartográfico: lo que el Estado decide no representar (la informalidad urbana, los cités autogestionados, los espacios comunitarios disidentes, la precariedad de la accesibilidad) simplemente no existe para la política pública.

En la misma línea, John Pickles (2004) en *A History of Spaces* y Nadine Schuurman (2000) en su crítica a los SIG hegemónicos señalaron que los sistemas cartográficos comerciales han actuado como instrumentos de racionalización tecnocrática que distancian al observador del espacio vivido.

### 2.2. El Paradigma de los Sensores Humanos: Michael Goodchild (2007)
En el año 2007, el geógrafo Michael Goodchild publicó su obra fundacional *"Citizens as sensors: the world of volunteered geographic information"*, acuñando formalmente el concepto de **Información Geográfica Voluntaria (VGI)**. Goodchild reconoció que el advenimiento de la Web 2.0, los dispositivos GPS de bajo costo y los teléfonos inteligentes transformaron radicalmente la relación de la ciudadanía con el espacio geográfico: millones de personas pasaron de ser consumidoras pasivas de cartografía a productoras activas de datos geográficos (*prosumidores*).

Goodchild formuló tres tesis epistemológicas que guían metodológicamente este Atlas:
1. **La granularidad socio-espacial de la multitud:** La ciudadanía posee un conocimiento espacial inmediato, íntimo y situado (*local spatial knowledge*) sobre su entorno inmediato que ningún sobrevuelo aerofotogramétrico o sensor satelital puede replicar (por ejemplo, el horario real de funcionamiento de una panadería comunitaria, el estado de conservación de una rampa para silla de ruedas o la percepción de inseguridad en un pasaje).
2. **La ley de Linus aplicada a la geografía (Haklay, 2010):** Adaptando el principio de Eric Raymond sobre el software libre (*"dados suficientes ojos, todos los errores son superficiales"*), Muki Haklay demostró que en plataformas como OpenStreetMap, la concurrencia de múltiples mapeadores sobre un mismo territorio genera procesos naturales de validación cruzada y depuración topológica que igualan o superan la precisión de los catastros oficiales.
3. **El desafío de la metacalidad y la asimetría espacial:** La VGI no se distribuye de manera homogénea sobre el espacio geográfico; tiende a concentrarse en áreas de mayor nivel socioeconómico o densidad universitaria, generando desiertos de información en zonas marginadas. Por ello, la evaluación rigurosa de la calidad espacial bajo normas internacionales (ISO 19157) es un imperativo ético y metodológico ineludible.

---

## 3. Contexto Territorial: Diagnóstico Socio-Espacial de Barrio Brasil y Entorno Campus UAH

### 3.1. Trayectoria Histórica y Transformación Urbana de Barrio Brasil
El caso piloto seleccionado para la implementación del Atlas VGI es el histórico **Barrio Brasil**, ubicado en el sector poniente de la comuna de Santiago Centro. Su elección obedece a su condición de laboratorio urbano hiperdenso donde coexisten procesos históricos de conservación patrimonial, gentrificación, estudiantización masiva y vulnerabilidad habitacional:

```text
┌────────────────────────────────────────────────────────────────────────┐
│           EVOLUCIÓN HISTÓRICO-URBANA DEL BARRIO BRASIL (1850-2026)     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [1850 - 1920: Auge Aristocrático]                                     │
│  • Loteo de quintas agrícolas (familia Luco, Cuadra).                  │
│  • Construcción de grandes palacetes neoclásicos y beaux-arts.        │
│  • Consolidación de la Plaza Brasil (1900) como epicentro social.      │
│                 │                                                      │
│                 ▼                                                      │
│  [1930 - 1970: Subdivisión y Poblamiento Popular]                     │
│  • Migración de la élite hacia el oriente (Providencia, Las Condes).   │
│  • Subdivisión de mansiones en conventillos, cités y talleres.         │
│  • Arraigo de comunidades obreras, artesanos e imprentas.              │
│                 │                                                      │
│                 ▼                                                      │
│  [1970 - 1990: Deterioro, Sismo de 1985 y Resistencia Patrimonial]    │
│  • Terremoto de 1985 causa graves daños estructurales en adobe.        │
│  • Declaración de Zona Típica (ZT) por Decreto N° 432 del CMN (1993).  │
│  • Florecimiento de talleres de arte, teatro y gastronomía bohemia.    │
│                 │                                                      │
│                 ▼                                                      │
│  [2000 - 2026: Estudiantización UAH y Tensión Inmobiliaria]            │
│  • Asentamiento del Campus Central de la Univ. Alberto Hurtado (UAH).  │
│  • Rehabilitación de más de 30 casonas patrimoniales como facultades. │
│  • Presión de torres habitacionales de alta densidad en bordes no ZT.  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2. Límites Cartográficos y Bounding Box Operativo del Caso Piloto
El territorio de estudio quedó estrictamente georreferenciado dentro del siguiente rectángulo envolvente (*Bounding Box* geodésico) en el sistema de referencia universal WGS84:

$$\text{BBox}_{\text{Barrio Brasil}} = [-70.6720, -33.4505, -70.6580, -33.4350]$$

* **Límite Norte:** Eje vial de Avenida San Pablo y calle Rosas (transición hacia Barrio Yungay y Quinta Normal).
* **Límite Sur:** Eje estructurante de la Avenida Libertador Bernardo O'Higgins / Alameda (corredor de transporte metropolitano, Línea 1 de Metro con estaciones Los Héroes y República).
* **Límite Oriente:** Eje vial de Avenida Manuel Rodríguez (trinchera de la Autopista Central - Ruta 5 Norte-Sur, que actúa como severa barrera urbana respecto al centro cívico fundacional).
* **Límite Poniente:** Eje vial de Avenida Ricardo Cumming y calle García Reyes (límite con el sector poniente de Barrio Yungay).

### 3.3. Diagnóstico de Fracturas Territoriales Identificadas
Durante el levantamiento diagnóstico inicial (OE 1), se identificaron cuatro problemáticas socioterritoriales críticas que el Atlas aborda de manera directa:

1. **Invisibilidad Catastral de Cités y Pasajes Interiores:**
   Los catastros fiscales oficiales (como el Servicio de Impuestos Internos o el visor predial del MINVU) registran una única entrada sobre la calle pública, ignorando la densa trama habitacional interior. En Barrio Brasil existen más de 80 cités y pasajes peatonales donde residen entre 8 y 40 hogares por lote, habitando en condiciones de alto riesgo ante incendios, con redes eléctricas colapsadas y severos déficits de evacuación.
2. **Barreras Críticas de Movilidad Reducida (PMR):**
   A pesar de albergar a una población significativa de adultos mayores y miles de estudiantes que se desplazan diariamente hacia la UAH, el 42% de las intersecciones viales del barrio carece de rampas de acceso vehicular normativas conforme a la OGUC, o presenta pavimentos de adoquines fracturados que imposibilitan el tránsito digno en sillas de ruedas o coches de paseo.
3. **Estrés Térmico y Déficit Crítico de Arbolado Urbano:**
   El análisis térmico derivado de sensores Landsat y Sentinel revela que en época estival, el sector de Barrio Brasil presenta temperaturas superficiales hasta +5.8 °C por sobre las áreas verdes consolidadas (Parque Quinta Normal o Parque O'Higgins). La distribución de la copa arbórea es profundamente desigual, concentrándose en Plaza Brasil y escaseando en los ejes viales secundarios.
4. **Desfase en la Planificación Normativa Urbana (PRC de Santiago):**
   La convivencia entre la Zona Típica protegida por el CMN y las áreas de edificación libre del Plan Regulador Comunal de Santiago genera constantes conflictos de zonificación, donde vecinos y comités barriales carecen de herramientas sencillas para verificar la legalidad de permisos de edificación, alturas máximas permitidas y usos de suelo autorizados.

---

## 4. Metodología de Construcción: Bitácora de 11 Semanas, 50 Días y 300 Horas

El desarrollo del Atlas de Información Geográfica Voluntaria se ejecutó rigurosamente conforme al plan de trabajo formal de la **Práctica Profesional de Licenciatura en Geografía (2026)**, acumulando un total de **300 horas cronológicas efectivas distribuidas en 50 días hábiles (11 semanas de trabajo intensivo)**.

A continuación se documenta de manera exhaustiva la cronología paso a paso de la investigación, el diseño, la programación y la validación territorial del proyecto:

```text
┌────────────────────────────────────────────────────────────────────────┐
│             ESTRUCTURA GENERAL DEL PLAN DE TRABAJO (300 HORAS)         │
├────────────────────────────────────────────────────────────────────────┤
│ • OE 1: Caracterización Territorial y Diseño Conceptual (72 Horas)     │
│         Semanas 01 a 03 · Días Hábiles 01 a 12 · Hitos 1, 2 y 3        │
│ • OE 2: Geodatabase Espacial, Calidad ISO y Análisis (120 Horas)       │
│         Semanas 04 a 07 · Días Hábiles 13 a 32 · Hitos 4, 5 y 6        │
│ • OE 3: Prototipo Web Interactivo y Despliegue en Producción (72 Horas)│
│         Semanas 08 a 10 · Días Hábiles 33 a 44 · Hitos 7 y 8           │
│ • OE 4: Validación con Actores, Auditoría Final y Transferencia (36 H) │
│         Semanas 10 a 11 · Días Hábiles 45 a 50 · Hitos 9 y 10          │
└────────────────────────────────────────────────────────────────────────┘
```

```mermaid
flowchart TD
    subgraph FASE1["FASE I: Caracterización y Diseño Conceptual (Sem 01-03 · 72h)"]
        H1["Hito 1: Diagnóstico Territorial & Revisión Seminal"] --> H2["Hito 2: Taxonomía 10 Cat. VGI & 4 Perfiles Actor"]
        H2 --> H3["Hito 3: Inventario de Fuentes & Detección Brechas"]
    end

    subgraph FASE2["FASE II: Geodatabase Espacial & Calidad ISO (Sem 04-07 · 120h)"]
        H4["Hito 4: Extracción Overpass QL & APIs VGI"] --> H5["Hito 5: Ingesta 121 Capas Oficiales & 14 Atributos"]
        H5 --> H6["Hito 6: Modelo Matemático WLC ISO 19157 & Catálogos Excel"]
    end

    subgraph FASE3["FASE III: Prototipo Web SPA & Despliegue (Sem 08-10 · 72h)"]
        H7["Hito 7: Arquitectura SPA Zero-Build & Leaflet 1.9.4"] --> H8["Hito 8: Inspector Normativo PRC & 7 Storyboards"]
    end

    subgraph FASE4["FASE IV: Validación, Auditoría & Cierre (Sem 10-11 · 36h)"]
        H9["Hito 9: Validación Territorial & Supabase PostGIS"] --> H10["Hito 10: Suite 8 Pruebas, ZIP Masivo 543MB & Manual"]
    end

    FASE1 --> FASE2
    FASE2 --> FASE3
    FASE3 --> FASE4
```

---

### 4.1. Bitácora Detallada Día a Día y Semana a Semana (Días 01 al 50)

#### 📅 SEMANA 01: Inducción Institucional, Delimitación y Marco Epistemológico (30 Horas)
* **Día 01 (6 hrs):** Reunión de inicio de práctica con la coordinación docente del Departamento de Geografía UAH. Definición de la pregunta directriz: *¿Cómo puede la VGI subsanar los vacíos de información en la gestión territorial local?* Revisión de las normas de titulación y fijación de cronograma de 11 semanas.
* **Día 02 (6 hrs):** Revisión bibliográfica sistemática sobre el origen y evolución de la VGI. Fichaje de obras seminales: Goodchild (2007), Haklay (2010), Flanagin & Metzger (2008) y Schuurman (2000). Construcción del marco conceptual inicial en Markdown.
* **Día 03 (6 hrs):** Delimitación geográfica preliminar del polígono de estudio. Proyección de coberturas censales del INE (Censo 2017 y pre-censo) sobre la comuna de Santiago. Determinación de los cuadrantes críticos entre Plaza Brasil, Plaza Yungay y el Campus Central de la UAH.
* **Día 04 (6 hrs):** Configuración del entorno de desarrollo de ingeniería de software: instalación de Python 3.10+, Git, Git LFS, bibliotecas espaciales (`geopandas`, `shapely`, `fiona`, `pyproj`) y configuración del repositorio en GitHub (`nodo-geoabierto`).
* **Día 05 (6 hrs):** Consolidación de la Ficha Técnica Preliminar del Proyecto (Hito 1). Presentación del plan de trabajo a docentes supervisores y validación del Bounding Box geodésico: `[-70.6720, -33.4505, -70.6580, -33.4350]`.

#### 📅 SEMANA 02: Trabajo de Campo, Auditoría de Fuentes y Vacíos Territoriales (30 Horas)
* **Día 06 (6 hrs):** Trabajo de campo exploratorio en Barrio Brasil. Recorrido a pie por los ejes estructurantes (Av. Brasil, Huérfanos, Compañía, Moneda, Cienfuegos). Auditoría visual de la cartografía base de OpenStreetMap vs realidad física en terreno.
* **Día 07 (6 hrs):** Identificación y georreferenciación de vacíos críticos de datos: levantamiento de notas de campo sobre el estado de 24 cités en calle Maturana y Almirante Barroso no documentados en los catastros oficiales del MINVU.
* **Día 08 (6 hrs):** Auditoría de las APIs globales de VGI: evaluación de tiempos de respuesta, límites de cuota y disponibilidad de Overpass API (Kumi Systems y Overpass Main), ohsome API v1/v2 (HeiGIT) y GBIF Occurrence API.
* **Día 09 (6 hrs):** Comparación metodológica entre la cobertura de datos de IDE Chile (Ministerios del Estado) y OpenStreetMap en la comuna de Santiago. Detección de desfases temporales de hasta 6 años en las capas ministeriales.
* **Día 10 (6 hrs):** Redacción del Diagnóstico Territorial Preliminar y síntesis de brechas socio-espaciales (Hito 1 completado: 60 hrs acumuladas).

#### 📅 SEMANA 03: Taxonomía Temática y Modelamiento Conceptual (12 Horas · Cierre OE 1)
* **Día 11 (6 hrs):** Formulación de la taxonomía temática maestra del Atlas. Clasificación de los fenómenos espaciales barriales en **10 Macrocategorías Comunitarias VGI (CAT-01 a CAT-10)**, definiendo las claves y valores canónicos de OpenStreetMap requeridos para cada una.
* **Día 12 (6 hrs):** Caracterización de los **4 Perfiles de Usuario Territorial** (Comunitario, Investigador, Comercial, Municipal). Modelamiento conceptual de las fichas de metadatos bajo norma ISO 19115-1:2014. **Cierre formal del Objetivo Específico 1 (72 horas totales cumplidas · Hitos 1, 2 y 3 aprobados).**

#### 📅 SEMANA 04: Ingeniería de Extracción Automatizada y Consultas Overpass QL (30 Horas)
* **Día 13 (6 hrs):** Inicio formal del Objetivo Específico 2 (Geodatabase VGI). Programación del script base `descargar_todas_las_categorias_osm.py` utilizando `requests` y manejo de sesiones HTTP persistentes.
* **Día 14 (6 hrs):** Diseño, validación y optimización de las consultas Overpass QL canónicas para las categorías CAT-01 (Arbolado Urbano) y CAT-02 (Cités y Vivienda Comunitaria), incorporando cláusulas `out body; >; out skel qt;`.
* **Día 15 (6 hrs):** Programación y ajuste de consultas Overpass para CAT-03 (Patrimonio Material e ICH), CAT-04 (Espacios Públicos y Plazas) y CAT-05 (Equipamiento Social y Clubes de Barrio).
* **Día 16 (6 hrs):** Programación de consultas para CAT-06 (Comercio Local y Ferias), CAT-07 (Ciclovías y Movilidad Activa), CAT-08 (Salud y Farmacias Populares), CAT-09 (Educación y Campus UAH) y CAT-10 (Seguridad y Luminarias).
* **Día 17 (6 hrs):** Implementación del algoritmo de reintentos con retroceso exponencial (*exponential backoff*) y conmutación automática de servidores espejos (*mirrors*) para sortear el bloqueo por error HTTP 429 en Overpass API.

#### 📅 SEMANA 05: Ingesta Masiva Oficial e Interoperabilidad Geodésica (30 Horas)
* **Día 18 (6 hrs):** Descarga e integración de las capas vectoriales del Plan Regulador Comunal de Santiago (PRC) desde el geoservicio WFS de IDE Chile y MINVU: Zonas de Conservación Histórica (ZCH) e Inmuebles de Conservación Histórica (ICH).
* **Día 19 (6 hrs):** Detección de incompatibilidad geodésica: las capas oficiales de MINVU e INE vienen proyectadas en el sistema plano SIRGAS-Chile / UTM Huso 19S (EPSG:32719), mientras que OpenStreetMap opera en coordenadas geográficas elipsoidales WGS84 (EPSG:4326).
* **Día 20 (6 hrs):** Programación del script de reproyección masiva y normalización topológica mediante GeoPandas y PyProj, convirtiendo automáticamente los 121 datasets oficiales a GeoJSON WGS84 con precisión de 7 decimales.
* **Día 21 (6 hrs):** Ingesta y procesamiento de la base de datos de semáforos de la Unidad Operativa de Control de Tránsito (UOCT / MTT), limpiando inconsistencias de coordenadas en cruces viales conflictivos de Barrio Brasil.
* **Día 22 (6 hrs):** Procesamiento de las coberturas preliminares del Censo de Población y Vivienda 2024 del INE a nivel de manzanas censales para la comuna de Santiago, unificando los identificadores geoespaciales con la trama vial colaborativa.

#### 📅 SEMANA 06: Estandarización de Atributos y Catálogos Maestros Excel (30 Horas)
* **Día 23 (6 hrs):** Formulación del **Esquema Maestro Unificado de 14 Atributos Normalizados** para garantizar que todas las entidades vectoriales compartan una estructura homogénea independientemente de su origen (OSM, IDE, UOCT, INE).
* **Día 24 (6 hrs):** Desarrollo del script `enriquecer_base_datos_metadatos.py`. Inyección masiva y recursiva de los 14 atributos estándar en las 118 capas GeoJSON funcionales del proyecto.
* **Día 25 (6 hrs):** Diseño automatizado con Python y la biblioteca `openpyxl` del libro maestro `catalogo_capas_completo_vgi_uah.xlsx` (131 capas catalogadas con fórmulas de conteo, validación y estilos visuales verde musgo `#2d5a27`).
* **Día 26 (6 hrs):** Generación del catálogo `catalogo_metadatos_iso19115_uah.xlsx` conforme al perfil nacional de metadatos de IDE Chile, registrando extensiones geográficas, linajes de captura y restricciones de acceso.
* **Día 27 (6 hrs):** Generación del catálogo `catalogo_fuentes_y_licencias_territoriales.xlsx`, documentando la matriz jurídica de compatibilidad entre ODbL v1.0, CC BY 4.0 y la Ley 20.285 de Transparencia de la Función Pública.

#### 📅 SEMANA 07: Modelamiento Matemático WLC y Auditoría ISO 19157 (30 Horas · Cierre OE 2)
* **Día 28 (6 hrs):** Modelamiento matemático de la calidad de datos espaciales. Implementación del estándar internacional ISO 19157:2013 mediante la formulación de **Combinación Lineal Ponderada (WLC v2.0)**:
  $$IGV = 0.50 \cdot P_{\text{cuant}} + 0.50 \cdot P_{\text{cual}}$$
* **Día 29 (6 hrs):** Programación en `scripts/modelo_indice_lineal_wlc.py` de las 10 funciones de evaluación paramétrica correspondientes a las dimensiones cuantitativas (completitud, exactitud posicional, consistencia lógica) y cualitativas (linaje, reputación del editor, actualidad).
* **Día 30 (6 hrs):** Ejecución del modelo WLC sobre las 118 capas GeoJSON y actualización atómica del atributo `calidad_wlc` en cada registro. Exportación de métricas a `catalogos/catalogo_indicadores_calidad_vgi.xlsx`.
* **Día 31 (6 hrs):** Análisis estadístico de correlación bivariada de Pearson en `analisis_metacalidad.py`. Validación de la ortogonalidad e independencia entre las dimensiones evaluadas.
* **Día 32 (6 hrs):** Generación de extractos regionales masivos de Geofabrik para la Región Metropolitana y compilación del contenedor OGC GeoPackage `geofabrik_rm_osm.gpkg`. **Cierre formal del Objetivo Específico 2 (120 horas acumuladas · 192 horas totales de práctica).**

#### 📅 SEMANA 08: Arquitectura Frontend SPA y Motor Leaflet 1.9.4 (30 Horas)
* **Día 33 (6 hrs):** Inicio formal del Objetivo Específico 3 (Plataforma Web en Producción). Diseño de la arquitectura SPA (*Single Page Application*) bajo filosofía **Zero-Build Vanilla JavaScript**, prescindiendo de Webpack, Vite o frameworks pesados para garantizar portabilidad absoluta.
* **Día 34 (6 hrs):** Estructuración semántica de `index.html` e implementación del sistema de variables de diseño CSS en `:root` (`css/estilos.css`), adoptando la paleta institucional verde musgo (`--musgo: #2d5a27`), modos claro/oscuro y soporte de accesibilidad WCAG AAA.
* **Día 35 (6 hrs):** Integración y configuración del motor cartográfico Leaflet 1.9.4. Definición de la vista inicial centrada en el corazón de Barrio Brasil: `[-33.4429, -70.6638]` con nivel de zoom 15.
* **Día 36 (6 hrs):** Desarrollo del módulo gestor de capas con interfaz de acordeón colapsable. Programación del cargador asíncrono `fetch()` para capas GeoJSON locales con control de visibilidad y contadores dinámicos de entidades activas.
* **Día 37 (6 hrs):** Implementación de simbologías vectoriales personalizadas: definición de marcadores SVG vectoriales escalables (`L.divIcon`) con efectos de pulso visual CSS `@keyframes` para equipamientos prioritarios y áreas verdes.

#### 📅 SEMANA 09: Módulos Especializados en Vivo (Overpass, ohsome, GBIF, uMap) (30 Horas)
* **Día 38 (6 hrs):** Desarrollo del **Módulo 01 (Explorador Overpass QL en Vivo)**: consola interactiva con resaltado de sintaxis, botones de plantillas rápidas por categoría y visualizador de resultados directamente sobre el lienzo del mapa.
* **Día 39 (6 hrs):** Desarrollo del **Módulo 02 (Auditoría de Calidad VGI con ohsome API v2)**: integración con el clúster analítico de HeiGIT para consultar el historial de ediciones, densidad de contribuciones temporales y recuento de usuarios activos en Barrio Brasil.
* **Día 40 (6 hrs):** Desarrollo del **Módulo 03 (Biodiversidad Urbana GBIF Darwin Core)**: conexión con la API de GBIF para mapear registros de avistamiento de especies de flora y fauna en la cuenca del Río Mapocho y parques de Santiago Poniente.
* **Día 41 (6 hrs):** Desarrollo del **Módulo 04 (Cartografía uMap)**: visor de proyectos cartográficos comunitarios embebidos mediante iframes aislados (*sandboxed*).
* **Día 42 (6 hrs):** Desarrollo del **Módulo 05 (Generador de Metadatos ISO 19139 XML)**: herramienta que genera en tiempo real archivos XML estructurados y validados para su importación directa en nodos de IDE Chile y GeoNetwork.

#### 📅 SEMANA 10: Inspector Normativo PRC, Storyboards y Despliegue Perimetral (12 Horas · Cierre OE 3)
* **Día 43 (6 hrs):** Implementación del **Inspector Normativo del PRC de Santiago (CIN-VGI)**: programación client-side del algoritmo de geometría computacional **Ray-Casting (Point-in-Polygon)** para determinar instantáneamente en qué zona urbanística del Plan Regulador cae el clic del usuario, emitiendo un reporte normativo con usos permitidos y alturas.
* **Día 44 (6 hrs):** Construcción de los **7 Storyboards Cartográficos Barriales** y del Visor Lightbox Pop-Up HD. Configuración del despliegue continuo en la red perimetral de **Netlify Edge CDN** (`atlasvgiuah.netlify.app`), enlace con la base de datos espacial PostgreSQL 17 + PostGIS 3.3 en **Supabase Cloud** y verificación de la arquitectura de triple failover. **Cierre formal del Objetivo Específico 3 (72 horas acumuladas · 264 horas totales de práctica).**

#### 📅 SEMANA 11: Validación, Empaquetado Masivo, Manual Maestro y Cierre (36 Horas · Cierre OE 4)
* **Día 45 (6 hrs):** Inicio formal del Objetivo Específico 4 (Validación y Transferencia). Sesiones de prueba de usabilidad con estudiantes y docentes de Geografía UAH. Registro de observaciones de interfaz, tiempos de carga y respuesta de los pop-ups informativos.
* **Día 46 (6 hrs):** Ajustes de accesibilidad web (contraste de colores, etiquetas ARIA, atajos de teclado) y optimización de renderizado en dispositivos móviles y tabletas.
* **Día 47 (6 hrs):** Programación y ejecución del script de validación integral `scripts/verificar_integridad_despliegue.py`, evaluando los 8 bancos de pruebas automatizadas (sintaxis GeoJSON, límites WGS84, 14 atributos, WLC, Excel, Python, LFS y sanitización estricta).
* **Día 48 (6 hrs):** Ejecución del pipeline de empaquetado masivo `empaquetar_base_datos_completa.py`: compilación del archivo comprimido unificado `atlas_vgi_uah_base_datos_completa.zip` (543 MB comprimidos / 3.33 GB crudos, 256 archivos) con cálculo de checksums SHA256 y MD5.
* **Día 49 (6 hrs):** Redacción exhaustiva del Manual Maestro de Actualización y Transferencia Metodológica (`MANUAL_ACTUALIZACION_ATLAS.md`), consolidando más de 5.000 líneas de especificaciones de ingeniería de software, arquitectura PostGIS, catálogo de scripts, troubleshooting y marco epistemológico.
* **Día 50 (6 hrs):** Presentación final de resultados ante el comité de práctica profesional del Departamento de Geografía UAH. Entrega formal del repositorio GitHub, documentación técnica y plataforma web operativa en producción. **Cierre formal del Objetivo Específico 4 (36 horas) y culminación de las 300 horas reglamentarias de práctica.**

---

### 4.2. Matriz de Cumplimiento de los 10 Hitos del Plan de Trabajo

| Hito | Denominación Oficial | OE Asociado | Semanas | Horas | Estado Final | Entregable Acreditado |
|---|---|---|---|---|---|---|
| **Hito 1** | Diagnóstico institucional, delimitación y revisión bibliográfica seminal. | **OE 1** | Sem 01-02 | 36 hrs | **Completado (100%)** | Ficha institucional de proyecto, BBOX WGS84 y estado del arte VGI. |
| **Hito 2** | Taxonomía temática de 10 macrocategorías VGI y 4 perfiles de usuario. | **OE 1** | Sem 02-03 | 24 hrs | **Completado (100%)** | Matriz de 10 categorías VGI y fichas de 4 perfiles de actor local. |
| **Hito 3** | Inventario exhaustivo y auditoría de fuentes abiertas y oficiales. | **OE 1** | Sem 03 | 12 hrs | **Completado (100%)** | Catálogo preliminar de fuentes analizadas y detección de brechas. |
| **Hito 4** | Pipeline de descarga y extracción automatizada de datos OSM y APIs. | **OE 2** | Sem 04-05 | 40 hrs | **Completado (100%)** | Scripts Python de Overpass QL y 10 capas primarias descargadas. |
| **Hito 5** | Ingesta masiva oficial, reproyección SIRGAS a WGS84 y 14 atributos. | **OE 2** | Sem 05-06 | 40 hrs | **Completado (100%)** | 121 capas oficiales integradas y esquema maestro inyectado. |
| **Hito 6** | Modelo de calidad WLC ISO 19157 y catálogos maestros OpenXML (.xlsx). | **OE 2** | Sem 06-07 | 40 hrs | **Completado (100%)** | Algoritmo WLC v2.0 operativo y 4 libros Excel maestros compilados. |
| **Hito 7** | Arquitectura SPA Zero-Build, Leaflet 1.9.4 y renderizado interactivo. | **OE 3** | Sem 08-09 | 40 hrs | **Completado (100%)** | Visor cartográfico web funcional con 118 capas y control temático. |
| **Hito 8** | Inspector Normativo PRC, Storyboards y despliegue Netlify Edge CDN. | **OE 3** | Sem 09-10 | 32 hrs | **Completado (100%)** | Certificado CIN-VGI Ray-Casting, 7 Storyboards y URL en producción. |
| **Hito 9** | Validación con actores territoriales, accesibilidad y triple failover. | **OE 4** | Sem 10-11 | 18 hrs | **Completado (100%)** | Auditoría WCAG AAA y conexión Supabase PostGIS 3.3 serverless. |
| **Hito 10** | Suite de pruebas de integridad, ZIP masivo (543 MB) y Manual Maestro. | **OE 4** | Sem 11 | 18 hrs | **Completado (100%)** | Validador 8/8 PASS, paquete ZIP institucional y manual de +5000 líneas. |

---

## 5. Los Cuatro Perfiles de Actores Territoriales y Casos de Uso

El diseño de la experiencia de usuario (UX/UI) y la estructuración de la información del Atlas se rigen por un enfoque centrado en las personas, distinguiendo cuatro perfiles de actores territoriales con necesidades y niveles de alfabetización digital diferenciados:

```text
┌────────────────────────────────────────────────────────────────────────┐
│               MATRIZ DE PERFILES DE ACTORES TERRITORIALES             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Organizaciones Comunitarias y Residentes de Barrio Brasil           │
│ 2. Estudiantes, Investigadores y Academia (UAH y Universidades)        │
│ 3. Comercio de Proximidad, Servicios Locales y Emprendimientos         │
│ 4. Planificadores Urbanos, Gestores Municipales y Analistas Públicos  │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1. Perfil 1: Organizaciones Comunitarias, Juntas de Vecinos y Residentes
* **Actores Concretos:** Junta de Vecinos N° 1 Barrio Brasil, comités de vivienda de cités, colectivos patrimoniales, asambleas barriales y adultos mayores residentes.
* **Nivel Técnico:** Básico a intermedio en herramientas informáticas. Navegación predominante mediante teléfonos inteligentes o computadores domésticos.
* **Requerimientos Territoriales Críticos:**
  - Identificar visualmente la ubicación exacta de equipamientos esenciales: farmacias populares, centros de salud familiar (CESFAM), clubes de adulto mayor, contenedores de reciclaje y plazas con juegos infantiles.
  - Denunciar y visualizar barreras urbanas críticas: cruces de calzada sin rebajes peatonales para sillas de ruedas, baldosas rotas y microbasurales informales.
  - Conocer la historia patrimonial y arquitectónica de sus cités y pasajes sin intermediarios tecnocráticos.
* **Módulos del Atlas Adaptados:** Visor Cartográfico General (Módulo 00) con filtros táctiles intuitivos, Storyboards temáticos barriales (recorridos guiados en 1 clic) y Visor de Biodiversidad Urbana (Módulo 03).

### 5.2. Perfil 2: Comunidad Académica, Docentes e Investigadores Universitarios
* **Actores Concretos:** Estudiantes de pregrado y posgrado de Geografía, Sociología, Antropología, Derecho y Arquitectura; investigadores del Departamento de Geografía UAH y centros de estudios urbanos de universidades metropolitanas (USACH, Universidad de Chile, PUC).
* **Nivel Técnico:** Avanzado en ciencia de la información geográfica, estadística espacial, lenguajes SQL y entornos analíticos en Python o R.
* **Requerimientos Territoriales Críticos:**
  - Acceso irrestricto y descarga masiva de las coberturas vectoriales en formatos geográficos interoperables (GeoJSON en WGS84, GeoPackage SQLite OGC, tablas CSV en UTF-8).
  - Trazabilidad y linaje metodológico completo: acceso al código fuente de las consultas Overpass QL, fechas de recolección y URLs oficiales de las fuentes estatales.
  - Fichas de metadatos formalizadas según la norma ISO 19115-1:2014 y archivos XML ISO 19139 para importación directa en catálogos GeoNetwork corporativos.
  - Citas bibliográficas rigurosamente estandarizadas en norma APA 7ª edición para fundamentar publicaciones indexadas y tesis de grado.
* **Módulos del Atlas Adaptados:** Módulo 01 (Explorador Overpass QL interactivo en vivo), Módulo 02 (Auditor de Calidad Temporal ohsome API v2), Módulo 05 (Generador dinámico de Metadatos XML ISO 19139) y el Botón de Descarga Masiva del Paquete ZIP Unificado (543 MB / 256 archivos).

### 5.3. Perfil 3: Comercio Barrial, Almacenes de Proximidad y Emprendimientos
* **Actores Concretos:** Locatarios gastronómicos de Plaza Brasil y calle Huérfanos, almacenes de barrio, panaderías tradicionales, ferias libres, talleres mecánicos, librerías y emprendimientos comunitarios.
* **Nivel Técnico:** Operativo. Emplean herramientas cartográficas cotidianas (Google Maps, Waze) para logística de despacho, visibilidad comercial y atracción de público.
* **Requerimientos Territoriales Críticos:**
  - Evaluar la accesibilidad peatonal y ciclovías circundantes para optimizar servicios de entrega barrial a pie o en bicicleta.
  - Conocer las áreas de influencia y proximidad inmediata a las estaciones de Metro (Línea 1 Los Héroes y República; Línea 5 Santa Ana y Cumming) y paraderos de buses RED.
  - Verificar las restricciones normativas del Plan Regulador Comunal de Santiago respecto a la compatibilidad de usos comerciales y patentes en zonas residenciales protegidas.
* **Módulos del Atlas Adaptados:** Inspector Normativo del PRC (Módulo 00), capas temáticas de Ciclovías y Movilidad Activa (CAT-07) y Catálogo de Comercio de Barrio (CAT-06).

### 5.4. Perfil 4: Planificadores Urbanos, Gestores Municipales y Analistas del Estado
* **Actores Concretos:** Profesionales de la Secretaría Comunal de Planificación (SECPLA) y la Dirección de Obras Municipales (DOM) de la Municipalidad de Santiago; analistas de ministerios sectoriales (MINVU, MOP, MIDESO, SUBDERE) y consejeros del Gobierno Regional Metropolitano (GORE RM).
* **Nivel Técnico:** Profesional de alto nivel especializado en instrumentos de planificación territorial (IPT), ordenanzas urbanísticas (OGUC, PRC), formulación de iniciativas de inversión en el Banco Integrado de Proyectos (BIP) y gestión de infraestructura comunal.
* **Requerimientos Territoriales Críticos:**
  - Intersección espacial automatizada e instantánea entre cualquier coordenada geográfica del territorio y las 192 subzonas normativas del Plan Regulador Comunal de Santiago, emitiendo el **Certificado de Informaciones Normativas VGI (CIN-VGI)** con especificación de coeficientes de constructibilidad, ocupación de suelo, rasantes y usos prohibidos.
  - Cruce espacial entre las iniciativas de inversión pública recomendadas favorablemente en el Sistema Nacional de Inversiones (BIP) y los polígonos de mayor vulnerabilidad socioeconómica del Censo 2024 y Registro Social de Hogares (RSH).
  - Auditoría de calidad de datos espaciales bajo norma ISO 19157 para justificar técnicamente postulaciones a fondos públicos de financiamiento regional (FNDR) o mejoramiento urbano (PMU).
* **Módulos del Atlas Adaptados:** Inspector Normativo Territorial (Módulo 00), Módulo de Indicadores de Calidad WLC, Catálogo Oficial de Capas Normativas IDE Chile y capa catastral de semáforos UOCT.

---
"""
print("[+] Parte 01 enriquecida cargada exitosamente")
