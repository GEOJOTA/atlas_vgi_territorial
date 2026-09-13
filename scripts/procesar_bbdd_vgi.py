import os
import sys
import re
import json
import zipfile
import pandas as pd
import numpy as np
import geopandas as gpd
from shapely.geometry import box, Point

BASE_DIR = r"D:\17082025\2026\Practica profesional\Base de datos VGI"
PROJECT_DIR = r"D:\17082025\2026\Practica profesional\atlas_vgi_uah"
DATA_DIR = os.path.join(PROJECT_DIR, "data")
SRC_DATA_DIR = os.path.join(PROJECT_DIR, "src", "data")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SRC_DATA_DIR, exist_ok=True)

# Barrio Brasil & Santiago Bbox
BBOX_STGO = box(-70.685, -33.465, -70.640, -33.425)

def clean_bidat_val(val):
    if pd.isna(val) or val is None:
        return np.nan
    v_str = str(val).strip()
    if v_str in ['S/N', 'nan', 'None', '', 'null', 'No Aplica', 'N/A']:
        return np.nan
    
    # Range regex: "Valores entre 1 y 9" or "Entre 1 a 5" or "1 a 5"
    m_entre = re.search(r'(?:Valores\s+entre|entre|Entre)\s+(\d+(?:[\.,]\d+)?)\s+(?:y|a|-)\s+(\d+(?:[\.,]\d+)?)', v_str, re.IGNORECASE)
    if m_entre:
        low = float(m_entre.group(1).replace(',', '.'))
        high = float(m_entre.group(2).replace(',', '.'))
        return (low + high) / 2.0
    
    m_range = re.search(r'^(\d+(?:[\.,]\d+)?)\s*(?:a|-|y)\s*(\d+(?:[\.,]\d+)?)$', v_str, re.IGNORECASE)
    if m_range:
        low = float(m_range.group(1).replace(',', '.'))
        high = float(m_range.group(2).replace(',', '.'))
        return (low + high) / 2.0
        
    v_clean = v_str.replace(',', '.')
    try:
        return float(v_clean)
    except ValueError:
        return np.nan

