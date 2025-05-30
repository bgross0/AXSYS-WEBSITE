// Portfolio Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio page functionality
    initCategoryTabs();
    initPortfolioModals();
    initScrollAnimations();
    initPortfolioItems();
    initHeroAnimations();
    initDemoInteractions();
});

// Category filtering
function initCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter portfolio items with animation
            filterPortfolioItems(category, portfolioItems);
            
            // Add ripple effect to tab
            createCategoryRipple(tab);
        });
    });
}

function filterPortfolioItems(category, items) {
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category').split(' ');
        const shouldShow = category === 'all' || categories.includes(category);
        
        if (shouldShow) {
            // Show item with delay for stagger effect
            setTimeout(() => {
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        } else {
            // Hide item
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.classList.add('hidden');
            }, 300);
        }
    });
}

function createCategoryRipple(tab) {
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
        animation: categoryRipple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation if not already defined
    if (!document.querySelector('#category-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'category-ripple-style';
        style.textContent = `
            @keyframes categoryRipple {
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

// Modal functionality
function initPortfolioModals() {
    const demoButtons = document.querySelectorAll('.demo-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Demo modal handlers
    demoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = button.getAttribute('data-project');
            openDemoModal(projectId);
        });
    });
    
    // Details modal handlers
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = button.getAttribute('data-project');
            openDetailsModal(projectId);
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const demoModal = document.getElementById('demoModal');
        const detailsModal = document.getElementById('detailsModal');
        
        if (e.target === demoModal) {
            closeDemoModal();
        }
        if (e.target === detailsModal) {
            closeDetailsModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDemoModal();
            closeDetailsModal();
        }
    });
}

function openDemoModal(projectId) {
    const modal = document.getElementById('demoModal');
    const modalTitle = document.getElementById('demoTitle');
    const demoIframe = document.getElementById('demoIframe');
    
    // Get project data
    const projectData = getProjectData(projectId);
    
    if (!projectData) return;
    
    // Set modal content
    modalTitle.textContent = `${projectData.title} - Live Demo`;
    demoIframe.src = projectData.demoUrl || generateDemoUrl(projectId);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    const demoIframe = document.getElementById('demoIframe');
    
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        demoIframe.src = ''; // Stop iframe loading
        document.body.style.overflow = 'auto';
    }, 300);
}

function openDetailsModal(projectId) {
    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('detailsTitle');
    const modalBody = document.getElementById('detailsBody');
    
    // Get project data
    const projectData = getProjectData(projectId);
    
    if (!projectData) return;
    
    // Populate modal content
    modalTitle.textContent = projectData.title;
    modalBody.innerHTML = generateDetailsContent(projectData);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Make modal close functions globally available
window.closeDemoModal = closeDemoModal;
window.closeDetailsModal = closeDetailsModal;

function getProjectData(projectId) {
    const projects = {
        'chatbot-demo': {
            title: 'Intelligent Customer Service Bot',
            category: 'AI Chatbot',
            description: 'Advanced AI chatbot with natural language processing, sentiment analysis, and multi-language support for seamless customer interactions.',
            features: [
                'Natural Language Understanding',
                'Sentiment Analysis',
                'Multi-language Support',
                'Integration with CRM Systems',
                'Real-time Learning',
                'Automated Escalation'
            ],
            technologies: ['OpenAI GPT-4', 'Natural Language Processing', 'React', 'Node.js', 'MongoDB', 'Socket.io'],
            metrics: [
                { label: 'Response Accuracy', value: '95%' },
                { label: 'Query Resolution', value: '87%' },
                { label: 'Customer Satisfaction', value: '4.8/5' },
                { label: 'Response Time', value: '<2s' }
            ],
            implementation: 'Deployed across multiple platforms including web, mobile, and social media channels with seamless handoff to human agents when needed.',
            results: 'Reduced customer service costs by 60% while improving response times and customer satisfaction scores.',
            demoUrl: '#' // Would be actual demo URL
        },
        'analytics-dashboard': {
            title: 'Real-time Business Dashboard',
            category: 'Analytics Platform',
            description: 'Comprehensive analytics dashboard providing real-time insights into business performance with customizable KPIs and automated reporting.',
            features: [
                'Real-time Data Visualization',
                'Custom KPI Creation',
                'Automated Report Generation',
                'Predictive Analytics',
                'Multi-source Data Integration',
                'Mobile Responsive Design'
            ],
            technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'Redis', 'Chart.js'],
            metrics: [
                { label: 'Data Sources', value: '15+' },
                { label: 'Update Frequency', value: 'Real-time' },
                { label: 'KPI Tracking', value: '50+' },
                { label: 'Load Time', value: '<3s' }
            ],
            implementation: 'Cloud-native architecture with auto-scaling capabilities and enterprise-grade security.',
            results: 'Improved decision-making speed by 70% and identified $2M in cost savings opportunities.',
            demoUrl: '#'
        },
        'workflow-automation': {
            title: 'Intelligent Workflow Engine',
            category: 'Automation Platform',
            description: 'No-code workflow automation platform with AI-powered decision making and smart routing capabilities.',
            features: [
                'Visual Workflow Builder',
                'AI-powered Decision Trees',
                'Smart Data Routing',
                'Custom Integration APIs',
                'Error Handling & Recovery',
                'Performance Analytics'
            ],
            technologies: ['Python', 'Celery', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
            metrics: [
                { label: 'Time Savings', value: '80%' },
                { label: 'Error Reduction', value: '95%' },
                { label: 'Process Efficiency', value: '+250%' },
                { label: 'Uptime', value: '99.9%' }
            ],
            implementation: 'Microservices architecture with containerized deployment and automatic scaling based on workload.',
            results: 'Automated 85% of manual processes, saving 1,200 hours per month and reducing errors by 95%.',
            demoUrl: '#'
        },
        'mobile-scanner': {
            title: 'AI-Powered Object Scanner',
            category: 'Mobile Application',
            description: 'Mobile app leveraging computer vision for real-time object recognition, inventory tracking, and price comparison.',
            features: [
                'Real-time Object Recognition',
                'Barcode & QR Code Scanning',
                'Price Comparison Engine',
                'Inventory Management',
                'Offline Capability',
                'Cloud Synchronization'
            ],
            technologies: ['React Native', 'TensorFlow Lite', 'OpenCV', 'Firebase', 'Google Vision API'],
            metrics: [
                { label: 'Recognition Accuracy', value: '98%' },
                { label: 'Scan Speed', value: '0.5s' },
                { label: 'Offline Objects', value: '10K+' },
                { label: 'Daily Scans', value: '50K+' }
            ],
            implementation: 'Cross-platform mobile app with edge computing for offline functionality and cloud sync for data updates.',
            results: 'Reduced inventory checking time by 75% and improved accuracy in stock management.',
            demoUrl: '#'
        },
        'predictive-analytics': {
            title: 'Sales Forecasting Engine',
            category: 'Predictive Analytics',
            description: 'Machine learning-powered sales forecasting system with trend analysis and inventory optimization recommendations.',
            features: [
                'Advanced ML Algorithms',
                'Seasonal Trend Analysis',
                'Demand Forecasting',
                'Inventory Optimization',
                'Risk Assessment',
                'What-if Scenarios'
            ],
            technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'PostgreSQL', 'Apache Spark'],
            metrics: [
                { label: 'Forecast Accuracy', value: '92%' },
                { label: 'Prediction Horizon', value: '90 days' },
                { label: 'Model Training', value: 'Daily' },
                { label: 'Data Points', value: '10M+' }
            ],
            implementation: 'Distributed computing architecture with automated model retraining and A/B testing for continuous improvement.',
            results: 'Improved forecast accuracy by 40% and reduced excess inventory by $1.5M annually.',
            demoUrl: '#'
        },
        'document-ai': {
            title: 'Intelligent Document Processor',
            category: 'Document AI',
            description: 'AI-powered document processing system for automated data extraction, classification, and workflow integration.',
            features: [
                'Optical Character Recognition',
                'Document Classification',
                'Data Extraction & Validation',
                'Workflow Integration',
                'Audit Trail & Compliance',
                'Batch Processing'
            ],
            technologies: ['Python', 'TensorFlow', 'OpenCV', 'spaCy', 'FastAPI', 'PostgreSQL'],
            metrics: [
                { label: 'Processing Speed', value: '5s/doc' },
                { label: 'Accuracy Rate', value: '99%' },
                { label: 'Document Types', value: '25+' },
                { label: 'Daily Volume', value: '10K docs' }
            ],
            implementation: 'Scalable cloud infrastructure with GPU acceleration for OCR and machine learning tasks.',
            results: 'Reduced document processing time by 90% and eliminated manual data entry errors.',
            demoUrl: '#'
        }
    };
    
    return projects[projectId];
}

function generateDetailsContent(projectData) {
    return `
        <div style="padding: 24px;">
            <div style="margin-bottom: 32px;">
                <div style="background: rgba(79, 172, 254, 0.1); color: #4FACFE; padding: 4px 12px; border-radius: 12px; display: inline-block; font-size: 12px; font-weight: 600; margin-bottom: 16px;">
                    ${projectData.category}
                </div>
                <p style="color: #3A3A3C; line-height: 1.6; margin-bottom: 24px;">
                    ${projectData.description}
                </p>
            </div>
            
            <div style="margin-bottom: 32px;">
                <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1C1C1E;">Key Features</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
                    ${projectData.features.map(feature => `
                        <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #F8F9FA; border-radius: 6px;">
                            <div style="width: 6px; height: 6px; background: #43E97B; border-radius: 50%;"></div>
                            <span style="font-size: 14px; color: #1C1C1E;">${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 32px;">
                <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1C1C1E;">Performance Metrics</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    ${projectData.metrics.map(metric => `
                        <div style="text-align: center; padding: 20px; background: #F8F9FA; border-radius: 12px;">
                            <div style="font-size: 24px; font-weight: 600; color: #4FACFE; margin-bottom: 8px;">
                                ${metric.value}
                            </div>
                            <div style="font-size: 14px; color: #3A3A3C; font-weight: 500;">
                                ${metric.label}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 32px;">
                <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1C1C1E;">Technologies Used</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${projectData.technologies.map(tech => `
                        <span style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); color: white; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 32px;">
                <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1C1C1E;">Implementation</h4>
                <p style="color: #3A3A3C; line-height: 1.6;">
                    ${projectData.implementation}
                </p>
            </div>
            
            <div>
                <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1C1C1E;">Results & Impact</h4>
                <p style="color: #3A3A3C; line-height: 1.6;">
                    ${projectData.results}
                </p>
            </div>
        </div>
    `;
}

function generateDemoUrl(projectId) {
    // In a real implementation, these would be actual demo URLs
    // For now, return placeholder
    return `data:text/html,<html><body style="margin:0;padding:40px;font-family:system-ui;background:#f8f9fa;display:flex;align-items:center;justify-content:center;min-height:100vh;"><div style="text-align:center;background:white;padding:40px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);"><h2 style="margin:0 0 16px 0;color:#1C1C1E;">Demo: ${projectId}</h2><p style="margin:0 0 24px 0;color:#3A3A3C;">Interactive demo would be loaded here</p><div style="background:linear-gradient(135deg,#FF6B6B 0%,#4ECDC4 100%);color:white;padding:12px 24px;border-radius:8px;display:inline-block;">Live Demo Placeholder</div></div></body></html>`;
}

// Scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.portfolio-item, .tech-category, .portfolio-stat');
    
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
        if (!element.classList.contains('portfolio-item')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`;
        }
        observer.observe(element);
    });
}

