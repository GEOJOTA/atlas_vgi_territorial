# Manual de Uso Operativo — Atlas de Información Geográfica Voluntaria para la Gestión Territorial en el Barrio Brasil

### Departamento de Geografía — Universidad Alberto Hurtado (2026)
**Caso Piloto:** Barrio Brasil y Entorno Patrimonial UAH (Santiago Centro, Chile)  
**Sistema Geodésico Oficial:** WGS 84 / UTM Huso 19 Sur (EPSG:32719)  
**Estándares Aplicados:** ISO 19115-1:2014, ISO 19139:2007, ISO 19157:2013, OGC WMS/WFS, PostGIS 3.3, IDE Chile (SNIT)

---

## 0. Introducción y Perfiles de Actor Territorial

El **Atlas de Información Geográfica Voluntaria (VGI)** es una plataforma socioespacial desarrollada para diagnosticar, auditar, contrastar y documentar el territorio del Barrio Brasil mediante la integración de **datos ciudadanos abiertos (OpenStreetMap, GBIF, UMap)** con **108 capas cartográficas oficiales del Estado de Chile** (IDE Chile, MINVU, INE Censo 2024 multiescalar, UOCT / MTT Semáforos RM, MOP, CMN, MMA, MDSF BiDat, CNE y CONAF) respaldadas por una base de datos espacial **PostgreSQL 17 + PostGIS 3.3** en la nube (conformando 118 capas totales con las 10 categorías maestras VGI).

En la cabecera de la plataforma encontrarás el selector **"Perfil de Actor Territorial"**, el cual adapta y resalta las herramientas clave según la necesidad operativa del usuario:

1. **🏛️ Perfil Institucional / Autoridades (IDE Chile / Municipio de Santiago / SECPLAN / MINVU):**
   - Prioriza la auditoría de instrumentos de planificación territorial (PRC Santiago, PRMS), zonas de riesgo normativo, microdatos censales a nivel de manzana (Censo 2024) y generación de metadatos estandarizados en formato XML (ISO 19139) para interoperabilidad con el Geoportal de Chile.
2. **👥 Perfil Comunitario / Organizaciones Vecinales y Ciudadanía (JJVV Barrio Brasil, Santa Ana, Capuchinos):**
   - Facilita diagnósticos barriales inmediatos con consultas en 1 clic (farmacias, áreas verdes, paraderos, arbolado viario, ferias libres), mapeo colaborativo barrial en UMap y lectura de fichas sin jerga técnica.
3. **🧭 Perfil Voluntario / Mapeadores OSM y Ciencia Ciudadana:**
   - Enfocado en la formulación de consultas espaciales Overpass QL avanzadas, validación de etiquetas globales con **Taginfo API**, auditoría de cambios territoriales con **OSMCha** y detección de vacíos de microatributos de accesibilidad (`wheelchair`, `tactile_paving`, `kerb`).
4. **🔬 Perfil ONGs / Territoriales y Gestores:**
   - Proporciona cálculo de densidades territoriales rigurosas mediante reproyección conforme a **EPSG:32719**, métricas de calidad temporal con **ohsome (v1/v2)**, exportación a GeoJSON para QGIS/ArcGIS, articulación comunitaria y matrices de metadatos con citas normalizadas en formato APA 7ª ed.

---

## 1. Visor Cartográfico Interactivo 2D (Panel 00)

El visor cartográfico principal permite consultar, superponer e inspeccionar espacialmente el territorio de estudio en tiempo real.

### 1.1 Selección de territorio y encuadre
- **Selector de Territorio:** En la barra superior puedes alternar entre:
  - *Barrio Brasil — Manzana Campus UAH (Santiago Centro)* (predeterminado).
  - *Barrio Brasil Completo (hasta Plaza Brasil)*.
  - *Santiago Centro (Casco Histórico y Cívico)*.
- **Botón "Encuadrar":** Restablece la vista del mapa centrando el área seleccionada y reajustando el zoom óptimo.

### 1.2 Herramienta "📐 Dibujar Bbox" (Área personalizada)
1. Haz clic en el botón **"📐 Dibujar Bbox"** en la barra superior del mapa.
2. Haz clic sobre el mapa en una esquina del área deseada y arrastra el cursor manteniendo presionado hasta la esquina opuesta.
3. Al soltar el ratón, se dibujará el rectángulo delimitador y se actualizarán automáticamente las coordenadas numéricas en todos los módulos de consulta, calidad y metadatos.

### 1.3 Activación de las 10 Categorías Maestras VGI
Debajo del mapa encontrarás la botonera con las 10 categorías territoriales ciudadanas (CAT-01 a CAT-10):
- 🎓 **CAT-01: Educación y Universidad** (Campus patrimonial UAH, facultades, institutos, colegios, liceos y bibliotecas).
- 🏪 **CAT-02: Servicios, Comercio y Salud Barrial** (comercio de proximidad Av. Brasil/Huérfanos, farmacias, CESFAM N° 5, clínicas comunitarias y bancos).
- 🚌 **CAT-03: Movilidad y Transporte Público** (paraderos Red Movilidad, accesos a Metro Los Héroes L1/L2, Santa Ana L2/L5 y Cumming L5).
- 🚲 **CAT-04: Movilidad Activa y Ciclovías** (ciclovías segregadas Rosas y Brasil, ciclobandas, bicicleteros públicos y de la UAH).
- 🌳 **CAT-05: Áreas Verdes, Deporte y Espacio Público** (Plaza Brasil, bandejones arbolados de Alameda, canchas y juegos infantiles).
- 🏛️ **CAT-06: Patrimonio Histórico y Cultura** (Zona Típica Barrio Brasil, Inmuebles de Conservación Histórica ICH, casonas UAH, teatros e iglesias).
- ♿ **CAT-07: Accesibilidad Universal y Caminabilidad** (vados peatonales, rebajes de solera D.S. 50 MINVU, baldosas podotáctiles y cruces semaforizados).
- 🌿 **CAT-08: Biodiversidad Urbana y Arbolado** (arbolado viario de alineación plátano oriental/jacarandá + observaciones científicas y ciudadanas de GBIF).
- 🏢 **CAT-09: Edificaciones y Huella Urbana** (huellas poligonales de manzanas, volumetría construida y cálculo de superficie métrica en m² reprojectada a EPSG:32719).
- 🗺️ **CAT-10: Coberturas y Usos de Suelo** (zonificación funcional del suelo urbano y superficies biofísicas).

