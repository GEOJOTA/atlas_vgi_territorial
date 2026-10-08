#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_ppt_estado_avance_blanco.py
===================================
Generador de la presentación formal de Estado de Avance (150 Horas / Hitos 1 a 5)
para la Práctica Profesional de Geografía - Universidad Alberto Hurtado (UAH).

Diseño y Restricciones Estrictas:
- Fondo Blanco (#FFFFFF) en formato 16:9 widescreen estándar (13.33 x 7.50 pulgadas).
- Paleta sobria institucional: Sólo NEGRO (#111827 / #000000) y AZUL (#003366 / #0F4C81), fondos blancos.
- Tipografía Calibri estandarizada:
  * Títulos: Calibri 22pt Bold, Azul (#003366).
  * Subtítulos: Calibri 12-13pt, Regular/Bold.
  * Cuerpo / Tablas: Calibri 10.5-11.5pt Regular, Negro (#111827).
  * Pies de figura / Fuentes: Calibri 9-9.5pt Regular/Cursiva, Gris (#64748B).
- Capturas reales, auténticas y naturales del geoportal en producción y de GitHub.
- Sin storyboards individuales, pero con el concepto de análisis socioterritorial y sus 5 dimensiones.
- Sin fórmulas rígidas del índice sintético, pero contemplando el desarrollo de un modelo lineal / ranking multicriterio.
- Guiones de presentación (Speaker Notes) para cada diapositiva.
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

# Rutas
BASE_DIR = "/Users/geojplescano/Programas/Práctica profesional 2026 S2"
REPO_DIR = os.path.join(BASE_DIR, "nodo-geoabierto")
IMG_DIR = os.path.join(BASE_DIR, "assets", "capturas_ppt")
LOGO_UAH = os.path.join(REPO_DIR, "src", "img", "UAH-Insignia.jpg")
OUTPUT_PPTX = os.path.join(BASE_DIR, "Estado_Avance_Atlas_VGI_UAH.pptx")

# Paleta Estricta (Solo Blanco, Negro y Azul + Grises neutros de apoyo)
COLOR_BLANCO = RGBColor(255, 255, 255)
COLOR_NEGRO = RGBColor(17, 24, 39)        # Carbón oscuro legible
COLOR_AZUL_UAH = RGBColor(0, 51, 102)     # Azul marino institucional UAH #003366
COLOR_AZUL_SEC = RGBColor(15, 76, 129)    # Azul secundario #0F4C81
COLOR_AZUL_CLARO = RGBColor(235, 242, 250)# Fondo tenue de realce
COLOR_GRIS_BORDE = RGBColor(203, 213, 225)# Borde sutil #CBD5E1
COLOR_GRIS_TEXTO = RGBColor(100, 116, 139)# Texto secundario #64748B
COLOR_GRIS_FONDO = RGBColor(248, 250, 252)# Fondo neutro muy suave

FONT_NAME = "Calibri"

def set_cell_border(cell, color_hex="CBD5E1", width="10000"):
    """Aplica bordes finos a una celda de tabla."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    for border_name in ['lnL', 'lnR', 'lnT', 'lnB']:
        ln = parse_xml(f'<a:{border_name} {nsdecls("a")} w="{width}" cmpd="s"><a:solidFill><a:srgbClr val="{color_hex}"/></a:solidFill></a:{border_name}>')
        tcPr.append(ln)

def crear_presentacion():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.500)
    blank_layout = prs.slide_layouts[6] # Layout en blanco

    total_slides = 20

    def aplicar_fondo_blanco(slide):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = COLOR_BLANCO

    def agregar_encabezado(slide, titulo, categoria="DEPARTAMENTO DE GEOGRAFÍA · UNIVERSIDAD ALBERTO HURTADO", subtitulo=None):
        aplicar_fondo_blanco(slide)
        
        # Barra superior decorativa sutil
        linea_sup = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.04))
        linea_sup.fill.solid()
        linea_sup.fill.fore_color.rgb = COLOR_AZUL_UAH
        linea_sup.line.fill.background()

        # Cuadro de texto de encabezado
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.48), Inches(11.733), Inches(0.95))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Categoría
        p_cat = tf.paragraphs[0]
        p_cat.text = categoria.upper()
        p_cat.font.name = FONT_NAME
        p_cat.font.size = Pt(9.5)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_AZUL_SEC
        p_cat.space_after = Pt(2)

        # Título
        p_tit = tf.add_paragraph()
        p_tit.text = titulo
        p_tit.font.name = FONT_NAME
        p_tit.font.size = Pt(22)
        p_tit.font.bold = True
        p_tit.font.color.rgb = COLOR_AZUL_UAH
        
        if subtitulo:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitulo
            p_sub.font.name = FONT_NAME
            p_sub.font.size = Pt(11.5)
            p_sub.font.color.rgb = COLOR_GRIS_TEXTO
            p_sub.space_before = Pt(2)

    def agregar_pie_pagina(slide, num_slide):
        # Línea divisoria inferior fina
        linea_inf = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.015))
        linea_inf.fill.solid()
        linea_inf.fill.fore_color.rgb = COLOR_GRIS_BORDE
        linea_inf.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.98), Inches(11.733), Inches(0.35))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = "Atlas de Información Geográfica Voluntaria para la Gestión Territorial — Estado de Avance 150 Horas"
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.color.rgb = COLOR_GRIS_TEXTO

        # Número de lámina
        tb_num = slide.shapes.add_textbox(Inches(10.5), Inches(6.98), Inches(2.033), Inches(0.35))
        tf_num = tb_num.text_frame
        tf_num.word_wrap = True
        tf_num.margin_left = tf_num.margin_top = tf_num.margin_right = tf_num.margin_bottom = 0
        p_num = tf_num.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.text = f"Lámina {num_slide} de {total_slides}"
        p_num.font.name = FONT_NAME
        p_num.font.size = Pt(9.5)
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
            # Marco sutil
            marco = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
            marco.fill.background()
            marco.line.color.rgb = COLOR_GRIS_BORDE
            marco.line.width = Pt(1)
            
            # Pie de fuente
            tb = slide.shapes.add_textbox(Inches(left), Inches(top + height + 0.04), Inches(width), Inches(0.25))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = pie_fuente
            p.font.name = FONT_NAME
            p.font.size = Pt(8.5)
            p.font.italic = True
            p.font.color.rgb = COLOR_GRIS_TEXTO
            return pic
        else:
            # Fallback en caso de no hallar la imagen
            box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
            p = box.text_frame.paragraphs[0]
            p.text = f"[Captura no encontrada: {os.path.basename(img_path)}]"
            return None

    def agregar_notas_orador(slide, texto_guion):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = texto_guion

    # =========================================================================
    # SLIDE 1: PORTADA FORMAL Y ESTANDARIZADA
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    aplicar_fondo_blanco(s1)

    # Franja azul superior elegante
    franja_sup = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.6), Inches(11.733), Inches(0.08))
    franja_sup.fill.solid()
    franja_sup.fill.fore_color.rgb = COLOR_AZUL_UAH
    franja_sup.line.fill.background()

    # Logo UAH a la izquierda
    if os.path.exists(LOGO_UAH):
        s1.shapes.add_picture(LOGO_UAH, Inches(0.8), Inches(1.1), Inches(1.4), Inches(1.4))

    # Membrete institucional
    tb_inst = s1.shapes.add_textbox(Inches(2.45), Inches(1.1), Inches(10.0), Inches(0.8))
    tf_inst = tb_inst.text_frame
    tf_inst.word_wrap = True
    tf_inst.margin_left = tf_inst.margin_top = tf_inst.margin_right = tf_inst.margin_bottom = 0
    p = tf_inst.paragraphs[0]
    p.text = "UNIVERSIDAD ALBERTO HURTADO · FACULTAD DE CIENCIAS SOCIALES"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH

    p2 = tf_inst.add_paragraph()
    p2.text = "DEPARTAMENTO DE GEOGRAFÍA · PRÁCTICA PROFESIONAL 2026 S2"
    p2.font.name = FONT_NAME
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_GRIS_TEXTO

    p3 = tf_inst.add_paragraph()
    p3.text = "Proyecto Fondecyt Regular F1261256 (ANID) — 'Información Geográfica Voluntaria y Gestión Territorial'"
    p3.font.name = FONT_NAME
    p3.font.size = Pt(9.5)
    p3.font.italic = True
    p3.font.color.rgb = COLOR_AZUL_SEC

    # Título principal del proyecto
    tb_tit = s1.shapes.add_textbox(Inches(0.8), Inches(2.7), Inches(11.733), Inches(1.8))
    tf_tit = tb_tit.text_frame
    tf_tit.word_wrap = True
    tf_tit.margin_left = tf_tit.margin_top = tf_tit.margin_right = tf_tit.margin_bottom = 0

    p_t1 = tf_tit.paragraphs[0]
    p_t1.text = "Atlas de Información Geográfica Voluntaria\npara la Gestión Territorial"
    p_t1.font.name = FONT_NAME
    p_t1.font.size = Pt(32)
    p_t1.font.bold = True
    p_t1.font.color.rgb = COLOR_AZUL_UAH
    p_t1.space_after = Pt(8)

    p_sub = tf_tit.add_paragraph()
    p_sub.text = "INFORME DE ESTADO DE AVANCE — 150 HORAS CUMPLIDAS (HITOS 1 A 5)"
    p_sub.font.name = FONT_NAME
    p_sub.font.size = Pt(14)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_NEGRO

    # Ficha de antecedentes formales en recuadro sobrio
    card_ficha = agregar_tarjeta(s1, 0.8, 4.65, 11.733, 1.85, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_GRIS_BORDE)
    tb_ficha = s1.shapes.add_textbox(Inches(1.1), Inches(4.8), Inches(11.133), Inches(1.55))
    tf_ficha = tb_ficha.text_frame
    tf_ficha.word_wrap = True
    tf_ficha.margin_left = tf_ficha.margin_top = tf_ficha.margin_right = tf_ficha.margin_bottom = 0

    p_f1 = tf_ficha.paragraphs[0]
    p_f1.text = "ANTECEDENTES DEL PROYECTO DE PRÁCTICA PROFESIONAL:"
    p_f1.font.name = FONT_NAME
    p_f1.font.size = Pt(10)
    p_f1.font.bold = True
    p_f1.font.color.rgb = COLOR_AZUL_UAH
    p_f1.space_after = Pt(4)

    lineas_ficha = [
        ("Estudiante en Práctica:", "Juan Pablo Lescano Villegas (GEOJOTA) — Carrera de Geografía UAH"),
        ("Profesor Guía e Investigador:", "Dr. Manuel Fuenzalida — Investigador Responsable Fondecyt F1261256 (mfuenzal@uahurtado.cl)"),
        ("Encargada de Prácticas:", "Irene Muñoz Vilches — Coordinación de Prácticas Departamento de Geografía UAH"),
        ("Territorio Piloto y Caso de Estudio:", "Barrio Brasil y Campus Central UAH, Comuna de Santiago, Región Metropolitana"),
        ("Período de Ejecución y Corte:", "01 de septiembre al 12 de noviembre de 2026 (300 hrs totales) · Corte 150 hrs: Miércoles 07 de octubre de 2026")
    ]
    for eti, val in lineas_ficha:
        p_item = tf_ficha.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(1)
        r1 = p_item.add_run()
        r1.text = f"• {eti} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_NEGRO
        r2 = p_item.add_run()
        r2.text = val
        r2.font.color.rgb = COLOR_NEGRO

    # Enlace web al pie
    tb_url = s1.shapes.add_textbox(Inches(0.8), Inches(6.75), Inches(11.733), Inches(0.35))
    tf_url = tb_url.text_frame
    p_url = tf_url.paragraphs[0]
    p_url.text = "Plataforma en producción: https://atlasvgiuah.netlify.app/  |  Repositorio: github.com/GEOJOTA/atlas_vgi_uah"
    p_url.font.name = FONT_NAME
    p_url.font.size = Pt(9.5)
    p_url.font.bold = True
    p_url.font.color.rgb = COLOR_AZUL_SEC

    agregar_notas_orador(s1, 
        "Buenos días profesores de la comisión evaluadora. Mi nombre es Juan Pablo Lescano Villegas y a continuación presento "
        "el informe de estado de avance correspondiente a las 150 horas de práctica profesional en el marco del proyecto Fondecyt "
        "Regular F1261256, dirigido por el profesor Manuel Fuenzalida en el Departamento de Geografía de la Universidad Alberto Hurtado. "
        "El proyecto se titula 'Atlas de Información Geográfica Voluntaria para la Gestión Territorial', teniendo como caso piloto el "
        "polígono patrimonial y universitario del Barrio Brasil y el campus UAH."
    )

    # =========================================================================
    # SLIDE 2: INTRODUCCIÓN Y CONTEXTO INSTITUCIONAL
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s2, "Contexto Institucional y Justificación Territorial", 
                       categoria="1. Introducción y Marco del Problema",
                       subtitulo="Articulación entre investigación Fondecyt, información colaborativa y gestión local")
    agregar_pie_pagina(s2, 2)

    # Columna Izquierda: Marco Teórico e Institucional
    agregar_tarjeta(s2, 0.8, 1.6, 5.7, 5.05)
    tb_c1 = s2.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.65))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    tf_c1.margin_left = tf_c1.margin_top = tf_c1.margin_right = tf_c1.margin_bottom = 0

    p = tf_c1.paragraphs[0]
    p.text = "Marco Teórico: El Ciudadano como Sensor"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    bullets_c1 = [
        ("Concepto de VGI (Goodchild, 2007):", "La Información Geográfica Voluntaria comprende la creación, ensamblaje y difusión voluntaria de datos espaciales por parte de personas actuando como sensores del territorio."),
        ("Madurez de Plataformas Abiertas:", "OpenStreetMap (OSM) y GBIF han demostrado precisiones posicionales comparables o superiores a cartografías oficiales en áreas urbanas centrales densas (Haklay, 2010; See et al., 2025)."),
        ("Encuadre Fondecyt F1261256:", "La práctica se inserta como asistente técnico de investigación para construir un prototipo metodológico transferible de Infraestructura de Datos Espaciales (IDE) ciudadana."),
        ("El Rol de la Geografía Aplicada:", "Aportar con rigor espacial, normalización geodésica y criterios de gobernanza pública a datos que comúnmente carecen de documentación sistemática.")
    ]
    for tit, desc in bullets_c1:
        p_item = tf_c1.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10.5)
        p_item.space_after = Pt(6)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: El Problema en Barrio Brasil
    agregar_tarjeta(s2, 6.8, 1.6, 5.733, 5.05)
    tb_c2 = s2.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.65))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    tf_c2.margin_left = tf_c2.margin_top = tf_c2.margin_right = tf_c2.margin_bottom = 0

    p = tf_c2.paragraphs[0]
    p.text = "Diagnóstico Territorial: Barrio Brasil & UAH"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    bullets_c2 = [
        ("Polígono de Estudio:", "223,75 hectáreas (2,24 km²) en Santiago Centro. Zona Típica D.S. N°126/2000, 192 zonas de Plan Regulador Comunal (PRC), nodo de transporte con Metro L1, L2 y L5, y campus universitario UAH."),
        ("Desfase de la Cartografía Oficial:", "Las bases estatales (IDE Chile, Ministerios) poseen ciclos de actualización de 5 a 10 años, omitiendo la micro-escala barrial (locales de barrio, rebajes de vereda, ciclocalles)."),
        ("Desarticulación Comunitaria:", "Pese a que vecinos y voluntarios generan mapeos en OSM y GBIF, estos datos no conversan formalmente con la gestión municipal ni con la academia."),
        ("El Desafío Central:", "¿Cómo articular los datos oficiales del Estado con la cartografía voluntaria en una sola plataforma transparente, reproducible y sin costo de licencias para el centro de práctica?")
    ]
    for tit, desc in bullets_c2:
        p_item = tf_c2.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10.5)
        p_item.space_after = Pt(6)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s2,
        "En esta lámina contextualizamos el marco teórico y el problema territorial. La VGI, conceptualizada por Michael Goodchild "
        "en 2007 como el ciudadano actuando como sensor, ofrece una oportunidad inédita para la gestión territorial local. En Barrio Brasil, "
        "un territorio patrimonial y universitario de 223 hectáreas, la información oficial del Estado suele actualizarse con desfases de varios años. "
        "El objetivo del proyecto Fondecyt F1261256 es diseñar un puente metodológico que integre estos datos ciudadanos con las fuentes oficiales "
        "bajo normas geográficas estrictas."
    )

    # =========================================================================
    # SLIDE 3: OBJETIVOS DEL PROYECTO (PLAN DE TRABAJO FORMAL)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s3, "Objetivos del Proyecto de Práctica Profesional", 
                       categoria="2. Objetivos y Alcance",
                       subtitulo="Objetivo general y cuatro objetivos específicos articulados en secuencia metodológica")
    agregar_pie_pagina(s3, 3)

    # Objetivo General (Caja Destacada Superior)
    agregar_tarjeta(s3, 0.8, 1.6, 11.733, 1.25, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_og = s3.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(11.333), Inches(1.05))
    tf_og = tb_og.text_frame
    tf_og.word_wrap = True
    tf_og.margin_left = tf_og.margin_top = tf_og.margin_right = tf_og.margin_bottom = 0

    p_og_t = tf_og.paragraphs[0]
    p_og_t.text = "OBJETIVO GENERAL DEL PROYECTO:"
    p_og_t.font.name = FONT_NAME
    p_og_t.font.size = Pt(10)
    p_og_t.font.bold = True
    p_og_t.font.color.rgb = COLOR_AZUL_UAH
    p_og_t.space_after = Pt(2)

    p_og_c = tf_og.add_paragraph()
    p_og_c.text = "Desarrollar un prototipo de 'Atlas de Información Geográfica Voluntaria para la Gestión Territorial' que permita subsanar los vacíos existentes y potenciales de información territorial en Barrio Brasil, garantizando que sea reproducible y centrado en los usuarios."
    p_og_c.font.name = FONT_NAME
    p_og_c.font.size = Pt(12)
    p_og_c.font.bold = True
    p_og_c.font.color.rgb = COLOR_NEGRO

    # 4 Objetivos Específicos en 4 Columnas Armónicas
    col_w = 2.75
    col_gap = 0.24
    oes = [
        ("OE 1: Diseño Conceptual", "Sem 1–3 · 72 hrs", "Caracterizar el escenario territorial y la disponibilidad VGI en Barrio Brasil, revisando fuentes abiertas y definiendo la arquitectura conceptual del Atlas según taxonomías OSM y GBIF.", "COMPLETADO (100%)", COLOR_AZUL_UAH),
        ("OE 2: Geodatabase & Datos", "Sem 4–7 · 120 hrs", "Construir una geodatabase VGI estandarizada integrando descarga, transformación, normalización y análisis espacial, con énfasis en la calidad de datos (MetaCalidad) y el diagnóstico territorial.", "CONSOLIDADO / EN CURSO", COLOR_AZUL_SEC),
        ("OE 3: Prototipo & Visor", "Sem 8–10 · 72 hrs", "Diseñar el prototipo cartográfico estableciendo un estándar visual unificado y construyendo un visor web interactivo en producción para consulta territorial de capas e indicadores.", "AVANZADO ANTICIPADAMENTE", COLOR_AZUL_SEC),
        ("OE 4: Validación & Traspaso", "Sem 11 · 36 hrs", "Validar el prototipo del Atlas con 3–5 usuarios potenciales de distinto nivel de conocimiento en SIG/VGI y asegurar su transferibilidad técnica reproducible.", "PROGRAMADO FASE FINAL", COLOR_GRIS_TEXTO)
    ]

    for idx, (oe_tit, oe_time, oe_desc, oe_est, color_head) in enumerate(oes):
        c_left = 0.8 + idx * (col_w + col_gap)
        card = agregar_tarjeta(s3, c_left, 3.05, col_w, 3.65)
        
        # Franja de título
        franja = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(c_left), Inches(3.05), Inches(col_w), Inches(0.55))
        franja.fill.solid()
        franja.fill.fore_color.rgb = color_head
        franja.line.fill.background()

        tf_f = franja.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
        p_ft = tf_f.paragraphs[0]
        p_ft.text = oe_tit
        p_ft.font.name = FONT_NAME
        p_ft.font.size = Pt(11)
        p_ft.font.bold = True
        p_ft.font.color.rgb = COLOR_BLANCO
        p_ft.alignment = PP_ALIGN.CENTER

        # Contenido de la tarjeta
        tb_oe = s3.shapes.add_textbox(Inches(c_left + 0.15), Inches(3.7), Inches(col_w - 0.3), Inches(2.9))
        tf_oe = tb_oe.text_frame
        tf_oe.word_wrap = True
        tf_oe.margin_left = tf_oe.margin_top = tf_oe.margin_right = tf_oe.margin_bottom = 0

        p_t = tf_oe.paragraphs[0]
        p_t.text = f"Período: {oe_time}"
        p_t.font.name = FONT_NAME
        p_t.font.size = Pt(9.5)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_AZUL_SEC
        p_t.space_after = Pt(4)

        p_d = tf_oe.add_paragraph()
        p_d.text = oe_desc
        p_d.font.name = FONT_NAME
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = COLOR_NEGRO
        p_d.space_after = Pt(8)

        p_e = tf_oe.add_paragraph()
        p_e.text = f"Estado: {oe_est}"
        p_e.font.name = FONT_NAME
        p_e.font.size = Pt(9.5)
        p_e.font.bold = True
        p_e.font.color.rgb = COLOR_AZUL_UAH

    agregar_notas_orador(s3,
        "Los objetivos del plan de trabajo estructuran una secuencia metodológica continua en cuatro etapas: "
        "El OE 1 sienta las bases conceptuales y taxonomías; el OE 2 materializa la base de datos y la auditoría de calidad; "
        "el OE 3 levanta el visor web cartográfico; y el OE 4 cierra el ciclo mediante la validación con usuarios potenciales "
        "de distinto nivel de conocimiento en SIG y VGI, junto con la transferencia técnica. A las 150 horas, el OE 1 está totalmente cerrado, "
        "el OE 2 está consolidado con 118 capas evaluadas y el OE 3 se adelantó en producción web."
    )

    # =========================================================================
    # SLIDE 4: PLAN METODOLÓGICO Y PROCEDIMIENTOS (PARTE 1: OE 1 Y OE 2)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s4, "Plan Metodológico y Procedimientos (Parte 1: OE 1 y OE 2)", 
                       categoria="3. Marco Metodológico",
                       subtitulo="Objetivos Específicos 1 y 2: Caracterización conceptual, taxonomía VGI, geodatabase y MetaCalidad")
    agregar_pie_pagina(s4, 4)

    # Tabla metodológica Parte 1 (OE 1 y OE 2)
    filas_metodo_p1 = [
        ["Objetivo / Fase", "Técnica de Recopilación / Fuentes", "Herramientas de Trabajo", "Procedimientos y Análisis Espacial", "Entregables del Plan"],
        [
            "OE 1\nDiagnóstico y Taxonomía\n\nSemanas 1–3\n(72 hrs programadas)\nEstado: 100% Completado",
            "• Revisión bibliográfica VGI (Haklay, Goodchild)\n• APIs Overpass QL, ohsome v1/v2 y GBIF\n• Catálogo de capas oficiales IDE Chile / SNIT\n• Cartografía colaborativa OpenStreetMap\n• Relevamiento piloto Barrio Brasil y UAH",
            "• Python 3.10+ (Requests, Urllib, JSON)\n• QGIS 3.28 LTR (inspección vectorial)\n• Entorno Git / GitHub (control versiones)\n• Libros técnicos OpenXML (Excel)\n• Especificación GeoJSON RFC 7946",
            "• Diseño conceptual de 10 macrocategorías VGI\n• Identificación de 4 perfiles de usuarios (DCU)\n• Diagnóstico y auditoría de 86 brechas espaciales\n• Clasificación de tags OSM y esquemas Darwin Core\n• Homologación territorial Barrio Brasil",
            "• docs/FICHA_TECNICA_PROYECTO.docx\n• docs/categorias_tematicas_osm.xlsx\n• docs/ARQUITECTURA_CONCEPTUAL.md\n• Catálogo de fuentes y variables iniciales"
        ],
        [
            "OE 2\nGeodatabase y MetaCalidad\n\nSemanas 4–7\n(120 hrs programadas)\nEstado: 65% Consolidado",
            "• Extracción masiva Overpass QL (nwr Barrio Brasil)\n• Extractos regionales Geofabrik RM (849,16 MB)\n• GBIF Occurrence API (taxones validados)\n• 108 capas oficiales IDE Chile (MINVU, DGA, INE)\n• 7 capas RSH por unidad vecinal (MDSF)",
            "• GeoPandas, Shapely, PyShp, OpenPyXL\n• PostgreSQL 17 + PostGIS 3.3 (Supabase Cloud)\n• GDAL / OGR (reproyección y conversión)\n• Scripts automatizados de verificación\n• Índices espaciales GiST en PostGIS",
            "• Normalización vectorial a EPSG:4326 y UTM 19S\n• Estructuración de 118 componentes (2.181,82 MB)\n• Auditoría de MetaCalidad ISO 19157 (98,63%)\n• Verificación de 129.262 entidades y topología\n• Generación de perfiles ISO 19115 / ISO 19139",
            "• Base PostGIS activa (118 capas / 2,18 GB)\n• Matriz de MetaCalidad (JSON / XLSX)\n• docs/perfil_metadatos_vgi.xlsx\n• docs/ANALISIS_METACALIDAD.md\n• Scripts de verificación de integridad"
        ]
    ]

    tabla_shape_4 = s4.shapes.add_table(3, 5, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.0))
    tbl_4 = tabla_shape_4.table
    col_w_m = [Inches(1.2), Inches(2.7), Inches(2.2), Inches(3.0), Inches(2.633)]
    for ci, w in enumerate(col_w_m):
        tbl_4.columns[ci].width = w

    for ri, row in enumerate(filas_metodo_p1):
        for ci, val in enumerate(row):
            cell = tbl_4.cell(ri, ci)
            cell.text = ""
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.08)
            cell.margin_top = Inches(0.08)
            cell.margin_bottom = Inches(0.08)

            lines = val.split("\n")
            for li, line in enumerate(lines):
                if li == 0:
                    p = cell.text_frame.paragraphs[0]
                else:
                    p = cell.text_frame.add_paragraph()
                p.text = line
                p.font.name = FONT_NAME
                if ri == 0:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_AZUL_UAH
                    p.font.size = Pt(9.5)
                    p.font.bold = True
                    p.font.color.rgb = COLOR_BLANCO
                    p.alignment = PP_ALIGN.CENTER
                else:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                    p.font.size = Pt(8.5)
                    p.font.color.rgb = COLOR_NEGRO
                    p.space_after = Pt(2)
                    p.space_before = Pt(0)
                    if ci == 0:
                        p.alignment = PP_ALIGN.CENTER
                        if li == 0:
                            p.font.bold = True
                            p.font.size = Pt(11)
                            p.font.color.rgb = COLOR_AZUL_UAH
                        elif "Estado:" in line:
                            p.font.bold = True
                            p.font.size = Pt(8.5)
                            p.font.color.rgb = COLOR_AZUL_SEC
                        else:
                            p.font.size = Pt(8.5)
                            p.font.color.rgb = COLOR_GRIS_TEXTO
                    else:
                        p.alignment = PP_ALIGN.LEFT
            set_cell_border(cell, "CBD5E1", "8000")

    agregar_notas_orador(s4,
        "En esta primera parte del marco metodológico presentamos la operacionalización de los Objetivos Específicos 1 y 2. "
        "El OE 1 sentó las bases conceptuales con la taxonomía de 10 macrocategorías VGI y la identificación de 4 usuarios-tipo bajo diseño centrado en el usuario, "
        "encontrándose 100% completado. El OE 2 consolidó la Geodatabase de 118 capas con más de 2,18 GB procesados y una exhaustiva auditoría de metacalidad "
        "bajo la norma ISO 19157, alcanzando un 98,63% de cumplimiento global. Todo el pipeline utiliza herramientas de código abierto como Python, GeoPandas y PostgreSQL/PostGIS, "
        "garantizando rigor y reproducibilidad."
    )

    # =========================================================================
    # SLIDE 5: PLAN METODOLÓGICO Y PROCEDIMIENTOS (PARTE 2: OE 3 Y OE 4)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s5, "Plan Metodológico y Procedimientos (Parte 2: OE 3 y OE 4)", 
                       categoria="3. Marco Metodológico (Continuación)",
                       subtitulo="Objetivos Específicos 3 y 4: Prototipado web, inspector normativo, validación con usuarios y transferencia")
    agregar_pie_pagina(s5, 5)

    # Tabla metodológica Parte 2 (OE 3 y OE 4)
    filas_metodo_p2 = [
        ["Objetivo / Fase", "Técnica de Recopilación / Fuentes", "Herramientas de Trabajo", "Procedimientos y Análisis Espacial", "Entregables del Plan"],
        [
            "OE 3\nPrototipo Web y Visor\n\nSemanas 8–10\n(72 hrs programadas)\nEstado: 90% Adelantado",
            "• Estándares cartográficos OGC (WMS/WFS) e ICA\n• Especificación GeoJSON RFC 7946\n• Normativa PRC Santiago (zonificación y usos)\n• APIs en vivo: Overpass QL, ohsome v1/v2, GBIF\n• Teselas base CartoDB Positron / OSM Standard",
            "• JavaScript Vanilla (SPA modular sin frameworks)\n• Leaflet 1.9.4 (biblioteca cartográfica interactiva)\n• HTML5 semántico + CSS3 responsive\n• Netlify CI/CD (despliegue continuo en la nube)\n• Supabase Storage CDN (almacenamiento geoespacial)",
            "• Desarrollo de geoportal interactivo (10 módulos)\n• Inspector normativo PRC Santiago (192 zonas)\n• Arquitectura triple failover (PostGIS→CDN→Local)\n• Módulo de metacalidad interactivo ISO 19157\n• Optimización de carga (<1,2 s, costo $0/mes)",
            "• Geoportal web: atlasvgiuah.netlify.app\n• 10 módulos funcionales en producción\n• Código fuente en GitHub (rama main)\n• Manual de uso y visor integrado\n• Scripts de despliegue automatizado"
        ],
        [
            "OE 4\nValidación y Transferencia\n\nSemana 11\n(36 hrs programadas)\nEstado: Programado (0%)",
            "• Pruebas de usabilidad guiadas en entorno real\n• Pauta semi-estructurada de evaluación cualitativa\n• Panel de 3 a 5 usuarios potenciales (distinto nivel)\n• Criterios de replicabilidad académica ANID\n• Estándares de transferencia territorial UAH",
            "• Formularios estandarizados de validación\n• Protocolos de evaluación heurística UX/Carto\n• Microsoft Word (informe final y manuales)\n• QGIS y scripts Python de empaquetado\n• Repositorio Zenodo / GitHub para preservación",
            "• Sistematización de observaciones y métricas de uso\n• Ajuste, calibración y depuración del geoportal\n• Redacción de protocolos de actualización periódica\n• Documentación de gobernanza y costo cero\n• Preparación de transferencia docente y comunitaria",
            "• Geoportal final validado y calibrado\n• Informe Final de Práctica Profesional\n• Manual técnico de replicabilidad y mantención\n• Paquete de datos abiertos para investigación\n• Presentación ejecutiva de cierre"
        ]
    ]

    tabla_shape_5 = s5.shapes.add_table(3, 5, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.0))
    tbl_5 = tabla_shape_5.table
    for ci, w in enumerate(col_w_m):
        tbl_5.columns[ci].width = w

    for ri, row in enumerate(filas_metodo_p2):
        for ci, val in enumerate(row):
            cell = tbl_5.cell(ri, ci)
            cell.text = ""
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.08)
            cell.margin_top = Inches(0.08)
            cell.margin_bottom = Inches(0.08)

            lines = val.split("\n")
            for li, line in enumerate(lines):
                if li == 0:
                    p = cell.text_frame.paragraphs[0]
                else:
                    p = cell.text_frame.add_paragraph()
                p.text = line
                p.font.name = FONT_NAME
                if ri == 0:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_AZUL_UAH
                    p.font.size = Pt(9.5)
                    p.font.bold = True
                    p.font.color.rgb = COLOR_BLANCO
                    p.alignment = PP_ALIGN.CENTER
                else:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                    p.font.size = Pt(8.5)
                    p.font.color.rgb = COLOR_NEGRO
                    p.space_after = Pt(2)
                    p.space_before = Pt(0)
                    if ci == 0:
                        p.alignment = PP_ALIGN.CENTER
                        if li == 0:
                            p.font.bold = True
                            p.font.size = Pt(11)
                            p.font.color.rgb = COLOR_AZUL_UAH
                        elif "Estado:" in line:
                            p.font.bold = True
                            p.font.size = Pt(8.5)
                            p.font.color.rgb = COLOR_AZUL_SEC
                        else:
                            p.font.size = Pt(8.5)
                            p.font.color.rgb = COLOR_GRIS_TEXTO
                    else:
                        p.alignment = PP_ALIGN.LEFT
            set_cell_border(cell, "CBD5E1", "8000")

    agregar_notas_orador(s5,
        "En esta segunda parte abordamos los Objetivos Específicos 3 y 4. El OE 3 comprende el desarrollo del prototipo cartográfico web, "
        "el cual fue adelantado significativamente respecto al calendario original y ya se encuentra en producción en Netlify con 10 módulos funcionales, "
        "destacando el Inspector Normativo del PRC de Santiago y una arquitectura triple failover a costo cero. "
        "Finalmente, el OE 4 corresponde a la fase de validación con 3 a 5 usuarios potenciales de distinto nivel de conocimiento en SIG/VGI, "
        "junto con la elaboración del manual de transferencia técnica y el informe final de práctica profesional."
    )

    # =========================================================================
    # SLIDE 6: ESTADO DE AVANCE Y CARTA GANTT (CORTE 150 HORAS / SEMANA 6)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s6, "Estado de Avance y Carta Gantt (Corte 150 Horas)", 
                       categoria="4. Cronograma y Cumplimiento",
                       subtitulo="50 días hábiles (300 hrs) · Marcador de medio término: Miércoles 07 de octubre de 2026 (Día hábil 25)")
    agregar_pie_pagina(s6, 6)

    # Resumen de KPIs de horas
    kpis = [
        ("Horas Programadas", "300 hrs", "11 semanas laborales"),
        ("Horas Cumplidas", "150 hrs", "25 días hábiles (50%)"),
        ("Hitos Cerrados", "H1, H2, H3, H4", "OE 1 completo (100%)"),
        ("Hitos en Progreso", "H5 y H8", "Calidad e IDE en vivo")
    ]
    for ki, (kt, kv, kd) in enumerate(kpis):
        kx = 0.8 + ki * (2.8 + 0.177)
        agregar_tarjeta(s6, kx, 1.6, 2.8, 0.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_k = s6.shapes.add_textbox(Inches(kx + 0.1), Inches(1.68), Inches(2.6), Inches(0.8))
        tf_k = tb_k.text_frame
        tf_k.word_wrap = True
        tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = 0
        p1 = tf_k.paragraphs[0]
        p1.text = kt.upper()
        p1.font.name = FONT_NAME
        p1.font.size = Pt(8.5)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_AZUL_SEC
        p2 = tf_k.add_paragraph()
        p2.text = kv
        p2.font.name = FONT_NAME
        p2.font.size = Pt(16)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_AZUL_UAH
        p3 = tf_k.add_paragraph()
        p3.text = kd
        p3.font.name = FONT_NAME
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = COLOR_GRIS_TEXTO

    # Tabla Carta Gantt natural
    headers_gantt = ["Hito / Actividad Planificada", "OE", "S1", "S2", "S3", "S4", "S5", "S6*", "S7", "S8", "S9", "S10", "S11", "Estado"]
    filas_gantt = [
        ["H1: Inducción, territorio y usuarios", "OE 1", "■", "", "", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H2: Diseño conceptual y 10 categorías VGI", "OE 1", "", "■", "", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H3: Revisión de fuentes VGI y brechas IDE", "OE 1", "", "", "■", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H4: Obtención y geodatabase (118 capas)", "OE 2", "", "", "", "■", "■", "", "", "", "", "", "", "100% Consolidado"],
        ["H5: Calidad de datos (MetaCalidad ISO 19157)", "OE 2", "", "", "", "", "■", "■", "", "", "", "", "", "100% Cerrado"],
        ["H6: Análisis territorial y modelo ranking", "OE 2", "", "", "", "", "", "", "■", "■", "", "", "", "En inicio"],
        ["H7: Estándar cartográfico del Atlas", "OE 3", "", "", "", "", "", "", "", "■", "", "", "", "Iniciado"],
        ["H8: Geoportal web interactivo en producción", "OE 3", "", "", "", "", "", "■", "■", "■", "■", "", "", "80% Anticipado"],
        ["H9: Validación usuarios (distinto nivel SIG)", "OE 4", "", "", "", "", "", "", "", "", "", "■", "", "Programado"],
        ["H10: Manuales, transferibilidad y entrega final", "OE 4", "", "", "", "", "", "", "", "", "", "", "■", "Programado"]
    ]

    tg = s6.shapes.add_table(11, 14, Inches(0.8), Inches(2.75), Inches(11.733), Inches(3.95))
    tbl_g = tg.table
    w_cols = [Inches(3.3), Inches(0.6)] + [Inches(0.61)] * 11 + [Inches(1.123)]
    for ci, w in enumerate(w_cols):
        tbl_g.columns[ci].width = w

    # Encabezado
    for ci, val in enumerate(headers_gantt):
        c = tbl_g.cell(0, ci)
        c.text = val
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_AZUL_UAH
        c.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = c.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.font.name = FONT_NAME
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLANCO
        set_cell_border(c, "CBD5E1", "8000")

    # Filas
    for ri, fila in enumerate(filas_gantt, 1):
        for ci, val in enumerate(fila):
            c = tbl_g.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.fill.solid()
            c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            p.font.size = Pt(8.5)
            set_cell_border(c, "CBD5E1", "8000")

            if ci == 0:
                p.alignment = PP_ALIGN.LEFT
                p.font.color.rgb = COLOR_NEGRO
            elif ci == 1:
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_SEC
            elif 2 <= ci <= 12:
                p.alignment = PP_ALIGN.CENTER
                if val == "■":
                    if ci <= 6: # Pasado / Completado
                        c.fill.fore_color.rgb = COLOR_AZUL_UAH
                        p.font.color.rgb = COLOR_BLANCO
                    elif ci == 7: # Actual (Sem 6)
                        c.fill.fore_color.rgb = COLOR_AZUL_SEC
                        p.font.color.rgb = COLOR_BLANCO
                    else: # Futuro
                        c.fill.fore_color.rgb = COLOR_GRIS_BORDE
                        p.font.color.rgb = COLOR_NEGRO
                if ci == 7: # Columna Semana 6 marcada
                    set_cell_border(c, "003366", "16000")
            elif ci == 13:
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                if "Cerrado" in val or "Consolidado" in val:
                    p.font.color.rgb = COLOR_AZUL_UAH
                elif "curso" in val or "Anticipado" in val:
                    p.font.color.rgb = COLOR_AZUL_SEC
                else:
                    p.font.color.rgb = COLOR_GRIS_TEXTO

    agregar_notas_orador(s6,
        "La Carta Gantt refleja exactamente la situación al día hábil número 25, que corresponde al 7 de octubre de 2026. "
        "En este punto de medio término hemos cumplido estrictamente las 150 horas asignadas. El Objetivo Específico 1 está "
        "cerrado al 100%. En el OE 2 hemos consolidado la geodatabase de 118 capas y la auditoría de MetaCalidad. Un logro "
        "destacado es que el desarrollo del geoportal interactivo (OE 3), originalmente fechado para semanas 8 a 10, fue anticipado "
        "y ya se encuentra operativo en producción."
    )

    # =========================================================================
    # SLIDE 7: RESULTADOS OE 1 — TAXONOMÍA VGI Y USUARIOS-TIPO
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s7, "Resultados OE 1: Arquitectura Conceptual y Taxonomías VGI", 
                       categoria="5. Resultados — Objetivo Específico 1",
                       subtitulo="10 Macro-categorías territoriales, 4 usuarios-tipo (DCU) y diccionario de 134 descriptores")
    agregar_pie_pagina(s7, 7)

    # Panel 1: Las 10 Macrocategorías
    agregar_tarjeta(s7, 0.8, 1.65, 5.7, 5.0)
    tb_cat = s7.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.7))
    tf_cat = tb_cat.text_frame
    tf_cat.word_wrap = True
    tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0

    p = tf_cat.paragraphs[0]
    p.text = "10 Macro-categorías Territoriales VGI"
    p.font.name = FONT_NAME
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    cats_list = [
        ("CAT-01", "Educación e Investigación:", "amenity=university|school · Campus UAH, casonas, INBA, liceos."),
        ("CAT-02", "Servicios y Comercio Barrial:", "shop=* · Almacenes, panaderías patrimoniales, farmacias, salud."),
        ("CAT-03", "Movilidad y Transporte:", "highway=bus_stop · Paraderos Red, bocas Metro L1/L2/L5."),
        ("CAT-04", "Movilidad Activa:", "highway=cycleway · Ciclovías protegidas, ciclocalles, aparcabicis."),
        ("CAT-05", "Áreas Verdes y Espacio Público:", "leisure=park|playground · Plaza Brasil, bandejones verdes."),
        ("CAT-06", "Patrimonio y Memoria:", "historic=* · Cités, Basílica del Salvador, inmuebles PRC."),
        ("CAT-07", "Accesibilidad Universal:", "kerb=lowered · Rebajes peatonales, cruces, huellas táctiles."),
        ("CAT-08", "Biodiversidad Urbana:", "natural=tree · Arbolado barrial OSM y especies Darwin Core GBIF."),
        ("CAT-09", "Edificaciones y Huella:", "building=* · 1.673 polígonos prediales y alturas en Barrio Brasil."),
        ("CAT-10", "Coberturas y Suelo:", "landuse=* · Zonificación de superficie, adoquines patrimoniales.")
    ]
    for cod, nom, desc in cats_list:
        p_c = tf_cat.add_paragraph()
        p_c.font.name = FONT_NAME
        p_c.font.size = Pt(9.5)
        p_c.space_after = Pt(2)
        r0 = p_c.add_run()
        r0.text = f"[{cod}] "
        r0.font.bold = True
        r0.font.color.rgb = COLOR_AZUL_UAH
        r1 = p_c.add_run()
        r1.text = f"{nom} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_NEGRO
        r2 = p_c.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_GRIS_TEXTO

    # Panel 2: Los 4 Usuarios-Tipo (DCU) y el Diccionario Territorial
    agregar_tarjeta(s7, 6.8, 1.65, 5.733, 5.0)
    tb_usr = s7.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.7))
    tf_usr = tb_usr.text_frame
    tf_usr.word_wrap = True
    tf_usr.margin_left = tf_usr.margin_top = tf_usr.margin_right = tf_usr.margin_bottom = 0

    p_u = tf_usr.paragraphs[0]
    p_u.text = "4 Perfiles de Usuario (Diseño Centrado en el Usuario - DCU)"
    p_u.font.name = FONT_NAME
    p_u.font.size = Pt(12.5)
    p_u.font.bold = True
    p_u.font.color.rgb = COLOR_AZUL_UAH
    p_u.space_after = Pt(4)

    usuarios = [
        ("1. Institucional / Gestión Pública", "MINVU, Municipio de Santiago, DTPM, UOCT, IDE Chile. Requiere contraste normativo con PRC Santiago, métricas de vialidad y auditoría oficial."),
        ("2. Comunitario / Vecinal", "Juntas de Vecinos de Barrio Brasil, asambleas barriales, comerciantes locales. Requiere mapas sencillos de servicios, arbolado, equipamiento y cruces accesibles."),
        ("3. Mapeador / Voluntario OSM", "Comunidad de mapeadores y estudiantes. Requiere herramientas de validación de etiquetas, visualización de geometrías nwr y extracción Overpass QL."),
        ("4. ONGs / Investigadores / Academia", "Geografía UAH, Fondecyt F1261256, centros de estudios urbanos. Demanda trazabilidad académica APA 7ª, metadatos ISO 19115 y descarga en GeoJSON/CSV.")
    ]
    for ut, ud in usuarios:
        p_ui = tf_usr.add_paragraph()
        p_ui.font.name = FONT_NAME
        p_ui.font.size = Pt(9.5)
        p_ui.space_after = Pt(4)
        r1 = p_ui.add_run()
        r1.text = f"• {ut}: "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_ui.add_run()
        r2.text = ud
        r2.font.color.rgb = COLOR_NEGRO

    p_dic = tf_usr.add_paragraph()
    p_dic.text = "\nDiccionario Territorial (134 Descriptores):"
    p_dic.font.name = FONT_NAME
    p_dic.font.size = Pt(11)
    p_dic.font.bold = True
    p_dic.font.color.rgb = COLOR_AZUL_UAH
    p_dic.space_after = Pt(2)

    p_dic_d = tf_usr.add_paragraph()
    p_dic_d.text = "Se catalogaron 134 descriptores territoriales, revelando que el Estado de Chile sólo cuenta con 48 capas oficiales análogas, mientras que 86 descriptores representan brechas que son cubiertas exclusivamente por la cartografía voluntaria VGI."
    p_dic_d.font.name = FONT_NAME
    p_dic_d.font.size = Pt(9.5)
    p_dic_d.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s7,
        "En el Objetivo 1 estructuramos la taxonomía del Atlas en 10 macrocategorías temáticas que van desde educación y comercio hasta "
        "biodiversidad y coberturas de suelo. Paralelamente, implementamos un enfoque de Diseño Centrado en el Usuario (DCU), formulando "
        "cuatro perfiles que orientan la plataforma: gestión pública sectorial, comunidad vecinal, mapeadores voluntarios e investigación académica. "
        "Al contrastar la oferta de IDE Chile con las necesidades del barrio, descubrimos 86 brechas de información territorial que sólo "
        "la VGI es capaz de llenar."
    )

    # =========================================================================
    # SLIDE 8: RESULTADOS OE 2 — GEODATABASE DE 118 COMPONENTES
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s8, "Resultados OE 2: Geodatabase y Componentes Cartográficos", 
                       categoria="6. Resultados — Objetivo Específico 2",
                       subtitulo="Consolidación de 118 capas (108 oficiales + 10 VGI), 2.560 MB activos y 3.730 MB físicos en disco con perfiles ISO enriquecidos")
    agregar_pie_pagina(s8, 8)

    # 3 Tarjetas Superiores de Métricas
    met_db = [
        ("118 Capas Activas", "108 Oficiales Estado + 10 VGI", "Integradas en WGS84, UTM 19S y PostGIS 17"),
        ("2.560 MB Activos", "1.650 MB Ofic. + 910 MB VGI", "Capas normalizadas y Geofabrik RM"),
        ("3.730 MB en Disco", "214 GeoJSONs físicos en src/data/", "121 capas enriquecidas con 14 atributos de catálogo")
    ]
    for mi, (mt, mv, md) in enumerate(met_db):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s8, mx, 1.65, 3.75, 1.05, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_m = s8.shapes.add_textbox(Inches(mx + 0.15), Inches(1.72), Inches(3.45), Inches(0.9))
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
        p2.font.size = Pt(9.5)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NEGRO
        p3 = tf_m.add_paragraph()
        p3.text = md
        p3.font.name = FONT_NAME
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = COLOR_GRIS_TEXTO

    # Tabla de Distribución por Grupos Temáticos en el Atlas
    tb_tit_g = s8.shapes.add_textbox(Inches(0.8), Inches(2.85), Inches(11.733), Inches(0.3))
    p = tb_tit_g.text_frame.paragraphs[0]
    p.text = "Estructura Temática y Participación de la Geodatabase Consolidada (ISO 19157):"
    p.font.name = FONT_NAME
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH

    filas_gdb = [
        ["Grupo Temático Consolidado", "Instituciones Custodias Principales", "Capas (N°)", "% Capas", "Volumen (MB)", "% Volumen"],
        ["Demografía y Vulnerabilidad Social", "INE (Censo 2024 en 5 niveles), MDSF (Registro Social de Hogares), MINVU", "19", "16,1%", "689,44 MB", "31,6%"],
        ["Normativa e Instrumentos IPT", "MINVU, Seremi Metropolitana, Municipios (PRC Santiago 192 zonas, PRMS)", "13", "11,0%", "207,00 MB", "9,5%"],
        ["Economía, Fomento e Inversión", "MDSF (Banco Integrado de Proyectos BIP), MOP, ODEPA, CNE Energía RM", "15", "12,7%", "203,67 MB", "9,3%"],
        ["Medio Ambiente y Recursos Hídricos", "Ministerio del Medio Ambiente, DGA, CONAF, Dirección Meteorológica", "21", "17,8%", "101,04 MB", "4,6%"],
        ["Movilidad, Red Vial y Tránsito", "MTT, UOCT (1.500+ cruces semaforizados RM), Metro S.A., EFE Ferrocarriles", "7", "5,9%", "66,88 MB", "3,1%"],
        ["Equipamiento Público y Patrimonio", "Consejo de Monumentos Nacionales (CMN), MINEDUC, MINSAL, IND", "28", "23,7%", "58,51 MB", "2,7%"],
        ["Seguridad, Bomberos y Justicia", "Carabineros de Chile, Cuerpos de Bomberos CBS, Ministerio de Justicia", "5", "4,2%", "0,93 MB", "0,0%"],
        ["VGI Comunitario (OSM + GBIF)", "Comunidad OSM (Geofabrik RM + Barrio Brasil) y GBIF Darwin Core", "10", "8,5%", "854,35 MB", "39,2%"],
        ["TOTAL CAPAS ACTIVAS (118)", "Geodatabase operativa en producción (PostGIS 17 + Supabase + CDN)", "118", "100,0%", "2.181,82 MB", "100,0%"]
    ]

    tgdb = s8.shapes.add_table(10, 6, Inches(0.8), Inches(3.2), Inches(11.733), Inches(3.45))
    tbl_gdb = tgdb.table
    w_gdb = [Inches(3.3), Inches(4.333), Inches(0.9), Inches(1.0), Inches(1.1), Inches(1.1)]
    for ci, w in enumerate(w_gdb):
        tbl_gdb.columns[ci].width = w

    for ri, fila in enumerate(filas_gdb):
        for ci, val in enumerate(fila):
            c = tbl_gdb.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(9.5)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            elif ri == 9: # Total
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_CLARO
                p.font.size = Pt(9.5)
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_UAH
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(9)
                p.font.color.rgb = COLOR_NEGRO
                if ci >= 2:
                    p.alignment = PP_ALIGN.CENTER
                else:
                    p.alignment = PP_ALIGN.LEFT
                    if ci == 0:
                        p.font.bold = True
            set_cell_border(c, "CBD5E1", "8000")

    agregar_notas_orador(s8,
        "En el Objetivo 2 consolidamos la geodatabase completa del Atlas, compuesta por 118 capas espaciales activas. "
        "Al incorporar los extractos regionales masivos de Geofabrik para la Región Metropolitana (849,16 MB en las 10 macrocategorías VGI "
        "más 5,19 MB del piloto barrial), el volumen activo de la base de datos asciende a 2.181,82 megabytes (2,18 gigabytes). "
        "Las 108 capas oficiales del Estado representan 1.327,47 MB (60,8%), mientras que la cartografía colaborativa VGI representa el 39,2% restante. "
        "En disco, el repositorio completo almacena 214 archivos GeoJSON que totalizan 3.362,55 MB. Todas las capas han sido normalizadas "
        "con doble geodesia: WGS84 para el renderizado web y UTM Huso 19 Sur para el cálculo conforme de áreas y distancias según Snyder."
    )

    # =========================================================================
    # SLIDE 9: RESULTADOS OE 2 — EVALUACIÓN DE METACALIDAD (ISO 19157)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s9, "Resultados OE 2: Auditoría Universal de MetaCalidad (ISO 19157)", 
                       categoria="7. Resultados — Calidad de Metadatos",
                       subtitulo="Evaluación objetiva sobre el 100% de la geodatabase: 98,6% IGMC Promedio (Grado A+ Excelente)")
    agregar_pie_pagina(s9, 9)

    # Columna Izquierda: Tabla de Dimensiones de MetaCalidad
    agregar_tarjeta(s9, 0.8, 1.65, 6.2, 5.0)
    tb_dim_t = s9.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.8), Inches(0.35))
    p = tb_dim_t.text_frame.paragraphs[0]
    p.text = "Cumplimiento por Dimensión de MetaCalidad (ISO 19157)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH

    filas_dim = [
        ["Dimensión Evaluada", "Estándar / Marco", "Peso", "Puntaje", "Nivel"],
        ["1. Completitud de Atributos", "Cuantitativa · ISO 19157", "10%", "98,2%", "A+ Excelente"],
        ["2. Consistencia Lógica / Topología", "Cuantitativa · ISO 19157", "10%", "100,0%", "A+ Excelente"],
        ["3. Exactitud Posicional Geodésica", "Cuantitativa · Snyder / EPSG", "10%", "98,5%", "A+ Excelente"],
        ["4. Exactitud Temática y Tipología", "Cuantitativa · ISO 19157", "10%", "97,8%", "A+ Excelente"],
        ["5. Calidad y Vigencia Temporal", "Cuantitativa · ISO 19157", "10%", "96,5%", "A+ Excelente"],
        ["6. Linaje y Trazabilidad de Origen", "Cualitativa · ISO 19115", "10%", "100,0%", "A+ Excelente"],
        ["7. Accesibilidad y Formatos Abiertos", "Cualitativa · Open Data / CDN", "10%", "100,0%", "A+ Excelente"],
        ["8. Usabilidad y Facilidad Operativa", "Cualitativa · SIG / Web Client", "10%", "95,0%", "A+ Excelente"],
        ["9. Autoría y Custodia Institucional", "Cualitativa · Ley 20.285 / SNIT", "10%", "100,0%", "A+ Excelente"],
        ["10. Licenciamiento y Rigor Semántico", "Cualitativa · ODbL / CC-BY", "10%", "92,8%", "A Muy Bueno"],
        ["ÍNDICE GLOBAL (IGV WLC v2.0)", "Modelo Lineal Multi-Atributo", "100%", "97,88%", "Grado A+"]
    ]

    tdim = s9.shapes.add_table(12, 5, Inches(1.0), Inches(2.1), Inches(5.8), Inches(3.2))
    tbl_d = tdim.table
    w_d = [Inches(2.1), Inches(1.6), Inches(0.6), Inches(0.7), Inches(0.8)]
    for ci, w in enumerate(w_d):
        tbl_d.columns[ci].width = w

    for ri, fila in enumerate(filas_dim):
        for ci, val in enumerate(fila):
            c = tbl_d.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(9)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            elif ri == 6:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_CLARO
                p.font.size = Pt(9.5)
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_UAH
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(8.5)
                p.font.color.rgb = COLOR_NEGRO
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
                if ci == 0: p.font.bold = True
            set_cell_border(c, "CBD5E1", "8000")

    # Resumen inferior columna izq
    tb_inf_mc = s9.shapes.add_textbox(Inches(1.0), Inches(5.1), Inches(5.8), Inches(1.4))
    tf_inf_mc = tb_inf_mc.text_frame
    tf_inf_mc.word_wrap = True
    p = tf_inf_mc.paragraphs[0]
    p.text = "Distribución de Calidad en los 118 Componentes:"
    p.font.name = FONT_NAME
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p1 = tf_inf_mc.add_paragraph()
    p1.text = "• Grado A+ (Excelente, ≥95%): 104 capas (88,1% del repositorio)\n• Grado A (Muy Bueno, 85–94%): 14 capas (11,9% del repositorio)\n• Grado B / Grado C (Deficiente, <85%): 0 capas (0,0% del repositorio)"
    p1.font.name = FONT_NAME
    p1.font.size = Pt(9)
    p1.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Captura de la Auditoría en el Manual
    captura_man = os.path.join(IMG_DIR, "08_manual_documentacion.png")
    agregar_imagen_con_marco(s9, captura_man, 7.3, 1.65, 5.233, 4.65,
                             pie_fuente="Módulo 08: Auditoría y Matriz de MetaCalidad exportable en JSON, Markdown y Excel.")

    agregar_notas_orador(s9,
        "La evaluación de MetaCalidad es un componente distintivo de esta práctica profesional. Aplicamos un modelo de utilidad "
        "multi-atributo basado en la norma ISO 19157 para auditar las 118 capas según cinco dimensiones ortogonales. El resultado global "
        "arroja un 98,6% de conformidad, clasificando en Grado A+ Excelente. Esto garantiza que cada archivo en la geodatabase posee "
        "trazabilidad jurídica inequívoca, linaje certificado y atributos estandarizados exportables a la IDE nacional."
    )

    # =========================================================================
    # SLIDE 10: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 1)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s10, "Dimensiones de Análisis Territorial (Parte 1: Concepto, D1 y D2)", 
                       categoria="8. Dimensiones Estratégicas de Análisis",
                       subtitulo="Estructuración de las 118 capas en 5 dimensiones estratégicas para el diagnóstico barrial")
    agregar_pie_pagina(s10, 10)

    # Tarjeta Superior: El Concepto Detrás del Análisis
    agregar_tarjeta(s10, 0.8, 1.65, 11.733, 1.2, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_con = s10.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(11.333), Inches(1.0))
    tf_con = tb_con.text_frame
    tf_con.word_wrap = True
    tf_con.margin_left = tf_con.margin_top = tf_con.margin_right = tf_con.margin_bottom = 0

    p_ct = tf_con.paragraphs[0]
    p_ct.text = "CONCEPTO RECTOR: ARTICULACIÓN DE CAPAS PARA RESPONDER A LOS 4 USUARIOS-TIPO"
    p_ct.font.name = FONT_NAME
    p_ct.font.size = Pt(10)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_AZUL_UAH
    p_ct.space_after = Pt(2)

    p_cd = tf_con.add_paragraph()
    p_cd.text = "Las 118 capas del Atlas no se presentan de forma aislada, sino agrupadas en 5 Dimensiones Estratégicas de Análisis Territorial. Este ordenamiento permite construir narrativas socioterritoriales concretas sobre Barrio Brasil, cruzando la oferta del Estado con los levantamientos ciudadanos para sustentar la toma de decisiones comunitarias y de planificación urbana."
    p_cd.font.name = FONT_NAME
    p_cd.font.size = Pt(10.5)
    p_cd.font.color.rgb = COLOR_NEGRO

    # Dimensión 1: Sociodemográfica
    agregar_tarjeta(s10, 0.8, 3.0, 5.7, 3.65)
    tb_d1 = s10.shapes.add_textbox(Inches(1.0), Inches(3.15), Inches(5.3), Inches(3.35))
    tf_d1 = tb_d1.text_frame
    tf_d1.word_wrap = True
    tf_d1.margin_left = tf_d1.margin_top = tf_d1.margin_right = tf_d1.margin_bottom = 0

    p = tf_d1.paragraphs[0]
    p.text = "1. Dimensión Sociodemográfica (19 Capas)"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    b_d1 = [
        ("Alcance Territorial:", "Dinámica poblacional, estructura etaria, hogares, migración y estratificación socioterritorial en Barrio Brasil y campus UAH."),
        ("Componentes Oficiales Clave:", "Microdatos Censo 2024 en 5 escalas del INE (Marco regional a manzana) + 7 capas del Registro Social de Hogares RSH (agosto 2026 por unidad vecinal)."),
        ("Vulnerabilidad y Base:", "Catastro Campamentos MINVU 2024, Unidades Vecinales Ley N° 19.418 y equipamiento comunitario barrial."),
        ("Utilidad para Usuarios:", "Sustentada en justicia espacial y segregación residencial (Harvey, 1973; Sabatini et al., 2001; Fuenzalida & Cobs, 2013). Permite a juntas vecinales y analistas cruzar manzanas con sobreenvejecimiento o alta concentración infantil para focalizar subsidios y equipamiento social.")
    ]
    for tit, desc in b_d1:
        p_item = tf_d1.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9)
        p_item.space_after = Pt(3)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Dimensión 2: Socioeconómica
    agregar_tarjeta(s10, 6.8, 3.0, 5.733, 3.65)
    tb_d2 = s10.shapes.add_textbox(Inches(7.0), Inches(3.15), Inches(5.333), Inches(3.35))
    tf_d2 = tb_d2.text_frame
    tf_d2.word_wrap = True
    tf_d2.margin_left = tf_d2.margin_top = tf_d2.margin_right = tf_d2.margin_bottom = 0

    p = tf_d2.paragraphs[0]
    p.text = "2. Dimensión Socioeconómica (18 Capas)"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    b_d2 = [
        ("Alcance Territorial:", "Inversión pública del Estado, empleo formal, red de comercio de proximidad, telecomunicaciones y matriz energética."),
        ("Inversión Pública (BIP):", "Iniciativas de inversión del Banco Integrado de Proyectos (MDSF / SUBDERE), contratos concesionados y obras mandatadas GEOMOP."),
        ("Microeconomía Barrial VGI:", "365 entidades levantadas en Barrio Brasil (CAT-02 OSM): almacenes de abarrotes, panaderías patrimoniales, farmacias comunitarias y ferias en ejes Huérfanos, Brasil y Maturana."),
        ("Utilidad para Usuarios:", "Basada en vitalidad económica cotidiana y proximidad urbana (Jacobs, 1961; Montgomery, 1998; See et al., 2015). Permite contrastar la inversión estatal centralizada con la microeconomía barrial, evaluando si el gasto público dinamiza o desatiende el comercio de proximidad.")
    ]
    for tit, desc in b_d2:
        p_item = tf_d2.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9.5)
        p_item.space_after = Pt(3)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s10,
        "En lugar de centrarnos en storyboards cerradas, abordamos el concepto metodológico: las 118 capas se estructuran en cinco dimensiones "
        "estratégicas. La Dimensión Sociodemográfica agrupa 19 capas, articulando el Censo 2024 a escala de manzana con el Registro Social de Hogares. "
        "La Dimensión Socioeconómica integra 18 capas, contrastando los grandes proyectos de inversión pública del BIP con el microcomercio "
        "de proximidad mapeado en OpenStreetMap."
    )

    # =========================================================================
    # SLIDE 11: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 2)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s11, "Dimensiones de Análisis Territorial (Parte 2: D3, D4 y D5)", 
                       categoria="8. Dimensiones Estratégicas de Análisis (Continuación)",
                       subtitulo="Socioambiental, Sociosanitaria y Sociourbana o Habitabilidad en Barrio Brasil")
    agregar_pie_pagina(s11, 11)

    col3_w = 3.75
    col3_gap = 0.24

    # D3: Socioambiental
    agregar_tarjeta(s11, 0.8, 1.65, col3_w, 5.05)
    tb_d3 = s11.shapes.add_textbox(Inches(0.95), Inches(1.8), Inches(col3_w - 0.3), Inches(4.7))
    tf_d3 = tb_d3.text_frame
    tf_d3.word_wrap = True
    tf_d3.margin_left = tf_d3.margin_top = tf_d3.margin_right = tf_d3.margin_bottom = 0

    p = tf_d3.paragraphs[0]
    p.text = "3. Dimensión Socioambiental\n(23 Capas)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    b_d3 = [
        ("Espacio Público Verde:", "Áreas Verdes Normativas MINVU / INE 2023, estándares CNDU y plazas públicas (Plaza Brasil y Manuel Rodríguez en CAT-05)."),
        ("Biodiversidad Urbana:", "390 registros en Barrio Brasil (CAT-08): arbolado viario en OSM y observaciones Darwin Core de avifauna y flora en GBIF."),
        ("Coberturas de Suelo:", "CAT-10 OSM: superficies impermeables (asfalto, hormigón) vs permeables, estaciones SINCA y red hidrométrica DGA."),
        ("Utilidad para Usuarios:", "Sustentada en justicia ambiental distributiva y confort térmico (Wolch et al., 2014; Reyes-Paecke et al., 2019; Oke, 1982). Permite medir el déficit de m² verde/hab frente al estándar CNDU y modelar islas de calor para priorizar corredores de arbolado viario.")
    ]
    for tit, desc in b_d3:
        p_item = tf_d3.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(8.5)
        p_item.space_after = Pt(3)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # D4: Sociosanitaria
    agregar_tarjeta(s11, 0.8 + (col3_w + col3_gap), 1.65, col3_w, 5.05)
    tb_d4 = s11.shapes.add_textbox(Inches(0.95 + (col3_w + col3_gap)), Inches(1.8), Inches(col3_w - 0.3), Inches(4.7))
    tf_d4 = tb_d4.text_frame
    tf_d4.word_wrap = True
    tf_d4.margin_left = tf_d4.margin_top = tf_d4.margin_right = tf_d4.margin_bottom = 0

    p = tf_d4.paragraphs[0]
    p.text = "4. Dimensión Sociosanitaria\n(3 Capas Clave)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    b_d4 = [
        ("Red Asistencial DEIS:", "Infraestructura formal de salud pública del MINSAL: CESFAM Ignacio Domeyko, SAPU, vacunatorios y hospitales metropolitanos."),
        ("Dependencia Funcional:", "Capa oficial RSH Agosto 2026: personas en situación de dependencia funcional moderada y severa por unidad vecinal."),
        ("Jurisdicción Sanitaria:", "Zonificación y áreas de cobertura del Servicio de Salud Metropolitano Central y Occidente."),
        ("Utilidad para Usuarios:", "Enmarcada en la Geografía de la Salud y Geografía del Cuidado (Kearns & Moon, 2002; Bowlby, 2012; Fuenzalida, 2010). Facilita evaluar la fricción de la distancia y barreras de accesibilidad peatonal hacia la atención primaria para personas dependientes y cuidadores.")
    ]
    for tit, desc in b_d4:
        p_item = tf_d4.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(8.5)
        p_item.space_after = Pt(3)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # D5: Sociourbana o Habitabilidad
    agregar_tarjeta(s11, 0.8 + 2 * (col3_w + col3_gap), 1.65, col3_w, 5.05)
    tb_d5 = s11.shapes.add_textbox(Inches(0.95 + 2 * (col3_w + col3_gap)), Inches(1.8), Inches(col3_w - 0.3), Inches(4.7))
    tf_d5 = tb_d5.text_frame
    tf_d5.word_wrap = True
    tf_d5.margin_left = tf_d5.margin_top = tf_d5.margin_right = tf_d5.margin_bottom = 0

    p = tf_d5.paragraphs[0]
    p.text = "5. Sociourbana / Habitabilidad\n(55 Capas)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    b_d5 = [
        ("Planificación y Catastro:", "PRC Santiago con 192 zonas de zonificación, catastro predial SII y 1.673 edificaciones poligonales OSM (CAT-09)."),
        ("Movilidad y Semáforos:", "Red de semáforos conectados SC-RM (UOCT / MTT), estaciones de Metro L1/L2/L5, ciclovías (CAT-04) y 185 rebajes peatonales (CAT-07)."),
        ("Patrimonio Histórico:", "Zonas y Monumentos Nacionales (CMN), sitios de memoria e Inmuebles de Conservación Histórica (CAT-06)."),
        ("Utilidad para Usuarios:", "Basada en caminabilidad, integración espacial y diseño universal (Gehl, 2010; Speck, 2012; D.S. N° 50 MINVU, 2016). Permite auditar en tiempo real la norma urbana con el espacio vivido, facilitando a ciclistas y personas con discapacidad planificar rutas seguras.")
    ]
    for tit, desc in b_d5:
        p_item = tf_d5.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9)
        p_item.space_after = Pt(3)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s11,
        "Continuando con las dimensiones: La Dimensión Socioambiental integra 23 capas que permiten evaluar el déficit de áreas verdes "
        "y la presencia del arbolado urbano mapeado en OSM y GBIF. La Dimensión Sociosanitaria, aunque concentra tres capas clave, "
        "es fundamental para la geografía del cuidado al cruzar la población con dependencia funcional con la red de salud pública. "
        "Finalmente, la Dimensión Sociourbana o Habitabilidad es la más extensa con 55 capas, integrando la planificación urbana del PRC "
        "con los semáforos de la UOCT, el catastro predial del SII y la accesibilidad universal."
    )

    # =========================================================================
    # SLIDE 12: MARCO METODOLÓGICO: MODELO LINEAL DE RANKING TERRITORIAL
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s12, "Marco Metodológico: Enfoque hacia un Modelo Lineal de Ranking", 
                       categoria="9. Metodología de Síntesis Territorial",
                       subtitulo="Estructura analítica multicriterio (tipo SAW / MAUT) en desarrollo para los OE 2 y OE 4")
    agregar_pie_pagina(s12, 12)

    # Columna Izquierda: Principios del Modelo Lineal
    agregar_tarjeta(s12, 0.8, 1.65, 5.7, 5.0)
    tb_m1 = s12.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.7))
    tf_m1 = tb_m1.text_frame
    tf_m1.word_wrap = True
    tf_m1.margin_left = tf_m1.margin_top = tf_m1.margin_right = tf_m1.margin_bottom = 0

    p = tf_m1.paragraphs[0]
    p.text = "Fundamentación del Modelo Lineal / Ranking"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    bullets_m1 = [
        ("Naturaleza en Desarrollo:", "El índice sintético territorial se encuentra en proceso de formulación metodológica dentro de los Objetivos Específicos 2 y 4, por lo que no se adoptan ponderaciones rígidas provisionales."),
        ("Modelo Lineal Aditivo (SAW):", "Se fundamenta en la Teoría de Utilidad Multi-Atributo (MAUT) y el método Simple Additive Weighting (Fishburn, 1967; Malczewski, 1999), ampliamente respaldado en la literatura de SIG."),
        ("Transparencia Axiomática:", "La formulación lineal garantiza ausencia de 'cajas negras' algorítmicas, permitiendo que funcionarios municipales, vecinos e investigadores comprendan de forma directa el puntaje de cada zona."),
        ("Normalización de Variables:", "Cada indicador se normaliza en la escala [0, 100]% mediante estandarización por máximos y mínimos teóricos o empíricos, asegurando consistencia dimensional."),
        ("Calibración Participativa en OE 4:", "Las ponderaciones definitivas serán sometidas a calibración mediante paneles de consulta con actores territoriales y comités de expertos.")
    ]
    for tit, desc in bullets_m1:
        p_item = tf_m1.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Esquema Visual del Flujo de Ponderación
    agregar_tarjeta(s12, 6.8, 1.65, 5.733, 5.0)
    tb_m2 = s12.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.7))
    tf_m2 = tb_m2.text_frame
    tf_m2.word_wrap = True
    tf_m2.margin_left = tf_m2.margin_top = tf_m2.margin_right = tf_m2.margin_bottom = 0

    p = tf_m2.paragraphs[0]
    p.text = "Estructura Operativa del Ranking Territorial"
    p.font.name = FONT_NAME
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    pasos_ranking = [
        ("Nivel 1 · Variables Primarias (118 Capas):", "Extracción de recuentos espaciales, densidades por km² y distancias euclidianas a equipamientos en UTM Huso 19S."),
        ("Nivel 2 · Normalización por Dimensión:", "Cálculo de puntajes sub-dimensionales normalizados:\n  - IS_Dem: Índice Sociodemográfico\n  - IS_Eco: Índice Socioeconómico\n  - IS_Amb: Índice Socioambiental\n  - IS_San: Índice Sociosanitario\n  - IS_Urb: Índice Sociourbano y de Habitabilidad"),
        ("Nivel 3 · Agregación Lineal y Ranking:", "Puntaje Territorial = ∑ (Wk · Dim_k), permitiendo jerarquizar las unidades vecinales y manzanas censales de Barrio Brasil según nivel de consolidación o vulnerabilidad."),
        ("Nivel 4 · Visualización Interactiva:", "El geoportal presentará el ranking mediante coropletas temáticas y fichas de atributos comparativas orientadas a la acción comunitaria.")
    ]
    for tit, desc in pasos_ranking:
        p_item = tf_m2.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s12,
        "Respecto al índice sintético, es fundamental precisar que se encuentra actualmente en desarrollo y formulación. Por indicación "
        "metodológica, no presentamos fórmulas rígidas provisionales, pero sí definimos que adoptará la estructura de un modelo lineal "
        "aditivo o ranking multicriterio tipo SAW. Este enfoque es ampliamente utilizado en SIG por su transparencia axiomática: "
        "permite normalizar las cinco dimensiones en escala 0 a 100 y jerarquizar territorialmente las unidades vecinales sin sesgos algorítmicos, "
        "dejando las ponderaciones abiertas a la calibración con los usuarios en la fase final."
    )

    # =========================================================================
    # SLIDE 13: RESULTADOS OE 3 — GEOPORTAL ATLAS VGI Y PORTADA MULTIACTOR
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s13, "Resultados OE 3: Geoportal Atlas VGI y Portada Multiactor en Producción", 
                       categoria="10. Resultados — Objetivo Específico 3",
                       subtitulo="Plataforma web disponible en vivo en https://atlasvgiuah.netlify.app/ para la gestión barrial")
    agregar_pie_pagina(s13, 13)

    # Columna Izquierda: Arquitectura de Navegación y Acceso Multiactor
    agregar_tarjeta(s13, 0.8, 1.65, 4.8, 5.0)
    tb_w0 = s13.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.7))
    tf_w0 = tb_w0.text_frame
    tf_w0.word_wrap = True
    tf_w0.margin_left = tf_w0.margin_top = tf_w0.margin_right = tf_w0.margin_bottom = 0

    p = tf_w0.paragraphs[0]
    p.text = "Arquitectura de Navegación y Acceso Multiactor"
    p.font.name = FONT_NAME
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    feat_hero = [
        ("Diseño Centrado en el Usuario (DCU):", "Selector interactivo para 4 perfiles territoriales (Institucional, Comunitario, Voluntario OSM, Academia/ONG) que adapta la interfaz y herramientas."),
        ("Conectividad API en Tiempo Real:", "Indicador de latencia y estado en vivo con Overpass QL (OSM), ohsome API v1/v2 (Heidelberg) y GBIF Darwin Core."),
        ("Navegación Modular Directa:", "Barra superior con acceso inmediato a los 10 módulos funcionales (del 00 al 09) en una Single Page Application ultraligera."),
        ("Delimitación Territorial Barrial:", "Enfoque espacial prioritario sobre Barrio Brasil (223,75 ha) y el campus central UAH, con visualización sinóptica de equipamientos."),
        ("Gobernanza y Ciencia Abierta:", "Vinculación transparente con el Proyecto Fondecyt Regular F1261256 (ANID) y licenciamiento de datos abiertos.")
    ]
    for tit, desc in feat_hero:
        p_item = tf_w0.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9.5)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Captura Real de la Portada / Hero del Geoportal
    captura_hero = os.path.join(IMG_DIR, "09_atlas_portada_hero.png")
    agregar_imagen_con_marco(s13, captura_hero, 5.8, 1.65, 6.733, 4.65,
                             pie_fuente="Módulo Portada: Landing page institucional del Geoportal con selector de actores territoriales y accesos directos.")

    agregar_notas_orador(s13,
        "En el Objetivo Específico 3, el geoportal se encuentra en producción anticipada en atlasvgiuah.netlify.app. "
        "La interfaz de bienvenida implementa la metodología de Diseño Centrado en el Usuario: permite conmutar entre cuatro perfiles de actor, "
        "monitorea la conexión en vivo con las APIs espaciales de OpenStreetMap y GBIF, y ofrece acceso directo a los 10 módulos funcionales del Atlas "
        "bajo el alero del Proyecto Fondecyt F1261256."
    )

    # =========================================================================
    # SLIDE 14: RESULTADOS OE 3 — VISOR CARTOGRÁFICO INTERACTIVO (MÓDULO 00)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s14, "Resultados OE 3: Visor Cartográfico Interactivo y Funcionalidades SIG", 
                       categoria="10. Resultados — Objetivo Específico 3 (Continuación)",
                       subtitulo="Módulo 00: Navegación espacial multi-capa, Inspector Normativo PRC y herramientas en terreno")
    agregar_pie_pagina(s14, 14)

    # Columna Izquierda: Ficha Técnica del Visor
    agregar_tarjeta(s14, 0.8, 1.65, 4.8, 5.0)
    tb_w1 = s14.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.7))
    tf_w1 = tb_w1.text_frame
    tf_w1.word_wrap = True
    tf_w1.margin_left = tf_w1.margin_top = tf_w1.margin_right = tf_w1.margin_bottom = 0

    p = tf_w1.paragraphs[0]
    p.text = "Características del Visor Web (Módulo 00)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

    feat_visor = [
        ("Desarrollo Anticipado:", "Iniciado en semanas 4–5 para validar visualmente la geodatabase del OE 2 antes del plazo programado."),
        ("Tecnología Ligera:", "Single Page Application (SPA) en JavaScript Vanilla y Leaflet 1.9.4. Carga ultrarrápida sin frameworks pesados."),
        ("Conmutación Multi-Capa:", "Permite encender y apagar interactivamente las 108 capas oficiales del Estado y las 10 macrocategorías VGI."),
        ("Inspector Normativo PRC:", "Herramienta que permite consultar en vivo las 192 zonas del Plan Regulador Comunal de Santiago y generar certificados de información."),
        ("Herramientas de Terreno:", "Soporte de importación de capas del usuario en KMZ, KML, GeoJSON, GPX y CSV, más descargas enriquecidas con metadatos ISO.")
    ]
    for tit, desc in feat_visor:
        p_item = tf_w1.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9.5)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Captura de Pantalla Real del Visor Cartográfico
    captura_vis = os.path.join(IMG_DIR, "01_visor_cartografico.png")
    agregar_imagen_con_marco(s14, captura_vis, 5.8, 1.65, 6.733, 4.65,
                             pie_fuente="Módulo 00: Visor Cartográfico interactivo en producción con 118 capas activas sobre Barrio Brasil y campus UAH.")

    agregar_notas_orador(s14,
        "En esta lámina profundizamos en el Visor Cartográfico (Módulo 00). El visor permite explorar interactivamente las 118 capas, "
        "medir distancias y polígonos, importar archivos de terreno en múltiples formatos y consultar el Inspector Normativo del PRC de Santiago "
        "para conocer los usos de suelo permitidos, alturas máximas y coeficientes de constructibilidad de cualquier predio."
    )

    # =========================================================================
    # SLIDE 15: RESULTADOS OE 3 — MÓDULOS EN VIVO (PARTE 1)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s15, "Módulos Especializados en Vivo (1/2): APIs y Datos Abiertos", 
                       categoria="11. Módulos del Geoportal en Producción",
                       subtitulo="Conexión en tiempo real con Overpass QL, HeiGIT ohsome y GBIF Darwin Core")
    agregar_pie_pagina(s15, 15)

    # 3 Columnas con capturas reales de los módulos 01, 02 y 03
    mods_1 = [
        ("Módulo 01: Overpass QL", "Consultas sintácticas en vivo a servidores de OpenStreetMap para las 10 macrocategorías barriales.", "04_explorador_overpass.png"),
        ("Módulo 02: Calidad ohsome", "Consulta directa a la API de HeiGIT (Univ. Heidelberg) para medir masa crítica y densidad de mapeo.", "05_calidad_ohsome.png"),
        ("Módulo 03: Biodiversidad GBIF", "Acceso a registros de ciencia ciudadana (Darwin Core / iNaturalist) de flora y fauna en Barrio Brasil.", "06_biodiversidad_gbif.png")
    ]
    for mi, (mt, md, mimg) in enumerate(mods_1):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s15, mx, 1.65, 3.75, 5.0)
        
        tb_m = s15.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(3.45), Inches(1.1))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p = tf_m.paragraphs[0]
        p.text = mt
        p.font.name = FONT_NAME
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(2)
        p2 = tf_m.add_paragraph()
        p2.text = md
        p2.font.name = FONT_NAME
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = COLOR_NEGRO

        # Imagen
        img_p = os.path.join(IMG_DIR, mimg)
        agregar_imagen_con_marco(s15, img_p, mx + 0.15, 2.95, 3.45, 3.4,
                                 pie_fuente=f"Captura en vivo: {mt.split(':')[0]}.")

    agregar_notas_orador(s15,
        "El geoportal cuenta con 10 módulos funcionales. En esta lámina vemos los módulos 01, 02 y 03, que conectan con APIs externas en vivo. "
        "El Módulo 01 permite construir y ejecutar consultas sintácticas en Overpass QL hacia OpenStreetMap; el Módulo 02 evalúa la calidad "
        "intrínseca mediante ohsome de la Universidad de Heidelberg; y el Módulo 03 extrae en vivo las observaciones de biodiversidad biológica "
        "desde GBIF bajo el estándar Darwin Core."
    )

    # =========================================================================
    # SLIDE 16: RESULTADOS OE 3 — MÓDULOS EN VIVO (PARTE 2)
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s16, "Módulos Especializados en Vivo (2/2): Metadatos, Diccionario e Indicadores", 
                       categoria="12. Módulos del Geoportal en Producción (Continuación)",
                       subtitulo="Interoperabilidad ISO 19115, catálogo territorial y panel de análisis dimensional")
    agregar_pie_pagina(s16, 16)

    mods_2 = [
        ("Módulo 05: Metadatos ISO 19115", "Generador y exportador de fichas XML ISO 19139 conforme al perfil nacional IDE Chile / SNIT v2.0.", "03_metadatos_iso.png"),
        ("Módulo 06: Diccionario (134)", "Catálogo exhaustivo de 134 descriptores territoriales, documentando 48 oficiales vs 86 brechas VGI.", "07_diccionario_territorial.png"),
        ("Módulo 09: Indicadores & Dimensiones", "Panel de análisis dimensional interactivo estructurado en las 5 dimensiones estratégicas.", "02_indicadores_dimensiones.png")
    ]
    for mi, (mt, md, mimg) in enumerate(mods_2):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s16, mx, 1.65, 3.75, 5.0)
        
        tb_m = s16.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(3.45), Inches(1.1))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p = tf_m.paragraphs[0]
        p.text = mt
        p.font.name = FONT_NAME
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(2)
        p2 = tf_m.add_paragraph()
        p2.text = md
        p2.font.name = FONT_NAME
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = COLOR_NEGRO

        # Imagen
        img_p = os.path.join(IMG_DIR, mimg)
        agregar_imagen_con_marco(s16, img_p, mx + 0.15, 2.95, 3.45, 3.4,
                                 pie_fuente=f"Captura en vivo: {mt.split(':')[0]}.")

    agregar_notas_orador(s16,
        "En esta lámina presentamos los módulos 05, 06 y 09. El Módulo 05 es clave para la interoperabilidad institucional, ya que genera "
        "archivos XML de metadatos bajo las normas ISO 19115 e ISO 19139 compatibles con GeoNetwork y el SNIT de Chile. El Módulo 06 despliega "
        "el diccionario de 134 descriptores; y el Módulo 09 aloja la estructura de las cinco dimensiones de análisis territorial que vimos anteriormente."
    )

    # =========================================================================
    # SLIDE 17: ARQUITECTURA TÉCNICA Y GOBERNANZA ($0 COSTO)
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s17, "Arquitectura Técnica, Repositorio y Gobernanza a Costo $0", 
                       categoria="13. Arquitectura del Sistema",
                       subtitulo="Estrategia Client-Side First, triple failover resiliente y control de versiones en GitHub")
    agregar_pie_pagina(s17, 17)

    # Columna Izquierda: Componentes de Arquitectura
    agregar_tarjeta(s17, 0.8, 1.65, 5.7, 5.0)
    tb_ar = s17.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.7))
    tf_ar = tb_ar.text_frame
    tf_ar.word_wrap = True
    tf_ar.margin_left = tf_ar.margin_top = tf_ar.margin_right = tf_ar.margin_bottom = 0

    p = tf_ar.paragraphs[0]
    p.text = "Arquitectura Híbrida y Estrategia Triple Failover"
    p.font.name = FONT_NAME
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(4)

    arq_items = [
        ("Client-Side First (SPA):", "Todo el procesamiento y renderizado ocurre en el navegador del usuario mediante JavaScript puro, logrando costo $0/mes en servidores."),
        ("PostgreSQL 17 + PostGIS 3.3:", "Base de datos espacial alojada en Supabase Cloud con 129.262 entidades vectoriales indexadas con árboles espaciales GIST."),
        ("Mecanismo Triple Failover:", "Garantiza resiliencia total y funcionamiento continuo:\n  1. Consulta espacial RPC PostGIS recortada por Bounding Box (<200 ms).\n  2. CDN Edge de alta velocidad en Supabase Storage.\n  3. Fallback local autónomo en el repositorio (data/*.geojson)."),
        ("CI/CD Automatizado:", "Integración continua con GitHub Actions y despliegue automático en Netlify en menos de 30 segundos tras cada commit."),
        ("Trazabilidad y Open Source:", "Repositorio público y auditable, con licenciamiento tripartito: ODbL 1.0 (OSM), CC-BY 4.0 (GBIF/textos) y MIT/GPL (código).")
    ]
    for tit, desc in arq_items:
        p_item = tf_ar.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(9.5)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Dos Capturas de GitHub (Repositorio y Commits)
    captura_gh = os.path.join(IMG_DIR, "10_github_repositorio.png")
    agregar_imagen_con_marco(s17, captura_gh, 6.8, 1.65, 5.733, 2.15,
                             pie_fuente="Repositorio público en GitHub: código fuente, geoprocesos y documentación abierta.")

    captura_commits = os.path.join(IMG_DIR, "11_github_commits.png")
    agregar_imagen_con_marco(s17, captura_commits, 6.8, 4.35, 5.733, 2.15,
                             pie_fuente="Registro de commits, trazabilidad técnica continua y pipeline de integración CI/CD.")

    agregar_notas_orador(s17,
        "La arquitectura técnica fue diseñada para ser sostenible y transferible sin costos de mantenimiento para la Universidad. "
        "Implementamos una estrategia Client-Side First con triple failover: primero intenta consultar las funciones espaciales en PostGIS; "
        "si la red falla, consume el CDN global de almacenamiento; y si no hay internet, el sistema conmuta a los archivos locales. "
        "Todo el código fuente, las capas y el historial de commits están versionados públicamente en GitHub bajo estándares de ciencia abierta."
    )

    # =========================================================================
    # SLIDE 18: SÍNTESIS DE PRODUCTOS ENTREGADOS A LAS 150 HORAS
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s18, "Síntesis de Productos Entregados (Corte 150 Horas)", 
                       categoria="14. Balance de Productos y Entregables",
                       subtitulo="Estado de cumplimiento respecto a los compromisos formales del Plan de Trabajo")
    agregar_pie_pagina(s18, 18)

    filas_prod = [
        ["OE", "Producto Comprometido en Plan de Trabajo", "Medio de Verificación / Archivo en Repositorio", "Estado de Avance (150 hrs)"],
        ["OE 1", "Ficha técnica y caracterización del proyecto", "docs/FICHA_TECNICA_PROYECTO.docx / Plan Trabajo UAH", "100% Entregado y aprobado"],
        ["OE 1", "Catálogo de categorías temáticas OSM y GBIF", "docs/categorias_tematicas_osm.xlsx (4 hojas, 134 tags)", "100% Entregado y normalizado"],
        ["OE 1", "Definición conceptual y 4 perfiles de usuarios", "docs/TRAZABILIDAD_ACADEMICA.md (Secciones 2 y 3)", "100% Documentado y aplicado"],
        ["OE 2", "Geodatabase VGI y oficial (118 capas)", "src/data/ (214 archivos GeoJSON, 3,73 GB; PostGIS 17)", "100% Consolidado y auditado"],
        ["OE 2", "Catálogo de fuentes VGI y metadatos", "docs/catalogo_fuentes_vgi.xlsx y perfil_metadatos_vgi.xlsx", "100% Generado en Excel y JSON"],
        ["OE 2", "Auditoría de calidad y MetaCalidad WLC v2.0", "docs/ANALISIS_METACALIDAD.md (118 capas auditadas)", "100% Evaluado (97,88% IGV)"],
        ["OE 3", "Estándar cartográfico e identidad gráfica", "src/css/estilos.css, src/index.html y MANUAL_USO.md", "85% Implementado en producción"],
        ["OE 3", "Visor web interactivo y geoportal en vivo", "https://atlasvgiuah.netlify.app/ (10 módulos funcionales)", "80% Operativo anticipadamente"],
        ["OE 4", "Protocolo de validación y transferibilidad", "scripts/ (15 scripts) y PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md", "25% Iniciado para fase final"]
    ]

    t_pr = s18.shapes.add_table(10, 4, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.0))
    tbl_pr = t_pr.table
    w_pr = [Inches(0.9), Inches(4.3), Inches(4.3), Inches(2.233)]
    for ci, w in enumerate(w_pr):
        tbl_pr.columns[ci].width = w

    for ri, fila in enumerate(filas_prod):
        for ci, val in enumerate(fila):
            c = tbl_pr.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(9.5)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(9)
                p.font.color.rgb = COLOR_NEGRO
                if ci == 0:
                    p.alignment = PP_ALIGN.CENTER
                    p.font.bold = True
                    p.font.color.rgb = COLOR_AZUL_UAH
                elif ci == 3:
                    p.alignment = PP_ALIGN.CENTER
                    p.font.bold = True
                    p.font.color.rgb = COLOR_AZUL_UAH if "100%" in val else COLOR_AZUL_SEC
                else:
                    p.alignment = PP_ALIGN.LEFT
            set_cell_border(c, "CBD5E1", "8000")

    agregar_notas_orador(s18,
        "Esta tabla sintetiza el estado de cumplimiento de los productos comprometidos ante la coordinación de prácticas. "
        "Todos los productos comprometidos para la primera mitad (OE 1 y base del OE 2) han sido concluidos y respaldados documentalmente "
        "en el repositorio institucional. Adicionalmente, hemos avanzado de forma anticipada en los productos del OE 3, entregando un visor web "
        "completamente funcional en producción en lugar de un boceto estático."
    )

    # =========================================================================
    # SLIDE 19: PLAN DE TRABAJO SEGUNDA MITAD (SEMANAS 6 A 11 / 150 HRS RESTANTES)
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s19, "Plan de Trabajo para la Segunda Mitad (150 Horas Restantes)", 
                       categoria="15. Proyección y Próximos Pasos",
                       subtitulo="Hitos 6 a 10 · Semanas 6 a 11 (08 de octubre al 12 de noviembre de 2026)")
    agregar_pie_pagina(s19, 19)

    # 4 Tarjetas horizontales de fases restantes
    fases_rest = [
        ("Semanas 6–7 (08 al 16 Oct)", "Hito 6: Formulación de Cruces Espaciales y Cobertura Barrial", [
            "• Ejecución de geoprocesos de proximidad a equipamientos críticos (salud DEIS, Metro L1/L2/L5, áreas verdes).",
            "• Cálculo de densidades y accesibilidad peatonal a escala de Manzana Censal 2024 y Unidad Vecinal.",
            "• Calibración preliminar de indicadores en las 5 dimensiones analíticas para el diagnóstico barrial."
        ]),
        ("Semanas 8–9 (19 al 30 Oct)", "Hitos 7 y 8: Refinamiento Cartográfico y Consolidación del Atlas Funcional", [
            "• Fortalecimiento de la simbología cartográfica e interoperabilidad del visor Leaflet con filtros avanzados.",
            "• Incorporación de exportador de reportes PDF sintéticos por Unidad Vecinal con indicadores clave.",
            "• Consolidación final de la base PostGIS y revisión exhaustiva de consistencia topológica."
        ]),
        ("Semana 10 (02 al 06 Nov)", "Hito 9: Validación Empírica con Usuarios de Distinto Nivel en SIG/VGI (OE 4)", [
            "• Aplicación de pruebas de usabilidad y tareas tipo a 4 perfiles: funcionarios municipales, vecinos, voluntarios y académicos.",
            "• Recolección sistemática de feedback, tasas de éxito en búsqueda de capas y tiempos de interacción.",
            "• Ajustes y mejoras directas en la interfaz web a partir de la retroalimentación obtenida."
        ]),
        ("Semana 11 (09 al 12 Nov)", "Hito 10: Manuales de Transferibilidad, Informe Final y Entrega de Práctica", [
            "• Redacción del Manual Metodológico para el Departamento de Geografía UAH y Proyecto Fondecyt F1261256.",
            "• Guía de administración, actualización de datos con scripts Python y mantenimiento a costo $0.",
            "• Elaboración y entrega del Informe Final de Práctica Profesional y preparación del examen de título/defensa."
        ])
    ]

    card_y_start = 1.65
    card_h = 1.15
    card_gap_y = 0.14
    for fi, (sem, hit, acts) in enumerate(fases_rest):
        cy = card_y_start + fi * (card_h + card_gap_y)
        agregar_tarjeta(s19, 0.8, cy, 11.733, card_h)
        
        # Bloque fecha a la izquierda
        tb_f = s19.shapes.add_textbox(Inches(1.0), Inches(cy + 0.12), Inches(3.0), Inches(0.9))
        tf_f = tb_f.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
        p_sem = tf_f.paragraphs[0]
        p_sem.text = sem
        p_sem.font.name = FONT_NAME
        p_sem.font.size = Pt(11)
        p_sem.font.bold = True
        p_sem.font.color.rgb = COLOR_AZUL_UAH
        p_sem.space_after = Pt(2)
        p_hit = tf_f.add_paragraph()
        p_hit.text = hit
        p_hit.font.name = FONT_NAME
        p_hit.font.size = Pt(9.5)
        p_hit.font.bold = True
        p_hit.font.color.rgb = COLOR_AZUL_SEC

        # Bloque actividades a la derecha
        tb_act = s19.shapes.add_textbox(Inches(4.2), Inches(cy + 0.08), Inches(8.133), Inches(1.0))
        tf_act = tb_act.text_frame
        tf_act.word_wrap = True
        tf_act.margin_left = tf_act.margin_top = tf_act.margin_right = tf_act.margin_bottom = 0
        for act in acts:
            p_a = tf_act.add_paragraph()
            p_a.text = act
            p_a.font.name = FONT_NAME
            p_a.font.size = Pt(8.5)
            p_a.font.color.rgb = COLOR_NEGRO
            p_a.space_after = Pt(1)

    agregar_notas_orador(s19,
        "Para las 150 horas restantes (semanas 6 a 11), el plan de trabajo se estructura en cuatro etapas correlativas. "
        "En las semanas 6 y 7 nos enfocaremos en los cruces espaciales y modelos de cobertura barrial; "
        "en las semanas 8 y 9 consolidaremos el atlas funcional; en la semana 10 realizaremos la validación con usuarios tipo (OE 4); "
        "y en la última semana cerraremos la redacción del informe final y los manuales de transferibilidad institucional para asegurar "
        "que el Departamento de Geografía y los investigadores del Fondecyt puedan continuar actualizando la plataforma de manera autónoma."
    )

    # =========================================================================
    # SLIDE 20: CONCLUSIONES Y CIERRE FORMAL
    # =========================================================================
    s20 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s20, "Conclusiones Principales y Discusión Crítica", 
                       categoria="16. Conclusiones y Cierre",
                       subtitulo="Aportes a la gestión territorial y proyección hacia la culminación de la práctica profesional")
    agregar_pie_pagina(s20, 20)

    # 3 Tarjetas Verticales de Conclusiones
    c_w = 3.75
    c_gap = 0.24

    conclusiones = [
        ("Logros del Período (150 hrs)", [
            "OE 1 cumplido al 100%: 10 categorías VGI, 4 usuarios-tipo y 134 descriptores formalizados.",
            "Geodatabase consolidada: 118 capas activas (2.560 MB) y 3.730 MB en 214 archivos GeoJSON en disco.",
            "Calidad garantizada: Auditoría WLC v2.0 bajo ISO 19157 alcanzando un 97,88% IGV (Grado A+ Excelente en 116 capas).",
            "Geoportal en producción anticipada con 10 módulos funcionales operativos y costo $0/mes."
        ]),
        ("Aporte a la Gestión Territorial", [
            "Democratización de la información: Primera IDE local abierta de Barrio Brasil accesible sin licencias privativas.",
            "Subsanación de vacíos estatales: 86 brechas cubiertas gracias al rol de los ciudadanos como sensores activos.",
            "Auditoría urbana en tiempo real: Integración del PRC Santiago (192 zonas) con semáforos UOCT y equipamiento.",
            "Gobernanza ética de datos: Separación jurídica estricta entre Ley 20.285 (Estado), ODbL 1.0 (OSM) y CC-BY 4.0 (GBIF)."
        ]),
        ("Desafíos de la Segunda Mitad", [
            "Cruces espaciales avanzados: Calibrar empíricamente los indicadores de proximidad y cobertura territorial.",
            "Validación empírica con usuarios: Evaluar usabilidad del geoportal con personas de distinto nivel de conocimiento en SIG/VGI (OE 4).",
            "Transferibilidad efectiva: Dejar manuales claros que permitan al centro de práctica sostener el proyecto a largo plazo.",
            "Aporte al Fondecyt F1261256: Contribuir con un prototipo metodológico transferible para la investigación en Geografía."
        ])
    ]

    for ci, (ctit, citems) in enumerate(conclusiones):
        cx = 0.8 + ci * (c_w + c_gap)
        agregar_tarjeta(s20, cx, 1.65, c_w, 4.35)
        
        # Cabecera tarjeta
        tb_c = s20.shapes.add_textbox(Inches(cx + 0.15), Inches(1.8), Inches(c_w - 0.3), Inches(0.45))
        tf_c = tb_c.text_frame
        p = tf_c.paragraphs[0]
        p.text = ctit
        p.font.name = FONT_NAME
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(4)

        # Bullets
        tb_cb = s20.shapes.add_textbox(Inches(cx + 0.15), Inches(2.35), Inches(c_w - 0.3), Inches(3.5))
        tf_cb = tb_cb.text_frame
        tf_cb.word_wrap = True
        tf_cb.margin_left = tf_cb.margin_top = tf_cb.margin_right = tf_cb.margin_bottom = 0
        for item in citems:
            p_it = tf_cb.add_paragraph()
            p_it.text = f"• {item}"
            p_it.font.name = FONT_NAME
            p_it.font.size = Pt(9.5)
            p_it.font.color.rgb = COLOR_NEGRO
            p_it.space_after = Pt(6)

    # Franja inferior de cierre y agradecimientos
    agregar_tarjeta(s20, 0.8, 6.1, 11.733, 0.65, bg_color=COLOR_AZUL_UAH, border_color=COLOR_AZUL_UAH)
    tb_pie_final = s20.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.333), Inches(0.55))
    tf_pf = tb_pie_final.text_frame
    tf_pf.margin_left = tf_pf.margin_top = tf_pf.margin_right = tf_pf.margin_bottom = 0
    p_pf = tf_pf.paragraphs[0]
    p_pf.text = "Muchas gracias por su atención.  |  Juan Pablo Lescano Villegas (GEOJOTA)  |  atlasvgiuah.netlify.app"
    p_pf.font.name = FONT_NAME
    p_pf.font.size = Pt(11)
    p_pf.font.bold = True
    p_pf.font.color.rgb = COLOR_BLANCO
    p_pf.alignment = PP_ALIGN.CENTER

    agregar_notas_orador(s20,
        "A modo de conclusión, las primeras 150 horas de práctica han permitido demostrar la viabilidad técnica y metodológica "
        "de construir una Infraestructura de Datos Espaciales comunitaria y abierta. La geodatabase activa suma 2,56 gigabytes, "
        "con certificación de metadatos del 97,88% bajo el modelo WLC v2.0 e inyección universal en descargas. En la segunda mitad "
        "nos enfocaremos en consolidar los modelos territoriales y realizar las pruebas empíricas con usuarios de distinto nivel de conocimiento geoespacial. "
        "Quedo a su completa disposición para responder a las preguntas y observaciones de la comisión evaluadora. Muchas gracias."
    )

    prs.save(OUTPUT_PPTX)
    print(f"✅ Presentación generada exitosamente en: {OUTPUT_PPTX}")

if __name__ == "__main__":
    crear_presentacion()
