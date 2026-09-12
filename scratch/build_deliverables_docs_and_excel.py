import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

DELIVERABLES_DIR = r"D:\17082025\2026\Practica profesional\ENTREGABLES_PRACTICA"
EXCEL_DIR = os.path.join(DELIVERABLES_DIR, "07_Catalogos_Excel_Sincronizados")

os.makedirs(DELIVERABLES_DIR, exist_ok=True)
os.makedirs(EXCEL_DIR, exist_ok=True)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_callout_box(cell, border_hex="2E6DA4", fill_hex="F0F4F8"):
    set_cell_background(cell, fill_hex)
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    
    left = OxmlElement('w:left')
    left.set(qn('w:val'), 'single')
    left.set(qn('w:sz'), '24')
    left.set(qn('w:space'), '0')
    left.set(qn('w:color'), border_hex)
    tcBorders.append(left)
    
    for side in ['top', 'bottom', 'right']:
        node = OxmlElement(f'w:{side}')
        node.set(qn('w:val'), 'none')
        tcBorders.append(node)
        
    tcPr.append(tcBorders)

def create_doc(title_text, subtitle_text="Práctica Profesional de Geografía 2026 — Universidad Alberto Hurtado"):
    doc = Document()
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Atlas VGI Barrio Brasil — Universidad Alberto Hurtado (Práctica 2026)")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(100, 116, 139)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun = fp.add_run("Departamento de Geografía UAH | Documento Oficial de Entregable")
        frun.font.name = "Arial"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(100, 116, 139)

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, "1A3A5C") # Deep Navy / Midnight Blue
    set_cell_margins(cell, top=180, bottom=180, left=200, right=200)
    
    cp = cell.paragraphs[0]
    cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run_sub = cp.add_run(f"{subtitle_text.upper()}\n")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(9.5)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(214, 228, 240) # #D6E4F0 Soft Ice Blue
    
    run_title = cp.add_run(title_text)
    run_title.font.name = "Arial"
    run_title.font.size = Pt(14.5)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(255, 255, 255)
    
    doc.add_paragraph()
    return doc

def add_h1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = RGBColor(26, 58, 92) # #1A3A5C
    return p

def add_h2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(11)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(46, 109, 164) # #2E6DA4
    return p

def add_h3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(10)
    run.font.bold = True
    run.font.color.rgb = RGBColor(44, 62, 80) # #2C3E50
    return p

def add_p(doc, text, bold_prefix=None, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(9.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(26, 58, 92)
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(9.5)
    run.font.italic = italic
    run.font.color.rgb = RGBColor(44, 62, 80)
    return p

def add_bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(9.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(26, 58, 92)
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(44, 62, 80)
    return p

def add_callout(doc, text, title="MARCO REGULATORIO Y NORMATIVO:"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_callout_box(cell, border_hex="2E6DA4", fill_hex="F0F4F8")
    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    if title:
        r_title = p.add_run(f"{title}\n")
        r_title.font.name = "Arial"
        r_title.font.size = Pt(9)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(46, 109, 164)
        
    r_body = p.add_run(text)
    r_body.font.name = "Arial"
    r_body.font.size = Pt(9)
    r_body.font.color.rgb = RGBColor(44, 62, 80)
    doc.add_paragraph()

def set_table_borders(table, border_hex="CBD5E1"):
    tblPr = table._tbl.tblPr
    tblBorders = OxmlElement('w:tblBorders')
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), '4')  # 0.5 pt
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), border_hex)
        tblBorders.append(border)
    tblPr.append(tblBorders)

def add_styled_table(doc, headers, rows_data, highlight_rows=None):
    if highlight_rows is None:
        highlight_rows = []
    table = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table, "CBD5E1")
    
    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_background(hdr_cells[i], "2E6DA4") # Royal Blue Header
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        for p in hdr_cells[i].paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Arial"
                r.font.size = Pt(8.5)
                r.font.bold = True
                r.font.color.rgb = RGBColor(255, 255, 255) # White Text
                
    for r_idx, row in enumerate(rows_data):
        row_cells = table.rows[r_idx + 1].cells
        primer_valor = str(row[0]).upper() if len(row) > 0 else ""
        
        # Asignar tonos por Objetivo / Fase conforme a PLAN DE TRABAJO PRACTICA 2026.xlsx
        bg_hex = "F7FAFC" if r_idx % 2 == 1 else "FFFFFF"
        es_resaltado = (r_idx in highlight_rows)
        
        if ("OE 1" in primer_valor) or ("FASE 1" in primer_valor):
            bg_hex = "DEEAF1" # Soft Slate Blue
            es_resaltado = True
        elif ("OE 2" in primer_valor) or ("FASE 2" in primer_valor):
            bg_hex = "E2EFDA" # Soft Sage Green
            es_resaltado = True
        elif ("OE 3" in primer_valor) or ("FASE 3" in primer_valor):
            bg_hex = "FFF2CC" # Soft Pastel Amber
            es_resaltado = True
        elif ("OE 4" in primer_valor) or ("FASE 4" in primer_valor):
            bg_hex = "FCE4D6" # Soft Pastel Peach
            es_resaltado = True
        elif es_resaltado or any(k in primer_valor for k in ["HITO", "TOTAL", "ETAPA", "CATEGORÍA", "MARCO"]):
            bg_hex = "DEEAF1"
            es_resaltado = True

        for c_idx, cell_value in enumerate(row):
            row_cells[c_idx].text = str(cell_value)
            set_cell_background(row_cells[c_idx], bg_hex)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
            for p in row_cells[c_idx].paragraphs:
                for r in p.runs:
                    r.font.name = "Arial"
                    r.font.size = Pt(8)
                    if es_resaltado:
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(15, 23, 42)
                    else:
                        r.font.color.rgb = RGBColor(44, 62, 80)
                    
    doc.add_paragraph()