**Interacción y Popups:**
- Haz clic en cualquier botón de categoría para consultar en vivo y cargar las geometrías en el mapa con conteo dinámico.
- Haz clic sobre cualquier punto, línea o polígono para abrir la **ficha popup**: muestra nombre, tipología, dirección, accesibilidad, institución, fecha de captura, fuente y cita bibliográfica APA.
- Para ocultar la capa, basta con hacer clic nuevamente en su botón.

### 1.4 Exportación a GeoJSON y Descargas Directas
- Haz clic en **"📥 Exportar GeoJSON"** en la barra superior para descargar todas las capas actualmente activas en el visor, listas para arrastrar y soltar en **QGIS** o **ArcGIS Pro**.
- En el catálogo de capas oficiales, cada tarjeta dispone del botón directo **`📥`** para descargar el GeoJSON oficial completo sin intermediarios.

---

## 2. Consola Técnica GIS y Catálogo Oficial de 108 Capas del Estado de Chile (IDE Chile / BBDD / UOCT MTT)

Ubicada inmediatamente después del visor, la **Consola de Capas GIS** es un entorno de trabajo cartográfico profesional (*GIS-grade workbench*) rediseñado para permitir auditorías territoriales rigurosas, eliminando distracciones visuales o emojis infantiles y garantizando alta legibilidad según estándares WCAG AAA.

### 2.1 Componentes de la Consola Técnica GIS
- **Barra de Telemetría e Indicadores KPI:**
  - `[118 CAPAS TOTALES]`: Universo completo disponible entre cartografía oficial y colaborativa.
  - `[0 EN MAPA]` (dinámico): Contador en tiempo real de capas activamente renderizadas en el lienzo Leaflet.
  - **`📥 Descargar Capas Activas`:** Exporta en un clic un paquete GeoJSON con todas las capas actualmente encendidas.
- **Buscador Predictivo en Tiempo Real (`#busqueda-capas-atlas`):**
  - Permite filtrar instantáneamente cualquiera de las 118 capas escribiendo el nombre, código oficial, institución de procedencia o temática (ej: "semáforos", "censo", "bomberos", "minvu", "uoct").
- **Chips de Filtro Rápido:**
  - Accesos directos temáticos: `Todos`, `Normativa & Catastro`, `Movilidad & Vialidad`, `Censo 2024 & Social`, `Economía & Inversión BIP`, `Equipamiento & Patrimonio`, `Medio Ambiente & Agua`, `Seguridad & Justicia`, `VGI Comunitario OSM`.
- **Pestañas Segmentadas:**
  - **`Capas Oficiales del Estado (108)`**: Despliegue de los 7 macro-grupos institucionales.
  - **`Capas Colaborativas VGI (10)`**: Catálogo de las 10 categorías maestras de OpenStreetMap y GBIF.
  - **`Capas Activas en Mapa (N)`**: Vista concentrada exclusiva de las capas actualmente superpuestas para gestión rápida de visibilidad.
- **Tarjetas Cartográficas Estilizadas (`.tarjeta-capa-gis`):**
  - Cada tarjeta presenta un interruptor toggle deslizante, el código institucional oficial, un pill de tipo geométrico (`PUNTO`, `LÍNEA`, `POLÍGONO`), un pill de organismo responsable (`UOCT / MTT`, `MINVU`, `INE`, etc.), descripción concisa y el botón directo de descarga sin simplificaciones **`GeoJSON`**.

### 2.2 Los 7 Macro-Grupos Oficiales (108 Capas)
1. 📜 **Normativa Urbanística & Catastro Predial (MINVU / PRC Santiago / PRMS / DPA / SII) [13 capas]:**
   - Zonificación comunal PRC Santiago (192 polígonos zonales), Usos de Suelo PRMS, Áreas de Riesgo IPT, Zonas de Riesgo Intercomunal PRMS, Fajas de Resguardo de Infraestructura, Límites Urbanos Oficiales, DPA SUBDERE 2023, Catastro Predial SII RM (1.43M predios) y Fajas Fronterizas DIFROL.
2. 🚲 **Movilidad, Red Vial, Tránsito & Cruces Semaforizados (MTT / UOCT / MOP / EFE / Metro) [7 capas]:**
   - **Cruces Semaforizados Centralizados UOCT RM (Oficio N° 26105 / 2026 - Solicitud AN001T0026930):** 3.242 intersecciones semaforizadas operativas y centralizadas en las comunas de la RM, con datos técnicos completos de tecnología, controlador, enlace de comunicación y coordenadas WGS 84.
   - Red Vial Nacional (GEOMOP), Red de Estaciones de Metro de Santiago, Red Ferroviaria EFE, Ciclovías Oficiales y Red de Electrolineras RM.
