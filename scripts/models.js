import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const duckFile = "./assets/models/gltf/duck.gltf";
const ducklingFile = "./assets/models/gltf/duckling.gltf";
const waterFile = "./assets/images/water.jpg"

/**
 * Loads duck and duckling models and stores them in the models object.
 *
 * @param three      Object storing the THREE.js classes we use.
 * @param jumpSounds Array where all jump sounds will be added.
 */
export function loadModels(models) {
  const loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  loader.load(duckFile, (gltf) => {
    gltf.scene.traverse( function( node ) {
      if ( node.isMesh ) { node.castShadow = true; }
  } );
    models.duck = gltf.scene;
  });

  loader.load(ducklingFile, (gltf) => {
    models.duckling = gltf.scene;
  });

  models.waterTexture = textureLoader.load(waterFile);
}