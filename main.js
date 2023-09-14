import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//--- RENDERER ---///
const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//--- CAMERA ---///
// const aspect = window.innerWidth / window.innerHeight;
const d = 2;
const camera = new THREE.OrthographicCamera( 
	- d * window.innerWidth / window.innerHeight, 
	+ d * window.innerWidth / window.innerHeight, 
	+ d, 
	- d, 
	1, 
	1000 
);
camera.position.set( d, d, d );
camera.lookAt( 0, 0, 0 );


//--- SCENE ---///
const scene = new THREE.Scene();


//--- LIGHTS ---///
const ambientLight = new THREE.AmbientLight( 0x404040, 10 ); 
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 1, 2, 0 );
scene.add( directionalLight );


//--- OBJECT MODELS ---///
const loader = new GLTFLoader();

const duckFamily = new THREE.Group();
scene.add( duckFamily );

let duck;
loader.load( 'models/gltf/duck.gltf', (gltf) => { 
	duck = gltf.scene;
	duckFamily.add( duck );
} );

let duckling;
loader.load('models/gltf/duckling.gltf', (gltf) => {
	duckling = gltf.scene;
	duckFamily.add( duckling );
} );

let cube;
loader.load('models/gltf/cube.gltf', (gltf) => {
	cube = gltf.scene;
	scene.add( cube );
} );


//--- LISTENERS ---//
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Not working, not sure why
  renderer.setSize(window.innerWidth, window.innerHeight);
});


//--- MOVEMENT ---///
const cubeSize = 0.8;
const movement = new THREE.Vector3();
const rotateZtoX = new THREE.Matrix3(0,0,1,0,1,0,-1,0,0);

document.addEventListener("keydown", async (e) => {
	var key = e.code;
	if (key == 'ArrowUp' || key == 'KeyW') { 
		duck.getWorldDirection(movement);
		movement.applyMatrix3(rotateZtoX);
		movement.multiplyScalar(cubeSize);
		duckFamily.position.add(movement);
	} else if (key == 'ArrowDown' || key == 'KeyS') { 
		duck.getWorldDirection(movement);
		movement.applyMatrix3(rotateZtoX);
		movement.multiplyScalar(-cubeSize);
		duckFamily.position.add(movement);
	} else if (key == 'ArrowLeft' || key == 'KeyA') {
		duckFamily.rotation.y += Math.PI / 2;
	} else if (key == 'ArrowRight' || key == 'KeyD') {
		duckFamily.rotation.y -= Math.PI / 2;
	} else if (key == 'Space') {
		duck.position.y += cubeSize;
		duckling.position.y += cubeSize + 0.5;
		await new Promise(resolve => setTimeout(resolve, 200));
		duck.position.y = 0;
		duckling.position.y = 0;
	}
});


//--- MAIN LOOP ---///
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'warning-container' ).appendChild( warning );
}