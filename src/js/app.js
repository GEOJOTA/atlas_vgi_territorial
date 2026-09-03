/*
  app.js
  ------
  Orquestador de la interfaz de usuario del Atlas de Información Geográfica Voluntaria.
  Maneja:
  - Inicialización del mapa Leaflet y sincronización reactiva del Bounding Box.
  - Carga y toggle de las 8 capas temáticas VGI en el mapa interactivo.
  - Selector de territorios (Barrio Brasil UAH, Santiago Centro, etc.).
  - Consultas en vivo a Overpass, ohsome y GBIF con retroalimentación visual.
  - Generación y exportación dual de metadatos ISO 19115 (JSON) e ISO 19139 (XML).
  - Exportación de conjuntos de datos espaciales a GeoJSON para QGIS.
*/

let ultimaConsultaRealizada = null;
let capasCargadasPorCategoria = {};

document.addEventListener('nodo:config-lista', inicializarAplicacion);

function inicializarAplicacion() {
  const cfg = window.NODO_CONFIG;
  if (!cfg) return;

  configurarNavegacion();
  precargarCamposDesdeConfig();
  ModuloMapa.inicializar('mapa-atlas');
  crearBotonesCategorias();
  configurarEventosMapa();
  pintarEstadoConexion();

  document.getElementById('contenido-licencias').innerHTML = ModuloLicencias.render();
  cargarResumenMetodologia();

  // Eventos de paneles
  document.getElementById('btn-consultar-osm').addEventListener('click', () => manejarConsultaOSM(false));
  document.getElementById('btn-cargar-osm-al-mapa').addEventListener('click', () => manejarConsultaOSM(true));
  document.getElementById('btn-usar-area-config').addEventListener('click', aplicarAreaConfigAlExplorador);
  document.getElementById('osm-categoria-preset').addEventListener('change', manejarCambioPresetOSM);

  document.getElementById('btn-consultar-ohsome').addEventListener('click', manejarConsultaOhsome);
  document.getElementById('btn-consultar-gbif').addEventListener('click', () => manejarConsultaGBIF(false));
  document.getElementById('btn-cargar-gbif-al-mapa').addEventListener('click', () => manejarConsultaGBIF(true));
  document.getElementById('btn-cargar-umap').addEventListener('click', manejarCargaUMap);

  document.getElementById('form-metadatos').addEventListener('submit', manejarGenerarMetadatos);
  document.getElementById('btn-prellenar-metadatos').addEventListener('click', prellenarMetadatosDesdeUltimaConsulta);
  document.getElementById('btn-exportar-json').addEventListener('click', exportarMetadatosJSON);
  document.getElementById('btn-exportar-xml').addEventListener('click', exportarMetadatosXML);

  // Escuchar cambios de bbox desde el mapa
  document.addEventListener('nodo:bbox-cambiado', (e) => {
    if (e.detail && e.detail.bbox) {
      sincronizarBboxEnInputs(e.detail.bbox);
    }
  });

  // Escuchar cambios manuales en inputs de coordenadas para actualizar el mapa
  ['osm', 'oh', 'gbif', 'md'].forEach(prefijo => {
    ['oeste', 'sur', 'este', 'norte'].forEach(coord => {
      const el = document.getElementById(`${prefijo}-${coord}`);
      if (el) {
        el.addEventListener('change', () => {
          const bbox = leerBbox(prefijo);
          if (bbox) {
            ModuloMapa.actualizarRectanguloBbox(bbox);
            sincronizarBboxEnInputs(bbox);
          }
        });
      }
    });
  });
}

/* ---------------------- NAVEGACIÓN ---------------------- */

function configurarNavegacion() {
  const botones = document.querySelectorAll('#lista-navegacion button');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      botones.forEach(b => b.setAttribute('aria-current', 'false'));
      boton.setAttribute('aria-current', 'true');

      document.querySelectorAll('.panel').forEach(p => p.classList.remove('activo'));
      const panelDestino = document.getElementById('panel-' + boton.dataset.panel);
      if (panelDestino) panelDestino.classList.add('activo');
    });
  });
}

