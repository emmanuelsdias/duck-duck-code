import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { puzzles } from './puzzles.js';

//--- RENDERER ---///
const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio(devicePixelRatio); // Makes mobile aspect ratio weird
document.body.appendChild( renderer.domElement );


//--- CAMERA ---///
const d = 4;
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
scene.background = new THREE.Color( 0x98eade );


//--- LIGHTS ---///
const ambientLight = new THREE.AmbientLight( 0xCCFDFF, 1.0 ); 
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 );
directionalLight.position.set( 1, 2, 0 );
scene.add( directionalLight );


//--- OBJECT MODELS ---///
const loader = new GLTFLoader();

let duckFamily = new THREE.Group();
scene.add( duckFamily );

// Duck
let duck;
loader.load( './assets/models/gltf/duck.gltf', (gltf) => { 
	duck = gltf.scene;
	const tempDuck = new THREE.Object3D();
	tempDuck.copy( duck );
	duckFamily.add( tempDuck );
} );

// Duckling
let duckling;
loader.load('./assets/models/gltf/duckling.gltf', (gltf) => {
	duckling = gltf.scene;
});


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
	duckFamily.children[0].getWorldDirection(movement);
	movement.applyMatrix3(rotateZtoX);
	movement.multiplyScalar(cubeSize);
	duckFamily.position.add(movement);
	checkRescues();
}

function moveBackward() {
	duckFamily.children[0].getWorldDirection(movement);
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

let recentMovement = false;

document.addEventListener("keydown", async (e) => {
	if (recentMovement) {
		return;
	}	
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
		rescueDuckling();
	}

	recentMovement = true;
	await new Promise(resolve => setTimeout(resolve, 200));
	recentMovement = false;
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

let recentGesture = false;

async function handleGesture(direction) {
	if (recentGesture) {
		return;
	}
	elapsedTime = new Date().getTime() - startTime
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
	recentGesture = true;
	await new Promise(resolve => setTimeout(resolve, 100));
	recentGesture = false;
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


//--- MAPS ---//
const lostDucklings = new THREE.Group();
scene.add( lostDucklings );

function spawnDuckling( x, z, y ) {
	const newDuckling = new THREE.Object3D();
	newDuckling.copy(duckling);
	newDuckling.position.set( x+0.1, z, y );
	lostDucklings.add( newDuckling );
}

const ducklingHeight = 0.24;

function rescueDuckling() {
	const newDuckling = duckling.clone();
	newDuckling.position.y = duckFamily.position.y + ducklingHeight * (duckFamily.children.length - 1);
	newDuckling.position.y += (0.34 + 0.05 * duckFamily.children.length) * cubeSize;
	duckFamily.add( newDuckling );
}

function addPuzzleToScene( puzzleMap ) {
	const cubeMap = new THREE.Group();
	scene.add( cubeMap );
  
	const rows = puzzleMap.split('\n');
	
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (cell !== '.') {
				const cubeColor = ((x + y) % 2 == 0) ? 0xEBAFE5 : 0xB689B2;
        const cubeGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: cubeColor });
        const cubeTile = new THREE.Mesh( cubeGeometry, cubeMaterial );
        cubeTile.position.set( x*cubeSize, -0.7, y*cubeSize);
        cubeMap.add( cubeTile );
      }
			if (cell === 'D') {
				duckFamily.position.set( x*cubeSize, 0, y*cubeSize );
				camera.position.set( d + x*cubeSize, d, d + y*cubeSize );
				camera.lookAt( x*cubeSize, 0, y*cubeSize );
			}
			if (cell === 'C') {
				spawnDuckling( x*cubeSize, -0.5, y*cubeSize );
			}
    }
  }
	
}


//--- GAMEPLAY FUNCTIONS ---//
let foundEveryDuckling = false;

function checkRescues() {
	lostDucklings.children.forEach((child) => {
		if (child.position.y == -0.5) {
			const deltaX = Math.abs(child.position.x - duckFamily.position.x);
			const deltaZ = Math.abs(child.position.z - duckFamily.position.z);
			if ((deltaX + deltaZ) < 0.4) {
				lostDucklings.remove(child);
				rescueDuckling();
			}
		}
	});
	if(lostDucklings.children.length == 0) {
		foundEveryDuckling = true;
	}
}


//--- MAIN LOOP ---///
let loading = true
let puzzleNum = 0;

function animate() {
	requestAnimationFrame( animate );
	if (loading && duckling && duck) {
		foundEveryDuckling = false;
		addPuzzleToScene(puzzles[puzzleNum]);
		loading = false;
	}
	if (foundEveryDuckling) {
		puzzleNum = (puzzleNum + 1) % puzzles.length;
		scene.remove.apply(scene, scene.children);
		// duckFamily.children.forEach((child) => {
		// 	duckFamily.remove(child);
		// });
		// duckFamily.add( duck );
		duckFamily = new THREE.Group();
		const tempDuck = new THREE.Object3D();
		tempDuck.copy( duck )
		tempDuck.position.y += 0.35 * cubeSize;
		duckFamily.add( tempDuck )
		// scene.add( )
		scene.add( directionalLight );
		scene.add( ambientLight );
		scene.add( duckFamily );
		scene.add( lostDucklings );
		loading = true;
	}
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'warning-container' ).appendChild( warning );
}