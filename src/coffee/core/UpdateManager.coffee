class UpdateManagerSingleton

    class UpdateManagerInstance

        _list: null
        _stats: null

        _rafId: -1

        constructor: ->
            @_list = []

        enableDebugMode: ->
            @_stats = new Stats()
            @_stats.domElement.style.position = "absolute"
            @_stats.domElement.style.left = "0"
            @_stats.domElement.style.top = "0"
            document.body.appendChild @_stats.domElement

        start: -> @_rafId = requestAnimationFrame @update

        update: =>
            @_stats.begin() if @_stats
            item.update() for item in @_list
            @_rafId = requestAnimationFrame @update
            @_stats.end() if @_stats

        stop: -> cancelAnimationFrame @_rafId

        register: ( item ) -> @_list.push item if @_list.indexOf( item ) == -1

        unregister: ( item ) -> @_list.splice idx, 1 if ( idx = @_list.indexOf( item ) ) >= 0

    instance = null
    @get: -> instance ?= new UpdateManagerInstance()

updateManager = UpdateManagerSingleton.get()