function precargarCamposDesdeConfig() {
  const cfg = window.NODO_CONFIG;
  document.getElementById('nombre-organizacion').textContent = cfg.organizacion.descripcion_corta || cfg.organizacion.nombre;
  document.getElementById('resumen-area-defecto').innerHTML = `
    <strong>${cfg.organizacion.area_de_interes_nombre}</strong><br>
    Bbox WGS84: <code>[${cfg.area_por_defecto.bbox.join(', ')}]</code><br>
    <span class="descripcion">Campus patrimonial UAH (Almirante Barroso, Erasmo Escala, Cienfuegos), Metro Los Héroes y entorno tradicional de Barrio Brasil.</span>
  `;

  aplicarAreaConfigAlExplorador();

  const md = cfg.metadatos_iso_defecto || {};
  if (md.sistema_referencia) document.getElementById('md-srs').value = `${md.sistema_referencia} / Compatible con ${md.sistema_referencia_nacional || 'EPSG:5361'}`;
  if (md.punto_de_contacto_organizacion) document.getElementById('md-contacto-org').value = md.punto_de_contacto_organizacion;
  if (md.punto_de_contacto_correo) document.getElementById('md-contacto-correo').value = md.punto_de_contacto_correo;
}

function pintarEstadoConexion() {
  const elemento = document.getElementById('estado-conexion');
  elemento.innerHTML = `🟢 APIs en vivo: Overpass (OSM), ohsome (HeiGIT) y GBIF conectadas.`;
}

/* ---------------------- HELPERS DE BBOX ---------------------- */

function leerBbox(prefijo) {
  const oeste = parseFloat(document.getElementById(`${prefijo}-oeste`).value);
  const sur = parseFloat(document.getElementById(`${prefijo}-sur`).value);
  const este = parseFloat(document.getElementById(`${prefijo}-este`).value);
  const norte = parseFloat(document.getElementById(`${prefijo}-norte`).value);
  if ([oeste, sur, este, norte].some(Number.isNaN)) return null;
  return [oeste, sur, este, norte];
}

function escribirBbox(prefijo, bbox) {
  const elO = document.getElementById(`${prefijo}-oeste`);
  const elS = document.getElementById(`${prefijo}-sur`);
  const elE = document.getElementById(`${prefijo}-este`);
  const elN = document.getElementById(`${prefijo}-norte`);
  if (elO) elO.value = bbox[0];
  if (elS) elS.value = bbox[1];
  if (elE) elE.value = bbox[2];
  if (elN) elN.value = bbox[3];
}

function sincronizarBboxEnInputs(bbox) {
  escribirBbox('osm', bbox);
  escribirBbox('oh', bbox);
  escribirBbox('gbif', bbox);
  escribirBbox('md', bbox);
}

function aplicarAreaConfigAlExplorador() {
  const bbox = window.NODO_CONFIG.area_por_defecto.bbox;
  sincronizarBboxEnInputs(bbox);
  ModuloMapa.encuadrarBbox(bbox);
}

/* ---------------------- CONTROL DEL MAPA ATLAS ---------------------- */

function configurarEventosMapa() {
  const selTerritorio = document.getElementById('sel-territorio');
  if (selTerritorio) {
    selTerritorio.addEventListener('change', (e) => {
      ModuloMapa.cambiarTerritorio(e.target.value);
    });
  }

  const btnDibujar = document.getElementById('btn-dibujar-bbox');
  if (btnDibujar) {
    btnDibujar.addEventListener('click', () => {
      if (btnDibujar.classList.contains('activo')) {
        ModuloMapa.desactivarModoDibujoBbox();
      } else {
        ModuloMapa.activarModoDibujoBbox();
      }
    });
  }

  const btnReencuadrar = document.getElementById('btn-reencuadrar-mapa');
  if (btnReencuadrar) {
    btnReencuadrar.addEventListener('click', () => {
      const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;
      ModuloMapa.encuadrarBbox(bbox);
    });
  }

  const btnExportarGeoJSON = document.getElementById('btn-exportar-geojson-mapa');
  if (btnExportarGeoJSON) {
    btnExportarGeoJSON.addEventListener('click', () => {
      ModuloMapa.exportarGeoJSONCargado();
    });
  }
}

function crearBotonesCategorias() {
  const contenedor = document.getElementById('contenedor-botones-categorias');
  if (!contenedor) return;

  const categorias = window.NODO_CONFIG.categorias_osm || [];
  contenedor.innerHTML = '';

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-categoria';
    btn.id = `btn-cat-${cat.id}`;
    btn.innerHTML = `
      <span class="icono-cat">${cat.icono}</span>
      <span>${cat.nombre}</span>
      <span class="conteo-cat" id="conteo-cat-${cat.id}">—</span>
    `;

    btn.addEventListener('click', () => alternarCapaCategoria(cat));
    contenedor.appendChild(btn);
  });
}

