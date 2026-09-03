/*
  netlify/functions/calidad.js
  ----------------------------
  Función serverless de Netlify para consultar indicadores de calidad en la API de ohsome.
  Resuelve el horizonte temporal máximo (/metadata) y consolida densidad y evolución a 5 años.
*/

exports.handler = async function (event, context) {
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
      body: JSON.stringify({ error: 'JSON inválido.' })
    };
  }

  const { bbox, filtro = 'building=* and type:way' } = body;
  if (!bbox || bbox.length !== 4) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Se requiere "bbox" [oeste, sur, este, norte].' })
    };
  }

  const baseOhsome = 'https://api.ohsome.org/v1';

  try {
    // 1. Obtener fecha máxima disponible
    let fechaFin = '2026-06-01';
    try {
      const metaRes = await fetch(`${baseOhsome}/metadata`);
      if (metaRes.ok) {
        const meta = await metaRes.json();
        const toTs = meta.extractRegion?.temporalExtent?.toTimestamp;
        if (toTs) fechaFin = toTs.slice(0, 10);
      }
    } catch (_) {}

    const anioFin = parseInt(fechaFin.slice(0, 4), 10);
    const fechaInicio = `${anioFin - 5}-01-01`;
    const ventanaTiempo = `${fechaInicio}/${fechaFin}/P1Y`;
    const bboxesStr = bbox.join(',');

    // Helper de consulta a ohsome
    async function consultarEndpoint(path, timeParam) {
      const p = new URLSearchParams({
        bboxes: bboxesStr,
        filter: filtro,
        time: timeParam
      });
      const res = await fetch(`${baseOhsome}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: p.toString()
      });
      if (!res.ok) throw new Error(`Error ${res.status} en ${path}`);
      return res.json();
    }

    const [conteoActual, usuarios, serieTemporal] = await Promise.all([
      consultarEndpoint('/elements/count', fechaFin),
      consultarEndpoint('/users/count', ventanaTiempo),
      consultarEndpoint('/elements/count', ventanaTiempo)
    ]);

    const elementosAhora = conteoActual.result && conteoActual.result.length > 0 ? Math.round(conteoActual.result[0].value) : 0;

    // Cálculo de área y densidad
    const [oeste, sur, este, norte] = bbox;
    const kmPorGradoLat = 111.32;
    const latMediaRad = ((sur + norte) / 2) * (Math.PI / 180);
    const kmPorGradoLon = 111.32 * Math.cos(latMediaRad);
    const areaKm2 = Math.abs(este - oeste) * kmPorGradoLon * Math.abs(norte - sur) * kmPorGradoLat;
    const densidad = areaKm2 > 0 ? (elementosAhora / areaKm2) : null;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600'
      },
      body: JSON.stringify({
        ok: true,
        fechaCorte: fechaFin,
        elementosAhora: elementosAhora,
        densidad: densidad ? Number(densidad.toFixed(2)) : null,
        areaKm2: Number(areaKm2.toFixed(3)),
        usuariosPorAnio: (usuarios.result || []).map(r => ({
          fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
          valor: Math.round(r.value)
        })),
        elementosPorAnio: (serieTemporal.result || []).map(r => ({
          fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
          valor: Math.round(r.value)
        }))
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }
};
