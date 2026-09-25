/*
  mapa.js
  -------
  Módulo de visualización cartográfica con Leaflet para el Atlas VGI.
  Maneja:
  - Inicialización del visor cartográfico en el territorio predeterminado (Barrio Brasil / UAH).
  - Selección de capas base (Carto Positron, OSM Estándar, Topográfico).
  - Herramienta de visualización y dibujo interactivo del Bounding Box (sincronizada con inputs).
  - Selector de territorios predefinidos (Barrio Brasil UAH, Santiago Centro, etc.).
  - Representación de capas temáticas GeoJSON con simbología de carta topográfica y popups informativos.
  - Exportación de capas del mapa a archivo GeoJSON.
*/

const ModuloMapa = (() => {
  let mapa = null;
  let capaBbox = null;
  let grupoCapasTematicas = null;
  let capasTematicasActivas = {};
  let dibujandoBbox = false;
  let puntoInicioBbox = null;
  let rectanguloTemporal = null;

  // Paleta de colores temáticos coherente con estilos.css
  const COLORES_CATEGORIA = {
    educacion: '#35586B',
    servicios: '#A97722',
    transporte: '#2C4238',
    movilidad_activa: '#3F5D4E',
    espacio_publico: '#236B43',
    patrimonio: '#8F3A2C',
    accesibilidad: '#4B5142',
    biodiversidad: '#1C523A',
    edificaciones: '#555555',
    cobertura_suelo: '#5B704E',
    // Capas Oficiales IDE Chile y MINVU - Censo 2024 Multiescalar
    censo2024_regional: '#0A3D2E',
    censo2024_limite_urbano: '#165B4C',
    censo2024_localidades: '#1E7A56',
    censo2024_zonal: '#279B6C',
    censo2024_manzanas: '#34BF82',
    minvu_patrimonio: '#8F3A2C',
    minvu_parques: '#236B43',
    minvu_barrios_historicos: '#7D5A2B',
    educacion_parvularia: '#417A63',
    establecimientos_salud: '#B22222',
    bomberos: '#C71585',
    carabineros: '#2E5D3E',
    estaciones_metro: '#B33928',
    red_ferroviaria: '#34495E',
    cmn_sitios_memoria: '#5C4033',
    defecto: '#35586B'
  };

  let capasWMSActivas = {};
  let layerActivoPopup = null;

  function inicializar(idContenedor = 'mapa-atlas') {
    const el = document.getElementById(idContenedor);
    if (!el || mapa) return;

    const cfg = window.NODO_CONFIG || {};
    const centro = cfg.area_por_defecto?.centro || [-33.4445, -70.6620];
    const zoom = cfg.area_por_defecto?.zoom || 16;

    // Capas base de libre acceso sin llave API
    const cartoPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    });

    const osmEstandar = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores',
      maxZoom: 19
    });

    const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; OSM contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
      maxZoom: 17
    });

    mapa = L.map(idContenedor, {
      center: centro,
      zoom: zoom,
      layers: [cartoPositron],
      zoomControl: true,
      preferCanvas: true
    });

    const mapasBase = {
      'Carto Positron (Limpio)': cartoPositron,
      'OpenStreetMap Estándar': osmEstandar,
      'Relieve Topográfico (OpenTopo)': openTopo
    };

    L.control.layers(mapasBase, null, { position: 'topright' }).addTo(mapa);
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(mapa);

    grupoCapasTematicas = L.featureGroup().addTo(mapa);

    // Pintar el bbox inicial
    if (cfg.area_por_defecto?.bbox) {
      actualizarRectanguloBbox(cfg.area_por_defecto.bbox);
    }

    configurarEventosDibujoBbox();
  }

  function actualizarRectanguloBbox(bbox) {
    if (!mapa) return;
    const [oeste, sur, este, norte] = bbox;
    const bounds = [[sur, oeste], [norte, este]];

    let textoTooltip = 'Área de Consulta VGI';
    if (typeof ModuloGeodesia !== 'undefined' && ModuloGeodesia.calcularSuperficieBbox) {
      const s = ModuloGeodesia.calcularSuperficieBbox(bbox);
      textoTooltip = `Área Bbox: ${s.areaM2.toLocaleString('es-CL')} m² (${s.areaHa.toLocaleString('es-CL')} ha / ${s.areaKm2} km²) [EPSG:32719]`;
    }

    if (capaBbox) {
      capaBbox.setBounds(bounds);
      if (capaBbox.getTooltip()) {
        capaBbox.setTooltipContent(textoTooltip);
      } else {
        capaBbox.bindTooltip(textoTooltip, { permanent: false, direction: 'top' });
      }
    } else {
      capaBbox = L.rectangle(bounds, {
        color: '#A97722',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#A97722',
        fillOpacity: 0.08
      }).addTo(mapa);
      capaBbox.bindTooltip(textoTooltip, { permanent: false, direction: 'top' });
    }
  }

  function encuadrarBbox(bbox) {
    if (!mapa || !bbox) return;
    const [oeste, sur, este, norte] = bbox;
    mapa.fitBounds([[sur, oeste], [norte, este]], { padding: [20, 20] });
    actualizarRectanguloBbox(bbox);
  }

  function configurarEventosDibujoBbox() {
    if (!mapa) return;
    const container = mapa.getContainer();

    container.addEventListener('pointerdown', (e) => {
      if (!dibujandoBbox) return;
      if (e.target && e.target.closest('.leaflet-control-container, .leaflet-popup')) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const containerPoint = L.point(e.clientX - rect.left, e.clientY - rect.top);
      puntoInicioBbox = mapa.containerPointToLatLng(containerPoint);

      if (rectanguloTemporal) mapa.removeLayer(rectanguloTemporal);
      rectanguloTemporal = L.rectangle([puntoInicioBbox, puntoInicioBbox], {
        color: '#8F3A2C',
        weight: 2,
        dashArray: '4, 4',
        fillOpacity: 0.2
      }).addTo(mapa);
      mapa.dragging.disable();
    });

    container.addEventListener('pointermove', (e) => {
      if (!dibujandoBbox || !puntoInicioBbox || !rectanguloTemporal) return;
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const containerPoint = L.point(e.clientX - rect.left, e.clientY - rect.top);
      const latlngActual = mapa.containerPointToLatLng(containerPoint);
      rectanguloTemporal.setBounds([puntoInicioBbox, latlngActual]);
    });

    const finalizarDibujo = (e) => {
      if (!dibujandoBbox || !puntoInicioBbox) return;
      if (e) e.preventDefault();

      let puntoFin = puntoInicioBbox;
      if (e && e.clientX && e.clientY) {
        const rect = container.getBoundingClientRect();
        const containerPoint = L.point(e.clientX - rect.left, e.clientY - rect.top);
        puntoFin = mapa.containerPointToLatLng(containerPoint);
      }

      mapa.dragging.enable();
      dibujandoBbox = false;

      const oeste = Math.min(puntoInicioBbox.lng, puntoFin.lng);
      const este = Math.max(puntoInicioBbox.lng, puntoFin.lng);
      const sur = Math.min(puntoInicioBbox.lat, puntoFin.lat);
      const norte = Math.max(puntoInicioBbox.lat, puntoFin.lat);

      if (rectanguloTemporal) {
        mapa.removeLayer(rectanguloTemporal);
        rectanguloTemporal = null;
      }
      puntoInicioBbox = null;

      if (Math.abs(este - oeste) > 0.0001 && Math.abs(norte - sur) > 0.0001) {
        const nuevoBbox = [
          Number(oeste.toFixed(5)),
          Number(sur.toFixed(5)),
          Number(este.toFixed(5)),
          Number(norte.toFixed(5))
        ];
        actualizarRectanguloBbox(nuevoBbox);
        document.dispatchEvent(new CustomEvent('nodo:bbox-cambiado', { detail: { bbox: nuevoBbox } }));
      }

      desactivarModoDibujoBbox();
    };

    container.addEventListener('pointerup', finalizarDibujo);
  }

  function activarModoDibujoBbox() {
    dibujandoBbox = true;
    const btn = document.getElementById('btn-dibujar-bbox');
    if (btn) btn.classList.add('activo');
    if (mapa) {
      mapa.getContainer().style.cursor = 'crosshair';
      mapa.dragging.disable();
    }
  }

  function desactivarModoDibujoBbox() {
    dibujandoBbox = false;
    const btn = document.getElementById('btn-dibujar-bbox');
    if (btn) btn.classList.remove('activo');
    if (mapa) {
      mapa.getContainer().style.cursor = '';
      mapa.dragging.enable();
    }
  }

  /**
   * Agrega o reemplaza una capa GeoJSON en el mapa
   */
  function cargarCapaGeoJSON(idCapa, geojson, opciones = {}) {
    if (!mapa || !grupoCapasTematicas) return;

    if (capasTematicasActivas[idCapa]) {
      grupoCapasTematicas.removeLayer(capasTematicasActivas[idCapa]);
    }

    const color = opciones.color || COLORES_CATEGORIA[idCapa] || COLORES_CATEGORIA.defecto;
    const icono = opciones.icono || '📍';

    const capa = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: color,
          color: '#23281F',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85
        });
      },
      style: (feature) => {
        if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
          return {
            color: color,
            weight: 3.5,
            opacity: 0.85
          };
        }
        return {
          fillColor: color,
          weight: 1.5,
          opacity: 0.9,
          color: '#23281F',
          fillOpacity: 0.35
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        const esOficial = !!props._idOficial;
        const nombre = props._nombre || props.nombre || props.name || props.especie || 'Sin denominación';
        const subtipo = props._subtipo || props.subtipo || props.amenity || props.shop || props.highway || props.historic || (esOficial ? 'Entidad Oficial del Estado' : 'Elemento VGI');
        const fuente = props._fuente || props.fuente || 'OpenStreetMap';
        const licencia = props._licencia || props.licencia || 'ODbL 1.0';
        const fecha = props.fecha || props.fecha_registro || (esOficial ? 'Oficial 2024' : 'No indicada');

        let filasExtraInfo = '';
        if (props._extraInfo) {
          Object.keys(props._extraInfo).forEach(k => {
            filasExtraInfo += `<tr><td style="color:#4B5142; width:45%;">${k}:</td><td><strong>${props._extraInfo[k]}</strong></td></tr>`;
          });
        }

        const geomType = feature.geometry?.type || 'Point';
        const rotuloGeometria = geomType === 'Point' ? 'Punto 📍' :
                                (geomType === 'LineString' || geomType === 'MultiLineString') ? 'Línea 〰️' :
                                'Polígono ⬡';

        const idBotonDetalle = `btn-mas-detalle-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
        const contenidoPopup = `
          <div class="popup-vgi" style="font-family:Spectral, Georgia, serif; max-width:260px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <span style="font-size:0.75rem; color:${color}; font-weight:bold; font-family:'IBM Plex Mono',monospace;">
                ${icono} ${opciones.nombre || idCapa.toUpperCase()}
              </span>
              <span style="font-size:0.7rem; background:#EDE6D6; color:#4B5142; padding:1px 5px; border-radius:3px; font-weight:600;">
                ${rotuloGeometria}
              </span>
            </div>
            <h4 style="margin:4px 0 6px 0; font-size:1rem; border-bottom:1px solid #C9BFA0; padding-bottom:3px;">
              ${nombre}
            </h4>
            <table style="width:100%; font-size:0.78rem; border-collapse:collapse;">
              ${esOficial ? `<tr><td colspan="2" style="background:#1B4D3E; color:#FFF; font-size:0.68rem; font-family:'IBM Plex Mono',monospace; padding:2px 6px; font-weight:bold; letter-spacing:0.04em; margin-bottom:4px; display:block;">🏛️ CAPA OFICIAL DEL ESTADO DE CHILE</td></tr>` : ''}
              <tr><td style="color:#4B5142; width:38%;">Clasificación:</td><td><strong>${subtipo}</strong></td></tr>
              ${filasExtraInfo}
              ${props.operador ? `<tr><td style="color:#4B5142;">Operador:</td><td>${props.operador}</td></tr>` : ''}
              ${props.direccion && !props._extraInfo?.['Dirección'] ? `<tr><td style="color:#4B5142;">Dirección:</td><td>${props.direccion}</td></tr>` : ''}
              ${props.accesibilidad ? `<tr><td style="color:#4B5142;">Accesible:</td><td>${props.accesibilidad}</td></tr>` : ''}
              ${props.superficie_m2 ? `<tr><td style="color:#4B5142;">Superficie:</td><td><strong>${props.superficie_m2.toLocaleString('es-CL')} m²</strong> <span style="font-size:0.72rem; color:#8F3A2C; font-weight:600;" title="Calculada mediante reproyección conforme a EPSG:32719 (UTM 19S) + Gauss">(EPSG:32719)</span>${props.superficie_ha ? ` <small>(${props.superficie_ha.toLocaleString('es-CL')} ha)</small>` : ''}</td></tr>` : ''}
              <tr><td style="color:#4B5142;">Fuente:</td><td>${fuente}</td></tr>
              <tr><td style="color:#4B5142;">Licencia:</td><td><small>${licencia}</small></td></tr>
              ${props._declaracion ? `<tr><td colspan="2" style="font-size:0.68rem; color:#4B5142; padding-top:4px; border-top:1px dashed #C9BFA0; line-height:1.25;"><em>${props._declaracion}</em></td></tr>` : ''}
              ${props._citaAPA ? `<tr><td colspan="2" style="font-size:0.65rem; color:#35586B; padding-top:2px; font-family:'IBM Plex Mono',monospace;"><strong>Cita:</strong> ${props._citaAPA}</td></tr>` : ''}
            </table>
            <div style="margin-top:8px; border-top:1px solid #C9BFA0; padding-top:6px; text-align:right;">
              <button id="${idBotonDetalle}" class="btn-mas-detalles-popup" style="background:linear-gradient(135deg,#06b6d4,#0891b2); color:#000; border:none; border-radius:5px; padding:6px 14px; font-size:0.75rem; font-weight:700; cursor:pointer; font-family:'IBM Plex Mono',monospace; letter-spacing:0.03em; transition:all 0.2s; box-shadow:0 2px 6px rgba(6,182,212,0.3);" onmouseover="this.style.opacity='0.85'; this.style.transform='translateY(-1px)';" onmouseout="this.style.opacity='1'; this.style.transform='none';">Más detalles →</button>
            </div>
          </div>
        `;
        layer.bindPopup(contenidoPopup);

        // Guardar referencias internas en la entidad vectorial
        layer._atlasProps = props;
        layer._atlasOpciones = opciones;
        layer._atlasIdCapa = idCapa;
        layer._atlasIcono = icono;
        layer._atlasColor = color;

        // Vincular el botón «Más detalles» cada vez que el popup esté activo
        layer.on('popupopen', () => {
          layerActivoPopup = layer;
          const btn = document.getElementById(idBotonDetalle);
          if (btn) {
            btn.onclick = (e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              abrirSidebarDetalle(props, opciones, idCapa, icono, color);
              layer.closePopup();
            };
          }
        });

      }
    });

    capasTematicasActivas[idCapa] = capa;
    grupoCapasTematicas.addLayer(capa);

    // Ajuste automático de encuadre para que las geometrías aparezcan inmediatamente en pantalla
    if (opciones.ajustarVista !== false && capa.getBounds && capa.getBounds().isValid()) {
      mapa.fitBounds(capa.getBounds(), { padding: [40, 40], maxZoom: 16 });
    }
  }

  function removerCapa(idCapa) {
    if (capasTematicasActivas[idCapa] && grupoCapasTematicas) {
      grupoCapasTematicas.removeLayer(capasTematicasActivas[idCapa]);
      delete capasTematicasActivas[idCapa];
    }
  }

  function limpiarTodasLasCapas() {
    if (grupoCapasTematicas) {
      grupoCapasTematicas.clearLayers();
      capasTematicasActivas = {};
    }
  }

  function obtenerGeoJSONCompleto() {
    const features = [];
    Object.keys(capasTematicasActivas).forEach(id => {
      const gj = capasTematicasActivas[id].toGeoJSON();
      if (gj && gj.features) {
        gj.features.forEach(f => {
          f.properties = f.properties || {};
          f.properties.categoria_capa = id;
          features.push(f);
        });
      }
    });
    return {
      type: 'FeatureCollection',
      name: 'Atlas_VGI_Barrio_Brasil_UAH',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: features
    };
  }

  function exportarGeoJSONCargado() {
    const fc = obtenerGeoJSONCompleto();
    if (fc.features.length === 0) {
      alert('No hay capas temáticas activas con datos en el mapa para exportar.');
      return;
    }
    const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-vgi-barrio-brasil-uah-${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function cambiarTerritorio(idTerritorio) {
    const cfg = window.NODO_CONFIG;
    if (!cfg || !cfg.territorios_predefinidos) return;
    const t = cfg.territorios_predefinidos.find(item => item.id === idTerritorio);
    if (t && t.bbox) {
      encuadrarBbox(t.bbox);
      document.dispatchEvent(new CustomEvent('nodo:bbox-cambiado', { detail: { bbox: t.bbox } }));
    }
  }

  function invalidarTamano() {
    if (mapa) {
      setTimeout(() => {
        try { mapa.invalidateSize(); } catch (_) {}
      }, 60);
    }
  }

  function alternarCapaWMS(idCapa, capaWMS) {
    if (!mapa || !capaWMS) return false;
    if (capasWMSActivas[idCapa]) {
      mapa.removeLayer(capasWMSActivas[idCapa]);
      delete capasWMSActivas[idCapa];
      return false;
    } else {
      capaWMS.addTo(mapa);
      capasWMSActivas[idCapa] = capaWMS;
      return true;
    }
  }

  function removerCapaWMS(idCapa) {
    if (mapa && capasWMSActivas[idCapa]) {
      mapa.removeLayer(capasWMSActivas[idCapa]);
      delete capasWMSActivas[idCapa];
    }
  }

  function obtenerCapasWMSActivas() {
    return { ...capasWMSActivas };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SIDEBAR DE DETALLES — «Más detalles →»
  // Muestra todas las propiedades del feature + metadatos de la capa y
  // metacalidad del pipeline de procesamiento.
  // ═══════════════════════════════════════════════════════════════════════

  // Metadatos de origen por capa BIDAT (fuente, pipeline, notas)
  const META_CAPAS_BIDAT = {
    'IGVUST_UV_2026_Agosto': {
      fuente: 'Ministerio de Desarrollo Social — BIDAT',
      archivo_origen: '202608_igvust_uv_cuartil.csv',
      descripcion: 'Índice de Gestión de Vulnerabilidad Social Territorial (IGVUST) por Unidad Vecinal. Cuartiles de vulnerabilidad socioeconómica calculados por el MDS para agosto 2026.',
      join_tipo: 'Atributo UV directo (uv_rsh → t_id_uv_ca)',
      clave_join: 'uv_rsh = t_id_uv_ca (9 dígitos)',
      cobertura: '1,364 / 1,364 UV (100%)',
      features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Ninguno (match perfecto)',
      crs_entrada: 'EPSG:5360 (SIRGAS-Chile)', crs_salida: 'EPSG:4326 (WGS84)',
      fecha_proceso: '2026-09-16', tamano_mb: 8.52,
      licencia: 'Dato público — Ministerio de Desarrollo Social Chile'
    },
    'RSH_Sexo_UV_2026_Agosto': {
      fuente: 'MDS BIDAT — Registro Social de Hogares', archivo_origen: 'ind_89_90_202608.csv',
      descripcion: 'Personas en RSH desagregadas por sexo (hombres/mujeres) según Unidad Vecinal. Agosto 2026. Valores con baja frecuencia sustituidos por rangos textuales (confidencialidad RSH).',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Valores textuales promediados; nulos → 0 / "Sin dato"',
      crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326', fecha_proceso: '2026-09-16', tamano_mb: 15.22,
      licencia: 'Dato público — Ministerio de Desarrollo Social Chile'
    },
    'RSH_Dependencia_Funcional_UV_2026_Agosto': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_427_430_202608.csv',
      descripcion: 'Personas con dependencia funcional (leve, moderada, severa) en RSH por UV. Agosto 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Valores textuales promediados; nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 17.90, licencia: 'Dato público — MDS Chile'
    },
    'NNA_RSH_Fonasa_Isapre_UV_2026_Junio': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_212_219_202606.csv',
      descripcion: 'Niños, niñas y adolescentes (NNA) en RSH según sistema de salud (FONASA/ISAPRE) por UV. Junio 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 18.32, licencia: 'Dato público — MDS Chile'
    },
    'Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_213_220_202606.csv',
      descripcion: 'Mujeres en RSH según sistema de salud (FONASA/ISAPRE) por UV. Junio 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 17.41, licencia: 'Dato público — MDS Chile'
    },
    'Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_214_221_202606.csv',
      descripcion: 'Jóvenes en RSH por sistema de salud por UV. Junio 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 17.46, licencia: 'Dato público — MDS Chile'
    },
    'Hombres_RSH_Fonasa_Isapre_UV_2026_Junio': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_215_222_202606.csv',
      descripcion: 'Hombres en RSH por sistema de salud por UV. Junio 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 17.41, licencia: 'Dato público — MDS Chile'
    },
    'Mayores_RSH_Fonasa_Isapre_UV_2026_Junio': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_216_223_202606.csv',
      descripcion: 'Adultos mayores en RSH por sistema de salud por UV. Junio 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 16.87, licencia: 'Dato público — MDS Chile'
    },
    'RSH_Ocupados_Cotizando_UV_2026_Junio': {
      fuente: 'MDS BIDAT', archivo_origen: 'ind_454_202606.csv',
      descripcion: 'Personas ocupadas y cotizando en RSH por UV. Junio 2026.',
      join_tipo: 'Atributo UV (float→int)', clave_join: '"unidad vecinal" → t_id_uv_ca',
      cobertura: '1,355 / 1,364 UV (99.3%)', features_salida: 1364, features_excluidas: 0,
      nulos_rellenos: 'Nulos → 0', crs_entrada: 'EPSG:5360', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 19.24, licencia: 'Dato público — MDS Chile'
    },
    'BIP_Iniciativas_Inversion_RM_Comunas': {
      fuente: 'Ministerio de Desarrollo Social — SNI/BIP',
      archivo_origen: 'base_inversiones_19-27.csv',
      descripcion: 'Base de iniciativas de inversión pública SNI/BIP 2019–2027 para la Región Metropolitana. Serie histórica completa. Cada fila es una iniciativa con geometría de su comuna. Join por CUT comunal (CMN_CLAVE → CUT_COM de COMUNAS_v1.shp DPA 2023).',
      join_tipo: 'Many-to-one: iniciativa → geometría de comuna',
      clave_join: 'CMN_CLAVE (float→int) → CUT_COM del SHP DPA 2023',
      cobertura: '52 / 52 comunas RM (100%)',
      features_salida: 3765, features_excluidas: 1128,
      razon_exclusion: 'CMN_CLAVE nulo en origen BIP (sin localización comunal asignada)',
      nulos_rellenos: '39 columnas con nulos → 0 / "Sin dato"',
      crs_entrada: 'SIRGAS-Chile (DPA 2023)', crs_salida: 'EPSG:4326',
      fecha_proceso: '2026-09-16', tamano_mb: 176.73,
      archivo_geojson: 'BIP_Iniciativas_Inversion_RM_Comunas.geojson',
      columnas_totales: 92,
      licencia: 'Dato público — Ministerio de Desarrollo Social Chile / SNI',
      nota_critica: 'REG_CLAVE en BIP = 181 (código interno SNI, ≠ CUT 13 del INE). Verificado cruzando CMN_CLAVE con CUT de comunas RM.'
    }
  };

  // Enlazar metadatos de archivo_geojson y columnas_totales para capas BIDAT / RSH
  if (META_CAPAS_BIDAT['IGVUST_UV_2026_Agosto']) {
    META_CAPAS_BIDAT['IGVUST_UV_2026_Agosto'].archivo_geojson = 'IGVUST_UV_2026_Agosto.geojson';
    META_CAPAS_BIDAT['IGVUST_UV_2026_Agosto'].columnas_totales = 22;
  }
  if (META_CAPAS_BIDAT['RSH_Sexo_UV_2026_Agosto']) {
    META_CAPAS_BIDAT['RSH_Sexo_UV_2026_Agosto'].archivo_geojson = 'RSH_Sexo_UV_2026_Agosto.geojson';
    META_CAPAS_BIDAT['RSH_Sexo_UV_2026_Agosto'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['RSH_Dependencia_Funcional_UV_2026_Agosto']) {
    META_CAPAS_BIDAT['RSH_Dependencia_Funcional_UV_2026_Agosto'].archivo_geojson = 'RSH_Dependencia_Funcional_UV_2026_Agosto.geojson';
    META_CAPAS_BIDAT['RSH_Dependencia_Funcional_UV_2026_Agosto'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['NNA_RSH_Fonasa_Isapre_UV_2026_Junio']) {
    META_CAPAS_BIDAT['NNA_RSH_Fonasa_Isapre_UV_2026_Junio'].archivo_geojson = 'NNA_RSH_Fonasa_Isapre_UV_2026_Junio.geojson';
    META_CAPAS_BIDAT['NNA_RSH_Fonasa_Isapre_UV_2026_Junio'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio']) {
    META_CAPAS_BIDAT['Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio'].archivo_geojson = 'Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio.geojson';
    META_CAPAS_BIDAT['Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio']) {
    META_CAPAS_BIDAT['Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio'].archivo_geojson = 'Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio.geojson';
    META_CAPAS_BIDAT['Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['Hombres_RSH_Fonasa_Isapre_UV_2026_Junio']) {
    META_CAPAS_BIDAT['Hombres_RSH_Fonasa_Isapre_UV_2026_Junio'].archivo_geojson = 'Hombres_RSH_Fonasa_Isapre_UV_2026_Junio.geojson';
    META_CAPAS_BIDAT['Hombres_RSH_Fonasa_Isapre_UV_2026_Junio'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['Mayores_RSH_Fonasa_Isapre_UV_2026_Junio']) {
    META_CAPAS_BIDAT['Mayores_RSH_Fonasa_Isapre_UV_2026_Junio'].archivo_geojson = 'Mayores_RSH_Fonasa_Isapre_UV_2026_Junio.geojson';
    META_CAPAS_BIDAT['Mayores_RSH_Fonasa_Isapre_UV_2026_Junio'].columnas_totales = 110;
  }
  if (META_CAPAS_BIDAT['RSH_Ocupados_Cotizando_UV_2026_Junio']) {
    META_CAPAS_BIDAT['RSH_Ocupados_Cotizando_UV_2026_Junio'].archivo_geojson = 'RSH_Ocupados_Cotizando_UV_2026_Junio.geojson';
    META_CAPAS_BIDAT['RSH_Ocupados_Cotizando_UV_2026_Junio'].columnas_totales = 142;
  }

  // Mapear aliases bbdd_XX hacia las definiciones oficiales
  META_CAPAS_BIDAT['bbdd_64'] = META_CAPAS_BIDAT['IGVUST_UV_2026_Agosto'];
  META_CAPAS_BIDAT['bbdd_65'] = META_CAPAS_BIDAT['BIP_Iniciativas_Inversion_RM_Comunas'];
  META_CAPAS_BIDAT['bbdd_67'] = META_CAPAS_BIDAT['RSH_Dependencia_Funcional_UV_2026_Agosto'];
  META_CAPAS_BIDAT['bbdd_68'] = META_CAPAS_BIDAT['RSH_Sexo_UV_2026_Agosto'];
  META_CAPAS_BIDAT['bbdd_69'] = META_CAPAS_BIDAT['NNA_RSH_Fonasa_Isapre_UV_2026_Junio'];
  META_CAPAS_BIDAT['bbdd_70'] = META_CAPAS_BIDAT['Mujeres_RSH_Fonasa_Isapre_UV_2026_Junio'];
  META_CAPAS_BIDAT['bbdd_71'] = META_CAPAS_BIDAT['Jovenes_RSH_Fonasa_Isapre_UV_2026_Junio'];
  META_CAPAS_BIDAT['bbdd_72'] = META_CAPAS_BIDAT['Hombres_RSH_Fonasa_Isapre_UV_2026_Junio'];
  META_CAPAS_BIDAT['bbdd_73'] = META_CAPAS_BIDAT['Mayores_RSH_Fonasa_Isapre_UV_2026_Junio'];
  META_CAPAS_BIDAT['bbdd_74'] = META_CAPAS_BIDAT['RSH_Ocupados_Cotizando_UV_2026_Junio'];

  // Mapear capas censales multiescalares INE y sectoriales complejas
  META_CAPAS_BIDAT['ide_censo2024_regional'] = {
    fuente: 'INE Chile — Censo 2024',
    descripcion: 'Marco Macroterritorial Región Metropolitana (Censo 2024). Desagregación demográfica y de vivienda.',
    archivo_geojson: 'ide_censo2024_regional.geojson',
    columnas_totales: 213,
    tamano_mb: 0.82,
    licencia: 'Datos Abiertos — Instituto Nacional de Estadísticas'
  };
  META_CAPAS_BIDAT['ide_censo2024_limite_urbano'] = {
    fuente: 'INE Chile — Censo 2024',
    descripcion: 'Áreas Urbanas Censales de la Región Metropolitana (106 polígonos). Atributos sociodemográficos y tipologías de asentamiento.',
    archivo_geojson: 'ide_censo2024_limite_urbano.geojson',
    columnas_totales: 213,
    tamano_mb: 6.48,
    licencia: 'Datos Abiertos — Instituto Nacional de Estadísticas'
  };
  META_CAPAS_BIDAT['ide_censo2024_localidades'] = {
    fuente: 'INE Chile — Censo 2024',
    descripcion: 'Localidades y Asentamientos Urbanos y Rurales RM (511 polígonos). Población, hogares y categorías censales.',
    archivo_geojson: 'ide_censo2024_localidades.geojson',
    columnas_totales: 213,
    tamano_mb: 17.16,
    licencia: 'Datos Abiertos — Instituto Nacional de Estadísticas'
  };
  META_CAPAS_BIDAT['ide_censo2024_zonal'] = {
    fuente: 'INE Chile — Censo 2024',
    descripcion: 'Distritos y Zonas Censales RM (1.865 polígonos). Microdatos sociodemográficos desagregados por sexo, tramos etarios y viviendas.',
    archivo_geojson: 'ide_censo2024_zonal.geojson',
    columnas_totales: 213,
    tamano_mb: 26.51,
    licencia: 'Datos Abiertos — Instituto Nacional de Estadísticas'
  };
  META_CAPAS_BIDAT['ide_censo2024_manzanas'] = {
    fuente: 'INE Chile — Censo 2024',
    descripcion: 'Manzanas Censales de la Región Metropolitana (66.873 polígonos). Microdatos completos con 217 variables censales oficiales del INE.',
    archivo_geojson: 'ide_censo2024_manzanas.geojson',
    columnas_totales: 217,
    tamano_mb: 496.87,
    licencia: 'Datos Abiertos — Instituto Nacional de Estadísticas'
  };
  META_CAPAS_BIDAT['capa_bbdd_61'] = {
    fuente: 'CONAF — Catastro Uso de Suelo',
    descripcion: 'Monitoreo de Cambios de Uso de Suelo y Cobertura Vegetacional (13.121 polígonos). Serie multitemporal completa.',
    archivo_geojson: 'capa_bbdd_61.geojson',
    columnas_totales: 85,
    tamano_mb: 284.4,
    licencia: 'Datos Abiertos — Corporación Nacional Forestal'
  };
  META_CAPAS_BIDAT['semaforos_rm_uoct_2026'] = {
    fuente: 'UOCT / MTT — Oficio N° 26105 / 2026',
    descripcion: 'Catastro de Cruces e Intersecciones Semaforizadas Conectadas al Sistema de Control de Tránsito RM (3.483 intersecciones operativas en 47 comunas).',
    archivo_geojson: 'semaforos_rm_uoct_2026.geojson',
    columnas_totales: 14,
    tamano_mb: 1.51,
    licencia: 'Información Pública Oficial — Ley N° 20.285 de Transparencia (Solicitud AN001T0026930)'
  };

  // Aliases directos para los 5 niveles del Censo 2024 (con o sin prefijo ide_)
  META_CAPAS_BIDAT['censo2024_regional'] = META_CAPAS_BIDAT['ide_censo2024_regional'];
  META_CAPAS_BIDAT['censo2024_limite_urbano'] = META_CAPAS_BIDAT['ide_censo2024_limite_urbano'];
  META_CAPAS_BIDAT['censo2024_localidades'] = META_CAPAS_BIDAT['ide_censo2024_localidades'];
  META_CAPAS_BIDAT['censo2024_zonal'] = META_CAPAS_BIDAT['ide_censo2024_zonal'];
  META_CAPAS_BIDAT['censo2024_manzanas'] = META_CAPAS_BIDAT['ide_censo2024_manzanas'];
  META_CAPAS_BIDAT['ide_semaforos_rm_uoct_2026'] = META_CAPAS_BIDAT['semaforos_rm_uoct_2026'];

  function fila(etiqueta, valor) {
    const esNum = typeof valor === 'number';
    const esBool = typeof valor === 'boolean';
    const esVacio = valor === null || valor === undefined || valor === '' || valor === 'Sin dato';
    let valFmt = '—';
    if (esNum) {
      valFmt = Number.isInteger(valor) ? valor.toLocaleString('es-CL') : valor.toLocaleString('es-CL', { maximumFractionDigits: 4 });
    } else if (esBool) {
      valFmt = valor ? 'Sí' : 'No';
    } else if (!esVacio) {
      valFmt = valor;
    }
    return `<tr><td class="detalle-clave">${etiqueta}</td><td class="detalle-valor ${esNum ? 'num' : (esVacio ? 'vacio' : '')}">${valFmt}</td></tr>`;
  }

  function seccion(titulo, filasHtml) {
    if (!filasHtml || filasHtml.trim() === '') return '';
    return `
      <div class="detalle-seccion">
        <h5 class="detalle-seccion-titulo">${titulo}</h5>
        <table class="detalle-tabla"><tbody>${filasHtml}</tbody></table>
      </div>
    `;
  }

  function abrirSidebarDetalle(props = {}, opciones = {}, idCapa, icono, color) {
    const sidebar = document.getElementById('sidebar-detalle-bidat') || document.getElementById('sidebar-detalle');
    const cuerpo  = document.getElementById('sidebar-detalle-cuerpo');
    const badge   = document.getElementById('sidebar-detalle-badge');
    if (!sidebar || !cuerpo) return;

    // Nombre de la capa para el badge
    const nombreCapa = opciones?.nombre || idCapa || 'Capa';
    if (badge) badge.textContent = icono ? `${icono} ${nombreCapa}` : nombreCapa;

    // Obtener metadatos de la capa (soporta idCapa, alias bbdd_XX o nombre de archivo)
    let meta = META_CAPAS_BIDAT[idCapa] || META_CAPAS_BIDAT[props._idOficial] || META_CAPAS_BIDAT[opciones?.id] || {};

    // Si es una capa oficial de ModuloIDEChile no listada en META_CAPAS_BIDAT, heredar de CAPAS_OFICIALES
    const idOficial = idCapa || props._idOficial || opciones?.id;
    const defOficial = window.ModuloIDEChile?.obtenerDefinicion ? window.ModuloIDEChile.obtenerDefinicion(idOficial) : (window.ModuloIDEChile?.CAPAS_OFICIALES?.[idOficial] || null);

    if (defOficial) {
      meta = {
        fuente: meta.fuente || defOficial.institucion || 'Estado de Chile',
        ministerio: meta.ministerio || defOficial.ministerio || 'Organismo del Estado',
        archivo_origen: meta.archivo_origen || defOficial.archivoLocal || `data/${idOficial}.geojson`,
        archivo_geojson: meta.archivo_geojson || (defOficial.archivoLocal ? defOficial.archivoLocal.split('/').pop() : `${idOficial}.geojson`),
        descripcion: meta.descripcion || defOficial.descripcion || defOficial.nombre,
        licencia: meta.licencia || defOficial.declaracion || 'Ley N° 20.285 de Transparencia',
        citaAPA: meta.citaAPA || defOficial.citaAPA || `Estado de Chile. (2026). ${defOficial.nombre}.`,
        columnas_totales: meta.columnas_totales || null,
        tamano_mb: meta.tamano_mb || null,
        join_tipo: meta.join_tipo,
        clave_join: meta.clave_join,
        cobertura: meta.cobertura,
        features_salida: meta.features_salida,
        features_excluidas: meta.features_excluidas,
        razon_exclusion: meta.razon_exclusion,
        nulos_rellenos: meta.nulos_rellenos,
        crs_entrada: meta.crs_entrada,
        crs_salida: meta.crs_salida,
        fecha_proceso: meta.fecha_proceso,
        nota_critica: meta.nota_critica
      };
    }

    // ── Alerta: Aviso de columnas no mostradas y descarga integral ─────────
    const totalColsProps = Object.keys(props).filter(k => !k.startsWith('_') && k !== 'geometry').length;
    const totalColsOrigen = meta.columnas_totales || totalColsProps;
    const archivoGeoJSON = meta.archivo_geojson ||
      (idCapa && idCapa.endsWith('.geojson') ? idCapa :
      (props._archivoLocal ? props._archivoLocal.split('/').pop() : `${idCapa}.geojson`));
    const nombreDescarga = archivoGeoJSON.split('/').pop();
    const rutaDescarga = `data/${nombreDescarga}`;
    const tamanoMbStr = meta.tamano_mb ? `${meta.tamano_mb} MB` : 'GeoJSON Completo';

    const mostrarAlerta = totalColsOrigen > 10 || meta.columnas_totales ||
      (idCapa && (idCapa.includes('rsh') || idCapa.includes('RSH') || idCapa.includes('censo') || idCapa.includes('bbdd') || idCapa.includes('bip') || idCapa.includes('BIP') || idCapa.includes('IGVUST') || idCapa.includes('semaforos')));

    const alertaColumnasHtml = mostrarAlerta ? `
      <div class="detalle-alerta-columnas" style="background:rgba(234,179,8,0.12); border:1px solid #EAB308; border-left:4px solid #CA8A04; border-radius:6px; padding:12px 14px; margin-bottom:14px; font-family:'IBM Plex Sans',sans-serif;">
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:1.3rem; line-height:1.2;">⚠️</span>
          <div style="flex:1;">
            <strong style="display:block; color:#EAB308; font-size:0.83rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.02em; margin-bottom:4px;">
              AVISO DE VISUALIZACIÓN: COLUMNAS RESUMIDAS
            </strong>
            <p style="margin:0; font-size:0.78rem; color:var(--tinta-suave,#e2e8f0); line-height:1.45;">
              Por motivos de rendimiento y fluidez en el visor interactivo, <strong>no se están mostrando todas las columnas</strong> de esta entidad (${totalColsOrigen} columnas y variables presentes en el dataset oficial).
            </p>
            <p style="margin:5px 0 0 0; font-size:0.75rem; color:var(--tinta,#f8fafc); line-height:1.4;">
              El conjunto cartográfico oficial incluye el 100% de las geometrías e información sociodemográfica íntegra sin simplificar.
            </p>
            <div style="margin-top:9px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
              <a href="${rutaDescarga}" download="${nombreDescarga}" class="accion" style="display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; text-decoration:none; padding:7px 14px; background:linear-gradient(135deg,#06b6d4,#0891b2); color:#000; border-radius:4px; font-family:'IBM Plex Mono',monospace; box-shadow:0 2px 6px rgba(0,0,0,0.3); transition:all 0.15s;" onmouseover="this.style.opacity='0.85'; this.style.transform='translateY(-1px)';" onmouseout="this.style.opacity='1'; this.style.transform='none';">
                📥 Descargar Capa Completa (${tamanoMbStr})
              </a>
              <span style="font-size:0.7rem; color:var(--tinta-tenue,#94a3b8); font-family:'IBM Plex Mono',monospace;">(Todas las columnas e indicadores íntegros)</span>
            </div>
          </div>
        </div>
      </div>
    ` : '';

    // ── Sección 1: Identificación del elemento ──────────────────────────
    const nombre = props._nombre || props.nombre || props.name || props.NOMBRE || props.EBI_NOMBRE ||
      (props.codigo_junction ? `Cruce ${props.codigo_junction}: ${props.acceso_1 || ''} / ${props.acceso_2 || ''}` : '') ||
      (props.NOM_COM ? `Comuna ${props.NOM_COM}` : '') ||
      (props.d_COMUNA ? `Comuna ${props.d_COMUNA}` : '') ||
      (props.LOCALIDAD ? `Localidad ${props.LOCALIDAD}` : '') ||
      (props.ENTIDAD ? `Entidad ${props.ENTIDAD}` : '') ||
      '—';
    const subtipo = props._subtipo || props.subtipo || props.EBI_ETAPA_POSTULA || props.amenity || props.shop || props.highway || props.historic || (defOficial ? defOficial.nombre : '—');

    let s1 = '';
    s1 += fila('Nombre / Denominación', nombre);
    s1 += fila('Subtipo / Clasificación', subtipo);
    if (props.codigo_junction) s1 += fila('Código Junction (UOCT)', props.codigo_junction);
    if (props.acceso_1) s1 += fila('Intersección Vía 1', props.acceso_1);
    if (props.acceso_2) s1 += fila('Intersección Vía 2', props.acceso_2);
    if (props.marca_control) s1 += fila('Controlador Semafórico', `${props.marca_control} ${props.modelo || ''}`.trim());
    if (props.tipo_cabezal) s1 += fila('Tecnología Cabezal', props.tipo_cabezal);
    if (props.tipo_comunicacion) s1 += fila('Enlace Comunicación', props.tipo_comunicacion);
    if (props.estado) s1 += fila('Estado Operativo', props.estado);
    if (props.vigencia) s1 += fila('Vigencia Oficial', props.vigencia);
    if (props.t_id_uv_ca || props.uv_rsh) s1 += fila('ID Unidad Vecinal', props.t_id_uv_ca || props.uv_rsh);
    if (props.t_com_nom || props.COMUNA || props.comuna || props.d_COMUNA) s1 += fila('Comuna', props.t_com_nom || props.COMUNA || props.comuna || props.d_COMUNA);
    if (props.t_prov_nom || props.PROVINCIA || props.d_PROVINCIA) s1 += fila('Provincia', props.t_prov_nom || props.PROVINCIA || props.d_PROVINCIA);
    if (props.REGION || props.d_REGION) s1 += fila('Región', props.REGION || props.d_REGION);
    if (props.uv_carto) s1 += fila('Número UV', props.uv_carto);
    if (props.CUT || props.CUT_COM) s1 += fila('Código Único Territorial (CUT)', props.CUT || props.CUT_COM);
    if (props.EBI_CODIGO) s1 += fila('Código BIP / SNI', props.EBI_CODIGO);
    if (props.EBI_ANO_POSTULA) s1 += fila('Año Postulación', props.EBI_ANO_POSTULA);
    if (props.EBI_SITUACION) s1 += fila('Situación', props.EBI_SITUACION);
    if (props.EBI_SIMBOLO_MONEDA) s1 += fila('Moneda', props.EBI_SIMBOLO_MONEDA);
    if (props.EBI_COSTO_TOTAL) s1 += fila('Costo Total Proyecto', props.EBI_COSTO_TOTAL);
    if (props.direccion || props.DIRECCION || props.DIRECC) s1 += fila('Dirección', props.direccion || props.DIRECCION || props.DIRECC);
    if (props.operador) s1 += fila('Operador', props.operador);
    if (props.superficie_m2) s1 += fila('Superficie (m² EPSG:32719)', props.superficie_m2);
    if (props.superficie_ha || props.Ha || props.SUP_HA) s1 += fila('Superficie (ha)', props.superficie_ha || props.Ha || props.SUP_HA);

    // ── Sección 2: Datos cuantitativos y variables numéricas ────────────
    let s2 = '';
    let nCols = 0;
    const excluirCols = new Set([
      '_nombre','_subtipo','_fuente','_licencia','_capaId','_idUsuario','_color','_extraInfo','_declaracion','_citaAPA','_idOficial','geometry',
      'OBJECTID','FID','id','ID','CUT','CUT_COM','COD_REGION','COD_PROVINCIA','COD_COMUNA','EBI_CODIGO','superficie_m2','superficie_ha'
    ]);
    for (const [k, v] of Object.entries(props)) {
      if (excluirCols.has(k)) continue;
      if (typeof v === 'number' && nCols < 100) {
        s2 += fila(k, v);
        nCols++;
      }
    }
    if (!s2) s2 = '<p style="font-size:0.78rem; color:var(--tinta-tenue); margin:0;">No hay columnas numéricas adicionales.</p>';

    // ── Sección 3: Atributos del dato y variables de texto ──────────────
    let s3 = '';
    let nText = 0;
    const excluirTexto = new Set([
      ...excluirCols,
      't_reg_ca','t_reg_nom','CUT_REG','REGION','t_prov_nom','PROVINCIA','t_com_nom','COMUNA','comuna',
      'codigo_junction','acceso_1','acceso_2','marca_control','modelo','tipo_cabezal','tipo_comunicacion','estado','vigencia',
      'direccion','DIRECCION','DIRECC','operador','EBI_NOMBRE','EBI_ETAPA_POSTULA','EBI_SITUACION','EBI_SIMBOLO_MONEDA'
    ]);
    for (const [k, v] of Object.entries(props)) {
      if (excluirTexto.has(k)) continue;
      if (typeof v === 'boolean') {
        s3 += fila(k, v);
        nText++;
      } else if (typeof v === 'string' && v !== '' && v !== 'Sin dato' && nText < 100) {
        s3 += fila(k, v);
        nText++;
      }
    }
    if (!s3) s3 = '<p style="font-size:0.78rem; color:var(--tinta-tenue); margin:0;">Sin atributos de texto adicionales.</p>';

    // ── Sección 4: Metadatos de la capa y trazabilidad oficial ──────────
    let s4 = '';
    s4 += fila('Institución Oficial', meta.fuente || props._fuente || 'Estado de Chile');
    if (meta.ministerio) s4 += fila('Ministerio / Cartera', meta.ministerio);
    s4 += fila('Archivo de Origen', meta.archivo_origen || meta.archivo_geojson || '—');
    if (meta.join_tipo) s4 += fila('Tipo de Join Espacial', meta.join_tipo);
    if (meta.clave_join) s4 += fila('Clave de Join', meta.clave_join);
    if (meta.cobertura) s4 += fila('Cobertura Territorial', meta.cobertura);
    if (meta.features_salida) s4 += fila('Total Entidades', meta.features_salida);
    if (meta.features_excluidas !== undefined && meta.features_excluidas !== '—') s4 += fila('Entidades Excluidas', meta.features_excluidas);
    if (meta.razon_exclusion) s4 += fila('Causa de Exclusión', meta.razon_exclusion);
    if (meta.crs_entrada) s4 += fila('CRS de Entrada', meta.crs_entrada);
    s4 += fila('CRS de Salida', meta.crs_salida || 'EPSG:4326 (WGS 84)');
    if (meta.fecha_proceso) s4 += fila('Fecha de Procesamiento', meta.fecha_proceso);
    if (meta.tamano_mb) s4 += fila('Tamaño del Dataset', `${meta.tamano_mb} MB`);
    s4 += fila('Marco Legal / Licencia', meta.licencia || props._licencia || 'Ley N° 20.285 de Transparencia');
    if (meta.citaAPA || props._citaAPA) s4 += fila('Cita Bibliográfica APA', meta.citaAPA || props._citaAPA);

    // ── Sección 5: Descripción y nota crítica ───────────────────────────
    const descHtml = (meta.descripcion || meta.nota_critica)
      ? `<div class="detalle-metacalidad">
          ${meta.descripcion ? `<p>${meta.descripcion}</p>` : ''}
          ${meta.nota_critica ? `<p style="margin-top:6px; color:#f59e0b;"><strong>⚠ Nota Crítica:</strong> ${meta.nota_critica}</p>` : ''}
         </div>`
      : '';

    // ── Render completo ─────────────────────────────────────────────────
    cuerpo.innerHTML = [
      alertaColumnasHtml,
      seccion('🏷 Identificación del Elemento', s1),
      seccion('📊 Indicadores Numéricos y Variables', s2),
      seccion('📋 Atributos del Dato y Tipologías', s3),
      seccion('📂 Metadatos de Origen y Trazabilidad Oficial', s4),
      descHtml ? seccion('📖 Descripción de la Capa', descHtml) : ''
    ].join('');

    // Abrir sidebar
    sidebar.classList.add('abierto');
  }

  function cerrarSidebarDetalle() {
    const sidebar = document.getElementById('sidebar-detalle-bidat') || document.getElementById('sidebar-detalle');
    if (sidebar) sidebar.classList.remove('abierto');
  }

  function exportarCapaPorId(idCapa) {
    if (capasTematicasActivas[idCapa]) {
      const gj = capasTematicasActivas[idCapa].toGeoJSON();
      const blob = new Blob([JSON.stringify(gj, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${idCapa}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    }
    return false;
  }

  // Inicializar listeners del sidebar (botón cerrar, tecla Escape y delegación de clics)
  if (typeof document !== 'undefined') {
    function inicializarListenersSidebar() {
      const btnCerrar = document.getElementById('btn-cerrar-detalle');
      if (btnCerrar) btnCerrar.onclick = cerrarSidebarDetalle;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inicializarListenersSidebar);
    } else {
      inicializarListenersSidebar();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarSidebarDetalle();
    });

    // Delegación global para botones "Más detalles →" en cualquier popup
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && (e.target.closest('.btn-mas-detalles-popup') || (e.target.id && e.target.id.startsWith('btn-mas-detalle-') ? e.target : null));
      if (btn && layerActivoPopup && layerActivoPopup._atlasProps) {
        e.preventDefault();
        e.stopPropagation();
        abrirSidebarDetalle(
          layerActivoPopup._atlasProps,
          layerActivoPopup._atlasOpciones,
          layerActivoPopup._atlasIdCapa,
          layerActivoPopup._atlasIcono,
          layerActivoPopup._atlasColor
        );
        if (mapa) mapa.closePopup();
      }
    });
  }

  return {
    inicializar,
    actualizarRectanguloBbox,
    encuadrarBbox,
    activarModoDibujoBbox,
    desactivarModoDibujoBbox,
    cargarCapaGeoJSON,
    removerCapa,
    limpiarTodasLasCapas,
    obtenerGeoJSONCompleto,
    exportarGeoJSONCargado,
    exportarCapaPorId,
    abrirSidebarDetalle,
    cerrarSidebarDetalle,
    cambiarTerritorio,
    invalidarTamano,
    alternarCapaWMS,
    removerCapaWMS,
    obtenerCapasWMSActivas,
    obtenerInstanciaMapa: () => mapa,
    COLORES_CATEGORIA
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloMapa = ModuloMapa;
}
