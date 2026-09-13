import openpyxl
import os
import sys

BASE_DIR = r"D:\17082025\2026\Practica profesional\atlas_vgi_uah"
BBDD_PATH = r"D:\17082025\2026\Practica profesional\Base de datos VGI\BBDD.xlsx"

wb_bbdd = openpyxl.load_workbook(BBDD_PATH)
ws_bbdd = wb_bbdd.active

bbdd_rows = []
for r in range(2, ws_bbdd.max_row + 1):
    id_val = ws_bbdd.cell(row=r, column=1).value
    nombre = ws_bbdd.cell(row=r, column=2).value
    fuente = ws_bbdd.cell(row=r, column=3).value
    dir_path = ws_bbdd.cell(row=r, column=4).value
    join_info = ws_bbdd.cell(row=r, column=5).value
    
    if id_val and nombre:
        bbdd_rows.append([
            str(id_val),
            str(nombre).strip(),
            str(fuente).strip() if fuente else 'https://geoportal.cl',
            str(dir_path).strip() if dir_path else 'Consulta directa OGC / WMS',
            str(join_info).strip() if join_info else 'Geometría directa (Puntos / Polígonos / Líneas)'
        ])

print(f"Total BBDD rows loaded for catalog synchronization: {len(bbdd_rows)}")
