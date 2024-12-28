import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { EnemyTurn } from "../utils/utils";
import { loaderFBX } from "../utils/loader";

const ENUM_ANIMATIONS = {
  IDLE: 'Idle',
  ATTACK_1: 2,
  ATTACK_2: 3,
  HIT: 4,
  DEATH: 5,
}

export default class Monster {
  constructor(scene, position, rotation, scale, events, information, isPlayer) {
    this._maxHp = information.life;
    this._hp = this._maxHp;
    this._scene = scene;
    this._position = position;
    this._rotation = rotation;
    this._scale = scale;
    this._events = events;
    this._information = information;
    this._isPlayer = isPlayer;
    this._mixer = undefined;
    this._manager = undefined;
    this._model = undefined;
    this._htmlContainer = undefined;
    this._play = false;
    this.change = false;
    this._enemyPlayed = false;

    this._state = "Idle";

    this.particles = [];
    this._animation_map = new Map();
    console.log(this._animation_map)

    console.log(information);
    this._init();
  }

  async _init() {
    await this._loader();
    this._addListeners();
    this._createHtmlContainer();
  }

  _addListeners() {
    if (this._isPlayer) {
      //player events
      document.getElementById("attack1").addEventListener(
        "click",
        () => {
          this._changeAnimation("attack1");
          EnemyTurn();
        },
        false
      );
      document.getElementById("attack2").addEventListener(
        "click",
        () => {
          this._changeAnimation("attack2");
          EnemyTurn();
        },
        false
      );
      document.getElementById("item1").addEventListener(
        "click",
        () => {
          this._createEffect("item1");
          EnemyTurn();
        },
        false
      );
      document.getElementById("item2").addEventListener(
        "click",
        () => {
          this._createEffect("item1");
          EnemyTurn();
        },
        false
      );
      this._events["enemyDamage"].addEventListener(
        "enemyDamage",
        () => {
          this._changeAnimation("damage");
        },
        false
      );
      this._events["monsterPlayerHpChanged"].addEventListener(
        "monsterPlayerHpChanged",
        (e) => this._damage(e.damage)
      );
    } else {
      //Enemy events
      this._events["playerDamage"].addEventListener(
        "playerDamage",
        () => {
          this._changeAnimation("damage");
        },
        false
      );
      this._events["monsterEnemyHpChanged"].addEventListener(
        "monsterEnemyHpChanged",
        (e) => {
          this._damage(e.damage);
          this._changeAnimation("idle");
          const t = setTimeout(() => {
            this._changeAnimation("attack1");
            clearTimeout(t);
          }, 2000);
        }
      );
    }
  }

  _changeAnimation(state) {
    this._animation_map.get(state).action.fadeOut(1);
    this._animation_map.get(state).action.reset();
    this._animation_map.get(state).action.fadeIn(1);
    this._animation_map.get(state).action.play();
    this._change = true;
    this._state = state;
    if (this._state !== "Idle") {
      this._animation_map.get(this._state).action.setLoop(THREE.LoopOnce);
      this._animation_map.get(this._state).action.clampWhenFinished = true;
    } else {
      this._animation_map.get(this._state).action.setLoop(true);
    }
  }

