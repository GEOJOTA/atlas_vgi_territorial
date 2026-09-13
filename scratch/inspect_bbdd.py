import openpyxl
import os
import glob
import zipfile
import pandas as pd

bbdd_path = r'D:\17082025\2026\Practica profesional\Base de datos VGI\BBDD.xlsx'
wb = openpyxl.load_workbook(bbdd_path)
ws = wb.active

available_layers = []
missing_files = []

for r in range(2, ws.max_row + 1):
    id_val = ws.cell(row=r, column=1).value
    nombre = ws.cell(row=r, column=2).value
    fuente = ws.cell(row=r, column=3).value
    dir_path = ws.cell(row=r, column=4).value
    join_info = ws.cell(row=r, column=5).value
    
    if not nombre:
        continue
        
    exists = False
    fsize_mb = 0
    if dir_path and os.path.exists(dir_path):
        exists = True
        fsize_mb = round(os.path.getsize(dir_path) / (1024*1024), 2)
    elif dir_path and str(dir_path).startswith(':'):
        fixed_path = 'D' + str(dir_path)
        if os.path.exists(fixed_path):
            exists = True
            dir_path = fixed_path
            fsize_mb = round(os.path.getsize(fixed_path) / (1024*1024), 2)
            
    info = {
        'id': id_val,
        'nombre': nombre,
        'dir': dir_path,
        'exists': exists,
        'size_mb': fsize_mb,
        'join': join_info,
        'fuente': fuente
    }
    if exists:
        available_layers.append(info)
    else:
        missing_files.append(info)

print(f"Total Catalog Items in BBDD.xlsx: {len(available_layers) + len(missing_files)}")
print(f"Available Files on Disk: {len(available_layers)}")
print(f"No Local File / Online Only: {len(missing_files)}")

print("\n--- Available Local Files ---")
for item in available_layers:
    print(f"ID {item['id']}: {item['nombre']} ({item['size_mb']} MB) | Join: {item['join']}")

if missing_files:
    print("\n--- Missing / Online Only Items ---")
    for item in missing_files:
        print(f"ID {item['id']}: {item['nombre']} | DIR: {item['dir']}")
