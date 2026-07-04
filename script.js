/*
  Nurture Nature - client-side behaviors
  - Mobile navigation menu toggle
  - Smooth scrolling for anchor links
  - Fade-in animations via IntersectionObserver
  - Scroll-to-top button
*/

(() => {
  const body = document.body;

  // ---------- Mobile menu ----------
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function setMenuOpen(open) {
    if (!mobileMenu) return;
    mobileMenu.dataset.open = open ? 'true' : 'false';
    // Update aria-expanded
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(open));
  }

  if (toggleBtn && mobileMenu) {
    setMenuOpen(false);

    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.dataset.open === 'true';
      setMenuOpen(!isOpen);
    });

    // Close menu when clicking a link
    mobileMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('a')) {
        setMenuOpen(false);
      }
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    });
  }

  // ---------- Smooth scrolling ----------
  // Note: CSS also has scroll-behavior: smooth; this adds support for browsers
  // where JS is preferred and lets us close mobile menu.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const id = href.slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    e.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile menu when navigating
    setMenuOpen(false);
  });

  // ---------- Intersection Observer fade-in ----------
  const revealEls = document.querySelectorAll('[data-reveal], .reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    {
      // Trigger a bit before the element is fully in view
      root: null,
      threshold: 0.14,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  revealEls.forEach((el) => {
    // Only observe elements that aren't already visible
    if (!el.classList.contains('is-visible')) observer.observe(el);
  });

  // ---------- Scroll-to-top ----------
  const scrollBtn = document.getElementById('scrollTop');

  function updateScrollButton() {
    if (!scrollBtn) return;
    const shouldShow = window.scrollY > 600;
    scrollBtn.dataset.visible = shouldShow ? 'true' : 'false';
  }

  window.addEventListener('scroll', updateScrollButton, { passive: true });
  updateScrollButton();

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

