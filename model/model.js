import {icosahedronMesh, initializeIcosahedron} from "./icosahedron";
import {icosahedronWireframeMesh, initializeIcosahedronWireframe} from "./icosahedronWireframe";
import {initializeVertices, isSameVertex, toggleVertexColor, verticesMeshes} from "./vertices";
import {controller, modePaintFaces, modeSelectVertices} from "../GUI";
import {raycaster} from "../main";
import * as THREE from "three";
import {Vector3} from "three";

export let verticesGroups = {};

export function initializeModel() {
    initializeIcosahedron();
    initializeIcosahedronWireframe();
    initializeVertices();
    initializeVerticesGroups();
}

export function checkClickIntersection() {
    if (modePaintFaces === controller.mode) {
        let intersects = raycaster.intersectObject(icosahedronMesh);
        if (intersects.length > 0) {
            const face = intersects[0].face;
            const color = new THREE.Color(controller.color);
            const colorAttribute = icosahedronMesh.geometry.getAttribute('color');

            colorAttribute.setXYZ(face.a, color.r, color.g, color.b);
            colorAttribute.setXYZ(face.b, color.r, color.g, color.b);
            colorAttribute.setXYZ(face.c, color.r, color.g, color.b);

            colorAttribute.needsUpdate = true;
        }
    } else if (modeSelectVertices === controller.mode) {
        let intersects = raycaster.intersectObject(icosahedronMesh);
        if (intersects.length > 0) {
            verticesMeshes.forEach((vertexMesh) => {
                if (controller.radius > distance(vertexMesh.position, intersects[0].point)) {
                    toggleVertexColor(vertexMesh, controller.selectionColor);
                }
            })
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
        const vertex = mesh.getVertexPosition(i, new Vector3());
        if (isSameVertex(vertex, position)) {
            verticesIndexes.push(i);
        }
    }

    return verticesIndexes;
}

function distance(a, b) {
    return Math.sqrt(
        Math.pow(b.x - a.x, 2) +
        Math.pow(b.y - a.y, 2) +
        Math.pow(b.z - a.z, 2)
    );
}