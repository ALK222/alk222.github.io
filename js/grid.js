// =======================
// Skills Configuration
// =======================

const skillsConfig = {
    languages: [
        { name: "Python", icon: "" },
        { name: "Java", icon: "" },
        { name: "C++", icon: "" },
        { name: "Scala", icon: "" }
    ],
    frameworks: [
        { name: "TensorFlow", icon: "" },
        { name: "Pandas", icon: "" },
        { name: "Numpy", icon: "" },
        { name: "Scala Play!", icon: "" }
    ],
    tools: [
        { name: "Git", icon: "" },
        { name: "VS Code", icon: "" },
        { name: "Unity", icon: "" },
        { name: "MongoDB", icon: "" },
        { name: "MariaDB", icon: "" },
        { name: "Linux", icon: "" }
    ]
};

// =======================
// SVG Icon Management
// =======================

const svgCache = new Map();

async function loadSVGIcon(skillName) {
    // Clean the skill name for filename
    const cleanName = skillName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace special characters with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    const svgPath = `assets/svg/${cleanName}.svg`;
    
    // Check cache first
    if (svgCache.has(svgPath)) {
        return svgCache.get(svgPath);
    }
    
    try {
        const response = await fetch(svgPath);
        if (!response.ok) {
            throw new Error(`SVG not found: ${svgPath}`);
        }
        const svgText = await response.text();
        svgCache.set(svgPath, svgText);
        return svgText;
    } catch (error) {
        console.warn(`Failed to load SVG for ${skillName}:`, error);
        // Return a fallback SVG
        return createFallbackSVG(skillName);
    }
}

function createFallbackSVG(skillName) {
    // Create a simple fallback SVG with the first letter
    const firstLetter = skillName.charAt(0).toUpperCase();
    return `
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="50" rx="8" fill="currentColor" opacity="0.1"/>
            <text x="25" y="30" text-anchor="middle" fill="currentColor" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${firstLetter}</text>
        </svg>
    `;
}

// =======================
// Skill Slot Creation
// =======================

async function createSkillSlot(skill, category) {
    const slot = document.createElement('div');
    slot.className = 'skill-slot';
    slot.setAttribute('data-category', category);
    
    // Load SVG icon
    const svgIcon = await loadSVGIcon(skill.name);
    
    slot.innerHTML = `
        <div class="skill-icon">${svgIcon}</div>
        <div class="skill-name">${skill.name}</div>
    `;
    
    slot.addEventListener('click', function() {
        activateSkillSlot(this, skill, category);
    });
    
    return slot;
}

function activateSkillSlot(slot, skill, category) {
    slot.classList.add('skill-active');
    
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    slot.style.transform = `translate(${x}px, ${y}px) scale(0.95)`;
    
    const microGlitch = setInterval(() => {
        slot.style.transform = `translate(${(Math.random()-0.5)*3}px, ${(Math.random()-0.5)*3}px) scale(0.95)`;
    }, 50);
    
    setTimeout(() => {
        slot.style.transform = 'translate(0,0) scale(1)';
        slot.classList.remove('skill-active');
        clearInterval(microGlitch);
        
        console.log(`Selected: ${skill.name} (${category})`);
    }, 200);
}

// =======================
// Grid Initialization
// =======================

async function initializeGrids() {
    const languagesGrid = document.getElementById('languages-grid');
    const frameworksGrid = document.getElementById('frameworks-grid');
    const toolsGrid = document.getElementById('tools-grid');
    
    if (languagesGrid) {
        for (const skill of skillsConfig.languages) {
            const slotElement = await createSkillSlot(skill, 'languages');
            languagesGrid.appendChild(slotElement);
        }
    }
    
    if (frameworksGrid) {
        for (const skill of skillsConfig.frameworks) {
            const slotElement = await createSkillSlot(skill, 'frameworks');
            frameworksGrid.appendChild(slotElement);
        }
    }
    
    if (toolsGrid) {
        for (const skill of skillsConfig.tools) {
            const slotElement = await createSkillSlot(skill, 'tools');
            toolsGrid.appendChild(slotElement);
        }
    }
}

