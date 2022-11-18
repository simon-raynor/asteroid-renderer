import { Solid } from './geometry';

export default function cloneSolid(
    solid: Solid
): Solid {
    const { points, edges, faces } = solid;

    return {
        points: points.map(pt => [...pt]),
        edges: edges.map(ed => [...ed]),
        faces: faces.map(fc => [...fc])
    };
}