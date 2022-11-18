const {
    abs,
    sin,
    cos,
    sqrt,
    atan,
    PI
} = Math;

export function cartesianToSpherical(
    cartesian: Array<[number, number, number]>,

    // precalcRadii is only useful if we **know** that
    // all the points are arranged a fix distance from the
    // origin
    precalcRadii: boolean = false
): Array<[number, number, number]> {

    let radiusOverride: number | null = null,
        xyDistanceOverride: number | null = null;
    
    if (precalcRadii) {
        const [x, y, z] = cartesian[0];

        radiusOverride = sqrt((x*x) + (y*y) + (z*z));
        xyDistanceOverride = sqrt((x*x) + (y*y));
    }

    return cartesian.map(
        ([x, y, z]) => {
            // TODO: test that a truthy || avoids the sqrt 
            const radius = radiusOverride || sqrt((x*x) + (y*y) + (z*z));
            const xyDistance = xyDistanceOverride || sqrt((x*x) + (y*y));

            let inclination = x ? atan(y/x) : PI / 2;

            if (x < 0) {
                inclination += PI;
            } else if (y < 0) {
                inclination += (PI * 2);
            }

            let azimuth = z
                        ? atan( xyDistance / z )
                        : PI / 2;
            
            if (!azimuth && z < 0) {
                azimuth = PI * -2;
            }

            return [radius, inclination, azimuth];
        }
    )
}

export function sphericalToCartesian(
    spherical: Array<[number, number, number]>,
    radiusOverride?: number
): Array<[number, number, number]> {
    return spherical.map(
        ([r, inclination, azimuth]) => {
            const radius = radiusOverride || r;

            let x = abs(radius * sin(azimuth) * cos(inclination)),
                y = abs(radius * sin(azimuth) * sin(inclination)),
                z = abs(radius * cos(azimuth));

            // for some reason there's bugs with the +/- signs
            // which this fixes
            if (inclination > PI / 2 && inclination < 3 * PI / 2) {
                // x must be negative
                x *= -1;
            }
            if (inclination > PI) {
                y *= -1;
            }
            if (azimuth < 0) {
                z *= -1;
            }

            return [x, y, z];
        }
    )
}