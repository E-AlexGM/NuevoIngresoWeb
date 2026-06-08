import { html, render } from '../lib/lit-html/lit-html.js';
import Aspirante from '../entity/aspirante.js';
import AspiranteDAO from '../control/aspirante_dao.js';
import CarreraDAO from '../control/carrera_dao.js';
import AspiranteOpcion from '../entity/aspirante_opcion.js';
import AspiranteOpcionDAO from '../control/aspirante_opcion_dao.js';

import './componentes/notificacion_toast.js';
import './componentes/datos_componente.js';
import './componentes/seleccion_carreras.js';

class VistaRegistroAspirante extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this.aspiranteDAO = new AspiranteDAO();
        this.carreraDAO = new CarreraDAO();
        
        // El estado central
        this.datos = { documentoIdentidad: '', nombres: '', apellidos: '', fechaNacimiento: '', correo: '' };
        this.carrerasSeleccionadas = [null, null, null]; 
        this.errorMensaje = '';
        this.catalogoCarreras = [];
        this.errorCargaDatos = false;
    }

    connectedCallback() {
        this._dibujar();
        this.cargarCarreras();
    }

    cargarCarreras() {
        this.carreraDAO.findRange(0, 50)
            .then(respuesta => {
                if (respuesta && Array.isArray(respuesta.datos)) {
                    this.catalogoCarreras = respuesta.datos.map(carrera => ({ id: carrera.codigo, texto: carrera.nombre }));
                    this._dibujar();
                }
            })
            .catch(error => {
                this.errorCargaDatos = true;
                this._dibujar();
            });
    }

    // ======= LISTENERS PARA LOS EVENTOS BUBBLED =======
    actualizarDatosPersonales(e) {
        const { campo, valor } = e.detail;
        this.datos[campo] = valor;
    }

    actualizarCarreras(e) {
        this.carrerasSeleccionadas = e.detail.carreras;
    }

    notificar(mensaje, tipo) {
        window.dispatchEvent(new CustomEvent('lanzar-notificacion', { detail: { mensaje, tipo } }));
    }

    validarMayorDeDiezAnios(fechaNacimiento) {
        if (!fechaNacimiento) return false;
        const fechaNac = new Date(fechaNacimiento);
        const fechaActual = new Date();
        let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
        const mesDiferencia = fechaActual.getMonth() - fechaNac.getMonth();
        if (mesDiferencia < 0 || (mesDiferencia === 0 && fechaActual.getDate() < fechaNac.getDate())) edad--;
        return edad >= 10;
    }

    validarDuplicados(correo) {
        return this.aspiranteDAO.findByEmail(correo.trim())
            .then(() => true)
            .catch(error => {
                if (error.mensaje && error.mensaje.includes('404')) return false;
                throw new Error('Error al verificar duplicados');
            });
    }

    validarCarrerasUnicas(carrerasElegidas) {
        const carrerasNormalizadas = carrerasElegidas.map(c => String(c).trim());
        return carrerasNormalizadas.length === new Set(carrerasNormalizadas).size;
    }

    crearAspirante() {
        const nuevoAspirante = new Aspirante();
        Object.assign(nuevoAspirante, this.datos);
        nuevoAspirante.documentoIdentidad = this.datos.documentoIdentidad.trim();
        nuevoAspirante.fechaCreacion = new Date().toISOString();
        
        return this.aspiranteDAO.create(nuevoAspirante).then(res => res?.datos?.id || res?.datos?.location?.split('/').pop());
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
                
                return opcionDAO.create(nuevaOpcion).then(res => {
                    opcionesCreadas.push(res?.datos?.id || res?.datos?.location?.split('/').pop());
                    return opcionesCreadas;
                });
            });
        }, Promise.resolve([]));
    }

    revertirCreacionAspirante(idAspiranteGenerado, opcionesCreadas = []) {
        const opcionDAO = new AspiranteOpcionDAO(idAspiranteGenerado);
        return [...opcionesCreadas].reverse().reduce((cadena, idOpcion) => {
            return cadena.then(() => idOpcion ? opcionDAO.delete(idOpcion).catch(console.error) : undefined);
        }, Promise.resolve())
        .then(() => this.aspiranteDAO.delete(idAspiranteGenerado))
        .catch(() => { throw new Error('Ocurrió un error al deshacer el registro.'); });
    }

    resetearFormulario() {
        this.datos = { documentoIdentidad: '', nombres: '', apellidos: '', fechaNacimiento: '', correo: '' };
        this.carrerasSeleccionadas = [null, null, null];
        this.errorMensaje = '';
        const formDatos = this._root.querySelector('form-datos-personales');
        if (formDatos && typeof formDatos.limpiar === 'function') formDatos.limpiar();
        const formCarreras = this._root.querySelector('form-seleccion-carreras');
        if (formCarreras) formCarreras.limpiar();
        
        this._dibujar();
    }

    registrar(e) {
        e.preventDefault();
        this.errorMensaje = '';
        const formDatos = this._root.querySelector('form-datos-personales');
        if (formDatos && !formDatos.validar()) {
            return;
        }
        const correo = this.datos.correo;
        const carrerasElegidas = this.carrerasSeleccionadas.filter(id => id !== null);

        if (!this.validarMayorDeDiezAnios(this.datos.fechaNacimiento)) {
            this.errorMensaje = 'El aspirante debe tener al menos 10 años de edad para registrarse.';
            this._dibujar(); return;
        }

        if (carrerasElegidas.length === 0) {
            this.errorMensaje = 'Debes seleccionar al menos tu primera opción de carrera.';
            this._dibujar(); return;
        }

        if (!this.validarCarrerasUnicas(carrerasElegidas)) {
            this.errorMensaje = 'Las opciones de carrera no pueden repetirse.';
            this._dibujar(); return;
        }

        this.validarDuplicados(correo)
            .then(esDuplicado => {
                if (esDuplicado) {
                    this.errorMensaje = 'DUPLICADO';
                    this._dibujar();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return Promise.reject(new Error('DUPLICADO')); 
                }
                return this.crearAspirante();
            })
            .then(idGenerado => this.crearOpcionesAspirante(idGenerado).catch(error => this.revertirCreacionAspirante(idGenerado).then(() => { throw error; })))
            .then(() => {
                this.resetearFormulario();
                this.notificar('¡Registro exitoso! Bienvenido.', 'exito');
            })
            .catch(error => {
                if (error.message !== 'DUPLICADO') this.notificar(error.message || 'Error al procesar el registro', 'error');
            });
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

        return html`
            <link rel="stylesheet" href="./estilos/componentes/registro_aspirante.css">

            <div class="registro-wrapper" id="contenedorRegistro">

                ${this.errorMensaje === 'DUPLICADO' ? html`
                    <div class="alerta-error">
                        <strong>¡Atención!</strong> Ya existe un aspirante registrado con este correo.<br><br>
                        ¿Olvidaste tus credenciales? <a href="#">RECUPERA TU CUENTA AQUÍ</a>
                    </div>
                ` : this.errorMensaje ? html`<div class="alerta-error">${this.errorMensaje}</div>` : ''}

                <form @submit=${(e) => this.registrar(e)} class="formulario-grid">
                    
                    <div class="columna-izquierda">
                        <form-datos-personales 
                            .datos=${this.datos} 
                            @datos-actualizados=${(e) => this.actualizarDatosPersonales(e)}>
                        </form-datos-personales>
                    </div>

                    <div class="columna-derecha">
                        <form-seleccion-carreras 
                            .catalogo=${this.catalogoCarreras}
                            @carreras-actualizadas=${(e) => this.actualizarCarreras(e)}>
                        </form-seleccion-carreras>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-registrar">REGISTRARME COMO ASPIRANTE</button>
                        <p class="login-link">¿Ya tienes una cuenta? <a href="#">¡Inicia sesión o RECUPERA TU CUENTA AQUÍ!</a></p>
                    </div>

                </form>
            </div>
        `;
    }

    _dibujar() { if (this._root) render(this._template(), this._root); }
}

customElements.define('registro-aspirante', VistaRegistroAspirante);
export default VistaRegistroAspirante;