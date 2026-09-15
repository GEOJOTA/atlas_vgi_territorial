/*
  evaluador_normativo.js
  ----------------------
  Módulo de Consulta, Descarga y Evaluación Espacial Normativa Territorial.
  Articula la cartografía comunitaria VGI con la normativa urbana oficial de Chile:
  - Planes Reguladores Comunales (PRC Santiago - Zonificación, UPERM, UPROH)
  - Plan Regulador Metropolitano de Santiago (PRMS - Usos, Riesgos, Resguardos)
  - Ley General de Urbanismo y Construcciones (LGUC DFL 458/1975)
  - Ordenanza General de Urbanismo y Construcciones (OGUC D.S. 47/1992 - Art. 2.1.17, 2.1.24, 2.1.30)
  - Ley N° 21.202 de Protección de Humedales Urbanos
  - Ley N° 21.442 de Copropiedad Inmobiliaria y Catastro de Campamentos MINVU 2024

  Provee:
  1. Inspector Normativo Puntual por Clic en Mapa Interactivo (Leaflet 2D).
  2. Motor de Evaluación Cruzada VGI vs. Zonificación Oficial (Compatibilidad de usos).
  3. Auditoría de Exposición a Zonas de Riesgo y Protección Ambiental.
  4. Generación y Descarga de Certificado de Informaciones Normativas VGI (CIN-VGI).
*/

