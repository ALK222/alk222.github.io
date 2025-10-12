// =======================
// Glitch Job Titles
// =======================

const hero = document.querySelector('.hero.glitch');
const prefix = document.getElementById('glitchPrefix');
const suffix = document.getElementById('glitchSuffix');

let glitchTitles = [];
let glitchIndex = 0;

function updateGlitchTitles(lang) {
  glitchTitles = translations[lang]["glitch.titles"];
  glitchIndex = 0;
  const { title, pre, suf } = glitchTitles[glitchIndex];
  hero.textContent = title;
  hero.setAttribute('data-text', title);
  prefix.textContent = pre;
  suffix.textContent = suf;
}

function updateGlitchTitle() {
  glitchIndex = (glitchIndex + 1) % glitchTitles.length;
  const { title, pre, suf } = glitchTitles[glitchIndex];

  hero.classList.add('glitch-burst');

  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  hero.style.transform = `translate(${x}px, ${y}px)`;
  hero.style.setProperty('--before-x', `${(Math.random()-0.5)*15}px`);
  hero.style.setProperty('--after-x', `${(Math.random()-0.5)*15}px`);
  hero.style.setProperty('--before-y', `${(Math.random()-0.5)*5}px`);
  hero.style.setProperty('--after-y', `${(Math.random()-0.5)*5}px`);

  const microGlitch = setInterval(() => {
    hero.style.transform = `translate(${(Math.random()-0.5)*10}px, ${(Math.random()-0.5)*10}px)`;
    hero.style.setProperty('--before-x', `${(Math.random()-0.5)*15}px`);
    hero.style.setProperty('--after-x', `${(Math.random()-0.5)*15}px`);
  }, 50);

  setTimeout(() => {
    hero.textContent = title;
    hero.setAttribute('data-text', title);
    prefix.textContent = pre;
    suffix.textContent = suf;

    hero.style.transform = 'translate(0,0)';
    hero.style.setProperty('--before-x','0px');
    hero.style.setProperty('--after-x','0px');
    hero.style.setProperty('--before-y','0px');
    hero.style.setProperty('--after-y','0px');
    hero.classList.remove('glitch-burst');
    clearInterval(microGlitch);
  }, 300);
}

function initGlitchAnimation() {
  if (hero && prefix && suffix) {
    updateGlitchTitles(savedLang);
    window.glitchInterval = setInterval(updateGlitchTitle, 2500);
  }
}