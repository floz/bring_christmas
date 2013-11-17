class PlaneNoise extends THREE.Mesh

	_material: null
	_texture: null
	_uniformsNoise: null

	_sign: 1
	_add: 0

	constructor: ->
		@_texture = document.getElementById "texture-noise"

		geometry = new THREE.PlaneGeometry 100, 100, 1, 1
		@_material = @_getNoiseMaterial()

		THREE.Mesh.call @, geometry, @_material #new THREE.MeshBasicMaterial color: 0xff0000

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
		
		@_uniformsNoise.uTime.value = @_add

