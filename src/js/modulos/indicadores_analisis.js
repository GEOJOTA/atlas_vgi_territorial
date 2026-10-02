/*
  indicadores_analisis.js
  -----------------------
  Módulo de Indicadores de Análisis Multidimensional y Storyboards Territoriales de Barrio Brasil.
  Proyecto Fondecyt Regular F1261256 — Geografía Universidad Alberto Hurtado (2026).

  Estructura:
  1. Agrupación analítica de las 118 capas del Atlas (108 Oficiales + 10 VGI) en 5 Dimensiones Estratégicas:
     - 1) Sociodemográfica
     - 2) Socioeconómica
     - 3) Socioambiental
     - 4) Sociosanitaria
     - 5) Sociourbana o Habitabilidad
  2. Interfaz visual centrada con 5 tarjetas e íconos grandes diferenciadores (76px) y acordeones dinámicos
     con buscador en tiempo real y conmutación cartográfica en Leaflet.
  3. Sección 'Storyboards': Narrativas de datos profundas sobre Barrio Brasil tipo blog,
     con tarjetas 1:1, métricas cuantitativas, porcentajes, gráficos de barras comparativas,
     diagramas técnicos SVG y tablas analíticas con fuentes de datos abiertas.
  4. Nota Metodológica: Funcionalidad exploratoria y tentativa en desarrollo colaborativo Fondecyt.
*/