3. 👥 **Demografía, Censo 2024, Comunidades & Vulnerabilidad Social (INE / MDSF / MINVU) [19 capas]:**
   - Despliegue multiescalar del Censo 2024 en 5 niveles territoriales independientes (Regional, Límites Urbanos, Localidades, Zonal y 66.873 Manzanas Censales con 217 variables censales del INE), Unidades Vecinales Oficiales 2026 (Ley N° 19.418), Catastro Nacional de Campamentos 2024 MINVU, Municipios, Centros SERNAM, SCAM, OPD, IGVUST 2026 y 7 indicadores sociodemográficos del Registro Social de Hogares (RSH / CSE).
4. 📈 **Economía, Fomento, Empleo & Inversión Pública (BIP / MOP / ODEPA / CNE / SUBTEL) [15 capas]:**
   - **Iniciativas de Inversión del Banco Integrado de Proyectos (BIP - bbdd_65):** Base oficial de proyectos públicos georreferenciados del Sistema Nacional de Inversiones (SNI / MDSF / Hacienda).
   - Proyectos Mandatados MOP (bbdd_01), Contratos Concesionados (bbdd_04), Contratos MOP (bbdd_05), Personas en RSH ocupadas y cotizantes (bbdd_74), Mercados Mayoristas ODEPA (bbdd_54), Antenas y Torres de Telecomunicaciones (bbdd_35) e Infraestructura Energética RM (centrales solares, hidroeléctricas, termoeléctricas, bioenergía, sistemas de almacenamiento, gasoductos, oleoductos y líneas de transmisión eléctrica).
5. 🏛️ **Equipamiento Público, Educación, Salud & Patrimonio (CMN / MINEDUC / MINSAL / IND / CCU) [28 capas]:**
   - Inmuebles y Zonas de Conservación Histórica (ICH/ZCH), Sitios de Memoria CMN, Jardines Infantiles (JUNJI / Integra), Establecimientos Escolares y de Educación Superior (MINEDUC), Hospitales y CESFAM (DEIS / MINSAL), Infraestructura Deportiva IND, Atractivos Turísticos SERNATUR, Áreas Funcionales, Cités, Oficinas Serviu y SEREMI MINVU, junto a las 12 series históricas CCU (1993 a 2024).
6. 🌳 **Medio Ambiente, Recursos Hídricos, Parques & Espacio Público (MMA / DGA / CONAF / DMC / ODEPA / INFOR) [21 capas]:**
   - Áreas Verdes Normativas IPT (18.173 polígonos), Parques Urbanos MINVU, Red Hidrométrica Nacional DGA, Inventario de Humedales Protegidos (Ley 21.202), SNASPE (CONAF), Cuencas BNA, Estaciones Sedimentométricas y Fluviométricas, Cobertura de Canales de Riego (CNR), Inventarios de Biomasa, Huertos Frutales ODEPA, Calidad del Aire SINCA y Vertederos Ilegales.
7. 🛡️ **Seguridad, Bomberos & Justicia (Carabineros / CBS / SENAPRED / MINJU) [5 capas]:**
   - Cuarteles de Bomberos de Chile, Compañías de Bomberos RM, Comisarías de Carabineros de Chile, Unidades del Plan Cuadrante y Juzgados de Familia.

### 2.3 Panel Lateral "Más detalles" con Alerta Informativa de Columnas
Al hacer clic en cualquier entidad de una capa con alta densidad de variables (>15 columnas, RSH, Censo 2024, BIP, CONAF, UOCT):
- Se abre el panel lateral de detalles con un **aviso informativo destacado en color dorado**: indica que por motivos de rendimiento en el navegador se resumen los indicadores prioritarios.
- Incluye el botón directo **`[📥 Descargar Capa Completa (.geojson)]`**, el cual descarga el archivo original sin recortes espaciales ni omisiones de atributos.

### 2.3 Capa OGC WMS de Patrimonio MINVU en Vivo
- El botón **"🗺️ MINVU WMS Patrimonio en Vivo"** permite superponer directamente teselas georreferenciadas bajo el estándar **OGC WMS 1.3.0** servidas en tiempo real por la División de Desarrollo Urbano del MINVU (`geoide.minvu.cl`).

---

## 3. Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3 (Supabase)

El Atlas cuenta con una base de datos espacial en la nube **PostgreSQL 17.6 con extensión PostGIS 3.3**, 100% de código abierto, gratuita y permanente.

### 3.1 Pestaña "⚡ BD PostGIS" en el Panel Lateral
En el panel lateral derecho (*"Manifold & Telemetría"*), selecciona la pestaña **"⚡ BD PostGIS"**:
- **Estado del Motor:**
  - **`🟢 PostGIS Activo`**: Conexión establecida con la nube de Supabase; las consultas se resuelven mediante funciones espaciales PostGIS en el servidor.
  - **`📁 Modo Local (Fallback)`**: Modo autónomo; el Atlas carga los GeoJSON validados desde la carpeta `data/` sin requerir conexión remota.
- **Configuración rápida:** Puedes ingresar o actualizar tu `Supabase URL` y `Anon Key` directamente desde la interfaz y pulsar **"Conectar BD"** o **"Probar Ping"**.

