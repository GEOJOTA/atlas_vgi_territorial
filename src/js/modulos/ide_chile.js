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
    censo2024_manzanas: {
      id: 'censo2024_manzanas',
      nombre: 'Censo 2024 (Manzanas)',
      institucion: 'Instituto Nacional de Estadísticas (INE) / IDE Chile',
      ministerio: 'Ministerio de Economía, Fomento y Turismo',
      tipoServicio: 'ArcGIS FeatureServer (Capa 7)',
      urlServicio: 'https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/CPV2024_Microdato_gdb/FeatureServer/7',
      archivoLocal: 'data/ide_censo2024_manzanas.geojson',
      color: '#1B4D3E',
      icono: '🏢',
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
      icono: '🏛️',
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
      icono: '🌳',
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
      icono: '🏘️',
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
      icono: '🎓',
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
      icono: '👶',
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
      icono: '🎖️',
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
      icono: '🗺️',
      geometria: 'Polígono (Límite Urbano)',
      grupo: 'demografia',
      descripcion: 'Delimitación oficial del área urbana censal de la comuna de Santiago.',
      declaracion: 'Cartografía base de límites urbanos del Instituto Nacional de Estadísticas e IDE Chile.',
      citaAPA: 'Instituto Nacional de Estadísticas [INE]. (2024). Límite Urbano Censal de Chile. Secretaría Ejecutiva SNIT / IDE Chile. https://services5.arcgis.com'
    }
  };

  /**
   * Consulta una capa oficial: intenta FeatureServer en vivo si corresponde, con fallback al GeoJSON local
   */
  async function consultarCapaOficial(idCapa, bbox = null) {
    const def = CAPAS_OFICIALES[idCapa];
    if (!def) {
      throw new Error(`Capa oficial "${idCapa}" no reconocida en el catálogo.`);
    }

    const bboxConsulta = bbox || (window.NODO_CONFIG && window.NODO_CONFIG.area_por_defecto && window.NODO_CONFIG.area_por_defecto.bbox) || [-70.675, -33.450, -70.650, -33.435];
    const [minX, minY, maxX, maxY] = bboxConsulta;

    let geojson = null;
    let fuenteUsada = 'Servicio Oficial en Vivo';

    // 1. Intento de consulta en vivo al FeatureServer si está definido
    if (def.urlServicio && def.tipoServicio.indexOf('FeatureServer') !== -1) {
      const urlLive = `${def.urlServicio}/query?where=1%3D1&geometry=${minX}%2C${minY}%2C${maxX}%2C${maxY}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&f=geojson`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

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
      }

      props._idOficial = idCapa;
      props._nombre = nombreEntidad;
      props._subtipo = detalleTipo;
      props._institucion = def.institucion;
      props._fuente = fuenteUsada;
      props._licencia = 'Ley N° 20.285 / Datos Abiertos Estado de Chile';
      props._citaAPA = def.citaAPA;
      props._declaracion = def.declaracion;
      props._extraInfo = extraInfo;
      props._color = def.color;
      props._icono = def.icono;

      return {
        ...feat,
        properties: props
      };
    });

    return {
      def,
      fuenteUsada,
      geojson,
      cantidad: geojson.features.length
    };
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
    consultarCapaOficial,
    crearCapaWMSLeaflet,
    obtenerCapasDisponibles,
    obtenerDefinicion
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloIDEChile = ModuloIDEChile;
}
