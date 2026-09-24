# Rules for AI Agents and Developers - Atlas VGI UAH

1. **Protocolo de Integridad de Datos**: Leer y obedecer estrictamente [PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md](PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md).
2. **0 Pérdida de Geometrías**: Conservar siempre todas las geometrías regionales/nacionales sin aplicar `spatial clip` ni recortes que limiten los datos al Barrio Brasil.
3. **Regla de Despliegue Netlify**: NUNCA agregar `included_files` con carpetas de datos GeoJSON en `netlify.toml` para no desbordar el límite de 50 MB en funciones Serverless (AWS Lambda).
4. **Catálogo de 110 Capas Oficiales**: Mantener sincronizado `src/js/modulos/ide_chile.js` con las 110 capas oficiales del Estado (120 capas totales incluyendo las 10 categorías VGI) y la totalidad de los 208 GeoJSONs gestionados con Git LFS.
5. **Integridad de Descargas y Alerta de Columnas**: Garantizar que ningún archivo GeoJSON o Excel sea un puntero de texto Git LFS sin resolver (auditado en cada build por `scripts/verificar_integridad_despliegue.py`). El panel lateral de «Más detalles» debe alertar explícitamente cuando las columnas de datasets densos (>15 columnas, RSH, Censo 2024, BIP, CONAF) se resumen para rendimiento, facilitando la descarga directa del GeoJSON oficial 100% íntegro.
