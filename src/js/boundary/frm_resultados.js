import { html, render } from "../lib/lit-html/lit-html.js";
import ExamenDAO from "../control/examen_dao.js";
import CardExamenDto from "./dto/card_examen_dto.js";
import Prueba from "../entity/prueba.js";

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
            <h3>Ingrese su correo electrónico</h3>
            <input type="email" name="correo">
        `;
    }

    _templateExamResults(){
          return html`
            <h2>Resultados</h2>
            <p>Estos son los resultados de la búsqueda.</p>

            ${this.cardExamenDtoList ? this.cardExamenDtoList.map(item => html`               
                 <ui-card>
                    <div slot="content">
                        <p>Nombre de la prueba: ${item.nombrePrueba || '-'}</p>
                        <p>Fecha de realización: ${item.fechaRealizacion || '-'}</p>
                        <p>Resultado: ${item.resultado || '-'}</p>
                    </div>
                </ui-card>
            `) : html`
                <p>No se encontraron resultados correspondientes</p>
            `}
        `;
    }

    _template(){
        return html`
            <div>
                <form @submit=${(e) => this.handleSubmit(e)}>
                        ${this.currentStep === 1 ? this._templateSearchExam() : this._templateExamResults()}
                        ${this.currentStep > 1 ? html`<button type="button"  @click=${() => this.prevStep()}>Anterior</button>` : ''}
                        ${this.currentStep < this.totalSteps ? html`<button type="submit">Buscar</button>` : ''}
                    </div>
                </form>
           </div>
        `;
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
     * 
     */
    handleSubmit(e) { 
        e.preventDefault();
        let correo; 
        correo = this.root.querySelector('input[name="correo"]').value;
        console.log(correo);
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
                alert('Ocurrió un error al buscar los resultados. Por favor, inténtalo de nuevo más tarde.');
            });
        
    }

}

customElements.define('frm-resultados', FrmResultados);
export default FrmResultados;