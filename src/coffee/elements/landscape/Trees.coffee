class Trees extends THREE.Mesh

	constructor: ->
		texture = THREE.ImageUtils.loadTexture "img/trees.png"
		material = new THREE.MeshBasicMaterial
			map: texture
			transparent: true
		geometry = new THREE.PlaneGeometry 512, 256

		THREE.Mesh.call @, geometry, material
