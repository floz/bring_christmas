class Grass extends THREE.Object3D

    w: 0
    h: 0

    _texture: null
    _cntBlades: null
    _blades: null    

    _uniforms: null

    _sign: 1
    _add: 0

    constructor: ( @w, @h ) ->
        @_texture = document.getElementById "texture-noise"

        THREE.Object3D.call @

        @_generateBlades()
        @_createGrass()

    _generateBlades: ->
        @_blades = new THREE.Geometry()
        step = 120

        xMin = -@w >> 1
        xMax = -xMin
        zMin = -@h >> 1
        zMax = -zMin

        px = xMin
        pz = zMin
        vx = @w / step
        vz = @h / step
        for i in [ 0...step ]
            for j in [ 0...step ]
                blade = new GrassBlade px, 0, pz
                THREE.GeometryUtils.merge @_blades, blade

                px += vx
            px = xMin
            pz += vz

        @_blades.computeFaceNormals()

    _createGrass: ->
        mesh = new THREE.Mesh @_blades, @_getWindMaterial()
        @.add mesh

    _getWindMaterial: ->
        shader = new WindShader()
        @_uniforms = shader.uniforms

        params =
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            uniforms: @_uniforms
            lights: true

        @_uniforms.diffuse.value = new THREE.Color( 0x084820 )
        @_uniforms.ambient.value = new THREE.Color( 0xffea00 )
        @_uniforms.uOffsetX.value = 0.0
        @_uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture @_texture.src
        @_uniforms.uWindScale.value = 1
        @_uniforms.uWindMin.value = new THREE.Vector2 0, 0
        @_uniforms.uWindSize.value = new THREE.Vector2 60, 60
        @_uniforms.uWindDirection.value = new THREE.Vector3 20, 5, 20

        material = new THREE.ShaderMaterial params

    update: ->
        if @_add > 300
            @_sign = -1
        else if @_add < 0
            @_sign = 1
        @_add += 1 * @_sign

        @_uniforms.uOffsetX.value = @_add

