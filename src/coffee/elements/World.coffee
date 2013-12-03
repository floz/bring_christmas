class World extends THREE.Object3D

    _land: null

    _isHighDef: false

    constructor: ( @_isHighDef ) ->
        THREE.Object3D.call @
        @_init()

    _init: ->
        @_land = new Land @_isHighDef
        @.add @_land

        sounds.startWind()
