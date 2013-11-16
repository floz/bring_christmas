class WorldNoise extends THREE.Object3D

	_planeNoise: null

	constructor: ->
		THREE.Object3D.call @

		@_planeNoise = new PlaneNoise()
		@.add @_planeNoise

	
		
