# 🛡️ PROTOCOLO DE INTEGRIDAD DE DATOS Y DESPLIEGUE — ATLAS VGI UAH

Este documento establece las directrices obligatorias de desarrollo, gestión de datos espaciales y despliegue en servidor para el proyecto **Atlas de Información Geográfica Voluntaria para la Gestión Territorial en el Barrio Brasil (Universidad Alberto Hurtado, 2026)**.

---

## 1. 📜 POLÍTICA DE INTEGRIDAD TOTAL DE DATOS (0 PÉRDIDAS)

1. **Sin Recortes Espaciales**:
   - NUNCA aplicar recortes espaciales (`spatial clip`) ni filtros por comuna que eliminen entidades geográficas fuera del Barrio Brasil o Santiago Centro si la capa original posee alcance regional o nacional.
   - Las capas estatales (MINVU, MINEDUC, MINSAL, CONAF, MOP, Subtel, IND, Sercotec, DGA, DIFROL, etc.) deben conservar el 100% de sus geometrías fidedignas a escala metropolitana o nacional.

2. **Integridad de Atributos y Diccionario de Variables**:
   - En las descargas GeoJSON, CSV y consultas PostGIS se debe conservar el **100% de las columnas y campos de datos originales** sin truncar atributos estatales.
   - En los visores emergentes (popups de Leaflet) y panel lateral de "Más detalles", se presentan los atributos prioritarios para lectura rápida ciudadana (Nombre, Dirección, Institución, Comuna, Tipología, Cita APA), alertando explícitamente cuando las columnas se resumen y proveyendo botón de descarga directa de la capa completa con el 100% de sus variables originales.

3. **Catálogo Maestro de 111 Capas Oficiales (+ 10 Capas VGI = 121 Capas Totales)**:
   - El catálogo maestro oficial se encuentra implementado en `src/js/modulos/ide_chile.js`, estructurado en 6 macro-grupos temáticos con acordeones colapsables interactivos.
   - La base de datos relacional almacena la totalidad de metadatos en la tabla `public.capas_metadata` (111 registros con citas APA e inventario de atributos) y vectoriza **129.262+ entidades espaciales** en `public.capas_entidades`.

4. **Garantía Binaria Git LFS y Auditoría Pre-Despliegue**:
   - Ningún conjunto de datos en `data/`, `src/data/` o `src/docs/` puede desplegarse como puntero de texto Git LFS sin resolver (130 bytes).
   - Todo build en Netlify ejecuta de manera obligatoria el script `python3 scripts/verificar_integridad_despliegue.py`, el cual audita los 207 archivos GeoJSON y los 3 libros OpenXML (.xlsx), verificando validez de sintaxis y consistencia binaria al 100%.

---

## 2. ⚡ ARQUITECTURA HÍBRIDA DE DESPLIEGUE: NETLIFY + SUPABASE POSTGIS

1. **Restricción de Tamaño en Netlify Serverless Functions**:
   - Netlify Functions (AWS Lambda) imponen un límite estricto de **50 MB por paquete de función**.
   - Queda **estrictamente prohibido** incluir `"src/data/**"` o `"data/**"` dentro de `included_files` en `netlify.toml`.
   - Las funciones serverless (`netlify/functions/`) deben mantenerse ultraligeras (< 1 MB), operando como proxies CORS o pasarelas de consulta.

2. **Capa de Almacenamiento y Base de Datos Espacial en Supabase**:
   - **PostgreSQL 17.6 + PostGIS 3.3**: Aloja las 129.262 entidades en tablas espaciales optimizadas con índices R-Tree `GIST`, permitiendo consultas espaciales en milisegundos mediante la función RPC `fn_obtener_capa_bbox`.
   - **Storage CDN (`atlas-geojson`)**: Bucket público de alta velocidad donde se alojan los archivos GeoJSON completos para descarga directa sin penalizar el ancho de banda ni el almacenamiento de Netlify.
   - **Fallback Local Autónomo**: En caso de ausencia de red o credenciales, la plataforma conmuta de forma transparente al directorio local `data/`.

3. **Gestión Segura de Variables de Entorno y Secretos**:
   - **En Netlify**: Configurar las variables en *Site configuration -> Environment variables*:
     - `SUPABASE_URL`: `https://[TU-PROYECTO].supabase.co`
     - `SUPABASE_ANON_KEY`: Llave pública anónima de lectura (`sb_publishable_...`).
   - **En GitHub Actions**: Configurar en *Settings -> Secrets and variables -> Actions*:
     - `SUPABASE_URL` y `SUPABASE_ANON_KEY` para la ejecución del workflow de mantenimiento.

4. **Mantenimiento Anti-Suspensión Permanente (Keep-Alive)**:
   - Para evitar que la instancia gratuita de Supabase se pause tras 7 días de inactividad, el repositorio cuenta con el workflow [`.github/workflows/supabase_keepalive.yml`](.github/workflows/supabase_keepalive.yml).
   - Este cron se ejecuta automáticamente cada 3 días, realizando un ping de telemetría a costo $0 para asegurar disponibilidad ininterrumpida.

---

## 3. 🛠️ GUÍA DE INTEGRACIÓN Y VERIFICACIÓN PRE-PUSH

Antes de confirmar y subir cambios a la rama `main` en GitHub (`origin/main`), ejecutar la siguiente secuencia de validación:

```bash
# 1. Verificar consistencia y sintaxis JavaScript:
jsc -s src/js/app.js src/js/modulos/mapa.js src/js/modulos/db_client.js src/js/modulos/ide_chile.js

# 2. Regenerar los libros de catálogo Excel (.xlsx) sincronizados:
python3 scripts/generar_catalogos_excel.py

# 3. Auditar la integridad de las capas y metadatos de base de datos:
python3 scripts/subir_base_datos_supabase.py --dry-run

# 4. Verificar estado de Git y confirmación de cambios:
git status
git add MANUAL_USO.md README.md docs/ src/docs/ PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md config/ src/config/
git commit -m "docs: actualizar integralmente documentacion, catalogos y arquitectura"
git push origin main
```

---

*Nodo GeoAbierto — Escuela de Geografía, Universidad Alberto Hurtado (UAH)*  
*Investigación Fondecyt Regular & Práctica Profesional 2026*
