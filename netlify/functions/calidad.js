/*
  netlify/functions/calidad.js
  ----------------------------
  Función serverless de Netlify para consultar indicadores avanzados en ohsome API v1.
  Aplica sensibilidad geométrica:
  - Líneas: consulta /elements/length (km)
  - Polígonos: consulta /elements/area (m²/km²)
  - Puntos/Comunes: /elements/count, /users/count, /contributions/count.
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

  const { bbox, filtro = 'building=* and type:way', intervalo = 'P1Y', version = 'v1', apiKey = '' } = body;
  if (!bbox || bbox.length !== 4) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Se requiere "bbox" [oeste, sur, este, norte].' })
    };
  }

  const baseOhsomeV1 = 'https://api.ohsome.org/v1';
  const baseOhsomeV2 = 'https://api.heigit.org/ohsome-api/v2-rc';

  try {
    // 1. Obtener fecha máxima disponible
    let fechaFin = '2026-06-01';
    try {
      const metaRes = await fetch(`${baseOhsomeV1}/metadata`);
      if (metaRes.ok) {
        const meta = await metaRes.json();
        const toTs = meta.extractRegion?.temporalExtent?.toTimestamp;
        if (toTs) fechaFin = toTs.slice(0, 10);
      }
    } catch (_) {}

    const anioFin = parseInt(fechaFin.slice(0, 4), 10);
    let fechaInicio = `${anioFin - 5}-01-01`;
    if (intervalo === 'P1M') {
      fechaInicio = `${anioFin - 1}-${fechaFin.slice(5)}`;
    } else if (intervalo === 'P6M') {
      fechaInicio = `${anioFin - 3}-01-01`;
    }
    const ventanaTiempo = `${fechaInicio}/${fechaFin}/${intervalo}`;
    const bboxesStr = bbox.join(',');

    const fLower = filtro.toLowerCase();
    let tipoGeo = 'punto';
    if (fLower.includes('highway') || fLower.includes('cycleway') || fLower.includes('footway') || fLower.includes('waterway')) {
      tipoGeo = 'linea';
    } else if (fLower.includes('building') || fLower.includes('leisure') || fLower.includes('landuse')) {
      tipoGeo = 'poligono';
    }

    let versionReal = 'v1';
    let motorReal = 'OSHDB (HeiGIT Java Engine)';
    let fueFallback = false;

    async function consultarEndpoint(path, timeParam, usarV2 = false) {
      const base = usarV2 ? baseOhsomeV2 : baseOhsomeV1;
      const p = new URLSearchParams({
        bboxes: bboxesStr,
        filter: filtro,
        time: timeParam
      });
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      if (usarV2 && apiKey && apiKey.trim()) {
        const token = apiKey.trim();
        headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }

      const res = await fetch(`${base}${path}`, {
        method: 'POST',
        headers,
        body: p.toString()
      });
      if (!res.ok) throw new Error(`Error ${res.status} en ${path}`);
      return res.json();
    }

    let conteoActual, usuarios, serieTemporal, resEspecial, resContrib;

    if (version === 'v2') {
      try {
        const epEspecial = tipoGeo === 'linea' ? '/stats/features/length' : (tipoGeo === 'poligono' ? '/stats/features/area' : null);
        [conteoActual, usuarios, serieTemporal, resEspecial, resContrib] = await Promise.all([
          consultarEndpoint('/stats/features/count', fechaFin, true),
          consultarEndpoint('/stats/contributors/count', ventanaTiempo, true),
          consultarEndpoint('/stats/features/count', ventanaTiempo, true),
          epEspecial ? consultarEndpoint(epEspecial, fechaFin, true).catch(() => null) : Promise.resolve(null),
          consultarEndpoint('/stats/features/count', ventanaTiempo, true).catch(() => null)
        ]);
        versionReal = 'v2';
        motorReal = 'ohsomeDB (PostgreSQL / Citus / Python)';
      } catch (errV2) {
        console.warn(`[calidad.js] Consulta v2 fallida (${errV2.message}), ejecutando fallback a v1.`);
        fueFallback = true;
      }
    }

    if (!conteoActual) {
      const promesasV1 = [
        consultarEndpoint('/elements/count', fechaFin, false),
        consultarEndpoint('/users/count', ventanaTiempo, false),
        consultarEndpoint('/elements/count', ventanaTiempo, false)
      ];

      let promesaEspecialV1 = null;
      if (tipoGeo === 'linea') {
        promesaEspecialV1 = consultarEndpoint('/elements/length', fechaFin, false).catch(() => null);
      } else if (tipoGeo === 'poligono') {
        promesaEspecialV1 = consultarEndpoint('/elements/area', fechaFin, false).catch(() => null);
      }

      const promesaContribV1 = consultarEndpoint('/contributions/count', ventanaTiempo, false).catch(() => null);

      [conteoActual, usuarios, serieTemporal, resEspecial, resContrib] = await Promise.all([
        promesasV1[0],
        promesasV1[1],
        promesasV1[2],
        promesaEspecialV1,
        promesaContribV1
      ]);
    }

    const elementosAhora = conteoActual.result && conteoActual.result.length > 0 ? Math.round(conteoActual.result[0].value) : 0;

    // Cálculo de área y densidad sobre Bbox
    const [oeste, sur, este, norte] = bbox;
    const kmPorGradoLat = 111.32;
    const latMediaRad = ((sur + norte) / 2) * (Math.PI / 180);
    const kmPorGradoLon = 111.32 * Math.cos(latMediaRad);
    const areaKm2 = Math.abs(este - oeste) * kmPorGradoLon * Math.abs(norte - sur) * kmPorGradoLat;
    const densidad = areaKm2 > 0 ? (elementosAhora / areaKm2) : null;

    let metricaGeometrica = null;
    if (tipoGeo === 'linea' && resEspecial?.result?.length > 0) {
      const metros = resEspecial.result[0].value;
      metricaGeometrica = {
        tipo: 'longitud',
        etiqueta: 'Longitud de red trazada',
        valorKm: Number((metros / 1000).toFixed(2)),
        unidad: 'km'
      };
    } else if (tipoGeo === 'poligono' && resEspecial?.result?.length > 0) {
      const m2 = resEspecial.result[0].value;
      metricaGeometrica = {
        tipo: 'superficie',
        etiqueta: 'Superficie total cubierta',
        valorM2: Math.round(m2),
        valorKm2: Number((m2 / 1000000).toFixed(4)),
        unidad: 'm²'
      };
    }

    const listaUsuarios = (usuarios.result || []).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value)
    }));
    const ultimosUsuarios = listaUsuarios.at(-1)?.valor || 0;
    const listaContrib = (resContrib?.result || []).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value)
    }));
    const ultimasContrib = listaContrib.at(-1)?.valor || 0;
    const ratioContribUsuario = ultimosUsuarios > 0 ? Number((ultimasContrib / ultimosUsuarios).toFixed(1)) : null;

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
        tipoGeometria: tipoGeo,
        elementosAhora: elementosAhora,
        metricaGeometrica,
        densidad: densidad ? Number(densidad.toFixed(2)) : null,
        areaKm2: Number(areaKm2.toFixed(3)),
        ratioContribucionPorUsuario: ratioContribUsuario,
        usuariosPorAnio: listaUsuarios,
        elementosPorAnio: (serieTemporal.result || []).map(r => ({
          fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
          valor: Math.round(r.value)
        })),
        contribucionesPorAnio: listaContrib,
        referencias: [
          { autor: 'HeiGIT / Heidelberg University', url: 'https://docs.ohsome.org/ohsome-api/v1/' },
          { autor: 'Raifer et al. (2019)', doi: '10.1186/s40965-019-0061-3' }
        ]
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
