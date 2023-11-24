import * as THREE from "three";

import { CUBE_SIZE, Y_AXIS, DIRECTION, TERRAIN } from "./constants.js";
import { canDuckBeHere, isDuckOnWater } from "./map.js";
import { roundVector3 } from "./utilities.js";

/**
 * Rotates duck and rescued ducklings to the left.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
export function rotateLeft(duckFamily, status) {
  const angle = +Math.PI / 2;
  duckFamily.rotation.y += angle;
  roundVector3(status.duckDir.applyAxisAngle(Y_AXIS, angle));
}

/**
 * Rotates duck and rescued ducklings to the right.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
export function rotateRight(duckFamily, status) {
  const angle = -Math.PI / 2;
  duckFamily.rotation.y += angle;
  roundVector3(status.duckDir.applyAxisAngle(Y_AXIS, angle));
}

/**
 * Moves duck and rescued ducklings one cube forward.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 */
export function moveForward(duckFamily, status) {
  status.duckPos.add(status.duckDir);
  if (!canDuckBeHere(status)) {
    status.duckPos.sub(status.duckDir);
    return;
  }
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
export function moveBackward(duckFamily, status) {
  status.duckPos.sub(status.duckDir);
  if (!canDuckBeHere(status)) {
    status.duckPos.add(status.duckDir);
    return;
  }
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
export async function jump(duckFamily) {
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

/**
 * Handles player's movement according to the key pressed on keydown event.
 * To prevent key spam, it waits 200ms before accepting another key.
 *
 * @param move       Movement to be done.
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 * @param status     Object containing game's current status.
 */
export async function runMovement(move, typeOfMovement, duckFamily, status) {
  if (isDuckOnWater(status) && typeOfMovement !== TERRAIN.Water) return;
  else if (!isDuckOnWater(status) && typeOfMovement === TERRAIN.Water) return;

  switch (move) {
    case DIRECTION.Up:
      jump(duckFamily);
      moveForward(duckFamily, status);
      status.jumped = true;
      status.moved = true;
      break;

    case DIRECTION.Down:
      jump(duckFamily);
      moveBackward(duckFamily, status);
      status.jumped = true;
      status.moved = true;
      break;

    case DIRECTION.Left:
      rotateLeft(duckFamily, status);
      break;

    case DIRECTION.Right:
      rotateRight(duckFamily, status);
      break;

    case DIRECTION.Jump:
      jump(duckFamily);
      status.jumped = true;
      break;

    default:
      return;
  }
}
