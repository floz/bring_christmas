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

  WindShader.prototype.attributes = {
    aColor: {
      type: "c",
      value: null
    },
    aWindRatio: {
      type: "f",
      value: null
    },
    aWindOrientation: {
      type: "f",
      value: null
    },
    aWindLength: {
      type: "f",
      value: null
    },
    aPosition: {
      type: "v3",
      value: null
    }
  };

  WindShader.prototype.uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib["common"], THREE.UniformsLib["fog"], THREE.UniformsLib["lights"], THREE.UniformsLib["shadowmap"], {
      "ambient": {
        type: "c",
        value: new THREE.Color(0xffffff)
      },
      "emissive": {
        type: "c",
        value: new THREE.Color(0x000000)
      },
      "wrapRGB": {
        type: "v3",
        value: new THREE.Vector3(1, 1, 1)
      },
      "uOffsetX": {
        type: "f",
        value: 0.0
      },
      "uZoneW": {
        type: "f",
        vaue: 0.0
      },
      "uFloorW": {
        type: "f",
        value: 0.0
      },
      "uWindMapForce": {
        type: "t",
        value: null
      },
      "uWindScale": {
        type: "f",
        value: 1.0
      },
      "uWindMin": {
        type: "v2",
        value: null
      },
      "uWindSize": {
        type: "v2",
        value: null
      },
      "uWindDirection": {
        type: "v3",
        value: null
      },
      "uMousePos": {
        type: "v3",
        value: null
      },
      "uWindDisplacementR": {
        type: "t",
        value: null
      },
      "uWindDisplacementG": {
        type: "t",
        value: null
      },
      "uWindDisplacementB": {
        type: "t",
        value: null
      }
    }
  ]);

  WindShader.prototype.vertexShader = ["#define LAMBERT", "attribute vec3 aColor;", "attribute float aWindRatio;", "attribute float aWindOrientation;", "attribute float aWindLength;", "attribute vec3 aPosition;", "uniform float uOffsetX;", "uniform float uZoneW;", "uniform float uFloorW;", "uniform vec3 uMousePos;", "uniform sampler2D uWindMapForce;", "uniform float uWindScale;", "uniform vec2 uWindMin;", "uniform vec2 uWindSize;", "uniform vec3 uWindDirection;", "uniform sampler2D uWindDisplacementR;", "uniform sampler2D uWindDisplacementG;", "uniform sampler2D uWindDisplacementB;", "varying vec3 vLightFront;", "varying float vWindForce;", "varying vec3 vColor;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["map_pars_vertex"], THREE.ShaderChunk["lightmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], THREE.ShaderChunk["lights_lambert_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], "float convertToRange( float value, vec2 rSrc, vec2 rDest ) {", "return ( ( value - rSrc.x ) / ( rSrc.y - rSrc.x ) ) * ( rDest.y - rDest.x ) + rDest.x;", "}", "void main() {", THREE.ShaderChunk["map_vertex"], THREE.ShaderChunk["lightmap_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], "vec4 mvPosition;", "#ifdef USE_SKINNING", "mvPosition = modelViewMatrix * skinned;", "#endif", "#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )", "mvPosition = modelViewMatrix * vec4( morphed, 1.0 );", "#endif", "#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )", "float percentX = position.x / uZoneW;", "float percentOffsetX = uOffsetX / ( uZoneW / 5.0 );", "percentX = percentX + percentOffsetX;", "vec2 posPercent = vec2( percentX * 0.5, position.z / uZoneW * 0.5 );", "if( posPercent.x > 1.0 )", "posPercent.x = posPercent.x - 1.0;", "vWindForce = texture2D( uWindMapForce, posPercent ).x;", "float windFactor = aWindRatio;", "float windMod = ( 1.0 - vWindForce ) * windFactor;", "vec2 src = vec2( 0, 1 );", "vec2 dest = vec2( -1, 1 );", "vec2 percent = vec2( aPosition.x / 1280.0, aPosition.z / 1280.0 );", "float r = texture2D( uWindDisplacementR, percent ).r;", "r = convertToRange( r, src, dest );", "float g = texture2D( uWindDisplacementG, percent ).g;", "g = convertToRange( g, src, dest );", "float b = texture2D( uWindDisplacementB, percent ).b;", "b = convertToRange( b, src, dest );", "vec4 pos = vec4( position, 1.0 );", "pos.x += windMod * uWindDirection.x + r * 30.0 * aWindRatio;", "pos.y += windMod * uWindDirection.y + g * 10.0 * aWindRatio;", "pos.z += windMod * uWindDirection.z + b * 30.0 * aWindRatio;", "mvPosition = modelViewMatrix * pos;", "#endif", "vColor = aColor;", "gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_lambert_vertex"], THREE.ShaderChunk["shadowmap_vertex"], "}"].join("\n");

  WindShader.prototype.fragmentShader = ["uniform float opacity;", "varying vec3 vLightFront;", "varying vec3 vColor;", "varying vec4 vDebugColor;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], "void main() {", "gl_FragColor = vec4( vColor, opacity );", THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], "#ifdef DOUBLE_SIDED", "if ( gl_FrontFacing )", "gl_FragColor.xyz *= vLightFront;", "else", "gl_FragColor.xyz *= vLightBack;", "#else", "gl_FragColor.xyz *= vLightFront;", "#endif", THREE.ShaderChunk["lightmap_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["shadowmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], "}"].join("\n");

  return WindShader;

})();