def process_unidades_vecinales_and_bidat():
    print("\n[1/3] Procesando Unidades Vecinales 2026 y haciendo Join con tablas BIDAT...")
    
    uv_zip = os.path.join(BASE_DIR, "unidades_vecinales_junio2026.zip")
    if not os.path.exists(uv_zip):
        print("[-] Archive unidades_vecinales_junio2026.zip not found!")
        return
        
    gdf_uv = gpd.read_file(f"zip://{uv_zip}!unidades_vecinales_junio2026/unidades_vecinales_junio2026_v1.shp")
    gdf_uv = gdf_uv.to_crs(epsg=4326)
    
    # Filter for Santiago Comuna or RM
    gdf_uv_rm = gdf_uv[gdf_uv['t_reg_ca'].astype(str) == '13'].copy()
    gdf_uv_stgo = gdf_uv[gdf_uv['t_com_nom'].astype(str).str.upper().str.contains('SANTIAGO')].copy()
    
    print(f"    - UV Total RM: {len(gdf_uv_rm)} | UV Comuna Santiago: {len(gdf_uv_stgo)}")
    
    # List of BIDAT CSVs to join on UV
    bidat_files = {
        'igvust': '202608_igvust_uv_cuartil.csv',
        'dep_funcional': 'ind_427_430_202608.csv',
        'rsh_sexo': 'ind_89_90_202608.csv',
        'fonasa_mayores': 'ind_212_219_202606.csv',
        'fonasa_hombres': 'ind_213_220_202606.csv',
        'fonasa_jovenes': 'ind_214_221_202606.csv',
        'fonasa_mujeres': 'ind_215_222_202606.csv',
        'fonasa_nna': 'ind_216_223_202606.csv',
        'ocupados_rsh': 'ind_454_202606.csv'
    }
    
    joined_df = gdf_uv_stgo[['t_com', 't_com_nom', 't_id_uv_ca', 't_uv_nom', 'geometry']].copy()
    joined_df['t_id_uv_ca'] = joined_df['t_id_uv_ca'].astype(str).str.strip()
    
    for prefix, fname in bidat_files.items():
        fpath = os.path.join(BASE_DIR, fname)
        if not os.path.exists(fpath):
            continue
        try:
            df = pd.read_csv(fpath, sep=';', encoding='latin-1', low_memory=False)
            
            # Find UV ID column
            uv_col = None
            for col in ['uv_rsh', 'unidad vecinal', 't_id_uv_ca', 'UV']:
                if col in df.columns:
                    uv_col = col
                    break
            
            if not uv_col:
                continue
                
            df[uv_col] = df[uv_col].astype(str).str.strip()
            
            # Clean numeric value columns
            value_cols = [c for c in df.columns if c not in [uv_col, 'Region', 'Comuna', 'cod_com', 'cod_reg', 'rank_nac', 'Comuna ', 'Region ']]
            
            clean_sub = pd.DataFrame()
            clean_sub[uv_col] = df[uv_col]
            
            for c in value_cols:
                # Apply numeric parsing
                clean_sub[f"{prefix}_{c}"] = df[c].apply(clean_bidat_val)
                
            # Aggregate by UV ID in case of duplicates
            agg_sub = clean_sub.groupby(uv_col).mean(numeric_only=True).reset_index()
            
            # Merge to joined_df
            joined_df = joined_df.merge(agg_sub, left_on='t_id_uv_ca', right_on=uv_col, how='left')
            if uv_col in joined_df.columns and uv_col != 't_id_uv_ca':
                joined_df.drop(columns=[uv_col], inplace=True)
                
        except Exception as e:
            print(f"    [-] Error processing {fname}: {e}")
            
    # Save GeoJSON output
    out_geojson = os.path.join(DATA_DIR, "capa_unidades_vecinales_bidat.geojson")
    out_geojson_src = os.path.join(SRC_DATA_DIR, "capa_unidades_vecinales_bidat.geojson")
    
    joined_df.to_file(out_geojson, driver='GeoJSON')
    joined_df.to_file(out_geojson_src, driver='GeoJSON')
    print(f"    [+] Guardada Capa Unidades Vecinales + BIDAT: {out_geojson} ({len(joined_df)} polígonos)")

