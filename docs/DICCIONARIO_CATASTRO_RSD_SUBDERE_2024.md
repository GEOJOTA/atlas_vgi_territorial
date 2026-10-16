# Catastro Nacional de Residuos Sólidos Domiciliarios (RSD 2024) — Región Metropolitana
## Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE)
### Programa Nacional de Residuos Sólidos · Síntesis Nacional y Catastro RSD 2024

Este documento presenta la catalogación completa, especificación técnica, diccionario de atributos y directrices de interoperabilidad de las **13 capas espaciales oficiales** del Catastro Nacional de Residuos Sólidos Domiciliarios (RSD 2024), publicado por la Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) del Ministerio del Interior y Seguridad Pública, integradas en la base de datos del **Atlas VGI (Barrio Brasil / Universidad Alberto Hurtado)**.

---

## 🧭 Índice de Contenidos

1. [Ficha Institucional y Metadatos Generales](#1-ficha-institucional-y-metadatos-generales)
2. [Soporte Técnico de GeoPackage y Conservación de Comentarios](#2-soporte-técnico-de-geopackage-y-conservación-de-comentarios)
3. [Catálogo de las 13 Capas Oficiales Integradas](#3-catálogo-de-las-13-capas-oficiales-integradas)
4. [Síntesis Metodológica y Fórmulas Clave (SUBDERE 2024)](#4-síntesis-metodológica-y-fórmulas-clave-subdere-2024)
5. [Diccionario Maestro de Columnas y Variables (126 Descriptores)](#5-diccionario-maestro-de-columnas-y-variables-126-descriptores)
6. [Instrucciones de Carga y Acceso a Datos](#6-instrucciones-de-carga-y-acceso-a-datos)
7. [Cita Bibliográfica Sugerida (Norma APA 7ª Edición)](#7-cita-bibliográfica-sugerida-norma-apa-7ª-edición)

---

## 1. Ficha Institucional y Metadatos Generales

| Parámetro | Detalle Institucional |
| :--- | :--- |
| **Entidad Custodia** | Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) |
| **Ministerio** | Ministerio del Interior y Seguridad Pública, Gobierno de Chile |
| **Programa Responsable** | Programa Nacional de Residuos Sólidos |
| **Fecha de Publicación** | Marzo de 2024 |
| **Período de Referencia** | 2022 - 2024 (Datos operativos, presupuestarios SINIM y proyecciones censales) |
| **Ámbito Territorial** | Región Metropolitana de Santiago (13) — 52 municipios y comunas |
| **Marco Normativo** | Ley N° 20.285 sobre Acceso a la Información Pública; DFL 1/2006 de Interior (LOC Municipalidades); Ley N° 20.920 (Ley REP); D.S. N° 189/2005 (MINSAL, Reglamento Rellenos Sanitarios) |
| **Repositorio Oficial de Origen** | [Portal Proactiva SUBDERE](https://proactiva.subdere.gov.cl/handle/123456789/635) |
| **Documento Técnico de Síntesis** | [Síntesis Nacional Catastro RSD 2024 (PDF, 42 páginas)](https://proactiva.subdere.gov.cl/bitstream/handle/123456789/635/Sintesis%20Nacional_Diagn%c3%b3stico%20y%20Catastro%20Nacional%20de%20RSD%20Marzo_2024.pdf?sequence=1&isAllowed=y) |
| **Formatos Almacenados** | OGC GeoPackage (`.gpkg`) con comentarios nativos en `gpkg_data_columns` y GeoJSON (`.geojson`) WGS84 para visor web |
| **Sistema de Referencia (CRS)** | WGS 84 (EPSG:4326) con metadatos proyectados para cálculo métrico en UTM Huso 19 Sur (EPSG:32719) |

---
## 2. Soporte Técnico de GeoPackage y Conservación de Comentarios

Un requerimiento técnico fundamental para este conjunto de datos radica en la **preservación de los comentarios y alias de columnas**. En los estándares geoespaciales:

1. **Limitación de GeoJSON:** El formato GeoJSON nativo almacena pares clave-valor dentro de `properties`, pero no contempla una sección estándar de esquema o comentarios descriptivos por columna en cada entidad.
2. **Implementación en GeoPackage (OGC GPKG):** Para garantizar que ningún usuario pierda las definiciones de las variables, cada archivo `.gpkg` contiene registradas las tablas del sistema OGC `gpkg_data_columns` y `gpkg_extensions`. En esta tabla se almacena para cada columna:
   - `table_name`: Nombre de la capa.
   - `column_name`: Código de campo de la tabla (ej. `PTA`, `Ppc_corr`, `Aseo_año`, `CRITICIDAD`).
   - `name`: Título normalizado para el usuario.
   - `title`: Título legible en español.
   - `description`: Definición detallada, fórmula de cálculo y unidad de medida.
3. **Visualización en QGIS y ArcGIS Pro:** Al abrir los archivos `.gpkg` en software SIG como QGIS o ArcGIS Pro, el usuario puede ver los alias y descripciones de cada campo pasando el cursor sobre las columnas o revisando las propiedades de la capa en la pestaña *Formularios de Atributos* o *Campos*.
4. **Respaldo en GeoJSON:** Para la visualización web liviana en el navegador, los archivos `.geojson` incluyen una clave raíz `metadata.meta_diccionario_columnas` con las mismas definiciones, y el visor Leaflet del Atlas las formatea dinámicamente en los popups.

---
## 3. Catálogo de las 13 Capas Oficiales Integradas

| N° | Identificador de Capa | Nombre Oficial | Geometría | Registros | Columnas | Archivo GeoPackage |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 01 | `subdere_rsd_analisis_costos_comuna_rm` | **SUBDERE RSD 2024 - Análisis de Costos Comunales de Aseo (RM)** | Polígonos Comunales | 73 | 23 | `Analisis_Costos_Comuna_RM.gpkg` |
| 02 | `subdere_rsd_poblacion_atendida_pta_puntos_rm` | **SUBDERE RSD 2024 - Población Comunal y Total Atendida PTA (Centroides RM)** | Puntos (Centroides Comunales) | 52 | 27 | `Poblacion_Comunal_Atendida_PTA_p_RM.gpkg` |
| 03 | `subdere_rsd_poblacion_comunal_pta_poligonos_rm` | **SUBDERE RSD 2024 - Población Comunal y Total Atendida PTA (Polígonos RM)** | Polígonos Comunales | 73 | 29 | `Poblacion_Comunal_PTA_RM.gpkg` |
| 04 | `subdere_rsd_ciudades_poblacion_rm` | **SUBDERE RSD 2024 - Ciudades y Entidades Pobladas Urbanas (RM)** | Polígonos Urbanos | 81 | 13 | `Ciudades_Pb_Pol_RM.gpkg` |
| 05 | `subdere_rsd_criticidad_sitios_disposicion_rm` | **SUBDERE RSD 2024 - Criticidad de Sitios de Disposición Final (RM)** | Puntos (Rellenos Sanitarios) | 4 | 33 | `Criticidad_Sitios_Disposicion_RSD_Ene24_RM.gpkg` |
| 06 | `subdere_rsd_distancia_municipio_sdf_rm` | **SUBDERE RSD 2024 - Distancias de Transporte Municipio a SDF (RM)** | Líneas de Transporte | 52 | 6 | `Distancia_Municipio_SDF_RM.gpkg` |
| 07 | `subdere_rsd_gastos_ingresos_sinim_rm` | **SUBDERE RSD 2024 - Finanzas Municipales, Aseo e Ingresos SINIM (RM)** | Polígonos Comunales | 100 | 32 | `Gastos_Ingresos_SINIM_RM.gpkg` |
| 08 | `subdere_rsd_recoleccion_transporte_operativo_rm` | **SUBDERE RSD 2024 - Condiciones Operativas de Recolección y Transporte (RM)** | Polígonos Comunales | 73 | 18 | `Recoleccion_Transporte_RM.gpkg` |
| 09 | `subdere_rsd_ppc_generacion_pta_rm` | **SUBDERE RSD 2024 - Generación de Residuos y Producción Per Cápita (RM)** | Polígonos Comunales | 73 | 16 | `RSD_PPC_PTA_RM.gpkg` |
| 10 | `subdere_rsd_sdf_comunas_destino_rm` | **SUBDERE RSD 2024 - Asignación Comunal a Sitios de Disposición Final (RM)** | Polígonos Comunales | 73 | 21 | `SDF_Comunas_RM.gpkg` |
| 11 | `subdere_rsd_sdf_municipios_puntos_rm` | **SUBDERE RSD 2024 - Municipios y Destino de Disposición Final (Puntos RM)** | Puntos (Municipios) | 52 | 20 | `SDF_Municipios_RM.gpkg` |
| 12 | `subdere_rsd_sitios_disposicion_instalaciones_rm` | **SUBDERE RSD 2024 - Infraestructura de Sitios de Disposición Final (RM)** | Puntos (Instalaciones) | 4 | 27 | `Sitios_Disposicion_RSD_Ene24_RM.gpkg` |
| 13 | `subdere_rsd_sitios_intermedios_transferencia_rm` | **SUBDERE RSD 2024 - Estaciones de Transferencia y Sitios Intermedios (RM)** | Puntos (Estaciones de Transferencia) | 1 | 20 | `Sitios_Intermedios_Disposicion_RSD_Ene24_RM.gpkg` |

---
## 4. Síntesis Metodológica y Fórmulas Clave (SUBDERE 2024)

El Catastro de Residuos Sólidos Domiciliarios de SUBDERE utiliza una batería de indicadores normalizados para caracterizar el servicio de aseo y disposición final a nivel comunal y metropolitano:

### 4.1 Población Atendida (PTA, PCA y PFP)
- **Población Comunal Atendida (PCA):** Población residente comunal que cuenta efectivamente con servicio de recolección de basura domiciliaria.
  $$PCA = (Población\_Urbana \times \%\_Cobertura\_Urbana) + (Población\_Rural \times \%\_Cobertura\_Rural)$$
- **Población Flotante Turística (PFP):** Número estimado de personas equivalentes al año generadas por pernoctaciones y turismo, según registros oficiales de SERNATUR.
- **Población Total Atendida (PTA):** Base demográfica real sobre la que se calculan las tasas de generación y requerimientos sanitarios:
  $$PTA = PCA + PFP$$

### 4.2 Tasas de Generación Per Cápita (Ppc y Ppc_corr)
- **Producción Per Cápita Residente ($Ppc$):** Generación de residuos considerando exclusivamente la población residente comunal atendida ($PCA$):
  $$Ppc = \frac{RSDyA\_Ton \times 1000}{PCA \times 365} \quad [\text{kg/hab} \cdot \text{día}]$$
- **Producción Per Cápita Corregida ($Ppc\_corr$):** Generación considerando la población total atendida incluida la población flotante ($PTA$):
  $$Ppc\_corr = \frac{RSDyA\_Ton \times 1000}{PTA \times 365} \quad [\text{kg/hab} \cdot \text{día}]$$
  *Nota:* Esta corrección es crítica en comunas centrales como Santiago (Barrio Brasil / Centro Histórico) o Providencia, donde la alta población flotante puede distorsionar artificialmente la tasa per cápita si se divide solo por los habitantes censados.

### 4.3 Costos del Servicio de Aseo Comunal
- **Costo Total de Aseo Anual ($Aseo\_año$):** Suma de los contratos devengados de recolección y transporte ($RT\_año$) más la tarifa por disposición final en relleno sanitario ($DF\_año$):
  $$Aseo\_año = RT\_año + DF\_año$$
- **Costo Unitario por Habitante ($Aseo\_Hab$):** Costo total anual dividido por la población comunal atendida:
  $$Aseo\_Hab = \frac{Aseo\_año}{PCA} \quad [\$/\text{hab} \cdot \text{año}]$$
- **Costo Unitario por Tonelada ($Aseo\_Ton$):** Costo total anual dividido por el tonelaje total de residuos gestionados:
  $$Aseo\_Ton = \frac{Aseo\_año}{RSDyA\_Ton} \quad [\$/\text{Ton}]$$

### 4.4 Sitios de Disposición Final en la Región Metropolitana
En la Región Metropolitana operan actualmente 3 grandes rellenos sanitarios autorizados que reciben los residuos de los 52 municipios:
1. **Relleno Sanitario Loma Los Colorados:** Ubicado en Til Til (KDM S.A.), recibe los residuos de la zona norte y centro de la capital.
2. **Relleno Sanitario Santa Marta:** Ubicado en Talagante (Consorcio Santa Marta S.A.), receptor principal de la zona sur y suroriente.
3. **Relleno Sanitario Santiago Poniente:** Ubicado en Maipú (Proactiva / Veolia), atiende comunas de la zona poniente y surponiente.
4. **Estación de Transferencia Quilicura (KDM):** Instalación intermedia de compactación y transbordo ferroviario/carretero hacia Loma Los Colorados.

---
## 5. Diccionario Maestro de Columnas y Variables (126 Descriptores)

A continuación se detallan todas las variables contenidas en las 13 tablas del Catastro RSD SUBDERE 2024, con su denominación, descripción, unidad de medida y organismo de origen:

| Campo Original | Título Descriptivo | Definición Técnica | Unidad de Medida | Fuente Oficial |
| :--- | :--- | :--- | :--- | :--- |
| `Aseo\_Hab` | **Costo Anual de Aseo por Habitante** | Gasto municipal anual en aseo dividido por el número de habitantes residentes (Aseo_año / Pobl_INE). | $ CLP / hab · año | SUBDERE / SINIM |
| `Aseo\_SINIM` | **Gasto en Aseo Reportado al SINIM** | Gasto devengado en el ítem de aseo, recolección de basura y vertederos según balances presupuestarios del SINIM. | $ CLP / año | SINIM |
| `Aseo\_Ton` | **Costo de Aseo por Tonelada de Residuos** | Costo unitario global por cada tonelada de residuo gestionada (Aseo_año / RSDyA). | $ CLP / Ton | SUBDERE / SINIM |
| `Aseo\_ao` | **Gasto Anual Total en Servicios de Aseo** | Gasto total devengado anual del municipio por concepto de recolección, transporte y disposición final de residuos. | $ CLP / año | SINIM / Contratos Municipales |
| `Aseo\_año` | **Gasto Anual Total en Servicios de Aseo** | Gasto total devengado anual del municipio por concepto de recolección, transporte y disposición final de residuos. | $ CLP / año | SINIM / Contratos Municipales |
| `AutSanitar` | **Resolución de Autorización Sanitaria** | Resolución Sanitaria emitida por la Secretaría Regional Ministerial (SEREMI) de Salud que autoriza la operación de la instalación bajo D.S. N° 189/2008. | Resolución Sanitaria | SEREMI Salud / MINSAL |
| `CAP\_PROV` | **Capital Provincial** | Condición de capital provincial de la entidad urbana ('SI' / 'NO'). | Texto | SUBDERE / DPA |
| `CATEGORIA` | **Categoría Censal de Entidad** | Clasificación censal de la entidad urbana o rural (Ciudad, Pueblo, Aldea). | Texto | INE |
| `COD\_COM` | **Código Numérico de Comuna** | Identificador numérico entero de la comuna. | Entero | SUBDERE / INE |
| `COD\_P` | **Código Numérico de Provincia** | Identificador numérico entero de la provincia. | Entero | SUBDERE / INE |
| `COD\_R` | **Código Numérico de Región** | Identificador numérico entero de la región político-administrativa (13 para la Región Metropolitana). | Entero | SUBDERE / INE |
| `COMUNA` | **Nombre de la Comuna** | Denominación oficial de la comuna del territorio evaluado. | Texto | DPA / SUBDERE |
| `COMUNA\_QUE\_DISPONE` | **Comuna Generadora que Envía Residuos** | Nombre de la comuna que traslada y descarga sus residuos en la instalación de disposición final. | Texto | SUBDERE |
| `CUT\_COM` | **Código Único Territorial de la Comuna** | Código oficial de la comuna según la DPA del Estado de Chile (ej: '13101' para Santiago, '13110' para La Florida). | Código DPA | SUBDERE / DPA |
| `CUT\_PROV` | **Código Único Territorial de la Provincia** | Código oficial de la provincia según la DPA del Estado de Chile (ej: '131' para la Provincia de Santiago). | Código DPA | SUBDERE / DPA |
| `CUT\_REG` | **Código Único Territorial de la Región** | Código oficial de la región según la División Político-Administrativa (DPA) del Estado de Chile (ej: '13' para la Región Metropolitana). | Código DPA | SUBDERE / DPA |
| `Cierre` | **Año Proyectado de Cierre** | Año estimado de agotamiento de capacidad y término de la fase operativa del sitio. | Año | SUBDERE |
| `Clase` | **Clasificación Sanitaria y Operativa del Sitio** | Tipo de instalación de disposición final según D.S. N° 189/2008 MINSAL ('Relleno Sanitario', 'Relleno Manual', 'Vertedero', 'Basural', 'Estación de Transferencia'). | Texto | SUBDERE / MINSAL |
| `CobRural` | **Cobertura Rural de Recolección** | Porcentaje de cobertura del servicio de recolección en asentamientos rurales. | % | Encuesta SUBDERE / Municipios |
| `CobUrbana` | **Cobertura Urbana de Recolección** | Porcentaje de cobertura del servicio municipal o concesionado de recolección en el área urbana. | % | Encuesta SUBDERE / Municipios |
| `Cob\_Rur` | **Cobertura de Aseo en Zona Rural** | Porcentaje de la población rural que dispone de servicio de recolección domiciliaria o en puntos de acopio. | % | Encuesta SUBDERE / Municipios |
| `Cob\_Urb` | **Cobertura de Aseo en Zona Urbana** | Porcentaje de la población urbana que cuenta con servicio formal de recolección de residuos sólidos domiciliarios. | % | Encuesta SUBDERE / Municipios |
| `Comuna` | **Nombre de la Comuna** | Denominación oficial de la comuna en capas de trazado y distancias. | Texto | SUBDERE |
| `Costo\_Ton` | **Tarifa por Tonelada Dispuesta** | Precio o tarifa unitaria cobrada por el sitio de disposición final por cada tonelada de RSDyA ingresada. | $ CLP / Ton | SUBDERE |
| `Costo\_a` | **Costo Anual de Disposición Final** | Monto anual pagado por la municipalidad al sitio de disposición por la recepción de sus residuos. | $ CLP / año | SUBDERE |
| `Crit\_PTA` | **Nivel de Criticidad por Población Total Atendida** | Categorización del impacto social según el volumen de población que depende del sitio. | Categoría | SUBDERE |
| `Crit\_VU` | **Nivel de Criticidad por Vida Útil** | Categorización del riesgo de colapso o agotamiento por vida útil ('Crítica' para < 3 años, 'Media', 'Baja'). | Categoría | SUBDERE |
| `Criticidad` | **Calificación Integral de Criticidad del Sitio** | Evaluación final de criticidad técnica, sanitaria y operativa del sitio de disposición final según el Programa Nacional de Residuos Sólidos de la SUBDERE ('Crítica', 'Alta', 'Media', 'Baja'). | Categoría | SUBDERE |
| `DF\_Hab` | **Costo de Disposición Final por Habitante** | Costo per cápita de la disposición final en relleno sanitario (DF_año / Pobl_INE). | $ CLP / hab · año | SUBDERE |
| `DF\_Ton` | **Costo de Disposición Final por Tonelada** | Tarifa media por tonelada dispuesta en el relleno sanitario (DF_año / RSDyA). | $ CLP / Ton | SUBDERE |
| `DF\_ao` | **Costo Anual de Disposición Final** | Gasto anual devengado por el pago de tarifas de ingreso y disposición final en el relleno sanitario o vertedero. | $ CLP / año | Chile Proveedores / SINIM |
| `DF\_año` | **Costo Anual de Disposición Final** | Gasto anual devengado por el pago de tarifas de ingreso y disposición final en el relleno sanitario o vertedero. | $ CLP / año | Chile Proveedores / SINIM |
| `DerAseo` | **Recaudación Total por Derechos de Aseo** | Ingresos percibidos por concepto de tarifas de aseo domiciliario cobradas a los vecinos y actividades comerciales. | $ CLP / año | SINIM |
| `Deraseo\_Dir` | **Recaudación por Derechos de Aseo de Cobro Directo** | Cobros de tarifas de aseo facturados y recaudados directamente por el municipio a usuarios exentos de contribuciones. | $ CLP / año | SINIM |
| `DistSDF` | **Distancia Estimada al Sitio de Disposición Final** | Distancia media de transporte desde el centro de gravedad comunal hasta el relleno sanitario o vertedero receptor. | Kilómetros (km) | SUBDERE / Geoproceso |
| `Dist\_SDF` | **Distancia de Transporte al Sitio de Disposición Final** | Distancia efectiva en kilómetros desde el municipio o centro urbano hasta la báscula de entrada del sitio receptor. | Kilómetros (km) | SUBDERE / Geoproceso |
| `ENTIDAD` | **Entidad Poblada** | Nombre de la ciudad, asentamiento o localidad poblada reconocida por el INE. | Texto | INE |
| `ESTE` | **Coordenada Este UTM** | Coordenada geográfica proyectada en metros en el eje X (UTM WGS84 Huso 19 Sur). | Metros | SUBDERE |
| `Estado` | **Estado Operativo del Sitio** | Situación operativa formal ('Operativo', 'En Cierre', 'Paralizado', 'Cerrado'). | Texto | SUBDERE |
| `FrecRural` | **Frecuencia Semanal de Recolección Rural** | Número de días a la semana en que se efectúa la recolección en localidades y caminos rurales. | Días / semana | Encuesta SUBDERE |
| `FrecUrbana` | **Frecuencia Semanal de Recolección Urbana** | Número de días a la semana en que el camión recolector pasa por las calles del área urbana (ej: 3 días/semana, 6 días/semana, diario). | Días / semana | Encuesta SUBDERE |
| `Fuente` | **Fuente de Origen del Dato de Generación** | Plataforma o registro de procedencia del reporte de residuos (ej: 'Encuesta SUBDERE', 'RETC - Ventanilla Única MMA'). | Texto | SUBDERE |
| `Gastos\_Mu` | **Gastos Municipales Totales Devengados** | Presupuesto anual total ejecutado y devengado por la municipalidad según el SINIM. | $ CLP / año | SINIM / SUBDERE |
| `IPP` | **Ingresos Propios Permanentes (IPP)** | Ingresos generados por la propia gestión municipal (derechos de aseo, patentes comerciales, permisos de circulación, multas). | $ CLP / año | SINIM |
| `ImpT` | **Recaudación de Aseo vía Impuesto Territorial (TGR)** | Recaudación de derechos de aseo canalizada a través de las cuotas del Impuesto Territorial (Contribuciones) recaudadas por la Tesorería General de la República. | $ CLP / año | TGR / SINIM |
| `IngTran` | **Ingresos por Transferencias del Estado** | Transferencias corrientes y de capital recibidas desde el Gobierno Central, SUBDERE o Gobierno Regional. | $ CLP / año | SINIM |
| `Ing\_FCM` | **Ingresos por Fondo Común Municipal (FCM)** | Aporte financiero recibido por la municipalidad proveniente del mecanismo redistributivo del Fondo Común Municipal. | $ CLP / año | SINIM / SUBDERE |
| `Ingre\_Mu` | **Ingresos Municipales Totales Percibidos** | Total de recursos financieros percibidos por la municipalidad durante el ejercicio anual. | $ CLP / año | SINIM |
| `Ini\_Oper` | **Año de Inicio de Operaciones** | Año formal en que la instalación comenzó la recepción de residuos sólidos domiciliarios. | Año | SUBDERE / SEREMI Salud |
| `InvRExt` | **Inversión Financiada con Recursos Externos** | Monto de inversión municipal financiado mediante fondos externos (FNDR, PMU, PMB, Ministerios). | $ CLP / año | SINIM |
| `InvRP` | **Inversión Financiada con Recursos Propios** | Monto de inversión ejecutado con recursos propios de la municipalidad. | $ CLP / año | SINIM |
| `Inversion` | **Inversión Municipal Total** | Gasto municipal devengado en proyectos de inversión real e iniciativas de infraestructura. | $ CLP / año | SINIM |
| `Km` | **Distancia Lineal en Kilómetros** | Longitud métrica de la ruta de transporte hacia el sitio de disposición final. | Kilómetros (km) | SUBDERE |
| `ModRecoleccion` | **Modalidad Vehicular de Recolección** | Tipología de vehículos predominante en las rutas de recolección (Camión compactador de carga trasera/lateral, Camión tolva, Caja ampliroll). | Texto | Encuesta SUBDERE |
| `NComun` | **Número de Comunas Atendidas por el Sitio** | Cantidad de municipalidades que envían y disponen sus residuos en esta instalación. | Comunas | SUBDERE |
| `NOMBRE` | **Nombre Oficial del Sitio de Disposición Final** | Nombre del relleno sanitario, vertedero o estación de transferencia (ej: 'Relleno Sanitario Loma Los Colorados', 'Santa Marta', 'Santiago Poniente'). | Texto | SUBDERE / SEREMI Salud |
| `NORTE` | **Coordenada Norte UTM** | Coordenada geográfica proyectada en metros en el eje Y (UTM WGS84 Huso 19 Sur). | Metros | SUBDERE |
| `Operacio` | **Régimen de Operación de la Instalación** | Modelo de administración del sitio de disposición final ('Privada', 'Municipal', 'Mixta'). | Texto | SUBDERE |
| `Operador` | **Empresa u Organismo Operador** | Empresa o consorcio técnico responsable de la operación diaria del relleno o vertedero (ej: KDM Tratamiento, Consorcio Santa Marta, Proactiva/Veolia). | Texto | SUBDERE |
| `OtrosIngr` | **Otros Ingresos Municipales** | Otros recursos y rentas percibidas por el municipio. | $ CLP / año | SINIM |
| `PCA` | **Población Comunal Atendida (PCA)** | Total de población residente con cobertura de servicios de aseo en la comuna (suma de PCA Urbana y PCA Rural). | Habitantes | SUBDERE |
| `PCA\_2022` | **Población Comunal Atendida Año 2022** | Población comunal con cobertura de recolección de aseo registrada en el año base 2022. | Habitantes | SUBDERE |
| `PCA\_PRA` | **Participación de PCA Comunal sobre la Población Regional Atendida** | Porcentaje que representa la población atendida de la comuna sobre el total atendido a nivel de toda la Región Metropolitana. | % | SUBDERE |
| `PCA\_PTA` | **Porcentaje de PCA sobre la PTA** | Proporción que representa la población residente atendida respecto al universo de la Población Total Atendida (%). | % | SUBDERE |
| `PCA\_Pob` | **Porcentaje de Población Atendida sobre Población Total** | Relación porcentual entre la población comunal atendida (PCA) y la población proyectada comunal (Pob_2022). | % | SUBDERE |
| `PCA\_Rur` | **Población Comunal Atendida en Zona Rural (PCA Rural)** | Número de habitantes rurales efectivamente atendidos por el servicio de aseo (Pob_Rur * Cob_Rur). | Habitantes | SUBDERE |
| `PCA\_Urb` | **Población Comunal Atendida en Zona Urbana (PCA Urbana)** | Número de habitantes urbanos efectivamente beneficiarios del servicio de extracción de residuos (Pob_Urb * Cob_Urb). | Habitantes | SUBDERE |
| `PFP` | **Población Flotante Promedio Ponderada** | Población flotante promedio anualizada calculada para ponderar el incremento en la generación de residuos domiciliarios en comunas turísticas o de servicios. | Habitantes promedio | SUBDERE |
| `PFP\_PTA` | **Porcentaje de Población Flotante sobre la PTA** | Proporción que representa la población flotante turística respecto a la Población Total Atendida (%). | % | SUBDERE |
| `PFP\_R` | **Población Flotante Regional** | Población flotante turística acumulada a nivel regional. | Habitantes | SUBDERE |
| `PFT\_2022` | **Población Flotante Turística Año 2022** | Estimación del volumen de población flotante en temporada alta según calificación anual de SERNATUR y bases técnicas del FCM. | Habitantes flotantes | SERNATUR / SINIM / SUBDERE |
| `PPon\_PTA` | **Puntaje Ponderado por Población Atendida** | Puntaje ponderador asignado en función de la magnitud de la Población Total Atendida. | Puntaje | SUBDERE |
| `PRA` | **Población Regional Atendida** | Total de habitantes con cobertura de servicios de aseo a nivel regional. | Habitantes | SUBDERE |
| `PROVINCIA` | **Nombre de la Provincia** | Denominación oficial de la provincia político-administrativa. | Texto | DPA / SUBDERE |
| `PTA` | **Población Total Atendida (PTA)** | Suma de la Población Comunal Atendida residente más la Población Flotante Promedio (PTA = PCA + PFP). Es la variable determinante para calcular la demanda real sobre los sitios de disposición final. | Habitantes totales | SUBDERE |
| `PTA\_22` | **Población Total Atendida Consolidada 2022** | Población total atendida (residente con cobertura + flotante) registrada para el año 2022. | Habitantes | SUBDERE |
| `PTA\_R` | **Población Total Atendida Regional** | Población total atendida en toda la Región Metropolitana (PRA + PFP_R). | Habitantes | SUBDERE |
| `PTAc\_PTAr` | **Participación de PTA Comunal sobre la PTA Regional** | Porcentaje de la Población Total Atendida de la comuna en el contexto regional metropolitano. | % | SUBDERE |
| `P\_Cierre` | **Estado del Plan de Cierre** | Condición administrativa y técnica del Plan de Cierre y Sellado de la instalación ('Aprobado', 'En Trámite', 'Sin Plan'). | Texto | SEREMI Salud / SUBDERE |
| `Po\_InvRP` | **Porcentaje de Inversión con Recursos Propios** | Proporción de la inversión financiada con fondos autónomos del municipio (%). | % | SINIM |
| `Pob\_2022` | **Población Proyectada al Año 2022 (INE)** | Estimación y proyección de población total comunal realizada por el Instituto Nacional de Estadísticas (INE) base Censo 2017 para el año 2022. | Habitantes | INE / SUBDERE |
| `Pob\_Rur` | **Población en Zona Rural** | Habitantes residentes en áreas rurales o asentamientos dispersos de la comuna según el INE. | Habitantes | INE / SUBDERE |
| `Pob\_Urb` | **Población en Zona Urbana** | Habitantes residentes en el área urbana consolidada de la comuna según la delimitación censal del INE. | Habitantes | INE / SUBDERE |
| `Pobl\_INE` | **Población Comunal Oficial INE** | Población comunal de referencia según estadísticas del INE. | Habitantes | INE |
| `PorDAseo` | **Porcentaje de Derechos de Aseo sobre Ingresos Totales** | Participación porcentual de la recaudación de aseo sobre el total de ingresos municipales percibidos. | % | SINIM |
| `PorImpT` | **Porcentaje de Cobro de Aseo vía Impuesto Territorial** | Proporción de la recaudación de aseo que ingresa a través del rol de contribuciones TGR. | % | SINIM |
| `Por\_Aseo` | **Porcentaje del Presupuesto Municipal Destinado a Aseo** | Participación porcentual del gasto en aseo sobre el gasto total municipal devengado (Aseo_SINIM / Gastos_Mu * 100). | % | SINIM / SUBDERE |
| `Por\_CoDir` | **Porcentaje de Cobro Directo de Aseo** | Proporción de la recaudación de aseo que ingresa por cobro directo municipal. | % | SINIM |
| `Por\_RExt` | **Porcentaje de Inversión con Recursos Externos** | Proporción de la cartera de inversiones financiada con fondos sectoriales o regionales externos (%). | % | SINIM |
| `Por\_Trans` | **Porcentaje de Transferencias Fiscales** | Proporción de transferencias del Estado sobre los ingresos totales (%). | % | SINIM |
| `PorcOtros` | **Porcentaje de Otros Ingresos** | Participación de otros ingresos no tributarios sobre el total percibido (%). | % | SINIM |
| `Porc\_FCM` | **Porcentaje de Dependencia del Fondo Común Municipal** | Nivel de dependencia del presupuesto municipal respecto a las transferencias del FCM (Ing_FCM / Ingre_Mu * 100). | % | SINIM |
| `Porc\_IPP` | **Porcentaje de Ingresos Propios Permanentes** | Proporción de autonomía financiera del municipio (IPP / Ingre_Mu * 100). | % | SINIM |
| `Porc\_Inv` | **Porcentaje de Inversión sobre Gasto Municipal** | Porcentaje del presupuesto municipal devengado que se destina a inversión efectiva (Inversion / Gastos_Mu * 100). | % | SINIM |
| `Porc\_Rur` | **Porcentaje de Población Rural** | Proporción porcentual de habitantes rurales respecto a la población total comunal. | % | INE / SUBDERE |
| `Porc\_urb` | **Porcentaje de Población Urbana** | Proporción porcentual de habitantes urbanos respecto a la población total comunal. | % | INE / SUBDERE |
| `Ppc` | **Producción Per Cápita de Residuos (PPC Base PCA)** | Cantidad promedio de residuos sólidos domiciliarios generados diariamente por cada habitante atendido residente (kg/hab*día), calculada como: (RSDyA_Ton * 1000) / (PCA * 365). | kg / hab · día | SUBDERE |
| `Ppc\_Corr` | **Producción Per Cápita Corregida por Población Flotante (PPC Base PTA)** | Generación per cápita diaria calculada sobre la Población Total Atendida (PTA = PCA + PFP), corrigiendo distorsiones en comunas con alta afluencia flotante: (RSDyA_Ton * 1000) / (PTA * 365). | kg / hab · día | SUBDERE |
| `Ppc\_corr` | **Producción Per Cápita Corregida por Población Flotante (PPC Base PTA)** | Generación per cápita diaria calculada sobre la Población Total Atendida (PTA = PCA + PFP), corrigiendo distorsiones en comunas con alta afluencia flotante: (RSDyA_Ton * 1000) / (PTA * 365). | kg / hab · día | SUBDERE |
| `Ppon\_VU` | **Puntaje Ponderado por Vida Útil Remanente** | Puntuación técnica asignada en la metodología SUBDERE según los años de vida útil restantes del sitio. | Puntaje | SUBDERE |
| `Propieta` | **Propietario del Terreno e Instalación** | Persona jurídica o institución dueña del predio donde opera el sitio. | Texto | SUBDERE |
| `RCA` | **Resolución de Calificación Ambiental (RCA)** | Resolución de Calificación Ambiental favorable emitida por el Servicio de Evaluación Ambiental (SEA / COREMA). | RCA | SEA / MMA |
| `REGION` | **Nombre de la Región** | Denominación oficial de la región político-administrativa. | Texto | DPA / SUBDERE |
| `RETC\_ID` | **Identificador Oficial en Registro RETC (MMA)** | Código único del establecimiento asignado por el Registro de Emisiones y Transferencias de Contaminantes del Ministerio del Medio Ambiente. | Código RETC | RETC / MMA |
| `RSD\_Ton` | **Toneladas Anuales de RSDyA Recibidas** | Volumen anual de residuos sólidos domiciliarios y asimilables recepcionados y compactados en el sitio de disposición final. | Toneladas/año | SUBDERE / RETC |
| `RSD\_corr` | **Generación de RSDyA Corregida** | Volumen anual de residuos corregido y conciliado según registros de balanza en sitios de disposición final. | Toneladas/año | SUBDERE |
| `RSDyA` | **Generación Total de Residuos Sólidos Domiciliarios y Asimilables** | Volumen anual de residuos sólidos domiciliarios y asimilables generados en la comuna y dispuestos en sitios autorizados. | Toneladas/año | Encuesta SUBDERE / RETC MMA |
| `RSDyA\_22` | **Generación de RSDyA Año 2022** | Toneladas anuales de residuos domiciliarios y asimilables reportadas por el municipio para el año 2022. | Toneladas/año | SUBDERE / RETC |
| `RT\_Hab` | **Costo de Recolección y Transporte por Habitante** | Costo per cápita del servicio de recolección y transporte (RT_año / Pobl_INE). | $ CLP / hab · año | SUBDERE |
| `RT\_Ton` | **Costo de Recolección y Transporte por Tonelada** | Costo unitario de recolección y transporte por cada tonelada transportada (RT_año / RSDyA). | $ CLP / Ton | SUBDERE |
| `RT\_ao` | **Costo Anual de Recolección y Transporte** | Monto total devengado por el municipio exclusivamente para el contrato u operación de recolección y transporte de basura. | $ CLP / año | Chile Proveedores / SINIM |
| `RT\_año` | **Costo Anual de Recolección y Transporte** | Monto total devengado por el municipio exclusivamente para el contrato u operación de recolección y transporte de basura. | $ CLP / año | Chile Proveedores / SINIM |
| `RTyDF\_Hab` | **Costo Consolidado RT + DF por Habitante** | Gasto total anual por habitante en la gestión completa de sus residuos sólidos domiciliarios. | $ CLP / hab · año | SUBDERE |
| `RTyDF\_Ton` | **Costo Consolidado RT + DF por Tonelada** | Costo total unitario por tonelada gestionada integralmente (recolección, flete y disposición). | $ CLP / Ton | SUBDERE |
| `RTyDF\_ao` | **Costo Anual Consolidado RT + DF** | Suma de los costos anuales de Recolección, Transporte y Disposición Final (RT_año + DF_año). | $ CLP / año | SUBDERE |
| `RTyDF\_año` | **Costo Anual Consolidado RT + DF** | Suma de los costos anuales de Recolección, Transporte y Disposición Final (RT_año + DF_año). | $ CLP / año | SUBDERE |
| `RecDiferenciada` | **Existencia de Recolección Diferenciada / Reciclaje** | Indica si el municipio opera programas formales de recolección segregada de residuos reciclables (papel, cartón, vidrio, plástico, orgánicos) en origen ('SI' / 'NO'). | Texto ('SI' / 'NO') | Encuesta SUBDERE / Ley REP |
| `SITIO` | **Nombre del Sitio de Disposición Final Destinatario** | Nombre de la instalación receptora donde la comuna deposita sus residuos. | Texto | SUBDERE |
| `SistRecoleccion` | **Sistema Operativo de Recolección** | Mecanismo técnico de recolección domiciliaria implementado (Puerta a puerta tradicional, Sistema de contenedores comunitarios, Puntos limpios o Mixto). | Texto | Encuesta SUBDERE |
| `TIPO` | **Tipo de Asentamiento** | Clasificación territorial urbana o rural. | Texto | INE |
| `TipoServicio` | **Modalidad de Administración del Servicio** | Régimen de gestión del servicio de aseo y recolección (Concesión a empresa privada, Administración Municipal directa, Mixto). | Texto | Encuesta SUBDERE / Municipios |
| `Ubicacio` | **Comuna y Sector de Emplazamiento del Sitio** | Comuna o sector geográfico donde se localiza físicamente la instalación de disposición final. | Texto | SUBDERE |
| `Ubicación` | **Comuna y Sector de Emplazamiento del Sitio** | Comuna o sector geográfico donde se localiza físicamente la instalación de disposición final. | Texto | SUBDERE |
| `VU\_PTA` | **Índice Combinado de Criticidad (Vida Útil / Población)** | Índice multivariado que cruza la urgencia de agotamiento con la masa crítica poblacional atendida. | Índice | SUBDERE |
| `VidaUtil` | **Vida Útil Remanente Estimada** | Capacidad volumétrica remanente proyectada en años de operación a contar de enero de 2024. | Años | SUBDERE / SEA |
| `cod\_com2` | **Código Comunal Secundario** | Identificador numérico comunal alternativo homologado en las bases del SINIM. | Entero | SINIM / SUBDERE |

---
## 6. Instrucciones de Carga y Acceso a Datos

### 6.1 Apertura en QGIS
1. Abra QGIS (versión 3.22 o superior).
2. En el panel *Explorador* (Navegador), navegue a la carpeta del Atlas:
   `geodatabase_completa_atlas_vgi/03_capas_oficiales_estado/subdere_rsd_2024_rm/`
3. Arrastre los archivos `.gpkg` al lienzo del proyecto.
4. Para examinar los comentarios oficiales, abra las *Propiedades de la Capa* -> pestaña *Campos*. Verá los nombres y alias descriptivos extraídos de `gpkg_data_columns`.

### 6.2 Carga en Python (Geopandas)
```python
import geopandas as gpd
import sqlite3
import pandas as pd

# 1. Cargar geometrías y atributos
ruta_gpkg = 'data/subdere_rsd_2024_rm/Analisis_Costos_Comuna_RM.gpkg'
gdf = gpd.read_file(ruta_gpkg)
print(gdf.head())

# 2. Leer las descripciones oficiales de columnas desde gpkg_data_columns
conn = sqlite3.connect(ruta_gpkg)
columnas_info = pd.read_sql_query('SELECT column_name, name, title, description FROM gpkg_data_columns', conn)
conn.close()
print(columnas_info)
```

### 6.3 Acceso desde el Visor Interactivo Web del Atlas
En la interfaz del Atlas VGI, abra la consola lateral de capas y seleccione el filtro **Medio Ambiente & Agua** o despliegue el acordeón oficial correspondiente para activar cualquiera de las 13 capas con un solo clic. Al hacer clic sobre cualquier comuna, centroide o relleno sanitario, el popup interactivo desplegará los costos de aseo, tonelajes anuales, producción per cápita y estado del relleno sanitario.

---
## 7. Cita Bibliográfica Sugerida (Norma APA 7ª Edición)

> Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE]. (2024). *Diagnóstico y catastro nacional de residuos sólidos domiciliarios: Síntesis Nacional y Catastro RSD 2024*. Programa Nacional de Residuos Sólidos, Ministerio del Interior y Seguridad Pública, Gobierno de Chile. https://proactiva.subdere.gov.cl/handle/123456789/635
