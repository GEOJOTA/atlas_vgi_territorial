import json
import os
import re

PROJECT_DIR = r"D:\17082025\2026\Practica profesional\atlas_vgi_uah"
JSON_PATH = os.path.join(PROJECT_DIR, "scratch", "capas_74_dict.json")
IDE_JS_PATH = os.path.join(PROJECT_DIR, "src", "js", "modulos", "ide_chile.js")
INDEX_HTML_PATH = os.path.join(PROJECT_DIR, "src", "index.html")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    capas_74 = json.load(f)

print(f"Loaded {len(capas_74)} layers from JSON.")

# 1. Update src/js/modulos/ide_chile.js
with open(IDE_JS_PATH, "r", encoding="utf-8") as f:
    js_content = f.read()

# Build JavaScript object string for CAPAS_OFICIALES
capas_js_str = "  const CAPAS_OFICIALES = {\n"
for key_id, item in capas_74.items():
    capas_js_str += f"    '{key_id}': {{\n"
    capas_js_str += f"      id: '{item['id']}',\n"
    capas_js_str += f"      num_bbdd: {item['num_bbdd']},\n"
    capas_js_str += f"      nombre: {json.dumps(item['nombre'], ensure_ascii=False)},\n"
    capas_js_str += f"      institucion: {json.dumps(item['institucion'], ensure_ascii=False)},\n"
    capas_js_str += f"      ministerio: {json.dumps(item['ministerio'], ensure_ascii=False)},\n"
    capas_js_str += f"      tipoServicio: {json.dumps(item['tipoServicio'], ensure_ascii=False)},\n"
    capas_js_str += f"      urlServicio: {json.dumps(item['urlServicio'], ensure_ascii=False)},\n"
    capas_js_str += f"      archivoLocal: {json.dumps(item['archivoLocal'], ensure_ascii=False)},\n"
    capas_js_str += f"      color: '{item['color']}',\n"
    capas_js_str += f"      icono: '{item['icono']}',\n"
    capas_js_str += f"      geometria: '{item['geometria']}',\n"
    capas_js_str += f"      grupo: '{item['grupo']}',\n"
    capas_js_str += f"      joinInfo: {json.dumps(item['joinInfo'], ensure_ascii=False)},\n"
    capas_js_str += f"      descripcion: {json.dumps(item['descripcion'], ensure_ascii=False)},\n"
    capas_js_str += f"      declaracion: {json.dumps(item['declaracion'], ensure_ascii=False)},\n"
    capas_js_str += f"      citaAPA: {json.dumps(item['citaAPA'], ensure_ascii=False)}\n"
    capas_js_str += "    },\n"

capas_js_str += "  };\n"

# Replace CAPAS_OFICIALES in ide_chile.js
pattern = r"const CAPAS_OFICIALES = \{.*?\n  \};"
js_updated = re.sub(pattern, capas_js_str.strip(), js_content, flags=re.DOTALL)

# Also ensure popup default extra info handles auto-extraction of fundamental columns:
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
          extraInfo['Atributo 1'] = props.NOMBRE || props.nombre || props.ID || props.id || 'Entidad Oficial';
          extraInfo['Fuente'] = def.institucion;
        }
      }
"""

if "if (Object.keys(extraInfo).length === 0)" not in js_updated:
    js_updated = js_updated.replace(
        "props._extraInfo = extraInfo;",
        popup_fallback_code + "\n      props._extraInfo = extraInfo;"
    )

with open(IDE_JS_PATH, "w", encoding="utf-8") as f:
    f.write(js_updated)

print(f"Updated {IDE_JS_PATH} with 74 layers.")

# 2. Update src/index.html badges
with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
    html_content = f.read()

html_updated = html_content.replace("27 CAPAS DISPONIBLES", "74 CAPAS DISPONIBLES")
html_updated = html_updated.replace("27 Capas Oficiales del Estado", "74 Capas Oficiales del Estado")

with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_updated)

print(f"Updated {INDEX_HTML_PATH} badges to '74 CAPAS DISPONIBLES'.")
