import * as THREE from "three";

import { lightBlue, darkBlue, lightGreen, darkGreen } from "./colors.js";
import { D, CUBE_SIZE } from "./constants.js";
import { isUpperCase } from "./utilities.js";

/**
 * Adds a new cube on the scene.
 *
 * @param x     New cube's x index position.
 * @param z     New cube's z index position.
 * @param cubes THREE.js Group containing cubes on the scene.
 */
function addCube(x, z, cell, cubes) {
  let cubeColor;
  switch(cell) {
    case 'b':
    case 'B':
      cubeColor = (x + z) % 2 == 0 ? lightBlue : darkBlue;
      break;
    default:
      cubeColor = (x + z) % 2 == 0 ? lightGreen : darkGreen;
      break;
  }
  const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: cubeColor });
  const cubeTile = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeTile.receiveShadow = true;
  cubeTile.position.set(x * CUBE_SIZE, -0.7, z * CUBE_SIZE);
  cubes.add(cubeTile);
}

/**
 * Positions the duck family on the scene and centers the camera on it.
 *
 * @param x          Duck's x index position.
 * @param z          Duck's z index position.
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 * @param camera     THREE.js Camera.
 */
function positionDuckFamily(x, z, duckFamily, camera) {
  duckFamily.position.set(x * CUBE_SIZE, 0, z * CUBE_SIZE);
  camera.position.set(D + x * CUBE_SIZE, D, D + z * CUBE_SIZE);
  camera.lookAt(x * CUBE_SIZE, 0, z * CUBE_SIZE);
}

/**
 * Adds a new duckling to the scene.
 *
 * @param x             New cube's x index position.
 * @param z             New cube's z index position.
 * @param lostDucklings THREE.js Group containing lost ducklings on the scene.
 * @param duckling      Duckling model.
 */
function addDuckling(x, z, lostDucklings, duckling) {
  const newDuckling = new THREE.Object3D();
  newDuckling.copy(duckling);
  newDuckling.position.set(x * CUBE_SIZE + 0.1, -0.5, z * CUBE_SIZE);
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
 * @param status        Object storing the current game status.
 */
export function loadNextPuzzle(
  camera,
  puzzle,
  cubes,
  duckFamily,
  lostDucklings,
  duckling,
  status
) {
  const rows = puzzle.split("\n");
  status.map = [];
  status.duckDir.x = 1;
  status.duckDir.z = 0;
  for (let z = 0; z < rows.length; z++) {
    status.map.push([]);
    for (let x = 0; x < rows[z].length; x++) {
      const cell = rows[z][x];
      // Add cell to status' map
      status.map[z].push(cell);
      // Add floor cubes 
      if (cell !== ".") {
        addCube(x, z, cell, cubes);
      }
      // Position duck starting position and record it in status
      if (cell === "d") {
        positionDuckFamily(x, z, duckFamily, camera);
        status.duckPos = new THREE.Vector3(x, 0, z);
      }
      // Add lost ducklings
      if (isUpperCase(cell)) {
        addDuckling(x, z, lostDucklings, duckling);
      }
    }
  }
}

/**
 * Checks if the duck is standing on a valid map position.
 *
 * @param status Object storing the current game status.
 */
export function canDuckBeHere( status ) {
  const x = status.duckPos.x;
  const z = status.duckPos.z;
  if (z in status.map && x in status.map[z]) 
    return status.map[z][x] !== '.';
  return false;
}

/**
 * Checks if the duck is standing on a water (blue) cube.
 *
 * @param status Object storing the current game status.
 */
export function isDuckOnWater( status ) {
  const x = status.duckPos.x;
  const z = status.duckPos.z;
  if (z in status.map && x in status.map[z]) 
    return status.map[z][x] === 'B' || status.map[z][x] === 'b';
  return false;
}
