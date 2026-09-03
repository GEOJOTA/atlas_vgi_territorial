/*
  netlify/functions/consulta.js
  -----------------------------
  Función serverless de Netlify para procesar consultas espaciales Overpass QL.
  Permite al usuario realizar sus propias consultas desde el Atlas VGI sin restricciones
  de CORS, con reintentos automáticos en servidores espejo y conversión a GeoJSON.
*/

const OVERPASS_ESPEJOS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter'
];

exports.handler = async function (event, context) {
  // Manejo de preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método no permitido. Utiliza POST.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'El cuerpo de la petición debe ser JSON válido.' })
    };
  }

  const { bbox, etiqueta, clave, valor, operador, entidad, queryPersonalizada, timeout = 30 } = body;

  if (!bbox || !Array.isArray(bbox) || bbox.length !== 4) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Parámetro "bbox" requerido como array [oeste, sur, este, norte].' })
    };
  }

  const [oeste, sur, este, norte] = bbox;
  const bboxOverpass = `${sur},${oeste},${norte},${este}`; // S, W, N, E

  let consultaQL;

  if (queryPersonalizada && typeof queryPersonalizada === 'string') {
    // Si el usuario proporcionó código QL propio
    let qlSanitizado = queryPersonalizada.replaceAll('{{bbox}}', bboxOverpass);
    if (!qlSanitizado.includes('[out:json]')) {
      qlSanitizado = `[out:json][timeout:${timeout}];\n${qlSanitizado}`;
    }
    consultaQL = qlSanitizado;
  } else {
    // Constructor de consulta a partir de parámetros
    const tipoEntidad = entidad || 'nwr'; // nwr = node, way, relation
    let filtro = '';

    if (clave && valor) {
      if (operador === '~') {
        filtro = `["${clave}"~"${valor}"]`;
      } else if (operador === '!=') {
        filtro = `["${clave}"!="${valor}"]`;
      } else {
        filtro = `["${clave}"="${valor}"]`;
      }
    } else if (clave && (!valor || valor === '*')) {
      filtro = `["${clave}"]`;
    } else if (etiqueta) {
      if (etiqueta.includes('=')) {
        const [k, v] = etiqueta.split('=').map(s => s.trim());
        filtro = `["${k}"="${v}"]`;
      } else {
        filtro = `["${etiqueta.trim()}"]`;
      }
    } else {
      filtro = '["amenity"]';
    }

    consultaQL = `
      [out:json][timeout:${timeout}];
      (
        ${tipoEntidad}${filtro}(${bboxOverpass});
      );
      out center tags qt 350;
    `;
  }

  let ultimoError = null;

  for (const endpoint of OVERPASS_ESPEJOS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), (timeout + 5) * 1000);

      const respuesta = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'AtlasVGI-NetlifyFunction/1.0'
        },
        body: 'data=' + encodeURIComponent(consultaQL),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (respuesta.ok) {
        const datos = await respuesta.json();
        const elementos = datos.elements || [];
        const geojson = elementosAGeoJSON(elementos, body.nombreConsulta || 'personalizada');

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          },
          body: JSON.stringify({
            ok: true,
            servidor: endpoint,
            total: elementos.length,
            geojson: geojson,
            consultaEjecutada: consultaQL
          })
        };
      }
      ultimoError = `Status ${respuesta.status} en ${endpoint}`;
    } catch (e) {
      ultimoError = e.message;
    }
  }

  return {
    statusCode: 502,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: false,
      error: 'No se pudo completar la consulta en ninguno de los servidores Overpass disponibles.',
      detalle: ultimoError
    })
  };
};

function elementosAGeoJSON(elementos, nombreConsulta) {
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
    const nombre = tags.name || tags['name:es'] || tags.operator || tags.description || 'Sin denominación';
    const subtipo = tags.amenity || tags.shop || tags.highway || tags.leisure || tags.historic || tags.building || 'Elemento VGI';

    features.push({
      type: 'Feature',
      id: `${el.type}/${el.id}`,
      geometry: { type: 'Point', coordinates: coords },
      properties: {
        id_vgi: `OSM/${el.type}/${el.id}`,
        osm_type: el.type,
        osm_id: el.id,
        nombre_consulta: nombreConsulta,
        subtipo: subtipo,
        nombre: nombre,
        operador: tags.operator || null,
        direccion: [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ') || null,
        accesibilidad: tags.wheelchair || null,
        fuente: 'OpenStreetMap',
        fecha: el.timestamp || new Date().toISOString().slice(0, 10),
        licencia: 'ODbL 1.0 (© colaboradores de OpenStreetMap)',
        tags: tags
      }
    });
  });

  return {
    type: 'FeatureCollection',
    name: `Consulta_${nombreConsulta}`,
    features: features
  };
}
