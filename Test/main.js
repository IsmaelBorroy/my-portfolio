import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('canvas-container');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.01,
  100
);
camera.position.set(0, 1.2, 3);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(3, 5, 3);
dirLight.castShadow = true;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x8899bb, 0.5);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);

// Animation state
const clock = new THREE.Clock();
let doorNode = null;
let doorMeshes = [];
let doorOpen = false;
let animating = false;

const OPEN_ANGLE = -Math.PI / 2;  // 90° in the correct direction for this camera side
const CLOSE_ANGLE = 0;
const ANIM_DURATION = 0.6;        // seconds

let fromAngle = 0;
let toAngle = 0;
let animProgress = 1;             // 1 = finished

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Load GLB
const loader = new GLTFLoader();
loader.load(
  '../assets/models/Door.glb',
  (gltf) => {
    const model = gltf.scene;

    // Centre and fit the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.0 / maxDim;

    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));

    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        doorMeshes.push(node);
      }
      // Find the Door node by name
      if (node.name === 'Door') {
        doorNode = node;
      }
    });

    scene.add(model);
  },
  undefined,
  (error) => console.error('Error loading Door.glb:', error)
);

// Ease in-out for smooth animation
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Click handler
renderer.domElement.addEventListener('click', (event) => {
  if (!doorNode || animating) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(doorMeshes, true);

  if (hits.length > 0) {
    doorOpen = !doorOpen;
    fromAngle = doorNode.rotation.y;
    toAngle = doorOpen ? OPEN_ANGLE : CLOSE_ANGLE;
    animProgress = 0;
    animating = true;
  }
});

// Resize
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (animating && doorNode) {
    animProgress += delta / ANIM_DURATION;
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
    doorNode.rotation.y = fromAngle + (toAngle - fromAngle) * easeInOut(animProgress);
  }

  renderer.render(scene, camera);
}
animate();
