import GUI from "lil-gui";
import {toogleDragControls} from "./helpers";

export const controller = {
    color: '#FF0000',
    enable: false,
};

export function initializeGUI() {
    const gui = new GUI();

    let folder = gui.addFolder( 'Paint the dice' );
    folder.addColor( controller, 'color' );

    folder = gui.addFolder('Edit the vertices');
    folder.add(controller, 'enable').onChange(() => {
        toogleDragControls(controller.enable);
    });
}