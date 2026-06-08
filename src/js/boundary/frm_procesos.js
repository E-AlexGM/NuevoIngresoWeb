import PruebaDAO from "../control/prueba_dao.js";
import PruebaJornadaDAO from "../control/prueba_jornada_dao.js";
import JornadaAulaDAO from "../control/jornada_aula_dao.js";
import DAO from "../control/jornada_aula_dao.js";
import Prueba from "../entity/prueba.js";
import Jornada from "../entity/jornada.js";
import {html, render} from "../lib/lit-html/lit-html.js";
import SelectorBuscador from './componentes/selector_buscador.js'; 
import VistaPruebaClaveArea from './prueba_clave_area.js';
import SearchNav from './componentes/search_nav.js';
import AulaDto from "./dto/aula_dto.js";

class FrmProcesos extends HTMLElement {
    
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.pruebasList = [];
        this.pruebaJornadasList = [];
        this.pruebaDao = new PruebaDAO();
        this.idPruebaSeleccionada = null;
        this.currentStep = 1;
        this.totalSteps = 2;
        this.errorCargaDatos = false;
        this.filtroBusqueda = '';
        this._isUpdatePending = false; 
    }

    connectedCallback() {
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        this._loadData();   
    }

    _requestUpdate() {
        if (this._isUpdatePending) return;
        this._isUpdatePending = true;
        
        Promise.resolve().then(() => {
            this._draw();
            this._isUpdatePending = false;
        });
    }

    _nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this._requestUpdate();
        }
    }

    _prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this._requestUpdate();
        }
    }

    _draw() {
        if (this.container !== undefined) {
            render(this._template(), this.container);
        }
    }

    _handleSearch(e) {
        this.filtroBusqueda = e.detail.term;
        this._requestUpdate(); 
    }

    _selectPrueba(idPrueba) {
        this.idPruebaSeleccionada = idPrueba;
        this._nextStep();
    }

    _loadData() {
        this.errorCargaDatos = false;
        this._requestUpdate(); 
        this.pruebaDao.list(true)
            .then(resultados => {
                const pruebasRaw = resultados.datos || [];
                const promesasPruebas = pruebasRaw.map(pruebaDto => {
                    if (!pruebaDto || !pruebaDto.idPrueba) return Promise.resolve(null);

                    const prueba = Object.assign(new Prueba(), pruebaDto);
                    const pruebaJornadaDao = new PruebaJornadaDAO(prueba.idPrueba);
                    return pruebaJornadaDao.findRange(0, 50)
                        .then(jornadaResultados => {
                            const jornadasRaw = jornadaResultados.datos || [];

                            const promesasJornadas = jornadasRaw.map(jornadaDto => {
                                if (!jornadaDto || !jornadaDto.idJornada) return Promise.resolve(null);

                                const jornada = Object.assign(new Jornada(), jornadaDto);
                                const jornadaAulaDao = new JornadaAulaDAO(jornada.idJornada);

                                return jornadaAulaDao.findRange(0, 50)
                                    .then(aulaResultados => {
                                        jornada.aulas = (aulaResultados.datos || [])
                                            .map(aulaDto => aulaDto && aulaDto.idAula ? Object.assign(new AulaDto(), aulaDto) : null)
                                            .filter(Boolean);
                                        return jornada;
                                    })
                                    .catch(error => {
                                        console.error(`Error cargando aulas para jornada ${jornada.idJornada}:`, error);
                                        jornada.aulas = [];
                                        return jornada;
                                    });
                            });
                            return Promise.all(promesasJornadas).then(jornadas => {
                                prueba.jornadas = jornadas.filter(Boolean);
                                return prueba;
                            });
                        })
                        .catch(error => {
                            console.error(`Error cargando jornadas para prueba ${prueba.idPrueba}:`, error);
                            prueba.jornadas = [];
                            return prueba;
                        });
                });

                return Promise.all(promesasPruebas);
            })
            .then(pruebas => {
                this.pruebasList = pruebas.filter(Boolean);
                this._requestUpdate();
            })
            .catch(error => {
                console.error('Error crítico al cargar la estructura de datos:', error);
                this.errorCargaDatos = true;
                this._requestUpdate();
            });
    }

    _templateDetalles() {
        return html `
            <link rel="stylesheet" href="./estilos/elementos_simples.css">
            <div>
                <prueba-clave-area id="detallePrueba" .idPrueba="${this.idPruebaSeleccionada}">
                </prueba-clave-area>
            </div>
            <button id="btnAnterior" type="button" class="btn btn-primario" @click=${() => this._prevStep()}>Anterior</button>
        `;
    }

    _templateProcesos() {
        const pruebasFiltradas = this.pruebasList.filter(prueba => {
            if (!this.filtroBusqueda) return true;
            const termino = this.filtroBusqueda.toLowerCase();
            const nombre = prueba.nombre ? prueba.nombre.toLowerCase() : '';
            return nombre.includes(termino);
        });
        
        const tarjetasOrdenadas = this._getTarjetasOrdenadas(pruebasFiltradas);
        
        return html `
        <link rel="stylesheet" href="./estilos/layout/admin.css">
        <link rel="stylesheet" href="./estilos/componentes/grid_tarjetas.css">

        <search-nav id="searchNav" @search-change=${(e) => this._handleSearch(e)}></search-nav>

        <div class="grid-tarjetas">              
            ${tarjetasOrdenadas.length > 0 ? 
                tarjetasOrdenadas.map((item, index) => {
                    if (item.estado === 'ok') {
                        return html`
                            <div class="r">
                                <ui-card id="tarjetaPrueba-${index}" data-id="${item.prueba.idPrueba}" class="tarjeta-contenido" @click=${() => this._selectPrueba(item.prueba.idPrueba)}>
                                    <div slot="title vista-encabezado"></div>
                                    <div slot="content">
                                        <h3 class="tarjeta-etiqueta">
                                            ${item.prueba.nombre}     
                                        </h3>
                                        <p class="tarjeta-subtitulo">                     
                                            ${item.prueba.idTipoPrueba && item.prueba.idTipoPrueba.valor ? item.prueba.idTipoPrueba.valor : 'Prueba'}
                                        </p>
                                        <hr class="tarjeta-separador">
                                        <div class="tarjeta-seccion tarjeta-fechas">
                                            <div class="fecha-item">
                                                <h4 class="tarjeta-subtitulo">Inicio</h4>
                                                <p class="tarjeta-texto">${this._formatDate(item.jornada.fechaInicio)}</p>
                                            </div>
                                            <div class="fecha-item">
                                                <h4 class="tarjeta-subtitulo">Fin</h4>
                                                <p class="tarjeta-texto">${this._formatDate(item.jornada.fechaFin)}</p>
                                            </div>
                                        </div>
                                        <div class="tarjeta-seccion">
                                        ${item.jornada.aulas ? 
                                            (item.jornada.aulas.length > 0 ? html`
                                                <details id="detalleSedes-${index}" class="tarjeta-desplegable">
                                                    <summary id="btnDesplegableSedes-${index}" class="tarjeta-subtitulo interactivo" @click=${(e) => e.stopPropagation()}>
                                                        <span>Ver sedes disponibles</span>
                                                        <span class="icono-flecha">▼</span>
                                                    </summary>
                                                    <div class="desplegable-contenido">
                                                        <ul id="listaSedes-${index}" class="tarjeta-lista">
                                                            ${item.jornada.aulas.map(aula => html`
                                                               ${aula.sede ? html `<li>Sede:<b>${aula.sede}</b></li>`: ''}
                                                            `)}
                                                        </ul>
                                                    </div>
                                                </details>
                                            ` : html `
                                                <h4 class="tarjeta-subtitulo">Sedes</h4>
                                                <p class="tarjeta-vacio">Sin sedes asignadas</p>
                                            `) 
                                        : html `
                                            <h4 class="tarjeta-subtitulo">Sedes</h4>
                                            <p class="tarjeta-vacio">Cargando sedes...</p>
                                        `}
                                        </div>
                                    </div>
                                </ui-card>
                            </div>
                        `;
                    } else if (item.estado === 'vacio') {
                        return html`
                            <div class="r">
                                <ui-card id="tarjetaPrueba-${index}" data-id="${item.prueba.idPrueba}" class="tarjeta-contenido" @click=${() => this._selectPrueba(item.prueba.idPrueba)}>
                                    <div slot="content">
                                        <h3 class="tarjeta-etiqueta">
                                            ${item.prueba.nombre || 'Sin nombre'}
                                        </h3>
                                        <p class="tarjeta-subtitulo">                     
                                            ${item.prueba.idTipoPrueba && item.prueba.idTipoPrueba.valor ? item.prueba.idTipoPrueba.valor : 'Prueba'}
                                        </p>
                                        <hr class="tarjeta-separador">
                                        
                                        <div class="tarjeta-seccion" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 8rem; text-align: center;">
                                            <p class="tarjeta-vacio">Esta prueba aún no tiene jornadas asignadas.</p>
                                        </div>
                                    </div>
                                </ui-card>
                            </div>
                        `;
                    } else {
                        return html`<p><em>Cargando jornadas de ${item.prueba.nombre}...</em></p>`;
                    }
                })    
            : html `<p id="mensajeVacio" class="mensaje-sin-pruebas">No se encontraron pruebas.</p>`}
        </div>
        `;
    }

    _formatDate(isoString) {
        if (!isoString) return 'Sin fecha';
        
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString;

        return new Intl.DateTimeFormat('es-SV', {
            year: 'numeric',
            month: 'short',  
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true    
        }).format(date);
    }

    _template() {
        if (this.errorCargaDatos) {       
            return html`
                <link rel="stylesheet" href="./estilos/componentes/error_pantalla.css">
                <div class="mensaje-error-pantalla">
                    <div class="icono-error">⚠️</div>
                    <h3>Ocurrió un problema</h3>
                    <p>No pudimos cargar la información necesaria en este momento. Por favor, comprueba tu conexión o inténtalo más tarde.</p>
                </div>
            `;
        }
        return html `
           ${this.currentStep === 1 ? this._templateProcesos() : this._templateDetalles()}
        `;       
    }

    _getTarjetasOrdenadas(pruebas) {
        const tarjetas = [];

        pruebas.forEach(prueba => {
            if (!prueba.jornadas) {
                tarjetas.push({ prueba, jornada: null, estado: 'cargando' });
            } else if (prueba.jornadas.length === 0) {
                tarjetas.push({ prueba, jornada: null, estado: 'vacio' });
            } else {
                prueba.jornadas.forEach(jornada => {
                    tarjetas.push({ prueba, jornada, estado: 'ok' });
                });
            }
        });

        tarjetas.sort((a, b) => {
            if (a.estado !== 'ok' || !a.jornada.fechaInicio) return 1;
            if (b.estado !== 'ok' || !b.jornada.fechaInicio) return -1;

            const dateA = new Date(a.jornada.fechaInicio).getTime();
            const dateB = new Date(b.jornada.fechaInicio).getTime();

            return dateA - dateB;
        });

        return tarjetas;
    }
}

customElements.define('frm-procesos', FrmProcesos);
export default FrmProcesos;