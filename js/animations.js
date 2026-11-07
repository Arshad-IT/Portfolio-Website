/**
 * animations.js — Scroll-Triggered Animations for Portfolio Website
 * Handles fade-in, slide, scale animations and stat counter effects.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // Scroll-Triggered Element Animations (IntersectionObserver)
  // ============================================================
  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-up, .slide-left, .slide-right, .scale-in'
  );

  if (animatedElements.length) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Only animate once — stop observing after activation
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((el) => animationObserver.observe(el));
  }


  // ============================================================
  // Counter Animation for Stat Numbers
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    /**
     * Animate a number counting from 0 to `target` over `duration` ms.
     * Preserves any suffix (like "+") found in the original text.
     *
     * @param {HTMLElement} el       — The element whose text to animate.
     * @param {number}      target   — The numeric target value.
     * @param {string}      suffix   — Any non-numeric suffix (e.g., "+").
     * @param {number}      duration — Animation duration in milliseconds.
     */
    const animateCounter = (el, target, suffix, duration = 2000) => {
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out quad for a natural deceleration
        const easedProgress = 1 - (1 - progress) * (1 - progress);

        const currentValue = Math.floor(easedProgress * target);
        el.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Ensure final value is exact
          el.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawText = el.textContent.trim();

          // Extract the numeric part and any suffix (e.g., "10+" → 10, "+")
          const match = rawText.match(/^(\d+)(.*)$/);

          if (match) {
            const target = parseInt(match[1], 10);
            const suffix = match[2] || '';
            animateCounter(el, target, suffix);
          }

          counterObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach((el) => counterObserver.observe(el));
  }

});
