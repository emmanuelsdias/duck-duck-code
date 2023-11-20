import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const duckFile = "./assets/models/gltf/duck.gltf";
const ducklingFile = "./assets/models/gltf/duckling.gltf";

/**
 * Loads duck and duckling models and stores them in the models object.
 *
 * @param three      Object storing the THREE.js classes we use.
 * @param jumpSounds Array where all jump sounds will be added.
 */
export function loadModels(models) {
  const loader = new GLTFLoader();

  loader.load(duckFile, (gltf) => {
    models.duck = gltf.scene;
  });

  loader.load(ducklingFile, (gltf) => {
    models.duckling = gltf.scene;
  });
}