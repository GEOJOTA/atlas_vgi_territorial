/*
  manual.js
  ---------
  Manual de Uso del Atlas VGI, Guía Metodológica y Documentación Oficial.
  Estilo de documentación técnica / biblioteca de software, diseñado bajo
  una estética sobria, refinada, modular y de alto contraste ('backrooms' / libreta de campo).
  
  Departamento de Geografía · Universidad Alberto Hurtado (2026).
  Incluye:
  1. Guía de Inicio Rápido (Quickstart) para los 4 perfiles de actor territorial.
  2. Guía interactiva de los módulos 00 al 08 con acceso directo in-app.
  3. Catálogo exhaustivo de las 10 macro-categorías (CAT-01 a CAT-10) en acordeones.
  4. Reproyección geodésica conforme EPSG:32719 (Snyder, 1987) y cálculo métrico.
  5. Evaluación cuantitativa de calidad según ISO 19157 y soporte dual ohsome (v1/v2).
  6. Marco de licenciamiento abierto chileno (CC BY-SA 4.0 / ODbL / AGPL-3.0) y Git por permiso.
  7. Aparato bibliográfico extendido (127 fuentes en norma APA 7ª ed.) con buscador en vivo.
*/

const ModuloManual = (() => {

  function render() {
    return `
    <div class="documentacion-contenedor">
      
      <!-- BARRA DE NAVEGACIÓN SUPERIOR (STICKY) -->
      <nav class="doc-nav-superior" aria-label="Navegación del Manual">
        <div class="doc-nav-fila-top">
          <div class="doc-nav-marca">
            <span class="doc-nav-icono">📖</span>
            <div class="doc-nav-textos">
              <span class="doc-nav-titulo">MANUAL DE USO Y GUÍA METODOLÓGICA</span>
              <span class="doc-nav-sub">Departamento de Geografía · Universidad Alberto Hurtado 2026</span>
            </div>
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
        </div>

        <div class="doc-nav-enlaces">
          <a href="#doc-quickstart" class="doc-nav-link"><span class="doc-num">01</span> Inicio Rápido</a>
          <a href="#doc-modulos" class="doc-nav-link"><span class="doc-num">02</span> Módulos 00-08</a>
          <a href="#doc-categorias" class="doc-nav-link"><span class="doc-num">03</span> 10 Macro-Categorías</a>
          <a href="#doc-geodesia" class="doc-nav-link"><span class="doc-num">04</span> Geodesia UTM 19S</a>
          <a href="#doc-calidad" class="doc-nav-link"><span class="doc-num">05</span> Calidad ISO 19157</a>
          <a href="#doc-gobernanza" class="doc-nav-link"><span class="doc-num">06</span> Licencias & Git</a>
          <a href="#doc-bibliografia" class="doc-nav-link"><span class="doc-num">07</span> Bibliografía (127)</a>
        </div>
      </nav>

      <!-- ======================================================================
           SECCIÓN 01: INICIO RÁPIDO & PERFILES DE AUDIENCIA
           ====================================================================== -->
      <section id="doc-quickstart" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 01 / Quickstart</span>
          <h2>Visión General y Guía de Inicio Rápido por Perfil de Actor</h2>
          <p class="doc-lead">
            El <strong>Atlas de Información Geográfica Voluntaria para la Gestión Territorial</strong> es una plataforma socioespacial de código abierto desarrollada en el Departamento de Geografía de la Universidad Alberto Hurtado (UAH). Su propósito es articular la cartografía comunitaria y voluntaria (VGI) con los instrumentos de planificación urbana, políticas públicas y estándares oficiales del Estado de Chile.
          </p>
        </header>

        <div class="doc-grid-audiencias">
          <!-- PERFIL 1: INSTITUCIONAL -->
          <div class="doc-tarjeta-audiencia audiencia-institucional">
            <div class="doc-aud-header">
              <span class="doc-audiencia-tag">🏛 Perfil Institucional / Autoridades</span>
              <span class="doc-aud-subtag">IDE Chile · Municipios · SECPLAN · MINVU</span>
            </div>
            <h4>¿Cómo utilizar el Atlas en la gestión pública comunal?</h4>
            <p class="doc-aud-intro">Orientado a directores SECPLAN, asesores urbanos, direcciones de obras (DOM) y analistas de SIG municipal:</p>
            <ol class="doc-pasos-lista">
              <li>
                <span class="doc-paso-num">1</span>
                <div><strong>Auditar Capas Oficiales vs. Brechas VGI (Panel 06):</strong> Utilice el filtro <em>[🏛 Capas Oficiales IDE Chile]</em> para verificar las 110 capas con soporte estatal y contraste con las <em>[⚡ Brechas VGI]</em> comunitarias no catastradas (rebajes de solera, ciclovías comunitarias, luminarias, grifos de incendio).</div>
              </li>
              <li>
                <span class="doc-paso-num">2</span>
                <div><strong>Evaluar Cobertura y Saturación OQT (Panel 02):</strong> Aplique el marco <em>ohsome Quality Analyst (HeiGIT)</em> para determinar el índice de madurez cartográfica de su cuadrante barrial.</div>
              </li>
              <li>
                <span class="doc-paso-num">3</span>
                <div><strong>Exportar Metadatos Institucionales (Panel 05):</strong> Genere archivos XML bajo la norma <strong>ISO 19139 / Perfil Nacional de Metadatos</strong> para importación directa en nodos GeoNetwork o GeoNode municipales.</div>
              </li>
            </ol>
          </div>

          <!-- PERFIL 2: COMUNITARIO -->
          <div class="doc-tarjeta-audiencia audiencia-comunitaria">
            <div class="doc-aud-header">
              <span class="doc-audiencia-tag">🗫 Perfil Comunitario / Vecinal</span>
              <span class="doc-aud-subtag">Juntas de Vecinos · Asambleas · Ciudadanía</span>
            </div>
            <h4>¿Cómo levantar diagnósticos participativos en su barrio?</h4>
            <p class="doc-aud-intro">Diseñado para líderes barriales y vecinos, sin requerir conocimientos técnicos de SIG ni programación:</p>
            <ol class="doc-pasos-lista">
              <li>
                <span class="doc-paso-num">1</span>
                <div><strong>Consultas Barriales en 1-Clic (Panel 01):</strong> Active temáticas inmediatas (farmacias comunitarias, panaderías, paraderos Red, ciclovías, áreas verdes y casonas patrimoniales).</div>
              </li>
              <li>
                <span class="doc-paso-num">2</span>
                <div><strong>Monitoreo de Proyectos Colaborativos (Panel 04):</strong> Revise iniciativas vecinales cartografiadas en UMap y agregue capas comunitarias al visor sin intermediarios.</div>
              </li>
              <li>
                <span class="doc-paso-num">3</span>
                <div><strong>Descarga de Evidencia en Excel (Panel 07):</strong> Descargue el catálogo en hojas de cálculo <code>.xlsx</code> listas para respaldar presupuestos participativos o cartas a concejales.</div>
              </li>
            </ol>
          </div>

          <!-- PERFIL 3: VOLUNTARIO -->
          <div class="doc-tarjeta-audiencia audiencia-voluntaria">
            <div class="doc-aud-header">
              <span class="doc-audiencia-tag">⌖ Perfil Voluntario / Mapeadores</span>
              <span class="doc-aud-subtag">Comunidad OpenStreetMap · Ciencia Ciudadana</span>
            </div>
            <h4>¿Cómo enriquecer y auditar la base cartográfica abierta?</h4>
            <p class="doc-aud-intro">Pensado para colaboradores de OpenStreetMap, iNaturalist y comunidades de datos libres:</p>
            <ol class="doc-pasos-lista">
              <li>
                <span class="doc-paso-num">1</span>
                <div><strong>Constructor Visual y Overpass QL (Panel 01):</strong> Formule consultas personalizadas con filtros condicionales de calidad (<code>name</code>, <code>wheelchair</code>, <code>addr:street</code>, <code>operator</code>).</div>
              </li>
              <li>
                <span class="doc-paso-num">2</span>
                <div><strong>Validación Global en Taginfo API (Paneles 01 y 06):</strong> Valide en vivo la frecuencia y claves de cualquier etiqueta antes de mapear en terreno.</div>
              </li>
              <li>
                <span class="doc-paso-num">3</span>
                <div><strong>Control de Cambios en OSMCha (Panel 02):</strong> Detecte las últimas ediciones en el Bbox territorial con enlace directo a OSMCha para validar micro-contribuciones o revertir anomalías.</div>
              </li>
            </ol>
          </div>

          <!-- PERFIL 4: ONGS / TERRITORIALES -->
          <div class="doc-tarjeta-audiencia audiencia-investigacion">
            <div class="doc-aud-header">
              <span class="doc-audiencia-tag">🔬 Perfil ONGs / Territoriales</span>
              <span class="doc-aud-subtag">Organizaciones Territoriales · ONGs · Diagnóstico Urbano Comunitario</span>
            </div>
            <h4>¿Cómo aprovechar el Atlas para el trabajo de ONGs y articulación territorial?</h4>
            <p class="doc-aud-intro">Máximo rigor metodológico, trazabilidad bibliográfica y validación territorial UAH 2026:</p>
            <ol class="doc-pasos-lista">
              <li>
                <span class="doc-paso-num">1</span>
                <div><strong>Reproyección Conforme EPSG:32719 (Panel 02):</strong> Obtenga densidades espaciales por km² y superficies métricas rigurosas en metros cuadrados (m²) y hectáreas (ha) según la norma del IGM.</div>
              </li>
              <li>
                <span class="doc-paso-num">2</span>
                <div><strong>Calidad Espacial Multidimensional ISO 19157 (Panel 02):</strong> Audite completitud, exactitud posicional, linaje y masa crítica de usuarios mediante el soporte dual ohsome v1 y v2.</div>
              </li>
              <li>
                <span class="doc-paso-num">3</span>
                <div><strong>Interoperabilidad GeoJSON para QGIS (Panel 00):</strong> Exporte colecciones vectoriales con esquema normalizado de 14 atributos y 127 citas bibliográficas en norma APA 7ª ed.</div>
              </li>
            </ol>
          </div>
        </div>

        <!-- DIAGRAMA SVG 01: ARQUITECTURA DE FLUJO DE TRABAJO -->
        <div class="doc-diagrama-wrapper">
          <div class="doc-diagrama-header">
            <div class="doc-diagrama-dots">
              <span class="doc-dot doc-dot-rojo"></span>
              <span class="doc-dot doc-dot-amarillo"></span>
              <span class="doc-dot doc-dot-verde"></span>
            </div>
            <span class="doc-diagrama-titulo">FIGURA 1. FLUJO DE TRABAJO METODOLÓGICO Y ARQUITECTURA DEL ATLAS VGI</span>
          </div>
          <div class="doc-diagrama-svg">
            <svg viewBox="0 0 1020 310" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-doc-1" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" stroke-width="0.8" opacity="0.6"/>
                </pattern>
                <marker id="arrow-1" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/>
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="#070c18" rx="12"/>
              <rect width="100%" height="100%" fill="url(#grid-doc-1)" rx="12"/>

              <!-- NODO 1: CAPTURA & APIS -->
              <g transform="translate(18, 22)">
                <rect width="220" height="265" rx="12" fill="#0d1829" stroke="#38bdf8" stroke-width="2"/>
                <rect width="220" height="42" rx="12" fill="#0f2744"/>
                <rect y="30" width="220" height="12" fill="#0f2744"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#38bdf8">01. CAPTURA &amp; APIS</text>
                
                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Overpass API (OSM QL)</text>
                <text x="26" y="84" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Balanceo 4 espejos globales</text>

                <text x="16" y="110" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Taginfo API v4 (HeiGIT)</text>
                <text x="26" y="128" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Telemetría regional Chile</text>

                <text x="16" y="154" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• GBIF Darwin Core API</text>
                <text x="26" y="172" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Biodiversidad y taxonomía</text>

                <text x="16" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• IDE Chile / SNIT (WFS)</text>
                <text x="26" y="216" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Capas estatales oficiales</text>

                <rect x="14" y="232" width="192" height="22" rx="6" fill="#1e293b"/>
                <text x="22" y="247" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#38bdf8">WGS 84 (EPSG:4326)</text>
              </g>

              <line x1="242" y1="155" x2="268" y2="155" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-1)"/>

              <!-- NODO 2: MOTOR GEODÉSICO -->
              <g transform="translate(272, 22)">
                <rect width="220" height="265" rx="12" fill="#0d1829" stroke="#10b981" stroke-width="2"/>
                <rect width="220" height="42" rx="12" fill="#0f3428"/>
                <rect y="30" width="220" height="12" fill="#0f3428"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#34d399">02. MOTOR GEODÉSICO</text>

                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Proyección Conforme</text>
                <text x="26" y="84" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#34d399">EPSG:32719 UTM 19S</text>

                <text x="16" y="110" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Fórmulas Snyder (1987)</text>
                <text x="26" y="128" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Transversa de Mercator</text>

                <text x="16" y="154" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Áreas Euclidianas</text>
                <text x="26" y="172" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Superficies en m², ha y km²</text>

                <text x="16" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Densidades Territoriales</text>
                <text x="26" y="216" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Concentración elem / km²</text>

                <rect x="14" y="232" width="192" height="22" rx="6" fill="#1e293b"/>
                <text x="22" y="247" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#34d399">Norma Oficial IGM Chile</text>
              </g>

              <line x1="496" y1="155" x2="522" y2="155" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-1)"/>

              <!-- NODO 3: CALIDAD & AUDITORÍA -->
              <g transform="translate(526, 22)">
                <rect width="220" height="265" rx="12" fill="#0d1829" stroke="#f59e0b" stroke-width="2"/>
                <rect width="220" height="42" rx="12" fill="#3b2909"/>
                <rect y="30" width="220" height="12" fill="#3b2909"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#fbbf24">03. CALIDAD ISO 19157</text>

                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• ohsome API v1 y v2-rc</text>
                <text x="26" y="84" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Series históricas OSHDB</text>

                <text x="16" y="110" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• ohsome Quality (OQT)</text>
                <text x="26" y="128" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Índice madurez y saturación</text>

                <text x="16" y="154" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• OSM Changesets / OSMCha</text>
                <text x="26" y="172" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Auditoría forense de cambios</text>

                <text x="16" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Darwin Core Quality</text>
                <text x="26" y="216" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Banderas calidad biológica</text>

                <rect x="14" y="232" width="192" height="22" rx="6" fill="#1e293b"/>
                <text x="22" y="247" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#fbbf24">HeiGIT / ISO 19157 / GBIF</text>
              </g>

              <line x1="750" y1="155" x2="776" y2="155" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-1)"/>

              <!-- NODO 4: SALIDAS INTEROPERABLES -->
              <g transform="translate(780, 22)">
                <rect width="220" height="265" rx="12" fill="#0d1829" stroke="#a855f7" stroke-width="2"/>
                <rect width="220" height="42" rx="12" fill="#2d1345"/>
                <rect y="30" width="220" height="12" fill="#2d1345"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#c084fc">04. DISTRIBUCIÓN</text>

                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Visor Cartográfico Web</text>
                <text x="26" y="84" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Leaflet 1.9.4 + 208 capas</text>

                <text x="16" y="110" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• GeoJSON / PostGIS</text>
                <text x="26" y="128" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Esquema 14 atributos QGIS</text>

                <text x="16" y="154" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• ISO 19139 XML (IDE)</text>
                <text x="26" y="172" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Metadatos para GeoNetwork</text>

                <text x="16" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">• Catálogos Excel (.xlsx)</text>
                <text x="26" y="216" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Glosario 134 descriptores</text>

                <rect x="14" y="232" width="192" height="22" rx="6" fill="#1e293b"/>
                <text x="22" y="247" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#c084fc">CC BY-SA / ODbL / AGPLv3</text>
              </g>
            </svg>
          </div>
          <div class="doc-diagrama-epigrafe">Esquema general del flujo de datos: desde la extracción colaborativa en WGS 84 hasta la reproyección métrica oficial y la entrega de productos estandarizados según normas ISO.</div>
        </div>
      </section>

      <!-- ======================================================================
           SECCIÓN 02: GUÍA DE MÓDULOS DEL SISTEMA
           ====================================================================== -->
      <section id="doc-modulos" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 02 / Componentes</span>
          <h2>Guía Paso a Paso de los 9 Módulos del Sistema (00 al 08)</h2>
          <p class="doc-lead">
            La plataforma se organiza en 9 herramientas especializadas y complementarias. Cada tarjeta sintetiza su propósito territorial, insumos de entrada, productos entregables y botón de navegación directa:
          </p>
        </header>

        <div class="doc-modulos-grid">

          <div class="doc-modulo-card" data-modulo="00">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">🗺️</span>
                <span class="doc-mod-num">00</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Visor y Atlas Cartográfico VGI Interactivo</h4>
                <span class="doc-mod-tech-tag">Leaflet 1.9.4 · PostGIS 3.3 · WMS</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Visualizador geoespacial interactivo de alta resolución basado en <strong>Leaflet 1.9.4</strong>. Permite explorar, filtrar y superponer la cartografía territorial de Barrio Brasil y el campus de la Universidad Alberto Hurtado con alta velocidad, contraste óptimo (WCAG AAA) y herramientas interactivas (Dibujar Bbox, selector de territorios, exportación a QGIS).</p>
              <p class="doc-mod-det"><strong>Catálogo Oficial de 107 Capas del Estado e Inspector Normativo:</strong> Organizado en 6 macro-grupos temáticos en acordeones colapsables interactivos (Normativa IPT, Medio Ambiente, Vulnerabilidad RSH, Equipamiento y Patrimonio, Seguridad, Movilidad y Economía). Incluye el <strong>Inspector Normativo CIN-VGI</strong> (auditoría en 1 clic de zonificación PRC Santiago, OGUC y descarga de certificado técnico con advertencia legal Art. 116 LGUC), el <strong>Importador Multi-formato</strong> (KMZ en memoria con JSZip, KML, GeoJSON, GPX, CSV) y el conector a la <strong>Base de Datos Espacial PostgreSQL 17 + PostGIS 3.3 en Supabase</strong> con 129.262 entidades vectorizadas indexadas con GIST.</p>
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Renderizado de capas vectoriales, popups con atributos oficiales y citas APA 7ª ed., consultas espaciales en milisegundos por RPC PostGIS, teselas WMS GetMap y descarga directa GeoJSON para SIG.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('inicio')" title="Abrir y explorar el módulo 00 en la plataforma">
                Abrir Módulo 00 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="01">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">⚡</span>
                <span class="doc-mod-num">01</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Consultas y Explorador Overpass QL</h4>
                <span class="doc-mod-tech-tag">Overpass API v0.7 · Taginfo API</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Interfaz bidireccional que conecta directamente con la API Overpass. Incluye un <em>Constructor Guiado</em> con menús desplegables para principiantes y un <em>Editor Overpass QL libre</em> con resaltado de sintaxis para analistas avanzados. Permite filtrar por tipo geométrico (nodos, vías, relaciones) y atributos como nombre, accesibilidad para silla de ruedas u operador institucional.</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">GeoJSON procesado en vivo, tabla de atributos exportable a CSV y representación gráfica en el mapa.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('osm')" title="Abrir y explorar el módulo 01 en la plataforma">
                Abrir Módulo 01 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="02">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">📊</span>
                <span class="doc-mod-num">02</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Control de Calidad, Topología e Índice WLC v2.0 (ISO 19157 / HeiGIT / OSMCha)</h4>
                <span class="doc-mod-tech-tag">WLC v2.0 · ISO 19157 · ISO 19115 · OGC SFA · HeiGIT ohsome · OSMCha</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Evaluador universal de calidad espacial y consistencia topológica OGC para datos vectoriales internos y externos. Implementa el modelo de Combinación Lineal Ponderada (WLC v2.0) con criterios diferenciados de beneficio y costo y normalización Min-Max (Malczewski 1999; Voogd 1983; Eastman 1999). Audita auto-intersecciones (kinks), anillos abiertos, slivers y completitud tabular, combinando métricas cronológicas históricas (ohsome API / HeiGIT) y supervisión comunitaria de changesets territoriales (OSMCha).</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Certificado JSON de Calidad ISO 19157, Matriz Multicriterio WLC v2.0 (.csv), semáforo cartográfico interactivo de entidades conformes y defectuosas, y gráficos temporales de evolución urbana.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('calidad')" title="Abrir y explorar el módulo 02 en la plataforma">
                Abrir Módulo 02 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="03">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">🌿</span>
                <span class="doc-mod-num">03</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Biodiversidad Urbana (GBIF Occurrence API)</h4>
                <span class="doc-mod-tech-tag">GBIF Occurrence API · Darwin Core TDWG</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Cosecha en tiempo real registros de ciencia ciudadana biológica (iNaturalist, eBird) dentro del área urbana central. Aplica el estándar Darwin Core (TDWG) para catalogar especies de flora, avifauna urbana (tencas, zorzales, chercanes) e insectos polinizadores asociados al arbolado de plazas y calles.</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Capa de puntos con taxonomía biológica verificada y fotografías comunitarias de las especies.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('gbif')" title="Abrir y explorar el módulo 03 en la plataforma">
                Abrir Módulo 03 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="04">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">🤝</span>
                <span class="doc-mod-num">04</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Cartografía Colaborativa UMap</h4>
                <span class="doc-mod-tech-tag">UMap OSM Francia · GeoJSON</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Integración de mapas comunitarios elaborados por colectivos territoriales, asambleas barriales y estudiantes en la plataforma abierta UMap de OpenStreetMap Francia. Demuestra la apropiación social del mapa y la geografía comunitaria.</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Visor embebido en iframe de alta definición con enlaces al proyecto cartográfico matriz.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('umap')" title="Abrir y explorar el módulo 04 en la plataforma">
                Abrir Módulo 04 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="05">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">📋</span>
                <span class="doc-mod-num">05</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Generador de Metadatos ISO 19115 / ISO 19139 (IDE Chile)</h4>
                <span class="doc-mod-tech-tag">ISO 19115-1 · ISO 19139 XML · IDE Chile</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Motor de autocarga reactiva de metadatos espaciales. Estandariza el título, resumen, categoría temática (MD_TopicCategoryCode), sistema geodésico, linaje de procesamiento y extensión geográfica con la superficie territorial calculada bajo EPSG:32719 UTM 19S.</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Ficha visual formateada, descarga de metadatos en JSON (ISO 19115) y archivo XML (ISO 19139) listo para interoperar con catálogos oficiales GeoNetwork y GeoNode.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('metadatos')" title="Abrir y explorar el módulo 05 en la plataforma">
                Abrir Módulo 05 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="06">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">📖</span>
                <span class="doc-mod-num">06</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Diccionario Territorial y Atributos Normalizados</h4>
                <span class="doc-mod-tech-tag">134 Descriptores · Catálogo Objetos Chile</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Glosario ontológico interactivo que traduce las claves y valores en inglés de OpenStreetMap a conceptos formales de la gestión territorial chilena, vinculándolos con las contrapartes estatales y el Catálogo de Objetos Geográficos de Chile v3.0 (IDE Chile / SNIT).</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">10 tarjetas interactivas de macro-categorías (CAT-01 a CAT-10) con filtrado en vivo y enlaces al manual, catálogo depurado de 134 descriptores territoriales (48 oficiales IDE vs. 86 brechas VGI comunitarias) y 14 atributos normalizados.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('diccionario')" title="Abrir y explorar el módulo 06 en la plataforma">
                Abrir Módulo 06 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="07">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">⚖️</span>
                <span class="doc-mod-num">07</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Catálogos Oficiales en Excel (.xlsx) y Licencias</h4>
                <span class="doc-mod-tech-tag">OpenXML .xlsx · CC BY-SA 4.0 · ODbL · AGPLv3</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Centro de descarga institucional de las tres hojas de cálculo OpenXML (.xlsx) elaboradas para el Atlas de Información Geográfica Voluntaria, junto con la especificación del marco jurídico abierto (CC BY-SA 4.0, ODbL 1.0 y GNU AGPL-3.0).</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Descargas directas de <code>catalogo_fuentes_vgi.xlsx</code>, <code>perfil_metadatos_vgi.xlsx</code> y <code>categorias_tematicas_osm.xlsx</code>.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('licencias')" title="Abrir y explorar el módulo 07 en la plataforma">
                Abrir Módulo 07 ↗
              </button>
            </div>
          </div>

          <div class="doc-modulo-card" data-modulo="08">
            <div class="doc-mod-header">
              <div class="doc-mod-num-badge">
                <span class="doc-mod-icono">📚</span>
                <span class="doc-mod-num">08</span>
              </div>
              <div class="doc-mod-titulos">
                <h4 class="doc-mod-titulo">Manual de Uso y Documentación Territorial</h4>
                <span class="doc-mod-tech-tag">Documentación Técnica In-App · 125 Fuentes APA</span>
              </div>
            </div>
            <div class="doc-mod-body">
              <p class="doc-mod-desc">Compendio exhaustivo de documentación técnica y metodológica con 8 secciones temáticas integradas in-app, diagramas SVG interactivos de arquitectura y fórmulas geodésicas, catálogo detallado de macro-categorías (CAT-01 a CAT-10), glosario de términos VGI y 104 citas bibliográficas en formato APA 7ª edición.</p>
              
              <div class="doc-mod-salidas">
                <strong class="doc-mod-salidas-rotulo">📤 Salidas y Productos:</strong>
                <span class="doc-mod-salidas-texto">Navegación hipertextual interna, buscador temático, código Overpass QL copiable y enlaces directos a bibliografía científica.</span>
              </div>
            </div>
            <div class="doc-mod-footer">
              <button type="button" class="doc-btn-ir-modulo" onclick="ModuloManual.irAPanel('manual')" title="Abrir y explorar el módulo 08 en la plataforma">
                Abrir Módulo 08 ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================================
           SECCIÓN 03: CATÁLOGO EXHAUSTIVO DE LAS 10 MACRO-CATEGORÍAS
           ====================================================================== -->
      <section id="doc-categorias" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 03 / Taxonomía Territorial</span>
          <h2>Guía Exhaustiva de las 10 Macro-Categorías (CAT-01 a CAT-10)</h2>
          <p class="doc-lead">
            Desglose socioterritorial, normativo y técnico de las 10 macro-categorías del Atlas. Seleccione una categoría para aislarla o consulte su ficha técnica completa y sintaxis Overpass QL reproducible:
          </p>
        </header>

        <!-- Barra interactiva de selección de categoría -->
        <div class="doc-cat-toolbar">
          <div class="doc-cat-tabs-scroll">
            <button type="button" class="doc-cat-tab-btn activo" data-cat="todas" onclick="ModuloManual.filtrarCategoria('todas')">Todas (10)</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-01" onclick="ModuloManual.filtrarCategoria('manual-cat-01')">🏫 CAT-01</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-02" onclick="ModuloManual.filtrarCategoria('manual-cat-02')">🏬 CAT-02</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-03" onclick="ModuloManual.filtrarCategoria('manual-cat-03')">🚆 CAT-03</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-04" onclick="ModuloManual.filtrarCategoria('manual-cat-04')">🚲 CAT-04</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-05" onclick="ModuloManual.filtrarCategoria('manual-cat-05')">🌲 CAT-05</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-06" onclick="ModuloManual.filtrarCategoria('manual-cat-06')">🏛️ CAT-06</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-07" onclick="ModuloManual.filtrarCategoria('manual-cat-07')">🦯 CAT-07</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-08" onclick="ModuloManual.filtrarCategoria('manual-cat-08')">☘ CAT-08</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-09" onclick="ModuloManual.filtrarCategoria('manual-cat-09')">🏙 CAT-09</button>
            <button type="button" class="doc-cat-tab-btn" data-cat="manual-cat-10" onclick="ModuloManual.filtrarCategoria('manual-cat-10')">▧ CAT-10</button>
          </div>
          <div class="doc-cat-acciones">
            <button type="button" class="doc-btn-mini" onclick="ModuloManual.expandirCategorias(true)" title="Expandir todas las categorías">▼ Expandir Todas</button>
            <button type="button" class="doc-btn-mini" onclick="ModuloManual.expandirCategorias(false)" title="Colapsar todas las categorías">▲ Colapsar Todas</button>
          </div>
        </div>

        <div class="doc-fichas-categorias">

          <!-- CAT-01: EDUCACIÓN Y UNIVERSIDAD -->
          <details class="doc-cat-acordeon" id="manual-cat-01" open style="--cat-color: #06b6d4;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #06b6d422; color: #06b6d4; border-color: #06b6d4;">
                  <span class="doc-cat-icono">🏫</span> CAT-01
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Educación y Universidad</h3>
                  <span class="doc-cat-sub">Educación superior, campus universitarios, liceos tradicionales, colegios, jardines infantiles y bibliotecas</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Educación</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Barrio Brasil y su entorno albergan un polo de convergencia académica y estudiantil de alcance metropolitano articulado en torno al Campus Patrimonial de la Universidad Alberto Hurtado (UAH), conviviendo armónicamente con establecimientos educacionales emblemáticos (Liceo de Aplicación), colegios de formación general, salas cuna de la red JUNJI/Integra y centros de documentación. Esta categoría modela los flujos cotidianos de la población flotante estudiantil, la accesibilidad al equipamiento docente y el dinamismo cívico generado por la vida universitaria.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">MINEDUC / Subsecretaría de Educación Superior / JUNJI / Fundación Integra.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Directorio Oficial de Establecimientos (MINEDUC); Estándares de Infraestructura Parvularia (JUNJI); Ley N° 21.091 sobre Educación Superior.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-01</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
(
  nwr["amenity"~"university|college|library|school|kindergarten"]({{bbox}});
  nwr["building"~"university|school|college|kindergarten|library"]({{bbox}});
);
out body;
&gt;;
out skel qt;</code></pre>
              </div>
            </div>
          </details>

          <!-- CAT-02: SERVICIOS, COMERCIO Y SALUD BARRIAL -->
          <details class="doc-cat-acordeon" id="manual-cat-02" open style="--cat-color: #f59e0b;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #f59e0b22; color: #f59e0b; border-color: #f59e0b;">
                  <span class="doc-cat-icono">🏬</span> CAT-02
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Servicios, Comercio y Salud Barrial</h3>
                  <span class="doc-cat-sub">Comercio de proximidad, almacenes, gastronomía, ferias libres, farmacias, centros de salud (APS) y servicios cívicos</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Comercio & Salud</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Estructura la vitalidad socioeconómica y los servicios de cuidado indispensables para la vida de barrio bajo el paradigma de la ciudad de 15 minutos. Consolida la oferta de abastecimiento cotidiano (almacenes tradicionales, panaderías, ferias libres, locales gastronómicos en torno a Plaza Brasil), la red de salud primaria y urgencia (CESFAM, postas, farmacias comunitarias) y los servicios institucionales (sucursales bancarias, notarías, correos y comisarías), asegurando cobertura y autonomía funcional para residentes y transeúntes.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">MINSAL / SEREMI de Salud RM / SERCOTEC / Municipalidad de Santiago / Carabineros de Chile.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Modelo de Atención Integral de Salud Familiar y Comunitaria (MINSAL); Ley de Rentas Municipales (D.L. 3.063); D.S. N° 469/1993 de Establecimientos de Salud.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-02</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-03: MOVILIDAD Y TRANSPORTE PÚBLICO -->
          <details class="doc-cat-acordeon" id="manual-cat-03" open style="--cat-color: #10b981;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #10b98122; color: #10b981; border-color: #10b981;">
                  <span class="doc-cat-icono">🚆</span> CAT-03
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Movilidad y Transporte Público</h3>
                  <span class="doc-cat-sub">Transporte público integrado, paraderos Red Movilidad, estaciones de Metro y ejes viales troncales</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Transporte</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Barrio Brasil constituye una zona de alta fricción espacial y convergencia metropolitana delimitada por ejes estructurantes de primer orden (Alameda Bernardo O'Higgins, Av. Brasil, Manuel Rodríguez y Matucana). Esta categoría evalúa la distribución territorial y densidad de la infraestructura del sistema integrado de transporte, tiempos de caminata a puntos de embarque, confort en paraderos y la transferencia intermodal entre servicios troncales de buses y la red subterránea.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">MTT / Directorio de Transporte Público Metropolitano (DTPM) / Metro de Santiago S.A.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Manual de Normas Técnicas para Paraderos Red Movilidad (DTPM, 2023); Manual de Vialidad Urbana (REDEVU / MINVU).</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-03</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-04: MOVILIDAD ACTIVA Y CICLOVÍAS -->
          <details class="doc-cat-acordeon" id="manual-cat-04" open style="--cat-color: #22c55e;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #22c55e22; color: #22c55e; border-color: #22c55e;">
                  <span class="doc-cat-icono">🚲</span> CAT-04
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Movilidad Activa y Ciclovías</h3>
                  <span class="doc-cat-sub">Red de ciclovías segregadas, sendas peatonales, estacionamientos para ciclos y talleres comunitarios</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Ciclovías</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Promueve la movilidad sostenible no motorizada y la pacificación del tráfico rodado en el damero barrial. Cataloga el estado físico, perfil geométrico, tipo de segregación vial y continuidad de las vías para ciclos en calles históricas, cuantificando la dotación de estacionamientos seguros para bicicletas (bicicleteros públicos y universitarios) y la conectividad con la red central de ciclovías de la comuna de Santiago.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">MTT / SECTRA / SERVIU Metropolitano / Municipalidad de Santiago.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Manual de Vialidad del Ciclo (MINVU / MTT, 2015); Ley de Convivencia Vial (Ley N° 21.088); D.S. N° 102/2019 MTT.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-04</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-05: ÁREAS VERDES, DEPORTE Y ESPACIO PÚBLICO -->
          <details class="doc-cat-acordeon" id="manual-cat-05" open style="--cat-color: #14b8a6;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #14b8a622; color: #14b8a6; border-color: #14b8a6;">
                  <span class="doc-cat-icono">🌲</span> CAT-05
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Áreas Verdes, Deporte y Espacio Público</h3>
                  <span class="doc-cat-sub">Plazas públicas, plazoletas, canchas deportivas, juegos infantiles y mobiliario urbano de descanso</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Áreas Verdes</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Cuantifica y diagnostica la dotación superficial y calidad del espacio público recreativo abierto a la ciudadanía. Permite verificar los estándares de superficie verde por habitante (m²/hab) recomendados por el CNDU y la OMS, registrar el equipamiento lúdico y deportivo (canchas multiuso, máquinas de ejercicios) y monitorear el mobiliario de descanso y permanencia (bancas, bebederos públicos e iluminación) que fomentan la vida comunitaria barrial.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">MINVU / Parque Metropolitano (PARQUEMET) / IND / Municipalidad de Santiago.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Política Nacional de Parques Urbanos (MINVU, 2021); Estándares Urbanos Indicativos de Áreas Verdes (CNDU, 2018); OGUC Art. 2.2.4.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-05</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-06: PATRIMONIO HISTÓRICO Y CULTURA -->
          <details class="doc-cat-acordeon" id="manual-cat-06" open style="--cat-color: #eab308;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #eab30822; color: #eab308; border-color: #eab308;">
                  <span class="doc-cat-icono">🏛️</span> CAT-06
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Patrimonio Histórico y Cultura</h3>
                  <span class="doc-cat-sub">Monumentos Históricos, Zonas Típicas, cités tradicionales, basílicas, museos, teatros y centros culturales</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Patrimonio</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Barrio Brasil posee una trascendental jerarquía histórica declarada formalmente como Zona Típica por el Consejo de Monumentos Nacionales (CMN). Esta categoría documenta la riqueza de la arquitectura neoclásica y modernista de fines del siglo XIX y principios del XX, las tipologías residenciales colectivas de inmenso valor sociocomunitario como los pasajes y cités, templos religiosos de protección patrimonial y los centros de difusión artística y teatral barriales.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">Servicio Nacional del Patrimonio Cultural (SERPAT) / CMN / Ministerio de las Culturas, las Artes y el Patrimonio.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Ley N° 17.288 de Monumentos Nacionales; Decreto Exento N° 126/2000 del Mineduc (Declaratoria Zona Típica Barrio Brasil); Convenio UNESCO 1972.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-06</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-07: ACCESIBILIDAD UNIVERSAL Y CAMINABILIDAD -->
          <details class="doc-cat-acordeon" id="manual-cat-07" open style="--cat-color: #38bdf8;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #38bdf822; color: #38bdf8; border-color: #38bdf8;">
                  <span class="doc-cat-icono">🦯</span> CAT-07
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Accesibilidad Universal y Caminabilidad</h3>
                  <span class="doc-cat-sub">Ruta accesible continua, rebajes de solera (vados), pavimentos podotáctiles, rampas peatonales y cruces D.S. 50</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Accesibilidad</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Eje fundamental de justicia espacial y diseño urbano inclusivo. Permite auditar en terreno el cumplimiento riguroso de la 'ruta accesible' continua estipulada por el Decreto Supremo N° 50 de MINVU (OGUC Art. 2.2.8) para personas con discapacidad visual, motriz, coches infantiles y personas mayores, registrando rebajes de acera normativos en esquinas, franjas podotáctiles de advertencia, señalética sonora en semáforos y pendientes en rampas peatonales.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">Servicio Nacional de la Discapacidad (SENADIS) / MINVU / DOM Municipalidad de Santiago.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">D.S. N° 50 OGUC Accesibilidad Universal (MINVU, 2016); Ley N° 20.422 sobre Igualdad de Oportunidades; ISO 21542:2021.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-07</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-08: BIODIVERSIDAD URBANA Y ARBOLADO -->
          <details class="doc-cat-acordeon" id="manual-cat-08" open style="--cat-color: #84cc16;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #84cc1622; color: #84cc16; border-color: #84cc16;">
                  <span class="doc-cat-icono">☘</span> CAT-08
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Biodiversidad Urbana y Arbolado</h3>
                  <span class="doc-cat-sub">Arbolado viario de alineación, especies nativas e introducidas, jardines polinizadores y mitigación de islas de calor</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Arbolado</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Caracteriza la infraestructura ecológica y la masa vegetal urbana que provee servicios ecosistémicos críticos en el centro histórico, tales como la mitigación de las islas de calor urbano (ICU), la captura de material particulado y la provisión de sombra estival para la caminabilidad. Permite inventariar especies de árboles en calzadas y patios interiores (Plátanos Orientales, Jacarandás, Peumos), evaluar su estado fitosanitario y promover corredores biológicos barriales.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">CONAF / Ministerio del Medio Ambiente (MMA) / Dirección de Medio Ambiente Municipalidad de Santiago.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Ley Marco de Cambio Climático (Ley N° 21.455); Guía de Arbolado Urbano (CONAF, 2019); Estándares de Santiago Verde.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-08</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:25];
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
          </details>

          <!-- CAT-09: EDIFICACIONES Y HUELLA URBANA (POLÍGONOS) -->
          <details class="doc-cat-acordeon" id="manual-cat-09" open style="--cat-color: #a855f7;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #a855f722; color: #a855f7; border-color: #a855f7;">
                  <span class="doc-cat-icono">🏙</span> CAT-09
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Edificaciones y Huella Urbana (Polígonos)</h3>
                  <span class="doc-cat-sub">Huellas poligonales de manzanas, edificaciones residenciales, universitarias, comerciales y cálculo métrico (EPSG:32719)</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Edificaciones</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Provee el catastro exhaustivo de la huella física y volumetría construida de Barrio Brasil y el Campus UAH. A diferencia de las capas puntuales de equipamiento, este módulo extrae las geometrías poligonales cerradas de cada edificación (manzanas, pabellones universitarios, casonas y torres residenciales), computando en tiempo real su superficie métrica en metros cuadrados (m²) y hectáreas (ha) mediante reproyección conforme a EPSG:32719 (WGS 84 / UTM Huso 19 Sur) y la fórmula de Gauss (Shoelace), permitiendo evaluar densidades y coeficientes de ocupación del suelo.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal / Fuente</div>
                  <div class="doc-spec-valor">Servicio de Impuestos Internos (SII - Catastro de Bienes Raíces 2025).</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Ley General de Urbanismo y Construcciones (LGUC); OGUC Art. 2.1.24; D.S. N° 50 MINVU; ISO 19157 (Data Quality).</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-09</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:35];
(
  way["building"]({{bbox}});
  relation["building"]({{bbox}});
);
out geom tags qt 400;</code></pre>
              </div>
            </div>
          </details>

          <!-- CAT-10: COBERTURAS Y USOS DE SUELO (POLÍGONOS Y LÍNEAS) -->
          <details class="doc-cat-acordeon" id="manual-cat-10" open style="--cat-color: #6366f1;">
            <summary class="doc-cat-summary">
              <div class="doc-cat-sum-left">
                <span class="doc-cat-badge-pill" style="background: #6366f122; color: #6366f1; border-color: #6366f1;">
                  <span class="doc-cat-icono">▧</span> CAT-10
                </span>
                <div class="doc-cat-titulares">
                  <h3 class="doc-cat-titulo">Coberturas y Usos de Suelo (Polígonos y Líneas)</h3>
                  <span class="doc-cat-sub">Zonificación funcional del suelo urbano, áreas de equipamiento, recreación y materiales de rodado vial</span>
                </div>
              </div>
              <div class="doc-cat-sum-right">
                <span class="doc-cat-grupo-tag">Usos de Suelo</span>
                <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
              </div>
            </summary>
            
            <div class="doc-cat-contenido">
              <!-- Bloque 1: Función Territorial -->
              <div class="doc-cat-bloque-funcion">
                <div class="doc-bloque-rotulo">
                  <span class="doc-bloque-icono">📌</span>
                  <strong>Función en la Gestión Territorial Barrial:</strong>
                </div>
                <p class="doc-bloque-texto">Caracteriza la distribución espacial de los usos del territorio (residencial, comercial, institucional y recreativo) y la materialidad superficial de la trama urbana (asfalto, adoquines patrimoniales y cubiertas vegetales). Facilita el contraste empírico entre la zonificación normativa del Plan Regulador Comunal (PRC) de Santiago y las funciones territoriales reales mapeadas colaborativamente por la comunidad.</p>
              </div>

              <!-- Bloque 2: Ficha Técnica Institucional y Normativa -->
              <div class="doc-cat-specs-grid">
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">🏛️ Contraparte Estatal</div>
                  <div class="doc-spec-valor">MINVU (División de Desarrollo Urbano) / Dirección de Obras Municipales (DOM) / Dirección de Vialidad MOP.</div>
                </div>
                <div class="doc-spec-caja">
                  <div class="doc-spec-rotulo">📜 Norma / Estándar Legal</div>
                  <div class="doc-spec-valor">Plan Regulador Comunal de Santiago (PRC); Ley N° 21.074 de Fortalecimiento de la Regionalización; OGC Land and Infrastructure Standards.</div>
                </div>
              </div>

              <!-- Bloque 3: Consola Overpass QL -->
              <div class="doc-terminal-wrapper">
                <div class="doc-terminal-header">
                  <div class="doc-terminal-dots">
                    <span class="doc-dot doc-dot-rojo"></span>
                    <span class="doc-dot doc-dot-amarillo"></span>
                    <span class="doc-dot doc-dot-verde"></span>
                    <span class="doc-terminal-title">Overpass QL · Sintaxis Reproducible CAT-10</span>
                  </div>
                  <button type="button" class="doc-btn-copiar" onclick="ModuloManual.copiarCodigo(this)" title="Copiar consulta Overpass QL al portapapeles">
                    <span class="doc-copiar-icono">📋</span> Copiar QL
                  </button>
                </div>
                <pre class="doc-terminal-code"><code>[out:json][timeout:35];
(
  nwr["landuse"]({{bbox}});
  nwr["natural"~"wood|scrub|water|grassland|tree_row"]({{bbox}});
  nwr["leisure"~"park|garden|pitch|nature_reserve"]({{bbox}});
  way["surface"~"asphalt|paving_stones|cobblestone"]({{bbox}});
);
out geom tags qt 400;</code></pre>
              </div>
            </div>
          </details>
        </div>
      </section>

      <!-- ======================================================================
           SECCIÓN 04: GEODESIA CONFORME EPSG:32719
           ====================================================================== -->
      <section id="doc-geodesia" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 04 / Geodesia & Métricas</span>
          <h2>Reproyección Conforme EPSG:32719 y Cálculo de Superficies Métricas</h2>
          <p class="doc-lead">
            Uno de los errores más extendidos en la cartografía web comercial es calcular áreas multiplicando grados angulares. El Atlas implementa un motor geodésico riguroso conforme a la geodesia física oficial de Chile (IGM / IDE Chile).
          </p>
        </header>

        <div class="doc-grid-geodesico">
          <div class="doc-tarjeta-geodesica">
            <div class="doc-geo-header">
              <span class="doc-geo-badge">SISTEMAS DE REFERENCIA</span>
              <h4>Comparación: Coordenadas Angulares vs. Proyectadas Métricas</h4>
            </div>
            <div class="doc-geo-tabla-comparativa">
              <div class="doc-geo-fila">
                <span class="doc-geo-label">Sistema Nativo GPS/OSM:</span>
                <span class="doc-geo-val"><strong>WGS 84 (EPSG:4326)</strong> · Grados decimales (°Lat, °Lon)</span>
              </div>
              <div class="doc-geo-fila">
                <span class="doc-geo-label">Sistema Oficial Chile:</span>
                <span class="doc-geo-val"><strong>UTM Huso 19 Sur (EPSG:32719)</strong> · Metros proyectados (E, N)</span>
              </div>
              <div class="doc-geo-fila">
                <span class="doc-geo-label">Distorsión en Santiago:</span>
                <span class="doc-geo-val error-color">~30% de error en área métrica si no se proyecta con elipsoide</span>
              </div>
            </div>
            <p class="doc-geo-explicacion">
              A la latitud de Santiago (-33.44° S), un grado de longitud equivale a aproximadamente <strong>92.8 km</strong>, mientras que un grado de latitud mide <strong>110.9 km</strong>. Multiplicar grados decimales asumiendo una esfera produce un error inaceptable para la gestión municipal y el cálculo de áreas verdes por habitante.
            </p>
          </div>

          <div class="doc-tarjeta-geodesica">
            <div class="doc-geo-header">
              <span class="doc-geo-badge">PARÁMETROS FÍSICOS IGM</span>
              <h4>Constantes Geodésicas Oficiales de Chile</h4>
            </div>
            <div class="doc-geo-params-grid">
              <div class="doc-param-item">
                <span class="doc-param-k">Elipsoide:</span>
                <span class="doc-param-v">WGS 84 / SIRGAS Chile</span>
              </div>
              <div class="doc-param-item">
                <span class="doc-param-k">Semieje Mayor (a):</span>
                <span class="doc-param-v">6.378.137,0 m</span>
              </div>
              <div class="doc-param-item">
                <span class="doc-param-k">Aplanamiento (1/f):</span>
                <span class="doc-param-v">298,257223563</span>
              </div>
              <div class="doc-param-item">
                <span class="doc-param-k">Meridiano Central:</span>
                <span class="doc-param-v">69° O (Huso 19)</span>
              </div>
              <div class="doc-param-item">
                <span class="doc-param-k">Falso Este:</span>
                <span class="doc-param-v">500.000 m</span>
              </div>
              <div class="doc-param-item">
                <span class="doc-param-k">Falso Norte:</span>
                <span class="doc-param-v">10.000.000 m</span>
              </div>
            </div>
            <p class="doc-geo-explicacion">
              Conforme al <strong>Decreto Supremo N° 28/2006 del Ministerio de Bienes Nacionales</strong> y las directrices técnicas del Instituto Geográfico Militar (IGM época 2016.0), el cálculo métrico en el Atlas garantiza total compatibilidad legal con el Catastro Nacional.
            </p>
          </div>
        </div>

        <div class="caja-guia-referencia" style="border-left: 6px solid var(--agua); background: var(--papel-tarjeta); padding: 22px;">
          <h4 style="margin: 0 0 10px 0; color: var(--agua); font-size: 1.1rem;">📐 Formulación Analítica de Snyder (1987) e Integración Computacional</h4>
          <p style="margin: 0; color: var(--tinta-suave); font-size: 0.94rem; line-height: 1.65;">
            El algoritmo integrado en <code>src/js/app.js</code> y <code>scripts/</code> implementa las series trigonométricas de John P. Snyder (<em>USGS Professional Paper 1395</em>). Calcula el factor de escala meridiano exacto y proyecta cada vértice poligonal al plano conforme UTM 19S antes de evaluar la fórmula de Gauss/Green, entregando superficies métricas exactas en metros cuadrados (m²), hectáreas (ha) y densidades territoriales rigurosas (elementos / km²).
          </p>
        </div>

        <!-- DIAGRAMA SVG 02: TRANSFORMACIÓN GEODÉSICA DE COORDENADAS -->
        <div class="doc-diagrama-wrapper">
          <div class="doc-diagrama-header">
            <div class="doc-diagrama-dots">
              <span class="doc-dot doc-dot-rojo"></span>
              <span class="doc-dot doc-dot-amarillo"></span>
              <span class="doc-dot doc-dot-verde"></span>
            </div>
            <span class="doc-diagrama-titulo">FIGURA 2. TRANSFORMACIÓN GEODÉSICA: DE COORDENADAS ANGULARES WGS84 A MÉTRICAS CONFORMES (UTM 19S / SNYDER)</span>
          </div>
          <div class="doc-diagrama-svg">
            <svg viewBox="0 0 1020 280" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrow-geo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="#070d18" stroke="#1e293b" stroke-width="1.5" rx="8"/>

              <!-- PASO 1: WGS84 -->
              <g transform="translate(20, 20)">
                <rect width="220" height="240" rx="12" fill="#0d1829" stroke="#0ea5e9" stroke-width="2"/>
                <rect width="220" height="40" rx="12" fill="#0c4a6e"/>
                <rect y="28" width="220" height="12" fill="#0c4a6e"/>
                <text x="16" y="26" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#38bdf8">01. WGS 84 (EPSG:4326)</text>

                <text x="16" y="64" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Grados Decimales (°)</text>
                <text x="24" y="80" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Coordenadas angulares GPS</text>

                <text x="16" y="104" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Distorsión Latitudinal</text>
                <text x="24" y="120" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#f87171">1° Lon = 92.8 km (Stgo)</text>
                <text x="24" y="136" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#f87171">1° Lat = 110.9 km</text>

                <text x="16" y="160" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Inconsistencia Métrica</text>
                <text x="24" y="176" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Error en área euclidiana ~30%</text>

                <rect x="14" y="198" width="192" height="24" rx="6" fill="#1e293b"/>
                <text x="22" y="214" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#38bdf8">Entrada Nativa OSM / GPS</text>
              </g>

              <line x1="246" y1="140" x2="276" y2="140" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-geo)"/>

              <!-- PASO 2: SNYDER -->
              <g transform="translate(282, 20)">
                <rect width="220" height="240" rx="12" fill="#0d1829" stroke="#f59e0b" stroke-width="2"/>
                <rect width="220" height="40" rx="12" fill="#451a03"/>
                <rect y="28" width="220" height="12" fill="#451a03"/>
                <text x="16" y="26" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#fbbf24">02. MODELO DE SNYDER</text>

                <text x="16" y="64" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• USGS Paper 1395</text>
                <text x="24" y="80" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Formulación analítica (1987)</text>

                <text x="16" y="104" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Parámetros Elipsoide</text>
                <text x="24" y="120" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">a = 6.378.137 m (GRS80)</text>
                <text x="24" y="136" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">1/f = 298.257223563</text>

                <text x="16" y="160" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Factor Escala Meridiano</text>
                <text x="24" y="176" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">k₀ = 0.9996 (UTM)</text>

                <rect x="14" y="198" width="192" height="24" rx="6" fill="#1e293b"/>
                <text x="22" y="214" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#fbbf24">Motor Geodésico JS / Python</text>
              </g>

              <line x1="508" y1="140" x2="538" y2="140" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-geo)"/>

              <!-- PASO 3: UTM 19S -->
              <g transform="translate(544, 20)">
                <rect width="220" height="240" rx="12" fill="#0d1829" stroke="#10b981" stroke-width="2"/>
                <rect width="220" height="40" rx="12" fill="#064e3b"/>
                <rect y="28" width="220" height="12" fill="#064e3b"/>
                <text x="16" y="26" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#34d399">03. UTM 19S (EPSG:32719)</text>

                <text x="16" y="64" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Proyección Conforme</text>
                <text x="24" y="80" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Transversa de Mercator</text>

                <text x="16" y="104" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Coordenadas Planas</text>
                <text x="24" y="120" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Este (X) y Norte (Y) en metros</text>
                <text x="24" y="136" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Meridiano Central 69° O</text>

                <text x="16" y="160" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Marco Legal Chileno</text>
                <text x="24" y="176" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">D.S. N° 28/2006 MBN / IGM</text>

                <rect x="14" y="198" width="192" height="24" rx="6" fill="#1e293b"/>
                <text x="22" y="214" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#34d399">Norma Oficial IGM Chile</text>
              </g>

              <line x1="770" y1="140" x2="800" y2="140" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-geo)"/>

              <!-- PASO 4: MÉTRICAS -->
              <g transform="translate(806, 20)">
                <rect width="194" height="240" rx="12" fill="#0d1829" stroke="#a855f7" stroke-width="2"/>
                <rect width="194" height="40" rx="12" fill="#2e1065"/>
                <rect y="28" width="194" height="12" fill="#2e1065"/>
                <text x="14" y="26" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#c084fc">04. ÁREA & DENSIDAD</text>

                <text x="14" y="64" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Integración Gauss</text>
                <text x="22" y="80" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Teorema de Green en polígonos</text>

                <text x="14" y="104" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Superficies Exactas</text>
                <text x="22" y="120" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#c084fc">Metros cuadrados (m²)</text>
                <text x="22" y="136" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#c084fc">Hectáreas reales (ha)</text>

                <text x="14" y="160" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Densidad Espacial</text>
                <text x="22" y="176" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Elementos por km² barrial</text>

                <rect x="12" y="198" width="170" height="24" rx="6" fill="#1e293b"/>
                <text x="18" y="214" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#c084fc">Catastro Municipal & Minvu</text>
              </g>
            </svg>
          </div>
          <div class="doc-diagrama-epigrafe">Secuencia de reproyección analítica: desde el datum angular global WGS 84 hasta la proyección conforme plana UTM Huso 19 Sur, garantizando el cálculo riguroso de superficies y densidades para la gestión territorial.</div>
        </div>
      </section>

      <!-- ======================================================================
           SECCIÓN 05: CONTROL DE CALIDAD ISO 19157
           ====================================================================== -->
      <section id="doc-calidad" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 05 / Calidad de Datos</span>
          <h2>Evaluación Cuantitativa de Calidad Espacial (ISO 19157 & ohsome)</h2>
          <p class="doc-lead">
            Una crítica habitual a la información voluntaria es la incertidumbre sobre su fiabilidad. El Atlas responde implementando auditorías cuantitativas en tiempo real basadas en la norma técnica internacional <strong>ISO 19157:2013 (Data Quality)</strong>.
          </p>
        </header>

        <div class="doc-tabla-wrapper">
          <table class="doc-tabla-calidad">
            <thead>
              <tr>
                <th>Dimensión ISO 19157</th>
                <th>Definición Metodológica</th>
                <th>Métrica Calculada en el Atlas</th>
                <th>API y Motor de Cálculo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="doc-badge-dim dim-completitud">Completitud (Completeness)</span></td>
                <td>Presencia o ausencia de objetos territoriales respecto a la realidad física de Barrio Brasil.</td>
                <td>Recuento exhaustivo de geometrías (nodos, vías, relaciones) dentro del Bbox delimitado.</td>
                <td><code>ohsome API /elements/count</code></td>
              </tr>
              <tr>
                <td><span class="doc-badge-dim dim-temporal">Exactitud Temporal (Temporal Quality)</span></td>
                <td>Validez temporal de los datos cartográficos y tasa de actualización histórica en los últimos años.</td>
                <td>Series cronológicas anuales (2018 al presente) mostrando la evolución de mapeo.</td>
                <td><code>ohsome API (time series P1Y)</code></td>
              </tr>
              <tr>
                <td><span class="doc-badge-dim dim-densidad">Densidad Espacial (Spatial Density)</span></td>
                <td>Concentración métrica de equipamientos y servicios por unidad de superficie barrial.</td>
                <td>Cantidad de entidades territoriales por kilómetro cuadrado (obj / km²).</td>
                <td>Cálculo geodésico UTM 19S (Snyder)</td>
              </tr>
              <tr>
                <td><span class="doc-badge-dim dim-linaje">Linaje y Masa Crítica (Lineage)</span></td>
                <td>Reputación colectiva y validación cruzada basada en la diversidad de editores independientes.</td>
                <td>Recuento de colaboradores únicos (OSM user IDs) que han editado en el polígono.</td>
                <td><code>ohsome API /users/count</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="caja-guia-referencia" style="border-left: 6px solid var(--esmeralda); background: var(--papel-tarjeta); padding: 22px;">
          <h4 style="margin: 0 0 10px 0; color: var(--esmeralda); font-size: 1.1rem;">🛡️ Resiliencia Arquitectónica: Soporte Dual ohsome v1 (OSHDB) y v2 (ohsomeDB)</h4>
          <p style="margin: 0; color: var(--tinta-suave); font-size: 0.94rem; line-height: 1.65;">
            El Atlas implementa una función serverless en Netlify (<code>/api/calidad</code>) y un backend local en Python (<code>backend/servidor_vgi.py</code>) con almacenamiento en caché local. Si la API v2 de HeiGIT experimenta saturación o requiere autorización privada, el conmutador conmuta automáticamente y sin errores a la API v1 pública (OSHDB), garantizando una experiencia fluida e ininterrumpida.
          </p>
        </div>
      </section>

      <!-- ======================================================================
           SECCIÓN 06: GOBERNANZA, LICENCIAS Y GIT POR PERMISO
           ====================================================================== -->
      <section id="doc-gobernanza" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 06 / Marco Legal y Gobernanza</span>
          <h2>Marco Jurídico de Licenciamiento Abierto Tripartito y Gobernanza Git por Permiso</h2>
          <p class="doc-lead">
            En concordancia con la legislación chilena y los principios éticos de la geografía comunitaria, el Atlas descarta expresamente licencias comerciales permisivas y adopta un marco tripartito de reciprocidad obligatoria (copyleft).
          </p>
        </header>

        <div class="doc-grid-licencias">
          <div class="doc-tarjeta-licencia lic-documentacion">
            <div class="doc-lic-badge">PILAR 1 · DOCUMENTACIÓN Y MAPAS</div>
            <h4>CC BY-SA 4.0 Internacional</h4>
            <p class="doc-lic-desc">Creative Commons Atribución-CompartirIgual 4.0 Internacional.</p>
            <ul class="doc-lic-puntos">
              <li>✓ Atribución obligatoria a Universidad Alberto Hurtado / Nodo GeoAbierto.</li>
              <li>✓ Cláusula CompartirIgual: toda obra derivada debe ser libre bajo la misma licencia.</li>
              <li>✓ Amparado por la Ley N° 17.336 de Propiedad Intelectual de Chile.</li>
              <li>✓ Aplica al Manual de Uso, fichas de metadatos, catálogos Excel y memorias.</li>
            </ul>
          </div>

          <div class="doc-tarjeta-licencia lic-datos">
            <div class="doc-lic-badge">PILAR 2 · BASES DE DATOS ESPACIALES</div>
            <h4>ODbL 1.0 (Open Database License)</h4>
            <p class="doc-lic-desc">Licencia estándar de la OpenStreetMap Foundation (OSMF).</p>
            <ul class="doc-lic-puntos">
              <li>✓ Atribución requerida: <em>© Colaboradores de OpenStreetMap</em>.</li>
              <li>✓ Share-Alike en bases de datos derivadas y enriquecidas.</li>
              <li>✓ Compatible con Darwin Core (GBIF) e interoperable con IDE Chile.</li>
              <li>✓ Aplica a nodos, vías, relaciones vectoriales y tablas PostGIS.</li>
            </ul>
          </div>

          <div class="doc-tarjeta-licencia lic-software">
            <div class="doc-lic-badge">PILAR 3 · SOFTWARE Y ALGORITMOS</div>
            <h4>GNU AGPL-3.0 (Copyleft Fuerte)</h4>
            <p class="doc-lic-desc">GNU Affero General Public License v3.0 para aplicaciones web.</p>
            <ul class="doc-lic-puntos">
              <li>✓ Libertad total de estudio, modificación y ejecución.</li>
              <li>✓ Si se aloja en red/web, el código fuente completo debe estar a disposición pública.</li>
              <li>✓ Impide bifurcaciones comerciales privativas o cierres por terceros.</li>
              <li>✓ Transferible a municipios, ministerios y organizaciones comunitarias.</li>
            </ul>
          </div>
        </div>

        <div class="doc-caja-argumento-mit">
          <h4>⚖️ ¿Por qué se descartó la Licencia MIT?</h4>
          <p>
            La licencia MIT permite que terceros tomen el código y la cartografía comunitaria, los incorporen en plataformas cerradas privativas y restrinjan el acceso a la ciudadanía sin transferir ninguna mejora a la comunidad. En un proyecto de <strong>Información Geográfica Voluntaria desarrollado con fondos públicos en una universidad</strong>, esto vulneraría el principio de soberanía territorial de los datos abiertos.
          </p>
        </div>

        <!-- DIAGRAMA SVG 03: TRIÁNGULO DE LICENCIAS -->
        <div class="doc-diagrama-wrapper">
          <div class="doc-diagrama-header">
            <div class="doc-diagrama-dots">
              <span class="doc-dot doc-dot-rojo"></span>
              <span class="doc-dot doc-dot-amarillo"></span>
              <span class="doc-dot doc-dot-verde"></span>
            </div>
            <span class="doc-diagrama-titulo">FIGURA 3. MARCO TRIPARTITO DE LICENCIAMIENTO ABIERTO Y RECIPROCIDAD COMUNITARIA</span>
          </div>
          <div class="doc-diagrama-svg">
            <svg viewBox="0 0 1020 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#070d18" stroke="#1e293b" stroke-width="1.5" rx="8"/>

              <!-- PILAR 1: CC BY-SA 4.0 -->
              <g transform="translate(25, 20)">
                <rect width="305" height="260" rx="12" fill="#0d1829" stroke="#10b981" stroke-width="2"/>
                <rect width="305" height="42" rx="12" fill="#064e3b"/>
                <rect y="30" width="305" height="12" fill="#064e3b"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#34d399">PILAR 1 · DOCUMENTACIÓN Y MAPAS</text>

                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="13.5" font-weight="800" fill="#f8fafc">CC BY-SA 4.0 Internacional</text>

                <text x="16" y="96" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Atribución Obligatoria UAH</text>
                <text x="26" y="114" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Crédito a UAH / Nodo GeoAbierto</text>

                <text x="16" y="138" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Cláusula CompartirIgual</text>
                <text x="26" y="156" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Obras derivadas bajo idéntica licencia</text>

                <text x="16" y="180" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Marco Legal Chileno</text>
                <text x="26" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Ley N° 17.336 (Prop. Intelectual)</text>

                <rect x="14" y="222" width="277" height="24" rx="6" fill="#1e293b"/>
                <text x="20" y="238" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#34d399">Manual · Metadatos · Excel</text>
              </g>

              <!-- PILAR 2: ODbL 1.0 -->
              <g transform="translate(358, 20)">
                <rect width="305" height="260" rx="12" fill="#0d1829" stroke="#0ea5e9" stroke-width="2"/>
                <rect width="305" height="42" rx="12" fill="#0c4a6e"/>
                <rect y="30" width="305" height="12" fill="#0c4a6e"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#38bdf8">PILAR 2 · BASES DE DATOS ESPACIALES</text>

                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="13.5" font-weight="800" fill="#f8fafc">ODbL 1.0 (Open Database License)</text>

                <text x="16" y="96" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Estándar OSM Foundation</text>
                <text x="26" y="114" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">© Colaboradores de OpenStreetMap</text>

                <text x="16" y="138" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Share-Alike en Bases Derivadas</text>
                <text x="26" y="156" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Reciprocidad en tablas espaciales</text>

                <text x="16" y="180" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Interoperabilidad Abierta</text>
                <text x="26" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">PostGIS + Darwin Core GBIF + IDE Chile</text>

                <rect x="14" y="222" width="277" height="24" rx="6" fill="#1e293b"/>
                <text x="20" y="238" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#38bdf8">Nodos · Vías · Relaciones</text>
              </g>

              <!-- PILAR 3: GNU AGPLv3 -->
              <g transform="translate(690, 20)">
                <rect width="305" height="260" rx="12" fill="#0d1829" stroke="#a855f7" stroke-width="2"/>
                <rect width="305" height="42" rx="12" fill="#2e1065"/>
                <rect y="30" width="305" height="12" fill="#2e1065"/>
                <text x="16" y="27" font-family="'Segoe UI', Calibri, sans-serif" font-size="13" font-weight="900" fill="#c084fc">PILAR 3 · SOFTWARE Y PLATAFORMA</text>

                <text x="16" y="66" font-family="'Segoe UI', Calibri, sans-serif" font-size="13.5" font-weight="800" fill="#f8fafc">GNU AGPLv3 (Copyleft Fuerte)</text>

                <text x="16" y="96" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Libertad de Uso y Modificación</text>
                <text x="26" y="114" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Código 100% auditable y transferible</text>

                <text x="16" y="138" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Cláusula de Red Web</text>
                <text x="26" y="156" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Si se aloja en web, código disponible</text>

                <text x="16" y="180" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">• Blindaje Antiapropiación</text>
                <text x="26" y="198" font-family="'Segoe UI', Calibri, sans-serif" font-size="11" fill="#94a3b8">Bloquea privatización de software público</text>

                <rect x="14" y="222" width="277" height="24" rx="6" fill="#1e293b"/>
                <text x="20" y="238" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold" fill="#c084fc">Frontend SPA · Leaflet · Scripts</text>
              </g>
            </svg>
          </div>
          <div class="doc-diagrama-epigrafe">La tríada de licencias abiertas garantiza la reciprocidad comunitaria: ningún actor privativo puede cerrar los datos ni el software generado con fondos públicos y aportes ciudadanos.</div>
        </div>

        <div class="doc-seccion-sub">
          <h3>Repositorio Oficial y Política de Contribución Git por Permiso</h3>
          <p>
            El código fuente, los catálogos y la documentación oficial residen en el repositorio público de GitHub:
          </p>
          <div class="doc-enlace-repo-caja">
            <span class="doc-repo-icono">📦</span>
            <div class="doc-repo-info">
              <strong>Repositorio Oficial en GitHub:</strong>
              <a href="https://github.com/GEOJOTA/atlas_vgi_uah" target="_blank" rel="noopener">https://github.com/GEOJOTA/atlas_vgi_uah ↗</a>
              <span class="doc-pequeno">Rama principal: <code>main</code> | Despliegue continuo en Netlify Edge CDN</span>
            </div>
          </div>
          <p>
            Para mantener la rigurosidad académica y la estabilidad de los catálogos sincronizados, las contribuciones externas funcionan bajo el modelo de <strong>Contribución Abierta con Revisión por Permiso (Pull Request)</strong>:
          </p>

          <!-- DIAGRAMA SVG 04: FLUJO GIT -->
          <div class="doc-diagrama-wrapper">
            <div class="doc-diagrama-header">
              <div class="doc-diagrama-dots">
                <span class="doc-dot doc-dot-rojo"></span>
                <span class="doc-dot doc-dot-amarillo"></span>
                <span class="doc-dot doc-dot-verde"></span>
              </div>
              <span class="doc-diagrama-titulo">FIGURA 4. FLUJO DE TRABAJO DE CONTRIBUCIÓN GIT CON REVISIÓN POR PERMISO</span>
            </div>
            <div class="doc-diagrama-svg">
              <svg viewBox="0 0 1020 240" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="arrow-git" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="#070d18" stroke="#1e293b" stroke-width="1.5" rx="8"/>

                <!-- PASO 1: FORK & CLONE -->
                <g transform="translate(20, 20)">
                  <rect width="220" height="200" rx="12" fill="#0d1829" stroke="#0ea5e9" stroke-width="2"/>
                  <rect width="220" height="38" rx="12" fill="#0c4a6e"/>
                  <rect y="26" width="220" height="12" fill="#0c4a6e"/>
                  <text x="14" y="25" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="900" fill="#38bdf8">1. FORK & CLONE</text>

                  <text x="14" y="60" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Copia Personal</text>
                  <text x="22" y="76" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Fork en cuenta GitHub propia</text>

                  <text x="14" y="100" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Clon Local</text>
                  <text x="22" y="116" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Entorno de desarrollo local</text>

                  <rect x="12" y="152" width="196" height="24" rx="6" fill="#1e293b"/>
                  <text x="18" y="168" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#38bdf8">git clone &lt;su-fork&gt;</text>
                </g>

                <line x1="246" y1="120" x2="276" y2="120" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-git)"/>

                <!-- PASO 2: FEATURE BRANCH -->
                <g transform="translate(282, 20)">
                  <rect width="220" height="200" rx="12" fill="#0d1829" stroke="#f59e0b" stroke-width="2"/>
                  <rect width="220" height="38" rx="12" fill="#451a03"/>
                  <rect y="26" width="220" height="12" fill="#451a03"/>
                  <text x="14" y="25" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="900" fill="#fbbf24">2. RAMA TEMÁTICA</text>

                  <text x="14" y="60" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Rama de Trabajo</text>
                  <text x="22" y="76" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Aislamiento por temática</text>

                  <text x="14" y="100" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Blindaje Main</text>
                  <text x="22" y="116" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Nunca alterar main directo</text>

                  <rect x="12" y="152" width="196" height="24" rx="6" fill="#1e293b"/>
                  <text x="18" y="168" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#fbbf24">git checkout -b feat/cat</text>
                </g>

                <line x1="508" y1="120" x2="538" y2="120" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-git)"/>

                <!-- PASO 3: PULL REQUEST -->
                <g transform="translate(544, 20)">
                  <rect width="220" height="200" rx="12" fill="#0d1829" stroke="#a855f7" stroke-width="2"/>
                  <rect width="220" height="38" rx="12" fill="#2e1065"/>
                  <rect y="26" width="220" height="12" fill="#2e1065"/>
                  <text x="14" y="25" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="900" fill="#c084fc">3. PULL REQUEST</text>

                  <text x="14" y="60" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Propuesta Formal</text>
                  <text x="22" y="76" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Envío vía GitHub con ficha</text>

                  <text x="14" y="100" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Trazabilidad y Citas</text>
                  <text x="22" y="116" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Justificación y norma APA</text>

                  <rect x="12" y="152" width="196" height="24" rx="6" fill="#1e293b"/>
                  <text x="18" y="168" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#c084fc">Auditoría Transparente</text>
                </g>

                <line x1="770" y1="120" x2="800" y2="120" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow-git)"/>

                <!-- PASO 4: REVISIÓN & MERGE -->
                <g transform="translate(806, 20)">
                  <rect width="194" height="200" rx="12" fill="#0d1829" stroke="#10b981" stroke-width="2"/>
                  <rect width="194" height="38" rx="12" fill="#064e3b"/>
                  <rect y="26" width="194" height="12" fill="#064e3b"/>
                  <text x="14" y="25" font-family="'Segoe UI', Calibri, sans-serif" font-size="12.5" font-weight="900" fill="#34d399">4. REVISIÓN & CI/CD</text>

                  <text x="14" y="60" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Aprobación UAH</text>
                  <text x="22" y="76" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Revisión del mantenedor</text>

                  <text x="14" y="100" font-family="'Segoe UI', Calibri, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">• Integración Continua</text>
                  <text x="22" y="116" font-family="'Segoe UI', Calibri, sans-serif" font-size="10.5" fill="#94a3b8">Merge a main y deploy CDN</text>

                  <rect x="12" y="152" width="170" height="24" rx="6" fill="#1e293b"/>
                  <text x="18" y="168" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#34d399">Netlify Deploy Activo</text>
                </g>
              </svg>
            </div>
            <div class="doc-diagrama-epigrafe">Cualquier colaborador o junta vecinal puede proponer mejoras o nuevas etiquetas mediante un Pull Request auditado antes de pasar automáticamente a producción.</div>
          </div>

          <div class="doc-seccion-sub" style="margin-top: 32px; border-top: 1px solid var(--borde, #1e293b); padding-top: 24px;">
            <h3>Guía Simple de Contribución y Trazabilidad para la Comunidad</h3>
            <p>
              Cualquier usuario promedio (vecinos, dirigentes sociales, estudiantes, integrantes de ONGs) puede aportar datos y mejoras al Atlas sin necesidad de conocimientos avanzados de programación:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 18px 0;">
              <div style="background: var(--fondo-tarjeta, #0f172a); border: 1px solid var(--borde, #1e293b); border-radius: 8px; padding: 18px;">
                <h4 style="color: var(--musgo, #34d399); margin-top: 0; font-size: 1.05rem;">1. Mapeo Directo en OpenStreetMap</h4>
                <p style="font-size: 0.9rem; color: var(--texto-secundario, #94a3b8); line-height: 1.5;">Edite en <a href="https://www.openstreetmap.org" target="_blank" rel="noopener">openstreetmap.org ↗</a> con el editor web visual iD. Agregue o corrija locales, veredas, arbolado o ciclovías en Barrio Brasil. Al guardar, agregue el hashtag <code>#AtlasVGI_UAH</code>. El visor del Atlas reflejará los cambios automáticamente en vivo con trazabilidad de autor y fecha.</p>
              </div>
              <div style="background: var(--fondo-tarjeta, #0f172a); border: 1px solid var(--borde, #1e293b); border-radius: 8px; padding: 18px;">
                <h4 style="color: var(--agua, #38bdf8); margin-top: 0; font-size: 1.05rem;">2. Carga Local de Archivos en el Visor</h4>
                <p style="font-size: 0.9rem; color: var(--texto-secundario, #94a3b8); line-height: 1.5;">En el Panel 00 (Visor), utilice el importador de archivos locales (.GeoJSON, .KML, .KMZ, .GPX, .CSV). Podrá contrastar sus propios levantamientos de terreno con las 109 capas oficiales y 10 VGI de forma privada y sin necesidad de instalar software SIG.</p>
              </div>
              <div style="background: var(--fondo-tarjeta, #0f172a); border: 1px solid var(--borde, #1e293b); border-radius: 8px; padding: 18px;">
                <h4 style="color: var(--ocre, #fbbf24); margin-top: 0; font-size: 1.05rem;">3. Reporte Simple vía GitHub Issues</h4>
                <p style="font-size: 0.9rem; color: var(--texto-secundario, #94a3b8); line-height: 1.5;">¿Detectó una capa desactualizada o propone una nueva fuente comunitaria? Abra un <a href="https://github.com/GEOJOTA/atlas_vgi_uah/issues" target="_blank" rel="noopener">Issue en GitHub ↗</a> indicando: Nombre de la capa, enlace/archivo, ubicación y organización responsable. El equipo mantenedor UAH la integrará.</p>
              </div>
              <div style="background: var(--fondo-tarjeta, #0f172a); border: 1px solid var(--borde, #1e293b); border-radius: 8px; padding: 18px;">
                <h4 style="color: #a855f7; margin-top: 0; font-size: 1.05rem;">4. Código Abierto, Scripts & Capas (PR)</h4>
                <p style="font-size: 0.9rem; color: var(--texto-secundario, #94a3b8); line-height: 1.5;">Desarrolladores y analistas SIG pueden aportar mediante Fork & Pull Request. Arquitectura <em>zero-build</em> en Vanilla JS (sin bundlers), CSS modular, scripts Python y PostGIS 3.3. Licencias: <strong>AGPLv3 / ODbL / CC BY-SA 4.0</strong>. Guía técnica paso a paso en <a href="https://github.com/GEOJOTA/atlas_vgi_uah/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">CONTRIBUTING.md ↗</a>.</p>
              </div>
            </div>
            <p style="font-size: 0.88rem; color: var(--texto-secundario, #94a3b8); font-style: italic;">
              Consulte la guía completa y plantillas de metadatos en el archivo <a href="https://github.com/GEOJOTA/atlas_vgi_uah/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">CONTRIBUTING.md</a> del repositorio oficial.
            </p>
          </div>
        </div>
      </section>

      <!-- ======================================================================
           SECCIÓN 07: APARATO BIBLIOGRÁFICO EXTENDIDO (125 FUENTES APA)
           ====================================================================== -->
      <section id="doc-bibliografia" class="doc-seccion">
        <header class="doc-seccion-header">
          <span class="doc-seccion-badge">Capítulo 07 / Aparato Crítico</span>
          <h2>Aparato Bibliográfico Consolidado — Corpus Científico & Atlas VGI (127 Fuentes APA 7ª ed.)</h2>
          <p class="doc-lead">
            Compendio exhaustivo de <strong>127 fuentes académicas, científicas, legales y técnicas</strong> integradas en el Atlas de Información Geográfica Voluntaria, articulando el corpus de literatura seminal y epistemológica de Geografía UAH con las normas técnicas internacionales y los marcos de gestión territorial del Estado de Chile:
          </p>
        </header>

        <!-- Barra de Búsqueda y Control de Bibliografía -->
        <div class="doc-bib-toolbar">
          <div class="doc-bib-busqueda-caja">
            <span class="doc-bib-buscar-icono">🔍</span>
            <input 
              type="search" 
              id="filtro-biblio-manual" 
              class="doc-bib-input-buscar" 
              placeholder="Buscar autor, año, concepto, revista o norma (ej: Goodchild, Haklay, ISO 19157, 2024, GBIF, MINVU)..."
              oninput="ModuloManual.filtrarBibliografia(this)"
              aria-label="Buscar en la bibliografía"
            />
          </div>
          <div class="doc-bib-acciones">
            <span id="doc-bib-contador-resultados" class="doc-bib-contador">127 fuentes indexadas</span>
            <button type="button" class="doc-btn-mini" onclick="ModuloManual.expandirBibliografia(true)" title="Expandir todas las categorías bibliográficas">▼ Expandir Todas</button>
            <button type="button" class="doc-btn-mini" onclick="ModuloManual.expandirBibliografia(false)" title="Colapsar todas las categorías bibliográficas">▲ Colapsar Todas</button>
          </div>
        </div>

        <div class="doc-bib-acordeones-contenedor">

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">01</span>
                  <h4 class="doc-bib-cat-titulo">1. Epistemología de la VGI, Filosofía de los SIG y Geografía Crítica</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">18 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Schuurman, N. (2000).</strong> Trouble in the Heartland: GIS and its critics in the 1990s. Progress in Human Geography, 24(4), 569-590. <a href="https://doi.org/10.1191/030913200100189111" target="_blank" rel="noopener">https://doi.org/10.1191/030913200100189111</a></li>
                <li class="doc-bib-item"><strong>Buzai, G. D. (2014).</strong> Geografía Global + NeoGeografía. Actuales espacios de integración científica y social en entornos digitales. Estudios Socioterritoriales. Revista de Geografía, (16), 183-189. <a href="http://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1853-43922014000200008" target="_blank" rel="noopener">http://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1853-43922014000200008</a></li>
                <li class="doc-bib-item"><strong>Mateos, P. (2013).</strong> Geovisualización de la población: nuevas tendencias en la web social. Investigaciones Geográficas, (59), 9-22. <a href="https://doi.org/10.14198/INGEO2013.59.01" target="_blank" rel="noopener">https://doi.org/10.14198/INGEO2013.59.01</a></li>
                <li class="doc-bib-item"><strong>Castells, M. (2000).</strong> La era de la información: economía, sociedad y cultura (Vol. 1: La sociedad red). Madrid: Alianza Editorial. <a href="https://www.alianzaeditorial.es/libro/ciencias-sociales/la-sociedad-red-manuel-castells-9788420647319/" target="_blank" rel="noopener">https://www.alianzaeditorial.es/</a></li>
                <li class="doc-bib-item"><strong>Pickles, J. (Ed.). (2006).</strong> Ground Truth: The Social Implications of Geographic Information Systems. New York: Guilford Press. <a href="https://www.guilford.com/books/Ground-Truth/John-Pickles/9780898622959" target="_blank" rel="noopener">https://www.guilford.com/</a></li>
                <li class="doc-bib-item"><strong>Anselin, L. (1988).</strong> Spatial Econometrics: Methods and Models. Dordrecht: Kluwer Academic Publishers. <a href="https://doi.org/10.1007/978-94-015-7799-1" target="_blank" rel="noopener">https://doi.org/10.1007/978-94-015-7799-1</a></li>
                <li class="doc-bib-item"><strong>Goodchild, M. F. (2007).</strong> Citizens as sensors: the world of volunteered geography. GeoJournal, 69(4), 211-221. <a href="https://doi.org/10.1007/s10708-007-9111-y" target="_blank" rel="noopener">https://doi.org/10.1007/s10708-007-9111-y</a></li>
                <li class="doc-bib-item"><strong>Burghardt, D., Demidova, E., & Keim, D. A. (Eds.). (2024).</strong> Volunteered Geographic Information: Interpretation, visualization and social context. Springer Nature. <a href="https://doi.org/10.1007/978-3-031-35374-1" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-031-35374-1</a></li>
                <li class="doc-bib-item"><strong>Haklay, M. (2013).</strong> Neogeography and the delusion of democratisation. Environment and Planning A: Economy and Space, 45(1), 55–69. <a href="https://doi.org/10.1068/a45184" target="_blank" rel="noopener">https://doi.org/10.1068/a45184</a></li>
                <li class="doc-bib-item"><strong>Haklay, M., & Capineri, C. (Eds.). (2016).</strong> European Handbook of Crowdsourced Geographic Information. London: Ubiquity Press. <a href="http://dx.doi.org/10.5334/bax" target="_blank" rel="noopener">http://dx.doi.org/10.5334/bax</a></li>
                <li class="doc-bib-item"><strong>Haklay, M., Antoniou, V., Basiouka, S., Soden, R., & Mooney, P. (2014).</strong> Crowdsourced Geographic Information Use in Government. Washington, D.C.: World Bank Report. <a href="https://doi.org/10.1596/28470" target="_blank" rel="noopener">https://doi.org/10.1596/28470</a></li>
                <li class="doc-bib-item"><strong>See, L., Mooney, P., Foody, G., et al. (2016).</strong> Crowdsourcing, citizen science or Volunteered Geographic Information? The current state of crowdsourced geographic information. ISPRS International Journal of Geo-Information, 5(5), 55. <a href="https://doi.org/10.3390/ijgi5050055" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi5050055</a></li>
                <li class="doc-bib-item"><strong>See, L., et al. (2025).</strong> Mapping the Future: The Emergence of Machine Learning, Big Data, and Volunteered Geographic Information. Cham: Springer. <a href="https://doi.org/10.1007/978-3-031-77344-0_2" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-031-77344-0_2</a></li>
                <li class="doc-bib-item"><strong>Soriano, C. (2016).</strong> La Información Geográfica Voluntaria: ¿cómo establecer y evaluar su calidad? Universidad de Alcalá / Revista Cartográfica, 93, 11-28. <a href="https://doi.org/10.35424/rcarto.i93.376" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.376</a></li>
                <li class="doc-bib-item"><strong>Pastor, J. (2015).</strong> La confianza de la Información Geográfica Voluntaria (VGI). Universidad de Alcalá / Revista Cartográfica, 91, 33-49. <a href="https://doi.org/10.35424/rcarto.i91.352" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i91.352</a></li>
                <li class="doc-bib-item"><strong>Magaña, A., & Valverde, F. (2016).</strong> Información Geográfica Voluntaria (IGV), estado del arte en Latinoamérica. Revista Cartográfica, 93, 39-59. <a href="https://doi.org/10.35424/rcarto.i93.426" target="_blank" rel="noopener">https://doi.org/10.35424/rcarto.i93.426</a></li>
                <li class="doc-bib-item"><strong>Willington, S. (2018).</strong> Sobre la evolución de la información geográfica: las bodas de oro de los SIG. Instituto Geográfico Nacional de España / CNIG. <a href="https://www.ign.es/" target="_blank" rel="noopener">https://www.ign.es/</a></li>
                <li class="doc-bib-item"><strong>Fast, V., & Rinner, C. (2014).</strong> A Systems Perspective on Volunteered Geographic Information. ISPRS International Journal of Geo-Information, 3(4), 1278-1292. <a href="https://doi.org/10.3390/ijgi3041278" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi3041278</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">02</span>
                  <h4 class="doc-bib-cat-titulo">2. Evaluación de Calidad Espacial, Integridad Cartográfica y Métricas ISO 19157</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">18 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Muñoz-Vargas, J., Lobry, S., & Lefèvre, S. (2019).</strong> Correcting rural building annotations in OpenStreetMap using convolutional neural networks. arXiv preprint arXiv:1901.08190. <a href="https://arxiv.org/abs/1901.08190" target="_blank" rel="noopener">https://arxiv.org/abs/1901.08190</a></li>
                <li class="doc-bib-item"><strong>Tempelmeier, N., & Demidova, E. (2022).</strong> Attention-based vandalism detection in OpenStreetMap. arXiv preprint arXiv:2201.10406. <a href="https://arxiv.org/abs/2201.10406" target="_blank" rel="noopener">https://arxiv.org/abs/2201.10406</a></li>
                <li class="doc-bib-item"><strong>Weigell, P. (2023).</strong> Data coverage, richness, and quality of OpenStreetMap for special interest tags: wayside crosses-a case study. arXiv preprint arXiv:2306.04752. <a href="https://arxiv.org/abs/2306.04752" target="_blank" rel="noopener">https://arxiv.org/abs/2306.04752</a></li>
                <li class="doc-bib-item"><strong>Ballatore, A. (2014).</strong> Defacing the map: Cartographic vandalism in the digital commons. The Cartographic Journal, 51(3), 214-224. <a href="https://doi.org/10.1179/1743277414Y.0000000085" target="_blank" rel="noopener">https://doi.org/10.1179/1743277414Y.0000000085</a></li>
                <li class="doc-bib-item"><strong>Seto, T., Kanasugi, H., & Nishimura, Y. (2020).</strong> Quality verification of Volunteered Geographic Information using OSM Notes data in a global context. ISPRS International Journal of Geo-Information, 9(6), 372. <a href="https://doi.org/10.3390/ijgi9060372" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi9060372</a></li>
                <li class="doc-bib-item"><strong>Mooney, P., & Minghini, M. (2017).</strong> A Review of Volunteered Geographic Information for Land Administration. MDPI, Land, 6(4), 89. <a href="https://doi.org/10.3390/land6040089" target="_blank" rel="noopener">https://doi.org/10.3390/land6040089</a></li>
                <li class="doc-bib-item"><strong>Antoniou, V., & Skopeliti, A. (2015).</strong> Measures of Reasoning and Spatial Data Quality in VGI. ISPRS International Journal of Geo-Information, 4(3), 1724-1741. <a href="https://doi.org/10.3390/ijgi4031724" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi4031724</a></li>
                <li class="doc-bib-item"><strong>Skopeliti, A., & Antoniou, V. (2017).</strong> Evaluating Volunteered Geographic Information for Spatio-Temporal Analysis: OpenStreetMap and the Refugee Crisis in Greece. MDPI, Environments, 4(2), 30. <a href="https://doi.org/10.3390/environments4020030" target="_blank" rel="noopener">https://doi.org/10.3390/environments4020030</a></li>
                <li class="doc-bib-item"><strong>Goodchild, M. F., & Li, L. (2012).</strong> Assuring the quality of volunteered geographic information. Spatial Statistics, 1, 110-120. <a href="https://doi.org/10.1016/j.spasta.2012.03.002" target="_blank" rel="noopener">https://doi.org/10.1016/j.spasta.2012.03.002</a></li>
                <li class="doc-bib-item"><strong>Barron, C., Neis, P., & Zipf, A. (2013/2014).</strong> A Comprehensive Framework for Intrinsic OpenStreetMap Quality Analysis. Transactions in GIS, 18(6), 877–895. <a href="https://doi.org/10.1111/tgis.12073" target="_blank" rel="noopener">https://doi.org/10.1111/tgis.12073</a></li>
                <li class="doc-bib-item"><strong>Girres, J. F., & Touya, G. (2010).</strong> Quality Assessment of the French OpenStreetMap Dataset. Transactions in GIS, 14(4), 435–459. <a href="https://doi.org/10.1111/j.1467-9671.2010.01203.x" target="_blank" rel="noopener">https://doi.org/10.1111/j.1467-9671.2010.01203.x</a></li>
                <li class="doc-bib-item"><strong>Bégin, D., Devillers, R., & Roche, S. (2013).</strong> Assessing Volunteered Geographic Information Quality for Topographic Mapping. Cartographica: The International Journal for Geographic Information and Geovisualization, 48(4), 312–325. <a href="https://doi.org/10.3138/carto.48.4.1687" target="_blank" rel="noopener">https://doi.org/10.3138/carto.48.4.1687</a></li>
                <li class="doc-bib-item"><strong>Fonte, C. C., Minghini, M., Patriarca, J., Antoniou, V., See, L., & Schöpfer, E. (2020).</strong> Assessing the Accuracy of OpenStreetMap Land Use and Land Cover Data. International Journal of Applied Earth Observation and Geoinformation, 93, 102209. <a href="https://doi.org/10.1016/j.jag.2020.102209" target="_blank" rel="noopener">https://doi.org/10.1016/j.jag.2020.102209</a></li>
                <li class="doc-bib-item"><strong>Fonte, C. C., See, L., Fritz, S., & Minghini, M. (2022).</strong> Quality Assessment of Citizen Science and VGI for Land Cover Mapping. Remote Sensing, 14(14), 3350. <a href="https://doi.org/10.3390/rs14143350" target="_blank" rel="noopener">https://doi.org/10.3390/rs14143350</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2013).</strong> Geographic information — Data quality (ISO Standard No. 19157:2013). Geneva: ISO. <a href="https://www.iso.org/standard/32575.html" target="_blank" rel="noopener">https://www.iso.org/standard/32575.html</a></li>
                <li class="doc-bib-item"><strong>Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2024).</strong> OpenStreetMap Quality Tool (OQT API): Automated spatial data quality assessment. Heidelberg University. <a href="https://dashboard.ohsome.org/" target="_blank" rel="noopener">https://dashboard.ohsome.org/</a></li>
                <li class="doc-bib-item"><strong>Wille, L., & OpenStreetMap Community. (2023).</strong> OSMCha: OpenStreetMap Changeset Analyzer and Quality Validation Tool. Mapbox / Development Seed. <a href="https://osmcha.org/" target="_blank" rel="noopener">https://osmcha.org/</a></li>
                <li class="doc-bib-item"><strong>Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019).</strong> OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data. EPJ Data Science, 8(1), 1-18. <a href="https://doi.org/10.1140/epjds/s13688-019-0208-0" target="_blank" rel="noopener">https://doi.org/10.1140/epjds/s13688-019-0208-0</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">03</span>
                  <h4 class="doc-bib-cat-titulo">3. Biodiversidad Urbana, Ciencia Ciudadana, Estándar Darwin Core y Plataformas Biológicas (GBIF / iNaturalist)</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">21 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Amano, T., Lamming, J. D. L., & Sutherland, W. J. (2016).</strong> Spatial gaps in global biodiversity information and the role of citizen science. BioScience Advance, Oxford University, 66(11), 993-1000. <a href="https://doi.org/10.1093/biosci/biw127" target="_blank" rel="noopener">https://doi.org/10.1093/biosci/biw127</a></li>
                <li class="doc-bib-item"><strong>Sandoval, S., Acuña, I., & Jaramillo, C. (2022).</strong> Polinización Sostenible: Adaptación al cambio climático para la producción de fruta en Chile. Fraunhofer Chile Research – Centro de Biotecnología de Sistemas (CSB), Proyecto CORFO 19 BP 117423. <a href="https://www.corfo.cl" target="_blank" rel="noopener">https://www.corfo.cl</a></li>
                <li class="doc-bib-item"><strong>López-Aliste, M., Fonturbel, F. E., Ruz, L., Sepúlveda, Y., Rodríguez, S., & Saraiva, A. M. (2021).</strong> Wild bees of Chile: a database on taxonomy, sociality, and ecology. Ecology, 102(8), e03377. <a href="https://doi.org/10.1002/ecy.3377" target="_blank" rel="noopener">https://doi.org/10.1002/ecy.3377</a> / GBIF Dataset: <a href="https://doi.org/10.15468/6knwyq" target="_blank" rel="noopener">https://doi.org/10.15468/6knwyq</a></li>
                <li class="doc-bib-item"><strong>Jacobs, C., & Zipf, A. (2017).</strong> Completeness of citizen science biodiversity data from a volunteered geographic information perspective. Geo-spatial Information Science, 20(2), 100-111. <a href="https://doi.org/10.1080/10095020.2017.1288424" target="_blank" rel="noopener">https://doi.org/10.1080/10095020.2017.1288424</a></li>
                <li class="doc-bib-item"><strong>Global Biodiversity Information Facility [GBIF]. (2022).</strong> Introducción a GBIF: La infraestructura mundial de información sobre biodiversidad. Secretariado de GBIF. <a href="https://www.gbif.org/es/what-is-gbif" target="_blank" rel="noopener">https://www.gbif.org/es/what-is-gbif</a></li>
                <li class="doc-bib-item"><strong>Schindel, D., Miller, S., & Trizna, M. (2016).</strong> The Global Registry of Biodiversity Repositories: A call for community curation. Biodiversity Data Journal, 4, e10293. <a href="https://doi.org/10.3897/BDJ.4.e10293" target="_blank" rel="noopener">https://doi.org/10.3897/BDJ.4.e10293</a></li>
                <li class="doc-bib-item"><strong>Chapman, A. D. (2005a).</strong> Principios de Calidad de Datos Geográficos. Copenhague: Secretaría de GBIF. <a href="https://www.gbif.org/document/80509" target="_blank" rel="noopener">https://www.gbif.org/document/80509</a></li>
                <li class="doc-bib-item"><strong>Chapman, A. D. (2005b).</strong> Principios y Métodos de Limpieza de Datos: Un informe para la Facilidad Global de Información sobre Biodiversidad. Copenhague: Secretaría de GBIF. <a href="https://www.gbif.org/document/80528" target="_blank" rel="noopener">https://www.gbif.org/document/80528</a></li>
                <li class="doc-bib-item"><strong>Chapman, A. D. (2010).</strong> Validación y Limpieza de Datos de Biodiversidad: Manual de capacitación técnica. Copenhague: Secretaría de GBIF. <a href="https://www.gbif.org/document/80530" target="_blank" rel="noopener">https://www.gbif.org/document/80530</a></li>
                <li class="doc-bib-item"><strong>Veiga, A. K., Saraiva, A. M., Chapman, A. D., Morris, P. J., Gendreau, C., Schigel, D., & Robertson, T. (2017).</strong> Guía para la Limpieza de Datos de Biodiversidad con OpenRefine. Copenhague: Secretaría de GBIF. <a href="https://doi.org/10.15468/doc-b26a-hx63" target="_blank" rel="noopener">https://doi.org/10.15468/doc-b26a-hx63</a></li>
                <li class="doc-bib-item"><strong>Committee on Data of the International Science Council [CODATA]. (2020).</strong> Twenty Years of Data Science Journal: A Historical Perspective. CODATA Data Science Journal. <a href="https://doi.org/10.35035/ctzm-hz97" target="_blank" rel="noopener">https://doi.org/10.35035/ctzm-hz97</a></li>
                <li class="doc-bib-item"><strong>Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., et al. (2016).</strong> The FAIR Guiding Principles for scientific data management and stewardship. Scientific Data, 3, 160018. <a href="https://doi.org/10.1038/sdata.2016.18" target="_blank" rel="noopener">https://doi.org/10.1038/sdata.2016.18</a></li>
                <li class="doc-bib-item"><strong>Nature. (1999).</strong> Vast database offers vision of biodiversity. Nature, 399, 723. <a href="https://doi.org/10.1038/21728" target="_blank" rel="noopener">https://doi.org/10.1038/21728</a></li>
                <li class="doc-bib-item"><strong>Organisation for Economic Co-operation and Development [OECD]. (2017).</strong> Best Practice Guidelines for the Licensing of Genomic Databases. OECD Publishing. <a href="https://doi.org/10.1787/23074957" target="_blank" rel="noopener">https://doi.org/10.1787/23074957</a></li>
                <li class="doc-bib-item"><strong>Global Biodiversity Information Facility [GBIF]. (2025b).</strong> Science Review Nº 12: Annual review of the uses of GBIF-mediated data. GBIF Secretariat. <a href="https://www.gbif.org/" target="_blank" rel="noopener">https://www.gbif.org/</a></li>
                <li class="doc-bib-item"><strong>Global Biodiversity Information Facility [GBIF]. (2023).</strong> 2023-2027 GBIF Strategic Framework: Enabling biodiversity-positive decisions. GBIF Secretariat. <a href="https://www.gbif.org/" target="_blank" rel="noopener">https://www.gbif.org/</a></li>
                <li class="doc-bib-item"><strong>Global Biodiversity Information Facility [GBIF]. (2025c).</strong> Creación de un nodo participante eficaz de GBIF: Guía de implementación institucional. Secretariado de GBIF. <a href="https://docs.gbif.org/effective-nodes-guidance/es/" target="_blank" rel="noopener">https://docs.gbif.org/effective-nodes-guidance/es/</a></li>
                <li class="doc-bib-item"><strong>Global Biodiversity Information Facility [GBIF]. (2025a).</strong> Technical Guidance for EBRD clients on uploading biodiversity data to the Global Biodiversity Information Facility. GBIF Secretariat. <a href="https://www.gbif.org/" target="_blank" rel="noopener">https://www.gbif.org/</a></li>
                <li class="doc-bib-item"><strong>GBIF.org. (2025).</strong> GBIF Occurrence Download (Santiago Metropolitan Region). Global Biodiversity Information Facility. <a href="https://doi.org/10.15468/dl.zjw4q9" target="_blank" rel="noopener">https://doi.org/10.15468/dl.zjw4q9</a></li>
                <li class="doc-bib-item"><strong>Global Biodiversity Information Facility [GBIF]. (2024).</strong> GBIF Occurrence API & Species API (v1 REST API Documentation). GBIF Secretariat. <a href="https://www.gbif.org/developer/summary" target="_blank" rel="noopener">https://www.gbif.org/developer/summary</a></li>
                <li class="doc-bib-item"><strong>Biodiversity Information Standards [TDWG]. (2023).</strong> Darwin Core standard: Quick reference guide. Biodiversity Information Standards. <a href="https://dwc.tdwg.org/terms/" target="_blank" rel="noopener">https://dwc.tdwg.org/terms/</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">04</span>
                  <h4 class="doc-bib-cat-titulo">4. Aplicaciones Sectoriales de la VGI: Movilidad Urbana, Transporte, Modelación de Incendios, Salud Pública y Geoprivacidad</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">17 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Foody, G., See, L., et al. (Eds.). (2017).</strong> Mapping and the Citizen Sensor. London: Ubiquity Press. <a href="https://doi.org/10.5334/bbf" target="_blank" rel="noopener">https://doi.org/10.5334/bbf</a></li>
                <li class="doc-bib-item"><strong>Ludwig, C., Hecht, R., Lautenbach, S., et al. (2021).</strong> Traffic Sign Detection in OpenStreetMap: A Case Study in Heidelberg. Springer Nature Switzerland AG. State of the Map 2019, LNCS 11780, pp. 1–12. <a href="https://doi.org/10.1007/978-3-030-19444-4_1" target="_blank" rel="noopener">https://doi.org/10.1007/978-3-030-19444-4_1</a></li>
                <li class="doc-bib-item"><strong>Ballari, D., Orellana, D., & Baloian, N. (2019).</strong> A Spatio-Temporal Model for Mining Frequent Trajectory Patterns in Volunteered Geographic Information. International Journal of Geographical Information Science, 33(10), 1959–1983. <a href="https://doi.org/10.1080/13658816.2019.1605073" target="_blank" rel="noopener">https://doi.org/10.1080/13658816.2019.1605073</a></li>
                <li class="doc-bib-item"><strong>Orellana, D., Hermida, C., & Osorio, P. (2019).</strong> Crowdsourced Bicycle Trip Data Quality: Assessing Positional Accuracy and Completeness. Transactions in GIS, 23(4), 841–858. <a href="https://doi.org/10.1111/tgis.12534" target="_blank" rel="noopener">https://doi.org/10.1111/tgis.12534</a></li>
                <li class="doc-bib-item"><strong>Orellana, D. A., & Ballari, D. (2009).</strong> La GeoWeb y su evolución: Un marco de análisis en tres dimensiones. Universidad Verdad, (49), 25-52. <a href="https://revistas.uazuay.edu.ec/index.php/uverdad/article/view/459" target="_blank" rel="noopener">https://revistas.uazuay.edu.ec/index.php/uverdad/article/view/459</a></li>
                <li class="doc-bib-item"><strong>Mooney, P., Grinberger, A., & Minghini, M. (2020).</strong> OpenStreetMap data use cases during the early months of the COVID-19 pandemic. arXiv preprint arXiv:2008.02653. <a href="https://arxiv.org/abs/2008.02653" target="_blank" rel="noopener">https://arxiv.org/abs/2008.02653</a></li>
                <li class="doc-bib-item"><strong>Attard, M., Haklay, M., & Capineri, C. (2016).</strong> The potential of Volunteered Geographic Information (VGI) in future transport systems. Urban Planning, 1(4), 6-19. <a href="https://doi.org/10.17645/up.v1i4.612" target="_blank" rel="noopener">https://doi.org/10.17645/up.v1i4.612</a></li>
                <li class="doc-bib-item"><strong>Grady, L. (2025).</strong> OSM-FaVe: A Dataset for OpenStreetMap Element-Feature Association and Verification. arXiv preprint arXiv:2507.03738. <a href="https://arxiv.org/abs/2507.03738" target="_blank" rel="noopener">https://arxiv.org/abs/2507.03738</a></li>
                <li class="doc-bib-item"><strong>Kounadi, O., & Leitner, M. (2014).</strong> Why do people contribute to OpenStreetMap? A systematic review of contributor motivations. Springer Science+Business Media Dordrecht. <a href="https://doi.org/10.1007/s10708-014-9549-8" target="_blank" rel="noopener">https://doi.org/10.1007/s10708-014-9549-8</a></li>
                <li class="doc-bib-item"><strong>Antoniou, V. (2023).</strong> Citizen Science: A new paradigm for spatial data infrastructure? MDPI, Land, 12(10), 1928. <a href="https://doi.org/10.3390/land12101928" target="_blank" rel="noopener">https://doi.org/10.3390/land12101928</a></li>
                <li class="doc-bib-item"><strong>Schmidt, F., Rothaar, A., & Rienow, A. (2021).</strong> Development of a Web GIS for small-scale detection and analysis of COVID-19 cases based on volunteered geographic information for the city of Cologne, Germany. International Journal of Health Geographics, 20(1), 1-17. <a href="https://doi.org/10.1186/s12942-021-00290-0" target="_blank" rel="noopener">https://doi.org/10.1186/s12942-021-00290-0</a></li>
                <li class="doc-bib-item"><strong>Farahat, A., et al. (2021).</strong> Quality Assessment of OpenStreetMap Data: A Multicriteria Approach. ISPRS International Journal of Geo-Information, 10(8), 563. <a href="https://doi.org/10.3390/ijgi10080563" target="_blank" rel="noopener">https://doi.org/10.3390/ijgi10080563</a></li>
                <li class="doc-bib-item"><strong>Pais, C., Carrasco, J., Martell, D., et al. (2021).</strong> Cell2Fire: A Cell-Based Forest Fire Growth Model to support strategic landscape management planning. Frontiers in Forest and Global Change, 4, 692706. <a href="https://doi.org/10.3389/ffgc.2021.692706" target="_blank" rel="noopener">https://doi.org/10.3389/ffgc.2021.692706</a></li>
                <li class="doc-bib-item"><strong>Pais, C., Carrasco, J., et al. (2019).</strong> A cell-based simulation model for wildfire spread and suppression. International Journal of Wildland Fire, 30, 485–496 / arXiv:1905.09317. <a href="https://arxiv.org/abs/1905.09317" target="_blank" rel="noopener">https://arxiv.org/abs/1905.09317</a></li>
                <li class="doc-bib-item"><strong>Carrasco, J., Martell, D., et al. (2021).</strong> A high-resolution forest fuel moisture content model for operational use in Central Chile. Canadian Journal of Forest Research, 51(12), 1845-1857. <a href="https://doi.org/10.1139/cjfr-2021-0087" target="_blank" rel="noopener">https://doi.org/10.1139/cjfr-2021-0087</a></li>
                <li class="doc-bib-item"><strong>Miranda, A., et al. (2022).</strong> Characterizing the fire regime in Mediterranean ecosystems of Chile: the influence of climate, vegetation and topography. Fire Ecology, 18, 25. <a href="https://doi.org/10.1186/s42408-022-00148-3" target="_blank" rel="noopener">https://doi.org/10.1186/s42408-022-00148-3</a></li>
                <li class="doc-bib-item"><strong>United Nations Framework Convention on Climate Change [UNFCCC]. (2025).</strong> Global Climate Action Agenda at COP 30: Outcomes Report. United Nations. <a href="https://unfccc.int/" target="_blank" rel="noopener">https://unfccc.int/</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">05</span>
                  <h4 class="doc-bib-cat-titulo">5. Infraestructuras de Datos Espaciales (IDE), Web Semántica y Gobernanza de Datos</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">14 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>IDE-Chile. (2023).</strong> Política Nacional de Información Geoespacial. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales, Gobierno de Chile. <a href="https://www.ide.cl/index.php/informacion-institucional/politica-nacional" target="_blank" rel="noopener">https://www.ide.cl/</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Geoespaciales de Chile [IDE Chile]. (2024).</strong> Política de Gestión de Información Territorial — Geoespacial. Secretaría Ejecutiva SNIT, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl/politica/politica/" target="_blank" rel="noopener">https://www.ide.cl/politica/politica/</a></li>
                <li class="doc-bib-item"><strong>Fuenzalida, M. (2025).</strong> Taller Datos Abiertos e Infraestructura de Datos Espaciales en Chile: Integración de VGI y Políticas Públicas. Conferencia y Seminario IDE Chile, Ministerio de Bienes Nacionales. <a href="https://www.ide.cl/images/conferencias-seminarios/2025/taller-datos-abiertos/01-Manuel-Fuenzalida-Datos-abiertos-en-la-toma-de-decisiones.pdf" target="_blank" rel="noopener">https://www.ide.cl/.../01-Manuel-Fuenzalida-Datos-abiertos.pdf</a></li>
                <li class="doc-bib-item"><strong>Ballatore, A., Wilson, D. C., & Bertolotto, M. (2014).</strong> A survey of volunteered open geo-knowledge bases in the Semantic Web. Quality Issues in the Open Knowledge Base, 48-68. <a href="https://arxiv.org/abs/1401.2610" target="_blank" rel="noopener">https://arxiv.org/abs/1401.2610</a></li>
                <li class="doc-bib-item"><strong>Shahi, K. (2023).</strong> Spatial Data Science (SDS) in the Age of Artificial Intelligence (AI) and Foundation Models: A Position Paper. arXiv preprint arXiv:2311.14446. <a href="https://arxiv.org/abs/2311.14446" target="_blank" rel="noopener">https://arxiv.org/abs/2311.14446</a></li>
                <li class="doc-bib-item"><strong>Canadian Geospatial Data Infrastructure Information Product [CGDIIP]. (2012).</strong> Volunteered Geographic Information (VGI) Primer. Hickling Arthurs Low Science & Technology Policy Research. <a href="https://ftp.geogratis.gc.ca/" target="_blank" rel="noopener">https://ftp.geogratis.gc.ca/</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Catálogo Nacional de Features: Descripción normalizada de capas geoespaciales elementales para instituciones del Estado de Chile. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/catalogo-nacional-de-features.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/catalogo-nacional-de-features.pdf</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Metadatos Geoespaciales: Orientaciones para la documentación y gestión de la información geoespacial conforme a normas ISO. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/guia-metadatos.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/guia-metadatos.pdf</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Integración de Estándares Internacionales ISO/TC 211 en Chile. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/recomendacion-estandares-iso-tc211.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/recomendacion-estandares-iso-tc211.pdf</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Espaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Sistema de Referencia Geodésico para Chile, SIRGAS época 2016.0. Instituto Geográfico Militar / SNIT. <a href="https://www.ide.cl/documentos/sistema-referencia-geodesico-sirgas-2016.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/sistema-referencia-geodesico-sirgas-2016.pdf</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Geoespaciales de Chile [IDE Chile]. (s.f.).</strong> GeoNodo Chile: Plataforma Nacional de Datos Geoespaciales Abiertos. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/productos-y-servicios/herramientas/geonodo/" target="_blank" rel="noopener">https://www.ide.cl/productos-y-servicios/herramientas/geonodo/</a></li>
                <li class="doc-bib-item"><strong>Infraestructura de Datos Geoespaciales de Chile [IDE Chile / SNIT]. (2024).</strong> Interoperabilidad de servicios WMS: Vocabularios y convenciones comunes para Web Map Service. Secretaría Ejecutiva SNIT. <a href="https://www.ide.cl/documentos/recomendacion-interoperabilidad-wms.pdf" target="_blank" rel="noopener">https://www.ide.cl/documentos/recomendacion-interoperabilidad-wms.pdf</a></li>
                <li class="doc-bib-item"><strong>Comité Permanente para la Infraestructura de Datos Geoespaciales de las Américas [CP-IDEA]. (2013).</strong> De la CP-IDEA a UN-GGIM: Américas: Hacia la consolidación de la Infraestructura de Datos Espaciales de las Américas. Naciones Unidas. <a href="https://www.un-ggim-americas.org/" target="_blank" rel="noopener">https://www.un-ggim-americas.org/</a></li>
                <li class="doc-bib-item"><strong>Nebert, D. D. (Ed.). (2004).</strong> Developing Spatial Data Infrastructures: The SDI Cookbook (v2.0). Global Spatial Data Infrastructure Association (GSDI). <a href="https://www.gsdiassociation.org/" target="_blank" rel="noopener">https://www.gsdiassociation.org/</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">06</span>
                  <h4 class="doc-bib-cat-titulo">6. Marco Jurídico, Normativa Urbanística, Decretos y Leyes de la República de Chile</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">16 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Ministerio de Bienes Nacionales. (2006).</strong> Decreto Supremo N° 28/2006: Crea Comisión Asesora del Sistema Nacional de Información Territorial (SNIT). Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=251642" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=251642</a></li>
                <li class="doc-bib-item"><strong>Ministerio de Educación Pública. (1970).</strong> Ley N° 17.336 sobre Propiedad Intelectual. Diario Oficial de la República de Chile (Texto refundido y actualizado a 2024). <a href="https://www.bcn.cl/leychile/navegar?idNorma=28933" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=28933</a></li>
                <li class="doc-bib-item"><strong>Ministerio Secretaría General de la Presidencia [SEGPRES]. (2008).</strong> Ley N° 20.285 sobre Acceso a la Información Pública y Principio de Transparencia. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=278858" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=278858</a></li>
                <li class="doc-bib-item"><strong>Consejo de Monumentos Nacionales [CMN]. (2020).</strong> Ley N° 17.288 de Monumentos Nacionales y Normas Relacionadas. Ministerio de las Culturas, las Artes y el Patrimonio, Gobierno de Chile. <a href="https://www.monumentos.gob.cl/" target="_blank" rel="noopener">https://www.monumentos.gob.cl/</a></li>
                <li class="doc-bib-item"><strong>Ministerio de Salud [MINSAL]. (2019).</strong> Ley N° 21.156: Establece la obligación de disponer de desfibriladores externos automáticos portátiles en recintos públicos. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1131750" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1131750</a></li>
                <li class="doc-bib-item"><strong>Ministerio del Interior y Seguridad Pública. (2012).</strong> Ley N° 20.564: Ley Marco de Bomberos de Chile. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1036814" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1036814</a></li>
                <li class="doc-bib-item"><strong>Ministerio del Medio Ambiente [MMA]. (2016).</strong> Ley N° 20.920: Marco para la Gestión de Residuos, Responsabilidad Extendida del Productor y Fomento al Reciclaje (Ley REP). Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1090894" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1090894</a></li>
                <li class="doc-bib-item"><strong>Ministerio de Vivienda y Urbanismo [MINVU]. (2016).</strong> Decreto Supremo N° 50: Modifica la Ordenanza General de Urbanismo y Construcciones en materia de accesibilidad universal. Diario Oficial de la República de Chile. <a href="https://www.bcn.cl/leychile/navegar?idNorma=1087816" target="_blank" rel="noopener">https://www.bcn.cl/leychile/navegar?idNorma=1087816</a></li>
                <li class="doc-bib-item"><strong>Directorio de Transporte Público Metropolitano [DTPM]. (2023).</strong> Manual de Normas Técnicas para Paraderos e Infraestructura del Sistema Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile. <a href="https://www.dtpm.cl" target="_blank" rel="noopener">https://www.dtpm.cl</a></li>
                <li class="doc-bib-item"><strong>Directorio de Transporte Público Metropolitano [DTPM]. (2024).</strong> Reporte de Cobertura, Accesibilidad y Gestión de Paradas Red Movilidad. Ministerio de Transportes y Telecomunicaciones, Gobierno de Chile. <a href="https://www.dtpm.cl" target="_blank" rel="noopener">https://www.dtpm.cl</a></li>
                <li class="doc-bib-item"><strong>Corporación Nacional Forestal [CONAF]. (2019).</strong> Guía de Campo: Árboles Urbanos de Chile. Ministerio de Agricultura, Gobierno de Chile. <a href="https://www.conaf.cl" target="_blank" rel="noopener">https://www.conaf.cl</a></li>
                <li class="doc-bib-item"><strong>Ministerio de Vivienda y Urbanismo [MINVU]. (2020).</strong> Manual de Vialidad Cicloinclusiva y Directrices de Diseño de Ciclovías Urbanas. Gobierno de Chile. <a href="https://www.minvu.gob.cl" target="_blank" rel="noopener">https://www.minvu.gob.cl</a></li>
                <li class="doc-bib-item"><strong>Ministerio de Vivienda y Urbanismo [MINVU]. (2021).</strong> Política Nacional de Parques Urbanos y Estándares de Áreas Verdes Públicas. MINVU, Gobierno de Chile. <a href="https://www.minvu.gob.cl" target="_blank" rel="noopener">https://www.minvu.gob.cl</a></li>
                <li class="doc-bib-item"><strong>Municipalidad de Santiago. (2019).</strong> Plan Regulador Comunal de Santiago: Catálogo de Inmuebles y Zonas de Conservación Histórica. Dirección de Obras Municipales, Ilustre Municipalidad de Santiago. <a href="https://www.munistgo.cl" target="_blank" rel="noopener">https://www.munistgo.cl</a></li>
                <li class="doc-bib-item"><strong>OpenStreetMap Foundation & Comunidad OSM Chile. (2024).</strong> WikiProject Chile: Guía, directrices y convenciones comunitarias de mapeo para Chile. OpenStreetMap Wiki. <a href="https://wiki.openstreetmap.org/wiki/WikiProject_Chile" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/WikiProject_Chile</a></li>
                <li class="doc-bib-item"><strong>Open Data Commons. (2010).</strong> Open Database License (ODbL) v1.0. Open Knowledge Foundation. <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener">https://opendatacommons.org/licenses/odbl/</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">07</span>
                  <h4 class="doc-bib-cat-titulo">7. Estándares Internacionales ISO / OGC, Gobernanza UN-GGIM y Cartografía Geodésica</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">11 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Open Geospatial Consortium [OGC]. (2023).</strong> Open Geospatial Consortium Standards Baseline: Interoperability Programs and Open Standards. Wayland, MA: OGC. <a href="https://www.ogc.org/standards/" target="_blank" rel="noopener">https://www.ogc.org/standards/</a></li>
                <li class="doc-bib-item"><strong>Open Geospatial Consortium [OGC]. (2019).</strong> OGC API - Features - Part 1: Core (Standard No. OGC 17-069r3). Open Geospatial Consortium. <a href="https://ogcapi.ogc.org/features/" target="_blank" rel="noopener">https://ogcapi.ogc.org/features/</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2014).</strong> Geographic information — Metadata — Part 1: Fundamentals (ISO Standard No. 19115-1:2014). ISO. <a href="https://www.iso.org/standard/53798.html" target="_blank" rel="noopener">https://www.iso.org/standard/53798.html</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2016).</strong> Geographic information — Methodology for feature cataloguing (ISO Standard No. 19110:2016). ISO. <a href="https://www.iso.org/standard/57303.html" target="_blank" rel="noopener">https://www.iso.org/standard/57303.html</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2016).</strong> Geographic information — Services (ISO Standard No. 19119:2016/Amd 1:2019). ISO. <a href="https://www.iso.org/standard/59221.html" target="_blank" rel="noopener">https://www.iso.org/standard/59221.html</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2007).</strong> Geographic information — Metadata — XML schema implementation (ISO Technical Specification No. 19139:2007). ISO. <a href="https://www.iso.org/standard/32574.html" target="_blank" rel="noopener">https://www.iso.org/standard/32574.html</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2005).</strong> Geographic information — Web map server interface (ISO Standard No. 19128:2005 / OGC WMS). ISO / OGC. <a href="https://www.iso.org/standard/32520.html" target="_blank" rel="noopener">https://www.iso.org/standard/32520.html</a></li>
                <li class="doc-bib-item"><strong>International Organization for Standardization. (2021).</strong> Building construction — Accessibility and usability of the built environment (ISO Standard No. 21542:2021). ISO. <a href="https://www.iso.org/standard/70494.html" target="_blank" rel="noopener">https://www.iso.org/standard/70494.html</a></li>
                <li class="doc-bib-item"><strong>United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2020).</strong> Integrated Geospatial Information Framework (IGIF): A strategic guide to develop and strengthen national geospatial information management. United Nations. <a href="https://ggim.un.org/IGIF/" target="_blank" rel="noopener">https://ggim.un.org/IGIF/</a></li>
                <li class="doc-bib-item"><strong>United Nations Committee of Experts on Global Geospatial Information Management [UN-GGIM]. (2024).</strong> Future trends in geospatial information management: The five to ten year vision (4th ed.). United Nations. <a href="https://ggim.un.org/" target="_blank" rel="noopener">https://ggim.un.org/</a></li>
                <li class="doc-bib-item"><strong>Snyder, J. P. (1987).</strong> Map projections: a working manual (U.S. Geological Survey Professional Paper No. 1395). U.S. Government Printing Office. <a href="https://doi.org/10.3133/pp1395" target="_blank" rel="noopener">https://doi.org/10.3133/pp1395</a></li>
                </ul>
              </div>
            </details>

            <details class="doc-bib-acordeon" open>
              <summary class="doc-bib-summary">
                <div class="doc-bib-sum-left">
                  <span class="doc-bib-num">08</span>
                  <h4 class="doc-bib-cat-titulo">8. Plataformas Tecnológicas, APIs de Consulta, Formatos de Intercambio y Tecnologías Web Abiertas</h4>
                </div>
                <div class="doc-bib-sum-right">
                  <span class="doc-bib-conteo-badge">12 fuentes</span>
                  <span class="doc-acordeon-flecha" aria-hidden="true">▼</span>
                </div>
              </summary>
              <div class="doc-bib-cuerpo">
                <ul class="doc-bib-lista">
                <li class="doc-bib-item"><strong>Topf, J., & OpenStreetMap Contributors. (2024).</strong> Taginfo: OpenStreetMap tag statistics, semantic consistency and usage system. OpenStreetMap Foundation. <a href="https://taginfo.openstreetmap.org/" target="_blank" rel="noopener">https://taginfo.openstreetmap.org/</a></li>
                <li class="doc-bib-item"><strong>OpenStreetMap Foundation & Geofabrik GmbH. (2024).</strong> Taginfo Chile: Base de datos y estadísticas regionales de etiquetas de OpenStreetMap en Chile. Geofabrik. <a href="https://taginfo.geofabrik.de/south-america:chile" target="_blank" rel="noopener">https://taginfo.geofabrik.de/south-america:chile</a></li>
                <li class="doc-bib-item"><strong>Heidelberg Institute for Geoinformation Technology [HeiGIT]. (2023).</strong> ohsome API: OpenStreetMap History Analytics API Documentation (v1 & v2). Heidelberg University. <a href="https://api.ohsome.org/" target="_blank" rel="noopener">https://api.ohsome.org/</a></li>
                <li class="doc-bib-item"><strong>OpenStreetMap Foundation [OSMF]. (2023).</strong> Overpass API: A high-performance read-only API serving custom spatial subsets of OpenStreetMap. OSMF. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/Overpass_API</a></li>
                <li class="doc-bib-item"><strong>Olbricht, R., & OpenStreetMap Contributors. (2023).</strong> Overpass QL: Overpass API Language Guide and Reference Manual. OpenStreetMap Foundation. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL" target="_blank" rel="noopener">https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL</a></li>
                <li class="doc-bib-item"><strong>Ecma International. (2024).</strong> ECMAScript® 2024 Language Specification (Standard ECMA-262, 15th ed.). Ecma International. <a href="https://www.ecma-international.org/publications-and-standards/standards/ecma-262/" target="_blank" rel="noopener">https://www.ecma-international.org/publications-and-standards/standards/ecma-262/</a></li>
                <li class="doc-bib-item"><strong>Van Rossum, G., & Drake, F. L. (2024).</strong> The Python Language Reference (Manual v3.12). Python Software Foundation. <a href="https://docs.python.org/3/reference/" target="_blank" rel="noopener">https://docs.python.org/3/reference/</a></li>
                <li class="doc-bib-item"><strong>Web Hypertext Application Technology Working Group [WHATWG]. (2024).</strong> HTML Living Standard. WHATWG / World Wide Web Consortium. <a href="https://html.spec.whatwg.org/multipage/" target="_blank" rel="noopener">https://html.spec.whatwg.org/multipage/</a></li>
                <li class="doc-bib-item"><strong>World Wide Web Consortium [W3C]. (2023).</strong> Cascading Style Sheets (CSS) Snapshot 2023 (W3C Working Group Note). W3C. <a href="https://www.w3.org/TR/css-2023/" target="_blank" rel="noopener">https://www.w3.org/TR/css-2023/</a></li>
                <li class="doc-bib-item"><strong>Butler, H., Daly, M., Doyle, A., Gillies, S., Hagen, S., & Schaub, T. (2016).</strong> The GeoJSON Format (RFC No. 7946). Internet Engineering Task Force (IETF). <a href="https://doi.org/10.17487/RFC7946" target="_blank" rel="noopener">https://doi.org/10.17487/RFC7946</a></li>
                <li class="doc-bib-item"><strong>World Wide Web Consortium [W3C]. (2018).</strong> Scalable Vector Graphics (SVG) 2.0 Specification (W3C Candidate Recommendation). W3C. <a href="https://www.w3.org/TR/SVG2/" target="_blank" rel="noopener">https://www.w3.org/TR/SVG2/</a></li>
                <li class="doc-bib-item"><strong>MacFarlane, J., Krewenki, P., Greenspun, J., et al. (2024).</strong> CommonMark Spec: A strongly defined, highly compatible specification of Markdown (Version 0.31.2). CommonMark. <a href="https://spec.commonmark.org/" target="_blank" rel="noopener">https://spec.commonmark.org/</a></li>
                </ul>
              </div>
            </details>
        </div>
      </section>

    </div>
    `;
  }

  // Métodos interactivos y de navegación
  function copiarCodigo(btn) {
    const bloque = btn.closest('.doc-terminal-wrapper') || btn.closest('.doc-codigo-bloque');
    if (!bloque) return;
    const codigo = bloque.querySelector('code');
    if (!codigo) return;
    navigator.clipboard.writeText(codigo.innerText).then(() => {
      const textoOriginal = btn.innerHTML;
      btn.innerHTML = '<span class="doc-copiar-icono">✓</span> ¡Copiado!';
      btn.classList.add('copiado-exito');
      setTimeout(() => {
        btn.innerHTML = textoOriginal;
        btn.classList.remove('copiado-exito');
      }, 2000);
    }).catch(() => {
      // Fallback para entornos donde clipboard API esté restringida
      const ta = document.createElement('textarea');
      ta.value = codigo.innerText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.innerHTML = '<span class="doc-copiar-icono">✓</span> ¡Copiado!';
      setTimeout(() => {
        btn.innerHTML = '<span class="doc-copiar-icono">📋</span> Copiar QL';
      }, 2000);
    });
  }

  function irAPanel(panelId) {
    const btn = document.querySelector(`button[data-panel="${panelId}"]`);
    if (btn) {
      btn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function filtrarCategoria(catId) {
    const acordeones = document.querySelectorAll('.doc-cat-acordeon');
    const botones = document.querySelectorAll('.doc-cat-tab-btn');
    
    botones.forEach(b => {
      if (b.dataset.cat === catId) {
        b.classList.add('activo');
      } else {
        b.classList.remove('activo');
      }
    });

    if (catId === 'todas') {
      acordeones.forEach(a => {
        a.style.display = 'block';
        a.open = true;
      });
      return;
    }

    acordeones.forEach(a => {
      if (a.id === catId) {
        a.style.display = 'block';
        a.open = true;
        a.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        a.style.display = 'none';
      }
    });
  }

  function expandirCategorias(expandir) {
    const acordeones = document.querySelectorAll('.doc-cat-acordeon');
    acordeones.forEach(a => {
      a.style.display = 'block';
      a.open = !!expandir;
    });
    const botones = document.querySelectorAll('.doc-cat-tab-btn');
    botones.forEach(b => {
      if (b.dataset.cat === 'todas') b.classList.add('activo');
      else b.classList.remove('activo');
    });
  }

  function filtrarBibliografia(input) {
    const query = (input.value || '').toLowerCase().trim();
    const acordeones = document.querySelectorAll('.doc-bib-acordeon');
    const contador = document.getElementById('doc-bib-contador-resultados');
    let totalVisibles = 0;

    acordeones.forEach(acordeon => {
      const items = acordeon.querySelectorAll('li');
      let itemsEnAcordeon = 0;
      items.forEach(li => {
        const text = li.innerText.toLowerCase();
        if (!query || text.includes(query)) {
          li.style.display = '';
          itemsEnAcordeon++;
          totalVisibles++;
        } else {
          li.style.display = 'none';
        }
      });

      if (itemsEnAcordeon > 0) {
        acordeon.style.display = 'block';
        if (query) acordeon.open = true;
      } else {
        acordeon.style.display = 'none';
      }
    });

    if (contador) {
      if (query) {
        contador.innerText = `${totalVisibles} de 127 fuentes encontradas`;
        contador.style.color = 'var(--musgo)';
      } else {
        contador.innerText = `127 fuentes indexadas`;
        contador.style.color = '';
      }
    }
  }

  function expandirBibliografia(expandir) {
    const acordeones = document.querySelectorAll('.doc-bib-acordeon');
    acordeones.forEach(a => {
      a.open = !!expandir;
    });
  }

  return {
    render,
    copiarCodigo,
    irAPanel,
    filtrarCategoria,
    expandirCategorias,
    filtrarBibliografia,
    expandirBibliografia
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
