// About Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize about page functionality
    initTeamInteractions();
    initTimelineAnimations();
    initFloatingCards();
    initStatsAnimation();
    initScrollReveal();
    initParallaxCards();
});

// Team member interactions
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const overlay = member.querySelector('.member-overlay');
        const avatar = member.querySelector('.member-avatar');
        const socialLinks = member.querySelectorAll('.social-link');
        
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'translateY(-8px)';
            if (avatar) {
                avatar.style.transform = 'scale(1.05)';
            }
        });
        
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'translateY(0)';
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
        
        // Social link interactions
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'scale(1.2)';
                link.style.background = 'rgba(255, 255, 255, 0.4)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'scale(1)';
                link.style.background = 'rgba(255, 255, 255, 0.2)';
            });
        });
    });
}

// Timeline scroll animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '50px'
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add special effect to marker
                const marker = entry.target.querySelector('.timeline-marker');
                if (marker) {
                    setTimeout(() => {
                        marker.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            marker.style.transform = 'scale(1)';
                        }, 200);
                    }, 300);
                }
                
                // Unobserve after animation
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Floating cards animation
function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add mouse interaction
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) scale(1.02)';
            card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        });
        
        // Add subtle rotation on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const rotateX = (e.clientY - centerY) / 10;
            const rotateY = (centerX - e.clientX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// Stats animation for about hero
function initStatsAnimation() {
    const statCards = document.querySelectorAll('.stat-card');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '50px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                animateStatNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (statCards.length > 0) {
        statsObserver.observe(statCards[0]);
    }
    
    function animateStatNumbers() {
        statNumbers.forEach((statNumber, index) => {
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/\d/g, '');
            
            let current = 0;
            const increment = number / 60; // 60 frames for 1 second at 60fps
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= number) {
                    statNumber.textContent = number + suffix;
                    clearInterval(counter);
                } else {
                    statNumber.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        });
    }
}

// Scroll reveal animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.mission-card, .value-card, .timeline-content');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '50px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-animate');
                
                // Add stagger effect for value cards
                if (entry.target.classList.contains('value-card')) {
                    const valueCards = document.querySelectorAll('.value-card');
                    valueCards.forEach((card, index) => {
                        if (card === entry.target) {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 100);
                        }
                    });
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Parallax effect for hero cards
function initParallaxCards() {
    const heroSection = document.querySelector('.about-hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (!heroSection || floatingCards.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingCards.forEach((card, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = rate * speed;
            
            // Preserve existing transforms while adding parallax
            const currentTransform = card.style.transform || '';
            const newTransform = currentTransform.includes('translateY') 
                ? currentTransform.replace(/translateY\([^)]*\)/, `translateY(${yPos}px)`)
                : currentTransform + ` translateY(${yPos}px)`;
            
            card.style.transform = newTransform;
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

// Enhanced value card interactions
function initValueCardEffects() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        const icon = card.querySelector('.value-icon');
        
        card.addEventListener('mouseenter', () => {
            // Create ripple effect
            createValueCardRipple(card);
            
            // Icon animation
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

function createValueCardRipple(card) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        animation: valueRipple 0.8s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple animation if not already defined
    if (!document.querySelector('#value-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'value-ripple-style';
        style.textContent = `
            @keyframes valueRipple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    card.style.position = 'relative';
    card.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Initialize enhanced effects
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initValueCardEffects, 500);
});

// Mission section parallax effect
function initMissionParallax() {
    const missionCards = document.querySelectorAll('.mission-card');
    
    if (missionCards.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        missionCards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            
            card.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
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

// Initialize mission parallax
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initMissionParallax, 1000);
});

// Add loading state management
window.addEventListener('load', () => {
    // Ensure all elements are visible
    document.querySelectorAll('.floating-card, .stat-card, .mission-card').forEach(element => {
        element.style.opacity = '1';
    });
    
    // Trigger entrance animations
    const animatedElements = document.querySelectorAll('.about-hero-content, .about-hero-visual');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
});

// Performance optimization for mobile
function initMobileOptimizations() {
    if (window.innerWidth < 768) {
        // Reduce animations on mobile
        document.querySelectorAll('.floating-card').forEach(card => {
            card.style.animation = 'none';
        });
        
        // Simplify hover effects
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('touchstart', () => {
                member.style.transform = 'translateY(-4px)';
            });
            
            member.addEventListener('touchend', () => {
                setTimeout(() => {
                    member.style.transform = 'translateY(0)';
                }, 150);
            });
        });
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', initMobileOptimizations);