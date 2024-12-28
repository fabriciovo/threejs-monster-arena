import * as THREE from "three";
import { EventDispatcher } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loaderFBX } from "../../utils/loader";
import { Enemy, player } from "../../utils/monsters";
import { EnemyTurn, PlayerTurn } from "../../utils/utils";
import Monster from "../monster";

export default class BattleScene {
  constructor(_selectedMonsterName) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this.objects = [];
    this._deltaTime = null;
    this.Events = {};
    this.Turn = true;
    this._loading = false;
    this._gameElement = undefined;
    this._loadingElement = undefined;

    this.PlayerContainer = undefined;
    this.EnemyContainer = undefined;

    this.Player = player;
    this.Enemy = Enemy;

    this.MonsterPlayer = undefined;
    this.MonsterEnemy = undefined;

    this._selectedMonsterName = _selectedMonsterName;

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
    window.addEventListener("resize", this._onWindowResize.bind(this));
  }
  _document() {
    this._gameElement = document.getElementById("game");
    this._loadingElement = document.createElement("loading");
    this._gameElement.appendChild(this._loadingElement);
  }

  _events() {
    this.Events["enemyDamage"] = new EventDispatcher();
    this.Events["playerDamage"] = new EventDispatcher();
    this.Events["changeTurn"] = new EventDispatcher();
    this.Events["hp"] = new EventDispatcher();

    this.Events["monsterPlayerHpChanged"] = new EventDispatcher();
    this.Events["monsterEnemyHpChanged"] = new EventDispatcher();
    this.Events["monsterName"] = new EventDispatcher();
  }

  _addListener() {
    this.Events["changeTurn"].addEventListener("changeTurn", (e) => {
      this.Turn = !this.Turn;
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
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
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

    const mapC = textureLoader.load("trainer.png");
    const materialC = new THREE.SpriteMaterial({
      map: mapC,
      color: 0xffffff,
      fog: true,
    });
    const sprite = new THREE.Sprite(materialC);

    sprite.position.set(0, 100, 0);
    sprite.position.normalize();
    this.scene.add(sprite);
  }

  async _createObject() {
    const arena = await loaderFBX("assets/arena.fbx");

    this.MonsterPlayer = new Monster(
      this.scene,
      { x: 5, y: 0.1, z: 3 },
      3,
      1,
      this.Events,
      {name: "Mage"},
      true
    );
    this.MonsterEnemy = new Monster(
      this.scene,
      { x: -5, y: 0.1, z: -3 },
      -6.3,
      1,
      this.Events,
      {name: "Skeleton_Warrior"},
      false
    );

    this.objects.push(this.MonsterPlayer);
    this.objects.push(this.MonsterEnemy);
    this.scene.add(arena);

    const battleMenu = document.createElement("battle-menu");
    this._gameElement.remove(this._loadingElement);
    this._gameElement.appendChild(battleMenu)
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  SceneLoop() {
    requestAnimationFrame((t) => {
      if (this._deltaTime === null) {
        this._deltaTime = t;
      }

      this.SceneLoop();
      this.controls.update();

      this.objects.forEach((element) =>
        element.Update(t - this._deltaTime, this.Turn)
      );

      if (this.Turn) {
        //PlayerTurn();
      } else {
        //EnemyTurn();
      }

      this._render();
      this._deltaTime = t;
    });
  }

  InitScene() {
    this.SceneLoop();
  }
}
