const ingresoApp='ingreso-app-v1';
const archivosCache=[
    '/pwa.html',
    '/estios/principal.css',
    '/js/boundary/registro_aspirante.js',
    '/estilos/componentes/registro_aspirante.css',
    '/img/fondo.png',
    '/manifest.json',
    '/js/lib/lit-html/lit-html.js',
    '/js/boundary/componentes/card_component.js',
    '/js/control/carrera_dao.js',
    '/js/entity/default_response.js',
    '/js/entity/default_error.js',
    '/js/control/default_dao.js',
    '/img/icons/pwa_192_192.png'
]

self.addEventListener('install', event=>{
    event.waitUntil(
        caches.open(ingresoApp)
        .then(cache=>{
            return cache.addAll(archivosCache);
        })
    )
});

self.addEventListener('fetch', event=>{
    event.respondWith(
        caches.match(event.request)
        .then(respuesta=>{
            return respuesta || fetch(event.request);
        })
    )
});