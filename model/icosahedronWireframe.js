import * as THREE from "three";
import {geometry} from "./icosahedron";
import {scene} from "../scene";

export let icosahedronWireframeMesh;

export function initializeIcosahedronWireframe() {
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
    });
    icosahedronWireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

    scene.add(icosahedronWireframeMesh);
}

export function toggleVisibility() {
    icosahedronWireframeMesh.visible = !icosahedronWireframeMesh.visible;
}