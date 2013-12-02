class EngineSingleton

    class EngineInstance

        _container: null
        _stats: null

        renderer: null
        camera: null
        controls: null
        scene: null

        _composer: null
        _depthTarget: null

        init: ( container, isHighDef ) ->
            @renderer = new THREE.WebGLRenderer 
                alpha: false
                antialias: false
                precision: "lowp"
                stencil: false
                preserveDrawingBuffer: false

            @renderer.sortObjects = false
            @renderer.setClearColor 0x031a3f, 1
            @renderer.setSize stage.size.w, stage.size.h

            @_container = container
            @_container.appendChild @renderer.domElement

            @camera = new THREE.PerspectiveCamera 50, stage.size.w / stage.size.h, 1, 3000
            @camera.position.set 0, 250, 250
            @camera.lookAt new THREE.Vector3 0, 50, -Size.h / 2
            # @camera.position.set 0, 0, 400

            @scene = new THREE.Scene()

            @_initPostProcessing() if isHighDef

            updateManager.register @

        _initPostProcessing: ->
            @renderer.autoClear = false

            renderTarget = new THREE.WebGLRenderTarget stage.size.w * window.devicePixelRatio, stage.size.h * window.devicePixelRatio, 
                minFilter: THREE.LinearFilter
                magFilter: THREE.LinearFilter
                format: THREE.RGBFormat
                stencilBuffer: false

            @_composer = new THREE.EffectComposer @renderer, renderTarget
            renderPass = new THREE.RenderPass @scene, @camera
            @_composer.addPass renderPass

            @_composer.addPass new THREE.BloomPass 0.5

            effectVignette = new THREE.ShaderPass THREE.VignetteShader
            effectVignette.uniforms.offset.value = 1.0;
            effectVignette.uniforms.darkness.value = 1.05;
            # @_composer.addPass effectVignette

            effectCopy = new THREE.ShaderPass THREE.CopyShader
            effectCopy.renderToScreen = true
            @_composer.addPass effectCopy

        update: ->
            if @_composer
                @_composer.render()
            else
                @renderer.render @scene, @camera

    instance = null
    @get: -> 
        instance ?= new EngineInstance()

engine = EngineSingleton.get()
