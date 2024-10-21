import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from 'gsap';

//Global variables
let currentRef = null;

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

//cube
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

cube1.name = 'cube1';
cube2.name = 'cube2';
cube3.name = 'cube3';
cube1.position.x = -2;
cube3.position.x = 2;
scene.add(cube1, cube2, cube3);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

// RAYCASTER
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-1000,-1000);

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
};
window.addEventListener('pointermove', onPointerMove );

  // HANDLE CLICK ON MESH
let meshCurrentClick = null;
const hancleMeshClick = () => {

  try {
    switch (meshCurrentClick.name){
      case "cube1":
        return console.log("cubo1 clicked");
      case "cube2":
        return console.log("cubo2 clicked");
      case "cube3":
        return console.log("cubo3 clicked");
      default:
        return null;
    }
  } catch (error) {}


}
window.addEventListener('click', () => hancleMeshClick())

//Animate the scene
let meshCurrentHover = null;
const animate = () => {
  raycaster.setFromCamera(pointer, camera);

  // para seleccionar lo que quermos que haga colicion
  const collition = [
    cube1,
    cube3
  ]

  const intersects = raycaster.intersectObjects(
    collition, 
    true
  )

  // MOUSEONLEAVE
  if (meshCurrentHover) {
    gsap.to(meshCurrentHover.material.color, {
      r: 1,
      g: 1,
      b: 1,
      overwrite: true,
      duration: 2
    })
  }

  // MOUSE HOVER
  if (intersects.length) {
    meshCurrentHover = null;
    meshCurrentHover = intersects[0].object;
    meshCurrentClick = intersects[0].object;

    gsap.to(meshCurrentHover.material.color, {
      r: 1,
      g: 0,
      b: 0,
      overwrite: true,
      duration: 0.3
    })
  } else if (meshCurrentHover) {
    gsap.to(meshCurrentHover.material.color, {
      r: 1,
      g: 1,
      b: 1,
      overwrite: true,
      duration: 0.5
    })
  }



  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.traverse((object) => {
    // Limpiar geometrías
    if (object.geometry) {
      object.geometry.dispose();
    }

    // Limpiar materiales
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }

    // Limpiar texturas
    if (object.material && object.material.map) {
      object.material.map.dispose();
    }
  });
  currentRef.removeChild(renderer.domElement);
};
