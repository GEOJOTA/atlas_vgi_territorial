# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
### Nodo GeoAbierto — Caso Piloto: Barrio Brasil · Universidad Alberto Hurtado (Santiago, Chile)

Prototipo de plataforma web de código abierto para consultar, evaluar, visualizar y documentar **Información Geográfica Voluntaria (VGI)** en el territorio de Barrio Brasil. Desarrollado como producto de práctica profesional de la carrera de Geografía de la Universidad Alberto Hurtado (2026), en el marco de un proyecto de investigación Fondecyt Regular sobre VGI y gestión territorial.

Integra un **visor cartográfico interactivo 2D de alta resolución (Leaflet 1.9.4)**, métricas de calidad de datos (ohsome API / Índice de Calidad VGI), evaluación normativa territorial (PRC Santiago / OGUC), **101 capas cartográficas integradas** (10 categorías maestras VGI, 17 capas base territoriales y 74 capas oficiales del Estado de Chile desde GEOMOP, MINVU, Geoportal, DGA, DIFROL, MINAGRI, BiDat y CNE) y exportación a GeoJSON, CSV, metadatos ISO 19115 y catálogos Excel.

> **Sin API keys requeridas.** Toda la funcionalidad opera con CDN públicos y APIs abiertas (OpenStreetMap, GBIF, ohsome, IDE Chile).

---

## 1. Contexto y motivación

Cuando una institución pública, organización comunitaria o voluntario quiere usar datos colaborativos como OpenStreetMap o GBIF para un diagnóstico urbano local, normalmente enfrenta tres problemas:

1. **Dispersión y heterogeneidad:** APIs con sintaxis disímiles y sin normalización de atributos.
2. **Incertidumbre de calidad:** ¿Cuántos colaboradores han editado? ¿Cuándo fue la última actualización? ¿Cómo distinguir datos confiables?
3. **Falta de interoperabilidad oficial:** Los datos casi nunca tienen metadatos compatibles con el estándar IDE Chile (ISO 19115 / ISO 19139).

El **Atlas VGI** resuelve esto integrando consulta espacial, visor cartográfico interactivo, métricas de calidad, evaluación normativa territorial y exportación estructurada.

---

## 2. Territorio piloto

**Barrio Brasil**, Santiago Centro (EPSG:4326):
- **Bounding Box:** `[-70.6675, -33.4505, -70.6565, -33.4385]`
- Campus UAH (Almirante Barroso, Erasmo Escala, Cienfuegos), Plaza Brasil, eje Alameda, Metro Los Héroes (L1/L2) y Santa Ana (L2/L5).

---

## 3. Usuarios de la plataforma

| Tipo | Ejemplos |
|---|---|
| Organizaciones comunitarias / JJVV | JJVV Brasil, Santa Ana, Capuchinos, Ambrosio O'Higgins |
| Voluntarios / productores VGI | Colaboradores OSM activos en el área |
| Instituciones / autoridades | Municipalidad de Santiago, SECPLAN, SEREMI MINVU RM |
| ONGs / Fundaciones | TECHO-Chile, SUR, MapBiomas Chile, Fundación TERRAM |

---

## 4. Las 10 categorías maestras VGI

Estandarizadas bajo las taxonomías de **OpenStreetMap**, **GBIF Darwin Core** y el estándar **ISO 19110 / ISO 19115**:

| Cód. | Categoría Maestra | Fuente OSM / GBIF | Enfoque Territorial Barrio Brasil |
|---|---|---|---|
| **CAT-01** | Educación y Universidad | `amenity=university\|college\|school\|library` | Campus patrimonial UAH (Almirante Barroso, Erasmo Escala), facultades, institutos, colegios, liceos y bibliotecas |
| **CAT-02** | Servicios, Comercio y Salud Barrial | `shop=*`, `amenity=pharmacy\|clinic\|doctors\|cafe\|bank` | Comercio de proximidad Av. Brasil/Huérfanos, farmacias, CESFAM N° 5, clínicas comunitarias, amasanderías y bancos |
| **CAT-03** | Movilidad y Transporte Público | `railway=station\|subway_entrance`, `highway=bus_stop` | Red Movilidad, paraderos de buses, estaciones de Metro Los Héroes (L1/L2), Santa Ana (L2/L5), Cumming (L5) y corredores viales |
| **CAT-04** | Movilidad Activa y Ciclovías | `highway=cycleway`, `amenity=bicycle_parking\|bicycle_rental` | Ciclovías segregadas Rosas y Brasil, ciclobandas, estacionamientos de bicicletas públicos/UAH, arriendo y talleres |
| **CAT-05** | Áreas Verdes, Deporte y Espacio Público | `leisure=park\|playground\|pitch`, `landuse=grass` | Plaza Brasil, bandejones arbolados Alameda, canchas comunitarias, juegos infantiles, bancos y bebederos públicos |
| **CAT-06** | Patrimonio Histórico y Cultura | `historic=*`, `heritage=*`, `amenity=arts_centre\|theatre` | Zona Típica Barrio Brasil, Inmuebles de Conservación Histórica (ICH), Basílica del Salvador, Casonas UAH, museos y memoriales |
| **CAT-07** | Accesibilidad Universal y Caminabilidad | `kerb=*`, `wheelchair=*`, `tactile_paving=*`, `highway=crossing` | Vados peatonales y rebajes de solera D.S. 50 MINVU, baldosas táctiles podotáctiles, pasos cebra demarcados y rampas peatonales |
| **CAT-08** | Biodiversidad Urbana y Arbolado | `natural=tree\|tree_row\|wood` + GBIF Occurrence API | Arbolado viario de alineación (plátano oriental, jacarandá, quillay), plazas, jardines y registros de avifauna y flora de ciencia ciudadana |
| **CAT-09** | Edificaciones y Huella Urbana | `way["building"]`, `relation["building"]` | Catastro poligonal de edificaciones, huellas de manzanas, volumetría construida y cálculo de superficie métrica en m² (EPSG:32719) |
| **CAT-10** | Coberturas y Usos de Suelo | `landuse=*`, `natural=*`, `leisure=*` | Zonificación funcional del suelo urbano (residencial, comercial, dotacional, recreativo) y superficies biofísicas según PRC Santiago |

