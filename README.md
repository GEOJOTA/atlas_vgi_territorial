# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
### Nodo GeoAbierto — Caso Piloto: Barrio Brasil · Universidad Alberto Hurtado (Santiago, Chile)

Prototipo de plataforma web de código abierto para consultar, evaluar, visualizar y documentar **Información Geográfica Voluntaria (VGI)** en el territorio de Barrio Brasil. Desarrollado como producto de práctica profesional de la carrera de Geografía de la Universidad Alberto Hurtado (2026), en el marco de un proyecto de investigación Fondecyt Regular sobre VGI y gestión territorial.

Integra un **visor cartográfico interactivo 2D de alta resolución (Leaflet 1.9.4)**, métricas de calidad de datos (ohsome API / Índice de Calidad VGI), evaluación normativa territorial (PRC Santiago / OGUC), 27 capas oficiales del Estado (MINVU GeoIDE, IDE Chile, SUBDERE) y exportación a GeoJSON, CSV, metadatos ISO 19115 y Excel.

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

## 4. Las 8 categorías temáticas VGI

Basadas en las taxonomías de **OpenStreetMap** y **GBIF Darwin Core**:

| Cód. | Categoría | Fuente OSM / GBIF | Relevancia Barrio Brasil |
|---|---|---|---|
| CAT-01 | Educación y Universidad | `amenity=university\|school\|library` | Campus UAH, facultades, colegios |
| CAT-02 | Servicios y Comercio | `shop=*`, `amenity=cafe\|pharmacy\|bank` | Comercio local Av. Brasil, Huérfanos |
| CAT-03 | Movilidad y Transporte | `railway=station`, `highway=bus_stop` | Metro Los Héroes, Santa Ana, paraderos |
| CAT-04 | Movilidad Activa | `highway=cycleway`, `amenity=bicycle_parking` | Ciclovía Rosas, ciclobanda Brasil |
| CAT-05 | Áreas Verdes y Espacio Público | `leisure=park\|playground`, `landuse=grass` | Plaza Brasil, bandejones Alameda |
| CAT-06 | Patrimonio y Cultura | `historic=*`, `heritage=*` | Zona Típica, Basílica del Salvador, UAH |
| CAT-07 | Accesibilidad Universal | `kerb=*`, `wheelchair=*` | Rebajes de cordón, veredas accesibles |
| CAT-08 | Biodiversidad Urbana | `natural=tree` + GBIF Occurrence API | Arbolado viario, avifauna (iNaturalist) |

---

## 5. Capas oficiales del Estado integradas (27 capas)

Descargadas desde **MINVU GeoIDE**, **IDE Chile** y **SUBDERE**, incluyendo: PRC Santiago, PRMS, límite urbano, campamentos MINVU 2024, condominios sociales, humedales (Ley 21.202), parques urbanos, patrimonio, sitios de memoria (CMN), educación, salud, Metro, red ferroviaria y ciclovías (Ley 21.088).

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
│   ├── data/                   # 27 capas GeoJSON (VGI + oficiales)
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
