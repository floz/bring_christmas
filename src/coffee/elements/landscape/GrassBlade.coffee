class GrassBlade extends THREE.Mesh

	@_SHARED_GEOMETRY = new THREE.PlaneGeometry 10, 50, 1, 1

	_geometry: null
	_texture: null

	constructor: ->
		@_geometry = GrassBlade._SHARED_GEOMETRY
		@_texture = new THREE.MeshLamberMaterial color: 0xff00ff

		THREE.Mesh.call @, @_geometry, @_texture