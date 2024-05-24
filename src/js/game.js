import * as THREE from 'three';
import { EventDispatcher } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { loaderFBX } from '../utils/loader';
import { Enemy, player } from '../utils/pokemons';
import { EnemyTurn, PlayerTurn } from '../utils/utils';
import Pokemon from './pokemon';

export default class Game {
    constructor() {
        this.scene = undefined;
        this.camera = undefined;
        this.renderer = undefined;
        this.controls = undefined;
        this.objects = [];
        this._deltaTime = null;
        this.Events = {};
        this.Turn = true;


        this.PlayerContainer = undefined;
        this.EnemyContainer = undefined;

        this.Player = player;
        this.Enemy = Enemy;

        this.PokemonPlayer = undefined;
        this.PokemonEnemy = undefined;

        this._init();
    }

    _init() {
        this._document();
        this._events();
        this._addListener();
        this._renderer();
        this._scene();
        this._camera();
        this._controls();
        this._light();
        this._createObject();
        //this._createSprites();
        window.addEventListener('resize', this._onWindowResize.bind(this));
    }
    _document() {
        // document.getElementById("attacks").className = "none";
        // document.getElementById("items").className = "none";
    }

    _events() {
        this.Events['enemyDamage'] = new EventDispatcher();
        this.Events['playerDamage'] = new EventDispatcher();
        this.Events['changeTurn'] = new EventDispatcher();
        this.Events['hp'] = new EventDispatcher();

        this.Events['pokemonPlayerHpChanged'] = new EventDispatcher();
        this.Events['pokemonEnemyHpChanged'] = new EventDispatcher();
        this.Events['pokemonName'] = new EventDispatcher();

    }

    _addListener() {
        this.Events['changeTurn'].addEventListener('changeTurn', (e) => {
            this.Turn = !this.Turn
            if (this.Turn) {
                PlayerTurn();
            } else {
                EnemyTurn();
            }
        });
    }

    _renderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById("app"),
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _scene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcccccc);
        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    }

    _camera() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(400, 200, 0);
    }


    _controls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 8;
        this.controls.autoRotate = false;

    }


    _light() {
        const dirLight1 = new THREE.HemisphereLight(0xffffff, 0x444444);
        dirLight1.position.set(0, 200, 0);
        this.scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x002288);
        dirLight2.position.set(-1, -1, -1);
        this.scene.add(dirLight2);

        const ambientLight = new THREE.AmbientLight(0x222222);
        this.scene.add(ambientLight);
    }

    _render() {
        this.renderer.render(this.scene, this.camera);
    }

    _createSprites() {
        const textureLoader = new THREE.TextureLoader();

        const mapC = textureLoader.load('trainer.png');
        const materialC = new THREE.SpriteMaterial({ map: mapC, color: 0xffffff, fog: true });
        const sprite = new THREE.Sprite(materialC);

        sprite.position.set(0, 100, 0);
        sprite.position.normalize();
        this.scene.add(sprite);
    }

    async _createObject() {
        const arena = await loaderFBX('assets/arena.fbx')

        this.PokemonPlayer = new Pokemon(this.scene, { x: 5, y: 0.1, z: 0 }, 11, 0.01, this.Events, this.Player.selectedPokemon, true);
        this.PokemonEnemy = new Pokemon(this.scene, { x: 0, y: 0.1, z: -3 }, 0, 0.01,this.Events, this.Enemy.selectedPokemon, false);


        this.objects.push(this.PokemonPlayer)
        this.objects.push(this.PokemonEnemy)
        this.scene.add(arena)
    }


    _onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    StartBattle(){
        requestAnimationFrame((t) => {
            if (this._deltaTime === null) {
                this._deltaTime = t;
            }

            this.StartBattle();
            this.controls.update();

            this.objects.forEach(element => element.Update(t - this._deltaTime, this.Turn));


            if (this.Turn) {
                //PlayerTurn();
            } else {
                //EnemyTurn();
            }

            this._render();
            this._deltaTime = t;
        });
    }


    _initBattle() {
        this.StartBattle()
    }
}