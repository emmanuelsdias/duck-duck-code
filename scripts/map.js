import * as THREE from "three";

import { lightCubeColor, darkCubeColor } from "./colors.js";
import { D, CUBE_SIZE } from "./constants.js";

/**
 * Adds a new cube on the scene.
 *
 * @param x     New cube's x index position.
 * @param y     New cube's y index position.
 * @param cubes THREE.js Group containing cubes on the scene.
 */
function addCube(x, y, cubes) {
  const cubeColor = (x + y) % 2 == 0 ? lightCubeColor : darkCubeColor;
  const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: cubeColor,
  });
  const cubeTile = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeTile.position.set(x * CUBE_SIZE, -0.7, y * CUBE_SIZE);
  cubes.add(cubeTile);
}

/**
 * Positions the duck family on the scene and centers the camera on it.
 *
 * @param x          Duck's x index position.
 * @param y          Duck's y index position.
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 * @param camera     THREE.js Camera.
 */
function positionDuckFamily(x, y, duckFamily, camera) {
  duckFamily.position.set(x * CUBE_SIZE, 0, y * CUBE_SIZE);
  camera.position.set(D + x * CUBE_SIZE, D, D + y * CUBE_SIZE);
  camera.lookAt(x * CUBE_SIZE, 0, y * CUBE_SIZE);
}

/**
 * Adds a new duckling to the scene.
 *
 * @param x             New cube's x index position.
 * @param y             New cube's y index position.
 * @param lostDucklings THREE.js Group containing lost ducklings on the scene.
 * @param duckling      Duckling model.
 */
function addDuckling(x, y, lostDucklings, duckling) {
  const newDuckling = new THREE.Object3D();
  newDuckling.copy(duckling);
  newDuckling.position.set(x * CUBE_SIZE + 0.1, -0.5, y * CUBE_SIZE);
  lostDucklings.add(newDuckling);
}

/**
 * Iterates through the given puzzle and positions the cubes, ducks and ducklings on the scene.
 *
 * @param camera        THREE.js Camera.
 * @param puzzle        Matrix containing next puzzle.
 * @param cubes         THREE.js Group containing cubes on the scene.
 * @param duckFamily    THREE.js Group containing duck and rescued ducklings.
 * @param lostDucklings THREE.js Group containing lost ducklings on the scene.
 * @param duckling      Duckling model.
 */
export function addPuzzleToScene(
  camera,
  puzzle,
  cubes,
  duckFamily,
  lostDucklings,
  duckling
) {
  const rows = puzzle.split("\n");
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const cell = rows[y][x];
      // Add floor cubes 
      if (cell !== ".") {
        addCube(x, y, cubes);
      }
      // Position duck starting position
      if (cell === "D") {
        positionDuckFamily(x, y, duckFamily, camera);
      }
      // Add lost ducklings
      if (cell === "L") {
        addDuckling(x, y, lostDucklings, duckling);
      }
    }
  }
}
