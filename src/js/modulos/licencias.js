/*
  licencias.js
  ------------
  Marco legal, licencias de datos abiertos y catálogos estructurados.
  Integra:
  - Descripción de licencias aplicables a cada fuente VGI y oficial.
  - Vínculos directos a las hojas de cálculo Excel (.xlsx) generadas en docs/.
  - Normativa chilena aplicable (Ley de Transparencia, Política Nacional de Datos Geoespaciales).
*/

const ModuloLicencias = (() => {

  const FUENTES = [
    {
      nombre: 'OpenStreetMap (OSM)',
      licencia: 'Open Database License (ODbL) 1.0',
      implicancia: 'Libertad para copiar, distribuir, transmitir y adaptar los datos, siempre que se dé crédito a "© colaboradores de OpenStreetMap". Si se genera una base de datos derivada, debe distribuirse bajo la misma licencia ODbL (Share-Alike).',
      url: 'https://www.openstreetmap.org/copyright'
    },
    {
      nombre: 'ohsome (HeiGIT - Universidad de Heidelberg)',
      licencia: 'Derivada ODbL 1.0 (datos OSM de base)',
      implicancia: 'Las métricas y series temporales reflejan el historial de OSM. Todo análisis que derive directamente de las geometrías mantiene la cláusula de atribución comunitaria.',
      url: 'https://docs.ohsome.org'
    },
    {
      nombre: 'GBIF (Global Biodiversity Information Facility)',
      licencia: 'Variable por registro: CC0, CC-BY 4.0 o CC-BY-NC 4.0',
      implicancia: 'Cada dataset biológico declara sus términos. Para gestión pública o comunitaria se prefiere CC0 o CC-BY. Si un registro es CC-BY-NC, no puede integrarse en iniciativas comerciales.',
      url: 'https://www.gbif.org/citation-guidelines'
    },
    {
      nombre: 'UMap (OpenStreetMap)',
      licencia: 'Declarada individualmente por cada autor de mapa',
      implicancia: 'Los proyectos cartográficos creados por colectivos u organizaciones definen su propio uso en la descripción del mapa.',
      url: 'https://umap.openstreetmap.fr'
    },
    {
      nombre: 'IDE Chile / Datos del Estado',
      licencia: 'Datos Abiertos del Gobierno de Chile (Ley 20.285)',
      implicancia: 'Uso libre para fines públicos, de investigación y toma de decisiones territoriales con mención al ministerio o servicio emisor (SNIT, INE, MOP, MINVU).',
      url: 'https://www.ide.cl'
    }
  ];

  function render() {
    const bloquesFuentes = FUENTES.map(f => `
      <div class="bloque">
        <h3>${f.nombre}</h3>
        <p><strong>Licencia aplicable:</strong> ${f.licencia}</p>
        <p>${f.implicancia}</p>
        <p><a href="${f.url}" target="_blank" rel="noopener">${f.url}</a></p>
      </div>
    `).join('');

    const bloqueDescargas = `
      <div class="bloque" style="background:var(--papel-alto); border:1px solid var(--linea); padding:16px; margin-top:20px;">
        <h3>📁 Catálogos y Documentos Oficiales en Excel (.xlsx)</h3>
        <p>Para uso formal en la práctica profesional, se han generado y estructurado tres hojas de cálculo en la carpeta <code>docs/</code> del repositorio:</p>
        <ul style="line-height:1.8; font-size:0.9rem;">
          <li>
            <strong>1. Catálogo Sistemático de Fuentes VGI:</strong> 
            <code>docs/catalogo_fuentes_vgi.xlsx</code> 
            <span class="descripcion">(cobertura, actualización, escala, licencia y aplicación en Barrio Brasil / UAH).</span>
          </li>
          <li>
            <strong>2. Perfil de Metadatos VGI (ISO 19115 / IDE Chile):</strong> 
            <code>docs/perfil_metadatos_vgi.xlsx</code> 
            <span class="descripcion">(elementos núcleo, mapeo SNIT y estructura XML ISO 19139).</span>
          </li>
          <li>
            <strong>3. Taxonomía de Categorías Temáticas OSM:</strong> 
            <code>docs/categorias_tematicas_osm.xlsx</code> 
            <span class="descripcion">(8 categorías CAT-01 a CAT-08, filtros Overpass QL y diccionario normalizado).</span>
          </li>
        </ul>
      </div>
    `;

    return bloquesFuentes + bloqueDescargas;
  }

  return { render, FUENTES };
})();
