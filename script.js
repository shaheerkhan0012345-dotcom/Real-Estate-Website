/**
 * EverGreen Real Estate – Main JavaScript
 * Features: Loader, Navbar scroll, AOS init, FAQ accordion,
 *           Counter animation, Testimonial slider, Parallax, Smooth scroll
 */

/* ================================================
   1. LOADER
   ================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Give a tiny extra delay so the animation finishes gracefully
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2000);
});

/* ================================================
   2. AOS (Animate On Scroll) INIT
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {

  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  /* ================================================
     3. NAVBAR – Scroll effect + Active link
     ================================================ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function onScroll() {
    // ── Toggle scrolled class
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ── Active nav link based on visible section
    let current = '';
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) link.classList.add('active');
    });

    // ── Parallax on CTA
    parallaxCTA();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ================================================
     4. HAMBURGER MENU
     ================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('navLinks');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on link click (mobile)
    mobileNav.querySelectorAll('.nav-link').forEach((ln) => {
      ln.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ================================================
     5. HERO PILLS – toggle active
     ================================================ */
  const pills = document.querySelectorAll('.pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ================================================
     6. SEARCH BUTTON – micro interaction
     ================================================ */
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchBtn.textContent = '⏳  Searching…';
      searchBtn.style.opacity = '0.75';
      searchBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        searchBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Search Properties
        `;
        searchBtn.style.opacity = '1';
        searchBtn.style.pointerEvents = 'auto';

        // Smooth scroll to listings
        document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1200);
    });
  }

  /* ================================================
     7. COUNTER ANIMATION (Intersection Observer)
     ================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Observe stats section
  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* ================================================
     8. FAQ ACCORDION
     ================================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      faqItems.forEach((fi) => {
        fi.classList.remove('active');
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ================================================
     9. TESTIMONIAL SLIDER
     ================================================ */
  const slides   = document.querySelectorAll('.testimonial-slide');
  const dots     = document.querySelectorAll('.dot');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  let currentIdx = 0;
  let autoSlideTimer;

  function goToSlide(index) {
    slides[currentIdx].classList.remove('active');
    dots[currentIdx].classList.remove('active');
    currentIdx = (index + slides.length) % slides.length;
    slides[currentIdx].classList.add('active');
    dots[currentIdx].classList.add('active');
  }

  function startAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => goToSlide(currentIdx + 1), 5000);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { goToSlide(currentIdx - 1); startAutoSlide(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentIdx + 1); startAutoSlide(); });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
      startAutoSlide();
    });
  });

  startAutoSlide();

  /* ================================================
     10. PARALLAX – CTA Background
     ================================================ */
  const ctaBg = document.getElementById('ctaBg');

  function parallaxCTA() {
    if (!ctaBg) return;
    const rect = document.querySelector('.cta-section')?.getBoundingClientRect();
    if (!rect) return;
    const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.15;
    ctaBg.style.transform = `translateY(${offset}px)`;
  }

  /* ================================================
     11. SCROLL REVEAL – generic fallback for no AOS
     ================================================ */
  const revealEls = document.querySelectorAll('[data-aos]');

  if (!('IntersectionObserver' in window)) {
    // If no support, just show everything
    revealEls.forEach((el) => el.classList.add('aos-animate'));
  }

  /* ================================================
     12. PROPERTY FAV BUTTON – toggle heart
     ================================================ */
  document.querySelectorAll('.property-fav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isSaved = btn.dataset.saved === 'true';
      btn.dataset.saved = !isSaved;
      btn.textContent = isSaved ? '♡' : '♥';
      btn.style.color = isSaved ? '' : '#e74c3c';
    });
  });

  /* ================================================
     13. SMOOTH SCROLL for anchor links
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ================================================
     14. LAZY LOAD – native + polyfill for img
     ================================================ */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported, do nothing
  } else {
    // Polyfill: use IntersectionObserver
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach((img) => imgObserver.observe(img));
  }

  /* ================================================
     15. FEATURE SECTION HEADING (typing-style stagger)
     ================================================ */
  // Nothing extra needed; AOS handles visibility

}); // end DOMContentLoaded
