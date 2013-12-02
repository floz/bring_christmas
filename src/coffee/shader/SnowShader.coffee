class SnowShader

    attributes: 
        size: { type: "f", value: [] }
        time: { type: "f", value: [] }
        customColor: { type: "c", value: [] }
        idx: { type: "f", value: [] }

    uniforms:
        texture: { type: "t", value: null }
        globalTime: { type: "f", value: 0.0 }
        color: { type: "c", value: new THREE.Color( 0x777777 ) }
        idxVisible: { type: "f", value: 0.0 }

    vertexShader: [

        "attribute float size;"
        "attribute float time;"
        "attribute vec3 customColor;"
        "attribute float idx;"

        "uniform float globalTime;"
        "uniform float idxVisible;"

        "varying vec3 vColor;"
        "varying float fAlpha;"
        "varying float vShow;"

        "void main() {"

            "vColor = customColor;"

            "vShow = 0.0;"
            "vec3 pos = position;"
            "if ( idx < idxVisible ) {"

                "vShow = 0.0;"
                "gl_Position = vec4( position, 1.0 );"

            "} else {"

                "vShow = 1.0;"

                "float localTime = time + globalTime;"
                "float modTime = mod( localTime, 1.0 );"
                "float accTime = modTime * modTime;"

                # "pos.x += cos( modTime * 8.0 + position.z ) * 70.0 + ( accTime / 5.0 );"
                "pos.x += pos.x + pos.x * accTime / 2.0 + cos( modTime * 8.0 + position.z ) * 70.0;"
                "pos.y = pos.y - pos.y * accTime;"
                "pos.z += sin( modTime * 6.0 + position.x ) * 100.0;"

                "fAlpha = ( pos.z / 1280.0 * 1.5 );"
                "if( pos.y < 100.0 )"
                    "fAlpha *= pos.y / 100.0;"

                "vec3 animated = vec3( pos.x, pos.y, pos.z );"
                "vec4 mvPosition = modelViewMatrix * vec4( animated, 1.0 );"

                "gl_PointSize = min( 150.0, size * ( 150.0 / length( mvPosition.xyz ) ) );"
                "gl_Position = projectionMatrix * mvPosition;"

            "}"

        "}"

    ].join "\n"

    fragmentShader: [

        "uniform vec3 color;"
        "uniform sampler2D texture;"

        "varying vec3 vColor;"
        "varying float fAlpha;"
        "varying float vShow;"

        "void main() {"

            "if ( vShow == 0.0 )"
                "discard;"

            "gl_FragColor = vec4( color * vColor, fAlpha );"
            "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );"

        "}"

    ].join "\n"

