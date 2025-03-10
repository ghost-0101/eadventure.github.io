document.addEventListener('DOMContentLoaded', function() {
    // Initialize observers
    const observers = {
        counter: new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observers.counter.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }),

        fadeIn: new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }),

        animation: new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        })
    };

    // Loading animation
    const loadingOverlay = document.querySelector('.loading-overlay');
    window.addEventListener('load', () => {
        loadingOverlay.classList.add('hidden');
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                if (entry.target.dataset.delay) {
                    entry.target.style.transitionDelay = entry.target.dataset.delay;
                }
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Counter animation function
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / duration * 10;
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current > target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 10);
    }

    // Initialize animations
    document.querySelectorAll('.counter').forEach(counter => {
        observers.counter.observe(counter);
    });

    document.querySelectorAll('.fade-in').forEach(element => {
        observers.fadeIn.observe(element);
    });

    document.querySelectorAll('.fade-up, .scale-in').forEach(element => {
        observers.animation.observe(element);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let scrollThrottleTimer;
    
    window.addEventListener('scroll', () => {
        if (!scrollThrottleTimer) {
            scrollThrottleTimer = setTimeout(() => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                scrollThrottleTimer = null;
            }, 100);
        }
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        let parallaxThrottleTimer;
        window.addEventListener('scroll', () => {
            if (!parallaxThrottleTimer) {
                parallaxThrottleTimer = setTimeout(() => {
                    const scrolled = window.pageYOffset;
                    heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
                    parallaxThrottleTimer = null;
                }, 100);
            }
        });
    }

    // Parallax effect enhancement
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                }
            });
        });
    });

    // University logos animation
    document.querySelectorAll('.university-logo').forEach(logo => {
        logo.classList.add('floating');
    });

    AOS.init({
        duration: 1000,
        once: true
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.control-prev');
    const nextBtn = document.querySelector('.control-next');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach(card => card.classList.remove('active'));
        indicators.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);

    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });

    // Auto-advance every 5 seconds
    setInterval(nextTestimonial, 5000);

    // Video Modal Handler
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');

    if (videoModal) {
        videoModal.addEventListener('show.bs.modal', function () {
            videoIframe.src = videoIframe.getAttribute('data-src');
        });

        videoModal.addEventListener('hide.bs.modal', function () {
            videoIframe.src = 'about:blank';
        });
    }
});