var DisplacementShader;

DisplacementShader = (function() {
  function DisplacementShader() {}

  DisplacementShader.prototype.uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib["common"], THREE.UniformsLib["fog"], THREE.UniformsLib["lights"], THREE.UniformsLib["shadowmap"], {
      "ambient": {
        type: "c",
        value: new THREE.Color(0xffffff)
      },
      "emissive": {
        type: "c",
        value: new THREE.Color(0x000000)
      },
      "wrapRGB": {
        type: "v3",
        value: new THREE.Vector3(1, 1, 1)
      },
      "uOffsetX": {
        type: "f",
        value: 0.0
      },
      "uWindMapForce": {
        type: "t",
        value: null
      },
      "uWindScale": {
        type: "f",
        value: 1.0
      },
      "uWindMin": {
        type: "v2",
        value: null
      },
      "uWindSize": {
        type: "v2",
        value: null
      },
      "uWindDirection": {
        type: "v3",
        value: null
      }
    }
  ]);

  DisplacementShader.prototype.vertexShader = ["#define LAMBERT", "uniform float uOffsetX;", "uniform sampler2D uWindMapForce;", "uniform float uWindScale;", "uniform vec2 uWindMin;", "uniform vec2 uWindSize;", "uniform vec3 uWindDirection;", "varying vec3 vLightFront;", "varying float vWindForce;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["map_pars_vertex"], THREE.ShaderChunk["lightmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], THREE.ShaderChunk["lights_lambert_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], "void main() {", THREE.ShaderChunk["map_vertex"], THREE.ShaderChunk["lightmap_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], "vec4 mvPosition;", "#ifdef USE_SKINNING", "mvPosition = modelViewMatrix * skinned;", "#endif", "#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )", "mvPosition = modelViewMatrix * vec4( morphed, 1.0 );", "#endif", "#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )", "vec4 wpos = modelMatrix * vec4( position, 1.0 );", "wpos.z = -wpos.z;", "vec2 totPos = wpos.xz - uWindMin;", "vec2 windUV = totPos / uWindSize;", "windUV.x = windUV.x * 0.5 + uOffsetX / 3.0 * 0.0025;", "vWindForce = texture2D( uWindMapForce, windUV ).x;", "float windFactor = 0.0;", "if ( position.y != 0.0 )", "windFactor = 1.0;", "float windMod = ( 1.0 - vWindForce ) * windFactor;", "vec4 pos = vec4( position, 1.0 );", "pos.x += windMod * uWindDirection.x;", "pos.y += windMod * uWindDirection.y;", "pos.z += windMod * uWindDirection.z;", "mvPosition = modelViewMatrix * pos;", "#endif", "gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_lambert_vertex"], THREE.ShaderChunk["shadowmap_vertex"], "}"].join("\n");

  DisplacementShader.prototype.fragmentShader = ["uniform float opacity;", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], "void main() {", "gl_FragColor = vec4( vec3 ( 1.0 ), opacity );", THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], "#ifdef DOUBLE_SIDED", "if ( gl_FrontFacing )", "gl_FragColor.xyz *= vLightFront;", "else", "gl_FragColor.xyz *= vLightBack;", "#else", "gl_FragColor.xyz *= vLightFront;", "#endif", THREE.ShaderChunk["lightmap_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["shadowmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], "}"].join("\n");

  return DisplacementShader;

})();

