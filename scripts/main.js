import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//--- RENDERER ---///
const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio(devicePixelRatio); // Makes mobile aspect ratio weird
document.body.appendChild( renderer.domElement );


//--- CAMERA ---///
const d = 3;
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
const camera = new THREE.OrthographicCamera( 
	- d * WIDTH / HEIGHT, 
	+ d * WIDTH / HEIGHT, 
	+ d, 
	- d, 
	1, 
	1000 
);
camera.position.set( d, d, d );
camera.lookAt( 0, 0, 0 );

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	
	renderer.setSize( WIDTH, HEIGHT );
	
	camera.left   = - d * WIDTH / HEIGHT;
  camera.right  = + d * WIDTH / HEIGHT;
  camera.top    = + d;
  camera.bottom = - d;

	camera.updateProjectionMatrix();
}
onWindowResize();


//--- SCENE ---///
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x95FCFF );


//--- LIGHTS ---///
const ambientLight = new THREE.AmbientLight( 0xCCFDFF, 2 ); 
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
directionalLight.position.set( 1, 2, 0 );
scene.add( directionalLight );


//--- OBJECT MODELS ---///
const loader = new GLTFLoader();

const duckFamily = new THREE.Group();
scene.add( duckFamily );

// Duck
let duck = new THREE.Object3D();
duckFamily.add( duck );
loader.load( './assets/models/gltf/duck.gltf', (gltf) => { 
	duck.copy(gltf.scene);
} );

// Duckling
const ducklingHeight = 0.24;

function addDuckling() {
	const newDuckling = duckling.clone();
	newDuckling.position.y = ducklingHeight * (duckFamily.children.length - 1);
	duckFamily.add(newDuckling);
}

let duckling = new THREE.Object3D();
loader.load('./assets/models/gltf/duckling.gltf', (gltf) => {
	duckling.copy(gltf.scene);
	addDuckling();
} );

// Cube
let cube;
loader.load('./assets/models/gltf/cube.gltf', (gltf) => {
	cube = gltf.scene;
	scene.add( cube );
} );


//--- MOVEMENT ---///
const cubeSize = 0.8;
const movement = new THREE.Vector3();
const rotateZtoX = new THREE.Matrix3(0, 0, 1, 0, 1, 0, -1, 0, 0);

function rotateLeft() {
	duckFamily.rotation.y += Math.PI / 2;
}

function rotateRight() {
	duckFamily.rotation.y -= Math.PI / 2;
}

function moveForward() {
	jump();
	duck.getWorldDirection(movement);
	movement.applyMatrix3(rotateZtoX);
	movement.multiplyScalar(cubeSize);
	duckFamily.position.add(movement);
}

function moveBackward() {
	duck.getWorldDirection(movement);
	movement.applyMatrix3(rotateZtoX);
	movement.multiplyScalar(-cubeSize);
	duckFamily.position.add(movement);
}

async function jump() {
	let counter = 1;
	duckFamily.traverse((child) => {
		if (child.name === 'Duck' || child.name === 'Duckie') {
			child.position.y += (0.3 + 0.05 * counter) * cubeSize;
			counter++;
		}
	});
	await new Promise(resolve => setTimeout(resolve, 200));
	counter = 1;
	duckFamily.traverse((child) => {
		if (child.name === 'Duck' || child.name === 'Duckie') {
			child.position.y -= (0.3 + 0.05 * counter) * cubeSize;
			counter++;
		}
	});
}

document.addEventListener("keydown", async (e) => {
	var key = e.code;
	if (key == 'ArrowUp' || key == 'KeyW') { 
		moveForward();
	} else if (key == 'ArrowDown' || key == 'KeyS') { 
		moveBackward();
	} else if (key == 'ArrowLeft' || key == 'KeyA') {
		rotateLeft();
	} else if (key == 'ArrowRight' || key == 'KeyD') {
		rotateRight();
	} else if (key == 'Space') {
		jump();
	} else if (key == 'KeyN') {
		addDuckling();
	}
}, false);


//--- MOBILE MOVEMENT ---//
// Later may be removed
let gesture;
let startX, startY;
let distX, distY;
let threshold = 100;
let restraint = 100; 
let swipeTimeLimit = 300; 
let touchTimeLimit = 150; 
let elapsedTime;
let startTime;

async function handleGesture(direction) {
	if (direction === 'left') {
		rotateLeft();
	} else if (direction === 'right') {
		rotateRight();
	} else if (direction === 'up') {
		moveForward();
	} else if (direction === 'down') {
		moveBackward();
	} else if (direction === 'jump') {
		jump();
	}
}

document.addEventListener('touchstart', (e) => {
	const touchObject = e.changedTouches[0];
	gesture = 'none';
	startX = touchObject.pageX;
	startY = touchObject.pageY;
	startTime = new Date().getTime();
	e.preventDefault();
}, false)

document.addEventListener('touchmove', (e) => {
	e.preventDefault();
}, false)

document.addEventListener('touchend', async (e) => {
	const touchObject = e.changedTouches[0];
	distX = touchObject.pageX - startX;
	distY = touchObject.pageY - startY;
	elapsedTime = new Date().getTime() - startTime;

	if (elapsedTime < swipeTimeLimit){
		// Horizontal swipe
		if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ 
			gesture = (distX < 0) ? 'left' : 'right';
		// Vertical swipe
		} else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
			gesture = (distY < 0) ? 'up' : 'down';
		// Check if tap
		} else if (elapsedTime < touchTimeLimit && Math.abs(distX) + Math.abs(distY) <= restraint) {
			gesture = 'jump';
		}
	}
	handleGesture(gesture);
	e.preventDefault();
}, false)


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