class LoadingScreen

    _backgroundImage: null
    _w: null
    _h: null

    _loader: null
    _isReadyToLaunch: false
    _everythingLoaded: false

    constructor: ->
        @_backgroundImage = document.getElementById "background_loading"
        @_w = @_backgroundImage.width
        @_h = @_backgroundImage.height

        sounds.load @_onNormalSoundLoaded, @_onAllSoundLoaded

        @resize()

    _onNormalSoundLoaded: ->
        sounds.start()

    _onAllSoundLoaded: =>
        @_loader = new PxLoader()
        @_loader.addImage "img/sky_big.jpg"
        @_loader.addImage "img/sky_lights.jpg"
        @_loader.addImage "img/trees_big.png"
        @_loader.addImage "img/trees_snow.png"
        @_loader.addCompletionListener @_onItemLoaded
        @_loader.start()

        $( "#loading-details" ).html( "...SOME SWEET GIFTS FOR YOUR EYES...")

    _onItemLoaded: =>
        @_everythingLoaded = true
        if @_isReadyToLaunch
            @_launch() 
        else
            $( "#loading-details" ).html( "...SOME MAGIC FOR YOUR MIND...")

    readyToLaunch: ->
        @_isReadyToLaunch = true
        @_launch() if @_everythingLoaded

    _launch: ->
        $( "#loading-text" ).html( "CHOOSE THE QUALITY OF YOUR JOURNEY:" )
        $( "#loading-details" ).html( "(YOU CAN ALWAYS TRY THE OTHER ONE BY COMING BACK)" )
        $( "#bts" ).addClass "visible"

        $( "#bt_low-def" ).on "click", @_launchLowDef
        $( "#bt_high-def" ).on "click", @_launchHighDef

    _clear: ->
        $( "#bt_low-def" ).unbind()
        $( "#bt_high-def" ).unbind()

        $( "#content" ).addClass "invisible"
        $( "#loading-text" ).addClass "invisible"
        $( "#loading-details" ).addClass "invisible"
        $( "#bts" ).addClass "invisible"
        $( "#background_loading" ).addClass "invisible"

        setTimeout 10000, @_removeLoading

    _removeLoading: =>
        $( "#loading" ).remove()

    _launchLowDef: =>
        new Main( false, @_onWorldGenerated )
        @_clear()

    _launchHighDef: =>
        new Main( true, @_onWorldGenerated )
        @_clear()

    resize: ->
        size = Utils.resize stage.size.w, stage.size.h, @_w, @_h
        @_backgroundImage.style.left = size.x + "px"
        @_backgroundImage.style.top = size.y + "px"
        @_backgroundImage.width = size.w
        @_backgroundImage.height = size.h
        

class Main

    constructor: ( isHighDef )->
        engine.init document.getElementById "scene", isHighDef
        # engine.scene.add new Axis 1000

        Colors.summer = new ColorData document.getElementById "color-summer"
        Colors.winter = new ColorData document.getElementById "color-winter"

        world = new World()
        engine.scene.add world

        sounds.init()

        # updateManager.enableDebugMode()
        updateManager.start()

        winterManager.registerWinter @

    onWinter: ->
        $( "#title_end" ).addClass "visible"

    onSummer: ->
        $( "#title_end" ).removeClass "visible"
        $( "#title_end" ).addClass "invisible"
        
loadingScreen = new LoadingScreen()
$( window ).on "load", ->
    loadingScreen.readyToLaunch()
    # $( "#loading" ).remove()
    # new Main( true )

$( window ).on "resize", ->
    loadingScreen.resize()
