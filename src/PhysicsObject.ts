import cloneSolid from "./geometry/clone-solid.js";
import { Angle, Face, FaceProjection, Point, Solid } from "./geometry/geometry";
import rotatePoint from "./geometry/rotate-point.js";
import scalePoint from "./geometry/scale-point.js";
import project3d from './geometry/3d-projection.js';
import { createQuaternion, Quaternion, rotateByQuaternion } from "./geometry/quaternions.js";
import elasticCollision from "./geometry/elastic-collision.js";
import Canvas from "./canvas.js";
import sumOfSquares from "./helpers/sum-of-squares.js";

export default class PhysicsObject {
    position: Point
    velocity: number[]
    maxVelocity: number
    angle: number
    rotateAxis: Point
    spin: number
    size: number
    color: [number, number, number]

    protected _geometry: Solid

    constructor(
        baseSolid: Solid,
        {
            position = [0, 0, 0],
            velocity = [0, 0, 0],
            angle = 0,
            rotateAxis = [0, 0, 0],
            spin = 0,
            size = 1,
            color = [0, 0, 250]
        }: Partial<PhysicsObject>
    ) {
        this._geometry = cloneSolid(baseSolid);
        this.position = position.slice() as Point;
        this.velocity = velocity.slice() as number[];
        this.angle = angle;
        this.rotateAxis = rotateAxis.slice() as Point;
        this.spin = spin;
        this.color = color;

        const [rx, ry, rz] = rotateAxis;
        const rotateAxisMagnitude = Math.sqrt((rx * rx) + (ry * ry) + (rz * rz));
        this.rotateAxis = [rx / rotateAxisMagnitude, ry / rotateAxisMagnitude, rz / rotateAxisMagnitude];

        // only scale once
        // TODO: YAGNI: may want inflation type effect at some point
        this._geometry.points = this._geometry.points.map(pt => scalePoint(pt, size));
        this.size = size;
    }

    tick(unticked: Array<PhysicsObject>) {
        if (!this.position) {
            throw new Error('no position');
        }

        // collision detection
        unticked.forEach(
            other => {
                if (!other.position) {
                    return;
                }

                const [ax, ay, az] = this.position,
                    [bx, by, bz] = other.position;
                
                const [dx, dy, dz] = [ax - bx, ay - by, az - bz];

                const distance = sumOfSquares(dx, dy, dz);
                const minDistance = (this.size * this.size) + (other.size * other.size);

                if ( distance < minDistance ) {
                    elasticCollision(this, other);
                }
            }
        );

        this.position = this.position.map(
            (val, idx) => val + (this.velocity[idx] || 0)
        ) as Point;

        this.angle += this.spin;
    }

    get geometry(): Solid {
        const result = cloneSolid(this._geometry);

        result.points = result.points.map(
            point => {
                const rotated = rotateByQuaternion(
                    point,
                    createQuaternion(this.angle, this.rotateAxis)
                );

                return rotated.map((dim, idx) => dim + this.position[idx]) as Point;
            }
        );

        return result;
    }

    projectToCanvas(
        canvas: Canvas
    ): Array<FaceProjection> {
        const { geometry: { faces, points } } = this;

        return faces.map(
            facePoints => facePoints.map(
                pointIdx => project3d(
                    points[pointIdx],
                    canvas
                )
            )
        );
    }
}