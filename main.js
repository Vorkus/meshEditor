import {initializeScene} from "./scene";
import {initializeCamera} from "./camera";
import {initializeRenderer} from "./renderer";
import {getControls, initializeHelpers} from "./helpers";
import {addModel} from "./model";

let scene, camera, renderer;

initialize();
animate();

function initialize() {
    scene = initializeScene();
    camera = initializeCamera();
    renderer = initializeRenderer();
    initializeHelpers(scene, camera, renderer);
    addModel(scene, camera, renderer, getControls());
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}