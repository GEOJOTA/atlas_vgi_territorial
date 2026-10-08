#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_ppt_estado_avance_blanco.py
===================================
Generador de la presentación formal de Estado de Avance (150 Horas / Hitos 1 a 5)
para la Práctica Profesional de Geografía - Universidad Alberto Hurtado (UAH).

ESTÁNDARES DE DISEÑO ESTRICTOS (Versión Corregida y Estandarizada):
- Fondo Blanco (#FFFFFF) en formato 16:9 widescreen estándar (13.33 x 7.50 pulgadas).
- Paleta sobria institucional: Azul UAH (#003366), Azul Secundario (#0F4C81), Negro (#111827) y Gris (#64748B).
- Tipografía Calibri estandarizada y ampliada:
  * Títulos de Lámina: Calibri 22pt Bold, Azul (#003366).
  * Categorías superiores: Calibri 10.5pt Bold, Azul Secundario (#0F4C81).
  * Subtítulos de Lámina: Calibri 12.5-13pt Regular, Gris (#64748B).
  * Títulos de Tarjetas / Secciones: Calibri 13.5-14pt Bold, Azul UAH (#003366).
  * Texto de Cuerpo / Bullets: Calibri 11-11.5pt Regular, Negro (#111827).
  * Tablas (Encabezados): Calibri 11-11.5pt Bold, Blanco sobre Azul (#003366).
  * Tablas (Celdas de Datos): Calibri 10-10.5pt Regular (legibilidad garantizada).
  * Pies de Figura / Fuentes: Calibri 9.5-10pt Cursiva, Gris (#64748B).
  * Pie de página institucional: Calibri 10pt Regular / 10.5pt Bold.
- CERO SUPERPOSICIONES GEOMÉTRICAS:
  * Pie de página separado: texto a la izquierda (w=8.5 in) y número de lámina a la derecha (left=9.8 in).
  * Un solo contenedor de texto por tarjeta para evitar solapamientos entre títulos y bullets.
  * Alturas de tabla y márgenes verticales calculados para evitar desbordes.
- Preservación íntegra de las 12 imágenes (Logo UAH + 11 capturas de pantalla, incluyendo las dos añadidas por el usuario).
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

# Colores Oficiales UAH
COLOR_BLANCO = RGBColor(255, 255, 255)
COLOR_NEGRO = RGBColor(17, 24, 39)          # #111827 (Carbón)
COLOR_AZUL_UAH = RGBColor(0, 51, 102)       # #003366 (Azul Institucional UAH)
COLOR_AZUL_SEC = RGBColor(15, 76, 129)      # #0F4C81 (Azul Secundario)
COLOR_AZUL_CLARO = RGBColor(240, 247, 255)  # #F0F7FF (Fondo sutil para tarjetas)
COLOR_GRIS_FONDO = RGBColor(248, 250, 252)  # #F8FAFC
COLOR_GRIS_BORDE = RGBColor(203, 213, 225)  # #CBD5E1 (Borde fino)
COLOR_GRIS_TEXTO = RGBColor(100, 116, 139)  # #64748B (Texto secundario)

FONT_NAME = "Calibri"

def set_cell_border(cell, color="CBD5E1", sz="8000"):
    tcPr = cell._tc.get_or_add_tcPr()
    for border_name in ['lnL', 'lnR', 'lnT', 'lnB']:
        ln = parse_xml(f'<a:{border_name} {nsdecls("a")} w="{sz}" cmpd="s"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:{border_name}>')
        tcPr.append(ln)

def crear_presentacion():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.500)
    blank_layout = prs.slide_layouts[6]

    total_slides = 20

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

        # Categoría
        p_cat = tf.paragraphs[0]
        p_cat.text = categoria.upper()
        p_cat.font.name = FONT_NAME
        p_cat.font.size = Pt(10.5)
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

        # Número de lámina a la derecha (comienza en 9.8 pulgadas, CERO solapamiento)
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
            
            # Pie de fuente con tamaño estandarizado a 9.5-10pt
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

    franja_sup = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.5), Inches(11.733), Inches(0.08))
    franja_sup.fill.solid()
    franja_sup.fill.fore_color.rgb = COLOR_AZUL_UAH
    franja_sup.line.fill.background()

    if os.path.exists(LOGO_UAH):
        s1.shapes.add_picture(LOGO_UAH, Inches(0.8), Inches(0.95), Inches(1.5), Inches(1.5))

    tb_inst = s1.shapes.add_textbox(Inches(2.55), Inches(0.95), Inches(9.98), Inches(1.1))
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
    tb_tit = s1.shapes.add_textbox(Inches(0.8), Inches(2.50), Inches(11.733), Inches(1.90))
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

    # Ficha de antecedentes formales
    agregar_tarjeta(s1, 0.8, 4.65, 11.733, 1.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_GRIS_BORDE)
    tb_ficha = s1.shapes.add_textbox(Inches(1.05), Inches(4.78), Inches(11.233), Inches(1.70))
    tf_ficha = tb_ficha.text_frame
    tf_ficha.word_wrap = True
    tf_ficha.margin_left = tf_ficha.margin_top = tf_ficha.margin_right = tf_ficha.margin_bottom = 0

    p_f1 = tf_ficha.paragraphs[0]
    p_f1.text = "ANTECEDENTES DEL PROYECTO DE PRÁCTICA PROFESIONAL:"
    p_f1.font.name = FONT_NAME
    p_f1.font.size = Pt(11)
    p_f1.font.bold = True
    p_f1.font.color.rgb = COLOR_AZUL_UAH
    p_f1.space_after = Pt(6)

    ficha_items = [
        ("Estudiante Practicante:", "Juan Pablo Lescano Villegas (GEOJOTA) — Licenciatura en Geografía"),
        ("Docentes Supervisores:", "Prof. Manuel Fuenzalida (UAH) & Investigador Colaborador Fondecyt"),
        ("Área de Estudio Piloto:", "Barrio Brasil y campus UAH, Comuna de Santiago (223,75 ha)"),
        ("Período y Carga Horaria:", "01/09/2026 – 12/11/2026 · 150 horas cronológicas concluidas de 300 hrs programadas (50%)")
    ]
    for campo, valor in ficha_items:
        p_item = tf_ficha.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(10.5)
        p_item.space_after = Pt(3)
        r_c = p_item.add_run()
        r_c.text = f"{campo} "
        r_c.font.bold = True
        r_c.font.color.rgb = COLOR_AZUL_SEC
        r_v = p_item.add_run()
        r_v.text = valor
        r_v.font.color.rgb = COLOR_NEGRO

    agregar_pie_pagina(s1, 1)

    agregar_notas_orador(s1,
        "Buenos días profesores y miembros de la comisión. Presento el informe de estado de avance correspondiente al corte "
        "de 150 horas cronológicas de mi práctica profesional en el marco del Proyecto Fondecyt Regular F1261256. "
        "El proyecto desarrolla un Atlas de Información Geográfica Voluntaria orientado a la gestión territorial local en Barrio Brasil."
    )

    # =========================================================================
    # SLIDE 2: CONTEXTO INSTITUCIONAL Y JUSTIFICACIÓN TERRITORIAL
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s2, "Contexto Institucional y Justificación Territorial", 
                       categoria="1. Introducción y Marco del Problema",
                       subtitulo="Articulación entre investigación Fondecyt, información colaborativa y gestión local")
    agregar_pie_pagina(s2, 2)

    # Columna Izquierda: Marco Teórico e Institucional (UN SOLO CONTENEDOR)
    agregar_tarjeta(s2, 0.8, 1.70, 5.7, 4.95)
    tb_c1 = s2.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.3), Inches(4.65))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    tf_c1.margin_left = tf_c1.margin_top = tf_c1.margin_right = tf_c1.margin_bottom = 0

    p = tf_c1.paragraphs[0]
    p.text = "Marco Teórico: El Ciudadano como Sensor"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    bullets_c1 = [
        ("Concepto de VGI (Goodchild, 2007):", "La Información Geográfica Voluntaria comprende la creación, ensamblaje y difusión de datos espaciales por ciudadanos actuando como sensores activos del territorio."),
        ("Madurez de Plataformas Abiertas:", "OpenStreetMap (OSM) y GBIF han demostrado precisiones posicionales comparables o superiores a cartografías oficiales en áreas urbanas centrales densas (Haklay, 2010; See et al., 2025)."),
        ("Encuadre Fondecyt F1261256:", "La práctica se inserta como asistente de investigación técnica para construir un prototipo metodológico transferible de IDE ciudadana comunitaria."),
        ("El Rol de la Geografía Aplicada:", "Aportar con rigor espacial, normalización geodésica y criterios de gobernanza pública a datos que comúnmente carecen de documentación sistemática.")
    ]
    for tit, desc in bullets_c1:
        p_item = tf_c1.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(11)
        p_item.space_after = Pt(6)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: El Problema en Barrio Brasil (UN SOLO CONTENEDOR)
    agregar_tarjeta(s2, 6.8, 1.70, 5.733, 4.95)
    tb_c2 = s2.shapes.add_textbox(Inches(7.0), Inches(1.85), Inches(5.333), Inches(4.65))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    tf_c2.margin_left = tf_c2.margin_top = tf_c2.margin_right = tf_c2.margin_bottom = 0

    p = tf_c2.paragraphs[0]
    p.text = "Diagnóstico Territorial: Barrio Brasil & UAH"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    bullets_c2 = [
        ("Polígono de Estudio:", "223,75 hectáreas (2,24 km²) en Santiago Centro. Zona Típica D.S. N°126/2000, 192 zonas de PRC, nodo de transporte Metro L1/L2/L5 y campus universitario UAH."),
        ("Desfase de la Cartografía Oficial:", "Las bases estatales poseen ciclos de actualización de 5 a 10 años, omitiendo la micro-escala barrial (locales de barrio, rebajes de vereda, ciclocalles)."),
        ("Desarticulación Comunitaria:", "Pese a que vecinos y voluntarios generan mapeos en OSM y GBIF, estos datos no conversan formalmente con la gestión municipal ni con la academia."),
        ("El Desafío Central:", "¿Cómo articular los datos oficiales del Estado con la cartografía voluntaria en una sola plataforma transparente, reproducible y sin costo de licencias?")
    ]
    for tit, desc in bullets_c2:
        p_item = tf_c2.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(11)
        p_item.space_after = Pt(6)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s2,
        "En esta lámina contextualizamos el marco teórico y el problema territorial. La VGI ofrece una oportunidad inédita para la gestión territorial local. "
        "En Barrio Brasil, un territorio patrimonial y universitario de 223 hectáreas, la información oficial suele actualizarse con desfase. "
        "El proyecto diseña un puente metodológico que integra estos datos con las fuentes oficiales bajo normas geográficas estrictas."
    )

    # =========================================================================
    # SLIDE 3: OBJETIVOS DEL PROYECTO (PLAN DE TRABAJO FORMAL)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s3, "Objetivos y Alcance del Plan de Trabajo", 
                       categoria="2. Objetivos y Alcance",
                       subtitulo="Estructura formal comprometida en el Plan de Trabajo de Práctica Profesional")
    agregar_pie_pagina(s3, 3)

    # Tarjeta Superior: Objetivo General
    agregar_tarjeta(s3, 0.8, 1.70, 11.733, 1.25, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_og = s3.shapes.add_textbox(Inches(1.0), Inches(1.80), Inches(11.333), Inches(1.05))
    tf_og = tb_og.text_frame
    tf_og.word_wrap = True
    tf_og.margin_left = tf_og.margin_top = tf_og.margin_right = tf_og.margin_bottom = 0
    p = tf_og.paragraphs[0]
    p.text = "OBJETIVO GENERAL DEL PROYECTO:"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(3)

    p_og = tf_og.add_paragraph()
    p_og.text = "Desarrollar un prototipo de Atlas de Información Geográfica Voluntaria reproducible y centrado en los usuarios para la gestión territorial local en Barrio Brasil y campus UAH, subsanando brechas de información mediante la articulación estandarizada entre datos oficiales del Estado y cartografía colaborativa abierta."
    p_og.font.name = FONT_NAME
    p_og.font.size = Pt(11.5)
    p_og.font.bold = True
    p_og.font.color.rgb = COLOR_NEGRO

    # 4 Tarjetas Inferiores: Objetivos Específicos (UN SOLO CONTENEDOR CADA UNA)
    oes_data = [
        ("OE 1: Diseño Conceptual", "100% COMPLETADO", COLOR_AZUL_UAH, [
            "Período: Semanas 1 a 3 (72 hrs).",
            "Caracterizar el escenario territorial en Barrio Brasil.",
            "Formular taxonomía de 10 macrocategorías VGI.",
            "Diseñar 4 perfiles de usuario territorial (DCU).",
            "Confeccionar diccionario de 134 descriptores."
        ]),
        ("OE 2: Geodatabase & Datos", "CONSOLIDADO (85%)", COLOR_AZUL_UAH, [
            "Período: Semanas 4 a 7 (120 hrs).",
            "Integrar 118 capas (108 oficiales + 10 VGI).",
            "Base espacial PostGIS 17 + Supabase Cloud.",
            "Modelo Lineal WLC v2.0 al 97,88% IGV.",
            "Inyección universal de 14 atributos de catálogo."
        ]),
        ("OE 3: Geoportal Web", "OPERATIVO (80%)", COLOR_AZUL_UAH, [
            "Período: Semanas 8 a 10 (72 hrs).",
            "Visor Leaflet 1.9.4 en producción anticipada.",
            "10 módulos interactivos (00 al 09) en Netlify.",
            "Inspector Normativo PRC de Santiago (192 zonas).",
            "Gobernanza y despliegue a costo $0/mes."
        ]),
        ("OE 4: Validación y Cierre", "EN PREPARACIÓN (25%)", COLOR_AZUL_SEC, [
            "Período: Semanas 10 a 11 (36 hrs).",
            "Pruebas de usabilidad con 4 perfiles tipo.",
            "Calibración de indicadores socioterritoriales.",
            "Manuales de transferibilidad institucional.",
            "Informe final y preparación de titulación."
        ])
    ]

    card_w = 2.75
    gap_w = 0.244
    for i, (oe_tit, oe_est, col_hdr, oe_bullets) in enumerate(oes_data):
        cx = 0.8 + i * (card_w + gap_w)
        agregar_tarjeta(s3, cx, 3.10, card_w, 3.60)
        
        tb = s3.shapes.add_textbox(Inches(cx + 0.12), Inches(3.20), Inches(card_w - 0.24), Inches(3.40))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_t = tf.paragraphs[0]
        p_t.text = oe_tit
        p_t.font.name = FONT_NAME
        p_t.font.size = Pt(12.5)
        p_t.font.bold = True
        p_t.font.color.rgb = col_hdr
        p_t.space_after = Pt(2)

        p_e = tf.add_paragraph()
        p_e.text = oe_est
        p_e.font.name = FONT_NAME
        p_e.font.size = Pt(10.5)
        p_e.font.bold = True
        p_e.font.color.rgb = COLOR_AZUL_SEC
        p_e.space_after = Pt(6)

        for b in oe_bullets:
            p_b = tf.add_paragraph()
            p_b.text = f"• {b}"
            p_b.font.name = FONT_NAME
            p_b.font.size = Pt(10.5)
            p_b.font.color.rgb = COLOR_NEGRO
            p_b.space_after = Pt(4)

    agregar_notas_orador(s3,
        "La estructura del proyecto responde a cuatro objetivos específicos. Los objetivos 1 y 2 correspondientes a la primera mitad "
        "se encuentran completamente cubiertos en sus compromisos centrales, y el objetivo 3 relativo al geoportal web se ha puesto "
        "en producción de manera anticipada. En la segunda mitad nos concentraremos en los cruces analíticos y la validación con usuarios."
    )

    # =========================================================================
    # SLIDE 4: MARCO METODOLÓGICO (PARTE 1: DIAGNÓSTICO Y GEODATABASE)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s4, "Plan Metodológico y Procedimientos (Fase 1: OE 1 y OE 2)", 
                       categoria="3. Marco Metodológico",
                       subtitulo="Ruta metodológica formal para conceptualización, normalización de geodatabase y calidad espacial")
    agregar_pie_pagina(s4, 4)

    filas_metodo_p1 = [
        ["Fase / OE", "Actividad Metodológica", "Herramientas Técnicas", "Procedimiento Operativo", "Entregable / Verificador"],
        [
            "OE 1\nDiagnóstico &\nTaxonomía\n\n100% CERRADO",
            "Caracterización barrial y diseño conceptual de categorías VGI",
            "Python 3.10, Overpass Turbo, ohsome API, QGIS 3.34",
            "Auditoría espacial de vacíos cartográficos en Barrio Brasil. Formulación de 10 macrocategorías temáticas y diseño centrado en el usuario (4 perfiles).",
            "Ficha Técnica, taxonomía VGI en XLSX y catálogo de 134 descriptores territoriales."
        ],
        [
            "OE 2\nGeodatabase &\nCalidad WLC\n\n100% CERRADO",
            "Adquisición, normalización, PostGIS y MetaCalidad ISO 19157",
            "PostgreSQL 17, PostGIS 3.3, GeoPandas, Supabase, WLC v2.0",
            "Descarga masiva de 108 capas oficiales y 10 VGI (2.560 MB activos). Reparación topológica, proyección a UTM 19S y evaluación de MetaCalidad WLC v2.0 (97,88% IGV).",
            "214 GeoJSONs en src/data/ (3,73 GB disco), base PostGIS indexada y tabla de metadatos ISO."
        ]
    ]

    tabla_shape_4 = s4.shapes.add_table(3, 5, Inches(0.8), Inches(1.70), Inches(11.733), Inches(4.85))
    tbl_4 = tabla_shape_4.table
    col_w_m = [Inches(1.5), Inches(2.6), Inches(2.2), Inches(3.1), Inches(2.333)]
    for ci, w in enumerate(col_w_m):
        tbl_4.columns[ci].width = w

    for ri, row in enumerate(filas_metodo_p1):
        for ci, val in enumerate(row):
            cell = tbl_4.cell(ri, ci)
            cell.text = ""
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = cell.margin_right = cell.margin_top = cell.margin_bottom = Inches(0.10)

            lines = val.split("\n")
            for li, line in enumerate(lines):
                p = cell.text_frame.paragraphs[0] if li == 0 else cell.text_frame.add_paragraph()
                p.text = line
                p.font.name = FONT_NAME
                if ri == 0:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_AZUL_UAH
                    p.font.size = Pt(11)
                    p.font.bold = True
                    p.font.color.rgb = COLOR_BLANCO
                    p.alignment = PP_ALIGN.CENTER
                else:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                    p.font.size = Pt(10.5)
                    p.font.color.rgb = COLOR_NEGRO
                    p.space_after = Pt(2)
                    if ci == 0:
                        p.alignment = PP_ALIGN.CENTER
                        if li == 0:
                            p.font.bold = True
                            p.font.size = Pt(12)
                            p.font.color.rgb = COLOR_AZUL_UAH
                        elif "CERRADO" in line:
                            p.font.bold = True
                            p.font.size = Pt(10)
                            p.font.color.rgb = COLOR_AZUL_SEC
                        else:
                            p.font.size = Pt(10)
                            p.font.color.rgb = COLOR_GRIS_TEXTO
                    else:
                        p.alignment = PP_ALIGN.LEFT
            set_cell_border(cell, "CBD5E1", "8000")

    agregar_notas_orador(s4,
        "En esta primera parte del marco metodológico presentamos la operacionalización de los Objetivos Específicos 1 y 2. "
        "El OE 1 sentó las bases conceptuales con la taxonomía de 10 macrocategorías y 4 usuarios-tipo. El OE 2 consolidó la Geodatabase "
        "de 118 capas con 2,56 GB activos y una auditoría de MetaCalidad bajo la norma ISO 19157 alcanzando un 97,88% de cumplimiento."
    )

    # =========================================================================
    # SLIDE 5: MARCO METODOLÓGICO (PARTE 2: GEOPORTAL Y VALIDACIÓN)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s5, "Plan Metodológico y Procedimientos (Fase 2: OE 3 y OE 4)", 
                       categoria="3. Marco Metodológico (Continuación)",
                       subtitulo="Desarrollo de plataforma web interactiva, validación empírica con usuarios y transferibilidad")
    agregar_pie_pagina(s5, 5)

    filas_metodo_p2 = [
        ["Fase / OE", "Actividad Metodológica", "Herramientas Técnicas", "Procedimiento Operativo", "Entregable / Verificador"],
        [
            "OE 3\nPrototipo Web\nGeoportal\n\n80% EN PRODUCCIÓN",
            "Desarrollo frontend, catálogo de metadatos y visor interactivo",
            "JavaScript Vanilla, Leaflet 1.9.4, Netlify CI/CD, GitHub, CSS3",
            "Diseño de Single Page Application (SPA) con triple failover resiliente. Implementación de 10 módulos en producción con Inspector Normativo PRC de Santiago.",
            "Geoportal en vivo en atlasvgiuah.netlify.app, repositorio público y manual de uso."
        ],
        [
            "OE 4\nValidación &\nTransferencia\n\n25% EN PREPARACIÓN",
            "Evaluación empírica con usuarios tipo y manuales metodológicos",
            "Pautas de usabilidad, métricas DCU, protocolo de transferencia UAH",
            "Aplicación de pruebas guiadas a 4 perfiles territoriales para evaluar completitud y experiencia. Sistematización de manuales para continuidad del centro de práctica.",
            "Protocolo de validación empírica, Manual Metodológico Fondecyt e Informe Final de Práctica."
        ]
    ]

    tabla_shape_5 = s5.shapes.add_table(3, 5, Inches(0.8), Inches(1.70), Inches(11.733), Inches(4.85))
    tbl_5 = tabla_shape_5.table
    for ci, w in enumerate(col_w_m):
        tbl_5.columns[ci].width = w

    for ri, row in enumerate(filas_metodo_p2):
        for ci, val in enumerate(row):
            cell = tbl_5.cell(ri, ci)
            cell.text = ""
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = cell.margin_right = cell.margin_top = cell.margin_bottom = Inches(0.10)

            lines = val.split("\n")
            for li, line in enumerate(lines):
                p = cell.text_frame.paragraphs[0] if li == 0 else cell.text_frame.add_paragraph()
                p.text = line
                p.font.name = FONT_NAME
                if ri == 0:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_AZUL_UAH
                    p.font.size = Pt(11)
                    p.font.bold = True
                    p.font.color.rgb = COLOR_BLANCO
                    p.alignment = PP_ALIGN.CENTER
                else:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                    p.font.size = Pt(10.5)
                    p.font.color.rgb = COLOR_NEGRO
                    p.space_after = Pt(2)
                    if ci == 0:
                        p.alignment = PP_ALIGN.CENTER
                        if li == 0:
                            p.font.bold = True
                            p.font.size = Pt(12)
                            p.font.color.rgb = COLOR_AZUL_UAH
                        elif "PRODUCCIÓN" in line or "PREPARACIÓN" in line:
                            p.font.bold = True
                            p.font.size = Pt(10)
                            p.font.color.rgb = COLOR_AZUL_SEC
                        else:
                            p.font.size = Pt(10)
                            p.font.color.rgb = COLOR_GRIS_TEXTO
                    else:
                        p.alignment = PP_ALIGN.LEFT
            set_cell_border(cell, "CBD5E1", "8000")

    agregar_notas_orador(s5,
        "La segunda mitad de la metodología aborda los Objetivos 3 y 4. El OE 3 se adelantó sustancialmente, contando ya con el geoportal "
        "en producción con 10 módulos funcionales. El OE 4 comprende las pruebas empíricas de usabilidad con actores territoriales "
        "y la transferencia metodológica definitiva hacia el Departamento de Geografía de la Universidad."
    )

    # =========================================================================
    # SLIDE 6: CRONOGRAMA Y CUMPLIMIENTO (GANTT, HORAS E HITOS)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s6, "Estado de Avance y Carta Gantt (Corte 150 Horas)", 
                       categoria="4. Cronograma y Cumplimiento",
                       subtitulo="50% de la carga horaria cumplida (25 días hábiles) · Hitos 1 a 5 completados formalmente")
    agregar_pie_pagina(s6, 6)

    # 4 Tarjetas de KPIs Superiores
    kpis = [
        ("HORAS PROGRAMADAS", "300 hrs", "11 semanas laborales"),
        ("HORAS CUMPLIDAS", "150 hrs", "25 días hábiles (50%)"),
        ("HITOS CERRADOS", "H1 a H5", "OE 1 y base OE 2 (100%)"),
        ("HITOS EN PROGRESO", "H6 y H8", "Cruces espaciales e IDE")
    ]
    card_kpi_w = 2.80
    gap_kpi = 0.177
    for ki, (kt, kv, kd) in enumerate(kpis):
        kx = 0.8 + ki * (card_kpi_w + gap_kpi)
        agregar_tarjeta(s6, kx, 1.70, card_kpi_w, 0.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_k = s6.shapes.add_textbox(Inches(kx + 0.10), Inches(1.75), Inches(card_kpi_w - 0.20), Inches(0.85))
        tf_k = tb_k.text_frame
        tf_k.word_wrap = True
        tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = 0
        p1 = tf_k.paragraphs[0]
        p1.text = kt
        p1.font.name = FONT_NAME
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_AZUL_UAH
        p2 = tf_k.add_paragraph()
        p2.text = kv
        p2.font.name = FONT_NAME
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NEGRO
        p3 = tf_k.add_paragraph()
        p3.text = kd
        p3.font.name = FONT_NAME
        p3.font.size = Pt(10)
        p3.font.color.rgb = COLOR_GRIS_TEXTO

    # Tabla Carta Gantt natural
    headers_gantt = ["Hito / Actividad Planificada", "OE", "S1", "S2", "S3", "S4", "S5", "S6*", "S7", "S8", "S9", "S10", "S11", "Estado"]
    filas_gantt = [
        ["H1: Inducción, territorio y usuarios", "OE 1", "X", "", "", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H2: Diseño conceptual y 10 categorías VGI", "OE 1", "", "X", "", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H3: Revisión de fuentes VGI y catálogo descriptores", "OE 1", "", "", "X", "", "", "", "", "", "", "", "", "100% Cerrado"],
        ["H4: Obtención y geodatabase (118 capas)", "OE 2", "", "", "", "X", "X", "", "", "", "", "", "", "100% Cerrado"],
        ["H5: MetaCalidad WLC v2.0 (97,88%) e inyección ISO", "OE 2", "", "", "", "", "X", "X", "", "", "", "", "", "100% Cerrado"],
        ["H6: Cruces espaciales y modelos de cobertura barrial", "OE 2", "", "", "", "", "", "X", "X", "", "", "", "", "En inicio"],
        ["H7: Estándar cartográfico y simbología del Atlas", "OE 3", "", "", "", "", "", "", "", "X", "", "", "", "Programado"],
        ["H8: Geoportal web interactivo en producción", "OE 3", "", "", "", "", "", "X", "X", "X", "X", "", "", "80% Anticipado"],
        ["H9: Validación empírica con usuarios (4 perfiles)", "OE 4", "", "", "", "", "", "", "", "", "", "X", "", "Programado"],
        ["H10: Manuales, transferibilidad institucional y titulación", "OE 4", "", "", "", "", "", "", "", "", "", "", "X", "Programado"]
    ]

    tg = s6.shapes.add_table(11, 14, Inches(0.8), Inches(2.80), Inches(11.733), Inches(3.90))
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
        p.font.size = Pt(10)
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
            p.font.size = Pt(9.5)
            set_cell_border(c, "CBD5E1", "8000")

            if ci == 0:
                p.alignment = PP_ALIGN.LEFT
                p.font.color.rgb = COLOR_NEGRO
                p.font.bold = True
            elif ci == 1:
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_UAH
            elif 2 <= ci <= 12:
                p.alignment = PP_ALIGN.CENTER
                if val == "X":
                    p.font.bold = True
                    if ci <= 6:  # Semanas 1 a 5 concluidas
                        c.fill.fore_color.rgb = RGBColor(220, 252, 231) # verde suave
                        p.font.color.rgb = RGBColor(21, 128, 61)
                    elif ci == 7: # Semana 6 en curso
                        c.fill.fore_color.rgb = RGBColor(254, 240, 138) # amarillo suave
                        p.font.color.rgb = RGBColor(161, 98, 7)
                    else:
                        c.fill.fore_color.rgb = RGBColor(241, 245, 249)
                        p.font.color.rgb = COLOR_GRIS_TEXTO
            elif ci == 13:
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                if "100%" in val:
                    p.font.color.rgb = COLOR_AZUL_UAH
                elif "80%" in val or "inicio" in val:
                    p.font.color.rgb = COLOR_AZUL_SEC
                else:
                    p.font.color.rgb = COLOR_GRIS_TEXTO

    agregar_notas_orador(s6,
        "La Carta Gantt refleja un avance exacto del 50% cronológico, con 150 horas concluidas y los cinco primeros hitos formalmente cerrados. "
        "El Hito 5 de MetaCalidad WLC v2.0 se cerró satisfactoriamente al 97,88%, y el Hito 8 se encuentra avanzado de manera anticipada. "
        "Nos encontramos dentro del cronograma proyectado."
    )

    # =========================================================================
    # SLIDE 7: RESULTADOS OE 1 — ARQUITECTURA CONCEPTUAL Y TAXONOMÍA VGI
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s7, "Resultados OE 1: Arquitectura Conceptual y Taxonomía VGI", 
                       categoria="5. Resultados — Objetivo Específico 1",
                       subtitulo="10 Macro-categorías territoriales, 4 usuarios-tipo (DCU) y diccionario de 134 descriptores")
    agregar_pie_pagina(s7, 7)

    # Panel 1: Las 10 Macrocategorías
    agregar_tarjeta(s7, 0.8, 1.70, 5.7, 4.95)
    tb_cat = s7.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.3), Inches(4.65))
    tf_cat = tb_cat.text_frame
    tf_cat.word_wrap = True
    tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0

    p = tf_cat.paragraphs[0]
    p.text = "10 Macro-categorías Territoriales VGI"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(6)

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
        p_c.font.size = Pt(10.5)
        p_c.space_after = Pt(3)
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
    agregar_tarjeta(s7, 6.8, 1.70, 5.733, 4.95)
    tb_usr = s7.shapes.add_textbox(Inches(7.0), Inches(1.85), Inches(5.333), Inches(4.65))
    tf_usr = tb_usr.text_frame
    tf_usr.word_wrap = True
    tf_usr.margin_left = tf_usr.margin_top = tf_usr.margin_right = tf_usr.margin_bottom = 0

    p_u = tf_usr.paragraphs[0]
    p_u.text = "4 Perfiles de Usuario (Diseño Centrado en el Usuario - DCU)"
    p_u.font.name = FONT_NAME
    p_u.font.size = Pt(14)
    p_u.font.bold = True
    p_u.font.color.rgb = COLOR_AZUL_UAH
    p_u.space_after = Pt(6)

    perfiles = [
        ("1. Institucional / Planificador:", "Foco en zonificación PRC, semáforos UOCT y equipamientos críticos para toma de decisiones públicas."),
        ("2. Comunitario / Vecinal:", "Foco en áreas verdes, comercio barrial, ciclovías y patrimonio cotidiano para acción comunitaria."),
        ("3. Voluntario OSM / Mapeador:", "Foco en tags técnicos, geometrías, consultas Overpass QL y métricas de completitud."),
        ("4. Investigador / Academia:", "Foco en metadatos ISO 19115, biodiversidad Darwin Core y series temporales ohsome.")
    ]
    for pnom, pdesc in perfiles:
        p_item = tf_usr.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(11)
        p_item.space_after = Pt(4)
        r1 = p_item.add_run()
        r1.text = f"• {pnom} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = pdesc
        r2.font.color.rgb = COLOR_NEGRO

    # Cuadro inferior de Diccionario
    p_dic = tf_usr.add_paragraph()
    p_dic.space_before = Pt(8)
    p_dic.text = "Diccionario Territorial y Brechas Estatales:"
    p_dic.font.name = FONT_NAME
    p_dic.font.size = Pt(12)
    p_dic.font.bold = True
    p_dic.font.color.rgb = COLOR_AZUL_UAH
    p_dic.space_after = Pt(3)

    p_dic_d = tf_usr.add_paragraph()
    p_dic_d.text = "Se catalogaron 134 descriptores territoriales, revelando que el Estado de Chile sólo cuenta con 48 capas oficiales análogas, mientras que 86 descriptores representan brechas cubiertas exclusivamente por la cartografía voluntaria VGI."
    p_dic_d.font.name = FONT_NAME
    p_dic_d.font.size = Pt(10.5)
    p_dic_d.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s7,
        "En el Objetivo 1 estructuramos la taxonomía del Atlas en 10 macrocategorías temáticas y formulamos cuatro perfiles de usuario. "
        "Al contrastar la oferta de IDE Chile con las necesidades barriales, descubrimos 86 brechas de información territorial que sólo "
        "la VGI es capaz de llenar."
    )

    # =========================================================================
    # SLIDE 8: RESULTADOS OE 2 — GEODATABASE DE 118 COMPONENTES
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s8, "Resultados OE 2: Geodatabase y Componentes Cartográficos", 
                       categoria="6. Resultados — Objetivo Específico 2",
                       subtitulo="Consolidación de 118 capas (108 oficiales + 10 VGI), 2.560 MB activos y 3.730 MB físicos en disco")
    agregar_pie_pagina(s8, 8)

    # 3 Tarjetas Superiores de Métricas
    met_db = [
        ("118 Capas Activas", "108 Oficiales Estado + 10 VGI", "Integradas en WGS84, UTM 19S y PostGIS 17"),
        ("2.560 MB Activos", "1.650 MB Ofic. + 910 MB VGI", "Capas normalizadas y Geofabrik RM"),
        ("3.730 MB en Disco", "214 GeoJSONs físicos en src/data/", "121 capas enriquecidas con 14 atributos de catálogo")
    ]
    card_db_w = 3.75
    gap_db = 0.24
    for mi, (mt, mv, md) in enumerate(met_db):
        mx = 0.8 + mi * (card_db_w + gap_db)
        agregar_tarjeta(s8, mx, 1.70, card_db_w, 0.95, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
        tb_m = s8.shapes.add_textbox(Inches(mx + 0.15), Inches(1.75), Inches(card_db_w - 0.30), Inches(0.85))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p1 = tf_m.paragraphs[0]
        p1.text = mt.upper()
        p1.font.name = FONT_NAME
        p1.font.size = Pt(11.5)
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

    tgdb = s8.shapes.add_table(10, 6, Inches(0.8), Inches(2.80), Inches(11.733), Inches(3.90))
    tbl_gdb = tgdb.table
    w_gdb = [Inches(3.3), Inches(4.333), Inches(0.9), Inches(1.0), Inches(1.1), Inches(1.1)]
    for ci, w in enumerate(w_gdb):
        tbl_gdb.columns[ci].width = w

    for ri, fila in enumerate(filas_gdb):
        for ci, val in enumerate(fila):
            c = tbl_gdb.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.margin_left = c.margin_right = c.margin_top = c.margin_bottom = Inches(0.08)
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
                c.fill.fore_color.rgb = COLOR_AZUL_CLARO
                p.font.size = Pt(11)
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_UAH
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(10)
                p.font.color.rgb = COLOR_NEGRO
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
                if ci == 0: p.font.bold = True
            set_cell_border(c, "CBD5E1", "8000")

    agregar_notas_orador(s8,
        "La geodatabase consolida 118 capas cartográficas divididas en 8 grupos oficiales y el bloque VGI colaborativo. "
        "En volumen, la información activa alcanza 2,56 gigabytes integrando los datos masivos de Geofabrik RM y capas oficiales "
        "en WGS84 y UTM 19S en PostgreSQL 17."
    )

    # =========================================================================
    # SLIDE 9: RESULTADOS OE 2 — AUDITORÍA DE METACALIDAD WLC v2.0
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s9, "Resultados OE 2: Auditoría Universal de MetaCalidad (WLC v2.0)", 
                       categoria="7. Resultados — Calidad de Metadatos",
                       subtitulo="Modelo Lineal WLC v2.0 ponderado (10 dimensiones / 100%) con 97,88% IGV e inyección universal en descargas")
    agregar_pie_pagina(s9, 9)

    # Columna Izquierda: Panel de MetaCalidad con Tabla Sintetizada (SIN SUPERPOSICIONES)
    agregar_tarjeta(s9, 0.8, 1.70, 6.2, 4.95)
    tb_mc_l = s9.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.8), Inches(1.10))
    tf_mc_l = tb_mc_l.text_frame
    tf_mc_l.word_wrap = True
    tf_mc_l.margin_left = tf_mc_l.margin_top = tf_mc_l.margin_right = tf_mc_l.margin_bottom = 0
    p = tf_mc_l.paragraphs[0]
    p.text = "Modelo Lineal WLC v2.0 de MetaCalidad (ISO 19157)"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p_sub_mc = tf_mc_l.add_paragraph()
    p_sub_mc.text = "Evaluación multi-atributo de 10 dimensiones ortogonales al 10% (100% global):"
    p_sub_mc.font.name = FONT_NAME
    p_sub_mc.font.size = Pt(11)
    p_sub_mc.font.italic = True
    p_sub_mc.font.color.rgb = COLOR_GRIS_TEXTO

    # Tabla sintetizada de 4 filas de alta legibilidad
    filas_dim = [
        ["Grupo Dimensional", "Estándares / Dimensiones Ponderadas", "Peso", "Puntaje", "Nivel"],
        ["Cuantitativo (5)", "ISO 19157: Completitud, Topología, Posición, Temática, Tiempo", "50%", "98,5%", "A+ Excelente"],
        ["Cualitativo (5)", "ISO 19115: Linaje, Accesibilidad, Usabilidad, Autoría, Licencia", "50%", "97,2%", "A+ Excelente"],
        ["ÍNDICE GLOBAL (IGV)", "Modelo Lineal Multi-Atributo WLC v2.0 (10 dimensiones)", "100%", "97,88%", "Grado A+"]
    ]

    tdim = s9.shapes.add_table(4, 5, Inches(1.0), Inches(2.80), Inches(5.8), Inches(1.90))
    tbl_d = tdim.table
    w_d = [Inches(1.7), Inches(2.2), Inches(0.55), Inches(0.65), Inches(0.70)]
    for ci, w in enumerate(w_d):
        tbl_d.columns[ci].width = w

    for ri, fila in enumerate(filas_dim):
        for ci, val in enumerate(fila):
            c = tbl_d.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.margin_left = c.margin_right = c.margin_top = c.margin_bottom = Inches(0.06)
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(10.5)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            elif ri == 3:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_CLARO
                p.font.size = Pt(11)
                p.font.bold = True
                p.font.color.rgb = COLOR_AZUL_UAH
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(10)
                p.font.color.rgb = COLOR_NEGRO
                p.alignment = PP_ALIGN.CENTER if ci >= 2 else PP_ALIGN.LEFT
                if ci == 0: p.font.bold = True
            set_cell_border(c, "CBD5E1", "8000")

    # Resumen inferior dentro de la columna izquierda (CERO COLISIÓN)
    tb_inf_mc = s9.shapes.add_textbox(Inches(1.0), Inches(4.85), Inches(5.8), Inches(1.65))
    tf_inf_mc = tb_inf_mc.text_frame
    tf_inf_mc.word_wrap = True
    tf_inf_mc.margin_left = tf_inf_mc.margin_top = tf_inf_mc.margin_right = tf_inf_mc.margin_bottom = 0
    p = tf_inf_mc.paragraphs[0]
    p.text = "Distribución de Calidad en los 118 Componentes:"
    p.font.name = FONT_NAME
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p1 = tf_inf_mc.add_paragraph()
    p1.text = "• Grado A+ Excelente (≥95%): 116 capas (98,3% del repositorio)\n• Grado A Muy Bueno (85–94%): 2 capas (1,7% del repositorio)\n• Inyección Universal: 100% de las descargas GeoJSON enriquecidas en caliente con las 14 columnas del catálogo institucional."
    p1.font.name = FONT_NAME
    p1.font.size = Pt(10.5)
    p1.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Captura de la Auditoría en el Manual
    captura_man = os.path.join(IMG_DIR, "08_manual_documentacion.png")
    agregar_imagen_con_marco(s9, captura_man, 7.3, 1.70, 5.233, 4.45,
                             pie_fuente="Módulo 08: Auditoría y Matriz de MetaCalidad exportable en JSON, Markdown y Excel.")

    agregar_notas_orador(s9,
        "La evaluación de MetaCalidad aplica el modelo lineal ponderado WLC v2.0 basado en ISO 19157 e ISO 19115. "
        "Las diez dimensiones ponderadas equitativamente al 10% arrojan un 97,88% de cumplimiento global, con 116 capas en Grado A+. "
        "Adicionalmente, el 100% de las descargas incorporan las 14 columnas del catálogo institucional."
    )

    # =========================================================================
    # SLIDE 10: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 1)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s10, "Dimensiones de Análisis Territorial (Parte 1: Concepto, D1 y D2)", 
                       categoria="8. Dimensiones Estratégicas de Análisis",
                       subtitulo="Estructuración de las 118 capas en 5 dimensiones estratégicas para el diagnóstico barrial")
    agregar_pie_pagina(s10, 10)

    # Tarjeta Superior: Concepto Rector
    agregar_tarjeta(s10, 0.8, 1.70, 11.733, 1.15, bg_color=COLOR_AZUL_CLARO, border_color=COLOR_AZUL_UAH)
    tb_rec = s10.shapes.add_textbox(Inches(1.0), Inches(1.80), Inches(11.333), Inches(0.95))
    tf_rec = tb_rec.text_frame
    tf_rec.word_wrap = True
    tf_rec.margin_left = tf_rec.margin_top = tf_rec.margin_right = tf_rec.margin_bottom = 0
    p = tf_rec.paragraphs[0]
    p.text = "CONCEPTO RECTOR: ARTICULACIÓN DE CAPAS PARA RESPONDER A LOS 4 USUARIOS-TIPO"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(2)

    p_rd = tf_rec.add_paragraph()
    p_rd.text = "Las 118 capas de la geodatabase no constituyen datos aislados, sino que se articulan en 5 dimensiones estratégicas diseñadas para responder preguntas territoriales concretas formuladas por el Municipio de Santiago, vecinos de Barrio Brasil, la comunidad OSM y la investigación académica."
    p_rd.font.name = FONT_NAME
    p_rd.font.size = Pt(11)
    p_rd.font.color.rgb = COLOR_NEGRO

    # Dos Columnas Inferiores: D1 y D2
    dims_p1 = [
        ("1. Dimensión Sociodemográfica (19 Capas)", [
            ("Alcance Territorial:", "Dinámica poblacional, estructura etaria, densidad de hogares y distribución de género en Barrio Brasil."),
            ("Fuentes Estatales:", "INE Censo 2024 en 5 niveles (Manzana, Unidad Vecinal, Distrito, Comuna, Región); SERVEL padrón electoral."),
            ("Aporte VGI Colaborativo:", "Capacidad de caracterización de población flotante universitaria en campus UAH y entorno."),
            ("Aplicación Directa:", "Calcular índice de envejecimiento e identificar manzanas con alta concentración de niños y adultos mayores.")
        ]),
        ("2. Dimensión Socioeconómica (18 Capas)", [
            ("Alcance Territorial:", "Inversión pública sectorial, estratificación socioeconómica y actividades comerciales barriales."),
            ("Fuentes Estatales:", "MDSF Registro Social de Hogares (RSH al 40% y 60%), Banco Integrado de Proyectos (BIP 2026)."),
            ("Aporte VGI Colaborativo:", "Comercio barrial minorista (shop=*), almacenes de barrio, panaderías patrimoniales y talleres en OSM."),
            ("Aplicación Directa:", "Evaluar brechas entre inversión municipal y sectores con mayor vulnerabilidad socioeconómica.")
        ])
    ]

    for di, (dtit, ditems) in enumerate(dims_p1):
        dx = 0.8 + di * (5.7 + 0.333)
        agregar_tarjeta(s10, dx, 3.00, 5.7, 3.70)
        tb_d = s10.shapes.add_textbox(Inches(dx + 0.15), Inches(3.15), Inches(5.4), Inches(3.40))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0

        p = tf_d.paragraphs[0]
        p.text = dtit
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(6)

        for sub_tit, sub_desc in ditems:
            p_it = tf_d.add_paragraph()
            p_it.font.name = FONT_NAME
            p_it.font.size = Pt(11)
            p_it.space_after = Pt(4)
            r1 = p_it.add_run()
            r1.text = f"• {sub_tit} "
            r1.font.bold = True
            r1.font.color.rgb = COLOR_AZUL_SEC
            r2 = p_it.add_run()
            r2.text = sub_desc
            r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s10,
        "Las dimensiones sociodemográfica y socioeconómica permiten caracterizar la estructura social del territorio. "
        "Cruzamos el Censo 2024 y el RSH con la red de comercio barrial mapeada en OSM, conectando inversión pública y realidad barrial."
    )

    # =========================================================================
    # SLIDE 11: LAS 5 DIMENSIONES ESTRATÉGICAS DE ANÁLISIS (PARTE 2)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    agregar_encabezado(s11, "Dimensiones de Análisis Territorial (Parte 2: D3, D4 y D5)", 
                       categoria="8. Dimensiones Estratégicas de Análisis (Continuación)",
                       subtitulo="Medio ambiente, salud comunitaria y habitabilidad urbana en el Barrio Brasil")
    agregar_pie_pagina(s11, 11)

    dims_p2 = [
        ("3. Dimensión Socioambiental (23 Capas)", [
            ("Espacio Público Verde:", "Áreas Verdes Normativas MINVU vs parques barriales y plazas de bolsillo en OSM."),
            ("Biodiversidad Urbana:", "Registros de especies (Darwin Core GBIF) y catastro de arbolado urbano (natural=tree)."),
            ("Gestión de Residuos:", "Puntos de reciclaje ciudadano y microbasurales identificados en terreno.")
        ]),
        ("4. Dimensión Sociosanitaria (3 Capas Clave)", [
            ("Red Asistencial DEIS:", "Infraestructura de salud pública (CESFAM, postas y vacunatorios MINSAL)."),
            ("Salud de Proximidad:", "Farmacias de barrio (shop=chemist/pharmacy) y clínicas mapeadas en OSM."),
            ("Dependencia Funcional:", "Cruce con RSH para identificar concentración de personas con dependencia.")
        ]),
        ("5. Sociourbana / Habitabilidad (55 Capas)", [
            ("Planificación y Catastro:", "PRC Santiago (192 zonas), alturas máximas y avalúo predial SII."),
            ("Movilidad Sostenible:", "1.500+ cruces semaforizados UOCT, red de ciclovías y accesibilidad universal."),
            ("Patrimonio y Memoria:", "Monumentos Históricos CMN, casonas protegidas y sitios de memoria.")
        ])
    ]

    card_d2_w = 3.75
    gap_d2 = 0.24
    for di, (dtit, ditems) in enumerate(dims_p2):
        dx = 0.8 + di * (card_d2_w + gap_d2)
        agregar_tarjeta(s11, dx, 1.70, card_d2_w, 4.95)
        tb_d = s11.shapes.add_textbox(Inches(dx + 0.15), Inches(1.85), Inches(card_d2_w - 0.30), Inches(4.65))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0

        p = tf_d.paragraphs[0]
        p.text = dtit
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(6)

        for sub_tit, sub_desc in ditems:
            p_it = tf_d.add_paragraph()
            p_it.font.name = FONT_NAME
            p_it.font.size = Pt(11)
            p_it.space_after = Pt(5)
            r1 = p_it.add_run()
            r1.text = f"• {sub_tit} "
            r1.font.bold = True
            r1.font.color.rgb = COLOR_AZUL_SEC
            r2 = p_it.add_run()
            r2.text = sub_desc
            r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s11,
        "Completamos las cinco dimensiones con medio ambiente, salud y habitabilidad urbana. Destaca la integración del arbolado urbano en GBIF "
        "y la dimensión sociourbana que con 55 capas articula el Plan Regulador Comunal con la red de semáforos de la UOCT."
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
    agregar_tarjeta(s12, 0.8, 1.70, 5.7, 4.95)
    tb_m1 = s12.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.3), Inches(4.65))
    tf_m1 = tb_m1.text_frame
    tf_m1.word_wrap = True
    tf_m1.margin_left = tf_m1.margin_top = tf_m1.margin_right = tf_m1.margin_bottom = 0

    p = tf_m1.paragraphs[0]
    p.text = "Fundamentación del Modelo Lineal / Ranking"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    bullets_m1 = [
        ("Naturaleza en Desarrollo:", "El índice sintético territorial se encuentra en proceso de formulación metodológica dentro de los OE 2 y 4, por lo que no se adoptan ponderaciones rígidas provisionales."),
        ("Modelo Lineal Aditivo (SAW):", "Se fundamenta en la Teoría de Utilidad Multi-Atributo (MAUT) y el método Simple Additive Weighting, ampliamente respaldado en la literatura de SIG."),
        ("Transparencia Axiomática:", "La formulación lineal garantiza ausencia de 'cajas negras' algorítmicas, permitiendo que funcionarios, vecinos e investigadores comprendan el puntaje de cada zona."),
        ("Normalización de Variables:", "Cada indicador se normaliza en escala [0, 100]% mediante estandarización por máximos y mínimos teóricos o empíricos, asegurando consistencia dimensional."),
        ("Calibración Participativa en OE 4:", "Las ponderaciones definitivas serán sometidas a calibración mediante paneles de consulta con actores territoriales y comités de expertos.")
    ]
    for tit, desc in bullets_m1:
        p_item = tf_m1.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(11)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    # Columna Derecha: Estructura Operativa del Ranking
    agregar_tarjeta(s12, 6.8, 1.70, 5.733, 4.95)
    tb_m2 = s12.shapes.add_textbox(Inches(7.0), Inches(1.85), Inches(5.333), Inches(4.65))
    tf_m2 = tb_m2.text_frame
    tf_m2.word_wrap = True
    tf_m2.margin_left = tf_m2.margin_top = tf_m2.margin_right = tf_m2.margin_bottom = 0

    p = tf_m2.paragraphs[0]
    p.text = "Estructura Operativa del Ranking Territorial"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

    pasos_ranking = [
        ("Nivel 1 · Variables Primarias (118 Capas):", "Extracción de recuentos espaciales, densidades por km² y distancias euclidianas a equipamientos en UTM Huso 19S."),
        ("Nivel 2 · Normalización por Dimensión:", "Cálculo de puntajes sub-dimensionales normalizados:\n  - IS_Dem, IS_Eco, IS_Amb, IS_San, IS_Urb."),
        ("Nivel 3 · Agregación Lineal y Ranking:", "Puntaje Territorial = ∑ (Wk · Dim_k), permitiendo jerarquizar las unidades vecinales y manzanas censales según nivel de consolidación o vulnerabilidad."),
        ("Nivel 4 · Visualización Interactiva:", "El geoportal presentará el ranking mediante coropletas temáticas y fichas de atributos comparativas orientadas a la acción comunitaria.")
    ]
    for tit, desc in pasos_ranking:
        p_item = tf_m2.add_paragraph()
        p_item.font.name = FONT_NAME
        p_item.font.size = Pt(11)
        p_item.space_after = Pt(5)
        r1 = p_item.add_run()
        r1.text = f"• {tit} "
        r1.font.bold = True
        r1.font.color.rgb = COLOR_AZUL_SEC
        r2 = p_item.add_run()
        r2.text = desc
        r2.font.color.rgb = COLOR_NEGRO

    agregar_notas_orador(s12,
        "Respecto al índice sintético territorial, es fundamental precisar que se encuentra en desarrollo. "
        "Adoptará la estructura de un modelo lineal aditivo o ranking multicriterio tipo SAW para normalizar las cinco dimensiones en escala 0 a 100, "
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
    agregar_tarjeta(s13, 0.8, 1.70, 4.8, 4.95)
    tb_w0 = s13.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(4.4), Inches(4.65))
    tf_w0 = tb_w0.text_frame
    tf_w0.word_wrap = True
    tf_w0.margin_left = tf_w0.margin_top = tf_w0.margin_right = tf_w0.margin_bottom = 0

    p = tf_w0.paragraphs[0]
    p.text = "Arquitectura de Navegación y Acceso Multiactor"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
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
        p_item.font.size = Pt(11)
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
    agregar_imagen_con_marco(s13, captura_hero, 5.8, 1.70, 6.733, 4.45,
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
    agregar_tarjeta(s14, 0.8, 1.70, 4.8, 4.95)
    tb_w1 = s14.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(4.4), Inches(4.65))
    tf_w1 = tb_w1.text_frame
    tf_w1.word_wrap = True
    tf_w1.margin_left = tf_w1.margin_top = tf_w1.margin_right = tf_w1.margin_bottom = 0

    p = tf_w1.paragraphs[0]
    p.text = "Características del Visor Web (Módulo 00)"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
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
        p_item.font.size = Pt(11)
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
    agregar_imagen_con_marco(s14, captura_vis, 5.8, 1.70, 6.733, 4.45,
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

    mods_1 = [
        ("Módulo 01: Overpass QL", "Consultas sintácticas en vivo a servidores de OpenStreetMap para las 10 macrocategorías barriales.", "04_explorador_overpass.png"),
        ("Módulo 02: Calidad ohsome", "Consulta directa a la API de HeiGIT (Univ. Heidelberg) para medir masa crítica y densidad de mapeo.", "05_calidad_ohsome.png"),
        ("Módulo 03: Biodiversidad GBIF", "Acceso a registros de ciencia ciudadana (Darwin Core / iNaturalist) de flora y fauna en Barrio Brasil.", "06_biodiversidad_gbif.png")
    ]
    for mi, (mt, md, mimg) in enumerate(mods_1):
        mx = 0.8 + mi * (3.75 + 0.24)
        agregar_tarjeta(s15, mx, 1.70, 3.75, 4.95)
        
        tb_m = s15.shapes.add_textbox(Inches(mx + 0.15), Inches(1.80), Inches(3.45), Inches(0.95))
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

        # Imagen redimensionada con margen adecuado
        img_p = os.path.join(IMG_DIR, mimg)
        agregar_imagen_con_marco(s15, img_p, mx + 0.15, 2.80, 3.45, 3.30,
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
        agregar_tarjeta(s16, mx, 1.70, 3.75, 4.95)
        
        tb_m = s16.shapes.add_textbox(Inches(mx + 0.15), Inches(1.80), Inches(3.45), Inches(0.95))
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

        # Imagen redimensionada con margen adecuado
        img_p = os.path.join(IMG_DIR, mimg)
        agregar_imagen_con_marco(s16, img_p, mx + 0.15, 2.80, 3.45, 3.30,
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
    agregar_tarjeta(s17, 0.8, 1.70, 5.7, 4.95)
    tb_ar = s17.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.3), Inches(4.65))
    tf_ar = tb_ar.text_frame
    tf_ar.word_wrap = True
    tf_ar.margin_left = tf_ar.margin_top = tf_ar.margin_right = tf_ar.margin_bottom = 0

    p = tf_ar.paragraphs[0]
    p.text = "Arquitectura Híbrida y Estrategia Triple Failover"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_AZUL_UAH
    p.space_after = Pt(8)

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
        p_item.font.size = Pt(10.5)
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
    agregar_imagen_con_marco(s17, captura_gh, 6.8, 1.70, 5.733, 2.05,
                             pie_fuente="Repositorio público en GitHub: código fuente, geoprocesos y documentación abierta.")

    captura_commits = os.path.join(IMG_DIR, "11_github_commits.png")
    agregar_imagen_con_marco(s17, captura_commits, 6.8, 4.25, 5.733, 2.05,
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

    t_pr = s18.shapes.add_table(10, 4, Inches(0.8), Inches(1.70), Inches(11.733), Inches(4.90))
    tbl_pr = t_pr.table
    w_pr = [Inches(1.0), Inches(4.3), Inches(4.3), Inches(2.133)]
    for ci, w in enumerate(w_pr):
        tbl_pr.columns[ci].width = w

    for ri, fila in enumerate(filas_prod):
        for ci, val in enumerate(fila):
            c = tbl_pr.cell(ri, ci)
            c.text = val
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.margin_left = c.margin_right = c.margin_top = c.margin_bottom = Inches(0.08)
            p = c.text_frame.paragraphs[0]
            p.font.name = FONT_NAME
            if ri == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_AZUL_UAH
                p.font.size = Pt(11)
                p.font.bold = True
                p.font.color.rgb = COLOR_BLANCO
                p.alignment = PP_ALIGN.CENTER
            else:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_BLANCO if ri % 2 == 1 else COLOR_GRIS_FONDO
                p.font.size = Pt(10.5)
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

    fases_rest = [
        ("Semanas 6–7 (08 al 16 Oct)", "Hito 6: Formulación de Cruces Espaciales y Cobertura Barrial", [
            "• Geoprocesos de proximidad a equipamientos críticos (salud DEIS, Metro L1/L2/L5, áreas verdes).",
            "• Cálculo de densidades y accesibilidad peatonal a escala de Manzana Censal 2024 y Unidad Vecinal."
        ]),
        ("Semanas 8–9 (19 al 30 Oct)", "Hitos 7 y 8: Refinamiento Cartográfico y Consolidación del Atlas", [
            "• Fortalecimiento de la simbología cartográfica e interoperabilidad del visor Leaflet con filtros avanzados.",
            "• Incorporación de exportador de reportes PDF sintéticos por Unidad Vecinal y revisión topológica PostGIS."
        ]),
        ("Semana 10 (02 al 06 Nov)", "Hito 9: Validación Empírica con Usuarios (4 Perfiles DCU)", [
            "• Pruebas de usabilidad guiadas a los 4 perfiles territoriales (municipio, vecinos, mapeadores, academia).",
            "• Recolección sistemática de feedback, tasas de éxito en búsqueda de capas y mejoras de interfaz."
        ]),
        ("Semana 11 (09 al 12 Nov)", "Hito 10: Manuales de Transferibilidad, Informe Final y Titulación", [
            "• Redacción del Manual Metodológico para el Departamento de Geografía UAH y Proyecto Fondecyt F1261256.",
            "• Elaboración y entrega del Informe Final de Práctica Profesional y preparación del examen de título."
        ])
    ]

    card_y_start = 1.70
    card_h = 1.15
    card_gap_y = 0.12
    for fi, (sem, hit, acts) in enumerate(fases_rest):
        cy = card_y_start + fi * (card_h + card_gap_y)
        agregar_tarjeta(s19, 0.8, cy, 11.733, card_h)
        
        # Bloque fecha e hito a la izquierda
        tb_f = s19.shapes.add_textbox(Inches(1.0), Inches(cy + 0.12), Inches(3.4), Inches(0.90))
        tf_f = tb_f.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
        p_sem = tf_f.paragraphs[0]
        p_sem.text = sem
        p_sem.font.name = FONT_NAME
        p_sem.font.size = Pt(12)
        p_sem.font.bold = True
        p_sem.font.color.rgb = COLOR_AZUL_UAH
        p_sem.space_after = Pt(2)
        p_hit = tf_f.add_paragraph()
        p_hit.text = hit
        p_hit.font.name = FONT_NAME
        p_hit.font.size = Pt(10.5)
        p_hit.font.bold = True
        p_hit.font.color.rgb = COLOR_AZUL_SEC

        # Bloque actividades a la derecha
        tb_act = s19.shapes.add_textbox(Inches(4.6), Inches(cy + 0.10), Inches(7.733), Inches(0.95))
        tf_act = tb_act.text_frame
        tf_act.word_wrap = True
        tf_act.margin_left = tf_act.margin_top = tf_act.margin_right = tf_act.margin_bottom = 0
        for act in acts:
            p_a = tf_act.add_paragraph()
            p_a.text = act
            p_a.font.name = FONT_NAME
            p_a.font.size = Pt(11)
            p_a.font.color.rgb = COLOR_NEGRO
            p_a.space_after = Pt(3)

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

    # 3 Tarjetas Verticales de Conclusiones (UN SOLO CONTENEDOR CADA UNA)
    c_w = 3.75
    c_gap = 0.24

    conclusiones = [
        ("Logros del Período (150 hrs)", [
            "OE 1 cumplido al 100%: 10 categorías VGI, 4 usuarios-tipo y 134 descriptores formalizados.",
            "Geodatabase consolidada: 118 capas activas (2.560 MB) y 3.730 MB en 214 archivos GeoJSON en disco.",
            "Calidad garantizada: Auditoría WLC v2.0 bajo ISO 19157 alcanzando un 97,88% IGV (Grado A+ en 116 capas).",
            "Geoportal en producción anticipada con 10 módulos funcionales operativos y costo $0/mes."
        ]),
        ("Aporte a la Gestión Territorial", [
            "Democratización de la información: Primera IDE local abierta de Barrio Brasil sin licencias privativas.",
            "Subsanación de vacíos estatales: 86 brechas cubiertas gracias al rol de los ciudadanos como sensores activos.",
            "Auditoría urbana en tiempo real: Integración del PRC Santiago (192 zonas) con semáforos UOCT y equipamiento.",
            "Gobernanza ética de datos: Separación jurídica estricta entre Ley 20.285 (Estado), ODbL 1.0 (OSM) y CC-BY 4.0 (GBIF)."
        ]),
        ("Desafíos de la Segunda Mitad", [
            "Cruces espaciales avanzados: Calibrar empíricamente los indicadores de proximidad y cobertura territorial.",
            "Validación empírica con usuarios: Evaluar usabilidad del geoportal con los 4 perfiles territoriales (OE 4).",
            "Transferibilidad efectiva: Dejar manuales claros que permitan al centro de práctica sostener el proyecto.",
            "Aporte al Fondecyt F1261256: Contribuir con un prototipo metodológico transferible para la investigación en Geografía."
        ])
    ]

    for ci, (ctit, citems) in enumerate(conclusiones):
        cx = 0.8 + ci * (c_w + c_gap)
        agregar_tarjeta(s20, cx, 1.70, c_w, 4.20)
        
        tb_c = s20.shapes.add_textbox(Inches(cx + 0.15), Inches(1.85), Inches(c_w - 0.30), Inches(3.90))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        
        p = tf_c.paragraphs[0]
        p.text = ctit
        p.font.name = FONT_NAME
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_AZUL_UAH
        p.space_after = Pt(8)

        for item in citems:
            p_it = tf_c.add_paragraph()
            p_it.text = f"• {item}"
            p_it.font.name = FONT_NAME
            p_it.font.size = Pt(11)
            p_it.font.color.rgb = COLOR_NEGRO
            p_it.space_after = Pt(5)

    # Franja inferior de cierre y agradecimientos
    agregar_tarjeta(s20, 0.8, 6.05, 11.733, 0.65, bg_color=COLOR_AZUL_UAH, border_color=COLOR_AZUL_UAH)
    tb_pie_final = s20.shapes.add_textbox(Inches(1.0), Inches(6.12), Inches(11.333), Inches(0.50))
    tf_pf = tb_pie_final.text_frame
    tf_pf.margin_left = tf_pf.margin_top = tf_pf.margin_right = tf_pf.margin_bottom = 0
    p_pf = tf_pf.paragraphs[0]
    p_pf.text = "Muchas gracias por su atención.  |  Juan Pablo Lescano Villegas (GEOJOTA)  |  atlasvgiuah.netlify.app"
    p_pf.font.name = FONT_NAME
    p_pf.font.size = Pt(12)
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
