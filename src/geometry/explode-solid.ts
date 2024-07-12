import sumOfSquares from "../helpers/sum-of-squares";
import PhysicsObject from "../PhysicsObject";
import { Solid } from "./geometry";

export default function explodeSolid(
    initial: Solid
) {
    const retVal = [];

    const { points, faces } = initial;

    faces.forEach(
        facePts => {
            const pts = facePts.map(ptIdx => points[ptIdx]);
            
            const centre = pts.reduce(
                (memo, [x, y, z]) => ([
                    memo[0] + x,
                    memo[1] + y,
                    memo[2] + z
                ]),
                [0, 0, 0]
            ).map(val => val / pts.length);

            /* const magnitude = Math.sqrt(sumOfSquares(...centre));

            const normalised = centre.map(
                (val) => val / magnitude
            ) */

            retVal.push(
                {
                    points: pts,
                    edges: [[0,1], [0,2], [1,2]],
                    faces: [[0, 1, 2], [2, 1, 0]]
                },
            );
        }
    );

    return retVal;
}