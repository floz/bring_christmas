class WindShader

    attributes: {
        aColor: {
            type: "c"
            value: null
        }
        aWindRatio: {
            type: "f"
            value: null
        }
        aWindOrientation: {
            type: "f"
            value: null
        }
        aWindLength: {
            type: "f"
            value: null
        }
        aPosition: {
            type: "v3"
            value: null
        }
    }

    uniforms: THREE.UniformsUtils.merge( [

            THREE.UniformsLib[ "common" ]
            THREE.UniformsLib[ "fog" ]
            THREE.UniformsLib[ "lights" ]
            THREE.UniformsLib[ "shadowmap" ]

            {
                "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) }
                "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) }
                "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

                "uOffsetX" : { type: "f", value: 0.0 }
                "uZoneW": { type: "f", vaue: 0.0 }
                "uFloorW": { type: "f", value: 0.0 }
                "uWindMapForce": { type: "t", value: null }
                "uWindScale": { type: "f", value: 1.0 }
                "uWindMin": { type: "v2", value: null }
                "uWindSize": { type: "v2", value: null }
                "uWindDirection": { type: "v3", value: null }
                "uMousePos": { type: "v3", value: null }
                "uWindDisplacementR": { type: "t", value: null }
                "uWindDisplacementG": { type: "t", value: null }
                "uWindDisplacementB": { type: "t", value: null }
            }

        ] )

        vertexShader: [

            "#define LAMBERT"

            "attribute vec3 aColor;"
            "attribute float aWindRatio;"
            "attribute float aWindOrientation;"
            "attribute float aWindLength;"
            "attribute vec3 aPosition;"

            "uniform float uOffsetX;"
            "uniform float uZoneW;"
            "uniform float uFloorW;"
            "uniform vec3 uMousePos;"
            "uniform sampler2D uWindMapForce;"
            "uniform float uWindScale;"
            "uniform vec2 uWindMin;"
            "uniform vec2 uWindSize;"
            "uniform vec3 uWindDirection;"
            "uniform sampler2D uWindDisplacementR;"
            "uniform sampler2D uWindDisplacementG;"
            "uniform sampler2D uWindDisplacementB;"

            "varying vec3 vLightFront;"
            "varying float vWindForce;"
            "varying vec3 vColor;"

            "#ifdef DOUBLE_SIDED"

                "varying vec3 vLightBack;"

            "#endif"

            THREE.ShaderChunk[ "map_pars_vertex" ]
            THREE.ShaderChunk[ "lightmap_pars_vertex" ]
            THREE.ShaderChunk[ "envmap_pars_vertex" ]
            THREE.ShaderChunk[ "lights_lambert_pars_vertex" ]
            THREE.ShaderChunk[ "color_pars_vertex" ]
            THREE.ShaderChunk[ "morphtarget_pars_vertex" ]
            THREE.ShaderChunk[ "skinning_pars_vertex" ]
            THREE.ShaderChunk[ "shadowmap_pars_vertex" ]

            "float convertToRange( float value, vec2 rSrc, vec2 rDest ) {"
                "return ( ( value - rSrc.x ) / ( rSrc.y - rSrc.x ) ) * ( rDest.y - rDest.x ) + rDest.x;"
            "}"

            "void main() {"

                THREE.ShaderChunk[ "map_vertex" ]
                THREE.ShaderChunk[ "lightmap_vertex" ]
                THREE.ShaderChunk[ "color_vertex" ]

                THREE.ShaderChunk[ "morphnormal_vertex" ]
                THREE.ShaderChunk[ "skinbase_vertex" ]
                THREE.ShaderChunk[ "skinnormal_vertex" ]
                THREE.ShaderChunk[ "defaultnormal_vertex" ]

                THREE.ShaderChunk[ "morphtarget_vertex" ]
                THREE.ShaderChunk[ "skinning_vertex" ]
                # THREE.ShaderChunk[ "default_vertex" ]

                "vec4 mvPosition;"

                "#ifdef USE_SKINNING"

                    "mvPosition = modelViewMatrix * skinned;"

                "#endif"

                "#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )"

                    "mvPosition = modelViewMatrix * vec4( morphed, 1.0 );"

                "#endif"

                "#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )"

                    "float percentX = position.x / uZoneW;"
                    "float percentOffsetX = uOffsetX / ( uZoneW / 5.0 );"
                    "percentX = percentX + percentOffsetX;"
                    "vec2 posPercent = vec2( percentX * 0.5, position.z / uZoneW * 0.5 );"

                    "if( posPercent.x > 1.0 )"
                        "posPercent.x = posPercent.x - 1.0;"

                    "vWindForce = texture2D( uWindMapForce, posPercent ).x;"

                    "float windFactor = aWindRatio;"
                    "float windMod = ( 1.0 - vWindForce ) * windFactor;"

                    ##

                    # "vec4 wpos = modelMatrix * vec4( position, 1.0 );"
                    # "float dx = uMousePos.x - wpos.x;"
                    # "float dz = uMousePos.z - wpos.z;"
                    # "float dist = sqrt( dx * dx + dz * dz );"
                    # "if( dist > 100.0 )"
                    #     "dist = 100.0;"
                    # "dist = 100.0 - dist;"
                    # "dist *= 4.0;"

                    ##

                    "vec2 src = vec2( 0, 1 );"
                    "vec2 dest = vec2( -1, 1 );"

                    "vec2 percent = vec2( aPosition.x / 1280.0, aPosition.z / 1280.0 );"
                    "float r = texture2D( uWindDisplacementR, percent ).r;"
                    "r = convertToRange( r, src, dest );"
                    "float g = texture2D( uWindDisplacementG, percent ).g;"
                    "g = convertToRange( g, src, dest );"
                    "float b = texture2D( uWindDisplacementB, percent ).b;"
                    "b = convertToRange( b, src, dest );"

                    "vec4 pos = vec4( position, 1.0 );"
                    "pos.x += windMod * uWindDirection.x + r * 30.0 * aWindRatio;"
                    "pos.y += windMod * uWindDirection.y + g * 10.0 * aWindRatio;"
                    "pos.z += windMod * uWindDirection.z + b * 30.0 * aWindRatio;"

                    "mvPosition = modelViewMatrix * pos;"

                "#endif"

                "vColor = aColor;"
                "gl_Position = projectionMatrix * mvPosition;"

                THREE.ShaderChunk[ "worldpos_vertex" ]
                THREE.ShaderChunk[ "envmap_vertex" ]
                THREE.ShaderChunk[ "lights_lambert_vertex" ]
                THREE.ShaderChunk[ "shadowmap_vertex" ]

            "}"

        ].join("\n")

        fragmentShader: [

            "uniform float opacity;"

            "varying vec3 vLightFront;"
            "varying vec3 vColor;"
            "varying vec4 vDebugColor;"

            "#ifdef DOUBLE_SIDED"

                "varying vec3 vLightBack;"

            "#endif"

            THREE.ShaderChunk[ "color_pars_fragment" ]
            THREE.ShaderChunk[ "map_pars_fragment" ]
            THREE.ShaderChunk[ "lightmap_pars_fragment" ]
            THREE.ShaderChunk[ "envmap_pars_fragment" ]
            THREE.ShaderChunk[ "fog_pars_fragment" ]
            THREE.ShaderChunk[ "shadowmap_pars_fragment" ]
            THREE.ShaderChunk[ "specularmap_pars_fragment" ]

            "void main() {"

                "gl_FragColor = vec4( vColor, opacity );"
                # "gl_FragColor = vec4( vec3( 1.0 ), opacity );"

                THREE.ShaderChunk[ "map_fragment" ]
                THREE.ShaderChunk[ "alphatest_fragment" ]
                THREE.ShaderChunk[ "specularmap_fragment" ]

                "#ifdef DOUBLE_SIDED"

                    "if ( gl_FrontFacing )"
                        "gl_FragColor.xyz *= vLightFront;"
                    "else"
                        "gl_FragColor.xyz *= vLightBack;"

                "#else"

                    "gl_FragColor.xyz *= vLightFront;"

                "#endif"

                THREE.ShaderChunk[ "lightmap_fragment" ]
                THREE.ShaderChunk[ "color_fragment" ]
                THREE.ShaderChunk[ "envmap_fragment" ]
                THREE.ShaderChunk[ "shadowmap_fragment" ]

                THREE.ShaderChunk[ "linear_to_gamma_fragment" ]

                THREE.ShaderChunk[ "fog_fragment" ]

            "}"

        ].join("\n")
