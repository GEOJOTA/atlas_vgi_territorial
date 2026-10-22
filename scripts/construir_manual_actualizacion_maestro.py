#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/construir_manual_actualizacion_maestro.py
------------------------------------------------
Genera y sincroniza el MANUAL_ACTUALIZACION_ATLAS.md monumental (>= 5000 líneas)
para el Atlas de Información Geográfica Voluntaria (VGI) — Departamento de Geografía UAH.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGETS = [
    os.path.join(BASE_DIR, "MANUAL_ACTUALIZACION_ATLAS.md"),
    os.path.join(BASE_DIR, "docs", "MANUAL_ACTUALIZACION_ATLAS.md"),
    os.path.join(BASE_DIR, "src", "docs", "MANUAL_ACTUALIZACION_ATLAS.md")
]

print("[*] Iniciando construcción del Manual de Actualización Técnica y Operativa Maestro (>= 5000 líneas)...")

# 1. Importar las 8 partes modulares especializadas
sys.path.insert(0, os.path.join(BASE_DIR, "scripts"))
try:
    from manual_p01_genesis_metodologia import PARTE_01
    from manual_p02_ingenieria_datos import PARTE_02
    from manual_p03_modelos_calidad_metadatos import PARTE_03
    from manual_p04_frontend_cartografia import PARTE_04
    from manual_p05_personalizacion_gui import PARTE_05
    from manual_p06_backend_operaciones import PARTE_06
    from manual_p07_soporte_bibliografia import PARTE_07
    from manual_p08_tutorial_personalizacion import PARTE_08
except ImportError as e:
    print(f"[-] Error al importar módulos de partes del manual: {e}")
    sys.exit(1)

# 2. Concatenación secuencial de las 8 partes
partes = [
    PARTE_01.strip(),
    PARTE_02.strip(),
    PARTE_03.strip(),
    PARTE_04.strip(),
    PARTE_05.strip(),
    PARTE_06.strip(),
    PARTE_07.strip(),
    PARTE_08.strip()
]


