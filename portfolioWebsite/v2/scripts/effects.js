(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    if (!hero) return; // allow this file on all pages

    const canvas3d = document.getElementById("fx3d");
    const canvas2d = document.getElementById("fx2d");

    // If neither exists, nothing to do.
    if (!canvas3d && !canvas2d) return;

    // ---- Layering / positioning ----
    // Ensure the hero becomes the positioning context for absolute canvases.
    // This prevents the canvases from pushing content down (document flow).
    if (!hero.style.position) hero.style.position = "relative";
    if (!hero.style.overflow) hero.style.overflow = "hidden";

    const heroInner = hero.querySelector(".hero-inner");
    if (heroInner) {
      if (!heroInner.style.position) heroInner.style.position = "relative";
      heroInner.style.zIndex = "2"; // content above both effects
    }

    function setupCanvasLayer(canvas, zIndex) {
      if (!canvas) return;
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = String(zIndex);
    }

    // WebGL wave background (bottom), constellation overlay (above)
    setupCanvasLayer(canvas3d, 0);
    setupCanvasLayer(canvas2d, 1);

    const state = {
      hero,
      canvas3d,
      canvas2d,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      width: 0,
      height: 0,
      mouse: { x: 0, y: 0, nx: 0, ny: 0 }, // px and normalized (-1..1)
      running: true,
      raf: 0,
    };

    // ---- Theme handling (dark/light) ----
    function detectTheme() {
      const root = document.documentElement;
      const body = document.body;

      // Try data attributes first
      const dt = (root.getAttribute("data-theme") || body.getAttribute("data-theme") || "").toLowerCase();
      const dm = (root.getAttribute("data-mode") || body.getAttribute("data-mode") || "").toLowerCase();

      const cls = `${root.className} ${body.className}`.toLowerCase();

      const hint = dt || dm;
      if (hint.includes("light")) return "light";
      if (hint.includes("dark")) return "dark";

      if (cls.includes("light")) return "light";
      if (cls.includes("dark")) return "dark";

      // Fallback: assume dark (matches current site default)
      return "dark";
    }

    state.theme = detectTheme();

    function applyTheme(mode) {
      state.theme = mode;
      if (constellation && constellation.setTheme) constellation.setTheme(mode);
      if (webglBg && webglBg.setTheme) webglBg.setTheme(mode);
    }

    // Mouse tracking (used by both layers)
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
      state.mouse.nx = (state.mouse.x / rect.width) * 2 - 1;
      state.mouse.ny = -((state.mouse.y / rect.height) * 2 - 1);
    });

    // Resize handler
    function resize() {
      const rect = hero.getBoundingClientRect();
      state.width = Math.max(1, Math.floor(rect.width));
      state.height = Math.max(1, Math.floor(rect.height));

      if (state.canvas2d) {
        state.canvas2d.width = Math.floor(state.width * state.dpr);
        state.canvas2d.height = Math.floor(state.height * state.dpr);
        state.canvas2d.style.width = `${state.width}px`;
        state.canvas2d.style.height = `${state.height}px`;
      }

      if (state.canvas3d) {
        state.canvas3d.width = Math.floor(state.width * state.dpr);
        state.canvas3d.height = Math.floor(state.height * state.dpr);
        state.canvas3d.style.width = `${state.width}px`;
        state.canvas3d.style.height = `${state.height}px`;
      }
    }

    // Pause when tab hidden (prevents burning laptops)
    document.addEventListener("visibilitychange", () => {
      state.running = !document.hidden;
      if (state.running) loop(performance.now());
    });

    window.addEventListener("resize", () => resize());
    resize();

    // ---- Layer A: 2D constellation (fx2d) ----
    const constellation = state.canvas2d ? createConstellation(state) : null;

    // ---- Layer B: WebGL shader background (fx3d) ----
    const webglBg = state.canvas3d ? createWebGLBackground(state) : null;

    // Apply current theme immediately
    applyTheme(state.theme);

    // Watch for theme toggles (class/data-attribute changes)
    const themeObserver = new MutationObserver(() => {
      const next = detectTheme();
      if (next !== state.theme) applyTheme(next);
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });

    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });

    // Main loop
    function loop(t) {
      if (!state.running) return;

      if (webglBg) webglBg.render(t);
      if (constellation) constellation.render(t);

      state.raf = requestAnimationFrame(loop);
    }

    loop(performance.now());
  });

