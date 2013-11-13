class Floor extends THREE.Mesh

    _geometry: null
    _texture: null

    constructor: ->
        @_geometry = new THREE.PlaneGeometry 1000, 1000, 4, 4
        @_texture = new THREE.MeshBasicMaterial color: 0xffffff, wireframe: true

        THREE.Mesh.call @, @_geometry, @_texture

        @.rotation.x = Math.PI * .5