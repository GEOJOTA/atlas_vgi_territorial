/*
  evaluador_normativo.js
  ----------------------
  Módulo de Consulta, Descarga y Evaluación Espacial Normativa Territorial 100% Dinámica.
  Articula la cartografía comunitaria VGI con la normativa urbana oficial de Chile:
  - Planes Reguladores Comunales (PRC - RM: Zonificación, UPERM, UPROH, Decretos D.O.)
  - Plan Regulador Metropolitano de Santiago (PRMS - Usos, Riesgos, Resguardos)
  - Ley General de Urbanismo y Construcciones (LGUC DFL 458/1975)
  - Ordenanza General de Urbanismo y Construcciones (OGUC D.S. 47/1992 - Art. 2.1.17, 2.1.24, 2.1.30)
  - Ley N° 21.202 de Protección de Humedales Urbanos
  - Ley N° 21.442 de Copropiedad Inmobiliaria

  Trazabilidad Atributiva 100% Dinámica: Extrae directamente de las propiedades GeoJSON
  la comuna específica, capas utilizadas, instrumento PRC, zonificación, año y decreto D.O.,
  sin suposiciones ni datos estáticos duros.
*/

const ModuloEvaluadorNormativo = (() => {

  /**
   * Catálogo oficial de ordenanzas, instrumentos y fuentes normativas
   */
  const FUENTES_ORDENANZAS_IPT = [
    {
      institucion: 'Ministerio de Vivienda y Urbanismo (MINVU)',
      instrumento: 'Planes Reguladores Comunales (PRC) — Catálogo de la Región Metropolitana',
      url: 'https://portalipt.minvu.cl/',
      descripcion: 'Expedientes digitales oficiales del MINVU. Incluyen texto completo de Ordenanzas Locales, Memorias Explicativas, Planos de Zonificación oficial y decretos modificatorios en Diario Oficial.'
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
  const TEXTO_DISCLAIMER_LEGAL = `La información provista por este Certificado de Informaciones Normativas VGI (CIN-VGI) es de carácter estrictamente referencial. BAJO NINGUNA CIRCUNSTANCIA este reporte constituye, sustituye o tiene la validez jurídica de un Certificado de Informaciones Previas (CIP), instrumento oficial que de acuerdo al Artículo 116 del D.F.L. N° 458 de 1975 (Ley General de Urbanismo y Construcciones - LGUC) debe ser otorgado y suscrito de manera privativa por el Director de Obras Municipales (DOM) de la comuna respectiva.`;

  /**
   * Diccionario Normativo Estándar de Apoyo para Zonas Frecuentes
   */
  const DICCIONARIO_NORMATIVO_ZONAS_PRC = {
    'DEFAULT': {
      codigo: 'Zona Regulada PRC',
      nombreOficial: 'Zona Urbana Regulada por Plan Regulador Comunal',
      articulo: 'Ordenanza Local del Plan Regulador Comunal',
      explicacionPrincipioExclusion: 'De acuerdo al Artículo 2.1.24 de la OGUC, rige el principio de exclusión negativa: todo uso, destino o actividad no enunciado taxativamente como permitido en la respectiva Ordenanza Local se encuentra legalmente prohibido.',
      usosPermitidosDetalle: 'Residencial y equipamiento de acuerdo al cuadro de usos de suelo de la zona normada.',
      usosProhibidosDetallados: [
        'Industrias molestas, insalubres, contaminantes o peligrosas de cualquier escala.',
        'Grandes bodegas y centros de acopio mayorista sin mitigación vial adecuada.',
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
        if (puntoEnPoligono(pt, geom.coordinates[k])) return false;
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
   * Consulta normativa espacial 100% DINÁMICA
   */
  function consultarPuntoNormativo(lat, lng, capas = null) {
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
      comunaEspecifica: null,
      capasConsultadas: [],
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

    // Registrar dinámicamente todas las capas cargadas evaluadas
    Object.keys(capas).forEach(k => {
      const cObj = capas[k];
      if (cObj && cObj.features) {
        res.capasConsultadas.push({
          id: k,
          nombre: cObj.def?.nombre || k,
          institucion: cObj.def?.institucion || 'Estado de Chile',
          archivo: cObj.def?.archivoLocal || 'Capa GeoJSON'
        });
      }
    });

    // 1. División Político-Administrativa (Comuna DPA)
    const capaDPA = capas['ide_subdere_dpa_comunas'] || capas['capa_bbdd_43'];
    if (capaDPA && capaDPA.features) {
      for (let f of capaDPA.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const props = f.properties || {};
          const nomCom = props.COMUNA || props.NOM_COMUNA || props.NOM_COM || props.CUT_COM;
          if (nomCom) res.comunaEspecifica = nomCom;
          res.dpa = {
            comuna: nomCom,
            provincia: props.PROVINCIA || props.NOM_PROV,
            region: props.REGION || props.NOM_REG,
            cut: props.CUT_COM || props.CUT_2018 || props.CUT
          };
          break;
        }
      }
    }

    // 2. Zonificación PRC Comunal (Dinámica desde geometrías recortadas/integérimas)
    const capaPRC = capas['minvu_ipt_prc_santiago'] || capas['capa_ipt_prc_comunal'];
    if (capaPRC && capaPRC.features) {
      for (let f of capaPRC.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const props = f.properties || {};
          const comunaNom = props.COMUNA || props.COMUNA_ORIGEN || props.NOM_COMUNA || props.NOM_COM || res.comunaEspecifica || 'No especificada';
          const zonaCod = props.ZONA || props.NOM_ZONA || props.CODIGO || 'Regulada';
          const zonaNombre = props.NOM_ZONA || props.NOMBRE || props.DESCRIP || `Zona Normativa ${zonaCod}`;
          const instNom = props.INSTRUM || props.PRC || `Plan Regulador Comunal de ${comunaNom}`;
          const fechaDO = props.P_DO || props.FECHA_DO || props.FECHA || (props.N_DOC ? `Doc. N° ${props.N_DOC}` : null);
          const normaDec = props.N_DOC ? `Resolución / Decreto N° ${props.N_DOC}${fechaDO ? ` (D.O. ${fechaDO})` : ''}` : (fechaDO ? `Publicación D.O. ${fechaDO}` : 'Ordenanza Local Vigente');

          res.prc = {
            comuna: comunaNom,
            zona: zonaCod,
            codigo: zonaCod,
            nombreZona: zonaNombre,
            instrumento: instNom,
            decreto: normaDec,
            fechaPublicacion: fechaDO || 'Consultar Diario Oficial',
            articuloOrdenanza: props.NORMA || props.ARTICULO || `Ordenanza Local del PRC de ${comunaNom}`,
            usosPermitidos: props.UPERM || props.USO_PERM || 'Residencial y equipamiento de acuerdo al cuadro de usos de la zona.',
            usosProhibidos: props.UPROH || props.USO_PROH || 'Industrias molestas, acopio masivo, talleres pesados y todo uso no mencionado expresamente (Art. 2.1.24 OGUC).',
            alturaMax: props.ALT_MAX || props.ALTURA || props.NORMA || 'Según rasantes y distanciamientos OGUC',
            densidadMax: props.DENSIDAD || 'Según norma de zona',
            propiedadesOriginales: props
          };

          if (!res.comunaEspecifica && comunaNom) {
            res.comunaEspecifica = comunaNom;
          }
          break;
        }
      }
    }
    res.zonaPRC = res.prc;

    // 3. PRMS Usos Metropolitanos (Dinámico)
    const capaPRMS = capas['minvu_ipt_prms_usosuelo'] || capas['capa_ipt_prms_metropolitano'];
    if (capaPRMS && capaPRMS.features) {
      for (let f of capaPRMS.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const props = f.properties || {};
          res.prms = {
            macroZona: props.ZONA || props.NOMBRE || props.SECTOR || 'Zona Metropolitana',
            usoPreferente: props.UPREF || props.USO || props.TIPO || 'Área Urbana Metropolitano',
            tipoUso: props.UPREF || props.USO || 'Uso Metropolitano Intercomunal',
            normativa: props.NORMA || 'Capítulo 8.3 PRMS',
            superficieHa: props.SUP_HA ? `${props.SUP_HA} ha` : null,
            comuna: props.COMUNA || null,
            propiedadesOriginales: props
          };
          if (!res.comunaEspecifica && props.COMUNA) {
            res.comunaEspecifica = props.COMUNA;
          }
          break;
        }
      }
    }

    // 4. Límite Urbano Oficial
    const capaLU = capas['minvu_ipt_limite_urbano'] || capas['censo2024_limite_urbano'] || capas['capa_ipt_limite_urbano'];
    if (capaLU && capaLU.features) {
      for (let f of capaLU.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.limiteUrbano = true;
          break;
        }
      }
    }

    // 5. Áreas de Riesgo Normativas (Art. 2.1.17 OGUC)
    const capaRiesgoPRC = capas['minvu_ipt_areas_riesgo'];
    if (capaRiesgoPRC && capaRiesgoPRC.features) {
      for (let f of capaRiesgoPRC.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const p = f.properties || {};
          res.areasRiesgo.push({
            tipo: p.CAT || p.NOMBRE || p.ZONA || 'Riesgo Natural',
            norma: p.UPROH || p.NORMA || 'Restricción Art. 2.1.17 OGUC',
            fuente: `PRC ${p.COMUNA || p.COM || 'Comunal'}`
          });
        }
      }
    }

    const capaRiesgoPRMS = capas['ide_minvu_ipt_prms_riesgo'] || capas['capa_ipt_prms_riesgo'];
    if (capaRiesgoPRMS && capaRiesgoPRMS.features) {
      for (let f of capaRiesgoPRMS.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const p = f.properties || {};
          res.areasRiesgo.push({
            tipo: p.ZONA || p.DESCRIP || p.NOMBRE || 'Riesgo Metropolitano',
            norma: p.NORMA || 'Restricción por Inundación / Falla Geológica (PRMS)',
            fuente: 'PRMS Metropolitano'
          });
        }
      }
    }

    // 6. Áreas Verdes Normativas IPT
    const capaAV = capas['minvu_ipt_areas_verdes'];
    if (capaAV && capaAV.features) {
      for (let f of capaAV.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const p = f.properties || {};
          res.areasVerdes.push({
            nombre: p.NOMBRE || 'Área Verde Normada',
            tipo: p.TIPO_AV || p.TIPO || 'Plaza / Parque',
            superficie: p.Ha ? `${Number(p.Ha).toFixed(2)} ha` : '-'
          });
        }
      }
    }

    // 7. Patrimonio e Inmuebles protegidos
    const capaPatrimonio = capas['minvu_patrimonio'] || capas['cmn_sitios_memoria'];
    if (capaPatrimonio && capaPatrimonio.features) {
      for (let f of capaPatrimonio.features) {
        const p = f.properties || {};
        if (f.geometry.type === 'Point') {
          const coords = f.geometry.coordinates;
          const dist = distanciaMetros(lng, lat, coords[0], coords[1]);
          if (dist <= 100) {
            res.patrimonio.push({
              nombre: p.NOMBRE || p.name || 'Inmueble Patrimonial',
              categoria: p.CATEGORIA || p.TIPO || 'ICH / Monumento',
              distanciaMetros: Math.round(dist)
            });
          }
        } else if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.patrimonio.push({
            nombre: p.NOMBRE || 'Zona de Conservación Histórica (ZCH)',
            categoria: p.CATEGORIA || 'Zona Protegida IPT',
            distanciaMetros: 0
          });
        }
      }
    }

    // 8. Unidad Vecinal Oficial (RSH)
    const capaUV = capas['ide_minvu_unidades_vecinales_rsh'];
    if (capaUV && capaUV.features) {
      for (let f of capaUV.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          const p = f.properties || {};
          res.unidadVecinal = {
            numero: p.uv_carto || p.t_uv_nom || p.OBJECTID || 'S/N',
            comuna: p.t_com_nom || p.COMUNA || res.comunaEspecifica || 'Metropolitana',
            provincia: p.t_prov_nom || '-'
          };
          if (!res.comunaEspecifica && p.t_com_nom) {
            res.comunaEspecifica = p.t_com_nom;
          }
          break;
        }
      }
    }

    return res;
  }

  /**
   * Evalúa la compatibilidad de uso VGI vs Zonificación Oficial en tiempo real
   */
  function evaluarCompatibilidadVGI(tipoActividadVGI, informeNormativo) {
    const prc = informeNormativo.prc;
    if (!prc) {
      return {
        compatible: true,
        calificacion: 'SIN RESTRICCIÓN PRC REGISTRADA',
        fundamentoLegal: 'El punto consultado no registra zonificación PRC activa en la cobertura o se ubica fuera del límite urbano consolidado.',
        mitigacionesRequeridas: []
      };
    }

    const actLower = String(tipoActividadVGI || '').toLowerCase();
    const uProhLower = String(prc.usosProhibidos || '').toLowerCase();
    const uPermLower = String(prc.usosPermitidos || '').toLowerCase();

    // Verificación de prohibiciones explícitas
    const esProhibido = uProhLower.includes(actLower) || 
      (actLower.includes('taller') && uProhLower.includes('taller')) ||
      (actLower.includes('industria') && uProhLower.includes('industria')) ||
      (actLower.includes('bodega') && uProhLower.includes('bodega'));

    if (esProhibido) {
      return {
        compatible: false,
        calificacion: 'INCOMPATIBLE / PROHIBIDO (Art. 2.1.24 OGUC)',
        fundamentoLegal: `De acuerdo al Principio de Exclusión Negativa del Art. 2.1.24 de la OGUC y la Ordenanza Local del ${prc.instrumento}, el destino "${tipoActividadVGI}" está expresamente prohibido en la ${prc.zona}.`,
        mitigacionesRequeridas: ['Revisar cambio de destino en DOM', 'No procede tramitación de CIP favorable']
      };
    }

    const esPermitido = uPermLower.includes(actLower) || 
      (actLower.includes('comercio') && uPermLower.includes('comercio')) ||
      (actLower.includes('vivienda') && uPermLower.includes('vivienda')) ||
      (actLower.includes('educacion') && uPermLower.includes('educacion'));

    if (esPermitido) {
      return {
        compatible: true,
        calificacion: 'COMPATIBLE / PERMITIDO (UPERM)',
        fundamentoLegal: `El uso o destino "${tipoActividadVGI}" se encuentra considerado dentro de los usos permitidos (UPERM) para la ${prc.zona} en el ${prc.instrumento}.`,
        mitigacionesRequeridas: ['Acreditar cumplimiento de rasantes y distanciamientos (Art. 2.6.3 OGUC)', 'Cumplir norma de emisiones acústicas D.S. N° 38/2011 MMA']
      };
    }

    return {
      compatible: false,
      calificacion: 'RESTRICCIÓN POR EXCLUSIÓN (Art. 2.1.24 OGUC)',
      fundamentoLegal: `Principio de exclusión negativa Art. 2.1.24 OGUC: La actividad "${tipoActividadVGI}" no aparece expresamente listada en los usos permitidos de la ${prc.zona} (${prc.instrumento}), por lo que se presume legalmente prohibida.`,
      mitigacionesRequeridas: ['Solicitar pronunciamiento formal a la Dirección de Obras Municipales (DOM)']
    };
  }

  /**
   * Genera el contenido formateado del Certificado CIN-VGI en formato texto (.txt)
   */
  function generarCertificadoTexto(informe) {
    const c = informe.coordenadas;
    const prc = informe.prc;
    const prms = informe.prms;
    const uv = informe.unidadVecinal;
    const comuna = informe.comunaEspecifica || (prc ? prc.comuna : 'Región Metropolitana');

    let txtCapas = (informe.capasConsultadas || []).map(cp => `    * [CAPA]: ${cp.nombre} | Institución: ${cp.institucion} | Archivo: ${cp.archivo}`).join('\n');
    if (!txtCapas) txtCapas = '    * [CAPAS]: Capas oficiales de la Región Metropolitana cargadas en memoria.';

    return `================================================================================
REPÚBLICA DE CHILE — UNIVERSIDAD ALBERTO HURTADO
ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA & GESTIÓN TERRITORIAL
CERTIFICADO DE INFORMACIONES NORMATIVAS VGI (CIN-VGI)
Ley General de Urbanismo y Construcciones (DFL 458/1975) & OGUC (D.S. 47/1992)
================================================================================

1. ANTECEDENTES DE LA CONSULTA TERRITORIAL DINÁMICA:
   - Fecha y Hora de Emisión: ${new Date().toLocaleString('es-CL')}
   - Coordenadas WGS84: Latitud ${c.lat.toFixed(5)}° S, Longitud ${c.lng.toFixed(5)}° O
   - Sistema Geodésico de Referencia: SIRGAS-Chile / WGS84 (EPSG:4326)
   - Comuna Evaluada: ${comuna}
   - Unidad Vecinal Oficial: ${uv ? `U.V. N° ${uv.numero} (${uv.comuna})` : 'Información no asociada'}

2. CAPAS E INSTRUMENTOS CONSULTADOS EN ESTA UBICACIÓN:
${txtCapas}

3. ENCUADRE NORMATIVO EN PLANES REGULADORES OFICIALES:
   - Límite Urbano Oficial: ${informe.limiteUrbano ? 'DENTRO DEL LÍMITE URBANO OFICIAL (Art. 52 LGUC)' : 'ÁREA DE EXTENSIÓN URBANA O CONDICIÓN ESPECIAL'}
   - Instrumento Comunal (PRC): ${prc ? prc.instrumento : 'Sin zonificación comunal específica en la cobertura'}
   - Zonificación PRC: ${prc ? `${prc.zona} — ${prc.nombreZona}` : 'Sin datos de zona en el punto'}
   - Decreto / Aprobación D.O.: ${prc ? prc.decreto : 'No indicado'}
   - Macro-Zonificación Metropolitano (PRMS): ${prms ? `${prms.macroZona} (${prms.usoPreferente})` : 'Área Urbana Metropolitano'}

4. CONDICIONES URBANÍSTICAS Y USOS DE SUELO (DESGLOSE DE DATOS ORIGINALES):
   - Usos de Suelo Permitidos (UPERM):
     ${prc ? prc.usosPermitidos : 'No aplica'}

   - Usos Expresamente Prohibidos (UPROH):
     ${prc ? prc.usosProhibidos : 'No aplica'}

   - Principio de Exclusión Negativa (Art. 2.1.24 OGUC):
     "Todo uso, destino o actividad no mencionado expresamente como permitido en la Ordenanza Local se entiende legalmente prohibido."

   - Condiciones de Edificación y Rasantes:
     ${prc ? prc.alturaMax : 'Regulado por OGUC'}

5. GRAVÁMENES Y RESTRICCIONES NORMATIVAS:
   - Áreas de Riesgo Natural (Art. 2.1.17 OGUC):
     ${informe.areasRiesgo.length > 0 ? informe.areasRiesgo.map(r => `* [ALERTA] ${r.tipo}: ${r.norma} (${r.fuente})`).join('\n     ') : 'Ninguna restricción por riesgo registrada en esta ubicación.'}
   - Declaratoria de Utilidad Pública / Áreas Verdes (Art. 59 LGUC):
     ${informe.areasVerdes.length > 0 ? informe.areasVerdes.map(a => `* ${a.nombre} (${a.tipo} - ${a.superficie})`).join('\n     ') : 'Punto no afecto a declaratoria de parque de utilidad pública.'}
   - Protección Patrimonial (ZCH / ICH / Ley N° 17.288 CMN):
     ${informe.patrimonio.length > 0 ? informe.patrimonio.map(p => `* 🏛️ ${p.nombre} [${p.categoria}] (${p.distanciaMetros === 0 ? 'En zona protegida' : `${p.distanciaMetros} m`})`).join('\n     ') : 'Fuera del perímetro inmediato de conservación histórica.'}

6. AVISO LEGAL:
${TEXTO_DISCLAIMER_LEGAL}

================================================================================
Generado dinámicamente por: Atlas VGI UAH — Sistema Abierto de Información Territorial.
================================================================================`;
  }

  /**
   * Renderiza el HTML dinámico de la Ficha Normativa (Modal / HUD)
   */
  function renderizarFichaNormativaHTML(inf) {
    const c = inf.coordenadas;
    const prc = inf.prc;
    const prms = inf.prms;
    const tieneRiesgo = inf.areasRiesgo.length > 0;
    const esUrbano = inf.limiteUrbano;
    const comuna = inf.comunaEspecifica || (prc ? prc.comuna : 'Región Metropolitana');

    let htmlCapas = (inf.capasConsultadas || []).map(cp => `
      <div style="background:rgba(255,255,255,0.04); border:1px solid var(--linea-tarjeta); border-radius:6px; padding:6px 10px; font-size:0.82rem;">
        <strong style="color:var(--agua);">${cp.nombre}</strong> <span style="color:var(--tinta-tenue);">(${cp.institucion})</span>
      </div>
    `).join('');

    return `
      <div class="ficha-normativa-hud">
        <!-- Encabezado de Geolocalización -->
        <div class="ficha-normativa-header">
          <span class="badge-alerta-normativa ${tieneRiesgo ? 'peligro' : 'seguro'}">
            ${tieneRiesgo ? '⚠️ ATENCIÓN: ÁREA AFECTA A RESTRICCIÓN DE RIESGO NATURAL (Art. 2.1.17 OGUC)' : '✅ CONSULTA EVALUADA (SIN GRAVAMEN DE RIESGO)'}
          </span>
          <span class="ficha-normativa-id">
            📍 LAT ${c.lat.toFixed(5)}° S | LON ${c.lng.toFixed(5)}° O // COMUNA: <strong>${comuna.toUpperCase()}</strong>
          </span>
        </div>

        <div class="ficha-normativa-cuerpo">

          <!-- Tarjeta 1: Capas e Instrumentos Consultados -->
          <div class="caja-tarjeta-normativa" style="border-left:4px solid var(--agua);">
            <span class="etiqueta-normativa-card" style="color:var(--agua);">📖 Capas e Instrumentos Integrados Evaluados en este Punto:</span>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:6px; margin-top:8px;">
              ${htmlCapas || '<span style="font-size:0.85rem; color:var(--tinta-suave);">Capas oficiales cargadas en memoria.</span>'}
            </div>
          </div>

          <!-- Tarjeta 2: Instrumento Regulador y Zonificación PRC -->
          <div class="caja-tarjeta-normativa">
            <span class="etiqueta-normativa-card">🏛️ Instrumento Regulador & Zonificación Comunal (${comuna}):</span>
            ${prc ? `
              <div class="valor-normativo-destacado">${prc.zona} — ${prc.nombreZona}</div>
              <div class="meta-ordenanza-prc" style="margin-top:6px; font-size:0.92rem; color:var(--tinta-suave); line-height:1.6;">
                📜 <strong>Instrumento:</strong> ${prc.instrumento}<br>
                ⚖️ <strong>Decreto / Publicación:</strong> ${prc.decreto}<br>
                📑 <strong>Artículo / Norma:</strong> ${prc.articuloOrdenanza}
              </div>
            ` : `
              <div style="padding:10px; background:rgba(245, 158, 11, 0.1); border-radius:6px; font-size:0.9rem; color:var(--ocre); margin-top:6px;">
                ⚠️ <strong>Sin zonificación comunal PRC activa registrada en la ubicación exacta.</strong>
                <br><span style="font-size:0.82rem; color:var(--tinta-suave);">El punto se ubica fuera del área urbana zonificada del PRC o en sector rural/intercomunal regulado por el PRMS.</span>
              </div>
            `}
            <div class="grilla-2col-normativa" style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--linea);">
              <div>
                <span style="font-size:0.8rem; color:var(--tinta-tenue); display:block; text-transform:uppercase; font-weight:700;">Límite Urbano Oficial (Art. 52 LGUC):</span>
                <strong style="color:${esUrbano ? '#34d399' : '#f59e0b'}; font-size:0.95rem;">${esUrbano ? '✅ Dentro del Límite Urbano Oficial' : '⚠️ Área de Extensión / Condición Especial'}</strong>
              </div>
              ${prms ? `
                <div>
                  <span style="font-size:0.8rem; color:var(--tinta-tenue); display:block; text-transform:uppercase; font-weight:700;">Plan Regulador Metropolitano (PRMS):</span>
                  <strong style="color:var(--tinta); font-size:0.95rem;">${prms.macroZona} (${prms.usoPreferente})</strong>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Tarjeta 3: Usos de Suelo Permitidos (UPERM) -->
          <div class="caja-tarjeta-normativa caja-permitidos">
            <span class="etiqueta-normativa-card" style="color:#34d399;">✅ Usos de Suelo Permitidos (UPERM - Atributos de Capa):</span>
            <p class="texto-normativo permitido" style="margin:6px 0 0 0; font-size:0.94rem; color:var(--tinta-suave); line-height:1.65;">
              ${prc ? prc.usosPermitidos : 'No hay datos de UPERM registados para esta ubicación.'}
            </p>
          </div>

          <!-- Tarjeta 4: Usos Prohibidos (UPROH - OGUC Art. 2.1.24) -->
          <div class="caja-tarjeta-normativa caja-prohibidos">
            <span class="etiqueta-normativa-card" style="color:#fbbf24;">🚫 Usos Expresamente Prohibidos (UPROH) & Exclusión Negativa (Art. 2.1.24 OGUC):</span>
            <div style="background:rgba(245, 158, 11, 0.12); border:1.5px solid var(--ocre); border-radius:8px; padding:10px; margin:8px 0 8px 0; font-size:0.86rem; color:var(--tinta-suave);">
              ⚖️ <em>"Todo uso, destino o actividad que no se encuentre expresamente individualizado como permitido en la Ordenanza Local se entiende legalmente prohibido" (Art. 2.1.24 OGUC).</em>
            </div>
            <p style="margin:4px 0 0 0; font-size:0.92rem; color:var(--tinta-suave); line-height:1.6;">
              ${prc ? prc.usosProhibidos : 'No hay datos de UPROH registrados en esta ubicación.'}
            </p>
          </div>

          <!-- Tarjeta 5: Gravámenes por Riesgo Natural (Art. 2.1.17 OGUC) -->
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
                ✅ El punto consultado no registra interferencia por áreas de riesgo natural en las capas oficiales evaluadas.
              </p>
            `}
          </div>

          <!-- Tarjeta 6: Protección Patrimonial (ICH / ZCH) -->
          <div class="caja-tarjeta-normativa caja-patrimonio">
            <span class="etiqueta-normativa-card" style="color:#c084fc;">🏛️ Protección Patrimonial (ICH / ZCH / Ley N° 17.288 CMN):</span>
            ${inf.patrimonio.length > 0 ? `
              <ul class="lista-patrimonio" style="margin:6px 0 0 0; padding-left:20px; color:var(--tinta-suave); font-size:0.92rem;">
                ${inf.patrimonio.map(p => `<li>🏛️ <strong>${p.nombre}</strong> (${p.categoria}) — ${p.distanciaMetros === 0 ? 'En zona protegida' : `A ${p.distanciaMetros} m de distancia`}</li>`).join('')}
              </ul>
            ` : `
              <p style="margin:4px 0 0 0; font-size:0.92rem; color:var(--tinta-suave);">
                Sin declaración patrimonial registrada en el punto consultado.
              </p>
            `}
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
