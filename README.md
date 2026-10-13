# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
### Nodo GeoAbierto — Caso Piloto: Barrio Brasil · Universidad Alberto Hurtado (Santiago, Chile)

Plataforma web de código abierto para consultar, evaluar, visualizar y documentar **Información Geográfica Voluntaria (VGI)** en el territorio de Barrio Brasil. Desarrollado en el Departamento de Geografía de la Universidad Alberto Hurtado (2026), en el marco de la investigación sobre VGI, infraestructuras de datos espaciales y gestión territorial.

Integra un **visor cartográfico interactivo 2D de alta resolución (Leaflet 1.9.4)**, métricas de calidad de datos (ohsome API / Índice de Calidad VGI), evaluación normativa territorial (PRC Santiago / OGUC), **118 capas cartográficas integradas** (10 macro-categorías maestras VGI y 108 capas oficiales del Estado de Chile desde GEOMOP, MINVU, Geoportal, DGA, DIFROL, MINAGRI, BiDat, INE Censo 2024 multiescalar, UOCT / MTT y CNE), base de datos espacial en la nube **PostgreSQL 17.6 + PostGIS 3.3 (Supabase)** con entidades espaciales vectorizadas e indexadas con GIST, bucket público de almacenamiento CDN (`atlas-geojson`), consultas espaciales en milisegundos por RPC y exportación a GeoJSON, CSV, metadatos ISO 19115/19139 y catálogos Excel sincronizados.

> **Acceso libre y código abierto.** Toda la funcionalidad opera con CDN públicos, APIs abiertas (OpenStreetMap, GBIF, ohsome, IDE Chile) y base de datos PostGIS gratuita en la nube con fallback local transparente.

---

## 1. Contexto y motivación

Cuando una institución pública, organización comunitaria o voluntario quiere usar datos colaborativos como OpenStreetMap o GBIF para un diagnóstico urbano local, normalmente enfrenta tres problemas:

1. **Dispersión y heterogeneidad:** APIs con sintaxis disímiles y sin normalización de atributos.
2. **Incertidumbre de calidad:** ¿Cuántos colaboradores han editado? ¿Cuándo fue la última actualización? ¿Cómo distinguir datos confiables?
3. **Falta de interoperabilidad oficial:** Los datos casi nunca tienen metadatos compatibles con el estándar IDE Chile (ISO 19115 / ISO 19139).

El **Atlas VGI** resuelve esto integrando consulta espacial, visor cartográfico interactivo, métricas de calidad, evaluación normativa territorial, base de datos relacional espacial y exportación estructurada.

---

## 2. Territorio piloto

**Barrio Brasil**, Santiago Centro (EPSG:4326):
- **Bounding Box:** `[-70.6720, -33.4505, -70.6580, -33.4350]` (Barrio Brasil Completo) / `[-70.6675, -33.4505, -70.6565, -33.4385]` (Manzana Campus UAH)
- Campus UAH (Almirante Barroso, Erasmo Escala, Cienfuegos), Plaza Brasil, eje Alameda, Metro Los Héroes (L1/L2), Santa Ana (L2/L5) y Cumming (L5).

---

## 3. Usuarios de la plataforma (Perfiles de Actor Territorial)

El Atlas articula a los diversos agentes que inciden en la coproducción y gestión del territorio, adaptando su interfaz según las necesidades operativas de cada perfil:

