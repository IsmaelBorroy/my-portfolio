// ── Theme toggle ──────────────────────────────────────────
const STORAGE_KEY = 'theme';

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'dark';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

export function initTheme(buttonId) {
  // Apply stored preference immediately (before paint)
  applyTheme(getTheme());
  const btn = document.getElementById(buttonId);
  if (btn) btn.addEventListener('click', toggleTheme);
}
