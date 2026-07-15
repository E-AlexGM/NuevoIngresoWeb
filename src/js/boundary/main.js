let instalacion = null;

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../service_worker.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration.scope);
                })
                .catch(error => {
                    console.error('Error al registrar Service Worker:', error);
                });
        });
    }
}
registrarServiceWorker();