### 3.2 Arquitectura Híbrida de Consulta
Cuando solicitas una capa, el módulo [`src/js/modulos/db_client.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/db_client.js) ejecuta la siguiente lógica resiliente:
1. **Intento 1 (PostGIS RPC en la nube):** Invoca `fn_obtener_capa_bbox` en PostgreSQL, recortando las geometrías con el índice espacial `GIST` y retornando únicamente las entidades dentro del Bbox del usuario.
2. **Intento 2 (Supabase Storage CDN):** Si la capa no está vectorizada en tablas relacionales, la descarga desde el bucket público `atlas-geojson` a través de la red CDN global de Supabase.
3. **Intento 3 (Fallback Local):** Si no hay conexión o no se han ingresado credenciales, descarga el archivo GeoJSON desde `data/capa_bbdd_XX.geojson`.

### 3.3 Mantenimiento Anti-Pausa Permanente
Para que el proyecto gratuito de Supabase **nunca se suspenda por inactividad de 7 días**, se encuentra configurado el workflow automático [`.github/workflows/supabase_keepalive.yml`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/.github/workflows/supabase_keepalive.yml), el cual se ejecuta en GitHub Actions cada 3 días realizando un ping de telemetría a la base de datos a costo $0.

---

## 4. Módulo de Evaluación Normativa Territorial (CIN-VGI)

Diseñado para contrastar propuestas urbanas o denuncias ciudadanas contra la normativa urbanística vigente:
1. En la barra de herramientas del visor o en la pestaña **"⚖ Normativa"** del panel lateral, activa el **"⚖ Inspector Normativo"**.
2. Haz clic sobre cualquier coordenada del mapa dentro de la comuna de Santiago.
3. El sistema cruzará automáticamente las coordenadas con las capas del **Plan Regulador Comunal de Santiago (PRC)**, la **Ordenanza General de Urbanismo y Construcciones (OGUC)** y la zona patrimonial:
   - **Zona Normativa PRC:** Código de zona (ej: *Zona A - Centro Histórico*, *Zona B - Mixta*).
   - **Usos de Suelo Permitidos y Prohibidos:** Según el Art. 2.1.24 de la OGUC.
   - **Restricciones de Altura y Rasantes:** Art. 2.6.3 OGUC.
   - **Afectaciones Patrimoniales:** Inmuebles o Zonas de Conservación Histórica (Art. 60 LGUC / Ley 17.288 de Monumentos Nacionales).
   - **Áreas de Riesgo:** Fallas geológicas, inundación o resguardo de infraestructura (Art. 2.1.17 OGUC).
4. **Exportación de Certificado:** Haz clic en **"Descargar Certificado Normativo (.txt)"** para obtener un documento técnico estructurado con fecha, coordenadas UTM 19S y advertencia legal conforme al Art. 116 de la Ley General de Urbanismo y Construcciones.

---

## 5. Módulo Importador de Capas Espaciales Locales

Permite a los usuarios y organizaciones auditar su propia información geográfica sin subirla a servidores externos:
1. Dirígete a la sección **"📂 Importador de Capas Locales"** o a la pestaña **"⬚ Cargar"** en la barra lateral.
2. Arrastra y suelta (o selecciona) archivos en los siguientes formatos admitidos:
   - **`.kmz`**: Descomprimido 100% en memoria en el navegador mediante JSZip y convertido a GeoJSON con toGeoJSON.
   - **`.kml`**: Capas de Google Earth o levantamientos de campo.
   - **`.geojson` / `.json`**: Archivos vectoriales estándar en EPSG:4326.
   - **`.gpx`**: Trazas de GPS y puntos de control de terreno.
   - **`.csv`**: Tablas con columnas de coordenadas (`lat`, `lon`, `latitud`, `longitud`, `x`, `y`).
3. La capa se proyectará de inmediato en el mapa interactivo con simbología distintiva y quedará habilitada para ser auditada por el Inspector Normativo.

---

## 6. Consultas Espaciales, Explorador OSM y Base Regional Geofabrik (Panel 01)

El Módulo 01 articula tanto la extracción en vivo vía Overpass API como el análisis espacial masivo de la **Base Regional Geofabrik RM (1.552.144 entidades clasificadas con superposición semántica, 695.412 edificaciones íntegras sin recortes con interpretación predial y 326.545 elementos de transporte y movilidad)**:

### 6.1 Constructor Visual y Consultas Rápidas en 1 Clic
- **Consultas Rápidas Ciudadanas:** 10 botones preconfigurados para mapear instantáneamente universidades, comercio, transporte, ciclovías, parques, patrimonio, rebajes accesibles D.S. 50, arbolado y edificaciones.
- **Constructor Visual:** Permite seleccionar cualquier clave (`amenity`, `shop`, `highway`, `leisure`, `historic`, `natural`, `building`, etc.), elegir un operador (`=`, `!=`, `~`) y auditar su frecuencia planetaria con el botón **`[⚡ Validar en Taginfo]`**.
- **Editor Overpass QL:** Para usuarios avanzados que deseen redactar sintaxis directa en lenguaje Overpass QL usando el comodín `{{bbox}}`.

### 6.2 Base Regional Geofabrik RM y Modalidades Duales de Consulta Espacial
Para consultar el extracto de 1.552.144 entidades descargado de Geofabrik para toda la Región Metropolitana con latencia 0 ms:
1. **`🗺️ Modo 1: Bbox Dinámico del Mapa (Interactivo)`**:
   - Al navegar, arrastrar o cambiar el zoom en el visor Leaflet hacia cualquier comuna de la Región Metropolitana (Maipú, Puente Alto, Providencia, Santiago, La Florida, San Bernardo, Colina, Melipilla, etc.), los campos numéricos de coordenadas se recalculan en tiempo real.
   - Pulsa el botón **`[🗺️ Consultar por Bbox del Mapa]`**: El motor filtrará en memoria en tiempo récord ($O(1)$) descartando elementos fuera del encuadre y proyectando las geometrías de la zona activa.
2. **`📌 Modo 2: Coordenadas Numéricas Manuales (WGS 84)`**:
   - Permite escribir coordenadas numéricas precisas en los campos `Oeste (Lng Min)`, `Sur (Lat Min)`, `Este (Lng Max)` y `Norte (Lat Max)`.
   - Pulsa el botón **`[📌 Consultar por Coordenadas]`**: El sistema valida la consistencia geográfica del polígono y extrae las entidades correspondientes.
3. **Botones de Encuadre Territorial Rápido:**
   - **`[🌐 Toda la Región Metropolitana]`**: Carga automáticamente el bounding box macro de las 52 comunas de la RM `[-71.50, -34.20, -70.00, -33.00]`.
   - **`[📍 Centrar en Barrio Brasil (UAH)]`**: Restablece el encuadre piloto local de Barrio Brasil y el Campus UAH `[-70.6720, -33.4500, -70.6550, -33.4380]`.

### 6.3 Diferenciación Estricta de Fuentes (Desacople Operativo)
En el Atlas, cada dato espacial cuenta con trazabilidad formal de procedencia:
- **`Geofabrik (Extracto RM)`**: Identificado con badge dorado. Proviene de la descarga del dump PBF regional procesado en 10 macrocategorías temáticas (`metodo_adquisicion: 'Descarga Geofabrik (Dump PBF regional)'`).
- **`OpenStreetMap (API Overpass)`**: Identificado con badge azul. Proviene de consultas dinámicas en vivo a la API Overpass (`metodo_adquisicion: 'Descarga de OSM (con la API)'`).
- **Política de No Fusión:** Ambos orígenes no se mezclan en una misma capa para evitar duplicaciones o distorsiones temporales, permitiéndose la combinación únicamente en superposiciones analíticas expresas (por ejemplo `GBIF + OSM` en el Módulo de Biodiversidad Urbana).

---

## 7. Métricas de Calidad de Datos, OQT y Control de Cambios (Panel 02)

Permite auditar cuantitativamente la madurez de la información en el territorio:
- **Submódulo A (ohsome API Dual v1 / v2 & OQT):** Calcula el conteo de elementos vigentes, densidad métrica por km² (reproyección a EPSG:32719) y serie cronológica anual de colaboradores y ediciones. Proporciona el *Índice de Saturación de Mapeo* y la clasificación de madurez territorial.
- **Submódulo B (Control de Cambios y Validación con OSMCha):** Permite inspeccionar las últimas ediciones en el Bbox barrial o auditar un Changeset numérico específico con enlace directo a `osmcha.org`.

---

## 8. Biodiversidad Urbana con GBIF y Ciencia Ciudadana (Panel 03)

Integra observaciones biológicas científicas y ciudadanas (iNaturalist / GBIF.org):
- **Autocompletado Taxonómico (Species API):** Al escribir el nombre común o científico de una especie (ej: *Passer domesticus*, *Jacaranda mimosifolia*, *Quillaja saponaria*), el sistema sugiere el taxón oficial en tiempo real.
- **Banderas de Calidad Darwin Core:** La tabla de ocurrencias verifica la consistencia geodésica de las coordenadas y el nivel de precisión espacial.
- Haz clic en **"Cargar al Mapa Atlas"** para proyectar los avistamientos biológicos sobre el tejido urbano.

---

## 9. Cartografía Temática Comunitaria con UMap (Panel 04)

Visualiza iniciativas cartográficas vecinales desarrolladas en la plataforma comunitaria UMap:
- Proyectos barriales integrados: casonas patrimoniales de Barrio Brasil, trazados de ciclovías comunitarias y huertos urbanos.
- Soporte para visualizar proyectos externos mediante URL pública de UMap.
- Exportación directa de capas vectoriales GeoJSON comunitarias.

---

## 10. Fichas de Metadatos Estandarizadas (Panel 05)

Genera la documentación técnica oficial del catastro territorial:
1. Pulsa **"Prellenar con datos de la última consulta"** para autocompletar título, Bbox y linaje a partir del área de trabajo activa.
2. Ajusta el resumen, sistema de referencia (EPSG:4326 / EPSG:32719) y datos de contacto institucional.
3. Exportación en dos estándares oficiales:
   - **"📄 Exportar JSON (ISO 19115)":** Ficha estructurada en JSON con el estándar internacional ISO 19115-1:2014.
   - **"🏛️ Exportar XML (ISO 19139 / IDE Chile)":** Archivo XML válido listo para ser cosechado por catálogos oficiales como GeoNetwork, GeoNode o la Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT).

---

## 11. Diccionario Territorial de 134 Descriptores (Panel 06)

Permite consultar la definición toponímica y la homología institucional de cada etiqueta:
- **Sinceramiento conceptual:** Distingue rigurosamente entre **capas oficiales del Estado** (con respaldo legal en IDE Chile) y **brechas VGI ciudadanas** (datos colaborativos no catastrados formalmente por el Estado).
- **Filtros rápidos:** Alterna entre `[⚡ Solo Brechas VGI]` y `[🏛️ Capas Oficiales IDE]`.
- **Telemetría Taginfo y Darwin Core:** Cada tarjeta incluye enlace de inspección en tiempo real con Taginfo API o el estándar Darwin Core de GBIF.

---

## 12. Catálogos Oficiales en Excel (.xlsx) y Licencias (Panel 07)

En la carpeta `docs/` y `src/docs/` del repositorio se encuentran disponibles los libros de cálculo actualizados para análisis territorial y respaldo técnico:
- **`docs/categorias_tematicas_osm.xlsx`:** Matriz integral de 4 hojas (10 Categorías Maestras VGI, Catálogo Chile de 134 descriptores territoriales, Perfil de 14 Atributos VGI y 125 Citas Bibliográficas APA 7ª ed.).
- **`docs/catalogo_fuentes_vgi.xlsx`:** Matriz analítica de fuentes colaborativas, inventario técnico de APIs/endpoints y catálogo exhaustivo de **108 Capas Oficiales del Estado de Chile** (Censo 2024 multiescalar, Semáforos RM UOCT/MTT, BiDat MDSF, MINVU, MOP, DGA, Energía, CCU, etc.).
- **`docs/perfil_metadatos_vgi.xlsx`:** Estructura de campos y equivalencias con el estándar nacional chileno (IDE Chile), complementado con la matriz integral de *Auditoría MetaCalidad 118 Capas*.
- **`docs/ANALISIS_METACALIDAD.md`:** Informe técnico de auditoría de MetaCalidad (ISO 19115 / ISO 19157) sobre el 100% de la base de datos (118 capas).
- **`docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`:** Registro exhaustivo de 125 fuentes APA 7ª ed. (integrando 51 obras seminales de investigación, 8 fuentes epistemológicas e hispanoamericanas y 66 normas técnicas y marcos legales del Estado de Chile y globales).

---

## 13. Pipeline de Procesamiento por Terminal (Python CLI)

Para analistas SIG o geógrafos que requieran procesar datos por lotes en consola:

```bash
# 1. Auditoría universal pre-despliegue de los 214 GeoJSONs y catálogos Excel:
python3 scripts/verificar_integridad_despliegue.py

# 2. Auditoría programática de MetaCalidad (ISO 19115 / ISO 19157):
python3 scripts/analisis_metacalidad.py

# 3. Ingesta masiva y sincronización con Supabase PostGIS:
export SUPABASE_URL="https://[TU-PROYECTO].supabase.co"
export SUPABASE_KEY="TU_SERVICE_ROLE_KEY"
python3 scripts/subir_base_datos_supabase.py --upload-storage

# 4. Regeneración de libros de catálogo en Excel:
python3 scripts/generar_catalogos_excel.py

# 5. Extracción automatizada de categorías VGI desde Overpass:
python3 scripts/extractor_vgi.py --categoria todas
```

---

## 14. Preguntas Frecuentes

**¿La plataforma funciona si no tengo conexión a internet o si no configuro Supabase?**  
Sí. El sistema posee una arquitectura *client-side* con **fallback local transparente**: si no hay internet o no hay credenciales de base de datos, el visor consume de forma autónoma los archivos GeoJSON almacenados localmente en `data/`.

**¿Dónde se guardan las credenciales de Supabase que ingreso en el visor?**  
Se guardan de forma privada en el almacenamiento local (`localStorage`) de tu navegador web. Nunca se transmiten a servidores de terceros y pueden borrarse en cualquier momento desde la misma pestaña *"⚡ BD PostGIS"*.

**¿Cómo se garantiza que la base de datos gratuita de Supabase no se desactive?**  
Gracias al workflow [`.github/workflows/supabase_keepalive.yml`](../.github/workflows/supabase_keepalive.yml), GitHub Actions ejecuta un ping ligero cada 3 días sobre la API de Supabase, manteniendo el proyecto permanentemente activo de por vida a costo $0.

---

## 15. Guía de Contribución y Trazabilidad para la Comunidad

El Atlas es un bien público abierto y transferible. Cualquier usuario promedio (vecinos, dirigentas/es de juntas vecinales, estudiantes, ONGs) puede hacer contribuciones y enriquecer los datos de manera simple:

1. **Mapeo Directo en OpenStreetMap (Sin código):**  
   Ingresa a [OpenStreetMap.org](https://www.openstreetmap.org/) con el editor web visual iD. Puedes agregar o corregir locales comerciales, rebajes peatonales, veredas, luminarias o plazas en Barrio Brasil. Al guardar el conjunto de cambios, añade `#AtlasVGI_UAH` en el comentario. Las consultas en vivo del Atlas integrarán tu aporte inmediatamente con trazabilidad de autor y fecha.
2. **Carga y Contraste de Archivos Locales en el Visor:**  
   En el Panel 00 (Visor), utiliza el botón **"📂 Cargar Archivo Local"** para importar capas `.GeoJSON`, `.KML`, `.KMZ`, `.GPX` o `.CSV`. Podrás superponer tus propios catastros de terreno sobre las 108 capas oficiales del Estado y las 10 categorías VGI en tiempo real, sin intermediarios y manteniendo tus datos privados en el navegador.
3. **Reporte y Sugerencia de Capas vía GitHub Issues:**  
   Si encuentras una discrepancia o tu organización posee un set de datos territoriales que desea visibilizar, abre un [Issue en GitHub](https://github.com/GEOJOTA/atlas_vgi_uah/issues) detallando el nombre de la capa, enlace o archivo, ubicación y organización de contacto.
4. **Lineamientos de Trazabilidad e Integridad:**  
   Para preservar la rigurosidad científica, todo dato aportado debe registrar: (a) entidad u organización responsable, (b) fecha o año de levantamiento, (c) sistema de coordenadas (WGS 84 o EPSG:32719) y (d) licencia abierta compatible (ODbL, CC-BY 4.0 o datos públicos Ley 20.285). Para más detalles, consulta [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 16. Auditoría y Evaluación de MetaCalidad de la Base de Datos (ISO 19115 / ISO 19157 / IDE Chile)

El Atlas VGI incorpora un marco de auditoría de **MetaCalidad** (calidad intrínseca y extrínseca de los metadatos geoespaciales) ejecutado mediante `scripts/analisis_metacalidad.py`. Esta auditoría examina de manera exhaustiva el **100% de la base de datos cartográfica** (118 capas: 108 capas oficiales del Estado de Chile + 10 macro-categorías comunitarias VGI de OpenStreetMap y GBIF), abarcando **1.332,66 MB** de datos vectoriales.

### 16.1 Marcos Normativos y Dimensiones Evaluadas
Conforme a las normas **ISO 19115-1:2014**, **ISO 19157:2013 / 2023**, **ISO 19139:2007** y el **Perfil Nacional de Metadatos de Chile v2.0 (IDE Chile - SNIT)**, la evaluación mide cinco dimensiones ponderadas:

1. **Completitud de Metadatos Núcleo (MC - 30%):** Presencia de los 10 elementos obligatorios del Perfil Nacional (Identificador, Título, Resumen, Custodio, Temporalidad, Tópico ISO, Extensión Bbox, CRS, Licencia y Linaje/Cita APA).
2. **Conformidad Normativa y Semántica (CC - 20%):** Validación de esquema GeoJSON/XML, tipología geométrica explícita y asignación a grupos temáticos normalizados.
3. **Linaje, Trazabilidad y Derechos Jurídicos (LL - 25%):** Atribución estricta según marco legal: Ley N° 20.285 de Transparencia para capas del Estado, ODbL 1.0 para OpenStreetMap y CC-BY 4.0 para GBIF, con cita bibliográfica en formato APA 7ª edición.
4. **Resolución Espacial y Granularidad Territorial (RG - 15%):** Escala de agregación formalmente documentada (Regional, Comunal, Zonal, Manzana, Predio o Puntual) y doble sistema de referencia geodésico (WGS 84 / EPSG:4326 y SIRGAS-Chile / EPSG:32719 para cálculo métrico conforme de Snyder).
5. **Accesibilidad e Integridad Operativa (AI - 10%):** Verificación de integridad física binaria en `src/data/` (cero punteros LFS rotos) y disponibilidad de descarga inmediata.

### 16.2 Resultados y Dictamen Global de la Base de Datos (118 Capas)
$$\text{IGMC}_i = 0.30 \cdot \text{MC}_i + 0.20 \cdot \text{CC}_i + 0.25 \cdot \text{LL}_i + 0.15 \cdot \text{RG}_i + 0.10 \cdot \text{AI}_i$$

| Métrica Global | Puntaje Promedio | Calificación ISO 19157 |
| :--- | :---: | :---: |
| **Completitud Núcleo (MC)** | **89.92%** | 🟢 Excelente |
| **Conformidad Normativa (CC)** | **97.88%** | 🟢 Excelente |
| **Linaje y Trazabilidad (LL)** | **100.00%** | 🟢 Excelente |
| **Resolución y Granularidad (RG)** | **100.00%** | 🟢 Excelente |
| **Accesibilidad e Integridad (AI)** | **100.00%** | 🟢 Excelente |
| **Índice Global de MetaCalidad (IGMC)** | **96.55%** | **🟢 Grado A+ (Excelente)** |

**Distribución de Calidad de la Base de Datos:**
- **Grado A+ (Excelente, $\ge 95\%$):** 98 capas (**83.1%**).
- **Grado A (Muy Bueno, $85\% - 94.9\%$):** 20 capas (**16.9%**).
- **Grado B / C (< 85%):** 0 capas (**0.0%**).

El informe pormenorizado con la matriz completa de las 118 capas se encuentra documentado en [`docs/ANALISIS_METACALIDAD.md`](docs/ANALISIS_METACALIDAD.md), en formato estructurado [`docs/matriz_metacalidad.json`](docs/matriz_metacalidad.json) y en la hoja *Auditoría MetaCalidad 118 Capas* del libro Excel [`docs/perfil_metadatos_vgi.xlsx`](docs/perfil_metadatos_vgi.xlsx).

---

## 17. Módulo 09: Indicadores de Análisis Multidimensional y Storyboards de Barrio Brasil (Marco Tentativo y Exploratorio)

> [!NOTE]
> **Carácter Tentativo y Exploratorio Fondecyt:**  
> El módulo de **Indicadores de Análisis Multidimensional** y las **Storyboards territoriales** de Barrio Brasil constituyen un desarrollo metodológico preliminar en fase de formulación e iteración para el Proyecto Fondecyt Regular F1261256 (Geografía UAH). Tanto la agregación de las 118 capas en cinco dimensiones estratégicas como las narrativas situadas de datos se ofrecen a modo de prototipo exploratorio de divulgación científica y discusión comunitaria. Su formulación es tentativa y no compromete los estándares ni entregables canónicos de metadatos (ISO 19115 / ISO 19157 / IDE Chile) de la base de datos geoespacial.

### 17.1 Acceso e Interfaz de las 5 Dimensiones Analíticas
El módulo se encuentra disponible en la barra superior de módulos bajo la pestaña **`09 📈 Indicadores & Storyboards`** (o mediante el botón de acceso rápido en la barra de herramientas del visor).  
La interfaz está centrada para maximizar el impacto visual y presenta 5 grandes tarjetas interactivas con íconos distintivos de 76px y halo luminoso temático:

1. 👥 **Dimensión Sociodemográfica:**
   - **Enfoque:** Dinámicas poblacionales, estructura por grupos etarios, hogares monoparentales, inmigración, vulnerabilidad social y estratificación socioespacial.
   - **Capas Integradas:** Censo 2024 multiescalar (Manzanas, Zonas, Comunas), Registro Social de Hogares (RSH), Hogares Monoparentales BiDat, Inmigración BiDat y Barrios Prioritarios.
2. 💼 **Dimensión Socioeconómica:**
   - **Enfoque:** Inversión pública, empleo, equipamiento de telecomunicaciones, matriz energética y actividades productivas.
   - **Capas Integradas:** Inversión Pública del Banco Integrado de Proyectos (BIP - MDSF), Ocupación RSH, Subsidios Habitacionales DS49 y DS19, Redes de Telecomunicaciones (SUBTEL), Infraestructura Eléctrica (CNE) y Abastecimiento Silvoagropecuario (ODEPA).
3. 🌿 **Dimensión Socioambiental:**
   - **Enfoque:** Espacio público verde, resiliencia ecológica, biodiversidad urbana, cobertura arbórea y calidad del aire.
   - **Capas Integradas:** Cobertura Vegetal CONAF/Ciren, Índice de Vegetación Urbana IGVUST (MINVU), Red Hidrográfica DGA, Estaciones de Calidad del Aire (SINCA / MMA), Catastro de Biodiversidad GBIF/iNaturalist y Puntos Limpios (MMA).
4. 🏥 **Dimensión Sociosanitaria:**
   - **Enfoque:** Red de atención primaria, servicios de urgencia, farmacias comunitarias y personas en situación de dependencia o cuidados.
   - **Capas Integradas:** Red Asistencial DEIS/MINSAL (CESFAM, Hospitales, SAPU), Farmacias de Turno y Populares, y Cuidados/Dependencia Funcional RSH.
5. 🏛️ **Dimensión Sociourbana o Habitabilidad:**
   - **Enfoque:** Morfología urbana, catastro predial, instrumentos de planificación territorial (PRC Santiago), movilidad sostenible, cruces seguros y patrimonio histórico.
   - **Capas Integradas:** Catastro de Predios e Inmuebles SII, 192 Zonas Normativas del Plan Regulador Comunal de Santiago (PRC), Cruces Semaforizados UOCT (3.242 intersecciones), Red de Ciclovías, Estaciones de Metro, Inmuebles y Zonas Típicas CMN/MINVU, Bomberos y Seguridad.

### 17.2 Despliegue de Acordeones, Buscador en Tiempo Real e Interacción Cartográfica
Al presionar cualquiera de las 5 dimensiones:
- Se despliega un **acordeón interactivo fluido y centrado** con el listado completo de las capas asignadas a dicha dimensión.
- **Buscador en Tiempo Real:** Incorpora un campo de búsqueda predictiva (`🔍`) que permite filtrar instantáneamente las capas por texto (nombre, custodio, código o geometría).
- **Filtros por Origen:** Botones de segmentación inmediata (`Todas`, `Oficiales Estado`, `VGI Comunitario`) con conteos dinámicos.
- Cada tarjeta de capa muestra una píldora con el código de la fuente (`INE`, `MDSF`, `MINVU`, `UOCT`, `OSM`, `CONAF`, etc.), geometría (`Polígonos`, `Puntos`, `Líneas`), descripción sintetizada y dos botones de acción:
  - **"🗺️ Ver en Mapa"**: Conmuta automáticamente al visor cartográfico Leaflet 2D, abre el grupo temático correspondiente y activa la capa centrando su visualización.
  - **"GeoJSON 📥"**: Descarga inmediata del archivo vectorial oficial o comunitario.

### 17.3 Storyboards Territoriales: Análisis Profundo con Porcentajes, Gráficos y Diagramas SVG
Bajo las dimensiones analíticas, la sección **Storyboards** presenta análisis territoriales exhaustivos y rigurosos donde la base de datos abierta cuenta historias situadas sobre la realidad socioespacial de Barrio Brasil:
- **Cuadrícula Visual 1:1:** Cada storyboard cuenta con una portada cuadrada con imagen en alta resolución o gráfico vectorial temático.
- **Lámina Modal Inmersiva (Tipo Blog):** Al hacer clic sobre cualquier tarjeta, se despliega una lámina modal a pantalla completa con:
  - Ficha técnica, territorio y tiempo estimado de lectura.
  - **Matriz de Indicadores Clave:** 4 tarjetas cuantitativas destacadas.
  - **Evidencia Espacial y Distribución Porcentual:** Cuadrícula de barras de progreso porcentual comparando Barrio Brasil frente a promedios comunales y regionales (p. ej., 68.4% de tipología residencial tradicional, 62.7% de arriendo censal, 46.8% de caminata, 84.6% de cuidadoras mujeres en RSH).
  - **Gráficos Comparativos y Benchmarks:** Histogramas y gráficos de barras comparativas (reparto modal, alturas edilicias, dotación de áreas verdes m²/hab frente a estándares OMS).
  - **Diagramas Técnicos Vectoriales SVG:** Modelaciones visuales interactivas nítidas:
    1. *Rasante OGUC y Contraste Morfológico:* Corte transversal casona de 2 pisos vs. torre de 18 pisos en el borde de Alameda.
    2. *Ciclo Semafórico UOCT:* Tiempos de verde vehicular (52s) vs. verde peatonal (18s) en cruce de 24 metros en Av. Brasil.
    3. *Gradiente Microclimático e Isla de Calor:* Atenuación térmica de 39.2°C en asfalto a 28.8°C bajo el dosel arbóreo de Plaza Brasil.
    4. *Isócronas de Caminabilidad Universitaria:* Radios de 5 y 10 minutos conectando Campus UAH, Metro Los Héroes y comercios.
    5. *Red Integrada de Cuidados Sociosanitarios:* Circuito multinivel entre hogar dependiente, juntas vecinales (Ley 19.418), CESFAM y nivel hospitalario.
  - **Tabla de Indicadores y Atributos Específicos:** Medición barrial vs. valor referencial comunal y capa de origen.
  - **Cuerpo Narrativo y Conclusión Territorial:** Ensayo crítico estructurado.
  - **Botón Interactivo "🗺️ Explorar Capas en el Visor":** Activa en lote el paquete de capas espaciales vinculadas al análisis.

