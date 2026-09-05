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
    {"tag": "amenity=university", "significado": "Campus Universitario / Sede Central", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "MINEDUC / CRUCH", "ideChile": "Equipamiento de Educación / Edificio Universitario", "aplicacionUAH": "Universidad Alberto Hurtado (Casa Central Barroso 10)", "citaAPA": "(MINEDUC, 2023; WikiProject Chile, 2024)"},
    {"tag": "amenity=college", "significado": "Instituto Profesional (IP) / Centro Formación Técnica (CFT)", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "MINEDUC / Subsecretaría de Educación Superior", "ideChile": "Equipamiento de Educación / Formación Técnica", "aplicacionUAH": "Sedes de educación técnica en eje Alameda y República", "citaAPA": "(MINEDUC, 2023)"},
    {"tag": "amenity=school", "significado": "Colegio / Escuela Básica / Liceo Tradicional", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "MINEDUC / SLEP Santiago", "ideChile": "Equipamiento de Educación / Escuela o Colegio", "aplicacionUAH": "Liceo Miguel Luis Amunátegui / Escuela Rep. de Panamá", "citaAPA": "(MINEDUC, 2023; IDE Chile, 2020)"},
    {"tag": "amenity=kindergarten", "significado": "Jardín Infantil / Sala Cuna (JUNJI / Integra)", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "Subsecretaría de Educación Parvularia", "ideChile": "Equipamiento de Educación / Educación Parvularia", "aplicacionUAH": "Jardín Infantil Barrial JUNJI calle Cienfuegos", "citaAPA": "(JUNJI, 2022; MINEDUC, 2023)"},
    {"tag": "amenity=library", "significado": "Biblioteca Pública o Universitaria", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "Servicio Nacional del Patrimonio Cultural (SERPAT)", "ideChile": "Equipamiento Cultural / Biblioteca", "aplicacionUAH": "Biblioteca Central UAH / Biblioteca de Santiago", "citaAPA": "(SERPAT, 2023; UAH, 2023)"},
    {"tag": "amenity=student_accommodation", "significado": "Residencia Universitaria / Pensionado Estudiantil", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "MINEDUC / Instituciones Universitarias", "ideChile": "Alojamiento y Residencia Estudiantil", "aplicacionUAH": "Residencias universitarias en eje Almirante Barroso", "citaAPA": "(MINEDUC, 2023)"},
    {"tag": "amenity=research_institute", "significado": "Centro de Investigación / Instituto Científico", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "Ministerio de Ciencia, Tecnología e Innovación", "ideChile": "Infraestructura de Ciencia y Tecnología", "aplicacionUAH": "Centros de investigación de facultades UAH", "citaAPA": "(OECD, 2017; UAH, 2023)"},
    {"tag": "amenity=music_school", "significado": "Conservatorio / Academia de Música y Artes", "categoria": "CAT-01", "grupo": "educacion_servicios", "institucion": "MINCAP / MINEDUC", "ideChile": "Equipamiento de Formación Artística", "aplicacionUAH": "Academias de música y arte en Barrio Brasil", "citaAPA": "(MINCAP, 2022)"},
    {"tag": "amenity=clinic", "significado": "CESFAM / CECOSF / Consultorio de Salud Familiar", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "MINSAL / FONASA (Modelo Salud Familiar)", "ideChile": "Equipamiento de Salud / Centro de Salud Familiar", "aplicacionUAH": "CESFAM N° 1 Ramón Corbalán Melgarejo", "citaAPA": "(MINSAL, 2023; IDE Chile, 2020)"},
    {"tag": "amenity=hospital", "significado": "Hospital Público / Complejo Hospitalario / Clínica", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "MINSAL / Red Asistencial Pública", "ideChile": "Equipamiento de Salud / Hospital", "aplicacionUAH": "Hospital San Juan de Dios / Posta Central", "citaAPA": "(MINSAL, 2023; IDE Chile, 2020)"},
    {"tag": "amenity=pharmacy", "significado": "Farmacia de Barrio / Farmacia Comunal Popular", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "MINSAL / Instituto de Salud Pública (ISP)", "ideChile": "Equipamiento de Comercio / Farmacia", "aplicacionUAH": "Farmacia Popular Comuna de Santiago / Cruz Verde Brasil", "citaAPA": "(ISP Chile, 2022; INE, 2021)"},
    {"tag": "amenity=dentist", "significado": "Consulta Odontológica / Clínica Dental", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "MINSAL / Colegio de Cirujano Dentistas", "ideChile": "Servicios Profesionales de Salud Dental", "aplicacionUAH": "Clínicas odontológicas universitarias en sector República", "citaAPA": "(MINSAL, 2023)"},
    {"tag": "amenity=veterinary", "significado": "Clínica Veterinaria / Atención de Mascotas", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SUBDERE (Ley N° 21.020 Tenencia Responsable)", "ideChile": "Servicios Veterinarios / Tenencia Responsable", "aplicacionUAH": "Clínica veterinaria barrial en calle Maturana", "citaAPA": "(SUBDERE, 2018)"},
    {"tag": "emergency=ambulance_station", "significado": "Base de Ambulancias SAMU (131)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "MINSAL / SAMU Metropolitano", "ideChile": "Red Asistencial de Urgencias Médicas", "aplicacionUAH": "Base SAMU Poniente en Hospital San Juan de Dios", "citaAPA": "(MINSAL, 2023)"},
    {"tag": "emergency=defibrillator", "significado": "Desfibrilador Externo Automático (DEA)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "MINSAL (Ley N° 21.156 Desfibriladores Públicos)", "ideChile": "Dispositivo Cardíaco de Emergencia Ciudadana", "aplicacionUAH": "DEA en andenes de Metro Los Héroes y Santa Ana", "citaAPA": "(MINSAL, 2019)"},
    {"tag": "emergency=fire_hydrant", "significado": "Grifo de Incendio Urbano", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Superintendencia de Servicios Sanitarios (SISS) / Bomberos", "ideChile": "Infraestructura Hidráulica de Extinción de Incendios", "aplicacionUAH": "Grifo de incendio en Almirante Barroso esq. Alameda", "citaAPA": "(Bomberos de Chile, 2022; SISS, 2022)"},
    {"tag": "amenity=police", "significado": "Comisaría de Carabineros / Cuartel PDI", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Ministerio del Interior y Seguridad Pública", "ideChile": "Equipamiento de Seguridad Pública y Policial", "aplicacionUAH": "3ª Comisaría de Carabineros de Santiago Centro", "citaAPA": "(Ministerio del Interior, 2022; Carabineros, 2023)"},
    {"tag": "amenity=fire_station", "significado": "Compañía del Cuerpo de Bomberos de Chile", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Junta Nacional de Cuerpos de Bomberos (Ley 20.564)", "ideChile": "Equipamiento de Emergencias y Bomberos", "aplicacionUAH": "11ª Compañía Pompa Italia (Calle República)", "citaAPA": "(Bomberos de Chile, 2022)"},
    {"tag": "man_made=surveillance", "significado": "Cámara de Televigilancia Municipal / Seguridad Ciudadana", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Subsecretaría de Prevención del Delito / Seguridad Vecinal", "ideChile": "Dispositivo Tecnológico de Seguridad Pública", "aplicacionUAH": "Cámaras de televigilancia en esquinas de Plaza Brasil", "citaAPA": "(Ministerio del Interior, 2022)"},
    {"tag": "amenity=townhall", "significado": "Municipalidad / Edificio Consistorial", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SUBDERE / Municipalidad de Santiago", "ideChile": "Administración Local y Gobierno Comunal", "aplicacionUAH": "Casa Consistorial / Centro Comunitario Municipal Brasil", "citaAPA": "(SUBDERE, 2022)"},
    {"tag": "office=government", "significado": "Oficina Pública Estatal (Registro Civil, SII, ChileAtiende)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Ministerio de Justicia / Hacienda / Trabajo", "ideChile": "Edificio de Servicios Públicos del Estado", "aplicacionUAH": "Sucursal Registro Civil Santiago Centro / ChileAtiende", "citaAPA": "(ChileAtiende, 2023; IDE Chile, 2020)"},
    {"tag": "amenity=community_centre", "significado": "Sede Social / Junta de Vecinos (JJVV)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SUBDERE / Municipalidad de Santiago", "ideChile": "Equipamiento Social y Comunitario Barrial", "aplicacionUAH": "Junta de Vecinos Barrio Brasil (calle Huérfanos)", "citaAPA": "(INE, 2017; Municipalidad de Santiago, 2021)"},
    {"tag": "amenity=post_office", "significado": "Sucursal Postal (CorreosChile, Chilexpress, Starken)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Ministerio de Transportes y Telecomunicaciones", "ideChile": "Infraestructura de Servicios Postales y Encomiendas", "aplicacionUAH": "Sucursal CorreosChile en calle Moneda / Alameda", "citaAPA": "(Correos de Chile, 2023)"},
    {"tag": "shop=bakery", "significado": "Panadería / Amasandería Tradicional Chilena", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SERCOTEC / Fomento Productivo Barrial", "ideChile": "Comercio de Alimentación de Proximidad", "aplicacionUAH": "Panadería Las Rosas Chicas / Panadería Brasil", "citaAPA": "(SERCOTEC, 2022; INE, 2021)"},
    {"tag": "shop=convenience", "significado": "Almacén de Barrio / Minimarket de Abarrotes", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SERCOTEC / Economía Social Barrial", "ideChile": "Comercio Minorista de Alimentos de Proximidad", "aplicacionUAH": "Almacén Don Lucho (calle Cienfuegos)", "citaAPA": "(SERCOTEC, 2022; INE, 2021)"},
    {"tag": "shop=supermarket", "significado": "Supermercado de Cadena / Autoservicio", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Ministerio de Economía / INE", "ideChile": "Comercio Mayor de Alimentos y Autoservicio", "aplicacionUAH": "Santa Isabel calle Brasil / Lider Express San Pablo", "citaAPA": "(INE, 2021; Taginfo Chile, 2026)"},
    {"tag": "amenity=marketplace", "significado": "Feria Libre Regulada / Mercado Municipal", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "ASOF Chile / I. Municipalidad de Santiago", "ideChile": "Comercio Popular y Ferias Libres Tradicionales", "aplicacionUAH": "Feria Libre calle Esperanza / Mercado Cueto", "citaAPA": "(ASOF Chile, 2021; ODEPA, 2022)"},
    {"tag": "shop=alcohol", "significado": "Botillería Tradicional con Patente de Alcoholes", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Dirección de Rentas Municipales", "ideChile": "Comercio Minorista de Licores y Bebidas", "aplicacionUAH": "Botillería Barriocentro en calle Maturana", "citaAPA": "(INE, 2021)"},
    {"tag": "shop=greengrocer", "significado": "Verdulería / Frutería Local de Barrio", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SERCOTEC", "ideChile": "Comercio de Alimentos Frescos Frutas y Verduras", "aplicacionUAH": "Verdulería tradicional en calle Compañía de Jesús", "citaAPA": "(INE, 2021)"},
    {"tag": "shop=butcher", "significado": "Carnicería de Barrio", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SEREMI de Salud / ISP", "ideChile": "Comercio Minorista de Carnes y Derivados", "aplicacionUAH": "Carnicería de barrio en calle Huérfanos", "citaAPA": "(INE, 2021)"},
    {"tag": "shop=hardware", "significado": "Ferretería de Barrio / Cerrajería", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SERCOTEC", "ideChile": "Comercio de Materiales Menores y Herramientas", "aplicacionUAH": "Ferretería El Candado en calle Rosas", "citaAPA": "(INE, 2021)"},
    {"tag": "shop=kiosk", "significado": "Quiosco de Diarios, Revistas y Confites", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Sindicato de Suplementeros / Rentas Municipales", "ideChile": "Comercio Menor en Vía Pública", "aplicacionUAH": "Quiosco de suplementero en Alameda esq. Almirante Barroso", "citaAPA": "(INE, 2021)"},
    {"tag": "amenity=bank", "significado": "Sucursal Bancaria (BancoEstado, Santander, etc.)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Comisión para el Mercado Financiero (CMF)", "ideChile": "Servicios Financieros y Sucursales Bancarias", "aplicacionUAH": "BancoEstado Sucursal Brasil / Alameda", "citaAPA": "(CMF Chile, 2023)"},
    {"tag": "amenity=atm", "significado": "Cajero Automático (Redbanc)", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Comisión para el Mercado Financiero (CMF)", "ideChile": "Red de Cajeros Automáticos y Dispensadores", "aplicacionUAH": "Cajero Redbanc en estaciones Metro y farmacias", "citaAPA": "(CMF Chile, 2023)"},
    {"tag": "amenity=cafe", "significado": "Cafetería / Salón de Té Universitario", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SERNATUR / Municipalidad de Santiago", "ideChile": "Servicios Gastronómicos y Puntos de Encuentro", "aplicacionUAH": "Cafés universitarios en Av. Brasil y calle Maturana", "citaAPA": "(INE, 2021; SERNATUR, 2022)"},
    {"tag": "amenity=restaurant", "significado": "Restaurante / Fuente de Soda / Picada Tradicional", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "SERNATUR / Ministerio de las Culturas", "ideChile": "Gastronomía Barrial Tradicional y Minutas", "aplicacionUAH": "Restaurante El Huaso Enrique / Fuentes de soda Alameda", "citaAPA": "(SERNATUR, 2022)"},
    {"tag": "amenity=recycling", "significado": "Punto Limpio / Campana de Reciclaje Diferenciado", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Ministerio del Medio Ambiente (Ley REP 20.920)", "ideChile": "Infraestructura de Reciclaje y Manejo de Residuos", "aplicacionUAH": "Campana de reciclaje en Plaza Brasil y patios UAH", "citaAPA": "(MMA, 2022; Ley N° 20.920)"},
    {"tag": "amenity=waste_basket", "significado": "Basurero Peatonal Urbano de Vereda", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Dirección de Aseo y Ornato Municipal", "ideChile": "Mobiliario Urbano de Aseo y Limpieza", "aplicacionUAH": "Papeleros peatonales en eje Av. Brasil y Alameda", "citaAPA": "(Municipalidad de Santiago, 2021)"},
    {"tag": "highway=street_lamp", "significado": "Luminaria Pública / Farol de Alumbrado Urbano", "categoria": "CAT-02", "grupo": "educacion_servicios", "institucion": "Municipalidad de Santiago / Enel", "ideChile": "Infraestructura de Alumbrado Público", "aplicacionUAH": "Faroles coloniales patrimoniales en Barrio Brasil", "citaAPA": "(Municipalidad de Santiago, 2021)"},
    {"tag": "railway=station", "significado": "Estación de Metro de Santiago", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "Metro de Santiago / MTT / DTPM", "ideChile": "Infraestructura de Transporte / Estación de Metro", "aplicacionUAH": "Estación Los Héroes (L1/L2) y Estación Santa Ana (L2/L5)", "citaAPA": "(Metro de Santiago, 2024; DTPM & MTT, 2023)"},
    {"tag": "railway=subway_entrance", "significado": "Acceso / Boca de Estación de Metro", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "Metro S.A.", "ideChile": "Acceso Peatonal a Red Subterránea", "aplicacionUAH": "Boca Metro Santa Ana por Manuel Rodríguez / Catedral", "citaAPA": "(Metro de Santiago, 2024)"},
    {"tag": "highway=bus_stop", "significado": "Paradero de Buses Red Movilidad", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "Directorio de Transporte Público Metropolitano (DTPM)", "ideChile": "Infraestructura de Transporte / Parada de Bus", "aplicacionUAH": "Paradero PA347 Alameda esq. Almirante Barroso", "citaAPA": "(DTPM & MTT, 2023)"},
    {"tag": "public_transport=platform", "significado": "Andén / Plataforma de Parada de Bus", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "DTPM / MTT", "ideChile": "Infraestructura de Transporte / Andén Peatonal", "aplicacionUAH": "Andén segregado en corredor Alameda Bernardo O'Higgins", "citaAPA": "(DTPM & MTT, 2023)"},
    {"tag": "amenity=bus_station", "significado": "Terminal de Buses Interurbanos", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "MTT / SEREMI de Transportes RM", "ideChile": "Terminal Terrestre de Pasajeros Interurbano", "aplicacionUAH": "Terminal Los Héroes (Tucapel Jiménez)", "citaAPA": "(MTT, 2022)"},
    {"tag": "vending=public_transport_tickets", "significado": "Tótem / Punto de Carga de Tarjeta bip!", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "Metro S.A. / DTPM", "ideChile": "Servicio de Recaudación del Sistema Red", "aplicacionUAH": "Punto de carga bip! en boletería Metro Los Héroes", "citaAPA": "(DTPM & MTT, 2023)"},
    {"tag": "railway=subway", "significado": "Trazado Subterráneo de Línea de Metro", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "Metro S.A.", "ideChile": "Infraestructura Ferroviaria Subterránea", "aplicacionUAH": "Trazado Línea 1 bajo eje Alameda / Línea 2 Manuel Rodríguez", "citaAPA": "(Metro de Santiago, 2024)"},
    {"tag": "amenity=taxi", "significado": "Parada de Taxis Básicos / Colectivos Urbanos", "categoria": "CAT-03", "grupo": "movilidad", "institucion": "SEREMI de Transportes RM / MTT", "ideChile": "Parada de Transporte Menor de Pasajeros", "aplicacionUAH": "Parada de taxis en Alameda frente a Metro Los Héroes", "citaAPA": "(MTT, 2022)"},
    {"tag": "highway=cycleway", "significado": "Ciclovía Segregada en Calzada / Bandejón", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "MINVU (Manual Vialidad Cicloinclusiva) / MTT", "ideChile": "Infraestructura Vial Cicloinclusiva Segregada", "aplicacionUAH": "Ciclovía calle Rosas / Ciclovía Alameda Poniente", "citaAPA": "(MINVU, 2020; MTT, 2021)"},
    {"tag": "cycleway=lane", "significado": "Ciclobanda Demarcada en Calzada", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "MINVU / Dirección de Tránsito Municipal", "ideChile": "Vía Cicloinclusiva Demarcada", "aplicacionUAH": "Ciclobanda en eje Av. Brasil", "citaAPA": "(MINVU, 2020)"},
    {"tag": "amenity=bicycle_parking", "significado": "Biciestacionamiento / Punto de Anclaje", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "MINVU / DTPM / UAH", "ideChile": "Equipamiento para Transporte No Motorizado", "aplicacionUAH": "Biciestacionamientos en patios UAH y exterior Metro", "citaAPA": "(MINVU, 2020; UAH, 2023)"},
    {"tag": "amenity=bicycle_rental", "significado": "Estación de Bicicletas Públicas Compartidas", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "GORE Metropolitano / Municipios", "ideChile": "Sistema de Transporte Compartido de Micromovilidad", "aplicacionUAH": "Estación Bike Santiago en Plaza Brasil", "citaAPA": "(GORE RM, 2021)"},
    {"tag": "amenity=bicycle_repair_station", "significado": "Tótem de Reparación e Inflado de Bicis", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "Municipios / Organizaciones Ciclistas", "ideChile": "Mobiliario de Apoyo a la Movilidad Activa", "aplicacionUAH": "Tótem de herramientas en acceso campus UAH", "citaAPA": "(WikiProject Chile, 2024)"},
    {"tag": "amenity=charging_station", "significado": "Estación de Carga de Vehículos Eléctricos", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "Ministerio de Energía / SEC", "ideChile": "Infraestructura de Electromovilidad", "aplicacionUAH": "Electrolinera de carga rápida en eje Alameda", "citaAPA": "(Ministerio de Energía, 2023)"},
    {"tag": "highway=living_street", "significado": "Zona Calma / Calle de Coexistencia (Zona 30)", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "CONASET / MINVU", "ideChile": "Vía de Tráfico Calmado / Zona de Coexistencia", "aplicacionUAH": "Calles de velocidad reducida en torno a Plaza Brasil", "citaAPA": "(CONASET, 2022; MINVU, 2020)"},
    {"tag": "highway=speed_display", "significado": "Radar Pedagógico de Velocidad Vial", "categoria": "CAT-04", "grupo": "movilidad", "institucion": "CONASET / Dirección de Tránsito", "ideChile": "Dispositivo de Seguridad Vial y Calma de Tráfico", "aplicacionUAH": "Radar indicador de velocidad en calle Cienfuegos", "citaAPA": "(CONASET, 2022)"},
    {"tag": "leisure=park", "significado": "Parque Urbano Público / Plaza Barrial", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "MINVU (Política Nacional de Parques Urbanos)", "ideChile": "Espacio Público / Parque Urbano / Plaza", "aplicacionUAH": "Plaza Brasil (parque barrial estructurante)", "citaAPA": "(MINVU, 2021; IDE Chile, 2020)"},
    {"tag": "leisure=playground", "significado": "Área de Juegos Infantiles Modulares", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "MINVU / Municipalidad de Santiago", "ideChile": "Equipamiento Recreativo Infantil en Espacio Público", "aplicacionUAH": "Esculturas lúdicas de Federica Matta en Plaza Brasil", "citaAPA": "(MINVU, 2021)"},
    {"tag": "leisure=pitch", "significado": "Cancha de Baby Fútbol / Multicancha Comunitaria", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "Instituto Nacional de Deportes (IND)", "ideChile": "Equipamiento Deportivo Barrial Comunitario", "aplicacionUAH": "Multicancha deportiva en JJVV Barrio Brasil", "citaAPA": "(IND Chile, 2021)"},
    {"tag": "leisure=sports_centre", "significado": "Polideportivo Municipal / Complejo Deportivo", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "IND / I. Municipalidad de Santiago", "ideChile": "Complejo Deportivo y Recreativo Comunal", "aplicacionUAH": "Polideportivo Comunal Santiago Centro", "citaAPA": "(IND Chile, 2021)"},
    {"tag": "leisure=fitness_station", "significado": "Plaza Activa / Máquinas de Ejercicios", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "MINVU / Municipalidades", "ideChile": "Equipamiento de Ejercicio Físico al Aire Libre", "aplicacionUAH": "Estación de máquinas de calistenia en Plaza Brasil", "citaAPA": "(MINVU, 2021)"},
    {"tag": "amenity=bench", "significado": "Banca / Escaño Público de Descanso", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "MINVU / Dirección de Aseo y Ornato", "ideChile": "Mobiliario Urbano de Descanso y Estancia", "aplicacionUAH": "Escaños patrimoniales en bandejón central de Av. Brasil", "citaAPA": "(MINVU, 2021)"},
    {"tag": "amenity=drinking_water", "significado": "Bebedero Público de Agua Potable", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "Aguas Andinas / Municipalidades", "ideChile": "Mobiliario Urbano de Hidratación Pública", "aplicacionUAH": "Bebedero público en Plaza Brasil", "citaAPA": "(MINVU, 2021)"},
    {"tag": "leisure=dog_park", "significado": "Zona Canina / Canil de Espacio Público", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "Municipalidad de Santiago (Tenencia Responsable)", "ideChile": "Equipamiento de Recreación para Mascotas", "aplicacionUAH": "Canil cerrado y zona de adiestramiento en Parque Quinta Normal", "citaAPA": "(SUBDERE, 2018)"},
    {"tag": "landuse=grass", "significado": "Césped Urbano / Superficie Verde Ajardinada", "categoria": "CAT-05", "grupo": "patrimonio_verde", "institucion": "Dirección de Parques y Jardines / MINVU", "ideChile": "Superficie de Cobertura Vegetal Herbácea", "aplicacionUAH": "Prados ajardinados centrales en Plaza Brasil", "citaAPA": "(MINVU, 2021)"},
    {"tag": "historic=building", "significado": "Inmueble de Conservación Histórica (ICH) / Casona", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "Consejo de Monumentos Nacionales (CMN) / DOM", "ideChile": "Patrimonio Arquitectónico Protegido por PRC", "aplicacionUAH": "Casonas Neoclásicas UAH (Barroso 10, Cienfuegos 41)", "citaAPA": "(CMN & MINCAP, 2022; Municipalidad de Santiago, 2019)"},
    {"tag": "historic=monument", "significado": "Monumento Público / Escultura Nacional", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "Consejo de Monumentos Nacionales (CMN)", "ideChile": "Monumento Público Nacional (Ley N° 17.288)", "aplicacionUAH": "Esculturas conmemorativas en Plaza Brasil", "citaAPA": "(CMN & MINCAP, 2022; Ley N° 17.288)"},
    {"tag": "historic=memorial", "significado": "Memorial de Derechos Humanos / Hito Conmemorativo", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "Subsecretaría de Derechos Humanos / CMN", "ideChile": "Sitio de Memoria Histórica y Hito Conmemorativo", "aplicacionUAH": "Placas conmemorativas en sedes comunitarias y sindicales", "citaAPA": "(Subsecretaría de DDHH, 2021)"},
    {"tag": "heritage=cite", "significado": "Cité Patrimonial / Pasaje Colectivo Tradicional", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "MINVU / CMN / Municipalidad de Santiago", "ideChile": "Tipología Residencial Colectiva Tradicional", "aplicacionUAH": "Cité Lucrecia Valdés / Pasajes de calle Huérfanos", "citaAPA": "(Municipalidad de Santiago, 2019; Hidalgo, 2005)"},
    {"tag": "amenity=place_of_worship", "significado": "Templo Religioso / Basílica / Parroquia", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "CMN / Arzobispado de Santiago", "ideChile": "Patrimonio Arquitectónico y Religioso", "aplicacionUAH": "Basílica del Salvador (Monumento Histórico)", "citaAPA": "(CMN & MINCAP, 2022)"},
    {"tag": "amenity=arts_centre", "significado": "Centro Cultural Comunitario / Galpón de Arte", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "Ministerio de las Culturas, las Artes y el Patrimonio", "ideChile": "Equipamiento Cultural y Artístico Barrial", "aplicacionUAH": "Centro Cultural de Barrio Brasil / Galpón Víctor Jara", "citaAPA": "(MINCAP, 2022)"},
    {"tag": "tourism=museum", "significado": "Museo Público / Histórico / Universitario", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "Servicio Nacional del Patrimonio Cultural (SERPAT)", "ideChile": "Equipamiento Museográfico Nacional", "aplicacionUAH": "Museo de la Educación Gabriela Mistral", "citaAPA": "(SERPAT, 2023)"},
    {"tag": "amenity=cinema", "significado": "Cine Comunitario / Sala de Exhibición Independiente", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "MINCAP / Red de Salas de Cine de Chile", "ideChile": "Equipamiento Cinematográfico y Audiovisual", "aplicacionUAH": "Cine Normandie y salas independientes de Barrio Universitario", "citaAPA": "(MINCAP, 2022)"},
    {"tag": "historic=archaeological_site", "significado": "Sitio de Rescate Arqueológico Colonial", "categoria": "CAT-06", "grupo": "patrimonio_verde", "institucion": "Consejo de Monumentos Nacionales (CMN)", "ideChile": "Patrimonio Arqueológico Protegido", "aplicacionUAH": "Hallazgos arqueológicos coloniales en obras viales de Santiago Poniente", "citaAPA": "(CMN & MINCAP, 2022)"},
    {"tag": "kerb=lowered", "significado": "Rebaje de Solera / Vado Peatonal en Esquina", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU (OGUC Art. 2.2.8) / SENADIS", "ideChile": "Infraestructura de Accesibilidad Peatonal (D.S. 50)", "aplicacionUAH": "Rebaje de solera en cruce Alameda con Almirante Barroso", "citaAPA": "(MINVU, 2016; SENADIS, 2021)"},
    {"tag": "kerb=flush", "significado": "Cordón a Nivel Cero / Plataforma Única", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU / SERVIU Metropolitano", "ideChile": "Vado Peatonal en Rasante Continua", "aplicacionUAH": "Pasos a nivel en paseos peatonales y calles calmadas", "citaAPA": "(MINVU, 2016)"},
    {"tag": "highway=crossing", "significado": "Paso Peatonal Demarcado (Paso Cebra / Semaforizado)", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "CONASET (Ministerio de Transportes) / MINVU", "ideChile": "Infraestructura de Seguridad Peatonal y Cruce", "aplicacionUAH": "Paso de cebra demarcado en Cienfuegos frente a UAH", "citaAPA": "(CONASET, 2022; MTT, 2021)"},
    {"tag": "tactile_paving=yes", "significado": "Pavimento Podotáctil de Alerta o Guía (Baldosa Táctil)", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU (D.S. 50) / SENADIS", "ideChile": "Dispositivo de Apoyo para Personas con Discapacidad Visual", "aplicacionUAH": "Baldosas podotáctiles en esquinas y andenes de Metro", "citaAPA": "(MINVU, 2016; SENADIS, 2021)"},
    {"tag": "traffic_signals:sound=yes", "significado": "Semáforo Peatonal Audible (Señal Acústica)", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "Unidad Operativa de Control de Tránsito (UOCT)", "ideChile": "Dispositivo Acústico de Apoyo al Cruce Seguro", "aplicacionUAH": "Semáforo sonoro en eje Alameda con Los Héroes", "citaAPA": "(UOCT & MTT, 2022)"},
    {"tag": "highway=traffic_signals", "significado": "Intersección con Semáforos Sincronizados UOCT", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "UOCT / MTT", "ideChile": "Dispositivo de Control y Semáforo de Intersección", "aplicacionUAH": "Cruces semaforizados sincronizados en Alameda con Manuel Rodríguez", "citaAPA": "(UOCT & MTT, 2022)"},
    {"tag": "wheelchair=yes", "significado": "Recinto o Local 100% Accesible para Sillas de Ruedas", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU / SENADIS", "ideChile": "Calificación de Accesibilidad Física de Edificaciones", "aplicacionUAH": "Edificio Erasmo Escala UAH con rampa y ascensor accesible", "citaAPA": "(SENADIS, 2021; ISO 21542:2021)"},
    {"tag": "wheelchair=limited", "significado": "Recinto con Accesibilidad Parcial / Requiere Asistencia", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU / SENADIS", "ideChile": "Calificación de Accesibilidad Condicionada", "aplicacionUAH": "Casonas patrimoniales con accesibilidad restringida en segundo piso", "citaAPA": "(SENADIS, 2021)"},
    {"tag": "highway=pedestrian", "significado": "Paseo Peatonal Exclusivo / Calle Peatonalizada", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU / SECPLAN Santiago", "ideChile": "Eje Vial Peatonal Exclusivo", "aplicacionUAH": "Paseo peatonal Huérfanos Poniente y pasajes patrimoniales", "citaAPA": "(MINVU, 2021)"},
    {"tag": "highway=ramp", "significado": "Rampa de Acceso Peatonal con Pendiente Normada", "categoria": "CAT-07", "grupo": "accesibilidad", "institucion": "MINVU (D.S. 50) / SENADIS", "ideChile": "Rampa Fija para Salvar Desnivel Físico", "aplicacionUAH": "Rampas con pasamanos en accesos de facultades UAH", "citaAPA": "(MINVU, 2016; SENADIS, 2021)"},
    {"tag": "natural=tree", "significado": "Árbol Urbano de Alineación en Acera o Plaza", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "Corporación Nacional Forestal (CONAF) / Municipios", "ideChile": "Arbolado y Silvicultura Urbana", "aplicacionUAH": "Plátanos orientales y jacarandás en Av. Brasil", "citaAPA": "(CONAF, 2019; MMA, 2022)"},
    {"tag": "natural=wood", "significado": "Masa Arbórea Continua / Bosquete Urbano", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "CONAF / MMA", "ideChile": "Cobertura Vegetal y Bosque Urbano", "aplicacionUAH": "Área arbolada densa en Parque Quinta Normal", "citaAPA": "(CONAF, 2019; IDE Chile, 2020)"},
    {"tag": "genus=Platanus", "significado": "Plátano Oriental (Platanus orientalis / × acerifolia)", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "CONAF / Catastro Arbolado Urbano Santiago", "ideChile": "Especie Arbórea Urbana de Gran Envergadura", "aplicacionUAH": "Alineaciones arbóreas históricas en Av. Brasil y bandejón Alameda", "citaAPA": "(CONAF, 2019)"},
    {"tag": "genus=Jacaranda", "significado": "Jacarandá (Jacaranda mimosifolia)", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "CONAF / Dirección de Aseo y Ornato", "ideChile": "Especie Arbórea Urbana Ornamental", "aplicacionUAH": "Jacarandás florecidos en primavera en torno a Plaza Brasil", "citaAPA": "(CONAF, 2019)"},
    {"tag": "genus=Jubaea", "significado": "Palma Chilena (Jubaea chilensis - Nativa Vulnerable)", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "CONAF / Ministerio del Medio Ambiente", "ideChile": "Flora Nativa Protegida en Espacios Públicos", "aplicacionUAH": "Ejemplares monumentales de palma chilena en plazas de Santiago", "citaAPA": "(CONAF, 2019; MMA, 2022)"},
    {"tag": "genus=Schinus", "significado": "Pimiento / Molle (Schinus areira - Nativo Resistente a Sequía)", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "CONAF / MMA", "ideChile": "Especie Arbórea Adaptada al Cambio Climático", "aplicacionUAH": "Pimientos nativos resistentes a escasez hídrica en Barrio Brasil", "citaAPA": "(CONAF, 2019)"},
    {"tag": "genus=Quillaja", "significado": "Quillay (Quillaja saponaria - Flora Esclerófila)", "categoria": "CAT-08", "grupo": "patrimonio_verde", "institucion": "CONAF / MMA", "ideChile": "Especie Nativa de la Cuenca de Santiago", "aplicacionUAH": "Quillayes en platabandas sostenibles de la comuna de Santiago", "citaAPA": "(CONAF, 2019; MMA, 2022)"}
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

if (typeof window !== 'undefined') {
  window.ModuloDiccionario = ModuloDiccionario;
}