// =======================
// Carousel State
// =======================

let currentSlide = 0;
const totalSlides = 3;
let startX = 0;
let currentX = 0;
let isDragging = false;

// =======================
// DOM Elements (will be initialized later)
// =======================

let carouselTrack, slides, dots, prevBtn, nextBtn;

// =======================
// Carousel Navigation
// =======================

function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    
    // Update carousel track position
    if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    
    // Update active states
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
    
    // Update slide indicators
    const indicators = document.querySelectorAll('.slide-indicator');
    indicators.forEach((indicator, index) => {
        indicator.textContent = `${(index + 1).toString().padStart(2, '0')}/${totalSlides.toString().padStart(2, '0')}`;
    });
    
    currentSlide = slideIndex;
    updateControlButtons();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

function updateControlButtons() {
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
}

// =======================
// Touch & Swipe Handling
// =======================

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    if (carouselTrack) {
        carouselTrack.style.transition = 'none';
    }
}

function handleTouchMove(e) {
    if (!isDragging || !carouselTrack) return;
    
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Add resistance and prevent dragging beyond limits
    const resistance = 0.5;
    let translateX = -currentSlide * 100 + (diff * resistance) / carouselTrack.offsetWidth * 100;
    
    // Prevent dragging beyond first and last slide
    if (currentSlide === 0 && diff > 0) {
        translateX = Math.min(translateX, 0);
    } else if (currentSlide === totalSlides - 1 && diff < 0) {
        translateX = Math.max(translateX, -(totalSlides - 1) * 100);
    }
    
    carouselTrack.style.transform = `translateX(${translateX}%)`;
}

function handleTouchEnd() {
    if (!isDragging || !carouselTrack) return;
    
    isDragging = false;
    carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentSlide > 0) {
            prevSlide();
        } else if (diff < 0 && currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            // Return to current slide if swipe wasn't enough to change
            goToSlide(currentSlide);
        }
    } else {
        // Return to current slide if swipe wasn't enough to change
        goToSlide(currentSlide);
    }
}

// =======================
// DOM Element Initialization
// =======================

function initializeDOMElements() {
    carouselTrack = document.querySelector('.carousel-track');
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    prevBtn = document.querySelector('.prev-btn');
    nextBtn = document.querySelector('.next-btn');
}

// =======================
// Event Listeners
// =======================

function initializeEventListeners() {
    // Control buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Dot indicators
    if (dots) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Touch events
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: true });
        carouselTrack.addEventListener('touchend', handleTouchEnd);
    }
}

// =======================
// Auto-rotation (Optional)
// =======================

function startAutoRotation() {
    setInterval(() => {
        nextSlide();
    }, 8000); // Change slide every 8 seconds
}

// =======================
// Initialization
// =======================

async function initCarousel() {
    // Initialize DOM elements first
    initializeDOMElements();
    
    // Then initialize the grids with SVG loading
    await initializeGrids();
    
    // Initialize event listeners
    initializeEventListeners();
    goToSlide(0); // Start with first slide
    updateControlButtons();
    
    // Optional: Start auto-rotation
    // startAutoRotation();
}

// =======================
// Public API
// =======================

window.SkillsCarousel = {
    init: initCarousel,
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide,
    getCurrentSlide: () => currentSlide,
    // Method to update skills dynamically
    updateSkills: async function(newSkills) {
        Object.assign(skillsConfig, newSkills);
        // Clear existing grids
        document.getElementById('languages-grid').innerHTML = '';
        document.getElementById('frameworks-grid').innerHTML = '';
        document.getElementById('tools-grid').innerHTML = '';
        // Reinitialize grids
        await initializeGrids();
    }
};

// =======================
// Start the Carousel
// =======================

document.addEventListener('DOMContentLoaded', initCarousel);