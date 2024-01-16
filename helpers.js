import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {DragControls} from "three/addons";
import {repositionVertices, vertexChangeStart, vertices} from "./model";

export let orbitControls, dragControls;

export function initializeHelpers(scene, camera, renderer) {
    addGrid(scene);
    initializeOrbitControls(camera, renderer);
    initializeDragControls(camera, renderer);
}

export function toogleDragControls(enable) {
    dragControls.enabled = enable;
}

function addGrid(scene) {
    const size = 50;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper( size, divisions );
    gridHelper.position.y = -5;
    scene.add( gridHelper );
}

function initializeOrbitControls(camera, renderer) {
    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.enablePan = false;
    orbitControls.mouseButtons = {
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
    };
}

function initializeDragControls(camera, renderer) {
    dragControls = new DragControls(vertices, camera, renderer.domElement)
    dragControls.enabled = false;

    dragControls.addEventListener('dragstart', vertexChangeStart)
    dragControls.addEventListener('dragend', repositionVertices)
}