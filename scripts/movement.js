import * as THREE from "three";

import { CUBE_SIZE, Y_AXIS } from "./constants.js";
import { canDuckBeHere } from "./map.js";
import { roundVector3 } from "./utilities.js";

/**
 * Rotates duck and rescued ducklings to the left.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function rotateLeft(duckFamily, status) {
  const angle = + Math.PI / 2;
  duckFamily.rotation.y += angle;
  roundVector3( status.duckDir.applyAxisAngle( Y_AXIS, angle ) )
}

/**
 * Rotates duck and rescued ducklings to the right.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function rotateRight(duckFamily, status) {
  const angle = - Math.PI / 2;
  duckFamily.rotation.y += angle;
  roundVector3( status.duckDir.applyAxisAngle( Y_AXIS, angle ) );
}

/**
 * Moves duck and rescued ducklings one cube forward.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function moveForward(duckFamily, status) {
  status.duckPos.add( status.duckDir );
  if (!canDuckBeHere(status)) {
    status.duckPos.sub(status.duckDir);
    return; 
  };
  const direction = new THREE.Vector3();
  direction.copy(status.duckDir);
  direction.multiplyScalar(CUBE_SIZE);
  duckFamily.position.add(direction);
}

/**
 * Moves duck and rescued ducklings one cube backward.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
function moveBackward(duckFamily, status) {
  status.duckPos.sub(status.duckDir);
  if (!canDuckBeHere(status)) {
    status.duckPos.add(status.duckDir);
    return; 
  };
  const direction = new THREE.Vector3();
  direction.copy(status.duckDir);
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
        moveForward(duckFamily, status);
        status.jumped = true;
        status.moved = true;
        break;
  
      case "ArrowDown":
      case "KeyS":
        jump(duckFamily);
        moveBackward(duckFamily, status);
        status.jumped = true;
        status.moved = true;
        break;
  
      case "ArrowLeft":
      case "KeyA":
        rotateLeft(duckFamily, status);
        break;
  
      case "ArrowRight":
      case "KeyD":
        rotateRight(duckFamily, status);
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