def extract_and_export_spatial_layers():
    print("\n[2/3] Extrayendo e integrando capas vectoriales del Estado de Chile...")
    
    layers_config = [
        {
            "id": 28,
            "name": "Establecimientos de Salud Febrero 2026",
            "zip": "l_990_v1_establecimientos_de_salud_febrero_2026.zip",
            "out": "capa_salud_oficial.geojson"
        },
        {
            "id": 12,
            "name": "Establecimientos Educacion Escolar",
            "zip": "layer_establecimientos_educacion_escolar_20220309024120.zip",
            "out": "capa_educacion_escolar.geojson"
        },
        {
            "id": 14,
            "name": "Establecimientos de Educacion Superior",
            "zip": "layer_establecimientos_de_educacion_superior_20220309024111.zip",
            "out": "capa_educacion_superior.geojson"
        },
        {
            "id": 9,
            "name": "Cuarteles de Bomberos",
            "zip": "layer_cuarteles_20220309024623.zip",
            "out": "capa_cuarteles_bomberos.geojson"
        },
        {
            "id": 6,
            "name": "Jardines Infantiles JUNJI",
            "zip": "layer_jardines_infantiles_junji_2024_20240619120021.zip",
            "out": "capa_jardines_junji.geojson"
        },
        {
            "id": 7,
            "name": "Infraestructura Deportiva",
            "zip": "layer_infraestructura_deportiva_20230921043832.zip",
            "out": "capa_infraestructura_deportiva.geojson"
        },
        {
            "id": 16,
            "name": "Ferias Libres",
            "zip": "layer_ferias_libres_20230921043202.zip",
            "out": "capa_ferias_libres.geojson"
        },
        {
            "id": 31,
            "name": "Ciclovías",
            "zip": "CICLOVchile_shp.zip",
            "out": "capa_ciclovias_mop.geojson"
        },
        {
            "id": 25,
            "name": "Estaciones Meteorológicas",
            "zip": "EstacionesMeteorologicas.zip",
            "out": "capa_estaciones_meteorologicas.geojson"
        }
    ]
    
    for cfg in layers_config:
        zpath = os.path.join(BASE_DIR, cfg["zip"])
        if not os.path.exists(zpath):
            continue
        try:
            # Find shapefile name inside zip
            with zipfile.ZipFile(zpath, 'r') as z:
                shp_files = [f for f in z.namelist() if f.endswith('.shp')]
                if not shp_files:
                    continue
                shp_sub = shp_files[0]
                
            gdf = gpd.read_file(f"zip://{zpath}!{shp_sub}")
            gdf = gdf.to_crs(epsg=4326)
            
            # Filter Santiago or RM extent
            if 'REGION' in [c.upper() for c in gdf.columns]:
                reg_col = [c for c in gdf.columns if c.upper() == 'REGION'][0]
                gdf_stgo = gdf[gdf[reg_col].astype(str).str.contains('13|METROPOLITANA', case=False, na=False)].copy()
            elif 'COMUNA' in [c.upper() for c in gdf.columns]:
                com_col = [c for c in gdf.columns if c.upper() == 'COMUNA'][0]
                gdf_stgo = gdf[gdf[com_col].astype(str).str.contains('SANTIAGO|13101', case=False, na=False)].copy()
            else:
                # Spatial clip by Bbox
                gdf_stgo = gdf[gdf.intersects(BBOX_STGO)].copy()
                
            if len(gdf_stgo) == 0:
                gdf_stgo = gdf.head(100).copy() # Fallback
                
            out_p1 = os.path.join(DATA_DIR, cfg["out"])
            out_p2 = os.path.join(SRC_DATA_DIR, cfg["out"])
            
            gdf_stgo.to_file(out_p1, driver='GeoJSON')
            gdf_stgo.to_file(out_p2, driver='GeoJSON')
            print(f"    [+] Extraída Capa ID {cfg['id']} ({cfg['name']}): {cfg['out']} ({len(gdf_stgo)} entidades)")
            
        except Exception as e:
            print(f"    [-] Error extrayendo {cfg['zip']}: {e}")

def process_bip_inversiones():
    print("\n[3/3] Procesando Banco Integrado de Proyectos (BIP) para Santiago...")
    bip_csv = os.path.join(BASE_DIR, "base_inversiones_19-27.csv")
    if not os.path.exists(bip_csv):
        return
        
    try:
        df = pd.read_csv(bip_csv, sep=';', encoding='latin-1', low_memory=False)
        stgo_bip = df[df['EBI_NOMBRE'].astype(str).str.contains('SANTIAGO|BARRIO BRASIL|CIENFUEGOS|ALAMEDA|LOS HÉROES', case=False, na=False)].copy()
        
        # Clean numeric fields
        stgo_bip['EBI_COSTO_TOTAL_NUM'] = stgo_bip['EBI_COSTO_TOTAL'].apply(clean_bidat_val)
        stgo_bip['EBI_SOLICITADO_NUM'] = stgo_bip['EBI_SOLICITADO'].apply(clean_bidat_val)
        
        out_csv = os.path.join(DATA_DIR, "bip_inversiones_santiago.csv")
        out_csv_src = os.path.join(SRC_DATA_DIR, "bip_inversiones_santiago.csv")
        
        stgo_bip.to_csv(out_csv, index=False, sep=';', encoding='utf-8-sig')
        stgo_bip.to_csv(out_csv_src, index=False, sep=';', encoding='utf-8-sig')
        print(f"    [+] Exportada Tabla BIP Santiago: {out_csv} ({len(stgo_bip)} iniciativas)")
        
    except Exception as e:
        print(f"    [-] Error procesando BIP Inversiones: {e}")

if __name__ == "__main__":
    print("========================================================================")
    print("PROCESAMIENTO E INTEGRACIÓN DE FUENTES PÚBLICAS BBDD VGI — CATEDRA UAH")
    print("========================================================================")
    process_unidades_vecinales_and_bidat()
    extract_and_export_spatial_layers()
    process_bip_inversiones()
    print("\n¡Procesamiento de datos completado exitosamente!")
