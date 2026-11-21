"use client";

import { useEffect, useRef } from "react";

// Endless water ripples, drawn in the dark and revealed by a flashlight that
// follows the pointer. The faster the pointer moves, the brighter and wider the
// light. Everything is ordered-dithered down to two tones, rendered at low
// resolution and scaled up with crisp pixels.

const PIXEL = 2; // CSS pixels per dither cell

const MAX_DROPS = 32; // wake points kept alive at once
const DROP_SPACING = 48; // CSS px the glow travels between wake points
const DROP_LIFE = 3.2; // seconds a wake point lasts

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
#define MAX_DROPS ${MAX_DROPS}

uniform vec2 uRes;       // canvas size in device cells
uniform float uTime;     // seconds
uniform vec2 uLight;     // light position in cells, origin bottom-left
uniform float uPower;    // 0..1, how brightly the light shines
uniform float uRadius;   // light radius in cells
uniform vec3 uDark;
uniform vec3 uLit;
uniform vec4 uText;      // text column rect in cells: x0, y0, x1, y1
uniform float uPixel;    // CSS pixels per cell
uniform float uClock;    // seconds, real time (drives the wake)
uniform vec4 uDrops[MAX_DROPS]; // wake points: x, y (CSS px, origin bottom-left), birth time, strength

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT).
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Water caustics from noise, so the pattern never repeats. Two layers of
// ridged noise (bright where the noise crosses zero) overlap into a net of
// light lines; a slow, large warp bends both so they drift like moving water.
float water(vec2 p, float t) {
  vec2 warp = vec2(
    snoise(vec3(p * 0.45, t * 0.6)),
    snoise(vec3(p * 0.45 + 17.3, t * 0.6))
  ) * 0.7;
  // Clamp before pow: noise can overshoot 1 slightly on some GPUs, and pow of
  // a negative number is undefined there.
  float r1 = clamp(1.0 - abs(snoise(vec3(p + warp, t))), 0.0, 1.0);
  float r2 = clamp(1.0 - abs(snoise(vec3(p * 1.8 - warp + 4.1, t * 1.4))), 0.0, 1.0);
  return clamp(pow(r1, 7.0) * 0.8 + pow(r2, 12.0) * 0.25, 0.0, 1.0);
}

// 8x8 Bayer threshold in [0, 1).
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

// The wake: each point the glow passes over sends out a soft ring that
// spreads and fades. Returns surface height; grad gets its slope.
float wake(vec2 pos, out vec2 grad) {
  float h = 0.0;
  grad = vec2(0.0);
  for (int i = 0; i < MAX_DROPS; i++) {
    vec4 drop = uDrops[i];
    if (drop.w <= 0.0) continue;
    float age = uClock - drop.z;
    vec2 v = pos - drop.xy;
    float dist = length(v) + 0.001;
    float x = dist - age * 190.0;            // ring travels outward at 190px/s
    float env = exp(-x * x / 8100.0)         // ring about 90px wide
              * exp(-age * 1.1)              // fades over ~2.5s
              * drop.w;
    float k = 6.28318 / 110.0;               // 110px between crests
    h += sin(x * k) * env;
    grad += cos(x * k) * k * env * (v / dist);
  }
  return h;
}

