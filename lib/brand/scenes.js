// Mustard Bio 3D asset library. Palette = Mustard Bio tokens; material language: clear lab glass,
// glass-sphere molecule chains, frosted metaballs, soft studio light, shallow contrast.
import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const C = {
  charcoal: '#222F30', deepsea: '#445E5F', sage: '#C9CBBE', lime: '#A7E26E', mint: '#CEF79E',
  offwhite: '#F7F7F5', g1: '#EEEEEE', g2: '#E4E3E3', stone: '#E7E8E1', frost: '#F5F8F7',
};

// ---------- studio helpers ----------
export function studioEnv(renderer, tint = '#ffffff') {
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#5d6766'), side: THREE.BackSide }));
  s.add(room);
  const panel = (w, h, x, y, z, k, col = tint) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m);
  };
  panel(14, 3, 0, 12, 4, 6);           // overhead strip
  panel(3, 12, -12, 2, 4, 4);          // left strip
  panel(3, 12, 12, 2, -2, 3);          // right strip
  panel(10, 10, 0, 2, 14, 1.6);        // fill
  panel(16, 4, 0, -10, 0, 0.6, '#cfe8b8'); // lime-tinted bounce from below
  const pm = new THREE.PMREMGenerator(renderer);
  return pm.fromScene(s, 0.02).texture;
}

export function gradientTex(stops, { type = 'linear', w = 1024, h = 1024, cx = 0.5, cy = 0.5, r = 0.75, angle = 90, noise = 0.025 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  let gr;
  if (type === 'radial') gr = g.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, r * Math.max(w, h));
  else { const a = angle * Math.PI / 180; const dx = Math.cos(a) * w / 2, dy = Math.sin(a) * h / 2; gr = g.createLinearGradient(w / 2 - dx, h / 2 - dy, w / 2 + dx, h / 2 + dy); }
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  if (noise) { const d = g.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * 255 * noise; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } g.putImageData(d, 0, 0); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const glass = (o = {}) => new THREE.MeshPhysicalMaterial({
  color: o.color || '#ffffff', transmission: 1, roughness: o.roughness ?? 0.04, thickness: o.thickness ?? 0.6, ior: o.ior ?? 1.5,
  attenuationColor: new THREE.Color(o.att || '#e9f6ee'), attenuationDistance: o.attd ?? 2.5, clearcoat: 1, clearcoatRoughness: 0.03,
  specularIntensity: 1, envMapIntensity: o.env ?? 1.2, transparent: false, side: o.side ?? THREE.FrontSide,
  iridescence: o.irid ?? 0, iridescenceIOR: 1.3,
});
export const frosted = (color, o = {}) => new THREE.MeshPhysicalMaterial({
  color, transmission: o.transmission ?? 0.85, roughness: o.roughness ?? 0.35, thickness: o.thickness ?? 1.2, ior: 1.45,
  attenuationColor: new THREE.Color(color), attenuationDistance: o.attd ?? 0.8, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 1.1,
});
export const solid = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: o.roughness ?? 0.45, metalness: o.metalness ?? 0, clearcoat: o.clearcoat ?? 0.3, clearcoatRoughness: 0.4, map: o.map || null, envMapIntensity: o.env ?? 1 });

export function shadowFloor(scene, y = 0, opacity = 0.14, size = 30) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity }));
  m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true; scene.add(m); return m;
}
export function keyLight(scene, pos = [3, 8, 4], intensity = 2.2, size = 6) {
  const l = new THREE.DirectionalLight('#ffffff', intensity); l.position.set(...pos); l.castShadow = true;
  l.shadow.mapSize.set(2048, 2048); l.shadow.radius = 12; l.shadow.blurSamples = 24; l.shadow.bias = -0.0005;
  Object.assign(l.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 0.1, far: 40 });
  scene.add(l); scene.add(new THREE.AmbientLight('#ffffff', 0.25)); return l;
}
// soft contact shadow sprite (works under glass, which shouldn't cast hard shadows)
export function contact(scene, x, z, sx, sz, y = 0.001, a = 0.22) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, `rgba(34,47,48,${a})`); gr.addColorStop(1, 'rgba(34,47,48,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); scene.add(m); return m;
}

