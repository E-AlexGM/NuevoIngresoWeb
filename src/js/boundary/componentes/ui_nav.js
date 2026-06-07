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
       <style>
                .menu-navegacion {
                    display: flex;
                    align-items: center;
                    gap: 2.25rem;
                    height: 100%;
                    /* ELIMINADOS: border-bottom y margin-bottom para evitar el choque con el <header> */
                    font-family: Arial, sans-serif;
                }

                .enlace-nav {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    /* Un padding vertical para que el clic sea cómodo sin deformar el header */
                    padding: 1.25rem 0; 
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #5b6472;
                    text-decoration: none;
                    transition: color 0.25s ease;
                }

                .enlace-nav::after {
                    content: '';
                    position: absolute;
                    bottom: 0; /* Ahora se pega al fondo de su propio padding */
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background-color: #922b21;
                    border-radius: 3px 3px 0 0;
                    transform: scaleX(0);
                    transition: transform 0.2s ease;
                }

                .enlace-nav:hover {
                    color: #1f2937;
                }

                .enlace-nav:hover::after {
                    transform: scaleX(1);
                }

                .enlace-nav.activo {
                    color: #922b21;
                    font-weight: 700;
                }

                .enlace-nav.activo::after {
                    transform: scaleX(1);
                }

                @media (max-width: 35rem) {
                    .menu-navegacion {
                        gap: 1.5rem;
                        justify-content: center;
                    }
                    
                    .enlace-nav {
                        padding: 1rem 0;
                    }
                }
            </style>

            <nav class="menu-navegacion">
                <a class="enlace-nav" href="/index.html">Inicio</a>
                <a class="enlace-nav" href="/procesos.html">Procesos</a>
                <a class="enlace-nav" href="/registro_aspirante.html">Registro Aspirante</a>
                <a class="enlace-nav" href="/resultados.html">Resultados</a>
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