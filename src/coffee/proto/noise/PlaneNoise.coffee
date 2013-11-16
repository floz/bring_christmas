class PlaneNoise extends THREE.Mesh

	_material: null

	constructor: ->
		geometry = new THREE.PlaneGeometry 100, 100, 1, 1
		@_material = new @_getNoiseMaterial()

		THREE.Mesh.call @, geometry, @_getNoiseMaterial() #new THREE.MeshBasicMaterial color: 0xff0000

	_getNoiseMaterial: ->
		shader = new NoiseShader()
		uniforms = shader.uniforms

		params =
			fragmentShader: shader.fragmentShader
			vertexShader: shader.vertexShader
			uniforms: uniforms

		material = new THREE.ShaderMaterial params

	update: ->
		# todo
