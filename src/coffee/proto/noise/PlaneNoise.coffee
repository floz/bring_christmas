class PlaneNoise extends THREE.Mesh

    _texture: null
    _geometry: null
    _material: null
    _uniformsNoise: null

    _sign: 1
    _add: 0

    noiseMap: null
    noiseScene: null
    noiseCamera: null
    noiseMesh: null

    constructor: ->
        @_texture = document.getElementById "texture-noise"

        @_geometry = new THREE.PlaneGeometry 100, 100, 1, 1
        @_material = @_getNoiseMaterial()
        # @_createScene()

        THREE.Mesh.call @, @_geometry, @_material #new THREE.MeshBasicMaterial color: 0xff0000
        # THREE.Mesh.call @, @_geometry, new THREE.MeshPhongMaterial { map: @noiseMap, lights: false }


    # _createScene: ->
    #     @noiseMap = new THREE.WebGLRenderTarget 100, 100, { minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat }
    #     @noiseScene = new THREE.Scene()

    #     @noiseCamera = new THREE.OrthographicCamera stage.size.w / -2, stage.size.w / 2, stage.size.h / 2, stage.size.h / -2, -10000, 10000
    #     @noiseCamera.position.z = 100
    #     @noiseScene.add @noiseCamera

    #     @noiseMesh = new THREE.Mesh @_geometry.clone(), @_material
    #     @noiseScene.add @noiseMesh        

    _getNoiseMaterial: ->
        shader = new NoiseShader()
        @_uniformsNoise = shader.uniforms

        params =
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            uniforms: @_uniformsNoise

        @_uniformsNoise.uText.value = THREE.ImageUtils.loadTexture @_texture.src

        material = new THREE.ShaderMaterial params

    update: ->
        if @_add > 300
            @_sign = -1 
        else if @_add < 0 
            @_sign = 1
        @_add += 1 * @_sign
        
        @_uniformsNoise.uOffsetX.value = @_add
        # engine.renderer.render @noiseScene, @noiseCamera, @noiseMap, true


