export default function sumOfSquares(
    ...args: number[]
): number {
    return args.reduce(
        (memo, arg) => memo + (arg * arg),
        0
    );
}