| Perfil de Actor Territorial | Ejemplos Reales (Barrio Brasil / RM) | Foco Operativo y Utilidad Territorial |
|---|---|---|
| **🏛️ Institucional / Sector Público** | Municipalidad de Santiago (SECPLA, DIMAO, Asesoría Urbana, DOM), SEREMI MINVU RM, IDE Chile / SNIT, INE | Fiscalización de Instrumentos de Planificación Territorial (PRC Santiago), cruce de microdatos Censo 2024 a nivel de manzana y exportación interoperable en XML ISO 19139 para el Geoportal Nacional. |
| **👥 Organizaciones Comunitarias Territoriales (Ley N° 19.418)** | Juntas de Vecinos con base en el territorio: JJVV Barrio Brasil N° 1, JJVV Santa Ana, JJVV Concha y Toro, JJVV República | Diagnóstico vecinal inmediato en 1 clic (salud, ferias libres, áreas verdes, paraderos), fiscalización del espacio público y lectura territorial sin barreras técnicas. |
| **🤝 Organizaciones Comunitarias Funcionales (Ley N° 19.418)** | Comités de Adelanto y Seguridad Barrial, Clubes Deportivos, Agrupaciones Culturales y Patrimoniales, Huertos Comunitarios | Visibilización de equipamiento de proximidad, mapeo de memoria barrial y articulación de proyectos vecinales mediante cartografía colaborativa en UMap. |
| **🧭 Voluntarios / Mapeadores OSM y Movilidad** | Comunidad OpenStreetMap Chile, colectivos ciclistas y agrupaciones de caminabilidad urbana | Consultas Overpass QL avanzadas, telemetría planetaria en Taginfo API v4, auditoría de cambios territoriales en OSMCha y detección de vacíos en microatributos de accesibilidad (`kerb`, `tactile_paving`). |
| **🔬 Académico / ONGs / Investigación Territorial** | Departamento de Geografía UAH, TECHO-Chile, JuntoAlBarrio, Fundación SUR | Análisis espacial riguroso, reproyección métrica conforme a EPSG:32719, cálculo de densidades, análisis de series temporales ohsome (HeiGIT) y citas bibliográficas normalizadas en APA 7ª ed. |

---

## 4. Las 10 categorías maestras VGI

Estandarizadas bajo las taxonomías de **OpenStreetMap**, **GBIF Darwin Core** y el estándar **ISO 19110 / ISO 19115**:

| Cód. | Categoría Maestra | Entidades RM (Geofabrik) | Fuente OSM / GBIF | Enfoque Territorial Barrio Brasil y Región Metropolitana |
|---|---|:---:|---|---|
| **CAT-01** | Educación y Universidad | **7.503** | `amenity=university|college|school|library`, relaciones campus | Campus patrimonial UAH (Barroso, Erasmo Escala), facultades, colegios, liceos y bibliotecas de la RM |
| **CAT-02** | Servicios, Comercio y Abastecimiento | **54.442** | `shop=*`, `amenity=*`, `power=*`, `emergency=*`, sitios comerciales | Comercio de proximidad, farmacias de barrio, ferias libres, CESFAM, bancos, redes eléctricas y de emergencia |
| **CAT-03** | Movilidad y Transporte Público | **326.545** | `highway=*` (red completa), `railway=*`, `restriction=*`, `destination=*` | Red vial completa (384k líneas), Red Metro, paraderos y rutas Red Movilidad, ferrocarriles, señalética y restricciones |
| **CAT-04** | Movilidad Activa y Ciclovías | **128.891** | `highway=cycleway`, `cycleway=*`, `footway|pedestrian|path`, `traffic_calming=*` | Ciclovías segregadas Rosas y Brasil, sendas peatonales, veredas, escaleras, cicloparqueaderos y calma de tráfico |
| **CAT-05** | Áreas Verdes y Espacio Público | **41.433** | `leisure=park|playground|pitch`, `amenity=bench`, `landuse=grass` | Parques metropolitanos, plazas barriales, canchas comunitarias, juegos infantiles, mobiliario y bebederos |
| **CAT-06** | Patrimonio Histórico y Cultura | **2.576** | `historic=*`, `heritage=*`, `amenity=theatre|place_of_worship` | Zonas Típicas, Inmuebles de Conservación Histórica (ICH), monumentos, templos religiosos y museos |
| **CAT-07** | Accesibilidad Universal y Cruces | **94.461** | `kerb=lowered`, `tactile_paving=*`, `traffic_signals:sound`, `barrier=bollard|gate` | Vados peatonales D.S. 50 MINVU, pavimentos podotáctiles, cruces semaforizados, bolardos y control peatonal |
| **CAT-08** | Biodiversidad Urbana y Arbolado | **121.134** | `natural=tree|wood|water`, redes hidrográficas + GBIF | Arbolado urbano, Río Mapocho, Zanjón de la Aguada, canales, redes fluviales complejas y biodiversidad |
| **CAT-09** | Edificaciones y Huella Urbana | **695.412** | `building=*`, `addr:housenumber`, `barrier=wall|fence` [EPSG:32719] | Catastro exhaustivo de huellas urbanas sin recortes (multipolígonos, direcciones, predios, interpretación predial, muros y relaciones 3D) |
| **CAT-10** | Coberturas y Usos de Suelo | **79.747** | `landuse=*`, `natural=*`, `leisure=*`, complejos de suelo | Zonificación funcional del suelo urbano (residencial, comercial, dotacional, recreativo, biofísico y deportivo) |
| **TOTAL** | **Región Metropolitana Completa** | **1.552.144** | **Geofabrik (Extracto RM 5 archivos) + Overpass QL** | **Base regional completa sin recortes (695.412 edificaciones y 326.545 de transporte) con superposición semántica** |

