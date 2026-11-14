/* =========================================================
   Barrel Tech Lombok — Main JavaScript
   Lightweight vanilla JS — no external dependencies
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Mobile Navigation Toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Buka menu navigasi');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  var toTop = document.getElementById('to-top');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  if (sections.length && navLinks.length) {
    function setActive() {
      var scrollPos = window.scrollY + 120;
      var currentId = '';
      for (var i = 0; i < sections.length; i++) {
        var sec = sections[i];
        if (sec.offsetTop <= scrollPos) currentId = sec.id;
      }
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        link.classList.toggle('is-active', href === '#' + currentId);
      });
    }
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(
    '.service-card, .adv-card, .process-item, .contact-card, .hero-card, .hours-card, .services-note, .contact-cta, .area-card, .area-note'
  ));
  revealEls.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });

    // Safety net: if any element is still hidden after 2.5s, reveal it.
    // Handles edge cases where the observer doesn't fire (e.g., above-the-fold
    // content on very tall pages, or browsers with quirks).
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains('is-visible')) el.classList.add('is-visible');
      });
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll fallback for older browsers ---------- */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo(0, target.offsetTop - 90);
        }
      });
    });
  }

  /* ---------- WhatsApp link tracking (no PII) ---------- */
  document.querySelectorAll('a[href*="wa.me"], a[href*="wa.link"]').forEach(function (link) {
    link.addEventListener('click', function () {
      // Lightweight, anonymous event hook — safe to extend with analytics
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'whatsapp_click', { event_category: 'engagement' });
      }
    });
  });
})();
