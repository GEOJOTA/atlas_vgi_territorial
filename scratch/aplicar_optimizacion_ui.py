import os
import re

PROJECT_DIR = r"D:\17082025\2026\Practica profesional\atlas_vgi_uah"
MAPA_JS = os.path.join(PROJECT_DIR, "src", "js", "modulos", "mapa.js")
APP_JS = os.path.join(PROJECT_DIR, "src", "js", "app.js")
INDEX_HTML = os.path.join(PROJECT_DIR, "src", "index.html")

# 1. Update mapa.js to set preferCanvas: true for high-performance Leaflet vector rendering
with open(MAPA_JS, "r", encoding="utf-8") as f:
    mapa_content = f.read()

if "preferCanvas: true" not in mapa_content:
    mapa_content = mapa_content.replace(
        "zoomControl: true\n    });",
        "zoomControl: true,\n      preferCanvas: true\n    });"
    )
    with open(MAPA_JS, "w", encoding="utf-8") as f:
        f.write(mapa_content)
    print("Updated mapa.js with preferCanvas: true.")

# 2. Update app.js to build dynamic, high-performance accordion groups for ALL 101 layers
with open(APP_JS, "r", encoding="utf-8") as f:
    app_content = f.read()

nuevo_configurar_ide = """
function configurarCapasOficialesIDE() {
  const contenedor = document.getElementById('contenedor-botones-oficiales-ide');
  if (!contenedor || !window.ModuloIDEChile) return;

  const todasCapas = window.ModuloIDEChile.obtenerCapasDisponibles();
  const capasMap = {};
  todasCapas.forEach(c => { capasMap[c.id] = c; });

  const GRUPOS_OFICIALES = [
    {
      id: 'normativa_ipt',
      nombre: '📜 Normativa Urbanística & Instrumentos de Planificación Territorial (MINVU IPT / DPA)',
      filtroGrupo: (c) => c.grupo === 'normativa_ipt'
    },
    {
      id: 'medio_ambiente',
      nombre: '🌳 Medio Ambiente, Parques, Recursos Hídricos & Suelos (MMA / MINVU / DGA / CONAF)',
      filtroGrupo: (c) => c.grupo === 'medio_ambiente_riesgos'
    },
    {
      id: 'comunidades_vivienda',
      nombre: '👥 Comunidades, RSH, Vulnerabilidad Socioterritorial & BIDAT (MDS / MINVU / INE)',
      filtroGrupo: (c) => c.grupo === 'social_comunidades'
    },
    {
      id: 'equipamiento_patrimonio',
      nombre: '🏛️ Equipamiento Público, Educación, Salud & Patrimonio (CMN / MINEDUC / MINSAL)',
      filtroGrupo: (c) => ['educacion', 'salud', 'patrimonio', 'equipamiento_infraestructura'].includes(c.grupo)
    },
    {
      id: 'seguridad',
      nombre: '🛡️ Seguridad, Bomberos & Emergencias (Carabineros / CBS / SENAPRED)',
      filtroGrupo: (c) => c.grupo === 'seguridad'
    },
    {
      id: 'movilidad_economico',
      nombre: '🚲 Movilidad, Transporte, Inversión Pública & Economía (MOP / MTT / BIP / ODEPA)',
      filtroGrupo: (c) => ['movilidad_transporte', 'movilidad_activa', 'economico_agricola'].includes(c.grupo)
    }
  ];

  contenedor.innerHTML = '';

  // Render collapsible modern accordions for each macro group
  GRUPOS_OFICIALES.forEach((grp, idx) => {
    const capasEnGrupo = todasCapas.filter(grp.filtroGrupo);
    if (capasEnGrupo.length === 0) return;

    const details = document.createElement('details');
    details.className = 'acordeon-grupo-oficial';
    if (idx < 2) details.open = true; // Open first 2 groups by default

    const summary = document.createElement('summary');
    summary.className = 'cabecera-acordeon-oficial';
    summary.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <span style="font-weight:700; font-size:1.02rem; color:var(--musgo);">${grp.nombre}</span>
        <span class="badge-acordeon-conteo">${capasEnGrupo.length} CAPAS</span>
      </div>
    `;
    details.appendChild(summary);

    const grillaCapas = document.createElement('div');
    grillaCapas.className = 'grilla-capas-acordeon';

    capasEnGrupo.forEach(def => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-categoria-oficial';
      btn.id = `btn-oficial-${def.id}`;
      btn.dataset.capa = def.id;
      btn.title = `${def.descripcion}\\nInstitución: ${def.institucion}\\nTipo: ${def.tipoServicio}`;
      btn.innerHTML = `
        <span class="icono-cat">${def.icono}</span>
        <div class="info-cat">
          <strong>${def.nombre}</strong>
          <small>${def.institucion.split('/')[0].trim()}</small>
        </div>
        <span class="badge-conteo-oficial" id="conteo-oficial-${def.id}">—</span>
      `;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        alternarCapaOficialIDE(def.id, btn);
      });
      grillaCapas.appendChild(btn);
    });

    details.appendChild(grillaCapas);
    contenedor.appendChild(details);
  });

  // WMS Patrimonio MINVU button
  const btnWMS = document.createElement('button');
  btnWMS.type = 'button';
  btnWMS.className = 'btn-categoria-oficial btn-wms-oficial';
  btnWMS.id = 'btn-oficial-wms-patrimonio';
  btnWMS.style.marginTop = '14px';
  btnWMS.dataset.wms = 'minvu_patrimonio';
  btnWMS.title = 'Superponer la capa oficial de teselas WMS GetMap de Patrimonio MINVU (OGC WMS 1.3.0)';
  btnWMS.innerHTML = `
    <span class="icono-cat">🗺️</span>
    <div class="info-cat">
      <strong>MINVU WMS Patrimonio en Vivo</strong>
      <small>Servicio OGC GetMap en vivo</small>
    </div>
    <span class="badge-conteo-oficial" style="background:#8F3A2C; color:#FFF;">WMS</span>
  `;
  btnWMS.addEventListener('click', () => alternarCapaWMSOficial('minvu_patrimonio', btnWMS));
  contenedor.appendChild(btnWMS);

  document.getElementById('btn-descargar-todo-ide')?.addEventListener('click', descargarColeccionOficialCompleta);
  inicializarInspectorNormativo();
}
"""

# Replace configurarCapasOficialesIDE in app.js
pat_cfg = r"function configurarCapasOficialesIDE\(\) \{.*?\n\}"
app_updated = re.sub(pat_cfg, nuevo_configurar_ide.strip(), app_content, flags=re.DOTALL)

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(app_updated)

print("Updated app.js with modern dynamic accordions.")
