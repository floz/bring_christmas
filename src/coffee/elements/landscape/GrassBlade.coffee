class GrassBlade extends THREE.Mesh

    geometry: null
    texture: null

    constructor: ( x, y, z ) ->
        pz = z - 500
        w = 1 + Math.random() * 1
        h = 70 + 40 * ( 1 - ( 1000 - pz ) * .001 )
        # h = 50

        @geometry = new THREE.PlaneGeometry w, h, 1, 1
        @geometry.applyMatrix new THREE.Matrix4().makeTranslation 0, h >> 1, 0 

        @texture = new THREE.MeshLambertMaterial color: 0xfff000

        THREE.Mesh.call @, @geometry, @texture

        @.rotation.x = Math.random() * .6 - .3
        @.position.set x + Math.random() * 10 - 5, y, z + Math.random() * 10 - 5
