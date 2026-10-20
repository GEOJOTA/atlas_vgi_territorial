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

contenido_final = "\n\n---\n\n".join(partes) + "\n"

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