var NoiseShader;

NoiseShader = (function() {
  function NoiseShader() {}

  NoiseShader.prototype.uniforms = {
    "uText": {
      type: "t",
      value: null
    },
    "uOffsetX": {
      type: "f",
      value: 0.0
    }
  };

  NoiseShader.prototype.vertexShader = ["uniform float uOffsetX;", "varying vec2 vUv;", "varying vec3 vPos;", "void main() {", "vUv = vec2( uv.x * 0.5 + uOffsetX * 0.0025, uv.y );", "vPos = position;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);", "}"].join("\n");

  NoiseShader.prototype.fragmentShader = ["uniform sampler2D uText;", "varying vec2 vUv;", "varying vec3 vPos;", "void main() {", "vec4 texture = texture2D( uText, vUv );", "gl_FragColor = vec4( texture.rgb, 1.0 );", "}"].join("\n");

  return NoiseShader;

})();

var PlaneNoise,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlaneNoise = (function(_super) {
  __extends(PlaneNoise, _super);

  PlaneNoise.prototype._texture = null;

  PlaneNoise.prototype._geometry = null;

  PlaneNoise.prototype._material = null;

  PlaneNoise.prototype._uniformsNoise = null;

  PlaneNoise.prototype._sign = 1;

  PlaneNoise.prototype._add = 0;

  PlaneNoise.prototype.noiseMap = null;

  PlaneNoise.prototype.noiseScene = null;

  PlaneNoise.prototype.noiseCamera = null;

  PlaneNoise.prototype.noiseMesh = null;

  function PlaneNoise() {
    this._texture = document.getElementById("texture-noise");
    this._geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    this._material = this._getNoiseMaterial();
    THREE.Mesh.call(this, this._geometry, this._material);
  }

  PlaneNoise.prototype._getNoiseMaterial = function() {
    var material, params, shader;
    shader = new NoiseShader();
    this._uniformsNoise = shader.uniforms;
    params = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: this._uniformsNoise
    };
    this._uniformsNoise.uText.value = THREE.ImageUtils.loadTexture(this._texture.src);
    return material = new THREE.ShaderMaterial(params);
  };

  PlaneNoise.prototype.update = function() {
    if (this._add > 300) {
      this._sign = -1;
    } else if (this._add < 0) {
      this._sign = 1;
    }
    this._add += 1 * this._sign;
    return this._uniformsNoise.uOffsetX.value = this._add;
  };

  return PlaneNoise;

})(THREE.Mesh);

var PlaneNoiseAffected,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlaneNoiseAffected = (function(_super) {
  __extends(PlaneNoiseAffected, _super);

  PlaneNoiseAffected.prototype._texture = null;

  PlaneNoiseAffected.prototype._material = null;

  PlaneNoiseAffected.prototype._geometry = null;

  PlaneNoiseAffected.prototype._uniforms = null;

  PlaneNoiseAffected.prototype._sign = 1;

  PlaneNoiseAffected.prototype._add = 0;

  function PlaneNoiseAffected() {
    this._texture = document.getElementById("texture-noise");
    this._geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    this._geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));
    this._material = this._getDisplacementMaterial();
    THREE.Mesh.call(this, this._geometry, this._material);
  }

  PlaneNoiseAffected.prototype._getDisplacementMaterial = function() {
    var material, params, shader;
    shader = new DisplacementShader();
    this._uniforms = shader.uniforms;
    params = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: this._uniforms,
      lights: true
    };
    this._uniforms.diffuse.value = new THREE.Color(0x084820);
    this._uniforms.ambient.value = new THREE.Color(0xffea00);
    this._uniforms.uOffsetX.value = 0.0;
    this._uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture(this._texture.src);
    this._uniforms.uWindScale.value = 1;
    this._uniforms.uWindMin.value = new THREE.Vector2(-30, -30);
    this._uniforms.uWindSize.value = new THREE.Vector2(60, 60);
    this._uniforms.uWindDirection.value = new THREE.Vector3(10, 0, 10);
    return material = new THREE.ShaderMaterial(params);
  };

  PlaneNoiseAffected.prototype.update = function() {
    if (this._add > 300) {
      this._sign = -1;
    } else if (this._add < 0) {
      this._sign = 1;
    }
    this._add += 1 * this._sign;
    return this._uniforms.uOffsetX.value = this._add;
  };

  return PlaneNoiseAffected;

})(THREE.Mesh);

