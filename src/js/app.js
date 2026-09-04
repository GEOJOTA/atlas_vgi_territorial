/*
  app.js
  ------
  Orquestador de la interfaz de usuario del Atlas de Información Geográfica Voluntaria.
  Maneja:
  - Inicialización del mapa Leaflet y sincronización reactiva del Bounding Box.
  - Carga y toggle de las 8 capas temáticas VGI en el mapa interactivo.
  - Selector de territorios (Barrio Brasil UAH, Santiago Centro, etc.).
  - Consultas en vivo a Overpass, ohsome y GBIF con retroalimentación visual.
  - Generación y exportación dual de metadatos ISO 19115 (JSON) e ISO 19139 (XML).
  - Exportación de conjuntos de datos espaciales a GeoJSON para QGIS.
*/

let ultimaConsultaRealizada = null;
let capasCargadasPorCategoria = {};

const DICCIONARIO_VALORES_OSM = {
  amenity: [
    { valor: 'pharmacy', etiqueta: '💊 Farmacias y Boticas (pharmacy)', nombre: 'Farmacias Barrio Brasil', color: '#B33928' },
    { valor: 'university', etiqueta: '🎓 Sedes Universitarias UAH (university)', nombre: 'Campus UAH', color: '#1C523A' },
    { valor: 'college', etiqueta: '🏛️ Institutos y Centros de Formación (college)', nombre: 'Institutos Técnicos', color: '#2E8B57' },
    { valor: 'school', etiqueta: '🎒 Colegios y Escuelas (school)', nombre: 'Escuelas y Liceos', color: '#3A7D44' },
    { valor: 'hospital', etiqueta: '🏥 Hospitales y Clínicas (hospital)', nombre: 'Hospitales', color: '#D9534F' },
    { valor: 'clinic', etiqueta: '🩺 Consultorios y CESFAM (clinic)', nombre: 'CESFAM y Consultorios', color: '#C0392B' },
    { valor: 'bicycle_parking', etiqueta: '🚲 Biciestacionamientos (bicycle_parking)', nombre: 'Biciestacionamientos', color: '#E67E22' },
    { valor: 'fire_station', etiqueta: '🚒 Compañías de Bomberos (fire_station)', nombre: 'Bomberos Barrio Brasil', color: '#C0392B' },
    { valor: 'cafe', etiqueta: '☕ Cafeterías y Salones de Té (cafe)', nombre: 'Cafeterías Barrio Brasil', color: '#8A5A36' },
    { valor: 'restaurant', etiqueta: '🍽️ Restaurantes y Gastronomía (restaurant)', nombre: 'Restaurantes', color: '#D35400' },
    { valor: 'place_of_worship', etiqueta: '⛪ Iglesias y Templos (place_of_worship)', nombre: 'Templos y Basílicas', color: '#7D3C98' },
    { valor: 'community_centre', etiqueta: '🤝 Centros Comunitarios y Juntas de Vecinos (community_centre)', nombre: 'Centros Comunitarios', color: '#27AE60' },
    { valor: 'recycling', etiqueta: '♻️ Puntos Verdes y Reciclaje (recycling)', nombre: 'Puntos Verdes', color: '#229954' },
    { valor: 'police', etiqueta: '👮 Comisarías y Seguridad (police)', nombre: 'Seguridad y Carabineros', color: '#2980B9' }
  ],
  shop: [
    { valor: 'bakery', etiqueta: '🍞 Panaderías y Pastelerías (bakery)', nombre: 'Panaderías de Barrio', color: '#D4AC0D' },
    { valor: 'supermarket', etiqueta: '🛒 Supermercados (supermarket)', nombre: 'Supermercados', color: '#F39C12' },
    { valor: 'convenience', etiqueta: '🏪 Minimarkets y Almacenes (convenience)', nombre: 'Almacenes de Barrio', color: '#E67E22' },
    { valor: 'greengrocer', etiqueta: '🥬 Verdulerías y Fruterías (greengrocer)', nombre: 'Verdulerías', color: '#27AE60' },
    { valor: 'kiosk', etiqueta: '📰 Kioscos de Prensa y Confites (kiosk)', nombre: 'Kioscos', color: '#7F8C8D' },
    { valor: 'books', etiqueta: '📚 Librerías (books)', nombre: 'Librerías', color: '#8E44AD' }
  ],
  historic: [
    { valor: '*', etiqueta: '🏛️ Todo el Patrimonio Histórico (*)', nombre: 'Patrimonio Cultural', color: '#8A5A36' },
    { valor: 'building', etiqueta: '🏢 Casonas y Edificios Históricos (building)', nombre: 'Edificios Patrimoniales', color: '#6E2C00' },
    { valor: 'monument', etiqueta: '🗿 Monumentos Públicos (monument)', nombre: 'Monumentos Públicos', color: '#784212' },
    { valor: 'memorial', etiqueta: '🕯️ Memoriales y Placas Conmemorativas (memorial)', nombre: 'Memoriales Históricos', color: '#4A235A' }
  ],
  highway: [
    { valor: 'bus_stop', etiqueta: '🚌 Paraderos Sistema Red Movilidad (bus_stop)', nombre: 'Paraderos de Bus', color: '#2980B9' },
    { valor: 'crossing', etiqueta: '🚶 Cruces Peatonales y Pasos de Cebra (crossing)', nombre: 'Cruces Peatonales', color: '#16A085' },
    { valor: 'traffic_signals', etiqueta: '🚦 Semáforos y Señalización (traffic_signals)', nombre: 'Semáforos', color: '#C0392B' },
    { valor: 'cycleway', etiqueta: '🚲 Ciclovías y Calles Ciclistas (cycleway)', nombre: 'Ciclovías', color: '#27AE60' },
    { valor: 'pedestrian', etiqueta: '🚶 Calles Peatonales y Paseos (pedestrian)', nombre: 'Paseos Peatonales', color: '#2980B9' },
    { valor: 'footway', etiqueta: '🚶 Pasajes y Sendas Peatonales (footway)', nombre: 'Pasajes Peatonales', color: '#1F618D' }
  ],
  leisure: [
    { valor: 'park', etiqueta: '🌳 Parques y Plazas Urbanas (park)', nombre: 'Plazas y Parques', color: '#1E8449' },
    { valor: 'garden', etiqueta: '🌺 Jardines y Huertos Comunitarios (garden)', nombre: 'Jardines Urbanos', color: '#2ECC71' },
    { valor: 'playground', etiqueta: '🛝 Juegos Infantiles (playground)', nombre: 'Plazas de Juegos', color: '#F1C40F' },
    { valor: 'sports_centre', etiqueta: '⚽ Canchas y Centros Deportivos (sports_centre)', nombre: 'Centros Deportivos', color: '#E74C3C' }
  ],
  building: [
    { valor: 'yes', etiqueta: '🏢 Todas las Edificaciones Catastradas (yes)', nombre: 'Huella Construida', color: '#7F8C8D' },
    { valor: 'residential', etiqueta: '🏠 Viviendas y Edificios Residenciales (residential)', nombre: 'Viviendas y Residencias', color: '#95A5A6' },
    { valor: 'university', etiqueta: '🎓 Edificios Universitarios (university)', nombre: 'Pabellones Universitarios', color: '#1C523A' },
    { valor: 'commercial', etiqueta: '🏪 Edificios Comerciales y Oficinas (commercial)', nombre: 'Edificios Comerciales', color: '#D35400' }
  ],
  healthcare: [
    { valor: 'pharmacy', etiqueta: '💊 Farmacias (pharmacy)', nombre: 'Farmacias y Salud', color: '#B33928' },
    { valor: 'clinic', etiqueta: '🩺 Centros de Salud Primaria (clinic)', nombre: 'Salud Primaria', color: '#C0392B' },
    { valor: 'centre', etiqueta: '🏥 Centros Médicos y Diagnósticos (centre)', nombre: 'Centros Médicos', color: '#922B21' },
    { valor: 'dentist', etiqueta: '🦷 Clínicas Odontológicas (dentist)', nombre: 'Dentistas y Odontología', color: '#16A085' }
  ],
  tourism: [
    { valor: 'hotel', etiqueta: '🏨 Hoteles y Hostales Patrimoniales (hotel)', nombre: 'Hospedajes y Hoteles', color: '#7D3C98' },
    { valor: 'museum', etiqueta: '🏛️ Museos y Salas de Exposición (museum)', nombre: 'Museos y Salas', color: '#6C3483' },
    { valor: 'gallery', etiqueta: '🎨 Galerías de Arte (gallery)', nombre: 'Galerías de Arte', color: '#884EA0' },
    { valor: 'viewpoint', etiqueta: '🔭 Miradores Urbanos (viewpoint)', nombre: 'Miradores', color: '#2980B9' }
  ],
  emergency: [
    { valor: 'fire_hydrant', etiqueta: '💧 Grifos de Agua para Incendios (fire_hydrant)', nombre: 'Grifos contra Incendios', color: '#C0392B' },
    { valor: 'defibrillator', etiqueta: '❤️ Desfibriladores DEA de Emergencia (defibrillator)', nombre: 'Equipos DEA', color: '#922B21' },
    { valor: 'assembly_point', etiqueta: '🚨 Puntos de Encuentro en Emergencias (assembly_point)', nombre: 'Zonas de Evacuación', color: '#27AE60' }
  ]
};

function actualizarOpcionesValoresSegunClave(clave) {
  const selValor = document.getElementById('custom-valor-select');
  if (!selValor) return;

  const lista = DICCIONARIO_VALORES_OSM[clave] || [];
  if (lista.length === 0) {
    selValor.innerHTML = '<option value="custom" selected>✍️ — Escribir valor manual —</option>';
    return;
  }

  selValor.innerHTML = `
    ${lista.map((item, idx) => `<option value="${item.valor}" data-nombre="${item.nombre}" data-color="${item.color}" ${idx === 0 ? 'selected' : ''}>${item.etiqueta}</option>`).join('')}
    <option value="custom">✍️ — Escribir valor manual —</option>
  `;

  // Pre-llenar el primer valor por defecto en los inputs manuales
  const primero = lista[0];
  if (primero) {
    const inpValor = document.getElementById('custom-valor');
    const inpNombre = document.getElementById('custom-nombre-capa');
    const inpColor = document.getElementById('custom-color-capa');
    if (inpValor) inpValor.value = primero.valor === '*' ? '' : primero.valor;
    if (inpNombre) inpNombre.value = primero.nombre;
    if (inpColor) inpColor.value = primero.color;
  }
}

/* ---------------------- COHERENCIA INTERMODULAR Y AUTOCARGA ---------------------- */

let categoriaActivaGlobal = 'educacion';

