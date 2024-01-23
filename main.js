import {scene} from "./scene";
import {camera} from "./camera";
import {renderer} from "./renderer";
import {initializeHelpers} from "./helpers";
import * as THREE from "three";
import {initializeGUI} from "./GUI";
import {checkClickIntersection, initializeModel} from "./model/model";

export const raycaster = new THREE.Raycaster();
export const uTime = {
    type: 'f',
    value: 0.0,
};
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();

initialize();
window.addEventListener('resize', onWindowResize);
window.addEventListener('click', onClick);
animate();

function initialize() {
    initializeModel();
    initializeHelpers();
    initializeGUI();
}

function animate() {
    requestAnimationFrame(animate);
    uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
    // calculate pointer position in normalized device coordinates (-1 to +1) for both components
    // MouseEvent ranges [0, innerWidth] for x and [0, innerHeight] for y, with 0,0 on top left
    // Additionally to normalization, Y must be inverted since in MouseEvent going down on vertical axis is positive

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);
    checkClickIntersection();
}