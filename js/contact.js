// Contact Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    initFormValidation();
    initFAQAccordion();
    initContactMethods();
    initFormSubmission();
    initScrollAnimations();
    initConsultationCard();
});

// Form validation
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Real-time validation for each field
    inputs.forEach(input => {
        // Validation on blur
        input.addEventListener('blur', () => validateField(input));
        
        // Clear errors on focus
        input.addEventListener('focus', () => clearFieldError(input));
        
        // Real-time validation for certain fields
        if (input.type === 'email' || input.name === 'phone') {
            input.addEventListener('input', debounce(() => validateField(input), 500));
        }
    });
    
    // Prevent form submission if invalid
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateAndSubmitForm();
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Specific field validations
    if (value && !isValid === false) { // Only validate if field has value
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = `${getFieldLabel(fieldName)} must be at least 2 characters`;
                }
                break;
                
            case 'company':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Company name must be at least 2 characters';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide more details (at least 10 characters)';
                }
                break;
        }
    }
    
    // Update field appearance and error message
    updateFieldState(field, isValid, errorMessage);
    return isValid;
}

function updateFieldState(field, isValid, errorMessage) {
    const errorElement = document.getElementById(field.name + 'Error');
    
    // Remove existing states
    field.classList.remove('error', 'success');
    
    if (field.value.trim()) {
        if (isValid) {
            field.classList.add('success');
            if (errorElement) errorElement.textContent = '';
        } else {
            field.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
        }
    } else if (errorElement) {
        errorElement.textContent = errorMessage;
    }
}

function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement && !field.value.trim()) {
        errorElement.textContent = '';
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email address',
        phone: 'Phone number',
        company: 'Company name',
        message: 'Project details'
    };
    return labels[fieldName] || fieldName;
}

function validateAndSubmitForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Check if at least one service is selected
    const serviceCheckboxes = form.querySelectorAll('input[name="services"]:checked');
    if (serviceCheckboxes.length === 0) {
        // Optional: You can make this required if needed
        // isFormValid = false;
    }
    
    if (isFormValid) {
        submitForm(form);
    } else {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

function submitForm(form) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'block';
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnIcon.style.display = 'block';
        btnLoader.style.display = 'none';
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        form.reset();
        
        // Clear all validation states
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
            const errorElement = document.getElementById(field.name + 'Error');
            if (errorElement) errorElement.textContent = '';
        });
        
    }, 2000); // Simulate 2 second delay
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Contact methods interactions
function initContactMethods() {
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', () => {
            const methodInfo = method.querySelector('.method-info p').textContent;
            
            if (methodInfo.includes('@')) {
                // Email
                window.location.href = `mailto:${methodInfo}`;
            } else if (methodInfo.includes('+') || methodInfo.match(/\d/)) {
                // Phone
                window.location.href = `tel:${methodInfo.replace(/\D/g, '')}`;
            } else if (methodInfo.includes('consultation')) {
                // Scroll to form
                document.getElementById('contact-form').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
        
        // Hover effects
        method.addEventListener('mouseenter', () => {
            method.style.transform = 'translateY(-2px)';
            method.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
        });
        
        method.addEventListener('mouseleave', () => {
            method.style.transform = 'translateY(0)';
            method.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Form submission handling
function initFormSubmission() {
    // You can replace this with actual form submission logic
    console.log('Form submission initialized');
}

// Success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 5000);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Make closeSuccessModal globally available
window.closeSuccessModal = closeSuccessModal;

// Scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.info-card, .faq-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`;
        observer.observe(element);
    });
}

// Consultation card interactions
function initConsultationCard() {
    const consultationCard = document.querySelector('.consultation-card');
    const consultationCTA = document.querySelector('.consultation-cta');
    
    if (!consultationCard) return;
    
    consultationCard.addEventListener('mouseenter', () => {
        consultationCard.style.transform = 'translateY(-8px) scale(1.02)';
        consultationCard.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
    });
    
    consultationCard.addEventListener('mouseleave', () => {
        consultationCard.style.transform = 'translateY(0) scale(1)';
        consultationCard.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
    });
    
    // Enhanced CTA button interaction
    if (consultationCTA) {
        consultationCTA.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add ripple effect
            createRippleEffect(consultationCTA, e);
            
            // Scroll to form after brief delay
            setTimeout(() => {
                document.getElementById('contact-form').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 200);
        });
    }
}

// Enhanced form field interactions
function initEnhancedFieldInteractions() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (!input || !label) return;
        
        // Floating label effect
        input.addEventListener('focus', () => {
            label.style.transform = 'translateY(-20px) scale(0.85)';
            label.style.color = '#4FACFE';
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.style.transform = 'translateY(0) scale(1)';
                label.style.color = '#1C1C1E';
            }
        });
        
        // Check if field has value on load
        if (input.value) {
            label.style.transform = 'translateY(-20px) scale(0.85)';
        }
    });
}

// Utility function for ripple effect
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
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
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
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

// Initialize enhanced interactions
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initEnhancedFieldInteractions, 500);
});

// Auto-resize textarea
function initTextareaAutoResize() {
    const textarea = document.getElementById('message');
    
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }
}

// Character counter for textarea
function initCharacterCounter() {
    const textarea = document.getElementById('message');
    
    if (textarea) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 12px;
            color: #3A3A3C;
            text-align: right;
            margin-top: 4px;
        `;
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            counter.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#FF6B6B';
            } else {
                counter.style.color = '#3A3A3C';
            }
        });
        
        // Initial count
        counter.textContent = `0/${maxLength} characters`;
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initTextareaAutoResize();
        initCharacterCounter();
    }, 1000);
});

// Form progress indicator
function initFormProgress() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Create progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';
    progressContainer.style.cssText = `
        width: 100%;
        height: 4px;
        background: #F8F9FA;
        border-radius: 2px;
        margin-bottom: 24px;
        overflow: hidden;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.cssText = `
        height: 100%;
        background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
        width: 0%;
        transition: width 0.3s ease;
        border-radius: 2px;
    `;
    
    progressContainer.appendChild(progressBar);
    form.insertBefore(progressContainer, form.firstChild);
    
    // Update progress
    function updateProgress() {
        const filledFields = Array.from(requiredFields).filter(field => field.value.trim());
        const progress = (filledFields.length / requiredFields.length) * 100;
        progressBar.style.width = progress + '%';
    }
    
    // Listen to field changes
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });
}

// Initialize form progress
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFormProgress, 500);
});