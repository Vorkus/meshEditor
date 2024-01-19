import {icosahedronMesh, initializeIcosahedron} from "./icosahedron";
import {icosahedronWireframeMesh, initializeIcosahedronWireframe} from "./icosahedronWireframe";
import {initializeVertices, isSameVertex, verticesMeshes} from "./vertices";
import {controller, modeEditVertices, modePaintFaces, modeSelectVertices} from "../GUI";
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

export function checkIntersection() {
    if (modePaintFaces === controller.mode) {
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
    } else if (modeSelectVertices === controller.mode) {
        let intersects = raycaster.intersectObject(icosahedronMesh);
        if (intersects.length > 0) {
            verticesMeshes.forEach((vertexMesh) => {
                if (controller.radius > distance(vertexMesh.position, intersects[0].point)) {
                    vertexMesh.material.color.set(controller.selectionColor);
                }
            })
        }
    }
}

export function scale(scale) {
    // Threejs allows to apply methods to internal matrices but the access to them is just read only
    // icosahedronMesh.matrix.makeScale(scale, scale, scale);
    // icosahedronWireframeMesh.matrix.makeScale(scale, scale, scale);
    // // This must be set to false to not let three recalculate matrix at every frame (erasing any manual change)
    // icosahedronMesh.matrixAutoUpdate = false;
    // icosahedronWireframeMesh.matrixAutoUpdate = false;

    icosahedronMesh.scale.set(scale, scale, scale);
    icosahedronWireframeMesh.scale.set(scale, scale, scale);
    verticesMeshes.forEach((vertexMesh) => {
        // The transformations applied to icosahedron meshes must be applied to the coordinate too
        // The position of icosahedronMesh remains the same as the start,
        // applying the transformation matrix we get the final position of the point
        const anyVertexInGroupIndex = Object.values(verticesGroups[vertexMesh.id]['icosahedron'])[0];
        let newPosition = icosahedronMesh.getVertexPosition(anyVertexInGroupIndex, new Vector3());
        newPosition = icosahedronMesh.localToWorld(newPosition);
        vertexMesh.position.set(newPosition.x, newPosition.y, newPosition.z);
        vertexMesh.scale.set(scale, scale, scale);
    })
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