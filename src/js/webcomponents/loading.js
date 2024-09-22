class Loading extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <div style="position:absolute; height:100vh; width:100vw; background: black; opacity: 0.5; z-index:10000;">
        <h1>
            LOADING....
        </h1>
      </div>
    `;
  }
}

customElements.define("loading-element", Loading);
