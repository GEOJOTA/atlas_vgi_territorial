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
    }
  ];

  const ETIQUETAS_TERRITORIALES_OSM = [
    // CAT-01: Educación y Universidad
    { tag: 'amenity=university', significado: 'Campus o facultad de educación superior', categoria: 'CAT-01', grupo: 'educacion_servicios', aplicacionUAH: 'Campus Patrimonial UAH (Almirante Barroso, Cienfuegos, Erasmo Escala).' },
    { tag: 'amenity=library', significado: 'Biblioteca pública o universitaria', categoria: 'CAT-01', grupo: 'educacion_servicios', aplicacionUAH: 'Biblioteca Central UAH y bibliotecas especializadas de facultades.' },
    { tag: 'amenity=college', significado: 'Instituto profesional o centro de formación técnica', categoria: 'CAT-01', grupo: 'educacion_servicios', aplicacionUAH: 'Institutos de educación superior en entorno de Alameda y República.' },
    { tag: 'amenity=school', significado: 'Colegio, escuela básica o liceo', categoria: 'CAT-01', grupo: 'educacion_servicios', aplicacionUAH: 'Liceos y colegios históricos del entorno de Barrio Brasil y Yungay.' },

    // CAT-02: Servicios, Comercio y Abastecimiento
    { tag: 'amenity=pharmacy', significado: 'Farmacia o botica comunal', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Locales de abastecimiento farmacéutico en eje Alameda y Brasil.' },
    { tag: 'shop=bakery', significado: 'Panadería o amasandería de barrio', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Comercio tradicional barrial en calles Maturana, Huérfanos y Compañía.' },
    { tag: 'shop=convenience', significado: 'Almacén de abarrotes o minimarket vecinal', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Provisión alimentaria de proximidad para residentes y estudiantes.' },
    { tag: 'shop=supermarket', significado: 'Supermercado de cadena o autoservicio', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Abastecimiento de mayor escala en avenidas principales.' },
    { tag: 'amenity=cafe', significado: 'Cafetería o salón de té barrial', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Puntos de encuentro y estudio de estudiantes UAH en Av. Brasil.' },
    { tag: 'amenity=restaurant', significado: 'Restaurante o fuente de soda tradicional', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Gastronomía barrial tradicional de Barrio Brasil.' },
    { tag: 'amenity=bank', significado: 'Sucursal bancaria o de servicios financieros', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Bancos e instituciones financieras en eje Alameda.' },
    { tag: 'amenity=fire_station', significado: 'Compañía de bomberos (emergencias y rescate)', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: '11ª Compañía de Bomberos "Pompa Italia" en República/Brasil.' },
    { tag: 'amenity=clinic', significado: 'Centro de salud familiar (CESFAM) o consultorio', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Red asistencial primaria comunal de Santiago Centro.' },
    { tag: 'amenity=hospital', significado: 'Hospital o complejo asistencial hospitalario', categoria: 'CAT-02', grupo: 'educacion_servicios', aplicacionUAH: 'Infraestructura hospitalaria en macrozona poniente.' },

    // CAT-03: Movilidad y Transporte Público
    { tag: 'railway=station', significado: 'Estación de tren urbano o Metro de Santiago', categoria: 'CAT-03', grupo: 'movilidad', aplicacionUAH: 'Estaciones Metro Los Héroes (L1/L2) y Metro Santa Ana (L2/L5).' },
    { tag: 'highway=bus_stop', significado: 'Paradero de buses del sistema Red Movilidad', categoria: 'CAT-03', grupo: 'movilidad', aplicacionUAH: 'Paraderos en calzadas de Alameda, Manuel Rodríguez y Av. Brasil.' },
    { tag: 'railway=subway', significado: 'Línea férrea subterránea de metro', categoria: 'CAT-03', grupo: 'movilidad', aplicacionUAH: 'Trazados subterráneos de Líneas 1, 2 y 5 bajo ejes estructurantes.' },

    // CAT-04: Movilidad Activa y Ciclovías
    { tag: 'highway=cycleway', significado: 'Ciclovía segregada para bicicletas y micromovilidad', categoria: 'CAT-04', grupo: 'movilidad', aplicacionUAH: 'Eje ciclovía calle Rosas y ciclobanda Av. Brasil.' },
    { tag: 'amenity=bicycle_parking', significado: 'Estacionamiento para bicicletas (biciestacionamiento)', categoria: 'CAT-04', grupo: 'movilidad', aplicacionUAH: 'Puntos de anclaje de bicicletas en patios UAH y salidas de Metro.' },

    // CAT-05: Áreas Verdes, Plazas y Espacio Público
    { tag: 'leisure=park', significado: 'Plaza o parque urbano con áreas verdes', categoria: 'CAT-05', grupo: 'patrimonio_verde', aplicacionUAH: 'Plaza Brasil (pulmón del barrio), Plaza Manuel Rodríguez.' },
    { tag: 'leisure=playground', significado: 'Área de juegos infantiles en espacio público', categoria: 'CAT-05', grupo: 'patrimonio_verde', aplicacionUAH: 'Juegos infantiles y recreativos en Plaza Brasil.' },
    { tag: 'leisure=pitch', significado: 'Cancha deportiva o multicancha comunitaria', categoria: 'CAT-05', grupo: 'patrimonio_verde', aplicacionUAH: 'Canchas de baby fútbol y deportes en juntas de vecinos.' },

    // CAT-06: Patrimonio y Cultura
    { tag: 'historic=building', significado: 'Inmueble con valor patrimonial o arquitectónico', categoria: 'CAT-06', grupo: 'patrimonio_verde', aplicacionUAH: 'Casonas de principios de siglo XX de la Zona Típica Barrio Brasil.' },
    { tag: 'amenity=place_of_worship', significado: 'Templo religioso, iglesia o basílica', categoria: 'CAT-06', grupo: 'patrimonio_verde', aplicacionUAH: 'Basílica del Salvador (Monumento Histórico en Huérfanos con Almirante Barroso).' },
    { tag: 'historic=monument', significado: 'Monumento público o escultura conmemorativa', categoria: 'CAT-06', grupo: 'patrimonio_verde', aplicacionUAH: 'Esculturas y monumentos de Plaza Brasil y plazas históricas.' },
    { tag: 'tourism=artwork', significado: 'Mural, mosaico u obra de arte público urbano', categoria: 'CAT-06', grupo: 'patrimonio_verde', aplicacionUAH: 'Muralismo barrial e intervenciones culturales en Barrio Brasil.' },

    // CAT-07: Accesibilidad Universal
    { tag: 'kerb=lowered', significado: 'Rebaje de cordón en vereda para cruce accesible', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', aplicacionUAH: 'Rampas peatonales en esquinas de Alameda con Cienfuegos y Barroso.' },
    { tag: 'highway=crossing', significado: 'Paso peatonal demarcado (paso de cebra o semaforizado)', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', aplicacionUAH: 'Cruces peatonales seguros entre edificios del campus UAH.' },
    { tag: 'wheelchair=yes', significado: 'Entrada y recinto 100% accesibles para silla de ruedas', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', aplicacionUAH: 'Edificios con rampas normadas y ascensores accesibles.' },
    { tag: 'highway=footway', significado: 'Senda peatonal, paseo o vereda exclusiva', categoria: 'CAT-07', grupo: 'accesibilidad_biodiv', aplicacionUAH: 'Pasajes interiores y veredas ensanchadas en la manzana UAH.' },

    // CAT-08: Biodiversidad Urbana
    { tag: 'natural=tree', significado: 'Árbol urbano catalogado (especie, altura, copa)', categoria: 'CAT-08', grupo: 'accesibilidad_biodiv', aplicacionUAH: 'Arbolado patrimonial en bandejón de Av. Brasil y patios UAH.' },
    { tag: 'landuse=grass', significado: 'Superficie de césped o cobertura herbácea', categoria: 'CAT-08', grupo: 'accesibilidad_biodiv', aplicacionUAH: 'Jardines de casonas universitarias y áreas de descanso.' }
  ];

  function render(filtroTexto = '', filtroGrupo = 'todos') {
    const texto = filtroTexto.toLowerCase().trim();

    const mostrarAtributos = (filtroGrupo === 'todos' || filtroGrupo === 'esquema');
    const mostrarEtiquetas = (filtroGrupo !== 'esquema');

    const atributosFiltrados = ATRIBUTOS_NORMALIZADOS.filter(a =>
      !texto || a.campo.toLowerCase().includes(texto) || a.nombre.toLowerCase().includes(texto) || a.definicion.toLowerCase().includes(texto) || a.equivalenciaIDE.toLowerCase().includes(texto)
    );

    const etiquetasFiltradas = ETIQUETAS_TERRITORIALES_OSM.filter(e => {
      const coincideTexto = !texto || e.tag.toLowerCase().includes(texto) || e.significado.toLowerCase().includes(texto) || e.aplicacionUAH.toLowerCase().includes(texto) || e.categoria.toLowerCase().includes(texto);
      const coincideGrupo = (filtroGrupo === 'todos' || e.grupo === filtroGrupo);
      return coincideTexto && coincideGrupo;
    });

    const htmlAtributos = atributosFiltrados.map(a => `
      <tr style="border-bottom:1px solid var(--linea);">
        <td><strong style="color:var(--musgo); font-family:'IBM Plex Mono', monospace;">${a.campo}</strong></td>
        <td><strong>${a.nombre}</strong><br><small style="color:var(--tinta-suave);">${a.tipo}</small></td>
        <td style="font-size:0.85rem;">${a.definicion}<br><span class="descripcion" style="font-style:italic;">Ejemplo: ${a.ejemplo}</span></td>
        <td style="font-size:0.82rem; background:var(--papel-alto);"><code>${a.equivalenciaIDE}</code></td>
        <td style="font-size:0.82rem;">${a.importancia}</td>
      </tr>
    `).join('');

    const htmlEtiquetas = etiquetasFiltradas.map(e => `
      <tr style="border-bottom:1px solid var(--linea);">
        <td><code style="font-weight:600; color:var(--musgo); font-size:0.88rem;">${e.tag}</code></td>
        <td>${e.significado}</td>
        <td><span class="marcador" style="display:inline-block; padding:2px 6px; font-size:0.75rem;">${e.categoria}</span></td>
        <td style="font-size:0.85rem; color:var(--tinta-suave);">${e.aplicacionUAH}</td>
      </tr>
    `).join('');

    let bloqueAtributosHTML = '';
    if (mostrarAtributos) {
      bloqueAtributosHTML = `
        <div class="bloque">
          <h3>1. Esquema de Datos VGI Normalizado (10 Atributos IDE Chile / ISO 19115)</h3>
          <p class="descripcion">Cada entidad descargada o proyectada en el Atlas adopta esta estructura tabular interoperable con SIG institucionales y el Perfil Nacional de Metadatos de Chile:</p>
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
          <h3>2. Glosario Territorial de Etiquetas OSM (${etiquetasFiltradas.length} descriptores clasificados)</h3>
          <p class="descripcion">Traducción de tags técnicos colaborativos a conceptos territoriales y su correspondencia empírica en la manzana universitaria UAH y Barrio Brasil:</p>
          <div style="overflow-x:auto;">
            <table class="tabla-datos" style="margin-top:10px; font-size:0.88rem;">
              <thead>
                <tr style="background:var(--papel-alto);">
                  <th>Etiqueta OSM (Tag)</th>
                  <th>Significado Ciudadano</th>
                  <th>Categoría Atlas</th>
                  <th>Aplicación en Barrio Brasil / Universidad Alberto Hurtado</th>
                </tr>
              </thead>
              <tbody>
                ${htmlEtiquetas.length > 0 ? htmlEtiquetas : '<tr><td colspan="4" style="text-align:center; padding:12px; color:var(--tinta-suave);">No hay etiquetas que coincidan con el filtro seleccionado.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return `
      <div class="caja-guia-referencia">
        <h4>📖 Marco Metodológico de Catalogación Geográfica (ISO 19110 / SNIT Chile)</h4>
        <p>
          Para que los datos de Información Geográfica Voluntaria (VGI) sean aptos para revisión por personas no técnicas y comités académicos, deben regirse por el estándar <strong>ISO 19110 (Metodología para la catalogación de fenómenos geográficos)</strong>. Esto garantiza que cada etiqueta abierta tenga un significado inequívoco, medible y contrastable con la cartografía municipal y fiscal.
        </p>
        <ul>
          <li><strong>ISO 19110:2016:</strong> <em>Geographic information — Methodology for feature cataloguing.</em> International Organization for Standardization.</li>
          <li><strong>Ministerio de Bienes Nacionales (2020):</strong> <em>Guía de Estándares de Información Geoespacial de Chile (SNIT / IDE Chile).</em></li>
          <li><strong>OpenStreetMap Foundation (2026):</strong> <em>Map Features & Tagging Guidelines Wiki.</em> https://wiki.openstreetmap.org/wiki/Map_features</li>
        </ul>
      </div>

      ${bloqueAtributosHTML}
      ${bloqueEtiquetasHTML}
    `;
  }

  return {
    ATRIBUTOS_NORMALIZADOS,
    ETIQUETAS_TERRITORIALES_OSM,
    render
  };
})();
