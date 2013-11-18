class GrassBlade extends THREE.Mesh

    @_SHARED_GEOMETRY = null

    geometry: null
    texture: null

    constructor: ( x, y, z ) ->
        GrassBlade.initGeometry( x, y, z ) if !GrassBlade._SHARED_GEOMETRY
        @geometry = GrassBlade._SHARED_GEOMETRY
        @texture = new THREE.MeshLambertMaterial color: 0xfff000

        THREE.Mesh.call @, @geometry, @texture

        @.position.set x + Math.random() * 10 - 5, y, z + Math.random() * 10 - 5

    @initGeometry = ( x, y, z )->
        GrassBlade._SHARED_GEOMETRY = new THREE.PlaneGeometry 1 + Math.random() * 1, 50, 1, 1
        GrassBlade._SHARED_GEOMETRY.applyMatrix new THREE.Matrix4().makeTranslation 0, 25, 0 