### 4.1. Doble Flujo de Adquisición y Diferenciación Estricta de Fuentes
El Atlas distingue formalmente dos metodologías de adquisición desacopladas:
1. **`Geofabrik (Extracto RM)`**: Descarga y procesamiento de los 5 archivos del dump regional (1.552.144 entidades clasificadas con superposición semántica, 695.412 edificaciones completas con interpretación predial, 326.545 elementos de transporte, 128.891 de movilidad activa y 79.747 coberturas de suelo en las 52 comunas de la RM). Latencia 0 ms, Bbox AABB precomputado por entidad y almacenamiento en GeoPackage con índices R-Tree nativos.
2. **`OpenStreetMap (API Overpass)`**: Consultas bajo demanda en tiempo real a los servidores de Overpass QL (balanceado en 4 espejos) en la ventana territorial activa.
Ambas fuentes se presentan de forma independiente en fichas, leyendas y popups (dorado para Geofabrik, azul para Overpass API) y **no se mezclan**, salvo en superposiciones analíticas expresas como `GBIF + OSM`.

### 4.2. Modalidades Duales de Consulta Espacial
El Módulo 01 del Atlas ofrece dos opciones pedagógicas:
- **`🗺️ Modo 1: Bbox Dinámico del Mapa`**: Al navegar, hacer zoom o arrastrar el visor en cualquier comuna de la RM, el Bbox se sincroniza en tiempo real y permite consultar instantáneamente los elementos en pantalla.
- **`📌 Modo 2: Coordenadas Numéricas Manuales`**: Permite a investigadores, estudiantes o funcionarios ingresar coordenadas exactas `[Oeste, Sur, Este, Norte]` en WGS 84, o cargar directamente el encuadre macro de toda la Región Metropolitana o el caso piloto Barrio Brasil.

---

## 5. Capas oficiales del Estado de Chile integradas (108 capas oficiales + 10 VGI = 118 capas)

El visor integra **108 capas cartográficas oficiales de la Administración del Estado de Chile**, amparadas por la **Ley N° 20.285 de Transparencia**, organizadas en la nueva **Consola Técnica GIS (Workbench Profesional)** con buscador dinámico, filtros por categoría y macro-grupos temáticos:

