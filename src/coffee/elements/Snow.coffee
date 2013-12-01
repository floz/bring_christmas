# Inspired by http://oos.moxiecode.com/js_webgl/snowfall/

class Snow extends THREE.Object3D

	@countFlakes: 800

	_sizes: null
	_times: null
	_colors: null
	_idx: null
	_attributes: null
	_uniforms: null

	_oldTime: 0.0

	constructor: ->
		THREE.Object3D.call @

		geometry = new THREE.Geometry
		for i in [0..Snow.countFlakes]
			vec = new THREE.Vector3 Math.random() * Size.w, 500, Math.random() * Size.h
			geometry.vertices.push vec

		@_sizes = []
		@_times = []
		@_colors = []
		@_idx = []

		for vertice, i in geometry.vertices
			@_sizes[ i ] = 50 + Math.random() * 80
			@_colors[ i ] = new THREE.Color 0xffffff
			@_colors[ i ].setHSL 1.0, 0.0, 0.05 + Math.random() * 0.9
			@_times[ i ] = Math.random()
			@_idx[ i ] = i

		particles = new THREE.ParticleSystem geometry, @_getMaterial()
		particles.position.x = -Size.w >> 1
		particles.position.z = -Size.h >> 1

		@.add particles

		winterManager.register @

	_getMaterial: ->
		shader = new SnowShader()

		@_attributes = shader.attributes
		@_attributes.size.value = @_sizes
		@_attributes.time.value = @_times
		@_attributes.customColor.value = @_colors
		@_attributes.idx.value = @_idx

		@_uniforms = shader.uniforms
		texture = THREE.ImageUtils.loadTexture "img/snowflake.png"
		@_uniforms.texture.value = texture
		@_uniforms.idxVisible.value = Snow.countFlakes

		params = 
			attributes: @_attributes
			uniforms: @_uniforms
			vertexShader: shader.vertexShader
			fragmentShader: shader.fragmentShader

			blending: THREE.AdditiveBlending
			depthTest: false
			transparent: true

		material = new THREE.ShaderMaterial params

	update: ->
		time = new Date().getTime()
		delta = time - @_oldTime
		@_oldTime = time

		if !delta || delta > 1000
			delta = 1000/60

		@_uniforms.globalTime.value += delta * 0.00015

	updateWinter: -> 
		@_uniforms.idxVisible.value = Snow.countFlakes - Snow.countFlakes * winterManager.percent

