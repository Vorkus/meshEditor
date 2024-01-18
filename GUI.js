import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";

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
}

function manageModes() {
    reset();

    if (modePaintFaces === controller.mode) {
        paintDiceFolder.show();
    } else if (modeEditVertices === controller.mode) {
        toogleDragControls(true);
    }
}

function reset() {
    toogleDragControls(false);
    paintDiceFolder.hide();
}