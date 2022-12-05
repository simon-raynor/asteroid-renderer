import PhysicsObject from "../PhysicsObject.js";
import { Solid } from "../geometry/geometry.js";

export default class Spaceship extends PhysicsObject {
    constructor(
        baseSolid: Solid,
        args: Partial<Spaceship>
    ) {
        super(baseSolid, args);
    }
}