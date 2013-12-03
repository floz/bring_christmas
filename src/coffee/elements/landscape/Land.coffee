class Land extends THREE.Object3D

    _grass: null
    _floor: null
    _snow: null

    constructor: ( isHighDef ) ->
        THREE.Object3D.call @

        w = Size.w
        h = Size.h
        HeightData.get()

        @_grass = new Grass w, h
        @.add @_grass

        @_floor = new Floor w, h
        @.add @_floor

        @_snow = new Snow isHighDef
        @.add @_snow

        sky = new Sky()
        sky.position.z = -Size.h >> 1
        sky.position.y = 350
        @.add sky

        treesRight = new Trees()
        treesRight.position.y = 200
        treesRight.position.z = -Size.h * .5 + 2 >> 0
        @.add treesRight

        @.position.z = -500

        updateManager.register @

    update: ->
        @_floor.update()
        @_grass.update()
        @_snow.update()
