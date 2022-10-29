import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Nebula, { SpriteRenderer } from "three-nebula";
import BaseRenderer from "three-nebula";
import fire from "../utils/fire.json"
import { EnemyTurn } from '../utils/utils';

export default class Pokemon {
    constructor(name, scene, position, rotation, events, information, isPlayer) {
        this._name = name;
        this._maxHp = 100;
        this._hp = this._maxHp;
        this._scene = scene;
        this._position = position;
        this._rotation = rotation;
        this._model;
        this._animations = {};
        this._mixer;
        this._manager;
        this._target;
        this._play = false;
        this.change = false;
        this._state = 'idle'
        this._events = events;
        this._information = information;
        this._isPlayer = isPlayer;
        this.particles = [];
        this._enemyPlayed = false;
        this._init();
    }

    _init() {
        this._loader();
        this._addListeners();
        this.CreateElement();
    }

    _addListeners() {
        if (this._isPlayer) {
            //player events
            document.getElementById('attack1').addEventListener('click', (e) => {
                this._cahngeAnimation("attack1");
                EnemyTurn()
            }, false);
            document.getElementById('attack2').addEventListener('click', (e) => {
                this._cahngeAnimation("attack2")
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
            this._events['enemyDamage'].addEventListener('enemyDamage', (e) => this._cahngeAnimation("damage"), false);
        } else {
            //Enemy events
            this._events['playerDamage'].addEventListener('playerDamage', (e) => this._cahngeAnimation("damage"), false);
        }
    }


    _cahngeAnimation(state) {
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
                    this._events[this._information].dispatchEvent({ type: this._information });
                    this._events['changeTurn'].dispatchEvent({ type: "changeTurn" });
                }

                if (this._state === "damage" && !this._isPlayer) {
                    this._cahngeAnimation('attack1')
                } else {

                    this._cahngeAnimation('idle')
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

    UpdatePlayer(timeElapsed) {
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

    UpdateEnemy(timeElapsed, turn) {
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


    Update(timeElapsed, turn) {
        //this.particles.forEach(particle => particle.update())
        if (this._isPlayer) {
            this.UpdatePlayer(timeElapsed)
        } else if (!this._isPlayer) {
            this.UpdateEnemy(timeElapsed, turn)
        }
    }

    CreateElement() {
        this.htmlContainer = document.createElement("div");
        if (this._isPlayer) {
            this.htmlContainer.classList = "playerContainer"
            this.htmlContainer.innerHTML = `
            <span style="position: absolute;">${this._name}</span>
            <div>
                <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">100/100</span>
            </div>`;
        }else{
            this.htmlContainer.classList = "enemyContainer"
            this.htmlContainer.innerHTML = `
            <span style="position: absolute;">${this._name}</span>
            <div>
                <span style="position: absolute; margin-top: 0.5rem; left: 12rem;">${this._hp}/${this._maxHp}</span>
            </div>`;
        }
        document.body.appendChild(this.htmlContainer);
    }
}