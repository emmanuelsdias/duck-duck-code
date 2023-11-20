import * as THREE from "three";

import { CUBE_SIZE, Z_TO_X } from "./constants.js";

/**
 * Rotates duck and rescued ducklings to the left.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function rotateLeft(duckFamily) {
  duckFamily.rotation.y += Math.PI / 2;
}

/**
 * Rotates duck and rescued ducklings to the right.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function rotateRight(duckFamily) {
  duckFamily.rotation.y -= Math.PI / 2;
}

/**
 * Moves duck and rescued ducklings one cube forward.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function moveForward(duckFamily) {
  const direction = new THREE.Vector3();
  duckFamily.children[0].getWorldDirection(direction);
  direction.applyMatrix3(Z_TO_X);
  direction.multiplyScalar(CUBE_SIZE);
  duckFamily.position.add(direction);
}

/**
 * Moves duck and rescued ducklings one cube backward.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function moveBackward(duckFamily) {
  const direction = new THREE.Vector3();
  duckFamily.children[0].getWorldDirection(direction);
  direction.applyMatrix3(Z_TO_X);
  direction.multiplyScalar(-CUBE_SIZE);
  duckFamily.position.add(direction);
}

/**
 * Moves duck and rescued ducklings up and down (after 200ms).
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
async function jump(duckFamily) {
  let counter = 1;
  duckFamily.traverse((child) => {
    if (child.name === "Duck" || child.name === "Duckie") {
      child.position.y += (0.3 + 0.05 * counter) * CUBE_SIZE;
      counter++;
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 200));

  counter = 1;
  duckFamily.traverse((child) => {
    if (child.name === "Duck" || child.name === "Duckie") {
      child.position.y -= (0.3 + 0.05 * counter) * CUBE_SIZE;
      counter++;
    }
  });
}

let recentMovement = false;

/**
 * Handles player's movement according to the key pressed on keydown event.
 * To prevent key spam, it waits 200ms before accepting another key.
 *
 * @param e          Keydown event object.
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 * @param status     Object containing game's current status.
 */
export async function onKeydown(e, duckFamily, status) {
  if (!recentMovement) {
    const key = e.code;
    switch (key) {
      case "ArrowUp":
      case "KeyW":
        jump(duckFamily);
        moveForward(duckFamily);
        status.jumped = true;
        status.moved = true;
        break;
  
      case "ArrowDown":
      case "KeyS":
        jump(duckFamily);
        moveBackward(duckFamily);
        status.jumped = true;
        status.moved = true;
        break;
  
      case "ArrowLeft":
      case "KeyA":
        rotateLeft(duckFamily);
        break;
  
      case "ArrowRight":
      case "KeyD":
        rotateRight(duckFamily);
        break;
  
      case "Space":
        jump(duckFamily);
        status.jumped = true;
        break;
  
      default:
        return;
    }
    recentMovement = true;
    await new Promise((resolve) => setTimeout(resolve, 200));
    recentMovement = false;
  }
}
