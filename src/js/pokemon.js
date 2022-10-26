import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default class Pokemon {
    constructor(name, scene, position, rotation) {
        this._name = name;
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
        this._init();
    }


    _init() {
        this._loader();
        this._addListeners();
    }

    _addListeners() {
        document.getElementById('attack1').addEventListener('click', (e) => this._cahngeAnimation("walk"), false);
        document.getElementById('attack2').addEventListener('click', (e) => this._cahngeAnimation("dance"), false);
    }


    _cahngeAnimation(state) {
        this._animations[this._state].action.stop();
        this._change = true;
        this._state = state;

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
            this._target.position.z = 3
            this._target.position.y = 0.1
            this._target.rotation.y = 3
            this._scene.add(this._target);

            this._mixer = new THREE.AnimationMixer(this._target);

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
            loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
            loader.load('run.fbx', (a) => { _OnLoad('run', a); });
            loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
            loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });

        });
    }

    Update(timeElapsed) {
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
}