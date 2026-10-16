# Manual de Uso — Atlas de Información Geográfica Voluntaria (Atlas VGI · UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**  
**Área de estudio:** Barrio Brasil, Comuna de Santiago y Región Metropolitana de Chile.

---

## 1. Propósito y Alcance del Sistema

El **Atlas de Información Geográfica Voluntaria (Atlas VGI)** es una plataforma web abierta que integra cartografía oficial del Estado de Chile con información geográfica voluntaria (VGI) para el diagnóstico, análisis normativo y gestión territorial del Barrio Brasil y su contexto metropolitano.

La estructura actual del sistema constituye la arquitectura consolidada del proyecto (quedando únicamente ajustes menores asociados a las fases finales de análisis y validación con usuarios):

- **131 capas geográficas operativas (`EPSG:4326`, WGS84 / SIRGAS-Chile)**:
  - **121 capas oficiales del Estado**: IDE Chile, MINVU (PRC, PRMS, ZCH/ICH, Cités), INE (Censo 2024), MTT/DTPM/UOCT, MDSF (RSH / BiDat), SUBDERE (13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios 2024), MMA, SERNAGEOMIN, CMN, MINSAL y SII.
  - **10 categorías colaborativas VGI**: Levantamientos comunitarios en OpenStreetMap (OSM) y registros biológicos en GBIF / iNaturalist.
- **140 descriptores documentados** en el Diccionario de Datos (incluyendo los comentarios técnicos nativos de las geodatabases `.gpkg` de SUBDERE).
- **10 módulos integrados (`00` al `09`)** y **7 Storyboards territoriales** basados en evidencia empírica.

---

## 2. Estructura de la Interfaz Principal

La plataforma se organiza en tres componentes:

1. **Barra superior de navegación (Módulos `00` a `09`)**: Permite alternar entre el visor cartográfico y los módulos analíticos, normativos y documentales sin perder el estado de las capas activas.
2. **Lienzo cartográfico interactivo (Módulo `00`)**: Mapa 2D/3D con selector de escala territorial (*Barrio Brasil Completo* o *Manzana UAH*), dibujo de área de interés (*Bbox*), importador de capas locales (`.kmz`, `.kml`, `.geojson`, `.gpx`, `.csv`) y exportación directa de datos (`.geojson` y paquete completo `.zip`).
3. **Panel lateral de gestión territorial (derecha)**:
   - **📊 Métricas**: Conteo en vivo de capas/objetos cargados y cálculo dinámico del **Índice de Calidad VGI (ICV)** (*Completitud Espacial*, *Actualidad Reciente*, *Atribución Completa* y *Calidad Estimada*), calculado estrictamente sobre las entidades activas en el mapa.
   - **🏛 Capas IDE**: Buscador instantáneo y acordeones temáticos para activar cualquiera de las 121 capas oficiales y las 10 categorías VGI.
   - **⚖ Normativa**: Inspector Normativo para consultar el Plan Regulador Comunal (PRC), PRMS, OGUC, riesgos y patrimonio en cualquier punto del mapa.
   - **⬚ Cargar / ⚡ BD PostGIS**: Carga de archivos locales del usuario y conexión opcional a base de datos espacial.

---

## 3. Operación por Módulo (`00` al `09`)

### Módulo `00` · Visor para la gestión territorial
- **Activación y cruce de capas**: Seleccione en el panel lateral las capas oficiales y colaborativas que desee contrastar (se recomienda activar entre 2 y 4 capas simultáneamente para mantener legibilidad cartográfica). Al hacer clic sobre cualquier geometría en el mapa, se despliega su ficha de atributos, fuente institucional y botón de descarga individual en `GeoJSON`.
- **Inspector Normativo y Certificado CIN-VGI**: Active el botón **⚖ Inspector Normativo** y haga clic sobre cualquier predio o manzana. El sistema evalúa espacialmente:
  1. Zonificación comunal (`PRC`) e intercomunal (`PRMS`).
  2. Usos permitidos (`UPERM`) y prohibidos (`UPROH`) bajo el principio de exclusión negativa del **Art. 2.1.24 de la OGUC**.
  3. Restricciones por riesgo natural (**Art. 2.1.17 OGUC**) y protección patrimonial (**Zonas e Inmuebles de Conservación Histórica y Ley N° 17.288 CMN**).
  4. **Expediente Histórico de Modificaciones al PRC de Santiago en Barrio Brasil (1990–2024)**: Síntesis de los 10 hitos regulatorios del sector (Res. N° 26/1990, Seccional Brasil, Modificaciones N° 16, 21, 26 y 31, Enmienda N° 2 de Cités, Enmiendas de Altura N° 1, 3 y 6 y postergaciones Art. 117 LGUC), enlace directo al repositorio documental oficial de la Municipalidad de Santiago (`https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz`) y descarga del certificado referencial en formato `.txt`.

### Módulo `01` · Consultas Overpass (Explorador OSM)
Ejecuta consultas en tiempo real sobre la base de datos de OpenStreetMap dentro del recuadro activo del mapa, ya sea mediante plantillas temáticas preconfiguradas (educación, salud, transporte, ciclovías, patrimonio, accesibilidad, arbolado) o editando directamente código **Overpass QL**, con exportación inmediata a `GeoJSON`.

