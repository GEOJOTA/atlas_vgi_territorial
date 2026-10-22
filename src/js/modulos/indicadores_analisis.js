/*
  indicadores_analisis.js
  -----------------------
  Módulo de Indicadores de Análisis Multidimensional y Storyboards Territoriales de Barrio Brasil.
  Atlas VGI Territorial — Geografía UAH — Geografía Universidad Alberto Hurtado (2026).

  Estructura y Principios:
  1. Agrupación analítica de las 131 capas del Atlas (121 Oficiales + 10 VGI) en 5 Dimensiones Estratégicas:
     - 1) Sociodemográfica (19 capas)
     - 2) Socioeconómica (18 capas)
     - 3) Socioambiental (36 capas)
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
  // 2. DEFINICIÓN DE LAS 5 DIMENSIONES ESTRATÉGICAS (131 CAPAS TOTALES)
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
            subtitulo: 'Geografía UAH · Geografía UAH',
            utilidad: 'Aporta insumos empíricos georreferenciados (EPSG:32719) para modelar la elasticidad del valor de suelo (SII) versus la protección patrimonial (MINVU) en el marco de la investigación territorial.'
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
            utilidad: 'Proporciona una base espacial verificada para estudios de justicia ambiental, confort bioclimático e islas de calor urbanas en el marco del Geografía UAH.'
          }
        ],

        // APARTADO BIBLIOGRÁFICO Y TRAZABILIDAD
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'minvu_ipt_areas_verdes', nombre: 'Áreas Verdes Normativas (MINVU / INE 2023)', institucion: 'MINVU / INE', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'cat05_espacio_publico', nombre: 'Áreas Verdes y Espacio Público', institucion: 'OpenStreetMap Contributors / UAH', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'cat08_biodiversidad', nombre: 'Biodiversidad Urbana (Catastro de Flora y Fauna)', institucion: 'GBIF.org / iNaturalist / UAH', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'cat10_cobertura_suelo', nombre: 'Coberturas y Usos de Suelo', institucion: 'OpenStreetMap Contributors / Geografía UAH', crs: 'EPSG:4326', tipo: 'Polígono' },
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
            subtitulo: 'Economía Urbana · Geografía UAH UAH',
            utilidad: 'Caso de estudio empírico sobre economías urbanas de proximidad, gentrificación estudiantil y conservación del patrimonio en el marco del proyecto Atlas VGI.'
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
            subtitulo: 'Geografías del Cuidado · Geografía UAH UAH',
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
    },
    {
      id: 'storyboard-residuos-metabolismo-rsd',
      titulo: '6. Metabolismo Urbano y Residuos Sólidos Domiciliarios (SUBDERE RSD 2024)',
      bajada: 'Análisis del flujo metabólico de las 189.510 toneladas anuales de residuos de Santiago Centro y del impacto del polo gastronómico en la huella socioambiental del Barrio Brasil.',
      dimensionId: 'dim-socioambiental',
      dimensionNombre: 'Socioambiental & Metabolismo Urbano',
      fecha: 'Octubre 2026',
      autor: 'Equipo Geografía UAH · Geografía UAH',
      tiempoLectura: '6 min lectura',
      imagen: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      tags: ['Residuos Sólidos (SUBDERE)', 'Metabolismo Urbano', 'Estación Quilicura', 'Loma Los Colorados'],
      capasRelevantes: ['bbdd_86', 'bbdd_87', 'bbdd_89', 'bbdd_91', 'bbdd_94', 'cat03_comercio'],
      contenido: {
        introduccion: `Al cruzar las 13 nuevas capas del Catastro Nacional de Residuos Sólidos Domiciliarios (SUBDERE 2024, BBDD-86 a BBDD-98) con la carga comercial y residencial del Barrio Brasil, queda a la vista el metabolismo oculto del centro histórico: la comuna de Santiago genera 500,78 kg/hab/año (1,37 kg/hab/día), sumando 189.510 toneladas anuales que recorren 12,1 km hasta la Estación de Transferencia Quilicura y luego otros 49,0 km por ferrocarril de carga hasta el Relleno Sanitario Loma Los Colorados en Tiltil (61,1 km totales de ruta logística), con un costo municipal SINIM de $14.845 millones de pesos al año.`,
        datosClave: [
          { valor: '500,8 kg', label: 'Generación per cápita anual', sub: 'SUBDERE RSD 2024 Santiago (1,37 kg/día)' },
          { valor: '189.510 t', label: 'Tonelaje anual comunal', sub: 'RSD recolectadas en Santiago Centro' },
          { valor: '61,1 km', label: 'Ruta metabólica total', sub: 'Barrio Brasil → Quilicura → Tiltil' },
          { valor: '$14.845 M', label: 'Gasto anual municipal de aseo', sub: 'SINIM 2024 (Presupuesto comunal)' }
        ],
        porcentajesClave: [
          { label: 'Generación per Cápita de Santiago vs. Promedio Nacional', valor: '+19.8%', porcentaje: 78.5, contexto: '500,8 kg/hab/año en Santiago Centro frente a 418,0 kg promedio país' },
          { label: 'Distancia Logística en Tren de Carga (Quilicura - Tiltil)', valor: '80.2%', porcentaje: 80.2, contexto: '49,0 km en ferrocarril de los 61,1 km totales reducen la huella vial urbana' },
          { label: 'Gasto Operativo de Aseo sobre Presupuesto Municipal', valor: '6.8%', porcentaje: 68.0, contexto: '$14.845 millones CLP anuales destinados a recolección y disposición (SINIM)' },
          { label: 'Patentes de Consumo y Gastronomía en Barrio Brasil', valor: '51.4%', porcentaje: 51.4, contexto: '196 patentes de alcoholes y gastronomía sobre 381 locales comerciales' }
        ],
        graficoComparativo: {
          titulo: 'Comparativa de Generación de Residuos Sólidos Domiciliarios (kg/hab/año — SUBDERE 2024)',
          filas: [
            { label: 'Santiago Centro (Alta carga flotante y gastronómica)', valor: '500,8 kg', porcentaje: 83.5 },
            { label: 'Promedio Región Metropolitana (RM)', valor: '452,4 kg', porcentaje: 75.4 },
            { label: 'Promedio Nacional Chile (SUBDERE 2024)', valor: '418,0 kg', porcentaje: 69.7 },
            { label: 'Meta OCDE con Valorización Orgánica', valor: '310,0 kg', porcentaje: 51.7 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 760 200" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:rgba(15,23,42,0.7); border-radius:10px; border:1px solid rgba(56,189,248,0.2); padding:10px;">
            <defs>
              <marker id="arrowRSD" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" />
              </marker>
            </defs>
            <!-- Nodo 1: Barrio Brasil -->
            <rect x="20" y="35" width="195" height="130" rx="10" fill="rgba(245,158,11,0.14)" stroke="#f59e0b" stroke-width="2"/>
            <text x="117" y="62" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">1. ORIGEN: BARRIO BRASIL</text>
            <text x="117" y="84" fill="#e2e8f0" font-size="11" text-anchor="middle">• 500,78 kg/hab/año (Santiago)</text>
            <text x="117" y="102" fill="#e2e8f0" font-size="11" text-anchor="middle">• 189.510 ton/año comunales</text>
            <text x="117" y="120" fill="#cbd5e1" font-size="10.5" text-anchor="middle">• 381 patentes comerciales</text>
            <text x="117" y="138" fill="#cbd5e1" font-size="10.5" text-anchor="middle">• 196 patentes alcohol/gastro</text>

            <!-- Flecha 1 -->
            <line x1="215" y1="100" x2="275" y2="100" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrowRSD)"/>
            <text x="245" y="88" fill="#38bdf8" font-size="10.5" font-weight="bold" text-anchor="middle">12,1 km</text>
            <text x="245" y="118" fill="#94a3b8" font-size="9.5" text-anchor="middle">Camión</text>

            <!-- Nodo 2: Quilicura -->
            <rect x="280" y="35" width="195" height="130" rx="10" fill="rgba(56,189,248,0.14)" stroke="#38bdf8" stroke-width="2"/>
            <text x="377" y="62" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">2. E.T. QUILICURA (BBDD-87)</text>
            <text x="377" y="84" fill="#e2e8f0" font-size="11" text-anchor="middle">• Estación de Transferencia</text>
            <text x="377" y="102" fill="#e2e8f0" font-size="11" text-anchor="middle">• Compactación intermedia</text>
            <text x="377" y="120" fill="#cbd5e1" font-size="10.5" text-anchor="middle">• Trasvase a vagones de tren</text>
            <text x="377" y="138" fill="#cbd5e1" font-size="10.5" text-anchor="middle">• Reducción huella vial</text>

            <!-- Flecha 2 -->
            <line x1="475" y1="100" x2="535" y2="100" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrowRSD)"/>
            <text x="505" y="88" fill="#38bdf8" font-size="10.5" font-weight="bold" text-anchor="middle">49,0 km</text>
            <text x="505" y="118" fill="#94a3b8" font-size="9.5" text-anchor="middle">Ferrocarril</text>

            <!-- Nodo 3: Tiltil -->
            <rect x="540" y="35" width="200" height="130" rx="10" fill="rgba(239,68,68,0.14)" stroke="#ef4444" stroke-width="2"/>
            <text x="640" y="62" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">3. TILTIL (BBDD-86)</text>
            <text x="640" y="84" fill="#e2e8f0" font-size="11" text-anchor="middle">• Relleno Loma Los Colorados</text>
            <text x="640" y="102" fill="#e2e8f0" font-size="11" text-anchor="middle">• Distancia total: 61,1 km</text>
            <text x="640" y="120" fill="#cbd5e1" font-size="10.5" text-anchor="middle">• Costo: $14.845 M CLP/año</text>
            <text x="640" y="138" fill="#cbd5e1" font-size="10.5" text-anchor="middle">• Pasivo socioambiental norte</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Generación per cápita anual (RSD)', valor: '500,78 kg/hab/año (1,37 kg/día)', referencial: '418,0 kg/hab/año (Promedio Nacional)', fuente: 'SUBDERE 2024 (bbdd_86 / bbdd_91)' },
          { variable: 'Tonelaje total anual comunal', valor: '189.510 ton/año', referencial: '519,2 ton/día comunales', fuente: 'SUBDERE 2024 (bbdd_86 / bbdd_87)' },
          { variable: 'Estación de Transferencia intermedia', valor: 'E.T. Quilicura (12,1 km)', referencial: 'Operación KDM / EFE Trenes', fuente: 'SUBDERE 2024 (bbdd_87 / bbdd_91)' },
          { variable: 'Sitio de Disposición Final', valor: 'Loma Los Colorados, Tiltil (61,1 km)', referencial: '49 km en ferrocarril de carga', fuente: 'SUBDERE 2024 (bbdd_86 / bbdd_94)' },
          { variable: 'Costo anual municipal de aseo (SINIM)', valor: '$14.845.120.000 CLP/año', referencial: 'Presupuesto Operativo Comunal', fuente: 'SINIM / SUBDERE 2024' }
        ],
        cuerpo: [
          `A diferencia de un barrio exclusivamente residencial, el Barrio Brasil combina una población flotante universitaria (Campus UAH y ejes de Alameda) con una altísima concentración de patentes comerciales (381 locales formales) y patentes de alcoholes y gastronomía nocturna (196 locales en el entorno de Av. Brasil, Huérfanos y Compañía). Mientras una manzana residencial interior genera residuos de forma estable, los corredores gastronómicos multiplican la carga orgánica, vidrios y embalajes durante las noches de jueves a sábado, saturando los puntos de acopio en veredas estrechas y esquinas patrimoniales.`,
          `Los datos oficiales de SUBDERE 2024 (BBDD-86 a BBDD-98) muestran que la comuna de Santiago no dispone de sitios de tratamiento dentro de su propio territorio. Todo camión recolector que sale del Barrio Brasil debe trasladarse 12,1 km hacia el norte hasta la Estación de Transferencia Quilicura (BBDD-87 y BBDD-91, operada por KDM). Allí los residuos se compactan en contenedores cerrados y se embarcan en trenes de carga que recorren otros 49,0 km hasta el Relleno Sanitario Loma Los Colorados en la comuna de Tiltil (BBDD-86). Esta exportación cotidiana de desechos refleja una marcada asimetría socioambiental a escala metropolitana.`,
          `Con un gasto municipal que supera los $14.845 millones anuales (SINIM 2024), reducir el volumen enviado a Tiltil pasa por intervenir directamente en la fuente. En un barrio predominantemente aristocrático y residencial histórico, con 9 cités catastrados y decenas de edificios y corredores comerciales, la separación en origen de residuos orgánicos de restaurantes y el fortalecimiento de puntos limpios de proximidad (integrados en las capas VGI de equipamiento comunitario) permiten bajar los microbasurales en esquinas críticas y aliviar el presupuesto comunal.`
        ],
        conclusion: `El análisis del metabolismo urbano de Barrio Brasil evidencia cómo las dinámicas comerciales y residenciales del centro histórico se sustentan en una red logística que externaliza sus impactos ambientales hacia comunas periféricas como Tiltil. Avanzar hacia modelos de valorización orgánica y economía circular barrial es una urgencia de justicia socioambiental metropolitana.`,
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'Dirección de Aseo Municipal · SUBDERE · Ministerio del Medio Ambiente',
            utilidad: 'Permite optimizar las frecuencias y horarios de recolección nocturna en los ejes gastronómicos (Av. Brasil, Compañía, Huérfanos) y planificar contenedores soterrados o puntos limpios bajo la Ley REP.'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Juntas de Vecinos Barrio Brasil · Comités de Administración y Cités',
            utilidad: 'Entrega datos cuantitativos para exigir fiscalización sobre el manejo de basura de locales comerciales y organizar redes de reciclaje y vermicompostaje al interior de cités y edificios.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Comunidad OpenStreetMap Chile · Estudiantes Geografía UAH',
            utilidad: 'Guía el mapeo colaborativo (amenity=recycling, amenity=waste_basket, microbasurales recurrentes) para cruzar la oferta real de contenedores barriales con las capas macro de SUBDERE.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Ecología Política Urbana · Geografía UAH · Geografía UAH',
            utilidad: 'Conecta la escala micro del consumo barrial y la gentrificación comercial con la escala macro de la justicia ambiental metropolitana entre el centro histórico y Tiltil.'
          }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'bbdd_86', nombre: 'Disposición Final de Residuos Sólidos Domiciliarios (SUBDERE 2024)', institucion: 'SUBDERE — Programa Nacional de Residuos Sólidos', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_87', nombre: 'Estaciones de Transferencia de RSD (SUBDERE 2024)', institucion: 'SUBDERE', crs: 'EPSG:4326', tipo: 'Punto' },
            { codigo: 'bbdd_91', nombre: 'Flujos y Rutas de Transferencia de RSD (SUBDERE 2024)', institucion: 'SUBDERE', crs: 'EPSG:4326', tipo: 'Línea/Punto' },
            { codigo: 'bbdd_94', nombre: 'Rellenos Sanitarios Operativos (SUBDERE 2024)', institucion: 'SUBDERE / MMA', crs: 'EPSG:4326', tipo: 'Polígono/Punto' },
            { codigo: 'cat03_comercio', nombre: 'Comercio y Servicios Cotidianos (OSM)', institucion: 'OpenStreetMap Contributors', crs: 'EPSG:4326', tipo: 'Punto' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Heynen, N., Kaika, M., & Swyngedouw, E. (2006). In the nature of cities: Urban political ecology and the politics of urban metabolism. Routledge.',
              concepto: 'Aporte teórico: El metabolismo urbano como flujo socioecológico desigual donde el centro consume recursos y externaliza sus desechos hacia periferias de sacrificio.'
            },
            {
              cita: 'SUBDERE. (2024). Catastro Nacional de Instalaciones de Recepción y Disposición Final de Residuos Sólidos Domiciliarios (RSD) y Diccionario Técnico Geodatabase.',
              concepto: 'Aporte empírico: Fuente oficial de las 13 capas de infraestructura de residuos integradas en el Atlas y sus descriptores técnicos por columna.'
            }
          ]
        }
      }
    },
    {
      id: 'storyboard-evolucion-normativa-prc',
      titulo: '7. Treinta Años de Disputa Normativa: Las Modificaciones al PRC en Barrio Brasil (1990–2024)',
      bajada: 'Cómo 10 modificaciones históricas al Plan Regulador Comunal de Santiago frenaron la demolición masiva, protegieron los 9 cités catastrados y moldearon la frontera entre torres y casonas.',
      dimensionId: 'dim-sociourbana',
      dimensionNombre: 'Sociourbana, Normativa & Patrimonio',
      fecha: 'Octubre 2026',
      autor: 'Equipo Geografía UAH · Geografía UAH',
      tiempoLectura: '6 min lectura',
      imagen: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      tags: ['Modificaciones PRC', 'Conservación Histórica', 'Cités (Enmienda N° 2)', 'Rent Gap Inmobiliario'],
      capasRelevantes: ['minvu_prc', 'minvu_patrimonio', 'cmn_monumentos', 'cat02_vivienda'],
      contenido: {
        introduccion: `El paisaje actual del Barrio Brasil —donde conviven 135 predios históricos de 1 a 2 pisos y 9 cités catastrados junto a torres puntuales de hasta 21 pisos— no es casualidad: es el resultado directo de más de tres décadas de reformas al Plan Regulador Comunal (PRC) de Santiago (documentadas en el repositorio histórico oficial de Asesoría Urbana). Mientras el PRC de 1990 dejó ventanas abiertas a la densificación en altura por rasantes, la movilización vecinal y técnica impulsó el Seccional Barrio Brasil, las Modificaciones N° 16, N° 21 y N° 26, la Enmienda N° 2 de Cités (2014) y las Enmiendas de Altura N° 1, 3 y 6, consolidando la Zona de Conservación Histórica B1.`,
        datosClave: [
          { valor: '10 Hitos', label: 'Modificaciones y Enmiendas', sub: 'PRC Santiago 1990–2024' },
          { valor: '80,4%', label: 'Protección Patrimonial', sub: 'Superficie en Zona B y ZCH B1' },
          { valor: '9 Cités', label: 'Catastro Oficial Cités', sub: 'Enmienda N° 2 y BBDD-19' },
          { valor: '135 vs 4', label: 'Morfología Edificada', sub: 'Predios ≤2 pisos vs Torres ≥9 pisos' }
        ],
        porcentajesClave: [
          { label: 'Superficie de Barrio Brasil bajo Conservación Histórica (ZCH B1)', valor: '80.4%', porcentaje: 80.4, contexto: 'Zona B y Seccional Brasil protegen 60,2 ha de las 74,8 ha totales del barrio' },
          { label: 'Predios Tradicionales Protegidos frente a Sustitución Tipológica', valor: '97.1%', porcentaje: 97.1, contexto: '135 predios de 1 y 2 pisos frente a solo 4 torres residenciales aisladas' },
          { label: 'Cités y Pasajes Tradicionales Amparados por Enmienda N° 2', valor: '100%', porcentaje: 100.0, contexto: 'Los 9 cités catastrados cuentan con blindaje normativo contra demolición' },
          { label: 'Borde Sur / Eje Alameda (Zona A de Densificación Metropolitana)', valor: '12.1%', porcentaje: 12.1, contexto: 'Franja de amortiguación regulada bajo la Modificación N° 31 (2015)' }
        ],
        graficoComparativo: {
          titulo: 'Distribución Territorial de Zonificaciones del PRC de Santiago en el Polígono Barrio Brasil',
          filas: [
            { label: 'Zona B y Zona de Conservación Histórica ZCH B1 (Núcleo Patrimonial)', valor: '80,4%', porcentaje: 80.4 },
            { label: 'Zona A (Borde Sur / Eje Libertador Bernardo O\'Higgins - Alameda)', valor: '12,1%', porcentaje: 12.1 },
            { label: 'Zona D y Sectores Especiales de Transición Poniente', valor: '7,5%', porcentaje: 7.5 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 760 210" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:rgba(15,23,42,0.7); border-radius:10px; border:1px solid rgba(168,85,247,0.25); padding:10px;">
            <line x1="40" y1="105" x2="720" y2="105" stroke="#a855f7" stroke-width="3"/>
            
            <!-- Hito 1: 1990 -->
            <circle cx="75" cy="105" r="8" fill="#f59e0b"/>
            <text x="75" y="45" fill="#fbbf24" font-size="11.5" font-weight="bold" text-anchor="middle">1990</text>
            <text x="75" y="62" fill="#e2e8f0" font-size="10" text-anchor="middle">PRC Res. N° 26</text>
            <text x="75" y="76" fill="#94a3b8" font-size="9.5" text-anchor="middle">Zona B base</text>

            <!-- Hito 2: 2004-2007 -->
            <circle cx="210" cy="105" r="8" fill="#38bdf8"/>
            <text x="210" y="138" fill="#38bdf8" font-size="11.5" font-weight="bold" text-anchor="middle">2004–2007</text>
            <text x="210" y="155" fill="#e2e8f0" font-size="10" text-anchor="middle">Seccional Brasil</text>
            <text x="210" y="169" fill="#94a3b8" font-size="9.5" text-anchor="middle">&amp; Mod. N° 16 (ZCH)</text>

            <!-- Hito 3: 2008-2012 -->
            <circle cx="355" cy="105" r="8" fill="#10b981"/>
            <text x="355" y="45" fill="#34d399" font-size="11.5" font-weight="bold" text-anchor="middle">2008–2012</text>
            <text x="355" y="62" fill="#e2e8f0" font-size="10" text-anchor="middle">Mod. N° 21 y N° 26</text>
            <text x="355" y="76" fill="#94a3b8" font-size="9.5" text-anchor="middle">Sector 6 Poniente</text>

            <!-- Hito 4: 2014-2015 -->
            <circle cx="505" cy="105" r="8" fill="#c084fc"/>
            <text x="505" y="138" fill="#c084fc" font-size="11.5" font-weight="bold" text-anchor="middle">2014–2015</text>
            <text x="505" y="155" fill="#e2e8f0" font-size="10" text-anchor="middle">Enmienda N° 2 Cités</text>
            <text x="505" y="169" fill="#94a3b8" font-size="9.5" text-anchor="middle">&amp; Mod. N° 31 Alameda</text>

            <!-- Hito 5: 2016-2024 -->
            <circle cx="660" cy="105" r="8" fill="#f43f5e"/>
            <text x="660" y="45" fill="#fb7185" font-size="11.5" font-weight="bold" text-anchor="middle">2016–2024</text>
            <text x="660" y="62" fill="#e2e8f0" font-size="10" text-anchor="middle">Enmiendas N° 1, 3, 6</text>
            <text x="660" y="76" fill="#94a3b8" font-size="9.5" text-anchor="middle">Rebaja Alturas &amp; Art. 117</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: '1990 · PRC Res. N° 26 SEREMI', valor: 'Zona B base', referencial: 'Rasante OGUC Art. 2.6.3 (gatilla torres)', fuente: 'Expediente PRC 1990 (Drive Munistgo)' },
          { variable: '2004–2007 · Seccional Brasil & Mod. N° 16', valor: 'ZCH B1 creada', referencial: 'Protección de fachadas e inmuebles ICH', fuente: 'Carpeta Mod. 16 / Seccional Brasil' },
          { variable: '2008–2010 · Modificación N° 21', valor: 'Sector 6 Poniente', referencial: 'Restricción de alturas y continuidad morfológica', fuente: 'Carpeta Modificación N° 21 PRC' },
          { variable: '2012 · Modificación N° 26', valor: 'Pericentro Poniente', referencial: 'Depuración usos: prohíbe talleres molestos', fuente: 'Carpeta Modificación N° 26 PRC' },
          { variable: '2014 · Enmienda N° 2 (Cités)', valor: '9 Cités catastrados', referencial: 'Protección de tipología contra demolición', fuente: 'Carpeta Enmienda N° 2 Cités' },
          { variable: '2015–2019 · Mod. 31 y Enmiendas 1, 3 y 6', valor: 'Borde Alameda / B3', referencial: 'Transición Alameda y rebaja alturas interiores', fuente: 'Carpetas Mod. 31 y Enmiendas 1-3-6' },
          { variable: '2021–2024 · Postergaciones Art. 117 LGUC', valor: 'Polígonos en revisión', referencial: 'Congelamiento preventivo frente a Rent Gap', fuente: 'Decretos Alcaldicios / D.O.' }
        ],
        cuerpo: [
          `Cuando se promulgó el Plan Regulador Comunal de Santiago en 1990 (Res. N° 26 SEREMI MINVU), buena parte del poniente histórico quedó expuesta a la fusión predial y a la construcción en altura regulada solo por rasantes. Tras el terremoto de 1985 y durante la década de 1990, la demolición de casonas de fachada continua encendió las alarmas vecinales y académicas. Esto dio origen al Seccional Barrio Brasil, a la Modificación N° 16 (Borde Poniente) y luego a la decisiva Modificación N° 21 (Sector 6 Poniente, 2008–2010), que consolidaron las Zonas de Conservación Histórica (ZCH B1) y frenaron la sustitución masiva en torno a Plaza Brasil y los ejes Huérfanos y Compañía.`,
          `Un hito clave dentro del expediente histórico municipal (disponible íntegramente en el repositorio oficial de la Municipalidad de Santiago) fue la Enmienda N° 2 de 2014, que otorgó reconocimiento urbanístico expreso a los Cités y pasajes interiores —de los cuales 9 conjuntos singulares se localizan en la trama de Barrio Brasil—, impidiendo su demolición para engome predial. Posteriormente, entre 2016 y 2019, las Enmiendas N° 1, N° 3 y N° 6 rebajaron las alturas máximas en los bordes de manzanas patrimoniales (Sector Especial B3) y la Modificación N° 31 ordenó la transición desde el eje de alta densidad de la Alameda hacia el interior barrial.`,
          `Al cruzar en el Atlas la capa oficial del PRC (minvu_prc) con las alturas reales de edificación (cat02_vivienda), se observa con precisión quirúrgica cómo las 4 torres de 9 a 21 pisos se levantaron en los intersticios o ventanas previas a las enmiendas restrictivas, generando una fuerte brecha de renta potencial (Rent Gap) sobre los 135 predios colindantes de 1 y 2 pisos. Las postergaciones selectivas de permisos (Art. 117 LGUC) aplicadas entre 2021 y 2024 han sido fundamentales para contener esa presión mientras se actualiza el instrumento comunal.`
        ],
        conclusion: `La trayectoria de modificaciones al Plan Regulador Comunal de Santiago demuestra que la protección del patrimonio y la escala barrial no es estática, sino una conquista sociopolítica continua. La preservación de los 9 cités y de los 135 inmuebles tradicionales frente al rent gap inmobiliario ilustra el valor del instrumento urbanístico como garante del derecho a la ciudad.`,
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Autoridad Pública',
            subtitulo: 'Asesoría Urbana Municipalidad de Santiago · DOM · SEREMI MINVU · CMN',
            utilidad: 'Permite cruzar el expediente histórico de modificaciones del PRC con el estado actual de los predios para fundamentar informes previos, permisos Art. 60 LGUC y futuras enmiendas.'
          },
          {
            id: 'comunidad',
            icono: '🏘️',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Vecinos de Cités · Organizaciones Patrimoniales · Comité de Defensa Barrio Brasil',
            utilidad: 'Democratiza el acceso a los decretos, planos seccionales y enmiendas históricas para defender con argumentos jurídicos la escala barrial y los 9 cités catastrados frente a proyectos invasivos.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Mapeadores de Patrimonio · Estudiantes de Geografía y Arquitectura UAH',
            utilidad: 'Orienta el levantamiento de alturas (building:levels), estado de conservación y tipologías de cités en terreno para detectar dónde existe mayor presión inmobiliaria.'
          },
          {
            id: 'ong',
            icono: '🔬',
            nombre: 'ONGs / Investigadores / Academia',
            subtitulo: 'Geografía Urbana UAH · Geografía UAH · Estudios Patrimoniales',
            utilidad: 'Entrega la trazabilidad histórica completa entre regulación urbanística, morfología edificada y brecha de renta (Rent Gap) en centros históricos latinoamericanos.'
          }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'minvu_prc', nombre: 'Zonificación PRC (Planes Reguladores)', institucion: 'MINVU / Ilustre Municipalidad de Santiago', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'minvu_patrimonio', nombre: 'Zonas e Inmuebles de Conservación Histórica (ZCH / ICH)', institucion: 'MINVU / DOM Santiago', crs: 'EPSG:4326', tipo: 'Polígono' },
            { codigo: 'cmn_monumentos', nombre: 'Monumentos Nacionales (Ley N° 17.288)', institucion: 'Consejo de Monumentos Nacionales (CMN)', crs: 'EPSG:4326', tipo: 'Punto/Polígono' },
            { codigo: 'cat02_vivienda', nombre: 'Vivienda, Morfología y Alturas de Edificación (OSM/Cités)', institucion: 'OpenStreetMap / Catastro Barrial UAH', crs: 'EPSG:4326', tipo: 'Polígono/Punto' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Ilustre Municipalidad de Santiago — Asesoría Urbana. (1990–2024). Repositorio Oficial de Modificaciones Históricas al Plan Regulador Comunal de Santiago [Expedientes digitales: Mod. N° 16, N° 21, N° 26, N° 31, Enmiendas N° 1, 2, 3 y 6]. https://drive.google.com/drive/folders/1MMxFwr8G3fYCjX2NzO_0yeUIzPN-CSjz',
              concepto: 'Fuente documental primaria: Compendio oficial de ordenanzas, memorias explicativas y planos de todas las modificaciones normativas que rigen el Barrio Brasil.'
            },
            {
              cita: 'Smith, N. (1987). Gentrification and the rent gap. Annals of the Association of American Geographers, 77(3), 462–465.',
              concepto: 'Aporte teórico: Explica cómo la diferencia entre la renta actual de predios bajos (1–2 pisos) y la renta potencial bajo normas más permisivas genera presión especulativa.'
            },
            {
              cita: 'López-Morales, E. (2015). Gentrification by ground rent dispossession: The shadows cast by large-scale urban renewal in Santiago de Chile. International Journal of Urban and Regional Research, 39(4), 756–772.',
              concepto: 'Aporte empírico: Analiza el papel de las modificaciones a los Planes Reguladores Comunales en la captura de renta de suelo en el pericentro de Santiago.'
            }
          ]
        }
      }
    },
    {
      id: 'storyboard-censo2024-densidad-poblacion',
      titulo: '8. Densidad de Población Censo 2024: Concentración y Patrones en Manzanas de Santiago',
      bajada: 'Distribución espacial de la densidad de personas/km² por manzana censal según el Censo Oficial 2024 (INE), clasificada en 4 estratos de concentración territorial.',
      dimensionId: 'dim-sociodemografica',
      dimensionNombre: 'Dimensión Sociodemográfica',
      fecha: '19 de Octubre 2026',
      autor: 'Juan Pablo Lezcano — Departamento de Geografía, Universidad Alberto Hurtado',
      tiempoLectura: '4 min lectura',
      imagen: 'img/cartografias/cartografia_censo2024_densidad_poblacion_santiago.jpg',
      tags: ['Censo 2024 INE', 'Densidad Habitacional', 'Manzanas Censales', 'Santiago Poniente'],
      capasRelevantes: ['censo2024_manzanas', 'censo2024_zonal', 'bbdd_08'],
      contenido: {
        introduccion: `La presente lámina cartográfica oficial, diseñada por Juan Pablo Lezcano en el marco del Atlas VGI (Universidad Alberto Hurtado), espacializa los resultados definitivos del Censo 2024 a nivel de manzana censal en la Comuna de Santiago. El mapa evidencia un marcado contraste entre el cuadrante poniente (Barrio Brasil, Yungay y Matucana), caracterizado por densidades intermedias compatibles con el tejido patrimonial tradicional de casonas y cités, y los corredores de hiperdensificación vertical en altura concentrados en el eje Santa Isabel, Carmen y San Diego, donde se superan los umbrales críticos de presión sobre el espacio público.`,
        datosClave: [
          { valor: '1.711 Mzn', label: 'Manzanas Analizadas', sub: 'Comuna de Santiago Censo 2024' },
          { valor: '4 Rangos', label: 'Estratificación Areal', sub: 'Porcentaje del total % / km²' },
          { valor: '31,31% - 84,48%', label: 'Estrato Máximo Pico', sub: 'Hiperdensificación en altura' },
          { valor: '0% - 5,06%', label: 'Estrato Base Suelo', sub: 'Zonas patrimoniales y equipamiento' }
        ],
        porcentajesClave: [
          { label: 'Rango Crítico de Hiperdensificación (31,31% - 84,48%)', valor: '31.3% - 84.5%', porcentaje: 84.5, contexto: 'Concentrado en ejes de renovación inmobiliaria en altura del pericentro sur y oriente' },
          { label: 'Rango Medio-Alto de Concentración (14,87% - 30,64%)', valor: '14.9% - 30.6%', porcentaje: 30.6, contexto: 'Bordes de transición y manzanas mixtas con edificios residenciales de media altura' },
          { label: 'Rango Moderado Tradicional (5,07% - 14,70%)', valor: '5.1% - 14.7%', porcentaje: 14.7, contexto: 'Prevalente en el núcleo patrimonial de Barrio Brasil y áreas residenciales consolidadas' },
          { label: 'Rango Bajo y Espacio Público (0% - 5,06%)', valor: '0.0% - 5.1%', porcentaje: 5.1, contexto: 'Manzanas de uso institucional, parques urbanos, campus universitarios y bodegas' }
        ],
        graficoComparativo: {
          titulo: 'Distribución Cartográfica de Estratos de Densidad Poblacional (Censo 2024)',
          filas: [
            { label: 'Estrato 1: Muy Baja Densidad / Suelo Institucional y Parques (0% - 5.06%)', valor: 'Amarillo', porcentaje: 25.0 },
            { label: 'Estrato 2: Densidad Moderada / Tejido Residencial Tradicional (5.07% - 14.70%)', valor: 'Verde Brillante', porcentaje: 50.0 },
            { label: 'Estrato 3: Densidad Media-Alta / Transición Residencial (14.87% - 30.64%)', valor: 'Celeste / Cian', porcentaje: 75.0 },
            { label: 'Estrato 4: Hiperdensidad Crítica / Torres Residenciales (31.31% - 84.48%)', valor: 'Azul Noche', porcentaje: 100.0 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 200" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="200" fill="#0b1329" rx="8"/>
            <text x="340" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Gradiente de Densidad Poblacional Censo 2024 (Manzanas Santiago)</text>
            <!-- 4 Bloques de Color -->
            <rect x="50" y="55" width="125" height="70" fill="#FFFF73" rx="6"/>
            <text x="112" y="85" fill="#000" font-size="11" font-weight="bold" text-anchor="middle">0% - 5.06%</text>
            <text x="112" y="105" fill="#000" font-size="9" text-anchor="middle">Baja Densidad / Parques</text>

            <rect x="195" y="55" width="125" height="70" fill="#55FF00" rx="6"/>
            <text x="257" y="85" fill="#000" font-size="11" font-weight="bold" text-anchor="middle">5.07% - 14.7%</text>
            <text x="257" y="105" fill="#000" font-size="9" text-anchor="middle">Barrio Brasil (1-3P)</text>

            <rect x="340" y="55" width="125" height="70" fill="#00A9E6" rx="6"/>
            <text x="402" y="85" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">14.87% - 30.64%</text>
            <text x="402" y="105" fill="#fff" font-size="9" text-anchor="middle">Transición Media</text>

            <rect x="485" y="55" width="145" height="70" fill="#002673" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
            <text x="557" y="85" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">31.31% - 84.48%</text>
            <text x="557" y="105" fill="#fef08a" font-size="9" text-anchor="middle">Hiperdensidad Vertical</text>

            <!-- Leyenda Inferior -->
            <text x="340" y="165" fill="#cbd5e1" font-size="10" text-anchor="middle">Fuente Oficial: Instituto Nacional de Estadísticas (INE 2024) · Cartografía: Juan Pablo Lezcano (UAH)</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Total Manzanas Censales Analizadas', valor: '1.711 mzn', referencial: '100% Comuna Santiago', fuente: 'Censo 2024 (censo2024_manzanas)' },
          { variable: 'Manzanas Cuartil Máximo (>31.3%)', valor: '382 mzn', referencial: 'Ejes Santa Isabel, Carmen y San Diego', fuente: 'INE 2024 / Matriz Síntesis' },
          { variable: 'Manzanas Barrio Brasil en Cuartil 5-14.7%', valor: '84.1%', referencial: 'ZCH B1 de Conservación Histórica', fuente: 'PRC Santiago / Censo 2024' },
          { variable: 'Población Máxima por Manzana Pico', valor: '4.820 hab/mzn', referencial: 'Torres residenciales (>18 pisos)', fuente: 'Microdatos INE 2024' }
        ],
        cuerpo: [
          `El análisis cartográfico de la densidad de población del Censo 2024 por manzana revela con nitidez la dualidad morfológica y demográfica que atraviesa la Comuna de Santiago. Mientras los sectores protegidos como Barrio Brasil mantienen densidades moderadas armónicas con la escala peatonal, los sectores desregulados del sur comunal concentran densidades extremas que tensionan severamente la provisión de servicios y áreas verdes.`,
          `Esta cartografía sirve de insumo empírico fundamental para contrastar la distribución de equipamiento y los kernels de densidad VGI (accesibilidad, transporte, comercio y educación), permitiendo identificar si los servicios urbanos acompañan o van rezagados respecto al crecimiento poblacional.`
        ],
        conclusion: `La zonificación censal evidencia que la protección patrimonial ha sido un mecanismo eficaz de equilibrio socioespacial, evitando que el Barrio Brasil sufra los colapsos de infraestructura observados en las manzanas hiperdensificadas del pericentro capitalino.`,
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Sector Público',
            subtitulo: 'MINVU · SECPLA Santiago · DITEC · INE',
            utilidad: 'Permite a SECPLA y al MINVU focalizar las inversiones de mitigación del espacio público en las manzanas de mayor concentración demográfica.'
          },
          {
            id: 'comunidad',
            icono: '👥',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Juntas de Vecinos · Asambleas Barriales',
            utilidad: 'Respalda la exigencia vecinal de proteger la escala barrial y exigir más áreas verdes en cuadrantes con densidades intermedias crecientes.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Comunidad OSM · Estudiantes Geografía UAH',
            utilidad: 'Orienta la priorización del mapeo de accesos, microatributos de accesibilidad y comercio barrial en las manzanas de mayor densidad.'
          },
          {
            id: 'ong',
            icono: '🎓',
            nombre: 'Investigación / Academia',
            subtitulo: 'Geografía UAH · Departamento de Geografía UAH',
            utilidad: 'Base territorial de microdatos para correlaciones espaciales con el Registro Social de Hogares, calidad de vida urbana e islas de calor.'
          }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'censo2024_manzanas', nombre: 'Microdatos y Cartografía Censal por Manzana (Censo 2024)', institucion: 'Instituto Nacional de Estadísticas (INE)', crs: 'EPSG:32719 / EPSG:4326', tipo: 'Polígono' },
            { codigo: 'matriz_sintesis_manzanas', nombre: 'Matriz Síntesis de Manzanas Atlas VGI (1.711 Manzanas)', institucion: 'Universidad Alberto Hurtado / Geografía UAH', crs: 'EPSG:32719', tipo: 'Polígono' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Instituto Nacional de Estadísticas [INE]. (2024). Censo de Población y Vivienda 2024: Resultados Definitivos y Cartografía Censal. Gobierno de Chile.',
              concepto: 'Fuente oficial primaria: Base territorial de manzanas censales y conteo desagregado de habitantes por unidad espacial.'
            },
            {
              cita: 'Lezcano, J. P. (2026). Cartografía Oficial de Densidad Poblacional (Censo 2024) por Manzana en la Comuna de Santiago. Atlas VGI — Universidad Alberto Hurtado.',
              concepto: 'Autoría cartográfica: Diseño de cuadrantes, simbología multiclase y correlación espacial territorial.'
            }
          ]
        }
      }
    },
    {
      id: 'storyboard-morfologia-segmentos-vertices',
      titulo: '9. Geometría Perimetral: Segmentos y Vértices de Santiago y Barrio Brasil',
      bajada: 'Modelación geométrica de los 138 vértices del contorno exterior continuo de Santiago (23,05 km²) y del Barrio Brasil (75,24 ha) con longitudes exactas de segmentos en EPSG:32719.',
      dimensionId: 'dim-sociourbana',
      dimensionNombre: 'Dimensión Sociourbana & Morfología Territorial',
      fecha: '19 de Octubre 2026',
      autor: 'Juan Pablo Lezcano — Departamento de Geografía, Universidad Alberto Hurtado',
      tiempoLectura: '4 min lectura',
      imagen: 'img/cartografias/cartografia_segmentos_vertices_comuna_santiago.png',
      tags: ['Morfología Urbana', 'Vértices Perimetrales', 'Barrio Brasil', 'Límites Comunales'],
      capasRelevantes: ['minvu_ipt_limite_urbano', 'ide_subdere_dpa_comunas', 'cat09_edificaciones'],
      contenido: {
        introduccion: `La presente cartografía técnica, modelada en proyección métrica WGS 84 / UTM Zona 19S (EPSG:32719) por Juan Pablo Lezcano en el Atlas VGI, representa la descomposición geométrica formal del perímetro de la Comuna de Santiago y del polígono histórico de Barrio Brasil. Mediante la depuración topológica de las manzanas censales y la supresión de fisuras viales intermedias, se aíslan los 138 vértices del contorno exterior continuo comunal y los vértices de Barrio Brasil, explicitando la longitud métrica exacta de cada arista estructurante y las superficies netas de suelo.`,
        datosClave: [
          { valor: '23.053.198 m²', label: 'Área Comunal Continua', sub: '2.305,32 hectáreas (Santiago)' },
          { valor: '752.366 m²', label: 'Área Barrio Brasil', sub: '75,24 hectáreas fundacionales' },
          { valor: '23.407 m', label: 'Perímetro Exterior Santiago', sub: '23,41 km de borde continuo' },
          { valor: '3.547 m', label: 'Perímetro Barrio Brasil', sub: '3,55 km de borde barrial' }
        ],
        porcentajesClave: [
          { label: 'Proporción Territorial de Barrio Brasil en la Comuna de Santiago', valor: '3.26%', porcentaje: 3.26, contexto: '752.366 m² respecto a los 23.053.198 m² de la envolvente comunal continua' },
          { label: 'Longitud del Eje Norte Estructurante (Costanera Norte / Río Mapocho)', valor: '2.443 m', porcentaje: 100.0, contexto: 'Segmento continuo superior entre Puente Bulnes y Estación Mapocho' },
          { label: 'Longitud del Eje Oriente (Avenida Vicuña Mackenna / Santa Elena)', valor: '3.163 m', porcentaje: 100.0, contexto: 'El segmento recto más largo del perímetro comunal oriente' },
          { label: 'Longitud del Eje Poniente (Avenida Matucana)', valor: '2.028 m', porcentaje: 100.0, contexto: 'Frontera poniente de Santiago frente a Estación Central y Quinta Normal' }
        ],
        graficoComparativo: {
          titulo: 'Longitud en Metros de los Segmentos Perimetrales Principales de Santiago',
          filas: [
            { label: 'Eje Vicuña Mackenna / Borde Oriente', valor: '3.163 m', porcentaje: 100.0 },
            { label: 'Eje Costanera Norte / Borde Mapocho', valor: '2.443 m', porcentaje: 77.2 },
            { label: 'Eje Matucana / Borde Poniente', valor: '2.028 m', porcentaje: 64.1 },
            { label: 'Eje Placer / Franklin / Borde Sur', valor: '1.378 m', porcentaje: 43.6 },
            { label: 'Eje Parque Quinta Normal Norte', valor: '1.124 m', porcentaje: 35.5 },
            { label: 'Eje Catedral Poniente (Barrio Brasil)', valor: '1.076 m', porcentaje: 34.0 }
          ]
        },
        diagramaSVG: () => `
          <svg viewBox="0 0 680 200" class="svg-diagrama-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="680" height="200" fill="#0b1329" rx="8"/>
            <text x="340" y="26" fill="#8b5cf6" font-size="13" font-weight="bold" text-anchor="middle">Morfometría y Geometría Perimetral: Comuna de Santiago vs. Barrio Brasil</text>
            <!-- Polígono Santiago Esquemático -->
            <polygon points="120,45 480,50 560,165 420,180 160,180 100,100" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
            <!-- Polígono Barrio Brasil Interior -->
            <polygon points="200,70 320,72 310,130 190,128" fill="#8b5cf6" fill-opacity="0.35" stroke="#a78bfa" stroke-width="2"/>
            <text x="255" y="105" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Barrio Brasil</text>
            <text x="255" y="120" fill="#cbd5e1" font-size="8.5" text-anchor="middle">752.366 m² (3.55 km)</text>
            <!-- Etiquetas de cotas -->
            <text x="300" y="42" fill="#fef08a" font-size="9" font-weight="bold">Norte: 2.443 m</text>
            <text x="535" y="110" fill="#fef08a" font-size="9" font-weight="bold">Oriente: 3.163 m</text>
            <text x="80" y="140" fill="#fef08a" font-size="9" font-weight="bold">Poniente: 2.028 m</text>
            <text x="280" y="195" fill="#fef08a" font-size="9" font-weight="bold">Sur: 1.378 m</text>
            <!-- Total Comuna -->
            <text x="440" y="130" fill="#38bdf8" font-size="11" font-weight="bold">Santiago Total</text>
            <text x="440" y="146" fill="#94a3b8" font-size="9">Área: 23.053.198 m²</text>
            <text x="440" y="160" fill="#94a3b8" font-size="9">Perímetro: 23.407 m</text>
          </svg>
        `,
        tablaIndicadores: [
          { variable: 'Superficie Envolvente Continua Santiago', valor: '23.053.198 m²', referencial: '2.305,32 hectáreas', fuente: 'Borde Depurado EPSG:32719' },
          { variable: 'Perímetro Exterior Continuo Santiago', valor: '23.407 m', referencial: '23,41 km lineales', fuente: '138 vértices exteriores' },
          { variable: 'Superficie Polígono Barrio Brasil', valor: '752.366 m²', referencial: '75,24 hectáreas fundacionales', fuente: 'Límite Oficial MuniSTGO' },
          { variable: 'Perímetro Exterior Barrio Brasil', valor: '3.547 m', referencial: '3,55 km lineales', fuente: '32 vértices exteriores' }
        ],
        cuerpo: [
          `La delimitación morfométrica precisa de una unidad territorial constituye el punto de partida indispensable para cualquier cálculo de densidad poblacional, dotación de áreas verdes por habitante o cálculo de anchos de banda para estimaciones de densidad de kernel.`,
          `Al unificar las 1.711 manzanas censales de Santiago cerrando las rendijas viales internas, se comprueba que el área comunal neta continua alcanza 23,05 km², mientras que Barrio Brasil ocupa 75,24 hectáreas en el corazón del cuadrante poniente.`
        ],
        conclusion: `El modelamiento perimetral en coordenadas proyectadas EPSG:32719 proporciona a la gestión territorial municipal un estándar métrico riguroso, evitando distorsiones de escala en la zonificación urbana y en los cálculos de densidad.`,
        analisisPorActor: [
          {
            id: 'institucion',
            icono: '🏛️',
            nombre: 'Institución / Sector Público',
            subtitulo: 'SECPLA · Asesoría Urbana · MuniSTGO',
            utilidad: 'Entrega parámetros geométricos consolidados para la redacción de ordenanzas locales y el cálculo de la Ley de Aportes.'
          },
          {
            id: 'comunidad',
            icono: '👥',
            nombre: 'Comunidad / Vecinal',
            subtitulo: 'Juntas de Vecinos Barrio Brasil',
            utilidad: 'Clarifica la delimitación geométrica formal de Barrio Brasil (3,55 km de borde y 75,2 ha) frente a disputas limítrofes.'
          },
          {
            id: 'voluntario',
            icono: '🗺️',
            nombre: 'Mapeador / Voluntario OSM',
            subtitulo: 'Comunidad OSM · Estudiantes UAH',
            utilidad: 'Proporciona los vértices y ejes perimetrales de control para calibrar las capas territoriales en OpenStreetMap.'
          },
          {
            id: 'ong',
            icono: '🎓',
            nombre: 'Investigación / Academia',
            subtitulo: 'Geografía UAH · Geografía UAH',
            utilidad: 'Permite calcular índices de compacidad geométrica, compacidad de Richardson y ratios perímetro/área en morfometría urbana.'
          }
        ],
        apartadoBibliografico: {
          fuentesDatos: [
            { codigo: 'borde_exterior_manzanas', nombre: 'Borde Exterior Continuo de Manzanas Santiago (EPSG:32719)', institucion: 'Atlas VGI — Universidad Alberto Hurtado', crs: 'EPSG:32719', tipo: 'Polígono / Línea' },
            { codigo: 'limite_barrios_stgo', nombre: 'Límite Oficial de Barrios y Comuna de Santiago', institucion: 'Ilustre Municipalidad de Santiago (MuniSTGO)', crs: 'EPSG:32719', tipo: 'Polígono' }
          ],
          referenciasAcademicas: [
            {
              cita: 'Lezcano, J. P. (2026). Cartografía de Segmentos y Vértices de la Comuna de Santiago y Barrio Brasil (Región Metropolitana). Atlas VGI — Universidad Alberto Hurtado.',
              concepto: 'Autoría cartográfica: Descomposición geométrica de vértices, simplificación Douglas-Peucker y parametrización métrica.'
            },
            {
              cita: 'Buzai, G. D., & Baxendale, C. A. (2012). Análisis espacial con sistemas de información geográfica. Lugar Editorial.',
              concepto: 'Metodología espacial: Métricas de morfometría, forma, compacidad y delimitación de unidades espaciales de análisis.'
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

    const totalCapasAtlas = 131; // 121 oficiales + 10 VGI
    
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
            Estructura analítica integrada para la gestión territorial y comunitaria. Las <strong>${totalCapasAtlas} capas del Atlas VGI</strong> (121 oficiales del Estado de Chile y 10 colaborativas OSM/GBIF) organizadas en <strong>5 dimensiones estratégicas</strong> con acceso directo al mapa interactivo y descarga de datos abiertos.
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
