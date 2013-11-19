class Main

    constructor: ->
        engine.init document.getElementById "scene"
        engine.scene.add new Axis 1000

        world = new World()
        engine.scene.add world

        updateManager.enableDebugMode()
        updateManager.start()
        
new Main()
