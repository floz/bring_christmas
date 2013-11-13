class World extends THREE.Object3D

	_floor: null

	constructor: ->
		THREE.Object3D.call @
		@_init()

	_init: ->
		@_floor = new Floor()
		@.add @_floor