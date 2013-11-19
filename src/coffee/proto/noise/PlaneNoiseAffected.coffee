class PlaneNoiseAffected extends THREE.Mesh

    _texture: null
    _material: null
    _geometry: null
    _uniforms: null

    _sign: 1
    _add: 0

    constructor: ->
        @_texture = document.getElementById "texture-noise"

        @_geometry = new THREE.PlaneGeometry 100, 100, 1, 1
        @_geometry.applyMatrix new THREE.Matrix4().makeTranslation 0, 50, 0 
        @_material = @_getDisplacementMaterial()

        THREE.Mesh.call @, @_geometry, @_material

    _getDisplacementMaterial: ->
        shader = new DisplacementShader()
        @_uniforms = shader.uniforms

        params =
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            uniforms: @_uniforms
            lights: true

        @_uniforms.diffuse.value = new THREE.Color 0x084820
        @_uniforms.ambient.value = new THREE.Color 0xffea00
        
        @_uniforms.uOffsetX.value = 0.0
        @_uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture @_texture.src
        @_uniforms.uWindScale.value = 1
        @_uniforms.uWindMin.value = new THREE.Vector2 -30, -30
        @_uniforms.uWindSize.value = new THREE.Vector2 60, 60
        @_uniforms.uWindDirection.value = new THREE.Vector3 10, 0, 10

        material = new THREE.ShaderMaterial params

    update: ->
        if @_add > 300
            @_sign = -1
        else if @_add < 0
            @_sign = 1
        @_add += 1 * @_sign

        @_uniforms.uOffsetX.value = @_add;#Math.random() * 1.0

        
