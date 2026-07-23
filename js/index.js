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

// ── Nav scroll shadow ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Intersection Observer for scroll-triggered reveals ────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
