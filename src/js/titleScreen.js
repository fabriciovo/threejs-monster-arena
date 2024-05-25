import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loaderFBX } from "../utils/loader";

export default class TitleScene {
  constructor() {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this.objects = [];
    this._deltaTime = null;

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
    this._addWebComponents();
    //this._createSprites();
    window.addEventListener("resize", this._onWindowResize.bind(this));
  }

  _addWebComponents() {
    const gameElement = document.getElementById("game");
    const titleScreenElement = document.createElement("title-screen-element");
    gameElement.appendChild(titleScreenElement);
  }

  _document() {
    // document.getElementById("attacks").className = "none";
    // document.getElementById("items").className = "none";
  }

  _events() {}

  _addListener() {}

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
    const arena = await loaderFBX('assets/arena.fbx')
    this.scene.add(arena);
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

      this._render();
      this._deltaTime = t;
    });
  }

  InitScene() {
    this.SceneLoop();
  }

  DestroyScene() {
    window.removeEventListener("resize", this._onWindowResize.bind(this));

    this.objects.forEach((object) => {
      this.scene.remove(object);
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    this.objects = [];

    const gameElement = document.getElementById("game");
    const titleScreenElement = gameElement.querySelector("title-screen-element");
    if (titleScreenElement) {
      gameElement.removeChild(titleScreenElement);
    }

    this.controls.dispose();

    this.renderer.dispose();

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this._deltaTime = null;
  }

}
