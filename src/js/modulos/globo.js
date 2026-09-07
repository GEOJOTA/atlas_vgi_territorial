/*
  globo.js
  --------
  Módulo de visualización tridimensional esférica (Globo Terráqueo 3D) para el Atlas VGI.
  Construido sobre WebGL / Three.js mediante Globe.gl.

  Características:
  - Vista del planeta Tierra completo desde el espacio exterior con atmósfera, nubes y campo estelar.
  - Vuelo cinemático y aproximación suave hacia Barrio Brasil / Universidad Alberto Hurtado.
  - Proyección en 3D de todas las capas vectoriales cargadas en el Atlas:
    * Polígonos 3D (edificaciones, usos de suelo, manzanas Censo 2024, patrimonio MINVU, parques).
    * Líneas 3D (red vial, ciclovías, corredores de transporte).
    * Puntos 3D (equipamientos, paraderos, monumentos CMN, registros GBIF).
  - Interactividad con tooltips y popups detallados al pasar el cursor o hacer clic.
  - Modos de cámara: Rotación orbital automática, Vista Planetaria y Centrado Territorial.
*/

const ModuloGlobo = (() => {
  let globo = null;
  let contenedorId = 'globo-3d-canvas';
  let autoRotacionActiva = false;
  let atmosferaActiva = true;
  let capasActivasSincronizadas = {};

  // Paleta temática
  const COLORES_POR_DEFECTO = {
    educacion: '#35586B',
    servicios: '#A97722',
    transporte: '#2C4238',
    movilidad_activa: '#3F5D4E',
    espacio_publico: '#236B43',
    patrimonio: '#8F3A2C',
    accesibilidad: '#4B5142',
    biodiversidad: '#1C523A',
    edificaciones: '#777777',
    cobertura_suelo: '#5B704E',
    // Oficiales IDE
    censo2024_manzanas: '#1B4D3E',
    minvu_patrimonio: '#8F3A2C',
    minvu_parques: '#236B43',
    minvu_barrios_historicos: '#7D5A2B',
    cmn_sitios_memoria: '#4B5142',
    defecto: '#35586B'
  };

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

    // Si ya existe instancia previa, redimensionar y salir
    if (globo) {
      redimensionar();
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
          return col.startsWith('#') ? col + '77' : 'rgba(53, 88, 107, 0.45)';
        })
        .polygonStrokeColor(() => '#1A2016')
        .polygonAltitude(d => d.properties._altitudGlobo || 0.005)
        .polygonLabel(d => formatearTooltip(d))
        .onPolygonClick((polygon, event, { lat, lng, altitude }) => {
          mostrarDetalleEntidad(polygon);
        })
        // Capa de Líneas/Caminos 3D
        .pathPoints(d => d.coords)
        .pathPointLat(p => p[1])
        .pathPointLng(p => p[0])
        .pathColor(d => d.color || '#2C4238')
        .pathStroke(d => d.stroke || 2.5)
        .pathAltitude(0.004)
        .pathLabel(d => formatearTooltip(d))
        .onPathClick(linea => {
          mostrarDetalleEntidad(linea);
        })
        // Capa de Puntos 3D
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointColor(d => d.color || '#A97722')
        .pointAltitude(0.012)
        .pointRadius(0.18)
        .pointLabel(d => formatearTooltip(d))
        .onPointClick(punto => {
          mostrarDetalleEntidad(punto);
        });

      // Configuración de controles orbitales
      const controles = globo.controls();
      if (controles) {
        controles.autoRotate = false;
        controles.autoRotateSpeed = 0.5;
        controles.enableDamping = true;
        controles.dampingFactor = 0.08;
      }

      // Enfoque inicial a Barrio Brasil / Santiago de Chile
      volarABarrioBrasil(1500);

      // Listener de redimensionamiento
      window.addEventListener('resize', () => {
        redimensionar();
      });

      console.log('[ModuloGlobo]: Globo terráqueo 3D inicializado con éxito.');
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
    if (!globo) return;
    capasActivasSincronizadas = coleccionCapas || {};

    const poligonos = [];
    const lineas = [];
    const puntos = [];

    Object.keys(capasActivasSincronizadas).forEach(capaId => {
      const gj = capasActivasSincronizadas[capaId];
      if (!gj || !gj.features) return;

      const color = COLORES_POR_DEFECTO[capaId] || COLORES_POR_DEFECTO.defecto;

      gj.features.forEach((feat, idx) => {
        if (!feat || !feat.geometry) return;
        const geom = feat.geometry;
        const geomType = geom.type;
        const props = { ...(feat.properties || {}) };

        props._capaId = capaId;
        props._colorGlobo = props._color || color;

        if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
          // Altura de extrusión proporcional al tipo de elemento
          let altitud = 0.005;
          if (capaId === 'edificaciones' || props.building) {
            altitud = 0.008;
          } else if (capaId === 'censo2024_manzanas') {
            altitud = 0.004;
          } else if (capaId === 'patrimonio' || capaId === 'minvu_patrimonio') {
            altitud = 0.007;
          }
          props._altitudGlobo = altitud;

          poligonos.push({
            type: 'Feature',
            geometry: geom,
            properties: props
          });
        } else if (geomType === 'LineString') {
          lineas.push({
            coords: geom.coordinates,
            color: props._colorGlobo,
            stroke: 2.8,
            properties: props
          });
        } else if (geomType === 'MultiLineString') {
          geom.coordinates.forEach(coordSet => {
            lineas.push({
              coords: coordSet,
              color: props._colorGlobo,
              stroke: 2.8,
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
      <div style="font-family:'Spectral', Georgia, serif; background:#181D16; color:#EDE6D6; padding:8px 12px; border:1px solid ${color}; border-radius:3px; max-width:260px; font-size:0.8rem; box-shadow:0 4px 12px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-size:0.7rem; font-family:'IBM Plex Mono',monospace; color:${color}; font-weight:bold;">
            ${esOficial ? '🏛️ OFICIAL IDE' : '📍 VGI ABIERTO'}
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
    const declaracion = props._declaracion || '';

    // Notificar al estado de la aplicación
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
   * Vuelo cinemático hacia Barrio Brasil / UAH (Santiago)
   */
  function volarABarrioBrasil(duracionMs = 2500) {
    if (!globo) return;
    globo.pointOfView({
      lat: -33.4445,
      lng: -70.6620,
      altitude: 0.48
    }, duracionMs);
  }

  /**
   * Vista de la Tierra completa desde el espacio exterior
   */
  function vistaPlanetaCompleto(duracionMs = 2000) {
    if (!globo) return;
    globo.pointOfView({
      lat: -25.0,
      lng: -70.0,
      altitude: 2.6
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
    vistaPlanetaCompleto,
    alternarRotacion,
    alternarAtmosfera,
    estaInicializado
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloGlobo = ModuloGlobo;
}
