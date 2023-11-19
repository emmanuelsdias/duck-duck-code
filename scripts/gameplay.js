import { DUCKLING_HEIGHT, CUBE_SIZE } from "./constants.js";

/**
 * Creates a new duckling from model and adds it on top of the duck family.
 *
 * @param duckFamily THREE.js Group containing duck and rescued ducklings.
 * @param duckling   Duckling model.
 */
function rescueDuckling(duckFamily, duckling) {
  const newDuckling = duckling.clone();
  newDuckling.position.y = duckFamily.position.y + DUCKLING_HEIGHT * (duckFamily.children.length - 1);
  newDuckling.position.y += (0.34 + 0.05 * duckFamily.children.length) * CUBE_SIZE;
  duckFamily.add(newDuckling);
}

/**
 * Checks if there is a lost duckling close enough to the duck. If so, rescues it.
 * If all ducklings are rescued, update status to advances to next level.
 *
 * @param duckFamily    THREE.js Group containing duck and rescued ducklings.
 * @param lostDucklings THREE.js Group containing lost ducklings on the scene.
 * @param duckling      Duckling model.
 * @param status        Object containing game's current status.
 */
export function checkRescues(duckFamily, lostDucklings, duckling, status) {
  lostDucklings.children.forEach((child) => {
    // Check if child is duckling
    if (child.position.y == -0.5) {
      const deltaX = Math.abs(child.position.x - duckFamily.position.x);
      const deltaZ = Math.abs(child.position.z - duckFamily.position.z);
      // Check if duckling is close enough to duck
      if (deltaX + deltaZ < 0.4) {
        lostDucklings.remove(child);
        rescueDuckling(duckFamily, duckling);
      }
    }
  });
  if (lostDucklings.children.length == 0) {
    // If all ducklings are rescued, advance to next level
    status.advance = true;
  }
}
