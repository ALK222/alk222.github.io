// =======================
// Navigation & Scroll
// =======================

// Global Variables
const navButtons = document.querySelectorAll('nav button[data-i18n]');
const sections = document.querySelectorAll('.section');

// Smooth scroll function
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    setActiveNavButton(id);
  }
}

// Active Nav Button Highlight
function setActiveNavButton(sectionId) {
  navButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.style.boxShadow = '';
    btn.style.animation = '';
  });
  
  const activeBtn = Array.from(navButtons).find(btn => 
    btn.getAttribute('onclick')?.includes(`'${sectionId}'`)
  );
  
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.animation = 'activePulse 2s ease-in-out infinite';
  }
}

// Section Fade-in Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.7 });

// Enhanced Intersection Observer for nav highlighting
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      setActiveNavButton(id);
    }
  });
}, { 
  threshold: [0.1, 0.5, 0.9],
  rootMargin: '-10% 0px -10% 0px'
});

// Scroll to next section
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('.section');
      const allSections = Array.from(document.querySelectorAll('.section'));
      const currentIndex = allSections.indexOf(currentSection);
      
      if (currentIndex < allSections.length - 1) {
        const nextSection = allSections[currentIndex + 1];
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        allSections[0].scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Scroll position persistence
function initScrollPersistence() {
  window.addEventListener('beforeunload', function() {
    const activeSection = Array.from(sections).find(section => 
      section.getBoundingClientRect().top >= 0 && 
      section.getBoundingClientRect().top <= window.innerHeight * 0.5
    );
    
    if (activeSection) {
      localStorage.setItem('lastActiveSection', activeSection.id);
    }
  });

  window.addEventListener('load', function() {
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    if (lastActiveSection && lastActiveSection !== 'about') {
      setTimeout(() => {
        setActiveNavButton(lastActiveSection);
      }, 50);
    }
  });

  window.addEventListener('popstate', function() {
    setTimeout(() => {
      const visibleSection = Array.from(sections).find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
      });
      
      if (visibleSection) {
        setActiveNavButton(visibleSection.id);
      }
    }, 100);
  });
}

// Initialize navigation
function initNavigation() {
  sections.forEach(section => {
    observer.observe(section);
    sectionObserver.observe(section);
  });
  
  initScrollIndicator();
  initScrollPersistence();
  setActiveNavButton('about');
}