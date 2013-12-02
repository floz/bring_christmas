class SoundsSingleton

    class SoundsInstance

        _soundNormal: null
        _soundWinter: null

        constructor: ->
            @_soundNormal = new Howl
                urls: [ "sounds/Jupiter_Makes_Me_Scream_-_05_-_This_Girl.mp3" ]
                autoplay: true
                loop: true

            @_soundWinter = new Howl
                urls: [ "sounds/Akashic_Records_-_Bells_On_Xmas_Day__symphonic_orchestra_.mp3" ]
                autoplay: false
                volume: 0.0
                loop: true

        init: ->
            winterManager.register @
            @_soundWinter.volume 0
            @_soundWinter.play()
            

        updateWinter: ->
            @_soundWinter.volume winterManager.percent
            @_soundNormal.volume 1 - winterManager.percent
            

    @_instance: null
    @get: -> @_instance ?= new SoundsInstance()

sounds = SoundsSingleton.get()