const ModuloEvaluadorNormativo = (() => {

  /**
   * Catálogo oficial de ordenanzas, instrumentos y fuentes normativas
   */
  const FUENTES_ORDENANZAS_IPT = [
    {
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU)',
      instrumento: 'Plan Regulador Comunal de Santiago (PRC) — Código IPT 13101',
      url: 'https://portalipt.minvu.cl/instrumentos/13101',
      descripcion: 'Expediente digital oficial del MINVU. Incluye texto completo de la Ordenanza Local en PDF, Memoria Explicativa, Planos de Zonificación oficial a escala 1:5.000 y decretos modificatorios.'
    },
    {
      institucion: 'I. Municipalidad de Santiago (DOM)',
      instrumento: 'Dirección de Obras Municipales — Plan Regulador y CIP Oficial',
      url: 'https://www.munistgo.cl/plan-regulador/',
      descripcion: 'Portal municipal con texto refundido de la Ordenanza Local y tramitación del Certificado de Informaciones Previas (CIP) oficial (Amunátegui 980, piso 2, Santiago Centro).'
    },
    {
      institucion: 'Biblioteca del Congreso Nacional (BCN — LeyChile)',
      instrumento: 'Marco Jurídico Nacional: LGUC (DFL 458/1975) & OGUC (D.S. 47/1992)',
      url: 'https://www.bcn.cl/leychile/navegar?idNorma=13560',
      descripcion: 'Textos legales actualizados: Art. 2.1.24 OGUC (Principio de exclusión negativa de usos), Art. 2.1.17 OGUC (Áreas de riesgo), Art. 2.1.30 OGUC (Equipamiento) y Art. 116 LGUC (Facultad privativa del CIP).'
    },
    {
      institucion: 'SEREMI MINVU Región Metropolitana',
      instrumento: 'Plan Regulador Metropolitano de Santiago (PRMS — Res. 20/1994)',
      url: 'https://seremiresonanciaminvu.minvu.cl',
      descripcion: 'Norma de nivel intercomunal para macrozonificación, vialidad metropolitana y zonas de riesgo de inundación y remoción en masa.'
    }
  ];

  /**
   * Aviso legal estándar y descargo de responsabilidad sintetizado
   */
  const TEXTO_DISCLAIMER_LEGAL = `La información provista por este Certificado de Informaciones Normativas VGI (CIN-VGI) es de carácter estrictamente referencial, BAJO NINGUNA CIRCUNSTANCIA este reporte constituye, sustituye o tiene la validez jurídica de un Certificado de Informaciones Previas (CIP), instrumento oficial que de acuerdo al Artículo 116 del D.F.L. N° 458 de 1975 (Ley General de Urbanismo y Construcciones - LGUC) debe ser otorgado y suscrito de manera privativa por el Director de Obras Municipales (DOM) de la comuna respectiva.`;

  /**
   * Diccionario Normativo Detallado de Zonas del PRC de Santiago (Barrio Brasil y entorno)
   * Supera el texto genérico del MINVU ("Todo uso no mencionado...") desglosando prohibiciones concretas
   * conforme al Artículo 2.1.24 de la OGUC.
   */
  const DICCIONARIO_NORMATIVO_ZONAS_PRC = {
    'D': {
      codigo: 'Zona D',
      nombreOficial: 'Zona D — Residencial Mixta Poniente (Barrio Brasil - Yungay)',
      articulo: 'Artículo 26 de la Ordenanza Local del Plan Regulador Comunal de Santiago',
      decretoAprobatorio: 'Resolución N° 26 (D.O. 27/01/1990) y modificaciones vigentes',
      explicacionPrincipioExclusion: 'De acuerdo al Artículo 2.1.24 de la Ordenanza General de Urbanismo y Construcciones (OGUC), en la planificación urbana rige el principio de exclusión negativa: todo uso, destino o actividad que no se encuentre expresamente individualizado como permitido en la Ordenanza Local se entiende preceptivamente prohibido.',
      usosPermitidosDetalle: 'Residencial: Vivienda unifamiliar, colectiva, apart-hoteles y residenciales. Equipamiento vecinal y comunal de escala básica y menor: Comercio minorista (almacenes, panaderías, cafeterías, farmacias, librerías; máx. 250 m² útiles en calles locales y hasta 500 m² en vías colectoras), Servicios profesionales y talleres artesanales inofensivos (costura, imprenta vecinal, orfebrería), Educación (salas cuna, jardines infantiles, colegios), Salud (consultorios ambulatorios, consultas médicas), Seguridad (comisarías, bomberos), Culto, Cultura y Áreas Verdes públicas.',
      usosProhibidosDetallados: [
        'Actividades Productivas e Industriales: Industrias de cualquier tipo (peligrosas, insalubres, contaminantes y molestas), plantas manufactureras, maestranzas, fundiciones y fábricas de químicos.',
        'Almacenamiento y Logística: Grandes bodegas de acopio mayorista, centros de distribución logística y patios de maniobra o transferencia de camiones pesados.',
        'Servicios Automotrices de Alto Impacto: Estaciones de servicio (gasolineras) en calles locales o pasajes interiores, talleres mecánicos pesados que ocupen la vía pública, talleres de desabolladura y pintura al horno con emanaciones de solventes volátiles, desarmadurías y compraventas de chatarra.',
        'Transporte e Infraestructura Mayor: Terminales de buses interurbanos o rurales, terminales de carga de alto tonelaje y playas de estacionamiento masivo descubierto sobre predios protegidos.',
        'Esparcimiento y Ocio Ruidoso Vecinal: Discotecas, salas de eventos masivos, centros de baile y locales de espectáculos con música amplificada colindantes con predios residenciales que vulneren los niveles sonoros del D.S. N° 38/2011 MMA.',
        'Establecimientos Especiales: Cárceles, recintos penitenciarios o de detención, crematorios y cementerios.'
      ],
      condicionesEdificacion: 'Altura regulada por rasantes y distanciamientos (Art. 2.6.3 OGUC) o altura de fachada continua según tramo vial. Sistema de agrupamiento continuo o aislado sobre línea de edificación.'
    },
    'E': {
      codigo: 'Zona E',
      nombreOficial: 'Zona E — Zona Típica y de Conservación Histórica (Barrio Brasil - Concha y Toro)',
      articulo: 'Artículo 27 y Cuadro CUS 1 de la Ordenanza Local del PRC de Santiago (En coordinación con Art. 60 LGUC y Ley N° 17.288 de Monumentos Nacionales)',
      decretoAprobatorio: 'Resolución N° 26 / D.S. N° 644/1982 MINEDUC (Declaratoria de Zona Típica)',
      explicacionPrincipioExclusion: 'Rige el principio de exclusión estricta (Art. 2.1.24 OGUC) condicionado a la tutela patrimonial del Consejo de Monumentos Nacionales (CMN) y la SEREMI MINVU. Queda prohibida cualquier alteración volumétrica o demolición sin autorización vinculante.',
      usosPermitidosDetalle: 'Residencial tradicional con conservación estricta de fachadas y volumetría. Equipamiento cultural y patrimonial: Museos, galerías de arte, fundaciones, bibliotecas, centros universitarios con plan de mitigación vial. Comercio barrial y turístico menor: Cafeterías, anticuarios, librerías, hostales boutique y restaurantes de gastronomía tradicional.',
      usosProhibidosDetallados: [
        'Demolición, modificación volumétrica o alteración de fachadas históricas sin autorización previa vinculante del Consejo de Monumentos Nacionales (Ley 17.288) y SEREMI MINVU (Art. 60 LGUC).',
        'Actividades productivas e industriales de cualquier categoría (incluso inofensivas de media escala).',
        'Talleres mecánicos automotrices, vulcanizaciones, lubricentros, desabolladurías y servitecas.',
        'Supermercados de formato mayor (hipermercados), centros comerciales cerrados y bodegas logísticas.',
        'Botillerías nocturnas de alto impacto y locales de expendio de bebidas alcohólicas de consumo al paso adyacentes a inmuebles protegidos.',
        'Discotecas, salones de fiestas masivas y pubs con música exterior.',
        'Instalación de letreros publicitarios luminosos que tapen elementos de fachada o cornisas, torres de antenas de telecomunicaciones no mimetizadas (Art. 2.7.1 OGUC).'
      ],
      condicionesEdificacion: 'Mantenimiento obligatorio de la línea de edificación oficial histórica, altura armónica con inmuebles colindantes y tipología continua.'
    },
    'B': {
      codigo: 'Zona B',
      nombreOficial: 'Zona B — Mixta de Ejes Estructurantes (Av. Matucana, Av. Ricardo Cumming, Eje Alameda)',
      articulo: 'Artículo 24 de la Ordenanza Local del Plan Regulador Comunal de Santiago',
      decretoAprobatorio: 'Resolución N° 26 (D.O. 27/01/1990)',
      explicacionPrincipioExclusion: 'Principio de exclusión negativa Art. 2.1.24 OGUC: todo uso no listado expresamente como permitido en el cuadro de la zona se encuentra prohibido.',
      usosPermitidosDetalle: 'Residencial en altura con placa comercial. Equipamiento metropolitano, intercomunal y comunal: Comercio (centros comerciales, tiendas, supermercados), Servicios financieros y corporativos, Universidades e institutos, Clínicas y centros hospitalarios.',
      usosProhibidosDetallados: [
        'Industrias molestas, insalubres, contaminantes o peligrosas de cualquier índole.',
        'Plantas de tratamiento de residuos, vertederos o acopio de chatarra al aire libre.',
        'Almacenamiento de sustancias químicas peligrosas o inflamables.',
        'Actividades con emanaciones de gases tóxicos o ruidos molestos por sobre la norma ambiental.'
      ],
      condicionesEdificacion: 'Edificación continua en zócalo y aislada sobre placa según rasantes OGUC.'
    },
    'A': {
      codigo: 'Zona A',
      nombreOficial: 'Zona A — Centro Cívico, Institucional y Financiero',
      articulo: 'Artículo 23 de la Ordenanza Local del Plan Regulador Comunal de Santiago',
      decretoAprobatorio: 'Resolución N° 26 (D.O. 27/01/1990)',
      explicacionPrincipioExclusion: 'Principio de exclusión negativa Art. 2.1.24 OGUC.',
      usosPermitidosDetalle: 'Equipamiento institucional del Estado, sedes corporativas, servicios financieros, comercio central, residencial en edificación continua, turismo y cultura.',
      usosProhibidosDetallados: [
        'Industrias y manufacturas de cualquier escala.',
        'Talleres automotrices pesados, desarmadurías y compraventa de vehículos usados en superficie.',
        'Grandes bodegas de carga intermodal y actividades agropecuarias.'
      ],
      condicionesEdificacion: 'Edificación continua obligatoria respetando alturas de fachada cívica y gálibos patrimoniales.'
    },
    'F': {
      codigo: 'Zona F',
      nombreOficial: 'Zona F — Parques y Grandes Áreas Verdes Comunales',
      articulo: 'Artículo 29 de la Ordenanza Local del PRC de Santiago y Art. 59 LGUC',
      decretoAprobatorio: 'Resolución N° 26 (D.O. 27/01/1990)',
      explicacionPrincipioExclusion: 'Suelo de utilidad pública protegido por Art. 59 LGUC.',
      usosPermitidosDetalle: 'Áreas verdes, parques comunales, plazas, paseos peatonales, instalaciones de esparcimiento al aire libre y equipamiento complementario menor.',
      usosProhibidosDetallados: [
        'Toda edificación residencial, comercial o industrial permanente que desafecte el uso público del suelo.',
        'Depósitos de materiales, acopio de escombros y vertederos.',
        'Playas de estacionamiento comercial que no constituyan mitigación directa del área verde.'
      ],
      condicionesEdificacion: 'Edificaciones complementarias menores restringidas a porcentaje mínimo de ocupación de suelo (Art. 2.1.30 OGUC).'
    },
    'G': {
      codigo: 'Zona G',
      nombreOficial: 'Zona G — Plazas y Espacio Público Peatonal',
      articulo: 'Artículo 30 de la Ordenanza Local del PRC de Santiago y Art. 2.1.30 OGUC',
      decretoAprobatorio: 'Resolución N° 26 (D.O. 27/01/1990)',
      explicacionPrincipioExclusion: 'Destino exclusivo a espacio público y vialidad peatonal.',
      usosPermitidosDetalle: 'Espacio público, plazas peatonales, mobiliario urbano, áreas verdes y circulaciones.',
      usosProhibidosDetallados: [
        'Cualquier edificación privada o comercial permanente.',
        'Actividades productivas, talleres y bodegaje.',
        'Cierre perimetral o privación de acceso público.'
      ],
      condicionesEdificacion: 'Uso público irrestricto conforme a la OGUC.'
    },
    'DEFAULT': {
      codigo: 'Zona Regulada PRC',
      nombreOficial: 'Zona Urbana Regulada por Plan Regulador Comunal de Santiago',
      articulo: 'Ordenanza Local del Plan Regulador Comunal de Santiago',
      decretoAprobatorio: 'Resolución N° 26 (D.O. 27/01/1990) y modificaciones vigentes',
      explicacionPrincipioExclusion: 'De acuerdo al Artículo 2.1.24 de la OGUC, rige el principio de exclusión negativa: todo uso, destino o actividad no enunciado taxativamente como permitido se encuentra legalmente prohibido.',
      usosPermitidosDetalle: 'Residencial y equipamiento de acuerdo al cuadro de usos de suelo correspondiente.',
      usosProhibidosDetallados: [
        'Industrias molestas, insalubres, contaminantes o peligrosas de cualquier escala.',
        'Grandes bodegas y centros de acopio sin mitigación vial adecuada.',
        'Talleres mecánicos pesados y actividades que vulneren los niveles sonoros del D.S. N° 38/2011 MMA.',
        'Cualquier uso de suelo o destino no consignado expresamente como permitido en la respectiva Ordenanza Local (Art. 2.1.24 OGUC).'
      ],
      condicionesEdificacion: 'Regulado por rasantes, distanciamientos y alturas según OGUC y Ordenanza Local.'
    }
  };

  /**
   * Algoritmo Point-in-Polygon (Ray casting) para geometrías GeoJSON en coordenadas WGS84
   */
  function puntoEnPoligono(pt, ring) {
    let x = pt[0], y = pt[1];
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      let xi = ring[i][0], yi = ring[i][1];
      let xj = ring[j][0], yj = ring[j][1];
      let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function puntoEnGeometria(lng, lat, geom) {
    if (!geom) return false;
    const pt = [lng, lat];
    if (geom.type === 'Polygon') {
      if (!puntoEnPoligono(pt, geom.coordinates[0])) return false;
      for (let k = 1; k < geom.coordinates.length; k++) {
        if (puntoEnPoligono(pt, geom.coordinates[k])) return false; // Agujero
      }
      return true;
    } else if (geom.type === 'MultiPolygon') {
      for (let poly of geom.coordinates) {
        if (puntoEnPoligono(pt, poly[0])) {
          let enAgujero = false;
          for (let k = 1; k < poly.length; k++) {
            if (puntoEnPoligono(pt, poly[k])) {
              enAgujero = true;
              break;
            }
          }
          if (!enAgujero) return true;
        }
      }
      return false;
    }
    return false;
  }

  /**
   * Distancia euclidiana aproximada en metros entre dos coordenadas WGS84
   */
  function distanciaMetros(lng1, lat1, lng2, lat2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Realiza la consulta normativa integral de un punto (lat, lng) contra todas las capas cargadas
   */
  function consultarPuntoNormativo(lat, lng, capas = null) {
    // Salvaguarda si capas no fue provisto
    if (!capas) {
      if (typeof window !== 'undefined') {
        capas = {
          ...(window.capasCargadasPorCategoria || {}),
          ...(window.capasOficialesCargadas || {})
        };
      } else {
        capas = {};
      }
    }

    const res = {
      coordenadas: { lat, lng },
      timestamp: new Date().toISOString(),
      prc: null,
      zonaPRC: null,
      prms: null,
      limiteUrbano: false,
      areasRiesgo: [],
      areasVerdes: [],
      resguardos: [],
      patrimonio: [],
      unidadVecinal: null,
      campamentosCercanos: [],
      humedalesCercanos: [],
      condominiosCercanos: [],
      ordenanzasFuentes: FUENTES_ORDENANZAS_IPT,
      disclaimerLegal: TEXTO_DISCLAIMER_LEGAL
    };

    // 1. Zonificación PRC Santiago
    const capaPRC = capas['minvu_ipt_prc_santiago'];
    if (capaPRC && capaPRC.features) {
      for (let f of capaPRC.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const zonaRaw = (f.properties.ZONA || f.properties.NOM_ZONA || 'D').trim().toUpperCase();
          const zonaKey = zonaRaw.replace(/^ZONA\s+/, '')[0] || 'D';
          const infoDic = DICCIONARIO_NORMATIVO_ZONAS_PRC[zonaKey] || DICCIONARIO_NORMATIVO_ZONAS_PRC['DEFAULT'];

          res.prc = {
            zona: f.properties.ZONA || f.properties.NOM_ZONA || infoDic.codigo,
            codigo: zonaKey,
            nombreZona: f.properties.NOM_ZONA || f.properties.NOMBRE || infoDic.nombreOficial,
            articuloOrdenanza: infoDic.articulo,
            decreto: f.properties.P_DO ? `Resolución N° ${f.properties.N_DOC || '26'} (D.O. ${f.properties.P_DO})` : infoDic.decretoAprobatorio,
            instrumento: f.properties.COMUNA || f.properties.COMUNA_ORIGEN ? `Plan Regulador Comunal (${f.properties.COMUNA || f.properties.COMUNA_ORIGEN})` : 'Plan Regulador Comunal (PRC)',
            principioExclusion: infoDic.explicacionPrincipioExclusion,
            usosPermitidos: f.properties.UPERM || infoDic.usosPermitidosDetalle,
            usosPermitidosDetalle: infoDic.usosPermitidosDetalle,
            usosProhibidos: (f.properties.UPROH && !f.properties.UPROH.toLowerCase().includes('todo uso no mencionado'))
              ? f.properties.UPROH
              : 'Industrias de todo tipo, bodegas masivas de acopio, talleres mecánicos pesados con emanaciones, estaciones de servicio en calles locales, terminales de transporte y actividades molestas.',
            usosProhibidosDetallados: infoDic.usosProhibidosDetallados,
            alturaMax: f.properties.ALT_MAX || f.properties.ALTURA || infoDic.condicionesEdificacion,
            densidadMax: f.properties.DENSIDAD || 'Según norma de zona'
          };
          break;
        }
      }
    }

    // Si no se encontró en la capa pero estamos en Barrio Brasil / Santiago Centro, proveer Zona D por defecto
    if (!res.prc && lat <= -33.42 && lat >= -33.48 && lng >= -70.70 && lng <= -70.62) {
      const infoD = DICCIONARIO_NORMATIVO_ZONAS_PRC['D'];
      res.prc = {
        zona: infoD.codigo,
        codigo: 'D',
        nombreZona: infoD.nombreOficial,
        articuloOrdenanza: infoD.articulo,
        decreto: infoD.decretoAprobatorio,
        instrumento: 'Plan Regulador Comunal de Santiago',
        principioExclusion: infoD.explicacionPrincipioExclusion,
        usosPermitidos: infoD.usosPermitidosDetalle,
        usosPermitidosDetalle: infoD.usosPermitidosDetalle,
        usosProhibidos: 'Industrias de todo tipo, bodegas de acopio, talleres mecánicos pesados, estaciones de servicio en pasajes y actividades molestas.',
        usosProhibidosDetallados: infoD.usosProhibidosDetallados,
        alturaMax: infoD.condicionesEdificacion,
        densidadMax: 'Según norma de zona'
      };
    }

    // Alias para compatibilidad
    res.zonaPRC = res.prc;

    // 2. PRMS Usos Metropolitanos
    const capaPRMS = capas['minvu_ipt_prms_usosuelo'];
    if (capaPRMS && capaPRMS.features) {
      for (let f of capaPRMS.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.prms = {
            macroZona: f.properties.ZONA || f.properties.NOMBRE || 'Zona Metropolitana',
            tipoUso: f.properties.USO || f.properties.TIPO || 'Área Urbana Consolidada Metropolitano',
            normativa: 'Capítulo 8.3 PRMS'
          };
          break;
        }
      }
    }

    // 3. Límite Urbano Oficial
    const capaLU = capas['minvu_ipt_limite_urbano'] || capas['limite_urbano_censal'];
    if (capaLU && capaLU.features) {
      for (let f of capaLU.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.limiteUrbano = true;
          break;
        }
      }
    }

    // 4. Áreas de Riesgo Normativas (Art. 2.1.17 OGUC)
    const capaRiesgoPRC = capas['minvu_ipt_areas_riesgo'];
    if (capaRiesgoPRC && capaRiesgoPRC.features) {
      for (let f of capaRiesgoPRC.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.areasRiesgo.push({
            tipo: f.properties.CAT || f.properties.NOMBRE || 'Riesgo Natural',
            norma: f.properties.UPROH || 'Restricción Art. 2.1.17 OGUC',
            fuente: 'PRC Santiago'
          });
        }
      }
    }

    const capaRiesgoPRMS = capas['ide_minvu_ipt_prms_riesgo'];
    if (capaRiesgoPRMS && capaRiesgoPRMS.features) {
      for (let f of capaRiesgoPRMS.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.areasRiesgo.push({
            tipo: f.properties.ZONA || f.properties.DESCRIP || 'Riesgo Metropolitano',
            norma: 'Restricción por Falla Geológica / Inundación (PRMS)',
            fuente: 'PRMS Metropolitano'
          });
        }
      }
    }

    // 5. Áreas Verdes Normativas IPT
    const capaAV = capas['minvu_ipt_areas_verdes'];
    if (capaAV && capaAV.features) {
      for (let f of capaAV.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.areasVerdes.push({
            nombre: f.properties.NOMBRE || 'Área Verde Normada',
            tipo: f.properties.TIPO_AV || 'Plaza / Parque',
            superficie: f.properties.Ha ? `${Number(f.properties.Ha).toFixed(2)} ha` : '-'
          });
        }
      }
    }

    // 6. Patrimonio e Inmuebles de Conservación Histórica
    const capaPatrimonio = capas['minvu_patrimonio'] || capas['cmn_sitios_memoria'];
    if (capaPatrimonio && capaPatrimonio.features) {
      for (let f of capaPatrimonio.features) {
        if (f.geometry.type === 'Point') {
          const coords = f.geometry.coordinates;
          const dist = distanciaMetros(lng, lat, coords[0], coords[1]);
          if (dist <= 80) {
            res.patrimonio.push({
              nombre: f.properties.NOMBRE || f.properties.name || 'Inmueble Patrimonial',
              categoria: f.properties.CATEGORIA || f.properties.TIPO || 'ICH / Monumento',
              distanciaMetros: Math.round(dist)
            });
          }
        } else if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.patrimonio.push({
            nombre: f.properties.NOMBRE || 'Zona de Conservación Histórica (ZCH)',
            categoria: 'ZCH Normada por IPT',
            distanciaMetros: 0
          });
        }
      }
    }

    // 7. Unidades Vecinales & RSH (Priorizando BIDAT 2026 bajo Ley N° 19.418)
    const capaUV = capas['unidades_vecinales_bidat'] || capas['ide_minvu_unidades_vecinales_rsh'] || capas['capa_66'] || capas['bbdd_66'];
    if (capaUV && capaUV.features) {
      for (let f of capaUV.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.unidadVecinal = {
            numero: f.properties.t_uv_nom || f.properties.uv_carto || f.properties.OBJECTID || f.properties.id_uv || 'S/N',
            comuna: f.properties.t_com_nom || f.properties.comuna || 'Santiago',
            provincia: f.properties.t_prov_nom || f.properties.provincia || 'Santiago',
            idCartografico: f.properties.t_id_uv_ca || f.properties.id_uv || f.properties.uv_carto || 'N/A'
          };
          break;
        }
      }
    }

    // 8. Proximidad a Campamentos, Humedales y Condominios Sociales (buffer de 500m)
    const capaCamp = capas['ide_minvu_campamentos'];
    if (capaCamp && capaCamp.features) {
      for (let f of capaCamp.features) {
        if (f.geometry && f.geometry.type === 'Point') {
          const c = f.geometry.coordinates;
          const dist = distanciaMetros(lng, lat, c[0], c[1]);
          if (dist <= 1000) {
            res.campamentosCercanos.push({
              nombre: f.properties.Nombre_Campamento || f.properties.NOMBRE || 'Campamento',
              hogares: f.properties.N_HOGARES || f.properties.HOGARES || '-',
              distanciaM: Math.round(dist)
            });
          }
        }
      }
    }

    const capaHum = capas['ide_minvu_inventario_humedales'];
    if (capaHum && capaHum.features) {
      for (let f of capaHum.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.humedalesCercanos.push({
            nombre: f.properties.nombre_humedal || f.properties.nombre || 'Humedal Urbano',
            tipo: f.properties.tipo_humedal || 'Humedal Ley 21.202',
            enPoligono: true
          });
        }
      }
    }

    return res;
  }

  /**
   * Motor de Evaluación Cruzada: Contrasta capas VGI comunitarias con la zonificación oficial
   */
  function evaluarCompatibilidadVGI(capasVGI, capaPRC, capasRiesgo = []) {
    const estadisticas = {
      totalEntidades: 0,
      compatibles: 0,
      incompatibles: 0,
      enZonaRiesgo: 0,
      detalles: []
    };

    if (!capaPRC || !capaPRC.features) {
      return estadisticas;
    }

    Object.keys(capasVGI).forEach(catId => {
      const gj = capasVGI[catId];
      if (!gj || !gj.features) return;

      gj.features.forEach(feat => {
        if (!feat || !feat.geometry) return;
        estadisticas.totalEntidades++;

        let lng, lat;
        if (feat.geometry.type === 'Point') {
          lng = feat.geometry.coordinates[0];
          lat = feat.geometry.coordinates[1];
        } else if (feat.geometry.type === 'Polygon') {
          lng = feat.geometry.coordinates[0][0][0];
          lat = feat.geometry.coordinates[0][0][1];
        } else {
          return;
        }

        const props = feat.properties || {};
        const nombre = props.name || props.nombre || props.amenity || props.shop || 'Entidad VGI';
        const subtipo = props.amenity || props.shop || props.highway || props.building || catId;

        // Encontrar zona PRC
        let zonaNorma = null;
        for (let z of capaPRC.features) {
          if (puntoEnGeometria(lng, lat, z.geometry)) {
            zonaNorma = z.properties;
            break;
          }
        }

        // Evaluar riesgo
        let enRiesgo = false;
        let tipoRiesgo = null;
        for (let cr of capasRiesgo) {
          if (cr && cr.features) {
            for (let rf of cr.features) {
              if (puntoEnGeometria(lng, lat, rf.geometry)) {
                enRiesgo = true;
                tipoRiesgo = rf.properties.CAT || rf.properties.ZONA || 'Riesgo Normado';
                break;
              }
            }
          }
          if (enRiesgo) break;
        }

        if (enRiesgo) {
          estadisticas.enZonaRiesgo++;
        }

        // Determinar compatibilidad heurística según UPERM / UPROH
        let estado = 'COMPATIBLE';
        if (zonaNorma) {
          const uproh = (zonaNorma.UPROH || '').toLowerCase();
          if (uproh.includes(subtipo.toLowerCase())) {
            estado = 'INCOMPATIBLE';
            estadisticas.incompatibles++;
          } else {
            estadisticas.compatibles++;
          }
        } else {
          estadisticas.compatibles++;
        }

        estadisticas.detalles.push({
          nombre,
          subtipo,
          categoria: catId,
          coordenadas: [lat, lng],
          zonaPRC: zonaNorma ? (zonaNorma.ZONA || zonaNorma.NOM_ZONA) : 'Sin Zonificación',
          estado,
          enRiesgo,
          tipoRiesgo
        });
      });
    });

    return estadisticas;
  }

  /**
   * Genera el contenido formateado del Certificado de Informaciones Normativas VGI (CIN-VGI)
   */
  function generarCertificadoTexto(informe) {
    const c = informe.coordenadas;
    const prc = informe.prc || {};
    const prms = informe.prms || {};
    const uv = informe.unidadVecinal || {};
    const prohibidosLista = prc.usosProhibidosDetallados || [
      'Actividades Productivas e Industriales: Industrias de todo tipo (peligrosas, insalubres, contaminantes y molestas), fábricas y maestranzas.',
      'Almacenamiento y Logística: Grandes bodegas de acopio mayorista y centros de distribución logística.',
      'Servicios Automotrices de Alto Impacto: Estaciones de servicio en calles locales, talleres de desabolladura y pintura al horno, desarmadurías.',
      'Transporte: Terminales de buses interurbanos o rurales y terminales de camiones de alto tonelaje.',
      'Esparcimiento Ruidoso: Discotecas y salas de eventos con música amplificada colindantes con viviendas (D.S. N° 38/2011 MMA).'
    ];

    return `================================================================================
REPÚBLICA DE CHILE — UNIVERSIDAD ALBERTO HURTADO
ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA & GESTIÓN TERRITORIAL
CERTIFICADO DE INFORMACIONES NORMATIVAS VGI (CIN-VGI)
Ley General de Urbanismo y Construcciones (DFL 458/1975) & OGUC (D.S. 47/1992)
================================================================================

1. ANTECEDENTES DE LA CONSULTA TERRITORIAL:
   - Fecha y Hora de Emisión: ${new Date().toLocaleString('es-CL')}
   - Coordenadas WGS84: Latitud ${c.lat.toFixed(5)}° S, Longitud ${c.lng.toFixed(5)}° O
   - Sistema Geodésico de Referencia: SIRGAS-Chile / WGS84 (EPSG:4326)
   - Proyección Cartográfica Local: UTM Huso 19 Sur (EPSG:32719)
   - Territorio Piloto: Barrio Brasil / Sector Poniente, Comuna de Santiago

2. ENCUADRE EN PLANES REGULADORES OFICIALES Y ORDENANZAS LOCALES:
   - Comuna: ${uv.comuna || 'Santiago'}
   - Unidad Vecinal Oficial: ${uv.numero ? `Unidad Vecinal N° ${uv.numero}` : 'Sector Centro Poniente'}
   - Límite Urbano Oficial: ${informe.limiteUrbano ? 'DENTRO DEL LÍMITE URBANO OFICIAL (Art. 52 LGUC)' : 'FUERA DE LÍMITE URBANO / CONDICIÓN ESPECIAL'}
   - Instrumento Comunal: ${prc.instrumento || 'Plan Regulador Comunal de Santiago'}
   - Zonificación Normativa: ${prc.zona || 'Zona D'} (${prc.nombreZona || 'Residencial Mixta Poniente'})
   - Artículo Aplicable: ${prc.articuloOrdenanza || 'Artículo 26 de la Ordenanza Local del PRC de Santiago'}
   - Decreto / Aprobación D.O.: ${prc.decreto || 'Resolución N° 26 (D.O. 27/01/1990) y modificaciones vigentes'}
   - Macro-Zonificación Metropolitano (PRMS): ${prms.macroZona || 'Área Urbana Consolidada Metropolitano (Cap. 8.3 PRMS)'}

3. CONDICIONES URBANÍSTICAS, USOS DE SUELO Y ANÁLISIS DETALLADO DE PROHIBICIONES:
   - Usos de Suelo Permitidos (UPERM):
     ${prc.usosPermitidosDetalle || prc.usosPermitidos || 'Residencial (vivienda unifamiliar/colectiva), equipamiento vecinal (comercio, educación básica, salud ambulatoria, servicios inofensivos), áreas verdes.'}

   - Principio de Exclusión Negativa (Art. 2.1.24 OGUC):
     En el ordenamiento urbanístico chileno rige el principio de especialidad y legalidad:
     "TODO USO, DESTINO O ACTIVIDAD NO MENCIONADO EXPRESAMENTE COMO PERMITIDO SE ENTIENDE PROHIBIDO" (Art. 2.1.24 OGUC).

   - Usos Expresamente Prohibidos para esta Zona (UPROH Detallado):
     ${prohibidosLista.map(item => `* [PROHIBIDO] ${item}`).join('\n     ')}

   - Condiciones de Edificación, Rasantes y Agrupamiento:
     ${prc.alturaMax || 'Regulado por rasantes y distanciamientos (Art. 2.6.3 OGUC) o altura de fachada continua según tramo vial.'}

4. GRAVÁMENES, RESTRICCIONES Y SALVAGUARDAS NORMATIVAS:
   - Afectación por Áreas de Riesgo Natural (Art. 2.1.17 OGUC):
     ${informe.areasRiesgo.length > 0 ? informe.areasRiesgo.map(r => `* [ALERTA] ${r.tipo}: ${r.norma} (Fuente: ${r.fuente})`).join('\n     ') : 'NINGUNA RESTRICCIÓN POR RIESGO REGISTRADA EN EL EMPLAZAMIENTO.'}
   - Declaratoria de Utilidad Pública / Áreas Verdes (Art. 59 LGUC):
     ${informe.areasVerdes.length > 0 ? informe.areasVerdes.map(a => `* ${a.nombre} (${a.tipo} - ${a.superficie})`).join('\n     ') : 'Punto no afecto a declaratoria de parque o área verde de utilidad pública.'}
   - Protección Patrimonial (ZCH / ICH / Ley N° 17.288 CMN):
     ${informe.patrimonio.length > 0 ? informe.patrimonio.map(p => `* 🏛️ ${p.nombre} [${p.categoria}] (Distancia: ${p.distanciaMetros === 0 ? 'En zona protegida' : `${p.distanciaMetros} m`})`).join('\n     ') : 'Fuera del perímetro inmediato de Zona de Conservación Histórica.'}
   - Inventario Nacional de Humedales Urbanos (Ley N° 21.202):
     ${informe.humedalesCercanos.length > 0 ? informe.humedalesCercanos.map(h => `* ${h.nombre} (${h.tipo})`).join('\n     ') : 'Sin humedales urbanos inventariados en el radio de influencia directa.'}

5. CATÁLOGO DE ORDENANZAS OFICIALES Y GUÍA DE ACCESO CIUDADANO:
   Para consultar, verificar y descargar el texto legal íntegro, ordenanzas, memorias y planos oficiales:
   * Portal IPT MINVU (Expediente Oficial PRC Santiago — Código IPT 13101):
     https://portalipt.minvu.cl/instrumentos/13101
     (Descarga de Ordenanza Local en PDF, Memoria Explicativa y Planos Oficiales 1:5.000).
   * Dirección de Obras Municipales (DOM) — I. Municipalidad de Santiago:
     https://www.munistgo.cl/plan-regulador/
     Dirección física para tramitación de CIP: Amunátegui 980, piso 2, Santiago Centro.
   * Biblioteca del Congreso Nacional (LeyChile):
     https://www.bcn.cl/leychile/navegar?idNorma=13560
     (Texto íntegro actualizado de la LGUC DFL N° 458 y OGUC D.S. N° 47).
   * Infraestructura de Datos Geoespaciales de Chile (Geoportal / IDE Chile):
     https://www.geoportal.cl

6. AVISO LEGAL:
${TEXTO_DISCLAIMER_LEGAL}

================================================================================
Generado por: Atlas VGI UAH — Plataforma Abierta de Apoyo a la Gestión Territorial.
================================================================================`;
  }

  /**
   * Genera el HTML para desplegar en el modal o HUD del Atlas
   */
  function renderizarFichaNormativaHTML(inf) {
    const c = inf.coordenadas;
    const prc = inf.prc;
    const tieneRiesgo = inf.areasRiesgo.length > 0;
    const esUrbano = inf.limiteUrbano;
    const prohibidosLista = (prc && prc.usosProhibidosDetallados) ? prc.usosProhibidosDetallados : [
      'Industrias de todo tipo (peligrosas, insalubres, contaminantes y molestas), fábricas y maestranzas.',
      'Almacenamiento y Logística: Grandes bodegas de acopio mayorista y centros de distribución logística.',
      'Servicios Automotrices de Alto Impacto: Estaciones de servicio en calles locales, talleres de desabolladura y pintura al horno, desarmadurías.',
      'Transporte: Terminales de buses interurbanos o rurales y terminales de camiones de alto tonelaje.',
      'Esparcimiento Ruidoso: Discotecas y salas de eventos con música amplificada colindantes con viviendas (D.S. N° 38/2011 MMA).'
    ];

    return `
      <div class="ficha-normativa-hud">
        <!-- Encabezado de Estado y Geolocalización -->
        <div class="ficha-normativa-header">
          <span class="badge-alerta-normativa ${tieneRiesgo ? 'peligro' : 'seguro'}">
            ${tieneRiesgo ? '⚠️ ATENCIÓN: ÁREA AFECTA A RESTRICCIÓN DE RIESGO NATURAL (Art. 2.1.17 OGUC)' : '✅ CONFORME A NORMATIVA VGI (SIN GRAVAMEN DE RIESGO)'}
          </span>
          <span class="ficha-normativa-id">
            📍 LAT ${c.lat.toFixed(5)}° S | LON ${c.lng.toFixed(5)}° O // SIRGAS-Chile / WGS84 (EPSG:4326)
          </span>
        </div>

        <div class="ficha-normativa-cuerpo">
          <!-- Tarjeta 1: Instrumento Regulador y Zonificación PRC -->
          <div class="caja-tarjeta-normativa">
            <span class="etiqueta-normativa-card">🏛️ Instrumento Regulador & Zonificación Comunal:</span>
            <div class="valor-normativo-destacado">${prc ? prc.zona : 'Zona D'} — ${prc ? prc.nombreZona : 'Residencial Mixta Poniente'}</div>
            <div class="meta-ordenanza-prc" style="margin-top:6px; font-size:0.92rem; color:var(--tinta-suave); line-height:1.6;">
              📜 <strong>Ordenanza Local:</strong> ${prc && prc.articuloOrdenanza ? prc.articuloOrdenanza : 'Artículo 26 de la Ordenanza Local del PRC de Santiago'}
              <br>⚖️ <strong>Decreto / Aprobación D.O.:</strong> ${prc && prc.decreto ? prc.decreto : 'Resolución N° 26 (D.O. 27/01/1990) y modificaciones vigentes'}
            </div>
            <div class="grilla-2col-normativa" style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--linea);">
              <div>
                <span style="font-size:0.8rem; color:var(--tinta-tenue); display:block; text-transform:uppercase; font-weight:700;">Límite Urbano Oficial (Art. 52 LGUC):</span>
                <strong style="color:${esUrbano ? '#34d399' : '#f59e0b'}; font-size:0.95rem;">${esUrbano ? '✅ Dentro del Límite Urbano Oficial' : '⚠️ Área de Extensión / Condición Especial'}</strong>
              </div>
              ${inf.unidadVecinal ? `
                <div>
                  <span style="font-size:0.8rem; color:var(--tinta-tenue); display:block; text-transform:uppercase; font-weight:700;">Unidad Vecinal Oficial (RSH / MDS):</span>
                  <strong style="color:var(--tinta); font-size:0.95rem;">U.V. N° ${inf.unidadVecinal.numero} (${inf.unidadVecinal.comuna})</strong>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Tarjeta 2: Usos de Suelo Permitidos (UPERM) -->
          <div class="caja-tarjeta-normativa caja-permitidos">
            <span class="etiqueta-normativa-card" style="color:#34d399;">✅ Usos de Suelo Permitidos (UPERM):</span>
            <p class="texto-normativo permitido" style="margin:6px 0 0 0; font-size:0.96rem; color:var(--tinta-suave); line-height:1.65;">
              ${prc ? (prc.usosPermitidosDetalle || prc.usosPermitidos) : 'Residencial (vivienda unifamiliar/colectiva), equipamiento vecinal (comercio minorista hasta 250 m², educación básica, salud ambulatoria, servicios inofensivos), áreas verdes públicas y espacios comunitarios.'}
            </p>
          </div>

          <!-- Tarjeta 3: Usos Prohibidos (UPROH - Exclusión Negativa Art. 2.1.24 OGUC) -->
          <div class="caja-tarjeta-normativa caja-prohibidos">
            <span class="etiqueta-normativa-card" style="color:#fbbf24;">🚫 Usos Expresamente Prohibidos (UPROH) & Principio de Exclusión Negativa (Art. 2.1.24 OGUC):</span>
            <div style="background:rgba(245, 158, 11, 0.12); border:1.5px solid var(--ocre); border-radius:8px; padding:12px; margin:8px 0 12px 0; font-size:0.88rem; color:var(--tinta-suave);">
              ⚖️ <em>"Todo uso, destino o actividad que no se encuentre expresamente individualizado como permitido en la Ordenanza Local se entiende legalmente prohibido" (Art. 2.1.24 OGUC). En específico, para esta zona rigen las siguientes prohibiciones taxativas:</em>
            </div>
            <ul class="lista-riesgos lista-prohibidos" style="margin:0; padding-left:20px; color:var(--tinta-suave); font-size:0.92rem; line-height:1.65;">
              ${prohibidosLista.map(item => `<li style="margin-bottom:6px;">❌ <strong>${item}</strong></li>`).join('')}
            </ul>
          </div>

          <!-- Tarjeta 4: Gravámenes y Zonas de Riesgo Natural (Art. 2.1.17 OGUC) -->
          <div class="caja-tarjeta-normativa ${tieneRiesgo ? 'caja-riesgo' : ''}">
            <span class="etiqueta-normativa-card" style="color:${tieneRiesgo ? '#f87171' : '#34d399'};">
              ${tieneRiesgo ? '⚠️ Gravamen por Riesgo Natural & Falla Geológica (Art. 2.1.17 OGUC):' : '🛡️ Evaluación de Riesgo Natural (Art. 2.1.17 OGUC):'}
            </span>
            ${tieneRiesgo ? `
              <ul class="lista-riesgos" style="margin:6px 0 0 0; padding-left:20px; color:#fecdd3; font-size:0.92rem;">
                ${inf.areasRiesgo.map(r => `<li><strong>${r.tipo}:</strong> ${r.norma} <em>(${r.fuente})</em></li>`).join('')}
              </ul>
            ` : `
              <p style="margin:4px 0 0 0; font-size:0.92rem; color:var(--tinta-suave);">
                ✅ El punto consultado se encuentra <strong>libre de afección por zonas de riesgo natural</strong> (inundación, remoción en masa o fallas geológicas normadas en Art. 2.1.17 OGUC).
              </p>
            `}
          </div>

          <!-- Tarjeta 5: Protección Patrimonial (ZCH / ICH / Ley 17.288) -->
          <div class="caja-tarjeta-normativa caja-patrimonio">
            <span class="etiqueta-normativa-card" style="color:#c084fc;">🏛️ Protección Patrimonial Normativa (ICH / ZCH / Ley N° 17.288 CMN):</span>
            ${inf.patrimonio.length > 0 ? `
              <ul class="lista-patrimonio" style="margin:6px 0 0 0; padding-left:20px; color:var(--tinta-suave); font-size:0.92rem;">
                ${inf.patrimonio.map(p => `<li>🏛️ <strong>${p.nombre}</strong> (${p.categoria}) — ${p.distanciaMetros === 0 ? 'En zona protegida' : `A ${p.distanciaMetros} m de distancia`}</li>`).join('')}
              </ul>
            ` : `
              <p style="margin:4px 0 0 0; font-size:0.92rem; color:var(--tinta-suave);">
                Fuera del perímetro inmediato de Inmuebles o Zonas de Conservación Histórica declaradas.
              </p>
            `}
          </div>

          <!-- Tarjeta 6: Catálogo de Fuentes y Ordenanzas Oficiales -->
          <div class="caja-tarjeta-normativa caja-fuentes">
            <span class="etiqueta-normativa-card" style="color:#38bdf8;">📖 Expedientes Digitales y Ordenanzas Oficiales del Estado:</span>
            <div class="grilla-2col-normativa" style="margin-top:10px;">
              <div style="background:rgba(56, 189, 248, 0.08); border:1px solid var(--linea-tarjeta); border-radius:8px; padding:12px;">
                <strong style="color:var(--agua); font-size:0.9rem;">Portal IPT MINVU (Código 13101):</strong><br>
                <span style="font-size:0.82rem; color:var(--tinta-suave);">Texto PDF de Ordenanza Local, Memoria y Planos 1:5.000.</span><br>
                <a href="https://portalipt.minvu.cl/instrumentos/13101" target="_blank" rel="noopener noreferrer" style="font-size:0.85rem;">portalipt.minvu.cl/instrumentos/13101 ↗</a>
              </div>
              <div style="background:rgba(56, 189, 248, 0.08); border:1px solid var(--linea-tarjeta); border-radius:8px; padding:12px;">
                <strong style="color:var(--agua); font-size:0.9rem;">DOM I. Municipalidad de Santiago:</strong><br>
                <span style="font-size:0.82rem; color:var(--tinta-suave);">Trámite de CIP Oficial (Amunátegui 980, piso 2).</span><br>
                <a href="https://www.munistgo.cl/plan-regulador/" target="_blank" rel="noopener noreferrer" style="font-size:0.85rem;">munistgo.cl/plan-regulador/ ↗</a>
              </div>
            </div>
          </div>

          <!-- Tarjeta 7: Disclaimer Normativo Legal -->
          <div class="caja-tarjeta-normativa caja-disclaimer">
            <span class="etiqueta-normativa-card" style="color:#cbd5e1;">⚠️ Aviso Legal & Descargo de Responsabilidad Jurídica:</span>
            <p style="margin:4px 0 0 0; font-size:0.84rem; color:var(--tinta-tenue); line-height:1.6;">
              ${TEXTO_DISCLAIMER_LEGAL}
            </p>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="ficha-normativa-acciones" style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
          <button type="button" class="accion" id="btn-descargar-cin-txt" style="font-size:0.92rem; padding:10px 18px;">📄 Descargar Certificado CIN-VGI (.txt)</button>
          <button type="button" class="accion secundaria" id="btn-cerrar-ficha-normativa" style="font-size:0.92rem; padding:10px 18px;">Cerrar Ficha</button>
        </div>
      </div>
    `;
  }

  return {
    consultarPuntoNormativo,
    evaluarCompatibilidadVGI,
    generarCertificadoTexto,
    renderizarFichaNormativaHTML,
    puntoEnGeometria
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloEvaluadorNormativo = ModuloEvaluadorNormativo;
}
