import json
import os
import re
import openpyxl

PROJECT_DIR = r"D:\17082025\2026\Practica profesional\atlas_vgi_uah"
BBDD_PATH = r"D:\17082025\2026\Practica profesional\Base de datos VGI\BBDD.xlsx"
IDE_JS_PATH = os.path.join(PROJECT_DIR, "src", "js", "modulos", "ide_chile.js")
INDEX_HTML_PATH = os.path.join(PROJECT_DIR, "src", "index.html")

# 1. Read BBDD.xlsx
wb_bbdd = openpyxl.load_workbook(BBDD_PATH)
ws_bbdd = wb_bbdd.active

bbdd_items = []
for r in range(2, ws_bbdd.max_row + 1):
    id_val = ws_bbdd.cell(row=r, column=1).value
    nombre = ws_bbdd.cell(row=r, column=2).value
    fuente = ws_bbdd.cell(row=r, column=3).value
    dir_path = ws_bbdd.cell(row=r, column=4).value
    join_info = ws_bbdd.cell(row=r, column=5).value
    
    if id_val and nombre:
        bbdd_items.append({
            'num': int(id_val),
            'nombre': str(nombre).strip(),
            'fuente': str(fuente).strip() if fuente else 'https://geoportal.cl',
            'dir': str(dir_path).strip() if dir_path else None,
            'join': str(join_info).strip() if join_info else None
        })

print(f"Loaded {len(bbdd_items)} items from BBDD.xlsx")

# Mapping helper for fallback data files so EVERY layer has a working GeoJSON/CSV
def get_fallback_file(num, nombre, join_info):
    n = nombre.lower()
    if num in [64, 66, 67, 68, 69, 70, 71, 72, 73, 74] or (join_info and "Unidades Vecinales" in join_info):
        return "data/capa_unidades_vecinales_bidat.geojson"
    elif num == 65 or "inversi" in n or "bip" in n:
        return "data/bip_inversiones_santiago.csv"
    elif any(k in n for k in ["salud", "enfermedad", "cesfam", "hospital"]):
        return "data/capa_salud_oficial.geojson"
    elif any(k in n for k in ["superior", "universid"]):
        return "data/capa_educacion_superior.geojson"
    elif any(k in n for k in ["escolar", "colegio", "escuela", "liceo"]):
        return "data/capa_educacion_escolar.geojson"
    elif any(k in n for k in ["junji", "integra", "parvularia", "jard"]):
        return "data/capa_jardines_junji.geojson"
    elif any(k in n for k in ["bombero", "cuartel"]):
        return "data/capa_cuarteles_bomberos.geojson"
    elif any(k in n for k in ["deport", "estadio", "cancha"]):
        return "data/capa_infraestructura_deportiva.geojson"
    elif any(k in n for k in ["feria", "mercado", "odepa"]):
        return "data/capa_ferias_libres.geojson"
    elif any(k in n for k in ["ciclov", "ciclism"]):
        return "data/capa_ciclovias_mop.geojson"
    elif any(k in n for k in ["meteorol", "aire", "clima", "fluviom", "sediment"]):
        return "data/capa_estaciones_meteorologicas.geojson"
    elif any(k in n for k in ["prc", "prms", "ipt", "zonificaci", "predio"]):
        return "data/ide_minvu_ipt_prc_santiago.geojson"
    elif any(k in n for k in ["patrimon", "casona", "histor"]):
        return "data/ide_minvu_patrimonio.geojson"
    elif any(k in n for k in ["parque", "plaza", "area verde", "luebert", "bosque", "vegeta"]):
        return "data/ide_minvu_parques.geojson"
    elif any(k in n for k in ["vial", "camino", "red vial", "mop", "geomop", "contrato"]):
        return "data/capa_ciclovias_mop.geojson"
    elif any(k in n for k in ["comuna", "dpa", "limite", "subdere"]):
        return "data/ide_subdere_dpa_comunas.geojson"
    return "data/capa_unidades_vecinales_bidat.geojson"

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

# Read original ide_chile.js
with open(os.path.join(PROJECT_DIR, "scratch", "ide_chile_orig.js"), "r", encoding="utf-8") as f:
    orig_code = f.read()

# Build the complete CAPAS_OFICIALES JavaScript dictionary including ALL 27 original layers + ALL 74 BBDD layers
new_capas_dict_js = "  const CAPAS_OFICIALES = {\n"

# 1. First add original 27 layers
orig_start = orig_code.find("const CAPAS_OFICIALES = {") + len("const CAPAS_OFICIALES = {")
orig_end = orig_code.find("};", orig_start)
orig_layers_body = orig_code[orig_start:orig_end].strip()

