(function () {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('navLinksMobile');
    const overlay = document.getElementById('navOverlay');
    const closeBtn = document.getElementById('navClose');

    if (!header || !toggle || !mobileNav || !overlay) return;

    const bars = toggle.querySelectorAll('.nav-toggle-bar');
    const isTransparent = header.dataset.transparent === 'true';

    const setScrolled = () => {
        const scrolled = window.scrollY > 10;
        if (isTransparent) {
            header.classList.toggle('bg-secondary', scrolled);
            header.classList.toggle('bg-transparent', !scrolled);
            header.classList.toggle('border-b', scrolled);
            header.classList.toggle('border-white/10', scrolled);
        }
        header.classList.toggle('shadow-xl', scrolled);
        header.classList.toggle('shadow-black/30', scrolled);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });

    const closeMenu = () => {
        mobileNav.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        bars[0].classList.remove('translate-y-2', 'rotate-45');
        bars[1].classList.remove('opacity-0');
        bars[2].classList.remove('-translate-y-2', '-rotate-45');
    };

    const openMenu = () => {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
        });
        mobileNav.classList.remove('translate-x-full');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        bars[0].classList.add('translate-y-2', 'rotate-45');
        bars[1].classList.add('opacity-0');
        bars[2].classList.add('-translate-y-2', '-rotate-45');
    };

    toggle.addEventListener('click', () => {
        const isOpen = !mobileNav.classList.contains('translate-x-full');
        if (isOpen) closeMenu();
        else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
})();

(function () {
    const toggle = document.getElementById('projectNavToggle');
    const mobileNav = document.getElementById('projectNavMobile');
    const overlay = document.getElementById('projectNavOverlay');
    const closeBtn = document.getElementById('projectNavClose');
    if (!toggle || !mobileNav || !overlay) return;

    const bars = toggle.querySelectorAll('.project-nav-toggle-bar');

    const closeMenu = () => {
        mobileNav.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        bars[0].classList.remove('translate-y-2', 'rotate-45');
        bars[1].classList.remove('opacity-0');
        bars[2].classList.remove('-translate-y-2', '-rotate-45');
    };

    const openMenu = () => {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
        });
        mobileNav.classList.remove('translate-x-full');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        bars[0].classList.add('translate-y-2', 'rotate-45');
        bars[1].classList.add('opacity-0');
        bars[2].classList.add('-translate-y-2', '-rotate-45');
    };

    toggle.addEventListener('click', () => {
        const isOpen = !mobileNav.classList.contains('translate-x-full');
        if (isOpen) closeMenu();
        else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
})();

(function () {
    const form = document.getElementById('projectFilterForm');
    const grid = document.getElementById('projectsGrid');
    const noResults = document.getElementById('noResults');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const locationCards = document.querySelectorAll('.location-card');

    if (!grid) return;

    const applyFilter = (predicate) => {
        const cards = grid.querySelectorAll('.project-card');
        let visibleCount = 0;

        cards.forEach((card) => {
            const isMatch = predicate(card);
            card.classList.toggle('hidden', !isMatch);
            if (isMatch) visibleCount += 1;
        });

        if (noResults) {
            noResults.classList.toggle('hidden', visibleCount !== 0);
        }

        const hideArrows = visibleCount <= 1;
        [prevBtn, nextBtn].forEach((btn) => {
            if (!btn) return;
            btn.classList.toggle('hidden', hideArrows);
        });

        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    };

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const location = form.location.value;
            const propertyType = form.propertyType.value;
            applyFilter((card) => (
                (!location || card.dataset.location === location)
                && (!propertyType || card.dataset.propertyType === propertyType)
            ));
        });
    }

    locationCards.forEach((card) => {
        card.addEventListener('click', () => {
            const city = card.dataset.city;
            if (form) form.reset();
            applyFilter((projectCard) => projectCard.dataset.city === city);
        });
    });

    if (prevBtn && nextBtn) {
        const scrollByCard = (direction) => {
            const card = grid.querySelector('.project-card:not(.hidden)');
            const step = card ? card.getBoundingClientRect().width + 8 : grid.clientWidth * 0.9;
            grid.scrollBy({ left: direction * step, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollByCard(-1));
        nextBtn.addEventListener('click', () => scrollByCard(1));
    }
})();

