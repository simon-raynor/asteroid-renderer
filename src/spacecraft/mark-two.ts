import PhysicsObject from "../PhysicsObject.js";
import cloneSolid from "../geometry/clone-solid.js";
import { Point, Solid } from "../geometry/geometry.js";
import octahedron from "../geometry/platonics/octahedron.js";
import Spaceship from "./Spaceship.js";

const points = [
    [-0.25, 0, 0.5],
    [2, 0, 0],
    [0, 1, 0],
    [-1, 0, 0],
    [0, -1, 0],
    [-0.25, 0, 0.5],
    // wingtips
    [-1.25, 1.5, 0],
    [-1.25, -1.5, 0],
 ] as Point[];

const extraFaces = [
    [2, 3, 6],
    [6, 3, 2],
    [3, 4, 7],
    [7, 3, 4]
];

const baseSolid = cloneSolid(octahedron);

baseSolid.points = points.slice();
baseSolid.faces.push(...extraFaces);

export default class MarkTwo extends Spaceship {
    constructor(args: Partial<MarkTwo>) {
        super(baseSolid, args);
    }
}