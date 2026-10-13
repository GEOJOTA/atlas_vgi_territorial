# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
## Informe Técnico y Epistemológico de Puesta al Día — Octubre 2026

---

## 1. Identidad del Proyecto y Marco Epistemológico

| Dimensión | Detalle Operativo y Académico |
|---|---|
| **Nombre del Proyecto** | Atlas de Información Geográfica Voluntaria para la Gestión Territorial — Nodo GeoAbierto |
| **Autor y Desarrollador** | Juan Pablo Lescano Villegas (`GEOJOTA`) |
| **Contacto Institucional** | juanpablolescanovillegas@gmail.com |
| **Institución Patrocinante** | Departamento de Geografía, Facultad de Ciencias Sociales, Universidad Alberto Hurtado (UAH) |
| **Marco de Investigación** | Proyecto Fondecyt Regular N° 1261256 sobre VGI, Infraestructuras de Datos Espaciales y Gobernanza Territorial (Investigador Responsable: Dr. Manuel Fuenzalida, UAH) |
| **Caso Piloto Territorial** | Barrio Brasil y Entorno Patrimonial Campus UAH — Comuna de Santiago, Región Metropolitana, Chile |
| **Plataforma en Producción** | [https://atlasvgiuah.netlify.app/](https://atlasvgiuah.netlify.app/) |
| **Repositorio Oficial** | [https://github.com/GEOJOTA/atlas_vgi_uah](https://github.com/GEOJOTA/atlas_vgi_uah) |
| **Base de Datos Espacial** | PostgreSQL 17 + PostGIS 3.3 en Supabase Cloud (`tkfzmmlhhxqhzgqavsqr`) |
| **Despliegue Continuo (CI/CD)**| Netlify CD vinculado a rama `main` de GitHub |

### Fundamentación en la Literatura Geográfica
La producción cartográfica tradicional ha estado históricamente concentrada en organismos centralizados del Estado (Instituto Geográfico Militar, ministerios sectoriales, direcciones de obras municipales). Si bien estos catastros poseen validez jurídica, sufren de ciclos de actualización prolongados (a menudo superiores a 5 o 10 años) y una escala macro que suele omitir la microgeografía de la vida cotidiana.

A partir del trabajo seminal de Michael Goodchild (2007) sobre los *ciudadanos como sensores* (*Citizens as Sensors*) y los análisis de Muki Haklay (2010) sobre la precisión de OpenStreetMap, la geografía contemporánea reconoce la **Información Geográfica Voluntaria (VGI)** como una fuente legítima y complementaria. El Atlas VGI no busca duplicar la cartografía estatal, sino subsanar sus **vacíos de micro-escala** (accesibilidad universal, arbolado viario de proximidad, comercio barrial, equipamiento comunitario) bajo un esquema riguroso de auditoría estandarizada (Elwood et al., 2012; Senaratne et al., 2017).

---

## 2. Bounding Box del Territorio de Estudio y Encuadre Geodésico

| Sector | Bounding Box WGS84 `[Lon_min, Lat_min, Lon_max, Lat_max]` | Centroide `[Lat, Lon]` | Zoom Óptimo |
|---|---|---|:---:|
| **Barrio Brasil Completo** | `[-70.6720, -33.4505, -70.6580, -33.4350]` | `[-33.4425, -70.6650]` | 15 |
| **Manzana Patrimonial Campus UAH** | `[-70.6675, -33.4505, -70.6565, -33.4385]` | `[-33.4445, -70.6620]` | 16 |
| **Región Metropolitana de Santiago** | `[-71.5000, -34.2000, -70.0000, -33.0000]` | `[-33.4500, -70.6600]` | 10 |

* **Sistema de Referencia Geodésico de Almacenamiento e Intercambio:** EPSG:4326 (WGS 84 / Grados Decimales conforme a RFC 7946 GeoJSON).
* **Sistema Geodésico de Proyección para Análisis Métrico y Superficies:** EPSG:32719 (UTM Huso 19 Sur / WGS 84, cálculo euclidiano exacto de áreas en m² y densidades urbanas).
* **Homología Nacional:** Conforme a la Red Geodésica Nacional SIRGAS-Chile 2016 (Decreto Supremo N° 28/2006 del Ministerio de Bienes Nacionales).

---

## 3. Arquitectura del Sistema (Zero-Build SPA y Resiliencia en el Borde)

El sistema está concebido bajo el paradigma de **arquitectura desacoplada en el navegador (*Zero-Build Client-Side SPA*)**, garantizando que cualquier usuario, municipio u organización vecinal pueda ejecutar la plataforma completa sin depender de entornos de compilación privativos o servidores de costo recurrente:

```
+-----------------------------------------------------------------------------------------+
|                       NAVEGADOR CLIENTE (Zero Build SPA — HTML5 / CSS3 / ES6)            |
|                                                                                         |
|   src/index.html + css/estilos.css                                                      |
|   +----------------------------------------------------------------------------------+  |
|   |  js/app.js (Orquestador general y ciclo de vida de la aplicación)                |  |
|   |  js/config.js (Variables globales, endpoints, claves públicas seguras)           |  |
|   |  js/modulos/ (16 controladores y motores de análisis modularizados)              |  |
|   +----------------------------------------------------------------------------------+  |
+---------+------------------+------------------+------------------+---------------------+
          |                  |                  |                  |                     |
          v                  v                  v                  v                     v
    Supabase Cloud      Overpass API       ohsome API       Taginfo API        GBIF Darwin
   PostGIS 17 + 3.3      QL Servers        v1/v2 HeiGIT       v4 HeiGIT         Core Search
   129.262 Entidades     3 Espejos        Series P1Y        Telemetría        Ocurrencias y
     Índices GIST        Balanceados      OSM History        Planetaria         Taxonomías
```

### Mecanismo de Failover de Triple Contingencia
1. **Nivel 1 (RPC PostGIS en la Nube):** Invocación de la función `fn_obtener_capa_bbox` en Supabase, filtrando por Bbox con índices R-Tree en milisegundos.
2. **Nivel 2 (Storage CDN Público):** Descarga directa de archivos GeoJSON binarios desde el bucket `atlas-geojson` en Supabase Storage.
3. **Nivel 3 (Respaldo Local Autónomo):** Fallback inmediato y transparente al directorio estático `data/*.geojson` servido desde Netlify, garantizando disponibilidad 100% incluso ante caídas de red externa o agotamiento de cuotas.

---

## 4. Módulos Funcionales del Atlas (Estructura de 9 Paneles)

| ID Panel | Módulo | Responsabilidad Técnica y Conceptual | Estándares / APIs |
|:---:|---|---|---|
| **00** | **Visor Cartográfico & Inspector Normativo** | Visor espacial 2D (Leaflet 1.9.4), control multicapa (118 capas), dibujo de Bbox, panel de telemetría e **Inspector Normativo CIN-VGI** (cruce de zonificación PRC Santiago, OGUC y patrimonio). | RFC 7946, OGUC Art. 2.1.24, LGUC Art. 60/116. |
| **01** | **Explorador OSM & Base Regional Geofabrik** | Consultas interactivas en vivo vía Overpass QL y consulta espacial por Bbox sobre el extracto regional de Geofabrik RM (1.55M entidades). | Overpass API QL, Taginfo API v4, OSM Wiki. |
| **02** | **Evaluador Universal de Calidad IGV & OQT** | **Submódulo A:** Motor algorítmico universal de control de calidad espacial OGC (ISO 19157 / ISO 19115 / WLC) con semáforo, certificado JSON y plan de subsanación. **Submódulo B:** Saturación OQT y series ohsome v1/v2 (HeiGIT). | ISO 19157:2013, ISO 19115-1:2014, ohsome API, OSMCha. |
| **03** | **Biodiversidad Urbana (GBIF)** | Mapeo de ciencia ciudadana y biodiversidad vegetal/avifauna en Barrio Brasil mediante autocompletado taxonómico y banderas de calidad. | GBIF Species & Occurrence API, Darwin Core Standard. |
| **04** | **Cartografía Temática (UMap)** | Integración y visualización de iniciativas cartográficas vecinales y comunitarias desarrolladas en UMap. | OpenStreetMap Foundation, UMap GeoJSON. |
| **05** | **Metadatos Normalizados (ISO 19115 / 19139)** | Generador dual con exportación de fichas en JSON (ISO 19115) y XML interoperable (ISO 19139) listo para cosecha CSW en Geoportal IDE Chile. | ISO 19115-1, ISO 19139, Perfil Nacional IDE Chile SNIT. |
| **06** | **Diccionario Territorial de Brechas** | Catálogo sistemático de 134 descriptores territoriales contrastando 48 capas oficiales del Estado vs 86 brechas microespaciales VGI. | ISO 19110:2016, Taginfo API v4, IDE Chile. |
| **07** | **Catálogos y Licencias Abiertas** | Centro de descargas de matrices técnicas OpenXML (.xlsx), informe de MetaCalidad y marco jurídico (ODbL 1.0, CC-BY 4.0, GPL v3). | Open Data Commons, Creative Commons, Ley 20.285. |
| **08** | **Manual de Uso Metodológico** | Guía de operación paso a paso integrada en la interfaz para capacitación y transferencia a municipios y organizaciones. | Documentación técnica en Markdown. |

---

## 5. Estructura de la Base Cartográfica (118 Componentes)

La geodatabase del Atlas integra **118 capas cartográficas estructuradas**:
* **10 Macro-categorías Comunitarias VGI (OSM + GBIF):** Levantadas colaborativamente y normalizadas con 14 atributos clave (nombre, tipología, accesibilidad, estado de conservación, fecha de captura, fuente y cita APA).
* **108 Capas Oficiales del Estado de Chile:** Provenientes de 22 instituciones públicas (MINVU, INE, MTT/UOCT, MOP, DGA, MMA, MDSF, CMN, CNE, SII, CONAF, entre otras) amparadas bajo la **Ley N° 20.285 de Transparencia y Acceso a la Información Pública**.

### 5.1 Macro-categorías VGI Comunitarias (10 Capas Maestras)
1. **CAT-01: Educación y Universidad:** Campus patrimonial UAH, facultades, colegios, liceos y bibliotecas públicas.
2. **CAT-02: Servicios, Comercio y Abastecimiento Barrial:** Comercio de proximidad, almacenes, farmacias populares, ferias libres, CESFAM y bancos.
3. **CAT-03: Movilidad y Transporte Público:** Red vial estructurante, paraderos Red Movilidad, accesos a estaciones de Metro (L1, L2, L5) y trazados ferroviarios.
4. **CAT-04: Movilidad Activa y Ciclovías:** Ciclovías segregadas (Rosas, Brasil), ciclobandas, bicicleteros públicos y sendas peatonales.
5. **CAT-05: Áreas Verdes, Espacio Público y Deporte:** Plaza Brasil, bandejones arbolados de Alameda, plazoletas, juegos infantiles y canchas comunitarias.
6. **CAT-06: Patrimonio Histórico, Memoria y Cultura:** Zonas Típicas, Inmuebles de Conservación Histórica (ICH), monumentos públicos, centros culturales e iglesias patrimoniales.
7. **CAT-07: Accesibilidad Universal y Cruces Peatonales:** Vados peatonales rebajados conforme a D.S. N° 50 MINVU, baldosas podotáctiles y semáforos sonoros.
8. **CAT-08: Biodiversidad Urbana y Arbolado:** Catastro de arbolado viario de alineación comunitaria cruzado con registros biológicos validados de GBIF.
9. **CAT-09: Edificaciones y Huella Urbana:** Polígonos de edificaciones, volumetría construida y cálculo de superficie métrica en m² reprojectada a EPSG:32719.
10. **CAT-10: Coberturas y Usos de Suelo:** Zonificación funcional y biológica del suelo urbano (residencial, comercial, equipamiento, vegetación).

### 5.2 Capas Oficiales del Estado de Chile (108 Capas en 7 Macro-grupos)
1. **Normativa Urbanística & Catastro Predial (MINVU, DPA, SII) [13 capas]:** Zonificación PRC Santiago, usos de suelo PRMS, riesgos normativos, fajas de resguardo, catastro predial SII RM.
2. **Movilidad, Tránsito & Cruces Semaforizados (UOCT / MTT, MOP, Metro, EFE) [7 capas]:** Red de semáforos centralizados UOCT RM (3.242 intersecciones), Red Vial Nacional GEOMOP, Metro, ferrocarriles y ciclovías oficiales.
3. **Demografía, Censo 2024, Comunidades & Vulnerabilidad (INE, MDSF, MINVU) [19 capas]:** Microdatos Censo 2024 multiescalar (1.711 manzanas censales de Santiago con 216 variables), unidades vecinales oficiales (Ley 19.418), campamentos 2024 y 7 indicadores del Registro Social de Hogares (RSH).
4. **Economía, Inversión Pública & Infraestructura (MDSF BIP, MOP, CNE, ODEPA) [15 capas]:** Banco Integrado de Proyectos (BIP), infraestructura eléctrica, redes de gas, ductos, mercados de abasto e iniciativas de inversión.
5. **Equipamiento Público, Educación, Salud & Patrimonio (CMN, MINEDUC, MINSAL, IND) [28 capas]:** Inmuebles ICH, ZCH, Sitios de Memoria, hospitales DEIS, colegios, jardines JUNJI, infraestructura deportiva y series históricas CCU (1993–2024).
6. **Medio Ambiente, Recursos Hídricos & Parques (MMA, DGA, CONAF, DMC) [21 capas]:** Áreas verdes normativas IPT, red hidrométrica DGA, cuencas BNA, calidad del aire SINCA, humedales protegidos (Ley 21.202) y estaciones meteorológicas.
7. **Seguridad, Bomberos & Justicia (Carabineros, CBS, SENAPRED) [5 capas]:** Cuarteles de bomberos, comisarías de Carabineros, cuadrantes de seguridad y juzgados de familia.

---

## 6. Base de Datos Espacial en la Nube (PostgreSQL 17.6 + PostGIS 3.3)

* **Instancia:** Supabase Cloud con motor PostgreSQL 17.6 y extensión PostGIS 3.3.
* **Volumen Vectorial:** 129.262 entidades geométricas cargadas en la tabla `public.capas_entidades`, optimizadas a formato binario WKB con índices espaciales R-Tree (`GIST (geom)`).
* **Catálogo Atributivo Relacional:** Tabla `public.capas_metadata` con 108 registros documentando identificadores oficiales, nombres normalizados, instituciones custodias, citas bibliográficas en APA 7ª ed. y conteo de entidades.
* **Función Espacial RPC:** `fn_obtener_capa_bbox(capa_id text, min_lon double precision, min_lat double precision, max_lon double precision, max_lat double precision)` que ejecuta la intersección espacial en la base de datos y retorna GeoJSON nativo en milisegundos.
* **Keep-Alive a Costo $0:** Flujo automatizado de GitHub Actions ([`supabase_keepalive.yml`](.github/workflows/supabase_keepalive.yml)) que envía un ping de telemetría cada 72 horas, previniendo la suspensión del clúster por inactividad.

---

## 7. Ecosistema de APIs e Interoperabilidad

| API / Servicio | Proveedor / Organización | Función en el Atlas | Estándar / Protocolo |
|---|---|---|---|
| **Overpass API v0.7** | OpenStreetMap Foundation | Extracción vectorial en vivo de las 10 categorías VGI (3 espejos balanceados con timeout de 25s). | Overpass QL / JSON / GeoJSON |
| **ohsome API v1 & v2** | HeiGIT (Heidelberg University) | Consulta de series temporales quinquenales (P1Y) y cálculo del Índice de Saturación OQT. | OSHDB / REST API |
| **Taginfo API v4** | OpenStreetMap Foundation | Validación de semántica global de etiquetas, frecuencia de uso y estados de estandarización. | REST API / JSON |
| **OSMCha API** | Mapbox / OSM Community | Inspección y auditoría de conjuntos de cambios (*changesets*) en el territorio barrial. | REST API / GeoJSON |
| **GBIF Occurrence & Species** | Global Biodiversity Information Facility | Búsqueda de taxones validados y descarga de registros biológicos urbanos de ciencia ciudadana. | Darwin Core Archive / REST |
| **GeoIDE MINVU WMS** | Ministerio de Vivienda y Urbanismo | Visualización de capas normativas de planificación territorial en tiempo real. | OGC WMS 1.3.0 |

---

## 8. Diccionario Territorial y Brechas VGI (Hallazgo Metodológico)

El Atlas cataloga **134 descriptores territoriales estandarizados**:
* **48 descriptores oficiales:** Cuentan con capa homologada en la Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT), permitiendo contrastar la información ciudadana con la verdad institucional del Estado.
* **86 descriptores de Brechas VGI:** Corresponden a elementos fundamentales de la microgeografía urbana (rampas peatonales, baldosas táctiles, bicicleteros barriales, arbolado de vereda, comercio familiar, puntos de reciclaje vecinal) que **no existen en ningún catastro oficial del Estado de Chile**.

> **Conclusión Epistemológica:** La VGI no compite con la cartografía estatal ni intenta reemplazarla; actúa como un instrumento de **densificación microespacial y vigilancia comunitaria** en aquellas escalas donde el Estado no dispone de presupuesto ni capacidad logística para inventariar de forma continua.

---

## 9. Perfiles de Actor Territorial y Gobernanza Multiactor

Para garantizar que la herramienta sea socialmente apropiable y transferible a la toma de decisiones, el Atlas define cinco perfiles diferenciados basados en el marco institucional chileno:

| Perfil de Actor Territorial | Actores Reales en Barrio Brasil / RM | Interés Operativo y Funcionalidad Destacada |
|---|---|---|
| **🏛️ Institucional / Sector Público** | Municipalidad de Santiago (SECPLA, DIMAO, Asesoría Urbana, DOM), SEREMI MINVU RM, IDE Chile / SNIT, INE. | Fiscalización de Instrumentos de Planificación Territorial (PRC Santiago), análisis de microdatos censales 2024, cruces de zonas de riesgo y exportación interoperable en XML ISO 19139. |
| **👥 Organizaciones Comunitarias Territoriales (Ley N° 19.418)** | Juntas de Vecinos con base en el territorio: JJVV Barrio Brasil N° 1, JJVV Santa Ana, JJVV Concha y Toro, JJVV República. | Diagnóstico vecinal inmediato en 1 clic (salud, ferias, áreas verdes, paraderos), verificación de condiciones de habitabilidad barrial y cartografía comunitaria en UMap. |
| **🤝 Organizaciones Comunitarias Funcionales (Ley N° 19.418)** | Comités de Adelanto y Seguridad Barrial, Clubes Deportivos, Agrupaciones Culturales y Patrimoniales, Huertos Comunitarios. | Visibilización de equipamiento barrial de proximidad, fiscalización de aceras accesibles y preservación de memoria colectiva. |
| **🧭 Voluntariado / Mapeadores OSM y Movilidad** | Comunidad OpenStreetMap Chile, colectivos ciclistas y agrupaciones de caminabilidad urbana. | Formulación de consultas complejas en Overpass QL, telemetría global en Taginfo, detección de vacíos de microatributos de accesibilidad (`wheelchair`, `kerb`) y auditoría en OSMCha. |
| **🔬 Académico / ONGs / Investigación Territorial** | Departamento de Geografía UAH, TECHO-Chile, JuntoAlBarrio, Fundación SUR. | Análisis espacial cuantitativo, reproyección métrica a EPSG:32719, cálculo de densidades, análisis de evolución temporal ohsome y citas bibliográficas normalizadas en APA 7ª ed. |

---

## 10. Integración Multiescalar del Censo 2024 y Optimización contra Fallos de Memoria (OOM)

La integración cartográfica del **Censo de Población y Vivienda 2024 (INE / IDE Chile)** se estructuró de manera multiescalar en 5 niveles independientes:

| Nivel Escalar | Capa ID | Archivo GeoJSON | Entidades | Peso | Variables y Alcance Territorial |
|---|---|---|:---:|:---:|---|
| **Escala 1: Regional** | `censo2024_regional` | `ide_censo2024_regional.geojson` | 1 | 773 KB | Marco macroterritorial de la Región Metropolitana (Código CUT 13). |
| **Escala 2: Límites Urbanos** | `censo2024_limite_urbano` | `ide_censo2024_limite_urbano.geojson` | 106 | 6.1 MB | Delimitación de las 106 áreas urbanas censales consolidadas de la RM. |
| **Escala 3: Localidades** | `censo2024_localidades` | `ide_censo2024_localidades.geojson` | 511 | 16.4 MB | Localidades pobladas y entidades urbanas y rurales con categoría censal. |
| **Escala 4: Distritos y Zonas** | `censo2024_zonal` | `ide_censo2024_zonal.geojson` | 1.865 | 26.5 MB | Zonas y distritos censales de toda la RM con 186 variables agregadas. |
| **Escala 5: Manzanas Censales** | `censo2024_manzanas` | `ide_censo2024_manzanas.geojson` | 1.711 | 12.46 MB | Microdatos a nivel predial/manzana censal para la Comuna de Santiago (Barrio Brasil, Campus UAH y casco histórico) con 216 variables del INE. |

### Resolución del Problema de Memoria en Navegadores (Out-of-Memory / OOM)
* **El problema detectado:** Originalmente se disponía de un dump regional de manzanas censales de 496.87 MB con 66.873 polígonos. Al cargarlo en el cliente web, la des-serialización JSON exigía entre 2.5 y 3.5 GB de memoria RAM, saturando el límite de pila del motor JavaScript y provocando el reinicio forzado de la pestaña por el navegador.
* **La solución implementada:** Se delimitó la capa oficial de manzanas censales al área de estudio del caso piloto (Comuna de Santiago: 1.711 manzanas censales, 12.46 MB), preservando el **100% de las 216 variables socioeconómicas y demográficas** del INE.
* **Rendimiento empírico:** La auditoría espacial en el navegador pasó de colapsar la pestaña a ejecutarse en **422 milisegundos**, logrando un 100% de validez topológica OGC y estabilidad absoluta.

---

## 11. Motor Algorítmico Universal de Calidad IGV (Marco Teórico ISO 19157 / ISO 19115)

El Módulo 02 implementa un evaluador de calidad espacial en el cliente sustentado en la literatura de evaluación de datos colaborativos (Haklay, 2010; Senaratne et al., 2017) y en la metodología de **Combinación Lineal Ponderada (WLC — *Weighted Linear Combination*)** formulada por Malczewski (1999), Voogd (1983) y Eastman (1999).

$$\text{IGV} = 0.50 \cdot S_{\text{cuantitativo}} + 0.50 \cdot S_{\text{cualitativo}}$$

### A. Pilar Cuantitativo Espacial (50% — ISO 19157 / OGC Simple Features)
1. **Consistencia Topológica (30%):** Detección de auto-intersecciones de polígonos (*kinks*), anillos no cerrados, vértices colapsados y validez OGC SFA (ISO 19125-1).
2. **Completitud Tabular (25%):** Ausencia de valores nulos, vacíos o indefinidos en la tabla de atributos de las entidades.
3. **Exactitud Posicional (20%):** Integridad de coordenadas numéricas finitas dentro del dominio geográfico válido de latitud y longitud.
4. **Estructura y Esquema (15%):** Homogeneidad tipológica de geometrías y presencia de identificador único primario (`id` o `fid`).
5. **Granularidad Geométrica (10%):** Ausencia de micro-slivers (polígonos parásito residuales con área menor a $1 \cdot 10^{-7}$ grados²).

### B. Pilar Cualitativo de Metadatos (50% — ISO 19115 / ISO 19110 / IDE Chile)
1. **Metadatos Núcleo (30%):** Cumplimiento de los 10 elementos indispensables de ISO 19115 (título, resumen, custodio, fecha, categoría temática, Bbox, CRS, licencia, linaje).
2. **Conformidad Semántica (20%):** Nombres de campos estandarizados en minúsculas sin caracteres especiales y catálogo de objetos documentado.
3. **Linaje y Certeza Jurídica (25%):** Trazabilidad metodológica de captura y régimen de derechos de uso explícito (Ley 20.285, ODbL 1.0, CC-BY 4.0).
4. **Resolución Espacial (15%):** Consistencia de escala cartográfica y granularidad territorial nominal.
5. **Accesibilidad Operativa (10%):** Formato abierto de transferencia (GeoJSON RFC 7946) y disponibilidad pública del recurso.

### Blindaje de Renderizado en el Cliente
* **Paginación DOM:** En datasets con alto volumen de observaciones, la interfaz pagina el listado a las primeras 50 anomalías, evitando la creación desmedida de nodos en el DOM.
* **Límite de Renderizado en Leaflet:** El mini-mapa diagnóstico dibuja hasta 300 entidades vectoriales concurrentes, priorizando el 100% de las geometrías con error o micro-slivers para que el usuario pueda hacer zoom e inspeccionarlas sin degradar el rendimiento gráfico de la GPU.
* **Auto-Fix y Subsanación:** El motor permite descargar con un clic el GeoJSON reparado automáticamente (anillos cerrados, vértices redundantes eliminados, campos saneados) y genera guías técnicas paso a paso listas para copiar para **QGIS 3.x**, **PostGIS 3.x** y **GeoPandas**.

---

## 12. Inspector Normativo Territorial (CIN-VGI) y Rigor Urbanístico

El Módulo 00 integra el **Inspector Normativo CIN-VGI**, concebido para que vecinos, estudiantes y profesionales auditen la normativa urbana aplicable a cualquier coordenada dentro de la Comuna de Santiago mediante algoritmos geométricos *Point-in-Polygon* (Ray-casting):

1. **Zonificación del Plan Regulador Comunal (PRC Santiago):** Identifica la zona urbana oficial (ej. Zona A - Centro Histórico, Zona B - Pericentro, Zona E - Mixta) y extrae las ordenanzas y decretos vigentes publicados en el Diario Oficial.
2. **Principio de Exclusión Negativa (Art. 2.1.24 OGUC):** Contrasta los usos de suelo permitidos y prohibidos, recordando que en el derecho urbanístico chileno todo uso o actividad que no esté taxativamente enunciado como permitido se encuentra legalmente prohibido.
3. **Áreas de Riesgo y Resguardo (Art. 2.1.17 OGUC):** Cruce espacial con fajas de riesgo geológico, inundación o resguardo de infraestructura pública.
4. **Protección Patrimonial Oficial:** Verificación de afectación por Zonas de Conservación Histórica (ZCH), Inmuebles de Conservación Histórica (ICH) conforme al Art. 60 de la Ley General de Urbanismo y Construcciones (LGUC), y Zonas Típicas amparadas por la Ley N° 17.288 de Monumentos Nacionales.
5. **Aclaración Metodológica y Descargo Legal (Art. 116 LGUC):**
   * El inspector **no inventa parámetros ficticios** (como coeficientes de constructibilidad o de ocupación de suelo que requerirían un catastro predial volumétrico a nivel de lote singular).
   * Todo reporte generado emite el descargo legal expreso señalando que el documento tiene carácter estrictamente referencial y que **bajo ninguna circunstancia reemplaza al Certificado de Informaciones Previas (CIP)**, facultad exclusiva y privativa del Director de Obras Municipales (DOM) según el Art. 116 del D.F.L. N° 458/1975.

---

## 13. Pipeline CLI de Procesamiento y Aseguramiento de Calidad

Previo a cualquier despliegue a producción en Netlify, el repositorio ejecuta una suite automatizada de validaciones escritas en Python:

```bash
# 1. Auditoría universal de integridad binaria (214 GeoJSONs y libros Excel sin punteros LFS rotos):
python3 scripts/verificar_integridad_despliegue.py

# 2. Control de conteo estricto de capas (108 oficiales + 10 VGI = 118 totales):
python3 scripts/verificar_conteo_capas.py

# 3. Auditoría programática universal de MetaCalidad (ISO 19115 / ISO 19157):
python3 scripts/analisis_metacalidad.py
```

### Resultados de la Auditoría de MetaCalidad (Octubre 2026):
* **Componentes auditados:** 118 capas cartográficas (108 oficiales + 10 macro-categorías VGI).
* **Volumen cartográfico activo:** 2.14 GB (2.138,18 MB).
* **Índice Global de Calidad Geográfica (IGV):** **95.29%** (Grado A+ Excelente / A Muy Bueno).
  * Pilar Cuantitativo Espacial: 96.63% (Topología OGC: 99.87%, Integridad Posicional: 99.76%).
  * Pilar Cualitativo de Metadatos: 93.96% (Metadatos Núcleo: 95.97%, Linaje Legal: 97.95%).
* **Distribución de Calidad:** 74 capas en Grado A+ (62.7%), 44 capas en Grado A (37.3%), 0 capas en Grado B o C.

---

## 14. Conclusiones y Transferibilidad

El Atlas de Información Geográfica Voluntaria para la Gestión Territorial demuestra empíricamente que:
1. La VGI y la cartografía colaborativa alcanzan estándares científicos e institucionales rigurosos cuando se someten a marcos formales de evaluación como **ISO 19157**, **ISO 19115** y el **Perfil Nacional de Metadatos de Chile**.
2. La arquitectura *Zero-Build* combinada con bases de datos espaciales en la nube (PostGIS) y computación en el cliente (*Client-side Edge Computing*) permite democratizar el acceso a herramientas SIG de nivel profesional a costo $0 para municipios y organizaciones sociales.
3. El proyecto se consolida como una plataforma transferible, reproducible y metodológicamente transparente, lista para apoyar la gestión urbana, la docencia universitaria y la investigación aplicada en el Barrio Brasil y la Región Metropolitana.

---

*Documento actualizado en octubre de 2026 tras el blindaje computacional del evaluador de calidad, la optimización multiescalar del Censo 2024 y la auditoría universal de la geodatabase.*  
*Repositorio en GitHub: [https://github.com/GEOJOTA/atlas_vgi_uah](https://github.com/GEOJOTA/atlas_vgi_uah)*  
*Producción en Netlify: [https://atlasvgiuah.netlify.app/](https://atlasvgiuah.netlify.app/)*
