/*
  globo.js
  --------
  Módulo de visualización tridimensional esférica (Globo Terráqueo 3D) para el Atlas VGI.
  Construido sobre WebGL / Three.js mediante Globe.gl.

  Características Principales:
  1. Escalado Dinámico por Nivel de Zoom (LOD - Level of Detail):
     - Detección reactiva de altitud de cámara en tiempo real.
     - A escala planetaria (alt > 1.5): balizas y marcadores de luz visibles desde el espacio.
     - A escala metropolitana (0.1 < alt < 0.8): redes viales, comunas y macro-usos normativos.
     - A escala de barrio (alt < 0.02): extrusión volumétrica 3D de edificaciones (con altura
       por pisos building:levels), parcelas catastrales, micro-puntos de árboles y mobiliario.
  2. Sincronización Reactiva de Capas:
     - Detección inmediata de capas activadas (VGI y Oficiales IDE/MINVU).
     - Buffer de capas pendientes si la vista 3D no ha sido abierta aún.
     - Redimensionamiento automático al alternar vistas 2D/3D.
  3. Controles y Presets de Vuelo Orbital:
     - 🪐 Vista Planetaria (Macro / Tierra Completa).
     - 🇨🇱 Chile Central (Escala Regional).
     - 🏙️ Gran Santiago (Escala Metropolitana).
     - 🏘️ Barrio Brasil 3D (Escala Urbana de Detalle).
     - Rotación orbital automática y conmutador de halo atmosférico.
*/