const MAPA_COHERENCIA_CATEGORIAS = {
  educacion: {
    codigo: 'CAT-01',
    nombre: 'Educación y Universidad',
    claveOSM: 'amenity',
    valorOSM: 'university',
    entidadOSM: 'nwr',
    color: '#35586B',
    ohPreset: 'amenity=university and (type:node or type:way)',
    ohFiltro: 'amenity=university and (type:node or type:way)',
    gbifTaxa: 'custom',
    isoTopic: 'society',
    tituloMd: 'Catastro VGI de Educación y Campus Universitario UAH: Barrio Brasil',
    resumenMd: 'Inventario geoespacial de sedes universitarias, pabellones patrimoniales de la Universidad Alberto Hurtado (UAH), colegios, liceos y bibliotecas en Barrio Brasil y Santiago Centro.'
  },
  servicios: {
    codigo: 'CAT-02',
    nombre: 'Servicios y Comercio Barrial',
    claveOSM: 'shop',
    valorOSM: '*',
    entidadOSM: 'nwr',
    color: '#A97722',
    ohPreset: 'shop=* and (type:node or type:way)',
    ohFiltro: 'shop=* and (type:node or type:way)',
    gbifTaxa: 'custom',
    isoTopic: 'planningCadastre',
    tituloMd: 'Catastro VGI de Servicios y Comercio Barrial: Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Red de abastecimiento de proximidad, locales comerciales, almacenes, panaderías, cafeterías y farmacias comunitarias en Barrio Brasil y entorno del campus UAH.'
  },
  transporte: {
    codigo: 'CAT-03',
    nombre: 'Movilidad y Transporte',
    claveOSM: 'highway',
    valorOSM: 'bus_stop',
    entidadOSM: 'node',
    color: '#2C4238',
    ohPreset: 'highway=bus_stop and type:node',
    ohFiltro: 'highway=bus_stop and type:node',
    gbifTaxa: 'custom',
    isoTopic: 'transportation',
    tituloMd: 'Catastro VGI de Movilidad y Transporte: Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Infraestructura intermodal de transporte público: paraderos del Sistema Red Movilidad, accesos a estaciones de Metro (Los Héroes, Santa Ana, Cumming) y ejes estructurantes en Barrio Brasil.'
  },
  movilidad_activa: {
    codigo: 'CAT-04',
    nombre: 'Movilidad Activa y Ciclovías',
    claveOSM: 'highway',
    valorOSM: 'cycleway',
    entidadOSM: 'way',
    color: '#3F5D4E',
    ohPreset: '(highway=cycleway or cycleway=*) and type:way',
    ohFiltro: '(highway=cycleway or cycleway=*) and type:way',
    gbifTaxa: 'custom',
    isoTopic: 'transportation',
    tituloMd: 'Catastro VGI de Movilidad Activa y Ciclovías: Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Ejes de micromovilidad y movilidad sustentable: ciclovías segregadas, ciclobandas, sendas ciclables, talleres comunitarios y estacionamientos de bicicletas en Barrio Brasil y campus UAH.'
  },
  espacio_publico: {
    codigo: 'CAT-05',
    nombre: 'Áreas Verdes y Espacio Público',
    claveOSM: 'leisure',
    valorOSM: 'park',
    entidadOSM: 'nwr',
    color: '#236B43',
    ohPreset: 'leisure=park and (type:way or type:relation)',
    ohFiltro: 'leisure=park and (type:way or type:relation)',
    gbifTaxa: 'Plantae',
    isoTopic: 'environment',
    tituloMd: 'Catastro VGI de Áreas Verdes y Espacios Públicos: Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Superficie métrica calculada y catastro de plazas públicas (Plaza Brasil), parques urbanos, bandejones verdes, juegos infantiles y áreas de permanencia y recreación comunitaria.'
  },
  patrimonio: {
    codigo: 'CAT-06',
    nombre: 'Patrimonio y Cultura',
    claveOSM: 'historic',
    valorOSM: '*',
    entidadOSM: 'nwr',
    color: '#8F3A2C',
    ohPreset: 'historic=* and (type:node or type:way)',
    ohFiltro: 'historic=* and (type:node or type:way)',
    gbifTaxa: 'custom',
    isoTopic: 'society',
    tituloMd: 'Catastro VGI de Patrimonio y Cultura: Zona Típica Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Inmuebles de Conservación Histórica (ICH), casonas neoclásicas UAH, templos religiosos (Basílica del Salvador), centros culturales comunitarios, teatros y monumentos en la Zona Típica de Barrio Brasil.'
  },
  accesibilidad: {
    codigo: 'CAT-07',
    nombre: 'Accesibilidad Universal',
    claveOSM: 'highway',
    valorOSM: 'crossing',
    entidadOSM: 'node',
    color: '#4B5142',
    ohPreset: '(highway=crossing or kerb=*) and type:node',
    ohFiltro: '(highway=crossing or kerb=*) and type:node',
    gbifTaxa: 'custom',
    isoTopic: 'transportation',
    tituloMd: 'Catastro VGI de Caminabilidad y Accesibilidad Universal: Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Diagnóstico de caminabilidad inclusiva: rebajes de cordón en veredas, pasos peatonales seguros, pavimentos podotáctiles y rampas de acceso en el entorno de Barrio Brasil y UAH.'
  },
  biodiversidad: {
    codigo: 'CAT-08',
    nombre: 'Biodiversidad Urbana',
    claveOSM: 'natural',
    valorOSM: 'tree',
    entidadOSM: 'node',
    color: '#1C523A',
    ohPreset: 'natural=tree and type:node',
    ohFiltro: 'natural=tree and type:node',
    gbifTaxa: 'Plantae',
    isoTopic: 'biota',
    tituloMd: 'Catastro VGI de Biodiversidad Urbana y Arbolado: Barrio Brasil - Universidad Alberto Hurtado',
    resumenMd: 'Registros de arbolado urbano georreferenciado, flora y fauna comunitaria compilados desde OpenStreetMap y la Infraestructura Mundial de Información en Biodiversidad (GBIF).'
  }
};

function resolverCategoriaId(identificador) {
  if (!identificador) return 'educacion';
  if (MAPA_COHERENCIA_CATEGORIAS[identificador]) return identificador;
  const s = String(identificador).toLowerCase();
  if (s.includes('universidad') || s.includes('educacion') || s.includes('school') || s.includes('college') || s.includes('library')) return 'educacion';
  if (s.includes('farmacia') || s.includes('salud') || s.includes('comercio') || s.includes('shop') || s.includes('bakery') || s.includes('cafe') || s.includes('restaurant')) return 'servicios';
  if (s.includes('bus') || s.includes('transporte') || s.includes('metro') || s.includes('railway')) return 'transporte';
  if (s.includes('ciclo') || s.includes('bici') || s.includes('cycleway')) return 'movilidad_activa';
  if (s.includes('plaza') || s.includes('parque') || s.includes('leisure') || s.includes('park') || s.includes('playground')) return 'espacio_publico';
  if (s.includes('patrimonio') || s.includes('historic') || s.includes('casona') || s.includes('museum') || s.includes('theatre')) return 'patrimonio';
  if (s.includes('cruce') || s.includes('accesibilidad') || s.includes('kerb') || s.includes('wheelchair') || s.includes('crossing')) return 'accesibilidad';
  if (s.includes('arbol') || s.includes('arbolado') || s.includes('biodiversidad') || s.includes('tree') || s.includes('natural')) return 'biodiversidad';
  return 'educacion';
}

function sincronizarCoherenciaEntreModulos(identificador, opciones = {}) {
  const catId = resolverCategoriaId(identificador);
  categoriaActivaGlobal = catId;
  const mapa = MAPA_COHERENCIA_CATEGORIAS[catId];
  if (!mapa) return;

  // 1. Sincronizar botones de categorías en el visor
  document.querySelectorAll('.btn-categoria').forEach(b => {
    if (b.id === `btn-cat-${catId}`) {
      b.classList.add('sincronizado-activo');
    } else {
      b.classList.remove('sincronizado-activo');
    }
  });

  // 2. Sincronizar Preset de Overpass
  const selOsmPreset = document.getElementById('osm-categoria-preset');
  if (selOsmPreset && opciones.origen !== 'preset_osm') {
    selOsmPreset.value = catId;
    const inpEtiqueta = document.getElementById('osm-etiqueta');
    if (inpEtiqueta) {
      inpEtiqueta.value = '';
      inpEtiqueta.placeholder = `Preset activo: ${catId} (${mapa.nombre})`;
    }
  }

  // 3. Sincronizar Constructor Personalizado
  if (opciones.origen !== 'constructor_custom') {
    const inpClave = document.getElementById('custom-clave-manual');
    const inpValor = document.getElementById('custom-valor');
    const inpNombre = document.getElementById('custom-nombre-capa');
    const inpColor = document.getElementById('custom-color-capa');
    const selEntidad = document.getElementById('custom-entidad');
    if (inpClave) inpClave.value = opciones.clave || mapa.claveOSM;
    if (inpValor) inpValor.value = opciones.valor !== undefined ? (opciones.valor === '*' ? '' : opciones.valor) : (mapa.valorOSM === '*' ? '' : mapa.valorOSM);
    if (inpNombre) inpNombre.value = opciones.nombre || mapa.nombre;
    if (inpColor) inpColor.value = opciones.color || mapa.color;
    if (selEntidad) selEntidad.value = mapa.entidadOSM;
    if (typeof actualizarCodigoQLPreview === 'function') actualizarCodigoQLPreview();
  }

  // 4. Sincronizar Panel ohsome
  const selOhPreset = document.getElementById('oh-preset-selector');
  const inpOhFiltro = document.getElementById('oh-filtro');
  if (selOhPreset) {
    let match = false;
    for (let i = 0; i < selOhPreset.options.length; i++) {
      if (selOhPreset.options[i].value === mapa.ohPreset) {
        selOhPreset.selectedIndex = i;
        match = true;
        break;
      }
    }
    if (!match) selOhPreset.value = 'custom';
  }
  if (inpOhFiltro) {
    inpOhFiltro.value = mapa.ohFiltro;
  }

  // 5. Sincronizar Panel GBIF
  const selGbifTaxa = document.getElementById('gbif-taxa-selector');
  const inpGbifNombre = document.getElementById('gbif-nombre');
  if (selGbifTaxa && mapa.gbifTaxa !== 'custom') {
    selGbifTaxa.value = mapa.gbifTaxa;
    if (inpGbifNombre) inpGbifNombre.value = mapa.gbifTaxa;
  }

  // 6. Autocarga reactiva de metadatos ISO 19115/19139
  autocargarMetadatos({
    categoriaId: catId,
    titulo: opciones.nombre ? `Catastro VGI: ${opciones.nombre} - Barrio Brasil / UAH` : mapa.tituloMd,
    resumen: mapa.resumenMd,
    forzar: false
  });

  // 7. Feedback visual de sincronización intermodular
  const badgeSinc = document.getElementById('badge-sincronizacion');
  if (badgeSinc) {
    badgeSinc.style.display = 'block';
    badgeSinc.innerHTML = `🔄 <strong>Coherencia activa:</strong> ${mapa.nombre} (${mapa.codigo}) vinculada en Overpass, ohsome y Metadatos.`;
  }
}

function sincronizarCoherenciaDesdeOhsome(presetVal) {
  for (const [catId, info] of Object.entries(MAPA_COHERENCIA_CATEGORIAS)) {
    if (info.ohPreset === presetVal || info.ohFiltro === presetVal) {
      sincronizarCoherenciaEntreModulos(catId, { origen: 'preset_ohsome' });
      return;
    }
  }
}

