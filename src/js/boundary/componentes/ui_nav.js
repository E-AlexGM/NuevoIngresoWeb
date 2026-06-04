import {html, render} from '../../lib/lit-html/lit-html.js';

class UiNav extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    }
    
    connectedCallback() {
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        this.draw();
    }
    
    draw(){
        if(this.container !== undefined){
            render(this._template(), this.container);
        }
    }

    _template(){
        return html`
            <div>
                <a href="/src/index.html">Inicio</a>
                <a href="/src/resultados.html">Resultados</a>
                <a href="/src/procesos.html">Proceso</a>
                <a href="#">Registro</a>
            </div>
            `;
    }
}

customElements.define('ui-nav', UiNav);
export default UiNav;


