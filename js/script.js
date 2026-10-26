document.addEventListener('DOMContentLoaded', () => {

    // ============ AOS ============
    AOS.init({ duration: 900, once: false, easing: 'ease-out-cubic' });

    // ============ CUSTOM CURSOR ============
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    if (dot && outline) {
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .tilt, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('grow'));
            el.addEventListener('mouseleave', () => outline.classList.remove('grow'));
        });
    }

    // ============ SCROLL PROGRESS / STICKY NAV / BACKTOP ============
    const progressBar = document.querySelector('.scroll-progress');
    const mainHeader = document.getElementById('mainHeader'); // Naya Wrapper ID
    const backTop = document.getElementById('backTop');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Scroll Progress bar
        if (progressBar) progressBar.style.width = (scrollTop / docHeight) * 100 + '%';

        // Sticky Navbar Logic
        if (mainHeader) {
            // Agar 50px se zyada scroll ho toh header ko fix (sticky) kar dein
            if (scrollTop > 50) {
                mainHeader.classList.add('is-sticky');
            } else {
                mainHeader.classList.remove('is-sticky');
            }
        }

        // Back to top button
        if (backTop) backTop.classList.toggle('show', scrollTop > 500);
    });

    // ============ MOBILE MENU ============
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function openMobileMenu() {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('.mobile-link, #mobileMenu a[href^="#"]').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) closeMobileMenu();
    });

    // ============ COUNTERS ============
    const counters = document.querySelectorAll('.counter');
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                const target = +el.dataset.target;
                let count = 0;
                const step = target / 60;
                const tick = () => {
                    count += step;
                    if (count < target) {
                        el.innerText = Math.ceil(count);
                        requestAnimationFrame(tick);
                    } else {
                        el.innerText = target;
                    }
                };
                tick();
            } else {
                el.innerText = '0';
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

        // ============ ADVANCED CIRCULAR PROGRESS RINGS ============
    const progressRings = document.querySelectorAll('.progress-ring-fg');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const circle = entry.target;
            const percent = +circle.getAttribute('data-percent');
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            if (entry.isIntersecting) {
                // Set initial state
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference;
                circle.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.65, 0.05, 0.36, 1)';
                
                // Animate to the percentage
                setTimeout(() => {
                    const offset = circumference - (percent / 100) * circumference;
                    // 20% of the circle is hidden (the open gap), so we adjust accordingly
                    circle.style.strokeDashoffset = offset;
                }, 200);
            } else {
                // Reset when out of view
                circle.style.transition = 'none';
                circle.style.strokeDashoffset = circumference;
            }
        });
    }, { threshold: 0.5 });
    progressRings.forEach(ring => ringObserver.observe(ring));

    // ============ MAGNETIC BUTTONS ============
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });

    // ============ MAIN FORM SUBMIT ============
    const form = document.querySelector('.glass-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
            btn.style.background = 'var(--brand-dark)';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                e.target.reset();
            }, 2500);
        });
    }

    // ============ HERO SLIDER & DYNAMIC TEXT ============
    const heroSlides = document.querySelectorAll('.hero-bg .slide');
    const dynamicHeroTitle = document.getElementById('dynamicHeroTitle');
    const dynamicHeroDesc = document.getElementById('dynamicHeroDesc');
    const dynamicHeroBtn = document.getElementById('dynamicHeroBtn');
    const dynamicHeroBtnText = document.getElementById('dynamicHeroBtnText');
    let currentHeroSlide = 0;
    let heroInterval;

    const heroServicesData = [
        { title: "Plastic Packaging", desc: "Plastic packaging is a versatile, durable, and cost-effective solution for preserving and protecting products. Customizable in design and size, plastic packaging enhances brand visibility.", btnText: "Get Plastic Packaging", link: "#plastic-packaging" },
        { title: "Tissue Conversion", desc: "Tissue conversion transforms raw tissue paper into finished products like napkins, facial tissues, and paper towels.", btnText: "Get Tissue Conversion", link: "#tissue-conversion" },
        { title: "Flexible Printing", desc: "Flexible printing offers versatile, efficient solutions for packaging and custom designs. It adapts to different materials and shapes, ensuring high-quality, durable prints that enhance product appeal and branding.", btnText: "Get Flexible Printing", link: "#flexible-printing" },
        { title: "Roll to Roll Label Printing", desc: "Roll-to-roll label printing is an efficient, high-speed solution for producing custom labels in bulk. Ideal for industries.", btnText: "Get Roll to Roll Labels", link: "#roll-to-roll" },
        { title: "Laminated Tubes", desc: "Laminated tubes are durable, lightweight packaging solutions ideal for cosmetics, pharmaceuticals, and food products.", btnText: "Get Laminated Tubes", link: "#laminated-tubes" },
        { title: "Offset Printing", desc: "Offset printing is a high-quality, cost-effective method ideal for large volumes. It ensures vibrant colors, sharp images, and professional results on various materials.", btnText: "Get Offset Printing", link: "#offset-printing" }
    ];

    function changeHeroSlide(index) {
        if (!heroSlides.length || !dynamicHeroTitle || !dynamicHeroDesc) return;
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroSlides[index].classList.add('active');

        dynamicHeroTitle.style.opacity = '0';
        dynamicHeroDesc.style.opacity = '0';
        dynamicHeroTitle.style.transform = 'translateY(10px)';
        dynamicHeroDesc.style.transform = 'translateY(10px)';

        setTimeout(() => {
            const data = heroServicesData[index];
            dynamicHeroTitle.innerText = data.title;
            dynamicHeroDesc.innerText = data.desc;
            if (dynamicHeroBtnText) dynamicHeroBtnText.innerText = data.btnText;
            if (dynamicHeroBtn) dynamicHeroBtn.href = data.link;
            dynamicHeroTitle.style.opacity = '1';
            dynamicHeroDesc.style.opacity = '1';
            dynamicHeroTitle.style.transform = 'translateY(0)';
            dynamicHeroDesc.style.transform = 'translateY(0)';
        }, 300);
    }

    if (heroSlides.length > 0) {
        changeHeroSlide(0);
        function startHeroInterval() {
            clearInterval(heroInterval);
            heroInterval = setInterval(() => {
                currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
                changeHeroSlide(currentHeroSlide);
            }, 5000);
        }
        startHeroInterval();

        const heroSection = document.getElementById('home');
        if (heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) startHeroInterval();
                    else clearInterval(heroInterval);
                });
            }, { threshold: 0.1 });
            heroObserver.observe(heroSection);
        }
    }

        // ============ PREMIUM QUOTE POPUP ============
    const quotePopup = document.getElementById('quotePopup');
    const closePopup = document.getElementById('closePopup');
    const skipPopup = document.getElementById('skipPopup');
    const popupForm = document.getElementById('popupForm');
    const popupBackdrop = quotePopup ? quotePopup.querySelector('.quote-popup-backdrop') : null;

    if (quotePopup) {
        // Show popup after 5 seconds — but only ONCE per session
        if (!sessionStorage.getItem('quotePopupShown')) {
            setTimeout(() => {
                openQuotePopup();
            }, 5000);
        }

        function openQuotePopup() {
            quotePopup.classList.add('active');
            quotePopup.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            sessionStorage.setItem('quotePopupShown', 'true');
        }

        function closeQuotePopup() {
            quotePopup.classList.remove('active');
            quotePopup.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (closePopup) closePopup.addEventListener('click', closeQuotePopup);
        if (skipPopup) skipPopup.addEventListener('click', closeQuotePopup);
        if (popupBackdrop) popupBackdrop.addEventListener('click', closeQuotePopup);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quotePopup.classList.contains('active')) {
                closeQuotePopup();
            }
        });

        // Popup form submit
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = popupForm.querySelector('.quote-popup-submit');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span>Success! Check your email</span> <i class="fa-solid fa-check"></i>';
                btn.style.background = '#10B981';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    popupForm.reset();
                    closeQuotePopup();
                }, 2000);
            });
        }
    }

});

// ============ DRUK SERVICES SLIDER ============
if(document.querySelector('.druk-services-swiper')) {
    var drukSwiper = new Swiper('.druk-services-swiper', {
        slidesPerView: 1, 
        spaceBetween: 16, // Space between cards
        loop: true,
        speed: 800,
        navigation: {
            nextEl: '.services-next',
            prevEl: '.services-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
        }
    });
}