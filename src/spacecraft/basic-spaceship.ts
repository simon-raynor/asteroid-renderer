import PhysicsObject from "../PhysicsObject.js";
import cloneSolid from "../geometry/clone-solid.js";
import { Point, Solid } from "../geometry/geometry.js";
import tetrahedron from "../geometry/platonics/tetrahedron.js";


const points = [
    [1, 0, -1/6],
    [-1, 0.5, -1/6],
    [-1, -0.5, -1/6],
    [-0.9, 0, 1/3],
    // wingtips
    [-0.9, 1, -1/6],
    [-0.9, -1, -1/6]
] as Point[];

const extraFaces = [
    [0, 1, 4],
    [0, 4, 1],
    [0, 5, 2],
    [0, 2, 5]
];

const baseSolid = cloneSolid(tetrahedron);

baseSolid.points = points.slice();
baseSolid.faces.push(...extraFaces);

export default class BasicSpaceship extends PhysicsObject {
    constructor(args: Partial<BasicSpaceship>) {
        super(baseSolid, args);
    }
}