// --- 2D Constellation ---
  function createConstellation(state) {
    const ctx = state.canvas2d.getContext("2d");
    if (!ctx) return null;

    // Make the constellation scale with hero size so it spans the whole area.
    const AREA = state.width * state.height;
    const COUNT = Math.max(55, Math.min(95, Math.floor(AREA / 22000)));

    const SPEED = 0.22;
    const LINK_DIST = 160; // px in CSS space

    // Only points near the cursor should be pulled (local influence, not whole field).
    const MOUSE_RADIUS = 180; // px
    const MOUSE_PULL = 0.015;

    // Subtle per-point wander to keep it alive.
    const WANDER = 0.015;

    const pts = [];
    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      });
    }

    const palette = {
      dark: {
        line: "rgba(180, 160, 255, 0.40)",
        dot: "rgba(220, 210, 255, 0.85)",
        trail: "rgba(10, 10, 18, 0.18)",
      },
      light: {
        line: "rgba(120, 95, 210, 0.34)",
        dot: "rgba(70, 50, 150, 0.78)",
        trail: "rgba(245, 242, 255, 0.22)",
      },
    };

    let mode = state.theme || "dark";

    function setTheme(nextMode) {
      mode = nextMode === "light" ? "light" : "dark";
      ctx.strokeStyle = palette[mode].line;
      ctx.fillStyle = palette[mode].dot;
    }

    // Apply initial theme
    setTheme(mode);

    function render() {
      // Work in CSS pixels; scale once for dpr.
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);

      ctx.fillStyle = palette[mode].trail;
      ctx.fillRect(0, 0, state.width, state.height);

      // Restore dot fill for subsequent drawing
      ctx.fillStyle = palette[mode].dot;

      // Update positions
      for (const p of pts) {
        // Local mouse attraction: only affect points within a radius.
        const dx = state.mouse.x - p.x;
        const dy = state.mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0.001) {
          const falloff = 1.0 - dist / MOUSE_RADIUS;
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * falloff * MOUSE_PULL;
          p.vy += ny * falloff * MOUSE_PULL;
        }

        // Gentle wander so the field stays lively.
        p.vx += (Math.random() - 0.5) * WANDER;
        p.vy += (Math.random() - 0.5) * WANDER;

        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -20) p.x = state.width + 20;
        if (p.x > state.width + 20) p.x = -20;
        if (p.y < -20) p.y = state.height + 20;
        if (p.y > state.height + 20) p.y = -20;

        // Mild damping (prevents runaway drift)
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Clamp max speed so the field doesn't "collapse" toward the mouse
        const maxV = 0.55;
        p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
        p.vy = Math.max(-maxV, Math.min(maxV, p.vy));
      }

      // Lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);

          if (d < LINK_DIST) {
            const alpha = 1 - d / LINK_DIST;
            ctx.globalAlpha = alpha * (mode === "light" ? 0.30 : 0.18);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Points
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, mode === "light" ? 1.3 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return { render, setTheme };
  }

  function createWebGLBackground(state) {
    const gl = state.canvas3d.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return null;

    const vertSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    // “Blob-ish” background.
    // My brain hurts every time I write WebGL code...
    const fragSrc = `
      precision mediump float;
      varying vec2 vUv;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uMouse; // -1..1
      uniform vec3 uBase;
      uniform vec3 uGlow;
      uniform float uAlpha;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

        float t = uTime * 0.00025;
        float n = noise(p * 2.2 + vec2(t, -t));
        float n2 = noise(p * 4.4 - vec2(t * 1.3, t * 0.7));

        // Mouse-driven warp (subtle)
        p += uMouse * 0.10 * (n - 0.5);

        float v = 0.55 + 0.35 * sin(3.0 * (p.x + n) + t * 6.0)
                        + 0.25 * cos(3.5 * (p.y + n2) - t * 5.0);

        v = smoothstep(0.0, 1.0, v);

        vec3 col = mix(uBase, uGlow, v * 0.75);

        // Fade near edges so hero content stays readable
        float edge = smoothstep(1.0, 0.2, length(p));
        col *= edge;

        gl_FragColor = vec4(col, uAlpha);
      }
    `;

    const program = createProgram(gl, vertSrc, fragSrc);
    gl.useProgram(program);

    // Fullscreen triangle (more efficient than quad)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         3, -1,
        -1,  3,
      ]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uBase = gl.getUniformLocation(program, "uBase");
    const uGlow = gl.getUniformLocation(program, "uGlow");
    const uAlpha = gl.getUniformLocation(program, "uAlpha");

    const palettes = {
      dark: {
        base: [0.04, 0.04, 0.06],
        glow: [0.55, 0.42, 0.95],
        alpha: 0.85,
      },
      light: {
        // Higher-contrast light mode: slightly darker “paper” + stronger purple presence
        base: [0.92, 0.915, 0.94],
        glow: [0.55, 0.42, 0.95],
        alpha: 0.62,
      },
    };

    let mode = state.theme || "dark";

    function setTheme(nextMode) {
      mode = nextMode === "light" ? "light" : "dark";
    }

    // Apply initial theme
    setTheme(mode);

    function render(t) {
      gl.viewport(0, 0, state.canvas3d.width, state.canvas3d.height);
      gl.uniform2f(uRes, state.canvas3d.width, state.canvas3d.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, state.mouse.nx, state.mouse.ny);

      const p = palettes[mode];
      gl.uniform3f(uBase, p.base[0], p.base[1], p.base[2]);
      gl.uniform3f(uGlow, p.glow[0], p.glow[1], p.glow[2]);
      gl.uniform1f(uAlpha, p.alpha);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    return { render, setTheme };
  }

  function createProgram(gl, vertSrc, fragSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const msg = gl.getProgramInfoLog(prog) || "Unknown program link error";
      gl.deleteProgram(prog);
      throw new Error(msg);
    }
    return prog;
  }

  function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(sh) || "Unknown shader compile error";
      gl.deleteShader(sh);
      throw new Error(msg);
    }
    return sh;
  }
})();