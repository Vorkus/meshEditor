import * as THREE from "three";
import {controller} from "./GUI";

let icosahedron, vertices;

export function initializeModel(scene) {
    const object = new THREE.Object3D();

    const geometry = initializeIcosahedronGeometry();
    object.add(initializeIcosahedronMesh(geometry));
    object.add(initializeWiredIcosahedron(geometry));
    object.add(initializeVerticesPoints(geometry));

    scene.add(object);
}

export function checkIntersection(raycaster) {
    const intersects = raycaster.intersectObject(icosahedron);
    if (intersects.length > 0) {
        const face = intersects[0].face;
        const color = new THREE.Color(controller.color);
        const colorAttribute = intersects[0].object.geometry.getAttribute('color');

        colorAttribute.setXYZ(face.a, color.r, color.g, color.b);
        colorAttribute.setXYZ(face.b, color.r, color.g, color.b);
        colorAttribute.setXYZ(face.c, color.r, color.g, color.b);

        colorAttribute.needsUpdate = true;
    }
}

function initializeIcosahedronGeometry() {
    const geometry = new THREE.IcosahedronGeometry(2);

    // Initialize color property for every face
    // Every face must have its own set of 3 vertices -> non-indexed
    // Ico has 60 vertices because every vertice must be cloned 5 times so each face has a unique "that" vector, so 12 x 5 = 60
    // Buffer geometries are non-indexed by default
    const count = geometry.attributes.position.count;
    geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3), 3 ) );
    const baseColor = new THREE.Color(0xffffff);
    for (let i = 0; i < geometry.getAttribute('position').count; i++) {
        geometry.getAttribute('color').setXYZ(i, baseColor.r, baseColor.g, baseColor.b);
    }

    return geometry;
}

function initializeIcosahedronMesh(geometry) {
    const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
    });
    icosahedron = new THREE.Mesh(geometry, material);

    return icosahedron;
}

function initializeWiredIcosahedron(geometry) {
    const wiredMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
    });

    return new THREE.Mesh(geometry, wiredMaterial);
}

function initializeVerticesPoints(geometry) {
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xff0000,
    });
    vertices = new THREE.Points(geometry, material);

    return vertices;
}