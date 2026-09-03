# Trazabilidad Académica y Memoria Metodológica
### Proyecto de Práctica Profesional (2026 S2): Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Nodo GeoAbierto)

**Autor:** Juan Pablo Lescano Villegas (`GEOJOTA` <juanpablolescanovillegas@gmail.com>)  
**Área:** Geografía, Sistemas de Información Geográfica y Gestión Territorial  
**Caso Piloto:** Barrio Brasil — Universidad Alberto Hurtado (Santiago Centro, Chile)  
**Institución de Referencia:** Universidad Alberto Hurtado (UAH)  

---

## 1. Fundamentación Epistemológica: La VGI en la Geografía Contemporánea

Tradicionalmente, la producción de datos geográficos ha sido monopolio de agencias estatales centralizadas (institutos geográficos militares, ministerios de bienes nacionales, catastros municipales). Aunque rigurosos, estos catastros sufren de tres limitaciones estructurales:
1. **Altos costos presupuestarios y ciclos de actualización prolongados** (a menudo superiores a 5 o 10 años).
2. **Escala macro u homogénea**, incapaz de captar la microdinámica urbana (arbolado barrial, rebajes peatonales en cruces de calles, comercio vecinal).
3. **Brecha de acceso comunitario**: los datos quedan encapsulados en formatos propietarios y visores burocráticos.

Desde la formulación conceptual de Michael Goodchild (2007) sobre la *Información Geográfica Voluntaria* (VGI) y los trabajos de Muki Haklay (2010) sobre la calidad de OpenStreetMap, la geografía reconoce a la ciudadanía y a las comunidades universitarias como **sensores espaciales activos**.

El **Atlas VGI (Nodo GeoAbierto)** operacionaliza esta corriente epistemológica: transforma el dato colaborativo no estructurado en **información geográfica estandarizada, auditable y directamente aplicable a la toma de decisiones territoriales**.

---

## 2. Marco Legal e Institucional en el Contexto Chileno

Para que este proyecto sea defendible ante un comité académico y utilizable por municipios u organizaciones, se alinea con la legislación y la normativa técnica chilena vigente:

### 2.1 Ley N° 20.285 sobre Acceso a la Información Pública y Datos Abiertos
El Estado de Chile promueve la apertura y reutilización de datos públicos bajo principios de no discriminación, gratuidad y formatos abiertos. La plataforma integra capas oficiales de IDE Chile bajo licencias de datos abiertos del Estado, complementándolas con VGI.

