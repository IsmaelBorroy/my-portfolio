import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { applyLang, getLang, toggleLangAnimated } from './i18n.js';
import { initTheme } from './theme.js';
import './trail.js';

// ── Theme ─────────────────────────────────────────────────
initTheme('theme-toggle');

// ── i18n ──────────────────────────────────────────────────
applyLang(getLang());
const wipeEl = document.getElementById('lang-wipe');
document.getElementById('lang-toggle').addEventListener('click', () => toggleLangAnimated(wipeEl));

// ── Scene setup ───────────────────────────────────────────
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
// Transparent background so the CSS name layer shows through
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.01,
  100
);
const CAM_START = new THREE.Vector3(0, 0.2, 5);
camera.position.copy(CAM_START);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// ── Lighting ──────────────────────────────────────────────
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffe8c8, 1.8);
key.position.set(3, 5, 3);
key.castShadow = true;
scene.add(key);

const fill = new THREE.DirectionalLight(0x8aada0, 0.6);
fill.position.set(-3, 2, -2);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xe8dcc8, 0.4);
rim.position.set(0, -2, -4);
scene.add(rim);

// ── Particles ─────────────────────────────────────────────
const PARTICLE_COUNT = 120;
const P_SPREAD_X     = 6;     // horizontal spread
const P_SPREAD_Y     = 6;     // vertical spread (spawn range)
const P_SPREAD_Z     = 4;     // depth spread
const P_DRIFT        = 0.04;  // units per second upward drift
const P_SWAY         = 0.018; // horizontal sway amplitude

const pPositions = new Float32Array(PARTICLE_COUNT * 3);
const pPhases    = new Float32Array(PARTICLE_COUNT); // per-particle sway phase

for (let i = 0; i < PARTICLE_COUNT; i++) {
  pPositions[i * 3]     = (Math.random() - 0.5) * P_SPREAD_X;
  pPositions[i * 3 + 1] = (Math.random() - 0.5) * P_SPREAD_Y;
  pPositions[i * 3 + 2] = (Math.random() - 0.5) * P_SPREAD_Z - 1;
  pPhases[i]            = Math.random() * Math.PI * 2;
}

const pGeometry = new THREE.BufferGeometry();
pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

const pMaterial = new THREE.PointsMaterial({
  color:       0xe8dcc8,
  size:        0.013,
  sizeAttenuation: true,
  transparent: true,
  opacity:     0.3,
  depthWrite:  false,
});

const particles = new THREE.Points(pGeometry, pMaterial);
scene.add(particles);

// ── State ─────────────────────────────────────────────────
const clock   = new THREE.Clock();
let doorNode  = null;
let doorMeshes = [];
let triggered = false;   // prevent double-click

// Door open tween
let doorAnimating  = false;
let doorProgress   = 1;
let doorFrom       = 0;
const DOOR_TO      = -Math.PI / 2;
const DOOR_DURATION = 0.65;

// Flash overlay
const flash = document.getElementById('flash-overlay');

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer   = new THREE.Vector2();

// ── Load model ────────────────────────────────────────────
const loader = new GLTFLoader();
loader.load(
  'assets/models/Door.glb',
  (gltf) => {
    const model = gltf.scene;

    const box    = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 1.2 / maxDim;

    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    model.position.y -= 0.25;

    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow    = true;
        node.receiveShadow = true;
        doorMeshes.push(node);
      }
      if (node.name === 'Door') doorNode = node;
    });

    scene.add(model);
  },
  undefined,
  (err) => console.error('GLB load error:', err)
);

// ── Easing ────────────────────────────────────────────────
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── Click handler ─────────────────────────────────────────
renderer.domElement.addEventListener('click', (e) => {
  if (!doorNode || triggered) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x  =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  pointer.y  = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(doorMeshes, true);

  if (hits.length > 0) {
    triggered      = true;
    doorAnimating  = true;
    doorProgress   = 0;
    doorFrom       = doorNode.rotation.y;

    // Fade out hero title upward
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.classList.add('fade-out');

    // Hide hint
    const hint = document.getElementById('enter-hint');
    if (hint) hint.style.opacity = '0';
  }
});

// ── Resize ────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ── Render loop ───────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  // Door open tween
  if (doorAnimating && doorNode) {
    doorProgress += dt / DOOR_DURATION;
    if (doorProgress >= 1) {
      doorProgress  = 1;
      doorAnimating = false;
      // Door fully open → flash and navigate
      flash.classList.add('active');
      setTimeout(() => {
        window.location.href = 'pages/information.html';
      }, 400);
    }
    doorNode.rotation.y = doorFrom + (DOOR_TO - doorFrom) * easeInOut(doorProgress);
  }

  // Animate particles
  const t = clock.elapsedTime;
  const pos = pGeometry.attributes.position;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos.array[i * 3]     += Math.sin(t + pPhases[i]) * P_SWAY * dt;
    pos.array[i * 3 + 1] += P_DRIFT * dt;
    // Wrap back to bottom when particle exits top
    if (pos.array[i * 3 + 1] > P_SPREAD_Y / 2) {
      pos.array[i * 3 + 1] = -P_SPREAD_Y / 2;
    }
  }
  pos.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();
