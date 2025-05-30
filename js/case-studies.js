// Case Studies Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize case studies page functionality
    initFilterTabs();
    initCaseStudyModals();
    initScrollAnimations();
    initHeroStatsAnimation();
    initTestimonialInteractions();
    initCaseStudyCards();
});

// Filter functionality
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter cards with animation
            filterCaseStudies(filter, caseStudyCards);
            
            // Add ripple effect to tab
            createTabRipple(tab);
        });
    });
}

function filterCaseStudies(filter, cards) {
    cards.forEach((card, index) => {
        const categories = card.getAttribute('data-category').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        // Add filtering class for animation
        card.classList.add('filtering');
        
        if (shouldShow) {
            // Show card with delay for stagger effect
            setTimeout(() => {
                card.classList.remove('hidden', 'fade-out');
                card.classList.add('fade-in');
                card.style.display = 'block';
            }, index * 100);
        } else {
            // Hide card
            card.classList.add('fade-out');
            card.classList.remove('fade-in');
            
            setTimeout(() => {
                card.classList.add('hidden');
                if (filter !== 'all') {
                    card.style.display = 'none';
                }
            }, 300);
        }
        
        // Remove filtering class after animation
        setTimeout(() => {
            card.classList.remove('filtering');
        }, 500);
    });
}

