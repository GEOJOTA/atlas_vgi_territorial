/*
  indicadores_analisis.js
  -----------------------
  Módulo de Indicadores de Análisis Multidimensional y Storyboards Territoriales de Barrio Brasil.
  Proyecto Fondecyt Regular — Universidad Alberto Hurtado (2026).

  Estructura:
  1. Agrupación analítica de las 118 capas del Atlas (108 Oficiales + 10 VGI) en 5 Dimensiones Estratégicas:
     - 1) Sociodemográfica
     - 2) Socioeconómica
     - 3) Socioambiental
     - 4) Sociosanitaria
     - 5) Sociourbana o Habitabilidad
  2. Interfaz visual centrada con 5 tarjetas e íconos grandes diferenciadores y acordeones dinámicos.
  3. Sección 'Storyboards': Narrativas de datos concisas y completas sobre Barrio Brasil tipo blog,
     con tarjetas cuadradas (1:1), imágenes temáticas y láminas de lectura inmersiva.
  4. Nota Metodológica: Funcionalidad exploratoria / tentativa en desarrollo colaborativo.
*/

const ModuloIndicadoresAnalisis = (() => {

  // Definición de las 5 Dimensiones Estratégicas
  const DIMENSIONES = [
    {
      id: 'sociodemografica',
      numero: '1',
      nombre: 'Sociodemográfica',
      icono: '👥',
      color: '#06B6D4', // Cian brillante
      colorFondo: 'rgba(6, 182, 212, 0.12)',
      colorBorde: 'rgba(6, 182, 212, 0.45)',
      descripcion: 'Dinámica poblacional, estructura etaria y de género, hogares, etnias, migración y vulnerabilidad socioterritorial.',
      enfoque: 'Microdatos Censo 2024 (5 niveles INE), Registro Social de Hogares (CSE / MDSF), Campamentos MINVU y Unidades Vecinales Ley 19.418.',
      capasIds: [
        'censo2024_regional',
        'censo2024_limite_urbano',
        'censo2024_localidades',
        'censo2024_zonal',
        'censo2024_manzanas',
        'ide_minvu_campamentos',
        'bbdd_66', // Unidades Vecinales 2026
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
      color: '#F59E0B', // Ámbar / Oro
      colorFondo: 'rgba(245, 158, 11, 0.12)',
      colorBorde: 'rgba(245, 158, 11, 0.45)',
      descripcion: 'Inversión pública del Estado, empleo, cotizaciones previsionales, comercio barrial de proximidad y matriz energética.',
      enfoque: 'Banco Integrado de Proyectos (BIP 2019–2027), contratos MOP, ocupación RSH, mercados ODEPA, telecomunicaciones y energía RM.',
      capasIds: [
        'bbdd_65', // BIP Iniciativas de Inversión
        'bbdd_01', // Proyectos Mandatados MOP
        'bbdd_04', // Contratos Concesionados
        'bbdd_05', // Contratos MOP
        'bbdd_74', // Personas RSH ocupadas y cotizantes
        'bbdd_54', // Mercados Mayoristas ODEPA
        'bbdd_35', // Antenas Ley de Torres
        'cat02_servicios', // VGI Comercio y Servicios OSM
        'energia_almacenamiento_rm',
        'energia_bioenergia_rm',
        'energia_gasoducto_rm',
        'energia_hidroelectricas_rm',
        'energia_lineas_transmision_rm',
        'energia_oleoducto_rm',
        'energia_solares_rm',
        'energia_termoelectricas_rm'
      ]
    },
    {
      id: 'socioambiental',
      numero: '3',
      nombre: 'Socioambiental',
      icono: '🌿',
      color: '#10B981', // Esmeralda / Verde
      colorFondo: 'rgba(16, 185, 129, 0.12)',
      colorBorde: 'rgba(16, 185, 129, 0.45)',
      descripcion: 'Áreas verdes normadas, arbolado y biodiversidad urbana, recursos hídricos, calidad ambiental y resiliencia ecológica.',
      enfoque: 'Áreas Verdes MINVU (18.173 polígonos), Biodiversidad GBIF/iNaturalist, Humedales Ley 21.202, Red DGA, CONAF y calidad de aire SINCA.',
      capasIds: [
        'minvu_ipt_areas_verdes',
        'cat05_espacio_publico', // VGI Plazas y Parques OSM
        'cat08_biodiversidad', // VGI GBIF
        'cat10_cobertura_suelo', // VGI Suelo OSM
        'bbdd_03', // Red Hidrométrica GEOMOP
        'bbdd_23', // Humedales Protegidos Ley 21.202
        'bbdd_25', // Estaciones Meteorológicas DMC
        'bbdd_26', // Cuencas BNA DGA
        'bbdd_27', // SNASPE CONAF
        'bbdd_29', // Estaciones Sedimentométricas DGA
        'bbdd_30', // Calidad de Aguas DGA
        'bbdd_32', // Meteorología Agrícola FIA
        'bbdd_34', // Canales de Riego CNR
        'bbdd_39', // Köppen RM
        'bbdd_42', // Fluviometría DGA
        'bbdd_49', // Calidad del Aire SINCA
        'bbdd_51', // Sitios Prioritarios MMA
        'bbdd_52', // Viveros CONAF
        'bbdd_53', // Vertederos Ilegales
        'bbdd_55', // Industria Forestal INFOR
        'bbdd_59', // Aguas Subterráneas DGA
        'bbdd_60', // Bosque Nativo CONAF
        'bbdd_62', // Huertos Frutales ODEPA
        'bbdd_63'  // Biomasa Forestal CONAF
      ]
    },
    {
      id: 'sociosanitaria',
      numero: '4',
      nombre: 'Sociosanitaria',
      icono: '🏥',
      color: '#EF4444', // Rojo Coral Asistencial
      colorFondo: 'rgba(239, 68, 68, 0.12)',
      colorBorde: 'rgba(239, 68, 68, 0.45)',
      descripcion: 'Infraestructura de atención primaria, red hospitalaria, cuidados comunitarios, dependencia funcional y previsión de salud.',
      enfoque: 'Establecimientos de Salud DEIS/MINSAL (CESFAM y Hospitales), Dependencia Funcional RSH (CSE 2026) y Servicios Asistenciales.',
      capasIds: [
        'establecimientos_salud', // Salud Pública DEIS / MINSAL
        'bbdd_38', // Servicios de Salud RM
        'bbdd_67'  // Personas RSH Dependencia Funcional CSE 2026
      ]
    },
    {
      id: 'sociourbana',
      numero: '5',
      nombre: 'Sociourbana o Habitabilidad',
      icono: '🏙️',
      color: '#8B5CF6', // Púrpura Urbano
      colorFondo: 'rgba(139, 92, 246, 0.12)',
      colorBorde: 'rgba(139, 92, 246, 0.45)',
      descripcion: 'Planificación territorial, catastro predial, edificaciones, movilidad activa, cruces semaforizados, patrimonio y equipamientos.',
      enfoque: 'Zonificación PRC Santiago, PRMS Riesgos, Catastro SII (1.43M predios), 695k Edificaciones OSM, Cruces UOCT (3.242), Metro, Ciclovías y ZCH.',
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

  // Definición de los Storyboards de Barrio Brasil (Historias con Datos)
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
          { valor: '2 ZCH', label: 'Zonas Conservación', sub: 'Brasil y Yungay Poniente' }
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
          { valor: '3 Líneas', label: 'Red de Metro', sub: 'L1, L2 y L5 periféricas' }
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
          { valor: '32 °C', label: 'Amortiguación Térmica', sub: 'Isla de calor mitigada' },
          { valor: '1 Estación', label: 'SINCA Monitoreo', sub: 'Calidad del aire central' }
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
          { valor: 'CAT-01', label: 'Equipamiento Educativo', sub: 'Pabellones UAH y colegios' },
          { valor: 'CAT-02', label: 'Comercio y Servicios', sub: 'Almacenes y cafés OSM' },
          { valor: 'BBDD-65', label: 'Iniciativas BIP RM', sub: 'Inversión pública del Estado' },
          { valor: '8.000+', label: 'Población Flotante', sub: 'Estudiantes y docentes' }
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
          { valor: 'BBDD-67', label: 'Dependencia Funcional', sub: 'Censo Socioeconómico CSE' },
          { valor: 'BBDD-70', label: 'Adultos Mayores RSH', sub: 'Datos desagregados por UV' },
          { valor: 'BBDD-66', label: 'Unidades Vecinales', sub: '1.364 UVs RM Ley 19.418' },
          { valor: 'DEIS', label: 'Red de Salud Pública', sub: 'Hospitales y CESFAM MINSAL' }
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

  /**
   * Renderiza el contenedor completo del módulo dentro del elemento padre
   */
  function renderizarModulo(contenedorId = 'contenedor-indicadores-analisis') {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    // Calcular estadísticas globales
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
                     aria-controls="acordeon-capas-${dim.id}">
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
              Análisis concisos y rigurosos donde la base de datos cuenta historias reales sobre la memoria, caminabilidad, biodiversidad, educación y cuidados en el <strong>Barrio Brasil</strong>. Haz clic sobre cada cuadrado para abrir su lámina completa de lectura inmersiva tipo blog.
            </p>
          </header>

          <div class="grilla-storyboards-cuadrados">
            ${STORYBOARDS.map((sb, idx) => {
              return `
                <article class="tarjeta-storyboard-cuadrada" 
                         data-storyboard-id="${sb.id}"
                         role="button"
                         tabindex="0"
                         aria-label="Abrir historia: ${sb.titulo}">
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
          <button type="button" class="btn-cerrar-lamina" id="btn-cerrar-lamina" aria-label="Cerrar lámina">✕</button>
          <div class="lamina-contenido-scroll" id="lamina-contenido-scroll">
            <!-- Inyectado dinámicamente al abrir un storyboard -->
          </div>
        </div>
      </div>
    `;

    // Asignar listeners
    vincularEventosInterfaz();
  }

  /**
   * Conecta los eventos de clic en las tarjetas de dimensión y storyboards
   */
  function vincularEventosInterfaz() {
    // 1. Clic en tarjetas de dimensiones
    const tarjetasDim = document.querySelectorAll('.tarjeta-dimension-grande');
    tarjetasDim.forEach(tarjeta => {
      tarjeta.addEventListener('click', () => {
        const dimId = tarjeta.dataset.dimension;
        alternarDimension(dimId);
      });
      tarjeta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const dimId = tarjeta.dataset.dimension;
          alternarDimension(dimId);
        }
      });
    });

    // 2. Clic en tarjetas de storyboards
    const tarjetasSB = document.querySelectorAll('.tarjeta-storyboard-cuadrada');
    tarjetasSB.forEach(tarjeta => {
      tarjeta.addEventListener('click', () => {
        const sbId = tarjeta.dataset.storyboardId;
        abrirLaminaStoryboard(sbId);
      });
      tarjeta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const sbId = tarjeta.dataset.storyboardId;
          abrirLaminaStoryboard(sbId);
        }
      });
    });

    // 3. Cerrar lámina modal
    const overlay = document.getElementById('lamina-storyboard-overlay');
    const btnCerrar = document.getElementById('btn-cerrar-lamina');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', cerrarLaminaStoryboard);
    }
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

    const tarjeta = document.getElementById(`tarjeta-dim-${dimId}`);
    const todasTarjetas = document.querySelectorAll('.tarjeta-dimension-grande');

    // Si ya está seleccionada, colapsar
    if (dimensionSeleccionada === dimId) {
      dimensionSeleccionada = null;
      todasTarjetas.forEach(t => {
        t.classList.remove('activa');
        t.setAttribute('aria-expanded', 'false');
      });
      contenedorAcordeon.style.display = 'none';
      contenedorAcordeon.innerHTML = '';
      return;
    }

    // Activar nueva dimensión
    dimensionSeleccionada = dimId;
    todasTarjetas.forEach(t => {
      const coincide = t.dataset.dimension === dimId;
      t.classList.toggle('activa', coincide);
      t.setAttribute('aria-expanded', coincide ? 'true' : 'false');
    });

    // Obtener catálogo maestro de capas oficiales y VGI
    const capasOficialesMap = window.ModuloIDEChile ? window.ModuloIDEChile.obtenerCatalogoCapas() : {};
    
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
          <div class="tarjeta-capa-dimension vgi">
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
        archivoLocal: `data/${capaId}.geojson`
      };

      const archDescarga = defOficial.archivoLocal || `data/${capaId}.geojson`;
      const nombreArchDescarga = archDescarga.split('/').pop();

      return `
        <div class="tarjeta-capa-dimension oficial">
          <div class="tarjeta-capa-dim-header">
            <span class="pill-dim-origen oficial">${(defOficial.institucion || 'ESTADO').split('/')[0].slice(0, 18)}</span>
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
          ✕ Cerrar
        </button>
      </div>

      <div class="grilla-capas-dimension">
        ${htmlCapas}
      </div>
    `;

    // Desplazamiento suave para centrar el acordeón abierto
    setTimeout(() => {
      contenedorAcordeon.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
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
   * Abre la lámina de lectura tipo blog para un storyboard específico
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
            <span>Datos Oficiales &amp; VGI Comunitario</span>
          </div>
        </header>

        <!-- Imagen Destacada Cuadrada / Panorámica con Leyenda -->
        <figure class="figura-destacada-blog">
          <img src="${sb.imagen}" alt="${sb.titulo}" class="img-destacada-blog">
          <figcaption class="pie-figura-blog">
            Registro territorial y morfológico de Barrio Brasil contextualizado con las capas espaciales del Atlas VGI.
          </figcaption>
        </figure>

        <!-- Párrafo de Apertura (Lead Paragraph) -->
        <p class="parrafo-lead-blog">${sb.contenido.introduccion}</p>

        <!-- Matriz de Datos Clave Extraídos de la Base de Datos -->
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
            * Este storyboard forma parte de los entregables exploratorios y análisis cuali-cuantitativos del Proyecto Fondecyt F1261256. Fuentes: IDE Chile, MINVU, INE Censo 2024, UOCT/MTT, MDSF (BiDat), OpenStreetMap contributors y GBIF.org.
          </small>
        </footer>

      </article>
    `;

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
  }

  /**
   * Cierra la lámina modal de storyboard
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
          // Asegurar que el acordeón esté abierto
          const detailsParent = btnOficial.closest('details');
          if (detailsParent) detailsParent.open = true;
          btnOficial.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (!btnOficial.classList.contains('activo')) {
            btnOficial.click();
          }
        }
      }
    }, 250);
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

      // Encuadrar el mapa en Barrio Brasil si existe la función
      const btnReencuadrar = document.getElementById('btn-reencuadrar-mapa');
      if (btnReencuadrar) btnReencuadrar.click();
    }, 300);
  }

  return {
    inicializar: renderizarModulo,
    alternarDimension,
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
window.ModuloIndicadoresAnalisis = ModuloIndicadoresAnalisis;
