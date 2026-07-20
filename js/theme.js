/**
 * theme.js — shared light/dark theme toggle, persisted in localStorage,
 * used by both the desktop and mobile experiences.
 */
(function () {
  const STORAGE_KEY = 'portfolio-os-theme';
  const root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyStored() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') root.setAttribute('data-theme', stored);
    } catch (e) { /* storage unavailable — fall back to prefers-color-scheme */ }
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
  }

  applyStored();

  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();
