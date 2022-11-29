import sumOfSquares from "../helpers/sum-of-squares.js";
import PhysicsObject from "../PhysicsObject.js";

// hacked together from https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects

export default function(
    object1: PhysicsObject,
    object2: PhysicsObject
) {
    const [px1, py1] = object1.position;
    const [vx1, vy1] = object1.velocity;
    const size1 = object1.size;
    const speed1 = Math.sqrt(sumOfSquares(vx1, vy1));
    const angle1 = vx1 ? Math.atan(vy1 / vx1) : Math.PI / 2;
    const mass1 = Math.pow(object1.size, 3);

    const [px2, py2] = object2.position;
    const [vx2, vy2] = object2.velocity;
    const size2 = object2.size;
    const speed2 = Math.sqrt(sumOfSquares(vx2, vy2));
    const angle2 = vx2 ? Math.atan(vy2 / vx2) : Math.PI / 2;
    const mass2 = Math.pow(object2.size, 3);

    const totalMass = mass1 + mass2;

    const collideAngle = Math.atan((py2 - py1) / (px2 - px1));


    const object1Numerator = (speed1 * Math.cos(angle1 - collideAngle) * (mass1 - mass2))
                            + (2 * mass2 * speed2 * Math.cos(angle2 - collideAngle));
    
    const object1X = ((object1Numerator / totalMass) * Math.cos(collideAngle))
                    + (speed1 * Math.sin(angle1 - collideAngle) * Math.cos(collideAngle + (Math.PI / 2)));
    const object1Y = ((object1Numerator / totalMass) * Math.sin(collideAngle))
                    + (speed1 * Math.sin(angle1 - collideAngle) * Math.sin(collideAngle + (Math.PI / 2)));
    
    object1.velocity[0] = object1X;
    object1.velocity[1] = object1Y;

    
    const object2Numerator = (speed2 * Math.cos(angle2 - collideAngle) * (mass2 - mass1))
                            + (2 * mass1 * speed1 * Math.cos(angle1 - collideAngle));
    
    const object2X = ((object2Numerator / totalMass) * Math.cos(collideAngle))
                    + (speed2 * Math.sin(angle2 - collideAngle) * Math.cos(collideAngle + (Math.PI / 2)));
    const object2Y = ((object2Numerator / totalMass) * Math.sin(collideAngle))
                    + (speed2 * Math.sin(angle2 - collideAngle) * Math.sin(collideAngle + (Math.PI / 2)));

    object2.velocity[0] = object2X;
    object2.velocity[1] = object2Y;

    // TODO: move the objects away from each other

}
