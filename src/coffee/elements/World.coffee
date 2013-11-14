class World extends THREE.Object3D

	_land: null

	constructor: ->
		THREE.Object3D.call @
		@_init()

	_init: ->
		@_land = new Land()
		@.add @_land
