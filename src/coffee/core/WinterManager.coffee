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
            percent = 1 if percent > 1
            return if percent == @percent

            if @percent < .1 && percent >= .1
                @_notifyGap .15
            if @percent < .2 && percent >= .2
                @_notifyGap .3
            else if @percent < .3 && percent >= .3
                @_notifyGap 1
            else if @percent < .4 && percent >= .4
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
            for listener in @_listenersWinter
                listener.onSummer()
            @_isWinter = false
            return

        gotoPercent: ( value ) ->
            @_toPercent = value
            updateManager.register @

        reset: ->
            @_toPercent = 0
            updateManager.unregister @

        update: ->
            p = @percent + ( @_toPercent - @percent ) * .05
            @setPercent p



    @instance: null
    @get: ->
        @instance ?= new WinterManagerInstance()

winterManager = WinterManagerSingleton.get()
