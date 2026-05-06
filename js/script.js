document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Mobile navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveLink = () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink);

    // Gallery filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Hide non-bridal items by default
    galleryItems.forEach(item => {
        if (item.dataset.category !== 'bridal') {
            item.classList.add('hidden');
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentImageIndex = 0;
    let visibleImages = [];

    const updateVisibleImages = () => {
        visibleImages = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    };

    const openLightbox = (index) => {
        updateVisibleImages();
        currentImageIndex = index;
        const item = visibleImages[currentImageIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title').textContent;
        const category = item.querySelector('.gallery-category').textContent;

        lightboxImg.src = img.src.replace('w=500&h=600', 'w=1200&h=900');
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const navigateLightbox = (direction) => {
        updateVisibleImages();
        currentImageIndex = (currentImageIndex + direction + visibleImages.length) % visibleImages.length;
        openLightbox(currentImageIndex);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateVisibleImages();
            const visibleIndex = visibleImages.indexOf(item);
            openLightbox(visibleIndex);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    const showTestimonial = (index) => {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    };

    const nextTestimonial = () => {
        showTestimonial((currentTestimonial + 1) % testimonialCards.length);
    };

    const startTestimonialAutoplay = () => {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    };

    const resetTestimonialAutoplay = () => {
        clearInterval(testimonialInterval);
        startTestimonialAutoplay();
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(parseInt(dot.dataset.index));
            resetTestimonialAutoplay();
        });
    });

    startTestimonialAutoplay();

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Form submitted:', data);

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#22c55e';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    });

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.about-content, .about-image, .service-card, .contact-info, .contact-form');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
});
