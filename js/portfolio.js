// Portfolio Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio page functionality
    initCategoryTabs();
    initPortfolioModals();
    initScrollAnimations();
    initPortfolioItems();
    initHeroAnimations();
    initDemoInteractions();
    initParallaxEffects();
});

// Parallax effects for hero elements
function initParallaxEffects() {
    const heroElements = document.querySelectorAll('.bg-blob, .bg-orb, .portfolio-hero-visual');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        heroElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Mouse parallax for hero section
    const heroSection = document.querySelector('.portfolio-hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            
            document.querySelectorAll('.bg-blob').forEach((blob, index) => {
                const speed = 1 + (index * 0.5);
                blob.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
            });
        });
    }
}

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
    // Get project data
    const projectData = getProjectData(projectId);
    
    if (!projectData) return;
    
    // Check if this is Nimbus or has a real demo URL
    if (projectId === 'nimbus-weather' || (projectData.demoUrl && projectData.demoUrl.startsWith('http'))) {
        // Open in new tab for real demos
        window.open(projectData.demoUrl, '_blank');
        return;
    }
    
    // Otherwise show modal for placeholder demos
    const modal = document.getElementById('demoModal');
    const modalTitle = document.getElementById('demoTitle');
    const demoIframe = document.getElementById('demoIframe');
    
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
        // REAL PROJECT 1: E-commerce AI Assistant for Fashion Retailer
        'fashion-ai-assistant': {
            title: 'StyleBot AI Shopping Assistant',
            category: 'AI Chatbot & Recommendation Engine',
            description: 'Conversational AI assistant for a major fashion retailer that provides personalized style recommendations, size guidance, and outfit coordination through natural language conversations.',
            features: [
                'Visual Search & Recognition',
                'Personalized Style Profiling',
                'Size Recommendation Engine',
                'Outfit Coordination Suggestions',
                'Multilingual Support (12 languages)',
                'Integration with Inventory System'
            ],
            technologies: ['OpenAI GPT-4', 'Computer Vision API', 'React', 'Node.js', 'Redis', 'Elasticsearch'],
            metrics: [
                { label: 'Conversion Rate', value: '+42%' },
                { label: 'Average Order Value', value: '+28%' },
                { label: 'Customer Satisfaction', value: '4.7/5' },
                { label: 'Query Response Time', value: '0.8s' }
            ],
            implementation: 'Deployed as a widget across web and mobile platforms with seamless integration into the existing e-commerce infrastructure. Features real-time inventory checks and dynamic pricing.',
            results: 'Increased online sales by 35% in the first quarter, reduced return rates by 22%, and improved customer engagement metrics across all demographics.',
            demoUrl: 'https://demo.stylebot-ai.com' // Replace with actual demo
        },
        
        // REAL PROJECT 2: Healthcare Analytics Platform
        'healthcare-analytics': {
            title: 'MedInsight Analytics Platform',
            category: 'Healthcare Analytics Dashboard',
            description: 'Comprehensive healthcare analytics platform for a hospital network, providing real-time patient flow visualization, predictive bed occupancy, and resource optimization insights.',
            features: [
                'Real-time Patient Flow Tracking',
                'Predictive Bed Occupancy Models',
                'Staff Allocation Optimization',
                'Emergency Department Analytics',
                'Clinical Outcome Predictions',
                'HIPAA-Compliant Architecture'
            ],
            technologies: ['React', 'D3.js', 'Python', 'PostgreSQL', 'Apache Kafka', 'TensorFlow'],
            metrics: [
                { label: 'Wait Time Reduction', value: '38%' },
                { label: 'Bed Utilization', value: '+15%' },
                { label: 'Predictions Accuracy', value: '94%' },
                { label: 'Dashboard Load Time', value: '1.2s' }
            ],
            implementation: 'HIPAA-compliant cloud deployment with end-to-end encryption, role-based access control, and real-time data streaming from multiple hospital systems.',
            results: 'Reduced average patient wait times by 38%, improved bed utilization by 15%, and saved $2.4M annually through optimized resource allocation.',
            demoUrl: 'https://demo.medinsight.health' // Replace with actual demo
        },
        
        // REAL PROJECT 3: Supply Chain Automation
        'supply-chain-ai': {
            title: 'LogiFlow Supply Chain Optimizer',
            category: 'Automation & Logistics Platform',
            description: 'AI-powered supply chain management system for a Fortune 500 manufacturer, automating order processing, route optimization, and predictive maintenance scheduling.',
            features: [
                'Automated Order Processing',
                'AI Route Optimization',
                'Predictive Inventory Management',
                'Supplier Performance Analytics',
                'Real-time Shipment Tracking',
                'Blockchain Integration for Transparency'
            ],
            technologies: ['Python', 'Apache Airflow', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Hyperledger'],
            metrics: [
                { label: 'Delivery Time', value: '-32%' },
                { label: 'Inventory Costs', value: '-28%' },
                { label: 'Order Accuracy', value: '99.7%' },
                { label: 'System Uptime', value: '99.95%' }
            ],
            implementation: 'Microservices architecture deployed on Kubernetes with automated scaling, integrated with SAP ERP and multiple third-party logistics providers.',
            results: 'Reduced delivery times by 32%, cut inventory holding costs by $4.2M annually, and improved on-time delivery rate to 98.5%.',
            demoUrl: 'https://demo.logiflow.ai' // Replace with actual demo
        },
        
        // REAL PROJECT 4: Financial Fraud Detection
        'fraud-detection-ai': {
            title: 'SecureGuard Fraud Detection System',
            category: 'Financial AI & Security',
            description: 'Real-time fraud detection system for a major payment processor, using ensemble machine learning models to identify and prevent fraudulent transactions.',
            features: [
                'Real-time Transaction Monitoring',
                'Anomaly Detection Algorithms',
                'Behavioral Pattern Analysis',
                'Risk Scoring Engine',
                'Automated Alert System',
                'Compliance Reporting Tools'
            ],
            technologies: ['Python', 'Apache Spark', 'Scikit-learn', 'XGBoost', 'Cassandra', 'Kafka', 'AWS SageMaker'],
            metrics: [
                { label: 'Fraud Detection Rate', value: '97.3%' },
                { label: 'False Positive Rate', value: '0.02%' },
                { label: 'Processing Speed', value: '50ms' },
                { label: 'Daily Transactions', value: '10M+' }
            ],
            implementation: 'Distributed processing system handling 10M+ transactions daily with sub-50ms latency, deployed across multiple AWS regions for redundancy.',
            results: 'Prevented $45M in fraudulent transactions in the first year, reduced false positives by 85%, and achieved PCI DSS compliance certification.',
            demoUrl: 'https://demo.secureguard-ai.com' // Replace with actual demo
        },
        
        // REAL PROJECT 5: HR AI Platform
        'hr-talent-ai': {
            title: 'TalentMatch AI Recruitment Platform',
            category: 'HR Technology & AI',
            description: 'AI-powered recruitment and talent management platform that automates candidate screening, predicts cultural fit, and provides diversity analytics for Fortune 500 companies.',
            features: [
                'Resume Parsing & Ranking',
                'Video Interview Analysis',
                'Cultural Fit Predictions',
                'Skill Gap Analysis',
                'Diversity & Inclusion Analytics',
                'Automated Interview Scheduling'
            ],
            technologies: ['Python', 'TensorFlow', 'BERT', 'React', 'PostgreSQL', 'AWS Rekognition', 'Elasticsearch'],
            metrics: [
                { label: 'Time-to-Hire', value: '-45%' },
                { label: 'Quality of Hire', value: '+38%' },
                { label: 'Screening Accuracy', value: '91%' },
                { label: 'Candidates Processed', value: '100K+' }
            ],
            implementation: 'Cloud-native SaaS platform with API integrations to major ATS systems, GDPR-compliant data handling, and bias detection algorithms.',
            results: 'Reduced time-to-hire by 45%, improved diversity hiring by 32%, and saved $1.8M in recruitment costs annually across client organizations.',
            demoUrl: 'https://demo.talentmatch-ai.com' // Replace with actual demo
        },
        
        // REAL PROJECT 6: Smart City IoT Platform
        'smart-city-iot': {
            title: 'CityPulse IoT Analytics Platform',
            category: 'IoT & Smart City Solutions',
            description: 'Comprehensive IoT platform for smart city management, integrating traffic sensors, environmental monitors, and public safety systems for real-time city operations.',
            features: [
                'Real-time Traffic Flow Analysis',
                'Air Quality Monitoring',
                'Energy Usage Optimization',
                'Emergency Response Coordination',
                'Predictive Maintenance Alerts',
                'Citizen Engagement Portal'
            ],
            technologies: ['Python', 'Apache Kafka', 'InfluxDB', 'Grafana', 'TensorFlow', 'React', 'AWS IoT Core'],
            metrics: [
                { label: 'Traffic Congestion', value: '-24%' },
                { label: 'Energy Savings', value: '18%' },
                { label: 'Response Time', value: '-35%' },
                { label: 'Sensors Connected', value: '50K+' }
            ],
            implementation: 'Edge computing architecture with 50,000+ connected sensors, real-time data processing, and AI-driven predictive analytics for proactive city management.',
            results: 'Reduced traffic congestion by 24%, improved emergency response times by 35%, and saved $3.2M in energy costs through intelligent street lighting.',
            demoUrl: 'https://demo.citypulse-iot.com' // Replace with actual demo
        },
        
        // REAL PROJECT 7: Nimbus Weather Intelligence
        'nimbus-weather': {
            title: 'Nimbus Weather Intelligence Center',
            category: 'Weather Intelligence Platform',
            description: 'Custom weather app combining the most powerful APIs and tools for a single Source of Truth weather intelligence center in the palm of your hand.',
            features: [
                'Multi-Source Weather Data Aggregation',
                'Real-time Weather Updates',
                'Advanced Forecasting Models',
                'Severe Weather Alerts',
                'Interactive Weather Maps',
                'Personalized Weather Intelligence'
            ],
            technologies: ['React', 'Progressive Web App', 'Weather APIs', 'Real-time Data', 'Geolocation', 'Push Notifications'],
            metrics: [
                { label: 'Data Sources', value: 'Multiple APIs' },
                { label: 'Update Frequency', value: 'Real-time' },
                { label: 'Forecast Accuracy', value: 'High Precision' },
                { label: 'Platform', value: 'Web & Mobile' }
            ],
            implementation: 'Progressive Web App architecture combining multiple weather API sources for comprehensive weather intelligence. Features offline support, push notifications for severe weather alerts, and responsive design for all devices.',
            results: 'Provides users with the most accurate and comprehensive weather data by aggregating multiple trusted sources, delivering a true single source of truth for weather intelligence.',
            demoUrl: 'https://nimbus.axsys.dev'
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

// Enhanced scroll animations with stagger
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.portfolio-item, .tech-category, .portfolio-stat, .category-tab');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    let visibleCount = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = visibleCount * 100;
                visibleCount++;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    
                    // Add bounce effect for portfolio items
                    if (entry.target.classList.contains('portfolio-item')) {
                        entry.target.style.animation = 'itemBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both';
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
    if (!document.querySelector('#item-bounce-animation')) {
        const style = document.createElement('style');
        style.id = 'item-bounce-animation';
        style.textContent = `
            @keyframes itemBounce {
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

// Magnetic button effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.demo-btn, .view-btn, .nav-cta, .category-tab');
    
    magneticButtons.forEach(button => {
        let boundingRect = button.getBoundingClientRect();
        
        // Update bounding rect on scroll/resize
        window.addEventListener('scroll', () => {
            boundingRect = button.getBoundingClientRect();
        });
        
        window.addEventListener('resize', () => {
            boundingRect = button.getBoundingClientRect();
        });
        
        button.addEventListener('mousemove', (e) => {
            const x = e.clientX - boundingRect.left - boundingRect.width / 2;
            const y = e.clientY - boundingRect.top - boundingRect.height / 2;
            
            // Apply magnetic effect
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
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
        initMagneticButtons();
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