class GrassBlade extends THREE.Mesh

    @HEIGHT: 30

    geometry: null
    texture: null

    constructor: ( x, y, z ) ->
        pz = z - 500
        w = .25 + .5 * ( 1280 - pz ) / 1280 + Math.random() * 1
        # w = 1 + Math.random() * 1
        # h = 40 + 30 * ( 1 - ( 1280 - pz ) * .001 )
        h = GrassBlade.HEIGHT
        # h = 50

        @geometry = new THREE.PlaneGeometry w, h, 1, 1
        @geometry.applyMatrix new THREE.Matrix4().makeTranslation 0, h >> 1, 0 

        @texture = new THREE.MeshLambertMaterial color: 0xfff000

        THREE.Mesh.call @, @geometry, @texture

        @.rotation.x = Math.random() * .2 - .1
        @.rotation.y = Math.random() * .2 - .1
        @.rotation.z = Math.random() * .2 - .1
        @.position.set x + Math.random() * 10 - 5, y, z + Math.random() * 10 - 5
