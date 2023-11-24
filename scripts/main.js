import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

import { loadAudio, playJumpSound } from "./audio.js";
import { initBlockly, runCode } from "./blockly.js";
import { checkRescues } from "./gameplay.js";
import {
  initRenderer,
  initCamera,
  initAudio,
  initScene,
  initLights,
  initGroups,
} from "./initialize.js";
import { loadNextPuzzle } from "./map.js";
import { loadModels } from "./models.js";
import { runMovement } from "./movement.js";
import { puzzles } from "./puzzles.js";
import { isEmpty, onWindowResize } from "./utilities.js";

//--- GLOBAL OBJECTS ---//

const three = {
  camera      : null,
  scene       : null,
  renderer    : null,
  audioLoader : null,
  listener    : null,
};

const groups = {
  cubes         : null,
  duckFamily    : null,
  lostDucklings : null,
};

const models = {
  duck         : null,
  duckling     : null,
  waterTexture : null,
};

const status = {
  advance : false,
  level   : 1,
  loading : true,
  moved   : false,
  jumped  : false,
  map     : [],
  duckPos : new THREE.Vector2(0, 0),
  duckDir : new THREE.Vector3(1, 0, 0),
};

const jumpSounds = [];

let workspace;

//--- INITIALIZATION ---//

function init() {
  initRenderer(three);
  initCamera(three);
  initAudio(three);
  initScene(three);
  initLights(three);
  initGroups(groups, three);
  onWindowResize(three);
  workspace = initBlockly();
}

function load() {
  loadModels(models);
  loadAudio(three, jumpSounds);
}

function reset() {
  initScene(three);
  initLights(three);
  initGroups(groups, three);
}

//--- LISTENERS ---//

window.addEventListener(
  "resize",
  () => {
    onWindowResize(three);
  },
  false
);

document.querySelector("#runButton").addEventListener(
  "click", () => {
    runCode(workspace, moves, types);
  },
  false
);

let moves = [];
let types = [];

// TODO: Use Blockly's interpreter instead of the above

// Not really a listener, but it reads from arrays above
// every 500ms to run any command that has been pushed
setInterval(() => {
  if (!isEmpty(moves))
    runMovement(moves.shift(), types.shift(), groups.duckFamily, status);
}, 500);

//--- MAIN LOOP ---//

function loadNewScene() {
  // Add duck model to new scene
  groups.duckFamily.add(new THREE.Object3D().copy(models.duck));
  // Add duckling and map to new scene
  loadNextPuzzle(
    three.camera,
    puzzles[status.level],
    groups.cubes,
    groups.duckFamily,
    groups.lostDucklings,
    models.duckling,
    models.waterTexture,
    status
  );
}

function advanceLevel() {
  status.level++;
  if (status.level > puzzles.size) {
    status.level = 1;
  }
  moves = [];
  types = [];
  workspace.clear();
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
    advanceLevel();
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
