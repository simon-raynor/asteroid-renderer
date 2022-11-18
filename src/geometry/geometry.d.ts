
export type Angle = [number, number, number];

export type Point = [number, number, number];
export type Edge = [number, number];
export type Face = number[]; // TODO: do we need non triangular faces? I think so

export interface Solid {
    points: Point[],
    edges: Edge[],
    faces: Face[]
}