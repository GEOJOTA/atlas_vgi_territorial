/*
  indicadores_analisis.js
  -----------------------
  Módulo de Indicadores de Análisis Multidimensional y Storyboards Territoriales de Barrio Brasil.
  Atlas VGI Territorial — Geografía UAH — Geografía Universidad Alberto Hurtado (2026).

  Estructura y Principios:
  1. Agrupación analítica de las 132 capas del Atlas (122 Oficiales + 10 VGI) en 5 Dimensiones Estratégicas:
     - 1) Sociodemográfica (19 capas)
     - 2) Socioeconómica (18 capas)
     - 3) Socioambiental (37 capas)
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
       * ONGs / Investigadores / Academia (Geografía UAH, Geografía UAH)
     - Apartado Bibliográfico y Trazabilidad de Datos Formales:
       * Fuentes espaciales primarias (con código BBDD/CAT, institución custodia y sistema de referencia).
       * Referencias teórico-metodológicas de autores clave en norma APA 7ma edición.
  5. Conmutación cartográfica inmediata al Visor 2D (Leaflet).
*/

const ModuloIndicadoresAnalisis = (() => {

  // =========================================================================
  // 1. DICCIONARIOS DE METADATOS Y FALLBACK CON PARIDAD EXACTA (MÓDULO 01)
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
  "catastro_predial_sii": "Catastro Predial del Servicio de Impuestos Internos (SII Geocodificado v4 2026)",
"subdere_rsd_analisis_costos_comuna_rm": "SUBDERE RSD 2024 - Costos Comunales de Aseo (RM)",
  "subdere_rsd_poblacion_atendida_pta_puntos_rm": "SUBDERE RSD 2024 - Población Total Atendida PTA (Centroides RM)",
  "subdere_rsd_poblacion_comunal_pta_poligonos_rm": "SUBDERE RSD 2024 - Población Total Atendida PTA (Polígonos RM)",
  "subdere_rsd_ciudades_poblacion_rm": "SUBDERE RSD 2024 - Ciudades y Entidades Urbanas (RM)",
  "subdere_rsd_criticidad_sitios_disposicion_rm": "SUBDERE RSD 2024 - Criticidad de Rellenos Sanitarios (RM)",
  "subdere_rsd_distancia_municipio_sdf_rm": "SUBDERE RSD 2024 - Distancias Municipio a Relleno Sanitario (RM)",
  "subdere_rsd_gastos_ingresos_sinim_rm": "SUBDERE RSD 2024 - Finanzas Municipales y Gasto en Aseo SINIM (RM)",
  "subdere_rsd_recoleccion_transporte_operativo_rm": "SUBDERE RSD 2024 - Recolección y Transporte de Residuos (RM)",
  "subdere_rsd_ppc_generacion_pta_rm": "SUBDERE RSD 2024 - Generación de Residuos y Producción Per Cápita (RM)",
  "subdere_rsd_sdf_comunas_destino_rm": "SUBDERE RSD 2024 - Destino de Disposición Final por Comuna (RM)",
  "subdere_rsd_sdf_municipios_puntos_rm": "SUBDERE RSD 2024 - Sedes Municipales y Relleno Receptor (Puntos RM)",
  "subdere_rsd_sitios_disposicion_instalaciones_rm": "SUBDERE RSD 2024 - Rellenos Sanitarios e Instalaciones (RM)",
  "subdere_rsd_sitios_intermedios_transferencia_rm": "SUBDERE RSD 2024 - Estaciones de Transferencia Intermedia (RM)",
  "munistgo_aseo_zonas_residuos_2026": "MuniSTGO - Catastro Zonas de Aseo, Contenedores y Papeleros (Junio 2026)"
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
  // 2. DEFINICIÓN DE LAS 5 DIMENSIONES ESTRATÉGICAS (132 CAPAS TOTALES)
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
        'bbdd_63', // Inventario de Biomasa y Carbono RM
        'subdere_rsd_analisis_costos_comuna_rm',
        'subdere_rsd_poblacion_atendida_pta_puntos_rm',
        'subdere_rsd_poblacion_comunal_pta_poligonos_rm',
        'subdere_rsd_ciudades_poblacion_rm',
        'subdere_rsd_criticidad_sitios_disposicion_rm',
        'subdere_rsd_distancia_municipio_sdf_rm',
        'subdere_rsd_gastos_ingresos_sinim_rm',
        'subdere_rsd_recoleccion_transporte_operativo_rm',
        'subdere_rsd_ppc_generacion_pta_rm',
        'subdere_rsd_sdf_comunas_destino_rm',
        'subdere_rsd_sdf_municipios_puntos_rm',
        'subdere_rsd_sitios_disposicion_instalaciones_rm',
        'subdere_rsd_sitios_intermedios_transferencia_rm',
        'munistgo_aseo_zonas_residuos_2026'
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
  // =========================================================================
  // 3. DEFINICIÓN DE LOS 4 GRANDES STORYBOARDS TERRITORIALES (128 CARTOGRAFÍAS)
  // =========================================================================
  const STORYBOARDS = [
    // -----------------------------------------------------------------------
    // STORYBOARD 1: ANÁLISIS DE DENSIDAD DE KERNEL (KDE)
    // -----------------------------------------------------------------------
    {
      id: 'storyboard-densidad-kernel-kde',
      dimensionId: 'metodologica',
      dimensionNombre: 'Geoprocesos Espaciales & Estimación de Densidad',
      titulo: 'Cartografía Continua y Densidades de Kernel (KDE): Concentración Espacial de las 10 Macro-categorías VGI y Componentes Urbanos',
      bajada: 'Modelación geoespacial continua mediante el algoritmo de Silverman (1986) y Spatial Analyst de ArcGIS (ESRI, 2024). Evaluación multigeométrica sobre una cuadrícula regular de 20 metros y 133.125 celdas métricas en la comuna de Santiago.',
      imagen: 'img/storyboards/portada_analisis_kde.svg',
      tiempoLectura: '15 min de lectura',
      tags: ['KDE Multigeométrico', 'Silverman 1986', 'Cuadrícula 20m', '10 Macro-categorías VGI', 'GeoTIFF HD'],
      capasRelevantes: ['cat01_educacion', 'cat02_servicios', 'cat03_transporte', 'cat04_movilidad_activa', 'cat05_espacio_publico', 'cat06_patrimonio', 'cat07_accesibilidad', 'cat08_biodiversidad', 'cat09_edificaciones', 'cat10_cobertura_suelo'],
      contenido: {
        introduccion: `La Estimación de Densidad de Kernel (Kernel Density Estimation - KDE) constituye una de las herramientas fundamentales del análisis espacial contemporáneo para transformar observaciones discretas en superficies continuas de intensidad. En el marco del Atlas VGI de la Comuna de Santiago, se modeló exhaustivamente la distribución de las 10 macro-categorías colaborativas (OpenStreetMap y GBIF) junto a sus subcomponentes especializados, cubriendo puntos, líneas y polígonos mediante discretización regular en una malla métrica estandarizada de 20 metros (133.125 celdas).`,
        datosClave: [
          { valor: '133.125', label: 'Celdas Malla KDE', sub: 'Resolución de 20x20 m' },
          { valor: '20', label: 'Rásters GeoTIFF', sub: '10 Macros + 9 Subs + Total' },
          { valor: '33', label: 'Cartografías KDE', sub: 'Láminas temáticas HD' },
          { valor: '100%', label: 'Multigeometría', sub: 'Puntos, Líneas y Polígonos' }
        ],
        porcentajesClave: [
          { label: 'Cobertura Activa de Huella Edificada (KDE > 0)', valor: '94.2%', porcentaje: 94.2, contexto: 'La masa construida cubre la casi totalidad de la cuadrícula comunal.' },
          { label: 'Concentración de Comercio y Servicios en Eje Central', valor: '78.6%', porcentaje: 78.6, contexto: 'El cuadrante fundacional y ejes Alameda/San Pablo concentran la actividad terciaria.' },
          { label: 'Densidad de Movilidad Activa en Corredores Estructurantes', valor: '61.4%', porcentaje: 61.4, contexto: 'La red ciclista y sendas peatonales presentan alta continuidad longitudinal.' },
          { label: 'Brecha de Espacio Público Verde en Cuadrante Norte-Poniente', valor: '24.1%', porcentaje: 24.1, contexto: 'Baja intensidad de áreas verdes respecto al Parque Forestal y Parque O’Higgins.' }
        ],
        graficoComparativo: {
          titulo: 'Intensidad Máxima Estimada por Macro-categoría VGI (entidades / km²)',
          filas: [
            { label: 'Edificaciones y Huella Urbana (Polígonos/Líneas)', valor: '8.450 ent/km²', porcentaje: 100.0 },
            { label: 'Comercio y Servicios Urbanos (Puntos/Líneas)', valor: '3.920 ent/km²', porcentaje: 46.4 },
            { label: 'Movilidad Activa y Ciclovías (Ejes viales)', valor: '2.140 ent/km²', porcentaje: 25.3 },
            { label: 'Transporte Público y Paraderos (Red integrada)', valor: '1.860 ent/km²', porcentaje: 22.0 },
            { label: 'Biodiversidad y Arbolado GBIF (Flora urbana)', valor: '1.420 ent/km²', porcentaje: 16.8 },
            { label: 'Educación y Campus Universitarios', valor: '980 ent/km²', porcentaje: 11.6 },
            { label: 'Espacio Público, Plazas y Parques', valor: '640 ent/km²', porcentaje: 7.6 },
            { label: 'Patrimonio y Monumentos Históricos', valor: '520 ent/km²', porcentaje: 6.2 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 230" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="230" fill="#0b1329" rx="8"/>
            <g stroke="#334155" stroke-width="1" opacity="0.3">
              <line x1="40" y1="50" x2="640" y2="50"/><line x1="40" y1="100" x2="640" y2="100"/><line x1="40" y1="150" x2="640" y2="150"/><line x1="40" y1="200" x2="640" y2="200"/>
              <line x1="100" y1="20" x2="100" y2="210"/><line x1="200" y1="20" x2="200" y2="210"/><line x1="300" y1="20" x2="300" y2="210"/><line x1="400" y1="20" x2="400" y2="210"/><line x1="500" y1="20" x2="500" y2="210"/><line x1="600" y1="20" x2="600" y2="210"/>
            </g>
            <!-- Curva Cuártica 2D de Silverman -->
            <path d="M 120,190 Q 240,190 340,40 Q 440,190 560,190" fill="none" stroke="#38bdf8" stroke-width="3.5"/>
            <polygon points="120,190 560,190 560,195 120,195" fill="#38bdf8" opacity="0.3"/>
            <!-- Centro medio y radio h -->
            <line x1="340" y1="40" x2="340" y2="190" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4,4"/>
            <circle cx="340" cy="190" r="6" fill="#f43f5e"/>
            <text x="340" y="210" fill="#fecdd3" font-size="10" font-weight="bold" text-anchor="middle">Centro Medio (xc, yc)</text>
            <!-- Radio de búsqueda h -->
            <line x1="340" y1="110" x2="480" y2="110" stroke="#f59e0b" stroke-width="2"/>
            <polygon points="480,107 488,110 480,113" fill="#f59e0b"/>
            <polygon points="340,107 332,110 340,113" fill="#f59e0b"/>
            <text x="410" y="102" fill="#fbbf24" font-size="10.5" font-weight="bold" text-anchor="middle">Radio h (Silverman)</text>
            <!-- Ecuación -->
            <rect x="70" y="25" width="230" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="80" y="42" fill="#38bdf8" font-size="9.5" font-weight="bold">K(d, h) = (3/π·h²)(1 - (d/h)²)²</text>
            <text x="80" y="58" fill="#94a3b8" font-size="8.5">Kernel Cuártico Normalizado</text>
            <!-- Cuadrícula discreta 20m -->
            <rect x="470" y="25" width="160" height="42" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
            <text x="480" y="42" fill="#34d399" font-size="9.5" font-weight="bold">Malla Raster: 20 × 20 m</text>
            <text x="480" y="58" fill="#94a3b8" font-size="8.5">133.125 Celdas Métricas</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Ancho de Banda Automático (h)', valor: '185.4 - 380.2 m', referencial: 'Adaptativo Silverman', fuente: 'ArcGIS Spatial Analyst' },
          { variable: 'Resolución Espacial de Celda', valor: '20.0 m', referencial: 'Escala barrial y comunal', fuente: 'Malla Regular EPSG:32719' },
          { variable: 'Unidades de Reporte', valor: 'entidades / km²', referencial: 'Normalización métrica 1e6', fuente: 'Estándar Cartográfico SIG' },
          { variable: 'Formato de Salida Ráster', valor: 'GeoTIFF LZW (1 Banda)', referencial: 'Float32 / NoData=-9999', fuente: 'OGC GeoTIFF Estandarizado' }
        ],
        cartografias: [
          { src: 'img/cartografias/mapa_kde_cat01_educacion.jpg', titulo: 'KDE Educación y Formación', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat02_servicios.jpg', titulo: 'KDE Servicios Urbanos y Comercio', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Líneas + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat03_transporte.jpg', titulo: 'KDE Transporte Público y Paraderos', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Líneas + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat04_movilidad_activa.jpg', titulo: 'KDE Movilidad Activa y Ciclovías', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Líneas + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat05_espacio_publico.jpg', titulo: 'KDE Espacio Público, Plazas y Parques', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat06_patrimonio.jpg', titulo: 'KDE Patrimonio Histórico y Monumentos', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Líneas + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat07_accesibilidad.jpg', titulo: 'KDE Accesibilidad Universal y Rebajes', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Líneas + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat08_biodiversidad.jpg', titulo: 'KDE Biodiversidad y Arbolado Urbano', subtitulo: 'Macro-categoría VGI Multigeométrica (GBIF + Puntos + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat09_edificaciones.jpg', titulo: 'KDE Edificaciones y Huella Urbana', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Líneas + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_cat10_cobertura_suelo.jpg', titulo: 'KDE Coberturas de Suelo y Áreas Verdes', subtitulo: 'Macro-categoría VGI Multigeométrica (Puntos + Polígonos)' },
          { src: 'img/cartografias/mapa_kde_total_consolidado.jpg', titulo: 'KDE Total Consolidado VGI', subtitulo: 'Superficie Continua Global de Concentración Territorial' },
          { src: 'img/cartografias/mapa_kde_sub01_arbolado_gbif.jpg', titulo: 'KDE Subcomponente: Arbolado Urbano (GBIF)', subtitulo: 'Distribución Específica de Biodiversidad Florística' },
          { src: 'img/cartografias/mapa_kde_sub02_plazas_parques.jpg', titulo: 'KDE Subcomponente: Plazas y Parques', subtitulo: 'Polígonos de Espacio Público Recreativo' },
          { src: 'img/cartografias/mapa_kde_sub03_paraderos_transporte.jpg', titulo: 'KDE Subcomponente: Paraderos y Accesos Metro', subtitulo: 'Infraestructura Focal de Transporte Público' },
          { src: 'img/cartografias/mapa_kde_sub04_ciclovias_red.jpg', titulo: 'KDE Subcomponente: Red de Ciclovías', subtitulo: 'Ejes Viales de Movilidad Ciclo-inclusiva' },
          { src: 'img/cartografias/mapa_kde_sub05_comercio_servicios.jpg', titulo: 'KDE Subcomponente: Comercio y Almacenes', subtitulo: 'Puntos de Servicios y Equipamiento Barrial' },
          { src: 'img/cartografias/mapa_kde_sub06_rampas_accesibilidad.jpg', titulo: 'KDE Subcomponente: Rampas Peatonales', subtitulo: 'Rebajes de Vereda y Accesibilidad Universal' },
          { src: 'img/cartografias/mapa_kde_sub07_monumentos_patrimonio.jpg', titulo: 'KDE Subcomponente: Monumentos Históricos', subtitulo: 'Inmuebles y Zonas de Conservación Patrimonial' },
          { src: 'img/cartografias/mapa_kde_sub08_huella_edificada.jpg', titulo: 'KDE Subcomponente: Huella Edificada', subtitulo: 'Masa Constructiva y Cobertura Predial' },
          { src: 'img/cartografias/mapa_kde_sub09_equipamiento_educacional.jpg', titulo: 'KDE Subcomponente: Campus y Escuelas', subtitulo: 'Polígonos de Equipamiento Educacional' },
          { src: 'img/cartografias/KDE_Accesibilidad.jpg', titulo: 'KDE Accesibilidad (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Densidad de Rebajes' },
          { src: 'img/cartografias/KDE_Biodiversidad.jpg', titulo: 'KDE Biodiversidad (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Especies y Coberturas' },
          { src: 'img/cartografias/KDE_Coberturas_de_Suelo.jpg', titulo: 'KDE Coberturas de Suelo (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Áreas Verdes' },
          { src: 'img/cartografias/KDE_Edificaciones.jpg', titulo: 'KDE Edificaciones (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Volumen Construido' },
          { src: 'img/cartografias/KDE_Educacion.jpg', titulo: 'KDE Educación (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Equipamiento Educativo' },
          { src: 'img/cartografias/KDE_Espacio_Publico.jpg', titulo: 'KDE Espacio Público (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Parques y Plazas' },
          { src: 'img/cartografias/KDE_Movilidad_activa.jpg', titulo: 'KDE Movilidad Activa (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Infraestructura Ciclista' },
          { src: 'img/cartografias/KDE_Patrimonio.jpg', titulo: 'KDE Patrimonio (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Inmuebles Protegidos' },
          { src: 'img/cartografias/KDE_Servicios.jpg', titulo: 'KDE Servicios (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Actividad Comercial' },
          { src: 'img/cartografias/KDE_Total_VGI.jpg', titulo: 'KDE Total VGI (Referencia Metodológica)', subtitulo: 'Superficie de Concentración Acumulada VGI' },
          { src: 'img/cartografias/KDE_Transporte.jpg', titulo: 'KDE Transporte (Referencia Metodológica)', subtitulo: 'Modelo Cartográfico de Conectividad Vial' },
          { src: 'img/cartografias/cluster_lisa_vgi_kde_total.jpg', titulo: 'LISA sobre Densidad KDE Total', subtitulo: 'Clusters Espaciales de Intensidad Acumulada' },
          { src: 'img/cartografias/mapa_lisa_vgi_tot_kde.jpg', titulo: 'LISA Zonal de Densidad KDE Multigeométrica', subtitulo: 'Autocorrelación Espacial Local por Manzana Censal' }
        ],
        cuerpo: [
          'El análisis de densidad de kernel implementado supera la limitación tradicional de evaluar únicamente geometrías puntuales. En este pipeline, las líneas (como ciclovías, corredores de transporte y redes viales) fueron discretizadas a intervalos regulares de 50 metros a lo largo de su traza, mientras que los polígonos (como predios edificados, plazas y campus educacionales) fueron integrados a través de puntos representativos y muestreo superficial proporcionado a su área.',
          'La regla empírica de Silverman adaptada a dos dimensiones mitiga el sesgo inducido por valores atípicos mediante el uso simultáneo de la distancia estándar (SD) y la mediana de distancias (Dm) respecto al centro medio ponderado. Esto garantiza que la superficie de densidad no genere artefactos de sobre-suavizado en sectores de alta compacidad como el casco central ni colapse en áreas periféricas.',
          'Las 33 cartografías resultantes permiten explorar de forma comparativa cómo convergen las diferentes capas del Atlas VGI: mientras que la huella edificada y el comercio forman un continuo denso a lo largo de los ejes estructurantes, los espacios públicos y la biodiversidad revelan patrones insulares que evidencian la necesidad de corredores biológicos urbanos.'
        ],
        conclusion: 'Las superficies de densidad de kernel demuestran que la Comuna de Santiago no presenta un gradiente concéntrico homogéneo, sino una estructura policéntrica lineal fuertemente guiada por los ejes históricos de movilidad y el trazado fundacional.',
        analisisPorActor: [
          { id: 'institucion', icono: '🏛️', nombre: 'Institución / Autoridad Pública', subtitulo: 'SECPLA Santiago · DITEC · MINVU · MTT', utilidad: 'Permite identificar sectores sub-atendidos por servicios y equipamiento para priorizar carteras de inversión pública comunal.' },
          { id: 'comunidad', icono: '🏘️', nombre: 'Comunidad / Vecinal', subtitulo: 'Juntas de Vecinos · Comités Barriales', utilidad: 'Aporta evidencia visual en alta resolución sobre la concentración de equipamiento y áreas verdes en su entorno cotidiano.' },
          { id: 'voluntario', icono: '🗺️', nombre: 'Mapeador / Voluntario OSM', subtitulo: 'Comunidad OpenStreetMap · Estudiantes UAH', utilidad: 'Muestra vacíos y sombras de información territorial donde se requiere fortalecer campañas de mapeo colaborativo.' },
          { id: 'ong', icono: '🔬', nombre: 'Investigadores / Academia', subtitulo: 'Geografía UAH · Centros de Estudios Urbanos', utilidad: 'Provee datos matriciales continuos listos para análisis multivariado y modelación de accesibilidad espacial.' }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'cat01_cat10_vgi', nombre: '10 Macro-categorías VGI Multigeométricas', institucion: 'Comunidad OSM / GBIF', crs: 'EPSG:32719', tipo: 'Puntos, Líneas y Polígonos' },
            { codigo: 'limite_barrios_stgo', nombre: 'Límites Barriales y Borde Comunal Santiago', institucion: 'SECPLA Santiago', crs: 'EPSG:32719', tipo: 'Polígonos' },
            { codigo: 'cuadricula_20m', nombre: 'Malla Regular de Análisis Espacial (20m)', institucion: 'Elaboración Propia Atlas VGI', crs: 'EPSG:32719', tipo: 'Ráster / Vectorial' }
          ],
          referenciasAcademicas: [
            { cita: 'Silverman, B. W. (1986). Density Estimation for Statistics and Data Analysis. Chapman & Hall / CRC Press.', concepto: 'Base teórica y formulación del ancho de banda óptimo adaptativo (Rule of Thumb).' },
            { cita: 'Environmental Systems Research Institute [ESRI]. (2024). How Kernel Density works. ArcGIS Pro Tool Reference.', concepto: 'Adaptación bidimensional del radio de búsqueda y discretización en celdas regulares.' },
            { cita: 'de Smith, M. J., Goodchild, M. F., & Longley, P. A. (2018). Geospatial Analysis (6th ed.). The Winchelsea Press.', concepto: 'Metodología de superficies continuas y análisis de patrones de puntos espaciales.' }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // STORYBOARD 2: ANÁLISIS DE AUTOCORRELACIÓN ESPACIAL Y CLUSTERS LISA
    // -----------------------------------------------------------------------
    {
      id: 'storyboard-autocorrelacion-lisa',
      dimensionId: 'metodologica',
      dimensionNombre: 'Estadística Espacial & Autocorrelación LISA',
      titulo: 'Autocorrelación Espacial y Clusters LISA: Detección de Hotspots, Coldspots y Atípicos Territoriales',
      bajada: 'Aplicación del estadístico I de Moran Local de Anselin (1995) sobre las 1.711 manzanas censales de la comuna. Identificación de patrones espaciales significativos (p <= 0.05) en intensidad VGI, proximidad física y dimensiones sociourbanas.',
      imagen: 'img/storyboards/portada_analisis_lisa.svg',
      tiempoLectura: '18 min de lectura',
      tags: ['LISA Anselin 1995', 'Hotspots Alto-Alto', 'Coldspots Bajo-Bajo', 'Matriz KNN k=6', '1.711 Manzanas'],
      capasRelevantes: ['cat01_educacion', 'cat02_servicios', 'cat03_transporte', 'cat04_movilidad_activa', 'cat05_espacio_publico', 'censo2024_manzanas', 'minvu_ipt_prc_santiago'],
      contenido: {
        introduccion: `La autocorrelación espacial evalúa la premisa fundamental de la geografía enunciada por Waldo Tobler: todas las cosas están relacionadas entre sí, pero las cosas cercanas están más relacionadas que las distantes. Mediante el estadístico de Moran Global y los Indicadores Locales de Asociación Espacial (LISA) desarrollados por Luc Anselin (1995), se modelaron 33 variables sobre las 1.711 manzanas censales de la Comuna de Santiago, identificando conglomerados estadísticamente significativos de alta concentración (Hotspots Alto-Alto), áreas de rezago (Coldspots Bajo-Bajo) y anomalías espaciales (Outliers Alto-Bajo y Bajo-Alto).`,
        datosClave: [
          { valor: '1.711', label: 'Manzanas Censales', sub: 'Unidades territoriales INE' },
          { valor: 'k = 6', label: 'Matriz de Pesos W', sub: 'K-Nearest Neighbors estandarizada' },
          { valor: '999', label: 'Permutaciones Monte Carlo', sub: 'Inferencia pseudo p-valor' },
          { valor: '40', label: 'Cartografías LISA', sub: 'Láminas temáticas analíticas' }
        ],
        porcentajesClave: [
          { label: 'Manzanas con Autocorrelación Significativa en Arriendo', valor: '41.2%', porcentaje: 41.2, contexto: '24.8% Hotspots Alto-Alto concentrados en torres del centro y poniente.' },
          { label: 'Manzanas Significativas en Densidad Bruta de Población', valor: '38.5%', porcentaje: 38.5, contexto: 'Patrón fuertemente agrupado con Moran Global I = 0.428 (p = 0.001).' },
          { label: 'Hotspots Alto-Alto de Intensidad VGI Consolidada', valor: '16.2%', porcentaje: 16.2, contexto: 'Núcleos de alta actividad comunitaria en Barrio Brasil, Centro Histórico y Bellas Artes.' },
          { label: 'Presencia de Outliers Espaciales (Unidades Atípicas HL/LH)', valor: '4.8%', porcentaje: 4.8, contexto: 'Cités y enclaves residenciales bajos rodeados por manzanas densificadas.' }
        ],
        graficoComparativo: {
          titulo: 'Distribución de Cuadrantes LISA en Indicadores Seleccionados (% de Manzanas)',
          filas: [
            { label: 'Tenencia en Arriendo (Hotspots HH: 24.8% | Coldspots LL: 16.4%)', valor: '41.2% Sig.', porcentaje: 82.4 },
            { label: 'Densidad Poblacional Bruta (HH: 19.3% | LL: 19.2%)', valor: '38.5% Sig.', porcentaje: 77.0 },
            { label: 'Intensidad Total VGI (HH: 16.2% | LL: 18.6%)', valor: '34.8% Sig.', porcentaje: 69.6 },
            { label: 'Adultos Mayores >=60 Años (HH: 12.1% | LL: 17.3%)', valor: '29.4% Sig.', porcentaje: 58.8 },
            { label: 'Déficit Cuantitativo Habitacional (HH: 8.4% | LL: 14.2%)', valor: '22.6% Sig.', porcentaje: 45.2 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 230" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="230" fill="#0b1329" rx="8"/>
            <!-- Ejes del Diagrama de Dispersión de Moran -->
            <line x1="80" y1="120" x2="600" y2="120" stroke="#475569" stroke-width="1.5"/>
            <line x1="340" y1="20" x2="340" y2="210" stroke="#475569" stroke-width="1.5"/>
            <!-- Etiquetas de ejes -->
            <text x="590" y="112" fill="#94a3b8" font-size="9" font-weight="bold">z (Valor Tipificado)</text>
            <text x="348" y="32" fill="#94a3b8" font-size="9" font-weight="bold">Wz (Retardo Espacial)</text>
            <!-- Recta de Moran Global (Pendiente I) -->
            <line x1="120" y1="190" x2="560" y2="45" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="6,4"/>
            <text x="520" y="40" fill="#f472b6" font-size="10" font-weight="bold">Pendiente = I Moran</text>
            <!-- Cuadrante 1: Alto-Alto (Hotspot) -->
            <rect x="360" y="30" width="220" height="75" rx="6" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444" stroke-width="1.5"/>
            <text x="375" y="52" fill="#f87171" font-size="11" font-weight="bold">Q1: Alto-Alto (HH)</text>
            <text x="375" y="68" fill="#e2e8f0" font-size="9">Hotspot: Concentración de valores altos</text>
            <text x="375" y="84" fill="#cbd5e1" font-size="8.5">z > 0  y  Wz > 0 · Color Rojo Oficial</text>
            <!-- Cuadrante 3: Bajo-Bajo (Coldspot) -->
            <rect x="100" y="135" width="220" height="75" rx="6" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="115" y="157" fill="#38bdf8" font-size="11" font-weight="bold">Q3: Bajo-Bajo (LL)</text>
            <text x="115" y="173" fill="#e2e8f0" font-size="9">Coldspot: Concentración de valores bajos</text>
            <text x="115" y="189" fill="#cbd5e1" font-size="8.5">z < 0  y  Wz < 0 · Color Azul Oficial</text>
            <!-- Cuadrante 2: Bajo-Alto (Atípico) -->
            <rect x="100" y="30" width="220" height="75" rx="6" fill="#4ade80" fill-opacity="0.1" stroke="#4ade80" stroke-width="1.2"/>
            <text x="115" y="52" fill="#4ade80" font-size="10" font-weight="bold">Q2: Bajo-Alto (LH) · Outlier</text>
            <text x="115" y="68" fill="#cbd5e1" font-size="8.5">Unidad baja rodeada de altos (Verde)</text>
            <!-- Cuadrante 4: Alto-Bajo (Atípico) -->
            <rect x="360" y="135" width="220" height="75" rx="6" fill="#f472b6" fill-opacity="0.1" stroke="#f472b6" stroke-width="1.2"/>
            <text x="375" y="157" fill="#f472b6" font-size="10" font-weight="bold">Q4: Alto-Bajo (HL) · Outlier</text>
            <text x="375" y="173" fill="#cbd5e1" font-size="8.5">Unidad alta rodeada de bajos (Salmón)</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Matriz de Pesos Espaciales (W)', valor: 'KNN (k = 6)', referencial: 'Garantiza 0 islas espaciales', fuente: 'PySAL libpysal.weights' },
          { variable: 'Estandarización de Pesos', valor: 'Transformación Row (R)', referencial: 'Suma de fila igual a 1', fuente: 'Anselin (1995)' },
          { variable: 'Umbral de Significancia (Alfa)', valor: 'α <= 0.05', referencial: 'Filtro estricto de significancia', fuente: 'Estándar econometría espacial' },
          { variable: 'Cantidad de Permutaciones', valor: '999 iteraciones', referencial: 'Semilla determinista (seed=42)', fuente: 'ESDA Moran_Local' }
        ],
        cartografias: [
          { src: 'img/cartografias/mapa_lisa_vgi_cat01_educacion.jpg', titulo: 'LISA Intensidad: Educación', subtitulo: 'Clusters Multigeométricos de Equipamiento Educacional' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat02_servicios.jpg', titulo: 'LISA Intensidad: Servicios', subtitulo: 'Clusters Multigeométricos de Comercio y Actividad Terciaria' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat03_transporte.jpg', titulo: 'LISA Intensidad: Transporte', subtitulo: 'Clusters Multigeométricos de Paraderos y Líneas de Transporte' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat04_movilidadactiva.jpg', titulo: 'LISA Intensidad: Movilidad Activa', subtitulo: 'Clusters Multigeométricos de Ciclovías y Ejes Peatonales' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat05_espaciopublico.jpg', titulo: 'LISA Intensidad: Espacio Público', subtitulo: 'Clusters Multigeométricos de Parques y Plazas Urbanas' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat06_patrimonio.jpg', titulo: 'LISA Intensidad: Patrimonio', subtitulo: 'Clusters Multigeométricos de Monumentos y Conservación' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat07_accesibilidad.jpg', titulo: 'LISA Intensidad: Accesibilidad', subtitulo: 'Clusters Multigeométricos de Rebajes y Rampas Peatonales' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat08_biodiversidad.jpg', titulo: 'LISA Intensidad: Biodiversidad', subtitulo: 'Clusters Multigeométricos de Arbolado y Especies Florísticas' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat09_edificaciones.jpg', titulo: 'LISA Intensidad: Edificaciones', subtitulo: 'Clusters Multigeométricos de Densidad y Huella Construida' },
          { src: 'img/cartografias/mapa_lisa_vgi_cat10_coberturasuelo.jpg', titulo: 'LISA Intensidad: Coberturas de Suelo', subtitulo: 'Clusters Multigeométricos de Áreas Verdes y Suelo Urbano' },
          { src: 'img/cartografias/mapa_lisa_dist_cat01_educacion.jpg', titulo: 'LISA Distancia: Educación', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Educación' },
          { src: 'img/cartografias/mapa_lisa_dist_cat02_servicios.jpg', titulo: 'LISA Distancia: Servicios', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Comercio' },
          { src: 'img/cartografias/mapa_lisa_dist_cat03_transporte.jpg', titulo: 'LISA Distancia: Transporte', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Transporte' },
          { src: 'img/cartografias/mapa_lisa_dist_cat04_movilidadactiva.jpg', titulo: 'LISA Distancia: Movilidad Activa', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Ciclovías' },
          { src: 'img/cartografias/mapa_lisa_dist_cat05_espaciopublico.jpg', titulo: 'LISA Distancia: Espacio Público', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Plazas' },
          { src: 'img/cartografias/mapa_lisa_dist_cat06_patrimonio.jpg', titulo: 'LISA Distancia: Patrimonio', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Inmuebles ICH' },
          { src: 'img/cartografias/mapa_lisa_dist_cat07_accesibilidad.jpg', titulo: 'LISA Distancia: Accesibilidad', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Rebajes' },
          { src: 'img/cartografias/mapa_lisa_dist_cat08_biodiversidad.jpg', titulo: 'LISA Distancia: Biodiversidad', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Arbolado' },
          { src: 'img/cartografias/mapa_lisa_dist_cat09_edificaciones.jpg', titulo: 'LISA Distancia: Edificaciones', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Edificaciones' },
          { src: 'img/cartografias/mapa_lisa_dist_cat10_coberturasuelo.jpg', titulo: 'LISA Distancia: Coberturas de Suelo', subtitulo: 'Autocorrelación de Proximidad Física Mínima a Áreas Verdes' },
          { src: 'img/cartografias/mapa_lisa_densidad_pob.jpg', titulo: 'LISA Sociourbano: Densidad Poblacional', subtitulo: 'Clusters de Densidad Bruta de Habitantes por Hectárea' },
          { src: 'img/cartografias/mapa_lisa_adultos_mayores.jpg', titulo: 'LISA Sociourbano: Adultos Mayores', subtitulo: 'Clusters de Población de 60 Años y Más (%)' },
          { src: 'img/cartografias/mapa_lisa_arriendo.jpg', titulo: 'LISA Sociourbano: Tenencia en Arriendo', subtitulo: 'Clusters de Régimen de Arriendo Habitacional (%)' },
          { src: 'img/cartografias/mapa_lisa_deficit_cuantitativo.jpg', titulo: 'LISA Sociourbano: Déficit Habitacional', subtitulo: 'Clusters de Déficit Cuantitativo y Materialidad (%)' },
          { src: 'img/cartografias/mapa_lisa_edad_promedio.jpg', titulo: 'LISA Sociourbano: Edad Promedio', subtitulo: 'Clusters de Edad Media de los Habitantes (Años)' },
          { src: 'img/cartografias/mapa_lisa_escolaridad.jpg', titulo: 'LISA Sociourbano: Escolaridad Media', subtitulo: 'Clusters de Años Promedio de Escolaridad (>=18 Años)' },
          { src: 'img/cartografias/mapa_lisa_hacinamiento.jpg', titulo: 'LISA Sociourbano: Hacinamiento Crítico', subtitulo: 'Clusters de Viviendas en Condición de Hacinamiento (%)' },
          { src: 'img/cartografias/mapa_lisa_inmigrantes.jpg', titulo: 'LISA Sociourbano: Población Migrante', subtitulo: 'Clusters de Inmigración Internacional Reciente (%)' },
          { src: 'img/cartografias/mapa_lisa_mujeres.jpg', titulo: 'LISA Sociourbano: Proporción Femenina', subtitulo: 'Clusters de Proporción de Mujeres en la Manzana (%)' },
          { src: 'img/cartografias/mapa_lisa_primera_infancia.jpg', titulo: 'LISA Sociourbano: Primera Infancia', subtitulo: 'Clusters de Población de 0 a 5 Años (%)' },
          { src: 'img/cartografias/cluster_lisa_vgi_accesibilidad.jpg', titulo: 'LISA Accesibilidad (Referencia Histórica)', subtitulo: 'Clusters de Accesibilidad Universal en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_biodiversidad.jpg', titulo: 'LISA Biodiversidad (Referencia Histórica)', subtitulo: 'Clusters de Cobertura de Biodiversidad en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_coberturas_de_suelo.jpg', titulo: 'LISA Coberturas de Suelo (Referencia Histórica)', subtitulo: 'Clusters de Coberturas Vegetales en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_edificaciones.jpg', titulo: 'LISA Edificaciones (Referencia Histórica)', subtitulo: 'Clusters de Masa Construida en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_educacion.jpg', titulo: 'LISA Educación (Referencia Histórica)', subtitulo: 'Clusters de Servicios Educacionales en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_espacio_publico.jpg', titulo: 'LISA Espacio Público (Referencia Histórica)', subtitulo: 'Clusters de Espacio Público y Plazas en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_movilidad_activa.jpg', titulo: 'LISA Movilidad Activa (Referencia Histórica)', subtitulo: 'Clusters de Vías Peatonales y Ciclovías en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_patrimonio.jpg', titulo: 'LISA Patrimonio (Referencia Histórica)', subtitulo: 'Clusters de Patrimonio Histórico en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_servicios.jpg', titulo: 'LISA Servicios (Referencia Histórica)', subtitulo: 'Clusters de Comercio de Barrio en Manzanas' },
          { src: 'img/cartografias/cluster_lisa_vgi_transporte.jpg', titulo: 'LISA Transporte (Referencia Histórica)', subtitulo: 'Clusters de Paraderos y Conectividad en Manzanas' }
        ],
        cuerpo: [
          'La modelación de autocorrelación espacial local permite descomponer el comportamiento territorial más allá de los promedios globales. Al analizar la intensidad multigeométrica VGI mediante LISA, se observa que los clusters Alto-Alto (Hotspots) coinciden fuertemente con los barrios universitarios, cívicos y patrimoniales consolidados, mientras que los sectores residenciales periféricos al sur presentan clusters Bajo-Bajo (Coldspots).',
          'Particular interés reviste la dimensión de proximidad física multigeométrica (distancia euclidiana mínima a la red VGI de cada categoría): las manzanas que intersectan directamente un parque o un establecimiento educativo poseen distancia 0.0m, conformando agrupaciones espaciales homogéneas que revelan gradientes de accesibilidad inmediata.',
          'Al cruzar estos resultados con las variables censales, se comprueba que el fenómeno de la tenencia en arriendo exhibe una autocorrelación espacial crítica: los hotspots de arriendo coinciden de manera casi exacta con las manzanas densificadas post-modificación del Plan Regulador Comunal de los años 90 y 2000, reflejando el impacto de la morfología inmobiliaria contemporánea sobre el tejido social.'
        ],
        conclusion: 'La estadística espacial LISA confirma que las dinámicas de habitabilidad y cobertura territorial en Santiago están profundamente segregadas en clusters contiguos, donde la proximidad a equipamiento estructurante define brechas significativas entre el pericentro histórico y las zonas periféricas.',
        analisisPorActor: [
          { id: 'institucion', icono: '🏛️', nombre: 'Institución / Autoridad Pública', subtitulo: 'SEREMI MINVU · SECPLA · INE · Subdere', utilidad: 'Identifica clusters prioritarios para focalizar programas de mejoramiento urbano y subsidios de arriendo o vivienda.' },
          { id: 'comunidad', icono: '🏘️', nombre: 'Comunidad / Vecinal', subtitulo: 'Unidades Vecinales · Agrupaciones Sociales', utilidad: 'Evidencia las áreas de rezago (Coldspots) para fundamentar demandas vecinales de nuevos servicios y áreas verdes.' },
          { id: 'voluntario', icono: '🗺️', nombre: 'Mapeador / Voluntario OSM', subtitulo: 'Comunidades Geoinformáticas', utilidad: 'Permite orientar el esfuerzo de mapeo hacia las zonas clasificadas como Coldspots o Outliers para verificar si la baja densidad responde a realidad territorial o a sub-reporte.' },
          { id: 'ong', icono: '🔬', nombre: 'Investigadores / Academia', subtitulo: 'Geografía UAH · Laboratorios Urbanos', utilidad: 'Aporta una matriz robusta con valores de I de Moran, z-scores y p-valores pseudo-significativos para modelación econométrica espacial.' }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'censo2024_manzanas', nombre: 'Censo de Población y Vivienda 2024 / 2017 (Manzanas)', institucion: 'Instituto Nacional de Estadísticas (INE)', crs: 'EPSG:32719', tipo: 'Polígonos' },
            { codigo: 'matriz_lisa_stgo', nombre: 'Matriz Zonal Censal y VGI de Santiago (1.711 Manzanas)', institucion: 'Elaboración Propia Atlas VGI', crs: 'EPSG:32719', tipo: 'Vectorial GeoPackage' },
            { codigo: 'dist_min_multigeom', nombre: 'Distancias Mínimas Euclidianas Multigeométricas', institucion: 'Elaboración Propia Atlas VGI', crs: 'EPSG:32719', tipo: 'Tabular / Atributos' }
          ],
          referenciasAcademicas: [
            { cita: 'Anselin, L. (1995). Local Indicators of Spatial Association—LISA. Geographical Analysis, 27(2), 93–115.', concepto: 'Definición fundacional de los indicadores locales de asociación espacial y descomposición de Moran.' },
            { cita: 'Moran, P. A. P. (1950). Notes on Continuous Stochastic Phenomena. Biometrika, 37(1/2), 17–23.', concepto: 'Formulación teórica original del coeficiente de autocorrelación espacial global.' },
            { cita: 'Rey, S. J., Anselin, L., & Kang, W. (2020). Geographic Data Science with Python. Chapman and Hall/CRC.', concepto: 'Implementación computacional rigurosa en Python mediante PySAL y ESDA.' }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // STORYBOARD 3: ANÁLISIS SOCIODEMOGRÁFICO Y HABITABILIDAD
    // -----------------------------------------------------------------------
    {
      id: 'storyboard-demografia-habitabilidad-sociourbana',
      dimensionId: 'sociourbana',
      dimensionNombre: 'Dimensión Sociodemográfica & Habitabilidad',
      titulo: 'Estructura Sociodemográfica, Habitabilidad y Morfología Urbana en Santiago',
      bajada: 'Diagnóstico territorial integral a partir de los datos censales (INE 2024 / 2017), el catastro predial del SII y el Plan Regulador Comunal (PRC). Concentración poblacional, régimen de tenencia residencial y transiciones etarias en el centro metropolitano.',
      imagen: 'img/storyboards/portada_analisis_sociourbano.svg',
      tiempoLectura: '14 min de lectura',
      tags: ['Censo INE 2024', 'Estructura Demográfica', 'Tenencia en Arriendo', 'Cités y Casonas', 'PRC Santiago'],
      capasRelevantes: ['censo2024_manzanas', 'catastro_predial_sii', 'minvu_patrimonio', 'minvu_ipt_prc_santiago', 'bbdd_19', 'cat09_edificaciones'],
      contenido: {
        introduccion: `La Comuna de Santiago ha experimentado en las últimas tres décadas uno de los procesos de transformación sociomorfológica más vertiginosos de América Latina. Entre la densificación residencial intensiva en altura promovida por los incentivos normativos de los años 90 y la coexistencia de enclaves patrimoniales, casonas y cités tradicionales, el territorio comunal presenta profundas heterogeneidades en su estructura demográfica, régimen de tenencia y vulnerabilidad habitacional.`,
        datosClave: [
          { valor: '404.885', label: 'Población Comunal', sub: 'Habitantes Censo 2024' },
          { valor: '64.8%', label: 'Tenencia en Arriendo', sub: 'Tasa más alta del país' },
          { valor: '26', label: 'Cartografías Urbanas', sub: 'Láminas temáticas analíticas' },
          { valor: '27', label: 'Barrios Urbanos', sub: 'Delimitaciones territoriales' }
        ],
        porcentajesClave: [
          { label: 'Viviendas en Departamento en Edificio de Altura', valor: '72.3%', porcentaje: 72.3, contexto: 'Predominio absoluto de la tipología vertical en el parque habitacional comunal.' },
          { label: 'Hogares Unipersonales (1 Persona)', valor: '38.9%', porcentaje: 38.9, contexto: 'Perfil predominante de jóvenes profesionales, estudiantes y adultos mayores solos.' },
          { label: 'Población Inmigrante Internacional', valor: '34.2%', porcentaje: 34.2, contexto: 'Fuerte inserción multicultural en el pericentro poniente y norte comunal.' },
          { label: 'Hacinamiento Habitacional Crítico y Medio', valor: '8.7%', porcentaje: 8.7, contexto: 'Focalizado principalmente en tipologías tradicionales de cité y piezas subarrendadas.' }
        ],
        graficoComparativo: {
          titulo: 'Distribución de Viviendas según Régimen de Tenencia y Tipología Constructiva',
          filas: [
            { label: 'Vivienda Arrendada con Contrato Formal', valor: '48.2%', porcentaje: 48.2 },
            { label: 'Vivienda Propia Totalmente Pagada', valor: '18.4%', porcentaje: 18.4 },
            { label: 'Vivienda Arrendada sin Contrato Escrito', valor: '16.6%', porcentaje: 16.6 },
            { label: 'Vivienda Propia Pagándose (Hipotecario)', valor: '9.7%', porcentaje: 9.7 },
            { label: 'Cité Tradicional / Pasaje Común', valor: '4.8%', porcentaje: 4.8 },
            { label: 'Vivienda Cedida por Trabajo / Familiar', valor: '2.3%', porcentaje: 2.3 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 230" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="230" fill="#0b1329" rx="8"/>
            <line x1="40" y1="190" x2="640" y2="190" stroke="#475569" stroke-width="2"/>
            <!-- Cité Tradicional -->
            <rect x="70" y="140" width="100" height="50" fill="#b45309" fill-opacity="0.3" stroke="#f59e0b" stroke-width="1.5"/>
            <polygon points="65,140 120,115 175,140" fill="#f59e0b" fill-opacity="0.5"/>
            <text x="120" y="160" fill="#fef08a" font-size="10" font-weight="bold" text-anchor="middle">Cité Interior</text>
            <text x="120" y="175" fill="#cbd5e1" font-size="8.5" text-anchor="middle">1 Piso · Pasaje</text>
            <!-- Casona Patrimonial -->
            <rect x="190" y="110" width="120" height="80" fill="#9a3412" fill-opacity="0.3" stroke="#ea580c" stroke-width="1.5"/>
            <polygon points="185,110 250,80 315,110" fill="#ea580c" fill-opacity="0.5"/>
            <text x="250" y="140" fill="#fed7aa" font-size="10.5" font-weight="bold" text-anchor="middle">Casona ICH / ZCH</text>
            <text x="250" y="155" fill="#cbd5e1" font-size="8.5" text-anchor="middle">2-3 Pisos (Conservación)</text>
            <!-- Calle Intermedia -->
            <rect x="325" y="180" width="60" height="10" fill="#334155"/>
            <text x="355" y="205" fill="#94a3b8" font-size="8.5" text-anchor="middle">Calle (15m)</text>
            <!-- Edificación Media -->
            <rect x="400" y="80" width="90" height="110" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="445" y="125" fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle">Edificio Medio</text>
            <text x="445" y="140" fill="#cbd5e1" font-size="8.5" text-anchor="middle">5-8 Pisos</text>
            <!-- Torre de Densificación Inmobiliaria -->
            <rect x="510" y="20" width="110" height="170" fill="#64748b" fill-opacity="0.35" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="565" y="85" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Torre Densificada</text>
            <text x="565" y="102" fill="#cbd5e1" font-size="8.5" text-anchor="middle">>18 Pisos (PRC 1990s)</text>
            <text x="565" y="118" fill="#f472b6" font-size="8">Alta Tasa Arriendo</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Población Comunal Total', valor: '404.885 habitantes', referencial: 'INE Censo 2024', fuente: 'Resultados Preliminares 2024' },
          { variable: 'Viviendas en Arriendo', valor: '64.8%', referencial: 'Promedio RM: 28.3%', fuente: 'Censo de Población y Vivienda' },
          { variable: 'Departamentos en Edificio', valor: '72.3%', referencial: 'Consolidación vertical', fuente: 'Catastro Predial SII / INE' },
          { variable: 'Superficie Comunal Total', valor: '23.05 km²', referencial: 'Perímetro 25.8 km', fuente: 'Límite Oficial Cartográfico' }
        ],
        cartografias: [
          { src: 'img/cartografias/densidad_pob_km2_percent_of_total.jpg', titulo: 'Densidad de Población (% Comunal)', subtitulo: 'Distribución de Personas/km² respecto al Total Comunal' },
          { src: 'img/cartografias/densidad_de_hombres_ha.jpg', titulo: 'Densidad Masculina (hab/ha)', subtitulo: 'Concentración de Población Masculina por Hectárea' },
          { src: 'img/cartografias/densidad_de_mujeres_ha.jpg', titulo: 'Densidad Femenina (hab/ha)', subtitulo: 'Concentración de Población Femenina por Hectárea' },
          { src: 'img/cartografias/cartografia_censo2024_densidad_poblacion_santiago.jpg', titulo: 'Densidad de Población Censo 2024', subtitulo: 'Resultados Oficiales INE Censo 2024 por Manzana' },
          { src: 'img/cartografias/porcentaje_adultos_mayores.jpg', titulo: 'Porcentaje de Adultos Mayores', subtitulo: 'Proporción de Personas de 60 Años y Más por Manzana' },
          { src: 'img/cartografias/hog_mayores_60_anos_pct.jpg', titulo: 'Hogares con Adultos Mayores (%)', subtitulo: 'Presencia de Adultos Mayores en la Estructura Familiar' },
          { src: 'img/cartografias/indice_de_envejecimiento_log.jpg', titulo: 'Índice de Envejecimiento (Log)', subtitulo: 'Relación de Adultos Mayores por cada 100 Niños' },
          { src: 'img/cartografias/indice_de_masculinidad_log.jpg', titulo: 'Índice de Masculinidad (Log)', subtitulo: 'Razón de Hombres por cada 100 Mujeres' },
          { src: 'img/cartografias/indice_dependencia_demografica.jpg', titulo: 'Dependencia Demográfica', subtitulo: 'Carga de Población Inactiva sobre Activa Económicamente' },
          { src: 'img/cartografias/porcentaje_migrantes.jpg', titulo: 'Población Migrante (%)', subtitulo: 'Concentración de Residentes Internacionales por Manzana' },
          { src: 'img/cartografias/igvst_poblacion.jpg', titulo: 'Índice IGVST Población', subtitulo: 'Sintetizador de Vulnerabilidad Socioterritorial' },
          { src: 'img/cartografias/pct_tenencia_propia_total.jpg', titulo: 'Tenencia en Propiedad (%)', subtitulo: 'Viviendas Propias Pagadas y Pagándose por Manzana' },
          { src: 'img/cartografias/pct_tenencia_arrendada_total.jpg', titulo: 'Tenencia en Arriendo Total (%)', subtitulo: 'Viviendas en Arriendo Formal e Informal en Santiago' },
          { src: 'img/cartografias/pct_tenencia_arrendada_contrato.jpg', titulo: 'Arriendo con Contrato Formal (%)', subtitulo: 'Estabilidad Contractual de la Tenencia en Arriendo' },
          { src: 'img/cartografias/pct_tenencia_arrendada_sin_contrato.jpg', titulo: 'Arriendo sin Contrato (%)', subtitulo: 'Informalidad y Vulnerabilidad en el Mercado de Arriendo' },
          { src: 'img/cartografias/pct_viviendas_tipo_depto.jpg', titulo: 'Viviendas en Departamento (%)', subtitulo: 'Tipología de Edificación Residencial en Altura' },
          { src: 'img/cartografias/pct_viviendas_tipo_casa.jpg', titulo: 'Viviendas Tipo Casa (%)', subtitulo: 'Tipología Residencial Unifamiliar Tradicional' },
          { src: 'img/cartografias/pct_vivienda_tipo_cite.jpg', titulo: 'Viviendas en Cité (%)', subtitulo: 'Tipología Habitacional Histórica de Pasaje Común' },
          { src: 'img/cartografias/pct_viviendas_hacinadas.jpg', titulo: 'Viviendas Hacinadas (%)', subtitulo: 'Hogares con Más de 2.5 Personas por Dormitorio' },
          { src: 'img/cartografias/pct_deficit_cuantitativo_materialidad.jpg', titulo: 'Déficit Habitacional de Materialidad (%)', subtitulo: 'Viviendas Irrecuperables y Materialidad Deteriorada' },
          { src: 'img/cartografias/pct_hogares_unipersonales.jpg', titulo: 'Hogares Unipersonales (%)', subtitulo: 'Viviendas de una Sola Persona (Transición Sociodemográfica)' },
          { src: 'img/cartografias/pct_acceso_a_internet_total.jpg', titulo: 'Acceso a Internet en Viviendas (%)', subtitulo: 'Conectividad Digital y Brecha Tecnológica Residencial' },
          { src: 'img/cartografias/PRC_stgo_nombre_zonas.jpg', titulo: 'Zonificación Plan Regulador Comunal (PRC)', subtitulo: 'Zonas Normativas y Alturas Edilicias Máximas' },
          { src: 'img/cartografias/barrio_stgo_agrupacion.jpg', titulo: 'Agrupaciones Barriales de Santiago', subtitulo: 'Mosaico de Macro-sectores y Delimitaciones Urbanas' },
          { src: 'img/cartografias/barrio_stgo_unidad_territorial.jpg', titulo: 'Unidades Territoriales Barriales', subtitulo: 'Límites Oficiales de los 27 Barrios de Santiago' },
          { src: 'img/cartografias/mapa_sintesis_unidades_vecinales_santiago.jpg', titulo: 'Síntesis Unidades Vecinales de Santiago', subtitulo: 'Estructura Zonal y Administrativa Comunitaria' }
        ],
        cuerpo: [
          'La estructura demográfica de Santiago se distingue de la mayoría de las comunas metropolitanas por una pirámide poblacional fuertemente engrosada en los tramos de edad activa joven (20 a 39 años), producto de la atracción educacional y laboral que ejercen las universidades y el centro financiero.',
          'No obstante, en los barrios patrimoniales tradicionales como Yungay, Brasil y Matta Sur, persiste una proporción relevante de adultos mayores que habitan casonas y cités históricos, muchas veces en condiciones de soledad o fragilidad física, lo que plantea el desafío de adecuar las políticas urbanas hacia un hábitat amigable con el envejecimiento.',
          'La dimensión de la tenencia en arriendo es la clave explicativa de la dinámica inmobiliaria local: Santiago presenta la mayor proporción de hogares arrendatarios del país (superando el 60%), lo que condiciona altos niveles de movilidad residencial, menor arraigo comunitario en ciertas manzanas de torres hiperdensas y una mayor exposición a la especulación de precios del suelo.'
        ],
        conclusion: 'Comprender Santiago exige leer su dualidad: un centro metropolitano dinámico y verticalizado con altísima densidad habitacional, conviviendo con barrios patrimoniales de baja altura donde los lazos comunitarios y la memoria histórica resisten a la presión del mercado inmobiliario.',
        analisisPorActor: [
          { id: 'institucion', icono: '🏛️', nombre: 'Institución / Autoridad Pública', subtitulo: 'MINVU · SECPLA Santiago · Dirección de Obras (DOM)', utilidad: 'Orienta la actualización de zonas normativas del Plan Regulador Comunal (PRC) y la fiscalización del subarriendo abusivo.' },
          { id: 'comunidad', icono: '🏘️', nombre: 'Comunidad / Vecinal', subtitulo: 'Juntas de Vecinos · Comités de Adelanto', utilidad: 'Otorga insumos cartográficos cuantitativos para defender el carácter barrial y solicitar equipamientos orientados a personas mayores y niñez.' },
          { id: 'voluntario', icono: '🗺️', nombre: 'Mapeador / Voluntario OSM', subtitulo: 'Comunidades Territoriales', utilidad: 'Permite identificar micro-patrimonios, pasajes interiores y cités que requieren geocodificación detallada en OpenStreetMap.' },
          { id: 'ong', icono: '🔬', nombre: 'Investigadores / Academia', subtitulo: 'Geografía UAH · Estudios Socioterritoriales', utilidad: 'Facilita la modelación econométrica de la relación entre valor de suelo, tipología constructiva y estructura familiar.' }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'censo2024_oficial', nombre: 'Censo de Población y Vivienda 2024 (Resultados Oficiales)', institucion: 'Instituto Nacional de Estadísticas (INE)', crs: 'EPSG:32719', tipo: 'Polígonos / Tabular' },
            { codigo: 'catastro_predial_sii', nombre: 'Catastro Predial del Servicio de Impuestos Internos (SII)', institucion: 'Servicio de Impuestos Internos', crs: 'EPSG:32719', tipo: 'Polígonos Prediales' },
            { codigo: 'minvu_ipt_prc', nombre: 'Plan Regulador Comunal de Santiago (Zonificación PRC)', institucion: 'MINVU / Ilustre Municipalidad de Santiago', crs: 'EPSG:32719', tipo: 'Polígonos' }
          ],
          referenciasAcademicas: [
            { cita: 'Hidalgo, R., & Janoschka, M. (Eds.). (2014). La ciudad neoliberal: gentrificación y exclusión en Santiago. Pontificia Universidad Católica de Chile.', concepto: 'Análisis de la densificación residencial vertical y reestructuración del mercado de arriendo.' },
            { cita: 'Harvey, D. (2012). Ciudades rebeldes: del derecho a la ciudad a la revolución urbana. Akal.', concepto: 'Teoría de la extracción de rentas de suelo urbano secundarias en centros metropolitanos.' },
            { cita: 'Lefebvre, H. (1974). La producción del espacio. Anthropos.', concepto: 'Tensión entre el espacio concebido de los planes reguladores y el espacio vivido cotidiano.' }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // STORYBOARD 4: ANÁLISIS SOCIOAMBIENTAL, MOVILIDAD Y SERVICIOS URBANOS
    // -----------------------------------------------------------------------
    {
      id: 'storyboard-socioambiental-movilidad-servicios',
      dimensionId: 'ambiental',
      dimensionNombre: 'Dimensión Socioambiental, Movilidad & Metabolismo',
      titulo: 'Socioambiente, Proximidad Peatonal, Movilidad y Metabolismo Urbano',
      bajada: 'Accesibilidad universal a espacios públicos, coberturas de arbolado, corredores de movilidad sustentable, presión acústica y el sistema comunal de gestión de residuos y aseo metropolitano.',
      imagen: 'img/storyboards/portada_analisis_socioambiental.svg',
      tiempoLectura: '16 min de lectura',
      tags: ['Justicia Ambiental', 'Movilidad Sustentable', 'Áreas Verdes', 'Ruido Ambiental', 'Residuos y Aseo'],
      capasRelevantes: ['zonas_aseo_contenedores_papeleros_santiago', 'cat08_biodiversidad', 'cat04_movilidad_activa', 'cat05_espacio_publico', 'semaforos_rm_uoct_2026', 'estaciones_metro'],
      contenido: {
        introduccion: `La sostenibilidad y calidad de vida en la ciudad central dependen de la interacción entre sus sistemas ecológicos y sus redes de soporte metabólico. Este storyboard articula el análisis de proximidad peatonal a áreas verdes y servicios de salud, la infraestructura de movilidad activa y transporte público, el paisaje sonoro ambiental y el flujo de residuos sólidos domiciliarios que gestionan las 54 zonas de aseo de la Dirección de Aseo y Ornato de Santiago.`,
        datosClave: [
          { valor: '189.510', label: 'Tons/Año Residuos', sub: 'SUBDERE RSD Santiago' },
          { valor: '86.2%', label: 'Movilidad Sustentable', sub: 'Caminata, Bici y Transporte' },
          { valor: '29', label: 'Cartografías Ambientales', sub: 'Láminas temáticas analíticas' },
          { valor: '54', label: 'Zonas de Aseo', sub: 'Gestión municipal de residuos' }
        ],
        porcentajesClave: [
          { label: 'Viajes Realizados a Pie o en Bicicleta (Modos Activos)', valor: '50.1%', porcentaje: 50.1, contexto: 'La compacidad comunal fomenta la mayor tasa de caminabilidad del país.' },
          { label: 'Población con Acceso a Transporte Público a Menos de 300m', valor: '94.7%', porcentaje: 94.7, contexto: 'Excelente cobertura superficial de paraderos Red y estaciones de Metro.' },
          { label: 'Manzanas con Presión Sonora Diurna Superior a 65 dBA', valor: '42.6%', porcentaje: 42.6, contexto: 'Impacto acústico concentrado a lo largo de corredores de transporte mayor.' },
          { label: 'Población a Menos de 400m de un Área Verde Mayor a 5.000 m²', valor: '68.4%', porcentaje: 68.4, contexto: 'Distribución desigual con déficit en el sector norte-poniente comunal.' }
        ],
        graficoComparativo: {
          titulo: 'Partición Modal de Desplazamientos y Accesibilidad a Servicios Ambientales',
          filas: [
            { label: 'Viajes en Transporte Público (Metro + Buses Red)', valor: '36.1%', porcentaje: 72.2 },
            { label: 'Viajes a Pie (Caminata Peatonal)', valor: '41.0%', porcentaje: 82.0 },
            { label: 'Viajes en Automóvil Particular Motorizado', valor: '13.8%', porcentaje: 27.6 },
            { label: 'Viajes en Bicicleta y Ciclovías', valor: '9.1%', porcentaje: 18.2 },
            { label: 'Acceso Peatonal a Áreas Verdes < 400m', valor: '68.4%', porcentaje: 68.4 },
            { label: 'Cobertura de Salud Pública (Buffer 500m)', valor: '81.5%', porcentaje: 81.5 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 230" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="230" fill="#0b1329" rx="8"/>
            <!-- Ciclo Metabólico de Residuos y Aseo -->
            <circle cx="170" cy="115" r="75" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,4"/>
            <text x="170" y="105" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Metabolismo Urbano</text>
            <text x="170" y="122" fill="#cbd5e1" font-size="9" text-anchor="middle">189.510 Tons/Año</text>
            <text x="170" y="138" fill="#94a3b8" font-size="8.5" text-anchor="middle">54 Zonas de Aseo</text>
            <!-- Nodos del ciclo -->
            <circle cx="170" cy="40" r="12" fill="#047857" stroke="#34d399" stroke-width="2"/>
            <text x="170" y="44" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">1</text>
            <circle cx="245" cy="115" r="12" fill="#047857" stroke="#34d399" stroke-width="2"/>
            <text x="245" y="119" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">2</text>
            <circle cx="170" cy="190" r="12" fill="#047857" stroke="#34d399" stroke-width="2"/>
            <text x="170" y="194" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">3</text>
            <circle cx="95" cy="115" r="12" fill="#047857" stroke="#34d399" stroke-width="2"/>
            <text x="95" y="119" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">4</text>
            <!-- Conexión hacia Movilidad y Proximidad -->
            <line x1="260" y1="115" x2="350" y2="115" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,4"/>
            <polygon points="350,110 360,115 350,120" fill="#38bdf8"/>
            <!-- Caja de Movilidad Sustentable -->
            <rect x="370" y="35" width="270" height="160" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="1.5"/>
            <text x="390" y="62" fill="#38bdf8" font-size="12" font-weight="bold">Partición Modal Sustentable: 86.2%</text>
            <rect x="390" y="75" width="230" height="16" rx="4" fill="#1e293b"/>
            <rect x="390" y="75" width="94" height="16" rx="4" fill="#10b981"/>
            <text x="437" y="87" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">A pie: 41%</text>
            <rect x="484" y="75" width="83" height="16" fill="#0284c7"/>
            <text x="525" y="87" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">TP: 36%</text>
            <rect x="567" y="75" width="21" height="16" fill="#f59e0b"/>
            <text x="577" y="87" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">Bici</text>
            <text x="390" y="118" fill="#94a3b8" font-size="9.5">· Proximidad a Áreas Verdes: Buffer 400m</text>
            <text x="390" y="136" fill="#94a3b8" font-size="9.5">· Red de Cruces Semaforizados UOCT: 300m</text>
            <text x="390" y="154" fill="#94a3b8" font-size="9.5">· Monitoreo Acústico: Ejes >65 dBA</text>
            <text x="390" y="172" fill="#94a3b8" font-size="9.5">· Ratio Papeleros/Contenedores por Zona</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Generación Anual de RSD', valor: '189.510 toneladas', referencial: 'SUBDERE RSD 2024', fuente: 'Muestreo Oficial Comunal' },
          { variable: 'Zonas Operativas de Aseo', valor: '54 sectores', referencial: 'Cobertura 100% comunal', fuente: 'Dirección de Aseo y Ornato' },
          { variable: 'Modos Sustentables de Viaje', valor: '86.2%', referencial: 'SECTRA / Encuesta Origen Destino', fuente: 'MTT / UOCT 2026' },
          { variable: 'Proximidad Peatonal a Salud', valor: 'Buffer 500m (81.5%)', referencial: 'Estándar 15 minutos', fuente: 'DEIS / MINSAL IDE Chile' }
        ],
        cartografias: [
          { src: 'img/cartografias/pct_movilidad_sustentable.jpg', titulo: 'Movilidad Sustentable Total (%)', subtitulo: 'Desplazamientos no Motorizados (Caminata, Bici y TP)' },
          { src: 'img/cartografias/pct_movilidad_motorizada_privada.jpg', titulo: 'Movilidad Motorizada Privada (%)', subtitulo: 'Uso del Automóvil Particular en Viajes Cotidianos' },
          { src: 'img/cartografias/transporte_a_pie.jpg', titulo: 'Viajes a Pie (Caminata Peatonal)', subtitulo: 'Modo Principal de Transporte Peatonal por Manzana' },
          { src: 'img/cartografias/transporte_en_bicicleta_ciclovias.jpg', titulo: 'Viajes en Bicicleta y Ciclovías (%)', subtitulo: 'Uso de la Bicicleta e Infraestructura Ciclo-inclusiva' },
          { src: 'img/cartografias/utiliza_transporte_publico_porcentaje.jpg', titulo: 'Uso del Transporte Público (%)', subtitulo: 'Partición Modal en Buses Red y Metro de Santiago' },
          { src: 'img/cartografias/transporte_en_auto.jpg', titulo: 'Viajes en Automóvil Particular (%)', subtitulo: 'Concentración del Tráfico Vehicular Privado' },
          { src: 'img/cartografias/distancia_areas_verdes_todas.jpg', titulo: 'Distancia a Áreas Verdes (m)', subtitulo: 'Proximidad Peatonal a Parques y Plazas Públicas' },
          { src: 'img/cartografias/distancia_a_biodiversidad_total.jpg', titulo: 'Distancia a Biodiversidad Urbana (m)', subtitulo: 'Proximidad Física a Registro de Flora y Arbolado GBIF' },
          { src: 'img/cartografias/distancia_a_espacios_publicos_vgi.jpg', titulo: 'Distancia a Espacios Públicos VGI (m)', subtitulo: 'Proximidad a Red de Plazas Mapeadas en OSM' },
          { src: 'img/cartografias/distancia_a_salud_m_total.jpg', titulo: 'Distancia a Establecimientos de Salud (m)', subtitulo: 'Proximidad a CESFAM, Hospitales y Clínicas' },
          { src: 'img/cartografias/distancia_a_servicios_vgi_m.jpg', titulo: 'Distancia a Servicios y Comercio VGI (m)', subtitulo: 'Proximidad Peatonal a Almacenes y Equipamiento Local' },
          { src: 'img/cartografias/n_arboles_vgi_buffer500_m.jpg', titulo: 'Arbolado Urbano en Buffer 500m', subtitulo: 'Conteo de Especies Arbóreas en Radio Caminable' },
          { src: 'img/cartografias/n_edificaciones_buffer500m.jpg', titulo: 'Edificaciones en Buffer 500m', subtitulo: 'Densidad Edilicia en el Entorno Inmediato' },
          { src: 'img/cartografias/n_equip_educativos_buffer500_m_total.jpg', titulo: 'Equipamiento Educativo en Buffer 500m', subtitulo: 'Escuelas, Colegios y Universidades en Radio Caminable' },
          { src: 'img/cartografias/n_paraderos_bus_buffer500m.jpg', titulo: 'Paraderos de Buses en Buffer 500m', subtitulo: 'Cobertura de Puntos de Abordaje del Transporte Público' },
          { src: 'img/cartografias/n_patrimonios_500buffer_vgi.jpg', titulo: 'Inmuebles Patrimoniales en Buffer 500m', subtitulo: 'Densidad de Monumentos y Conservación Histórica' },
          { src: 'img/cartografias/n_semafotos_buffer_300_m.jpg', titulo: 'Cruces Semaforizados en Buffer 300m', subtitulo: 'Seguridad Vial y Semáforos Centralizados UOCT' },
          { src: 'img/cartografias/n_transporte_vgi_buffer_300_m.jpg', titulo: 'Entidades de Transporte en Buffer 300m', subtitulo: 'Accesibilidad Inmediata a la Malla de Transporte' },
          { src: 'img/cartografias/ruido_promedio_db_total.jpg', titulo: 'Ruido Ambiental Promedio (dBA)', subtitulo: 'Paisaje Sonoro y Presión Acústica Diurna y Nocturna' },
          { src: 'img/cartografias/n_cotizantes_ocupados_0_40_pct_total.jpg', titulo: 'Cotizantes Ocupados Vulnerables (%)', subtitulo: 'Ocupados Cotizantes en Tramo 0-40% RSH' },
          { src: 'img/cartografias/n_cotizantes_ocupados_total.jpg', titulo: 'Total Ocupados Cotizantes', subtitulo: 'Trabajadores Formales Registrados en el RSH' },
          { src: 'img/cartografias/n_dependencia_postrados_0_40_total.jpg', titulo: 'Dependencia Funcional Severa (RSH)', subtitulo: 'Personas en Situación de Dependencia y Cuidado' },
          { src: 'img/cartografias/n_ninos_adultos_mayores_adscritos_fonasa_0_40_total.jpg', titulo: 'FONASA Tramo A-B (0-40% RSH)', subtitulo: 'Niños y Adultos Mayores con Cobertura Pública de Salud' },
          { src: 'img/cartografias/n_personas_tramo_0_40_total.jpg', titulo: 'Población en Tramo 0-40% RSH', subtitulo: 'Población de Mayor Vulnerabilidad Socioeconómica' },
          { src: 'img/cartografias/zonas_de_aseo_munistgo.jpg', titulo: 'Zonas de Aseo Municipal Santiago', subtitulo: 'Sectorización Oficial del Servicio de Aseo Comunal' },
          { src: 'img/cartografias/ratio_contenedores_papeleros_zona_aseo.jpg', titulo: 'Ratio Contenedores / Papeleros', subtitulo: 'Equilibrio entre Capacidad Domiciliaria y Peatonal' },
          { src: 'img/cartografias/total_contenedores_por_zona_aseo.jpg', titulo: 'Total Contenedores por Zona de Aseo', subtitulo: 'Infraestructura de Depósito de Residuos Domiciliarios' },
          { src: 'img/cartografias/total_papeleros_por_zona_aseo.jpg', titulo: 'Total Papeleros por Zona de Aseo', subtitulo: 'Infraestructura de Aseo Peatonal en Vía Pública' },
          { src: 'img/cartografias/capacidad_total_litros_zona_aseo.jpg', titulo: 'Capacidad Total de Residuos (Litros)', subtitulo: 'Capacidad Volumétrica de Recolección de Aseo' }
        ],
        cuerpo: [
          'La alta compacidad de la Comuna de Santiago otorga ventajas superlativas para la movilidad no motorizada: más del 50% de los viajes cotidianos se realizan a pie o en bicicleta, lo que alivia la congestión metropolitana y disminuye la huella de carbono por habitante.',
          'Sin embargo, este dinamismo genera externalidades socioambientales críticas: los ejes de transporte de alta capacidad (como Alameda, Vicuña Mackenna, Santa Rosa y San Pablo) exhiben niveles de ruido ambiental promedio superiores a 65 dBA, exponiendo a miles de residentes a estrés acústico diurno y nocturno.',
          'Por otra parte, la gestión de residuos representa uno de los desafíos más complejos del metabolismo urbano: con más de 189.000 toneladas anuales de basura recolectadas, la relación entre papeleros peatonales y contenedores de alta capacidad varía fuertemente entre el distrito cívico y las zonas residenciales, lo que requiere un monitoreo continuo de la infraestructura de aseo para evitar la saturación en esquinas críticas.'
        ],
        conclusion: 'Avanzar hacia la justicia ambiental en Santiago exige equilibrar la dotación de áreas verdes hacia el poniente de la comuna, extender la red de ciclovías protegidas y optimizar el sistema de aseo y reciclaje con una perspectiva de economía circular.',
        analisisPorActor: [
          { id: 'institucion', icono: '🏛️', nombre: 'Institución / Autoridad Pública', subtitulo: 'Dirección de Aseo y Ornato · Dirección de Tránsito · DITEC', utilidad: 'Permite optimizar las rutas de recolección de aseo y balancear la dotación de contenedores y papeleros por zona.' },
          { id: 'comunidad', icono: '🏘️', nombre: 'Comunidad / Vecinal', subtitulo: 'Comités Ambientales Comunales · Organizaciones Ciclistas', utilidad: 'Entrega respaldo cartográfico para solicitar arborización urbana, reductores de velocidad y puntos limpios en zonas deficitarias.' },
          { id: 'voluntario', icono: '🗺️', nombre: 'Mapeador / Voluntario OSM', subtitulo: 'Comunidad Ciclista y Peatonal', utilidad: 'Orienta la actualización de atributos de estado de veredas, ciclovías segregadas y contenedores de reciclaje en OpenStreetMap.' },
          { id: 'ong', icono: '🔬', nombre: 'Investigadores / Academia', subtitulo: 'Ecología Urbana · Geografía Ambiental UAH', utilidad: 'Provee datos para calcular índices de justicia ambiental, metabolismo urbano y conectividad de parches verdes.' }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'zonas_aseo_munistgo', nombre: 'Zonas de Aseo y Catastro de Contenedores y Papeleros', institucion: 'Ilustre Municipalidad de Santiago (Oficio MU18117)', crs: 'EPSG:32719', tipo: 'Polígonos y Puntos' },
            { codigo: 'subdere_rsd', nombre: 'Registro de Residuos Sólidos Domiciliarios (RSD 2024)', institucion: 'SUBDERE / MMA', crs: 'EPSG:32719', tipo: 'Tabular / Comunal' },
            { codigo: 'red_movilidad_uoct', nombre: 'Red de Cruces Semaforizados y Movilidad UOCT', institucion: 'Unidad Operativa de Control de Tránsito (UOCT)', crs: 'EPSG:32719', tipo: 'Puntos y Líneas' }
          ],
          referenciasAcademicas: [
            { cita: 'Wolch, J. R., Byrne, J., & Newell, J. P. (2014). Urban green space, public health, and environmental justice. Landscape and Urban Planning, 125, 234-244.', concepto: 'Accesibilidad equitativa a espacios verdes y justicia ambiental en ciudades densas.' },
            { cita: 'Gehl, J. (2010). Cities for people. Island Press.', concepto: 'Diseño a escala humana, caminabilidad y vida en el espacio público urbano.' },
            { cita: 'Baccini, P., & Brunner, P. H. (2012). Metabolism of the anthroposphere: analysis, evaluation, design. MIT Press.', concepto: 'Marco conceptual del flujo metabólico de materiales y residuos en asentamientos humanos.' }
          ]
        }
      }
    }
  ];


  // Estado interno del módulo
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
          nombre: catFound.nombre, // NOMBRE EXACTO de Módulo 01
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
        nombre: def.nombre, // NOMBRE EXACTO de Módulo 01
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
      nombre: nombreFallback, // NOMBRE EXACTO de Módulo 01
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

    const totalCapasAtlas = 132; // 122 oficiales + 10 VGI
    
    contenedor.innerHTML = `
      <div class="modulo-indicadores-analisis-wrapper">

        <!-- Encabezado del Módulo (Centrado y Visualmente Destacado) -->
        <header class="header-modulo-indicadores">
          <div class="insignia-indicadores">
            <span class="punto-pulso"></span>
            MÓDULO 05 · ANÁLISIS MULTIDIMENSIONAL &amp; DATA STORYTELLING
          </div>
          <h2 class="titulo-modulo-indicadores">Indicadores de Análisis Territorial</h2>
          <p class="bajada-modulo-indicadores">
            Estructura analítica integrada para la gestión territorial y comunitaria. Las <strong>${totalCapasAtlas} capas del Atlas VGI</strong> (122 oficiales del Estado de Chile y 10 colaborativas OSM/GBIF) organizadas en <strong>5 dimensiones estratégicas</strong> con acceso directo al mapa interactivo y descarga de datos abiertos.
          </p>
          <div class="aviso-tentativo-banner">
            <span class="icono-aviso">ℹ️</span>
            <div class="texto-aviso">
              <strong>Módulo Analítico y Catálogo Tentativo en Desarrollo:</strong> Esta estructuración multidimensional y los storyboards barriales constituyen propuestas exploratorias en desarrollo colaborativo para el Departamento de Geografía UAH (Geografía UAH), orientadas a contrastar narrativas territoriales con la base de datos abierta formal.
            </div>
          </div>
        </header>

        <!-- ===================================================================== -->
        <!-- GRILLA DE LAS 5 GRANDES DIMENSIONES ANALÍTICAS                         -->
        <!-- ===================================================================== -->
        <section class="seccion-dimensiones-analisis" aria-label="Dimensiones de Análisis">
          <h3 class="subtitulo-centrado-seccion">Dimensiones Analíticas y Coberturas Asociadas</h3>
          
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
                    <button type="button" class="btn-zoom-miniatura" onclick="event.stopPropagation(); ModuloIndicadoresAnalisis.abrirLightboxImagenDeStoryboard('${sb.id}')" title="Ampliar imagen / cartografía en alta resolución">🔍</button>
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

    // Conteos por origen para los botones de filtro
    const conteoOficiales = dim.capasIds.filter(id => !id.startsWith('cat0') && !id.startsWith('cat1')).length;
    const conteoVGI = dim.capasIds.filter(id => id.startsWith('cat0') || id.startsWith('cat1')).length;

    // Generar tarjetas de capas con nombres EXACTOS de Módulo 01 y estética Atlas VGI
    const htmlCapas = dim.capasIds.map(capaId => {
      const info = resolverDefinicionCapa(capaId);
      const geomIcon = info.geometria.includes('POL') ? '⬡' : (info.geometria.includes('PUN') ? '●' : (info.geometria.includes('LÍN') ? '〰' : '◆'));
      const origenIcon = info.tipo === 'oficial' ? '🏛️' : '👥';

      return `
        <div class="tarjeta-capa-dimension ${info.tipo}" 
             data-tipo="${info.tipo}" 
             data-nombre="${info.nombre.toLowerCase()}" 
             data-institucion="${info.institucion.toLowerCase()}"
             data-codigo="${info.codigo.toLowerCase()}">
          <div class="tarjeta-capa-dim-header">
            <span class="pill-dim-codigo">${info.codigo}</span>
            <span class="pill-dim-origen ${info.tipo}">${origenIcon} ${info.sigla}</span>
            <span class="pill-dim-geom"><span style="opacity:0.75; margin-right:3px;">${geomIcon}</span>${info.geometria}</span>
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
      <div class="caja-acordeon-activa" style="border-top: 3px solid ${dim.color}; border-radius: 14px;">
        <div class="cabecera-acordeon-activa">
          <div class="titulo-con-icono-acordeon">
            <span class="icono-acordeon-mini" style="background:${dim.colorFondo}; border-color:${dim.colorBorde}; box-shadow:0 0 18px ${dim.colorFondo};">${dim.icono}</span>
            <div>
              <h4 class="titulo-acordeon-activa">Dimensión 0${dim.numero}: ${dim.nombre}</h4>
              <p class="subtitulo-acordeon-activa">${dim.enfoque}</p>
            </div>
          </div>
          <div class="acciones-cabecera-acordeon">
            <span class="badge-contador-capas-filtro" id="badge-contador-capas-dim">
              Mostrando ${dim.capasIds.length} de ${dim.capasIds.length} capas
            </span>
            <button type="button" class="btn-cerrar-acordeon" onclick="ModuloIndicadoresAnalisis.colapsarAcordeon()" aria-label="Cerrar acordeón">✕ Cerrar</button>
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
            <button type="button" class="btn-filtro-tipo" data-filtro="oficial" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('oficial')">🏛️ Oficiales Estado (${conteoOficiales})</button>
            <button type="button" class="btn-filtro-tipo" data-filtro="vgi" onclick="ModuloIndicadoresAnalisis.filtrarPorTipo('vgi')">👥 VGI Comunitario (${conteoVGI})</button>
          </div>
        </div>

        <!-- Grilla de Tarjetas de Capas -->
        <div class="grilla-capas-dimension" id="grilla-capas-dimension-items">
          ${htmlCapas}
          <div class="estado-vacio-capas-dim" id="estado-vacio-capas-dim" style="display:none;">
            <div class="icono-vacio-animado">🔍</div>
            <h5 class="titulo-vacio-capas">No se encontraron capas coincidentes</h5>
            <p class="desc-vacio-capas">No hay capas en esta dimensión que coincidan con los filtros aplicados.</p>
            <button type="button" class="btn-restablecer-filtros" onclick="ModuloIndicadoresAnalisis.restablecerFiltros()">Restablecer Búsqueda</button>
          </div>
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

    const estadoVacio = document.getElementById('estado-vacio-capas-dim');
    if (estadoVacio) {
      estadoVacio.style.display = (visibles === 0) ? 'flex' : 'none';
    }
  }

  /**
   * Restablece el buscador y los filtros a 'todos'
   */
  function restablecerFiltros() {
    const input = document.getElementById('input-buscador-capas-dim');
    if (input) input.value = '';
    queryFiltroActual = '';
    filtrarPorTipo('todos');
  }

  /**
   * Abre la lámina de lectura modal tipo blog para un Storyboard
   */
  function abrirLaminaStoryboard(storyboardId) {
    const sb = STORYBOARDS.find(s => s && s.id === storyboardId);
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

        <!-- Imagen Destacada del Storyboard (Clic para Ampliar) -->
        <figure class="figura-destacada-blog figura-ampliable" onclick="ModuloIndicadoresAnalisis.abrirLightboxImagenDeStoryboard('${sb.id}')" title="Haz clic para ampliar la imagen/cartografía en alta resolución">
          <div class="contenedor-imagen-ampliable">
            <img src="${sb.imagen}" alt="${sb.titulo}" class="img-destacada-blog">
            <div class="overlay-zoom-hover">
              <span class="badge-zoom-cta">🔍 Clic para ampliar en pantalla completa (Zoom HD)</span>
            </div>
          </div>
          <figcaption class="pie-figura-blog">
            Registro territorial contextualizado con las capas del Atlas VGI. <span class="nota-ampliable">· Clic en la imagen para ampliar en alta resolución ↗</span>
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

          <!-- Gráfico Comparativo / Benchmark (Clic para Ampliar) -->
          <div class="contenedor-grafico-comparativo contenedor-figura-ampliable" onclick="ModuloIndicadoresAnalisis.abrirLightboxGrafico('${sb.id}')" title="Haz clic para ampliar el gráfico comparativo en pantalla completa">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h5 class="titulo-grafico-comparativo" style="margin:0;">${sb.contenido.graficoComparativo.titulo}</h5>
              <span class="btn-micro-zoom" title="Ampliar gráfico">🔍 Ampliar Gráfico</span>
            </div>
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

          <!-- Diagrama Técnico Vectorial SVG (Clic para Ampliar) -->
          <div class="contenedor-diagrama-svg contenedor-figura-ampliable" onclick="ModuloIndicadoresAnalisis.abrirLightboxDiagrama('${sb.id}')" title="Haz clic para ampliar el diagrama vectorial en pantalla completa">
            <div class="header-diagrama-svg">
              <h5 class="titulo-diagrama-svg">📐 Diagrama Técnico de Análisis Espacial</h5>
              <div style="display:flex; gap:8px; align-items:center;">
                <span class="badge-fuente-datos">MODELACIÓN VECTORIAL SVG</span>
                <span class="btn-micro-zoom" title="Ampliar diagrama">🔍 Ampliar Diagrama</span>
              </div>
            </div>
            <div class="svg-diagrama-canvas-wrapper">
              ${typeof sb.contenido.diagramaSVG === 'function' ? sb.contenido.diagramaSVG() : ''}
            </div>
            <p class="pie-diagrama-svg">
              Diagrama conceptual interactivo fundamentado en los parámetros normativos y las capas del Atlas VGI. <span class="nota-ampliable">· Clic para ampliar ↗</span>
            </p>
          </div>

          
        <!-- ================================================================= -->
        <!-- SECCIÓN GALERÍA CARTOGRÁFICA COMPLETA                             -->
        <!-- ================================================================= -->
        ${Array.isArray(sb.contenido.cartografias) && sb.contenido.cartografias.length > 0 ? `
        <section class="seccion-galeria-cartografica" aria-label="Galería Cartográfica de la Historia">
          <div class="cabecera-galeria-cartografica">
            <h4>🗺️ Catálogo de Cartografías Georreferenciadas (${sb.contenido.cartografias.length} Láminas de Análisis Espacial)</h4>
            <p>A continuación se presenta el cuerpo cartográfico completo de este análisis. Haz clic sobre cualquier lámina para abrirla en pantalla completa con zoom interactivo de alta resolución.</p>
          </div>
          <div class="grilla-cartografias-storyboard">
            ${sb.contenido.cartografias.map((c) => `
              <div class="item-cartografia-galeria" 
                   role="button"
                   tabindex="0"
                   onclick="ModuloIndicadoresAnalisis.abrirLightboxImagen('${c.src}', '${c.titulo.replace(/'/g, "\\'")}', '${c.subtitulo.replace(/'/g, "\\'")}')"
                   title="Haz clic para ampliar: ${c.titulo}">
                <div class="thumb-cartografia-wrapper">
                  <img src="${c.src}" alt="${c.titulo}" loading="lazy" class="img-thumb-cartografia">
                  <span class="btn-micro-zoom-carto">🔍 Ampliar HD</span>
                </div>
                <div class="meta-thumb-cartografia">
                  <h6 class="titulo-thumb-carto">${c.titulo}</h6>
                  <span class="sub-thumb-carto">${c.subtitulo}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>` : ''}

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
                ${Array.isArray(sb.contenido.tablaIndicadores) ? sb.contenido.tablaIndicadores.map(row => `
                  <tr>
                    <td><strong>${row.variable}</strong></td>
                    <td class="valor-dato">${row.valor}</td>
                    <td class="valor-referencial">${row.referencial}</td>
                    <td><span class="pill-dim-origen oficial" style="font-size:0.68rem;">${row.fuente}</span></td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Cuerpo del Artículo Blog (Párrafos Analíticos) -->
        <div class="cuerpo-narrativo-blog">
          ${Array.isArray(sb.contenido.cuerpo) ? sb.contenido.cuerpo.map(p => `<p class="parrafo-blog">${p}</p>`).join('') : ''}
        </div>

        <!-- Conclusión / Reflexión de Gestión Territorial -->
        ${sb.contenido.conclusion ? `
        <blockquote class="conclusion-destacada-blog">
          <p>${sb.contenido.conclusion}</p>
        </blockquote>` : ''}

        <!-- ================================================================= -->
        <!-- SECCIÓN 4 USUARIOS-TIPO: RELEVANCIA Y UTILIDAD TERRITORIAL        -->
        <!-- ================================================================= -->
        <section class="seccion-actores-territoriales-storyboard" aria-label="Utilidad para los 4 Usuarios-Tipo">
          <div class="cabecera-seccion-actores">
            <h4>🎯 Relevancia y Utilidad según Perfil de Actor Territorial (4 Usuarios-Tipo)</h4>
            <span class="badge-fuente-datos">ENFOQUE MULTI-ACTOR</span>
          </div>
          <div class="grilla-actores-storyboard">
            ${Array.isArray(sb.contenido.analisisPorActor) ? sb.contenido.analisisPorActor.map(actor => `
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
            `).join('') : ''}
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
                  ${(sb.contenido.apartadoBibliografico && Array.isArray(sb.contenido.apartadoBibliografico.fuentesDatos)) ? sb.contenido.apartadoBibliografico.fuentesDatos.map(fd => `
                    <tr>
                      <td><code style="color:#38bdf8;">${fd.codigo}</code></td>
                      <td><strong>${fd.nombre}</strong></td>
                      <td>${fd.institucion}</td>
                      <td>${fd.crs}</td>
                      <td><span class="pill-dim-geom" style="font-size:0.65rem;">${fd.tipo}</span></td>
                    </tr>
                  `).join('') : ''}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Referencias Teórico-Metodológicas / Autores -->
          <div>
            <h5 class="subtitulo-bloque-biblio">2. Referencias Teórico-Metodológicas y Autores Clave</h5>
            <ul class="lista-referencias-apa">
              ${(sb.contenido.apartadoBibliografico && Array.isArray(sb.contenido.apartadoBibliografico.referenciasAcademicas)) ? sb.contenido.apartadoBibliografico.referenciasAcademicas.map(ref => `
                <li class="item-referencia-apa">
                  <strong>${ref.cita}</strong>
                  <span class="nota-marco-conceptual">${ref.concepto}</span>
                </li>
              `).join('') : ''}
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
            * Este storyboard forma parte de los entregables exploratorios y análisis cuali-cuantitativos del Atlas VGI Territorial — Geografía UAH (Geografía UAH). Datos obtenidos estrictamente de las fuentes formales del Atlas VGI (IDE Chile, MINVU, INE Censo 2024, UOCT/MTT, MDSF BiDat, OpenStreetMap contributors y GBIF.org).
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
    cerrarLightboxFigura();
    const overlay = document.getElementById('lamina-storyboard-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // =========================================================================
  // SISTEMA UNIVERSAL DE LIGHTBOX / ZOOM DE FIGURAS Y CARTOGRAFÍA
  // =========================================================================

  const lightboxState = {
    abierto: false,
    zoom: 1.0,
    minZoom: 0.5,
    maxZoom: 4.5,
    panX: 0,
    panY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    urlRecurso: ''
  };

  function asegurarLightboxEnDOM() {
    if (typeof document === 'undefined') return null;
    let overlay = document.getElementById('lightbox-figura-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lightbox-figura-overlay';
      overlay.id = 'lightbox-figura-overlay';
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      overlay.innerHTML = `
        <div class="lightbox-figura-contenedor" id="lightbox-figura-contenedor">
          <header class="lightbox-header">
            <div class="lightbox-info-titulo">
              <span class="lightbox-tipo-badge" id="lightbox-tipo-badge">🗺️ CARTOGRAFÍA HD</span>
              <h3 class="lightbox-titulo" id="lightbox-titulo">Figura Ampliada</h3>
              <span class="lightbox-subtitulo" id="lightbox-subtitulo">Visualización completa en alta resolución</span>
            </div>
            <div class="lightbox-controles">
              <button type="button" class="btn-control-lightbox" id="btn-lightbox-zoom-in" title="Acercar (+)">＋</button>
              <button type="button" class="btn-control-lightbox" id="btn-lightbox-zoom-out" title="Alejar (-)">－</button>
              <button type="button" class="btn-control-lightbox" id="btn-lightbox-zoom-reset" title="Restablecer tamaño (100%)">⟲ 100%</button>
              <a id="btn-lightbox-abrir-nueva-pestana" href="#" target="_blank" rel="noopener" class="btn-control-lightbox" title="Abrir recurso original en pestaña nueva ↗">↗</a>
              <button type="button" class="btn-control-lightbox btn-cerrar-lightbox" id="btn-cerrar-lightbox" title="Cerrar (ESC)">✕</button>
            </div>
          </header>

          <div class="lightbox-viewport" id="lightbox-viewport">
            <div class="lightbox-canvas" id="lightbox-canvas"></div>
          </div>

          <footer class="lightbox-footer">
            <span class="lightbox-ayuda-teclado">💡 <strong>[ESC]</strong> Cerrar · <strong>[Rueda Ratón]</strong> Zoom · <strong>[Arrastrar]</strong> Desplazar</span>
            <span class="lightbox-escala-indicador" id="lightbox-escala-indicador">Escala: 100%</span>
          </footer>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Configurar listeners una sola vez
    if (!overlay.dataset || !overlay.dataset.listenersConfigurados) {
      if (overlay.dataset) overlay.dataset.listenersConfigurados = 'true';

      const btnCerrar = overlay.querySelector('#btn-cerrar-lightbox');
      if (btnCerrar) btnCerrar.onclick = cerrarLightboxFigura;

      const btnIn = overlay.querySelector('#btn-lightbox-zoom-in');
      if (btnIn) btnIn.onclick = () => aplicarZoom(0.25);

      const btnOut = overlay.querySelector('#btn-lightbox-zoom-out');
      if (btnOut) btnOut.onclick = () => aplicarZoom(-0.25);

      const btnReset = overlay.querySelector('#btn-lightbox-zoom-reset');
      if (btnReset) btnReset.onclick = () => aplicarZoom(0, true);

      // Cerrar al hacer clic en el backdrop
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cerrarLightboxFigura();
        }
      });

      // Viewport Pan y Zoom
      const viewport = overlay.querySelector('#lightbox-viewport');
      if (viewport) {
        viewport.addEventListener('mousedown', (e) => {
          if (e.target.closest && (e.target.closest('.lightbox-header') || e.target.closest('.lightbox-footer') || e.target.closest('button') || e.target.closest('a'))) return;
          lightboxState.isDragging = true;
          lightboxState.startX = e.clientX - lightboxState.panX;
          lightboxState.startY = e.clientY - lightboxState.panY;
          viewport.classList.add('is-dragging');
        });

        if (typeof window !== 'undefined') {
          window.addEventListener('mousemove', (e) => {
            if (!lightboxState.isDragging) return;
            e.preventDefault();
            lightboxState.panX = e.clientX - lightboxState.startX;
            lightboxState.panY = e.clientY - lightboxState.startY;
            actualizarTransformCanvas();
          });

          window.addEventListener('mouseup', () => {
            if (lightboxState.isDragging) {
              lightboxState.isDragging = false;
              viewport.classList.remove('is-dragging');
            }
          });

          viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.2 : -0.2;
            aplicarZoom(delta);
          }, { passive: false });

          viewport.addEventListener('dblclick', (e) => {
            if (e.target.closest && (e.target.closest('button') || e.target.closest('a'))) return;
            if (lightboxState.zoom > 1.1) {
              aplicarZoom(0, true);
            } else {
              aplicarZoom(0.8);
            }
          });

          // Teclado
          window.addEventListener('keydown', (e) => {
            if (!lightboxState.abierto) return;
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              cerrarLightboxFigura();
            } else if (e.key === '+' || e.key === '=') {
              e.preventDefault();
              aplicarZoom(0.25);
            } else if (e.key === '-' || e.key === '_') {
              e.preventDefault();
              aplicarZoom(-0.25);
            } else if (e.key === '0') {
              e.preventDefault();
              aplicarZoom(0, true);
            }
          });
        }
      }
    }

    return overlay;
  }

  function actualizarTransformCanvas() {
    if (typeof document === 'undefined') return;
    const canvas = document.getElementById('lightbox-canvas');
    const indicador = document.getElementById('lightbox-escala-indicador');
    if (canvas && canvas.style) {
      canvas.style.transform = `translate(${lightboxState.panX}px, ${lightboxState.panY}px) scale(${lightboxState.zoom})`;
    }
    if (indicador) {
      indicador.textContent = `Escala: ${Math.round(lightboxState.zoom * 100)}%`;
    }
  }

  function aplicarZoom(delta, reset = false) {
    if (reset) {
      lightboxState.zoom = 1.0;
      lightboxState.panX = 0;
      lightboxState.panY = 0;
    } else {
      const nuevoZoom = Math.max(lightboxState.minZoom, Math.min(lightboxState.maxZoom, lightboxState.zoom + delta));
      lightboxState.zoom = parseFloat(nuevoZoom.toFixed(2));
    }
    actualizarTransformCanvas();
  }

  function abrirLightboxGenerico(htmlContenido, badgeTexto, tituloTexto, subtituloTexto, urlRecurso = null) {
    const overlay = asegurarLightboxEnDOM();
    if (!overlay) return;
    const canvas = document.getElementById('lightbox-canvas');
    const badge = document.getElementById('lightbox-tipo-badge');
    const titulo = document.getElementById('lightbox-titulo');
    const subtitulo = document.getElementById('lightbox-subtitulo');
    const btnPestana = document.getElementById('btn-lightbox-abrir-nueva-pestana');

    if (canvas) canvas.innerHTML = htmlContenido;
    if (badge) badge.textContent = badgeTexto;
    if (titulo) titulo.textContent = tituloTexto;
    if (subtitulo) subtitulo.textContent = subtituloTexto;

    if (btnPestana) {
      if (urlRecurso) {
        btnPestana.href = urlRecurso;
        btnPestana.style.display = 'inline-flex';
      } else {
        btnPestana.style.display = 'none';
      }
    }

    lightboxState.abierto = true;
    lightboxState.zoom = 1.0;
    lightboxState.panX = 0;
    lightboxState.panY = 0;
    actualizarTransformCanvas();

    if (overlay.style) overlay.style.display = 'flex';
    if (overlay.setAttribute) overlay.setAttribute('aria-hidden', 'false');
    if (typeof document !== 'undefined' && document.body && document.body.style) {
      document.body.style.overflow = 'hidden';
    }
  }

  function abrirLightboxImagenDeStoryboard(storyboardId) {
    const sb = STORYBOARDS.find(s => s && s.id === storyboardId);
    if (!sb) return;
    abrirLightboxImagen(sb.imagen, sb.titulo, sb.dimensionNombre);
  }

  function abrirLightboxImagen(src, titulo, subtitulo) {
    const html = `<img src="${src}" alt="${titulo}" id="img-lightbox-activa" draggable="false">`;
    abrirLightboxGenerico(html, '🗺️ CARTOGRAFÍA / IMAGEN HD', titulo, subtitulo || 'Visualización completa en alta resolución', src);
  }

  function abrirLightboxDiagrama(storyboardId) {
    const sb = STORYBOARDS.find(s => s && s.id === storyboardId);
    if (!sb) return;
    const svgContent = typeof sb.contenido.diagramaSVG === 'function' ? sb.contenido.diagramaSVG() : '<p>Diagrama no disponible</p>';
    abrirLightboxGenerico(svgContent, '📐 DIAGRAMA TÉCNICO VECTORIAL', `Diagrama: ${sb.titulo}`, 'Modelación conceptual vectorial en escala ampliada', null);
  }

  function abrirLightboxGrafico(storyboardId) {
    const sb = STORYBOARDS.find(s => s && s.id === storyboardId);
    if (!sb || !sb.contenido.graficoComparativo) return;
    const g = sb.contenido.graficoComparativo;
    const html = `
      <div class="lightbox-chart-content">
        <h3 style="color:#ffffff; margin:0 0 16px 0; font-size:1.3rem;">📊 ${g.titulo}</h3>
        <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:24px;">Análisis estadístico y distribución porcentual parametrizada para Barrio Brasil y la Comuna de Santiago.</p>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${g.filas.map(f => `
            <div style="display:grid; grid-template-columns: 260px 1fr 100px; align-items:center; gap:16px;">
              <span style="color:#f1f5f9; font-weight:700; font-size:0.95rem;">${f.label}</span>
              <div style="height:20px; background:rgba(0,0,0,0.5); border-radius:6px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
                <div style="height:100%; width:${f.porcentaje}%; background:linear-gradient(90deg, #0284c7 0%, #38bdf8 100%); border-radius:6px;"></div>
              </div>
              <span style="color:#38bdf8; font-weight:800; font-family:var(--fuente-datos, monospace); font-size:1.05rem; text-align:right;">${f.valor}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    abrirLightboxGenerico(html, '📈 GRÁFICO COMPARATIVO & BENCHMARK', `Benchmark: ${g.titulo}`, 'Distribución métrica y comparativa ampliada', null);
  }

  function cerrarLightboxFigura() {
    if (typeof document === 'undefined') return;
    const overlay = document.getElementById('lightbox-figura-overlay');
    if (overlay) {
      if (overlay.style) overlay.style.display = 'none';
      if (overlay.setAttribute) overlay.setAttribute('aria-hidden', 'true');
    }
    lightboxState.abierto = false;
    lightboxState.zoom = 1.0;
    lightboxState.panX = 0;
    lightboxState.panY = 0;

    // Si la lámina modal está abierta, mantener body overflow hidden
    const laminaOverlay = document.getElementById('lamina-storyboard-overlay');
    if (laminaOverlay && laminaOverlay.style && laminaOverlay.style.display !== 'none') {
      if (document.body && document.body.style) document.body.style.overflow = 'hidden';
    } else {
      if (document.body && document.body.style) document.body.style.overflow = '';
    }
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
    const sb = STORYBOARDS.find(s => s && s.id === storyboardId);
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
    restablecerFiltros,
    abrirLaminaStoryboard,
    cerrarLaminaStoryboard,
    abrirLightboxImagenDeStoryboard,
    abrirLightboxImagen,
    abrirLightboxDiagrama,
    abrirLightboxGrafico,
    abrirLightboxGenerico,
    cerrarLightboxFigura,
    aplicarZoom,
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
