/*
  osm.js
  ------
  Consultas espaciales a OpenStreetMap vía Overpass API.
  Incluye:
  - Soporte para las 8 categorías temáticas VGI del Atlas.
  - Fallback automático entre servidores espejo (overpass-api.de, kumi.systems, mail.ru).
  - Normalizador de elementos Overpass (nodes, ways, relations) a estándar GeoJSON (FeatureCollection).
*/

const ModuloOSM = (() => {

  /**
   * Catálogo de consultas predefinidas según la taxonomía del Atlas
   */
  const PRESETS_CATEGORIAS = {
    educacion: {
      nombre: 'Educación y Universidad',
      filtro: `
        nwr["amenity"~"university|college|library|school"]({{bbox}});
        nwr["building"="university"]({{bbox}});
      `
    },
    servicios: {
      nombre: 'Servicios y Comercio',
      filtro: `
        nwr["shop"]({{bbox}});
        nwr["amenity"~"cafe|restaurant|bank|pharmacy|post_office"]({{bbox}});
      `
    },
    transporte: {
      nombre: 'Movilidad y Transporte',
      filtro: `
        node["railway"="station"]({{bbox}});
        node["highway"="bus_stop"]({{bbox}});
        way["highway"~"primary|secondary|tertiary|trunk"]({{bbox}});
      `
    },
    movilidad_activa: {
      nombre: 'Movilidad Activa y Ciclovías',
      filtro: `
        way["highway"="cycleway"]({{bbox}});
        way["cycleway"]({{bbox}});
        node["amenity"~"bicycle_parking|bicycle_rental"]({{bbox}});
      `
    },
    espacio_publico: {
      nombre: 'Áreas Verdes y Plazas',
      filtro: `
        nwr["leisure"~"park|playground|garden|pitch"]({{bbox}});
        nwr["landuse"~"grass|village_green"]({{bbox}});
      `
    },
    patrimonio: {
      nombre: 'Patrimonio y Cultura',
      filtro: `
        nwr["historic"]({{bbox}});
        nwr["heritage"]({{bbox}});
        nwr["amenity"~"theatre|arts_centre|place_of_worship|museum"]({{bbox}});
      `
    },
    accesibilidad: {
      nombre: 'Accesibilidad Universal',
      filtro: `
        node["kerb"]({{bbox}});
        node["highway"="crossing"]({{bbox}});
        node["wheelchair"]({{bbox}});
      `
    },
    biodiversidad: {
      nombre: 'Biodiversidad Urbana (Arbolado)',
      filtro: `
        nwr["natural"~"tree|wood|scrub"]({{bbox}});
      `
    }
  };

  /**
   * Construye consulta Overpass QL
   */
  function construirConsulta(bbox, etiquetaOPreset) {
    const [oeste, sur, este, norte] = bbox;
    const bboxOverpass = `${sur},${oeste},${norte},${este}`; // S, W, N, E

    let cuerpoConsulta;

    if (PRESETS_CATEGORIAS[etiquetaOPreset]) {
      cuerpoConsulta = PRESETS_CATEGORIAS[etiquetaOPreset].filtro.replaceAll('{{bbox}}', bboxOverpass);
    } else if (etiquetaOPreset && etiquetaOPreset.includes('=')) {
      const [clave, valor] = etiquetaOPreset.split('=').map(s => s.trim());
      cuerpoConsulta = `
        node["${clave}"="${valor}"](${bboxOverpass});
        way["${clave}"="${valor}"](${bboxOverpass});
        relation["${clave}"="${valor}"](${bboxOverpass});
      `;
    } else {
      const etiquetaLimpia = (etiquetaOPreset || 'highway').trim();
      cuerpoConsulta = `
        node["${etiquetaLimpia}"](${bboxOverpass});
        way["${etiquetaLimpia}"](${bboxOverpass});
        relation["${etiquetaLimpia}"](${bboxOverpass});
      `;
    }

    return `
      [out:json][timeout:30];
      (
        ${cuerpoConsulta}
      );
      out center tags qt 300;
    `;
  }

  /**
   * Ejecuta la consulta probando servidores espejo si el principal falla
   */
  async function consultar(bbox, etiquetaOPreset, consultaDirecta = null) {
    const cfg = window.NODO_CONFIG || {};
    const endpoints = cfg.endpoints?.overpass_espejos || [
      cfg.endpoints?.overpass || 'https://overpass-api.de/api/interpreter',
      'https://lz4.overpass-api.de/api/interpreter',
      'https://z.overpass-api.de/api/interpreter'
    ];

    const consulta = consultaDirecta || construirConsulta(bbox, etiquetaOPreset);
    let ultimoError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`[Overpass] Intentando consulta en: ${endpoint}`);
        const respuesta = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'data=' + encodeURIComponent(consulta)
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          return datos.elements || [];
        }
        ultimoError = new Error(`Servidor ${endpoint} respondió con status ${respuesta.status}`);
      } catch (err) {
        console.warn(`[Overpass] Fallo en ${endpoint}:`, err.message);
        ultimoError = err;
      }
    }

    throw new Error(`No se pudo conectar a Overpass tras intentar en ${endpoints.length} servidores espejo. Detalle: ${ultimoError?.message || 'Error de red'}`);
  }

  /**
   * Convierte los elementos de Overpass a GeoJSON FeatureCollection normalizado
   */
  function elementosAGeoJSON(elementos, categoriaId = 'general') {
    const features = [];

    elementos.forEach(el => {
      let coords = null;
      if (el.type === 'node' && el.lat && el.lon) {
        coords = [el.lon, el.lat];
      } else if (el.center && el.center.lat && el.center.lon) {
        coords = [el.center.lon, el.center.lat];
      }

      if (!coords) return;

      const tags = el.tags || {};
      const nombre = tags.name || tags['name:es'] || tags.operator || tags.description || 'Sin nombre';
      const subtipo = tags.amenity || tags.shop || tags.highway || tags.leisure || tags.historic || tags.natural || 'VGI';
      const direccion = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');

      features.push({
        type: 'Feature',
        id: `${el.type}/${el.id}`,
        geometry: {
          type: 'Point',
          coordinates: coords
        },
        properties: {
          id_vgi: `OSM/${el.type}/${el.id}`,
          osm_type: el.type,
          osm_id: el.id,
          categoria: categoriaId,
          subtipo: subtipo,
          nombre: nombre,
          operador: tags.operator || null,
          direccion: direccion || null,
          accesibilidad: tags.wheelchair || null,
          fecha: el.timestamp || new Date().toISOString().slice(0, 10),
          fuente: 'OpenStreetMap',
          licencia: 'ODbL 1.0 (© colaboradores de OpenStreetMap)',
          etiquetas_completas: tags
        }
      });
    });

    return {
      type: 'FeatureCollection',
      name: `OSM_${categoriaId}`,
      features: features
    };
  }

  /**
   * Consulta personalizada avanzada que intenta llamar al backend (/api/consulta)
   * y si este no está disponible, resuelve directamente en el cliente mediante Overpass.
   */
  async function consultarPersonalizada(parametros) {
    const { bbox, clave, valor, operador, entidad, queryPersonalizada, nombreConsulta = 'Personalizada' } = parametros;

    // 1. Intentar llamar al backend (/api/consulta)
    try {
      const respuestaBackend = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parametros)
      });

      if (respuestaBackend.ok) {
        const datos = await respuestaBackend.json();
        if (datos.ok && datos.geojson) {
          console.log(`[+] Consulta personalizada resuelta exitosamente vía backend (${datos.servidor}): ${datos.total} elementos`);
          return {
            total: datos.total,
            geojson: datos.geojson,
            servidor: datos.servidor,
            desdeBackend: true
          };
        }
      }
    } catch (errBackend) {
      console.warn('Backend /api/consulta no accesible. Pasando a resolución directa en cliente...', errBackend.message);
    }

    // 2. Fallback: Resolución directa en el navegador
    const [oeste, sur, este, norte] = bbox;
    const bboxStr = `${sur},${oeste},${norte},${este}`;
    let cuerpoQL;

    if (queryPersonalizada && queryPersonalizada.trim()) {
      cuerpoQL = queryPersonalizada.replaceAll('{{bbox}}', bboxStr);
    } else {
      const tipo = entidad || 'nwr';
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
      cuerpoQL = `${tipo}${filtro}(${bboxStr});`;
    }

    const consultaCompleta = `
      [out:json][timeout:35];
      (
        ${cuerpoQL}
      );
      out center tags qt 350;
    `;

    const elementos = await consultar(bbox, null, consultaCompleta);
    const geojson = elementosAGeoJSON(elementos, nombreConsulta);

    return {
      total: elementos.length,
      geojson: geojson,
      servidor: 'Cliente directo (Overpass)',
      desdeBackend: false
    };
  }

  return {
    consultar,
    consultarPersonalizada,
    construirConsulta,
    elementosAGeoJSON,
    PRESETS_CATEGORIAS
  };
})();

