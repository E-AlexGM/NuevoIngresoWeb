import { html, render } from "../../lib/lit-html/lit-html.js";

class UiCard extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }


    connectedCallback() {
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        this.dibujar();
    }

    dibujar() {        
        if (this.container !== undefined) {
            render(this._template(), this.container);
        }
    }
    _template() {
        return html`
           <link rel="stylesheet" href="./estilos/componentes/ui_card.css">
            <div class="card">
                <slot class="" name="title"></slot>
                <slot name="content"></slot>
                <slot name="action"></slot>
            </div>

        `;
    }
}

customElements.define('ui-card', UiCard);
export default UiCard;