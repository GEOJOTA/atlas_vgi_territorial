import openpyxl
import json
import os
import re

bbdd_path = r'D:\17082025\2026\Practica profesional\Base de datos VGI\BBDD.xlsx'
wb = openpyxl.load_workbook(bbdd_path)
ws = wb.active

headers = [cell.value for cell in ws[1]]

def sanitize_id(idx, name):
    name_clean = re.sub(r'[^a-zA-Z0-9]', '_', name.lower())
    name_clean = re.sub(r'_+', '_', name_clean).strip('_')
    return f"capa_{idx:02d}_{name_clean[:25]}"

def get_group(nombre):
    n = nombre.lower()
    if any(k in n for k in ['prc', 'prms', 'ipt', 'zonificaci', 'normat', 'lmite', 'limite', 'predio', 'fronteri', 'dpa', 'divisi']):
        return 'normativa_ipt'
    elif any(k in n for k in ['bombero', 'carabinero', 'cuartel', 'seguridad', 'juzgado', 'delito', 'plan cuadrante']):
        return 'seguridad'
    elif any(k in n for k in ['salud', 'enfermedad', 'fonasa', 'isapre', 'cesfam', 'hospital', 'dependencia']):
        return 'salud'
    elif any(k in n for k in ['educac', 'escuela', 'colegio', 'jard', 'junji', 'integra', 'universid', 'parvularia', 'escolar', 'superior']):
        return 'educacion'
    elif any(k in n for k in ['hidr', 'agua', 'cuenca', 'rio', 'fluvio', 'sedimento', 'aire', 'clima', 'kppen', 'koppen', 'biomasa', 'carbono', 'vegeta', 'luebert', 'snaspe', 'silvestre', 'erosi', 'vivero', 'humedal', 'frutal', 'bosque', 'forestal', 'canales']):
        return 'medio_ambiente_riesgos'
    elif any(k in n for k in ['vial', 'red vial', 'ciclov', 'metro', 'ferro', 'interconexi', 'transporte', 'paso', 'concesio']):
        return 'movilidad_transporte'
    elif any(k in n for k in ['deport', 'parque', 'plaza', 'recrea', 'turist', 'circuito']):
        return 'espacio_publico'
    elif any(k in n for k in ['feria', 'mercado', 'comercio', 'inversi', 'bip', 'industria', 'odepa', 'infor', 'antenas', 'torres']):
        return 'economico_agricola'
    elif any(k in n for k in ['vulnerab', 'igvust', 'rsh', 'campamento', 'condominio', 'nna', 'mujer', 'joven', 'hombre', 'mayor', 'ocupado', 'socio', 'comunit', 'vecinal', 'municip', 'sernam', 'opd', 'protecci']):
        return 'social_comunidades'
    return 'equipamiento_infraestructura'

def get_color(grupo):
    palette = {
        'normativa_ipt': '#D97706',
        'seguridad': '#F59E0B',
        'salud': '#EF4444',
        'educacion': '#3B82F6',
        'medio_ambiente_riesgos': '#10B981',
        'movilidad_transporte': '#06B6D4',
        'espacio_publico': '#8B5CF6',
        'economico_agricola': '#F97316',
        'social_comunidades': '#6366F1',
        'equipamiento_infraestructura': '#64748B'
    }
    return palette.get(grupo, '#38BDF8')

def get_icono(grupo):
    icons = {
        'normativa_ipt': '📜',
        'seguridad': '🛡️',
        'salud': '🏥',
        'educacion': '🏫',
        'medio_ambiente_riesgos': '🌳',
        'movilidad_transporte': '🚲',
        'espacio_publico': '⚽',
        'economico_agricola': '💰',
        'social_comunidades': '👥',
        'equipamiento_infraestructura': '🏛️'
    }
    return icons.get(grupo, '📍')

capas_74 = {}

for r in range(2, ws.max_row + 1):
    id_val = ws.cell(row=r, column=1).value
    nombre = ws.cell(row=r, column=2).value
    fuente = ws.cell(row=r, column=3).value
    dir_path = ws.cell(row=r, column=4).value
    join_info = ws.cell(row=r, column=5).value
    
    if not id_val or not nombre:
        continue
        
    idx = int(id_val)
    nombre_str = str(nombre).strip()
    fuente_str = str(fuente).strip() if fuente else 'https://geoportal.cl'
    dir_str = str(dir_path).strip() if dir_path else ''
    join_str = str(join_info).strip() if join_info else None
    
    key_id = f"capa_{idx:02d}"
    grupo = get_group(nombre_str)
    
    # Determine local file filename
    archivo_local = f"data/capa_oficial_{idx:02d}.geojson"
    if idx == 64 or idx == 66 or (join_str and "Unidades Vecinales" in join_str):
        archivo_local = "data/capa_unidades_vecinales_bidat.geojson"
    elif idx == 65:
        archivo_local = "data/bip_inversiones_santiago.csv"
    elif "salud" in nombre_str.lower():
        archivo_local = "data/capa_salud_oficial.geojson"
    elif "educac" in nombre_str.lower() and "superior" in nombre_str.lower():
        archivo_local = "data/capa_educacion_superior.geojson"
    elif "educac" in nombre_str.lower() and "escolar" in nombre_str.lower():
        archivo_local = "data/capa_educacion_escolar.geojson"
    elif "bombero" in nombre_str.lower():
        archivo_local = "data/capa_cuarteles_bomberos.geojson"
    elif "junji" in nombre_str.lower() or "integra" in nombre_str.lower():
        archivo_local = "data/capa_jardines_junji.geojson"
    elif "deport" in nombre_str.lower():
        archivo_local = "data/capa_infraestructura_deportiva.geojson"
    elif "ferias" in nombre_str.lower():
        archivo_local = "data/capa_ferias_libres.geojson"
    elif "ciclov" in nombre_str.lower():
        archivo_local = "data/capa_ciclovias_mop.geojson"
    elif "meteorol" in nombre_str.lower():
        archivo_local = "data/capa_estaciones_meteorologicas.geojson"

    capas_74[key_id] = {
        "id": key_id,
        "num_bbdd": idx,
        "nombre": nombre_str,
        "institucion": "Estado de Chile / IDE Chile / " + (fuente_str.split('/')[2] if '://' in fuente_str else 'Geoportal'),
        "ministerio": "Organismo Público del Estado de Chile",
        "tipoServicio": "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
        "urlServicio": fuente_str,
        "archivoLocal": archivo_local,
        "color": get_color(grupo),
        "icono": get_icono(grupo),
        "geometria": "Vectorial / Tabular Georreferenciada",
        "grupo": grupo,
        "joinInfo": join_str,
        "descripcion": f"Capa cartográfica e indicador territorial N° {idx:02d}: '{nombre_str}'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
        "declaracion": "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
        "citaAPA": f"Estado de Chile. (2026). {nombre_str} (Capa N° {idx:02d}). IDE Chile / Geoportal de Chile. {fuente_str}"
    }

print(f"Generated 74 layers dictionary mapping successfully! Total count: {len(capas_74)}")
with open(r'D:\17082025\2026\Practica profesional\atlas_vgi_uah\scratch\capas_74_dict.json', 'w', encoding='utf-8') as f:
    json.dump(capas_74, f, ensure_ascii=False, indent=2)
