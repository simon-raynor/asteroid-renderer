import { Point } from './geometry';


export default function rotatePoint( 
    point: Point,
    angles: [number, number?, number?],
    centre: Point = [0, 0, 0]
): Point {
    
    let [x, y, z] = point;
    let [pitch, yaw, roll] = angles;
    let [cx, cy, cz] = centre


    let s, c;
    
    cx = cx || 0;
    cy = cy || 0;
    cz = cz || 0;
    
    x = x - cx;
    y = y - cy;
    z = z - cz;
    
    if ( pitch ) { // rotate on x
        
        const sinP = Math.sin( pitch );
        const cosP = Math.cos( pitch );
            
        const matrix = [
                        [ 1, 0, 0 ],
                        [ 0, cosP, -sinP ],
                        [ 0, sinP, cosP ]
                    ];
        
        const result = matrix.reduce(
                    function( m, i ) {
                        
                        m.push(
                            ( i[ 0 ] * x )
                            +
                            ( i[ 1 ] * y )
                            +
                            ( i[ 2 ] * z )
                        );
                        
                        return m;
                        
                    },
                    []
                );
        
        x = result[ 0 ];
        y = result[ 1 ];
        z = result[ 2 ];
        
    }
    
    if ( yaw ) { // rotate on y
        
        const sinY = Math.sin( yaw );
        const cosY = Math.cos( yaw );
            
        const matrix = [
                        [ cosY, 0, sinY ],
                        [ 0, 1, 0 ],
                        [ -sinY, 0, cosY ]
                    ];
        
        const result = matrix.reduce(
                        function( m, i ) {
                            
                            m.push(
                                ( i[ 0 ] * x )
                                +
                                ( i[ 1 ] * y )
                                +
                                ( i[ 2 ] * z )
                            );
                            
                            return m;
                            
                        },
                        []
                    );
        
        x = result[ 0 ];
        y = result[ 1 ];
        z = result[ 2 ];
        
    }
    
    if ( roll ) { // rotate on z
        
        const sinR = Math.sin( roll );
        const cosR = Math.cos( roll );
            
        const matrix = [
                        [ cosR, -sinR, 0 ],
                        [ sinR, cosR, 0 ],
                        [ 0, 0, 1 ]
                    ];
        
        const result = matrix.reduce(
                        function( m, i ) {
                            
                            m.push(
                                ( i[ 0 ] * x )
                                +
                                ( i[ 1 ] * y )
                                +
                                ( i[ 2 ] * z )
                            );
                            
                            return m;
                            
                        },
                        []
                    );
        
        x = result[ 0 ];
        y = result[ 1 ];
        z = result[ 2 ];
        
    }
    
    return [
        x + cx,
        y + cy,
        z + cz
    ];
    
}