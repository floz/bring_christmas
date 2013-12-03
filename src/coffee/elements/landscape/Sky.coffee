class Sky extends THREE.Object3D

    _materialBg: null
    _materialLight: null
    _geometry: null

    _toOpacity: 1
    _currentOpacity: 0

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
        updateManager.register @

    updateWinter: ->
        @_toOpacity = 1 - winterManager.percent

    update: ->
        @_currentOpacity += ( @_toOpacity - @_currentOpacity ) * .1
        diff = @_currentOpacity - @_materialLight.opacity
        diff = -diff if diff < 0
        if diff > .01
            @_materialLight.opacity = @_currentOpacity
            @_materialLight.needUpdate = true