var WorldNoise,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WorldNoise = (function(_super) {
  __extends(WorldNoise, _super);

  WorldNoise.prototype._planeNoise = null;

  function WorldNoise() {
    THREE.Object3D.call(this);
    this._planeNoise = new PlaneNoise();
    this._planeNoise.position.x = -100;
    this.add(this._planeNoise);
    this._planeNoiseAffected = new PlaneNoiseAffected();
    this._planeNoiseAffected.position.x = 100;
    this.add(this._planeNoiseAffected);
    updateManager.register(this);
  }

  WorldNoise.prototype.update = function() {
    this._planeNoise.update();
    return this._planeNoiseAffected.update();
  };

  return WorldNoise;

})(THREE.Object3D);

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
    this._geometry = new THREE.PlaneGeometry(w, h, 127, 127);
    this._modifyFloor();
    this._texture = new THREE.MeshBasicMaterial({
      color: 0x234706,
      lights: false
    });
    THREE.Mesh.call(this, this._geometry, this._texture);
    this.rotation.x = -Math.PI * .5;
  }

  Floor.prototype._modifyFloor = function() {
    var data, i, vertice, vertices, _i, _len;
    data = HeightData.get();
    vertices = this._geometry.vertices;
    for (i = _i = 0, _len = vertices.length; _i < _len; i = ++_i) {
      vertice = vertices[i];
      vertice.z = data[i];
    }
    return this._geometry.computeFaceNormals();
  };

  return Floor;

})(THREE.Mesh);

