import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { applyLang, getLang, toggleLang } from './i18n.js';

// ── i18n ──────────────────────────────────────────────────
applyLang(getLang());
document.getElementById('lang-toggle').addEventListener('click', toggleLang);

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

// Camera zoom tween
let zoomAnimating  = false;
let zoomProgress   = 0;
const ZOOM_DURATION = 1.1;
const CAM_END      = new THREE.Vector3(0, 0.2, -1.5);  // through the door

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

function easeIn(t) {
  return t * t * t;
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

  // 1. Door open tween
  if (doorAnimating && doorNode) {
    doorProgress += dt / DOOR_DURATION;
    if (doorProgress >= 1) {
      doorProgress  = 1;
      doorAnimating = false;
      // Start camera zoom after door is fully open
      zoomAnimating = true;
      zoomProgress  = 0;
    }
    doorNode.rotation.y = doorFrom + (DOOR_TO - doorFrom) * easeInOut(doorProgress);
  }

  // 2. Camera zoom tween
  if (zoomAnimating) {
    zoomProgress += dt / ZOOM_DURATION;
    if (zoomProgress >= 1) {
      zoomProgress  = 1;
      zoomAnimating = false;
      // Trigger flash → navigate
      flash.classList.add('active');
      setTimeout(() => {
        window.location.href = 'pages/information.html';
      }, 400);
    }
    const t = easeIn(Math.min(zoomProgress, 1));
    camera.position.lerpVectors(CAM_START, CAM_END, t);
    camera.lookAt(0, 0, 0);
  }

  renderer.render(scene, camera);
}
animate();
