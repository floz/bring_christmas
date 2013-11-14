class GrassBlade extends THREE.Mesh

    @_SHARED_GEOMETRY = new THREE.PlaneGeometry 2, 50, 1, 1

    _geometry: null
    _texture: null

    constructor: ( x, y, z ) ->
        @_geometry = GrassBlade._SHARED_GEOMETRY
        @_texture = new THREE.MeshLambertMaterial color: 0xff00ff

        THREE.Mesh.call @, @_geometry, @_texture

        @.position.set x, y, z
