import * as THREE from "three";
import {Vector3} from "three";
import {scene} from "../scene";
import {geometry, icosahedronMesh} from "./icosahedron";
import {icosahedronWireframeMesh} from "./icosahedronWireframe";

export const verticesMeshes = [];
let vertexOriginalPosition;

export function initializeVertices() {
    const verticesPosition = geometry.getAttribute('position');
    const alreadyInitializedVertices = [];
    for (let i = 0; i < verticesPosition.count; i++) {
        if (!vertexIsInitialized(
            alreadyInitializedVertices,
            verticesPosition.getX(i),
            verticesPosition.getY(i),
            verticesPosition.getZ(i),
        )
        ) {
            alreadyInitializedVertices.push(new Vector3(
                verticesPosition.getX(i),
                verticesPosition.getY(i),
                verticesPosition.getZ(i),
            ));

            const verticeMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({color: 0x000000})
            );

            verticeMesh.position.set(
                verticesPosition.getX(i),
                verticesPosition.getY(i),
                verticesPosition.getZ(i),
            );

            verticesMeshes.push(verticeMesh);
            scene.add(verticeMesh);
        }
    }
}

export function toggleVertices(show) {
    for (let i = 0; i < verticesMeshes.length;  i++) {
        console.log(verticesMeshes[i]);
        verticesMeshes[i].visible = show;
    }
}

export function vertexChangeStart(event) {
    vertexOriginalPosition = event.object.position.clone();
}

export function repositionVertices(event) {
    let newVertexPosition = event.object.position;
    translateVertices(icosahedronMesh, vertexOriginalPosition, newVertexPosition);
    translateVertices(icosahedronWireframeMesh, vertexOriginalPosition, newVertexPosition);
}

function translateVertices(mesh, oldVertexPosition, newVertexPosition) {
    const position = mesh.geometry.getAttribute('position');
    for (let i = 0; i < position.count; i++) {
        let vertex = new Vector3(
            position.getX(i),
            position.getY(i),
            position.getZ(i),
        );

        if (isSameVertex(oldVertexPosition, vertex, 5)) {
            position.setXYZ(
                i,
                newVertexPosition.x,
                newVertexPosition.y,
                newVertexPosition.z
            );
        }
    }
    // After modifying the vertices bounding limits become invalid, setting them to null will make raycaster to recompute them
    mesh.geometry.boundingSphere = null;
    mesh.geometry.boundingBox = null;
    position.needsUpdate = true;
}

function vertexIsInitialized(alreadyInitializedVertices, x, y, z) {
    for (let i = 0; i < alreadyInitializedVertices.length; i++) {
        if (isSameVertex(alreadyInitializedVertices[i], new Vector3(x, y, z))) {
            return true;
        }
    }

    return false;
}

function isSameVertex(vertex1, vertex2, fixed = 5) {
    return vertex1.x.toFixed(fixed) === vertex2.x.toFixed(fixed)
        && vertex1.y.toFixed(fixed) === vertex2.y.toFixed(fixed)
        && vertex1.z.toFixed(fixed) === vertex2.z.toFixed(fixed);
}