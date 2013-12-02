class Trees extends THREE.Object3D

    _materialSnow: null

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

    updateWinter: ->
        @_materialSnow.opacity = winterManager.percent * 2
        @_materialSnow.needUpdate = true

