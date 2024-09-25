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
        background: black;
        width: 50%;
        height: 50%;
      }
      .select-monster-card-container {
        position: fixed;
        top:25%;
        display:flex;
        gap: 8px;
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

      .btn.select-monster {
        position:absolute;
        right:0;
        bottom:10px;
        width:200px;
      }

      </style>
      <div class="select-monster-container">
        <div class="select-monster-card-container"></div>
        <div class="selected-monster"></div>
      </div>
      <button id="start-battle" class="btn select-monster">Select Monster</button>
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

    const startBattleScene = this.shadowRoot.getElementById("start-battle");
    startBattleScene.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("startBattle", { bubbles: true }));
    });
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
      this.selectedMonster?.name || "Bat"
    }`;
  }
}

customElements.define("monster-list-element", MonsterList);
