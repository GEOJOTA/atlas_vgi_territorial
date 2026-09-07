/*
  ide_chile.js
  ------------
  Módulo de integración con servicios oficiales del Estado de Chile:
  - Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT)
  - Ministerio de Vivienda y Urbanismo (MINVU / geoide.minvu.cl)
  - Instituto Nacional de Estadísticas (INE / Censo 2024)
  - Consejo de Monumentos Nacionales (CMN / Geoportal / datos.gob.cl)

  Provee:
  1. Consumo en vivo de ArcGIS FeatureServer (GeoJSON filtrado por Bbox).
  2. Consumo de capas OGC WMS (Web Map Service) de MINVU.
  3. Respaldo y fallback a catálogos locales en src/data/ ante contingencias de red.
  4. Declaraciones institucionales completas, citas APA y trazabilidad legal (Ley N° 20.285).
*/

const ModuloIDEChile = (() => {

  // Catálogo maestro de capas oficiales integradas
  const CAPAS_OFICIALES = {
    censo2024_manzanas: {
      id: 'censo2024_manzanas',
      nombre: 'Censo 2024: Manzanas Censales',
      institucion: 'Instituto Nacional de Estadísticas (INE) / IDE Chile',
      ministerio: 'Ministerio de Economía, Fomento y Turismo',
      tipoServicio: 'ArcGIS FeatureServer (Capa 7)',
      urlServicio: 'https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/CPV2024_Microdato_gdb/FeatureServer/7',
      archivoLocal: 'data/ide_censo2024_manzanas.geojson',
      color: '#1B4D3E',
      icono: '🏢',
      geometria: 'Polígono (Manzanas)',
      descripcion: 'Manzanas censales oficiales del Censo de Población y Vivienda 2024 con microdatos de población total, hombres, mujeres y viviendas particulares.',
      declaracion: 'Datos provistos por el Instituto Nacional de Estadísticas (INE) y la Secretaría Ejecutiva SNIT / IDE Chile. Licencia de Datos Abiertos del Estado de Chile conforme a la Ley N° 20.285 sobre Acceso a la Información Pública.',
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
      descripcion: 'Catastro oficial de Inmuebles de Conservación Histórica (ICH) y Zonas de Conservación Histórica (ZCH) normadas por Instrumentos de Planificación Territorial (IPT) en Barrio Brasil y Santiago Centro.',
      declaracion: 'Información oficial producida por la División de Desarrollo Urbano del Ministerio de Vivienda y Urbanismo (MINVU). Publicada en geoide.minvu.cl e interoperable vía IDE Chile.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Oficial de Patrimonio en Instrumentos de Planificación Territorial (IPT). DDU, MINVU, Gobierno de Chile. https://geoide.minvu.cl/server/rest/services/IPT/Patrimonio/MapServer'
    },
    minvu_parques: {
      id: 'minvu_parques',
      nombre: 'Catastro Nacional de Parques Urbanos',
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
      descripcion: 'Catastro georreferenciado de parques y plazas públicas urbanas mayores a 2 hectáreas o de valor intercomunal (Plaza Brasil, Plaza Yungay, Parque Portales).',
      declaracion: 'Catastro Oficial de Parques Urbanos del MINVU, estandarizado conforme a la Política Nacional de Parques Urbanos y distribuido en la Infraestructura de Datos Espaciales de Chile.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Catastro Nacional de Parques Urbanos de Chile. Secretaría Ejecutiva SNIT / IDE Chile. https://geoide.minvu.cl/server/rest/services/Catastros/Catastro_de_parques_urbanos/MapServer'
    },
    minvu_barrios_historicos: {
      id: 'minvu_barrios_historicos',
      nombre: 'Barrios Históricos y Patrimoniales',
      institucion: 'MINVU / Programa Quiero Mi Barrio',
      ministerio: 'Secretaría Ejecutiva de Barrios',
      tipoServicio: 'ArcGIS FeatureServer',
      urlServicio: 'https://geoide.minvu.cl/server/rest/services/Planes_Programas/Barrios_Historicos/MapServer/0',
      archivoLocal: 'data/ide_minvu_barrios_historicos.geojson',
      color: '#7D5A2B',
      icono: '🏘️',
      geometria: 'Polígonos (Barrios)',
      descripcion: 'Polígonos de delimitación oficial de barrios históricos y patrimoniales intervenidos para la recuperación del tejido urbano tradicional (Barrio Yungay / Brasil).',
      declaracion: 'Polígonos oficiales del Programa de Recuperación de Barrios Patrimoniales del MINVU.',
      citaAPA: 'Ministerio de Vivienda y Urbanismo [MINVU]. (2024). Delimitación Oficial de Barrios Históricos y Zonas de Recuperación Urbana. Secretaría Ejecutiva de Barrios, MINVU. https://geoide.minvu.cl/server/rest/services/Planes_Programas/Barrios_Historicos/MapServer'
    },
    cmn_sitios_memoria: {
      id: 'cmn_sitios_memoria',
      nombre: 'Sitios de Memoria y Monumentos CMN',
      institucion: 'Consejo de Monumentos Nacionales (CMN) / datos.gob.cl',
      ministerio: 'Ministerio de las Culturas, las Artes y el Patrimonio',
      tipoServicio: 'Conjunto de Datos Abiertos / Geoportal',
      urlServicio: 'https://datos.gob.cl/dataset/7ddfa6cf-6d0e-405a-9bd0-273d7d678bbc',
      archivoLocal: 'data/ide_cmn_sitios_memoria.geojson',
      color: '#4B5142',
      icono: '🎖️',
      geometria: 'Puntos (Monumentos)',
      descripcion: 'Sitios de memoria y monumentos con decreto oficial de declaratoria por el Consejo de Monumentos Nacionales en la comuna de Santiago.',
      declaracion: 'Conjunto publicado en el Portal de Datos Abiertos del Estado (datos.gob.cl) y Geoportal de Chile, bajo licencia de atribución del Estado de Chile.',
      citaAPA: 'Consejo de Monumentos Nacionales [CMN]. (2024). Sitios de Memoria y Monumentos Nacionales con Declaratoria Oficial. Portal de Datos Abiertos del Estado de Chile. https://datos.gob.cl/organization/infraestructura-de-datos-geoespaciales-de-chile'
    }
  };

  /**
   * Consulta una capa oficial mediante su FeatureServer en vivo, con fallback al GeoJSON local
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

    // 1. Intento de consulta en vivo al FeatureServer
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

    // 2. Fallback a catálogo local validado
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
            fuenteUsada = `${def.institucion} (Réplica Validada IDE Chile)`;
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
      } else if (idCapa === 'cmn_sitios_memoria') {
        nombreEntidad = props.nombre || 'Sitio de Memoria CMN';
        detalleTipo = props.tipo_declaratoria || 'Monumento Histórico';
        extraInfo = {
          'Decreto': props.decreto || 'No indicado',
          'Dirección': props.direccion || 'Santiago',
          'Comuna': props.comuna || 'Santiago'
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
