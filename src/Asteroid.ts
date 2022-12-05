import ExpolodingObject from "./ExplodingObject.js";
import cloneSolid from "./geometry/clone-solid.js";
import { Solid } from "./geometry/geometry";
import cube from "./geometry/platonics/cube.js";
import icosahedron from "./geometry/platonics/icosahedron.js";
import tetrahedron from "./geometry/platonics/tetrahedron.js";
import { createQuaternion } from "./geometry/quaternions.js";
import { cartesianToSpherical, sphericalToCartesian } from './geometry/spherical-coordinates.js';

import { random1 } from './helpers/random.js';

import PhysicsObject from "./PhysicsObject.js";



export default class Asteroid extends ExpolodingObject {
    constructor(
        args: Partial<PhysicsObject> = {}
    ) {
        const baseSolid = cloneSolid(icosahedron);
        const typeSize = 1;
        const maxVariance = Math.PI / 10;

        const spherical = cartesianToSpherical(baseSolid.points);

        baseSolid.points = sphericalToCartesian(
            spherical.map(
                ([radius, inclination, azimuth]) => {
                    return [
                        radius,
                        inclination + (maxVariance * random1()),
                        azimuth + (maxVariance * random1())
                    ];
                }
            )
        );


        const hue = 180 + (Math.random() * 25);

        super(
            baseSolid,
            {
                ...args,
                size: args.size * typeSize,
                angle: Math.random() * Math.PI,
                rotateAxis: [
                    random1(),
                    random1(),
                    random1()
                ],
                spin: 0.025 + (Math.random() * 0.025),
                color: `hsla(${hue},75%,50%,1)`,
                lineColor: `hsla(${hue},75%,33.33%,1)`
            }
        );
    }
}