import { D } from "./constants.js";

/**
 * Resizes the window using an isometric projection.
 *
 * @param camera   THREE.js Camera.
 * @param renderer THREE.js Renderer.
 * @param window   Window object.
 */
export function onWindowResize( camera, renderer, window ) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);

  camera.left = (-D * width) / height;
  camera.right = (+D * width) / height;
  camera.top = +D;
  camera.bottom = -D;

  camera.updateProjectionMatrix();
}