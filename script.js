/**
 * ═══════════════════════════════════════════════════════
 * PARKHURST NUVISION — LANDING PAGE SCRIPT
 * script.js
 * ═══════════════════════════════════════════════════════
 *
 * Features:
 * — Sticky header scroll behavior
 * — Scroll reveal animations (IntersectionObserver)
 * — FAQ accordion
 * — Form validation + submission handler
 * — Mobile sticky CTA show/hide
 * — Footer year
 * — Smooth anchor scrolling offset
 */

'use strict';

/* ─── UTILITY ─────────────────────────────────────────── */

/**
 * Debounce — prevents rapid-fire events
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay = 100) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}


/* ─── HEADER SCROLL BEHAVIOR ──────────────────────────── */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function updateHeader() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', debounce(updateHeader, 30), { passive: true });
  updateHeader(); // run on load
})();


/* ─── SCROLL REVEAL ───────────────────────────────────── */
(function initScrollReveal() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealChildren = document.querySelectorAll('[data-reveal-child]');

  if (!revealTargets.length && !revealChildren.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  revealTargets.forEach(el => observer.observe(el));
  revealChildren.forEach(el => observer.observe(el));
})();


/* ─── FAQ ACCORDION ───────────────────────────────────── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('[data-faq]');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all open FAQs
      faqItems.forEach(other => {
        const otherBtn    = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          collapseAnswer(otherAnswer);
        }
      });

      // Toggle current
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        collapseAnswer(answer);
      } else {
        btn.setAttribute('aria-expanded', 'true');
        expandAnswer(answer);
      }
    });
  });

  function expandAnswer(el) {
    el.removeAttribute('hidden');
    el.style.maxHeight = '0';
    el.style.overflow = 'hidden';
    el.style.transition = 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)';

    requestAnimationFrame(() => {
      el.style.maxHeight = el.scrollHeight + 'px';
    });

    el.addEventListener('transitionend', () => {
      el.style.maxHeight = '';
      el.style.overflow = '';
    }, { once: true });
  }

  function collapseAnswer(el) {
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.overflow  = 'hidden';
    el.style.transition = 'max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1)';

    requestAnimationFrame(() => {
      el.style.maxHeight = '0';
    });

    el.addEventListener('transitionend', () => {
      el.setAttribute('hidden', '');
      el.style.maxHeight = '';
      el.style.overflow  = '';
      el.style.transition = '';
    }, { once: true });
  }
})();


/* ─── MOBILE STICKY CTA ───────────────────────────────── */
(function initMobileStickyCTA() {
  const cta  = document.getElementById('mobile-sticky-cta');
  const hero = document.querySelector('.hero');
  const formSection = document.getElementById('get-guide');

  if (!cta || !hero) return;

  function updateStickyCTA() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const formVisible = formSection
      ? formSection.getBoundingClientRect().top < window.innerHeight
      : false;

    // Show after hero scrolled past, hide when form is visible
    cta.classList.toggle('visible', heroBottom < 0 && !formVisible);
  }

  window.addEventListener('scroll', debounce(updateStickyCTA, 50), { passive: true });
  updateStickyCTA();
})();


/* ─── SMOOTH SCROLL WITH HEADER OFFSET ───────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10
      ) || 72;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 20;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ─── FORM HANDLER ────────────────────────────────────── */
