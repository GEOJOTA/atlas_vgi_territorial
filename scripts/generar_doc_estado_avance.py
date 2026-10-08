#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_doc_estado_avance.py
============================
Generador formal del Informe de Estado de Avance (150 Horas / Hitos 1 a 5)
para la Práctica Profesional de Geografía - Universidad Alberto Hurtado (UAH).

Archivo de salida:
/Users/geojplescano/Programas/Práctica profesional 2026 S2/Estado_Avance_Atlas_VGI_UAH.docx
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

OUTPUT_DOCX = "/Users/geojplescano/Programas/Práctica profesional 2026 S2/Estado_Avance_Atlas_VGI_UAH.docx"

# Colores UAH
COLOR_AZUL_UAH = RGBColor(0, 51, 102)     # #003366
COLOR_AZUL_SEC = RGBColor(15, 76, 129)    # #0F4C81
COLOR_NEGRO = RGBColor(17, 24, 39)        # #111827
COLOR_GRIS = RGBColor(100, 116, 139)      # #64748B
COLOR_BLANCO = RGBColor(255, 255, 255)

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/><w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/><w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/><w:insideV w:val="none"/><w:left w:val="none"/><w:right w:val="none"/></w:tblBorders>')
    tblPr.append(borders)

def crear_documento():
    doc = Document()

    # Configuración de página: Carta con márgenes 2.5 cm
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Estilo base
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = COLOR_NEGRO

    # -------------------------------------------------------------
    # ENCABEZADO INSTITUCIONAL
    # -------------------------------------------------------------
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_inst.paragraph_format.space_after = Pt(2)
    p_inst.paragraph_format.space_before = Pt(0)
    r1 = p_inst.add_run("UNIVERSIDAD ALBERTO HURTADO · FACULTAD DE CIENCIAS SOCIALES\n")
    r1.font.bold = True
    r1.font.size = Pt(10)
    r1.font.color.rgb = COLOR_AZUL_UAH
    r2 = p_inst.add_run("DEPARTAMENTO DE GEOGRAFÍA · PROGRAMA DE PRÁCTICA PROFESIONAL 2026 S2\n")
    r2.font.bold = True
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = COLOR_AZUL_SEC
    r3 = p_inst.add_run("Proyecto Fondecyt Regular F1261256 (ANID) — 'Información Geográfica Voluntaria y Gestión Territorial'")
    r3.font.italic = True
    r3.font.size = Pt(9)
    r3.font.color.rgb = COLOR_GRIS

    # Línea divisoria
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_after = Pt(12)
    p_line.paragraph_format.space_before = Pt(2)
    r_l = p_line.add_run("―" * 58)
    r_l.font.color.rgb = COLOR_AZUL_UAH
    r_l.font.size = Pt(12)

    # -------------------------------------------------------------
    # TÍTULO DEL INFORME
    # -------------------------------------------------------------
    p_tit = doc.add_paragraph()
    p_tit.paragraph_format.space_after = Pt(4)
    r_t = p_tit.add_run("INFORME DE ESTADO DE AVANCE — 150 HORAS CUMPLIDAS")
    r_t.font.bold = True
    r_t.font.size = Pt(16)
    r_t.font.color.rgb = COLOR_AZUL_UAH

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Atlas de Información Geográfica Voluntaria para la Gestión Territorial\nCaso Piloto: Barrio Brasil y Campus Universidad Alberto Hurtado (Santiago Centro, Chile)")
    r_sub.font.bold = True
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = COLOR_NEGRO

    # Ficha de antecedentes en tabla elegante
    t_f = doc.add_table(rows=5, cols=2)
    t_f.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_f, "CBD5E1", "6")
    
    col_w = [Inches(2.2), Inches(4.3)]
    for row in t_f.rows:
        for i, w in enumerate(col_w):
            row.cells[i].width = w

    ficha_datos = [
        ("Estudiante Practicante:", "Juan Pablo Lescano Villegas (GEOJOTA) — Licenciatura en Geografía"),
        ("Coordinador de Prácticas:", "Alejandro Cortés (UAH)"),
        ("Docentes Supervisores:", "Prof. Manuel Fuenzalida (UAH) & Investigador Colaborador Fondecyt"),
        ("Período de Práctica:", "01 de septiembre al 12 de noviembre de 2026 (300 horas programadas / 11 semanas)"),
        ("Corte de Avance Reportado:", "150 horas cronológicas concluidas (Semanas 1 a 5 — 50% de avance acumulado)")
    ]
    for ri, (campo, val) in enumerate(ficha_datos):
        c0 = t_f.cell(ri, 0)
        c1 = t_f.cell(ri, 1)
        c0.text = campo
        c1.text = val
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        p0 = c0.paragraphs[0]
        p0.runs[0].font.bold = True
        p0.runs[0].font.size = Pt(9.5)
        p0.runs[0].font.color.rgb = COLOR_AZUL_UAH
        p1 = c1.paragraphs[0]
        p1.runs[0].font.size = Pt(9.5)
        p1.runs[0].font.color.rgb = COLOR_NEGRO

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # SECCIÓN 1: RESUMEN EJECUTIVO Y ESTADO DE HITOS
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Resumen Ejecutivo y Cumplimiento de Hitos")
    r_h1.font.bold = True
    r_h1.font.size = Pt(13)
    r_h1.font.color.rgb = COLOR_AZUL_UAH
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(6)

    p_re = doc.add_paragraph()
    p_re.paragraph_format.line_spacing = 1.15
    p_re.paragraph_format.space_after = Pt(8)
    p_re.add_run(
        "Al completarse el hito de las 150 horas cronológicas de práctica profesional (correspondiente a 25 días hábiles y el 50% "
        "de la carga horaria comprometida), el proyecto presenta un estado de avance técnico y metodológico superior a la programación original. "
        "Se ha dado cumplimiento íntegro y formal a los Objetivos Específicos 1 y 2, mientras que el Objetivo Específico 3 "
        "(prototipo de plataforma web e infraestructura cartográfica) se encuentra operativo en producción anticipada mediante "
        "un geoportal interactivo abierto y sin costo de mantenimiento en la dirección web "
    )
    r_url = p_re.add_run("https://atlasvgiuah.netlify.app/.")
    r_url.font.bold = True
    r_url.font.color.rgb = COLOR_AZUL_UAH

    # Tabla 1: Hitos del Plan de Trabajo
    p_t1_t = doc.add_paragraph()
    p_t1_t.paragraph_format.space_after = Pt(4)
    r_t1 = p_t1_t.add_run("Tabla 1. Estado de Cumplimiento de Hitos del Plan de Trabajo Formal (150 Horas)")
    r_t1.font.bold = True
    r_t1.font.size = Pt(10)
    r_t1.font.color.rgb = COLOR_AZUL_UAH

    t_hitos = doc.add_table(rows=11, cols=5)
    t_hitos.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_hitos, "CBD5E1", "4")

    w_cols_h = [Inches(0.8), Inches(2.6), Inches(1.1), Inches(1.1), Inches(0.9)]
    for r in t_hitos.rows:
        for i, w in enumerate(w_cols_h):
            r.cells[i].width = w

    headers_h = ["Hito", "Descripción de la Actividad", "Objetivo", "Período", "Estado"]
    for ci, h in enumerate(headers_h):
        c = t_hitos.cell(0, ci)
        c.text = h
        set_cell_background(c, "003366")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = COLOR_BLANCO

    filas_h = [
        ("H1", "Inducción, territorio y usuarios", "OE 1", "Semana 1", "100% Cerrado"),
        ("H2", "Diseño conceptual y 10 categorías VGI", "OE 1", "Semana 2", "100% Cerrado"),
        ("H3", "Revisión de fuentes VGI y brechas IDE", "OE 1", "Semana 3", "100% Cerrado"),
        ("H4", "Obtención y geodatabase (118 capas)", "OE 2", "Semana 4–5", "100% Cerrado"),
        ("H5", "Calidad de datos (MetaCalidad ISO 19157)", "OE 2", "Semana 5–6", "100% Terminado"),
        ("H6", "Análisis territorial y modelo ranking", "OE 2", "Semana 6–7", "En inicio"),
        ("H7", "Estándar cartográfico del Atlas", "OE 3", "Semana 8", "Programado"),
        ("H8", "Geoportal web interactivo en producción", "OE 3", "Semana 8–9", "80% Anticipado"),
        ("H9", "Validación con 3–5 usuarios reales", "OE 4", "Semana 10", "Programado"),
        ("H10", "Manuales, transferibilidad y entrega final", "OE 4", "Semana 11", "Programado")
    ]
    for ri, fila in enumerate(filas_h, 1):
        bg = "FFFFFF" if ri % 2 == 1 else "F8FAFC"
        for ci, val in enumerate(fila):
            c = t_hitos.cell(ri, ci)
            c.text = val
            set_cell_background(c, bg)
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            p = c.paragraphs[0]
            p.runs[0].font.size = Pt(8.5)
            if ci in [0, 2, 3]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif ci == 4:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.runs[0].font.bold = True
                p.runs[0].font.color.rgb = COLOR_AZUL_UAH if "100%" in val else COLOR_AZUL_SEC

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # SECCIÓN 2: RESULTADOS OBJETIVO ESPECÍFICO 1
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. Resultados OE 1: Caracterización y Arquitectura Conceptual")
    r_h2.font.bold = True
    r_h2.font.size = Pt(13)
    r_h2.font.color.rgb = COLOR_AZUL_UAH
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(6)

    p_oe1 = doc.add_paragraph()
    p_oe1.paragraph_format.line_spacing = 1.15
    p_oe1.paragraph_format.space_after = Pt(6)
    p_oe1.add_run(
        "El Objetivo Específico 1 tuvo como propósito caracterizar el escenario territorial de Barrio Brasil y campus UAH "
        "(polígono de 223,75 hectáreas en Santiago Centro) y diseñar la estructura conceptual del Atlas. Se alcanzaron los siguientes logros clave:"
    )

    oe1_bullets = [
        ("10 Macrocategorías Territoriales VGI:", "Diseño de un esquema taxonómico que traduce las etiquetas libres de OpenStreetMap en categorías útiles para la gestión pública: [CAT-01] Educación e Investigación, [CAT-02] Servicios y Comercio Barrial, [CAT-03] Movilidad y Transporte, [CAT-04] Movilidad Activa, [CAT-05] Áreas Verdes y Espacio Público, [CAT-06] Patrimonio y Memoria, [CAT-07] Accesibilidad Universal, [CAT-08] Biodiversidad Urbana, [CAT-09] Edificaciones y Huella Predial, y [CAT-10] Coberturas y Suelo."),
        ("4 Perfiles de Actor Territorial (DCU):", "Definición de cuatro usuarios-tipo conforme a la metodología de Diseño Centrado en el Usuario: 1) Institucional / Planificador (foco en zonificación PRC, semáforos y equipamientos); 2) Comunitario / Vecinal (foco en áreas verdes, comercio barrial y servicios); 3) Mapeador Voluntario OSM (foco en tags técnicos, geometrías y consultas Overpass); 4) Investigador / Academia (foco en metadatos ISO 19115, biodiversidad Darwin Core y series históricas ohsome)."),
        ("Diccionario Territorial de 134 Descriptores:", "Confección de un catálogo exhaustivo que identificó 48 capas oficiales análogas del Estado de Chile y 86 brechas de información territorial barrial que son cubiertas exclusivamente por la cartografía voluntaria ciudadana (rebajes de vereda, locales patrimoniales, ciclocalles y casonas históricas).")
    ]
    for tit, desc in oe1_bullets:
        p_b = doc.add_paragraph(style='List Bullet')
        p_b.paragraph_format.line_spacing = 1.15
        p_b.paragraph_format.space_after = Pt(4)
        r_bt = p_b.add_run(tit + " ")
        r_bt.font.bold = True
        r_bt.font.color.rgb = COLOR_AZUL_SEC
        p_b.add_run(desc)

    # -------------------------------------------------------------
    # SECCIÓN 3: RESULTADOS OBJETIVO ESPECÍFICO 2
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. Resultados OE 2: Geodatabase y Auditoría de MetaCalidad WLC v2.0")
    r_h3.font.bold = True
    r_h3.font.size = Pt(13)
    r_h3.font.color.rgb = COLOR_AZUL_UAH
    h3.paragraph_format.space_before = Pt(12)
    h3.paragraph_format.space_after = Pt(6)

    p_oe2 = doc.add_paragraph()
    p_oe2.paragraph_format.line_spacing = 1.15
    p_oe2.paragraph_format.space_after = Pt(6)
    p_oe2.add_run(
        "El Objetivo Específico 2 consolidó la infraestructura geodatabase del proyecto, articulando datos de organismos públicos con extractos masivos VGI:"
    )

    oe2_bullets = [
        ("Geodatabase de 118 Capas Vectoriales:", "Se integraron 108 capas cartográficas oficiales del Estado de Chile (provenientes de IDE Chile, MINVU, DGA, DEIS, INE Censo 2024 en 5 niveles territoriales, Subdere, UOCT/MTT con 1.500+ cruces semaforizados y MIDESO) articuladas con 10 macrocategorías temáticas comunitarias de OpenStreetMap y registros Darwin Core de GBIF. Todos los datos fueron estandarizados en WGS84 (EPSG:4326) y proyectados en UTM Huso 19S (EPSG:32719)."),
        ("Volumen Físico y Eficiencia de Almacenamiento:", "La base de datos comprende 214 archivos GeoJSON físicos en disco con un peso total de 3.730 MB (3,73 GB) y 2.560 MB activos en el catálogo de producción, verificados mediante hashes criptográficos SHA-256 libres de punteros externos."),
        ("Base Espacial en PostgreSQL 17 + PostGIS 3.3:", "Alojamiento en la nube (Supabase Cloud) con 129.262+ geometrías vectoriales indexadas con árboles espaciales GIST, permitiendo consultas espaciales recortadas por Bounding Box con tiempos de respuesta inferiores a 200 ms."),
        ("Modelo Lineal Ponderado WLC v2.0 de MetaCalidad Espacial:", "Se formuló e implementó un modelo multi-atributo basado en la norma ISO 19157 y Weighted Linear Combination (WLC), evaluando 10 dimensiones ortogonales ponderadas equitativamente al 10% (100% global): 5 cuantitativas (Completitud, Consistencia Lógica/Topología, Exactitud Posicional Geodésica, Exactitud Temática y Calidad Temporal) y 5 cualitativas (Linaje/Trazabilidad, Accesibilidad/Formatos, Usabilidad Operativa, Autoría Institucional y Licenciamiento/Rigor Semántico)."),
        ("Cumplimiento Global Sobresaliente (97,88% IGV):", "La evaluación arrojó un índice de calidad espacial ponderado de 97,88%, con 116 capas clasificadas en Grado A+ Excelente (≥95%, representando el 98,3% del repositorio) y 2 capas en Grado A Muy Bueno (1,7%), sin registrarse ninguna capa en niveles deficientes."),
        ("Inyección Universal de Metadatos en Descargas:", "El 100% de los archivos descargables desde el Atlas fueron enriquecidos tanto en disco como en caliente (client-side) con las 14 columnas del catálogo institucional asociadas al perfil ISO 19115/19157 (id_catalogo, nombre, categoria, dimension, entidad_fuente, anio, escala, srid, licencia, url_origen, resumen, atributos_clave, fecha_actualizacion, metacalidad_igv), garantizando trazabilidad geográfica total.")
    ]
    for tit, desc in oe2_bullets:
        p_b = doc.add_paragraph(style='List Bullet')
        p_b.paragraph_format.line_spacing = 1.15
        p_b.paragraph_format.space_after = Pt(4)
        r_bt = p_b.add_run(tit + " ")
        r_bt.font.bold = True
        r_bt.font.color.rgb = COLOR_AZUL_SEC
        p_b.add_run(desc)

    # -------------------------------------------------------------
    # SECCIÓN 4: RESULTADOS OBJETIVO ESPECÍFICO 3
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    r_h4 = h4.add_run("4. Resultados OE 3: Geoportal Web y Módulos Especializados en Producción")
    r_h4.font.bold = True
    r_h4.font.size = Pt(13)
    r_h4.font.color.rgb = COLOR_AZUL_UAH
    h4.paragraph_format.space_before = Pt(12)
    h4.paragraph_format.space_after = Pt(6)

    p_oe3 = doc.add_paragraph()
    p_oe3.paragraph_format.line_spacing = 1.15
    p_oe3.paragraph_format.space_after = Pt(8)
    p_oe3.add_run(
        "Como hito de aceleración del proyecto, el prototipo del Objetivo Específico 3 fue implementado y desplegado de forma anticipada. "
        "La plataforma consiste en una Single Page Application (SPA) construida en JavaScript Vanilla y Leaflet 1.9.4, "
        "operativa en Netlify con integración continua (CI/CD) desde GitHub y gobernanza a costo $0/mes. Cuenta con 10 módulos funcionales:"
    )

    # Tabla 2: Módulos del Geoportal
    p_t2_t = doc.add_paragraph()
    p_t2_t.paragraph_format.space_after = Pt(4)
    r_t2 = p_t2_t.add_run("Tabla 2. Módulos Operativos del Geoportal Atlas VGI UAH en Producción")
    r_t2.font.bold = True
    r_t2.font.size = Pt(10)
    r_t2.font.color.rgb = COLOR_AZUL_UAH

    t_mods = doc.add_table(rows=11, cols=4)
    t_mods.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_mods, "CBD5E1", "4")

    w_cols_m = [Inches(0.6), Inches(2.2), Inches(2.5), Inches(1.2)]
    for r in t_mods.rows:
        for i, w in enumerate(w_cols_m):
            r.cells[i].width = w

    headers_m = ["ID", "Módulo Funcional", "Descripción y Herramientas", "Tecnología / API"]
    for ci, h in enumerate(headers_m):
        c = t_mods.cell(0, ci)
        c.text = h
        set_cell_background(c, "003366")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = COLOR_BLANCO

    filas_m = [
        ("00", "Visor Cartográfico Interactivo", "Navegación espacial de 118 capas, Inspector Normativo PRC de Santiago (192 zonas), dibujo, medición e importación de terreno.", "Leaflet 1.9.4 / SPA"),
        ("01", "Explorador Overpass QL", "Editor y ejecutor de consultas sintácticas en tiempo real hacia servidores OSM para las 10 macrocategorías.", "Overpass API / OSM"),
        ("02", "Evaluador de Calidad ohsome", "Análisis histórico de densidad de nodos, usuarios mapeadores y evolución cronológica de datos barriales.", "HeiGIT ohsome v1/v2"),
        ("03", "Biodiversidad Urbana GBIF", "Extracción en vivo de registros de flora y fauna en Barrio Brasil validados bajo estándar Darwin Core.", "GBIF REST API"),
        ("04", "Cartografía Colaborativa UMap", "Visualización de capas complementarias y proyectos barriales generados en la plataforma comunitaria UMap.", "UMap / GeoJSON"),
        ("05", "Metadatos ISO 19115/19139", "Generador y exportador de fichas XML interoperables conforme al perfil nacional IDE Chile / SNIT v2.0.", "ISO 19139 XML Parser"),
        ("06", "Diccionario Territorial", "Catálogo navegable de 134 descriptores espaciales documentando equivalencias oficiales y brechas VGI.", "Catálogo JSON Local"),
        ("07", "Licencias y Catálogos", "Descargas masivas en Excel (.xlsx) y especificación jurídica estricta (Ley 20.285, ODbL 1.0, CC-BY 4.0).", "OpenPyXL / GeoJSON"),
        ("08", "Manual de Uso y Documentación", "Guías operativas paso a paso, trazabilidad académica y matriz de auditoría de MetaCalidad.", "Markdown Docs Viewer"),
        ("09", "Indicadores & Dimensiones", "Panel analítico interactivo que agrupa las capas en las 5 dimensiones de análisis territorial barrial.", "Chart.js / DOM Vanilla")
    ]
    for ri, fila in enumerate(filas_m, 1):
        bg = "FFFFFF" if ri % 2 == 1 else "F8FAFC"
        for ci, val in enumerate(fila):
            c = t_mods.cell(ri, ci)
            c.text = val
            set_cell_background(c, bg)
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            p = c.paragraphs[0]
            p.runs[0].font.size = Pt(8.5)
            if ci == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.runs[0].font.bold = True
                p.runs[0].font.color.rgb = COLOR_AZUL_UAH
            elif ci == 1:
                p.runs[0].font.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # SECCIÓN 5: SÍNTESIS DE PRODUCTOS Y PLANIFICACIÓN SEGUNDA MITAD
    # -------------------------------------------------------------
    h5 = doc.add_heading(level=1)
    r_h5 = h5.add_run("5. Balance de Productos Entregados y Proyección Segunda Mitad")
    r_h5.font.bold = True
    r_h5.font.size = Pt(13)
    r_h5.font.color.rgb = COLOR_AZUL_UAH
    h5.paragraph_format.space_before = Pt(12)
    h5.paragraph_format.space_after = Pt(6)

    p_prod = doc.add_paragraph()
    p_prod.paragraph_format.line_spacing = 1.15
    p_prod.paragraph_format.space_after = Pt(8)
    p_prod.add_run(
        "A las 150 horas se cuenta con los siguientes productos consolidados en el repositorio institucional de GitHub "
        "(github.com/GEOJOTA/atlas_vgi_uah):"
    )

    productos = [
        ("Ficha Técnica del Proyecto de Práctica y Plan de Trabajo Formal", "docs/FICHA_TECNICA_PROYECTO.docx (Aprobado)."),
        ("Catálogo de Categorías Temáticas OSM y Taxonomía VGI", "docs/categorias_tematicas_osm.xlsx (4 hojas, 134 tags normalizados)."),
        ("Documento de Trazabilidad Académica y Perfiles de Usuario DCU", "docs/TRAZABILIDAD_ACADEMICA.md (Secciones 1 a 6)."),
        ("Geodatabase Consolidada de 118 Capas Vectoriales y 214 GeoJSONs", "src/data/ (3,73 GB, con PostGIS 17 en la nube)."),
        ("Auditoría de MetaCalidad WLC v2.0 y Gráficos de Correlación", "docs/ANALISIS_METACALIDAD.md y correlacion_dimensiones_calidad.png."),
        ("Catálogo de Metadatos Enriquecidos ISO 19115 e Inyección en Descargas", "docs/perfil_metadatos_vgi.xlsx y modulo metadatos.js."),
        ("Plataforma Web Geoportal Atlas VGI en Producción", "https://atlasvgiuah.netlify.app/ (10 módulos operativos, costo $0).")
    ]
    for nom, med in productos:
        p_p = doc.add_paragraph(style='List Bullet')
        p_p.paragraph_format.line_spacing = 1.15
        p_p.paragraph_format.space_after = Pt(3)
        r_pn = p_p.add_run(nom + ": ")
        r_pn.font.bold = True
        r_pn.font.color.rgb = COLOR_AZUL_SEC
        p_p.add_run(med)

    # Próximos pasos
    p_prox_tit = doc.add_paragraph()
    p_prox_tit.paragraph_format.space_before = Pt(8)
    p_prox_tit.paragraph_format.space_after = Pt(4)
    r_pt = p_prox_tit.add_run("Planificación para las 150 Horas Restantes (Semanas 6 a 11):")
    r_pt.font.bold = True
    r_pt.font.size = Pt(11)
    r_pt.font.color.rgb = COLOR_AZUL_UAH

    fases_2da = [
        ("Semanas 6–7 (08 al 16 Octubre) · Hito 6:", "Ejecución de geoprocesos de proximidad a equipamientos críticos (salud DEIS, estaciones de Metro L1/L2/L5, plazas y áreas verdes); cálculo de densidades a escala de Manzana Censal 2024 y Unidad Vecinal; y calibración preliminar de indicadores en las 5 dimensiones socio-espaciales."),
        ("Semanas 8–9 (19 al 30 Octubre) · Hitos 7 y 8:", "Refinamiento de la simbología cartográfica en el visor Leaflet con filtros avanzados; incorporación de generador de reportes sintéticos descargables en PDF por Unidad Vecinal; y consolidación definitiva de la base PostGIS."),
        ("Semana 10 (02 al 06 Noviembre) · Hito 9:", "Validación empírica con usuarios mediante pruebas de usabilidad guiadas a representantes de los 4 perfiles (funcionarios municipales, vecinos de Barrio Brasil, voluntarios OSM e investigadores UAH) para medir tiempos y resolver fricciones de navegación."),
        ("Semana 11 (09 al 12 Noviembre) · Hito 10:", "Redacción del Manual de Transferibilidad Institucional para el Departamento de Geografía UAH y Proyecto Fondecyt F1261256; entrega del Informe Final formal de práctica y preparación del examen de título.")
    ]
    for sem, act in fases_2da:
        p_f = doc.add_paragraph(style='List Bullet')
        p_f.paragraph_format.line_spacing = 1.15
        p_f.paragraph_format.space_after = Pt(3)
        r_ft = p_f.add_run(sem + " ")
        r_ft.font.bold = True
        r_ft.font.color.rgb = COLOR_AZUL_SEC
        p_f.add_run(act)

    # -------------------------------------------------------------
    # FIRMA Y CIERRE
    # -------------------------------------------------------------
    doc.add_paragraph().paragraph_format.space_after = Pt(16)
    p_firm = doc.add_paragraph()
    p_firm.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_firm.paragraph_format.space_after = Pt(2)
    r_firm = p_firm.add_run("Juan Pablo Lescano Villegas (GEOJOTA)\n")
    r_firm.font.bold = True
    r_firm.font.size = Pt(11)
    r_firm.font.color.rgb = COLOR_AZUL_UAH
    r_car = p_firm.add_run("Estudiante de Geografía · Practicante Asistente de Investigación Fondecyt F1261256\nUniversidad Alberto Hurtado")
    r_car.font.size = Pt(9.5)
    r_car.font.color.rgb = COLOR_GRIS

    doc.save(OUTPUT_DOCX)
    print(f"✅ Documento Word generado exitosamente en: {OUTPUT_DOCX}")

if __name__ == "__main__":
    crear_documento()
