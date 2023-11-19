import * as THREE from "three";

import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { playJumpSound } from "./audio.js";
import { ambientColor, backgroundColor, directionalColor } from "./colors.js";
import { D } from "./constants.js";
import { checkRescues } from "./gameplay.js";
import { addPuzzleToScene } from "./map.js";
import { onKeydown } from "./movement.js";
import { puzzles } from "./puzzles.js";
import { onWindowResize } from "./utilities.js";

//--- GLOBAL VARIABLES ---//

let width, height;
let camera, scene, renderer;
let ambientLight, directionalLight;

let duck, duckling;
let duckFamily, lostDucklings;
const duckFile = "./assets/models/gltf/duck.gltf";
const ducklingFile = "./assets/models/gltf/duckling.gltf";

let audioLoader, listener;
const jumpSounds = [];
const jumpSoundFiles = [
  "./assets/sounds/jump_sound_1.wav",
  "./assets/sounds/jump_sound_2.wav",
  "./assets/sounds/jump_sound_3.wav",
  "./assets/sounds/jump_sound_4.wav",
  "./assets/sounds/jump_sound_5.wav",
  "./assets/sounds/jump_sound_6.wav",
  "./assets/sounds/jump_sound_7.wav",
];

let cubes;

//--- LOADING ---//

function loadModels() {
  const loader = new GLTFLoader();

  loader.load(duckFile, (gltf) => {
    duck = gltf.scene;
  });

  loader.load(ducklingFile, (gltf) => {
    duckling = gltf.scene;
  });
}

function loadAudio() {
  jumpSoundFiles.forEach((soundFile) => {
    audioLoader.load(soundFile, (buffer) => {
      const jumpSound = new THREE.Audio(listener);
      jumpSound.setBuffer(buffer);
      jumpSounds.push(jumpSound);
    });
  });
}

//--- INITIALIZATION ---//

function initCamera() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera = new THREE.OrthographicCamera(
    (-D * width) / height,
    (+D * width) / height,
    +D,
    -D,
    1,
    1000
  );
  camera.position.set(D, D, D);
  camera.lookAt(0, 0, 0);
}

function initAudio() {
  audioLoader = new THREE.AudioLoader();
  listener = new THREE.AudioListener();
  camera.add(listener);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(devicePixelRatio); // Makes aspect ratio weird on mobile
  document.body.appendChild(renderer.domElement);
}

function initLights() {
  ambientLight = new THREE.AmbientLight(ambientColor, 1.0);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(directionalColor, 1.5);
  directionalLight.position.set(1, 2, 0);
  scene.add(directionalLight);
}

function initModels() {
  duckFamily = new THREE.Group();
  scene.add(duckFamily);

  lostDucklings = new THREE.Group();
  scene.add(lostDucklings);

  cubes = new THREE.Group();
  scene.add(cubes);
}

function init() {
  initCamera();
  initAudio();
  initScene();
  initRenderer();
  initLights();
  initModels();
  onWindowResize(camera, renderer, window);
}

function reset() {
  initScene();
  initLights();
  initModels();
}

//--- LISTENERS ---//

document.addEventListener(
  "keydown",
  (e) => { onKeydown(e, duckFamily, status); },
  false
);

window.addEventListener(
  "resize", 
  () => { onWindowResize(camera, renderer, window); }, 
  false
);

//--- MAIN LOOP ---//

const status = { 
  advance : false, 
  level   : 0, 
  loading : true, 
  moved   : false, 
  jumped  : false 
};

function loadNewScene() {
  // Add duck model to new scene
  duckFamily.add(new THREE.Object3D().copy(duck));
  // Add duckling and map to new scene
  addPuzzleToScene(
    camera,
    puzzles[status.level],
    cubes,
    duckFamily,
    lostDucklings,
    duckling
  );
}

function animate() {
  requestAnimationFrame(animate);

  if (status.loading && duckling && duck) {
    status.loading = false;
    loadNewScene();
  }

  if (status.moved) {
    status.moved = false;
    checkRescues(duckFamily, lostDucklings, duckling, status);
  }
  
  if (status.jumped) {
    status.jumped = false;
    playJumpSound(jumpSounds);
  }
  
  if (status.advance) {
    status.advance = false;
    status.level = (status.level + 1) % puzzles.length;
    reset();
    status.loading = true;
  }

  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  init();
  loadModels();
  loadAudio();
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("warning-container").appendChild(warning);
}
