import * as THREE from "three";
import {scene} from "../scene";

export let geometry, icosahedronMesh;

export function initializeIcosahedron() {
    initializeIcosahedronGeometry();
    initializeFacesColor();
    initializeIcosahedronMesh();

    scene.add(icosahedronMesh);
}

function initializeIcosahedronGeometry() {
    geometry = new THREE.IcosahedronGeometry(1);
}

function initializeFacesColor() {
    // Initialize color property for every face, each face must have its own set of 3 vertices -> non-indexed
    // Ico has 60 vertices because every vertice must be cloned 5 times so each face has a unique "that" vector, so 12 x 5 = 60
    // Buffer geometries are non-indexed by default
    const count = geometry.attributes.position.count;
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const baseColor = new THREE.Color(0xffffff);
    for (let i = 0; i < geometry.getAttribute('position').count; i++) {
        geometry.getAttribute('color').setXYZ(i, baseColor.r, baseColor.g, baseColor.b);
    }
}

function initializeIcosahedronMesh() {
    const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
    });
    icosahedronMesh = new THREE.Mesh(geometry, material);
}