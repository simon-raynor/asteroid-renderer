import canvas from './canvas.js';
import PhysicsObject from './PhysicsObject.js';
import Asteroid from './Asteroid.js';
import project3d from './geometry/3d-projection.js';
import cloneSolid from './geometry/clone-solid.js';
import cube from './geometry/platonics/cube.js';
import { random1 } from './helpers/random.js';
import { createNoise2D } from './vendor/simplex-noise/simplex-noise.js';
import basicSpaceship from './geometry/spacecraft/basic-spaceship.js';



const noise2D = createNoise2D();


const { context
    , height
    , width
    , centre: [centreX, centreY] } = canvas;

const halfcount = 10;
const gap = Math.min(height, width) / (1 + (halfcount * 2));


const objects: PhysicsObject[] = [];

objects.push(
    new PhysicsObject(
        basicSpaceship,
        {
            position: [0, 0, 0],
            rotateAxis: [0, 0, 1],
            spin: 0.01,
            color: [0, 100, 50],
            size: 10
        }
    )
)

console.log(objects[0])

for (let y = -halfcount; y <= halfcount; y++) {
    for (let x = -halfcount; x <= halfcount; x++) {
        const noiseVal = noise2D(x, y);
        //console.log(noiseVal);

        if (-0.5 < noiseVal && noiseVal < 0.5) {
            continue;
        }

        objects.push(
            new Asteroid(
                3,
                {
                    position: [
                        (x * 40),// + (Math.random() * 75),
                        (y * 40),// + (Math.random() * 75),
                        1
                    ],
                    velocity: [
                        0.2 * random1(),
                        0.2 * random1(),
                        0
                    ],
                    size: 8 + (2 * random1())
                }
            )
        )
    }
}


function draw(t) {
    context.clearRect(0, 0, width, height);

    context.lineWidth = 2;
    context.lineJoin = 'round';

    const queue = objects.slice();

    let obj;

    while (obj = queue.pop()) {
        if (obj) {
            try {
                obj.tick(queue);
            } catch (ex) {
                objects.splice(
                    queue.length,
                    1
                );

                continue;
            }

            drawOne(obj);
        }
    }


    /* objects.forEach(
        obj => {
            obj.tick();
            drawOne(obj);
        }
    ); */
}

function drawOne(thing: PhysicsObject) {
    const { color,
            projection } = thing;
    
    projection.forEach(
        facePoints => {
            context.strokeStyle = `hsla(${color[0]},${color[1]}%,${color[2]}%,0.7)`;
            context.fillStyle = `hsla(${color[0]},${color[1]}%,${color[2]}%,0.3)`;

            context.beginPath();

            facePoints.forEach(
                ([x, y], idx) => {
                    if (idx) {
                        context.lineTo(x, y);
                    } else {
                        context.moveTo(x, y);
                    }
                }
            );

            context.lineTo(facePoints[0][0], facePoints[0][1]);

            context.stroke();
            context.fill();

            context.closePath();
        }
    )
}


let t = 0;

function tick() {
    draw(t++);

    window.requestAnimationFrame(tick);
}

tick();
//draw(0);