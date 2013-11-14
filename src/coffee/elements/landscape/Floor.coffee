class Floor extends THREE.Mesh

    _geometry: null
    _texture: null

    w: 0
    h: 0

    constructor: ( @w, @h ) ->
        @_geometry = new THREE.PlaneGeometry w, h, 4, 4
        @_texture = new THREE.MeshLambertMaterial color: 0xffffff

        THREE.Mesh.call @, @_geometry, @_texture

        @.rotation.x = -Math.PI * .5


