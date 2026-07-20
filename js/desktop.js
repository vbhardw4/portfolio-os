/**
 * desktop.js — the "OS" experience: boot sequence, draggable/clamped
 * windows with real minimize/maximize/close, focus-managed modal
 * dialogs, terminal, and the do_not_click.exe easter egg.
 *
 * Only initialized when the viewport is wide enough (see app.js) — this
 * file is never loaded/run on the plain mobile page.
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DOCK_HEIGHT = 64;

  function initBoot() {
    const boot = document.getElementById('boot');
    const bootText = document.getElementById('boot-text');
    if (!boot) return;
    const lines = [
      'portfolio_os boot v1.0',
      'checking dependencies ......... ok',
      'loading portfolio modules ..... ok',
      'mounting /projects ............ ok',
      'starting window manager ....... ok',
      '',
      'welcome. booting desktop...'
    ];

    let dismissed = false;
    function dismissBoot() {
      if (dismissed) return;
      dismissed = true;
      boot.classList.add('hide');
      setTimeout(() => boot.setAttribute('hidden', ''), 500);
      document.removeEventListener('keydown', dismissBoot);
      boot.removeEventListener('click', dismissBoot);
    }

    if (reduced) {
      bootText.textContent = lines.join('\n');
      setTimeout(dismissBoot, 300);
    } else {
      let i = 0;
      const iv = setInterval(() => {
        bootText.textContent += (i > 0 ? '\n' : '') + lines[i];
        i++;
        if (i >= lines.length) {
          clearInterval(iv);
          setTimeout(dismissBoot, 600);
        }
      }, 140);
    }
    // Skippable for repeat visitors: click or any key dismisses immediately.
    boot.addEventListener('click', dismissBoot);
    document.addEventListener('keydown', dismissBoot);
    return dismissBoot;
  }

  function initClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;
    function tick() {
      clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    tick();
    setInterval(tick, 1000 * 15);
  }

  function focusableEls(container) {
    return Array.from(container.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null || el === document.activeElement);
  }

  function initWindowManager() {
    let zTop = 10;
    let openCount = 0;
    let activeWindow = null;
    let lastTrigger = null;
    const minimizedTray = document.getElementById('minimized-tray');

    function trapFocus(e) {
      if (!activeWindow) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeWindow(activeWindow);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = focusableEls(activeWindow);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function bringToFront(win) {
      document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
      zTop += 1;
      win.style.zIndex = zTop;
      win.classList.add('active');
    }

    function clampToViewport(win) {
      const rect = win.getBoundingClientRect();
      const maxLeft = Math.max(0, window.innerWidth - rect.width);
      const maxTop = Math.max(0, window.innerHeight - DOCK_HEIGHT - rect.height);
      const left = Math.min(Math.max(0, rect.left), maxLeft);
      const top = Math.min(Math.max(0, rect.top), maxTop);
      win.style.left = left + 'px';
      win.style.top = top + 'px';
    }

    function openWindow(id, triggerEl) {
      const win = document.getElementById(id);
      if (!win) return;
      lastTrigger = triggerEl || document.activeElement;
      const wasHidden = win.hasAttribute('hidden');
      win.removeAttribute('hidden');
      win.setAttribute('aria-hidden', 'false');
      if (wasHidden) {
        openCount++;
        const offset = (openCount % 6) * 18;
        // Bake the cascade offset directly into left/top (not a CSS transform) so
        // clampToViewport below measures and clamps the true final position —
        // a transform left in place would get re-applied on top of the clamp.
        const rect = win.getBoundingClientRect();
        win.style.left = (rect.left + offset) + 'px';
        win.style.top = (rect.top + offset) + 'px';
      }
      bringToFront(win);
      clampToViewport(win);
      activeWindow = win;
      document.addEventListener('keydown', trapFocus, true);

      const focusTarget = win.querySelector('[data-action="close"]') || win;
      setTimeout(() => focusTarget.focus(), 30);

      const minChip = document.querySelector(`.minimized-chip[data-restore="${id}"]`);
      if (minChip) minChip.remove();

      if (id === 'win-terminal') {
        const input = document.getElementById('term-input');
        if (input) setTimeout(() => input.focus(), 60);
      }
    }

    function closeWindow(win) {
      win.setAttribute('hidden', '');
      win.setAttribute('aria-hidden', 'true');
      win.classList.remove('active', 'maximized');
      document.removeEventListener('keydown', trapFocus, true);
      if (activeWindow === win) activeWindow = null;
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    }

    function minimizeWindow(win) {
      win.setAttribute('hidden', '');
      win.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', trapFocus, true);
      if (activeWindow === win) activeWindow = null;
      if (!minimizedTray) return;
      const title = win.querySelector('.titlebar-name span:last-child')?.textContent || win.id;
      const chip = document.createElement('button');
      chip.className = 'minimized-chip';
      chip.type = 'button';
      chip.dataset.restore = win.id;
      chip.textContent = '▢ ' + title;
      chip.addEventListener('click', () => openWindow(win.id, chip));
      minimizedTray.appendChild(chip);
    }

    function toggleMaximize(win) {
      win.classList.toggle('maximized');
      const btn = win.querySelector('.traffic .full');
      if (btn) btn.setAttribute('aria-pressed', win.classList.contains('maximized') ? 'true' : 'false');
    }

    // Icons open windows
    document.querySelectorAll('.icon[data-window]').forEach(btn => {
      btn.addEventListener('click', () => openWindow(btn.dataset.window, btn));
    });

    // Window chrome buttons
    document.querySelectorAll('.window').forEach(win => {
      win.addEventListener('mousedown', () => bringToFront(win));
      const closeBtn = win.querySelector('[data-action="close"]');
      const minBtn = win.querySelector('[data-action="minimize"]');
      const fullBtn = win.querySelector('[data-action="maximize"]');
      if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win); });
      if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(win); });
      if (fullBtn) fullBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(win); });
    });

    // Dragging — clamped to viewport, disabled while maximized
    document.querySelectorAll('.titlebar').forEach(bar => {
      let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
      bar.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        const win = bar.closest('.window');
        if (win.classList.contains('maximized')) return;
        dragging = true;
        const rect = win.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; ox = rect.left; oy = rect.top;
        win.style.transform = 'none';
        document.body.style.userSelect = 'none';
      });
      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const win = bar.closest('.window');
        const rect = win.getBoundingClientRect();
        const maxLeft = Math.max(0, window.innerWidth - rect.width);
        const maxTop = Math.max(0, window.innerHeight - DOCK_HEIGHT - rect.height);
        win.style.left = Math.min(Math.max(0, ox + (e.clientX - sx)), maxLeft) + 'px';
        win.style.top = Math.min(Math.max(0, oy + (e.clientY - sy)), maxTop) + 'px';
      });
      window.addEventListener('mouseup', () => {
        dragging = false;
        document.body.style.userSelect = '';
      });
    });

    window.addEventListener('resize', () => {
      document.querySelectorAll('.window:not([hidden])').forEach(clampToViewport);
    });

    // Dock actions
    document.querySelectorAll('[data-action="open-resume"]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openWindow('win-resume', el); });
    });
    document.querySelectorAll('[data-action="open-contact"]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openWindow('win-about', el); });
    });

    return { openWindow, closeWindow };
  }

  function initEasterEgg() {
    const dangerWin = document.getElementById('win-danger');
    if (!dangerWin) return;
    let dangerRan = false;
    new MutationObserver(() => {
      if (!dangerWin.hasAttribute('hidden') && !dangerRan) {
        dangerRan = true;
        const prog = document.getElementById('danger-progress');
        const punch = document.getElementById('danger-punchline');
        let pct = 0;
        const iv = setInterval(() => {
          pct += Math.floor(Math.random() * 18) + 6;
          if (pct >= 100) {
            pct = 100;
            clearInterval(iv);
            prog.textContent = '100% complete';
            punch.style.display = 'block';
          } else {
            prog.textContent = pct + '% complete';
          }
        }, 220);
      }
    }).observe(dangerWin, { attributes: true, attributeFilter: ['hidden'] });
  }

  function initTerminal() {
    const termOutput = document.getElementById('term-output');
    const termInput = document.getElementById('term-input');
    if (!termOutput || !termInput) return;

    function commands() {
      const c = window.__terminalContent || {};
      return {
        help: 'available: help, whoami, about, projects, experience, contact, clear',
        whoami: c.whoami || 'whoami: content not loaded',
        about: c.about || 'about: content not loaded',
        projects: c.projects || 'no projects loaded',
        experience: c.experience || 'no experience loaded',
        contact: c.contact || 'contact info not loaded'
      };
    }

    function printLine(text) {
      const p = document.createElement('p');
      p.className = 'term-line';
      p.textContent = text;
      termOutput.insertBefore(p, termOutput.querySelector('.term-input-row'));
    }

    termInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const raw = termInput.value.trim();
      printLine('visitor@portfolio ~ % ' + raw);
      termInput.value = '';
      if (!raw) return;
      if (raw === 'clear') {
        termOutput.querySelectorAll('.term-line').forEach(l => l.remove());
        return;
      }
      if (raw.includes('rm -rf')) {
        printLine('nice try. this filesystem is fake and so is your risk tolerance being tested right now — respect either way.');
        return;
      }
      const cmds = commands();
      if (cmds[raw]) {
        printLine(cmds[raw]);
      } else {
        printLine('command not found: ' + raw + ' (try "help")');
      }
      termOutput.scrollTop = termOutput.scrollHeight;
    });
  }

  window.initDesktopExperience = function initDesktopExperience() {
    const dismissBoot = initBoot();
    initClock();
    const wm = initWindowManager();
    initEasterEgg();
    initTerminal();

    // Open resume by default after boot so a skimmer sees content immediately
    setTimeout(() => wm.openWindow('win-resume'), reduced ? 400 : 1300);
  };
})();
