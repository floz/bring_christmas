class HeightData

	@_rawData: null
	@_data: null

	@get: ->
		return HeightData._data if HeightData._data

		canvas = document.createElement "canvas"
		canvas.width = 128
		canvas.height = 128

		ctx = canvas.getContext "2d"
		ctx.drawImage document.getElementById( "texture-height" ), 0, 0
		HeightData._rawData = data = ctx.getImageData( 0, 0, 128, 128 ).data

		HeightData._data = []

		j = 0
		for i in [ 0...data.length ] by 4
			HeightData._data[ j++ ] = data[ i ]


		HeightData._data

	@getPixelValue: ( x, y ) ->
		HeightData._data[ y * 128 + x ]

