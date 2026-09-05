/*
  diccionario.js
  --------------
  Diccionario de metadatos, atributos normalizados y etiquetas territoriales
  para el Atlas de Información Geográfica Voluntaria (Barrio Brasil / UAH).
  Traduce la jerga técnica de OpenStreetMap a conceptos comprensibles para
  instituciones, organizaciones comunitarias y estudiantes.
*/

const ModuloDiccionario = (() => {

  const ATRIBUTOS_NORMALIZADOS = [
    {
      campo: 'id_vgi',
      nombre: 'Identificador Único VGI',
      tipo: 'Texto (Alfanumérico)',
      definicion: 'Identificador global persistente formado por la fuente, el tipo de geometría y el ID numérico (ej: OSM/node/906429642).',
      ejemplo: 'OSM/node/906429642',
      equivalenciaIDE: 'Código Identificador de Objeto Geográfico (ID_OBJETO / gmd:identifier)',
      importancia: 'Permite evitar duplicados y referenciar unívocamente la entidad en auditorías y cruces en QGIS.'
    },
    {
      campo: 'categoria',
      nombre: 'Categoría Temática VGI',
      tipo: 'Texto (Código CAT-01 a CAT-08)',
      definicion: 'Clasificación sectorial del objeto territorial según la taxonomía del Atlas (educación, salud/servicios, transporte, ciclovías, áreas verdes, patrimonio, accesibilidad, biodiversidad).',
      ejemplo: 'CAT-01 (Educación)',
      equivalenciaIDE: 'Categoría Temática ISO 19115 (gmd:topicCategory)',
      importancia: 'Facilita la agregación estadística y el análisis multicriterio para diagnósticos comunales.'
    },
    {
      campo: 'subtipo',
      nombre: 'Subtipo Semántico / Actividad',
      tipo: 'Texto',
      definicion: 'Especificación puntual de la actividad o uso del suelo (ej: university, pharmacy, bus_stop, park, historic, kerb).',
      ejemplo: 'university, pharmacy, cycleway',
      equivalenciaIDE: 'Tipo de Objeto Catastral / Subclase',
      importancia: 'Determina la función exacta del equipamiento en la trama barrial.'
    },
    {
      campo: 'nombre',
      nombre: 'Nombre Propio / Denominación',
      tipo: 'Texto',
      definicion: 'Nombre oficial o comercial con el cual la comunidad o institución reconoce el lugar en el territorio.',
      ejemplo: 'Universidad Alberto Hurtado - Casa Central, Farmacia Ahumada, Plaza Brasil',
      equivalenciaIDE: 'Toponimia Oficial / Nombre Geográfico (gmd:title)',
      importancia: 'Permite la búsqueda toponímica y la orientación espacial en terreno.'
    },
    {
      campo: 'operador',
      nombre: 'Operador / Entidad Administradora',
      tipo: 'Texto',
      definicion: 'Institución pública, empresa u organización comunitaria responsable de la administración o mantención del equipamiento.',
      ejemplo: 'Universidad Alberto Hurtado, Metro de Santiago, Ilustre Municipalidad de Santiago',
      equivalenciaIDE: 'Punto de Contacto Responsable (gmd:CI_ResponsibleParty / Custodio)',
      importancia: 'Clave para autoridades: identifica a quién corresponde gestionar o fiscalizar el recinto.'
    },
    {
      campo: 'direccion',
      nombre: 'Dirección Catastral / Numeración',
      tipo: 'Texto',
      definicion: 'Calle y número domiciliario de acceso principal al inmueble o equipamiento.',
      ejemplo: 'Almirante Barroso 10, Alameda 1869, Erasmo Escala 1822',
      equivalenciaIDE: 'Dirección Domiciliaria / Localización por Dirección',
      importancia: 'Permite geocodificación inversa y contrastación con el catastro comunal del SII.'
    },
    {
      campo: 'accesibilidad',
      nombre: 'Accesibilidad Universal (Silla de Ruedas)',
      tipo: 'Texto (yes / limited / no / designated)',
      definicion: 'Condición de acceso físico para personas con movilidad reducida o en silla de ruedas (rampas, puertas anchas, desniveles).',
      ejemplo: 'yes (totalmente accesible), limited (requiere ayuda), no (infranqueable con peldaños)',
      equivalenciaIDE: 'Atributo de Calidad de Acceso / Infraestructura Inclusiva',
      importancia: 'Fundamental para organizaciones comunitarias e inclusión urbana en Barrio Brasil.'
    },
    {
      campo: 'fuente',
      nombre: 'Fuente de Adquisición',
      tipo: 'Texto',
      definicion: 'Plataforma colaborativa o repositorio de donde provienen los datos brutos (OpenStreetMap, GBIF, iNaturalist, UMap).',
      ejemplo: 'OpenStreetMap, GBIF Occurrence API',
      equivalenciaIDE: 'Linaje y Procedencia (gmd:LI_Lineage)',
      importancia: 'Garantiza la trazabilidad del dato y la transparencia metodológica.'
    },
    {
      campo: 'licencia',
      nombre: 'Marco Jurídico de Licenciamiento',
      tipo: 'Texto',
      definicion: 'Licencia bajo la cual se comparten y pueden reutilizarse los datos espaciales.',
      ejemplo: 'ODbL 1.0 (OpenStreetMap), CC-BY 4.0 (GBIF), Datos Abiertos Estado de Chile',
      equivalenciaIDE: 'Restricciones Legales y de Uso (gmd:MD_LegalConstraints)',
      importancia: 'Asegura que el uso por parte de municipios o estudiantes respete la ley de propiedad intelectual.'
    },
    {
      campo: 'coordenadas',
      nombre: 'Geometría Espacial (Latitud / Longitud)',
      tipo: 'Punto [Longitud, Latitud] en WGS84 (EPSG:4326)',
      definicion: 'Ubicación geográfica absoluta expresada en grados decimales.',
      ejemplo: '[-70.66214, -33.44991]',
      equivalenciaIDE: 'Sistema de Referencia Espacial SIRGAS-Chile (EPSG:5360 / EPSG:4326)',
      importancia: 'Permite abrir directamente las capas en QGIS, ArcGIS, Google Earth o Leaflet.'
    },
    {
      campo: 'superficie_m2',
      nombre: 'Superficie Métrica (m²)',
      tipo: 'Numérico (Decimal / Entero)',
      definicion: 'Área calculada de la geometría poligonal tras reproyectar de WGS84 geográfico a coordenadas proyectadas planas métricas EPSG:32719 (UTM 19S) mediante la fórmula de Gauss (Shoelace).',
      ejemplo: '1,420.5 m²',
      equivalenciaIDE: 'Superficie de Objeto Territorial (gmd:EX_Extent / Área métrica)',
      importancia: 'Permite análisis cuantitativos de densidad de ocupación del suelo, huella de edificación y dotación de áreas verdes en el barrio.'
    },
    {
      campo: 'superficie_ha',
      nombre: 'Superficie en Hectáreas (ha)',
      tipo: 'Numérico (Decimal)',
      definicion: 'Equivalencia de la superficie métrica expresada en hectáreas (1 ha = 10.000 m²).',
      ejemplo: '0.14 ha',
      equivalenciaIDE: 'Área en Hectáreas / Indicador Territorial',
      importancia: 'Facilita la comparación de escalas mayores para instrumentos de planificación comunal (PRC).'
    },
    {
      campo: 'srs_superficie',
      nombre: 'Sistema de Referencia Geodésico del Cálculo',
      tipo: 'Texto (Código EPSG y Denominación Oficial)',
      definicion: 'Sistema de referencia de coordenadas proyectado empleado para garantizar métricas de área euclidianas no distorsionadas.',
      ejemplo: 'EPSG:32719 (WGS 84 / UTM Huso 19 Sur)',
      equivalenciaIDE: 'Sistema de Coordenadas de Referencia (gmd:MD_ReferenceSystem / EPSG:5361)',
      importancia: 'Garantiza la trazabilidad geodésica requerida por los estándares del SNIT e IDE Chile.'
    }
  ];

  const ETIQUETAS_TERRITORIALES_OSM = [
    // CAT-01: Educación y Universidad
    { tag: 'amenity=university', significado: 'Campus Universitario / Sede Central', categoria: 'CAT-01', grupo: 'educacion_servicios', institucion: 'MINEDUC / CRUCH', ideChile: 'Equipamiento de Educación / Edificio Universitario', aplicacionUAH: 'Campus Patrimonial UAH (Almirante Barroso, Cienfuegos, Erasmo Escala), Casa Central UDP.', citaAPA: '(MINEDUC, 2023; WikiProject Chile, 2024)' },
    { tag: 'amenity=college', significado: 'Instituto Profesional (IP) / Centro de Formación Técnica (CFT)', categoria: 'CAT-01', grupo: 'educacion_servicios', institucion: 'MINEDUC / Subsecretaría de Educación Superior', ideChile: 'Equipamiento de Educación / Formación Técnica', aplicacionUAH: 'Institutos y sedes de formación técnica en Alameda y República.', citaAPA: '(MINEDUC, 2023)' },
    { tag: 'amenity=school', significado: 'Colegio / Escuela Básica / Liceo Tradicional', categoria: 'CAT-01', grupo: 'educacion_servicios', institucion: 'MINEDUC / SLEP Santiago', ideChile: 'Equipamiento de Educación / Escuela o Colegio', aplicacionUAH: 'Liceo Miguel Luis Amunátegui y Escuela República de Panamá.', citaAPA: '(MINEDUC, 2023; IDE Chile, 2020)' },
    { tag: 'amenity=kindergarten', significado: 'Jardín Infantil / Sala Cuna (JUNJI / Integra)', categoria: 'CAT-01', grupo: 'educacion_servicios', institucion: 'Subsecretaría de Educación Parvularia / JUNJI', ideChile: 'Equipamiento de Educación / Parvularia', aplicacionUAH: 'Jardines infantiles y salas cuna públicas en calle Cienfuegos.', citaAPA: '(JUNJI, 2022; MINEDUC, 2023)' },
    { tag: 'amenity=library', significado: 'Biblioteca Pública o Universitaria', categoria: 'CAT-01', grupo: 'educacion_servicios', institucion: 'SERPAT / Universidades', ideChile: 'Equipamiento Cultural / Biblioteca', aplicacionUAH: 'Biblioteca Central UAH y Biblioteca de Santiago en Quinta Normal.', citaAPA: '(SERPAT, 2023; UAH, 2023)' },

    // CAT-02: Servicios, Salud, Seguridad y Comercio de Barrio
    { tag: 'amenity=clinic', significado: 'CESFAM / CECOSF / Consultorio de Salud Familiar', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MINSAL / FONASA', ideChile: 'Equipamiento de Salud / Centro Salud Familiar', aplicacionUAH: 'CESFAM N° 1 Ramón Corbalán Melgarejo en Santiago Poniente.', citaAPA: '(MINSAL, 2023; IDE Chile, 2020)' },
    { tag: 'amenity=hospital', significado: 'Hospital Público / Complejo Hospitalario / Clínica', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MINSAL / Red Asistencial Pública', ideChile: 'Equipamiento de Salud / Hospital', aplicacionUAH: 'Hospital San Juan de Dios y Hospital de Urgencia Asistencia Pública.', citaAPA: '(MINSAL, 2023; IDE Chile, 2020)' },
    { tag: 'amenity=pharmacy', significado: 'Farmacia de Barrio / Farmacia Comunal Popular', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MINSAL / ISP', ideChile: 'Equipamiento de Comercio / Farmacia', aplicacionUAH: 'Farmacia Popular de Santiago y cadenas en ejes Alameda y Brasil.', citaAPA: '(ISP Chile, 2022; INE, 2021)' },
    { tag: 'amenity=dentist', significado: 'Consulta Odontológica / Clínica Dental', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MINSAL / Colegio Odontológico', ideChile: 'Servicios de Salud Dental', aplicacionUAH: 'Clínicas odontológicas docentes en sector universitario República.', citaAPA: '(MINSAL, 2023)' },
    { tag: 'amenity=veterinary', significado: 'Clínica Veterinaria / Atención de Mascotas', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SUBDERE (Ley N° 21.020)', ideChile: 'Servicios Veterinarios / Tenencia Responsable', aplicacionUAH: 'Clínica veterinaria barrial en calle Maturana.', citaAPA: '(SUBDERE, 2018)' },
    { tag: 'amenity=police', significado: 'Comisaría de Carabineros / Cuartel PDI', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'Ministerio del Interior / Carabineros', ideChile: 'Equipamiento de Seguridad y Policía', aplicacionUAH: '3ª Comisaría de Carabineros de Santiago Centro.', citaAPA: '(Ministerio del Interior, 2022; Carabineros, 2023)' },
    { tag: 'amenity=fire_station', significado: 'Compañía de Bomberos de Chile (Rescate y Apagado)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'Cuerpo de Bomberos de Santiago (Ley 20.564)', ideChile: 'Equipamiento de Emergencias y Bomberos', aplicacionUAH: '11ª Compañía "Pompa Italia" en calle República con Alameda.', citaAPA: '(Bomberos de Chile, 2022)' },
    { tag: 'emergency=ambulance_station', significado: 'Base de Ambulancias SAMU (131)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MINSAL / SAMU Metropolitano', ideChile: 'Red Asistencial de Urgencias Médicas', aplicacionUAH: 'Base SAMU Poniente en Hospital San Juan de Dios.', citaAPA: '(MINSAL, 2023)' },
    { tag: 'emergency=defibrillator', significado: 'Desfibrilador Externo Automático (DEA)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MINSAL (Ley N° 21.156)', ideChile: 'Dispositivo Cardíaco de Emergencia', aplicacionUAH: 'DEA en andenes de Metro Los Héroes, Santa Ana y campus UAH.', citaAPA: '(MINSAL, 2019)' },
    { tag: 'amenity=townhall', significado: 'Municipalidad / Edificio Consistorial', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SUBDERE / Municipalidad de Santiago', ideChile: 'Administración Local y Gobierno Comunal', aplicacionUAH: 'Centro Comunitario Municipal y Casa Consistorial Santiago.', citaAPA: '(SUBDERE, 2022)' },
    { tag: 'office=government', significado: 'Oficina Pública Estatal (Registro Civil, SII, ChileAtiende)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'Ministerio de Justicia / Hacienda / Trabajo', ideChile: 'Edificio de Servicios Públicos del Estado', aplicacionUAH: 'Sucursales de Registro Civil y ChileAtiende en Santiago Centro.', citaAPA: '(ChileAtiende, 2023; IDE Chile, 2020)' },
    { tag: 'amenity=community_centre', significado: 'Sede Social / Junta de Vecinos (JJVV)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SUBDERE / Municipalidad de Santiago', ideChile: 'Equipamiento Social y Comunitario Barrial', aplicacionUAH: 'Junta de Vecinos Barrio Brasil en calle Huérfanos.', citaAPA: '(INE, 2017; Municipalidad de Santiago, 2021)' },
    { tag: 'amenity=post_office', significado: 'Sucursal Postal (CorreosChile, Encomiendas)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'MTT / Correos de Chile', ideChile: 'Infraestructura de Servicios Postales', aplicacionUAH: 'Sucursal CorreosChile en calle Moneda / Alameda.', citaAPA: '(Correos de Chile, 2023)' },
    { tag: 'shop=bakery', significado: 'Panadería / Amasandería Tradicional Chilena', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SERCOTEC / Fomento Barrial', ideChile: 'Comercio de Alimentación de Proximidad', aplicacionUAH: 'Panadería Las Rosas Chicas y panaderías de calle Maturana y Huérfanos.', citaAPA: '(SERCOTEC, 2022; INE, 2021)' },
    { tag: 'shop=convenience', significado: 'Almacén de Barrio / Minimarket Vecinal', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SERCOTEC / Economía Barrial', ideChile: 'Comercio Minorista de Alimentos de Barrio', aplicacionUAH: 'Almacenes de proximidad en calles Cienfuegos y Barroso.', citaAPA: '(SERCOTEC, 2022; INE, 2021)' },
    { tag: 'shop=supermarket', significado: 'Supermercado de Cadena / Autoservicio', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'Ministerio de Economía / INE', ideChile: 'Comercio Mayor de Alimentos y Autoservicio', aplicacionUAH: 'Santa Isabel en Av. Brasil y Lider Express en San Pablo.', citaAPA: '(INE, 2021; Taginfo Chile, 2026)' },
    { tag: 'amenity=marketplace', significado: 'Feria Libre Tradicional Regulada / Mercado', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'ASOF Chile / Municipalidad de Santiago', ideChile: 'Comercio Popular y Ferias Libres Tradicionales', aplicacionUAH: 'Feria libre tradicional de calle Esperanza y Mercado Cueto.', citaAPA: '(ASOF Chile, 2021; ODEPA, 2022)' },
    { tag: 'shop=alcohol', significado: 'Botillería Tradicional con Patente de Alcoholes', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'Dirección de Rentas Municipales', ideChile: 'Comercio Minorista de Bebidas y Licores', aplicacionUAH: 'Botillerías de barrio en Maturana y Santo Domingo.', citaAPA: '(INE, 2021)' },
    { tag: 'shop=greengrocer', significado: 'Verdulería / Frutería Local de Barrio', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SERCOTEC', ideChile: 'Comercio de Alimentos Frescos Frutas y Verduras', aplicacionUAH: 'Puestos y verdulerías tradicionales en calle Compañía.', citaAPA: '(INE, 2021)' },
    { tag: 'shop=hardware', significado: 'Ferretería de Barrio / Cerrajería', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SERCOTEC', ideChile: 'Comercio de Materiales Menores y Herramientas', aplicacionUAH: 'Ferreterías barriales tradicionales en calle Rosas.', citaAPA: '(INE, 2021)' },
    { tag: 'amenity=bank', significado: 'Sucursal Bancaria (BancoEstado, Santander, etc.)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'Comisión para el Mercado Financiero (CMF)', ideChile: 'Servicios Financieros y Bancarios', aplicacionUAH: 'BancoEstado Sucursal Brasil y bancos en eje Alameda.', citaAPA: '(CMF Chile, 2023)' },
    { tag: 'amenity=atm', significado: 'Cajero Automático (Redbanc)', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'CMF Chile / Redbanc', ideChile: 'Red de Cajeros Automáticos y Dispensadores', aplicacionUAH: 'Cajeros automáticos en boleterías de Metro y farmacias.', citaAPA: '(CMF Chile, 2023)' },
    { tag: 'amenity=cafe', significado: 'Cafetería / Salón de Té Universitario', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SERNATUR / Municipalidad de Santiago', ideChile: 'Servicios Gastronómicos y Encuentro Social', aplicacionUAH: 'Puntos de encuentro y estudio en Av. Brasil y calle Maturana.', citaAPA: '(INE, 2021; SERNATUR, 2022)' },
    { tag: 'amenity=restaurant', significado: 'Restaurante / Fuente de Soda Tradicional', categoria: 'CAT-02', grupo: 'educacion_servicios', institucion: 'SERNATUR / Ministerio de las Culturas', ideChile: 'Gastronomía Barrial Tradicional y Minutas', aplicacionUAH: 'Restaurante El Huaso Enrique y fuentes de soda en Alameda.', citaAPA: '(SERNATUR, 2022)' },

    // CAT-03: Movilidad y Transporte Público
    { tag: 'railway=station', significado: 'Estación de Metro de Santiago', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'Metro S.A. / MTT / DTPM', ideChile: 'Infraestructura de Transporte / Estación de Metro', aplicacionUAH: 'Estaciones Metro Los Héroes (L1/L2) y Metro Santa Ana (L2/L5).', citaAPA: '(Metro de Santiago, 2024; DTPM & MTT, 2023)' },
    { tag: 'railway=subway_entrance', significado: 'Acceso / Boca de Estación de Metro', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'Metro de Santiago', ideChile: 'Acceso Peatonal a Red Subterránea', aplicacionUAH: 'Bocas peatonales de Metro Santa Ana por Manuel Rodríguez y Catedral.', citaAPA: '(Metro de Santiago, 2024)' },
    { tag: 'highway=bus_stop', significado: 'Paradero de Buses del Sistema Red Movilidad', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'Directorio de Transporte Público Metropolitano (DTPM)', ideChile: 'Infraestructura de Transporte / Parada de Bus', aplicacionUAH: 'Paraderos troncales PA347 y PA377 en Alameda y Manuel Rodríguez.', citaAPA: '(DTPM & MTT, 2023)' },
    { tag: 'public_transport=platform', significado: 'Andén / Plataforma de Espera de Transporte', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'DTPM / MTT', ideChile: 'Infraestructura de Transporte / Andén Peatonal', aplicacionUAH: 'Andén segregado en corredor de transporte de la Alameda.', citaAPA: '(DTPM & MTT, 2023)' },
    { tag: 'amenity=bus_station', significado: 'Terminal de Buses Interurbanos', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'MTT / SEREMI de Transportes RM', ideChile: 'Terminal Terrestre de Pasajeros Interurbano', aplicacionUAH: 'Terminal de buses interurbanos Los Héroes en calle Tucapel Jiménez.', citaAPA: '(MTT, 2022)' },
    { tag: 'vending=public_transport_tickets', significado: 'Tótem / Punto de Carga de Tarjeta bip!', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'Metro S.A. / DTPM', ideChile: 'Servicio de Recaudación del Sistema Red', aplicacionUAH: 'Puntos de carga de tarjeta bip! en boleterías y locales adheridos.', citaAPA: '(DTPM & MTT, 2023)' },
    { tag: 'railway=subway', significado: 'Línea Férrea Subterránea de Metro', categoria: 'CAT-03', grupo: 'movilidad', institucion: 'Metro S.A.', ideChile: 'Infraestructura Ferroviaria Subterránea', aplicacionUAH: 'Trazados subterráneos de Líneas 1, 2 y 5 bajo ejes estructurantes.', citaAPA: '(Metro de Santiago, 2024)' },

    // CAT-04: Movilidad Activa y Micromovilidad
    { tag: 'highway=cycleway', significado: 'Ciclovía Segregada para Bicicletas', categoria: 'CAT-04', grupo: 'movilidad', institucion: 'MINVU (Manual Vialidad Cicloinclusiva) / MTT', ideChile: 'Infraestructura Vial Cicloinclusiva Segregada', aplicacionUAH: 'Ciclovía patrimonial calle Rosas y ciclovía Alameda Poniente.', citaAPA: '(MINVU, 2020; MTT, 2021)' },
    { tag: 'cycleway=lane', significado: 'Ciclobanda Demarcada en Calzada Mixta', categoria: 'CAT-04', grupo: 'movilidad', institucion: 'MINVU / Dirección de Tránsito Municipal', ideChile: 'Vía Cicloinclusiva Demarcada', aplicacionUAH: 'Ciclobanda en calzada de Av. Brasil.', citaAPA: '(MINVU, 2020)' },
    { tag: 'amenity=bicycle_parking', significado: 'Estacionamiento de Bicicletas (Biciestacionamiento)', categoria: 'CAT-04', grupo: 'movilidad', institucion: 'MINVU / DTPM / UAH', ideChile: 'Equipamiento para Transporte No Motorizado', aplicacionUAH: 'Puntos de anclaje de bicicletas en patios UAH y salidas de Metro.', citaAPA: '(MINVU, 2020; UAH, 2023)' },
    { tag: 'amenity=bicycle_rental', significado: 'Estación de Bicicletas Públicas Compartidas', categoria: 'CAT-04', grupo: 'movilidad', institucion: 'GORE Metropolitano / Municipios', ideChile: 'Sistema de Transporte Compartido de Micromovilidad', aplicacionUAH: 'Estación Bike Santiago en Plaza Brasil.', citaAPA: '(GORE RM, 2021)' },
    { tag: 'amenity=bicycle_repair_station', significado: 'Tótem de Reparación e Inflado de Bicis', categoria: 'CAT-04', grupo: 'movilidad', institucion: 'Municipios / Organizaciones Ciclistas', ideChile: 'Mobiliario de Apoyo a la Movilidad Activa', aplicacionUAH: 'Tótem de herramientas mecánicas en acceso a campus UAH.', citaAPA: '(WikiProject Chile, 2024)' },

    // CAT-05: Áreas Verdes, Espacio Público y Deporte
    { tag: 'leisure=park', significado: 'Parque Urbano Público / Plaza Barrial', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'MINVU (Política Nacional Parques Urbanos)', ideChile: 'Espacio Público / Parque Urbano / Plaza', aplicacionUAH: 'Plaza Brasil (hito barrial central) y Plaza Manuel Rodríguez.', citaAPA: '(MINVU, 2021; IDE Chile, 2020)' },
    { tag: 'leisure=playground', significado: 'Área de Juegos Infantiles Modulares', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'MINVU / Municipalidad de Santiago', ideChile: 'Equipamiento Recreativo Infantil en Espacio Público', aplicacionUAH: 'Esculturas lúdicas de juegos infantiles Federica Matta en Plaza Brasil.', citaAPA: '(MINVU, 2021)' },
    { tag: 'leisure=pitch', significado: 'Cancha de Baby Fútbol / Multicancha Comunitaria', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'Instituto Nacional de Deportes (IND)', ideChile: 'Equipamiento Deportivo Barrial Comunitario', aplicacionUAH: 'Multicanchas de juntas de vecinos en calle Moneda y barrio Yungay.', citaAPA: '(IND Chile, 2021)' },
    { tag: 'leisure=sports_centre', significado: 'Polideportivo Municipal / Complejo Deportivo', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'IND / Municipalidad de Santiago', ideChile: 'Complejo Deportivo y Recreativo Comunal', aplicacionUAH: 'Polideportivo comunal de Santiago Centro.', citaAPA: '(IND Chile, 2021)' },
    { tag: 'leisure=fitness_station', significado: 'Plaza Activa / Máquinas de Ejercicio al Aire Libre', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'MINVU / Municipalidades', ideChile: 'Equipamiento de Salud Activa y Calistenia', aplicacionUAH: 'Estaciones de máquinas de calistenia y ejercicio en Plaza Brasil.', citaAPA: '(MINVU, 2021)' },
    { tag: 'amenity=bench', significado: 'Banca / Escaño Público de Descanso', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'MINVU / Dirección de Aseo y Ornato', ideChile: 'Mobiliario Urbano de Descanso y Estancia', aplicacionUAH: 'Escaños patrimoniales en bandejón central de Av. Brasil.', citaAPA: '(MINVU, 2021)' },
    { tag: 'amenity=drinking_water', significado: 'Bebedero Público de Agua Potable', categoria: 'CAT-05', grupo: 'patrimonio_verde', institucion: 'Aguas Andinas / Municipalidades', ideChile: 'Mobiliario Urbano de Hidratación Pública', aplicacionUAH: 'Bebederos públicos para transeúntes en Plaza Brasil.', citaAPA: '(MINVU, 2021)' },

    // CAT-06: Patrimonio y Cultura
    { tag: 'historic=building', significado: 'Inmueble de Conservación Histórica (ICH) / Casona', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'Consejo de Monumentos Nacionales (CMN) / DOM', ideChile: 'Patrimonio Arquitectónico Protegido por PRC', aplicacionUAH: 'Casonas Neoclásicas UAH (Almirante Barroso 10, Cienfuegos 41).', citaAPA: '(CMN & MINCAP, 2022; Municipalidad de Santiago, 2019)' },
    { tag: 'historic=monument', significado: 'Monumento Público / Escultura Nacional', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'Consejo de Monumentos Nacionales (Ley 17.288)', ideChile: 'Monumento Público Nacional', aplicacionUAH: 'Esculturas y monumentos conmemorativos en Plaza Brasil.', citaAPA: '(CMN & MINCAP, 2022; Ley N° 17.288)' },
    { tag: 'historic=memorial', significado: 'Memorial de Derechos Humanos / Hito Conmemorativo', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'Subsecretaría de Derechos Humanos / CMN', ideChile: 'Sitio de Memoria Histórica y Hito Conmemorativo', aplicacionUAH: 'Placas recordatorias en sedes comunitarias y sindicales de la zona.', citaAPA: '(Subsecretaría de DDHH, 2021)' },
    { tag: 'heritage=cite', significado: 'Cité Patrimonial / Pasaje Habitacional Tradicional', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'MINVU / CMN / Municipalidad de Santiago', ideChile: 'Tipología Residencial Colectiva Tradicional', aplicacionUAH: 'Cité Lucrecia Valdés y pasajes tradicionales de calle Huérfanos.', citaAPA: '(Municipalidad de Santiago, 2019; Hidalgo, 2005)' },
    { tag: 'amenity=place_of_worship', significado: 'Templo Religioso / Basílica / Parroquia', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'CMN / Arzobispado de Santiago', ideChile: 'Patrimonio Arquitectónico y Religioso', aplicacionUAH: 'Basílica del Salvador (Monumento Histórico en Huérfanos con Barroso).', citaAPA: '(CMN & MINCAP, 2022)' },
    { tag: 'amenity=arts_centre', significado: 'Centro Cultural Comunitario / Galpón de Arte', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'Ministerio de las Culturas, las Artes y el Patrimonio', ideChile: 'Equipamiento Cultural y Artístico Barrial', aplicacionUAH: 'Centro Cultural de Barrio Brasil y Galpón Víctor Jara.', citaAPA: '(MINCAP, 2022)' },
    { tag: 'tourism=museum', significado: 'Museo Público / Histórico / Universitario', categoria: 'CAT-06', grupo: 'patrimonio_verde', institucion: 'Servicio Nacional del Patrimonio Cultural (SERPAT)', ideChile: 'Equipamiento Museográfico Nacional', aplicacionUAH: 'Museo de la Educación Gabriela Mistral (Chacabuco con Compañía).', citaAPA: '(SERPAT, 2023)' },

    // CAT-07: Accesibilidad Universal
    { tag: 'kerb=lowered', significado: 'Rebaje de Solera / Vado Peatonal en Esquina', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', institucion: 'MINVU (OGUC Art. 2.2.8 / D.S. 50) / SENADIS', ideChile: 'Infraestructura de Accesibilidad Peatonal (D.S. 50)', aplicacionUAH: 'Rebajes de solera en cruce Alameda con Almirante Barroso.', citaAPA: '(MINVU, 2016; SENADIS, 2021)' },
    { tag: 'kerb=flush', significado: 'Cordón a Nivel Cero / Plataforma Única', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', institucion: 'MINVU / SERVIU Metropolitano', ideChile: 'Vado Peatonal en Rasante Continua', aplicacionUAH: 'Pasos a nivel en paseos peatonales y calles calmadas.', citaAPA: '(MINVU, 2016)' },
    { tag: 'highway=crossing', significado: 'Paso Peatonal Demarcado (Paso Cebra / Semaforizado)', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', institucion: 'CONASET (Ministerio de Transportes) / MINVU', ideChile: 'Infraestructura de Seguridad Peatonal y Cruce', aplicacionUAH: 'Cruces demarcados en calle Cienfuegos frente a facultades UAH.', citaAPA: '(CONASET, 2022; MTT, 2021)' },
    { tag: 'tactile_paving=yes', significado: 'Pavimento Podotáctil de Alerta o Guía (Baldosa Táctil)', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', institucion: 'MINVU (D.S. 50) / SENADIS', ideChile: 'Dispositivo Podotáctil para Discapacidad Visual', aplicacionUAH: 'Baldosas podotáctiles en esquinas y andenes de Metro Santiago.', citaAPA: '(MINVU, 2016; SENADIS, 2021)' },
    { tag: 'traffic_signals:sound=yes', significado: 'Semáforo Peatonal Audible (Señal Acústica)', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', institucion: 'Unidad Operativa de Control de Tránsito (UOCT)', ideChile: 'Dispositivo Acústico de Apoyo al Cruce Seguro', aplicacionUAH: 'Semáforo sonoro en eje Alameda con Los Héroes.', citaAPA: '(UOCT & MTT, 2022)' },
    { tag: 'wheelchair=yes', significado: 'Recinto o Local 100% Accesible para Sillas de Ruedas', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', institucion: 'MINVU / SENADIS', ideChile: 'Calificación de Accesibilidad Física de Edificaciones', aplicacionUAH: 'Edificios universitarios UAH con rampa y ascensor accesible.', citaAPA: '(SENADIS, 2021; ISO 21542:2021)' },

    // CAT-08: Biodiversidad Urbana
    { tag: 'natural=tree', significado: 'Árbol Urbano de Alineación en Acera o Plaza', categoria: 'CAT-08', grupo: 'accesibilidad_biodiv', institucion: 'Corporación Nacional Forestal (CONAF) / Municipios', ideChile: 'Arbolado y Silvicultura Urbana', aplicacionUAH: 'Plátanos orientales y jacarandás en bandejón central de Av. Brasil.', citaAPA: '(CONAF, 2019; MMA, 2022)' },
    { tag: 'natural=wood', significado: 'Masa Arbórea Continua / Bosquete Urbano', categoria: 'CAT-08', grupo: 'accesibilidad_biodiv', institucion: 'CONAF / MMA', ideChile: 'Cobertura Vegetal y Bosque Urbano', aplicacionUAH: 'Área arbolada densa en Parque Quinta Normal.', citaAPA: '(CONAF, 2019; IDE Chile, 2020)' }
  ];

  const CATEGORIAS_MAESTRAS = [
    {
      codigo: 'CAT-01',
      id_manual: 'manual-cat-01',
      nombre: 'Movilidad y Transporte Urbano',
      icono: '🚌',
      resumen: 'Paraderos Red Movilidad, estaciones Metro Los Héroes y Santa Ana, ciclovías y vías estructurantes.',
      filtro_grupo: 'movilidad'
    },
    {
      codigo: 'CAT-02',
      id_manual: 'manual-cat-02',
      nombre: 'Equipamiento Comunitario y Social',
      icono: '🎓',
      resumen: 'Campus universitario UAH (Almirante Barroso, Erasmo Escala), colegios, salas cuna y juntas vecinales.',
      filtro_grupo: 'educacion_servicios'
    },
    {
      codigo: 'CAT-03',
      id_manual: 'manual-cat-03',
      nombre: 'Salud y Bienestar',
      icono: '🏥',
      resumen: 'CESFAM N° 5, SAPU, farmacias de turno, clínicas veterinarias y desfibriladores de emergencia (DEA).',
      filtro_grupo: 'educacion_servicios'
    },
    {
      codigo: 'CAT-04',
      id_manual: 'manual-cat-04',
      nombre: 'Comercio y Economía Barrial',
      icono: '🥖',
      resumen: 'Amasanderías artesanales, panaderías, ferias libres semanales, cafés culturales y almacenes de barrio.',
      filtro_grupo: 'educacion_servicios'
    },
    {
      codigo: 'CAT-05',
      id_manual: 'manual-cat-05',
      nombre: 'Seguridad y Emergencias',
      icono: '🚒',
      resumen: '11ª y 12ª Compañías de Bomberos de Santiago, 3ª Comisaría de Carabineros y red de grifos contra incendios.',
      filtro_grupo: 'educacion_servicios'
    },
    {
      codigo: 'CAT-06',
      id_manual: 'manual-cat-06',
      nombre: 'Espacio Público, Deporte y Recreación',
      icono: '🌳',
      resumen: 'Plaza Brasil, multicanchas barriales, plazas de bolsillo, bebederos públicos y juegos infantiles.',
      filtro_grupo: 'patrimonio_verde'
    },
    {
      codigo: 'CAT-07',
      id_manual: 'manual-cat-07',
      nombre: 'Patrimonio Urbano y Cultura',
      icono: '🏛️',
      resumen: 'Cités residenciales históricos, casonas protegidas, Inmuebles de Conservación Histórica (ICH) y museos.',
      filtro_grupo: 'patrimonio_verde'
    },
    {
      codigo: 'CAT-08',
      id_manual: 'manual-cat-08',
      nombre: 'Medio Ambiente y Accesibilidad Universal',
      icono: '♿',
      resumen: 'Rebajes de solera D.S. 50 MINVU, baldosas táctiles podotáctiles y arbolado viario de sombra.',
      filtro_grupo: 'accesibilidad_biodiv'
    }
  ];

  function irACategoriaManual(codigo) {
    const cod = (codigo || '').toUpperCase().trim();
    const mapIds = {
      'CAT-01': 'manual-cat-01',
      'CAT-02': 'manual-cat-02',
      'CAT-03': 'manual-cat-03',
      'CAT-04': 'manual-cat-04',
      'CAT-05': 'manual-cat-05',
      'CAT-06': 'manual-cat-06',
      'CAT-07': 'manual-cat-07',
      'CAT-08': 'manual-cat-08'
    };
    const targetId = mapIds[cod] || 'manual-cat-01';
    if (typeof window.navegarAManual === 'function') {
      window.navegarAManual(targetId);
    } else {
      const btn = document.querySelector('button[data-panel="manual"]');
      if (btn) btn.click();
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }

  function filtrarPorCodigo(codigo) {
    const input = document.getElementById('filtro-diccionario');
    if (input) {
      input.value = codigo;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function render(filtroTexto = '', filtroGrupo = 'todos') {
    const texto = filtroTexto.toLowerCase().trim();

    const mostrarAtributos = (filtroGrupo === 'todos' || filtroGrupo === 'esquema');
    const mostrarEtiquetas = (filtroGrupo !== 'esquema');

    const atributosFiltrados = ATRIBUTOS_NORMALIZADOS.filter(a =>
      !texto || a.campo.toLowerCase().includes(texto) || a.nombre.toLowerCase().includes(texto) || a.definicion.toLowerCase().includes(texto) || a.equivalenciaIDE.toLowerCase().includes(texto)
    );

    const etiquetasFiltradas = ETIQUETAS_TERRITORIALES_OSM.filter(e => {
      const coincideTexto = !texto || e.tag.toLowerCase().includes(texto) || e.significado.toLowerCase().includes(texto) || e.aplicacionUAH.toLowerCase().includes(texto) || e.categoria.toLowerCase().includes(texto) || (e.institucion && e.institucion.toLowerCase().includes(texto)) || (e.citaAPA && e.citaAPA.toLowerCase().includes(texto));
      const coincideGrupo = (filtroGrupo === 'todos' || e.grupo === filtroGrupo);
      return coincideTexto && coincideGrupo;
    });

    // 1. Tarjetas Superiores Sobrias e Interactivas de las 8 Macro-Categorías
    const tarjetasCategoriasHTML = `
      <div class="dicc-tarjetas-seccion">
        <div class="dicc-tarjetas-header">
          <span class="marcador">00</span>
          <h3 style="display:inline; margin-left:6px;">Taxonomía Territorial: 8 Macro-Categorías VGI para Chile</h3>
          <p class="descripcion" style="margin-top:4px;">
            Seleccione <strong>[🔍 Filtrar]</strong> para aislar los descriptores de esa categoría en la tabla, o pulse <strong>[📖 Manual ↗]</strong> para abrir su ficha detallada en el <strong>Manual de Uso del Atlas</strong>:
          </p>
        </div>
        <div class="dicc-grid-tarjetas">
          ${CATEGORIAS_MAESTRAS.map(cat => `
            <div class="dicc-tarjeta-cat" data-codigo="${cat.codigo}">
              <div class="dicc-tarjeta-top">
                <span class="dicc-cat-badge">${cat.codigo}</span>
                <span class="dicc-cat-icono">${cat.icono}</span>
              </div>
              <h4 class="dicc-cat-titulo">${cat.nombre}</h4>
              <p class="dicc-cat-resumen">${cat.resumen}</p>
              <div class="dicc-tarjeta-acciones">
                <button type="button" class="dicc-btn-filtrar" onclick="ModuloDiccionario.filtrarPorCodigo('${cat.codigo}')" title="Filtrar descriptores de ${cat.codigo}">
                  🔍 Filtrar
                </button>
                <button type="button" class="dicc-btn-manual" onclick="ModuloDiccionario.irACategoriaManual('${cat.codigo}')" title="Ver guía metodológica y ejemplos en el Manual">
                  📖 Manual ↗
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // 2. Tabla de Atributos Normalizados
    const htmlAtributos = atributosFiltrados.map(a => {
      let enlaceDoc = '';
      if (a.campo === 'categoria') {
        enlaceDoc = `<button type="button" class="dicc-tag-cat-link" onclick="window.navegarAManual('doc-categorias')" style="margin-left:4px; font-size:0.75rem;">Ver 8 Cats ↗</button>`;
      } else if (a.campo === 'superficie_m2' || a.campo === 'superficie_ha') {
        enlaceDoc = `<button type="button" class="dicc-tag-cat-link" onclick="window.navegarAManual('doc-geodesia')" style="margin-left:4px; font-size:0.75rem;">Geodesia ↗</button>`;
      } else if (a.campo === 'licencia') {
        enlaceDoc = `<button type="button" class="dicc-tag-cat-link" onclick="window.navegarAManual('doc-gobernanza')" style="margin-left:4px; font-size:0.75rem;">Licencias ↗</button>`;
      }

      return `
        <tr style="border-bottom:1px solid var(--linea);">
          <td><strong style="color:var(--musgo); font-family:'IBM Plex Mono', monospace;">${a.campo}</strong>${enlaceDoc}</td>
          <td><strong>${a.nombre}</strong><br><small style="color:var(--tinta-suave);">${a.tipo}</small></td>
          <td style="font-size:0.85rem;">${a.definicion}<br><span class="descripcion" style="font-style:italic;">Ejemplo: ${a.ejemplo}</span></td>
          <td style="font-size:0.82rem; background:var(--papel-alto);"><code>${a.equivalenciaIDE}</code></td>
          <td style="font-size:0.82rem;">${a.importancia}</td>
        </tr>
      `;
    }).join('');

    // 3. Tabla de Etiquetas Territoriales con Enlaces al Manual
    const htmlEtiquetas = etiquetasFiltradas.map(e => `
      <tr style="border-bottom:1px solid var(--linea);">
        <td><code style="font-weight:600; color:var(--musgo); font-size:0.88rem;">${e.tag}</code></td>
        <td><strong>${e.significado}</strong></td>
        <td>
          <button type="button" class="dicc-tag-cat-link" onclick="ModuloDiccionario.irACategoriaManual('${e.categoria}')" title="Ver ficha metodológica de ${e.categoria} en el Manual de Uso">
            ${e.categoria} ↗
          </button>
        </td>
        <td style="font-size:0.82rem; color:var(--musgo);"><strong>${e.institucion || 'Comunidad OSM'}</strong><br><small style="color:var(--tinta-suave);">${e.ideChile || 'Catastro IDE'}</small></td>
        <td style="font-size:0.84rem; color:var(--tinta-suave);">${e.aplicacionUAH}</td>
        <td style="font-size:0.80rem; font-family:'IBM Plex Mono', monospace; background:var(--papel-alto);">${e.citaAPA || 'APA 7ª ed.'}</td>
      </tr>
    `).join('');

    let bloqueAtributosHTML = '';
    if (mostrarAtributos) {
      bloqueAtributosHTML = `
        <div class="bloque">
          <h3>1. Esquema de Datos VGI Normalizado (Atributos IDE Chile / ISO 19110 / ISO 19115)</h3>
          <p class="descripcion">Cada entidad descargada o proyectada en el Atlas adopta esta estructura tabular interoperable con SIG institucionales (QGIS / ArcGIS), el Perfil Nacional de Metadatos de Chile y métricas métricas en m² (EPSG:32719):</p>
          <div style="overflow-x:auto;">
            <table class="tabla-datos" style="margin-top:10px; font-size:0.88rem;">
              <thead>
                <tr style="background:var(--papel-alto);">
                  <th>Campo</th>
                  <th>Nombre Atributo</th>
                  <th>Definición y Dominio</th>
                  <th>Equivalencia IDE Chile / ISO 19115</th>
                  <th>Relevancia para la Gestión</th>
                </tr>
              </thead>
              <tbody>
                ${htmlAtributos.length > 0 ? htmlAtributos : '<tr><td colspan="5" style="text-align:center; padding:12px; color:var(--tinta-suave);">No hay atributos que coincidan con la búsqueda.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    let bloqueEtiquetasHTML = '';
    if (mostrarEtiquetas) {
      bloqueEtiquetasHTML = `
        <div class="bloque" style="margin-top:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
            <h3 style="margin:0;">2. Glosario Territorial de Etiquetas OSM en Chile (${etiquetasFiltradas.length} descriptores clasificados)</h3>
            <a href="docs/categorias_tematicas_osm.xlsx" download="categorias_tematicas_osm.xlsx" class="accion secundaria" style="font-size:0.82rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:5px 12px;">
              📊 Descargar Catálogo Excel Completo (.xlsx con 4 Hojas y Citas APA)
            </a>
          </div>
          <p class="descripcion">Traducción sistemática de tags técnicos colaborativos a conceptos territoriales chilenos, instituciones contraparte del Estado, aplicaciones en Barrio Brasil / UAH y fuentes bibliográficas en norma APA. Haga clic en cualquier código (ej: <code>CAT-01 ↗</code>) para abrir su sección en el Manual de Uso:</p>
          <div style="overflow-x:auto;">
            <table class="tabla-datos" style="margin-top:10px; font-size:0.86rem;">
              <thead>
                <tr style="background:var(--papel-alto);">
                  <th>Etiqueta OSM (Tag)</th>
                  <th>Denominación Común en Chile</th>
                  <th>Categoría Atlas</th>
                  <th>Institución Contraparte / IDE Chile</th>
                  <th>Aplicación en Barrio Brasil / UAH</th>
                  <th>Trazabilidad / Cita APA</th>
                </tr>
              </thead>
              <tbody>
                ${htmlEtiquetas.length > 0 ? htmlEtiquetas : '<tr><td colspan="6" style="text-align:center; padding:12px; color:var(--tinta-suave);">No hay etiquetas que coincidan con el filtro seleccionado.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return `
      ${tarjetasCategoriasHTML}

      <div class="caja-guia-referencia" style="margin-top:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
          <div>
            <h4>📖 Marco Metodológico de Catalogación Geográfica (ISO 19110 / SNIT Chile / APA 7ª ed.)</h4>
            <p style="margin-bottom:8px;">
              Para que los datos de Información Geográfica Voluntaria (VGI) sean aptos para revisión por personas no técnicas y comités académicos, deben regirse por el estándar <strong>ISO 19110 (Metodología para la catalogación de fenómenos geográficos)</strong> y el <strong>Catálogo de Objetos Geográficos de Chile v3.0 (IDE Chile / SNIT)</strong>. Esto garantiza que cada etiqueta abierta tenga un significado inequívoco, medible y contrastable con la cartografía municipal y fiscal.
            </p>
          </div>
          <div>
            <a href="docs/categorias_tematicas_osm.xlsx" download class="accion" style="font-size:0.82rem; text-decoration:none; padding:6px 14px; white-space:nowrap; display:inline-flex; align-items:center; gap:6px;">
              📥 Descargar categorias_tematicas_osm.xlsx
            </a>
          </div>
        </div>
        <ul style="margin-top:6px; font-size:0.85rem; line-height:1.45;">
          <li><strong>IDE Chile / SNIT (2020):</strong> <em>Catálogo de Objetos Geográficos de Chile v3.0: Estándar para la captura y clasificación de información geoespacial.</em> Ministerio de Bienes Nacionales. https://www.ide.cl</li>
          <li><strong>OpenStreetMap Wiki Chile (2024):</strong> <em>WikiProject Chile: Guía, directrices y convenciones comunitarias de mapeo para Chile.</em> https://wiki.openstreetmap.org/wiki/ES:Chile</li>
          <li><strong>Geofabrik & HeiGIT (2026):</strong> <em>Taginfo Chile: Regional OpenStreetMap Tag Usage and Statistics.</em> https://taginfo.geofabrik.de/south-america:chile</li>
          <li><strong>ISO/TC 211 (2016):</strong> <em>ISO 19110:2016: Geographic information — Methodology for feature cataloguing.</em> International Organization for Standardization.</li>
        </ul>
      </div>

      ${bloqueAtributosHTML}
      ${bloqueEtiquetasHTML}
    `;
  }

  return {
    ATRIBUTOS_NORMALIZADOS,
    ETIQUETAS_TERRITORIALES_OSM,
    CATEGORIAS_MAESTRAS,
    irACategoriaManual,
    filtrarPorCodigo,
    render
  };
})();
