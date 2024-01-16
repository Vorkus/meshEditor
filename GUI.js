import GUI from "lil-gui";

export const controller = {
    color: '#FF0000',
};

export function initializeGUI() {
    const gui = new GUI();

    const folder = gui.addFolder( 'Paint the dice' );
    folder.addColor( controller, 'color' );
}