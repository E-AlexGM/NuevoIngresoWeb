import { html, render } from '../../lib/lit-html/lit-html.js';
import './selector_buscador.js';

class FormSeleccionCarreras extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._catalogo = [];
        this.carrerasSeleccionadas = [null, null, null];
    }

    set catalogo(lista) {
        this._catalogo = lista || [];
        this._dibujar();
    }

    limpiar() {
        this.carrerasSeleccionadas = [null, null, null];
        this._root.querySelectorAll('selector-buscador').forEach(selector => {
            if (typeof selector.limpiar === 'function') selector.limpiar();
        });
        this._dibujar();
    }

    manejarSeleccion(index, e) {
        this.carrerasSeleccionadas[index] = e.detail.id;

        // Avisa al padre enviando el arreglo de las 3 opciones
        let evento = new CustomEvent('carreras-actualizadas', {
            composed: true,
            bubbles: true,
            detail: { carreras: this.carrerasSeleccionadas }
        });
        this.dispatchEvent(evento);
    }

    _template() {
        return html`
            <link rel="stylesheet" href="./estilos/componentes/seleccion_carreras.css">

            <div class="tarjeta-seccion">
                <div class="tarjeta-header">SELECCIÓN DE CARRERAS</div>
                <div class="tarjeta-body">
                    <div class="grupo-carrera">
                        <label>Prioridad 1</label>
                        <selector-buscador placeholder="-- Elige tu primera opción --" .datos=${this._catalogo} @seleccion-cambiada=${(e) => this.manejarSeleccion(0, e)}></selector-buscador>
                    </div>

                    <div class="grupo-carrera">
                        <label>Prioridad 2 (Opcional)</label>
                        <selector-buscador placeholder="-- Elige tu segunda opción --" .datos=${this._catalogo} @seleccion-cambiada=${(e) => this.manejarSeleccion(1, e)}></selector-buscador>
                    </div>

                    <div class="grupo-carrera">
                        <label>Prioridad 3 (Opcional)</label>
                        <selector-buscador placeholder="-- Elige tu tercera opción --" .datos=${this._catalogo} @seleccion-cambiada=${(e) => this.manejarSeleccion(2, e)}></selector-buscador>
                    </div>
                </div>
            </div>
        `;
    }

    _dibujar() { render(this._template(), this._root); }
}

customElements.define('form-seleccion-carreras', FormSeleccionCarreras);
export default FormSeleccionCarreras;