// service_worker.js

const CACHE_NAME = 'ingreso-app-v1';

const ARCHIVOS_CACHE = [
    '/',
    '/index.html',
    '/procesos.html',
    '/registro_aspirante.html',
    '/resultados.html',
    '/manifest.json',

    '/img/icons/icono_192_192.png',
    '/img/icons/icono_512_512.png',

    '/estilos/layout/admin.css',
    '/estilos/componentes/arbol_colapsable.css',
    '/estilos/componentes/datos_componente.css',
    '/estilos/componentes/notificacion_toast.css',
    '/estilos/componentes/prueba_clave_area.css',
    '/estilos/componentes/registro_aspirante.css',
    '/estilos/componentes/seleccion_carreras.css',
    '/estilos/componentes/selector_buscador.css',
    '/estilos/componentes/tarjeta_clave.css',
    '/estilos/componentes/ui_card.css',
    '/estilos/componentes/ui_nav.css',
    '/estilos/componentes/error_pantalla.css',
    '/estilos/index.css',
    '/estilos/componentes/grid_tarjetas.css',     
    '/estilos/elementos_simples.css',             

    '/js/lib/lit-html/lit-html.js',

    '/js/boundary/main.js',
    '/js/boundary/frm_procesos.js',
    '/js/boundary/frm_resultados.js',
    '/js/boundary/prueba_clave_area.js',
    '/js/boundary/registro_aspirante.js',
    '/js/boundary/dto/card_examen_dto.js',
    '/js/boundary/dto/aula_dto.js',               

    '/js/boundary/componentes/arbol_colapsable.js',
    '/js/boundary/componentes/datos_componente.js',
    '/js/boundary/componentes/notificacion_toast.js',
    '/js/boundary/componentes/search_nav.js',
    '/js/boundary/componentes/seleccion_carreras.js',
    '/js/boundary/componentes/selector_buscador.js',
    '/js/boundary/componentes/tarjeta_clave.js',
    '/js/boundary/componentes/ui_card.js',
    '/js/boundary/componentes/ui_nav.js',

    '/js/control/default_dao.js',
    '/js/control/prueba_dao.js',
    '/js/control/prueba_jornada_dao.js',
    '/js/control/prueba_clave_dao.js',
    '/js/control/prueba_clave_area_dao.js',
    '/js/control/examen_dao.js',
    '/js/control/aspirante_dao.js',
    '/js/control/carrera_dao.js',
    '/js/control/aspirante_opcion_dao.js',
    '/js/control/jornada_aula_dao.js',


    '/js/entity/default_error.js',
    '/js/entity/default_response.js',
    '/js/entity/prueba.js',
    '/js/entity/jornada.js',
    '/js/entity/aspirante.js',
    '/js/entity/aspirante_opcion.js'
];

// Instalación
self.addEventListener('install', event => {

    console.log('Service Worker instalado');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ARCHIVOS_CACHE);
            })
    );

    self.skipWaiting();
});

// Activación
self.addEventListener('activate', event => {

    console.log('Service Worker activado');

    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
    );

    self.clients.claim();
});

self.addEventListener('fetch', event=>{
    event.respondWith(
        caches.match(event.request)
        .then(respuesta=>{
            return respuesta || fetch(event.request);
        })
    )
});