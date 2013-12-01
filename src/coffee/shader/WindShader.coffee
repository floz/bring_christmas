class WindShader

    attributes: {
        aColor: {
            type: "c"
            value: null
        }
        aColorWinter: {
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
                "uZoneH": { type: "f", vaue: 0.0 }
                "uFloorW": { type: "f", value: 0.0 }
                "uFloorColorSummer": { type: "c", value: null }
                "uFloorColorWinter": { type: "c", value: null }
                "uWindMapForce": { type: "t", value: null }
                "uWindScale": { type: "f", value: 1.0 }
                "uWindMin": { type: "v2", value: null }
                "uWindSize": { type: "v2", value: null }
                "uWindDirection": { type: "v3", value: null }
                "uMousePos": { type: "v3", value: null }
                "uWindDisplacementR": { type: "t", value: null }
                "uWindDisplacementG": { type: "t", value: null }
                "uWindDisplacementB": { type: "t", value: null }
                "uColorChannel": { type: "t", value: null }
                "uGrassBladeHeight": { type: "f", value: null }
            }

        ] )

        vertexShader: [

            "#define LAMBERT"

            "attribute vec3 aColor;"
            "attribute vec3 aColorWinter;"
            "attribute float aWindRatio;"
            "attribute float aWindOrientation;"
            "attribute float aWindLength;"
            "attribute vec3 aPosition;"

            "uniform float uOffsetX;"
            "uniform float uZoneW;"
            "uniform float uZoneH;"
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
            "uniform float uGrassBladeHeight;"

            "varying vec3 vLightFront;"
            "varying float vWindForce;"
            "varying vec3 vColor;"
            "varying vec3 vColorWinter;"
            "varying vec2 vPercent;"
            "varying float vColorRatio;"
            "varying float vFloorColorPercent;"

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

                    "float baseY = position.y;"

                    "float percentX = position.x / uZoneW;"
                    "float percentOffsetX = uOffsetX / ( uZoneW / 5.0 );"
                    "percentX = percentX + percentOffsetX;"
                    "vec2 posPercent = vec2( percentX * 0.5, position.z / uZoneW * 0.5 );"

                    "if( posPercent.x > 1.0 )"
                        "posPercent.x = posPercent.x - 1.0;"

                    "vWindForce = texture2D( uWindMapForce, posPercent ).x;"

                    "float windMod = ( 1.0 - vWindForce ) * aWindRatio;"

                    ##

                    ##

                    "vec2 src = vec2( 0, 1 );"
                    "vec2 dest = vec2( -1, 1 );"

                    "vec2 percent = vec2( aPosition.x / uZoneW * 0.5, aPosition.z / uZoneH );"
                    "float r = texture2D( uWindDisplacementR, percent ).r;"
                    "if ( r >= 0.405 && r <= 0.505 ) r = 0.5;"
                    "r = convertToRange( r, src, dest );"
                    "float g = texture2D( uWindDisplacementG, percent ).g;"
                    "if ( g >= 0.405 && g <= 0.505 ) g = 0.5;"
                    "g = convertToRange( g, src, dest );"
                    "float b = texture2D( uWindDisplacementB, percent ).b;"
                    "if ( b >= 0.405 && b <= 0.505 ) b = 0.5;"
                    "b = convertToRange( b, src, dest );"

                    "vec4 pos = vec4( position, 1.0 );"
                    "pos.x += windMod * uWindDirection.x + r * 30.0 * aWindRatio;"
                    "pos.y += windMod * uWindDirection.y + g * 10.0 * aWindRatio;"
                    "pos.z += windMod * uWindDirection.z + b * 30.0 * aWindRatio;"

                    "if ( aWindRatio == 0.0 ) {"
                        "vFloorColorPercent = 1.0;"
                    "} else {"
                        "vFloorColorPercent = ( baseY - pos.y ) / ( uGrassBladeHeight / 6.0 );"
                        "if ( vFloorColorPercent < 0.0 ) vFloorColorPercent = 0.0;"
                        "if ( vFloorColorPercent > 1.0 ) vFloorColorPercent = 1.0;"
                    "}"
                    # "vFloorColorPercent = -g * 0.5;"

                    "vPercent = percent;"
                    "vColorRatio = aWindRatio;"

                    "mvPosition = modelViewMatrix * pos;"

                "#endif"

                "vColor = aColor;"
                "vColorWinter = aColorWinter;"
                "gl_Position = projectionMatrix * mvPosition;"

                THREE.ShaderChunk[ "worldpos_vertex" ]
                THREE.ShaderChunk[ "envmap_vertex" ]
                THREE.ShaderChunk[ "lights_lambert_vertex" ]
                THREE.ShaderChunk[ "shadowmap_vertex" ]

            "}"

        ].join("\n")

        fragmentShader: [


            "uniform float opacity;"
            # "uniform sampler2D uMapColor;"
            "uniform sampler2D uColorChannel;"
            "uniform vec3 uFloorColorSummer;"
            "uniform vec3 uFloorColorWinter;"

            "varying float vColorRatio;"
            "varying vec3 vLightFront;"
            "varying vec3 vColor;"
            "varying vec3 vColorWinter;"
            "varying vec4 vDebugColor;"
            "varying vec2 vPercent;"
            "varying float vFloorColorPercent;"
            # "varying float vWindForce;"

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

                "vec4 winterColor = texture2D( uColorChannel, vPercent ).rgba;"

                "vec3 floorColor = uFloorColorSummer + ( uFloorColorWinter - uFloorColorSummer ) * winterColor.a;"

                "vec3 newColor = vColor;"
                "if( vColorRatio == 0.0 )"
                    "newColor = floorColor;"
                "newColor.r = newColor.r + ( vColorWinter.r - newColor.r ) * winterColor.a * vColorRatio;"
                "newColor.g = newColor.g + ( vColorWinter.g - newColor.g ) * winterColor.a * vColorRatio;"
                "newColor.b = newColor.b + ( vColorWinter.b - newColor.b ) * winterColor.a * vColorRatio;"

                "newColor.r = newColor.r + ( floorColor.r - newColor.r ) * vFloorColorPercent;"
                "newColor.g = newColor.g + ( floorColor.g - newColor.g ) * vFloorColorPercent;"
                "newColor.b = newColor.b + ( floorColor.b - newColor.b ) * vFloorColorPercent;"

                "gl_FragColor = vec4( newColor.rgb, opacity );"

                THREE.ShaderChunk[ "map_fragment" ]
                THREE.ShaderChunk[ "alphatest_fragment" ]
                THREE.ShaderChunk[ "specularmap_fragment" ]

                # "#ifdef DOUBLE_SIDED"

                #     "if ( gl_FrontFacing )"
                #         "gl_FragColor.xyz *= vLightFront;"
                #     "else"
                #         "gl_FragColor.xyz *= vLightBack;"

                # "#else"

                #     "gl_FragColor.xyz *= vLightFront;"

                # "#endif"

                THREE.ShaderChunk[ "lightmap_fragment" ]
                THREE.ShaderChunk[ "color_fragment" ]
                THREE.ShaderChunk[ "envmap_fragment" ]
                THREE.ShaderChunk[ "shadowmap_fragment" ]

                THREE.ShaderChunk[ "linear_to_gamma_fragment" ]

                THREE.ShaderChunk[ "fog_fragment" ]

            "}"

        ].join("\n")
