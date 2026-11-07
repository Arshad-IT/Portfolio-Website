/**
 * ================================================================
 * Portfolio Website — Custom Neon Arrow Cursor & Particle Trail
 * High performance, zero-lag pointer with dynamic velocity tilt,
 * interactive hover scaling, and celestial neon stardust comet trail.
 * ================================================================
 */

(function () {
  'use strict';

  // 1. Guardrail: Exit immediately on touch/mobile devices
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) or (pointer: coarse)').matches;

  if (isTouchDevice) {
    return;
  }

  // 2. DOM Elements
  const cursorDot = document.getElementById('cursor-dot');
  const canvas = document.getElementById('cursor-canvas');

  if (!cursorDot) {
    return;
  }

  const ctx = canvas ? canvas.getContext('2d') : null;

  // 3. Coordinate State
  let mouseX = -100;
  let mouseY = -100;
  let lastMouseX = -100;
  let lastMouseY = -100;

  let currentAngle = 0;
  let targetAngle = 0;
  let isHovered = false;
  let isInput = false;
  let isVisible = false;

  // 4. Particle Stardust Comet System
  const particles = [];
  const MAX_PARTICLES = 30;
  const PARTICLE_COLORS = [
    'rgba(192, 132, 252, ', // Neon Violet
    'rgba(168, 85, 247, ', // Deep Purple
    'rgba(56, 189, 248, ',  // Neon Cyan accent
    'rgba(233, 213, 255, '  // Bright Lilac
  ];

  class Particle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 4;
      this.y = y + (Math.random() - 0.5) * 4;
      this.vx = (Math.random() - 0.5) * 1.4;
      this.vy = (Math.random() - 0.5) * 1.4 + 0.3; // subtle gentle drift
      this.size = Math.random() * 2.8 + 1.2;
      this.life = 1;
      this.decay = Math.random() * 0.04 + 0.025;
      this.colorBase = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.size *= 0.96;
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.fillStyle = `${this.colorBase}${this.life * 0.85})`;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.2, this.size), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const resizeCanvas = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // 5. Mouse Event Listeners
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorDot.classList.add('visible');
    }

    // Spawn 1-2 stardust particles when cursor moves
    if (ctx && particles.length < MAX_PARTICLES) {
      const count = Math.random() > 0.3 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        // Spawn behind the arrow tip
        particles.push(new Particle(mouseX + 10, mouseY + 12));
      }
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    isVisible = false;
    cursorDot.classList.remove('visible');
  });

  window.addEventListener('mouseenter', () => {
    isVisible = true;
    cursorDot.classList.add('visible');
  });

  // 6. Interactive Click Ripple & Active State
  window.addEventListener('mousedown', (e) => {
    cursorDot.classList.add('active');

    // Create subtle click ripple from tip
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    ripple.style.width = '40px';
    ripple.style.height = '40px';
    document.body.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });

  window.addEventListener('mouseup', () => {
    cursorDot.classList.remove('active');
  });

  // 7. Interactive Hover Delegation (Links, Buttons, Cards, Inputs)
  const INTERACTIVE_SELECTOR = [
    'a',
    'button',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '.project-card',
    '.skill-card',
    '.service-card',
    '.contact-card',
    '.stat-item',
    '.filter-btn',
    '.skill-tab',
    '.social-link',
    '.tech-item',
    '.service-highlight-card',
    '.hamburger',
    '.back-to-top'
  ].join(',');

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(INTERACTIVE_SELECTOR);
    if (!target) return;

    if (target.matches('input, textarea')) {
      isInput = true;
      cursorDot.classList.add('text-mode');
    } else {
      isHovered = true;
      cursorDot.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(INTERACTIVE_SELECTOR);
    if (!target) return;

    if (isInput) {
      isInput = false;
      cursorDot.classList.remove('text-mode');
    }
    if (isHovered) {
      isHovered = false;
      cursorDot.classList.remove('hover');
    }
  });

  // 8. Animation Loop (60-120 FPS requestAnimationFrame)
  function render() {
    if (isVisible) {
      // 8a. Instant positioning for arrow tip (hot-spot at 4px, 4px)
      cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

      // 8b. Dynamic angle tilt based on velocity vector
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1.2) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Subtle tilt (-16 to +16 deg) for elegance
        targetAngle = Math.max(-16, Math.min(16, angle * 0.15));
      } else {
        targetAngle = 0;
      }

      currentAngle += (targetAngle - currentAngle) * 0.14;
      const arrowSvg = cursorDot.querySelector('.cursor-arrow-svg');
      if (arrowSvg) {
        const baseScale = isHovered ? 1.22 : (cursorDot.classList.contains('active') ? 0.85 : 1);
        arrowSvg.style.transform = `scale(${baseScale}) rotate(${currentAngle}deg)`;
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // 8c. Render Stardust Comet Particles on Canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          p.draw(ctx);
          if (p.life <= 0 || p.size <= 0.2) {
            particles.splice(i, 1);
          }
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