var Grass,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Grass = (function(_super) {
  __extends(Grass, _super);

  Grass.prototype._floor = null;

  Grass.prototype.w = 0;

  Grass.prototype.h = 0;

  Grass.prototype._texture = null;

  Grass.prototype._projector = null;

  Grass.prototype._vProjector = null;

  Grass.prototype._displacementData = null;

  Grass.prototype._displacementChannelR = null;

  Grass.prototype._displacementChannelG = null;

  Grass.prototype._displacementChannelB = null;

  Grass.prototype._cntBlades = null;

  Grass.prototype._blades = null;

  Grass.prototype._vectors = null;

  Grass.prototype._attributes = null;

  Grass.prototype._uniforms = null;

  Grass.prototype._colors = null;

  Grass.prototype._positions = null;

  Grass.prototype._windRatio = null;

  Grass.prototype._windOrientation = null;

  Grass.prototype._windLength = null;

  Grass.prototype._windDisplacementRTexture = null;

  Grass.prototype._windDisplacementGTexture = null;

  Grass.prototype._windDisplacementBTexture = null;

  Grass.prototype._lastProjectedMouse = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  };

  Grass.prototype._sign = 1;

  Grass.prototype._add = 0;

  function Grass(_floor, w, h) {
    this._floor = _floor;
    this.w = w;
    this.h = h;
    this._texture = document.getElementById("texture-noise");
    this._projector = new THREE.Projector();
    this._vProjector = new THREE.Vector3();
    this._displacementChannelR = new WindDisplacementChannel("map-displacement-r", "texture-displacement-r", this._displacementChannelG = new WindDisplacementChannel("map-displacement-g", "texture-displacement-g", true));
    this._displacementChannelB = new WindDisplacementChannel("map-displacement-b", "texture-displacement-b", true);
    this._displacementData = new WindDisplacementData(-w >> 1, 0, w >> 1, -h);
    this._displacementData.addChannel(this._displacementChannelR);
    this._displacementData.addChannel(this._displacementChannelG);
    this._displacementData.addChannel(this._displacementChannelB);
    THREE.Object3D.call(this);
    this._generateBlades();
    this._createGrass();
  }

  Grass.prototype._generateBlades = function() {
    var availableColors, baseColor, blade, geo, heightValue, i, idx, j, lengthAvailableColors, px, pz, step, v, vx, vz, xMax, xMin, zMax, zMin, _i, _j, _k, _len, _ref;
    this._colors = [];
    this._positions = [];
    this._windRatio = [];
    this._blades = new THREE.Geometry();
    this._vectors = [];
    baseColor = new THREE.Color(0x3d5d0a);
    availableColors = [new THREE.Color(0x53dc23), new THREE.Color(0xb3dc23), new THREE.Color(0x23dc46), new THREE.Color(0x74ff2f)];
    lengthAvailableColors = availableColors.length;
    step = 160;
    idx = 0;
    xMin = 0;
    xMax = this.w;
    zMin = 0;
    zMax = this.h;
    heightValue = 0;
    px = xMin;
    pz = zMin;
    vx = this.w / step;
    vz = this.h / step;
    for (i = _i = 0; 0 <= step ? _i < step : _i > step; i = 0 <= step ? ++_i : --_i) {
      for (j = _j = 0; 0 <= step ? _j < step : _j > step; j = 0 <= step ? ++_j : --_j) {
        blade = new GrassBlade(px, 0, pz);
        this._vectors.push(new WindVectorData(px, pz));
        heightValue = HeightData.getPixelValue(px / 10 >> 0, pz / 10 >> 0);
        geo = blade.geometry;
        _ref = geo.vertices;
        for (_k = 0, _len = _ref.length; _k < _len; _k++) {
          v = _ref[_k];
          if (v.y < 10) {
            this._windRatio[idx] = 0.0;
            this._colors[idx] = baseColor;
          } else {
            this._colors[idx] = availableColors[Math.random() * lengthAvailableColors >> 0];
            this._windRatio[idx] = 1.0;
          }
          v.y += heightValue;
          this._positions[idx] = new THREE.Vector3(px, 0, pz + heightValue);
          idx++;
        }
        THREE.GeometryUtils.merge(this._blades, blade);
        px += vx;
      }
      px = xMin;
      pz += vz;
    }
    this._blades.computeFaceNormals();
    return console.log(this._blades.vertices);
  };

  Grass.prototype._createGrass = function() {
    var mesh;
    mesh = new THREE.Mesh(this._blades, this._getWindMaterial());
    this.add(mesh);
    mesh.position.x = -this.w >> 1;
    return mesh.position.z = -this.h >> 1;
  };

  Grass.prototype._getWindMaterial = function() {
    var material, params, shader;
    shader = new WindShader();
    this._attributes = shader.attributes;
    this._uniforms = shader.uniforms;
    params = {
      attributes: this._attributes,
      uniforms: this._uniforms,
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      lights: true
    };
    this._attributes.aColor.value = this._colors;
    this._attributes.aWindRatio.value = this._windRatio;
    this._attributes.aWindOrientation.value = this._windOrientation = [];
    this._attributes.aWindLength.value = this._windLength = [];
    this._attributes.aPosition.value = this._positions;
    this._uniforms.diffuse.value = new THREE.Color(0x084820);
    this._uniforms.ambient.value = new THREE.Color(0xffea00);
    this._windDisplacementRTexture = new THREE.Texture(this._displacementChannelR.canvas);
    this._windDisplacementGTexture = new THREE.Texture(this._displacementChannelG.canvas);
    this._windDisplacementBTexture = new THREE.Texture(this._displacementChannelB.canvas);
    this._uniforms.uWindDisplacementR.value = this._windDisplacementRTexture;
    this._uniforms.uWindDisplacementG.value = this._windDisplacementGTexture;
    this._uniforms.uWindDisplacementB.value = this._windDisplacementBTexture;
    this._uniforms.uOffsetX.value = 0.0;
    this._uniforms.uZoneW.value = this.w >> 1;
    this._uniforms.uFloorW.value = this.w;
    this._uniforms.uMousePos.value = new THREE.Vector2(stage.mouse.x, stage.mouse.y);
    this._uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture(this._texture.src);
    this._uniforms.uWindScale.value = 1;
    this._uniforms.uWindMin.value = new THREE.Vector2(0, 0);
    this._uniforms.uWindSize.value = new THREE.Vector2(60, 60);
    this._uniforms.uWindDirection.value = new THREE.Vector3(20, 5, 20);
    material = new THREE.ShaderMaterial(params);
    material.side = THREE.DoubleSide;
    return material;
  };

  Grass.prototype.convertToRange = function(x, a1, a2, b1, b2) {
    return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1;
  };

  Grass.prototype.update = function() {
    var camPos, m, pos;
    if (this._add > 256) {
      this._add = 0;
    }
    this._add += 1;
    this._uniforms.uOffsetX.value = this._add;
    this._vProjector.x = (stage.mouse.x / stage.size.w) * 2 - 1;
    this._vProjector.y = -(stage.mouse.y / stage.size.h) * 2 + 1;
    this._vProjector.z = 1;
    this._projector.unprojectVector(this._vProjector, engine.camera);
    camPos = engine.camera.position;
    m = this._vProjector.y / (this._vProjector.y - camPos.y);
    pos = new THREE.Vector3();
    pos.x = this._vProjector.x + (camPos.x - this._vProjector.x) * m;
    pos.z = this._vProjector.z + (camPos.z - this._vProjector.z) * m;
    this._uniforms.uMousePos.value.x = pos.x;
    this._uniforms.uMousePos.value.y = pos.y;
    this._uniforms.uMousePos.value.z = pos.z;
    this._displacementData.update(pos.x, pos.z);
    this._windDisplacementRTexture.needsUpdate = true;
    this._windDisplacementGTexture.needsUpdate = true;
    return this._windDisplacementBTexture.needsUpdate = true;
  };

  return Grass;

})(THREE.Object3D);

