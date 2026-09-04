/*
  config.js
  ---------
  Carga la configuración centralizada intentando rutas relativas para soportar
  tanto servidores que sirven desde la raíz como servidores que sirven desde src/.
  Expone el objeto en window.NODO_CONFIG y emite el evento 'nodo:config-lista'.
*/

window.NODO_CONFIG = null;

async function cargarConfiguracion() {
  const rutasPosibles = [
    'config/config.json',
    './config/config.json',
    '../config/config.json',
    '/config/config.json'
  ];

  for (const ruta of rutasPosibles) {
    try {
      const respuesta = await fetch(ruta);
      if (respuesta.ok) {
        window.NODO_CONFIG = await respuesta.json();
        console.log(`[+] Configuración cargada con éxito desde: ${ruta}`);
        break;
      }
    } catch (e) {
      // Intenta la siguiente ruta
    }
  }

  if (!window.NODO_CONFIG) {
    console.warn('[-] No se pudo cargar config.json de rutas estándar. Usando configuración base de contingencia.');
    window.NODO_CONFIG = {
      organizacion: {
        nombre: 'Atlas de Información Geográfica Voluntaria',
        subtitulo: 'Plataforma VGI para la Gestión Territorial',
        descripcion_corta: 'Consulta, calidad y metadatos VGI | Barrio Brasil & UAH',
        contacto: 'juanpablolescanovillegas@gmail.com',
        area_de_interes_nombre: 'Barrio Brasil — Universidad Alberto Hurtado (Santiago Centro, Chile)'
      },
      area_por_defecto: {
        bbox: [-70.6720, -33.4505, -70.6580, -33.4350],
        centro: [-33.4425, -70.6650],
        zoom: 15
      },
      territorios_predefinidos: [
        {
          id: 'barrio-brasil-ampliado',
          nombre: 'Barrio Brasil Completo (hasta Plaza Brasil)',
          bbox: [-70.6720, -33.4505, -70.6580, -33.4350],
          centro: [-33.4425, -70.6650],
          zoom: 15,
          descripcion: 'Zona Típica Barrio Brasil, Plaza Brasil, Huérfanos, Compañía, Av. Brasil y Alameda'
        },
        {
          id: 'uah-manzana',
          nombre: 'Barrio Brasil — Universidad Alberto Hurtado (Manzana UAH)',
          bbox: [-70.6675, -33.4505, -70.6565, -33.4385],
          centro: [-33.4445, -70.6620],
          zoom: 16,
          descripcion: 'Campus patrimonial UAH (Almirante Barroso, Erasmo Escala, Cienfuegos, Los Héroes)'
        }
      ],
      endpoints: {
        overpass: 'https://overpass.openstreetmap.fr/api/interpreter',
        overpass_espejos: [
          'https://overpass.openstreetmap.fr/api/interpreter',
          'https://lz4.overpass-api.de/api/interpreter',
          'https://z.overpass-api.de/api/interpreter',
          'https://overpass-api.de/api/interpreter'
        ],
        ohsome: 'https://api.ohsome.org/v1',
        gbif: 'https://api.gbif.org/v1',
        umap_instancia_sugerida: 'https://umap.openstreetmap.fr'
      },
      metadatos_iso_defecto: {
        sistema_referencia: 'EPSG:4326 (WGS84)',
        idioma_recurso: 'spa',
        punto_de_contacto_organizacion: 'Práctica Profesional Geografía 2026 — Nodo GeoAbierto / UAH',
        punto_de_contacto_correo: 'juanpablolescanovillegas@gmail.com'
      }
    };
  }

  document.dispatchEvent(new CustomEvent('nodo:config-lista'));
}

cargarConfiguracion();
