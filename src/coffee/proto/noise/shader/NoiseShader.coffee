class NoiseShader

	uniforms: {
		"uText": { type: "t", value: null }
		"uTime": { type: "f", value: 0.0 }
	}

	vertexShader: [

		"varying vec2 vUv;"
		"varying vec3 vPos;"

		"void main() {"

			"vUv = uv;"
			"vPos = position;"

			"gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);"

		"}"

	].join( "\n" )

	fragmentShader: [

		"uniform sampler2D uText;"
		"uniform float uTime;"
		"varying vec2 vUv;"
		"varying vec3 vPos;"

		"void main() {"

			"vec2 newUv = vec2( vUv );"
			"newUv.x = ( newUv.x * 0.5 ) + uTime * 0.0025;"
			"vec4 texture = texture2D( uText, newUv );"

			"gl_FragColor = vec4( texture.rgb, 1.0 );"

		"}"

	].join( "\n" )