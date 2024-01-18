import {icosahedronMesh, initializeIcosahedron} from "./icosahedron";
import {icosahedronWireframeMesh, initializeIcosahedronWireframe} from "./icosahedronWireframe";
import {initializeVertices, isSameVertex, verticesMeshes} from "./verticesMeshes";
import {controller, modeEditVertices} from "../GUI";
import {raycaster} from "../main";
import * as THREE from "three";

export let verticesGroups = {};

export function initializeModel() {
    initializeIcosahedron();
    initializeIcosahedronWireframe();
    initializeVertices();
    initializeVerticesGroups();
}

export function checkIntersection() {
    if (controller.mode !== modeEditVertices) {
        let intersects = raycaster.intersectObject(icosahedronMesh);
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
}

function initializeVerticesGroups() {
    for (let i = 0; i < verticesMeshes.length; i++) {
        let vertex = verticesMeshes[i];
        verticesGroups[vertex.id] = [];
        verticesGroups[vertex.id]['icosahedron'] = getVerticesAtPosition(icosahedronMesh, vertex.position);
        verticesGroups[vertex.id]['icosahedronWireframe'] = getVerticesAtPosition(icosahedronWireframeMesh, vertex.position);
    }
}

function getVerticesAtPosition(mesh, position) {
    const positionAttribute = mesh.geometry.getAttribute('position');
    let verticesIndexes = [];

    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
        );
        if (isSameVertex(vertex, position)) {
            verticesIndexes.push(i);
        }
    }

    return verticesIndexes;
}