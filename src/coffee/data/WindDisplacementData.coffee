class WindDisplacementData

    _xMin: 1.0
    _yMin: 1.0
    _xMax: 1.0
    _yMax: 1.0

    canvas: null
    _size: 0
    _ctx: null
    _textDisplacement: null
    _textDisplacementW: 0
    _textDisplacementH: 0
    _fillStyle: "rgba( 127, 127, 255, .135 )"

    _pOrientation: { x: 0.0, y: 0.0 }
    _orientation: 0.0
    _orientationTo: 0.0
    _lastX: 0.0
    _lastY: 0.0

    constructor: ( @_xMin, @_yMin, @_xMax, @_yMax ) ->
        @canvas = document.getElementById "map-displacement"
        @_size = @canvas.width
        @_ctx = @canvas.getContext "2d"
        @_ctx.fillStyle = "rgba( 127, 127, 255, 1 )"
        @_ctx.fillRect 0, 0, @_size, @_size

        @_textDisplacement = document.getElementById "texture-displacement"
        @_textDisplacementW = @_textDisplacement.width
        @_textDisplacementH = @_textDisplacement.height

    update: ( x, y ) ->
        x = @_scaleX x
        y = @_scaleY y

        dx = x - @_pOrientation.x
        dy = y - @_pOrientation.y
        @_pOrientation.x += dx * .1
        @_pOrientation.y += dy * .1
        dx = x - @_pOrientation.x
        dy = y - @_pOrientation.y
        dist = Math.sqrt dx * dx + dy * dy
        if dist <= 8
            a = Math.atan2( dy, dx ) + Math.PI
            @_pOrientation.x = x + Math.cos( a ) * 8
            @_pOrientation.y = y + Math.sin( a ) * 8
            dx = x - @_pOrientation.x
            dy = y - @_pOrientation.y

        newOrientation = Math.atan2 dy, dx
        @_orientation += Math.PI * 2 while newOrientation - @_orientation > Math.PI 
        @_orientation -= Math.PI * 2 while newOrientation - @_orientation < -Math.PI
        @_orientation += ( newOrientation - @_orientation ) * .1

        @_ctx.fillStyle = @_fillStyle
        @_ctx.fillRect 0, 0, @_size, @_size

        @_ctx.save()
        @_ctx.translate @_pOrientation.x, @_pOrientation.y
        @_ctx.rotate @_orientation
        @_ctx.drawImage @_textDisplacement, -@_textDisplacementW >> 1, -@_textDisplacementH >> 1
        @_ctx.restore()

        @_lastX = x
        @_lastY = y

    _scaleX: ( value ) ->
        xMin = 0 - @_xMin
        xMax = xMin + @_xMax

        value += xMin
        value = 0 if value < 0
        value = xMax if value > xMax
        percent = value / xMax

        return percent * @_size

    _scaleY: ( value ) ->
        yMin = 0 - @_yMin
        yMax = yMin + @_yMax

        value = 0 if value > 0
        value = yMax if value < yMax
        percent = value / yMax

        return percent * @_size

                

