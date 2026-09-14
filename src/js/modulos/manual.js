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
              <li><strong>Auditar Capas Oficiales vs. Brechas VGI (Panel 06):</strong> Utilice el filtro <em>[🏛 Capas Oficiales IDE Chile]</em> para verificar las 48 capas oficiales con soporte estatal y contraste con las 86 <em>[⚡ Brechas VGI]</em> comunitarias no catastradas por el Estado (rebajes de solera, baldosas táctiles, ciclovías comunitarias, luminarias, grifos de incendio).</li>
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
              <p>Visualizador geoespacial interactivo de alta resolución basado en <strong>Leaflet 1.9.4</strong>. Permite explorar, filtrar y superponer la cartografía territorial de Barrio Brasil y el campus de la Universidad Alberto Hurtado con alta velocidad, contraste óptimo (WCAG AAA) y herramientas interactivas (Dibujar Bbox, selector de territorios, exportación a QGIS).</p>
              <p><strong>Catálogo Oficial de 107 Capas del Estado e Inspector Normativo:</strong> Organizado en 6 macro-grupos temáticos en acordeones colapsables interactivos (Normativa IPT, Medio Ambiente, Vulnerabilidad RSH, Equipamiento y Patrimonio, Seguridad, Movilidad y Economía). Incluye el <strong>Inspector Normativo CIN-VGI</strong> (auditoría en 1 clic de zonificación PRC Santiago, OGUC y descarga de certificado técnico con advertencia legal Art. 116 LGUC), el <strong>Importador Multi-formato</strong> (KMZ en memoria con JSZip, KML, GeoJSON, GPX, CSV) y el conector a la <strong>Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3 en Supabase</strong> con 129.262 entidades vectorizadas indexadas con GIST.</p>
              <div class="doc-modulo-meta"><strong>Salidas:</strong> Renderizado de capas vectoriales, popups con atributos oficiales y citas APA 7ª ed., consultas espaciales en milisegundos por RPC PostGIS, teselas WMS GetMap y descarga directa GeoJSON para SIG.</div>
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
              <div class="doc-modulo-meta"><strong>Salidas:</strong> 10 tarjetas interactivas de macro-categorías (CAT-01 a CAT-10) con filtrado en vivo y enlaces al manual, catálogo depurado de 134 descriptores territoriales (48 oficiales IDE vs. 86 brechas VGI comunitarias) y 14 atributos normalizados.</div>
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
          <h2>Aparato Bibliográfico Integral y Fuentes Académicas (Norma APA 7ª ed.)</h2>
          <p class="doc-lead">
            Compendio exhaustivo de <strong>125 fuentes académicas, científicas, legales y técnicas</strong> integradas en el Atlas de Información Geográfica Voluntaria, articulando la totalidad de la literatura seminal del <strong>Seminario de Grado de Geografía UAH (51 obras originales + 8 fuentes epistemológicas del texto)</strong> con las normas técnicas internacionales y los marcos de gestión territorial del Estado de Chile:
          </p>
        </header>

        <div class="doc-texto-bloque">
          <div class="doc-bib-categoria">
            <h4>1. Epistemología de la VGI, Filosofía de los SIG y Geografía Crítica</h4>
            <ul class="doc-bib-lista">
              <li><strong>Schuurman, N. (2000).</strong> Trouble in the Heartland: GIS and its critics in the 1990s. Progress in Human Geography, 24(4), 569-590. <a href="https://doi.org/10.1191/030913200100189111" target="_blank" rel="noopener">https://doi.org/10.1191/030913200100189111</a></li>
              <li><strong>Buzai, G. D. (2014).</strong> Geografía Global + NeoGeografía. Actuales espacios de integración científica y social en entornos digitales. Estudios Socioterritoriales. Revista de Geografía, (16), 183-189. <a href="http://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1853-43922014000200008" target="_blank" rel="noopener">http://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1853-43922014000200008</a></li>
              <li><strong>Mateos, P. (2013).</strong> Geovisualización de la población: nuevas tendencias en la web social. Investigaciones Geográficas, (59), 9-22. <a href="https://doi.org/10.14198/INGEO2013.59.01" target="_blank" rel="noopener">https://doi.org/10.14198/INGEO2013.59.01</a></li>
              <li><strong>Castells, M. (2000).</strong> La era de la información: economía, sociedad y cultura (Vol. 1: La sociedad red). Madrid: Alianza Editorial. <a href="https://www.alianzaeditorial.es/libro/ciencias-sociales/la-sociedad-red-manuel-castells-9788420647319/" target="_blank" rel="noopener">https://www.alianzaeditorial.es/</a></li>
              <li><strong>Pickles, J. (Ed.). (2006).</strong> Ground Truth: The Social Implications of Geographic Information Systems. New York: Guilford Press. <a href="https://www.guilford.com/books/Ground-Truth/John-Pickles/9780898622959" target="_blank" rel="noopener">https://www.guilford.com/</a></li>
              <li><strong>Anselin, L. (1988).</strong> Spatial Econometrics: Methods and Models. Dordrecht: Kluwer Academic Publishers. <a href="https://doi.org/10.1007/978-94-015-7799-1" target="_blank" rel="noopener">https://doi.org/10.1007/978-94-015-7799-1</a></li>
              <li><strong>Goodchild, M. F. (2007).</strong> Citizens as sensors: the world of volunteered geography. GeoJournal, 69(4), 211-221. <a href="https://doi.org/10.1007/s10708-007-9111-y" target="_blank" rel="noopener">https://doi.org/10.1007/s10708-007-9111-y</a></li>
              <li><strong>Burghardt, D., Demidova, E., & Keim, D. A. (Eds.). (2024).</strong> Volunteered Geographic Information: Interpretation, visualization and social context. Springer Nature. <a href="https://doi.org/10.1007/978-3-031-35374-1" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-031-35374-1</a></li>
              <li><strong>Haklay, M. (2013).</strong> Neogeography and the delusion of democratisation. Environment and Planning A: Economy and Space, 45(1), 55–69. <a href="https://doi.org/10.1068/a45184" target="_blank" rel="noopener">https://doi.org/10.1068/a45184</a></li>
              <li><strong>Haklay, M., & Capineri, C. (Eds.). (2016).</strong> European Handbook of Crowdsourced Geographic Information. London: Ubiquity Press. <a href="http://dx.doi.org/10.5334/bax" target="_blank" rel="noopener">http://dx.doi.org/10.5334/bax</a></li>
              <li><strong>Haklay, M., Antoniou, V., Basiouka, S., Soden, R., & Mooney, P. (2014).</strong> Crowdsourced Geographic Information Use in Government. Washington, D.C.: World Bank Report. <a href="https://doi.org/10.1596/28470" target="_blank" rel="noopener">https://doi.org/10.1596/28470</a></li>
              <li><strong>See, L., Mooney, P., Foody, G., et al. (2016).</strong> Crowdsourcing, citizen science or Volunteered Geographic Information? The current state of crowdsourced geographic information. ISPRS International Journal of Geo-Information, 5(5), 55. <a href="https://doi.org/10.3390/ijgi5050055" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi5050055</a></li>
              <li><strong>See, L., et al. (2025).</strong> Mapping the Future: The Emergence of Machine Learning, Big Data, and Volunteered Geographic Information. Cham: Springer. <a href="https://doi.org/10.1007/978-3-031-77344-0_2" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-031-77344-0_2</a></li>
              <li><strong>Soriano, C. (2016).</strong> La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad? Universidad de Alcalá / Revista Cartográfica, 93, 11-28. <a href="https://doi.org/10.35424/rcarto.i93.376" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.376</a></li>
              <li><strong>Pastor, J. (2015).</strong> La confianza de la Información Geográfica Voluntaria (VGI). Universidad de Alcalá / Revista Cartográfica, 91, 33-49. <a href="https://doi.org/10.35424/rcarto.i91.352" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i91.352</a></li>
              <li><strong>Magaña, A., & Valverde, F. (2016).</strong> Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica. Revista Cartográfica, 93, 39-59. <a href="https://doi.org/10.35424/rcarto.i93.426" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.426</a></li>
              <li><strong>Willington, S. (2018).</strong> Sobre la evolución de la información geográfica: las bodas de oro de los SIG. Instituto Geográfico Nacional de España / CNIG. <a href="https://www.ign.es/" target="_blank" rel="noopener">https://www.ign.es/</a></li>
              <li><strong>Fast, V., & Rinner, C. (2014).</strong> A Systems Perspective on Volunteered Geographic Information. ISPRS International Journal of Geo-Information, 3(4), 1278-1292. <a href="https://doi.org/10.3390/ijgi3041278" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi3041278</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>2. Evaluación de Calidad Espacial, Integridad Cartográfica y Métricas ISO 19157</h4>
            <ul class="doc-bib-lista">
              <li><strong>Muñoz-Vargas, J., Lobry, S., & Lefèvre, S. (2019).</strong> Correcting rural building annotations in OpenStreetMap using convolutional neural networks. arXiv preprint arXiv:1901.08190. <a href="https://arxiv.org/abs/1901.08190" target="_blank" rel="noopener">https://arxiv.org/abs/1901.08190</a></li>
              <li><strong>Tempelmeier, N., & Demidova, E. (2022).</strong> Attention-based vandalism detection in OpenStreetMap. arXiv preprint arXiv:2201.10406. <a href="https://arxiv.org/abs/2201.10406" target="_blank" rel="noopener">https://arxiv.org/abs/2201.10406</a></li>
              <li><strong>Weigell, P. (2023).</strong> Data coverage, richness, and quality of OpenStreetMap for special interest tags: wayside crosses-a case study. arXiv preprint arXiv:2306.04752. <a href="https://arxiv.org/abs/2306.04752" target="_blank" rel="noopener">https://arxiv.org/abs/2306.04752</a></li>
              <li><strong>Ballatore, A. (2014).</strong> Defacing the map: Cartographic vandalism in the digital commons. The Cartographic Journal, 51(3), 214-224. <a href="https://doi.org/10.1179/1743277414Y.0000000085" target="_blank" rel="noopener">https://doi.org/10.1179/1743277414Y.0000000085</a></li>
              <li><strong>Seto, T., Kanasugi, H., & Nishimura, Y. (2020).</strong> Quality verification of Volunteered Geographic Information using OSM Notes data in a global context. ISPRS International Journal of Geo-Information, 9(6), 372. <a href="https://doi.org/10.3390/ijgi9060372" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi9060372</a></li>
              <li><strong>Mooney, P., & Minghini, M. (2017).</strong> A Review of Volunteered Geographic Information for Land Administration. MDPI, Land, 6(4), 89. <a href="https://doi.org/10.3390/land6040089" target="_blank" rel="noopener">https://doi.org/10.3390/land6040089</a></li>
              <li><strong>Antoniou, V., & Skopeliti, A. (2015).</strong> Measures of Reasoning and Spatial Data Quality in VGI. ISPRS International Journal of Geo-Information, 4(3), 1724-1741. <a href="https://doi.org/10.3390/ijgi4031724" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi4031724</a></li>
              <li><strong>Skopeliti, A., & Antoniou, V. (2017).</strong> Evaluating Volunteered Geographic Information for Spatio-Temporal Analysis: OpenStreetMap and the Refugee Crisis in Greece. MDPI, Environments, 4(2), 30. <a href="https://doi.org/10.3390/environments4020030" target="_blank" rel="noopener">https://doi.org/10.3390/environments4020030</a></li>
              <li><strong>Goodchild, M. F., & Li, L. (2012).</strong> Assuring the quality of volunteered geographic information. Spatial Statistics, 1, 110-120. <a href="https://doi.org/10.1016/j.spasta.2012.03.002" target="_blank" rel="noopener">https://doi.org/10.1016/j.spasta.2012.03.002</a></li>
              <li><strong>Barron, C., Neis, P., & Zipf, A. (2013/2014).</strong> A Comprehensive Framework for Intrinsic OpenStreetMap Quality Analysis. Transactions in GIS, 18(6), 877–895. <a href="https://doi.org/10.1111/tgis.12073" target="_blank" rel="noopener">https://doi.org/10.1111/tgis.12073</a></li>
              <li><strong>Girres, J. F., & Touya, G. (2010).</strong> Quality Assessment of the French OpenStreetMap Dataset. Transactions in GIS, 14(4), 435–459. <a href="https://doi.org/10.1111/j.1467-9671.2010.01203.x" target="_blank" rel="noopener">https://doi.org/10.1111/j.1467-9671.2010.01203.x</a></li>
              <li><strong>Bégin, D., Devillers, R., & Roche, S. (2013).</strong> Assessing Volunteered Geographic Information Quality for Topographic Mapping. Cartographica: The International Journal for Geographic Information and Geovisualization, 48(4), 312–325. <a href="https://doi.org/10.3138/carto.48.4.1687" target="_blank" rel="noopener">https://doi.org/10.3138/carto.48.4.1687</a></li>
              <li><strong>Fonte, C. C., Minghini, M., Patriarca, J., Antoniou, V., See, L., & Schöpfer, E. (2020).</strong> Assessing the Accuracy of OpenStreetMap Land Use and Land Cover Data. International Journal of Applied Earth Observation and Geoinformation, 93, 102209. <a href="https://doi.org/10.1016/j.jag.2020.102209" target="_blank" rel="noopener">https://doi.org/10.1016/j.jag.2020.102209</a></li>
              <li><strong>Fonte, C. C., See, L., Fritz, S., & Minghini, M. (2022).</strong> Quality Assessment of Citizen Science and VGI for Land Cover Mapping. Remote Sensing, 14(14), 3350. <a href="https://doi.org/10.3390/rs14143350" target="_blank" rel="noopener">https://doi.org/10.3390/rs14143350</a></li>
              <li><strong>International Organization for Standardization. (2013).</strong> Geographic information — Data quality (ISO Standard No. 19157:2013). Geneva: ISO. <a href="https://www.iso.org/standard/32575.html" target="_blank" rel="noopener">https://www.iso.org/standard/32575.html</a></li>
              <li><strong>Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2024).</strong> OpenStreetMap Quality Tool (OQT API): Automated spatial data quality assessment. Heidelberg University. <a href="https://dashboard.ohsome.org/" target="_blank" rel="noopener">https://dashboard.ohsome.org/</a></li>
              <li><strong>Wille, L., & OpenStreetMap Community. (2023).</strong> OSMCha: OpenStreetMap Changeset Analyzer and Quality Validation Tool. Mapbox / Development Seed. <a href="https://osmcha.org/" target="_blank" rel="noopener">https://osmcha.org/</a></li>
              <li><strong>Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019).</strong> OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data. EPJ Data Science, 8(1), 1-18. <a href="https://doi.org/10.1140/epjds/s13688-019-0208-0" target="_blank" rel="noopener">https://doi.org/10.1140/epjds/s13688-019-0208-0</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>3. Biodiversidad Urbana, Ciencia Ciudadana, Estándar Darwin Core y Plataformas Biológicas (GBIF / iNaturalist)</h4>
            <ul class="doc-bib-lista">
              <li><strong>Amano, T., Lamming, J. D. L., & Sutherland, W. J. (2016).</strong> Spatial gaps in global biodiversity information and the role of citizen science. BioScience Advance, Oxford University, 66(11), 993-1000. <a href="https://doi.org/10.1093/biosci/biw127" target="_blank" rel="noopener">https://doi.org/10.1093/biosci/biw127</a></li>
              <li><strong>Sandoval, S., Acuña, I., & Jaramillo, C. (2022).</strong> Polinización Sostenible: Adaptación al cambio climático para la producción de fruta en Chile. Fraunhofer Chile Research – Centro de Biotecnología de Sistemas (CSB), Proyecto CORFO 19 BP 117423. <a href="https://www.corfo.cl" target="_blank" rel="noopener">https://www.corfo.cl</a></li>
              <li><strong>López-Aliste, M., Fonturbel, F. E., Ruz, L., Sepúlveda, Y., Rodríguez, S., & Saraiva, A. M. (2021).</strong> Wild bees of Chile: a database on taxonomy, sociality, and ecology. Ecology, 102(8), e03377. <a href="https://doi.org/10.1002/ecy.3377" target="_blank" rel="noopener">https://doi.org/10.1002/ecy.3377</a> / GBIF Dataset: <a href="https://doi.org/10.15468/6knwyq" target="_blank" rel="noopener">https://doi.org/10.15468/6knwyq</a></li>
              <li><strong>Jacobs, C., & Zipf, A. (2017).</strong> Completeness of citizen science biodiversity data from a volunteered geographic information perspective. Geo-spatial Information Science, 20(2), 100-111. <a href="https://doi.org/10.1080/10095020.2017.1288424" target="_blank" rel="noopener">https://doi.org/10.1080/10095020.2017.1288424</a></li>
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2022).</strong> Introducción a GBIF: La infraestructura mundial de información sobre biodiversidad. Secretariado de GBIF. <a href="https://www.gbif.org/es/what-is-gbif" target="_blank" rel="noopener">https://www.gbif.org/es/what-is-gbif</a></li>
              <li><strong>Schindel, D., Miller, S., & Trizna, M. (2016).</strong> The Global Registry of Biodiversity Repositories: A call for community curation. Biodiversity Data Journal, 4, e10293. <a href="https://doi.org/10.3897/BDJ.4.e10293" target="_blank" rel="noopener">https://doi.org/10.3897/BDJ.4.e10293</a></li>
              <li><strong>Chapman, A. D. (2005a).</strong> Principios de Calidad de Datos Geográficos. Copenhague: Secretaría de GBIF. <a href="https://www.gbif.org/document/80509" target="_blank" rel="noopener">https://www.gbif.org/document/80509</a></li>
              <li><strong>Chapman, A. D. (2005b).</strong> Principios y Métodos de Limpieza de Datos: Un informe para la Facilidad Global de Información sobre Biodiversidad. Copenhague: Secretaría de GBIF. <a href="https://www.gbif.org/document/80528" target="_blank" rel="noopener">https://www.gbif.org/document/80528</a></li>
              <li><strong>Chapman, A. D. (2010).</strong> Validación y Limpieza de Datos de Biodiversidad: Manual de capacitación técnica. Copenhague: Secretaría de GBIF. <a href="https://www.gbif.org/document/80530" target="_blank" rel="noopener">https://www.gbif.org/document/80530</a></li>
              <li><strong>Veiga, A. K., Saraiva, A. M., Chapman, A. D., Morris, P. J., Gendreau, C., Schigel, D., & Robertson, T. (2017).</strong> Guía para la Limpieza de Datos de Biodiversidad con OpenRefine. Copenhague: Secretaría de GBIF. <a href="https://doi.org/10.15468/doc-b26a-hx63" target="_blank" rel="noopener">https://doi.org/10.15468/doc-b26a-hx63</a></li>
              <li><strong>Committee on Data of the International Science Council [CODATA]. (2020).</strong> Twenty Years of Data Science Journal: A Historical Perspective. CODATA Data Science Journal. <a href="https://doi.org/10.35035/ctzm-hz97" target="_blank" rel="noopener">https://doi.org/10.35035/ctzm-hz97</a></li>
              <li><strong>Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., et al. (2016).</strong> The FAIR Guiding Principles for scientific data management and stewardship. Scientific Data, 3, 160018. <a href="https://doi.org/10.1038/sdata.2016.18" target="_blank" rel="noopener">https://doi.org/10.1038/sdata.2016.18</a></li>
              <li><strong>Nature. (1999).</strong> Vast database offers vision of biodiversity. Nature, 399, 723. <a href="https://doi.org/10.1038/21728" target="_blank" rel="noopener">https://doi.org/10.1038/21728</a></li>
              <li><strong>Organisation for Economic Co-operation and Development [OECD]. (2017).</strong> Best Practice Guidelines for the Licensing of Genomic Databases. OECD Publishing. <a href="https://doi.org/10.1787/23074957" target="_blank" rel="noopener">https://doi.org/10.1787/23074957</a></li>
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2025b).</strong> Science Review Nº 12: Annual review of the uses of GBIF-mediated data. GBIF Secretariat. <a href="https://www.gbif.org/" target="_blank" rel="noopener">https://www.gbif.org/</a></li>
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2023).</strong> 2023-2027 GBIF Strategic Framework: Enabling biodiversity-positive decisions. GBIF Secretariat. <a href="https://www.gbif.org/" target="_blank" rel="noopener">https://www.gbif.org/</a></li>
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2025c).</strong> Creación de un nodo participante eficaz de GBIF: Guía de implementación institucional. Secretariado de GBIF. <a href="https://docs.gbif.org/effective-nodes-guidance/es/" target="_blank" rel="noopener">https://docs.gbif.org/effective-nodes-guidance/es/</a></li>
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2025a).</strong> Technical Guidance for EBRD clients on uploading biodiversity data to the Global Biodiversity Information Facility. GBIF Secretariat. <a href="https://www.gbif.org/" target="_blank" rel="noopener">https://www.gbif.org/</a></li>
              <li><strong>GBIF.org. (2025).</strong> GBIF Occurrence Download (Santiago Metropolitan Region). Global Biodiversity Information Facility. <a href="https://doi.org/10.15468/dl.zjw4q9" target="_blank" rel="noopener">https://doi.org/10.15468/dl.zjw4q9</a></li>
              <li><strong>Global Biodiversity Information Facility [GBIF]. (2024).</strong> GBIF Occurrence API & Species API (v1 REST API Documentation). GBIF Secretariat. <a href="https://www.gbif.org/developer/summary" target="_blank" rel="noopener">https://www.gbif.org/developer/summary</a></li>
              <li><strong>Biodiversity Information Standards [TDWG]. (2023).</strong> Darwin Core standard: Quick reference guide. Biodiversity Information Standards. <a href="https://dwc.tdwg.org/terms/" target="_blank" rel="noopener">https://dwc.tdwg.org/terms/</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>4. Aplicaciones Sectoriales de la VGI: Movilidad Urbana, Transporte, Modelación de Incendios, Salud Pública y Geoprivacidad</h4>
            <ul class="doc-bib-lista">
              <li><strong>Foody, G., See, L., et al. (Eds.). (2017).</strong> Mapping and the Citizen Sensor. London: Ubiquity Press. <a href="https://doi.org/10.5334/bbf" target="_blank" rel="noopener">https://doi.org/10.5334/bbf</a></li>
              <li><strong>Ludwig, C., Hecht, R., Lautenbach, S., et al. (2021).</strong> Traffic Sign Detection in OpenStreetMap: A Case Study in Heidelberg. Springer Nature Switzerland AG. State of the Map 2019, LNCS 11780, pp. 1–12. <a href="https://doi.org/10.1007/978-3-030-19444-4_1" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-030-19444-4_1</a></li>
              <li><strong>Ballari, D., Orellana, D., & Baloian, N. (2019).</strong> A Spatio-Temporal Model for Mining Frequent Trajectory Patterns in Volunteered Geographic Information. International Journal of Geographical Information Science, 33(10), 1959–1983. <a href="https://doi.org/10.1080/13658816.2019.1605073" target="_blank" rel="noopener">https://doi.org/10.1080/13658816.2019.1605073</a></li>
              <li><strong>Orellana, D., Hermida, C., & Osorio, P. (2019).</strong> Crowdsourced Bicycle Trip Data Quality: Assessing Positional Accuracy and Completeness. Transactions in GIS, 23(4), 841–858. <a href="https://doi.org/10.1111/tgis.12534" target="_blank" rel="noopener">https://doi.org/10.1111/tgis.12534</a></li>
              <li><strong>Orellana, D. A., & Ballari, D. (2009).</strong> La GeoWeb y su evolución: Un marco de análisis en tres dimensiones. Universidad Verdad, (49), 25-52. <a href="https://revistas.uazuay.edu.ec/index.php/uverdad/article/view/459" target="_blank" rel="noopener">https://revistas.uazuay.edu.ec/index.php/uverdad/article/view/459</a></li>
              <li><strong>Mooney, P., Grinberger, A., & Minghini, M. (2020).</strong> OpenStreetMap data use cases during the early months of the COVID-19 pandemic. arXiv preprint arXiv:2008.02653. <a href="https://arxiv.org/abs/2008.02653" target="_blank" rel="noopener">https://arxiv.org/abs/2008.02653</a></li>
              <li><strong>Attard, M., Haklay, M., & Capineri, C. (2016).</strong> The potential of Volunteered Geographic Information (VGI) in future transport systems. Urban Planning, 1(4), 6-19. <a href="https://doi.org/10.17645/up.v1i4.612" target="_blank" rel="noopener">https://doi.org/10.17645/up.v1i4.612</a></li>
              <li><strong>Grady, L. (2025).</strong> OSM-FaVe: A Dataset for OpenStreetMap Element-Feature Association and Verification. arXiv preprint arXiv:2507.03738. <a href="https://arxiv.org/abs/2507.03738" target="_blank" rel="noopener">https://arxiv.org/abs/2507.03738</a></li>
              <li><strong>Kounadi, O., & Leitner, M. (2014).</strong> Why do people contribute to OpenStreetMap? A systematic review of contributor motivations. Springer Science+Business Media Dordrecht. <a href="https://doi.org/10.1007/s10708-014-9549-8" target="_blank" rel="noopener">https://doi.org/10.1007/s10708-014-9549-8</a></li>
              <li><strong>Antoniou, V. (2023).</strong> Citizen Science: A new paradigm for spatial data infrastructure? MDPI, Land, 12(10), 1928. <a href="https://doi.org/10.3390/land12101928" target="_blank" rel="noopener">https://doi.org/10.3390/land12101928</a></li>
              <li><strong>Schmidt, F., Rothaar, A., & Rienow, A. (2021).</strong> Development of a Web GIS for small-scale detection and analysis of COVID-19 cases based on volunteered geographic information for the city of Cologne, Germany. International Journal of Health Geographics, 20(1), 1-17. <a href="https://doi.org/10.1186/s12942-021-00290-0" target="_blank" rel="noopener">https://doi.org/10.1186/s12942-021-00290-0</a></li>
              <li><strong>Farahat, A., et al. (2021).</strong> Quality Assessment of OpenStreetMap Data: A Multicriteria Approach. ISPRS International Journal of Geo-Information, 10(8), 563. <a href="https://doi.org/10.3390/ijgi10080563" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi10080563</a></li>
              <li><strong>Pais, C., Carrasco, J., Martell, D., et al. (2021).</strong> Cell2Fire: A Cell-Based Forest Fire Growth Model to support strategic landscape management planning. Frontiers in Forest and Global Change, 4, 692706. <a href="https://doi.org/10.3389/ffgc.2021.692706" target="_blank" rel="noopener">https://doi.org/10.3389/ffgc.2021.692706</a></li>
              <li><strong>Pais, C., Carrasco, J., et al. (2019).</strong> A cell-based simulation model for wildfire spread and suppression. International Journal of Wildland Fire, 30, 485–496 / arXiv:1905.09317. <a href="https://arxiv.org/abs/1905.09317" target="_blank" rel="noopener">https://arxiv.org/abs/1905.09317</a></li>
              <li><strong>Carrasco, J., Martell, D., et al. (2021).</strong> A high-resolution forest fuel moisture content model for operational use in Central Chile. Canadian Journal of Forest Research, 51(12), 1845-1857. <a href="https://doi.org/10.1139/cjfr-2021-0087" target="_blank" rel="noopener">https://doi.org/10.1139/cjfr-2021-0087</a></li>
              <li><strong>Miranda, A., et al. (2022).</strong> Characterizing the fire regime in Mediterranean ecosystems of Chile: the influence of climate, vegetation and topography. Fire Ecology, 18, 25. <a href="https://doi.org/10.1186/s42408-022-00148-3" target="_blank" rel="noopener">https://doi.org/10.1186/s42408-022-00148-3</a></li>
              <li><strong>United Nations Framework Convention on Climate Change [UNFCCC]. (2025).</strong> Global Climate Action Agenda at COP 30: Outcomes Report. United Nations. <a href="https://unfccc.int/" target="_blank" rel="noopener">https://unfccc.int/</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>5. Infraestructuras de Datos Espaciales (IDE), Web Semántica y Gobernanza de Datos</h4>
            <ul class="doc-bib-lista">
              <li><strong>IDE-Chile. (2023).</strong> Política Nacional de Información Geoespacial. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales, Gobierno de Chile. <a href="https://www.ide.cl/index.php/informacion-institucional/politica-nacional" target="_blank" rel="noopener">https://www.ide.cl/</a></li>
              <li><strong>Infraestructura de Datos Geoespaciales de Chile [IDE Chile]. (2024).</strong> Política de Gestión de Información Territorial — Geoespacial. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl/politica/politica/" target="_blank" rel="noopener">https://www.ide.cl/politica/politica/</a></li>
              <li><strong>Fuenzalida, M. (2025).</strong> Taller Datos Abiertos e Infraestructura de Datos Espaciales en Chile: Integración de VGI y Políticas Públicas. Conferencia y Seminario IDE Chile, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl/images/conferencias-seminarios/2025/taller-datos-abiertos/01-Manuel-Fuenzalida-Datos-abiertos-en-la-toma-de-decisiones.pdf" target="_blank" rel="noopener">https://www.ide.cl/.../01-Manuel-Fuenzalida-Datos-abiertos.pdf</a></li>
              <li><strong>Ballatore, A., Wilson, D. C., & Bertolotto, M. (2014).</strong> A survey of volunteered open geo-knowledge bases in the Semantic Web. Quality Issues in the Open Knowledge Base, 48-68. <a href="https://arxiv.org/abs/1401.2610" target="_blank" rel="noopener">https://arxiv.org/abs/1401.2610</a></li>
              <li><strong>Shahi, K. (2023).</strong> Spatial Data Science (SDS) in the Age of Artificial Intelligence (AI) and Foundation Models: A Position Paper. arXiv preprint arXiv:2311.14446. <a href="https://arxiv.org/abs/2311.14446" target="_blank" rel="noopener">https://arxiv.org/abs/2311.14446</a></li>
              <li><strong>Canadian Geospatial Data Infrastructure Information Product [CGDIIP]. (2012).</strong> Volunteered Geographic Information (VGI) Primer. Hickling Arthurs Low Science & Technology Policy Research. <a href="https://ftp.geogratis.gc.ca/" target="_blank" rel="noopener">https://ftp.geogratis.gc.ca/</a></li>
              <li><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Catálogo Nacional de Features: Descripción normalizada de capas geoespaciales elementales para instituciones del Estado de Chile. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/catalogo-nacional-de-features.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/catalogo-nacional-de-features.pdf</a></li>
              <li><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Metadatos Geoespaciales: Orientaciones para la documentación y gestión de la información geoespacial conforme a normas ISO. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/guia-metadatos.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/guia-metadatos.pdf</a></li>
              <li><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Integración de Estándares Internacionales ISO/TC 211 en Chile. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/recomendacion-estandares-iso-tc211.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/recomendacion-estandares-iso-tc211.pdf</a></li>
              <li><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Sistema de Referencia Geodésico para Chile, SIRGAS época 2016.0. Instituto Geográfico Militar / SNIT. <a href="https://www.ide.cl/documentos/sistema-referencia-geodesico-sirgas-2016.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/sistema-referencia-geodesico-sirgas-2016.pdf</a></li>
              <li><strong>Infraestructura de Datos Geoespaciales de Chile [IDE Chile]. (s.f.).</strong> GeoNodo Chile: Plataforma Nacional de Datos Geoespaciales Abiertos. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/productos-y-servicios/herramientas/geonodo/" target="_blank" rel="noopener">https://www.ide.cl/productos-y-servicios/herramientas/geonodo/</a></li>
              <li><strong>Infraestructura de Datos Geoespaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Interoperabilidad de servicios WMS: Vocabularios y convenciones comunes para Web Map Service. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/recomendacion-interoperabilidad-wms.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/recomendacion-interoperabilidad-wms.pdf</a></li>
              <li><strong>Comité Permanente para la Infraestructura de Datos Geoespaciales de las Américas [CP-IDEA]. (2013).</strong> De la CP-IDEA a UN-GGIM: Américas: Hacia la consolidación de la Infraestructura de Datos Espaciales de las Américas. Naciones Unidas. <a href="https://www.un-ggim-americas.org/" target="_blank" rel="noopener">https://www.un-ggim-americas.org/</a></li>
              <li><strong>Nebert, D. D. (Ed.). (2004).</strong> Developing Spatial Data Infrastructures: The SDI Cookbook (v2.0). Global Spatial Data Infrastructure Association (GSDI). <a href="https://www.gsdiassociation.org/" target="_blank" rel="noopener">https://www.gsdiassociation.org/</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>6. Marco Jurídico, Normativa Urbanística, Decretos y Leyes de la República de Chile</h4>
            <ul class="doc-bib-lista">
              <li><strong>Ministerio de Bienes Nacionales. (2006).</strong> Decreto Supremo N° 28/2006: Crea Comisión Asesora del Sistema Nacional de Información Territorial (SNIT). Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=251642" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=251642</a></li>
              <li><strong>Ministerio de Educación Pública. (1970).</strong> Ley N° 17.336 sobre Propiedad Intelectual. Diario Oficial de la República de Chile (Texto refundido y actualizado a 2024). <a href="https://www.bcn.cl/leychile/navegar?idNorma=28933" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=28933</a></li>
              <li><strong>Ministerio Secretaría General de la Presidencia [SEGPRES]. (2008).</strong> Ley N° 20.285 sobre Acceso a la Información Pública y Principio de Transparencia. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=278858" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=278858</a></li>
              <li><strong>Consejo de Monumentos Nacionales [CMN]. (2020).</strong> Ley N° 17.288 de Monumentos Nacionales y Normas Relacionadas. Ministerio de las Culturas, las Artes y el Patrimonio, Gobierno de Chile. <a href="https://www.monumentos.gob.cl/" target="_blank" rel="noopener">https://www.monumentos.gob.cl/</a></li>
              <li><strong>Ministerio de Salud [MINSAL]. (2019).</strong> Ley N° 21.156: Establece la obligación de disponer de desfibriladores externos automáticos portátiles en recintos públicos. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1131750" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1131750</a></li>
              <li><strong>Ministerio del Interior y Seguridad Pública. (2012).</strong> Ley N° 20.564: Ley Marco de Bomberos de Chile. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1036814" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1036814</a></li>
              <li><strong>Ministerio del Medio Ambiente [MMA]. (2016).</strong> Ley N° 20.920: Marco para la Gestión de Residuos, Responsabilidad Extendida del Productor y Fomento al Reciclaje (Ley REP). Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1090894" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1090894</a></li>
              <li><strong>Ministerio de Vivienda y Urbanismo [MINVU]. (2016).</strong> Decreto Supremo N° 50: Modifica la Ordenanza General de Urbanismo y Construcciones en materia de accesibilidad universal. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1087816" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1087816</a></li>
              <li><strong>Directorio de Transporte Público Metropolitano [DTPM]. (2023).</strong> Manual de Normas Técnicas para Paraderos e Infraestructura del Sistema Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile. <a href="https://www.dtpm.cl" target="_blank" rel="noopener">https://www.dtpm.cl</a></li>
              <li><strong>Directorio de Transporte Público Metropolitano [DTPM]. (2024).</strong> Reporte de Cobertura, Accesibilidad y Gestión de Paradas Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile. <a href="https://www.dtpm.cl" target="_blank" rel="noopener">https://www.dtpm.cl</a></li>
              <li><strong>Corporación Nacional Forestal [CONAF]. (2019).</strong> Guía de Campo: Árboles Urbanos de Chile. Ministerio de Agricultura, Gobierno de Chile. <a href="https://www.conaf.cl" target="_blank" rel="noopener">https://www.conaf.cl</a></li>
              <li><strong>Ministerio de Vivienda y Urbanismo [MINVU]. (2020).</strong> Manual de Vialidad Cicloinclusiva y Directrices de Diseño de Ciclovías Urbanas. Gobierno de Chile. <a href="https://www.minvu.gob.cl" target="_blank" rel="noopener">https://www.minvu.gob.cl</a></li>
              <li><strong>Ministerio de Vivienda y Urbanismo [MINVU]. (2021).</strong> Política Nacional de Parques Urbanos y Estándares de Áreas Verdes Públicas. MINVU, Gobierno de Chile. <a href="https://www.minvu.gob.cl" target="_blank" rel="noopener">https://www.minvu.gob.cl</a></li>
              <li><strong>Municipalidad de Santiago. (2019).</strong> Plan Regulador Comunal de Santiago: Catálogo de Inmuebles y Zonas de Conservación Histórica. Dirección de Obras Municipales, Ilustre Municipalidad de Santiago. <a href="https://www.munistgo.cl" target="_blank" rel="noopener">https://www.munistgo.cl</a></li>
              <li><strong>OpenStreetMap Foundation & Comunidad OSM Chile. (2024).</strong> WikiProject Chile: Guía, directrices y convenciones comunitarias de mapeo para Chile. OpenStreetMap Wiki. <a href="https://wiki.openstreetmap.org/wiki/WikiProject_Chile" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/WikiProject_Chile</a></li>
              <li><strong>Open Data Commons. (2010).</strong> Open Database License (ODbL) v1.0. Open Knowledge Foundation. <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener">https://opendatacommons.org/licenses/odbl/</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>7. Estándares Internacionales ISO / OGC, Gobernanza UN-GGIM y Cartografía Geodésica</h4>
            <ul class="doc-bib-lista">
              <li><strong>Open Geospatial Consortium [OGC]. (2023).</strong> Open Geospatial Consortium Standards Baseline: Interoperability Programs and Open Standards. Wayland, MA: OGC. <a href="https://www.ogc.org/standards/" target="_blank" rel="noopener">https://www.ogc.org/standards/</a></li>
              <li><strong>Open Geospatial Consortium [OGC]. (2019).</strong> OGC API - Features - Part 1: Core (Standard No. OGC 17-069r3). Open Geospatial Consortium. <a href="https://ogcapi.ogc.org/features/" target="_blank" rel="noopener">https://ogcapi.ogc.org/features/</a></li>
              <li><strong>International Organization for Standardization. (2014).</strong> Geographic information — Metadata — Part 1: Fundamentals (ISO Standard No. 19115-1:2014). ISO. <a href="https://www.iso.org/standard/53798.html" target="_blank" rel="noopener">https://www.iso.org/standard/53798.html</a></li>
              <li><strong>International Organization for Standardization. (2016).</strong> Geographic information — Methodology for feature cataloguing (ISO Standard No. 19110:2016). ISO. <a href="https://www.iso.org/standard/57303.html" target="_blank" rel="noopener">https://www.iso.org/standard/57303.html</a></li>
              <li><strong>International Organization for Standardization. (2016).</strong> Geographic information — Services (ISO Standard No. 19119:2016/Amd 1:2019). ISO. <a href="https://www.iso.org/standard/59221.html" target="_blank" rel="noopener">https://www.iso.org/standard/59221.html</a></li>
              <li><strong>International Organization for Standardization. (2007).</strong> Geographic information — Metadata — XML schema implementation (ISO Technical Specification No. 19139:2007). ISO. <a href="https://www.iso.org/standard/32574.html" target="_blank" rel="noopener">https://www.iso.org/standard/32574.html</a></li>
              <li><strong>International Organization for Standardization. (2005).</strong> Geographic information — Web map server interface (ISO Standard No. 19128:2005 / OGC WMS). ISO / OGC. <a href="https://www.iso.org/standard/32520.html" target="_blank" rel="noopener">https://www.iso.org/standard/32520.html</a></li>
              <li><strong>International Organization for Standardization. (2021).</strong> Building construction — Accessibility and usability of the built environment (ISO Standard No. 21542:2021). ISO. <a href="https://www.iso.org/standard/70494.html" target="_blank" rel="noopener">https://www.iso.org/standard/70494.html</a></li>
              <li><strong>United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2020).</strong> Integrated Geospatial Information Framework (IGIF): A strategic guide to develop and strengthen national geospatial information management. United Nations. <a href="https://ggim.un.org/IGIF/" target="_blank" rel="noopener">https://ggim.un.org/IGIF/</a></li>
              <li><strong>United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2024).</strong> Future trends in geospatial information management: The five to ten year vision (4th ed.). United Nations. <a href="https://ggim.un.org/" target="_blank" rel="noopener">https://ggim.un.org/</a></li>
              <li><strong>Snyder, J. P. (1987).</strong> Map projections: a working manual (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. <a href="https://doi.org/10.3133/pp1395" target="_blank" rel="noopener">https://doi.org/10.3133/pp1395</a></li>
            </ul>
          </div>

          <div class="doc-bib-categoria">
            <h4>8. Plataformas Tecnológicas, APIs de Consulta, Formatos de Intercambio y Tecnologías Web Abiertas</h4>
            <ul class="doc-bib-lista">
              <li><strong>Topf, J., & OpenStreetMap Contributors. (2024).</strong> Taginfo: OpenStreetMap tag statistics, semantic consistency and usage system. OpenStreetMap Foundation. <a href="https://taginfo.openstreetmap.org/" target="_blank" rel="noopener">https://taginfo.openstreetmap.org/</a></li>
              <li><strong>OpenStreetMap Foundation & Geofabrik GmbH. (2024).</strong> Taginfo Chile: Base de datos y estadísticas regionales de etiquetas de OpenStreetMap en Chile. Geofabrik. <a href="https://taginfo.geofabrik.de/south-america:chile" target="_blank" rel="noopener">https://taginfo.geofabrik.de/south-america:chile</a></li>
              <li><strong>Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2023).</strong> ohsome API: OpenStreetMap History Analytics API Documentation (v1 & v2). Heidelberg University. <a href="https://api.ohsome.org/" target="_blank" rel="noopener">https://api.ohsome.org/</a></li>
              <li><strong>OpenStreetMap Foundation [OSMF]. (2023).</strong> Overpass API: A high-performance read-only API serving custom spatial subsets of OpenStreetMap. OSMF. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/Overpass_API</a></li>
              <li><strong>Olbricht, R., & OpenStreetMap Contributors. (2023).</strong> Overpass QL: Overpass API Language Guide and Reference Manual. OpenStreetMap Foundation. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL</a></li>
              <li><strong>Ecma International. (2024).</strong> ECMAScript® 2024 Language Specification (Standard ECMA-262, 15th ed.). Ecma International. <a href="https://www.ecma-international.org/publications-and-standards/standards/ecma-262/" target="_blank" rel="noopener">https://www.ecma-international.org/publications-and-standards/standards/ecma-262/</a></li>
              <li><strong>Van Rossum, G., & Drake, F. L. (2024).</strong> The Python Language Reference (Manual v3.12). Python Software Foundation. <a href="https://docs.python.org/3/reference/" target="_blank" rel="noopener">https://docs.python.org/3/reference/</a></li>
              <li><strong>Web Hypertext Application Technology Working Group [WHATWG]. (2024).</strong> HTML Living Standard. WHATWG / World Wide Web Consortium. <a href="https://html.spec.whatwg.org/multipage/" target="_blank" rel="noopener">https://html.spec.whatwg.org/multipage/</a></li>
              <li><strong>World Wide Web Consortium [W3C]. (2023).</strong> Cascading Style Sheets (CSS) Snapshot 2023 (W3C Working Group Note). W3C. <a href="https://www.w3.org/TR/css-2023/" target="_blank" rel="noopener">https://www.w3.org/TR/css-2023/</a></li>
              <li><strong>Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016).</strong> The GeoJSON Format (RFC No. 7946). Internet Engineering Task Force (IETF). <a href="https://doi.org/10.17487/RFC7946" target="_blank" rel="noopener">https://doi.org/10.17487/RFC7946</a></li>
              <li><strong>World Wide Web Consortium [W3C]. (2018).</strong> Scalable Vector Graphics (SVG) 2.0 Specification (W3C Candidate Recommendation). W3C. <a href="https://www.w3.org/TR/SVG2/" target="_blank" rel="noopener">https://www.w3.org/TR/SVG2/</a></li>
              <li><strong>MacFarlane, J., Krewenki, P., Greenspun, J., et al. (2024).</strong> CommonMark Spec: A strongly defined, highly compatible specification of Markdown (Version 0.31.2). CommonMark. <a href="https://spec.commonmark.org/" target="_blank" rel="noopener">https://spec.commonmark.org/</a></li>
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

