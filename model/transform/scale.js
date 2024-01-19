import {Matrix4} from "three";

export function getScaleMatrix(scale) {
    return new Matrix4(
        scale, 0, 0, 0,
        0, scale, 0, 0,
        0, 0, scale, 0,
        0, 0, 0, 1
    );
}