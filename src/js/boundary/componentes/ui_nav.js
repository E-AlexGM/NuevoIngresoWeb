import {html, render} from '../../lib/lit-html/lit-html.js';

class UiNav extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.instalacion = null;
        this.mostrarBoton = false; 
    }
    connectedCallback() {
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        
        this.configurarInstalacionPWA();
        
        this.draw();
    }
    configurarInstalacionPWA() {
        window.addEventListener('beforeinstallprompt', event => {
            console.log('PWA instalable');
            event.preventDefault();
            this.instalacion = event;
            this.mostrarBoton = true; 
            this.draw(); 
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA instalada');
            this.instalacion = null;
            this.mostrarBoton = false; 
            this.draw(); 
        });
    }
    manejarClickInstalacion() {
        if (!this.instalacion) {
            return;
        }
        this.instalacion.prompt();
        this.instalacion.userChoice
            .then(resultado => {
                if (resultado.outcome === 'accepted') {
                    console.log('Usuario aceptó la instalación');
                } else {
                    console.log('Usuario rechazó la instalación');
                }
                
                this.instalacion = null;
                this.mostrarBoton = false;
                this.draw(); 
            })
            .catch(error => console.error('Error en prompt de instalación:', error));
    }

    draw(){
        if(this.container !== undefined){
            render(this._template(), this.container);
        }
    }

    _template(){
        return html`  
            <link rel="stylesheet" href="./estilos/componentes/ui_nav.css">
            <nav class="menu-navegacion">
                <a href="/index.html" class="nav-logo-link">
                    <svg class="nav-logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="120" height="120" rx="24" fill="none"/>
                        <path d="M16,88 Q60,72 60,72 L60,100 Q16,116 16,100 Z" fill="#c0392b"/>
                        <path d="M104,88 Q60,72 60,72 L60,100 Q104,116 104,100 Z" fill="#1a2744"/>
                        <rect x="57" y="72" width="6" height="28" rx="1" fill="#2c3e6b"/>
                        <rect x="26" y="46" width="68" height="9" rx="3" fill="#1a2744"/>
                        <polygon points="60,26 90,42 60,50 30,42" fill="#1a2744"/>
                        <line x1="90" y1="42" x2="90" y2="60" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="90" cy="63" r="4" fill="#c0392b"/>
                        <circle cx="60" cy="26" r="3" fill="#c0392b"/>
                    </svg>
                </a>
                <a class="enlace-nav" href="/index.html">Inicio</a>
                <a class="enlace-nav" href="/procesos.html">Procesos</a>
                <a class="enlace-nav" href="/registro_aspirante.html">Registro Aspirante</a>
                <a class="enlace-nav" href="/resultados.html">Resultados</a>
                <button 
                    id="InstalarPWA" 
                    class="btn-instalar"
                    @click="${() => this.manejarClickInstalacion()}"
                    style="display: ${this.mostrarBoton ? 'inline-block' : 'none'};">
                    Instalar App
                </button>
            </nav>
        `;
    }
}

customElements.define('ui-nav', UiNav);
export default UiNav;