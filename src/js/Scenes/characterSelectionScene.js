import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loaderFBX } from "../../utils/loader";

export default class CharacterSelectionScene {
  constructor() {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this._lastFrameTime = null;
    this._gameLoop = undefined;
    this._loading = false;
    this.selectedMonster = { name: "Bat", model: undefined };
    this.monsterList = {
      bat: { name: "Bat", model: undefined },
      dragon: { name: "Dragon", model: undefined },
      slime: { name: "Slime", model: undefined },
      skeleton: { name: "Skeleton", model: undefined },
    }
    this._init();

  }

  async _init() {
    this._addWebComponents();
    this._document();
    this._events();
    this._addListener();
    this._renderer();
    this._scene();
    this._camera();
    this._controls();
    this._light();
    this._createObject();
    await this._loadMonsters();
   
    window.addEventListener("resize", this._onWindowResize.bind(this));
  }


  _addWebComponents() {
    this._gameElement = document.getElementById("game");
    const list = document.createElement("monster-list-element");
    const loading = document.createElement("loading-element");
    this._gameElement.appendChild(list);
    // this._gameElement.appendChild(loading);
  }

  _document() {
    //asdsadas
    // document.getElementById("attacks").className = "none";
    // document.getElementById("items").className = "none";
  }

  _events() {
    document.addEventListener("changeMonster", (event) => {
      console.log(event);
      this._loadSelectedMonster(event.detail.monster);
    });
  }

  _addListener() { }

  _renderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById("app"),
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
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
    this.controls.autoRotate = true;
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

  async _createObject() {
    const arena = await loaderFBX("assets/arena.fbx");
    this.scene.add(arena);
  }

  async _loadMonsters() {
    const loadPromises = Object.values(this.monsterList).map(async (monster) => {
      monster.model = await loaderFBX(`assets/monsters/${monster.name}.fbx`);
      monster.model.scale.setScalar(0.005);


      if (monster.model.animations && monster.model.animations.length > 0) {
        monster.mixer = new THREE.AnimationMixer(monster.model);  
        const action = monster.mixer.clipAction(monster.model.animations[0]);
        action.play();
        action.timeScale = 0.2;
      }


    
    });
  
    await Promise.all(loadPromises);
    this.selectedMonster = this.monsterList.bat;
    this.scene.add(this.selectedMonster.model);
  }

  async _loadSelectedMonster(monster) {
    this.scene.remove(this.selectedMonster.model);
    this.selectedMonster = this.monsterList[monster.name.toLowerCase()];
    this.scene.add(this.selectedMonster.model);
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _sceneLoop() {
    if (this._loading) return;
  
    this._gameLoop = requestAnimationFrame((t) => {
      if (this._lastFrameTime === undefined) {
        this._lastFrameTime = t;
      }
  
      const deltaTime = (t - this._lastFrameTime) / 1000;
  
      this.controls.update();
  
      if (this.selectedMonster.mixer) {
        this.selectedMonster.mixer.update(deltaTime);
      }
  
      this._render();
  
      this._lastFrameTime = t; 
      this._sceneLoop(); 
    });
  }
  
  InitScene() {
    this._sceneLoop();
  }

  DestroyScene() {
    cancelAnimationFrame(this._gameLoop);
    this._titleScreenElement.remove();
    this.renderer.setAnimationLoop(null);

    window.removeEventListener("resize", this._onWindowResize.bind(this));

    const gameElement = document.getElementById("game");
    const list = gameElement.querySelector("monster-list-element");
    if (list) {
      gameElement.removeChild(list);
    }


    this.controls.dispose();

    this.renderer.dispose();

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this._lastFrameTime = null;
  }
}
