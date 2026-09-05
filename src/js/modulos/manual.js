/*
  manual.js
  ---------
  Manual de Uso del Atlas VGI, Guía Metodológica y Documentación Oficial.
  Estilo de documentación técnica / biblioteca de software, diseñado bajo
  una estética sobria, fina y estructurada ('backrooms' / libreta de campo).
  
  Incluye:
  1. Guía de Inicio Rápido (Quickstart) para usuarios no técnicos y técnicos.
  2. Guía paso a paso de los módulos 00 al 07 con ejemplos prácticos.
  3. Catálogo exhaustivo de las 8 macro-categorías (CAT-01 a CAT-08) con anclas directas.
  4. Reproyección geodésica conforme EPSG:32719 (Snyder, 1987) y cálculo de m² y ha.
  5. Evaluación de calidad según ISO 19157 y ohsome API (v1 y v2).
  6. Marco de licenciamiento abierto adaptado a Chile (CC BY-SA 4.0 / ODbL / AGPL-3.0).
  7. Gobernanza Git y flujo de contribución comunitaria por permiso.
  8. Aparato bibliográfico extendido (~64 fuentes en norma APA 7ª ed.).
*/

const ModuloManual = (() => {

  function render() {
    return `
    <div class="documentacion-contenedor">
      
      <!-- Barra de navegación interna de la documentación -->
      <nav class="doc-nav-superior" aria-label="Navegación del Manual">
        <div class="doc-nav-enlaces">
          <a href="#doc-quickstart" class="doc-nav-link"><span class="doc-num">01</span> Inicio Rápido</a>
          <a href="#doc-modulos" class="doc-nav-link"><span class="doc-num">02</span> Módulos 00-07</a>
          <a href="#doc-categorias" class="doc-nav-link"><span class="doc-num">03</span> 8 Macro-Categorías</a>
          <a href="#doc-geodesia" class="doc-nav-link"><span class="doc-num">04</span> Geodesia UTM 19S</a>
          <a href="#doc-calidad" class="doc-nav-link"><span class="doc-num">05</span> Calidad ISO 19157</a>
          <a href="#doc-gobernanza" class="doc-nav-link"><span class="doc-num">06</span> Licencias & Git</a>
          <a href="#doc-bibliografia" class="doc-nav-link"><span class="doc-num">07</span> Bibliografía</a>
        </div>
        <div class="doc-descarga-accesos">
          <a href="docs/categorias_tematicas_osm.xlsx" download class="doc-btn-descarga" title="Descargar Catálogo Excel Oficial">
            📊 Excel Catálogos (.xlsx)
          </a>
          <a href="docs/TRAZABILIDAD_ACADEMICA.md" download class="doc-btn-descarga" title="Descargar Memoria Académica en Markdown">
            📄 Memoria Académica (.md)
          </a>
          <a href="https://github.com/GEOJOTA/atlas_vgi_uah" target="_blank" rel="noopener" class="doc-btn-descarga" title="Ver Repositorio Oficial en GitHub">
            🐙 GitHub Repo ↗
          </a>
        </div>
      </nav>

      <!-- SECCIÓN 01: INICIO RÁPIDO -->
      <section id="doc-quickstart" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 01 / Quickstart</span>
          <h2>Visión General y Guía de Inicio Rápido</h2>
          <p class="doc-lead">
            El <strong>Atlas de Información Geográfica Voluntaria para la Gestión Territorial</strong> es una plataforma de código abierto desarrollada en el Departamento de Geografía de la Universidad Alberto Hurtado (UAH). Su propósito es articular la cartografía comunitaria y voluntaria (VGI) con los instrumentos de planificación urbana, políticas públicas y estándares oficiales del Estado de Chile.
          </p>
        </header>

        <div class="doc-grid-audiencias">
          <div class="doc-tarjeta-audiencia">
            <div class="doc-audiencia-tag">👤 Para Vecinos, Dirigentes y Ciudadanos (No Técnicos)</div>
            <h4>¿Cómo utilizar el Atlas en su barrio?</h4>
            <p>No requiere conocimientos de SIG ni programación. Siga este flujo elemental:</p>
            <ol class="doc-pasos-lista">
              <li><strong>Explore el Visor (Panel 00):</strong> Use los botones temáticos superiores o las <em>Sugerencias de 1-Clic</em> para ver farmacias, ciclovías, paraderos o plazas en Barrio Brasil.</li>
              <li><strong>Consulte el Diccionario (Panel 06):</strong> Haga clic en las 8 tarjetas temáticas para entender qué significan las etiquetas en buen chileno (ej. qué es un CESFAM o un cité).</li>
              <li><strong>Descargue Datos en Excel (Panel 07):</strong> Descargue el catálogo de equipamientos en hojas de cálculo listas para adjuntar en proyectos comunitarios o cartas a la municipalidad.</li>
            </ol>
          </div>

          <div class="doc-tarjeta-audiencia">
            <div class="doc-audiencia-tag">📐 Para Geógrafos, Analistas SIG y Estudiantes</div>
            <h4>¿Cómo explotar la infraestructura técnica?</h4>
            <p>Diseñado bajo rigurosos estándares de interoperabilidad y ciencia abierta:</p>
            <ol class="doc-pasos-lista">
              <li><strong>Consultas Avanzadas Overpass QL (Panel 01):</strong> Filtre por claves complejas, operadores lógicos y relaciones espaciales directas al servidor de OSM.</li>
              <li><strong>Auditoría Histórica ohsome (Panel 02):</strong> Evalúe la completitud y densidad cronológica bajo norma ISO 19157 con soporte dual v1 y v2.</li>
              <li><strong>Metadatos ISO 19139 XML (Panel 05):</strong> Exporte fichas compatibles con el Perfil Nacional de Metadatos de IDE Chile para importar en GeoNetwork o QGIS.</li>
            </ol>
          </div>
        </div>

        <!-- DIAGRAMA SVG 01: ARQUITECTURA DE FLUJO DE TRABAJO -->
        <div class="doc-diagrama-wrapper">
          <div class="doc-diagrama-titulo">FIGURA 1. FLUJO DE TRABAJO METODOLÓGICO Y ARQUITECTURA DEL ATLAS VGI</div>
          <div class="doc-diagrama-svg">
            <svg viewBox="0 0 840 220" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-doc" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--linea)" stroke-width="0.5" opacity="0.4"/>
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--tinta-suave)"/>
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="var(--papel-alto)" stroke="var(--linea)" stroke-width="1"/>
              <rect width="100%" height="100%" fill="url(#grid-doc)"/>

              <!-- NODO 1: FUENTES -->
              <g transform="translate(20, 35)">
                <rect width="160" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="15" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--musgo-oscuro)">01. CAPTURA & FUENTES</text>
                <line x1="15" y1="35" x2="145" y2="35" stroke="var(--linea)" stroke-width="1"/>
                <text x="15" y="58" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• OpenStreetMap (VGI)</text>
                <text x="15" y="78" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• GBIF / iNaturalist</text>
                <text x="15" y="98" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• UMap Colaborativo</text>
                <text x="15" y="118" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• IDE Chile (SNIT)</text>
                <text x="15" y="138" font-family="var(--fuente-datos)" font-size="10" fill="var(--tinta-suave)">WGS 84 (EPSG:4326)</text>
              </g>

              <line x1="180" y1="110" x2="220" y2="110" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

              <!-- NODO 2: PROCESAMIENTO & GEODESIA -->
              <g transform="translate(225, 35)">
                <rect width="180" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="15" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--agua)">02. MOTOR GEODÉSICO</text>
                <line x1="15" y1="35" x2="165" y2="35" stroke="var(--linea)" stroke-width="1"/>
                <text x="15" y="58" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Reproyección Conforme</text>
                <text x="15" y="78" font-family="var(--fuente-datos)" font-size="11" fill="var(--tinta)">  EPSG:32719 UTM 19S</text>
                <text x="15" y="98" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Gauss / Shoelace Area</text>
                <text x="15" y="118" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Superficie m² y ha</text>
                <text x="15" y="138" font-family="var(--fuente-datos)" font-size="10" fill="var(--tinta-suave)">Snyder (USGS 1395)</text>
              </g>

              <line x1="405" y1="110" x2="445" y2="110" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

              <!-- NODO 3: CALIDAD & NORMALIZACIÓN -->
              <g transform="translate(450, 35)">
                <rect width="175" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="15" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--ocre)">03. CALIDAD & AUDITORÍA</text>
                <line x1="15" y1="35" x2="160" y2="35" stroke="var(--linea)" stroke-width="1"/>
                <text x="15" y="58" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• ISO 19157 (Data Quality)</text>
                <text x="15" y="78" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• ohsome API v1 y v2</text>
                <text x="15" y="98" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Densidad obj / km²</text>
                <text x="15" y="118" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Series Temporales</text>
                <text x="15" y="138" font-family="var(--fuente-datos)" font-size="10" fill="var(--tinta-suave)">Proxy Serverless / Cache</text>
              </g>

              <line x1="625" y1="110" x2="660" y2="110" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

              <!-- NODO 4: SALIDAS INTEROPERABLES -->
              <g transform="translate(665, 35)">
                <rect width="155" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="15" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--tinta)">04. DISTRIBUCIÓN</text>
                <line x1="15" y1="35" x2="140" y2="35" stroke="var(--linea)" stroke-width="1"/>
                <text x="15" y="58" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Visor Leaflet Web</text>
                <text x="15" y="78" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• GeoJSON / CSV (QGIS)</text>
                <text x="15" y="98" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• ISO 19139 XML (IDE)</text>
                <text x="15" y="118" font-family="var(--fuente-lectura)" font-size="12" fill="var(--tinta)">• Libros Excel (.xlsx)</text>
                <text x="15" y="138" font-family="var(--fuente-datos)" font-size="10" fill="var(--musgo)">CC BY-SA 4.0 / ODbL</text>
              </g>
            </svg>
          </div>
          <div class="doc-diagrama-epigrafe">Esquema general del flujo de datos: desde la extracción colaborativa en WGS 84 hasta la reproyección métrica oficial y la entrega de productos estandarizados según normas ISO.</div>
        </div>
      </section>

      <!-- SECCIÓN 02: GUÍA DE MÓDULOS DEL SISTEMA -->
      <section id="doc-modulos" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 02 / Componentes</span>
          <h2>Guía Paso a Paso de los Módulos del Sistema (00 al 07)</h2>
          <p class="doc-lead">
            La arquitectura de la aplicación está dividida en 9 secciones funcionales especializadas. A continuación se describe la funcionalidad, entradas y salidas de cada una:
          </p>
        </header>

        <div class="doc-modulos-grid">
          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">00</div>
            <div class="doc-modulo-cuerpo">
              <h4>Visor y Atlas Cartográfico VGI</h4>
              <p>Visualizador interactivo basado en Leaflet con capas temáticas vectoriales superpuestas a cartografía base (OpenStreetMap, CartoDB Positron, ortofoto aérea). Permite la inspección directa de geometrías, cálculo de distancias y superficies en tiempo real sobre el polígono piloto de Barrio Brasil y la manzana universitaria UAH.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Renderizado de capas GeoJSON, popups con ficha de atributos normalizados, botón de descarga directa de la capa activa.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">01</div>
            <div class="doc-modulo-cuerpo">
              <h4>Consultas y Explorador Overpass QL</h4>
              <p>Interfaz bidireccional que conecta directamente con la API Overpass. Incluye un <em>Constructor Guiado</em> con menús desplegables para principiantes y un <em>Editor Overpass QL libre</em> con resaltado de sintaxis para analistas avanzados. Permite filtrar por tipo geométrico (nodos, vías, relaciones) y atributos como nombre, accesibilidad para silla de ruedas u operador institucional.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> GeoJSON procesado en vivo, tabla de atributos exportable a CSV y representación gráfica en el mapa.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">02</div>
            <div class="doc-modulo-cuerpo">
              <h4>Auditoría de Calidad Espacial (ohsome API v1 & v2)</h4>
              <p>Módulo de evaluación cuantitativa según el estándar internacional ISO 19157 (Data Quality). Ejecuta consultas analíticas históricas contra el clúster de HeiGIT (Universidad de Heidelberg), calculando recuento total de entidades, densidad espacial por kilómetro cuadrado, masa crítica de colaboradores únicos y evolución temporal (2018 a la fecha).</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Gráficos cronológicos de evolución, tarjetas de densidad por km² y tasa de completitud temática.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">03</div>
            <div class="doc-modulo-cuerpo">
              <h4>Biodiversidad Urbana (GBIF Occurrence API)</h4>
              <p>Cosecha en tiempo real registros de ciencia ciudadana biológica (iNaturalist, eBird) dentro del área urbana central. Aplica el estándar Darwin Core (TDWG) para catalogar especies de flora, avifauna urbana (tencas, zorzales, chercanes) e insectos polinizadores asociados al arbolado de plazas y calles.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Capa de puntos con taxonomía biológica verificada y fotografías comunitarias de las especies.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">04</div>
            <div class="doc-modulo-cuerpo">
              <h4>Cartografía Colaborativa UMap</h4>
              <p>Integración de mapas comunitarios elaborados por colectivos territoriales, asambleas barriales y estudiantes en la plataforma abierta UMap de OpenStreetMap Francia. Demuestra la apropiación social del mapa y la geografía comunitaria.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Visor embebido en iframe de alta definición con enlaces al proyecto cartográfico matriz.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">05</div>
            <div class="doc-modulo-cuerpo">
              <h4>Generador de Metadatos ISO 19115 / ISO 19139 (IDE Chile)</h4>
              <p>Motor de autocarga reactiva de metadatos espaciales. Estandariza el título, resumen, categoría temática (MD_TopicCategoryCode), sistema geodésico, linaje de procesamiento y extensión geográfica con la superficie territorial calculada bajo EPSG:32719 UTM 19S.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Ficha visual formateada, descarga de metadatos en JSON (ISO 19115) y archivo XML (ISO 19139) listo para interoperar con catálogos oficiales GeoNetwork y GeoNode.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">06</div>
            <div class="doc-modulo-cuerpo">
              <h4>Diccionario Territorial y Atributos Normalizados</h4>
              <p>Glosario ontológico interactivo que traduce las claves y valores en inglés de OpenStreetMap a conceptos formales de la gestión territorial chilena, vinculándolos con las contrapartes estatales y el Catálogo de Objetos Geográficos de Chile v3.0 (IDE Chile / SNIT).</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> 8 tarjetas interactivas de macro-categorías con filtrado en vivo y enlaces al manual, tabla de 63 etiquetas territoriales y 14 atributos normalizados.</div>
            </div>
          </div>

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">07</div>
            <div class="doc-modulo-cuerpo">
              <h4>Catálogos Oficiales en Excel (.xlsx) y Licencias</h4>
              <p>Centro de descarga institucional de las tres hojas de cálculo OpenXML (.xlsx) elaboradas para la defensa de la práctica profesional de Geografía, junto con la especificación del marco jurídico abierto (CC BY-SA 4.0, ODbL 1.0 y GNU AGPL-3.0).</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Descargas directas de <code>catalogo_fuentes_vgi.xlsx</code>, <code>perfil_metadatos_vgi.xlsx</code> y <code>categorias_tematicas_osm.xlsx</code>.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 03: CATÁLOGO EXHAUSTIVO DE LAS 8 MACRO-CATEGORÍAS -->
      <section id="doc-categorias" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 03 / Taxonomía Territorial</span>
          <h2>Guía Exhaustiva de las 8 Macro-Categorías (CAT-01 a CAT-08)</h2>
          <p class="doc-lead">
            A continuación se presenta el desglose técnico y social de las 8 macro-categorías territoriales. Cada ficha incluye su propósito barrial, estándar legal vinculado, contrapartes públicas en Chile, consulta Overpass QL reproducible y casos de estudio en Barrio Brasil y el Campus UAH:
          </p>
        </header>

        <div class="doc-fichas-categorias">

          <!-- CAT-01: MOVILIDAD -->
          <article id="manual-cat-01" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-01</div>
              <div class="doc-ficha-titular">
                <h3>Movilidad y Transporte Urbano</h3>
                <span class="doc-ficha-sub">Transporte público integrado, paraderos Red Movilidad, Metro de Santiago y conectividad peatonal</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Barrio Brasil es una zona de alta fricción espacial y convergencia metropolitana, articulada por los ejes estructurantes de Alameda Libertador Bernardo O'Higgins, Avenida Brasil, Manuel Rodríguez y Matucana. Esta categoría permite monitorear la distribución espacial de los puntos de acceso al sistema de transporte público, tiempos de caminata, frecuencias y cobertura de refugios peatonales.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MTT / Directorio de Transporte Público Metropolitano (DTPM) / Metro de Santiago S.A.</div>
                <div><strong>Norma / Estándar:</strong> Manual de Normas Técnicas para Paraderos Red Movilidad (DTPM, 2023).</div>
                <div><strong>Equivalente IDE Chile:</strong> Capa Nacional de Transporte e Infraestructura Vial (SNIT).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Estación intermodal Los Héroes (Líneas 1 y 2), Estación Santa Ana (Líneas 2 y 5), paradas troncales Red en Alameda y Av. Brasil.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-01)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  node["highway"="bus_stop"]({{bbox}});
  node["railway"="station"]["station"="subway"]({{bbox}});
  node["railway"="subway_entrance"]({{bbox}});
  way["highway"~"primary|secondary|tertiary"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-02: EQUIPAMIENTO COMUNITARIO -->
          <article id="manual-cat-02" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-02</div>
              <div class="doc-ficha-titular">
                <h3>Equipamiento Comunitario y Social</h3>
                <span class="doc-ficha-sub">Educación superior, colegios, jardines infantiles, sedes vecinales y servicios cívicos</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Agrupa la infraestructura esencial para la reproducción social y la vida de barrio. En el sector sur del polígono destaca el polo universitario de la Universidad Alberto Hurtado (UAH), que convive con establecimientos educacionales tradicionales (Liceo de Aplicación, colegios de educación básica) y organizaciones comunitarias de base.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Ministerio de Educación (MINEDUC) / JUNJI / Ministerio de Desarrollo Social y Familia.</div>
                <div><strong>Norma / Estándar:</strong> Directorio Oficial de Establecimientos (MINEDUC, 2023); Estándares de Infraestructura Parvularia (JUNJI, 2022).</div>
                <div><strong>Equivalente IDE Chile:</strong> Catastro de Equipamiento Social y Comunitario (IDE Chile / INE).</div>
                <div><strong>Casos en Barrio Brasil / UAH:</strong> Casa Central UAH (Almirante Barroso 10), Facultad de Ciencias Sociales (Cienfuegos 46), Salas Cuna JUNJI, Junta de Vecinos Barrio Brasil.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-02)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["amenity"~"university|college|school|kindergarten"]({{bbox}});
  nwr["amenity"~"community_centre|social_facility"]({{bbox}});
  nwr["office"="government"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-03: SALUD -->
          <article id="manual-cat-03" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-03</div>
              <div class="doc-ficha-titular">
                <h3>Salud y Bienestar</h3>
                <span class="doc-ficha-sub">Atención Primaria de Salud (APS), CESFAM, farmacias de turno, postas y equipamiento DEA</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> La infraestructura sanitaria de proximidad garantiza el derecho a la salud comunitaria. En Chile, la red asistencial primaria municipal se estructura mediante Centros de Salud Familiar (CESFAM) y Servicios de Atención Primaria de Urgencia (SAPU), complementados por farmacias barriales y dispositivos de desfibrilación externa automática (DEA).</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Ministerio de Salud (MINSAL) / DEIS / Servicio de Salud Metropolitano Central.</div>
                <div><strong>Norma / Estándar:</strong> Clasificación de la Red Asistencial (MINSAL, 2023); Ley N° 21.156 de Desfibriladores Externos Automáticos (2019).</div>
                <div><strong>Equivalente IDE Chile:</strong> Infraestructura Sanitaria de la Red Pública y Privada (IDE Chile / DEIS).</div>
                <div><strong>Casos en Barrio Brasil:</strong> CESFAM N° 5 (Santiago Centro), farmacias de turno en Av. Brasil y Alameda, clínicas veterinarias comunitarias.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-03)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["amenity"~"clinic|pharmacy|hospital|doctors|dentist"]({{bbox}});
  node["emergency"="defibrillator"]({{bbox}});
  node["amenity"="veterinary"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-04: COMERCIO -->
          <article id="manual-cat-04" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-04</div>
              <div class="doc-ficha-titular">
                <h3>Comercio y Economía Barrial</h3>
                <span class="doc-ficha-sub">Almacenes de barrio, panaderías, ferias libres tradicionales, librerías y oficios</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> El comercio minorista tradicional y los servicios de pequeña escala sostienen la vitalidad económica y la seguridad ciudadana por medio de los 'ojos en la calle' (Jacobs, 1961). En Barrio Brasil destaca la presencia de amasanderías tradicionales, botillerías históricas, librerías universitarias y las ferias libres periódicas que abastecen a la población de frutas y verduras frescas.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Instituto Nacional de Estadísticas (INE) / SERCOTEC / Municipalidad de Santiago.</div>
                <div><strong>Norma / Estándar:</strong> Catastro de Ferias Libres (ASOF, 2021); Directorio Nacional de Empresas Minoristas (INE, 2021).</div>
                <div><strong>Equivalente IDE Chile:</strong> Directorio Comercial e Industrial (SII / INE / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Panaderías y pastelerías en Huérfanos y Brasil, ferias libres de fin de semana, cafés culturales y almacenes de abarrotes.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-04)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["shop"~"convenience|bakery|supermarket|greengrocer|books"]({{bbox}});
  nwr["amenity"~"marketplace|cafe|restaurant"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-05: SEGURIDAD -->
          <article id="manual-cat-05" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-05</div>
              <div class="doc-ficha-titular">
                <h3>Seguridad y Emergencias</h3>
                <span class="doc-ficha-sub">Compañías de bomberos, comisarías de carabineros, red de grifos contra incendios y gestión de riesgos</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> La morfología patrimonial de Barrio Brasil (casonas de adobe, madera y tabiquería del siglo XIX y principios del XX) presenta una alta vulnerabilidad ante siniestros de incendio. El catastro geoespacial de la red de grifos operativos, cuarteles de bomberos y unidades de vigilancia preventiva es un insumo crítico para la gestión del riesgo de desastres a escala de manzana.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> SENAPRED / Carabineros de Chile / Junta Nacional de Bomberos de Chile.</div>
                <div><strong>Norma / Estándar:</strong> Ley N° 20.564 Marco de Bomberos de Chile (2022); Plan Estratégico GRD (SENAPRED, 2023).</div>
                <div><strong>Equivalente IDE Chile:</strong> Infraestructura para la Gestión del Riesgo y Emergencias (IDE Chile / SENAPRED).</div>
                <div><strong>Casos en Barrio Brasil:</strong> 11ª y 12ª Compañías del Cuerpo de Bomberos de Santiago, 3ª Comisaría de Santiago Central, red de grifos urbanos de Aguas Andinas.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-05)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["amenity"~"fire_station|police"]({{bbox}});
  node["emergency"="fire_hydrant"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-06: ESPACIO PÚBLICO -->
          <article id="manual-cat-06" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-06</div>
              <div class="doc-ficha-titular">
                <h3>Espacio Público, Deporte y Recreación</h3>
                <span class="doc-ficha-sub">Plazas barriales, parques urbanos, multicanchas públicas, mobiliario y bebederos</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> La dotación de espacio público por habitante es uno de los principales indicadores de equidad y justicia espacial. La Plaza Brasil constituye el epicentro del encuentro comunitario, juegos infantiles, actividades culturales y esparcimiento al aire libre, articulándose con plazas de bolsillo y multicanchas deportivas.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Ministerio de Vivienda y Urbanismo (MINVU) / Instituto Nacional de Deportes (IND).</div>
                <div><strong>Norma / Estándar:</strong> Política Nacional de Parques Urbanos (MINVU, 2021); Catastro Nacional de Recintos Deportivos (IND, 2021).</div>
                <div><strong>Equivalente IDE Chile:</strong> Áreas Verdes Públicas y Recintos Deportivos (MINVU / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Plaza Brasil (polígono principal con juegos escultóricos de Federici), multicanchas barriales en pasajes, bebederos públicos.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-06)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["leisure"~"park|pitch|playground|sports_centre"]({{bbox}});
  node["amenity"="drinking_water"]({{bbox}});
  node["leisure"="fitness_station"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-07: PATRIMONIO -->
          <article id="manual-cat-07" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-07</div>
              <div class="doc-ficha-titular">
                <h3>Patrimonio Urbano y Cultura</h3>
                <span class="doc-ficha-sub">Zonas típicas, monumentos históricos, Inmuebles de Conservación Histórica (ICH) y cités residenciales</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Barrio Brasil posee una invaluable riqueza arquitectónica de finales del siglo XIX e inicios del XX. Alberga la Zona Típica declarada por el Consejo de Monumentos Nacionales, decenas de Inmuebles de Conservación Histórica (ICH) catalogados en el Plan Regulador Comunal de Santiago y una densa red de cités obreros y pasajes residenciales tradicionales (Hidalgo, 2005).</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Consejo de Monumentos Nacionales (CMN) / SERPAT / Dirección de Obras de la I. Municipalidad de Santiago.</div>
                <div><strong>Norma / Estándar:</strong> Ley N° 17.288 de Monumentos Nacionales (2020); Catálogo Patrimonial del Plan Regulador Comunal de Santiago (2019).</div>
                <div><strong>Equivalente IDE Chile:</strong> Capa Nacional de Patrimonio y Monumentos Históricos (CMN / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Cités de calles Huérfanos, Compañía y Cienfuegos; Basílica del Salvador; Palacio Rivas; Centros culturales comunitarios.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-07)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["historic"]({{bbox}});
  nwr["heritage"]({{bbox}});
  nwr["tourism"~"museum|artwork|gallery"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-08: MEDIO AMBIENTE Y ACCESIBILIDAD -->
          <article id="manual-cat-08" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-08</div>
              <div class="doc-ficha-titular">
                <h3>Medio Ambiente Urbano y Accesibilidad Universal</h3>
                <span class="doc-ficha-sub">Accesibilidad física D.S. 50 MINVU, rebajes de acera, baldosas podotáctiles y arbolado viario</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Integra la dimensión ambiental y la justicia espacial inclusiva. Permite evaluar si las aceras y cruces cumplen con la 'ruta accesible' continua establecida por el Decreto Supremo N° 50 del MINVU (OGUC Art. 2.2.8) para personas con discapacidad o movilidad reducida, cruzando esta información con el arbolado de sombra y mitigación de islas de calor urbano (CONAF, 2019; MMA, 2022).</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> SENADIS / MINVU / Ministerio del Medio Ambiente (MMA) / CONAF.</div>
                <div><strong>Norma / Estándar:</strong> D.S. N° 50 OGUC Accesibilidad Universal (MINVU, 2016); ISO 21542:2021 (Building construction — Accessibility).</div>
                <div><strong>Equivalente IDE Chile:</strong> Catastro de Cruces y Accesibilidad Urbana / Infraestructura Verde Urbana (IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Rebajes de solera en esquinas de Av. Brasil con Huérfanos, veredas accesibles en campus UAH, alineaciones de Plátanos Orientales y Jacarandás.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-08)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  node["kerb"]({{bbox}});
  node["highway"="crossing"]["wheelchair"]({{bbox}});
  node["natural"="tree"]({{bbox}});
  way["cycleway"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

        </div>
      </section>

      <!-- SECCIÓN 04: GEODESIA CONFORME EPSG:32719 -->
      <section id="doc-geodesia" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 04 / Geodesia y Métricas</span>
          <h2>Reproyección Conforme EPSG:32719 y Cálculo de Superficies Métricas</h2>
          <p class="doc-lead">
            Uno de los errores más extendidos en la cartografía web comercial es calcular áreas multiplicando grados decimales o asumiendo la Tierra como una esfera perfecta. El Atlas implementa un motor geodésico riguroso conforme a la geodesia física oficial de Chile.
          </p>
        </header>

        <div class="doc-texto-bloque">
          <h3>1. Justificación Geodésica: La Distorsión de WGS 84 a Latitud -33.45°</h3>
          <p>
            El sistema de referencia geodésico nativo de OpenStreetMap y GPS es <strong>WGS 84 (EPSG:4326)</strong>, cuyas coordenadas se expresan en grados angulares de latitud y longitud. A la latitud de Santiago Centro (-33°27' S), un grado de longitud equivale aproximadamente a <strong>92.950 metros</strong>, mientras que un grado de latitud equivale a <strong>110.910 metros</strong>. Tratar estas coordenadas angulares como planas produce una <strong>distorsión métrica superior al 19.3%</strong> en el cálculo de áreas y longitudes.
          </p>
          <p>
            Por este motivo, para dar cumplimiento a los estándares del Instituto Geográfico Militar (IGM) y de la Infraestructura de Datos Espaciales de Chile (IDE Chile), el Atlas transforma cada coordenada al sistema oficial proyectado:
          </p>
          <div class="doc-destacado-geodesico">
            <strong>Sistema Oficial Adoptado:</strong> WGS 84 / UTM Huso 19 Sur (EPSG:32719)<br>
            <span class="doc-pequeno">Elipsoide: WGS 84 | Semieje mayor (a): 6.378.137,0 m | Aplanamiento (1/f): 298,257223563 | Meridiano Central: 69° O | Falso Este: 500.000 m | Falso Norte: 10.000.000 m</span>
          </div>

          <!-- DIAGRAMA SVG 02: REPROYECCIÓN CONFORME -->
          <div class="doc-diagrama-wrapper">
            <div class="doc-diagrama-titulo">FIGURA 2. TRANSFORMACIÓN DE COORDENADAS: ELIPSOIDE WGS 84 A PLANO CONFORME UTM 19S</div>
            <div class="doc-diagrama-svg">
              <svg viewBox="0 0 840 200" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="var(--papel-alto)" stroke="var(--linea)" stroke-width="1"/>
                
                <!-- GLOBO / ELIPSOIDE WGS 84 -->
                <g transform="translate(50, 20)">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="var(--linea)" stroke-width="1" stroke-dasharray="3,3"/>
                  <ellipse cx="80" cy="80" rx="70" ry="35" fill="none" stroke="var(--linea)" stroke-width="1"/>
                  <ellipse cx="80" cy="80" rx="35" ry="70" fill="none" stroke="var(--linea)" stroke-width="1"/>
                  <circle cx="60" cy="100" r="4" fill="var(--alerta)"/>
                  <text x="80" y="180" text-anchor="middle" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--tinta)">WGS 84 (EPSG:4326)</text>
                  <text x="80" y="194" text-anchor="middle" font-family="var(--fuente-lectura)" font-size="10" fill="var(--tinta-suave)">Coordenadas angulares [φ, λ]</text>
                  <text x="68" y="98" font-family="var(--fuente-datos)" font-size="9" fill="var(--alerta)">Santiago (-33.45°, -70.66°)</text>
                </g>

                <!-- FLECHA DE ECUACIONES SNYDER -->
                <g transform="translate(240, 60)">
                  <rect width="360" height="75" fill="var(--papel)" stroke="var(--ocre)" stroke-width="1"/>
                  <text x="180" y="22" text-anchor="middle" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--ocre)">ECUACIONES CONFORMES DE SNYDER (1987)</text>
                  <text x="180" y="42" text-anchor="middle" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">Transverse Mercator: Mapeo elipsoidal a cilindro secante transverso</text>
                  <text x="180" y="60" text-anchor="middle" font-family="var(--fuente-datos)" font-size="10" fill="var(--musgo-oscuro)">k₀ = 0.9996 | Falso Este = 500.000 m | Falso Norte = 10.000.000 m</text>
                  <line x1="-30" y1="37" x2="-5" y2="37" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>
                  <line x1="365" y1="37" x2="390" y2="37" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>
                </g>

                <!-- PLANO MÉTRICO UTM 19S -->
                <g transform="translate(650, 20)">
                  <rect x="10" y="10" width="140" height="140" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                  <line x1="10" y1="80" x2="150" y2="80" stroke="var(--linea)" stroke-width="1"/>
                  <line x1="80" y1="10" x2="80" y2="150" stroke="var(--linea)" stroke-width="1"/>
                  <polygon points="40,40 120,50 100,120 30,110" fill="rgba(63,93,78,0.2)" stroke="var(--musgo-oscuro)" stroke-width="1.5"/>
                  <circle cx="60" cy="90" r="3" fill="var(--musgo)"/>
                  <text x="80" y="180" text-anchor="middle" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--tinta)">UTM 19S (EPSG:32719)</text>
                  <text x="80" y="194" text-anchor="middle" font-family="var(--fuente-lectura)" font-size="10" fill="var(--tinta-suave)">Coordenadas métricas planas [X, Y]</text>
                  <text x="80" y="88" text-anchor="middle" font-family="var(--fuente-datos)" font-size="9" font-weight="bold" fill="var(--musgo-oscuro)">Área Gauss (m² / ha)</text>
                </g>
              </svg>
            </div>
            <div class="doc-diagrama-epigrafe">La transformación Transverse Mercator convierte grados geográficos a metros euclidianos sin distorsión angular local, permitiendo aplicar la fórmula del área de Gauss (Shoelace).</div>
          </div>

          <h3>2. Algoritmo del Área de Gauss (Shoelace) en Coordenadas Planas</h3>
          <p>
            Una vez que los vértices del polígono se encuentran en metros UTM [Xᵢ, Yᵢ], se aplica la fórmula del agrimensor de Gauss:
          </p>
          <div class="doc-formula-caja">
            <code>Área (m²) = 0.5 × | ∑ (Xᵢ × Yᵢ₊₁ − Xᵢ₊₁ × Yᵢ) |</code><br>
            <span class="doc-pequeno">Donde i varía desde 1 hasta N vértices del polígono cerrado (Xₙ₊₁ = X₁, Yₙ₊₁ = Y₁). Para obtener hectáreas se divide exactamente por 10.000 (1 ha = 10.000 m²).</span>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 05: CONTROL DE CALIDAD ISO 19157 -->
      <section id="doc-calidad" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 05 / Calidad de Datos</span>
          <h2>Evaluación Cuantitativa de Calidad Espacial (ISO 19157 & ohsome)</h2>
          <p class="doc-lead">
            Una crítica habitual a la información voluntaria es la incertidumbre sobre su fiabilidad. El Atlas responde implementando auditorías cuantitativas en tiempo real basadas en la norma técnica internacional <strong>ISO 19157:2013</strong>.
          </p>
        </header>

        <div class="doc-texto-bloque">
          <div class="doc-calidad-tabla-wrapper">
            <table class="tabla-datos" style="font-size:0.88rem;">
              <thead>
                <tr style="background:var(--papel-alto);">
                  <th>Elemento ISO 19157</th>
                  <th>Definición Técnica</th>
                  <th>Métrica Calculada en el Atlas</th>
                  <th>Motor / API Empleada</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Completitud (Completeness)</strong></td>
                  <td>Presencia o ausencia de objetos territoriales respecto a la realidad.</td>
                  <td>Recuento total de geometrías (nodes, ways, relations) dentro del Bbox piloto.</td>
                  <td>ohsome API /elements/count</td>
                </tr>
                <tr>
                  <td><strong>Exactitud Temporal (Temporal Quality)</strong></td>
                  <td>Validez temporal de los datos y tasa de actualización histórica.</td>
                  <td>Series cronológicas anuales (2018 a la fecha) mostrando evolución de mapeo.</td>
                  <td>ohsome API (time series P1Y)</td>
                </tr>
                <tr>
                  <td><strong>Densidad Espacial (Spatial Density)</strong></td>
                  <td>Concentración métrica de equipamientos por unidad de superficie.</td>
                  <td>Cantidad de entidades territoriales por kilómetro cuadrado (obj / km²).</td>
                  <td>Cálculo geodésico superficie Bbox</td>
                </tr>
                <tr>
                  <td><strong>Masa Crítica de Linaje (Lineage)</strong></td>
                  <td>Reputación colectiva basada en la diversidad de editores independientes.</td>
                  <td>Recuento de colaboradores únicos (OSM user IDs) que han editado la zona.</td>
                  <td>ohsome API /users/count</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="caja-guia-referencia" style="margin-top:16px;">
            <h4>💡 Resiliencia Arquitectónica: Soporte Dual ohsome v1 (OSHDB) y v2 (ohsomeDB)</h4>
            <p>
              El Atlas implementa una arquitectura serverless en Netlify (<code>/api/calidad</code>) y un backend local en Python (<code>backend/servidor_vgi.py</code>) con almacenamiento en caché en disco. Si la API v2 de HeiGIT no responde o requiere credenciales privadas, el sistema conmuta automáticamente y sin errores a la API v1 pública (OSHDB), garantizando disponibilidad ininterrumpida incluso durante demostraciones académicas sin conexión a internet.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 06: GOBERNANZA, LICENCIAS Y GIT POR PERMISO -->
      <section id="doc-gobernanza" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 06 / Marco Legal y Gobernanza</span>
          <h2>Marco Jurídico de Licenciamiento Abierto y Contribución Git por Permiso</h2>
          <p class="doc-lead">
            En concordancia con la legislación chilena y los principios éticos de la geografía comunitaria, el Atlas descarta expresamente licencias comerciales permisivas y adopta un marco tripartito de reciprocidad obligatoria (copyleft).
          </p>
        </header>

        <div class="doc-texto-bloque">
          <h3>1. ¿Por qué prescindir de la Licencia MIT?</h3>
          <p>
            La licencia MIT permite que terceros tomen el código y la cartografía comunitaria, los incorporen en plataformas cerradas privativas y restrinjan el acceso a la ciudadanía sin transferir ninguna mejora a la comunidad. En un proyecto de <strong>Información Geográfica Voluntaria desarrollada en una universidad pública o con vocación pública</strong>, esto vulneraría el principio de soberanía territorial de los datos abiertos.
          </p>

          <!-- DIAGRAMA SVG 03: TRIÁNGULO DE LICENCIAS -->
          <div class="doc-diagrama-wrapper">
            <div class="doc-diagrama-titulo">FIGURA 3. MARCO TRIPARTITO DE LICENCIAMIENTO ABIERTO Y RECIPROCIDAD COMUNITARIA</div>
            <div class="doc-diagrama-svg">
              <svg viewBox="0 0 840 210" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="var(--papel-alto)" stroke="var(--linea)" stroke-width="1"/>
                
                <!-- PILAR 1: CONTENIDOS CC BY-SA 4.0 -->
                <g transform="translate(30, 25)">
                  <rect width="240" height="160" fill="var(--papel)" stroke="var(--musgo)" stroke-width="1.5"/>
                  <text x="20" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--musgo-oscuro)">DOCUMENTACIÓN & MAPAS</text>
                  <line x1="20" y1="35" x2="220" y2="35" stroke="var(--linea)" stroke-width="1"/>
                  <text x="20" y="58" font-family="var(--fuente-datos)" font-size="12" font-weight="bold" fill="var(--tinta)">CC BY-SA 4.0 Internacional</text>
                  <text x="20" y="78" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Atribución obligatoria</text>
                  <text x="20" y="98" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Cláusula CompartirIgual</text>
                  <text x="20" y="118" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Ley N° 17.336 Prop. Intelectual</text>
                  <text x="20" y="138" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Ley N° 20.285 Datos Abiertos</text>
                </g>

                <!-- PILAR 2: BASES DE DATOS ODbL 1.0 -->
                <g transform="translate(300, 25)">
                  <rect width="240" height="160" fill="var(--papel)" stroke="var(--agua)" stroke-width="1.5"/>
                  <text x="20" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--agua)">BASES DE DATOS ESPACIALES</text>
                  <line x1="20" y1="35" x2="220" y2="35" stroke="var(--linea)" stroke-width="1"/>
                  <text x="20" y="58" font-family="var(--fuente-datos)" font-size="12" font-weight="bold" fill="var(--tinta)">ODbL 1.0 (Open Database License)</text>
                  <text x="20" y="78" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Estándar OpenStreetMap</text>
                  <text x="20" y="98" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Atribución: © Colaboradores OSM</text>
                  <text x="20" y="118" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Share-Alike en bases derivadas</text>
                  <text x="20" y="138" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Compatibilidad Darwin Core (GBIF)</text>
                </g>

                <!-- PILAR 3: SOFTWARE GNU AGPLv3 -->
                <g transform="translate(570, 25)">
                  <rect width="240" height="160" fill="var(--papel)" stroke="var(--ocre)" stroke-width="1.5"/>
                  <text x="20" y="25" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--ocre)">CÓDIGO & VISOR WEB</text>
                  <line x1="20" y1="35" x2="220" y2="35" stroke="var(--linea)" stroke-width="1"/>
                  <text x="20" y="58" font-family="var(--fuente-datos)" font-size="12" font-weight="bold" fill="var(--tinta)">GNU AGPLv3 (Copyleft Fuerte)</text>
                  <text x="20" y="78" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Libertad total de estudio y uso</text>
                  <text x="20" y="98" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Si se aloja en web, código público</text>
                  <text x="20" y="118" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Impide bifurcaciones privativas</text>
                  <text x="20" y="138" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Transferible a municipios y ONGs</text>
                </g>
              </svg>
            </div>
            <div class="doc-diagrama-epigrafe">La tríada de licencias garantiza que el esfuerzo voluntario y los datos de la comunidad no puedan ser cerrados comercialmente por ningún actor privado.</div>
          </div>

          <h3>2. Repositorio Oficial y Política de Contribución Git por Permiso</h3>
          <p>
            El código fuente, los catálogos y la documentación oficial residen en el repositorio público de GitHub:
          </p>
          <div class="doc-enlace-repo">
            📦 <strong>Repositorio Oficial:</strong> <a href="https://github.com/GEOJOTA/atlas_vgi_uah" target="_blank" rel="noopener">https://github.com/GEOJOTA/atlas_vgi_uah</a><br>
            <span class="doc-pequeno">Rama de producción: <code>main</code> | Despliegue continuo automático en Netlify</span>
          </div>
          <p>
            Para mantener la rigurosidad académica y la estabilidad de los catálogos Excel sincronizados, las contribuciones externas funcionan bajo el modelo de <strong>Contribución Abierta por Permiso / Revisión</strong>:
          </p>

          <!-- DIAGRAMA SVG 04: FLUJO GIT -->
          <div class="doc-diagrama-wrapper">
            <div class="doc-diagrama-titulo">FIGURA 4. FLUJO DE TRABAJO DE CONTRIBUCIÓN GIT CON REVISIÓN POR PERMISO</div>
            <div class="doc-diagrama-svg">
              <svg viewBox="0 0 840 160" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="var(--papel-alto)" stroke="var(--linea)" stroke-width="1"/>

                <g transform="translate(30, 30)">
                  <rect width="160" height="100" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                  <text x="15" y="22" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--tinta)">1. FORK & CLONE</text>
                  <text x="15" y="45" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">Copia personal en su</text>
                  <text x="15" y="60" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">cuenta de GitHub.</text>
                  <text x="15" y="82" font-family="var(--fuente-datos)" font-size="10" fill="var(--tinta-suave)">git clone &lt;su-fork&gt;</text>
                </g>

                <line x1="190" y1="80" x2="230" y2="80" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

                <g transform="translate(235, 30)">
                  <rect width="170" height="100" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                  <text x="15" y="22" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--tinta)">2. FEATURE BRANCH</text>
                  <text x="15" y="45" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">Crea rama temática:</text>
                  <text x="15" y="60" font-family="var(--fuente-datos)" font-size="10" fill="var(--musgo-oscuro)">feature/nueva-etiqueta</text>
                  <text x="15" y="82" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta-suave)">Sin alterar main directo.</text>
                </g>

                <line x1="405" y1="80" x2="445" y2="80" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

                <g transform="translate(450, 30)">
                  <rect width="170" height="100" fill="var(--papel)" stroke="var(--ocre)" stroke-width="1.5"/>
                  <text x="15" y="22" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--ocre)">3. PULL REQUEST</text>
                  <text x="15" y="45" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">Envío formal con:</text>
                  <text x="15" y="60" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Justificación temática</text>
                  <text x="15" y="82" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Cita APA de respaldo</text>
                </g>

                <line x1="620" y1="80" x2="655" y2="80" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

                <g transform="translate(660, 30)">
                  <rect width="150" height="100" fill="var(--papel)" stroke="var(--musgo)" stroke-width="1.5"/>
                  <text x="15" y="22" font-family="var(--fuente-datos)" font-size="11" font-weight="bold" fill="var(--musgo-oscuro)">4. REVISIÓN & MERGE</text>
                  <text x="15" y="45" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">Revisión técnica del</text>
                  <text x="15" y="60" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">mantenedor UAH.</text>
                  <text x="15" y="82" font-family="var(--fuente-datos)" font-size="10" fill="var(--musgo)">Merge -&gt; Netlify Deploy</text>
                </g>
              </svg>
            </div>
            <div class="doc-diagrama-epigrafe">Cualquier colaborador puede proponer mejoras o nuevas etiquetas para su comuna mediante un Pull Request que es auditado antes de pasar a producción.</div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 07: APARATO BIBLIOGRÁFICO EXTENDIDO -->
      <section id="doc-bibliografia" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 07 / Aparato Crítico</span>
          <h2>Aparato Bibliográfico y Fuentes Académicas (Norma APA 7ª ed.)</h2>
          <p class="doc-lead">
            Compendio de literatura científica seminal, normas técnicas internacionales y marcos institucionales del Estado de Chile para profundizar en la investigación de la Información Geográfica Voluntaria:
          </p>
        </header>

        <div class="doc-texto-bloque">
          <div class="doc-bib-categoria">
            <h4>1. Epistemología de la VGI, Filosofía de los SIG y Ciencia Ciudadana</h4>
            <ul class="doc-bib-lista">
              <li><strong>Goodchild, M. F. (2007).</strong> Citizens as sensors: the world of volunteered geography. <em>GeoJournal</em>, 69(4), 211–221. <a href="https://doi.org/10.1007/s10708-007-9111-y" target="_blank" rel="noopener">https://doi.org/10.1007/s10708-007-9111-y</a></li>
              <li><strong>Haklay, M. (2013).</strong> Citizen Science and Volunteered Geographic Information: Overview and typology of participation. In D. Sui, S. Elwood, & M. Goodchild (Eds.), <em>Crowdsourcing Geographic Knowledge</em> (pp. 105–122). Springer. <a href="https://doi.org/10.1007/978-94-007-4587-2_7" target="_blank" rel="noopener">https://doi.org/10.1007/978-94-007-4587-2_7</a></li>
              <li><strong>Schuurman, N. (2000).</strong> Trouble in the Heartland: GIS and its critics in the 1990s. <em>Progress in Human Geography</em>, 24(4), 569–590. <a href="https://doi.org/10.1191/030913200100189111" target="_blank" rel="noopener">https://doi.org/10.1191/030913200100189111</a></li>
              <li><strong>See, L., Mooney, P., Foody, G., et al. (2016).</strong> Crowdsourcing, citizen science or Volunteered Geographic Information? The current state of crowdsourced geographic information. <em>ISPRS International Journal of Geo-Information</em>, 5(5), 55. <a href="https://doi.org/10.3390/ijgi5050055" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi5050055</a></li>
              <li><strong>See, L., et al. (2025).</strong> Recent advances in Volunteered Geographic Information (VGI) and citizen science. <em>International Journal of Digital Earth</em>, 18(1), 2480220. <a href="https://doi.org/10.1080/17538947.2025.2480220" target="_blank" rel="noopener">https://doi.org/10.1080/17538947.2025.2480220</a></li>
              <li><strong>Burghardt, D., Demidova, E., & Keim, D. A. (Eds.). (2024).</strong> <em>Volunteered Geographic Information: Interpretation, visualization and social context</em>. Springer Nature. <a href="https://doi.org/10.1007/978-3-031-35374-1" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-031-35374-1</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>2. Evaluación de Calidad Espacial, Confianza y Métricas ISO 19157</h4>
            <ul class="doc-bib-lista">
              <li><strong>Antoniou, V., & Skopeliti, A. (2015).</strong> Measures and indicators of VGI quality: An overview. <em>ISPRS Annals of Photogrammetry, Remote Sensing and Spatial Information Sciences</em>, II-3/W5, 345–351. <a href="https://doi.org/10.5194/isprsannals-II-3-W5-345-2015" target="_blank" rel="noopener">https://doi.org/10.5194/isprsannals-II-3-W5-345-2015</a></li>
              <li><strong>Goodchild, M. F., & Li, L. (2012).</strong> Assuring the quality of volunteered geographic information. <em>Spatial Statistics</em>, 1, 110–120. <a href="https://doi.org/10.1016/j.spasta.2012.03.002" target="_blank" rel="noopener">https://doi.org/10.1016/j.spasta.2012.03.002</a></li>
              <li><strong>Haklay, M. (2010).</strong> How good is volunteered geographical information? A case study of OpenStreetMap in the UK. <em>Environment and Planning B: Planning and Design</em>, 37(4), 682–703. <a href="https://doi.org/10.1068/b35097" target="_blank" rel="noopener">https://doi.org/10.1068/b35097</a></li>
              <li><strong>ISO/TC 211. (2013).</strong> <em>ISO 19157:2013: Geographic information — Data quality</em>. International Organization for Standardization. <a href="https://www.iso.org/standard/32575.html" target="_blank" rel="noopener">https://www.iso.org/standard/32575.html</a></li>
              <li><strong>Pastor, J. (2015).</strong> La confianza de la Información Geográfica Voluntaria (VGI). <em>Revista Cartográfica</em>, 91, 33–49. <a href="https://doi.org/10.35424/rcarto.i91.352" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i91.352</a></li>
              <li><strong>Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019).</strong> OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data. <em>EPJ Data Science</em>, 8(1), 1–18. <a href="https://doi.org/10.1140/epjds/s13688-019-0208-0" target="_blank" rel="noopener">https://doi.org/10.1140/epjds/s13688-019-0208-0</a></li>
              <li><strong>Seto, T., Kanasugi, H., & Nishimura, Y. (2020).</strong> Quality verification of Volunteered Geographic Information using OSM Notes data in a global context. <em>ISPRS International Journal of Geo-Information</em>, 9(6), 372. <a href="https://doi.org/10.3390/ijgi9060372" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi9060372</a></li>
              <li><strong>Skopeliti, A., & Antoniou, V. (2017).</strong> Visualization and communication of VGI quality. In <em>Mapping and the Citizen Sensor</em> (pp. 193–219). Ubiquity Press. <a href="https://doi.org/10.5334/bbf.i" target="_blank" rel="noopener">https://doi.org/10.5334/bbf.i</a></li>
              <li><strong>Soriano, C. (2016).</strong> La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad? <em>Revista Cartográfica</em>, 93, 11–28. <a href="https://doi.org/10.35424/rcarto.i93.376" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.376</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>3. Infraestructuras de Datos Espaciales (IDE), Web Semántica y Políticas Públicas de Chile</h4>
            <ul class="doc-bib-lista">
              <li><strong>Ballatore, A., Wilson, D. C., & Bertolotto, M. (2014).</strong> A survey of volunteered open geo-knowledge bases in the Semantic Web. <em>Quality Issues in the Open Knowledge Base</em>, 48–68. <a href="https://arxiv.org/abs/1401.2610" target="_blank" rel="noopener">https://arxiv.org/abs/1401.2610</a></li>
              <li><strong>IDE Chile / SNIT. (2020).</strong> <em>Catálogo de Objetos Geográficos de Chile v3.0: Estándar para la captura y clasificación de información geoespacial</em>. Ministerio de Bienes Nacionales. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>Magaña, A., & Valverde, F. (2016).</strong> Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica. <em>Revista Cartográfica</em>, 93, 29–53. <a href="https://doi.org/10.35424/rcarto.i93.377" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.377</a></li>
              <li><strong>Shahi, K. (2023).</strong> Volunteered Geographic Information (VGI) in Spatial Data Infrastructure (SDI) Continuum. <em>EAI Endorsed Transactions on Internet of Things</em>, 9(1), 1–12. <a href="https://doi.org/10.4108/eetiot.v9i1.2941" target="_blank" rel="noopener">https://doi.org/10.4108/eetiot.v9i1.2941</a></li>
              <li><strong>Snyder, J. P. (1987).</strong> <em>Map projections: a working manual</em> (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. <a href="https://doi.org/10.3133/pp1395" target="_blank" rel="noopener">https://doi.org/10.3133/pp1395</a></li>
              <li><strong>UN-GGIM. (2024).</strong> <em>Future trends in geospatial information management: The five to ten year vision (4th ed.)</em>. United Nations Committee of Experts on Global Geospatial Information Management. <a href="https://ggim.un.org/" target="_blank" rel="noopener">https://ggim.un.org/</a></li>
              <li><strong>Wilkinson, M. D., et al. (2016).</strong> The FAIR Guiding Principles for scientific data management and stewardship. <em>Scientific Data</em>, 3, 160018. <a href="https://doi.org/10.1038/sdata.2016.18" target="_blank" rel="noopener">https://doi.org/10.1038/sdata.2016.18</a></li>
            </ul>
          </div>
        </div>
      </section>

    </div>
    `;
  }

  function copiarCodigo(btn) {
    const bloque = btn.closest('.doc-codigo-bloque');
    if (!bloque) return;
    const codigo = bloque.querySelector('code');
    if (!codigo) return;
    navigator.clipboard.writeText(codigo.innerText).then(() => {
      const textoOriginal = btn.innerText;
      btn.innerText = '✓ ¡Copiado!';
      btn.style.background = 'var(--musgo)';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerText = textoOriginal;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    });
  }

  return {
    render,
    copiarCodigo
  };
})();