### Módulo `02` · Calidad & ICV (ISO 19157 / ohsome / OSMCha)
Evalúa la calidad de los datos voluntarios mediante tres herramientas complementarias:
- **Submódulo A (Evaluador WLC / ISO 19157)**: Matriz cuantitativa de completitud, exactitud posicional, consistencia lógica y vigencia.
- **Submódulo B (ohsome API - HeiGIT)**: Series históricas de evolución de mapeo en OpenStreetMap (conteo, longitud en metros y superficie en $\text{m}^2$ bajo proyección `EPSG:32719`).
- **Submódulo C (OSMCha / Changesets)**: Auditoría de ediciones recientes en el polígono de estudio para verificar autoría y consistencia de los cambios.

### Módulo `03` · Biodiversidad GBIF
Consulta registros biológicos georreferenciados de flora, fauna y funga urbana provenientes de **GBIF** e **iNaturalist Chile** bajo estándar *Darwin Core (DwC)*, permitiendo filtrar por grupo taxonómico y visualizar los avistamientos en el mapa.

### Módulo `04` · Cartografía uMap
Integra lienzos de mapeo participativo basados en **uMap** orientados al trabajo en talleres vecinales, levantamiento de percepciones comunitarias y validación en terreno, permitiendo importar sus capas directamente al visor principal.

### Módulo `05` · Metadatos ISO 19115
Genera y exporta fichas formales de metadatos geográficos conforme al estándar **ISO 19115 / ISO 19139** (Perfil Nacional de Metadatos de IDE Chile / SNIT), documentando linaje, sistema de referencia (`EPSG:4326` / `EPSG:5361` / `EPSG:32719`), custodia institucional y licenciamiento en formatos `JSON` y `XML`.

### Módulo `06` · Diccionario de Datos (131 Capas / 140 Descriptores)
Documenta el significado técnico, tipo de dato, fuente y homologación con IDE Chile de cada atributo en las **131 capas geográficas** y **9 tablas de referencia** (140 descriptores en total). Incluye el diccionario técnico íntegro de las 13 capas de **Residuos Sólidos Domiciliarios (SUBDERE 2024, BBDD-86 a BBDD-98)** extraído de los comentarios nativos de sus geodatabases `.gpkg`.

### Módulo `07` · Licencias & Catálogos
Especifica las condiciones jurídicas de uso y atribución (**ODbL 1.0** para OpenStreetMap, **CC-BY 4.0** para GBIF, **Ley N° 20.285** de Datos Abiertos del Estado y **Ley N° 19.628** de resguardo de datos personales mediante agregación estadística) y provee descarga directa de las matrices maestras en formato Excel (`.xlsx`).

### Módulo `08` · Manual de Uso y Manual de Actualización
Integra en pantalla tanto este **Manual de Uso** como el **Manual de Actualización y Mantención del Atlas (`MANUAL_ACTUALIZACION_ATLAS.md`)**, permitiendo alternar entre ambos, buscar por palabra clave o descargarlos en formato Markdown (`.md`).

### Módulo `09` · Indicadores & Storyboards
Estructura el análisis territorial del Barrio Brasil en dos niveles:
1. **5 Dimensiones Analíticas (131 capas)**:
   - **01 · Sociodemográfica** (`19 capas`): Censo 2024, densidad, estructura etaria, migración y pueblos originarios.
   - **02 · Socioeconómica** (`18 capas`): Inversión pública BIP, comercio, ferias libres, patentes y avalúo fiscal SII.
   - **03 · Socioambiental** (`36 capas`): Áreas verdes, arbolado, islas de calor, biodiversidad GBIF, riesgos y las **13 capas de Residuos Sólidos Domiciliarios SUBDERE 2024**.
   - **04 · Sociosanitaria** (`3 capas`): Red asistencial MINSAL/DEIS, servicios de salud y dependencia funcional RSH.
   - **05 · Sociourbana o Habitabilidad** (`55 capas`): Normativa PRC/PRMS, patrimonio ZCH/ICH, cités, movilidad (Metro, DTPM, UOCT, ciclovías) y seguridad.
2. **7 Storyboards Territoriales**:
   Reportajes analíticos con indicadores clave (KPIs), gráficos comparativos, diagramas vectoriales SVG, tablas de datos, utilidad diferenciada para los **4 perfiles de actores territoriales** (*Institución Pública*, *Comunidad Vecinal*, *Mapeador Voluntario* y *Academia/ONGs*) y bibliografía en norma APA 7ª edición:
   - *1. Metamorfosis del Habitar: Entre Casonas, Cités y Presión Inmobiliaria.*
   - *2. Caminar y Pedalear el Barrio: Rebajes Peatonales, Ciclovías y la Malla UOCT.*
   - *3. Oasis Bioclimático: Plaza Brasil y la Red de Biodiversidad Vegetal Oculta.*
   - *4. Universidad, Estudiantes y Almacenes: El Ecosistema de Proximidad UAH.*
   - *5. Cuidados Invisibles y Envejecimiento: Radiografía de la Salud en el RSH.*
   - *6. Metabolismo Urbano y Residuos Sólidos Domiciliarios (SUBDERE RSD 2024).*
   - *7. Treinta Años de Disputa Normativa: Las Modificaciones al PRC en Barrio Brasil (1990–2024).*
