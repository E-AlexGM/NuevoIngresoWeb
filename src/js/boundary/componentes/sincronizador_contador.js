    import Contador from './contador.js';

    class sincronizadorContador extends HTMLElement {
        constructor() {
            super();
            this.root=this.attachShadow({mode: 'open'});
            this.intervalId = undefined;
            this.contador = 0;
        }

        connectedCallback() {
            this.addEventListener('contador-cambiado', e=>this.sincronizar(e));
            this.contador1 = document.createElement('chepe-contador');
            this.contador1.id = 'contador1';
            this.contador1.setAttribute('contador', "100");
            this.contador2 = document.createElement('chepe-contador');
            this.contador2.id = 'contador2';
            this.root.appendChild(this.contador1);
            this.root.appendChild(this.contador2);
            this.intervalId = setInterval(() => {
                this.contador++;
                this.contador1.setAttribute('contador', this.contador);
                //this.contador2.setAttribute('contador', this.contador);
            }, 1000);
        }

        disconnectedCallback() {
            clearInterval(this.intervalId);
        }

        sincronizar(evento){
            if(evento.type === 'contador-cambiado'){
                if(evento.detail.origen === 'contador1'){
                    this.contador2.setAttribute('contador', parseInt(evento.detail.contador)+100);
                } 
            }
        }
    }

    export default sincronizadorContador;

    customElements.define('sincronizador-contador', sincronizadorContador);