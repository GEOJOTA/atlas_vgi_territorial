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

  async function consultarEndpoint(rutaEndpoint, bbox, filtro, tiempo) {
    const base = window.NODO_CONFIG?.endpoints?.ohsome || 'https://api.ohsome.org/v1';
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
      throw new Error(`ohsome respondió con código ${respuesta.status} en ${rutaEndpoint}. ${texto ? texto.slice(0, 150) : ''}`);
    }

    return respuesta.json();
  }

  /**
   * Calcula los indicadores de calidad especializados según tipo de entidad
   */
  async function calcularIndicadores(bbox, filtro = 'building=* and type:way') {
    const base = window.NODO_CONFIG?.endpoints?.ohsome || 'https://api.ohsome.org/v1';
    const fechaFin = await obtenerFechaMaxima(base);

    const anioFin = parseInt(fechaFin.slice(0, 4), 10);
    const fechaInicio = `${anioFin - 5}-01-01`;
    const ventanaTiempo = `${fechaInicio}/${fechaFin}/P1Y`;

    const tipoGeo = clasificarGeometria(filtro);

    // Promesas comunes
    const promesas = [
      consultarEndpoint('/elements/count', bbox, filtro, fechaFin),
      consultarEndpoint('/users/count', bbox, filtro, ventanaTiempo),
      consultarEndpoint('/elements/count', bbox, filtro, ventanaTiempo)
    ];

    // Consulta geométrica especializada según API v1
    let promesaEspecial = null;
    if (tipoGeo === 'linea') {
      promesaEspecial = consultarEndpoint('/elements/length', bbox, filtro, fechaFin).catch(e => {
        console.warn('[ohsome] Longitud no aplicable o error:', e.message);
        return null;
      });
    } else if (tipoGeo === 'poligono') {
      promesaEspecial = consultarEndpoint('/elements/area', bbox, filtro, fechaFin).catch(e => {
        console.warn('[ohsome] Área no aplicable o error:', e.message);
        return null;
      });
    }

    // Consulta de contribuciones totales acumuladas
    const promesaContribuciones = consultarEndpoint('/contributions/count', bbox, filtro, ventanaTiempo).catch(e => {
      console.warn('[ohsome] Contribuciones no aplicable o error:', e.message);
      return null;
    });

    const [conteoActual, usuarios, serieTemporal, resEspecial, resContribuciones] = await Promise.all([
      promesas[0],
      promesas[1],
      promesas[2],
      promesaEspecial,
      promesaContribuciones
    ]);

    const elementosAhora = conteoActual.result && conteoActual.result.length > 0 ? conteoActual.result[0].value : 0;

    const listaUsuarios = (usuarios.result || []).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value)
    }));

    const listaElementos = (serieTemporal.result || []).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value)
    }));

    const listaContribuciones = (resContribuciones?.result || []).map(r => ({
      fecha: (r.fromTimestamp || r.timestamp || '').slice(0, 10),
      valor: Math.round(r.value)
    }));

    // Métricas geométricas calculadas
    let metricaGeometrica = null;
    if (tipoGeo === 'linea' && resEspecial?.result?.length > 0) {
      const metros = resEspecial.result[0].value;
      metricaGeometrica = {
        tipo: 'longitud',
        etiqueta: 'Longitud total de red trazada',
        valorMetros: Math.round(metros),
        valorKm: Number((metros / 1000).toFixed(2)),
        unidad: 'km'
      };
    } else if (tipoGeo === 'poligono' && resEspecial?.result?.length > 0) {
      const m2 = resEspecial.result[0].value;
      metricaGeometrica = {
        tipo: 'superficie',
        etiqueta: 'Superficie total construida / cubierta',
        valorM2: Math.round(m2),
        valorKm2: Number((m2 / 1000000).toFixed(4)),
        valorHectareas: Number((m2 / 10000).toFixed(2)),
        unidad: 'm²'
      };
    }

    // Ratio de intensidad comunitaria: contribuciones / usuario en el último año
    const ultimoUsuarios = listaUsuarios.at(-1)?.valor || 0;
    const ultimasContribuciones = listaContribuciones.at(-1)?.valor || 0;
    const ratioContribucionPorUsuario = ultimoUsuarios > 0 ? Number((ultimasContribuciones / ultimoUsuarios).toFixed(1)) : null;

    return {
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
          autor: 'Raifer et al. (2019)',
          titulo: 'OSHDB: a framework for spatio-temporal analysis of OpenStreetMap history data',
          doi: '10.1186/s40965-019-0061-3'
        },
        {
          autor: 'HeiGIT / Heidelberg University',
          titulo: 'ohsome API v1 Documentation — Spatio-temporal analysis of OSM',
          url: 'https://docs.ohsome.org/ohsome-api/v1/'
        },
        {
          autor: 'Neis, P. & Zipf, A. (2012)',
          titulo: 'Analyzing the Contributor Activity of OpenStreetMap and Its Development for the Community',
          doi: '10.3390/ijgi1020146'
        }
      ]
    };
  }

  /**
   * Calcula densidad de elementos por km² sobre el Bounding Box
   */
  function calcularDensidad(bbox, cantidadElementos) {
    const [oeste, sur, este, norte] = bbox;
    const kmPorGradoLat = 111.32;
    const latMediaRad = ((sur + norte) / 2) * (Math.PI / 180);
    const kmPorGradoLon = 111.32 * Math.cos(latMediaRad);

    const anchoKm = Math.abs(este - oeste) * kmPorGradoLon;
    const altoKm = Math.abs(norte - sur) * kmPorGradoLat;
    const areaKm2 = anchoKm * altoKm;

    if (areaKm2 <= 0) return null;
    return {
      densidad: cantidadElementos / areaKm2,
      areaKm2: areaKm2
    };
  }

  return {
    calcularIndicadores,
    calcularDensidad,
    clasificarGeometria
  };
})();
