// Homepage Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize all homepage functionality
    initNavbar();
    initSmoothScrolling();
    initStatsCounters();
    initButtonEffects();
    initParallaxEffects();
    initServiceCardHovers();
    initLoadingAnimations();
    initMouseParallax();
    initHeroAnimations();
    initPerformanceOptimizations();
    initMagneticButtons();
    initScrollAnimations();
    initGradientAnimations();
});

// Navbar scroll effects
function initNavbar() {
    const navbar = document.querySelector('.navbar');
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
    
    // Initial check
    handleScroll();
}

// Smooth scrolling for navigation links (only for anchor links)
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Stats counter animation with intersection observer
function initStatsCounters() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '50px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                animateStatCounter(entry.target);
                // Unobserve after animation to prevent re-triggering
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all stat items
    document.querySelectorAll('.stat-item').forEach(item => {
        statsObserver.observe(item);
    });
}

function animateStatCounter(statItem) {
    const statValue = statItem.querySelector('.stat-value');
    const target = parseInt(statItem.getAttribute('data-target'));
    const suffix = statItem.getAttribute('data-suffix') || '';
    
    let current = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    function updateCounter() {
        current += increment;
        if (current >= target) {
            statValue.textContent = target + suffix;
        } else {
            statValue.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Button ripple effects
function initButtonEffects() {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
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
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple animation if not already defined
    if (!document.querySelector('#homepage-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'homepage-ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
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

// Parallax effects for background elements
function initParallaxEffects() {
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.bg-blob, .bg-orb');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            
            // Get current transform and preserve other transformations
            const currentTransform = element.style.transform || '';
            const translateYRegex = /translateY\([^)]*\)/;
            const newTransform = currentTransform.replace(translateYRegex, '') + ` translateY(${yPos}px)`;
            
            element.style.transform = newTransform;
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

// Service card hover effects
function initServiceCardHovers() {
    document.querySelectorAll('.service-card').forEach(card => {
        const gradientOverlay = card.querySelector('.service-gradient-overlay');
        const iconBg = card.querySelector('.service-icon-bg');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.1)';
            
            if (gradientOverlay) {
                gradientOverlay.style.opacity = '1';
            }
            
            if (iconBg) {
                iconBg.style.transform = 'rotate(0deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            
            if (gradientOverlay) {
                gradientOverlay.style.opacity = '0';
            }
            
            if (iconBg) {
                iconBg.style.transform = 'rotate(-5deg) scale(1)';
            }
        });
    });
}

// Loading animations and entrance effects
function initLoadingAnimations() {
    // Add loaded class to body when everything is loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger entrance animations for hero cards
        const heroCards = document.querySelectorAll('.hero-card');
        heroCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                if (card.style.transform) {
                    card.style.transform = card.style.transform.replace(/translateY\([^)]*\)/, 'translateY(0)');
                }
            }, index * 100 + 500); // Delay after page load
        });
    });
    
    // Intersection Observer for scroll-triggered animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe elements for scroll animations
    document.querySelectorAll('.service-card, .section-header').forEach(el => {
        animationObserver.observe(el);
    });
}

// Mouse movement parallax effect for hero section
function initMouseParallax() {
    const hero = document.querySelector('.hero');
    const heroCards = document.querySelectorAll('.hero-card');
    
    if (!hero || heroCards.length === 0) return;
    
    hero.addEventListener('mousemove', throttle((e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        heroCards.forEach((card, index) => {
            const depth = (index + 1) * 0.5;
            const moveX = deltaX * depth * 10;
            const moveY = deltaY * depth * 10;
            
            // Preserve existing transform and add mouse movement
            const currentTransform = card.style.transform || '';
            const mouseTransform = `translate(${moveX}px, ${moveY}px)`;
            
            // Remove existing mouse translate and add new one
            const cleanTransform = currentTransform.replace(/translate\([^)]*\)/g, '');
            card.style.transform = cleanTransform + ' ' + mouseTransform;
        });
    }, 16));
    
    hero.addEventListener('mouseleave', () => {
        heroCards.forEach(card => {
            // Remove mouse translate but keep other transforms
            const currentTransform = card.style.transform || '';
            card.style.transform = currentTransform.replace(/translate\([^)]*\)/g, '');
        });
    });
}

