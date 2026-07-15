import { html, render } from '../lib/lit-html/lit-html.js';
import PruebaDAO from '../control/prueba_dao.js';
import PruebaClaveDAO from '../control/prueba_clave_dao.js';
import PruebaClaveAreaDAO from '../control/prueba_clave_area_dao.js';
import './componentes/notificacion_toast.js';
import './componentes/tarjeta_clave.js'; 

class VistaPruebaClaveArea extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this.pruebaDAO = new PruebaDAO();
        this.idPrueba = null;
        this.prueba = null;
        this.claves = [];
        this.arbolesClaves = [];
        this.cargando = false;
        this.errorMensaje = '';
    }

    connectedCallback() {
        this.cargarVista();
    }


    notificar(mensaje, tipo) {
        window.dispatchEvent(new CustomEvent('lanzar-notificacion', {
            detail: { mensaje, tipo }
        }));
    }

    cargarVista() {
        if (!this.idPrueba) {
            this.errorMensaje = 'Debes pasar el id de la prueba en la URL para consultar sus claves.';
            this._dibujar();
            return Promise.resolve();
        }

        this.cargando = true;
        this.errorMensaje = '';
        this.claves = [];
        this.arbolesClaves = [];
        this._dibujar();

        return this.pruebaDAO.findById(this.idPrueba)
            .then((respuesta) => {
                this.prueba = respuesta && respuesta.datos ? respuesta.datos : null;
                return this.cargarClaves();
            })
            .then(() => {
                this.cargando = false;
                this._dibujar();
            })
            .catch((error) => {
                this.cargando = false;
                this.errorMensaje = 'No existe información para esta prueba.';
                this._dibujar();
                this.notificar(this.errorMensaje, 'error');
            });
    }

    cargarClaves() {
        const pruebaClaveDAO = new PruebaClaveDAO(this.idPrueba);

        return pruebaClaveDAO.findRange(0, 50)
            .then((respuesta) => {
                this.claves = Array.isArray(respuesta && respuesta.datos) ? respuesta.datos : [];
                return this.cargarArbolesClaves(this.claves);
            })
            .then((arboles) => {
                this.arbolesClaves = arboles;
            });
    }

    cargarArbolesClaves(claves) {
        const peticiones = claves.map((clave) => this.cargarClaveConAreas(clave));
        return Promise.all(peticiones);
    }

    cargarClaveConAreas(clave) {
        const idPruebaClave = clave ? (clave.idPruebaClave || clave.id || clave.codigo) : null;
        const nombreClave = clave ? (clave.nombreClave || clave.nombre || clave.descripcion) : `Clave ${idPruebaClave}`;

        if (!idPruebaClave) {
            return Promise.resolve({
                idPruebaClave: null,
                nombreClave,
                arbolAreas: [],
                totalAreas: 0,
                error: true,
                mensaje: 'No se pudo identificar la clave de la prueba.'
            });
        }

        const pruebaClaveAreaDAO = new PruebaClaveAreaDAO(idPruebaClave);

        return pruebaClaveAreaDAO.findRange(0, 50)
            .then((respuesta) => {
                const relaciones = Array.isArray(respuesta && respuesta.datos) ? respuesta.datos : [];
                return {
                    idPruebaClave,
                    nombreClave,
                    arbolAreas: relaciones, // Enviamos los datos puros y estructurados de la API
                    totalAreas: relaciones.length,
                    error: false,
                    mensaje: ''
                };
            })
            .catch((error) => ({
                idPruebaClave,
                nombreClave,
                arbolAreas: [],
                totalAreas: 0,
                error: true,
                mensaje: error && error.mensaje ? error.mensaje : 'No se pudieron cargar las areas de esta clave.'
            }));
    }

    _template() {
        return html`
            <link rel="stylesheet" href="./estilos/componentes/prueba_clave_area.css">

            <div class="vista-contenedor" id="contenedorVistaPrueba">
                <div class="vista-encabezado">
                    <div class="cabecera-texto">
                        <p class="eyebrow" id="lblCategoriaVista">Consulta de prueba de ingreso</p>
                        <h1 id="lblNombrePrueba">${this.prueba && this.prueba.nombre ? this.prueba.nombre : 'Consulta de areas por prueba'}</h1>
                        <p class="descripcion">Revisa las claves y las áreas relacionadas a esta prueba.</p>
                    </div>

                    <div class="cabecera-resumen" id="panelResumenDatos">
                        <div class="resumen-item">
                            <span class="resumen-etiqueta">Claves</span>
                            <strong id="lblResumenTotalClaves">${this.claves.length}</strong>
                        </div>
                        <div class="resumen-item">
                            <span class="resumen-etiqueta">Puntaje maximo</span>
                            <strong id="lblResumenPuntajeMaximo">${this.prueba ? this.prueba.puntajeMaximo : '-'}</strong>
                        </div>
                        <div class="resumen-item">
                            <span class="resumen-etiqueta">Aprobacion</span>
                            <strong id="lblResumenNotaAprobacion">${this.prueba ? this.prueba.notaAprobacion : '-'}</strong>
                        </div>
                    </div>
                </div>

                ${this.errorMensaje ? html`
                    <div class="estado estado-error" id="msgErrorVista">${this.errorMensaje}</div>
                ` : ''}

                ${this.cargando ? html`
                    <div class="estado estado-carga" id="msgCargandoVista">
                        Cargando la prueba, sus claves y sus areas relacionadas...
                    </div>
                ` : ''}

                ${!this.cargando && !this.errorMensaje ? html`
                    ${this.arbolesClaves.length === 0 ? html`
                        <div class="estado estado-vacio" id="msgVacioVista">
                            No se encontraron claves registradas para esta prueba.
                        </div>
                    ` : html`
                        <div class="lista-claves" id="divListaClaves">
                            ${this.arbolesClaves.map((clave) => html`
                                <tarjeta-clave 
                                    id="cardClave-${clave.idPruebaClave}"
                                    .clave=${clave}>
                                </tarjeta-clave>
                            `)}
                        </div>
                    `}
                ` : ''}
            </div>
        `;
    }

    _dibujar() {
        if (this._root !== undefined) {
            render(this._template(), this._root);
        }
    }
}

customElements.define('prueba-clave-area', VistaPruebaClaveArea);
export default VistaPruebaClaveArea;