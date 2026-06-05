import PruebaDAO from "../control/prueba_dao.js";
import PruebaJornadaDAO from "../control/prueba_jornada_dao.js";
import Prueba from "../entity/prueba.js";
import Jornada from "../entity/jornada.js";
import {html, render} from "../lib/lit-html/lit-html.js";
import SelectorBuscador from './componentes/selector_buscador.js'; 
import VistaPruebaClaveArea from './prueba_clave_area.js';
import SearchNav from './componentes/search_nav.js';


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

    _templateTemario(){
        return html `
            <div>
                <prueba-clave-area .idPrueba="${this.idPruebaSeleccionada}"></prueba-clave-area>
            </div>

        `;
    }

    _templateProcesos(){
        const pruebasFiltradas = this.pruebasList.filter(prueba => {
            if (!this.filtroBusqueda) return true; // Si no hay filtro, mostramos todas
            
            const termino = this.filtroBusqueda.toLowerCase();
            const nombre = prueba.nombre ? prueba.nombre.toLowerCase() : '';
            return nombre.includes(termino);
        });
        /*
        return html `
        <link rel="stylesheet" href="./estilos/layout/admin.css">
        <search-nav @search-change=${(e) => this._handleSearch(e)}></search-nav>
      
       ${this.pruebasList ? 
                this.pruebasList.map(prueba => html `
                <div class="grid-tarjetas">              

                    <ui-card @click=${() => this._selectPrueba(prueba.idPrueba)}>
                        <div slot="content">
                            <p>Nombre de la prueba: ${prueba.nombre || '-'}</p>
                            <p>Duración de la prueba: ${prueba.duracion || '-'}</p>
                            <p>Estado de la prueba: ${prueba.activo ? 'Activo' : 'Inactivo'|| '-'}</p>
                            <p>Tipo de la prueba: ${prueba.idTipoPrueba.valor || '-'}</p>
                            <hr>
                            <h4>Jornadas de la prueba   :</h4>
                            ${prueba.jornadas ? 
                                (prueba.jornadas.length > 0 ? html `
                                    <ul>
                                        ${prueba.jornadas.map(jornada => html`
                                            
                                            <li>${jornada.fechaInicio} - ${jornada.fechaFin || 'Sin fecha'}</li>
                                        `)}
                                    </ul>
                                ` : html `<p>No hay jornadas asociadas a esta prueba.</p>`) 
                            : html `<p><em>Cargando jornadas...</em></p>`}
                        </div>
                    </ui-card>
                </div>
                `)    
            : html ``}

        `;
        */
       return html `
        <link rel="stylesheet" href="./estilos/layout/admin.css">

        <search-nav @search-change=${(e) => this._handleSearch(e)}></search-nav>

        <div class="grid-tarjetas">              
            ${pruebasFiltradas.length > 0 ? 
                pruebasFiltradas.map(prueba => html `
                    <ui-card @click=${() => this._selectPrueba(prueba.idPrueba)}>
                        <div slot="content">
                            <p>Nombre de la prueba: ${prueba.nombre || '-'}</p>
                            <p>Duración de la prueba: ${prueba.duracion || '-'}</p>
                            <p>Estado de la prueba: ${prueba.activo ? 'Activo' : 'Inactivo'|| '-'}</p>
                            <p>Tipo de la prueba: ${prueba.idTipoPrueba.valor || '-'}</p>
                            <hr>
                            <h4>Jornadas de la prueba:</h4>
                            ${prueba.jornadas ? 
                                (prueba.jornadas.length > 0 ? html `
                                    <ul>
                                        ${prueba.jornadas.map(jornada => html`
                                            <li>${jornada.fechaInicio} - ${jornada.fechaFin || 'Sin fecha'}</li>
                                        `)}
                                    </ul>
                                ` : html `<p>No hay jornadas asociadas a esta prueba.</p>`) 
                            : html `<p><em>Cargando jornadas...</em></p>`}
                        </div>
                    </ui-card>
                `)    
            : html `<p style="grid-column: 1 / -1; color: #666;">No se encontraron pruebas con ese nombre.</p>`}
        </div>
        `;
    }

    _handleSearch(e) {
        this.filtroBusqueda = e.detail.term;
        this._draw(); // Forzamos un re-render
    }

    _template(){
        return html `
           ${this.currentStep === 1 ? this._templateProcesos() : this._templateTemario()}
        `;       
    }


    /**
     * Carga las pruebas cuyo estado activo es true 
     * Carga además las jornadas asociada a cada prueba
     * Dispara el dibujo
     */
    _loadData(){
        this.pruebaDao.list(true)
            .then(resultados =>{
                this.pruebasList = resultados.datos.map(pruebaDto => {
                    return Object.assign(new Prueba(), pruebaDto);
                });
                this._draw();
                return Promise.all(
                    this.pruebasList.map(prueba => {
                        this.pruebaJornadaDao = new PruebaJornadaDAO(prueba.idPrueba);
                        this.pruebaJornadaDao.findRange(0, 50)
                            .then(jornadaResultados => {
                                prueba.jornadas = jornadaResultados.datos.map(jornadaDto => {
                                    return Object.assign(new Jornada(), jornadaDto);
                                });

                            }).then(() => this._draw());
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
   
}
customElements.define('frm-procesos', FrmProcesos);
export default FrmProcesos;