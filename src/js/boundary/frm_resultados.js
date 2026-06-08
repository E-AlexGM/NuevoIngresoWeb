import { html, render } from "../lib/lit-html/lit-html.js";
import ExamenDAO from "../control/examen_dao.js";
import CardExamenDto from "./dto/card_examen_dto.js";
import Prueba from "../entity/prueba.js";
import NotificacionToast from "./componentes/notificacion_toast.js";

class FrmResultados extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.currentStep = 1;
        this.totalSteps = 2;
        this.examenDAO = new ExamenDAO();
        this.cardExamenDtoList = [];
    }

    connectedCallback() {
        this.container = document.createElement('div');
        
        this.root.appendChild(this.container);
        this.draw();
    }

    nextStep() {
        if(this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.draw();
        }
    }

    prevStep() {
        if(this.currentStep > 1) {
            this.currentStep--;
            this.draw();
        }
    }
    
    _templateSearchExam(){
        return html`
            <link rel="stylesheet" href="./estilos/elementos_simples.css">
            <div class="campo-formulario">
                <label for="txtCorreoResultado">Ingrese su correo Electrónico</label>
                <input id="txtCorreoResultado" type="email" name="correo" class="input-base" placeholder="someone@example.com">
            </div>
        `;
    }

    _templateExamResults(){
        return html`
            <link rel="stylesheet" href="./estilos/componentes/grid_tarjetas.css">
            <h2>Resultados</h2>
            <p>Estos son los resultados de la búsqueda.</p>
            ${this.cardExamenDtoList && this.cardExamenDtoList.length > 0 ? html` 
                <div class="grid-tarjetas">              
                    ${this.cardExamenDtoList.map(item => html`
                        <ui-card>
                            <div id="datosResultado" slot="content" class="tarjeta-contenido" style="text-align: left;">
                                
                                <div>
                                    <p class="tarjeta-etiqueta">Prueba de Admisión</p>
                                    <h3 id="tituloResultado" class="tarjeta-titulo">${item.nombrePrueba || '-'}</h3>
                                    <hr class="tarjeta-separador">
                                </div>

                                <div class="tarjeta-seccion">
                                    <div class="tarjeta-fechas">
                                        <div class="fecha-item">
                                            <p class="tarjeta-subtitulo">Fecha de realización</p>
                                            <p class="tarjeta-texto">${this._formatDate(item.fechaRealizacion) || '-'}</p>
                                        </div>
                                        <div class="fecha-item">
                                            <p class="tarjeta-subtitulo">Resultado</p>
                                            <p class="tarjeta-texto">${item.resultado || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </ui-card>
                    `)}
                </div>
            ` : html`
                 <p id="mensajeError" class="mensaje-sin-resultados">No se encontraron resultados correspondientes</p>
            `}
        `;
    }



    _template(){
        return html`
            <link rel="stylesheet" href="./estilos/elementos_simples.css">
            <notificacion-toast></notificacion-toast>
            <div>
                <form @submit=${(e) => this.handleSubmit(e)}>
                    ${this.currentStep === 1 ? this._templateSearchExam() : this._templateExamResults()}
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        ${this.currentStep > 1 
                            ? html`<button id="btnAnterior" type="button" class="btn btn-secundario" @click=${() => this.prevStep()}><span>←</span> Anterior</button>` 
                            : ''}
                        ${this.currentStep < this.totalSteps 
                            ? html`<button id="btnBuscar" type="submit" class="btn btn-primario">Buscar</button>` 
                            : ''}
                    </div>

                </form>
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


    draw() {        
        if (this.container !== undefined) {
            render(this._template(), this.container);
        }
    }

    /**
     * Extrae el correo del formulario y realiza la búsqueda de resultados asociados a ese correo.
     * @param {e} e 
     * Rellena el template de resultados con los datos obtenidos de la búsqueda. 
     * Si ocurre un error, muestra un mensaje de error al usuario.
     * */
    handleSubmit(e) { 
        e.preventDefault();
        let correo; 
        correo = this.root.querySelector('input[name="correo"]').value;
        console.log(correo);
        if (!correo) {
            window.dispatchEvent(new CustomEvent('lanzar-notificacion', {
                detail: { mensaje: 'Por favor, ingresa un correo electrónico para buscar los resultados.', tipo: 'error' }
            }));
            return;
        }
        this.examenDAO.findByCorreo(correo)
            .then(resultados => {
                console.log(resultados);
                this.cardExamenDtoList = resultados.datos.map(cardExamenDto =>{
                    return Object.assign(new Prueba(), cardExamenDto);
                });
                this.nextStep();
            })
            .catch(error => {
                if(error.mensaje.includes('404')) {
                    this.cardExamenDtoList = null;
                    this.nextStep();
                    return;
                }
                console.error('Error al buscar resultados:', error);
                window.dispatchEvent(new CustomEvent('lanzar-notificacion', {
                    detail: { mensaje: 'Ocurrió un error al buscar los resultados. Por favor, inténtalo de nuevo más tarde.', tipo: 'error' }
                }));
            });
        
    }

}

customElements.define('frm-resultados', FrmResultados);
export default FrmResultados;