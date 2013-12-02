class WindDisplacementChannel

    canvas: null
    _canRotate: false
    w: 0
    h: 0
    _ctx: null
    _textDisplacement: null
    _textDisplacementW: 0
    _textDisplacementH: 0

    constructor: ( idCanvas, idText, canRotate ) ->
        @canvas = document.getElementById idCanvas
        @_canRotate = canRotate || false
        @w = @canvas.width
        @h = @canvas.height
        @_ctx = @canvas.getContext "2d"
        @_ctx.fillStyle = "rgba( 128, 128, 128, 1 )"
        # @canvas.globalCompositeOperation = "lighter"
        
        @_textDisplacement = document.getElementById idText
        @_textDisplacementW = @_textDisplacement.width
        @_textDisplacementH = @_textDisplacement.height

    fill: ( alpha ) ->
        @_ctx.fillStyle = "rgba( 128, 128, 128, " + alpha + ")"
        @_ctx.fillRect 0, 0, @w, @h
        

    draw:( x, y, orientation ) ->
        @_ctx.save()
        @_ctx.translate x, y
        @_ctx.scale .75, .75
        @_ctx.rotate orientation if @_canRotate
        @_ctx.drawImage @_textDisplacement, -@_textDisplacementW >> 1, -@_textDisplacementH >> 1
        @_ctx.restore()
