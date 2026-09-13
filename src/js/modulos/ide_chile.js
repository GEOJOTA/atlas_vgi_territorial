/*
  ide_chile.js
  ------------
  Módulo de integración con capas y servicios oficiales del Estado de Chile:
  - Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT)
  - Geoportal de Chile (geoportal.cl)
  - Ministerio de Vivienda y Urbanismo (MINVU / geoide.minvu.cl)
  - Instituto Nacional de Estadísticas (INE / Censo 2024)
  - Ministerio de Educación (MINEDUC)
  - Ministerio de Salud (MINSAL / DEIS)
  - Ministerio de Transportes y Telecomunicaciones (MTT / DTPM / Metro S.A.)
  - Junta Nacional de Cuerpos de Bomberos y Carabineros de Chile
  - Consejo de Monumentos Nacionales (CMN / datos.gob.cl)

  Provee:
  1. Consumo dinámico de FeatureServers en vivo y catálogos normalizados locales en src/data/.
  2. Consumo de capas OGC WMS (Web Map Service) oficiales.
  3. Desglose detallado de atributos públicos, trazabilidad y citas APA 7ª ed.
  4. Cumplimiento de la Ley N° 20.285 sobre Acceso a la Información Pública.
*/

const ModuloIDEChile = (() => {

  // Catálogo maestro exhaustivo de capas oficiales integradas
  const CAPAS_OFICIALES = {
    'capa_01': {
      id: 'capa_01',
      num_bbdd: 1,
      nombre: "Proyectos Mandatados - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: "data/capa_oficial_01.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 01: 'Proyectos Mandatados - GEOMOP'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Proyectos Mandatados - GEOMOP (Capa N° 01). IDE Chile / Geoportal de Chile. https://geomop.mop.gob.cl/descargas/"
    },
    'capa_02': {
      id: 'capa_02',
      num_bbdd: 2,
      nombre: "Red Vial Nacional - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: "data/capa_oficial_02.geojson",
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 02: 'Red Vial Nacional - GEOMOP'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Red Vial Nacional - GEOMOP (Capa N° 02). IDE Chile / Geoportal de Chile. https://geomop.mop.gob.cl/descargas/"
    },
    'capa_03': {
      id: 'capa_03',
      num_bbdd: 3,
      nombre: "Red Hidrométrica - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: "data/capa_oficial_03.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 03: 'Red Hidrométrica - GEOMOP'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Red Hidrométrica - GEOMOP (Capa N° 03). IDE Chile / Geoportal de Chile. https://geomop.mop.gob.cl/descargas/"
    },
    'capa_04': {
      id: 'capa_04',
      num_bbdd: 4,
      nombre: "Contratos Concesionados - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: "data/capa_oficial_04.geojson",
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 04: 'Contratos Concesionados - GEOMOP'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Contratos Concesionados - GEOMOP (Capa N° 04). IDE Chile / Geoportal de Chile. https://geomop.mop.gob.cl/descargas/"
    },
    'capa_05': {
      id: 'capa_05',
      num_bbdd: 5,
      nombre: "Contratos MOP - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: "data/capa_oficial_05.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 05: 'Contratos MOP - GEOMOP'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Contratos MOP - GEOMOP (Capa N° 05). IDE Chile / Geoportal de Chile. https://geomop.mop.gob.cl/descargas/"
    },
    'capa_06': {
      id: 'capa_06',
      num_bbdd: 6,
      nombre: "Jardines Infantiles JUNJI",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/34965/Jardines%20Infantiles%20JUNJI",
      archivoLocal: "data/capa_jardines_junji.geojson",
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 06: 'Jardines Infantiles JUNJI'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Jardines Infantiles JUNJI (Capa N° 06). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/34965/Jardines%20Infantiles%20JUNJI"
    },
    'capa_07': {
      id: 'capa_07',
      num_bbdd: 7,
      nombre: "Infraestructura Deportiva",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35034/Infraestructura%20Deportiva",
      archivoLocal: "data/capa_infraestructura_deportiva.geojson",
      color: '#8B5CF6',
      icono: '⚽',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'espacio_publico',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 07: 'Infraestructura Deportiva'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Infraestructura Deportiva (Capa N° 07). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35034/Infraestructura%20Deportiva"
    },
    'capa_08': {
      id: 'capa_08',
      num_bbdd: 8,
      nombre: "Municipios",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35603/Municipios",
      archivoLocal: "data/capa_oficial_08.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 08: 'Municipios'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Municipios (Capa N° 08). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35603/Municipios"
    },
    'capa_09': {
      id: 'capa_09',
      num_bbdd: 9,
      nombre: "Cuarteles de Bomberos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35003/Cuarteles%20de%20Carabineros",
      archivoLocal: "data/capa_cuarteles_bomberos.geojson",
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 09: 'Cuarteles de Bomberos'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cuarteles de Bomberos (Capa N° 09). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35003/Cuarteles%20de%20Carabineros"
    },
    'capa_10': {
      id: 'capa_10',
      num_bbdd: 10,
      nombre: "Jardines Infantiles Fundación Integra",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35001/Jardines%20Infantiles%20Fundaci%C3%B3n%20Integra",
      archivoLocal: "data/capa_jardines_junji.geojson",
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 10: 'Jardines Infantiles Fundación Integra'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Jardines Infantiles Fundación Integra (Capa N° 10). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35001/Jardines%20Infantiles%20Fundaci%C3%B3n%20Integra"
    },
    'capa_11': {
      id: 'capa_11',
      num_bbdd: 11,
      nombre: "Cuerpos de Bomberos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/36393/Cuerpos%20de%20Bomberos",
      archivoLocal: "data/capa_cuarteles_bomberos.geojson",
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 11: 'Cuerpos de Bomberos'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cuerpos de Bomberos (Capa N° 11). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/36393/Cuerpos%20de%20Bomberos"
    },
    'capa_12': {
      id: 'capa_12',
      num_bbdd: 12,
      nombre: "Establecimientos Educación Escolar",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35408/Establecimientos%20Educaci%C3%B3n%20Escolar",
      archivoLocal: "data/capa_educacion_escolar.geojson",
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 12: 'Establecimientos Educación Escolar'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Establecimientos Educación Escolar (Capa N° 12). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35408/Establecimientos%20Educaci%C3%B3n%20Escolar"
    },
    'capa_13': {
      id: 'capa_13',
      num_bbdd: 13,
      nombre: "Establecimientos Educación Parvularia",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35553/Establecimientos%20Educaci%C3%B3n%20Parvularia",
      archivoLocal: "data/capa_oficial_13.geojson",
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 13: 'Establecimientos Educación Parvularia'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Establecimientos Educación Parvularia (Capa N° 13). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35553/Establecimientos%20Educaci%C3%B3n%20Parvularia"
    },
    'capa_14': {
      id: 'capa_14',
      num_bbdd: 14,
      nombre: "Establecimientos de Educación Superior",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35554/Establecimientos%20de%20Educaci%C3%B3n%20Superior",
      archivoLocal: "data/capa_educacion_superior.geojson",
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 14: 'Establecimientos de Educación Superior'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Establecimientos de Educación Superior (Capa N° 14). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35554/Establecimientos%20de%20Educaci%C3%B3n%20Superior"
    },
    'capa_15': {
      id: 'capa_15',
      num_bbdd: 15,
      nombre: "Centros de SERNAM",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35000/Centros%20de%20SERNAM",
      archivoLocal: "data/capa_oficial_15.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 15: 'Centros de SERNAM'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Centros de SERNAM (Capa N° 15). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35000/Centros%20de%20SERNAM"
    },
    'capa_16': {
      id: 'capa_16',
      num_bbdd: 16,
      nombre: "Ferias Libres",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35097/Ferias%20Libres",
      archivoLocal: "data/capa_ferias_libres.geojson",
      color: '#F97316',
      icono: '💰',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'economico_agricola',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 16: 'Ferias Libres'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Ferias Libres (Capa N° 16). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35097/Ferias%20Libres"
    },
    'capa_17': {
      id: 'capa_17',
      num_bbdd: 17,
      nombre: "Áreas Funcionales de las ciudades (2026)",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/AFU_2026/FeatureServer",
      archivoLocal: "data/capa_oficial_17.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 17: 'Áreas Funcionales de las ciudades (2026)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Áreas Funcionales de las ciudades (2026) (Capa N° 17). IDE Chile / Geoportal de Chile. https://geoide.minvu.cl/server/rest/services/Otros/AFU_2026/FeatureServer"
    },
    'capa_18': {
      id: 'capa_18',
      num_bbdd: 18,
      nombre: "Zonificación Termica",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Zonificaci%C3%B3n_termica/FeatureServer",
      archivoLocal: "data/capa_oficial_18.geojson",
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 18: 'Zonificación Termica'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Zonificación Termica (Capa N° 18). IDE Chile / Geoportal de Chile. https://geoide.minvu.cl/server/rest/services/Otros/Zonificaci%C3%B3n_termica/FeatureServer"
    },
    'capa_19': {
      id: 'capa_19',
      num_bbdd: 19,
      nombre: "Cité",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Cit%C3%A9/FeatureServer",
      archivoLocal: "data/capa_oficial_19.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 19: 'Cité'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cité (Capa N° 19). IDE Chile / Geoportal de Chile. https://geoide.minvu.cl/server/rest/services/Otros/Cit%C3%A9/FeatureServer"
    },
    'capa_20': {
      id: 'capa_20',
      num_bbdd: 20,
      nombre: "Seremis",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Seremis/FeatureServer",
      archivoLocal: "data/capa_oficial_20.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 20: 'Seremis'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Seremis (Capa N° 20). IDE Chile / Geoportal de Chile. https://geoide.minvu.cl/server/rest/services/Otros/Seremis/FeatureServer"
    },
    'capa_21': {
      id: 'capa_21',
      num_bbdd: 21,
      nombre: "Oficinas Serviu",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Ofinas_Serviu/FeatureServer",
      archivoLocal: "data/capa_oficial_21.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 21: 'Oficinas Serviu'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Oficinas Serviu (Capa N° 21). IDE Chile / Geoportal de Chile. https://geoide.minvu.cl/server/rest/services/Otros/Ofinas_Serviu/FeatureServer"
    },
    'capa_22': {
      id: 'capa_22',
      num_bbdd: 22,
      nombre: "Datos IDE Energía",
      institucion: "Estado de Chile / IDE Chile / ide-energia.minenergia.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide-energia.minenergia.cl/server/rest/services/IDE_Energia/Visor_IDE_Energ%C3%ADa/FeatureServer",
      archivoLocal: "data/capa_oficial_22.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 22: 'Datos IDE Energía'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Datos IDE Energía (Capa N° 22). IDE Chile / Geoportal de Chile. https://ide-energia.minenergia.cl/server/rest/services/IDE_Energia/Visor_IDE_Energ%C3%ADa/FeatureServer"
    },
    'capa_23': {
      id: 'capa_23',
      num_bbdd: 23,
      nombre: "Sitios BIO-Prioritarios",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35909/Sitios%20prioritarios",
      archivoLocal: "data/capa_oficial_23.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 23: 'Sitios BIO-Prioritarios'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Sitios BIO-Prioritarios (Capa N° 23). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35909/Sitios%20prioritarios"
    },
    'capa_24': {
      id: 'capa_24',
      num_bbdd: 24,
      nombre: "Juzgados de Familia",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35093/Juzgados%20de%20Familia",
      archivoLocal: "data/capa_oficial_24.geojson",
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 24: 'Juzgados de Familia'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Juzgados de Familia (Capa N° 24). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35093/Juzgados%20de%20Familia"
    },
    'capa_25': {
      id: 'capa_25',
      num_bbdd: 25,
      nombre: "Estaciones Meteorológicas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35262/Estaciones%20Meteorol%C3%B3gicas",
      archivoLocal: "data/capa_estaciones_meteorologicas.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 25: 'Estaciones Meteorológicas'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Estaciones Meteorológicas (Capa N° 25). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35262/Estaciones%20Meteorol%C3%B3gicas"
    },
    'capa_26': {
      id: 'capa_26',
      num_bbdd: 26,
      nombre: "Estaciones Sedimentométricas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35265/Estaciones%20sedimentom%C3%A9tricas",
      archivoLocal: "data/capa_oficial_26.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 26: 'Estaciones Sedimentométricas'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Estaciones Sedimentométricas (Capa N° 26). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35265/Estaciones%20sedimentom%C3%A9tricas"
    },
    'capa_27': {
      id: 'capa_27',
      num_bbdd: 27,
      nombre: "Estaciones de Calidad de Aguas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35154/Estaciones%20de%20calidad%20de%20aguas",
      archivoLocal: "data/capa_oficial_27.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 27: 'Estaciones de Calidad de Aguas'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Estaciones de Calidad de Aguas (Capa N° 27). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35154/Estaciones%20de%20calidad%20de%20aguas"
    },
    'capa_28': {
      id: 'capa_28',
      num_bbdd: 28,
      nombre: "Establecimientos de Salud Febrero 2026",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/37171/Establecimientos%20de%20salud%20de%20Chile%20Febrero%202026",
      archivoLocal: "data/capa_salud_oficial.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 28: 'Establecimientos de Salud Febrero 2026'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Establecimientos de Salud Febrero 2026 (Capa N° 28). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/37171/Establecimientos%20de%20salud%20de%20Chile%20Febrero%202026"
    },
    'capa_29': {
      id: 'capa_29',
      num_bbdd: 29,
      nombre: "Cuencas Banco Nacional de Aguas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35416/Cuencas%20Banco%20Nacional%20de%20Aguas",
      archivoLocal: "data/capa_oficial_29.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 29: 'Cuencas Banco Nacional de Aguas'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cuencas Banco Nacional de Aguas (Capa N° 29). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35416/Cuencas%20Banco%20Nacional%20de%20Aguas"
    },
    'capa_30': {
      id: 'capa_30',
      num_bbdd: 30,
      nombre: "Indice Calidad de Aguas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35251/Calidad%20aguas",
      archivoLocal: "data/capa_oficial_30.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 30: 'Indice Calidad de Aguas'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Indice Calidad de Aguas (Capa N° 30). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35251/Calidad%20aguas"
    },
    'capa_31': {
      id: 'capa_31',
      num_bbdd: 31,
      nombre: "Ciclovías",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/dashboard/118",
      archivoLocal: "data/capa_ciclovias_mop.geojson",
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 31: 'Ciclovías'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Ciclovías (Capa N° 31). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/dashboard/118"
    },
    'capa_32': {
      id: 'capa_32',
      num_bbdd: 32,
      nombre: "Vertederos Ilegales",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35653/Vertederos%20Ilegales",
      archivoLocal: "data/capa_oficial_32.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 32: 'Vertederos Ilegales'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Vertederos Ilegales (Capa N° 32). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35653/Vertederos%20Ilegales"
    },
    'capa_33': {
      id: 'capa_33',
      num_bbdd: 33,
      nombre: "Plan Cuadrante Carabineros",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35002/Plan%20Cuadrante",
      archivoLocal: "data/capa_oficial_33.geojson",
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 33: 'Plan Cuadrante Carabineros'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Plan Cuadrante Carabineros (Capa N° 33). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35002/Plan%20Cuadrante"
    },
    'capa_34': {
      id: 'capa_34',
      num_bbdd: 34,
      nombre: "Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35414/Zonas%20clim%C3%A1ticas%20de%20Chile%20seg%C3%BAn%20K%C3%B6ppen-Geiger%20escala%201:1.500.000",
      archivoLocal: "data/capa_oficial_34.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 34: 'Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000 (Capa N° 34). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35414/Zonas%20clim%C3%A1ticas%20de%20Chile%20seg%C3%BAn%20K%C3%B6ppen-Geiger%20escala%201:1.500.000"
    },
    'capa_35': {
      id: 'capa_35',
      num_bbdd: 35,
      nombre: "Antenas en Servicio Ley de Torres",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35911/Antenas%20en%20Servicio%20Ley%20de%20Torres",
      archivoLocal: "data/capa_oficial_35.geojson",
      color: '#F97316',
      icono: '💰',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'economico_agricola',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 35: 'Antenas en Servicio Ley de Torres'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Antenas en Servicio Ley de Torres (Capa N° 35). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35911/Antenas%20en%20Servicio%20Ley%20de%20Torres"
    },
    'capa_36': {
      id: 'capa_36',
      num_bbdd: 36,
      nombre: "Curva de 10m",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35655/Curva%20de%2010m",
      archivoLocal: "data/capa_oficial_36.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 36: 'Curva de 10m'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Curva de 10m (Capa N° 36). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35655/Curva%20de%2010m"
    },
    'capa_37': {
      id: 'capa_37',
      num_bbdd: 37,
      nombre: "Red de Interconexión",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35419/Red%20de%20Interconexi%C3%B3n",
      archivoLocal: "data/capa_oficial_37.geojson",
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 37: 'Red de Interconexión'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Red de Interconexión (Capa N° 37). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35419/Red%20de%20Interconexi%C3%B3n"
    },
    'capa_38': {
      id: 'capa_38',
      num_bbdd: 38,
      nombre: "Territorios de los Servicios de Salud",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35388/Territorios%20de%20los%20Servicios%20de%20Salud",
      archivoLocal: "data/capa_salud_oficial.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 38: 'Territorios de los Servicios de Salud'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Territorios de los Servicios de Salud (Capa N° 38). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35388/Territorios%20de%20los%20Servicios%20de%20Salud"
    },
    'capa_39': {
      id: 'capa_39',
      num_bbdd: 39,
      nombre: "Estaciones de monitoreo de calidad de aire (Red Pública)",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35152/Estaciones%20de%20monitoreo%20de%20calidad%20de%20aire%20%28Red%20P%C3%BAblica%29",
      archivoLocal: "data/capa_oficial_39.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 39: 'Estaciones de monitoreo de calidad de aire (Red Pública)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Estaciones de monitoreo de calidad de aire (Red Pública) (Capa N° 39). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35152/Estaciones%20de%20monitoreo%20de%20calidad%20de%20aire%20%28Red%20P%C3%BAblica%29"
    },
    'capa_40': {
      id: 'capa_40',
      num_bbdd: 40,
      nombre: "Circuitos Turísticos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35141/Circuitos%20Tur%C3%ADsticos",
      archivoLocal: "data/capa_oficial_40.geojson",
      color: '#8B5CF6',
      icono: '⚽',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'espacio_publico',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 40: 'Circuitos Turísticos'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Circuitos Turísticos (Capa N° 40). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35141/Circuitos%20Tur%C3%ADsticos"
    },
    'capa_41': {
      id: 'capa_41',
      num_bbdd: 41,
      nombre: "Continuo de Construcciones Urbanas (1993, 2002, 2006, 2011, 2017, 2018, 2019 y 2020.)",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/CCU_1993_2019/FeatureServer",
      archivoLocal: "data/capa_oficial_41.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 41: 'Continuo de Construcciones Urbanas (1993, 2002, 2006, 2011, 2017, 2018, 2019 y 2020.)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Continuo de Construcciones Urbanas (1993, 2002, 2006, 2011, 2017, 2018, 2019 y 2020.) (Capa N° 41). IDE Chile / Geoportal de Chile. https://geoide.minvu.cl/server/rest/services/Otros/CCU_1993_2019/FeatureServer"
    },
    'capa_42': {
      id: 'capa_42',
      num_bbdd: 42,
      nombre: "Pisos vegetacionales de Luebert y Pliscoff 2017",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/32581/Pisos%20vegetacionales%20de%20Luebert%20y%20Pliscoff%202017",
      archivoLocal: "data/capa_oficial_42.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 42: 'Pisos vegetacionales de Luebert y Pliscoff 2017'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Pisos vegetacionales de Luebert y Pliscoff 2017 (Capa N° 42). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/32581/Pisos%20vegetacionales%20de%20Luebert%20y%20Pliscoff%202017"
    },
    'capa_43': {
      id: 'capa_43',
      num_bbdd: 43,
      nombre: "División Política Administrativa 2023",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/36391/Divisi%C3%B3n%20Pol%C3%ADtica%20Administrativa%202023",
      archivoLocal: "data/capa_oficial_43.geojson",
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 43: 'División Política Administrativa 2023'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). División Política Administrativa 2023 (Capa N° 43). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/36391/Divisi%C3%B3n%20Pol%C3%ADtica%20Administrativa%202023"
    },
    'capa_44': {
      id: 'capa_44',
      num_bbdd: 44,
      nombre: "Municipios con certificación ambiental (SCAM)",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35656/Municipios%20con%20certificaci%C3%B3n%20ambiental%20%28SCAM%29",
      archivoLocal: "data/capa_oficial_44.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 44: 'Municipios con certificación ambiental (SCAM)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Municipios con certificación ambiental (SCAM) (Capa N° 44). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35656/Municipios%20con%20certificaci%C3%B3n%20ambiental%20%28SCAM%29"
    },
    'capa_45': {
      id: 'capa_45',
      num_bbdd: 45,
      nombre: "Nivel de erosión",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35651/Nivel%20de%20erosi%C3%B3n",
      archivoLocal: "data/capa_oficial_45.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 45: 'Nivel de erosión'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Nivel de erosión (Capa N° 45). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35651/Nivel%20de%20erosi%C3%B3n"
    },
    'capa_46': {
      id: 'capa_46',
      num_bbdd: 46,
      nombre: "Predios",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35406/Predios",
      archivoLocal: "data/capa_oficial_46.geojson",
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 46: 'Predios'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Predios (Capa N° 46). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35406/Predios"
    },
    'capa_47': {
      id: 'capa_47',
      num_bbdd: 47,
      nombre: "Zona Fronteriza",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/36570/Zona%20Fronteriza",
      archivoLocal: "data/capa_oficial_47.geojson",
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 47: 'Zona Fronteriza'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Zona Fronteriza (Capa N° 47). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/36570/Zona%20Fronteriza"
    },
    'capa_48': {
      id: 'capa_48',
      num_bbdd: 48,
      nombre: "Pasos Fronterizos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/36573/Pasos%20Fronterizos",
      archivoLocal: "data/capa_oficial_48.geojson",
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 48: 'Pasos Fronterizos'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Pasos Fronterizos (Capa N° 48). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/36573/Pasos%20Fronterizos"
    },
    'capa_49': {
      id: 'capa_49',
      num_bbdd: 49,
      nombre: "Estaciones Fluviométricas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35258/Estaciones%20Fluviom%C3%A9tricas",
      archivoLocal: "data/capa_oficial_49.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 49: 'Estaciones Fluviométricas'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Estaciones Fluviométricas (Capa N° 49). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35258/Estaciones%20Fluviom%C3%A9tricas"
    },
    'capa_50': {
      id: 'capa_50',
      num_bbdd: 50,
      nombre: "Oficinas de Protección de Derechos (ODP)",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://geoportal.cl/geoportal/catalog/35094/Oficinas%20de%20Protecci%C3%B3n%20de%20Derechos%20%28ODP%29",
      archivoLocal: "data/capa_oficial_50.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 50: 'Oficinas de Protección de Derechos (ODP)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Oficinas de Protección de Derechos (ODP) (Capa N° 50). IDE Chile / Geoportal de Chile. https://geoportal.cl/geoportal/catalog/35094/Oficinas%20de%20Protecci%C3%B3n%20de%20Derechos%20%28ODP%29"
    },
    'capa_51': {
      id: 'capa_51',
      num_bbdd: 51,
      nombre: "Localización de viveros en Chile continental",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/agricultura-y-ganaderia/",
      archivoLocal: "data/capa_oficial_51.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 51: 'Localización de viveros en Chile continental'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Localización de viveros en Chile continental (Capa N° 51). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/agricultura-y-ganaderia/"
    },
    'capa_52': {
      id: 'capa_52',
      num_bbdd: 52,
      nombre: "Estaciones Meteorológicas Automáticas (FIA)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/clima/",
      archivoLocal: "data/capa_estaciones_meteorologicas.geojson",
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 52: 'Estaciones Meteorológicas Automáticas (FIA)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Estaciones Meteorológicas Automáticas (FIA) (Capa N° 52). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/clima/"
    },
    'capa_53': {
      id: 'capa_53',
      num_bbdd: 53,
      nombre: "Industria Forestal Primeria (INFOR)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/",
      archivoLocal: "data/capa_oficial_53.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 53: 'Industria Forestal Primeria (INFOR)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Industria Forestal Primeria (INFOR) (Capa N° 53). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/"
    },
    'capa_54': {
      id: 'capa_54',
      num_bbdd: 54,
      nombre: "Mercados Mayoristas (ODEPA)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/",
      archivoLocal: "data/capa_oficial_54.geojson",
      color: '#F97316',
      icono: '💰',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'economico_agricola',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 54: 'Mercados Mayoristas (ODEPA)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Mercados Mayoristas (ODEPA) (Capa N° 54). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/"
    },
    'capa_55': {
      id: 'capa_55',
      num_bbdd: 55,
      nombre: "Sistema Nacional de Áreas Silvestres Protegidas del Estado",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: "data/capa_oficial_55.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 55: 'Sistema Nacional de Áreas Silvestres Protegidas del Estado'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Sistema Nacional de Áreas Silvestres Protegidas del Estado (Capa N° 55). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'capa_56': {
      id: 'capa_56',
      num_bbdd: 56,
      nombre: "Carbono orgánico del suelo de Chile (0-5 cm) a 100m",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: "data/capa_oficial_56.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 56: 'Carbono orgánico del suelo de Chile (0-5 cm) a 100m'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Carbono orgánico del suelo de Chile (0-5 cm) a 100m (Capa N° 56). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'capa_57': {
      id: 'capa_57',
      num_bbdd: 57,
      nombre: "Carbono orgánico del suelo de Chile (5-15 cm) a 100m",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: "data/capa_oficial_57.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 57: 'Carbono orgánico del suelo de Chile (5-15 cm) a 100m'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Carbono orgánico del suelo de Chile (5-15 cm) a 100m (Capa N° 57). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'capa_58': {
      id: 'capa_58',
      num_bbdd: 58,
      nombre: "Carbono orgánico del suelo de Chile (15-30 cm) a 100m",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: "data/capa_oficial_58.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 58: 'Carbono orgánico del suelo de Chile (15-30 cm) a 100m'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Carbono orgánico del suelo de Chile (15-30 cm) a 100m (Capa N° 58). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'capa_59': {
      id: 'capa_59',
      num_bbdd: 59,
      nombre: "Cobertura de canales a nivel nacional",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/aguas-continentales/",
      archivoLocal: "data/capa_oficial_59.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 59: 'Cobertura de canales a nivel nacional'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cobertura de canales a nivel nacional (Capa N° 59). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/aguas-continentales/"
    },
    'capa_60': {
      id: 'capa_60',
      num_bbdd: 60,
      nombre: "Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/planificacion-catastral/",
      archivoLocal: "data/capa_oficial_60.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 60: 'Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII)'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII) (Capa N° 60). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/planificacion-catastral/"
    },
    'capa_61': {
      id: 'capa_61',
      num_bbdd: 61,
      nombre: "Cambio de Uso de la Tierra de la Región Metropolitana para el periodo 2001-2023",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/planificacion-catastral/",
      archivoLocal: "data/capa_oficial_61.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 61: 'Cambio de Uso de la Tierra de la Región Metropolitana para el periodo 2001-2023'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cambio de Uso de la Tierra de la Región Metropolitana para el periodo 2001-2023 (Capa N° 61). IDE Chile / Geoportal de Chile. https://ide.minagri.gob.cl/descarga-de-capas-shp/planificacion-catastral/"
    },
    'capa_62': {
      id: 'capa_62',
      num_bbdd: 62,
      nombre: "Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025",
      institucion: "Estado de Chile / IDE Chile / icet.odepa.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://icet.odepa.gob.cl/",
      archivoLocal: "data/capa_oficial_62.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 62: 'Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025 (Capa N° 62). IDE Chile / Geoportal de Chile. https://icet.odepa.gob.cl/"
    },
    'capa_63': {
      id: 'capa_63',
      num_bbdd: 63,
      nombre: "Inventario de Biomasa y Carbono - Metropolitana tipo Forestal",
      institucion: "Estado de Chile / IDE Chile / sit.conaf.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://sit.conaf.cl/",
      archivoLocal: "data/capa_oficial_63.geojson",
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 63: 'Inventario de Biomasa y Carbono - Metropolitana tipo Forestal'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Inventario de Biomasa y Carbono - Metropolitana tipo Forestal (Capa N° 63). IDE Chile / Geoportal de Chile. https://sit.conaf.cl/"
    },
    'capa_64': {
      id: 'capa_64',
      num_bbdd: 64,
      nombre: "Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/bases-de-datos-agosto-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 64: 'Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto (Capa N° 64). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/bases-de-datos-agosto-2026"
    },
    'capa_65': {
      id: 'capa_65',
      num_bbdd: 65,
      nombre: "Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026.",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/registro-de-proyectos-de-inversion?page=1",
      archivoLocal: "data/bip_inversiones_santiago.csv",
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "Comuna / Región Metropolitana",
      descripcion: "Capa cartográfica e indicador territorial N° 65: 'Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026.'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026. (Capa N° 65). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/registro-de-proyectos-de-inversion?page=1"
    },
    'capa_66': {
      id: 'capa_66',
      num_bbdd: 66,
      nombre: "Unidades Vecinales 2026",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/shape-de-unidades-vecinales-del-registro-social-de-hogares",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: null,
      descripcion: "Capa cartográfica e indicador territorial N° 66: 'Unidades Vecinales 2026'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Unidades Vecinales 2026 (Capa N° 66). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/shape-de-unidades-vecinales-del-registro-social-de-hogares"
    },
    'capa_67': {
      id: 'capa_67',
      num_bbdd: 67,
      nombre: "Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-en-situacion-dependencia-funcional-segun-cse-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 67: 'Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto (Capa N° 67). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-en-situacion-dependencia-funcional-segun-cse-2026"
    },
    'capa_68': {
      id: 'capa_68',
      num_bbdd: 68,
      nombre: "Personas en RSH según CSE y sexo - 2026 Agosto",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-segun-cse-y-sexo-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 68: 'Personas en RSH según CSE y sexo - 2026 Agosto'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Personas en RSH según CSE y sexo - 2026 Agosto (Capa N° 68). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-segun-cse-y-sexo-2026"
    },
    'capa_69': {
      id: 'capa_69',
      num_bbdd: 69,
      nombre: "NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/nna-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 69: 'NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 69). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/nna-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'capa_70': {
      id: 'capa_70',
      num_bbdd: 70,
      nombre: "Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/mujeres-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 70: 'Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 70). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/mujeres-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'capa_71': {
      id: 'capa_71',
      num_bbdd: 71,
      nombre: "Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/jovenes-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 71: 'Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 71). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/jovenes-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'capa_72': {
      id: 'capa_72',
      num_bbdd: 72,
      nombre: "Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/hombres-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 72: 'Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 72). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/hombres-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'capa_73': {
      id: 'capa_73',
      num_bbdd: 73,
      nombre: "Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-mayores-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 73: 'Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 73). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/personas-mayores-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'capa_74': {
      id: 'capa_74',
      num_bbdd: 74,
      nombre: "Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: "Organismo Público del Estado de Chile",
      tipoServicio: "Servicio OGC / ArcGIS FeatureServer / Shapefile / CSV BIDAT",
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-ocupadas-y-cotizando-por-modalidad-contractual-segun-tramo-cse-2026",
      archivoLocal: "data/capa_unidades_vecinales_bidat.geojson",
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 74: 'Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio'. Integrada al catálogo del Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: "Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.",
      citaAPA: "Estado de Chile. (2026). Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio (Capa N° 74). IDE Chile / Geoportal de Chile. https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-ocupadas-y-cotizando-por-modalidad-contractual-segun-tramo-cse-2026"
    },
  };

  // Diccionario multirregional escalable de endpoints IPT en MINVU GeoIDE
  const SERVICIOS_IPT_CHILE = {
    'RM': {
      nombre: 'Región Metropolitana de Santiago',
      servicios: {
        prc_norte: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_RM_Norte/MapServer',
        prc_sur: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_RM_Sur/MapServer',
        prms: 'https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer',
        areas_verdes: 'https://geoide.minvu.cl/server/rest/services/IPT/%C3%81reas_verdes_IPT/FeatureServer',
        areas_riesgo: 'https://geoide.minvu.cl/server/rest/services/IPT/IPT_AREA_RIESGO/FeatureServer',
        limites_urbanos: 'https://geoide.minvu.cl/server/rest/services/IPT/Limites_Urbanos/FeatureServer',
        patrimonio: 'https://geoide.minvu.cl/server/rest/services/IPT/Patrimonio/MapServer'
      }
    },
    '05_VALPARAISO': {
      nombre: 'Región de Valparaíso',
      servicios: {
        prc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_Valpara%C3%ADso/MapServer',
        premval: 'https://geoide.minvu.cl/server/rest/services/IPT/PREMVAL/MapServer',
        pri: 'https://geoide.minvu.cl/server/rest/services/IPT/PRI_Valparaiso/MapServer'
      }
    },
    '08_BIOBIO': {
      nombre: 'Región del Biobío',
      servicios: {
        prc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_Biobio/MapServer',
        prmc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRMC/MapServer'
      }
    },
    '09_ARAUCANIA': {
      nombre: 'Región de La Araucanía',
      servicios: {
        prc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_Araucania/MapServer',
        pri: 'https://geoide.minvu.cl/server/rest/services/IPT/PRI_Araucan%C3%ADa/MapServer'
      }
    },
    '02_ANTOFAGASTA': {
      nombre: 'Región de Antofagasta',
      servicios: {
        prc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_Antofagasta/MapServer',
        pri: 'https://geoide.minvu.cl/server/rest/services/IPT/PRI_Antofagasta/MapServer'
      }
    },
    '16_NUBLE': {
      nombre: 'Región de Ñuble',
      servicios: {
        prc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_Nuble/MapServer',
        pri: 'https://geoide.minvu.cl/server/rest/services/IPT/PRI_Chill%C3%A1n___Chill%C3%A1n_Viejo/MapServer'
      }
    },
    '10_LOS_LAGOS': {
      nombre: 'Región de Los Lagos',
      servicios: {
        prc: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_Los_Lagos/MapServer'
      }
    }
  };

  const cacheCapasOficiales = new Map();

  /**
   * Consulta una capa oficial: intenta FeatureServer en vivo si corresponde, con fallback al GeoJSON local
   */
  async function consultarCapaOficial(idCapa, bbox = null) {
    if (cacheCapasOficiales.has(idCapa)) {
      return cacheCapasOficiales.get(idCapa);
    }

    const def = CAPAS_OFICIALES[idCapa];
    if (!def) {
      throw new Error(`Capa oficial "${idCapa}" no reconocida en el catálogo.`);
    }

    const bboxConsulta = bbox || (window.NODO_CONFIG && window.NODO_CONFIG.area_por_defecto && window.NODO_CONFIG.area_por_defecto.bbox) || [-70.675, -33.450, -70.650, -33.435];
    const [minX, minY, maxX, maxY] = bboxConsulta;

    let geojson = null;
    let fuenteUsada = 'Servicio Oficial en Vivo';

    // 1. Intento de consulta en vivo al FeatureServer si está definido (timeout ágil de 2s)
    if (def.urlServicio && def.tipoServicio.indexOf('FeatureServer') !== -1) {
      const urlLive = `${def.urlServicio}/query?where=1%3D1&geometry=${minX}%2C${minY}%2C${maxX}%2C${maxY}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&f=geojson`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const resp = await fetch(urlLive, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const data = await resp.json();
          if (data && data.features && data.features.length > 0) {
            geojson = data;
            fuenteUsada = `${def.institucion} (FeatureServer en Vivo)`;
          }
        }
      } catch (errLive) {
        console.warn(`[ModuloIDEChile]: FeatureServer en vivo no respondió para ${idCapa} (${errLive.message}). Activando réplica local validada...`);
      }
    }

    // 2. Carga desde repositorio local validado en src/data/
    if (!geojson) {
      const rutas = [
        def.archivoLocal,
        `./${def.archivoLocal}`,
        `../${def.archivoLocal}`,
        `src/${def.archivoLocal}`
      ];

      for (const r of rutas) {
        try {
          const resp = await fetch(r);
          if (resp.ok) {
            geojson = await resp.json();
            fuenteUsada = `${def.institucion} (Conjunto Oficial Descargado / Geoportal)`;
            break;
          }
        } catch (_) {}
      }
    }

    if (!geojson) {
      throw new Error(`No fue posible cargar la capa oficial "${def.nombre}" ni en vivo ni desde el repositorio local.`);
    }

    // Normalizar atributos de cada feature para visualización y popup estándar
    geojson.features = (geojson.features || []).map((feat, idx) => {
      const props = feat.properties || {};

      let nombreEntidad = 'Entidad Oficial';
      let detalleTipo = def.nombre;
      let extraInfo = {};

      if (idCapa === 'censo2024_manzanas') {
        const codManzana = props.COD_ENTIDAD_MANZANA || props.MANZANA || props.ID_NIVEL_CENSAL || `MZ-${idx + 1}`;
        const poblacion = props.n_per !== undefined ? Number(props.n_per).toLocaleString('es-CL') : 'No disp.';
        const hombres = props.n_hombres !== undefined ? Number(props.n_hombres).toLocaleString('es-CL') : '-';
        const mujeres = props.n_mujeres !== undefined ? Number(props.n_mujeres).toLocaleString('es-CL') : '-';
        const viviendas = props.n_viv !== undefined ? Number(props.n_viv).toLocaleString('es-CL') : 'No disp.';

        nombreEntidad = `Manzana Censal ${codManzana}`;
        detalleTipo = `Población: ${poblacion} hab. | Viviendas: ${viviendas}`;
        extraInfo = {
          'Población Total': `${poblacion} personas`,
          'Hombres': hombres,
          'Mujeres': mujeres,
          'Viviendas Particulares': viviendas,
          'Comuna': props.COMUNA || 'Santiago',
          'Código Censal': codManzana
        };
      } else if (idCapa === 'minvu_patrimonio') {
        nombreEntidad = props.NOMBRE || props.DENOMINACION || props.DIRECCION || 'Inmueble Patrimonial';
        detalleTipo = props.CATEGORIA || (props.ZCH ? 'Zona de Conservación Histórica' : 'Inmueble de Conservación Histórica');
        extraInfo = {
          'Categoría IPT': detalleTipo,
          'Dirección': props.DIRECCION || 'No indicada',
          'Comuna': props.COMUNA || 'Santiago',
          'Región': props.REGION || 'Metropolitana'
        };
      } else if (idCapa === 'minvu_parques') {
        nombreEntidad = props.NOMBRE || 'Parque Urbano';
        detalleTipo = 'Parque Urbano Catastrado (MINVU)';
        extraInfo = {
          'Superficie Oficial': props.SUPERFICIE ? `${Number(props.SUPERFICIE).toLocaleString('es-CL')} m²` : 'No indicada',
          'Dirección': props.DIRECCION || 'Barrio Brasil / Yungay',
          'Comuna': props.COM || props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'minvu_barrios_historicos') {
        nombreEntidad = `Barrio Histórico ${props.BARRIO || 'Yungay - Brasil'}`;
        detalleTipo = `Programa ${props.TIPO || 'Patrimonial'} — Quiero Mi Barrio`;
        extraInfo = {
          'Estado Programa': props.ESTADO_CB || 'Consolidado',
          'Habitantes Estimados': props.NRO_HAB ? Number(props.NRO_HAB).toLocaleString('es-CL') : '-',
          'Viviendas': props.NRO_VIV || '-',
          'Año Inicio': props.A_INICIO || '2012'
        };
      } else if (idCapa === 'educacion_superior') {
        nombreEntidad = props.NOMBRE_INS || props.NOMBRE_INM || props.NOMBRE || 'Institución de Educación Superior';
        detalleTipo = props.TIPO_INST || 'Universidad / IP / CFT';
        extraInfo = {
          'Tipo Institución': detalleTipo,
          'Sede / Inmueble': props.NOMBRE_INM || '-',
          'Dirección': `${props.DIRECCION || ''} ${props.NUMERO_DI || ''}`.trim() || 'Santiago',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'educacion_escolar') {
        nombreEntidad = props.NOM_RBD || props.NOMBRE || 'Establecimiento Escolar';
        detalleTipo = props.PAGO || props.DEPENDENCIA || 'Colegio / Escuela';
        extraInfo = {
          'RBD': props.RBD || '-',
          'Dependencia': detalleTipo,
          'Dirección': `${props.DIRECCION || ''} ${props.NUMERO || ''}`.trim() || 'Santiago',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'educacion_parvularia') {
        nombreEntidad = props.NOM_EST || props.NOMBRE || 'Jardín Infantil';
        detalleTipo = props.ADMIN || props.TIPO || 'Educación Parvularia';
        extraInfo = {
          'Administración': detalleTipo,
          'Dirección': `${props.DIRECCION || ''} ${props.NUMERO || ''}`.trim() || 'Santiago',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'establecimientos_salud') {
        nombreEntidad = props.nombre || props.NOMBRE || 'Centro de Salud';
        detalleTipo = props.tipo || 'Atención Primaria / Hospitalaria';
        extraInfo = {
          'Tipo Establecimiento': detalleTipo,
          'Dependencia': props.dependencia || '-',
          'Dirección': props.direccion || 'Santiago',
          'Comuna': props.comuna || 'Santiago'
        };
      } else if (idCapa === 'bomberos') {
        nombreEntidad = props.NOMBRE || props.CIA || props.COMPANIA || 'Compañía de Bomberos';
        detalleTipo = 'Cuerpo de Bomberos de Santiago (CBS)';
        extraInfo = {
          'Cuerpo': props.CUERPO || 'Santiago',
          'Dirección': props.DIRECCION || 'Santiago',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'carabineros') {
        nombreEntidad = props.NOMBRE || props.UNIDAD || 'Cuartel de Carabineros';
        detalleTipo = props.TIPO || 'Comisaría / Prefectura';
        extraInfo = {
          'Prefectura': props.PREFECTURA || 'Santiago Central',
          'Dirección': props.DIRECCION || 'Santiago',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'estaciones_metro') {
        nombreEntidad = props.nombre || 'Estación de Metro';
        detalleTipo = `Línea ${props.linea || 'Metro'}`;
        extraInfo = {
          'Línea': props.linea || '-',
          'Dirección': props.direccion || '-',
          'Comuna': props.comuna || 'Santiago'
        };
      } else if (idCapa === 'red_ferroviaria') {
        nombreEntidad = props.NOMBRE || props.TRAMO || 'Trazado Ferroviario EFE';
        detalleTipo = props.TIPO || 'Vía Férrea Principal';
        extraInfo = {
          'Estado': props.ESTADO || 'En Operación',
          'Operador': 'EFE Central'
        };
      } else if (idCapa === 'cmn_sitios_memoria') {
        nombreEntidad = props.nombre || 'Sitio de Memoria CMN';
        detalleTipo = props.tipo_declaratoria || 'Monumento Histórico';
        extraInfo = {
          'Decreto': props.decreto || 'No indicado',
          'Dirección': props.direccion || 'Santiago',
          'Comuna': props.comuna || 'Santiago'
        };
      } else if (idCapa === 'limite_urbano_censal') {
        nombreEntidad = `Límite Urbano ${props.d_COMUNA || 'Santiago'}`;
        detalleTipo = 'Área Urbana Censal (INE)';
        extraInfo = {
          'Comuna': props.d_COMUNA || 'Santiago',
          'Región': props.d_REGION || 'Metropolitana'
        };
      } else if (idCapa === 'minvu_ipt_prc_santiago') {
        const zonaCodigo = props.ZONA || '';
        const zonaNom = props.NOM || '';
        nombreEntidad = zonaCodigo ? `Zona ${zonaCodigo}: ${zonaNom}` : (zonaNom || 'Zona Normativa PRC');
        detalleTipo = `Plan Regulador Comunal de Santiago (${props.T_DO || 'Res.'} ${props.N_DOC || ''})`;
        extraInfo = {
          'Zona Normativa': zonaCodigo,
          'Nombre Zona': zonaNom,
          'Usos Permitidos': props.UPERM || 'Ver ordenanza local',
          'Usos Prohibidos': props.UPROH || 'Ver ordenanza local',
          'Fecha D.O.': props.P_DO || '-',
          'Instrumento': `${props.T_DO || 'Resolución'} N° ${props.N_DOC || ''}`
        };
      } else if (idCapa === 'minvu_ipt_prms_usosuelo') {
        nombreEntidad = props.NOMBRE || props.Capa || 'Uso de Suelo Metropolitano';
        detalleTipo = props.UPREF || 'Zonificación PRMS (Metropolitano)';
        extraInfo = {
          'Uso Preferente': props.UPREF || '-',
          'Uso Permitido': props.UPERM || '-',
          'Normativa PRMS': props.NORMA || 'Ordenanza PRMS',
          'Superficie (ha)': props.SUP_HA ? `${props.SUP_HA} ha` : '-',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'minvu_ipt_areas_verdes') {
        nombreEntidad = props.NOMBRE || 'Área Verde Normada (IPT)';
        detalleTipo = `Área Verde Normativa (${props.TIPO_AV || 'IPT'})`;
        extraInfo = {
          'Tipo de Área Verde': props.TIPO_AV || 'Área Verde',
          'Zona Normativa': props.Zona || '-',
          'Superficie Normativa': props.Ha ? `${Number(props.Ha).toFixed(2)} ha` : '-',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'minvu_ipt_areas_riesgo') {
        nombreEntidad = props.NOM || props.NOMBRE || 'Área de Riesgo Normativa';
        detalleTipo = props.CAT || props.Capa || 'Restricción por Riesgo (Art. 2.1.17 OGUC)';
        extraInfo = {
          'Tipo / Categoría de Riesgo': props.CAT || props.NOMBRE || 'Restricción',
          'Condición Normativa': props.UPROH || props.NORMA || 'Restricción constructiva según OGUC',
          'Comuna': props.COM || props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'minvu_ipt_resguardo_infraestructura') {
        nombreEntidad = props.NOMBRE || props.Capa || 'Faja de Resguardo PRMS';
        detalleTipo = 'Resguardo de Infraestructura Metropolitana';
        extraInfo = {
          'Infraestructura': props.NOMBRE || 'Corredor Metropolitano',
          'Norma': props.NORMA || 'Cap. 8.4 PRMS',
          'Capa': props.Capa || 'Faja de Resguardo'
        };
      } else if (idCapa === 'minvu_ipt_limite_urbano') {
        nombreEntidad = `Límite Urbano Oficial Comuna de Santiago`;
        detalleTipo = 'Límite Urbano Normativo PRC';
        extraInfo = {
          'Instrumento': props.INSTRUM || 'Plan Regulador Comunal de Santiago',
          'Publicación D.O.': props.P_DO || '-',
          'Norma Legal': `${props.T_DO || 'Resolución'} N° ${props.N_DO || ''}`,
          'Administración': props.ADMIN || 'SEREMI MINVU / Municipalidad'
        };
      } else if (idCapa === 'ide_minvu_campamentos') {
        nombreEntidad = props.Nombre_Campamento || props.NOMBRE || 'Campamento Precario';
        detalleTipo = 'Asentamiento Precario (Catastro Oficial 2024)';
        extraInfo = {
          'Hogares': props.N_HOGARES || props.HOGARES || '-',
          'Tipo de Terreno': props.TIPO_TERRENO || 'Fiscal / Privado',
          'Estrategia MINVU': props.ESTRATEGIA || 'Radicación / Relocalización',
          'Comuna': props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'ide_minvu_condominios_sociales') {
        nombreEntidad = props.NOM || 'Condominio Social';
        detalleTipo = props.PROGRAMA || 'Copropiedad Inmobiliaria Social (Ley 21.442)';
        extraInfo = {
          'Viviendas Totales': props.VIV_TOT || '-',
          'Bloques': props.BLOQUES || '-',
          'Dirección': `${props.DIRECC || ''} ${props.NUM_P_EDIF || ''}`.trim() || 'Santiago',
          'Año Recepción': props.AÑO_RECEP || '-'
        };
      } else if (idCapa === 'ide_minvu_inventario_humedales') {
        nombreEntidad = props.nombre_humedal || props.NOM_HUM || props.nombre || 'Humedal Protegido';
        detalleTipo = props.tipo_humedal || 'Humedal Urbano / Continental (Ley 21.202)';
        extraInfo = {
          'Clasificación': props.tipo_humedal || 'Humedal',
          'Superficie (ha)': props.superficie_ha ? `${Number(props.superficie_ha).toFixed(2)} ha` : '-',
          'Comuna': props.nom_comuna || props.COMUNA || 'Santiago'
        };
      } else if (idCapa === 'ide_minvu_unidades_vecinales_rsh') {
        nombreEntidad = `Unidad Vecinal N° ${props.uv_carto || props.t_uv_nom || props.OBJECTID}`;
        detalleTipo = 'Unidad Vecinal Oficial (MDS / RSH 2024)';
        extraInfo = {
          'Comuna': props.t_com_nom || 'Santiago',
          'Provincia': props.t_prov_nom || 'Santiago',
          'ID Cartográfico': props.t_id_uv_ca || '-'
        };
      } else if (idCapa === 'ide_minvu_ipt_prms_riesgo') {
        nombreEntidad = `Zona de Riesgo PRMS: ${props.ZONA || props.DESCRIP || 'Riesgo Natural'}`;
        detalleTipo = 'Área de Riesgo Metropolitano (Art. 2.1.17 OGUC)';
        extraInfo = {
          'Tipo de Riesgo': props.TIPO_RIESGO || props.DESCRIP || 'Inundación / Remoción en Masa',
          'Marco Normativo': 'Art. 2.1.17 OGUC / PRMS',
          'Instrumento': 'Plan Regulador Metropolitano de Santiago'
        };
      } else if (idCapa === 'ide_subdere_dpa_comunas') {
        nombreEntidad = `Comuna de ${props.NOM_COMUNA || props.COMUNA || 'Santiago'}`;
        detalleTipo = 'División Político-Administrativa (SUBDERE / IGM)';
        extraInfo = {
          'Código CUT': props.CUT || '-',
          'Provincia': props.NOM_PROVINCIA || props.PROVINCIA || '-',
          'Región': props.NOM_REGION || props.REGION || 'Metropolitana de Santiago'
        };
      } else if (idCapa === 'ide_minvu_ciclovias') {
        nombreEntidad = props.NOMBRE || props.CALLE || 'Ciclovía Urbana';
        detalleTipo = 'Infraestructura Cicloinclusiva Oficial (MINVU)';
        extraInfo = {
          'Eje Vial': props.CALLE || props.NOMBRE || '-',
          'Estado': props.ESTADO || 'Consolidada',
          'Sentido': props.SENTIDO || 'Bidireccional'
        };
      }

      props._idOficial = idCapa;
      props._nombre = nombreEntidad;
      props._subtipo = detalleTipo;
      props._institucion = def.institucion;
      props._fuente = fuenteUsada;
      props._licencia = 'Ley N° 20.285 / Datos Abiertos Estado de Chile';
      props._citaAPA = def.citaAPA;
      props._declaracion = def.declaracion;
      
      if (Object.keys(extraInfo).length === 0) {
        let count = 0;
        for (const [k, v] of Object.entries(props)) {
          if (!k.startsWith('_') && v !== null && v !== undefined && v !== '' && count < 4) {
            extraInfo[k] = String(v);
            count++;
          }
        }
        if (count === 0) {
          extraInfo['Atributo 1'] = props.NOMBRE || props.nombre || props.ID || props.id || 'Entidad Oficial';
          extraInfo['Fuente'] = def.institucion;
        }
      }

      props._extraInfo = extraInfo;
      props._color = def.color;
      props._icono = def.icono;

      return {
        ...feat,
        properties: props
      };
    });

    const resultadoFinal = {
      def,
      fuenteUsada,
      geojson,
      cantidad: geojson.features.length
    };
    cacheCapasOficiales.set(idCapa, resultadoFinal);
    return resultadoFinal;
  }

  /**
   * Crea una capa WMS de Leaflet para los servicios oficiales que soportan GetMap
   */
  function crearCapaWMSLeaflet(idCapa) {
    const def = CAPAS_OFICIALES[idCapa];
    if (!def || !def.urlWMS || typeof L === 'undefined') return null;

    return L.tileLayer.wms(def.urlWMS, {
      layers: def.capasWMS,
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      attribution: `&copy; ${def.institucion} (WMS OGC)`
    });
  }

  function obtenerCapasDisponibles() {
    return Object.values(CAPAS_OFICIALES);
  }

  function obtenerDefinicion(idCapa) {
    return CAPAS_OFICIALES[idCapa] || null;
  }

  return {
    CAPAS_OFICIALES,
    SERVICIOS_IPT_CHILE,
    consultarCapaOficial,
    crearCapaWMSLeaflet,
    obtenerCapasDisponibles,
    obtenerDefinicion
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloIDEChile = ModuloIDEChile;
}
