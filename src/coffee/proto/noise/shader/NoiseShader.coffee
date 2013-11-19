class NoiseShader

	uniforms: {
		"uText": { type: "t", value: null }
		"uOffsetX": { type: "f", value: 0.0 }
	}

	vertexShader: [

		"uniform float uOffsetX;"

		"varying vec2 vUv;"
		"varying vec3 vPos;"

		"void main() {"

			"vUv = vec2( uv.x * 0.5 + uOffsetX * 0.0025, uv.y );"
			"vPos = position;"

			"gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);"

		"}"

	].join( "\n" )

	fragmentShader: [

		"uniform sampler2D uText;"

		"varying vec2 vUv;"
		"varying vec3 vPos;"

		"void main() {"

			"vec4 texture = texture2D( uText, vUv );"
			"gl_FragColor = vec4( texture.rgb, 1.0 );"

		"}"

	].join( "\n" )