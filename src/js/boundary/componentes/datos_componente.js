import { html, render } from '../../lib/lit-html/lit-html.js';

class FormDatosPersonales extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._datos = {
            documentoIdentidad: '',
            nombres: '',
            apellidos: '',
            fechaNacimiento: '',
            correo: ''
        };
    }

    set datos(valor) {
        this._datos = valor || this._datos;
        this._dibujar();
    }

    manejarInput(e) {
        const { name, value } = e.target;
        let evento = new CustomEvent('datos-actualizados', {
            composed: true,
            bubbles: true,
            detail: { campo: name, valor: value }
        });
        this.dispatchEvent(evento);
    }

    validar() {
        const inputsRequeridos = this._root.querySelectorAll('input[required]');
        for (let input of inputsRequeridos) {
            if (!input.checkValidity()) {
                input.reportValidity(); 
                return false;
            }
        }
        return true;
    }

    limpiar() {
        this._datos = {
            documentoIdentidad: '',
            nombres: '',
            apellidos: '',
            fechaNacimiento: '',
            correo: ''
        };

        const inputs = this._root.querySelectorAll('input');
        inputs.forEach(input => input.value = '');

        this._dibujar();
    }

    _template() {
        const fechaMax = new Date();
        fechaMax.setFullYear(fechaMax.getFullYear() - 10);
        const maxString = fechaMax.toISOString().split('T')[0];

        return html`
            <link rel="stylesheet" href="./estilos/componentes/datos_componente.css">

            <div class="tarjeta-seccion" id="tarjetaSeccionDatos">
                <div class="tarjeta-header" id="tarjetaHeaderDatos">DATOS PERSONALES</div>
                <div class="tarjeta-body grid-inputs" id="tarjetaBodyDatos">
                    <input type="text" id="txtDocumentoIdentidad" name="documentoIdentidad" .value=${this._datos.documentoIdentidad} class="form-input col-completa" placeholder="Documento de Identidad (DUI)" @input=${(e) => this.manejarInput(e)}>
                    
                    <input type="text" id="txtNombres" name="nombres" .value=${this._datos.nombres} class="form-input" placeholder="Nombres Completos" required @input=${(e) => this.manejarInput(e)}>
                    <input type="text" id="txtApellidos" name="apellidos" .value=${this._datos.apellidos} class="form-input" placeholder="Apellidos Completos" required @input=${(e) => this.manejarInput(e)}>
                    
                    <input type="date" id="txtFechaNacimiento" name="fechaNacimiento" max="${maxString}" .value=${this._datos.fechaNacimiento} class="form-input" required @input=${(e) => this.manejarInput(e)}>
                    
                    <input type="email" id="txtCorreo" name="correo" .value=${this._datos.correo} class="form-input col-completa" placeholder="Correo Electrónico" required @input=${(e) => this.manejarInput(e)}>
                </div>
            </div>
        `;
    }

    _dibujar() { render(this._template(), this._root); }
}

customElements.define('form-datos-personales', FormDatosPersonales);
export default FormDatosPersonales;