import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Nebula, { SpriteRenderer } from "three-nebula";
import BaseRenderer from "three-nebula";
import fire from "../utils/fire.json"
import { EnemyTurn, PlayerTurn } from '../utils/utils';

export default class Pokemon {
    constructor(name, scene, position, rotation, events, information, isPlayer) {
        this._name = name;
        this._maxHp = 100;
        this._hp = this._maxHp;
        this._scene = scene;
        this._position = position;
        this._rotation = rotation;
        this._events = events;
        this._information = information;
        this._isPlayer = isPlayer;


        this._model = undefined;
        this._mixer = undefined;
        this._manager = undefined;
        this._target = undefined;
        this._htmlContainer = undefined

        this._play = false;
        this.change = false;
        this._enemyPlayed = false;

        this._state = 'idle'

        this.particles = [];
        this._animations = {};

        this._init();
    }

    _init() {
        this._loader();
        this._addListeners();
        this._createHtmlContainer();
    }

    _addListeners() {
        if (this._isPlayer) {
            //player events
            document.getElementById('attack1').addEventListener('click', (e) => {
                this._changeAnimation("attack1");
                EnemyTurn()
            }, false);
            document.getElementById('attack2').addEventListener('click', (e) => {
                this._changeAnimation("attack2")
                EnemyTurn()
            }, false);
            document.getElementById('item1').addEventListener('click', (e) => {
                this._createEffect("item1")
                EnemyTurn()
            }, false);
            document.getElementById('item2').addEventListener('click', (e) => {
                this._createEffect("item1")
                EnemyTurn()
            }, false);
            this._events['enemyDamage'].addEventListener('enemyDamage', (e) => { this._changeAnimation("damage"); }, false);
            this._events['pokemonPlayerHpChanged'].addEventListener('pokemonPlayerHpChanged', (e) => this._hp -= 10);

        } else {
            //Enemy events
            this._events['playerDamage'].addEventListener('playerDamage', (e) => { this._changeAnimation("damage"); }, false);
            this._events['pokemonEnemyHpChanged'].addEventListener('pokemonEnemyHpChanged', (e) => this._hp -= 10);
        }
    }


    _changeAnimation(state) {
        this._animations[this._state].action.fadeOut(1);
        this._animations[state].action.reset()
        this._animations[state].action.fadeIn(1)
        this._animations[state].action.play()
        this._change = true;
        this._state = state;
        if (this._state !== "idle") {
            this._animations[this._state].action.setLoop(THREE.LoopOnce)
            this._animations[this._state].action.clampWhenFinished = true
        } else {
            this._animations[this._state].action.setLoop(true)
        }
    }

    _loader() {
        const loader = new FBXLoader();
        loader.setPath(`./assets/pokemons/${this._name}/`);
        loader.load(`${this._name}.fbx`, (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });

            this._target = fbx;

            this._target.scale.x = 0.01
            this._target.scale.y = 0.01
            this._target.scale.z = 0.01

            this._target.position.z = this._position.z;
            this._target.position.y = this._position.y;
            this._target.rotation.y = this._rotation;

            this._scene.add(this._target);

            this._mixer = new THREE.AnimationMixer(this._target);

            this._mixer.addEventListener('finished', () => {
                if (this._state === "attack1") {
                    const eventName = this._isPlayer ? 'playerDamage' : 'enemyDamage'
                    this._events[eventName].dispatchEvent({ type: eventName });
                    this._events['changeTurn'].dispatchEvent({ type: "changeTurn" });
                }

                if (this._state === "damage" && !this._isPlayer) {
                    this._changeAnimation('attack1')
                    this._events['pokemonEnemyHpChanged'].dispatchEvent({ type: "pokemonEnemyHpChanged" });
                } else if (this._state === "damage" && this._isPlayer) {
                    this._events['pokemonPlayerHpChanged'].dispatchEvent({ type: "pokemonPlayerHpChanged" });
                    this._changeAnimation('idle')

                } else {
                    this._changeAnimation('idle')
                }

  
            })


            this._manager = new THREE.LoadingManager();
            this._manager.onLoad = () => {
                this._state = 'idle'
            };


            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this._mixer.clipAction(clip);

                this._animations[animName] = {
                    clip: clip,
                    action: action,
                };

            };
            const loader = new FBXLoader(this._manager);
            loader.setPath(`./assets/pokemons/${this._name}/`);
            loader.load(`${this._name}_idle.fbx`, (a) => { _OnLoad('idle', a); });
            loader.load(`${this._name}_attack1.fbx`, (a) => { _OnLoad('attack1', a); });
            loader.load(`${this._name}_attack2.fbx`, (a) => { _OnLoad('attack2', a); });
            loader.load(`${this._name}_damage.fbx`, (a) => { _OnLoad('damage', a); });
        });
    }

    _createEffect() {
        Nebula.fromJSONAsync(fire, THREE).then(loaded => {
            loaded.emitters.forEach(emitter => {
                emitter.position.y = 0;
                emitter.position.x = 0;
            })
            const nebulaRenderer = new SpriteRenderer(this, THREE);
            const nebula = loaded.addRenderer(nebulaRenderer);
            this.particles.push(nebula);
        });
    }

    _updatePlayer(timeElapsed) {
        if (this._mixer) {
            const timeElapsedS = timeElapsed * 0.001;
            this._mixer.update(timeElapsedS);
        }
        if (this._animations[this._state] && !this._play) {
            this._animations[this._state].action.play();
            this._play = true;
        }

        if (this._change) {
            this._change = false;
            this._play = false;
        }
    }

    _updateEnemy(timeElapsed, turn) {
        console.log(turn)
        if (this._mixer) {
            const timeElapsedS = timeElapsed * 0.001;
            this._mixer.update(timeElapsedS);
        }

        if (this._animations[this._state] && !this._play) {
            this._animations[this._state].action.play();
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
            this._htmlContainer.classList = "playerContainer"
            this._htmlContainer.innerHTML = `
            <span style="position: absolute;">${this._name}</span>
            <div>
                <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">100/100</span>
            </div>`;
        } else {
            this._htmlContainer.classList = "enemyContainer"
            this._htmlContainer.innerHTML = `
            <span style="position: absolute;">${this._name}</span>
            <div>
                <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">${this._hp}/${this._maxHp}</span>
            </div>`;
        }
        document.body.appendChild(this._htmlContainer);
    }

    _updateHtmlContainer() {
        this._htmlContainer.innerHTML = `
        <span style="position: absolute;">${this._name}</span>
        <div>
            <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">${this._hp}/${this._maxHp}</span>
        </div>`;
    }

    Update(timeElapsed, turn) {
        //this.particles.forEach(particle => particle.update())
        if (this._isPlayer) {
            this._updatePlayer(timeElapsed)
        } else if (!this._isPlayer) {
            this._updateEnemy(timeElapsed, turn)
        }

        this._updateHtmlContainer();
    }

}