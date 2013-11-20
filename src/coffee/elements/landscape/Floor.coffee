class Floor extends THREE.Mesh

    _geometry: null
    _texture: null

    w: 0
    h: 0

    constructor: ( @w, @h ) ->
        @_geometry = new THREE.PlaneGeometry w, h, 127, 127
        @_modifyFloor()

        @_texture = new THREE.MeshBasicMaterial color: 0x234706, lights: false

        THREE.Mesh.call @, @_geometry, @_texture

        @.rotation.x = -Math.PI * .5

    _modifyFloor: ->
        data = HeightData.get()

        vertices = @_geometry.vertices
        for vertice, i in vertices
            vertice.z = data[ i ]

        @_geometry.computeFaceNormals()
