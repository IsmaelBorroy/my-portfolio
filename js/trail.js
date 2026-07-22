const TRAIL_LIFETIME = 500;   // ms until the trail fully disappears
const MIN_DIST       = 12;    // px — minimum distance before recording a new point
const DASH           = [6, 5]; // [dash length, gap length] in px
const LINE_WIDTH     = 1.2;
const TENSION        = 0.5;   // Catmull-Rom tension (0 = sharp, 1 = very smooth)

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
  ctx.lineJoin   = 'round';
  ctx.setLineDash(DASH);

  // Draw a single Catmull-Rom spline through all points.
  // Opacity fades from 1 (newest tail end) to 0 (oldest head).
  // We approximate per-segment opacity by splitting into n sub-draws.
  const n = points.length;

  // Build the smooth path using Catmull-Rom → cubic Bézier conversion.
  // Each segment i→i+1 uses phantom control points from i-1 and i+2.
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, n - 1)];

    // Catmull-Rom → Bézier control points
    const cp1x = p1.x + (p2.x - p0.x) / 6 * TENSION * 2;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * TENSION * 2;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * TENSION * 2;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * TENSION * 2;

    // Fade: oldest segment (i=0) → near 0, newest (i=n-2) → 1
    const age     = now - p2.t;
    const opacity = Math.max(0, 1 - age / TRAIL_LIFETIME);

    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    ctx.stroke();
  }
}

drawTrail();
