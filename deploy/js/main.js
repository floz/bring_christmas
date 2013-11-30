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
    aColorWinter: {
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
      "uZoneH": {
        type: "f",
        vaue: 0.0
      },
      "uFloorW": {
        type: "f",
        value: 0.0
      },
      "uFloorColor": {
        type: "c",
        value: null
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
      },
      "uColorChannel": {
        type: "t",
        value: null
      },
      "uGrassBladeHeight": {
        type: "f",
        value: null
      }
    }
  ]);

  WindShader.prototype.vertexShader = ["#define LAMBERT", "attribute vec3 aColor;", "attribute vec3 aColorWinter;", "attribute float aWindRatio;", "attribute float aWindOrientation;", "attribute float aWindLength;", "attribute vec3 aPosition;", "uniform float uOffsetX;", "uniform float uZoneW;", "uniform float uZoneH;", "uniform float uFloorW;", "uniform vec3 uMousePos;", "uniform sampler2D uWindMapForce;", "uniform float uWindScale;", "uniform vec2 uWindMin;", "uniform vec2 uWindSize;", "uniform vec3 uWindDirection;", "uniform sampler2D uWindDisplacementR;", "uniform sampler2D uWindDisplacementG;", "uniform sampler2D uWindDisplacementB;", "uniform float uGrassBladeHeight;", "varying vec3 vLightFront;", "varying float vWindForce;", "varying vec3 vColor;", "varying vec3 vColorWinter;", "varying vec2 vPercent;", "varying float vColorRatio;", "varying float vFloorColorPercent;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["map_pars_vertex"], THREE.ShaderChunk["lightmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], THREE.ShaderChunk["lights_lambert_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], "float convertToRange( float value, vec2 rSrc, vec2 rDest ) {", "return ( ( value - rSrc.x ) / ( rSrc.y - rSrc.x ) ) * ( rDest.y - rDest.x ) + rDest.x;", "}", "void main() {", THREE.ShaderChunk["map_vertex"], THREE.ShaderChunk["lightmap_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], "vec4 mvPosition;", "#ifdef USE_SKINNING", "mvPosition = modelViewMatrix * skinned;", "#endif", "#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )", "mvPosition = modelViewMatrix * vec4( morphed, 1.0 );", "#endif", "#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )", "float baseY = position.y;", "float percentX = position.x / uZoneW;", "float percentOffsetX = uOffsetX / ( uZoneW / 5.0 );", "percentX = percentX + percentOffsetX;", "vec2 posPercent = vec2( percentX * 0.5, position.z / uZoneW * 0.5 );", "if( posPercent.x > 1.0 )", "posPercent.x = posPercent.x - 1.0;", "vWindForce = texture2D( uWindMapForce, posPercent ).x;", "float windMod = ( 1.0 - vWindForce ) * aWindRatio;", "vec2 src = vec2( 0, 1 );", "vec2 dest = vec2( -1, 1 );", "vec2 percent = vec2( aPosition.x / uZoneW * 0.5, aPosition.z / uZoneH );", "float r = texture2D( uWindDisplacementR, percent ).r;", "if ( r >= 0.405 && r <= 0.505 ) r = 0.5;", "r = convertToRange( r, src, dest );", "float g = texture2D( uWindDisplacementG, percent ).g;", "if ( g >= 0.405 && g <= 0.505 ) g = 0.5;", "g = convertToRange( g, src, dest );", "float b = texture2D( uWindDisplacementB, percent ).b;", "if ( b >= 0.405 && b <= 0.505 ) b = 0.5;", "b = convertToRange( b, src, dest );", "vec4 pos = vec4( position, 1.0 );", "pos.x += windMod * uWindDirection.x + r * 30.0 * aWindRatio;", "pos.y += windMod * uWindDirection.y + g * 10.0 * aWindRatio;", "pos.z += windMod * uWindDirection.z + b * 30.0 * aWindRatio;", "if ( aWindRatio == 0.0 ) {", "vFloorColorPercent = 1.0;", "} else {", "vFloorColorPercent = ( baseY - pos.y ) / ( uGrassBladeHeight / 6.0 );", "if ( vFloorColorPercent < 0.0 ) vFloorColorPercent = 0.0;", "if ( vFloorColorPercent > 1.0 ) vFloorColorPercent = 1.0;", "}", "vPercent = percent;", "vColorRatio = aWindRatio;", "mvPosition = modelViewMatrix * pos;", "#endif", "vColor = aColor;", "vColorWinter = aColorWinter;", "gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_lambert_vertex"], THREE.ShaderChunk["shadowmap_vertex"], "}"].join("\n");

  WindShader.prototype.fragmentShader = ["uniform float opacity;", "uniform sampler2D uColorChannel;", "uniform vec3 uFloorColor;", "varying float vColorRatio;", "varying vec3 vLightFront;", "varying vec3 vColor;", "varying vec3 vColorWinter;", "varying vec4 vDebugColor;", "varying vec2 vPercent;", "varying float vFloorColorPercent;", "#ifdef DOUBLE_SIDED", "varying vec3 vLightBack;", "#endif", THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], "void main() {", "vec4 winterColor = texture2D( uColorChannel, vPercent ).rgba;", "vec3 newColor = vColor;", "newColor.r = newColor.r + ( vColorWinter.r - newColor.r ) * winterColor.a * vColorRatio;", "newColor.g = newColor.g + ( vColorWinter.g - newColor.g ) * winterColor.a * vColorRatio;", "newColor.b = newColor.b + ( vColorWinter.b - newColor.b ) * winterColor.a * vColorRatio;", "newColor.r = newColor.r + ( uFloorColor.r - newColor.r ) * vFloorColorPercent;", "newColor.g = newColor.g + ( uFloorColor.g - newColor.g ) * vFloorColorPercent;", "newColor.b = newColor.b + ( uFloorColor.b - newColor.b ) * vFloorColorPercent;", "gl_FragColor = vec4( newColor.rgb, opacity );", THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], THREE.ShaderChunk["lightmap_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["shadowmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], "}"].join("\n");

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
    this._geometry = new THREE.PlaneGeometry(w, h, this.w / 10, this.h / 10);
    this._modifyFloor();
    this._texture = new THREE.MeshBasicMaterial({
      color: Colors.floor.getHex(),
      lights: false
    });
    THREE.Mesh.call(this, this._geometry, this._texture);
    this.rotation.x = -Math.PI * .5;
  }

  Floor.prototype._modifyFloor = function() {
    var baseH, baseRatio, baseW, data, i, ratio, vertice, vertices, _i, _len;
    data = HeightData.get();
    baseRatio = this.h >> 1;
    baseW = this.w / 10 >> 1;
    baseH = this.h / 10 >> 1;
    vertices = this._geometry.vertices;
    for (i = _i = 0, _len = vertices.length; _i < _len; i = ++_i) {
      vertice = vertices[i];
      ratio = (baseRatio + vertice.y) / this.h;
      ratio = 1;
      vertice.z += HeightData.getPixelValue(baseW + vertice.x / 10 >> 0, baseH - vertice.y / 10 >> 0);
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

  Grass.prototype._noiseW = 0;

  Grass.prototype._projector = null;

  Grass.prototype._vProjector = null;

  Grass.prototype._displacementData = null;

  Grass.prototype._displacementChannelR = null;

  Grass.prototype._displacementChannelG = null;

  Grass.prototype._displacementChannelB = null;

  Grass.prototype._colorChannel = null;

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

  Grass.prototype._colorChannelTexture = null;

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
    this._noiseW = this._texture.width;
    this._projector = new THREE.Projector();
    this._vProjector = new THREE.Vector3();
    this._displacementChannelR = new WindDisplacementChannel("map-displacement-r", "texture-displacement-r", this._displacementChannelG = new WindDisplacementChannel("map-displacement-g", "texture-displacement-g", true));
    this._displacementChannelB = new WindDisplacementChannel("map-displacement-b", "texture-displacement-b", true);
    this._colorChannel = new ColorChannel("map-color", "texture-color");
    this._displacementData = new WindDisplacementData(w, h, -w >> 1, 0, w >> 1, -h);
    this._displacementData.addChannel(this._displacementChannelR);
    this._displacementData.addChannel(this._displacementChannelG);
    this._displacementData.addChannel(this._displacementChannelB);
    this._displacementData.addChannel(this._colorChannel);
    THREE.Object3D.call(this);
    this._generateBlades();
    this._createGrass();
  }

  Grass.prototype._generateBlades = function() {
    var availableColors, baseColor, baseRatio, blade, colorSummer, geo, heightValue, i, idx, j, lengthAvailableColors, px, pz, ratio, step, v, vx, vz, xMax, xMin, zMax, zMin, _i, _j, _k, _len, _ref;
    this._colors = [];
    this._colorsWinter = [];
    this._positions = [];
    this._windRatio = [];
    this._blades = new THREE.Geometry();
    this._vectors = [];
    baseColor = new THREE.Color(0x3d5d0a);
    availableColors = [new THREE.Color(0x53dc23), new THREE.Color(0xb3dc23), new THREE.Color(0x23dc46), new THREE.Color(0x74ff2f)];
    lengthAvailableColors = Colors.grassSummer.length;
    step = 200;
    idx = 0;
    xMin = 0;
    xMax = this.w;
    zMin = 0;
    zMax = this.h;
    baseRatio = this.h >> 1;
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
        colorSummer = Colors.summer.getPixelValue(px / 10 >> 0, pz / 10 >> 0);
        ratio = 1 - pz / this.h;
        ratio = 1;
        heightValue *= ratio;
        geo = blade.geometry;
        _ref = geo.vertices;
        for (_k = 0, _len = _ref.length; _k < _len; _k++) {
          v = _ref[_k];
          if (v.y < 10) {
            this._windRatio[idx] = 0.0;
            this._colors[idx] = Colors.floor;
            this._colorsWinter[idx] = Colors.floor;
          } else {
            this._colors[idx] = colorSummer;
            this._colorsWinter[idx] = Colors.grassWinter[Math.random() * lengthAvailableColors >> 0];
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
    this._attributes.aColorWinter.value = this._colorsWinter;
    this._attributes.aWindRatio.value = this._windRatio;
    this._attributes.aWindOrientation.value = this._windOrientation = [];
    this._attributes.aWindLength.value = this._windLength = [];
    this._attributes.aPosition.value = this._positions;
    this._windDisplacementRTexture = new THREE.Texture(this._displacementChannelR.canvas);
    this._windDisplacementGTexture = new THREE.Texture(this._displacementChannelG.canvas);
    this._windDisplacementBTexture = new THREE.Texture(this._displacementChannelB.canvas);
    this._colorChannelTexture = new THREE.Texture(this._colorChannel.canvas);
    this._uniforms.uWindDisplacementR.value = this._windDisplacementRTexture;
    this._uniforms.uWindDisplacementG.value = this._windDisplacementGTexture;
    this._uniforms.uWindDisplacementB.value = this._windDisplacementBTexture;
    this._uniforms.uColorChannel.value = this._colorChannelTexture;
    this._uniforms.uOffsetX.value = 0.0;
    this._uniforms.uZoneW.value = this.w >> 1;
    this._uniforms.uZoneH.value = this.w >> 1;
    this._uniforms.uFloorW.value = this.w;
    this._uniforms.uMousePos.value = new THREE.Vector2(stage.mouse.x, stage.mouse.y);
    this._uniforms.uFloorColor.value = Colors.floor;
    this._uniforms.uGrassBladeHeight.value = GrassBlade.HEIGHT;
    this._uniforms.uWindMapForce.value = THREE.ImageUtils.loadTexture(this._texture.src);
    this._uniforms.uWindScale.value = 1;
    this._uniforms.uWindMin.value = new THREE.Vector2(0, 0);
    this._uniforms.uWindSize.value = new THREE.Vector2(60, 60);
    this._uniforms.uWindDirection.value = new THREE.Vector3(13, 5, 13);
    material = new THREE.ShaderMaterial(params);
    material.side = THREE.DoubleSide;
    return material;
  };

  Grass.prototype.convertToRange = function(x, a1, a2, b1, b2) {
    return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1;
  };

  Grass.prototype.update = function() {
    var camPos, m, pos;
    if (this._add > this._noiseW) {
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
    this._windDisplacementBTexture.needsUpdate = true;
    return this._colorChannelTexture.needsUpdate = true;
  };

  return Grass;

})(THREE.Object3D);

var GrassBlade,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GrassBlade = (function(_super) {
  __extends(GrassBlade, _super);

  GrassBlade.HEIGHT = 40;

  GrassBlade.prototype.geometry = null;

  GrassBlade.prototype.texture = null;

  function GrassBlade(x, y, z) {
    var h, pz, w;
    pz = z - 500;
    w = .25 + .5 * (Size.h - pz) / Size.h + Math.random() * 1;
    h = GrassBlade.HEIGHT;
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
    this._floor = new Floor(Size.w, Size.h);
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

var ColorChannel, ColorDot,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ColorChannel = (function() {
  ColorChannel.prototype.canvas = null;

  ColorChannel.prototype.w = 0;

  ColorChannel.prototype.h = 0;

  ColorChannel.prototype._ctx = null;

  ColorChannel.prototype._textDisplacement = null;

  ColorChannel.prototype._textDisplacementW = 0;

  ColorChannel.prototype._textDisplacementH = 0;

  ColorChannel.prototype._dots = null;

  function ColorChannel(idCanvas, idText, canRotate) {
    this.canvas = document.getElementById(idCanvas);
    this._canRotate = canRotate || false;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this._ctx = this.canvas.getContext("2d");
    this._ctx.fillStyle = "rgba( 0, 0, 0, 0 )";
    this._textDisplacement = document.getElementById(idText);
    this._textDisplacementW = this._textDisplacement.width;
    this._textDisplacementH = this._textDisplacement.height;
    this._createDots();
  }

  ColorChannel.prototype._createDots = function() {
    var px, py, spaceX, spaceY, step, x, y, _i, _j, _results;
    this._dots = [];
    step = 14;
    spaceX = this.w / step;
    spaceY = this.h / step;
    px = 0;
    py = 0;
    _results = [];
    for (x = _i = 0; 0 <= step ? _i < step : _i > step; x = 0 <= step ? ++_i : --_i) {
      for (y = _j = 0; 0 <= step ? _j < step : _j > step; y = 0 <= step ? ++_j : --_j) {
        this._dots.push(new ColorDot(px, py));
        px += spaceX;
      }
      px = 0;
      _results.push(py += spaceY);
    }
    return _results;
  };

  ColorChannel.prototype.fill = function(alpha) {};

  ColorChannel.prototype.draw = function(x, y) {
    var dist, dot, dx, dy, _i, _len, _ref, _results;
    this._ctx.clearRect(0, 0, this.w, this.h);
    _ref = this._dots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dot = _ref[_i];
      dx = x - dot.x;
      dy = y - dot.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 10) {
        dot.activate();
      }
      dot.update();
      this._ctx.save();
      this._ctx.globalAlpha = dot.alpha;
      this._ctx.translate(dot.x, dot.y);
      this._ctx.drawImage(this._textDisplacement, -this._textDisplacementW >> 1, -this._textDisplacementH >> 1);
      _results.push(this._ctx.restore());
    }
    return _results;
  };

  return ColorChannel;

})();

ColorDot = (function() {
  ColorDot.prototype.x = 0.0;

  ColorDot.prototype.y = 0.0;

  ColorDot.prototype.alpha = 0.0;

  ColorDot.prototype.time = 0.0;

  ColorDot.prototype.activated = false;

  function ColorDot(x, y) {
    this.x = x;
    this.y = y;
    this.deactivate = __bind(this.deactivate, this);
  }

  ColorDot.prototype.activate = function() {
    if (this.activated) {
      return;
    }
    this.activated = true;
    return setTimeout(this.deactivate, 5000);
  };

  ColorDot.prototype.update = function() {
    if (this.activated) {
      return this.alpha += (1 - this.alpha) * .05;
    } else {
      return this.alpha += (0 - this.alpha) * .05;
    }
  };

  ColorDot.prototype.deactivate = function() {
    if (!this.activated) {
      return;
    }
    return this.activated = false;
  };

  return ColorDot;

})();

var ColorData;

ColorData = (function() {
  ColorData.prototype._w = 0;

  ColorData.prototype._h = 0;

  ColorData.prototype._colors = null;

  function ColorData(img) {
    var canvas, color, ctx, data, i, _i, _ref;
    this.img = img;
    this._w = this.img.width;
    this._h = this.img.height;
    console.log(this._w, this._h);
    canvas = document.createElement("canvas");
    canvas.width = this._w;
    canvas.height = this._h;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    ctx.drawImage(this.img, 0, 0);
    data = ctx.getImageData(0, 0, this._w, this._h).data;
    this._colors = [];
    for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
      color = new THREE.Color();
      color.r = data[i] / 255;
      color.g = data[i + 1] / 255;
      color.b = data[i + 2] / 255;
      this._colors.push(color);
    }
    console.log(this._colors.length);
  }

  ColorData.prototype.getPixelValue = function(x, y) {
    if (x > this._w - 1) {
      x = this._w - 1;
    }
    if (y > this._h - 1) {
      y = this._h - 1;
    }
    return this._colors[y * this._w + x];
  };

  return ColorData;

})();

var HeightData;

HeightData = (function() {
  function HeightData() {}

  HeightData._rawData = null;

  HeightData._data = null;

  HeightData.prototype._w = 0;

  HeightData.prototype._h = 0;

  HeightData.get = function() {
    var canvas, ctx, data, i, j, texture, _i, _ref;
    if (HeightData._data) {
      return HeightData._data;
    }
    texture = document.getElementById("texture-height");
    this._w = texture.width;
    this._h = texture.height;
    canvas = document.createElement("canvas");
    canvas.width = this._w;
    canvas.height = this._h;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, 0, 0);
    HeightData._rawData = data = ctx.getImageData(0, 0, this._w, this._h).data;
    HeightData._data = [];
    j = 0;
    for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
      HeightData._data[j++] = data[i];
    }
    return HeightData._data;
  };

  HeightData.getPixelValue = function(x, y) {
    if (x > this._w - 1) {
      x = this._w - 1;
    }
    if (y > this._h - 1) {
      y = this._h - 1;
    }
    return HeightData._data[y * this._w + x];
  };

  return HeightData;

})();

