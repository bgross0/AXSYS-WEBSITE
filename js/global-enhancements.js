// Global JavaScript Enhancements
// This file applies modern interactions to ALL pages for consistency

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all global enhancements
    initGlobalMagneticButtons();
    initGlobalScrollAnimations();
    initGlobalGlassmorphism();
    initGlobalRippleEffects();
    initGlobalParallax();
    initGlobalNavbarEffects();
});

// Global Magnetic Button Effects
function initGlobalMagneticButtons() {
    const magneticButtons = document.querySelectorAll(
        '.btn-primary, .btn-secondary, .nav-cta, button, [type="submit"], [type="button"], .button, .btn'
    );
    
    magneticButtons.forEach(button => {
        let boundingRect = button.getBoundingClientRect();
        
        // Update bounding rect on scroll/resize
        const updateRect = () => {
            boundingRect = button.getBoundingClientRect();
        };
        
        window.addEventListener('scroll', updateRect);
        window.addEventListener('resize', updateRect);
        
        button.addEventListener('mousemove', (e) => {
            const x = e.clientX - boundingRect.left - boundingRect.width / 2;
            const y = e.clientY - boundingRect.top - boundingRect.height / 2;
            
            // Apply magnetic effect with spring animation
            const transform = button.style.transform || '';
            const baseTransform = transform.replace(/translate\([^)]*\)|scale\([^)]*\)/g, '').trim();
            button.style.transform = `${baseTransform} translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            const transform = button.style.transform || '';
            const baseTransform = transform.replace(/translate\([^)]*\)|scale\([^)]*\)/g, '').trim();
            button.style.transform = baseTransform;
        });
        
        // Add focus effects for accessibility
        button.addEventListener('focus', () => {
            button.style.outline = '3px solid rgba(14, 165, 233, 0.5)';
            button.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', () => {
            button.style.outline = 'none';
        });
    });
}

// Global Scroll Animations
function initGlobalScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.card, .service-card, .portfolio-item, .case-study-card, .testimonial-card, ' +
        '.team-member, .value-card, .mission-card, .info-card, .stat-card, .hero-stat, ' +
        '.results-card, .consultation-card, .floating-card, .timeline-item, .faq-item'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    let visibleCount = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                const delay = (visibleCount % 3) * 100;
                visibleCount++;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.classList.add('animate-in');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add initial states
    animateElements.forEach((element) => {
        if (!element.hasAttribute('data-animated')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(element);
        }
    });
}

// Global Glassmorphism Hover Effects
function initGlobalGlassmorphism() {
    const glassElements = document.querySelectorAll(
        '.card, .service-card, .portfolio-item, .case-study-card, .testimonial-card, ' +
        '.team-member, .value-card, .mission-card, .info-card, .stat-card, .hero-stat, ' +
        '.results-card, .consultation-card, .floating-card, .contact-method'
    );
    
    glassElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const currentTransform = element.style.transform || '';
            if (!currentTransform.includes('translateY')) {
                element.style.transform = `${currentTransform} translateY(-8px) scale(1.02)`;
            }
            element.style.boxShadow = '0 20px 60px rgba(139, 92, 246, 0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            const transform = element.style.transform || '';
            element.style.transform = transform.replace(/translateY\([^)]*\)|scale\(1\.02\)/g, '').trim();
            element.style.boxShadow = '';
        });
    });
}

// Global Ripple Effects
function initGlobalRippleEffects() {
    const rippleElements = document.querySelectorAll(
        '.btn-primary, .btn-secondary, button, [type="submit"], [type="button"], .button, .btn'
    );
    
    rippleElements.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
}

function createRippleEffect(button, event) {
    // Create ripple element
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: globalRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple animation if not already defined
    if (!document.querySelector('#global-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'global-ripple-style';
        style.textContent = `
            @keyframes globalRipple {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ensure button has relative positioning
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    
    // Add ripple to button
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Global Parallax Effects
function initGlobalParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach((element) => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Global Navbar Effects
function initGlobalNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let isScrolled = false;
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const shouldBeScrolled = scrollY > 50;
        
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            if (isScrolled) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Add magnetic effect to nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
}

// Performance optimizations
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-spring', '0.01ms');
}

// Mobile touch optimizations
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
    
    // Add touch feedback to buttons
    const touchElements = document.querySelectorAll(
        '.btn-primary, .btn-secondary, button, .card, .portfolio-item'
    );
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        });
    });
}