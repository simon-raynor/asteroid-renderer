//
//   y+ z+
//    \ |
//     \|
//      o----x+
//
//     2-----0
//    / \   /
//   /   \ /
//  3-----1
//

import { Edge, Point } from "../geometry";

const points: Array<Point> = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1]
];


const edges: Array<Edge> = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [1, 3],
    [2, 3]
];


const faces = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
];


export default {
    points,
    edges,
    faces
};