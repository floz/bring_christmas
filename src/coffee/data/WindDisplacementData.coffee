class WindDisplacementData

    _xMin: 1.0
    _yMin: 1.0
    _xMax: 1.0
    _yMax: 1.0
    _canRotate: false

    _channels: null
    _sizeW: 0
    _sizeH: 0
    _ctx: null

    _pOrientation: { x: 0.0, y: 0.0 }
    _orientation: 0.0
    _lastX: 0.0
    _lastY: 0.0

    _alpha: 1.0

    _speed: 0.0

    constructor: ( sizeW, sizeH, @_xMin, @_yMin, @_xMax, @_yMax ) ->
        @_channels = []

    addChannel: ( channel ) ->
        if @_channels.length == 0
            @_sizeW = channel.w
            @_sizeH = channel.h
        
        @_channels.push channel

    update: ( x, y ) ->
        x = @_scaleX x
        y = @_scaleY y

        if @_lastX != x || @_lastY != y
            channel.fill @_alpha for channel in @_channels

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

            @_alpha += ( .05 - @_alpha ) * .05
            if @_alpha > .5
                @_drawCanvas()
                channel.fill @_alpha for channel in @_channels
            else
                channel.fill @_alpha for channel in @_channels
                @_drawCanvas()


            dx = x - @_lastX
            dy = y - @_lastY
            dist = Math.sqrt dx * dx + dy * dy
            @_speed += dist * .05
            @_speed += - @_speed * .05
        else
            @_alpha += ( 1 - @_alpha ) * .025

            a = @_orientation
            @_pOrientation.x += Math.cos( a ) * @_speed
            @_pOrientation.y += Math.sin( a ) * @_speed

            @_drawCanvas()

            @_speed += - @_speed * .1

            channel.fill @_alpha for channel in @_channels

        @_lastX = x
        @_lastY = y

    _drawCanvas: ->
        channel.draw @_pOrientation.x, @_pOrientation.y, @_orientation for channel in @_channels

    _scaleX: ( value ) ->
        xMin = 0 - @_xMin
        xMax = xMin + @_xMax

        value += xMin
        value = 0 if value < 0
        value = xMax if value > xMax
        percent = value / xMax

        return percent * @_sizeW

    _scaleY: ( value ) ->
        yMin = 0 - @_yMin
        yMax = yMin + @_yMax

        value = 0 if value > 0
        value = yMax if value < yMax
        percent = value / yMax

        return percent * @_sizeH

                

