/**
 * render.js — populates both the desktop and mobile experiences from
 * SITE_CONFIG. Keeping this in one place means content only ever needs
 * to be edited in js/config.js.
 */
(function () {
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function looksLikePlaceholder(value) {
    if (!value) return true;
    return /replace_me/i.test(value) || /^\[/.test(value.trim());
  }

  function linkOrPlaceholder(label, url, extraClass) {
    const disabled = looksLikePlaceholder(url);
    const cls = extraClass || '';
    if (disabled) {
      return `<span class="cta secondary ${cls}" aria-disabled="true" title="Link not provided yet">${escapeHtml(label)}<span class="placeholder-flag">todo</span></span>`;
    }
    return `<a class="cta secondary ${cls}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  }

  function experienceEntryHtml(job) {
    return `
      <div class="job">
        <h3>${escapeHtml(job.title)} — ${escapeHtml(job.company)}</h3>
        <div class="tag">${escapeHtml(job.dates)}</div>
        ${(job.techStack && job.techStack.length) ? `
        <div class="tech-chip-row">
          ${job.techStack.map(t => `<span class="tech-chip">${escapeHtml(t)}</span>`).join('')}
        </div>` : ''}
        <ul>
          ${(job.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function educationEntryHtml(ed) {
    return `
      <div class="edu">
        <h3>${escapeHtml(ed.credential)} — ${escapeHtml(ed.school)}</h3>
        <div class="tag">${escapeHtml(ed.dates)}</div>
        <p>${escapeHtml(ed.details)}</p>
      </div>
    `;
  }

  function certificationsHtml(certs) {
    if (!certs || !certs.length) return '';
    return `
      <div class="certs">
        <h3>Certifications</h3>
        <ul>
          ${certs.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function projectCaseStudyHtml(p) {
    return `
      <h3>${escapeHtml(p.title)}</h3>
      <div class="tech-chip-row">
        ${p.techStack.map(t => `<span class="tech-chip">${escapeHtml(t)}</span>`).join('')}
      </div>
      <dl class="case-study">
        <dt>Problem</dt><dd>${escapeHtml(p.problem)}</dd>
        <dt>Role</dt><dd>${escapeHtml(p.role)}</dd>
        <dt>Approach</dt><dd>${escapeHtml(p.approach)}</dd>
        <dt>Outcome</dt><dd>${escapeHtml(p.outcome)}</dd>
      </dl>
      <div class="cta-row">
        ${linkOrPlaceholder('GitHub ↗', p.githubUrl)}
      </div>
    `;
  }

  window.renderSite = function renderSite(cfg) {
    // ---- Text nodes shared by both experiences ----
    document.querySelectorAll('[data-bind="name"]').forEach(el => el.textContent = cfg.name);
    document.querySelectorAll('[data-bind="shortName"]').forEach(el => el.textContent = cfg.shortName);
    document.querySelectorAll('[data-bind="role"]').forEach(el => el.textContent = cfg.role);
    document.querySelectorAll('[data-bind="tagline"]').forEach(el => el.textContent = cfg.tagline);
    document.querySelectorAll('[data-bind="location"]').forEach(el => el.textContent = cfg.location);
    document.querySelectorAll('[data-bind="availability"]').forEach(el => el.textContent = cfg.availability);
    document.querySelectorAll('[data-bind="quickFacts"]').forEach(el => el.textContent = cfg.quickFacts);
    document.querySelectorAll('[data-bind="email"]').forEach(el => {
      el.textContent = cfg.email;
      if (el.tagName === 'A') el.href = looksLikePlaceholder(cfg.email) ? '#' : `mailto:${cfg.email}`;
    });

    document.querySelectorAll('[data-bind="resumeUrl"]').forEach(el => {
      const disabled = looksLikePlaceholder(cfg.resumeUrl);
      el.href = disabled ? '#' : cfg.resumeUrl;
      if (disabled) {
        el.setAttribute('aria-disabled', 'true');
        el.dataset.placeholder = 'true';
      }
    });
    document.querySelectorAll('[data-bind="github"]').forEach(el => {
      const disabled = looksLikePlaceholder(cfg.github);
      el.href = disabled ? '#' : cfg.github;
      if (disabled) el.setAttribute('aria-disabled', 'true');
    });
    document.querySelectorAll('[data-bind="linkedin"]').forEach(el => {
      const disabled = looksLikePlaceholder(cfg.linkedin);
      el.href = disabled ? '#' : cfg.linkedin;
      if (disabled) el.setAttribute('aria-disabled', 'true');
    });

    document.querySelectorAll('[data-bind="bio"]').forEach(el => {
      el.innerHTML = cfg.bio.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    });

    // ---- Desktop: Projects window ----
    const desktopProjects = document.getElementById('desktop-projects-list');
    if (desktopProjects) {
      desktopProjects.innerHTML = cfg.projects.map(p => `<div class="proj">${projectCaseStudyHtml(p)}</div>`).join('');
    }

    // ---- Mobile: project cards ----
    const mobileProjects = document.getElementById('mobile-projects-list');
    if (mobileProjects) {
      mobileProjects.innerHTML = cfg.projects.map(p => `<div class="m-proj-card">${projectCaseStudyHtml(p)}</div>`).join('');
    }

    // ---- Desktop: Experience window (work history only) ----
    const desktopExperience = document.getElementById('desktop-experience-list');
    if (desktopExperience && cfg.experience) {
      desktopExperience.innerHTML = cfg.experience.map(experienceEntryHtml).join('');
    }

    // ---- Mobile: experience section (work history only) ----
    const mobileExperience = document.getElementById('mobile-experience-list');
    if (mobileExperience && cfg.experience) {
      mobileExperience.innerHTML =
        cfg.experience.map(job => `<div class="m-job-card">${experienceEntryHtml(job)}</div>`).join('');
    }

    // ---- Desktop: About window — education + certifications live here, ----
    // ---- not under Experience, since they aren't work history. ----
    const desktopAboutEducation = document.getElementById('desktop-about-education');
    if (desktopAboutEducation) {
      desktopAboutEducation.innerHTML =
        (cfg.education ? `<div class="edu-group"><h2>Education</h2>${cfg.education.map(educationEntryHtml).join('')}</div>` : '') +
        certificationsHtml(cfg.certifications);
    }

    // ---- Mobile: About section — same education/certifications content ----
    const mobileAboutEducation = document.getElementById('mobile-about-education');
    if (mobileAboutEducation) {
      mobileAboutEducation.innerHTML =
        (cfg.education ? `<div class="m-job-card edu-group"><h3>Education</h3>${cfg.education.map(educationEntryHtml).join('')}</div>` : '') +
        certificationsHtml(cfg.certifications);
    }

    // ---- Skills (mobile) ----
    const mobileSkills = document.getElementById('mobile-skills-list');
    if (mobileSkills && cfg.skills) {
      mobileSkills.innerHTML = cfg.skills.map(s => `
        <div class="m-skill-row"><span>${escapeHtml(s.label)}</span></div>
        <div class="m-skill-bar"><span style="width:${cfg.skills.length ? Math.max(4, s.level) : 0}%"></span></div>
      `).join('');
    }

    // ---- Terminal command data (desktop) ----
    window.__terminalContent = {
      whoami: `${cfg.shortName.toLowerCase()} — ${cfg.role.toLowerCase()}, ${cfg.availability.toLowerCase()}`,
      about: cfg.bio.join(' '),
      projects: cfg.projects.map((p, i) => `${i + 1}) ${p.title} — ${p.outcome}`).join('\n'),
      experience: (cfg.experience || []).map((j, i) => `${i + 1}) ${j.title} — ${j.company} (${j.dates})`).join('\n'),
      contact: `reach out: ${cfg.email}${looksLikePlaceholder(cfg.email) ? ' (placeholder — real address goes here)' : ''}`
    };

    document.querySelectorAll('[data-bind="year"]').forEach(el => el.textContent = new Date().getFullYear());
  };
})();
