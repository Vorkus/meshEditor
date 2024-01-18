import {icosahedronMesh, initializeIcosahedron} from "./icosahedron";
import {initializeIcosahedronWireframe} from "./icosahedronWireframe";
import {initializeVertices} from "./vertices";
import {controller, modeEditVertices} from "../GUI";
import {raycaster} from "../main";
import * as THREE from "three";

export function initializeModel() {
    initializeIcosahedron();
    initializeIcosahedronWireframe();
    initializeVertices();
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