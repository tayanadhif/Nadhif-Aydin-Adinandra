// Navigation functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = element.offsetTop - navHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger i');
    
    mobileMenu.classList.toggle('active');
    
    // Toggle hamburger icon
    if (mobileMenu.classList.contains('active')) {
        hamburger.className = 'fas fa-times';
    } else {
        hamburger.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger i');
    
    mobileMenu.classList.remove('active');
    hamburger.className = 'fas fa-bars';
}

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input validation listeners
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    // Animate skill bars when they come into view
    observeSkillBars();
    
    // Add scroll effects to navbar
    handleNavbarScroll();
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        subject: formData.get('subject').trim(),
        message: formData.get('message').trim()
    };
    
    // Validate form
    if (validateForm(data)) {
        // Simulate form submission
        submitForm(data);
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (data.name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject) {
        showError('subjectError', 'Subject is required');
        isValid = false;
    } else if (data.subject.length < 3) {
        showError('subjectError', 'Subject must be at least 3 characters');
        isValid = false;
    }
    
    // Message validation
    if (!data.message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (data.message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                showError('nameError', 'Name is required');
            } else if (value.length < 2) {
                showError('nameError', 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            if (!value) {
                showError('emailError', 'Email is required');
            } else if (!isValidEmail(value)) {
                showError('emailError', 'Please enter a valid email address');
            }
            break;
        case 'subject':
            if (!value) {
                showError('subjectError', 'Subject is required');
            } else if (value.length < 3) {
                showError('subjectError', 'Subject must be at least 3 characters');
            }
            break;
        case 'message':
            if (!value) {
                showError('messageError', 'Message is required');
            } else if (value.length < 10) {
                showError('messageError', 'Message must be at least 10 characters');
            }
            break;
    }
}

function clearError(e) {
    const field = e.target;
    const errorId = field.name + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.style.display = 'none';
        field.style.borderColor = '';
    }
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    const fieldName = errorId.replace('Error', '');
    const field = document.getElementById(fieldName);
    
    if (errorElement && field) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.style.borderColor = 'var(--red-600)';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const fields = document.querySelectorAll('.form-input, .form-textarea');
    
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(data) {
    const submitButton = document.querySelector('.contact-form .btn-primary');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // EmailJS configuration
    const serviceID = 'service_tayanadhif';
    const templateID = '__ejs-test-mail-service_';
    const publicKey = '54OIPGetVO3iPbeP_';
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    
    // Send email using EmailJS
    emailjs.send(serviceID, templateID, {
        user_name: data.name,
        user_email: data.email,
        user_subject: data.subject,
        user_message: data.message,
        to_name: 'Nadhif Aydin Adinandra',
        to_email: 'tayanadhif@gmail.com',
        reply_to: data.email
    })
    .then(() => {
        // Success
        document.getElementById('contactForm').reset();
        successMessage.style.display = 'flex';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    })
    .catch((error) => {
        // Error
        console.error('EmailJS Error:', error);
        showFormError('Failed to send message. Please try again or contact me directly via email.');
    })
    .finally(() => {
        // Reset submit button
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
}

function showFormError(message) {
    let errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        // Create error message element if it doesn't exist
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'error-message-form';
        errorMessage.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background-color: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            border-radius: var(--radius);
            font-size: 0.875rem;
            margin-top: 1rem;
        `;
        
        const form = document.getElementById('contactForm');
        form.appendChild(errorMessage);
    }
    
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
    errorMessage.style.display = 'flex';
    
    // Hide error message after 8 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 8000);
}

// Skill bar animation
function observeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset width to 0 and then animate to target width
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Navbar scroll effects
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = 'var(--shadow-lg)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Smooth scroll for all internal links
document.addEventListener('click', function(e) {
    // Check if the clicked element is a link with href starting with #
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Add loading animation to page
window.addEventListener('load', function() {
    // Add fade-in animation to main content
    const mainContent = document.body;
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        mainContent.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth >= 768) {
        closeMobileMenu();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);