(function () {
    const grid = document.getElementById('blogGrid');
    const prevBtn = document.getElementById('blogPrev');
    const nextBtn = document.getElementById('blogNext');

    if (!grid || !prevBtn || !nextBtn) return;

    const scrollByCard = (direction) => {
        const card = grid.firstElementChild;
        const step = card ? card.getBoundingClientRect().width + 8 : grid.clientWidth * 0.9;
        grid.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
})();

(function () {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const slides = hero.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let current = 0;

    setInterval(() => {
        slides[current].classList.remove('opacity-100');
        slides[current].classList.add('opacity-0');
        current = (current + 1) % slides.length;
        slides[current].classList.remove('opacity-0');
        slides[current].classList.add('opacity-100');
    }, 5000);
})();

(function () {
    const tabsNav = document.getElementById('projectTabs');
    const tabLinks = Array.from(document.querySelectorAll('.tab-link'));
    if (!tabsNav || !tabLinks.length) return;

    const sections = tabLinks
        .map((link) => document.getElementById(link.dataset.tabTarget))
        .filter(Boolean)
        .sort((a, b) => a.offsetTop - b.offsetTop);

    const setActive = (id) => {
        tabLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.tabTarget === id);
        });
    };

    const updateActiveOnScroll = () => {
        // Matches the scroll-mt-24 (96px) applied to each tracked section, plus a small buffer.
        const referenceY = 104;
        let currentId = sections[0] ? sections[0].id : null;

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= referenceY) {
                currentId = section.id;
            }
        });

        setActive(currentId);
    };

    updateActiveOnScroll();
    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });

    tabLinks.forEach((link) => {
        link.addEventListener('click', () => setActive(link.dataset.tabTarget));
    });
})();

(function () {
    const tabs = document.querySelectorAll('.floorplan-tab');
    const cards = document.querySelectorAll('.floorplan-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const index = tab.dataset.planIndex;

            tabs.forEach((t) => {
                const isActive = t.dataset.planIndex === index;
                t.classList.toggle('active', isActive);
                t.classList.toggle('bg-primary', isActive);
                t.classList.toggle('border-2', isActive);
                t.classList.toggle('border-white', isActive);
                t.classList.toggle('text-white', isActive);
                t.classList.toggle('shadow-md', isActive);
                t.classList.toggle('bg-white', !isActive);
                t.classList.toggle('text-gray-700', !isActive);
                t.classList.toggle('hover:bg-gray-100', !isActive);
            });

            cards.forEach((card) => {
                card.classList.toggle('hidden', card.dataset.planIndex !== index);
            });
        });
    });
})();

(function () {
    const overlay = document.getElementById('leadModal');
    if (!overlay) return;

    const card = document.getElementById('leadModalCard');
    const closeBtn = document.getElementById('leadModalClose');
    const heading = document.getElementById('leadModalHeading');
    const projectNameEl = document.getElementById('leadModalProjectName');
    const form = document.getElementById('leadModalForm');
    const formWrap = document.getElementById('leadModalFormWrap');
    const successEl = document.getElementById('leadModalSuccess');
    const submitBtn = document.getElementById('leadModalSubmit');
    const submitLabel = document.getElementById('leadModalSubmitLabel');
    const submitSpinner = submitBtn ? submitBtn.querySelector('svg.animate-spin') : null;
    const submitArrow = submitBtn ? submitBtn.querySelector('svg:not(.animate-spin)') : null;
    const errorEl = document.getElementById('leadModalError');
    const projectInput = form ? form.querySelector('input[name="project"]') : null;

    let closeTimer = null;

    const resetForm = () => {
        if (form) form.reset();
        if (formWrap) formWrap.classList.remove('hidden');
        if (successEl) {
            successEl.classList.add('hidden');
            successEl.classList.remove('flex');
        }
        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }
    };

    const openModal = (opts) => {
        clearTimeout(closeTimer);
        resetForm();

        if (heading) heading.textContent = opts.heading || 'Enquire Now';
        if (submitLabel) submitLabel.textContent = opts.btnLabel || 'Submit Enquiry';
        submitBtn.dataset.originalLabel = opts.btnLabel || 'Submit Enquiry';

        if (projectNameEl) {
            if (opts.projectName) {
                projectNameEl.textContent = opts.projectName;
                projectNameEl.classList.remove('hidden');
            } else {
                projectNameEl.classList.add('hidden');
            }
        }
        if (projectInput) projectInput.value = opts.projectName || '';

        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('bg-black/70', 'backdrop-blur-sm');
                overlay.classList.remove('bg-transparent');
                if (card) {
                    card.classList.remove('opacity-0', 'translate-y-6', 'scale-95');
                    card.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                }
            });
        });
    };

    const closeModal = () => {
        overlay.classList.remove('bg-black/70', 'backdrop-blur-sm');
        overlay.classList.add('bg-transparent');
        if (card) {
            card.classList.add('opacity-0', 'translate-y-6', 'scale-95');
            card.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
        }
        document.body.style.overflow = '';

        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }, 300);
    };

    document.querySelectorAll('.open-lead-modal').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            openModal({
                heading: btn.dataset.modalHeading,
                btnLabel: btn.dataset.modalBtn,
                projectName: btn.dataset.projectName,
            });
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
    });

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (errorEl) {
                errorEl.classList.add('hidden');
                errorEl.textContent = '';
            }

            submitBtn.disabled = true;
            if (submitSpinner) submitSpinner.classList.remove('hidden');
            if (submitArrow) submitArrow.classList.add('hidden');
            if (submitLabel) submitLabel.textContent = 'Sending...';

            const data = new FormData(form);
            const payload = {
                name: data.get('name'),
                email: data.get('email'),
                number: data.get('phone'),
                country_code: data.get('countryCode'),
                company_email: 'info@searchmyspace.in',
                project_name: 'Sobhaproperties: ' + (data.get('project') || 'General Enquiry'),
            };

            try {
                const res = await fetch('https://worldcity.online/send-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Failed to send');

                if (formWrap) formWrap.classList.add('hidden');
                if (successEl) {
                    successEl.classList.remove('hidden');
                    successEl.classList.add('flex');
                }
                closeTimer = setTimeout(closeModal, 2500);
            } catch (err) {
                if (errorEl) {
                    errorEl.textContent = 'Something went wrong. Please try again or call us directly.';
                    errorEl.classList.remove('hidden');
                }
            } finally {
                submitBtn.disabled = false;
                if (submitSpinner) submitSpinner.classList.add('hidden');
                if (submitArrow) submitArrow.classList.remove('hidden');
                if (submitLabel) submitLabel.textContent = submitBtn.dataset.originalLabel || 'Submit Enquiry';
            }
        });
    }
})();