1. 📜 **Normativa Urbanística & Catastro Predial (MINVU / PRC Santiago / PRMS / DPA / SII) [13 capas]:** Zonificación comunal PRC Santiago, usos de suelo PRMS, áreas de riesgo comunales e intercomunales, fajas de resguardo, límites urbanos oficiales, DPA SUBDERE 2023, predios Santiago y Catastro Predial SII RM (1.43M predios).
2. 🚲 **Movilidad, Red Vial, Tránsito & Cruces Semaforizados (MTT / UOCT / MOP / EFE / Metro) [7 capas]:** Cruces semaforizados centralizados UOCT/MTT (3.242 intersecciones), Red Vial Nacional GEOMOP, líneas y estaciones de Metro, Red Ferroviaria EFE, ciclovías oficiales, red de interconexión y electrolineras RM.
3. 👥 **Demografía, Censo 2024, Comunidades & Vulnerabilidad Social (INE / MDSF / MINVU) [19 capas]:** Microdatos multiescalares Censo 2024 en 5 niveles territoriales independientes (Regional, Límites Urbanos, Localidades, Zonal y 1.711 Manzanas Censales de la Comuna de Santiago / Barrio Brasil con 216 variables oficiales del INE), Campamentos 2024 MINVU, Unidades Vecinales Oficiales 2026 (Ley N° 19.418), Municipios, Centros SERNAM, SCAM, OPD, IGVUST 2026 y 7 indicadores sociodemográficos del Registro Social de Hogares (RSH / CSE).
4. 📈 **Economía, Fomento, Empleo & Inversión Pública (BIP / MOP / ODEPA / CNE / SUBTEL) [15 capas]:** **Iniciativas de Inversión del Banco Integrado de Proyectos (BIP - bbdd_65)**, Proyectos Mandatados MOP (bbdd_01), Contratos Concesionados (bbdd_04), Contratos MOP (bbdd_05), Personas en RSH ocupadas y cotizando (bbdd_74), Mercados Mayoristas ODEPA (bbdd_54), Antenas Ley de Torres (bbdd_35) e Infraestructura Energética RM (centrales solares, hidroeléctricas, termoeléctricas, bioenergía, almacenamiento, gasoductos, oleoductos y líneas de transmisión).
5. 🏛️ **Equipamiento Público, Educación, Salud & Patrimonio (CMN / MINEDUC / MINSAL / IND / CCU) [28 capas]:** Inmuebles y Zonas de Conservación Histórica (ZCH/ICH), Sitios de Memoria CMN, Jardines Infantiles (JUNJI e Integra), Colegios escolares, Educación Superior, Centros de Salud (CESFAM y Hospitales DEIS), Infraestructura Deportiva, Atractivos Turísticos SERNATUR, Áreas Funcionales, Cités, Oficinas Serviu y SEREMI MINVU, junto a las 12 series históricas CCU (1993 a 2024).
6. 🌳 **Medio Ambiente, Recursos Hídricos, Parques & Espacio Público (MMA / DGA / CONAF / DMC / ODEPA / INFOR) [21 capas]:** Áreas Verdes Normativas IPT (18.173 polígonos), Parques Urbanos, SNASPE CONAF, Sitios Prioritarios de Biodiversidad, Humedales Protegidos (Ley 21.202), Red Hidrométrica DGA, Cuencas BNA, Estaciones Sedimentométricas, Calidad de Aguas, Fluviometría, Canales de Riego CNR, Viveros, Biomasa Forestal, Huertos Frutales ODEPA, Industria Forestal INFOR, Estaciones Meteorológicas DMC y FIA, Zonas Climáticas Köppen, Calidad del Aire SINCA y Vertederos Ilegales.
7. 🛡️ **Seguridad, Bomberos & Justicia (Carabineros / CBS / SENAPRED / MINJU) [5 capas]:** Cuarteles de Bomberos de Chile, Compañías de Bomberos RM, Comisarías de Carabineros, Unidades del Plan Cuadrante y Juzgados de Familia.

---

## 6. Base de Datos Espacial en la Nube (PostgreSQL 17.6 + PostGIS 3.3 en Supabase)

El Atlas cuenta con un clúster espacial en la nube **PostgreSQL 17.6 con extensión PostGIS 3.3**, 100% libre, gratuito y permanente:

- **129.262 Entidades Vectoriales Vectorizadas:** Almacenadas en la tabla relacional `public.capas_entidades`, optimizando más de 630 MB de archivos GeoJSON de texto a 210 MB binarios con geometrías validadas.
- **Catálogo de Metadatos Relacional:** Tabla `public.capas_metadata` con los 108 registros oficiales, citas APA 7ª ed., instituciones de procedencia y conteos de entidades.
- **Índices Espaciales R-Tree GIST:** Consultas espaciales ultrarrápidas mediante la función RPC `fn_obtener_capa_bbox`, permitiendo al visor Leaflet consultar únicamente las geometrías contenidas en el Bbox activo en milisegundos.
- **Storage CDN (`atlas-geojson`):** Bucket público de alta disponibilidad para descarga directa de coberturas completas.
- **Arquitectura con Fallback de Triple Contingencia:** Si falla la conexión a internet o no se han configurado credenciales, el visor conmuta de forma transparente al directorio local `data/`.
- **Mantenimiento Keep-Alive Permanente a Costo $0:** El workflow [`.github/workflows/supabase_keepalive.yml`](.github/workflows/supabase_keepalive.yml) ejecuta un ping de telemetría cada 3 días desde GitHub Actions, asegurando que la base de datos nunca se suspenda por inactividad.

---

## 7. Módulos y características
 
