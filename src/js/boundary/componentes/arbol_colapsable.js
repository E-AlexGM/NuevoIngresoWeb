import { html, render } from '../../lib/lit-html/lit-html.js';

class ArbolColapsable extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._nodos = [];
        this._arbolProcesado = [];
        this.titulo = '';
    }

    static get observedAttributes() {
        return ['titulo'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'titulo') {
            this.titulo = newVal;
            this._dibujar();
        }
    }

    set nodos(valor) {
        this._nodos = Array.isArray(valor) ? valor : [];
        this._arbolProcesado = this._generarEstructuraArbol(this._nodos);
        this._dibujar();
    }

    get nodos() {
        return this._nodos;
    }

    connectedCallback() {
        this._dibujar();
    }

    // Invierte el camino encadenado de la API (idAreaPadre) y unifica carpetas
    _generarEstructuraArbol(relaciones) {
        const mapaNodos = new Map();
        const raices = new Map();

        relaciones.forEach(rel => {
            if (!rel || !rel.idArea) return;
            let caminoInverso = [];
            let actual = rel.idArea;
            while (actual) {
                caminoInverso.unshift(actual); 
                actual = actual.idAreaPadre;
            }

            let idPadreActual = null;
            caminoInverso.forEach((area, index) => {
                const esHoja = index === caminoInverso.length - 1;
                const id = area.idArea;

                if (!mapaNodos.has(id)) {
                    mapaNodos.set(id, {
                        idArea: id,
                        nombre: area.nombre,
                        hijos: new Map(),
                        cantidad: esHoja ? rel.cantidad : 0,
                        porcentaje: esHoja ? rel.porcentaje : 0,
                        esHoja: esHoja
                    });
                } else if (esHoja) {
                    // Si el nodo ya existía estructuralmente pero ahora es una hoja explícita
                    const nodoExistente = mapaNodos.get(id);
                    nodoExistente.cantidad = rel.cantidad;
                    nodoExistente.porcentaje = rel.porcentaje;
                    nodoExistente.esHoja = true;
                }

                const nodoActual = mapaNodos.get(id);

                if (idPadreActual === null) {
                    raices.set(id, nodoActual);
                } else {
                    const nodoPadre = mapaNodos.get(idPadreActual);
                    if (nodoPadre) {
                        nodoPadre.hijos.set(id, nodoActual);
                        raices.delete(id); // Si tiene un padre, deja de ser una raíz global
                    }
                }
                idPadreActual = id;
            });
        });

        // Conversión recursiva de Maps internos a Arreglos ordenados alfabéticamente
        const transformarALista = (mapa) => {
            return Array.from(mapa.values())
                .map(nodo => ({
                    ...nodo,
                    hijos: transformarALista(nodo.hijos)
                }))
                .sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), 'es'));
        };

        return transformarALista(raices);
    }

    _renderizarRama(nodo, nivel = 0) {
    const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
    const simboloIcono = tieneHijos ? '▶' : '•';

    return html`
        <div class="nodo" id="nodoContainer-${nodo.idArea}">
            <details ?open=${!nodo.esHoja} id="detailsNodo-${nodo.idArea}">
                <summary class="nodo-fila" id="summaryNodo-${nodo.idArea}">
                    <div class="nodo-identificador">
                        <div class="nodo-icono nivel-${nivel}">${simboloIcono}</div>
                        
                        <div class="nodo-texto">
                            <span class="nodo-nombre" id="nombreNodo-${nodo.idArea}">${nodo.nombre}</span>
                            ${nodo.descripcion ? html`<p class="nodo-descripcion" id="descripcionNodo-${nodo.idArea}">${nodo.descripcion}</p>` : ''}
                        </div>
                    </div>
                    
                    ${nodo.esHoja ? html`
                        <div class="nodo-metas">
                            <span class="badge-preguntas" id="badgeNodo-${nodo.idArea}">${nodo.cantidad} ítems | ${nodo.porcentaje}%</span>
                        </div>
                    ` : ''}
                </summary>
                
                ${tieneHijos ? html`
                    <div class="nodo-hijos" id="hijosNodo-${nodo.idArea}">
                        ${nodo.hijos.map(hijo => this._renderizarRama(hijo, nivel + 1))}
                    </div>
                ` : ''}
            </details>
        </div>
    `;
}

_template() {
    return html`
        <link rel="stylesheet" href="./estilos/componentes/arbol_colapsable.css">
        <div class="arbol-contenedor" id="arbolContenedor">
            ${this.titulo ? html`
                <div class="arbol-titulo" id="arbolTitulo">
                    <span>Áreas de conocimiento</span>
                    <strong>${this.titulo}</strong>
                </div>
            ` : ''}
            
            <div class="arbol-lista" id="arbolLista">
                ${this._arbolProcesado && this._arbolProcesado.length > 0 
                    ? this._arbolProcesado.map(nodo => this._renderizarRama(nodo, 0))
                    : html`<div class="arbol-vacio" id="arbolVacio">No hay áreas de conocimiento asignadas.</div>`
                }
            </div>
        </div>
    `;
}

    _dibujar() {
        render(this._template(), this._root);
    }
}

customElements.define('arbol-colapsable', ArbolColapsable);
export default ArbolColapsable;