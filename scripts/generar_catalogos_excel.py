#!/usr/bin/env python3
"""
generar_catalogos_excel.py
--------------------------
Genera los tres documentos Excel (.xlsx) estructurados para la práctica profesional:
1. docs/catalogo_fuentes_vgi.xlsx
2. docs/perfil_metadatos_vgi.xlsx
3. docs/categorias_tematicas_osm.xlsx
"""

import os
import shutil
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "docs")
SRC_DOCS_DIR = os.path.join(BASE_DIR, "src", "docs")
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(SRC_DOCS_DIR, exist_ok=True)

# Paleta editorial: carta topográfica / institucional
COLOR_MUSGO = "2C4238"
COLOR_CABECERA = "3F5D4E"
COLOR_ZEBRA = "F4F0E4"
COLOR_BLANCO = "FFFFFF"
COLOR_BORDE = "C9BFA0"

fuente_titulo = Font(name="Arial", size=14, bold=True, color=COLOR_MUSGO)
fuente_subtitulo = Font(name="Arial", size=10, italic=True, color="555555")
fuente_cabecera = Font(name="Arial", size=11, bold=True, color=COLOR_BLANCO)
fuente_dato = Font(name="Arial", size=10)
fuente_codigo = Font(name="Courier New", size=9)

fill_cabecera = PatternFill(start_color=COLOR_CABECERA, end_color=COLOR_CABECERA, fill_type="solid")
fill_zebra = PatternFill(start_color=COLOR_ZEBRA, end_color=COLOR_ZEBRA, fill_type="solid")

borde_fino = Border(
    left=Side(style="thin", color=COLOR_BORDE),
    right=Side(style="thin", color=COLOR_BORDE),
    top=Side(style="thin", color=COLOR_BORDE),
    bottom=Side(style="thin", color=COLOR_BORDE)
)

def autoajustar_columnas(ws, max_len_cap=55):
    for col in ws.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = 0
        for cell in col:
            val = str(cell.value or "")
            lineas = val.split("\n")
            len_linea = max(len(l) for l in lineas) if lineas else 0
            if len_linea > max_len:
                max_len = len_linea
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), max_len_cap)

