/**
 * NEXUS // DIGITAL — Interactive Engine & Core Scripts
 * Cutting-edge WebGL, Audio Synthesis, and Dynamic State Transitions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // 1. SCI-FI WEB AUDIO API SYNTHESIZER
  // ============================================================================
  let audioContext = null;
  let audioEnabled = false;

  const audioToggleBtn = document.getElementById('audio-toggle');
  const audioIconOff = document.getElementById('audio-icon-off');
  const audioIconOn = document.getElementById('audio-icon-on');

  function initAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!audioEnabled || !audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(gainVal, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }

  function playChirp() {
    if (!audioEnabled || !audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.12);
    } catch (e) {}
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        audioIconOff.classList.add('hidden');
        audioIconOn.classList.remove('hidden');
        audioToggleBtn.classList.add('border-neon-cyan/50', 'bg-neon-cyan/10');
        playTone(660, 'sine', 0.15, 0.06);
      } else {
        audioIconOff.classList.remove('hidden');
        audioIconOn.classList.add('hidden');
        audioToggleBtn.classList.remove('border-neon-cyan/50', 'bg-neon-cyan/10');
      }
    });
  }

  // Play subtle feedback on button clicks
  document.querySelectorAll('button, a.nav-link, .preset-btn, .code-tab').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(340, 'sine', 0.03, 0.015));
    el.addEventListener('click', () => playTone(520, 'triangle', 0.06, 0.03));
  });

  // ============================================================================
  // 2. MOUSE CURSOR SPOTLIGHT TRACKER
  // ============================================================================
  const cursorSpotlight = document.getElementById('cursor-spotlight');
  if (cursorSpotlight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX + window.scrollX;
      mouseY = e.clientY + window.scrollY;
    });

    function animateSpotlight() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorSpotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateSpotlight);
    }
    requestAnimationFrame(animateSpotlight);
  }

  // Bento Card Spotlight on Mousemove
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ============================================================================
  // 3. 3D HERO CANVAS (THREE.JS WITH ROBUST FALLBACK)
  // ============================================================================
  const heroCanvasContainer = document.getElementById('hero-3d-canvas');
  if (heroCanvasContainer) {
    if (window.THREE) {
      initThreeJSHero(heroCanvasContainer);
    } else {
      initCanvas2DFallback(heroCanvasContainer);
    }
  }

  function initThreeJSHero(container) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 45;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Particle Constellation
      const particleCount = 450;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorCyan = new THREE.Color(0x00f0ff);
      const colorOrange = new THREE.Color(0xff6b00);
      const colorWhite = new THREE.Color(0xffffff);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Distribute in a spherical cloud with dual energy poles
        const radius = 22 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Color interpolation: Cyan vs Orange based on X position
        const mixedColor = positions[i3] > 0 ? colorOrange.clone().lerp(colorWhite, Math.random() * 0.4) : colorCyan.clone().lerp(colorWhite, Math.random() * 0.4);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Particle Material
      const material = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Inner Wireframe Icosahedron (Core Geometry)
      const icoGeometry = new THREE.IcosahedronGeometry(12, 1);
      const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
      scene.add(icoMesh);

      // Secondary Inner Ring (Orange Energy)
      const torusGeo = new THREE.TorusGeometry(16, 0.4, 16, 100);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.rotation.x = Math.PI / 3;
      scene.add(torusMesh);

      // Mouse Parallax
      let targetX = 0;
      let targetY = 0;
      window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      });

      // Resize Handler
      window.addEventListener('resize', () => {
        if (!container.clientHeight) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });

      // Animation Loop
      function animate() {
        requestAnimationFrame(animate);

        particleSystem.rotation.y += 0.0018;
        particleSystem.rotation.x += 0.0009;

        icoMesh.rotation.y -= 0.0025;
        icoMesh.rotation.z += 0.0012;

        torusMesh.rotation.z -= 0.003;
        torusMesh.rotation.x += 0.001;

        // Smooth camera tilt
        camera.position.x += (targetX * 25 - camera.position.x) * 0.05;
        camera.position.y += (-targetY * 25 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animate();
    } catch (err) {
      console.warn('Three.js init error, falling back to 2D Canvas:', err);
      initCanvas2DFallback(container);
    }
  }

  function initCanvas2DFallback(container) {
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = canvas.width = container.clientWidth;
    let height = canvas.height = container.clientHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    });

    const particles = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        color: i % 2 === 0 ? '#00f0ff' : '#ff6b00',
        radius: Math.random() * 2 + 1
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Connect near nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(render);
    }
    render();
  }

  // ============================================================================
  // 4. FIGMA TO LIVE WEBSITE TRANSFORMER
  // ============================================================================
  const splitStage = document.getElementById('split-stage');
  const splitSlider = document.getElementById('split-slider');
  const liveSide = document.getElementById('live-side');

  let isDraggingSplit = false;

  function updateSplitPosition(clientX) {
    if (!splitStage || !splitSlider || !liveSide) return;
    const rect = splitStage.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(5, Math.min(95, percentage));

    splitSlider.style.left = `${percentage}%`;
    liveSide.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
  }

  if (splitSlider && splitStage) {
    splitSlider.addEventListener('mousedown', (e) => {
      isDraggingSplit = true;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      isDraggingSplit = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSplit) return;
      updateSplitPosition(e.clientX);
    });

    // Touch support for mobile/tablets
    splitSlider.addEventListener('touchstart', (e) => {
      isDraggingSplit = true;
    });
    window.addEventListener('touchend', () => {
      isDraggingSplit = false;
    });
    window.addEventListener('touchmove', (e) => {
      if (!isDraggingSplit || !e.touches[0]) return;
      updateSplitPosition(e.touches[0].clientX);
    });
  }

  // Split View Mode Toggle Buttons
  const btnModeSplit = document.getElementById('view-mode-split');
  const btnModeFigma = document.getElementById('view-mode-figma');
  const btnModeLive = document.getElementById('view-mode-live');

  function setTransformerMode(mode) {
    [btnModeSplit, btnModeFigma, btnModeLive].forEach(b => {
      if (b) {
        b.classList.remove('bg-neon-cyan', 'text-obsidian-950', 'font-semibold');
        b.classList.add('text-slate-300');
      }
    });

    if (mode === 'split') {
      btnModeSplit.classList.add('bg-neon-cyan', 'text-obsidian-950', 'font-semibold');
      btnModeSplit.classList.remove('text-slate-300');
      splitSlider.style.display = 'block';
      splitSlider.style.left = '50%';
      liveSide.style.clipPath = 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';
    } else if (mode === 'figma') {
      btnModeFigma.classList.add('bg-neon-cyan', 'text-obsidian-950', 'font-semibold');
      btnModeFigma.classList.remove('text-slate-300');
      splitSlider.style.display = 'none';
      liveSide.style.clipPath = 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
    } else if (mode === 'live') {
      btnModeLive.classList.add('bg-neon-cyan', 'text-obsidian-950', 'font-semibold');
      btnModeLive.classList.remove('text-slate-300');
      splitSlider.style.display = 'none';
      liveSide.style.clipPath = 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)';
    }
    playChirp();
  }

  if (btnModeSplit) btnModeSplit.addEventListener('click', () => setTransformerMode('split'));
  if (btnModeFigma) btnModeFigma.addEventListener('click', () => setTransformerMode('figma'));
  if (btnModeLive) btnModeLive.addEventListener('click', () => setTransformerMode('live'));

  // Preset Layout Selector Switcher
  const presetData = {
    saas: {
      filename: 'Apex_Design_System_v2.fig',
      title: 'The Operating System <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-orange">For Deep Neural Scale.</span>',
      desc: 'Harness ultra-fast distributed compute clusters with real-time GPU telemetry, instant failover, and zero-latency synthesis.'
    },
    luxury: {
      filename: 'Chronos_Haute_Horology_Master.fig',
      title: 'Mechanical Mastery <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-amber-300 to-white">Transcending Time.</span>',
      desc: 'Swiss precision engineering meets spatial digital craftsmanship. Explore bespoke haute horology with interactive movement anatomy.'
    },
    metaverse: {
      filename: 'Omni_Spatial_Showroom_3D.fig',
      title: 'Zero Latency Worlds <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-neon-cyan to-white">In Pure Spatial WebGPU.</span>',
      desc: 'Next-generation metaverse spatial architectures rendering photorealistic procedural physics at silky smooth 120 FPS.'
    }
  };

  const presetButtons = document.querySelectorAll('.preset-btn');
  const figmaFilename = document.getElementById('figma-filename');
  const livePresetTitle = document.getElementById('live-preset-title');
  const livePresetDesc = document.getElementById('live-preset-desc');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => {
        b.classList.remove('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
        b.classList.add('border-white/10', 'bg-white/[0.03]', 'text-slate-400');
      });

      btn.classList.add('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
      btn.classList.remove('border-white/10', 'bg-white/[0.03]', 'text-slate-400');

      const presetKey = btn.dataset.preset;
      const data = presetData[presetKey];
      if (data) {
        if (figmaFilename) figmaFilename.textContent = data.filename;
        if (livePresetTitle) livePresetTitle.innerHTML = data.title;
        if (livePresetDesc) livePresetDesc.textContent = data.desc;
      }
      playChirp();
    });
  });

  // ============================================================================
  // 5. WEB DEVELOPMENT: CODE TO BROWSER ENGINE
  // ============================================================================
  const codeSnippets = {
    component: `// InteractiveCard.tsx — High-Performance Reactive WebGL Component
import React, { useState, useTransition } from 'react';
import { useFrame } from '@react-three/fiber';

export const QuantumNode: React.FC<{ velocity: number }> = ({ velocity }) => {
  const [pulseCount, setPulseCount] = useState(12);
  const [isPending, startTransition] = useTransition();

  const handleDispatch = () => {
    startTransition(() => {
      setPulseCount((prev) => prev + 1);
    });
  };

  return (
    <div className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-obsidian-950 to-slate-900 shadow-glow-cyan">
      <div className="flex justify-between items-center">
        <h4 className="font-display font-bold text-white">Quantum Node #84</h4>
        <span className="px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 text-xs font-mono">SYNCED</span>
      </div>
      <p className="text-slate-400 text-xs mt-2">Target Velocity: {velocity} MHz</p>
      <button onClick={handleDispatch} className="mt-4 px-4 py-2 bg-gradient-to-r from-neon-cyan to-blue-600 rounded-xl text-black font-bold">
        Dispatch Pulse ({pulseCount})
      </button>
    </div>
  );
};`,
    shader: `// GlowShader.frag — Custom Raymarching GLSL Fragment Shader
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCyanColor;
uniform vec3 uOrangeColor;

varying vec2 vUv;

float sphereSDF(vec3 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
  vec3 col = vec3(0.02, 0.03, 0.06);

  float d = length(uv);
  float glow1 = 0.05 / (d + 0.05) * sin(uTime * 1.5);
  float glow2 = 0.04 / (length(uv - vec2(0.2, 0.1)) + 0.04);

  vec3 finalColor = glow1 * uCyanColor + glow2 * uOrangeColor;
  gl_FragColor = vec4(finalColor, 1.0);
}`,
    state: `// useTelemetry.ts — Realtime WebSocket State Store
import { create } from 'zustand';

interface TelemetryState {
  fps: number;
  activeShaders: boolean;
  pulseCount: number;
  setFps: (fps: number) => void;
  toggleShaders: () => void;
  incrementPulse: () => void;
}

export const useTelemetry = create<TelemetryState>((set) => ({
  fps: 120,
  activeShaders: true,
  pulseCount: 12,
  setFps: (fps) => set({ fps }),
  toggleShaders: () => set((state) => ({ activeShaders: !state.activeShaders })),
  incrementPulse: () => set((state) => ({ pulseCount: state.pulseCount + 1 }))
}));`
  };

  const codeDisplay = document.getElementById('code-snippet-display');
  const activeFilename = document.getElementById('active-filename');
  const codeTabs = document.querySelectorAll('.code-tab');
  const runCompileBtn = document.getElementById('run-compile-btn');
  const compilerFlash = document.getElementById('compiler-flash');
  const hmrStatus = document.getElementById('hmr-status');

  function renderSyntaxHighlighted(code) {
    if (!codeDisplay) return;
    // Simple fast syntax color tokenizer
    const safe = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const highlighted = safe
      .replace(/(\/\/.+)/g, '<span class="token-comment">$1</span>')
      .replace(/\b(import|export|const|return|from|default|interface|float|uniform|varying|void|precision|vec2|vec3|vec4)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/\b(React|useState|useTransition|useFrame|FC|QuantumNode|create|TelemetryState)\b/g, '<span class="token-type">$1</span>')
      .replace(/('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g, '<span class="token-string">$1</span>')
      .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="token-func">$1</span>');

    codeDisplay.innerHTML = highlighted;
  }

  // Initial code load
  renderSyntaxHighlighted(codeSnippets.component);

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => {
        t.classList.remove('active', 'border-neon-orange', 'bg-neon-orange/15', 'text-white');
        t.classList.add('border-white/10', 'bg-white/[0.03]', 'text-slate-400');
      });
      tab.classList.add('active', 'border-neon-orange', 'bg-neon-orange/15', 'text-white');
      tab.classList.remove('border-white/10', 'bg-white/[0.03]', 'text-slate-400');

      const snippetKey = tab.dataset.snippet;
      if (snippetKey === 'component') {
        activeFilename.textContent = 'InteractiveCard.tsx';
        renderSyntaxHighlighted(codeSnippets.component);
      } else if (snippetKey === 'shader') {
        activeFilename.textContent = 'GlowShader.frag';
        renderSyntaxHighlighted(codeSnippets.shader);
      } else if (snippetKey === 'state') {
        activeFilename.textContent = 'useTelemetry.ts';
        renderSyntaxHighlighted(codeSnippets.state);
      }
      playChirp();
    });
  });

  // Recompile Trigger
  if (runCompileBtn) {
    runCompileBtn.addEventListener('click', () => {
      if (compilerFlash) {
        compilerFlash.classList.remove('opacity-0');
        compilerFlash.classList.add('opacity-100');
        playTone(720, 'sine', 0.25, 0.08);

        setTimeout(() => {
          compilerFlash.classList.remove('opacity-100');
          compilerFlash.classList.add('opacity-0');
          if (hmrStatus) {
            const ms = Math.floor(Math.random() * 12) + 8;
            hmrStatus.textContent = `Hot reloaded in ${ms}ms`;
          }
        }, 450);
      }
    });
  }

  // Interactive Micro-App Controls inside the Simulated Browser
  const microSlider = document.getElementById('micro-slider');
  const microVelocityVal = document.getElementById('micro-velocity-val');
  const microShaderToggle = document.getElementById('micro-shader-toggle');
  const microActionBtn = document.getElementById('micro-action-btn');
  const microCounterBadge = document.getElementById('micro-counter-badge');
  const workingMicroApp = document.getElementById('working-micro-app');

  let pulses = 12;
  let shadersActive = true;

  if (microSlider && microVelocityVal) {
    microSlider.addEventListener('input', (e) => {
      microVelocityVal.textContent = `${e.target.value} MHz`;
    });
  }

  if (microShaderToggle) {
    microShaderToggle.addEventListener('click', () => {
      shadersActive = !shadersActive;
      if (shadersActive) {
        microShaderToggle.textContent = 'ACTIVE';
        microShaderToggle.className = 'px-2.5 py-1 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 text-[10px] font-bold';
        workingMicroApp.classList.add('shadow-glow-cyan');
      } else {
        microShaderToggle.textContent = 'BYPASS';
        microShaderToggle.className = 'px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/10 text-[10px] font-bold';
        workingMicroApp.classList.remove('shadow-glow-cyan');
      }
      playTone(520, 'sine', 0.05);
    });
  }

  if (microActionBtn && microCounterBadge) {
    microActionBtn.addEventListener('click', () => {
      pulses++;
      microCounterBadge.querySelector('span').textContent = pulses;
      playChirp();

      // Trigger ripple bounce
      workingMicroApp.classList.add('scale-[1.03]');
      setTimeout(() => {
        workingMicroApp.classList.remove('scale-[1.03]');
      }, 150);
    });
  }

  // Browser Viewport Switcher
  const viewportButtons = document.querySelectorAll('.viewport-btn');
  const browserCanvasArea = document.getElementById('browser-canvas-area');

  viewportButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      viewportButtons.forEach(b => {
        b.classList.remove('active', 'text-neon-cyan');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'text-neon-cyan');
      btn.classList.remove('text-slate-400');

      const vp = btn.dataset.viewport;
      workingMicroApp.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-desktop');
      if (vp === 'mobile') {
        workingMicroApp.classList.add('viewport-mobile');
      } else if (vp === 'tablet') {
        workingMicroApp.classList.add('viewport-tablet');
      } else {
        workingMicroApp.classList.add('viewport-desktop');
      }
      playTone(480, 'sine', 0.06);
    });
  });

  // Browser Reload button
  const browserReloadBtn = document.getElementById('browser-reload-btn');
  if (browserReloadBtn) {
    browserReloadBtn.addEventListener('click', () => {
      browserReloadBtn.classList.add('rotate-180');
      if (compilerFlash) {
        compilerFlash.classList.remove('opacity-0');
        compilerFlash.classList.add('opacity-100');
        setTimeout(() => {
          compilerFlash.classList.remove('opacity-100');
          compilerFlash.classList.add('opacity-0');
          browserReloadBtn.classList.remove('rotate-180');
        }, 350);
      }
    });
  }

  // ============================================================================
  // 6. INTERACTIVE OUR PROCESS PIPELINE
  // ============================================================================
  const processData = {
    1: {
      phaseNum: 'PHASE 01',
      title: 'Quantum Discovery & Architectural Strategy',
      time: '1 - 2 Weeks',
      deliverables: [
        '• Technical Architecture Specification',
        '• Competitor Conversion Benchmark',
        '• Design Language System Blueprint'
      ],
      tooling: [
        '• Figma Enterprise &bull; FigJam',
        '• Linear &bull; Notion Architecture Hub',
        '• Lighthouse Performance Benchmarking'
      ],
      touchpoints: 'Weekly asynchronous video walkthroughs + two deep-dive collaborative alignment sessions with your core team.'
    },
    2: {
      phaseNum: 'PHASE 02',
      title: 'Visual Engineering & Design Systems',
      time: '2 - 3 Weeks',
      deliverables: [
        '• Multi-Theme Figma Design Tokens',
        '• High-Fidelity Responsive Prototypes',
        '• Custom 3D Asset Modeling & Shaders'
      ],
      tooling: [
        '• Figma Variables & Token Studio',
        '• Blender 3D & Spline Engine',
        '• After Effects / Rive Motion Assets'
      ],
      touchpoints: 'Interactive Figma review links with embedded comment threads and prototype walk-through sessions.'
    },
    3: {
      phaseNum: 'PHASE 03',
      title: 'Fullstack Next-Gen Engineering',
      time: '3 - 5 Weeks',
      deliverables: [
        '• Next.js 15 App Router Codebase',
        '• Three.js 60fps GPU WebGL Canvases',
        '• Headless CMS & Dynamic Routing'
      ],
      tooling: [
        '• TypeScript & Tailwind CSS',
        '• React Three Fiber & WebGL',
        '• Vercel Edge Runtime & Turbopack'
      ],
      touchpoints: 'Staging environment deployed on commit with preview URLs for continuous stakeholder testing.'
    },
    4: {
      phaseNum: 'PHASE 04',
      title: 'QA, Speed Hardening & WCAG Audits',
      time: '1 - 2 Weeks',
      deliverables: [
        '• 99+ Core Web Vitals Certification',
        '• Full Cross-Browser & Device Matrix',
        '• Accessibility Compliance (WCAG AAA)'
      ],
      tooling: [
        '• Playwright E2E Automated Suites',
        '• Chrome DevTools CPU Throttling',
        '• Axe Accessibility Engine'
      ],
      touchpoints: 'Comprehensive audit report and stress-test performance documentation.'
    },
    5: {
      phaseNum: 'PHASE 05',
      title: 'Global Edge Deployment & Hyper-Scale',
      time: 'Ongoing / Q4',
      deliverables: [
        '• Worldwide Edge CDN Distribution',
        '• Zero-Downtime CI/CD Blue/Green Pipeline',
        '• Real-Time Telemetry & Conversion Analytics'
      ],
      tooling: [
        '• Cloudflare Workers / Vercel Edge',
        '• Datadog & PostHog Telemetry',
        '• GitHub Actions CI/CD Pipeline'
      ],
      touchpoints: '24/7 incident monitoring with dedicated Slack/Discord war room channel for your engineering leads.'
    }
  };

  const processNodes = document.querySelectorAll('.process-node');
  const hudPhaseNum = document.getElementById('hud-phase-num');
  const hudPhaseTitle = document.getElementById('hud-phase-title');
  const hudPhaseTime = document.getElementById('hud-phase-time');
  const hudDeliverables = document.getElementById('hud-deliverables');
  const hudTooling = document.getElementById('hud-tooling');
  const hudTouchpoints = document.getElementById('hud-touchpoints');

  processNodes.forEach(node => {
    node.addEventListener('click', () => {
      processNodes.forEach(n => {
        n.classList.remove('active', 'border-neon-cyan', 'shadow-glow-cyan/20');
        n.classList.add('border-white/10');
      });
      node.classList.add('active', 'border-neon-cyan', 'shadow-glow-cyan/20');
      node.classList.remove('border-white/10');

      const phaseKey = node.dataset.phase;
      const data = processData[phaseKey];
      if (data) {
        if (hudPhaseNum) hudPhaseNum.textContent = data.phaseNum;
        if (hudPhaseTitle) hudPhaseTitle.textContent = data.title;
        if (hudPhaseTime) hudPhaseTime.textContent = data.time;
        if (hudDeliverables) {
          hudDeliverables.innerHTML = data.deliverables.map(d => `<li>${d}</li>`).join('');
        }
        if (hudTooling) {
          hudTooling.innerHTML = data.tooling.map(t => `<li>${t}</li>`).join('');
        }
        if (hudTouchpoints) hudTouchpoints.textContent = data.touchpoints;
      }
      playChirp();
    });
  });

  // ============================================================================
  // 7. FEATURED PROJECTS FILTERING
  // ============================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
        b.classList.add('border-white/10', 'bg-white/[0.03]', 'text-slate-400');
      });
      btn.classList.add('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
      btn.classList.remove('border-white/10', 'bg-white/[0.03]', 'text-slate-400');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const cat = card.dataset.category || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          card.classList.remove('opacity-0', 'scale-95');
          card.classList.add('opacity-100', 'scale-100');
        } else {
          card.style.display = 'none';
          card.classList.remove('opacity-100', 'scale-100');
          card.classList.add('opacity-0', 'scale-95');
        }
      });
      playTone(440, 'sine', 0.05);
    });
  });

  // ============================================================================
  // 8. TECHNOLOGIES FILTERING
  // ============================================================================
  const techFilterButtons = document.querySelectorAll('.tech-filter-btn');
  const techNodes = document.querySelectorAll('.tech-node');

  techFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      techFilterButtons.forEach(b => {
        b.classList.remove('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
        b.classList.add('border-white/10', 'bg-white/[0.03]', 'text-slate-400');
      });
      btn.classList.add('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
      btn.classList.remove('border-white/10', 'bg-white/[0.03]', 'text-slate-400');

      const cat = btn.dataset.cat;
      techNodes.forEach(node => {
        const nodeCat = node.dataset.cat || '';
        if (cat === 'all' || nodeCat === cat) {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      });
      playTone(480, 'sine', 0.05);
    });
  });

  // ============================================================================
  // 9. REAL-TIME PROJECT SCOPE & BUDGET ESTIMATOR
  // ============================================================================
  const scopeButtons = document.querySelectorAll('.scope-btn');
  const scaleSlider = document.getElementById('scale-slider');
  const scaleLabel = document.getElementById('scale-label');
  const estimatedPrice = document.getElementById('estimated-price');
  const estimatedTime = document.getElementById('estimated-time');

  let currentMultiplier = 1.0;
  const scaleTierData = {
    1: { label: '1 - 3 Pages (MVP Launch)', baseMin: 9000, baseMax: 14000, weeks: '2 - 3 Weeks' },
    2: { label: '5 - 10 Pages (Mid Flagship)', baseMin: 18000, baseMax: 28000, weeks: '4 - 6 Weeks' },
    3: { label: '12 - 25 Pages (Enterprise Platform)', baseMin: 32000, baseMax: 54000, weeks: '7 - 10 Weeks' },
    4: { label: 'Global Spatial Web Ecosystem', baseMin: 60000, baseMax: 110000, weeks: '12 - 16 Weeks' }
  };

  function updateEstimator() {
    if (!scaleSlider || !scaleLabel || !estimatedPrice || !estimatedTime) return;
    const tier = scaleSlider.value;
    const tierInfo = scaleTierData[tier];

    scaleLabel.textContent = tierInfo.label;
    const finalMin = Math.round((tierInfo.baseMin * currentMultiplier) / 1000) * 1000;
    const finalMax = Math.round((tierInfo.baseMax * currentMultiplier) / 1000) * 1000;

    estimatedPrice.textContent = `$${finalMin.toLocaleString()} - $${finalMax.toLocaleString()}`;
    estimatedTime.textContent = tierInfo.weeks;
  }

  scopeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scopeButtons.forEach(b => {
        b.classList.remove('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
        b.classList.add('border-white/10', 'bg-black/40', 'text-slate-300');
      });
      btn.classList.add('active', 'border-neon-cyan', 'bg-neon-cyan/15', 'text-white');
      btn.classList.remove('border-white/10', 'bg-black/40', 'text-slate-300');

      currentMultiplier = parseFloat(btn.dataset.multiplier) || 1.0;
      updateEstimator();
      playTone(560, 'sine', 0.05);
    });
  });

  if (scaleSlider) {
    scaleSlider.addEventListener('input', () => {
      updateEstimator();
    });
  }

  // ============================================================================
  // 10. SERVICES DELIVERABLES DIALOG MODAL
  // ============================================================================
  const serviceModal = document.getElementById('service-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalDesc = document.getElementById('modal-description');
  const modalDeliverables = document.getElementById('modal-deliverables');

  const servicesSpecs = {
    uiux: {
      tag: 'Creative Direction & Architecture',
      title: 'UI/UX & Design Systems',
      desc: 'End-to-end design engineering that binds Figma variable modes directly to Tailwind and CSS custom properties. Every component is audited for maximum contrast, WCAG AAA readability, and emotional engagement.',
      items: [
        'Atomic Figma Component Library',
        'Color & Spacing Token Architecture',
        'Fluid Typography Scales',
        'Interactive Figma Motion Prototypes',
        'User Journey & Conversion Maps',
        'Multi-Device Responsive Artboards'
      ]
    },
    dev: {
      tag: 'Next-Gen Frontend Engineering',
      title: 'React, Next.js & TypeScript',
      desc: 'Crafted with the modern Next.js 15 App Router, React Server Components, streaming SSR, and edge middleware. We eliminate unnecessary client bundle dependencies to achieve sub-second TTFB globally.',
      items: [
        'Strict TypeScript Architecture',
        'Next.js 15 Server Components',
        'Tailwind CSS Token Binding',
        'Headless CMS (Sanity / Strapi)',
        'Edge API Routes & Microservices',
        'Global CDN Caching Protocols'
      ]
    },
    webgl: {
      tag: 'Immersive 3D Experiences',
      title: 'Three.js & WebGPU 3D Engine',
      desc: 'Breathtaking 3D product configurations and spatial storytelling worlds that run at a verified 60fps on modern mobile and desktop browsers using custom GLSL shaders and GPU compute pipelines.',
      items: [
        'Custom GLSL Fragment & Vertex Shaders',
        'Interactive Raymarching Physics',
        '3D Blender Asset Optimization (Draco)',
        'Spatial Audio Soundscape Integration',
        'WebGPU Fallback Pipeline',
        'Mobile Battery-Conscious Throttling'
      ]
    },
    speed: {
      tag: 'Performance Engineering',
      title: 'Core Web Vitals & Optimization',
      desc: 'We transform bloated web platforms into lightning-fast flagships. Guaranteed 95+ scores across all Lighthouse metrics with sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS).',
      items: [
        '100/100 Lighthouse Performance Audit',
        'Sub-500ms Largest Contentful Paint (LCP)',
        'Zero Cumulative Layout Shift (CLS)',
        'Modern AVIF / WebP Asset Compression',
        'Font Prefetching & Subsetting',
        'Edge Worker Cache Rules'
      ]
    },
    saas: {
      tag: 'Platform Architecture',
      title: 'SaaS & Web Applications',
      desc: 'Robust software platforms designed for high concurrent throughput. Includes secure multi-tenant authentication, real-time WebSocket state synchronization, and enterprise-grade billing integrations.',
      items: [
        'Supabase / PostgreSQL Schema Design',
        'Stripe Billing & Subscriptions',
        'Real-Time WebSocket Presence',
        'Role-Based Access Control (RBAC)',
        'Custom Interactive Analytics Dashboards',
        'Automated CI/CD Deployment'
      ]
    },
    ai: {
      tag: 'Generative AI Interfaces',
      title: 'AI-Enhanced Digital Experiences',
      desc: 'Bridging modern web frontends with cutting-edge LLMs and multimodal models. Implement low-latency streaming markdown responses, vector semantic search, and autonomous interface personalizations.',
      items: [
        'Vercel AI SDK & Gemini API Integration',
        'Streaming Realtime Chat Interfaces',
        'Vector Embeddings & Semantic Search',
        'Dynamic Algorithmic Layout Feeds',
        'Function Calling & Tool Orchestration',
        'Latency & Token Optimization'
      ]
    }
  };

  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.dataset.service;
      const data = servicesSpecs[serviceKey];
      if (data && serviceModal) {
        modalTitle.textContent = data.title;
        modalTag.textContent = data.tag;
        modalDesc.textContent = data.desc;
        modalDeliverables.innerHTML = data.items.map(i => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>${i}</li>`).join('');
        serviceModal.showModal();
        playChirp();
      }
    });
  });

  if (modalCloseBtn && serviceModal) {
    modalCloseBtn.addEventListener('click', () => {
      serviceModal.close();
    });
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        serviceModal.close();
      }
    });
  }

  // ============================================================================
  // 11. CONTACT FORM HANDLING
  // ============================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!submitBtn) return;

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
        <span>Encrypting Transmission...</span>
      `;
      if (window.lucide) lucide.createIcons();

      playTone(660, 'sine', 0.2);

      setTimeout(() => {
        submitBtn.innerHTML = `
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-300"></i>
          <span>Transmission Confirmed</span>
        `;
        if (window.lucide) lucide.createIcons();

        if (formFeedback) {
          formFeedback.classList.remove('hidden');
          formFeedback.innerHTML = `
            <div class="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
              ✓ Transmission received. Soren &amp; Elena will review your brief within 24 hours. A copy has been dispatched to your email.
            </div>
          `;
        }
        playChirp();
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          if (window.lucide) lucide.createIcons();
        }, 5000);
      }, 1400);
    });
  }

  // ============================================================================
  // 12. ANIMATED STATISTIC COUNTERS (INTERSECTION OBSERVER)
  // ============================================================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeOut;

            counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    counterObserver.observe(heroSection);
  }

  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      playTone(400, 'sine', 0.05);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Header Background Blur on Scroll
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add('bg-obsidian-950/90', 'shadow-2xl');
      mainHeader.classList.remove('bg-obsidian-900/60');
    } else {
      mainHeader.classList.remove('bg-obsidian-950/90', 'shadow-2xl');
      mainHeader.classList.add('bg-obsidian-900/60');
    }
  });

});
