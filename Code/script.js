/**
 * ====================================================================
 * PARTH JIRAPURE - STUDENT DEVELOPER PORTFOLIO
 * Symbiosis Institute of Technology (SIT), Nagpur
 * Clean & Minimalist JavaScript Controller
 * ====================================================================
 * Focus: High readability, crisp interactions, and zero bloat.
 * 1. Dark/Light theme switching with localStorage persistence
 * 2. Mobile navigation toggle & outside-click handling
 * 3. Smooth offset scrolling & active navigation link tracking
 * 4. Dynamic role banner rotation in hero
 * 5. Project & Certificate category filtering
 * 6. Accessible modal dialogs (Project details & Certificate previews)
 * 7. Copy-to-clipboard email utility with subtle toast alert
 * 8. Client-side email generator (mailto)
 * 9. Scroll-reveal animations with reduced-motion support
 * 10. Back-to-top button
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------
  // 1. THEME CONTROLLER (DARK / LIGHT MODE)
  // ------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const STORAGE_KEY = 'parth-portfolio-theme';

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return systemPrefersLight ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  // Initialize theme on page load
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ------------------------------------------------------------------
  // 2. MOBILE NAVIGATION MENU
  // ------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const closeMobileMenu = () => {
    if (mobileToggleBtn && navMenu) {
      mobileToggleBtn.classList.remove('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  };

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggleBtn.classList.toggle('is-active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  // ------------------------------------------------------------------
  // 3. ACTIVE NAVIGATION LINK TRACKING (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach((section) => navObserver.observe(section));
  }


  // ------------------------------------------------------------------
  // 5. PROJECT & CERTIFICATE CATEGORY FILTERING
  // ------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedFilter === 'all' || cardCategory === selectedFilter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // 5b. Certifications Category Filtering
  const certFilterButtons = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  if (certFilterButtons.length > 0 && certCards.length > 0) {
    certFilterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        certFilterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.getAttribute('data-filter');

        certCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedFilter === 'all' || cardCategory === selectedFilter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // ------------------------------------------------------------------
  // 6. ACCESSIBLE MODALS (PROJECT DETAILS & CERTIFICATE PREVIEWS)
  // ------------------------------------------------------------------
  let lastFocusedElement = null;

  const openModal = (modalElement) => {
    if (!modalElement) return;
    lastFocusedElement = document.activeElement;
    modalElement.classList.add('is-open');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = modalElement.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }
  };

  const closeModal = (modalElement) => {
    if (!modalElement) return;
    modalElement.classList.remove('is-open');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  // Wire up Project Detail Modal Triggers
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetModalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(targetModalId);
      openModal(targetModal);
    });
  });

  // Wire up Certificate & Document Preview Modal Triggers
  const certModal = document.getElementById('modal-certificate-preview');
  const certPreviewImg = document.getElementById('cert-preview-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalBadge = document.getElementById('cert-modal-badge');
  const certModalVerifyLink = document.getElementById('cert-modal-verify-link');
  const certModalPdfLink = document.getElementById('cert-modal-pdf-link');
  const openCertButtons = document.querySelectorAll('.open-cert-modal-btn');

  openCertButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const certSrc = btn.getAttribute('data-cert');
      const certTitle = btn.getAttribute('data-cert-title');
      const certBadge = btn.getAttribute('data-badge') || 'Verifiable Document';
      const certVerify = btn.getAttribute('data-verify');
      const certPdf = btn.getAttribute('data-pdf');

      if (certPreviewImg && certSrc) {
        certPreviewImg.src = certSrc;
      }
      if (certModalTitle && certTitle) {
        certModalTitle.textContent = certTitle;
      }
      if (certModalBadge) {
        certModalBadge.textContent = certBadge;
      }
      if (certModalVerifyLink) {
        if (certVerify) {
          certModalVerifyLink.href = certVerify;
          certModalVerifyLink.style.display = 'inline-flex';
        } else {
          certModalVerifyLink.style.display = 'none';
        }
      }
      if (certModalPdfLink) {
        if (certPdf) {
          certModalPdfLink.href = certPdf;
          certModalPdfLink.style.display = 'inline-flex';
        } else {
          certModalPdfLink.style.display = 'none';
        }
      }
      openModal(certModal);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Close modals when clicking close button, action button, or backdrop
  const allModals = document.querySelectorAll('.modal-backdrop');
  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    const closeButtons = modal.querySelectorAll('.modal-close-btn, .modal-close-action');
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        closeModal(modal);
      });
    });
  });

  // Global Escape key listener to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElement = document.querySelector('.modal-backdrop.is-open');
      if (openModalElement) {
        closeModal(openModalElement);
      }
    }
  });

  // ------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // ------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, duration = 2500) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--accent-primary);">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  };

  // ------------------------------------------------------------------
  // 8. EMAIL COPY-TO-CLIPBOARD INTERACTION
  // ------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailTextElement = document.getElementById('email-address-text');

  if (copyEmailBtn && emailTextElement) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailTextElement.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = email;
          tempInput.style.position = 'fixed';
          tempInput.style.left = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          tempInput.remove();
        }
        showToast('Email address copied to clipboard');
      } catch (err) {
        showToast('Email: ' + email);
      }
    });
  }

  // ------------------------------------------------------------------
  // 9. CLIENT-SIDE DIRECT MAIL GENERATOR (MAILTO)
  // ------------------------------------------------------------------
  const directMailForm = document.getElementById('direct-mail-form');
  if (directMailForm) {
    directMailForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('mail-sender-name').value.trim();
      const subject = document.getElementById('mail-subject').value.trim();
      const body = document.getElementById('mail-body').value.trim();

      const recipientEmail = 'parth.jirapure@sitnagpur.siu.edu.in';
      const formattedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${senderName}`);
      const formattedBody = encodeURIComponent(`Hello Parth,\n\n${body}\n\nBest regards,\n${senderName}`);

      const mailtoUrl = `mailto:${recipientEmail}?subject=${formattedSubject}&body=${formattedBody}`;

      showToast('Opening default email client...');
      window.location.href = mailtoUrl;
    });
  }

  // ------------------------------------------------------------------
  // 10. BACK-TO-TOP BUTTON
  // ------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------
  // 11. SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // ------------------------------------------------------------------
  // 12. DYNAMIC FOOTER COPYRIGHT YEAR
  // ------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
