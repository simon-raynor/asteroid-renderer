//
//   y+ z+
//    \ |
//     \|
//      o----x+
//
//  3----7
//  |\   |\
//  | \  | \
//  |  1----5
//  2--|-6  |
//   \ |  \ |
//    \|   \|
//     0----4
//

import { Edge } from "../geometry";

const points = [];

for (let x = -1; x <= 1; x+=2) {
    for (let y = -1; y <= 1; y+=2) {
        for (let z = -1; z <= 1; z+=2) {
            points.push([x, y, z]);
        }
    }
}


const edges: Array<Edge> = [
    [0 , 1],
    [0, 2],
    [0, 4],
    [1, 3],
    [1, 5],
    [2, 3],
    [2, 6],
    [3, 7],
    [4, 5],
    [4, 6],
    [5, 7],
    [6, 7]
];


const faces = [
    [0, 2, 3, 1],
    [0, 1, 5, 4],
    [0, 4, 6, 2],
    [1, 3, 7, 5],
    [2, 6, 7, 3],
    [4, 5, 7, 6]
];


export default {
    points,
    edges,
    faces
};