#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_ppt_estado_avance_blanco.py
===================================
Generador de la presentación formal de Estado de Avance (150 Horas / Hitos 1 a 5)
para la Práctica Profesional de Geografía - Universidad Alberto Hurtado (UAH).

ESTÁNDARES DE DISEÑO ESTRICTOS:
- Paleta cromática estricta: ÚNICAMENTE Negro, Azul y Fondo Blanco (#FFFFFF).
- Formato 16:9 widescreen estándar (13.333 x 7.500 pulgadas).
- Coordinador de prácticas incluido formalmente: Alejandro Cortés (UAH).
- Tipografía estandarizada y agrandada (Calibri / Arial):
  * Títulos de Lámina: 22pt Bold (#003366).
  * Categorías superiores: 10.5pt Bold (#0F4C81).
  * Subtítulos de Lámina: 12.5-13pt Regular (#64748B).
  * Títulos de Tarjetas / Secciones: 13.5-14pt Bold (#003366).
  * Texto de Cuerpo / Bullets: 11-11.5pt Regular (#111827).
  * Tablas (Encabezados): 11pt Bold Blanco sobre Azul (#003366).
  * Tablas (Celdas de Datos): 10.5pt Regular (#111827).
  * Pies de Figura / Fuentes: 9.5-10pt Cursiva (#64748B).
  * Pie de página institucional: 10pt Regular / 10.5pt Bold (#003366).
- CERO SUPERPOSICIONES GEOMÉTRICAS:
  * Contenedores únicos por tarjeta para garantizar flujo de texto continuo.
  * Separación de pie de página (izq 8.5 in, der 9.8 in).
  * Espaciados verticales holgados con margen de seguridad.
- Dos diapositivas dedicadas para el Índice de Calidad (Pilar Cuantitativo y Pilar Cualitativo + Integración WLC v2.0).
- Carta Gantt actualizada con nombres claros de hitos (H1 a H10) y Hito 5 al 100% Terminado.
- Preservación íntegra de las 12 imágenes institucionales (incluyendo las 2 agregadas por el usuario).
"""

import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.xmlchemy import OxmlElement
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls, qn

# Rutas del Sistema
BASE_DIR = "/Users/geojplescano/Programas/Práctica profesional 2026 S2"
REPO_DIR = os.path.join(BASE_DIR, "nodo-geoabierto")
IMG_DIR = os.path.join(BASE_DIR, "assets", "capturas_ppt")
LOGO_UAH = os.path.join(REPO_DIR, "src", "img", "UAH-Insignia.jpg")
OUTPUT_PPTX = os.path.join(BASE_DIR, "Estado_Avance_Atlas_VGI_UAH.pptx")

# Paleta Cromática Estricta: NEGRO, AZUL Y FONDO BLANCO
COLOR_BLANCO = RGBColor(255, 255, 255)         # Fondo puro
COLOR_NEGRO = RGBColor(17, 24, 39)             # #111827 (Texto carbón oscuro)
COLOR_AZUL_UAH = RGBColor(0, 51, 102)          # #003366 (Azul Institucional Primario)
COLOR_AZUL_SEC = RGBColor(15, 76, 129)         # #0F4C81 (Azul Secundario)
COLOR_AZUL_CLARO = RGBColor(240, 247, 255)     # #F0F7FF (Fondo sutil de tarjetas)
COLOR_AZUL_DESTACADO = RGBColor(219, 234, 254) # #DBEAFE (Acento suave de estado/hitos)
COLOR_GRIS_FONDO = RGBColor(248, 250, 252)     # #F8FAFC (Alternancia de tablas)
COLOR_GRIS_BORDE = RGBColor(203, 213, 225)     # #CBD5E1 (Borde fino institucional)
COLOR_GRIS_TEXTO = RGBColor(100, 116, 139)     # #64748B (Subtítulos y pies de nota)

FONT_NAME = "Calibri"

def set_cell_border(cell, color="CBD5E1", sz="8000"):
    """Aplica bordes finos a celdas de tablas python-pptx."""
    tcPr = cell._tc.get_or_add_tcPr()
    for border_name in ['lnL', 'lnR', 'lnT', 'lnB']:
        ln = parse_xml(f'<a:{border_name} {nsdecls("a")} w="{sz}" cmpd="s"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:{border_name}>')
        tcPr.append(ln)

def crear_presentacion():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.500)
    blank_layout = prs.slide_layouts[6]

    total_slides = 26

    def aplicar_fondo_blanco(slide):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = COLOR_BLANCO

    def agregar_encabezado(slide, titulo, categoria="ESTADO DE AVANCE", subtitulo=None):
        aplicar_fondo_blanco(slide)
        
        # Franja azul superior fina
        franja = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.04))
        franja.fill.solid()
        franja.fill.fore_color.rgb = COLOR_AZUL_UAH
        franja.line.fill.background()

        # Cuadro de título principal
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.48), Inches(11.733), Inches(1.10))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Categoría superior
        p_cat = tf.paragraphs[0]
        p_cat.text = categoria.upper()
        p_cat.font.name = FONT_NAME
        p_cat.font.size = Pt(10.5)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_AZUL_SEC
        p_cat.space_after = Pt(2)

        # Título principal de la lámina
        p_tit = tf.add_paragraph()
        p_tit.text = titulo
        p_tit.font.name = FONT_NAME
        p_tit.font.size = Pt(22)
        p_tit.font.bold = True
        p_tit.font.color.rgb = COLOR_AZUL_UAH
        
        # Subtítulo explicativo
        if subtitulo:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitulo
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(12.5)
            p_sub.font.color.rgb = COLOR_GRIS_TEXTO
            p_sub.space_before = Pt(2)

    def agregar_pie_pagina(slide, num_slide):
        # Línea divisoria inferior
        linea_inf = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.85), Inches(11.733), Inches(0.015))
        linea_inf.fill.solid()
        linea_inf.fill.fore_color.rgb = COLOR_GRIS_BORDE
        linea_inf.line.fill.background()

        # Texto del pie a la izquierda (ancho delimitado a 8.5 pulgadas para evitar colisión)
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.92), Inches(8.5), Inches(0.35))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "Atlas de Información Geográfica Voluntaria para la Gestión Territorial — Estado de Avance 150 Horas"
        p.font.name = FONT_NAME
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_GRIS_TEXTO

        # Número de lámina a la derecha (inicia en 9.8 in, cero solapamiento)
        tb_num = slide.shapes.add_textbox(Inches(9.8), Inches(6.92), Inches(2.733), Inches(0.35))
        tf_num = tb_num.text_frame
        tf_num.word_wrap = True
        tf_num.margin_left = tf_num.margin_top = tf_num.margin_right = tf_num.margin_bottom = 0
        p_num = tf_num.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.text = f"Lámina {num_slide} de {total_slides}"
        p_num.font.name = FONT_NAME
        p_num.font.size = Pt(10.5)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_AZUL_UAH

    def agregar_tarjeta(slide, left, top, width, height, bg_color=COLOR_BLANCO, border_color=COLOR_GRIS_BORDE):
        card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    def agregar_imagen_con_marco(slide, img_path, left, top, width, height, pie_fuente="Fuente: Elaboración propia a partir del Geoportal Atlas VGI UAH (2026)."):
        if os.path.exists(img_path):
            pic = slide.shapes.add_picture(img_path, Inches(left), Inches(top), Inches(width), Inches(height))
            marco = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
            marco.fill.background()
            marco.line.color.rgb = COLOR_GRIS_BORDE
            marco.line.width = Pt(1)
            
            # Pie de figura estandarizado a 9.5-10pt
            tb = slide.shapes.add_textbox(Inches(left), Inches(top + height + 0.04), Inches(width), Inches(0.28))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = pie_fuente
            p.font.name = FONT_NAME
            p.font.size = Pt(9.5)
            p.font.italic = True
            p.font.color.rgb = COLOR_GRIS_TEXTO
            return pic
        else:
            box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
            p = box.text_frame.paragraphs[0]
            p.text = f"[Captura: {os.path.basename(img_path)}]"
            return None

    def agregar_notas_orador(slide, texto_guion):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = texto_guion

    # =========================================================================
    # SLIDE 1: PORTADA FORMAL Y ANTECEDENTES INSTITUCIONALES
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    aplicar_fondo_blanco(s1)

    franja_sup = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.08))
    franja_sup.fill.solid()
    franja_sup.fill.fore_color.rgb = COLOR_AZUL_UAH
    franja_sup.line.fill.background()

    if os.path.exists(LOGO_UAH):
        s1.shapes.add_picture(LOGO_UAH, Inches(0.8), Inches(0.85), Inches(1.5), Inches(1.5))

    tb_inst = s1.shapes.add_textbox(Inches(2.55), Inches(0.85), Inches(9.98), Inches(1.15))
    tf_inst = tb_inst.text_frame
    tf_inst.word_wrap = True
    tf_inst.margin_left = tf_inst.margin_top = tf_inst.margin_right = tf_inst.margin_bottom = 0
    p = tf_inst.paragraphs[0]
    p.text = "UNIVERSIDAD ALBERTO HURTADO · FACULTAD DE CIENCIAS SOCIALES"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p2 = tf_inst.add_paragraph()
    p2.text = "DEPARTAMENTO DE GEOGRAFÍA · PROGRAMA DE PRÁCTICA PROFESIONAL 2026 S2"
    p2.font.name = FONT_NAME
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_AZUL_SEC
    p2.space_after = Pt(2)

    p3 = tf_inst.add_paragraph()
    p3.text = "Proyecto Fondecyt Regular F1261256 (ANID) — 'Información Geográfica Voluntaria y Gestión Territorial'"
    p3.font.name = FONT_NAME
    p3.font.size = Pt(10.5)
    p3.font.italic = True
    p3.font.color.rgb = COLOR_GRIS_TEXTO

    # Título principal
    tb_tit = s1.shapes.add_textbox(Inches(0.8), Inches(2.40), Inches(11.733), Inches(1.85))
    tf_tit = tb_tit.text_frame
    tf_tit.word_wrap = True
    tf_tit.margin_left = tf_tit.margin_top = tf_tit.margin_right = tf_tit.margin_bottom = 0

    p_t1 = tf_tit.paragraphs[0]
    p_t1.text = "Atlas de Información Geográfica Voluntaria\npara la Gestión Territorial"
    p_t1.font.name = FONT_NAME
    p_t1.font.size = Pt(32)
    p_t1.font.bold = True
    p_t1.font.color.rgb = COLOR_AZUL_UAH
    p_t1.space_after = Pt(6)

    p_sub = tf_tit.add_paragraph()
    p_sub.text = "INFORME DE ESTADO DE AVANCE — 150 HORAS CUMPLIDAS (HITOS 1 A 5)"
    p_sub.font.name = FONT_NAME
    p_sub.font.size = Pt(14)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_NEGRO

    # Ficha de antecedentes formales con Alejandro Cortés agregado
    agregar_tarjeta(s1, 0.8, 4.45, 11.733, 2.25, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_GRIS_BORDE)
    tb_ficha = s1.shapes.add_textbox(Inches(1.05), Inches(4.55), Inches(11.233), Inches(2.05))
    tf_ficha = tb_ficha.text_frame
    tf_ficha.word_wrap = True
    tf_ficha.margin_left = tf_ficha.margin_top = tf_ficha.margin_right = tf_ficha.margin_bottom = 0

    p_f1 = tf_ficha.paragraphs[0]
    p_f1.text = "ANTECEDENTES DEL PROYECTO DE PRÁCTICA PROFESIONAL:"
    p_f1.font.name = FONT_NAME
    p_f1.font.size = Pt(11.5)
    p_f1.font.bold = True
    p_f1.font.color.rgb = COLOR_AZUL_UAH
    p_f1.space_after = Pt(4)

    ficha_items = [
        ("Estudiante Practicante:", "Juan Pablo Lescano Villegas (GEOJOTA) — Licenciatura en Geografía"),
        ("Coordinador de Prácticas:", "Alejandro Cortés (UAH)"),
        ("Docente Guía / Supervisor:", "Prof. Manuel Fuenzalida (UAH) & Investigador Colaborador Fondecyt"),
        ("Área de Estudio Piloto:", "Barrio Brasil y campus UAH, Comuna de Santiago (223,75 ha)"),
        ("Período y Carga Horaria:", "01/09/2026 – 12/11/2026 · 150 horas concluidas de 300 hrs programadas (50%)")
    ]
    for campo, valor in ficha_items:
        p_item = tf_ficha.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10.5)
        p_item.space_after = Pt(2)
        r_c = p_item.add_run()
        r_c.text = f"{campo} "
        r_c.font.bold = True
        r_c.font.color.rgb = COLOR_AZUL_SEC
        r_v = p_item.add_run()
        r_v.text = valor
        r_v.font.color.rgb = COLOR_NEGRO

    agregar_pie_pagina(s1, 1)

    agregar_notas_orador(s1,
        "Buenos días profesores y miembros de la comisión. Presento el informe formal de estado de avance a las 150 horas "
        "cronológicas de mi práctica profesional en el marco del Proyecto Fondecyt Regular F1261256, bajo la guía del profesor "
        "Manuel Fuenzalida y la coordinación de prácticas de Alejandro Cortés. El proyecto desarrolla un Atlas VGI para la gestión territorial en Barrio Brasil."
    )

    # =========================================================================
    # SLIDE 2: CONTEXTO INSTITUCIONAL Y JUSTIFICACIÓN TERRITORIAL
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s2, "Contexto Institucional y Justificación Territorial", 
                       categoria="1. Introducción y Marco del Problema",
                       subtitulo="Articulación entre investigación Fondecyt, información colaborativa y gestión local")
    agregar_pie_pagina(s2, 2)

    cards_ctx = [
        ("Marco Institucional y Científico", [
            ("Línea Fondecyt F1261256:", "Investigación orientada a integrar datos colaborativos en la planificación territorial metropolitana."),
            ("Departamento de Geografía UAH:", "Espacio de vinculación académica, docencia y análisis geoespacial aplicado al medio urbano."),
            ("Coordinación de Práctica:", "Supervisión metodológica del profesor guía Manuel Fuenzalida y coordinación de Alejandro Cortés.")
        ]),
        ("Caso Piloto: Barrio Brasil", [
            ("Delimitación Barrial:", "Polígono de 223,75 ha que articula el casco fundacional poniente y el campus patrimonial de la UAH."),
            ("Tensiones Urbanas:", "Convivencia de patrimonio histórico, densificación habitacional acelerada e intensos flujos peatonales."),
            ("Microterritorio:", "Unidades vecinales y manzanas censales con marcadas heterogeneidades socioespaciales.")
        ]),
        ("VGI y Vacíos de Información Estatal", [
            ("Brechas Estatales:", "La información oficial presenta desactualización temporal y baja granularidad para equipamientos de escala barrial."),
            ("Potencial VGI (OSM + GBIF):", "Ciudadanía como sensores activos para capturar arbolado, ciclovías, comercio local y accesibilidad."),
            ("Atlas Centralizado:", "Plataforma abierta que subsana vacíos de datos y democratiza el acceso a diagnósticos territoriales.")
        ])
    ]
    card_w = 3.75
    gap_x = 0.24
    for i, (titulo_card, items) in enumerate(cards_ctx):
        cx = 0.8 + i * (card_w + gap_x)
        agregar_tarjeta(s2, cx, 1.70, card_w, 4.95)

        tb_c = s2.shapes.add_textbox(Inches(cx + 0.20), Inches(1.85), Inches(card_w - 0.40), Inches(4.65))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

        p = tf_c.paragraphs[0]
        p.text = titulo_card
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(12)

        for subt, txt in items:
            p_sub = tf_c.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(8)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s2,
        "La justificación se basa en tres pilares: primero, el anclaje institucional en el Fondecyt y el Departamento de Geografía UAH; "
        "segundo, la selección de Barrio Brasil como laboratorio urbano de 223 hectáreas con fuertes contrastes; y tercero, "
        "la necesidad de subsanar los vacíos de datos oficiales mediante Información Geográfica Voluntaria estandarizada."
    )

    # =========================================================================
    # SLIDE 3: OBJETIVOS ESTRATÉGICOS Y CADENA DE VALOR METODOLÓGICA
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s3, "Formulación Estratégica y Cadena de Valor de Objetivos", 
                       categoria="2. Formulación Estratégica — Visión Sinóptica",
                       subtitulo="Articulación secuencial del Objetivo General y los 4 Objetivos Específicos hacia la gestión territorial")
    agregar_pie_pagina(s3, 3)

    # Tarjeta Superior: Objetivo General Canónico
    agregar_tarjeta(s3, 0.8, 1.70, 11.733, 1.25, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_og = s3.shapes.add_textbox(Inches(1.05), Inches(1.78), Inches(11.233), Inches(1.10))
    tf_og = tb_og.text_frame
    tf_og.word_wrap = True
    tf_og.margin_left = tf_og.margin_top = tf_og.margin_right = tf_og.margin_bottom = 0
    p = tf_og.paragraphs[0]
    p.text = "OBJETIVO GENERAL DE LA PRÁCTICA PROFESIONAL (PLAN FORMAL UAH):"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_SEC
    p.space_after = Pt(3)

    p_og_txt = tf_og.add_paragraph()
    p_og_txt.text = (
        "\"Desarrollar un prototipo de 'Atlas de Información Geográfica Voluntaria para la Gestión Territorial' "
        "que permita subsanar los vacíos existentes y potenciales de información territorial, garantizando que sea reproducible "
        "y centrado en los usuarios (Barrio Brasil y entorno del campus Universidad Alberto Hurtado).\""
    )
    p_og_txt.font.name = FONT_NAME
    p_og_txt.font.size = Pt(11.5)
    p_og_txt.font.italic = True
    p_og_txt.font.color.rgb = COLOR_NEGRO

    # Flujo de 4 Tarjetas de la Cadena de Valor Metodológica
    cadena_oes = [
        ("1. DIAGNÓSTICO & DISEÑO CONCEPTUAL", "OE 1 · Semanas 1 a 3 · 72 Horas", "100% CERRADO", COLOR_AZUL_DESTACADO, COLOR_AZUL_UAH,
         "Establece las bases conceptuales y taxonómicas. Responde qué vacíos existen en Barrio Brasil y cómo estructurar 10 macrocategorías VGI y 4 perfiles multiactor (DCU)."),
        ("2. CONSTRUCCIÓN DE DATOS & CALIDAD", "OE 2 · Semanas 4 a 7 · 120 Horas", "H4 y H5 CERRADOS", COLOR_AZUL_DESTACADO, COLOR_AZUL_UAH,
         "Construye la geodatabase estandarizada (118 capas, 2,56 GB) y aplica el Modelo WLC v2.0 de MetaCalidad ISO 19157 (97,88% IGV), asegurando datos confiables para la gestión local."),
        ("3. MATERIALIZACIÓN DEL GEOPORTAL", "OE 3 · Semanas 8 a 10 · 72 Horas", "80% EN PRODUCCIÓN", COLOR_AZUL_CLARO, COLOR_AZUL_SEC,
         "Materializa la infraestructura cartográfica en un visor web interactivo en producción (atlasvgiuah.netlify.app) con 10 módulos en vivo, APIs activas y costo cero recurrente."),
        ("4. VALIDACIÓN & TRANSFERIBILIDAD", "OE 4 · Semana 11 · 36 Horas", "PROGRAMADO", COLOR_GRIS_FONDO, COLOR_NEGRO,
         "Cierra el ciclo mediante validación empírica formal con 3 a 5 usuarios reales (ISO 9241-11) y manuales técnicos que garantizan autonomía sin dependencia del practicante.")
    ]
    card_c_h = 0.82
    gap_c_y = 0.08
    top_base_c = 3.05
    for idx, (c_tit, c_meta, c_estado, bg_b, col_b, c_desc) in enumerate(cadena_oes):
        cy = top_base_c + idx * (card_c_h + gap_c_y)
        agregar_tarjeta(s3, 0.8, cy, 11.733, card_c_h)

        tb = s3.shapes.add_textbox(Inches(1.0), Inches(cy + 0.06), Inches(11.333), Inches(card_c_h - 0.12))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        r1 = p.add_run()
        r1.text = f"{c_tit}   "
        r1.font.name = FONT_NAME
        r1.font.size = Pt(11.5)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_UAH

        r2 = p.add_run()
        r2.text = f"[{c_meta}]   "
        r2.font.name = FONT_NAME
        r2.font.size = Pt(10)
        r2.font.color.rgb = COLOR_GRIS_TEXTO

        r3 = p.add_run()
        r3.text = f"• {c_estado}"
        r3.font.name = FONT_NAME
        r3.font.size = Pt(10.5)
        r3.font.bold = True
        r3.font.color.rgb = col_b

        p_desc = tf.add_paragraph()
        p_desc.text = c_desc
        p_desc.font.name = FONT_NAME
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = COLOR_NEGRO
        p_desc.space_before = Pt(2)

    # Tarjeta Inferior de Balance de Horas y Estado Global
    agregar_tarjeta(s3, 0.8, 6.25, 11.733, 0.50, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_bal = s3.shapes.add_textbox(Inches(1.0), Inches(6.30), Inches(11.333), Inches(0.40))
    tf_bal = tb_bal.text_frame
    tf_bal.word_wrap = True
    tf_bal.margin_left = tf_bal.margin_top = tf_bal.margin_right = tf_bal.margin_bottom = 0
    p_b = tf_bal.paragraphs[0]
    p_b.text = "BALANCE AL CORTE DE 150 HORAS: 50% de horas concluidas (25/50 días hábiles) · Hitos 1 a 5 cerrados (100%) · Hito 8 adelantado al 80% en vivo · Hito 6 en inicio."
    p_b.font.name = FONT_NAME
    p_b.font.size = Pt(9.5)
    p_b.font.bold = True
    p_b.font.color.rgb = COLOR_AZUL_UAH
    p_b.alignment = PP_ALIGN.CENTER

    agregar_notas_orador(s3,
        "La formulación de objetivos se concibió como una cadena de valor metodológica: el OE 1 diagnostica y define la taxonomía; "
        "el OE 2 construye la geodatabase y certifica su calidad bajo la norma ISO 19157; el OE 3 materializa la plataforma web "
        "interactiva en producción; y el OE 4 asegura la validación empírica y la transferibilidad plena a la comunidad y a la UAH. "
        "A continuación profundizamos en la formulación aguda y logros de cada objetivo específico."
    )

    # =========================================================================
    # SLIDE 4: OBJETIVO ESPECÍFICO 1 — FORMULACIÓN AGUDA Y LOGROS
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s4, "Objetivo Específico 1: Caracterización Territorial y Arquitectura Conceptual", 
                       categoria="3. Formulación Aguda — Objetivo Específico 1 (Conceptual)",
                       subtitulo="Hitos 1 a 3 (100% Concluidos · 72 Horas Planificadas) · Diagnóstico de fuentes, perfiles DCU y taxonomía VGI")
    agregar_pie_pagina(s4, 4)

    # Columna Izquierda: Formulación Canónica y Desafío Geográfico
    agregar_tarjeta(s4, 0.8, 1.70, 5.75, 4.95)
    tb_oe1_l = s4.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe1_l = tb_oe1_l.text_frame
    tf_oe1_l.word_wrap = True
    tf_oe1_l.margin_left = tf_oe1_l.margin_top = tf_oe1_l.margin_right = tf_oe1_l.margin_bottom = 0

    p = tf_oe1_l.paragraphs[0]
    p.text = "Formulación Canónica y Desafío Territorial"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_box = tf_oe1_l.add_paragraph()
    p_box.text = (
        "\"Caracterizar el escenario territorial y la disponibilidad de información geográfica voluntaria en el Barrio Brasil, "
        "mediante la revisión sistemática de fuentes abiertas y la definición de la arquitectura conceptual del Atlas basada "
        "en las taxonomías de OpenStreetMap (OSM) y GBIF, que constituyen el fundamento de las categorías temáticas, "
        "atributos mínimos, indicadores y metadatos del prototipo, conformando así la base de operación del geoportal a desarrollar.\""
    )
    p_box.font.name = FONT_NAME
    p_box.font.size = Pt(9.5)
    p_box.font.italic = True
    p_box.font.color.rgb = COLOR_AZUL_SEC
    p_box.space_after = Pt(8)

    oe1_preguntas = [
        ("¿Qué vacíos oficiales existen?", "El Estado dispone de datos agregados comunales, pero carece de granularidad barrial en arbolado, mobiliario, ciclocalles y microcomercio."),
        ("¿Cómo resolver la dispersión VGI?", "Los tags de OpenStreetMap son libres y heterogéneos; requerían una taxonomía normalizada para convertirse en variables de gestión."),
        ("¿Para quién se construye?", "Se aplicó Diseño Centrado en el Usuario (DCU, ISO 9241-210) modelando 4 perfiles con requerimientos territoriales diferenciados."),
        ("Marco Epistemológico:", "Basado en Goodchild (2007) [ciudadanos como sensores], Haklay (2010) [calidad de VGI] y Perfil Nacional IDE Chile.")
    ]
    for tit_p, txt_p in oe1_preguntas:
        p_item = tf_oe1_l.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_p} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_p
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Técnicas y Logros Concretos (100% Cerrado)
    agregar_tarjeta(s4, 6.783, 1.70, 5.75, 4.95)
    tb_oe1_r = s4.shapes.add_textbox(Inches(6.983), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe1_r = tb_oe1_r.text_frame
    tf_oe1_r.word_wrap = True
    tf_oe1_r.margin_left = tf_oe1_r.margin_top = tf_oe1_r.margin_right = tf_oe1_r.margin_bottom = 0

    p = tf_oe1_r.paragraphs[0]
    p.text = "Técnicas Metodológicas y Logros (100% Cerrado)"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_badge = tf_oe1_r.add_paragraph()
    p_badge.text = "ESTADO: 100% CONCLUIDO · 72 HORAS EJECUTADAS (HITOS 1, 2 Y 3)"
    p_badge.font.name = FONT_NAME
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_AZUL_UAH
    p_badge.space_after = Pt(8)

    oe1_logros = [
        ("Delimitación Barrial Oficial:", "Fijación del polígono de 223,75 ha en Barrio Brasil y campus central UAH, estandarizado en WGS84 (EPSG:4326) y proyectado en UTM 19S (EPSG:32719)."),
        ("10 Macrocategorías VGI Normalizadas:", "Clasificación de elementos urbanos desde CAT-01 (Educación) hasta CAT-10 (Medio Ambiente), traduciendo 200+ tags de OSM a categorías analíticas."),
        ("4 Perfiles Multiactor (DCU):", "Definición operativa de usuarios: 1) Institucional / Planificador; 2) Comunitario / Vecinal; 3) Voluntario OSM; y 4) Investigador Fondecyt / UAH."),
        ("Diccionario Territorial (134 Descriptores):", "Catálogo exhaustivo que documentó 48 capas oficiales análogas y 86 brechas barriales cubiertas exclusivamente por la cartografía voluntaria."),
        ("Entregable Metodológico Aprobado:", "Documento formal de 61 páginas que sustenta la arquitectura conceptual del Atlas y la gobernanza de datos abiertos.")
    ]
    for tit_l, txt_l in oe1_logros:
        p_item = tf_oe1_r.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit_l} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_l
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s4,
        "El Objetivo Específico 1 se encuentra 100% cerrado, habiendo consumido las 72 horas planificadas. "
        "Su valor radica en haber transformado el problema de la dispersión de datos colaborativos en una arquitectura "
        "ordenada: delimitó Barrio Brasil en 223 hectáreas, creó 10 macrocategorías temáticas que traducen las etiquetas "
        "de OpenStreetMap, estructuró los cuatro perfiles de usuario bajo metodología DCU y catalogó 86 brechas barriales "
        "que el Estado no mapea."
    )

    # =========================================================================
    # SLIDE 5: OBJETIVO ESPECÍFICO 2 — FORMULACIÓN AGUDA Y LOGROS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s5, "Objetivo Específico 2: Geodatabase VGI, MetaCalidad y Diagnóstico Territorial", 
                       categoria="4. Formulación Aguda — Objetivo Específico 2 (Geodatabase & Calidad)",
                       subtitulo="Hitos 4 a 6 (H4 y H5 100% Concluidos, H6 en Inicio · 120 Horas) · Robustez de geodatos e Índice WLC v2.0")
    agregar_pie_pagina(s5, 5)

    # Columna Izquierda: Formulación Canónica y Desafío de Rigor
    agregar_tarjeta(s5, 0.8, 1.70, 5.75, 4.95)
    tb_oe2_l = s5.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe2_l = tb_oe2_l.text_frame
    tf_oe2_l.word_wrap = True
    tf_oe2_l.margin_left = tf_oe2_l.margin_top = tf_oe2_l.margin_right = tf_oe2_l.margin_bottom = 0

    p = tf_oe2_l.paragraphs[0]
    p.text = "Formulación Canónica y Rigor de Datos"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_box = tf_oe2_l.add_paragraph()
    p_box.text = (
        "\"Construir una geodatabase VGI estandarizada y procesada de Barrio Brasil, integrando descarga, "
        "transformación, normalización y análisis espacial de las fuentes VGI seleccionadas, con énfasis en la "
        "robustez y calidad de los datos y en su relación con la población del Barrio Brasil, para generar un "
        "diagnóstico territorial fundamentado.\""
    )
    p_box.font.name = FONT_NAME
    p_box.font.size = Pt(9.5)
    p_box.font.italic = True
    p_box.font.color.rgb = COLOR_AZUL_SEC
    p_box.space_after = Pt(8)

    oe2_desafios = [
        ("Superación de la Desconfianza:", "La VGI suele ser descartada en la gestión pública por inconsistencias topológicas. Este objetivo somete cada objeto a validación geométrica OGC."),
        ("Pipeline ETL Estandarizado:", "Descarga automatizada vía Overpass QL, geoprocesamiento en Python (GeoPandas, Shapely) y base espacial en PostgreSQL 17 + PostGIS 3.3."),
        ("Calidad Multidimensional (ISO 19157):", "Formulación de un modelo de combinación lineal ponderada (WLC v2.0) que audita 10 dimensiones al 10% (5 cuantitativas + 5 cualitativas)."),
        ("Articulación Sociodemográfica:", "Cruce espacial con manzanas censales del Censo 2024 (INE) y Registro Social de Hogares (MIDESO) para vincular equipamiento con población.")
    ]
    for tit_d, txt_d in oe2_desafios:
        p_item = tf_oe2_l.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_d} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_d
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Evidencias Concretas de Avance (H4 y H5 Cerrados)
    agregar_tarjeta(s5, 6.783, 1.70, 5.75, 4.95)
    tb_oe2_r = s5.shapes.add_textbox(Inches(6.983), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe2_r = tb_oe2_r.text_frame
    tf_oe2_r.word_wrap = True
    tf_oe2_r.margin_left = tf_oe2_r.margin_top = tf_oe2_r.margin_right = tf_oe2_r.margin_bottom = 0

    p = tf_oe2_r.paragraphs[0]
    p.text = "Evidencias Concretas de Avance (H4 y H5 al 100%)"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_badge = tf_oe2_r.add_paragraph()
    p_badge.text = "ESTADO: H4 (100% CERRADO) · H5 (100% TERMINADO) · H6 (EN INICIO)"
    p_badge.font.name = FONT_NAME
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_AZUL_UAH
    p_badge.space_after = Pt(8)

    oe2_logros = [
        ("Geodatabase de 118 Capas Vectoriales:", "108 capas oficiales del Estado (Censo 2024, PRC, UOCT, RSH, MINVU) + 10 VGI (2,56 GB activos en catálogo y 3,73 GB en 214 GeoJSONs en disco)."),
        ("PostgreSQL 17 + PostGIS 3.3 en la Nube:", "Alojamiento en Supabase Cloud con 129.262+ geometrías indexadas con árboles espaciales GIST y latencias de respuesta < 200 ms."),
        ("MetaCalidad Espacial Certificada (97,88% IGV):", "Auditoría integral ISO 19157 mediante modelo WLC v2.0: 116 capas en Grado A+ Excelente (≥95%) y 2 en Grado A Muy Bueno, sin ninguna capa deficiente."),
        ("100% de Geometrías Validadas OGC:", "Reparación rigurosa de auto-intersecciones, kinks y anillos abiertos (cero errores fatales en repositorio)."),
        ("Inyección Universal de 14 Atributos ISO:", "Cada capa descargable incorpora metadatos de autoría, escala, SRID, licencia, linaje y contacto."),
        ("Hito 6 en Desarrollo Activo:", "Programación de cruces espaciales de proximidad y formulación del modelo de ranking multidimensional.")
    ]
    for tit_l, txt_l in oe2_logros:
        p_item = tf_oe2_r.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_l} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_l
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s5,
        "El Objetivo Específico 2 presenta un avance sobresaliente: completamos al 100% la construcción de la geodatabase "
        "(Hito 4) y la auditoría de calidad espacial (Hito 5). Contamos con 118 capas consolidadas y certificadas "
        "con un índice ponderado de 97,88% bajo la norma ISO 19157. Cada dataset incluye metadatos enriquecidos "
        "y se vincula a los datos censales 2024. El Hito 6 de cruces espaciales y ranking se encuentra en inicio programado."
    )

    # =========================================================================
    # SLIDE 6: OBJETIVO ESPECÍFICO 3 — FORMULACIÓN AGUDA Y LOGROS
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s6, "Objetivo Específico 3: Prototipo Cartográfico y Geoportal Web Interactivo", 
                       categoria="5. Formulación Aguda — Objetivo Específico 3 (Geoportal en Producción)",
                       subtitulo="Hitos 7 y 8 (80% Anticipado en Producción · 72 Horas Planificadas) · Despliegue en vivo en atlasvgiuah.netlify.app")
    agregar_pie_pagina(s6, 6)

    # Columna Izquierda: Formulación Canónica y Salto Estratégico
    agregar_tarjeta(s6, 0.8, 1.70, 5.75, 4.95)
    tb_oe3_l = s6.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe3_l = tb_oe3_l.text_frame
    tf_oe3_l.word_wrap = True
    tf_oe3_l.margin_left = tf_oe3_l.margin_top = tf_oe3_l.margin_right = tf_oe3_l.margin_bottom = 0

    p = tf_oe3_l.paragraphs[0]
    p.text = "Formulación Canónica y Salto Estratégico"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_box = tf_oe3_l.add_paragraph()
    p_box.text = (
        "\"Diseñar el prototipo cartográfico del Atlas de Información Geográfica Voluntaria de Barrio Brasil, "
        "estableciendo un estándar visual unificado y construyendo un visor web funcional que permita la "
        "consulta territorial interactiva de las capas VGI y los indicadores generados.\""
    )
    p_box.font.name = FONT_NAME
    p_box.font.size = Pt(9.5)
    p_box.font.italic = True
    p_box.font.color.rgb = COLOR_AZUL_SEC
    p_box.space_after = Pt(8)

    oe3_estrategia = [
        ("Adelanto Estratégico Disruptivo:", "En la Carta Gantt original, el visor web correspondía a las semanas 8 a 10. Se tomó la decisión de anticiparlo para disponer de un entorno vivo de prueba y validación."),
        ("Arquitectura Client-Side a Costo $0:", "Frontend desacoplado en JavaScript Vanilla (SPA) y Leaflet 1.9.4 desplegado en Netlify CI/CD. Cero costos mensuales recurrentes para la UAH."),
        ("Resiliencia de Triple Failover:", "1° PostGIS RPC en nube → 2° CDN Storage distribuido → 3° Fallback local empaquetado. Garantiza disponibilidad continua 24/7."),
        ("Diseño Centrado en el Usuario (DCU):", "Portada interactiva que adapta herramientas según los 4 perfiles de actor territorial (Institucional, Comunitario, Voluntario, Academia).")
    ]
    for tit_e, txt_e in oe3_estrategia:
        p_item = tf_oe3_l.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_e} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_e
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Funcionalidades Operativas en Producción
    agregar_tarjeta(s6, 6.783, 1.70, 5.75, 4.95)
    tb_oe3_r = s6.shapes.add_textbox(Inches(6.983), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe3_r = tb_oe3_r.text_frame
    tf_oe3_r.word_wrap = True
    tf_oe3_r.margin_left = tf_oe3_r.margin_top = tf_oe3_r.margin_right = tf_oe3_r.margin_bottom = 0

    p = tf_oe3_r.paragraphs[0]
    p.text = "10 Módulos en Producción (atlasvgiuah.netlify.app)"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_badge = tf_oe3_r.add_paragraph()
    p_badge.text = "ESTADO: 80% ANTICIPADO · DESPLEGADO Y OPERATIVO EN VIVO"
    p_badge.font.name = FONT_NAME
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_AZUL_SEC
    p_badge.space_after = Pt(8)

    oe3_modulos = [
        ("M00 (Visor Cartográfico):", "118 capas con opacidad y simbología unificada + Inspector Normativo PRC Santiago (192 zonas prediales con constructibilidad y uso)."),
        ("M01 a M03 (APIs en Vivo):", "Consultas sintácticas Overpass QL (OSM), análisis histórico de calidad ohsome v1/v2 (Heidelberg) y biodiversidad GBIF Darwin Core."),
        ("M02 (Centro Dinámico de Subsanación):", "Semáforo ISO 19157 con auto-reparación en memoria y guías técnicas listas para copiar en QGIS 3.x, PostGIS 3.x y GeoPandas Python."),
        ("M05 (Generador ISO 19115/19139):", "Exportación de metadatos XML oficial para IDE Chile / SNIT con puente directo de 1 clic y precarga reactiva desde la auditoría."),
        ("M06 a M09 (Catálogos y Gobernanza):", "Diccionario de 134 descriptores, uMap comunitario, catálogos Excel descargables, manual de uso interactivo e indicadores territoriales.")
    ]
    for tit_m, txt_m in oe3_modulos:
        p_item = tf_oe3_r.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_m} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_m
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s6,
        "El Objetivo Específico 3 presenta un adelanto estratégico crucial. El geoportal web ya está completamente operativo "
        "en producción en atlasvgiuah.netlify.app con 10 módulos funcionales. Destaca el visor cartográfico con el Inspector "
        "Normativo del PRC, la conexión en tiempo real con Overpass y GBIF, el Centro de Subsanación con auto-reparación y guías "
        "de QGIS/PostGIS, y el generador de metadatos ISO 19115 con precarga reactiva de un clic."
    )

    # =========================================================================
    # SLIDE 7: OBJETIVO ESPECÍFICO 4 — FORMULACIÓN AGUDA Y LOGROS
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s7, "Objetivo Específico 4: Validación Participativa, Transferibilidad y Memoria Final", 
                       categoria="6. Formulación Aguda — Objetivo Específico 4 (Transferibilidad & Validación)",
                       subtitulo="Hitos 9 y 10 (Programados para Semanas 10 y 11 · 36 Horas) · Validación empírica, manuales y cierre formal")
    agregar_pie_pagina(s7, 7)

    # Columna Izquierda: Formulación Canónica y Principio de Transferibilidad
    agregar_tarjeta(s7, 0.8, 1.70, 5.75, 4.95)
    tb_oe4_l = s7.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe4_l = tb_oe4_l.text_frame
    tf_oe4_l.word_wrap = True
    tf_oe4_l.margin_left = tf_oe4_l.margin_top = tf_oe4_l.margin_right = tf_oe4_l.margin_bottom = 0

    p = tf_oe4_l.paragraphs[0]
    p.text = "Formulación Canónica y Sostenibilidad"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_box = tf_oe4_l.add_paragraph()
    p_box.text = (
        "\"Validar el prototipo del Atlas con usuarios potenciales del territorio y asegurar su transferibilidad "
        "mediante la documentación técnica y metodológica que permita la reproducción y actualización del "
        "producto por parte del centro de práctica u otros actores territoriales, con independencia del practicante.\""
    )
    p_box.font.name = FONT_NAME
    p_box.font.size = Pt(9.5)
    p_box.font.italic = True
    p_box.font.color.rgb = COLOR_AZUL_SEC
    p_box.space_after = Pt(8)

    oe4_principios = [
        ("Independencia del Desarrollador:", "Las herramientas colaborativas fracasan si dependen de una sola persona. El OE 4 asegura que el Atlas sea reproducible por cualquier estudiante o docente de la UAH."),
        ("Ciencia Abierta y Gobernanza:", "Todo el código fuente y las capas se entregan bajo licencias abiertas (ODbL 1.0, CC-BY 4.0, MIT) en un repositorio público de GitHub."),
        ("Validación Empírica Comunitaria:", "La utilidad no se asume teóricamente: se somete a prueba directa con actores reales de Barrio Brasil mediante tareas territoriales concretas."),
        ("Cierre de Memoria de Práctica:", "Consolidación de la experiencia técnica y empírica en el informe final que habilita la titulación profesional en Geografía.")
    ]
    for tit_p, txt_p in oe4_principios:
        p_item = tf_oe4_l.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_p} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_p
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Metodología Programada y Entregables de Titulación
    agregar_tarjeta(s7, 6.783, 1.70, 5.75, 4.95)
    tb_oe4_r = s7.shapes.add_textbox(Inches(6.983), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_oe4_r = tb_oe4_r.text_frame
    tf_oe4_r.word_wrap = True
    tf_oe4_r.margin_left = tf_oe4_r.margin_top = tf_oe4_r.margin_right = tf_oe4_r.margin_bottom = 0

    p = tf_oe4_r.paragraphs[0]
    p.text = "Metodología Programada y Entregables Finales"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    p_badge = tf_oe4_r.add_paragraph()
    p_badge.text = "ESTADO: PROGRAMADO PARA SEMANAS 10 Y 11 (36 HORAS COMPROMETIDAS)"
    p_badge.font.name = FONT_NAME
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_GRIS_TEXTO
    p_badge.space_after = Pt(8)

    oe4_entregables = [
        ("Muestra de 3 a 5 Usuarios Reales (Hito 9):", "Convocatoria a representantes de los 4 perfiles: dirigentes de juntas de vecinos de Barrio Brasil, funcionarios municipales y académicos UAH."),
        ("Protocolo de Usabilidad (ISO 9241-11):", "Pruebas guiadas para evaluar Efectividad (tasa de éxito en resolver preguntas espaciales), Eficiencia (tiempo) y Satisfacción percibida (SUS)."),
        ("Manual de Uso del Atlas (Comunitario):", "Documento ilustrado orientado a vecinos y organizaciones territoriales sin formación previa en Sistemas de Información Geográfica."),
        ("Manual de Actualización Técnica (Hito 10):", "Guía paso a paso para descargar nuevos extractos OSM, ejecutar los scripts de limpieza y actualizar la base en Supabase a costo $0."),
        ("Informe Final de Práctica Profesional:", "Documento consolidado de memoria que articula los 4 objetivos para el examen de título en el Departamento de Geografía UAH.")
    ]
    for tit_e, txt_e in oe4_entregables:
        p_item = tf_oe4_r.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit_e} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = txt_e
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s7,
        "El Objetivo Específico 4 se ejecutará en las semanas 10 y 11. Su propósito es garantizar la transferibilidad plena "
        "y la sostenibilidad del proyecto. No basta con entregar software: validaremos la usabilidad con tres a cinco actores "
        "reales de Barrio Brasil bajo la norma ISO 9241-11, redactaremos manuales comunitarios y técnicos para que la UAH "
        "pueda mantener la plataforma de forma autónoma, y consolidaremos el informe formal de práctica para la titulación."
    )
    # =========================================================================
    # SLIDE 8: MARCO METODOLÓGICO (PARTE 1: DIAGNÓSTICO Y GEODATABASE)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s8, "Plan Metodológico y Procedimientos (Fase 1: OE 1 y OE 2)", 
                       categoria="7. Marco Metodológico — Diagnóstico y Datos",
                       subtitulo="Enfoque metodológico, herramientas de geoprocesamiento y estándares internacionales")
    agregar_pie_pagina(s8, 8)

    fases_1 = [
        ("Fase 1: Diagnóstico y Arquitectura Conceptual (OE 1 · Sem 1–3)", [
            ("Revisión de Fuentes y Antecedentes:", "Auditoría de plataformas VGI (OpenStreetMap, GBIF, ohsome) y catálogo nacional IDE Chile."),
            ("Delimitación Territorial y Bbox:", "Definición del polígono oficial de Barrio Brasil (223,75 ha) en CRS WGS84 (EPSG:4326) y UTM 19S (EPSG:32719)."),
            ("Diseño Centrado en el Usuario (DCU):", "Estructuración de 4 perfiles territoriales: Institucional, Comunitario, Voluntario OSM e Investigador UAH."),
            ("Taxonomía de 10 Macro-Categorías:", "Clasificación de elementos urbanos desde CAT-01 (Movilidad) hasta CAT-10 (Medio Ambiente).")
        ]),
        ("Fase 2: Geodatabase y Calidad Espacial (OE 2 · Sem 4–7)", [
            ("Extracción y Pipeline ETL en Python:", "Descarga automatizada vía Overpass QL, APIs REST y geoprocesamiento masivo de Geofabrik RM (2.181 MB)."),
            ("Normalización y Corrección Topológica:", "Reparación de geometrías con Shapely y PostGIS (ST_MakeValid), eliminando auto-intersecciones y slivers."),
            ("Auditoría de MetaCalidad ISO 19157:", "Modelo lineal ponderado WLC v2.0 (10 dimensiones) que certifica un 97,88% de consistencia de metadatos."),
            ("Inyección de Columnas ISO:", "Inserción universal de 14 atributos normalizados en cada dataset descargable desde el Atlas.")
        ])
    ]
    for fi, (ftit, fitems) in enumerate(fases_1):
        fx = 0.8 + fi * (5.75 + 0.233)
        agregar_tarjeta(s8, fx, 1.70, 5.75, 4.95)

        tb_f = s8.shapes.add_textbox(Inches(fx + 0.20), Inches(1.85), Inches(5.35), Inches(4.65))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0

        p = tf_f.paragraphs[0]
        p.text = ftit
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(12)

        for subt, txt in fitems:
            p_sub = tf_f.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(8)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s8,
        "La metodología combina métodos cuantitativos espaciales y cualitativos documentales. "
        "En la Fase 1 establecimos el marco conceptual y los perfiles de usuario. En la Fase 2 estructuramos "
        "un pipeline ETL robusto en Python que depura los datos crudos de OSM y fuentes estatales, garantizando "
        "topología válida y metacalidad certificada."
    )

    # =========================================================================
    # SLIDE 9: MARCO METODOLÓGICO (PARTE 2: GEOPORTAL Y VALIDACIÓN)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s9, "Plan Metodológico y Procedimientos (Fase 2: OE 3 y OE 4)", 
                       categoria="8. Marco Metodológico — Desarrollo y Validación",
                       subtitulo="Despliegue Client-Side First, interoperabilidad de estándares y protocolo de usabilidad")
    agregar_pie_pagina(s9, 9)

    fases_2 = [
        ("Fase 3: Geoportal Web y Producción (OE 3 · Sem 8–10)", [
            ("Arquitectura Client-Side First ($0 Costo):", "Frontend desacoplado en JavaScript vanilla (ES6+), Leaflet 1.9.4 y despliegue CI/CD en Netlify."),
            ("Consultas Dinámicas en Vivo:", "Conexión en tiempo real a Overpass QL, ohsome API (Heidelberg University) y GBIF (Darwin Core)."),
            ("Inspector Normativo PRC Santiago:", "Módulo de consulta territorial que cruza coordenadas con las 192 zonas del Plan Regulador Comunal."),
            ("Interoperabilidad y Catálogos:", "Exportador de metadatos XML ISO 19139 compatibles con GeoNetwork y catálogos en formato Excel.")
        ]),
        ("Fase 4: Validación Empírica y Cierre (OE 4 · Sem 11)", [
            ("Pruebas de Usabilidad (ISO 9241-11):", "Evaluación empírica con usuarios reales representativos de los 4 perfiles territoriales en Barrio Brasil."),
            ("Pauta de Evaluación y Tareas Tipo:", "Medición de efectividad (tasa de éxito en tareas), eficiencia (tiempo invertido) y satisfacción percibida."),
            ("Manuales de Transferibilidad:", "Redacción del Manual de Uso Comunitario y la Guía de Mantenimiento Técnico para el Departamento de Geografía."),
            ("Cierre de Memoria y Titulación:", "Consolidación del Informe Final de Práctica Profesional y preparación del examen de título.")
        ])
    ]
    for fi, (ftit, fitems) in enumerate(fases_2):
        fx = 0.8 + fi * (5.75 + 0.233)
        agregar_tarjeta(s9, fx, 1.70, 5.75, 4.95)

        tb_f = s9.shapes.add_textbox(Inches(fx + 0.20), Inches(1.85), Inches(5.35), Inches(4.65))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0

        p = tf_f.paragraphs[0]
        p.text = ftit
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(12)

        for subt, txt in fitems:
            p_sub = tf_f.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(8)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s9,
        "La Fase 3 consolida el geoportal web bajo una arquitectura de costo cero en la nube, garantizando que el Departamento "
        "de Geografía UAH y la comunidad puedan mantenerlo activo sin costos operativos recurrentes. La Fase 4 contempla "
        "la validación empírica con usuarios reales y la entrega formal de manuales transferibles."
    )

    # =========================================================================
    # SLIDE 10: CRONOGRAMA Y CUMPLIMIENTO (GANTT, HORAS E HITOS)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s10, "Estado de Avance y Carta Gantt (Corte 150 Horas)", 
                       categoria="9. Planificación Temporal y Cumplimiento",
                       subtitulo="Cronograma de 11 semanas (300 horas) · Corte al 50% con los Hitos 1 a 5 concluidos")
    agregar_pie_pagina(s10, 10)

    # Métricas de avance superior
    metricas_gantt = [
        ("Horas Concluidas", "150 / 300 hrs", "50,0% cronológico exacto"),
        ("Jornadas Hábiles", "25 / 50 días", "Semanas 1 a 5 concluidas"),
        ("Hitos Cerrados", "H1 a H5 cerrados", "OE 1 completo y OE 2 calidad cerrada"),
        ("Geoportal en Producción", "80% anticipado", "Disponible en Netlify")
    ]
    card_m_w = 2.75
    gap_m = 0.244
    for mi, (mt, mv, md) in enumerate(metricas_gantt):
        mx = 0.8 + mi * (card_m_w + gap_m)
        agregar_tarjeta(s10, mx, 1.70, card_m_w, 0.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_m = s10.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(card_m_w - 0.30), Inches(0.85))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p1 = tf_m.paragraphs[0]
        p1.text = mt.upper()
        p1.font.name = FONT_NAME
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_AZUL_UAH
        p2 = tf_m.add_paragraph()
        p2.text = mv
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NEGRO
        p3 = tf_m.add_paragraph()
        p3.text = md
        p3.font.name = FONT_NAME
        p3.font.size = Pt(10)
        p3.font.color.rgb = COLOR_GRIS_TEXTO

    # Tabla Carta Gantt con nombres claros previos y paleta estricta Negro/Azul/Blanco
    headers_gantt = ["Hito / Actividad Planificada", "OE", "S1", "S2", "S3", "S4", "S5", "S6*", "S7", "S8", "S9", "S10", "S11", "Estado"]
    filas_gantt = [
        ["H1: Inducción, territorio y usuarios", "OE 1", "■", "", "", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H2: Diseño conceptual y 10 categorías VGI", "OE 1", "", "■", "", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H3: Revisión de fuentes VGI y brechas IDE", "OE 1", "", "", "■", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H4: Obtención y geodatabase (118 capas)", "OE 2", "", "", "", "■", "■", "", "", "", "", "", "", "100% Cerrado"],
        ["H5: Calidad de datos (MetaCalidad ISO 19157)", "OE 2", "", "", "", "", "■", "■", "", "", "", "", "", "100% Terminado"],
        ["H6: Análisis territorial y modelo ranking", "OE 2", "", "", "", "", "", "", "■", "■", "", "", "", "En inicio"],
        ["H7: Estándar cartográfico del Atlas", "OE 3", "", "", "", "", "", "", "", "■", "", "", "", "Programado"],
        ["H8: Geoportal web interactivo en producción", "OE 3", "", "", "", "", "", "■", "■", "■", "■", "", "", "80% Anticipado"],
        ["H9: Validación con 3–5 usuarios reales", "OE 4", "", "", "", "", "", "", "", "", "", "■", "", "Programado"],
        ["H10: Manuales, transferibilidad y entrega final", "OE 4", "", "", "", "", "", "", "", "", "", "", "■", "Programado"]
    ]

    tg = s10.shapes.add_table(11, 14, Inches(0.8), Inches(2.80), Inches(11.733), Inches(3.90))
    tbl_g = tg.table
    w_cols = [Inches(3.3), Inches(0.6)] + [Inches(0.61)] * 11 + [Inches(1.123)]
    for ci, w in enumerate(w_cols):
        tbl_g.columns[ci].width = w

    # Encabezado de la tabla Gantt
    for ci, val in enumerate(headers_gantt):
        c = tbl_g.cell(0, ci)
        c.text = val
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_AZUL_UAH
        c.vertical_anchor = MSO_ANCHOR.MIDDLE
        c.margin_left = c.margin_right = c.margin_top = c.margin_bottom = Inches(0.04)
        p = c.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.font.name = FONT_NAME
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLANCO
        set_cell_border(c, "CBD5E1", "8000")

    # Filas de datos de la tabla Gantt
    for ri, fila in enumerate(filas_gantt, 1):
        for ci, val in enumerate(fila):
            c = tbl_g.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.margin_left = c.margin_right = c.margin_top = c.margin_bottom = Inches(0.04)
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME

            # Colores sobrios: Azul, Blanco y Negro
            if ci in range(2, 13) and val == "■":
                c.fill.solid()
                if ri in [1, 2, 3, 4, 5]: # Hitos 1 a 5 cerrados
                    c.fill.fore_color.rgb = COLOR_AZUL_DESTACADO
                    p.font.color.rgb = COLOR_AZUL_UAH
                    p.font.size = Pt(12)
                    p.font.bold = True
                elif ri in [6, 8]: # En curso / anticipado
                    c.fill.fore_color.rgb = COLOR_AZUL_CLARO
                    p.font.color.rgb = COLOR_AZUL_SEC
                    p.font.size = Pt(12)
                    p.font.bold = True
                else: # Programado
                    c.fill.fore_color.rgb = COLOR_BLANCO
                    p.font.color.rgb = COLOR_GRIS_TEXTO
                    p.font.size = Pt(10)
                p.alignment = PP_ALIGN.CENTER
            elif ci == 13: # Columna Estado
                c.fill.solid()
                if "100%" in val:
                    c.fill.fore_color.rgb = COLOR_AZUL_DESTACADO
                    p.font.color.rgb = COLOR_AZUL_UAH
                    p.font.bold = True
                elif "80%" in val:
                    c.fill.fore_color.rgb = COLOR_AZUL_CLARO
                    p.font.color.rgb = COLOR_AZUL_SEC
                    p.font.bold = True
                else:
                    c.fill.fore_color.rgb = COLOR_GRIS_FONDO
                    p.font.color.rgb = COLOR_NEGRO
                p.alignment = PP_ALIGN.CENTER
                p.font.size = Pt(10.5)
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(10.5)
                p.font.color.rgb = COLOR_NEGRO
                p.alignment = PP_ALIGN.CENTER if ci == 1 else PP_ALIGN.LEFT
                if ci == 0: p.font.bold = True

            set_cell_border(c, "CBD5E1", "8000")

    agregar_notas_orador(s10,
        "La Carta Gantt refleja un avance exacto del 50% cronológico, con 150 horas concluidas y los cinco primeros hitos formalmente cerrados. "
        "Destaca que el Hito 5 de calidad de datos se encuentra completamente terminado con la auditoría ISO 19157 y la inyección universal "
        "de metadatos, mientras que el geoportal (Hito 8) se encuentra anticipado al 80%."
    )

    # =========================================================================
    # SLIDE 11: RESULTADOS OE 1 — ARQUITECTURA CONCEPTUAL Y TAXONOMÍA VGI
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s11, "Resultados OE 1: Arquitectura Conceptual y Taxonomía VGI", 
                       categoria="10. Resultados — Diseño Conceptual (OE 1)",
                       subtitulo="Estructuración de las 10 macrocategorías comunitarias y definición de perfiles multiactor")
    agregar_pie_pagina(s11, 11)

    cards_oe1 = [
        ("10 Macro-Categorías VGI (CAT-01 a CAT-10)", [
            ("Movilidad y Transporte (CAT-01):", "Red vial, ciclovías, 1.500+ cruces semaforizados UOCT y accesibilidad."),
            ("Equipamiento Comunitario (CAT-02):", "Centros de salud DEIS, educación, sedes vecinales y cultura."),
            ("Espacios Públicos y Verdes (CAT-03):", "Parques, plazas y arbolado urbano referenciado."),
            ("Patrimonio y Turismo (CAT-04):", "Monumentos nacionales, inmuebles de conservación y placas."),
            ("Comercio y Servicios (CAT-05):", "Comercio de barrio, almacenes, ferias libres y servicios."),
            ("Medio Ambiente y Biodiversidad (CAT-10):", "Registros biológicos de GBIF e infraestructura verde.")
        ]),
        ("4 Perfiles Territoriales (Enfoque DCU)", [
            ("1. Gestor Institucional / Municipal:", "Orientado a SECPLA y DIMAO para evaluar déficit de servicios y normativa."),
            ("2. Dirigente Vecinal / Comunitario:", "Herramientas intuitivas de reporte y consulta sin requerir manejo técnico."),
            ("3. Voluntario OSM / Mapeador:", "Consultas Overpass QL, extracción de etiquetas y monitoreo de calidad."),
            ("4. Investigador / Académico UAH:", "Descarga masiva de datos en formatos interoperables (GeoJSON, GPKG, XML).")
        ]),
        ("Delimitación y Caso Piloto", [
            ("Extensión Oficial:", "Polígono de 223,75 hectáreas en el sector poniente de la comuna de Santiago."),
            ("Articulación Urbana:", "Integra las Unidades Vecinales de Barrio Brasil y el campus patrimonial UAH."),
            ("Referencia Geodésica:", "Proyección cartográfica homogénea en WGS84 (EPSG:4326) y UTM 19S (EPSG:32719)."),
            ("Entregable OE 1:", "Documento metodológico formal de 61 páginas aprobado y catalogado.")
        ])
    ]
    card_w7 = 3.75
    gap_x7 = 0.24
    for i, (titulo_card, items) in enumerate(cards_oe1):
        cx = 0.8 + i * (card_w7 + gap_x7)
        agregar_tarjeta(s11, cx, 1.70, card_w7, 4.95)

        tb_c = s11.shapes.add_textbox(Inches(cx + 0.20), Inches(1.85), Inches(card_w7 - 0.40), Inches(4.65))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

        p = tf_c.paragraphs[0]
        p.text = titulo_card
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(10)

        for subt, txt in items:
            p_sub = tf_c.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(6)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s11,
        "El OE 1 entregó dos productos clave: la taxonomía de 10 macrocategorías VGI que homologa las etiquetas de OpenStreetMap, "
        "y la matriz de 4 perfiles territoriales bajo el estándar de Diseño Centrado en el Usuario (ISO 9241-210), garantizando que "
        "la plataforma responda tanto a un vecino como a un investigador Fondecyt."
    )

    # =========================================================================
    # SLIDE 12: RESULTADOS OE 2 — GEODATABASE DE 118 COMPONENTES
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s12, "Resultados OE 2: Geodatabase y Componentes Cartográficos", 
                       categoria="11. Resultados — Geodatabase Espacial (OE 2)",
                       subtitulo="Consolidación de 118 capas espaciales (2,56 GB) en PostGIS 17 y Supabase Cloud")
    agregar_pie_pagina(s12, 12)

    # 4 Métricas de la Geodatabase
    met_db = [
        ("Total Capas Activas", "118 capas", "108 oficiales + 10 VGI"),
        ("Volumen Espacial", "2.560 MB", "2,56 GB datos vectoriales"),
        ("Capas Oficiales IDE", "108 capas", "8 grupos temáticos estatales"),
        ("Entidades Geofabrik RM", "1.552.000+", "Cobertura metropolitana integral")
    ]
    card_db_w = 2.75
    gap_db = 0.244
    for mi, (mt, mv, md) in enumerate(met_db):
        mx = 0.8 + mi * (card_db_w + gap_db)
        agregar_tarjeta(s12, mx, 1.70, card_db_w, 0.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_m = s12.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(card_db_w - 0.30), Inches(0.85))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p1 = tf_m.paragraphs[0]
        p1.text = mt.upper()
        p1.font.name = FONT_NAME
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_AZUL_UAH
        p2 = tf_m.add_paragraph()
        p2.text = mv
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NEGRO
        p3 = tf_m.add_paragraph()
        p3.text = md
        p3.font.name = FONT_NAME
        p3.font.size = Pt(10)
        p3.font.color.rgb = COLOR_GRIS_TEXTO

    # Tabla de Distribución por Grupos Temáticos
    filas_gdb = [
        ["Grupo Temático Consolidado", "Instituciones Custodias Principales", "Capas (N°)", "% Capas", "Volumen (MB)", "% Volumen"],
        ["Demografía y Vulnerabilidad Social", "INE (Censo 2024 en 5 niveles), MDSF (RSH), MINVU", "19", "16,1%", "689,44 MB", "31,6%"],
        ["Normativa e Instrumentos IPT", "MINVU, Seremi Metropolitana, PRC Santiago (192 zonas)", "13", "11,0%", "207,00 MB", "9,5%"],
        ["Economía, Fomento e Inversión", "MDSF (Banco Integrado Proyectos BIP), MOP, CNE Energía", "15", "12,7%", "203,67 MB", "9,3%"],
        ["Medio Ambiente y Recursos Hídricos", "MMA, DGA, CONAF, Dirección Meteorológica de Chile", "21", "17,8%", "101,04 MB", "4,6%"],
        ["Movilidad, Red Vial y Tránsito", "MTT, UOCT (1.500+ cruces semaforizados), Metro, EFE", "7", "5,9%", "66,88 MB", "3,1%"],
        ["Equipamiento Público y Patrimonio", "Consejo de Monumentos (CMN), MINEDUC, MINSAL, IND", "28", "23,7%", "58,51 MB", "2,7%"],
        ["Seguridad, Bomberos y Justicia", "Carabineros de Chile, Bomberos CBS, Ministerio de Justicia", "5", "4,2%", "0,93 MB", "0,0%"],
        ["VGI Comunitario (OSM + GBIF)", "Comunidad OSM (Geofabrik RM + Barrio Brasil) y GBIF", "10", "8,5%", "854,35 MB", "39,2%"],
        ["TOTAL CAPAS ACTIVAS (118)", "Geodatabase operativa (PostGIS 17 + Supabase Cloud)", "118", "100,0%", "2.560,00 MB", "100,0%"]
    ]

    tgdb = s12.shapes.add_table(10, 6, Inches(0.8), Inches(2.80), Inches(11.733), Inches(3.90))
    tbl_gdb = tgdb.table
    w_gdb = [Inches(3.3), Inches(4.333), Inches(0.9), Inches(1.0), Inches(1.1), Inches(1.1)]
    for ci, w in enumerate(w_gdb):
        tbl_gdb.columns[ci].width = w

    for ri, fila in enumerate(filas_gdb):
        for ci, val in enumerate(fila):
            c = tbl_gdb.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.margin_left = c.margin_right = c.margin_top = c.margin_bottom = Inches(0.06)
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(11)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            elif ri == 9:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_DESTACADO
                p.font.size = Pt(11)
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_UAH
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(10.5)
                p.font.color.rgb = COLOR_NEGRO
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
                if ci == 0: p.font.bold = True
            set_cell_border(c, "CBD5E1", "8000")

    agregar_notas_orador(s12,
        "La geodatabase consolida 118 capas cartográficas divididas en 8 grupos oficiales y el bloque VGI colaborativo. "
        "En volumen, la información activa alcanza 2,56 gigabytes integrando los datos masivos de Geofabrik RM y capas oficiales "
        "en WGS84 y UTM 19S en PostgreSQL 17."
    )

    # =========================================================================
    # SLIDE 13: RESULTADOS OE 2 — ÍNDICE DE CALIDAD: 5 COMPONENTES CUANTITATIVOS (ISO 19157)
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s13, "Resultados OE 2: Índice de Calidad — 5 Componentes Cuantitativos", 
                       categoria="12. Calidad de Datos (OE 2) — Pilar Cuantitativo (ISO 19157)",
                       subtitulo="Auditoría algorítmica sobre 118 capas: geometría vectorial, topología, geodésica, atributos y estructura (50% IGV)")
    agregar_pie_pagina(s13, 13)

    # Tarjeta de Síntesis del Pilar Cuantitativo
    agregar_tarjeta(s13, 0.8, 1.70, 11.733, 0.85, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_qtop = s13.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(11.333), Inches(0.75))
    tf_qtop = tb_qtop.text_frame
    tf_qtop.word_wrap = True
    tf_qtop.margin_left = tf_qtop.margin_top = tf_qtop.margin_right = tf_qtop.margin_bottom = 0
    p = tf_qtop.paragraphs[0]
    p.text = "PILAR CUANTITATIVO ESPACIAL (50% DEL ÍNDICE GLOBAL DE CALIDAD IGV)"
    p.font.name = FONT_NAME
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p_qt_txt = tf_qtop.add_paragraph()
    p_qt_txt.text = (
        "Auditoría algorítmica sobre las 118 capas del repositorio (1.552.000+ geometrías vectoriales). "
        "Ponderación interna del pilar: Promedio Cuantitativo 97,1% (Grado A+ Excelente) bajo estándar ISO 19157-1:2023. "
        "El 100% de geometrías fue reparado y certificado en PostGIS 17 (documentado en docs/ANALISIS_METACALIDAD.md)."
    )
    p_qt_txt.font.name = FONT_NAME
    p_qt_txt.font.size = Pt(10.5)
    p_qt_txt.font.color.rgb = COLOR_NEGRO

    # Columna Izquierda: 3 Componentes Cuantitativos
    cards_cuant_left = [
        ("1. Consistencia Topológica (30% Pilar · 15,0% Global | 99,9% A+)", [
            "• Reglas OGC Simple Features: polígonos cerrados (P0 = Pn), sin auto-intersecciones, kinks ni slivers.",
            "• Reparación universal ejecutada al 100% con Shapely y ST_MakeValid en PostGIS 17 (0 errores fatales)."
        ]),
        ("2. Completitud Tabular (25% Pilar · 12,5% Global | 96,9% A+)", [
            "• Evaluación celda a celda de campos con datos válidos frente a cardinalidad esperada del esquema.",
            "• Detección y exclusión sistemática de valores nulos, cadenas vacías (null, NA) y campos omitidos."
        ]),
        ("3. Integridad Posicional Geodésica (20% Pilar · 10,0% Global | 100,0% A+)", [
            "• Coordenadas estrictamente confinadas al elipsoide WGS84 (EPSG:4326) y proyección UTM 19S (EPSG:32719).",
            "• Detección y eliminación de coordenadas espurias en el origen (0,0), valores NaN o desbordamientos."
        ])
    ]

    # Columna Derecha: 2 Componentes Cuantitativos
    cards_cuant_right = [
        ("4. Estructura y Esquema (15% Pilar · 7,5% Global | 86,5% A)", [
            "• Homogeneidad de tipos de datos por columna (sin mezclas de texto y enteros) y consistencia de atributos.",
            "• Garantía de clave primaria o identificador único por entidad vectorial (osm_id, fid, cut_com, cod_uv)."
        ]),
        ("5. Granularidad Geométrica (10% Pilar · 5,0% Global | 100,0% A+)", [
            "• Densidad de vértices adecuada para análisis microterritorial intraurbano (manzanas e hileras prediales).",
            "• Ausencia de sobregeneralización que distorsione la precisión métrica en entornos de escala barrial."
        ])
    ]

    col_w_q = 5.75
    top_pos_l = [2.68, 4.03, 5.38]
    card_h_l = 1.25

    for idx, (tit_c, bullets) in enumerate(cards_cuant_left):
        top_y = top_pos_l[idx]
        agregar_tarjeta(s13, 0.8, top_y, col_w_q, card_h_l)
        tb = s13.shapes.add_textbox(Inches(1.0), Inches(top_y + 0.10), Inches(col_w_q - 0.40), Inches(card_h_l - 0.20))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tit_c
        p.font.name = FONT_NAME
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(4)
        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = b
            p_b.font.name = FONT_NAME
            p_b.font.size = Pt(10)
            p_b.font.color.rgb = COLOR_NEGRO
            p_b.space_after = Pt(2)

    top_pos_r = [2.68, 4.71]
    card_h_r = 1.92

    for idx, (tit_c, bullets) in enumerate(cards_cuant_right):
        top_y = top_pos_r[idx]
        agregar_tarjeta(s13, 6.78, top_y, col_w_q, card_h_r)
        tb = s13.shapes.add_textbox(Inches(6.98), Inches(top_y + 0.12), Inches(col_w_q - 0.40), Inches(card_h_r - 0.24))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tit_c
        p.font.name = FONT_NAME
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(5)
        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = b
            p_b.font.name = FONT_NAME
            p_b.font.size = Pt(10)
            p_b.font.color.rgb = COLOR_NEGRO
            p_b.space_after = Pt(3)

    agregar_notas_orador(s13,
        "Esta lámina expone los cinco componentes cuantitativos del índice de calidad espacial según la norma ISO 19157-1:2023, "
        "tal como está formalmente documentado en docs/ANALISIS_METACALIDAD.md. Las ponderaciones del pilar son: "
        "Topología 30% (99,9%), Completitud tabular 25% (96,9%), Integridad posicional 20% (100,0%), Estructura 15% (86,5%) "
        "y Granularidad geométrica 10% (100,0%). El subtotal cuantitativo alcanza 97,1% (Grado A+ Excelente)."
    )

    # =========================================================================
    # SLIDE 14: RESULTADOS OE 2 — ÍNDICE DE CALIDAD: 5 COMPONENTES CUALITATIVOS E INTEGRACIÓN
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s14, "Resultados OE 2: Índice de Calidad — 5 Componentes Cualitativos e Integración", 
                       categoria="13. Calidad de Datos (OE 2) — Pilar Cualitativo e Integración",
                       subtitulo="Normas ISO 19115-1:2014, Perfil IDE Chile SNIT v2.0, síntesis global IGV (97,9%) e inyección en descargas")
    agregar_pie_pagina(s14, 14)

    # Columna Izquierda: Los 5 Componentes Cualitativos (ISO 19115 / SNIT / Open Data)
    agregar_tarjeta(s14, 0.8, 1.70, 5.85, 4.95)
    tb_qual = s14.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.45), Inches(4.65))
    tf_qual = tb_qual.text_frame
    tf_qual.word_wrap = True
    tf_qual.margin_left = tf_qual.margin_top = tf_qual.margin_right = tf_qual.margin_bottom = 0

    p = tf_qual.paragraphs[0]
    p.text = "Pilar Cualitativo Documental (50% IGV) — 5 Componentes"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(3)

    p_sub = tf_qual.add_paragraph()
    p_sub.text = "Evaluación según ISO 19115-1:2014, Perfil IDE Chile SNIT y Ley N° 20.285:"
    p_sub.font.name = FONT_NAME
    p_sub.font.size = Pt(10.5)
    p_sub.font.italic = True
    p_sub.font.color.rgb = COLOR_GRIS_TEXTO
    p_sub.space_after = Pt(6)

    qual_items = [
        ("1. Metadatos Núcleo / Core (30% Pilar · 15,0% Global | 95,2% A+):", "Título formal, resumen analítico, propósito, palabras clave, fecha de corte y contacto del custodio (10 campos obligatorios)."),
        ("2. Linaje y Trazabilidad Jurídica (25% Pilar · 12,5% Global | 100,0% A+):", "Declaración formal de fuente primaria (INE, MINVU, OSM, GBIF), histórico de captura y pipeline ETL verificado."),
        ("3. Conformidad Normativa (20% Pilar · 10,0% Global | 100,0% A+):", "Homologación al Perfil Nacional de Metadatos (IDE Chile SNIT), esquemas ISO 19139 / 19110 y marco de Transparencia Activa."),
        ("4. Resolución Geodésica y Escala (15% Pilar · 7,5% Global | 100,0% A+):", "Declaración formal de CRS EPSG:4326, delimitación de Bbox oficial y especificación de escala cartográfica (Snyder, 1987)."),
        ("5. Accesibilidad Operativa (10% Pilar · 5,0% Global | 100,0% A+):", "Endpoints de descarga directa (GeoJSON, GPKG, XML), CDN edge sin enlaces rotos y licencias declaradas (ODbL 1.0, CC-BY 4.0).")
    ]
    for subt, txt in qual_items:
        p_item = tf_qual.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9.5)
        p_item.space_after = Pt(4)
        r_b = p_item.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_item.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    p_qual_end = tf_qual.add_paragraph()
    p_qual_end.text = "Desempeño Cualitativo Promedio: 98,6% (Grado A+ Excelente en metadatos)."
    p_qual_end.font.name = FONT_NAME
    p_qual_end.font.size = Pt(10.5)
    p_qual_end.font.bold = True
    p_qual_end.font.color.rgb = COLOR_AZUL_UAH
    p_qual_end.space_before = Pt(4)

    # Columna Derecha Superior: Modelo de Integración Global WLC v2.0
    agregar_tarjeta(s14, 6.90, 1.70, 5.633, 2.40, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_wlc = s14.shapes.add_textbox(Inches(7.10), Inches(1.82), Inches(5.233), Inches(2.15))
    tf_wlc = tb_wlc.text_frame
    tf_wlc.word_wrap = True
    tf_wlc.margin_left = tf_wlc.margin_top = tf_wlc.margin_right = tf_wlc.margin_bottom = 0

    p = tf_wlc.paragraphs[0]
    p.text = "Integración Global Dual WLC (50% Cuant + 50% Cual)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p_form = tf_wlc.add_paragraph()
    p_form.text = "Fórmula: IGV = 0.50 · S_cuant (97,1%) + 0.50 · S_cual (98,6%) = 97,9% (97,88%)"
    p_form.font.name = FONT_NAME
    p_form.font.size = Pt(10.5)
    p_form.font.bold = True
    p_form.font.color.rgb = COLOR_AZUL_SEC
    p_form.space_after = Pt(3)

    wlc_points = [
        "• Cumplimiento Global Repositorio: 97,9% (97,88% exacto) de conformidad ponderada en las 118 capas.",
        "• Clasificación ISO 19157: Grado A+ (Excelente) para la totalidad de componentes (108 Estado + 10 VGI).",
        "• Distribución en 118 Capas: 116 capas en Grado A+ (98,3%), 2 capas en Grado A (1,7%), 0 capas deficientes.",
        "• Estado del Componente: 100% Terminado y Certificado formalmente (Hito 5 cerrado)."
    ]
    for pt in wlc_points:
        p_pt = tf_wlc.add_paragraph()
        p_pt.text = pt
        p_pt.font.name = FONT_NAME
        p_pt.font.size = Pt(9.5)
        p_pt.font.color.rgb = COLOR_NEGRO
        p_pt.space_after = Pt(1)

    # Columna Derecha Inferior: Inyección Universal en Descargas
    agregar_tarjeta(s14, 6.90, 4.25, 5.633, 2.40, bg_color=COLOR_BLANCO, border_color=COLOR_GRIS_BORDE)
    tb_inj = s14.shapes.add_textbox(Inches(7.10), Inches(4.37), Inches(5.233), Inches(2.15))
    tf_inj = tb_inj.text_frame
    tf_inj.word_wrap = True
    tf_inj.margin_left = tf_inj.margin_top = tf_inj.margin_right = tf_inj.margin_bottom = 0

    p = tf_inj.paragraphs[0]
    p.text = "Inyección Universal en Descargas del Atlas"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    inj_points = [
        "• 14 Atributos Normalizados ISO: Inyectados directamente en las propiedades de cada GeoJSON, GeoPackage y Shapefile descargable desde el Atlas.",
        "• Trazabilidad Inmediata: Cualquier usuario o investigador que descargue datos obtiene custodio, fecha, licencia, linaje y metacalidad en el mismo archivo.",
        "• Criterio de Metacalidad Homogéneo: Garantiza el cumplimiento de estándares para la investigación Fondecyt y la gestión territorial comunitaria."
    ]
    for pt in inj_points:
        p_pt = tf_inj.add_paragraph()
        p_pt.text = pt
        p_pt.font.name = FONT_NAME
        p_pt.font.size = Pt(10.5)
        p_pt.font.color.rgb = COLOR_NEGRO
        p_pt.space_after = Pt(3)

    agregar_notas_orador(s14,
        "En esta lámina cerramos el índice de calidad con su pilar cualitativo según ISO 19115 y el Perfil Nacional de Metadatos SNIT. "
        "La integración dual al 50% cuantitativo y 50% cualitativo arroja un promedio de 97,88% (Grado A+ Excelente). "
        "Además, implementamos la inyección universal de 14 atributos de metadatos en todas las descargas del Atlas, "
        "dando por cerrado y terminado al 100% el componente de calidad en el OE 2."
    )

    # =========================================================================
    # SLIDE 15: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 1)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s15, "Dimensiones de Análisis Territorial (Parte 1: Concepto, D1 y D2)", 
                       categoria="14. Marco Analítico — Dimensiones Territoriales (1 y 2)",
                       subtitulo="Estructura conceptual multidimensional para el diagnóstico barrial en Barrio Brasil")
    agregar_pie_pagina(s15, 15)

    cards_dim1 = [
        ("Marco Analítico de las 5 Dimensiones", [
            ("Propósito Metodológico:", "Superar la dispersión de datos organizando las 118 capas en 5 ejes estratégicos de diagnóstico territorial."),
            ("Escala Microespacial:", "Operatividad a nivel de Unidad Vecinal, Manzana Censal 2024 e hilera predial en Barrio Brasil."),
            ("Articulación Multifuente:", "Cruce sistemático entre datos oficiales del Estado de Chile y capas colaborativas de OpenStreetMap y GBIF."),
            ("Soporte a Decisiones:", "Base analítica para alimentar matrices multicriterio de priorización barrial.")
        ]),
        ("D1: Vulnerabilidad y Bienestar Social", [
            ("Población y Demografía:", "Censo 2024 desagregado en 5 escalas territoriales (desde nivel regional hasta manzana censal)."),
            ("Vulnerabilidad Social:", "Registro Social de Hogares (RSH / MDSF) con porcentaje de hogares en el tramo del 40% más vulnerable."),
            ("Jefatura de Hogar y Género:", "Índice de jefatura femenina e indicadores de hacinamiento por unidad vecinal."),
            ("Enfoque Focalizado:", "Permite identificar microzonas prioritarias para inversión social y programas comunitarios.")
        ]),
        ("D2: Movilidad, Accesibilidad y Tránsito", [
            ("Cruces Semaforizados:", "1.500+ intersecciones semaforizadas UOCT con información de sincronización y tipo de controlador."),
            ("Transporte Público:", "Trazados y estaciones de Metro de Santiago (Líneas 1, 2 y 5) y paraderos de buses Red."),
            ("Red Peatonal y Ciclovías:", "Veredas peatonales, ciclovías existentes, zonas de calmado de tráfico y pasos peatonales."),
            ("Accesibilidad Universal:", "Evaluación de continuidad y barreras físicas para personas con movilidad reducida.")
        ])
    ]
    card_w11 = 3.75
    gap_x11 = 0.24
    for i, (titulo_card, items) in enumerate(cards_dim1):
        cx = 0.8 + i * (card_w11 + gap_x11)
        agregar_tarjeta(s15, cx, 1.70, card_w11, 4.95)

        tb_c = s15.shapes.add_textbox(Inches(cx + 0.20), Inches(1.85), Inches(card_w11 - 0.40), Inches(4.65))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

        p = tf_c.paragraphs[0]
        p.text = titulo_card
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(12)

        for subt, txt in items:
            p_sub = tf_c.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(8)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s15,
        "Las cinco dimensiones de análisis estructuran temáticamente los datos del Atlas. "
        "En esta primera lámina presentamos el concepto general, junto con la Dimensión 1 (Vulnerabilidad y Bienestar Social), "
        "que integra el Censo 2024 y el Registro Social de Hogares, y la Dimensión 2 (Movilidad y Accesibilidad), "
        "que mapea la infraestructura vial, semafórica y de transporte masivo en Barrio Brasil."
    )

    # =========================================================================
    # SLIDE 16: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 2)
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s16, "Dimensiones de Análisis Territorial (Parte 2: D3, D4 y D5)", 
                       categoria="15. Marco Analítico — Dimensiones Territoriales (3, 4 y 5)",
                       subtitulo="Equipamiento público, infraestructura verde-ambiental y dinámica económica barrial")
    agregar_pie_pagina(s16, 16)

    cards_dim2 = [
        ("D3: Equipamiento y Servicios", [
            ("Salud Primaria (DEIS / MINSAL):", "Georreferenciación de CESFAM, SAPU, postas y farmacias comunitarias con áreas de cobertura."),
            ("Educación (MINEDUC):", "Colegios públicos, particulares subvencionados, liceos emblemáticos y jardines infantiles."),
            ("Cultura y Deporte:", "Sedes vecinales, centros culturales, bibliotecas, multicanchas y recintos IND."),
            ("Equidad Territorial:", "Permite diagnosticar la cobertura y distancia caminable a servicios básicos esenciales.")
        ]),
        ("D4: Medio Ambiente y Confort", [
            ("Áreas Verdes y Arbolado:", "Plazas, parques públicos y arbolado viario mapeado colaborativamente por la comunidad."),
            ("Biodiversidad Biológica (GBIF):", "Registros de flora y fauna urbana validados científicamente bajo estándar Darwin Core."),
            ("Recursos Hídricos y Clima:", "Estaciones meteorológicas DMC, monitoreo DGA y análisis preliminar de islas de calor urbano."),
            ("Calidad de Vida:", "Métricas para evaluar confort térmico, sombra vegetal y sostenibilidad ecológica.")
        ]),
        ("D5: Comercio, Seguridad y Patrimonio", [
            ("Comercio de Barrio:", "Almacenes, ferias libres, locales gastronómicos, talleres y servicios de escala barrial."),
            ("Seguridad Ciudadana:", "Comisarías de Carabineros, cuarteles CBS y equipamiento judicial de proximidad."),
            ("Inversión Pública (BIP):", "Proyectos de inversión pública geocodificados del Banco Integrado de Proyectos (MDSF)."),
            ("Patrimonio Protegido:", "Monumentos históricos (CMN) e inmuebles de conservación histórica del PRC Santiago.")
        ])
    ]
    for i, (titulo_card, items) in enumerate(cards_dim2):
        cx = 0.8 + i * (card_w11 + gap_x11)
        agregar_tarjeta(s16, cx, 1.70, card_w11, 4.95)

        tb_c = s16.shapes.add_textbox(Inches(cx + 0.20), Inches(1.85), Inches(card_w11 - 0.40), Inches(4.65))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

        p = tf_c.paragraphs[0]
        p.text = titulo_card
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(12)

        for subt, txt in items:
            p_sub = tf_c.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(8)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s16,
        "Completamos las cinco dimensiones con la Dimensión 3 (Equipamiento Comunitario), que cubre salud DEIS, educación MINEDUC "
        "y recintos deportivos; la Dimensión 4 (Medio Ambiente y Confort), que integra biodiversidad GBIF y arbolado urbano; "
        "y la Dimensión 5 (Comercio, Seguridad y Patrimonio), que mapea la actividad económica local, seguridad y zonas protegidas por el CMN."
    )

    # =========================================================================
    # SLIDE 17: MARCO METODOLÓGICO: MODELO LINEAL DE RANKING TERRITORIAL
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s17, "Marco Metodológico: Enfoque hacia un Modelo Lineal de Ranking", 
                       categoria="16. Metodología Analítica — Priorización Territorial (OE 2 / Hito 6)",
                       subtitulo="Formulación matemática de Combinación Lineal Ponderada (WLC) multicriterio para Barrio Brasil")
    agregar_pie_pagina(s17, 17)

    # Columna Izquierda: Formulación Matemática
    agregar_tarjeta(s17, 0.8, 1.70, 5.75, 4.95)
    tb_mf_l = s17.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_mf_l = tb_mf_l.text_frame
    tf_mf_l.word_wrap = True
    tf_mf_l.margin_left = tf_mf_l.margin_top = tf_mf_l.margin_right = tf_mf_l.margin_bottom = 0

    p = tf_mf_l.paragraphs[0]
    p.text = "Formulación Matemática del Modelo WLC"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    formula_items = [
        ("Combinación Lineal Ponderada (WLC):", "Índice S_i = Σ (w_j · X_ij), donde w_j representa el peso del criterio j y X_ij el valor normalizado en la unidad territorial i."),
        ("Normalización de Beneficio (↑):", "Para variables donde a mayor valor mayor prioridad: X_norm = (X - X_min) / (X_max - X_min)."),
        ("Normalización de Costo (↓):", "Para variables donde menor valor implica mayor déficit: X_norm = (X_max - X) / (X_max - X_min)."),
        ("Condición de Cierre de Pesos:", "Σ w_j = 1,0 (100%), garantizando comparabilidad y homogeneidad matemática entre dimensiones."),
        ("Aplicación en Barrio Brasil:", "Permite calcular rankings ordinales de vulnerabilidad y cobertura por manzana censal y unidad vecinal.")
    ]
    for subt, txt in formula_items:
        p_sub = tf_mf_l.add_paragraph()
        p_sub.font.name = FONT_NAME
        p_sub.font.size = Pt(11)
        p_sub.space_after = Pt(7)
        r_b = p_sub.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_sub.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Criterios Territoriales
    agregar_tarjeta(s17, 6.783, 1.70, 5.75, 4.95)
    tb_mf_r = s17.shapes.add_textbox(Inches(6.983), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_mf_r = tb_mf_r.text_frame
    tf_mf_r.word_wrap = True
    tf_mf_r.margin_left = tf_mf_r.margin_top = tf_mf_r.margin_right = tf_mf_r.margin_bottom = 0

    p = tf_mf_r.paragraphs[0]
    p.text = "Criterios e Indicadores por Dimensión"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    dim_criteria = [
        ("Criterios de Bienestar Social (D1):", "Porcentaje de hogares vulnerables RSH (Beneficio ↑) y tasa de dependencia senil Censo 2024 (Beneficio ↑)."),
        ("Criterios de Movilidad (D2):", "Distancia a estaciones de Metro (Costo ↓) y densidad de cruces semaforizados UOCT por km lineal de red vial."),
        ("Criterios de Equipamiento (D3):", "Distancia a CESFAM/salud primaria (Costo ↓) y cobertura de áreas verdes accesibles (Beneficio ↑)."),
        ("Criterios Ambientales (D4):", "Índice de cobertura de copa arbórea (Beneficio ↑) y densidad de avistamientos de biodiversidad GBIF."),
        ("Estado de Implementación:", "Metodología formalizada en el informe; geoprocesos de cálculo programados para las semanas 6 y 7 (Hito 6).")
    ]
    for subt, txt in dim_criteria:
        p_sub = tf_mf_r.add_paragraph()
        p_sub.font.name = FONT_NAME
        p_sub.font.size = Pt(11)
        p_sub.space_after = Pt(7)
        r_b = p_sub.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_sub.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s17,
        "Esta lámina expone el marco metodológico hacia el modelo lineal de priorización territorial (WLC) contemplado en el Hito 6. "
        "A diferencia del índice de metacalidad, este modelo evaluará la calidad de vida y el déficit de servicios en el territorio, "
        "normalizando indicadores de beneficio y costo para obtener mapas coropléticos de prioridad a escala de manzana censal."
    )

    # =========================================================================
    # SLIDE 18: RESULTADOS OE 3 — GEOPORTAL ATLAS VGI Y PORTADA MULTIACTOR
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s18, "Resultados OE 3: Geoportal Atlas VGI y Portada Multiactor", 
                       categoria="17. Resultados — Plataforma Web en Producción (OE 3)",
                       subtitulo="Despliegue operativo en Netlify, arquitectura SPA desacoplada y experiencia centrada en usuarios")
    agregar_pie_pagina(s18, 18)

    # Panel Izquierdo: Descripción Técnica
    agregar_tarjeta(s18, 0.8, 1.70, 5.0, 4.95)
    tb_p_l = s18.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(4.6), Inches(4.65))
    tf_p_l = tb_p_l.text_frame
    tf_p_l.word_wrap = True
    tf_p_l.margin_left = tf_p_l.margin_top = tf_p_l.margin_right = tf_p_l.margin_bottom = 0

    p = tf_p_l.paragraphs[0]
    p.text = "Plataforma Web Activa en Producción"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    desc_plat = [
        ("URL de Producción:", "https://atlasvgiuah.netlify.app/ (Despliegue continuo CI/CD desde repositorio GitHub)."),
        ("Arquitectura SPA:", "Single Page Application en JavaScript vanilla (ES6+), sin frameworks pesados ni dependencias propietarias."),
        ("Navegación Multiactor:", "Módulos accesibles mediante barra lateral con diseño responsivo para móviles, tablets y escritorio."),
        ("10 Módulos Operativos:", "Desde el visor cartográfico interactivo (00) hasta el panel de indicadores dimensionales (09)."),
        ("Adelanto Estratégico (80%):", "Programado originalmente para semanas 8 a 10; implementado de manera anticipada.")
    ]
    for subt, txt in desc_plat:
        p_sub = tf_p_l.add_paragraph()
        p_sub.font.name = FONT_NAME
        p_sub.font.size = Pt(11)
        p_sub.space_after = Pt(7)
        r_b = p_sub.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_sub.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    # Panel Derecho: Captura Hero en Vivo (09_atlas_portada_hero.png)
    captura_hero = os.path.join(IMG_DIR, "09_atlas_portada_hero.png")
    agregar_imagen_con_marco(s18, captura_hero, 6.05, 1.70, 6.483, 4.60,
                             pie_fuente="Geoportal Atlas VGI UAH desplegado en Netlify: Portada y accesos por perfiles de usuario (2026).")

    agregar_notas_orador(s18,
        "Presentamos el geoportal web en producción, accesible públicamente en Netlify. "
        "A pesar de que el plan de trabajo contemplaba el visor para las semanas 8 a 10, logramos un adelanto estratégico "
        "del 80% en el OE 3. La portada multiactor permite a cada perfil acceder directamente a las herramientas de su interés."
    )

    # =========================================================================
    # SLIDE 19: RESULTADOS OE 3 — VISOR CARTOGRÁFICO INTERACTIVO (MÓDULO 00)
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s19, "Resultados OE 3: Visor Cartográfico Interactivo (Módulo 00)", 
                       categoria="18. Visor Cartográfico — Funcionalidades SIG (OE 3)",
                       subtitulo="Motor Leaflet 1.9.4, árbol de 118 capas, filtrado espacial e inspector normativo PRC")
    agregar_pie_pagina(s19, 19)

    # Panel Izquierdo: Funcionalidades del Visor
    agregar_tarjeta(s19, 0.8, 1.70, 5.0, 4.95)
    tb_v_l = s19.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(4.6), Inches(4.65))
    tf_v_l = tb_v_l.text_frame
    tf_v_l.word_wrap = True
    tf_v_l.margin_left = tf_v_l.margin_top = tf_v_l.margin_right = tf_v_l.margin_bottom = 0

    p = tf_v_l.paragraphs[0]
    p.text = "Módulo 00: Visor e Inspector PRC"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    func_visor = [
        ("Árbol de 118 Capas:", "Organizado en acordeones jerárquicos: 8 grupos temáticos oficiales más las 10 macrocategorías VGI."),
        ("Inspector Normativo PRC:", "Al hacer clic en cualquier punto de Barrio Brasil, cruza coordenadas con las 192 zonas del Plan Regulador Comunal de Santiago."),
        ("Parámetros Urbanísticos:", "Despliega constructibilidad máxima, altura permitida, usos de suelo y coeficientes de ocupación."),
        ("Filtros Espaciales Dinámicos:", "Filtrado por Unidad Vecinal, búsqueda semántica de capas y selector de mapas base OSM/Carto/Satélite."),
        ("Medición e Interacción:", "Herramientas de regla métrica, cálculo de áreas poligonales e información geográfica emergente (popups).")
    ]
    for subt, txt in func_visor:
        p_sub = tf_v_l.add_paragraph()
        p_sub.font.name = FONT_NAME
        p_sub.font.size = Pt(11)
        p_sub.space_after = Pt(7)
        r_b = p_sub.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_sub.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    # Panel Derecho: Captura del Visor (01_visor_cartografico.png)
    captura_vis = os.path.join(IMG_DIR, "01_visor_cartografico.png")
    agregar_imagen_con_marco(s19, captura_vis, 6.05, 1.70, 6.483, 4.60,
                             pie_fuente="Módulo 00 en producción: Visor Leaflet con capas activas e Inspector Normativo PRC Santiago (2026).")

    agregar_notas_orador(s19,
        "El Módulo 00 es el corazón cartográfico del Atlas. Soporta la superposición de las 118 capas con controles independientes "
        "de opacidad y simbología. Una funcionalidad destacada es el Inspector Normativo, que permite hacer clic en cualquier predio "
        "y consultar la zona del Plan Regulador Comunal de Santiago con sus normas urbanísticas vigentes."
    )

    # =========================================================================
    # SLIDE 20: RESULTADOS OE 3 — MÓDULOS EN VIVO (1/3): APIS Y DATOS ABIERTOS
    # =========================================================================
    s20 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s20, "Módulos Especializados en Vivo (1/3): APIs y Datos Abiertos", 
                       categoria="19. Módulos del Geoportal en Producción (1/3)",
                       subtitulo="Interacción en tiempo real con Overpass QL, calidad ohsome y biodiversidad GBIF Darwin Core")
    agregar_pie_pagina(s20, 20)

    mods_1 = [
        ("Módulo 01: Overpass QL", "Constructor de consultas sintácticas en vivo hacia la API de OpenStreetMap para extraer nodos, vías y relaciones.", "04_explorador_overpass.png"),
        ("Módulo 02: Calidad ohsome", "Conexión a la API de la Universidad de Heidelberg para auditar métricas históricas de edición y completitud en OSM.", "05_calidad_ohsome.png"),
        ("Módulo 03: Biodiversidad GBIF", "Extracción en tiempo real de observaciones biológicas georreferenciadas bajo el estándar Darwin Core.", "06_biodiversidad_gbif.png")
    ]
    card_m_w16 = 3.75
    gap_m16 = 0.24
    for mi, (mt, md, mimg) in enumerate(mods_1):
        mx = 0.8 + mi * (card_m_w16 + gap_m16)
        agregar_tarjeta(s20, mx, 1.70, card_m_w16, 4.95)
        
        tb_m = s20.shapes.add_textbox(Inches(mx + 0.15), Inches(1.80), Inches(card_m_w16 - 0.30), Inches(0.95))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p = tf_m.paragraphs[0]
        p.text = mt
        p.font.name = FONT_NAME
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(2)
        p2 = tf_m.add_paragraph()
        p2.text = md
        p2.font.name = FONT_NAME
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_NEGRO

        # Imagen con marco
        img_p = os.path.join(IMG_DIR, mimg)
        agregar_imagen_con_marco(s20, img_p, mx + 0.15, 2.80, 3.45, 3.30,
                                 pie_fuente=f"Captura en vivo: {mt.split(':')[0]}.")

    agregar_notas_orador(s20,
        "El geoportal cuenta con 10 módulos funcionales. En esta lámina vemos los módulos 01, 02 y 03, que conectan con APIs externas en vivo. "
        "El Módulo 01 permite construir y ejecutar consultas sintácticas en Overpass QL hacia OpenStreetMap; el Módulo 02 evalúa la calidad "
        "intrínseca mediante ohsome de la Universidad de Heidelberg; y el Módulo 03 extrae en vivo las observaciones de biodiversidad biológica "
        "desde GBIF bajo el estándar Darwin Core."
    )

    # =========================================================================
    # SLIDE 21: RESULTADOS OE 3 — MÓDULOS EN VIVO (2/3): METADATOS, DICCIONARIO E INDICADORES
    # =========================================================================
    s21 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s21, "Módulos Especializados en Vivo (2/3): Metadatos, Diccionario e Indicadores", 
                       categoria="20. Módulos del Geoportal en Producción (2/3)",
                       subtitulo="Interoperabilidad ISO 19115, catálogo territorial y panel de análisis dimensional")
    agregar_pie_pagina(s21, 21)

    mods_2 = [
        ("Módulo 05: Metadatos ISO 19115", "Generador y exportador de fichas XML ISO 19139 conforme al perfil nacional IDE Chile / SNIT v2.0.", "03_metadatos_iso.png"),
        ("Módulo 06: Diccionario (134)", "Catálogo exhaustivo de 134 descriptores territoriales, documentando 48 oficiales vs 86 brechas VGI.", "07_diccionario_territorial.png"),
        ("Módulo 09: Indicadores & Dimensiones", "Panel de análisis dimensional interactivo estructurado en las 5 dimensiones estratégicas.", "02_indicadores_dimensiones.png")
    ]
    for mi, (mt, md, mimg) in enumerate(mods_2):
        mx = 0.8 + mi * (card_m_w16 + gap_m16)
        agregar_tarjeta(s21, mx, 1.70, card_m_w16, 4.95)
        
        tb_m = s21.shapes.add_textbox(Inches(mx + 0.15), Inches(1.80), Inches(card_m_w16 - 0.30), Inches(0.95))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p = tf_m.paragraphs[0]
        p.text = mt
        p.font.name = FONT_NAME
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(2)
        p2 = tf_m.add_paragraph()
        p2.text = md
        p2.font.name = FONT_NAME
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_NEGRO

        # Imagen con marco
        img_p = os.path.join(IMG_DIR, mimg)
        agregar_imagen_con_marco(s21, img_p, mx + 0.15, 2.80, 3.45, 3.30,
                                 pie_fuente=f"Captura en vivo: {mt.split(':')[0]}.")

    agregar_notas_orador(s21,
        "En esta lámina presentamos los módulos 05, 06 y 09. El Módulo 05 es clave para la interoperabilidad institucional, ya que genera "
        "archivos XML de metadatos bajo las normas ISO 19115 e ISO 19139 compatibles con GeoNetwork y el SNIT de Chile. El Módulo 06 despliega "
        "el diccionario de 134 descriptores; y el Módulo 09 aloja la estructura de las cinco dimensiones de análisis territorial que vimos anteriormente."
    )

    # =========================================================================
    # SLIDE 22: RESULTADOS OE 3 — MÓDULOS EN VIVO (3/3): CARTOGRAFÍA, CATÁLOGOS Y MANUAL
    # =========================================================================
    s22 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s22, "Módulos Especializados en Vivo (3/3): Cartografía, Catálogos y Manual", 
                       categoria="21. Módulos del Geoportal en Producción (3/3)",
                       subtitulo="Cartografía colaborativa uMap, descarga de catálogos Excel y manual de uso interactivo")
    agregar_pie_pagina(s22, 22)

    # Columna Izquierda: Tarjetas de los módulos 04, 07 y 08
    agregar_tarjeta(s22, 0.8, 1.70, 5.75, 4.95)
    tb_m3 = s22.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_m3 = tb_m3.text_frame
    tf_m3.word_wrap = True
    tf_m3.margin_left = tf_m3.margin_top = tf_m3.margin_right = tf_m3.margin_bottom = 0

    p = tf_m3.paragraphs[0]
    p.text = "Herramientas de Transferencia y Documentación"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    mods_3_desc = [
        ("Módulo 04: Cartografía Colaborativa uMap", "Integrador de mapas temáticos libres que permite a la comunidad exportar capas en GeoJSON y visualizarlas en entornos colaborativos uMap."),
        ("Módulo 07: Catálogos y Licencias de Descarga", "Centro de descargas con enlaces directos a las 118 capas auditadas, tablas de metadatos en formato Excel (.xlsx) y licencias abiertas (ODbL, CC-BY)."),
        ("Módulo 08: Manual de Uso y Gobernanza", "Guía interactiva paso a paso con documentación metodológica para vecinos, estudiantes y académicos de Geografía UAH."),
        ("Transferibilidad Institucional:", "Garantiza que el proyecto funcione de manera autónoma, auditable y con pleno acceso público a los datos.")
    ]
    for subt, txt in mods_3_desc:
        p_sub = tf_m3.add_paragraph()
        p_sub.font.name = FONT_NAME
        p_sub.font.size = Pt(11)
        p_sub.space_after = Pt(7)
        r_b = p_sub.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_sub.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Captura de Documentación y Manual (08_manual_documentacion.png)
    captura_man = os.path.join(IMG_DIR, "08_manual_documentacion.png")
    agregar_imagen_con_marco(s22, captura_man, 6.783, 1.70, 5.75, 4.60,
                             pie_fuente="Módulo 08 en producción: Manual metodológico interactivo y guías de uso del Atlas VGI (2026).")

    agregar_notas_orador(s22,
        "Completamos la revisión de los 10 módulos con uMap (04), los catálogos y licencias descargables (07) y el manual interactivo (08). "
        "Estos módulos aseguran la apropiación social del conocimiento cartográfico, facilitando que vecinos e investigadores "
        "puedan descargar los datos con sus metadatos y utilizar la plataforma con guías claras paso a paso."
    )

    # =========================================================================
    # SLIDE 23: ARQUITECTURA TÉCNICA Y GOBERNANZA ($0 COSTO)
    # =========================================================================
    s23 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s23, "Arquitectura Técnica, Repositorio y Gobernanza a Costo $0", 
                       categoria="22. Infraestructura y Repositorio Tecnológico",
                       subtitulo="Estrategia Client-Side First, triple failover resiliente y control de versiones en GitHub")
    agregar_pie_pagina(s23, 23)

    # Panel Izquierdo: Componentes del Stack
    agregar_tarjeta(s23, 0.8, 1.70, 5.75, 4.95)
    tb_arq = s23.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.35), Inches(4.65))
    tf_arq = tb_arq.text_frame
    tf_arq.word_wrap = True
    tf_arq.margin_left = tf_arq.margin_top = tf_arq.margin_right = tf_arq.margin_bottom = 0

    p = tf_arq.paragraphs[0]
    p.text = "Stack Tecnológico e Infraestructura Nube"
    p.font.name = FONT_NAME
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    stack_items = [
        ("Frontend Serverless:", "SPA vanilla JavaScript (ES6+), Leaflet 1.9.4 y Tailwind CSS compilado. Cero costos de servidores dedicados."),
        ("Base Espacial en la Nube:", "PostgreSQL 17 + PostGIS 3.3 alojado en Supabase Cloud con índices espaciales GIST."),
        ("Arquitectura Triple Failover:", "1° PostGIS RPC en vivo → 2° Supabase CDN Storage → 3° Fallback GeoJSON local."),
        ("Despliegue Continuo (CI/CD):", "Netlify conectado a la rama main de GitHub. Compilación y publicación automática ante cada commit."),
        ("Gobernanza y Costo $0:", "Infraestructura completamente financiable sin costos mensuales recurrentes para la universidad.")
    ]
    for subt, txt in stack_items:
        p_sub = tf_arq.add_paragraph()
        p_sub.font.name = FONT_NAME
        p_sub.font.size = Pt(11)
        p_sub.space_after = Pt(7)
        r_b = p_sub.add_run()
        r_b.text = f"• {subt} "
        r_b.font.bold = True
        r_b.font.color.rgb = COLOR_AZUL_SEC
        r_t = p_sub.add_run()
        r_t.text = txt
        r_t.font.color.rgb = COLOR_NEGRO

    # Panel Derecho: 2 Capturas de GitHub (Repositorio y Commits)
    captura_gh = os.path.join(IMG_DIR, "10_github_repositorio.png")
    captura_commits = os.path.join(IMG_DIR, "11_github_commits.png")

    agregar_imagen_con_marco(s23, captura_gh, 6.783, 1.70, 5.75, 2.05,
                             pie_fuente="Repositorio abierto en GitHub: atlas_vgi_uah (GEOJOTA).")

    agregar_imagen_con_marco(s23, captura_commits, 6.783, 4.30, 5.75, 2.05,
                             pie_fuente="Historial de commits y despliegue continuo en producción (Netlify CI/CD).")

    agregar_notas_orador(s23,
        "La arquitectura técnica fue diseñada bajo la premisa de costo cero recurrente y máxima resiliencia. "
        "El visor implementa un mecanismo de triple contingencia: si la base PostGIS en la nube no responde, consulta "
        "la CDN de almacenamiento, y si esta falla, recurre a archivos GeoJSON locales empaquetados. "
        "Todo el código está bajo control de versiones en GitHub con integración continua."
    )

    # =========================================================================
    # SLIDE 24: SÍNTESIS DE PRODUCTOS ENTREGADOS A LAS 150 HORAS
    # =========================================================================
    s24 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s24, "Síntesis de Productos Entregados (Corte 150 Horas)", 
                       categoria="23. Entregables Concluidos y Balance",
                       subtitulo="Consolidación de entregables formales de Hitos 1 a 5 y adelanto del geoportal web")
    agregar_pie_pagina(s24, 24)

    entregables = [
        ("Entregable OE 1: Arquitectura Conceptual y Taxonomía VGI", "Documento metodológico formal de 61 páginas", [
            "• Ficha Territorial oficial de Barrio Brasil (223,75 ha) con justificación socioespacial.",
            "• Taxonomía completa de 10 macrocategorías VGI (CAT-01 a CAT-10) adaptadas a OpenStreetMap.",
            "• Matriz de 4 perfiles territoriales bajo estándar de Diseño Centrado en el Usuario (ISO 9241-210)."
        ]),
        ("Entregable OE 2 (Parte 1): Geodatabase de 118 Capas", "Geodatabase espacial consolidada en PostGIS 17 y GeoJSON", [
            "• 118 capas vectoriales normalizadas en CRS EPSG:4326 y EPSG:32719, totalizando 2,56 GB.",
            "• 108 capas oficiales del Estado (Censo 2024, PRC Santiago, UOCT, RSH, MINVU, BIP, DEIS).",
            "• 10 capas comunitarias VGI (Geofabrik RM y Barrio Brasil con 1.552.000+ geometrías)."
        ]),
        ("Entregable OE 2 (Parte 2): Auditoría de MetaCalidad ISO 19157", "Matriz JSON / XLSX y reporte técnico de metadatos", [
            "• Modelo lineal ponderado WLC v2.0 (10 dimensiones) que certifica un 97,88% de metacalidad (Grado A+).",
            "• 100% de geometrías vectoriales reparadas y validadas algorítmicamente en PostGIS (0 errores fatales).",
            "• Inyección universal de 14 atributos normalizados de metadatos ISO en todos los archivos descargables."
        ]),
        ("Entregable OE 3 (Anticipado): Geoportal Atlas VGI en Producción", "Plataforma web activa (https://atlasvgiuah.netlify.app/)", [
            "• 10 módulos funcionales operativos con visor interactivo Leaflet 1.9.4 e inspector normativo PRC.",
            "• Conexión en tiempo real a APIs externas (Overpass QL, ohsome v1/v2 y GBIF Darwin Core).",
            "• Generador de metadatos XML ISO 19139 conforme al perfil nacional IDE Chile / SNIT v2.0."
        ])
    ]
    card_ent_w = 5.75
    card_ent_h = 2.30
    gap_ent_x = 0.233
    gap_ent_y = 0.20
    for idx, (ent_tit, ent_meta, ent_bullets) in enumerate(entregables):
        col_i = idx % 2
        row_i = idx // 2
        ex = 0.8 + col_i * (card_ent_w + gap_ent_x)
        ey = 1.70 + row_i * (card_ent_h + gap_ent_y)

        agregar_tarjeta(s24, ex, ey, card_ent_w, card_ent_h)

        tb_e = s24.shapes.add_textbox(Inches(ex + 0.15), Inches(ey + 0.10), Inches(card_ent_w - 0.30), Inches(card_ent_h - 0.20))
        tf_e = tb_e.text_frame
        tf_e.word_wrap = True
        tf_e.margin_left = tf_e.margin_top = tf_e.margin_right = tf_e.margin_bottom = 0

        p = tf_e.paragraphs[0]
        p.text = ent_tit
        p.font.name = FONT_NAME
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH

        p_m = tf_e.add_paragraph()
        p_m.text = ent_meta
        p_m.font.name = FONT_NAME
        p_m.font.size = Pt(10.5)
        p_m.font.italic = True
        p_m.font.color.rgb = COLOR_AZUL_SEC
        p_m.space_after = Pt(3)

        for b in ent_bullets:
            p_b = tf_e.add_paragraph()
            p_b.text = b
            p_b.font.name = FONT_NAME
            p_b.font.size = Pt(10)
            p_b.font.color.rgb = COLOR_NEGRO
            p_b.space_after = Pt(1)

    agregar_notas_orador(s24,
        "En resumen, al llegar al corte de 150 horas se han cerrado satisfactoriamente cuatro entregables clave: "
        "el informe conceptual del OE 1, la geodatabase de 118 capas con 2,56 GB, el certificado universal de metacalidad ISO 19157 (97,88%) "
        "con inyección universal de metadatos, y el geoportal web completamente desplegado y operativo en la nube."
    )

    # =========================================================================
    # SLIDE 25: PLAN DE TRABAJO SEGUNDA MITAD (SEMANAS 6 A 11 / 150 HRS RESTANTES)
    # =========================================================================
    s25 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s25, "Plan de Trabajo para la Segunda Mitad (150 Horas Restantes)", 
                       categoria="24. Proyección y Próximos Pasos",
                       subtitulo="Hitos 6 a 10 · Semanas 6 a 11 (08 de octubre al 12 de noviembre de 2026)")
    agregar_pie_pagina(s25, 25)

    # 4 Tarjetas horizontales de fases restantes
    fases_rest = [
        ("Semanas 6–7 (08 al 16 Oct)", "Hito 6: Formulación de Cruces Espaciales y Cobertura Barrial", [
            "• Geoprocesos de proximidad a equipamientos críticos (salud DEIS, Metro L1/L2/L5, áreas verdes).",
            "• Cálculo de densidades y accesibilidad peatonal a escala de Manzana Censal 2024 y Unidad Vecinal.",
            "• Calibración preliminar de indicadores en las 5 dimensiones analíticas para el diagnóstico barrial."
        ]),
        ("Semanas 8–9 (19 al 30 Oct)", "Hitos 7 y 8: Refinamiento Cartográfico y Consolidación del Atlas", [
            "• Fortalecimiento de la simbología cartográfica e interoperabilidad del visor Leaflet con filtros avanzados.",
            "• Incorporación de exportador de reportes PDF sintéticos por Unidad Vecinal con indicadores clave.",
            "• Consolidación final de la base PostGIS y revisión exhaustiva de consistencia topológica."
        ]),
        ("Semana 10 (02 al 06 Nov)", "Hito 9: Validación Empírica con Usuarios (4 Perfiles DCU)", [
            "• Pruebas de usabilidad guiadas a los 4 perfiles territoriales (municipio, vecinos, mapeadores, academia).",
            "• Recolección sistemática de feedback, tasas de éxito en búsqueda de capas y mejoras de interfaz.",
            "• Evaluación estructurada bajo norma ISO 9241-11 (efectividad, eficiencia y satisfacción percibida)."
        ]),
        ("Semana 11 (09 al 12 Nov)", "Hito 10: Manuales de Transferibilidad, Informe Final y Titulación", [
            "• Redacción del Manual Metodológico para el Departamento de Geografía UAH y Proyecto Fondecyt F1261256.",
            "• Guía de administración, actualización de datos con scripts Python y mantenimiento a costo $0.",
            "• Elaboración y entrega del Informe Final de Práctica Profesional y preparación del examen de título."
        ])
    ]
    card_fut_h = 1.05
    gap_fut_y = 0.15
    top_base_fut = 1.75
    for idx, (f_tiempo, f_titulo, f_bullets) in enumerate(fases_rest):
        fy = top_base_fut + idx * (card_fut_h + gap_fut_y)
        agregar_tarjeta(s25, 0.8, fy, 11.733, card_fut_h)

        tb_f = s25.shapes.add_textbox(Inches(1.0), Inches(fy + 0.10), Inches(11.333), Inches(card_fut_h - 0.20))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0

        p = tf_f.paragraphs[0]
        r1 = p.add_run()
        r1.text = f"{f_tiempo}   "
        r1.font.name = FONT_NAME
        r1.font.size = Pt(11)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC

        r2 = p.add_run()
        r2.text = f"• {f_titulo}"
        r2.font.name = FONT_NAME
        r2.font.size = Pt(12)
        r2.font.bold = True
        r2.font.color.rgb = COLOR_AZUL_UAH

        for b in f_bullets:
            p_b = tf_f.add_paragraph()
            p_b.text = b
            p_b.font.name = FONT_NAME
            p_b.font.size = Pt(10.5)
            p_b.font.color.rgb = COLOR_NEGRO
            p_b.space_before = Pt(1)

    agregar_notas_orador(s25,
        "Para las segundas 150 horas, la planificación aborda los hitos 6 al 10. En las semanas 6 y 7 calcularemos los cruces "
        "espaciales y el modelo lineal en Barrio Brasil. En las semanas 8 y 9 refinaremos la cartografía del Atlas; "
        "en la semana 10 realizaremos la validación empírica con usuarios reales; y en la semana 11 consolidaremos los manuales "
        "y el informe final de titulación."
    )

    # =========================================================================
    # SLIDE 26: CONCLUSIONES Y CIERRE FORMAL
    # =========================================================================
    s26 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s26, "Conclusiones Principales y Discusión Crítica", 
                       categoria="25. Conclusiones y Discusión",
                       subtitulo="Balance del estado de avance al 50%, lecciones aprendidas y aporte a la Geografía urbana")
    agregar_pie_pagina(s26, 26)

    cards_conc = [
        ("1. Cumplimiento Metodológico Riguroso", [
            ("Ejecución según Carta Gantt:", "Cumplimiento del 50% de horas planificadas (150/300 hrs) con los hitos 1 a 5 formalmente cerrados."),
            ("Adelanto Estratégico del Visor:", "El geoportal web se encuentra desplegado y funcional con 3 semanas de anticipación sobre el cronograma."),
            ("Calidad Espacial Certificada:", "Modelo WLC v2.0 auditado al 97,88% bajo ISO 19157 y 100% de geometrías reparadas en PostGIS.")
        ]),
        ("2. Aporte Teórico y Práctico", [
            ("Integración VGI + Datos Oficiales:", "Demostración de que la VGI puede subsanar brechas críticas de información estatal sin perder rigor."),
            ("Escala Microterritorial:", "Operatividad a nivel de Manzana Censal 2024 y Unidad Vecinal en Barrio Brasil, superando análisis agregados."),
            ("Interoperabilidad de Estándares:", "Cumplimiento estricto de normas ISO 19115, ISO 19139, ISO 19157 e IDE Chile / SNIT.")
        ]),
        ("3. Sostenibilidad y Transferibilidad", [
            ("Costo Cero Recurrente ($0):", "Arquitectura serverless en Netlify y Supabase que garantiza continuidad operativa sin costos para la UAH."),
            ("Apropiación Social:", "Herramienta que democratiza el acceso a la información territorial para dirigentes vecinales y la comunidad."),
            ("Proyección a Titulación:", "Sólida base empírica para la memoria de titulación y transferibilidad directa al Fondecyt F1261256.")
        ])
    ]
    card_w22 = 3.75
    gap_x22 = 0.24
    for i, (titulo_card, items) in enumerate(cards_conc):
        cx = 0.8 + i * (card_w22 + gap_x22)
        agregar_tarjeta(s26, cx, 1.70, card_w22, 4.95)

        tb_c = s26.shapes.add_textbox(Inches(cx + 0.20), Inches(1.85), Inches(card_w22 - 0.40), Inches(4.65))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

        p = tf_c.paragraphs[0]
        p.text = titulo_card
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(12)

        for subt, txt in items:
            p_sub = tf_c.add_paragraph()
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11)
            p_sub.space_after = Pt(8)
            
            r_b = p_sub.add_run()
            r_b.text = f"• {subt} "
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_AZUL_SEC
            
            r_t = p_sub.add_run()
            r_t.text = txt
            r_t.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s26,
        "En conclusión, el estado de avance a las 150 horas evidencia un proyecto consolidado, con sus objetivos metodológicos cumplidos "
        "y un geoportal en producción que anticipa con creces los requerimientos del plan. "
        "Agradezco al profesor Manuel Fuenzalida, al coordinador Alejandro Cortés y a la comisión por su atención, y quedo disponible para sus preguntas."
    )

    prs.save(OUTPUT_PPTX)
    print(f"✅ Presentación generada exitosamente en: {OUTPUT_PPTX}")
    print(f"📊 Total de diapositivas: {len(prs.slides)}")

if __name__ == "__main__":
    crear_presentacion()
