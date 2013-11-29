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
            @renderer = new THREE.WebGLRenderer alpha: false, antialias: true
            @renderer.setClearColor 0x416ca3, 1
            @renderer.setSize stage.size.w, stage.size.h
            # @renderer.setSize stage.size.w >> 1, stage.size.h >> 1

            @_container = container
            @_container.appendChild @renderer.domElement

            @camera = new THREE.PerspectiveCamera 50, stage.size.w / stage.size.h, 1, 3000
            @camera.position.set 0, 120, 150
            @camera.lookAt new THREE.Vector3 0, 50, -1280 /2
            # @camera.position.set 0, 0, 400

            @scene = new THREE.Scene()

            # @_initLights()
            @_initPostProcessing()

            updateManager.register @

        _initLights: ->
            ambient = new THREE.AmbientLight 0x8b937f
            # ambient = new THREE.AmbientLight 0xffffff
            # @scene.add ambient

            # directionalLight = new THREE.DirectionalLight 0xffffff
            # directionalLight.position.set( 1, 1, 2 ).normalize()
            # @scene.add directionalLight

            pointLight = new THREE.PointLight( 0xe9ff9b, 2, 1000 )
            # pointLight = new THREE.PointLight( 0xffffff, 2, 1500 )
            pointLight.position.set 50, 50, 50
            @scene.add pointLight

        _initPostProcessing: ->
            @renderer.autoClear = false

            @_depthTarget = new THREE.WebGLRenderTarget stage.size.w, stage.size.h,
                minFilter: THREE.NearestFilter
                magFilter: THREE.NearestFilter
                format: THREE.RGBAFormat

            @_composer = new THREE.EffectComposer @renderer
            @_composer.addPass new THREE.RenderPass @scene, @camera

            ssao = new THREE.ShaderPass THREE.SSAOShader
            ssao.uniforms.tDepth.value = @_depthTarget
            ssao.uniforms.size.value.set stage.size.w, stage.size.h
            ssao.uniforms.cameraNear.value = 1
            ssao.uniforms.cameraFar.value = 3000
            ssao.uniforms.aoClamp.value = 0.5
            ssao.uniforms.lumInfluence.value = 0.4
            ssao.uniforms.onlyAO.value = 0
            # @_composer.addPass ssao

            @_composer.addPass new THREE.BloomPass 0.5

            fxaa = new THREE.ShaderPass THREE.FXAAShader
            fxaa.uniforms.resolution.value = new THREE.Vector2 1 / stage.size.w, 1 / stage.size.h
            @_composer.addPass fxaa

            effectVignette = new THREE.ShaderPass THREE.VignetteShader
            effectVignette.uniforms.offset.value = 1.0;
            effectVignette.uniforms.darkness.value = 1.1;
            @_composer.addPass effectVignette

            effectCopy = new THREE.ShaderPass THREE.CopyShader
            effectCopy.renderToScreen = true
            @_composer.addPass effectCopy

        update: ->

            @renderer.clearTarget @_depthTarget
            @renderer.render @scene, @camera, @_depthTarget
            @_composer.render .1

    instance = null
    @get: -> 
        instance ?= new EngineInstance()

engine = EngineSingleton.get()
