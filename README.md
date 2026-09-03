# Atlas de Información Geográfica Voluntaria para la Gestión Territorial
### Nodo GeoAbierto — Caso Piloto: Barrio Brasil y Universidad Alberto Hurtado (Santiago Centro, Chile)

Plataforma web de código abierto y flujo de datos reproducible para consultar, evaluar y documentar datos geoespaciales de fuentes colaborativas (OpenStreetMap, GBIF, ohsome, UMap) con visor cartográfico interactivo, taxonomía de 8 categorías territoriales, métricas de calidad y metadatos bajo el estándar ISO 19115 e ISO 19139 (Perfil Nacional IDE Chile).

Nace en el marco de la práctica profesional de geografía (2026), pensada para que cualquier persona técnica (geógrafos, analistas SIG) o no técnica (gestores municipales, organizaciones comunitarias, colectivos de mapeo) pueda consultar, descargar y auditar datos de Información Geográfica Voluntaria (VGI) sin costo de licencias ni servidores dedicados.

---

## 1. Por qué existe

Cuando una institución pública, una universidad o un municipio quiere usar datos colaborativos como OpenStreetMap, GBIF o UMap para un diagnóstico urbano, normalmente enfrenta tres problemas:

1. **Dispersión y heterogeneidad:** Los datos están dispersos en distintas APIs, con sintaxis disímiles y sin normalización de atributos.
2. **Incertidumbre de calidad:** Es difícil saber si el área está completa o abandonada (¿cuántos colaboradores han editado?, ¿cuál es la densidad de equipamientos?, ¿cuándo fue la última actualización?).
3. **Falta de interoperabilidad oficial:** Los datos casi nunca cuentan con fichas de metadatos compatibles con el estándar oficial de la Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT / ISO 19115/19139).

El **Atlas VGI** resuelve esto integrando consulta espacial, visor cartográfico interactivo, métricas de calidad y exportación directa tanto a formatos SIG (GeoJSON, CSV) como a metadatos XML y hojas de cálculo Excel (.xlsx).

---

## 2. Territorio Piloto: Barrio Brasil y Universidad Alberto Hurtado

El proyecto se encuentra preconfigurado en el sector patrimonial y universitario de **Barrio Brasil**, Santiago Centro:
- **Bounding Box predeterminado:** `[-70.6675, -33.4505, -70.6565, -33.4385]` (WGS84).
- **Cobertura urbana:** Campus patrimonial UAH (calles Almirante Barroso, Erasmo Escala, Cienfuegos, Los Héroes), eje Alameda Bernardo O'Higgins, estaciones de metro Los Héroes y Santa Ana, ciclovías estructurantes y entorno tradicional de Plaza Brasil.

---

## 3. Las 8 Categorías Temáticas VGI

La plataforma organiza la información en 8 categorías esenciales para la gestión urbana y universitaria:

| Cód. | Categoría Temática | Etiquetas OSM / Fuente | Relevancia Barrio Brasil / UAH |
|---|---|---|---|
| **CAT-01** | Educación y Universidad | `amenity=university\|college\|library\|school` | Campus Central UAH, facultades, bibliotecas, auditorios |
| **CAT-02** | Servicios y Comercio | `shop=*`, `amenity=cafe\|restaurant\|bank\|pharmacy` | Comercio local en Av. Brasil, Huérfanos y farmacias |
| **CAT-03** | Movilidad y Transporte | `railway=station`, `highway=bus_stop` | Metro Los Héroes (L1/L2), Santa Ana (L2/L5), paraderos Red |
| **CAT-04** | Movilidad Activa | `highway=cycleway`, `amenity=bicycle_parking` | Ciclovía calle Rosas, ciclobanda Brasil, biciestacionamientos |
| **CAT-05** | Áreas Verdes y Plazas | `leisure=park\|playground`, `landuse=grass` | Plaza Brasil, bandejón central de Alameda |
| **CAT-06** | Patrimonio y Cultura | `historic=*`, `heritage=*`, `amenity=theatre` | Zona Típica Barrio Brasil, casonas UAH, Basílica del Salvador |
| **CAT-07** | Accesibilidad Universal | `kerb=*`, `highway=crossing`, `wheelchair=*` | Rebajes de cordón en cruces de Alameda, veredas accesibles |
| **CAT-08** | Biodiversidad Urbana | `natural=tree` + GBIF Occurrence API | Arbolado patrimonial y avistamientos de avifauna/flora |

---

## 4. Documentación Oficial en Excel (.xlsx)