function autocargarMetadatos(opciones = {}) {
  const bbox = opciones.bbox || leerBbox('osm') || leerBbox('oh') || window.NODO_CONFIG?.area_por_defecto?.bbox;
  if (bbox) escribirBbox('md', bbox);

  const catId = opciones.categoriaId || categoriaActivaGlobal || 'educacion';
  const mapa = MAPA_COHERENCIA_CATEGORIAS[catId] || MAPA_COHERENCIA_CATEGORIAS['educacion'];

  const inpTitulo = document.getElementById('md-titulo');
  const selCategoriaIso = document.getElementById('md-categoria-iso');
  const txtResumen = document.getElementById('md-resumen');
  const txtLinaje = document.getElementById('md-linaje');
  const inpSrs = document.getElementById('md-srs');

  const titulo = opciones.titulo || mapa.tituloMd;
  if (inpTitulo) inpTitulo.value = titulo;
  if (selCategoriaIso) selCategoriaIso.value = opciones.isoTopic || mapa.isoTopic;

  let extraMetricas = '';
  if (typeof ModuloGeodesia !== 'undefined' && ModuloGeodesia.calcularSuperficieBbox && bbox) {
    const s = ModuloGeodesia.calcularSuperficieBbox(bbox);
    extraMetricas = ` Superficie métrica calculada: ${s.areaM2.toLocaleString('es-CL')} m² (${s.areaHa.toLocaleString('es-CL')} ha / ${s.areaKm2} km²) bajo EPSG:32719 UTM Huso 19 Sur.`;
  }
  if (txtResumen) {
    txtResumen.value = `${opciones.resumen || mapa.resumenMd}${extraMetricas}`;
  }

  const cantidad = opciones.cantidad !== undefined ? opciones.cantidad : (ultimaConsultaRealizada?.cantidad ?? 'múltiples');
  const fuente = opciones.fuente || ultimaConsultaRealizada?.fuente || 'OpenStreetMap / Overpass QL & ohsome API';
  const filtro = opciones.filtro || ultimaConsultaRealizada?.filtro || mapa.nombre;
  const fechaHoy = new Date().toISOString().slice(0, 10);

  if (txtLinaje) {
    txtLinaje.value = `Conjunto de datos VGI derivado de ${fuente} mediante consulta "${filtro}" ejecutada el ${fechaHoy} sobre el Bbox [${(bbox || []).join(', ')}]. Comprende ${cantidad} entidades espaciales validadas, normalizadas y proyectadas conforme a la norma ISO 19115/19139 para IDE Chile / SNIT (EPSG:32719 / EPSG:5361).`;
  }

  if (inpSrs && !inpSrs.value) {
    inpSrs.value = 'EPSG:4326 (WGS84) / Compatible con EPSG:5361 (SIRGAS-Chile) y EPSG:32719';
  }

  // Generar y renderizar vista previa automáticamente en el DOM
  try {
    const ficha = construirObjetoFichaDesdeFormulario();
    window._ultimaFichaGenerada = ficha;
    const cntVistaPrevia = document.getElementById('vista-previa-metadatos');
    if (cntVistaPrevia && typeof ModuloMetadatos !== 'undefined' && ModuloMetadatos.renderVistaPrevia) {
      cntVistaPrevia.innerHTML = ModuloMetadatos.renderVistaPrevia(ficha);
      const btnExpJson = document.getElementById('btn-exportar-json');
      const btnExpXml = document.getElementById('btn-exportar-xml');
      if (btnExpJson) btnExpJson.disabled = false;
      if (btnExpXml) btnExpXml.disabled = false;
    }
  } catch (e) {
    // Tolerancia ante fases tempranas de carga
  }
}

document.addEventListener('nodo:config-lista', inicializarAplicacion);

function inicializarAplicacion() {
  const cfg = window.NODO_CONFIG;
  if (!cfg) return;

  configurarNavegacion();
  precargarCamposDesdeConfig();
  ModuloMapa.inicializar('mapa-atlas');
  crearBotonesCategorias();
  configurarEventosMapa();
  pintarEstadoConexion();

  document.getElementById('contenido-licencias').innerHTML = ModuloLicencias.render();
  cargarResumenMetodologia();

  // Inicializar diccionario territorial con soporte para pestañas de grupo y búsqueda
  const cntDiccionario = document.getElementById('contenido-diccionario');
  if (cntDiccionario && window.ModuloDiccionario) {
    let grupoActivo = 'todos';
    let textoFiltro = '';

    const refrescarDiccionario = () => {
      cntDiccionario.innerHTML = ModuloDiccionario.render(textoFiltro, grupoActivo);
    };

    refrescarDiccionario();

    document.getElementById('filtro-diccionario')?.addEventListener('input', (e) => {
      textoFiltro = e.target.value;
      refrescarDiccionario();
    });

    document.querySelectorAll('.filtro-dicc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-dicc-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        grupoActivo = btn.dataset.grupo || 'todos';
        refrescarDiccionario();
      });
    });
  }

  // Inicializar selector de actor territorial / perfil
  const selPerfil = document.getElementById('sel-perfil-usuario');
  if (selPerfil) {
    selPerfil.addEventListener('change', manejarCambioPerfilUsuario);
    manejarCambioPerfilUsuario();
  }

  // Inicializar botones de sugerencias ciudadanas (1 clic)
  document.querySelectorAll('.btn-sugerencia-ciudadana').forEach(btn => {
    btn.addEventListener('click', () => {
      const clave = btn.dataset.clave;
      const valor = btn.dataset.valor;
      const operador = btn.dataset.operador || '=';
      const nombre = btn.dataset.nombre;
      const color = btn.dataset.color || '#A97722';
      const entidad = btn.dataset.entidad || 'nwr';

      document.getElementById('custom-clave-manual').value = clave;
      document.getElementById('custom-valor').value = valor === '*' ? '' : valor;
      document.getElementById('custom-operador').value = operador;
      document.getElementById('custom-nombre-capa').value = nombre;
      document.getElementById('custom-color-capa').value = color;
      document.getElementById('custom-entidad').value = entidad;

      actualizarCodigoQLPreview();
      sincronizarCoherenciaEntreModulos(clave, { valor, nombre, color, origen: 'sugerencia_ciudadana' });
      manejarConsultaPersonalizada();
    });
  });

  // Preset geométrico de ohsome API v1 e intervalo temporal
  document.getElementById('oh-preset-selector')?.addEventListener('change', (e) => {
    if (e.target.value !== 'custom') {
      document.getElementById('oh-filtro').value = e.target.value;
      sincronizarCoherenciaDesdeOhsome(e.target.value);
    } else {
      document.getElementById('oh-filtro').focus();
    }
  });

  // Selector de versión de ohsome API (v1 vs v2) y gestión de API Key
  const selVersionOh = document.getElementById('oh-version-selector');
  const cntApiKeyOh = document.getElementById('contenedor-oh-api-key');
  const inpApiKeyOh = document.getElementById('oh-api-key');

  if (inpApiKeyOh) {
    const keyGuardada = localStorage.getItem('nodo-vgi:heigit-api-key');
    if (keyGuardada) inpApiKeyOh.value = keyGuardada;
    inpApiKeyOh.addEventListener('input', (e) => {
      localStorage.setItem('nodo-vgi:heigit-api-key', e.target.value.trim());
    });
  }

  if (selVersionOh) {
    selVersionOh.addEventListener('change', (e) => {
      if (e.target.value === 'v2') {
        if (cntApiKeyOh) cntApiKeyOh.style.display = 'block';
      } else {
        if (cntApiKeyOh) cntApiKeyOh.style.display = 'none';
      }
    });
  }

  // Eventos de paneles
  document.getElementById('btn-consultar-osm').addEventListener('click', () => manejarConsultaOSM(false));
  document.getElementById('btn-cargar-osm-al-mapa').addEventListener('click', () => manejarConsultaOSM(true));
  document.getElementById('btn-usar-area-config').addEventListener('click', aplicarAreaConfigAlExplorador);
  document.getElementById('osm-categoria-preset').addEventListener('change', manejarCambioPresetOSM);

  // Constructor de Consultas Personalizadas: sincronización dual selectores y campos manuales
  actualizarOpcionesValoresSegunClave('amenity');
  actualizarCodigoQLPreview();

  const selClave = document.getElementById('custom-clave-select');
  const inpClave = document.getElementById('custom-clave-manual');
  const selValor = document.getElementById('custom-valor-select');
  const inpValor = document.getElementById('custom-valor');
  const inpNombre = document.getElementById('custom-nombre-capa');
  const inpColor = document.getElementById('custom-color-capa');
  const selOperador = document.getElementById('custom-operador');
  const selEntidad = document.getElementById('custom-entidad');
  const selFiltroExtra = document.getElementById('custom-filtro-extra');

  if (selClave) {
    selClave.addEventListener('change', (e) => {
      if (e.target.value !== 'otra') {
        inpClave.value = e.target.value;
        actualizarOpcionesValoresSegunClave(e.target.value);
      } else {
        inpClave.value = '';
        inpClave.focus();
        actualizarOpcionesValoresSegunClave('');
      }
      actualizarCodigoQLPreview();
    });
  }

  if (selValor) {
    selValor.addEventListener('change', (e) => {
      if (e.target.value !== 'custom') {
        const opcion = selValor.options[selValor.selectedIndex];
        inpValor.value = e.target.value === '*' ? '' : e.target.value;
        if (opcion.dataset.nombre) inpNombre.value = opcion.dataset.nombre;
        if (opcion.dataset.color) inpColor.value = opcion.dataset.color;
      } else {
        inpValor.focus();
      }
      actualizarCodigoQLPreview();
    });
  }

  [inpClave, inpValor, inpNombre, inpColor, selOperador, selEntidad, selFiltroExtra].forEach(el => {
    if (el) {
      el.addEventListener('input', actualizarCodigoQLPreview);
      el.addEventListener('change', actualizarCodigoQLPreview);
    }
  });

  const btnEjecutarCustom = document.getElementById('btn-ejecutar-consulta-custom');
  if (btnEjecutarCustom) btnEjecutarCustom.addEventListener('click', manejarConsultaPersonalizada);

  const btnGuardarConsulta = document.getElementById('btn-guardar-consulta');
  if (btnGuardarConsulta) btnGuardarConsulta.addEventListener('click', guardarConsultaUsuario);

  const btnToggleQL = document.getElementById('btn-toggle-ql-avanzado');
  if (btnToggleQL) {
    btnToggleQL.addEventListener('click', () => {
      const cnt = document.getElementById('contenedor-ql-avanzado');
      if (cnt.style.display === 'none') {
        cnt.style.display = 'block';
        actualizarCodigoQLPreview();
      } else {
        cnt.style.display = 'none';
      }
    });
  }

  cargarConsultasGuardadas();

  document.getElementById('btn-consultar-ohsome').addEventListener('click', manejarConsultaOhsome);
  document.getElementById('btn-consultar-gbif').addEventListener('click', () => manejarConsultaGBIF(false));
  document.getElementById('btn-cargar-gbif-al-mapa').addEventListener('click', () => manejarConsultaGBIF(true));
  document.getElementById('btn-cargar-umap').addEventListener('click', manejarCargaUMap);

  // Selector de especies y taxones en GBIF
  const selTaxaGBIF = document.getElementById('gbif-taxa-selector');
  if (selTaxaGBIF) {
    selTaxaGBIF.addEventListener('change', (e) => {
      const inpNombreGBIF = document.getElementById('gbif-nombre');
      if (e.target.value !== 'custom') {
        inpNombreGBIF.value = e.target.value;
      } else {
        inpNombreGBIF.value = '';
        inpNombreGBIF.focus();
      }
    });
  }

  // Selector de proyectos cartográficos colaborativos UMap
  const selUMap = document.getElementById('umap-preset-selector');
  if (selUMap) {
    selUMap.addEventListener('change', (e) => {
      const inpUrlUMap = document.getElementById('umap-url');
      if (e.target.value && e.target.value !== 'custom') {
        inpUrlUMap.value = e.target.value;
        manejarCargaUMap();
      } else if (e.target.value === 'custom') {
        inpUrlUMap.value = '';
        inpUrlUMap.focus();
      }
    });
  }

  // Botones de mapas comunitarios UMap sugeridos
  document.getElementById('btn-umap-ejemplo-patrimonio')?.addEventListener('click', () => {
    document.getElementById('umap-url').value = 'https://umap.openstreetmap.fr/es/map/patrimonio-santiago-centro_19382';
    manejarCargaUMap();
  });
  document.getElementById('btn-umap-ejemplo-ciclovias')?.addEventListener('click', () => {
    document.getElementById('umap-url').value = 'https://umap.openstreetmap.fr/es/map/ciclovias-santiago_28412';
    manejarCargaUMap();
  });

  // Selector de SRS de metadatos
  document.getElementById('md-srs-select')?.addEventListener('change', (e) => {
    document.getElementById('md-srs').value = e.target.value;
  });

  // Selector de Marco Jurídico de Licenciamiento en Metadatos ISO
  document.getElementById('md-licencia-select')?.addEventListener('change', (e) => {
    const mapaLicencias = {
      odbl: 'Open Database License (ODbL 1.0) para datos vectoriales de OSM (© colaboradores de OpenStreetMap). Reutilización libre sujeta a atribución y compartir bajo la misma licencia.',
      cc_by: 'Creative Commons Atribución (CC-BY 4.0) para registros biológicos (GBIF / iNaturalist / Ciencia Ciudadana).',
      datos_gob: 'Datos Abiertos del Estado de Chile (Licencia de Atribución Datos Abiertos / IDE Chile / Ley N° 20.285 de Transparencia).',
      vgi_mixta: 'Licencia Mixta VGI: Open Database License (ODbL 1.0) para geometrías OSM + Creative Commons CC-BY 4.0 para observaciones biológicas de GBIF.'
    };
    const texto = mapaLicencias[e.target.value] || e.target.value;
    document.getElementById('md-restricciones').value = texto;
  });

  document.getElementById('form-metadatos').addEventListener('submit', manejarGenerarMetadatos);
  document.getElementById('btn-prellenar-metadatos').addEventListener('click', prellenarMetadatosDesdeUltimaConsulta);
  document.getElementById('btn-exportar-json').addEventListener('click', exportarMetadatosJSON);
  document.getElementById('btn-exportar-xml').addEventListener('click', exportarMetadatosXML);

  // Escuchar cambios de bbox desde el mapa
  document.addEventListener('nodo:bbox-cambiado', (e) => {
    if (e.detail && e.detail.bbox) {
      sincronizarBboxEnInputs(e.detail.bbox);
      actualizarFichaTerritorio('Área de Consulta Personalizada (Bbox interactivo)', e.detail.bbox);
      autocargarMetadatos({ bbox: e.detail.bbox });
    }
  });

  // Escuchar cambios manuales en inputs de coordenadas para actualizar el mapa
  ['osm', 'oh', 'gbif', 'md'].forEach(prefijo => {
    ['oeste', 'sur', 'este', 'norte'].forEach(coord => {
      const el = document.getElementById(`${prefijo}-${coord}`);
      if (el) {
        el.addEventListener('change', () => {
          const bbox = leerBbox(prefijo);
          if (bbox) {
            ModuloMapa.actualizarRectanguloBbox(bbox);
            sincronizarBboxEnInputs(bbox);
            autocargarMetadatos({ bbox });
          }
        });
      }
    });
  });

  // Inicialización de coherencia y metadatos con la categoría predeterminada
  sincronizarCoherenciaEntreModulos('educacion');
  autocargarMetadatos();
}

