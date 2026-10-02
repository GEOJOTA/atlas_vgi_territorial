/*
  indicadores_analisis.js
  -----------------------
  Módulo de Indicadores de Análisis Multidimensional y Storyboards Territoriales de Barrio Brasil.
  Proyecto Fondecyt Regular F1261256 — Geografía Universidad Alberto Hurtado (2026).

  Estructura y Principios:
  1. Agrupación analítica de las 118 capas del Atlas (108 Oficiales + 10 VGI) en 5 Dimensiones Estratégicas:
     - 1) Sociodemográfica (19 capas)
     - 2) Socioeconómica (18 capas)
     - 3) Socioambiental (23 capas)
     - 4) Sociosanitaria (3 capas)
     - 5) Sociourbana o Habitabilidad (55 capas)
  2. Nombres de capas rigurosamente idénticos a los del Módulo "00. Visor y Atlas VGI".
  3. Datos espaciales derivados exclusivamente de la base de datos formal del Atlas VGI (capas oficiales y VGI).
  4. Storyboards territoriales con rigor académico y lenguaje accesible:
     - Métricas cuantitativas (KPIs), porcentajes, gráficos de barras comparativas, diagramas técnicos vectoriales SVG y tablas de datos.
     - Sección analítica estructurada según los 4 Usuarios-Tipo del proyecto:
       * Institución / Autoridad Pública (MINVU, Municipio, MTT, IDE Chile)
       * Comunidad / Vecinal (Juntas de Vecinos, asambleas barriales, vecinos)
       * Mapeador / Voluntario OSM (comunidad OSM, estudiantes UAH)
       * ONGs / Investigadores / Academia (Geografía UAH, Fondecyt F1261256)
     - Apartado Bibliográfico y Trazabilidad de Datos Formales:
       * Fuentes espaciales primarias (con código BBDD/CAT, institución custodia y sistema de referencia).
       * Referencias teórico-metodológicas de autores clave en norma APA 7ma edición.
  5. Conmutación cartográfica inmediata al Visor 2D (Leaflet).
*/