function createTabRipple(tab) {
    const ripple = document.createElement('span');
    const rect = tab.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: tabRipple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation if not already defined
    if (!document.querySelector('#tab-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'tab-ripple-style';
        style.textContent = `
            @keyframes tabRipple {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    tab.style.position = 'relative';
    tab.style.overflow = 'hidden';
    tab.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Case study modal functionality
function initCaseStudyModals() {
    const viewButtons = document.querySelectorAll('.view-case-study');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const caseId = button.getAttribute('data-case');
            openCaseStudyModal(caseId);
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('caseStudyModal');
        if (e.target === modal) {
            closeCaseStudyModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCaseStudyModal();
        }
    });
}

function openCaseStudyModal(caseId) {
    const modal = document.getElementById('caseStudyModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // Get case study data
    const caseData = getCaseStudyData(caseId);
    
    if (!caseData) return;
    
    // Populate modal content
    modalTitle.textContent = caseData.title;
    modalBody.innerHTML = generateModalContent(caseData);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeCaseStudyModal() {
    const modal = document.getElementById('caseStudyModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Make closeCaseStudyModal globally available
window.closeCaseStudyModal = closeCaseStudyModal;

function getCaseStudyData(caseId) {
    const caseStudies = {
        'retail-automation': {
            title: 'E-commerce Giant Automates Customer Service',
            industry: 'Retail & E-commerce',
            challenge: 'A leading online retailer was struggling with overwhelming customer service requests, with response times averaging 4-6 hours and customer satisfaction scores dropping below industry standards.',
            solution: 'We implemented an AI-powered chatbot system integrated with their existing CRM, featuring natural language processing, sentiment analysis, and automated order processing capabilities.',
            implementation: 'The project was completed in 3 phases over 4 months: Phase 1 focused on chatbot development and training, Phase 2 integrated the system with existing workflows, and Phase 3 included advanced analytics and reporting.',
            results: [
                { label: 'ROI Increase', value: '+340%' },
                { label: 'Response Time Reduction', value: '85%' },
                { label: 'Annual Cost Savings', value: '$1.2M' },
                { label: 'Customer Satisfaction', value: '+65%' }
            ],
            technologies: ['Natural Language Processing', 'Sentiment Analysis', 'CRM Integration', 'Real-time Analytics'],
            timeline: '4 months',
            teamSize: '6 specialists'
        },
        'healthcare-ai': {
            title: 'Medical Practice Streamlines Patient Management',
            industry: 'Healthcare',
            challenge: 'A multi-location medical practice faced inefficiencies in patient scheduling, long wait times, and administrative overhead consuming 60% of staff time.',
            solution: 'We developed an AI-powered patient management system with intelligent scheduling, automated appointment reminders, and diagnostic assistance tools.',
            implementation: 'Deployed across 5 locations with comprehensive staff training, HIPAA compliance certification, and integration with existing electronic health records.',
            results: [
                { label: 'Efficiency Increase', value: '+225%' },
                { label: 'Diagnostic Accuracy', value: '95%' },
                { label: 'Admin Time Reduction', value: '60%' },
                { label: 'Patient Wait Time', value: '-45%' }
            ],
            technologies: ['Machine Learning', 'Healthcare AI', 'HIPAA Compliance', 'EHR Integration'],
            timeline: '6 months',
            teamSize: '8 specialists'
        },
        'finance-automation': {
            title: 'Financial Firm Automates Risk Assessment',
            industry: 'Finance & Banking',
            challenge: 'A financial services firm needed to process risk assessments faster while maintaining accuracy, as manual processes were taking 3-5 days per assessment.',
            solution: 'Built an intelligent risk assessment platform with real-time data analysis, automated compliance checking, and predictive risk modeling.',
            implementation: 'Implemented with full regulatory compliance, staff training, and integration with existing financial systems and databases.',
            results: [
                { label: 'Processing Speed', value: '+400%' },
                { label: 'Assessment Accuracy', value: '98%' },
                { label: 'Annual Savings', value: '$800K' },
                { label: 'Compliance Score', value: '100%' }
            ],
            technologies: ['Risk Analytics', 'Real-time Processing', 'Regulatory Compliance', 'Predictive Modeling'],
            timeline: '5 months',
            teamSize: '7 specialists'
        },
        'manufacturing-iot': {
            title: 'Smart Factory Optimization with IoT & AI',
            industry: 'Manufacturing',
            challenge: 'A manufacturing facility experienced frequent equipment failures, quality inconsistencies, and production downtime costing $50K per incident.',
            solution: 'Implemented IoT sensors, predictive maintenance algorithms, and quality control AI systems for real-time monitoring and optimization.',
            implementation: 'Deployed across 200+ machines with edge computing infrastructure, staff training, and integration with existing ERP systems.',
            results: [
                { label: 'Downtime Reduction', value: '70%' },
                { label: 'Productivity Increase', value: '+180%' },
                { label: 'Annual Savings', value: '$2.1M' },
                { label: 'Quality Improvement', value: '+95%' }
            ],
            technologies: ['IoT Integration', 'Predictive Maintenance', 'Edge Computing', 'Quality Control AI'],
            timeline: '8 months',
            teamSize: '10 specialists'
        },
        'inventory-optimization': {
            title: 'AI-Powered Inventory Optimization',
            industry: 'Retail',
            challenge: 'A retail chain struggled with inventory management, experiencing frequent stockouts and excess inventory tying up $2M in capital.',
            solution: 'Developed machine learning models for demand forecasting, automated reordering systems, and supply chain optimization algorithms.',
            implementation: 'Rolled out across 150 stores with real-time inventory tracking, supplier integration, and staff training programs.',
            results: [
                { label: 'Stockout Reduction', value: '85%' },
                { label: 'Excess Inventory', value: '-40%' },
                { label: 'Forecast Accuracy', value: '+250%' },
                { label: 'Capital Efficiency', value: '+120%' }
            ],
            technologies: ['Demand Forecasting', 'Machine Learning', 'Supply Chain AI', 'Inventory Analytics'],
            timeline: '6 months',
            teamSize: '8 specialists'
        },
        'fraud-detection': {
            title: 'Real-time Fraud Detection System',
            industry: 'Finance',
            challenge: 'A payment processor needed to detect fraudulent transactions in real-time while minimizing false positives that blocked legitimate customers.',
            solution: 'Built advanced machine learning models with real-time transaction monitoring, behavioral analysis, and adaptive fraud detection algorithms.',
            implementation: 'Deployed with 99.9% uptime requirements, integrated with existing payment infrastructure, and continuous model training.',
            results: [
                { label: 'Fraud Detection Rate', value: '99.7%' },
                { label: 'False Positive Reduction', value: '75%' },
                { label: 'Annual Losses Prevented', value: '$5.2M' },
                { label: 'Processing Speed', value: '<50ms' }
            ],
            technologies: ['Real-time ML', 'Behavioral Analysis', 'Fraud Detection', 'High-Performance Computing'],
            timeline: '7 months',
            teamSize: '9 specialists'
        }
    };
    
    return caseStudies[caseId];
}

function generateModalContent(caseData) {
    return `
        <div class="modal-section">
            <h4>Challenge</h4>
            <p>${caseData.challenge}</p>
        </div>
        
        <div class="modal-section">
            <h4>Our Solution</h4>
            <p>${caseData.solution}</p>
        </div>
        
        <div class="modal-section">
            <h4>Implementation</h4>
            <p>${caseData.implementation}</p>
        </div>
        
        <div class="modal-section">
            <h4>Results</h4>
            <div class="modal-metrics">
                ${caseData.results.map(result => `
                    <div class="modal-metric">
                        <span class="modal-metric-value">${result.value}</span>
                        <span class="modal-metric-label">${result.label}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Technologies Used</h4>
            <div class="modal-tags">
                ${caseData.technologies.map(tech => `
                    <span class="modal-tag">${tech}</span>
                `).join('')}
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Project Details</h4>
            <p><strong>Timeline:</strong> ${caseData.timeline}</p>
            <p><strong>Team Size:</strong> ${caseData.teamSize}</p>
            <p><strong>Industry:</strong> ${caseData.industry}</p>
        </div>
    `;
}

// Hero stats animation
function initHeroStatsAnimation() {
    const heroStats = document.querySelectorAll('.hero-stat .stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '50px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                animateHeroStat(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    heroStats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateHeroStat(statElement) {
    const text = statElement.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/\d/g, '');
    
    let current = 0;
    const increment = number / 60; // 60 frames for 1 second
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= number) {
            statElement.textContent = number + suffix;
            clearInterval(counter);
        } else {
            statElement.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.case-study-card, .testimonial-card, .hero-stat');
    
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
        // Don't apply initial hidden state to case study cards as they have their own animation
        if (!element.classList.contains('case-study-card')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`;
        }
        observer.observe(element);
    });
}

// Testimonial interactions
function initTestimonialInteractions() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Case study card interactions
function initCaseStudyCards() {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    
    caseStudyCards.forEach(card => {
        const overlay = card.querySelector('.case-study-overlay');
        const viewButton = card.querySelector('.view-case-study');
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.12)';
            
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
            
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
        
        // Click to view case study
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.view-case-study')) {
                const button = card.querySelector('.view-case-study');
                if (button) {
                    button.click();
                }
            }
        });
        
        // Button interaction
        if (viewButton) {
            viewButton.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
                viewButton.style.transform = 'translateY(-2px) scale(1.05)';
                viewButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            });
            
            viewButton.addEventListener('mouseleave', (e) => {
                e.stopPropagation();
                viewButton.style.transform = 'translateY(0) scale(1)';
                viewButton.style.boxShadow = 'none';
            });
        }
    });
}

// Results card animation
function initResultsCardAnimation() {
    const resultsCard = document.querySelector('.results-card');
    
    if (!resultsCard) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                animateResultsMetric();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(resultsCard);
}

function animateResultsMetric() {
    const metricValue = document.querySelector('.metric-value');
    
    if (!metricValue) return;
    
    const targetValue = '2.4M';
    let current = 0;
    const target = 2.4;
    const increment = target / 60;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            metricValue.textContent = '$2.4M';
            clearInterval(counter);
        } else {
            metricValue.textContent = `$${current.toFixed(1)}M`;
        }
    }, 16);
}

// Filter search functionality
function initFilterSearch() {
    // Create search input
    const filterContainer = document.querySelector('.filter-container');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'filter-search';
    searchContainer.style.cssText = `
        margin-bottom: 24px;
        text-align: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search case studies...';
    searchInput.style.cssText = `
        padding: 12px 16px;
        border: 2px solid #F8F9FA;
        border-radius: 24px;
        font-size: 14px;
        width: 300px;
        max-width: 100%;
        outline: none;
        transition: border-color 0.3s ease;
    `;
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#4FACFE';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#F8F9FA';
    });
    
    searchInput.addEventListener('input', debounce((e) => {
        searchCaseStudies(e.target.value);
    }, 300));
    
    searchContainer.appendChild(searchInput);
    filterContainer.appendChild(searchContainer);
}

function searchCaseStudies(query) {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
    
    caseStudyCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.case-study-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchText = [title, description, ...tags].join(' ');
        const matchesSearch = query === '' || searchText.includes(query.toLowerCase());
        const categories = card.getAttribute('data-category').split(' ');
        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
        
        if (matchesSearch && matchesFilter) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
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

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initResultsCardAnimation();
        initFilterSearch();
    }, 1000);
});

// Performance optimizations for mobile
function initMobileOptimizations() {
    if (window.innerWidth < 768) {
        // Reduce animations on mobile
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        caseStudyCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                }, 150);
            });
        });
        
        // Simplify filter tabs for mobile
        const filterTabs = document.querySelector('.filter-tabs');
        if (filterTabs) {
            filterTabs.style.overflowX = 'auto';
            filterTabs.style.scrollBehavior = 'smooth';
        }
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// Keyboard navigation for accessibility
function initKeyboardNavigation() {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Make case study cards focusable
    caseStudyCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = card.querySelector('.view-case-study');
                if (button) button.click();
            }
        });
    });
    
    // Arrow key navigation for filter tabs
    filterTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', (e) => {
            let targetIndex;
            
            switch (e.key) {
                case 'ArrowLeft':
                    targetIndex = index > 0 ? index - 1 : filterTabs.length - 1;
                    break;
                case 'ArrowRight':
                    targetIndex = index < filterTabs.length - 1 ? index + 1 : 0;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            filterTabs[targetIndex].focus();
            filterTabs[targetIndex].click();
        });
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initKeyboardNavigation);