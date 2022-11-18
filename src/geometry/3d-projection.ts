import { Point, Angle } from './geometry';

import canvas from '../canvas.js';

const { centre: [centreX, centreY] } = canvas;

const cos30 = Math.cos(Math.PI / 6),
    cos60 = Math.cos(Math.PI / 3);

const scale = 2;

export default function project3d(
    point: Point
): [number, number] {
    // https://en.wikipedia.org/wiki/3D_projection#Perspective_projection

    const [ax, ay, az] = point;

    const zScale = 1;

    return [
        (scale / zScale) * ((-1 * cos30 * ax) + (cos30 * ay)) + centreX,
        (scale / zScale) * ((-1 * cos60 * ax) + (-1 * cos60 * ay) + az) + centreY
    ];
}