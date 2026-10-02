# Informe de Auditoría de MetaCalidad (Calidad de Metadatos Espaciales)
### Atlas de Información Geográfica Voluntaria para la Gestión Territorial — Nodo GeoAbierto UAH
**Fecha de Evaluación:** 01 de octubre de 2026 | **Marco Normativo:** ISO 19115-1:2014, ISO 19157:2013/2023, ISO 19139:2007, IDE Chile/SNIT v2.0

---

## 1. Resumen Ejecutivo y Dictamen de Calidad

Se realizó una auditoría universal programática de **MetaCalidad** (calidad intrínseca y extrínseca de los metadatos geoespaciales) sobre el **100% de la base de datos cartográfica** del proyecto, compuesta por **118 capas** (108 capas oficiales del Estado de Chile y 10 macro-categorías comunitarias VGI de OpenStreetMap y GBIF), abarcando un volumen vectorial verificado de **1332.66 MB**.

> **DICTAMEN GLOBAL DE METACALIDAD:** El repositorio cartográfico alcanza un **Índice Global de MetaCalidad (IGMC) de 96.5%**, clasificando formalmente en la categoría **A+ (A+ (Excelente))** conforme a la norma **ISO 19157**. La totalidad de los conjuntos de datos cuenta con trazabilidad jurídica inequívoca, identificación institucional o comunitaria, archivo vectorial físico no redundante y cita bibliográfica estandarizada según normas APA 7ª edición.

### Indicadores Clave de Desempeño (KPIs de MetaCalidad)

| Dimensión de Calidad | Estándar Referencial | Ponderación | Puntaje Promedio | Calificación Cualitativa |
| :--- | :--- | :---: | :---: | :---: |
| **1. Completitud de Metadatos (MC)** | ISO 19115-1 Core / Perfil IDE Chile | 30% | **89.9%** | 🟢 Excelente |
| **2. Conformidad Normativa (CC)** | ISO 19139 / ISO 19110 | 20% | **97.9%** | 🟢 Excelente |
| **3. Linaje y Trazabilidad (LL)** | Ley 20.285 / ODbL 1.0 / CC-BY 4.0 | 25% | **100.0%** | 🟢 Excelente |
| **4. Resolución y Granularidad (RG)** | Snyder 1987 / EPSG:32719 | 15% | **100.0%** | 🟢 Excelente |
| **5. Accesibilidad e Integridad (AI)** | W3C Data on the Web / Netlify Edge | 10% | **100.0%** | 🟢 Excelente |
| **ÍNDICE GLOBAL (IGMC)** | **ISO 19157:2013 / 2023** | **100%** | **96.5%** | **🟢 Grado A+ (Excelente)** |

### Distribución de Grados de Calidad en la Base de Datos

- **Grado A+ (Excelente):** `████████████████░░░░` **98 capas** (83.1%)
- **Grado A (Muy Bueno):** `███░░░░░░░░░░░░░░░░░` **20 capas** (16.9%)
- **Grado B (Aceptable):** `░░░░░░░░░░░░░░░░░░░░` **0 capas** (0.0%)
- **Grado C (Deficiente):** `░░░░░░░░░░░░░░░░░░░░` **0 capas** (0.0%)

---

## 2. Marco Metodológico y Estándares Aplicados

El análisis de MetaCalidad evalúa el grado en que los metadatos cartográficos describen de manera rigurosa, completa y reproducible el recurso geográfico subyacente. Se aplican las directrices de los siguientes marcos internacionales y nacionales:

