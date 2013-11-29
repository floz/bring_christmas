class Floor extends THREE.Mesh

    _geometry: null
    _texture: null

    w: 0
    h: 0

    constructor: ( @w, @h ) ->
        @_geometry = new THREE.PlaneGeometry w, h, 127, 127
        @_modifyFloor()

        @_texture = new THREE.MeshBasicMaterial color: Colors.floor.getHex(), lights: false

        THREE.Mesh.call @, @_geometry, @_texture

        @.rotation.x = -Math.PI * .5

    _modifyFloor: ->
        data = HeightData.get()

        baseRatio = @h >> 1

        vertices = @_geometry.vertices
        for vertice, i in vertices
            ratio = ( baseRatio + vertice.y ) / @h
            # vertice.z = data[ i ] + ratio * 100
            ratio = 1 #+ 0.5 * ratio
            vertice.z = data[ i ] * ratio

        @_geometry.computeFaceNormals()
