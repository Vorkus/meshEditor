import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";
import {toggleVertices, verticesMeshes} from "./model/vertices";
import {transform} from "./model/transform/transform";
import * as THREE from "three";
import {icosahedronMesh} from "./model/icosahedron";
import {icosahedronWireframeMesh} from "./model/icosahedronWireframe";

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import {uTime} from "./main.js";

export const modePaintFaces = 'Paint faces';
export const modeSelectVertices = 'Vertex selection';
export const modeEditVertices = 'Vertex edition';
export const modeShader = 'Shaders';

export const controller = {
    mode: modePaintFaces,
    color: '#ff0000',
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    radius: 1.0,
    selectionColor: '#00ff00',
    'Reset colors': resetColors,
    'Reset selection': resetSelection,
    wireframe: true,
};
let paintDiceFolder, selectVerticesFolder;

export function initializeGUI() {
    const gui = new GUI();

    gui.add(controller, 'mode', [
        modePaintFaces,
        modeSelectVertices,
        modeEditVertices,
        modeShader,
    ]).onChange(manageModes);

    paintDiceFolder = gui.addFolder( 'Paint faces' );
    paintDiceFolder.addColor( controller, 'color' );
    paintDiceFolder.add(controller, 'Reset colors');

    selectVerticesFolder = gui.addFolder('Select vertices');
    selectVerticesFolder.add(controller, 'radius', 0.5, 1.0);
    selectVerticesFolder.addColor(controller, 'selectionColor');
    selectVerticesFolder.add(controller, 'Reset selection');

    const transformFolder = gui.addFolder('Transform');
    transformFolder.add(controller, 'wireframe').onChange(toggleVisibility);
    transformFolder.add(controller, 'scale', 0.5, 2.5).onChange(transform);
    transformFolder.add(controller, 'rotateX', 0, 2*Math.PI).onChange(transform);
    transformFolder.add(controller, 'rotateY', 0, 2*Math.PI).onChange(transform);
    transformFolder.add(controller, 'rotateZ', 0, 2*Math.PI).onChange(transform);

    reset();
    paintDiceFolder.show();
}

function manageModes() {
    reset();

    if (modePaintFaces === controller.mode) {
        paintDiceFolder.show();
    } else if (modeSelectVertices === controller.mode) {
        selectVerticesFolder.show();
        toggleVertices(true);
    } else if (modeEditVertices === controller.mode) {
        toogleDragControls(true);
        toggleVertices(true);
    } else if (modeShader === controller.mode) {
        setWireframeVisibility(true);
        icosahedronMesh.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: uTime,
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }
}

function reset() {
    toogleDragControls(false);
    toggleVertices(false);
    resetColors();
    resetMaterial();
    resetSelection();

    paintDiceFolder.hide();
    selectVerticesFolder.hide();
}

function resetColors() {
    const baseColor = new THREE.Color(0xffffff);
    const colorAttribute = icosahedronMesh.geometry.getAttribute('color');
    for (let i = 0; i < colorAttribute.count; i++) {
        colorAttribute.setXYZ(i, baseColor.r, baseColor.g, baseColor.b);
    }
    colorAttribute.needsUpdate = true;
}

function resetMaterial() {
    icosahedronMesh.material = new THREE.MeshBasicMaterial({
        vertexColors: true,
    });
}

function resetSelection() {
    verticesMeshes.forEach((vertexMesh) => {
        vertexMesh.material.color.set(0x000000);
    })
}

function setWireframeVisibility(show) {
    icosahedronWireframeMesh.visible = show;
}

function toggleVisibility() {
    icosahedronWireframeMesh.visible = !icosahedronWireframeMesh.visible;
}