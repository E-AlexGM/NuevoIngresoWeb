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


class FrmProcesos extends HTMLElement{
    
    constructor(){
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.pruebasList = [];
        this.pruebaJornadasList = [];
        this.pruebaDao = new PruebaDAO();
        this.idPruebaSeleccionada = null;
        this.currentStep = 1;
        this.totalSteps = 2;

        this.filtroBusqueda = '';
    }

    connectedCallback(){
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        this._loadData();   
    }

    _nextStep() {
        if(this.currentStep < this.totalSteps) {
            this.currentStep++;
            this._draw();
        }
    }

    _prevStep() {
        if(this.currentStep > 1) {
            this.currentStep--;
            this._draw();
        }
    }

    _draw(){
        if(this.container !== undefined){
            render(this._template(), this.container);
        }
    }

    _templateDetalles(){
        return html `
            <div>
                <prueba-clave-area .idPrueba="${this.idPruebaSeleccionada}">
                </prueba-clave-area>
            </div>
            <button type="button"  class="btn btn-primario" @click=${() => this._prevStep()}>Anterior</button>

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
        <link rel="stylesheet" href="./estilos/componentes/prueba_clave_area.css">

        <search-nav @search-change=${(e) => this._handleSearch(e)}></search-nav>

        <div class="grid-tarjetas">              
            ${tarjetasOrdenadas.length > 0 ? 
                tarjetasOrdenadas.map(item => {
                    if (item.estado === 'ok') {
                        return html`
                            <div class="r">
                                <ui-card data-id="${item.prueba.idPrueba}" class="tarjeta-contenido" @click=${() => this._selectPrueba(item.prueba.idPrueba)}>
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
                                                <details class="tarjeta-desplegable">
                                                    <summary class="tarjeta-subtitulo interactivo" @click=${(e) => e.stopPropagation()}>
                                                        <span>Ver sedes disponibles</span>
                                                        <span class="icono-flecha">▼</span>
                                                    </summary>
                                                    <div class="desplegable-contenido">
                                                        <ul class="tarjeta-lista">
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
                                <ui-card @click=${() => this._selectPrueba(item.prueba.idPrueba)}>
                                    <div slot="content">
                                        <h3>${item.prueba.nombre || 'Sin nombre'}</h3>
                                        <p><b>Estado:</b> ${item.prueba.activo ? 'Activa' : 'Inactiva'}</p>
                                        <p><em>Esta prueba aún no tiene jornadas asignadas.</em></p>
                                    </div>
                                    <div slot="action">
                                        <button>Ver detalles</button>
                                    </div>
                                </ui-card>
                            </div>
                        `;
                    } else {
                        return html`<p><em>Cargando jornadas de ${item.prueba.nombre}...</em></p>`;
                    }
                })    
            : html `<p>No se encontraron pruebas.</p>`}
        </div>
        `;
    }

    /**
     * Convierte una cadena ISO a un formato legible en español
     */
    _formatDate(isoString) {
        if (!isoString) return 'Sin fecha';
        
        const date = new Date(isoString);
        
        // Verificamos si la fecha es válida, si no lo es, devolvemos el string original
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

    _handleSearch(e) {
        this.filtroBusqueda = e.detail.term;
        this._draw(); 
    }

    _template(){
        return html `
           ${this.currentStep === 1 ? this._templateProcesos() : this._templateDetalles()}
        `;       
    }


    /**
     * Carga las pruebas cuyo estado activo es true 
     * Carga también las aulas asociadas a cada jornada y renderiza las tarjetas 
     * Carga además las jornadas asociada a cada prueba
     * Dispara el dibujo
     */
    _loadData(){
        this.pruebaDao.list(true)
            .then(resultados =>{
                this.pruebasList = resultados.datos.map(pruebaDto => {

                    if(!pruebaDto || !pruebaDto.idPrueba) return null;
                    return Object.assign(new Prueba(), pruebaDto);
                }).filter(prueba => prueba !== null);
                this._draw();
                return Promise.all(
                    this.pruebasList.map(prueba => {
                        this.pruebaJornadaDao = new PruebaJornadaDAO(prueba.idPrueba);
                        this.pruebaJornadaDao.findRange(0, 50)
                            .then(jornadaResultados => {
                                prueba.jornadas = jornadaResultados.datos.map(jornadaDto => {
                                    if (!jornadaDto || !jornadaDto.idJornada) return null;
                                    return Object.assign(new Jornada(), jornadaDto);
                                }).filter(jornada => jornada !== null);
                                this._draw();
                                return Promise.all(
                                    prueba.jornadas.map(jornada => {
                                        
                                        this.jornadaAulaDao = new JornadaAulaDAO(jornada.idJornada);
                                        jornada.aulas = this.jornadaAulaDao.findRange(0, 50)
                                            .then(aulaResultados => {
                                                jornada.aulas = aulaResultados.datos.map(aulaDto => {
                                    
                                                    if(!aulaDto || !aulaDto.idAula) return null;

                                                    return Object.assign(new AulaDto(), aulaDto);

                                                    
                                                }).filter(aula => aula !== null);
                                                console.log(jornada.aulas)
                                                this._draw();
                                            });
                                       return jornada;
                                    })
                                );
                                 
                            });
                    })
                ); 
            })
            .catch(error => console.error("Error cargando datos:", error));
            
    }

    /**
     * Asigna a la variable global el idPrueba seleccionada
     * Avanza un paso, lo que renderiza al template del 
     */
    _selectPrueba(idPrueba){
        this.idPruebaSeleccionada = idPrueba;
        this._nextStep();
    }

    /**
     * Aplana las pruebas y sus jornadas para ordenarlas cronológicamente
     */
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