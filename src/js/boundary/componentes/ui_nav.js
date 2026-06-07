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
            <nav>
                <a href="/resultados.html">Resultados</a>
                <a href="/procesos.html">Proceso</a>
                <a href="/registro_aspirante.html">Registro</a>
                
                <button 
                    id="InstalarPWA" 
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