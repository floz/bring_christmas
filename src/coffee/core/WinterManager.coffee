class WinterManagerSingleton

    class WinterManagerInstance

        percent: 0

        _listeners: null
        _listenersGap: null
        _listenersWinter: null

        _isWinter: false

        _toPercent: 0

        constructor: ->
            @_listeners = []
            @_listenersGap = []
            @_listenersWinter = []

        register: ( listener ) ->
            @_listeners.push listener

        registerGap: ( listener ) ->
            @_listenersGap.push listener

        registerWinter: ( listener ) ->
            @_listenersWinter.push listener

        setPercent: ( percent ) ->
            percent -= .1
            percent = 0 if percent < 0
            percent *= 2
            return if percent == @percent

            if @percent < .1 && percent >= .1
                @_notifyGap .15
            if @percent < .2 && percent >= .2
                @_notifyGap .3
            else if @percent < .4 && percent >= .4
                @_notifyGap .6
            else if @percent < .5 && percent >= .5
                @_notifyGap 1
            else if @percent < .61 && percent >= .61
                @_notifyWinter()

            @percent = percent
            for listener in @_listeners
                listener.updateWinter()

        _notifyGap: ( value ) ->
            for listener in @_listenersGap
                listener.onGapWinter.call @, value

        _notifyWinter: =>
            return if @_isWinter
            @_isWinter = true
            for listener in @_listenersWinter
                listener.onWinter()

            setTimeout @_notifySummer, 22000
            return

        _notifySummer: =>
            console.log "sunner"
            for listener in @_listenersWinter
                listener.onSummer()
            return

        gotoPercent: ( value ) ->
            @_toPercent = value
            updateManager.register @

        update: ->
            p = @percent + ( @_toPercent - @percent ) * .05
            @setPercent p



    @instance: null
    @get: ->
        @instance ?= new WinterManagerInstance()

winterManager = WinterManagerSingleton.get()
