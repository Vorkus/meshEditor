import * as THREE from "three";

export function initializeScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    return scene;
}