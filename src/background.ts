import Canvas from "./canvas.js";
import project3d from "./geometry/3d-projection.js";
import { createNoise2D } from "./vendor/simplex-noise/simplex-noise.js";

export default function getBackground(maincanvas: Canvas) {
    const { height, width } = maincanvas;

    const gridCanvasElement = document.createElement('canvas');
    gridCanvasElement.height = height;
    gridCanvasElement.width = width;
    gridCanvasElement.style.position = 'fixed';
    gridCanvasElement.style.top = 2 * height + 'px';
    gridCanvasElement.style.left = -2 * width + 'px';
    document.body.appendChild(gridCanvasElement);

    const gridCanvas = new Canvas(gridCanvasElement);

    drawStars(gridCanvas);
    drawGrid(gridCanvas, 100);

    return gridCanvas;
}


const starNoise = createNoise2D();

function drawStars(canvas: Canvas) {
    const { context, height, width } = canvas;

    context.fillStyle = 'white';

    for (let x = 0; x <= width; x++) {
        for (let y = 0; y <= height; y++) {
            if (starNoise(x, y) > 0.95) {
                context.fillRect(x - 0.5, y - 0.5, 0.5, 0.5);
            }
        }
    }
}


function drawGrid(canvas: Canvas, size: number) {
    const { context, pixelRatio } = canvas;

    context.beginPath();

    context.lineWidth = 2 * pixelRatio;
    context.strokeStyle = 'hsla(225, 50%, 50%, 0.1';
    context.fillStyle = 'hsla(225, 50%, 50%, 0.25';

    context.font = 'monospace';

    for (let y = -10; y <= 10; y++) {
        for (let x = -10; x <= 10; x++) {
            // draw coordinate text
            const [tx, ty] = project3d([(x * size) + 4, (y * size) - 4, 0], canvas);

            context.translate(tx, ty);
            context.scale(2 * pixelRatio, pixelRatio);
            context.rotate(Math.PI / 4);

            context.fillText(`${x * size},${y * size}`, 0, 0);

            context.resetTransform();

            // draw line to the right
            const startHoriontal = project3d(
                [
                    (x * size) + (size / 10),
                    y * size,
                    0
                ],
                canvas
            );
            const endHorizontal = project3d(
                [
                    ((x + 1) * size) - (size / 10),
                    y * size,
                    0
                ],
                canvas
            );

            context.moveTo(startHoriontal[0], startHoriontal[1]);
            context.lineTo(endHorizontal[0], endHorizontal[1]);

            // draw downwards line
            const startVertical = project3d(
                [
                    x * size,
                    (y * size) + (size / 10),
                    0
                ],
                canvas
            );
            const endVertical = project3d(
                [
                    x * size,
                    ((y + 1) * size) - (size / 10),
                    0
                ],
                canvas
            );

            context.moveTo(startVertical[0], startVertical[1]);
            context.lineTo(endVertical[0], endVertical[1]);
        }
    }

    context.stroke();
}