import * as THREE from "three";
import {TransformControls} from "three/addons/controls/TransformControls";

let cube;

export function addModel(scene, camera, renderer, controls) {
    addCube(scene);
    addTransformControl(scene, camera, renderer, controls);
}

function addCube(scene) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.MeshBasicMaterial( {
        color: 0x000000,
        linewidth: 1,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin:  'round' //ignored by WebGLRenderer
    } );

    cube = new THREE.LineSegments( wireframe, material );
    scene.add( cube );
}

function addTransformControl(scene, camera, renderer, controls) {
    const transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', function(event) {
        // Disable OrbitControls while using transformControls
        controls.enabled = !event.value;
    });
    transformControl.attach(cube);
    scene.add(transformControl);
}