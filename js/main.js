/**
 * YADE AMBULANTE PFLEGE & BETREUUNG - MAIN INTERACTIVE SCRIPT
 * Vanilla JS (ES6)
 * München-Neuperlach
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  initFaqAccordion();
  initCallbackModal();
  initFormValidation();
  initTestimonialSlider();
});

/* --------------------------------------------------------------------------
   1. Navigation & Scroll Handling
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!header) return;

  // Header background state on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md', 'py-3');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('shadow-md', 'py-3');
      header.classList.add('py-5');
    }

    // Active Section Link Highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-yade-emerald', 'font-bold');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('text-yade-emerald', 'font-bold');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Menu Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const menuBackdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !menuDrawer) return;

  const openDrawer = () => {
    menuDrawer.classList.remove('translate-x-full');
    if (menuBackdrop) menuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    menuDrawer.classList.add('translate-x-full');
    if (menuBackdrop) menuBackdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menuDrawer.classList.contains('translate-x-full')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-element');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.counter-val');
  if (!counterElements.length) return;

  let hasAnimated = false;
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Ease out quadratic function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easedProgress * target);

        counter.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other open accordions for clean accordion UX
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherHeader = otherItem.querySelector('.accordion-header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Rückruf Modal Dialog
   -------------------------------------------------------------------------- */
function initCallbackModal() {
  const modalBackdrop = document.getElementById('callback-modal');
  const triggerBtns = document.querySelectorAll('.trigger-callback-modal');
  const closeBtns = document.querySelectorAll('.close-callback-modal');
  const form = document.getElementById('callback-modal-form');
  const successMsg = document.getElementById('callback-success-msg');

  if (!modalBackdrop) return;

  const openModal = () => {
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstInput = modalBackdrop.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successMsg) {
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
        setTimeout(() => {
          closeModal();
          // Reset after closing
          setTimeout(() => {
            form.reset();
            form.classList.remove('hidden');
            successMsg.classList.add('hidden');
          }, 400);
        }, 3000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Form Validation & Submission Handling
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success-msg');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic HTML5 validation pass
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Wird gesendet...
      `;
    }

    setTimeout(() => {
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Nachricht erfolgreich gesendet ✓`;
        submitBtn.classList.remove('bg-yade-emerald', 'hover:bg-yade-dark');
        submitBtn.classList.add('bg-green-700');
      }

      if (contactSuccess) {
        contactSuccess.classList.remove('hidden');
        contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   8. Testimonial Slider / Controls
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!cards.length) return;

  let currentIndex = 0;

  const showTestimonial = (index) => {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.remove('hidden', 'opacity-0');
        card.classList.add('block', 'opacity-100');
      } else {
        card.classList.add('hidden', 'opacity-0');
        card.classList.remove('block', 'opacity-100');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-yade-emerald', 'w-8');
        dot.classList.remove('bg-gray-300', 'w-3');
      } else {
        dot.classList.remove('bg-yade-emerald', 'w-8');
        dot.classList.add('bg-gray-300', 'w-3');
      }
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      showTestimonial(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      showTestimonial(currentIndex);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentIndex = i;
      showTestimonial(currentIndex);
    });
  });

  // Auto slide every 7 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    showTestimonial(currentIndex);
  }, 7000);
}
