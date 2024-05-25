class TitleScreenElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <div style="position:absolute;">
        <h1>
            MONSTER ARENA
        </h1>
        <button id="start-game">Start game</button>
      </div>
    `;

    const startButton = this.shadowRoot.getElementById("start-game");
    startButton.addEventListener("startgame", () => {
     
    });
  }
}

customElements.define("title-screen-element", TitleScreenElement);
