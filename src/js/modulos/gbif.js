/*
  gbif.js
  -------
  Consultas a la API pública de GBIF (Global Biodiversity Information Facility).
  Permite incorporar ciencia ciudadana (iNaturalist, museos) al Atlas VGI.
  Incluye resolución y autocompletado taxonómico (Species Backbone & Suggest API),
  búsqueda estricta por taxonKey para evitar contaminación inter-especies y
  auditoría de banderas de calidad (Darwin Core Issues).
  Convierte los registros directamente a GeoJSON FeatureCollection para visualización cartográfica.
*/

const ModuloGBIF = (() => {

  const cacheTaxon = new Map();
  const cacheOcurrencias = new Map();

  /**
   * Resuelve un texto (nombre científico, grupo biológico o nombre común en español)
   * al taxón oficial en el Backbone de GBIF para obtener su taxonKey aceptado.
   * Evita búsquedas de texto libre 'q' que mezclan especies homónimas o con epítetos similares (ej: 'chilensis').
   */
  async function resolverTaxon(texto) {
    if (!texto || !texto.trim()) return null;
    const tLimpio = texto.trim();
    const claveCache = 'res_' + tLimpio.toLowerCase();
    if (cacheTaxon.has(claveCache)) return cacheTaxon.get(claveCache);

    const base = (typeof window !== 'undefined' && window.NODO_CONFIG?.endpoints?.gbif) || 'https://api.gbif.org/v1';

    // Generar candidatos taxonómicos limpios
    const candidatos = [];

    // 1. Si contiene paréntesis (ej: "Palma chilena (Jubaea chilensis)"), extraer el nombre científico
    const matchParentesis = tLimpio.match(/\(([^)]+)\)/);
    if (matchParentesis && matchParentesis[1]) {
      const dentro = matchParentesis[1].replace(/\s+spp\.?/i, '').trim();
      if (dentro) candidatos.push(dentro);
    }

    // 2. Texto sin paréntesis ni sufijos descriptivos
    const sinParentesis = tLimpio.replace(/\(.*?\)/g, '').replace(/—.*$/, '').replace(/\/.*$/, '').trim();
    if (sinParentesis && !candidatos.includes(sinParentesis)) {
      candidatos.push(sinParentesis);
    }

    // 3. Texto original completo
    if (!candidatos.includes(tLimpio)) {
      candidatos.push(tLimpio);
    }

    // A) Intentar con /species/match (Species Backbone Oficial)
    for (const cand of candidatos) {
      try {
        const ctl = new AbortController();
        const tId = setTimeout(() => ctl.abort(), 6000);
        const res = await fetch(`${base}/species/match?name=${encodeURIComponent(cand)}&strict=false`, { signal: ctl.signal });
        clearTimeout(tId);
        if (res.ok) {
          const data = await res.json();
          if ((data.matchType === 'EXACT' || data.matchType === 'FUZZY') && (data.acceptedUsageKey || data.speciesKey || data.usageKey || data.key)) {
            const taxKey = data.acceptedUsageKey || data.speciesKey || data.usageKey || data.key;
            const canon = (data.status === 'SYNONYM' && data.species) ? data.species : (data.canonicalName || data.species || data.scientificName);
            const taxRes = {
              taxonKey: taxKey,
              canonicalName: canon,
              scientificName: data.scientificName || canon,
              rank: data.rank || 'TAXON',
              kingdom: data.kingdom || '',
              matchType: data.matchType
            };
            cacheTaxon.set(claveCache, taxRes);
            return taxRes;
          }
        }
      } catch (err) {
        // Continuar con el siguiente candidato
      }
    }

    // B) Probar /species/search para nombres vernáculos en español (ej: "Palma chilena", "Queltehue", "Peumo")
    for (const cand of candidatos) {
      try {
        const ctl = new AbortController();
        const tId = setTimeout(() => ctl.abort(), 6000);
        const res = await fetch(`${base}/species/search?q=${encodeURIComponent(cand)}&limit=4`, { signal: ctl.signal });
        clearTimeout(tId);
        if (res.ok) {
          const data = await res.json();
          const results = data.results || [];
          if (results.length > 0) {
            const top = results[0];
            const taxKey = top.nubKey || top.acceptedKey || top.speciesKey || top.key;
            if (taxKey) {
              const canon = top.canonicalName || top.species || top.scientificName;
              const taxRes = {
                taxonKey: taxKey,
                canonicalName: canon,
                scientificName: top.scientificName || canon,
                rank: top.rank || 'TAXON',
                kingdom: top.kingdom || '',
                matchType: 'SPECIES_SEARCH'
              };
              cacheTaxon.set(claveCache, taxRes);
              return taxRes;
            }
          }
        }
      } catch (err) {
        // Continuar
      }
    }

    // C) Probar /species/suggest como último fallback
    for (const cand of candidatos) {
      try {
        const ctl = new AbortController();
        const tId = setTimeout(() => ctl.abort(), 6000);
        const res = await fetch(`${base}/species/suggest?q=${encodeURIComponent(cand)}&limit=3`, { signal: ctl.signal });
        clearTimeout(tId);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && data[0].key) {
            const top = data[0];
            const taxRes = {
              taxonKey: top.key,
              canonicalName: top.canonicalName || top.scientificName,
              scientificName: top.scientificName || top.canonicalName,
              rank: top.rank || 'TAXON',
              kingdom: top.kingdom || '',
              matchType: 'SUGGEST'
            };
            cacheTaxon.set(claveCache, taxRes);
            return taxRes;
          }
        }
      } catch (err) {
        // Continuar
      }
    }

    return null;
  }

  /**
   * Sugiere taxones en tiempo real usando GBIF Species Suggest & Search API
   */
  async function sugerirTaxon(texto) {
    if (!texto || texto.trim().length < 2) return [];
    const tLimpio = texto.trim();
    const claveCache = 'sug_' + tLimpio.toLowerCase();
    if (cacheTaxon.has(claveCache)) return cacheTaxon.get(claveCache);

    const base = (typeof window !== 'undefined' && window.NODO_CONFIG?.endpoints?.gbif) || 'https://api.gbif.org/v1';

    // Limpiar candidatos para sugerencias
    const candidatos = [];
    const matchParentesis = tLimpio.match(/\(([^)]+)\)/);
    if (matchParentesis && matchParentesis[1]) {
      const dentro = matchParentesis[1].replace(/\s+spp\.?/i, '').trim();
      if (dentro) candidatos.push(dentro);
    }
    const sinPar = tLimpio.replace(/\(.*?\)/g, '').trim();
    if (sinPar && !candidatos.includes(sinPar)) candidatos.push(sinPar);
    if (!candidatos.includes(tLimpio)) candidatos.push(tLimpio);

    // 1. Probar species/suggest
    for (const cand of candidatos) {
      try {
        const ctl = new AbortController();
        const tId = setTimeout(() => ctl.abort(), 6000);
        const res = await fetch(`${base}/species/suggest?q=${encodeURIComponent(cand)}&limit=6`, { signal: ctl.signal });
        clearTimeout(tId);
        if (res.ok) {
          const datos = await res.json();
          if (Array.isArray(datos) && datos.length > 0) {
            const resultado = datos.map(item => ({
              key: item.key,
              canonicalName: item.canonicalName || item.scientificName,
              scientificName: item.scientificName,
              kingdom: item.kingdom,
              rank: item.rank
            }));
            cacheTaxon.set(claveCache, resultado);
            return resultado;
          }
        }
      } catch (e) {
        // Continuar
      }
    }

    // 2. Si suggest está vacío (común con nombres en español como "Palma chilena"), probar species/search
    for (const cand of candidatos) {
      try {
        const ctl = new AbortController();
        const tId = setTimeout(() => ctl.abort(), 6000);
        const res = await fetch(`${base}/species/search?q=${encodeURIComponent(cand)}&limit=6`, { signal: ctl.signal });
        clearTimeout(tId);
        if (res.ok) {
          const datos = await res.json();
          const results = datos.results || [];
          if (results.length > 0) {
            const resultado = results.map(item => ({
              key: item.nubKey || item.key,
              canonicalName: item.canonicalName || item.species || item.scientificName,
              scientificName: item.scientificName,
              kingdom: item.kingdom,
              rank: item.rank
            }));
            cacheTaxon.set(claveCache, resultado);
            return resultado;
          }
        }
      } catch (e) {
        // Continuar
      }
    }

    return [];
  }

  /**
   * Consulta registros biológicos en GBIF utilizando taxonKey estricto para evitar mezclar especies.
   */
  async function buscarOcurrencias({ nombre, taxonKey, bbox, limite = 300, basisOfRecord = 'ALL' }) {
    const claveCache = `${nombre || ''}_${taxonKey || ''}_${JSON.stringify(bbox)}_${limite}_${basisOfRecord}`;
    if (cacheOcurrencias.has(claveCache)) {
      console.log('[GBIF] Retornando ocurrencias desde caché en memoria');
      return cacheOcurrencias.get(claveCache);
    }

    const base = (typeof window !== 'undefined' && window.NODO_CONFIG?.endpoints?.gbif) || 'https://api.gbif.org/v1';
    const parametros = new URLSearchParams({
      limit: String(limite),
      hasCoordinate: 'true'
    });

    let taxonResuelto = null;
    let keyTaxonFinal = taxonKey;

    if (!keyTaxonFinal && nombre && nombre.trim()) {
      taxonResuelto = await resolverTaxon(nombre.trim());
      if (taxonResuelto && taxonResuelto.taxonKey) {
        keyTaxonFinal = taxonResuelto.taxonKey;
      }
    } else if (keyTaxonFinal && nombre && nombre.trim()) {
      taxonResuelto = { taxonKey: keyTaxonFinal, canonicalName: nombre.trim() };
    }

    if (keyTaxonFinal) {
      // Búsqueda taxonómica precisa: el taxonKey filtra el árbol taxonómico completo sin mezclar especies homónimas
      parametros.set('taxonKey', String(keyTaxonFinal));
    } else if (nombre && nombre.trim()) {
      // Fallback si no se encontró en el backbone: usar scientificName limpio
      const nombreLimpio = nombre.replace(/\(.*?\)/g, '').replace(/—.*$/, '').trim() || nombre.trim();
      parametros.set('scientificName', nombreLimpio);
    }

    if (basisOfRecord && basisOfRecord !== 'ALL') {
      parametros.set('basisOfRecord', basisOfRecord);
    }

    if (bbox && bbox.length === 4) {
      const [oeste, sur, este, norte] = bbox;
      parametros.set('decimalLatitude', `${sur},${norte}`);
      parametros.set('decimalLongitude', `${oeste},${este}`);
    }

    const urlFinal = `${base}/occurrence/search?${parametros.toString()}`;
    console.log(`[GBIF] Consultando ocurrencias: ${urlFinal}`);

    const ctl = new AbortController();
    const tId = setTimeout(() => ctl.abort(), 15000);
    let respuesta;
    try {
      respuesta = await fetch(urlFinal, { signal: ctl.signal });
      clearTimeout(tId);
    } catch (err) {
      clearTimeout(tId);
      throw new Error(`Timeout o error de conexión con GBIF: ${err.message}`);
    }

    if (!respuesta.ok) {
      throw new Error(`GBIF respondió con error ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const resultados = datos.results || [];

    let registros = resultados.map(r => ({
      id: r.key || r.gbifID,
      especie: r.species || r.canonicalName || (r.scientificName ? r.scientificName.split('(')[0].trim() : 'Especie no determinada'),
      scientificName: r.scientificName || r.species || 'Especie no determinada',
      nombreComun: r.vernacularName || null,
      reino: r.kingdom || 'Indeterminado',
      familia: r.family || null,
      fecha: r.eventDate ? r.eventDate.slice(0, 10) : 'Sin fecha registrada',
      publicador: r.institutionCode || r.publishingOrgKey || 'Ciencia Ciudadana / GBIF',
      licencia: r.license || 'CC-BY 4.0',
      lat: r.decimalLatitude,
      lon: r.decimalLongitude,
      issues: r.issues || [] // Banderas de calidad Darwin Core
    }));

    // Filtro de verificación estricto: Si se buscó una especie específica (ej: Jubaea chilensis),
    // asegurar que 100% de los registros devueltos correspondan a dicha especie
    if (taxonResuelto && taxonResuelto.canonicalName && (taxonResuelto.rank === 'SPECIES' || taxonResuelto.rank === 'SUBSPECIES' || taxonResuelto.rank === 'VARIETY')) {
      const canonObjetivo = taxonResuelto.canonicalName.toLowerCase();
      registros = registros.filter(r => {
        const esp = (r.especie || '').toLowerCase();
        const sci = (r.scientificName || '').toLowerCase();
        return esp.includes(canonObjetivo) || sci.includes(canonObjetivo);
      });
    }

    const respuestaFinal = {
      total: registros.length,
      totalGbif: datos.count || 0,
      taxonResuelto: taxonResuelto,
      registros: registros,
      geojson: ocurrenciasAGeoJSON(registros)
    };

    cacheOcurrencias.set(claveCache, respuestaFinal);
    return respuestaFinal;
  }

  function ocurrenciasAGeoJSON(registros) {
    const features = registros
      .filter(r => r.lat && r.lon)
      .map(r => ({
        type: 'Feature',
        id: `GBIF/${r.id}`,
        geometry: {
          type: 'Point',
          coordinates: [r.lon, r.lat]
        },
        properties: {
          id_vgi: `GBIF/${r.id}`,
          categoria: 'biodiversidad',
          subtipo: 'Registro Biológico (GBIF/iNat)',
          nombre: r.nombreComun ? `${r.nombreComun} (${r.especie})` : r.especie,
          especie: r.especie,
          scientificName: r.scientificName || r.especie,
          reino: r.reino,
          familia: r.familia,
          operador: r.publicador,
          fecha: r.fecha,
          fuente: 'GBIF / Ciencia Ciudadana',
          licencia: r.licencia,
          calidad_issues: (r.issues && r.issues.length > 0) ? r.issues.join(', ') : 'Sin advertencias (Georreferencia válida)'
        }
      }));

    return {
      type: 'FeatureCollection',
      name: 'GBIF_Biodiversidad_Urbana',
      features: features
    };
  }

  return {
    resolverTaxon,
    sugerirTaxon,
    buscarOcurrencias,
    ocurrenciasAGeoJSON
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloGBIF = ModuloGBIF;
  window.ModuloGbif = ModuloGBIF;
}