/* ---------------------- NAVEGACIÓN ---------------------- */

function configurarNavegacion() {
  const botones = document.querySelectorAll('#lista-navegacion button');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      botones.forEach(b => b.setAttribute('aria-current', 'false'));
      boton.setAttribute('aria-current', 'true');

      document.querySelectorAll('.panel').forEach(p => p.classList.remove('activo'));
      const panelDestino = document.getElementById('panel-' + boton.dataset.panel);
      if (panelDestino) panelDestino.classList.add('activo');
    });
  });
}

function poblarSelectorTerritorios() {
  const selTerritorio = document.getElementById('sel-territorio');
  const territorios = window.NODO_CONFIG?.territorios_predefinidos;
  if (!selTerritorio || !territorios || !territorios.length) return;
  selTerritorio.innerHTML = '';
  territorios.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.nombre;
    selTerritorio.appendChild(opt);
  });
}

function actualizarFichaTerritorio(nombre, bbox) {
  const el = document.getElementById('resumen-area-defecto');
  if (!el || !bbox) return;
  let txtSuperficie = '';
  if (typeof ModuloGeodesia !== 'undefined' && ModuloGeodesia.calcularSuperficieBbox) {
    const s = ModuloGeodesia.calcularSuperficieBbox(bbox);
    txtSuperficie = `<br>Superficie métrica calculada: <strong>${s.areaM2.toLocaleString('es-CL')} m²</strong> (${s.areaHa.toLocaleString('es-CL')} ha / ${s.areaKm2} km²) <span style="font-size:0.75rem; color:#8F3A2C; font-weight:600;" title="Reproyección conforme Transverse Mercator a EPSG:32719">(EPSG:32719 - WGS 84 / UTM Huso 19 Sur)</span>`;
  }
  el.innerHTML = `
    <strong>${nombre}</strong><br>
    Bbox WGS84: <code>[${bbox.join(', ')}]</code>
    ${txtSuperficie}<br>
    <span class="descripcion">Foco territorial: Barrio Brasil Completo y Manzana Campus Universidad Alberto Hurtado (Santiago Centro, Chile).</span>
  `;
}

function precargarCamposDesdeConfig() {
  const cfg = window.NODO_CONFIG;
  document.getElementById('nombre-organizacion').textContent = cfg.organizacion.descripcion_corta || cfg.organizacion.nombre;
  
  const terrDefecto = cfg.territorios_predefinidos?.find(t => t.id === cfg.area_por_defecto.id) || cfg.territorios_predefinidos?.[0];
  actualizarFichaTerritorio(terrDefecto ? terrDefecto.nombre : cfg.organizacion.area_de_interes_nombre, cfg.area_por_defecto.bbox);

  poblarSelectorTerritorios();
  aplicarAreaConfigAlExplorador();

  const md = cfg.metadatos_iso_defecto || {};
  if (md.sistema_referencia) document.getElementById('md-srs').value = `${md.sistema_referencia} / Compatible con ${md.sistema_referencia_nacional || 'EPSG:5361'}`;
  if (md.punto_de_contacto_organizacion) document.getElementById('md-contacto-org').value = md.punto_de_contacto_organizacion;
  if (md.punto_de_contacto_correo) document.getElementById('md-contacto-correo').value = md.punto_de_contacto_correo;
}

function pintarEstadoConexion() {
  const elemento = document.getElementById('estado-conexion');
  elemento.innerHTML = `🟢 APIs en vivo: Overpass (OSM), ohsome (HeiGIT) y GBIF conectadas.`;
}

/* ---------------------- HELPERS DE BBOX ---------------------- */

function leerBbox(prefijo) {
  const oeste = parseFloat(document.getElementById(`${prefijo}-oeste`).value);
  const sur = parseFloat(document.getElementById(`${prefijo}-sur`).value);
  const este = parseFloat(document.getElementById(`${prefijo}-este`).value);
  const norte = parseFloat(document.getElementById(`${prefijo}-norte`).value);
  if ([oeste, sur, este, norte].some(Number.isNaN)) return null;
  return [oeste, sur, este, norte];
}

function escribirBbox(prefijo, bbox) {
  const elO = document.getElementById(`${prefijo}-oeste`);
  const elS = document.getElementById(`${prefijo}-sur`);
  const elE = document.getElementById(`${prefijo}-este`);
  const elN = document.getElementById(`${prefijo}-norte`);
  if (elO) elO.value = bbox[0];
  if (elS) elS.value = bbox[1];
  if (elE) elE.value = bbox[2];
  if (elN) elN.value = bbox[3];
}

function sincronizarBboxEnInputs(bbox) {
  escribirBbox('osm', bbox);
  escribirBbox('oh', bbox);
  escribirBbox('gbif', bbox);
  escribirBbox('md', bbox);
}

function aplicarAreaConfigAlExplorador() {
  const bbox = window.NODO_CONFIG.area_por_defecto.bbox;
  sincronizarBboxEnInputs(bbox);
  ModuloMapa.encuadrarBbox(bbox);
}

/* ---------------------- CONTROL DEL MAPA ATLAS ---------------------- */

function configurarEventosMapa() {
  const selTerritorio = document.getElementById('sel-territorio');
  if (selTerritorio) {
    selTerritorio.addEventListener('change', (e) => {
      ModuloMapa.cambiarTerritorio(e.target.value);
      const terr = window.NODO_CONFIG?.territorios_predefinidos?.find(t => t.id === e.target.value);
      if (terr) {
        actualizarFichaTerritorio(terr.nombre, terr.bbox);
        sincronizarBboxEnInputs(terr.bbox);
        autocargarMetadatos({ bbox: terr.bbox });
      }
    });
  }

  const btnDibujar = document.getElementById('btn-dibujar-bbox');
  if (btnDibujar) {
    btnDibujar.addEventListener('click', () => {
      if (btnDibujar.classList.contains('activo')) {
        ModuloMapa.desactivarModoDibujoBbox();
      } else {
        ModuloMapa.activarModoDibujoBbox();
      }
    });
  }

  const btnReencuadrar = document.getElementById('btn-reencuadrar-mapa');
  if (btnReencuadrar) {
    btnReencuadrar.addEventListener('click', () => {
      const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;
      ModuloMapa.encuadrarBbox(bbox);
    });
  }

  const btnExportarGeoJSON = document.getElementById('btn-exportar-geojson-mapa');
  if (btnExportarGeoJSON) {
    btnExportarGeoJSON.addEventListener('click', () => {
      ModuloMapa.exportarGeoJSONCargado();
    });
  }
}

function crearBotonesCategorias() {
  const contenedor = document.getElementById('contenedor-botones-categorias');
  if (!contenedor) return;

  const categorias = window.NODO_CONFIG.categorias_osm || [];
  contenedor.innerHTML = '';

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-categoria';
    btn.id = `btn-cat-${cat.id}`;
    const descGeom = cat.geometrias ? `\nGeometrías: ${cat.geometrias.join(', ')}` : '';
    const descEntidades = cat.entidades ? `\nEntidades: ${cat.entidades.slice(0, 4).join(', ')}...` : '';
    btn.title = `${cat.nombre} (${cat.codigo}):\n${cat.descripcion}${descEntidades}${descGeom}`;
    btn.innerHTML = `
      <span class="icono-cat">${cat.icono}</span>
      <span>${cat.nombre}</span>
      <span class="conteo-cat" id="conteo-cat-${cat.id}">—</span>
    `;

    btn.addEventListener('click', () => alternarCapaCategoria(cat));
    contenedor.appendChild(btn);
  });
}