def crear_catalogo_fuentes():
    wb = openpyxl.Workbook()
    
    # ----------------------------------------------------
    # HOJA 1: Catálogo Fuentes VGI
    # ----------------------------------------------------
    ws1 = wb.active
    ws1.title = "Catálogo Fuentes VGI"
    
    ws1["A1"] = "ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA (VGI) — GESTIÓN TERRITORIAL"
    ws1["A1"].font = fuente_titulo
    ws1["A2"] = "Catálogo Sistemático de Fuentes de Datos Colaborativos, APIs y Servicios Abiertos | Cobertura Nacional y Escala Barrial"
    ws1["A2"].font = fuente_subtitulo
    
    headers1 = [
        "Fuente / Servicio", "Tipo de Dato", "Cobertura Espacial", "Cobertura Temporal",
        "Frecuencia Actualización", "Escala / Nivel Detalle", "Licencia de Uso",
        "Protocolo / API de Acceso", "Utilidad en Gestión Territorial",
        "Limitaciones Conocidas", "Ejemplo Territorial (Barrio Brasil / Regiones)"
    ]
    
    for c_idx, h in enumerate(headers1, 1):
        cell = ws1.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws1.row_dimensions[4].height = 28
    ws1.freeze_panes = "A5"
    
    filas_fuentes = [
        [
            "OpenStreetMap (OSM) / Overpass API",
            "Vectorial (puntos, líneas, polígonos con atributos semánticos)",
            "Global / Nacional (Chile) / Barrial y Comunal",
            "2004 – Presente (en tiempo real)",
            "Continua (minuto a minuto por colaboradores)",
            "Detalle catastral / escala 1:500 a 1:5.000",
            "Open Database License (ODbL) 1.0",
            "Overpass API (QL) / OSM API 0.6 / Balanceo en 4 servidores espejo",
            "Catastro exhaustivo de equipamiento comunitario, accesibilidad peatonal, trazado vial, ciclovías y arbolado.",
            "Heterogeneidad en completitud semántica entre comunas centrales y rurales.",
            "Pabellones UAH (Almirante Barroso/Erasmo Escala), paraderos Alameda, locales de Barrio Brasil, ciclovías de Rosas."
        ],
        [
            "ohsome API v1 & v2 (HeiGIT)",
            "Estadísticas espacio-temporales agregadas y series históricas OLAP",
            "Global / Cuadrantes definidos por Bbox o límites administrativos",
            "2007 – 2026 (historial completo de cambios)",
            "Mensual / Sincronizado periódicamente con OSHDB",
            "Agregado a nivel de polígono, cuadrante o comuna",
            "Derivada ODbL (datos OSM subyacentes) / Acceso Abierto HeiGIT",
            "REST API v1 y v2 (/elements/count, /users/count, /elements/length, /elements/area)",
            "Monitoreo de la dinámica de mapeo, madurez del catastro y recuento de colaboradores activos a lo largo del tiempo.",
            "Depende del retardo de ingestión de los extracts globales (toTimestamp).",
            "Curva acumulativa de crecimiento de edificaciones y colaboradores únicos en la manzana UAH últimos 10 años."
        ],
        [
            "ohsome Quality Analyst - OQT (HeiGIT)",
            "Métricas e indicadores intrínsecos de calidad espacial (ISO 19157:2013)",
            "Global / Cuadrantes urbanos y periurbanos",
            "Historial comparativo multianual (2015 – 2026)",
            "Bajo demanda / En tiempo real",
            "Barrial, distrital o comunal",
            "Acceso Abierto para investigación territorial",
            "REST API OQT (/indicators/mapping-saturation, /indicators/attribute-completeness)",
            "Evaluación intrínseca de calidad: cálculo del índice de saturación de mapeo y completitud de atributos clave.",
            "Sensibilidad al tamaño muestral en áreas rurales de baja densidad de ediciones.",
            "Determinación de la fase de consolidación vs expansión dinámica en Barrio Brasil y Santiago Centro."
        ],
        [
            "OSM Changesets API v0.6 (OSMF)",
            "Metadatos de transacciones espaciales (conjuntos de cambios / ediciones)",
            "Global / Bounding box territorial acotado",
            "2005 – Presente (tiempo real)",
            "En vivo (transaccional al instante de cada subida)",
            "Primitiva geográfica puntual o vectorial modificada",
            "Open Database License (ODbL) 1.0",
            "REST XML/JSON API v0.6 (api.openstreetmap.org/api/0.6/changesets)",
            "Auditoría y fiscalización de micro-contribuciones recientes, trazabilidad de autores y detección de anomalías.",
            "Requiere limitar la ventana espacial para evitar sobrecarga en servidores centrales de OSM.",
            "Inspección de las últimas 25 ediciones espaciales en el perímetro Barrio Brasil / UAH."
        ],
        [
            "OSMCha (Mapbox / Development Seed / Comunidad)",
            "Plataforma de validación forense, control de calidad y detección de vandalismo",
            "Global / Filtro por usuario, changeset o Bbox",
            "2015 – Presente",
            "Continua y sincronizada",
            "Nivel de nodo, vía o relación",
            "Código abierto (BSD-2-Clause) / Datos ODbL",
            "REST API v1 (osmcha.org/api/v1/) y visor web interactivo",
            "Revisión visual comparativa (antes/después) de cambios territoriales y validación colaborativa.",
            "Operaciones avanzadas de marcado requieren autenticación OAuth de OpenStreetMap.",
            "Auditoría directa con 1 clic desde el Atlas para verificar cambios comunitarios en el sector."
        ],
        [
            "Taginfo API v4 (OSMF & Geofabrik)",
            "Estadísticas de uso global y nacional de etiquetas, claves, valores y roles",
            "Global e instancia nacional Chile (south-america:chile)",
            "Base de datos consolidada (extracto planetario diario)",
            "Diaria (medianoche UTC)",
            "Esquema de base de datos / Nivel de etiqueta",
            "ODbL 1.0 / CC-BY-SA 2.0",
            "REST API v4 (taginfo.openstreetmap.org/api/4/tag/stats)",
            "Validación de la legitimidad, difusión y consistencia de claves OSM antes de formular consultas territoriales.",
            "Reporta distribución estadística global/nacional; no provee desglose sub-comunal directo.",
            "Telemetría en tiempo real del uso de amenity=university y kerb=lowered en el panel de consultas."
        ],
        [
            "GBIF (Global Biodiversity Information Facility)",
            "Registros biológicos puntuales georreferenciados bajo estándar Darwin Core",
            "Global / Chile / Bbox de cuadrantes urbanos y rurales",
            "Histórica (siglo XIX) – Presente (iNaturalist)",
            "Diaria / Semanal",
            "Puntual con radio de incertidumbre métrica y banderas de calidad científica",
            "CC0, CC-BY 4.0, CC-BY-NC 4.0 según publicador",
            "Occurrence REST API v1 (/occurrence/search) y Species Suggest API (/species/suggest)",
            "Diagnóstico de biodiversidad urbana, avifauna en plazas, corredores biológicos y arbolado nativo.",
            "Sesgo hacia especies carismáticas y áreas con mayor flujo peatonal (parques y reservas).",
            "Avistamientos de avifauna (chincol, zorzal, tórtola) y especies botánicas en Plaza Brasil y campus UAH."
        ],
        [
            "UMap (OpenStreetMap / Framasoft)",
            "Cartografía temática participativa en capas GeoJSON con simbología enriquecida",
            "Instancias locales / umap.openstreetmap.fr",
            "Según ciclo de vida del proyecto comunitario",
            "Esporádica (definida por el autor del mapa)",
            "Barrial / Comunal / Regional",
            "Declarada por el autor del proyecto (usualmente CC-BY / ODbL)",
            "Embebido iframe / Descarga directa GeoJSON",
            "Integración de iniciativas ciudadanas previas (rutas patrimoniales, catastros comunitarios de arbolado).",
            "Inexistencia de API centralizada estandarizada; posibles restricciones CORS en clientes externos.",
            "Mapas colaborativos de casonas patrimoniales y circuitos culturales de Barrio Brasil."
        ],
        [
            "iNaturalist / Red de Ciencia Ciudadana",
            "Observaciones fotográficas validadas por comunidad (Grado de Investigación)",
            "Nacional / Urbano y Rural (Chile)",
            "2015 – Presente",
            "Tiempo real / Continua",
            "Puntos con precisión GPS de teléfonos inteligentes",
            "Creative Commons (CC-BY, CC-BY-NC)",
            "API iNaturalist v1 (api.inaturalist.org/v1/) / Sincronizado vía GBIF",
            "Identificación comunitaria de especies arbóreas, avifauna e insectos polinizadores en plazas y campus.",
            "Menor cobertura en espacios privados o interiores de manzana sin acceso público.",
            "Registro de flora nativa (peumo, quillay, palma chilena) e introducida en jardines de Cienfuegos y Plaza Brasil."
        ],
        [
            "Mapillary / KartaView",
            "Imágenes colaborativas a nivel de calle para reconocimiento de terreno y mobiliario urbano",
            "Global / Urbano y Rural (Chile)",
            "2014 – Presente",
            "Continua por mapeadores móviles y ciclistas",
            "Nivel de calle / submétrico con estimación de orientación de compás",
            "Creative Commons (CC-BY-SA 4.0) / ODbL",
            "API Mapillary v4 / Visores web integrados",
            "Verificación visual de fachadas, señalética, accesibilidad universal y comercio barrial.",
            "Requiere filtrado por secuencias y fecha para evitar imágenes desactualizadas.",
            "Imágenes a nivel de calle en ejes viales principales de Barrio Brasil (Av. Brasil, Alameda)."
        ],
        [
            "IDE Chile / SNIT (Referencia Oficial)",
            "Capas vectoriales e información geográfica oficial del Estado de Chile",
            "Nacional / Regional / Comunal",
            "Oficial / Censal (Censos 2017, 2024; catastros vigentes)",
            "Anual / Semestral por ministerios y servicios públicos",
            "1:1.000 a 1:250.000",
            "Datos Abiertos del Estado / Ley N° 20.285 de Transparencia",
            "Estándares OGC: WMS, WFS, CSW (Catálogo Nacional de Metadatos)",
            "Línea base oficial para contrastar completitud de la VGI (validación cruzada de colegios, salud y vialidad).",
            "Actualización lenta comparada con la dinámica de la VGI en terreno; ausencia de micro-datos barriales.",
            "Límite comunal de Santiago, zonificación PRC Santiago, colegios MINEDUC y red asistencial MINSAL."
        ]
    ]
    
    for r_idx, fila in enumerate(filas_fuentes, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(fila, 1):
            cell = ws1.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws1.row_dimensions[r_idx].height = 55
    autoajustar_columnas(ws1, max_len_cap=35)
    
    # ----------------------------------------------------
    # HOJA 2: Inventario de APIs y Endpoints Técnicos
    # ----------------------------------------------------
    ws2 = wb.create_sheet(title="Inventario APIs y Endpoints")
    ws2["A1"] = "INVENTARIO TÉCNICO DE APIS, PROTOCOLOS Y SERVICIOS WEB INTEGRADOS"
    ws2["A1"].font = fuente_titulo
    ws2["A2"] = "Especificación de Endpoints, Métodos HTTP, Formatos y Cuotas para la Gestión Territorial del Atlas VGI"
    ws2["A2"].font = fuente_subtitulo
    
    headers2 = [
        "API / Servicio", "Organización Custodia", "Versión", "Endpoint Base / URL Oficial",
        "Método HTTP", "Formato de Datos", "Parámetros Clave (Query / Body)",
        "Límites / Cuotas de Uso", "Módulo Cliente en Atlas", "Función Territorial",
        "Trazabilidad / Documentación Oficial (APA)"
    ]
    
    for c_idx, h in enumerate(headers2, 1):
        cell = ws2.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws2.row_dimensions[4].height = 28
    ws2.freeze_panes = "A5"
    
    filas_apis = [
        [
            "Overpass API",
            "OpenStreetMap Foundation (OSMF)",
            "0.7.62+",
            "https://overpass-api.de/api/interpreter / https://overpass.openstreetmap.fr/api/interpreter",
            "POST / GET",
            "JSON (Overpass JSON) / GeoJSON",
            "data=[out:json][timeout:35];(node...;way...;rel...;);out geom tags qt 400;",
            "2 slots concurrentes por IP; timeout 25-180s; balanceo automático en 4 servidores espejo",
            "src/js/modulos/osm.js (ModuloOSM)",
            "Extracción vectorial en vivo de equipamientos, vías, ciclovías, áreas verdes y arbolado",
            "OSMF. (2023). Overpass API Reference Manual. https://wiki.openstreetmap.org/wiki/Overpass_API"
        ],
        [
            "ohsome API",
            "Heidelberg Institute for Geoinformation Technology (HeiGIT)",
            "v1 / v2",
            "https://api.ohsome.org/v1/ / https://api.ohsome.org/v2/",
            "GET / POST",
            "JSON (GeoJSON para geometrías agregadas)",
            "bboxes=-70.6720,-33.4505,-70.6580,-33.4350&time=2015-01-01/2026-01-01/P1Y&filter=...",
            "Sin clave requerida en v1; v2 soporta API Key para mayor concurrencia y analítica avanzada",
            "src/js/modulos/ohsome.js (ModuloOhsome)",
            "Cálculo multitemporal de saturación de mapeo, evolución de atributos y recuento de colaboradores",
            "HeiGIT. (2023). ohsome API Documentation (v1 & v2). https://api.ohsome.org/"
        ],
        [
            "ohsome Quality Analyst (OQT)",
            "Heidelberg Institute for Geoinformation Technology (HeiGIT)",
            "v1 (Framework)",
            "https://dashboard.ohsome.org/ (backend oqtApi)",
            "POST / GET",
            "JSON",
            "topic=building-count&indicators=mapping-saturation,currentness,attribute-completeness&bbox=...",
            "Servicio público académico para control de calidad espacial conforme a ISO 19157",
            "src/js/modulos/calidad_analyst.js (ModuloCalidadAnalyst)",
            "Evaluación intrínseca de calidad cartográfica y modelado de saturación de contribuciones",
            "Herfort, L., et al. (2023). A framework for intrinsic quality assessment of OpenStreetMap data."
        ],
        [
            "OSM Changesets API",
            "OpenStreetMap Foundation (OSMF)",
            "0.6",
            "https://api.openstreetmap.org/api/0.6/changesets",
            "GET",
            "XML / JSON",
            "bbox=-70.6720,-33.4505,-70.6580,-33.4350&closed=true",
            "Límite razonable de tasa de peticiones; uso de User-Agent descriptivo obligatorio",
            "src/js/modulos/calidad_analyst.js (ModuloCalidadAnalyst)",
            "Auditoría de micro-contribuciones recientes y monitoreo de actividad comunitaria en Barrio Brasil",
            "OSMF. (2024). OSM API 0.6 Documentation. https://wiki.openstreetmap.org/wiki/API_v0.6"
        ],
        [
            "OSMCha API",
            "Mapbox / Development Seed / Comunidad OSM",
            "v1",
            "https://osmcha.org/api/v1/changesets/",
            "GET",
            "JSON",
            "in_bbox=-70.6720,-33.4505,-70.6580,-33.4350&page=1",
            "Público para lectura; requiere token de autorización para validación/marcado de cambios",
            "src/js/modulos/calidad_analyst.js (ModuloCalidadAnalyst)",
            "Inspección forense visual de ediciones territoriales y detección de anomalías cartográficas",
            "Wille, L., et al. (2023). OSMCha: Changeset Analyzer and Quality Validation Tool. https://osmcha.org/"
        ],
        [
            "Taginfo API",
            "OpenStreetMap Foundation & Geofabrik GmbH",
            "v4",
            "https://taginfo.openstreetmap.org/api/4/ / https://taginfo.geofabrik.de/south-america:chile",
            "GET",
            "JSON",
            "/api/4/tag/stats?key=amenity&value=university / /api/4/key/values?key=amenity",
            "Acceso público abierto; política de rate limit cortés (máx. 10 req/s)",
            "src/js/modulos/taginfo.js (ModuloTaginfo)",
            "Telemetría en tiempo real del uso, frecuencia y consistencia de etiquetas OSM a nivel global y Chile",
            "OSMF & Geofabrik. (2024). Taginfo API v4 Documentation. https://taginfo.openstreetmap.org/taginfo/apidoc"
        ],
        [
            "GBIF Occurrence API",
            "Global Biodiversity Information Facility (GBIF)",
            "v1",
            "https://api.gbif.org/v1/occurrence/search",
            "GET",
            "JSON (Darwin Core Archive)",
            "decimalLatitude=-33.4505,-33.4350&decimalLongitude=-70.6720,-70.6580&hasCoordinate=true&limit=100",
            "Acceso libre sin clave; límite recomendado de 100 registros por llamada síncrona en cliente",
            "src/js/modulos/gbif.js (ModuloGBIF)",
            "Descarga de ocurrencias biológicas de avifauna, flora urbana y arbolado patrimonial georreferenciado",
            "GBIF Secretariat. (2024). GBIF Occurrence API Reference. https://www.gbif.org/developer/summary"
        ],
        [
            "GBIF Species Suggest API",
            "Global Biodiversity Information Facility (GBIF)",
            "v1",
            "https://api.gbif.org/v1/species/suggest",
            "GET",
            "JSON",
            "q=Platanus&limit=8",
            "Público, optimizado para autocompletado reactivo en tiempo real en interfaces web",
            "src/js/modulos/gbif.js (ModuloGBIF)",
            "Autocompletado taxonómico en vivo y resolución de nombres científicos en el buscador biológico",
            "GBIF Secretariat. (2024). GBIF Species API Reference. https://www.gbif.org/developer/species"
        ],

        [
            "UMap Export Service",
            "OpenStreetMap / Framasoft",
            "v1 (REST / GeoJSON)",
            "https://umap.openstreetmap.fr/es/map/{map_id}/geojson/",
            "GET",
            "GeoJSON (FeatureCollection)",
            "map_id={id_mapa}&data_type=geojson",
            "Sujeto a cabeceras CORS del servidor de instancia; enlace directo y embebido iframe",
            "src/js/modulos/umap.js (ModuloUMap)",
            "Visualización e integración de proyectos cartográficos comunitarios y rutas patrimoniales previas",
            "Framasoft & OSM Community. (2023). UMap User Guide. https://wiki.openstreetmap.org/wiki/UMap"
        ],
        [
            "iNaturalist API",
            "California Academy of Sciences & National Geographic",
            "v1",
            "https://api.inaturalist.org/v1/observations",
            "GET",
            "JSON",
            "nelat=-33.4350&nelng=-70.6580&swlat=-33.4505&swlng=-70.6720&quality_grade=research",
            "Máximo 10.000 peticiones por día; 1 petición por segundo recomendada",
            "Vía GBIF Occurrence / Módulo GBIF",
            "Validación comunitaria de registros biológicos con fotografía e identificación por consenso",
            "iNaturalist. (2024). iNaturalist API Reference (v1). https://api.inaturalist.org/v1/docs/"
        ],
        [
            "IDE Chile OGC Services (SNIT)",
            "Ministerio de Bienes Nacionales (Gobierno de Chile)",
            "WMS 1.3.0 / WFS 2.0.0 / CSW 2.0.2",
            "https://www.ide.cl/ / Geoportal Nacional",
            "GET (KVP / XML)",
            "GML / GeoJSON / Shapefile (ZIP) / XML CSW",
            "SERVICE=WFS&REQUEST=GetFeature&TYPENAME=ide:establecimientos_salud&OUTPUTFORMAT=application/json",
            "Acceso público bajo política de datos abiertos del Estado de Chile",
            "Referencia Metodológica y Homologación en src/js/modulos/diccionario.js",
            "Capa de referencia oficial para validación cruzada y contraste de brechas de información VGI",
            "IDE Chile / SNIT. (2024). Catálogo Nacional de Features. https://www.ide.cl/documentos/catalogo-nacional-de-features.pdf"
        ],
        [
            "ArcGIS FeatureServer INE / IDE Chile (Censo 2024)",
            "Instituto Nacional de Estadísticas (INE) / IDE Chile",
            "REST FeatureServer 10.91",
            "https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/CPV2024_Microdato_gdb/FeatureServer/7",
            "GET (REST Query)",
            "GeoJSON (FeatureCollection)",
            "where=1=1&geometry={bbox}&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*&f=geojson",
            "Acceso abierto sin clave API; microdatos georreferenciados a nivel de manzana censal",
            "src/js/modulos/ide_chile.js (ModuloIDEChile)",
            "Carga y visualización en vivo de las 351 manzanas censales de Barrio Brasil con población total, hombres, mujeres y viviendas",
            "INE. (2024). Censo de Población y Vivienda 2024: Microdatos Georreferenciados. https://services5.arcgis.com"
        ],
        [
            "ArcGIS FeatureServer & WMS MINVU (GeoIDE)",
            "Ministerio de Vivienda y Urbanismo (MINVU / DDU)",
            "REST MapServer / FeatureServer / WMS 1.3.0",
            "https://geoide.minvu.cl/server/rest/services/",
            "GET (REST Query & WMS GetMap)",
            "GeoJSON & PNG Tiles",
            "query?where=1=1&geometry={bbox}&f=geojson | WMSServer?request=GetMap&layers=0,1",
            "Acceso abierto institucional conforme a la Ley N° 20.285 de Transparencia de la Administración del Estado",
            "src/js/modulos/ide_chile.js (ModuloIDEChile)",
            "Catastro oficial de Patrimonio IPT (571 entidades), Parques Urbanos (9 plazas), Barrios Históricos y teselas raster WMS",
            "MINVU. (2024). Plataforma GeoIDE MINVU: Servicios Geográficos Interoperables. https://geoide.minvu.cl"
        ],
        [
            "MINVU Instrumentos de Planificación Territorial (IPT FeatureServer)",
            "Ministerio de Vivienda y Urbanismo (MINVU / DDU / SEREMI RM)",
            "REST MapServer / FeatureServer",
            "https://geoide.minvu.cl/server/rest/services/IPT/",
            "GET (REST Query)",
            "GeoJSON (FeatureCollection)",
            "query?where=1=1&outFields=*&f=geojson",
            "Acceso abierto institucional amparado por Ley N° 20.285 y regulado por la Ley General de Urbanismo y Construcciones (LGUC / OGUC)",
            "src/data/ide_minvu_ipt_*.geojson & src/js/modulos/ide_chile.js",
            "Zonificación PRC Santiago (192 zonas), PRMS Usos Metropolitanos (65 polígonos), Áreas Verdes IPT (308 polígonos), Áreas de Riesgo (13 zonas), Fajas de Resguardo (46 líneas) y Límite Urbano Oficial",
            "MINVU. (2024). Catastro Nacional de Instrumentos de Planificación Territorial y Normativa Urbanística Oficial. División de Desarrollo Urbano, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/"
        ],
        [
            "Geoportal de Chile (Descargas Masivas Shapefile / GeoJSON)",
            "Infraestructura de Datos Geoespaciales de Chile (IDE Chile)",
            "Catálogo CKAN / CSW / WMS",
            "https://www.geoportal.cl/geoportal/catalog/download/ | https://datos.gob.cl",
            "GET (Download)",
            "Shapefile (ZIP) / GeoJSON / CSV Georreferenciado",
            "download/{uuid}",
            "Licencia de Datos Abiertos del Estado de Chile",
            "src/data/ide_*.geojson & src/js/modulos/ide_chile.js",
            "Integración y descarga masiva de 27 conjuntos oficiales del Estado con más de 6.000 entidades (Campamentos 2024, Condominios Sociales, Humedales Ley 21.202, UV RSH, PRMS Riesgos, DPA SUBDERE, Ciclovías, Educación, Salud, Bomberos, Metro, EFE, CMN, Normativa IPT)",
            "IDE Chile. (2024). Geoportal de Chile: Catálogo Nacional de Información Geoespacial Abierta. https://www.geoportal.cl"
        ],
        [
            "Módulo de Evaluación y Consulta Normativa Territorial (CIN-VGI)",
            "Atlas VGI UAH / MINVU / DDU / Municipalidad de Santiago",
            "Motor Espacial JavaScript / Point-in-Polygon",
            "https://geoide.minvu.cl/server/rest/services/IPT/",
            "Auditoría Espacial & Evaluación Cruzada VGI vs IPT",
            "Reporte Ficha HUD, GeoJSON y Certificado TXT (.txt)",
            "consultarPuntoNormativo(lat, lng) & evaluarCompatibilidadVGI()",
            "Software libre y código abierto bajo licencia AGPL-3.0; datos abiertos Ley N° 20.285",
            "src/js/modulos/evaluador_normativo.js (ModuloEvaluadorNormativo)",
            "Inspector interactivo por clic para auditar zonificación PRC Santiago (UPERM/UPROH), límite urbano, áreas de riesgo (Art. 2.1.17 OGUC), áreas verdes normadas y emisión de Certificados de Informaciones Normativas VGI (CIN-VGI)",
            "Lescano, J. P. (2026). Motor de Evaluación Espacial Normativa y Certificación Territorial VGI. Universidad Alberto Hurtado."
        ],
        [
            "Globe.gl (Motor 3D WebGL / Three.js)",
            "Vasturiano / Three.js Community",
            "2.46.2",
            "https://unpkg.com/globe.gl@2.46.2/dist/globe.gl.min.js",
            "Client-side WebGL Canvas",
            "Renderizado 3D esférico interactivo",
            "Globe()(element).polygonsData(...).pathsData(...).pointsData(...)",
            "Código abierto 100% libre bajo licencia MIT; sin claves ni costos",
            "src/js/modulos/globo.js (ModuloGlobo)",
            "Perspectiva esférica 3D del globo terráqueo completo con proyección simultánea de capas VGI y oficiales IDE en 2D sin alturas artificiales",
            "Vasturiano. (2024). Globe.gl: 3D Globe Data Visualization. https://globe.gl/"
        ]
    ]
    
    for r_idx, fila in enumerate(filas_apis, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(fila, 1):
            cell = ws2.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws2.row_dimensions[r_idx].height = 55
    autoajustar_columnas(ws2, max_len_cap=40)
    
    ruta_salida = os.path.join(DOCS_DIR, "catalogo_fuentes_vgi.xlsx")
    wb.save(ruta_salida)
    print(f"[+] Generado: {ruta_salida}")
    ruta_src = os.path.join(SRC_DOCS_DIR, "catalogo_fuentes_vgi.xlsx")
    shutil.copyfile(ruta_salida, ruta_src)
    print(f"[+] Sincronizado para descarga web: {ruta_src}")
def crear_perfil_metadatos():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Perfil Metadatos ISO 19115"
    
    ws["A1"] = "PERFIL DE METADATOS PARA DATOS GEOGRÁFICOS VOLUNTARIOS (VGI)"
    ws["A1"].font = fuente_titulo
    ws["A2"] = "Basado en ISO 19115-1:2014, ISO 19139 y Perfil Nacional de Metadatos IDE Chile (SNIT)"
    ws["A2"].font = fuente_subtitulo
    
    headers = [
        "N°", "Elemento ISO 19115", "Nombre en Español", "Obligatoriedad",
        "Tipo de Dato", "Equivalencia IDE Chile / SNIT", "Descripción del Campo",
        "Ejemplo en Plataforma (Barrio Brasil - UAH)"
    ]
    
    for c_idx, h in enumerate(headers, 1):
        cell = ws.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws.row_dimensions[4].height = 28
    
    elementos = [
        [
            1, "MD_Metadata.fileIdentifier", "Identificador del Metadato", "Obligatorio (M)",
            "UUID / Carácter", "Identificador Único", "Identificador único global de la ficha de metadato.",
            "urn:uuid:vgi-cl-stgo-uah-2026-001"
        ],
        [
            2, "MD_Metadata.language", "Idioma del Metadato", "Obligatorio (M)",
            "Codest / spa", "Idioma de Metadatos", "Idioma en el que están redactados los metadatos.",
            "spa (Español)"
        ],
        [
            3, "MD_Metadata.characterSet", "Juego de Caracteres", "Obligatorio (M)",
            "Codest / utf8", "Codificación de Caracteres", "Juego de caracteres utilizado en el archivo.",
            "utf8"
        ],
        [
            4, "MD_DataIdentification.citation.title", "Título del Recurso", "Obligatorio (M)",
            "Carácter", "Título del Recurso", "Nombre oficial o descriptivo del conjunto de datos territoriales.",
            "Catastro VGI de Equipamiento Universitario y Urbano: Barrio Brasil - Universidad Alberto Hurtado"
        ],
        [
            5, "MD_DataIdentification.abstract", "Resumen / Abstract", "Obligatorio (M)",
            "Texto libre", "Resumen", "Descripción clara y detallada del contenido del conjunto de datos.",
            "Capa de infraestructura educativa, movilidad, espacio público y comercio obtenida vía Overpass API..."
        ],
        [
            6, "EX_GeographicBoundingBox.westBoundLongitude", "Extensión Oeste (Longitud Min)", "Obligatorio (M)",
            "Decimal (EPSG:4326)", "Límite Oeste", "Límite occidental del área geográfica en grados decimales.",
            "-70.6675"
        ],
        [
            7, "EX_GeographicBoundingBox.eastBoundLongitude", "Extensión Este (Longitud Max)", "Obligatorio (M)",
            "Decimal (EPSG:4326)", "Límite Este", "Límite oriental del área geográfica en grados decimales.",
            "-70.6565"
        ],
        [
            8, "EX_GeographicBoundingBox.southBoundLatitude", "Extensión Sur (Latitud Min)", "Obligatorio (M)",
            "Decimal (EPSG:4326)", "Límite Sur", "Límite meridional del área geográfica en grados decimales.",
            "-33.4505"
        ],
        [
            9, "EX_GeographicBoundingBox.northBoundLatitude", "Extensión Norte (Latitud Max)", "Obligatorio (M)",
            "Decimal (EPSG:4326)", "Límite Norte", "Límite septentrional del área geográfica en grados decimales.",
            "-33.4385"
        ],
        [
            10, "MD_ReferenceSystem.referenceSystemIdentifier", "Sistema de Referencia Espacial", "Obligatorio (M)",
            "Código EPSG", "Sistema de Coordenadas", "Código oficial del sistema de referencia de coordenadas.",
            "EPSG:4326 (WGS84) / Compatible con EPSG:5361 (SIRGAS-Chile)"
        ],
        [
            11, "LI_Lineage.statement", "Linaje y Trazabilidad", "Condicional (C)",
            "Texto libre", "Historia / Linaje", "Descripción del proceso de captura, consultas a APIs y filtros empleados.",
            "Extraído de OpenStreetMap vía Overpass API el 2026-09-03, complementado con ocurrencias de GBIF."
        ],
        [
            12, "MD_Constraints.useLimitation", "Restricciones de Uso y Licencia", "Obligatorio (M)",
            "Texto libre", "Restricciones Legales", "Declaración explícita de derechos de autor y licencias de distribución.",
            "ODbL 1.0 (OpenStreetMap contributors) para datos vectoriales; CC-BY para observaciones biológicas."
        ],
        [
            13, "CI_ResponsibleParty.organisationName", "Organización Responsable", "Obligatorio (M)",
            "Carácter", "Punto de Contacto", "Nombre de la institución o colectivo a cargo del recurso.",
            "Práctica Profesional Geografía 2026 — Nodo GeoAbierto / UAH"
        ],
        [
            14, "CI_ResponsibleParty.electronicMailAddress", "Correo Electrónico de Contacto", "Obligatorio (M)",
            "Correo válido", "Correo de Contacto", "Canal formal para consultas sobre el recurso.",
            "juanpablolescanovillegas@gmail.com"
        ],
        [
            15, "DQ_Completeness.quantitativeResult", "Indicador de Completitud VGI", "Opcional (O)",
            "Numérico / Razón", "Calidad de Datos", "Evaluación cuantitativa del volumen y actualidad de los datos.",
            "Densidad calculada vía ohsome: 285 elem/km²; 16 colaboradores en el último año."
        ]
    ]
    
    for r_idx, elem in enumerate(elementos, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(elem, 1):
            cell = ws.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx == 2 else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws.row_dimensions[r_idx].height = 42
        
    autoajustar_columnas(ws, max_len_cap=35)
    
    ruta_salida = os.path.join(DOCS_DIR, "perfil_metadatos_vgi.xlsx")
    wb.save(ruta_salida)
    print(f"[+] Generado: {ruta_salida}")

def crear_categorias_tematicas_osm():
    wb = openpyxl.Workbook()
    
    # ----------------------------------------------------
    # HOJA 1: Categorías Maestras OSM (Chile)
    # ----------------------------------------------------
    ws1 = wb.active
    ws1.title = "Categorías Maestras (Chile)"
    
    ws1["A1"] = "TAXONOMÍA Y CATEGORÍAS TEMÁTICAS VGI BASADAS EN OPENSTREETMAP (CHILE)"
    ws1["A1"].font = fuente_titulo
    ws1["A2"] = "Estructura de Extracción y Normalización Territorial | Foco: Barrio Brasil y Entorno Universidad Alberto Hurtado"
    ws1["A2"].font = fuente_subtitulo
    
    headers1 = [
        "Cód.", "Categoría Temática", "Subcategorías y Alcance Territorial en Chile",
        "Etiquetas OSM Principales (Key=Value)", "Tipo Geometría",
        "Filtro Overpass QL Sugerido", "Frecuencia y Relevancia en Chile (Taginfo)",
        "Organismo Rector / Contraparte Estatal", "Aplicación Territorial (Barrio Brasil / UAH)",
        "Cita Bibliográfica Abreviada (APA 7ª ed.)"
    ]
    
    for c_idx, h in enumerate(headers1, 1):
        cell = ws1.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws1.row_dimensions[4].height = 30
    ws1.freeze_panes = "A5"
    
    categorias_maestras = [
        [
            "CAT-01",
            "Educación, Universidades e Investigación",
            "Universidades públicas y privadas, institutos profesionales (IP), centros de formación técnica (CFT), liceos emblemáticos, colegios básicos, jardines infantiles (JUNJI, Integra), bibliotecas universitarias y públicas.",
            "amenity=university, amenity=college, amenity=school, amenity=kindergarten, amenity=library, building=university, building=school",
            "Puntos, Polígonos",
            'nwr["amenity"~"university|college|school|kindergarten|library"]({{bbox}});',
            "Muy Alta (>15.000 entidades educativas en Chile según Taginfo y MINEDUC)",
            "Ministerio de Educación (MINEDUC), Superintendencia de Educación Superior, JUNJI, Fundación Integra",
            "Campus Central y Facultades UAH (Almirante Barroso, Cienfuegos, Erasmo Escala), Casa Central UDP, USACH, Liceo Amunátegui.",
            "(MINEDUC, 2023; IDE Chile / SNIT, 2024; WikiProject Chile, 2024)"
        ],
        [
            "CAT-02",
            "Salud, Comercio y Servicios de Proximidad",
            "Red asistencial pública (Hospitales, CESFAM, CECOSF, SAPU), farmacias de cadena y populares/comunales, panaderías y amasanderías de barrio, almacenes de abarrotes, ferias libres, bancos, sucursales públicas y restaurantes tradicionales.",
            "amenity=clinic, amenity=hospital, amenity=pharmacy, shop=bakery, shop=convenience, shop=supermarket, amenity=marketplace, amenity=bank, amenity=cafe, amenity=restaurant",
            "Puntos, Polígonos",
            'nwr["amenity"~"clinic|hospital|pharmacy|bank|marketplace|restaurant|cafe"]({{bbox}}); nwr["shop"~"bakery|convenience|supermarket"]({{bbox}});',
            "Muy Alta (>80.000 comercios y servicios registrados en Taginfo Chile)",
            "Ministerio de Salud (MINSAL), FONASA, SERCOTEC, I. Municipalidad de Santiago",
            "Hospital San Juan de Dios, Posta Central, CESFAM N° 1, farmacias en Alameda y Av. Brasil, panaderías en Huérfanos y Maturana.",
            "(MINSAL, 2023; INE, 2021; SERCOTEC, 2022)"
        ],
        [
            "CAT-03",
            "Movilidad y Transporte Público Metropolitano",
            "Red Metro de Santiago (estaciones, bocas de acceso, andenes), paraderos y corredores de buses Red Movilidad (ex Transantiago), terminales de buses interurbanos, puntos de recarga bip!, líneas férreas de cercanías.",
            "railway=station, railway=subway_entrance, station=subway, highway=bus_stop, public_transport=platform, amenity=bus_station, vending=public_transport_tickets",
            "Puntos, Líneas",
            'node["railway"="station"]({{bbox}}); node["railway"="subway_entrance"]({{bbox}}); node["highway"="bus_stop"]({{bbox}}); way["railway"="subway"]({{bbox}});',
            "Muy Alta (>25.000 paradas Red y 143 estaciones de Metro activas en RM)",
            "Directorio de Transporte Público Metropolitano (DTPM), Ministerio de Transportes y Telecomunicaciones (MTT), Metro S.A.",
            "Intermodal Metro Los Héroes (L1/L2), Metro Santa Ana (L2/L5), Metro Cumming (L5), paraderos troncales PA347 y PA377 en Alameda y Manuel Rodríguez.",
            "(DTPM & MTT, 2023; Metro de Santiago, 2024; Taginfo Chile, 2026)"
        ],
        [
            "CAT-04",
            "Movilidad Activa y Micromovilidad Urbana",
            "Ciclovías segregadas en calzada y bandejón, ciclobandas, ciclocalles zonificadas, estacionamientos de bicicletas (biciestacionamientos), estaciones de arriendo público (Bike Santiago), tótems de auto-reparación.",
            "highway=cycleway, cycleway=lane|track, amenity=bicycle_parking, amenity=bicycle_rental, amenity=bicycle_repair_station",
            "Líneas, Puntos",
            'way["highway"="cycleway"]({{bbox}}); way["cycleway"]({{bbox}}); node["amenity"~"bicycle_parking|bicycle_rental"]({{bbox}});',
            "Alta (>800 km de ciclovías en Gran Santiago con acelerada expansión post-pandemia)",
            "Ministerio de Vivienda y Urbanismo (MINVU - Manual de Vialidad Cicloinclusiva), MTT, GORE Metropolitano",
            "Ciclovía patrimonial calle Rosas, ciclobanda Av. Brasil, cicloestacionamientos en patios de facultades UAH y salidas de Metro.",
            "(MINVU, 2020; MTT, 2021; WikiProject Chile, 2024)"
        ],
        [
            "CAT-05",
            "Áreas Verdes, Espacio Público y Deporte Comunitario",
            "Parques urbanos metropolitanos y comunales, plazas de barrio, plazoletas, áreas de juegos infantiles modulares, canchas de baby fútbol y multicanchas de juntas de vecinos, plazas activas (máquinas de ejercicios), escaños públicos y bebederos.",
            "leisure=park, leisure=playground, leisure=pitch, leisure=sports_centre, leisure=fitness_station, amenity=bench, landuse=grass",
            "Polígonos, Puntos",
            'way["leisure"~"park|playground|pitch|fitness_station"]({{bbox}}); relation["leisure"="park"]({{bbox}}); node["amenity"="bench"]({{bbox}});',
            "Muy Alta (>12.000 plazas, parques y canchas georreferenciadas en Taginfo Chile)",
            "Ministerio de Vivienda y Urbanismo (MINVU - Política Nacional de Parques Urbanos), Instituto Nacional de Deportes (IND), Municipios",
            "Plaza Brasil (hito central con juegos de Federica Matta), Plaza Manuel Rodríguez, multicancha JJVV Barrio Brasil, bandejón Alameda Bernardo O'Higgins.",
            "(MINVU, 2021; INE, 2017; IDE Chile / SNIT, 2024)"
        ],
        [
            "CAT-06",
            "Patrimonio, Identidad Barrial y Cultura",
            "Inmuebles de Conservación Histórica (ICH), Monumentos Históricos Nacionales (MH), Zonas Típicas (ZT), cités y pasajes patrimoniales, teatros, centros culturales comunitarios, basílicas, templos religiosos y museos.",
            "historic=building, historic=monument, historic=memorial, heritage=*, residential=cite, amenity=arts_centre, amenity=theatre, amenity=place_of_worship, tourism=museum",
            "Polígonos, Puntos",
            'nwr["historic"]({{bbox}}); nwr["heritage"]({{bbox}}); nwr["amenity"~"arts_centre|theatre|place_of_worship"]({{bbox}}); nwr["tourism"="museum"]({{bbox}});',
            "Alta (Alta concentración protegida por Ley N° 17.288 en Santiago Poniente)",
            "Consejo de Monumentos Nacionales (CMN), Ministerio de las Culturas, las Artes y el Patrimonio (MINCAP), Dirección de Obras Municipales (DOM)",
            "Zona Típica Barrio Brasil (Decreto N° 433/1990), Casonas UAH, Basílica del Salvador, Cité Lucrecia Valdés, Galpón Víctor Jara, Museo de la Educación.",
            "(CMN & MINCAP, 2022; Municipalidad de Santiago, 2019; Ley N° 17.288)"
        ],
        [
            "CAT-07",
            "Accesibilidad Universal, Vialidad Peatonal y Cuidado",
            "Rebajes de solera y vados peatonales normados (D.S. 50 MINVU), cruces peatonales demarcados (cebras) y semaforizados, pavimentos podotáctiles de avance y advertencia, semáforos peatonales audibles, rampas fijas y calificación wheelchair.",
            "kerb=lowered|flush, highway=crossing, crossing=marked|traffic_signals, tactile_paving=yes|no, traffic_signals:sound=yes, wheelchair=yes|limited|no, highway=ramp",
            "Puntos, Líneas",
            'node["kerb"~"lowered|flush"]({{bbox}}); node["highway"="crossing"]({{bbox}}); node["traffic_signals:sound"="yes"]({{bbox}}); nwr["wheelchair"~"yes|limited|no"]({{bbox}});',
            "Creciente y Estratégica (Estándar mandatorio según OGUC Art. 2.2.8 en Chile)",
            "Servicio Nacional de la Discapacidad (SENADIS), Ministerio de Vivienda y Urbanismo (MINVU), Ministerio de Desarrollo Social y Familia",
            "Rebajes de cordón en Alameda esquina Cienfuegos y Barroso, accesos a nivel a estaciones Metro Los Héroes y Santa Ana, veredas de manzana UAH.",
            "(MINVU, 2016 [D.S. 50]; SENADIS, 2021; ISO 21542:2021)"
        ],
        [
            "CAT-08",
            "Biodiversidad Urbana y Naturaleza en la Ciudad",
            "Arbolado urbano de alineación y plazas (especies nativas e introducidas frecuentes en la cuenca de Santiago), áreas verdes arboladas, cruces con observaciones biológicas comunitarias de avifauna, flora e insectos polinizadores (GBIF / iNaturalist).",
            "natural=tree, natural=wood, landuse=forest, species=*, genus=*, species:es=* + Darwin Core (GBIF Occurrence)",
            "Puntos, Polígonos",
            'node["natural"="tree"]({{bbox}}); way["natural"="wood"]({{bbox}}); /* + GBIF API Occurrence bbox */',
            "Muy Alta (>300.000 árboles georreferenciados en OSM Chile y >1.5M registros GBIF en Chile)",
            "Corporación Nacional Forestal (CONAF - Arbolado Urbano), Ministerio del Medio Ambiente (MMA), GBIF Chile / Nodo Nacional",
            "Plátanos orientales (Platanus orientalis), jacarandás (Jacaranda mimosifolia), palmas chilenas (Jubaea chilensis), pimientos y quillayes en Av. Brasil y Alameda; avifauna: chincol (Zonotrichia capensis), zorzal (Turdus falcklandii).",
            "(CONAF, 2019; MMA, 2022; GBIF Secretariat, 2024; TDWG, 2023)"
        ],
        [
            "CAT-09",
            "Edificaciones, Huella Urbana y Volumetría",
            "Catastro poligonal exhaustivo de edificaciones: viviendas unifamiliares, edificios residenciales en altura, conjuntos habitacionales, inmuebles comerciales, pabellones universitarios y cívicos, templos religiosos y construcciones auxiliares con cálculo de superficie métrica en m² (EPSG:32719).",
            "building=yes, building=residential, building=apartments, building=house, building=commercial, building=civic, building=school, building=university, building=church, building:levels=*",
            "Polígonos, Puntos",
            'nwr["building"]({{bbox}});',
            "Muy Alta (>4.500.000 huellas de edificios mapeadas en Chile vía OSM y proyectos comunitarios)",
            "Servicio de Impuestos Internos (SII - Catastro de Bienes Raíces), Dirección de Obras Municipales (DOM), IDE Chile / MINVU",
            "Huellas construidas de la manzana UAH (Campus Barroso/Erasmo Escala), casonas patrimoniales de Barrio Brasil, torres residenciales y equipamientos cívicos.",
            "(IDE Chile / SNIT, 2024; SII, 2023; WikiProject Chile, 2024)"
        ],
        [
            "CAT-10",
            "Coberturas de Suelo, Zonificación y Usos del Territorio",
            "Polígonos de zonificación funcional y cobertura biofísica: áreas residenciales, comerciales, dotacionales/educacionales, polígonos recreativos y deportivos, suelos en faena o construcción, césped y áreas de suelo natural o vacante en la trama urbana.",
            "landuse=residential, landuse=commercial, landuse=education, landuse=recreation_ground, landuse=grass, landuse=construction, natural=wood, natural=scrub, surface=asphalt, surface=paving_stones",
            "Polígonos, Líneas",
            'nwr["landuse"]({{bbox}}); nwr["natural"~"wood|scrub|water|grassland"]({{bbox}});',
            "Alta (>500.000 polígonos de zonificación y usos de suelo a nivel nacional en OSM)",
            "Ministerio de Vivienda y Urbanismo (MINVU - Planes Reguladores Comunales e Intercomunales), IDE Chile, I. Municipalidad de Santiago",
            "Zonificación funcional del Campus Universitario UAH, áreas residenciales consolidadas de Barrio Brasil, recintos recreativos de Plaza Brasil y suelos de conservación.",
            "(MINVU, 2017; IDE Chile / SNIT, 2024; OGC, 2023)"
        ]
    ]
    
    for r_idx, cat in enumerate(categorias_maestras, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(cat, 1):
            cell = ws1.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx in (1, 4, 6) else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws1.row_dimensions[r_idx].height = 65
        
    autoajustar_columnas(ws1, max_len_cap=38)
    
    # ----------------------------------------------------
    # HOJA 2: Catálogo de Etiquetas Chile (Tags Específicos)
    # ----------------------------------------------------
    ws2 = wb.create_sheet(title="Catálogo de Etiquetas Chile")
    ws2["A1"] = "CATÁLOGO DE ETIQUETAS OPENSTREETMAP MÁS UTILIZADAS EN CHILE"
    ws2["A1"].font = fuente_titulo
    ws2["A2"] = "Inventario de Entidades, Equivalencias IDE Chile y Trazabilidad de Fuentes Normativas y Comunitarias"
    ws2["A2"].font = fuente_subtitulo
    
    headers2 = [
        "Clave=Valor (OSM Tag)", "Denominación Común en Chile", "Categoría VGI",
        "Geometría Recomendada", "Atributos Complementarios Requeridos",
        "Equivalencia Catálogo Objetos IDE Chile", "Institución / Norma de Referencia en Chile",
        "Frecuencia Relativa en Taginfo Chile", "Ejemplo Concreto (Barrio Brasil / Santiago)",
        "Fuente Oficial / Cita APA"
    ]
    
    for c_idx, h in enumerate(headers2, 1):
        cell = ws2.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws2.row_dimensions[4].height = 30
    ws2.freeze_panes = "A5"
    
    etiquetas_chile = [
        ['amenity=university', 'Campus Universitario / Sede Central', 'CAT-01', 'Node, Way, Relation', 'name, operator, building=university, addr:street', 'Establecimientos de Educación Superior (MINEDUC / IDE Chile)', 'MINEDUC / CRUCH', 'Alta', 'Universidad Alberto Hurtado (Casa Central Barroso 10)', '(MINEDUC, 2023; WikiProject Chile, 2024)'],
        ['amenity=college', 'Instituto Profesional (IP) / Centro Formación Técnica (CFT)', 'CAT-01', 'Node, Way', 'name, operator, college:type', 'Establecimientos de Educación Superior - IP y CFT (MINEDUC / IDE Chile)', 'MINEDUC / Subsecretaría de Educación Superior', 'Alta', 'Sedes de educación técnica en eje Alameda y República', '(MINEDUC, 2023)'],
        ['amenity=school', 'Colegio / Escuela Básica / Liceo Tradicional', 'CAT-01', 'Way, Relation', 'name, operator, school:type, addr:street', 'Establecimientos de Educación Escolar (MINEDUC / IDE Chile)', 'MINEDUC / SLEP Santiago', 'Muy Alta', 'Liceo Miguel Luis Amunátegui / Escuela Rep. de Panamá', '(MINEDUC, 2023; IDE Chile / SNIT, 2024)'],
        ['amenity=kindergarten', 'Jardín Infantil / Sala Cuna (JUNJI / Integra)', 'CAT-01', 'Node, Way', 'name, operator=JUNJI|Fundación Integra', 'Establecimientos de Educación Parvularia (JUNJI - Integra / IDE Chile)', 'Subsecretaría de Educación Parvularia', 'Alta', 'Jardín Infantil Barrial JUNJI calle Cienfuegos', '(JUNJI, 2022; MINEDUC, 2023)'],
        ['amenity=library', 'Biblioteca Pública o Universitaria', 'CAT-01', 'Node, Way', 'name, operator, internet_access=wlan', 'Red de Bibliotecas Públicas (SERPAT / IDE Chile)', 'Servicio Nacional del Patrimonio Cultural (SERPAT)', 'Media', 'Biblioteca Central UAH / Biblioteca de Santiago', '(SERPAT, 2023; UAH, 2023)'],
        ['amenity=student_accommodation', 'Residencia Universitaria / Pensionado Estudiantil', 'CAT-01', 'Node, Way', 'name, operator, building=residential', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINEDUC / Instituciones Universitarias', 'Baja', 'Residencias universitarias en eje Almirante Barroso', '(MINEDUC, 2023)'],
        ['amenity=research_institute', 'Centro de Investigación / Instituto Científico', 'CAT-01', 'Node, Way', 'name, operator, research_institute:field', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Ministerio de Ciencia, Tecnología e Innovación', 'Media', 'Centros de investigación de facultades UAH', '(OECD, 2017; UAH, 2023)'],
        ['amenity=music_school', 'Conservatorio / Academia de Música y Artes', 'CAT-01', 'Node, Way', 'name, operator, subject=music', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINCAP / MINEDUC', 'Baja', 'Academias de música y arte en Barrio Brasil', '(MINCAP, 2022)'],
        ['amenity=clinic', 'CESFAM / CECOSF / Consultorio de Salud Familiar', 'CAT-02', 'Node, Way', 'name, operator=DISAM|Salud Municipal, healthcare=centre', 'Establecimientos de Salud - Atención Primaria CESFAM (DEIS - MINSAL / IDE Chile)', 'MINSAL / FONASA (Modelo Salud Familiar)', 'Alta', 'CESFAM N° 1 Ramón Corbalán Melgarejo', '(MINSAL, 2023; IDE Chile / SNIT, 2024)'],
        ['amenity=hospital', 'Hospital Público / Complejo Hospitalario / Clínica', 'CAT-02', 'Node, Way, Relation', 'name, operator=Servicio de Salud, emergency=yes', 'Establecimientos de Salud - Hospitales (DEIS - MINSAL / IDE Chile)', 'MINSAL / Red Asistencial Pública', 'Alta', 'Hospital San Juan de Dios / Posta Central', '(MINSAL, 2023; IDE Chile / SNIT, 2024)'],
        ['amenity=pharmacy', 'Farmacia de Barrio / Farmacia Comunal Popular', 'CAT-02', 'Node, Way', 'name, dispensing=yes, opening_hours', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINSAL / Instituto de Salud Pública (ISP)', 'Muy Alta', 'Farmacia Popular Comuna de Santiago / Cruz Verde Brasil', '(ISP Chile, 2022; INE, 2021)'],
        ['amenity=dentist', 'Consulta Odontológica / Clínica Dental', 'CAT-02', 'Node', 'name, healthcare=dentist, healthcare:speciality', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINSAL / Colegio de Cirujano Dentistas', 'Media', 'Clínicas odontológicas universitarias en sector República', '(MINSAL, 2023)'],
        ['amenity=veterinary', 'Clínica Veterinaria / Atención de Mascotas', 'CAT-02', 'Node', 'name, healthcare=veterinary, emergency=yes|no', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SUBDERE (Ley N° 21.020 Tenencia Responsable)', 'Media', 'Clínica veterinaria barrial en calle Maturana', '(SUBDERE, 2018)'],
        ['emergency=ambulance_station', 'Base de Ambulancias SAMU (131)', 'CAT-02', 'Node, Way', 'name, operator=SAMU Metropolitano, emergency=ambulance_station', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINSAL / SAMU Metropolitano', 'Baja', 'Base SAMU Poniente en Hospital San Juan de Dios', '(MINSAL, 2023)'],
        ['emergency=defibrillator', 'Desfibrilador Externo Automático (DEA)', 'CAT-02', 'Node', 'emergency=defibrillator, defib:location, indoor=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINSAL (Ley N° 21.156 Desfibriladores Públicos)', 'Baja (en rápido crecimiento)', 'DEA en andenes de Metro Los Héroes y Santa Ana', '(MINSAL, 2019)'],
        ['emergency=fire_hydrant', 'Grifo de Incendio Urbano', 'CAT-02', 'Node', 'fire_hydrant:type=pillar, fire_hydrant:pressure=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Superintendencia de Servicios Sanitarios (SISS) / Bomberos', 'Media', 'Grifo de incendio en Almirante Barroso esq. Alameda', '(Bomberos de Chile, 2022; SISS, 2022)'],
        ['amenity=police', 'Comisaría de Carabineros / Cuartel PDI', 'CAT-02', 'Node, Way', 'name, operator=Carabineros de Chile|PDI', 'Unidades Policiales y Comisarías (Carabineros de Chile / IDE Chile)', 'Ministerio del Interior y Seguridad Pública', 'Alta', '3ª Comisaría de Carabineros de Santiago Centro', '(Ministerio del Interior, 2022; Carabineros, 2023)'],
        ['amenity=fire_station', 'Compañía del Cuerpo de Bomberos de Chile', 'CAT-02', 'Node, Way', 'name, operator=Cuerpo de Bomberos de Santiago', 'Cuarteles de Bomberos (Bomberos de Chile / IDE Chile)', 'Junta Nacional de Cuerpos de Bomberos (Ley 20.564)', 'Alta', '11ª Compañía Pompa Italia (Calle República)', '(Bomberos de Chile, 2022)'],
        ['man_made=surveillance', 'Cámara de Televigilancia Municipal / Seguridad Ciudadana', 'CAT-02', 'Node', 'surveillance:type=camera, camera:mount=pole, operator', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Subsecretaría de Prevención del Delito / Seguridad Vecinal', 'Media', 'Cámaras de televigilancia en esquinas de Plaza Brasil', '(Ministerio del Interior, 2022)'],
        ['amenity=townhall', 'Municipalidad / Edificio Consistorial', 'CAT-02', 'Node, Way', 'name, admin_level=8, operator=Ilustre Municipalidad', 'Edificios Consistoriales Municipales (SUBDERE / IDE Chile)', 'SUBDERE / Municipalidad de Santiago', 'Alta', 'Casa Consistorial / Centro Comunitario Municipal Brasil', '(SUBDERE, 2022)'],
        ['office=government', 'Oficina Pública Estatal (Registro Civil, SII, ChileAtiende)', 'CAT-02', 'Node, Way', 'name, operator=Gobierno de Chile, government', 'Inmuebles Fiscales y Servicios Públicos (Ministerio de Bienes Nacionales / IDE Chile)', 'Ministerio de Justicia / Hacienda / Trabajo', 'Alta', 'Sucursal Registro Civil Santiago Centro / ChileAtiende', '(ChileAtiende, 2023; IDE Chile / SNIT, 2024)'],
        ['amenity=community_centre', 'Sede Social / Junta de Vecinos (JJVV)', 'CAT-02', 'Node, Way', 'name, community_centre=neighbourhood, operator', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SUBDERE / Municipalidad de Santiago', 'Alta', 'Junta de Vecinos Barrio Brasil (calle Huérfanos)', '(INE, 2017; Municipalidad de Santiago, 2021)'],
        ['amenity=post_office', 'Sucursal Postal (CorreosChile, Chilexpress, Starken)', 'CAT-02', 'Node', 'name, brand=CorreosChile|Chilexpress, operator', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Ministerio de Transportes y Telecomunicaciones', 'Alta', 'Sucursal CorreosChile en calle Moneda / Alameda', '(Correos de Chile, 2023)'],
        ['shop=bakery', 'Panadería / Amasandería Tradicional Chilena', 'CAT-02', 'Node, Way', 'name, baked_goods=bread, opening_hours', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERCOTEC / Fomento Productivo Barrial', 'Muy Alta', 'Panadería Las Rosas Chicas / Panadería Brasil', '(SERCOTEC, 2022; INE, 2021)'],
        ['shop=convenience', 'Almacén de Barrio / Minimarket de Abarrotes', 'CAT-02', 'Node', 'name, opening_hours, payment:cash=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERCOTEC / Economía Social Barrial', 'Muy Alta', 'Almacén Don Lucho (calle Cienfuegos)', '(SERCOTEC, 2022; INE, 2021)'],
        ['shop=supermarket', 'Supermercado de Cadena / Autoservicio', 'CAT-02', 'Way, Node', 'name, brand=Lider|Santa Isabel|Unimarc', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Ministerio de Economía / INE', 'Alta', 'Santa Isabel calle Brasil / Lider Express San Pablo', '(INE, 2021; Taginfo Chile, 2026)'],
        ['amenity=marketplace', 'Feria Libre Regulada / Mercado Municipal', 'CAT-02', 'Way, Node', 'name, opening_hours, marketplace=farmers', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'ASOF Chile / I. Municipalidad de Santiago', 'Media', 'Feria Libre calle Esperanza / Mercado Cueto', '(ASOF Chile, 2021; ODEPA, 2022)'],
        ['shop=alcohol', 'Botillería Tradicional con Patente de Alcoholes', 'CAT-02', 'Node', 'name, opening_hours, operator', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Rentas Municipales', 'Alta', 'Botillería Barriocentro en calle Maturana', '(INE, 2021)'],
        ['shop=greengrocer', 'Verdulería / Frutería Local de Barrio', 'CAT-02', 'Node', 'name, produce=fruit;vegetables', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERCOTEC', 'Alta', 'Verdulería tradicional en calle Compañía de Jesús', '(INE, 2021)'],
        ['shop=butcher', 'Carnicería de Barrio', 'CAT-02', 'Node', 'name, butcher=meat', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SEREMI de Salud / ISP', 'Media', 'Carnicería de barrio en calle Huérfanos', '(INE, 2021)'],
        ['shop=hardware', 'Ferretería de Barrio / Cerrajería', 'CAT-02', 'Node', 'name, service=key_cutting', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERCOTEC', 'Alta', 'Ferretería El Candado en calle Rosas', '(INE, 2021)'],
        ['shop=kiosk', 'Quiosco de Diarios, Revistas y Confites', 'CAT-02', 'Node', 'name, kiosk=newspaper, operator', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Sindicato de Suplementeros / Rentas Municipales', 'Alta', 'Quiosco de suplementero en Alameda esq. Almirante Barroso', '(INE, 2021)'],
        ['amenity=bank', 'Sucursal Bancaria (BancoEstado, Santander, etc.)', 'CAT-02', 'Node, Way', 'name, brand=BancoEstado|Santander, atm=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Comisión para el Mercado Financiero (CMF)', 'Alta', 'BancoEstado Sucursal Brasil / Alameda', '(CMF Chile, 2023)'],
        ['amenity=atm', 'Cajero Automático (Redbanc)', 'CAT-02', 'Node', 'operator=Redbanc, indoor=yes|no', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Comisión para el Mercado Financiero (CMF)', 'Muy Alta', 'Cajero Redbanc en estaciones Metro y farmacias', '(CMF Chile, 2023)'],
        ['amenity=cafe', 'Cafetería / Salón de Té Universitario', 'CAT-02', 'Node, Way', 'name, cuisine=coffee_shop, outdoor_seating=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERNATUR / Municipalidad de Santiago', 'Muy Alta', 'Cafés universitarios en Av. Brasil y calle Maturana', '(INE, 2021; SERNATUR, 2022)'],
        ['amenity=restaurant', 'Restaurante / Fuente de Soda / Picada Tradicional', 'CAT-02', 'Node, Way', 'name, cuisine=regional|chilean, delivery=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERNATUR / Ministerio de las Culturas', 'Muy Alta', 'Restaurante El Huaso Enrique / Fuentes de soda Alameda', '(SERNATUR, 2022)'],
        ['amenity=recycling', 'Punto Limpio / Campana de Reciclaje Diferenciado', 'CAT-02', 'Node', 'recycling_type=container, recycling:glass=yes, recycling:plastic=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Ministerio del Medio Ambiente (Ley REP 20.920)', 'Media', 'Campana de reciclaje en Plaza Brasil y patios UAH', '(MMA, 2022; Ley N° 20.920)'],
        ['amenity=waste_basket', 'Basurero Peatonal Urbano de Vereda', 'CAT-02', 'Node', 'waste=trash, material=metal|plastic', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Aseo y Ornato Municipal', 'Media', 'Papeleros peatonales en eje Av. Brasil y Alameda', '(Municipalidad de Santiago, 2021)'],
        ['highway=street_lamp', 'Luminaria Pública / Farol de Alumbrado Urbano', 'CAT-02', 'Node', 'lamp_type=led|high_pressure_sodium, lamp_mount=pole', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Municipalidad de Santiago / Enel', 'Alta', 'Faroles coloniales patrimoniales en Barrio Brasil', '(Municipalidad de Santiago, 2021)'],
        ['railway=station', 'Estación de Metro de Santiago', 'CAT-03', 'Node, Way, Relation', 'name, station=subway, operator=Metro de Santiago', 'Estaciones de Metro y Ferrocarriles (DTPM - Metro S.A. / IDE Chile)', 'Metro de Santiago / MTT / DTPM', 'Alta', 'Estación Los Héroes (L1/L2) y Estación Santa Ana (L2/L5)', '(Metro de Santiago, 2024; DTPM & MTT, 2023)'],
        ['railway=subway_entrance', 'Acceso / Boca de Estación de Metro', 'CAT-03', 'Node', 'subway=yes, wheelchair=yes|no', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Metro S.A.', 'Alta', 'Boca Metro Santa Ana por Manuel Rodríguez / Catedral', '(Metro de Santiago, 2024)'],
        ['highway=bus_stop', 'Paradero de Buses Red Movilidad', 'CAT-03', 'Node', 'name, ref=PA347, operator=Red Movilidad, shelter=yes', 'Paradas de Transporte Público Red Movilidad (DTPM - MTT / IDE Chile)', 'Directorio de Transporte Público Metropolitano (DTPM)', 'Muy Alta', 'Paradero PA347 Alameda esq. Almirante Barroso', '(DTPM & MTT, 2023)'],
        ['public_transport=platform', 'Andén / Plataforma de Parada de Bus', 'CAT-03', 'Way, Node', 'public_transport=platform, bus=yes', 'Paradas de Transporte Público Red Movilidad (DTPM - MTT / IDE Chile)', 'DTPM / MTT', 'Alta', "Andén segregado en corredor Alameda Bernardo O'Higgins", '(DTPM & MTT, 2023)'],
        ['amenity=bus_station', 'Terminal de Buses Interurbanos', 'CAT-03', 'Way, Node', 'name, operator, bus=yes', 'Terminales de Buses Interurbanos (MTT / IDE Chile)', 'MTT / SEREMI de Transportes RM', 'Media', 'Terminal Los Héroes (Tucapel Jiménez)', '(MTT, 2022)'],
        ['vending=public_transport_tickets', 'Tótem / Punto de Carga de Tarjeta bip!', 'CAT-03', 'Node', 'operator=Metro S.A.|Redbanc, payment:bip=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Metro S.A. / DTPM', 'Alta', 'Punto de carga bip! en boletería Metro Los Héroes', '(DTPM & MTT, 2023)'],
        ['railway=subway', 'Trazado Subterráneo de Línea de Metro', 'CAT-03', 'Way', 'tunnel=yes, layer=-2, operator=Metro S.A.', 'Trazados de Líneas de Metro de Santiago (DTPM / IDE Chile)', 'Metro S.A.', 'Alta', 'Trazado Línea 1 bajo eje Alameda / Línea 2 Manuel Rodríguez', '(Metro de Santiago, 2024)'],
        ['amenity=taxi', 'Parada de Taxis Básicos / Colectivos Urbanos', 'CAT-03', 'Node', 'taxi=yes, capacity', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SEREMI de Transportes RM / MTT', 'Media', 'Parada de taxis en Alameda frente a Metro Los Héroes', '(MTT, 2022)'],
        ['highway=cycleway', 'Ciclovía Segregada en Calzada / Bandejón', 'CAT-04', 'Way', 'oneway=yes|no, surface=asphalt, segregated=yes', 'Catastro de Ciclovías Urbanas (SECTRA - MTT / IDE Chile)', 'MINVU (Manual Vialidad Cicloinclusiva) / MTT', 'Muy Alta', 'Ciclovía calle Rosas / Ciclovía Alameda Poniente', '(MINVU, 2020; MTT, 2021)'],
        ['cycleway=lane', 'Ciclobanda Demarcada en Calzada', 'CAT-04', 'Way', 'cycleway:left=lane, cycleway:right=lane', 'Catastro de Ciclovías Urbanas (SECTRA - MTT / IDE Chile)', 'MINVU / Dirección de Tránsito Municipal', 'Alta', 'Ciclobanda en eje Av. Brasil', '(MINVU, 2020)'],
        ['amenity=bicycle_parking', 'Biciestacionamiento / Punto de Anclaje', 'CAT-04', 'Node', 'capacity, bicycle_parking=stands, covered=yes|no', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / DTPM / UAH', 'Alta', 'Biciestacionamientos en patios UAH y exterior Metro', '(MINVU, 2020; UAH, 2023)'],
        ['amenity=bicycle_rental', 'Estación de Bicicletas Públicas Compartidas', 'CAT-04', 'Node', 'network=Bike Santiago|Itaú, capacity', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'GORE Metropolitano / Municipios', 'Alta', 'Estación Bike Santiago en Plaza Brasil', '(GORE RM, 2021)'],
        ['amenity=bicycle_repair_station', 'Tótem de Reparación e Inflado de Bicis', 'CAT-04', 'Node', 'service:bicycle:pump=yes, service:bicycle:tools=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Municipios / Organizaciones Ciclistas', 'Baja', 'Tótem de herramientas en acceso campus UAH', '(WikiProject Chile, 2024)'],
        ['amenity=charging_station', 'Estación de Carga de Vehículos Eléctricos', 'CAT-04', 'Node', 'socket:type2=yes, capacity, brand=Enel X', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Ministerio de Energía / SEC', 'Baja (en alza)', 'Electrolinera de carga rápida en eje Alameda', '(Ministerio de Energía, 2023)'],
        ['highway=living_street', 'Zona Calma / Calle de Coexistencia (Zona 30)', 'CAT-04', 'Way', 'maxspeed=30, surface=paving_stones', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONASET / MINVU', 'Media', 'Calles de velocidad reducida en torno a Plaza Brasil', '(CONASET, 2022; MINVU, 2020)'],
        ['highway=speed_display', 'Radar Pedagógico de Velocidad Vial', 'CAT-04', 'Node', 'traffic_calming=yes, maxspeed', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONASET / Dirección de Tránsito', 'Baja', 'Radar indicador de velocidad en calle Cienfuegos', '(CONASET, 2022)'],
        ['leisure=park', 'Parque Urbano Público / Plaza Barrial', 'CAT-05', 'Way, Relation', 'name, surface=grass, access=yes', 'Catastro de Parques Urbanos (MINVU / IDE Chile)', 'MINVU (Política Nacional de Parques Urbanos)', 'Muy Alta', 'Plaza Brasil (parque barrial estructurante)', '(MINVU, 2021; IDE Chile / SNIT, 2024)'],
        ['leisure=playground', 'Área de Juegos Infantiles Modulares', 'CAT-05', 'Way, Node', 'min_age, max_age, surface=sand|rubber', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / Municipalidad de Santiago', 'Alta', 'Esculturas lúdicas de Federica Matta en Plaza Brasil', '(MINVU, 2021)'],
        ['leisure=pitch', 'Cancha de Baby Fútbol / Multicancha Comunitaria', 'CAT-05', 'Way', 'sport=soccer|basketball, surface=asphalt|concrete', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Instituto Nacional de Deportes (IND)', 'Alta', 'Multicancha deportiva en JJVV Barrio Brasil', '(IND Chile, 2021)'],
        ['leisure=sports_centre', 'Polideportivo Municipal / Complejo Deportivo', 'CAT-05', 'Way, Relation', 'name, operator, sport=multi', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'IND / I. Municipalidad de Santiago', 'Media', 'Polideportivo Comunal Santiago Centro', '(IND Chile, 2021)'],
        ['leisure=fitness_station', 'Plaza Activa / Máquinas de Ejercicios', 'CAT-05', 'Node, Way', 'fitness_station=calisthenics, surface=gravel', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / Municipalidades', 'Alta', 'Estación de máquinas de calistenia en Plaza Brasil', '(MINVU, 2021)'],
        ['amenity=bench', 'Banca / Escaño Público de Descanso', 'CAT-05', 'Node', 'material=wood|metal|concrete, backrest=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / Dirección de Aseo y Ornato', 'Muy Alta', 'Escaños patrimoniales en bandejón central de Av. Brasil', '(MINVU, 2021)'],
        ['amenity=drinking_water', 'Bebedero Público de Agua Potable', 'CAT-05', 'Node', 'drinking_water=yes, operational_status=ok', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Aguas Andinas / Municipalidades', 'Media', 'Bebedero público en Plaza Brasil', '(MINVU, 2021)'],
        ['leisure=dog_park', 'Zona Canina / Canil de Espacio Público', 'CAT-05', 'Way', 'dog=designated, fenced=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Municipalidad de Santiago (Tenencia Responsable)', 'Media', 'Canil cerrado y zona de adiestramiento en Parque Quinta Normal', '(SUBDERE, 2018)'],
        ['landuse=grass', 'Césped Urbano / Superficie Verde Ajardinada', 'CAT-05', 'Way', 'surface=grass, landuse=grass', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Parques y Jardines / MINVU', 'Alta', 'Prados ajardinados centrales en Plaza Brasil', '(MINVU, 2021)'],
        ['historic=building', 'Inmueble de Conservación Histórica (ICH) / Casona', 'CAT-06', 'Way, Relation', 'name, heritage=ICH, heritage:operator=CMN|DOM, building:architecture', 'Monumentos Históricos e Inmuebles Protegidos (CMN - SERPAT / IDE Chile)', 'Consejo de Monumentos Nacionales (CMN) / DOM', 'Alta', 'Casonas Neoclásicas UAH (Barroso 10, Cienfuegos 41)', '(CMN & MINCAP, 2022; Municipalidad de Santiago, 2019)'],
        ['historic=monument', 'Monumento Público / Escultura Nacional', 'CAT-06', 'Node, Way', 'name, historic=monument, material=bronze|stone', 'Monumentos Públicos (CMN - SERPAT / IDE Chile)', 'Consejo de Monumentos Nacionales (CMN)', 'Alta', 'Esculturas conmemorativas en Plaza Brasil', '(CMN & MINCAP, 2022; Ley N° 17.288)'],
        ['historic=memorial', 'Memorial de Derechos Humanos / Hito Conmemorativo', 'CAT-06', 'Node', 'name, memorial=plaque|statue, memorial:type', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Subsecretaría de Derechos Humanos / CMN', 'Media', 'Placas conmemorativas en sedes comunitarias y sindicales', '(Subsecretaría de DDHH, 2021)'],
        ['heritage=cite', 'Cité Patrimonial / Pasaje Colectivo Tradicional', 'CAT-06', 'Way, Relation', 'name, building=residential, residential=cite', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / CMN / Municipalidad de Santiago', 'Alta en Santiago Poniente', 'Cité Lucrecia Valdés / Pasajes de calle Huérfanos', '(Municipalidad de Santiago, 2019; Hidalgo, 2005)'],
        ['amenity=place_of_worship', 'Templo Religioso / Basílica / Parroquia', 'CAT-06', 'Way, Node', 'name, religion=christian, denomination=catholic', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CMN / Arzobispado de Santiago', 'Muy Alta', 'Basílica del Salvador (Monumento Histórico)', '(CMN & MINCAP, 2022)'],
        ['amenity=arts_centre', 'Centro Cultural Comunitario / Galpón de Arte', 'CAT-06', 'Node, Way', 'name, operator, community=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Ministerio de las Culturas, las Artes y el Patrimonio', 'Alta', 'Centro Cultural de Barrio Brasil / Galpón Víctor Jara', '(MINCAP, 2022)'],
        ['tourism=museum', 'Museo Público / Histórico / Universitario', 'CAT-06', 'Node, Way', 'name, museum=history, fee=yes|no', 'Catastro Nacional de Museos (SERPAT / IDE Chile)', 'Servicio Nacional del Patrimonio Cultural (SERPAT)', 'Alta', 'Museo de la Educación Gabriela Mistral', '(SERPAT, 2023)'],
        ['amenity=cinema', 'Cine Comunitario / Sala de Exhibición Independiente', 'CAT-06', 'Node, Way', 'name, cinema=independent', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINCAP / Red de Salas de Cine de Chile', 'Media', 'Cine Normandie y salas independientes de Barrio Universitario', '(MINCAP, 2022)'],
        ['historic=archaeological_site', 'Sitio de Rescate Arqueológico Colonial', 'CAT-06', 'Node, Way', 'name, site_type=colonial, protection_class', 'Sitios Arqueológicos Protegidos (CMN - SERPAT / IDE Chile)', 'Consejo de Monumentos Nacionales (CMN)', 'Baja', 'Hallazgos arqueológicos coloniales en obras viales de Santiago Poniente', '(CMN & MINCAP, 2022)'],
        ['kerb=lowered', 'Rebaje de Solera / Vado Peatonal en Esquina', 'CAT-07', 'Node', 'tactile_paving=yes|no, sloped_curb=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU (OGUC Art. 2.2.8) / SENADIS', 'Alta', 'Rebaje de solera en cruce Alameda con Almirante Barroso', '(MINVU, 2016; SENADIS, 2021)'],
        ['kerb=flush', 'Cordón a Nivel Cero / Plataforma Única', 'CAT-07', 'Node', 'barrier=no, kerb=flush', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / SERVIU Metropolitano', 'Media', 'Pasos a nivel en paseos peatonales y calles calmadas', '(MINVU, 2016)'],
        ['highway=crossing', 'Paso Peatonal Demarcado (Paso Cebra / Semaforizado)', 'CAT-07', 'Node', 'crossing=zebra|traffic_signals, crossing:island=yes|no', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONASET (Ministerio de Transportes) / MINVU', 'Muy Alta', 'Paso de cebra demarcado en Cienfuegos frente a UAH', '(CONASET, 2022; MTT, 2021)'],
        ['tactile_paving=yes', 'Pavimento Podotáctil de Alerta o Guía (Baldosa Táctil)', 'CAT-07', 'Node, Way', 'tactile_paving:type=warning|guide', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU (D.S. 50) / SENADIS', 'Media (en rápida expansión)', 'Baldosas podotáctiles en esquinas y andenes de Metro', '(MINVU, 2016; SENADIS, 2021)'],
        ['traffic_signals:sound=yes', 'Semáforo Peatonal Audible (Señal Acústica)', 'CAT-07', 'Node', 'traffic_signals:vibration=yes|no', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Unidad Operativa de Control de Tránsito (UOCT)', 'Media', 'Semáforo sonoro en eje Alameda con Los Héroes', '(UOCT & MTT, 2022)'],
        ['highway=traffic_signals', 'Intersección con Semáforos Sincronizados UOCT', 'CAT-07', 'Node', 'traffic_signals:direction=forward, operator=UOCT', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'UOCT / MTT', 'Alta', 'Cruces semaforizados sincronizados en Alameda con Manuel Rodríguez', '(UOCT & MTT, 2022)'],
        ['wheelchair=yes', 'Recinto o Local 100% Accesible para Sillas de Ruedas', 'CAT-07', 'Node, Way', 'wheelchair:description, ramp=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / SENADIS', 'Alta', 'Edificio Erasmo Escala UAH con rampa y ascensor accesible', '(SENADIS, 2021; ISO 21542:2021)'],
        ['wheelchair=limited', 'Recinto con Accesibilidad Parcial / Requiere Asistencia', 'CAT-07', 'Node, Way', 'wheelchair:description=escalón en acceso', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / SENADIS', 'Alta', 'Casonas patrimoniales con accesibilidad restringida en segundo piso', '(SENADIS, 2021)'],
        ['highway=pedestrian', 'Paseo Peatonal Exclusivo / Calle Peatonalizada', 'CAT-07', 'Way', 'surface=paving_stones|asphalt, motor_vehicle=no', 'Red Vial Urbana - Paseos Peatonales (MOP - SERVIU / IDE Chile)', 'MINVU / SECPLAN Santiago', 'Alta', 'Paseo peatonal Huérfanos Poniente y pasajes patrimoniales', '(MINVU, 2021)'],
        ['highway=ramp', 'Rampa de Acceso Peatonal con Pendiente Normada', 'CAT-07', 'Way', 'incline=8%, handrail=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU (D.S. 50) / SENADIS', 'Media', 'Rampas con pasamanos en accesos de facultades UAH', '(MINVU, 2016; SENADIS, 2021)'],
        ['natural=tree', 'Árbol Urbano de Alineación en Acera o Plaza', 'CAT-08', 'Node', 'genus, species, circumference, height', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Corporación Nacional Forestal (CONAF) / Municipios', 'Muy Alta', 'Plátanos orientales y jacarandás en Av. Brasil', '(CONAF, 2019; MMA, 2022)'],
        ['natural=wood', 'Masa Arbórea Continua / Bosquete Urbano', 'CAT-08', 'Way, Relation', 'type=forest, leaf_type=broadleaved', 'Catastro de Recursos Vegetacionales Nativos (CONAF / IDE Chile)', 'CONAF / MMA', 'Media', 'Área arbolada densa en Parque Quinta Normal', '(CONAF, 2019; IDE Chile / SNIT, 2024)'],
        ['genus=Platanus', 'Plátano Oriental (Platanus orientalis / × acerifolia)', 'CAT-08', 'Node', 'natural=tree, genus=Platanus', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF / Catastro Arbolado Urbano Santiago', 'Muy Alta', 'Alineaciones arbóreas históricas en Av. Brasil y bandejón Alameda', '(CONAF, 2019)'],
        ['genus=Jacaranda', 'Jacarandá (Jacaranda mimosifolia)', 'CAT-08', 'Node', 'natural=tree, genus=Jacaranda', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF / Dirección de Aseo y Ornato', 'Alta', 'Jacarandás florecidos en primavera en torno a Plaza Brasil', '(CONAF, 2019)'],
        ['genus=Jubaea', 'Palma Chilena (Jubaea chilensis - Nativa Vulnerable)', 'CAT-08', 'Node', 'natural=tree, genus=Jubaea, protected=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF / Ministerio del Medio Ambiente', 'Baja (Especie Protegida)', 'Ejemplares monumentales de palma chilena en plazas de Santiago', '(CONAF, 2019; MMA, 2022)'],
        ['genus=Schinus', 'Pimiento / Molle (Schinus areira - Nativo Resistente a Sequía)', 'CAT-08', 'Node', 'natural=tree, genus=Schinus', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF / MMA', 'Alta', 'Pimientos nativos resistentes a escasez hídrica en Barrio Brasil', '(CONAF, 2019)'],
        ['genus=Quillaja', 'Quillay (Quillaja saponaria - Flora Esclerófila)', 'CAT-08', 'Node', 'natural=tree, genus=Quillaja, native=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF / MMA', 'Media', 'Quillayes en platabandas sostenibles de la comuna de Santiago', '(CONAF, 2019; MMA, 2022)'],
        ['amenity=training_centre', 'Centro de Capacitación Laboral / Sede OTEC', 'CAT-01', 'Node, Way', 'name, operator, training=vocational, addr:street', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SENCE / Ministerio del Trabajo y Previsión Social', 'Media', 'Centros de capacitación laboral y sedes OTEC en Santiago Poniente y regiones', '(SENCE & Mintrab, 2022; OECD, 2017)'],
        ['healthcare=centre', 'Posta de Salud Rural (PSR) / Estación Médico Rural', 'CAT-02', 'Node, Way', 'name, operator=DISAM|Salud Municipal, healthcare:speciality=rural', 'Establecimientos de Salud - Atención Primaria Rural (DEIS - MINSAL / IDE Chile)', 'MINSAL / Red Asistencial Rural', 'Alta en comunas rurales', 'Postas rurales en comunas periurbanas de la RM (Melipilla, Talagante, Tiltil) y regiones', '(MINSAL, 2023; IDE Chile / SNIT, 2024)'],
        ['amenity=social_facility', 'Establecimiento de Larga Estadía para Adultos Mayores (ELEAM)', 'CAT-02', 'Node, Way', 'name, social_facility=nursing_home, social_facility:for=senior', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Servicio Nacional del Adulto Mayor (SENAMA) / MDSF', 'Media', 'Residencias de adultos mayores en Barrio Brasil, Quinta Normal y ciudades regionales', '(SENAMA & MDSF, 2021)'],
        ['man_made=water_tower', 'Copa de Agua Potable / Estanque Elevado de Regulación', 'CAT-02', 'Node, Way', 'man_made=water_tower, operator=Aguas Andinas|Comité APR, capacity', 'Sistemas de Agua Potable y Estanques de Regulación (DOH - MOP / IDE Chile)', 'Dirección de Obras Hidráulicas (DOH - MOP) / SISS', 'Alta', 'Copas de agua y estanques de distribución en Santiago Poniente y cabeceras comunales', '(DOH & MOP, 2022; SISS, 2022)'],
        ['man_made=water_works', 'Planta de Agua Potable Rural (APR) / Servicio Sanitario Rural', 'CAT-02', 'Way, Node', 'name, operator=Comité APR|Cooperativa, service=rural', 'Sistemas de Agua Potable Rural (DOH - MOP / IDE Chile)', 'Subdirección de Servicios Sanitarios Rurales (DOH - MOP, Ley N° 20.998)', 'Muy Alta en zonas rurales', 'Cooperativas y comités de agua potable rural en cuencas de Maipo, Aconcagua y Maule', '(DOH & MOP, 2022; Ley N° 20.998)'],
        ['emergency=fire_lookout', 'Torre de Detección de Incendios Forestales / Caseta CONAF', 'CAT-02', 'Node', 'name, operator=CONAF, lookout_type=tower, communication:radio=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Corporación Nacional Forestal (CONAF) / SENAPRED', 'Media', 'Torres de vigilancia en cerros islas y áreas de interfaz urbano-forestal en regiones', '(CONAF, 2022; SENAPRED, 2023)'],
        ['amenity=coast_guard', 'Capitanía de Puerto / Alcaldía de Mar (DIRECTEMAR)', 'CAT-02', 'Node, Way', 'name, operator=Armada de Chile|DIRECTEMAR, contact:vhf', 'Capitanías de Puerto y Alcaldías de Mar (DIRECTEMAR / IDE Chile)', 'Dirección General del Territorio Marítimo y Marina Mercante (DIRECTEMAR)', 'Alta en todo el litoral', 'Alcaldías de mar y capitanías en puertos de Valparaíso, San Antonio, Talcahuano y fiordos australes', '(DIRECTEMAR & Armada de Chile, 2021)'],
        ['amenity=ferry_terminal', 'Terminal de Transbordadores / Rampa de Barcazas de Conectividad', 'CAT-03', 'Node, Way', 'name, operator=Naviera Austral|Transmarchilay, ferry=yes', 'Terminales y Rampas de Conectividad Austral (DOP - MOP / IDE Chile)', 'Dirección de Obras Portuarias (DOP - MOP) / MTT', 'Alta en zonas insulares y australes', 'Rampas de conectividad en Pargua, Chacao, Quellón, Puerto Chacabuco y Punta Arenas', '(DOP & MOP, 2023; MTT, 2022)'],
        ['railway=level_crossing', 'Cruce Ferroviario a Nivel con Barrera / Señalización', 'CAT-03', 'Node', 'crossing:barrier=full|half, crossing:light=yes, operator=EFE', 'Cruces Ferroviarios (EFE - MTT / IDE Chile)', 'Empresa de los Ferrocarriles del Estado (EFE) / MTT', 'Alta en ramales y troncales', 'Cruces a nivel de tren Nos-Alameda, Biotren y ramal Talca-Constitución', '(EFE & MTT, 2023)'],
        ['barrier=toll_booth', 'Plaza de Peaje Interurbano / Pórtico Free Flow (TAG)', 'CAT-03', 'Node, Way', 'name, toll:tag=yes, operator=Autopista Central|Ruta del Maipo', 'Plazas de Peaje Concesionadas (DGC - MOP / IDE Chile)', 'Dirección General de Concesiones (DGC - MOP)', 'Alta en rutas interurbanas', 'Pórticos TAG en autopistas urbanas y plazas de peaje en Ruta 5 y Ruta 68', '(DGC & MOP, 2023)'],
        ['aeroway=aerodrome', 'Aeródromo Comunal / Pista de Emergencia Aeromédica', 'CAT-03', 'Way, Relation, Node', 'name, iata, icao, aerodrome:type=public, operator=DGAC', 'Aeródromos y Helipuertos Públicos (DGAC / IDE Chile)', 'Dirección General de Aeronáutica Civil (DGAC)', 'Media', 'Aeródromo Tobalaba, Peldehue y pistas de enlace comunitario en regiones', '(DGAC, 2023)'],
        ['highway=track', 'Camino Rural No Pavimentado / Huella de Servidumbre Agrícola', 'CAT-04', 'Way', 'tracktype=grade1|grade2|grade3, surface=unpaved|gravel', 'Red Vial Rural y Huellas (Dirección de Vialidad - MOP / IDE Chile)', 'Dirección de Vialidad (MOP) / Indap', 'Muy Alta en comunas rurales', 'Redes viales secundarias y huellas agrícolas en periferia de Santiago y regiones', '(Dirección de Vialidad & MOP, 2022)'],
        ['highway=steps', 'Escalinata Peatonal de Cerro / Escalera Pública Barrial', 'CAT-04', 'Way', 'step_count, handrail=yes|no, surface=concrete|stone', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / Municipalidades (Planes de Cerros)', 'Muy Alta en ciudades con pendiente', 'Escaleras de quebradas urbanas y accesos a cerros en Valparaíso y Santiago Poniente', '(MINVU, 2020; Municipalidad de Valparaíso, 2021)'],
        ['leisure=marina', 'Caleta de Pescadores Artesanales / Muelle Artesanal', 'CAT-05', 'Way, Node', 'name, operator=Sindicato de Pescadores, mooring=yes', 'Caletas Pesqueras Artesanales (SERNAPESCA / IDE Chile)', 'Servicio Nacional de Pesca y Acuicultura (SERNAPESCA) / DOP MOP', 'Alta en borde costero', 'Caletas pesqueras artesanales (Caleta Portales, Caleta San Antonio, Caleta Angelmó)', '(SERNAPESCA & Subpesca, 2022)'],
        ['historic=wayside_cross', 'Animita de Carretera / Gruta Popular Tradicional', 'CAT-06', 'Node', 'name, historic=wayside_cross|wayside_shrine, religion=christian|folk', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Consejo de Monumentos Nacionales (Patrimonio Cultural Inmaterial)', 'Muy Alta en rutas y esquinas', 'Animitas y grutas de devoción popular en esquinas barriales y calzadas interurbanas', '(CMN & MINCAP, 2022; Weigell, 2023)'],
        ['amenity=shelter', 'Refugio Peatonal Rural / Garita de Espera de Transporte', 'CAT-07', 'Node, Way', 'shelter_type=public_transport, bench=yes, material=wood|metal', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Vialidad (MOP) / Gobiernos Regionales', 'Muy Alta en rutas rurales', 'Garitas de madera y hormigón en paradas de micro rural e interprovincial', '(Dirección de Vialidad & MOP, 2022; MTT, 2021)'],
        ['highway=elevator', 'Ascensor Público Urbano / Funicular de Transporte Inclusivo', 'CAT-07', 'Node', 'name, operator=Metro S.A.|Municipalidad, wheelchair=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MINVU / SENADIS / Municipalidades', 'Alta en pasarelas y cerros', 'Ascensores en pasarelas de autopistas urbanas, estaciones de Metro y funiculares patrimoniales', '(MINVU, 2016; SENADIS, 2021)'],
        ['natural=wetland', 'Humedal Urbano Protegido (Ley N° 21.202) / Pajonal / Salar', 'CAT-08', 'Way, Relation', 'name, wetland=marsh|tidalflat, protection_class=nature_reserve', 'Humedales Urbanos Declarados (MMA / IDE Chile)', 'Ministerio del Medio Ambiente (MMA - Inventario Nacional de Humedales)', 'Alta en valles y costa', 'Humedales urbanos protegidos en Quilicura, Batuco, Concón, Llanquihue y Valdivia', '(MMA, 2022; Ley N° 21.202)'],
        ['genus=Cryptocarya', 'Peumo (Cryptocarya alba) - Árbol Nativo Esclerófilo', 'CAT-08', 'Node', 'natural=tree, species=Cryptocarya alba, taxon:clade=esclerofilo', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF (Programa de Arborización Urbana y Restauración)', 'Alta en Chile Central', 'Ejemplares nativos de peumo en parques urbanos y campus universitarios', '(CONAF, 2019; MMA, 2022)'],
        ['genus=Maytenus', 'Maitén (Maytenus boaria) - Árbol Nativo Siempreverde', 'CAT-08', 'Node', 'natural=tree, species=Maytenus boaria, indigenous=yes', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'CONAF / Ministerio del Medio Ambiente', 'Alta en plazas y riberas', 'Maitenes protegidos en bandejones y áreas verdes comunitarias', '(CONAF, 2019; MMA, 2022)'],
        ['dwc:scientificName', 'Nombre Científico del Taxón / Especie (Darwin Core)', 'CAT-08', 'Point', 'dwc:scientificName, dwc:kingdom, dwc:family, dwc:genus, dwc:specificEpithet', 'Especies Nativas e Introducidas (MMA / IDE Chile)', 'GBIF Chile / Ministerio del Medio Ambiente (MMA)', 'Muy Alta (>1.5M registros en Chile)', 'Taxonomía biológica de flora urbana y avifauna en Plaza Brasil y campus UAH', '(GBIF Secretariat, 2024; TDWG, 2023)'],
        ['dwc:vernacularName', 'Nombre Común o Vernáculo en Chile (Darwin Core)', 'CAT-08', 'Point', 'dwc:vernacularName, dwc:language=es, dwc:locality', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'MMA / Inventario Nacional de Especies / Red de Ciencia Ciudadana', 'Alta (>300.000 observaciones)', 'Identificación comunitaria de especies: chincol, zorzal, tórtola, pimiento, quillay', '(GBIF Secretariat, 2024; MMA, 2022)'],
        ['dwc:basisOfRecord', 'Tipo de Registro Biológico (HUMAN_OBSERVATION / iNaturalist)', 'CAT-08', 'Point', 'basisOfRecord=HUMAN_OBSERVATION|PRESERVED_SPECIMEN, recordedBy, eventDate', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'GBIF Secretariat / TDWG Darwin Core', 'Muy Alta (>85% observaciones)', 'Observaciones comunitarias fotográficas con grado de investigación en Barrio Brasil', '(TDWG, 2023; GBIF Secretariat, 2024)'],
        ['dwc:coordinateUncertaintyInMeters', 'Incertidumbre Posicional Métrica de Coordenada GPS', 'CAT-08', 'Point', 'decimalLatitude, decimalLongitude, coordinateUncertaintyInMeters, geodeticDatum=WGS84', 'Exactitud Posicional Absoluta (gmd:DQ_AbsoluteExternalPositionalAccuracy / IDE Chile)', 'GBIF Secretariat / IGM / ISO 19157', 'Alta (filtro de calidad espacial)', 'Radio de precisión métrica (<15 m) en registros móviles de biodiversidad urbana', '(Chapman, 2005a; ISO 19157:2013)'],
        ['dwc:recordedBy', 'Observador Ciudadano / Colector de Ciencia Comunitaria', 'CAT-08', 'Point', 'recordedBy, identifiedBy, occurrenceID, collectionCode', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'GBIF Chile / iNaturalist / Comunidad', 'Muy Alta (trazabilidad de autores)', 'Trazabilidad de autoría ciudadana de avistamientos de fauna y arbolado en el barrio', '(Goodchild, 2007; Haklay, 2013)'],
        ['dwc:issues', 'Banderas de Calidad Espacial y Taxonómica (Darwin Core Issues)', 'CAT-08', 'Point', 'issues=COORDINATE_ROUNDED|GEODETIC_DATUM_ASSUMED_WGS84|TAXON_MATCH_FUZZY', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'GBIF Secretariat / ISO 19157', 'Muy Alta (auditoría algorítmica)', 'Auditoría algorítmica de anomalías en coordenadas y nombres taxonómicos', '(Chapman, 2005b; Chapman, 2010)'],
        ['dwc:datasetKey', 'Identificador Persistente del Dataset Publicador (UUID)', 'CAT-08', 'Point, Colección', 'datasetKey, publishingOrgKey, license=CC-BY|CC0, citation', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'GBIF Secretariat / Nodos Participantes', 'Muy Alta (reproducibilidad científica)', 'Trazabilidad DOI de repositorios institucionales y de ciencia ciudadana', '(Wilkinson et al., 2016; GBIF.org, 2025)'],
        ['dwc:taxonRank', 'Jerarquía Taxonómica del Espécimen (Especie, Género, Familia)', 'CAT-08', 'Point', 'taxonRank=SPECIES|GENUS|FAMILY, taxonomicStatus=ACCEPTED', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'GBIF Secretariat / TDWG', 'Muy Alta (jerarquía biológica)', 'Resolución del nivel taxonómico de observaciones de flora y fauna en la cuenca de Santiago', '(TDWG, 2023; CONAF, 2019)'],
        ['building=yes', 'Huella de Edificación Catastrada / Manzana Construida', 'CAT-09', 'Way, Relation, Node', 'building=yes, addr:street, addr:housenumber, building:levels', 'Catastro Nacional de Bienes Raíces (SII / IDE Chile)', 'Servicio de Impuestos Internos (SII) / DOM', 'Muy Alta (>4.5M en Chile)', 'Huellas poligonales de manzanas patrimoniales y campus UAH', '(IDE Chile / SNIT, 2024; SII, 2023)'],
        ['building=residential', 'Inmueble Residencial / Vivienda Colectiva o Casa Habitación', 'CAT-09', 'Way, Relation', 'building=residential, building:levels, residential', 'Catastro Habitacional Urbano (MINVU / IDE Chile)', 'MINVU / Dirección de Obras Municipales', 'Muy Alta', 'Inmuebles residenciales en calles Maturana, Brasil y Huérfanos', '(MINVU, 2020; INE, 2017)'],
        ['building=apartments', 'Edificio Residencial en Altura / Departamentos', 'CAT-09', 'Way, Relation', 'building=apartments, building:levels, addr:flats', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Obras Municipales / MINVU', 'Alta', 'Torres de departamentos en eje Alameda, San Pablo y Manuel Rodríguez', '(MINVU, 2020; Hidalgo, 2005)'],
        ['building=house', 'Casa Habitación Unifamiliar / Vivienda Tradicional', 'CAT-09', 'Way, Relation', 'building=house, building:material, addr:street', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Obras Municipales (DOM) / INE', 'Muy Alta', 'Casas tradicionales de 1 y 2 pisos en pasajes interiores de Barrio Brasil', '(INE, 2017; Municipalidad de Santiago, 2019)'],
        ['building=commercial', 'Inmueble Comercial / Galería Comercial y Oficinas', 'CAT-09', 'Way, Relation', 'building=commercial, name, commercial:type', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'SERCOTEC / Rentas Municipales', 'Alta', 'Galerías comerciales y locales en Av. Brasil y Alameda', '(SERCOTEC, 2022; INE, 2021)'],
        ['building=civic', 'Edificio Cívico / Dependencia Institucional del Estado', 'CAT-09', 'Way, Relation', 'building=civic, operator, office=government', 'Infraestructura Pública del Estado (MOP / IDE Chile)', 'Dirección de Arquitectura (MOP) / Bienes Nacionales', 'Alta', 'Edificios públicos de ministerios y servicios en Santiago Poniente', '(IDE Chile / SNIT, 2024; MOP, 2022)'],
        ['building=school', 'Pabellón Escolar / Edificio de Escuela o Liceo', 'CAT-09', 'Way, Relation', 'building=school, operator, amenity=school', 'Establecimientos de Educación Escolar (MINEDUC / IDE Chile)', 'MINEDUC / SLEP Santiago', 'Muy Alta', 'Pabellones del Liceo Amunátegui y Escuela República de Panamá', '(MINEDUC, 2023; IDE Chile / SNIT, 2024)'],
        ['building=university', 'Pabellón Universitario / Sede Académica Universitaria', 'CAT-09', 'Way, Relation', 'building=university, name, operator=UAH', 'Establecimientos de Educación Superior (MINEDUC / IDE Chile)', 'MINEDUC / CRUCH', 'Muy Alta', 'Pabellones y casonas académicas del campus UAH (Barroso / Erasmo Escala)', '(MINEDUC, 2023; UAH, 2023)'],
        ['building=church', 'Templo Religioso / Iglesia o Capilla Patrimonial', 'CAT-09', 'Way, Relation', 'building=church, denomination=catholic, historic', 'Inmuebles Religiosos y Templos Catastrados (CMN / IDE Chile)', 'Consejo de Monumentos Nacionales / Arzobispado', 'Muy Alta', 'Basílica del Salvador e Iglesia San Lázaro en el entorno barrial', '(CMN & MINCAP, 2022; Ley N° 17.288)'],
        ['building:levels', 'Número de Pisos / Altura de Edificación en Niveles', 'CAT-09', 'Way, Relation', 'building:levels=1|2|3|etc., height', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Obras Municipales / MINVU', 'Alta', 'Catastro de alturas para análisis morfológico y rasantes en Barrio Brasil', '(MINVU, 2020; Municipalidad de Santiago, 2019)'],
        ['landuse=residential', 'Zona de Uso de Suelo Residencial / Habitacional Consolidado', 'CAT-10', 'Way, Relation', 'landuse=residential, residential', 'Zonificación Planes Reguladores Comunales (MINVU / IDE Chile)', 'MINVU / Secretaría Técnica PRC Municipal', 'Muy Alta', 'Manzanas de uso predominantemente habitacional de la Zona Típica', '(MINVU, 2017; IDE Chile / SNIT, 2024)'],
        ['landuse=commercial', 'Zona de Uso de Suelo Comercial y de Servicios', 'CAT-10', 'Way, Relation', 'landuse=commercial, name', 'Zonificación Planes Reguladores Comunales (MINVU / IDE Chile)', 'MINVU / Secretaría Técnica PRC Municipal', 'Alta', 'Corredores comerciales en Av. Brasil, Huérfanos y Alameda Poniente', '(MINVU, 2017; IDE Chile / SNIT, 2024)'],
        ['landuse=education', 'Recinto de Uso Educacional / Campus Integrado', 'CAT-10', 'Way, Relation', 'landuse=education, operator, amenity=university', 'Zonificación de Equipamiento Educacional (MINVU / IDE Chile)', 'MINVU / MINEDUC', 'Alta', 'Polígono del Campus Universitario Universidad Alberto Hurtado', '(MINVU, 2017; MINEDUC, 2023)'],
        ['landuse=recreation_ground', 'Recinto de Recreación y Deportes al Aire Libre', 'CAT-10', 'Way, Relation', 'landuse=recreation_ground, leisure=pitch', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Instituto Nacional de Deportes (IND) / MINVU', 'Alta', 'Canchas comunitarias y áreas recreativas exteriores en Barrio Brasil', '(IND Chile, 2021; MINVU, 2021)'],
        ['landuse=construction', 'Terreno en Faena de Construcción / Obras Urbanas Activas', 'CAT-10', 'Way, Relation', 'landuse=construction, construction=building', 'Sin capa homóloga en IDE Chile (Dato VGI / Brecha de información oficial)', 'Dirección de Obras Municipales / CChC', 'Media', 'Sitios en demolición, remodelación o edificación de nuevas obras', '(MINVU, 2020)'],
        ['surface=asphalt', 'Cobertura de Calzada en Asfalto / Pavimento Flexible', 'CAT-10', 'Way', 'surface=asphalt, highway=primary|secondary|tertiary', 'Red Vial Pavimentada (Dirección de Vialidad - MOP / IDE Chile)', 'Dirección de Vialidad (MOP) / SERVIU Metropolitano', 'Muy Alta', 'Calzadas vehiculares principales de Av. Brasil, Alameda y Ricardo Cumming', '(Dirección de Vialidad & MOP, 2022; IDE Chile / SNIT, 2024)'],
    ]

    for r_idx, tag in enumerate(etiquetas_chile, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(tag, 1):
            cell = ws2.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx in (1, 4, 5) else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws2.row_dimensions[r_idx].height = 28
        
    autoajustar_columnas(ws2, max_len_cap=38)

    # HOJA 3: Diccionario Normalizado de Atributos VGI
    # ----------------------------------------------------
    ws3 = wb.create_sheet(title="Diccionario Atributos VGI")
    ws3["A1"] = "DICCIONARIO DE ATRIBUTOS NORMALIZADOS PARA EL ATLAS VGI"
    ws3["A1"].font = fuente_titulo
    ws3["A2"] = "Esquema unificado para exportación en GeoJSON, Shapefile, Geodatabase y análisis QGIS"
    ws3["A2"].font = fuente_subtitulo
    
    headers3 = [
        "Campo Normalizado", "Tipo de Dato", "Longitud", "Obligatoriedad",
        "Origen / Mapeo OSM", "Origen / Mapeo GBIF", "Equivalencia IDE Chile / ISO 19110",
        "Descripción y Regla de Calidad Metodológica"
    ]
    
    for c_idx, h in enumerate(headers3, 1):
        cell = ws3.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws3.row_dimensions[4].height = 28
    ws3.freeze_panes = "A5"
    
    diccionario_vgi = [
        ["id_vgi", "Texto (Alfanumérico)", "64", "Obligatorio", "osm_type + '/' + id", "gbifID / key", "ID_OBJETO / gmd:identifier", "Identificador global persistente único por entidad para evitar duplicados en QGIS."],
        ["categoria", "Texto (Código CAT)", "32", "Obligatorio", "Clasificación según CAT-01 a CAT-10", "'Biodiversidad'", "gmd:topicCategory (ISO 19115)", "Categoría sectorial temática maestra para agregación y tabulaciones comunales."],
        ["subtipo", "Texto", "48", "Obligatorio", "amenity / shop / highway / etc.", "class / order / family", "Tipo de Objeto Catastral / Subclase", "Valor específico del uso de suelo o función de la entidad (ej: university, clinic, bus_stop)."],
        ["nombre", "Texto", "128", "Opcional", "tags.name || tags['name:es']", "scientificName || species", "gmd:title / Toponimia Oficial", "Nombre propio o denominación comercial reconocido por la comunidad en terreno."],
        ["operador", "Texto", "96", "Opcional", "tags.operator", "institutionCode || publishingOrgKey", "gmd:CI_ResponsibleParty / Custodio", "Institución pública, empresa u organización responsable de la mantención del recinto."],
        ["direccion", "Texto", "128", "Opcional", "addr:street + ' ' + addr:housenumber", "locality / stateProvince", "Dirección Postal Catastral", "Referencia espacial textual de acceso (calle y número) para fiscalización municipal."],
        ["accesibilidad", "Texto", "16", "Opcional", "tags.wheelchair", "N/A", "Infraestructura Inclusiva / D.S. 50", "Condición física de acceso para personas con movilidad reducida (yes, limited, no)."],
        ["superficie_m2", "Numérico (Decimal)", "16,2", "Condicional", "Área calculada en polígonos cerrados", "N/A", "Área Métrica Oficial / gmd:EX_Extent", "Área calculada mediante fórmula de Gauss tras reproyección conforme a EPSG:32719 UTM 19S."],
        ["superficie_ha", "Numérico (Decimal)", "12,4", "Condicional", "superficie_m2 / 10.000", "N/A", "Superficie en Hectáreas", "Equivalencia métrica en hectáreas para análisis de instrumentos de planificación (PRC)."],
        ["srs_superficie", "Texto", "64", "Condicional", "'EPSG:32719 (WGS 84 / UTM Huso 19 Sur)'", "N/A", "gmd:MD_ReferenceSystem / EPSG:5361", "Sistema geodésico proyectado oficial que respalda la validez de las medidas métricas."],
        ["fuente", "Texto", "48", "Obligatorio", "'OpenStreetMap / Overpass QL'", "'GBIF / iNaturalist'", "gmd:LI_Lineage / Procedencia", "Plataforma proveedora del dato espacial para trazabilidad metodológica."],
        ["fecha_registro", "Fecha / ISO 8601", "24", "Condicional", "timestamp de la última edición", "eventDate", "Fecha de Captura / gmd:dateStamp", "Marca temporal de la última actualización para evaluar obsolescencia (ISO 19157)."],
        ["licencia", "Texto", "48", "Obligatorio", "'ODbL 1.0 (OSM) / CC BY-SA 4.0'", "'CC BY 4.0' / 'CC0 1.0'", "gmd:MD_LegalConstraints", "Marco tripartito: CC BY-SA 4.0 (contenido/documentación), ODbL 1.0 (datos espaciales) y AGPL-3.0 (código fuente)."],
        ["geom_wkt", "Geometría (WKT)", "Variable", "Obligatorio", "Point / LineString / Polygon", "Point (decimalLat, decimalLon)", "Coordenadas Espaciales EPSG:4326", "Geometría vectorial en WGS 84 compatible con estándares del Open Geospatial Consortium."]
    ]
    
    for r_idx, d in enumerate(diccionario_vgi, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(d, 1):
            cell = ws3.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx in (1, 5, 6, 7) else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws3.row_dimensions[r_idx].height = 30
        
    autoajustar_columnas(ws3, max_len_cap=38)
    
    # ----------------------------------------------------
    # HOJA 4: Bibliografía y Fuentes APA (7ª ed.)
    # ----------------------------------------------------
    ws4 = wb.create_sheet(title="Bibliografía y Fuentes APA")
    ws4["A1"] = "APARATO CRÍTICO, FUENTES OFICIALES Y BIBLIOGRAFÍA ACADÉMICA (NORMA APA 7ª ED.)"
    ws4["A1"].font = fuente_titulo
    ws4["A2"] = "Trazabilidad documental, normativa técnica e institucional para la evaluación de práctica profesional de Geografía"
    ws4["A2"].font = fuente_subtitulo
    
    headers4 = [
        "Cita Abreviada (En el texto)", "Referencia Bibliográfica Completa (Norma APA 7ª ed.)",
        "Tipo de Fuente", "Institución / Autores Principales", "Año",
        "Título Oficial de la Obra o Norma", "Enlace Oficial / DOI Persistente",
        "Rol y Aplicación en el Atlas VGI"
    ]
    
    for c_idx, h in enumerate(headers4, 1):
        cell = ws4.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws4.row_dimensions[4].height = 30
    ws4.freeze_panes = "A5"

    bibliografia_apa = [       [       '(Schuurman, 2000)',
                'Schuurman, N. (2000). Trouble in the Heartland: GIS and its critics in the 1990s. Progress in Human Geography, 24(4), '
                '569-590.',
                'Artículo en Revista Científica (Seminal)',
                'Schuurman, Nadine',
                '2000',
                'Trouble in the Heartland: GIS and its critics in the 1990s',
                'https://doi.org/10.1191/030913200100189111',
                'Epistemología crítica de los SIG y fundamentación conceptual de la apertura hacia la cartografía ciudadana.'],
        [       '(Amano et al., 2016)',
                'Amano, T., Lamming, J. D. L., & Sutherland, W. J. (2016). Spatial gaps in global biodiversity information and the role of '
                'citizen science. BioScience, 66(11), 993-1000.',
                'Artículo en Revista Científica',
                'Amano, T., Lamming, J. D. L., & Sutherland, W. J.',
                '2016',
                'Spatial gaps in global biodiversity information and the role of citizen science',
                'https://doi.org/10.1093/biosci/biw127',
                'Diagnóstico de sesgos espaciales y vacíos de información biológica subsanados mediante plataformas de ciencia '
                'comunitaria.'],
        [       '(Mooney et al., 2020)',
                'Mooney, P., Minghini, M., & Grinberger, A. Y. (2020). OpenStreetMap data use cases during the early months of the '
                'COVID-19 pandemic. arXiv preprint arXiv:2008.02653.',
                'Preprint / Documento Científico',
                'Mooney, P., Minghini, M., & Grinberger, A. Y.',
                '2020',
                'OpenStreetMap data use cases during the early months of the COVID-19 pandemic',
                'https://arxiv.org/abs/2008.02653',
                'Casos de uso de datos VGI de OpenStreetMap ante crisis sanitarias y equipamientos de salud de urgencia.'],
        [       '(Muñoz-Vargas et al., 2019)',
                'Muñoz-Vargas, J., Lobry, S., & Lefèvre, S. (2019). Correcting rural building annotations in OpenStreetMap using '
                'convolutional neural networks. arXiv preprint arXiv:1901.08190.',
                'Artículo / Conferencia Científica',
                'Muñoz-Vargas, J., Lobry, S., & Lefèvre, S.',
                '2019',
                'Correcting rural building annotations in OpenStreetMap using convolutional neural networks',
                'https://arxiv.org/abs/1901.08190',
                'Metodologías automáticas para corrección de geometrías de edificaciones y detección de inconsistencias en OSM.'],
        [       '(Tempelmeier & Demidova, 2022)',
                'Tempelmeier, N., & Demidova, E. (2022). Attention-based vandalism detection in OpenStreetMap. arXiv preprint '
                'arXiv:2201.10406.',
                'Preprint / Documento Científico',
                'Tempelmeier, N., & Demidova, E.',
                '2022',
                'Attention-based vandalism detection in OpenStreetMap',
                'https://arxiv.org/abs/2201.10406',
                'Mecanismos de detección de vandalismo cartográfico y control de integridad en conjuntos de datos colaborativos.'],
        [       '(Weigell, 2023)',
                'Weigell, P. (2023). Data coverage, richness, and quality of OpenStreetMap for special interest tags: wayside crosses-a '
                'case study. arXiv preprint arXiv:2306.04752.',
                'Preprint / Estudio de Caso',
                'Weigell, P.',
                '2023',
                'Data coverage, richness, and quality of OpenStreetMap for special interest tags: wayside crosses-a case study',
                'https://arxiv.org/abs/2306.04752',
                'Evaluación de completitud y riqueza de etiquetas de interés patrimonial y cultural en OpenStreetMap.'],
        [       '(Ballatore et al., 2014)',
                'Ballatore, A., Wilson, D. C., & Bertolotto, M. (2014). A survey of volunteered open geo-knowledge bases in the Semantic '
                'Web. Quality Issues in the Open Knowledge Base, 48-68.',
                'Capítulo de Libro Académico',
                'Ballatore, A., Wilson, D. C., & Bertolotto, M.',
                '2014',
                'A survey of volunteered open geo-knowledge bases in the Semantic Web',
                'https://arxiv.org/abs/1401.2610',
                'Articulación ontológica entre bases de conocimiento geoespacial voluntario y web semántica.'],
        [       '(Ballatore, 2014)',
                'Ballatore, A. (2014). Defacing the map: Cartographic vandalism in the digital commons. The Cartographic Journal, 51(3), '
                '214-224.',
                'Artículo en Revista Científica',
                'Ballatore, Andrea',
                '2014',
                'Defacing the map: Cartographic vandalism in the digital commons',
                'https://doi.org/10.1179/1743277414Y.0000000085',
                'Tipologías de vandalismo cartográfico en bienes comunes digitales y estrategias de moderación comunitaria.'],
        [       '(Attard et al., 2016)',
                'Attard, M., Haklay, M., & Capineri, C. (2016). The potential of Volunteered Geographic Information (VGI) in future '
                'transport systems. Urban Planning, 1(4), 6-19.',
                'Artículo en Revista Científica',
                'Attard, M., Haklay, M., & Capineri, C.',
                '2016',
                'The potential of Volunteered Geographic Information (VGI) in future transport systems',
                'https://doi.org/10.17645/up.v1i4.612',
                'Integración de VGI en la planificación y monitoreo de sistemas de transporte público urbano y movilidad activa.'],
        [       '(Shahi, 2023)',
                'Shahi, K. (2023). Volunteered Geographic Information (VGI) in Spatial Data Infrastructure (SDI) Continuum. EAI Endorsed '
                'Transactions on Internet of Things, 9(1), 1-12.',
                'Artículo en Revista Científica',
                'Shahi, K.',
                '2023',
                'Volunteered Geographic Information (VGI) in Spatial Data Infrastructure (SDI) Continuum',
                'https://doi.org/10.4108/eetiot.v9i1.2941',
                'Marco para la convergencia y complementariedad entre datos ciudadanos voluntarios y las IDE institucionales.'],
        [       '(Burghardt et al., 2024)',
                'Burghardt, D., Demidova, E., & Keim, D. A. (Eds.). (2024). Volunteered Geographic Information: Interpretation, '
                'visualization and social context. Springer Nature.',
                'Libro Académico de Referencia',
                'Burghardt, D., Demidova, E., & Keim, D. A.',
                '2024',
                'Volunteered Geographic Information: Interpretation, visualization and social context',
                'https://doi.org/10.1007/978-3-031-35374-1',
                'Metodologías contemporáneas para la interpretación visual, análisis espacio-temporal y contextualización de la VGI.'],
        [       '(CGDIIP, 2012)',
                'Canadian Geospatial Data Infrastructure Information Product [CGDIIP]. (2012). Volunteered Geographic Information (VGI) '
                'Primer. Hickling Arthurs Low Science & Technology Policy Research.',
                'Guía Técnica Gubernamental',
                'CGDIIP / Natural Resources Canada',
                '2012',
                'Volunteered Geographic Information (VGI) Primer',
                'https://ftp.geogratis.gc.ca/',
                'Guía pionera de una IDE nacional para la asimilación de datos comunitarios en la gestión pública territorial.'],
        [       '(Seto et al., 2020)',
                'Seto, T., Kanasugi, H., & Nishimura, Y. (2020). Quality verification of Volunteered Geographic Information using OSM '
                'Notes data in a global context. ISPRS International Journal of Geo-Information, 9(6), 372.',
                'Artículo en Revista Científica',
                'Seto, T., Kanasugi, H., & Nishimura, Y.',
                '2020',
                'Quality verification of Volunteered Geographic Information using OSM Notes data in a global context',
                'https://doi.org/10.3390/ijgi9060372',
                'Aprovechamiento de las notas comunitarias de OpenStreetMap como mecanismo de retroalimentación y auditoría de calidad.'],
        [       "(O'Grady, 2025)",
                "O'Grady, L. (2025). Volunteer Geographic Information mapping of Ebola Virus with mobile GIS using OpenStreetMap. Open "
                'Science Framework.',
                'Informe de Investigación OSF',
                "O'Grady, L.",
                '2025',
                'Volunteer Geographic Information mapping of Ebola Virus with mobile GIS using OpenStreetMap',
                'https://doi.org/10.17605/OSF.IO/ZJX38',
                'Uso humanitario y epidemiológico de la cartografía voluntaria en situaciones de emergencia y salud comunitaria.'],
        [       '(Haklay, 2013)',
                'Haklay, M. (2013). Citizen Science and Volunteered Geographic Information: Overview and typology of participation. In D. '
                'Sui, S. Elwood, & M. Goodchild (Eds.), Crowdsourcing Geographic Knowledge (pp. 105-122). Springer.',
                'Capítulo de Libro Académico',
                'Haklay, Mordechai',
                '2013',
                'Citizen Science and Volunteered Geographic Information: Overview and typology of participation',
                'https://doi.org/10.1007/978-94-007-4587-2_7',
                'Tipología de cuatro niveles de participación en ciencia ciudadana y cartografía participativa.'],
        [       '(See et al., 2016)',
                'See, L., Mooney, P., Foody, G., et al. (2016). Crowdsourcing, citizen science or Volunteered Geographic Information? The '
                'current state of crowdsourced geographic information. ISPRS International Journal of Geo-Information, 5(5), 55.',
                'Artículo de Revisión Seminal',
                'See, Linda et al.',
                '2016',
                'Crowdsourcing, citizen science or Volunteered Geographic Information? The current state of crowdsourced geographic '
                'information',
                'https://doi.org/10.3390/ijgi5050055',
                'Clarificación conceptual y taxonómica entre crowdsourcing espacial, ciencia ciudadana y cartografía voluntaria.'],
        [       '(Mooney & Minghini, 2017)',
                'Mooney, P., & Minghini, M. (2017). A review of OpenStreetMap data. In C. Capineri et al. (Eds.), Mapping and the Citizen '
                'Sensor (pp. 37-59). Ubiquity Press.',
                'Capítulo de Libro Académico',
                'Mooney, P., & Minghini, M.',
                '2017',
                'A review of OpenStreetMap data',
                'https://doi.org/10.5334/bbf.c',
                'Revisión integral de las características intrínsecas, ventajas y limitaciones del modelo de datos de OpenStreetMap.'],
        [       '(Antoniou & Skopeliti, 2015)',
                'Antoniou, V., & Skopeliti, A. (2015). Measures and indicators of VGI quality: An overview. ISPRS Annals of '
                'Photogrammetry, Remote Sensing and Spatial Information Sciences, II-3/W5, 345-351.',
                'Actas de Conferencia Científica',
                'Antoniou, V., & Skopeliti, A.',
                '2015',
                'Measures and indicators of VGI quality: An overview',
                'https://doi.org/10.5194/isprsannals-II-3-W5-345-2015',
                'Inventario y sistematización de métricas de calidad intrínseca y extrínseca para la información geográfica voluntaria.'],
        [       '(Skopeliti & Antoniou, 2017)',
                'Skopeliti, A., & Antoniou, V. (2017). Visualization and communication of VGI quality. In Mapping and the Citizen Sensor '
                '(pp. 193-219). Ubiquity Press.',
                'Capítulo de Libro Académico',
                'Skopeliti, A., & Antoniou, V.',
                '2017',
                'Visualization and communication of VGI quality',
                'https://doi.org/10.5334/bbf.i',
                'Directrices para comunicar la incertidumbre y calidad espacial a usuarios no técnicos en visores cartográficos '
                'interactivos.'],
        [       '(Kounadi & Leitner, 2014)',
                'Kounadi, O., & Leitner, M. (2014). Why does geoprivacy matter? The scientific publications of confidential data presented '
                'on maps. Journal of Empirical Research on Human Research Ethics, 9(4), 34-45.',
                'Artículo en Revista Científica',
                'Kounadi, O., & Leitner, M.',
                '2014',
                'Why does geoprivacy matter? The scientific publications of confidential data presented on maps',
                'https://doi.org/10.1177/1556264614544103',
                'Principios éticos de geoseguridad, confidencialidad espacial y protección de datos territoriales sensibles en plataformas '
                'públicas.'],
        [       '(See et al., 2025)',
                'See, L., et al. (2025). Recent advances in Volunteered Geographic Information (VGI) and citizen science. International '
                'Journal of Digital Earth, 18(1), 2480220.',
                'Artículo en Revista Científica',
                'See, Linda et al.',
                '2025',
                'Recent advances in Volunteered Geographic Information (VGI) and citizen science',
                'https://doi.org/10.1080/17538947.2025.2480220',
                'Estado del arte de los últimos avances en plataformas de información voluntaria, interoperabilidad y modelos '
                'geoespaciales.'],
        [       '(Antoniou, 2023)',
                'Antoniou, V. (2023). Volunteered Geographic Information, Citizen Science and Machine Learning in the service of '
                'Sustainable Development Goals and the Sendai Framework. Citizen Science: Theory and Practice, 8(1), 1-15.',
                'Artículo en Revista Científica',
                'Antoniou, Vyron',
                '2023',
                'Volunteered Geographic Information, Citizen Science and Machine Learning in the service of SDGs and Sendai Framework',
                'https://doi.org/10.5334/cstp.568',
                'Aplicación de VGI y aprendizaje automático en el seguimiento de los ODS y la gestión del riesgo de desastres.'],
        [       '(Goodchild & Li, 2012)',
                'Goodchild, M. F., & Li, L. (2012). Assuring the quality of volunteered geographic information. Spatial Statistics, 1, '
                '110-120.',
                'Artículo en Revista Científica',
                'Goodchild, M. F., & Li, L.',
                '2012',
                'Assuring the quality of volunteered geographic information',
                'https://doi.org/10.1016/j.spasta.2012.03.002',
                "Los tres enfoques de aseguramiento de calidad en VGI: enfoque de multitudes (Linus' Law), enfoque geográfico y enfoque "
                'instrumental.'],
        [       '(Schmidt et al., 2021)',
                'Schmidt, F., Rothaar, A., & Rienow, A. (2021). Development of a Web GIS for small-scale detection and analysis of '
                'COVID-19 cases based on volunteered geographic information for the city of Cologne, Germany. International Journal of '
                'Health Geographics, 20(1), 1-17.',
                'Artículo en Revista Científica',
                'Schmidt, F., Rothaar, A., & Rienow, A.',
                '2021',
                'Development of a Web GIS for small-scale detection and analysis of COVID-19 cases based on VGI',
                'https://doi.org/10.1186/s12942-021-00290-0',
                'Metodología de diseño para SIG web aplicado a la gestión barrial y comunitaria con datos voluntarios.'],
        [       '(Farahat et al., 2005)',
                'Farahat, A., El-Haddad, M., & Sallam, M. (2005). Knowledge discovery in GIS data. Cairo University. arXiv preprint '
                'arXiv:1601.07241.',
                'Documento Técnico / Conferencia',
                'Farahat, A., El-Haddad, M., & Sallam, M.',
                '2005',
                'Knowledge discovery in GIS data',
                'https://arxiv.org/abs/1601.07241',
                'Minería de datos espaciales y extracción de patrones en infraestructuras de información geográfica.'],
        [       '(Goodchild, 2007)',
                'Goodchild, M. F. (2007). Citizens as sensors: the world of volunteered geography. GeoJournal, 69(4), 211-221.',
                'Artículo Seminal Fundacional',
                'Goodchild, Michael F.',
                '2007',
                'Citizens as sensors: the world of volunteered geography',
                'https://doi.org/10.1007/s10708-007-9111-y',
                "Artículo fundacional que acuñó el término 'Información Geográfica Voluntaria' (VGI) y definió a los ciudadanos como "
                'sensores territoriales.'],
        [       '(Soriano, 2016)',
                'Soriano, C. (2016). La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad? Revista Cartográfica, '
                '93, 11-28.',
                'Artículo en Revista Científica',
                'Soriano, Claudia',
                '2016',
                'La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad?',
                'https://doi.org/10.35424/rcarto.i93.376',
                'Marco metodológico en español para la adopción de indicadores ISO 19157 aplicados a proyectos VGI en América Latina.'],
        [       '(Pastor, 2015)',
                'Pastor, J. (2015). La confianza de la Información Geográfica Voluntaria (VGI). Revista Cartográfica, 91, 33-49.',
                'Artículo en Revista Científica',
                'Pastor, Joan',
                '2015',
                'La confianza de la Información Geográfica Voluntaria (VGI)',
                'https://doi.org/10.35424/rcarto.i91.352',
                'Modelos de confianza y reputación comunitaria para validar capas cartográficas en la toma de decisiones territoriales.'],
        [       '(Magaña & Valverde, 2016)',
                'Magaña, A., & Valverde, F. (2016). Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica. Revista '
                'Cartográfica, 93, 29-53.',
                'Artículo de Revisión Científica',
                'Magaña, A., & Valverde, F.',
                '2016',
                'Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica',
                'https://doi.org/10.35424/rcarto.i93.377',
                'Diagnóstico de la adopción, brechas y potencialidades de la cartografía voluntaria en los países latinoamericanos.'],
        [       '(Willington, 2018)',
                'Willington, S. (2018). Sobre la evolución de la información geográfica: las bodas de oro de los SIG. Revista Colombiana '
                'de Geografía, 27(1), 1-14.',
                'Artículo en Revista Científica',
                'Willington, S.',
                '2018',
                'Sobre la evolución de la información geográfica: las bodas de oro de los SIG',
                'https://doi.org/10.15446/rcdg.v27n1.69500',
                'Historia del desarrollo tecnológico de los sistemas de información geográfica desde sus orígenes hasta las plataformas '
                'abiertas colaborativas.'],
        [       '(Pais et al., 2021)',
                'Pais, C., Carrasco, J., Martell, D., et al. (2021). Cell2Fire: A Cell-Based Forest Fire Growth Model to support strategic '
                'landscape management planning. Frontiers in Forest and Global Change, 4, 692706.',
                'Artículo en Revista Científica',
                'Pais, C., Carrasco, J., Martell, D., et al.',
                '2021',
                'Cell2Fire: A Cell-Based Forest Fire Growth Model to support strategic landscape management planning',
                'https://doi.org/10.3389/ffgc.2021.692706',
                'Modelación de propagación celular y riesgo de incendios forestales aplicable a interfaces urbano-forestales.'],
        [       '(Miranda et al., 2022)',
                'Miranda, A., et al. (2022). The Landscape Fire Scars Database: mapping historical burned area and fire severity in Chile. '
                'Earth System Science Data, 14, 1-20.',
                'Base de Datos / Artículo Científico',
                'Miranda, Alejandro et al.',
                '2022',
                'The Landscape Fire Scars Database: mapping historical burned area and fire severity in Chile',
                'https://doi.org/10.5194/essd-14-1-2022',
                'Base de datos geoespacial histórica de severidad de incendios y cicatrices de fuego en Chile central.'],
        [       '(Sandoval et al., 2022)',
                'Sandoval, S., Acuña, I., & Jaramillo, C. (2022). Polinización Sostenible: Adaptación al cambio climático para la '
                'producción de fruta en Chile (Proyecto CORFO 19BP-117423). CORFO / INIA Chile.',
                'Informe Técnico de Proyecto',
                'Sandoval, S., Acuña, I., & Jaramillo, C.',
                '2022',
                'Polinización Sostenible: Adaptación al cambio climático para la producción de fruta en Chile',
                'https://www.corfo.cl',
                'Servicios ecosistémicos de biodiversidad urbana y corredores biológicos de polinizadores en ciudades chilenas.'],
        [       '(UNFCCC, 2025)',
                'United Nations Framework Convention on Climate Change [UNFCCC]. (2025). Global Climate Action Agenda at COP 30: Outcomes '
                'Report. United Nations.',
                'Informe Global de Naciones Unidas',
                'UNFCCC',
                '2025',
                'Global Climate Action Agenda at COP 30: Outcomes Report',
                'https://unfccc.int/',
                'Compromisos climáticos globales, mitigación de islas de calor urbanas y adaptación local basada en naturaleza.'],
        [       '(Jacobs & Zipf, 2017)',
                'Jacobs, C., & Zipf, A. (2017). Completeness of citizen science biodiversity data from a volunteered geographic '
                'information perspective. Geo-spatial Information Science, 20(2), 100-111.',
                'Artículo en Revista Científica',
                'Jacobs, C., & Zipf, A.',
                '2017',
                'Completeness of citizen science biodiversity data from a volunteered geographic information perspective',
                'https://doi.org/10.1080/10095020.2017.1288424',
                'Evaluación de completitud espacial de datos biológicos ciudadanos cruzando metodologías de VGI con registros de GBIF.'],
        [       '(GBIF, 2022)',
                'Global Biodiversity Information Facility [GBIF]. (2022). Introducción a GBIF: La infraestructura mundial de información '
                'sobre biodiversidad. Secretariado de GBIF.',
                'Guía Institucional Oficial',
                'GBIF Secretariat',
                '2022',
                'Introducción a GBIF',
                'https://www.gbif.org/',
                'Fundamentos de la red internacional de datos abiertos sobre biodiversidad y su modelo de publicación abierta.'],
        [       '(Schindel et al., 2016)',
                'Schindel, D., Miller, S., & Trizna, M. (2016). The Global Registry of Biodiversity Repositories: A call for community '
                'curation. Biodiversity Data Journal, 4, e10293.',
                'Artículo en Revista Científica',
                'Schindel, D., Miller, S., & Trizna, M.',
                '2016',
                'The Global Registry of Biodiversity Repositories: A call for community curation',
                'https://doi.org/10.3897/BDJ.4.e10293',
                'Curaduría comunitaria y gestión de repositorios biológicos abiertos.'],
        [       '(Chapman, 2005a)',
                'Chapman, A. D. (2005a). Principles of data quality. Global Biodiversity Information Facility (GBIF).',
                'Manual Técnico / Guía de Calidad',
                'Chapman, Arthur D.',
                '2005',
                'Principles of Data Quality',
                'https://www.gbif.org/document/80509',
                'Principios rectores para la evaluación de precisión posicional, consistencia temática y exactitud de atributos '
                'espaciales.'],
        [       '(Chapman, 2005b)',
                'Chapman, A. D. (2005b). Principles and methods of data cleaning: Primary species and species-occurrence data. Global '
                'Biodiversity Information Facility (GBIF).',
                'Manual Técnico / Guía de Limpieza',
                'Chapman, Arthur D.',
                '2005',
                'Principles and Methods of Data Cleaning',
                'https://www.gbif.org/document/80528',
                'Procedimientos técnicos para depuración de coordenadas geográficas erróneas, detección de outliers y validación de '
                'nombres taxonómicos.'],
        [       '(Chapman, 2010)',
                'Chapman, A. D. (2010). Data quality, data cleaning and data validation techniques: Training manual for courses. Global '
                'Biodiversity Information Facility (GBIF).',
                'Manual de Capacitación Técnica',
                'Chapman, Arthur D.',
                '2010',
                'Data quality, data cleaning and data validation techniques',
                'https://www.gbif.org/document/80530',
                'Técnicas pedagógicas y computacionales para el control de calidad en proyectos de ciencia ciudadana y bases espaciales.'],
        [       '(CODATA, 2020)',
                'Committee on Data of the International Science Council [CODATA]. (2020). Twenty-Year Review of GBIF: An independent '
                'review of the Global Biodiversity Information Facility. CODATA.',
                'Evaluación Externa Independiente',
                'CODATA',
                '2020',
                'Twenty-Year Review of GBIF',
                'https://doi.org/10.35035/ctzm-hz97',
                'Evaluación de impacto, gobernanza y sostenibilidad de infraestructuras globales de datos abiertos federados.'],
        [       '(GBIF, 2025a)',
                'Global Biodiversity Information Facility [GBIF]. (2025a). Technical Guidance for EBRD clients on uploading biodiversity '
                'data to the Global Biodiversity Information Facility. GBIF Secretariat.',
                'Guía Técnica Corporativa',
                'GBIF Secretariat',
                '2025',
                'Technical Guidance on Uploading Biodiversity Data',
                'https://www.gbif.org/',
                'Protocolos estandarizados para publicación de líneas base de biodiversidad corporativas en plataformas abiertas.'],
        [       '(Wilkinson et al., 2016)',
                'Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., et al. (2016). The FAIR Guiding Principles for scientific data '
                'management and stewardship. Scientific Data, 3, 160018.',
                'Artículo en Revista Científica (Seminal)',
                'Wilkinson, M. D. et al.',
                '2016',
                'The FAIR Guiding Principles for scientific data management and stewardship',
                'https://doi.org/10.1038/sdata.2016.18',
                'Principios rectores FAIR (Findable, Accessible, Interoperable, Reusable) para la gestión responsable de datos científicos '
                'y espaciales.'],
        [       '(Nature, 1999)',
                'Nature. (1999). Vast database offers vision of biodiversity. Nature, 399, 723.',
                'Artículo Editorial de Prensa Científica',
                'Nature Publishing Group',
                '1999',
                'Vast database offers vision of biodiversity',
                'https://doi.org/10.1038/21728',
                'Artículo fundacional en Nature sobre el nacimiento de repositorios digitales globales para la investigación biológica y '
                'territorial.'],
        [       '(OECD, 2017)',
                'Organisation for Economic Co-operation and Development [OECD]. (2017). Strengthening the effectiveness and sustainability '
                'of international research infrastructures (Policy Paper No. 48). OECD Publishing.',
                'Informe de Políticas Públicas',
                'OECD',
                '2017',
                'Strengthening the effectiveness and sustainability of international research infrastructures',
                'https://doi.org/10.1787/23074957',
                'Políticas públicas internacionales para financiar y sostener infraestructuras abiertas de datos para la ciencia.'],
        [       '(GBIF, 2025b)',
                'Global Biodiversity Information Facility [GBIF]. (2025b). Science Review Nº 12: Annual review of the uses of '
                'GBIF-mediated data. GBIF Secretariat.',
                'Revisión Científica Anual',
                'GBIF Secretariat',
                '2025',
                'GBIF Science Review Nº 12',
                'https://www.gbif.org/',
                'Compendio anual de aplicaciones científicas y de políticas públicas de datos comunitarios y de museos.'],
        [       '(GBIF, 2023)',
                'Global Biodiversity Information Facility [GBIF]. (2023). 2023-2027 GBIF Strategic Framework: Enabling '
                'biodiversity-positive decisions. GBIF Secretariat.',
                'Marco Estratégico Quinquenal',
                'GBIF Secretariat',
                '2023',
                '2023-2027 GBIF Strategic Framework',
                'https://www.gbif.org/',
                'Estrategia mundial para articular datos de ciencia ciudadana con metas del Marco Mundial de Biodiversidad de '
                'Kunming-Montreal.'],
        [       '(GBIF, 2025c)',
                'Global Biodiversity Information Facility [GBIF]. (2025c). Creación de un nodo participante eficaz de GBIF: Guía de '
                'implementación (v3.1.1). Secretariado de GBIF.',
                'Guía de Implementación Institucional',
                'GBIF Secretariat',
                '2025',
                'Creación de un nodo participante eficaz de GBIF',
                'https://www.gbif.org/',
                'Directrices organizacionales y técnicas para conformar nodos nacionales y locales de interoperabilidad de datos.'],
        [       '(GBIF.org, 2025)',
                'GBIF.org. (2025). GBIF Occurrence Download (Dataset Santiago Metropolitan Region). Global Biodiversity Information '
                'Facility.',
                'Conjunto de Datos Espaciales Persistente',
                'GBIF.org / Observadores Comunitarios',
                '2025',
                'GBIF Occurrence Download (Santiago Centro / RM)',
                'https://doi.org/10.15468/dl.zjw4q9',
                'Descarga persistente con DOI de observaciones comunitarias de flora y fauna en la cuenca de Santiago.'],
        [       '(Pais et al., 2019)',
                'Pais, C., Carrasco, J., et al. (2019). Cell2Fire: A cell based forest fire growth model. arXiv preprint arXiv:1905.09317.',
                'Preprint / Documento Científico',
                'Pais, C., Carrasco, J., et al.',
                '2019',
                'Cell2Fire: A cell based forest fire growth model',
                'https://arxiv.org/abs/1905.09317',
                'Algoritmo de simulación espacial en cuadrícula para modelamiento dinámico de incendios en paisajes forestales.'],
        [       '(IDE Chile, 2024)',
                'Infraestructura de Datos Geoespaciales de Chile [IDE Chile]. (2024). Política de Gestión de Información Territorial — Geoespacial. '
                'Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales, Gobierno de Chile.',
                'Política de Estado Oficial',
                'Secretaría Ejecutiva SNIT / IDE Chile',
                '2024',
                'Política de Gestión de Información Territorial — Geoespacial',
                'https://www.ide.cl/politica/politica/',
                'Documento rector de la política geoespacial de Chile: define la gobernanza, interoperabilidad, producción y '
                'democratización de la información geográfica del Estado.'],
        [       '(IDE Chile / SNIT, 2024)',
                'Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024). Catálogo Nacional de Features: '
                'Descripción normalizada de capas geoespaciales elementales para instituciones del Estado de Chile. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales.',
                'Marco de Referencia Oficial',
                'Secretaría Ejecutiva SNIT / IDE Chile',
                '2024',
                'Catálogo Nacional de Features',
                'https://www.ide.cl/documentos/catalogo-nacional-de-features.pdf',
                'Descripción normalizada de las capas geoespaciales elementales adoptadas por grupos de trabajo interministeriales, base para la validación cruzada con datos VGI del Atlas.'],
        [       '(IDE Chile / SNIT, 2024b)',
                'Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024). Metadatos Geoespaciales: '
                'Orientaciones para la documentación y gestión de la información geoespacial conforme a normas ISO. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales.',
                'Recomendación Técnica Oficial',
                'Secretaría Ejecutiva SNIT / IDE Chile',
                '2024',
                'Metadatos Geoespaciales (Guía técnica IDE Chile)',
                'https://www.ide.cl/documentos/guia-metadatos.pdf',
                'Orientaciones técnicas para mejorar la documentación y gestión de la información geoespacial, promoviendo estándares ISO 19115 e ISO 19139 para el intercambio interinstitucional.'],
        [       '(IDE Chile / SNIT, 2024c)',
                'Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024). Integración de Estándares Internacionales ISO/TC 211 en Chile: '
                'Hoja de ruta para la adopción nacional del catálogo de normas geoespaciales. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales.',
                'Recomendación Técnica Oficial',
                'Secretaría Ejecutiva SNIT / IDE Chile',
                '2024',
                'Integración de Estándares Internacionales ISO/TC 211 en Chile',
                'https://www.ide.cl/documentos/recomendacion-estandares-iso-tc211.pdf',
                'Hoja de ruta para la adopción nacional del catálogo ISO/TC 211, que respalda la implementación de ISO 19115, ISO 19157 e ISO 19110 en la producción geoespacial del Estado.'],
        [       '(IDE Chile / SNIT, 2024d)',
                'Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024). Sistema de Referencia Geodésico para Chile, SIRGAS época 2016.0: '
                'Marco de referencia publicado por el Instituto Geográfico Militar. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales.',
                'Marco de Referencia Geodésico Oficial',
                'Secretaría Ejecutiva SNIT / IGM / IDE Chile',
                '2024',
                'Sistema de Referencia Geodésico para Chile, SIRGAS época 2016.0',
                'https://www.ide.cl/documentos/sistema-referencia-geodesico-sirgas-2016.pdf',
                'Marco de referencia geodésico oficial de Chile que sustenta el uso de EPSG:5361 (SIRGAS-Chile) y orienta la reproyección conforme a EPSG:32719 (UTM Huso 19S) utilizada en el Atlas.'],
        [       '(IDE Chile, GeoNodo)',
                'Infraestructura de Datos Geoespaciales de Chile [IDE Chile]. (s.f.). GeoNodo Chile: Plataforma Nacional de Datos '
                'Geoespaciales Abiertos (Plataforma de publicación basada en GeoNode). Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales.',
                'Plataforma Nacional de Datos Abiertos',
                'Secretaría Ejecutiva SNIT / IDE Chile',
                's.f.',
                'GeoNodo Chile: Plataforma Nacional de Datos Geoespaciales Abiertos',
                'https://www.ide.cl/productos-y-servicios/herramientas/geonodo/',
                'Catálogo nacional federado de servicios web interoperables OGC (WMS, WFS, WCS, CSW) que distribuye las capas '
                'institucionales de Chile. Accesible en https://www.geonodo.cl'],
        [       '(IDE Chile / SNIT, 2024e)',
                'Infraestructura de Datos Geoespaciales de Chile [IDE Chile / SNIT]. (2024). Interoperabilidad de servicios WMS: '
                'Vocabularios, sintaxis y convenciones comunes para los Web Map Service de la red institucional chilena. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales.',
                'Recomendación Técnica Oficial',
                'Secretaría Ejecutiva SNIT / IDE Chile',
                '2024',
                'Interoperabilidad de servicios WMS',
                'https://www.ide.cl/documentos/recomendacion-interoperabilidad-wms.pdf',
                'Vocabularios, sintaxis y convenciones comunes para los Web Map Service de la red institucional chilena, que sustentan la interoperabilidad de las capas IDE Chile consumidas como referencia en el Atlas.'],
        [       '(Fuenzalida, 2025)',
                'Fuenzalida, M. (2025). Taller Datos Abiertos e Infraestructura de Datos Espaciales en Chile: Integración de VGI y '
                'Políticas Públicas. Conferencia y Seminario IDE Chile, Ministerio de Bienes Nacionales.',
                'Ponencia en Seminario / Taller Oficial',
                'Fuenzalida, Manuel',
                '2025',
                'Taller Datos Abiertos e Infraestructura de Datos Espaciales en Chile',
                'https://www.ide.cl/images/conferencias-seminarios/2025/',
                'Seminario sobre la convergencia técnica entre datos abiertos colaborativos (VGI) y las plataformas de información '
                'territorial del Estado.'],
        [       '(D.S. N° 28/2006)',
                'Ministerio de Bienes Nacionales. (2006). Decreto Supremo N° 28/2006: Crea Comisión Asesora del Sistema Nacional de '
                'Información Territorial (SNIT). Diario Oficial de la República de Chile.',
                'Decreto Supremo de la República',
                'Gobierno de Chile / Ministerio de Bienes Nacionales',
                '2006',
                'Decreto Supremo N° 28/2006 (Creación del SNIT)',
                'https://www.bcn.cl/leychile/navegar?idNorma=251642',
                'Base jurídica que instituyó el Sistema Nacional de Información Territorial (SNIT) y la coordinación interministerial de '
                'información espacial en Chile.'],
        [       '(Ley N° 17.336)',
                'Ministerio de Educación Pública. (1970). Ley N° 17.336 sobre Propiedad Intelectual. Diario Oficial de la República de '
                'Chile (Texto refundido y actualizado a 2024).',
                'Ley de la República de Chile',
                'Congreso Nacional de Chile',
                '1970',
                'Ley N° 17.336 de Propiedad Intelectual',
                'https://www.bcn.cl/leychile/navegar?idNorma=28933',
                'Marco legal que respalda el licenciamiento abierto Creative Commons (CC BY-SA 4.0) para obras cartográficas y manuales '
                'técnicos en Chile.'],
        [       '(Ley N° 20.285)',
                'Ministerio Secretaría General de la Presidencia [SEGPRES]. (2008). Ley N° 20.285 sobre Acceso a la Información Pública y '
                'Principio de Transparencia. Diario Oficial de la República de Chile.',
                'Ley de la República de Chile',
                'Congreso Nacional de Chile',
                '2008',
                'Ley N° 20.285 sobre Acceso a la Información Pública',
                'https://www.bcn.cl/leychile/navegar?idNorma=278858',
                'Consagra el principio de datos abiertos y publicidad activa de la información geoespacial producida por organismos de la '
                'administración del Estado.'],
        [       '(Ley N° 17.288)',
                'Consejo de Monumentos Nacionales [CMN]. (2020). Ley N° 17.288 de Monumentos Nacionales y Normas Relacionadas. Ministerio '
                'de las Culturas, las Artes y el Patrimonio, Gobierno de Chile.',
                'Ley de la República de Chile',
                'Consejo de Monumentos Nacionales',
                '2020',
                'Ley N° 17.288 de Monumentos Nacionales',
                'https://www.monumentos.gob.cl/',
                'Norma que ampara la protección jurídica de la Zona Típica de Barrio Brasil, Monumentos Históricos y el patrimonio de la '
                'manzana UAH.'],
        [       '(Ley N° 21.156)',
                'Ministerio de Salud [MINSAL]. (2019). Ley N° 21.156: Establece la obligación de disponer de desfibriladores externos '
                'automáticos portátiles en recintos públicos. Diario Oficial de la República de Chile.',
                'Ley de la República de Chile',
                'Ministerio de Salud',
                '2019',
                'Ley N° 21.156 (Desfibriladores en Espacios Públicos)',
                'https://www.bcn.cl/leychile/navegar?idNorma=1131750',
                'Mandato legal que fundamenta el mapeo georreferenciado de dispositivos DEA en estaciones de Metro, campus universitarios '
                'y recintos masivos.'],
        [       '(Ley N° 20.564)',
                'Ministerio del Interior y Seguridad Pública. (2012). Ley N° 20.564: Ley Marco de Bomberos de Chile. Diario Oficial de la '
                'República de Chile.',
                'Ley de la República de Chile',
                'Congreso Nacional de Chile',
                '2012',
                'Ley N° 20.564 (Ley Marco de Bomberos de Chile)',
                'https://www.bcn.cl/leychile/navegar?idNorma=1036814',
                'Reconoce formalmente a las compañías de bomberos como parte del sistema nacional de protección civil y emergencias.'],
        [       '(Ley N° 20.920)',
                'Ministerio del Medio Ambiente [MMA]. (2016). Ley N° 20.920: Marco para la Gestión de Residuos, Responsabilidad Extendida '
                'del Productor y Fomento al Reciclaje (Ley REP). Diario Oficial de la República de Chile.',
                'Ley de la República de Chile',
                'Ministerio del Medio Ambiente',
                '2016',
                'Ley N° 20.920 (Ley REP y Fomento al Reciclaje)',
                'https://www.bcn.cl/leychile/navegar?idNorma=1090894',
                'Sustento legal para la georreferenciación de puntos limpios, campanas de reciclaje comunal y trazabilidad de residuos.'],
        [       '(MINVU, 2016 [D.S. 50])',
                'Ministerio de Vivienda y Urbanismo [MINVU]. (2016). Decreto Supremo N° 50: Modifica la Ordenanza General de Urbanismo y '
                'Construcciones en materia de accesibilidad universal. Diario Oficial de la República de Chile.',
                'Decreto Supremo / Norma Urbanística',
                'MINVU',
                '2016',
                'Decreto Supremo N° 50 (OGUC Accesibilidad Universal)',
                'https://www.bcn.cl/leychile/navegar?idNorma=1087816',
                'Norma que establece los parámetros técnicos obligatorios de rebajes de solera (vados), franjas podotáctiles y '
                'accesibilidad universal (CAT-07).'],
        [       '(DTPM, 2023)',
                'Directorio de Transporte Público Metropolitano [DTPM]. (2023). Manual de Normas Técnicas para Paraderos e Infraestructura '
                'del Sistema Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile.',
                'Manual Técnico Ministerial',
                'DTPM / MTT',
                '2023',
                'Manual de Normas Técnicas para Paraderos Red Movilidad',
                'https://www.dtpm.cl',
                'Estándar oficial para el diseño, identificación única (código ref=PA...), señalética y andenes de paradas de bus en el '
                'Gran Santiago.'],
        [       '(DTPM, 2024)',
                'Directorio de Transporte Público Metropolitano [DTPM]. (2024). Reporte de Cobertura, Accesibilidad y Gestión de Paradas '
                'Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile.',
                'Informe Técnico de Gestión',
                'DTPM / MTT',
                '2024',
                'Reporte de Cobertura, Accesibilidad y Gestión de Paradas Red Movilidad',
                'https://www.dtpm.cl',
                'Estadísticas y diagnósticos espaciales de la red de transporte en la comuna de Santiago.'],
        [       '(CONAF, 2019)',
                'Corporación Nacional Forestal [CONAF]. (2019). Guía de Campo: Árboles Urbanos de Chile. Ministerio de Agricultura, '
                'Gobierno de Chile.',
                'Guía Botánica / Manual Técnico',
                'CONAF',
                '2019',
                'Guía de Campo: Árboles Urbanos de Chile',
                'https://www.conaf.cl',
                'Clasificación taxonómica de las especies arbóreas dominantes en plazas y veredas de la cuenca de Santiago (CAT-08).'],
        [       '(MINVU, 2020)',
                'Ministerio de Vivienda y Urbanismo [MINVU]. (2020). Manual de Vialidad Cicloinclusiva y Directrices de Diseño de '
                'Ciclovías Urbanas. Gobierno de Chile.',
                'Manual de Diseño Vial',
                'MINVU / MTT',
                '2020',
                'Manual de Vialidad Cicloinclusiva',
                'https://www.minvu.gob.cl',
                'Estándar constructivo y de señalización vial para ciclovías segregadas, ciclobandas y calles calmadas (CAT-04).'],
        [       '(MINVU, 2021)',
                'Ministerio de Vivienda y Urbanismo [MINVU]. (2021). Política Nacional de Parques Urbanos y Estándares de Áreas Verdes '
                'Públicas. MINVU, Gobierno de Chile.',
                'Política Pública Ministerial',
                'MINVU',
                '2021',
                'Política Nacional de Parques Urbanos',
                'https://www.minvu.gob.cl',
                'Directrices de dotación, accesibilidad peatonal y conservación de plazas barriales y parques públicos urbanos (CAT-05).'],
        [       '(Municipalidad de Santiago, 2019)',
                'Municipalidad de Santiago. (2019). Plan Regulador Comunal de Santiago: Catálogo de Inmuebles y Zonas de Conservación '
                'Histórica. Dirección de Obras Municipales, Ilustre Municipalidad de Santiago.',
                'Instrumento de Planificación Territorial',
                'Ilustre Municipalidad de Santiago',
                '2019',
                'Plan Regulador Comunal de Santiago (PRC)',
                'https://www.munistgo.cl',
                'Instrumento legal que fija las alturas máximas, usos de suelo y protección patrimonial en el polígono Barrio Brasil - '
                'UAH.'],
        [       '(ISO 19157:2013)',
                'International Organization for Standardization. (2013). Geographic information — Data quality (ISO Standard No. '
                '19157:2013). ISO.',
                'Norma Internacional de Calidad',
                'ISO/TC 211',
                '2013',
                'ISO 19157:2013: Geographic information — Data quality',
                'https://www.iso.org/standard/32575.html',
                'Estándar internacional que define los principios de evaluación de calidad: completitud, consistencia lógica, exactitud '
                'posicional, temporal y temática.'],
        [       '(ISO 19115-1:2014)',
                'International Organization for Standardization. (2014). Geographic information — Metadata — Part 1: Fundamentals (ISO '
                'Standard No. 19115-1:2014). ISO.',
                'Norma Internacional de Metadatos',
                'ISO/TC 211',
                '2014',
                'ISO 19115-1:2014: Geographic information — Metadata',
                'https://www.iso.org/standard/53798.html',
                'Estructura general para la catalogación y metadatos de recursos geoespaciales, adoptada en el Perfil Nacional de Chile.'],
        [       '(ISO 19110:2016)',
                'International Organization for Standardization. (2016). Geographic information — Methodology for feature cataloguing (ISO '
                'Standard No. 19110:2016). ISO.',
                'Norma Internacional de Catálogo de Objetos',
                'ISO/TC 211',
                '2016',
                'ISO 19110:2016: Methodology for feature cataloguing',
                'https://www.iso.org/standard/57303.html',
                'Metodología para documentar la semántica, tipos de entidades, atributos y operaciones de las capas territoriales del '
                'Atlas.'],
        [       '(ISO 19119:2016)',
                'International Organization for Standardization. (2016). Geographic information — Services (ISO Standard No. '
                '19119:2016/Amd 1:2019). ISO.',
                'Norma Internacional de Servicios Web',
                'ISO/TC 211',
                '2016',
                'ISO 19119:2016: Geographic information — Services',
                'https://www.iso.org/standard/59221.html',
                'Arquitectura de servicios web geográficos (procesamiento, catálogo y acceso a datos) para interoperabilidad en internet.'],
        [       '(ISO/TS 19139:2007)',
                'International Organization for Standardization. (2007). Geographic information — Metadata — XML schema implementation '
                '(ISO Technical Specification No. 19139:2007). ISO.',
                'Especificación Técnica XML',
                'ISO/TC 211',
                '2007',
                'ISO/TS 19139:2007: Metadata XML schema implementation',
                'https://www.iso.org/standard/32574.html',
                'Gramática formal y esquema XML que implementa ISO 19115 para intercambio federado en GeoNetwork y GeoNodo.'],
        [       '(ISO 19128:2005)',
                'International Organization for Standardization. (2005). Geographic information — Web map server interface (ISO Standard '
                'No. 19128:2005 / OGC WMS). ISO / OGC.',
                'Norma Internacional WMS',
                'ISO/TC 211 & Open Geospatial Consortium',
                '2005',
                'ISO 19128:2005: Web map server interface (WMS)',
                'https://www.iso.org/standard/32520.html',
                'Protocolo estándar para servir imágenes de mapas georreferenciados en internet a través de clientes web y SIG de '
                'escritorio.'],
        [       '(ISO 21542:2021)',
                'International Organization for Standardization. (2021). Building construction — Accessibility and usability of the built '
                'environment (ISO Standard No. 21542:2021). ISO.',
                'Norma Internacional de Accesibilidad',
                'ISO',
                '2021',
                'ISO 21542:2021: Accessibility and usability of the built environment',
                'https://www.iso.org/standard/70494.html',
                'Criterios de diseño accesible aplicados a la evaluación física de veredas, rampas peatonales y accesos en Barrio Brasil.'],
        [       '(OGC, 2019)',
                'Open Geospatial Consortium. (2019). OGC API - Features - Part 1: Core (Standard No. OGC 17-069r3). Open Geospatial '
                'Consortium.',
                'Estándar Web Moderno de Datos',
                'Open Geospatial Consortium [OGC]',
                '2019',
                'OGC API - Features - Part 1: Core',
                'https://ogcapi.ogc.org/features/',
                'Estándar web RESTful moderno basado en JSON y GeoJSON para consultar y filtrar colecciones de vectores espaciales.'],
        [       '(UN-GGIM, 2020)',
                'United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2020). Integrated Geospatial '
                'Information Framework (IGIF): A strategic guide to develop and strengthen national geospatial information management. '
                'United Nations.',
                'Marco Estratégico Global',
                'UN-GGIM',
                '2020',
                'Integrated Geospatial Information Framework (IGIF)',
                'https://ggim.un.org/IGIF/',
                'Marco de referencia mundial de Naciones Unidas basado en 9 vías estratégicas para fortalecer la gestión geoespacial de '
                'los países.'],
        [       '(UN-GGIM, 2024)',
                'United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2024). Future trends in '
                'geospatial information management: The five to ten year vision (4th ed.). United Nations.',
                'Informe Prospectivo Global',
                'UN-GGIM',
                '2024',
                'Future trends in geospatial information management: The five to ten year vision',
                'https://ggim.un.org/',
                'Tendencias estratégicas hacia 2030: integración de datos ciudadanos VGI, ética algorítmica, gemelos digitales y soberanía '
                'del dato.'],
        [       '(CP-IDEA / UN-GGIM: Américas, 2013)',
                'Comité Permanente para la Infraestructura de Datos Geoespaciales de las Américas [CP-IDEA]. (2013). De la CP-IDEA a '
                'UN-GGIM: Américas: Hacia la consolidación de la Infraestructura de Datos Espaciales de las Américas. Naciones Unidas.',
                'Informe Regional de Consolidación',
                'CP-IDEA / UN-GGIM: Américas',
                '2013',
                'De la CP-IDEA a UN-GGIM: Américas',
                'https://www.un-ggim-americas.org/',
                'Historia de la transición institucional de las IDE en las Américas hacia el marco global de UN-GGIM.'],
        [       '(Nebert, 2004)',
                'Nebert, D. D. (Ed.). (2004). Developing Spatial Data Infrastructures: The SDI Cookbook (v2.0). Global Spatial Data '
                'Infrastructure Association (GSDI).',
                'Manual de Referencia Global',
                'Nebert, Douglas D. / GSDI',
                '2004',
                'Developing Spatial Data Infrastructures: The SDI Cookbook',
                'https://www.gsdiassociation.org/',
                "El manual fundacional global ('SDI Cookbook') que definió la tríada de datos, metadatos, catálogo y servicios para las "
                'IDE modernas.'],
        [       '(Snyder, 1987)',
                'Snyder, J. P. (1987). Map projections: a working manual (U.S. Geological Survey Professional Paper No. 1395). U.S. '
                'Government Printing Office.',
                'Tratado de Geodesia y Cartografía Matemática',
                'Snyder, John P. / USGS',
                '1987',
                'Map Projections: A Working Manual',
                'https://doi.org/10.3133/pp1395',
                'Formulación matemática exacta para las proyecciones conformes Transverse Mercator (UTM Huso 19S / EPSG:32719).'],
        [       '(Topf & OSMF, 2024)',
                'Topf, J., & OpenStreetMap Contributors. (2024). Taginfo: OpenStreetMap tag statistics, semantic consistency and usage '
                'system. OpenStreetMap Foundation.',
                'Plataforma de Auditoría y Semántica VGI',
                'Topf, Jochen / OSMF',
                '2024',
                'Taginfo: OpenStreetMap tag statistics and usage system',
                'https://taginfo.openstreetmap.org/',
                'Plataforma oficial de estadística de uso de etiquetas en OSM, empleada para auditar consistencia semántica y frecuencia '
                'de tags.'],
        [       '(OSMF & Geofabrik, 2024)',
                'OpenStreetMap Foundation & Geofabrik GmbH. (2024). Taginfo Chile: Base de datos y estadísticas regionales de etiquetas de '
                'OpenStreetMap en Chile. Geofabrik.',
                'Instancia Regional de Estadísticas OSM',
                'Geofabrik GmbH / OSM Chile',
                '2024',
                'Taginfo Chile: Regional OpenStreetMap Tag Usage',
                'https://taginfo.geofabrik.de/south-america:chile',
                'Servidor regional específico para Chile con el cómputo exhaustivo de claves y valores utilizados en el territorio '
                'nacional.'],
        [       '(WikiProject Chile, 2024)',
                'OpenStreetMap Foundation & Comunidad OSM Chile. (2024). WikiProject Chile: Guía, directrices y convenciones comunitarias '
                'de mapeo para Chile. OpenStreetMap Wiki.',
                'Guía Comunitaria de Mapeo',
                'Comunidad OpenStreetMap Chile',
                '2024',
                'WikiProject Chile: Guía de Mapeo',
                'https://wiki.openstreetmap.org/wiki/WikiProject_Chile',
                'Consenso comunitario sobre cómo etiquetar paraderos Red, colegios, monumentos y vías en Chile.'],
        [       '(Open Data Commons, 2010)',
                'Open Data Commons. (2010). Open Database License (ODbL) v1.0. Open Knowledge Foundation.',
                'Licencia Legal de Bases de Datos',
                'Open Knowledge Foundation',
                '2010',
                'Open Database License (ODbL) v1.0',
                'https://opendatacommons.org/licenses/odbl/',
                'Marco legal de datos de OpenStreetMap que garantiza el derecho a compartir y enriquecer la base sin cercamiento '
                'privativo.'],
        [       '(HeiGIT, 2023)',
                'Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2023). ohsome API: OpenStreetMap History Analytics API '
                'Documentation (v1 & v2). Heidelberg University.',
                'Documentación de API Analítica',
                'HeiGIT / Universidad de Heidelberg',
                '2023',
                'ohsome API: OpenStreetMap History Analytics API',
                'https://api.ohsome.org/',
                'API analítica para la extracción de métricas históricas de evolución temporal, conteo de entidades y linaje de editores '
                'únicos en OSM.'],
        [       '(HeiGIT, 2024)',
                'Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2024). OpenStreetMap Quality Tool (OQT API): Automated '
                'spatial data quality assessment. Heidelberg University.',
                'API y Herramienta de Calidad Espacial',
                'HeiGIT',
                '2024',
                'OpenStreetMap Quality Tool (OQT API)',
                'https://dashboard.ohsome.org/',
                'Herramienta y API que evalúa indicadores de completitud de atributos, densidad de mapeo y saturación de datos en OSM.'],
        [       '(Wille & Mapbox, 2023)',
                'Wille, L., & OpenStreetMap Community. (2023). OSMCha: OpenStreetMap Changeset Analyzer and Quality Validation Tool. '
                'Mapbox / Development Seed.',
                'Herramienta y API de Validación VGI',
                'Wille, Lucas / Development Seed',
                '2023',
                'OSMCha: OpenStreetMap Changeset Analyzer',
                'https://osmcha.org/',
                'Plataforma de auditoría para inspeccionar cambios en tiempo real, detectar posibles ediciones sospechosas y auditar la '
                'autoría de datos.'],
        [       '(Raifer et al., 2019)',
                'Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019). OSHDB: a framework for spatio-temporal analysis of '
                'OpenStreetMap history data. EPJ Data Science, 8(1), 1-18.',
                'Artículo Científico sobre Motor de Datos',
                'Raifer, M. et al.',
                '2019',
                'OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data',
                'https://doi.org/10.1140/epjds/s13688-019-0208-0',
                'Arquitectura técnica de almacenamiento de alto rendimiento que sustenta los cómputos de la API de ohsome.'],
        [       '(OSMF, 2023)',
                'OpenStreetMap Foundation [OSMF]. (2023). Overpass API: A high-performance read-only API serving custom spatial subsets of '
                'OpenStreetMap. OSMF.',
                'Documentación Oficial de API',
                'OpenStreetMap Foundation',
                '2023',
                'Overpass API Documentation',
                'https://wiki.openstreetmap.org/wiki/Overpass_API',
                'Servicio de API REST de sólo lectura optimizado para búsquedas filtradas por bounding box, etiquetas y relaciones '
                'espaciales complejas.'],
        [       '(GBIF Secretariat, 2024)',
                'Global Biodiversity Information Facility [GBIF]. (2024). GBIF Occurrence API & Species API (v1 REST API Documentation). '
                'GBIF Secretariat.',
                'Documentación Oficial de API',
                'GBIF Secretariat',
                '2024',
                'GBIF Occurrence API & Species API v1',
                'https://www.gbif.org/developer/summary',
                'Servicio web RESTful para consultar observaciones georreferenciadas de especies biológicas y taxonomía '
                'zoológica/botánica.'],
        [       '(TDWG, 2023)',
                'Biodiversity Information Standards [TDWG]. (2023). Darwin Core standard: Quick reference guide. Biodiversity Information '
                'Standards.',
                'Estándar Técnico de Biodiversidad',
                'TDWG',
                '2023',
                'Darwin Core Standard: Quick Reference Guide',
                'https://dwc.tdwg.org/terms/',
                'Glosario de términos y estándar de metadatos empleado por GBIF para intercambiar observaciones biológicas (CAT-08).'],
        [       '(Ecma International, 2024)',
                'Ecma International. (2024). ECMAScript® 2024 Language Specification (Standard ECMA-262, 15th ed.). Ecma International.',
                'Estándar / Manual Técnico de Lenguaje',
                'Ecma International',
                '2024',
                'ECMAScript® 2024 Language Specification (Standard ECMA-262)',
                'https://www.ecma-international.org/publications-and-standards/standards/ecma-262/',
                'Especificación del lenguaje JavaScript utilizado para la arquitectura modular, cálculos geodésicos en cliente y '
                'reactividad del Atlas.'],
        [       '(Van Rossum & Drake, 2024)',
                'Van Rossum, G., & Drake, F. L. (2024). The Python Language Reference (Manual v3.12). Python Software Foundation.',
                'Manual Oficial de Lenguaje',
                'Python Software Foundation',
                '2024',
                'The Python Language Reference (v3.12)',
                'https://docs.python.org/3/reference/',
                'Manual del lenguaje Python empleado en los scripts de generación automatizada de catálogos Excel y sincronización de '
                'metadatos.'],
        [       '(WHATWG, 2024)',
                'Web Hypertext Application Technology Working Group [WHATWG]. (2024). HTML Living Standard. WHATWG / World Wide Web '
                'Consortium.',
                'Estándar / Especificación de Lenguaje de Marcado',
                'WHATWG / W3C',
                '2024',
                'HTML Living Standard: The specification for web application developers',
                'https://html.spec.whatwg.org/multipage/',
                'Especificación del lenguaje de marcado semántico que estructura la interfaz, paneles modulares y manual in-app del '
                'Atlas.'],
        [       '(W3C, 2023)',
                'World Wide Web Consortium [W3C]. (2023). Cascading Style Sheets (CSS) Snapshot 2023 (W3C Working Group Note). W3C.',
                'Estándar / Especificación de Hojas de Estilo',
                'World Wide Web Consortium [W3C]',
                '2023',
                'Cascading Style Sheets (CSS) Snapshot 2023',
                'https://www.w3.org/TR/css-2023/',
                'Estándar de estilos web que define la estética técnica sobria, diseño cartográfico y diagramas vectoriales del sistema.'],
        [       '(Olbricht & OSMF, 2023)',
                'Olbricht, R., & OpenStreetMap Contributors. (2023). Overpass QL: Overpass API Language Guide and Reference Manual. '
                'OpenStreetMap Foundation.',
                'Manual Técnico / Lenguaje de Consulta',
                'OpenStreetMap Foundation',
                '2023',
                'Overpass QL: Overpass API Language Guide and Reference Manual',
                'https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL',
                'Manual formal del lenguaje de consulta espacial empleado para extraer nodos, vías y relaciones filtradas desde servidores '
                'Overpass.'],
        [       '(Butler et al., 2016)',
                'Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016). The GeoJSON Format (RFC No. 7946). Internet '
                'Engineering Task Force (IETF).',
                'Estándar de Protocolo / Formato de Intercambio Espacial',
                'Internet Engineering Task Force [IETF]',
                '2016',
                'The GeoJSON Format (RFC 7946)',
                'https://doi.org/10.17487/RFC7946',
                'Especificación del formato estándar de intercambio geográfico para el transporte y procesamiento de geometrías '
                'vectoriales en el Atlas.'],
        [       '(W3C, 2018)',
                'World Wide Web Consortium [W3C]. (2018). Scalable Vector Graphics (SVG) 2.0 Specification (W3C Candidate Recommendation). '
                'W3C.',
                'Estándar / Especificación de Gráficos Vectoriales',
                'World Wide Web Consortium [W3C]',
                '2018',
                'Scalable Vector Graphics (SVG) 2.0 Specification',
                'https://www.w3.org/TR/SVG2/',
                'Especificación de gráficos vectoriales XML empleada en los esquemas arquitectónicos y diagramas geodésicos del manual '
                'técnico.'],
        [       '(MacFarlane et al., 2024)',
                'MacFarlane, J., Krewenki, P., Greenspun, J., et al. (2024). CommonMark Spec: A strongly defined, highly compatible '
                'specification of Markdown (Version 0.31.2). CommonMark.',
                'Especificación de Lenguaje de Documentación',
                'CommonMark Working Group',
                '2024',
                'CommonMark Spec: Markdown specification',
                'https://spec.commonmark.org/',
                'Estándar de texto plano estructurado utilizado en la memoria técnica académica, bitácoras de versión y guías de '
                'contribución.']]

    for r_idx, bib in enumerate(bibliografia_apa, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(bib, 1):
            cell = ws4.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx in (1, 5, 7) else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws4.row_dimensions[r_idx].height = 42
        
    autoajustar_columnas(ws4, max_len_cap=42)
    
    # Guardado dual sincronizado (docs/ y src/docs/)
    ruta_docs = os.path.join(DOCS_DIR, "categorias_tematicas_osm.xlsx")
    ruta_src_docs = os.path.join(SRC_DOCS_DIR, "categorias_tematicas_osm.xlsx")
    
    wb.save(ruta_docs)
    print(f"[+] Generado libro Excel maestro: {ruta_docs}")
    shutil.copyfile(ruta_docs, ruta_src_docs)
    print(f"[+] Sincronizado para descarga web: {ruta_src_docs}")

def sincronizar_todos_los_catalogos():
    """Asegura que los tres catálogos Excel y la documentación existan tanto en docs/ como en src/docs/"""
    for nombre in ["catalogo_fuentes_vgi.xlsx", "perfil_metadatos_vgi.xlsx", "categorias_tematicas_osm.xlsx"]:
        origen = os.path.join(DOCS_DIR, nombre)
        destino = os.path.join(SRC_DOCS_DIR, nombre)
        if os.path.exists(origen):
            shutil.copyfile(origen, destino)
            print(f"[+] Catálogo sincronizado: {nombre} -> src/docs/")
    
    # Sincronización de TRAZABILIDAD_ACADEMICA.md
    origen_md = os.path.join(DOCS_DIR, "TRAZABILIDAD_ACADEMICA.md")
    destino_md = os.path.join(SRC_DOCS_DIR, "TRAZABILIDAD_ACADEMICA.md")
    if os.path.exists(origen_md):
        shutil.copyfile(origen_md, destino_md)
        print(f"[+] Documento académico sincronizado: TRAZABILIDAD_ACADEMICA.md -> src/docs/")

if __name__ == "__main__":
    print("Iniciando generación de libros Excel para la práctica profesional...")
    crear_catalogo_fuentes()
    crear_perfil_metadatos()
    crear_categorias_tematicas_osm()
    sincronizar_todos_los_catalogos()
    print("¡Todos los archivos Excel (.xlsx) fueron generados y sincronizados con éxito en docs/ y src/docs/!")
