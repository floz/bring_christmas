class Sky extends THREE.Mesh

    constructor: ->
        texture = THREE.ImageUtils.loadTexture "img/sky_big.jpg"

        geometry = new THREE.PlaneGeometry Size.w * 1.5, 600
        material = new THREE.MeshBasicMaterial
            map: texture

        THREE.Mesh.call @, geometry, material

