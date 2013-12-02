class HeightData

    @_rawData: null
    @_data: null

    _w: 0
    _h: 0

    @get: ->
        return HeightData._data if HeightData._data

        texture = document.getElementById( "texture-height" )
        @_w = texture.width
        @_h = texture.height

        canvas = document.createElement "canvas"
        canvas.width = @_w
        canvas.height = @_h

        ctx = canvas.getContext "2d"
        ctx.drawImage texture, 0, 0
        HeightData._rawData = data = ctx.getImageData( 0, 0, @_w, @_h ).data

        HeightData._data = []

        j = 0
        for i in [ 0...data.length ] by 4
            HeightData._data[ j++ ] = data[ i ]

        HeightData._data

    @getPixelValue: ( x, y ) ->
        x = @_w - 1 if x > @_w - 1
        y = @_h - 1 if y > @_h - 1
        HeightData._data[ y * @_w + x ]

