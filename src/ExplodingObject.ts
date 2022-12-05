import Canvas from "./canvas.js";
import { FaceProjection, Point } from "./geometry/geometry.js";
import sumOfSquares from "./helpers/sum-of-squares.js";
import PhysicsObject from "./PhysicsObject.js";
import ThreeDeeObject from "./ThreeDeeObject.js";

export default class ExpolodingObject extends ThreeDeeObject {
    protected _parts: PhysicsObject[]
    dying: number

    projectToCanvas(
        canvas: Canvas
    ): Array<FaceProjection> {
        if (!this._parts) {
            return super.projectToCanvas(canvas);
        } else {
            return this._parts.reduce(
                (projections, part) => [...projections, ...part.projectToCanvas(canvas) as FaceProjection[]],
                [] as Array<FaceProjection>
            );
        }
    }

    tick(unticked: PhysicsObject[]) {
        if (this.dying) {
            this.die();
        }

        if (!this._parts || this.dead) {
            super.tick(unticked);
        } else {
            this._parts.forEach(
                part => part.tick([])
            );
        }
    }

    damage(amount: number): void {
        if (!this.dying) {
            super.damage(amount);
        }
    }

    die() {
        if (!this.dying) {
            this.dying = 1;
            this.explode();
        } else if (this.dying < 25) {
            this.dying += 1;
        } else {
            super.die();
        }
    }

    explode() {
        const parts = [] as PhysicsObject[];

        const { color
            , lineColor
            , geometry: { points, faces } } = this;

        faces.forEach(
            facePts => {
                const pts = facePts.map(ptIdx => points[ptIdx].map((val, idx) => val - this.position[idx]) as Point);
                const pointCount = pts.length;

                const edges = [];
                const faces = [[], []];

                for (let i = 0; i < pointCount; i++) {
                    for (let j = i + 1; j < pointCount; j++) {
                        edges.push([i, j]);
                    }

                    faces[0].push(i);
                    faces[1].unshift(i);
                }

                const centre = pts.reduce(
                    (memo, [x, y, z]) => ([
                        memo[0] + x,
                        memo[1] + y,
                        memo[2] + z
                    ]),
                    [0, 0, 0]
                ).map(val => val / pts.length);

                const magnitude = Math.sqrt(sumOfSquares(...centre));

                const normalised = centre.map(val => val / (magnitude * 2));
                
                parts.push(
                    new PhysicsObject(
                        {
                            points: pts,
                            edges,
                            faces
                        },
                        {
                            position: centre.map((val, idx) => val + this.position[idx]) as Point,
                            velocity: normalised,
                            spin: 0.1 + Math.random() * 0.1,
                            rotateAxis: [Math.random(), Math.random(), Math.random()],
                            size: 1,
                            color,
                            lineColor
                        }
                    )
                );
            }
        );

        this._parts = parts;
    }
}