var WindDisplacementChannel;

WindDisplacementChannel = (function() {
  WindDisplacementChannel.prototype.canvas = null;

  WindDisplacementChannel.prototype._canRotate = false;

  WindDisplacementChannel.prototype.w = 0;

  WindDisplacementChannel.prototype.h = 0;

  WindDisplacementChannel.prototype._ctx = null;

  WindDisplacementChannel.prototype._textDisplacement = null;

  WindDisplacementChannel.prototype._textDisplacementW = 0;

  WindDisplacementChannel.prototype._textDisplacementH = 0;

  function WindDisplacementChannel(idCanvas, idText, canRotate) {
    this.canvas = document.getElementById(idCanvas);
    this._canRotate = canRotate || false;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this._ctx = this.canvas.getContext("2d");
    this._ctx.fillStyle = "rgba( 128, 128, 128, 1 )";
    this._textDisplacement = document.getElementById(idText);
    this._textDisplacementW = this._textDisplacement.width;
    this._textDisplacementH = this._textDisplacement.height;
  }

  WindDisplacementChannel.prototype.fill = function(alpha) {
    this._ctx.fillStyle = "rgba( 128, 128, 128, " + alpha + ")";
    return this._ctx.fillRect(0, 0, this.w, this.h);
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

  WindDisplacementData.prototype._sizeW = 0;

  WindDisplacementData.prototype._sizeH = 0;

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

  function WindDisplacementData(sizeW, sizeH, _xMin, _yMin, _xMax, _yMax) {
    this._xMin = _xMin;
    this._yMin = _yMin;
    this._xMax = _xMax;
    this._yMax = _yMax;
    this._channels = [];
  }

  WindDisplacementData.prototype.addChannel = function(channel) {
    if (this._channels.length === 0) {
      this._sizeW = channel.w;
      this._sizeH = channel.h;
    }
    return this._channels.push(channel);
  };

  WindDisplacementData.prototype.update = function(x, y) {
    var a, channel, dist, dx, dy, newOrientation, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
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
      this._alpha += (.05 - this._alpha) * .05;
      if (this._alpha > .5) {
        this._drawCanvas();
        _ref1 = this._channels;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          channel = _ref1[_j];
          channel.fill(this._alpha);
        }
      } else {
        _ref2 = this._channels;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          channel = _ref2[_k];
          channel.fill(this._alpha);
        }
        this._drawCanvas();
      }
      dx = x - this._lastX;
      dy = y - this._lastY;
      dist = Math.sqrt(dx * dx + dy * dy);
      this._speed += dist * .05;
      this._speed += -this._speed * .05;
    } else {
      this._alpha += (1 - this._alpha) * .025;
      a = this._orientation;
      this._pOrientation.x += Math.cos(a) * this._speed;
      this._pOrientation.y += Math.sin(a) * this._speed;
      this._drawCanvas();
      this._speed += -this._speed * .1;
      _ref3 = this._channels;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        channel = _ref3[_l];
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
    return percent * this._sizeW;
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
    return percent * this._sizeH;
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

var Colors;

Colors = (function() {
  function Colors() {}

  Colors.floor = new THREE.Color(0x3c581b);

  Colors.grassSummer = [new THREE.Color(0x7a8332), new THREE.Color(0xb3dc23), new THREE.Color(0x8b9b2e), new THREE.Color(0x697426)];

  Colors.grassWinter = [new THREE.Color(0xc9f0ff), new THREE.Color(0xa3daef), new THREE.Color(0xc5e9f6), new THREE.Color(0xdcf6ff)];

  Colors.summer = null;

  return Colors;

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

    EngineInstance.prototype._composer = null;

    EngineInstance.prototype._depthTarget = null;

    EngineInstance.prototype.init = function(container) {
      this.renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        precision: "highp",
        stencil: false,
        preserveDrawingBuffer: false
      });
      this.renderer.setClearColor(0x416ca3, 1);
      this.renderer.setSize(stage.size.w, stage.size.h);
      this._container = container;
      this._container.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(50, stage.size.w / stage.size.h, 1, 3000);
      this.camera.position.set(0, 120, 150);
      this.camera.lookAt(new THREE.Vector3(0, 50, -1280 / 2));
      this.scene = new THREE.Scene();
      this._initLights();
      this._initPostProcessing();
      return updateManager.register(this);
    };

    EngineInstance.prototype._initLights = function() {
      var ambient, pointLight;
      ambient = new THREE.AmbientLight(0x8b937f);
      pointLight = new THREE.PointLight(0xe9ff9b, 2, 1000);
      pointLight.position.set(50, 50, 50);
      return this.scene.add(pointLight);
    };

    EngineInstance.prototype._initPostProcessing = function() {
      var effectCopy, effectVignette, fxaa, renderPass, renderTarget;
      this.renderer.autoClear = false;
      renderTarget = new THREE.WebGLRenderTarget(stage.size.w * 2, stage.size.h * 2, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: true
      });
      this._composer = new THREE.EffectComposer(this.renderer, renderTarget);
      renderPass = new THREE.RenderPass(this.scene, this.camera);
      this._composer.addPass(renderPass);
      fxaa = new THREE.ShaderPass(THREE.FXAAShader);
      fxaa.uniforms.resolution.value = new THREE.Vector2(1 / stage.size.w / 2, 1 / stage.size.h / 2);
      this._composer.addPass(fxaa);
      effectVignette = new THREE.ShaderPass(THREE.VignetteShader);
      effectVignette.uniforms.offset.value = 1.0;
      effectVignette.uniforms.darkness.value = 1.1;
      effectCopy = new THREE.ShaderPass(THREE.CopyShader);
      effectCopy.renderToScreen = true;
      return this._composer.addPass(effectCopy);
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

var Size;

Size = (function() {
  function Size() {}

  Size.w = 2560;

  Size.h = 1280;

  return Size;

})();

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
    Colors.summer = new ColorData(document.getElementById("color-summer"));
    world = new World();
    engine.scene.add(world);
    updateManager.enableDebugMode();
    updateManager.start();
  }

  return Main;

})();

$(window).on("load", function() {
  return new Main();
});
