class Grass extends THREE.Object3D

    w: 0
    h: 0

    _cntBlades: null
    _blades: null    

    constructor: ( @w, @h ) ->
        THREE.Object3D.call @

        @_generateBlades()
        @_createGrass()

    _generateBlades: ->
        @_blades = new THREE.Geometry()
        step = 120

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
                THREE.GeometryUtils.merge @_blades, blade

                px += vx
            px = xMin
            pz += vz

        @_blades.computeFaceNormals()

    _createGrass: ->
        mesh = new THREE.Mesh @_blades, new THREE.MeshLambertMaterial color: 0xff00ff
        @.add mesh
