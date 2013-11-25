class Grass extends THREE.Object3D

    _floor: null
    w: 0
    h: 0

    _texture: null
    _projector: null
    _vProjector: null
    _displacementDataR: null
    _displacementDataG: null
    _displacementDataB: null
    _cntBlades: null
    _blades: null   
    _vectors: null 

    _attributes: null
    _uniforms: null
    _colors: null
    _positions: null
    _windRatio: null
    _windOrientation: null
    _windLength: null
    _windDisplacementRTexture: null
    _windDisplacementGTexture: null
    _windDisplacementBTexture: null

    _lastProjectedMouse: { x: 0.0, y: 0.0, z: 0.0 }

    _sign: 1
    _add: 0

    constructor: ( @_floor, @w, @h ) ->
        @_texture = document.getElementById "texture-noise"
        @_projector = new THREE.Projector()
        @_vProjector = new THREE.Vector3()
        @_displacementDataR = new WindDisplacementData "map-displacement-r", "texture-displacement-r", -w >> 1, 0, w >> 1, -h
        @_displacementDataG = new WindDisplacementData "map-displacement-g", "texture-displacement-g", -w >> 1, 0, w >> 1, -h, true
        @_displacementDataB = new WindDisplacementData "map-displacement-b", "texture-displacement-b", -w >> 1, 0, w >> 1, -h, true

        THREE.Object3D.call @

        @_generateBlades()
        @_createGrass()

    _generateBlades: ->
        @_colors = []
        @_positions = []
        @_windRatio = []
        @_blades = new THREE.Geometry()
        @_vectors = []

        baseColor = new THREE.Color 0x3d5d0a
        availableColors = [ 
            new THREE.Color 0x53dc23
            new THREE.Color 0xb3dc23
            new THREE.Color 0x23dc46
            new THREE.Color 0x74ff2f 
        ]
        lengthAvailableColors = availableColors.length

        step = 160

        idx = 0

        xMin = 0
        xMax = @w
        zMin = 0
        zMax = @h

        heightValue = 0
        px = xMin
        pz = zMin
        vx = @w / step
        vz = @h / step
        for i in [ 0...step ]
            for j in [ 0...step ]
                blade = new GrassBlade px, 0, pz
                @_vectors.push new WindVectorData px, pz
                heightValue = HeightData.getPixelValue( px / 10 >> 0, pz / 10 >> 0 )
                geo = blade.geometry
                for v in geo.vertices
                    if v.y < 10
                        @_windRatio[ idx ] = 0.0
                        @_colors[ idx ] = baseColor
                    else
                        @_colors[ idx ] = availableColors[ Math.random() * lengthAvailableColors >> 0 ]
                        @_windRatio[ idx ] = 1.0
                    v.y += heightValue
                    @_positions[ idx ] = new THREE.Vector3 px, 0, pz + heightValue
                    idx++

                THREE.GeometryUtils.merge @_blades, blade

                px += vx

            px = xMin
            pz += vz

        @_blades.computeFaceNormals()
        console.log @_blades.vertices

    _createGrass: ->
        mesh = new THREE.Mesh @_blades, @_getWindMaterial()
        @.add mesh
        mesh.position.x = -@w >> 1
        mesh.position.z = -@h >> 1

    _getWindMaterial: ->
        shader = new WindShader()
        @_attributes = shader.attributes
        @_uniforms = shader.uniforms

        params =
            attributes: @_attributes
            uniforms: @_uniforms
            fragmentShader: shader.fragmentShader
            vertexShader: shader.vertexShader
            lights: true

        @_attributes.aColor.value = @_colors
        @_attributes.aWindRatio.value = @_windRatio
        @_attributes.aWindOrientation.value = @_windOrientation = []
        @_attributes.aWindLength.value = @_windLength = []
        @_attributes.aPosition.value = @_positions

        @_uniforms.diffuse.value = new THREE.Color( 0x084820 )
        @_uniforms.ambient.value = new THREE.Color( 0xffea00 )

        @_windDisplacementRTexture = new THREE.Texture @_displacementDataR.canvas
        @_windDisplacementGTexture = new THREE.Texture @_displacementDataG.canvas
        @_windDisplacementBTexture = new THREE.Texture @_displacementDataB.canvas
        @_uniforms.uWindDisplacementR.value = @_windDisplacementRTexture
        @_uniforms.uWindDisplacementG.value = @_windDisplacementGTexture
        @_uniforms.uWindDisplacementB.value = @_windDisplacementBTexture
        @_uniforms.uOffsetX.value = 0.0
        @_uniforms.uZoneW.value = @w >> 1
        @_uniforms.uFloorW.value = @w
        @_uniforms.uMousePos.value = new THREE.Vector2 stage.mouse.x, stage.mouse.y

        @_uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture @_texture.src
        @_uniforms.uWindScale.value = 1
        @_uniforms.uWindMin.value = new THREE.Vector2 0, 0
        @_uniforms.uWindSize.value = new THREE.Vector2 60, 60
        @_uniforms.uWindDirection.value = new THREE.Vector3 20, 5, 20

        material = new THREE.ShaderMaterial params
        material.side = THREE.DoubleSide
        return material

    convertToRange: ( x, a1, a2, b1, b2 ) ->
        return ((x - a1)/(a2 - a1)) * (b2 - b1) + b1;

    update: ->
        if @_add > 256
            @_add = 0
        @_add += 1

        @_uniforms.uOffsetX.value = @_add

        @_vProjector.x = ( stage.mouse.x / stage.size.w ) * 2 - 1
        @_vProjector.y = -( stage.mouse.y / stage.size.h ) * 2 + 1
        @_vProjector.z = 1
        @_projector.unprojectVector @_vProjector, engine.camera

        camPos = engine.camera.position
        m = @_vProjector.y / ( @_vProjector.y - camPos.y )

        pos = new THREE.Vector3()
        pos.x = @_vProjector.x + ( camPos.x - @_vProjector.x ) * m
        pos.z = @_vProjector.z + ( camPos.z - @_vProjector.z ) * m

        @_uniforms.uMousePos.value.x = pos.x
        @_uniforms.uMousePos.value.y = pos.y
        @_uniforms.uMousePos.value.z = pos.z

        @_displacementDataR.update pos.x, pos.z
        @_displacementDataG.update pos.x, pos.z
        @_displacementDataB.update pos.x, pos.z
        @_windDisplacementRTexture.needsUpdate = true
        @_windDisplacementGTexture.needsUpdate = true
        @_windDisplacementBTexture.needsUpdate = true

