/* =============================================
   HAMBURGER MENU FUNCTIONALITY
   ============================================= */

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

/* =============================================
   ACTIVE NAV LINK HIGHLIGHTING
   ============================================= */

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveLink();

/* =============================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards and skill items
document.querySelectorAll('.project-card, .skill-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

/* =============================================
   LIGHTBOX/IMAGE ZOOM FUNCTIONALITY
   Automatically works for all project pages
   =============================================  */

function openLightbox(lightboxId) {
    const lightbox = document.getElementById(lightboxId);
    if(lightbox) {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox(lightboxId) {
    const lightbox = document.getElementById(lightboxId);
    if(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize lightbox for all lightbox-trigger images
document.addEventListener('DOMContentLoaded', function() {
    // Close lightbox by clicking outside the image
    document.querySelectorAll('.lightbox').forEach(lightbox => {
        lightbox.addEventListener('click', function(e) {
            if(e.target === this) {
                closeLightbox(this.id);
            }
        });
    });

    // Close lightbox with ESC key
    document.addEventListener('keydown', function(e) {
        if(e.key === 'Escape') {
            document.querySelectorAll('.lightbox.active').forEach(lightbox => {
                closeLightbox(lightbox.id);
            });
        }
    });
});

/* =============================================
   IMAGE CAROUSEL FUNCTIONALITY
   For multi-image showcase sections
   =============================================  */

let carouselStates = new Map();

function initCarousel() {
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach((carousel, carouselIndex) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicatorsContainer = carousel.nextElementSibling;
        const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.carousel-dot') : [];
        
        if(slides.length === 0) return;

        // Initialize state for this carousel
        const carouselId = `carousel-${carouselIndex}`;
        carouselStates.set(carouselId, { currentSlide: 0, slides, dots });

        // Show initial slide
        showSlide(0, slides, dots);

        // Previous button
        const prevBtn = carousel.querySelector('.carousel-prev');
        if(prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const state = carouselStates.get(carouselId);
                state.currentSlide = (state.currentSlide - 1 + slides.length) % slides.length;
                showSlide(state.currentSlide, slides, dots);
            });
        }

        // Next button
        const nextBtn = carousel.querySelector('.carousel-next');
        if(nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const state = carouselStates.get(carouselId);
                state.currentSlide = (state.currentSlide + 1) % slides.length;
                showSlide(state.currentSlide, slides, dots);
            });
        }

        // Dot indicators
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const state = carouselStates.get(carouselId);
                state.currentSlide = index;
                showSlide(index, slides, dots);
            });
        });
    });

    // Global keyboard navigation for carousels
    document.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const showcase = document.querySelector('.project-showcase .carousel-wrapper');
            if(showcase) {
                const carousel = showcase;
                const slides = carousel.querySelectorAll('.carousel-slide');
                const indicatorsContainer = carousel.nextElementSibling;
                const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.carousel-dot') : [];
                
                // Find current slide index
                let currentIndex = 0;
                slides.forEach((slide, idx) => {
                    if(slide.classList.contains('active')) {
                        currentIndex = idx;
                    }
                });

                if(e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                } else if(e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % slides.length;
                }

                showSlide(currentIndex, slides, dots);
            }
        }
    });
}

function showSlide(index, slides, dots) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots?.forEach(dot => dot.classList.remove('active'));
    
    if(slides[index]) {
        slides[index].classList.add('active');
    }
    if(dots?.[index]) {
        dots[index].classList.add('active');
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

/* Helper function for carousel dot navigation */
function updateCarousel(index) {
    const showcase = document.querySelector('.project-showcase');
    if(showcase) {
        const carousel = showcase.querySelector('.carousel-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicatorsContainer = carousel.nextElementSibling;
        const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.carousel-dot') : [];
        showSlide(index, slides, dots);
    }
}
