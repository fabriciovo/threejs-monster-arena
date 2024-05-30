class MonsterList extends HTMLElement {
  constructor() {
    super();
    this.monsters = [
      { name: "Object 1" },
      { name: "Object 2" },
      { name: "Object 3" },
    ];
    this.container = document.createElement("div");
    this.appendChild(this.container);
  }
  static get observedAttributes() {
    return ["monsters"];
  }

  connectedCallback() {
    this.renderMonsters();
  }

  renderMonsters() {
    this.container.innerHTML = "";

    this.monsters.forEach((monster) => {
      const listItem = document.createElement("div");
      listItem.textContent = ` ${monster.name}`;
      listItem.className = "btn";
      this.container.appendChild(listItem);
    });
  }
}

customElements.define("monster-list-element", MonsterList);
