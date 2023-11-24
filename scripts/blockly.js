import { DIRECTION, TERRAIN } from "./constants.js";
import {
  jump,
  moveForward,
  moveBackward,
  rotateLeft,
  rotateRight,
} from "./movement.js";

/**
 * Loads the blockly workspace, defining the blocks and their functions
 * 
 * @returns Workspace object containing the Blockly workspace.
 */
export function initBlockly() {
  const workspace = Blockly.inject("blocklyWorkspace", {
    media: "https://unpkg.com/blockly/media/",
    toolbox: document.getElementById("toolbox"), // You can customize the toolbox if needed
  });

  Blockly.Blocks["move_forward"] = {
    init: function () {
      this.appendDummyInput().appendField("Move Forward");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Move the duck forward");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["move_backward"] = {
    init: function () {
      this.appendDummyInput().appendField("Move Backward");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Move the duck backward");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["turn_right"] = {
    init: function () {
      this.appendDummyInput().appendField("Turn Right");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Turn the duck to the right");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["turn_left"] = {
    init: function () {
      this.appendDummyInput().appendField("Turn Left");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Turn the duck to the left");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["move_forward_B"] = {
    init: function () {
      this.appendDummyInput().appendField("Move Forward Water");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Move the duck forward");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["move_backward_B"] = {
    init: function () {
      this.appendDummyInput().appendField("Move Backward Water");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Move the duck backward");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["turn_right_B"] = {
    init: function () {
      this.appendDummyInput().appendField("Turn Right Water");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Turn the duck to the right");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["turn_left_B"] = {
    init: function () {
      this.appendDummyInput().appendField("Turn Left Water");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Turn the duck to the left");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks["repeat"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("for")
        .appendField("count")
        .appendField(new Blockly.FieldNumber(0, 1), "COUNT")
        .appendField("times");
      this.appendStatementInput("DO").appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(350);
      this.setTooltip("For loop with an editable number");
      this.setHelpUrl("");
    },
  };

  Blockly.JavaScript["move_forward"] = function (block) {
    return "moves.push(DIRECTION.Up); types.push(TERRAIN.Land);";
  };

  Blockly.JavaScript["move_backward"] = function (block) {
    return "moves.push(DIRECTION.Down); types.push(TERRAIN.Land);";
  };

  Blockly.JavaScript["turn_right"] = function (block) {
    return "moves.push(DIRECTION.Right); types.push(TERRAIN.Land);";
  };

  Blockly.JavaScript["turn_left"] = function (block) {
    return "moves.push(DIRECTION.Left); types.push(TERRAIN.Land);";
  };

  Blockly.JavaScript["move_forward_B"] = function (block) {
    return "moves.push(DIRECTION.Up); types.push(TERRAIN.Water);";
  };

  Blockly.JavaScript["move_backward_B"] = function (block) {
    return "moves.push(DIRECTION.Down); types.push(TERRAIN.Water);";
  };

  Blockly.JavaScript["turn_right_B"] = function (block) {
    return "moves.push(DIRECTION.Right); types.push(TERRAIN.Water);";
  };

  Blockly.JavaScript["turn_left_B"] = function (block) {
    return "moves.push(DIRECTION.Left); types.push(TERRAIN.Water);";
  };

  var loopCounter = 0;

  Blockly.JavaScript["repeat"] = function (block) {
    var count = block.getFieldValue("COUNT");
    var idx = "i_" + loopCounter++;
    var code =
      "for (let " +
      idx +
      " = 0; " +
      idx +
      " < " +
      count +
      "; " +
      idx +
      "++) {\n" +
      Blockly.JavaScript.statementToCode(block, "DO") +
      "}\n";
    return code;
  };
  return workspace;
} 

/**
 * Executes the generated code from the Blockly workspace
 * 
 * @param workspace Blockly workspace object
 * @param moves     Array of moves to execute
 * @param types     Array of terrain types to execute
 */
export function runCode(workspace, moves, types) {
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  try {
    eval(code);
  } catch (e) {
    console.error("Error executing generated code:", e);
  }
}