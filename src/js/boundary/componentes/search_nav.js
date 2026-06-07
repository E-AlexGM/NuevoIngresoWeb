import {html, render} from "../../lib/lit-html/lit-html.js";

class SearchNav extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        this._draw();
    }

    _handleInput(e) {
        const searchTerm = e.target.value;
        this.dispatchEvent(new CustomEvent('search-change', {
            detail: { term: searchTerm },
            bubbles: true,
            composed: true 
        }));
    }

    _template() {
        return html`
            <style>
                .input-base {
                width: 100%;
                padding: 0.75rem 1rem;
                font-family: inherit;
                font-size: 0.95rem;
                color: var(--color-texto);
                background-color: var(--color-bg-input);
                border: 1px solid var(--color-borde);
                border-radius: 0.5rem; /* Curva suave, no tan redonda como el layout */
                transition: all 0.2s ease;
                outline: none;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
                }

                /* Efecto Elegante al seleccionar el input */
                .input-base:focus {
                    border-color: var(--color-acento);
                    /* Un "anillo" suave del color guinda para accesibilidad */
                    box-shadow: 0 0 0 3px rgba(146, 43, 33, 0.1); 
                }

                .input-base::placeholder {
                    color: #a8a29e;
                }
            </style>
          <div class="campo-formulario">
                <input 
                    class="input-base" 
                    type="search" 
                    placeholder="Buscar prueba por nombre..." 
                    @input=${this._handleInput.bind(this)} 
                />
            </div>
        `;
    }

    _draw() {
        if(this.container !== undefined){
            render(this._template(), this.container);
        }
    }
}

customElements.define('search-nav', SearchNav);
export default SearchNav;