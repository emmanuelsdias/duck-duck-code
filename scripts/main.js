import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

import { loadAudio, playJumpSound } from "./audio.js";
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

import { jump, moveForward, moveBackward, rotateLeft, rotateRight } from "./movement.js";
import { DIRECTION } from "./constants.js";

//--- GLOBAL VARIABLES ---//

const three = {
  camera: null,
  scene: null,
  renderer: null,
  audioLoader: null,
  listener: null,
};

const groups = {
  cubes: null,
  duckFamily: null,
  lostDucklings: null,
};

const models = {
  duck: null,
  duckling: null,
};

const status = {
  advance: false,
  level: 1,
  loading: true,
  moved: false,
  jumped: false,
  map: [],
  duckPos: new THREE.Vector2(0, 0),
  duckDir: new THREE.Vector3(1, 0, 0),
};

const jumpSounds = [];

//--- INITIALIZATION ---//

function init() {
  initRenderer(three);
  initCamera(three);
  initAudio(three);
  initScene(three);
  initLights(three);
  initGroups(groups, three);
  onWindowResize(three);
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
    status
  );
}

function advanceLevel() {
  status.level++;
  if (status.level > puzzles.size) {
    status.level = 1;
  }
  moves = [];
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

const workspace = Blockly.inject("blocklyWorkspace", {
  media: "https://unpkg.com/blockly/media/",
  toolbox: document.getElementById("toolbox"), // You can customize the toolbox if needed
});

Blockly.Blocks["move_forward"] = {
  init: function () {
    this.appendDummyInput().appendField("Move Forward");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the duck forward");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["move_backward"] = {
  init: function () {
    this.appendDummyInput().appendField("Move Backward");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the duck backward");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["turn_right"] = {
  init: function () {
    this.appendDummyInput().appendField("Turn Right");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Turn the duck to the right");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["turn_left"] = {
  init: function () {
    this.appendDummyInput().appendField("Turn Left");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Turn the duck to the left");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('for')
        .appendField('count')
        .appendField(new Blockly.FieldNumber(0, 1), 'COUNT')
        .appendField('times');
    this.appendStatementInput('DO')
        .appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('For loop with an editable number');
    this.setHelpUrl('');
  }
};


Blockly.JavaScript["move_forward"] = function (block) {
  return "moves.push(DIRECTION.Up);";
};

Blockly.JavaScript["move_backward"] = function (block) {
  return "moves.push(DIRECTION.Down);";
};

Blockly.JavaScript["turn_right"] = function (block) {
  return "moves.push(DIRECTION.Right);";
};

Blockly.JavaScript["turn_left"] = function (block) {
  return "moves.push(DIRECTION.Left);";
};

Blockly.JavaScript['repeat'] = function(block) {
  var count = block.getFieldValue('COUNT') || '0';
  var code = 'for (var i = 0; i < ' + count + '; i++) {\n' +
             Blockly.JavaScript.statementToCode(block, 'DO') +
             '}\n';
  return code;
};

function runCode() {
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  console.log(code);
  try {
    eval(code); // Execute the generated JavaScript code
  } catch (e) {
    console.error("Error executing generated code:", e);
  }
}

document
  .querySelector("#runButton")
  .addEventListener("click", function (event) {
    runCode();
  });

let moves = [];
setInterval(() => {
  if (!isEmpty(moves)) runMovement(moves.shift(), groups.duckFamily, status);
}, 500);
