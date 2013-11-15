var Axis,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Axis = (function(_super) {
  __extends(Axis, _super);

  function Axis(length) {
    THREE.Object3D.call(this);
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xff0000, false));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xff0000, true));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00ff00, false));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00ff00, true));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000ff, false));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000ff, true));
  }

  Axis.prototype._buildAxis = function(src, dst, colorHex, dashed) {
    var axis, geom, mat;
    geom = new THREE.Geometry();
    if (dashed) {
      mat = new THREE.LineDashedMaterial({
        lineWidth: 3,
        color: colorHex,
        dashSize: 3,
        gapSize: 3
      });
    } else {
      mat = new THREE.LineBasicMaterial({
        lineWidth: 3,
        color: colorHex
      });
    }
    geom.vertices.push(src);
    geom.vertices.push(dst);
    geom.computeLineDistances();
    return axis = new THREE.Line(geom, mat, THREE.LinePieces);
  };

  return Axis;

})(THREE.Object3D);

var WindShader;

WindShader = (function() {
  function WindShader() {}

  WindShader.prototype.attributes = {};

  WindShader.prototype.uniforms = {};

  WindShader.prototype.vertexShader = ["void main() {", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

  WindShader.prototype.fragmentShader = ["void main() {", "gl_FragColor = vec4( 0.031, 0.28, 0.13, 0.0 );", "}"].join("\n");

  return WindShader;

})();

var Floor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Floor = (function(_super) {
  __extends(Floor, _super);

  Floor.prototype._geometry = null;

  Floor.prototype._texture = null;

  Floor.prototype.w = 0;

  Floor.prototype.h = 0;

  function Floor(w, h) {
    this.w = w;
    this.h = h;
    this._geometry = new THREE.PlaneGeometry(w, h, 4, 4);
    this._texture = new THREE.MeshLambertMaterial({
      color: 0x084820
    });
    THREE.Mesh.call(this, this._geometry, this._texture);
    this.rotation.x = -Math.PI * .5;
  }

  return Floor;

})(THREE.Mesh);

var Grass,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Grass = (function(_super) {
  __extends(Grass, _super);

  Grass.prototype.w = 0;

  Grass.prototype.h = 0;

  Grass.prototype._cntBlades = null;

  Grass.prototype._blades = null;

  function Grass(w, h) {
    this.w = w;
    this.h = h;
    THREE.Object3D.call(this);
    this._generateBlades();
    this._createGrass();
  }

  Grass.prototype._generateBlades = function() {
    var blade, i, j, px, pz, step, vx, vz, xMax, xMin, zMax, zMin, _i, _j;
    this._blades = new THREE.Geometry();
    step = 120;
    xMin = -this.w >> 1;
    xMax = -xMin;
    zMin = -this.h >> 1;
    zMax = -zMin;
    px = xMin;
    pz = zMin;
    vx = this.w / step;
    vz = this.h / step;
    for (i = _i = 0; 0 <= step ? _i < step : _i > step; i = 0 <= step ? ++_i : --_i) {
      for (j = _j = 0; 0 <= step ? _j < step : _j > step; j = 0 <= step ? ++_j : --_j) {
        blade = new GrassBlade(px, 0, pz);
        THREE.GeometryUtils.merge(this._blades, blade);
        px += vx;
      }
      px = xMin;
      pz += vz;
    }
    return this._blades.computeFaceNormals();
  };

  Grass.prototype._createGrass = function() {
    var materialA, materialB, mesh;
    materialA = new THREE.MeshLambertMaterial({
      color: 0x084820
    });
    materialA.side = THREE.DoubleSide;
    materialB = this._getWindMaterial();
    mesh = THREE.SceneUtils.createMultiMaterialObject(this._blades, [materialB, materialA]);
    return this.add(mesh);
  };

  Grass.prototype._getWindMaterial = function() {
    var material, params, shader;
    shader = new WindShader();
    params = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms
    };
    return material = new THREE.ShaderMaterial(params);
  };

  return Grass;

})(THREE.Object3D);

var GrassBlade,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GrassBlade = (function(_super) {
  __extends(GrassBlade, _super);

  GrassBlade._SHARED_GEOMETRY = null;

  GrassBlade.prototype.geometry = null;

  GrassBlade.prototype.texture = null;

  function GrassBlade(x, y, z) {
    if (!GrassBlade._SHARED_GEOMETRY) {
      GrassBlade.initGeometry(x, y, z);
    }
    this.geometry = GrassBlade._SHARED_GEOMETRY;
    this.texture = new THREE.MeshLambertMaterial({
      color: 0xfff000
    });
    THREE.Mesh.call(this, this.geometry, this.texture);
    this.position.set(x + Math.random() * 10 - 5, y, z + Math.random() * 10 - 5);
  }

  GrassBlade.initGeometry = function(x, y, z) {
    GrassBlade._SHARED_GEOMETRY = new THREE.PlaneGeometry(2, 50, 1, 1);
    return GrassBlade._SHARED_GEOMETRY.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));
  };

  return GrassBlade;

})(THREE.Mesh);

var Land,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Land = (function(_super) {
  __extends(Land, _super);

  Land.prototype._floor = null;

  function Land() {
    THREE.Object3D.call(this);
    this._floor = new Floor(1000, 1000);
    this.add(this._floor);
    this._grass = new Grass(this._floor.w, this._floor.h);
    this.add(this._grass);
    this.position.z = -500;
  }

  return Land;

})(THREE.Object3D);

var World,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