var GrassBlade,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GrassBlade = (function(_super) {
  __extends(GrassBlade, _super);

  GrassBlade.prototype.geometry = null;

  GrassBlade.prototype.texture = null;

  function GrassBlade(x, y, z) {
    var h, pz, w;
    pz = z - 500;
    w = 1 + Math.random() * 1;
    h = 40 + 30 * (1 - (1280 - pz) * .001);
    this.geometry = new THREE.PlaneGeometry(w, h, 1, 1);
    this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, h >> 1, 0));
    this.texture = new THREE.MeshLambertMaterial({
      color: 0xfff000
    });
    THREE.Mesh.call(this, this.geometry, this.texture);
    this.rotation.x = Math.random() * .2 - .1;
    this.rotation.y = Math.random() * .2 - .1;
    this.rotation.z = Math.random() * .2 - .1;
    this.position.set(x + Math.random() * 10 - 5, y, z + Math.random() * 10 - 5);
  }

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
    this._floor = new Floor(1280, 1280);
    this.add(this._floor);
    this._grass = new Grass(this._floor, this._floor.w, this._floor.h);
    this.add(this._grass);
    this.position.z = -500;
    updateManager.register(this);
  }

  Land.prototype.update = function() {
    return this._grass.update();
  };

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

var HeightData;

HeightData = (function() {
  function HeightData() {}

  HeightData._rawData = null;

  HeightData._data = null;

  HeightData.get = function() {
    var canvas, ctx, data, i, j, _i, _ref;
    if (HeightData._data) {
      return HeightData._data;
    }
    canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    ctx = canvas.getContext("2d");
    ctx.drawImage(document.getElementById("texture-height"), 0, 0);
    HeightData._rawData = data = ctx.getImageData(0, 0, 128, 128).data;
    HeightData._data = [];
    j = 0;
    for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
      HeightData._data[j++] = data[i];
    }
    return HeightData._data;
  };

  HeightData.getPixelValue = function(x, y) {
    return HeightData._data[y * 128 + x];
  };

  return HeightData;

})();

var WindDisplacementChannel;

