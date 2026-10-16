/*
  manual.js
  ---------
  Módulo 08: Manual de Uso y Manual de Actualización Técnica del Atlas VGI (UAH).
  Redactado en formato de reporte técnico-profesional sintético y riguroso.

  Integra:
  - Parte I: Manual de Uso del Atlas (Estructura general, operación de los Módulos 00 al 09,
    ICV Dinámico, Inspector Normativo PRC/OGUC con expediente histórico 1990-2024 y Catálogo de las 131 capas).
  - Parte II: Manual de Actualización y Mantención Técnica (Arquitectura estática, sincronización espejo
    data/ y src/data/, base dual .geojson + .gpkg, protocolo de 6 pasos para agregar capas, edición de
    indicadores/storyboards/normativa, integración de ajustes finales de validación y despliegue a producción).
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
        descripcion: cat.descripcion || 'Capa temática colaborativa.'
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
        descripcion: capa.descripcion || 'Capa oficial del catálogo territorial.'
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
        titulo: 'Alcance y Estructura General del Sistema',
        subtitulo: 'Síntesis operativa de las 131 capas geográficas, 140 descriptores técnicos y 10 módulos funcionales.',
        html: `
          <p style="font-size:0.94rem; line-height:1.7; color:var(--tinta-suave);">
            El <strong>Atlas de Información Geográfica Voluntaria (Atlas VGI — UAH)</strong> integra la cartografía oficial del Estado de Chile con información geográfica voluntaria (VGI) para el diagnóstico multiescalar, la auditoría normativa y la gestión territorial del <strong>Barrio Brasil</strong>, el entorno del Campus Universidad Alberto Hurtado y la Región Metropolitana.
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:14px; margin:16px 0;">
            <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.3); border-radius:10px; padding:14px;">
              <div style="font-size:1.35rem; font-weight:800; color:#38bdf8;">131 Capas Operativas</div>
              <div style="font-size:0.85rem; color:var(--tinta-suave); margin-top:4px;">
                <strong>121 capas oficiales</strong> (MINVU, INE Censo 2024, MTT/UOCT, MDSF RSH, SUBDERE Residuos 2024, CMN, MMA, SII) y <strong>10 categorías VGI</strong> (OpenStreetMap y GBIF) en <code>EPSG:4326</code>.
              </div>
            </div>
            <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:14px;">
              <div style="font-size:1.35rem; font-weight:800; color:#fbbf24;">140 Descriptores Técnicos</div>
              <div style="font-size:0.85rem; color:var(--tinta-suave); margin-top:4px;">
                Documentación de atributos por capa y tablas de referencia en el <strong>Módulo 06</strong>, incluyendo los diccionarios nativos de las geodatabases <code>.gpkg</code> de SUBDERE.
              </div>
            </div>
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:14px;">
              <div style="font-size:1.35rem; font-weight:800; color:#34d399;">5 Dimensiones y 7 Storyboards</div>
              <div style="font-size:0.85rem; color:var(--tinta-suave); margin-top:4px;">
                Clasificación analítica multidimensional y 7 estudios aplicados sobre patrimonio, movilidad, biodiversidad, educación, cuidados, residuos sólidos y evolución normativa PRC.
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
        subtitulo: 'Uso del visor cartográfico, cálculo en tiempo real del Índice de Calidad VGI (ICV) y evaluación del Plan Regulador Comunal.',
        html: `
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:rgba(15,23,42,0.55); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:15px;">
              <h4 style="margin:0 0 6px 0; color:#38bdf8;">1. Control de Capas, Recorte Territorial y Exportación</h4>
              <ul style="margin:0; padding-left:20px; color:var(--tinta-suave); font-size:0.89rem; line-height:1.65;">
                <li><strong>Selección de ámbito:</strong> Utilice el selector superior para enfocar el <em>Barrio Brasil Completo</em> o la <em>Manzana UAH</em>, o dibuje un área específica mediante <strong>⛶ Dibujar Bbox</strong>.</li>
                <li><strong>Activación simultánea:</strong> Desde el subpanel <strong>🏛 Capas IDE</strong> y los botones de categorías VGI puede superponer capas oficiales y comunitarias (se recomienda activar entre 2 y 4 capas a la vez para preservar la legibilidad visual).</li>
                <li><strong>Inspección de atributos y descarga:</strong> Al hacer clic sobre cualquier entidad en el mapa, la ventana emergente muestra sus atributos normalizados, su fuente y un botón para exportar el registro en <code>GeoJSON</code>. El botón <strong>📦 Base de Datos (.zip)</strong> descarga el repositorio completo.</li>
              </ul>
            </div>

            <div style="background:rgba(15,23,42,0.55); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:15px;">
              <h4 style="margin:0 0 6px 0; color:#34d399;">2. Índice de Calidad VGI (ICV) Dinámico</h4>
              <p style="margin:0; color:var(--tinta-suave); font-size:0.89rem; line-height:1.65;">
                El subpanel <strong>📊 Métricas</strong> calcula el Índice de Calidad VGI en tiempo real a partir de las capas activas en el visor (función <code>actualizarTelemetriaCapasActivas</code>):
              </p>
              <ul style="margin:6px 0 0 0; padding-left:20px; color:var(--tinta-suave); font-size:0.87rem; line-height:1.6;">
                <li><strong>Completitud Espacial:</strong> Porcentaje de entidades activas con geometría válida y campos atributivos completos.</li>
                <li><strong>Actualidad Reciente:</strong> Año o trimestre más reciente detectado en los atributos temporales y metadatos de las capas encendidas.</li>
                <li><strong>Atribución Completa:</strong> Proporción de registros con custodia institucional y licencia verificada.</li>
              </ul>
            </div>

            <div style="background:rgba(15,23,42,0.55); border:1px solid rgba(245,158,11,0.4); border-radius:10px; padding:15px;">
              <h4 style="margin:0 0 6px 0; color:#fbbf24;">3. Inspector Normativo PRC/OGUC y Expediente Histórico (1990–2024)</h4>
              <p style="margin:0 0 8px 0; color:var(--tinta-suave); font-size:0.89rem; line-height:1.65;">
                Al activar <strong>⚖ Inspector Normativo</strong> y hacer clic sobre un punto del mapa, el sistema cruza las coberturas regulatorias y genera el <strong>Certificado de Informaciones Normativas VGI (CIN-VGI)</strong>:
              </p>
              <ul style="margin:0 0 12px 0; padding-left:20px; color:var(--tinta-suave); font-size:0.87rem; line-height:1.6;">
                <li>Evalúa la zonificación comunal (<code>PRC</code>) e intercomunal (<code>PRMS</code>), usos permitidos (<code>UPERM</code>) y usos prohibidos (<code>UPROH</code>) bajo el principio de exclusión negativa del <strong>Art. 2.1.24 de la OGUC</strong>, además de áreas de riesgo (Art. 2.1.17 OGUC) y protección patrimonial (ZCH, ICH, Monumentos Nacionales).</li>
                <li>Integra la síntesis de las <strong>10 modificaciones históricas al PRC de Santiago que inciden en el Barrio Brasil (1990–2024)</strong> (Res. N° 26/1990, Seccional Brasil, Modificaciones N° 16, 21, 26 y 31, Enmienda N° 2 de Cités, Enmiendas de Altura N° 1, 3 y 6 y postergaciones Art. 117 LGUC) con acceso directo al repositorio oficial de Asesoría Urbana de la Municipalidad de Santiago.</li>
              </ul>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="accion" onclick="ModuloManual.irAPanel('inicio')" style="font-size:0.83rem; padding:7px 14px;">🗺️ Ir al Módulo 00 (Visor)</button>
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
        titulo: 'Síntesis Funcional de los Módulos 00 al 09',
        subtitulo: 'Descripción técnica de cada módulo de la plataforma y acceso directo.',
        html: `
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(295px, 1fr)); gap:12px;">
            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#38bdf8;">MÓDULO 00</span>
                <h4 style="margin:4px 0 6px 0;">Visor para la gestión territorial</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Visualización conjunta de las 131 capas, métricas dinámicas ICV, Inspector Normativo PRC/OGUC e importador de archivos locales.</p>
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
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Evaluación multicriterio WLC bajo norma ISO 19157, series históricas ohsome API (HeiGIT) y control de ediciones OSMCha.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('calidad-ohsome')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 02 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#34d399;">MÓDULO 03</span>
                <h4 style="margin:4px 0 6px 0;">Biodiversidad GBIF</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Consulta de ocurrencias biológicas georreferenciadas de flora, fauna y funga urbana validadas en GBIF e iNaturalist.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('biodiversidad-gbif')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 03 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#34d399;">MÓDULO 04</span>
                <h4 style="margin:4px 0 6px 0;">Cartografía uMap</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Integración de mapas colaborativos uMap para talleres de cartografía participativa y validación comunitaria.</p>
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
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Glosario técnico de atributos, homologación SNIT/IDE Chile y diccionario de columnas SUBDERE RSD 2024.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('diccionario')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 06 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--linea-tarjeta); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#c084fc;">MÓDULO 07</span>
                <h4 style="margin:4px 0 6px 0;">Licencias &amp; Catálogos (.xlsx)</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Marco jurídico (ODbL 1.0, CC-BY 4.0, Ley N° 20.285, Ley N° 19.628) y descarga directa de matrices en Excel.</p>
              </div>
              <button type="button" class="accion secundaria" onclick="ModuloManual.irAPanel('licencias')" style="margin-top:10px; font-size:0.8rem;">Abrir Módulo 07 ↗</button>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(168,85,247,0.45); border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.74rem; font-weight:800; color:#c084fc;">MÓDULO 09</span>
                <h4 style="margin:4px 0 6px 0;">Indicadores &amp; Storyboards</h4>
                <p style="font-size:0.84rem; color:var(--tinta-suave); line-height:1.55;">Las 131 capas agrupadas en 5 Dimensiones Analíticas y 7 Storyboards territoriales del Barrio Brasil.</p>
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
        titulo: `Catálogo General de las ${totalCapas} Capas Integradas (121 Oficiales + 10 VGI)`,
        subtitulo: 'Inventario dinámico con filtro instantáneo por código, institución custodia o temática.',
        html: `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
            <p style="margin:0; font-size:0.88rem; color:var(--tinta-suave);">
              Consulte o filtre las <strong>${totalCapas} capas operativas</strong> registradas en la plataforma:
            </p>
            <input type="search" id="input-filtro-catalogo-manual" placeholder="🔍 Filtrar capas (ej: SUBDERE, PRC, Censo, VGI)..." oninput="ModuloManual.filtrarTablaCatalogo(this.value)" style="min-width:280px; padding:7px 12px; border-radius:8px; border:1px solid var(--linea); background:rgba(15,23,42,0.8); color:var(--tinta);">
          </div>
          <div style="max-height:420px; overflow-y:auto; border:1px solid var(--linea-tarjeta); border-radius:10px;">
            <table class="tabla-metadatos" style="width:100%; border-collapse:collapse; font-size:0.83rem;">
              <thead style="position:sticky; top:0; background:#0f172a; z-index:2;">
                <tr>
                  <th style="padding:10px; text-align:left;">Código</th>
                  <th style="padding:10px; text-align:left;">Nombre de Capa y Ruta</th>
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
        titulo: 'Arquitectura del Sistema y Estructura de Archivos',
        subtitulo: 'Principios de diseño, sincronización espejo data/ <-> src/data/ y almacenamiento dual (.geojson + .gpkg).',
        html: `
          <p style="font-size:0.9rem; line-height:1.65; color:var(--tinta-suave); margin-bottom:12px;">
            La arquitectura actual del Atlas constituye la estructura consolidada del proyecto. Toda modificación, adición de capas o incorporación de ajustes finales (validación por usuarios y análisis específicos) se realiza sobre tres principios técnicos:
          </p>

          <ol style="padding-left:20px; color:var(--tinta-suave); font-size:0.89rem; line-height:1.7;">
            <li><strong>Arquitectura Estática Autónoma (HTML5 + CSS3 + Vanilla JS):</strong> El sistema se ejecuta íntegramente en el navegador del cliente sin requerir servidores de mapas de pago ni bases de datos externas obligatorias, asegurando su disponibilidad permanente en <strong>Netlify</strong> y <strong>GitHub</strong>.</li>
            <li><strong>Sincronización Espejo (Raíz y <code>src/</code>):</strong> Dado que <code>netlify.toml</code> publica el directorio <code>src/</code> (<code>publish = "src"</code>) mientras los scripts de control operan desde la raíz, todo archivo en <code>data/</code> debe replicarse exactamente en <code>src/data/</code> (y los documentos de <code>docs/</code> en <code>src/docs/</code>).</li>
            <li><strong>Almacenamiento Cartográfico Dual (<code>.geojson</code> + <code>.gpkg</code>):</strong> Las 131 capas visualizables se sirven en formato <code>.geojson</code> bajo coordenadas geográficas <strong><code>EPSG:4326</code> (WGS84 / SIRGAS-Chile)</strong>. Paralelamente, se conservan en <code>data/</code> y <code>src/data/</code> los archivos originales <code>.gpkg</code> de aquellas fuentes que contienen diccionarios técnicos nativos en comentarios de columnas SQLite (como las 13 capas de Residuos Sólidos Domiciliarios SUBDERE 2024, <code>bbdd_86</code> a <code>bbdd_98</code>).</li>
          </ol>

          <h4 style="color:#38bdf8; margin:16px 0 8px 0;">Mapa de Archivos Clave para Mantención</h4>
          <div style="overflow-x:auto; border:1px solid var(--linea-tarjeta); border-radius:10px;">
            <table class="tabla-metadatos" style="width:100%; font-size:0.83rem;">
              <thead>
                <tr>
                  <th>Ruta del Archivo</th>
                  <th>Función en el Sistema</th>
                  <th>Intervención Requerida al Actualizar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>src/index.html</code></td>
                  <td>Estructura DOM única: pestañas 00 a 09, visor, acordeones de capas y carga de scripts.</td>
                  <td>Agregar botones <code>.chip-oficial</code> para nuevas capas y actualizar el parámetro de caché <code>?v=...</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/config.js</code></td>
                  <td>Parámetros base, Bbox territorial, comunas RM y definición de las <strong>10 categorías VGI</strong>.</td>
                  <td>Editar metadatos o simbología de las 10 categorías colaborativas VGI.</td>
                </tr>
                <tr>
                  <td><code>src/js/app.js</code></td>
                  <td>Controlador principal del mapa, filtros espaciales, popups e <strong>ICV dinámico</strong> (<code>actualizarTelemetriaCapasActivas</code>).</td>
                  <td>Ajustar umbrales del Índice de Calidad VGI o lógica de interacción en el mapa.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/ide_chile.js</code></td>
                  <td>Catálogo maestro de las <strong>121 capas oficiales</strong> (<code>CAPAS_OFICIALES</code>).</td>
                  <td>Registrar toda nueva capa oficial indicando su ruta <code>archivoLocal</code>, color y metadatos.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/evaluador_normativo.js</code></td>
                  <td>Inspector Normativo PRC/OGUC, Certificado CIN-VGI e historial de modificaciones PRC (1990–2024).</td>
                  <td>Actualizar reglas urbanísticas en <code>FUENTES_ORDENANZAS_IPT</code> o hitos en <code>HITOS_HISTORICOS_PRC_BRASIL</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/indicadores_analisis.js</code></td>
                  <td>Módulo 09: Agrupación en <strong>5 Dimensiones Analíticas</strong> y <strong>7 Storyboards</strong> del Barrio Brasil.</td>
                  <td>Asignar nuevas capas a <code>DIMENSIONES</code> o editar/añadir objetos en <code>STORYBOARDS</code>.</td>
                </tr>
                <tr>
                  <td><code>src/js/modulos/diccionario.js</code></td>
                  <td>Módulo 06: Catálogo de los <strong>140 descriptores técnicos</strong> de columnas y capas.</td>
                  <td>Documentar las columnas de cualquier capa nueva en <code>CATALOGO_DICCIONARIO</code>.</td>
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
        titulo: 'Protocolo para Integrar o Actualizar Capas Geográficas (6 Pasos)',
        subtitulo: 'Procedimiento estandarizado para incorporar nuevas coberturas o actualizar registros existentes.',
        html: `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Paso 1 · Normalización Cartográfica a <code>EPSG:4326</code>:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                Exporte la capa en formato <code>GeoJSON</code> (codificación UTF-8) reproyectada a coordenadas geográficas <strong><code>EPSG:4326</code> (WGS84, grados decimales)</strong>. No utilice coordenadas UTM en metros dentro del archivo GeoJSON.
              </span>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Paso 2 · Copia en Directorios Espejo (<code>data/</code> y <code>src/data/</code>):</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                Guarde el archivo (ejemplo: <code>bbdd_99.geojson</code>) tanto en <code>data/</code> como en <code>src/data/</code>.
              </span>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Paso 3 · Registro en <code>src/js/modulos/ide_chile.js</code> (<code>CAPAS_OFICIALES</code>):</strong>
              <pre style="background:#090d16; padding:9px; border-radius:6px; font-size:0.77rem; color:#e2e8f0; overflow-x:auto; margin:6px 0 0 0;"><code>bbdd_99: {
  id: 'bbdd_99',
  nombre: 'Nombre Oficial de la Capa (BBDD-99)',
  institucion: 'Institución Custodia',
  archivoLocal: 'data/bbdd_99.geojson',
  color: '#10b981',
  peso: 2,
  opacidadRelleno: 0.35,
  geometria: 'Punto', // 'Punto' | 'Línea' | 'Polígono'
  num_bbdd: 99,
  licencia: 'Datos Abiertos / Ley 20.285',
  descripcion: 'Descripción sintética de la cobertura.'
},</code></pre>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Paso 4 · Inserción del Botón en <code>src/index.html</code> (<code>#subpanel-ide</code>):</strong>
              <pre style="background:#090d16; padding:9px; border-radius:6px; font-size:0.77rem; color:#e2e8f0; overflow-x:auto; margin:6px 0 0 0;"><code>&lt;button type="button" class="chip-oficial" id="btn-oficial-bbdd_99" data-capa="bbdd_99"&gt;
  &lt;span class="dot-color" style="background:#10b981;"&gt;&lt;/span&gt;
  &lt;span class="nombre-chip"&gt;99. Nombre Oficial de la Capa&lt;/span&gt;
  &lt;span class="badge-institucion-chip"&gt;SIGLA&lt;/span&gt;
  &lt;span class="badge-geom-chip"&gt;● PUN&lt;/span&gt;
&lt;/button&gt;</code></pre>
            </div>

            <div style="background:rgba(15,23,42,0.6); border-left:4px solid #38bdf8; padding:11px 15px; border-radius:8px;">
              <strong style="color:#38bdf8;">Paso 5 · Vinculación en <code>indicadores_analisis.js</code> y <code>diccionario.js</code>:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                Añada el ID <code>'bbdd_99'</code> al arreglo <code>capasIds</code> de la dimensión correspondiente en <code>src/js/modulos/indicadores_analisis.js</code>, e incorpore la definición de sus columnas en <code>CATALOGO_DICCIONARIO</code> dentro de <code>src/js/modulos/diccionario.js</code>.
              </span>
            </div>

            <div style="background:rgba(16,185,129,0.1); border-left:4px solid #10b981; padding:11px 15px; border-radius:8px;">
              <strong style="color:#34d399;">Paso 6 · Actualización de Capas Existentes sin Cambio de ID:</strong>
              <span style="font-size:0.87rem; color:var(--tinta-suave); display:block; margin-top:3px;">
                Si solo reemplaza las geometrías o registros de una capa existente manteniendo el mismo nombre de archivo en <code>data/</code> y <code>src/data/</code>, no requiere modificar ningún archivo JavaScript ni HTML.
              </span>
            </div>
          </div>
        `
      },
      {
        id: 'cap-act-03',
        parte: 'actualizacion',
        numero: 'ACT · 03',
        icono: '🔧',
        titulo: 'Ajustes de Validación, Verificación Automatizada y Despliegue a Producción',
        subtitulo: 'Integración de resultados de validación de usuarios, ejecución de scripts de control y publicación Git.',
        html: `
          <h4 style="color:#fbbf24; margin:0 0 6px 0;">1. Integración de Ajustes de Análisis y Validación por Usuarios</h4>
          <ul style="padding-left:20px; color:var(--tinta-suave); font-size:0.88rem; line-height:1.65; margin-bottom:14px;">
            <li><strong>Actualización de levantamientos participativos:</strong> Exporte las geometrías validadas en talleres (uMap/OSM) en <code>EPSG:4326</code> y actualice <code>data/capa_percepcion.geojson</code> y <code>src/data/capa_percepcion.geojson</code>.</li>
            <li><strong>Edición o adición de Storyboards (Módulo 09):</strong> Modifique el arreglo <code>STORYBOARDS</code> en <code>src/js/modulos/indicadores_analisis.js</code>. Al inicializarse el módulo, la vista se actualiza dinámicamente.</li>
            <li><strong>Ajuste de ponderaciones de calidad (Módulo 02 y Módulo 00):</strong> Edite los pesos WLC en <code>src/js/modulos/evaluador_calidad_cuantitativa.js</code> o los umbrales de clasificación en <code>actualizarTelemetriaCapasActivas()</code> (<code>src/js/app.js</code>).</li>
          </ul>

          <h4 style="color:#38bdf8; margin:14px 0 6px 0;">2. Comandos de Verificación y Despliegue a Producción</h4>
          <p style="font-size:0.88rem; color:var(--tinta-suave); line-height:1.6;">
            Desde la raíz del repositorio (<code>atlas_vgi_uah</code>), ejecute la batería de auditoría antes de realizar el envío a producción:
          </p>
          <pre style="background:#090d16; padding:11px; border-radius:8px; font-size:0.79rem; color:#34d399; overflow-x:auto;"><code># 1. Auditar cuadratura de 131 capas (121 oficiales + 10 VGI) y 140 descriptores:
python scripts/verificar_conteo_capas.py

# 2. Auditar integridad de archivos GeoJSON y paridad entre data/ y src/data/:
python scripts/verificar_integridad_despliegue.py

# 3. Actualizar matriz cuantitativa de metacalidad:
python scripts/analisis_metacalidad.py

# 4. Publicar en Producción (GitHub / Netlify):
git add -A
git commit -m "Actualización técnica y documental del Atlas VGI"
git push origin main</code></pre>

          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;">
            <a href="docs/MANUAL_USO.md" download="MANUAL_USO_ATLAS_VGI.md" class="accion" style="text-decoration:none; font-size:0.84rem; padding:9px 15px;">📥 Descargar Manual de Uso (.md)</a>
            <a href="docs/MANUAL_ACTUALIZACION_ATLAS.md" download="MANUAL_ACTUALIZACION_ATLAS_VGI.md" class="accion" style="text-decoration:none; font-size:0.84rem; padding:9px 15px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#0f172a; font-weight:800;">🛠️ Descargar Manual de Actualización Técnica (.md)</a>
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
            <input type="search" id="buscador-general-manual" placeholder="🔍 Buscar en la documentación..." oninput="ModuloManual.filtrarManual(this.value)" style="padding:7px 12px; border-radius:8px; border:1px solid var(--linea); background:rgba(9,13,22,0.85); color:var(--tinta); min-width:220px;">
            <a href="docs/MANUAL_USO.md" download="MANUAL_USO_ATLAS_VGI.md" class="accion secundaria" style="text-decoration:none; font-size:0.8rem; padding:7px 12px;">📥 Uso (.md)</a>
            <a href="docs/MANUAL_ACTUALIZACION_ATLAS.md" download="MANUAL_ACTUALIZACION_ATLAS_VGI.md" class="accion secundaria" style="text-decoration:none; font-size:0.8rem; padding:7px 12px; border-color:#f59e0b; color:#fbbf24;">🛠️ Actualización (.md)</a>
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
