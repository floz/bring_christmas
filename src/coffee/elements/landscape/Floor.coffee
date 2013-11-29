class Floor extends THREE.Mesh

    _geometry: null
    _texture: null

    w: 0
    h: 0

    constructor: ( @w, @h ) ->
        @_geometry = new THREE.PlaneGeometry w, h, @w / 10, @h / 10
        @_modifyFloor()

        @_texture = new THREE.MeshBasicMaterial color: Colors.floor.getHex(), lights: false

        THREE.Mesh.call @, @_geometry, @_texture

        @.rotation.x = -Math.PI * .5

    _modifyFloor: ->
        data = HeightData.get()

        baseRatio = @h >> 1
        baseW = @w / 10 >> 1
        baseH = @h / 10 >> 1

        vertices = @_geometry.vertices
        for vertice, i in vertices
            ratio = ( baseRatio + vertice.y ) / @h
            # vertice.z = data[ i ] + ratio * 100
            ratio = 1 #+ 0.5 * ratio
            vertice.z += HeightData.getPixelValue baseW + vertice.x / 10 >> 0, baseH - vertice.y / 10 >> 0#* ratio

        @_geometry.computeFaceNormals()