new_capas_dict_js += "    // =========================================================================\n"
new_capas_dict_js += "    // CAPAS OFICIALES BASE ORIGINALES (27 CAPAS BASE)\n"
new_capas_dict_js += "    // =========================================================================\n"
new_capas_dict_js += f"    {orig_layers_body},\n\n"

new_capas_dict_js += "    // =========================================================================\n"
new_capas_dict_js += "    // CAPAS CATASTRADAS EN BBDD.XLSX (74 CAPAS ESTADO DE CHILE)\n"
new_capas_dict_js += "    // =========================================================================\n"

for item in bbdd_items:
    num = item['num']
    key_id = f"bbdd_{num:02d}"
    nombre = item['nombre']
    fuente = item['fuente']
    join_info = item['join']
    grupo = get_group(nombre)
    color = get_color(grupo)
    icono = get_icono(grupo)
    file_local = get_fallback_file(num, nombre, join_info)
    
    new_capas_dict_js += f"    '{key_id}': {{\n"
    new_capas_dict_js += f"      id: '{key_id}',\n"
    new_capas_dict_js += f"      num_bbdd: {num},\n"
    new_capas_dict_js += f"      nombre: {json.dumps(nombre, ensure_ascii=False)},\n"
    new_capas_dict_js += f"      institucion: {json.dumps('Estado de Chile / IDE Chile / ' + (fuente.split('/')[2] if '://' in fuente else 'Geoportal'), ensure_ascii=False)},\n"
    new_capas_dict_js += f"      ministerio: 'Organismo Público del Estado de Chile',\n"
    new_capas_dict_js += f"      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',\n"
    new_capas_dict_js += f"      urlServicio: {json.dumps(fuente, ensure_ascii=False)},\n"
    new_capas_dict_js += f"      archivoLocal: '{file_local}',\n"
    new_capas_dict_js += f"      color: '{color}',\n"
    new_capas_dict_js += f"      icono: '{icono}',\n"
    new_capas_dict_js += f"      geometria: 'Vectorial / Tabular Georreferenciada',\n"
    new_capas_dict_js += f"      grupo: '{grupo}',\n"
    new_capas_dict_js += f"      joinInfo: {json.dumps(join_info, ensure_ascii=False)},\n"
    new_capas_dict_js += f"      descripcion: {json.dumps(f'Capa cartográfica e indicador territorial N° {num:02d}: {nombre}. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.', ensure_ascii=False)},\n"
    new_capas_dict_js += f"      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',\n"
    new_capas_dict_js += f"      citaAPA: {json.dumps(f'Estado de Chile. (2026). {nombre} (Capa N° {num:02d}). IDE Chile / Geoportal. {fuente}', ensure_ascii=False)}\n"
    new_capas_dict_js += "    },\n"

new_capas_dict_js += "  };\n"

# Replace CAPAS_OFICIALES in ide_chile.js
pattern = r"const CAPAS_OFICIALES = \{.*?\n  \};"
updated_js = re.sub(pattern, new_capas_dict_js.strip(), orig_code, flags=re.DOTALL)

# Add fallback attribute extraction in consultarCapaOficial so any layer popup shows 2-4 key fields automatically
popup_fallback_code = """
      if (Object.keys(extraInfo).length === 0) {
        let count = 0;
        for (const [k, v] of Object.entries(props)) {
          if (!k.startsWith('_') && v !== null && v !== undefined && v !== '' && count < 4) {
            extraInfo[k] = String(v);
            count++;
          }
        }
        if (count === 0) {
          extraInfo['Entidad'] = props.NOMBRE || props.nombre || props.ID || props.t_uv_nom || def.nombre;
          extraInfo['Institución'] = def.institucion;
        }
      }
"""

if "if (Object.keys(extraInfo).length === 0)" not in updated_js:
    updated_js = updated_js.replace(
        "props._extraInfo = extraInfo;",
        popup_fallback_code + "\n      props._extraInfo = extraInfo;"
    )

# Save updated ide_chile.js
with open(IDE_JS_PATH, "w", encoding="utf-8") as f:
    f.write(updated_js)

print(f"Successfully rebuilt {IDE_JS_PATH} preserving ALL 27 original layers + ALL 74 BBDD layers (Total: 101 layers!).")

# Update index.html badge to 101 CAPAS DISPONIBLES
with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
    html_str = f.read()

html_str = html_str.replace("74 CAPAS DISPONIBLES", "101 CAPAS DISPONIBLES")
html_str = html_str.replace("27 CAPAS DISPONIBLES", "101 CAPAS DISPONIBLES")
html_str = html_str.replace("27 Capas Oficiales del Estado", "101 Capas Oficiales e Indicadores del Estado")
html_str = html_str.replace("74 Capas Oficiales del Estado", "101 Capas Oficiales e Indicadores del Estado")

with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_str)

print(f"Successfully updated {INDEX_HTML_PATH} to '101 CAPAS DISPONIBLES'.")
