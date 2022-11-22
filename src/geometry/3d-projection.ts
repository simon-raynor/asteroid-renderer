import Canvas from '../canvas';
import { FaceProjection, Point } from './geometry';


const cos30 = Math.cos(Math.PI / 6),
    cos60 = Math.cos(Math.PI / 3);

const scale = 2;

export default function project3d(
    point: Point,
    canvas: Canvas
): FaceProjection[0] {
    // https://en.wikipedia.org/wiki/3D_projection#Perspective_projection
    const {
        pixelRatio,
        centre: [centreX, centreY]
    } = canvas;

    const [ax, ay, az] = point;

    const zScale = 1;

    return [
        centreX - (pixelRatio * (scale / zScale) * ((-1 * cos30 * ax) + (cos30 * ay))),
        pixelRatio * (scale / zScale) * ((-1 * cos60 * ax) + (-1 * cos60 * ay) - az) + centreY,
        ax + ay - az // viewline distance
    ];
}