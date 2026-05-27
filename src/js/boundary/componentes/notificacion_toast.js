import { html, render } from '../../lib/lit-html/lit-html.js';

class NotificacionToast extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.mensaje = '';
        this.tipo = 'exito'; // Puede ser: 'exito', 'error', 'info'
        this.visible = false;
        this.timeout = null;
    }

    connectedCallback() {
        this.dibujar();
        
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
        this.dibujar();

        // Limpiamos cualquier temporizador previo para que no se oculte antes de tiempo
        if (this.timeout) clearTimeout(this.timeout);

        // Ocultar automáticamente después de 3 segundos
        this.timeout = setTimeout(() => {
            this.visible = false;
            this.dibujar();
        }, 3000);
    }

    // Retorna un emoji dependiendo del tipo, para hacerlo visualmente claro
    obtenerIcono() {
        switch(this.tipo) {
            case 'exito': return '✅';
            case 'error': return '❌';
            case 'advertencia': return '⚠️';
            default: return 'ℹ️';
        }
    }

    template() {
        if (!this.visible) return html``;

        return html`
            <link rel="stylesheet" href="./estilos/componentes/notificacion_toast.css">
            <div class="toast-container">
                <div class="toast ${this.tipo} animacion-entrar">
                    <span class="icono">${this.obtenerIcono()}</span>
                    <span class="texto">${this.mensaje}</span>
                </div>
            </div>
        `;
    }

    dibujar() {
        render(this.template(), this.root);
    }
}

customElements.define('notificacion-toast', NotificacionToast);
export default NotificacionToast;