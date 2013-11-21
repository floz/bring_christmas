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
      }
    }
  ]);

  WindShader.prototype.vertexShader = ["#define LAMBERT", "attribute vec3 aColor;", "attribute float aWindRatio;", "uniform float uOffsetX;", "uniform float uZoneW;", "uniform float uFloorW;", "uniform sampler2D uWindMapForce;", "uniform float uWindScale;", "uniform vec2 uWindMin;", "uniform vec2 uWindSize;", "uniform vec3 uWindDirection;", "varying vec3 vLightFront;", "varying float vWindForce;", "varying vec3 vColor;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["map_pars_vertex"], THREE.ShaderChunk["lightmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], THREE.ShaderChunk["lights_lambert_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], "void main() {", THREE.ShaderChunk["map_vertex"], THREE.ShaderChunk["lightmap_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], "vec4 mvPosition;", "#ifdef USE_SKINNING", "mvPosition = modelViewMatrix * skinned;", "#endif", "#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )", "mvPosition = modelViewMatrix * vec4( morphed, 1.0 );", "#endif", "#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )", "float percentX = position.x / uZoneW;", "float percentOffsetX = uOffsetX / ( uZoneW / 5.0 );", "percentX = percentX + percentOffsetX;", "vec2 posPercent = vec2( percentX * 0.5, position.z / uZoneW * 0.5 );", "if( posPercent.x > 1.0 )", "posPercent.x = posPercent.x - 1.0;", "vWindForce = texture2D( uWindMapForce, posPercent ).x;", "float windFactor = aWindRatio;", "float windMod = ( 1.0 - vWindForce ) * windFactor;", "vec4 pos = vec4( position, 1.0 );", "pos.x += windMod * uWindDirection.x;", "pos.y += windMod * uWindDirection.y;", "pos.z += windMod * uWindDirection.z;", "mvPosition = modelViewMatrix * pos;", "#endif", "vColor = aColor;", "gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_lambert_vertex"], THREE.ShaderChunk["shadowmap_vertex"], "}"].join("\n");

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

  Grass.prototype.w = 0;

  Grass.prototype.h = 0;

  Grass.prototype._texture = null;

  Grass.prototype._cntBlades = null;

  Grass.prototype._blades = null;

  Grass.prototype._attributes = null;

  Grass.prototype._uniforms = null;

  Grass.prototype._colors = null;

  Grass.prototype._windRatio = null;

  Grass.prototype._sign = 1;

  Grass.prototype._add = 0;

  function Grass(w, h) {
    this.w = w;
    this.h = h;
    this._texture = document.getElementById("texture-noise");
    THREE.Object3D.call(this);
    this._generateBlades();
    this._createGrass();
  }

  Grass.prototype._generateBlades = function() {
    var availableColors, baseColor, blade, geo, i, idx, j, lengthAvailableColors, px, pz, step, v, vx, vz, xMax, xMin, zMax, zMin, _i, _j, _k, _len, _ref;
    this._colors = [];
    this._windRatio = [];
    this._blades = new THREE.Geometry();
    baseColor = new THREE.Color(0x3d5d0a);
    availableColors = [new THREE.Color(0x53dc23), new THREE.Color(0xb3dc23), new THREE.Color(0x23dc46), new THREE.Color(0x74ff2f)];
    lengthAvailableColors = availableColors.length;
    step = 160;
    idx = 0;
    xMin = 0;
    xMax = this.w;
    zMin = 0;
    zMax = this.h;
    px = xMin;
    pz = zMin;
    vx = this.w / step;
    vz = this.h / step;
    for (i = _i = 0; 0 <= step ? _i < step : _i > step; i = 0 <= step ? ++_i : --_i) {
      for (j = _j = 0; 0 <= step ? _j < step : _j > step; j = 0 <= step ? ++_j : --_j) {
        blade = new GrassBlade(px, 0, pz);
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
          v.y += HeightData.getPixelValue(px / 10 >> 0, pz / 10 >> 0);
          idx++;
        }
        THREE.GeometryUtils.merge(this._blades, blade);
        px += vx;
      }
      px = xMin;
      pz += vz;
    }
    return this._blades.computeFaceNormals();
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
    this._uniforms.diffuse.value = new THREE.Color(0x084820);
    this._uniforms.ambient.value = new THREE.Color(0xffea00);
    this._uniforms.uOffsetX.value = 0.0;
    this._uniforms.uZoneW.value = this.w >> 1;
    this._uniforms.uFloorW.value = this.w;
    this._uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture(this._texture.src);
    this._uniforms.uWindScale.value = 1;
    this._uniforms.uWindMin.value = new THREE.Vector2(0, 0);
    this._uniforms.uWindSize.value = new THREE.Vector2(60, 60);
    this._uniforms.uWindDirection.value = new THREE.Vector3(20, 5, 20);
    return material = new THREE.ShaderMaterial(params);
  };

  Grass.prototype.update = function() {
    if (this._add > 256) {
      this._add = 0;
    }
    this._add += 1;
    return this._uniforms.uOffsetX.value = this._add;
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
    this._grass = new Grass(this._floor.w, this._floor.h);
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
      this.camera.position.set(0, 250, 150);
      this.camera.lookAt(new THREE.Vector3(0, 200, -1280 / 2));
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

new Main();