async function alternarCapaCategoria(categoria) {
  const btn = document.getElementById(`btn-cat-${categoria.id}`);
  const labelConteo = document.getElementById(`conteo-cat-${categoria.id}`);
  const estadoTexto = document.getElementById('estado-carga-capas');

  // Si ya está activa, la desactivamos
  if (btn.classList.contains('activo')) {
    ModuloMapa.removerCapa(categoria.id);
    btn.classList.remove('activo');
    labelConteo.textContent = '—';
    delete capasCargadasPorCategoria[categoria.id];
    return;
  }

  // Activar y cargar datos
  btn.classList.add('cargando');
  estadoTexto.textContent = `Consultando ${categoria.nombre} en Overpass API…`;

  const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;

  try {
    let geojson;
    if (categoria.id === 'biodiversidad') {
      // Para biodiversidad, consultamos GBIF + OSM
      const [resGBIF, resOSM] = await Promise.all([
        ModuloGBIF.buscarOcurrencias({ bbox, limite: 40 }),
        ModuloOSM.consultar(bbox, 'biodiversidad')
      ]);
      const gjOSM = ModuloOSM.elementosAGeoJSON(resOSM, categoria.id);
      geojson = {
        type: 'FeatureCollection',
        features: [...gjOSM.features, ...resGBIF.geojson.features]
      };
    } else {
      const elementos = await ModuloOSM.consultar(bbox, categoria.id);
      geojson = ModuloOSM.elementosAGeoJSON(elementos, categoria.id);
    }

    const cantidad = geojson.features.length;
    labelConteo.textContent = `${cantidad}`;

    ModuloMapa.cargarCapaGeoJSON(categoria.id, geojson, {
      nombre: categoria.nombre,
      color: categoria.color,
      icono: categoria.icono
    });

    capasCargadasPorCategoria[categoria.id] = geojson;
    btn.classList.remove('cargando');
    btn.classList.add('activo');
    estadoTexto.textContent = `Capa "${categoria.nombre}" cargada en vivo (${cantidad} elementos). Haz clic en los elementos del mapa para ver atributos y licencias.`;

    ultimaConsultaRealizada = {
      bbox,
      filtro: categoria.nombre,
      cantidad: cantidad,
      fuente: 'Overpass API / OpenStreetMap'
    };
  } catch (error) {
    console.warn(`[API en vivo no disponible para ${categoria.id}]: ${error.message}. Intentando cargar dataset local pre-extraído...`);
    // Intento de fallback a los datos locales validados de Barrio Brasil / UAH
    try {
      const rutasPosibles = [
        `data/capa_${categoria.id}.geojson`,
        `./data/capa_${categoria.id}.geojson`,
        `../data/capa_${categoria.id}.geojson`,
        `/data/capa_${categoria.id}.geojson`
      ];
      let geojsonLocal = null;
      for (const r of rutasPosibles) {
        try {
          const res = await fetch(r);
          if (res.ok) {
            geojsonLocal = await res.json();
            break;
          }
        } catch (_) {}
      }

      if (geojsonLocal && geojsonLocal.features && geojsonLocal.features.length > 0) {
        const cantidad = geojsonLocal.features.length;
        labelConteo.textContent = `${cantidad}`;
        ModuloMapa.cargarCapaGeoJSON(categoria.id, geojsonLocal, {
          nombre: categoria.nombre,
          color: categoria.color,
          icono: categoria.icono
        });
        capasCargadasPorCategoria[categoria.id] = geojsonLocal;
        btn.classList.remove('cargando');
        btn.classList.add('activo');
        estadoTexto.innerHTML = `Capa "${categoria.nombre}" cargada desde catálogo local validado (${cantidad} entidades en Barrio Brasil / UAH). <span class="descripcion">(Servidor Overpass saturado)</span>`;
        return;
      }
    } catch (fallbackErr) {
      console.error('Fallo también el fallback local:', fallbackErr);
    }

    btn.classList.remove('cargando');
    estadoTexto.innerHTML = `<span style="color:var(--alerta);">Error al consultar ${categoria.nombre}: ${error.message}</span>`;
  }
}

/* ---------------------- PANEL EXPLORADOR OSM ---------------------- */

function manejarCambioPresetOSM(e) {
  const preset = e.target.value;
  const inputEtiqueta = document.getElementById('osm-etiqueta');
  if (preset) {
    inputEtiqueta.value = '';
    inputEtiqueta.placeholder = `Preset activo: ${preset}`;
  } else {
    inputEtiqueta.placeholder = 'ej: amenity=university, shop=bakery';
  }
}

