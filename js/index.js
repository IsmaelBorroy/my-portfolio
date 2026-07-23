import { applyLang, getLang, toggleLangAnimated } from './i18n.js';
import { initTheme } from './theme.js';
import './trail.js';

// ── Theme ─────────────────────────────────────────────────
initTheme('theme-toggle');

// ── i18n ──────────────────────────────────────────────────
applyLang(getLang());
const wipeEl = document.getElementById('lang-wipe');
document.getElementById('lang-toggle').addEventListener('click', () => toggleLangAnimated(wipeEl));

// ── Fade body in on load ──────────────────────────────────
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.body.classList.remove('is-loading');
  });
});

// ── Nav scroll shadow + scroll progress ──────────────────
const nav            = document.getElementById('nav');
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  if (scrollProgress) {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    scrollProgress.style.width = `${Math.min(pct, 100)}%`;
  }
}, { passive: true });

// ── Intersection Observer for scroll-triggered reveals ────
function animateCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target   = parseInt(el.textContent, 10);
  const duration = 600;
  const start    = performance.now();
  function tick(now) {
    const t       = Math.min((now - start) / duration, 1);
    const current = Math.round(t * target);
    el.textContent = String(current).padStart(2, '0');
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
      if (entry.isIntersecting && entry.target.classList.contains('section__label')) {
        animateCounter(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.querySelectorAll('.section__label').forEach(el => observer.observe(el));

// ── Copy email to clipboard ───────────────────────────────
const copyBtn = document.getElementById('copy-email');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('ismaelborroy@gmail.com').then(() => {
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 1500);
    });
  });
}

// ── Fade-out transition on nav logo (back to index) ───────
const flashOverlay = document.getElementById('flash-overlay');
if (flashOverlay) {
  const logoLink = document.querySelector('a.nav__logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      const href = logoLink.getAttribute('href');
      flashOverlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 550);
    });
  }
}

// ── HUD font-size toggle ──────────────────────────────────
const HUD_KEY    = 'hud-level';
const HUD_LEVELS = 2;

function applyHud(level) {
  document.documentElement.setAttribute('data-hud', level);
}

(function initHud() {
  const saved = parseInt(localStorage.getItem(HUD_KEY), 10) || 1;
  applyHud(saved);
})();

const fontSizeBtn = document.getElementById('font-size-toggle');
if (fontSizeBtn) {
  fontSizeBtn.addEventListener('click', () => {
    const current = parseInt(document.documentElement.getAttribute('data-hud') || '1', 10);
    const next    = (current % HUD_LEVELS) + 1;
    applyHud(next);
    localStorage.setItem(HUD_KEY, next);
  });
}
