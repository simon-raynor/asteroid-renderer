import { Angle } from "./geometry";

export type Quaternion = [number, number, number, number];

export function createQuaternion(
    angle: number,
    vector: [number, number, number]
): Quaternion {
    const halfCos = Math.cos(angle / 2),
        halfSin = Math.sin(angle / 2);
    
    const [x, y, z] = vector;

    return [halfCos, x * halfSin, y * halfSin, z * halfSin] as Quaternion;
}

// NOTE: assumes rotation around [0, 0, 0]
export function rotateByQuaternion(
    vector: [number, number, number],
    quaternion: Quaternion
): [number, number, number] {
    const [px, py, pz] = vector;
    const pt = 0;

    const [qt, qx, qy, qz] = quaternion;
    const qSize = (qt * qt) + (qx * qx) + (qy * qy) + (qz * qz);
    const [invT, invX, invY, invZ] = [qt / qSize, -qx / qSize, -qy / qSize, -qz / qSize];

    const st = ( qt * pt ) - ( qx * px ) - ( qy * py ) - ( qz * pz ),
        sx = ( qt * px ) + ( qx * pt ) + ( qy * pz ) - ( qz * py ),
        sy = ( qt * py ) - ( qx * pz ) + ( qy * pt ) + ( qz * px ),
        sz = ( qt * pz ) + ( qx * py ) - ( qy * px ) + ( qz * pt );
    
    return [
        (st * invX) + (sx * invT) + (sy * invZ) - (sz * invY),
        (st * invY) - (sx * invZ) + (sy * invT) + (sz * invX),
        (st * invZ) + (sx * invY) - (sy * invX) + (sz * invT)
    ];
}