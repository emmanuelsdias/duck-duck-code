import { D } from "./constants.js";

/**
 * Resizes the window using an isometric projection.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function onWindowResize(three) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  three.renderer.setSize(width, height);

  three.camera.left = (-D * width) / height;
  three.camera.right = (+D * width) / height;
  three.camera.top = +D;
  three.camera.bottom = -D;

  three.camera.updateProjectionMatrix();
}

/**
 * Rounds the components of a THREE.js Vector3.
 * 
 * @param vector THREE.js Vector3 to round.
 */
export function roundVector3(vector) {
  vector.x = Math.round(vector.x);
  vector.y = Math.round(vector.y);
  vector.z = Math.round(vector.z);
}

/**
 * Returns true if the given string is uppercase.
 * 
 * @param str String to check.
 */
export function isUpperCase(str) {
  return str === str.toUpperCase() &&
         str !== str.toLowerCase();
}
