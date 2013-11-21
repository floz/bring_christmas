class Land extends THREE.Object3D

    _floor: null

    constructor: ->
        THREE.Object3D.call @

        @_floor = new Floor 1280, 1280
        @.add @_floor

        @_grass = new Grass @_floor, @_floor.w, @_floor.h
        @.add @_grass

        @.position.z = -500

        updateManager.register @

    update: ->
        @_grass.update()
