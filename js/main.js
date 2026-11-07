/**
 * main.js — Core Functionality for Portfolio Website
 * Handles navigation, typing effect, filtering, scroll effects, and more.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Navbar Scroll Effect
  // ============================================================
  const navbar = document.querySelector('.navbar');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll);
  // Run once on load in case page is already scrolled
  handleNavbarScroll();


  // ============================================================
  // 2. Active Nav Link on Scroll (IntersectionObserver)
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -40% 0px'
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }


  // ============================================================
  // 3. Mobile Hamburger Menu
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  const closeMobileMenu = () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinksContainer) navLinksContainer.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  const openMobileMenu = () => {
    if (hamburger) hamburger.classList.add('active');
    if (navLinksContainer) navLinksContainer.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.classList.add('menu-open');
  };

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinksContainer.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking links inside drawer
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }


  // ============================================================
  // 4. Typing Effect
  // ============================================================
  const typedTextEl = document.querySelector('.typed-text');
  const cursorEl = document.querySelector('.cursor');

  if (typedTextEl) {
    const words = ['Web Developer', 'App Developer', 'UI/UX Enthusiast', 'Problem Solver'];
    const typingSpeed = 100;   // ms per character
    const erasingSpeed = 50;   // ms per character
    const pauseAfterTyping = 2000;
    const pauseAfterErasing = 500;

    let wordIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    const type = () => {
      const currentWord = words[wordIndex];

      if (!isErasing) {
        // Typing
        typedTextEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
          // Finished typing — pause, then start erasing
          isErasing = true;
          setTimeout(type, pauseAfterTyping);
        } else {
          setTimeout(type, typingSpeed);
        }
      } else {
        // Erasing
        typedTextEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished erasing — move to next word
          isErasing = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, pauseAfterErasing);
        } else {
          setTimeout(type, erasingSpeed);
        }
      }
    };

    // Start the typing effect
    type();
  }


  // ============================================================
  // 5. Smooth Scroll for Anchor Links
  // ============================================================
  const NAVBAR_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });


  // ============================================================
  // 6. Back to Top Button
  // ============================================================
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    const handleBackToTopVisibility = () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleBackToTopVisibility);
    handleBackToTopVisibility();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ============================================================
  // 7. Skill Tabs Filtering
  // ============================================================
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillTabs.length && skillCards.length) {
    skillTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active tab
        skillTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        // Filter skill cards with fade animation
        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            // Trigger reflow for re-animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  // ============================================================
  // 8. Project Filtering
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Filter project cards with animation
        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            // Trigger reflow for re-animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  // ============================================================
  // 9. Skill Progress Bars Animation
  // ============================================================
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  if (skillProgressBars.length) {
    // Start with 0 width
    skillProgressBars.forEach((bar) => {
      bar.style.width = '0%';
    });

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress');

          if (targetWidth) {
            bar.style.transition = 'width 1.2s ease-in-out';
            bar.style.width = `${targetWidth}%`;
          }

          progressObserver.unobserve(bar);
        }
      });
    }, {
      threshold: 0.2
    });

    skillProgressBars.forEach((bar) => progressObserver.observe(bar));
  }

});
