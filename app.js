// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('email');
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    const emailError = document.getElementById('email-error');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Initialize form and background art
    init();

    function init() {
        // Add event listeners
        form.addEventListener('submit', handleSubmit);
        emailInput.addEventListener('input', handleEmailInput);
        emailInput.addEventListener('blur', validateEmailOnBlur);
        
        // Initialize background art
        createFloatingShapes();
        initMouseTracking();
        initClickRipples();
        
        // Handle logo image loading
        handleLogoDisplay();
        
        console.log('Supergram waitlist page initialized successfully!');
    }

    // Handle logo image display with fallback
    function handleLogoDisplay() {
        const logoImg = document.querySelector('.logo-image');
        if (logoImg) {
            logoImg.addEventListener('error', function() {
                console.log('Logo image failed to load, showing fallback');
                const fallbackLogo = document.createElement('div');
                fallbackLogo.className = 'logo-image-fallback';
                this.parentNode.replaceChild(fallbackLogo, this);
                
                // Add click interaction to fallback logo
                fallbackLogo.addEventListener('click', function() {
                    this.style.animation = 'celebrate-shake 0.5s ease-in-out';
                    createRipple(
                        this.getBoundingClientRect().left + this.offsetWidth / 2,
                        this.getBoundingClientRect().top + this.offsetHeight / 2
                    );
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 500);
                });
            });

            logoImg.addEventListener('load', function() {
                console.log('Logo image loaded successfully');
            });

            // Add click interaction to logo
            logoImg.addEventListener('click', function() {
                this.style.animation = 'celebrate-shake 0.5s ease-in-out';
                createRipple(
                    this.getBoundingClientRect().left + this.offsetWidth / 2,
                    this.getBoundingClientRect().top + this.offsetHeight / 2
                );
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            });
        }
    }

    // Create floating background shapes
    function createFloatingShapes() {
        const shapes = [
            { class: 'shape-1', size: 60 },
            { class: 'shape-2', size: 40 },
            { class: 'shape-3', size: 80 }
        ];

        shapes.forEach(shape => {
            const shapeEl = document.createElement('div');
            shapeEl.className = `floating-shape ${shape.class}`;
            document.body.appendChild(shapeEl);
        });
    }

    // Initialize mouse tracking for cursor effects
    function initMouseTracking() {
        document.addEventListener('mousemove', function(e) {
            // Create subtle cursor trail occasionally
            if (Math.random() > 0.9) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                document.body.appendChild(trail);
                
                // Clean up trail after animation
                setTimeout(() => {
                    if (trail.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                }, 1000);
            }

            // Parallax effect on floating shapes
            const shapes = document.querySelectorAll('.floating-shape');
            shapes.forEach((shape, index) => {
                const rect = shape.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) / 50;
                const deltaY = (e.clientY - centerY) / 50;
                
                shape.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });
        });
    }

    // Initialize click ripple effects
    function initClickRipples() {
        document.addEventListener('click', function(e) {
            // Don't add ripple to form elements
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }

            createRipple(e.clientX, e.clientY);
        });

        // Add ripple effect to submit button
        submitBtn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }

    // Create ripple effect
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(10, 58, 130, 0.2)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple-expand 0.6s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        // Clear previous messages
        clearMessages();
        
        // Validate email before submission
        const isValid = validateEmail();
        console.log('Email validation result:', isValid);
        
        if (!isValid) {
            console.log('Validation failed, stopping submission');
            return;
        }

        // Show loading state
        setLoadingState(true);
        
        try {
            // Simulate API call
            console.log('Starting API call simulation');
            await simulateApiCall(emailInput.value);
            
            console.log('API call successful');
            // Show success message
            showMessage('success', '🎉 Thank you! You\'ve been added to our waitlist. We\'ll notify you when Supergram launches this September!');
            
            // Trigger celebration effects
            triggerCelebration();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.log('API call failed:', error);
            // Show error message
            showMessage('error', '❌ Oops! Something went wrong. Please try again or contact us at koushik@supergram.in');
        } finally {
            // Remove loading state
            setLoadingState(false);
        }
    }

    // Trigger celebration effects
    function triggerCelebration() {
        createConfetti();
        
        // Add subtle shake to logo
        const logo = document.querySelector('.logo-image') || document.querySelector('.logo-image-fallback');
        if (logo) {
            logo.style.animation = 'celebrate-shake 0.5s ease-in-out';
            setTimeout(() => {
                logo.style.animation = '';
            }, 500);
        }
    }

    // Create confetti animation
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti';
        document.body.appendChild(confettiContainer);

        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confettiPiece = document.createElement('div');
                confettiPiece.className = 'confetti-piece';
                confettiPiece.style.left = Math.random() * 100 + 'vw';
                confettiPiece.style.animationDelay = Math.random() * 2 + 's';
                confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confettiContainer.appendChild(confettiPiece);
            }, i * 30);
        }

        // Clean up confetti after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 5000);
    }

    // Handle email input changes
    function handleEmailInput(e) {
        const email = e.target.value.trim();
        
        // Clear previous error if user is typing
        if (emailError.textContent) {
            clearEmailError();
        }
        
        // Clear form messages when user starts typing
        if (formMessage.textContent) {
            clearMessages();
        }
        
        // Add visual feedback for valid email
        if (email && emailRegex.test(email)) {
            emailInput.classList.add('valid');
            emailInput.classList.remove('invalid');
        } else if (email.length > 0) {
            emailInput.classList.remove('valid');
            emailInput.classList.add('invalid');
        } else {
            emailInput.classList.remove('valid', 'invalid');
        }
    }

    // Validate email on blur
    function validateEmailOnBlur() {
        const email = emailInput.value.trim();
        if (email.length > 0) {
            validateEmail();
        }
    }

    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        console.log('Validating email:', email);
        
        // Check if email is empty
        if (!email) {
            showEmailError('Email is required');
            return false;
        }
        
        // Check email format
        if (!emailRegex.test(email)) {
            showEmailError('Please enter a valid email address');
            return false;
        }
        
        // Check for common typos
        const commonDomainTypos = {
            'gmai.com': 'gmail.com',
            'gmail.co': 'gmail.com',
            'gmial.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'outlok.com': 'outlook.com',
            'ymail.co': 'ymail.com'
        };
        
        const emailParts = email.split('@');
        if (emailParts.length === 2) {
            const domain = emailParts[1];
            if (commonDomainTypos[domain]) {
                showEmailError(`Did you mean ${emailParts[0]}@${commonDomainTypos[domain]}?`);
                return false;
            }
        }
        
        // Clear any error
        clearEmailError();
        console.log('Email validation passed');
        return true;
    }

    // Show email error
    function showEmailError(message) {
        console.log('Showing email error:', message);
        emailError.textContent = message;
        emailError.style.display = 'block';
        emailInput.style.borderColor = '#ff5459';
        emailInput.style.boxShadow = '0 0 0 3px rgba(255, 84, 89, 0.3)';
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
    }

    // Clear email error
    function clearEmailError() {
        emailError.textContent = '';
        emailError.style.display = 'none';
        emailInput.style.borderColor = '#c91d2d';
        emailInput.style.boxShadow = '0 2px 8px rgba(201, 29, 45, 0.2)';
        emailInput.removeAttribute('aria-invalid');
    }

    // Set loading state
    function setLoadingState(loading) {
        console.log('Setting loading state:', loading);
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Joining...';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Join the waitlist';
        }
    }

    // Show form message
    function showMessage(type, message) {
        console.log('Showing message:', type, message);
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        formMessage.style.opacity = '1';
        formMessage.style.transform = 'translateY(0)';
        
        // Scroll message into view
        setTimeout(() => {
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        // Auto-hide success message after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 8000);
        }
    }

    // Hide form message with animation
    function hideMessage() {
        formMessage.style.opacity = '0';
        formMessage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }, 300);
    }

    // Clear all messages
    function clearMessages() {
        hideMessage();
        clearEmailError();
    }

    // Simulate API call (replace with actual implementation)
    function simulateApiCall(email) {
        return new Promise((resolve, reject) => {
            console.log('Simulating API call for email:', email);
            // Simulate network delay
            setTimeout(() => {
                // 95% success rate for demo purposes
                if (Math.random() > 0.05) {
                    console.log('API simulation completed successfully');
                    resolve({ success: true, email: email });
                } else {
                    console.log('API simulation failed');
                    reject(new Error('Network error'));
                }
            }, 1500); // 1.5 second delay to show loading state
        });
    }

    // Add smooth scrolling for anchor links
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

    // Add keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Allow escape key to clear messages
        if (e.key === 'Escape') {
            clearMessages();
        }
        
        // Add Easter egg - Konami code for extra confetti
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
        window.konamiSequence = window.konamiSequence || [];
        window.konamiSequence.push(e.keyCode);
        
        if (window.konamiSequence.length > konamiCode.length) {
            window.konamiSequence.shift();
        }
        
        if (window.konamiSequence.length === konamiCode.length && 
            window.konamiSequence.every((key, index) => key === konamiCode[index])) {
            console.log('Konami code activated! 🎉');
            triggerCelebration();
            showMessage('success', '🎉 Secret code activated! Extra celebration for you!');
            window.konamiSequence = []; // Reset
        }
    });

    // Enhance email input with better UX
    emailInput.addEventListener('paste', function(e) {
        // Allow paste but clean up the input
        setTimeout(() => {
            this.value = this.value.trim().toLowerCase();
            handleEmailInput({ target: this });
        }, 0);
    });

    // Add subtle animations to elements when they come into view
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

    // Observe elements for scroll animations
    document.querySelectorAll('.hero-title, .hero-subtitle, .waitlist-title, .waitlist-subtitle, .waitlist-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Test the form validation immediately
    console.log('Form elements found:', {
        form: !!form,
        emailInput: !!emailInput,
        submitBtn: !!submitBtn,
        formMessage: !!formMessage,
        emailError: !!emailError
    });
});