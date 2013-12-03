class SoundsSingleton

    class SoundsInstance

        _soundNormal: null
        _soundWinter: null
        _soundWind: null
        _soundWindUser: null
        _soundPropagation: null

        _onAllSoundsLoaded: null
        _loadedCount: 0
        _soundsCount: 4

        _currentSoundWind: 0
        _toSoundWind: 0

        constructor: ->            

        init: ->
            winterManager.register @
            winterManager.registerGap @
            winterManager.registerWinter @

            @_soundWinter.volume 0
            @_soundWinter.play()

            @_soundWindUser.volume 0
            @_soundWindUser.play()

            updateManager.register @

        onSummer: =>
            @_soundPropagation.play()

        onWinter: =>
            @_soundPropagation.play()

        onGapWinter: =>
            @_soundPropagation.play()
            # new Howl(
            #     urls: [ "sounds/propagation.mp3" ]
            #     volume: 1.0
            #     loop: false
            # ).play()

        update: ->
            @_currentSoundWind += ( @_toSoundWind - @_currentSoundWind ) * .1
            @_soundWindUser.volume @_currentSoundWind

        load: ( onFirstSoundLoaded, @_onAllSoundsLoaded ) ->
            @_soundNormal = new Howl
                urls: [ "sounds/Jupiter_Makes_Me_Scream_-_05_-_This_Girl.mp3" ]
                onload: onFirstSoundLoaded
                loop: true

            @_soundWinter = new Howl
                urls: [ "sounds/Akashic_Records_-_Bells_On_Xmas_Day__symphonic_orchestra_.mp3" ]
                onload: @_onSoundLoaded
                volume: 0.0
                loop: true

            @_soundWind = new Howl
                urls: [ "sounds/137021__jeffreys2__outside-wind.mp3" ]
                onload: @_onSoundLoaded
                volume: 0.0
                loop: true

            @_soundWindUser = new Howl
                urls: [ "sounds/179110__jasoneweber__wind-1-loop.mp3" ]
                onload: @_onSoundLoaded
                volume: 0.0
                loop: true

            @_soundPropagation = new Howl
                urls: [ "sounds/propagation.mp3" ]
                onload: @_onSoundLoaded
                volume: 1.0
                loop: false
        
        _onSoundLoaded: =>
            @_loadedCount++
            @_onAllSoundsLoaded() if @_loadedCount == @_soundsCount            

        start: ->
            @_soundNormal.play()

        startWind: ->
            @_soundWind.volume 1
            @_soundWind.play

        updateWinter: ->
            @_soundWinter.volume winterManager.percent * 2
            pMusiqueNormal = 1 - winterManager.percent * 2
            pMusiqueNormal = 0 if pMusiqueNormal < 0
            @_soundNormal.volume pMusiqueNormal

        setSoundWind: ( value ) ->
            @_toSoundWind = ( 1 - value ) * .5

    @_instance: null
    @get: -> @_instance ?= new SoundsInstance()

sounds = SoundsSingleton.get()
