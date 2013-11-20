class Grass extends THREE.Object3D

    w: 0
    h: 0

    _texture: null
    _cntBlades: null
    _blades: null    

    _uniforms: null
    _colors: null

    _sign: 1
    _add: 0

    constructor: ( @w, @h ) ->
        @_texture = document.getElementById "texture-noise"

        THREE.Object3D.call @

        @_generateBlades()
        @_createGrass()

    _generateBlades: ->
        @_colors = []
        @_blades = new THREE.Geometry()

        baseColor = new THREE.Color 0x3d5d0a
        availableColors = [ 
            new THREE.Color 0x53dc23
            new THREE.Color 0xb3dc23
            new THREE.Color 0x23dc46
            new THREE.Color 0x74ff2f 
        ]
        lengthAvailableColors = availableColors.length

        step = 120

        idx = 0

        # xMin = -@w >> 1
        xMin = 0
        xMax = @w
        # zMin = -@h >> 1
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
                        @_colors[ idx ] = baseColor
                    else
                        @_colors[ idx ] = availableColors[ Math.random() * lengthAvailableColors >> 0 ]
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
        attributes = shader.attributes
        @_uniforms = shader.uniforms

        params =
            attributes: attributes
            uniforms: @_uniforms
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            lights: true

        attributes.aColor.value = @_colors

        @_uniforms.diffuse.value = new THREE.Color( 0x084820 )
        @_uniforms.ambient.value = new THREE.Color( 0xffea00 )
        @_uniforms.uOffsetX.value = 0.0
        @_uniforms.uZoneW.value = @w >> 1
        @_uniforms.uFloorW.value = @w
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

