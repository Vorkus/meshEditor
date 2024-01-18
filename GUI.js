import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";
import {toggleVertices} from "./model/verticesMeshes";

export const modePaintFaces = 'Paint faces';
export const modeEditVertices = 'Edit vertices';
export const controller = {
    mode: modePaintFaces,
    color: '#FF0000',
};
let paintDiceFolder;

export function initializeGUI() {
    const gui = new GUI();

    gui.add(controller, 'mode', [modePaintFaces, modeEditVertices]).onChange(manageModes);

    paintDiceFolder = gui.addFolder( 'Paint the dice' );
    paintDiceFolder.addColor( controller, 'color' );

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