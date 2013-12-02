class Sky extends THREE.Object3D

    _materialBg: null
    _materialLight: null
    _geometry: null

    constructor: ->
        THREE.Object3D.call @

        textureBg = THREE.ImageUtils.loadTexture "img/sky_big.jpg"
        textureLight = THREE.ImageUtils.loadTexture "img/sky_lights.jpg"

        @_geometry = new THREE.PlaneGeometry Size.w * 1.5, 600
        @_materialBg = new THREE.MeshBasicMaterial
            map: textureBg
        @_materialLight = new THREE.MeshBasicMaterial
            map: textureLight
            transparent: true

        # @_materialBg.blending =
        # @_materialLight.depthWrite = false

        meshBg = new THREE.Mesh @_geometry, @_materialBg
        @.add meshBg
        meshLight = new THREE.Mesh @_geometry, @_materialLight
        @.add meshLight

        # meshLight.position.z = 1

        winterManager.register @

    updateWinter: ->
        @_materialLight.opacity = 1 - winterManager.percent * 2
        @_materialLight.needUpdate = true


