import { D } from "./constants.js";

/**
 * Resizes the window using an isometric projection.
 *
 * @param three  Object containing THREE.js classes.
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
