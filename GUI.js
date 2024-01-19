import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";
import {toggleVertices, verticesMeshes} from "./model/vertices";
import {scale} from "./model/model";

export const modePaintFaces = 'Paint faces';
export const modeSelectVertices = 'Vertex selection';
export const modeEditVertices = 'Vertex edition';

export const controller = {
    mode: modePaintFaces,
    color: '#ff0000',
    rotate: '',
    scale: 1,
    radius: 1.0,
    selectionColor: '#00ff00',
    'Reset colors': resetColors,
};
let paintDiceFolder, selectVerticesFolder;

export function initializeGUI() {
    const gui = new GUI();

    gui.add(controller, 'mode', [
        modePaintFaces,
        modeSelectVertices,
        modeEditVertices
    ]).onChange(manageModes);

    paintDiceFolder = gui.addFolder( 'Paint faces' );
    paintDiceFolder.addColor( controller, 'color' );

    selectVerticesFolder = gui.addFolder('Select vertices');
    selectVerticesFolder.add(controller, 'radius', 0.5, 1.0);
    selectVerticesFolder.addColor(controller, 'selectionColor');
    selectVerticesFolder.add(controller, 'Reset colors');

    const transformFolder = gui.addFolder('Transform');
    transformFolder.add(controller, 'scale', 0.5, 2.5).onChange(scale);

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
    }
}

function reset() {
    toogleDragControls(false);
    toggleVertices(false);
    resetColors();

    paintDiceFolder.hide();
    selectVerticesFolder.hide();
}

function resetColors() {
    verticesMeshes.forEach((vertexMesh) => {
        vertexMesh.material.color.set(0x000000);
    })
}