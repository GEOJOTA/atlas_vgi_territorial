/*
  globo.js
  --------
  Módulo de visualización táctica tridimensional y perspectiva espacial para el Atlas VGI.
  Implementado sobre arquitectura robusta Leaflet con motor de perspectiva 3D (CSS3 Transform),
  cartografía táctica nocturna (Dark Matter), telemetría continua de altitud, HUD CRT Backrooms (A24)
  y transición multiescala fluida 3D <-> 2D.
*/

const ModuloGlobo = (() => {
  let mapa3D = null;
  let grupoCapas3D = null;
  let contenedorId = 'globo-3d-canvas';
  let capasActivasSincronizadas = {};
  let capasPendientes = null;

  // Umbral de altitud y zoom para conmutar automáticamente de 3D a 2D (escala barrial)
  const UMBRAL_TRANSICION_2D_METROS = 2200; // < 2.2 km (Zoom >= 17) conmuta a vista 2D detallada
  let transicionEnCurso = false;

  // Paleta temática integral (VGI + Oficiales IDE Chile + Normativa IPT MINVU)
  const COLORES_POR_DEFECTO = {
    educacion: '#35586B',
    servicios: '#A97722',
    transporte: '#2C4238',
    movilidad_activa: '#3F5D4E',
    espacio_publico: '#236B43',
    patrimonio: '#8F3A2C',
    accesibilidad: '#4B5142',
    biodiversidad: '#1C523A',
    edificaciones: '#6B7280',
    cobertura_suelo: '#5B704E',
    // Oficiales IDE Chile
    censo2024_manzanas: '#1B4D3E',
    minvu_patrimonio: '#8F3A2C',
    minvu_parques: '#236B43',
    minvu_barrios_historicos: '#7D5A2B',
    educacion_superior: '#1C523A',
    educacion_escolar: '#285B75',
    educacion_parvularia: '#417A63',
    establecimientos_salud: '#B22222',
    bomberos: '#C71585',
    carabineros: '#2E5D3E',
    estaciones_metro: '#B33928',
    red_ferroviaria: '#34495E',
    cmn_sitios_memoria: '#5C4033',
    limite_urbano_censal: '#3B5998',
    // Normativa IPT MINVU
    minvu_ipt_prc_santiago: '#D97706',
    minvu_ipt_prms_usosuelo: '#7C3AED',
    minvu_ipt_areas_verdes: '#059669',
    minvu_ipt_areas_riesgo: '#DC2626',
    minvu_ipt_resguardo_infraestructura: '#0284C7',
    minvu_ipt_limite_urbano: '#4F46E5',
    // Nuevas capas oficiales
    ide_minvu_campamentos: '#E11D48',
    ide_minvu_condominios_sociales: '#D97706',
    ide_minvu_inventario_humedales: '#0284C7',
    ide_minvu_unidades_vecinales_rsh: '#6366F1',
    ide_minvu_ipt_prms_riesgo: '#DC2626',
    ide_subdere_dpa_comunas: '#475569',
    ide_minvu_ciclovias: '#10B981',
    defecto: '#35586B'
  };

  /**
   * Calcula la altitud orbital/geodésica aproximada en metros según el nivel de zoom Leaflet
   */
  function calcularAltitudMetros(zoom) {
    // Escala estándar Web Mercator: a zoom 0 ~ 591.657 km; a zoom 14 ~ 36 km; a zoom 17 ~ 4.5 km
    const altitud = 591657550 / Math.pow(2, zoom);
    return Math.round(altitud);
  }

  /**
   * Actualiza la telemetría dinámica del HUD (altitud, coordenadas y etiquetas de escala)
   */
  function actualizarTelemetriaHUD() {
    if (!mapa3D) return;

    const zoom = mapa3D.getZoom();
    const centro = mapa3D.getCenter();
    const altitudMetros = calcularAltitudMetros(zoom);

    const elemHud = document.getElementById('globo-hud-escala');
    if (elemHud) {
      let escalaEtiqueta = '🪐 ESCALA PLANETARIA';
      if (altitudMetros <= UMBRAL_TRANSICION_2D_METROS || zoom >= 17) {
        escalaEtiqueta = '🔬 ESCALA BARRIAL (TRANSICIÓN 2D ACTIVA)';
      } else if (altitudMetros < 25000 || zoom >= 14) {
        escalaEtiqueta = '🏘️ COMUNAL / BARRIO BRASIL';
      } else if (altitudMetros < 150000 || zoom >= 11) {
        escalaEtiqueta = '🏙️ GRAN SANTIAGO METROPOLITANO';
      } else if (altitudMetros < 1200000 || zoom >= 8) {
        escalaEtiqueta = '🇨🇱 REGIONAL CHILE CENTRAL';
      }

      let altTexto;
      if (altitudMetros < 1000) {
        altTexto = `${altitudMetros} m`;
      } else if (altitudMetros < 100000) {
        altTexto = `${(altitudMetros / 1000).toFixed(1)} km`;
      } else {
        altTexto = `${Math.round(altitudMetros / 1000)} km`;
      }

      elemHud.innerHTML = `<span><strong>ALTITUD:</strong> ${altTexto}</span> &nbsp;|&nbsp; <span>${escalaEtiqueta}</span>`;
    }

    const elemCoords = document.querySelector('.globo-hud-coords');
    if (elemCoords) {
      const cantCapas = Object.keys(capasActivasSincronizadas).length;
      elemCoords.innerHTML = `LAT <strong>${centro.lat.toFixed(4)}°</strong> | LON <strong>${centro.lng.toFixed(4)}°</strong> | ZOOM: <strong>${zoom}</strong> | CAPAS: <strong>${cantCapas}</strong>`;
    }

    // Si desciende por debajo de 2.2 km (Zoom >= 17), conmutar fluidamente a visión 2D
    if ((altitudMetros <= UMBRAL_TRANSICION_2D_METROS || zoom >= 17) && !transicionEnCurso) {
      ejecutarTransicionA2D(centro.lat, centro.lng);
    }
  }

  /**
   * Ejecuta la conmutación fluida hacia el visor 2D
   */
  function ejecutarTransicionA2D(lat, lng) {
    if (transicionEnCurso) return;
    transicionEnCurso = true;

    // Alerta visual liminal Backrooms
    const contGlobo = document.getElementById('contenedor-globo-3d');
    if (contGlobo) {
      contGlobo.classList.remove('perspectiva-inclinada');
      contGlobo.classList.add('perspectiva-plana');

      const alerta = document.createElement('div');
      alerta.className = 'alerta-transicion-hud';
      alerta.innerHTML = '⚡ [DESCENSO A ESCALA BARRIAL] // CONMUTANDO A VISTA 2D DE ALTA RESOLUCIÓN';
      contGlobo.appendChild(alerta);
      setTimeout(() => alerta.remove(), 1200);
    }

    setTimeout(() => {
      if (typeof window.conmutarVistaPerspectiva === 'function') {
        window.conmutarVistaPerspectiva('2d', lat, lng);
      }
      setTimeout(() => {
        transicionEnCurso = false;
        if (contGlobo) {
          contGlobo.classList.remove('perspectiva-plana');
          contGlobo.classList.add('perspectiva-inclinada');
        }
      }, 1200);
    }, 250);
  }

  /**
   * Controles directos y 100% confiables de aproximación y alejamiento
   */
  function acercar() {
    if (!mapa3D) return;
    mapa3D.zoomIn(1, { animate: true });
  }

  function alejar() {
    if (!mapa3D) return;
    mapa3D.zoomOut(1, { animate: true });
  }

  /**
   * Inicializa el visor 3D táctico con motor Leaflet
   */
  function inicializar(idElemento = 'globo-3d-canvas') {
    if (typeof L === 'undefined') {
      console.error('[ModuloGlobo]: Leaflet (L) no está disponible.');
      return false;
    }

    const elem = document.getElementById(idElemento);
    if (!elem) {
      console.warn(`[ModuloGlobo]: No se encontró el elemento #${idElemento}`);
      return false;
    }

    contenedorId = idElemento;

    // Activar perspectiva inclinada en el contenedor
    const contPadre = document.getElementById('contenedor-globo-3d');
    if (contPadre) {
      contPadre.classList.add('perspectiva-inclinada');
    }

    // Si ya existe instancia previa, redimensionar y sincronizar capas pendientes
    if (mapa3D) {
      mapa3D.invalidateSize();
      actualizarTelemetriaHUD();
      if (capasPendientes) {
        const p = capasPendientes;
        capasPendientes = null;
        sincronizarCapas(p);
      } else {
        sincronizarCapas(capasActivasSincronizadas);
      }
      return true;
    }

    try {
      // Crear mapa Leaflet táctico de alto rendimiento
      mapa3D = L.map(idElemento, {
        center: [-33.4445, -70.6620],
        zoom: 13,
        zoomControl: false, // Usamos los botones dedicados con estética Backrooms
        attributionControl: false,
        maxZoom: 19,
        minZoom: 3
      });

      // Capa base táctica nocturna (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapa3D);

      grupoCapas3D = L.featureGroup().addTo(mapa3D);

      // Listeners reactivos para actualizar el HUD en tiempo real al hacer zoom o pan
      mapa3D.on('zoom', actualizarTelemetriaHUD);
      mapa3D.on('zoomend', actualizarTelemetriaHUD);
      mapa3D.on('move', actualizarTelemetriaHUD);
      mapa3D.on('moveend', actualizarTelemetriaHUD);

      // Telemetría inicial
      actualizarTelemetriaHUD();

      // Sincronizar capas si ya estaban preparadas
      if (capasPendientes) {
        sincronizarCapas(capasPendientes);
        capasPendientes = null;
      }

      console.log('[ModuloGlobo]: Visor 3D táctico inicializado con motor Leaflet y perspectiva oblicua.');
      return true;
    } catch (err) {
      console.error('[ModuloGlobo]: Error al inicializar mapa 3D:', err);
      return false;
    }
  }

  /**
   * Ajusta el tamaño del mapa al contenedor
   */
  function redimensionar() {
    if (!mapa3D) return;
    mapa3D.invalidateSize();
    actualizarTelemetriaHUD();
  }

  /**
   * Sincroniza las capas espaciales (VGI, Oficiales IDE, Importadas) en el visor 3D
   */
  function sincronizarCapas(coleccionCapas) {
    capasActivasSincronizadas = { ...(coleccionCapas || {}) };

    if (!mapa3D || !grupoCapas3D) {
      capasPendientes = { ...(coleccionCapas || {}) };
      return;
    }

    grupoCapas3D.clearLayers();
    let totalEntidades = 0;

    Object.keys(capasActivasSincronizadas).forEach(capaId => {
      const gj = capasActivasSincronizadas[capaId];
      if (!gj || !gj.features || gj.features.length === 0) return;

      const colorBase = COLORES_POR_DEFECTO[capaId] || COLORES_POR_DEFECTO.defecto;
      totalEntidades += gj.features.length;

      try {
        const capaL = L.geoJSON(gj, {
          style: feature => {
            const props = feature.properties || {};
            const col = props._color || props.color || colorBase;
            return {
              color: col,
              weight: 2.2,
              opacity: 0.95,
              fillColor: col,
              fillOpacity: 0.35
            };
          },
          pointToLayer: (feature, latlng) => {
            const props = feature.properties || {};
            const col = props._color || props.color || colorBase;
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: col,
              color: '#10B981',
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.85
            });
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {};
            const nombre = props._nombre || props.nombre || props.name || props.NOM || props.NOM_COMUNA || 'Elemento Territorial 3D';
            const subtipo = props._subtipo || props.subtipo || props.amenity || props.shop || props.highway || props.building || 'Dato Espacial';
            const fuente = props._fuente || props.fuente || 'IDE Chile / OpenStreetMap';

            layer.bindPopup(`
              <div style="font-family:'IBM Plex Mono',monospace; background:#0B0E0A; color:#EDE6D6; padding:6px; font-size:0.75rem;">
                <strong style="color:#10B981;">[VISTA TÁCTICA 3D]</strong><br>
                <span style="font-weight:700; font-size:0.85rem;">${nombre}</span><br>
                <span style="color:#94A3B8;">${subtipo}</span><br>
                <small style="color:#64748B;">Fuente: ${fuente}</small>
              </div>
            `);
          }
        });

        grupoCapas3D.addLayer(capaL);
      } catch (e) {
        console.warn(`[ModuloGlobo]: Error al renderizar capa ${capaId}:`, e);
      }
    });

    const elemCoords = document.querySelector('.globo-hud-coords');
    if (elemCoords && mapa3D) {
      const centro = mapa3D.getCenter();
      const zoom = mapa3D.getZoom();
      const cantCapas = Object.keys(capasActivasSincronizadas).length;
      elemCoords.innerHTML = `LAT <strong>${centro.lat.toFixed(4)}°</strong> | LON <strong>${centro.lng.toFixed(4)}°</strong> | ZOOM: <strong>${zoom}</strong> | ENTIDADES 3D: <strong>${totalEntidades}</strong>`;
    }
  }

  /**
   * Enfoque centrado en Barrio Brasil / Universidad Alberto Hurtado
   */
  function volarABarrioBrasil(duracionMs = 1000) {
    if (!mapa3D) return;
    mapa3D.flyTo([-33.4445, -70.6620], 14, { duration: duracionMs / 1000 });
  }

  /**
   * Vuela la cámara hacia coordenadas arbitrarias
   */
  function volarACoordenadas(lat, lng, zoom = 14, duracionMs = 1000) {
    if (!mapa3D) return;
    const z = typeof zoom === 'number' && zoom >= 3 && zoom <= 18 ? zoom : 14;
    mapa3D.flyTo([Number(lat), Number(lng)], z, { duration: duracionMs / 1000 });
  }

  function estaInicializado() {
    return mapa3D !== null;
  }

  function obtenerInstancia() {
    return mapa3D;
  }

  function iniciarBucleMonitoreoCamara() {
    actualizarTelemetriaHUD();
  }

  function detenerBucleMonitoreoCamara() {
    // En arquitectura Leaflet reactiva por eventos, no se requiere bucle polling invasivo
  }

  return {
    inicializar,
    redimensionar,
    sincronizarCapas,
    volarABarrioBrasil,
    volarACoordenadas,
    acercar,
    alejar,
    ejecutarTransicionA2D,
    iniciarBucleMonitoreoCamara,
    detenerBucleMonitoreoCamara,
    estaInicializado,
    obtenerInstancia,
    obtenerMapaLeaflet: () => mapa3D
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloGlobo = ModuloGlobo;
}
