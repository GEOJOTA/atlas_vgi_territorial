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

    total_slides = 18

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
        ("OE 4: Validación & Traspaso", "Sem 11 · 36 hrs", "Validar el prototipo del Atlas con 3–5 usuarios potenciales del territorio y asegurar su transferibilidad mediante manuales y documentación técnica reproducible.", "PROGRAMADO FASE FINAL", COLOR_GRIS_TEXTO)
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
        "el OE 3 levanta el visor web cartográfico; y el OE 4 cierra el ciclo mediante la validación con usuarios del territorio "
        "y la transferencia técnica. A las 150 horas, el OE 1 está totalmente cerrado, el OE 2 está consolidado con 118 capas evaluadas, "
        "y el OE 3 se adelantó en producción web."
    )

    # =========================================================================
    # SLIDE 4: PLAN METODOLÓGICO Y FLUJO DE TRABAJO
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s4, "Plan Metodológico y Procedimientos de Análisis", 
                       categoria="3. Metodología",
                       subtitulo="Matriz estructurada de recopilación, procesamiento geoespacial y entregables por objetivo")
    agregar_pie_pagina(s4, 4)

    # Tabla metodológica
    filas_metodo = [
        ["OE", "Técnica de Recopilación / Fuentes", "Herramientas de Trabajo", "Procedimientos de Análisis Espacial", "Entregables del Plan"],
        ["OE 1", "Revisión bibliográfica VGI (Haklay, Goodchild)\nAPIs Overpass, ohsome v1/v2, GBIF\nCatálogo de capas oficiales IDE Chile", "Python 3 · Markdown\nGit / GitHub · QGIS 3.x\nLibros OpenXML Excel", "Diseño conceptual de 10 macrocategorías\nIdentificación de 4 perfiles de usuarios (DCU)\nDiagnóstico de 86 brechas de información", "Ficha del Proyecto\nCategorías Temáticas (.xlsx)\nDocumento de Arquitectura"],
        ["OE 2", "Extracción masiva Overpass QL (nwr)\nGBIF Occurrence API (Darwin Core)\n108 capas oficiales IDE Chile (MINVU, INE)", "GeoPandas · Shapely · PyShp\nPostgreSQL 17 + PostGIS 3.3\nOpenPyXL · Scripts Python", "Normalización vectorial de 118 capas\nReproyección a UTM 19S (EPSG:32719)\nAuditoría de MetaCalidad ISO 19157 (98.6%)", "Geodatabase 118 capas (1,33 GB)\nMatriz MetaCalidad (JSON/XLSX)\nPerfil de Metadatos ISO 19115"],
        ["OE 3", "Estándares cartográficos OGC / ICA\nServicios WMS/WFS y GeoJSON RFC 7946\nFeedback continuo de navegación", "Vanilla JavaScript (SPA)\nLeaflet 1.9.4 · HTML5 / CSS3\nNetlify CI/CD · Supabase CDN", "Diseño cartográfico web interactivo\nInspector normativo PRC Santiago (192 zonas)\nTriple failover de acceso a datos ($0/mes)", "Geoportal en producción Netlify\n10 módulos funcionales operativos\nManual de uso y documentación"],
        ["OE 4", "Pruebas de usabilidad presenciales\nCuestionario semi-estructurado (3–5 usuarios)\nNormas de transferibilidad UAH", "Formularios de validación\nProtocolos de replicabilidad\nMemoria técnica en Word", "Sistematización cualitativa de observaciones\nAjuste y calibración del geoportal\nProtocolo de gobernanza independiente", "Versión validada del Atlas\nManual para actualización continua\nInforme Final de Práctica"]
    ]

    tabla_shape = s4.shapes.add_table(5, 5, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.0))
    tbl = tabla_shape.table
    col_w_m = [Inches(0.9), Inches(2.9), Inches(2.2), Inches(3.0), Inches(2.733)]
    for ci, w in enumerate(col_w_m):
        tbl.columns[ci].width = w

    for ri, row in enumerate(filas_metodo):
        for ci, val in enumerate(row):
            cell = tbl.cell(ri, ci)
            cell.text = val
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(10)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(9)
                p.font.color.rgb = COLOR_NEGRO
                if ci == 0:
                    p.font.bold = True
                    p.font.color.rgb = COLOR_AZUL_UAH
                    p.alignment = PP_ALIGN.CENTER
            set_cell_border(cell, "CBD5E1", "8000")

    agregar_notas_orador(s4,
        "El plan metodológico detalla cómo se operacionaliza cada objetivo mediante herramientas de software libre y estándares internacionales. "
        "Destacamos el uso de Python con GeoPandas para automatizar las descargas de OSM y GBIF; QGIS para la verificación topológica; "
        "PostGIS en la nube para la persistencia espacial; y JavaScript con Leaflet para la interfaz web. Esto asegura total reproducibilidad "
        "sin incurrir en costos de software privativo."
    )

    # =========================================================================
    # SLIDE 5: ESTADO DE AVANCE Y CARTA GANTT (CORTE 150 HORAS / SEMANA 6)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s5, "Estado de Avance y Carta Gantt (Corte 150 Horas)", 
                       categoria="4. Cronograma y Cumplimiento",
                       subtitulo="50 días hábiles (300 hrs) · Marcador de medio término: Miércoles 07 de octubre de 2026 (Día hábil 25)")
    agregar_pie_pagina(s5, 5)

    # Resumen de KPIs de horas
    kpis = [
        ("Horas Programadas", "300 hrs", "11 semanas laborales"),
        ("Horas Cumplidas", "150 hrs", "25 días hábiles (50%)"),
        ("Hitos Cerrados", "H1, H2, H3, H4", "OE 1 completo (100%)"),
        ("Hitos en Progreso", "H5 y H8", "Calidad e IDE en vivo")
    ]
    for ki, (kt, kv, kd) in enumerate(kpis):
        kx = 0.8 + ki * (2.8 + 0.177)
        agregar_tarjeta(s5, kx, 1.6, 2.8, 0.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_k = s5.shapes.add_textbox(Inches(kx + 0.1), Inches(1.68), Inches(2.6), Inches(0.8))
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
        ["H5: Calidad de datos (MetaCalidad ISO 19157)", "OE 2", "", "", "", "", "", "■", "■", "", "", "", "", "85% En curso"],
        ["H6: Análisis territorial y modelo ranking", "OE 2", "", "", "", "", "", "", "■", "■", "", "", "", "Programado"],
        ["H7: Estándar cartográfico del Atlas", "OE 3", "", "", "", "", "", "", "", "■", "", "", "", "Iniciado"],
        ["H8: Geoportal web interactivo en producción", "OE 3", "", "", "", "", "", "■", "■", "■", "■", "", "", "80% Anticipado"],
        ["H9: Validación con 3–5 usuarios reales", "OE 4", "", "", "", "", "", "", "", "", "", "■", "", "Programado"],
        ["H10: Manuales, transferibilidad y entrega final", "OE 4", "", "", "", "", "", "", "", "", "", "", "■", "Programado"]
    ]

    tg = s5.shapes.add_table(11, 14, Inches(0.8), Inches(2.75), Inches(11.733), Inches(3.95))
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

    agregar_notas_orador(s5,
        "La Carta Gantt refleja exactamente la situación al día hábil número 25, que corresponde al 7 de octubre de 2026. "
        "En este punto de medio término hemos cumplido estrictamente las 150 horas asignadas. El Objetivo Específico 1 está "
        "cerrado al 100%. En el OE 2 hemos consolidado la geodatabase de 118 capas y la auditoría de MetaCalidad. Un logro "
        "destacado es que el desarrollo del geoportal interactivo (OE 3), originalmente fechado para semanas 8 a 10, fue anticipado "
        "y ya se encuentra operativo en producción."
    )

    # =========================================================================
    # SLIDE 6: RESULTADOS OE 1 — TAXONOMÍA VGI Y USUARIOS-TIPO
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s6, "Resultados OE 1: Arquitectura Conceptual y Taxonomías VGI", 
                       categoria="5. Resultados — Objetivo Específico 1",
                       subtitulo="10 Macro-categorías territoriales, 4 usuarios-tipo (DCU) y diccionario de 134 descriptores")
    agregar_pie_pagina(s6, 6)

    # Panel 1: Las 10 Macrocategorías
    agregar_tarjeta(s6, 0.8, 1.65, 5.7, 5.0)
    tb_cat = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.7))
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
    agregar_tarjeta(s6, 6.8, 1.65, 5.733, 5.0)
    tb_usr = s6.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.7))
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
        ("1. Institucional / Autoridad Pública", "MINVU, Municipio de Santiago, DTPM, UOCT, IDE Chile. Requiere contraste normativo con PRC Santiago, métricas de vialidad y auditoría oficial."),
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

    agregar_notas_orador(s6,
        "En el Objetivo 1 estructuramos la taxonomía del Atlas en 10 macrocategorías temáticas que van desde educación y comercio hasta "
        "biodiversidad y coberturas de suelo. Paralelamente, implementamos un enfoque de Diseño Centrado en el Usuario (DCU), formulando "
        "cuatro perfiles que orientan la plataforma: autoridades públicas, vecinos, voluntarios de OSM e investigadores académicos. "
        "Al contrastar la oferta de IDE Chile con las necesidades del barrio, descubrimos 86 brechas de información territorial que sólo "
        "la VGI es capaz de llenar."
    )

    # =========================================================================
    # SLIDE 7: RESULTADOS OE 2 — GEODATABASE DE 118 COMPONENTES
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s7, "Resultados OE 2: Geodatabase y Componentes Cartográficos", 
                       categoria="6. Resultados — Objetivo Específico 2",
                       subtitulo="Consolidación de 118 capas espaciales (108 oficiales + 10 VGI), 1.332,66 MB y doble geodesia conforme")
    agregar_pie_pagina(s7, 7)

    # 3 Tarjetas Superiores de Métricas
    met_db = [
        ("118 Capas Totales", "108 Oficiales Estado + 10 VGI", "100% integradas en WGS84 y PostGIS"),
        ("1.332,66 MB Vectoriales", "214 GeoJSONs físicos en disco", "Verificación SHA256 libre de punteros LFS"),
        ("Doble Geodesia Conforme", "WGS84 (4326) / UTM 19S (32719)", "Cálculo métrico riguroso (Snyder, 1987)")
    ]
    for mi, (mt, mv, md) in enumerate(met_db):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s7, mx, 1.65, 3.75, 1.05, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_m = s7.shapes.add_textbox(Inches(mx + 0.15), Inches(1.72), Inches(3.45), Inches(0.9))
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
    tb_tit_g = s7.shapes.add_textbox(Inches(0.8), Inches(2.85), Inches(11.733), Inches(0.3))
    p = tb_tit_g.text_frame.paragraphs[0]
    p.text = "Estructura Temática y Participación de la Geodatabase Consolidada:"
    p.font.name = FONT_NAME
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH

    filas_gdb = [
        ["Grupo Temático Consolidado", "Instituciones Custodias Principales", "Capas (N°)", "% Capas", "Volumen (MB)", "% Volumen"],
        ["Demografía y Vulnerabilidad Social", "INE (Censo 2024 en 5 niveles), MDSF (Registro Social de Hogares), MINVU", "19", "16,1%", "689,44 MB", "51,7%"],
        ["Normativa e Instrumentos IPT", "MINVU, Seremi Metropolitana, Municipios (PRC Santiago 192 zonas, PRMS)", "13", "11,0%", "207,00 MB", "15,5%"],
        ["Economía, Fomento e Inversión", "MDSF (Banco Integrado de Proyectos BIP), MOP, ODEPA, CNE Energía RM", "15", "12,7%", "203,67 MB", "15,3%"],
        ["Medio Ambiente y Recursos Hídricos", "Ministerio del Medio Ambiente, DGA, CONAF, Dirección Meteorológica", "21", "17,8%", "101,04 MB", "7,6%"],
        ["Movilidad, Red Vial y Tránsito", "MTT, UOCT (1.500+ cruces semaforizados RM), Metro S.A., EFE Ferrocarriles", "7", "5,9%", "66,88 MB", "5,0%"],
        ["Equipamiento Público y Patrimonio", "Consejo de Monumentos Nacionales (CMN), MINEDUC, MINSAL, IND", "28", "23,7%", "58,51 MB", "4,4%"],
        ["Seguridad, Bomberos y Justicia", "Carabineros de Chile, Cuerpos de Bomberos CBS, Ministerio de Justicia", "5", "4,2%", "0,93 MB", "0,1%"],
        ["VGI Comunitario (OSM + GBIF)", "Comunidad OpenStreetMap (10 macrocategorías) y GBIF Darwin Core", "10", "8,5%", "5,19 MB", "0,4%"],
        ["TOTAL / REPOSITORIO GLOBAL", "Base de datos universal del Atlas VGI UAH (100% interoperable)", "118", "100,0%", "1.332,66 MB", "100,0%"]
    ]

    tgdb = s7.shapes.add_table(10, 6, Inches(0.8), Inches(3.2), Inches(11.733), Inches(3.45))
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

    agregar_notas_orador(s7,
        "En el Objetivo 2 consolidamos la geodatabase completa del Atlas, compuesta por 118 capas espaciales que totalizan 1,33 gigabytes. "
        "Es importante destacar que el 91,5% de las capas son fuentes oficiales del Estado chileno (como el Censo 2024 del INE o los semáforos de la UOCT), "
        "mientras que el 8,5% restante corresponde a las 10 macrocategorías comunitarias de OSM y GBIF. Todas las capas han sido normalizadas "
        "con doble geodesia: WGS84 para la web y UTM Huso 19 Sur para el cálculo conforme de áreas y distancias según las fórmulas de Snyder."
    )

    # =========================================================================
    # SLIDE 8: RESULTADOS OE 2 — EVALUACIÓN DE METACALIDAD (ISO 19157)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s8, "Resultados OE 2: Auditoría Universal de MetaCalidad (ISO 19157)", 
                       categoria="7. Resultados — Calidad de Metadatos",
                       subtitulo="Evaluación objetiva sobre el 100% de la geodatabase: 98,6% IGMC Promedio (Grado A+ Excelente)")
    agregar_pie_pagina(s8, 8)

    # Columna Izquierda: Tabla de Dimensiones de MetaCalidad
    agregar_tarjeta(s8, 0.8, 1.65, 6.2, 5.0)
    tb_dim_t = s8.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.8), Inches(0.35))
    p = tb_dim_t.text_frame.paragraphs[0]
    p.text = "Cumplimiento por Dimensión de MetaCalidad (ISO 19157)"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH

    filas_dim = [
        ["Dimensión Evaluada", "Estándar / Marco", "Peso", "Puntaje", "Nivel"],
        ["1. Completitud Núcleo (MC)", "ISO 19115-1 Core (10 campos)", "30%", "95,2%", "A+ Excelente"],
        ["2. Conformidad Normativa (CC)", "ISO 19139 / OGC Geometrías", "20%", "100,0%", "A+ Excelente"],
        ["3. Linaje y Legalidad (LL)", "Ley 20.285 / ODbL / CC-BY", "25%", "100,0%", "A+ Excelente"],
        ["4. Resolución Espacial (RG)", "Snyder 1987 / EPSG:32719", "15%", "100,0%", "A+ Excelente"],
        ["5. Accesibilidad Operativa (AI)", "Integridad local y CDN Edge", "10%", "100,0%", "A+ Excelente"],
        ["ÍNDICE GLOBAL (IGMC)", "Modelo Ponderado Multi-Atributo", "100%", "98,6%", "Grado A+"]
    ]

    tdim = s8.shapes.add_table(7, 5, Inches(1.0), Inches(2.25), Inches(5.8), Inches(2.7))
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
    tb_inf_mc = s8.shapes.add_textbox(Inches(1.0), Inches(5.1), Inches(5.8), Inches(1.4))
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
    agregar_imagen_con_marco(s8, captura_man, 7.3, 1.65, 5.233, 4.65,
                             pie_fuente="Módulo 08: Auditoría y Matriz de MetaCalidad exportable en JSON, Markdown y Excel.")

    agregar_notas_orador(s8,
        "La evaluación de MetaCalidad es un componente distintivo de esta práctica profesional. Aplicamos un modelo de utilidad "
        "multi-atributo basado en la norma ISO 19157 para auditar las 118 capas según cinco dimensiones ortogonales. El resultado global "
        "arroja un 98,6% de conformidad, clasificando en Grado A+ Excelente. Esto garantiza que cada archivo en la geodatabase posee "
        "trazabilidad jurídica inequívoca, linaje certificado y atributos estandarizados exportables a la IDE nacional."
    )

    # =========================================================================
    # SLIDE 9: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 1)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s9, "Dimensiones de Análisis Territorial (Parte 1: Concepto, D1 y D2)", 
                       categoria="8. Dimensiones Estratégicas de Análisis",
                       subtitulo="Estructuración de las 118 capas en 5 dimensiones estratégicas para el diagnóstico barrial")
    agregar_pie_pagina(s9, 9)

    # Tarjeta Superior: El Concepto Detrás del Análisis
    agregar_tarjeta(s9, 0.8, 1.65, 11.733, 1.2, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_con = s9.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(11.333), Inches(1.0))
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
    agregar_tarjeta(s9, 0.8, 3.0, 5.7, 3.65)
    tb_d1 = s9.shapes.add_textbox(Inches(1.0), Inches(3.15), Inches(5.3), Inches(3.35))
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
        ("Alcance Territorial:", "Dinámica poblacional, estructura etaria, hogares, migración y estratificación socioterritorial en Barrio Brasil."),
        ("Componentes Oficiales Clave:", "Microdatos Censo 2024 en 5 escalas del INE (Marco regional, límites urbanos, distritos, zonas y manzanas censales)."),
        ("Vulnerabilidad Social:", "7 capas del Registro Social de Hogares (RSH) por unidad vecinal (género, niños/as, jóvenes, adultos mayores y tramos de vulnerabilidad socioeconómica CSE)."),
        ("Organizaciones Base:", "Catastro Campamentos MINVU 2024, Unidades Vecinales Ley N° 19.418 y equipamiento comunitario barrial."),
        ("Utilidad para Usuarios:", "Permite a juntas vecinales y a la SECPLA identificar manzanas con alta concentración de población mayor o infancias para focalizar programas públicos.")
    ]
    for tit, desc in b_d1:
        p_item = tf_d1.add_paragraph()
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

    # Dimensión 2: Socioeconómica
    agregar_tarjeta(s9, 6.8, 3.0, 5.733, 3.65)
    tb_d2 = s9.shapes.add_textbox(Inches(7.0), Inches(3.15), Inches(5.333), Inches(3.35))
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
        ("Comercio y Servicios VGI:", "365 entidades levantadas en Barrio Brasil (CAT-02 OSM): almacenes de abarrotes, panaderías patrimoniales, farmacias comunitarias y cafeterías."),
        ("Empleo y Actividad:", "Personas en RSH ocupadas y cotizantes formales, mercados mayoristas (ODEPA) y centros de telecomunicaciones (Ley de Torres)."),
        ("Utilidad para Usuarios:", "Comerciantes y estudiantes UAH pueden correlacionar la inversión pública del Estado con la vitalidad económica de los almacenes barriales.")
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

    agregar_notas_orador(s9,
        "En lugar de centrarnos en storyboards cerradas, abordamos el concepto metodológico: las 118 capas se estructuran en cinco dimensiones "
        "estratégicas. La Dimensión Sociodemográfica agrupa 19 capas, articulando el Censo 2024 a escala de manzana con el Registro Social de Hogares. "
        "La Dimensión Socioeconómica integra 18 capas, contrastando los grandes proyectos de inversión pública del BIP con el microcomercio "
        "de proximidad mapeado en OpenStreetMap."
    )

    # =========================================================================
    # SLIDE 10: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 2)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s10, "Dimensiones de Análisis Territorial (Parte 2: D3, D4 y D5)", 
                       categoria="8. Dimensiones Estratégicas de Análisis (Continuación)",
                       subtitulo="Socioambiental, Sociosanitaria y Sociourbana o Habitabilidad en Barrio Brasil")
    agregar_pie_pagina(s10, 10)

    col3_w = 3.75
    col3_gap = 0.24

    # D3: Socioambiental
    agregar_tarjeta(s10, 0.8, 1.65, col3_w, 5.05)
    tb_d3 = s10.shapes.add_textbox(Inches(0.95), Inches(1.8), Inches(col3_w - 0.3), Inches(4.7))
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
        ("Espacio Público Verde:", "Áreas Verdes Normativas MINVU / INE 2023, estándares CNDU y plazas públicas (CAT-05 OSM)."),
        ("Biodiversidad Urbana:", "390 registros en Barrio Brasil (CAT-08): arbolado de calles en OSM y observaciones Darwin Core de aves y flora en GBIF."),
        ("Coberturas de Suelo:", "CAT-10 OSM: áreas impermeables (asfalto, hormigón) vs superficies permeables y vegetación."),
        ("Monitoreo Estatal:", "Calidad de aire SINCA (MMA), estaciones meteorológicas, red hidrométrica DGA y vertederos ilegales."),
        ("Diagnóstico Barrial:", "Permite evaluar islas de calor y déficit de áreas verdes por habitante en torno al campus central UAH.")
    ]
    for tit, desc in b_d3:
        p_item = tf_d3.add_paragraph()
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

    # D4: Sociosanitaria
    agregar_tarjeta(s10, 0.8 + (col3_w + col3_gap), 1.65, col3_w, 5.05)
    tb_d4 = s10.shapes.add_textbox(Inches(0.95 + (col3_w + col3_gap)), Inches(1.8), Inches(col3_w - 0.3), Inches(4.7))
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
        ("Servicios de Salud:", "Zonificación y jurisdicción de los Servicios de Salud Metropolitano Central y Occidente."),
        ("Enfoque de Cuidados:", "Articula la oferta médica con la distribución de personas que requieren asistencia permanente."),
        ("Diagnóstico Barrial:", "Evidencia brechas de cobertura peatonal para personas con movilidad reducida hacia el CESFAM barrial.")
    ]
    for tit, desc in b_d4:
        p_item = tf_d4.add_paragraph()
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

    # D5: Sociourbana o Habitabilidad
    agregar_tarjeta(s10, 0.8 + 2 * (col3_w + col3_gap), 1.65, col3_w, 5.05)
    tb_d5 = s10.shapes.add_textbox(Inches(0.95 + 2 * (col3_w + col3_gap)), Inches(1.8), Inches(col3_w - 0.3), Inches(4.7))
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
        ("Planificación y Normativa:", "PRC Santiago con 192 zonas, Plan Regulador Metropolitano (PRMS), fajas de resguardo y áreas de riesgo."),
        ("Catastro y Huella Física:", "Catastro predial del SII y 1.673 edificaciones poligonales OSM (CAT-09) con tipologías residenciales y cités patrimoniales."),
        ("Movilidad y Semáforos:", "Red de semáforos conectados SC-RM (UOCT / MTT), estaciones de Metro L1/L2/L5, ciclovías oficiales (CAT-04) y red ferroviaria EFE."),
        ("Patrimonio Histórico:", "Zonas y Monumentos Nacionales (CMN), sitios de memoria e Inmuebles de Conservación Histórica (CAT-06)."),
        ("Accesibilidad Universal:", "185 rebajes de esquina y cruces peatonales accesibles mapeados en terreno (CAT-07).")
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

    agregar_notas_orador(s10,
        "Continuando con las dimensiones: La Dimensión Socioambiental integra 23 capas que permiten evaluar el déficit de áreas verdes "
        "y la presencia del arbolado urbano mapeado en OSM y GBIF. La Dimensión Sociosanitaria, aunque concentra tres capas clave, "
        "es fundamental para la geografía del cuidado al cruzar la población con dependencia funcional con la red de salud pública. "
        "Finalmente, la Dimensión Sociourbana o Habitabilidad es la más extensa con 55 capas, integrando la planificación urbana del PRC "
        "con los semáforos de la UOCT, el catastro predial del SII y la accesibilidad universal."
    )

    # =========================================================================
    # SLIDE 11: MARCO METODOLÓGICO: MODELO LINEAL DE RANKING TERRITORIAL
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s11, "Marco Metodológico: Enfoque hacia un Modelo Lineal de Ranking", 
                       categoria="9. Metodología de Síntesis Territorial",
                       subtitulo="Estructura analítica multicriterio (tipo SAW / MAUT) en desarrollo para los OE 2 y OE 4")
    agregar_pie_pagina(s11, 11)

    # Columna Izquierda: Principios del Modelo Lineal
    agregar_tarjeta(s11, 0.8, 1.65, 5.7, 5.0)
    tb_m1 = s11.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.7))
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
    agregar_tarjeta(s11, 6.8, 1.65, 5.733, 5.0)
    tb_m2 = s11.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.7))
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

    agregar_notas_orador(s11,
        "Respecto al índice sintético, es fundamental precisar que se encuentra actualmente en desarrollo y formulación. Por indicación "
        "metodológica, no presentamos fórmulas rígidas provisionales, pero sí definimos que adoptará la estructura de un modelo lineal "
        "aditivo o ranking multicriterio tipo SAW. Este enfoque es ampliamente utilizado en SIG por su transparencia axiomática: "
        "permite normalizar las cinco dimensiones en escala 0 a 100 y jerarquizar territorialmente las unidades vecinales sin sesgos algorítmicos, "
        "dejando las ponderaciones abiertas a la calibración con los usuarios en la fase final."
    )

    # =========================================================================
    # SLIDE 12: RESULTADOS OE 3 — PLATAFORMA WEB Y VISOR CARTOGRÁFICO EN VIVO
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s12, "Resultados OE 3: Plataforma Web y Visor Cartográfico en Producción", 
                       categoria="10. Resultados — Objetivo Específico 3",
                       subtitulo="Geoportal interactivo disponible en vivo en https://atlasvgiuah.netlify.app/")
    agregar_pie_pagina(s12, 12)

    # Columna Izquierda: Ficha Técnica del Geoportal
    agregar_tarjeta(s12, 0.8, 1.65, 4.8, 5.0)
    tb_w1 = s12.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.7))
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
        ("Herramientas de Terreno:", "Soporte de importación directa de capas del usuario en formatos KMZ, KML, GeoJSON, GPX y CSV.")
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
    agregar_imagen_con_marco(s12, captura_vis, 5.8, 1.65, 6.733, 4.65,
                             pie_fuente="Módulo 00: Visor Cartográfico interactivo en producción con capas activas sobre Barrio Brasil y campus UAH.")

    agregar_notas_orador(s12,
        "Uno de los logros más relevantes alcanzados en estas 150 horas es que el Objetivo Específico 3, que contemplaba el prototipo web "
        "para el segundo tramo de la práctica, se encuentra actualmente en producción. En la URL atlasvgiuah.netlify.app cualquier persona "
        "puede acceder al visor Leaflet, activar las 118 capas, explorar el polígono del Barrio Brasil e interactuar con el Inspector Normativo "
        "del Plan Regulador Comunal de Santiago."
    )

    # =========================================================================
    # SLIDE 13: RESULTADOS OE 3 — MÓDULOS EN VIVO (PARTE 1)
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s13, "Módulos Especializados en Vivo (1/2): APIs y Datos Abiertos", 
                       categoria="11. Módulos del Geoportal en Producción",
                       subtitulo="Conexión en tiempo real con Overpass QL, HeiGIT ohsome y GBIF Darwin Core")
    agregar_pie_pagina(s13, 13)

    # 3 Columnas con capturas reales de los módulos 01, 02 y 03
    mods_1 = [
        ("Módulo 01: Overpass QL", "Consultas sintácticas en vivo a servidores de OpenStreetMap para las 10 macrocategorías barriales.", "04_explorador_overpass.png"),
        ("Módulo 02: Calidad ohsome", "Consulta directa a la API de HeiGIT (Univ. Heidelberg) para medir masa crítica y densidad de mapeo.", "05_calidad_ohsome.png"),
        ("Módulo 03: Biodiversidad GBIF", "Acceso a registros de ciencia ciudadana (Darwin Core / iNaturalist) de flora y fauna en Barrio Brasil.", "06_biodiversidad_gbif.png")
    ]
    for mi, (mt, md, mimg) in enumerate(mods_1):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s13, mx, 1.65, 3.75, 5.0)
        
        tb_m = s13.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(3.45), Inches(1.1))
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
        agregar_imagen_con_marco(s13, img_p, mx + 0.15, 2.95, 3.45, 3.4,
                                 pie_fuente=f"Captura en vivo: {mt.split(':')[0]}.")

    agregar_notas_orador(s13,
        "El geoportal cuenta con 10 módulos funcionales. En esta lámina vemos los módulos 01, 02 y 03, que conectan con APIs externas en vivo. "
        "El Módulo 01 permite construir y ejecutar consultas sintácticas en Overpass QL hacia OpenStreetMap; el Módulo 02 evalúa la calidad "
        "intrínseca mediante ohsome de la Universidad de Heidelberg; y el Módulo 03 extrae en vivo las observaciones de biodiversidad biológica "
        "desde GBIF bajo el estándar Darwin Core."
    )

    # =========================================================================
    # SLIDE 14: RESULTADOS OE 3 — MÓDULOS EN VIVO (PARTE 2)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s14, "Módulos Especializados en Vivo (2/2): Metadatos, Diccionario e Indicadores", 
                       categoria="12. Módulos del Geoportal en Producción (Continuación)",
                       subtitulo="Interoperabilidad ISO 19115, catálogo territorial y panel de análisis dimensional")
    agregar_pie_pagina(s14, 14)

    mods_2 = [
        ("Módulo 05: Metadatos ISO 19115", "Generador y exportador de fichas XML ISO 19139 conforme al perfil nacional IDE Chile / SNIT v2.0.", "03_metadatos_iso.png"),
        ("Módulo 06: Diccionario (134)", "Catálogo exhaustivo de 134 descriptores territoriales, documentando 48 oficiales vs 86 brechas VGI.", "07_diccionario_territorial.png"),
        ("Módulo 09: Indicadores & Dimensiones", "Panel de análisis dimensional interactivo estructurado en las 5 dimensiones estratégicas.", "02_indicadores_dimensiones.png")
    ]
    for mi, (mt, md, mimg) in enumerate(mods_2):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s14, mx, 1.65, 3.75, 5.0)
        
        tb_m = s14.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(3.45), Inches(1.1))
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
        agregar_imagen_con_marco(s14, img_p, mx + 0.15, 2.95, 3.45, 3.4,
                                 pie_fuente=f"Captura en vivo: {mt.split(':')[0]}.")

    agregar_notas_orador(s14,
        "En esta lámina presentamos los módulos 05, 06 y 09. El Módulo 05 es clave para la interoperabilidad institucional, ya que genera "
        "archivos XML de metadatos bajo las normas ISO 19115 e ISO 19139 compatibles con GeoNetwork y el SNIT de Chile. El Módulo 06 despliega "
        "el diccionario de 134 descriptores; y el Módulo 09 aloja la estructura de las cinco dimensiones de análisis territorial que vimos anteriormente."
    )

    # =========================================================================
    # SLIDE 15: ARQUITECTURA TÉCNICA Y GOBERNANZA ($0 COSTO)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s15, "Arquitectura Técnica, Repositorio y Gobernanza a Costo $0", 
                       categoria="13. Arquitectura del Sistema",
                       subtitulo="Estrategia Client-Side First, triple failover resiliente y control de versiones en GitHub")
    agregar_pie_pagina(s15, 15)

    # Columna Izquierda: Componentes de Arquitectura
    agregar_tarjeta(s15, 0.8, 1.65, 5.7, 5.0)
    tb_ar = s15.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(4.7))
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

    # Columna Derecha: Captura de GitHub
    captura_gh = os.path.join(IMG_DIR, "10_github_repositorio.png")
    agregar_imagen_con_marco(s15, captura_gh, 6.8, 1.65, 5.733, 4.65,
                             pie_fuente="Repositorio público: github.com/GEOJOTA/atlas_vgi_uah (Pipeline CI/CD y trazabilidad total).")

    agregar_notas_orador(s15,
        "La arquitectura técnica fue diseñada para ser sostenible y transferible sin costos de mantenimiento para la Universidad. "
        "Implementamos una estrategia Client-Side First con triple failover: primero intenta consultar las funciones espaciales en PostGIS; "
        "si la red falla, consume el CDN global de almacenamiento; y si no hay internet, el sistema conmuta a los archivos locales. "
        "Todo el código fuente y las capas están versionados públicamente en GitHub bajo estándares de ciencia abierta."
    )

    # =========================================================================
    # SLIDE 16: SÍNTESIS DE PRODUCTOS ENTREGADOS A LAS 150 HORAS
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s16, "Síntesis de Productos Entregados (Corte 150 Horas)", 
                       categoria="14. Balance de Productos y Entregables",
                       subtitulo="Estado de cumplimiento respecto a los compromisos formales del Plan de Trabajo")
    agregar_pie_pagina(s16, 16)

    filas_prod = [
        ["OE", "Producto Comprometido en Plan de Trabajo", "Medio de Verificación / Archivo", "Estado de Avance (150 hrs)"],
        ["OE 1", "Ficha técnica y caracterización del proyecto", "Entregables/01_Ficha_Proyecto.docx", "100% Entregado y aprobado"],
        ["OE 1", "Catálogo de categorías temáticas OSM y GBIF", "categorias_tematicas_osm.xlsx (4 hojas, 134 tags)", "100% Entregado y normalizado"],
        ["OE 1", "Definición conceptual y 4 perfiles de usuarios", "TRAZABILIDAD_ACADEMICA.md (Sección 3 y 4)", "100% Documentado y aplicado"],
        ["OE 2", "Geodatabase VGI y oficial de Barrio Brasil", "src/data/ (214 archivos GeoJSON, 1,33 GB)", "100% Consolidado y auditado"],
        ["OE 2", "Catálogo de fuentes VGI y metadatos", "catalogo_fuentes_vgi.xlsx y perfil_metadatos_vgi.xlsx", "100% Generado en Excel y JSON"],
        ["OE 2", "Auditoría de calidad de datos (MetaCalidad)", "ANALISIS_METACALIDAD.md (118 capas auditadas)", "100% Evaluado (98,6% IGMC)"],
        ["OE 3", "Estándar cartográfico e identidad gráfica", "Manual de uso y estilos CSS unificados en web", "85% Implementado en producción"],
        ["OE 3", "Visor web interactivo y geoportal en vivo", "https://atlasvgiuah.netlify.app/ (10 módulos)", "80% Operativo anticipadamente"],
        ["OE 4", "Protocolo de validación y transferibilidad", "Guías de replicabilidad técnica en scripts/ y docs/", "25% Iniciado para fase final"]
    ]

    t_pr = s16.shapes.add_table(10, 4, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.0))
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

    agregar_notas_orador(s16,
        "Esta tabla sintetiza el estado de cumplimiento de los productos comprometidos ante la coordinación de prácticas. "
        "Todos los productos comprometidos para la primera mitad (OE 1 y base del OE 2) han sido concluidos y respaldados documentalmente. "
        "Adicionalmente, hemos avanzado de forma anticipada en los productos del OE 3, entregando un visor web completamente funcional "
        "en lugar de un boceto estático."
    )

    # =========================================================================
    # SLIDE 17: PLAN DE TRABAJO SEGUNDA MITAD (SEMANAS 6 A 11 / 150 HRS RESTANTES)
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s17, "Plan de Trabajo para la Segunda Mitad (150 Horas Restantes)", 
                       categoria="15. Proyección y Próximos Pasos",
                       subtitulo="Hitos 5 a 10 · Semanas 6 a 11 (08 de octubre al 12 de noviembre de 2026)")
    agregar_pie_pagina(s17, 17)

    # 4 Cajas Horizontales de Proyección por Hitos
    hitos_futuros = [
        ("Semanas 6–7 (08 al 16 Oct)", "Hito 5 (Cierre) y Hito 6: Formulación del Modelo Lineal y Cruces Espaciales",
         "• Finalizar la formulación matemática del modelo lineal aditivo / ranking territorial multicriterio.\n• Ejecutar cruces espaciales centro–borde en Barrio Brasil utilizando las 5 dimensiones estructuradas.\n• Generar mapas coropléticos de diagnóstico socioterritorial a escala de unidad vecinal y manzana."),
        ("Semanas 8–9 (19 al 30 Oct)", "Hitos 7 y 8: Refinamiento Cartográfico y Consolidación del Atlas Funcional",
         "• Formalizar el estándar cartográfico unificado (simbología, paleta de colores de alto contraste y leyendas).\n• Integrar las consultas espaciales del modelo lineal dentro de la interfaz interactiva del Módulo 09.\n• Realizar pruebas de rendimiento cross-browser (compatibilidad móvil, tablets y escritorio)."),
        ("Semana 10 (02 al 06 Nov)", "Hito 9: Validación Empírica con Usuarios Reales de Barrio Brasil (OE 4)",
         "• Aplicar pruebas de usabilidad guiadas con 3 a 5 usuarios reales (vecinos, dirigentes barriales, funcionarios SECPLA).\n• Levantar observaciones cualitativas mediante cuestionario semi-estructurado sobre utilidad y facilidad de uso.\n• Aplicar mejoras y rediseño iterativo basado directamente en la retroalimentación comunitaria."),
        ("Semana 11 (09 al 12 Nov)", "Hito 10: Manuales de Transferibilidad, Informe Final y Entrega de Práctica",
         "• Redacción del Manual de Uso del Atlas (para vecinos) y Manual de Mantenimiento Técnico (para UAH).\n• Consolidación del informe final de práctica profesional y memoria metodológica transferible al Fondecyt.\n• Cierre de la geodatabase definitiva y archivo del repositorio de código abierto en GitHub.")
    ]

    for hi, (h_sem, h_tit, h_desc) in enumerate(hitos_futuros):
        hy = 1.65 + hi * (1.18 + 0.12)
        agregar_tarjeta(s17, 0.8, hy, 11.733, 1.18)
        
        # Franja lateral izquierda
        franja = s17.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(hy), Inches(2.2), Inches(1.18))
        franja.fill.solid()
        franja.fill.fore_color.rgb = COLOR_AZUL_UAH if hi == 0 else (COLOR_AZUL_SEC if hi < 3 else COLOR_NEGRO)
        franja.line.fill.background()

        tf_f = franja.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
        p = tf_f.paragraphs[0]
        p.text = h_sem
        p.font.name = FONT_NAME
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLANCO
        p.alignment = PP_ALIGN.CENTER

        # Contenido
        tb_hc = s17.shapes.add_textbox(Inches(3.15), Inches(hy + 0.08), Inches(9.2), Inches(1.02))
        tf_hc = tb_hc.text_frame
        tf_hc.word_wrap = True
        tf_hc.margin_left = tf_hc.margin_top = tf_hc.margin_right = tf_hc.margin_bottom = 0

        p1 = tf_hc.paragraphs[0]
        p1.text = h_tit
        p1.font.name = FONT_NAME
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_AZUL_UAH
        p1.space_after = Pt(2)

        for l in h_desc.split("\n"):
            p_l = tf_hc.add_paragraph()
            p_l.text = l
            p_l.font.name = FONT_NAME
            p_l.font.size = Pt(9)
            p_l.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s17,
        "Para las 150 horas restantes, el plan de trabajo se concentra en tres prioridades: primero, consolidar el modelo lineal "
        "de ranking territorial y los cruces espaciales definitivos; segundo, llevar a cabo la validación participativa con tres a cinco "
        "usuarios reales del territorio en la semana 10; y tercero, redactar los manuales de transferencia que aseguren que el Departamento "
        "de Geografía y los investigadores del Fondecyt puedan continuar actualizando la plataforma de manera autónoma."
    )

    # =========================================================================
    # SLIDE 18: CONCLUSIONES Y CIERRE FORMAL
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s18, "Conclusiones Principales y Discusión Crítica", 
                       categoria="16. Conclusiones y Cierre",
                       subtitulo="Aportes a la gestión territorial y proyección hacia la culminación de la práctica profesional")
    agregar_pie_pagina(s18, 18)

    # 3 Tarjetas Verticales de Conclusiones
    c_w = 3.75
    c_gap = 0.24

    conclusiones = [
        ("Logros del Período (150 hrs)", [
            "OE 1 cumplido al 100%: 10 categorías VGI, 4 usuarios-tipo y 134 descriptores formalizados.",
            "Geodatabase territorial consolidada: 118 capas (108 oficiales + 10 VGI) y 1,33 GB analizados.",
            "Calidad garantizada: Auditoría universal bajo ISO 19157 alcanzando un 98,6% IGMC (Grado A+ Excelente).",
            "Geoportal en producción anticipada con 10 módulos funcionales operativos y costo $0/mes."
        ]),
        ("Aporte a la Gestión Territorial", [
            "Democratización de la información: Primera IDE local abierta de Barrio Brasil accesible sin licencias privativas.",
            "Subsanación de vacíos estatales: 86 brechas cubiertas gracias al rol de los ciudadanos como sensores activos.",
            "Auditoría urbana en tiempo real: Integración del PRC Santiago (192 zonas) con semáforos UOCT y equipamiento.",
            "Gobernanza ética de datos: Separación jurídica estricta entre Ley 20.285 (Estado), ODbL 1.0 (OSM) y CC-BY 4.0 (GBIF)."
        ]),
        ("Desafíos de la Segunda Mitad", [
            "Consolidación del ranking territorial: Calibrar empíricamente las 5 dimensiones mediante el modelo lineal aditivo.",
            "Validación comunitaria en terreno: Testear el geoportal con vecinos y autoridades de Barrio Brasil (OE 4).",
            "Transferibilidad efectiva: Dejar manuales claros que permitan al centro de práctica sostener el proyecto a largo plazo.",
            "Aporte al Fondecyt F1261256: Contribuir con un prototipo metodológico transferible para la investigación en Geografía."
        ])
    ]

    for ci, (ctit, citems) in enumerate(conclusiones):
        cx = 0.8 + ci * (c_w + c_gap)
        agregar_tarjeta(s18, cx, 1.65, c_w, 4.35)
        
        # Cabecera tarjeta
        tb_c = s18.shapes.add_textbox(Inches(cx + 0.15), Inches(1.8), Inches(c_w - 0.3), Inches(0.45))
        tf_c = tb_c.text_frame
        p = tf_c.paragraphs[0]
        p.text = ctit
        p.font.name = FONT_NAME
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(4)

        # Bullets
        tb_cb = s18.shapes.add_textbox(Inches(cx + 0.15), Inches(2.35), Inches(c_w - 0.3), Inches(3.5))
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
    agregar_tarjeta(s18, 0.8, 6.1, 11.733, 0.65, bg_color=COLOR_AZUL_UAH, border_color=COLOR_AZUL_UAH)
    tb_pie_final = s18.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.333), Inches(0.55))
    tf_pf = tb_pie_final.text_frame
    tf_pf.margin_left = tf_pf.margin_top = tf_pf.margin_right = tf_pf.margin_bottom = 0
    p_pf = tf_pf.paragraphs[0]
    p_pf.text = "Muchas gracias por su atención.  |  Juan Pablo Lescano Villegas (GEOJOTA)  |  atlasvgiuah.netlify.app"
    p_pf.font.name = FONT_NAME
    p_pf.font.size = Pt(11)
    p_pf.font.bold = True
    p_pf.font.color.rgb = COLOR_BLANCO
    p_pf.alignment = PP_ALIGN.CENTER

    agregar_notas_orador(s18,
        "A modo de conclusión, las primeras 150 horas de práctica han permitido demostrar la viabilidad técnica y metodológica "
        "de construir una Infraestructura de Datos Espaciales comunitaria y abierta. La geodatabase de 118 capas cuenta con certificación "
        "de metadatos del 98,6% y el visor web se encuentra operativo para toda la comunidad académica y vecinal. "
        "Quedo a su completa disposición para responder a las preguntas y observaciones de la comisión evaluadora. Muchas gracias."
    )

    prs.save(OUTPUT_PPTX)
    print(f"✅ Presentación generada exitosamente en: {OUTPUT_PPTX}")

if __name__ == "__main__":
    crear_presentacion()
