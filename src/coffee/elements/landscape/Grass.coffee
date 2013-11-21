class Grass extends THREE.Object3D

    _floor: null
    w: 0
    h: 0

    _texture: null
    _projector: null
    _vProjector: null
    _cntBlades: null
    _blades: null    

    _attributes: null
    _uniforms: null
    _colors: null
    _windRatio: null

    _sign: 1
    _add: 0

    constructor: ( @_floor, @w, @h ) ->
        @_texture = document.getElementById "texture-noise"
        @_projector = new THREE.Projector()
        @_vProjector = new THREE.Vector3()

        THREE.Object3D.call @

        @_generateBlades()
        @_createGrass()

    _generateBlades: ->
        @_colors = []
        @_windRatio = []
        @_blades = new THREE.Geometry()

        baseColor = new THREE.Color 0x3d5d0a
        availableColors = [ 
            new THREE.Color 0x53dc23
            new THREE.Color 0xb3dc23
            new THREE.Color 0x23dc46
            new THREE.Color 0x74ff2f 
        ]
        lengthAvailableColors = availableColors.length

        step = 160

        idx = 0

        xMin = 0
        xMax = @w
        zMin = 0
        zMax = @h

        px = xMin
        pz = zMin
        vx = @w / step
        vz = @h / step
        for i in [ 0...step ]
            for j in [ 0...step ]
                blade = new GrassBlade px, 0, pz
                geo = blade.geometry
                for v in geo.vertices
                    if v.y < 10
                        @_windRatio[ idx ] = 0.0
                        @_colors[ idx ] = baseColor
                    else
                        @_colors[ idx ] = availableColors[ Math.random() * lengthAvailableColors >> 0 ]
                        @_windRatio[ idx ] = 1.0
                    v.y += HeightData.getPixelValue( px / 10 >> 0, pz / 10 >> 0 )
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
        @_attributes.aWindRatio.value = @_windRatio

        @_uniforms.diffuse.value = new THREE.Color( 0x084820 )
        @_uniforms.ambient.value = new THREE.Color( 0xffea00 )

        @_uniforms.uOffsetX.value = 0.0
        @_uniforms.uZoneW.value = @w >> 1
        @_uniforms.uFloorW.value = @w
        @_uniforms.uMousePos.value = new THREE.Vector2 stage.mouse.x, stage.mouse.y

        @_uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture @_texture.src
        @_uniforms.uWindScale.value = 1
        @_uniforms.uWindMin.value = new THREE.Vector2 0, 0
        @_uniforms.uWindSize.value = new THREE.Vector2 60, 60
        @_uniforms.uWindDirection.value = new THREE.Vector3 20, 5, 20

        material = new THREE.ShaderMaterial params

    update: ->
        if @_add > 256
            @_add = 0
        @_add += 1

        @_uniforms.uOffsetX.value = @_add

        @_vProjector.x = ( stage.mouse.x / stage.size.w ) * 2 - 1
        @_vProjector.y = -( stage.mouse.y / stage.size.h ) * 2 + 1
        @_vProjector.z = 1
        @_projector.unprojectVector @_vProjector, engine.camera

        camPos = engine.camera.position
        m = @_vProjector.y / ( @_vProjector.y - camPos.y )

        pos = new THREE.Vector3()
        pos.x = @_vProjector.x + ( camPos.x - @_vProjector.x ) * m
        pos.z = @_vProjector.z + ( camPos.z - @_vProjector.z ) * m

        @_uniforms.uMousePos.value.x = pos.x
        @_uniforms.uMousePos.value.y = pos.y
        @_uniforms.uMousePos.value.z = pos.z

        # for i in [ 0...@_windRatio.length ]
        #     @_windRatio[ i ] = Math.random() * 2
        # @_attributes.aWindRatio.value = @_windRatio

        # return

