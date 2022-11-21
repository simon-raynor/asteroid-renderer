import cloneSolid from "../clone-solid.js";
import { Solid } from "../geometry.js";
import tetrahedron from "../platonics/tetrahedron.js";


const points = [
    [1, 0, -1/6],
    [-1, 0.5, -1/6],
    [-1, -0.5, -1/6],
    [-2/3, 0, 1/3],
    // wingtips
    [-1, 1, -1/6],
    [-1, -1, -1/6]
];

const extraFaces = [
    [0, 1, 4],
    [0, 4, 1],
    [0, 5, 2],
    [0, 2, 5]
];

const baseSolid = cloneSolid(tetrahedron);

baseSolid.faces.push(...extraFaces);

const basicSpaceship = {
    ...baseSolid,
    points: points.slice()
} as Solid;

export default basicSpaceship;