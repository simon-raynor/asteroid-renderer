import PhysicsObject from './PhysicsObject.js';
import Asteroid from './Asteroid.js';
import project3d from './geometry/3d-projection.js';
import cloneSolid from './geometry/clone-solid.js';
import cube from './geometry/platonics/cube.js';
import { random1 } from './helpers/random.js';
import { createNoise2D } from './vendor/simplex-noise/simplex-noise.js';
import basicSpaceship from './geometry/spacecraft/basic-spaceship.js';
import Canvas from './canvas.js';
import { FaceProjection } from './geometry/geometry.js';
import getBackground from './background.js';



const noise2D = createNoise2D();


const canvas = new Canvas('#maincanvas');

const { element
    , context
    , height
    , width
    , pixelRatio
    , centre: [centreX, centreY] } = canvas;

const halfcount = 5;
const gap = Math.ceil(Math.min(height, width) / (1 + (halfcount * 2)));

const backgroundCanvas = getBackground(canvas);




const objects: PhysicsObject[] = [];

objects.push(
    new PhysicsObject(
        basicSpaceship,
        {
            position: [0, 0, 0],
            rotateAxis: [0, 0, 1],
            spin: 0.01,
            color: [0, 100, 50],
            size: 10,
            velocity: [0, 0, 0]
        }
    )
);


for (let y = -halfcount; y <= halfcount; y++) {
    for (let x = -halfcount; x <= halfcount; x++) {
        const noiseVal = noise2D(x, y);
        //console.log(noiseVal);

        if (-0.333 < noiseVal && noiseVal < 0.333) {
            continue;
        }

        objects.push(
            new Asteroid(
                3,
                {
                    position: [
                        (x * gap),// + (Math.random() * 75),
                        (y * gap),// + (Math.random() * 75),
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



function tick() {
    const projections = tickAndSortProjections(objects);

    draw(projections);
    
    window.requestAnimationFrame(tick);
}

tick();





function tickAndSortProjections(
    objects: PhysicsObject[]
): Array<FaceProjection> {
    const projections: Array<FaceProjection> = [];

    const unticked = objects.slice();

    // iterate backwards so that we can remove things easier
    for (let i = unticked.length - 1; i >= 0; i--) {
        const obj = unticked.pop();

        obj.tick(unticked);

        projections.push(...obj.projectToCanvas(canvas));
    }

    return projections.sort((a, b) => calculateViewportDistance(b) - calculateViewportDistance(a));
}

function calculateViewportDistance(face: FaceProjection) {
    return face.reduce((total, pt) => total + pt[2], 0) / face.length;
}




function draw(
    projections: Array<FaceProjection>
) {
    context.clearRect(0, 0, width * pixelRatio, height * pixelRatio);
    context.drawImage(backgroundCanvas.element, 0, 0);

    context.lineWidth = 1.5;
    context.lineJoin = 'round';
    
    projections.forEach(
        projection => {
            context.strokeStyle = `hsla(10,70%,80%,0.5)`;
            context.fillStyle = `hsla(10,70%,40%,0.5)`;

            context.beginPath();

            projection.forEach(
                ([x, y], idx) => {
                    if (idx) {
                        context.lineTo(x, y);
                    } else {
                        context.moveTo(x, y);
                    }
                }
            );

            context.lineTo(projection[0][0], projection[0][1]);

            context.fill();
            context.stroke();

            context.closePath();
        }
    );
}