/*
  osm.js
  ------
  Consultas espaciales a OpenStreetMap vía Overpass API.
  Incluye:
  - Soporte para las 10 categorías temáticas VGI del Atlas (CAT-01 a CAT-10).
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
        nwr["amenity"~"university|college|library|school|kindergarten"]({{bbox}});
        nwr["building"~"university|school|college|kindergarten|library"]({{bbox}});
      `
    },
    servicios: {
      nombre: 'Servicios y Comercio Barrial',
      filtro: `
        nwr["shop"]({{bbox}});
        nwr["amenity"~"cafe|restaurant|bar|fast_food|pub|pharmacy|clinic|doctors|dentist|bank|atm|post_office|marketplace|police|fire_station"]({{bbox}});
        nwr["building"~"retail|commercial|supermarket"]({{bbox}});
      `
    },
    transporte: {
      nombre: 'Movilidad y Transporte',
      filtro: `
        node["highway"="bus_stop"]({{bbox}});
        node["railway"~"station|subway_entrance"]({{bbox}});
        node["public_transport"~"platform|stop_position"]({{bbox}});
        way["highway"~"primary|secondary|tertiary|trunk"]({{bbox}});
        way["railway"="subway"]({{bbox}});
        nwr["amenity"="bus_station"]({{bbox}});
      `
    },
    movilidad_activa: {
      nombre: 'Movilidad Activa y Ciclovías',
      filtro: `
        way["highway"="cycleway"]({{bbox}});
        way["cycleway"]({{bbox}});
        way["cycleway:left"]({{bbox}});
        way["cycleway:right"]({{bbox}});
        way["cycleway:both"]({{bbox}});
        way["highway"~"footway|path"]["bicycle"~"yes|designated"]({{bbox}});
        nwr["amenity"~"bicycle_parking|bicycle_rental"]({{bbox}});
        nwr["shop"="bicycle"]({{bbox}});
      `
    },
    espacio_publico: {
      nombre: 'Áreas Verdes y Espacio Público',
      filtro: `
        nwr["leisure"~"park|playground|garden|pitch|sports_centre|fitness_station"]({{bbox}});
        nwr["landuse"~"grass|village_green|recreation_ground"]({{bbox}});
        node["amenity"~"bench|drinking_water"]({{bbox}});
      `
    },
    patrimonio: {
      nombre: 'Patrimonio y Cultura',
      filtro: `
        nwr["historic"]({{bbox}});
        nwr["heritage"]({{bbox}});
        nwr["building"~"church|cathedral|chapel"]({{bbox}});
        nwr["amenity"~"theatre|arts_centre|place_of_worship|museum|community_centre"]({{bbox}});
        nwr["tourism"~"museum|artwork|gallery"]({{bbox}});
      `
    },
    accesibilidad: {
      nombre: 'Accesibilidad Universal',
      filtro: `
        node["kerb"]({{bbox}});
        node["highway"="crossing"]({{bbox}});
        node["tactile_paving"]({{bbox}});
        node["wheelchair"]({{bbox}});
        way["highway"~"footway|pedestrian"]({{bbox}});
        way["highway"="steps"]["ramp"~"yes|separate"]({{bbox}});
        way["ramp"]({{bbox}});
      `
    },
    biodiversidad: {
      nombre: 'Biodiversidad Urbana',
      filtro: `
        node["natural"="tree"]({{bbox}});
        way["natural"="tree_row"]({{bbox}});
        nwr["natural"~"wood|scrub"]({{bbox}});
        nwr["leisure"="garden"]({{bbox}});
        nwr["landuse"="forest"]({{bbox}});
      `
    },
    edificaciones: {
      nombre: 'Edificaciones y Huella Urbana (Polígonos)',
      filtro: `
        way["building"]({{bbox}});
        relation["building"]({{bbox}});
      `
    },
    cobertura_suelo: {
      nombre: 'Coberturas y Usos de Suelo (Polígonos)',
      filtro: `
        nwr["landuse"]({{bbox}});
        nwr["natural"~"wood|scrub|water|grassland|tree_row"]({{bbox}});
        nwr["leisure"~"park|garden|pitch|nature_reserve"]({{bbox}});
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
      [out:json][timeout:35];
      (
        ${cuerpoConsulta}
      );
      out geom tags qt 500;
    `;
  }

  // Caché en memoria para evitar re-consultar Overpass innecesariamente
  const cacheConsultas = new Map();

  /**
   * Ejecuta la consulta probando servidores espejo si el principal falla
   */
  async function consultar(bbox, etiquetaOPreset, consultaDirecta = null) {
    const claveCache = `${JSON.stringify(bbox)}_${etiquetaOPreset}_${consultaDirecta || ''}`;
    if (cacheConsultas.has(claveCache)) {
      console.log(`[Overpass] Retornando datos desde caché en memoria para ${etiquetaOPreset}`);
      return cacheConsultas.get(claveCache);
    }

    const cfg = window.NODO_CONFIG || {};
    const endpoints = (cfg.endpoints?.overpass_espejos && cfg.endpoints.overpass_espejos.length > 0)
      ? cfg.endpoints.overpass_espejos
      : [
          'https://overpass-api.de/api/interpreter',
          'https://lz4.overpass-api.de/api/interpreter'
        ];

    const consulta = consultaDirecta || construirConsulta(bbox, etiquetaOPreset);
    let ultimoError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`[Overpass] Intentando consulta en: ${endpoint}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s máx por servidor

        const respuesta = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'data=' + encodeURIComponent(consulta),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (respuesta.ok) {
          const datos = await respuesta.json();
          const elementos = datos.elements || [];
          cacheConsultas.set(claveCache, elementos);
          return elementos;
        }
        ultimoError = new Error(`Servidor ${endpoint} respondió con status ${respuesta.status}`);
      } catch (err) {
        console.warn(`[Overpass] Fallo o timeout en ${endpoint}:`, err.message);
        ultimoError = err;
      }
    }

    throw new Error(`No se pudo conectar a Overpass tras intentar en ${endpoints.length} servidores espejo. Detalle: ${ultimoError?.message || 'Error de red o timeout'}`);
  }

  /**
   * Convierte los elementos de Overpass a GeoJSON FeatureCollection normalizado
   * soportando geometrías mixtas: Puntos (nodos/centroides), Líneas (vías abiertas/ejes)
   * y Polígonos (vías cerradas/huellas/áreas).
   */
  function elementosAGeoJSON(elementos, categoriaId = 'general') {
    const features = [];

    elementos.forEach(el => {
      let geometria = null;
      const tags = el.tags || {};

      if (el.type === 'node' && el.lat !== undefined && el.lon !== undefined) {
        geometria = {
          type: 'Point',
          coordinates: [el.lon, el.lat]
        };
      } else if (el.type === 'way' && Array.isArray(el.geometry) && el.geometry.length > 0) {
        const coords = el.geometry.map(p => [p.lon, p.lat]);
        const primerPunto = coords[0];
        const ultimoPunto = coords[coords.length - 1];
        const esCerrado = coords.length >= 4 &&
          Math.abs(primerPunto[0] - ultimoPunto[0]) < 1e-6 &&
          Math.abs(primerPunto[1] - ultimoPunto[1]) < 1e-6;

        const esPoligono = esCerrado && (
          tags.building ||
          tags.landuse ||
          tags.leisure ||
          tags.amenity ||
          tags.historic ||
          tags.natural ||
          tags.shop ||
          tags.tourism ||
          tags.office ||
          tags.craft ||
          tags.aeroway ||
          tags.emergency ||
          tags.place ||
          tags.boundary ||
          tags.area === 'yes'
        );

        if (esPoligono) {
          geometria = {
            type: 'Polygon',
            coordinates: [coords]
          };
        } else {
          geometria = {
            type: 'LineString',
            coordinates: coords
          };
        }
      } else if (el.type === 'relation' && Array.isArray(el.members)) {
        // Soporte de relaciones multipolygon con miembros geométricos (out geom)
        const outerMember = el.members.find(m => m.role === 'outer' && Array.isArray(m.geometry) && m.geometry.length >= 4);
        if (outerMember) {
          const coords = outerMember.geometry.map(p => [p.lon, p.lat]);
          geometria = {
            type: 'Polygon',
            coordinates: [coords]
          };
        } else if (el.center && el.center.lat !== undefined && el.center.lon !== undefined) {
          geometria = {
            type: 'Point',
            coordinates: [el.center.lon, el.center.lat]
          };
        }
      } else if (el.center && el.center.lat !== undefined && el.center.lon !== undefined) {
        geometria = {
          type: 'Point',
          coordinates: [el.center.lon, el.center.lat]
        };
      }

      if (!geometria) return;

      let infoSuperficie = null;
      if (geometria.type === 'Polygon' && Array.isArray(geometria.coordinates) && geometria.coordinates.length > 0 && typeof ModuloGeodesia !== 'undefined' && ModuloGeodesia.calcularSuperficiePoligono) {
        infoSuperficie = ModuloGeodesia.calcularSuperficiePoligono(geometria.coordinates[0]);
      }

      const nombre = tags.name || tags['name:es'] || tags.operator || tags.description || 'Sin nombre';
      const subtipo = tags.building || tags.landuse || tags.amenity || tags.shop || tags.highway || tags.leisure || tags.historic || tags.natural || tags.railway || 'VGI';
      const direccion = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');

      features.push({
        type: 'Feature',
        id: `${el.type}/${el.id}`,
        geometry: geometria,
        properties: {
          id_vgi: `OSM/${el.type}/${el.id}`,
          osm_type: el.type,
          osm_id: el.id,
          tipo_geometria: geometria.type,
          categoria: categoriaId,
          subtipo: subtipo,
          nombre: nombre,
          operador: tags.operator || null,
          direccion: direccion || null,
          accesibilidad: tags.wheelchair || null,
          superficie_m2: infoSuperficie ? infoSuperficie.areaM2 : null,
          superficie_ha: infoSuperficie ? infoSuperficie.areaHa : null,
          superficie_km2: infoSuperficie ? infoSuperficie.areaKm2 : null,
          srs_superficie: infoSuperficie ? 'EPSG:32719 (WGS 84 / UTM Huso 19 Sur)' : null,
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

  let backendDisponible = null;

  /**
   * Consulta personalizada avanzada que intenta llamar al backend (/api/consulta)
   * y si este no está disponible, resuelve directamente en el cliente mediante Overpass.
   */
  async function consultarPersonalizada(parametros) {
    const { bbox, clave, valor, operador, entidad, queryPersonalizada, nombreConsulta = 'Personalizada' } = parametros;

    // 1. Intentar llamar al backend (/api/consulta) con un timeout adecuado para Netlify (7.5s)
    if (backendDisponible !== false) {
      try {
        const controllerBackend = new AbortController();
        const timeoutBackend = setTimeout(() => controllerBackend.abort(), 7500);
        const respuestaBackend = await fetch('/api/consulta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parametros),
          signal: controllerBackend.signal
        });
        clearTimeout(timeoutBackend);

        if (respuestaBackend.ok) {
          const datos = await respuestaBackend.json();
          if (datos.ok && datos.geojson && datos.geojson.features) {
            backendDisponible = true;
            console.log(`[+] Consulta personalizada resuelta exitosamente vía backend (${datos.servidor}): ${datos.total} elementos`);
            return {
              total: datos.total,
              geojson: datos.geojson,
              servidor: datos.servidor,
              desdeBackend: true
            };
          }
        } else if (respuestaBackend.status === 404) {
          backendDisponible = false;
        }
      } catch (errBackend) {
        console.warn('Backend /api/consulta no accesible o lento (modo client-side activo):', errBackend.message);
      }
    }

    // 2. Fallback: Resolución directa en el navegador
    const [oeste, sur, este, norte] = bbox;
    const bboxStr = `${sur},${oeste},${norte},${este}`;
    let consultaCompleta;

    if (queryPersonalizada && queryPersonalizada.trim()) {
      let ql = queryPersonalizada.replaceAll('{{bbox}}', bboxStr).trim();
      if (ql.includes('[out:') || ql.includes('out ') || ql.includes('out;')) {
        if (!ql.includes('[out:json]')) {
          ql = `[out:json][timeout:30];\n${ql}`;
        }
        if (!ql.includes('out ') && !ql.includes('out;')) {
          ql = `${ql}\nout geom tags qt 400;`;
        }
        consultaCompleta = ql;
      } else {
        consultaCompleta = `
          [out:json][timeout:30];
          (
            ${ql}
          );
          out geom tags qt 400;
        `;
      }
    } else {
      const tipo = entidad || 'nwr';
      let filtro = '';
      if (clave && valor && valor !== '*') {
        if (operador === '~') filtro = `["${clave}"~"${valor}"]`;
        else if (operador === '!=') filtro = `["${clave}"!="${valor}"]`;
        else filtro = `["${clave}"="${valor}"]`;
      } else if (clave) {
        filtro = `["${clave}"]`;
      } else {
        filtro = '["amenity"]';
      }
      consultaCompleta = `
        [out:json][timeout:30];
        (
          ${tipo}${filtro}(${bboxStr});
        );
        out geom tags qt 400;
      `;
    }

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

if (typeof window !== 'undefined') {
  window.ModuloOSM = ModuloOSM;
  window.ModuloOsm = ModuloOSM;
}
