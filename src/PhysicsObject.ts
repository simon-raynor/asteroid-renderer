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
    color: string
    lineColor: string

    health: number
    private damageTick: boolean
    dead: boolean

    protected _geometry: Solid

    constructor(
        baseSolid: Solid,
        {
            position = [0, 0, 0],
            velocity = [0, 0, 0],
            angle = 0,
            rotateAxis = null,
            spin = 0,
            size = 1,
            color = 'white',
            lineColor = null,
            health = null
        }: Partial<PhysicsObject>
    ) {
        this.position = position.slice() as Point;
        this.velocity = velocity.slice() as number[];
        this.angle = angle;
        this.spin = spin;
        this.color = color;
        this.lineColor = lineColor;

        if (rotateAxis) {
            const [rx, ry, rz] = rotateAxis;
            const rotateAxisMagnitude = Math.sqrt((rx * rx) + (ry * ry) + (rz * rz));
            this.rotateAxis = [rx / rotateAxisMagnitude, ry / rotateAxisMagnitude, rz / rotateAxisMagnitude];
        } else {
            this.rotateAxis = null;
        }

        // only scale once
        // TODO: YAGNI: may want inflation type effect at some point
        this._geometry = cloneSolid(baseSolid);
        this._geometry.points = this._geometry.points.map(pt => scalePoint(pt, size));
        this.size = size;

        this.health = health || Math.pow(size, 3);
    }

    tick(unticked: Array<PhysicsObject>) {
        if (!this.position) {
            throw new Error('no position');
        }
        if (this.dead) {
            throw new Error('is dead');
        }

        this.damageTick = false;

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
                const minDistance = Math.pow(this.size + other.size, 2);

                if ( distance < minDistance ) {
                    elasticCollision(this, other);

                    this.damage(other.size * other.size);
                    other.damage(this.size * this.size);
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
                let rotated = point;
                
                if (this.rotateAxis) {
                    rotated = rotateByQuaternion(
                        point,
                        createQuaternion(this.angle, this.rotateAxis)
                    );
                }

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
            facePoints => [
                facePoints.map(
                    pointIdx => project3d(
                        points[pointIdx],
                        canvas
                    )
                ),
                this.damageTick
                ? 'red'
                : this.color,
                this.damageTick
                ? 'darkred'
                : this.lineColor
            ] as FaceProjection
        );
    }

    damage(amount: number) {
        this.health -= amount;
        this.damageTick = true;

        if (!this.dead && this.health <= 0) {
            this.die();
        }
    }

    
    die() {
        this.dead = true;
    }
}