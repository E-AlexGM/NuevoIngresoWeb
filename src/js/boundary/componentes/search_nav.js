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
          <div>
                <input 
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