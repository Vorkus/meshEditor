import {initializeScene} from "./scene";
import {initializeCamera} from "./camera";
import {initializeRenderer} from "./renderer";
import {controlsIsActive, getControls, initializeHelpers} from "./helpers";
import {addModel, intersects} from "./model";
import * as THREE from "three";

let scene, camera, renderer;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


initialize();
window.addEventListener( 'click', onPointerMove );
window.addEventListener( 'resize', onWindowResize );
animate();

function initialize() {
    scene = initializeScene();
    camera = initializeCamera();
    renderer = initializeRenderer();
    initializeHelpers(scene, camera, renderer);
    addModel(scene, camera, renderer, getControls());
}

function animate() {
    requestAnimationFrame( animate );
    render();
    renderer.render( scene, camera );
}

function onPointerMove( event ) {
    console.log(controlsIsActive)
    if (!controlsIsActive) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera(pointer, camera);
        // calculate objects intersecting the picking ray
        intersects(raycaster);
    }
}

function render() {
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}