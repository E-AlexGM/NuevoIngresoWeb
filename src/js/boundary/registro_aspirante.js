import { html, render } from '../lib/lit-html/lit-html.js';
import Aspirante from '../entity/aspirante.js';
import AspiranteDAO from '../control/aspirante_dao.js';
import CarreraDAO from '../control/carrera_dao.js';
import AspiranteOpcion from '../entity/aspirante_opcion.js';
import AspiranteOpcionDAO from '../control/aspirante_opcion_dao.js';

import './componentes/notificacion_toast.js';
import SelectorBuscador from './componentes/selector_buscador.js'; 

class VistaRegistroAspirante extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this.aspiranteDAO = new AspiranteDAO();
        this.carreraDAO = new CarreraDAO();
        this.datos = {
            documentoIdentidad: '',
            nombres: '',
            apellidos: '',
            fechaNacimiento: '',
            correo: ''
        };
        this.carrerasSeleccionadas = [null, null, null]; 
        this.errorMensaje = '';
        this.catalogoCarreras = [];
    }

    connectedCallback() {
        this._dibujar();
        this.cargarCarreras();
    }

    cargarCarreras() {
        this.carreraDAO.findRange(0, 50)
            .then(respuesta => {
                if (respuesta && Array.isArray(respuesta.datos)) {
                    this.catalogoCarreras = respuesta.datos.map(carrera => ({
                        id: carrera.codigo, 
                        texto: carrera.nombre
                    }));
                    this._dibujar();
                }
            })
            .catch(error => {
                this.errorMensaje = 'No se pudo cargar el catálogo de carreras.';
                this._dibujar();
                this.notificar(error.mensaje || this.errorMensaje, 'error');
            });
    }

    manejarInput(e) {
        const { name, value } = e.target;
        this.datos[name] = value;
    }

    manejarSeleccionCarrera(index, e) {
        this.carrerasSeleccionadas[index] = e.detail.id;
    }

    notificar(mensaje, tipo) {
        window.dispatchEvent(new CustomEvent('lanzar-notificacion', {
            detail: { mensaje, tipo }
        }));
    }

    validarDuplicados(documentoIdentidad) {
        return this.aspiranteDAO.findRange(0, 50)
            .then(respuesta => {
                const aspirantesDB = Array.isArray(respuesta?.datos) ? respuesta.datos : [];

                return aspirantesDB.some(user =>
                    String(user.documentoIdentidad).trim() === documentoIdentidad
                );
            })
            .catch(error => {
                throw new Error('No se pudo verificar si el aspirante ya existe en el sistema.');
            });
    }

    validarCarrerasUnicas(carrerasElegidas) {
        const carrerasNormalizadas = carrerasElegidas.map(carrera => String(carrera).trim());
        const carrerasUnicas = new Set(carrerasNormalizadas);
        return carrerasNormalizadas.length === carrerasUnicas.size;
    }

    crearAspirante() {
        const nuevoAspirante = new Aspirante();
        nuevoAspirante.documentoIdentidad = this.datos.documentoIdentidad.trim();
        nuevoAspirante.nombres = this.datos.nombres.trim();
        nuevoAspirante.apellidos = this.datos.apellidos.trim();
        nuevoAspirante.fechaNacimiento = this.datos.fechaNacimiento;
        nuevoAspirante.correo = this.datos.correo.trim();
        nuevoAspirante.fechaCreacion = new Date().toISOString();
        return this.aspiranteDAO.create(nuevoAspirante)
            .then(aspiranteCreado => {
                const idAspiranteCreado = aspiranteCreado?.datos?.id || aspiranteCreado?.datos?.location?.split('/').pop();
                if (!idAspiranteCreado) {
                    throw new Error('No se pudo obtener el identificador del aspirante creado.');
                }

                return idAspiranteCreado;
            });
    }

    crearOpcionesAspirante(idAspiranteGenerado) {
        const opcionDAO = new AspiranteOpcionDAO(idAspiranteGenerado);
        const carrerasElegidas = this.carrerasSeleccionadas.filter(id => id !== null);
        return carrerasElegidas.reduce((cadena, idCarrera, indice) => {
            return cadena.then(opcionesCreadas => {
                const nuevaOpcion = new AspiranteOpcion();
                nuevaOpcion.idAspirante = { idAspirante: idAspiranteGenerado };
                nuevaOpcion.idOpcion = idCarrera;
                nuevaOpcion.prioridad = indice + 1;
                nuevaOpcion.fechaCreacion = new Date().toISOString();

                return opcionDAO.create(nuevaOpcion)
                    .then(respuestaCreacion => {
                        const idOpcionCreada = respuestaCreacion?.datos?.id || respuestaCreacion?.datos?.location?.split('/').pop();
                        opcionesCreadas.push(idOpcionCreada);
                        return opcionesCreadas;
                    });
            });
        }, Promise.resolve([]));
    }

    revertirCreacionAspirante(idAspiranteGenerado, opcionesCreadas = []) {
        const opcionDAO = new AspiranteOpcionDAO(idAspiranteGenerado);

        return [...opcionesCreadas].reverse().reduce((cadena, idOpcionCreada) => {
            return cadena.then(() => {
                if (!idOpcionCreada) {
                    return undefined;
                }

                return opcionDAO.delete(idOpcionCreada)
                    .catch(error => {
                        console.error('No se pudo revertir una opción creada:', error);
                    });
            });
        }, Promise.resolve())
            .then(() => this.aspiranteDAO.delete(idAspiranteGenerado))
            .catch(error => {
                console.error('No se pudo revertir el aspirante creado:', error);
                throw new Error('Ocurrió un error al deshacer el registro y no se pudo limpiar todo el proceso.');
            });
    }

    resetearFormulario() {
        this.datos = { documentoIdentidad: '', nombres: '', apellidos: '', fechaNacimiento: '', correo: '' };
        this.carrerasSeleccionadas = [null, null, null];
        this.errorMensaje = '';
        this._dibujar();
        const form = this._root.querySelector('form');
        if (form) {
            form.reset();
        }
        this.limpiarSelectoresCarrera();
    }

    limpiarSelectoresCarrera() {
        this._root.querySelectorAll('selector-buscador').forEach(selector => {
            if (typeof selector.limpiar === 'function') {
                selector.limpiar();
            }
        });
    }
    
    registrar(e) {
        e.preventDefault();
        this.errorMensaje = '';

        const documentoIdentidad = this.datos.documentoIdentidad.trim();
        const carrerasElegidas = this.carrerasSeleccionadas.filter(id => id !== null);

        if (carrerasElegidas.length === 0) {
            this.errorMensaje = 'Debes seleccionar al menos tu primera opción de carrera.';
            this._dibujar();
            return;
        }

        if (!this.validarCarrerasUnicas(carrerasElegidas)) {
            this.errorMensaje = 'Las opciones de carrera no pueden repetirse.';
            this._dibujar();
            this.notificar(this.errorMensaje, 'error');
            return;
        }

        this.validarDuplicados(documentoIdentidad)
            .then(usuarioExiste => {
                if (usuarioExiste) {
                    this.errorMensaje = 'DUPLICADO'; 
                    this._dibujar();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return null;
                }

                return this.crearAspirante()
                    .then(idGenerado => {
                        return this.crearOpcionesAspirante(idGenerado)
                            .catch(error => {
                                return this.revertirCreacionAspirante(idGenerado)
                                    .then(() => {
                                        throw error;
                                    });
                            });
                    })
                    .then(() => {
                        this.resetearFormulario();
                        this.notificar('¡Registro exitoso! Bienvenido.', 'exito');
                    });
            })
            .catch(error => {
                this.errorMensaje = error.message || 'Ocurrió un error inesperado al registrar los datos.';
                this._dibujar();
                this.notificar(this.errorMensaje, 'error');
            });
    }

    _template() {
        return html`
            <link rel="stylesheet" href="./estilos/componentes/registro_aspirante.css">

            <div class="registro-wrapper" id="contenedorRegistro">
                <div class="header-titulos">
                    <h1>REGISTRO DE ASPIRANTES</h1>
                    <p>Selecciona hasta tres carreras para tu futuro</p>
                </div>

                ${this.errorMensaje === 'DUPLICADO' ? html`
                    <div class="alerta-error" id="msgErrorDuplicado">
                        <strong>¡Atención!</strong> Ya existe un aspirante registrado con este DUI.<br><br>
                        ¿Olvidaste tus credenciales? <a href="#">RECUPERA TU CUENTA AQUÍ</a>
                    </div>
                ` : this.errorMensaje ? html`
                    <div class="alerta-error" id="msgErrorGeneral">${this.errorMensaje}</div>
                ` : ''}

                <form @submit=${(e) => this.registrar(e)} class="formulario-grid" id="formRegistroAspirante">
                    
                    <div class="columna-izquierda">
                        <div class="tarjeta-seccion">
                            <div class="tarjeta-header">DATOS PERSONALES</div>
                            <div class="tarjeta-body grid-inputs">
                                <input type="text" id="txtDocumentoIdentidad" name="documentoIdentidad" .value=${this.datos.documentoIdentidad} class="form-input col-completa" placeholder="Documento de Identidad (DUI)" required @input=${(e) => this.manejarInput(e)}>
                                
                                <input type="text" id="txtNombres" name="nombres" .value=${this.datos.nombres} class="form-input" placeholder="Nombres Completos" required @input=${(e) => this.manejarInput(e)}>
                                <input type="text" id="txtApellidos" name="apellidos" .value=${this.datos.apellidos} class="form-input" placeholder="Apellidos Completos" required @input=${(e) => this.manejarInput(e)}>
                                
                                <input type="date" id="txtFechaNacimiento" name="fechaNacimiento" .value=${this.datos.fechaNacimiento} class="form-input" required @input=${(e) => this.manejarInput(e)}>
                                
                                <input type="email" id="txtCorreo" name="correo" .value=${this.datos.correo} class="form-input col-completa" placeholder="Correo Electrónico" required @input=${(e) => this.manejarInput(e)}>
                            </div>
                        </div>
                    </div>

                    <div class="columna-derecha">
                        <div class="tarjeta-seccion">
                            <div class="tarjeta-header">SELECCIÓN DE CARRERAS</div>
                            <div class="tarjeta-body">
                                
                                <div class="grupo-carrera">
                                    <label>Prioridad 1</label>
                                    <selector-buscador 
                                        id="selCarrera1"
                                        placeholder="-- Elige tu primera opción --"
                                        .datos=${this.catalogoCarreras}
                                        @seleccion-cambiada=${(e) => this.manejarSeleccionCarrera(0, e)}>
                                    </selector-buscador>
                                </div>

                                <div class="grupo-carrera">
                                    <label>Prioridad 2 (Opcional)</label>
                                    <selector-buscador 
                                        id="selCarrera2"
                                        placeholder="-- Elige tu segunda opción --"
                                        .datos=${this.catalogoCarreras}
                                        @seleccion-cambiada=${(e) => this.manejarSeleccionCarrera(1, e)}>
                                    </selector-buscador>
                                </div>

                                <div class="grupo-carrera">
                                    <label>Prioridad 3 (Opcional)</label>
                                    <selector-buscador 
                                        id="selCarrera3"
                                        placeholder="-- Elige tu tercera opción --"
                                        .datos=${this.catalogoCarreras}
                                        @seleccion-cambiada=${(e) => this.manejarSeleccionCarrera(2, e)}>
                                    </selector-buscador>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" id="btnRegistrar" class="btn-registrar">REGISTRARME COMO ASPIRANTE</button>
                        <p class="login-link">
                            ¿Ya tienes una cuenta? <a href="#">¡Inicia sesión o RECUPERA TU CUENTA AQUÍ!</a>
                        </p>
                    </div>

                </form>
            </div>
        `;
    }

    _dibujar() {
        if (this._root !== undefined) {
            render(this._template(), this._root);
        }
    }
}

customElements.define('registro-aspirante', VistaRegistroAspirante);
export default VistaRegistroAspirante;