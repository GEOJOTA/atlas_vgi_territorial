#!/usr/bin/env python3
"""
scripts/generar_seed_sql.py
---------------------------
Genera scripts/db/02_seed_metadata.sql a partir de las capas catalogadas en src/js/modulos/ide_chile.js
y los archivos GeoJSON locales en data/.
"""

import os
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDE_CHILE_JS = os.path.join(BASE_DIR, "src", "js", "modulos", "ide_chile.js")
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_SQL = os.path.join(BASE_DIR, "scripts", "db", "02_seed_metadata.sql")

def escape_sql(text):
    if text is None:
        return "NULL"
    val = str(text).replace("'", "''")
    return f"'{val}'"

def main():
    print("[+] Leyendo ide_chile.js...")
    with open(IDE_CHILE_JS, "r", encoding="utf-8") as f:
        content = f.read()

    # Extraer bloques de definición de capas
    # Cada capa tiene formato: 'id': { ... } o id: { ... }
    pattern = re.compile(r"(?:'([a-zA-Z0-9_]+)'|([a-zA-Z0-9_]+))\s*:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}", re.MULTILINE)
    
    # Enfoque más robusto: extraer campos por expresiones regulares dentro de ide_chile.js
    capas = []
    
    # Extraer bloques usando regex de inicio de objeto
    bloques = re.findall(r"(?:'([a-zA-Z0-9_]+)'|([a-zA-Z0-9_]+))\s*:\s*\{\s*id:\s*'([^']+)'(.*?)(?=\n\s*(?:'[a-zA-Z0-9_]+'|[a-zA-Z0-9_]+)\s*:\s*\{|\n\s*\}\s*;\s*\n|\Z)", content, re.DOTALL)
    
    print(f"[+] Bloques detectados: {len(bloques)}")
    
    sql_lines = [
        "-- ============================================================================",
        "-- Nodo GeoAbierto — Catálogo Maestro de Capas Oficiales del Estado de Chile",
        "-- Seed Data de Metadatos para public.capas_metadata",
        "-- ============================================================================",
        "",
        "INSERT INTO public.capas_metadata (",
        "    id, nombre, institucion, ministerio, categoria_macro, geometria_tipo,",
        "    color, icono, total_entidades, bbox, archivo_geojson_url, tipo_servicio,",
        "    url_servicio_origen, declaracion_legal, cita_apa",
        ") VALUES"
    ]
    
    values_list = []
    
    for b in bloques:
        capa_id = b[2]
        cuerpo = b[3]
        
        def extraer_campo(campo):
            m = re.search(rf"{campo}\s*:\s*['\"]([^'\"]*)['\"]", cuerpo)
            return m.group(1) if m else None
        
        nombre = extraer_campo("nombre") or capa_id
        institucion = extraer_campo("institucion") or "Estado de Chile"
        ministerio = extraer_campo("ministerio") or "Estado de Chile"
        grupo = extraer_campo("grupo") or "otras_fuentes"
        geometria = extraer_campo("geometria") or "Vectorial"
        color = extraer_campo("color") or "#06B6D4"
        icono = extraer_campo("icono") or "🗺️"
        tipo_servicio = extraer_campo("tipoServicio") or "GeoJSON"
        url_servicio = extraer_campo("urlServicio") or ""
        archivo_local = extraer_campo("archivoLocal") or f"data/capa_{capa_id}.geojson"
        declaracion = extraer_campo("declaracion") or "Ley N° 20.285 de Transparencia del Estado de Chile."
        cita_apa = extraer_campo("citaAPA") or f"Estado de Chile. (2026). {nombre}. IDE Chile."
        
        # Contar entidades si el archivo existe
        ruta_json = os.path.join(BASE_DIR, archivo_local)
        total_entidades = 0
        bbox_sql = "ARRAY[-70.6720, -33.4505, -70.6580, -33.4350]::DOUBLE PRECISION[]"
        
        if os.path.exists(ruta_json):
            try:
                with open(ruta_json, "r", encoding="utf-8") as jf:
                    data = json.load(jf)
                    features = data.get("features", [])
                    total_entidades = len(features)
                    if "bbox" in data and len(data["bbox"]) == 4:
                        b_coords = data["bbox"]
                        bbox_sql = f"ARRAY[{b_coords[0]}, {b_coords[1]}, {b_coords[2]}, {b_coords[3]}]::DOUBLE PRECISION[]"
            except Exception:
                pass
                
        # URL en Supabase Storage CDN
        supabase_storage_url = f"https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/atlas-geojson/{os.path.basename(archivo_local)}"
        
        row_sql = f"({escape_sql(capa_id)}, {escape_sql(nombre)}, {escape_sql(institucion)}, {escape_sql(ministerio)}, {escape_sql(grupo)}, {escape_sql(geometria)}, {escape_sql(color)}, {escape_sql(icono)}, {total_entidades}, {bbox_sql}, {escape_sql(supabase_storage_url)}, {escape_sql(tipo_servicio)}, {escape_sql(url_servicio)}, {escape_sql(declaracion)}, {escape_sql(cita_apa)})"
        values_list.append(row_sql)
        
    sql_lines.append(",\n".join(values_list))
    sql_lines.append("ON CONFLICT (id) DO UPDATE SET")
    sql_lines.append("    nombre = EXCLUDED.nombre,")
    sql_lines.append("    institucion = EXCLUDED.institucion,")
    sql_lines.append("    ministerio = EXCLUDED.ministerio,")
    sql_lines.append("    categoria_macro = EXCLUDED.categoria_macro,")
    sql_lines.append("    geometria_tipo = EXCLUDED.geometria_tipo,")
    sql_lines.append("    color = EXCLUDED.color,")
    sql_lines.append("    icono = EXCLUDED.icono,")
    sql_lines.append("    total_entidades = EXCLUDED.total_entidades,")
    sql_lines.append("    bbox = EXCLUDED.bbox,")
    sql_lines.append("    tipo_servicio = EXCLUDED.tipo_servicio,")
    sql_lines.append("    url_servicio_origen = EXCLUDED.url_servicio_origen,")
    sql_lines.append("    declaracion_legal = EXCLUDED.declaracion_legal,")
    sql_lines.append("    cita_apa = EXCLUDED.cita_apa,")
    sql_lines.append("    actualizado_el = NOW();")
    
    os.makedirs(os.path.dirname(OUTPUT_SQL), exist_ok=True)
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines) + "\n")
        
    print(f"[+] Seed SQL generado exitosamente: {OUTPUT_SQL} con {len(values_list)} capas registradas.")

if __name__ == "__main__":
    main()
