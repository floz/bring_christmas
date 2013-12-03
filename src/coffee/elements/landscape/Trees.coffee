class Trees extends THREE.Object3D

    _materialSnow: null
    _toOpacity: 0
    _currentOpacity: 0

    constructor: ->
        THREE.Object3D.call @

        textureBg = THREE.ImageUtils.loadTexture "img/trees_big.png"
        textureSnow = THREE.ImageUtils.loadTexture "img/trees_snow.png"

        geometry = new THREE.PlaneGeometry Size.w, 256
        materialBg = new THREE.MeshBasicMaterial
            map: textureBg
            transparent: true
        @_materialSnow = new THREE.MeshBasicMaterial
            map: textureSnow
            transparent: true

        @_materialSnow.opacity = 0

        @.add new THREE.Mesh geometry, materialBg
        @.add new THREE.Mesh geometry, @_materialSnow

        # material.depthWrite = false
        # material.blending = "NoBlending"

        winterManager.register @
        updateManager.register @

    updateWinter: ->
        @_toOpacity = winterManager.percent

    update: ->
        @_currentOpacity += ( @_toOpacity - @_currentOpacity ) * .1
        diff = @_currentOpacity - @_materialSnow.opacity
        diff = -diff if diff < 0
        if diff > .01
            @_materialSnow.opacity = @_currentOpacity
            @_materialSnow.needUpdate = true

