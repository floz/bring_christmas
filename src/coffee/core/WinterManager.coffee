class WinterManagerSingleton

	class WinterManagerInstance

		percent: 0

		_listeners: null

		constructor: ->
			@_listeners = []

		register: ( listener ) ->
			@_listeners.push listener

		setPercent: ( percent ) ->
			# percent *= 2
			return if percent == @percent
			@percent = percent
			for listener in @_listeners
				listener.updateWinter()

	@instance: null
	@get: ->
		@instance ?= new WinterManagerInstance()

winterManager = WinterManagerSingleton.get()