class TabPanel extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._tabs = Array.from(this.querySelectorAll('[slot="tab"]'));
        this._panels = Array.from(this.querySelectorAll('[slot="panel"]'));
        this._selectTab(0);
    }

    selectHandler(event) {
        const index = this._tabs.indexOf(event.target);
        if (index !== -1) {
            this._selectTab(index);
        }
    }
    _selectTab(tabIndex) {
        this._tabs.forEach(t => t.removeAttribute('selected'));
        this._panels.forEach(p => p.removeAttribute('selected'));
        const tab = this._tabs[tabIndex];
        if (!tab) return;
        tab.setAttribute('selected', '');
        const panel = this._panels[tabIndex];
        if (panel) panel.setAttribute('selected', '');
    }

    connectedCallback() {
        let estilo = document.createElement('link');
        estilo.rel = 'stylesheet';
        estilo.href = './estilos/componentes/tab_panel.css';
        this.root.appendChild(estilo);

        let nav=document.createElement('nav');
        let slotTab = document.createElement('slot');
        slotTab.name='tab';
        slotTab.addEventListener('click', (e) => this.selectHandler(e));
        nav.appendChild(slotTab);
        this.root.appendChild(nav);

        let slotPanel = document.createElement('slot');
        slotPanel.name='panel';
        this.root.appendChild(slotPanel);
    }
}

customElements.define('tab-panel', TabPanel);
export default TabPanel;