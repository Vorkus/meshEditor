import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";

let controls;

export function initializeHelpers(scene, camera, renderer) {
    addGrid(scene);
    initializeOrbitControls(camera, renderer);
}

export function getControls() {
    return controls;
}

function addGrid(scene) {
    const size = 50;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper( size, divisions );
    gridHelper.position.y = -5;
    scene.add( gridHelper );
}

function initializeOrbitControls(camera, renderer) {
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.mouseButtons = {
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
    };
}