1. **ISO 19115-1:2014 (Información Geográfica — Metadatos):** Define la estructura lógica para describir información geográfica digital. El Atlas VGI implementa los 10 elementos núcleo obligatorios del Perfil Nacional de Metadatos de Chile (IDE Chile / SNIT v2.0): identificador único, título, resumen temático, custodio u organización responsable, extensión geográfica (Bbox), fecha de referencia temporal, tópico temático ISO, sistema de referencia de coordenadas (CRS), restricciones legales/licencia y linaje.
2. **ISO 19157:2013 & ISO 19157-1:2023 (Calidad de la Información Geográfica):** Establece los principios para evaluar y reportar la calidad de los datos y metadatos geoespaciales mediante medidas de completitud, consistencia lógica y exactitud temporal.
3. **ISO 19139:2007 (Implementación de Esquema XML):** Garantiza que las fichas generadas en el Módulo 05 puedan ser exportadas e importadas directamente en catálogos interoperables como GeoNetwork, GeoNode o el Catálogo Nacional de Metadatos de IDE Chile.
4. **ISO 19110:2016 (Metodología de Catalogación de Objetos Geográficos):** Rige el Diccionario Territorial de 134 descriptores y atributos del sistema.
5. **Marco Legal y Licenciamiento Abierto:**
   - **Estado de Chile (108 capas):** Publicadas bajo la **Ley N° 20.285 sobre Acceso a la Información Pública** (Transparencia Activa / Solicitudes formales como el Oficio N° 26105/2026 de UOCT y convenios con MINVU, DGA, INE, MDSF).
   - **OpenStreetMap (9 macrocategorías):** Gobernadas por la **Open Database License (ODbL) 1.0** (Open Data Commons) con reciprocidad copyleft y atribución obligatoria.
   - **GBIF (1 macrocategoría de biodiversidad):** Distribuida bajo **Creative Commons Atribución (CC-BY 4.0 / CC0 1.0 Universal)** según el estándar Darwin Core.

### Fórmula Matemática del Índice Global de MetaCalidad (IGMC)

$$\text{IGMC}_i = 0.30 \cdot \text{MC}_i + 0.20 \cdot \text{CC}_i + 0.25 \cdot \text{LL}_i + 0.15 \cdot \text{RG}_i + 0.10 \cdot \text{AI}_i$$

Donde:

- $\text{MC}_i$: Completitud de metadatos núcleo ($0$ a $100\%$).

- $\text{CC}_i$: Conformidad normativa y consistencia de esquema ($0$ a $100\%$).

- $\text{LL}_i$: Linaje, trazabilidad jurídica y cita bibliográfica APA ($0$ a $100\%$).

- $\text{RG}_i$: Resolución territorial y doble CRS documentado ($0$ a $100\%$).

- $\text{AI}_i$: Accesibilidad física e integridad binaria del archivo ($0$ a $100\%$).


---

## 3. Desempeño por Grupo Temático en el Atlas

| Grupo Temático | Total Capas | Volumen Total (MB) | IGMC Promedio | Estado de Conformidad |
| :--- | :---: | :---: | :---: | :---: |
| **Economia Inversion** | 15 | 203.67 MB | **97.0%** | 🟢 Conforme ISO 19115 |
| **Equipamiento Patrimonio** | 28 | 58.51 MB | **95.6%** | 🟢 Conforme ISO 19115 |
| **Medio Ambiente** | 21 | 101.04 MB | **97.4%** | 🟢 Conforme ISO 19115 |
| **Movilidad Transporte** | 7 | 66.88 MB | **97.4%** | 🟢 Conforme ISO 19115 |
| **Normativa Ipt** | 13 | 207.00 MB | **96.8%** | 🟢 Conforme ISO 19115 |
| **Seguridad Justicia** | 5 | 0.93 MB | **97.0%** | 🟢 Conforme ISO 19115 |
| **Social Demografia** | 19 | 689.44 MB | **97.2%** | 🟢 Conforme ISO 19115 |
| **Vgi Comunitario** | 10 | 5.19 MB | **94.4%** | 🟢 Conforme ISO 19115 |

---

## 4. Matriz Exhaustiva de MetaCalidad — Auditoría de las 118 Capas Cartográficas

A continuación se presenta el desglose universal de las **118 capas** evaluadas sin omitir ningún conjunto de datos:

