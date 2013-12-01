class Land extends THREE.Object3D

    _grass: null
    _floor: null
    _snow: null

    constructor: ->
        THREE.Object3D.call @

        w = Size.w
        h = Size.h
        HeightData.get()

        @_grass = new Grass w, h
        @.add @_grass

        @_floor = new Floor w, h
        @.add @_floor

        @_snow = new Snow()
        @.add @_snow

        @.position.z = -500

        updateManager.register @

    update: ->
        @_floor.update()
        @_grass.update()
        @_snow.update()