---

## 5. Capas oficiales del Estado de Chile integradas (74 capas BBDD + 27 base = 101 capas)

Integración cartográfica fidedigna de las **74 capas oficiales de la Administración del Estado de Chile** catalogadas desde la base de datos oficial (`BBDD.xlsx`), amparadas por la **Ley N° 20.285 de Transparencia y Acceso a la Información Pública**:

1. **Ministerio de Obras Públicas (MOP / GEOMOP / DGA / Vialidad / DIRPLAN):**
   - Proyectos Mandatados, Red Vial Nacional, Red Hidrométrica BNA, Contratos Concesionados, Contratos MOP, Red Fluviométrica, Estaciones Meteorológicas DGA, Estaciones Sedimentométricas, Estaciones de Calidad de Aguas Superficiales, Cuencas Banco Nacional de Aguas e Índice de Calidad de Aguas (ICA).
2. **Ministerio de Vivienda y Urbanismo (MINVU / IDE Minvu / Geoportal 35406):**
   - Predios urbanos oficiales (MINVU / Geoportal 35406, 2.500 polígonos parcelarios reales en Santiago Centro), Áreas Funcionales Urbanas (AFU 2026), Zonificación Térmica, Cités y Pasajes residenciales, Secretarías Regionales Ministeriales (SEREMIs), Oficinas SERVIU, Continuo de Construcciones Urbanas (CCU) e Instrumentos de Planificación Territorial (PRC Santiago y PRMS).
3. **Dirección Nacional de Fronteras y Límites del Estado (DIFROL / MINREL):**
   - Pasos Fronterizos oficiales (82 pasos internacionales terrestres de Chile con Argentina, Perú y Bolivia) y Delimitación de Faja y Zona Fronteriza de Seguridad (DFL N° 4 de 1967).
4. **Geoportal de Chile e IDE Chile (Organismos Sectoriales):**
   - Juzgados de Familia (PJUD), Antenas en Servicio Ley de Torres (SUBTEL), Sedes Municipales (SUBDERE), Cuarteles y Plan Cuadrante (Carabineros de Chile), Cuerpos de Bomberos, Jardines Infantiles (JUNJI y Fundación Integra), Establecimientos de Educación Escolar, Parvularia y Superior (MINEDUC), Establecimientos de Salud y Territorios Sanitarios (MINSAL / DEIS), Centros de la Mujer (SERNAMEG), Ferias Libres (ODEPA), Sitios Prioritarios y Calidad del Aire SINCA (MMA), Circuitos Turísticos (SERNATUR), División Política Administrativa (DPA 2023), Certificación Ambiental Municipal (SCAM), Nivel de Erosión (CIREN), Zonas Climáticas Köppen-Geiger y Curvas de Nivel topográficas cada 10m (IGM).
5. **Ministerio de Agricultura (MINAGRI / CONAF / SAG / ODEPA / CNR / INFOR / FIA):**
   - Sistema Nacional de Áreas Silvestres Protegidas del Estado (SNASPE CONAF), Viveros certificados SAG, Estaciones Meteorológicas Automáticas (FIA), Industria Forestal Primaria (INFOR), Mercados Mayoristas de Abasto (ODEPA), Cobertura Nacional de Canales de Riego (CNR), Catastro de Recursos Vegetacionales, Cambio de Uso de la Tierra (2001-2023), Cubierta Frutal CIREN 2025 y Carbono Orgánico del Suelo (0-5, 5-15, 15-30 cm).
6. **Ministerio de Desarrollo Social y Familia (BiDat / RSH / Subsecretaría de Evaluación Social):**
   - Unidades Vecinales Oficiales 2026 (Ley N° 19.418), Índice Global de Vulnerabilidad Socioterritorial (IGVUST 2026), Banco Integrado de Proyectos (BIP Inversiones Públicas 2019-2027), y 8 indicadores sociodemográficos vecinales del Registro Social de Hogares (dependencia funcional, cuidados, estratificación socioeconómica por tramos CSE 40%, niñez, mujeres jefas de hogar, personas mayores y formalidad laboral).
