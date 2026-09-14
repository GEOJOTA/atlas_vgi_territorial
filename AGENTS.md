# Rules for AI Agents and Developers - Atlas VGI UAH

1. **Protocolo de Integridad de Datos**: Leer y obedecer estrictamente [PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md](PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md).
2. **0 Pérdida de Geometrías**: Conservar siempre todas las geometrías regionales/nacionales sin aplicar `spatial clip` ni recortes que limiten los datos al Barrio Brasil.
3. **Regla de Despliegue Netlify**: NUNCA agregar `included_files` con carpetas de datos GeoJSON en `netlify.toml` para no desbordar el límite de 50 MB en funciones Serverless (AWS Lambda).
4. **Catálogo de 101 Capas**: Mantener sincronizado `src/js/modulos/ide_chile.js` con las 101 capas registradas.
