class Main

    constructor: ->
        engine.init document.getElementById "scene"
        # engine.scene.add new Axis 1000

        Colors.summer = new ColorData document.getElementById "color-summer"
        Colors.winter = new ColorData document.getElementById "color-winter"

        world = new World()
        engine.scene.add world

        updateManager.enableDebugMode()
        updateManager.start()
        
$( window ).on "load", ->
    new Main()
