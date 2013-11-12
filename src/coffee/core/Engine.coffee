class EngineSingleton

    class EngineInstance

        _container: null

        renderer: null
        camera: null
        controls: null
        scene: null

        init: ( container ) ->
            @renderer = new THREE.WebGLRenderer alpha: false
            @renderer.setClearColor 0x222222, 1
            @renderer.setSize stage.size.w, stage.size.h

            @_container = container
            @_container.appendChild @renderer.domElement

            @camera = new THREE.PerspectiveCamera 45, stage.size.w / stage.size.h, 1, 10000
            @camera.position.set 200, 200, 500
            @camera.lookAt new THREE.Vector3 0, 0, 0

            @controls = new THREE.TrackballControls @camera
            @controls.rotateSpeed = 1
            @controls.zoomSpeed = .2
            @controls.panSpeed = .8
            @controls.noZoom = false
            @controls.noPan = false
            @controls.staticMoving = true
            @controls.dynamicDampingFactor = .3

            @scene = new THREE.Scene()

            @_initLights()

            updateManager.register @

        _initLights: ->
            ambient = new THREE.AmbientLight 0x101010
            @scene.add ambient

            directionalLight = new THREE.DirectionalLight 0xffffff
            directionalLight.position.set( 1, 1, 2 ).normalize()
            @scene.add directionalLight

            pointLight = new THREE.PointLight( 0xffffff )
            @scene.add pointLight

        update: ->
            @renderer.render @scene, @camera

    instance = null
    @get: -> 
        instance ?= new EngineInstance()

engine = EngineSingleton.get()