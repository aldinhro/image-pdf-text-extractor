// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateX(-50%)';
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.transform = 'translateX(-50%)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
    
    // Update active menu item based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (currentScroll >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// Form submission handling with animation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simulate sending (replace with actual API call)
    setTimeout(() => {
        console.log('Form submitted:', data);
        
        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.backgroundColor = '#10B981';
        
        // Reset form
        this.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
        }, 3000);
    }, 1500);
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and sections
document.querySelectorAll('.project-card, section').forEach(element => {
    observer.observe(element);
});

// Theme Switcher
const themeSwitcher = document.querySelector('.theme-switcher');
const themeButtons = document.querySelectorAll('.theme-btn');

// Remove any existing active classes first
themeButtons.forEach(btn => btn.classList.remove('active'));

// Check for saved theme or use default
const savedTheme = localStorage.getItem('theme') || 'green';
document.body.className = `theme-${savedTheme}`;

// Set active state on the current theme button
const activeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
if (activeButton) {
    activeButton.classList.add('active');
}

// Theme switching functionality
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        
        // Update active button
        themeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Add transition class
        document.documentElement.classList.add('theme-transition');
        
        // Update theme
        document.body.className = `theme-${theme}`;
        
        // Save theme preference
        localStorage.setItem('theme', theme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    });
});

// Counter Animation for Trust Metrics
const animateCounters = () => {
    const counters = document.querySelectorAll('.metric-number');
    const speed = 2000; // Animation duration in milliseconds

    counters.forEach(counter => {
        const target = parseInt(counter.innerText);
        const increment = target / (speed / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + '+';
            }
        };

        counter.innerText = '0+';
        updateCounter();
    });
};

// Intersection Observer for triggering animation
const trustMetrics = document.querySelector('.trust-metrics');
if (trustMetrics) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(trustMetrics);
}

// FAQ Accordion
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const button = item.querySelector('.faq-question');
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
    });
});
