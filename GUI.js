import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";

export const controller = {
    mode: 'Paint faces',
    color: '#FF0000',
};
let paintDiceFolder;

export function initializeGUI() {
    const gui = new GUI();

    gui.add(controller, 'mode', ['Paint faces', 'Edit vertices']).onChange(() => {
        reset();

        if ('Paint faces' === controller.mode) {
            paintDiceFolder.show();
        } else if ('Edit vertices' === controller.mode) {
            toogleDragControls(true);
        }
    });

    paintDiceFolder = gui.addFolder( 'Paint the dice' );
    paintDiceFolder.addColor( controller, 'color' );


}

function reset() {
    toogleDragControls(false);
    paintDiceFolder.hide();
}