### 2.2 Política Nacional de Información Geoespacial e IDE Chile (SNIT)
La Infraestructura de Datos Geoespaciales de Chile (IDE Chile), dependiente del Ministerio de Bienes Nacionales, establece el **Perfil Nacional de Metadatos de Chile**, fundamentado en la norma **ISO 19115:2003 / ISO 19115-1:2014** y codificado en **ISO 19139 (XML)**.
- **Implementación concreta en el Atlas:** El módulo [`metadatos.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/metadatos.js) genera automáticamente fichas XML con los namespaces `<gmd:MD_Metadata>`, `<gco:CharacterString>`, `<gml:TimePeriod>` y el sistema de referencia oficial SIRGAS-Chile (EPSG:4326 / EPSG:5360), permitiendo que cualquier estudiante u organismo exporte una ficha compatible con catálogos institucionales como GeoNetwork o GeoNode.

### 2.3 Régimen de Licencias y Propiedad Intelectual
- **OpenStreetMap:** Se rige por la licencia **Open Database License (ODbL 1.0)**. La plataforma documenta en cada entidad consultada la atribución requerida (*"© Colaboradores de OpenStreetMap"*).
- **GBIF:** Las observaciones de biodiversidad se licencian individualmente por los publicadores (CC0 1.0, CC-BY 4.0).
- **Código Fuente:** Licenciado bajo **MIT License**, garantizando que sea una herramienta 100% comunitaria, reproducible y sin costo recurrente de mantención.

---

## 3. Evaluación de Calidad de Datos Espaciales (ISO 19157 y Métricas ohsome)

Una de las críticas históricas a la VGI por parte de comités académicos tradicionales es la *incertidumbre sobre la calidad del dato*. El proyecto refuta esta crítica implementando una auditoría cuantitativa en vivo en base al estándar **ISO 19157:2013 (Data Quality)**:

1. **Completitud y Densidad:** El panel `02 / Calidad de Datos (ohsome)` calcula la densidad real de entidades por kilómetro cuadrado sobre el elipsoide WGS84, distinguiendo entre áreas densamente mapeadas (ej. eje Alameda/Brasil) y sectores con vacíos.
2. **Consistencia Temporal y Trazabilidad:** Mediante consultas anualizadas a 5 años en la API de ohsome (HeiGIT / Universidad de Heidelberg), el sistema permite verificar si el área sigue siendo editada activamente o si sufrió abandono cartográfico.
3. **Linaje y Heterogeneidad:** Se expone el número de colaboradores únicos que han intervenido en el cuadrante, diferenciando entre áreas mapeadas por una sola persona y áreas validadas por una comunidad densa.

---

## 4. Decisiones de Arquitectura y Defensa Técnica

Ante la comisión de práctica profesional, cada componente técnico responde a una justificación deliberada:

| Decisión Técnica | Alternativa Descartada | Justificación y Defensa Metodológica |
|---|---|---|
| **Arquitectura de Costo Cero (Static + Serverless + Local Python)** | Backend tradicional con servidor dedicado (Django/Express en VPS de pago) | Un servidor dedicado cuesta entre $5 y $20 USD mensuales y requiere mantenimiento de parches de seguridad. Al optar por Netlify Serverless, GitHub Pages y un servidor local en Python estándar, el costo es estrictamente cero y cualquier estudiante o municipio rural puede levantarlo sin presupuesto informático. |
| **JavaScript Nativo (Vanilla JS) sin frameworks pesados** | React, Angular, Vue | Reduce la barrera de entrada para geógrafos no programadores. Cualquier usuario puede inspeccionar y modificar `mapa.js` o `osm.js` con un simple editor de texto sin instalar Node.js, Webpack ni dependencias NPM efímeras. |
| **Leaflet 1.9.4 con teselas abiertas** | Mapbox GL, Google Maps JavaScript API | No requiere tarjetas de crédito ni tokens que expiren. Utiliza Carto Positron, OSM Estándar y OpenTopoMap libres. |
| **Constructor de Consultas Espaciales Dual** | Búsqueda solo tabular predefinida | Permite que tanto usuarios principiantes (mediante selectores visuales) como geógrafos avanzados (mediante Overpass QL libre) exploren hipótesis espaciales propias y descarguen GeoJSON/CSV. |
| **Respaldo Local Automático (Fallback)** | Bloqueo o error 429 cuando Overpass satura | Si la red pública de Overpass sufre congestión durante una defensa académica, el sistema conmuta automáticamente a los 1.316 registros locales pre-extraídos de Barrio Brasil y UAH. |

---

## 5. Validación Empírica en el Caso Piloto: Barrio Brasil y Campus UAH

Para el polígono de estudio delimitado por las coordenadas WGS84 `[-70.6675, -33.4505, -70.6565, -33.4385]`, se extrajo y validó un universo real de **1.316 entidades geográficas**, categorizadas bajo la taxonomía del Atlas:

- **CAT-01 Educación (137 entidades):** Casas centrales y facultades de la Universidad Alberto Hurtado (calles Almirante Barroso, Cienfuegos, Erasmo Escala), sedes UDP, UTEM, colegios e institutos.
- **CAT-02 Servicios y Comercio (250 entidades):** Comercio de barrio, farmacias, cafés en Av. Brasil y Huérfanos.
- **CAT-03 Movilidad y Transporte (191 entidades):** Estaciones intermodales Metro Los Héroes (L1/L2) y Santa Ana (L2/L5), paraderos del sistema Red Movilidad.
- **CAT-04 Movilidad Activa (11 entidades):** Eje ciclovía Rosas, ciclobanda Brasil, estacionamientos de bicicletas UAH.
- **CAT-05 Áreas Verdes y Plazas (107 entidades):** Plaza Brasil, arbolado y bandejones centrales de la Alameda.
- **CAT-06 Patrimonio y Cultura (45 entidades):** Inmuebles de Conservación Histórica, casonas Zona Típica Barrio Brasil, Basílica del Salvador.
- **CAT-07 Accesibilidad Universal (185 entidades):** Catastro de rebajes de cordón (`kerb`), cruces peatonales accesibles y condiciones de vereda.
- **CAT-08 Biodiversidad Urbana (390 entidades):** Catastro del arbolado urbano OSM cruzado con registros de avifauna y flora de GBIF / iNaturalist.

---

## 6. Respuestas a Preguntas Críticas del Comité Académico

### P1: *"¿Por qué confiar en datos de voluntarios si el Estado tiene datos oficiales?"*
> **Respuesta:** No se trata de reemplazar la cartografía oficial, sino de complementarla en escalas y temáticas donde el Estado no llega a tiempo. El catálogo de IDE Chile no cuenta con un catastro actualizado a nivel de calle de la accesibilidad universal para personas en silla de ruedas o de la ubicación exacta de biciestacionamientos en la manzana universitaria. La VGI llena ese vacío y, gracias a nuestras herramientas de calidad y metadatos ISO 19139, se puede evaluar objetivamente el nivel de confianza de cada capa antes de usarla en un informe.

### P2: *"¿Cómo se garantiza la reproducibilidad de la plataforma en otros territorios?"*
> **Respuesta:** Toda la configuración territorial está desacoplada en `config/config.json`. Si otra universidad o municipalidad (por ejemplo, en Valparaíso o Concepción) desea implementar su propio Atlas VGI, únicamente debe cambiar cuatro números de Bbox en el JSON, sin tocar una sola línea de código JavaScript o Python.

### P3: *"¿Qué ocurre si la plataforma se queda sin conexión a internet en terreno o en una exposición?"*
> **Respuesta:** La plataforma cuenta con una triple capa de resiliencia: (1) servidor backend local en Python (`backend/servidor_vgi.py`) que funciona sin conexión con caché en disco, (2) catálogo local pre-extraído en `data/` para Barrio Brasil / UAH con 1.316 entidades, y (3) exportación a GeoJSON y CSV directamente utilizables de forma offline en QGIS.
