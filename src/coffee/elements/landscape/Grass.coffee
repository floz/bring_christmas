class Grass extends THREE.Object3D

    _floor: null
    w: 0
    h: 0

    _texture: null
    _noiseW: 0
    _projector: null
    _vProjector: null
    _displacementData: null
    _displacementChannelR: null
    _displacementChannelG: null
    _displacementChannelB: null
    _colorChannel: null
    _cntBlades: null
    _blades: null   
    _vectors: null 

    _attributes: null
    _uniforms: null
    _colors: null
    _positions: null
    _windRatio: null
    _windOrientation: null
    _windLength: null
    _windDisplacementRTexture: null
    _windDisplacementGTexture: null
    _windDisplacementBTexture: null
    _colorChannelTexture: null

    _lastProjectedMouse: { x: 0.0, y: 0.0, z: 0.0 }

    _rippleStart: new THREE.Vector3 0, 0, 0
    _rippleDist: 0
    _rippleStr: 0
    _rippleSpeed: 0
    _rippleSpeedMax: 50
    _updateRipple: false


    _sign: 1
    _add: 0

    constructor: ( @w, @h ) ->
        @_texture = document.getElementById "texture-noise"
        @_noiseW = @_texture.width
        @_projector = new THREE.Projector()
        @_vProjector = new THREE.Vector3()
        @_displacementChannelR = new WindDisplacementChannel "map-displacement-r", "texture-displacement-r",
        @_displacementChannelG = new WindDisplacementChannel "map-displacement-g", "texture-displacement-g", true
        @_displacementChannelB = new WindDisplacementChannel "map-displacement-b", "texture-displacement-b", true
        @_colorChannel = new ColorChannel "map-color", "texture-color"
        @_displacementData = new WindDisplacementData w, h, -w >> 1, 0, w >> 1, -h
        @_displacementData.addChannel @_displacementChannelR
        @_displacementData.addChannel @_displacementChannelG
        @_displacementData.addChannel @_displacementChannelB
        @_displacementData.addChannel @_colorChannel

        THREE.Object3D.call @

        @_generateBlades()
        @_createGrass()

        winterManager.registerGap @
        winterManager.registerWinter @

    onGapWinter: ( value ) =>
        @_generateRipple false, value

    onWinter: =>
        @_generateRipple true

    _generateRipple: ( isBig, value ) =>
        pos = @_getProjectedMouse()
        pos.x += @w >> 1
        pos.z = @h + pos.z

        @_rippleStart = pos
        if isBig then @_rippleStr = 80 else @_rippleStr = 15 * value
        @_rippleDist = 0
        @_rippleSpeed = 0
        @_updateRipple = true

        @_uniforms.uRippleStart.value = pos

    _generateBlades: ->
        @_colors = []
        @_colorsWinter = []
        @_positions = []
        @_windRatio = []
        @_blades = new THREE.Geometry()
        @_vectors = []

        step = 200

        idx = 0

        xMin = 0
        xMax = @w
        zMin = 0
        zMax = @h

        baseRatio = @h >> 1

        heightValue = 0 
        px = xMin
        pz = zMin
        vx = @w / step
        vz = @h / step
        for i in [ 0...step ]
            for j in [ 0...step ]
                if pz > 1150 || ( px < 500 && pz > 600 ) || ( px > 1800 && pz > 800 )
                    px += vx
                    continue
                blade = new GrassBlade px, 0, pz
                @_vectors.push new WindVectorData px, pz
                heightValue = HeightData.getPixelValue px / 10 >> 0, pz / 10 >> 0
                colorSummer = Colors.summer.getPixelValue px / 10 >> 0, pz / 10 >> 0
                colorWinter = Colors.winter.getPixelValue px / 10 >> 0, pz / 10 >> 0
                ratio = 1 - pz / @h
                # heightValue += ratio * 100
                ratio = 1 #+ 0.5 * ratio
                heightValue *= ratio
                geo = blade.geometry
                for v in geo.vertices
                    if v.y < 10
                        @_windRatio[ idx ] = 0.0
                        @_colors[ idx ] = Colors.floorSummer
                        @_colorsWinter[ idx ] = Colors.floorWinter
                    else
                        @_colors[ idx ] = colorSummer
                        @_colorsWinter[ idx ] = colorWinter
                        @_windRatio[ idx ] = 1.0
                    v.y += heightValue
                    @_positions[ idx ] = new THREE.Vector3 px, 0, pz + heightValue
                    idx++

                THREE.GeometryUtils.merge @_blades, blade

                px += vx

            px = xMin
            pz += vz

        @_blades.computeFaceNormals()

    _createGrass: ->
        mesh = new THREE.Mesh @_blades, @_getWindMaterial()
        @.add mesh
        mesh.position.x = -@w >> 1
        mesh.position.z = -@h >> 1

    _getWindMaterial: ->
        shader = new WindShader()
        @_attributes = shader.attributes
        @_uniforms = shader.uniforms

        params =
            attributes: @_attributes
            uniforms: @_uniforms
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            lights: true

        @_attributes.aColor.value = @_colors
        @_attributes.aColorWinter.value = @_colorsWinter
        @_attributes.aWindRatio.value = @_windRatio
        @_attributes.aWindOrientation.value = @_windOrientation = []
        @_attributes.aWindLength.value = @_windLength = []
        @_attributes.aPosition.value = @_positions

        # @_uniforms.diffuse.value = new THREE.Color( 0x084820 )
        # @_uniforms.ambient.value = new THREE.Color( 0xffea00 )

        @_windDisplacementRTexture = new THREE.Texture @_displacementChannelR.canvas
        @_windDisplacementGTexture = new THREE.Texture @_displacementChannelG.canvas
        @_windDisplacementBTexture = new THREE.Texture @_displacementChannelB.canvas
        @_colorChannelTexture = new THREE.Texture @_colorChannel.canvas
        @_uniforms.uWindDisplacementR.value = @_windDisplacementRTexture
        @_uniforms.uWindDisplacementG.value = @_windDisplacementGTexture
        @_uniforms.uWindDisplacementB.value = @_windDisplacementBTexture
        @_uniforms.uColorChannel.value = @_colorChannelTexture
        @_uniforms.uOffsetX.value = 0.0
        @_uniforms.uZoneW.value = @w >> 1
        @_uniforms.uZoneH.value = @w >> 1
        @_uniforms.uFloorW.value = @w
        # @_uniforms.uMousePos.value = new THREE.Vector2 stage.mouse.x, stage.mouse.y
        @_uniforms.uFloorColorSummer.value = Colors.floorSummer
        @_uniforms.uFloorColorWinter.value = Colors.floorWinter
        @_uniforms.uGrassBladeHeight.value = GrassBlade.HEIGHT

        @_uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture @_texture.src
        @_uniforms.uWindScale.value = 1
        @_uniforms.uWindMin.value = new THREE.Vector2 0, 0
        @_uniforms.uWindSize.value = new THREE.Vector2 60, 60
        @_uniforms.uWindDirection.value = new THREE.Vector3 13, 5, 13

        @_uniforms.uRippleStart.value = @_rippleStart
        @_uniforms.uRippleDist.value = @_rippleDist
        @_uniforms.uRippleStr.value = @_rippleStr

        material = new THREE.ShaderMaterial params
        material.side = THREE.DoubleSide
        return material

    convertToRange: ( x, a1, a2, b1, b2 ) ->
        return ((x - a1)/(a2 - a1)) * (b2 - b1) + b1;

    update: ->
        if @_add > @_noiseW
            @_add = 0
        @_add += 1

        @_uniforms.uOffsetX.value = @_add

        pos = @_getProjectedMouse()

        # @_uniforms.uMousePos.value.x = pos.x
        # @_uniforms.uMousePos.value.y = pos.y
        # @_uniforms.uMousePos.value.z = pos.z

        @_displacementData.update pos.x, pos.z
        @_windDisplacementRTexture.needsUpdate = true
        @_windDisplacementGTexture.needsUpdate = true
        @_windDisplacementBTexture.needsUpdate = true
        @_colorChannelTexture.needsUpdate = true

        if @_updateRipple
            @_rippleSpeed += ( @_rippleSpeedMax - @_rippleSpeed ) * .05
            @_rippleDist += @_rippleSpeed
            @_rippleStr *= .95
            @_uniforms.uRippleDist.value = @_rippleDist
            @_uniforms.uRippleStr.value = @_rippleStr

    _getProjectedMouse: =>
        @_vProjector.x = ( stage.mouse.x / stage.size.w ) * 2 - 1
        @_vProjector.y = -( stage.mouse.y / stage.size.h ) * 2 + 1
        @_vProjector.z = 1
        @_projector.unprojectVector @_vProjector, engine.camera

        camPos = engine.camera.position
        m = @_vProjector.y / ( @_vProjector.y - camPos.y )

        pos = new THREE.Vector3()
        pos.x = @_vProjector.x + ( camPos.x - @_vProjector.x ) * m
        pos.z = @_vProjector.z + ( camPos.z - @_vProjector.z ) * m

        pos