// Hero section specific animations
function initHeroAnimations() {
    // Animate hero metrics cards
    const heroCards = document.querySelectorAll('.hero-card');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '50px'
    };
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-hero-animated')) {
                entry.target.setAttribute('data-hero-animated', 'true');
                
                // Animate the metric value
                const metricElement = entry.target.querySelector('.card-metric');
                if (metricElement) {
                    animateHeroMetric(metricElement);
                }
                
                heroObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    heroCards.forEach(card => {
        heroObserver.observe(card);
    });
}

function animateHeroMetric(metricElement) {
    const text = metricElement.textContent;
    const numberMatch = text.match(/(\d+)/);
    
    if (numberMatch) {
        const targetNumber = parseInt(numberMatch[1]);
        const prefix = text.substring(0, text.indexOf(numberMatch[1]));
        const suffix = text.substring(text.indexOf(numberMatch[1]) + numberMatch[1].length);
        
        let current = 0;
        const increment = targetNumber / 60; // 60 frames for 1 second
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                metricElement.textContent = prefix + targetNumber + suffix;
                clearInterval(counter);
            } else {
                metricElement.textContent = prefix + Math.floor(current) + suffix;
            }
        }, 16);
    }
}

// Performance optimization: Reduce animations on low-end devices
function initPerformanceOptimizations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable complex animations
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.querySelectorAll('.bg-blob, .bg-orb').forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    // Disable animations on very small screens or low-powered devices
    if (window.innerWidth < 480 || navigator.hardwareConcurrency < 4) {
        document.querySelectorAll('.bg-blob, .bg-orb').forEach(el => {
            el.style.opacity = '0.02';
            el.style.animation = 'none';
        });
    }
}

// Intersection Observer for fade-in animations
function initScrollRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Enhanced CTA button interactions
function initCTAEnhancements() {
    const ctaButtons = document.querySelectorAll('.hero-ctas .btn-primary, .hero-ctas .btn-secondary, .cta-buttons .btn-primary, .cta-buttons .btn-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling for missing elements
function safelyInitialize() {
    try {
        // Re-initialize icons if they failed to load
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.warn('Icon initialization failed:', error);
    }
}

// Initialize additional features after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initScrollRevealAnimations();
        initCTAEnhancements();
    }, 1000);
});

// Retry icon loading if initial attempt failed
setTimeout(safelyInitialize, 2000);

// Add mobile-specific optimizations
function initMobileOptimizations() {
    if (window.innerWidth < 768) {
        // Reduce animations on mobile for better performance
        document.querySelectorAll('.hero-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform += ' scale(1.02)';
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transform = card.style.transform.replace(' scale(1.02)', '');
                }, 150);
            });
        });
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// Keyboard navigation enhancements
function initKeyboardNavigation() {
    // Make service cards focusable
    document.querySelectorAll('.service-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('focus', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('blur', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
        });
    });
    
    // Enhanced button focus styles
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('focus', () => {
            button.style.outline = '3px solid rgba(79, 172, 254, 0.5)';
            button.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', () => {
            button.style.outline = 'none';
        });
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initKeyboardNavigation);

// Magnetic button effects
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');
    
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
            
            // Apply magnetic effect
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Enhanced scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.service-card, .stats-item, .testimonial-card, .section-badge');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    let visibleCount = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = (visibleCount % 3) * 100;
                visibleCount++;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    
                    if (entry.target.classList.contains('service-card')) {
                        entry.target.style.animation = 'cardBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both';
                    }
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add initial states
    animateElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px) scale(0.95)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
    
    // Add bounce animation
    if (!document.querySelector('#card-bounce-animation')) {
        const style = document.createElement('style');
        style.id = 'card-bounce-animation';
        style.textContent = `
            @keyframes cardBounce {
                0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.9);
                }
                60% {
                    transform: translateY(-5px) scale(1.02);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Gradient animations
function initGradientAnimations() {
    // Animate gradient backgrounds on hover
    const gradientElements = document.querySelectorAll('.hero-card, .service-icon-bg');
    
    gradientElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.filter = 'hue-rotate(10deg) brightness(1.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.filter = '';
        });
    });
}