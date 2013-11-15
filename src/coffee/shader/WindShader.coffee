class WindShader

	attributes: {}

	uniforms: {}

	vertexShader: [

		"void main() {"
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );"
		"}"

	].join( "\n" )

	fragmentShader: [

		"void main() {"

			"gl_FragColor = vec4( 0.031, 0.28, 0.13, 0.0 );"

		"}"

	].join("\n")