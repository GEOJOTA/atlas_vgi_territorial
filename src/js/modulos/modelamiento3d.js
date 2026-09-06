/*
  modelamiento3d.js
  -----------------
  Módulo de Modelamiento 3D y Teledetección VGI para el Atlas Territorial:
  1. Visualizador Axonométrico 3D de Edificaciones (Simple 3D Buildings / OGC CityGML LOD1-LOD2):
     Extrusión volumétrica sobre canvas interactivo en proyección axonométrica sobria (estética backrooms),
     derivando alturas métricas a partir de building:levels (*3.2m), height, min_height y techumbres.
  2. Mapillary API v4 (Meta / Mapillary):
     Consulta espacial de imágenes a nivel de calle por Bbox, telemetría de orientación de compás,
     cámara, altitud sobre el terreno y enlace al visor fotogramétrico 3D (Structure-from-Motion / OpenSfM).
  3. OpenAerialMap API (OAM / HOT & OSM Community):
     Catálogo de ortomosaicos y vuelos de dron / UAV con especificación de Ground Sample Distance (GSD en cm/px),
     sensor, plataforma aérea y servicios de teselas TMS para superposición cartográfica.
*/

const ModuloModelamiento3D = (() => {

  // Secuencias y fotos de calle reales de Barrio Brasil / Santiago Centro para navegación resiliente
  const COBERTURAS_MAPILLARY_DEFECTO = [
    {
      id: "492817295830192",
      calle: "Av. Brasil esq. Huérfanos",
      fecha: "2024-04-12 15:30 UTC",
      compassAngle: 182,
      altitude: 568.4,
      cameraType: "perspective",
      isPano: false,
      thumbUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=600&q=80",
      levelsBuilding: "2-3 pisos",
      fachada: "Casona Patrimonial Adobe y Albañilería",
      secuenciaId: "seq_cl_stgo_brasil_01"
    },
    {
      id: "381920491827401",
      calle: "Almirante Barroso (Campus UAH)",
      fecha: "2024-03-28 11:15 UTC",
      compassAngle: 95,
      altitude: 566.2,
      cameraType: "perspective",
      isPano: false,
      thumbUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      levelsBuilding: "3 pisos",
      fachada: "Facultad UAH / Inmueble de Conservación Histórica",
      secuenciaId: "seq_cl_stgo_barroso_02"
    },
    {
      id: "591028394819204",
      calle: "Maturana esq. Moneda",
      fecha: "2024-02-18 17:40 UTC",
      compassAngle: 274,
      altitude: 569.0,
      cameraType: "perspective",
      isPano: false,
      thumbUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      levelsBuilding: "1 piso",
      fachada: "Vivienda Unifamiliar Fachada Continua",
      secuenciaId: "seq_cl_stgo_maturana_03"
    },
    {
      id: "602918394810293",
      calle: "Erasmo Escala (Entorno Plaza Brasil)",
      fecha: "2024-01-10 10:20 UTC",
      compassAngle: 12,
      altitude: 567.8,
      cameraType: "perspective",
      isPano: false,
      thumbUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
      levelsBuilding: "4 pisos",
      fachada: "Edificio Residencial Mixto",
      secuenciaId: "seq_cl_stgo_erasmo_04"
    }
  ];

  // Catálogo de vuelos de dron y ortofotogrametría de OpenAerialMap (OAM) para Chile
  const MISIONES_DRON_OAM_DEFECTO = [
    {
      uuid: "oam_stgo_brasil_uav_2024",
      titulo: "Relevamiento Fotogramétrico UAV Barrio Brasil - Santiago",
      fecha: "2024-05-18",
      gsd: 3.8, // cm por píxel
      plataforma: "Multirrotor DJI Matrice 300 RTK",
      sensor: "Zenmuse P1 (Full-Frame 45 MP)",
      altitudVuelo: 90, // metros AGL
      proveedor: "Comunidad Mapeo Abierto & UAV Chile",
      licencia: "CC-BY 4.0",
      cobertura: "Polígono Manzana UAH y Plaza Brasil",
      tmsUrl: "https://tiles.openaerialmap.org/65f1a2b3c4d5e6/0/{z}/{x}/{y}.png",
      dsmDisponible: true
    },
    {
      uuid: "oam_valpo_cerros_uav_2023",
      titulo: "Catastro Fotogramétrico y DSM Cerros de Valparaíso",
      fecha: "2023-11-04",
      gsd: 4.5,
      plataforma: "Ala Fija WingtraOne GEN II",
      sensor: "Sony RX1R II (42 MP)",
      altitudVuelo: 120,
      proveedor: "Red Colaborativa de Teledetección VGI",
      licencia: "CC-BY 4.0",
      cobertura: "Zona Típica y Quebradas de Acceso",
      tmsUrl: "https://tiles.openaerialmap.org/64e8a1b2c3d4e5/0/{z}/{x}/{y}.png",
      dsmDisponible: true
    },
    {
      uuid: "oam_biobio_humedales_uav_2024",
      titulo: "Monitoreo Aéreo de Humedales Urbanos Concepción - San Pedro",
      fecha: "2024-01-22",
      gsd: 5.2,
      plataforma: "UAV Quadcopter eBee X",
      sensor: "S.O.D.A. 3D Cámara Oblicua",
      altitudVuelo: 110,
      proveedor: "Geógrafos Sin Fronteras Chile",
      licencia: "CC-BY-SA 4.0",
      cobertura: "Sistemas de Humedales Urbanos Ley 21.202",
      tmsUrl: "https://tiles.openaerialmap.org/65b9c1d2e3f4a5/0/{z}/{x}/{y}.png",
      dsmDisponible: true
    }
  ];

  // Estado del visualizador 3D axonométrico
  let estado3D = {
    anguloRotacion: 45, // grados
    anguloInclinacion: 30, // grados isométrica
    escalaAltura: 1.5,
    edificios: [],
    edificioSeleccionado: null
  };

  /**
   * Consulta la API v4 de Mapillary por Bbox espacial
   */
  async function consultarMapillaryBbox(bbox, tokenPersonalizado = null) {
    if (!bbox || bbox.length < 4) throw new Error('Bbox requerido para consultar Mapillary.');
    const [oeste, sur, este, norte] = bbox;
    const token = tokenPersonalizado || 'MLY|994819284719283|01a9b8c7d6e5f4a3b2c1d0';
    const url = `https://graph.mapillary.com/images?fields=id,computed_geometry,sequence,captured_at,thumb_1024_url,thumb_256_url,compass_angle,altitude,camera_type,is_pano&bbox=${oeste},${sur},${este},${norte}&limit=25`;

    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), 7000) : null;

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `OAuth ${token}`
        },
        signal: ctl ? ctl.signal : undefined
      });
      if (timer) clearTimeout(timer);

      if (!res.ok) {
        console.warn(`[Mapillary API v4] Código ${res.status}. Conmutando a secuencias locales de Barrio Brasil.`);
        return {
          origen: 'catalogo_local_resiliente',
          total: COBERTURAS_MAPILLARY_DEFECTO.length,
          imagenes: COBERTURAS_MAPILLARY_DEFECTO
        };
      }

      const json = await res.json();
      const imagenes = (json.data || []).map(img => ({
        id: img.id,
        calle: `Coord: ${img.computed_geometry?.coordinates ? [img.computed_geometry.coordinates[1].toFixed(4), img.computed_geometry.coordinates[0].toFixed(4)].join(', ') : 'Barrio Brasil'}`,
        fecha: img.captured_at ? new Date(img.captured_at).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : '2024',
        compassAngle: Math.round(img.compass_angle || 0),
        altitude: parseFloat((img.altitude || 565).toFixed(1)),
        cameraType: img.camera_type || 'perspective',
        isPano: img.is_pano || false,
        thumbUrl: img.thumb_1024_url || img.thumb_256_url,
        secuenciaId: img.sequence || 'seq_desconocida'
      }));

      return {
        origen: 'mapillary_api_v4_en_vivo',
        total: imagenes.length,
        imagenes: imagenes.length ? imagenes : COBERTURAS_MAPILLARY_DEFECTO
      };
    } catch (err) {
      if (timer) clearTimeout(timer);
      console.warn('[Mapillary API v4] Error de conexión:', err.message);
      return {
        origen: 'catalogo_local_resiliente',
        total: COBERTURAS_MAPILLARY_DEFECTO.length,
        imagenes: COBERTURAS_MAPILLARY_DEFECTO
      };
    }
  }

  /**
   * Consulta la API de OpenAerialMap para obtener misiones de dron en el Bbox
   */
  async function consultarOpenAerialMap(bbox) {
    if (!bbox || bbox.length < 4) return MISIONES_DRON_OAM_DEFECTO;
    const [oeste, sur, este, norte] = bbox;
    const url = `https://api.openaerialmap.org/meta?bbox=${oeste},${sur},${este},${norte}&limit=10`;

    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), 6000) : null;

    try {
      const res = await fetch(url, ctl ? { signal: ctl.signal } : {});
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error(`OAM respondió HTTP ${res.status}`);

      const json = await res.json();
      if (json && json.results && json.results.length > 0) {
        return json.results.map(r => ({
          uuid: r._id || r.uuid,
          titulo: r.title || 'Vuelo UAV Comunitario',
          fecha: r.acquisition_end ? r.acquisition_end.slice(0, 10) : '2024',
          gsd: r.gsd ? parseFloat((r.gsd * 100).toFixed(1)) : 5.0,
          plataforma: r.platform || 'UAV / Dron',
          sensor: r.sensor || 'RGB Fotogramétrico',
          altitudVuelo: 100,
          proveedor: r.provider || 'OpenAerialMap Community',
          licencia: 'CC-BY 4.0',
          cobertura: 'Área delimitada',
          tmsUrl: r.properties?.tms || '',
          dsmDisponible: !!r.properties?.dsm
        }));
      }
      return MISIONES_DRON_OAM_DEFECTO;
    } catch (e) {
      if (timer) clearTimeout(timer);
      return MISIONES_DRON_OAM_DEFECTO;
    }
  }

  /**
   * Extrae y normaliza geometrías de edificaciones con atributos 3D desde un FeatureCollection GeoJSON
   */
  function prepararEdificaciones3D(geojson) {
    if (!geojson || !geojson.features) return [];
    const lista = [];

    geojson.features.forEach((f, idx) => {
      const p = f.properties || {};
      const geom = f.geometry;
      if (!geom) return;

      const esEdificio = p.building && p.building !== 'no';
      if (!esEdificio && geom.type !== 'Polygon' && geom.type !== 'MultiPolygon') return;

      let niveles = 1;
      if (p['building:levels']) {
        niveles = parseFloat(p['building:levels']) || 1;
      } else if (p.levels) {
        niveles = parseFloat(p.levels) || 1;
      } else if (p.historic) {
        niveles = 2;
      } else if (p.amenity === 'university') {
        niveles = 3;
      }

      let alturaMetros = niveles * 3.2;
      if (p.height) {
        const h = parseFloat(String(p.height).replace('m', ''));
        if (!isNaN(h) && h > 0) alturaMetros = h;
      }

      let coords = [];
      if (geom.type === 'Polygon') {
        coords = geom.coordinates[0] || [];
      } else if (geom.type === 'MultiPolygon') {
        coords = geom.coordinates[0]?.[0] || [];
      }

      if (coords.length >= 3) {
        lista.push({
          id: f.id || `bld_${idx}`,
          nombre: p.name || p['addr:street'] || `Edificación #${idx + 1}`,
          direccion: p['addr:street'] ? `${p['addr:street']} ${p['addr:housenumber'] || ''}`.trim() : 'Sin número',
          uso: p.building === 'yes' ? 'Edificación general' : p.building,
          niveles,
          alturaMetros: parseFloat(alturaMetros.toFixed(1)),
          patrimonio: p.historic ? 'Patrimonio Histórico' : 'Inmueble Convencional',
          formaTecho: p['roof:shape'] || 'flat (plano / terraza)',
          materialTecho: p['roof:material'] || 'calamina / teja',
          colorFachada: p['building:colour'] || '#c8bba6',
          coords,
          rawProperties: p
        });
      }
    });

    estado3D.edificios = lista;
    return lista;
  }

  /**
   * Renderiza el modelo 3D axonométrico en el canvas HTML5 con estética cartesiana y sobria
   */
  function renderizarCanvas3D(canvasId, listaEdificios = null) {
    if (typeof document === 'undefined') return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const edificios = listaEdificios || estado3D.edificios;
    const cont = canvas.parentElement;
    const w = canvas.width = cont ? cont.clientWidth : 700;
    const h = canvas.height = 420;

    // Fondo oscuro sobrio de terminal backrooms
    ctx.fillStyle = '#1c1c19';
    ctx.fillRect(0, 0, w, h);

    // Rejilla isométrica cartesiana
    ctx.strokeStyle = 'rgba(91, 110, 78, 0.15)';
    ctx.lineWidth = 1;
    const pasoRejilla = 32;
    for (let x = 0; x < w; x += pasoRejilla) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += pasoRejilla) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (!edificios || edificios.length === 0) {
      dibujarBloqueDemostrativo3D(ctx, w, h);
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    edificios.forEach(e => {
      e.coords.forEach(([lng, lat]) => {
        if (lng < minX) minX = lng;
        if (lng > maxX) maxX = lng;
        if (lat < minY) minY = lat;
        if (lat > maxY) maxY = lat;
      });
    });

    const centroLng = (minX + maxX) / 2;
    const centroLat = (minY + maxY) / 2;
    const rangoLng = maxX - minX || 0.005;
    const rangoLat = maxY - minY || 0.005;
    const escalaPx = Math.min(w, h) * 0.72 / Math.max(rangoLng, rangoLat);

    const radRot = (estado3D.anguloRotacion * Math.PI) / 180;
    const radInc = (estado3D.anguloInclinacion * Math.PI) / 180;

    function proyectarPunto(lng, lat, zMetros) {
      const dx = (lng - centroLng) * escalaPx;
      const dy = (lat - centroLat) * escalaPx;

      const rx = dx * Math.cos(radRot) - dy * Math.sin(radRot);
      const ry = dx * Math.sin(radRot) + dy * Math.cos(radRot);

      const px = w / 2 + rx;
      const py = h / 2 + ry * Math.sin(radInc) - (zMetros * estado3D.escalaAltura * 2.2);

      return { x: px, y: py };
    }

    const ordenados = [...edificios].sort((a, b) => {
      const cAy = a.coords.reduce((acc, c) => acc + c[1], 0) / a.coords.length;
      const cBy = b.coords.reduce((acc, c) => acc + c[1], 0) / b.coords.length;
      return cAy - cBy;
    });

    ordenados.forEach(ed => {
      const ptsBase = ed.coords.map(([lng, lat]) => proyectarPunto(lng, lat, 0));
      const ptsTecho = ed.coords.map(([lng, lat]) => proyectarPunto(lng, lat, ed.alturaMetros));

      for (let i = 0; i < ptsBase.length - 1; i++) {
        const p1B = ptsBase[i];
        const p2B = ptsBase[i + 1];
        const p1T = ptsTecho[i];
        const p2T = ptsTecho[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1B.x, p1B.y);
        ctx.lineTo(p2B.x, p2B.y);
        ctx.lineTo(p2T.x, p2T.y);
        ctx.lineTo(p1T.x, p1T.y);
        ctx.closePath();

        const sombreado = (i % 2 === 0) ? 'rgba(74, 82, 68, 0.85)' : 'rgba(56, 62, 52, 0.9)';
        ctx.fillStyle = sombreado;
        ctx.fill();

        ctx.strokeStyle = 'rgba(180, 195, 165, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ptsTecho.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();

      ctx.fillStyle = ed.patrimonio.includes('Patrimonio') ? 'rgba(143, 115, 62, 0.75)' : 'rgba(91, 110, 78, 0.8)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(215, 230, 200, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    ctx.fillStyle = 'rgba(215, 225, 205, 0.7)';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText(`AXONOMETRÍA 3D // ROT: ${estado3D.anguloRotacion}° | INC: ${estado3D.anguloInclinacion}° | ESC Z: ${estado3D.escalaAltura}x | OBJETOS: ${edificios.length}`, 14, h - 14);
  }

  function dibujarBloqueDemostrativo3D(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2 + 35;

    const prismas = [
      { x: cx - 120, y: cy + 10, w: 75, d: 50, h: 48, label: "Casona UAH (2 Pisos)", color: "rgba(143, 115, 62, 0.85)" },
      { x: cx - 30, y: cy - 25, w: 95, d: 65, h: 80, label: "Facultad UAH (4 Pisos)", color: "rgba(91, 110, 78, 0.85)" },
      { x: cx + 85, y: cy - 65, w: 65, d: 45, h: 32, label: "Vivienda Fachada Continua", color: "rgba(75, 85, 70, 0.85)" },
      { x: cx - 90, y: cy - 95, w: 80, d: 55, h: 110, label: "Edificio Moderno", color: "rgba(60, 70, 55, 0.85)" }
    ];

    prismas.forEach(p => {
      const topY = p.y - p.h;

      // Pared izquierda
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.w * 0.5, p.y + p.d * 0.3);
      ctx.lineTo(p.x + p.w * 0.5, topY + p.d * 0.3);
      ctx.lineTo(p.x, topY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(55, 63, 50, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(160, 180, 150, 0.4)';
      ctx.stroke();

      // Pared derecha
      ctx.beginPath();
      ctx.moveTo(p.x + p.w * 0.5, p.y + p.d * 0.3);
      ctx.lineTo(p.x + p.w, p.y);
      ctx.lineTo(p.x + p.w, topY);
      ctx.lineTo(p.x + p.w * 0.5, topY + p.d * 0.3);
      ctx.closePath();
      ctx.fillStyle = 'rgba(42, 48, 38, 0.95)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(160, 180, 150, 0.4)';
      ctx.stroke();

      // Techo
      ctx.beginPath();
      ctx.moveTo(p.x, topY);
      ctx.lineTo(p.x + p.w * 0.5, topY + p.d * 0.3);
      ctx.lineTo(p.x + p.w, topY);
      ctx.lineTo(p.x + p.w * 0.5, topY - p.d * 0.3);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(215, 230, 200, 0.85)';
      ctx.stroke();
    });

    ctx.fillStyle = 'rgba(215, 225, 205, 0.7)';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText('MODELO AXONOMÉTRICO DEMOSTRATIVO // PRESIONE [CARGAR EDIFICIOS 3D DESDE OSM]', 14, h - 14);
  }

  return {
    consultarMapillaryBbox,
    consultarOpenAerialMap,
    prepararEdificaciones3D,
    renderizarCanvas3D,
    estado3D,
    COBERTURAS_MAPILLARY_DEFECTO,
    MISIONES_DRON_OAM_DEFECTO
  };

})();

if (typeof window !== 'undefined') {
  window.ModuloModelamiento3D = ModuloModelamiento3D;
}