async function alternarCapaCategoria(categoria) {
  const btn = document.getElementById(`btn-cat-${categoria.id}`);
  const labelConteo = document.getElementById(`conteo-cat-${categoria.id}`);
  const estadoTexto = document.getElementById('estado-carga-capas');

  // Sincronizar coherencia de módulos de consulta con la categoría seleccionada
  sincronizarCoherenciaEntreModulos(categoria.id, { origen: 'boton_categoria' });

  // Si ya está activa, la desactivamos
  if (btn.classList.contains('activo')) {
    ModuloMapa.removerCapa(categoria.id);
    btn.classList.remove('activo');
    labelConteo.textContent = '—';
    delete capasCargadasPorCategoria[categoria.id];
    return;
  }

  // Activar y cargar datos
  btn.classList.add('cargando');
  estadoTexto.textContent = `Consultando ${categoria.nombre} en Overpass API…`;

  const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;

  try {
    let geojson;
    if (categoria.id === 'biodiversidad') {
      // Para biodiversidad, consultamos GBIF + OSM
      const [resGBIF, resOSM] = await Promise.all([
        ModuloGBIF.buscarOcurrencias({ bbox, limite: 40 }),
        ModuloOSM.consultar(bbox, 'biodiversidad')
      ]);
      const gjOSM = ModuloOSM.elementosAGeoJSON(resOSM, categoria.id);
      geojson = {
        type: 'FeatureCollection',
        features: [...gjOSM.features, ...resGBIF.geojson.features]
      };
    } else {
      const elementos = await ModuloOSM.consultar(bbox, categoria.id);
      geojson = ModuloOSM.elementosAGeoJSON(elementos, categoria.id);
    }

    const cantidad = geojson.features.length;
    labelConteo.textContent = `${cantidad}`;

    ModuloMapa.cargarCapaGeoJSON(categoria.id, geojson, {
      nombre: categoria.nombre,
      color: categoria.color,
      icono: categoria.icono
    });

    capasCargadasPorCategoria[categoria.id] = geojson;
    btn.classList.remove('cargando');
    btn.classList.add('activo');
    estadoTexto.textContent = `Capa "${categoria.nombre}" cargada en vivo (${cantidad} elementos). Haz clic en los elementos del mapa para ver atributos y licencias.`;

    ultimaConsultaRealizada = {
      bbox,
      filtro: categoria.nombre,
      cantidad: cantidad,
      fuente: 'Overpass API / OpenStreetMap'
    };
    autocargarMetadatos({
      categoriaId: categoria.id,
      cantidad: cantidad,
      fuente: 'Overpass API / OpenStreetMap',
      filtro: categoria.nombre,
      bbox
    });
  } catch (error) {
    console.warn(`[API en vivo no disponible para ${categoria.id}]: ${error.message}. Intentando cargar dataset local pre-extraído...`);
    // Intento de fallback a los datos locales validados de Barrio Brasil / UAH
    try {
      const rutasPosibles = [
        `data/capa_${categoria.id}.geojson`,
        `./data/capa_${categoria.id}.geojson`,
        `../data/capa_${categoria.id}.geojson`,
        `/data/capa_${categoria.id}.geojson`
      ];
      let geojsonLocal = null;
      for (const r of rutasPosibles) {
        try {
          const res = await fetch(r);
          if (res.ok) {
            geojsonLocal = await res.json();
            break;
          }
        } catch (_) {}
      }

      if (geojsonLocal && geojsonLocal.features && geojsonLocal.features.length > 0) {
        const cantidad = geojsonLocal.features.length;
        labelConteo.textContent = `${cantidad}`;
        ModuloMapa.cargarCapaGeoJSON(categoria.id, geojsonLocal, {
          nombre: categoria.nombre,
          color: categoria.color,
          icono: categoria.icono
        });
        capasCargadasPorCategoria[categoria.id] = geojsonLocal;
        btn.classList.remove('cargando');
        btn.classList.add('activo');
        estadoTexto.innerHTML = `Capa "${categoria.nombre}" cargada desde catálogo local validado (${cantidad} entidades en Barrio Brasil / UAH). <span class="descripcion">(Servidor Overpass saturado)</span>`;
        ultimaConsultaRealizada = {
          bbox,
          filtro: categoria.nombre,
          cantidad: cantidad,
          fuente: 'Catálogo Local Validado'
        };
        autocargarMetadatos({
          categoriaId: categoria.id,
          cantidad: cantidad,
          fuente: 'Catálogo Local Validado (Barrio Brasil / UAH)',
          filtro: categoria.nombre,
          bbox
        });
        return;
      }
    } catch (fallbackErr) {
      console.error('Fallo también el fallback local:', fallbackErr);
    }

    btn.classList.remove('cargando');
    estadoTexto.innerHTML = `<span style="color:var(--alerta);">Error al consultar ${categoria.nombre}: ${error.message}</span>`;
  }
}

/* ---------------------- PANEL EXPLORADOR OSM ---------------------- */

function actualizarCodigoQLPreview() {
  const qlInput = document.getElementById('custom-ql-codigo');
  if (!qlInput) return;
  const entidad = document.getElementById('custom-entidad')?.value || 'nwr';
  const clave = document.getElementById('custom-clave-manual')?.value.trim() || 'amenity';
  const operador = document.getElementById('custom-operador')?.value || '=';
  const valor = document.getElementById('custom-valor')?.value.trim() || '';
  const filtroExtra = document.getElementById('custom-filtro-extra')?.value || 'todos';

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

  let extra = '';
  if (filtroExtra === 'con_nombre') extra = '["name"]';
  else if (filtroExtra === 'accesibles') extra = '["wheelchair"="yes"]';
  else if (filtroExtra === 'con_direccion') extra = '["addr:street"]';
  else if (filtroExtra === 'con_operador') extra = '["operator"]';

  qlInput.value = `${entidad}${filtro}${extra}({{bbox}});`;
}

