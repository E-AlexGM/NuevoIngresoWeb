class RegistroAspirante extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if("serviceWorker" in navigator){
            navigator.serviceWorker.register('../../service_worker.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.error('Error al registrar el Service Worker:', error);
            });
        }
    }

}

customElements.define('registro-aspirante', RegistroAspirante); 