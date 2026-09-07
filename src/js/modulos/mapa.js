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
    defecto: '#35586B'
  };

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
      zoomControl: true
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
    mapa.on('mousedown', (e) => {
      if (!dibujandoBbox) return;
      puntoInicioBbox = e.latlng;
      if (rectanguloTemporal) mapa.removeLayer(rectanguloTemporal);
      rectanguloTemporal = L.rectangle([puntoInicioBbox, puntoInicioBbox], {
        color: '#8F3A2C',
        weight: 2,
        dashArray: '4, 4',
        fillOpacity: 0.15
      }).addTo(mapa);
      mapa.dragging.disable();
    });

    mapa.on('mousemove', (e) => {
      if (!dibujandoBbox || !puntoInicioBbox || !rectanguloTemporal) return;
      rectanguloTemporal.setBounds([puntoInicioBbox, e.latlng]);
    });

    mapa.on('mouseup', (e) => {
      if (!dibujandoBbox || !puntoInicioBbox) return;
      const puntoFin = e.latlng;
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

      // Actualizar si tiene dimensión válida
      if (Math.abs(este - oeste) > 0.0005 && Math.abs(norte - sur) > 0.0005) {
        const nuevoBbox = [
          Number(oeste.toFixed(5)),
          Number(sur.toFixed(5)),
          Number(este.toFixed(5)),
          Number(norte.toFixed(5))
        ];
        actualizarRectanguloBbox(nuevoBbox);
        document.dispatchEvent(new CustomEvent('nodo:bbox-cambiado', { detail: { bbox: nuevoBbox } }));
      }
      
      const btn = document.getElementById('btn-dibujar-bbox');
      if (btn) btn.classList.remove('activo');
    });
  }

  function activarModoDibujoBbox() {
    dibujandoBbox = true;
    const btn = document.getElementById('btn-dibujar-bbox');
    if (btn) btn.classList.add('activo');
    if (mapa) mapa.getContainer().style.cursor = 'crosshair';
  }

  function desactivarModoDibujoBbox() {
    dibujandoBbox = false;
    const btn = document.getElementById('btn-dibujar-bbox');
    if (btn) btn.classList.remove('activo');
    if (mapa) mapa.getContainer().style.cursor = '';
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
        const nombre = props.nombre || props.name || props.especie || 'Sin denominación';
        const subtipo = props.subtipo || props.amenity || props.shop || props.highway || props.historic || 'Elemento VGI';
        const fuente = props.fuente || 'OpenStreetMap';
        const licencia = props.licencia || 'ODbL 1.0';
        const fecha = props.fecha || props.fecha_registro || 'No indicada';

        const geomType = feature.geometry?.type || 'Point';
        const rotuloGeometria = geomType === 'Point' ? 'Punto 📍' :
                                (geomType === 'LineString' || geomType === 'MultiLineString') ? 'Línea 〰️' :
                                'Polígono ⬡';

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
              <tr><td style="color:#4B5142; width:35%;">Tipo:</td><td><strong>${subtipo}</strong></td></tr>
              ${props.operador ? `<tr><td style="color:#4B5142;">Operador:</td><td>${props.operador}</td></tr>` : ''}
              ${props.direccion ? `<tr><td style="color:#4B5142;">Dirección:</td><td>${props.direccion}</td></tr>` : ''}
              ${props.accesibilidad ? `<tr><td style="color:#4B5142;">Accesible:</td><td>${props.accesibilidad}</td></tr>` : ''}
              ${props.superficie_m2 ? `<tr><td style="color:#4B5142;">Superficie:</td><td><strong>${props.superficie_m2.toLocaleString('es-CL')} m²</strong> <span style="font-size:0.72rem; color:#8F3A2C; font-weight:600;" title="Calculada mediante reproyección conforme a EPSG:32719 (UTM 19S) + Gauss">(EPSG:32719)</span>${props.superficie_ha ? ` <small>(${props.superficie_ha.toLocaleString('es-CL')} ha)</small>` : ''}</td></tr>` : ''}
              <tr><td style="color:#4B5142;">Fuente:</td><td>${fuente}</td></tr>
              <tr><td style="color:#4B5142;">Fecha:</td><td>${fecha}</td></tr>
              <tr><td style="color:#4B5142;">Licencia:</td><td><small>${licencia}</small></td></tr>
            </table>
          </div>
        `;
        layer.bindPopup(contenidoPopup);
      }
    });

    capasTematicasActivas[idCapa] = capa;
    grupoCapasTematicas.addLayer(capa);
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
    cambiarTerritorio,
    COLORES_CATEGORIA
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloMapa = ModuloMapa;
}
