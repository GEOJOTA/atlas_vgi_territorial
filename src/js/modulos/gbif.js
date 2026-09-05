/*
  gbif.js
  -------
  Consultas a la API pública de GBIF (Global Biodiversity Information Facility).
  Permite incorporar ciencia ciudadana (iNaturalist, museos) al Atlas VGI.
  Convierte los registros directamente a GeoJSON FeatureCollection para visualización cartográfica.
*/

const ModuloGBIF = (() => {

  async function buscarOcurrencias({ nombre, bbox, limite = 50, basisOfRecord = 'ALL' }) {
    const base = window.NODO_CONFIG.endpoints.gbif || 'https://api.gbif.org/v1';
    const parametros = new URLSearchParams({
      limit: String(limite),
      hasCoordinate: 'true'
    });

    if (nombre && nombre.trim()) {
      parametros.set('q', nombre.trim());
    }

    if (basisOfRecord && basisOfRecord !== 'ALL') {
      parametros.set('basisOfRecord', basisOfRecord);
    }

    if (bbox && bbox.length === 4) {
      const [oeste, sur, este, norte] = bbox;
      // GBIF acepta decimalLatitude y decimalLongitude como rangos separados por comas
      parametros.set('decimalLatitude', `${sur},${norte}`);
      parametros.set('decimalLongitude', `${oeste},${este}`);
    }

    const urlFinal = `${base}/occurrence/search?${parametros.toString()}`;
    console.log(`[GBIF] Consultando ocurrencias: ${urlFinal}`);

    const respuesta = await fetch(urlFinal);
    if (!respuesta.ok) {
      throw new Error(`GBIF respondió con error ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const resultados = datos.results || [];

    const registros = resultados.map(r => ({
      id: r.key || r.gbifID,
      especie: r.scientificName || r.species || 'Especie no determinada',
      nombreComun: r.vernacularName || null,
      reino: r.kingdom || 'Indeterminado',
      familia: r.family || null,
      fecha: r.eventDate ? r.eventDate.slice(0, 10) : 'Sin fecha registrada',
      publicador: r.institutionCode || r.publishingOrgKey || 'Ciencia Ciudadana / GBIF',
      licencia: r.license || 'CC-BY 4.0',
      lat: r.decimalLatitude,
      lon: r.decimalLongitude
    }));

    return {
      total: datos.count || 0,
      registros: registros,
      geojson: ocurrenciasAGeoJSON(registros)
    };
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
          reino: r.reino,
          familia: r.familia,
          operador: r.publicador,
          fecha: r.fecha,
          fuente: 'GBIF / Ciencia Ciudadana',
          licencia: r.licencia
        }
      }));

    return {
      type: 'FeatureCollection',
      name: 'GBIF_Biodiversidad_Urbana',
      features: features
    };
  }

  return {
    buscarOcurrencias,
    ocurrenciasAGeoJSON
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloGBIF = ModuloGBIF;
  window.ModuloGbif = ModuloGBIF;
}
