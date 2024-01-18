import * as THREE from "three";
import {Vector3} from "three";
import {scene} from "./scene";
import {controller, modeEditVertices} from "./GUI";
import {raycaster} from "./main";

export let vertices;
let icosahedron, wiredIcosahedron, vertexOriginalPosition;

export function initializeModel() {
    const object = new THREE.Object3D();
    const geometry = initializeIcosahedronGeometry();
    object.add(initializeIcosahedronMesh(geometry));
    object.add(initializeWiredIcosahedron(geometry));
    initializeVerticesPoints(geometry.getAttribute('position'), object);

    scene.add(object);
}

export function checkIntersection() {
    if (controller.mode !== modeEditVertices) {
        let intersects = raycaster.intersectObject(icosahedron);
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

export function vertexChangeStart(event) {
    vertexOriginalPosition = event.object.position.clone();
}

export function repositionVertices(event) {
    let newVertexPosition = event.object.position;
    translateVertices(icosahedron, vertexOriginalPosition, newVertexPosition);
    translateVertices(wiredIcosahedron, vertexOriginalPosition, newVertexPosition);
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
    wiredIcosahedron = new THREE.Mesh(geometry, wiredMaterial);

    return wiredIcosahedron;
}

function initializeVerticesPoints(verticesPosition, object) {

    const alreadyInitializedVertices = [];
    vertices = [];
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
                new THREE.MeshBasicMaterial({ color: 0x000000 })
            );

            verticeMesh.position.set(
                verticesPosition.getX(i),
                verticesPosition.getY(i),
                verticesPosition.getZ(i),
            );

            vertices.push(verticeMesh);
            object.add(verticeMesh);
        }
    }
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