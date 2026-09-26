# Guía de Contribución y Trazabilidad Ciudadana — Atlas VGI Barrio Brasil (UAH)

¡Te damos la bienvenida al proyecto **Atlas de Información Geográfica Voluntaria (VGI) para la Gestión Territorial en el Barrio Brasil**!

Este Atlas es una iniciativa de ciencia abierta y soberanía de datos del **Departamento de Geografía de la Universidad Alberto Hurtado (UAH)**. Nuestro propósito es democratizar el acceso a la información territorial, articulando la cartografía oficial del Estado de Chile (112 capas) con el conocimiento vivo de las comunidades, organizaciones territoriales y vecinos (10 categorías maestras VGI, conformando 122 capas en total).

---

## 🎯 ¿Quién puede contribuir?

Cualquier persona puede contribuir, sin importar su nivel de conocimientos técnicos:
- **Vecinos y dirigentas/es sociales:** Que conocen el estado real de sus veredas, plazas, ferias y servicios barriales.
- **ONGs y colectivos territoriales:** Que producen diagnósticos, catastro comunitario o demandan infraestructura pública.
- **Estudiantes e investigadoras/es:** Que recopilan datos de campo, analizan indicadores y contrastan normativas.
- **Mapeadores y analistas SIG:** Que dominan OpenStreetMap, QGIS, Python o herramientas geoespaciales.

---

## 🧭 ¿Cómo contribuir de forma simple? (Elige tu camino)

### Vía 1: Mapeo Directo en OpenStreetMap (Sin programar)
OpenStreetMap (OSM) es la base del Atlas. Cualquier dato que agregues o corrijas en OSM se verá reflejado directamente en las consultas en vivo del Atlas.

1. **Crea tu cuenta gratuita** en [OpenStreetMap.org](https://www.openstreetmap.org/).
2. **Haz clic en "Editar"** en la parte superior del mapa para abrir el editor web visual **iD** (funciona en cualquier navegador sin instalar nada).
3. **Ubica el Barrio Brasil / Entorno UAH** y agrega o corrige elementos cotidianos:
   - *Comercio local y salud:* almacenes, farmacias, veterinarias, cafés (`shop=*`, `amenity=*`).
   - *Accesibilidad y veredas:* rebajes de solera (`kerb=lowered`), rampas, cruces peatonales con semáforo (`highway=crossing`).
   - *Árboles y espacio público:* árboles de calle (`natural=tree`), bancas, juegos infantiles, luminarias.
4. **Guarda los cambios** y en el comentario del conjunto de cambios (*changeset comment*) incluye el hashtag:
   ```text
   #AtlasVGI_UAH #BarrioBrasil
   ```
   > [!TIP]
   > El uso de `#AtlasVGI_UAH` permite que el módulo de calidad y cambios del Atlas (OSMCha / ohsome) reconozca y certifique tu aporte con trazabilidad comunitaria.

---

### Vía 2: Reporte o Propuesta de Nueva Capa vía GitHub Issues
Si detectas un error en el visor, una capa desactualizada, o tu organización levantó datos y deseas que se integren al Atlas:

1. Ve a la sección de [Issues del Repositorio](https://github.com/GEOJOTA/atlas_vgi_uah/issues).
2. Haz clic en **"New Issue"** y pega esta plantilla simple:

```markdown
### 📍 Propuesta / Reporte de Datos Territoriales

- **Tipo de aporte:** [Corrección de dato existente / Propuesta de nueva capa / Reporte de falla]
- **Nombre del elemento o capa:** (Ej: "Bicicleteros públicos calle Almirante Barroso")
- **Categoría o Tema:** (Ej: CAT-04 Movilidad Activa, o Capa Oficial MINVU/MOP)
- **Ubicación o Calle:** (Ej: Brasil con Huérfanos, Santiago Centro)
- **Fuente o Verificación:** (Ej: Levantamiento en terreno 2026, enlace web, documento)
- **Organización / Colaborador:** (Ej: JJVV Barrio Brasil, ONG Espacio Colectivo, vecino/a)
- **Detalle de la observación:** (Describe brevemente el dato y por qué es relevante)
```

El equipo mantenedor del Departamento de Geografía UAH revisará la propuesta, auditará las geometrías y la integrará en el catálogo.

---

### Vía 3: Carga Directa en el Visor Interactivo (Uso Inmediato en Cabildos)
Si ya tienes un archivo espacial (.GeoJSON, .KML, .KMZ, .GPX o .CSV):
1. Abre el Atlas en [atlasvgiuah.netlify.app](https://atlasvgiuah.netlify.app/).
2. En el **Módulo 00 (Visor)**, haz clic en **"📂 Cargar Archivo Local"**.
3. Arrastra tu archivo. El visor lo superpondrá instantáneamente sobre las 112 capas oficiales y 10 VGI, permitiendo contrastar tus datos en vivo sin guardarlos en servidores externos (100% privado en tu navegador).

---

### Vía 4: Contribución Técnica de Código y Capas (Fork & Pull Request)
Para desarrolladores y geógrafos que deseen aportar al código de la plataforma o scripts de ingesta:

1. **Haz un Fork** del repositorio a tu cuenta de GitHub.
2. **Crea una rama descriptiva**:
   ```bash
   git checkout -b feat/nueva-capa-comunitaria
   ```
3. **Respeta el estándar del proyecto**:
   - Geometrías en **WGS 84 (EPSG:4326)** para ingesta GeoJSON.
   - Cálculo de áreas y métricas en **WGS 84 / UTM 19S (EPSG:32719)**.
   - Esquema normalizado de 14 atributos si se trata de capas VGI.
   - Si añades archivos GeoJSON pesados (> 10 MB), asegúrate de registrarlos bajo Git LFS y correr la verificación formal.
4. **Envía un Pull Request (PR)** explicando el cambio y la fuente de los datos.

---

## 🛡️ Trazabilidad e Integridad de los Datos

Para asegurar que cada dato incorporado sea confiable y académicamente reproducible, toda contribución debe mantener los siguientes principios de trazabilidad:

1. **Linaje y Autoría:** Todo registro debe indicar su origen (ej: *© Colaboradores de OpenStreetMap*, *IDE Chile*, *Levantamiento Comunitario JJVV Santa Ana*).
2. **Fecha de Captura:** Indicación clara del año o fecha en que se constató el fenómeno en terreno.
3. **Licencia Abierta Compatible:**
   - Datos vectoriales OSM: **ODbL 1.0** (Open Database License).
   - Observaciones biológicas: **CC-BY 4.0 / CC0** (GBIF Darwin Core).
   - Documentación y mapas derivados: **Creative Commons Atribución-CompartirIgual (CC BY-SA 4.0)**.
   - Código del visor: **GNU Affero General Public License v3 (AGPLv3)**.
4. **Revisión por Pares Territoriales:** Las nuevas capas oficiales o comunitarias pasan por una validación de coherencia topológica y metadatos (ISO 19115 / ISO 19157).

---

## ✉️ Contacto y Dudas

- **Repositorio:** [https://github.com/GEOJOTA/atlas_vgi_uah](https://github.com/GEOJOTA/atlas_vgi_uah)
- **Mantenedor:** Departamento de Geografía — Universidad Alberto Hurtado (UAH), Santiago de Chile.
- **Canal de Discusión:** [GitHub Discussions / Issues](https://github.com/GEOJOTA/atlas_vgi_uah/issues)
