import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";
import {toggleVertices} from "./model/vertices";
import {scale} from "./model/model";

export const modePaintFaces = 'Paint faces';
export const modeEditVertices = 'Vertex edition';
export const controller = {
    mode: modePaintFaces,
    color: '#FF0000',
    rotate: '',
    scale: 1,
};
let paintDiceFolder;

export function initializeGUI() {
    const gui = new GUI();

    gui.add(controller, 'mode', [modePaintFaces, modeEditVertices]).onChange(manageModes);

    paintDiceFolder = gui.addFolder( 'Paint faces' );
    paintDiceFolder.addColor( controller, 'color' );

    const transformFolder = gui.addFolder('Transform');
    transformFolder.add(controller, 'scale', 0.5, 2.5).onChange(scale);

    reset();
    paintDiceFolder.show();
}

function manageModes() {
    reset();

    if (modePaintFaces === controller.mode) {
        paintDiceFolder.show();
    } else if (modeEditVertices === controller.mode) {
        toogleDragControls(true);
        toggleVertices(true);
    }
}

function reset() {
    toogleDragControls(false);
    toggleVertices(false);
    paintDiceFolder.hide();
}