# ==============================================================================
# BUILDER 00: PLAN DE TRABAJO Y CARTA GANTT (.docx)
# ==============================================================================
def build_entregable_00():
    doc = create_doc("PLAN DE TRABAJO Y CARTA GANTT — Práctica Profesional de Geografía 2026")
    
    add_h1(doc, "1. Planificación Cronológica del Plan de Trabajo")
    add_p(doc, "La siguiente tabla resume el cronograma de trabajo, hitos clave, actividades y entregables comprometidos para el desarrollo del Atlas VGI en el Barrio Brasil y campus UAH durante el período lectivo 2026:")
    
    gantt_headers = ["N°", "Actividad / Hito del Plan de Trabajo", "Mar", "Abr", "May", "Jun", "Jul", "Responsable / Entregables"]
    gantt_rows = [
        ["FASE 1", "CARACTERIZACIÓN TERRITORIAL Y DISEÑO CONCEPTUAL", "■", "■", "", "", "", "Juan P. Lescano / Entregables 01-03"],
        ["Hito 1", "Delimitación del Bbox Barrio Brasil y perfilamiento de usuarios", "■", "", "", "", "", "Docx / GeoJSON Bbox"],
        ["Hito 2", "Catastro e inventario de 10 APIs abiertas (Overpass, ohsome, GBIF)", "■", "■", "", "", "", "Entregable 02 (.docx & .xlsx)"],
        ["Hito 3", "Diseño conceptual de 10 macro-categorías VGI y 134 descriptores", "", "■", "", "", "", "Entregable 03 (.docx & .xlsx)"],
        ["FASE 2", "GEODATABASE VGI, DENSIDADES Y CALIDAD ESPACIAL", "", "■", "■", "", "", "Juan P. Lescano / Entregables 04-07"],
        ["Hito 4", "Reproyección geodésica EPSG:32719 y cálculo de superficies m²", "", "■", "", "", "", "Geodatabase GeoJSON / QGIS"],
        ["Hito 5", "Auditoría ohsome OQT (Saturación y Madurez / Herfort 2023)", "", "■", "■", "", "", "ohsome Analytics / OSHDB"],
        ["Hito 6", "Perfil Nacional Metadatos ISO 19115 / ISO 19139 para IDE Chile", "", "", "■", "", "", "Entregable 07 (.docx & .xlsx)"],
        ["FASE 3", "DESARROLLO WEB CLIENT-SIDE, INTERFAZ Y PROTOTIPO ATLAS", "", "", "■", "■", "", "Juan P. Lescano / Entregables 08-11"],
        ["Hito 7", "Diseño UI/UX accesible (WCAG AAA) y paleta de alto contraste", "", "", "■", "", "", "Entregable 08 (.docx & .css)"],
        ["Hito 8", "Desarrollo del prototipo Atlas VGI 2D con Leaflet 1.9.4", "", "", "■", "■", "", "Plataforma Web (src/)"],
        ["Hito 9", "Inspector Normativo PRC Santiago (Art 2.1.24 OGUC y Riesgos)", "", "", "", "■", "", "evaluador_normativo.js"],
        ["FASE 4", "VALIDACIÓN, MANUALES Y MEMORIA FINAL REPRODUCIBLE", "", "", "", "■", "■", "Juan P. Lescano / Entregables 12-15"],
        ["Hito 10", "Manuales de uso, actualización reproducible CLI e informe final", "", "", "", "■", "■", "Entregables 12, 13, 14, 15"]
    ]
    
    add_styled_table(doc, gantt_headers, gantt_rows)
    
    add_callout(doc, "El cronograma de trabajo cumple estrictamente los estándares de la Facultad de Ciencias Sociales y el Departamento de Geografía de la Universidad Alberto Hurtado.", "CUMPLIMIENTO DE OBJETIVOS:")
    
    filepath = os.path.join(DELIVERABLES_DIR, "00_Plan_de_Trabajo_y_Carta_Gantt.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER 01: ENTREGABLE 01 (.docx)
# ==============================================================================
def build_entregable_01():
    doc = create_doc("ENTREGABLE 01 — Ficha del Proyecto: Territorio, Usuarios, Objetivos y Alcance")
    
    add_h1(doc, "1. Datos Generales de la Práctica Profesional")
    add_bullet(doc, "Atlas de Información Geográfica Voluntaria para la Gestión Territorial (nodo-geoabierto)", "Proyecto: ")
    add_bullet(doc, "Geografía — Universidad Alberto Hurtado (2026)", "Carrera: ")
    add_bullet(doc, "Juan Pablo Lescano Villegas", "Estudiante: ")
    add_bullet(doc, "Facultad de Ciencias Sociales / Departamento de Geografía UAH", "Institución Acogedora: ")
    
    add_h1(doc, "2. Delimitación del Territorio Piloto")
    add_p(doc, "El polígono de estudio corresponde al Barrio Brasil y el campus universitario de la Universidad Alberto Hurtado en la comuna de Santiago Centro, Región Metropolitana de Santiago.")
    add_bullet(doc, "Santiago Centro, Región Metropolitana de Santiago, Chile.", "Comuna / Sector: ")
    add_bullet(doc, "[-70.6675, -33.4505, -70.6565, -33.4385] (WGS84 / EPSG:4326).", "Bounding Box Predeterminado: ")
    add_bullet(doc, "EPSG:32719 (WGS 84 / UTM Huso 19 Sur) con reproyección geodésica mediante Shoelace en metros cuadrados.", "Sistema de Referencia Métrico: ")
    add_bullet(doc, "Eje patrimonial UAH (calles Cienfuegos, Erasmo Escala, Almirante Barroso, Los Héroes), Plaza Brasil, Alameda Bernardo O'Higgins, Eje Rosas/Huérfanos y conectores con estaciones de Metro Los Héroes (L1/L2) y Santa Ana (L2/L5).", "Cobertura Urbana: ")
    
    add_h1(doc, "3. Definición de Usuarios Objetivo (Perfiles)")
    add_bullet(doc, "Permite realizar diagnósticos participativos, identificar nudos viales y auditar brechas de espacio público y arbolado.", "1. Organizaciones Comunitarias / Juntas de Vecinos: ")
    add_bullet(doc, "Facilita la auditoría de completitud, densidad de etiquetas y atribución colaborativa en OpenStreetMap.", "2. Voluntarios / Mapeadores OSM: ")
    add_bullet(doc, "Permite contrastar la cartografía colaborativa con el Plan Regulador Comunal (PRC Santiago), zonificación OGUC y áreas de riesgo.", "3. Instituciones / Autoridades (SECPLAN Muni, MINVU, IDE Chile): ")
    add_bullet(doc, "Proporciona monitoreo ambiental, indicadores de arbolado nativo/patrimonial y caminabilidad inclusiva.", "4. ONGs e Investigadores: ")
    
    add_h1(doc, "4. Matriz de Objetivos Comprometidos")
    add_p(doc, "Desarrollar un prototipo de Atlas web para la gestión territorial del Barrio Brasil y campus UAH mediante datos VGI estandarizados e interoperables.", "Objetivo General: ")
    
    add_h2(doc, "Objetivos Específicos")
    add_bullet(doc, "Caracterizar el territorio y diseñar conceptualmente el Atlas VGI (Hitos 1-3).", "1. ")
    add_bullet(doc, "Construir la Geodatabase VGI y evaluar la calidad espacial con el Índice ICV (Hitos 4-6).", "2. ")
    add_bullet(doc, "Diseñar la identidad gráfica, interfaz accesible y prototipo web funcional (Hitos 7-8).", "3. ")
    add_bullet(doc, "Validar con usuarios clave, redactar los manuales de uso/actualización e informe final (Hitos 9-10).", "4. ")
    
    add_h1(doc, "5. Cronograma General y Carta Gantt del Plan de Trabajo")
    add_p(doc, "A continuación se presenta la tabla oficial del Plan de Trabajo estructurada en 4 fases metodológicas:")
    
    gantt_headers = ["N°", "Actividad / Hito del Plan de Trabajo", "Mar", "Abr", "May", "Jun", "Jul", "Responsable / Entregables"]
    gantt_rows = [
        ["FASE 1", "CARACTERIZACIÓN TERRITORIAL Y DISEÑO CONCEPTUAL", "■", "■", "", "", "", "Juan P. Lescano / Entregables 01-03"],
        ["Hito 1", "Delimitación del Bbox Barrio Brasil y perfilamiento de usuarios", "■", "", "", "", "", "Docx / GeoJSON Bbox"],
        ["Hito 2", "Catastro e inventario de 10 APIs abiertas (Overpass, ohsome, GBIF)", "■", "■", "", "", "", "Entregable 02 (.docx & .xlsx)"],
        ["Hito 3", "Diseño conceptual de 10 macro-categorías VGI y 134 descriptores", "", "■", "", "", "", "Entregable 03 (.docx & .xlsx)"],
        ["FASE 2", "GEODATABASE VGI, DENSIDADES Y CALIDAD ESPACIAL", "", "■", "■", "", "", "Juan P. Lescano / Entregables 04-07"],
        ["Hito 4", "Reproyección geodésica EPSG:32719 y cálculo de superficies m²", "", "■", "", "", "", "Geodatabase GeoJSON / QGIS"],
        ["Hito 5", "Auditoría ohsome OQT (Saturación y Madurez / Herfort 2023)", "", "■", "■", "", "", "ohsome Analytics / OSHDB"],
        ["Hito 6", "Perfil Nacional Metadatos ISO 19115 / ISO 19139 para IDE Chile", "", "", "■", "", "", "Entregable 07 (.docx & .xlsx)"],
        ["FASE 3", "DESARROLLO WEB CLIENT-SIDE, INTERFAZ Y PROTOTIPO ATLAS", "", "", "■", "■", "", "Juan P. Lescano / Entregables 08-11"],
        ["Hito 7", "Diseño UI/UX accesible (WCAG AAA) y paleta de alto contraste", "", "", "■", "", "", "Entregable 08 (.docx & .css)"],
        ["Hito 8", "Desarrollo del prototipo Atlas VGI 2D con Leaflet 1.9.4", "", "", "■", "■", "", "Plataforma Web (src/)"],
        ["Hito 9", "Inspector Normativo PRC Santiago (Art 2.1.24 OGUC y Riesgos)", "", "", "", "■", "", "evaluador_normativo.js"],
        ["FASE 4", "VALIDACIÓN, MANUALES Y MEMORIA FINAL REPRODUCIBLE", "", "", "", "■", "■", "Juan P. Lescano / Entregables 12-15"],
        ["Hito 10", "Manuales de uso, actualización reproducible CLI e informe final", "", "", "", "■", "■", "Entregables 12, 13, 14, 15"]
    ]
    add_styled_table(doc, gantt_headers, gantt_rows)
    
    add_callout(doc, "El proyecto se fundamenta en las normas ISO 19115-1:2014, ISO 19139:2007, ISO 19157:2013, ISO 19110:2016 y la Política Nacional de Información Geoespacial de Chile (IDE Chile / SNIT), garantizando total interoperabilidad con los sistemas del Estado.", "ALINEACIÓN NORMATIVA IDE CHILE:")
    
    filepath = os.path.join(DELIVERABLES_DIR, "01_Ficha_del_Proyecto_Barrio_Brasil_UAH.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER 02: ENTREGABLE 02 (.docx & .xlsx)
# ==============================================================================
def build_entregable_02():
    doc = create_doc("ENTREGABLE 02 — Catálogo de Fuentes VGI e Inventario de APIs Abiertas")
    
    add_h1(doc, "1. Descripción del Inventario de Fuentes")
    add_p(doc, "El Atlas VGI integra en tiempo real 10 plataformas y APIs abiertas de escala global y nacional para la compilación, validación, evaluación de calidad y despliegue de la información geográfica del Barrio Brasil y campus UAH.")
    
    headers = ["#", "API / Plataforma", "Endpoint Base", "Módulo JS", "Función en el Atlas", "Licencia"]
    rows = [
        ["1", "Overpass API v0.7", "https://overpass-api.de/api/interpreter", "src/js/modulos/osm.js", "Extracción vectorial de geometrías (nodos, vías, relaciones) según las 8 macro-categorías VGI.", "ODbL 1.0"],
        ["2", "ohsome API v1/v2", "https://api.ohsome.org/v1", "src/js/modulos/ohsome.js", "Auditoría de evolución histórica espacio-temporal (series anuales), volumen y masa crítica de colaboradores.", "ODbL / CC-BY"],
        ["3", "ohsome Quality Analyst (OQT)", "Marco HeiGIT (Herfort et al., 2023)", "src/js/modulos/calidad_analyst.js", "Estimación del Índice de Saturación de Mapeo y completitud de atributos críticos.", "CC-BY 4.0"],
        ["4", "OSM Changesets API v0.6", "https://api.openstreetmap.org/api/0.6/", "src/js/modulos/calidad_analyst.js", "Control de cambios y validación de ediciones recientes en el Bbox territorial.", "ODbL 1.0"],
        ["5", "OSMCha", "https://osmcha.org/changesets/{id}", "src/js/modulos/calidad_analyst.js", "Enlace directo e inspección visual de cambios realizados por mapeadores.", "BSD-3-Clause"],
        ["6", "Taginfo API v4", "https://taginfo.openstreetmap.org/api/4/", "src/js/modulos/taginfo.js", "Telemetría global de claves/valores OSM y porcentaje de representatividad.", "ODbL 1.0"],
        ["7", "GBIF Occurrence & Species API", "https://api.gbif.org/v1/occurrence/search", "src/js/modulos/gbif.js", "Biodiversidad urbana, autocompletado taxonómico en vivo y calidad Darwin Core.", "CC0 / CC-BY"],
        ["8", "UMap OpenStreetMap France", "https://umap.openstreetmap.fr/es/map/", "src/js/modulos/umap.js", "Integración de proyectos cartográficos colaborativos locales y exportación GeoJSON.", "AGPLv3"],
        ["9", "iNaturalist API", "https://api.inaturalist.org/v1/observations", "src/js/modulos/gbif.js", "Observaciones biológicas de ciencia ciudadana federadas a través de GBIF.", "CC-BY 4.0"],
        ["10", "IDE Chile / MINVU / INE Censo 2024", "https://geoide.minvu.cl/server/rest/services/", "src/js/modulos/ide_chile.js", "Microdatos Censo 2024, 27 capas oficiales de normativa IPT, áreas verdes y patrimonio.", "Ley 20.285"]
    ]
    add_styled_table(doc, headers, rows)
    
    add_callout(doc, "Todas las fuentes integradas operan bajo estándares de acceso abierto y licencias libres, asegurando el cumplimiento de la Ley N° 20.285 de Transparencia de la Función Pública y la reciprocidad comunitaria (Copyleft).", "TRANSPARENCIA Y DATOS ABIERTOS:")
    
    filepath = os.path.join(DELIVERABLES_DIR, "02_Catalogo_Fuentes_VGI_Inventario.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")
    
    # Excel version
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Fuentes VGI & APIs"
    
    title_font = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    title_fill = PatternFill(start_color="1A3A5C", end_color="1A3A5C", fill_type="solid")
    sub_font = Font(name="Calibri", size=10, italic=True, color="555555")
    sub_fill = PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid")
    
    ws.merge_cells("A1:F1")
    ws["A1"] = "ENTREGABLE 02 — CATÁLOGO DE FUENTES VGI E INVENTARIO DE APIS ABIERTAS"
    ws["A1"].font = title_font
    ws["A1"].fill = title_fill
    ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 35
    
    ws.merge_cells("A2:F2")
    ws["A2"] = "Práctica Profesional de Geografía 2026 — Universidad Alberto Hurtado | Inventario Sistemático de APIs y Servicios Abiertos"
    ws["A2"].font = sub_font
    ws["A2"].fill = sub_fill
    ws["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 22
    
    hdr_font = Font(name="Calibri", size=10.5, bold=True, color="FFFFFF")
    hdr_fill = PatternFill(start_color="2E6DA4", end_color="2E6DA4", fill_type="solid")
    
    ws.append([]) # Blank row
    ws.append(headers)
    ws.row_dimensions[4].height = 26
    
    for col in range(1, len(headers) + 1):
        cell = ws.cell(row=4, column=col)
        cell.font = hdr_font
        cell.fill = hdr_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    
    for r_idx, row in enumerate(rows, start=5):
        ws.append(row)
        ws.row_dimensions[r_idx].height = 24
        fill_color = "F7FAFC" if r_idx % 2 == 1 else "FFFFFF"
        row_fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type="solid")
        for col_idx in range(1, len(row) + 1):
            cell = ws.cell(row=r_idx, column=col_idx)
            cell.fill = row_fill
            cell.border = thin_border
            cell.font = Font(name="Calibri", size=10, color="2C3E50")
            cell.alignment = Alignment(vertical="center", wrap_text=True)
            
    ws.column_dimensions['A'].width = 6
    ws.column_dimensions['B'].width = 28
    ws.column_dimensions['C'].width = 45
    ws.column_dimensions['D'].width = 28
    ws.column_dimensions['E'].width = 50
    ws.column_dimensions['F'].width = 16
    
    excel_path = os.path.join(DELIVERABLES_DIR, "02_Catalogo_Fuentes_VGI_Inventario.xlsx")
    excel_path_sub = os.path.join(EXCEL_DIR, "catalogo_fuentes_vgi.xlsx")
    wb.save(excel_path)
    wb.save(excel_path_sub)
    print(f"Saved Excel: {excel_path} and {excel_path_sub}")

# ==============================================================================
# BUILDER 03: ENTREGABLE 03 (.docx & .xlsx)
# ==============================================================================
def build_entregable_03():
    doc = create_doc("ENTREGABLE 03 — Diseño Conceptual del Atlas VGI y Arquitectura de Capas")
    
    add_h1(doc, "1. Arquitectura Temática y Macro-Categorías VGI")
    add_p(doc, "El Atlas VGI organiza la información espacial del Barrio Brasil y la Universidad Alberto Hurtado en 10 macro-categorías temáticas estandarizadas, compuestas por 134 descriptores normativos (48 capas oficiales del Estado y 86 descriptores comunitarios de brecha).")
    
    headers = ["Código", "Categoría Temática VGI", "Clave OSM", "Valor OSM", "Geometría", "Color Neón", "Foco Territorial Barrio Brasil / UAH"]
    rows = [
        ["CAT-01", "Educación y Universidad", "amenity", "university / school", "Puntos / Polígonos", "#10b981", "Sedes UAH (Cienfuegos, Erasmo Escala, Almirante Barroso) y liceos."],
        ["CAT-02", "Servicios, Comercio y Abastecimiento", "shop / amenity", "bakery / pharmacy / cafe", "Puntos / Polígonos", "#f59e0b", "Panaderías de barrio, farmacias, boticas y comercio local."],
        ["CAT-03", "Movilidad y Transporte Público", "highway / railway", "bus_stop / station", "Puntos / Líneas", "#38bdf8", "Paraderos Red Movilidad, accesos Metro Los Héroes y Santa Ana."],
        ["CAT-04", "Movilidad Activa y Ciclovías", "highway / amenity", "cycleway / bicycle_parking", "Líneas / Puntos", "#10b981", "Ciclovías segregadas en Rosas/Cumming y biciestacionamientos UAH."],
        ["CAT-05", "Áreas Verdes y Espacio Público", "leisure", "park / garden", "Polígonos", "#10b981", "Plaza Brasil, bandejones verdes en Av. Brasil y áreas de recreación."],
        ["CAT-06", "Patrimonio, Cultura e Identidad", "historic", "* (casona / monument)", "Polígonos / Puntos", "#a855f7", "Inmuebles de Conservación Histórica (ICH), casonas UAH y Basílica."],
        ["CAT-07", "Accesibilidad Universal y Caminabilidad", "kerb / highway", "lowered / crossing", "Puntos", "#38bdf8", "Rebajes de cordón D.S. 50, cruces peatonales y veredas accesibles."],
        ["CAT-08", "Biodiversidad Urbana y Arbolado", "natural / species", "tree / Zonotrichia capensis", "Puntos", "#10b981", "Arbolado patrimonial (pimientos, peumos) y avifauna urbana (GBIF)."],
        ["CAT-09", "Huella Construida (Buildings)", "building", "yes / university / historic", "Polígonos", "#06b6d4", "Volumetría de edificaciones, superficies en m² calculadas a EPSG:32719."],
        ["CAT-10", "Cobertura y Usos de Suelo (Landuse)", "landuse", "residential / commercial", "Polígonos", "#10b981", "Zonificación de usos de suelo urbanos contrastada con PRC Santiago."]
    ]
    add_styled_table(doc, headers, rows)
    
    filepath = os.path.join(DELIVERABLES_DIR, "03_Diseno_Conceptual_Atlas_VGI_Arquitectura.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")
    
    # Excel version
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Categorías & Descriptores VGI"
    
    title_font = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    title_fill = PatternFill(start_color="1A3A5C", end_color="1A3A5C", fill_type="solid")
    sub_font = Font(name="Calibri", size=10, italic=True, color="555555")
    sub_fill = PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid")
    
    ws.merge_cells("A1:G1")
    ws["A1"] = "ENTREGABLE 03 — MATRIZ DE CATEGORÍAS TEMÁTICAS Y DESCRIPTORES VGI"
    ws["A1"].font = title_font
    ws["A1"].fill = title_fill
    ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 35
    
    ws.merge_cells("A2:G2")
    ws["A2"] = "Práctica Profesional de Geografía 2026 — Universidad Alberto Hurtado | Matriz de 10 Macro-Categorías y 134 Descriptores"
    ws["A2"].font = sub_font
    ws["A2"].fill = sub_fill
    ws["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 22
    
    hdr_font = Font(name="Calibri", size=10.5, bold=True, color="FFFFFF")
    hdr_fill = PatternFill(start_color="2E6DA4", end_color="2E6DA4", fill_type="solid")
    
    ws.append([])
    ws.append(headers)
    ws.row_dimensions[4].height = 26
    
    for col in range(1, len(headers) + 1):
        cell = ws.cell(row=4, column=col)
        cell.font = hdr_font
        cell.fill = hdr_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    
    for r_idx, row in enumerate(rows, start=5):
        ws.append(row)
        ws.row_dimensions[r_idx].height = 24
        fill_color = "F7FAFC" if r_idx % 2 == 1 else "FFFFFF"
        row_fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type="solid")
        for col_idx in range(1, len(row) + 1):
            cell = ws.cell(row=r_idx, column=col_idx)
            cell.fill = row_fill
            cell.border = thin_border
            cell.font = Font(name="Calibri", size=10, color="2C3E50")
            cell.alignment = Alignment(vertical="center", wrap_text=True)
            
    ws.column_dimensions['A'].width = 10
    ws.column_dimensions['B'].width = 30
    ws.column_dimensions['C'].width = 18
    ws.column_dimensions['D'].width = 25
    ws.column_dimensions['E'].width = 18
    ws.column_dimensions['F'].width = 14
    ws.column_dimensions['G'].width = 45
    
    excel_path = os.path.join(DELIVERABLES_DIR, "03_Matriz_Categorias_y_Descriptores_VGI.xlsx")
    excel_path_sub = os.path.join(EXCEL_DIR, "categorias_tematicas_osm.xlsx")
    wb.save(excel_path)
    wb.save(excel_path_sub)
    print(f"Saved Excel: {excel_path} and {excel_path_sub}")

# ==============================================================================
# BUILDER 08: ENTREGABLE 08 (.docx)
# ==============================================================================
def build_entregable_08():
    doc = create_doc("ENTREGABLE 08 — Estándar Cartográfico y Guía de Estilo Visual")
    
    add_h1(doc, "1. Paleta de Colores Táctica de Alto Contraste (WCAG 2.1 AAA)")
    add_p(doc, "El sistema adopta una paleta oscura táctica con contraste relativo superior a 16:1 para garantizar una legibilidad inmediata por personas que usan lentes o tienen baja visión.")
    
    headers = ["Token CSS", "Valor Hexadecimal", "Nombre Comercial", "Función en la Interfaz"]
    rows = [
        ["--fondo-app", "#050810", "Obsidian Black Base", "Fondo general del mapa y contenedor global."],
        ["--papel", "#0d1527", "Slate Surface Container", "Contenedor de paneles y módulos laterales."],
        ["--papel-alto", "#14203a", "Elevated Section Box", "Cajas elevadas de secciones e introducciones."],
        ["--papel-tarjeta", "#1a294a", "Inner Card Box", "Cuadrados estructurados de categorías e indicadores."],
        ["--musgo", "#06b6d4", "Cyan Neón", "Acento principal, visor Leaflet y botón de acción primaria."],
        ["--agua", "#38bdf8", "Sky Neón", "Subtítulos de campos, metadatos y botones de descarga."],
        ["--ocre", "#f59e0b", "Amber Neón", "Overpass QL, advertencias e inspección normativ a."],
        ["--esmeralda", "#10b981", "Emerald Neón", "Biodiversidad GBIF, áreas verdes y validación positiva."],
        ["--violeta", "#a855f7", "Purple Neón", "ohsome API, OQT y trazabilidad académica."],
        ["--alerta", "#f43f5e", "Crimson Neón", "Restricciones normativas, riesgos y uMap."]
    ]
    add_styled_table(doc, headers, rows)
    
    add_h1(doc, "2. Tipografía de Alta Legibilidad")
    add_bullet(doc, "'Outfit', sans-serif (pesos 700 a 900) para impacto visual nítido.", "Títulos y Encabezados: ")
    add_bullet(doc, "'Inter', sans-serif (pesos 400 a 600) con espaciado holgado (line-height 1.68).", "Cuerpo de Texto: ")
    add_bullet(doc, "'JetBrains Mono' / 'IBM Plex Mono', monospace para coordenadas, Bbox, XML y QL.", "Datos y Código: ")
    
    filepath = os.path.join(DELIVERABLES_DIR, "08_Estandar_Cartografico_Guia_de_Estilo.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER 12: ENTREGABLE 12 (.docx)
# ==============================================================================
def build_entregable_12():
    doc = create_doc("ENTREGABLE 12 — Manual de Uso del Atlas VGI (Usuario Final)")
    
    add_h1(doc, "1. Guía Paso a Paso para la Consulta Territorial")
    add_p(doc, "Instrucciones detalladas para utilizar la plataforma del Atlas VGI:")
    add_bullet(doc, "Ingresa al visor principal (Módulo 00) y selecciona 'Barrio Brasil Completo' o 'Manzana UAH'. También puedes hacer clic en 'Dibujar Bbox' para definir una ventana personalizada en el mapa.", "Paso 1: Delimitación Espacial — ")
    add_bullet(doc, "En el Módulo 01, utiliza los accesos directos de 1 clic (Farmacias, Panaderías, Sedes UAH, Paraderos, Ciclovías, Plazas, Patrimonio, Rebajes Accesibles) para desplegar instantáneamente las capas vectoriales en el mapa.", "Paso 2: Consultas Rápidas de 1 Clic — ")
    add_bullet(doc, "Usa el Constructor Visual en el Módulo 01 para filtrar por claves OSM (ej: amenity, shop, historic, building) o activa el Modo QL para escribir código Overpass personalizado.", "Paso 3: Consultas Personalizadas — ")
    add_bullet(doc, "En el Módulo 02, calcula el Índice de Saturación OQT con ohsome API o audita las ediciones territoriales recientes con OSMCha.", "Paso 4: Evaluación de Calidad — ")
    add_bullet(doc, "En el Módulo 03, busca especies de aves, flora patrimonial o arbolado urbano georreferenciado procedente de GBIF e iNaturalist.", "Paso 5: Biodiversidad Urbana — ")
    add_bullet(doc, "En el Módulo 05, genera la ficha estandarizada y exporta en JSON (ISO 19115) o XML (ISO 19139) para catalogar en IDE Chile.", "Paso 6: Metadatos Estandarizados — ")
    add_bullet(doc, "Haz clic en 'Exportar GeoJSON' o 'Descargar CSV' en los resultados de cada consulta para abrir tus datos en QGIS o planillas Excel.", "Paso 7: Descarga de Datos — ")
    
    filepath = os.path.join(DELIVERABLES_DIR, "12_Manual_de_Uso_Atlas_Usuario_Final.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER 13: ENTREGABLE 13 (.docx)
# ==============================================================================
def build_entregable_13():
    doc = create_doc("ENTREGABLE 13 — Protocolo Reproducible de Descarga, Transformación e Integración de Fuentes VGI")
    
    add_h1(doc, "1. Instrucciones para Ejecución del Pipeline CLI en Python")
    add_p(doc, "El repositorio incluye un conjunto de scripts en Python para la actualización automatizada y reproducible del territorio piloto o su réplica en cualquier otra comuna de Chile:")
    add_bullet(doc, "python scripts/extractor_vgi.py --bbox -70.6675 -33.4505 -70.6565 -33.4385", "1. Extracción e Integración de Capas: ")
    add_bullet(doc, "python scripts/generar_catalogos_excel.py", "2. Generación de Catálogos Excel (.xlsx): ")
    add_bullet(doc, "python backend/servidor_vgi.py --port 8080", "3. Servidor Backend Local VGI: ")
    
    add_h1(doc, "2. Requisitos del Entorno")
    add_bullet(doc, "Python 3.9 o superior.", "Lenguaje: ")
    add_bullet(doc, "requests, openpyxl, pandas, pyproj.", "Librerías Requeridas: ")
    add_bullet(doc, "git clone https://github.com/GEOJOTA/atlas_vgi_uah.git", "Repositorio Git: ")
    
    filepath = os.path.join(DELIVERABLES_DIR, "13_Manual_de_Actualizacion_Protocolo_Reproducible.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER 14: ENTREGABLE 14 (.docx)
# ==============================================================================
def build_entregable_14():
    doc = create_doc("ENTREGABLE 14 — Arquitectura Técnica, Diagrama de Flujo y Pipeline Servidor")
    
    add_h1(doc, "1. Principios de Arquitectura Client-Side First")
    add_p(doc, "El Atlas VGI sigue una arquitectura desacoplada centrada en el navegador web del usuario final. Toda la lógica de consulta espacial, reproyección geodésica a EPSG:32719, cálculo de superficies en m², auditoría normativ a y generación de metadatos XML se ejecuta en cliente con costo de infraestructura cero.")
    
    add_h1(doc, "2. Estructura de Módulos Javascript (`src/js/modulos/`)")
    add_bullet(doc, "Visor interactivo 2D con Leaflet 1.9.4, gestión de 8 capas temáticas VGI y 27 capas oficiales IDE Chile.", "mapa.js: ")
    add_bullet(doc, "Motor de consulta Overpass QL con conmutación automática entre 3 servidores espejo (failover).", "osm.js: ")
    add_bullet(doc, "Conexión a ohsome API v1/v2 (HeiGIT) para cálculo de series temporales y madurez espacial.", "ohsome.js: ")
    add_bullet(doc, "Cálculo de métricas de calidad ISO 19157 y conexión a OSMCha Changesets API v0.6.", "calidad_analyst.js: ")
    add_bullet(doc, "Búsqueda de observaciones biológicas (GBIF/iNaturalist) y autocompletado taxonómico en vivo.", "gbif.js: ")
    add_bullet(doc, "Generador dual de metadatos ISO 19115 (JSON) e ISO 19139 (XML Oficial IDE Chile).", "metadatos.js: ")
    add_bullet(doc, "Glosario y matriz de homologación de 134 descriptores con IDE Chile / MINVU.", "diccionario.js: ")
    add_bullet(doc, "Auditoría normativ a por clic de zonificación PRC Santiago, ordenanza OGUC y riesgos.", "evaluador_normativo.js: ")
    add_bullet(doc, "Reproyección conforme Transverse Mercator a EPSG:32719 y cálculo de Shoelace.", "geodesia.js: ")
    
    filepath = os.path.join(DELIVERABLES_DIR, "14_Arquitectura_Tecnica_y_Pipeline_Servidor.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER 15: ENTREGABLE 15 (.docx)
# ==============================================================================
def build_entregable_15():
    doc = create_doc("ENTREGABLE 15 — Memoria Metodológica, Marcos Normativos e Informe de Trazabilidad Académica")
    
    add_h1(doc, "1. Fundamentación Epistemológica de la VGI")
    add_p(doc, "Fundamentado en los trabajos de Michael Goodchild (2007) y Muki Haklay (2010), el Atlas VGI transforma la información geográfica colaborativa autoproducida por la ciudadanía y comunidades universitarias en datos estandarizados, auditables y directamente aplicables a la gestión territorial.")
    
    add_h1(doc, "2. Estándares ISO e Interoperabilidad IDE Chile")
    add_bullet(doc, "Define el esquema conceptual y elementos núcleo de metadatos espaciales.", "ISO 19115-1:2014: ")
    add_bullet(doc, "Implementación en esquema XML oficial para catalogación en GeoNetwork/GeoNode del Estado.", "ISO 19139:2007: ")
    add_bullet(doc, "Evaluación de completitud, densidad, validez temporal y linaje cuantitativo de datos.", "ISO 19157:2013: ")
    add_bullet(doc, "Metodología para la estructuración de catálogos de objetos y diccionarios territoriales.", "ISO 19110:2016: ")
    add_bullet(doc, "Estándar de observaciones biológicas y ocurrencias en biodiversidad urbana.", "Darwin Core Standard: ")
    
    add_h1(doc, "3. Marco Jurídico y Reciprocidad Comunitaria (Copyleft)")
    add_p(doc, "El proyecto reemplaza licencias permisivas por un marco tripartito sustentado en la Ley N° 17.336 de Propiedad Intelectual, la Ley N° 20.285 de Transparencia y la Política Nacional de Información Geoespacial de Chile:")
    add_bullet(doc, "Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0).", "Contenidos y Documentación: ")
    add_bullet(doc, "Open Database License (ODbL 1.0) para OpenStreetMap y CC-BY 4.0 para GBIF.", "Bases de Datos VGI: ")
    add_bullet(doc, "GNU Affero General Public License v3.0 (GNU AGPLv3) para código web y backend.", "Código Fuente: ")
    
    filepath = os.path.join(DELIVERABLES_DIR, "15_Memoria_Metodologica_y_Trazabilidad_Academica.docx")
    doc.save(filepath)
    print(f"Saved: {filepath}")

# ==============================================================================
# BUILDER METADATOS EXCEL (.xlsx)
# ==============================================================================
def build_metadatos_excel():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Perfil Metadatos ISO 19115"
    
    title_font = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    title_fill = PatternFill(start_color="1A3A5C", end_color="1A3A5C", fill_type="solid")
    sub_font = Font(name="Calibri", size=10, italic=True, color="555555")
    sub_fill = PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid")
    
    ws.merge_cells("A1:E1")
    ws["A1"] = "ENTREGABLE 07 — PERFIL NACIONAL DE METADATOS ESPACIALES (ISO 19115 / ISO 19139 / IDE CHILE)"
    ws["A1"].font = title_font
    ws["A1"].fill = title_fill
    ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 35
    
    ws.merge_cells("A2:E2")
    ws["A2"] = "Práctica Profesional de Geografía 2026 — Universidad Alberto Hurtado | Perfil de Metadatos de la Geodatabase VGI"
    ws["A2"].font = sub_font
    ws["A2"].fill = sub_fill
    ws["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 22
    
    headers = ["Campo ISO 19115", "Elemento XML ISO 19139", "Obligatoriedad SNIT", "Valor Barrio Brasil / UAH", "Descripción y Regla de Validación"]
    rows = [
        ["md-titulo", "gmd:title", "Mandatorio", "Catastro VGI de Equipamiento Universitario y Urbano: Barrio Brasil - Universidad Alberto Hurtado", "Nombre formal del recurso geográfico."],
        ["md-categoria-iso", "gmd:topicCategory", "Mandatorio", "planningCadastre / structure / transportation", "Categoría temática principal conforme a ISO 19115 B.5.27."],
        ["md-resumen", "gmd:abstract", "Mandatorio", "Conjunto de datos espaciales voluntarios compilado para la gestión territorial en Barrio Brasil...", "Resumen descriptivo del propósito y contenido del dataset."],
        ["md-oeste", "gmd:westBoundLongitude", "Mandatorio", "-70.6675", "Coordenada oeste del Bounding Box en WGS84."],
        ["md-sur", "gmd:southBoundLatitude", "Mandatorio", "-33.4505", "Coordenada sur del Bounding Box en WGS84."],
        ["md-este", "gmd:eastBoundLongitude", "Mandatorio", "-70.6565", "Coordenada este del Bounding Box en WGS84."],
        ["md-norte", "gmd:northBoundLatitude", "Mandatorio", "-33.4385", "Coordenada norte del Bounding Box en WGS84."],
        ["md-srs", "gmd:referenceSystemIdentifier", "Mandatorio", "EPSG:4326 (WGS84) / Compatible con EPSG:5361 (SIRGAS-Chile 2016) y EPSG:32719", "Código del sistema de referencia espacial oficial."],
        ["md-linaje", "gmd:statement", "Condicional", "Extraído de OpenStreetMap vía Overpass API QL y de GBIF Occurrence API. Normalizado a EPSG:32719.", "Historial de procesamiento, captura y transformaciones."],
        ["md-restricciones", "gmd:useLimitation", "Mandatorio", "Open Database License (ODbL 1.0) para OSM; CC-BY 4.0 para GBIF; Ley 20.285 para IDE Chile.", "Declaración de licencias abiertas y derechos de uso."],
        ["md-contacto-org", "gmd:organisationName", "Mandatorio", "Práctica Profesional Geografía 2026 — Universidad Alberto Hurtado", "Organización responsable del dataset."],
        ["md-contacto-correo", "gmd:electronicMailAddress", "Mandatorio", "juanpablolescanovillegas@gmail.com", "Correo electrónico de contacto institucional."]
    ]
    
    ws.append([])
    ws.append(headers)
    ws.row_dimensions[4].height = 26
    
    hdr_font = Font(name="Calibri", size=10.5, bold=True, color="FFFFFF")
    hdr_fill = PatternFill(start_color="2E6DA4", end_color="2E6DA4", fill_type="solid")
    
    for col in range(1, len(headers) + 1):
        cell = ws.cell(row=4, column=col)
        cell.font = hdr_font
        cell.fill = hdr_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    
    for r_idx, row in enumerate(rows, start=5):
        ws.append(row)
        ws.row_dimensions[r_idx].height = 24
        fill_color = "F7FAFC" if r_idx % 2 == 1 else "FFFFFF"
        row_fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type="solid")
        for col_idx in range(1, len(row) + 1):
            cell = ws.cell(row=r_idx, column=col_idx)
            cell.fill = row_fill
            cell.border = thin_border
            cell.font = Font(name="Calibri", size=10, color="2C3E50")
            cell.alignment = Alignment(vertical="center", wrap_text=True)
            
    ws.column_dimensions['A'].width = 20
    ws.column_dimensions['B'].width = 28
    ws.column_dimensions['C'].width = 16
    ws.column_dimensions['D'].width = 45
    ws.column_dimensions['E'].width = 45
    
    excel_path = os.path.join(DELIVERABLES_DIR, "07_Perfil_Metadatos_ISO19115_SNIT.xlsx")
    excel_path_sub = os.path.join(EXCEL_DIR, "perfil_metadatos_vgi.xlsx")
    wb.save(excel_path)
    wb.save(excel_path_sub)
    print(f"Saved Excel: {excel_path} and {excel_path_sub}")

if __name__ == "__main__":
    print("Building Word (.docx) and Excel (.xlsx) Deliverables with Gantt & Reference Styling...")
    build_entregable_00()
    build_entregable_01()
    build_entregable_02()
    build_entregable_03()
    build_entregable_08()
    build_entregable_12()
    build_entregable_13()
    build_entregable_14()
    build_entregable_15()
    build_metadatos_excel()
    print("\nALL DELIVERABLE DOCX & XLSX FILES GENERATED SUCCESSFULLY!")
