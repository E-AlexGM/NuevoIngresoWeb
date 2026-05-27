import { html, render } from "../lib/lit-html/lit-html.js";
import CardComponent from "./componentes/card_component.js";
import CarreraDAO from "../control/carrera_dao.js";

class RegistroAspirante extends HTMLElement {

  /**carreraList = [
    {
        nombre: "Ingeniería en Sistemas",
        imagen: "./img/carreras/I30515.jpeg",
        url: "./registro_aspirante.html?carrera=IS",
    },
    {
        nombre: "Ingeniería Industrial",
        imagen: "./img/carreras/I30501.jpeg",
        url: "./registro_aspirante.html?carrera=II",

    }
  ];*/

  carreraList = [];

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    /**if("serviceWorker" in navigator){
            navigator.serviceWorker.register('../../service_worker.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.error('Error al registrar el Service Worker:', error);
            });
        }*/
    this.carreraDAO = new CarreraDAO();
  }

  connectedCallback() {
    this.carreraDAO
      .findRange(0, 10)
      .then((carreras) => {
        carreras.datos.forEach((carrera) => {
          this.carreraList.push({
            nombre: carrera.nombre,
            imagen: `./img/carreras/${carrera.codigo}.jpeg`,
            url: `./registro_aspirante.html?carrera=${carrera.codigo}`,
          });
        });
        this.dibujar();
      })
      .catch((error) => {
        console.error("Error al cargar las carreras:", error.mensaje);
        alert(
          "Error al cargar las carreras. Por favor, inténtelo de nuevo más tarde.",
        );
      });

    // Puedes descomentar esto si quieres que pinte un contenedor vacío mientras carga
    // this.dibujar();
  }

  _template() {
    return html`
      <link
        rel="stylesheet"
        href="./estilos/componentes/registro_aspirante.css"
      />
      <div class="container">
        ${this.carreraList.map(
          (carrera) => html`
            <card-component
              nombre="${carrera.nombre}"
              imagen="${carrera.imagen}"
              url="${carrera.url}"
            >
            </card-component>
          `,
        )}
      </div>
    `;
  }

  dibujar() {
    render(this._template(), this.root);
  }
}

customElements.define("registro-aspirante", RegistroAspirante);
export default RegistroAspirante;
