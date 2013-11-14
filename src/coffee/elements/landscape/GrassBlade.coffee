class GrassBlade extends THREE.Mesh

    @_SHARED_GEOMETRY = null

    geometry: null
    texture: null

    constructor: ( x, y, z ) ->
        GrassBlade.initGeometry( x, y, z ) if !GrassBlade._SHARED_GEOMETRY
        @geometry = GrassBlade._SHARED_GEOMETRY
        @texture = new THREE.MeshLambertMaterial color: 0xff00ff

        THREE.Mesh.call @, @geometry, @texture

        @.position.set x, y, z

    @initGeometry = ( x, y, z )->
        GrassBlade._SHARED_GEOMETRY = new THREE.PlaneGeometry 2, 50, 1, 1
        GrassBlade._SHARED_GEOMETRY.applyMatrix new THREE.Matrix4().makeTranslation 0, 25, 0 

