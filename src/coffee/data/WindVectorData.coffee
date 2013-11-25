class WindVectorData

    x: 0
    y: 0

    orientation: 0.0
    length: 0.0

    direction: { x: 0.0, y: 0.0 }

    _needUpdate: true

    constructor: ( @x, @y ) ->

    add: ( orientation, length, ratio ) ->
        @orientation += ( orientation - @orientation ) * ratio
        @length += ( length - @length ) * ratio

        @_needUpdate = true

    update: ->
        @length += ( 0.0 - length ) * .07

    getDirection: ->
        return @direction if not @_needUpdate

        @direction.x = @x + Math.cos( @orientation ) * @length
        @direction.y = @y + Math.sin( @orientation ) * @length

        return @direction