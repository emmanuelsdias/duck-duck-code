import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const duckFile = "./assets/models/gltf/duck.gltf";
const ducklingFile = "./assets/models/gltf/duckling.gltf";

export function loadModels(models) {
  const loader = new GLTFLoader();

  loader.load(duckFile, (gltf) => {
    models.duck = gltf.scene;
  });

  loader.load(ducklingFile, (gltf) => {
    models.duckling = gltf.scene;
  });
}