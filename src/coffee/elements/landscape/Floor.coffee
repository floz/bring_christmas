class Floor extends THREE.Mesh

    _geometry: null
    _texture: null
    _material: null
    _canvas: null
    _canvasW: 0
    _canvasH: 0
    _ctx: null

    w: 0
    h: 0

    constructor: ( @w, @h ) ->
        @_geometry = new THREE.PlaneGeometry w, h, @w / 10, @h / 10
        @_modifyFloor()

        @_material = new THREE.MeshBasicMaterial color: Colors.floorSummer.getHex(), lights: false

        @_canvas = document.createElement "canvas"
        @_canvas.width = @_canvasW = ColorChannel.canvas.width
        @_canvas.height = @_canvasH = ColorChannel.canvas.height
        @_ctx = @_canvas.getContext "2d"
        
        @_ctx.fillStyle = "rgb( " + Colors.floorSummer.r * 255 + ", " + Colors.floorSummer.g * 255 + ", " + Colors.floorSummer.b * 255 + " )"
        @_ctx.fillRect 0, 0, @_canvasW, @_canvasH

        @_texture = new THREE.Texture @_canvas

        @_material = new THREE.MeshBasicMaterial
            map: @_texture
            transparent: false
            lights: false

        THREE.Mesh.call @, @_geometry, @_material

        @.rotation.x = -Math.PI * .5

    _modifyFloor: ->
        data = HeightData.get()

        baseRatio = @h >> 1
        baseW = @w / 10 >> 1
        baseH = @h / 10 >> 1

        vertices = @_geometry.vertices
        for vertice, i in vertices
            ratio = ( baseRatio + vertice.y ) / @h
            # vertice.z = data[ i ] + ratio * 100
            ratio = 1 #+ 0.5 * ratio
            vertice.z += HeightData.getPixelValue baseW + vertice.x / 10 >> 0, baseH - vertice.y / 10 >> 0#* ratio

        @_geometry.computeFaceNormals()

    update: ->
        @_ctx.fillStyle = "rgb( " + Colors.floorSummer.r * 255 + ", " + Colors.floorSummer.g * 255 + ", " + Colors.floorSummer.b * 255 + " )"
        @_ctx.fillRect 0, 0, @_canvasW, @_canvasH
        @_ctx.save()
        @_ctx.scale 1, -1
        @_ctx.drawImage ColorChannel.canvas, 0, 0, @_canvasW, -@_canvasH
        @_ctx.restore()
        @_texture.needsUpdate = true
