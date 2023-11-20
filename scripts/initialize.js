import * as THREE from "three";

import { ambientColor, backgroundColor, directionalColor } from "./colors.js";
import { D } from "./constants.js";

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

export function initAudio(three) {
  three.audioLoader = new THREE.AudioLoader();
  three.listener = new THREE.AudioListener();
  three.camera.add(three.listener);
}

export function initScene(three) {
  three.scene = new THREE.Scene();
  three.scene.background = new THREE.Color(backgroundColor);
}

export function initRenderer(three) {
  three.renderer = new THREE.WebGLRenderer({ antialias: true });
  three.renderer.setSize(window.innerWidth, window.innerHeight);
  // three.renderer.setPixelRatio(devicePixelRatio); // Makes aspect ratio weird on mobile
  document.body.appendChild(three.renderer.domElement);
}

export function initLights(three) {
  const ambientLight = new THREE.AmbientLight(ambientColor, 1.0);
  three.scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(directionalColor, 1.5);
  directionalLight.position.set(1, 2, 0);
  three.scene.add(directionalLight);
}

export function initModels(groups, three) {
  groups.duckFamily = new THREE.Group();
  three.scene.add(groups.duckFamily);

  groups.lostDucklings = new THREE.Group();
  three.scene.add(groups.lostDucklings);

  groups.cubes = new THREE.Group();
  three.scene.add(groups.cubes);
}
