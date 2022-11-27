import Canvas from '../canvas';
import { FaceProjection, Point } from './geometry';


const cos30 = Math.cos(Math.PI / 6),
    sin30 = Math.sin(Math.PI / 6),
    cos60 = Math.cos(Math.PI / 3),
    sin60 = Math.sin(Math.PI / 3);

console.log(cos30, cos60, sin30, sin60);

const scale = 1.5;


const [cameraX, cameraY] = [0, 0];


export default function project3d(
    point: Point,
    canvas: Canvas
): FaceProjection[0][0] {
    // https://en.wikipedia.org/wiki/3D_projection#Perspective_projection
    const {
        pixelRatio,
        centre: [centreX, centreY]
    } = canvas;

    const [ax, ay, az] = point;

    const x = ax - cameraX,
        y = ay - cameraY;

    return [
        pixelRatio * (centreX - scale * (y * cos30 - x * cos30)),
        pixelRatio * (scale * ((-1 * cos60 * x) + (-1 * cos60 * y) - az) + centreY),
        ax + ay - az // viewline distance
    ];
}

export function reverseProject(
    [px, py]: [number, number],
    canvas: Canvas
): Point {
    const {
        pixelRatio,
        centre: [centreX, centreY]
    } = canvas;

    const x = (px - centreX) / cos30,
        y = py - centreY;

    return [
        ((x/2) - y) / scale,
        (-(x/2) - y) / scale,
        0
    ];
}