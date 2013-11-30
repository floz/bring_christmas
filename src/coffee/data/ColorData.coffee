class ColorData

    _w: 0
    _h: 0
    _colors: null

    constructor: ( @img ) ->
        @_w = @img.width
        @_h = @img.height

        console.log @_w, @_h

        canvas = document.createElement "canvas"
        canvas.width = @_w
        canvas.height = @_h
        document.body.appendChild canvas

        ctx = canvas.getContext "2d"
        ctx.drawImage @img, 0, 0
        data = ctx.getImageData( 0, 0, @_w, @_h ).data

        @_colors = []
        for i in [ 0...data.length ] by 4
            color = new THREE.Color()
            color.r = data[ i ] / 255
            color.g = data[ i + 1 ] / 255
            color.b = data[ i + 2 ] / 255
            @_colors.push color
        console.log @_colors.length

    getPixelValue: ( x, y ) -> 
        x = @_w - 1 if x > @_w - 1
        y = @_h - 1 if y > @_h - 1
        @_colors[ y * @_w + x ]


