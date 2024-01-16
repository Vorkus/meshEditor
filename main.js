import {initializeScene} from "./scene";
import {initializeCamera} from "./camera";
import {initializeRenderer} from "./renderer";
import {getControls, initializeHelpers} from "./helpers";
import {initializeModel, checkIntersection} from "./model";
import * as THREE from "three";
import {initializeGUI} from "./GUI";

let scene, camera, renderer;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

initialize();
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'click', onClick );
animate();

function initialize() {
    scene = initializeScene();
    camera = initializeCamera();
    renderer = initializeRenderer();
    initializeHelpers(scene, camera, renderer);
    initializeModel(scene, camera, renderer, getControls());
    initializeGUI();
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onClick( event ) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);
    checkIntersection(raycaster);
}