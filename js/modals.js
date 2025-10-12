// =======================
// Modals & Forms
// =======================

function initModals() {
  // CV modal
  const modal = document.getElementById('cvModal');
  if (modal) {
    document.getElementById('openCV').addEventListener('click', () => modal.classList.add('active'));
    document.getElementById('closeCV').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', e => { 
      if(e.target === modal) modal.classList.remove('active'); 
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Message captured!');
      e.target.reset();
    });
  }
}

// Make function globally available
window.initModals = initModals;