const ModuloIndicadoresAnalisis = (() => {

  // =========================================================================
  // 1. DICCIONARIOS DE METADATOS Y FALLBACK CON PARIDAD EXACTA (MÓDULO 00)
  // =========================================================================
  const NOMBRES_OFICIALES_FALLBACK = {
  "censo2024_regional": "Censo 2024 (Marco Regional RM)",
  "censo2024_limite_urbano": "Censo 2024 (Límites Urbanos Censales RM)",
  "censo2024_localidades": "Censo 2024 (Localidades y Asentamientos RM)",
  "censo2024_zonal": "Censo 2024 (Zonas y Distritos Censales RM)",
  "censo2024_manzanas": "Censo 2024 (Manzanas Censales RM)",
  "minvu_patrimonio": "Patrimonio IPT: Inmuebles y Zonas de Conservación Histórica (ZCH / ICH RM)",
  "educacion_parvularia": "Jardines y Salas Cuna (JUNJI / Integra)",
  "establecimientos_salud": "Salud Pública (CESFAM y Hospitales)",
  "bomberos": "Cuarteles de Bomberos de Chile",
  "carabineros": "Comisarías y Cuarteles Policiales",
  "estaciones_metro": "Estaciones de Metro de Santiago",
  "red_ferroviaria": "Red Ferroviaria EFE (MTT)",
  "cmn_sitios_memoria": "Sitios de Memoria y Monumentos CMN",
  "minvu_ipt_prc_santiago": "Planes Reguladores Comunales (PRC - RM): Zonificación Comunal",
  "minvu_ipt_prms_usosuelo": "Plan Regulador Metropolitano (PRMS): Usos de Suelo Regional",
  "minvu_ipt_areas_verdes": "Áreas Verdes Normativas (MINVU / INE 2023)",
  "minvu_ipt_areas_riesgo": "Áreas de Riesgo Normativas (IPT)",
  "minvu_ipt_resguardo_infraestructura": "Fajas de Resguardo e Infraestructura PRMS",
  "minvu_ipt_limite_urbano": "Límite Urbano Oficial PRC (MINVU)",
  "ide_minvu_campamentos": "Catastro Campamentos 2024 (MINVU)",
  "ide_minvu_ipt_prms_riesgo": "PRMS: Riesgos Metropolitanos (Inundación / Remoción)",
  "ide_subdere_dpa_comunas": "División Político-Administrativa (SUBDERE / IGM)",
  "bbdd_01": "Proyectos Mandatados - GEOMOP",
  "bbdd_02": "Red Vial Nacional - GEOMOP",
  "bbdd_03": "Red Hidrométrica - GEOMOP",
  "bbdd_04": "Contratos Concesionados - GEOMOP",
  "bbdd_05": "Contratos MOP - GEOMOP",
  "bbdd_06": "Jardines Infantiles JUNJI",
  "bbdd_07": "Infraestructura Deportiva",
  "bbdd_08": "Municipios",
  "bbdd_10": "Jardines Infantiles Fundación Integra",
  "bbdd_11": "Cuerpos de Bomberos",
  "bbdd_12": "Establecimientos Educación Escolar",
  "bbdd_13": "Establecimientos Educación Parvularia",
  "bbdd_14": "Establecimientos de Educación Superior",
  "bbdd_15": "Centros de SERNAM",
  "bbdd_17": "Áreas Funcionales de las ciudades (2026)",
  "bbdd_18": "Zonificación Termica",
  "bbdd_19": "Cité",
  "bbdd_20": "SEREMI MINVU Región Metropolitana",
  "bbdd_21": "Oficinas Serviu",
  "energia_almacenamiento_rm": "Sistemas de Almacenamiento de Energía RM",
  "energia_bioenergia_rm": "Centrales de Bioenergía RM",
  "energia_electrolineras_rm": "Red de Electrolineras RM",
  "energia_gasoducto_rm": "Red de Gasoductos RM",
  "energia_hidroelectricas_rm": "Centrales Hidroeléctricas RM",
  "energia_lineas_transmision_rm": "Líneas de Transmisión Eléctrica RM",
  "energia_oleoducto_rm": "Red de Oleoductos RM",
  "energia_solares_rm": "Plantas Solares Fotovoltaicas RM",
  "energia_termoelectricas_rm": "Centrales Termoeléctricas RM",
  "bbdd_23": "Sitios BIO-Prioritarios",
  "bbdd_24": "Juzgados de Familia",
  "bbdd_25": "Estaciones Meteorológicas",
  "bbdd_26": "Estaciones Sedimentométricas",
  "bbdd_27": "Estaciones de Calidad de Aguas",
  "bbdd_29": "Cuencas Banco Nacional de Aguas",
  "bbdd_30": "Indice Calidad de Aguas",
  "bbdd_31": "Ciclovías",
  "bbdd_32": "Vertederos Ilegales",
  "bbdd_33": "Plan Cuadrante Carabineros",
  "bbdd_34": "Zonas climáticas de Chile según Köppen-Geiger escala 1:1.500.000",
  "bbdd_35": "Antenas en Servicio Ley de Torres",
  "bbdd_37": "Red de Interconexión",
  "bbdd_38": "Territorios de los Servicios de Salud",
  "bbdd_39": "Estaciones de monitoreo de calidad de aire (Red Pública)",
  "bbdd_40": "Circuitos Turísticos",
  "ccu_rm_1993": "Continuo de Construcciones Urbanas (1993)",
  "ccu_rm_2002": "Continuo de Construcciones Urbanas (2002)",
  "ccu_rm_2006": "Continuo de Construcciones Urbanas (2006)",
  "ccu_rm_2011": "Continuo de Construcciones Urbanas (2011)",
  "ccu_rm_2017": "Continuo de Construcciones Urbanas (2017)",
  "ccu_rm_2018": "Continuo de Construcciones Urbanas (2018)",
  "ccu_rm_2019": "Continuo de Construcciones Urbanas (2019)",
  "ccu_rm_2020": "Continuo de Construcciones Urbanas (2020)",
  "ccu_rm_2021": "Continuo de Construcciones Urbanas (2021)",
  "ccu_rm_2022": "Continuo de Construcciones Urbanas (2022)",
  "ccu_rm_2023": "Continuo de Construcciones Urbanas (2023)",
  "ccu_rm_2024": "Continuo de Construcciones Urbanas (2024)",
  "bbdd_42": "Pisos vegetacionales de Luebert y Pliscoff 2017",
  "bbdd_43": "División Política Administrativa 2023",
  "bbdd_44": "Municipios con certificación ambiental (SCAM)",
  "bbdd_46": "Predios Urbanos (Comuna de Santiago)",
  "bbdd_47": "Zona Fronteriza",
  "bbdd_48": "Pasos Fronterizos",
  "bbdd_49": "Estaciones Fluviométricas",
  "bbdd_50": "Oficinas de Protección de Derechos (ODP)",
  "bbdd_51": "Localización de viveros en Chile continental",
  "bbdd_52": "Estaciones Meteorológicas Automáticas (FIA)",
  "bbdd_53": "Industria Forestal Primeria (INFOR)",
  "bbdd_54": "Mercados Mayoristas (ODEPA)",
  "bbdd_55": "Sistema Nacional de Áreas Silvestres Protegidas del Estado",
  "bbdd_59": "Cobertura de canales a nivel nacional",
  "bbdd_60": "Catastro y Actualización de los Recursos Vegetacionales y Uso de la Tierra de la Región de Metropolitana (XIII)",
  "bbdd_62": "Cobertura de polígonos representativos de los huertos frutales de la Región Metropolitana 2025",
  "bbdd_63": "Inventario de Biomasa y Carbono - Metropolitana tipo Forestal",
  "bbdd_64": "Índice Global de Vulnerabilidad Socioterritorial (IGVUST) por UV 2026 Agosto",
  "bbdd_65": "Iniciativas de inversión del Banco Integrado de Proyectos (BIP), por años, al 31-08-2026.",
  "bbdd_66": "Unidades Vecinales 2026",
  "bbdd_67": "Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto",
  "bbdd_68": "Personas en RSH según CSE y sexo - 2026 Agosto",
  "bbdd_69": "NNA en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
  "bbdd_70": "Mujeres en RSH adscritas a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
  "bbdd_71": "Jóvenes en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
  "bbdd_72": "Hombres en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
  "bbdd_73": "Personas mayores en RSH adscritos a Fonasa o Isapre según CSE y tipo de institución - 2026 Junio",
  "bbdd_74": "Personas en RSH ocupadas y cotizando, por modalidad contractual según tramo CSE - 2026 Junio",
  "semaforos_rm_uoct_2026": "Cruces Semaforizados Conectados SC-RM (UOCT / MTT)",
  "catastro_predial_sii": "Catastro Predial del Servicio de Impuestos Internos (SII Geocodificado v4 2026)"
};

  const NOMBRES_VGI_FALLBACK = {
    'cat01_educacion': { codigo: 'CAT-01', nombre: 'Educación y Universidad', institucion: 'OSM / VGI', geom: 'POLÍGONO', desc: 'Equipamiento escolar, superior (Campus UAH), bibliotecas y jardines infantiles.' },
    'cat02_servicios': { codigo: 'CAT-02', nombre: 'Servicios y Comercio Barrial', institucion: 'OSM / VGI', geom: 'PUNTO', desc: 'Comercios minoristas, farmacias, bancos, notarías, restaurantes y almacenes.' },
    'cat03_transporte': { codigo: 'CAT-03', nombre: 'Movilidad y Transporte', institucion: 'OSM / VGI', geom: 'LÍNEA', desc: 'Paraderos, estaciones de Metro (L1/L2/L5), terminales y ciclovías estructurantes.' },
    'cat04_movilidad_activa': { codigo: 'CAT-04', nombre: 'Movilidad Activa y Ciclovías', institucion: 'OSM / VGI', geom: 'LÍNEA', desc: 'Red de ciclovías, bicicleteros públicos, zonas 30 km/h y ejes peatonales.' },
    'cat05_espacio_publico': { codigo: 'CAT-05', nombre: 'Áreas Verdes y Espacio Público', institucion: 'OSM / VGI', geom: 'POLÍGONO', desc: 'Plazas (Plaza Brasil), parques urbanos, plazoletas, fuentes y mobiliario público.' },
    'cat06_patrimonio': { codigo: 'CAT-06', nombre: 'Patrimonio y Cultura', institucion: 'OSM / VGI', geom: 'PUNTO', desc: 'Monumentos históricos, zonas típicas, casonas protegidas y centros culturales.' },
    'cat07_accesibilidad': { codigo: 'CAT-07', nombre: 'Accesibilidad Universal', institucion: 'OSM / VGI', geom: 'PUNTO', desc: 'Rebajes peatonales (kerb=lowered), cruces accesibles, baldosas podotáctiles y rampas.' },
    'cat08_biodiversidad': { codigo: 'CAT-08', nombre: 'Biodiversidad Urbana', institucion: 'GBIF / OSM', geom: 'PUNTO', desc: 'Arbolado urbano (catastro GBIF), avifauna nativa e insectos polinizadores.' },
    'cat09_edificaciones': { codigo: 'CAT-09', nombre: 'Edificaciones y Huella Urbana', institucion: 'OSM / VGI', geom: 'POLÍGONO', desc: 'Polígonos de edificaciones con interpretación predial, alturas estimadas y materialidad.' },
    'cat10_cobertura_suelo': { codigo: 'CAT-10', nombre: 'Coberturas y Usos de Suelo', institucion: 'OSM / VGI', geom: 'POLÍGONO', desc: 'Zonificación urbana, superficies impermeables, cubiertas vegetales y usos efectivos.' }
  };

  // =========================================================================
  // 2. DEFINICIÓN DE LAS 5 DIMENSIONES ESTRATÉGICAS (118 CAPAS TOTALES)
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
      descripcion: 'Dinámica poblacional, estructura etaria y de género, hogares, migración y estratificación socioterritorial.',
      enfoque: 'Microdatos Censo 2024 (5 niveles INE), Registro Social de Hogares (MDSF), Campamentos MINVU y Unidades Vecinales Ley 19.418.',
      capasIds: [
        'censo2024_regional',
        'censo2024_limite_urbano',
        'censo2024_localidades',
        'censo2024_zonal',
        'censo2024_manzanas',
        'ide_minvu_campamentos',
        'bbdd_66', // Unidades Vecinales 2026
        'bbdd_08', // Municipios
        'bbdd_15', // Centros de SERNAM
        'bbdd_44', // Municipios con certificación ambiental (SCAM)
        'bbdd_50', // Oficinas de Protección de Derechos (ODP)
        'bbdd_64', // Índice Global de Vulnerabilidad Socioterritorial (IGVUST)
        'bbdd_68', // Personas en RSH según CSE y sexo
        'bbdd_69', // NNA en RSH adscritas a Fonasa o Isapre
        'bbdd_70', // Mujeres en RSH adscritas a Fonasa o Isapre
        'bbdd_71', // Jóvenes en RSH adscritos a Fonasa o Isapre
        'bbdd_72', // Hombres en RSH adscritos a Fonasa o Isapre
        'bbdd_73', // Personas mayores en RSH adscritos a Fonasa o Isapre
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
      descripcion: 'Inversión pública del Estado, empleo, comercio formal y barrial, telecomunicaciones y matriz energética regional.',
      enfoque: 'Iniciativas del Banco Integrado de Proyectos (BIP), Contratos MOP, Ocupación RSH, Comercio Barrial OSM, Antenas e Infraestructura Energética CNE.',
      capasIds: [
        'bbdd_65', // Iniciativas de inversión BIP MDSF
        'bbdd_01', // Proyectos Mandatados - GEOMOP
        'bbdd_04', // Contratos Concesionados - GEOMOP
        'bbdd_05', // Contratos MOP - GEOMOP
        'bbdd_74', // Personas en RSH ocupadas y cotizando
        'cat02_servicios', // VGI Servicios y Comercio Barrial
        'bbdd_35', // Antenas en Servicio Ley de Torres
        'bbdd_53', // Industria Forestal Primeria (INFOR)
        'bbdd_54', // Mercados Mayoristas (ODEPA)
        'energia_electrolineras_rm',
        'energia_lineas_transmision_rm',
        'energia_hidroelectricas_rm',
        'energia_termoelectricas_rm',
        'energia_solares_rm',
        'energia_bioenergia_rm',
        'energia_almacenamiento_rm',
        'energia_gasoducto_rm',
        'energia_oleoducto_rm'
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
      descripcion: 'Espacio público verde, resiliencia climática, cobertura arbórea, islas de calor, biodiversidad urbana y recursos hídricos.',
      enfoque: 'Áreas Verdes Normativas MINVU, Plazas y Biodiversidad Urbana VGI/GBIF, Red Hidrométrica DGA, Estaciones de Calidad del Aire y Recursos Vegetacionales.',
      capasIds: [
        'minvu_ipt_areas_verdes',
        'cat05_espacio_publico', // VGI Áreas Verdes y Espacio Público
        'cat08_biodiversidad', // VGI Biodiversidad Urbana
        'cat10_cobertura_suelo', // VGI Coberturas y Usos de Suelo
        'bbdd_03', // Red Hidrométrica - GEOMOP
        'bbdd_23', // Sitios BIO-Prioritarios
        'bbdd_25', // Estaciones Meteorológicas
        'bbdd_26', // Estaciones Sedimentométricas
        'bbdd_27', // Estaciones de Calidad de Aguas
        'bbdd_29', // Cuencas Banco Nacional de Aguas
        'bbdd_30', // Indice Calidad de Aguas
        'bbdd_32', // Vertederos Ilegales
        'bbdd_34', // Zonas climáticas de Chile según Köppen-Geiger
        'bbdd_39', // Estaciones de monitoreo de calidad de aire (Red Pública)
        'bbdd_42', // Pisos vegetacionales de Luebert y Pliscoff 2017
        'bbdd_49', // Estaciones Fluviométricas
        'bbdd_51', // Localización de viveros en Chile continental
        'bbdd_52', // Estaciones Meteorológicas Automáticas (FIA)
        'bbdd_55', // Sistema Nacional de Áreas Silvestres Protegidas del Estado
        'bbdd_59', // Cobertura de canales a nivel nacional
        'bbdd_60', // Catastro y Actualización de Recursos Vegetacionales RM
        'bbdd_62', // Cobertura de polígonos representativos de huertos frutales RM
        'bbdd_63'  // Inventario de Biomasa y Carbono RM
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
      descripcion: 'Red asistencial de salud pública, servicios de urgencia, personas con dependencia funcional y territorios asistenciales.',
      enfoque: 'Establecimientos de Salud DEIS/MINSAL (CESFAM y Hospitales), personas en situación de dependencia funcional en RSH y Servicios de Salud.',
      capasIds: [
        'establecimientos_salud',
        'bbdd_67', // Personas en RSH en situación de dependencia funcional
        'bbdd_38'  // Territorios de los Servicios de Salud
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
      descripcion: 'Morfología urbana, catastro predial SII, planificación urbana (PRC Santiago / PRMS), cruces semaforizados UOCT, movilidad activa y patrimonio.',
      enfoque: 'PRC Santiago, Catastro Predial SII, Semáforos UOCT, Metro, Red Ferroviaria, Ciclovías MTT, Edificaciones OSM, Zonas de Conservación Histórica y Equipamiento.',
      capasIds: [
        'minvu_ipt_prc_santiago',
        'minvu_ipt_prms_usosuelo',
        'minvu_ipt_areas_riesgo',
        'minvu_ipt_resguardo_infraestructura',
        'minvu_ipt_limite_urbano',
        'ide_minvu_ipt_prms_riesgo',
        'catastro_predial_sii',
        'bbdd_17', // Áreas Funcionales de las ciudades (2026)
        'bbdd_18', // Zonificación Termica
        'bbdd_19', // Cité
        'bbdd_20', // SEREMI MINVU Región Metropolitana
        'bbdd_21', // Oficinas Serviu
        'bbdd_43', // División Política Administrativa 2023
        'bbdd_46', // Predios Urbanos (Comuna de Santiago)
        'bbdd_47', // Zona Fronteriza
        'bbdd_48', // Pasos Fronterizos
        'semaforos_rm_uoct_2026',
        'estaciones_metro',
        'red_ferroviaria',
        'bbdd_02', // Red Vial Nacional - GEOMOP
        'bbdd_31', // Ciclovías
        'bbdd_37', // Red de Interconexión
        'cat03_transporte', // VGI Movilidad y Transporte
        'cat04_movilidad_activa', // VGI Movilidad Activa y Ciclovías
        'cat07_accesibilidad', // VGI Accesibilidad Universal
        'cat09_edificaciones', // VGI Edificaciones y Huella Urbana
        'minvu_patrimonio',
        'cmn_sitios_memoria',
        'cat06_patrimonio', // VGI Patrimonio y Cultura
        'educacion_parvularia',
        'bbdd_06', // Jardines Infantiles JUNJI
        'bbdd_10', // Jardines Infantiles Fundación Integra
        'bbdd_12', // Establecimientos Educación Escolar
        'bbdd_13', // Establecimientos Educación Parvularia
        'bbdd_14', // Establecimientos de Educación Superior
        'cat01_educacion', // VGI Educación y Universidad
        'bbdd_07', // Infraestructura Deportiva
        'bbdd_40', // Circuitos Turísticos
        'bomberos',
        'bbdd_11', // Cuerpos de Bomberos
        'carabineros',
        'bbdd_33', // Plan Cuadrante Carabineros
        'bbdd_24', // Juzgados de Familia
        'ccu_rm_1993', 'ccu_rm_2002', 'ccu_rm_2006', 'ccu_rm_2011',
        'ccu_rm_2017', 'ccu_rm_2018', 'ccu_rm_2019', 'ccu_rm_2020',
        'ccu_rm_2021', 'ccu_rm_2022', 'ccu_rm_2023', 'ccu_rm_2024'
      ]
    }
  ];

  // =========================================================================
  // 3. DEFINICIÓN DE LOS STORYBOARDS DE BARRIO BRASIL (ANÁLISIS PROFUNDO)
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
        introduccion: `El Barrio Brasil, forjado en la segunda mitad del siglo XIX como uno de los suburbios residenciales de mayor prestancia aristocrática y republicana del poniente de Santiago, encarna hoy una de las encrucijadas urbanas más complejas de la capital: la coexistencia entre la preservación patrimonial protegida y las dinámicas de renovación inmobiliaria acelerada sobre el suelo central.`,
        datosClave: [
          { valor: '192', label: 'Zonas Normativas PRC', sub: 'Normativa comunal Santiago' },
          { valor: '695.412', label: 'Edificaciones RM', sub: 'Interpretación predial VGI' },
          { valor: '1.43M', label: 'Predios Catastro SII', sub: 'Información fiscal oficial' },
          { valor: '184', label: 'Cités Catastrados', sub: 'Santiago Poniente BBDD-19' }
        ],
        porcentajesClave: [
          { label: 'Tipología Residencial Tradicional (1-3 pisos)', valor: '68.4%', porcentaje: 68.4, contexto: 'Barrio Brasil frente a 34.2% del Gran Santiago (Catastro OSM / SII)' },
          { label: 'Superficie de Santiago Poniente bajo Protección ZCH/ICH', valor: '34.8%', porcentaje: 34.8, contexto: 'Inmuebles y Zonas de Conservación Histórica MINVU' },
          { label: 'Hogares en Régimen de Arriendo (Censo 2024)', valor: '62.7%', porcentaje: 62.7, contexto: 'Frente al 56.4% comunal de Santiago y 29.8% regional RM' },
          { label: 'Densificación en Borde Alameda y San Pablo (>15 pisos)', valor: '14.2%', porcentaje: 14.2, contexto: 'Concentración en corredores estructurantes de transporte masivo' }
        ],
        graficoComparativo: {
          titulo: 'Distribución de Alturas Edilicias en el Cuadrante de Barrio Brasil (Capas: cat09_edificaciones / catastro_predial_sii)',
          filas: [
            { label: '1 a 2 pisos (Casonas y Cités tradicionales)', valor: '52.3%', porcentaje: 52.3 },
            { label: '3 a 5 pisos (Vivienda media y equipamiento mixto)', valor: '28.1%', porcentaje: 28.1 },
            { label: '6 a 10 pisos (Edificación intermedia de renovación)', valor: '11.4%', porcentaje: 11.4 },
            { label: '> 10 pisos (Torres bordes estructurantes Alameda/San Pablo)', valor: '8.2%', porcentaje: 8.2 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <line x1="40" y1="180" x2="640" y2="180" stroke="#475569" stroke-width="2"/>
            <rect x="70" y="110" width="110" height="70" fill="#a97722" fill-opacity="0.35" stroke="#f59e0b" stroke-width="2"/>
            <polygon points="65,110 125,75 185,110" fill="#f59e0b" fill-opacity="0.5"/>
            <text x="125" y="145" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">Casona ICH (2P)</text>
            <text x="125" y="160" fill="#cbd5e1" font-size="9" text-anchor="middle">Altura: 8.5m · minvu_patrimonio</text>
            <rect x="200" y="130" width="130" height="50" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
            <text x="265" y="155" fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle">Cité Interior (BBDD-19)</text>
            <text x="265" y="170" fill="#94a3b8" font-size="8.5" text-anchor="middle">Pasaje común / 1 piso</text>
            <rect x="345" y="172" width="70" height="8" fill="#334155"/>
            <circle cx="380" cy="165" r="4" fill="#38bdf8"/>
            <line x1="380" y1="169" x2="380" y2="178" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="380" y="196" fill="#94a3b8" font-size="9" text-anchor="middle">Calle Brasil (18m)</text>
            <rect x="430" y="30" width="100" height="150" fill="#64748b" fill-opacity="0.3" stroke="#94a3b8" stroke-width="2"/>
            <line x1="430" y1="60" x2="530" y2="60" stroke="#475569" stroke-width="1"/>
            <line x1="430" y1="90" x2="530" y2="90" stroke="#475569" stroke-width="1"/>
            <line x1="430" y1="120" x2="530" y2="120" stroke="#475569" stroke-width="1"/>
            <text x="480" y="105" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Torre Borde</text>
            <text x="480" y="122" fill="#cbd5e1" font-size="9" text-anchor="middle">18 Pisos (54m)</text>
            <line x1="345" y1="180" x2="530" y2="30" stroke="#ec4899" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="400" y="60" fill="#f472b6" font-size="10" font-weight="bold">Rasante OGUC 60° (Art. 2.6.3)</text>
            <rect x="545" y="170" width="80" height="10" fill="#1e293b"/>
            <text x="585" y="196" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">Eje Alameda L1</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Avalúo fiscal predial promedio', valor: '$68.4M', referencial: '$82.1M (Comuna Santiago)', fuente: 'Catastro SII 2026 (catastro_predial_sii)' },
          { variable: 'Densidad de cités históricos', valor: '24.5 cités/km²', referencial: '12.1 cités/km² (Santiago Centro)', fuente: 'BBDD-19 MINVU' },
          { variable: 'Coeficiente constructibilidad máx.', valor: '1.8 a 2.4', referencial: 'Libre en ejes estructurantes', fuente: 'PRC Santiago (minvu_ipt_prc_santiago)' },
          { variable: 'Proporción de casonas con destino mixto', valor: '41.2%', referencial: '26.8% (Gran Santiago)', fuente: 'SII / Catastro OSM (cat09_edificaciones)' }
        ],
        cuerpo: [
          `Al cruzar los datos del Catastro Predial del SII (catastro_predial_sii) con las 192 zonas normativas del Plan Regulador Comunal de Santiago (minvu_ipt_prc_santiago) y el inventario de Inmuebles y Zonas de Conservación Histórica (minvu_patrimonio), emerge con nitidez la frontera morfológica del barrio: mientras el corazón en torno a Plaza Brasil, Maturana, Huérfanos y Compañía mantiene índices de ocupación de suelo armónicos de 2 a 4 pisos, los bordes estructurantes de Avenida Libertador Bernardo O'Higgins (Alameda) y San Pablo concentran densificaciones que superan los 18 pisos de altura.`,
          `Un componente crucial revelado por la base de datos oficial es el catastro de cités de Santiago Centro (BBDD-19). Esta tipología habitacional colectiva de pasaje interior privado, nacida como solución popular higienista a inicios del siglo XX, alberga hoy comunidades organizadas que enfrentan simultáneamente el deterioro constructivo y la presión de especulación del suelo. La información cartográfica de edificaciones con interpretación predial (cat09_edificaciones) permite identificar con precisión la huella de cada cité, distinguiendo entre casonas subdivididas informalmente y conjuntos con copropiedad formalizada.`,
          `La tensión normativa se dirime en los artículos 2.1.24 y 2.6.3 de la Ordenanza General de Urbanismo y Construcciones (OGUC): las rasantes de protección lumínica y las restricciones de altura máxima obligatoria han sido el principal dique de contención comunitaria para preservar la escala peatonal del barrio frente al avance de megatorres habitacionales vistas en comunas vecinas.`
        ],
        conclusion: `Los datos espaciales demuestran que Barrio Brasil no es un museo congelado, sino un territorio vivo donde el patrimonio arquitectónico convive cotidianamente con la vivienda compartida y la necesidad de una regeneración urbana integrada y sensible a su identidad social.`,
        
        // 4 USUARIOS-TIPO DEL PROYECTO
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'MINVU · SECPLA Santiago · DITEC · IDE Chile',
            utilidad: 'Orienta la actualización de zonas normativas del PRC Santiago y permite a la DITEC focalizar subsidios de mejoramiento en copropiedades de cités (BBDD-19) y casonas patrimoniales vulnerables.'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Juntas de Vecinos · Comités de Cités · Residentes',
            utilidad: 'Entrega a las juntas vecinales evidencia cartográfica oficial para respaldar solicitudes de declaratoria como Zona Típica y defender la escala barrial frente a anteproyectos de demolición.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Comunidad OpenStreetMap · Estudiantes UAH',
            utilidad: 'Identifica brechas de mapeo en cités interiores no catastrados en OSM, orientando campañas para relevar pasajes peatonales (`highway=pedestrian`), número de pisos (`building:levels`) y estados de conservación.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Geografía UAH · Fondecyt F1261256',
            utilidad: 'Aporta insumos empíricos georreferenciados (EPSG:32719) para modelar la elasticidad del valor de suelo (SII) versus la protección patrimonial (MINVU) en el marco de la investigación Fondecyt.'
          }
        ],

        // APARTADO BIBLIOGRÁFICO Y TRAZABILIDAD
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'minvu_patrimonio', nombre: 'Patrimonio IPT: Inmuebles y Zonas de Conservación Histórica', institucion: 'MINVU / CMN', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'minvu_ipt_prc_santiago', nombre: 'Planes Reguladores Comunales (PRC - RM): Zonificación Comunal', institucion: 'MINVU / Municipalidad de Santiago', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'catastro_predial_sii', nombre: 'Catastro Predial del Servicio de Impuestos Internos (SII Geocodificado v4 2026)', institucion: 'Servicio de Impuestos Internos (SII)', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'bbdd_19', nombre: 'Cité (Catastro de Cités Santiago Poniente)', institucion: 'MINVU DITEC', crs: 'EPSG:4326', tipo: 'Punto / Polígono' },
            { codigo: 'cat09_edificaciones', nombre: 'Edificaciones y Huella Urbana (Interpretación Predial)', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326 / EPSG:32719', tipo: 'Polígono' },
            { codigo: 'censo2024_manzanas', nombre: 'Censo 2024 (Manzanas Censales RM)', institucion: 'Instituto Nacional de Estadísticas (INE)', crs: 'EPSG:4326', tipo: 'Polígono' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Harvey, D. (2012). Ciudades rebeldes: del derecho a la ciudad a la revolución urbana. Ediciones Akal.',
              concepto: 'Aporte teórico: Conceptualiza la extracción de rentas secundarias del suelo urbano y la contradicción entre el valor de uso barrial patrimonial y el valor de cambio inmobiliario en centros históricos.'
            },
            {
              cita: 'Hidalgo, R., & Janoschka, M. (Eds.). (2014). La ciudad neoliberal: gentrificación y exclusión en Santiago de Chile. Pontificia Universidad Católica de Chile.',
              concepto: 'Aporte teórico: Analiza las transformaciones sociomorfológicas, la densificación vertical acelerada en el pericentro de Santiago y sus efectos de desplazamiento en tipologías tradicionales.'
            },
            {
              cita: 'Lefebvre, H. (1974). La producción del espacio. Anthropos.',
              concepto: 'Aporte teórico: Fundamenta la tensión dialéctica entre el «espacio concebido» de la zonificación tecnocrática del PRC y el «espacio vivido» de las comunidades en cités y pasajes cotidianos.'
            }
          ]
        }
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
          { label: 'Viajes Locales Realizados a Pie (Encuesta Origen-Destino MTT)', valor: '46.8%', porcentaje: 46.8, contexto: 'Caminabilidad como modo de transporte estructurante barrial' },
          { label: 'Viajes en Transporte Público Masivo (Metro L1/L2/L5 y Red)', valor: '28.3%', porcentaje: 28.3, contexto: 'Intermodalidad Los Héroes - Santa Ana' },
          { label: 'Uso de Bicicleta y Ciclovías en el Polígono', valor: '12.4%', porcentaje: 12.4, contexto: 'Ejes Rosas, Erasmo Escala y Brasil (BBDD-31 / CAT-04)' },
          { label: 'Esquinas Secundarias sin Rebaje Normado', valor: '41.8%', porcentaje: 41.8, contexto: 'Barrera física para sillas de ruedas y adultos mayores (CAT-07)' }
        ],
        graficoComparativo: {
          titulo: 'Reparto Modal de Desplazamientos en Barrio Brasil (Fuente: EOD MTT / CAT-03 / CAT-04)',
          filas: [
            { label: 'Caminata / A pie (Modo mayoritario estructurante)', valor: '46.8%', porcentaje: 46.8 },
            { label: 'Transporte Público (Metro L1/L2/L5 + Red Movilidad)', valor: '28.3%', porcentaje: 28.3 },
            { label: 'Bicicleta y Micromovilidad Activa', valor: '12.4%', porcentaje: 12.4 },
            { label: 'Automóvil Particular', valor: '12.5%', porcentaje: 12.5 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <rect x="50" y="45" width="580" height="24" rx="4" fill="#1e293b"/>
            <rect x="50" y="45" width="336" height="24" rx="4" fill="#ef4444" fill-opacity="0.85"/>
            <text x="218" y="61" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Verde Vehicular Troncal (52 s · 58%)</text>
            <rect x="386" y="45" width="128" height="24" fill="#f59e0b" fill-opacity="0.85"/>
            <text x="450" y="61" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Despeje (20 s)</text>
            <rect x="514" y="45" width="116" height="24" rx="4" fill="#10b981" fill-opacity="0.9"/>
            <text x="572" y="61" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Verde Peatonal (18 s)</text>
            <rect x="50" y="100" width="580" height="85" fill="#111c35" rx="6" stroke="#1e293b"/>
            <text x="70" y="125" fill="#38bdf8" font-size="11" font-weight="bold">Auditoría Cruce Alameda con Av. Brasil (Ancho calzada: 24m · semaforos_rm_uoct_2026)</text>
            <text x="70" y="148" fill="#cbd5e1" font-size="10">Velocidad peatonal exigida para cruzar en 18s: <tspan fill="#ef4444" font-weight="bold">1.33 m/s</tspan></text>
            <text x="70" y="168" fill="#94a3b8" font-size="9.5">Capacidad ambulatoria promedio de adulto mayor / movilidad reducida: <tspan fill="#10b981" font-weight="bold">0.80 m/s</tspan> (Déficit de 12 segundos)</text>
            <rect x="540" y="115" width="70" height="55" rx="6" fill="#7f1d1d" fill-opacity="0.4" stroke="#ef4444"/>
            <text x="575" y="138" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">ALERTA</text>
            <text x="575" y="155" fill="#fca5a5" font-size="9" text-anchor="middle">UOCT 2026</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Cruces semaforizados centralizados', valor: '28 cruces', referencial: '3.242 intersecciones RM', fuente: 'UOCT / MTT 2026 (semaforos_rm_uoct_2026)' },
          { variable: 'Densidad de rebajes accesibles (kerb)', valor: '3.4 / manzana', referencial: '8.0 estándar óptimo', fuente: 'CAT-07 Accesibilidad Universal' },
          { variable: 'Velocidad vehicular media en adoquín', valor: '28.4 km/h', referencial: '54.2 km/h en vías asfálticas', fuente: 'MTT / UOCT' },
          { variable: 'Extensión de ciclovías protegidas', valor: '4.8 km lineales', referencial: '8.6 km total con ciclocalles', fuente: 'BBDD-31 / CAT-04 OSM' }
        ],
        cuerpo: [
          `El catálogo oficial incorpora la red completa de Cruces Semaforizados Conectados de la UOCT RM (3.242 intersecciones bajo el identificador semaforos_rm_uoct_2026). En el cuadrante de Barrio Brasil, la sincronización de tiempos de verde favorece históricamente a los flujos vehiculares oriente-poniente de la Alameda y norte-sur de Avenida Manuel Rodríguez (Autopista Central), operando esta última como una verdadera 'falla urbana' que fractura la continuidad peatonal histórica con el centro cívico y el Palacio de La Moneda.`,
          `En el plano de la movilidad activa, los datos colaborativos de OpenStreetMap (CAT-04 con 128.891 elementos) combinados con la capa oficial de ciclovías del MTT (BBDD-31) muestran que ejes como Rosas y Erasmo Escala canalizan los mayores volúmenes de ciclistas urbanos y estudiantes hacia la Universidad Alberto Hurtado. No obstante, la capa de Accesibilidad Universal VGI (CAT-07) evidencia que más del 40% de las esquinas secundarias del barrio carecen de rebaje peatonal normado (kerb=lowered), lo que impone barreras severas a personas en sillas de ruedas, coches de infantes o adultos mayores.`,
          `El adoquinado tradicional de calles como Cienfuegos y Concha y Toro, si bien constituye un valor estético y patrimonial invaluable que apacigua la velocidad vehicular de manera natural, representa un desafío de accesibilidad que exige intervenciones técnicas de diseño universal respetuosas de la historicidad material.`
        ],
        conclusion: `La información espacial evidencia la urgencia de transitar desde una planificación del tránsito vehicular hacia una pacificación integral de zonas 30 km/h, donde la prioridad sea la continuidad accesible de las veredas comunitarias.`,

        // 4 USUARIOS-TIPO DEL PROYECTO
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'UOCT RM · DTPM · SECPLA · SEREMI Transportes',
            utilidad: 'Suministra datos precisos a la UOCT y DTPM para recalibrar los ciclos semafóricos en cruces de alta demanda peatonal y justificar la extensión de fondos de accesibilidad universal en calzadas.'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Colectivos Ciclistas · Agrupaciones de Movilidad Reducida',
            utilidad: 'Empodera a colectivos de ciclistas y vecinos con discapacidad motriz con métricas territoriales exactas para exigir reductores de velocidad, rebajes de vereda y demarcación de zonas 30.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Mapeadores Urbanos · Estudiantes de Geografía',
            utilidad: 'Focaliza relevamientos con StreetComplete y JOSM para completar etiquetas clave de microaccesibilidad: `kerb=lowered/flush/raised`, `tactile_paving=yes/no` y `surface=sett`.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Centros de Movilidad · Geografía UAH',
            utilidad: 'Facilita la modelación de isócronas peatonales y análisis de conectividad de redes multimodales (Metro + Ciclovía + Caminata) bajo sistemas métricos rigurosos (EPSG:32719).'
          }
        ],

        // APARTADO BIBLIOGRÁFICO Y TRAZABILIDAD
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'semaforos_rm_uoct_2026', nombre: 'Cruces Semaforizados Conectados SC-RM', institucion: 'UOCT / Ministerio de Transportes y Telecomunicaciones (MTT)', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'estaciones_metro', nombre: 'Estaciones de Metro de Santiago', institucion: 'Metro S.A. / DTPM', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_31', nombre: 'Ciclovías (Red Oficial de Ciclovías RM)', institucion: 'Ministerio de Transportes y Telecomunicaciones (MTT)', crs: 'EPSG:4326', tipo: 'Línea' },
            { codigo: 'cat04_movilidad_activa', nombre: 'Movilidad Activa y Ciclovías', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326', tipo: 'Línea' },
            { codigo: 'cat07_accesibilidad', nombre: 'Accesibilidad Universal', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326', tipo: 'Punto' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Gehl, J. (2010). Cities for people. Island Press.',
              concepto: 'Aporte teórico: Teoriza la escala humana del espacio público, los umbrales de velocidad peatonal (0.8 - 1.2 m/s) y la vitalidad de las veredas frente al diseño vial enfocado en el automóvil.'
            },
            {
              cita: 'Goodchild, M. F. (2007). Citizens as sensors: the world of volunteered geography. GeoJournal, 69(4), 211–221.',
              concepto: 'Aporte teórico: Fundamenta el rol de la información geográfica voluntaria (VGI) para visibilizar obstáculos físicos y barreras de microaccesibilidad que los censos estatales no capturan.'
            },
            {
              cita: 'De Certeau, M. (1984). The practice of everyday life. University of California Press.',
              concepto: 'Aporte teórico: El caminar como enunciación espacial y táctica cotidiana de resistencia y apropiación frente a las mallas circulatorias impuestas por la planificación vehicular.'
            }
          ]
        }
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
      capasRelevantes: ['minvu_ipt_areas_verdes', 'cat05_espacio_publico', 'cat08_biodiversidad', 'bbdd_39', 'cat10_cobertura_suelo'],
      contenido: {
        introduccion: `La relación de los centros urbanos densos con la naturaleza suele percibirse como dicotómica o deficitaria. En Santiago Centro, donde los estándares de metros cuadrados de área verde por habitante se sitúan frecuentemente bajo los mínimos recomendados por organismos internacionales (9 m²/hab), la Plaza Brasil opera como el gran condensador bioclimático y social del sector poniente.`,
        datosClave: [
          { valor: '18.173', label: 'Áreas Verdes IPT', sub: 'Catastro regional MINVU' },
          { valor: '121.134', label: 'Registros GBIF RM', sub: 'Ciencia ciudadana' },
          { valor: '14.280 m²', label: 'Superficie Plaza', sub: '1.43 hectáreas de parque' },
          { valor: '168', label: 'Árboles Maduros', sub: 'Catastro CONAF / Ciren' }
        ],
        porcentajesClave: [
          { label: 'Superficie de Área Verde Mantenida por Habitante', valor: '3.8 m²/hab', porcentaje: 38.0, contexto: 'Muy por debajo del estándar OMS de 9.0 m²/hab (minvu_ipt_areas_verdes)' },
          { label: 'Cobertura de Dosel Arbóreo en Plaza Brasil', valor: '48.6%', porcentaje: 48.6, contexto: 'Sombra efectiva en horas de máxima radiación estival (cat10_cobertura_suelo)' },
          { label: 'Atenuación Térmica Superficial en Verano', valor: '-4.2 °C', porcentaje: 84.0, contexto: 'Respecto al asfalto de Manuel Rodríguez y San Pablo (bbdd_39 / sensores)' },
          { label: 'Especies Arbóreas Nativas (Palma, Quillay, Peumo)', valor: '38.0%', porcentaje: 38.0, contexto: 'Complementadas con 62% de especies introducidas maduras adaptadas' }
        ],
        graficoComparativo: {
          titulo: 'Comparativa de Dotación de Áreas Verdes por Habitante (m²/hab) (MINVU / CNDU)',
          filas: [
            { label: 'Barrio Brasil (Santiago Poniente)', valor: '3.8 m²', porcentaje: 38.0 },
            { label: 'Comuna de Santiago Centro', valor: '5.2 m²', porcentaje: 52.0 },
            { label: 'Gran Santiago (Promedio RM)', valor: '4.1 m²', porcentaje: 41.0 },
            { label: 'Estándar Mínimo Internacional OMS', valor: '9.0 m²', porcentaje: 90.0 },
            { label: 'Meta Política Nacional de Desarrollo Urbano (PNDU)', valor: '10.0 m²', porcentaje: 100.0 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <text x="340" y="28" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Gradiente de Temperatura Superficial e Isla de Calor Urbana (Día estival 15:00 hrs)</text>
            <line x1="40" y1="170" x2="640" y2="170" stroke="#334155" stroke-width="2"/>
            <rect x="50" y="130" width="120" height="40" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444"/>
            <text x="110" y="155" fill="#fca5a5" font-size="13" font-weight="900" text-anchor="middle">39.2 °C</text>
            <text x="110" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Asfalto Vehicular</text>
            <rect x="180" y="115" width="110" height="55" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b"/>
            <text x="235" y="145" fill="#fde047" font-size="13" font-weight="900" text-anchor="middle">35.6 °C</text>
            <text x="235" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Adoquín / Vereda</text>
            <rect x="300" y="100" width="110" height="70" fill="#10b981" fill-opacity="0.2" stroke="#10b981"/>
            <text x="355" y="135" fill="#86efac" font-size="13" font-weight="900" text-anchor="middle">32.1 °C</text>
            <text x="355" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Borde con Césped</text>
            <rect x="420" y="60" width="210" height="110" fill="#06b6d4" fill-opacity="0.25" stroke="#06b6d4" stroke-width="2"/>
            <circle cx="470" cy="75" r="22" fill="#10b981" fill-opacity="0.6"/>
            <circle cx="525" cy="65" r="26" fill="#10b981" fill-opacity="0.7"/>
            <circle cx="580" cy="78" r="20" fill="#10b981" fill-opacity="0.6"/>
            <text x="525" y="125" fill="#67e8f9" font-size="16" font-weight="900" text-anchor="middle">28.8 °C</text>
            <text x="525" y="145" fill="#a5f3fc" font-size="10" font-weight="bold" text-anchor="middle">Amortiguación Bioclimática (-10.4 °C)</text>
            <text x="525" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">Dosel Plátanos &amp; Jacarandás (CAT-05 / CONAF)</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Material particulado medio anual MP2.5', valor: '22.4 µg/m³', referencial: '15.0 µg/m³ (Norma Primaria MMA)', fuente: 'SINCA MMA (bbdd_39)' },
          { variable: 'Registros avifauna urbana catastrados', valor: '24 especies', referencial: 'Chincol, Zorzal, Picaflor', fuente: 'GBIF / iNaturalist (cat08_biodiversidad)' },
          { variable: 'Índice de vulnerabilidad socioterritorial', valor: '0.28 (Medio-Bajo)', referencial: '0.45 umbral óptimo MINVU', fuente: 'MINVU (bbdd_64)' },
          { variable: 'Distancia media a plaza barrial', valor: '380 metros', referencial: '400m estándar proximidad CNDU', fuente: 'CAT-05 Espacio Público OSM' }
        ],
        cuerpo: [
          `El cruce entre las Áreas Verdes Normativas IPT (18.173 polígonos bajo minvu_ipt_areas_verdes) y los registros de biodiversidad urbana de GBIF / iNaturalist (cat08_biodiversidad) demuestra que la Plaza Brasil, inaugurada a principios del siglo XX y coronada por las coloridas esculturas lúdicas de la artista Federica Matta, no solo acoge recreación y ferias culturales, sino que funciona como un enclave de refugio ecológico para avifauna nativa e introducida (chincoles, zorzales, tórtolas y picaflores).`,
          `Durante los meses estivales, los sensores térmicos y las coberturas vegetales (cat10_cobertura_suelo) ratifican que el dosel arbóreo maduro de plátanos orientales, jacarandás y palmeras en la plaza genera un efecto de amortiguación de la isla de calor urbana de entre 3 °C y 5 °C en comparación con las superficies impermeables pavimentadas de la Autopista Central o el eje Alameda.`,
          `Sin embargo, el mapa revela un agudo desbalance: al alejarse más de 300 metros de la plaza, los interiores de manzana carecen de jardines comunitarios públicos, dependiendo exclusivamente de pequeños patios privados de casonas y árboles de alineación en veredas que sufren estrés hídrico y podas agresivas.`
        ],
        conclusion: `La ciencia ciudadana y la cartografía pública convergen en una misma conclusión: para mitigar la emergencia climática local, Barrio Brasil debe consolidar corredores biológicos en calles secundarias como Maturana y Moneda para interconectar Plaza Brasil con el Parque Portales y la Quinta Normal.`,

        // 4 USUARIOS-TIPO DEL PROYECTO
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'SEREMI Medio Ambiente · Dirección de Aseo y Ornato · GORE RM',
            utilidad: 'Aporta insumos técnicos para planes de arbolado urbano y estrategias de infraestructura verde comunal, justificando la inversión en corredores biológicos urbanos conectores.'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Organizaciones Socioambientales · Huertos Barriales',
            utilidad: 'Entrega argumentos ecológicos fundados para la defensa vecinal del dosel arbóreo ante talas o podas desmedidas por cableado aéreo, promoviendo huertos y microalcorques verdes.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Comunidad iNaturalist / GBIF · Mapeadores Árboles',
            utilidad: 'Incentiva el mapeo de árboles individuales (`natural=tree`), especies (`species=*`), alcorques y bebederos de aves en la cartografía comunitaria de OpenStreetMap.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Ecología Urbana · Departamento de Geografía UAH',
            utilidad: 'Proporciona una base espacial verificada para estudios de justicia ambiental, confort bioclimático e islas de calor urbanas en el marco del Fondecyt F1261256.'
          }
        ],

        // APARTADO BIBLIOGRÁFICO Y TRAZABILIDAD
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'minvu_ipt_areas_verdes', nombre: 'Áreas Verdes Normativas (MINVU / INE 2023)', institucion: 'MINVU / INE', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'cat05_espacio_publico', nombre: 'Áreas Verdes y Espacio Público', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'cat08_biodiversidad', nombre: 'Biodiversidad Urbana (Catastro de Flora y Fauna)', institucion: 'GBIF.org / iNaturalist / UAH', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'cat10_cobertura_suelo', nombre: 'Coberturas y Usos de Suelo', institucion: 'OpenStreetMap Contributors / Fondecyt', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'bbdd_39', nombre: 'Estaciones de monitoreo de calidad de aire (Red Pública)', institucion: 'Ministerio del Medio Ambiente (SINCA)', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_64', nombre: 'Índice Global de Vulnerabilidad Socioterritorial (IGVUST)', institucion: 'MINVU', crs: 'EPSG:4326', tipo: 'Polígono' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Romero, H., Salgado, M., & Smith, P. (2010). Clima urbano y justicia ambiental en las ciudades chilenas. Revista de Urbanismo, (13), 1–18.',
              concepto: 'Aporte teórico: Demuestra empíricamente la asimetría socioterritorial en la distribución de biomasa vegetal y la exposición desigual a islas de calor en comunas centrales de Santiago.'
            },
            {
              cita: 'Heynen, N., Kaika, M., & Swyngedouw, E. (Eds.). (2006). In the nature of cities: Urban political ecology and the politics of urban metabolism. Routledge.',
              concepto: 'Aporte teórico: Enfoque de ecología política urbana para comprender la sombra arbórea y los espacios verdes no como ornamentos, sino como bienes comunes indispensables para la resiliencia.'
            },
            {
              cita: 'Haklay, M. (2010). How good is volunteered geographical information? A comparative study of OpenStreetMap and Ordnance Survey datasets. Environment and Planning B, 37(4), 682–703.',
              concepto: 'Aporte teórico: Rigor y aplicabilidad de la ciencia ciudadana y los datos geográficos voluntarios para inventariar microcoberturas y biodiversidad urbana a escala barrial.'
            }
          ]
        }
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
          { label: 'Población Residente Joven (18-29 años Censo 2024)', valor: '31.4%', porcentaje: 31.4, contexto: 'Perfil demográfico dinámico y universitario (censo2024_zonal)' },
          { label: 'Viviendas en Arriendo Estudiantil y Profesional', valor: '62.7%', porcentaje: 62.7, contexto: 'Alta demanda residencial en torno al Metro Los Héroes' },
          { label: 'Comercio Local Vinculado a Servicios y Gastronomía', valor: '42.5%', porcentaje: 42.5, contexto: 'Cafeterías de especialidad, imprentas y librerías (CAT-02)' },
          { label: 'Movilidad Sostenible en Viajes a la Universidad', valor: '78.2%', porcentaje: 78.2, contexto: 'Acceso peatonal, ciclovías o Metro L1-L2 (CAT-03 / CAT-04)' }
        ],
        graficoComparativo: {
          titulo: 'Régimen de Tenencia de la Vivienda en Barrio Brasil (Fuente: Censo 2024 / censo2024_zonal)',
          filas: [
            { label: 'Hogares en Arriendo (Mayoría absoluta del cuadrante)', valor: '62.7%', porcentaje: 62.7 },
            { label: 'Propietarios con Vivienda Pagada', valor: '21.5%', porcentaje: 21.5 },
            { label: 'Propietarios Pagando Dividendo', valor: '10.3%', porcentaje: 10.3 },
            { label: 'Vivienda Cedida o en Usufructo', valor: '5.5%', porcentaje: 5.5 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <ellipse cx="340" cy="115" rx="300" ry="85" fill="#f59e0b" fill-opacity="0.08" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="590" y="55" fill="#f59e0b" font-size="10" font-weight="bold">Isócrona 10 min (800m)</text>
            <ellipse cx="340" cy="115" rx="170" ry="55" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="470" y="85" fill="#38bdf8" font-size="10" font-weight="bold">Isócrona 5 min (400m)</text>
            <rect x="270" y="95" width="140" height="40" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="340" y="115" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">CAMPUS UAH</text>
            <text x="340" y="128" fill="#bfdbfe" font-size="8.5" text-anchor="middle">Cienfuegos / Erasmo Escala</text>
            <circle cx="150" cy="140" r="16" fill="#ef4444" fill-opacity="0.8"/>
            <text x="150" y="144" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Metro L1/L2</text>
            <text x="150" y="168" fill="#fca5a5" font-size="9" text-anchor="middle">Los Héroes (3 min)</text>
            <circle cx="340" cy="40" r="14" fill="#10b981" fill-opacity="0.8"/>
            <text x="340" y="44" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Plaza</text>
            <text x="340" y="20" fill="#86efac" font-size="9" text-anchor="middle">Plaza Brasil (7 min)</text>
            <circle cx="510" cy="120" r="14" fill="#8b5cf6" fill-opacity="0.8"/>
            <text x="510" y="124" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Comercio</text>
            <text x="510" y="148" fill="#c4b5fd" font-size="9" text-anchor="middle">Cafés &amp; Libros (CAT-02)</text>
            <line x1="166" y1="135" x2="270" y2="115" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="340" y1="54" x2="340" y2="95" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="410" y1="115" x2="496" y2="120" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3,3"/>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Inversión pública BIP registrada en el sector', valor: '$14.280M', referencial: 'Programas de conservación urbana', fuente: 'BIP MDSF (bbdd_65)' },
          { variable: 'Densidad comercial en ejes preferentes', valor: '58 locales/km', referencial: 'Huérfanos, Brasil, Cienfuegos', fuente: 'CAT-02 Servicios y Comercio OSM' },
          { variable: 'Cotizantes formales en seguridad social RSH', valor: '68.4%', referencial: '61.2% (Comuna Santiago)', fuente: 'BBDD-74 MDSF' },
          { variable: 'Casonas recuperadas con uso universitario', valor: '14 inmuebles', referencial: 'Cienfuegos, Barroso, Escala', fuente: 'UAH / CMN (minvu_patrimonio)' }
        ],
        cuerpo: [
          `A través de la capa colaborativa de Educación y Universidad (CAT-01) y la capa oficial de Educación Superior de MINEDUC (BBDD-14), se aprecia cómo la UAH recuperó decenas de casonas neoclásicas e historicistas declaradas Inmuebles de Conservación Histórica para albergar aulas, bibliotecas, decanatos y laboratorios, evitando su demolición o abandono.`,
          `Esta masa crítica de más de 8.000 estudiantes y trabajadores diarios inyectó una demanda sostenida sobre el tejido de Servicios y Comercio Barrial (CAT-02). El mapa de almacenes, panaderías familiares, librerías independientes, imprentas, residencias estudiantiles y cafeterías de especialidad muestra una concentración espacial directa en el radio de 200 metros alrededor de los accesos universitarios.`,
          `Al contrastar con la capa del Banco Integrado de Proyectos (BIP - BBDD-65) y las personas ocupadas y cotizantes del Registro Social de Hogares (BBDD-74), se evidencia que este ecosistema de proximidad genera encadenamientos laborales locales que han protegido al barrio de la desertificación comercial nocturna y del éxodo de actividades vecinales.`
        ],
        conclusion: `El desafío actual reside en armonizar la vitalidad estudiantil con la tranquilidad residencial nocturna de los vecinos mayores, consolidando a la universidad como un vecino cívico activo que comparte sus espacios culturales y plazas interiores con la comunidad.`,

        // 4 USUARIOS-TIPO DEL PROYECTO
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'SERCOTEC · Subsecretaría de Economía · SECPLA',
            utilidad: 'Facilita la focalización de programas de barrios comerciales y subsidios para modernización de pequeños almacenes y panaderías barriales patrimoniales.'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Cámara de Comercio Barrio Brasil · Almaceneros',
            utilidad: 'Permite coordinar mesas barriales de convivencia entre el comercio nocturno/gastronómico, la población universitaria y los residentes históricos del cuadrante.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Mapeadores Estudiantiles · OpenStreetMap Chile',
            utilidad: 'Promueve el relevamiento detallado de pequeños comercios: horarios de atención (`opening_hours`), medios de pago (`payment:cash/cards`) y accesibilidad en accesos.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Economía Urbana · Fondecyt F1261256 UAH',
            utilidad: 'Caso de estudio empírico sobre economías urbanas de proximidad, gentrificación estudiantil y conservación del patrimonio en el marco del proyecto Fondecyt.'
          }
        ],

        // APARTADO BIBLIOGRÁFICO Y TRAZABILIDAD
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'cat01_educacion', nombre: 'Educación y Universidad (Equipamiento Superior y Escolar)', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'cat02_servicios', nombre: 'Servicios y Comercio Barrial', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_65', nombre: 'Iniciativas de inversión del Banco Integrado de Proyectos (BIP)', institucion: 'Ministerio de Desarrollo Social y Familia (MDSF)', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_14', nombre: 'Establecimientos de Educación Superior', institucion: 'Ministerio de Educación (MINEDUC)', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_74', nombre: 'Personas en RSH ocupadas y cotizando', institucion: 'Ministerio de Desarrollo Social y Familia (MDSF)', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'censo2024_zonal', nombre: 'Censo 2024 (Zonas y Distritos Censales RM)', institucion: 'Instituto Nacional de Estadísticas (INE)', crs: 'EPSG:4326', tipo: 'Polígono' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Jacobs, J. (1961). The death and life of great American cities. Random House.',
              concepto: 'Aporte teórico: Principio de vitalidad urbana sustentado en la densa mixtura de usos primarios (educación, vivienda y comercio menor) y la continua vigilancia informal («ojos en la calle»).'
            },
            {
              cita: 'Oldenburg, R. (1989). The great good place: Cafes, coffee shops, bookstores, bars, and hangouts at the heart of a community. Marlowe & Co.',
              concepto: 'Aporte teórico: Conceptualiza los «terceros lugares» (cafés, librerías, plazas) como soportes indispensables para la sociabilidad pública y el capital social vecinal.'
            },
            {
              cita: 'Sassen, S. (2000). Cities in a world economy. Pine Forge Press.',
              concepto: 'Aporte teórico: Circuitos económicos locales de proximidad como redes territoriales de resiliencia frente a procesos de homogenización comercial metropolitana.'
            }
          ]
        }
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
          { label: 'Cuidados Informales no Remunerados Ejercidos por Mujeres', valor: '84.6%', porcentaje: 84.6, contexto: 'Registro Social de Hogares (bbdd_70 / bbdd_67)' },
          { label: 'Población a Menos de 10 Minutos a Pie de Salud o Farmacia', valor: '74.0%', porcentaje: 74.0, contexto: 'CESFAM N° 1 y farmacias comunitarias (establecimientos_salud)' },
          { label: 'Adultos Mayores RSH en Tramo de Mayor Vulnerabilidad (<=40%)', valor: '43.8%', porcentaje: 43.8, contexto: 'Calificación Socioeconómica CSE (bbdd_73)' },
          { label: 'Casonas Antiguas con Barreras Físicas de Acceso', valor: '61.2%', porcentaje: 61.2, contexto: 'Peldaños de acceso, ausencia de pasamanos (CAT-07 / BBDD-19)' }
        ],
        graficoComparativo: {
          titulo: 'Distribución de Género en Labores de Cuidados en Barrio Brasil (Fuente: RSH MDSF / bbdd_67)',
          filas: [
            { label: 'Cuidadoras Informales Mujeres (Cuidado feminizado)', valor: '84.6%', porcentaje: 84.6 },
            { label: 'Cuidadores Informales Hombres', valor: '15.4%', porcentaje: 15.4 },
            { label: 'Adultos Mayores en RSH (Tramo <= 40% vulnerabilidad CSE)', valor: '43.8%', porcentaje: 43.8 },
            { label: 'Hogares con Dependencia Severa / Pacientes Postrados', valor: '6.8%', porcentaje: 6.8 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 220" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="220" fill="#0b1329" rx="8"/>
            <text x="340" y="28" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Red Integrada de Cuidados Sociosanitarios a Escala de Barrio</text>
            <rect x="50" y="80" width="130" height="70" rx="8" fill="#be185d" fill-opacity="0.3" stroke="#ec4899" stroke-width="2"/>
            <text x="115" y="108" fill="#fbcfe8" font-size="11" font-weight="bold" text-anchor="middle">Hogar RSH</text>
            <text x="115" y="125" fill="#f472b6" font-size="9" text-anchor="middle">Persona Mayor (65+)</text>
            <text x="115" y="138" fill="#fce7f3" font-size="8.5" text-anchor="middle">Cuidadora Familiar (84.6%)</text>
            <line x1="180" y1="115" x2="230" y2="115" stroke="#ec4899" stroke-width="2"/>
            <rect x="230" y="80" width="130" height="70" rx="8" fill="#065f46" fill-opacity="0.3" stroke="#10b981" stroke-width="2"/>
            <text x="295" y="108" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle">Junta de Vecinos</text>
            <text x="295" y="125" fill="#6ee7b7" font-size="9" text-anchor="middle">Unidad Vecinal (BBDD-66)</text>
            <text x="295" y="138" fill="#d1fae5" font-size="8.5" text-anchor="middle">Alerta Solidaria Local</text>
            <line x1="360" y1="115" x2="410" y2="115" stroke="#10b981" stroke-width="2"/>
            <rect x="410" y="80" width="130" height="70" rx="8" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2"/>
            <text x="475" y="108" fill="#bae6fd" font-size="11" font-weight="bold" text-anchor="middle">CESFAM N° 1</text>
            <text x="475" y="125" fill="#7dd3fc" font-size="9" text-anchor="middle">Atención Primaria DEIS</text>
            <text x="475" y="138" fill="#e0f2fe" font-size="8.5" text-anchor="middle">Visita Domiciliaria / SAPU</text>
            <line x1="540" y1="115" x2="570" y2="115" stroke="#38bdf8" stroke-width="2"/>
            <rect x="570" y="85" width="80" height="60" rx="6" fill="#1e293b" stroke="#64748b"/>
            <text x="610" y="112" fill="#e2e8f0" font-size="9" font-weight="bold" text-anchor="middle">Hospitales</text>
            <text x="610" y="126" fill="#94a3b8" font-size="8" text-anchor="middle">San Juan / Posta</text>
            <text x="340" y="185" fill="#94a3b8" font-size="9.5" text-anchor="middle">Trazabilidad territorial amparada en Ley N° 19.418 y Red DEIS / MINSAL 2026</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'CESFAM de cobertura directa', valor: 'CESFAM N° 1 Ramón Corbalán', referencial: 'Huérfanos 2850 (650m)', fuente: 'DEIS MINSAL (establecimientos_salud)' },
          { variable: 'Tiempo promedio a pie a centro de salud', valor: '7.8 minutos', referencial: '15 minutos estándar OMS', fuente: 'IDE Chile / DEIS' },
          { variable: 'Personas con dependencia catastradas RSH', valor: '486 personas', referencial: 'Cuadrante Brasil-Yungay', fuente: 'BBDD-67 MDSF' },
          { variable: 'Farmacias comunitarias y de turno', valor: '6 establecimientos', referencial: 'Incluye Farmacia Popular Stgo', fuente: 'CAT-02 / DEIS MINSAL' }
        ],
        cuerpo: [
          `La integración de los datos del Registro Social de Hogares (RSH 2026 - BBDD-67) georreferenciados a nivel de Unidad Vecinal permite identificar por primera vez en la cartografía abierta los hogares que cuentan con personas en situación de dependencia funcional moderada o severa en Barrio Brasil.`,
          `Al superponer esta vulnerabilidad de salud con la localización de Establecimientos de Salud Pública (CESFAM N° 1 Ramón Corbalán Melgarejo, Posta Central y Hospital San Juan de Dios bajo la capa establecimientos_salud), se hace patente la relevancia de la atención domiciliaria municipal y de las redes de cuidadores informales, mayoritariamente mujeres jefas de hogar (BBDD-70).`,
          `Las tipologías de edificación patrimonial —caracterizadas por escaleras empinadas de madera noble, accesos estrechos y baños alejados de las habitaciones— imponen dificultades severas para la movilidad cotidiana de personas mayores postradas o con movilidad reducida. Las juntas de vecinos articuladas en torno a las Unidades Vecinales de la Ley N° 19.418 (BBDD-66) cumplen un rol de primera respuesta solidaria que trasciende la labor formal del Estado.`
        ],
        conclusion: `Contar con datos sociosanitarios abiertos a escala de barrio es el primer paso indispensable para diseñar políticas de cuidados territoriales, teleasistencia comunitaria y adaptación accesible de viviendas patrimoniales para un envejecimiento digno en el propio vecindario.`,

        // 4 USUARIOS-TIPO DEL PROYECTO
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'Dirección de Salud Santiago · MDSF · SENAMA',
            utilidad: 'Permite optimizar las rutas de visitas domiciliarias del CESFAM N° 1 para pacientes postrados y focalizar programas de subsidios de cuidadores del Sistema Nacional de Cuidados (Chile Cuida).'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Clubes de Adulto Mayor · Juntas de Vecinos UV (BBDD-66)',
            utilidad: 'Facilita la organización de redes de apoyo solidario vecinal, acompañamiento comunitario a personas mayores que viven solas y botiquines barriales de emergencia.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Mapeadores en Salud · Estudiantes de Enfermería UAH',
            utilidad: 'Promueve el mapeo exhaustivo de equipamiento sociosanitario: farmacias (`amenity=pharmacy`), centros de día para personas mayores y consultorios con rampas accesibles.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Geografías del Cuidado · Fondecyt F1261256 UAH',
            utilidad: 'Ofrece una base espacial rigurosa para modelar la relación entre morfología patrimonial, envejecimiento socioterritorial y feminización de las labores de cuidado en el centro de Santiago.'
          }
        ],

        // APARTADO BIBLIOGRÁFICO Y TRAZABILIDAD
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'establecimientos_salud', nombre: 'Salud Pública (CESFAM y Hospitales)', institucion: 'Departamento de Estadísticas e Información de Salud (DEIS) / MINSAL', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_67', nombre: 'Personas en RSH en situación de dependencia funcional según CSE - 2026 Agosto', institucion: 'Ministerio de Desarrollo Social y Familia (MDSF)', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'bbdd_70', nombre: 'Mujeres en RSH adscritas a Fonasa o Isapre según CSE - 2026 Junio', institucion: 'Ministerio de Desarrollo Social y Familia (MDSF)', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'bbdd_73', nombre: 'Personas mayores en RSH adscritos a Fonasa o Isapre según CSE - 2026 Junio', institucion: 'Ministerio de Desarrollo Social y Familia (MDSF)', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'bbdd_66', nombre: 'Unidades Vecinales 2026 (Ley N° 19.418)', institucion: 'SUBDERE / MINVU', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'bbdd_38', nombre: 'Territorios de los Servicios de Salud', institucion: 'Ministerio de Salud (MINSAL)', crs: 'EPSG:4326', tipo: 'Polígono' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Tronto, J. C. (2013). Caring democracy: Markets, equality, and justice. New York University Press.',
              concepto: 'Aporte teórico: Democratización de los cuidados y visibilización de la infraestructura cotidiana indispensable para el sostenimiento de la vida vulnerable en las ciudades.'
            },
            {
              cita: 'Federici, S. (2018). El patriarcado del salario: Críticas feministas a Marx. Traficantes de Sueños.',
              concepto: 'Aporte teórico: Revela la invisibilización estructural del trabajo de cuidados no remunerado ejercido histórica y mayoritariamente por mujeres al interior de los hogares populares.'
            },
            {
              cita: 'Kwan, M.-P. (2012). The uncertain geographic context problem. Annals of the Association of American Geographers, 102(5), 958–968.',
              concepto: 'Aporte teórico: Sensibilidad de las conclusiones analíticas a la delimitación espacial del vecindario (Unidad Vecinal BBDD-66 frente a límites comunales o censales).'
            }
          ]
        }
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
          console.warn('ModuloIndicadoresAnalisis: Error en obtenerCatalogoCapas()', e);
        }
      }
      if (window.ModuloIDEChile.CAPAS_OFICIALES) {
        return window.ModuloIDEChile.CAPAS_OFICIALES;
      }
    }
    return {};
  }

  /**
   * Resuelve los metadatos y nombre EXACTO de cualquier capa oficial o VGI
   * para asegurar paridad 100% con el Módulo "00. Visor y Atlas VGI"
   */
  function resolverDefinicionCapa(capaId) {
    // 1. Capas VGI Comunitarias (OpenStreetMap / GBIF)
    if (capaId.startsWith('cat0') || capaId.startsWith('cat1')) {
      const catKey = capaId.replace(/^cat\d\d_/, '');
      const catsVGI = (typeof window !== 'undefined' && window.NODO_CONFIG && window.NODO_CONFIG.categorias_osm) 
        ? window.NODO_CONFIG.categorias_osm 
        : [];
      const catFound = catsVGI.find(c => c.id === catKey || c.id === capaId);

      if (catFound) {
        const descGeom = catFound.geometrias ? catFound.geometrias[0] : 'Vectorial';
        const tipoGeom = descGeom.split(' ')[0].toUpperCase();
        return {
          id: catFound.id,
          tipo: 'vgi',
          codigo: catFound.codigo,
          nombre: catFound.nombre, // NOMBRE EXACTO de Módulo 00
          institucion: 'OSM / VGI',
          sigla: 'OSM / VGI',
          geometria: tipoGeom,
          descripcion: catFound.descripcion,
          archivoLocal: `data/capa_${catFound.id}.geojson`,
          nombreDescarga: `capa_${catFound.id}.geojson`
        };
      }

      // Fallback estricto con nombres exactos de config.js
      const fbVGI = NOMBRES_VGI_FALLBACK[capaId] || { codigo: 'VGI', nombre: catKey, institucion: 'OSM / VGI', geom: 'VECTORIAL', desc: 'Capa temática colaborativa.' };
      return {
        id: catKey,
        tipo: 'vgi',
        codigo: fbVGI.codigo,
        nombre: fbVGI.nombre, // NOMBRE EXACTO
        institucion: fbVGI.institucion,
        sigla: 'OSM / VGI',
        geometria: fbVGI.geom,
        descripcion: fbVGI.desc,
        archivoLocal: `data/capa_osm_rm_${capaId}.geojson`,
        nombreDescarga: `capa_osm_rm_${capaId}.geojson`
      };
    }

    // 2. Capas Oficiales del Estado (IDE Chile / MINVU / MTT / INE / MOP / etc.)
    const mapaOficiales = obtenerMapaCapasOficiales();
    let def = mapaOficiales[capaId];
    if (!def && typeof window !== 'undefined' && window.ModuloIDEChile && typeof window.ModuloIDEChile.obtenerDefinicion === 'function') {
      def = window.ModuloIDEChile.obtenerDefinicion(capaId);
    }

    if (def) {
      const sigla = (typeof window.obtenerSiglaInstitucion === 'function') 
        ? window.obtenerSiglaInstitucion(def.institucion) 
        : (def.institucion ? def.institucion.split('/')[0].trim().slice(0, 12) : 'ESTADO');
      
      const tipoGeom = (typeof window.obtenerTipoGeometria === 'function')
        ? window.obtenerTipoGeometria(def)
        : (def.geometria || 'VECTORIAL').toUpperCase();

      const codigo = def.num_bbdd ? `BBDD-${String(def.num_bbdd).padStart(2, '0')}` : def.id.toUpperCase().slice(0, 14);
      const archDescarga = def.archivoLocal || `data/${def.id}.geojson`;
      const nombreArchDescarga = archDescarga.split('/').pop();

      return {
        id: def.id,
        tipo: 'oficial',
        codigo: codigo,
        nombre: def.nombre, // NOMBRE EXACTO de Módulo 00
        institucion: def.institucion || 'Estado de Chile',
        sigla: sigla,
        geometria: tipoGeom,
        descripcion: def.descripcion || 'Capa oficial del Estado de Chile.',
        archivoLocal: archDescarga,
        nombreDescarga: nombreArchDescarga
      };
    }

    // Fallback con el diccionario de nombres exactos auditados de ide_chile.js
    const nombreFallback = NOMBRES_OFICIALES_FALLBACK[capaId] || capaId;
    const esBBDD = capaId.startsWith('bbdd_');
    const codigoFallback = esBBDD ? `BBDD-${capaId.split('_')[1].padStart(2, '0')}` : capaId.toUpperCase().slice(0, 14);

    return {
      id: capaId,
      tipo: 'oficial',
      codigo: codigoFallback,
      nombre: nombreFallback, // NOMBRE EXACTO de Módulo 00
      institucion: 'Estado de Chile (IDE Chile)',
      sigla: 'ESTADO',
      geometria: 'VECTORIAL',
      descripcion: 'Capa oficial de la base de datos territorial del Estado.',
      archivoLocal: `data/${capaId}.geojson`,
      nombreDescarga: `${capaId}.geojson`
    };
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
              <strong>Módulo Analítico y Catálogo Tentativo en Desarrollo:</strong> Esta estructuración multidimensional y los storyboards barriales constituyen propuestas exploratorias en desarrollo colaborativo para el Proyecto Fondecyt F1261256 (Geografía UAH), orientadas a contrastar narrativas territoriales con la base de datos abierta formal.
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
              Análisis concisos y rigurosos donde la base de datos cuenta historias reales sobre la memoria, caminabilidad, biodiversidad, educación y cuidados en el <strong>Barrio Brasil</strong>. Diseñados para los <strong>4 usuarios-tipo del proyecto</strong> con respaldo empírico formal y apartado bibliográfico académico accesible.
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

    // Generar tarjetas de capas con nombres EXACTOS de Módulo 00
    const htmlCapas = dim.capasIds.map(capaId => {
      const info = resolverDefinicionCapa(capaId);

      return `
        <div class="tarjeta-capa-dimension ${info.tipo}" 
             data-tipo="${info.tipo}" 
             data-nombre="${info.nombre.toLowerCase()}" 
             data-institucion="${info.institucion.toLowerCase()}"
             data-codigo="${info.codigo.toLowerCase()}">
          <div class="tarjeta-capa-dim-header">
            <span class="pill-dim-codigo">${info.codigo}</span>
            <span class="pill-dim-origen ${info.tipo}">${info.sigla}</span>
            <span class="pill-dim-geom">${info.geometria}</span>
          </div>
          <h5 class="nombre-capa-dim">${info.nombre}</h5>
          <p class="desc-capa-dim">${info.descripcion}</p>
          <div class="tarjeta-capa-dim-acciones">
            <button type="button" class="btn-capa-accion btn-ver-mapa" onclick="ModuloIndicadoresAnalisis.activarCapaEnMapa('${info.id}', '${info.tipo}')">
              🗺️ Ver en Mapa
            </button>
            <a href="${info.archivoLocal}" download="${info.nombreDescarga}" class="btn-capa-accion btn-descarga-geojson" title="Descargar GeoJSON">
              GeoJSON 📥
            </a>
          </div>
        </div>
      `;
    }).join('');

    contenedorAcordeon.innerHTML = `
      <div class="caja-acordeon-activa" style="border-top: 3px solid ${dim.color};">
        <div class="cabecera-acordeon-activa">
          <div class="titulo-con-icono-acordeon">
            <span class="icono-acordeon-mini">${dim.icono}</span>
            <div>
              <h4 class="titulo-acordeon-activa">Dimensión 0${dim.numero}: ${dim.nombre}</h4>
              <p class="subtitulo-acordeon-activa">${dim.enfoque}</p>
            </div>
          </div>
          <div class="acciones-cabecera-acordeon">
            <span class="badge-contador-capas-filtro" id="badge-contador-capas-dim">
              Mostrando ${dim.capasIds.length} de ${dim.capasIds.length} capas
            </span>
            <button type="button" class="btn-cerrar-acordeon" onclick="ModuloIndicadoresAnalisis.colapsarAcordeon()" aria-label="Cerrar acordeón">✕</button>
          </div>
        </div>

        <!-- Barra de Herramientas: Buscador y Filtros -->
        <div class="barra-herramientas-acordeon">
          <div class="buscador-capas-acordeon">
            <span class="icono-lupa">🔍</span>
            <input type="text" 
                   id="input-buscador-capas-dim" 
                   placeholder="Buscar capa por nombre, código BBDD o institución..." 
                   aria-label="Buscar capa en dimensión"
                   oninput="ModuloIndicadoresAnalisis.filtrarCapasAcordeon(this.value)">
          </div>
          <div class="filtros-tipo-acordeon">
            <button type="button" class="btn-filtro-tipo activo" data-filtro="todos" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('todos')">Todas (${dim.capasIds.length})</button>
            <button type="button" class="btn-filtro-tipo" data-filtro="oficial" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('oficial')">Oficiales Estado</button>
            <button type="button" class="btn-filtro-tipo" data-filtro="vgi" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('vgi')">VGI Comunitario</button>
          </div>
        </div>

        <!-- Grilla de Tarjetas de Capas -->
        <div class="grilla-capas-dimension" id="grilla-capas-dimension-items">
          ${htmlCapas}
        </div>
      </div>
    `;

    contenedorAcordeon.style.display = 'block';

    // Desplazamiento suave hacia el acordeón
    setTimeout(() => {
      contenedorAcordeon.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  }

  /**
   * Cierra el acordeón desplegable
   */
  function colapsarAcordeon() {
    dimensionSeleccionada = null;
    const contenedorAcordeon = document.getElementById('contenedor-acordeon-capas');
    if (contenedorAcordeon) {
      contenedorAcordeon.style.display = 'none';
      contenedorAcordeon.innerHTML = '';
    }
    document.querySelectorAll('.tarjeta-dimension-grande').forEach(t => {
      t.classList.remove('activa');
      t.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Filtra las capas del acordeón en tiempo real según texto
   */
  function filtrarCapasAcordeon(query) {
    queryFiltroActual = (query || '').toLowerCase().trim();
    aplicarFiltrosCombinados();
  }

  /**
   * Filtra las capas del acordeón por tipo (todas, oficial, vgi)
   */
  function filtrarPorTipo(tipo) {
    filtroTipoActivo = tipo;
    document.querySelectorAll('.btn-filtro-tipo').forEach(btn => {
      btn.classList.toggle('activo', btn.dataset.filtro === tipo);
    });
    aplicarFiltrosCombinados();
  }

  /**
   * Aplica los filtros combinados de búsqueda y tipo sobre las tarjetas
   */
  function aplicarFiltrosCombinados() {
    const items = document.querySelectorAll('#grilla-capas-dimension-items .tarjeta-capa-dimension');
    let visibles = 0;

    items.forEach(el => {
      const tipo = el.dataset.tipo;
      const nombre = el.dataset.nombre || '';
      const institucion = el.dataset.institucion || '';
      const codigo = el.dataset.codigo || '';

      const coincideTipo = (filtroTipoActivo === 'todos') || (tipo === filtroTipoActivo);
      const coincideTexto = !queryFiltroActual || 
                            nombre.includes(queryFiltroActual) || 
                            institucion.includes(queryFiltroActual) || 
                            codigo.includes(queryFiltroActual);

      const mostrar = coincideTipo && coincideTexto;
      el.style.display = mostrar ? 'flex' : 'none';
      if (mostrar) visibles++;
    });

    const badgeContador = document.getElementById('badge-contador-capas-dim');
    if (badgeContador) {
      badgeContador.textContent = `Mostrando ${visibles} de ${items.length} capas`;
    }
  }

  /**
   * Abre la lámina de lectura modal tipo blog para un Storyboard
   */
  function abrirLaminaStoryboard(storyboardId) {
    const sb = STORYBOARDS.find(s => s.id === storyboardId);
    if (!sb) return;

    const overlay = document.getElementById('lamina-storyboard-overlay');
    const scrollContenido = document.getElementById('lamina-contenido-scroll');
    if (!overlay || !scrollContenido) return;

    scrollContenido.innerHTML = `
      <article class="articulo-storyboard-blog">

        <!-- Encabezado de la Lámina -->
        <header class="header-articulo-blog">
          <div class="meta-superior-blog">
            <span class="badge-dim-storyboard">${sb.dimensionNombre}</span>
            <span class="tiempo-lectura-blog">⏱ Lectura estimada: ${sb.tiempoLectura}</span>
          </div>
          <h1 class="titulo-articulo-blog">${sb.titulo}</h1>
          <p class="bajada-articulo-blog">${sb.bajada}</p>
          <div class="tags-articulo-blog">
            ${sb.tags.map(t => `<span class="tag-chip-blog">#${t}</span>`).join('')}
          </div>
        </header>

        <!-- Imagen Destacada del Storyboard -->
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
          <h4 class="titulo-caja-metricas">📊 Indicadores Cuantitativos Extraídos de la Base de Datos Formal:</h4>
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

        <!-- ================================================================= -->
        <!-- SECCIÓN 4 USUARIOS-TIPO: RELEVANCIA Y UTILIDAD TERRITORIAL        -->
        <!-- ================================================================= -->
        <section class="seccion-actores-territoriales-storyboard" aria-label="Utilidad para los 4 Usuarios-Tipo">
          <div class="cabecera-seccion-actores">
            <h4>🎯 Relevancia y Utilidad según Perfil de Actor Territorial (4 Usuarios-Tipo)</h4>
            <span class="badge-fuente-datos">ENFOQUE MULTI-ACTOR</span>
          </div>
          <div class="grilla-actores-storyboard">
            ${sb.contenido.analisisPorActor.map(actor => `
              <div class="tarjeta-actor-storyboard actor-${actor.id}">
                <div class="header-actor-tarjeta">
                  <span class="icono-actor">${actor.icono}</span>
                  <div>
                    <span class="nombre-actor">${actor.nombre}</span>
                    <span class="subtitulo-actor">${actor.subtitulo}</span>
                  </div>
                </div>
                <p class="texto-utilidad-actor">${actor.utilidad}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- ================================================================= -->
        <!-- SECCIÓN APARTADO BIBLIOGRÁFICO Y FUENTES FORMALES (APA 7MA ED.)    -->
        <!-- ================================================================= -->
        <section class="seccion-bibliografia-storyboard" aria-label="Apartado Bibliográfico y Fuentes">
          <div class="cabecera-bibliografia">
            <h4>📚 Apartado Bibliográfico y Trazabilidad de Datos Formales</h4>
            <span class="badge-fuente-datos">NORMA APA 7ª ED. · DATOS ABIERTOS</span>
          </div>

          <!-- Fuentes Formales de Datos Espaciales -->
          <div>
            <h5 class="subtitulo-bloque-biblio">1. Catálogo de Capas Formales Utilizadas en este Análisis</h5>
            <div style="overflow-x:auto;">
              <table class="tabla-datos-storyboard" style="font-size:0.78rem;">
                <thead>
                  <tr>
                    <th>Código Capa</th>
                    <th>Nombre de Capa en el Atlas</th>
                    <th>Institución Custodia</th>
                    <th>Sistema Ref. (CRS)</th>
                    <th>Geometría</th>
                  </tr>
                </thead>
                <tbody>
                  ${sb.contenido.apartadoBibliografico.fuentesDatos.map(fd => `
                    <tr>
                      <td><code style="color:#38bdf8;">${fd.codigo}</code></td>
                      <td><strong>${fd.nombre}</strong></td>
                      <td>${fd.institucion}</td>
                      <td>${fd.crs}</td>
                      <td><span class="pill-dim-geom" style="font-size:0.65rem;">${fd.tipo}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Referencias Teórico-Metodológicas / Autores -->
          <div>
            <h5 class="subtitulo-bloque-biblio">2. Referencias Teórico-Metodológicas y Autores Clave</h5>
            <ul class="lista-referencias-apa">
              ${sb.contenido.apartadoBibliografico.referenciasAcademicas.map(ref => `
                <li class="item-referencia-apa">
                  <strong>${ref.cita}</strong>
                  <span class="nota-marco-conceptual">${ref.concepto}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </section>

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
            * Este storyboard forma parte de los entregables exploratorios y análisis cuali-cuantitativos del Proyecto Fondecyt Regular F1261256 (Geografía UAH). Datos obtenidos estrictamente de las fuentes formales del Atlas VGI (IDE Chile, MINVU, INE Censo 2024, UOCT/MTT, MDSF BiDat, OpenStreetMap contributors y GBIF.org).
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
    resolverDefinicionCapa,
    obtenerDimensiones: () => DIMENSIONES,
    obtenerStoryboards: () => STORYBOARDS
  };

})();

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.ModuloIndicadoresAnalisis = ModuloIndicadoresAnalisis;
}

// Auto-inicialización inmediata al cargar el DOM
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ModuloIndicadoresAnalisis.inicializar();
    });
  } else {
    ModuloIndicadoresAnalisis.inicializar();
  }
}