INDICE_GENERAL = r"""# ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA (VGI) PARA LA GESTIÓN TERRITORIAL
## Manual Maestro de Actualización Técnica, Transferibilidad Metodológica y Arquitectura Operativa

---

## Índice General de Contenidos

### [PARTE I: ALCANCE OPERATIVO, FORMULACIÓN ESTRATÉGICA Y PERFILES TERRITORIALES](#parte-i-alcance-operativo-formulación-estratégica-y-perfiles-territoriales)
* [Identificación y Alcance Operativo del Proyecto](#identificación-y-alcance-operativo-del-proyecto)
  * [Propósito y Misión Operativa](#propósito-y-misión-operativa)
  * [Delimitación Geodésica y Cobertura Territorial](#delimitación-geodésica-y-cobertura-territorial)
* [Formulación Estratégica: Objetivos del Plan de Trabajo](#formulación-estratégica-objetivos-del-plan-de-trabajo)
  * [Objetivo General de la Práctica Profesional](#objetivo-general-de-la-práctica-profesional)
  * [Objetivos Específicos y Metas Operativas (OE 1 a OE 4)](#objetivos-específicos-y-metas-operativas)
* [Matriz de Cumplimiento de los 10 Hitos del Plan de Trabajo](#matriz-de-cumplimiento-de-los-10-hitos-del-plan-de-trabajo)
* [Los Cuatro Perfiles de Actores Territoriales](#los-cuatro-perfiles-de-actores-territoriales-alineación-con-plataforma-web-en-vivo)
  * [Perfil 1: Autoridades / Instituciones (IDE / Municipio)](#perfil-1-autoridades--instituciones-ide--municipio-institucion)
  * [Perfil 2: Organizaciones Comunitarias / Vecinos](#perfil-2-organizaciones-comunitarias--vecinos-comunidad)
  * [Perfil 3: Mapeadores / Voluntarios OSM](#perfil-3-mapeadores--voluntarios-osm-voluntario)
  * [Perfil 4: ONGs / Territoriales](#perfil-4-ongs--territoriales-ong)

### [PARTE II: INGENIERÍA DE DATOS, PIPELINES DE EXTRACCIÓN Y NORMALIZACIÓN CARTOGRÁFICA](#parte-ii-ingeniería-de-datos-pipelines-de-extracción-y-normalización-cartográfica)
* [6. Arquitectura y Taxonomía de las 10 Macrocategorías Comunitarias VGI (CAT-01 a CAT-10)](#6-arquitectura-y-taxonomía-de-las-10-macrocategorías-comunitarias-vgi)
* [7. Pipeline de Extracción con Overpass API y Overpass QL](#7-pipeline-de-extracción-con-overpass-api-y-overpass-ql)
  * [7.1. Arquitectura de las Consultas Overpass QL](#71-arquitectura-de-las-consultas-overpass-ql)
  * [7.2. Mecanismo de Rotación de Servidores Espejo (Round-Robin Failover)](#72-mecanismo-de-rotación-de-servidores-espejo-round-robin-failover)
* [8. Auditoría Histórica y Análisis Espacio-Temporal con ohsome API v1/v2 (HeiGIT)](#8-auditoría-histórica-y-análisis-espacio-temporal-con-ohsome-api-v1v2-heigit)
* [9. Integración de Biodiversidad y Ciencia Ciudadana con GBIF y Darwin Core](#9-integración-de-biodiversidad-y-ciencia-ciudadana-con-gbif-y-darwin-core)
* [10. Integración de Cartografía Externa con uMap e iframes Aislados](#10-integración-de-cartografía-externa-con-umap-e-iframes-aislados)
* [11. Pipeline de Descarga e Integración de Capas Oficiales del Estado de Chile (IDE Chile / SNIT)](#11-pipeline-de-descarga-e-integración-de-capas-oficiales-del-estado-de-chile-ide-chile--snit)
* [12. Protocolo de Estandarización Geodésica, Limpieza Topológica y Validación OGC](#12-protocolo-de-estandarización-geodésica-limpieza-topológica-y-validación-ogc)
* [13. El Esquema Maestro de los 14 Atributos Normalizados ISO](#13-el-esquema-maestro-de-los-14-atributos-normalizados-iso)
* [14. Diccionario de Datos Completo de las 121 Capas Oficiales Integradas](#14-diccionario-de-datos-completo-de-las-121-capas-oficiales-integradas)

### [PARTE III: MODELAMIENTO MATEMÁTICO DE CALIDAD, METADATOS Y ESTÁNDARES INTERNACIONALES](#parte-iii-modelamiento-matemático-de-calidad-metadatos-y-estándares-internacionales)
* [15. Modelo de MetaCalidad WLC v2.0 (ISO 19157:2013 / ISO 19157-1:2023)](#15-modelo-de-metacalidad-wlc-v20-iso-191572013--iso-19157-12023)
  * [15.1. Formulación Matemática Canónica (Pilares Cuantitativo y Cualitativo)](#151-formulación-matemática-canónica)
  * [15.2. Desglose Algorítmico y Fórmulas de las 10 Dimensiones de Calidad](#152-desglose-algorítmico-y-fórmulas-de-las-10-dimensiones-de-calidad)
  * [15.3. Rangos y Certificación Formal de Calidad](#153-rangos-y-certificación-formal-de-calidad)
* [16. Correlaciones Estadísticas, Sensibilidad y Ranking de Metacalidad](#16-correlaciones-estadísticas-sensibilidad-y-ranking-de-metacalidad)
* [17. Perfil de Metadatos ISO 19115-1:2014 / IDE Chile v2.0](#17-perfil-de-metadatos-iso-19115-12014--ide-chile-v20)
* [18. Especificación Técnica de Exportación XML ISO 19139:2007 (gmd:MD_Metadata)](#18-especificación-técnica-de-exportación-xml-iso-191392007-gmdmdmetadata)
* [19. Diccionario Territorial Interactivo: Los 140 Descriptores Normativos y Etiquetas OSM](#19-diccionario-territorial-interactivo-los-140-descriptores-normativos-y-etiquetas-osm)

### [PARTE IV: INGENIERÍA DE SOFTWARE, FRONTEND Y VISUALIZACIÓN INTERACTIVA](#parte-iv-ingeniería-de-software-frontend-y-visualización-interactiva)
* [20. Arquitectura de Software Frontend: Zero-Build Vanilla JavaScript SPA](#20-arquitectura-de-software-frontend-zero-build-vanilla-javascript-spa)
* [21. Módulo 00: Visor Cartográfico Multinivel y Motor Leaflet 1.9.4](#21-módulo-00-visor-cartográfico-multinivel-y-motor-leaflet-194)
* [22. Módulo 01: Explorador de Datos Abiertos OSM & Cliente Overpass QL en Vivo](#22-módulo-01-explorador-de-datos-abiertos-osm--cliente-overpass-ql-en-vivo)
* [23. Módulo 02: Analizador Espacio-Temporal de Calidad VGI (ohsome API)](#23-módulo-02-analizador-espacio-temporal-de-calidad-vgi-ohsome-api)
* [24. Módulo 03: Geoportal de Biodiversidad Urbana y Ecosistemas (GBIF / Darwin Core)](#24-módulo-03-geoportal-de-biodiversidad-urbana-y-ecosistemas-gbif--darwin-core)
* [25. Módulo 04: Visualizador de Cartografía Participativa uMap](#25-módulo-04-visualizador-de-cartografía-participativa-umap)
* [26. Módulo 05: Generador y Validador de Metadatos ISO 19115 / XML ISO 19139](#26-módulo-05-generador-y-validador-de-metadatos-iso-19115--xml-iso-19139)
* [27. Módulo 06: Evaluador e Inspector Normativo Territorial del PRC de Santiago](#27-módulo-06-evaluador-e-inspector-normativo-territorial-del-prc-de-santiago)
* [28. Módulo 07: Glosario y Diccionario Territorial Dinámico](#28-módulo-07-glosario-y-diccionario-territorial-dinámico)
* [29. Módulo 08: Catálogo de Descarga Abierta de Geodatos y Formatos OpenXML](#29-módulo-08-catálogo-de-descarga-abierta-de-geodatos-y-formatos-openxml)
* [30. Módulo 09: Terminal de Soporte, Diagnóstico de APIs y Monitoreo de Red](#30-módulo-09-terminal-de-soporte-diagnóstico-de-apis-y-monitoreo-de-red)
* [31. Módulo 10: Manual de Uso Interactivo y Guías por Perfil de Actor](#31-módulo-10-manual-de-uso-interactivo-y-guías-por-perfil-de-actor)

### [PARTE V: PERSONALIZACIÓN VISUAL, ESTILOS, PUNTEROS Y CONFIGURACIÓN PERIMETRAL](#parte-v-personalización-visual-estilos-punteros-y-configuración-perimetral)
* [32. Sistema de Diseño e Identidad Visual Cartográfica](#32-sistema-de-diseño-e-identidad-visual-cartográfica)
* [33. Especificación de Marcadores Vectoriales SVG y Simbología Temática](#33-especificación-de-marcadores-vectoriales-svg-y-simbología-temática)
* [34. Capas Base Disponibles y Mecanismo de Conmutación en Caliente](#34-capas-base-disponibles-y-mecanismo-de-conmutación-en-caliente)
* [35. Configuración de Punteros de Mapas Base y Proxies CORS](#35-configuración-de-punteros-de-mapas-base-y-proxies-cors)
* [36. Control de Caché en el Edge y Cabeceras HTTP de Alta Disponibilidad](#36-control-de-caché-en-el-edge-y-cabeceras-http-de-alta-disponibilidad)

### [PARTE VI: ARQUITECTURA DE DATOS POSTGIS, BACKEND Y PIPELINE DE AUTOMATIZACIÓN](#parte-vi-arquitectura-de-datos-postgis-backend-y-pipeline-de-automatización)
* [37. Arquitectura de Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3](#37-arquitectura-de-base-de-datos-espacial-postgresql-17--postgis-33)
* [38. Diccionario Físico de Datos: Tablas Maestras y Esquemas Espaciales](#38-diccionario-físico-de-datos-tablas-maestras-y-esquemas-espaciales)
* [39. Procedimientos Almacenados y Funciones RPC PostGIS](#39-procedimientos-almacenados-y-funciones-rpc-postgis)
* [40. Políticas de Seguridad por Fila (Row Level Security - RLS)](#40-políticas-de-seguridad-por-fila-row-level-security---rls)
* [41. Pipeline de Automatización ETL y Actualización Diaria de Datos](#41-pipeline-de-automatización-etl-y-actualización-diaria-de-datos)
* [42. Empaquetado Automático del Archivo Maestro Comprimido ZIP](#42-empaquetado-automático-del-archivo-maestro-comprimido-zip)
* [43. Testing Automatizado y Batería de Pruebas de Calidad](#43-testing-automatizado-y-batería-de-pruebas-de-calidad)

### [PARTE VII: OPERACIONES DE DESPLIEGUE, TROUBLESHOOTING, GLOSARIO Y MARCO TEÓRICO](#parte-vii-operaciones-de-despliegue-troubleshooting-glosario-y-marco-teórico)
* [44. Procedimiento Canónico de Actualización y Despliegue en Producción](#44-procedimiento-canónico-de-actualización-y-despliegue-en-producción)
* [45. Convenciones de Control de Versiones Git y Git LFS](#45-convenciones-de-control-de-versiones-git-y-git-lfs)
* [46. Matriz de Resolución de Incidentes y Errores Comunes (Troubleshooting)](#46-matriz-de-resolución-de-incidentes-y-errores-comunes-troubleshooting)
* [47. Auditoría de Seguridad, Integridad Criptográfica y Accesibilidad WCAG 2.1 AAA](#47-auditoría-de-seguridad-integridad-criptográfica-y-accesibilidad-wcag-21-aaa)
* [48. Glosario Exhaustivo de Términos Geográficos, Tecnológicos y Normativos](#48-glosario-exhaustivo-de-términos-geográficos-tecnológicos-y-normativos)
* [49. Referencias Bibliográficas y Normativa Citada (Norma APA 7ª Edición)](#49-referencias-bibliográficas-y-normativa-citada)

### [PARTE VIII: GUÍA MAESTRA DE MODIFICACIÓN DETALLE A DETALLE (COOKBOOK OPERATIVO)](#parte-viii-guía-maestra-de-modificación-detalle-a-detalle-cookbook-operativo)
* [50. Cómo Añadir una Nueva Capa Cartográfica Oficial del Estado al Atlas](#50-cómo-añadir-una-nueva-capa-cartográfica-oficial-del-estado-al-atlas)
* [51. Cómo Añadir una Nueva Macrocategoría o Subcategoría Temática VGI](#51-cómo-añadir-una-nueva-macrocategoría-o-subcategoría-temática-vgi)
* [52. Cómo Actualizar la Base de Datos Espacial en PostgreSQL / PostGIS](#52-cómo-actualizar-la-base-de-datos-espacial-en-postgresql--postgis)
* [53. Cómo Modificar las Consultas Overpass QL del Módulo 01](#53-cómo-modificar-las-consultas-overpass-ql-del-módulo-01)
* [54. Cómo Modificar las Reglas del Evaluador Normativo del PRC de Santiago](#54-cómo-modificar-las-reglas-del-evaluador-normativo-del-prc-de-santiago)
* [55. Cómo Personalizar la Paleta de Colores, Estilos CSS y Marcadores SVG](#55-cómo-personalizar-la-paleta-de-colores-estilos-css-y-marcadores-svg)
* [56. Cómo Añadir Nuevos Términos al Diccionario Territorial Interactivo](#56-cómo-añadir-nuevos-términos-al-diccionario-territorial-interactivo)
* [57. Cómo Regenerar y Distribuir el Paquete ZIP de Datos Maestros](#57-cómo-regenerar-y-distribuir-el-paquete-zip-de-datos-maestros)
* [58. Checklist de Validación y Despliegue a Producción](#58-checklist-de-validación-y-despliegue-a-producción)

---
"""

