import { html, render } from '../lib/lit-html/lit-html.js';
import Aspirante from '../entity/aspirante.js'; 
import AspiranteDAO from '../control/aspirante_dao.js'; 
import NotificacionToast from './componentes/notificacion_toast.js';

class FormularioAspirante extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.aspiranteDAO = new AspiranteDAO();
    }

    connectedCallback() {
        this.dibujar();
    }

    manejarEnvio(evento) {
        evento.preventDefault(); 

        // Obtenemos el formulario del Shadow DOM
        const form = this.root.querySelector('#form-aspirante');

        // Llenamos el objeto Aspirante con los valores de los inputs
        const nuevoAspirante = new Aspirante();
        nuevoAspirante.nombres = form.nombres.value;
        nuevoAspirante.apellidos = form.apellidos.value;
        nuevoAspirante.fechaNacimiento = form.fechaNacimiento.value;
        nuevoAspirante.documentoIdentidad = form.documentoIdentidad.value;
        nuevoAspirante.correo = form.correo.value;
        nuevoAspirante.fechaCreacion = new Date().toISOString();
        
        this.aspiranteDAO.create(nuevoAspirante).then(() => {
            window.dispatchEvent(new CustomEvent('lanzar-notificacion', {
                detail: {
                    mensaje: 'Aspirante registrado exitosamente',
                    tipo: 'exito'
                }
            }));
            form.reset(); // Limpiamos el formulario
        }).catch(error => {
            window.dispatchEvent(new CustomEvent('lanzar-notificacion', {
                detail: {
                    mensaje: 'Error al registrar aspirante: ' + error.mensaje,
                    tipo: 'error'
                }
            }));
        });        
    }

    template() {
        return html`
            <link rel="stylesheet" href="./estilos/componentes/formulario_aspirante.css">
            
            <div class="form-container">
                <h2>Registro de Nuevo Aspirante</h2>
                <p class="subtitle">Ingresa tus datos personales para iniciar el proceso de admisión.</p>

                <form id="form-aspirante" @submit="${(e) => this.manejarEnvio(e)}">
                    
                    <div class="form-group">
                        <label for="nombres">Nombres</label>
                        <input type="text" id="nombres" name="nombres" required>
                    </div>

                    <div class="form-group">
                        <label for="apellidos">Apellidos</label>
                        <input type="text" id="apellidos" name="apellidos" required>
                    </div>

                    <div class="form-group row">
                        <div class="col">
                            <label for="fechaNacimiento">Fecha de Nacimiento</label>
                            <input type="date" id="fechaNacimiento" name="fechaNacimiento" required>
                        </div>
                        <div class="col">
                            <label for="documentoIdentidad">Documento de Identidad (DUI)</label>
                            <input type="text" id="documentoIdentidad" name="documentoIdentidad" placeholder="00000000-0" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="correo">Correo Electrónico</label>
                        <input type="email" id="correo" name="correo" required>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Registrar Aspirante</button>
                    </div>
                </form>
            </div>
        `;
    }

    dibujar() {
        render(this.template(), this.root);
    }
}

customElements.define('formulario-aspirante', FormularioAspirante);
export default FormularioAspirante;