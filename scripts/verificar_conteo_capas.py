import re
import json

def contar_capas():
    with open('src/js/modulos/ide_chile.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscar bloque CAPAS_OFICIALES = { ... };
    match = re.search(r'const CAPAS_OFICIALES = \{([\s\S]*?)\n  \};', content)
    if not match:
        print("No se encontró CAPAS_OFICIALES")
        return

    bloque = match.group(1)
    
    # Extraer claves de primer nivel en el objeto: id: { o 'id': {
    claves = re.findall(r'^\s{4}([\'\w]+):\s*\{', bloque, re.MULTILINE)
    print(f"Total capas en CAPAS_OFICIALES: {len(claves)}")
    print("Capas encontradas:")
    for i, c in enumerate(claves, 1):
        print(f"  {i}. {c}")

if __name__ == '__main__':
    contar_capas()
