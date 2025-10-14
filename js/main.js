// =======================
// Main Entry Point
// =======================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  applyTranslations(savedLang);
  initLanguageSelector();
  initNavigation();
  initGlitchAnimation();
  initGitHub();
  initModals();
  // initCarousel();
  
  // Check initial scroll position
  setTimeout(() => {
    const sections = document.querySelectorAll('.section');
    const visibleSection = Array.from(sections).find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
    });
    
    if (visibleSection && visibleSection.id !== 'about') {
      setActiveNavButton(visibleSection.id);
    }
  }, 100);
});