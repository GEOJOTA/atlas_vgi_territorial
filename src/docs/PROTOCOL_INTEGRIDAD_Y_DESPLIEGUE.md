# Protocolo de Integridad de Datos y Despliegue — Atlas VGI (UAH)

**Proyecto Fondecyt Regular N° 1261256 · Departamento de Geografía · Universidad Alberto Hurtado (2026)**

El presente protocolo sintetiza las reglas de consistencia estructural y las rutinas de auditoría automatizada ejecutadas previo a cada publicación en producción. El desarrollo metodológico completo se encuentra documentado en [`MANUAL_ACTUALIZACION_ATLAS.md`](MANUAL_ACTUALIZACION_ATLAS.md).

---

## 1. Reglas de Integridad del Repositorio

1. **Cuadratura de Coberturas (`131 Capas Operativas` y `140 Descriptores`)**:
   - **121 capas oficiales del Estado** registradas en `src/js/modulos/ide_chile.js` (`CAPAS_OFICIALES`), en el acordeón temático de `src/index.html` y en las 5 dimensiones analíticas de `src/js/modulos/indicadores_analisis.js`.
   - **10 categorías colaborativas VGI** registradas en `src/js/config.js` (`NODO_CONFIG.categorias_osm`).
   - **140 descriptores técnicos** documentados en `src/js/modulos/diccionario.js` (`131 capas geográficas` + `9 tablas de referencia`).
2. **Paridad Espejo entre Raíz y Directorio de Publicación (`src/`)**:
   - Todo archivo `.geojson` o `.gpkg` alojado en `data/` se replica con idéntico nombre y contenido en `src/data/`.
   - Todo documento técnico en `docs/` (`MANUAL_USO.md`, `MANUAL_ACTUALIZACION_ATLAS.md`, `ARQUITECTURA.md`, `BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`, `TRAZABILIDAD_ACADEMICA.md`) se mantiene sincronizado en `src/docs/`.
3. **Normalización Geodésica Web (`EPSG:4326`)**:
   - Todas las coberturas `.geojson` servidas al visor se almacenan en coordenadas geográficas en grados decimales (`WGS84 / SIRGAS-Chile EPSG:4326`).

---

## 2. Ejecución de Controles Automatizados

Desde el directorio raíz del repositorio (`atlas_vgi_uah`), se ejecutan secuencialmente los tres verificadores en Python:

```bash
# 1. Auditoría de paridad de conteos (121 + 10 = 131 capas y 140 descriptores):
python scripts/verificar_conteo_capas.py

# 2. Auditoría de existencia física, sintaxis JSON y sincronización data/ <-> src/data/:
python scripts/verificar_integridad_despliegue.py

# 3. Cálculo del Índice Global de MetaCalidad (ISO 19115 / ISO 19157):
python scripts/analisis_metacalidad.py
```

---

## 3. Despliegue a Producción

Verificado el dictamen **`[OK] EXITO`** en los tres scripts de control, se procede al envío hacia la rama principal:

```bash
git add -A
git commit -m "Actualización técnica y documental del Atlas VGI"
git push origin main
```
