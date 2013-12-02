class SoundsSingleton

    class SoundsInstance

        _soundNormal: null
        _soundWinter: null

        _onAllSoundsLoaded: null
        _loadedCount: 0
        _soundsCount: 2

        constructor: ->
            

        init: ->
            winterManager.register @
            @_soundWinter.volume 0
            @_soundWinter.play()

        load: ( onFirstSoundLoaded, _onAllSoundsLoaded ) ->
            @_soundNormal = new Howl
                urls: [ "sounds/Jupiter_Makes_Me_Scream_-_05_-_This_Girl.mp3" ]
                onload: onFirstSoundLoaded
                loop: true

            @_soundWinter = new Howl
                urls: [ "sounds/Akashic_Records_-_Bells_On_Xmas_Day__symphonic_orchestra_.mp3" ]
                onload: _onAllSoundsLoaded
                volume: 0.0
                loop: true
        
        _onSoundLoaded: ->
            @_loadedCount++
            @_onAllSoundsLoaded() if @_loadedCount == @_soundsCount            

        start: ->
            @_soundNormal.play()

        updateWinter: ->
            @_soundWinter.volume winterManager.percent * 2
            @_soundNormal.volume 1 - winterManager.percent * 2
            

    @_instance: null
    @get: -> @_instance ?= new SoundsInstance()

sounds = SoundsSingleton.get()
