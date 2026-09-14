# 🛡️ PROTOCOLO DE INTEGRIDAD DE DATOS Y DESPLIEGUE - ATLAS VGI UAH

Este documento establece las directrices obligatorias de desarrollo, gestión de datos espaciales y despliegue en servidor para todos los equipos de desarrollo del **Atlas de Información Geográfica Voluntaria para la Gestión Territorial (UAH)**.

---

## 1. 📜 POLÍTICA DE INTEGRIDAD TOTAL DE DATOS (0 PÉRDIDAS)

1. **Sin Recortes Espaciales**:
   - NUNCA aplicar recortes espaciales (`spatial clip`) ni filtros por comuna que eliminen entidades geográficas fuera del Barrio Brasil o Santiago.
   - Las capas estatales (MINVU, MINEDUC, MINSAL, CONAF, MOP, Subtel, IND, Sercotec, DGA, DIFROL, etc.) deben conservar el 100% de las entidades a escala de la Región Metropolitana o del territorio nacional.

2. **Integridad de Atributos y Diccionario de Variables**:
   - En las descargas GeoJSON/CSV, se debe conservar el **100% de las columnas y campos de datos originales** sin eliminar atributos estatales.
   - En los visores emergentes (popups), se muestran de 2 a 4 atributos esenciales de lectura rápida (Nombre, Dirección, Institución, Comuna), manteniendo el resto accesible en la descarga.

3. **Catálogo Maestro de 101 Capas**:
   - El catálogo maestro se encuentra en `src/js/modulos/ide_chile.js` y contiene la totalidad de las 101 capas registradas.
   - Al agregar nuevas capas, asegurar su clasificación en uno de los grupos temáticos y ejecutar `python scratch/reconstruir_capas_completo.py` para sincronizar.

---

## 2. ⚡ REGLAS DE DESPLIEGUE Y ARQUITECTURA NETLIFY

1. **Prohibido usar `included_files` con capas pesadas en `netlify.toml`**:
   - Netlify Serverless Functions (AWS Lambda) tienen un límite estricto de **50 MB por paquete de función**.
   - NUNCA incluir `"src/data/**"` o `"data/**"` dentro de `included_files` en `netlify.toml`.
   - Las funciones Serverless (`consulta.js`, `calidad.js`) deben ser puramente ligeras (< 1 MB) sin empaquetar archivos pesados en disco.

2. **Distribución Estática por CDN**:
   - Las capas GeoJSON se alojan como archivos estáticos en `src/data/*.geojson`.
   - La CDN de Netlify sirve estos archivos estáticos directamente mediante peticiones HTTP GET sin pasar por las funciones serverless.

3. **Optimización de Archivos GeoJSON**:
   - Mantener las coordenadas redondeadas a **4 o 5 decimales** (precisión sub-métrica ~1 metro en EPSG:4326), lo que reduce el peso de los archivos GeoJSON en un 60-80% sin pérdida perceptible de calidad geométrica.
   - Evitar valores `null`, `nan` o cadenas vacías repetitivas en los atributos JSON.

---

## 3. 🛠️ GUÍA DE INTEGRACIÓN DE CAMBIOS ENTRE EQUIPOS

1. **Antes de hacer Push**:
   - Ejecutar `python scratch/reconstruir_capas_completo.py` para asegurar que las 101 capas estén sincronizadas en `ide_chile.js` e `index.html`.
   - Ejecutar `python scratch/build_deliverables_docs_and_excel.py` y `python scripts/generar_catalogos_excel.py` para mantener los entregables `.docx` y `.xlsx` al día.

2. **Resolución de Conflictos de Git**:
   - Siempre hacer `git pull --rebase origin main` antes de realizar `git push origin main`.
   - En caso de conflicto de archivos en `src/data/`, priorizar la preservación completa de la geometría y ejecutar la verificación de atributos.

---

*Nodo GeoAbierto — Escuela de Geografía, Universidad Alberto Hurtado (UAH)*
