import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

import { loadAudio, playJumpSound } from "./audio.js";
import { checkRescues } from "./gameplay.js";
import {
  initCamera,
  initAudio,
  initScene,
  initRenderer,
  initLights,
  initModels,
} from "./initialize.js";
import { addPuzzleToScene } from "./map.js";
import { loadModels } from "./models.js";
import { onKeydown } from "./movement.js";
import { puzzles } from "./puzzles.js";
import { onWindowResize } from "./utilities.js";

//--- GLOBAL VARIABLES ---//

const three = {
  camera      : null,
  scene       : null,
  renderer    : null,
  audioLoader : null,
  listener    : null
};

const groups = {
  cubes         : null,
  duckFamily    : null,
  lostDucklings : null
};

const models = {
  duck     : null,
  duckling : null
};

const status = { 
  advance : false, 
  level   : 0, 
  loading : true, 
  moved   : false, 
  jumped  : false 
};

const jumpSounds = [];

//--- INITIALIZATION ---//

function init() {
  initCamera(three);
  initAudio(three);
  initScene(three);
  initRenderer(three);
  initLights(three);
  initModels(groups, three);
  onWindowResize(three);
}

function load() {
  loadModels(models);
  loadAudio(three, jumpSounds);
}

function reset() {
  initScene(three);
  initLights(three);
  initModels(groups, three);
}

//--- LISTENERS ---//

document.addEventListener(
  "keydown",
  (e) => { onKeydown(e, groups.duckFamily, status); },
  false
);

window.addEventListener(
  "resize", 
  () => { onWindowResize(three); }, 
  false
);

//--- MAIN LOOP ---//

function loadNewScene() {
  // Add duck model to new scene
  groups.duckFamily.add(new THREE.Object3D().copy(models.duck));
  // Add duckling and map to new scene
  addPuzzleToScene(
    three.camera,
    puzzles[status.level],
    groups.cubes,
    groups.duckFamily,
    groups.lostDucklings,
    models.duckling
  );
}

function animate() {
  requestAnimationFrame(animate);

  if (status.loading && models.duckling && models.duck) {
    status.loading = false;
    loadNewScene();
  }

  if (status.moved) {
    status.moved = false;
    checkRescues(
      groups.duckFamily,
      groups.lostDucklings,
      models.duckling,
      status
    );
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

  three.renderer.render(three.scene, three.camera);
}

if (WebGL.isWebGLAvailable()) {
  init();
  load();
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("warning-container").appendChild(warning);
}
