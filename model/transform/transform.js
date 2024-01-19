import {getScaleMatrix} from "./scale";
import {controller} from "../../GUI";
import {getXRotationMatrix, getYRotationMatrix, getZRotationMatrix} from "./rotate";
import {icosahedronMesh} from "../icosahedron";
import {icosahedronWireframeMesh} from "../icosahedronWireframe";
import {verticesMeshes} from "../vertices";
import {verticesGroups} from "../model";
import {Vector3} from "three";

// DISCLAIMER:
// Threejs offers simpler ways to apply this transformations, this use is only for demonstration purposes


export function transform() {
    transformMesh(icosahedronMesh);
    transformMesh(icosahedronWireframeMesh);
    transformVertices();
}

function transformMesh(mesh) {
    const transformationMatrix = getTransformationMatrix();

    // Internal implementation of matrix is in column major order but the method set() expect the matrix to be defined in row major order
    mesh.matrix.set(
        transformationMatrix.elements[0], transformationMatrix.elements[4], transformationMatrix.elements[8], transformationMatrix.elements[12],
        transformationMatrix.elements[1], transformationMatrix.elements[5], transformationMatrix.elements[9], transformationMatrix.elements[13],
        transformationMatrix.elements[2], transformationMatrix.elements[6], transformationMatrix.elements[10], transformationMatrix.elements[14],
        transformationMatrix.elements[3], transformationMatrix.elements[7], transformationMatrix.elements[11], transformationMatrix.elements[15]
    );
    // This must be set to false to not let three recalculate matrix at every frame (erasing any manual change)
    mesh.matrixAutoUpdate = false;
}

function getTransformationMatrix() {
    return getScaleMatrix(controller.scale)
        .multiply(getXRotationMatrix(controller.rotateX))
        .multiply(getYRotationMatrix(controller.rotateY))
        .multiply(getZRotationMatrix(controller.rotateZ));
}

function transformVertices() {
    verticesMeshes.forEach((vertexMesh) => {
        // The transformations applied to icosahedron meshes must be applied to the coordinate too
        // The position of icosahedronMesh remains the same as the start,
        // applying the transformation matrix we get the final position of the point
        const anyVertexInGroupIndex = Object.values(verticesGroups[vertexMesh.id]['icosahedron'])[0];
        let newPosition = icosahedronMesh.getVertexPosition(anyVertexInGroupIndex, new Vector3());
        newPosition = icosahedronMesh.localToWorld(newPosition);
        vertexMesh.position.set(newPosition.x, newPosition.y, newPosition.z);
        vertexMesh.scale.set(controller.scale, controller.scale, controller.scale);
    })
}