/*
  manual.js
  ---------
  Módulo 08: Manual de Uso y Manual de Actualización Técnica del Atlas VGI (UAH).
  Redactado en tercera persona con formato de artículo metodológico y reporte técnico-profesional.

  Integra:
  - Parte I: Manual de Uso del Atlas (Fundamentación, arquitectura de interfaz, operación de los Módulos 00 al 09,
    ICV Dinámico, Inspector Normativo PRC/OGUC con expediente histórico 1990-2024 y Catálogo de las 131 capas).
  - Parte II: Manual de Actualización y Mantención Técnica (Principios de ingeniería, sincronización espejo
    data/ y src/data/, base dual .geojson + .gpkg, protocolo de 6 etapas para integración de coberturas,
    mantención de indicadores/storyboards/normativa, validación final, despliegue y bibliografía APA 7ª ed.).
*/

const ModuloManual = (() => {

  let modoManualActivo = 'todos'; // 'todos' | 'uso' | 'actualizacion'

  /**
   * Construye dinámicamente el inventario de las 131 capas (121 Oficiales + 10 VGI)
   * directamente desde las configuraciones activas del sistema.
   */
  function construirInventarioDinamicoCapas() {
    const lista = [];

    // 1. 10 Categorías VGI desde NODO_CONFIG
    const catsVGI = (typeof window !== 'undefined' && window.NODO_CONFIG && Array.isArray(window.NODO_CONFIG.categorias_osm))
      ? window.NODO_CONFIG.categorias_osm
      : [];

    catsVGI.forEach((cat, idx) => {
      lista.push({
        num: `VGI-${String(idx + 1).padStart(2, '0')}`,
        id: cat.id,
        nombre: cat.nombre,
        institucion: 'OpenStreetMap / GBIF (VGI)',
        tipo: 'Colaborativa VGI',
        geometria: Array.isArray(cat.geometrias) ? cat.geometrias[0] : 'Vectorial',
        archivo: `data/capa_${cat.id}.geojson`,
        descripcion: cat.descripcion || 'Cobertura temática colaborativa.'
      });
    });

    // 2. 121 Capas Oficiales desde ModuloIDEChile
    let mapaOficiales = {};
    if (typeof window !== 'undefined' && window.ModuloIDEChile) {
      if (typeof window.ModuloIDEChile.obtenerCatalogoCapas === 'function') {
        try {
          mapaOficiales = window.ModuloIDEChile.obtenerCatalogoCapas() || {};
        } catch (e) {
          console.warn('ModuloManual: Error leyendo obtenerCatalogoCapas()', e);
        }
      } else if (window.ModuloIDEChile.CAPAS_OFICIALES) {
        mapaOficiales = window.ModuloIDEChile.CAPAS_OFICIALES;
      }
    }

    Object.values(mapaOficiales).forEach((capa, idx) => {
      const codigo = capa.num_bbdd
        ? `BBDD-${String(capa.num_bbdd).padStart(2, '0')}`
        : `OF-${String(idx + 1).padStart(2, '0')}`;
      lista.push({
        num: codigo,
        id: capa.id,
        nombre: capa.nombre || capa.id,
        institucion: capa.institucion || 'Estado de Chile (IDE)',
        tipo: 'Oficial Estado',
        geometria: capa.geometria || 'Vectorial',
        archivo: capa.archivoLocal || `data/${capa.id}.geojson`,
        descripcion: capa.descripcion || 'Cobertura oficial del catálogo territorial.'
      });
    });

    return lista;
  }

  /**
   * Define los capítulos técnicos del Manual (Parte I: Uso + Parte II: Actualización)
   */
  function obtenerCapitulosManual() {
    const inventarioCapas = construirInventarioDinamicoCapas();
    const totalCapas = inventarioCapas.length || 131;

    const filasTablaCapas = inventarioCapas.map(c => {
      const colorBadge = c.tipo === 'Colaborativa VGI'
        ? 'background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.35);'
        : 'background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.35);';
      return `
        <tr class="fila-catalogo-manual" data-busqueda="${(c.num + ' ' + c.id + ' ' + c.nombre + ' ' + c.institucion + ' ' + c.descripcion).toLowerCase()}">
          <td style="font-family:monospace; font-weight:700; color:#f59e0b; white-space:nowrap;">${c.num}</td>
          <td><strong>${c.nombre}</strong><br><code style="font-size:0.74rem; color:var(--tinta-tenue);">${c.archivo}</code></td>
          <td><span style="padding:2px 8px; border-radius:99px; font-size:0.74rem; font-weight:700; white-space:nowrap; ${colorBadge}">${c.tipo}</span></td>
          <td style="font-size:0.84rem;">${c.institucion}</td>
          <td style="font-size:0.82rem; color:var(--tinta-suave);">${c.descripcion}</td>
        </tr>
      `;
    }).join('');

    return [
      // =======================================================================
      // PARTE I: MANUAL DE USO DEL ATLAS
      // =======================================================================
      {
        id: 'cap-uso-01',
        parte: 'uso',
        numero: 'USO · 01',
        icono: '🧭',
        titulo: 'Fundamentación y Alcance General del Sistema',
        subtitulo: 'Articulación de las 131 coberturas geográficas, 140 descriptores técnicos (ISO 19110) y 10 módulos funcionales.',
        html: `
          <p style="font-size:0.94rem; line-height:1.7; color:var(--tinta-suave);">
            El <strong>Atlas de Información Geográfica Voluntaria (Atlas VGI — UAH)</strong> constituye una plataforma web abierta que integra la cartografía oficial del Estado de Chile con información geográfica voluntaria (<em>Volunteered Geographic Information</em>, VGI; Goodchild, 2007; Haklay, 2010) para el diagnóstico multiescalar, la evaluación normativa y la gestión territorial del <strong>Barrio Brasil</strong>, el entorno del Campus Universidad Alberto Hurtado y la Región Metropolitana.
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:14px; margin:16px 0;">
            <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.3); border-radius:10px; padding:14px;">
              <div style="font-size:1.35rem; font-weight:800; color:#38bdf8;">131 Capas Operativas</div>
              <div style="font-size:0.85rem; color:var(--tinta-suave); margin-top:4px;">
                <strong>121 coberturas oficiales</strong> (MINVU, INE Censo 2024, MTT/UOCT, MDSF RSH, SUBDERE Residuos 2024, CMN, MMA, SII) y <strong>10 categorías VGI</strong> (OpenStreetMap y GBIF) en <code>EPSG:4326</code>.
              </div>
            </div>
            <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:14px;">
              <div style="font-size:1.35rem; font-weight:800; color:#fbbf24;">140 Descriptores Técnicos</div>
              <div style="font-size:0.85rem; color:var(--tinta-suave); margin-top:4px;">
                Especificación de atributos por cobertura y tablas de referencia en el <strong>Módulo 06</strong> (ISO 19110:2016), incluyendo los diccionarios nativos de las geodatabases <code>.gpkg</code> de SUBDERE.
              </div>
            </div>
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:14px;">
              <div style="font-size:1.35rem; font-weight:800; color:#34d399;">5 Dimensiones y 7 Storyboards</div>
              <div style="font-size:0.85rem; color:var(--tinta-suave); margin-top:4px;">
                Clasificación analítica multidimensional y 7 estudios empíricos sobre patrimonio, movilidad, biodiversidad, educación, cuidados, residuos sólidos y evolución normativa PRC.
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'cap-uso-02',
        parte: 'uso',
        numero: 'USO · 02',
        icono: '🗺️',
        titulo: 'Operación del Módulo 00: Visor Territorial, Calidad Dinámica e Inspector Normativo',
        subtitulo: 'Funcionamiento del lienzo cartográfico, cálculo en tiempo real del Índice de Calidad VGI (ICV) y evaluación del Plan Regulador Comunal.',
        html: `
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:rgba(15,23,42,0.55); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:15px;">
              <h4 style="margin:0 0 6px 0; color:#38bdf8;">1. Control de Coberturas, Encuadre Territorial y Exportación</h4>
              <ul style="margin:0; padding-left:20px; color:var(--tinta-suave); font-size:0.89rem; line-height:1.65;">
                <li><strong>Delimitación del ámbito de estudio:</strong> El selector superior permite alternar entre el polígono del <em>Barrio Brasil Completo</em> ($223,75\\text{ ha}$) y la <em>Manzana UAH</em> ($136,10\\text{ ha}$), o trazar un área personalizada mediante <strong>⛶ Dibujar Bbox</strong> (con cálculo métrico en $\\text{m}^2$ y $\\text{ha}$ reproyectado a <code>EPSG:32719</code>).</li>
                <li><strong>Superposición multicapa:</strong> El subpanel <strong>🏛 Capas IDE</strong> y los selectores VGI habilitan la visualización simultánea de coberturas estatales y comunitarias (recomendándose activar entre 2 y 4 capas simultáneamente para preservar la legibilidad cartográfica).</li>
                <li><strong>Inspección de atributos y descarga:</strong> La selección de cualquier geometría despliega su ficha de atributos normalizados, la institución custodia y el enlace de exportación individual en formato <code>GeoJSON</code>. El botón <strong>📦 Base de Datos (.zip)</strong> descarga el repositorio completo.</li>
              </ul>
            </div>

            <div style="background:rgba(15,23,42,0.55); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:15px;">
              <h4 style="margin:0 0 6px 0; color:#34d399;">2. Índice de Calidad VGI (ICV) Dinámico</h4>
              <p style="margin:0; color:var(--tinta-suave); font-size:0.89rem; line-height:1.65;">
                El subpanel <strong>📊 Métricas</strong> computa el Índice de Calidad VGI en tiempo real a partir de las entidades efectivamente activas en el visor (función <code>actualizarTelemetriaCapasActivas</code>):
              </p>
              <ul style="margin:6px 0 0 0; padding-left:20px; color:var(--tinta-suave); font-size:0.87rem; line-height:1.6;">
                <li><strong>Completitud Espacial:</strong> Proporción de entidades activas con geometría válida y campos atributivos completos.</li>
                <li><strong>Actualidad Reciente:</strong> Período cronológico más reciente identificado en los atributos temporales y metadatos de las capas encendidas.</li>
                <li><strong>Atribución Completa:</strong> Proporción de registros con custodia institucional y licencia verificada.</li>
              </ul>
            </div>

            <div style="background:rgba(15,23,42,0.55); border:1px solid rgba(245,158,11,0.4); border-radius:10px; padding:15px;">
              <h4 style="margin:0 0 6px 0; color:#fbbf24;">3. Inspector Normativo PRC/OGUC y Expediente Histórico (1990–2024)</h4>
              <p style="margin:0 0 8px 0; color:var(--tinta-suave); font-size:0.89rem; line-height:1.65;">
                La activación de <strong>⚖ Inspector Normativo</strong> y la selección de un punto sobre el mapa ejecutan el cruce espacial de las coberturas regulatorias, emitiendo el <strong>Certificado de Informaciones Normativas VGI (CIN-VGI)</strong>:
              </p>
              <ul style="margin:0 0 12px 0; padding-left:20px; color:var(--tinta-suave); font-size:0.87rem; line-height:1.6;">
                <li>Evalúa la zonificación comunal (<code>PRC</code>) e intercomunal (<code>PRMS</code>), los usos permitidos (<code>UPERM</code>) y prohibidos (<code>UPROH</code>) conforme al principio de exclusión negativa del <strong>Art. 2.1.24 de la OGUC</strong>, además de las restricciones por riesgo (Art. 2.1.17 OGUC) y protección patrimonial (ZCH, ICH, Monumentos Nacionales).</li>
                <li>Integra la síntesis de las <strong>10 modificaciones históricas al PRC de Santiago que inciden en el Barrio Brasil (1990–2024)</strong> (Res. N° 26/1990, Seccional Brasil, Modificaciones N° 16, 21, 26 y 31, Enmienda N° 2 de Cités, Enmiendas de Altura N° 1, 3 y 6 y postergaciones Art. 117 LGUC), vinculando directamente al repositorio documental oficial de Asesoría Urbana de la Municipalidad de Santiago.</li>
              </ul>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="accion" onclick="ModuloManual.irAPanel('inicio')" style="font-size:0.83rem; padding:7px 14px;">🗺️ Abrir Módulo 00 (Visor)</button>
                <a href="https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz" target="_blank" rel="noopener noreferrer" class="accion secundaria" style="font-size:0.83rem; padding:7px 14px; text-decoration:none;">📂 Expedientes Históricos PRC Munistgo (Google Drive) ↗</a>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'cap-uso-03',
        parte: 'uso',
        numero: 'USO · 03',
        icono: '🧩',
        titulo: 'Estructura Funcional de los Módulos 00 al 09',
        subtitulo: 'Especificación técnica de cada módulo de la plataforma y navegación directa.',
        html: `
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(295px, 1fr)); gap:12px;">
            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#38bdf8;">MÓDULO 00</span>
                <h4 style="margin:4px 0 6px 0;">Visor para la gestión territorial</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Visualización integrada de las 131 coberturas, métricas dinámicas ICV, Inspector Normativo PRC/OGUC e ingesta de archivos locales.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('inicio')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 00 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#38bdf8;">MÓDULO 01</span>
                <h4 style="margin:4px 0 6px 0;">Consultas Overpass (OSM)</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Extracción en tiempo real desde OpenStreetMap mediante plantillas temáticas y constructor de consultas Overpass QL.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('explorador-osm')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 01 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#38bdf8;">MÓDULO 02</span>
                <h4 style="margin:4px 0 6px 0;">Calidad &amp; ICV (ISO 19157 / ohsome / OSMCha)</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Evaluación multicriterio WLC bajo norma ISO 19157, series históricas ohsome API (HeiGIT) y auditoría de ediciones OSMCha.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('calidad-ohsome')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 02 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#34d399;">MÓDULO 03</span>
                <h4 style="margin:4px 0 6px 0;">Biodiversidad GBIF</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Consulta de ocurrencias biológicas georreferenciadas de flora, fauna y funga urbana bajo estándar Darwin Core (GBIF / iNaturalist).</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('biodiversidad-gbif')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 03 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#34d399;">MÓDULO 04</span>
                <h4 style="margin:4px 0 6px 0;">Cartografía uMap</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Integración de mapas colaborativos uMap orientados a talleres de cartografía participativa y validación comunitaria.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('proyectos-umap')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 04 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#fbbf24;">MÓDULO 05</span>
                <h4 style="margin:4px 0 6px 0;">Metadatos ISO 19115</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Generación y exportación de fichas de metadatos en JSON y XML (ISO 19139) compatibles con el Perfil Nacional IDE Chile.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('metadatos-iso')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 05 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#fbbf24;">MÓDULO 06</span>
                <h4 style="margin:4px 0 6px 0;">Diccionario (131 Capas / 140 Descriptores)</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Catálogo de objetos y atributos (ISO 19110), homologación SNIT/IDE Chile y diccionario de columnas SUBDERE RSD 2024.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('diccionario')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 06 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#c084fc;">MÓDULO 07</span>
                <h4 style="margin:4px 0 6px 0;">Licencias &amp; Catálogos (.xlsx)</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Régimen jurídico (ODbL 1.0, CC BY-SA 4.0, AGPLv3, Ley N° 20.285, Ley N° 19.628) y descarga directa de matrices Excel.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('licencias')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 07 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(168,85,247,0.45); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#c084fc;">MÓDULO 09</span>
                <h4 style="margin:4px 0 6px 0;">Indicadores &amp; Storyboards</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Las 131 coberturas agrupadas en 5 Dimensiones Analíticas y 7 Storyboards territoriales del Barrio Brasil.</p>
              </div>
              <button type="button" class="accion" onclick="ModuloManual.irAPanel('indicadores')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 09 ↗</button>
            </div>
          </div>
        `
      },
      {
        id: 'cap-uso-04',
        parte: 'uso',
        numero: 'USO · 04',
        icono: '🗂️',
        titulo: `Inventario General de las ${totalCapas} Coberturas Integradas (121 Oficiales + 10 VGI)`,
        subtitulo: 'Registro completo de capas operativas con filtrado dinámico por código, institución custodia o temática.',
        html: `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
            <p style="margin:0; font-size:0.88rem; color:var(--tinta-suave);">
              El inventario consolida las <strong>${totalCapas} coberturas operativas</strong> registradas en la plataforma:
            </p>
            <input type="search" id="input-filtro-catalogo-manual" placeholder="🔍 Filtrar inventario (ej: SUBDERE, PRC, Censo, VGI)..." oninput="ModuloManual.filtrarTablaCatalogo(this.value)" style="min-width:280px; padding:7px 12px; border-radius:8px; border:1px solid var(--linea); background:rgba(15,23,42,0.8); color:var(--tinta);">
          </div>
          <div style="max-height:420px; overflow-y:auto; border:1px solid var(--linea-tarjeta); border-radius:10px;">
            <table class="tabla-metadatos" style="width:100%; border-collapse:collapse; font-size:0.83rem;">
              <thead style="position:sticky; top:0; background:#0f172a; z-index:2;">
                <tr>
                  <th style="padding:10px; text-align:left;">Código</th>
                  <th style="padding:10px; text-align:left;">Denominación de Cobertura y Ruta</th>
                  <th style="padding:10px; text-align:left;">Origen</th>
                  <th style="padding:10px; text-align:left;">Institución Custodia</th>
                  <th style="padding:10px; text-align:left;">Descripción Técnica</th>
                </tr>
              </thead>
              <tbody id="tbody-catalogo-manual">
                ${filasTablaCapas}
              </tbody>
            </table>
          </div>
        `
      },

      // =======================================================================
      // PARTE II: MANUAL DE ACTUALIZACIÓN Y MANTENCIÓN TÉCNICA
      // =======================================================================
      {
        id: 'cap-act-01',
        parte: 'actualizacion',
        numero: 'ACT · 01',
        icono: '🏗️',
        titulo: 'Paradigma Tecnológico, Arquitectura de Software y Stack de Lenguajes',
        subtitulo: 'Serverless Static Spatial Architecture, sincronización simétrica data/ y src/data/, base dual (.geojson + .gpkg) y motor geodésico propio EPSG:32719.',
        html: `
          <p style="font-size:0.9rem; line-height:1.65; color:var(--tinta-suave); margin-bottom:12px;">
            El Atlas implementa una <strong>Arquitectura Estática Espacial sin Servidor</strong> (<em>Client-Side Serverless Static Architecture</em>), ejecutándose íntegramente en el navegador del cliente mediante tecnologías web abiertas y peticiones asíncronas optimizadas (<code>Fetch API</code>). Esta formulación garantiza independencia frente a servidores de mapas propietarios de pago, eliminando vulnerabilidades de obsolescencia de paquetes compilados y asegurando su operación perpetua en <strong>Netlify</strong> y <strong>GitHub Pages</strong>.
          </p>

          <h4 style="color:#38bdf8; margin:14px 0 8px 0;">1. Stack Tecnológico Consolidado</h4>
          <ul style="padding-left:20px; color:var(--tinta-suave); font-size:0.88rem; line-height:1.65;">
            <li><strong>Front-End</strong>: HTML5 semántico estructurado en 10 módulos (pestañas <code>00</code> a <code>09</code>) y CSS3 puro con variables nativas en <code>src/css/estilos.css</code> (diseño táctico oscuro, ratios WCAG 2.1 AA y microcomponentes de geometrías).</li>
            <li><strong>Lógica de Aplicación</strong>: Vanilla JavaScript ES6+ modular basado en el Patrón de Módulo Revelador (IIFE), encapsulando el estado interno en objetos globales <code>window.Modulo...</code>.</li>
            <li><strong>Motor Cartográfico y Geodesia</strong>: Leaflet 1.9.4 complementado por un motor geodésico propio en <code>src/js/modulos/geodesia.js</code> con cálculo métrico conforme en el elipsoide WGS84 para la Zona UTM 19 Sur (<code>EPSG:32719</code>; Snyder, 1987).</li>
            <li><strong>Procesamiento y Auditoría</strong>: Suite en Python 3.10+ para verificación topológica, validación de esquemas JSON, cálculo de metacalidad (ISO 19115/19157) y reproyecciones.</li>
            <li><strong>Formatos Cartográficos</strong>: Formato de intercambio web <code>GeoJSON</code> (RFC 7946; Butler et al., 2016) en coordenadas <code>EPSG:4326</code>, y persistencia de bases relacionales en <code>OGC GeoPackage (.gpkg)</code> para resguardar los comentarios SQLite de columnas de SUBDERE RSD 2024.</li>
          </ul>

          <h4 style="color:#fbbf24; margin:16px 0 8px 0;">2. Matriz de Componentes y Responsabilidades de Mantención</h4>
          <div style="overflow-x:auto; border:1px solid var(--linea-tarjeta); border-radius:10px;">
            <table class="tabla-metadatos" style="width:100%; font-size:0.83rem;">
              <thead>
                <tr>
                  <th>Ruta del Componente</th>
                  <th>Responsabilidad en el Sistema</th>
                  <th>Protocolo de Intervención</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>src/index.html</code></td>
                  <td>Estructura DOM única: 10 módulos, visor, acordeones de capas, modales de Storyboards y CIN-VGI.</td>
                  <td>Inserción de controles <code>.chip-oficial</code> para nuevas coberturas e incremento de versión <code>?v=...</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/config.js</code></td>
                  <td>Bbox territorial, coordenadas de encuadre, comunas RM y definición de las <strong>10 categorías VGI</strong>.</td>
                  <td>Modificación de metadatos o simbología de las coberturas comunitarias OpenStreetMap y GBIF.</td>
                </tr>
                <tr>
                  <td><code>src/js/app.js</code></td>
                  <td>Controlador maestro, eventos de mapa, filtros espaciales e <strong>ICV dinámico</strong> en tiempo real.</td>
                  <td>Ajuste de umbrales del Índice de Calidad VGI en <code>actualizarTelemetriaCapasActivas()</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/ide_chile.js</code></td>
                  <td>Catálogo maestro de las <strong>121 capas oficiales del Estado</strong> (<code>CAPAS_OFICIALES</code>).</td>
                  <td>Registro de coberturas estatales con ruta <code>archivoLocal</code>, color, geometría y licencia.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/evaluador_normativo.js</code></td>
                  <td>Inspector Normativo PRC/OGUC, Certificado CIN-VGI y 10 hitos históricos del PRC (1990–2024).</td>
                  <td>Actualización de normas urbanas en <code>FUENTES_ORDENANZAS_IPT</code> o adición de hitos en <code>HITOS_HISTORICOS_PRC_BRASIL</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/indicadores_analisis.js</code></td>
                  <td>Módulo 09: <strong>5 Dimensiones Analíticas</strong> (131 capas) y <strong>7 Storyboards</strong> territoriales.</td>
                  <td>Asignación de capas en <code>DIMENSIONES</code> o edición del arreglo de objetos analíticos <code>STORYBOARDS</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/diccionario.js</code></td>
                  <td>Módulo 06: Diccionario de Datos de los <strong>140 descriptores técnicos</strong> (ISO 19110:2016).</td>
                  <td>Documentación de columnas y tipos de datos de nuevas coberturas en <code>CATALOGO_DICCIONARIO</code>.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        id: 'cap-act-02',
        parte: 'actualizacion',
        numero: 'ACT · 02',
        icono: '➕',
        titulo: 'Procedimiento Integral de Integración de Nuevas Coberturas (6 Etapas)',
        subtitulo: 'Protocolo secuencial estandarizado para la ingesta de capas vectoriales oficiales o comunitarias.',
        html: `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Etapa 1 · Normalización Geodésica a <code>EPSG:4326</code>:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                La cobertura debe proyectarse en coordenadas geográficas <strong><code>EPSG:4326</code> (WGS84 / SIRGAS-Chile, grados decimales)</strong>. Se exporta en formato <code>GeoJSON</code> con codificación UTF-8 sin BOM (ejemplo: <code>bbdd_99.geojson</code>).
              </span>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Etapa 2 · Almacenamiento Simétrico en <code>data/</code> y <code>src/data/</code>:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                El archivo debe copiarse de forma idéntica en <code>data/bbdd_99.geojson</code> y <code>src/data/bbdd_99.geojson</code>. Si dispone de base GeoPackage (.gpkg) original con diccionarios nativos, resguardarla paralelamente en ambos directorios.
              </span>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Etapa 3 · Registro en <code>src/js/modulos/ide_chile.js</code> (<code>CAPAS_OFICIALES</code>):</strong>
              <pre style="background:#090d16; padding:9px; border-radius:6px; font-size:0.77rem; color:#e2e8f0; overflow-x:auto; margin:6px 0 0 0;"><code>bbdd_99: {
  id: 'bbdd_99',
  nombre: 'Puntos Limpios y Reciclaje Barrial (BBDD-99)',
  institucion: 'Ilustre Municipalidad de Santiago / MMA',
  archivoLocal: 'data/bbdd_99.geojson',
  color: '#10b981',
  peso: 2,
  opacidadRelleno: 0.35,
  geometria: 'Punto', // 'Punto' | 'Línea' | 'Polígono'
  num_bbdd: 99,
  licencia: 'Datos Abiertos / Ley 20.285',
  descripcion: 'Catastro georreferenciado de infraestructura de reciclaje en el Barrio Brasil.'
},</code></pre>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Etapa 4 · Incorporación del Control Interactivo en <code>src/index.html</code>:</strong>
              <pre style="background:#090d16; padding:9px; border-radius:6px; font-size:0.77rem; color:#e2e8f0; overflow-x:auto; margin:6px 0 0 0;"><code>&lt;button type="button" class="chip-oficial" id="btn-oficial-bbdd_99" data-capa="bbdd_99" title="Ilustre Municipalidad de Santiago / MMA"&gt;
  &lt;span class="dot-color" style="background:#10b981;"&gt;&lt;/span&gt;
  &lt;span class="nombre-chip"&gt;99. Puntos Limpios y Reciclaje Barrial&lt;/span&gt;
  &lt;span class="badge-institucion-chip"&gt;MUNISTGO&lt;/span&gt;
  &lt;span class="badge-geom-chip"&gt;● PUN&lt;/span&gt;
&lt;/button&gt;</code></pre>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Etapa 5 · Asignación Dimensional y Catalogación Atributiva:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                En <code>src/js/modulos/indicadores_analisis.js</code>, añadir el nombre en <code>NOMBRES_OFICIALES_FALLBACK</code> y asociar <code>'bbdd_99'</code> al arreglo <code>capasIds</code> de la dimensión analítica correspondiente en <code>DIMENSIONES</code>. En <code>src/js/modulos/diccionario.js</code>, documentar los atributos de la capa en <code>CATALOGO_DICCIONARIO</code>.
              </span>
            </div>

            <div style="background:rgba(16,185,129,0.1); border-left:4px solid #10b981; padding:11px 15px; border-radius:8px;">
              <strong style="color:#34d399;">Etapa 6 · Actualización de Geometrías sin Cambio de Identificador:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                Cuando únicamente se actualizan las entidades conservando el nombre de archivo existente, basta con sobrescribir el archivo en <code>data/</code> y <code>src/data/</code> bajo <code>EPSG:4326</code>. El motor del visor procesa los nuevos datos automáticamente sin requerir cambios en el código JavaScript.
              </span>
            </div>
          </div>
        `
      },
      {
        id: 'cap-act-03',
        parte: 'actualizacion',
        numero: 'ACT · 03',
        icono: '📊',
        titulo: 'Mantención de Storyboards, Evaluador Normativo y Diccionario',
        subtitulo: 'Esquema canónico de láminas de análisis, actualización de enmiendas al PRC y metadatos ISO 19110.',
        html: `
          <h4 style="color:#f59e0b; margin:0 0 6px 0;">1. Estructura Obligatoria para Nuevos Storyboards (Módulo 09)</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6; margin-bottom:10px;">
            Para garantizar que el modal <code>abrirLaminaStoryboard</code> se abra sin errores, todo nuevo storyboard en <code>src/js/modulos/indicadores_analisis.js</code> debe definir obligatoriamente las siguientes 10 propiedades en <code>contenido</code>:
          </p>
          <ul style="padding-left:20px; color:var(--tinta-suave); font-size:0.86rem; line-height:1.65; margin-bottom:14px;">
            <li><code>introduccion</code>: Párrafo de apertura o síntesis ejecutiva (cadena de texto).</li>
            <li><code>datosClave</code>: Arreglo de 4 tarjetas KPI con <code>{ valor, label, sub }</code>.</li>
            <li><code>porcentajesClave</code>: Arreglo de barras con <code>{ label, valor, porcentaje, contexto }</code>.</li>
            <li><code>graficoComparativo</code>: Objeto con <code>titulo</code> y arreglo <code>filas</code> de <code>{ label, valor, porcentaje }</code>.</li>
            <li><code>diagramaSVG</code>: Función flecha <code>() =&gt; \`&lt;svg ...&gt;...\`</code> que retorna el código vectorial SVG.</li>
            <li><code>tablaIndicadores</code>: Arreglo de filas cuantitativas con <code>{ variable, valor, referencial, fuente }</code>.</li>
            <li><code>cuerpo</code>: Arreglo de cadenas de texto con los párrafos analíticos profundos.</li>
            <li><code>conclusion</code>: Síntesis de implicancia territorial y políticas públicas (cadena de texto).</li>
            <li><code>analisisPorActor</code>: Arreglo de 4 perfiles de usuarios-tipo con <code>{ id, icono, nombre, subtitulo, utilidad }</code> (usar IDs <code>institucion</code>, <code>comunidad</code>, <code>voluntario</code>, <code>ong</code>).</li>
            <li><code>apartadoBibliografico</code>: Objeto con arreglos <code>fuentesDatos</code> y <code>referenciasAcademicas</code> (norma APA 7ª ed.).</li>
          </ul>

          <h4 style="color:#38bdf8; margin:14px 0 6px 0;">2. Actualización del Evaluador Normativo e Hitos Históricos del PRC</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6;">
            En <code>src/js/modulos/evaluador_normativo.js</code>, el arreglo <code>HITOS_HISTORICOS_PRC_BRASIL</code> documenta la trayectoria regulatoria comunal. Al promulgarse una nueva enmienda o seccional en la Municipalidad de Santiago, se añade un nuevo objeto con <code>anio</code>, <code>hito</code> y <code>detalle</code>. Los datos se propagan automáticamente al inspector del visor y al Certificado CIN-VGI descargable.
          </p>

          <h4 style="color:#a855f7; margin:14px 0 6px 0;">3. Catálogo de Descriptores Técnicos (ISO 19110:2016)</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6;">
            En <code>src/js/modulos/diccionario.js</code>, cada cobertura registrada cuenta con su especificación formal en <code>CATALOGO_DICCIONARIO</code>, definiendo código, título, institución custodia, tipo geométrico, norma legal y matriz de atributos con nombre de columna, tipo de dato y descripción semántica.
          </p>
        `
      },
      {
        id: 'cap-act-04',
        parte: 'actualizacion',
        numero: 'ACT · 04',
        icono: '🧪',
        titulo: 'Suite de Verificación Automatizada, Control de Caché y Despliegue',
        subtitulo: 'Batería de scripts Python pre-despliegue, invalidación de caché (?v=...) y publicación a producción.',
        html: `
          <h4 style="color:#34d399; margin:0 0 6px 0;">1. Verificación Pre-Despliegue Obligatoria</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6;">
            Previo a cualquier commit en producción, deben ejecutarse desde la raíz del repositorio los tres scripts de auditoría en Python:
          </p>
          <pre style="background:#090d16; padding:11px; border-radius:8px; font-size:0.79rem; color:#34d399; overflow-x:auto;"><code># 1. Audita la paridad de 131 capas (121 oficiales + 10 VGI) y 140 descriptores:
python scripts/verificar_conteo_capas.py

# 2. Audita integridad de archivos GeoJSON, ausencia de punteros LFS y paridad data/ <-> src/data/:
python scripts/verificar_integridad_despliegue.py

# 3. Calcula el Índice Global de MetaCalidad (ISO 19115 / ISO 19157):
python scripts/analisis_metacalidad.py</code></pre>

          <h4 style="color:#fbbf24; margin:14px 0 6px 0;">2. Control de Versión de Caché (Cache-Busting)</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6;">
            Al modificar archivos <code>.js</code> o <code>.css</code>, se incrementa el parámetro de versión <code>?v=...</code> en las etiquetas <code>&lt;link&gt;</code> y <code>&lt;script&gt;</code> de <code>src/index.html</code> (por ejemplo, de <code>?v=20261015_v5</code> a <code>?v=20261015_v6</code>), asegurando que los clientes web no retengan scripts obsoletos.
          </p>

          <h4 style="color:#38bdf8; margin:14px 0 6px 0;">3. Publicación en Producción (GitHub y Netlify)</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6;">
            Con los tres scripts en estado <code>[OK] EXITO</code>, los cambios se envían a la rama principal:
          </p>
          <pre style="background:#090d16; padding:11px; border-radius:8px; font-size:0.79rem; color:#38bdf8; overflow-x:auto;"><code>git add -A
git commit -m "Fix: Actualización técnica y documental del Atlas VGI"
git push origin main</code></pre>
          <p style="font-size:0.85rem; color:var(--tinta-tenue); margin-top:6px;">
            Netlify detectará el push en <code>main</code> y sincronizará la versión pública automáticamente en segundos.
          </p>
        `
      },
      {
        id: 'cap-act-05',
        parte: 'actualizacion',
        numero: 'ACT · 05',
        icono: '⚖️',
        titulo: 'Matriz de Diagnóstico de Incidencias y Régimen Jurídico de Datos',
        subtitulo: 'Guía de resolución de problemas técnicos frecuentes y marco legal de licenciamiento abierto.',
        html: `
          <h4 style="color:#ef4444; margin:0 0 8px 0;">1. Matriz de Diagnóstico y Resolución Rápida de Errores</h4>
          <div style="overflow-x:auto; border:1px solid var(--linea-tarjeta); border-radius:10px; margin-bottom:16px;">
            <table class="tabla-metadatos" style="width:100%; font-size:0.82rem;">
              <thead>
                <tr>
                  <th>Síntoma Técnico</th>
                  <th>Causa Identificada</th>
                  <th>Procedimiento de Solución</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>La capa no se dibuja en el mapa.</strong></td>
                  <td>Archivo exportado en coordenadas planas UTM (<code>EPSG:32719</code>) en vez de geográficas (<code>EPSG:4326</code>).</td>
                  <td>Reproyectar a <code>EPSG:4326</code> en QGIS o Python y sobrescribir en <code>data/</code> y <code>src/data/</code>.</td>
                </tr>
                <tr>
                  <td><strong>Error 404 al activar cobertura.</strong></td>
                  <td>Discrepancia entre la ruta de <code>archivoLocal</code> en <code>ide_chile.js</code> y el archivo en <code>src/data/</code>.</td>
                  <td>Verificar coincidencia estricta de caracteres en minúscula en la ruta del archivo.</td>
                </tr>
                <tr>
                  <td><strong>Modal de Storyboard no abre al hacer clic.</strong></td>
                  <td>Incompatibilidad de esquema en <code>indicadores_analisis.js</code> (falta alguna propiedad requerida).</td>
                  <td>Comprobar en la consola (F12) que <code>datosClave</code>, <code>porcentajesClave</code>, <code>filas</code> y <code>diagramaSVG()</code> existan.</td>
                </tr>
                <tr>
                  <td><strong>Modificaciones no visibles en navegador.</strong></td>
                  <td>Retención de archivos en caché local.</td>
                  <td>Incrementar <code>?v=...</code> en <code>src/index.html</code> y forzar recarga (Ctrl + F5).</td>
                </tr>
                <tr>
                  <td><strong>Descuadre en script de conteo de capas.</strong></td>
                  <td>Capa registrada en <code>ide_chile.js</code> pero omitida en <code>indicadores_analisis.js</code> o <code>diccionario.js</code>.</td>
                  <td>Revisar el log del script para asociar la capa faltante a su dimensión correspondiente.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 style="color:#c084fc; margin:16px 0 8px 0;">2. Régimen Jurídico de Licencias y Protección de Datos</h4>
          <ul style="padding-left:20px; color:var(--tinta-suave); font-size:0.88rem; line-height:1.65; margin-bottom:14px;">
            <li><strong>Open Database License (ODbL 1.0)</strong>: Rige las categorías VGI provenientes de OpenStreetMap, exigiendo atribución y compartición bajo términos idénticos.</li>
            <li><strong>Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0)</strong>: Aplica sobre las capas de síntesis y productos cartográficos derivados generados por la Universidad Alberto Hurtado.</li>
            <li><strong>GNU Affero General Public License v3 (AGPLv3)</strong>: Licencia del código fuente de software, asegurando la libertad comunitaria de auditoría y mejora.</li>
            <li><strong>Ley N° 20.285 de Transparencia</strong>: Fundamenta la disponibilidad y reutilización de datos geográficos generados por organismos públicos del Estado de Chile.</li>
            <li><strong>Ley N° 19.628 de Protección de la Vida Privada</strong>: Garantizada mediante la anonimización y agregación espacial de microdatos (RSH, Censo, SII) a nivel de manzana y unidad vecinal.</li>
          </ul>

          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">
            <a href="docs/MANUAL_USO.md" download="MANUAL_USO_ATLAS_VGI.md" class="accion" style="text-decoration:none; font-size:0.82rem; padding:8px 14px;">📥 Descargar Manual de Uso (.md)</a>
            <a href="docs/MANUAL_ACTUALIZACION_ATLAS.md" download="MANUAL_ACTUALIZACION_ATLAS_VGI.md" class="accion" style="text-decoration:none; font-size:0.82rem; padding:8px 14px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#0f172a; font-weight:800;">🛠️ Descargar Manual de Actualización Técnica (.md)</a>
            <a href="docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md" download="BIBLIOGRAFIA_SEMINARIO_Y_ATLAS_APA7.md" class="accion secundaria" style="text-decoration:none; font-size:0.82rem; padding:8px 14px;">📚 Bibliografía APA 7ª Ed. (125 refs .md)</a>
            <a href="docs/TRAZABILIDAD_ACADEMICA.md" download="TRAZABILIDAD_ACADEMICA_ATLAS_VGI.md" class="accion secundaria" style="text-decoration:none; font-size:0.82rem; padding:8px 14px;">🏛️ Memoria y Trazabilidad Académica (.md)</a>
          </div>
        `
      }
    ];
  }

  /**
   * Construye el HTML completo del Manual de Uso y Manual de Actualización
   */
  function construirHTMLManual() {
    const capitulos = obtenerCapitulosManual();
    const capsFiltrados = modoManualActivo === 'todos'
      ? capitulos
      : capitulos.filter(c => c.parte === modoManualActivo);

    const htmlIndice = capsFiltrados.map(c => {
      const badgeColor = c.parte === 'actualizacion'
        ? 'background:rgba(245,158,11,0.18); color:#fbbf24; border:1px solid rgba(245,158,11,0.4);'
        : 'background:rgba(56,189,248,0.18); color:#38bdf8; border:1px solid rgba(56,189,248,0.4);';
      return `
        <button type="button" class="accion secundaria" onclick="ModuloManual.irACapitulo('${c.id}')" style="text-align:left; display:flex; align-items:center; gap:8px; padding:9px 12px; font-size:0.83rem;">
          <span style="padding:2px 6px; border-radius:5px; font-size:0.7rem; font-weight:800; ${badgeColor}">${c.numero}</span>
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${c.icono} ${c.titulo}</span>
        </button>
      `;
    }).join('');

    const htmlCapitulos = capsFiltrados.map(c => {
      const bordeColor = c.parte === 'actualizacion' ? '#f59e0b' : '#38bdf8';
      const etiquetaParte = c.parte === 'actualizacion'
        ? '🛠️ PARTE II · MANUAL DE ACTUALIZACIÓN Y MANTENCIÓN TÉCNICA'
        : '📘 PARTE I · MANUAL DE USO DEL ATLAS';
      return `
        <article class="tarjeta-manual-capitulo" id="${c.id}" style="background:rgba(15,23,42,0.45); border:1px solid var(--linea-tarjeta); border-top:3px solid ${bordeColor}; border-radius:12px; padding:22px; margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <span style="font-size:0.75rem; font-weight:800; letter-spacing:0.04em; color:${bordeColor};">${etiquetaParte} — ${c.numero}</span>
          </div>
          <h3 style="margin:0 0 6px 0; font-size:1.18rem; color:var(--tinta);">${c.icono} ${c.titulo}</h3>
          <p style="margin:0 0 14px 0; font-size:0.88rem; color:var(--tinta-tenue); border-bottom:1px solid var(--linea); padding-bottom:10px;">${c.subtitulo}</p>
          <div class="cuerpo-capitulo-manual">
            ${c.html}
          </div>
        </article>
      `;
    }).join('');

    return `
      <!-- Barra superior de selección entre Manual de Uso y Manual de Actualización -->
      <div style="background:rgba(15,23,42,0.75); border:1px solid var(--linea-tarjeta); border-radius:12px; padding:16px; margin-bottom:18px; display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="accion ${modoManualActivo === 'todos' ? '' : 'secundaria'}" onclick="ModuloManual.cambiarModoManual('todos')" style="font-size:0.85rem; padding:8px 14px;">
              📚 Ambos Manuales
            </button>
            <button type="button" class="accion ${modoManualActivo === 'uso' ? '' : 'secundaria'}" onclick="ModuloManual.cambiarModoManual('uso')" style="font-size:0.85rem; padding:8px 14px;">
              📘 Parte I: Manual de Uso
            </button>
            <button type="button" class="accion ${modoManualActivo === 'actualizacion' ? '' : 'secundaria'}" onclick="ModuloManual.cambiarModoManual('actualizacion')" style="font-size:0.85rem; padding:8px 14px;">
              🛠️ Parte II: Manual de Actualización Técnica
            </button>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <input type="search" id="buscador-general-manual" placeholder="🔍 Filtrar documentación..." oninput="ModuloManual.filtrarManual(this.value)" style="padding:7px 12px; border-radius:8px; border:1px solid var(--linea); background:rgba(9,13,22,0.85); color:var(--tinta); min-width:210px;">
            <a href="docs/MANUAL_USO.md" download="MANUAL_USO_ATLAS_VGI.md" class="accion secundaria" style="text-decoration:none; font-size:0.8rem; padding:7px 12px;">📥 Uso (.md)</a>
            <a href="docs/MANUAL_ACTUALIZACION_ATLAS.md" download="MANUAL_ACTUALIZACION_ATLAS_VGI.md" class="accion secundaria" style="text-decoration:none; font-size:0.8rem; padding:7px 12px; border-color:#f59e0b; color:#fbbf24;">🛠️ Actualización (.md)</a>
            <a href="docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md" download="BIBLIOGRAFIA_SEMINARIO_Y_ATLAS_APA7.md" class="accion secundaria" style="text-decoration:none; font-size:0.8rem; padding:7px 12px;">📚 Bibliografía APA (.md)</a>
          </div>
        </div>

        <!-- Índice rápido de capítulos -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:8px;">
          ${htmlIndice}
        </div>
      </div>

      <!-- Contenedor de capítulos -->
      <div id="lista-capitulos-manual">
        ${htmlCapitulos}
      </div>
    `;
  }

  /**
   * Renderiza el Manual de Uso y el Manual de Actualización en el contenedor del Módulo 08
   */
  function renderizarManual() {
    const html = construirHTMLManual();
    const contenedor = document.getElementById('contenido-manual') || document.getElementById('contenedor-manual-uso');
    if (contenedor) {
      contenedor.innerHTML = html;
    }
    return html;
  }

  /**
   * Alias compatible con cargarResumenMetodologia() en app.js
   */
  function render() {
    return construirHTMLManual();
  }

  /**
   * Alterna entre ver 'todos', solo 'uso' o solo 'actualizacion'
   */
  function cambiarModoManual(modo) {
    modoManualActivo = modo || 'todos';
    renderizarManual();
  }

  /**
   * Desplaza suavemente la vista hacia un capítulo específico del manual
   */
  function irACapitulo(idCapitulo) {
    const el = document.getElementById(idCapitulo);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Navega directamente a cualquiera de los 10 módulos del Atlas (00 al 09)
   */
  function irAPanel(panelId) {
    const mapaAlias = {
      'inicio': 'inicio',
      'osm': 'explorador-osm',
      'explorador-osm': 'explorador-osm',
      'calidad': 'calidad-ohsome',
      'calidad-ohsome': 'calidad-ohsome',
      'gbif': 'biodiversidad-gbif',
      'biodiversidad-gbif': 'biodiversidad-gbif',
      'umap': 'proyectos-umap',
      'proyectos-umap': 'proyectos-umap',
      'metadatos': 'metadatos-iso',
      'metadatos-iso': 'metadatos-iso',
      'diccionario': 'diccionario',
      'licencias': 'licencias',
      'manual': 'manual',
      'indicadores': 'indicadores'
    };
    const idReal = mapaAlias[panelId] || panelId;

    if (typeof window.activarPanel === 'function') {
      window.activarPanel(idReal);
      return;
    }

    const btn = document.querySelector(`button[data-panel="${idReal}"]`);
    if (btn) btn.click();
  }

  /**
   * Filtra los capítulos del manual por texto libre
   */
  function filtrarManual(termino) {
    const q = String(termino || '').trim().toLowerCase();
    const articulos = document.querySelectorAll('.tarjeta-manual-capitulo');
    articulos.forEach(art => {
      if (!q) {
        art.style.display = '';
      } else {
        const texto = (art.textContent || '').toLowerCase();
        art.style.display = texto.includes(q) ? '' : 'none';
      }
    });
  }

  /**
   * Filtra las filas de la tabla de las 131 capas dentro del capítulo USO · 04
   */
  function filtrarTablaCatalogo(termino) {
    const q = String(termino || '').trim().toLowerCase();
    const filas = document.querySelectorAll('.fila-catalogo-manual');
    filas.forEach(fila => {
      if (!q) {
        fila.style.display = '';
      } else {
        const data = fila.getAttribute('data-busqueda') || '';
        fila.style.display = data.includes(q) ? '' : 'none';
      }
    });
  }

  return {
    render,
    renderizarManual,
    cambiarModoManual,
    irACapitulo,
    irAPanel,
    filtrarManual,
    filtrarTablaCatalogo
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloManual = ModuloManual;
}
