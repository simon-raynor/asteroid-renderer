import PhysicsObject from './PhysicsObject.js';
import Asteroid from './Asteroid.js';
import { random1 } from './helpers/random.js';
import { createNoise2D } from './vendor/simplex-noise/simplex-noise.js';
import basicSpaceship from './geometry/spacecraft/basic-spaceship.js';
import Canvas from './canvas.js';
import { FaceProjection } from './geometry/geometry.js';
import getBackground from './background.js';
import { reverseProject } from './geometry/3d-projection.js';
import MarkTwo from './geometry/spacecraft/mark-two.js';
import BasicSpaceship from './geometry/spacecraft/basic-spaceship.js';
import cube from './geometry/platonics/cube.js';


const noise2D = createNoise2D();


const canvas = new Canvas('#maincanvas');

const { context
    , height
    , width
    , pixelRatio } = canvas;

const halfcount = 10;
const gap = 20;

const backgroundCanvas = getBackground(canvas);



canvas.element.addEventListener(
    'pointerdown',
    ({pageX, pageY}) => {
        console.log(
            [pageX - canvas.centre[0], pageY - canvas.centre[1]],
            reverseProject([pageX, pageY], canvas)
        );
        objects.push(
            new PhysicsObject(
                cube,
                {
                    position: reverseProject([pageX, pageY], canvas),
                    size: 2,
                    color: 'orange',
                    velocity: [0, 0, 0],
                    rotateAxis: [1, 1, 1],
                    spin: 0.1
                }
            )
            /* new BasicSpaceship({
                position: reverseProject([pageX, pageY], canvas),
                rotateAxis: [0, 0, 1],
                spin: 0.01,
                color: 'blue',
                size: 10,
                velocity: [0, 0, 0]
            }) */
        );console.log(objects)
    }
)



const objects: PhysicsObject[] = [];

objects.push(
    new MarkTwo({
        position: [0, 0, 0],
        rotateAxis: [0, 0, 1],
        spin: 0.01,
        color: 'red',
        size: 4,
        velocity: [0, 0, 0]
    })
);


for (let y = -halfcount; y <= halfcount; y++) {
    for (let x = -halfcount; x <= halfcount; x++) {
        const noiseVal = noise2D(x, y);
        //console.log(noiseVal);

        if (-0.75 < noiseVal && noiseVal < 0.75) {
            continue;
        }

        /* objects.push(
            new Asteroid(
                {
                    position: [
                        (x * gap),// + (Math.random() * 75),
                        (y * gap),// + (Math.random() * 75),
                        1
                    ],
                    velocity: [0, 0, 0],
                    size: 5 + random1()
                }
            )
        ) */
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

function calculateViewportDistance([points]: FaceProjection) {
    return points.reduce((total, pt) => total + pt[2], 0) / points.length;
}




function draw(
    projections: Array<FaceProjection>
) {
    context.clearRect(0, 0, width * pixelRatio, height * pixelRatio);
    context.drawImage(backgroundCanvas.element, 0, 0);

    context.lineWidth = pixelRatio/*  * 2 */;
    context.lineJoin = 'round';
    
    projections.forEach(
        ([points, color]) => {
            context.strokeStyle = `hsla(0,0%,90%,0.5)`;
            context.fillStyle = color;

            context.beginPath();

            points.forEach(
                ([x, y], idx) => {
                    if (idx) {
                        context.lineTo(x, y);
                    } else {
                        context.moveTo(x, y);
                    }
                }
            );

            context.closePath();

            context.fill();
            context.stroke();

            context.closePath();
        }
    );
}