WindDisplacementChannel = (function() {
  WindDisplacementChannel.prototype.canvas = null;

  WindDisplacementChannel.prototype._canRotate = null;

  WindDisplacementChannel.prototype._size = 0;

  WindDisplacementChannel.prototype._ctx = null;

  WindDisplacementChannel.prototype._textDisplacement = null;

  WindDisplacementChannel.prototype._textDisplacementW = 0;

  WindDisplacementChannel.prototype._textDisplacementH = 0;

  function WindDisplacementChannel(idCanvas, idText, canRotate) {
    this.canvas = document.getElementById(idCanvas);
    this._canRotate = canRotate || false;
    this._size = this.canvas.width;
    this._ctx = this.canvas.getContext("2d");
    this._ctx.fillStyle = "rgba( 128, 128, 128, 1 )";
    this._textDisplacement = document.getElementById(idText);
    this._textDisplacementW = this._textDisplacement.width;
    this._textDisplacementH = this._textDisplacement.height;
  }

  WindDisplacementChannel.prototype.fill = function(alpha) {
    this._ctx.fillStyle = "rgba( 128, 128, 128, " + alpha + ")";
    return this._ctx.fillRect(0, 0, this._size, this._size);
  };

  WindDisplacementChannel.prototype.draw = function(x, y, orientation) {
    this._ctx.save();
    this._ctx.translate(x, y);
    if (this._canRotate) {
      this._ctx.rotate(orientation);
    }
    this._ctx.drawImage(this._textDisplacement, -this._textDisplacementW >> 1, -this._textDisplacementH >> 1);
    return this._ctx.restore();
  };

  return WindDisplacementChannel;

})();

var WindDisplacementData;

WindDisplacementData = (function() {
  WindDisplacementData.prototype._xMin = 1.0;

  WindDisplacementData.prototype._yMin = 1.0;

  WindDisplacementData.prototype._xMax = 1.0;

  WindDisplacementData.prototype._yMax = 1.0;

  WindDisplacementData.prototype._canRotate = false;

  WindDisplacementData.prototype._channels = null;

  WindDisplacementData.prototype._size = 256;

  WindDisplacementData.prototype._ctx = null;

  WindDisplacementData.prototype._pOrientation = {
    x: 0.0,
    y: 0.0
  };

  WindDisplacementData.prototype._orientation = 0.0;

  WindDisplacementData.prototype._lastX = 0.0;

  WindDisplacementData.prototype._lastY = 0.0;

  WindDisplacementData.prototype._alpha = 1.0;

  WindDisplacementData.prototype._speed = 0.0;

  function WindDisplacementData(_xMin, _yMin, _xMax, _yMax) {
    this._xMin = _xMin;
    this._yMin = _yMin;
    this._xMax = _xMax;
    this._yMax = _yMax;
    this._channels = [];
  }

  WindDisplacementData.prototype.addChannel = function(channel) {
    return this._channels.push(channel);
  };

  WindDisplacementData.prototype.update = function(x, y) {
    var a, channel, dist, dx, dy, newOrientation, _i, _j, _len, _len1, _ref, _ref1;
    x = this._scaleX(x);
    y = this._scaleY(y);
    if (this._lastX !== x || this._lastY !== y) {
      _ref = this._channels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        channel = _ref[_i];
        channel.fill(this._alpha);
      }
      dx = x - this._pOrientation.x;
      dy = y - this._pOrientation.y;
      this._pOrientation.x += dx * .1;
      this._pOrientation.y += dy * .1;
      dx = x - this._pOrientation.x;
      dy = y - this._pOrientation.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 8) {
        a = Math.atan2(dy, dx) + Math.PI;
        this._pOrientation.x = x + Math.cos(a) * 8;
        this._pOrientation.y = y + Math.sin(a) * 8;
        dx = x - this._pOrientation.x;
        dy = y - this._pOrientation.y;
      }
      newOrientation = Math.atan2(dy, dx);
      while (newOrientation - this._orientation > Math.PI) {
        this._orientation += Math.PI * 2;
      }
      while (newOrientation - this._orientation < -Math.PI) {
        this._orientation -= Math.PI * 2;
      }
      this._orientation += (newOrientation - this._orientation) * .1;
      this._drawCanvas();
      this._alpha += (.05 - this._alpha) * .075;
      dx = x - this._lastX;
      dy = y - this._lastY;
      dist = Math.sqrt(dx * dx + dy * dy);
      this._speed += dist * .05;
      this._speed += -this._speed * .05;
    } else {
      this._alpha += (1 - this._alpha) * .05;
      a = this._orientation;
      this._pOrientation.x += Math.cos(a) * this._speed;
      this._pOrientation.y += Math.sin(a) * this._speed;
      this._drawCanvas();
      this._speed += -this._speed * .1;
      _ref1 = this._channels;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        channel = _ref1[_j];
        channel.fill(this._alpha);
      }
    }
    this._lastX = x;
    return this._lastY = y;
  };

  WindDisplacementData.prototype._drawCanvas = function() {
    var channel, _i, _len, _ref, _results;
    _ref = this._channels;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      channel = _ref[_i];
      _results.push(channel.draw(this._pOrientation.x, this._pOrientation.y, this._orientation));
    }
    return _results;
  };

  WindDisplacementData.prototype._scaleX = function(value) {
    var percent, xMax, xMin;
    xMin = 0 - this._xMin;
    xMax = xMin + this._xMax;
    value += xMin;
    if (value < 0) {
      value = 0;
    }
    if (value > xMax) {
      value = xMax;
    }
    percent = value / xMax;
    return percent * this._size;
  };

  WindDisplacementData.prototype._scaleY = function(value) {
    var percent, yMax, yMin;
    yMin = 0 - this._yMin;
    yMax = yMin + this._yMax;
    if (value > 0) {
      value = 0;
    }
    if (value < yMax) {
      value = yMax;
    }
    percent = value / yMax;
    return percent * this._size;
  };

  return WindDisplacementData;

})();