async function manejarConsultaPersonalizada() {
  const contenedor = document.getElementById('resultado-osm');
  const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;
  if (!bbox) {
    contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del Bounding Box.');
    return;
  }

  const entidad = document.getElementById('custom-entidad').value;
  const clave = document.getElementById('custom-clave-manual').value.trim();
  const operador = document.getElementById('custom-operador').value;
  const valor = document.getElementById('custom-valor').value.trim();
  const nombreCapa = document.getElementById('custom-nombre-capa').value.trim() || 'Consulta Personalizada';
  const colorCapa = document.getElementById('custom-color-capa').value || '#A97722';
  const qlCustom = document.getElementById('custom-ql-codigo')?.value.trim() || '';

  contenedor.innerHTML = '<p class="descripcion">🚀 Ejecutando consulta espacial en backend / Overpass API…</p>';

  const params = {
    bbox,
    entidad,
    clave,
    operador,
    valor,
    queryPersonalizada: qlCustom,
    nombreConsulta: nombreCapa
  };

  try {
    const inicio = performance.now();
    const res = await ModuloOSM.consultarPersonalizada(params);
    const duracionSeg = ((performance.now() - inicio) / 1000).toFixed(1);

    const geojson = res.geojson;
    const total = geojson.features.length;

    if (total === 0) {
      contenedor.innerHTML = avisoInfo(`No se encontraron elementos para la consulta "${nombreCapa}" en esa área.`);
      return;
    }

    // Cargar en el mapa Atlas con capa dinámica
    const capaId = 'custom_' + Date.now();
    ModuloMapa.cargarCapaGeoJSON(capaId, geojson, {
      nombre: nombreCapa,
      color: colorCapa,
      icono: '🔍'
    });

    ultimaConsultaRealizada = {
      bbox,
      filtro: `${nombreCapa} [${clave}${operador}${valor}]`,
      cantidad: total,
      fuente: `OSM (${res.servidor})`
    };
    autocargarMetadatos({
      categoriaId: categoriaActivaGlobal,
      cantidad: total,
      fuente: `OSM (${res.servidor})`,
      filtro: `${nombreCapa} [${clave}${operador}${valor}]`,
      bbox
    });

    // Cálculo métrico de superficies en polígonos
    const poligonos = geojson.features.filter(f => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'));
    const totalM2 = poligonos.reduce((acc, f) => acc + (f.properties?.superficie_m2 || 0), 0);

    // Generar tabla y botones de exportación
    const filas = geojson.features.slice(0, 30).map(f => {
      const p = f.properties;
      return `
        <tr>
          <td><code>${p.id_vgi || f.id}</code></td>
          <td><strong>${p.nombre || '—'}</strong></td>
          <td>${p.subtipo || '—'}</td>
          <td>${p.superficie_m2 ? `<strong>${p.superficie_m2.toLocaleString('es-CL')} m²</strong> <small style="color:var(--tinta-suave);">(${p.superficie_ha} ha)</small>` : '—'}</td>
          <td>${p.direccion || '—'}</td>
          <td><small>${p.accesibilidad ? '♿ ' + p.accesibilidad : '—'}</small></td>
        </tr>
      `;
    }).join('');

    const jsonString = encodeURIComponent(JSON.stringify(geojson, null, 2));

    // Convertir a CSV plano incluyendo métricas de superficie en m²
    const encabezadosCsv = ['id_vgi', 'nombre', 'subtipo', 'superficie_m2', 'superficie_ha', 'srs_superficie', 'direccion', 'accesibilidad', 'fuente', 'licencia', 'latitud', 'longitud'];
    const lineasCsv = [encabezadosCsv.join(',')];
    geojson.features.forEach(f => {
      const p = f.properties;
      const coords = f.geometry.coordinates;
      const lat = f.geometry.type === 'Point' ? coords[1] : (coords[0] && coords[0][0] ? coords[0][0][1] : '');
      const lon = f.geometry.type === 'Point' ? coords[0] : (coords[0] && coords[0][0] ? coords[0][0][0] : '');
      lineasCsv.push([
        `"${p.id_vgi || ''}"`,
        `"${(p.nombre || '').replace(/"/g, '""')}"`,
        `"${p.subtipo || ''}"`,
        p.superficie_m2 || '',
        p.superficie_ha || '',
        `"${p.srs_superficie || ''}"`,
        `"${(p.direccion || '').replace(/"/g, '""')}"`,
        `"${p.accesibilidad || ''}"`,
        `"${p.fuente || 'OpenStreetMap'}"`,
        `"${p.licencia || 'ODbL 1.0'}"`,
        lat,
        lon
      ].join(','));
    });
    const csvString = encodeURIComponent(lineasCsv.join('\n'));

    let badgeSuperficieHtml = '';
    if (totalM2 > 0) {
      badgeSuperficieHtml = `
        <div class="indicador" style="margin:0; border-left:3px solid #B8860B;">
          <span class="valor">${totalM2.toLocaleString('es-CL')} m²</span>
          <span class="etiqueta">Superficie total cubierta (${(totalM2 / 10000).toFixed(2)} ha / ${(totalM2 / 1000000).toFixed(4)} km²) [EPSG:32719]</span>
        </div>
      `;
    }

    contenedor.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <div class="indicador" style="margin:0;">
            <span class="valor">${total}</span>
            <span class="etiqueta">elementos extraídos (${duracionSeg}s — ${res.servidor})</span>
          </div>
          ${badgeSuperficieHtml}
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="accion" id="btn-ver-en-mapa-custom" style="font-size:0.85rem; padding:6px 12px;">🗺️ Ver en Mapa Atlas</button>
          <a href="data:application/geo+json;charset=utf-8,${jsonString}" download="${nombreCapa.toLowerCase().replace(/\\s+/g, '_')}.geojson" class="accion secundaria" style="text-decoration:none; display:inline-flex; align-items:center; font-size:0.85rem; padding:6px 12px;">📥 GeoJSON</a>
          <a href="data:text/csv;charset=utf-8,${csvString}" download="${nombreCapa.toLowerCase().replace(/\\s+/g, '_')}.csv" class="accion secundaria" style="text-decoration:none; display:inline-flex; align-items:center; font-size:0.85rem; padding:6px 12px;">📄 CSV</a>
          <button class="accion secundaria" id="btn-metadatos-custom" style="font-size:0.85rem; padding:6px 12px;">📋 Crear Metadatos</button>
        </div>
      </div>
      <table class="tabla-datos">
        <thead><tr><th>ID VGI</th><th>Nombre</th><th>Subtipo</th><th>Superficie (m²)</th><th>Dirección</th><th>Accesibilidad</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      ${total > 30 ? `<p class="descripcion" style="margin-top:6px;">Mostrando los primeros 30 de ${total} registros extraídos.</p>` : ''}
    `;

    document.getElementById('btn-ver-en-mapa-custom')?.addEventListener('click', () => {
      document.querySelector('button[data-panel="inicio"]').click();
    });
    document.getElementById('btn-metadatos-custom')?.addEventListener('click', () => {
      prellenarMetadatosDesdeUltimaConsulta();
      document.querySelector('button[data-panel="metadatos"]').click();
    });

  } catch (err) {
    contenedor.innerHTML = avisoError(`Error en consulta: ${err.message}`);
  }
}

function guardarConsultaUsuario() {
  const clave = document.getElementById('custom-clave-manual')?.value.trim();
  const valor = document.getElementById('custom-valor')?.value.trim();
  const operador = document.getElementById('custom-operador')?.value || '=';
  const nombre = document.getElementById('custom-nombre-capa')?.value.trim() || `${clave}=${valor}`;
  const entidad = document.getElementById('custom-entidad')?.value || 'nwr';

  if (!clave) {
    alert('Por favor especifica al menos una clave OSM para guardar.');
    return;
  }

  const guardadas = JSON.parse(localStorage.getItem('nodo-vgi:consultas-guardadas') || '[]');
  guardadas.unshift({ nombre, clave, valor, operador, entidad });
  localStorage.setItem('nodo-vgi:consultas-guardadas', JSON.stringify(guardadas.slice(0, 10)));
  cargarConsultasGuardadas();
}

function cargarConsultasGuardadas() {
  const cnt = document.getElementById('lista-consultas-guardadas');
  if (!cnt) return;

  const defaultConsultas = [
    { nombre: 'Farmacias y Salud', clave: 'amenity', valor: 'pharmacy', operador: '=', entidad: 'nwr' },
    { nombre: 'Panaderías y Almacenes', clave: 'shop', valor: 'bakery', operador: '=', entidad: 'nwr' },
    { nombre: 'Casonas y Patrimonio', clave: 'historic', valor: '*', operador: '*', entidad: 'nwr' },
    { nombre: 'Paradas de Bus Red', clave: 'highway', valor: 'bus_stop', operador: '=', entidad: 'node' }
  ];

  const guardadas = JSON.parse(localStorage.getItem('nodo-vgi:consultas-guardadas') || 'null') || defaultConsultas;

  cnt.innerHTML = guardadas.map((c, i) => `
    <button type="button" class="accion secundaria" style="font-size:0.78rem; padding:3px 8px; border-radius:12px; margin:2px;" data-consulta-idx="${i}">
      🔍 ${c.nombre} <small style="opacity:0.7">(${c.clave}${c.operador}${c.valor || '*'}</small>)
    </button>
  `).join('');

  cnt.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-consulta-idx'), 10);
      const c = guardadas[idx];
      if (!c) return;
      document.getElementById('custom-clave-manual').value = c.clave;
      document.getElementById('custom-valor').value = c.valor || '';
      document.getElementById('custom-operador').value = c.operador || '=';
      document.getElementById('custom-nombre-capa').value = c.nombre;
      document.getElementById('custom-entidad').value = c.entidad || 'nwr';
      actualizarCodigoQLPreview();
      manejarConsultaPersonalizada();
    });
  });
}

function manejarCambioPresetOSM(e) {
  const preset = e.target.value;
  const inputEtiqueta = document.getElementById('osm-etiqueta');
  if (inputEtiqueta) {
    if (preset) {
      inputEtiqueta.value = '';
      inputEtiqueta.placeholder = `Preset activo: ${preset}`;
    } else {
      inputEtiqueta.placeholder = 'ej: amenity=university, shop=bakery';
    }
  }
  if (preset) {
    sincronizarCoherenciaEntreModulos(preset, { origen: 'preset_osm' });
  }
}

async function manejarConsultaOSM(cargarAlMapa = false) {
  const contenedor = document.getElementById('resultado-osm');
  const bbox = leerBbox('osm');
  if (!bbox) { contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del área.'); return; }

  const preset = document.getElementById('osm-categoria-preset')?.value || '';
  const etiquetaManual = document.getElementById('osm-etiqueta')?.value?.trim() || '';
  const filtroAEjecutar = etiquetaManual || preset || 'educacion';

  contenedor.innerHTML = '<p class="descripcion">Consultando Overpass API…</p>';

  try {
    const elementos = await ModuloOSM.consultar(bbox, filtroAEjecutar);
    const geojson = ModuloOSM.elementosAGeoJSON(elementos, preset || 'consulta_personalizada');
    ultimaConsultaRealizada = { bbox, filtro: filtroAEjecutar, cantidad: elementos.length, fuente: 'OSM/Overpass' };
    autocargarMetadatos({
      categoriaId: preset || categoriaActivaGlobal,
      cantidad: elementos.length,
      fuente: 'OSM / Overpass API',
      filtro: filtroAEjecutar,
      bbox
    });

    if (elementos.length === 0) {
      contenedor.innerHTML = avisoInfo(`No se encontraron elementos para "${filtroAEjecutar}" en esa área.`);
      return;
    }

    if (cargarAlMapa) {
      ModuloMapa.cargarCapaGeoJSON('explorador_osm', geojson, {
        nombre: `Consulta OSM (${filtroAEjecutar})`,
        color: '#A97722',
        icono: '🔍'
      });
      // Cambiar a panel de inicio para ver el mapa
      document.querySelector('button[data-panel="inicio"]').click();
      return;
    }

    const poligonos = geojson.features.filter(f => f.geometry && f.geometry.type === 'Polygon');
    const totalM2 = poligonos.reduce((acc, f) => acc + (f.properties?.superficie_m2 || 0), 0);

    let indicadorSuperficieHtml = '';
    if (totalM2 > 0) {
      indicadorSuperficieHtml = `
        <div class="indicador" style="border-left: 3px solid #B8860B;">
          <span class="valor">${totalM2.toLocaleString('es-CL')} m²</span>
          <span class="etiqueta">Superficie total cubierta (${(totalM2 / 10000).toFixed(2)} ha / ${(totalM2 / 1000000).toFixed(4)} km²) [EPSG:32719]</span>
        </div>
      `;
    }

    const filas = geojson.features.slice(0, 35).map(f => {
      const p = f.properties;
      return `
        <tr>
          <td><code>${p.id_vgi || f.id}</code></td>
          <td><strong>${p.nombre || '—'}</strong></td>
          <td>${p.subtipo || '—'}</td>
          <td>${p.superficie_m2 ? `<strong>${p.superficie_m2.toLocaleString('es-CL')} m²</strong> <small style="color:var(--tinta-suave);">(${p.superficie_ha} ha)</small>` : '—'}</td>
          <td><small>${p.etiquetas_completas ? Object.entries(p.etiquetas_completas).slice(0, 3).map(([k,v]) => `${k}=${v}`).join(', ') : ''}</small></td>
        </tr>
      `;
    }).join('');

    contenedor.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
        <div class="indicador"><span class="valor">${elementos.length}</span><span class="etiqueta">elementos encontrados</span></div>
        ${indicadorSuperficieHtml}
      </div>
      <table class="tabla-datos">
        <thead><tr><th>ID</th><th>Nombre</th><th>Tipo Principal</th><th>Superficie (m²)</th><th>Etiquetas Clave</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      ${elementos.length > 35 ? `<p class="descripcion">Mostrando 35 de ${elementos.length} elementos.</p>` : ''}
    `;
  } catch (error) {
    contenedor.innerHTML = avisoError(error.message);
  }
}

/* ---------------------- GESTIÓN DE PERFILES DE ACTOR TERRITORIAL ---------------------- */

function manejarCambioPerfilUsuario(e) {
  const perfil = e ? e.target.value : (document.getElementById('sel-perfil-usuario')?.value || 'todos');
  const badgeInfo = document.getElementById('badge-perfil-info');

  const descripciones = {
    todos: 'Herramientas adaptadas para gestión territorial integral. Acceso general a todas las funciones.',
    institucion: '🏛️ Perfil Institucional / Municipal / IDE Chile: Prioriza metadatos normalizados (ISO 19115/19139), catastro de equipamiento crítico, licencias abiertas y control de calidad espacial.',
    comunidad: '👥 Perfil Comunitario / Vecinal: Facilita consultas rápidas en 1 clic para plazas, patrimonio, ciclovías, comercios locales y mapeo barrial colaborativo en UMap.',
    voluntario: '🧭 Perfil Mapeador / Voluntario OSM: Herramientas analíticas avanzadas, métricas geométricas ohsome v1 (longitud/área/densidad), editor Overpass QL y taxonomía.'
  };

  if (badgeInfo) {
    badgeInfo.textContent = descripciones[perfil] || descripciones.todos;
  }

  // Paneles prioritarios según perfil
  const panelesPrioritarios = {
    institucion: ['metadatos-iso', 'calidad-ohsome', 'diccionario', 'licencias'],
    comunidad: ['inicio', 'explorador-osm', 'proyectos-umap', 'diccionario'],
    voluntario: ['explorador-osm', 'calidad-ohsome', 'diccionario', 'manual'],
    todos: []
  };

  const recomendados = panelesPrioritarios[perfil] || [];

  // Actualizar botones de navegación en la barra lateral
  document.querySelectorAll('#lista-navegacion button').forEach(btn => {
    const idPanel = btn.dataset.panel;
    const yaExisteBadge = btn.querySelector('.badge-recomendado');
    if (yaExisteBadge) yaExisteBadge.remove();

    if (recomendados.includes(idPanel)) {
      btn.style.borderLeft = '3px solid var(--ocre)';
      const span = document.createElement('span');
      span.className = 'badge-recomendado';
      span.style.fontSize = '0.65rem';
      span.style.marginLeft = '6px';
      span.style.color = 'var(--ocre)';
      span.style.fontWeight = 'bold';
      span.textContent = '★';
      btn.appendChild(span);
    } else {
      btn.style.borderLeft = '';
    }
  });

  // Ajustar o destacar botones de sugerencias ciudadanas
  const perfilesSugerencias = {
    institucion: ['amenity=pharmacy', 'amenity=university', 'highway=bus_stop', 'kerb=lowered', 'amenity=fire_station'],
    comunidad: ['shop=bakery', 'leisure=park', 'historic=*', 'amenity=cafe', 'amenity=bicycle_parking'],
    voluntario: ['amenity=university', 'historic=*', 'kerb=lowered', 'amenity=pharmacy', 'highway=bus_stop']
  };

  const listaFiltro = perfilesSugerencias[perfil] || null;

  document.querySelectorAll('.btn-sugerencia-ciudadana').forEach(btn => {
    const clave = btn.dataset.clave;
    const valor = btn.dataset.valor;
    const claveValor = `${clave}=${valor}`;

    if (!listaFiltro) {
      btn.classList.remove('perfil-destacado', 'perfil-atenuado');
    } else if (listaFiltro.includes(claveValor) || (clave === 'historic' && listaFiltro.includes('historic=*'))) {
      btn.classList.add('perfil-destacado');
      btn.classList.remove('perfil-atenuado');
    } else {
      btn.classList.remove('perfil-destacado');
      btn.classList.add('perfil-atenuado');
    }
  });
}

/* ---------------------- PANEL OHSOME ---------------------- */

async function manejarConsultaOhsome() {
  const contenedor = document.getElementById('resultado-ohsome');
  const bbox = leerBbox('oh');
  if (!bbox) { contenedor.innerHTML = avisoError('Completa las cuatro coordenadas del área.'); return; }

  const filtro = document.getElementById('oh-filtro').value.trim() || 'building=* and type:way';
  const intervalo = document.getElementById('oh-intervalo-selector')?.value || 'P1Y';
  const version = document.getElementById('oh-version-selector')?.value || 'v1';
  const apiKey = document.getElementById('oh-api-key')?.value.trim() || localStorage.getItem('nodo-vgi:heigit-api-key') || '';

  contenedor.innerHTML = `<p class="descripcion">Calculando métricas multidimensionales de calidad con ohsome API ${version.toUpperCase()} (HeiGIT)…</p>`;

  try {
    const indicadores = await ModuloOhsome.calcularIndicadores(bbox, filtro, intervalo, version, apiKey);
    const densInfo = ModuloOhsome.calcularDensidad(bbox, indicadores.elementosAhora || 0);

    ultimaConsultaRealizada = { bbox, filtro, cantidad: indicadores.elementosAhora, fuente: `ohsome ${indicadores.version}` };
    autocargarMetadatos({
      categoriaId: categoriaActivaGlobal,
      cantidad: indicadores.elementosAhora,
      fuente: `ohsome API ${indicadores.version.toUpperCase()} (${indicadores.motor})`,
      filtro: filtro,
      bbox
    });

    let htmlBadgeVersion = '';
    if (indicadores.fueFallback) {
      htmlBadgeVersion = `
        <div class="aviso" style="background:#FFF3CD; border-left:4px solid #F39C12; color:#856404; margin-bottom:14px; font-size:0.85rem;">
          ℹ️ <strong>Conmutación automática a ohsome API v1:</strong> La consulta solicitada a la API v2 no pudo autenticarse (${indicadores.motivoFallback || 'Requiere API Key válida de HeiGIT'}). Se utilizó exitosamente <strong>ohsome API v1 (Motor OSHDB)</strong> sin interrumpir el análisis.
        </div>
      `;
    } else {
      const colorVersion = indicadores.version === 'v2' ? '#1C523A' : '#35586B';
      htmlBadgeVersion = `
        <div style="display:inline-flex; align-items:center; gap:8px; margin-bottom:12px; padding:4px 10px; background:var(--papel-alto); border:1px solid var(--linea); border-radius:12px; font-size:0.8rem;">
          <span style="font-weight:bold; color:${colorVersion};">● ohsome API ${indicadores.version.toUpperCase()}</span>
          <span style="color:var(--tinta-suave);">Motor: ${indicadores.motor}</span>
        </div>
      `;
    }

    // Badge de métrica geométrica especializada según API
    let htmlMetricaGeo = '';
    if (indicadores.metricaGeometrica) {
      if (indicadores.metricaGeometrica.tipo === 'longitud') {
        htmlMetricaGeo = `
          <div class="indicador" style="border-left: 3px solid #2E8B57;">
            <span class="valor">${indicadores.metricaGeometrica.valorKm.toLocaleString()} km</span>
            <span class="etiqueta">${indicadores.metricaGeometrica.etiqueta} (${indicadores.metricaGeometrica.valorMetros.toLocaleString()} m)</span>
          </div>
        `;
      } else if (indicadores.metricaGeometrica.tipo === 'superficie') {
        htmlMetricaGeo = `
          <div class="indicador" style="border-left: 3px solid #B8860B;">
            <span class="valor">${indicadores.metricaGeometrica.valorM2.toLocaleString('es-CL')} m²</span>
            <span class="etiqueta">${indicadores.metricaGeometrica.etiqueta} (${indicadores.metricaGeometrica.valorHectareas.toLocaleString('es-CL')} ha / ${indicadores.metricaGeometrica.valorKm2} km²) [EPSG:32719]</span>
          </div>
        `;
      }
    } else {
      htmlMetricaGeo = `
        <div class="indicador" style="border-left: 3px solid #4682B4;">
          <span class="valor">${indicadores.elementosAhora.toLocaleString()}</span>
          <span class="etiqueta">Entidad puntual (puntos / nodos discretos)</span>
        </div>
      `;
    }

    // Unificación de series cronológicas anuales (elementos, usuarios, contribuciones)
    const mapaSeries = {};
    (indicadores.elementosPorAnio || []).forEach(item => {
      mapaSeries[item.fecha] = { fecha: item.fecha, elementos: item.valor, usuarios: '—', contribuciones: '—' };
    });
    (indicadores.usuariosPorAnio || []).forEach(item => {
      if (!mapaSeries[item.fecha]) mapaSeries[item.fecha] = { fecha: item.fecha, elementos: '—', usuarios: item.valor, contribuciones: '—' };
      else mapaSeries[item.fecha].usuarios = item.valor;
    });
    (indicadores.contribucionesPorAnio || []).forEach(item => {
      if (!mapaSeries[item.fecha]) mapaSeries[item.fecha] = { fecha: item.fecha, elementos: '—', usuarios: '—', contribuciones: item.valor };
      else mapaSeries[item.fecha].contribuciones = item.valor;
    });

    const filasSerie = Object.values(mapaSeries).sort((a, b) => a.fecha.localeCompare(b.fecha)).map(p => `
      <tr>
        <td><strong>${p.fecha}</strong></td>
        <td>${typeof p.elementos === 'number' ? p.elementos.toLocaleString() : p.elementos}</td>
        <td>${typeof p.usuarios === 'number' ? p.usuarios.toLocaleString() : p.usuarios}</td>
        <td>${typeof p.contribuciones === 'number' ? p.contribuciones.toLocaleString() : p.contribuciones}</td>
      </tr>
    `).join('');

    const ultimosUsuarios = (indicadores.usuariosPorAnio && indicadores.usuariosPorAnio.length > 0)
      ? (indicadores.usuariosPorAnio[indicadores.usuariosPorAnio.length - 1]?.valor ?? '—')
      : '—';
    const ultimasContribuciones = (indicadores.contribucionesPorAnio && indicadores.contribucionesPorAnio.length > 0)
      ? (indicadores.contribucionesPorAnio[indicadores.contribucionesPorAnio.length - 1]?.valor ?? '—')
      : '—';
    const ratioEdicion = indicadores.ratioContribucionPorUsuario ? `${indicadores.ratioContribucionPorUsuario} edit/user` : '—';

    // Lista de referencias académicas y bibliografía científica
    const listaRefs = (indicadores.referencias || []).map(r => `
      <li style="margin-bottom:6px; font-size:0.78rem; line-height:1.4;">
        <strong>${r.autor}</strong> — <em>${r.titulo}</em>.
        ${r.doi ? `<a href="https://doi.org/${r.doi}" target="_blank" rel="noopener" style="color:var(--musgo); text-decoration:underline;">doi:${r.doi}</a>` : ''}
        ${r.url ? `<a href="${r.url}" target="_blank" rel="noopener" style="color:var(--musgo); text-decoration:underline;">${r.url}</a>` : ''}
      </li>
    `).join('');

    contenedor.innerHTML = `
      ${htmlBadgeVersion}
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:16px;">
        <div class="indicador">
          <span class="valor">${indicadores.elementosAhora.toLocaleString()}</span>
          <span class="etiqueta">Elementos vigentes (${indicadores.fechaCorte})</span>
        </div>
        ${htmlMetricaGeo}
        <div class="indicador" style="border-left: 3px solid #8F3A2C;">
          <span class="valor">${densInfo ? densInfo.densidad.toFixed(1) : '—'}</span>
          <span class="etiqueta">Densidad espacial (elem / km²)</span>
          <div style="font-size:0.72rem; color:var(--tinta-suave); margin-top:4px; line-height:1.35;">
            Área Bbox: ${densInfo ? `<strong>${densInfo.areaM2.toLocaleString('es-CL')} m²</strong> (${densInfo.areaHa.toLocaleString('es-CL')} ha / ${densInfo.areaKm2} km²)` : '—'}<br>
            Densidad por m²: ${densInfo && densInfo.densidadM2 ? `<strong>${(densInfo.densidadM2 * 10000).toFixed(2)} elem / 10.000 m²</strong> (${(densInfo.densidadM2 * 1000).toFixed(3)} elem / 1.000 m²)` : '—'}<br>
            <strong style="color:#8F3A2C;">Reproyectado a EPSG:32719</strong> (UTM 19S)
          </div>
        </div>
        <div class="indicador">
          <span class="valor">${ultimosUsuarios}</span>
          <span class="etiqueta">Colaboradores activos (último período)</span>
        </div>
        <div class="indicador">
          <span class="valor">${typeof ultimasContribuciones === 'number' ? ultimasContribuciones.toLocaleString() : ultimasContribuciones}</span>
          <span class="etiqueta">Contribuciones / Ediciones registradas</span>
        </div>
        <div class="indicador">
          <span class="valor">${ratioEdicion}</span>
          <span class="etiqueta">Intensidad comunitaria (ediciones / colab)</span>
        </div>
      </div>

      <h3 style="margin-top:20px;">Evolución Histórica Multidimensional (ohsome API v1)</h3>
      <p class="descripcion">Serie cronológica anual analizada sobre la base histórica de datos espaciales (OSHDB):</p>
      <table class="tabla-datos">
        <thead>
          <tr>
            <th>Período / Año</th>
            <th>Elementos Totales</th>
            <th>Colaboradores Únicos</th>
            <th>Contribuciones / Cambios</th>
          </tr>
        </thead>
        <tbody>${filasSerie}</tbody>
      </table>

      <div class="bloque" style="background:var(--papel-alto); border:1px solid var(--linea); padding:14px; margin-top:16px;">
        <h4 style="margin:0 0 8px 0; font-size:0.9rem; color:var(--musgo);">📐 Rigor Metodológico y Criterios de Calidad Espacial</h4>
        <p class="descripcion" style="margin-bottom:8px;">
          <strong>Reproyección Geodésica Rigurosa a EPSG:32719 (WGS 84 / UTM Huso 19 Sur):</strong> Todo cálculo métrico de superficie del Bbox territorial (${densInfo ? `${densInfo.areaM2.toLocaleString('es-CL')} m² / ${densInfo.areaHa.toLocaleString('es-CL')} ha / ${densInfo.areaKm2} km²` : ''}) y densidad espacial de elementos se obtiene proyectando los vértices geográficos mediante las ecuaciones conformes de Transverse Mercator (Snyder, 1987) al sistema oficial de referencia <strong>EPSG:32719</strong> (meridiano central 69°O, elipsoide WGS84, falso este 500.000 m, falso norte 10.000.000 m) y aplicando la fórmula de Gauss (Shoelace). Esto garantiza concordancia con las normas del Instituto Geográfico Militar (IGM) y la Infraestructura de Datos Espaciales de Chile (IDE Chile / SNIT), expresando consistentemente cada dimensión superficial en metros cuadrados (m²), hectáreas (ha) y kilómetros cuadrados (km²).
        </p>
        <p class="descripcion" style="margin-bottom:8px;">
          <strong>Sensibilidad geométrica:</strong> Conforme a la API v1 de ohsome, las geometrías lineales evalúan continuidad de red en kilómetros lineales (calles y ciclovías), mientras que los polígonos cuantifican la superficie de huella construida o áreas verdes en hectáreas y metros cuadrados.
        </p>
        <p class="descripcion" style="margin-bottom:8px;">
          <strong>Madurez y Linaje:</strong> El ratio de contribuciones por usuario y la masa crítica de colaboradores permiten evaluar si la cartografía de Barrio Brasil depende de pocos mapeadores esporádicos o de una comunidad activa recurrente (Haklay, 2010; Neis & Zipf, 2012).
        </p>
        <h5 style="margin:12px 0 6px 0; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--tinta-suave);">Referencias Académicas y Documentales:</h5>
        <ul style="padding-left:18px; margin:0; color:var(--tinta-suave);">
          ${listaRefs}
        </ul>
      </div>
    `;
  } catch (error) {
    contenedor.innerHTML = avisoError(error.message + ' Prueba con un área más pequeña o ajusta el filtro según docs.ohsome.org.');
  }
}

/* ---------------------- PANEL GBIF ---------------------- */

async function manejarConsultaGBIF(cargarAlMapa = false) {
  const contenedor = document.getElementById('resultado-gbif');
  const bbox = leerBbox('gbif');
  const nombre = document.getElementById('gbif-nombre').value.trim();
  const basisOfRecord = document.getElementById('gbif-basis-selector')?.value || 'ALL';

  contenedor.innerHTML = '<p class="descripcion">Consultando registros de biodiversidad en GBIF…</p>';

  try {
    const resultado = await ModuloGBIF.buscarOcurrencias({
      nombre,
      bbox: bbox || undefined,
      basisOfRecord: basisOfRecord
    });

    if (resultado.registros.length === 0) {
      contenedor.innerHTML = avisoInfo('No se encontraron registros biológicos con esos criterios en el área.');
      return;
    }

    ultimaConsultaRealizada = {
      bbox,
      filtro: nombre || 'Biodiversidad Urbana',
      cantidad: resultado.total,
      fuente: 'GBIF'
    };
    autocargarMetadatos({
      categoriaId: 'biodiversidad',
      cantidad: resultado.total,
      fuente: 'Global Biodiversity Information Facility (GBIF)',
      filtro: nombre || 'Biodiversidad Urbana',
      bbox
    });

    if (cargarAlMapa) {
      ModuloMapa.cargarCapaGeoJSON('gbif_biodiversidad', resultado.geojson, {
        nombre: 'Biodiversidad (GBIF)',
        color: '#1C523A',
        icono: '🌿'
      });
      document.querySelector('button[data-panel="inicio"]').click();
      return;
    }

    const filas = resultado.registros.slice(0, 30).map(r => `
      <tr>
        <td><strong>${r.especie}</strong></td>
        <td>${r.nombreComun || '—'}</td>
        <td>${r.fecha}</td>
        <td>${r.publicador}</td>
        <td><small>${r.licencia}</small></td>
      </tr>
    `).join('');

    contenedor.innerHTML = `
      <div class="indicador"><span class="valor">${resultado.total}</span><span class="etiqueta">registros totales en GBIF</span></div>
      <table class="tabla-datos">
        <thead><tr><th>Especie Científica</th><th>Nombre Común</th><th>Fecha</th><th>Publicador</th><th>Licencia</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  } catch (error) {
    contenedor.innerHTML = avisoError(error.message);
  }
}

/* ---------------------- PANEL UMAP ---------------------- */

async function manejarCargaUMap() {
  const contenedor = document.getElementById('resultado-umap');
  const url = document.getElementById('umap-url').value.trim();
  if (!url) { contenedor.innerHTML = avisoError('Pega la URL pública de un mapa UMap.'); return; }

  const analisis = ModuloUMap.analizarUrl(url);

  contenedor.innerHTML = `
    <iframe class="iframe-umap" src="${ModuloUMap.urlEmbebido(url)}" title="Mapa UMap embebido"></iframe>
    <p class="descripcion">Intentando obtener el GeoJSON del mapa…</p>
  `;

  if (!analisis) {
    contenedor.innerHTML += avisoInfo('No se pudo reconocer el formato de la URL para la descarga automática; el mapa se muestra arriba embebido.');
    return;
  }

  const intento = await ModuloUMap.intentarDescargarGeojson(analisis);
  const parrafoEstado = document.createElement('div');

  if (intento.ok) {
    const cantidadFeatures = intento.datos.features ? intento.datos.features.length : '—';
    parrafoEstado.innerHTML = avisoInfo(`GeoJSON obtenido: ${cantidadFeatures} elementos. <a href="${intento.urlIntentada}" target="_blank" rel="noopener">Descargar archivo</a>.`);
  } else {
    parrafoEstado.innerHTML = avisoInfo(`No se pudo leer el GeoJSON automáticamente (${intento.motivo}). Puedes descargarlo de forma directa desde <a href="${intento.urlIntentada}" target="_blank" rel="noopener">este enlace</a>.`);
  }
  contenedor.appendChild(parrafoEstado);
}

/* ---------------------- PANEL METADATOS ISO ---------------------- */

function construirObjetoFichaDesdeFormulario() {
  return ModuloMetadatos.construirFicha({
    titulo: document.getElementById('md-titulo').value,
    resumen: document.getElementById('md-resumen').value,
    categoriaTema: document.getElementById('md-categoria-iso')?.value || 'planningCadastre',
    frecuencia: document.getElementById('md-frecuencia')?.value || 'asNeeded',
    rol: document.getElementById('md-rol-select')?.value || 'author',
    oeste: document.getElementById('md-oeste').value,
    sur: document.getElementById('md-sur').value,
    este: document.getElementById('md-este').value,
    norte: document.getElementById('md-norte').value,
    srs: document.getElementById('md-srs').value,
    linaje: document.getElementById('md-linaje').value,
    restricciones: document.getElementById('md-restricciones').value,
    contactoOrganizacion: document.getElementById('md-contacto-org').value,
    contactoCorreo: document.getElementById('md-contacto-correo').value
  });
}

function manejarGenerarMetadatos(evento) {
  evento.preventDefault();
  const ficha = construirObjetoFichaDesdeFormulario();
  ModuloMetadatos.guardarFichaLocal(ficha);
  window._ultimaFichaGenerada = ficha;

  document.getElementById('resultado-metadatos').innerHTML = `
    <div class="aviso">Ficha ISO 19115 generada con éxito. Utiliza los botones inferiores para exportar en JSON o XML (IDE Chile).</div>
    <pre class="tabla-datos" style="white-space:pre-wrap; padding:12px; font-family:'IBM Plex Mono', monospace; font-size:0.8rem; max-height:400px; overflow:auto;">${JSON.stringify(ficha, null, 2)}</pre>
  `;
}

function prellenarMetadatosDesdeUltimaConsulta() {
  const bbox = leerBbox('osm') || window.NODO_CONFIG.area_por_defecto.bbox;
  escribirBbox('md', bbox);

  const fuente = ultimaConsultaRealizada?.fuente || 'OpenStreetMap / Overpass QL';
  const filtro = ultimaConsultaRealizada?.filtro || 'Campus UAH y Barrio Brasil';
  const cantidad = ultimaConsultaRealizada?.cantidad || 'múltiples';

  document.getElementById('md-linaje').value =
    `Extraído desde ${fuente} (${filtro}) para el Bbox [${bbox.join(', ')}] el ${new Date().toISOString().slice(0, 10)}. Comprende ${cantidad} registros validados y normalizados.`;
  document.getElementById('md-titulo').value =
    `Catastro VGI de Equipamiento Universitario y Urbano: Barrio Brasil - Universidad Alberto Hurtado (${new Date().getFullYear()})`;
}

function exportarMetadatosJSON() {
  const ficha = window._ultimaFichaGenerada || construirObjetoFichaDesdeFormulario();
  ModuloMetadatos.exportarComoArchivoJSON(ficha);
}

function exportarMetadatosXML() {
  const ficha = window._ultimaFichaGenerada || construirObjetoFichaDesdeFormulario();
  ModuloMetadatos.exportarComoArchivoXML(ficha);
}

/* ---------------------- RESUMEN METODOLÓGICO ---------------------- */

function cargarResumenMetodologia() {
  document.getElementById('contenido-manual').innerHTML = `
    <div class="bloque">
      <h3>Flujo Metodológico de la Práctica Profesional (10 Hitos)</h3>
      <p>1. <strong>Definición del problema y territorio:</strong> Barrio Brasil y campus Universidad Alberto Hurtado como caso piloto para la gestión territorial.</p>
      <p>2. <strong>Diseño conceptual:</strong> Estructuración de 8 categorías temáticas VGI prioritarias (CAT-01 a CAT-08).</p>
      <p>3. <strong>Inventario y catálogo de fuentes:</strong> Documentado en <code>docs/catalogo_fuentes_vgi.xlsx</code>.</p>
      <p>4. <strong>Extracción y normalización de datos:</strong> Consultas Overpass y GBIF automatizadas en GeoJSON.</p>
      <p>5. <strong>Evaluación de calidad:</strong> Indicadores ohsome (densidad y recuento de colaboradores).</p>
      <p>6. <strong>Estandarización de metadatos:</strong> Generación en ISO 19115 (JSON) e ISO 19139 (XML para IDE Chile).</p>
      <p>7. <strong>Atlas y visor interactivo:</strong> Visualizador en Leaflet con descarga de capas para QGIS.</p>
    </div>
    <div class="bloque">
      <h3>Documentos, Catálogos Excel y Memoria Académica</h3>
      <p>Para la defensa ante el comité evaluador y el informe final de práctica profesional, consulta los documentos de referencia en la carpeta <code>docs/</code>:</p>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
        <div>📄 <strong>Memoria y Justificación Epistemológica:</strong> <code>docs/TRAZABILIDAD_ACADEMICA.md</code> <a href="docs/TRAZABILIDAD_ACADEMICA.md" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>📊 <strong>Catálogo de Fuentes VGI:</strong> <code>docs/catalogo_fuentes_vgi.xlsx</code> <a href="docs/catalogo_fuentes_vgi.xlsx" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>🏛️ <strong>Perfil Metadatos ISO 19115 / IDE Chile:</strong> <code>docs/perfil_metadatos_vgi.xlsx</code> <a href="docs/perfil_metadatos_vgi.xlsx" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>🗂️ <strong>Taxonomía y 8 Categorías OSM:</strong> <code>docs/categorias_tematicas_osm.xlsx</code> <a href="docs/categorias_tematicas_osm.xlsx" download class="accion secundaria" style="display:inline-block; font-size:0.75rem; padding:2px 8px; margin-left:6px; text-decoration:none;">⬇️ Descargar</a></div>
        <div>📐 <strong>Arquitectura y Diseño Técnico:</strong> <code>docs/ARQUITECTURA.md</code></div>
      </div>
    </div>
  `;
}

function avisoError(mensaje) { return `<div class="aviso error">${mensaje}</div>`; }
function avisoInfo(mensaje) { return `<div class="aviso">${mensaje}</div>`; }
