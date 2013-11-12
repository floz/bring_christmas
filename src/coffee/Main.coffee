class Main

    constructor: ->
        engine.init document.getElementById "scene"
        engine.scene.add new Axis 1000

        updateManager.start()

$( document ).ready -> new Main()
