class ColorChannel

    canvas: null
    _size: 0
    _ctx: null
    _textDisplacement: null
    _textDisplacementW: 0
    _textDisplacementH: 0
    _dots: null

    constructor: ( idCanvas, idText, canRotate ) ->
        @canvas = document.getElementById idCanvas
        @_canRotate = canRotate || false
        @_size = @canvas.width
        @_ctx = @canvas.getContext "2d"
        @_ctx.fillStyle = "rgba( 0, 0, 0, 0 )"

        @_textDisplacement = document.getElementById idText
        @_textDisplacementW = @_textDisplacement.width
        @_textDisplacementH = @_textDisplacement.height

        @_createDots()

    _createDots: ->
        @_dots = []

        step = 7
        space = @_size / step
        px = 0
        py = 0
        for x in [ 0...step ]
            for y in [ 0...step ]
                @_dots.push new ColorDot px, py
                px += space
            px = 0
            py += space

    fill: ( alpha ) ->

    draw: ( x, y ) ->
        @_ctx.clearRect 0, 0, @_size, @_size

        for dot in @_dots
            dx = x - dot.x
            dy = y - dot.y
            dist = Math.sqrt dx * dx + dy * dy

            dot.activate() if dist < 20
            dot.update()

            @_ctx.save()
            @_ctx.globalAlpha = dot.alpha
            @_ctx.translate dot.x, dot.y
            @_ctx.drawImage @_textDisplacement, -@_textDisplacementW >> 1, -@_textDisplacementH >> 1
            @_ctx.restore()


class ColorDot

    x: 0.0
    y: 0.0
    alpha: 0.0
    time: 0.0

    activated: false

    constructor: ( @x, @y ) ->

    activate: ->
        return if @activated
        @activated = true
        setTimeout @deactivate, 5000

    update: ->
        if @activated
            @alpha += ( 1 - @alpha ) * .05
        else
            @alpha += ( 0 - @alpha ) * .05

    deactivate: =>
        return if !@activated
        @activated = false
