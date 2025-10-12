// =======================
// Language Switcher
// =======================

const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem('lang') || 'en';

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) el.placeholder = translations[lang][key];
  });
  
  const titleEl = document.querySelector('title[data-i18n="title"]');
  if (titleEl && translations[lang]["title"]) {
    titleEl.textContent = translations[lang]["title"];
  }
}

function initLanguageSelector() {
  langSelect.value = savedLang;
  
  langSelect.addEventListener('change', e => {
    const lang = e.target.value;
    localStorage.setItem('lang', lang);
    applyTranslations(lang);
    updateGlitchTitles(lang);
    
    // Restart glitch interval with new translations
    if (window.glitchInterval) {
      clearInterval(window.glitchInterval);
      window.glitchInterval = setInterval(updateGlitchTitle, 2500);
    }
  });
}