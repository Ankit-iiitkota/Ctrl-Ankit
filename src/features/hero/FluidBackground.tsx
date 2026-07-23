import React, { useEffect, useRef } from 'react'

// GPU fluid simulation background (Navier-Stokes style advection/pressure/vorticity solve
// via ping-pong framebuffers), splatting colorful dye at the cursor as it moves.
// Mounted once as a fixed, full-viewport layer behind the whole site — dye trails
// follow the cursor across every section, dissipating as they drift.

const BASE_VERTEX_SHADER = /* glsl */ `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const COPY_SHADER = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`

const CLEAR_SHADER = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`

const SPLAT_SHADER = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`

const ADVECTION_SHADER = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`

const DIVERGENCE_SHADER = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`

const CURL_SHADER = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`

const VORTICITY_SHADER = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;

  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;

    vec2 vel = texture2D(uVelocity, vUv).xy;
    vel += force * dt;
    vel = clamp(vel, -1000.0, 1000.0);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`

const PRESSURE_SHADER = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

const GRADIENT_SUBTRACT_SHADER = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

// Composites the dye buffer onto a near-black base with a soft vignette so the
// frame stays mostly dark, matching the site's dark theme instead of a bright canvas.
const DISPLAY_SHADER = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec3 uBaseColor;
  uniform float uIsLight;

  void main () {
    vec3 dye = texture2D(uTexture, vUv).rgb;

    // Dark theme: dye glows as additive light on near-black.
    vec3 darkColor = uBaseColor + dye;
    float vignette = smoothstep(1.05, 0.4, distance(vUv, vec2(0.5)));
    darkColor *= mix(0.6, 1.0, vignette);

    // Light theme: dye reads as saturated ink diffusing into paper (subtractive),
    // no vignette darkening since that only reads correctly against black.
    vec3 lightColor = uBaseColor - dye * 0.85;
    lightColor = clamp(lightColor, 0.0, 1.0);

    vec3 color = mix(darkColor, lightColor, uIsLight);
    gl_FragColor = vec4(color, 1.0);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Failed to create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${info}`)
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const program = gl.createProgram()
  if (!program) throw new Error('Failed to create program')
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    throw new Error(`Program link error: ${info}`)
  }
  return program
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
  const uniforms: Record<string, WebGLUniformLocation> = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (!info) continue
    const location = gl.getUniformLocation(program, info.name)
    if (location) uniforms[info.name] = location
  }
  return uniforms
}

type FBO = {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
}

type DoubleFBO = {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

// Theme -> shader base color (kept in sync with --bg-primary: #060913 dark / #E6E3D8 light)
const THEME_BASE_COLOR: Record<'dark' | 'light', [number, number, number]> = {
  dark: [0.0235, 0.0353, 0.0745],
  light: [0.902, 0.890, 0.847]
}

export const FluidBackground: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const baseColorRef = useRef<[number, number, number]>(THEME_BASE_COLOR[theme])
  const isLightRef = useRef(theme === 'light' ? 1 : 0)

  useEffect(() => {
    baseColorRef.current = THEME_BASE_COLOR[theme]
    isLightRef.current = theme === 'light' ? 1 : 0
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const gl = (canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false }) ||
      canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false })) as WebGLRenderingContext | null
    if (!gl) return

    const isWebGL2 = 'drawBuffers' in gl
    // EXT_color_buffer_float is required to actually render into a float framebuffer on WebGL2;
    // without it, RGBA16F/R16F targets would be framebuffer-incomplete and render as black.
    const supportsFloatRender = isWebGL2 ? !!gl.getExtension('EXT_color_buffer_float') : false
    const halfFloatExt = isWebGL2 ? null : gl.getExtension('OES_texture_half_float')
    gl.getExtension('OES_texture_half_float_linear')
    const halfFloatType =
      isWebGL2 && supportsFloatRender
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : !isWebGL2
          ? (halfFloatExt as any)?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE
          : gl.UNSIGNED_BYTE

    const internalFormatRGBA = isWebGL2 && supportsFloatRender ? (gl as WebGL2RenderingContext).RGBA16F : gl.RGBA
    const internalFormatR = isWebGL2 && supportsFloatRender ? (gl as WebGL2RenderingContext).R16F : gl.RGBA
    const formatR = isWebGL2 && supportsFloatRender ? (gl as WebGL2RenderingContext).RED : gl.RGBA

    let simResolution = 128
    let dyeResolution = 512
    const DENSITY_DISSIPATION = 2.5
    const VELOCITY_DISSIPATION = 1.4
    const PRESSURE_ITERATIONS = 18
    const CURL_STRENGTH = 22
    const SPLAT_RADIUS = 0.14

    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const elementBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const copyProgram = createProgram(gl, BASE_VERTEX_SHADER, COPY_SHADER)
    const clearProgram = createProgram(gl, BASE_VERTEX_SHADER, CLEAR_SHADER)
    const splatProgram = createProgram(gl, BASE_VERTEX_SHADER, SPLAT_SHADER)
    const advectionProgram = createProgram(gl, BASE_VERTEX_SHADER, ADVECTION_SHADER)
    const divergenceProgram = createProgram(gl, BASE_VERTEX_SHADER, DIVERGENCE_SHADER)
    const curlProgram = createProgram(gl, BASE_VERTEX_SHADER, CURL_SHADER)
    const vorticityProgram = createProgram(gl, BASE_VERTEX_SHADER, VORTICITY_SHADER)
    const pressureProgram = createProgram(gl, BASE_VERTEX_SHADER, PRESSURE_SHADER)
    const gradientSubtractProgram = createProgram(gl, BASE_VERTEX_SHADER, GRADIENT_SUBTRACT_SHADER)
    const displayProgram = createProgram(gl, BASE_VERTEX_SHADER, DISPLAY_SHADER)

    const uniforms = {
      copy: getUniforms(gl, copyProgram),
      clear: getUniforms(gl, clearProgram),
      splat: getUniforms(gl, splatProgram),
      advection: getUniforms(gl, advectionProgram),
      divergence: getUniforms(gl, divergenceProgram),
      curl: getUniforms(gl, curlProgram),
      vorticity: getUniforms(gl, vorticityProgram),
      pressure: getUniforms(gl, pressureProgram),
      gradientSubtract: getUniforms(gl, gradientSubtractProgram),
      display: getUniforms(gl, displayProgram)
    }

    function blit(target: FBO | null) {
      if (target) {
        gl!.viewport(0, 0, target.width, target.height)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
      } else {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0)
    }

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0)
      const texture = gl!.createTexture()!
      gl!.bindTexture(gl!.TEXTURE_2D, texture)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

      const fbo = gl!.createFramebuffer()!
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)
      gl!.viewport(0, 0, w, h)
      gl!.clear(gl!.COLOR_BUFFER_BIT)

      const texelSizeX = 1 / w
      const texelSizeY = 1 / h

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id)
          gl!.bindTexture(gl!.TEXTURE_2D, texture)
          return id
        }
      }
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(w, h, internalFormat, format, type, param)
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1
        },
        get write() {
          return fbo2
        },
        swap() {
          const temp = fbo1
          fbo1 = fbo2
          fbo2 = temp
        }
      }
    }

    function getResolution(resolution: number) {
      let aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio
      const min = Math.round(resolution)
      const max = Math.round(resolution * aspectRatio)
      if (gl!.drawingBufferWidth > gl!.drawingBufferHeight) return { width: max, height: min }
      return { width: min, height: max }
    }

    let dye: DoubleFBO
    let velocity: DoubleFBO
    let divergenceFBO: FBO
    let curlFBO: FBO
    let pressure: DoubleFBO

    const filterMode = gl.LINEAR

    function initFramebuffers() {
      const simRes = getResolution(simResolution)
      const dyeRes = getResolution(dyeResolution)
      const texType = halfFloatType || gl!.UNSIGNED_BYTE

      gl!.disable(gl!.BLEND)

      dye = createDoubleFBO(dyeRes.width, dyeRes.height, internalFormatRGBA, isWebGL2 ? (gl as WebGL2RenderingContext).RGBA : gl!.RGBA, texType, filterMode)
      velocity = createDoubleFBO(simRes.width, simRes.height, internalFormatRGBA, isWebGL2 ? (gl as WebGL2RenderingContext).RGBA : gl!.RGBA, texType, filterMode)
      divergenceFBO = createFBO(simRes.width, simRes.height, internalFormatR, formatR, texType, gl!.NEAREST)
      curlFBO = createFBO(simRes.width, simRes.height, internalFormatR, formatR, texType, gl!.NEAREST)
      pressure = createDoubleFBO(simRes.width, simRes.height, internalFormatR, formatR, texType, gl!.NEAREST)
    }

    initFramebuffers()

    function resizeCanvas() {
      const width = canvas!.clientWidth
      const height = canvas!.clientHeight
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width
        canvas!.height = height
        return true
      }
      return false
    }

    // Pointer state, smoothed for elegant motion rather than a snappy 1:1 follow
    const pointer = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, moved: false, active: !isTouchDevice }
    const hueRef = { current: 0 }

    function hsvToRgb(h: number, s: number, v: number) {
      let r = 0, g = 0, b = 0
      const i = Math.floor(h * 6)
      const f = h * 6 - i
      const p = v * (1 - s)
      const q = v * (1 - f * s)
      const t = v * (1 - (1 - f) * s)
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break
        case 1: r = q; g = v; b = p; break
        case 2: r = p; g = v; b = t; break
        case 3: r = p; g = q; b = v; break
        case 4: r = t; g = p; b = v; break
        case 5: r = v; g = p; b = q; break
      }
      return { r, g, b }
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      gl!.useProgram(splatProgram)
      gl!.uniform1i(uniforms.splat.uTarget, velocity.read.attach(0))
      gl!.uniform1f(uniforms.splat.aspectRatio, canvas!.width / canvas!.height)
      gl!.uniform2f(uniforms.splat.point, x, y)
      gl!.uniform3f(uniforms.splat.color, dx, dy, 0.0)
      gl!.uniform1f(uniforms.splat.radius, SPLAT_RADIUS / 100)
      blit(velocity.write)
      velocity.swap()

      gl!.uniform1i(uniforms.splat.uTarget, dye.read.attach(0))
      gl!.uniform3f(uniforms.splat.color, color.r, color.g, color.b)
      blit(dye.write)
      dye.swap()
    }

    function splatFromPointer() {
      const dx = (pointer.x - pointer.prevX) * 6000
      const dy = (pointer.y - pointer.prevY) * 6000
      hueRef.current = (hueRef.current + 0.006) % 1
      const color = hsvToRgb(hueRef.current, 0.65, 1.0)
      splat(pointer.x, pointer.y, dx, dy, { r: color.r * 0.28, g: color.g * 0.28, b: color.b * 0.28 })
    }

    function autonomousSplat(time: number) {
      const x = 0.5 + Math.sin(time * 0.09) * 0.28
      const y = 0.5 + Math.cos(time * 0.075) * 0.22
      hueRef.current = (hueRef.current + 0.003) % 1
      const color = hsvToRgb(hueRef.current, 0.65, 1.0)
      splat(x, y, Math.cos(time * 0.09) * 40, -Math.sin(time * 0.075) * 40, { r: color.r * 0.16, g: color.g * 0.16, b: color.b * 0.16 })
    }

    let lastTime = performance.now()

    function step(dt: number) {
      gl!.disable(gl!.BLEND)

      // Curl
      gl!.useProgram(curlProgram)
      gl!.uniform2f(uniforms.curl.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(uniforms.curl.uVelocity, velocity.read.attach(0))
      blit(curlFBO)

      // Vorticity
      gl!.useProgram(vorticityProgram)
      gl!.uniform2f(uniforms.vorticity.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(uniforms.vorticity.uVelocity, velocity.read.attach(0))
      gl!.uniform1i(uniforms.vorticity.uCurl, curlFBO.attach(1))
      gl!.uniform1f(uniforms.vorticity.curl, CURL_STRENGTH)
      gl!.uniform1f(uniforms.vorticity.dt, dt)
      blit(velocity.write)
      velocity.swap()

      // Divergence
      gl!.useProgram(divergenceProgram)
      gl!.uniform2f(uniforms.divergence.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(uniforms.divergence.uVelocity, velocity.read.attach(0))
      blit(divergenceFBO)

      // Clear pressure (slight decay)
      gl!.useProgram(clearProgram)
      gl!.uniform1i(uniforms.clear.uTexture, pressure.read.attach(0))
      gl!.uniform1f(uniforms.clear.value, 0.8)
      blit(pressure.write)
      pressure.swap()

      // Pressure solve
      gl!.useProgram(pressureProgram)
      gl!.uniform2f(uniforms.pressure.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(uniforms.pressure.uDivergence, divergenceFBO.attach(0))
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(uniforms.pressure.uPressure, pressure.read.attach(1))
        blit(pressure.write)
        pressure.swap()
      }

      // Gradient subtract
      gl!.useProgram(gradientSubtractProgram)
      gl!.uniform2f(uniforms.gradientSubtract.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(uniforms.gradientSubtract.uPressure, pressure.read.attach(0))
      gl!.uniform1i(uniforms.gradientSubtract.uVelocity, velocity.read.attach(1))
      blit(velocity.write)
      velocity.swap()

      // Advect velocity
      gl!.useProgram(advectionProgram)
      gl!.uniform2f(uniforms.advection.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(uniforms.advection.uVelocity, velocity.read.attach(0))
      gl!.uniform1i(uniforms.advection.uSource, velocity.read.attach(0))
      gl!.uniform1f(uniforms.advection.dt, dt)
      gl!.uniform1f(uniforms.advection.dissipation, VELOCITY_DISSIPATION)
      blit(velocity.write)
      velocity.swap()

      // Advect dye
      gl!.uniform1i(uniforms.advection.uVelocity, velocity.read.attach(0))
      gl!.uniform1i(uniforms.advection.uSource, dye.read.attach(1))
      gl!.uniform1f(uniforms.advection.dissipation, DENSITY_DISSIPATION)
      blit(dye.write)
      dye.swap()
    }

    function render() {
      gl!.disable(gl!.BLEND)
      gl!.useProgram(displayProgram)
      gl!.uniform1i(uniforms.display.uTexture, dye.read.attach(0))
      const [r, g, b] = baseColorRef.current
      gl!.uniform3f(uniforms.display.uBaseColor, r, g, b)
      gl!.uniform1f(uniforms.display.uIsLight, isLightRef.current)
      blit(null)
    }

    let animationFrameId: number
    let isVisible = true

    function frame(now: number) {
      if (!isVisible) return
      const dt = Math.min((now - lastTime) / 1000, 0.0166)
      lastTime = now

      if (resizeCanvas()) initFramebuffers()

      if (pointer.active) {
        if (pointer.moved) {
          splatFromPointer()
          pointer.moved = false
        }
      } else if (!prefersReducedMotion) {
        autonomousSplat(now / 1000)
      }

      step(dt)
      render()

      animationFrameId = requestAnimationFrame(frame)
    }

    const handleVisibilityChange = () => {
      const wasVisible = isVisible
      isVisible = document.visibilityState === 'visible'
      if (isVisible && !wasVisible) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    function updatePointerFromEvent(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect()
      pointer.prevX = pointer.x
      pointer.prevY = pointer.y
      pointer.x = (clientX - rect.left) / rect.width
      pointer.y = 1 - (clientY - rect.top) / rect.height
      pointer.moved = true
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return
      updatePointerFromEvent(e.clientX, e.clientY)
    }

    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    animationFrameId = requestAnimationFrame(frame)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 bg-[var(--bg-primary)]"
    />
  )
}

export default FluidBackground
