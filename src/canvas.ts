export default class Canvas {
    element: HTMLCanvasElement
    context: CanvasRenderingContext2D

    height: number
    width: number
    centre: [number, number]

    pixelRatio: number

    constructor(
        target: HTMLCanvasElement | string
    ) {
        if (typeof target === 'string') {
            this.element = document.querySelector(target);
        } else {
            this.element = target;
        }

        if (!this.element) {
            throw new Error('Unable to intialise Canvas: invalid target');
        }

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.centre = [this.width / 2, this.height / 2];

        this.pixelRatio = window.devicePixelRatio;

        this.context = this.element.getContext('2d');

        // set up the canvas to use ratio for better graphics
        // NOTE: remember to also multiply when using draw commands
        this.element.width = this.width * this.pixelRatio;
        this.element.height = this.height * this.pixelRatio;
        this.element.style.transform = `scale: ${ 1 / this.pixelRatio }`;
    }
}