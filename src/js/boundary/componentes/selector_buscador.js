import { html, render } from '../../lib/lit-html/lit-html.js';

class SelectorBuscador extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._datos = [];
        this.datosFiltrados = [];
        this.busqueda = '';
        this.mostrarDesplegable = false;
        this.placeholder = '🔍 Buscar...';
    }

    set datos(lista) {
        this._datos = lista || [];
        this.datosFiltrados = [...this._datos];
        this._dibujar();
    }

    static get observedAttributes() {
        return ['text', 'placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'text') this.busqueda = newValue;
        if (name === 'placeholder') this.placeholder = newValue;
        this._dibujar();
    }

    manejarInput(e) {
        this.busqueda = e.target.value;
        this.mostrarDesplegable = true;

        this.datosFiltrados = this._datos.filter(item => 
            item.texto.toLowerCase().includes(this.busqueda.toLowerCase())
        );
        this._dibujar();
    }

    seleccionar(item, e) {
        if (e) e.preventDefault(); 
        this.busqueda = item.texto;
        this.mostrarDesplegable = false;
        this._dibujar();

        let evento = new CustomEvent('seleccion-cambiada', {
            composed: true,
            bubbles: true,
            detail: { id: item.id, texto: item.texto }
        });
        this.dispatchEvent(evento);
    }

    limpiar() {
        this.busqueda = '';
        this.mostrarDesplegable = false;
        this.datosFiltrados = [...this._datos];
        this._dibujar();
    }

    _template() {
        return html`
            <link rel="stylesheet" href="./estilos/componentes/selector_buscador.css">

            <div class="selector-container">
                <input 
                    type="text" 
                    placeholder=${this.placeholder}
                    .value=${this.busqueda}
                    @input=${(e) => this.manejarInput(e)}
                    @focus=${() => { this.mostrarDesplegable = true; this._dibujar(); }}
                    @blur=${() => setTimeout(() => { this.mostrarDesplegable = false; this._dibujar(); }, 300)}
                >
                
                ${this.mostrarDesplegable ? html`
                    <div class="dropdown-list">
                        ${this.datosFiltrados.length === 0 ? html`<div class="no-results">No se encontraron coincidencias</div>` : ''}
                        ${this.datosFiltrados.map(item => html`
                            <div class="dropdown-item" @mousedown=${(e) => this.seleccionar(item, e)}>
                                ${item.texto}
                            </div>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    _dibujar() { render(this._template(), this._root); }
}

customElements.define('selector-buscador', SelectorBuscador);
export default SelectorBuscador;