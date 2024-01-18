import * as THREE from "three";

export const scene = initializeScene();
function initializeScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    return scene;
}