| Módulo | Descripción |
|---|---|
| **00: Visor Cartográfico 2D** | Leaflet 1.9.4 + OpenStreetMap; activación interactiva de 118 capas (10 VGI + 108 oficiales), popups con atributos, cita APA y zoom automático. |
| **00: Consola Técnica GIS** | Workbench profesional con buscador predictivo (`#busqueda-capas-atlas`), chips de filtro temático, switches interactivos, badges de telemetría y descarga directa de GeoJSONs oficiales sin simplificar. |
| **00: CIN-VGI (Inspector Normativo)** | Inspector territorial por clic: cruce Point-in-Polygon con zonificación PRC Santiago, exclusión negativa de usos (Art. 2.1.24 OGUC), riesgos (Art. 2.1.17 OGUC), patrimonio ICH/ZCH (Art. 60 LGUC / Ley 17.288) y descarga de certificado técnico referencial (Art. 116 LGUC). |
| **01: Consultas Espaciales & Overpass** | Consultas interactivas en vivo con Overpass QL (3 espejos balanceados), telemetría global en Taginfo API v4 e inspección por Bbox de la base regional Geofabrik RM (1.55M entidades). |
| **02: Evaluador Universal de Calidad IGV** | Motor algorítmico universal de control de calidad espacial basado en ISO 19157 / ISO 19115 / WLC (Malczewski 1999): audita capas internas, archivos subidos o texto GeoJSON, genera semáforo en mapa Leaflet, certificado JSON, descarga de archivo reparado (Auto-Fix) y plan de subsanación técnica para QGIS, PostGIS y GeoPandas. |
| **02: Métricas Históricas & OQT (ohsome)** | ohsome API v1/v2 (HeiGIT): series temporales P1Y, evolución de contribuyentes, densidad espacial métrica (EPSG:32719) y auditoría de integridad de changesets con OSMCha. |
| **03: Biodiversidad Urbana (GBIF)** | Ocurrencias biológicas de ciencia ciudadana con autocompletado taxonómico (Species API) y banderas de consistencia Darwin Core. |
| **04: Cartografía Temática (UMap)** | Embebido de proyectos cartográficos colaborativos de organizaciones vecinales y descarga directa de capas comunitarias. |
| **05: Metadatos ISO 19115 / ISO 19139** | Fichas técnicas normalizadas exportables a JSON (ISO 19115) y XML interoperable (ISO 19139 / Perfil Nacional IDE Chile SNIT). |
| **06: Diccionario Territorial de Brechas** | Catálogo sistemático de 134 descriptores territoriales contrastando 48 capas oficiales del Estado vs 86 brechas microespaciales VGI. |
| **07: Catálogos Excel y Licencias** | Libros OpenXML (.xlsx) de 4 hojas con las 118 capas, matriz de metacalidad, catálogo de fuentes y marco jurídico copyleft (ODbL 1.0, CC-BY 4.0, GPL v3). |
| **08: Manual de Uso Operativo** | Guía de operación metodológica paso a paso integrada en la interfaz. |
| **09: Indicadores & Storyboards** | 5 dimensiones analíticas (Sociodemográfica, Socioeconómica, Socioambiental, Sociosanitaria, Sociourbana) y narrativas de datos sobre Barrio Brasil (entregable exploratorio). |

### 7.1. Módulo 09: Indicadores de Análisis Multidimensional y Storyboards de Barrio Brasil (Marco Tentativo)

El Módulo 09 articula las 118 capas del Atlas en **5 dimensiones analíticas estratégicas** con **paridad estricta y literal de nombres respecto al Módulo 00 (Visor y Atlas VGI)**:
1. **Sociodemográfica (19 capas):** Censo 2024 multiescalar (5 niveles INE: Regional, Límites Urbanos, Localidades, Zonas/Distritos y Manzanas), vulnerabilidad social (IGVUST), RSH completo (NNA, mujeres, adultos mayores, jóvenes, hombres según CSE), campamentos MINVU y Unidades Vecinales Ley 19.418.
2. **Socioeconómica (18 capas):** Iniciativas de inversión BIP MDSF (`bbdd_65`), contratos y proyectos MOP (`bbdd_01`, `bbdd_04`, `bbdd_05`), ocupación formal RSH (`bbdd_74`), Servicios y Comercio Barrial OSM (`CAT-02`), Antenas Ley de Torres (`bbdd_35`), INFOR, ODEPA y matriz energética regional CNE (9 capas).
3. **Socioambiental (23 capas):** Áreas Verdes Normativas IPT (18.173 polígonos MINVU), Áreas Verdes y Espacio Público (`CAT-05`), Biodiversidad Urbana GBIF/iNaturalist (`CAT-08`), Coberturas de Suelo (`CAT-10`), Red Hidrométrica DGA (`bbdd_03`), Monitoreo de Calidad del Aire SINCA MMA (`bbdd_39`), Pisos Vegetacionales e Inventario de Biomasa RM.
4. **Sociosanitaria (3 capas):** Salud Pública DEIS/MINSAL (`establecimientos_salud`: CESFAM y Hospitales), personas en RSH en situación de dependencia funcional (`bbdd_67`) y Territorios de Servicios de Salud (`bbdd_38`).
5. **Sociourbana o Habitabilidad (55 capas):** Zonificación PRC Santiago, PRMS regional, Catastro Predial del SII (1.43M predios fiscales), Edificaciones e interpretación predial OSM (`CAT-09`), Cruces Semaforizados Conectados UOCT RM (3.242 intersecciones), Metro L1-L2-L5, Red Ferroviaria EFE, Ciclovías MTT (`bbdd_31`), Movilidad Activa (`CAT-04`), Accesibilidad Universal (`CAT-07`), Patrimonio IPT e Inmuebles ZCH (`minvu_patrimonio`), Sitios de Memoria CMN, equipamiento educativo y series CCU 1993-2024.

