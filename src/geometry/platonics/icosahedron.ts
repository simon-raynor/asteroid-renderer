const north = [ 0, 1, 0 ];
const south = [ 0, -1, 0 ];

const atanHalf = Math.atan( 0.5 );

const topHalfPts = [];
const bottomHalfPts = [];

for ( let i = 0, n = 10; i < n; i++ ) {
    
    let yaw     = 2 * Math.PI * i / n,
        pitch   = i % 2
                ? -atanHalf
                : atanHalf;
    
    const coords = [
        Math.cos( pitch ) * -1 * Math.sin( yaw ),
        Math.sin( pitch ),
        Math.cos( pitch ) * Math.cos( yaw )
    ];

    i % 2
    ? bottomHalfPts.push(coords)
    : topHalfPts.push(coords);

}

const points: Array<[number, number, number]> = [
    north,
    ...topHalfPts,
    ...bottomHalfPts,
    south
];


const edges = [] as Array<[number, number]>;
const faces = [] as Array<number[]>;

const northIdx = 0,
    southIdx = 11;

[topHalfPts, bottomHalfPts].forEach(
    (pts, bottom) => pts.forEach(
        (pt, idx) => {
            const offset = (bottom ? 6 : 1);

            const pointIdx = idx + offset;
            const polePoint = bottom
                            ? southIdx
                            : northIdx;
            const nextPoint = ((idx + 1) % 5) + offset;
            const nextDiagonalPoint = bottom
                                    ? ((idx + 1) % 5) + 1
                                    : pointIdx + 5  // topHalf pts can just use the same index
                                                    // with the bottomHalf's offset

            const outerEdge: [number, number] = [ polePoint, pointIdx ];
            const innerEdge: [number, number] = [ pointIdx, nextDiagonalPoint ];
            const horizontalEdge: [number, number] = [ pointIdx, nextPoint ];
            
            edges.push(
                outerEdge,
                innerEdge,
                horizontalEdge,
            );

            const outerFace = [
                pointIdx,
                polePoint,
                nextPoint
            ];
            
            const innerFace = [
                pointIdx,
                nextPoint,
                nextDiagonalPoint
            ]

            if (bottom) {
                outerFace.reverse();
                innerFace.reverse();
            }

            faces.push(outerFace,  innerFace);
        }
    )
);


export default {
    points,
    edges,
    faces
};