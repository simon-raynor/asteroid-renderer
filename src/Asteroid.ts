import cloneSolid from "./geometry/clone-solid.js";
import { Solid } from "./geometry/geometry";
import cube from "./geometry/platonics/cube.js";
import icosahedron from "./geometry/platonics/icosahedron.js";
import tetrahedron from "./geometry/platonics/tetrahedron.js";
import { createQuaternion } from "./geometry/quaternions.js";
import { cartesianToSpherical, sphericalToCartesian } from './geometry/spherical-coordinates.js';

import { random1 } from './helpers/random.js';

import PhysicsObject from "./PhysicsObject.js";



export default class Asteroid extends PhysicsObject {
    constructor(
        type: 1 | 2 | 3 = 3,
        args: Partial<PhysicsObject> = {}
    ) {
        let baseSolid: Solid;
        let typeSize: number;
        let maxVariance: number;

        switch (type) {
            case 1:
                baseSolid = cloneSolid(tetrahedron);
                typeSize = 0.25;
                maxVariance = Math.PI / 8;
                break;
            case 2:
                baseSolid = cloneSolid(cube);
                typeSize = 0.5;
                maxVariance = Math.PI / 25;
                break;
            case 3:
                baseSolid = cloneSolid(icosahedron);
                typeSize = 1;
                maxVariance = Math.PI / 10;
                break;
        }

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
                color: [
                    180 + (Math.random() * 25),
                    50,
                    60,
                ]
            }
        );
    }
}