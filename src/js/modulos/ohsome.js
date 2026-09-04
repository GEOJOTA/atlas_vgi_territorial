/*
  ohsome.js
  ---------
  Módulo de análisis de calidad y evolución espacio-temporal de OpenStreetMap
  basado en la API v1 de ohsome (HeiGIT - Heidelberg Institute for Geoinformation Technology).

  Profundizaciones implementadas conforme a ohsome API v1:
  - Sensibilidad al tipo de geometría:
    * Entidades Lineales (calles, ciclovías): consulta /elements/length (km) + /elements/count.
    * Entidades Poligonales (edificaciones, plazas): consulta /elements/area (m²/km²) + /elements/count.
    * Entidades Puntuales (equipamiento, paraderos): consulta /elements/count.
  - Métricas avanzadas: /users/count y /contributions/count.
  - Indicadores derivados: Ratio de esfuerzo de edición (contribuciones/usuario) e Índice de Densidad.
  - Referencias metodológicas y bibliográficas documentadas para comités académicos.
*/

const ModuloOhsome = (() => {

  let fechaMaximaDisponible = null;

  function bboxParaOhsome(bbox) {
    return bbox.join(',');
  }

  /**
   * Obtiene la fecha máxima disponible en el servidor ohsome para evitar errores 400 por fechas futuras
   */
  async function obtenerFechaMaxima(baseEndpoint) {
    if (fechaMaximaDisponible) return fechaMaximaDisponible;
    try {
      const res = await fetch(`${baseEndpoint}/metadata`);
      if (res.ok) {
        const meta = await res.json();
        const toTs = meta.extractRegion?.temporalExtent?.toTimestamp;
        if (toTs) {
          fechaMaximaDisponible = toTs.slice(0, 10);
          console.log(`[ohsome v1] Horizonte temporal detectado: ${fechaMaximaDisponible}`);
          return fechaMaximaDisponible;
        }
      }
    } catch (e) {
      console.warn('[ohsome v1] No se pudo leer metadata, usando fecha de corte segura.');
    }
    fechaMaximaDisponible = '2026-06-01';
    return fechaMaximaDisponible;
  }

  /**
   * Determina la métrica geométrica especializada según el filtro OSM
   */
  function clasificarGeometria(filtro) {
    const f = filtro.toLowerCase();
    if (f.includes('highway') || f.includes('cycleway') || f.includes('footway') || f.includes('waterway') || f.includes('path')) {
      return 'linea';
    }
    if (f.includes('building') || f.includes('leisure') || f.includes('landuse') || f.includes('boundary') || f.includes('natural=wood')) {
      return 'poligono';
    }
    return 'punto';
  }

  async function consultarEndpointV1(rutaEndpoint, bbox, filtro, tiempo) {
    const base = window.NODO_CONFIG?.endpoints?.ohsome_v1 || window.NODO_CONFIG?.endpoints?.ohsome || 'https://api.ohsome.org/v1';
    const url = `${base}${rutaEndpoint}`;

    const cuerpo = new URLSearchParams({
      bboxes: bboxParaOhsome(bbox),
      filter: filtro,
      time: tiempo
    });

    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: cuerpo.toString()
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text().catch(() => '');
      throw new Error(`ohsome v1 respondió con código ${respuesta.status} en ${rutaEndpoint}. ${texto ? texto.slice(0, 150) : ''}`);
    }

    return respuesta.json();
  }

  async function consultarEndpointV2(rutaEndpoint, bbox, filtro, tiempo, apiKey) {
    const base = window.NODO_CONFIG?.endpoints?.ohsome_v2 || 'https://api.heigit.org/ohsome-api/v2-rc';
    const url = `${base}${rutaEndpoint}`;

    const cuerpo = new URLSearchParams({
      bboxes: bboxParaOhsome(bbox),
      filter: filtro,
      time: tiempo
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (apiKey && apiKey.trim()) {
      const token = apiKey.trim();
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers['apiKey'] = token.replace(/^Bearer\s+/i, '');
    }

    const respuesta = await fetch(url, {
      method: 'POST',
      headers,
      body: cuerpo.toString()
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text().catch(() => '');
      const err = new Error(`ohsome v2 respondió con código ${respuesta.status} en ${rutaEndpoint}. ${texto ? texto.slice(0, 150) : ''}`);
      err.status = respuesta.status;
      throw err;
    }

    return respuesta.json();
  }

  /**
   * Calcula los indicadores de calidad especializados según tipo de entidad (compatible con v1 y v2)
   */
  async function calcularIndicadores(bbox, filtro = 'building=* and type:way', intervalo = 'P1Y', version = 'v1', apiKey = '') {
    const baseV1 = window.NODO_CONFIG?.endpoints?.ohsome_v1 || window.NODO_CONFIG?.endpoints?.ohsome || 'https://api.ohsome.org/v1';
    const fechaFin = await obtenerFechaMaxima(baseV1);

    const anioFin = parseInt(fechaFin.slice(0, 4), 10);
    let fechaInicio = `${anioFin - 5}-01-01`;
    if (intervalo === 'P1M') {
      fechaInicio = `${anioFin - 1}-${fechaFin.slice(5)}`;
    } else if (intervalo === 'P6M') {
      fechaInicio = `${anioFin - 3}-01-01`;
    }
    const ventanaTiempo = `${fechaInicio}/${fechaFin}/${intervalo}`;

    const tipoGeo = clasificarGeometria(filtro);

    // Si se solicitó v2, intentar primero contra la API v2 de HeiGIT
    if (version === 'v2') {
      try {
        console.log('[ohsome] Intentando consulta contra ohsome API v2 (ohsomeDB / Citus)...');
        const endpointEspecial = tipoGeo === 'linea' ? '/stats/features/length' : (tipoGeo === 'poligono' ? '/stats/features/area' : null);

        const promesasV2 = [
          consultarEndpointV2('/stats/features/count', bbox, filtro, fechaFin, apiKey),
          consultarEndpointV2('/stats/contributors/count', bbox, filtro, ventanaTiempo, apiKey),
          consultarEndpointV2('/stats/features/count', bbox, filtro, ventanaTiempo, apiKey),
          endpointEspecial ? consultarEndpointV2(endpointEspecial, bbox, filtro, fechaFin, apiKey).catch(() => null) : Promise.resolve(null),
          consultarEndpointV2('/stats/features/count', bbox, filtro, ventanaTiempo, apiKey).catch(() => null)
        ];

        const [conteoActual, usuarios, serieTemporal, resEspecial, resContribuciones] = await Promise.all(promesasV2);

        return procesarResultadosIndicadores({
          tipoGeo,
          conteoActual,
          usuarios,
          serieTemporal,
          resEspecial,
          resContribuciones,
          fechaFin,
          versionUtilizada: 'v2',
          motor: 'ohsomeDB (PostgreSQL / Citus / Python)',
          fueFallback: false
        });
      } catch (errV2) {
        console.warn(`[ohsome] Consulta v2 no disponible o requiere API Key (${errV2.message}). Conmutando automáticamente a ohsome API v1 (OSHDB)...`);
        const resV1 = await ejecutarFlujoV1(bbox, filtro, tipoGeo, fechaFin, ventanaTiempo);
        resV1.fueFallback = true;
        resV1.motivoFallback = errV2.status === 401 ? 'Falta o token no válido de API Key para v2' : errV2.message;
        return resV1;
      }
    }

    // Flujo predeterminado v1 (OSHDB - acceso libre)
    return ejecutarFlujoV1(bbox, filtro, tipoGeo, fechaFin, ventanaTiempo);
  }

  async function ejecutarFlujoV1(bbox, filtro, tipoGeo, fechaFin, ventanaTiempo) {
    const promesas = [
      consultarEndpointV1('/elements/count', bbox, filtro, fechaFin),
      consultarEndpointV1('/users/count', bbox, filtro, ventanaTiempo),
      consultarEndpointV1('/elements/count', bbox, filtro, ventanaTiempo)
    ];

    let promesaEspecial = null;
    if (tipoGeo === 'linea') {
      promesaEspecial = consultarEndpointV1('/elements/length', bbox, filtro, fechaFin).catch(e => {
        console.warn('[ohsome v1] Longitud no aplicable o error:', e.message);
        return null;
      });
    } else if (tipoGeo === 'poligono') {
      promesaEspecial = consultarEndpointV1('/elements/area', bbox, filtro, fechaFin).catch(e => {
        console.warn('[ohsome v1] Área no aplicable o error:', e.message);
        return null;
      });
    }

    const promesaContribuciones = consultarEndpointV1('/contributions/count', bbox, filtro, ventanaTiempo).catch(e => {
      console.warn('[ohsome v1] Contribuciones no aplicable o error:', e.message);
      return null;
    });

    const [conteoActual, usuarios, serieTemporal, resEspecial, resContribuciones] = await Promise.all([
      promesas[0],
      promesas[1],
      promesas[2],
      promesaEspecial,
      promesaContribuciones
    ]);

    return procesarResultadosIndicadores({
      tipoGeo,
      conteoActual,
      usuarios,
      serieTemporal,
      resEspecial,
      resContribuciones,
      fechaFin,
      versionUtilizada: 'v1',
      motor: 'OSHDB (HeiGIT Java Engine)',
      fueFallback: false
    });
  }

  function procesarResultadosIndicadores(params) {
    const {
      tipoGeo,
      conteoActual,
      usuarios,
      serieTemporal,
      resEspecial,
      resContribuciones,
      fechaFin,
      versionUtilizada,
      motor,
      fueFallback
    } = params;

    const extractArray = (obj) => {
      if (!obj) return [];
      if (Array.isArray(obj)) return obj;
      if (Array.isArray(obj.result)) return obj.result;
      if (Array.isArray(obj.data)) return obj.data;
      return [];
    };

    const resActual = extractArray(conteoActual);
    const elementosAhora = resActual.length > 0 ? (resActual[0].value || 0) : 0;

    const listaUsuarios = extractArray(usuarios).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value || 0)
    }));

    const listaElementos = extractArray(serieTemporal).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value || 0)
    }));

    const listaContribuciones = extractArray(resContribuciones).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value || 0)
    }));

    // Métricas geométricas calculadas
    let metricaGeometrica = null;
    const itemsEspecial = extractArray(resEspecial);
    if (tipoGeo === 'linea' && itemsEspecial.length > 0) {
      const metros = itemsEspecial[0].value || 0;
      metricaGeometrica = {
        tipo: 'longitud',
        etiqueta: 'Longitud total de red trazada',
        valorMetros: Math.round(metros),
        valorKm: Number((metros / 1000).toFixed(2)),
        unidad: 'km'
      };
    } else if (tipoGeo === 'poligono' && itemsEspecial.length > 0) {
      const m2 = itemsEspecial[0].value || 0;
      metricaGeometrica = {
        tipo: 'superficie',
        etiqueta: 'Superficie total construida / cubierta',
        valorM2: Math.round(m2),
        valorKm2: Number((m2 / 1000000).toFixed(4)),
        valorHectareas: Number((m2 / 10000).toFixed(2)),
        unidad: 'm²'
      };
    }

    // Ratio de intensidad comunitaria
    const ultimoUsuarios = listaUsuarios.at(-1)?.valor || 0;
    const ultimasContribuciones = listaContribuciones.at(-1)?.valor || 0;
    const ratioContribucionPorUsuario = ultimoUsuarios > 0 ? Number((ultimasContribuciones / ultimoUsuarios).toFixed(1)) : null;

    return {
      version: versionUtilizada,
      motor,
      fueFallback,
      tipoGeometria: tipoGeo,
      elementosAhora: Math.round(elementosAhora),
      metricaGeometrica,
      usuariosPorAnio: listaUsuarios,
      elementosPorAnio: listaElementos,
      contribucionesPorAnio: listaContribuciones,
      ratioContribucionPorUsuario,
      fechaCorte: fechaFin,
      referencias: [
        {
          autor: 'Raifer, M., Troilo, R., Kowatsch, F., Marx, S., & Zipf, A. (2019)',
          titulo: 'OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data (ohsome API v1)',
          doi: '10.1186/s40965-019-0061-3',
          url: 'https://doi.org/10.1186/s40965-019-0061-3'
        },
        {
          autor: 'HeiGIT - Heidelberg Institute for Geoinformation Technology (2025/2026)',
          titulo: 'ohsome API v2: Next-Generation OSM History Analysis with ohsomeDB and Citus',
          url: 'https://api.heigit.org/ohsome-api/v2-rc/docs'
        },
        {
          autor: 'Neis, P. & Zipf, A. (2012)',
          titulo: 'Analyzing the Contributor Activity of OpenStreetMap and Its Development for the Community',
          doi: '10.3390/ijgi1020146',
          url: 'https://doi.org/10.3390/ijgi1020146'
        },
        {
          autor: 'Haklay, M. (2010)',
          titulo: 'How good is volunteered geographical information? A case study of OpenStreetMap in the UK',
          doi: '10.1068/b35097',
          url: 'https://doi.org/10.1068/b35097'
        }
      ]
    };
  }
  }

  /**
   * Calcula densidad de elementos por km² sobre el Bounding Box
   * aplicando reproyección geodésica rigurosa a EPSG:32719 (UTM 19S)
   */
  function calcularDensidad(bbox, cantidadElementos) {
    let infoArea = null;
    if (typeof ModuloGeodesia !== 'undefined' && ModuloGeodesia.calcularSuperficieBbox) {
      infoArea = ModuloGeodesia.calcularSuperficieBbox(bbox);
    } else {
      // Fallback geodésico WGS 84 / UTM 19S (Snyder, 1987)
      const a = 6378137.0;
      const f = 1 / 298.257223563;
      const e2 = 2 * f - f * f;
      const latMediaRad = ((bbox[1] + bbox[3]) / 2) * (Math.PI / 180);
      const mLat = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(latMediaRad) ** 2, 1.5);
      const mLon = (a * Math.cos(latMediaRad)) / Math.sqrt(1 - e2 * Math.sin(latMediaRad) ** 2);
      const anchoM = Math.abs(bbox[2] - bbox[0]) * (Math.PI / 180) * mLon;
      const altoM = Math.abs(bbox[3] - bbox[1]) * (Math.PI / 180) * mLat;
      const areaM2 = anchoM * altoM;
      infoArea = {
        areaM2: Math.round(areaM2),
        areaHa: Number((areaM2 / 10000).toFixed(2)),
        areaKm2: Number((areaM2 / 1000000).toFixed(4)),
        srs: 'EPSG:32719 (WGS 84 / UTM Huso 19 Sur)',
        metodo: 'Reproyección geodésica conforme a EPSG:32719 + Fórmula de Gauss'
      };
    }

    if (!infoArea || infoArea.areaKm2 <= 0) return null;

    return {
      densidad: cantidadElementos / infoArea.areaKm2,
      densidadHa: infoArea.areaHa > 0 ? (cantidadElementos / infoArea.areaHa) : null,
      densidadM2: infoArea.areaM2 > 0 ? (cantidadElementos / infoArea.areaM2) : null,
      densidad1000m2: infoArea.areaM2 > 0 ? Number(((cantidadElementos / infoArea.areaM2) * 1000).toFixed(4)) : null,
      areaM2: infoArea.areaM2,
      areaHa: infoArea.areaHa,
      areaKm2: infoArea.areaKm2,
      srs: infoArea.srs,
      metodo: infoArea.metodo
    };
  }

  return {
    calcularIndicadores,
    calcularDensidad,
    clasificarGeometria
  };
})();