7. **Ministerio de Energía / Comisión Nacional de Energía (CNE / IDE Energía):**
   - Centrales de Generación Eléctrica, Subestaciones y Líneas de Transmisión Eléctrica de alta tensión del Sistema Eléctrico Nacional (SEN).

---

## 6. Módulos y características

| Módulo | Descripción |
|---|---|
| **Visor Cartográfico** | Leaflet 1.9.4 + OpenStreetMap; activación interactiva por categoría VGI y capas oficiales IDE Chile, popups con atributos, cita APA y zoom automático |
| **Calidad VGI** | ohsome API v1/v2: completitud, evolución temporal P1Y, densidad espacial, OQT Score, contribuyentes activos; OSMCha para integridad de changesets |
| **Índice de Calidad VGI (ICV)** | Score compuesto por categoría: completitud + actualidad + consistencia geométrica + densidad |
| **CIN-VGI (normativa)** | Inspector territorial por clic: PRC Santiago, usos permitidos/prohibidos (Art. 2.1.24 OGUC), riesgos (Art. 2.1.17 OGUC), patrimonio; exporta certificado .txt con disclaimer legal (Art. 116 LGUC) |
| **Importador de capas** | KMZ, KML, GeoJSON, GPX, CSV con detección automática de coordenadas y auditoría normativa directa |
| **Metadatos ISO 19115** | Fichas por capa, exportables a XML y Excel |

---

## 7. Estructura del repositorio

```
atlas_vgi_uah/
├── src/
│   ├── index.html              # Aplicación principal (no requiere build)
│   ├── css/estilos.css         # Estilos (paleta de alto contraste, accesible WCAG AAA, diseño limpio)
│   ├── js/
│   │   ├── app.js              # Controlador principal
│   │   └── modulos/
│   │       ├── mapa.js         # Visor 2D Leaflet
│   │       ├── ohsome.js       # Métricas calidad VGI (ohsome API)
│   │       ├── calidad_analyst.js  # ICV e inspector changesets
│   │       ├── evaluador_normativo.js  # CIN-VGI / PRC / OGUC
│   │       ├── importador_capas.js # Importador multi-formato
│   │       ├── gbif.js         # Biodiversidad (GBIF API)
│   │       ├── osm.js          # Overpass API
│   │       ├── ide_chile.js    # Capas MINVU GeoIDE / IDE Chile
│   │       └── metadatos.js    # ISO 19115
│   ├── data/                   # 101 capas GeoJSON (10 VGI + 17 base + 74 oficiales Estado)
│   ├── config/config.json      # Categorías, metadatos, bbox
│   └── docs/                   # Catálogos Excel y documentación
├── backend/servidor_vgi.py     # Proxy Flask para ohsome (opcional)
├── netlify/functions/          # Serverless (Netlify deploy)
├── scripts/
│   ├── extractor_vgi.py        # Descarga OSM/GBIF
│   ├── descargar_capas_normativas_ide.py
│   └── generar_catalogos_excel.py
└── .github/workflows/deploy.yml
```

---

## 8. Arranque rápido

```bash
# Clonar
git clone https://github.com/GEOJOTA/atlas_vgi_uah.git
cd atlas_vgi_uah

# Opción A: abrir directamente (no requiere npm ni build)
open src/index.html

# Opción B: servidor local simple
python3 -m http.server 8080 --directory src
# → http://localhost:8080

# Opción C: backend proxy ohsome (opcional, resuelve CORS)
pip install flask flask-cors requests
python backend/servidor_vgi.py
# → http://localhost:5050
```

**Variables de entorno opcionales (`.env`)** — solo para ohsome API v2 (la v1 es acceso libre):
```
HEIGIT_API_KEY=tu_clave_opcional
```

---

## 9. Fuentes de datos y licencias

| Fuente | Licencia | Uso |
|---|---|---|
| OpenStreetMap | ODbL 1.0 (© colaboradores OSM) | Capas VGI temáticas |
| GBIF | CC-BY 4.0 / CC0 | Biodiversidad urbana (CAT-08) |
| MINVU GeoIDE | Datos Públicos del Estado (Ley 20.285) | IPT, campamentos, ciclovías |
| IDE Chile / SUBDERE | Datos Públicos del Estado | DPA, límites urbanos |
| INE Censo 2024 | Datos Públicos del Estado | Manzanas censales |
| CMN | Datos Públicos del Estado | Sitios de Memoria |

---

## 10. Cita académica

```
Lescano, J.P. (2026). Atlas de Información Geográfica Voluntaria para la Gestión
Territorial — Caso Piloto Barrio Brasil. Práctica Profesional, Carrera de
Geografía, Universidad Alberto Hurtado.
https://github.com/GEOJOTA/atlas_vgi_uah
```

_Marco: Proyecto Fondecyt Regular — Investigador responsable: Manuel Fuenzalida (UAH)_

---

*Datos VGI actualizados en tiempo real desde OpenStreetMap Overpass API. Capas oficiales descargadas septiembre 2026.*
