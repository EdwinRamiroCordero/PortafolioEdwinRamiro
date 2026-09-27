import * as THREE from 'three';

// Escena de partículas que se transforma entre formas (esfera → escudo → anillo → galaxia).
const N = window.innerWidth < 700 ? 4200 : 8000;

function sphere() {
  const a = new Float32Array(N * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = g * i;
    const R = 1.7 + (Math.random() - 0.5) * 0.06;
    a.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3);
  }
  return a;
}

function inShield(x, y) {
  if (y > 1.25 - 0.18 * x * x) return false;
  if (y >= 0) return Math.abs(x) <= 1.25;
  const k = 1 - Math.pow(-y / 1.75, 1.6);
  return Math.abs(x) <= 1.25 * Math.max(0, k);
}

function shield() {
  const a = new Float32Array(N * 3);
  let i = 0;
  // 35% contorno (borde nítido), 65% relleno curvo
  const edge = Math.floor(N * 0.35);
  while (i < edge) {
    const t = Math.random();
    let x, y;
    if (t < 0.25) { x = (Math.random() * 2 - 1) * 1.25; y = 1.25 - 0.18 * x * x; }
    else { const side = Math.random() < 0.5 ? -1 : 1; y = 1.25 - Math.random() * 3; const yy = Math.min(y, 0); const k = y >= 0 ? 1 : Math.max(0, 1 - Math.pow(-yy / 1.75, 1.6)); x = side * 1.25 * k; }
    const z = -0.35 * x * x + (Math.random() - 0.5) * 0.04;
    a.set([x * 1.15, y * 1.15, z], i * 3); i++;
  }
  while (i < N) {
    const x = (Math.random() * 2 - 1) * 1.25, y = Math.random() * 3 - 1.75;
    if (!inShield(x, y)) continue;
    const ridge = Math.abs(x) < 0.03 ? 0.08 : 0;
    const z = -0.35 * x * x + ridge + (Math.random() - 0.5) * 0.05;
    a.set([x * 1.15, y * 1.15, z], i * 3); i++;
  }
  return a;
}

function knot() {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const p = 2, q = 3;
    const r = 1.1 + 0.45 * Math.cos(q * t);
    const base = [r * Math.cos(p * t), r * Math.sin(p * t), 0.45 * Math.sin(q * t)];
    const j = 0.12;
    a.set([base[0] + (Math.random() - 0.5) * j, base[1] + (Math.random() - 0.5) * j, base[2] + (Math.random() - 0.5) * j], i * 3);
  }
  return a;
}

function galaxy() {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const arm = i % 3;
    const r = Math.pow(Math.random(), 0.7) * 3.2;
    const ang = r * 1.6 + (arm * Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.5;
    a.set([Math.cos(ang) * r, (Math.random() - 0.5) * 0.25 * (3.2 - r) * 0.4, Math.sin(ang) * r], i * 3);
  }
  return a;
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const shapes = [sphere(), shield(), knot(), galaxy()];
  const phase = new Float32Array(N).map(() => Math.random() * Math.PI * 2);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(shapes[0]);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const b = 0.55 + Math.random() * 0.45; col.set([b, b, b], i * 3); }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.035, map: dotTexture(), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, vertexColors: true, color: new THREE.Color('#22d3ee'),
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  // Anillo orbital decorativo
  const ringGeo = new THREE.RingGeometry(2.55, 2.56, 160);
  const ringMat = new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.3;
  group.add(ring);

  // Estrellas de fondo
  const sGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(1500 * 3).map(() => (Math.random() - 0.5) * 40);
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ size: 0.02, color: '#94a3b8', transparent: true, opacity: 0.6 }));
  scene.add(stars);

  const state = { s: 0, x: 0, y: 0, scale: 1 };
  const target = { color: new THREE.Color('#22d3ee') };
  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const smooth = (t) => t * t * (3 - 2 * t);
  let raf, visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) loop(); });
  const t0 = performance.now();

  function loop() {
    if (!visible) return;
    const t = (performance.now() - t0) / 1000;
    const i0 = Math.floor(state.s), i1 = Math.min(shapes.length - 1, i0 + 1);
    const f = smooth(state.s - i0);
    const A = shapes[i0], B = shapes[i1];
    for (let i = 0; i < N; i++) {
      const k = i * 3, w = 0.018 * Math.sin(t * 1.4 + phase[i]);
      pos[k] = A[k] + (B[k] - A[k]) * f + w;
      pos[k + 1] = A[k + 1] + (B[k + 1] - A[k + 1]) * f + w;
      pos[k + 2] = A[k + 2] + (B[k + 2] - A[k + 2]) * f;
    }
    geo.attributes.position.needsUpdate = true;
    mat.color.lerp(target.color, 0.05);
    ringMat.color.copy(mat.color);

    group.position.x += (state.x - group.position.x) * 0.06;
    group.position.y += (state.y - group.position.y) * 0.06;
    group.scale.setScalar(group.scale.x + (state.scale - group.scale.x) * 0.06);
    group.rotation.y = Math.sin(t * 0.25) * 0.55 + mouse.x * 0.6;
    group.rotation.x = mouse.y * 0.4 + Math.max(0, state.s - 2) * 0.85;
    ring.rotation.z = t * 0.2;
    stars.rotation.y = t * 0.01;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  loop();

  return {
    state,
    setColor(hex) { target.color.set(hex); },
    destroy() { cancelAnimationFrame(raf); renderer.dispose(); },
  };
}
