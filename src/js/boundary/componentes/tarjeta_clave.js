import { html, render } from '../../lib/lit-html/lit-html.js';
import './arbol_colapsable.js';

class TarjetaClave extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._clave = null;
    }

    set clave(valor) {
        this._clave = valor;
        this._dibujar();
    }

    get clave() {
        return this._clave;
    }

    _template() {
        if (!this._clave) return html``;

        const { idPruebaClave, nombreClave, totalAreas, error, mensaje, arbolAreas } = this._clave;

        return html`
            <link rel="stylesheet" href="./estilos/componentes/tarjeta_clave.css">
            
            <details class="tarjeta-clave" id="detailsClave" open>
                <summary id="summaryClave">
                    <div class="clave-resumen">
                        <div class="clave-texto">
                            <span class="clave-badge">Clave</span>
                            <h2 id="lblTituloClave">${nombreClave}</h2>
                        </div>

                        <div class="clave-metas" id="metasClave">
                            <span id="lblTotalAreas">${totalAreas} áreas</span>
                            ${error 
                                ? html`<span class="meta-alerta" id="statusClave">Carga parcial</span>` 
                                : html`<span class="meta-ok" id="statusClave">Consulta completa</span>`
                            }
                        </div>
                    </div>
                </summary>

                <div class="clave-contenido" id="contenidoClave">
                    ${error ? html`
                        <div class="estado estado-advertencia" id="msgAdvertenciaClave">${mensaje}</div>
                    ` : ''}

                    <arbol-colapsable
                        id="arbolAreas"
                        titulo="Áreas de conocimiento"
                        .nodos=${arbolAreas}>
                    </arbol-colapsable>
                </div>
            </details>
        `;
    }

    _dibujar() {
        render(this._template(), this._root);
    }
}

customElements.define('tarjeta-clave', TarjetaClave);
export default TarjetaClave;