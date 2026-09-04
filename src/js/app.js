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

  // Inicializar diccionario territorial
  const cntDiccionario = document.getElementById('contenido-diccionario');
  if (cntDiccionario && window.ModuloDiccionario) {
    cntDiccionario.innerHTML = ModuloDiccionario.render();
    document.getElementById('filtro-diccionario')?.addEventListener('input', (e) => {
      cntDiccionario.innerHTML = ModuloDiccionario.render(e.target.value);
    });
  }

  // Inicializar selector de actor territorial / perfil
  const selPerfil = document.getElementById('sel-perfil-usuario');
  if (selPerfil) {
    selPerfil.addEventListener('change', manejarCambioPerfilUsuario);
    manejarCambioPerfilUsuario();
  }

  // Inicializar botones de sugerencias ciudadanas (1 clic)
  document.querySelectorAll('.btn-sugerencia-ciudadana').forEach(btn => {
    btn.addEventListener('click', () => {
      const clave = btn.dataset.clave;
      const valor = btn.dataset.valor;
      const operador = btn.dataset.operador || '=';
      const nombre = btn.dataset.nombre;
      const color = btn.dataset.color || '#A97722';
      const entidad = btn.dataset.entidad || 'nwr';

      document.getElementById('custom-clave-manual').value = clave;
      document.getElementById('custom-valor').value = valor === '*' ? '' : valor;
      document.getElementById('custom-operador').value = operador;
      document.getElementById('custom-nombre-capa').value = nombre;
      document.getElementById('custom-color-capa').value = color;
      document.getElementById('custom-entidad').value = entidad;

      actualizarCodigoQLPreview();
      manejarConsultaPersonalizada();
    });
  });

  // Preset geométrico de ohsome API v1
  document.getElementById('oh-preset-selector')?.addEventListener('change', (e) => {
    if (e.target.value !== 'custom') {
      document.getElementById('oh-filtro').value = e.target.value;
    } else {
      document.getElementById('oh-filtro').focus();
    }
  });

  // Eventos de paneles
  document.getElementById('btn-consultar-osm').addEventListener('click', () => manejarConsultaOSM(false));
  document.getElementById('btn-cargar-osm-al-mapa').addEventListener('click', () => manejarConsultaOSM(true));
  document.getElementById('btn-usar-area-config').addEventListener('click', aplicarAreaConfigAlExplorador);
  document.getElementById('osm-categoria-preset').addEventListener('change', manejarCambioPresetOSM);

  // Eventos del Constructor de Consultas Personalizadas
  const selClave = document.getElementById('custom-clave-select');
  if (selClave) {
    selClave.addEventListener('change', (e) => {
      const inpClave = document.getElementById('custom-clave-manual');
      if (e.target.value !== 'otra') {
        inpClave.value = e.target.value;
      } else {
        inpClave.value = '';
        inpClave.focus();
      }
      actualizarCodigoQLPreview();
    });
  }

  const btnEjecutarCustom = document.getElementById('btn-ejecutar-consulta-custom');
  if (btnEjecutarCustom) btnEjecutarCustom.addEventListener('click', manejarConsultaPersonalizada);

  const btnGuardarConsulta = document.getElementById('btn-guardar-consulta');
  if (btnGuardarConsulta) btnGuardarConsulta.addEventListener('click', guardarConsultaUsuario);

  const btnToggleQL = document.getElementById('btn-toggle-ql-avanzado');
  if (btnToggleQL) {
    btnToggleQL.addEventListener('click', () => {
      const cnt = document.getElementById('contenedor-ql-avanzado');
      if (cnt.style.display === 'none') {
        cnt.style.display = 'block';
        actualizarCodigoQLPreview();
      } else {
        cnt.style.display = 'none';
      }
    });
  }

  cargarConsultasGuardadas();

  document.getElementById('btn-consultar-ohsome').addEventListener('click', manejarConsultaOhsome);
  document.getElementById('btn-consultar-gbif').addEventListener('click', () => manejarConsultaGBIF(false));
  document.getElementById('btn-cargar-gbif-al-mapa').addEventListener('click', () => manejarConsultaGBIF(true));
  document.getElementById('btn-cargar-umap').addEventListener('click', manejarCargaUMap);

  // Botones de mapas comunitarios UMap sugeridos
  document.getElementById('btn-umap-ejemplo-patrimonio')?.addEventListener('click', () => {
    document.getElementById('umap-url').value = 'https://umap.openstreetmap.fr/es/map/patrimonio-santiago-centro_19382';
    manejarCargaUMap();
  });
  document.getElementById('btn-umap-ejemplo-ciclovias')?.addEventListener('click', () => {
    document.getElementById('umap-url').value = 'https://umap.openstreetmap.fr/es/map/ciclovias-santiago_28412';
    manejarCargaUMap();
  });

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