var WindVectorData;

WindVectorData = (function() {
  WindVectorData.prototype.x = 0;

  WindVectorData.prototype.y = 0;

  WindVectorData.prototype.orientation = 0.0;

  WindVectorData.prototype.length = 0.0;

  WindVectorData.prototype.direction = {
    x: 0.0,
    y: 0.0
  };

  WindVectorData.prototype._needUpdate = true;

  function WindVectorData(x, y) {
    this.x = x;
    this.y = y;
  }

  WindVectorData.prototype.add = function(orientation, length, ratio) {
    this.orientation += (orientation - this.orientation) * ratio;
    this.length += (length - this.length) * ratio;
    return this._needUpdate = true;
  };

  WindVectorData.prototype.update = function() {
    return this.length += (0.0 - length) * .07;
  };

  WindVectorData.prototype.getDirection = function() {
    if (!this._needUpdate) {
      return this.direction;
    }
    this.direction.x = this.x + Math.cos(this.orientation) * this.length;
    this.direction.y = this.y + Math.sin(this.orientation) * this.length;
    return this.direction;
  };

  return WindVectorData;

})();

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
      this.renderer.setClearColor(0x416ca3, 1);
      this.renderer.setSize(stage.size.w, stage.size.h);
      this._container = container;
      this._container.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(45, stage.size.w / stage.size.h, 1, 10000);
      this.camera.position.set(0, 300, 250);
      this.camera.lookAt(new THREE.Vector3(0, 0, -1280 / 2));
      this.scene = new THREE.Scene();
      this._initLights();
      return updateManager.register(this);
    };

    EngineInstance.prototype._initLights = function() {
      var ambient, pointLight;
      ambient = new THREE.AmbientLight(0x8b937f);
      this.scene.add(ambient);
      pointLight = new THREE.PointLight(0xe9ff9b, 2, 1500);
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
    StageInstance.prototype.lastMouse = null;

    StageInstance.prototype.mouse = null;

    StageInstance.prototype.size = null;

    StageInstance.prototype._$window = null;

    function StageInstance() {
      this._onResize = __bind(this._onResize, this);
      this._onMouseMove = __bind(this._onMouseMove, this);
      this.lastMouse = {
        x: 0.0,
        y: 0.0
      };
      this.mouse = {
        x: 0.0,
        y: 0.0
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
      this.lastMouse.x = this.mouse.x;
      this.lastMouse.y = this.mouse.y;
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

new Main();
