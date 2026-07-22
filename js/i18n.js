// ── Translation strings ────────────────────────────────────
export const translations = {
  en: {
    // index.html
    name:           'Ismael Borroy',
    tagline:        'Software Developer',
    hint:           'Click the door to enter',
    lang_label:     'ES',

    // portfolio.html — nav
    nav_about:      'About',
    nav_skills:     'Skills',
    nav_experience: 'Experience',
    nav_projects:   'Projects',
    nav_contact:    'Contact',

    // portfolio.html — about
    about_title:    'About Me',
    about_p1:       'I\'m a Computer Engineering student at FING Uruguay with hands-on experience building AI-powered solutions. I\'ve worked on MVPs and proofs of concept spanning document processing, AI agents, and data analytics across Latin America.',
    about_p2:       'I\'m passionate about AI agents, system design, and turning complex technical challenges into clean solutions. I thrive in cross-cultural, client-facing environments.',

    // portfolio.html — skills
    skills_title:   'Skills',

    // portfolio.html — experience
    exp_title:      'Experience',
    exp_1_role:     'Developer · IBM',
    exp_1_period:   '2025 - 2026',
    exp_1_desc:     'Building AI-powered MVPs and proofs of concept for enterprise clients across Latin America. Projects span document processing, AI agents, and data analytics using IBM watsonx technologies, Python, React, and cloud-native tools.',
    exp_2_role:     'Computer Engineering · FING Uruguay',
    exp_2_period:   '2022 – Present',
    exp_2_desc:     'Studying Computer Engineering at the Faculty of Engineering of Uruguay (FING), building a strong foundation in software architecture, systems design, and problem solving.',

    // portfolio.html — projects
    proj_title:     'Projects',
    proj_1_name:    'Soon',
    proj_1_desc:    'Coming soon.',
    proj_link:      'View →',

    // portfolio.html — contact
    contact_title:  'Contact',
    contact_intro:  'Have a project in mind? Let\'s talk.',
    contact_email:  'ismaelborroy@gmail.com',
    contact_linkedin: 'linkedin.com/in/ismaelborroymachado',
  },

  es: {
    // index.html
    name:           'Ismael Borroy',
    tagline:        'Desarrollador de Software',
    hint:           'Haz clic en la puerta para entrar',
    lang_label:     'EN',

    // portfolio.html — nav
    nav_about:      'Sobre mí',
    nav_skills:     'Habilidades',
    nav_experience: 'Experiencia',
    nav_projects:   'Proyectos',
    nav_contact:    'Contacto',

    // portfolio.html — about
    about_title:    'Sobre mí',
    about_p1:       'Soy estudiante de Ingeniería en Computación en FING Uruguay con experiencia práctica construyendo soluciones de IA. He trabajado en MVPs y pruebas de concepto en procesamiento de documentos, agentes de IA y analítica de datos en América Latina.',
    about_p2:       'Me apasionan los agentes de IA, el diseño de sistemas y convertir desafíos técnicos complejos en soluciones claras. Me desenvuelvo bien en entornos multiculturales y orientados al cliente.',

    // portfolio.html — skills
    skills_title:   'Habilidades',

    // portfolio.html — experience
    exp_title:      'Experiencia',
    exp_1_role:     'Desarrollador · IBM',
    exp_1_period:   '2025 – 2026',
    exp_1_desc:     'Construcción de MVPs y pruebas de concepto con IA para clientes empresariales en América Latina. Los proyectos abarcan procesamiento de documentos, agentes de IA y analítica de datos usando tecnologías IBM watsonx, Python, React y herramientas cloud-native.',
    exp_2_role:     'Ingeniería en Computación · FING Uruguay',
    exp_2_period:   '2022 – Presente',
    exp_2_desc:     'Cursando Ingeniería en Computación en la Facultad de Ingeniería de Uruguay (FING), construyendo una base sólida en arquitectura de software, diseño de sistemas y resolución de problemas.',

    // portfolio.html — projects
    proj_title:     'Proyectos',
    proj_1_name:    'Próximamente',
    proj_1_desc:    'Próximamente.',
    proj_link:      'Ver →',

    // portfolio.html — contact
    contact_title:  'Contacto',
    contact_intro:  '¿Tienes un proyecto en mente? Hablemos.',
    contact_email:  'ismaelborroy@gmail.com',
    contact_linkedin: 'linkedin.com/in/ismaelborroymachado',
  }
};

// ── Apply language to the DOM ──────────────────────────────
export function applyLang(lang) {
  const t = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
}

// ── Get stored or default language ────────────────────────
export function getLang() {
  return localStorage.getItem('lang') || 'en';
}

// ── Toggle between en and es ──────────────────────────────
export function toggleLang() {
  const next = getLang() === 'en' ? 'es' : 'en';
  applyLang(next);
  return next;
}

// ── Toggle with wipe animation ────────────────────────────
export function toggleLangAnimated(wipeEl) {
  if (!wipeEl) return toggleLang();

  // Reset to off-screen right, then animate in
  wipeEl.classList.remove('exit');
  wipeEl.classList.add('enter');

  setTimeout(() => {
    // Swap text while panel covers the screen
    toggleLang();

    // Animate out to the left
    wipeEl.classList.remove('enter');
    wipeEl.classList.add('exit');

    // After exit finishes, reset position silently
    setTimeout(() => {
      wipeEl.classList.remove('exit');
    }, 200);
  }, 180);
}