**Funcionalidades Técnicas del Módulo:**
- **Acordeones Dinámicos con Buscador Predictivo:** Despliegue fluido de capas por dimensión con buscador en vivo (`🔍`) y segmentación rápida (`Todas`, `Oficiales Estado`, `VGI Comunitario`), conmutando capas directamente en el mapa Leaflet.
- **Storyboards con Profundización Analítica Cuantitativa:** Cada relato barrial cuenta con lámina inmersiva tipo blog que integra matrices de KPIs, barras de progreso porcentual comparativo, gráficos de distribución y diagramas conceptuales vectoriales interactivos SVG (Rasante OGUC, Ciclo Semafórico UOCT, Gradiente Térmico de Isla de Calor, Isócronas de Flujo Estudiantil UAH y Red Integrada de Cuidados Sociosanitarios).

> [!NOTE]
> **Carácter Tentativo y Exploratorio:**
> Los *Storyboards* (historias territoriales fundamentadas en los datos del Atlas) y la parametrización de las dimensiones representan herramientas pedagógicas y de divulgación en desarrollo preliminar para el Proyecto Fondecyt Regular F1261256 (Geografía UAH). Están concebidas para ser refinadas colaborativamente con actores territoriales, preservando intacta la rigurosidad de las especificaciones ISO 19115 y el marco normativo del proyecto.

---

## 8. Estructura del repositorio

```
atlas_vgi_uah/
├── src/
│   ├── index.html                      # Aplicación principal SPA (no requiere build)
│   ├── css/estilos.css                 # Paleta institucional de alto contraste (WCAG AAA)
│   ├── js/
│   │   ├── app.js                      # Controlador principal y enrutador de eventos
│   │   ├── config.js                   # Configuración centralizada y credenciales
│   │   └── modulos/
│   │       ├── mapa.js                 # Visor 2D Leaflet y control de capas
│   │       ├── db_client.js            # Cliente PostGIS RPC y Supabase Storage CDN
│   │       ├── ide_chile.js            # Catálogo oficial de 108 capas del Estado (UOCT/MTT incluido)
│   │       ├── evaluador_normativo.js  # Motor CIN-VGI / PRC Santiago / OGUC
│   │       ├── evaluador_calidad_cuantitativa.js # Motor Algorítmico Universal IGV (ISO 19157 / ISO 19115)
│   │       ├── ohsome.js               # Métricas calidad VGI (ohsome API dual v1/v2)
│   │       ├── calidad_analyst.js      # ICV e inspector changesets OSMCha
│   │       ├── importador_capas.js     # Importador multi-formato (KMZ/KML/GeoJSON/GPX/CSV)
│   │       ├── taginfo.js              # Validador planetario Taginfo API
│   │       ├── gbif.js                 # Biodiversidad urbana y Darwin Core
│   │       ├── indicadores_analisis.js # Módulo 09: 5 dimensiones y storyboards exploratorios
│   │       ├── geodesia.js             # Reproyección Snyder EPSG:32719 UTM 19S
│   │       └── metadatos.js            # Generador ISO 19115 (JSON) e ISO 19139 (XML)
│   ├── data/                           # 108 capas GeoJSON oficiales + 10 VGI (118 capas totales)
│   ├── config/config.json              # Configuración JSON sincronizada
│   └── docs/                           # Catálogos Excel (.xlsx) de acceso público
├── backend/servidor_vgi.py             # Servidor proxy Flask opcional para CORS
├── netlify/functions/                  # Endpoints serverless ligeros para Netlify
├── netlify.toml                        # Configuración de despliegue y headers de seguridad
├── scripts/
│   ├── db/
│   │   ├── 01_schema_postgis.sql       # Esquema DDL PostGIS, tablas, índices GIST y RPC
│   │   └── 02_seed_metadata.sql        # Inserción de metadatos de las 108 capas oficiales
│   ├── subir_base_datos_supabase.py    # Pipeline CLI de sincronización y subida CDN
│   ├── cargar_entidades_postgis.py     # Ingesta masiva de 129.262 entidades en PostGIS
│   ├── generar_catalogos_excel.py      # Generador de matrices Excel (.xlsx) con openpyxl
│   └── extractor_vgi.py                # Extractor automatizado Overpass QL
├── docs/
│   ├── ARQUITECTURA.md                 # Especificación técnica del sistema y diagramas
│   ├── BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md # Compendio de 125 fuentes APA (Corpus Científico + Atlas)
│   ├── GUIA_BASE_DATOS_SUPABASE.md     # Manual de aprovisionamiento PostGIS en la nube
│   ├── TRAZABILIDAD_ACADEMICA.md       # Memoria metodológica y epistemológica (Fondecyt)
│   ├── catalogo_fuentes_vgi.xlsx       # Matriz analítica de fuentes colaborativas
│   ├── categorias_tematicas_osm.xlsx   # Matriz de categorías, descriptores y 125 citas APA
│   └── perfil_metadatos_vgi.xlsx       # Estructura ISO 19115 nacional
├── MANUAL_USO.md                       # Manual operativo para los 4 perfiles territoriales
├── PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md # Protocolo de integridad cartográfica y CI/CD
└── .github/workflows/
    ├── deploy.yml                      # Despliegue continuo
    └── supabase_keepalive.yml          # Ping automático cada 3 días anti-pausa
```

