import * as THREE from "three";
import {Vector3} from "three";
import {scene} from "../scene";
import {icosahedronMesh} from "./icosahedron";
import {icosahedronWireframeMesh} from "./icosahedronWireframe";
import {verticesGroups} from "./model";

export const verticesMeshes = [];

export function initializeVertices() {
    const verticesPosition = icosahedronMesh.geometry.getAttribute('position');
    const alreadyInitializedVertices = [];
    for (let i = 0; i < verticesPosition.count; i++) {
        const vertex = icosahedronMesh.getVertexPosition(i, new Vector3());
        if (!vertexIsInitialized(alreadyInitializedVertices, vertex)) {
            alreadyInitializedVertices.push(vertex);

            const verticeMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.075),
                new THREE.MeshBasicMaterial({color: 0x000000})
            );

            verticeMesh.position.set(vertex.x, vertex.y, vertex.z);

            verticesMeshes.push(verticeMesh);
            scene.add(verticeMesh);
        }
    }
}

export function toggleVertices(show) {
    for (let i = 0; i < verticesMeshes.length; i++) {
        verticesMeshes[i].visible = show;
    }
}

export function verticesUpdate(event) {
    const vertexIndex = event.object.id;
    const position = event.object.position;

    updateVertices(icosahedronMesh, verticesGroups[vertexIndex]['icosahedron'], position);
    updateVertices(icosahedronWireframeMesh, verticesGroups[vertexIndex]['icosahedronWireframe'], position);
}

export function isSameVertex(vertex1, vertex2, fixed = 5) {
    return vertex1.x.toFixed(fixed) === vertex2.x.toFixed(fixed)
        && vertex1.y.toFixed(fixed) === vertex2.y.toFixed(fixed)
        && vertex1.z.toFixed(fixed) === vertex2.z.toFixed(fixed);
}

export function toggleVertexColor(vertexMesh, color) {
    if (vertexMesh.material.color.equals(new THREE.Color(color))) {
        vertexMesh.material.color.set(0x000000);
    } else {
        vertexMesh.material.color.set(color);
    }
}

function vertexIsInitialized(alreadyInitializedVertices, vertex) {
    for (let i = 0; i < alreadyInitializedVertices.length; i++) {
        if (isSameVertex(alreadyInitializedVertices[i], vertex)) {
            return true;
        }
    }

    return false;
}

function updateVertices(mesh, indexesToUpdate, position) {
    const verticesPosition = mesh.geometry.getAttribute('position');

    // If any change has been applied to the mesh it must be reflected on the point
    // We pick the point that we want to move in world coordinates, so them must be translated to local
    // We use a clone to not modify also the draggable vertex
    position = mesh.worldToLocal(position.clone());

    indexesToUpdate.forEach((index) => {
        verticesPosition.setXYZ(
            index,
            position.x,
            position.y,
            position.z
        );
    });

    // After modifying the vertices bounding limits become invalid, setting them to null will force raycaster to recompute them
    mesh.geometry.boundingSphere = null;
    mesh.geometry.boundingBox = null;
    verticesPosition.needsUpdate = true;
}