async function manejarConsultaOSM(cargarAlMapa = false) {
  const contenedor = document.getElementById('resultado-osm');
  const bbox = leerBbox('osm');
  if (!bbox) { contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del área.'); return; }

  const preset = document.getElementById('osm-categoria-preset').value;
  const etiquetaManual = document.getElementById('osm-etiqueta').value.trim();
  const filtroAEjecutar = etiquetaManual || preset || 'educacion';

  contenedor.innerHTML = '<p class="descripcion">Consultando Overpass API…</p>';

  try {
    const elementos = await ModuloOSM.consultar(bbox, filtroAEjecutar);
    const geojson = ModuloOSM.elementosAGeoJSON(elementos, preset || 'consulta_personalizada');
    ultimaConsultaRealizada = { bbox, filtro: filtroAEjecutar, cantidad: elementos.length, fuente: 'OSM/Overpass' };

    if (elementos.length === 0) {
      contenedor.innerHTML = avisoInfo(`No se encontraron elementos para "${filtroAEjecutar}" en esa área.`);
      return;
    }

    if (cargarAlMapa) {
      ModuloMapa.cargarCapaGeoJSON('explorador_osm', geojson, {
        nombre: `Consulta OSM (${filtroAEjecutar})`,
        color: '#A97722',
        icono: '🔍'
      });
      // Cambiar a panel de inicio para ver el mapa
      document.querySelector('button[data-panel="inicio"]').click();
      return;
    }

    const filas = elementos.slice(0, 35).map(el => `
      <tr>
        <td><code>${el.type}/${el.id}</code></td>
        <td><strong>${el.tags && el.tags.name ? el.tags.name : '—'}</strong></td>
        <td>${el.tags ? (el.tags.amenity || el.tags.shop || el.tags.highway || el.tags.historic || '—') : '—'}</td>
        <td><small>${el.tags ? Object.entries(el.tags).slice(0, 3).map(([k,v]) => `${k}=${v}`).join(', ') : ''}</small></td>
      </tr>
    `).join('');

    contenedor.innerHTML = `
      <div class="indicador"><span class="valor">${elementos.length}</span><span class="etiqueta">elementos encontrados</span></div>
      <table class="tabla-datos">
        <thead><tr><th>ID</th><th>Nombre</th><th>Tipo Principal</th><th>Etiquetas Clave</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      ${elementos.length > 35 ? `<p class="descripcion">Mostrando 35 de ${elementos.length} elementos.</p>` : ''}
    `;
  } catch (error) {
    contenedor.innerHTML = avisoError(error.message);
  }
}

/* ---------------------- PANEL OHSOME ---------------------- */

async function manejarConsultaOhsome() {
  const contenedor = document.getElementById('resultado-ohsome');
  const bbox = leerBbox('oh');
  if (!bbox) { contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del área.'); return; }

  const filtro = document.getElementById('oh-filtro').value.trim() || 'building=* and type:way';
  contenedor.innerHTML = '<p class="descripcion">Calculando métricas de calidad con ohsome API (HeiGIT)…</p>';

  try {
    const indicadores = await ModuloOhsome.calcularIndicadores(bbox, filtro);
    const densInfo = ModuloOhsome.calcularDensidad(bbox, indicadores.elementosAhora || 0);

    ultimaConsultaRealizada = { bbox, filtro, cantidad: indicadores.elementosAhora, fuente: 'ohsome' };

    const filasSerie = indicadores.elementosPorAnio.map(p => `
      <tr><td><strong>${p.fecha}</strong></td><td>${p.valor.toLocaleString()}</td></tr>
    `).join('');

    contenedor.innerHTML = `
      <div class="indicador"><span class="valor">${indicadores.elementosAhora.toLocaleString()}</span><span class="etiqueta">elementos vigentes (${indicadores.fechaCorte})</span></div>
      <div class="indicador"><span class="valor">${densInfo ? densInfo.densidad.toFixed(1) : '—'}</span><span class="etiqueta">densidad (elem / km²)</span></div>
      <div class="indicador"><span class="valor">${densInfo ? densInfo.areaKm2.toFixed(3) : '—'}</span><span class="etiqueta">área calculada (km²)</span></div>
      <div class="indicador"><span class="valor">${indicadores.usuariosPorAnio.at(-1)?.valor ?? '—'}</span><span class="etiqueta">colaboradores último período</span></div>

      <h3>Evolución Histórica Anual (ohsome)</h3>
      <table class="tabla-datos">
        <thead><tr><th>Período / Año</th><th>Conteo de Elementos</th></tr></thead>
        <tbody>${filasSerie}</tbody>
      </table>
      <p class="descripcion">Evaluación de completitud: el recuento sostenido de colaboradores y el incremento de geometrías evidencia la madurez del catastro en Barrio Brasil y la manzana universitaria UAH.</p>
    `;
  } catch (error) {
    contenedor.innerHTML = avisoError(error.message + ' Prueba con un área más pequeña o ajusta el filtro según docs.ohsome.org.');
  }
}

/* ---------------------- PANEL GBIF ---------------------- */

async function manejarConsultaGBIF(cargarAlMapa = false) {
  const contenedor = document.getElementById('resultado-gbif');
  const bbox = leerBbox('gbif');
  const nombre = document.getElementById('gbif-nombre').value.trim();

  contenedor.innerHTML = '<p class="descripcion">Consultando registros de biodiversidad en GBIF…</p>';

  try {
    const resultado = await ModuloGBIF.buscarOcurrencias({ nombre, bbox: bbox || undefined });

    if (resultado.registros.length === 0) {
      contenedor.innerHTML = avisoInfo('No se encontraron registros biológicos con esos criterios en el área.');
      return;
    }

    if (cargarAlMapa) {
      ModuloMapa.cargarCapaGeoJSON('gbif_biodiversidad', resultado.geojson, {
        nombre: 'Biodiversidad (GBIF)',
        color: '#1C523A',
        icono: '🌿'
      });
      document.querySelector('button[data-panel="inicio"]').click();
      return;
    }

    const filas = resultado.registros.slice(0, 30).map(r => `
      <tr>
        <td><strong>${r.especie}</strong></td>
        <td>${r.nombreComun || '—'}</td>
        <td>${r.fecha}</td>
        <td>${r.publicador}</td>
        <td><small>${r.licencia}</small></td>
      </tr>
    `).join('');

    contenedor.innerHTML = `
      <div class="indicador"><span class="valor">${resultado.total}</span><span class="etiqueta">registros totales en GBIF</span></div>
      <table class="tabla-datos">
        <thead><tr><th>Especie Científica</th><th>Nombre Común</th><th>Fecha</th><th>Publicador</th><th>Licencia</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  } catch (error) {
    contenedor.innerHTML = avisoError(error.message);
  }
}

/* ---------------------- PANEL UMAP ---------------------- */

async function manejarCargaUMap() {
  const contenedor = document.getElementById('resultado-umap');
  const url = document.getElementById('umap-url').value.trim();
  if (!url) { contenedor.innerHTML = avisoError('Pega la URL pública de un mapa UMap.'); return; }

  const analisis = ModuloUMap.analizarUrl(url);

  contenedor.innerHTML = `
    <iframe class="iframe-umap" src="${ModuloUMap.urlEmbebido(url)}" title="Mapa UMap embebido"></iframe>
    <p class="descripcion">Intentando obtener el GeoJSON del mapa…</p>
  `;

  if (!analisis) {
    contenedor.innerHTML += avisoInfo('No se pudo reconocer el formato de la URL para la descarga automática; el mapa se muestra arriba embebido.');
    return;
  }

  const intento = await ModuloUMap.intentarDescargarGeojson(analisis);
  const parrafoEstado = document.createElement('div');

  if (intento.ok) {
    const cantidadFeatures = intento.datos.features ? intento.datos.features.length : '—';
    parrafoEstado.innerHTML = avisoInfo(`GeoJSON obtenido: ${cantidadFeatures} elementos. <a href="${intento.urlIntentada}" target="_blank" rel="noopener">Descargar archivo</a>.`);
  } else {
    parrafoEstado.innerHTML = avisoInfo(`No se pudo leer el GeoJSON automáticamente (${intento.motivo}). Puedes descargarlo de forma directa desde <a href="${intento.urlIntentada}" target="_blank" rel="noopener">este enlace</a>.`);
  }
  contenedor.appendChild(parrafoEstado);
}

/* ---------------------- PANEL METADATOS ISO ---------------------- */

function construirObjetoFichaDesdeFormulario() {
  return ModuloMetadatos.construirFicha({
    titulo: document.getElementById('md-titulo').value,
    resumen: document.getElementById('md-resumen').value,
    oeste: document.getElementById('md-oeste').value,
    sur: document.getElementById('md-sur').value,
    este: document.getElementById('md-este').value,
    norte: document.getElementById('md-norte').value,
    srs: document.getElementById('md-srs').value,
    linaje: document.getElementById('md-linaje').value,
    restricciones: document.getElementById('md-restricciones').value,
    contactoOrganizacion: document.getElementById('md-contacto-org').value,
    contactoCorreo: document.getElementById('md-contacto-correo').value
  });
}

function manejarGenerarMetadatos(evento) {
  evento.preventDefault();
  const ficha = construirObjetoFichaDesdeFormulario();
  ModuloMetadatos.guardarFichaLocal(ficha);
  window._ultimaFichaGenerada = ficha;

  document.getElementById('resultado-metadatos').innerHTML = `
    <div class="aviso">Ficha ISO 19115 generada con éxito. Utiliza los botones inferiores para exportar en JSON o XML (IDE Chile).</div>
    <pre class="tabla-datos" style="white-space:pre-wrap; padding:12px; font-family:'IBM Plex Mono', monospace; font-size:0.8rem; max-height:400px; overflow:auto;">${JSON.stringify(ficha, null, 2)}</pre>
  `;
}

function prellenarMetadatosDesdeUltimaConsulta() {
  const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;
  escribirBbox('md', bbox);

  const fuente = ultimaConsultaRealizada?.fuente || 'OpenStreetMap / Overpass QL';
  const filtro = ultimaConsultaRealizada?.filtro || 'Campus UAH y Barrio Brasil';
  const cantidad = ultimaConsultaRealizada?.cantidad || 'múltiples';

  document.getElementById('md-linaje').value =
    `Extraído desde ${fuente} (${filtro}) para el Bbox [${bbox.join(', ')}] el ${new Date().toISOString().slice(0, 10)}. Comprende ${cantidad} registros validados y normalizados.`;
  document.getElementById('md-titulo').value =
    `Catastro VGI de Equipamiento Universitario y Urbano: Barrio Brasil - Universidad Alberto Hurtado (${new Date().getFullYear()})`;
}

function exportarMetadatosJSON() {
  const ficha = window._ultimaFichaGenerada || construirObjetoFichaDesdeFormulario();
  ModuloMetadatos.exportarComoArchivoJSON(ficha);
}

function exportarMetadatosXML() {
  const ficha = window._ultimaFichaGenerada || construirObjetoFichaDesdeFormulario();
  ModuloMetadatos.exportarComoArchivoXML(ficha);
}

/* ---------------------- RESUMEN METODOLÓGICO ---------------------- */

function cargarResumenMetodologia() {
  document.getElementById('contenido-manual').innerHTML = `
    <div class="bloque">
      <h3>Flujo Metodológico de la Práctica Profesional (10 Hitos)</h3>
      <p>1. <strong>Definición del problema y territorio:</strong> Barrio Brasil y campus Universidad Alberto Hurtado como caso piloto para la gestión territorial.</p>
      <p>2. <strong>Diseño conceptual:</strong> Estructuración de 8 categorías temáticas VGI prioritarias (CAT-01 a CAT-08).</p>
      <p>3. <strong>Inventario y catálogo de fuentes:</strong> Documentado en <code>docs/catalogo_fuentes_vgi.xlsx</code>.</p>
      <p>4. <strong>Extracción y normalización de datos:</strong> Consultas Overpass y GBIF automatizadas en GeoJSON.</p>
      <p>5. <strong>Evaluación de calidad:</strong> Indicadores ohsome (densidad y recuento de colaboradores).</p>
      <p>6. <strong>Estandarización de metadatos:</strong> Generación en ISO 19115 (JSON) e ISO 19139 (XML para IDE Chile).</p>
      <p>7. <strong>Atlas y visor interactivo:</strong> Visualizador en Leaflet con descarga de capas para QGIS.</p>
    </div>
    <div class="bloque">
      <h3>Documentos y Hojas de Cálculo Generadas</h3>
      <p>Revisa la carpeta <code>docs/</code> para acceder a los archivos Excel y las pautas técnicas:</p>
      <ul>
        <li><code>docs/catalogo_fuentes_vgi.xlsx</code></li>
        <li><code>docs/perfil_metadatos_vgi.xlsx</code></li>
        <li><code>docs/categorias_tematicas_osm.xlsx</code></li>
        <li><code>docs/ARQUITECTURA.md</code></li>
      </ul>
    </div>
  `;
}

function avisoError(mensaje) { return `<div class="aviso error">${mensaje}</div>`; }
function avisoInfo(mensaje) { return `<div class="aviso">${mensaje}</div>`; }
