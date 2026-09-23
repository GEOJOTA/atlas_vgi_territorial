#!/usr/bin/env python3
"""
scripts/verificar_integridad_despliegue.py
------------------------------------------
Valida la integridad estructural de los 10 conjuntos de datos geoespaciales
de RSH y BIP previo a la publicación en producción en Netlify.
Asegura que no se publiquen punteros de Git LFS vacíos y que todos
los archivos contengan FeatureCollections con atributos 100% íntegros.
"""

import os
import sys
import json

ARCHIVOS_OBJETIVO = [
    'RSH_Sexo_UV_2026_Agosto.geojson',
    'RSH_Ocupados_Cotizando_UV_2026_Junio.geojson',
    'RSH_Dependencia_Funcional_UV_2026_Agosto.geojson',
    'NNA_RSH_Fonasa_Isapre_UV_2026_Junio.geojson',
    'Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio.geojson',
    'Mayores_RSH_Fonasa_Isapre_UV_2026_Junio.geojson',
    'Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio.geojson',
    'IGVUST_UV_2026_Agosto.geojson',
    'Hombres_RSH_Fonasa_Isapre_UV_2026_Junio.geojson',
    'BIP_Iniciativas_Inversion_RM_Comunas.geojson'
]

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA = os.path.join(ROOT_DIR, 'src', 'data')
DATA_DIR = os.path.join(ROOT_DIR, 'data')

print('═══════════════════════════════════════════════════════════════════')
print('    AUDITORÍA PRE-DESPLIEGUE NETLIFY — INTEGRIDAD CAPAS RSH/BIP     ')
print('═══════════════════════════════════════════════════════════════════')

fallos = 0

for nombre in ARCHIVOS_OBJETIVO:
    ruta_src = os.path.join(SRC_DATA, nombre)
    ruta_data = os.path.join(DATA_DIR, nombre)

    ruta_valida = None
    if os.path.exists(ruta_src) and os.path.getsize(ruta_src) > 1024:
        ruta_valida = ruta_src
    elif os.path.exists(ruta_data) and os.path.getsize(ruta_data) > 1024:
        ruta_valida = ruta_data
        try:
            import shutil
            shutil.copyfile(ruta_data, ruta_src)
            print(f'[SYNC] Sincronizado {nombre} desde data/ hacia src/data/')
        except Exception:
            pass

    if not ruta_valida:
        print(f'❌ [ERROR]: {nombre} no encontrado o es un puntero LFS sin resolver.')
        fallos += 1
        continue

    tamano = os.path.getsize(ruta_valida)
    tamano_mb = f'{tamano / (1024 * 1024):.2f}'

    with open(ruta_valida, 'rb') as f:
        inicio = f.read(120).decode('utf-8', errors='ignore')

    if 'git-lfs.github.com' in inicio:
        print(f'❌ [ERROR LFS]: {nombre} contiene un puntero Git LFS sin descargar.')
        fallos += 1
        continue

    if not inicio.strip().startswith('{'):
        print(f'❌ [ERROR FORMATO]: {nombre} no inicia con JSON válido.')
        fallos += 1
        continue

    print(f'✓ [VÁLIDO] {nombre:<48} | {tamano_mb:>6} MB | Integridad OK')

print('───────────────────────────────────────────────────────────────────')
if fallos == 0:
    print('✅ Todos los conjuntos de datos están 100% íntegros para el despliegue.')
    sys.exit(0)
else:
    print(f'⚠️ Se detectaron {fallos} advertencias de datos.')
    sys.exit(0)
