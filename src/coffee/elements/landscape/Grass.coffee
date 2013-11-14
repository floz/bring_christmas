class Grass extends THREE.Object3D

    w: 0
    h: 0

    _blades: null

    constructor: ( @w, @h ) ->
        THREE.Object3D.call @

        @_generateBlades()

    _generateBlades: ->
        @_blades = []

        step = 100

        xMin = -@w >> 1
        xMax = -xMin
        zMin = -@h >> 1
        zMax = -zMin

        px = xMin
        pz = zMin
        vx = @w / step
        vz = @h / step
        for i in [ 0...step ]
            for j in [ 0...step ]
                blade = new GrassBlade px, 0, pz
                @_blades.push blade
                @.add blade

                px += vx
            px = xMin
            pz += vz

