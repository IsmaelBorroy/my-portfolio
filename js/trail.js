const TRAIL_LIFETIME = 200;   // ms until a segment fully disappears
const MIN_DIST       = 6;     // px — minimum distance before adding a new point
const DASH           = [6, 5]; // [dash length, gap length] in px
const LINE_WIDTH     = 1.2;

const canvas = document.getElementById('trail-canvas');
const ctx    = canvas.getContext('2d');

// Resize canvas to physical pixels
function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
}
resize();
window.addEventListener('resize', () => {
  resize();
});

// ── Point buffer ─────────────────────────────────────────────
// Each entry: { x, y, t }  where t = performance.now() at record time
const points = [];
let lastX = -9999;
let lastY = -9999;

// Read current accent colour from CSS custom properties
function accentColour() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent')
    .trim() || '#e8dcc8';
}

// ── Mouse tracking ───────────────────────────────────────────
window.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;

  points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
  lastX = e.clientX;
  lastY = e.clientY;
}, { passive: true });

// ── Parse hex/rgb colour → [r, g, b] ────────────────────────
function parseRGB(colour) {
  // Try hex
  const hex = colour.replace('#', '');
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return [232, 220, 200]; // fallback warm white
}

// ── Render loop ──────────────────────────────────────────────
function drawTrail() {
  requestAnimationFrame(drawTrail);

  const now   = performance.now();
  const dpr   = window.devicePixelRatio || 1;
  const w     = canvas.width  / dpr;
  const h     = canvas.height / dpr;

  // Purge expired points
  while (points.length > 0 && now - points[0].t > TRAIL_LIFETIME) {
    points.shift();
  }

  ctx.clearRect(0, 0, w, h);

  if (points.length < 2) return;

  const colour = accentColour();
  const [r, g, b] = parseRGB(colour);

  ctx.lineWidth  = LINE_WIDTH;
  ctx.lineCap    = 'round';
  ctx.setLineDash(DASH);

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];

    // Opacity based on the *newer* point's age — newest = 1, oldest = 0
    const age     = now - p1.t;
    const opacity = Math.max(0, 1 - age / TRAIL_LIFETIME);

    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
}

drawTrail();
