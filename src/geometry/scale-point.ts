import { Point } from './geometry'

export default function scalePoint(point: Point, factor: number = 1) {
    return point.map(val => val * factor) as Point;
}