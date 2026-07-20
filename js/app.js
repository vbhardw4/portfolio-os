/**
 * app.js — entry point. Renders content from SITE_CONFIG, then hands off
 * to the desktop window-manager experience (>= 681px) or leaves the
 * plain mobile page as-is (< 681px, no JS "game" logic needed there).
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    renderSite(SITE_CONFIG);

    // Placeholder links (aria-disabled, set by render.js) shouldn't
    // navigate anywhere — including href="#" jumping to the top of the
    // page, which reads as a dead/broken link to anyone who clicks it.
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[aria-disabled="true"]');
      if (el) e.preventDefault();
    });

    const mq = window.matchMedia('(min-width: 681px)');

    if (mq.matches) {
      if (typeof initDesktopExperience === 'function') initDesktopExperience();
    } else {
      // Plain mobile page: boot overlay isn't used at all, hide it outright.
      const boot = document.getElementById('boot');
      if (boot) boot.setAttribute('hidden', '');
    }

    // The desktop window manager wires up drag/focus state that assumes
    // it initialized once for the current layout. Rather than trying to
    // hot-swap between the two experiences mid-session, reload on the
    // (rare) case a visitor crosses the breakpoint, e.g. by rotating a
    // tablet or resizing a desktop window across it.
    let lastMatch = mq.matches;
    mq.addEventListener('change', (e) => {
      if (e.matches !== lastMatch) {
        lastMatch = e.matches;
        window.location.reload();
      }
    });

    // Accessibility escape hatch: opt out of the OS metaphor entirely.
    // Both the dock's "Plain text view" link and the page's skip-link
    // (for keyboard/screen-reader users who tab in before the desktop
    // even makes sense to them) trigger the same plain-page fallback.
    function jumpToPlainView(e) {
      if (mq.matches) {
        e.preventDefault();
        document.body.classList.add('force-plain-view');
        document.getElementById('main-content')?.focus();
        window.scrollTo(0, 0);
      }
    }
    document.getElementById('plain-view-jump')?.addEventListener('click', jumpToPlainView);
    document.getElementById('skip-link')?.addEventListener('click', jumpToPlainView);
  });
})();
