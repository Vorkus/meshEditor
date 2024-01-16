import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";

export let controlsIsActive = false;
let controls;

export function initializeHelpers(scene, camera, renderer) {
    addGrid(scene);
    addAxes(scene);
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

function addAxes(scene) {
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
}

function initializeOrbitControls(camera, renderer) {
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;

    controls.addEventListener('start', function () {
        controlsIsActive = true;
    });

    controls.addEventListener('end', function () {
        controlsIsActive = false;
    });
}