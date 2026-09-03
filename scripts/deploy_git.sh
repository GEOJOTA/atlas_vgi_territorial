#!/bin/bash
# ==============================================================================
# deploy_git.sh
# -------------
# Script de automatización de Git y control de versiones para Nodo GeoAbierto /
# Atlas de Información Geográfica Voluntaria (Práctica Profesional 2026).
# ==============================================================================

REPO_DIR="/Users/geojplescano/Programas/Práctica profesional 2026 S2/nodo-geoabierto"
cd "$REPO_DIR" || exit 1

echo "=========================================================================="
echo "   CONFIGURACIÓN Y SINCRONIZACIÓN GIT — NODO GEOABIERTO / ATLAS VGI"
echo "=========================================================================="

if ! command -v git &> /dev/null; then
    echo "[-] Error: Git no está instalado o no se encuentra en el PATH."
    exit 1
fi

# 1. Inicializar si no existe
if [ ! -d ".git" ]; then
    git init
    echo "[+] Repositorio Git inicializado localmente."
else
    echo "[*] Repositorio Git existente detectado."
fi

# 2. Configuración de autor de la práctica
git config user.name "GEOJOTA"
git config user.email "juanpablolescanovillegas@gmail.com"
echo "[+] Autor configurado: GEOJOTA <juanpablolescanovillegas@gmail.com>"

# 3. Validar .gitignore
if [ ! -f ".gitignore" ]; then
    cat << 'EOF' > .gitignore
.DS_Store
Thumbs.db
node_modules/
.netlify/
*.log
.env
EOF
    echo "[+] Archivo .gitignore verificado."
fi

# 4. Agregar y commitear cambios
git add .
MENSAJE_COMMIT="feat(atlas-vgi): profundizar visor Leaflet, 8 categorías OSM, Excel docs y Barrio Brasil/UAH"
git commit -m "$MENSAJE_COMMIT" 2>/dev/null || echo "[*] Sin cambios nuevos pendientes de commit."

# 5. Rama principal
git branch -M main

echo ""
echo "=========================================================================="
echo "   ESTADO LOCAL Y PRÓXIMOS PASOS PARA SUBIDA REMOTA (GITHUB)"
echo "=========================================================================="
echo "1. Para vincular un repositorio en GitHub:"
echo "   git remote add origin https://github.com/GEOJOTA/nodo-geoabierto.git"
echo ""
echo "2. Para subir a GitHub:"
echo "   git push -u origin main"
echo "=========================================================================="
