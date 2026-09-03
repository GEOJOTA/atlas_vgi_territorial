/*
  ohsome.js
  ---------
  Módulo de análisis de calidad y evolución espacio-temporal de OpenStreetMap (HeiGIT).
  Incluye:
  - Consulta adaptativa con detección del horizonte temporal máximo (/metadata) para evitar errores 400.
  - Serie temporal anual de elementos y colaboradores únicos.
  - Cálculo de densidad de información (elementos / km²).
  - Diagnóstico cualitativo de la dinámica de mapeo territorial.
*/

const ModuloOhsome = (() => {

  let fechaMaximaDisponible = null;

  function bboxParaOhsome(bbox) {
    return bbox.join(',');
  }

  /**
   * Obtiene la fecha máxima disponible en el servidor ohsome para no pedir fechas futuras
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
          console.log(`[ohsome] Fecha máxima de extracción detectada: ${fechaMaximaDisponible}`);
          return fechaMaximaDisponible;
        }
      }
    } catch (e) {
      console.warn('[ohsome] No se pudo leer metadata, usando fecha base de seguridad.');
    }
    // Fecha segura por defecto
    fechaMaximaDisponible = '2026-06-01';
    return fechaMaximaDisponible;
  }

  async function consultarIndicador(rutaEndpoint, bbox, filtro, tiempo) {
    const base = window.NODO_CONFIG.endpoints.ohsome || 'https://api.ohsome.org/v1';
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
      throw new Error(`ohsome respondió con error ${respuesta.status}. ${texto ? texto.slice(0, 200) : ''}`);
    }

    return respuesta.json();
  }

  /**
   * Calcula los indicadores de calidad para el área y filtro seleccionados
   */
  async function calcularIndicadores(bbox, filtro = 'building=* and type:way') {
    const base = window.NODO_CONFIG.endpoints.ohsome || 'https://api.ohsome.org/v1';
    const fechaFin = await obtenerFechaMaxima(base);

    // 5 años hacia atrás a partir de la fecha máxima del dataset
    const anioFin = parseInt(fechaFin.slice(0, 4), 10);
    const fechaInicio = `${anioFin - 5}-01-01`;
    const ventanaTiempo = `${fechaInicio}/${fechaFin}/P1Y`;

    const [conteoActual, usuarios, serieTemporal] = await Promise.all([
      consultarIndicador('/elements/count', bbox, filtro, fechaFin),
      consultarIndicador('/users/count', bbox, filtro, ventanaTiempo),
      consultarIndicador('/elements/count', bbox, filtro, ventanaTiempo)
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

    return {
      elementosAhora: Math.round(elementosAhora),
      usuariosPorAnio: listaUsuarios,
      elementosPorAnio: listaElementos,
      fechaCorte: fechaFin
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
    calcularDensidad
  };
})();
