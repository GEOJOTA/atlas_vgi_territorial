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
    // =========================================================================
    // CAPAS OFICIALES BASE ORIGINALES (27 CAPAS BASE)
    // =========================================================================
    // =========================================================================
    // CAPAS OFICIALES BASE ORIGINALES (27 CAPAS BASE)
    // =========================================================================
    censo2024_manzanas: {
      id: 'censo2024_manzanas',
      nombre: 'Censo 2024 (Manzanas)',
      institucion: 'Instituto Nacional de Estadísticas (INE) / IDE Chile',
      ministerio: 'Ministerio de Economía, Fomento y Turismo',
      tipoServicio: 'ArcGIS FeatureServer (Capa 7)',
      urlServicio: 'https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/CPV2024_Microdato_gdb/FeatureServer/7',
      archivoLocal: 'data/ide_censo2024_manzanas.geojson',
      color: '#1B4D3E',
      icono: '⬚',
      geometria: 'Polígonos (Manzanas)',
      grupo: 'demografia',
      descripcion: 'Manzanas censales oficiales del Censo de Población y Vivienda 2024 con microdatos de población total, hombres, mujeres y viviendas particulares.',
      declaracion: 'Datos provistos por el Instituto Nacional de Estadísticas (INE) y la Secretaría Ejecutiva SNIT / IDE Chile. Licencia de Datos Abiertos del Estado de Chile conforme a la Ley N° 20.285.',
      citaAPA: 'Instituto Nacional de Estadísticas [INE]. (2024). Censo de Población y Vivienda 2024: Microdatos Georreferenciados a Nivel de Manzana. IDE Chile. https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/CPV2024_Microdato_gdb/FeatureServer/7'
    },
    minvu_patrimonio: {
      id: 'minvu_patrimonio',
      nombre: 'Patrimonio IPT (Monumentos e ICH)',
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU)',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer / WMS',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/Patrimonio/MapServer/0',
      urlWMS: 'https://geoide.minvu.cl/server/services/IPT/Patrimonio/MapServer/WMSServer',
      capasWMS: '0,1',
      archivoLocal: 'data/ide_minvu_patrimonio.geojson',
      color: '#8F3A2C',
      icono: '🏛',
      geometria: 'Puntos y Polígonos',
      grupo: 'patrimonio',
      descripcion: 'Catastro oficial de Inmuebles de Conservación Histórica (ICH) y Zonas de Conservación Histórica (ZCH) normadas por Instrumentos de Planificación Territorial en Barrio Brasil y Santiago Centro.',
      declaracion: 'Información oficial producida por la División de Desarrollo Urbano del MINVU y publicada en geoide.minvu.cl e IDE Chile.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Oficial de Patrimonio en Instrumentos de Planificación Territorial (IPT). DDU, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/Patrimonio/MapServer'
    },
    minvu_parques: {
      id: 'minvu_parques',
      nombre: 'Parques Urbanos y Plazas (MINVU)',
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU)',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer / WMS',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Catastros/Catastro_de_parques_urbanos/MapServer/0',
      urlWMS: 'https://geoide.minvu.cl/server/services/Catastros/Catastro_de_parques_urbanos/MapServer/WMSServer',
      capasWMS: '0',
      archivoLocal: 'data/ide_minvu_parques.geojson',
      color: '#236B43',
      icono: '🌲',
      geometria: 'Polígonos (Parques)',
      grupo: 'espacio_publico',
      descripcion: 'Catastro georreferenciado de parques y plazas públicas urbanas (Plaza Brasil, Plaza Yungay, Parque Portales).',
      declaracion: 'Catastro Oficial de Parques Urbanos del MINVU conforme a la Política Nacional de Parques Urbanos.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Nacional de Parques Urbanos de Chile. Secretaría Ejecutiva SNIT / IDE Chile. https://geoide.minvu.cl/server/rest/services/Catastros/Catastro_de_parques_urbanos/MapServer'
    },
    minvu_barrios_historicos: {
      id: 'minvu_barrios_historicos',
      nombre: 'Barrios Históricos (Quiero Mi Barrio)',
      institucion: 'MINVU / Programa Quiero Mi Barrio',
      ministerio: 'Secretaría Ejecutiva de Barrios',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Planes_Programas/Barrios_Historicos/MapServer/0',
      archivoLocal: 'data/ide_minvu_barrios_historicos.geojson',
      color: '#7D5A2B',
      icono: '🏘',
      geometria: 'Polígonos (Barrios)',
      grupo: 'patrimonio',
      descripcion: 'Polígono oficial de recuperación urbana del Barrio Histórico Yungay / Brasil.',
      declaracion: 'Polígonos oficiales del Programa de Recuperación de Barrios Patrimoniales del MINVU.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Delimitación Oficial de Barrios Históricos. Secretaría Ejecutiva de Barrios, MINVU. https://geoide.minvu.cl/server/rest/services/Planes_Programas/Barrios_Historicos/MapServer'
    },
    educacion_superior: {
      id: 'educacion_superior',
      nombre: 'Educación Superior (MINEDUC)',
      institucion: 'Ministerio de Educación (MINEDUC) / IDE Chile',
      ministerio: 'Subsecretaría de Educación Superior',
      tipoServicio: 'Geoportal de Chile (Shapefile Oficial)',
      urlServicio: 'https://www.geoportal.cl/geoportal/catalog/download/0dde8427-113a-356a-bace-ed4d51ddcb05',
      archivoLocal: 'data/ide_educacion_superior.geojson',
      color: '#1C523A',
      icono: '🏫',
      geometria: 'Puntos (Sedes Universitarias)',
      grupo: 'educacion',
      descripcion: 'Catastro oficial de universidades, institutos profesionales y centros de formación técnica (incluyendo sedes de la Universidad Alberto Hurtado y planteles de Barrio Brasil/Santiago Centro).',
      declaracion: 'Catastro Oficial de Instituciones de Educación Superior publicado por el MINEDUC en Geoportal de Chile.',
      citaAPA: 'Ministerio de Educación [MINEDUC]. (2024). Catastro Nacional de Instituciones y Sedes de Educación Superior. Geoportal de Chile / IDE Chile. https://www.geoportal.cl'
    },
    educacion_escolar: {
      id: 'educacion_escolar',
      nombre: 'Colegios y Liceos (MINEDUC)',
      institucion: 'Ministerio de Educación (MINEDUC) / IDE Chile',
      ministerio: 'Subsecretaría de Educación',
      tipoServicio: 'Geoportal de Chile (Shapefile Oficial)',
      urlServicio: 'https://www.geoportal.cl/geoportal/catalog/download/d6bf9431-3282-3738-bd69-baf0d1ad63ec',
      archivoLocal: 'data/ide_educacion_escolar.geojson',
      color: '#285B75',
      icono: '🏫',
      geometria: 'Puntos (Establecimientos)',
      grupo: 'educacion',
      descripcion: 'Establecimientos de educación básica y media de Santiago Centro con información de dependencia, RBD y matrícula.',
      declaracion: 'Datos abiertos de infraestructura escolar distribuidos por el MINEDUC e IDE Chile.',
      citaAPA: 'Ministerio de Educación [MINEDUC]. (2024). Directorio Oficial de Establecimientos de Educación Escolar. IDE Chile / Geoportal. https://www.geoportal.cl'
    },
    educacion_parvularia: {
      id: 'educacion_parvularia',
      nombre: 'Jardines y Salas Cuna (JUNJI / Integra)',
      institucion: 'JUNJI / Fundación Integra / MINEDUC / IDE Chile',
      ministerio: 'Subsecretaría de Educación Parvularia',
      tipoServicio: 'Geoportal de Chile (Shapefile Oficial)',
      urlServicio: 'https://www.geoportal.cl/geoportal/catalog/download/b52e4229-365e-3163-b211-679cc6b2fd99',
      archivoLocal: 'data/ide_educacion_parvularia.geojson',
      color: '#417A63',
      icono: '🏫',
      geometria: 'Puntos (Jardines)',
      grupo: 'educacion',
      descripcion: 'Salas cuna y jardines infantiles de administración pública, JUNJI y Fundación Integra en la comuna de Santiago.',
      declaracion: 'Registro nacional georreferenciado de educación parvularia publicado en Geoportal de Chile.',
      citaAPA: 'Subsecretaría de Educación Parvularia. (2024). Directorio Nacional de Establecimientos de Educación Parvularia. Geoportal de Chile. https://www.geoportal.cl'
    },
    establecimientos_salud: {
      id: 'establecimientos_salud',
      nombre: 'Salud Pública (CESFAM y Hospitales)',
      institucion: 'Ministerio de Salud (MINSAL) / DEIS / IDE Chile',
      ministerio: 'Subsecretaría de Redes Asistenciales',
      tipoServicio: 'DEIS / datos.gob.cl / IDE Chile',
      urlServicio: 'https://datos.gob.cl/dataset/3bf4cf7c-f638-4735-9a01-f65faae4beca',
      archivoLocal: 'data/ide_establecimientos_salud.geojson',
      color: '#B22222',
      icono: '🏥',
      geometria: 'Puntos (Salud)',
      grupo: 'salud',
      descripcion: 'Establecimientos de atención primaria (CESFAM, CECOSF), postas y hospitales de la red del Servicio de Salud Metropolitano Central.',
      declaracion: 'Registro oficial del Departamento de Estadísticas e Información de Salud (DEIS), Ministerio de Salud.',
      citaAPA: 'Ministerio de Salud [MINSAL]. (2024). Catastro Nacional de Establecimientos Asistenciales de Salud. DEIS / IDE Chile. https://datos.gob.cl'
    },
    bomberos: {
      id: 'bomberos',
      nombre: 'Cuarteles de Bomberos de Chile',
      institucion: 'Junta Nacional de Cuerpos de Bomberos / IDE Chile',
      ministerio: 'Ministerio del Interior y Seguridad Pública',
      tipoServicio: 'Geoportal de Chile (Shapefile Oficial)',
      urlServicio: 'https://www.geoportal.cl/geoportal/catalog/download/e476987d-7422-3fa4-b02a-0c67ce3b3ac8',
      archivoLocal: 'data/ide_bomberos.geojson',
      color: '#C71585',
      icono: '🚒',
      geometria: 'Puntos (Cuarteles)',
      grupo: 'seguridad',
      descripcion: 'Compañías del Cuerpo de Bomberos de Santiago (CBS) que atienden Barrio Brasil, Yungay y el centro histórico.',
      declaracion: 'Catastro oficial de cuarteles de bomberos provisto para la gestión de riesgos y emergencias en IDE Chile.',
      citaAPA: 'Cuerpo de Bomberos de Chile. (2024). Catastro Georreferenciado de Compañías de Bomberos. Geoportal de Chile / IDE Chile. https://www.geoportal.cl'
    },
    carabineros: {
      id: 'carabineros',
      nombre: 'Comisarías y Cuarteles Policiales',
      institucion: 'Carabineros de Chile / IDE Chile',
      ministerio: 'Ministerio del Interior y Seguridad Pública',
      tipoServicio: 'Geoportal de Chile (Shapefile Oficial)',
      urlServicio: 'https://www.geoportal.cl/geoportal/catalog/download/24cae8aa-4e9c-36a9-9e92-d1dca97e3a0c',
      archivoLocal: 'data/ide_carabineros.geojson',
      color: '#2E5D3E',
      icono: '👮',
      geometria: 'Puntos (Comisarías)',
      grupo: 'seguridad',
      descripcion: 'Unidades policiales, comisarías territoriales y retenes de Carabineros de Chile en Santiago.',
      declaracion: 'Información geoespacial oficial distribuida a través de la Infraestructura de Datos Geoespaciales de Chile.',
      citaAPA: 'Carabineros de Chile. (2024). Catastro Oficial de Cuarteles y Unidades Policiales. Geoportal de Chile / IDE Chile. https://www.geoportal.cl'
    },
    estaciones_metro: {
      id: 'estaciones_metro',
      nombre: 'Estaciones de Metro de Santiago',
      institucion: 'DTPM / Metro S.A. / IDE Chile / datos.gob.cl',
      ministerio: 'Ministerio de Transportes y Telecomunicaciones (MTT)',
      tipoServicio: 'DTPM / datos.gob.cl',
      urlServicio: 'https://datos.gob.cl/dataset/71a3f5bc-9742-4b76-8f4f-d07291123bf4',
      archivoLocal: 'data/ide_estaciones_metro.geojson',
      color: '#B33928',
      icono: '🚇',
      geometria: 'Puntos (Estaciones)',
      grupo: 'transporte',
      descripcion: 'Red de estaciones de Metro de Santiago (Línea 1, Línea 2, Línea 5) que conectan Barrio Brasil (Los Héroes, Santa Ana, Cumming, República).',
      declaracion: 'Datos provistos por la Dirección de Transporte Público Metropolitano (DTPM) y Metro S.A. en datos.gob.cl.',
      citaAPA: 'Dirección de Transporte Público Metropolitano [DTPM] & Metro S.A. (2024). Red de Estaciones de Metro de Santiago. Portal de Datos Abiertos del Estado de Chile. https://datos.gob.cl'
    },
    red_ferroviaria: {
      id: 'red_ferroviaria',
      nombre: 'Red Ferroviaria EFE (MTT)',
      institucion: 'Empresa de los Ferrocarriles del Estado (EFE) / MTT / IDE Chile',
      ministerio: 'Ministerio de Transportes y Telecomunicaciones',
      tipoServicio: 'Geoportal de Chile (Shapefile Oficial)',
      urlServicio: 'https://www.geoportal.cl/geoportal/catalog/download/a29f7a5d-95f9-38ff-83f3-bebc40ddadc7',
      archivoLocal: 'data/ide_red_ferroviaria.geojson',
      color: '#34495E',
      icono: '🚆',
      geometria: 'Líneas (Vías Férreas)',
      grupo: 'transporte',
      descripcion: 'Trazados ferroviarios y cruces de la red central EFE en la Región Metropolitana (Estación Central / Santiago).',
      declaracion: 'Catastro de infraestructura ferroviaria de EFE distribuido por IDE Chile en Geoportal.',
      citaAPA: 'Empresa de los Ferrocarriles del Estado [EFE]. (2024). Red Ferroviaria y Cruces Nacionales. Geoportal de Chile. https://www.geoportal.cl'
    },
    cmn_sitios_memoria: {
      id: 'cmn_sitios_memoria',
      nombre: 'Sitios de Memoria y Monumentos CMN',
      institucion: 'Consejo de Monumentos Nacionales (CMN) / datos.gob.cl',
      ministerio: 'Ministerio de las Culturas, las Artes y el Patrimonio',
      tipoServicio: 'Conjunto de Datos Abiertos / Geoportal',
      urlServicio: 'https://datos.gob.cl/dataset/7ddfa6cf-6d0e-405a-9bd0-273d7d678bbc',
      archivoLocal: 'data/ide_cmn_sitios_memoria.geojson',
      color: '#5C4033',
      icono: '🕯',
      geometria: 'Puntos (Monumentos)',
      grupo: 'patrimonio',
      descripcion: 'Sitios de memoria y monumentos con decreto oficial de declaratoria por el Consejo de Monumentos Nacionales en la comuna de Santiago.',
      declaracion: 'Conjunto publicado en el Portal de Datos Abiertos del Estado (datos.gob.cl) y Geoportal de Chile.',
      citaAPA: 'Consejo de Monumentos Nacionales [CMN]. (2024). Sitios de Memoria y Monumentos Nacionales con Declaratoria Oficial. Portal de Datos Abiertos del Estado de Chile. https://datos.gob.cl'
    },
    limite_urbano_censal: {
      id: 'limite_urbano_censal',
      nombre: 'Límite Urbano Censal (INE)',
      institucion: 'Instituto Nacional de Estadísticas (INE) / IDE Chile',
      ministerio: 'Ministerio de Economía, Fomento y Turismo',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/Limite_Urbano_Censal/FeatureServer/0',
      archivoLocal: 'data/ide_limite_urbano_censal.geojson',
      color: '#3B5998',
      icono: '⛶',
      geometria: 'Polígono (Límite Urbano)',
      grupo: 'demografia',
      descripcion: 'Delimitación oficial del área urbana censal de la comuna de Santiago.',
      declaracion: 'Cartografía base de límites urbanos del Instituto Nacional de Estadísticas e IDE Chile.',
      citaAPA: 'Instituto Nacional de Estadísticas [INE]. (2024). Límite Urbano Censal de Chile. Secretaría Ejecutiva SNIT / IDE Chile. https://services5.arcgis.com'
    },
    minvu_ipt_prc_santiago: {
      id: 'minvu_ipt_prc_santiago',
      nombre: 'PRC Santiago: Zonificación Normativa',
      institucion: 'MINVU / I. Municipalidad de Santiago',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS MapServer / FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/PRC_RM_Norte/MapServer/31',
      archivoLocal: 'data/ide_minvu_ipt_prc_santiago.geojson',
      color: '#D97706',
      icono: '⚖',
      geometria: 'Polígonos (Zonificación Comunal)',
      grupo: 'normativa_ipt',
      descripcion: 'Zonificación urbana y normas urbanísticas oficiales del Plan Regulador Comunal de Santiago: usos permitidos (UPERM), usos prohibidos (UPROH), altura, rasante y decretos D.O.',
      declaracion: 'Normativa urbanística oficial promulgada por la I. Municipalidad de Santiago y ratificada por MINVU DDU conforme a la Ley General de Urbanismo y Construcciones (DFL 458/1975).',
      citaAPA: 'Ilustre Municipalidad de Santiago & Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Plan Regulador Comunal de Santiago: Zonificación y Ordenanza Local Oficial. DDU, MINVU / IDE Chile. https://geoide.minvu.cl/server/rest/services/IPT/PRC_RM_Norte/MapServer/31'
    },
    minvu_ipt_prms_usosuelo: {
      id: 'minvu_ipt_prms_usosuelo',
      nombre: 'PRMS: Usos de Suelo Metropolitanos',
      institucion: 'MINVU / SEREMI Metropolitana de Vivienda y Urbanismo',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer/5',
      archivoLocal: 'data/ide_minvu_ipt_prms_usosuelo.geojson',
      color: '#7C3AED',
      icono: '▧',
      geometria: 'Polígonos (Usos Metropolitanos)',
      grupo: 'normativa_ipt',
      descripcion: 'Zonificación intercomunal y macro-usos del Plan Regulador Metropolitano de Santiago: parques intercomunales, equipamiento metropolitano y fajas de desarrollo.',
      declaracion: 'Instrumento de Planificación Territorial Metropolitano regulado por el Art. 34 LGUC y administrado por SEREMI MINVU RM.',
      citaAPA: 'Secretaría Regional Ministerial Metropolitana de Vivienda y Urbanismo [SEREMI MINVU RM]. (2024). Plan Regulador Metropolitano de Santiago (PRMS): Usos de Suelo Oficiales. DDU, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer/5'
    },
    minvu_ipt_areas_verdes: {
      id: 'minvu_ipt_areas_verdes',
      nombre: 'Áreas Verdes Normativas IPT',
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU)',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/%C3%81reas_verdes_IPT/FeatureServer/0',
      archivoLocal: 'data/ide_minvu_ipt_areas_verdes.geojson',
      color: '#059669',
      icono: '🌲',
      geometria: 'Polígonos (Áreas Verdes IPT)',
      grupo: 'normativa_ipt',
      descripcion: 'Espacios verdes normados y declarados como tales por los Instrumentos de Planificación Territorial en la Comuna de Santiago (Plazas, Parques y Áreas Verdes Existentes y Proyectadas).',
      declaracion: 'Catastro Oficial de Áreas Verdes bajo régimen de IPT según Art. 59 y Art. 2.1.30 OGUC.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Áreas Verdes Declaradas en Instrumentos de Planificación Territorial. DDU, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/%C3%81reas_verdes_IPT/FeatureServer'
    },
    minvu_ipt_areas_riesgo: {
      id: 'minvu_ipt_areas_riesgo',
      nombre: 'Áreas de Riesgo Normativas (IPT)',
      institucion: 'MINVU / DDU / SEREMI RM',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/IPT_AREA_RIESGO/FeatureServer/0',
      archivoLocal: 'data/ide_minvu_ipt_areas_riesgo.geojson',
      color: '#DC2626',
      icono: '⚠️',
      geometria: 'Polígonos (Riesgo y Restricción)',
      grupo: 'normativa_ipt',
      descripcion: 'Áreas bajo restricción urbanística por riesgo natural (remoción en masa, inundación, fallas geológicas) normadas en los PRC y PRMS conforme al Art. 2.1.17 de la OGUC.',
      declaracion: 'Zonas de Protección por Riesgo oficialmente incorporadas en los planes reguladores comunales e intercomunales.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Áreas de Riesgo y Restricción en Instrumentos de Planificación Territorial de Chile. DDU, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/IPT_AREA_RIESGO/FeatureServer'
    },
    minvu_ipt_resguardo_infraestructura: {
      id: 'minvu_ipt_resguardo_infraestructura',
      nombre: 'Fajas de Resguardo e Infraestructura PRMS',
      institucion: 'MINVU / SEREMI Metropolitana',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer/0',
      archivoLocal: 'data/ide_minvu_ipt_resguardo_infraestructura.geojson',
      color: '#0284C7',
      icono: '🛡',
      geometria: 'Líneas (Fajas de Resguardo)',
      grupo: 'normativa_ipt',
      descripcion: 'Fajas y conos normativos de protección de infraestructura de transporte, ferrocarril, acueductos y servidumbres metropolitanas normadas por el PRMS.',
      declaracion: 'Líneas de resguardo metropolitano de infraestructura conforme al Capítulo 8.4 de la Ordenanza del PRMS.',
      citaAPA: 'Secretaría Regional Ministerial Metropolitana de Vivienda y Urbanismo [SEREMI MINVU RM]. (2024). Fajas de Resguardo de Infraestructura Metropolitana (PRMS). DDU, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer'
    },
    minvu_ipt_limite_urbano: {
      id: 'minvu_ipt_limite_urbano',
      nombre: 'Límite Urbano Oficial PRC (MINVU)',
      institucion: 'MINVU / DDU / I. Municipalidad de Santiago',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/Limites_Urbanos/FeatureServer/0',
      archivoLocal: 'data/ide_minvu_ipt_limite_urbano.geojson',
      color: '#4F46E5',
      icono: '⛶',
      geometria: 'Polígono (Límite Urbano Oficial)',
      grupo: 'normativa_ipt',
      descripcion: 'Línea oficial legal que delimita el territorio urbano comunal normado por el Plan Regulador Comunal de Santiago conforme a la Ley General de Urbanismo y Construcciones.',
      declaracion: 'Polígono legal publicado en Diario Oficial y consolidado en el Catastro Nacional de Límites Urbanos de MINVU.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Oficial de Límites Urbanos de Chile (PRC/PRI). DDU, MINVU / IDE Chile. https://geoide.minvu.cl/server/rest/services/IPT/Limites_Urbanos/FeatureServer'
    },
    ide_minvu_campamentos: {
      id: 'ide_minvu_campamentos',
      nombre: 'Catastro Campamentos 2024 (MINVU)',
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU)',
      ministerio: 'Programa de Asentamientos Precarios',
      tipoServicio: 'ArcGIS MapServer / FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Catastros/Catastros_campamentos/MapServer/0',
      archivoLocal: 'data/ide_minvu_campamentos.geojson',
      color: '#E11D48',
      icono: '⛺',
      geometria: 'Puntos y Polígonos (Campamentos)',
      grupo: 'social_comunidades',
      descripcion: 'Catastro Oficial de Campamentos 2024 del MINVU: asentamientos informales, número de hogares, tenencia y planes de erradicación/radicación.',
      declaracion: 'Información oficial provista por el Departamento de Asentamientos Precarios del MINVU bajo la Política Nacional de Campamentos.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Nacional Oficial de Campamentos 2024. Secretaría Ejecutiva SNIT / IDE Chile. https://geoide.minvu.cl/server/rest/services/Catastros/Catastros_campamentos/MapServer/0'
    },
    ide_minvu_condominios_sociales: {
      id: 'ide_minvu_condominios_sociales',
      nombre: 'Condominios Sociales (MINVU)',
      institucion: 'MINVU / División de Desarrollo Urbano',
      ministerio: 'Ministerio de Vivienda y Urbanismo',
      tipoServicio: 'ArcGIS MapServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Catastros/Catastro_de_condominios_sociales/MapServer/0',
      archivoLocal: 'data/ide_minvu_condominios_sociales.geojson',
      color: '#D97706',
      icono: '🏙',
      geometria: 'Puntos y Polígonos (Copropiedades)',
      grupo: 'social_comunidades',
      descripcion: 'Catastro nacional de condominios sociales y copropiedades habitacionales públicas construidas bajo la Ley de Copropiedad Inmobiliaria (Ley N° 21.442).',
      declaracion: 'Catastro provisto por la División de Desarrollo Urbano del MINVU conforme al Registro de Condominios Sociales.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Nacional de Condominios Sociales. DDU, MINVU. https://geoide.minvu.cl/server/rest/services/Catastros/Catastro_de_condominios_sociales/MapServer/0'
    },
    ide_minvu_inventario_humedales: {
      id: 'ide_minvu_inventario_humedales',
      nombre: 'Inventario de Humedales (MMA / MINVU)',
      institucion: 'Ministerio del Medio Ambiente (MMA) / MINVU',
      ministerio: 'División de Recursos Naturales y Biodiversidad',
      tipoServicio: 'ArcGIS MapServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Inventario_de_Humedales/MapServer/0',
      archivoLocal: 'data/ide_minvu_inventario_humedales.geojson',
      color: '#0284C7',
      icono: '💧',
      geometria: 'Polígonos (Humedales Urbanos y Rurales)',
      grupo: 'medio_ambiente_riesgos',
      descripcion: 'Inventario oficial de humedales urbanos y ecosistemas acuáticos continentales protegidos bajo la Ley N° 21.202 y su reglamento.',
      declaracion: 'Catastro consolidado por el Ministerio del Medio Ambiente y la División de Desarrollo Urbano del MINVU para salvaguarda ambiental e IPT.',
      citaAPA: 'Ministerio del Medio Ambiente [MMA] & MINVU. (2024). Inventario Nacional de Humedales y Humedales Urbanos Protegidos (Ley N° 21.202). IDE Chile. https://geoide.minvu.cl/server/rest/services/Inventario_de_Humedales/MapServer/0'
    },
    ide_minvu_unidades_vecinales_rsh: {
      id: 'ide_minvu_unidades_vecinales_rsh',
      nombre: 'Unidades Vecinales & RSH (MDS / MINVU)',
      institucion: 'Ministerio de Desarrollo Social y Familia (MDS) / MINVU',
      ministerio: 'Subsecretaría de Evaluación Social',
      tipoServicio: 'ArcGIS MapServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Informacion_Externa/Unidades_Vecinales_con_RSH/MapServer/0',
      archivoLocal: 'data/ide_minvu_unidades_vecinales_rsh.geojson',
      color: '#6366F1',
      icono: '🗫',
      geometria: 'Polígonos (Unidades Vecinales)',
      grupo: 'social_comunidades',
      descripcion: 'Delimitación territorial de unidades vecinales oficiales con indicadores consolidados del Registro Social de Hogares (RSH 2024).',
      declaracion: 'Información geoespacial oficial provista por el Ministerio de Desarrollo Social y Familia y MINVU bajo la Ley N° 19.418.',
      citaAPA: 'Ministerio de Desarrollo Social y Familia [MDSF] & MINVU. (2024). Delimitación de Unidades Vecinales con Registro Social de Hogares. IDE Chile. https://geoide.minvu.cl/server/rest/services/Informacion_Externa/Unidades_Vecinales_con_RSH/MapServer/0'
    },
    ide_minvu_ipt_prms_riesgo: {
      id: 'ide_minvu_ipt_prms_riesgo',
      nombre: 'PRMS: Riesgos Metropolitanos (Inundación / Remoción)',
      institucion: 'MINVU / SEREMI Metropolitana',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer/3',
      archivoLocal: 'data/ide_minvu_ipt_prms_riesgo.geojson',
      color: '#DC2626',
      icono: '⚠️',
      geometria: 'Polígonos (Zonas de Riesgo Intercomunal)',
      grupo: 'normativa_ipt',
      descripcion: 'Áreas de restricción por riesgo geológico, fallas activas, remoción en masa e inundación fluvial normadas por el Plan Regulador Metropolitano de Santiago (PRMS).',
      declaracion: 'Zonas normativas de riesgo metropolitano reguladas por el Art. 2.1.17 de la OGUC y la Ordenanza del PRMS.',
      citaAPA: 'Secretaría Regional Ministerial Metropolitana de Vivienda y Urbanismo [SEREMI MINVU RM]. (2024). Áreas de Riesgo Metropolitano (PRMS): Fallas, Inundación y Remoción. DDU, MINVU. https://geoide.minvu.cl/server/rest/services/IPT/PRMS/FeatureServer/3'
    },
    ide_subdere_dpa_comunas: {
      id: 'ide_subdere_dpa_comunas',
      nombre: 'División Político-Administrativa (SUBDERE / IGM)',
      institucion: 'Subsecretaría de Desarrollo Regional (SUBDERE) / IGM / IDE Chile',
      ministerio: 'Ministerio del Interior y Seguridad Pública',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/SIET_comunas_16R_gdb/FeatureServer/0',
      archivoLocal: 'data/ide_subdere_dpa_comunas.geojson',
      color: '#475569',
      icono: '🗺',
      geometria: 'Polígonos (Límites Comunales Oficiales)',
      grupo: 'demografia',
      descripcion: 'Límites comunales y provinciales oficiales de Chile (División Político-Administrativa) con códigos únicos territoriales (CUT).',
      declaracion: 'Cartografía base oficial de la República de Chile provista por SUBDERE, INE e Instituto Geográfico Militar (IGM).',
      citaAPA: 'Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE] & IGM. (2024). División Político Administrativa Oficial de Chile (DPA). IDE Chile. https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/SIET_comunas_16R_gdb/FeatureServer/0'
    },
    ide_minvu_ciclovias: {
      id: 'ide_minvu_ciclovias',
      nombre: 'Red Oficial de Ciclovías (MINVU / DTPM)',
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU) / DTPM',
      ministerio: 'División de Desarrollo Urbano (DDU)',
      tipoServicio: 'ArcGIS MapServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Planes_Programas/Ciclov%C3%ADas_Minvu/MapServer/0',
      archivoLocal: 'data/ide_minvu_ciclovias.geojson',
      color: '#10B981',
      icono: '🚲',
      geometria: 'Líneas (Ciclovías Consolidadas)',
      grupo: 'movilidad_activa',
      descripcion: 'Ejes de ciclovías consolidadas y de alto estándar normadas por MINVU bajo la Ley de Convivencia Vial (Ley N° 21.088).',
      declaracion: 'Catastro de infraestructura vial cicloinclusiva oficial administrado por MINVU y DTPM.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Red Nacional de Ciclovías Urbanas de Chile. IDE Chile / Planes y Programas MINVU. https://geoide.minvu.cl/server/rest/services/Planes_Programas/Ciclov%C3%ADas_Minvu/MapServer/0'
    },
    unidades_vecinales_bidat: {
      id: 'unidades_vecinales_bidat',
      nombre: 'Unidades Vecinales 2026 & Vulnerabilidad RSH (BIDAT / MDS)',
      institucion: 'Ministerio de Desarrollo Social y Familia (MDS) / BIDAT',
      ministerio: 'Subsecretaría de Evaluación Social',
      tipoServicio: 'BIDAT / RSH 2026 (Dataset Oficial)',
      urlServicio: 'https://bidat.gob.cl/details/ficha/dataset/shape-de-unidades-vecinales-del-registro-social-de-hogares',
      archivoLocal: 'data/capa_unidades_vecinales_bidat.geojson',
      color: '#6366F1',
      icono: '🗫',
      geometria: 'Polígonos (Unidades Vecinales)',
      grupo: 'social_comunidades',
      descripcion: 'Unidades Vecinales 2026 enriquecidas con indicadores del Registro Social de Hogares (RSH) e Índice Global de Vulnerabilidad Socioterritorial (IGVUST 2026).',
      declaracion: 'Datos provistos por el Ministerio de Desarrollo Social y Familia y procesados bajo confidencialidad estadística.',
      citaAPA: 'Ministerio de Desarrollo Social y Familia [MDSF]. (2026). Indicadores de Vulnerabilidad Socioterritorial por Unidad Vecinal (BIDAT). https://bidat.gob.cl'
    },
    salud_oficial_2026: {
      id: 'salud_oficial_2026',
      nombre: 'Establecimientos de Salud Febrero 2026 (DEIS / MINSAL)',
      institucion: 'Ministerio de Salud (MINSAL) / DEIS',
      ministerio: 'Subsecretaría de Redes Asistenciales',
      tipoServicio: 'DEIS / MINSAL (Actualización 2026)',
      urlServicio: 'https://datos.gob.cl',
      archivoLocal: 'data/capa_salud_oficial.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Puntos (Establecimientos)',
      grupo: 'salud',
      descripcion: 'Red oficial de salud asistencial (CESFAM, Hospitales, Postas y CECOSF) en la comuna de Santiago.',
      declaracion: 'Catastro Oficial DEIS MINSAL Febrero 2026.',
      citaAPA: 'Ministerio de Salud [MINSAL]. (2026). Registro Nacional de Establecimientos de Salud (DEIS). https://datos.gob.cl'
    },
    educacion_superior_2026: {
      id: 'educacion_superior_2026',
      nombre: 'Educación Superior 2026 (MINEDUC)',
      institucion: 'Ministerio de Educación (MINEDUC) / IDE Chile',
      ministerio: 'Subsecretaría de Educación Superior',
      tipoServicio: 'Geoportal de Chile (Shapefile)',
      urlServicio: 'https://www.geoportal.cl',
      archivoLocal: 'data/capa_educacion_superior.geojson',
      color: '#10B981',
      icono: '🏫',
      geometria: 'Puntos (Sedes Universitarias)',
      grupo: 'educacion',
      descripcion: 'Catastro oficial de sedes universitarias e institutos superiores en Santiago Centro y Barrio Brasil.',
      declaracion: 'Catastro Oficial MINEDUC de Educación Superior.',
      citaAPA: 'Ministerio de Educación [MINEDUC]. (2026). Sedes e Inmuebles de Educación Superior. IDE Chile. https://www.geoportal.cl'
    },
    cuarteles_bomberos_2026: {
      id: 'cuarteles_bomberos_2026',
      nombre: 'Cuarteles de Bomberos (Junta Nacional / CBS)',
      institucion: 'Junta Nacional de Cuerpos de Bomberos / CBS',
      ministerio: 'Ministerio del Interior y Seguridad Pública',
      tipoServicio: 'Geoportal de Chile',
      urlServicio: 'https://www.geoportal.cl',
      archivoLocal: 'data/capa_cuarteles_bomberos.geojson',
      color: '#F59E0B',
      icono: '🚒',
      geometria: 'Puntos (Cuarteles)',
      grupo: 'seguridad',
      descripcion: 'Compañías del Cuerpo de Bomberos de Santiago que atienden Barrio Brasil, Yungay y Centro Histórico.',
      declaracion: 'Catastro Oficial de Bomberos de Chile.',
      citaAPA: 'Junta Nacional de Cuerpos de Bomberos. (2026). Cuarteles de Bomberos de Chile. Geoportal de Chile. https://www.geoportal.cl'
    },
    jardines_junji_integra: {
      id: 'jardines_junji_integra',
      nombre: 'Jardines Infantiles JUNJI & Integra',
      institucion: 'JUNJI / Fundación Integra / MINEDUC',
      ministerio: 'Subsecretaría de Educación Parvularia',
      tipoServicio: 'Geoportal de Chile',
      urlServicio: 'https://www.geoportal.cl',
      archivoLocal: 'data/capa_jardines_junji.geojson',
      color: '#8B5CF6',
      icono: '👶',
      geometria: 'Puntos (Jardines)',
      grupo: 'educacion',
      descripcion: 'Salas cuna y jardines infantiles de JUNJI y Fundación Integra en Santiago.',
      declaracion: 'Directorio Oficial de Educación Parvularia.',
      citaAPA: 'Subsecretaría de Educación Parvularia. (2026). Directorio de Educación Parvularia. Geoportal de Chile.'
    },
    infraestructura_deportiva: {
      id: 'infraestructura_deportiva',
      nombre: 'Infraestructura Deportiva (IND / MINDEP)',
      institucion: 'Instituto Nacional del Deporte (IND) / MINDEP',
      ministerio: 'Ministerio del Deporte',
      tipoServicio: 'Geoportal de Chile',
      urlServicio: 'https://www.geoportal.cl',
      archivoLocal: 'data/capa_infraestructura_deportiva.geojson',
      color: '#06B6D4',
      icono: '⚽',
      geometria: 'Puntos y Polígonos',
      grupo: 'espacio_publico',
      descripcion: 'Recintos deportivos, multicanchas y estadios catastrados por el Instituto Nacional del Deporte.',
      declaracion: 'Catastro Oficial de Infraestructura Deportiva IND.',
      citaAPA: 'Instituto Nacional del Deporte [IND]. (2026). Catastro de Recintos Deportivos. Geoportal de Chile.'
    },
    ferias_libres: {
      id: 'ferias_libres',
      nombre: 'Ferias Libres y Mercados Locales',
      institucion: 'ODEPA / I. Municipalidad de Santiago',
      ministerio: 'Ministerio de Agricultura / Municipal',
      tipoServicio: 'Geoportal de Chile',
      urlServicio: 'https://www.geoportal.cl',
      archivoLocal: 'data/capa_ferias_libres.geojson',
      color: '#F97316',
      icono: '🧺',
      geometria: 'Puntos (Ferias Libres)',
      grupo: 'servicios',
      descripcion: 'Ferias libres, mercados de barrio y puestos de abastecimiento tradicional en la comuna de Santiago.',
      declaracion: 'Catastro Oficial de Ferias Libres ODEPA / MINAGRI.',
      citaAPA: 'ODEPA & I. Municipalidad de Santiago. (2026). Catastro de Ferias Libres. Geoportal de Chile.'
    },

    // =========================================================================,

    // =========================================================================
    // CAPAS CATASTRADAS EN BBDD.XLSX (74 CAPAS ESTADO DE CHILE)
    // =========================================================================
    'bbdd_01': {
      id: 'bbdd_01',
      num_bbdd: 1,
      nombre: "Proyectos Mandatados - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: 'data/capa_bbdd_01.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 01: Proyectos Mandatados - GEOMOP. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Proyectos Mandatados - GEOMOP (Capa N° 01). IDE Chile / Geoportal. https://geomop.mop.gob.cl/descargas/"
    },
    'bbdd_02': {
      id: 'bbdd_02',
      num_bbdd: 2,
      nombre: "Red Vial Nacional - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: 'data/capa_bbdd_02.geojson',
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 02: Red Vial Nacional - GEOMOP. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Red Vial Nacional - GEOMOP (Capa N° 02). IDE Chile / Geoportal. https://geomop.mop.gob.cl/descargas/"
    },
    'bbdd_03': {
      id: 'bbdd_03',
      num_bbdd: 3,
      nombre: "Red Hidrométrica - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: 'data/capa_bbdd_03.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 03: Red Hidrométrica - GEOMOP. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Red Hidrométrica - GEOMOP (Capa N° 03). IDE Chile / Geoportal. https://geomop.mop.gob.cl/descargas/"
    },
    'bbdd_04': {
      id: 'bbdd_04',
      num_bbdd: 4,
      nombre: "Contratos Concesionados - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: 'data/capa_bbdd_04.geojson',
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 04: Contratos Concesionados - GEOMOP. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Contratos Concesionados - GEOMOP (Capa N° 04). IDE Chile / Geoportal. https://geomop.mop.gob.cl/descargas/"
    },
    'bbdd_05': {
      id: 'bbdd_05',
      num_bbdd: 5,
      nombre: "Contratos MOP - GEOMOP",
      institucion: "Estado de Chile / IDE Chile / geomop.mop.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geomop.mop.gob.cl/descargas/",
      archivoLocal: 'data/capa_bbdd_05.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 05: Contratos MOP - GEOMOP. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Contratos MOP - GEOMOP (Capa N° 05). IDE Chile / Geoportal. https://geomop.mop.gob.cl/descargas/"
    },
    'bbdd_06': {
      id: 'bbdd_06',
      num_bbdd: 6,
      nombre: "Jardines Infantiles JUNJI",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/34965/Jardines%20Infantiles%20JUNJI",
      archivoLocal: 'data/capa_bbdd_06.geojson',
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 06: Jardines Infantiles JUNJI. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Jardines Infantiles JUNJI (Capa N° 06). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/34965/Jardines%20Infantiles%20JUNJI"
    },
    'bbdd_07': {
      id: 'bbdd_07',
      num_bbdd: 7,
      nombre: "Infraestructura Deportiva",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35034/Infraestructura%20Deportiva",
      archivoLocal: 'data/capa_bbdd_07.geojson',
      color: '#8B5CF6',
      icono: '⚽',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'espacio_publico',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 07: Infraestructura Deportiva. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Infraestructura Deportiva (Capa N° 07). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35034/Infraestructura%20Deportiva"
    },
    'bbdd_08': {
      id: 'bbdd_08',
      num_bbdd: 8,
      nombre: "Municipios",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35603/Municipios",
      archivoLocal: 'data/capa_bbdd_08.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 08: Municipios. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Municipios (Capa N° 08). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35603/Municipios"
    },
    'bbdd_09': {
      id: 'bbdd_09',
      num_bbdd: 9,
      nombre: "Cuarteles de Bomberos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35003/Cuarteles%20de%20Carabineros",
      archivoLocal: 'data/capa_bbdd_09.geojson',
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 09: Cuarteles de Bomberos. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Cuarteles de Bomberos (Capa N° 09). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35003/Cuarteles%20de%20Carabineros"
    },
    'bbdd_10': {
      id: 'bbdd_10',
      num_bbdd: 10,
      nombre: "Jardines Infantiles Fundación Integra",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35001/Jardines%20Infantiles%20Fundaci%C3%B3n%20Integra",
      archivoLocal: 'data/capa_bbdd_10.geojson',
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 10: Jardines Infantiles Fundación Integra. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Jardines Infantiles Fundación Integra (Capa N° 10). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35001/Jardines%20Infantiles%20Fundaci%C3%B3n%20Integra"
    },
    'bbdd_11': {
      id: 'bbdd_11',
      num_bbdd: 11,
      nombre: "Cuerpos de Bomberos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/36393/Cuerpos%20de%20Bomberos",
      archivoLocal: 'data/capa_bbdd_11.geojson',
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 11: Cuerpos de Bomberos. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Cuerpos de Bomberos (Capa N° 11). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/36393/Cuerpos%20de%20Bomberos"
    },
    'bbdd_12': {
      id: 'bbdd_12',
      num_bbdd: 12,
      nombre: "Establecimientos Educación Escolar",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35408/Establecimientos%20Educaci%C3%B3n%20Escolar",
      archivoLocal: 'data/capa_bbdd_12.geojson',
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 12: Establecimientos Educación Escolar. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Establecimientos Educación Escolar (Capa N° 12). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35408/Establecimientos%20Educaci%C3%B3n%20Escolar"
    },
    'bbdd_13': {
      id: 'bbdd_13',
      num_bbdd: 13,
      nombre: "Establecimientos Educación Parvularia",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35553/Establecimientos%20Educaci%C3%B3n%20Parvularia",
      archivoLocal: 'data/capa_bbdd_13.geojson',
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 13: Establecimientos Educación Parvularia. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Establecimientos Educación Parvularia (Capa N° 13). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35553/Establecimientos%20Educaci%C3%B3n%20Parvularia"
    },
    'bbdd_14': {
      id: 'bbdd_14',
      num_bbdd: 14,
      nombre: "Establecimientos de Educación Superior",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35554/Establecimientos%20de%20Educaci%C3%B3n%20Superior",
      archivoLocal: 'data/capa_bbdd_14.geojson',
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 14: Establecimientos de Educación Superior. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Establecimientos de Educación Superior (Capa N° 14). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35554/Establecimientos%20de%20Educaci%C3%B3n%20Superior"
    },
    'bbdd_15': {
      id: 'bbdd_15',
      num_bbdd: 15,
      nombre: "Centros de SERNAM",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35000/Centros%20de%20SERNAM",
      archivoLocal: 'data/capa_bbdd_15.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 15: Centros de SERNAM. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Centros de SERNAM (Capa N° 15). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35000/Centros%20de%20SERNAM"
    },
    'bbdd_16': {
      id: 'bbdd_16',
      num_bbdd: 16,
      nombre: "Ferias Libres",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35097/Ferias%20Libres",
      archivoLocal: 'data/capa_bbdd_16.geojson',
      color: '#F97316',
      icono: '💰',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'economico_agricola',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 16: Ferias Libres. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Ferias Libres (Capa N° 16). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35097/Ferias%20Libres"
    },
    'bbdd_17': {
      id: 'bbdd_17',
      num_bbdd: 17,
      nombre: "Áreas Funcionales de las ciudades (2026)",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/AFU_2026/FeatureServer",
      archivoLocal: 'data/capa_bbdd_17.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 17: Áreas Funcionales de las ciudades (2026). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Áreas Funcionales de las ciudades (2026) (Capa N° 17). IDE Chile / Geoportal. https://geoide.minvu.cl/server/rest/services/Otros/AFU_2026/FeatureServer"
    },
    'bbdd_18': {
      id: 'bbdd_18',
      num_bbdd: 18,
      nombre: "Zonificación Termica",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Zonificaci%C3%B3n_termica/FeatureServer",
      archivoLocal: 'data/capa_bbdd_18.geojson',
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 18: Zonificación Termica. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Zonificación Termica (Capa N° 18). IDE Chile / Geoportal. https://geoide.minvu.cl/server/rest/services/Otros/Zonificaci%C3%B3n_termica/FeatureServer"
    },
    'bbdd_19': {
      id: 'bbdd_19',
      num_bbdd: 19,
      nombre: "Cité",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Cit%C3%A9/FeatureServer",
      archivoLocal: 'data/capa_bbdd_19.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 19: Cité. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Cité (Capa N° 19). IDE Chile / Geoportal. https://geoide.minvu.cl/server/rest/services/Otros/Cit%C3%A9/FeatureServer"
    },
    'bbdd_20': {
      id: 'bbdd_20',
      num_bbdd: 20,
      nombre: "Seremis",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Seremis/FeatureServer",
      archivoLocal: 'data/capa_bbdd_20.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 20: Seremis. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Seremis (Capa N° 20). IDE Chile / Geoportal. https://geoide.minvu.cl/server/rest/services/Otros/Seremis/FeatureServer"
    },
    'bbdd_21': {
      id: 'bbdd_21',
      num_bbdd: 21,
      nombre: "Oficinas Serviu",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/Ofinas_Serviu/FeatureServer",
      archivoLocal: 'data/capa_bbdd_21.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 21: Oficinas Serviu. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Oficinas Serviu (Capa N° 21). IDE Chile / Geoportal. https://geoide.minvu.cl/server/rest/services/Otros/Ofinas_Serviu/FeatureServer"
    },
    'bbdd_22': {
      id: 'bbdd_22',
      num_bbdd: 22,
      nombre: "Datos IDE Energía",
      institucion: "Estado de Chile / IDE Chile / ide-energia.minenergia.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide-energia.minenergia.cl/server/rest/services/IDE_Energia/Visor_IDE_Energ%C3%ADa/FeatureServer",
      archivoLocal: 'data/capa_bbdd_22.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 22: Datos IDE Energía. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Datos IDE Energía (Capa N° 22). IDE Chile / Geoportal. https://ide-energia.minenergia.cl/server/rest/services/IDE_Energia/Visor_IDE_Energ%C3%ADa/FeatureServer"
    },
    'bbdd_23': {
      id: 'bbdd_23',
      num_bbdd: 23,
      nombre: "Sitios BIO-Prioritarios",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35909/Sitios%20prioritarios",
      archivoLocal: 'data/capa_bbdd_23.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 23: Sitios BIO-Prioritarios. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Sitios BIO-Prioritarios (Capa N° 23). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35909/Sitios%20prioritarios"
    },
    'bbdd_24': {
      id: 'bbdd_24',
      num_bbdd: 24,
      nombre: "Juzgados de Familia",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35093/Juzgados%20de%20Familia",
      archivoLocal: 'data/capa_bbdd_24.geojson',
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 24: Juzgados de Familia. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Juzgados de Familia (Capa N° 24). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35093/Juzgados%20de%20Familia"
    },
    'bbdd_25': {
      id: 'bbdd_25',
      num_bbdd: 25,
      nombre: "Estaciones Meteorológicas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35262/Estaciones%20Meteorol%C3%B3gicas",
      archivoLocal: 'data/capa_bbdd_25.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 25: Estaciones Meteorológicas. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Estaciones Meteorológicas (Capa N° 25). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35262/Estaciones%20Meteorol%C3%B3gicas"
    },
    'bbdd_26': {
      id: 'bbdd_26',
      num_bbdd: 26,
      nombre: "Estaciones Sedimentométricas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35265/Estaciones%20sedimentom%C3%A9tricas",
      archivoLocal: 'data/capa_bbdd_26.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 26: Estaciones Sedimentométricas. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Estaciones Sedimentométricas (Capa N° 26). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35265/Estaciones%20sedimentom%C3%A9tricas"
    },
    'bbdd_27': {
      id: 'bbdd_27',
      num_bbdd: 27,
      nombre: "Estaciones de Calidad de Aguas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35154/Estaciones%20de%20calidad%20de%20aguas",
      archivoLocal: 'data/capa_bbdd_27.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 27: Estaciones de Calidad de Aguas. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Estaciones de Calidad de Aguas (Capa N° 27). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35154/Estaciones%20de%20calidad%20de%20aguas"
    },
    'bbdd_28': {
      id: 'bbdd_28',
      num_bbdd: 28,
      nombre: "Establecimientos de Salud Febrero 2026",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/37171/Establecimientos%20de%20salud%20de%20Chile%20Febrero%202026",
      archivoLocal: 'data/capa_bbdd_28.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 28: Establecimientos de Salud Febrero 2026. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Establecimientos de Salud Febrero 2026 (Capa N° 28). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/37171/Establecimientos%20de%20salud%20de%20Chile%20Febrero%202026"
    },
    'bbdd_29': {
      id: 'bbdd_29',
      num_bbdd: 29,
      nombre: "Cuencas Banco Nacional de Aguas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35416/Cuencas%20Banco%20Nacional%20de%20Aguas",
      archivoLocal: 'data/capa_bbdd_29.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 29: Cuencas Banco Nacional de Aguas. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Cuencas Banco Nacional de Aguas (Capa N° 29). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35416/Cuencas%20Banco%20Nacional%20de%20Aguas"
    },
    'bbdd_30': {
      id: 'bbdd_30',
      num_bbdd: 30,
      nombre: "Indice Calidad de Aguas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35251/Calidad%20aguas",
      archivoLocal: 'data/capa_bbdd_30.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 30: Indice Calidad de Aguas. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Indice Calidad de Aguas (Capa N° 30). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35251/Calidad%20aguas"
    },
    'bbdd_31': {
      id: 'bbdd_31',
      num_bbdd: 31,
      nombre: "Ciclovías",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/dashboard/118",
      archivoLocal: 'data/capa_bbdd_31.geojson',
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 31: Ciclovías. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Ciclovías (Capa N° 31). IDE Chile / Geoportal. https://geoportal.cl/geoportal/dashboard/118"
    },
    'bbdd_32': {
      id: 'bbdd_32',
      num_bbdd: 32,
      nombre: "Vertederos Ilegales",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35653/Vertederos%20Ilegales",
      archivoLocal: 'data/capa_bbdd_32.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 32: Vertederos Ilegales. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Vertederos Ilegales (Capa N° 32). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35653/Vertederos%20Ilegales"
    },
    'bbdd_33': {
      id: 'bbdd_33',
      num_bbdd: 33,
      nombre: "Plan Cuadrante Carabineros",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35002/Plan%20Cuadrante",
      archivoLocal: 'data/capa_bbdd_33.geojson',
      color: '#F59E0B',
      icono: '🛡️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'seguridad',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 33: Plan Cuadrante Carabineros. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Plan Cuadrante Carabineros (Capa N° 33). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35002/Plan%20Cuadrante"
    },
    'bbdd_34': {
      id: 'bbdd_34',
      num_bbdd: 34,
      nombre: "Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35414/Zonas%20clim%C3%A1ticas%20de%20Chile%20seg%C3%BAn%20K%C3%B6ppen-Geiger%20escala%201:1.500.000",
      archivoLocal: 'data/capa_bbdd_34.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 34: Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000 (Capa N° 34). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35414/Zonas%20clim%C3%A1ticas%20de%20Chile%20seg%C3%BAn%20K%C3%B6ppen-Geiger%20escala%201:1.500.000"
    },
    'bbdd_35': {
      id: 'bbdd_35',
      num_bbdd: 35,
      nombre: "Antenas en Servicio Ley de Torres",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35911/Antenas%20en%20Servicio%20Ley%20de%20Torres",
      archivoLocal: 'data/capa_bbdd_35.geojson',
      color: '#F97316',
      icono: '💰',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'economico_agricola',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 35: Antenas en Servicio Ley de Torres. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Antenas en Servicio Ley de Torres (Capa N° 35). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35911/Antenas%20en%20Servicio%20Ley%20de%20Torres"
    },
    'bbdd_36': {
      id: 'bbdd_36',
      num_bbdd: 36,
      nombre: "Curva de 10m",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35655/Curva%20de%2010m",
      archivoLocal: 'data/capa_bbdd_36.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 36: Curva de 10m. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Curva de 10m (Capa N° 36). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35655/Curva%20de%2010m"
    },
    'bbdd_37': {
      id: 'bbdd_37',
      num_bbdd: 37,
      nombre: "Red de Interconexión",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35419/Red%20de%20Interconexi%C3%B3n",
      archivoLocal: 'data/capa_bbdd_37.geojson',
      color: '#06B6D4',
      icono: '🚲',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'movilidad_transporte',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 37: Red de Interconexión. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Red de Interconexión (Capa N° 37). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35419/Red%20de%20Interconexi%C3%B3n"
    },
    'bbdd_38': {
      id: 'bbdd_38',
      num_bbdd: 38,
      nombre: "Territorios de los Servicios de Salud",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35388/Territorios%20de%20los%20Servicios%20de%20Salud",
      archivoLocal: 'data/capa_bbdd_38.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 38: Territorios de los Servicios de Salud. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Territorios de los Servicios de Salud (Capa N° 38). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35388/Territorios%20de%20los%20Servicios%20de%20Salud"
    },
    'bbdd_39': {
      id: 'bbdd_39',
      num_bbdd: 39,
      nombre: "Estaciones de monitoreo de calidad de aire (Red Pública)",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35152/Estaciones%20de%20monitoreo%20de%20calidad%20de%20aire%20%28Red%20P%C3%BAblica%29",
      archivoLocal: 'data/capa_bbdd_39.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 39: Estaciones de monitoreo de calidad de aire (Red Pública). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Estaciones de monitoreo de calidad de aire (Red Pública) (Capa N° 39). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35152/Estaciones%20de%20monitoreo%20de%20calidad%20de%20aire%20%28Red%20P%C3%BAblica%29"
    },
    'bbdd_40': {
      id: 'bbdd_40',
      num_bbdd: 40,
      nombre: "Circuitos Turísticos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35141/Circuitos%20Tur%C3%ADsticos",
      archivoLocal: 'data/capa_bbdd_40.geojson',
      color: '#8B5CF6',
      icono: '⚽',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'espacio_publico',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 40: Circuitos Turísticos. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Circuitos Turísticos (Capa N° 40). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35141/Circuitos%20Tur%C3%ADsticos"
    },
    'bbdd_41': {
      id: 'bbdd_41',
      num_bbdd: 41,
      nombre: "Continuo de Construcciones Urbanas (1993, 2002, 2006, 2011, 2017, 2018, 2019 y 2020.)",
      institucion: "Estado de Chile / IDE Chile / geoide.minvu.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoide.minvu.cl/server/rest/services/Otros/CCU_1993_2019/FeatureServer",
      archivoLocal: 'data/capa_bbdd_41.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 41: Continuo de Construcciones Urbanas (1993, 2002, 2006, 2011, 2017, 2018, 2019 y 2020.). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Continuo de Construcciones Urbanas (1993, 2002, 2006, 2011, 2017, 2018, 2019 y 2020.) (Capa N° 41). IDE Chile / Geoportal. https://geoide.minvu.cl/server/rest/services/Otros/CCU_1993_2019/FeatureServer"
    },
    'bbdd_42': {
      id: 'bbdd_42',
      num_bbdd: 42,
      nombre: "Pisos vegetacionales de Luebert y Pliscoff 2017",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/32581/Pisos%20vegetacionales%20de%20Luebert%20y%20Pliscoff%202017",
      archivoLocal: 'data/capa_bbdd_42.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 42: Pisos vegetacionales de Luebert y Pliscoff 2017. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Pisos vegetacionales de Luebert y Pliscoff 2017 (Capa N° 42). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/32581/Pisos%20vegetacionales%20de%20Luebert%20y%20Pliscoff%202017"
    },
    'bbdd_43': {
      id: 'bbdd_43',
      num_bbdd: 43,
      nombre: "División Política Administrativa 2023",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/36391/Divisi%C3%B3n%20Pol%C3%ADtica%20Administrativa%202023",
      archivoLocal: 'data/capa_bbdd_43.geojson',
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 43: División Política Administrativa 2023. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). División Política Administrativa 2023 (Capa N° 43). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/36391/Divisi%C3%B3n%20Pol%C3%ADtica%20Administrativa%202023"
    },
    'bbdd_44': {
      id: 'bbdd_44',
      num_bbdd: 44,
      nombre: "Municipios con certificación ambiental (SCAM)",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35656/Municipios%20con%20certificaci%C3%B3n%20ambiental%20%28SCAM%29",
      archivoLocal: 'data/capa_bbdd_44.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 44: Municipios con certificación ambiental (SCAM). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Municipios con certificación ambiental (SCAM) (Capa N° 44). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35656/Municipios%20con%20certificaci%C3%B3n%20ambiental%20%28SCAM%29"
    },
    'bbdd_45': {
      id: 'bbdd_45',
      num_bbdd: 45,
      nombre: "Nivel de erosión",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35651/Nivel%20de%20erosi%C3%B3n",
      archivoLocal: 'data/capa_bbdd_45.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 45: Nivel de erosión. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Nivel de erosión (Capa N° 45). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35651/Nivel%20de%20erosi%C3%B3n"
    },
    'bbdd_46': {
      id: 'bbdd_46',
      num_bbdd: 46,
      nombre: "Predios",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35406/Predios",
      archivoLocal: 'data/capa_bbdd_46.geojson',
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 46: Predios. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Predios (Capa N° 46). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35406/Predios"
    },
    'bbdd_47': {
      id: 'bbdd_47',
      num_bbdd: 47,
      nombre: "Zona Fronteriza",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/36570/Zona%20Fronteriza",
      archivoLocal: 'data/capa_bbdd_47.geojson',
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 47: Zona Fronteriza. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Zona Fronteriza (Capa N° 47). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/36570/Zona%20Fronteriza"
    },
    'bbdd_48': {
      id: 'bbdd_48',
      num_bbdd: 48,
      nombre: "Pasos Fronterizos",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/36573/Pasos%20Fronterizos",
      archivoLocal: 'data/capa_bbdd_48.geojson',
      color: '#D97706',
      icono: '📜',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'normativa_ipt',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 48: Pasos Fronterizos. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Pasos Fronterizos (Capa N° 48). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/36573/Pasos%20Fronterizos"
    },
    'bbdd_49': {
      id: 'bbdd_49',
      num_bbdd: 49,
      nombre: "Estaciones Fluviométricas",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35258/Estaciones%20Fluviom%C3%A9tricas",
      archivoLocal: 'data/capa_bbdd_49.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 49: Estaciones Fluviométricas. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Estaciones Fluviométricas (Capa N° 49). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35258/Estaciones%20Fluviom%C3%A9tricas"
    },
    'bbdd_50': {
      id: 'bbdd_50',
      num_bbdd: 50,
      nombre: "Oficinas de Protección de Derechos (ODP)",
      institucion: "Estado de Chile / IDE Chile / geoportal.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://geoportal.cl/geoportal/catalog/35094/Oficinas%20de%20Protecci%C3%B3n%20de%20Derechos%20%28ODP%29",
      archivoLocal: 'data/capa_bbdd_50.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 50: Oficinas de Protección de Derechos (ODP). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Oficinas de Protección de Derechos (ODP) (Capa N° 50). IDE Chile / Geoportal. https://geoportal.cl/geoportal/catalog/35094/Oficinas%20de%20Protecci%C3%B3n%20de%20Derechos%20%28ODP%29"
    },
    'bbdd_51': {
      id: 'bbdd_51',
      num_bbdd: 51,
      nombre: "Localización de viveros en Chile continental",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/agricultura-y-ganaderia/",
      archivoLocal: 'data/capa_bbdd_51.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 51: Localización de viveros en Chile continental. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Localización de viveros en Chile continental (Capa N° 51). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/agricultura-y-ganaderia/"
    },
    'bbdd_52': {
      id: 'bbdd_52',
      num_bbdd: 52,
      nombre: "Estaciones Meteorológicas Automáticas (FIA)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/clima/",
      archivoLocal: 'data/capa_bbdd_52.geojson',
      color: '#64748B',
      icono: '🏛️',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'equipamiento_infraestructura',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 52: Estaciones Meteorológicas Automáticas (FIA). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Estaciones Meteorológicas Automáticas (FIA) (Capa N° 52). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/clima/"
    },
    'bbdd_53': {
      id: 'bbdd_53',
      num_bbdd: 53,
      nombre: "Industria Forestal Primeria (INFOR)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/",
      archivoLocal: 'data/capa_bbdd_53.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 53: Industria Forestal Primeria (INFOR). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Industria Forestal Primeria (INFOR) (Capa N° 53). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/"
    },
    'bbdd_54': {
      id: 'bbdd_54',
      num_bbdd: 54,
      nombre: "Mercados Mayoristas (ODEPA)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/",
      archivoLocal: 'data/capa_bbdd_54.geojson',
      color: '#F97316',
      icono: '💰',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'economico_agricola',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 54: Mercados Mayoristas (ODEPA). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Mercados Mayoristas (ODEPA) (Capa N° 54). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/economia/"
    },
    'bbdd_55': {
      id: 'bbdd_55',
      num_bbdd: 55,
      nombre: "Sistema Nacional de Áreas Silvestres Protegidas del Estado",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: 'data/capa_bbdd_55.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 55: Sistema Nacional de Áreas Silvestres Protegidas del Estado. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Sistema Nacional de Áreas Silvestres Protegidas del Estado (Capa N° 55). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'bbdd_56': {
      id: 'bbdd_56',
      num_bbdd: 56,
      nombre: "Carbono orgánico del suelo de Chile (0-5 cm) a 100m",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: 'data/capa_bbdd_56.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 56: Carbono orgánico del suelo de Chile (0-5 cm) a 100m. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Carbono orgánico del suelo de Chile (0-5 cm) a 100m (Capa N° 56). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'bbdd_57': {
      id: 'bbdd_57',
      num_bbdd: 57,
      nombre: "Carbono orgánico del suelo de Chile (5-15 cm) a 100m",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: 'data/capa_bbdd_57.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 57: Carbono orgánico del suelo de Chile (5-15 cm) a 100m. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Carbono orgánico del suelo de Chile (5-15 cm) a 100m (Capa N° 57). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'bbdd_58': {
      id: 'bbdd_58',
      num_bbdd: 58,
      nombre: "Carbono orgánico del suelo de Chile (15-30 cm) a 100m",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/",
      archivoLocal: 'data/capa_bbdd_58.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 58: Carbono orgánico del suelo de Chile (15-30 cm) a 100m. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Carbono orgánico del suelo de Chile (15-30 cm) a 100m (Capa N° 58). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/medio-ambiente/"
    },
    'bbdd_59': {
      id: 'bbdd_59',
      num_bbdd: 59,
      nombre: "Cobertura de canales a nivel nacional",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/aguas-continentales/",
      archivoLocal: 'data/capa_bbdd_59.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 59: Cobertura de canales a nivel nacional. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Cobertura de canales a nivel nacional (Capa N° 59). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/aguas-continentales/"
    },
    'bbdd_60': {
      id: 'bbdd_60',
      num_bbdd: 60,
      nombre: "Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII)",
      institucion: "Estado de Chile / IDE Chile / ide.minagri.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://ide.minagri.gob.cl/descarga-de-capas-shp/planificacion-catastral/",
      archivoLocal: 'data/capa_bbdd_60.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 60: Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII). Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII) (Capa N° 60). IDE Chile / Geoportal. https://ide.minagri.gob.cl/descarga-de-capas-shp/planificacion-catastral/"
    },
    'bbdd_62': {
      id: 'bbdd_62',
      num_bbdd: 62,
      nombre: "Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025",
      institucion: "Estado de Chile / IDE Chile / icet.odepa.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://icet.odepa.gob.cl/",
      archivoLocal: 'data/capa_bbdd_62.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 62: Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025 (Capa N° 62). IDE Chile / Geoportal. https://icet.odepa.gob.cl/"
    },
    'bbdd_63': {
      id: 'bbdd_63',
      num_bbdd: 63,
      nombre: "Inventario de Biomasa y Carbono - Metropolitana tipo Forestal",
      institucion: "Estado de Chile / IDE Chile / sit.conaf.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://sit.conaf.cl/",
      archivoLocal: 'data/capa_bbdd_63.geojson',
      color: '#10B981',
      icono: '🌳',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'medio_ambiente_riesgos',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 63: Inventario de Biomasa y Carbono - Metropolitana tipo Forestal. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Inventario de Biomasa y Carbono - Metropolitana tipo Forestal (Capa N° 63). IDE Chile / Geoportal. https://sit.conaf.cl/"
    },
    'bbdd_64': {
      id: 'bbdd_64',
      num_bbdd: 64,
      nombre: "Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/bases-de-datos-agosto-2026",
      archivoLocal: 'data/capa_bbdd_64.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 64: Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto (Capa N° 64). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/bases-de-datos-agosto-2026"
    },
    'bbdd_65': {
      id: 'bbdd_65',
      num_bbdd: 65,
      nombre: "Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026.",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/registro-de-proyectos-de-inversion?page=1",
      archivoLocal: 'data/capa_bbdd_65.geojson',
      color: '#3B82F6',
      icono: '🏫',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'educacion',
      joinInfo: "Comuna / Región Metropolitana",
      descripcion: "Capa cartográfica e indicador territorial N° 65: Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026.. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026. (Capa N° 65). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/registro-de-proyectos-de-inversion?page=1"
    },
    'bbdd_66': {
      id: 'bbdd_66',
      num_bbdd: 66,
      nombre: "Unidades Vecinales 2026",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/shape-de-unidades-vecinales-del-registro-social-de-hogares",
      archivoLocal: 'data/capa_bbdd_66.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "ORIGINAL",
      descripcion: "Capa cartográfica e indicador territorial N° 66: Unidades Vecinales 2026. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Unidades Vecinales 2026 (Capa N° 66). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/shape-de-unidades-vecinales-del-registro-social-de-hogares"
    },
    'bbdd_67': {
      id: 'bbdd_67',
      num_bbdd: 67,
      nombre: "Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-en-situacion-dependencia-funcional-segun-cse-2026",
      archivoLocal: 'data/capa_bbdd_67.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 67: Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto (Capa N° 67). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-en-situacion-dependencia-funcional-segun-cse-2026"
    },
    'bbdd_68': {
      id: 'bbdd_68',
      num_bbdd: 68,
      nombre: "Personas en RSH según CSE y sexo - 2026 Agosto",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-segun-cse-y-sexo-2026",
      archivoLocal: 'data/capa_bbdd_68.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 68: Personas en RSH según CSE y sexo - 2026 Agosto. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Personas en RSH según CSE y sexo - 2026 Agosto (Capa N° 68). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-segun-cse-y-sexo-2026"
    },
    'bbdd_69': {
      id: 'bbdd_69',
      num_bbdd: 69,
      nombre: "NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/nna-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: 'data/capa_bbdd_69.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 69: NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 69). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/nna-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'bbdd_70': {
      id: 'bbdd_70',
      num_bbdd: 70,
      nombre: "Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/mujeres-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: 'data/capa_bbdd_70.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 70: Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 70). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/mujeres-en-rsh-adscritas-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'bbdd_71': {
      id: 'bbdd_71',
      num_bbdd: 71,
      nombre: "Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/jovenes-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: 'data/capa_bbdd_71.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 71: Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 71). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/jovenes-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'bbdd_72': {
      id: 'bbdd_72',
      num_bbdd: 72,
      nombre: "Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/hombres-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: 'data/capa_bbdd_72.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 72: Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 72). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/hombres-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'bbdd_73': {
      id: 'bbdd_73',
      num_bbdd: 73,
      nombre: "Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-mayores-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026",
      archivoLocal: 'data/capa_bbdd_73.geojson',
      color: '#EF4444',
      icono: '🏥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'salud',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 73: Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio (Capa N° 73). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/personas-mayores-en-rsh-adscritos-fonasa-isapre-segun-cse-y-tipo-institucion-2026"
    },
    'bbdd_74': {
      id: 'bbdd_74',
      num_bbdd: 74,
      nombre: "Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio",
      institucion: "Estado de Chile / IDE Chile / bidat.gob.cl",
      ministerio: 'Organismo Público del Estado de Chile',
      tipoServicio: 'Vectorial GeoJSON / Tabular BIDAT / OGC WMS',
      urlServicio: "https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-ocupadas-y-cotizando-por-modalidad-contractual-segun-tramo-cse-2026",
      archivoLocal: 'data/capa_bbdd_74.geojson',
      color: '#6366F1',
      icono: '👥',
      geometria: 'Vectorial / Tabular Georreferenciada',
      grupo: 'social_comunidades',
      joinInfo: "Unidades Vecinales 2026",
      descripcion: "Capa cartográfica e indicador territorial N° 74: Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio. Catastrada e integrada al Atlas VGI con respaldo de metadatos estandarizados.",
      declaracion: 'Información pública oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
      citaAPA: "Estado de Chile. (2026). Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio (Capa N° 74). IDE Chile / Geoportal. https://bidat.gob.cl/details/ficha/dataset/personas-en-rsh-ocupadas-y-cotizando-por-modalidad-contractual-segun-tramo-cse-2026"
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

    // 2. Consulta a Base de Datos en la Nube (Supabase PostGIS / Storage CDN) con Fallback
    if (!geojson && window.ModuloDBClient) {
      try {
        const resDb = await window.ModuloDBClient.consultarCapa(idCapa, def, bbox);
        if (resDb && resDb.geojson) {
          geojson = resDb.geojson;
          fuenteUsada = `${def.institucion} [${resDb.origenUsado}]`;
        }
      } catch (eDb) {
        console.warn(`[ModuloIDEChile]: DB Client no pudo resolver ${idCapa}: ${eDb.message}`);
      }
    }

    // 3. Carga de respaldo directo desde repositorio local validado en src/data/
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
      throw new Error(`No fue posible cargar la capa oficial "${def.nombre}" ni en vivo ni desde la base de datos ni desde el repositorio local.`);
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
          extraInfo['Entidad'] = props.NOMBRE || props.nombre || props.ID || props.t_uv_nom || def.nombre;
          extraInfo['Institución'] = def.institucion;
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
    if (!idCapa) return null;
    if (CAPAS_OFICIALES[idCapa]) return CAPAS_OFICIALES[idCapa];
    if (typeof idCapa === 'string') {
      if (idCapa.startsWith('capa_')) {
        const alias = idCapa.replace('capa_', 'bbdd_');
        if (CAPAS_OFICIALES[alias]) return CAPAS_OFICIALES[alias];
      }
      if (idCapa.startsWith('bbdd_')) {
        const alias = idCapa.replace('bbdd_', 'capa_');
        if (CAPAS_OFICIALES[alias]) return CAPAS_OFICIALES[alias];
      }
    }
    return null;
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