| N° | ID Capa | Nombre Oficial / Temático | Tipo Fuente | Institución Custodia | MC (%) | CC (%) | LL (%) | RG (%) | AI (%) | IGMC (%) | Grado |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | `censo2024_regional` | Censo 2024 (Marco Regional RM) | Oficial | Instituto Nacional de Estadístic... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 2 | `censo2024_limite_urbano` | Censo 2024 (Límites Urbanos Censales RM) | Oficial | Instituto Nacional de Estadístic... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 3 | `censo2024_localidades` | Censo 2024 (Localidades y Asentamientos RM... | Oficial | Instituto Nacional de Estadístic... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 4 | `censo2024_zonal` | Censo 2024 (Zonas y Distritos Censales RM) | Oficial | Instituto Nacional de Estadístic... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 5 | `censo2024_manzanas` | Censo 2024 (Manzanas Censales RM) | Oficial | Instituto Nacional de Estadístic... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 6 | `minvu_patrimonio` | Patrimonio IPT: Inmuebles y Zonas de Conse... | Oficial | Ministerio de Vivienda y Urbanis... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 7 | `educacion_parvularia` | Jardines y Salas Cuna (JUNJI / Integra) | Oficial | JUNJI / Fundación Integra / MINE... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 8 | `establecimientos_salud` | Salud Pública (CESFAM y Hospitales) | Oficial | Ministerio de Salud (MINSAL) / D... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 9 | `bomberos` | Cuarteles de Bomberos de Chile | Oficial | Junta Nacional de Cuerpos de Bom... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 10 | `carabineros` | Comisarías y Cuarteles Policiales | Oficial | Carabineros de Chile / IDE Chile | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 11 | `estaciones_metro` | Estaciones de Metro de Santiago | Oficial | DTPM / Metro S.A. / IDE Chile / ... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 12 | `red_ferroviaria` | Red Ferroviaria EFE (MTT) | Oficial | Empresa de los Ferrocarriles del... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 13 | `cmn_sitios_memoria` | Sitios de Memoria y Monumentos CMN | Oficial | Consejo de Monumentos Nacionales... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 14 | `minvu_ipt_prc_santiago` | Planes Reguladores Comunales (PRC - RM): Z... | Oficial | MINVU / Municipios de la Región ... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 15 | `minvu_ipt_prms_usosuelo` | Plan Regulador Metropolitano (PRMS): Usos ... | Oficial | MINVU / SEREMI Metropolitana de ... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 16 | `minvu_ipt_areas_verdes` | Áreas Verdes Normativas (MINVU / INE 2023) | Oficial | Ministerio de Vivienda y Urbanis... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 17 | `minvu_ipt_areas_riesgo` | Áreas de Riesgo Normativas (IPT) | Oficial | MINVU / DDU / SEREMI RM | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 18 | `minvu_ipt_resguardo_infraestructura` | Fajas de Resguardo e Infraestructura PRMS | Oficial | MINVU / SEREMI Metropolitana | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 19 | `minvu_ipt_limite_urbano` | Límite Urbano Oficial PRC (MINVU) | Oficial | MINVU / DDU / I. Municipalidad d... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 20 | `ide_minvu_campamentos` | Catastro Campamentos 2024 (MINVU) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 21 | `ide_minvu_ipt_prms_riesgo` | PRMS: Riesgos Metropolitanos (Inundación /... | Oficial | MINVU / SEREMI Metropolitana | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 22 | `ide_subdere_dpa_comunas` | División Político-Administrativa (SUBDERE ... | Oficial | Subsecretaría de Desarrollo Regi... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 23 | `bbdd_01` | Proyectos Mandatados - GEOMOP | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 24 | `bbdd_02` | Red Vial Nacional - GEOMOP | Oficial | Estado de Chile / IDE Chile / ge... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 25 | `bbdd_03` | Red Hidrométrica - GEOMOP | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 26 | `bbdd_04` | Contratos Concesionados - GEOMOP | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 27 | `bbdd_05` | Contratos MOP - GEOMOP | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 28 | `bbdd_06` | Jardines Infantiles JUNJI | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 29 | `bbdd_07` | Infraestructura Deportiva | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 30 | `bbdd_08` | Municipios | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 31 | `bbdd_10` | Jardines Infantiles Fundación Integra | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 32 | `bbdd_11` | Cuerpos de Bomberos | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 33 | `bbdd_12` | Establecimientos Educación Escolar | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 34 | `bbdd_13` | Establecimientos Educación Parvularia | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 35 | `bbdd_14` | Establecimientos de Educación Superior | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 36 | `bbdd_15` | Centros de SERNAM | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 37 | `bbdd_17` | Áreas Funcionales de las ciudades (2026) | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 38 | `bbdd_18` | Zonificación Termica | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 39 | `bbdd_19` | Cité | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 40 | `bbdd_20` | SEREMI MINVU Región Metropolitana | Oficial | SEREMI Metropolitana de Vivienda... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 41 | `bbdd_21` | Oficinas Serviu | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 42 | `energia_almacenamiento_rm` | Sistemas de Almacenamiento de Energía RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 43 | `energia_bioenergia_rm` | Centrales de Bioenergía RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 44 | `energia_electrolineras_rm` | Red de Electrolineras RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 45 | `energia_gasoducto_rm` | Red de Gasoductos RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 46 | `energia_hidroelectricas_rm` | Centrales Hidroeléctricas RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 47 | `energia_lineas_transmision_rm` | Líneas de Transmisión Eléctrica RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 48 | `energia_oleoducto_rm` | Red de Oleoductos RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 49 | `energia_solares_rm` | Plantas Solares Fotovoltaicas RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 50 | `energia_termoelectricas_rm` | Centrales Termoeléctricas RM | Oficial | Ministerio de Energía / IDE Ener... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 51 | `bbdd_23` | Sitios BIO-Prioritarios | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 52 | `bbdd_24` | Juzgados de Familia | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 53 | `bbdd_25` | Estaciones Meteorológicas | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 54 | `bbdd_26` | Estaciones Sedimentométricas | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 55 | `bbdd_27` | Estaciones de Calidad de Aguas | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 56 | `bbdd_29` | Cuencas Banco Nacional de Aguas | Oficial | Estado de Chile / IDE Chile / ge... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 57 | `bbdd_30` | Indice Calidad de Aguas | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 58 | `bbdd_31` | Ciclovías | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 59 | `bbdd_32` | Vertederos Ilegales | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 60 | `bbdd_33` | Plan Cuadrante Carabineros | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 61 | `bbdd_34` | Zonas climáticas de Chile según Köppen-Gei... | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 62 | `bbdd_35` | Antenas en Servicio Ley de Torres | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 63 | `bbdd_37` | Red de Interconexión | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 64 | `bbdd_38` | Territorios de los Servicios de Salud | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 65 | `bbdd_39` | Estaciones de monitoreo de calidad de aire... | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 66 | `bbdd_40` | Circuitos Turísticos | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 67 | `ccu_rm_1993` | Continuo de Construcciones Urbanas (1993) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 68 | `ccu_rm_2002` | Continuo de Construcciones Urbanas (2002) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 69 | `ccu_rm_2006` | Continuo de Construcciones Urbanas (2006) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 70 | `ccu_rm_2011` | Continuo de Construcciones Urbanas (2011) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 71 | `ccu_rm_2017` | Continuo de Construcciones Urbanas (2017) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 72 | `ccu_rm_2018` | Continuo de Construcciones Urbanas (2018) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 73 | `ccu_rm_2019` | Continuo de Construcciones Urbanas (2019) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 74 | `ccu_rm_2020` | Continuo de Construcciones Urbanas (2020) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 75 | `ccu_rm_2021` | Continuo de Construcciones Urbanas (2021) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 76 | `ccu_rm_2022` | Continuo de Construcciones Urbanas (2022) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 77 | `ccu_rm_2023` | Continuo de Construcciones Urbanas (2023) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 78 | `ccu_rm_2024` | Continuo de Construcciones Urbanas (2024) | Oficial | Ministerio de Vivienda y Urbanis... | 80% | 100% | 100% | 100% | 100% | **94.0%** | 🔵 A |
| 79 | `bbdd_42` | Pisos vegetacionales de Luebert y Pliscoff... | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 80 | `bbdd_43` | División Política Administrativa 2023 | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 81 | `bbdd_44` | Municipios con certificación ambiental (SC... | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 82 | `bbdd_46` | Predios Urbanos (Comuna de Santiago) | Oficial | Servicio de Impuestos Internos (... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 83 | `bbdd_47` | Zona Fronteriza | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 84 | `bbdd_48` | Pasos Fronterizos | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 85 | `bbdd_49` | Estaciones Fluviométricas | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 86 | `bbdd_50` | Oficinas de Protección de Derechos (ODP) | Oficial | Estado de Chile / IDE Chile / ge... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 87 | `bbdd_51` | Localización de viveros en Chile continent... | Oficial | Estado de Chile / IDE Chile / id... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 88 | `bbdd_52` | Estaciones Meteorológicas Automáticas (FIA... | Oficial | Estado de Chile / IDE Chile / id... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 89 | `bbdd_53` | Industria Forestal Primeria (INFOR) | Oficial | Estado de Chile / IDE Chile / id... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 90 | `bbdd_54` | Mercados Mayoristas (ODEPA) | Oficial | Estado de Chile / IDE Chile / id... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 91 | `bbdd_55` | Sistema Nacional de Áreas Silvestres Prote... | Oficial | Estado de Chile / IDE Chile / id... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 92 | `bbdd_59` | Cobertura de canales a nivel nacional | Oficial | Estado de Chile / IDE Chile / id... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 93 | `bbdd_60` | Catastro y Actualización de los Recursos V... | Oficial | Estado de Chile / IDE Chile / id... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 94 | `bbdd_62` | Cobertura de polígonos representativos de ... | Oficial | Estado de Chile / IDE Chile / ic... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 95 | `bbdd_63` | Inventario de Biomasa y Carbono - Metropol... | Oficial | Estado de Chile / IDE Chile / si... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 96 | `bbdd_64` | Índice Global de Vulnerabilidad Socioterri... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 97 | `bbdd_65` | Iniciativas de inversión del Banco Integra... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 98 | `bbdd_66` | Unidades Vecinales 2026 | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 99 | `bbdd_67` | Personas en RSH en situación de dependenci... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 100 | `bbdd_68` | Personas en RSH según CSE y sexo - 2026 Ag... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 101 | `bbdd_69` | NNA en RSH adscritas a Fonasa o Isapre seg... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 102 | `bbdd_70` | Mujeres en RSH adscritas a Fonasa o Isapre... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 103 | `bbdd_71` | Jóvenes en RSH adscritos a Fonasa o Isapre... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 104 | `bbdd_72` | Hombres en RSH adscritos a Fonasa o Isapre... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 105 | `bbdd_73` | Personas mayores en RSH adscritos a Fonasa... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 106 | `bbdd_74` | Personas en RSH ocupadas y cotizando, por ... | Oficial | Estado de Chile / IDE Chile / bi... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 107 | `semaforos_rm_uoct_2026` | Cruces Semaforizados Conectados SC-RM (UOC... | Oficial | Unidad Operativa de Control de T... | 90% | 100% | 100% | 100% | 100% | **97.0%** | 🟢 A+ |
| 108 | `catastro_predial_sii` | Catastro Predial del Servicio de Impuestos... | Oficial | Servicio de Impuestos Internos (... | 100% | 100% | 100% | 100% | 100% | **100.0%** | 🟢 A+ |
| 109 | `educacion` | Educación y Universidad | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 110 | `servicios` | Servicios y Comercio Barrial | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 111 | `transporte` | Movilidad y Transporte | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 112 | `movilidad_activa` | Movilidad Activa y Ciclovías | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 113 | `espacio_publico` | Áreas Verdes y Espacio Público | VGI | Comunidad OpenStreetMap (© Colab... | 90% | 75% | 100% | 100% | 100% | **92.0%** | 🔵 A |
| 114 | `patrimonio` | Patrimonio y Cultura | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 115 | `accesibilidad` | Accesibilidad Universal | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 116 | `biodiversidad` | Biodiversidad Urbana | VGI | Global Biodiversity Information ... | 90% | 75% | 100% | 100% | 100% | **92.0%** | 🔵 A |
| 117 | `edificaciones` | Edificaciones y Huella Urbana | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |
| 118 | `cobertura_suelo` | Coberturas y Usos de Suelo | VGI | Comunidad OpenStreetMap (© Colab... | 100% | 75% | 100% | 100% | 100% | **95.0%** | 🟢 A+ |

---

## 5. Hallazgos Clave y Conclusiones del Diagnóstico

1. **Cero Punteros Huérfanos o Datos Inaccesibles:** Todas las 118 capas cuentan con archivos binarios GeoJSON íntegros en el almacenamiento local y CDN (`src/data/` y `data/`), asegurando una disponibilidad operativa inmediata del 100% (costo de infraestructura $0).

2. **Separación Jurídica Inequívoca:** Tras la normalización de trazabilidad, ninguna entidad de OpenStreetMap o GBIF hereda la Ley de Transparencia del Estado de Chile, garantizando el respeto de los derechos de autor comunitarios bajo la licencia ODbL 1.0 y CC-BY 4.0 respectivamente.

3. **Interoperabilidad Total con IDE Chile:** Todas las capas del Estado contienen URLs de servicios oficiales activos (ArcGIS FeatureServer, WMS OGC o GeoPackage INE), nombres de ministerios, tipología geométrica y citas normalizadas APA 7ª edición.

4. **Doble Sistema Geodésico Documentado:** Cada ficha de metadatos reconoce explícitamente el sistema angular WGS84 (EPSG:4326) para visualización web y el sistema métrico proyectado conforme SIRGAS-Chile / UTM Huso 19 Sur (EPSG:32719 / EPSG:5361) para el cálculo de distancias y superficies geodésicas mediante el algoritmo de Snyder (1987).

5. **Exportabilidad ISO 19139:** La estructura de metadatos auditada es 100% compatible con el generador de fichas XML del Módulo 05, permitiendo alimentar automáticamente nodos institucionales GeoNode o catálogos del Estado.
