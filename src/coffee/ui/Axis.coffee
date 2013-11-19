class Axis extends THREE.Object3D

	constructor: ( length ) ->
		THREE.Object3D.call @

		@.add @_buildAxis new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xff0000, false
		@.add @_buildAxis new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xff0000, true
		@.add @_buildAxis new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00ff00, false
		@.add @_buildAxis new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00ff00, true
		@.add @_buildAxis new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000ff, false
		@.add @_buildAxis new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000ff, true

	_buildAxis: ( src, dst, colorHex, dashed ) ->
		geom = new THREE.Geometry()
		if dashed
			mat = new THREE.LineDashedMaterial
				lineWidth: 3
				color: colorHex
				dashSize: 3
				gapSize: 3
		else
			mat = new THREE.LineBasicMaterial
				lineWidth: 3
				color: colorHex

		geom.vertices.push src
		geom.vertices.push dst
		geom.computeLineDistances()

		axis = new THREE.Line geom, mat, THREE.LinePieces
