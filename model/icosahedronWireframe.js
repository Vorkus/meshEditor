import * as THREE from "three";
import {geometry} from "./icosahedron";
import {scene} from "../scene";

export let icosahedronWireframeMesh;

// Multi-material meshes were availbale in past versions of Three.js but its use isn't recommended anymore.
// "Personally, I do not recommend using multi-material meshes in three.js at all, use separate meshes instead."
// https://discourse.threejs.org/t/some-issues-when-export-a-single-mesh-with-multiple-materials-using-gltf-exporter/50395/7

export function initializeIcosahedronWireframe() {
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
    });
    icosahedronWireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

    scene.add(icosahedronWireframeMesh);
}