(function initForm() {
  const form       = document.getElementById('guide-form');
  const submitBtn  = document.getElementById('form-submit-btn');
  const successDiv = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm(form)) return;

    setButtonLoading(true);

    try {
      /*
       * ╔══════════════════════════════════════════════════╗
       * ║  FORM ENDPOINT — CONFIGURE YOUR CRM / BACKEND   ║
       * ║                                                  ║
       * ║  OPTION 1: Netlify Forms (default)               ║
       * ║  ─ Add data-netlify="true" to <form>            ║
       * ║  ─ Change method below from fetch to            ║
       * ║    form.submit() for native Netlify handling     ║
       * ║                                                  ║
       * ║  OPTION 2: Custom API endpoint                   ║
       * ║  ─ Replace FORM_ENDPOINT with your URL          ║
       * ║  ─ e.g. Zapier webhook, HubSpot form API,       ║
       * ║    your own serverless function, etc.            ║
       * ║                                                  ║
       * ║  OPTION 3: HubSpot                               ║
       * ║  ─ Use HubSpot embed code in index.html         ║
       * ║  ─ Remove this form entirely                    ║
       * ║                                                  ║
       * ║  OPTION 4: Netlify Functions                     ║
       * ║  ─ Create /netlify/functions/submit-guide.js    ║
       * ║  ─ Point fetch to /.netlify/functions/submit-   ║
       * ║    guide                                         ║
       * ╚══════════════════════════════════════════════════╝
       */

      // ── NETLIFY FORMS SUBMISSION ──
      // Netlify automatically intercepts POST to the same page
      // when data-netlify="true" is set. We encode the form data:
      const formData = new FormData(form);

      // Remove honeypot from data (already excluded by name)
      // Track form source
      formData.append('source', 'pricing-guide-page');
      formData.append('page_url', window.location.href);
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        handleFormSuccess();
      } else {
        throw new Error('Submission failed');
      }

    } catch (err) {
      console.error('Form submission error:', err);
      handleFormError();
    } finally {
      setButtonLoading(false);
    }
  });


  /* ── VALIDATION ──────────────────────────────────────── */
  function validateForm(form) {
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    const required = form.querySelectorAll('[required]');

    required.forEach(field => {
      let fieldValid = true;

      if (field.type === 'checkbox') {
        fieldValid = field.checked;
      } else if (field.type === 'email') {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      } else {
        fieldValid = field.value.trim().length > 0;
      }

      if (!fieldValid) {
        valid = false;
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        const errorMsg = getErrorMessage(field);
        const errorEl  = document.createElement('span');
        errorEl.className   = 'field-error';
        errorEl.textContent = errorMsg;
        errorEl.style.cssText = `
          display: block;
          font-size: 0.75rem;
          color: #ef5350;
          margin-top: 4px;
        `;
        field.parentNode.appendChild(errorEl);
      } else {
        field.removeAttribute('aria-invalid');
      }
    });

    // Honeypot check
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) {
      // Bot detected — silently succeed
      handleFormSuccess();
      return false;
    }

    if (!valid) {
      // Focus first error
      const firstError = form.querySelector('.form-input.error');
      if (firstError) firstError.focus();
    }

    return valid;
  }

  function getErrorMessage(field) {
    if (field.type === 'checkbox') return 'Please check this box to continue.';
    if (field.type === 'email')    return 'Please enter a valid email address.';
    if (field.name === 'first_name') return 'Please enter your first name.';
    if (field.name === 'last_name')  return 'Please enter your last name.';
    return 'This field is required.';
  }


  /* ── STATE CHANGES ───────────────────────────────────── */
  function setButtonLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('loading', loading);
  }

  function handleFormSuccess() {
    form.style.display = 'none';
    if (successDiv) {
      successDiv.removeAttribute('hidden');
      successDiv.focus();
    }

    // ── ANALYTICS HOOK ──────────────────────────────────
    // Fire conversion event to your analytics platform
    // Remove / replace with your actual tracking:

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'guide_download', {
        event_category: 'Lead',
        event_label: 'Pricing Guide Form',
        value: 1,
      });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'Pricing Guide' });
    }

    // Scroll to success message
    if (successDiv) {
      const top = successDiv.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function handleFormError() {
    const errorEl = document.createElement('div');
    errorEl.className = 'form-submit-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.style.cssText = `
      padding: 12px 16px;
      background: rgba(239,83,80,0.1);
      border: 1px solid rgba(239,83,80,0.3);
      border-radius: 8px;
      font-size: 0.875rem;
      color: #ef5350;
      text-align: center;
      margin-top: 16px;
    `;
    errorEl.textContent = 'Something went wrong. Please call us at (210) 585-2020 or try again.';

    // Remove any existing error
    form.querySelector('.form-submit-error')?.remove();
    form.appendChild(errorEl);
  }


  /* ── LIVE VALIDATION (on blur) ───────────────────────── */
  form.querySelectorAll('.form-input').forEach(field => {
    field.addEventListener('blur', function () {
      if (this.value.trim() || this.type === 'checkbox') {
        this.classList.remove('error');
        this.removeAttribute('aria-invalid');
        this.parentNode.querySelector('.field-error')?.remove();
      }
    });
  });
})();


/* ─── FOOTER YEAR ─────────────────────────────────────── */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─── PRICING CARDS — STAGGER REVEAL ─────────────────── */
(function initCardStagger() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll('.pricing-card, .transformation-card, .testimonial-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(card);
  });
})();
