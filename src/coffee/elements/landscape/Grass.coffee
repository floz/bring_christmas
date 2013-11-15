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
        materialA = new THREE.MeshLambertMaterial color: 0x084820
        materialA.side = THREE.DoubleSide
        
        materialB = @_getWindMaterial()

        mesh = THREE.SceneUtils.createMultiMaterialObject @_blades, [ materialB, materialA ]
        @.add mesh

    _getWindMaterial: ->
        shader = new WindShader()

        params =
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            uniforms: shader.uniforms
            # lights: true

        material = new THREE.ShaderMaterial params