contenido_final = INDICE_GENERAL.strip() + "\n\n---\n\n" + "\n\n---\n\n".join(partes) + "\n"

# 3. Auditoría estricta de palabras prohibidas (Zero-Leak)
forbidden_matches = 0
for lnum, line in enumerate(contenido_final.splitlines(), start=1):
    low = line.lower()
    terminos_prohibidos = ["fon" + "decyt", "f126" + "1256", "f-126" + "1256"]
    if any(t in low for t in terminos_prohibidos):
        print(f"[-] ERROR: Mención no autorizada detectada en línea {lnum}: {line.strip()}")
        forbidden_matches += 1

if forbidden_matches > 0:
    print(f"[-] Fallo de validación: {forbidden_matches} referencias no autorizadas encontradas. Abortando.")
    sys.exit(1)

print("[✓] Auditoría de sanitización institucional aprobada: 0 menciones prohibidas detectadas.")

# 4. Conteo estricto de líneas (debe ser >= 5000)
lineas_totales = len(contenido_final.splitlines())
print(f"[*] Conteo de líneas del documento generado: {lineas_totales} líneas.")

UMBRAL_MINIMO = 5000
if lineas_totales < UMBRAL_MINIMO:
    print(f"[-] ERROR: El documento contiene {lineas_totales} líneas, por debajo del umbral mínimo de {UMBRAL_MINIMO} líneas.")
    sys.exit(1)

print(f"[✓] Validación de longitud superada: {lineas_totales} >= {UMBRAL_MINIMO} líneas.")

# 5. Escribir en los tres destinos oficiales
for target in TARGETS:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as f:
        f.write(contenido_final)
    print(f"[✓] Manual sincronizado en: {target}")

print(f"\n[✓✓✓] MANUAL_ACTUALIZACION_ATLAS.md generado exitosamente con {lineas_totales} líneas.")
