class WorldNoise extends THREE.Object3D

    _planeNoise: null

    constructor: ->
        THREE.Object3D.call @

        @_planeNoise = new PlaneNoise()
        @_planeNoise.position.x = -100
        @.add @_planeNoise

        @_planeNoiseAffected = new PlaneNoiseAffected()
        @_planeNoiseAffected.position.x = 100
        @.add @_planeNoiseAffected

        updateManager.register @

    update: ->
        @_planeNoise.update()
        @_planeNoiseAffected.update()
    
        
