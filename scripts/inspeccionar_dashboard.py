import re
import os

path = r'D:\17082025\2026\Practica profesional\geodatabase_completa_atlas_vgi\08_geoprocesos\dashboard_analitico_barrio_brasil.html'

if not os.path.exists(path):
    print("El archivo no existe")
    exit(1)

with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print(f"Tamano del archivo: {len(content):,} bytes ({len(content)/(1024*1024):.2f} MB)")

# 1. Scripts externos
scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', content, re.IGNORECASE)
print("\n--- SCRIPTS EXTERNOS (<script src=...>) ---")
for s in scripts:
    print(" -", s)

# 2. Hojas de estilo y fuentes (<link rel="stylesheet">)
links = re.findall(r'<link[^>]*href=["\']([^"\']+)["\']', content, re.IGNORECASE)
print("\n--- HOJAS DE ESTILO Y FUENTES (<link href=...>) ---")
for l in links:
    print(" -", l)

# 3. Imagenes (<img src=...>)
imgs = re.findall(r'<img[^>]*src=["\']([^"\']+)["\']', content, re.IGNORECASE)
print("\n--- IMAGENES (<img src=...>) ---")
for i in set(imgs):
    print(" -", i)

# 4. Llamadas a fetch o XMLHttpRequest o AJAX
fetches = re.findall(r'fetch\s*\(\s*["\']([^"\']+)["\']', content)
print("\n--- LLAMADAS FETCH() ---")
for f_call in set(fetches):
    print(" -", f_call)

# 5. Capas base de mapa (TileLayer)
tiles = re.findall(r'tileLayer\s*\(\s*["\']([^"\']+)["\']', content)
print("\n--- SERVIDORES DE TESELAS (TileLayer) ---")
for t in set(tiles):
    print(" -", t)

# 6. Variables de datos integradas inline
print("\n--- VARIABLES DE DATOS INLINE ---")
data_matches = re.findall(r'(const|var|let)\s+([a-zA-Z0-9_]+)\s*=\s*\{\s*["\']type["\']\s*:\s*["\']FeatureCollection["\']', content)
for m in data_matches:
    print(f" - Variable: {m[1]} (FeatureCollection GeoJSON embebido)")

# 7. Buscar si hay rutas locales relativas que apunten a disco
local_rel_paths = re.findall(r'["\'](\.{1,2}/[^"\']+|data/[^"\']+|img/[^"\']+|css/[^"\']+|js/[^"\']+)["\']', content)
print("\n--- RUTAS LOCALES RELATIVAS DETECTADAS ---")
for r_path in set(local_rel_paths):
    print(" -", r_path)
