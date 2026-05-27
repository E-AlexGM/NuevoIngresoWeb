import { html, render } from '../../lib/lit-html/lit-html.js';

class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.nombre = '';
        this.imagen = '';
        this.url = '';
    }

    static observedAttributes = ['nombre', 'imagen', 'url'];

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            this.dibujar();
        }
    }

    connectedCallback() {
        // 2. Creamos el contenedor donde lit-html va a renderizar
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.dibujar();
    }

    _template() {
        return html`
            <link rel="stylesheet" href="./estilos/componentes/card_component.css">
            
            <div class="card">
                <img src="${this.imagen}" alt="Logo de ${this.nombre}">
                <h3>${this.nombre}</h3>
                <a href="${this.url}" class="btn">Ver más</a>
            </div>
        `;
    }
    dibujar() {
        // Renderizamos dentro del contenedor, no en el root, para no borrar el <link>
        if (this.container !== undefined) {
            render(this._template(), this.container);
        }
    }
}

customElements.define('card-component', CardComponent);
export default CardComponent;