  async _loader() {
    this._model = await loaderFBX(`/assets/monsters/${this._information.name}.fbx`);

    this._model.traverse((c) => {
      c.castShadow = true;
    });

    this._model.scale.x = this._scale;
    this._model.scale.y = this._scale;
    this._model.scale.z = this._scale;

    this._model.position.z = this._position.z;
    this._model.position.y = this._position.y;

    this._model.rotation.y = this._rotation;

    this._mixer = new THREE.AnimationMixer(this._model);
    this._model.animations.forEach(animation => {
      this._animation_map.set(animation.name, animation);
    })
    const action = this._mixer.clipAction(this._animation_map.get('Idle'));
    action.play();

    this._scene.add(this._model);

    // this._mixer.addEventListener("finished", () => {
    //   if (this._state === "attack1" || this._state === "attack2") {
    //     const eventName = this._isPlayer ? "playerDamage" : "enemyDamage";
    //     this._events[eventName].dispatchEvent({ type: eventName });
    //     this._events["changeTurn"].dispatchEvent({ type: "changeTurn" });
    //   }

    //   if (this._state === "damage" && !this._isPlayer) {
    //     this._events["monsterEnemyHpChanged"].dispatchEvent({
    //       type: "monsterEnemyHpChanged",
    //       damage: this._information.damage,
    //     });
    //   } else if (this._state === "damage" && this._isPlayer) {
    //     this._events["monsterPlayerHpChanged"].dispatchEvent({
    //       type: "monsterPlayerHpChanged",
    //       damage: this._information.damage,
    //     });
    //     this._changeAnimation("idle");
    //   } else {
    //     this._changeAnimation("idle");
    //   }
    // });

    // this._manager = new THREE.LoadingManager();
    // this._manager.onLoad = () => {
    //   this._state = "idle";
    // };

    // const _OnLoad = (animName, anim) => {
    //   const clip = anim.animations[0];
    //   const action = this._mixer.clipAction(clip);

    //   this._animations[animName] = {
    //     clip: clip,
    //     action: action,
    //   };
    // };

    // const path = this._information.animationType
    //   ? `./assets/monsters/humanoid/`
    //   : `./assets/monsters/${this._information.name}/`;
    // const anim = this._information.animationType
    //   ? "humanoid"
    //   : `${this._information.name}`;
    // const loader = new FBXLoader(this._manager);
    // loader.setPath(path);
    // loader.load(`${anim}_idle.fbx`, (a) => {
    //   _OnLoad("idle", a);
    // });
    // loader.load(`${anim}_attack1.fbx`, (a) => {
    //   _OnLoad("attack1", a);
    // });
    // loader.load(`${anim}_attack2.fbx`, (a) => {
    //   _OnLoad("attack2", a);
    // });
    // loader.load(`${anim}_damage.fbx`, (a) => {
    //   _OnLoad("damage", a);
    // });
    // });
  }

  _damage(value) {
    this._hp -= value;
  }

  _createEffect() { }

  _updatePlayer(timeElapsed) {
    if (!this._animations_map?.get(this._state)) return;
    if (this._mixer) {
      const timeElapsedS = timeElapsed * 0.001;
      this._mixer.update(timeElapsedS);
    }
    if (!this._play) {
      this._animations_map.get(this._state).action.play();
      this._play = true;
    }

    if (this._change) {
      this._change = false;
      this._play = false;
    }
  }

  _updateEnemy(timeElapsed) {
    if (this._mixer) {
      const timeElapsedS = timeElapsed * 0.001;
      this._mixer.update(timeElapsedS);
    }

    if (this._animations?.get(this._state) && !this._play) {
      this._animations?.get(this._state).action.play();
      this._play = true;
    }

    if (this._change) {
      this._change = false;
      this._play = false;
    }
  }

  _createHtmlContainer() {
    this._htmlContainer = document.createElement("div");
    if (this._isPlayer) {
      this._htmlContainer.classList = "playerContainer";
      this._htmlContainer.innerHTML = `
            <span style="position: absolute;">${this._information.name}</span>
            <div>
                <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">100/100</span>
            </div>`;
    } else {
      this._htmlContainer.classList = "enemyContainer";
      this._htmlContainer.innerHTML = `
            <span style="position: absolute;">${this._information.name}</span>
            <div>
                <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">${this._hp}/${this._maxHp}</span>
            </div>`;
    }
    document.body.appendChild(this._htmlContainer);
  }

  _updateHtmlContainer() {
    this._htmlContainer.innerHTML = `
        <span style="position: absolute;margin-top:10%">${this._isPlayer ? "Player" : "Enemy"}</span>
        <span style="position: absolute;">${this._information.name}</span>
        <div>
            <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">${this._hp}/${this._maxHp}</span>
        </div>`;
  }

  Update(timeElapsed, turn) {
    if (!this._model) return;
    if (this._isPlayer) {
      this._updatePlayer(timeElapsed);
    } else if (!this._isPlayer) {
      this._updateEnemy(timeElapsed, turn);
    }

    this._updateHtmlContainer();
    this.particles.forEach((particle) => particle.update());
  }
}