// Portfolio item interactions
function initPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const demoBtn = item.querySelector('.demo-btn');
        const viewBtn = item.querySelector('.view-btn');
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px)';
            item.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.12)';
            
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
            
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
        
        // Button interactions
        [demoBtn, viewBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                    btn.style.transform = 'translateY(-2px) scale(1.05)';
                });
                
                btn.addEventListener('mouseleave', (e) => {
                    e.stopPropagation();
                    btn.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
    });
}

// Hero animations
function initHeroAnimations() {
    const portfolioStats = document.querySelectorAll('.portfolio-stat .stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '50px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                animatePortfolioStat(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    portfolioStats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animatePortfolioStat(statElement) {
    const text = statElement.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/\d/g, '');
    
    if (isNaN(number)) return;
    
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

// Demo interactions for preview interfaces
function initDemoInteractions() {
    // Chat interface interactions
    const chatInterfaces = document.querySelectorAll('.chat-interface');
    chatInterfaces.forEach(chat => {
        const messages = chat.querySelectorAll('.message');
        messages.forEach((message, index) => {
            message.style.animationDelay = `${index * 0.5}s`;
        });
    });
    
    // Dashboard chart animations
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        bar.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Workflow step animations
    const workflowSteps = document.querySelectorAll('.workflow-step');
    workflowSteps.forEach((step, index) => {
        setTimeout(() => {
            if (index === 1) {
                step.classList.add('processing');
            }
        }, 2000 + (index * 1000));
    });
    
    // Mobile scanner interactions
    const scanFrames = document.querySelectorAll('.scan-frame');
    scanFrames.forEach(frame => {
        setInterval(() => {
            frame.style.borderColor = frame.style.borderColor === 'rgb(67, 233, 123)' ? '#4FACFE' : '#43E97B';
        }, 1000);
    });
}

// Portfolio search functionality
function initPortfolioSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'portfolio-search';
    searchContainer.style.cssText = `
        text-align: center;
        margin-bottom: 24px;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects...';
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
        searchPortfolioItems(e.target.value);
    }, 300));
    
    searchContainer.appendChild(searchInput);
    
    const categoriesContainer = document.querySelector('.categories-container');
    if (categoriesContainer) {
        categoriesContainer.appendChild(searchContainer);
    }
}

function searchPortfolioItems(query) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const activeCategory = document.querySelector('.category-tab.active').getAttribute('data-category');
    
    portfolioItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        const techTags = Array.from(item.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchText = [title, description, ...techTags].join(' ');
        const matchesSearch = query === '' || searchText.includes(query.toLowerCase());
        const categories = item.getAttribute('data-category').split(' ');
        const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
        
        if (matchesSearch && matchesCategory) {
            item.classList.remove('hidden');
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
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

// Tech stack hover effects
function initTechStackEffects() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(67, 233, 123, 0.1) 100%)';
            item.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = '#F8F9FA';
            item.style.transform = 'translateY(0)';
        });
    });
}

// Performance optimizations for mobile
function initMobileOptimizations() {
    if (window.innerWidth < 768) {
        // Reduce animations on mobile
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                item.style.transform = 'translateY(-4px)';
            });
            
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                }, 150);
            });
        });
        
        // Simplify category tabs for mobile
        const categoryTabs = document.querySelector('.category-tabs');
        if (categoryTabs) {
            categoryTabs.style.overflowX = 'auto';
            categoryTabs.style.scrollBehavior = 'smooth';
        }
    }
}

// Keyboard navigation
function initKeyboardNavigation() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    // Make portfolio items focusable
    portfolioItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const viewBtn = item.querySelector('.view-btn');
                if (viewBtn) viewBtn.click();
            }
            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                const demoBtn = item.querySelector('.demo-btn');
                if (demoBtn) demoBtn.click();
            }
        });
    });
    
    // Arrow key navigation for category tabs
    categoryTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', (e) => {
            let targetIndex;
            
            switch (e.key) {
                case 'ArrowLeft':
                    targetIndex = index > 0 ? index - 1 : categoryTabs.length - 1;
                    break;
                case 'ArrowRight':
                    targetIndex = index < categoryTabs.length - 1 ? index + 1 : 0;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            categoryTabs[targetIndex].focus();
            categoryTabs[targetIndex].click();
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initPortfolioSearch();
        initTechStackEffects();
        initMobileOptimizations();
        initKeyboardNavigation();
    }, 1000);
});

// Add loading state management
window.addEventListener('load', () => {
    // Ensure all elements are visible
    document.querySelectorAll('.portfolio-item, .tech-category').forEach(element => {
        element.style.opacity = '1';
    });
    
    // Trigger entrance animations
    const animatedElements = document.querySelectorAll('.portfolio-hero-content, .portfolio-hero-visual');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
});