const canvas = document.getElementById('maincanvas') as HTMLCanvasElement | null;

if (!canvas) {
    throw new Error('Failed to initialise: no DOM target');
}

const pixelRatio = window.devicePixelRatio;

const height = canvas.offsetHeight * pixelRatio;
const width = canvas.offsetWidth * pixelRatio;

canvas.height = height;
canvas.width = width;
canvas.style.transform = `scale: ${ 1 / pixelRatio }`;

// TODO: handle canvas resizing


const context = canvas.getContext('2d');

if (!context) {
    throw new Error('Failed to initialise: no drawing context');
}


export default {
    height,
    width,
    centre: [ width / 2, height / 2 ],
    element: canvas,
    context
}