(function () {
    const form = document.getElementById('heroLeadForm');
    if (!form) return;

    const formWrap = document.getElementById('heroLeadFormWrap');
    const successEl = document.getElementById('heroLeadSuccess');
    const errorEl = document.getElementById('heroLeadError');
    const submitBtn = document.getElementById('heroLeadSubmit');
    const submitLabel = document.getElementById('heroLeadSubmitLabel');
    const submitSpinner = submitBtn ? submitBtn.querySelector('svg.animate-spin') : null;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }

        submitBtn.disabled = true;
        if (submitSpinner) submitSpinner.classList.remove('hidden');
        if (submitLabel) submitLabel.textContent = 'Sending...';

        const data = new FormData(form);
        const payload = {
            name: data.get('name'),
            email: data.get('email'),
            number: data.get('phone'),
            country_code: data.get('countryCode'),
            company_email: 'info@searchmyspace.in',
            project_name: 'Sobhaproperties: ' + (data.get('project') || 'General Enquiry'),
        };

        try {
            const res = await fetch('https://worldcity.online/send-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to send');

            if (formWrap) formWrap.classList.add('hidden');
            if (successEl) {
                successEl.classList.remove('hidden');
                successEl.classList.add('flex');
            }
        } catch (err) {
            if (errorEl) {
                errorEl.textContent = 'Something went wrong. Please try again or call us directly.';
                errorEl.classList.remove('hidden');
            }
        } finally {
            submitBtn.disabled = false;
            if (submitSpinner) submitSpinner.classList.add('hidden');
            if (submitLabel) submitLabel.textContent = 'Submit';
        }
    });
})();

(function () {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('galleryLightbox');
    if (!items.length || !lightbox) return;

    const images = items.map((item) => item.dataset.gallerySrc);
    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevButtons = [document.getElementById('lightboxPrevSide'), document.getElementById('lightboxPrevPill')];
    const nextButtons = [document.getElementById('lightboxNextSide'), document.getElementById('lightboxNextPill')];

    let currentIndex = null;

    const render = () => {
        if (currentIndex === null) return;
        image.src = images[currentIndex];
        counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
    };

    const open = (index) => {
        currentIndex = index;
        render();
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    };

    const close = () => {
        currentIndex = null;
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    };

    const prev = () => {
        if (currentIndex === null) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        render();
    };

    const next = () => {
        if (currentIndex === null) return;
        currentIndex = (currentIndex + 1) % images.length;
        render();
    };

    items.forEach((item, index) => {
        item.addEventListener('click', () => open(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    prevButtons.forEach((btn) => btn && btn.addEventListener('click', prev));
    nextButtons.forEach((btn) => btn && btn.addEventListener('click', next));

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) close();
    });

    document.addEventListener('keydown', (event) => {
        if (currentIndex === null) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') prev();
        if (event.key === 'ArrowRight') next();
    });
})();
