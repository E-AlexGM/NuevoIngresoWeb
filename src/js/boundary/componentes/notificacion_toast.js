import { html, render } from '../../lib/lit-html/lit-html.js';

class NotificacionToast extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this.mensaje = '';
        this.tipo = 'exito'; // Puede ser: 'exito', 'error', 'info'
        this.visible = false;
        this.timeout = null;
    }

    connectedCallback() {
        this._dibujar();
        
        // Hacemos que el componente escuche eventos globales
        window.addEventListener('lanzar-notificacion', (evento) => {
            this.mostrar(evento.detail.mensaje, evento.detail.tipo);
        });
    }

    // Método principal para activar la notificación
    mostrar(mensaje, tipo = 'exito') {
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.visible = true;
        this._dibujar();

        // Limpiamos cualquier temporizador previo para que no se oculte antes de tiempo
        if (this.timeout) clearTimeout(this.timeout);

        // Ocultar automáticamente después de 3 segundos
        this.timeout = setTimeout(() => {
            this.visible = false;
            this._dibujar();
        }, 3000);
    }

    // Retorna un emoji dependiendo del tipo de notificación
    obtenerIcono() {
        switch(this.tipo) {
            case 'exito': return '✅';
            case 'error': return '❌';
            case 'advertencia': return '⚠️';
            default: return 'ℹ️';
        }
    }

    _template() {
        if (!this.visible) return html``;

        return html`
            <link rel="stylesheet" href="./estilos/componentes/notificacion_toast.css">
            <div class="toast-container" id="toastContenedor">
                <div class="toast ${this.tipo} animacion-entrar" id="toastAlerta">
                    <span class="icono" id="toastIcono">${this.obtenerIcono()}</span>
                    <span class="texto" id="toastTexto">${this.mensaje}</span>
                </div>
            </div>
        `;
    }

    _dibujar() {
        render(this._template(), this._root);
    }
}

customElements.define('notificacion-toast', NotificacionToast);
export default NotificacionToast;