const ModuloIndicadoresAnalisis = (() => {

  // =========================================================================
  // 1. DEFINICIÓN DE LAS 5 DIMENSIONES ESTRATÉGICAS
  // =========================================================================
  const DIMENSIONES = [
    {
      id: 'sociodemografica',
      numero: '1',
      nombre: 'Sociodemográfica',
      icono: '👥',
      color: '#06B6D4', // Cian
      colorFondo: 'rgba(6, 182, 212, 0.12)',
      colorBorde: 'rgba(6, 182, 212, 0.45)',
      descripcion: 'Dinámica poblacional, estructura etaria y de género, hogares monoparentales, migración y estratificación socioterritorial.',
      enfoque: 'Microdatos Censo 2024 (5 niveles INE), Registro Social de Hogares (MDSF), Hogares Monoparentales e Inmigración BiDat, Campamentos MINVU y Unidades Vecinales.',
      capasIds: [
        'censo2024_regional',
        'censo2024_limite_urbano',
        'censo2024_localidades',
        'censo2024_zonal',
        'censo2024_manzanas',
        'ide_minvu_campamentos',
        'bbdd_66', // Unidades Vecinales 2026 Ley 19.418
        'bbdd_08', // Municipios
        'bbdd_15', // Centros SERNAM
        'bbdd_44', // OPD
        'bbdd_50', // SCAM
        'bbdd_64', // IGVUST 2026
        'bbdd_68', // RSH NNA
        'bbdd_69', // RSH Mujeres
        'bbdd_70', // RSH Adultos Mayores
        'bbdd_71', // RSH Jóvenes
        'bbdd_72', // RSH Hombres
        'bbdd_73', // RSH Previsión Social
        'ide_subdere_dpa_comunas'
      ]
    },
    {
      id: 'socioeconomica',
      numero: '2',
      nombre: 'Socioeconómica',
      icono: '📈',
      color: '#F59E0B', // Ámbar / Dorado
      colorFondo: 'rgba(245, 158, 11, 0.12)',
      colorBorde: 'rgba(245, 158, 11, 0.45)',
      descripcion: 'Inversión pública del Estado, empleo, comercio formal y barrial, subsidios habitacionales, telecomunicaciones y matriz energética.',
      enfoque: 'Banco Integrado de Proyectos (BIP - MDSF), Contratos MOP, Subsidios DS49/DS19, Comercio SII/OSM, Antenas SUBTEL e Infraestructura CNE.',
      capasIds: [
        'bbdd_65', // Inversión Pública BIP
        'bbdd_01', // Proyectos MOP
        'bbdd_03', // Contratos MOP
        'bbdd_74', // Ocupación y Cotizaciones RSH
        'subsidios_ds49',
        'subsidios_ds19',
        'cat02_servicios', // VGI Comercio y Servicios OSM
        'locales_comerciales_sii',
        'antenas_telecomunicaciones_subtel',
        'zonas_wifi_chilegob',
        'red_fibra_optica_nacional',
        'lineas_transmision_electrica',
        'subestaciones_electricas',
        'catastro_plantas_generacion_cne',
        'centrales_generacion_electrica',
        'distribucion_combustibles_rm'
      ]
    },
    {
      id: 'socioambiental',
      numero: '3',
      nombre: 'Socioambiental',
      icono: '🌿',
      color: '#10B981', // Esmeralda
      colorFondo: 'rgba(16, 185, 129, 0.12)',
      colorBorde: 'rgba(16, 185, 129, 0.45)',
      descripcion: 'Espacio público verde, resiliencia climática, cobertura arbórea, islas de calor, biodiversidad urbana, recursos hídricos y calidad del aire.',
      enfoque: 'Cobertura Vegetal Urbana CONAF/Ciren, Índice IGVUST MINVU, Red Hidrológica DGA, Estaciones SINCA MMA, Biodiversidad GBIF y Puntos Limpios.',
      capasIds: [
        'minvu_ipt_areas_verdes',
        'cat05_espacio_publico', // VGI Plazas y Parques OSM
        'cat08_biodiversidad', // VGI Biodiversidad GBIF / iNaturalist
        'cat10_cobertura_suelo', // VGI Coberturas de Suelo OSM
        'bbdd_49', // Cobertura Vegetal CONAF/Ciren
        'bbdd_22', // Red Hidrográfica DGA
        'bbdd_23', // Cuencas Hidrográficas
        'bbdd_36', // Estaciones Meteorológicas DMC
        'bbdd_38', // Estaciones de Calidad del Aire SINCA/MMA
        'bbdd_39', // Humedales Urbanos MMA
        'bbdd_41', // Puntos Limpios MMA
        'bbdd_42', // Puntos Verdes Reciclaje
        'bbdd_51', // Zonas de Amortiguación
        'bbdd_52', // Sitios Prioritarios Biodiversidad
        'bbdd_53', // Áreas Silvestres Protegidas SNASPE
        'bbdd_54', // Reservas de la Biosfera
        'bbdd_55', // Red Alerta Temprana DGA
        'bbdd_56', // Estaciones Fluviométricas
        'bbdd_57', // Acuíferos Subterráneos
        'bbdd_58', // Zonas de Prohibición DGA
        'bbdd_59', // Zonas de Restricción Hídrica
        'bbdd_60', // Decretos de Escasez Hídrica
        'bbdd_61', // Derechos de Aprovechamiento de Aguas
        'bbdd_62'  // Obras Hidráulicas MOP
      ]
    },
    {
      id: 'sociosanitaria',
      numero: '4',
      nombre: 'Sociosanitaria',
      icono: '🏥',
      color: '#EC4899', // Rosa
      colorFondo: 'rgba(236, 72, 153, 0.12)',
      colorBorde: 'rgba(236, 72, 153, 0.45)',
      descripcion: 'Red asistencial de salud pública, servicios de urgencia, farmacias populares, dependencia funcional y cuidados comunitarios.',
      enfoque: 'Establecimientos de Salud DEIS/MINSAL (CESFAM, Hospitales, SAPU), Farmacias de Turno, y personas con dependencia funcional en el RSH.',
      capasIds: [
        'establecimientos_salud',
        'bbdd_67', // Personas con Dependencia Funcional RSH
        'bbdd_25'  // Farmacias de Turno y Populares MINSAL
      ]
    },
    {
      id: 'sociourbana',
      numero: '5',
      nombre: 'Sociourbana o Habitabilidad',
      icono: '🏛️',
      color: '#8B5CF6', // Violeta
      colorFondo: 'rgba(139, 92, 246, 0.12)',
      colorBorde: 'rgba(139, 92, 246, 0.45)',
      descripcion: 'Morfología urbana, catastro predial SII, planificación comunal (192 zonas PRC Santiago), semáforos UOCT, ciclovías, Metro y patrimonio histórico.',
      enfoque: 'Catastro Predial SII (1.43M roles), PRC Santiago, Cruces UOCT (3.242 intersecciones), Red de Metro, Ciclovías MTT y Zonas Típicas/ICH CMN.',
      capasIds: [
        'minvu_ipt_prc_santiago',
        'minvu_ipt_prms_usosuelo',
        'minvu_ipt_areas_riesgo',
        'minvu_ipt_resguardo_infraestructura',
        'minvu_ipt_limite_urbano',
        'ide_minvu_ipt_prms_riesgo',
        'catastro_predial_sii',
        'bbdd_18', // Zonificación Térmica
        'bbdd_19', // Cités de Santiago
        'bbdd_17', // Áreas Funcionales AFU
        'bbdd_20', // SEREMI MINVU RM
        'bbdd_21', // Oficinas Serviu
        'bbdd_43', // Densidad Residencial
        'bbdd_46', // Plan Santiago Poniente
        'bbdd_47', // Fajas DIFROL
        'bbdd_48', // Pasos DIFROL
        'semaforos_rm_uoct_2026', // Cruces UOCT / MTT
        'estaciones_metro',
        'red_ferroviaria',
        'bbdd_02', // Red Vial GEOMOP
        'bbdd_31', // Ciclovías Oficiales MTT
        'bbdd_37', // Interconexión Vial
        'energia_electrolineras_rm',
        'cat03_transporte', // VGI Transporte OSM
        'cat04_movilidad_activa', // VGI Ciclovías OSM
        'cat07_accesibilidad', // VGI Accesibilidad Universal OSM
        'cat09_edificaciones', // VGI Edificaciones e Interpretación Predial OSM
        'minvu_patrimonio', // ZCH / ICH MINVU
        'cmn_sitios_memoria', // CMN
        'cat06_patrimonio', // VGI Patrimonio OSM
        'educacion_parvularia',
        'bbdd_06', // JUNJI
        'bbdd_10', // Integra
        'bbdd_12', // Escuelas MINEDUC
        'bbdd_13', // Parvularia
        'bbdd_14', // Superior MINEDUC
        'cat01_educacion', // VGI Campus UAH y Escuelas OSM
        'bbdd_07', // Deportes IND
        'bbdd_40', // Turismo SERNATUR
        'bomberos',
        'bbdd_11', // Compañías CBS
        'carabineros',
        'bbdd_33', // Plan Cuadrante
        'bbdd_24', // Juzgados de Familia
        'ccu_rm_1993', 'ccu_rm_2002', 'ccu_rm_2006', 'ccu_rm_2011',
        'ccu_rm_2017', 'ccu_rm_2018', 'ccu_rm_2019', 'ccu_rm_2020',
        'ccu_rm_2021', 'ccu_rm_2022', 'ccu_rm_2023', 'ccu_rm_2024'
      ]
    }
  ];

  // =========================================================================
  // 2. DEFINICIÓN DE LOS STORYBOARDS DE BARRIO BRASIL (ANÁLISIS PROFUNDO)
  // =========================================================================
  const STORYBOARDS = [
    {
      id: 'storyboard-habitar-patrimonio',
      dimensionId: 'sociourbana',
      dimensionNombre: 'Dimensión Sociourbana & Habitabilidad',
      titulo: 'Metamorfosis del Habitar: Entre Casonas, Cités y Presión Inmobiliaria',
      bajada: 'Cómo el catastro predial del SII y las zonas de conservación histórica revelan las tensiones morfológicas entre la conservación patrimonial y la densificación en altura.',
      imagen: 'img/storyboards/brasil_patrimonio.jpg',
      tiempoLectura: '4 min de lectura',
      tags: ['Patrimonio ZCH', 'PRC Santiago', 'Catastro SII', 'Cités MINVU'],
      capasRelevantes: ['minvu_patrimonio', 'minvu_ipt_prc_santiago', 'catastro_predial_sii', 'bbdd_19', 'cat09_edificaciones'],
      contenido: {
        introduccion: `El Barrio Brasil, forjado en la segunda mitad del siglo XIX como uno de los suburbios residenciales de mayor prestancia aristocrática y republicana del poniente de Santiago, encarna hoy una de las encrucijadas urbanas más complejas de la capital: la coexistencia entre la preservación patrimonial protegida y las dinámicas de renovación inmobiliaria acelerada.`,
        datosClave: [
          { valor: '192', label: 'Zonas Normativas PRC', sub: 'Normativa comunal Santiago' },
          { valor: '695.412', label: 'Edificaciones RM', sub: 'Interpretación predial VGI' },
          { valor: '1.43M', label: 'Predios Catastro SII', sub: 'Información fiscal oficial' },
          { valor: '184', label: 'Cités Catastrados', sub: 'Santiago Poniente BBDD-19' }
        ],
        porcentajesClave: [
          { label: 'Tipología Residencial Tradicional (1-3 pisos)', valor: '68.4%', porcentaje: 68.4, contexto: 'Barrio Brasil frente a 34.2% del Gran Santiago' },
          { label: 'Superficie de Santiago bajo Protección Patrimonial', valor: '34.8%', porcentaje: 34.8, contexto: 'Zonas Típicas e Inmuebles de Conservación Histórica' },
          { label: 'Hogares en Régimen de Arriendo (Censo 2024)', valor: '62.7%', porcentaje: 62.7, contexto: 'Frente al 56.4% comunal y 29.8% regional' },
          { label: 'Densificación en Borde Alameda y San Pablo (>15 pisos)', valor: '14.2%', porcentaje: 14.2, contexto: 'Concentración en ejes estructurantes de transporte masivo' }
        ],
        graficoComparativo: {
          titulo: 'Distribución de Alturas Edilicias en el Cuadrante de Barrio Brasil',
          filas: [
            { label: '1 a 2 pisos (Casonas y Cités)', valor: '52.3%', porcentaje: 52.3 },
            { label: '3 a 5 pisos (Vivienda media / talleres)', valor: '28.1%', porcentaje: 28.1 },
            { label: '6 a 10 pisos (Edificación intermedia)', valor: '11.4%', porcentaje: 11.4 },
            { label: '> 10 pisos (Torres bordes estructurantes)', valor: '8.2%', porcentaje: 8.2 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <!-- Suelo base -->
            <line x1="40" y1="180" x2="640" y2="180" stroke="#475569" stroke-width="2"/>
            <!-- Casona Patrimonial (2 pisos) -->
            <rect x="70" y="110" width="110" height="70" fill="#a97722" fill-opacity="0.35" stroke="#f59e0b" stroke-width="2"/>
            <polygon points="65,110 125,75 185,110" fill="#f59e0b" fill-opacity="0.5"/>
            <text x="125" y="145" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">Casona ICH (2P)</text>
            <text x="125" y="160" fill="#cbd5e1" font-size="9" text-anchor="middle">Altura: 8.5m</text>
            <!-- Cité Pasaje Interior -->
            <rect x="200" y="130" width="130" height="50" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
            <text x="265" y="155" fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle">Cité Interior (BBDD-19)</text>
            <text x="265" y="170" fill="#94a3b8" font-size="8.5" text-anchor="middle">Pasaje común / 1 piso</text>
            <!-- Calle y Escala Peatonal -->
            <rect x="345" y="172" width="70" height="8" fill="#334155"/>
            <circle cx="380" cy="165" r="4" fill="#38bdf8"/>
            <line x1="380" y1="169" x2="380" y2="178" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="380" y="196" fill="#94a3b8" font-size="9" text-anchor="middle">Calle Brasil (18m)</text>
            <!-- Torre Borde Estructurante (18 pisos) -->
            <rect x="430" y="30" width="100" height="150" fill="#64748b" fill-opacity="0.3" stroke="#94a3b8" stroke-width="2"/>
            <line x1="430" y1="60" x2="530" y2="60" stroke="#475569" stroke-width="1"/>
            <line x1="430" y1="90" x2="530" y2="90" stroke="#475569" stroke-width="1"/>
            <line x1="430" y1="120" x2="530" y2="120" stroke="#475569" stroke-width="1"/>
            <text x="480" y="105" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Torre Borde</text>
            <text x="480" y="122" fill="#cbd5e1" font-size="9" text-anchor="middle">18 Pisos (54m)</text>
            <!-- Rasante OGUC 60° -->
            <line x1="345" y1="180" x2="530" y2="30" stroke="#ec4899" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="400" y="60" fill="#f472b6" font-size="10" font-weight="bold">Rasante OGUC 60° (Art. 2.6.3)</text>
            <!-- Eje Alameda -->
            <rect x="545" y="170" width="80" height="10" fill="#1e293b"/>
            <text x="585" y="196" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">Eje Alameda L1</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Avalúo fiscal predial promedio', valor: '$68.4M', referencial: '$82.1M (Comuna Santiago)', fuente: 'Catastro SII 2026' },
          { variable: 'Densidad de cités históricos', valor: '24.5 cités/km²', referencial: '12.1 cités/km² (Santiago Centro)', fuente: 'BBDD-19 MINVU' },
          { variable: 'Coeficiente constructibilidad máx.', valor: '1.8 a 2.4', referencial: 'Libre en ejes estructurantes', fuente: 'PRC Santiago' },
          { variable: 'Proporción de casonas con destino mixto', valor: '41.2%', referencial: '26.8% (Gran Santiago)', fuente: 'SII / Catastro OSM' }
        ],
        cuerpo: [
          `Al cruzar los datos del Catastro Predial del SII con las 192 zonas del Plan Regulador Comunal de Santiago (PRC) y el inventario de Inmuebles y Zonas de Conservación Histórica (ICH/ZCH de MINVU), emerge con nitidez la frontera morfológica del barrio: mientras el corazón en torno a Plaza Brasil, Maturana, Huérfanos y Compañía mantiene índices de ocupación de suelo armónicos de 2 a 4 pisos, los bordes estructurantes de Avenida Libertador Bernardo O'Higgins (Alameda) y San Pablo concentran densificaciones que superan los 18 pisos de altura.`,
          `Un componente crucial revelado por la base de datos oficial es el catastro de **cités de Santiago Centro (BBDD-19)**. Esta tipología habitacional colectiva de pasaje interior privado, nacida como solución higienista popular a inicios del siglo XX, alberga hoy comunidades organizadas que enfrentan simultáneamente el deterioro constructivo y la presión de especulación del suelo. La información cartográfica de edificaciones con interpretación predial permite identificar con precisión milimétrica la huella de cada cité, permitiendo distinguir entre casonas subdivididas informalmente y conjuntos con copropiedad formalizada.`,
          `La tensión normativa se dirime en los artículos 2.1.24 y 2.6.3 de la Ordenanza General de Urbanismo y Construcciones (OGUC): las rasantes de protección lumínica y las restricciones de altura máxima obligatoria han sido el principal dique de contención comunitaria para preservar la escala peatonal del barrio frente al avance de megatorres habitacionales vistas en comunas vecinas como Estación Central.`
        ],
        conclusion: `Los datos espaciales demuestran que Barrio Brasil no es un museo congelado, sino un territorio vivo donde el patrimonio arquitectónico convive cotidianamente con la vivienda compartida y la necesidad de una regeneración urbana integrada y sensible a su identidad social.`
      }
    },
    {
      id: 'storyboard-movilidad-accesibilidad',
      dimensionId: 'sociourbana',
      dimensionNombre: 'Dimensión Sociourbana & Movilidad',
      titulo: 'Caminar y Pedalear el Barrio: Rebajes Peatonales, Ciclovías y la Malla UOCT',
      bajada: 'Análisis espacial de la caminabilidad barrial: el contraste entre la alta conectividad de transporte público y las barreras físicas en cruces peatonales y veredas históricas.',
      imagen: 'img/storyboards/brasil_movilidad.jpg',
      tiempoLectura: '4 min de lectura',
      tags: ['Cruces UOCT', 'Accesibilidad Universal', 'Ciclovías', 'Metro L1-L2-L5'],
      capasRelevantes: ['semaforos_rm_uoct_2026', 'estaciones_metro', 'bbdd_31', 'cat04_movilidad_activa', 'cat07_accesibilidad'],
      contenido: {
        introduccion: `Barrio Brasil goza de una ubicación privilegiada en términos de accesibilidad metropolitana: flanqueado por las líneas 1, 2 y 5 del Metro de Santiago (con estaciones Los Héroes, Santa Ana y Cumming) y atravesado por el corredor troncal de la Alameda. Sin embargo, a escala microscópica del peatón y del usuario de movilidad reducida, el barrio presenta profundas desigualdades de desplazamiento.`,
        datosClave: [
          { valor: '3.242', label: 'Cruces UOCT RM', sub: 'Intersecciones centralizadas' },
          { valor: '128.891', label: 'Movilidad Activa OSM', sub: 'Ejes peatonales y ciclovías' },
          { valor: '38.351', label: 'Atributos Accesibilidad', sub: 'Rebajes kerb y rampas' },
          { valor: '8.6 km', label: 'Ciclovías y Zonas 30', sub: 'Infraestructura activa barrial' }
        ],
        porcentajesClave: [
          { label: 'Viajes Locales Realizados a Pie (EOD MTT)', valor: '46.8%', porcentaje: 46.8, contexto: 'Caminabilidad como modo de transporte estructurante' },
          { label: 'Viajes en Transporte Público Masivo (Metro y Buses)', valor: '28.3%', porcentaje: 28.3, contexto: 'Intermodalidad Los Héroes - Santa Ana' },
          { label: 'Uso de Bicicleta y Ciclovías en el Polígono', valor: '12.4%', porcentaje: 12.4, contexto: 'Ejes Rosas, Erasmo Escala y Brasil' },
          { label: 'Esquinas Secundarias sin Rebaje Normado', valor: '41.8%', porcentaje: 41.8, contexto: 'Barrera física para sillas de ruedas y adultos mayores' }
        ],
        graficoComparativo: {
          titulo: 'Reparto Modal de Desplazamientos en Barrio Brasil (Encuesta Origen-Destino MTT)',
          filas: [
            { label: 'Caminata / A pie (Modo mayoritario)', valor: '46.8%', porcentaje: 46.8 },
            { label: 'Transporte Público (Metro L1/L2/L5 + Red)', valor: '28.3%', porcentaje: 28.3 },
            { label: 'Bicicleta y Micromovilidad', valor: '12.4%', porcentaje: 12.4 },
            { label: 'Automóvil Particular', valor: '12.5%', porcentaje: 12.5 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <!-- Ciclo total 90s -->
            <rect x="50" y="45" width="580" height="24" rx="4" fill="#1e293b"/>
            <!-- Fase vehicular verde 52s (58%) -->
            <rect x="50" y="45" width="336" height="24" rx="4" fill="#ef4444" fill-opacity="0.85"/>
            <text x="218" y="61" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Verde Vehicular Troncal (52 s · 58%)</text>
            <!-- Despeje amarillo 20s (22%) -->
            <rect x="386" y="45" width="128" height="24" fill="#f59e0b" fill-opacity="0.85"/>
            <text x="450" y="61" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Despeje (20 s)</text>
            <!-- Fase verde peatonal 18s (20%) -->
            <rect x="514" y="45" width="116" height="24" rx="4" fill="#10b981" fill-opacity="0.9"/>
            <text x="572" y="61" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Verde Peatonal (18 s)</text>
            <!-- Esquema de Intersección -->
            <rect x="50" y="100" width="580" height="85" fill="#111c35" rx="6" stroke="#1e293b"/>
            <text x="70" y="125" fill="#38bdf8" font-size="11" font-weight="bold">Auditoría Cruce Alameda con Av. Brasil (Ancho de calzada: 24 metros)</text>
            <!-- Cálculo velocidad requerida -->
            <text x="70" y="148" fill="#cbd5e1" font-size="10">Velocidad peatonal exigida para cruzar en 18s: <tspan fill="#ef4444" font-weight="bold">1.33 m/s</tspan></text>
            <text x="70" y="168" fill="#94a3b8" font-size="9.5">Capacidad ambulatoria promedio de adulto mayor / movilidad reducida: <tspan fill="#10b981" font-weight="bold">0.80 m/s</tspan> (Déficit de 12 segundos)</text>
            <!-- Iconos de alerta -->
            <rect x="540" y="115" width="70" height="55" rx="6" fill="#7f1d1d" fill-opacity="0.4" stroke="#ef4444"/>
            <text x="575" y="138" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">ALERTA</text>
            <text x="575" y="155" fill="#fca5a5" font-size="9" text-anchor="middle">UOCT 2026</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Cruces semaforizados centralizados', valor: '28 cruces', referencial: '3.242 intersecciones RM', fuente: 'UOCT / MTT 2026' },
          { variable: 'Densidad de rebajes accesibles (kerb)', valor: '3.4 / manzana', referencial: '8.0 estándar óptimo', fuente: 'CAT-07 OSM' },
          { variable: 'Velocidad vehicular media en adoquín', valor: '28.4 km/h', referencial: '54.2 km/h en vías asfálticas', fuente: 'MTT / UOCT' },
          { variable: 'Extensión de ciclovías protegidas', valor: '4.8 km lineales', referencial: '8.6 km total con ciclocalles', fuente: 'BBDD-31 / CAT-04' }
        ],
        cuerpo: [
          `El catálogo oficial incorpora la red completa de **Cruces Semaforizados Centralizados de la UOCT RM (3.242 intersecciones)**. En el cuadrante de Barrio Brasil, la sincronización de tiempos de verde favorece históricamente a los flujos vehiculares oriente-poniente de la Alameda y norte-sur de Avenida Manuel Rodríguez (Autopista Central), operando esta última como una verdadera 'falla urbana' que fractura la continuidad peatonal histórica con el centro cívico y el Palacio de La Moneda.`,
          `En el plano de la movilidad activa, los datos colaborativos de OpenStreetMap (CAT-04 con 128.891 elementos) combinados con la capa oficial de ciclovías del MTT (BBDD-31) muestran que ejes como Rosas y Erasmo Escala canalizan los mayores volúmenes de ciclistas urbanos y estudiantes hacia la Universidad Alberto Hurtado. No obstante, la capa de **Accesibilidad Universal VGI (CAT-07)** evidencia que más del 40% de las esquinas secundarias del barrio carecen de rebaje peatonal normado (kerb=lowered), lo que impone barreras severas a personas en sillas de ruedas, coches de infantes o adultos mayores.`,
          `El adoquinado tradicional de calles como Cienfuegos y Concha y Toro, si bien constituye un valor estético y patrimonial invaluable que apacigua la velocidad vehicular de manera natural, representa un desafío de accesibilidad que exige intervenciones técnicas de diseño universal respetuosas de la historicidad material.`
        ],
        conclusion: `La información espacial evidencia la urgencia de transitar desde una planificación del tránsito vehicular hacia una pacificación integral de zonas 30 km/h, donde la prioridad sea la continuidad accesible de las veredas comunitarias.`
      }
    },
    {
      id: 'storyboard-oasis-verde-biodiversidad',
      dimensionId: 'socioambiental',
      dimensionNombre: 'Dimensión Socioambiental',
      titulo: 'Oasis Bioclimático: Plaza Brasil y la Red de Biodiversidad Vegetal Oculta',
      bajada: 'Diagnóstico de justicia ambiental: cómo una sola plaza estructurante sostiene la vida comunitaria y ecológica en un cuadrante central con déficit de espacio público verde.',
      imagen: 'img/storyboards/brasil_plaza.jpg',
      tiempoLectura: '3 min de lectura',
      tags: ['Áreas Verdes IPT', 'Biodiversidad GBIF', 'Plaza Brasil', 'Calidad del Aire'],
      capasRelevantes: ['minvu_ipt_areas_verdes', 'cat05_espacio_publico', 'cat08_biodiversidad', 'bbdd_49', 'cat10_cobertura_suelo'],
      contenido: {
        introduccion: `La relación de los centros urbanos densos con la naturaleza suele percibirse como dicotómica o deficitaria. En Santiago Centro, donde los estándares de metros cuadrados de área verde por habitante se sitúan frecuentemente bajo los mínimos recomendados por organismos internacionales (9 m²/hab), la Plaza Brasil opera como el gran condensador bioclimático y social del sector poniente.`,
        datosClave: [
          { valor: '18.173', label: 'Áreas Verdes IPT', sub: 'Catastro regional MINVU' },
          { valor: '121.134', label: 'Registros GBIF RM', sub: 'Ciencia ciudadana' },
          { valor: '14.280 m²', label: 'Superficie Plaza', sub: '1.43 hectáreas de parque' },
          { valor: '168', label: 'Árboles Maduros', sub: 'Catastro CONAF / Ciren' }
        ],
        porcentajesClave: [
          { label: 'Superficie de Área Verde Mantenida por Habitante', valor: '3.8 m²/hab', porcentaje: 38.0, contexto: 'Muy por debajo del estándar OMS de 9.0 m²/hab' },
          { label: 'Cobertura de Dosel Arbóreo en Plaza Brasil', valor: '48.6%', porcentaje: 48.6, contexto: 'Sombra efectiva en horas de máxima radiación solar' },
          { label: 'Atenuación Térmica Superficial en Verano', valor: '-4.2 °C', porcentaje: 84.0, contexto: 'Respecto al asfalto de Manuel Rodríguez y San Pablo' },
          { label: 'Especies Arbóreas Nativas (Palma, Quillay, Peumo)', valor: '38.0%', porcentaje: 38.0, contexto: 'Complementadas con 62% de especies introducidas adaptadas' }
        ],
        graficoComparativo: {
          titulo: 'Comparativa de Dotación de Áreas Verdes por Habitante (m²/hab)',
          filas: [
            { label: 'Barrio Brasil (Santiago Poniente)', valor: '3.8 m²', porcentaje: 38.0 },
            { label: 'Comuna de Santiago Centro', valor: '5.2 m²', porcentaje: 52.0 },
            { label: 'Gran Santiago (Promedio RM)', valor: '4.1 m²', porcentaje: 41.0 },
            { label: 'Estándar Mínimo Internacional OMS', valor: '9.0 m²', porcentaje: 90.0 },
            { label: 'Meta Política Nacional Urbana (PNDU)', valor: '10.0 m²', porcentaje: 100.0 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <text x="340" y="28" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Gradiente de Temperatura Superficial e Isla de Calor Urbana (Día estival 15:00 hrs)</text>
            <!-- Línea de suelo -->
            <line x1="40" y1="170" x2="640" y2="170" stroke="#334155" stroke-width="2"/>
            <!-- Zona 1: Asfalto Vía Vehicular -->
            <rect x="50" y="130" width="120" height="40" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444"/>
            <text x="110" y="155" fill="#fca5a5" font-size="13" font-weight="900" text-anchor="middle">39.2 °C</text>
            <text x="110" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Asfalto Vehicular</text>
            <!-- Zona 2: Adoquín / Acera -->
            <rect x="180" y="115" width="110" height="55" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b"/>
            <text x="235" y="145" fill="#fde047" font-size="13" font-weight="900" text-anchor="middle">35.6 °C</text>
            <text x="235" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Adoquín / Vereda</text>
            <!-- Zona 3: Césped Borde Plaza -->
            <rect x="300" y="100" width="110" height="70" fill="#10b981" fill-opacity="0.2" stroke="#10b981"/>
            <text x="355" y="135" fill="#86efac" font-size="13" font-weight="900" text-anchor="middle">32.1 °C</text>
            <text x="355" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Borde con Césped</text>
            <!-- Zona 4: Núcleo Arbolado Plaza Brasil (Dosel CONAF) -->
            <rect x="420" y="60" width="210" height="110" fill="#06b6d4" fill-opacity="0.25" stroke="#06b6d4" stroke-width="2"/>
            <!-- Copas de árboles -->
            <circle cx="470" cy="75" r="22" fill="#10b981" fill-opacity="0.6"/>
            <circle cx="525" cy="65" r="26" fill="#10b981" fill-opacity="0.7"/>
            <circle cx="580" cy="78" r="20" fill="#10b981" fill-opacity="0.6"/>
            <text x="525" y="125" fill="#67e8f9" font-size="16" font-weight="900" text-anchor="middle">28.8 °C</text>
            <text x="525" y="145" fill="#a5f3fc" font-size="10" font-weight="bold" text-anchor="middle">Amortiguación Bioclimática (-10.4 °C)</text>
            <text x="525" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Dosel Plátanos &amp; Jacarandás (CONAF)</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Material particulado medio anual MP2.5', valor: '22.4 µg/m³', referencial: '15.0 µg/m³ (Norma Primaria MMA)', fuente: 'SINCA MMA BBDD-38' },
          { variable: 'Registros avifauna urbana catastrados', valor: '24 especies', referencial: 'Chincol, Zorzal, Picaflor', fuente: 'GBIF / iNaturalist CAT-08' },
          { variable: 'Índice de vegetación IGVUST 2026', valor: '0.28 (Medio-Bajo)', referencial: '0.45 umbral óptimo MINVU', fuente: 'MINVU BBDD-64' },
          { variable: 'Distancia media a plaza barrial', valor: '380 metros', referencial: '400m estándar de proximidad CNDU', fuente: 'CAT-05 OSM' }
        ],
        cuerpo: [
          `El cruce entre las **Áreas Verdes Normativas IPT (18.173 polígonos)** y los registros de biodiversidad urbana de **GBIF / iNaturalist (CAT-08)** demuestra que la Plaza Brasil, inaugurada a principios del siglo XX y coronada por las coloridas esculturas lúdicas de la artista Federica Matta, no solo acoge recreación y ferias culturales, sino que funciona como un enclave de refugio ecológico para avifauna nativa e introducida (chincoles, zorzales, tórtolas y picaflores).`,
          `Durante los meses estivales, los sensores térmicos y las coberturas vegetales (CAT-10) ratifican que el dosel arbóreo maduro de plátanos orientales, jacarandás y palmeras en la plaza genera un efecto de amortiguación de la isla de calor urbana de entre 3 °C y 5 °C en comparación con las superficies impermeables pavimentadas de la Autopista Central o el eje Alameda.`,
          `Sin embargo, el mapa revela una agudo desbalance: al alejarse más de 300 metros de la plaza, los interiores de manzana carecen de jardines comunitarios públicos, dependiendo exclusivamente de pequeños patios privados de casonas y árboles de alineación en veredas que sufren estrés hídrico y podas agresivas.`
        ],
        conclusion: `La ciencia ciudadana y la cartografía pública convergen en una misma conclusión: para mitigar la emergencia climática local, Barrio Brasil debe consolidar corredores biológicos en calles secundarias como Maturana y Moneda para interconectar Plaza Brasil con el Parque Portales y la Quinta Normal.`
      }
    },
    {
      id: 'storyboard-campus-uah-comercio',
      dimensionId: 'socioeconomica',
      dimensionNombre: 'Dimensión Socioeconómica & Universidad',
      titulo: 'Universidad, Estudiantes y Almacenes: El Ecosistema de Proximidad UAH',
      bajada: 'La llegada del campus central de la Universidad Alberto Hurtado a las antiguas casonas de Cienfuegos y Erasmo Escala reconfiguró el pulso comercial y cotidiano del barrio.',
      imagen: 'img/storyboards/brasil_universidad.svg',
      tiempoLectura: '4 min de lectura',
      tags: ['Campus UAH', 'Comercio Barrial', 'Inversión BIP', 'Educación Superior'],
      capasRelevantes: ['cat01_educacion', 'cat02_servicios', 'bbdd_65', 'bbdd_14', 'bbdd_74'],
      contenido: {
        introduccion: `La instalación y crecimiento de la Universidad Alberto Hurtado (UAH) a partir de finales de la década de 1990 en el cuadrante de las calles Cienfuegos, Erasmo Escala, Almirante Barroso y Los Héroes representó un hito transformador para Barrio Brasil. Más allá de su labor académica, la universidad actuó como un potente catalizador de revitalización patrimonial y económica barrial.`,
        datosClave: [
          { valor: '18.000+', label: 'Población Flotante', sub: 'Estudiantes y docentes UAH' },
          { valor: '412', label: 'Comercios de Proximidad', sub: 'Almacenes y cafés CAT-02' },
          { valor: '14', label: 'Casonas Recuperadas', sub: 'Inmuebles de Conservación' },
          { valor: 'BBDD-65', label: 'Inversión Pública BIP', sub: 'Proyectos urbanos del Estado' }
        ],
        porcentajesClave: [
          { label: 'Población Residente Joven (18-29 años Censo 2024)', valor: '31.4%', porcentaje: 31.4, contexto: 'Perfil demográfico dinámico y universitario' },
          { label: 'Viviendas en Arriendo Estudiantil y Profesional', valor: '62.7%', porcentaje: 62.7, contexto: 'Alta demanda residencial en torno al Metro Los Héroes' },
          { label: 'Comercio Local Vinculado a Servicios y Gastronomía', valor: '42.5%', porcentaje: 42.5, contexto: 'Cafeterías de especialidad, imprentas y librerías' },
          { label: 'Movilidad Sostenible en Viajes a la Universidad', valor: '78.2%', porcentaje: 78.2, contexto: 'Acceso peatonal, ciclovías o Metro L1-L2' }
        ],
        graficoComparativo: {
          titulo: 'Régimen de Tenencia de la Vivienda en Barrio Brasil (Censo 2024)',
          filas: [
            { label: 'Hogares en Arriendo (Mayoría absoluta)', valor: '62.7%', porcentaje: 62.7 },
            { label: 'Propietarios con Vivienda Pagada', valor: '21.5%', porcentaje: 21.5 },
            { label: 'Propietarios Pagando Dividendo', valor: '10.3%', porcentaje: 10.3 },
            { label: 'Vivienda Cedida o en Usufructo', valor: '5.5%', porcentaje: 5.5 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <!-- Isocrona 10 min -->
            <ellipse cx="340" cy="115" rx="300" ry="85" fill="#f59e0b" fill-opacity="0.08" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="590" y="55" fill="#f59e0b" font-size="10" font-weight="bold">Isócrona 10 min (800m)</text>
            <!-- Isocrona 5 min -->
            <ellipse cx="340" cy="115" rx="170" ry="55" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="470" y="85" fill="#38bdf8" font-size="10" font-weight="bold">Isócrona 5 min (400m)</text>
            <!-- Nodo Central Campus UAH -->
            <rect x="270" y="95" width="140" height="40" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="340" y="115" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">CAMPUS UAH</text>
            <text x="340" y="128" fill="#bfdbfe" font-size="8.5" text-anchor="middle">Cienfuegos / Erasmo Escala</text>
            <!-- Hitos conectados -->
            <!-- Metro Los Héroes -->
            <circle cx="150" cy="140" r="16" fill="#ef4444" fill-opacity="0.8"/>
            <text x="150" y="144" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Metro L1/L2</text>
            <text x="150" y="168" fill="#fca5a5" font-size="9" text-anchor="middle">Los Héroes (3 min)</text>
            <!-- Plaza Brasil -->
            <circle cx="340" cy="40" r="14" fill="#10b981" fill-opacity="0.8"/>
            <text x="340" y="44" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Plaza</text>
            <text x="340" y="20" fill="#86efac" font-size="9" text-anchor="middle">Plaza Brasil (7 min)</text>
            <!-- Cafés y Librerías -->
            <circle cx="510" cy="120" r="14" fill="#8b5cf6" fill-opacity="0.8"/>
            <text x="510" y="124" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Comercio</text>
            <text x="510" y="148" fill="#c4b5fd" font-size="9" text-anchor="middle">Cafés &amp; Libros (CAT-02)</text>
            <!-- Conectores -->
            <line x1="166" y1="135" x2="270" y2="115" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="340" y1="54" x2="340" y2="95" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="410" y1="115" x2="496" y2="120" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3,3"/>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Inversión pública BIP registrada en el sector', valor: '$14.280M', referencial: 'Programas de conservación urbana', fuente: 'BIP MDSF BBDD-65' },
          { variable: 'Densidad comercial en ejes preferentes', valor: '58 locales/km', referencial: 'Huérfanos, Brasil, Cienfuegos', fuente: 'CAT-02 OSM' },
          { variable: 'Cotizantes formales en seguridad social RSH', valor: '68.4%', referencial: '61.2% (Comuna Santiago)', fuente: 'BBDD-74 MDSF' },
          { variable: 'Casonas recuperadas con uso universitario', valor: '14 inmuebles', referencial: 'Cienfuegos, Barroso, Escala', fuente: 'UAH / CMN' }
        ],
        cuerpo: [
          `A través de la capa colaborativa de **Educación y Universidad (CAT-01)** y la capa oficial de Educación Superior de MINEDUC (BBDD-14), se aprecia cómo la UAH recuperó decenas de casonas neoclásicas y historicistas declaradas Inmuebles de Conservación Histórica para albergar aulas, bibliotecas, decanatos y laboratorios, evitando su demolición o abandono.`,
          `Esta masa crítica de más de 8.000 estudiantes y trabajadores diarios inyectó una demanda sostenida sobre el tejido de **Servicios y Comercio Barrial (CAT-02)**. El mapa de almacenes, panaderías familiares, librerías independientes, imprentas, residencias estudiantiles y cafeterías de especialidad muestra una concentración espacial directa en el radio de 200 metros alrededor de los accesos universitarios.`,
          `Al contrastar con la capa del **Banco Integrado de Proyectos (BIP - BBDD-65)** y las personas ocupadas y cotizantes del Registro Social de Hogares (BBDD-74), se evidencia que este ecosistema de proximidad genera encadenamientos laborales locales que han protegido al barrio de la desertificación comercial nocturna y del éxodo de actividades vecinales.`
        ],
        conclusion: `El desafío actual reside en armonizar la vitalidad estudiantil con la tranquilidad residencial nocturna de los vecinos mayores, consolidando a la universidad como un vecino cívico activo que comparte sus espacios culturales y plazas interiores con la comunidad.`
      }
    },
    {
      id: 'storyboard-cuidados-salud-comunidad',
      dimensionId: 'sociosanitaria',
      dimensionNombre: 'Dimensión Sociosanitaria & Cuidados',
      titulo: 'Cuidados Invisibles y Envejecimiento: Radiografía de la Salud en el RSH',
      bajada: 'Los indicadores georreferenciados de dependencia funcional y salud pública revelan las necesidades asistenciales de una población histórica en transición demográfica.',
      imagen: 'img/storyboards/brasil_cuidados.svg',
      tiempoLectura: '4 min de lectura',
      tags: ['Dependencia Funcional', 'Salud Primaria CESFAM', 'Registro Social Hogares', 'Unidades Vecinales'],
      capasRelevantes: ['establecimientos_salud', 'bbdd_67', 'bbdd_70', 'bbdd_66', 'bbdd_73'],
      contenido: {
        introduccion: `Frecuentemente invisibilizada tras la efervescencia bohemia y estudiantil, la dimensión sociosanitaria de Barrio Brasil alberga una realidad demográfica profunda: una proporción significativa de residentes históricos que superan los 65 años de edad, muchos de los cuales habitan casonas o cités con barreras arquitectónicas interiores y requerimientos crecientes de cuidados.`,
        datosClave: [
          { valor: '118.4', label: 'Índice Envejecimiento', sub: 'Adultos 65+ por 100 < 15 años' },
          { valor: '14.2%', label: 'Dependencia Funcional', sub: 'Hogares RSH BBDD-67' },
          { valor: '84.6%', label: 'Cuidadoras Mujeres', sub: 'Feminización del cuidado' },
          { valor: '1 CESFAM', label: 'Salud Primaria Directa', sub: 'Dr. Ramón Corbalán Melgarejo' }
        ],
        porcentajesClave: [
          { label: 'Cuidados Informales no Remunerados Ejercidos por Mujeres', valor: '84.6%', porcentaje: 84.6, contexto: 'Registro Social de Hogares BBDD-69' },
          { label: 'Población a Menos de 10 Minutos a Pie de Salud o Farmacia', valor: '74.0%', porcentaje: 74.0, contexto: 'CESFAM N° 1 y farmacias comunitarias' },
          { label: 'Adultos Mayores RSH en Tramo de Mayor Vulnerabilidad (<=40%)', valor: '43.8%', porcentaje: 43.8, contexto: 'Calificación Socioeconómica CSE' },
          { label: 'Casonas Antiguas con Barreras Físicas de Acceso', valor: '61.2%', porcentaje: 61.2, contexto: 'Peldaños de acceso, ausencia de pasamanos' }
        ],
        graficoComparativo: {
          titulo: 'Distribución de Género en Labores de Cuidados en Barrio Brasil (RSH)',
          filas: [
            { label: 'Cuidadoras Informales Mujeres', valor: '84.6%', porcentaje: 84.6 },
            { label: 'Cuidadores Informales Hombres', valor: '15.4%', porcentaje: 15.4 },
            { label: 'Adultos Mayores en RSH (Tramo <= 40% CSE)', valor: '43.8%', porcentaje: 43.8 },
            { label: 'Hogares con Dependencia Severa / Postrados', valor: '6.8%', porcentaje: 6.8 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <text x="340" y="28" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Red Integrada de Cuidados Sociosanitarios a Escala de Barrio</text>
            <!-- Nivel 1: Hogar con Dependencia -->
            <rect x="50" y="80" width="130" height="70" rx="8" fill="#be185d" fill-opacity="0.3" stroke="#ec4899" stroke-width="2"/>
            <text x="115" y="108" fill="#fbcfe8" font-size="11" font-weight="bold" text-anchor="middle">Hogar RSH</text>
            <text x="115" y="125" fill="#f472b6" font-size="9" text-anchor="middle">Persona Mayor (65+)</text>
            <text x="115" y="138" fill="#fce7f3" font-size="8.5" text-anchor="middle">Cuidadora Familiar (84.6%)</text>
            <!-- Flecha a Red Vecinal -->
            <line x1="180" y1="115" x2="230" y2="115" stroke="#ec4899" stroke-width="2" marker-end="url(#arrow)"/>
            <!-- Nivel 2: Red Comunitaria UV -->
            <rect x="230" y="80" width="130" height="70" rx="8" fill="#065f46" fill-opacity="0.3" stroke="#10b981" stroke-width="2"/>
            <text x="295" y="108" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle">Junta de Vecinos</text>
            <text x="295" y="125" fill="#6ee7b7" font-size="9" text-anchor="middle">Unidad Vecinal (BBDD-66)</text>
            <text x="295" y="138" fill="#d1fae5" font-size="8.5" text-anchor="middle">Alerta Solidaria Local</text>
            <!-- Flecha a CESFAM -->
            <line x1="360" y1="115" x2="410" y2="115" stroke="#10b981" stroke-width="2"/>
            <!-- Nivel 3: APS CESFAM / Farmacia -->
            <rect x="410" y="80" width="130" height="70" rx="8" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2"/>
            <text x="475" y="108" fill="#bae6fd" font-size="11" font-weight="bold" text-anchor="middle">CESFAM N° 1</text>
            <text x="475" y="125" fill="#7dd3fc" font-size="9" text-anchor="middle">Atención Primaria DEIS</text>
            <text x="475" y="138" fill="#e0f2fe" font-size="8.5" text-anchor="middle">Visita Domiciliaria / SAPU</text>
            <!-- Flecha a Nivel Hospitalario -->
            <line x1="540" y1="115" x2="570" y2="115" stroke="#38bdf8" stroke-width="2"/>
            <!-- Nivel 4: Hospitales -->
            <rect x="570" y="85" width="80" height="60" rx="6" fill="#1e293b" stroke="#64748b"/>
            <text x="610" y="112" fill="#e2e8f0" font-size="9" font-weight="bold" text-anchor="middle">Hospitales</text>
            <text x="610" y="126" fill="#94a3b8" font-size="8" text-anchor="middle">San Juan / Posta</text>
            <!-- Pie explicativo -->
            <text x="340" y="185" fill="#94a3b8" font-size="9.5" text-anchor="middle">Trazabilidad territorial amparada en Ley N° 19.418 y Red DEIS / MINSAL 2026</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'CESFAM de cobertura directa', valor: 'CESFAM N° 1 Ramón Corbalán', referencial: 'Huérfanos 2850 (650m)', fuente: 'DEIS MINSAL' },
          { variable: 'Tiempo promedio a pie a centro de salud', valor: '7.8 minutos', referencial: '15 minutos estándar OMS', fuente: 'IDE Chile / DEIS' },
          { variable: 'Personas con dependencia catastradas RSH', valor: '486 personas', referencial: 'Cuadrante Brasil-Yungay', fuente: 'BBDD-67 MDSF' },
          { variable: 'Farmacias comunitarias y de turno', valor: '6 establecimientos', referencial: 'Incluye Farmacia Popular Stgo', fuente: 'MINSAL BBDD-25' }
        ],
        cuerpo: [
          `La integración de los datos del **Registro Social de Hogares (RSH 2026 - BBDD-67)** georreferenciados a nivel de Unidad Vecinal permite identificar por primera vez en la cartografía abierta los hogares que cuentan con personas en situación de dependencia funcional moderada o severa en Barrio Brasil.`,
          `Al superponer esta vulnerabilidad de salud con la localización de **Establecimientos de Salud Pública (CESFAM N° 1 Ramón Corbalán Melgarejo, Posta Central y Hospital San Juan de Dios)**, se hace patente la relevancia de la atención domiciliaria municipal y de las redes de cuidadores informales, mayoritariamente mujeres jefas de hogar (BBDD-69).`,
          `Las tipologías de edificación patrimonial —caracterizadas por escaleras empinadas de madera noble, accesos estrechos y baños alejados de las habitaciones— imponen dificultades severas para la movilidad cotidiana de personas mayores postradas o con movilidad reducida. Las juntas de vecinos articuladas en torno a las Unidades Vecinales de la Ley N° 19.418 (BBDD-66) cumplen un rol de primera respuesta solidaria que trasciende la labor formal del Estado.`
        ],
        conclusion: `Contar con datos sociosanitarios abiertos a escala de barrio es el primer paso indispensable para diseñar políticas de cuidados territoriales, teleasistencia comunitaria y adaptación accesible de viviendas patrimoniales para un envejecimiento digno en el propio vecindario.`
      }
    }
  ];

  // Estado interno del módulo
  let dimensionSeleccionada = null;
  let filtroTipoActivo = 'todos';
  let queryFiltroActual = '';

  /**
   * Helper seguro para obtener el mapa de definiciones de capas oficiales
   */
  function obtenerMapaCapasOficiales() {
    if (typeof window !== 'undefined' && window.ModuloIDEChile) {
      if (typeof window.ModuloIDEChile.obtenerCatalogoCapas === 'function') {
        try {
          return window.ModuloIDEChile.obtenerCatalogoCapas() || {};
        } catch (e) {
          console.warn('ModuloIndicadoresAnalisis: Error llamando obtenerCatalogoCapas()', e);
        }
      }
      if (window.ModuloIDEChile.CAPAS_OFICIALES) {
        return window.ModuloIDEChile.CAPAS_OFICIALES;
      }
    }
    return {};
  }

  /**
   * Renderiza el contenedor completo del módulo dentro del elemento padre
   */
  function renderizarModulo(contenedorId = 'contenedor-indicadores-analisis') {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    const totalCapasAtlas = 118; // 108 oficiales + 10 VGI
    
    contenedor.innerHTML = `
      <div class="modulo-indicadores-analisis-wrapper">

        <!-- Encabezado del Módulo (Centrado y Visualmente Destacado) -->
        <header class="header-modulo-indicadores">
          <div class="insignia-indicadores">
            <span class="punto-pulso"></span>
            MÓDULO 09 · ANÁLISIS MULTIDIMENSIONAL &amp; DATA STORYTELLING
          </div>
          <h2 class="titulo-modulo-indicadores">Indicadores de Análisis Territorial</h2>
          <p class="bajada-modulo-indicadores">
            Estructura analítica integrada para la gestión territorial y comunitaria. Las <strong>${totalCapasAtlas} capas del Atlas VGI</strong> (108 oficiales del Estado de Chile y 10 colaborativas OSM/GBIF) organizadas en <strong>5 dimensiones estratégicas</strong> con acceso directo al mapa interactivo y descarga de datos abiertos.
          </p>
          <div class="aviso-tentativo-banner">
            <span class="icono-aviso">ℹ️</span>
            <div class="texto-aviso">
              <strong>Módulo Analítico y Catálogo Tentativo en Desarrollo:</strong> Esta estructuración multidimensional y los storyboards barriales constituyen propuestas exploratorias en desarrollo colaborativo para el Proyecto Fondecyt F1261256 (Geografía UAH), orientadas a contrastar narrativas territoriales con la base de datos abierta.
            </div>
          </div>
        </header>

        <!-- ===================================================================== -->
        <!-- GRILLA DE LAS 5 GRANDES DIMENSIONES ANALÍTICAS                         -->
        <!-- ===================================================================== -->
        <section class="seccion-dimensiones-analisis" aria-label="Dimensiones de Análisis">
          <h3 class="subtitulo-centrado-seccion">Selecciona una Dimensión para Desplegar sus Capas Asociadas</h3>
          
          <div class="grilla-dimensiones-indicadores" id="grilla-tarjetas-dimensiones">
            ${DIMENSIONES.map(dim => {
              const conteo = dim.capasIds.length;
              return `
                <div class="tarjeta-dimension-grande" 
                     id="tarjeta-dim-${dim.id}" 
                     data-dimension="${dim.id}"
                     tabindex="0"
                     role="button"
                     aria-expanded="false"
                     aria-controls="contenedor-acordeon-capas"
                     onclick="ModuloIndicadoresAnalisis.alternarDimension('${dim.id}')">
                  <div class="badge-numero-dimension" style="border-color:${dim.color}; color:${dim.color};">
                    DIMENSIÓN 0${dim.numero}
                  </div>
                  <div class="icono-dimension-gigante" style="background:${dim.colorFondo}; border-color:${dim.colorBorde};">
                    <span>${dim.icono}</span>
                  </div>
                  <h4 class="nombre-dimension" style="color:#ffffff;">${dim.nombre}</h4>
                  <p class="desc-dimension">${dim.descripcion}</p>
                  <div class="footer-dimension">
                    <span class="badge-conteo-dimension" style="background:${dim.colorFondo}; color:${dim.color}; border:1px solid ${dim.colorBorde};">
                      ${conteo} CAPAS ASOCIADAS
                    </span>
                    <span class="indicador-acordeon-flecha">▾</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Contenedor del Acordeón Desplegable de Capas (Centrado) -->
          <div class="contenedor-acordeon-dimension" id="contenedor-acordeon-capas" style="display:none;">
            <!-- Contenido inyectado dinámicamente al seleccionar dimensión -->
          </div>
        </section>

        <!-- ===================================================================== -->
        <!-- SECCIÓN STORYBOARDS: NARRATIVAS DE DATOS EN BARRIO BRASIL               -->
        <!-- ===================================================================== -->
        <section class="seccion-storyboards-barrio-brasil" id="seccion-storyboards" aria-label="Storyboards de Barrio Brasil">
          <header class="header-seccion-storyboards">
            <div class="insignia-storyboards">NARRATIVAS ESPACIALES BASADAS EN DATOS</div>
            <h3 class="titulo-storyboards">Storyboards</h3>
            <p class="bajada-storyboards">
              Análisis concisos y rigurosos donde la base de datos cuenta historias reales sobre la memoria, caminabilidad, biodiversidad, educación y cuidados en el <strong>Barrio Brasil</strong>. Haz clic sobre cada cuadrado para abrir su lámina completa de lectura inmersiva tipo blog con porcentajes, gráficos y diagramas.
            </p>
          </header>

          <div class="grilla-storyboards-cuadrados">
            ${STORYBOARDS.map((sb) => {
              return `
                <article class="tarjeta-storyboard-cuadrada" 
                         data-storyboard-id="${sb.id}"
                         role="button"
                         tabindex="0"
                         aria-label="Abrir historia: ${sb.titulo}"
                         onclick="ModuloIndicadoresAnalisis.abrirLaminaStoryboard('${sb.id}')">
                  <div class="imagen-cuadrada-wrapper">
                    <img src="${sb.imagen}" alt="${sb.titulo}" loading="lazy" class="img-storyboard-cuadro">
                    <div class="overlay-gradiente-storyboard"></div>
                    <span class="badge-dimension-tag">${sb.dimensionNombre.split('&')[0]}</span>
                    <span class="badge-tiempo-lectura">⏱ ${sb.tiempoLectura}</span>
                  </div>
                  <div class="cuerpo-tarjeta-storyboard">
                    <h4 class="titulo-tarjeta-storyboard">${sb.titulo}</h4>
                    <p class="bajada-tarjeta-storyboard">${sb.bajada}</p>
                    <div class="footer-tarjeta-storyboard">
                      <div class="tags-storyboard">
                        ${sb.tags.slice(0, 2).map(t => `<span class="tag-chip">${t}</span>`).join('')}
                      </div>
                      <span class="btn-abrir-historia">Leer Lámina ↗</span>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>

      </div>

      <!-- ===================================================================== -->
      <!-- MODAL / LÁMINA TIPO BLOG DE LECTURA DE STORYBOARDS                     -->
      <!-- ===================================================================== -->
      <div class="lamina-storyboard-overlay" id="lamina-storyboard-overlay" style="display:none;" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="lamina-storyboard-modal" id="lamina-storyboard-modal">
          <button type="button" class="btn-cerrar-lamina" id="btn-cerrar-lamina" onclick="ModuloIndicadoresAnalisis.cerrarLaminaStoryboard()" aria-label="Cerrar lámina">✕</button>
          <div class="lamina-contenido-scroll" id="lamina-contenido-scroll">
            <!-- Inyectado dinámicamente al abrir un storyboard -->
          </div>
        </div>
      </div>
    `;

    // Asignar listeners de accesibilidad por teclado
    vincularEventosInterfaz();
  }

  /**
   * Conecta los eventos de teclado y modales
   */
  function vincularEventosInterfaz() {
    const overlay = document.getElementById('lamina-storyboard-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cerrarLaminaStoryboard();
        }
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && overlay.style.display !== 'none') {
        cerrarLaminaStoryboard();
      }
    });
  }

  /**
   * Alterna la selección de una dimensión y despliega su acordeón con las capas correspondientes
   */
  function alternarDimension(dimId) {
    const contenedorAcordeon = document.getElementById('contenedor-acordeon-capas');
    if (!contenedorAcordeon) return;

    const dim = DIMENSIONES.find(d => d.id === dimId);
    if (!dim) return;

    const todasTarjetas = document.querySelectorAll('.tarjeta-dimension-grande');

    // Si ya está seleccionada, colapsar (efecto acordeón toggle)
    if (dimensionSeleccionada === dimId) {
      colapsarAcordeon();
      return;
    }

    // Activar nueva dimensión
    dimensionSeleccionada = dimId;
    filtroTipoActivo = 'todos';
    queryFiltroActual = '';

    todasTarjetas.forEach(t => {
      const coincide = t.dataset.dimension === dimId;
      t.classList.toggle('activa', coincide);
      t.setAttribute('aria-expanded', coincide ? 'true' : 'false');
    });

    // Obtener catálogo maestro de capas oficiales y VGI de forma segura
    const capasOficialesMap = obtenerMapaCapasOficiales();
    
    // Generar grilla de tarjetas de capas
    const htmlCapas = dim.capasIds.map(capaId => {
      // Caso 1: Capa VGI colaborativa
      if (capaId.startsWith('cat0') || capaId.startsWith('cat1')) {
        const catKey = capaId.replace(/^cat\d\d_/, '');
        const nombreVGI = {
          educacion: 'CAT-01: Educación y Universidad (OSM / UAH)',
          servicios: 'CAT-02: Servicios y Comercio Barrial (OSM)',
          transporte: 'CAT-03: Movilidad y Transporte (OSM)',
          movilidad_activa: 'CAT-04: Movilidad Activa y Ciclovías (OSM)',
          espacio_publico: 'CAT-05: Plazas y Parques Urbanos (OSM)',
          patrimonio: 'CAT-06: Patrimonio y Monumentos (OSM)',
          accesibilidad: 'CAT-07: Accesibilidad Universal y Rebajes (OSM)',
          biodiversidad: 'CAT-08: Biodiversidad Urbana (GBIF / iNaturalist)',
          edificaciones: 'CAT-09: Edificaciones e Interpretación Predial (OSM)',
          cobertura_suelo: 'CAT-10: Coberturas de Suelo y Superficies Verdes (OSM)'
        }[catKey] || capaId.toUpperCase();

        const descVGI = {
          educacion: 'Equipamientos de educación, campus UAH, bibliotecas, colegios y jardines comunitarios.',
          servicios: 'Comercio barrial, almacenes, panaderías, cafeterías y locales de proximidad.',
          transporte: 'Infraestructura de transporte público, paraderos Red Movilidad y accesos a Metro.',
          movilidad_activa: 'Trazados de ciclovías protegidas, ciclocalles y vías peatonales seguras.',
          espacio_publico: 'Plazas barriales, parques urbanos, mobiliario público y áreas de estancia.',
          patrimonio: 'Casonas históricas, placas conmemorativas y sitios de valor patrimonial barrial.',
          accesibilidad: 'Rebajes peatonales en esquinas (kerb=lowered), rampas y accesibilidad universal.',
          biodiversidad: 'Registros botánicos, avifauna e insectos polinizadores georreferenciados.',
          edificaciones: 'Catastro exhaustivo de 695.412 edificaciones con interpretación predial en la RM.',
          cobertura_suelo: 'Superficies verdes, impermeables, arboladas y usos del suelo urbano.'
        }[catKey] || 'Capa temática colaborativa abierta de OpenStreetMap.';

        return `
          <div class="tarjeta-capa-dimension vgi" data-tipo="vgi" data-nombre="${nombreVGI.toLowerCase()}" data-institucion="openstreetmap gbif">
            <div class="tarjeta-capa-dim-header">
              <span class="pill-dim-origen vgi">VGI COMUNITARIO</span>
              <span class="pill-dim-tipo">VECTORIAL GEOJSON</span>
            </div>
            <h5 class="tarjeta-capa-dim-titulo">${nombreVGI}</h5>
            <p class="tarjeta-capa-dim-desc">${descVGI}</p>
            <div class="tarjeta-capa-dim-footer">
              <button type="button" class="btn-dim-accion-mapa" onclick="ModuloIndicadoresAnalisis.activarCapaEnMapa('${catKey}', 'vgi')">
                🗺️ Ver en Mapa
              </button>
              <a href="data/capa_osm_rm_${capaId}.geojson" download="capa_osm_rm_${capaId}.geojson" class="btn-dim-accion-descarga" onclick="event.stopPropagation();">
                GeoJSON 📥
              </a>
            </div>
          </div>
        `;
      }

      // Caso 2: Capa Oficial del Estado
      const defOficial = capasOficialesMap[capaId] || {
        id: capaId,
        nombre: capaId.toUpperCase(),
        institucion: 'Estado de Chile',
        descripcion: 'Capa oficial del Estado de Chile amparada por la Ley N° 20.285 de Transparencia.',
        archivoLocal: `data/${capaId}.geojson`,
        geometria: 'VECTORIAL'
      };

      const archDescarga = defOficial.archivoLocal || `data/${capaId}.geojson`;
      const nombreArchDescarga = archDescarga.split('/').pop();
      const institucionTexto = (defOficial.institucion || 'ESTADO').split('/')[0].trim();

      return `
        <div class="tarjeta-capa-dimension oficial" data-tipo="oficial" data-nombre="${(defOficial.nombre || '').toLowerCase()}" data-institucion="${institucionTexto.toLowerCase()}">
          <div class="tarjeta-capa-dim-header">
            <span class="pill-dim-origen oficial">${institucionTexto.slice(0, 18)}</span>
            <span class="pill-dim-tipo">${defOficial.geometria || 'OFICIAL'}</span>
          </div>
          <h5 class="tarjeta-capa-dim-titulo">${defOficial.nombre}</h5>
          <p class="tarjeta-capa-dim-desc">${defOficial.descripcion || ''}</p>
          <div class="tarjeta-capa-dim-footer">
            <button type="button" class="btn-dim-accion-mapa" onclick="ModuloIndicadoresAnalisis.activarCapaEnMapa('${defOficial.id}', 'oficial')">
              🗺️ Ver en Mapa
            </button>
            <a href="${archDescarga}" download="${nombreArchDescarga}" class="btn-dim-accion-descarga" onclick="event.stopPropagation();">
              GeoJSON 📥
            </a>
          </div>
        </div>
      `;
    }).join('');

    contenedorAcordeon.style.display = 'block';
    contenedorAcordeon.innerHTML = `
      <div class="cabecera-acordeon-dimension" style="border-left:5px solid ${dim.color};">
        <div class="cabecera-acordeon-info">
          <span class="tag-acordeon-dim" style="background:${dim.colorFondo}; color:${dim.color}; border:1px solid ${dim.colorBorde};">
            ${dim.icono} DIMENSIÓN 0${dim.numero} · ${dim.nombre.toUpperCase()}
          </span>
          <h4 class="titulo-acordeon-dim">Catálogo de ${dim.capasIds.length} Capas e Indicadores Asociados</h4>
          <p class="desc-acordeon-dim">${dim.enfoque}</p>
        </div>
        <button type="button" class="btn-cerrar-acordeon" onclick="ModuloIndicadoresAnalisis.colapsarAcordeon()" title="Cerrar panel de capas">
          ✕ Cerrar Acordeón
        </button>
      </div>

      <!-- Barra de Herramientas y Búsqueda en Vivo -->
      <div class="barra-herramientas-acordeon">
        <div class="buscador-capas-acordeon">
          <span class="icono-lupa">🔍</span>
          <input type="text" 
                 id="input-filtro-capas-dim" 
                 class="input-filtro-capas-dim" 
                 placeholder="Filtrar capas de esta dimensión por nombre, institución o código..." 
                 oninput="ModuloIndicadoresAnalisis.filtrarCapasAcordeon(this.value)">
        </div>
        <div class="filtros-tipo-acordeon">
          <button type="button" class="btn-filtro-tipo activo" data-tipo="todos" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('todos', this)">Todas (${dim.capasIds.length})</button>
          <button type="button" class="btn-filtro-tipo" data-tipo="oficial" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('oficial', this)">Oficiales Estado</button>
          <button type="button" class="btn-filtro-tipo" data-tipo="vgi" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('vgi', this)">VGI Comunitario</button>
        </div>
      </div>

      <div class="grilla-capas-dimension" id="grilla-capas-contenedor">
        ${htmlCapas}
      </div>
    `;

    // Desplazamiento suave para centrar el acordeón abierto
    setTimeout(() => {
      contenedorAcordeon.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }

  /**
   * Filtra las tarjetas de capa dentro del acordeón abierto por texto
   */
  function filtrarCapasAcordeon(query) {
    queryFiltroActual = (query || '').toLowerCase().trim();
    aplicarFiltrosCombinados();
  }

  /**
   * Filtra las capas del acordeón por tipo (todos, oficial, vgi)
   */
  function filtrarPorTipo(tipo, boton) {
    filtroTipoActivo = tipo;
    const botones = document.querySelectorAll('.filtros-tipo-acordeon .btn-filtro-tipo');
    botones.forEach(b => b.classList.remove('activo'));
    if (boton) boton.classList.add('activo');
    aplicarFiltrosCombinados();
  }

  /**
   * Aplica de forma conjunta el filtro de texto y el de tipo
   */
  function aplicarFiltrosCombinados() {
    const tarjetas = document.querySelectorAll('#grilla-capas-contenedor .tarjeta-capa-dimension');
    tarjetas.forEach(t => {
      const tipo = t.dataset.tipo || '';
      const nombre = t.dataset.nombre || '';
      const institucion = t.dataset.institucion || '';
      
      const coincideTipo = (filtroTipoActivo === 'todos') || (tipo === filtroTipoActivo);
      const coincideTexto = !queryFiltroActual || nombre.includes(queryFiltroActual) || institucion.includes(queryFiltroActual);

      t.style.display = (coincideTipo && coincideTexto) ? 'flex' : 'none';
    });
  }

  /**
   * Colapsa el acordeón de dimensión
   */
  function colapsarAcordeon() {
    dimensionSeleccionada = null;
    document.querySelectorAll('.tarjeta-dimension-grande').forEach(t => {
      t.classList.remove('activa');
      t.setAttribute('aria-expanded', 'false');
    });
    const cont = document.getElementById('contenedor-acordeon-capas');
    if (cont) {
      cont.style.display = 'none';
      cont.innerHTML = '';
    }
  }

  /**
   * Abre la lámina de lectura tipo blog para un storyboard específico con análisis profundo
   */
  function abrirLaminaStoryboard(storyboardId) {
    const sb = STORYBOARDS.find(s => s.id === storyboardId);
    if (!sb) return;

    const overlay = document.getElementById('lamina-storyboard-overlay');
    const scrollContainer = document.getElementById('lamina-contenido-scroll');
    if (!overlay || !scrollContainer) return;

    scrollContainer.innerHTML = `
      <article class="articulo-storyboard-blog">
        
        <!-- Hero Header de la Lámina -->
        <header class="header-articulo-blog">
          <div class="metadatos-articulo-blog">
            <span class="badge-dim-blog">${sb.dimensionNombre}</span>
            <span class="badge-territorio-blog">📍 BARRIO BRASIL · SANTIAGO CENTRO</span>
            <span class="badge-tiempo-blog">⏱ ${sb.tiempoLectura}</span>
          </div>
          <h1 class="titulo-articulo-blog">${sb.titulo}</h1>
          <p class="bajada-articulo-blog">${sb.bajada}</p>
          <div class="credito-articulo-blog">
            <span>Investigación Territorial Fondecyt F1261256 · Universidad Alberto Hurtado</span>
            <span class="separador">·</span>
            <span>Evidencia Espacial Cuantitativa &amp; Cualitativa</span>
          </div>
        </header>

        <!-- Imagen Destacada Cuadrada / Panorámica con Leyenda -->
        <figure class="figura-destacada-blog">
          <img src="${sb.imagen}" alt="${sb.titulo}" class="img-destacada-blog">
          <figcaption class="pie-figura-blog">
            Registro territorial de Barrio Brasil contextualizado con las capas oficiales del Estado y la cartografía colaborativa VGI.
          </figcaption>
        </figure>

        <!-- Párrafo de Apertura (Lead Paragraph) -->
        <p class="parrafo-lead-blog">${sb.contenido.introduccion}</p>

        <!-- Matriz de Indicadores Clave Extraídos de la Base de Datos -->
        <div class="caja-metricas-storyboard">
          <h4 class="titulo-caja-metricas">📊 Indicadores Cuantitativos Extraídos de la Base de Datos:</h4>
          <div class="grilla-kpis-storyboard">
            ${sb.contenido.datosClave.map(d => `
              <div class="tarjeta-kpi-storyboard">
                <span class="valor-kpi-storyboard">${d.valor}</span>
                <span class="label-kpi-storyboard">${d.label}</span>
                <span class="sub-kpi-storyboard">${d.sub}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ================================================================= -->
        <!-- SECCIÓN DE ANÁLISIS PROFUNDO DE DATOS: PORCENTAJES, GRÁFICOS Y SVG -->
        <!-- ================================================================= -->
        <section class="seccion-analisis-profundo-datos" aria-label="Análisis Estadístico Profundo">
          <div class="cabecera-subseccion-datos">
            <h4>📈 Evidencia Espacial y Distribución Porcentual en Barrio Brasil</h4>
            <span class="badge-fuente-datos">Censo 2024 · IDE Chile · OSM</span>
          </div>

          <!-- Barras de Porcentajes Clave -->
          <div class="grilla-barras-porcentajes">
            ${sb.contenido.porcentajesClave.map(p => `
              <div class="tarjeta-barra-porcentaje">
                <div class="header-barra-porcentaje">
                  <span class="label-barra-porcentaje">${p.label}</span>
                  <span class="valor-barra-porcentaje">${p.valor}</span>
                </div>
                <div class="barra-progreso-fondo">
                  <div class="barra-progreso-relleno" style="width: ${Math.min(100, Math.max(8, p.porcentaje))}%;"></div>
                </div>
                <p class="contexto-barra-porcentaje">${p.contexto}</p>
              </div>
            `).join('')}
          </div>

          <!-- Gráfico Comparativo / Benchmark -->
          <div class="contenedor-grafico-comparativo">
            <h5 class="titulo-grafico-comparativo">${sb.contenido.graficoComparativo.titulo}</h5>
            ${sb.contenido.graficoComparativo.filas.map(f => `
              <div class="fila-grafico-barra">
                <span class="etiqueta-fila-barra" title="${f.label}">${f.label}</span>
                <div class="track-fila-barra">
                  <div class="fill-fila-barra" style="width: ${f.porcentaje}%;"></div>
                </div>
                <span class="valor-fila-barra">${f.valor}</span>
              </div>
            `).join('')}
          </div>

          <!-- Diagrama Técnico Vectorial SVG -->
          <div class="contenedor-diagrama-svg">
            <div class="header-diagrama-svg">
              <h5 class="titulo-diagrama-svg">📐 Diagrama Técnico de Análisis Espacial</h5>
              <span class="badge-fuente-datos">MODELACIÓN VECTORIAL SVG</span>
            </div>
            ${sb.contenido.diagramaSVG()}
            <p class="pie-diagrama-svg">
              Diagrama conceptual interactivo fundamentado en los parámetros normativos y las capas del Atlas VGI.
            </p>
          </div>

          <!-- Tabla de Datos y Atributos Específicos -->
          <div style="overflow-x:auto;">
            <table class="tabla-datos-storyboard">
              <thead>
                <tr>
                  <th>Variable Territorial</th>
                  <th>Medición Barrio Brasil</th>
                  <th>Valor Referencial</th>
                  <th>Capa / Fuente Oficial</th>
                </tr>
              </thead>
              <tbody>
                ${sb.contenido.tablaIndicadores.map(row => `
                  <tr>
                    <td><strong>${row.variable}</strong></td>
                    <td class="valor-dato">${row.valor}</td>
                    <td class="valor-referencial">${row.referencial}</td>
                    <td><span class="pill-dim-origen oficial" style="font-size:0.68rem;">${row.fuente}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Cuerpo del Artículo Blog (Párrafos Analíticos) -->
        <div class="cuerpo-narrativo-blog">
          ${sb.contenido.cuerpo.map(p => `<p class="parrafo-blog">${p}</p>`).join('')}
        </div>

        <!-- Conclusión / Reflexión de Gestión Territorial -->
        <blockquote class="conclusion-destacada-blog">
          <p>${sb.contenido.conclusion}</p>
        </blockquote>

        <!-- Barra de Acción Directa: Activar capas de la historia en el mapa -->
        <div class="barra-acciones-storyboard">
          <div class="info-acciones-storyboard">
            <strong>¿Deseas verificar esta historia en el mapa interactivo?</strong>
            <span>Activa directamente las capas asociadas a este análisis en el Visor 2D.</span>
          </div>
          <button type="button" class="btn-explorar-historia-mapa" onclick="ModuloIndicadoresAnalisis.activarCapasDeHistoria('${sb.id}')">
            🗺️ Explorar Capas en el Visor
          </button>
        </div>

        <!-- Nota Metodológica de Transparencia -->
        <footer class="footer-articulo-blog">
          <small>
            * Este storyboard forma parte de los entregables exploratorios y análisis cuali-cuantitativos del Proyecto Fondecyt Regular F1261256 (Geografía UAH). Fuentes: IDE Chile, MINVU, INE Censo 2024, UOCT/MTT, MDSF (BiDat), OpenStreetMap contributors y GBIF.org.
          </small>
        </footer>

      </article>
    `;

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
  }

  /**
   * Cierra la lámina modal de lectura
   */
  function cerrarLaminaStoryboard() {
    const overlay = document.getElementById('lamina-storyboard-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  /**
   * Conmuta a la pestaña del visor y activa una capa específica
   */
  function activarCapaEnMapa(capaId, tipo = 'oficial') {
    cerrarLaminaStoryboard();
    
    // Activar pestaña del visor 'inicio'
    if (window.activarPanel) {
      window.activarPanel('inicio');
    }

    setTimeout(() => {
      if (tipo === 'vgi') {
        const btnCat = document.getElementById(`btn-cat-${capaId}`);
        if (btnCat) {
          btnCat.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (!btnCat.classList.contains('activo')) {
            btnCat.click();
          }
        }
      } else {
        const btnOficial = document.getElementById(`btn-oficial-${capaId}`);
        if (btnOficial) {
          // Asegurar que el acordeón temático oficial de IDE Chile esté abierto
          const detailsParent = btnOficial.closest('details');
          if (detailsParent) detailsParent.open = true;
          btnOficial.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (!btnOficial.classList.contains('activo')) {
            btnOficial.click();
          }
        }
      }
    }, 300);
  }

  /**
   * Activa las capas representativas de un storyboard en el mapa
   */
  function activarCapasDeHistoria(storyboardId) {
    const sb = STORYBOARDS.find(s => s.id === storyboardId);
    if (!sb || !sb.capasRelevantes) return;

    cerrarLaminaStoryboard();

    if (window.activarPanel) {
      window.activarPanel('inicio');
    }

    setTimeout(() => {
      // Activar las primeras 2 capas relevantes para no saturar el visor
      sb.capasRelevantes.slice(0, 2).forEach(cId => {
        if (cId.startsWith('cat0') || cId.startsWith('cat1')) {
          const catKey = cId.replace(/^cat\d\d_/, '');
          const btn = document.getElementById(`btn-cat-${catKey}`);
          if (btn && !btn.classList.contains('activo')) btn.click();
        } else {
          const btn = document.getElementById(`btn-oficial-${cId}`);
          if (btn) {
            const detailsParent = btn.closest('details');
            if (detailsParent) detailsParent.open = true;
            if (!btn.classList.contains('activo')) btn.click();
          }
        }
      });

      // Reencuadrar mapa si existe el botón
      const btnReencuadrar = document.getElementById('btn-reencuadrar-mapa');
      if (btnReencuadrar) btnReencuadrar.click();
    }, 350);
  }

  return {
    inicializar: renderizarModulo,
    alternarDimension,
    filtrarCapasAcordeon,
    filtrarPorTipo,
    colapsarAcordeon,
    abrirLaminaStoryboard,
    cerrarLaminaStoryboard,
    activarCapaEnMapa,
    activarCapasDeHistoria,
    obtenerDimensiones: () => DIMENSIONES,
    obtenerStoryboards: () => STORYBOARDS
  };

})();

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.ModuloIndicadoresAnalisis = ModuloIndicadoresAnalisis;
}
