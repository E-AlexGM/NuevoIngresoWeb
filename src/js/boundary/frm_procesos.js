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
        this.errorCargaDatos = false;
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
            <link rel="stylesheet" href="./estilos/elementos_simples.css">
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
                                <ui-card data-id="${item.prueba.idPrueba}" class="tarjeta-contenido" @click=${() => this._selectPrueba(item.prueba.idPrueba)}>
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


    /**
     * Carga las pruebas cuyo estado activo es true 
     * Carga también las aulas asociadas a cada jornada y renderiza las tarjetas 
     * Carga además las jornadas asociada a cada prueba
     * Dispara el dibujo
     */
    _loadData() {

    this.errorCargaDatos = false;

    this.pruebaDao.list(true)
        .then(resultados => {
            this.pruebasList = (resultados.datos || [])
                .map(pruebaDto => {
                    if (!pruebaDto || !pruebaDto.idPrueba) {
                        return null;
                    }
                    return Object.assign(
                        new Prueba(),
                        pruebaDto
                    );
                })
                .filter(prueba => prueba !== null);

            this._draw();
            return Promise.all(
                this.pruebasList.map(prueba => {
                    const pruebaJornadaDao =
                        new PruebaJornadaDAO(prueba.idPrueba);
                    return pruebaJornadaDao.findRange(0, 50)
                        .then(jornadaResultados => {

                            prueba.jornadas = (jornadaResultados.datos || [])
                                .map(jornadaDto => {

                                    if (!jornadaDto || !jornadaDto.idJornada) {
                                        return null;
                                    }
                                    return Object.assign(
                                        new Jornada(),
                                        jornadaDto
                                    );

                                })
                                .filter(jornada => jornada !== null);
                            this._draw();
                            return Promise.all(
                                prueba.jornadas.map(jornada => {
                                    const jornadaAulaDao =
                                        new JornadaAulaDAO(jornada.idJornada);

                                    return jornadaAulaDao.findRange(0, 50)
                                        .then(aulaResultados => {
                                            console.log(
                                                'Aulas de jornada:',
                                                jornada.idJornada,
                                                aulaResultados
                                            );
                                            jornada.aulas = (aulaResultados.datos || [])
                                                .map(aulaDto => {

                                                    if (!aulaDto || !aulaDto.idAula) {
                                                        return null;
                                                    }
                                                    return Object.assign(
                                                        new AulaDto(),
                                                        aulaDto
                                                    );
                                                })
                                                .filter(aula => aula !== null);
                                            console.log(
                                                'Aulas cargadas:',
                                                jornada.aulas
                                            );
                                            this._draw();
                                            return jornada.aulas;
                                        })
                                        .catch(error => {
                                            console.error(
                                                'Error cargando aulas:',
                                                error
                                            );
                                            jornada.aulas = [];
                                            this._draw();
                                            return [];
                                        });
                                })
                            );
                        })
                        .catch(error => {
                            console.error(
                                'Error cargando jornadas:',
                                error
                            );
                            prueba.jornadas = [];
                            this._draw();
                            return [];
                        });

                })

            );

        })
        .catch(error => {
            console.error(
                'Error cargando datos:',
                error
            );
            this.errorCargaDatos = true;
            this._draw();
        });

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