// capsule half: lathe profile (hemisphere + cylinder), open at the seam
export function capsuleHalf(r, len, seg = 64) {
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r, len + Math.cos(a) * r)); }
  pts.push(new THREE.Vector2(r, 0));
  return new THREE.LatheGeometry(pts, seg);
}

// ---------- scenes ----------
// each returns { scene, camera, update?(t) }  t in seconds
export const SCENES = {

  capsule({ renderer, aspect, variant }) {
    const scene = new THREE.Scene();
    scene.environment = studioEnv(renderer);
    const dark = variant === 'dark';
    scene.background = dark
      ? gradientTex([[0, '#4f6a5c'], [0.45, C.deepsea], [1, C.charcoal]], { type: 'radial', cx: 0.62, cy: 0.38, r: 0.85 })
      : gradientTex([[0, '#ffffff'], [0.5, C.stone], [1, C.sage]], { type: 'radial', cx: 0.55, cy: 0.35, r: 0.9 });
    const g = new THREE.Group(); scene.add(g);
    const r = 0.62, len = 0.72;
    const top = new THREE.Mesh(capsuleHalf(r, len), glass({ thickness: 0.3, att: '#f2fbe9', side: THREE.DoubleSide }));
    const bot = new THREE.Mesh(capsuleHalf(r * 1.012, len), frosted(C.lime, { roughness: 0.28, transmission: 0.75, attd: 0.9 }));
    bot.rotation.x = Math.PI;
    const band = new THREE.Mesh(new THREE.TorusGeometry(r * 1.012, 0.012, 12, 96), solid(C.charcoal, { roughness: 0.3 }));
    band.rotation.x = Math.PI / 2;
    g.add(top, bot, band);
    // granules inside the clear half (the measured dose)
    const gr = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.075, 3), solid('#ffffff', { roughness: 0.6, clearcoat: 0 }), 120);
    const cols = [C.mint, '#ffffff', C.lime, C.offwhite, C.sage];
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3();
    let n = 0, guard = 0;
    while (n < 120 && guard++ < 5000) {
      p.set((Math.random() * 2 - 1) * r * 0.82, Math.random() * (len + r * 0.6), (Math.random() * 2 - 1) * r * 0.82);
      const yy = Math.max(0, p.y - len); if (p.x * p.x + p.z * p.z + yy * yy > (r * 0.82) ** 2) continue;
      const s = 0.7 + Math.random() * 0.6; sc.set(s, s, s); q.setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, 0));
      gr.setMatrixAt(n, m4.compose(p, q, sc)); gr.setColorAt(n, new THREE.Color(cols[n % cols.length])); n++;
    }
    gr.count = n; g.add(gr);
    g.rotation.z = -36.15 * Math.PI / 180;  // the capsule o's lean
    g.rotation.x = 0.35;
    const cam = new THREE.PerspectiveCamera(30, aspect, 0.1, 100); cam.position.set(0, 0.2, 6.2); cam.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight('#fff', 0.4));
    const dl = new THREE.DirectionalLight('#fff', 1.5); dl.position.set(2, 4, 3); scene.add(dl);
    return { scene, camera: cam, update(t) { const w = Math.PI * 2 / 10; g.rotation.y = t * w; g.position.y = Math.sin(t * w * 2) * 0.06; } };
  },

  mark({ renderer, aspect, variant }) {
    const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
    const light = variant === 'light';
    scene.background = light
      ? gradientTex([[0, '#ffffff'], [0.6, C.offwhite], [1, C.stone]], { type: 'radial', cx: 0.5, cy: 0.3, r: 0.9 })
      : gradientTex([[0, '#557264'], [0.5, C.deepsea], [1, '#1a2526']], { type: 'radial', cx: 0.5, cy: 0.25, r: 0.95 });
    const hs = [60, 128, 116, 104, 92, 80, 92, 104, 116, 128, 60];
    const g = new THREE.Group(); scene.add(g);
    const k = 0.012; // logo units -> scene
    const bars = [];
    hs.forEach((h, i) => {
      const w = (i === 5 ? 12 : 6) * k * 2.1, H = h * k, D = 0.5;
      const geo = new RoundedBoxGeometry(w, H, D, 4, Math.min(w, D) * 0.45);
      const mat = i === 5 ? frosted(C.lime, { roughness: 0.22, transmission: 0.7, attd: 0.5 }) : glass({ thickness: 0.4, att: light ? '#e1efe4' : '#dff3e6', attd: 1.2, roughness: 0.03 });
      const m = new THREE.Mesh(geo, mat); m.position.set((i - 5) * 22 * k, H / 2, 0); m.userData = { H, i }; g.add(m); bars.push(m);
    });
    // plinth
    const base = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.08, 0.9, 4, 0.03), solid(light ? '#ffffff' : C.charcoal, { roughness: 0.25, clearcoat: 1 }));
    base.position.y = -0.04; g.add(base);
    g.position.y = -0.75; g.rotation.y = -0.42;
    const cam = new THREE.PerspectiveCamera(28, aspect, 0.1, 100); cam.position.set(0, 1.1, 6.4); cam.lookAt(0, 0.05, 0);
    scene.add(new THREE.AmbientLight('#fff', 0.3));
    return { scene, camera: cam, update(t) {
      g.rotation.y = -0.42 + Math.sin(t * 0.5) * 0.25;
      bars.forEach(b => { const d = Math.max(0, Math.min(1, (t * 1.6 - Math.abs(b.userData.i - 5) * 0.12))); const e = 1 - Math.pow(1 - d, 4); b.scale.y = variant === 'build' ? Math.max(0.001, e) : 1; b.position.y = b.userData.H * b.scale.y / 2; });
    } };
  },

  helix({ renderer, aspect, variant }) {
    const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
    scene.background = gradientTex([[0, '#ffffff'], [0.7, C.offwhite], [1, C.g2]], { type: 'radial', cx: 0.5, cy: 0.45, r: 0.8 });
    const g = new THREE.Group(); scene.add(g);
    const N = 13, R = 0.9, pitch = 0.42, turns = 0.55;
    const core = [C.deepsea, C.charcoal, C.lime, C.deepsea, C.deepsea];
    const ballMat = glass({ thickness: 0.9, att: '#cfe3d8', attd: 0.9, roughness: 0.0, env: 1.8, irid: 0.3 });
    const strandPts = [[], []];
    for (let i = 0; i < N; i++) {
      const y = (i - (N - 1) / 2) * pitch, a = i * turns;
      for (let s = 0; s < 2; s++) {
        const aa = a + s * Math.PI, pos = new THREE.Vector3(Math.cos(aa) * R, y, Math.sin(aa) * R);
        strandPts[s].push(pos);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 48, 32), ballMat); ball.position.copy(pos); g.add(ball);
        const c = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), solid(core[(i + s * 2) % core.length], { roughness: 0.15, clearcoat: 1 })); c.position.copy(pos); g.add(c);
      }
      // rung
      const a0 = strandPts[0][i], a1 = strandPts[1][i];
      const len = a0.distanceTo(a1) - 0.5; const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, len, 16), glass({ thickness: 0.1 }));
      rung.position.copy(a0).add(a1).multiplyScalar(0.5); rung.lookAt(a1); rung.rotateX(Math.PI / 2); g.add(rung);
    }
    strandPts.forEach(pts => { const curve = new THREE.CatmullRomCurve3(pts); g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 0.05, 16), glass({ thickness: 0.15, roughness: 0.02 }))); });
    g.rotation.z = 0.5; g.rotation.x = 0.25;
    const cam = new THREE.PerspectiveCamera(30, aspect, 0.1, 100); cam.position.set(0, 0, 9.5); cam.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight('#fff', 0.5));
    return { scene, camera: cam, update(t) { g.rotation.y = t * Math.PI * 2 / 12; } };
  },

  blob({ renderer, aspect, variant }) {
    const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
    const bgs = {
      lime: [[0, '#ffffff'], [0.55, C.mint], [1, '#b9d99a']],
      sage: [[0, C.frost], [0.6, C.stone], [1, C.sage]],
      deep: [[0, '#5b7a6c'], [0.6, C.deepsea], [1, C.charcoal]],
    };
    scene.background = gradientTex(bgs[variant] || bgs.sage, { type: 'radial', cx: 0.5, cy: 0.4, r: 0.85 });
    const mat = new THREE.MeshPhysicalMaterial({ color: variant === 'deep' ? C.mint : '#ffffff', transmission: 0.92, roughness: 0.12, thickness: 1.4, ior: 1.4,
      attenuationColor: new THREE.Color(variant === 'deep' ? C.lime : C.mint), attenuationDistance: 0.9, iridescence: 0.6, iridescenceIOR: 1.25, iridescenceThicknessRange: [200, 600], clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.3 });
    const mc = new MarchingCubes(72, mat, false, false, 60000); mc.scale.setScalar(1.8); scene.add(mc);
    const cam = new THREE.PerspectiveCamera(30, aspect, 0.1, 100); cam.position.set(0, 0, 7.2); cam.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight('#fff', 0.4));
    return { scene, camera: cam, update(t) {
      mc.reset(); const n = 7, str = 0.85, sub = 12;
      for (let i = 0; i < n; i++) {
        const ph = i * 1.7, s = t * 0.5;
        const x = 0.5 + 0.2 * Math.sin(s * (0.9 + i * 0.13) + ph), y = 0.5 + 0.2 * Math.cos(s * (0.7 + i * 0.11) + ph * 1.3), z = 0.5 + 0.1 * Math.sin(s * 0.8 + i);
        mc.addBall(x, y, z, str, sub);
      }
      mc.update();
    } };
  },

  tubes({ renderer, aspect }) {
    const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
    scene.background = gradientTex([[0, '#7f9a89'], [0.35, '#55705f'], [0.7, C.deepsea], [1, C.charcoal]], { type: 'radial', cx: 0.5, cy: 0.32, r: 0.72 });
    const g = new THREE.Group(); scene.add(g);
    const fills = [0.42, 0.6, 0.78, 0.6]; const cols = [C.mint, C.lime, '#e9efd8', C.sage];
    const tubeProfile = (r, h) => { const p = []; for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI / 2; p.push(new THREE.Vector2(Math.sin(a) * r, r - Math.cos(a) * r)); } p.push(new THREE.Vector2(r, h)); p.push(new THREE.Vector2(r * 1.08, h + 0.02)); return p; };
    fills.forEach((f, i) => {
      const x = (i - 1.5) * 0.62, r = 0.2, h = 2.4;
      const tube = new THREE.Mesh(new THREE.LatheGeometry(tubeProfile(r, h), 64), glass({ thickness: 0.05, side: THREE.DoubleSide, roughness: 0.02, env: 1.5 }));
      tube.position.set(x, 0, 0); g.add(tube);
      const lh = h * f; const liq = new THREE.Mesh(new THREE.LatheGeometry(tubeProfile(r * 0.86, lh).slice(0, 14), 64), solid(cols[i], { roughness: 0.18, clearcoat: 1 }));
      liq.position.set(x, 0.015, 0); g.add(liq);
      const men = new THREE.Mesh(new THREE.CircleGeometry(r * 0.86, 48), solid(cols[i], { roughness: 0.1, clearcoat: 1 })); men.rotation.x = -Math.PI / 2; men.position.set(x, lh + 0.015, 0); g.add(men);
    });
    const rackMat = solid(C.charcoal, { roughness: 0.35, clearcoat: 0.6 });
    const plate = (y, d) => { const m = new THREE.Mesh(new RoundedBoxGeometry(2.9, 0.07, d, 3, 0.02), rackMat); m.position.y = y; g.add(m); };
    plate(-0.02, 0.8); plate(1.0, 0.6);
    [-1.4, 1.4].forEach(x => { const s = new THREE.Mesh(new RoundedBoxGeometry(0.08, 1.05, 0.6, 3, 0.02), rackMat); s.position.set(x, 0.5, 0); g.add(s); });
    g.position.y = -1.25;
    const cam = new THREE.PerspectiveCamera(30, aspect, 0.1, 100); cam.position.set(0, 0.6, 7.5); cam.lookAt(0, 0.05, 0);
    scene.add(new THREE.AmbientLight('#fff', 0.3)); const sp = new THREE.SpotLight('#fff', 40, 20, 0.5, 0.8); sp.position.set(0, 6, 3); scene.add(sp);
    return { scene, camera: cam, update(t) { g.rotation.y = Math.sin(t * 0.4) * 0.15; } };
  },

  flask({ renderer, aspect }) {
    const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
    scene.background = gradientTex([[0, '#ffffff'], [0.5, C.frost], [1, '#cfd8d2']], { angle: 90 });
    const g = new THREE.Group(); scene.add(g);
    const prof = [], rb = 1.05, hb = 1.55, rn = 0.26, hn = 0.9;
    prof.push(new THREE.Vector2(0.001, 0)); prof.push(new THREE.Vector2(rb - 0.12, 0)); prof.push(new THREE.Vector2(rb, 0.1));
    for (let i = 1; i <= 10; i++) { const t = i / 10; prof.push(new THREE.Vector2(rb + (rn - rb) * t, 0.1 + (hb - 0.1) * t)); }
    prof.push(new THREE.Vector2(rn, hb + hn)); prof.push(new THREE.Vector2(rn + 0.05, hb + hn + 0.04)); prof.push(new THREE.Vector2(rn + 0.02, hb + hn + 0.08));
    const flask = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), glass({ thickness: 0.08, side: THREE.DoubleSide, roughness: 0.02, env: 1.6 })); g.add(flask);
    const lev = 0.62; const lp = [new THREE.Vector2(0.001, 0.02), new THREE.Vector2(rb - 0.14, 0.02), new THREE.Vector2(rb * 0.95, 0.1)];
    const rAt = y => rb + (rn - rb) * ((y - 0.1) / (hb - 0.1)); lp.push(new THREE.Vector2(rAt(lev) * 0.95, lev)); lp.push(new THREE.Vector2(0.001, lev));
    g.add(new THREE.Mesh(new THREE.LatheGeometry(lp, 96), solid(C.mint, { roughness: 0.15, clearcoat: 1 })));
    // graduations: the scale from the mark, printed on the glass
    const gm = solid(C.charcoal, { roughness: 0.5, clearcoat: 0 });
    for (let i = 0; i < 9; i++) {
      const y = 0.32 + i * 0.13, r = rAt(y) + 0.004, slope = Math.atan((rb - rn) / (hb - 0.1));
      const w = i === 4 ? 0.34 : (i % 2 ? 0.14 : 0.24), th = i === 4 ? 0.022 : 0.011;
      const tick = new THREE.Mesh(new THREE.BoxGeometry(w, th, 0.004), i === 4 ? solid(C.lime, { roughness: 0.4 }) : gm);
      tick.position.set(-0.05 - w / 2 + 0.05, y, r); tick.rotation.x = -slope; tick.position.x = 0.0 + w / 2 - 0.2; g.add(tick);
    }
    contact(scene, 0, 0, 3.6, 2.2, -1.3, 0.28);
    g.position.y = -1.3; g.rotation.y = -0.3;
    const cam = new THREE.PerspectiveCamera(28, aspect, 0.1, 100); cam.position.set(0, 0.5, 7.4); cam.lookAt(0, 0.05, 0);
    scene.add(new THREE.AmbientLight('#fff', 0.5));
    return { scene, camera: cam, update(t) { g.rotation.y = -0.3 + t * 0.4; } };
  },

  tablets({ renderer, aspect }) {
    const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
    scene.background = new THREE.Color(C.stone);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), solid(C.stone, { roughness: 0.9, clearcoat: 0, env: 0.35 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    keyLight(scene, [-4, 10, 6], 3.2, 9);
    const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    const caps = [[C.charcoal, C.offwhite], [C.lime, '#ffffff'], [C.deepsea, C.mint], [C.offwhite, C.sage]];
    const tabProf = (r, h) => { const p = [new THREE.Vector2(0.001, -h)]; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (i / 10) * Math.PI; p.push(new THREE.Vector2(r - h + Math.cos(a) * h, Math.sin(a) * h)); } p.push(new THREE.Vector2(0.001, h)); return p; };
    const tabGeo = new THREE.LatheGeometry(tabProf(0.32, 0.1), 64);
    const placed = [];
    const free = (x, z, rr) => placed.every(([a, b, c]) => Math.hypot(a - x, b - z) > c + rr);
    for (let i = 0; i < 46; i++) {
      let x, z, tries = 0, isCap = i % 3 !== 2, rr = isCap ? 0.62 : 0.36;
      do { x = (rnd() - 0.5) * 9; z = (rnd() - 0.5) * 5.5; } while (!free(x, z, rr) && tries++ < 60);
      if (tries >= 60) continue; placed.push([x, z, rr]);
      const o = new THREE.Group();
      if (isCap) {
        const [a, b] = caps[i % caps.length], r = 0.2, l = 0.42;
        const h1 = new THREE.Mesh(capsuleHalf(r, l, 48), solid(a, { roughness: 0.2, clearcoat: 1 })); const h2 = new THREE.Mesh(capsuleHalf(r * 1.03, l * 0.9, 48), solid(b, { roughness: 0.2, clearcoat: 1 })); h2.rotation.x = Math.PI;
        o.add(h1, h2); o.rotation.z = Math.PI / 2; o.position.y = r; const w = new THREE.Group(); w.add(o); w.position.set(x, 0, z); w.rotation.y = rnd() * Math.PI; scene.add(w);
        [h1, h2].forEach(m => { m.castShadow = true; });
      } else {
        const m = new THREE.Mesh(tabGeo, solid(i % 2 ? '#ffffff' : C.mint, { roughness: 0.55, clearcoat: 0.2 })); m.castShadow = true; m.position.set(x, 0.1, z); scene.add(m);
      }
    }
    const cam = new THREE.PerspectiveCamera(26, aspect, 0.1, 100); cam.position.set(0, 10.5, 4.6); cam.lookAt(0, 0, 0.2);
    return { scene, camera: cam };
  },

  // hero loop: slow folds of tinted glass, out of focus
  flow({ aspect, variant }) {
    const scene = new THREE.Scene();
    const pal = variant === 'light'
      ? [C.offwhite, C.stone, C.sage, C.mint, '#9fb59a']
      : ['#1c2b24', '#3d5a49', '#8fa98e', '#c4d6bb', '#94795a'];
    const mat = new THREE.ShaderMaterial({
      uniforms: { t: { value: 0 }, asp: { value: aspect }, c0: { value: new THREE.Color(pal[0]) }, c1: { value: new THREE.Color(pal[1]) }, c2: { value: new THREE.Color(pal[2]) }, c3: { value: new THREE.Color(pal[3]) }, c4: { value: new THREE.Color(pal[4]) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
      fragmentShader: `
        varying vec2 vUv; uniform float t, asp; uniform vec3 c0,c1,c2,c3,c4;
        float band(float d, float w){ return smoothstep(w, 0., abs(d)); }
        void main(){
          vec2 p = (vUv - .5) * vec2(asp, 1.);
          float tt = t * .12;
          // three large sweeping arcs, like light caught in curved glass
          float a1 = p.y - .55*sin(p.x*1.3 + tt*2.) + .25*cos(p.x*2.7 - tt*1.4) + .05;
          float a2 = p.y + .4 - .5*sin(p.x*1.1 - tt*1.6 + 1.7);
          float a3 = p.y - .35 - .45*cos(p.x*.9 + tt*1.2 + .6);
          vec3 col = mix(c1, c0, smoothstep(-.6, .7, -p.y + .2*sin(p.x*2. + tt)));
          col = mix(col, c2, band(a1, .8) * .9);
          col = mix(col, c3, band(a1 - .06, .12) * .7);
          col = mix(col, c0, band(a1 + .05, .035) * .9);   // dark rim line
          col = mix(col, c4, band(a2, .35) * .55);
          col = mix(col, c3, band(a2 - .03, .05) * .5);
          col = mix(col, c2, band(a3, .7) * .6);
          col = mix(col, c0, band(a3 + .1, .03) * .7);
          float v = smoothstep(1.3, .2, length(p*vec2(.8,1.)));
          col *= .9 + .1*v; col = max(col, c1*.55);
          col += (fract(sin(dot(vUv*999., vec2(12.9898,78.233)))*43758.5453)-.5)*.02;
          gl_FragColor = vec4(col, 1.);
        }`,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); quad.frustumCulled = false; scene.add(quad);
    return { scene, camera: new THREE.Camera(), update(t) { mat.uniforms.t.value = t; } };
  },
};