---

## 9. Arranque rápido y Pipeline CLI

```bash
# 1. Clonar el repositorio
git clone https://github.com/GEOJOTA/atlas_vgi_uah.git
cd atlas_vgi_uah

# Opción A: Abrir directamente en el navegador (cliente estático puro)
open src/index.html

# Opción B: Servidor local simple
python3 -m http.server 8080 --directory src
# → http://localhost:8080

# 2. Pipeline CLI de Procesamiento y Base de Datos (Python 3):
# Auditoría de integridad de capas GeoJSON:
python3 scripts/subir_base_datos_supabase.py --dry-run

# Sincronización con Supabase Storage CDN:
export SUPABASE_URL="https://[TU-PROYECTO].supabase.co"
export SUPABASE_KEY="TU_SERVICE_ROLE_KEY"
python3 scripts/subir_base_datos_supabase.py --upload-storage

# Regeneración de catálogos Excel:
python3 scripts/generar_catalogos_excel.py
```

---

## 10. Fuentes de datos y licencias

| Fuente | Licencia | Rol en el Atlas |
|---|---|---|
| **OpenStreetMap** | ODbL 1.0 (© colaboradores OSM) | Capas VGI temáticas (CAT-01 a CAT-10) |
| **GBIF / iNaturalist** | CC-BY 4.0 / CC0 | Biodiversidad urbana y ciencia ciudadana (CAT-08) |
| **MINVU GeoIDE** | Datos Públicos del Estado (Ley 20.285) | IPT PRC Santiago, PRMS, parques urbanos, campamentos |
| **IDE Chile / SUBDERE** | Datos Públicos del Estado | DPA, sedes municipales, juzgados de familia |
| **INE Censo 2024** | Datos Públicos del Estado | Microdatos censales de población y vivienda a nivel de manzana |
| **MOP / GEOMOP / DGA** | Datos Públicos del Estado | Red vial, obras concesionadas, estaciones hidrométricas y cuencas |
| **CMN** | Datos Públicos del Estado | Monumentos Históricos, Zonas Típicas y Sitios de Memoria |
| **MDSF (BiDat)** | Datos Públicos del Estado | Unidades Vecinales Oficiales e indicadores del Registro Social de Hogares |
| **DIFROL** | Datos Públicos del Estado | Pasos fronterizos internacionales y faja de seguridad |
| **CNE** | Datos Públicos del Estado | Infraestructura de transmisión y subestaciones eléctricas |

---

## 11. Auditoría de MetaCalidad de la Base de Datos (ISO 19115 / ISO 19157 / IDE Chile)

La base de datos espacial completa del Atlas (**118 capas**: 108 oficiales del Estado de Chile + 10 macro-categorías comunitarias VGI de OpenStreetMap y GBIF) cuenta con una auditoría programática de **MetaCalidad** (calidad integral de metadatos espaciales) evaluada mediante `scripts/analisis_metacalidad.py`:

