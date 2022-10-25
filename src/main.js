import * as THREE from 'three';
import { loaderFBX } from "./utils/loader";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Pokemon from './threejs/pokemon';

let camera, controls, scene, renderer, pk1, deltaTime;


const clock = new THREE.Clock()

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  document.getElementById("attacks").className = "none";
  document.getElementById("items").className = "none";

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("app"),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(400, 200, 0);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 20;
  controls.autoRotate = true;

  createObject();

  // lights

  const dirLight1 = new THREE.HemisphereLight(0xffffff, 0x444444);
  dirLight1.position.set(0, 200, 0);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  //


  window.addEventListener('resize', onWindowResize);

}


async function createObject() {
  const arena = await loaderFBX('assets/arena.fbx')
  const pk2 = await loaderFBX('assets/pokemons/squirtle/squirtle.FBX')
  pk2.scale.x = 0.01
  pk2.scale.y = 0.01
  pk2.scale.z = 0.01
  pk2.position.z = -3
  pk2.position.y = 0.1
  pk1 = new Pokemon("zombie", scene);
  scene.add(arena)
  scene.add(pk2)
}



function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame((t) => {
    if (deltaTime === null) {
      deltaTime = t;
    }
    
    animate();
    if (pk1) pk1.Update(t - deltaTime);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
    deltaTime = t;
  });


}

function render() {


  renderer.render(scene, camera);

}




