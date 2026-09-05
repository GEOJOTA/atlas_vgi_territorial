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
            "(MINEDUC, 2023; IDE Chile, 2020; WikiProject Chile, 2024)"
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
            "(MINVU, 2021; INE, 2017; IDE Chile, 2020)"
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
        # Educación
        ["amenity=university", "Campus Universitario / Sede Central", "CAT-01", "Node, Way, Relation", "name, operator, building=university, addr:street", "Equipamiento de Educación / Edificio Universitario", "MINEDUC / CRUCH", "Alta", "Universidad Alberto Hurtado (Casa Central Barroso 10)", "(MINEDUC, 2023; WikiProject Chile, 2024)"],
        ["amenity=college", "Instituto Profesional (IP) / Centro Formación Técnica (CFT)", "CAT-01", "Node, Way", "name, operator, college:type", "Equipamiento de Educación / Formación Técnica", "MINEDUC / Subsecretaría de Educación Superior", "Alta", "Sedes de educación técnica en eje Alameda y República", "(MINEDUC, 2023)"],
        ["amenity=school", "Colegio / Escuela Básica / Liceo Tradicional", "CAT-01", "Way, Relation", "name, operator, school:type, addr:street", "Equipamiento de Educación / Escuela o Colegio", "MINEDUC / SLEP Santiago", "Muy Alta", "Liceo Miguel Luis Amunátegui / Escuela Rep. de Panamá", "(MINEDUC, 2023; IDE Chile, 2020)"],
        ["amenity=kindergarten", "Jardín Infantil / Sala Cuna (JUNJI / Integra)", "CAT-01", "Node, Way", "name, operator=JUNJI|Fundación Integra", "Equipamiento de Educación / Educación Parvularia", "Subsecretaría de Educación Parvularia", "Alta", "Jardín Infantil Barrial JUNJI calle Cienfuegos", "(JUNJI, 2022; MINEDUC, 2023)"],
        ["amenity=library", "Biblioteca Pública o Universitaria", "CAT-01", "Node, Way", "name, operator, internet_access=wlan", "Equipamiento Cultural / Biblioteca", "Servicio Nacional del Patrimonio Cultural (SERPAT)", "Media", "Biblioteca Central UAH / Biblioteca de Santiago", "(SERPAT, 2023; UAH, 2023)"],
        
        # Salud
        ["amenity=clinic", "CESFAM / CECOSF / Consultorio de Salud Familiar", "CAT-02", "Node, Way", "name, operator, healthcare=clinic, opening_hours", "Equipamiento de Salud / Centro de Salud Familiar", "MINSAL / FONASA (Modelo Salud Familiar)", "Muy Alta", "CESFAM N° 1 Ramón Corbalán Melgarejo", "(MINSAL, 2023; IDE Chile, 2020)"],
        ["amenity=hospital", "Hospital Público / Complejo Hospitalario / Clínica", "CAT-02", "Way, Relation", "name, operator, emergency=yes, health_specialty", "Equipamiento de Salud / Hospital", "MINSAL / Red Asistencial Pública", "Alta", "Hospital San Juan de Dios / Posta Central", "(MINSAL, 2023; IDE Chile, 2020)"],
        ["amenity=pharmacy", "Farmacia de Barrio / Farmacia Comunal Popular", "CAT-02", "Node, Way", "name, dispensing=yes, opening_hours, wheelchair", "Equipamiento de Comercio / Farmacia", "MINSAL / Instituto de Salud Pública (ISP)", "Muy Alta", "Farmacia Popular Comuna de Santiago / Cruz Verde Brasil", "(ISP Chile, 2022; INE, 2021)"],
        ["amenity=dentist", "Consulta Odontológica / Clínica Dental", "CAT-02", "Node", "name, healthcare=dentist", "Servicios Profesionales de Salud Dental", "MINSAL / Colegio de Cirujano Dentistas", "Media", "Clínicas odontológicas universitarias en sector República", "(MINSAL, 2023)"],
        ["amenity=veterinary", "Clínica Veterinaria / Atención de Mascotas", "CAT-02", "Node", "name, operator, opening_hours", "Servicios Veterinarios / Tenencia Responsable", "SUBDERE (Ley N° 21.020 Tenencia Responsable)", "Media", "Clínica veterinaria barrial en calle Maturana", "(SUBDERE, 2018)"],
        
        # Seguridad y Emergencias
        ["amenity=police", "Comisaría de Carabineros / Cuartel PDI", "CAT-02", "Node, Way", "name, operator=Carabineros de Chile|PDI, police:type", "Equipamiento de Seguridad Pública y Policial", "Ministerio del Interior y Seguridad Pública", "Alta", "3ª Comisaría de Carabineros de Santiago Centro", "(Ministerio del Interior, 2022; Carabineros, 2023)"],
        ["amenity=fire_station", "Compañía del Cuerpo de Bomberos de Chile", "CAT-02", "Node, Way", "name, operator=Cuerpo de Bomberos de Santiago, ref", "Equipamiento de Emergencias y Bomberos", "Junta Nacional de Cuerpos de Bomberos (Ley 20.564)", "Alta", "11ª Compañía Pompa Italia (Calle República)", "(Bomberos de Chile, 2022)"],
        ["emergency=ambulance_station", "Base de Ambulancias SAMU (131)", "CAT-02", "Node", "name, operator=SAMU Metropolitano, ref=131", "Red Asistencial de Urgencias Médicas", "MINSAL / SAMU Metropolitano", "Media", "Base SAMU Poniente en Hospital San Juan de Dios", "(MINSAL, 2023)"],
        ["emergency=defibrillator", "Desfibrilador Externo Automático (DEA)", "CAT-02", "Node", "emergency=defibrillator, indoor=yes, access=yes", "Dispositivo Cardíaco de Emergencia Ciudadana", "MINSAL (Ley N° 21.156 Desfibriladores Públicos)", "Alta", "DEA en andenes de Metro Los Héroes y Santa Ana", "(MINSAL, 2019)"],
        
        # Gobierno y Servicios Cívicos
        ["amenity=townhall", "Municipalidad / Edificio Consistorial", "CAT-02", "Node, Way", "name, operator=Ilustre Municipalidad de Santiago", "Administración Local y Gobierno Comunal", "SUBDERE / Municipalidad de Santiago", "Alta", "Casa Consistorial / Centro Comunitario Municipal Brasil", "(SUBDERE, 2022)"],
        ["office=government", "Oficina Pública Estatal (Registro Civil, SII, ChileAtiende)", "CAT-02", "Node, Way", "name, operator, government", "Edificio de Servicios Públicos del Estado", "Ministerio de Justicia / Hacienda / Trabajo", "Alta", "Sucursal Registro Civil Santiago Centro / ChileAtiende", "(ChileAtiende, 2023; IDE Chile, 2020)"],
        ["amenity=community_centre", "Sede Social / Junta de Vecinos (JJVV)", "CAT-02", "Node, Way", "name, operator=Junta de Vecinos N°..., community_centre", "Equipamiento Social y Comunitario Barrial", "SUBDERE / Municipalidad de Santiago", "Alta", "Junta de Vecinos Barrio Brasil (calle Huérfanos)", "(INE, 2017; Municipalidad de Santiago, 2021)"],
        ["amenity=post_office", "Sucursal Postal (CorreosChile, Chilexpress, Starken)", "CAT-02", "Node", "name, operator=Correos de Chile, brand", "Infraestructura de Servicios Postales y Encomiendas", "Ministerio de Transportes y Telecomunicaciones", "Alta", "Sucursal CorreosChile en calle Moneda / Alameda", "(Correos de Chile, 2023)"],
        
        # Comercio y Abastecimiento de Barrio
        ["shop=bakery", "Panadería / Amasandería Tradicional Chilena", "CAT-02", "Node, Way", "name, craft=bakery, bread=marraqueta;hallulla", "Comercio de Alimentación de Proximidad", "SERCOTEC / Fomento Productivo Barrial", "Muy Alta", "Panadería Las Rosas Chicas / Panadería Brasil", "(SERCOTEC, 2022; INE, 2021)"],
        ["shop=convenience", "Almacén de Barrio / Minimarket de Abarrotes", "CAT-02", "Node", "name, shop=convenience, opening_hours", "Comercio Minorista de Alimentos de Proximidad", "SERCOTEC / Economía Social Barrial", "Muy Alta", "Almacén Don Lucho (calle Cienfuegos)", "(SERCOTEC, 2022; INE, 2021)"],
        ["shop=supermarket", "Supermercado de Cadena / Autoservicio", "CAT-02", "Node, Way", "name, brand=Lider|Santa Isabel|Unimarc, wheelchair", "Comercio Mayor de Alimentos y Autoservicio", "Ministerio de Economía / INE", "Alta", "Santa Isabel calle Brasil / Lider Express San Pablo", "(INE, 2021; Taginfo Chile, 2026)"],
        ["amenity=marketplace", "Feria Libre Regulada / Mercado Municipal", "CAT-02", "Node, Way", "name, opening_hours=We,Sa 08:00-15:00, operator", "Comercio Popular y Ferias Libres Tradicionales", "ASOF Chile / I. Municipalidad de Santiago", "Alta", "Feria Libre calle Esperanza / Mercado Cueto", "(ASOF Chile, 2021; ODEPA, 2022)"],
        ["shop=alcohol", "Botillería Tradicional con Patente de Alcoholes", "CAT-02", "Node", "name, shop=alcohol, opening_hours", "Comercio Minorista de Licores y Bebidas", "Dirección de Rentas Municipales", "Alta", "Botillería Barriocentro en calle Maturana", "(INE, 2021)"],
        ["shop=greengrocer", "Verdulería / Frutería Local de Barrio", "CAT-02", "Node", "name, produce=fresh_vegetables", "Comercio de Alimentos Frescos Frutas y Verduras", "SERCOTEC", "Alta", "Verdulería tradicional en calle Compañía de Jesús", "(INE, 2021)"],
        ["shop=butcher", "Carnicería de Barrio", "CAT-02", "Node", "name, shop=butcher", "Comercio Minorista de Carnes y Derivados", "SEREMI de Salud / ISP", "Media", "Carnicería de barrio en calle Huérfanos", "(INE, 2021)"],
        ["shop=hardware", "Ferretería de Barrio / Cerrajería", "CAT-02", "Node", "name, shop=hardware", "Comercio de Materiales Menores y Herramientas", "SERCOTEC", "Alta", "Ferretería El Candado en calle Rosas", "(INE, 2021)"],
        ["amenity=bank", "Sucursal Bancaria (BancoEstado, Santander, etc.)", "CAT-02", "Node, Way", "name, brand=BancoEstado, operator, atm=yes", "Servicios Financieros y Sucursales Bancarias", "Comisión para el Mercado Financiero (CMF)", "Alta", "BancoEstado Sucursal Brasil / Alameda", "(CMF Chile, 2023)"],
        ["amenity=atm", "Cajero Automático (Redbanc)", "CAT-02", "Node", "operator=Redbanc, network=Redbanc, cash_in=no", "Red de Cajeros Automáticos y Dispensadores", "Comisión para el Mercado Financiero (CMF)", "Muy Alta", "Cajero Redbanc en estaciones Metro y farmacias", "(CMF Chile, 2023)"],
        ["amenity=cafe", "Cafetería / Salón de Té Universitario", "CAT-02", "Node, Way", "name, cuisine=coffee_shop, outdoor_seating=yes", "Servicios Gastronómicos y Puntos de Encuentro", "SERNATUR / Municipalidad de Santiago", "Muy Alta", "Cafés universitarios en Av. Brasil y calle Maturana", "(INE, 2021; SERNATUR, 2022)"],
        ["amenity=restaurant", "Restaurante / Fuente de Soda / Picada Tradicional", "CAT-02", "Node, Way", "name, cuisine=chilean, takeaway=yes", "Gastronomía Barrial Tradicional y Minutas", "SERNATUR / Ministerio de las Culturas", "Muy Alta", "Restaurante El Huaso Enrique / Fuentes de soda Alameda", "(SERNATUR, 2022)"],
        
        # Transporte Público
        ["railway=station", "Estación de Metro de Santiago", "CAT-03", "Node, Way", "name, operator=Metro S.A., station=subway, line", "Infraestructura de Transporte / Estación de Metro", "Metro de Santiago / MTT / DTPM", "Muy Alta", "Estación Los Héroes (L1/L2) y Estación Santa Ana (L2/L5)", "(Metro de Santiago, 2024; DTPM & MTT, 2023)"],
        ["railway=subway_entrance", "Acceso / Boca de Estación de Metro", "CAT-03", "Node", "name, subway=yes, wheelchair=yes|no", "Acceso Peatonal a Red Subterránea", "Metro S.A.", "Alta", "Boca Metro Santa Ana por Manuel Rodríguez / Catedral", "(Metro de Santiago, 2024)"],
        ["highway=bus_stop", "Paradero de Buses Red Movilidad", "CAT-03", "Node", "name, ref=PA..., operator, route_ref, shelter=yes|no", "Infraestructura de Transporte / Parada de Bus", "Directorio de Transporte Público Metropolitano (DTPM)", "Muy Alta", "Paradero PA347 Alameda esq. Almirante Barroso", "(DTPM & MTT, 2023)"],
        ["public_transport=platform", "Andén / Plataforma de Parada de Bus", "CAT-03", "Node, Way", "name, bus=yes, ref", "Infraestructura de Transporte / Andén Peatonal", "DTPM / MTT", "Alta", "Andén segregado en corredor Alameda Bernardo O'Higgins", "(DTPM & MTT, 2023)"],
        ["amenity=bus_station", "Terminal de Buses Interurbanos", "CAT-03", "Way, Relation", "name, operator, destination", "Terminal Terrestre de Pasajeros Interurbano", "MTT / SEREMI de Transportes RM", "Media", "Terminal Los Héroes (Tucapel Jiménez)", "(MTT, 2022)"],
        ["vending=public_transport_tickets", "Tótem / Punto de Carga de Tarjeta bip!", "CAT-03", "Node", "amenity=vending_machine, payment:bip=yes", "Servicio de Recaudación del Sistema Red", "Metro S.A. / DTPM", "Alta", "Punto de carga bip! en boletería Metro Los Héroes", "(DTPM & MTT, 2023)"],
        ["railway=subway", "Trazado Subterráneo de Línea de Metro", "CAT-03", "Way", "tunnel=yes, layer=-1, operator=Metro S.A.", "Infraestructura Ferroviaria Subterránea", "Metro S.A.", "Alta", "Trazado Línea 1 bajo eje Alameda / Línea 2 Manuel Rodríguez", "(Metro de Santiago, 2024)"],
        
        # Movilidad Activa
        ["highway=cycleway", "Ciclovía Segregada en Calzada / Bandejón", "CAT-04", "Way", "name, oneway=yes|no, surface=asphalt, segregated=yes", "Infraestructura Vial Cicloinclusiva Segregada", "MINVU (Manual Vialidad Cicloinclusiva) / MTT", "Muy Alta", "Ciclovía calle Rosas / Ciclovía Alameda Poniente", "(MINVU, 2020; MTT, 2021)"],
        ["cycleway=lane", "Ciclobanda Demarcada en Calzada", "CAT-04", "Way", "cycleway:width, surface", "Vía Cicloinclusiva Demarcada", "MINVU / Dirección de Tránsito Municipal", "Alta", "Ciclobanda en eje Av. Brasil", "(MINVU, 2020)"],
        ["amenity=bicycle_parking", "Biciestacionamiento / Punto de Anclaje", "CAT-04", "Node, Way", "capacity, bicycle_parking=stands|u_rack, covered", "Equipamiento para Transporte No Motorizado", "MINVU / DTPM / UAH", "Alta", "Biciestacionamientos en patios UAH y exterior Metro", "(MINVU, 2020; UAH, 2023)"],
        ["amenity=bicycle_rental", "Estación de Bicicletas Públicas Compartidas", "CAT-04", "Node", "name, network=Bike Santiago, capacity", "Sistema de Transporte Compartido de Micromovilidad", "GORE Metropolitano / Municipios", "Media", "Estación Bike Santiago en Plaza Brasil", "(GORE RM, 2021)"],
        ["amenity=bicycle_repair_station", "Tótem de Reparación e Inflado de Bicis", "CAT-04", "Node", "service:bicycle:pump=yes, service:bicycle:tools=yes", "Mobiliario de Apoyo a la Movilidad Activa", "Municipios / Organizaciones Ciclistas", "Media", "Tótem de herramientas en acceso campus UAH", "(WikiProject Chile, 2024)"],
        
        # Espacio Público y Deporte
        ["leisure=park", "Parque Urbano Público / Plaza Barrial", "CAT-05", "Way, Relation", "name, leisure=park, surface=ground, trees=yes", "Espacio Público / Parque Urbano / Plaza", "MINVU (Política Nacional de Parques Urbanos)", "Muy Alta", "Plaza Brasil (parque barrial estructurante)", "(MINVU, 2021; IDE Chile, 2020)"],
        ["leisure=playground", "Área de Juegos Infantiles Modulares", "CAT-05", "Node, Way", "name, min_age, max_age, surface=sand|rubber", "Equipamiento Recreativo Infantil en Espacio Público", "MINVU / Municipalidad de Santiago", "Alta", "Esculturas lúdicas de Federica Matta en Plaza Brasil", "(MINVU, 2021)"],
        ["leisure=pitch", "Cancha de Baby Fútbol / Multicancha Comunitaria", "CAT-05", "Way", "sport=soccer|basketball, surface=concrete|asphalt", "Equipamiento Deportivo Barrial Comunitario", "Instituto Nacional de Deportes (IND)", "Alta", "Multicancha deportiva en JJVV Barrio Brasil", "(IND Chile, 2021)"],
        ["leisure=sports_centre", "Polideportivo Municipal / Complejo Deportivo", "CAT-05", "Way, Relation", "name, operator, leisure=sports_centre", "Complejo Deportivo y Recreativo Comunal", "IND / I. Municipalidad de Santiago", "Media", "Polideportivo Comunal Santiago Centro", "(IND Chile, 2021)"],
        ["leisure=fitness_station", "Plaza Activa / Máquinas de Ejercicios", "CAT-05", "Node, Way", "operator, access=public", "Equipamiento de Ejercicio Físico al Aire Libre", "MINVU / Municipalidades", "Alta", "Estación de máquinas de calistenia en Plaza Brasil", "(MINVU, 2021)"],
        ["amenity=bench", "Banca / Escaño Público de Descanso", "CAT-05", "Node", "material=wood|concrete|metal, backrest=yes", "Mobiliario Urbano de Descanso y Estancia", "MINVU / Dirección de Aseo y Ornato", "Muy Alta", "Escaños patrimoniales en bandejón central de Av. Brasil", "(MINVU, 2021)"],
        ["amenity=drinking_water", "Bebedero Público de Agua Potable", "CAT-05", "Node", "drinking_water=yes, access=public", "Mobiliario Urbano de Hidratación Pública", "Aguas Andinas / Municipalidades", "Media", "Bebedero público en Plaza Brasil", "(MINVU, 2021)"],
        
        # Patrimonio y Cultura
        ["historic=building", "Inmueble de Conservación Histórica (ICH) / Casona", "CAT-06", "Way, Relation", "name, heritage=*, start_date, architecture", "Patrimonio Arquitectónico Protegido por PRC", "Consejo de Monumentos Nacionales (CMN) / DOM", "Alta", "Casonas Neoclásicas UAH (Barroso 10, Cienfuegos 41)", "(CMN & MINCAP, 2022; Municipalidad de Santiago, 2019)"],
        ["historic=monument", "Monumento Público / Escultura Nacional", "CAT-06", "Node", "name, historic=monument, material=bronze|stone", "Monumento Público Nacional (Ley N° 17.288)", "Consejo de Monumentos Nacionales (CMN)", "Alta", "Esculturas conmemorativas en Plaza Brasil", "(CMN & MINCAP, 2022; Ley N° 17.288)"],
        ["historic=memorial", "Memorial de Derechos Humanos / Hito Conmemorativo", "CAT-06", "Node, Way", "name, memorial:type=plaque|statue", "Sitio de Memoria Histórica y Hito Conmemorativo", "Subsecretaría de Derechos Humanos / CMN", "Media", "Placas conmemorativas en sedes comunitarias y sindicales", "(Subsecretaría de DDHH, 2021)"],
        ["heritage=cite", "Cité Patrimonial / Pasaje Colectivo Tradicional", "CAT-06", "Way, Relation", "residential=cite, building=residential, heritage:operator", "Tipología Residencial Colectiva Tradicional", "MINVU / CMN / Municipalidad de Santiago", "Alta", "Cité Lucrecia Valdés / Pasajes de calle Huérfanos", "(Municipalidad de Santiago, 2019; Hidalgo, 2005)"],
        ["amenity=place_of_worship", "Templo Religioso / Basílica / Parroquia", "CAT-06", "Way, Relation", "name, religion=christian, denomination=catholic", "Patrimonio Arquitectónico y Religioso", "CMN / Arzobispado de Santiago", "Alta", "Basílica del Salvador (Monumento Histórico)", "(CMN & MINCAP, 2022)"],
        ["amenity=arts_centre", "Centro Cultural Comunitario / Galpón de Arte", "CAT-06", "Node, Way", "name, operator, arts_centre=community", "Equipamiento Cultural y Artístico Barrial", "Ministerio de las Culturas, las Artes y el Patrimonio", "Alta", "Centro Cultural de Barrio Brasil / Galpón Víctor Jara", "(MINCAP, 2022)"],
        ["tourism=museum", "Museo Público / Histórico / Universitario", "CAT-06", "Way, Relation", "name, museum=history|art, operator", "Equipamiento Museográfico Nacional", "Servicio Nacional del Patrimonio Cultural (SERPAT)", "Media", "Museo de la Educación Gabriela Mistral", "(SERPAT, 2023)"],
        
        # Accesibilidad Universal
        ["kerb=lowered", "Rebaje de Solera / Vado Peatonal en Esquina", "CAT-07", "Node", "kerb=lowered, tactile_paving=yes|no, sloped_curb=yes", "Infraestructura de Accesibilidad Peatonal (D.S. 50)", "MINVU (OGUC Art. 2.2.8) / SENADIS", "Muy Alta", "Rebaje de solera en cruce Alameda con Almirante Barroso", "(MINVU, 2016; SENADIS, 2021)"],
        ["kerb=flush", "Cordón a Nivel Cero / Plataforma Única", "CAT-07", "Node", "kerb=flush, wheelchair=yes", "Vado Peatonal en Rasante Continua", "MINVU / SERVIU Metropolitano", "Alta", "Pasos a nivel en paseos peatonales y calles calmadas", "(MINVU, 2016)"],
        ["highway=crossing", "Paso Peatonal Demarcado (Paso Cebra / Semaforizado)", "CAT-07", "Node", "crossing=marked|traffic_signals, crossing:island=yes|no", "Infraestructura de Seguridad Peatonal y Cruce", "CONASET (Ministerio de Transportes) / MINVU", "Muy Alta", "Paso de cebra demarcado en Cienfuegos frente a UAH", "(CONASET, 2022; MTT, 2021)"],
        ["tactile_paving=yes", "Pavimento Podotáctil de Alerta o Guía (Baldosa Táctil)", "CAT-07", "Node, Way", "tactile_paving:type=warning|guiding", "Dispositivo de Apoyo para Personas con Discapacidad Visual", "MINVU (D.S. 50) / SENADIS", "Alta", "Baldosas podotáctiles en esquinas y andenes de Metro", "(MINVU, 2016; SENADIS, 2021)"],
        ["traffic_signals:sound=yes", "Semáforo Peatonal Audible (Señal Acústica)", "CAT-07", "Node", "traffic_signals:vibration=yes|no", "Dispositivo Acústico de Apoyo al Cruce Seguro", "Unidad Operativa de Control de Tránsito (UOCT)", "Media", "Semáforo sonoro en eje Alameda con Los Héroes", "(UOCT & MTT, 2022)"],
        ["wheelchair=yes", "Recinto o Local 100% Accesible para Sillas de Ruedas", "CAT-07", "Node, Way", "wheelchair:description, ramp=yes, lift=yes", "Calificación de Accesibilidad Física de Edificaciones", "MINVU / SENADIS", "Muy Alta", "Edificio Erasmo Escala UAH con rampa y ascensor accesible", "(SENADIS, 2021; ISO 21542:2021)"],
        
        # Biodiversidad Urbana
        ["natural=tree", "Árbol Urbano de Alineación en Acera o Plaza", "CAT-08", "Node", "species=Platanus orientalis|Jacaranda mimosifolia, height", "Arbolado y Silvicultura Urbana", "Corporación Nacional Forestal (CONAF) / Municipios", "Muy Alta", "Plátanos orientales y jacarandás en Av. Brasil", "(CONAF, 2019; MMA, 2022)"],
        ["natural=wood", "Masa Arbórea Continua / Bosquete Urbano", "CAT-08", "Way, Relation", "leaf_type=broadleaved, leaf_cycle=deciduous|evergreen", "Cobertura Vegetal y Bosque Urbano", "CONAF / MMA", "Media", "Área arbolada densa en Parque Quinta Normal", "(CONAF, 2019; IDE Chile, 2020)"]
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
    
    # ----------------------------------------------------
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
        ["categoria", "Texto (Código CAT)", "32", "Obligatorio", "Clasificación según CAT-01 a CAT-08", "'Biodiversidad'", "gmd:topicCategory (ISO 19115)", "Categoría sectorial temática maestra para agregación y tabulaciones comunales."],
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
    
    bibliografia_apa = [
        [
            "(ASOF Chile, 2021)",
            "ASOF Chile. (2021). Catastro Nacional de Ferias Libres y Soberanía Alimentaria Barrial. Asociación Chilena de Organizaciones de Ferias Libres.",
            "Informe Gremial / Datos Abiertos",
            "ASOF Chile",
            "2021",
            "Catastro Nacional de Ferias Libres y Soberanía Alimentaria Barrial",
            "https://asof.cl",
            "Fundamenta el etiquetado y días de funcionamiento de ferias libres barriales (CAT-02: amenity=marketplace)."
        ],
        [
            "(Bomberos de Chile, 2022)",
            "Bomberos de Chile. (2022). Historia, Organización y Cuarteles del Cuerpo de Bomberos de Chile (Ley N° 20.564 Marco de Bomberos de Chile). Junta Nacional de Cuerpos de Bomberos.",
            "Norma Legal / Registro Institucional",
            "Junta Nacional de Cuerpos de Bomberos",
            "2022",
            "Ley N° 20.564 Marco de Bomberos de Chile y Registro de Compañías",
            "https://www.bomberos.cl",
            "Estándar para clasificar compañías de bomberos y cuarteles de emergencia en Barrio Brasil (CAT-02: amenity=fire_station)."
        ],
        [
            "(Carabineros de Chile, 2023)",
            "Carabineros de Chile. (2023). Despliegue Operativo y Cuarteles Policiales del Plan Cuadrante de Seguridad Preventiva. Dirección Nacional de Orden y Seguridad.",
            "Documento Institucional Oficial",
            "Carabineros de Chile",
            "2023",
            "Plan Cuadrante de Seguridad Preventiva y Red de Comisarías",
            "https://www.carabineros.cl",
            "Clasificación de cuarteles policiales, prefecturas y comisarías de seguridad ciudadana (CAT-02: amenity=police)."
        ],
        [
            "(ChileAtiende, 2023)",
            "ChileAtiende. (2023). Catálogo de Trámites y Puntos de Atención Ciudadana del Estado de Chile. Instituto de Previsión Social (IPS).",
            "Portal de Servicios Públicos",
            "Instituto de Previsión Social (IPS)",
            "2023",
            "Catálogo de Puntos de Atención Ciudadana ChileAtiende",
            "https://www.chileatiende.gob.cl",
            "Normalización de oficinas del Estado para trámites presenciales de vecinos y estudiantes (CAT-02: office=government)."
        ],
        [
            "(CMF Chile, 2023)",
            "Comisión para el Mercado Financiero [CMF]. (2023). Directorio de Entidades Bancarias y Puntos de Acceso Financiero en Chile. CMF Chile.",
            "Registro Regulador Oficial",
            "Comisión para el Mercado Financiero (CMF)",
            "2023",
            "Directorio de Entidades Bancarias y Cajeros Automáticos Redbanc",
            "https://www.cmfchile.cl",
            "Identificación y validación de sucursales bancarias y red de cajeros automáticos (CAT-02: amenity=bank, amenity=atm)."
        ],
        [
            "(CMN & MINCAP, 2022)",
            "Consejo de Monumentos Nacionales [CMN] & Ministerio de las Culturas, las Artes y el Patrimonio [MINCAP]. (2022). Catálogo de Monumentos Nacionales de Chile: Zonas Típicas, Monumentos Históricos y Santuarios de la Naturaleza. Gobierno de Chile.",
            "Catálogo Oficial Patrimonial",
            "CMN & MINCAP",
            "2022",
            "Catálogo de Monumentos Nacionales de Chile (Ley N° 17.288)",
            "https://www.monumentos.gob.cl",
            "Base jurídica y catastral para clasificar monumentos históricos y la Zona Típica Barrio Brasil (CAT-06: historic=monument, heritage=*)."
        ],
        [
            "(CONAF, 2019)",
            "Corporación Nacional Forestal [CONAF]. (2019). Guía de Campo: Árboles Urbanos de Chile. Ministerio de Agricultura, Gobierno de Chile.",
            "Manual Técnico / Guía Botánica",
            "CONAF",
            "2019",
            "Guía de Campo: Árboles Urbanos de Chile",
            "https://www.conaf.cl",
            "Taxonomía de especies arbóreas urbanas en Santiago Centro (Platanus orientalis, Jacaranda, Jubaea chilensis) (CAT-08: natural=tree)."
        ],
        [
            "(CONASET, 2022)",
            "Comisión Nacional de Seguridad de Tránsito [CONASET]. (2022). Manual de Señalización de Tránsito: Demarcaciones Viales y Cruces Peatonales. Ministerio de Transportes y Telecomunicaciones.",
            "Manual Normativo Oficial",
            "CONASET / MTT",
            "2022",
            "Manual de Señalización de Tránsito (Demarcaciones Peatonales)",
            "https://www.conaset.cl",
            "Criterios de seguridad para pasos de cebra, cruces semaforizados e islas peatonales (CAT-07: highway=crossing)."
        ],
        [
            "(Correos de Chile, 2023)",
            "Empresa de Correos de Chile. (2023). Red de Sucursales y Puntos de Correspondencia Oficial. Ministerio de Transportes y Telecomunicaciones.",
            "Directorio de Infraestructura",
            "CorreosChile",
            "2023",
            "Red de Sucursales y Puntos Postales",
            "https://www.correos.cl",
            "Catalogación de agencias postales y envíos de correspondencia comunal (CAT-02: amenity=post_office)."
        ],
        [
            "(DTPM & MTT, 2023)",
            "Directorio de Transporte Público Metropolitano [DTPM] & Ministerio de Transportes y Telecomunicaciones [MTT]. (2023). Manual de Normas Gráficas y Estándar de Infraestructura de Paradas del Sistema Red Movilidad. Santiago: Gobierno de Chile.",
            "Estándar Técnico Oficial",
            "DTPM & MTT",
            "2023",
            "Manual de Normas Gráficas y Estándar de Paradas Red Movilidad",
            "https://www.dtpm.cl",
            "Estándar fundamental para paraderos, códigos PA, refugios peatonales y validación de transporte público (CAT-03: highway=bus_stop)."
        ],
        [
            "(GBIF Secretariat, 2024)",
            "GBIF Secretariat. (2024). Global Biodiversity Information Facility Occurrence API Documentation. GBIF.",
            "Documentación de API Científica",
            "GBIF Secretariat",
            "2024",
            "GBIF Occurrence API Standard (Darwin Core)",
            "https://www.gbif.org/developer/occurrence",
            "Especificación técnica para cosechar observaciones biológicas urbanas de iNaturalist/eBird sobre el Bbox de Barrio Brasil (CAT-08)."
        ],
        [
            "(Geofabrik & HeiGIT, 2026)",
            "Geofabrik & HeiGIT. (2026). Taginfo Chile: Regional OpenStreetMap Tag Usage and Statistics. Geofabrik GmbH & Heidelberg Institute for Geoinformation Technology.",
            "Plataforma de Métricas VGI",
            "Geofabrik & HeiGIT",
            "2026",
            "Taginfo Chile (Estadísticas de uso de etiquetas OSM en Chile)",
            "https://taginfo.geofabrik.de/south-america:chile",
            "Fuente cuantitativa para contrastar la frecuencia relativa de etiquetas en el territorio chileno."
        ],
        [
            "(Goodchild, 2007)",
            "Goodchild, M. F. (2007). Citizens as sensors: the world of volunteered geography. GeoJournal, 69(4), 211-221.",
            "Artículo en Revista Científica",
            "Goodchild, Michael F.",
            "2007",
            "Citizens as sensors: the world of volunteered geography",
            "https://doi.org/10.1007/s10708-007-9111-y",
            "Fundamentación epistemológica de la Información Geográfica Voluntaria (VGI) y el ciudadano como sensor territorial."
        ],
        [
            "(Haklay, 2010)",
            "Haklay, M. (2010). How good is volunteered geographical information? A case study of OpenStreetMap in the UK. Environment and Planning B: Planning and Design, 37(4), 682-703.",
            "Artículo en Revista Científica",
            "Haklay, Mordechai (Muki)",
            "2010",
            "How good is volunteered geographical information? A case study of OpenStreetMap in the UK",
            "https://doi.org/10.1068/b35097",
            "Marco metodológico seminal para la evaluación de completitud posicional y semántica en OpenStreetMap."
        ],
        [
            "(Hidalgo, 2005)",
            "Hidalgo, R. (2005). La vivienda social en Chile y la construcción del espacio urbano en el Santiago del siglo XX. Santiago: Instituto de Geografía, Pontificia Universidad Católica de Chile.",
            "Libro Académico Monográfico",
            "Hidalgo, Rodrigo",
            "2005",
            "La vivienda social en Chile y la construcción del espacio urbano en el Santiago del siglo XX",
            "ISBN 956-14-0820-7",
            "Respaldo histórico-urbano para tipificar los cités y pasajes colectivos de Barrio Brasil (CAT-06: heritage=cite)."
        ],
        [
            "(IDE Chile, 2020)",
            "IDE Chile / SNIT - Ministerio de Bienes Nacionales. (2020). Catálogo de Objetos Geográficos de Chile v3.0: Estándar para la captura y clasificación de información geoespacial. Infraestructura de Datos Espaciales de Chile.",
            "Estándar Geoespacial Nacional",
            "IDE Chile / SNIT",
            "2020",
            "Catálogo de Objetos Geográficos de Chile v3.0",
            "https://www.ide.cl",
            "Estructura rectora del Estado para homologar clases de equipamiento, educación, salud y transporte entre OSM y el SNIT."
        ],
        [
            "(IND Chile, 2021)",
            "Instituto Nacional de Deportes [IND]. (2021). Catastro Nacional de Recintos Deportivos y Multicanchas Públicas. Ministerio del Deporte, Gobierno de Chile.",
            "Directorio Oficial de Infraestructura",
            "IND Chile",
            "2021",
            "Catastro Nacional de Recintos Deportivos y Multicanchas Comunitarias",
            "https://www.ind.cl",
            "Definición de multicanchas barriales, canchas de baby fútbol y polideportivos comunitarios (CAT-05: leisure=pitch, leisure=sports_centre)."
        ],
        [
            "(INE, 2017)",
            "Instituto Nacional de Estadísticas [INE]. (2017). Metodología de Clasificación y Asignación de Equipamiento Comunitario y Asentamientos Humanos. Santiago: Gobierno de Chile.",
            "Metodología Oficial Estadística",
            "INE Chile",
            "2017",
            "Metodología de Clasificación de Equipamiento Comunitario",
            "https://www.ine.gob.cl",
            "Clasificación jerárquica de sedes sociales, juntas de vecinos y áreas de esparcimiento vecinal (CAT-02, CAT-05)."
        ],
        [
            "(INE, 2021)",
            "Instituto Nacional de Estadísticas [INE]. (2021). Directorio Nacional de Empresas y Locales de Comercio Minorista según Actividad Económica. Santiago: INE Chile.",
            "Catastro Estadístico de Comercio",
            "INE Chile",
            "2021",
            "Directorio Nacional de Empresas y Locales de Comercio Minorista",
            "https://www.ine.gob.cl",
            "Homologación de actividades comerciales barriales: almacenes, panaderías, ferreterías y botillerías (CAT-02: shop=*)."
        ],
        [
            "(ISO 21542:2021)",
            "ISO. (2021). ISO 21542:2021: Building construction — Accessibility and usability of the built environment. International Organization for Standardization.",
            "Norma Técnica Internacional",
            "ISO/TC 59/SC 16",
            "2021",
            "ISO 21542:2021: Building construction — Accessibility and usability of the built environment",
            "https://www.iso.org/standard/70273.html",
            "Estándar internacional para rampas, anchos de paso y calificación de accesibilidad física en edificaciones (CAT-07: wheelchair=*)."
        ],
        [
            "(ISO/TC 211, 2013)",
            "ISO/TC 211. (2013). ISO 19157:2013: Geographic information — Data quality. International Organization for Standardization.",
            "Norma Técnica Internacional",
            "ISO/TC 211 (Geographic Information)",
            "2013",
            "ISO 19157:2013: Geographic information — Data quality",
            "https://www.iso.org/standard/32575.html",
            "Marco normativo para la evaluación de completitud, consistencia lógica y exactitud temporal en el módulo ohsome."
        ],
        [
            "(ISO/TC 211, 2014)",
            "ISO/TC 211. (2014). ISO 19115-1:2014: Geographic information — Metadata — Part 1: Fundamentals. International Organization for Standardization.",
            "Norma Técnica Internacional",
            "ISO/TC 211 (Geographic Information)",
            "2014",
            "ISO 19115-1:2014: Geographic information — Metadata — Part 1: Fundamentals",
            "https://www.iso.org/standard/53798.html",
            "Esquema conceptual obligatorio para la generación de metadatos geográficos estructurados en el Atlas VGI."
        ],
        [
            "(ISO/TC 211, 2016)",
            "ISO/TC 211. (2016). ISO 19110:2016: Geographic information — Methodology for feature cataloguing. International Organization for Standardization.",
            "Norma Técnica Internacional",
            "ISO/TC 211 (Geographic Information)",
            "2016",
            "ISO 19110:2016: Geographic information — Methodology for feature cataloguing",
            "https://www.iso.org/standard/57303.html",
            "Metodología formal para estructurar el Diccionario Territorial de 14 atributos normalizados y las etiquetas OSM."
        ],
        [
            "(JUNJI, 2022)",
            "Junta Nacional de Jardines Infantiles [JUNJI]. (2022). Guía de Estándares de Infraestructura y Cobertura de Educación Parvularia. Ministerio de Educación.",
            "Estándar de Infraestructura",
            "JUNJI",
            "2022",
            "Guía de Estándares de Infraestructura y Salas Cuna",
            "https://www.junji.gob.cl",
            "Definición y categorización de jardines infantiles públicos y salas cuna (CAT-01: amenity=kindergarten)."
        ],
        [
            "(Metro de Santiago, 2024)",
            "Metro de Santiago. (2024). Memoria Anual y Catálogo de Estaciones, Accesos y Conectividad de la Red de Metro. Empresa de Transporte de Pasajeros Metro S.A.",
            "Memoria Corporativa y Catálogo",
            "Metro S.A.",
            "2024",
            "Memoria Anual y Red de Estaciones de Metro de Santiago",
            "https://www.metro.cl",
            "Validación de estaciones, líneas subterráneas y accesos peatonales en el entorno de Barrio Brasil (CAT-03: railway=station)."
        ],
        [
            "(MINEDUC, 2023)",
            "Ministerio de Educación [MINEDUC]. (2023). Directorio Oficial de Establecimientos Educacionales y de Educación Superior en Chile. Centro de Estudios MINEDUC.",
            "Base de Datos Abierta Oficial",
            "MINEDUC",
            "2023",
            "Directorio Oficial de Establecimientos Educacionales (RBD) y Educación Superior",
            "https://datosabiertos.mineduc.cl",
            "Base rectora para validar la existencia y roles de sedes universitarias UAH, colegios y liceos (CAT-01: amenity=university, school)."
        ],
        [
            "(MINSAL, 2019)",
            "Ministerio de Salud [MINSAL]. (2019). Ley N° 21.156: Establece la obligación de disponer de desfibriladores externos automáticos portátiles en recintos públicos. Diario Oficial de la República de Chile.",
            "Ley de la República / Norma Sanitaria",
            "MINSAL",
            "2019",
            "Ley N° 21.156 Desfibriladores Externos Automáticos (DEA) en Recintos Públicos",
            "https://www.bcn.cl/leychile/navegar?idNorma=1131758",
            "Marco regulatorio para catastrar desfibriladores de emergencia en estaciones de metro y campus (CAT-02: emergency=defibrillator)."
        ],
        [
            "(MINSAL, 2023)",
            "Ministerio de Salud [MINSAL]. (2023). Estructura y Clasificación de la Red Asistencial Pública de Salud en Chile: Hospitales, CESFAM, CECOSF y SAPU. Departamento de Estadísticas e Información de Salud (DEIS).",
            "Estándar Sanitario Oficial",
            "MINSAL / DEIS",
            "2023",
            "Clasificación de Establecimientos de la Red Asistencial de Salud",
            "https://deis.minsal.cl",
            "Taxonomía oficial para clasificar CESFAM, CECOSF, hospitales y postas de urgencia (CAT-02: amenity=clinic, hospital)."
        ],
        [
            "(MINVU, 2016)",
            "Ministerio de Vivienda y Urbanismo [MINVU]. (2016). Decreto Supremo N° 50: Modifica la Ordenanza General de Urbanismo y Construcciones en materia de accesibilidad universal. Diario Oficial de la República de Chile.",
            "Decreto Supremo / Norma Urbana",
            "MINVU",
            "2016",
            "Decreto Supremo N° 50 (OGUC Accesibilidad Universal - Art. 2.2.8)",
            "https://www.minvu.gob.cl",
            "Norma mandatoria para rebajes de solera, vados, baldosas podotáctiles y rampas de acceso en el espacio público (CAT-07: kerb=lowered)."
        ],
        [
            "(MINVU, 2020)",
            "Ministerio de Vivienda y Urbanismo [MINVU]. (2020). Manual de Vialidad Cicloinclusiva y Directrices de Diseño de Ciclovías Urbanas. Santiago: Gobierno de Chile.",
            "Manual Técnico Oficial",
            "MINVU",
            "2020",
            "Manual de Vialidad Cicloinclusiva (Diseño y Estandarización de Ciclovías)",
            "https://www.minvu.gob.cl",
            "Criterios de segregación, anchos y tipos de superficie para ciclovías y ciclobandas (CAT-04: highway=cycleway, cycleway=lane)."
        ],
        [
            "(MINVU, 2021)",
            "Ministerio de Vivienda y Urbanismo [MINVU]. (2021). Política Nacional de Parques Urbanos y Estándares de Áreas Verdes Públicas. Santiago: MINVU.",
            "Política Pública Nacional",
            "MINVU",
            "2021",
            "Política Nacional de Parques Urbanos y Estándares de Áreas Verdes",
            "https://www.minvu.gob.cl",
            "Criterios de superficie, dotación de juegos infantiles y mobiliario urbano para parques y plazas (CAT-05: leisure=park)."
        ],
        [
            "(MMA, 2022)",
            "Ministerio del Medio Ambiente [MMA]. (2022). Estrategia Nacional de Biodiversidad y Catálogo de Especies de la Zona Central de Chile. Gobierno de Chile.",
            "Estrategia Estatal Ambiental",
            "MMA",
            "2022",
            "Estrategia Nacional de Biodiversidad y Catálogo de Especies",
            "https://mma.gob.cl",
            "Clasificación y protección de especies de avifauna, flora e insectos polinizadores en Santiago Centro (CAT-08)."
        ],
        [
            "(Mooney & Minghini, 2017)",
            "Mooney, P., & Minghini, M. (2017). A review of OpenStreetMap data. In Mapping and the Citizen Sensor (pp. 37-59). Ubiquity Press.",
            "Capítulo de Libro Académico",
            "Mooney, Peter & Minghini, Marco",
            "2017",
            "A review of OpenStreetMap data",
            "https://doi.org/10.5334/bbf.c",
            "Revisión metodológica de la estructura relacional de nodos, vías y relaciones en el modelo de datos de OpenStreetMap."
        ],
        [
            "(Municipalidad de Santiago, 2019)",
            "Municipalidad de Santiago. (2019). Plan Regulador Comunal de Santiago: Catálogo de Inmuebles y Zonas de Conservación Histórica. Dirección de Obras Municipales.",
            "Instrumento de Planificación Territorial",
            "Municipalidad de Santiago",
            "2019",
            "Plan Regulador Comunal de Santiago (Inmuebles y Zonas Patrimoniales)",
            "https://www.munistgo.cl",
            "Catastro comunal vinculante de Inmuebles de Conservación Histórica (ICH) y cités en Barrio Brasil (CAT-06: historic=building)."
        ],
        [
            "(Neis & Zipf, 2012)",
            "Neis, P., & Zipf, A. (2012). Analyzing the contributor activity of OpenStreetMap and its development for the community. ISPRS International Journal of Geo-Information, 1(2), 146-177.",
            "Artículo en Revista Científica",
            "Neis, Pascal & Zipf, Alexander",
            "2012",
            "Analyzing the contributor activity of OpenStreetMap and its development for the community",
            "https://doi.org/10.3390/ijgi1020146",
            "Fundamento de los indicadores de linaje, masa crítica de colaboradores y ratio de ediciones en ohsome API."
        ],
        [
            "(OpenStreetMap Wiki Chile, 2024)",
            "OpenStreetMap Foundation & Comunidad OSM Chile. (2024). WikiProject Chile: Guía, directrices y convenciones comunitarias de mapeo para Chile. OpenStreetMap Wiki.",
            "Guía Comunitaria Colaborativa",
            "Comunidad OSM Chile",
            "2024",
            "WikiProject Chile (Convenciones y Directrices de Mapeo)",
            "https://wiki.openstreetmap.org/wiki/ES:Chile",
            "Consenso de la comunidad local para etiquetar vías, equipamientos, paradas Red y toponimia en Chile."
        ],
        [
            "(Raifer et al., 2019)",
            "Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019). OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data. EPJ Data Science, 8(1), 1-18.",
            "Artículo en Revista Científica",
            "Raifer, M. et al. (HeiGIT)",
            "2019",
            "OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data",
            "https://doi.org/10.1186/s40965-019-0061-3",
            "Arquitectura del motor OSHDB subyacente en ohsome API v1 para la extracción de series temporales de calidad espacial."
        ],
        [
            "(SENADIS, 2021)",
            "Servicio Nacional de la Discapacidad [SENADIS]. (2021). Guía de Consulta Rápida: Accesibilidad Universal en el Espacio Público y la Edificación. Ministerio de Desarrollo Social y Familia.",
            "Guía Técnica Oficial",
            "SENADIS",
            "2021",
            "Guía de Consulta Rápida: Accesibilidad Universal en el Espacio Público",
            "https://www.senadis.gob.cl",
            "Pautas de diseño y fiscalización para cruces peatonales, rebajes, rampas y accesibilidad universal (CAT-07)."
        ],
        [
            "(SERCOTEC, 2022)",
            "Servicio de Cooperación Técnica [SERCOTEC]. (2022). Barrios Comerciales de Chile: Diagnóstico del Comercio Minorista Tradicional. Ministerio de Economía, Fomento y Turismo.",
            "Estudio Técnico de Fomento",
            "SERCOTEC",
            "2022",
            "Barrios Comerciales de Chile (Comercio Minorista de Barrio)",
            "https://www.sercotec.cl",
            "Caracterización del comercio de proximidad: panaderías, almacenes, cafeterías y ferreterías tradicionales (CAT-02: shop=*)."
        ],
        [
            "(SERPAT, 2023)",
            "Servicio Nacional del Patrimonio Cultural [SERPAT]. (2023). Catálogo de Bibliotecas Públicas y Museos Estatales de Chile. Ministerio de las Culturas, las Artes y el Patrimonio.",
            "Directorio Oficial de Patrimonio",
            "SERPAT",
            "2023",
            "Catálogo de Bibliotecas Públicas y Museos Estatales de Chile",
            "https://www.patrimoniocultural.gob.cl",
            "Validación oficial de bibliotecas públicas, archivos históricos y museos (CAT-01: amenity=library, CAT-06: tourism=museum)."
        ],
        [
            "(Snyder, 1987)",
            "Snyder, J. P. (1987). Map projections: a working manual (U.S. Geological Survey Professional Paper 1395). Washington, D.C.: U.S. Government Printing Office.",
            "Manual Geodésico Clásico (USGS)",
            "Snyder, John P.",
            "1987",
            "Map projections: a working manual (USGS Professional Paper 1395)",
            "https://doi.org/10.3133/pp1395",
            "Ecuaciones conformes de Transverse Mercator empleadas en ModuloGeodesia para reproyectar a EPSG:32719 UTM 19S."
        ],
        [
            "(TDWG, 2023)",
            "Biodiversity Information Standards [TDWG]. (2023). Darwin Core Standard: Quick Reference Guide. TDWG.",
            "Estándar Internacional de Biodiversidad",
            "TDWG",
            "2023",
            "Darwin Core Standard: Quick Reference Guide",
            "https://dwc.tdwg.org/terms/",
            "Estándar global de metadatos de ocurrencias biológicas aplicado a los registros de biodiversidad de GBIF (CAT-08)."
        ],
        [
            "(Schuurman, 2000)",
            "Schuurman, N. (2000). Trouble in the Heartland: GIS and its critics in the 1990s. Progress in Human Geography, 24(4), 569-590.",
            "Artículo en Revista Científica",
            "Schuurman, Nadine",
            "2000",
            "Trouble in the Heartland: GIS and its critics in the 1990s",
            "https://doi.org/10.1191/030913200100189111",
            "Revisión crítica de la epistemología de los SIG y la necesidad de abrir la producción espacial a comunidades no hegemónicas."
        ],
        [
            "(Amano et al., 2016)",
            "Amano, T., Lamming, J. D. L., & Sutherland, W. J. (2016). Spatial gaps in global biodiversity information and the role of citizen science. BioScience, 66(11), 993-1000.",
            "Artículo en Revista Científica",
            "Amano, T. et al.",
            "2016",
            "Spatial gaps in global biodiversity information and the role of citizen science",
            "https://doi.org/10.1093/biosci/biw127",
            "Demuestra cómo la ciencia ciudadana (GBIF / iNaturalist) reduce los vacíos espaciales en la información de biodiversidad urbana."
        ],
        [
            "(Mooney et al., 2020)",
            "Mooney, P., Minghini, M., & Grinberger, A. Y. (2020). OpenStreetMap data use cases during the early months of the COVID-19 pandemic. arXiv preprint arXiv:2008.02653.",
            "Preprint Académico Especializado",
            "Mooney, P., Minghini, M., & Grinberger, A. Y.",
            "2020",
            "OpenStreetMap data use cases during the early months of the COVID-19 pandemic",
            "https://arxiv.org/abs/2008.02653",
            "Evidencia el rol de la VGI en emergencias sanitarias y la geolocalización rápida de equipamiento clínico y farmacéutico."
        ],
        [
            "(Tempelmeier & Demidova, 2022)",
            "Tempelmeier, N., & Demidova, E. (2022). Attention-based vandalism detection in OpenStreetMap. arXiv preprint arXiv:2201.10406.",
            "Preprint Académico / Machine Learning",
            "Tempelmeier, N., & Demidova, E.",
            "2022",
            "Attention-based vandalism detection in OpenStreetMap",
            "https://arxiv.org/abs/2201.10406",
            "Técnicas contemporáneas de detección de anomalías y vandalismo cartográfico para auditar la integridad de nodos VGI."
        ],
        [
            "(Ballatore et al., 2014)",
            "Ballatore, A., Wilson, D. C., & Bertolotto, M. (2014). A survey of volunteered open geo-knowledge bases in the Semantic Web. Quality Issues in the Open Knowledge Base, 48-68.",
            "Capítulo de Libro / Web Semántica",
            "Ballatore, A., Wilson, D. C., & Bertolotto, M.",
            "2014",
            "A survey of volunteered open geo-knowledge bases in the Semantic Web",
            "https://arxiv.org/abs/1401.2610",
            "Análisis ontológico de bases de conocimiento geográfico abierto y traducción de vocabularios colaborativos a la web semántica."
        ],
        [
            "(Shahi, 2023)",
            "Shahi, K. (2023). Volunteered Geographic Information (VGI) in Spatial Data Infrastructure (SDI) Continuum. EAI Endorsed Transactions on Internet of Things, 9(1), 1-12.",
            "Artículo en Revista Científica",
            "Shahi, Kaveh",
            "2023",
            "Volunteered Geographic Information (VGI) in Spatial Data Infrastructure (SDI) Continuum",
            "https://doi.org/10.4108/eetiot.v9i1.2941",
            "Marco teórico para la articulación continua entre infraestructuras de datos estatales (IDE Chile) y la información geográfica voluntaria."
        ],
        [
            "(Burghardt et al., 2024)",
            "Burghardt, D., Demidova, E., & Keim, D. A. (Eds.). (2024). Volunteered Geographic Information: Interpretation, visualization and social context. Springer Nature.",
            "Libro Académico Especializado",
            "Burghardt, D., Demidova, E., & Keim, D. A.",
            "2024",
            "Volunteered Geographic Information: Interpretation, visualization and social context",
            "https://doi.org/10.1007/978-3-031-35374-1",
            "Compendio actualizado sobre interpretación, visualización y contextualización socioterritorial de la información voluntaria."
        ],
        [
            "(Seto et al., 2020)",
            "Seto, T., Kanasugi, H., & Nishimura, Y. (2020). Quality verification of Volunteered Geographic Information using OSM Notes data in a global context. ISPRS International Journal of Geo-Information, 9(6), 372.",
            "Artículo en Revista Científica",
            "Seto, T., Kanasugi, H., & Nishimura, Y.",
            "2020",
            "Quality verification of Volunteered Geographic Information using OSM Notes data in a global context",
            "https://doi.org/10.3390/ijgi9060372",
            "Auditoría cualitativa de errores y retroalimentación ciudadana mediante el análisis de las Notas de OpenStreetMap."
        ],
        [
            "(See et al., 2016)",
            "See, L., Mooney, P., Foody, G., et al. (2016). Crowdsourcing, citizen science or Volunteered Geographic Information? The current state of crowdsourced geographic information. ISPRS International Journal of Geo-Information, 5(5), 55.",
            "Artículo de Revisión Seminal",
            "See, Linda et al.",
            "2016",
            "Crowdsourcing, citizen science or Volunteered Geographic Information? The current state of crowdsourced geographic information",
            "https://doi.org/10.3390/ijgi5050055",
            "Clarificación conceptual y taxonómica entre crowdsourcing espacial, ciencia ciudadana y cartografía voluntaria."
        ],
        [
            "(See et al., 2025)",
            "See, L., et al. (2025). Recent advances in Volunteered Geographic Information (VGI) and citizen science. International Journal of Digital Earth, 18(1), 2480220.",
            "Artículo en Revista Científica",
            "See, Linda et al.",
            "2025",
            "Recent advances in Volunteered Geographic Information (VGI) and citizen science",
            "https://doi.org/10.1080/17538947.2025.2480220",
            "Estado del arte de los últimos avances en plataformas de información voluntaria, interoperabilidad y modelos de inteligencia geoespacial."
        ],
        [
            "(Antoniou & Skopeliti, 2015)",
            "Antoniou, V., & Skopeliti, A. (2015). Measures and indicators of VGI quality: An overview. ISPRS Annals of Photogrammetry, Remote Sensing and Spatial Information Sciences, II-3/W5, 345-351.",
            "Actas de Conferencia Científica",
            "Antoniou, V., & Skopeliti, A.",
            "2015",
            "Measures and indicators of VGI quality: An overview",
            "https://doi.org/10.5194/isprsannals-II-3-W5-345-2015",
            "Inventario y sistematización de métricas de calidad intrínseca y extrínseca para la información geográfica voluntaria."
        ],
        [
            "(Skopeliti & Antoniou, 2017)",
            "Skopeliti, A., & Antoniou, V. (2017). Visualization and communication of VGI quality. In Mapping and the Citizen Sensor (pp. 193-219). Ubiquity Press.",
            "Capítulo de Libro Académico",
            "Skopeliti, A., & Antoniou, V.",
            "2017",
            "Visualization and communication of VGI quality",
            "https://doi.org/10.5334/bbf.i",
            "Directrices para comunicar la incertidumbre y calidad espacial a usuarios no técnicos en visores cartográficos interactivos."
        ],
        [
            "(Kounadi & Leitner, 2014)",
            "Kounadi, O., & Leitner, M. (2014). Why does geoprivacy matter? The scientific publications of confidential data presented on maps. Journal of Empirical Research on Human Research Ethics, 9(4), 34-45.",
            "Artículo en Revista Científica",
            "Kounadi, O., & Leitner, M.",
            "2014",
            "Why does geoprivacy matter? The scientific publications of confidential data presented on maps",
            "https://doi.org/10.1177/1556264614544103",
            "Principios éticos de geoseguridad, confidencialidad espacial y protección de datos territoriales sensibles en plataformas públicas."
        ],
        [
            "(Goodchild & Li, 2012)",
            "Goodchild, M. F., & Li, L. (2012). Assuring the quality of volunteered geographic information. Spatial Statistics, 1, 110-120.",
            "Artículo en Revista Científica",
            "Goodchild, M. F., & Li, L.",
            "2012",
            "Assuring the quality of volunteered geographic information",
            "https://doi.org/10.1016/j.spasta.2012.03.002",
            "Los tres enfoques de aseguramiento de calidad en VGI: enfoque de multitudes (Linus' Law), enfoque geográfico y enfoque instrumental."
        ],
        [
            "(Soriano, 2016)",
            "Soriano, C. (2016). La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad? Revista Cartográfica, 93, 11-28.",
            "Artículo en Revista Científica",
            "Soriano, Claudia",
            "2016",
            "La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad?",
            "https://doi.org/10.35424/rcarto.i93.376",
            "Marco metodológico en español para la adopción de indicadores ISO 19157 aplicados a proyectos VGI en América Latina."
        ],
        [
            "(Pastor, 2015)",
            "Pastor, J. (2015). La confianza de la Información Geográfica Voluntaria (VGI). Revista Cartográfica, 91, 33-49.",
            "Artículo en Revista Científica",
            "Pastor, Joan",
            "2015",
            "La confianza de la Información Geográfica Voluntaria (VGI)",
            "https://doi.org/10.35424/rcarto.i91.352",
            "Modelos de confianza y reputación comunitaria para validar capas cartográficas en la toma de decisiones territoriales."
        ],
        [
            "(Magaña & Valverde, 2016)",
            "Magaña, A., & Valverde, F. (2016). Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica. Revista Cartográfica, 93, 29-53.",
            "Artículo de Revisión Científica",
            "Magaña, A., & Valverde, F.",
            "2016",
            "Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica",
            "https://doi.org/10.35424/rcarto.i93.377",
            "Diagnóstico de la adopción, brechas y potencialidades de la cartografía voluntaria en los países latinoamericanos."
        ],
        [
            "(Jacobs & Zipf, 2017)",
            "Jacobs, C., & Zipf, A. (2017). Completeness of citizen science biodiversity data from a volunteered geographic information perspective. Geo-spatial Information Science, 20(2), 100-111.",
            "Artículo en Revista Científica",
            "Jacobs, C., & Zipf, A.",
            "2017",
            "Completeness of citizen science biodiversity data from a volunteered geographic information perspective",
            "https://doi.org/10.1080/10095020.2017.1288424",
            "Evaluación de completitud espacial de datos biológicos ciudadanos cruzando metodologías de VGI con registros de GBIF."
        ],
        [
            "(Chapman, 2005)",
            "Chapman, A. D. (2005). Principles of data quality and principles and methods of data cleaning. Global Biodiversity Information Facility (GBIF).",
            "Manual Técnico / Guía de Calidad",
            "Chapman, Arthur D.",
            "2005",
            "Principles of Data Quality & Methods of Data Cleaning",
            "https://www.gbif.org/document/80509",
            "Principios rectores para el saneamiento, detección de coordenadas anómalas y validación taxonómica en datos biológicos abiertos."
        ],
        [
            "(Wilkinson et al., 2016)",
            "Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. Scientific Data, 3, 160018.",
            "Artículo en Revista Científica",
            "Wilkinson, M. D. et al.",
            "2016",
            "The FAIR Guiding Principles for scientific data management and stewardship",
            "https://doi.org/10.1038/sdata.2016.18",
            "Principios FAIR (Findable, Accessible, Interoperable, Reusable) aplicados a la exportación de metadatos ISO 19139 y GeoJSON del Atlas."
        ],
        [
            "(UN-GGIM, 2024)",
            "United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2024). Future trends in geospatial information management: The five to ten year vision (4th ed.). United Nations.",
            "Informe Estratégico Global",
            "UN-GGIM",
            "2024",
            "Future trends in geospatial information management: The five to ten year vision",
            "https://ggim.un.org/",
            "Visión global sobre la integración de VGI, ética geoespacial, computación en el borde y estándares abiertos para el desarrollo sostenible."
        ],
        [
            "(DTPM, 2024)",
            "Directorio de Transporte Público Metropolitano [DTPM]. (2024). Reporte de Cobertura, Accesibilidad y Gestión de Paradas Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile.",
            "Informe Técnico de Gestión",
            "DTPM / MTT",
            "2024",
            "Reporte de Cobertura, Accesibilidad y Gestión de Paradas Red Movilidad",
            "https://www.dtpm.cl",
            "Estadísticas actualizadas de paradas activas e infraestructura peatonal en la comuna de Santiago."
        ],
        [
            "(Ecma International, 2024)",
            "Ecma International. (2024). ECMAScript® 2024 Language Specification (Standard ECMA-262, 15th ed.). Ecma International.",
            "Estándar / Manual Técnico de Lenguaje",
            "Ecma International",
            "2024",
            "ECMAScript® 2024 Language Specification (Standard ECMA-262)",
            "https://www.ecma-international.org/publications-and-standards/standards/ecma-262/",
            "Especificación del lenguaje JavaScript utilizado para la arquitectura modular, cálculos geodésicos en cliente y reactividad del Atlas."
        ],
        [
            "(Van Rossum & Drake, 2024)",
            "Van Rossum, G., & Drake, F. L. (2024). The Python Language Reference (Manual v3.12). Python Software Foundation.",
            "Manual Oficial de Lenguaje",
            "Python Software Foundation",
            "2024",
            "The Python Language Reference (v3.12)",
            "https://docs.python.org/3/reference/",
            "Manual del lenguaje Python empleado en los scripts de generación automatizada de catálogos Excel y sincronización de metadatos."
        ],
        [
            "(WHATWG, 2024)",
            "Web Hypertext Application Technology Working Group [WHATWG]. (2024). HTML Living Standard. WHATWG / World Wide Web Consortium.",
            "Estándar / Especificación de Lenguaje de Marcado",
            "WHATWG / W3C",
            "2024",
            "HTML Living Standard: The specification for web application developers",
            "https://html.spec.whatwg.org/multipage/",
            "Especificación del lenguaje de marcado semántico que estructura la interfaz, paneles modulares y manual in-app del Atlas."
        ],
        [
            "(W3C, 2023)",
            "World Wide Web Consortium [W3C]. (2023). Cascading Style Sheets (CSS) Snapshot 2023 (W3C Working Group Note). W3C.",
            "Estándar / Especificación de Hojas de Estilo",
            "World Wide Web Consortium [W3C]",
            "2023",
            "Cascading Style Sheets (CSS) Snapshot 2023",
            "https://www.w3.org/TR/css-2023/",
            "Estándar de estilos web que define la estética técnica sobria, diseño cartográfico y diagramas vectoriales del sistema."
        ],
        [
            "(Olbricht & OSMF, 2023)",
            "Olbricht, R., & OpenStreetMap Contributors. (2023). Overpass QL: Overpass API Language Guide and Reference Manual. OpenStreetMap Foundation.",
            "Manual Técnico / Lenguaje de Consulta",
            "OpenStreetMap Foundation",
            "2023",
            "Overpass QL: Overpass API Language Guide and Reference Manual",
            "https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL",
            "Manual formal del lenguaje de consulta espacial empleado para extraer nodos, vías y relaciones filtradas desde servidores Overpass."
        ],
        [
            "(Butler et al., 2016)",
            "Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016). The GeoJSON Format (RFC No. 7946). Internet Engineering Task Force (IETF).",
            "Estándar de Protocolo / Formato de Intercambio Espacial",
            "Internet Engineering Task Force [IETF]",
            "2016",
            "The GeoJSON Format (RFC 7946)",
            "https://doi.org/10.17487/RFC7946",
            "Especificación del formato estándar de intercambio geográfico para el transporte y procesamiento de geometrías vectoriales en el Atlas."
        ],
        [
            "(W3C, 2018)",
            "World Wide Web Consortium [W3C]. (2018). Scalable Vector Graphics (SVG) 2.0 Specification (W3C Candidate Recommendation). W3C.",
            "Estándar / Especificación de Gráficos Vectoriales",
            "World Wide Web Consortium [W3C]",
            "2018",
            "Scalable Vector Graphics (SVG) 2.0 Specification",
            "https://www.w3.org/TR/SVG2/",
            "Especificación de gráficos vectoriales XML empleada en los esquemas arquitectónicos y diagramas geodésicos del manual técnico."
        ],
        [
            "(MacFarlane et al., 2024)",
            "MacFarlane, J., Krewenki, P., Greenspun, J., et al. (2024). CommonMark Spec: A strongly defined, highly compatible specification of Markdown (Version 0.31.2). CommonMark.",
            "Especificación de Lenguaje de Documentación",
            "CommonMark Working Group",
            "2024",
            "CommonMark Spec: Markdown specification",
            "https://spec.commonmark.org/",
            "Estándar de texto plano estructurado utilizado en la memoria técnica académica, bitácoras de versión y guías de contribución."
        ]
    ]
    
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
