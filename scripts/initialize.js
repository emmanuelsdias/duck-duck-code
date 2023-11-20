import * as THREE from "three";

import { ambientColor, backgroundColor, directionalColor } from "./colors.js";
import { D } from "./constants.js";

/**
 * Initialize THREE.js WebGL Renderer.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function initRenderer(three) {
  three.renderer = new THREE.WebGLRenderer({ antialias: true });
  three.renderer.setSize(window.innerWidth, window.innerHeight);
  // three.renderer.setPixelRatio(devicePixelRatio); // Makes aspect ratio weird on mobile
  document.body.appendChild(three.renderer.domElement);
}

/**
 * Initialize THREE.js Camera.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function initCamera(three) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  three.camera = new THREE.OrthographicCamera(
    (-D * width) / height,
    (+D * width) / height,
    +D,
    -D,
    1,
    1000
  );
  three.camera.position.set(D, D, D);
  three.camera.lookAt(0, 0, 0);
}

/**
 * Initialize THREE.js AudioListener and AudioLoader.
 * Depends on Camera being initialized.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function initAudio(three) {
  three.audioLoader = new THREE.AudioLoader();
  three.listener = new THREE.AudioListener();
  three.camera.add(three.listener);
}

/**
 * Initialize THREE.js Scene.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function initScene(three) {
  three.scene = new THREE.Scene();
  three.scene.background = new THREE.Color(backgroundColor);
}

/**
 * Initialize THREE.js Lights used in the scene.
 * Depends on Scene being initialized.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function initLights(three) {
  const ambientLight = new THREE.AmbientLight(ambientColor, 1.0);
  three.scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(directionalColor, 1.5);
  directionalLight.position.set(1, 2, 0);
  three.scene.add(directionalLight);
}

/**
 * Initialize THREE.js Groups used in the scene.
 * Depends on Scene being initialized.
 *
 * @param three Object storing the THREE.js classes we use.
 */
export function initGroups(groups, three) {
  groups.duckFamily = new THREE.Group();
  three.scene.add(groups.duckFamily);

  groups.lostDucklings = new THREE.Group();
  three.scene.add(groups.lostDucklings);

  groups.cubes = new THREE.Group();
  three.scene.add(groups.cubes);
}
