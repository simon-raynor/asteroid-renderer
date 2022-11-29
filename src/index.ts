import PhysicsObject from './PhysicsObject.js';
import { createNoise2D } from './vendor/simplex-noise/simplex-noise.js';
import Canvas from './canvas.js';
import { FaceProjection } from './geometry/geometry.js';
import getBackground from './background.js';
import { reverseProject } from './geometry/3d-projection.js';
import MarkTwo from './geometry/spacecraft/mark-two.js';
import cube from './geometry/platonics/cube.js';
import { random1 } from './helpers/random.js';
import Asteroid from './Asteroid.js';
import sumOfSquares from './helpers/sum-of-squares.js';


const noise2D = createNoise2D();


const canvas = new Canvas('#maincanvas');

const { context
    , height
    , width
    , pixelRatio } = canvas;

const backgroundCanvas = getBackground(canvas);



canvas.element.addEventListener(
    'pointerdown',
    ({pageX, pageY}) => {
        objects.push(
            new PhysicsObject(
                cube,
                {
                    position: reverseProject([pageX, pageY], canvas),
                    size: 2,
                    color: 'orange',
                    lineColor: 'red',
                    velocity: [0, 0, 0],
                    rotateAxis: [1, 1, 1],
                    spin: 0.1
                }
            )
        );
    }
)



const objects: PhysicsObject[] = [];

for (let i = 0; i <= 1000; i++) {
    objects.push(...generateAsteroidWave(i));
    objects.forEach(obj => obj.tick([]));
}


objects.push(
    new MarkTwo({
        position: [0, 0, 0],
        rotateAxis: [0, 0, 1],
        spin: 0,
        color: 'rgba(150,0,0,1)',
        lineColor: 'rgba(200,0,0,1)',
        size: 4,
        velocity: [0, 0, 0]
    })
);



let t = 0;

function tick() {
    objects.push(...generateAsteroidWave(t));

    const projections = tickAndSortProjections(objects);

    draw(projections);

    t++;
    
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

        if (sumOfSquares( obj.position[0], obj.position[1] ) > 1000 * 1000) {
            objects.splice( objects.indexOf(obj), 1 );
        }

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

    context.lineWidth = pixelRatio * 1.5;
    context.lineJoin = 'round';
    
    projections.forEach(
        ([points, color, lineColor]) => {
            context.strokeStyle = lineColor || color;
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


function generateAsteroidWave(t: number): Asteroid[] {
    const wave = [];
    
    for (
        let i = 0, n = 10;
        i <= n;
        i++
    ) {
        const noise = noise2D(i, t);
    
        if (noise > 0.97) {
            const x = 100 * (i - (n/2)),
                y = 500;
            
            wave.push(
                new Asteroid({
                    position: [ x, y, 0 ],
                    velocity: [ random1() * 0.1, (Math.random() * -0.25) - 0.5, 0 ],
                    size: 5
                })
            );
        }
    }

    return wave;
}



/*

const halfcount = 10;
const gap = 50;

for (let y = -halfcount; y <= halfcount; y++) {
    for (let x = -halfcount; x <= halfcount; x++) {
        const noiseVal = noise2D(x, y);
        console.log(noiseVal);

        if (noiseVal < 0.5) {
            continue;
        }

        objects.push(
            new Asteroid(
                {
                    position: [
                        (x * gap) + (random1() * gap / 3),
                        (y * gap) + (random1() * gap / 3),
                        1
                    ],
                    velocity: [ Math.random(), -Math.random(), 0 ],
                    size: 5 + random1()
                }
            )
        )
    }
}

*/