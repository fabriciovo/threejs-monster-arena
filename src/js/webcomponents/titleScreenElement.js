class TitleScreenElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <h1 id="crosshair">
            MONSTER ARENA
        </h1>
    `;
  }
}

customElements.define("title-screen-element", TitleScreenElement);