En la carpeta `docs/` se encuentran tres libros de cálculo formalmente estructurados para la práctica:

1. **`docs/catalogo_fuentes_vgi.xlsx`**: Inventario sistemático de fuentes (OpenStreetMap, ohsome, GBIF, UMap, iNaturalist, IDE Chile) con cobertura, escala, licencia y utilidad.
2. **`docs/perfil_metadatos_vgi.xlsx`**: Perfil de metadatos ISO 19115 / IDE Chile con elementos núcleo, tipos de datos y mapeo al estándar SNIT.
3. **`docs/categorias_tematicas_osm.xlsx`**: Taxonomía de las 8 categorías, filtros Overpass QL y diccionario de datos normalizado.

---

## 5. Estructura del Repositorio

```
nodo-geoabierto/
├── README.md                      Documentación general del proyecto
├── MANUAL_USO.md                  Manual de uso para personas técnicas y no técnicas
├── TODO_SIGUIENTE_IA.md            Bitácora de continuidad y entregas de turno
├── config/
│   └── config.json                Configuración territorial, categorías y endpoints
├── docs/
│   ├── ARQUITECTURA.md            Decisiones técnicas y diseño de la solución
│   ├── catalogo_fuentes_vgi.xlsx  Catálogo de fuentes VGI en Excel
│   ├── perfil_metadatos_vgi.xlsx  Perfil ISO 19115 / IDE Chile en Excel
│   └── categorias_tematicas_osm.xlsx Taxonomía OSM y diccionario de datos en Excel
├── scripts/
│   ├── generar_catalogos_excel.py Generador de las hojas Excel con openpyxl
│   ├── extractor_vgi.py           CLI en Python para descarga y normalización territorial
│   └── deploy_git.sh              Automatización de control de versiones Git
├── data/                          Archivos GeoJSON normalizados y resumen CSV
├── src/
│   ├── index.html                 Interfaz web del Atlas (sin frameworks pesados)
│   ├── css/estilos.css            Hoja de estilos (estética carta topográfica / libreta de campo)
│   ├── config/config.json         Copia sincronizada de configuración para despliegues
│   └── js/
│       ├── app.js                 Orquestador de eventos y vistas
│       ├── config.js              Cargador multiruta resiliente de configuración
│       └── modulos/
│           ├── mapa.js            Visor cartográfico interactivo Leaflet 1.9.4
│           ├── osm.js             Consultas Overpass QL con servidores espejo
│           ├── ohsome.js          Métricas de calidad y evolución temporal (HeiGIT)
│           ├── gbif.js            Registros de biodiversidad y ciencia ciudadana
│           ├── umap.js            Embebido y descarga de proyectos UMap
│           ├── metadatos.js       Generador dual ISO 19115 (JSON) e ISO 19139 (XML)
│           └── licencias.js       Panel de licencias abiertas y acceso a documentos
├── netlify/functions/             Funciones serverless (esqueleto OAuth OSM)
└── netlify.toml                   Configuración de despliegue en Netlify
```

---

## 6. Cómo levantarlo en local

Solo requiere un navegador web y un servidor HTTP local básico (para evitar restricciones de CORS locales):

```bash
cd "/Users/geojplescano/Programas/Práctica profesional 2026 S2/nodo-geoabierto/src"
python3 -m http.server 8000
# Abrir en el navegador: http://localhost:8000
```

### Para extraer datos directamente por terminal (Python):
```bash
# Descargar todas las capas de Barrio Brasil / UAH en data/
python3 scripts/extractor_vgi.py --categoria todas

# Descargar solo educación
python3 scripts/extractor_vgi.py --categoria educacion
```

---

## 7. Despliegue y Control de Versiones Git

El proyecto cuenta con el script automatizado `scripts/deploy_git.sh`:
```bash
./scripts/deploy_git.sh
```
Configura el autor oficial (`GEOJOTA <juanpablolescanovillegas@gmail.com>`), consolida los cambios en la rama `main` y deja preparado el flujo para subir a GitHub (`https://github.com/GEOJOTA/nodo-geoabierto.git`) o Netlify.

---

## 8. Licencia

- **Código fuente:** MIT License.
- **Datos geoespaciales:** Mantienen la licencia de su fuente de origen: OpenStreetMap es **ODbL 1.0** (© colaboradores de OpenStreetMap); registros de GBIF según publicador (**CC0**, **CC-BY 4.0**); capas IDE Chile bajo **Datos Abiertos del Estado de Chile**.
