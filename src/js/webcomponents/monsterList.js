class MonsterList extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
      .select-monster-container {
        position: fixed;
        display: flex;
        top:25%;
      }
      .select-monster-card-container {
        position: fixed;
        top:25%;
      }
      .selected-monster {
        position: fixed;
        left: 15%;
        color:white;
      }
      .btn {
        width: 128px;
        height: 128px;
        border-radius: 25px;
        text-align: start;
        padding-left: 24px;
        font-weight: 600;
        background: black;
        color: white;
        font-size: 24px;
        font-family: Nunito;
        border: white 6px solid;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .btn:hover {
          cursor: pointer;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
          transform: scale(1);
          animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
        }
  
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }
  
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
      }

      </style>
      <div class="select-monster-container">
        <div class="select-monster-card-container"></div>
        <div class="selected-monster"></div>
      </div>
    `;

    this.monsters = [
      {
        name: "Bat",
      },
      {
        name: "Dragon",
      },
      {
        name: "Skeleton",
      },
      {
        name: "Slime",
      },
    ];
    this.selectedMonster = {};
    this.selectMonsterContainerCard = this.shadowRoot.querySelector(
      ".select-monster-card-container"
    );
  }

  static get observedAttributes() {
    return ["monsters"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "monsters") {
      this.monsters = JSON.parse(newValue);
      this.renderMonsters();
    }
  }

  connectedCallback() {
    this.renderMonsters();
  }

  renderMonsters() {
    this.selectMonsterContainerCard.innerHTML = "";
    this.monsters.forEach((monster, index) => {
      const listItem = document.createElement("div");
      listItem.textContent = `${monster.name}`;
      listItem.className = "btn";
      listItem.dataset.index = index;
      listItem.addEventListener("click", () => {
        this.selectedMonster = monster;
        this.renderSelectedMonster();
        this.dispatchEvent(
          new CustomEvent("changeMonster", {
            bubbles: true,
            detail: { monster: this.selectedMonster },
          })
        );
      });
      this.selectMonsterContainerCard.appendChild(listItem);
    });
    this.renderSelectedMonster();
  }

  renderSelectedMonster() {
    const selectedMonsterContainer =
      this.shadowRoot.querySelector(".selected-monster");
    selectedMonsterContainer.textContent = `Selected Monster: ${
      this.selectedMonster?.name || ""
    }`;
  }
}

customElements.define("monster-list-element", MonsterList);
