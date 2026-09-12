/*
  globo.js
  --------
  Módulo de visualización táctica tridimensional sobre globo terráqueo esférico (WebGL / Three.js)
  para el Atlas VGI de Barrio Brasil y la Universidad Alberto Hurtado.

  Construido sobre Globe.gl / Three.js con textura táctica nocturna (Night Earth),
  halo atmosférico esmeralda CRT (#10B981), telemetría continua en tiempo real,
  controles de aproximación y alejamiento de alta respuesta (OrbitControls dolly),
  proyección de geometrías espaciales 2D sobre la esfera y transición multiescala fluida 3D <-> 2D.
*/

const ModuloGlobo = (() => {
  let globo = null;
  let contenedorId = 'globo-3d-canvas';
  let capasActivasSincronizadas = {};
  let capasPendientes = null;
  let altitudActual = 0.035;

  // Umbral geodésico para conmutar automáticamente de 3D a visión 2D de alta resolución
  const UMBRAL_TRANSICION_2D_METROS = 2200; // < 2.2 km conmuta a vista 2D barrial
  let transicionEnCurso = false;
  let idLoopMonitoreo = null;

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
   * Normaliza cualquier formato de color (#hex, rgb) a string rgba(...) para Three.js / Globe.gl
   */
  function normalizarColorRgba(col, alpha = 0.85) {
    if (!col) return `rgba(53, 88, 107, ${alpha})`;
    if (typeof col !== 'string') return `rgba(53, 88, 107, ${alpha})`;
    if (col.startsWith('rgba') || col.startsWith('rgb')) return col;
    if (col.startsWith('#')) {
      let c = col.replace('#', '');
      if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      }
      if (c.length >= 6) {
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    return col;
  }

  /**
   * Monitoreo dinámico continuo de la cámara en Three.js:
   * Calcula la altitud geodésica real en metros/km en función de la distancia al centro de la esfera (R=100)
   * y desencadena la transición automática a visión 2D al alcanzar la escala barrial.
   */
  function monitorearCamaraYTransicion() {
    if (!globo) return;
    const elemCont = document.getElementById(contenedorId);
    if (!elemCont || elemCont.offsetParent === null) return;

    const camara = globo.camera();
    if (!camara) return;

    // Distancia euclidiana de la cámara al centro del globo (R = 100)
    const distCentro = camara.position.length();
    // Altitud relativa sobre la superficie: (dist - 100) / 100
    const altitudRelativa = Math.max(0.00001, (distCentro - 100) / 100);
    // Radio real de la Tierra: 6.371.000 m
    const altitudMetros = Math.round(altitudRelativa * 6371000);
    altitudActual = altitudRelativa;

    let latCentro = -33.4445;
    let lngCentro = -70.6620;
    try {
      const pov = globo.pointOfView();
      if (pov && typeof pov.lat === 'number' && !isNaN(pov.lat)) {
        latCentro = pov.lat;
        lngCentro = pov.lng;
      }
    } catch (_) {}

    actualizarHUDTelemetria(altitudMetros, latCentro, lngCentro);

    // Conmutación automática a 2D cuando la cámara se acerca a nivel barrial (< 2.2 km)
    if (altitudMetros <= UMBRAL_TRANSICION_2D_METROS && !transicionEnCurso) {
      ejecutarTransicionA2D(latCentro, lngCentro);
    }
  }

  /**
   * Bucle reactivo continuo que actualiza la telemetría en cada frame de animación
   */
  function iniciarBucleMonitoreoCamara() {
    if (idLoopMonitoreo) cancelAnimationFrame(idLoopMonitoreo);
    function tick() {
      monitorearCamaraYTransicion();
      idLoopMonitoreo = requestAnimationFrame(tick);
    }
    idLoopMonitoreo = requestAnimationFrame(tick);
  }

  function detenerBucleMonitoreoCamara() {
    if (idLoopMonitoreo) {
      cancelAnimationFrame(idLoopMonitoreo);
      idLoopMonitoreo = null;
    }
  }

  /**
   * Despliega la telemetría dinámica en el HUD en tiempo real (se actualiza fluidamente al hacer in/out)
   */
  function actualizarHUDTelemetria(altitudMetros, latCentro, lngCentro) {
    const elemHud = document.getElementById('globo-hud-escala');
    if (elemHud) {
      let escalaEtiqueta = '🪐 ESCALA PLANETARIA';
      if (altitudMetros <= UMBRAL_TRANSICION_2D_METROS) {
        escalaEtiqueta = '🔬 ESCALA BARRIAL (TRANSICIÓN 2D ACTIVA)';
      } else if (altitudMetros < 25000) {
        escalaEtiqueta = '🏘️ COMUNAL / BARRIO BRASIL';
      } else if (altitudMetros < 150000) {
        escalaEtiqueta = '🏙️ GRAN SANTIAGO METROPOLITANO';
      } else if (altitudMetros < 1200000) {
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
      let cantEntidades = 0;
      if (globo) {
        const p = globo.pointsData() || [];
        const poly = globo.polygonsData() || [];
        const lines = globo.pathsData() || [];
        cantEntidades = p.length + poly.length + lines.length;
      }
      elemCoords.innerHTML = `LAT <strong>${latCentro.toFixed(4)}°</strong> | LON <strong>${lngCentro.toFixed(4)}°</strong> | CAPAS: <strong>${cantCapas}</strong> | OBJ: <strong>${cantEntidades}</strong>`;
    }
  }

  /**
   * Ejecuta la transición visual fluida desde el globo 3D hacia el mapa 2D detallado
   */
  function ejecutarTransicionA2D(lat, lng) {
    if (transicionEnCurso) return;
    transicionEnCurso = true;

    // Alerta visual liminal Backrooms
    const contGlobo = document.getElementById('contenedor-globo-3d');
    if (contGlobo) {
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
      }, 1200);
    }, 220);
  }

  /**
   * Controles manuales de aproximación y alejamiento:
   * Utilizan de forma directa la aceleración dolly del motor OrbitControls de Three.js,
   * garantizando respuesta inmediata en 3D, animación fluida y telemetría dinámica reactiva.
   */
  function acercar() {
    if (!globo) return;
    const controles = globo.controls();
    if (controles && typeof controles.dollyIn === 'function') {
      let paso = 0;
      const totalPasos = 4;
      const factorPaso = Math.pow(0.68, 1 / totalPasos);
      function animarZoomIn() {
        if (paso < totalPasos && globo && globo.controls()) {
          globo.controls().dollyIn(factorPaso);
          globo.controls().update();
          monitorearCamaraYTransicion();
          paso++;
          requestAnimationFrame(animarZoomIn);
        }
      }
      requestAnimationFrame(animarZoomIn);
      return;
    }

    // Mecanismo de respaldo seguro mediante pointOfView
    const pov = globo.pointOfView();
    const lat = (pov && typeof pov.lat === 'number' && !isNaN(pov.lat)) ? pov.lat : -33.4445;
    const lng = (pov && typeof pov.lng === 'number' && !isNaN(pov.lng)) ? pov.lng : -70.6620;
    const alt = (pov && typeof pov.altitude === 'number' && !isNaN(pov.altitude)) ? pov.altitude : altitudActual;
    const nuevaAlt = Math.max(0.0001, alt * 0.68);
    globo.pointOfView({ lat, lng, altitude: nuevaAlt }, 200);
    setTimeout(monitorearCamaraYTransicion, 220);
  }

  function alejar() {
    if (!globo) return;
    const controles = globo.controls();
    if (controles && typeof controles.dollyOut === 'function') {
      let paso = 0;
      const totalPasos = 4;
      const factorPaso = Math.pow(0.68, 1 / totalPasos);
      function animarZoomOut() {
        if (paso < totalPasos && globo && globo.controls()) {
          globo.controls().dollyOut(factorPaso);
          globo.controls().update();
          monitorearCamaraYTransicion();
          paso++;
          requestAnimationFrame(animarZoomOut);
        }
      }
      requestAnimationFrame(animarZoomOut);
      return;
    }

    // Mecanismo de respaldo seguro mediante pointOfView
    const pov = globo.pointOfView();
    const lat = (pov && typeof pov.lat === 'number' && !isNaN(pov.lat)) ? pov.lat : -33.4445;
    const lng = (pov && typeof pov.lng === 'number' && !isNaN(pov.lng)) ? pov.lng : -70.6620;
    const alt = (pov && typeof pov.altitude === 'number' && !isNaN(pov.altitude)) ? pov.altitude : altitudActual;
    const nuevaAlt = Math.min(2.5, alt * 1.47 + 0.005);
    globo.pointOfView({ lat, lng, altitude: nuevaAlt }, 200);
    setTimeout(monitorearCamaraYTransicion, 220);
  }

  /**
   * Inicializa el globo terráqueo 3D en el contenedor especificado con modelo táctico Night Earth.
   * — Garantiza dimensiones reales del canvas ANTES de montar Globe.gl (evita canvas a 0×0 negro).
   * — Usa dos URLs de textura: la de unpkg como primaria y un fallback en jsDelivr.
   * — No requiere ninguna API key: toda la textura viene de CDN público.
   * — Si Globe() aún no está disponible (CDN lento), reintenta hasta 10 veces cada 300 ms.
   */
  function inicializar(idElemento = 'globo-3d-canvas', _intentos = 0) {
    if (typeof Globe === 'undefined') {
      if (_intentos < 10) {
        console.warn(`[ModuloGlobo]: Globe.gl aún no cargado, reintentando (${_intentos + 1}/10)…`);
        setTimeout(() => inicializar(idElemento, _intentos + 1), 300);
      } else {
        console.error('[ModuloGlobo]: Globe.gl no está disponible después de 3 s. Verificar CDN en index.html.');
      }
      return false;
    }

    const elem = document.getElementById(idElemento);
    if (!elem) {
      console.warn(`[ModuloGlobo]: No se encontró el elemento #${idElemento}`);
      return false;
    }

    contenedorId = idElemento;

    // Si ya existe instancia previa, redimensionar y reactivar loop
    if (globo) {
      redimensionar();
      iniciarBucleMonitoreoCamara();
      if (capasPendientes) {
        const p = capasPendientes;
        capasPendientes = null;
        sincronizarCapas(p);
      } else {
        sincronizarCapas(capasActivasSincronizadas);
      }
      return true;
    }

    // ── Garantizar dimensiones reales antes de montar Globe.gl ──
    // Si el contenedor padre está oculto (display:none), el elem tendrá 0px.
    // Leemos del padre visible y forzamos las dimensiones en el canvas directamente.
    const contenedorPadre = elem.closest('#contenedor-globo-3d') || elem.parentElement;
    let ancho = elem.clientWidth;
    let alto  = elem.clientHeight;

    if (ancho === 0 && contenedorPadre) ancho = contenedorPadre.clientWidth || contenedorPadre.offsetWidth;
    if (alto  === 0 && contenedorPadre) alto  = contenedorPadre.clientHeight || contenedorPadre.offsetHeight;

    // Fallback de dimensiones mínimas si aún sigue en 0
    if (ancho <= 0) ancho = window.innerWidth  || 800;
    if (alto  <= 0) alto  = 540;

    // Forzar tamaño explícito en el div canvas para que WebGL tenga espacio
    elem.style.width  = ancho + 'px';
    elem.style.height = alto  + 'px';

    // ── URLs de textura Night Earth — sin API key, CDN público ──
    const TEXTURA_PRIMARIA  = 'https://unpkg.com/three-globe@2.45.2/example/img/earth-night.jpg';
    const TEXTURA_FALLBACK  = 'https://cdn.jsdelivr.net/npm/three-globe@2.45.2/example/img/earth-night.jpg';

    try {
      // Montar Globe.gl (WebGL nativo, sin API key)
      globo = Globe()(elem)
        .width(ancho)
        .height(alto)
        .globeImageUrl(TEXTURA_PRIMARIA)
        .backgroundColor('rgba(11, 14, 10, 0.96)')
        .showAtmosphere(true)
        .atmosphereColor('#10B981')
        .atmosphereAltitude(0.09)
        // Capa de Polígonos 2D sobre la esfera
        .polygonGeoJsonGeometry(d => d.geometry)
        .polygonCapColor(d => {
          const col = d.properties._colorGlobo || d.properties.color || '#35586B';
          return normalizarColorRgba(col, 0.85);
        })
        .polygonSideColor(d => {
          const col = d.properties._colorGlobo || d.properties.color || '#35586B';
          return normalizarColorRgba(col, 0.40);
        })
        .polygonStrokeColor(d => d.properties._colorGlobo || '#10B981')
        .polygonAltitude(0.0045)
        .polygonLabel(d => formatearTooltip(d))
        .onPolygonClick(polygon => { mostrarDetalleEntidad(polygon); })
        // Capa de Líneas/Caminos 2D
        .pathPoints(d => d.coords)
        .pathPointLat(p => p[1])
        .pathPointLng(p => p[0])
        .pathColor(d => d.color || '#10B981')
        .pathStroke(null)
        .pathAltitude(0.006)
        .pathLabel(d => formatearTooltip(d))
        .onPathClick(linea => { mostrarDetalleEntidad(linea); })
        // Capa de Puntos 2D
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointColor(d => normalizarColorRgba(d.color || '#A97722', 0.95))
        .pointAltitude(0.008)
        .pointRadius(0.0035)
        .pointLabel(d => formatearTooltip(d))
        .onPointClick(punto => { mostrarDetalleEntidad(punto); });

      // ── Fallback: si la textura primaria falla, cargar la alternativa ──
      const renderer = globo.renderer();
      if (renderer && renderer.domElement) {
        const canvas = renderer.domElement;
        // Verificar si la textura cargó (si el globo sigue negro después de 4 s, cambiamos URL)
        setTimeout(() => {
          if (globo && renderer.info && renderer.info.memory && renderer.info.memory.textures === 0) {
            console.warn('[ModuloGlobo]: Textura primaria no cargó, usando fallback jsDelivr…');
            globo.globeImageUrl(TEXTURA_FALLBACK);
          }
        }, 4000);
      }

      // ── Configuración de OrbitControls ──
      const controles = globo.controls();
      if (controles) {
        controles.autoRotate    = false;
        controles.enableDamping = true;
        controles.dampingFactor = 0.08;
        controles.minDistance   = 100.0001;
        controles.maxDistance   = 1000.0;
        controles.zoomSpeed     = 1.2;
      }

      // ── Cámara near plane ──
      const camara = globo.camera();
      if (camara) {
        camara.near = 0.0005;
        camara.updateProjectionMatrix();
      }

      // ── Listeners de telemetría ──
      elem.addEventListener('wheel',       () => requestAnimationFrame(monitorearCamaraYTransicion), { passive: true });
      elem.addEventListener('pointermove', () => monitorearCamaraYTransicion(), { passive: true });
      elem.addEventListener('touchmove',   () => monitorearCamaraYTransicion(), { passive: true });

      iniciarBucleMonitoreoCamara();

      // Enfoque inicial a Barrio Brasil
      volarABarrioBrasil(1000);

      // Sincronizar capas pendientes
      const aCargar = capasPendientes || capasActivasSincronizadas;
      if (aCargar && Object.keys(aCargar).length > 0) {
        sincronizarCapas(aCargar);
        capasPendientes = null;
      }

      window.addEventListener('resize', () => redimensionar());

      console.log('[ModuloGlobo]: Globo 3D esférico Globe.gl montado con éxito. Textura Night Earth, sin API key.');
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
    const ancho = elem.clientWidth || elem.parentElement?.clientWidth || window.innerWidth || 800;
    const alto = elem.clientHeight || 540;
    if (ancho > 0 && alto > 0) {
      globo.width(ancho).height(alto);
    }
  }

  /**
   * Sincroniza todas las capas activas (VGI y Oficiales IDE) en el globo 3D
   */
  function sincronizarCapas(coleccionCapas) {
    capasActivasSincronizadas = { ...(coleccionCapas || {}) };

    if (!globo) {
      capasPendientes = { ...(coleccionCapas || {}) };
      return;
    }

    const poligonos = [];
    const lineas = [];
    const puntos = [];

    Object.keys(capasActivasSincronizadas).forEach(capaId => {
      const gj = capasActivasSincronizadas[capaId];
      if (!gj || !gj.features) return;

      const color = COLORES_POR_DEFECTO[capaId] || COLORES_POR_DEFECTO.defecto;

      gj.features.forEach(feat => {
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

    // Actualizar datos en el globo esférico 3D
    globo.polygonsData(poligonos);
    globo.pathsData(lineas);
    globo.pointsData(puntos);

    // Actualizar telemetría de capas en el HUD
    const elemCoords = document.querySelector('.globo-hud-coords');
    if (elemCoords) {
      const cantCapas = Object.keys(capasActivasSincronizadas).length;
      const cantEntidades = poligonos.length + lineas.length + puntos.length;
      let lat = -33.4445;
      let lng = -70.6620;
      try {
        const pov = globo.pointOfView();
        if (pov && typeof pov.lat === 'number') {
          lat = pov.lat;
          lng = pov.lng;
        }
      } catch (_) {}
      elemCoords.innerHTML = `LAT <strong>${lat.toFixed(4)}°</strong> | LON <strong>${lng.toFixed(4)}°</strong> | CAPAS: <strong>${cantCapas}</strong> | OBJ: <strong>${cantEntidades}</strong>`;
    }

    console.log(`[ModuloGlobo]: Sincronizados ${poligonos.length} polígonos, ${lineas.length} líneas y ${puntos.length} puntos en la esfera 3D.`);
  }

  /**
   * Genera el HTML del tooltip al posar el cursor sobre un objeto 3D
   */
  function formatearTooltip(objeto) {
    const props = objeto.properties || {};
    const nombre = props._nombre || props.nombre || props.name || props.NOM || props.NOM_COMUNA || props.especie || 'Elemento Territorial';
    const subtipo = props._subtipo || props.subtipo || props.amenity || props.shop || props.highway || props.building || 'Dato Geoespacial';
    const fuente = props._fuente || props.fuente || 'OpenStreetMap / IDE Chile';
    const color = props._colorGlobo || props._color || '#35586B';
    const esOficial = !!props._idOficial || !!props.OBJECTID || !!props.ZONA || !!props.CUT;

    return `
      <div style="font-family:'Spectral', Georgia, serif; background:#181D16; color:#EDE6D6; padding:8px 12px; border:1px solid ${color}; border-radius:3px; max-width:280px; font-size:0.8rem; box-shadow:0 4px 14px rgba(0,0,0,0.6);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-size:0.7rem; font-family:'IBM Plex Mono',monospace; color:${color}; font-weight:bold;">
            ${esOficial ? '🏛️ OFICIAL ESTADO DE CHILE' : '📍 VGI ABIERTO'}
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
    const nombre = props._nombre || props.nombre || props.name || props.NOM || props.especie || 'Elemento Territorial';
    const institucion = props._institucion || props.fuente || 'OpenStreetMap / Colaborativo';
    const cita = props._citaAPA || '';

    const infoTexto = document.getElementById('estado-carga-capas');
    if (infoTexto) {
      infoTexto.innerHTML = `
        <span style="color:var(--musgo); font-weight:600;">[Inspección Territorial 3D]:</span> 
        <strong>${nombre}</strong> (${institucion}). 
        ${cita ? `<br><small style="color:var(--tinta-suave);">Cita oficial: ${cita}</small>` : ''}
      `;
    }
  }

  /**
   * Enfoque orbital exclusivo a Barrio Brasil / Universidad Alberto Hurtado
   */
  function volarABarrioBrasil(duracionMs = 1200) {
    if (!globo) return;
    globo.pointOfView({
      lat: -33.4445,
      lng: -70.6620,
      altitude: 0.035
    }, duracionMs);
  }

  /**
   * Vuela la cámara hacia coordenadas arbitrarias (útil para capas importadas o búsquedas)
   */
  function volarACoordenadas(lat, lng, altitud = 0.035, duracionMs = 1200) {
    if (!globo) return;
    let alt = Number(altitud);
    // Si viene un nivel de zoom tipo Leaflet (ej. 10 a 19), convertirlo a altitud orbital equivalente
    if (alt >= 3.0) {
      if (alt >= 16) alt = 0.0008;
      else if (alt >= 14) alt = 0.035;
      else if (alt >= 10) alt = 0.15;
      else alt = 0.5;
    }
    globo.pointOfView({
      lat: Number(lat),
      lng: Number(lng),
      altitude: alt
    }, duracionMs);
  }

  function estaInicializado() {
    return globo !== null;
  }

  function obtenerInstancia() {
    return globo;
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
    obtenerInstancia
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloGlobo = ModuloGlobo;
}
