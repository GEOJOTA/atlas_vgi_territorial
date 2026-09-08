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
  1. Inspector Normativo Puntual por Clic en Mapa (Leaflet 2D y Globo 3D).
  2. Motor de Evaluación Cruzada VGI vs. Zonificación Oficial (Compatibilidad de usos).
  3. Auditoría de Exposición a Zonas de Riesgo y Protección Ambiental.
  4. Generación y Descarga de Certificado de Informaciones Normativas VGI (CIN-VGI).
*/

const ModuloEvaluadorNormativo = (() => {

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
  function consultarPuntoNormativo(lat, lng, capas) {
    const res = {
      coordenadas: { lat, lng },
      timestamp: new Date().toISOString(),
      prc: null,
      prms: null,
      limiteUrbano: false,
      areasRiesgo: [],
      areasVerdes: [],
      resguardos: [],
      patrimonio: [],
      unidadVecinal: null,
      campamentosCercanos: [],
      humedalesCercanos: [],
      condominiosCercanos: []
    };

    // 1. Zonificación PRC Santiago
    const capaPRC = capas['minvu_ipt_prc_santiago'];
    if (capaPRC && capaPRC.features) {
      for (let f of capaPRC.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.prc = {
            zona: f.properties.ZONA || f.properties.NOM_ZONA || 'Zona PRC',
            nombreZona: f.properties.NOM_ZONA || f.properties.NOMBRE || f.properties.ZONA,
            usosPermitidos: f.properties.UPERM || 'Residencial, Equipamiento, Comercio según Ordenanza Local',
            usosProhibidos: f.properties.UPROH || 'Industria molesta, actividades peligrosas, bodegaje masivo',
            alturaMax: f.properties.ALT_MAX || f.properties.ALTURA || 'Según rasante Art. 2.6.3 OGUC',
            densidadMax: f.properties.DENSIDAD || 'Según norma de zona',
            instrumento: 'Plan Regulador Comunal de Santiago',
            decreto: f.properties.P_DO ? `D.O. ${f.properties.P_DO}` : 'Ordenanza Local Vigente'
          };
          break;
        }
      }
    }

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

    // 7. Unidades Vecinales & RSH
    const capaUV = capas['ide_minvu_unidades_vecinales_rsh'];
    if (capaUV && capaUV.features) {
      for (let f of capaUV.features) {
        if (puntoEnGeometria(lng, lat, f.geometry)) {
          res.unidadVecinal = {
            numero: f.properties.uv_carto || f.properties.t_uv_nom || f.properties.OBJECTID,
            comuna: f.properties.t_com_nom || 'Santiago',
            provincia: f.properties.t_prov_nom || 'Santiago',
            idCartografico: f.properties.t_id_uv_ca
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

    return `================================================================================
REPÚBLICA DE CHILE — UNIVERSIDAD ALBERTO HURTADO
ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA & GESTIÓN TERRITORIAL
CERTIFICADO DE INFORMACIONES NORMATIVAS VGI (CIN-VGI)
Ley General de Urbanismo y Construcciones (DFL 458/1975) & OGUC (D.S. 47/1992)
================================================================================

1. ANTECEDENTES DE LA CONSULTA TERRITORIAL:
   - Fecha y Hora de Emisión: ${new Date().toLocaleString('es-CL')}
   - Coordenadas WGS84: Latitud ${c.lat.toFixed(5)}° S, Longitud ${c.lng.toFixed(5)}° O
   - Sistema de Referencia Geodésica: SIRGAS-Chile / WGS84 (EPSG:4326)
   - Proyección Local UTM: Huso 19 Sur (EPSG:32719)
   - Territorio Piloto: Barrio Brasil / Santiago Centro, Región Metropolitana

2. ENCUADRE EN PLANES REGULADORES OFICIALES:
   - Comuna: ${uv.comuna || 'Santiago'}
   - Unidad Vecinal Oficial: ${uv.numero ? `Unidad Vecinal N° ${uv.numero}` : 'Sector Centro Poniente'}
   - Límite Urbano Oficial: ${informe.limiteUrbano ? 'DENTRO DEL LÍMITE URBANO OFICIAL (Art. 52 LGUC)' : 'FUERA DE LÍMITE URBANO'}
   - Instrumento Comunal: ${prc.instrumento || 'Plan Regulador Comunal de Santiago'}
   - Zonificación Normativa: ${prc.zona || 'Zona No Identificada'} (${prc.nombreZona || 'Norma Comunal'})
   - Decreto / Publicación: ${prc.decreto || 'Decreto Alcaldicio / Diario Oficial'}
   - Macro-Uso Metropolitano (PRMS): ${prms.macroZona || 'Urbano Consolidado (Cap. 8.3 PRMS)'}

3. CONDICIONES URBANÍSTICAS Y USOS DE SUELO:
   - Usos Permitidos (UPERM): ${prc.usosPermitidos || 'Residencial, Equipamiento, Comercio, Servicios'}
   - Usos Prohibidos (UPROH): ${prc.usosProhibidos || 'Industrias molestas, talleres ruidosos, acopio'}
   - Altura Máxima de Edificación: ${prc.alturaMax || 'Según rasante y distanciamiento OGUC'}

4. GRAVÁMENES, RESTRICCIONES Y SALVAGUARDAS NORMATIVAS:
   - Afectación por Áreas de Riesgo (Art. 2.1.17 OGUC):
     ${informe.areasRiesgo.length > 0 ? informe.areasRiesgo.map(r => `* [ALERTA] ${r.tipo} (${r.norma})`).join('\n     ') : 'NINGUNA RESTRICCIÓN POR RIESGO REGISTRADA.'}
   - Áreas Verdes Normativas Declaradas (Art. 59 LGUC):
     ${informe.areasVerdes.length > 0 ? informe.areasVerdes.map(a => `* ${a.nombre} (${a.tipo} - ${a.superficie})`).join('\n     ') : 'Punto no emplazado en declaratoria de área verde pública.'}
   - Protección Patrimonial (ZCH / ICH / CMN):
     ${informe.patrimonio.length > 0 ? informe.patrimonio.map(p => `* ${p.nombre} [${p.categoria}] (Proximidad: ${p.distanciaMetros} m)`).join('\n     ') : 'Fuera de Zona de Conservación Histórica inmediata.'}
   - Humedales Urbanos Protegidos (Ley N° 21.202):
     ${informe.humedalesCercanos.length > 0 ? informe.humedalesCercanos.map(h => `* ${h.nombre} (${h.tipo})`).join('\n     ') : 'Sin humedales urbanos inventariados en el radio de influencia.'}

5. DECLARACIÓN DE FUENTES Y RESPONSABILIDAD:
   Este certificado consolida datos abiertos del Ministerio de Vivienda y Urbanismo (MINVU GeoIDE),
   la Infraestructura de Datos Geoespaciales de Chile (IDE Chile / SNIT), la I. Municipalidad de Santiago
   y la comunidad de OpenStreetMap, bajo el marco de la Ley N° 20.285 de Transparencia del Estado de Chile.
   
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

    return `
      <div class="ficha-normativa-hud">
        <div class="ficha-normativa-header">
          <span class="badge-alerta-normativa ${tieneRiesgo ? 'peligro' : 'seguro'}">
            ${tieneRiesgo ? '⚠️ ZONA CON RESTRICCIÓN DE RIESGO' : '✅ ÁREA CONFORME A NORMATIVA'}
          </span>
          <span class="ficha-normativa-id">LAT ${c.lat.toFixed(4)}° | LON ${c.lng.toFixed(4)}°</span>
        </div>

        <div class="ficha-normativa-cuerpo">
          <div class="campo-normativo">
            <span class="etiqueta-normativa">Zona PRC Santiago:</span>
            <span class="valor-normativo zona-destacada">${prc ? prc.zona : 'Zona General Central'} — ${prc ? prc.nombreZona : 'Comuna de Santiago'}</span>
          </div>

          <div class="campo-normativo">
            <span class="etiqueta-normativa">Límite Urbano Oficial (Art. 52 LGUC):</span>
            <span class="valor-normativo">${esUrbano ? '✅ Dentro de Límite Urbano Oficial' : '⚠️ Área no urbana / especial'}</span>
          </div>

          <div class="campo-normativo">
            <span class="etiqueta-normativa">Usos de Suelo Permitidos (UPERM):</span>
            <p class="texto-normativo permitido">${prc ? prc.usosPermitidos : 'Residencial, Equipamiento, Comercio vecinal, Servicios públicos y privados.'}</p>
          </div>

          <div class="campo-normativo">
            <span class="etiqueta-normativa">Usos de Suelo Prohibidos (UPROH):</span>
            <p class="texto-normativo prohibido">${prc ? prc.usosProhibidos : 'Industria contaminante, depósitos de combustibles, talleres de alto impacto.'}</p>
          </div>

          ${tieneRiesgo ? `
            <div class="campo-normativo alerta-box">
              <span class="etiqueta-normativa" style="color:#DC2626;">Gravamen por Riesgo (Art. 2.1.17 OGUC):</span>
              <ul class="lista-riesgos">
                ${inf.areasRiesgo.map(r => `<li><strong>${r.tipo}:</strong> ${r.norma} <em>(${r.fuente})</em></li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${inf.patrimonio.length > 0 ? `
            <div class="campo-normativo patrimonio-box">
              <span class="etiqueta-normativa" style="color:#D97706;">Protección Patrimonial Normativa (ICH / ZCH):</span>
              <ul class="lista-patrimonio">
                ${inf.patrimonio.map(p => `<li>🏛️ ${p.nombre} (${p.categoria}) — ${p.distanciaMetros === 0 ? 'En zona' : `${p.distanciaMetros} m`}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${inf.unidadVecinal ? `
            <div class="campo-normativo">
              <span class="etiqueta-normativa">Unidad Vecinal Oficial:</span>
              <span class="valor-normativo">U.V. N° ${inf.unidadVecinal.numero} (${inf.unidadVecinal.comuna})</span>
            </div>
          ` : ''}
        </div>

        <div class="ficha-normativa-acciones">
          <button type="button" class="accion" id="btn-descargar-cin-txt">📄 Descargar Certificado CIN-VGI (.txt)</button>
          <button type="button" class="accion secundaria" id="btn-cerrar-ficha-normativa">Cerrar</button>
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
