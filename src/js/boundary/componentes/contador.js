import {html, render} from '../../lib/lit-html/lit-html.js';


class Contador extends HTMLElement {
    constructor() {
        super();
        this.valor = 0;
        this.root=this.attachShadow({mode: 'open'});
        this.intervalId = undefined;
    }
    connectedCallback() {
        this.div = document.createElement('div');
        this.div.id = 'contador';
        this.root.appendChild(this.div);
        // this.div.textContent = `Contador: ${this.valor}`;
        /*
        this.intervalId = setInterval(() => {
            this.aumentarContador();
        }, 1000);*/
    }

    disconnectedCallback() {
        // clearInterval(this.intervalId);
    }

    aumentarContador() {
        // this.valor++;
        this.contador++;
        // this.div.textContent = `Contador: ${this.valor}`;
    }

    get contador() {
        return this.valor;
    }

    set contador(value) {
        this.valor = value;
        this.setAttribute('contador', value);
    }

    _plantilla(){
        return html `Contador: ${this.contador}`;
    }

    static observedAttributes = ['contador'];
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'contador') {
            this.valor = parseInt(newValue);
            if(this.div!==undefined){
                //this.div.textContent = `Contador: ${this.valor}`;
                let evento = new CustomEvent('contador-cambiado', {
                    composed: true,
                    bubbles: true,
                    detail: { 
                        contador: this.valor,
                        origen: this.id
                    }
                });
                this.dispatchEvent(evento);
                render(this._plantilla(), this.div);
            }
        }
    }

}

export default Contador;

customElements.define('chepe-contador', Contador); // debe de llevar un guion para ser reconocido como un componente web válido