| Dimensión de MetaCalidad | Estándar Aplicado | Ponderación | Puntaje Promedio | Calificación Cualitativa |
| :--- | :--- | :---: | :---: | :---: |
| **Completitud de Metadatos (MC)** | ISO 19115-1 Core / Perfil IDE Chile SNIT | 30% | **89.92%** | 🟢 Excelente |
| **Conformidad Normativa (CC)** | ISO 19139 / ISO 19110 | 20% | **97.88%** | 🟢 Excelente |
| **Linaje y Trazabilidad (LL)** | Ley 20.285 / ODbL 1.0 / CC-BY 4.0 | 25% | **100.00%** | 🟢 Excelente |
| **Resolución y Granularidad (RG)** | Snyder 1987 / EPSG:32719 | 15% | **100.00%** | 🟢 Excelente |
| **Accesibilidad e Integridad (AI)** | Almacenamiento Local / CDN Edge | 10% | **100.00%** | 🟢 Excelente |
| **ÍNDICE GLOBAL DE METACALIDAD (IGMC)** | **ISO 19157:2013 / 2023** | **100%** | **96.55%** | **🟢 Grado A+ (Excelente)** |

- **Distribución de Calidad:** 98 capas en **Grado A+ (Excelente)** (83.1%) y 20 capas en **Grado A (Muy Bueno)** (16.9%), con 0% de capas deficientes.
- **Documentación Completa:** Consulta la [Matriz Exhaustiva de MetaCalidad (docs/ANALISIS_METACALIDAD.md)](docs/ANALISIS_METACALIDAD.md), el dataset estructurado [docs/matriz_metacalidad.json](docs/matriz_metacalidad.json) y el libro Excel [docs/perfil_metadatos_vgi.xlsx](docs/perfil_metadatos_vgi.xlsx).

---

## 12. Cómo Contribuir al Atlas (Guía Simple y Trazabilidad Ciudadana)

Cualquier persona u organización (vecinos, dirigentas/es, colectivos barriales, estudiantes, ONGs) puede aportar información al Atlas de forma simple:

- **1. Mapeo Directo en OpenStreetMap:** Utiliza el editor web [iD en openstreetmap.org](https://www.openstreetmap.org/) para registrar o actualizar almacenes, cruces accesibles, veredas o árboles en Barrio Brasil. Al guardar, usa el hashtag `#AtlasVGI_UAH` para asegurar su trazabilidad comunitaria.
- **2. Reporte o Propuesta de Nuevas Capas:** Abre un [Issue en GitHub](https://github.com/GEOJOTA/atlas_vgi_uah/issues) con el nombre de la capa, fuente, ubicación y organización responsable.
- **3. Carga Local en el Visor:** Arrastra archivos `.GeoJSON`, `.KML` o `.CSV` al [Visor Web](https://atlasvgiuah.netlify.app/) para cruzar tus datos territoriales en tiempo real de forma privada y sin costo.
- **4. Desarrollo y Datos (Fork & PR):** Consulta nuestra [Guía de Contribución Abierta, Trazabilidad y Arquitectura (CONTRIBUTING.md)](CONTRIBUTING.md) para detalles completos de desarrollo *zero-build* en Vanilla JS, CSS puro, scripts Python (openpyxl/ETL), clúster PostGIS 3.3, esquemas normalizados de 14 atributos y la tríada de licencias abiertas (AGPLv3, ODbL 1.0, CC BY-SA 4.0).

---

## 13. Cita académica y marco de investigación

```bibtex
@misc{MF2026atlas,
  author       = {Fuenzalida, Manuel},
  title        = {Atlas de Información Geográfica Voluntaria para la Gestión Territorial: Caso Piloto Barrio Brasil},
  year         = {2026},
  howpublished = {Departamento de Geografía, Universidad Alberto Hurtado},
  address      = {Santiago, Chile},
  url          = {https://github.com/GEOJOTA/atlas_vgi_uah}
}
```

_Desarrollado en el marco del Proyecto Fondecyt Regular sobre VGI y Gobernanza Territorial — Investigador Responsable: Dr. Manuel Fuenzalida (Universidad Alberto Hurtado)._

---

*Atlas VGI Barrio Brasil — Nodo GeoAbierto. Plataforma optimizada con PostgreSQL 17 + PostGIS 3.3. Septiembre 2026.*
