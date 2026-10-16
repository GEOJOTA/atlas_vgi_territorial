# ✅ Protocolo de Integridad de Datos y Despliegue (Atlas VGI — UAH)

Este documento resume los chequeos rápidos que realizamos antes de publicar cambios en producción para asegurar que ninguna capa, módulo o enlace falle. Si buscas la explicación completa desde cero de cómo modificar el Atlas, revisa **`MANUAL_ACTUALIZACION_ATLAS.md`**.

---

## 1. Reglas de Integridad del Repositorio

1. **Paridad de Capas (`131 Capas Operativas` y `140 Descriptores`)**:
   - **121 capas oficiales del Estado** en `src/js/modulos/ide_chile.js` (`CAPAS_OFICIALES`), en el acordeón de `src/index.html` y en las 5 dimensiones de `src/js/modulos/indicadores_analisis.js`.
   - **10 categorías colaborativas VGI** en `src/js/config.js` (`NODO_CONFIG.categorias_osm`).
   - **140 descriptores documentados** en `src/js/modulos/diccionario.js` (`131 capas` + `9 tablas de referencia`).
2. **Espejo Exacto entre Raíz y `src/`**:
   - Todo archivo `.geojson` o `.gpkg` presente en `data/` debe existir con el mismo nombre y contenido en `src/data/`.
   - Todo manual o documento en `docs/` (`MANUAL_USO.md`, `MANUAL_ACTUALIZACION_ATLAS.md`, `ARQUITECTURA.md`) debe estar sincronizado en `src/docs/`.
3. **Coordenadas Estándar Web (`EPSG:4326`)**:
   - Todos los archivos `.geojson` servidos al visor deben estar en coordenadas geográficas grados decimales (`WGS84 / SIRGAS-Chile EPSG:4326`).

---

## 2. Comandos de Verificación Automática

Desde la raíz del proyecto (`atlas_vgi_uah`), ejecuta:

```bash
# 1. Verificar que los conteos (121 + 10 = 131 capas y 140 descriptores) cuadren en todos los archivos:
python scripts/verificar_conteo_capas.py

# 2. Verificar que todos los archivos existan en data/ y src/data/ y sean JSON válidos:
python scripts/verificar_integridad_despliegue.py

# 3. Recalcular el reporte de metacalidad sobre las capas locales:
python scripts/analisis_metacalidad.py
```

---

## 3. Publicación a Producción

Una vez que los 3 scripts indiquen **`[OK] EXITO`**:

```bash
git add -A
git commit -m "Actualización del Atlas VGI"
git push origin main
```
