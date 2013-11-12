class UpdateManagerSingleton

    class UpdateManagerInstance

        _list: null
        _rafId: -1

        constructor: ->
            @_list = []

        start: -> @_rafId = requestAnimationFrame @update

        update: =>
            item.update() for item in @_list
            @_rafId = requestAnimationFrame @update

        stop: -> cancelAnimationFrame @_rafId

        register: ( item ) -> @_list.push item if @_list.indexOf( item ) == -1

        unregister: ( item ) -> @_list.splice idx, 1 if ( idx = @_list.indexOf( item ) ) >= 0

    instance = null
    @get: -> instance ?= new UpdateManagerInstance()

updateManager = UpdateManagerSingleton.get()

