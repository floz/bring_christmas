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

        init: ( container ) ->
            @renderer = new THREE.WebGLRenderer 
                alpha: false
                antialias: true
                precision: "highp"
                stencil: false
                preserveDrawingBuffer: false

            @renderer.setClearColor 0x416ca3, 1
            @renderer.setSize stage.size.w, stage.size.h
            # @renderer.shadowMapEnabled = false;
            # @renderer.shadowMapSoft = false;
            # @renderer.gammaInput = true;
            # @renderer.gammaOutput = true;
            # @renderer.setSize stage.size.w >> 1, stage.size.h >> 1

            @_container = container
            @_container.appendChild @renderer.domElement

            @camera = new THREE.PerspectiveCamera 50, stage.size.w / stage.size.h, 1, 3000
            @camera.position.set 0, 250, 250
            @camera.lookAt new THREE.Vector3 0, 50, -1280 /2
            # @camera.position.set 0, 0, 400

            @scene = new THREE.Scene()

            @_initPostProcessing()

            updateManager.register @

        _initPostProcessing: ->
            @renderer.autoClear = false

            renderTarget = new THREE.WebGLRenderTarget stage.size.w * 2, stage.size.h * 2, 
                minFilter: THREE.LinearFilter
                magFilter: THREE.LinearFilter
                format: THREE.RGBFormat
                stencilBuffer: false

            @_composer = new THREE.EffectComposer @renderer, renderTarget
            renderPass = new THREE.RenderPass @scene, @camera
            @_composer.addPass renderPass

            @_composer.addPass new THREE.BloomPass 0.5

            fxaa = new THREE.ShaderPass THREE.FXAAShader
            fxaa.uniforms.resolution.value = new THREE.Vector2 1 / stage.size.w / 2, 1 / stage.size.h / 2
            @_composer.addPass fxaa

            effectVignette = new THREE.ShaderPass THREE.VignetteShader
            effectVignette.uniforms.offset.value = 1.0;
            effectVignette.uniforms.darkness.value = 1.05;
            # @_composer.addPass effectVignette

            effectCopy = new THREE.ShaderPass THREE.CopyShader
            effectCopy.renderToScreen = true
            @_composer.addPass effectCopy

        update: ->
            # @renderer.render @scene, @camera
            @_composer.render()

    instance = null
    @get: -> 
        instance ?= new EngineInstance()

engine = EngineSingleton.get()
