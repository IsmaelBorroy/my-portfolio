// ── Translation strings ────────────────────────────────────
export const translations = {
  en: {
    // main.html
    name:           'Ismael Borroy',
    tagline:        'Software Developer',
    hint:           'Click the door to enter',
    lang_label:     'ES',

    // index.html — nav
    nav_about:      'About',
    nav_skills:     'Skills',
    nav_experience: 'Experience',
    nav_projects:   'Projects',
    nav_contact:    'Contact',

    // index.html — about
    about_title:    'About Me',
    about_p1:       'Placeholder — tell the world who you are.',
    about_p2:       'Placeholder — your background, passion, and what drives you.',

    // index.html — skills
    skills_title:   'Skills',

    // index.html — experience
    exp_title:      'Experience',
    exp_1_role:     'Role · Company',
    exp_1_period:   '2022 – Present',
    exp_1_desc:     'Placeholder — describe what you did and the impact you made.',
    exp_2_role:     'Role · Company',
    exp_2_period:   '2020 – 2022',
    exp_2_desc:     'Placeholder — describe what you did and the impact you made.',

    // index.html — projects
    proj_title:     'Projects',
    proj_1_name:    'Project One',
    proj_1_desc:    'Placeholder — short description of the project and technologies used.',
    proj_2_name:    'Project Two',
    proj_2_desc:    'Placeholder — short description of the project and technologies used.',
    proj_3_name:    'Project Three',
    proj_3_desc:    'Placeholder — short description of the project and technologies used.',
    proj_link:      'View →',

    // index.html — contact
    contact_title:  'Contact',
    contact_intro:  'Have a project in mind? Let\'s talk.',
    contact_email:  'hello@ismaelborroy.com',
  },

  es: {
    // main.html
    name:           'Ismael Borroy',
    tagline:        'Desarrollador de Software',
    hint:           'Haz clic en la puerta para entrar',
    lang_label:     'EN',

    // index.html — nav
    nav_about:      'Sobre mí',
    nav_skills:     'Habilidades',
    nav_experience: 'Experiencia',
    nav_projects:   'Proyectos',
    nav_contact:    'Contacto',

    // index.html — about
    about_title:    'Sobre mí',
    about_p1:       'Placeholder — cuéntale al mundo quién eres.',
    about_p2:       'Placeholder — tu trayectoria, pasión y lo que te impulsa.',

    // index.html — skills
    skills_title:   'Habilidades',

    // index.html — experience
    exp_title:      'Experiencia',
    exp_1_role:     'Rol · Empresa',
    exp_1_period:   '2022 – Presente',
    exp_1_desc:     'Placeholder — describe lo que hiciste y el impacto que generaste.',
    exp_2_role:     'Rol · Empresa',
    exp_2_period:   '2020 – 2022',
    exp_2_desc:     'Placeholder — describe lo que hiciste y el impacto que generaste.',

    // index.html — projects
    proj_title:     'Proyectos',
    proj_1_name:    'Proyecto Uno',
    proj_1_desc:    'Placeholder — descripción breve del proyecto y tecnologías usadas.',
    proj_2_name:    'Proyecto Dos',
    proj_2_desc:    'Placeholder — descripción breve del proyecto y tecnologías usadas.',
    proj_3_name:    'Proyecto Tres',
    proj_3_desc:    'Placeholder — descripción breve del proyecto y tecnologías usadas.',
    proj_link:      'Ver →',

    // index.html — contact
    contact_title:  'Contacto',
    contact_intro:  '¿Tienes un proyecto en mente? Hablemos.',
    contact_email:  'hello@ismaelborroy.com',
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
