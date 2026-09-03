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
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "docs")
os.makedirs(DOCS_DIR, exist_ok=True)

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
    ws1 = wb.active
    ws1.title = "Catálogo Fuentes VGI"
    
    ws1["A1"] = "ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA (VGI) — GESTIÓN TERRITORIAL"
    ws1["A1"].font = fuente_titulo
    ws1["A2"] = "Catálogo Sistemático de Fuentes de Datos Colaborativos y Abiertos | Caso: Barrio Brasil y Universidad Alberto Hurtado (Santiago Centro, Chile)"
    ws1["A2"].font = fuente_subtitulo
    
    headers = [
        "Fuente", "Tipo de Dato", "Cobertura Espacial", "Cobertura Temporal",
        "Frecuencia Actualización", "Escala / Nivel Detalle", "Licencia de Uso",
        "Protocolo / API de Acceso", "Utilidad en Gestión Territorial",
        "Limitaciones Conocidas", "Ejemplo Caso Barrio Brasil / UAH"
    ]
    
    for c_idx, h in enumerate(headers, 1):
        cell = ws1.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws1.row_dimensions[4].height = 28
    
    filas = [
        [
            "OpenStreetMap (OSM)",
            "Vectorial (puntos, líneas, polígonos con atributos semánticos)",
            "Global / Comuna de Santiago (Barrio Brasil)",
            "2004 – Presente (en tiempo real)",
            "Continua (minuto a minuto por colaboradores)",
            "Detalle catastral / escala 1:1.000 a 1:5.000",
            "Open Database License (ODbL) 1.0",
            "Overpass API (QL) / OSM API 0.6",
            "Catastro de infraestructura universitaria, equipamiento social, trazado vial y ciclovías.",
            "Heterogeneidad en completitud semántica de etiquetas secundarias.",
            "Pabellones UAH (Almirante Barroso/Erasmo Escala), paraderos Alameda, locales de Barrio Brasil."
        ],
        [
            "ohsome (HeiGIT)",
            "Estadísticas espacio-temporales y métricas de calidad",
            "Global / Cuadrantes definidos por Bbox",
            "2007 – 2026 (historial completo de cambios)",
            "Mensual / Sincronizado periódicamente",
            "Agregado a nivel de polígono o cuadrante",
            "Derivada ODbL (datos OSM subyacentes)",
            "REST API v1 (/elements/count, /users/count)",
            "Monitoreo de la dinámica de mapeo, madurez del catastro y recuento de colaboradores activos.",
            "Depende del retardo de ingestión de los extracts globales (toTimestamp).",
            "Medición de densidad de edificaciones y colaboradores únicos en la manzana UAH últimos 5 años."
        ],
        [
            "GBIF (Global Biodiversity Information Facility)",
            "Registros biológicos puntuales georreferenciados",
            "Global / Chile / Región Metropolitana",
            "Histórica (siglo XIX) – Presente (iNaturalist)",
            "Diaria / Semanal",
            "Puntual con radio de incertidumbre métrica",
            "CC0, CC-BY 4.0, CC-BY-NC 4.0 según publicador",
            "Occurrence REST API v1 (/occurrence/search)",
            "Diagnóstico de biodiversidad urbana, avifauna en plazas y arbolado patrimonial.",
            "Sesgo hacia especies carismáticas y áreas con mayor flujo peatonal (parques).",
            "Avistamientos de aves urbanas (Zonotrichia capensis, Columbina picui) en Plaza Brasil y campus UAH."
        ],
        [
            "UMap (OpenStreetMap)",
            "Cartografía temática participativa (GeoJSON / capas)",
            "Instancias locales / umap.openstreetmap.fr",
            "Según ciclo de vida del proyecto comunitario",
            "Esporádica (definida por el autor del mapa)",
            "Barrial / Comunal",
            "Declarada por el autor del proyecto",
            "Embebido iframe / Descarga directa GeoJSON",
            "Integración de iniciativas ciudadanas previas (rutas patrimoniales, catastros comunitarios).",
            "Inexistencia de API centralizada; posibles bloqueos de CORS en descarga directa.",
            "Mapas colaborativos de casonas patrimoniales y circuitos culturales de Barrio Brasil."
        ],
        [
            "iNaturalist / Red de Ciencia Ciudadana",
            "Observaciones fotográficas validadas por comunidad (Grado de Investigación)",
            "Nacional / Urbano (Santiago)",
            "2015 – Presente",
            "Tiempo real / Continua",
            "Puntos con precisión GPS de teléfonos inteligentes",
            "Creative Commons (CC-BY, CC-BY-NC)",
            "API iNaturalist v1 / Sincronizado vía GBIF",
            "Identificación de especies arbóreas e invertebrados en plazas públicas y patios universitarios.",
            "Menor cobertura en espacios privados o interiores de manzana.",
            "Registro de flora nativa e introducida en jardines de Cienfuegos y Plaza Brasil."
        ],
        [
            "IDE Chile (Referencia Oficial)",
            "Capas vectoriales e información geográfica oficial del Estado",
            "Nacional / Regional / Comunal",
            "Oficial / Censal (2017, 2024)",
            "Anual / Semestral por ministerios",
            "1:5.000 a 1:250.000",
            "Datos Abiertos del Estado / Ley de Transparencia",
            "WMS, WFS, CSW (Catálogo Nacional)",
            "Línea base oficial para contrastar completitud de la VGI (límites censales, áreas protegidas).",
            "Actualización lenta comparada con la dinámica de la VGI en terreno.",
            "Límite comunal de Santiago, zonificación PRC Santiago y vialidad estructurante MOP/MINVU."
        ]
    ]
    
    for r_idx, fila in enumerate(filas, 5):
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
    
    ruta_salida = os.path.join(DOCS_DIR, "catalogo_fuentes_vgi.xlsx")
    wb.save(ruta_salida)
    print(f"[+] Generado: {ruta_salida}")

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
    ws1 = wb.active
    ws1.title = "Categorías Temáticas OSM"
    
    ws1["A1"] = "TAXONOMÍA Y CATEGORÍAS TEMÁTICAS VGI BASADAS EN OPENSTREETMAP"
    ws1["A1"].font = fuente_titulo
    ws1["A2"] = "Estructura de Extracción y Normalización Territorial | Foco: Barrio Brasil y Entorno Universidad Alberto Hurtado"
    ws1["A2"].font = fuente_subtitulo
    
    headers = [
        "Cód.", "Categoría Temática", "Subcategorías Clave",
        "Etiquetas OSM Principales (Key=Value)", "Tipo Geometría",
        "Filtro Overpass QL Sugerido", "Atributos Mínimos Esperados",
        "Aplicación Territorial (Barrio Brasil / UAH)"
    ]
    
    for c_idx, h in enumerate(headers, 1):
        cell = ws1.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = borde_fino
    ws1.row_dimensions[4].height = 28
    
    categorias = [
        [
            "CAT-01",
            "Educación y Equipamientos Universitarios",
            "Universidades, facultades, bibliotecas, auditorios, comedores",
            'amenity=university, amenity=college, amenity=library, building=university',
            "Puntos, Polígonos",
            'node["amenity"~"university|college|library"]({{bbox}}); way["amenity"~"university|college|library"]({{bbox}});',
            "name, operator, amenity, building, addr:street, addr:housenumber",
            "Campus Central UAH (Erasmo Escala, Almirante Barroso, Cienfuegos, Los Héroes)."
        ],
        [
            "CAT-02",
            "Servicios, Comercio y Abastecimiento",
            "Almacenes, farmacias, cafeterías, bancos, notarías, restaurantes",
            'shop=*, amenity=cafe, amenity=restaurant, amenity=bank, amenity=pharmacy',
            "Puntos, Polígonos",
            'node["shop"]({{bbox}}); node["amenity"~"cafe|restaurant|bank|pharmacy"]({{bbox}});',
            "name, shop, amenity, opening_hours, payment:cash, wheelchair",
            "Comercio local en Av. Brasil, calle Huérfanos, Compañía y Alameda."
        ],
        [
            "CAT-03",
            "Movilidad y Transporte Público",
            "Estaciones de metro, paraderos de buses Red, vías troncales",
            'railway=station, public_transport=stop_position, highway=bus_stop',
            "Puntos, Líneas",
            'node["railway"="station"]({{bbox}}); node["highway"="bus_stop"]({{bbox}}); way["highway"~"primary|secondary|tertiary"]({{bbox}});',
            "name, network, operator, ref, route_ref, wheelchair",
            "Metro Los Héroes (L1/L2), Santa Ana (L2/L5), paraderos en Alameda y Manuel Rodríguez."
        ],
        [
            "CAT-04",
            "Movilidad Activa y Micromovilidad",
            "Ciclovías segregadas, sendas compartidas, estacionamientos de bicis",
            'highway=cycleway, cycleway=lane|track, amenity=bicycle_parking, amenity=bicycle_rental',
            "Líneas, Puntos",
            'way["highway"="cycleway"]({{bbox}}); way["cycleway"]({{bbox}}); node["amenity"="bicycle_parking"]({{bbox}});',
            "name, surface, oneway, capacity, bicycle_parking, covered",
            "Ciclovía calle Rosas, ciclobanda calle Brasil, estacionamientos dentro de UAH."
        ],
        [
            "CAT-05",
            "Áreas Verdes, Espacio Público y Recreación",
            "Plazas, parques urbanos, plazoletas, juegos infantiles, bancos",
            'leisure=park, leisure=playground, landuse=grass, amenity=bench',
            "Polígonos, Puntos",
            'way["leisure"~"park|playground"]({{bbox}}); relation["leisure"="park"]({{bbox}});',
            "name, leisure, surface, access, trees, lit",
            "Plaza Brasil (hito barrial), bandejón central de Alameda Bernardo O\'Higgins."
        ],
        [
            "CAT-06",
            "Patrimonio, Cultura e Identidad Urbana",
            "Cités, casonas patrimoniales, teatros, centros culturales, iglesias",
            'historic=monument|building, heritage=*, amenity=arts_centre|theatre|place_of_worship',
            "Polígonos, Puntos",
            'node["historic"]({{bbox}}); way["historic"]({{bbox}}); node["amenity"~"theatre|arts_centre|place_of_worship"]({{bbox}});',
            "name, historic, heritage, heritage:operator, start_date, architecture",
            "Zona Típica Barrio Brasil, casonas Neoclásicas UAH, Basílica del Salvador, Galpones Víctor Jara."
        ],
        [
            "CAT-07",
            "Accesibilidad Universal y Cruces Seguros",
            "Rebajes de cordón, pasos de cebra, semáforos peatonales audibles, rampas",
            'kerb=flush|lowered, highway=crossing, crossing=marked, wheelchair=yes|limited|no',
            "Puntos, Líneas",
            'node["kerb"]({{bbox}}); node["highway"="crossing"]({{bbox}}); node["wheelchair"]({{bbox}});',
            "kerb, crossing, tactile_paving, acoustic, wheelchair, sloped_curb",
            "Cruces semaforizados Alameda con Barroso/Cienfuegos, accesos a estaciones de Metro."
        ],
        [
            "CAT-08",
            "Biodiversidad Urbana y Elementos Ambientales",
            "Arbolado de alineación, áreas de vegetación, registros biológicos",
            'natural=tree, natural=wood, landuse=forest + GBIF Taxa (Aves, Plantas)',
            "Puntos, Polígonos",
            'node["natural"="tree"]({{bbox}}); way["natural"="wood"]({{bbox}}); /* + GBIF API */',
            "species, genus, scientific_name, height, circumference, license",
            "Plátanos orientales y jacarandás en Av. Brasil, avifauna registrada en iNaturalist/GBIF."
        ]
    ]
    
    for r_idx, cat in enumerate(categorias, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(cat, 1):
            cell = ws1.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx in (1, 4, 6) else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws1.row_dimensions[r_idx].height = 55
        
    autoajustar_columnas(ws1, max_len_cap=38)
    
    # Hoja 2: Diccionario Normalizado de Atributos
    ws2 = wb.create_sheet(title="Diccionario Atributos VGI")
    ws2["A1"] = "DICCIONARIO DE ATRIBUTOS NORMALIZADOS PARA EL ATLAS VGI"
    ws2["A1"].font = fuente_titulo
    ws2["A2"] = "Esquema unificado para exportación en GeoJSON, Shapefile y Geodatabase"
    ws2["A2"].font = fuente_subtitulo
    
    h2 = ["Campo Normalizado", "Tipo", "Longitud", "Obligatoriedad", "Origen / Mapeo OSM", "Origen / Mapeo GBIF", "Descripción"]
    for c_idx, h in enumerate(h2, 1):
        cell = ws2.cell(row=4, column=c_idx, value=h)
        cell.font = fuente_cabecera
        cell.fill = fill_cabecera
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = borde_fino
    ws2.row_dimensions[4].height = 26
    
    diccionario = [
        ["id_vgi", "String", "64", "Obligatorio", "osm_type + '/' + id", "gbifID / key", "Identificador único global de la entidad"],
        ["categoria", "String", "32", "Obligatorio", "Clasificación según CAT-01 a CAT-08", "'Biodiversidad'", "Categoría temática principal"],
        ["subtipo", "String", "32", "Obligatorio", "amenity / shop / highway / etc.", "class / order / family", "Subtipo o valor primario de la etiqueta"],
        ["nombre", "String", "128", "Opcional", "tags.name || tags['name:es']", "scientificName || species", "Nombre propio, comercial o científico del elemento"],
        ["operador", "String", "64", "Opcional", "tags.operator", "institutionCode || publishingOrgKey", "Institución, empresa o entidad administradora"],
        ["direccion", "String", "128", "Opcional", "addr:street + ' ' + addr:housenumber", "locality / stateProvince", "Dirección postal o referencia espacial textual"],
        ["accesibilidad", "String", "16", "Opcional", "tags.wheelchair", "N/A", "Grado de accesibilidad física (yes, limited, no)"],
        ["fuente", "String", "32", "Obligatorio", "'OpenStreetMap'", "'GBIF / iNaturalist'", "Plataforma de origen del registro"],
        ["fecha_registro", "Date / ISO", "24", "Condicional", "timestamp del nodo/vía", "eventDate", "Fecha de última edición o de la observación"],
        ["licencia", "String", "32", "Obligatorio", "'ODbL 1.0'", "license declarada (CC-BY, CC0)", "Licencia jurídica aplicable al dato"],
        ["geom_wkt", "Geometry", "Variable", "Obligatorio", "Point / LineString / Polygon", "Point (decimalLat, decimalLon)", "Geometría espacial en EPSG:4326"]
    ]
    
    for r_idx, d in enumerate(diccionario, 5):
        fill_actual = fill_zebra if r_idx % 2 == 0 else PatternFill(fill_type=None)
        for c_idx, val in enumerate(d, 1):
            cell = ws2.cell(row=r_idx, column=c_idx, value=val)
            cell.font = fuente_codigo if c_idx == 1 else fuente_dato
            if fill_actual.fill_type:
                cell.fill = fill_actual
            cell.border = borde_fino
            cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws2.row_dimensions[r_idx].height = 24
        
    autoajustar_columnas(ws2, max_len_cap=35)
    
    ruta_salida = os.path.join(DOCS_DIR, "categorias_tematicas_osm.xlsx")
    wb.save(ruta_salida)
    print(f"[+] Generado: {ruta_salida}")

if __name__ == "__main__":
    print("Iniciando generación de libros Excel para la práctica profesional...")
    crear_catalogo_fuentes()
    crear_perfil_metadatos()
    crear_categorias_tematicas_osm()
    print("¡Todos los archivos Excel (.xlsx) fueron generados con éxito en docs/!")