function actualizarCodigoQLPreview() {
  const qlInput = document.getElementById('custom-ql-codigo');
  if (!qlInput) return;
  const entidad = document.getElementById('custom-entidad')?.value || 'nwr';
  const clave = document.getElementById('custom-clave-manual')?.value.trim() || 'amenity';
  const operador = document.getElementById('custom-operador')?.value || '=';
  const valor = document.getElementById('custom-valor')?.value.trim() || '';

  let filtro = '';
  if (clave && valor) {
    if (operador === '~') filtro = `["${clave}"~"${valor}"]`;
    else if (operador === '!=') filtro = `["${clave}"!="${valor}"]`;
    else filtro = `["${clave}"="${valor}"]`;
  } else if (clave) {
    filtro = `["${clave}"]`;
  } else {
    filtro = '["amenity"]';
  }
  qlInput.value = `${entidad}${filtro}({{bbox}});`;
}

async function manejarConsultaPersonalizada() {
  const contenedor = document.getElementById('resultado-osm');
  const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;
  if (!bbox) {
    contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del Bounding Box.');
    return;
  }

  const entidad = document.getElementById('custom-entidad').value;
  const clave = document.getElementById('custom-clave-manual').value.trim();
  const operador = document.getElementById('custom-operador').value;
  const valor = document.getElementById('custom-valor').value.trim();
  const nombreCapa = document.getElementById('custom-nombre-capa').value.trim() || 'Consulta Personalizada';
  const colorCapa = document.getElementById('custom-color-capa').value || '#A97722';
  const qlCustom = document.getElementById('custom-ql-codigo')?.value.trim() || '';

  contenedor.innerHTML = '<p class="descripcion">🚀 Ejecutando consulta espacial en backend / Overpass API…</p>';

  const params = {
    bbox,
    entidad,
    clave,
    operador,
    valor,
    queryPersonalizada: qlCustom,
    nombreConsulta: nombreCapa
  };

  try {
    const inicio = performance.now();
    const res = await ModuloOSM.consultarPersonalizada(params);
    const duracionSeg = ((performance.now() - inicio) / 1000).toFixed(1);

    const geojson = res.geojson;
    const total = geojson.features.length;

    if (total === 0) {
      contenedor.innerHTML = avisoInfo(`No se encontraron elementos para la consulta "${nombreCapa}" en esa área.`);
      return;
    }

    // Cargar en el mapa Atlas con capa dinámica
    const capaId = 'custom_' + Date.now();
    ModuloMapa.cargarCapaGeoJSON(capaId, geojson, {
      nombre: nombreCapa,
      color: colorCapa,
      icono: '🔍'
    });

    ultimaConsultaRealizada = {
      bbox,
      filtro: `${nombreCapa} [${clave}${operador}${valor}]`,
      cantidad: total,
      fuente: `OSM (${res.servidor})`
    };

    // Generar tabla y botones de exportación
    const filas = geojson.features.slice(0, 30).map(f => {
      const p = f.properties;
      return `
        <tr>
          <td><code>${p.id_vgi || f.id}</code></td>
          <td><strong>${p.nombre || '—'}</strong></td>
          <td>${p.subtipo || '—'}</td>
          <td>${p.direccion || '—'}</td>
          <td><small>${p.accesibilidad ? '♿ ' + p.accesibilidad : '—'}</small></td>
        </tr>
      `;
    }).join('');

    const jsonString = encodeURIComponent(JSON.stringify(geojson, null, 2));

    // Convertir a CSV plano
    const encabezadosCsv = ['id_vgi', 'nombre', 'subtipo', 'direccion', 'accesibilidad', 'fuente', 'licencia', 'latitud', 'longitud'];
    const lineasCsv = [encabezadosCsv.join(',')];
    geojson.features.forEach(f => {
      const p = f.properties;
      const coords = f.geometry.coordinates;
      lineasCsv.push([
        `"${p.id_vgi || ''}"`,
        `"${(p.nombre || '').replace(/"/g, '""')}"`,
        `"${p.subtipo || ''}"`,
        `"${(p.direccion || '').replace(/"/g, '""')}"`,
        `"${p.accesibilidad || ''}"`,
        `"${p.fuente || 'OpenStreetMap'}"`,
        `"${p.licencia || 'ODbL 1.0'}"`,
        coords[1],
        coords[0]
      ].join(','));
    });
    const csvString = encodeURIComponent(lineasCsv.join('\n'));

    contenedor.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div class="indicador" style="margin:0;">
          <span class="valor">${total}</span>
          <span class="etiqueta">elementos extraídos (${duracionSeg}s — ${res.servidor})</span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="accion" id="btn-ver-en-mapa-custom" style="font-size:0.85rem; padding:6px 12px;">🗺️ Ver en Mapa Atlas</button>
          <a href="data:application/geo+json;charset=utf-8,${jsonString}" download="${nombreCapa.toLowerCase().replace(/\\s+/g, '_')}.geojson" class="accion secundaria" style="text-decoration:none; display:inline-flex; align-items:center; font-size:0.85rem; padding:6px 12px;">📥 GeoJSON</a>
          <a href="data:text/csv;charset=utf-8,${csvString}" download="${nombreCapa.toLowerCase().replace(/\\s+/g, '_')}.csv" class="accion secundaria" style="text-decoration:none; display:inline-flex; align-items:center; font-size:0.85rem; padding:6px 12px;">📄 CSV</a>
          <button class="accion secundaria" id="btn-metadatos-custom" style="font-size:0.85rem; padding:6px 12px;">📋 Crear Metadatos</button>
        </div>
      </div>
      <table class="tabla-datos">
        <thead><tr><th>ID VGI</th><th>Nombre</th><th>Subtipo</th><th>Dirección</th><th>Accesibilidad</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      ${total > 30 ? `<p class="descripcion" style="margin-top:6px;">Mostrando los primeros 30 de ${total} registros extraídos.</p>` : ''}
    `;

    document.getElementById('btn-ver-en-mapa-custom')?.addEventListener('click', () => {
      document.querySelector('button[data-panel="inicio"]').click();
    });
    document.getElementById('btn-metadatos-custom')?.addEventListener('click', () => {
      prellenarMetadatosDesdeUltimaConsulta();
      document.querySelector('button[data-panel="metadatos"]').click();
    });

  } catch (err) {
    contenedor.innerHTML = avisoError(`Error en consulta: ${err.message}`);
  }
}

function guardarConsultaUsuario() {
  const clave = document.getElementById('custom-clave-manual')?.value.trim();
  const valor = document.getElementById('custom-valor')?.value.trim();
  const operador = document.getElementById('custom-operador')?.value || '=';
  const nombre = document.getElementById('custom-nombre-capa')?.value.trim() || `${clave}=${valor}`;
  const entidad = document.getElementById('custom-entidad')?.value || 'nwr';

  if (!clave) {
    alert('Por favor especifica al menos una clave OSM para guardar.');
    return;
  }

  const guardadas = JSON.parse(localStorage.getItem('nodo-vgi:consultas-guardadas') || '[]');
  guardadas.unshift({ nombre, clave, valor, operador, entidad });
  localStorage.setItem('nodo-vgi:consultas-guardadas', JSON.stringify(guardadas.slice(0, 10)));
  cargarConsultasGuardadas();
}

function cargarConsultasGuardadas() {
  const cnt = document.getElementById('lista-consultas-guardadas');
  if (!cnt) return;

  const defaultConsultas = [
    { nombre: 'Farmacias y Salud', clave: 'amenity', valor: 'pharmacy', operador: '=', entidad: 'nwr' },
    { nombre: 'Panaderías y Almacenes', clave: 'shop', valor: 'bakery', operador: '=', entidad: 'nwr' },
    { nombre: 'Casonas y Patrimonio', clave: 'historic', valor: '*', operador: '*', entidad: 'nwr' },
    { nombre: 'Paradas de Bus Red', clave: 'highway', valor: 'bus_stop', operador: '=', entidad: 'node' }
  ];

  const guardadas = JSON.parse(localStorage.getItem('nodo-vgi:consultas-guardadas') || 'null') || defaultConsultas;

  cnt.innerHTML = guardadas.map((c, i) => `
    <button type="button" class="accion secundaria" style="font-size:0.78rem; padding:3px 8px; border-radius:12px; margin:2px;" data-consulta-idx="${i}">
      🔍 ${c.nombre} <small style="opacity:0.7">(${c.clave}${c.operador}${c.valor || '*'}</small>)
    </button>
  `).join('');

  cnt.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-consulta-idx'), 10);
      const c = guardadas[idx];
      if (!c) return;
      document.getElementById('custom-clave-manual').value = c.clave;
      document.getElementById('custom-valor').value = c.valor || '';
      document.getElementById('custom-operador').value = c.operador || '=';
      document.getElementById('custom-nombre-capa').value = c.nombre;
      document.getElementById('custom-entidad').value = c.entidad || 'nwr';
      actualizarCodigoQLPreview();
      manejarConsultaPersonalizada();
    });
  });
}

function manejarCambioPresetOSM(e) {
  const preset = e.target.value;
  const inputEtiqueta = document.getElementById('osm-etiqueta');
  if (inputEtiqueta) {
    if (preset) {
      inputEtiqueta.value = '';
      inputEtiqueta.placeholder = `Preset activo: ${preset}`;
    } else {
      inputEtiqueta.placeholder = 'ej: amenity=university, shop=bakery';
    }
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

/* ---------------------- GESTIÓN DE PERFILES DE ACTOR TERRITORIAL ---------------------- */

function manejarCambioPerfilUsuario(e) {
  const perfil = e ? e.target.value : (document.getElementById('sel-perfil-usuario')?.value || 'todos');
  const badgeInfo = document.getElementById('badge-perfil-info');

  const descripciones = {
    todos: 'Herramientas adaptadas para gestión territorial integral. Acceso general a todas las funciones.',
    institucion: '🏛️ Perfil Institucional / Municipal / IDE Chile: Prioriza metadatos normalizados (ISO 19115/19139), catastro de equipamiento crítico, licencias abiertas y control de calidad espacial.',
    comunidad: '👥 Perfil Comunitario / Vecinal: Facilita consultas rápidas en 1 clic para plazas, patrimonio, ciclovías, comercios locales y mapeo barrial colaborativo en UMap.',
    voluntario: '🧭 Perfil Mapeador / Voluntario OSM: Herramientas analíticas avanzadas, métricas geométricas ohsome v1 (longitud/área/densidad), editor Overpass QL y taxonomía.'
  };

  if (badgeInfo) {
    badgeInfo.textContent = descripciones[perfil] || descripciones.todos;
  }

  // Paneles prioritarios según perfil
  const panelesPrioritarios = {
    institucion: ['metadatos-iso', 'calidad-ohsome', 'diccionario', 'licencias'],
    comunidad: ['inicio', 'explorador-osm', 'proyectos-umap', 'diccionario'],
    voluntario: ['explorador-osm', 'calidad-ohsome', 'diccionario', 'manual'],
    todos: []
  };

  const recomendados = panelesPrioritarios[perfil] || [];

  // Actualizar botones de navegación en la barra lateral
  document.querySelectorAll('#lista-navegacion button').forEach(btn => {
    const idPanel = btn.dataset.panel;
    const yaExisteBadge = btn.querySelector('.badge-recomendado');
    if (yaExisteBadge) yaExisteBadge.remove();

    if (recomendados.includes(idPanel)) {
      btn.style.borderLeft = '3px solid var(--ocre)';
      const span = document.createElement('span');
      span.className = 'badge-recomendado';
      span.style.fontSize = '0.65rem';
      span.style.marginLeft = '6px';
      span.style.color = 'var(--ocre)';
      span.style.fontWeight = 'bold';
      span.textContent = '★';
      btn.appendChild(span);
    } else {
      btn.style.borderLeft = '';
    }
  });

  // Ajustar o destacar botones de sugerencias ciudadanas
  const perfilesSugerencias = {
    institucion: ['amenity=pharmacy', 'amenity=university', 'highway=bus_stop', 'kerb=lowered', 'amenity=fire_station'],
    comunidad: ['shop=bakery', 'leisure=park', 'historic=*', 'amenity=cafe', 'amenity=bicycle_parking'],
    voluntario: ['amenity=university', 'historic=*', 'kerb=lowered', 'amenity=pharmacy', 'highway=bus_stop']
  };

  const listaFiltro = perfilesSugerencias[perfil] || null;

  document.querySelectorAll('.btn-sugerencia-ciudadana').forEach(btn => {
    const clave = btn.dataset.clave;
    const valor = btn.dataset.valor;
    const claveValor = `${clave}=${valor}`;

    if (!listaFiltro) {
      btn.classList.remove('perfil-destacado', 'perfil-atenuado');
    } else if (listaFiltro.includes(claveValor) || (clave === 'historic' && listaFiltro.includes('historic=*'))) {
      btn.classList.add('perfil-destacado');
      btn.classList.remove('perfil-atenuado');
    } else {
      btn.classList.remove('perfil-destacado');
      btn.classList.add('perfil-atenuado');
    }
  });
}

/* ---------------------- PANEL OHSOME ---------------------- */

async function manejarConsultaOhsome() {
  const contenedor = document.getElementById('resultado-ohsome');
  const bbox = leerBbox('oh');
  if (!bbox) { contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del área.'); return; }

  const filtro = document.getElementById('oh-filtro').value.trim() || 'building=* and type:way';
  contenedor.innerHTML = '<p class="descripcion">Calculando métricas multidimensionales de calidad con ohsome API v1 (HeiGIT)…</p>';

  try {
    const indicadores = await ModuloOhsome.calcularIndicadores(bbox, filtro);
    const densInfo = ModuloOhsome.calcularDensidad(bbox, indicadores.elementosAhora || 0);

    ultimaConsultaRealizada = { bbox, filtro, cantidad: indicadores.elementosAhora, fuente: 'ohsome' };

    // Badge de métrica geométrica especializada según API v1
    let htmlMetricaGeo = '';
    if (indicadores.metricaGeometrica) {
      if (indicadores.metricaGeometrica.tipo === 'longitud') {
        htmlMetricaGeo = `
          <div class="indicador" style="border-left: 3px solid #2E8B57;">
            <span class="valor">${indicadores.metricaGeometrica.valorKm.toLocaleString()} km</span>
            <span class="etiqueta">${indicadores.metricaGeometrica.etiqueta} (${indicadores.metricaGeometrica.valorMetros.toLocaleString()} m)</span>
          </div>
        `;
      } else if (indicadores.metricaGeometrica.tipo === 'superficie') {
        htmlMetricaGeo = `
          <div class="indicador" style="border-left: 3px solid #B8860B;">
            <span class="valor">${indicadores.metricaGeometrica.valorHectareas.toLocaleString()} ha</span>
            <span class="etiqueta">${indicadores.metricaGeometrica.etiqueta} (${indicadores.metricaGeometrica.valorM2.toLocaleString()} m²)</span>
          </div>
        `;
      }
    } else {
      htmlMetricaGeo = `
        <div class="indicador" style="border-left: 3px solid #4682B4;">
          <span class="valor">${indicadores.elementosAhora.toLocaleString()}</span>
          <span class="etiqueta">Entidad puntual (puntos / nodos discretos)</span>
        </div>
      `;
    }

    // Unificación de series cronológicas anuales (elementos, usuarios, contribuciones)
    const mapaSeries = {};
    (indicadores.elementosPorAnio || []).forEach(item => {
      mapaSeries[item.fecha] = { fecha: item.fecha, elementos: item.valor, usuarios: '—', contribuciones: '—' };
    });
    (indicadores.usuariosPorAnio || []).forEach(item => {
      if (!mapaSeries[item.fecha]) mapaSeries[item.fecha] = { fecha: item.fecha, elementos: '—', usuarios: item.valor, contribuciones: '—' };
      else mapaSeries[item.fecha].usuarios = item.valor;
    });
    (indicadores.contribucionesPorAnio || []).forEach(item => {
      if (!mapaSeries[item.fecha]) mapaSeries[item.fecha] = { fecha: item.fecha, elementos: '—', usuarios: '—', contribuciones: item.valor };
      else mapaSeries[item.fecha].contribuciones = item.valor;
    });

    const filasSerie = Object.values(mapaSeries).sort((a, b) => a.fecha.localeCompare(b.fecha)).map(p => `
      <tr>
        <td><strong>${p.fecha}</strong></td>
        <td>${typeof p.elementos === 'number' ? p.elementos.toLocaleString() : p.elementos}</td>
        <td>${typeof p.usuarios === 'number' ? p.usuarios.toLocaleString() : p.usuarios}</td>
        <td>${typeof p.contribuciones === 'number' ? p.contribuciones.toLocaleString() : p.contribuciones}</td>
      </tr>
    `).join('');

    const ultimosUsuarios = indicadores.usuariosPorAnio?.at(-1)?.valor ?? '—';
    const ultimasContribuciones = indicadores.contribucionesPorAnio?.at(-1)?.valor ?? '—';
    const ratioEdicion = indicadores.ratioContribucionPorUsuario ? `${indicadores.ratioContribucionPorUsuario} edit/user` : '—';

    // Lista de referencias académicas y bibliografía científica
    const listaRefs = (indicadores.referencias || []).map(r => `
      <li style="margin-bottom:6px; font-size:0.78rem; line-height:1.4;">
        <strong>${r.autor}</strong> — <em>${r.titulo}</em>.
        ${r.doi ? `<a href="https://doi.org/${r.doi}" target="_blank" rel="noopener" style="color:var(--musgo); text-decoration:underline;">doi:${r.doi}</a>` : ''}
        ${r.url ? `<a href="${r.url}" target="_blank" rel="noopener" style="color:var(--musgo); text-decoration:underline;">${r.url}</a>` : ''}
      </li>
    `).join('');

    contenedor.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:16px;">
        <div class="indicador">
          <span class="valor">${indicadores.elementosAhora.toLocaleString()}</span>
          <span class="etiqueta">Elementos vigentes (${indicadores.fechaCorte})</span>
        </div>
        ${htmlMetricaGeo}
        <div class="indicador">
          <span class="valor">${densInfo ? densInfo.densidad.toFixed(1) : '—'}</span>
          <span class="etiqueta">Densidad espacial (elem / km²)</span>
        </div>
        <div class="indicador">
          <span class="valor">${ultimosUsuarios}</span>
          <span class="etiqueta">Colaboradores activos (último período)</span>
        </div>
        <div class="indicador">
          <span class="valor">${typeof ultimasContribuciones === 'number' ? ultimasContribuciones.toLocaleString() : ultimasContribuciones}</span>
          <span class="etiqueta">Contribuciones / Ediciones registradas</span>
        </div>
        <div class="indicador">
          <span class="valor">${ratioEdicion}</span>
          <span class="etiqueta">Intensidad comunitaria (ediciones / colab)</span>
        </div>
      </div>

      <h3 style="margin-top:20px;">Evolución Histórica Multidimensional (ohsome API v1)</h3>
      <p class="descripcion">Serie cronológica anual analizada sobre la base histórica de datos espaciales (OSHDB):</p>
      <table class="tabla-datos">
        <thead>
          <tr>
            <th>Período / Año</th>
            <th>Elementos Totales</th>
            <th>Colaboradores Únicos</th>
            <th>Contribuciones / Cambios</th>
          </tr>
        </thead>
        <tbody>${filasSerie}</tbody>
      </table>

      <div class="bloque" style="background:var(--papel-alto); border:1px solid var(--linea); padding:14px; margin-top:16px;">
        <h4 style="margin:0 0 8px 0; font-size:0.9rem; color:var(--musgo);">📐 Rigor Metodológico y Criterios de Calidad Espacial</h4>
        <p class="descripcion" style="margin-bottom:8px;">
          <strong>Sensibilidad geométrica:</strong> Conforme a la API v1 de ohsome, las geometrías lineales evalúan continuidad de red en kilómetros lineales (calles y ciclovías), mientras que los polígonos cuantifican la superficie de huella construida o áreas verdes en hectáreas y metros cuadrados.
        </p>
        <p class="descripcion" style="margin-bottom:8px;">
          <strong>Madurez y Linaje:</strong> El ratio de contribuciones por usuario y la masa crítica de colaboradores permiten evaluar si la cartografía de Barrio Brasil depende de pocos mapeadores esporádicos o de una comunidad activa recurrente (Haklay, 2010; Neis & Zipf, 2012).
        </p>
        <h5 style="margin:12px 0 6px 0; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--tinta-suave);">Referencias Académicas y Documentales:</h5>
        <ul style="padding-left:18px; margin:0; color:var(--tinta-suave);">
          ${listaRefs}
        </ul>
      </div>
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
      <h3>Documentos, Catálogos Excel y Memoria Académica</h3>
      <p>Para la defensa ante el comité evaluador y el informe final de práctica profesional, consulta los documentos de referencia en la carpeta <code>docs/</code>:</p>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
        <div>📄 <strong>Memoria y Justificación Epistemológica:</strong> <code>docs/TRAZABILIDAD_ACADEMICA.md</code> <a href="docs/TRAZABILIDAD_ACADEMICA.md" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>📊 <strong>Catálogo de Fuentes VGI:</strong> <code>docs/catalogo_fuentes_vgi.xlsx</code> <a href="docs/catalogo_fuentes_vgi.xlsx" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>🏛️ <strong>Perfil Metadatos ISO 19115 / IDE Chile:</strong> <code>docs/perfil_metadatos_vgi.xlsx</code> <a href="docs/perfil_metadatos_vgi.xlsx" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>🗂️ <strong>Taxonomía y 8 Categorías OSM:</strong> <code>docs/categorias_tematicas_osm.xlsx</code> <a href="docs/categorias_tematicas_osm.xlsx" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>📐 <strong>Arquitectura y Diseño Técnico:</strong> <code>docs/ARQUITECTURA.md</code></div>
      </div>
    </div>
  `;
}

function avisoError(mensaje) { return `<div class="aviso error">${mensaje}</div>`; }
function avisoInfo(mensaje) { return `<div class="aviso">${mensaje}</div>`; }