const ModuloGlobo = (() => {
  let globo = null;
  let contenedorId = 'globo-3d-canvas';
  let autoRotacionActiva = false;
  let atmosferaActiva = true;
  let capasActivasSincronizadas = {};
  let capasPendientes = null;
  let altitudActual = 0.015;
  let timerActualizarEscala = null;

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
    edificaciones: '#555555',
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
    // Nuevas capas normativas IPT MINVU
    minvu_ipt_prc_santiago: '#D97706',
    minvu_ipt_prms_usosuelo: '#7C3AED',
    minvu_ipt_areas_verdes: '#059669',
    minvu_ipt_areas_riesgo: '#DC2626',
    minvu_ipt_resguardo_infraestructura: '#0284C7',
    minvu_ipt_limite_urbano: '#4F46E5',
    defecto: '#35586B'
  };

  /**
   * Cálculo dinámico del radio de puntos según altitud de cámara (LOD)
   */
  function calcularRadioPunto(d, alt) {
    const a = Math.max(0.002, Math.min(alt, 2.5));
    if (a < 0.025) {
      return 0.0016 + (a * 0.06);
    } else if (a < 0.12) {
      return 0.003 + (a * 0.05);
    } else if (a < 0.7) {
      return 0.012 + (a * 0.04);
    } else {
      return 0.05 + (a * 0.035);
    }
  }

  /**
   * Altitud de puntos sobre la superficie del globo
   */
  function calcularAltitudPunto(d, alt) {
    const a = Math.max(0.002, Math.min(alt, 2.5));
    return Math.max(0.0006, Math.min(0.02, a * 0.012));
  }

  /**
   * Grosor de líneas/caminos según altitud de cámara
   */
  function calcularGrosorLinea(d, alt) {
    const a = Math.max(0.002, Math.min(alt, 2.5));
    if (a < 0.03) return 1.6;
    if (a < 0.25) return 2.2;
    return 3.0;
  }

  /**
   * Altitud de extrusión 3D para polígonos (edificios, zonificaciones, riesgos)
   */
  function calcularAltitudPoligono(d, alt) {
    const props = d.properties || {};
    const capaId = props._capaId;
    const a = Math.max(0.002, Math.min(alt, 2.5));

    if (capaId === 'edificaciones' || props.building) {
      const niveles = parseInt(props['building:levels']) || (props.building === 'yes' ? 3 : 2);
      const factorZoom = a < 0.04 ? 1.0 : (a < 0.2 ? 0.6 : 0.25);
      return (0.0006 + (niveles * 0.00028)) * factorZoom;
    } else if (capaId === 'minvu_patrimonio' || capaId === 'patrimonio') {
      return 0.00075 * (a < 0.1 ? 1.0 : 0.5);
    } else if (capaId === 'minvu_ipt_areas_riesgo') {
      return 0.00065; // Resaltado en alerta
    } else if (capaId === 'minvu_ipt_areas_verdes' || capaId === 'espacio_publico' || capaId === 'minvu_parques') {
      return 0.00040;
    } else if (capaId === 'censo2024_manzanas') {
      return 0.00030;
    } else if (capaId === 'minvu_ipt_prms_usosuelo') {
      return 0.00025;
    } else if (capaId === 'minvu_ipt_prc_santiago') {
      return 0.00020; // Base de zonificación comunal
    } else if (capaId === 'minvu_ipt_limite_urbano' || capaId === 'limite_urbano_censal') {
      return 0.00015;
    }
    return 0.0004;
  }

  /**
   * Actualiza los valores dinámicos en Globe.gl según la altitud actual
   */
  function aplicarEscalasDinamicas() {
    if (!globo) return;
    try {
      globo.pointRadius(d => calcularRadioPunto(d, altitudActual));
      globo.pointAltitude(d => calcularAltitudPunto(d, altitudActual));
      globo.pathStroke(d => calcularGrosorLinea(d, altitudActual));
      globo.polygonAltitude(d => calcularAltitudPoligono(d, altitudActual));
    } catch (_) {}
  }

  /**
   * Listener reactivo al mover la cámara u orbitar
   */
  function reaccionarCambioCamara() {
    if (!globo) return;
    try {
      const pov = globo.pointOfView();
      if (!pov || pov.altitude === undefined) return;
      altitudActual = pov.altitude;

      actualizarHUD(pov);

      // Throttled update para no saturar el pipeline de WebGL
      if (timerActualizarEscala) return;
      timerActualizarEscala = setTimeout(() => {
        timerActualizarEscala = null;
        aplicarEscalasDinamicas();
      }, 100);
    } catch (_) {}
  }

  /**
   * Despliega la telemetría en el HUD de la interfaz
   */
  function actualizarHUD(pov) {
    const elemHud = document.getElementById('globo-hud-escala');
    if (!elemHud) return;

    const altM = Math.round(pov.altitude * 6371000);
    let altTexto = '';
    let detalleTexto = '';

    if (pov.altitude < 0.025) {
      altTexto = `${Math.round(altM / 10) * 10} m`;
      detalleTexto = '🏘️ NIVEL BARRIO / EDIFICACIONES 3D';
    } else if (pov.altitude < 0.09) {
      altTexto = `${(altM / 1000).toFixed(1)} km`;
      detalleTexto = '🏙️ NIVEL COMUNAL / SANTIAGO';
    } else if (pov.altitude < 0.5) {
      altTexto = `${Math.round(altM / 1000)} km`;
      detalleTexto = '🗺️ NIVEL METROPOLITANO';
    } else {
      altTexto = `${Math.round(altM / 1000)} km`;
      detalleTexto = '🪐 MACRO PLANETARIO';
    }

    elemHud.innerHTML = `<span><strong>ALT:</strong> ${altTexto}</span> &nbsp;|&nbsp; <span>${detalleTexto}</span>`;
  }

  /**
   * Inicializa el globo terráqueo 3D en el contenedor especificado
   */
  function inicializar(idElemento = 'globo-3d-canvas') {
    if (typeof Globe === 'undefined') {
      console.warn('[ModuloGlobo]: La biblioteca Globe.gl no está disponible todavía en window.');
      return false;
    }

    const elem = document.getElementById(idElemento);
    if (!elem) {
      console.warn(`[ModuloGlobo]: No se encontró el elemento #${idElemento}`);
      return false;
    }

    contenedorId = idElemento;

    // Si ya existe instancia previa, redimensionar y procesar capas pendientes
    if (globo) {
      redimensionar();
      if (capasPendientes) {
        const p = capasPendientes;
        capasPendientes = null;
        sincronizarCapas(p);
      }
      return true;
    }

    const ancho = elem.clientWidth || 800;
    const alto = elem.clientHeight || 520;

    try {
      globo = Globe()(elem)
        .width(ancho)
        .height(alto)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor('#70a9dc')
        .atmosphereAltitude(0.22)
        // Capa de Polígonos 3D
        .polygonGeoJsonGeometry(d => d.geometry)
        .polygonCapColor(d => d.properties._colorGlobo || d.properties.color || '#35586B')
        .polygonSideColor(d => {
          const col = d.properties._colorGlobo || d.properties.color || '#35586B';
          return col.startsWith('#') ? col + '88' : 'rgba(53, 88, 107, 0.55)';
        })
        .polygonStrokeColor(() => '#1A2016')
        .polygonAltitude(d => calcularAltitudPoligono(d, altitudActual))
        .polygonLabel(d => formatearTooltip(d))
        .onPolygonClick((polygon) => {
          mostrarDetalleEntidad(polygon);
        })
        // Capa de Líneas/Caminos 3D
        .pathPoints(d => d.coords)
        .pathPointLat(p => p[1])
        .pathPointLng(p => p[0])
        .pathColor(d => d.color || '#2C4238')
        .pathStroke(d => calcularGrosorLinea(d, altitudActual))
        .pathAltitude(0.0003)
        .pathLabel(d => formatearTooltip(d))
        .onPathClick(linea => {
          mostrarDetalleEntidad(linea);
        })
        // Capa de Puntos 3D
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointColor(d => d.color || '#A97722')
        .pointAltitude(d => calcularAltitudPunto(d, altitudActual))
        .pointRadius(d => calcularRadioPunto(d, altitudActual))
        .pointLabel(d => formatearTooltip(d))
        .onPointClick(punto => {
          mostrarDetalleEntidad(punto);
        });

      // Configuración de controles orbitales con zoom súper cercano
      const controles = globo.controls();
      if (controles) {
        controles.autoRotate = false;
        controles.autoRotateSpeed = 0.5;
        controles.enableDamping = true;
        controles.dampingFactor = 0.08;
        // Permitir zoom súper cercano hasta escala de cuadra / edificio
        controles.minDistance = 100.12;
        controles.maxDistance = 600.0;
        controles.addEventListener('change', reaccionarCambioCamara);
      }

      // Enfoque inicial a Barrio Brasil / Santiago de Chile
      volarABarrioBrasil(1500);

      // Si había capas esperando ser sincronizadas, proyectarlas de inmediato
      if (capasPendientes) {
        const p = capasPendientes;
        capasPendientes = null;
        sincronizarCapas(p);
      }

      // Listener de redimensionamiento
      window.addEventListener('resize', () => {
        redimensionar();
      });

      console.log('[ModuloGlobo]: Globo terráqueo 3D inicializado con éxito y controles LOD activos.');
      return true;
    } catch (err) {
      console.error('[ModuloGlobo]: Error al montar Globe.gl:', err);
      return false;
    }
  }

  /**
   * Ajusta el canvas al tamaño del contenedor
   */
  function redimensionar() {
    if (!globo) return;
    const elem = document.getElementById(contenedorId);
    if (!elem) return;
    const ancho = elem.clientWidth || 800;
    const alto = elem.clientHeight || 520;
    globo.width(ancho).height(alto);
  }

  /**
   * Sincroniza todas las capas activas (VGI y Oficiales IDE) en el globo 3D
   */
  function sincronizarCapas(coleccionCapas) {
    capasActivasSincronizadas = coleccionCapas || {};

    if (!globo) {
      capasPendientes = coleccionCapas;
      return;
    }

    const poligonos = [];
    const lineas = [];
    const puntos = [];

    Object.keys(capasActivasSincronizadas).forEach(capaId => {
      const gj = capasActivasSincronizadas[capaId];
      if (!gj || !gj.features) return;

      const color = COLORES_POR_DEFECTO[capaId] || COLORES_POR_DEFECTO.defecto;

      gj.features.forEach((feat) => {
        if (!feat || !feat.geometry) return;
        const geom = feat.geometry;
        const geomType = geom.type;
        const props = { ...(feat.properties || {}) };

        props._capaId = capaId;
        props._colorGlobo = props._color || color;

        if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
          poligonos.push({
            type: 'Feature',
            geometry: geom,
            properties: props
          });
        } else if (geomType === 'LineString') {
          lineas.push({
            coords: geom.coordinates,
            color: props._colorGlobo,
            properties: props
          });
        } else if (geomType === 'MultiLineString') {
          geom.coordinates.forEach(coordSet => {
            lineas.push({
              coords: coordSet,
              color: props._colorGlobo,
              properties: props
            });
          });
        } else if (geomType === 'Point') {
          puntos.push({
            lat: geom.coordinates[1],
            lng: geom.coordinates[0],
            color: props._colorGlobo,
            properties: props
          });
        } else if (geomType === 'MultiPoint') {
          geom.coordinates.forEach(pt => {
            puntos.push({
              lat: pt[1],
              lng: pt[0],
              color: props._colorGlobo,
              properties: props
            });
          });
        }
      });
    });

    // Actualizar datos en el globo
    globo.polygonsData(poligonos);
    globo.pathsData(lineas);
    globo.pointsData(puntos);

    aplicarEscalasDinamicas();

    console.log(`[ModuloGlobo]: Sincronizadas ${poligonos.length} polígonos, ${lineas.length} líneas y ${puntos.length} puntos en 3D.`);
  }

  /**
   * Genera el HTML del tooltip al posar el cursor sobre un objeto 3D
   */
  function formatearTooltip(objeto) {
    const props = objeto.properties || {};
    const nombre = props._nombre || props.nombre || props.name || props.especie || 'Elemento Territorial';
    const subtipo = props._subtipo || props.subtipo || props.amenity || props.shop || props.highway || props.building || 'Dato Geoespacial';
    const fuente = props._fuente || props.fuente || 'OpenStreetMap / IDE Chile';
    const color = props._colorGlobo || props._color || '#35586B';
    const esOficial = !!props._idOficial;

    return `
      <div style="font-family:'Spectral', Georgia, serif; background:#181D16; color:#EDE6D6; padding:8px 12px; border:1px solid ${color}; border-radius:3px; max-width:270px; font-size:0.8rem; box-shadow:0 4px 14px rgba(0,0,0,0.6);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-size:0.7rem; font-family:'IBM Plex Mono',monospace; color:${color}; font-weight:bold;">
            ${esOficial ? '🏛️ OFICIAL IDE / MINVU' : '📍 VGI ABIERTO'}
          </span>
          <span style="font-size:0.65rem; background:rgba(255,255,255,0.1); padding:1px 4px; border-radius:2px;">
            ${props._capaId || 'Capa'}
          </span>
        </div>
        <div style="font-weight:bold; font-size:0.9rem; margin-bottom:4px; color:#FFFFFF; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:3px;">
          ${nombre}
        </div>
        <div style="font-size:0.75rem; color:#A4AE98; margin-bottom:3px;">
          <strong>Clasificación:</strong> ${subtipo}
        </div>
        ${props.ZONA ? `<div style="font-size:0.72rem; color:#F59E0B;"><strong>Zona Normativa:</strong> ${props.ZONA}</div>` : ''}
        ${props.UPERM ? `<div style="font-size:0.70rem; color:#A4AE98;"><strong>Usos Permitidos:</strong> ${props.UPERM.slice(0, 80)}…</div>` : ''}
        ${props.superficie_m2 ? `<div style="font-size:0.72rem; color:#A4AE98;"><strong>Superficie:</strong> ${Number(props.superficie_m2).toLocaleString('es-CL')} m² (EPSG:32719)</div>` : ''}
        ${props['Población Total'] ? `<div style="font-size:0.72rem; color:#A4AE98;"><strong>Población:</strong> ${props['Población Total']}</div>` : ''}
        <div style="font-size:0.68rem; color:#7D8872; margin-top:4px;">
          Fuente: ${fuente}
        </div>
      </div>
    `;
  }

  /**
   * Despliega la información modal/panel de una entidad 3D al hacer clic
   */
  function mostrarDetalleEntidad(objeto) {
    const props = objeto.properties || {};
    const nombre = props._nombre || props.nombre || props.name || props.especie || 'Elemento Territorial';
    const institucion = props._institucion || props.fuente || 'OpenStreetMap / Colaborativo';
    const cita = props._citaAPA || '';

    const infoTexto = document.getElementById('estado-carga-capas');
    if (infoTexto) {
      infoTexto.innerHTML = `
        <span style="color:var(--musgo); font-weight:600;">[Inspección 3D]:</span> 
        <strong>${nombre}</strong> (${institucion}). 
        ${cita ? `<br><small style="color:var(--tinta-suave);">Cita oficial: ${cita}</small>` : ''}
      `;
    }
  }

  /**
   * Presets de vuelo cinemático con altitudes adaptativas
   */
  function volarABarrioBrasil(duracionMs = 2000) {
    if (!globo) return;
    globo.pointOfView({
      lat: -33.4445,
      lng: -70.6620,
      altitude: 0.015
    }, duracionMs);
  }

  function volarASantiago(duracionMs = 2000) {
    if (!globo) return;
    globo.pointOfView({
      lat: -33.445,
      lng: -70.660,
      altitude: 0.085
    }, duracionMs);
  }

  function volarAChile(duracionMs = 2000) {
    if (!globo) return;
    globo.pointOfView({
      lat: -33.45,
      lng: -70.65,
      altitude: 0.65
    }, duracionMs);
  }

  function vistaPlanetaCompleto(duracionMs = 2000) {
    if (!globo) return;
    globo.pointOfView({
      lat: -25.0,
      lng: -70.0,
      altitude: 2.3
    }, duracionMs);
  }

  /**
   * Alterna la rotación orbital automática del globo
   */
  function alternarRotacion() {
    if (!globo) return false;
    const controles = globo.controls();
    if (!controles) return false;
    autoRotacionActiva = !autoRotacionActiva;
    controles.autoRotate = autoRotacionActiva;
    return autoRotacionActiva;
  }

  /**
   * Alterna el halo atmosférico
   */
  function alternarAtmosfera() {
    if (!globo) return false;
    atmosferaActiva = !atmosferaActiva;
    globo.showAtmosphere(atmosferaActiva);
    return atmosferaActiva;
  }

  function estaInicializado() {
    return globo !== null;
  }

  return {
    inicializar,
    redimensionar,
    sincronizarCapas,
    volarABarrioBrasil,
    volarASantiago,
    volarAChile,
    vistaPlanetaCompleto,
    alternarRotacion,
    alternarAtmosfera,
    estaInicializado
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloGlobo = ModuloGlobo;
}