void main() {
  vec2 cell = gl_FragCoord.xy;
  vec2 pos = cell * uPixel;

  // The glow presses the surface: the wake bends the light lines, the way
  // ripples refract the pattern on a pool floor.
  vec2 grad;
  float h = wake(pos, grad);
  pos -= grad * 180.0;

  float scale = 1.0 / 460.0; // ripple size in CSS px: larger divisor, bigger ripples
  vec2 uv = pos * scale;

  float w = water(uv, uTime * 0.18);

  float d = length(cell - uLight) / uRadius;
  float light = exp(-d * d * 3.0) * uPower;

  // Keep the light low behind the text column so the copy stays readable.
  vec2 outside = max(max(uText.xy - cell, cell - uText.zw), 0.0);
  float edge = length(outside) * uPixel;
  float textMask = mix(0.55, 1.0, smoothstep(0.0, 64.0, edge));
  light *= textMask;

  // Faint ripples stay visible in the dark; the light brings them up.
  float ambient = 0.075;
  float lum = w * (ambient + light * 1.25) + light * 0.06;
  // Ripple crests catch a little of the light.
  lum += max(h, 0.0) * 0.06 * (0.25 + light) * textMask;
  lum = clamp(lum - 0.025, 0.0, 1.0);

  // Offset the threshold so near-black stays empty instead of an even dot grid.
  float on = lum > bayer8(cell) + 1.5 / 64.0 ? 1.0 : 0.0;
  gl_FragColor = vec4(mix(uDark, uLit, on), 1.0);
}
`;

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  }
  return s;
}

export function WaterBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uLight = u("uLight");
    const uPower = u("uPower");
    const uRadius = u("uRadius");
    gl.uniform3fv(u("uDark"), hex("#080808"));
    gl.uniform3fv(u("uLit"), hex("#2c2c2c"));

    const uText = u("uText");
    gl.uniform1f(u("uPixel"), PIXEL);
    const text = document.querySelector("main");

    const uClock = u("uClock");
    const uDrops = u("uDrops");
    const drops = new Float32Array(MAX_DROPS * 4);
    let nextDrop = 0;
    let lastDrop: { x: number; y: number } | null = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pointer state, in CSS pixels.
    const start0 = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.42 };
    const pointer = { x: start0.x, y: start0.y, seen: false };
    const light = { x: pointer.x, y: pointer.y };
    let speed = 0; // smoothed CSS px per second
    let power = 0;
    let last = { x: pointer.x, y: pointer.y, t: performance.now() };

    // The glow stays off until the pointer first moves, then appears right
    // under it with no drift and no speed spike.
    function arrive(x: number, y: number) {
      if (pointer.seen) return;
      pointer.x = light.x = x;
      pointer.y = light.y = y;
      last = { x, y, t: performance.now() };
      pointer.seen = true;
    }

    function onMove(e: PointerEvent) {
      const now = performance.now();
      arrive(e.clientX, e.clientY);
      const dt = Math.max(now - last.t, 1) / 1000;
      const v = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
      speed = Math.max(speed, Math.min(v, 4000) * 0.6 + speed * 0.4);
      last = { x: e.clientX, y: e.clientY, t: now };
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.seen = true;
    }
    function onLeave() {
      pointer.seen = false;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    function resize() {
      canvas.width = Math.ceil(window.innerWidth / PIXEL);
      canvas.height = Math.ceil(window.innerHeight / PIXEL);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let prev = performance.now();
    const start = prev;

    function frame(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.1);
      prev = now;

      // The light trails the pointer a little, like it's being swung.
      const follow = 1 - Math.exp(-dt * 14);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;

      // Speed decays when the pointer rests; power chases speed.
      speed *= Math.exp(-dt * 3.5);
      const target = pointer.seen ? 0.35 + Math.min(speed / 1800, 1) * 0.65 : 0;
      const rate = target > power ? 10 : 2.5; // brighten fast, fade slow
      power += (target - power) * (1 - Math.exp(-dt * rate));

      // Leave a wake: drop a ripple source every few pixels the glow travels,
      // stronger the faster it moves. Nothing is dropped while it rests.
      const clock = (now - start) / 1000;
      if (!reduce && pointer.seen) {
        const gap = lastDrop ? Math.hypot(light.x - lastDrop.x, light.y - lastDrop.y) : Infinity;
        if (gap >= DROP_SPACING) {
          const strength = lastDrop ? 0.12 + Math.min(speed / 2200, 1) * 0.5 : 0.12;
          const o = nextDrop * 4;
          drops[o] = light.x;
          drops[o + 1] = window.innerHeight - light.y;
          drops[o + 2] = clock;
          drops[o + 3] = strength;
          nextDrop = (nextDrop + 1) % MAX_DROPS;
          lastDrop = { x: light.x, y: light.y };
        }
      } else {
        lastDrop = null;
      }
      for (let i = 0; i < MAX_DROPS; i++) {
        if (drops[i * 4 + 3] > 0 && clock - drops[i * 4 + 2] > DROP_LIFE) drops[i * 4 + 3] = 0;
      }
      gl!.uniform1f(uClock, clock);
      gl!.uniform4fv(uDrops, drops);

      const radius = (170 + Math.min(speed / 1800, 1) * 120) / PIXEL;

      gl!.uniform1f(uTime, reduce ? 0 : (now - start) / 1000);
      gl!.uniform2f(uLight, light.x / PIXEL, (window.innerHeight - light.y) / PIXEL);
      gl!.uniform1f(uPower, power);
      gl!.uniform1f(uRadius, radius);
      if (text) {
        // Content box of the column, tracked every frame so it follows scrolling.
        const r = text.getBoundingClientRect();
        const cs = getComputedStyle(text);
        const x0 = r.left + parseFloat(cs.paddingLeft);
        const x1 = r.right - parseFloat(cs.paddingRight);
        const y0 = window.innerHeight - (r.bottom - parseFloat(cs.paddingBottom));
        const y1 = window.innerHeight - (r.top + parseFloat(cs.paddingTop));
        gl!.uniform4f(uText, x0 / PIXEL, y0 / PIXEL, x1 / PIXEL, y1 / PIXEL);
      }
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full [image-rendering:pixelated]"
    />
  );
}