World = (function(_super) {
  __extends(World, _super);

  World.prototype._land = null;

  function World() {
    THREE.Object3D.call(this);
    this._init();
  }

  World.prototype._init = function() {
    this._land = new Land();
    return this.add(this._land);
  };

  return World;

})(THREE.Object3D);

var EngineSingleton, engine;

EngineSingleton = (function() {
  var EngineInstance, instance;

  function EngineSingleton() {}

  EngineInstance = (function() {
    function EngineInstance() {}

    EngineInstance.prototype._container = null;

    EngineInstance.prototype._stats = null;

    EngineInstance.prototype.renderer = null;

    EngineInstance.prototype.camera = null;

    EngineInstance.prototype.controls = null;

    EngineInstance.prototype.scene = null;

    EngineInstance.prototype.init = function(container) {
      this.renderer = new THREE.WebGLRenderer({
        alpha: false
      });
      this.renderer.setClearColor(0x222222, 1);
      this.renderer.setSize(stage.size.w, stage.size.h);
      this._container = container;
      this._container.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(45, stage.size.w / stage.size.h, 1, 10000);
      this.camera.position.set(100, 200, 100);
      this.camera.lookAt(new THREE.Vector3(0, 100, -200));
      this.scene = new THREE.Scene();
      this._initLights();
      return updateManager.register(this);
    };

    EngineInstance.prototype._initLights = function() {
      var ambient, pointLight;
      ambient = new THREE.AmbientLight(0x101010);
      this.scene.add(ambient);
      pointLight = new THREE.PointLight(0xe9ff9b, 2, 1000);
      pointLight.position.set(50, 50, 50);
      return this.scene.add(pointLight);
    };

    EngineInstance.prototype.update = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    return EngineInstance;

  })();

  instance = null;

  EngineSingleton.get = function() {
    return instance != null ? instance : instance = new EngineInstance();
  };

  return EngineSingleton;

})();

engine = EngineSingleton.get();

var StageSingleton, stage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

StageSingleton = (function() {
  var StageInstance, instance;

  function StageSingleton() {}

  StageInstance = (function() {
    StageInstance.prototype.mouse = null;

    StageInstance.prototype.size = null;

    StageInstance.prototype._$window = null;

    function StageInstance() {
      this._onResize = __bind(this._onResize, this);
      this._onMouseMove = __bind(this._onMouseMove, this);
      this.mouse = {
        x: 0,
        y: 0
      };
      this.size = {
        w: 0,
        h: 0
      };
      this._$window = $(window);
      $(document).on("mousemove", this._onMouseMove);
      this._$window.on("resize", this._onResize);
      this._onResize();
    }

    StageInstance.prototype._onMouseMove = function(e) {
      this.mouse.x = e.clientX;
      return this.mouse.y = e.clientY;
    };

    StageInstance.prototype._onResize = function(e) {
      this.size.w = this._$window.width();
      return this.size.h = this._$window.height();
    };

    return StageInstance;

  })();

  instance = null;

  StageSingleton.get = function() {
    return instance != null ? instance : instance = new StageInstance();
  };

  return StageSingleton;

}).call(this);

stage = StageSingleton.get();

var UpdateManagerSingleton, updateManager,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateManagerSingleton = (function() {
  var UpdateManagerInstance, instance;

  function UpdateManagerSingleton() {}

  UpdateManagerInstance = (function() {
    UpdateManagerInstance.prototype._list = null;

    UpdateManagerInstance.prototype._stats = null;

    UpdateManagerInstance.prototype._rafId = -1;

    function UpdateManagerInstance() {
      this.update = __bind(this.update, this);
      this._list = [];
    }

    UpdateManagerInstance.prototype.enableDebugMode = function() {
      this._stats = new Stats();
      this._stats.domElement.style.position = "absolute";
      this._stats.domElement.style.left = "0";
      this._stats.domElement.style.top = "0";
      this._stats.domElement.style.zIndex = 100;
      return document.body.appendChild(this._stats.domElement);
    };

    UpdateManagerInstance.prototype.start = function() {
      return this._rafId = requestAnimationFrame(this.update);
    };

    UpdateManagerInstance.prototype.update = function() {
      var item, _i, _len, _ref;
      if (this._stats) {
        this._stats.begin();
      }
      _ref = this._list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.update();
      }
      if (this._stats) {
        this._stats.end();
      }
      return this._rafId = requestAnimationFrame(this.update);
    };

    UpdateManagerInstance.prototype.stop = function() {
      return cancelAnimationFrame(this._rafId);
    };

    UpdateManagerInstance.prototype.register = function(item) {
      if (this._list.indexOf(item) === -1) {
        return this._list.push(item);
      }
    };

    UpdateManagerInstance.prototype.unregister = function(item) {
      var idx;
      if ((idx = this._list.indexOf(item)) >= 0) {
        return this._list.splice(idx, 1);
      }
    };

    return UpdateManagerInstance;

  })();

  instance = null;

  UpdateManagerSingleton.get = function() {
    return instance != null ? instance : instance = new UpdateManagerInstance();
  };

  return UpdateManagerSingleton;

}).call(this);

updateManager = UpdateManagerSingleton.get();

var Main;

Main = (function() {
  function Main() {
    var world;
    engine.init(document.getElementById("scene"));
    engine.scene.add(new Axis(1000));
    world = new World();
    engine.scene.add(world);
    updateManager.enableDebugMode();
    updateManager.start();
  }

  return Main;

})();

$(document).ready(function() {
  return new Main();
});
