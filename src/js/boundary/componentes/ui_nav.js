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

            <nav>
                <a href="/resultados.html">Resultados</a>
                <a href="/procesos.html">Proceso</a>
                <a href="/registro_aspirante.html">Registro</a>
            </nav>
            `;
    }
}

customElements.define('ui-nav', UiNav);
export default UiNav;


