/*
  manual.js
  ---------
  Manual de Uso del Atlas VGI, Guía Metodológica y Documentación Oficial.
  Estilo de documentación técnica / biblioteca de software, diseñado bajo
  una estética sobria, fina y estructurada ('backrooms' / libreta de campo).
  
  Incluye:
  1. Guía de Inicio Rápido (Quickstart) para usuarios no técnicos y técnicos.
  2. Guía paso a paso de los módulos 00 al 07 con ejemplos prácticos.
  3. Catálogo exhaustivo de las 10 macro-categorías (CAT-01 a CAT-10) con anclas directas.
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
          <a href="#doc-categorias" class="doc-nav-link"><span class="doc-num">03</span> 10 Macro-Categorías</a>
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
            <div class="doc-audiencia-tag">🏛 Perfil Institucional / Autoridades (IDE Chile / Municipios / SECPLAN)</div>
            <h4>¿Cómo utilizar el Atlas en la gestión pública comunal?</h4>
            <p>Orientado a directores SECPLAN, asesores urbanos y administradores de SIG municipal:</p>
            <ol class="doc-pasos-lista">
              <li><strong>Auditar Capas Oficiales vs. Brechas VGI (Panel 06):</strong> Utilice el filtro <em>[🏛 Capas Oficiales IDE Chile]</em> para verificar los 25 equipamientos con soporte estatal y contraste con las 65 <em>[⚡ Brechas VGI]</em> comunitarias no catastradas por el Estado (rebajes de solera, baldosas táctiles, luminarias, grifos de incendio).</li>
              <li><strong>Evaluar Cobertura y Saturación OQT (Panel 02):</strong> Aplique el marco <em>ohsome Quality Analyst (HeiGIT)</em> para determinar el índice de madurez cartográfica de su cuadrante barrial.</li>
              <li><strong>Exportar Metadatos Institucionales (Panel 05):</strong> Genere archivos XML bajo la norma <strong>ISO 19139 / Perfil Nacional de Metadatos</strong> para importación directa en nodos GeoNetwork o GeoNode municipales.</li>
            </ol>
          </div>

          <div class="doc-tarjeta-audiencia">
            <div class="doc-audiencia-tag">🗫 Perfil Comunitario / Organizaciones Vecinales y Ciudadanía</div>
            <h4>¿Cómo levantar diagnósticos participativos en su barrio?</h4>
            <p>No requiere conocimientos técnicos de SIG ni programación. Flujo rápido en 3 pasos:</p>
            <ol class="doc-pasos-lista">
              <li><strong>Consultas Barriales en 1-Clic (Panel 01):</strong> Active temáticas inmediatas (farmacias comunitarias, panaderías, paraderos Red, ciclovías, áreas verdes y casonas patrimoniales).</li>
              <li><strong>Monitoreo de Proyectos Colaborativos (Panel 04):</strong> Revise iniciativas vecinales cartografiadas en UMap y agregue capas comunitarias al visor sin intermediarios.</li>
              <li><strong>Descarga de Evidencia en Excel (Panel 07):</strong> Descargue el catálogo en hojas de cálculo <code>.xlsx</code> listas para respaldar presupuestos participativos o cartas a concejales.</li>
            </ol>
          </div>

          <div class="doc-tarjeta-audiencia">
            <div class="doc-audiencia-tag">⌖ Perfil Voluntario / Mapeadores OSM y Ciencia Ciudadana</div>
            <h4>¿Cómo enriquecer y auditar la base cartográfica abierta?</h4>
            <p>Diseñado para colaboradores de OpenStreetMap, iNaturalist y comunidades de datos libres:</p>
            <ol class="doc-pasos-lista">
              <li><strong>Constructor Visual y Overpass QL (Panel 01):</strong> Formule consultas personalizadas con filtros condicionales de calidad (<code>name</code>, <code>wheelchair</code>, <code>addr:street</code>, <code>operator</code>).</li>
              <li><strong>Validación Global en Taginfo API (Paneles 01 y 06):</strong> Valide en vivo la frecuencia y claves de cualquier etiqueta antes de mapear en terreno.</li>
              <li><strong>Control de Cambios en OSMCha (Panel 02):</strong> Detecte las últimas ediciones en el Bbox territorial con enlace directo a OSMCha para validar micro-contribuciones o revertir anomalías.</li>
            </ol>
          </div>

          <div class="doc-tarjeta-audiencia">
            <div class="doc-audiencia-tag">🔬 Perfil Organizaciones No Gubernamentales (ONG) & Investigación</div>
            <h4>¿Cómo aprovechar el Atlas para la gestión territorial con fondos públicos?</h4>
            <p>Máximo rigor metodológico, trazabilidad bibliográfica y defensa académica en el marco de la Práctica Profesional de Geografía UAH (2026):</p>
            <ol class="doc-pasos-lista">
              <li><strong>Reproyección Conforme EPSG:32719 (Panel 02):</strong> Obtenga densidades espaciales por km² y superficies métricas rigurosas en metros cuadrados (m²) y hectáreas (ha) según la norma del IGM.</li>
              <li><strong>Calidad Espacial Multidimensional ISO 19157 (Panel 02):</strong> Audite completitud, exactitud posicional, linaje y masa crítica de usuarios mediante el soporte dual ohsome v1 y v2.</li>
              <li><strong>Interoperabilidad GeoJSON para QGIS (Panel 00):</strong> Exporte colecciones vectoriales con esquema normalizado de 14 atributos y 104 citas bibliográficas en norma APA 7ª ed.</li>
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

              <!-- NODO 1: CAPTURA & APIS -->
              <g transform="translate(15, 35)">
                <rect width="175" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="12" y="24" font-family="var(--fuente-datos)" font-size="10" font-weight="bold" fill="var(--musgo-oscuro)">01. CAPTURA & APIS</text>
                <line x1="12" y1="33" x2="163" y2="33" stroke="var(--linea)" stroke-width="1"/>
                <text x="12" y="54" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Overpass API (OSM)</text>
                <text x="12" y="73" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Taginfo API v4</text>
                <text x="12" y="92" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• GBIF Species & Occ.</text>
                <text x="12" y="111" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• UMap Colaborativo</text>
                <text x="12" y="130" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• IDE Chile (SNIT)</text>
                <text x="12" y="145" font-family="var(--fuente-datos)" font-size="9" fill="var(--tinta-suave)">WGS 84 (EPSG:4326)</text>
              </g>

              <line x1="190" y1="110" x2="218" y2="110" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

              <!-- NODO 2: PROCESAMIENTO & GEODESIA -->
              <g transform="translate(220, 35)">
                <rect width="185" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="12" y="24" font-family="var(--fuente-datos)" font-size="10" font-weight="bold" fill="var(--agua)">02. MOTOR GEODÉSICO</text>
                <line x1="12" y1="33" x2="173" y2="33" stroke="var(--linea)" stroke-width="1"/>
                <text x="12" y="54" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Reproyección Conforme</text>
                <text x="12" y="73" font-family="var(--fuente-datos)" font-size="10" fill="var(--tinta)">  EPSG:32719 UTM 19S</text>
                <text x="12" y="92" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Fórmulas de Snyder (1987)</text>
                <text x="12" y="111" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Superficie en m², ha, km²</text>
                <text x="12" y="130" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Densidad elem / km²</text>
                <text x="12" y="145" font-family="var(--fuente-datos)" font-size="9" fill="var(--tinta-suave)">Norma Oficial IGM Chile</text>
              </g>

              <line x1="405" y1="110" x2="433" y2="110" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

              <!-- NODO 3: CALIDAD & AUDITORÍA -->
              <g transform="translate(435, 35)">
                <rect width="190" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="12" y="24" font-family="var(--fuente-datos)" font-size="10" font-weight="bold" fill="var(--ocre)">03. CALIDAD & AUDITORÍA</text>
                <line x1="12" y1="33" x2="178" y2="33" stroke="var(--linea)" stroke-width="1"/>
                <text x="12" y="54" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• ISO 19157 (Data Quality)</text>
                <text x="12" y="73" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• ohsome API v1 y v2-rc</text>
                <text x="12" y="92" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• ohsome Quality Analyst (OQT)</text>
                <text x="12" y="111" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• OSM Changesets & OSMCha</text>
                <text x="12" y="130" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Darwin Core Quality Issues</text>
                <text x="12" y="145" font-family="var(--fuente-datos)" font-size="9" fill="var(--tinta-suave)">HeiGIT / ISO / GBIF</text>
              </g>

              <line x1="625" y1="110" x2="653" y2="110" stroke="var(--tinta-suave)" stroke-width="1.5" marker-end="url(#arrow)"/>

              <!-- NODO 4: SALIDAS INTEROPERABLES -->
              <g transform="translate(655, 35)">
                <rect width="170" height="150" fill="var(--papel)" stroke="var(--tinta)" stroke-width="1"/>
                <text x="12" y="24" font-family="var(--fuente-datos)" font-size="10" font-weight="bold" fill="var(--tinta)">04. DISTRIBUCIÓN</text>
                <line x1="12" y1="33" x2="158" y2="33" stroke="var(--linea)" stroke-width="1"/>
                <text x="12" y="54" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Visor Cartográfico Web</text>
                <text x="12" y="73" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• GeoJSON / CSV (QGIS)</text>
                <text x="12" y="92" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• ISO 19139 XML (IDE Chile)</text>
                <text x="12" y="111" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• Libros Excel (.xlsx)</text>
                <text x="12" y="130" font-family="var(--fuente-lectura)" font-size="11" fill="var(--tinta)">• 104 Citas APA 7ª ed.</text>
                <text x="12" y="145" font-family="var(--fuente-datos)" font-size="9" fill="var(--musgo)">Copyleft (CC / ODbL / GPL)</text>
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
          <h2>Guía Paso a Paso de los Módulos del Sistema (00 al 08)</h2>
          <p class="doc-lead">
            La arquitectura de la aplicación está dividida en 9 secciones funcionales especializadas. A continuación se describe la funcionalidad, entradas y salidas de cada una:
          </p>
        </header>

        <div class="doc-modulos-grid">
          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">00</div>
            <div class="doc-modulo-cuerpo">
              <h4>Visor y Atlas Cartográfico VGI Interactivo</h4>
              <p>Visualizador geoespacial interactivo de alta resolución basado en <strong>Leaflet</strong>. Permite explorar, filtrar y superponer la cartografía territorial de Barrio Brasil y el campus de la Universidad Alberto Hurtado con alta velocidad, contraste óptimo y facilidad de uso para toda clase de usuarios.</p>
              <p><strong>Integración Oficial del Estado de Chile (IDE Chile & MINVU):</strong> Conecta directamente en tiempo real con servicios <strong>ArcGIS FeatureServer</strong> y <strong>OGC WMS</strong> oficiales: microdatos de las manzanas del Censo 2024 (INE), Catastro de Patrimonio IPT (MINVU DDU), Parques Urbanos, Barrios Históricos y Sitios de Memoria CMN (datos.gob.cl / Geoportal), proyectables simultáneamente en el mapa.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Renderizado de capas GeoJSON (polígonos, líneas y puntos), popups normalizados con declaraciones institucionales de la Ley N° 20.285, citas APA 7ª ed., teselas WMS GetMap y descarga directa GeoJSON para QGIS.</div>
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
              <h4>Calidad y Validación Espacial (ohsome API & OSMCha)</h4>
              <p>Módulo de evaluación cuantitativa según el estándar internacional ISO 19157 (Data Quality) y supervisión de micro-ediciones territoriales. Combina el cálculo histórico de densidad, completitud y usuarios únicos (ohsome / HeiGIT) con el control de cambios de la API de Changesets de OpenStreetMap y reglas heurísticas de OSMCha para auditar ediciones recientes, comentarios y herramientas de mapeo en el Bbox barrial.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Gráficos cronológicos de evolución, tarjetas de densidad por km², tabla de validación de changesets con badges de estado e hipervínculos a OSMCha.org.</div>
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
              <div class="doc-modulo-meta"><strong>Salidas:</strong> 10 tarjetas interactivas de macro-categorías (CAT-01 a CAT-10) con filtrado en vivo y enlaces al manual, tabla de 63 etiquetas territoriales y 14 atributos normalizados.</div>
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

          <div class="doc-modulo-fila">
            <div class="doc-modulo-num">08</div>
            <div class="doc-modulo-cuerpo">
              <h4>Manual de Uso y Documentación Territorial</h4>
              <p>Compendio exhaustivo de documentación técnica y metodológica con 8 secciones temáticas integradas in-app, diagramas SVG interactivos de arquitectura y fórmulas geodésicas, catálogo detallado de macro-categorías (CAT-01 a CAT-10), glosario de términos VGI y 104 citas bibliográficas en formato APA 7ª edición.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Navegación hipertextual interna, buscador temático, código Overpass QL copiable y enlaces directos a bibliografía científica.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 03: CATÁLOGO EXHAUSTIVO DE LAS 10 MACRO-CATEGORÍAS -->
      <section id="doc-categorias" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Sección 03 / Taxonomía Territorial</span>
          <h2>Guía Exhaustiva de las 10 Macro-Categorías (CAT-01 a CAT-10)</h2>
          <p class="doc-lead">
            A continuación se presenta el desglose técnico y social de las 10 macro-categorías territoriales. Cada ficha incluye su propósito barrial, estándar legal vinculado, contrapartes públicas en Chile, consulta Overpass QL reproducible y casos de estudio en Barrio Brasil y el Campus UAH:
          </p>
        </header>

                <div class="doc-fichas-categorias">

          <!-- CAT-01: EDUCACIÓN Y UNIVERSIDAD -->
          <article id="manual-cat-01" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-01</div>
              <div class="doc-ficha-titular">
                <h3>Educación y Universidad</h3>
                <span class="doc-ficha-sub">Educación superior, campus universitarios, liceos tradicionales, colegios, jardines infantiles y bibliotecas</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Barrio Brasil y su entorno albergan un polo de convergencia académica y estudiantil de alcance metropolitano articulado en torno al Campus Patrimonial de la Universidad Alberto Hurtado (UAH), conviviendo armónicamente con establecimientos educacionales emblemáticos (Liceo de Aplicación), colegios de formación general, salas cuna de la red JUNJI/Integra y centros de documentación. Esta categoría modela los flujos cotidianos de la población flotante estudiantil, la accesibilidad al equipamiento docente y el dinamismo cívico generado por la vida universitaria.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MINEDUC / Subsecretaría de Educación Superior / JUNJI / Fundación Integra.</div>
                <div><strong>Norma / Estándar:</strong> Directorio Oficial de Establecimientos (MINEDUC); Estándares de Infraestructura Parvularia (JUNJI); Ley N° 21.091 sobre Educación Superior.</div>
                <div><strong>Equivalente IDE Chile:</strong> Directorio Oficial de Establecimientos Educacionales (MINEDUC / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil / UAH:</strong> Casa Central UAH (Almirante Barroso 10), Facultad de Ciencias Sociales (Cienfuegos 46), Aulas Erasmo Escala, Liceo de Aplicación (Ricardo Cumming), Jardines JUNJI.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-01)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["amenity"~"university|college|library|school|kindergarten"]({{bbox}});
  nwr["building"~"university|school|college|kindergarten|library"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-02: SERVICIOS, COMERCIO Y SALUD BARRIAL -->
          <article id="manual-cat-02" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-02</div>
              <div class="doc-ficha-titular">
                <h3>Servicios, Comercio y Salud Barrial</h3>
                <span class="doc-ficha-sub">Comercio de proximidad, almacenes, gastronomía, ferias libres, farmacias, centros de salud (APS) y servicios cívicos</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Estructura la vitalidad socioeconómica y los servicios de cuidado indispensables para la vida de barrio bajo el paradigma de la ciudad de 15 minutos. Consolida la oferta de abastecimiento cotidiano (almacenes tradicionales, panaderías, ferias libres, locales gastronómicos en torno a Plaza Brasil), la red de salud primaria y urgencia (CESFAM, postas, farmacias comunitarias) y los servicios institucionales (sucursales bancarias, notarías, correos y comisarías), asegurando cobertura y autonomía funcional para residentes y transeúntes.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MINSAL / SEREMI de Salud RM / SERCOTEC / Municipalidad de Santiago / Carabineros de Chile.</div>
                <div><strong>Norma / Estándar:</strong> Modelo de Atención Integral de Salud Familiar y Comunitaria (MINSAL); Ley de Rentas Municipales (D.L. 3.063); D.S. N° 469/1993 de Establecimientos de Salud.</div>
                <div><strong>Equivalente IDE Chile:</strong> Establecimientos de Salud DEIS (MINSAL / IDE Chile) / Catastro de Comercio Barrial (IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> CESFAM Ignacio Domeyko, Farmacia Municipal Santiago, locales comerciales y gastronómicos en Av. Brasil, feria libre de Cumming, 3ª Comisaría de Santiago.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-02)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["shop"]({{bbox}});
  nwr["amenity"~"cafe|restaurant|bar|fast_food|pub|pharmacy|clinic|doctors|dentist|bank|atm|post_office|marketplace|police|fire_station"]({{bbox}});
  nwr["building"~"retail|commercial|supermarket"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-03: MOVILIDAD Y TRANSPORTE PÚBLICO -->
          <article id="manual-cat-03" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-03</div>
              <div class="doc-ficha-titular">
                <h3>Movilidad y Transporte Público</h3>
                <span class="doc-ficha-sub">Transporte público integrado, paraderos Red Movilidad, estaciones de Metro y ejes viales troncales</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Barrio Brasil constituye una zona de alta fricción espacial y convergencia metropolitana delimitada por ejes estructurantes de primer orden (Alameda Bernardo O'Higgins, Av. Brasil, Manuel Rodríguez y Matucana). Esta categoría evalúa la distribución territorial y densidad de la infraestructura del sistema integrado de transporte, tiempos de caminata a puntos de embarque, confort en paraderos y la transferencia intermodal entre servicios troncales de buses y la red subterránea.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MTT / Directorio de Transporte Público Metropolitano (DTPM) / Metro de Santiago S.A.</div>
                <div><strong>Norma / Estándar:</strong> Manual de Normas Técnicas para Paraderos Red Movilidad (DTPM, 2023); Manual de Vialidad Urbana (REDEVU / MINVU).</div>
                <div><strong>Equivalente IDE Chile:</strong> Capa Nacional de Transporte e Infraestructura Vial (MTT / SNIT).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Estación intermodal Los Héroes (Líneas 1 y 2), Estación Santa Ana (Líneas 2 y 5), paradas troncales Red en Alameda y Av. Brasil.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-03)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  node["highway"="bus_stop"]({{bbox}});
  node["railway"~"station|subway_entrance"]({{bbox}});
  node["public_transport"~"platform|stop_position"]({{bbox}});
  way["highway"~"primary|secondary|tertiary|trunk"]({{bbox}});
  way["railway"="subway"]({{bbox}});
  nwr["amenity"="bus_station"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-04: MOVILIDAD ACTIVA Y CICLOVÍAS -->
          <article id="manual-cat-04" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-04</div>
              <div class="doc-ficha-titular">
                <h3>Movilidad Activa y Ciclovías</h3>
                <span class="doc-ficha-sub">Red de ciclovías segregadas, sendas peatonales, estacionamientos para ciclos y talleres comunitarios</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Promueve la movilidad sostenible no motorizada y la pacificación del tráfico rodado en el damero barrial. Cataloga el estado físico, perfil geométrico, tipo de segregación vial y continuidad de las vías para ciclos en calles históricas, cuantificando la dotación de estacionamientos seguros para bicicletas (bicicleteros públicos y universitarios) y la conectividad con la red central de ciclovías de la comuna de Santiago.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MTT / SECTRA / SERVIU Metropolitano / Municipalidad de Santiago.</div>
                <div><strong>Norma / Estándar:</strong> Manual de Vialidad del Ciclo (MINVU / MTT, 2015); Ley de Convivencia Vial (Ley N° 21.088); D.S. N° 102/2019 MTT.</div>
                <div><strong>Equivalente IDE Chile:</strong> Red Nacional de Ciclovías (IDE Chile / SECTRA).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Ciclovías de calles Rosas y Compañía de Jesús, bicicleteros interiores Campus UAH, estaciones de arriendo Bike Santiago.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-04)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  way["highway"="cycleway"]({{bbox}});
  way["cycleway"]({{bbox}});
  way["cycleway:left"]({{bbox}});
  way["cycleway:right"]({{bbox}});
  way["cycleway:both"]({{bbox}});
  way["highway"~"footway|path"]["bicycle"~"yes|designated"]({{bbox}});
  nwr["amenity"~"bicycle_parking|bicycle_rental"]({{bbox}});
  nwr["shop"="bicycle"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-05: ÁREAS VERDES, DEPORTE Y ESPACIO PÚBLICO -->
          <article id="manual-cat-05" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-05</div>
              <div class="doc-ficha-titular">
                <h3>Áreas Verdes, Deporte y Espacio Público</h3>
                <span class="doc-ficha-sub">Plazas públicas, plazoletas, canchas deportivas, juegos infantiles y mobiliario urbano de descanso</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Cuantifica y diagnostica la dotación superficial y calidad del espacio público recreativo abierto a la ciudadanía. Permite verificar los estándares de superficie verde por habitante (m²/hab) recomendados por el CNDU y la OMS, registrar el equipamiento lúdico y deportivo (canchas multiuso, máquinas de ejercicios) y monitorear el mobiliario de descanso y permanencia (bancas, bebederos públicos e iluminación) que fomentan la vida comunitaria barrial.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MINVU / Parque Metropolitano (PARQUEMET) / IND / Municipalidad de Santiago.</div>
                <div><strong>Norma / Estándar:</strong> Política Nacional de Parques Urbanos (MINVU, 2021); Estándares Urbanos Indicativos de Áreas Verdes (CNDU, 2018); OGUC Art. 2.2.4.</div>
                <div><strong>Equivalente IDE Chile:</strong> Catastro Nacional de Áreas Verdes Urbanas (MINVU / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Plaza Brasil (juegos de Federica Matta), Plaza Manuel Rodríguez, multicanchas barriales de Maturana, plazoletas de bolsillo.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-05)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["leisure"~"park|playground|garden|pitch|sports_centre|fitness_station"]({{bbox}});
  nwr["landuse"~"grass|village_green|recreation_ground"]({{bbox}});
  node["amenity"~"bench|drinking_water"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-06: PATRIMONIO HISTÓRICO Y CULTURA -->
          <article id="manual-cat-06" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-06</div>
              <div class="doc-ficha-titular">
                <h3>Patrimonio Histórico y Cultura</h3>
                <span class="doc-ficha-sub">Monumentos Históricos, Zonas Típicas, cités tradicionales, basílicas, museos, teatros y centros culturales</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Barrio Brasil posee una trascendental jerarquía histórica declarada formalmente como Zona Típica por el Consejo de Monumentos Nacionales (CMN). Esta categoría documenta la riqueza de la arquitectura neoclásica y modernista de fines del siglo XIX y principios del XX, las tipologías residenciales colectivas de inmenso valor sociocomunitario como los pasajes y cités, templos religiosos de protección patrimonial y los centros de difusión artística y teatral barriales.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Servicio Nacional del Patrimonio Cultural (SERPAT) / CMN / Ministerio de las Culturas, las Artes y el Patrimonio.</div>
                <div><strong>Norma / Estándar:</strong> Ley N° 17.288 de Monumentos Nacionales; Decreto Exento N° 126/2000 del Mineduc (Declaratoria Zona Típica Barrio Brasil); Convenio UNESCO 1972.</div>
                <div><strong>Equivalente IDE Chile:</strong> Capa Nacional de Patrimonio y Monumentos Históricos (CMN / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Cités de calles Huérfanos, Compañía y Cienfuegos; Basílica del Salvador; Palacio Rivas; Galería Concreta; Galpón Víctor Jara.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-06)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  nwr["historic"]({{bbox}});
  nwr["heritage"]({{bbox}});
  nwr["building"~"church|cathedral|chapel"]({{bbox}});
  nwr["amenity"~"theatre|arts_centre|place_of_worship|museum|community_centre"]({{bbox}});
  nwr["tourism"~"museum|artwork|gallery"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-07: ACCESIBILIDAD UNIVERSAL Y CAMINABILIDAD -->
          <article id="manual-cat-07" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-07</div>
              <div class="doc-ficha-titular">
                <h3>Accesibilidad Universal y Caminabilidad</h3>
                <span class="doc-ficha-sub">Ruta accesible continua, rebajes de solera (vados), pavimentos podotáctiles, rampas peatonales y cruces D.S. 50</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Eje fundamental de justicia espacial y diseño urbano inclusivo. Permite auditar en terreno el cumplimiento riguroso de la 'ruta accesible' continua estipulada por el Decreto Supremo N° 50 de MINVU (OGUC Art. 2.2.8) para personas con discapacidad visual, motriz, coches infantiles y personas mayores, registrando rebajes de acera normativos en esquinas, franjas podotáctiles de advertencia, señalética sonora en semáforos y pendientes en rampas peatonales.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Servicio Nacional de la Discapacidad (SENADIS) / MINVU / DOM Municipalidad de Santiago.</div>
                <div><strong>Norma / Estándar:</strong> D.S. N° 50 OGUC Accesibilidad Universal (MINVU, 2016); Ley N° 20.422 sobre Igualdad de Oportunidades; ISO 21542:2021.</div>
                <div><strong>Equivalente IDE Chile:</strong> Catastro de Cruces y Accesibilidad Urbana (IDE Chile / SENADIS).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Rebajes de solera en esquinas de Av. Brasil con Huérfanos, veredas accesibles en campus UAH, cruces accesibles en Alameda.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-07)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  node["kerb"]({{bbox}});
  node["highway"="crossing"]({{bbox}});
  node["tactile_paving"]({{bbox}});
  node["wheelchair"]({{bbox}});
  way["highway"~"footway|pedestrian"]({{bbox}});
  way["highway"="steps"]["ramp"~"yes|separate"]({{bbox}});
  way["ramp"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-08: BIODIVERSIDAD URBANA Y ARBOLADO -->
          <article id="manual-cat-08" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-08</div>
              <div class="doc-ficha-titular">
                <h3>Biodiversidad Urbana y Arbolado</h3>
                <span class="doc-ficha-sub">Arbolado viario de alineación, especies nativas e introducidas, jardines polinizadores y mitigación de islas de calor</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Caracteriza la infraestructura ecológica y la masa vegetal urbana que provee servicios ecosistémicos críticos en el centro histórico, tales como la mitigación de las islas de calor urbano (ICU), la captura de material particulado y la provisión de sombra estival para la caminabilidad. Permite inventariar especies de árboles en calzadas y patios interiores (Plátanos Orientales, Jacarandás, Peumos), evaluar su estado fitosanitario y promover corredores biológicos barriales.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> CONAF / Ministerio del Medio Ambiente (MMA) / Dirección de Medio Ambiente Municipalidad de Santiago.</div>
                <div><strong>Norma / Estándar:</strong> Ley Marco de Cambio Climático (Ley N° 21.455); Guía de Arbolado Urbano (CONAF, 2019); Estándares de Santiago Verde.</div>
                <div><strong>Equivalente IDE Chile:</strong> Infraestructura Verde y Catastro de Arbolado Urbano (MMA / CONAF / IDE Chile).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Alineaciones arboladas en bandejón central de Av. Brasil, árboles en calles Almirante Barroso y Huérfanos, patios arbolados del Campus UAH.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-08)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:25];
(
  node["natural"="tree"]({{bbox}});
  way["natural"="tree_row"]({{bbox}});
  nwr["natural"~"wood|scrub"]({{bbox}});
  nwr["leisure"="garden"]({{bbox}});
  nwr["landuse"="forest"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-09: EDIFICACIONES Y HUELLA URBANA -->
          <article id="manual-cat-09" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-09</div>
              <div class="doc-ficha-titular">
                <h3>Edificaciones y Huella Urbana (Polígonos)</h3>
                <span class="doc-ficha-sub">Huellas poligonales de manzanas, edificaciones residenciales, universitarias, comerciales y cálculo métrico (EPSG:32719)</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Provee el catastro exhaustivo de la huella física y volumetría construida de Barrio Brasil y el Campus UAH. A diferencia de las capas puntuales de equipamiento, este módulo extrae las geometrías poligonales cerradas de cada edificación (manzanas, pabellones universitarios, casonas y torres residenciales), computando en tiempo real su superficie métrica en metros cuadrados (m²) y hectáreas (ha) mediante reproyección conforme a EPSG:32719 (WGS 84 / UTM Huso 19 Sur) y la fórmula de Gauss (Shoelace), permitiendo evaluar densidades y coeficientes de ocupación del suelo.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> Servicio de Impuestos Internos (SII - Catastro de Bienes Raíces) / MINVU / DOM Santiago.</div>
                <div><strong>Norma / Estándar:</strong> Ley General de Urbanismo y Construcciones (LGUC); OGUC Art. 2.1.24; D.S. N° 50 MINVU; ISO 19157 (Exactitud temática y de área).</div>
                <div><strong>Equivalente IDE Chile:</strong> Catastro Nacional de Bienes Raíces (SII / IDE Chile) / Manzanas y Edificaciones Censales (INE).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Pabellones y patios de Casa Central UAH (Almirante Barroso 10), casonas de Erasmo Escala y Cienfuegos, y bloques de departamentos.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-09)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:35];
(
  way["building"]({{bbox}});
  relation["building"]({{bbox}});
);
out geom tags qt 400;</code></pre>
              </div>
            </div>
          </article>

          <!-- CAT-10: COBERTURAS Y USOS DE SUELO -->
          <article id="manual-cat-10" class="doc-ficha-cat">
            <div class="doc-ficha-cabecera">
              <div class="doc-ficha-badge">CAT-10</div>
              <div class="doc-ficha-titular">
                <h3>Coberturas y Usos de Suelo (Polígonos y Líneas)</h3>
                <span class="doc-ficha-sub">Zonificación funcional del suelo urbano, áreas de equipamiento, recreación y materiales de rodado vial</span>
              </div>
            </div>
            <div class="doc-ficha-cuerpo">
              <p><strong>Función en la Gestión Barrial:</strong> Caracteriza la distribución espacial de los usos del territorio (residencial, comercial, institucional y recreativo) y la materialidad superficial de la trama urbana (asfalto, adoquines patrimoniales y cubiertas vegetales). Facilita el contraste empírico entre la zonificación normativa del Plan Regulador Comunal (PRC) de Santiago y las funciones territoriales reales mapeadas colaborativamente por la comunidad.</p>
              <div class="doc-cat-datos-grid">
                <div><strong>Contraparte Estatal:</strong> MINVU (División de Desarrollo Urbano) / Dirección de Obras Municipales (DOM) / Dirección de Vialidad MOP.</div>
                <div><strong>Norma / Estándar:</strong> Plan Regulador Comunal de Santiago (PRC); Ley N° 21.074 de Fortalecimiento de la Regionalización; OGC Land and Infrastructure Standards.</div>
                <div><strong>Equivalente IDE Chile:</strong> Zonificación Planes Reguladores Comunales (MINVU / IDE Chile) / Red Vial Pavimentada (MOP).</div>
                <div><strong>Casos en Barrio Brasil:</strong> Recintos de uso educacional en Campus UAH, zonas de amortiguación residencial en pasajes interiores y calzadas adoquinadas tradicionales.</div>
              </div>
              <div class="doc-codigo-bloque">
                <div class="doc-codigo-header">
                  <span>Sintaxis Overpass QL Recomendada (CAT-10)</span>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)">Copiar QL</button>
                </div>
                <pre><code>[out:json][timeout:35];
(
  nwr["landuse"]({{bbox}});
  nwr["natural"~"wood|scrub|water|grassland|tree_row"]({{bbox}});
  nwr["leisure"~"park|garden|pitch|nature_reserve"]({{bbox}});
  way["surface"~"asphalt|paving_stones|cobblestone"]({{bbox}});
);
out geom tags qt 400;</code></pre>
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
          <h3>Justificación Geodésica</h3>
          <p>
            El sistema de referencia geodésico nativo de OpenStreetMap y GPS es <strong>WGS 84 (EPSG:4326)</strong>, cuyas coordenadas se expresan en grados angulares de latitud y longitud. Por este motivo, para dar cumplimiento a los estándares del Instituto Geográfico Militar (IGM) y de la Infraestructura de Datos Espaciales de Chile (IDE Chile), el Atlas transforma cada coordenada al sistema oficial proyectado:
          </p>
          <div class="doc-destacado-geodesico">
            <strong>Sistema Oficial Adoptado:</strong> WGS 84 / UTM Huso 19 Sur (EPSG:32719)<br>
            <span class="doc-pequeno">Elipsoide: WGS 84 | Semieje mayor (a): 6.378.137,0 m | Aplanamiento (1/f): 298,257223563 | Meridiano Central: 69° O | Falso Este: 500.000 m | Falso Norte: 10.000.000 m</span>
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
            La licencia MIT permite que terceros tomen el código y la cartografía comunitaria, los incorporen en plataformas cerradas privativas y restrinjan el acceso a la ciudadanía sin transferir ninguna mejora a la comunidad. En un proyecto de <strong>Información Geográfica Voluntaria desarrollado con fondos públicos</strong>, esto vulneraría el principio de soberanía territorial de los datos abiertos.
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
              <li><strong>CP-IDEA / UN-GGIM: Américas. (2013).</strong> <em>De la CP-IDEA a UN-GGIM: Américas: Hacia la consolidación de la Infraestructura de Datos Espaciales de las Américas</em>. Comité Regional de las Naciones Unidas. <a href="https://www.un-ggim-americas.org/" target="_blank" rel="noopener">https://www.un-ggim-americas.org/</a></li>
              <li><strong>Fuenzalida, M. (2025).</strong> <em>Taller Datos Abiertos e Infraestructura de Datos Espaciales en Chile: Integración de VGI y Políticas Públicas</em>. Conferencia y Seminario IDE Chile, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2006).</strong> <em>Decreto Supremo N° 28/2006: Crea Comisión Asesora del Sistema Nacional de Información Territorial (SNIT)</em>. Ministerio de Bienes Nacionales, Gobierno de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=251642" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=251642</a></li>
              <li><strong>IDE Chile / SNIT. (2016).</strong> <em>Guía Técnica para la Estandarización y Producción de Información Geoespacial</em>. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2017).</strong> <em>Marco Técnico y Metodológico para la Evaluación de la Calidad de la Información Geográfica en Chile (Norma ISO 19157)</em>. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2018).</strong> <em>Perfil Nacional de Metadatos de Chile v2.0 (Basado en ISO 19115:2003 / ISO 19139:2007)</em>. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2020).</strong> <em>Catálogo de Objetos Geográficos de Chile v3.0: Estándar para la captura y clasificación de información geoespacial</em>. Ministerio de Bienes Nacionales. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2021).</strong> <em>Modelo de Interoperabilidad Geoespacial del Estado de Chile: Jerarquía, Distribución y Acuerdos Interinstitucionales de Intercambio de Datos</em>. Ministerio de Bienes Nacionales. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2022).</strong> <em>GeoNodo Chile: Plataforma Nacional de Datos Geoespaciales Abiertos e Infraestructura de Servicios Web Geográficos (WMS, WFS, CSW)</em>. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. <a href="https://www.geonodo.cl" target="_blank" rel="noopener">https://www.geonodo.cl</a></li>
              <li><strong>IDE Chile / SNIT. (2023).</strong> <em>Política Nacional de Información Geoespacial</em>. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales, Gobierno de Chile. <a href="https://www.ide.cl" target="_blank" rel="noopener">https://www.ide.cl</a></li>
              <li><strong>Magaña, A., & Valverde, F. (2016).</strong> Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica. <em>Revista Cartográfica</em>, 93, 29–53. <a href="https://doi.org/10.35424/rcarto.i93.377" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.377</a></li>
              <li><strong>Nebert, D. D. (Ed.). (2004).</strong> <em>Developing Spatial Data Infrastructures: The SDI Cookbook (v2.0)</em>. Global Spatial Data Infrastructure Association (GSDI). <a href="https://www.gsdiassociation.org/" target="_blank" rel="noopener">https://www.gsdiassociation.org/</a></li>
              <li><strong>Shahi, K. (2023).</strong> Volunteered Geographic Information (VGI) in Spatial Data Infrastructure (SDI) Continuum. <em>EAI Endorsed Transactions on Internet of Things</em>, 9(1), 1–12. <a href="https://doi.org/10.4108/eetiot.v9i1.2941" target="_blank" rel="noopener">https://doi.org/10.4108/eetiot.v9i1.2941</a></li>
              <li><strong>Snyder, J. P. (1987).</strong> <em>Map projections: a working manual</em> (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. <a href="https://doi.org/10.3133/pp1395" target="_blank" rel="noopener">https://doi.org/10.3133/pp1395</a></li>
              <li><strong>Topf, J., & OpenStreetMap Contributors. (2024).</strong> <em>Taginfo: OpenStreetMap tag statistics, semantic consistency and usage system</em>. OpenStreetMap Foundation. <a href="https://taginfo.openstreetmap.org/" target="_blank" rel="noopener">https://taginfo.openstreetmap.org/</a></li>
              <li><strong>UN-GGIM. (2020).</strong> <em>Integrated Geospatial Information Framework (IGIF): A strategic guide to develop and strengthen national geospatial information management</em>. United Nations. <a href="https://ggim.un.org/IGIF/" target="_blank" rel="noopener">https://ggim.un.org/IGIF/</a></li>
              <li><strong>UN-GGIM. (2024).</strong> <em>Future trends in geospatial information management: The five to ten year vision (4th ed.)</em>. United Nations Committee of Experts on Global Geospatial Information Management. <a href="https://ggim.un.org/" target="_blank" rel="noopener">https://ggim.un.org/</a></li>
              <li><strong>Wilkinson, M. D., et al. (2016).</strong> The FAIR Guiding Principles for scientific data management and stewardship. <em>Scientific Data</em>, 3, 160018. <a href="https://doi.org/10.1038/sdata.2016.18" target="_blank" rel="noopener">https://doi.org/10.1038/sdata.2016.18</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>4. APIs y Plataformas para Análisis de Calidad y Contribuciones Históricas</h4>
            <ul class="doc-bib-lista">
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2024).</strong> <em>GBIF Occurrence API & Species API (v1 REST API Documentation)</em>. GBIF Secretariat. <a href="https://www.gbif.org/developer/summary" target="_blank" rel="noopener">https://www.gbif.org/developer/summary</a></li>
              <li><strong>Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2023).</strong> <em>ohsome API: OpenStreetMap History Analytics API Documentation (v1 & v2)</em>. Heidelberg University. <a href="https://api.ohsome.org/" target="_blank" rel="noopener">https://api.ohsome.org/</a></li>
              <li><strong>Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2024).</strong> <em>OpenStreetMap Quality Tool (OQT API): Automated spatial data quality assessment</em>. Heidelberg University. <a href="https://dashboard.ohsome.org/" target="_blank" rel="noopener">https://dashboard.ohsome.org/</a></li>
              <li><strong>OpenStreetMap Foundation [OSMF]. (2023).</strong> <em>Overpass API: A high-performance read-only API serving custom spatial subsets of OpenStreetMap</em>. OSMF. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/Overpass_API</a></li>
              <li><strong>OpenStreetMap Foundation & Geofabrik GmbH. (2024).</strong> <em>Taginfo Chile: Base de datos y estadísticas regionales de etiquetas de OpenStreetMap en Chile</em>. Geofabrik. <a href="https://taginfo.geofabrik.de/south-america:chile" target="_blank" rel="noopener">https://taginfo.geofabrik.de/south-america:chile</a></li>
              <li><strong>Wille, L., & OpenStreetMap Community. (2023).</strong> <em>OSMCha: OpenStreetMap Changeset Analyzer and Quality Validation Tool</em>. Mapbox / Development Seed. <a href="https://osmcha.org/" target="_blank" rel="noopener">https://osmcha.org/</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>5. Especificaciones Técnicas y Manuales de Lenguajes de Programación, Consulta y Formatos</h4>
            <ul class="doc-bib-lista">
              <li><strong>Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016).</strong> <em>The GeoJSON Format</em> (RFC No. 7946). Internet Engineering Task Force (IETF). <a href="https://doi.org/10.17487/RFC7946" target="_blank" rel="noopener">https://doi.org/10.17487/RFC7946</a></li>
              <li><strong>Ecma International. (2024).</strong> <em>ECMAScript® 2024 Language Specification</em> (Standard ECMA-262, 15th ed.). Ecma International. <a href="https://www.ecma-international.org/publications-and-standards/standards/ecma-262/" target="_blank" rel="noopener">https://www.ecma-international.org/publications-and-standards/standards/ecma-262/</a></li>
              <li><strong>MacFarlane, J., Krewenki, P., Greenspun, J., et al. (2024).</strong> <em>CommonMark Spec: A strongly defined, highly compatible specification of Markdown</em> (Version 0.31.2). CommonMark. <a href="https://spec.commonmark.org/" target="_blank" rel="noopener">https://spec.commonmark.org/</a></li>
              <li><strong>Olbricht, R., & OpenStreetMap Contributors. (2023).</strong> <em>Overpass QL: Overpass API Language Guide and Reference Manual</em>. OpenStreetMap Foundation. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL</a></li>
              <li><strong>Van Rossum, G., & Drake, F. L. (2024).</strong> <em>The Python Language Reference</em> (Manual v3.12). Python Software Foundation. <a href="https://docs.python.org/3/reference/" target="_blank" rel="noopener">https://docs.python.org/3/reference/</a></li>
              <li><strong>Web Hypertext Application Technology Working Group [WHATWG]. (2024).</strong> <em>HTML Living Standard: The specification for web application developers</em>. WHATWG / World Wide Web Consortium. <a href="https://html.spec.whatwg.org/multipage/" target="_blank" rel="noopener">https://html.spec.whatwg.org/multipage/</a></li>
              <li><strong>World Wide Web Consortium [W3C]. (2018).</strong> <em>Scalable Vector Graphics (SVG) 2.0 Specification</em> (W3C Candidate Recommendation). W3C. <a href="https://www.w3.org/TR/SVG2/" target="_blank" rel="noopener">https://www.w3.org/TR/SVG2/</a></li>
              <li><strong>World Wide Web Consortium [W3C]. (2023).</strong> <em>Cascading Style Sheets (CSS) Snapshot 2023</em> (W3C Working Group Note). W3C. <a href="https://www.w3.org/TR/css-2023/" target="_blank" rel="noopener">https://www.w3.org/TR/css-2023/</a></li>
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

// Exposición en ámbito global window para interoperabilidad en navegador
if (typeof window !== 'undefined') {
  window.ModuloManual = ModuloManual;
}

// Autocarga inmediata en el DOM para evitar que la sección permanezca en estado 'cargando'
if (typeof document !== 'undefined') {
  function autoCargarManual() {
    const contenedor = document.getElementById('contenido-manual');
    if (contenedor && (!contenedor.innerHTML || contenedor.innerHTML.includes('Cargando'))) {
      contenedor.innerHTML = ModuloManual.render();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoCargarManual);
  } else {
    autoCargarManual();
  }
}

