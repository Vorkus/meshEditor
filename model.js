import * as THREE from "three";
import {TransformControls} from "three/addons/controls/TransformControls";

let icosahedron, geometry, points;

export function addModel(scene, camera, renderer, controls) {
    scene.add(buildIcosahedron(new THREE.Object3D()));

    // addTransformControl(scene, camera, renderer, controls);
}

export function intersects(raycaster) {
    const intersects = raycaster.intersectObject( icosahedron );
    if (intersects.length > 0) {
        const face = intersects[0].face;

        const color = new THREE.Color( Math.random() * 0xffffff ); // random color

        const colorAttribute = intersects[0].object.geometry.getAttribute( 'color' );

        colorAttribute.setXYZ( face.a, color.r, color.g, color.b );
        colorAttribute.setXYZ( face.b, color.r, color.g, color.b );
        colorAttribute.setXYZ( face.c, color.r, color.g, color.b );

        colorAttribute.needsUpdate = true;


        console.log(face,intersects[0].object.geometry.attributes.color);
    }
}

function buildIcosahedron(object) {
    geometry = new THREE.IcosahedronGeometry();

    // Initialize color property for every face
    // Every face must have is own set of 3 vertices -> non-indexed
    // Ico has 60 vertices because every vertice must be cloned 5 times so each face has a unique "that" vector, so 12 x 5 = 60
    geometry = geometry.toNonIndexed();
    const count = geometry.attributes.position.count;
    geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );


    const material = new THREE.MeshBasicMaterial({
        // color: 0x00ff00,
        // wireframe: true,
        vertexColors: true,
    });
    icosahedron = new THREE.Mesh(geometry, material);
    object.add(icosahedron);

    buildVertexPoints(geometry.getAttribute('position'), object);

    return object;
}

function buildVertexPoints(position, object) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', position);

    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xff0000,
    });

    const points = new THREE.Points(geometry, material);
    object.add(points);
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