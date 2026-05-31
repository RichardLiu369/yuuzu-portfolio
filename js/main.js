/* ========================================
   Don Molinico Style
   Lenis · GSAP · Cursor · Parallax
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

/* ==========================================
   0. STARFIELD CANVAS
   ========================================== */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.min(200, Math.floor((canvas.width * canvas.height) / 6000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.2 + 0.02,
        twinkle: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.phase += s.twinkle;
      const a = s.opacity * (Math.sin(s.phase) * 0.3 + 0.7);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,215,200,${a})`;
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
    });
    animId = requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener('resize', () => { resize(); createStars(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}

/* ==========================================
   1. LENIS SMOOTH SCROLL
   ========================================== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ==========================================
   2. CUSTOM CURSOR
   ========================================== */
function initCursor() {
  if (window.innerWidth <= 768) return;

  const cursor = document.getElementById('cursor');
  const cursorText = document.getElementById('cursorText');
  if (!cursor || !cursorText) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Cursor text on hover
  document.querySelectorAll('[data-cursor]').forEach(el => {
    const text = el.dataset.cursor;
    el.addEventListener('mouseenter', () => {
      cursorText.textContent = text === 'view' ? '查看' : text === 'play' ? '播放' : text === 'menu' ? '菜单' : text;
      cursor.classList.add('has-text');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('has-text');
    });
  });
}

/* ==========================================
   4. HERO ANIMATION
   ========================================== */
function initHeroAnimation() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

  tl.from('.hero__name', {
    y: 40, opacity: 0, duration: 0.8
  })
  .from('.hero__eyebrow', {
    y: 20, opacity: 0, duration: 0.6
  }, '-=0.4')
  .from('.hero__line span', {
    y: '110%', opacity: 0, duration: 0.9,
    stagger: 0.12, ease: 'power4.out'
  }, '-=0.3')
  .from('.hero__subtitle', {
    y: 20, opacity: 0, duration: 0.6
  }, '-=0.4')
  .from('.hero__cta .btn', {
    y: 20, opacity: 0, duration: 0.5,
    stagger: 0.08
  }, '-=0.3');
}

/* ==========================================
   6. SCROLL REVEALS
   ========================================== */
function initReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Standard reveals
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stagger gallery items — clear inline styles after reveal so CSS hover works
  gsap.utils.toArray('.gallery').forEach(grid => {
    const items = grid.querySelectorAll('.gallery__item');
    gsap.fromTo(items,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7, stagger: 0.06, ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stagger stats
  const stats = document.querySelectorAll('.stat');
  if (stats.length) {
    gsap.fromTo(stats,
      { y: 30, opacity: 0, scale: 0.97 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.6, stagger: 0.08, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.about__stats',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Stagger skills
  const skills = document.querySelectorAll('.skill');
  if (skills.length) {
    gsap.fromTo(skills,
      { y: 30, opacity: 0, scale: 0.97 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.6, stagger: 0.06, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.skills__grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Hero title lines
  gsap.utils.toArray('.hero__line span').forEach((line, i) => {
    gsap.fromTo(line,
      { y: '110%' },
      {
        y: '0%',
        duration: 0.9,
        ease: 'power4.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.12
      }
    );
  });
}

/* ==========================================
   7. PARALLAX
   ========================================== */
function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Hero background parallax
  const heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) {
    gsap.to(heroBg, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Image parallax
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const amount = parseFloat(el.dataset.parallax) || 0.05;
    gsap.to(el, {
      y: -60 * amount * 10,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
}

/* ==========================================
   8. NUMBER COUNT UP
   ========================================== */
function initCountUp() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        });
      },
      once: true
    });
  });
}

/* ==========================================
   9. LIGHTBOX
   ========================================== */
function openLightbox(el) {
  const src = el.dataset.src;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  img.src = src;
  img.style.display = 'block';
  video.style.display = 'none';
  video.pause();

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lenis.stop();

  gsap.fromTo(img,
    { scale: 0.95, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
  );
}

function openVideoLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  img.style.display = 'none';
  video.src = src;
  video.style.display = 'block';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lenis.stop();

  gsap.fromTo(video,
    { scale: 0.95, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
  );
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const video = document.getElementById('lightbox-video');
  const img = document.getElementById('lightbox-img');

  gsap.to([img, video], {
    scale: 0.95, opacity: 0,
    duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      lightbox.classList.remove('active');
      video.pause();
      video.src = '';
      document.body.style.overflow = '';
      lenis.start();
    }
  });
}

document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery__item[data-src]');
  if (item) { openLightbox(item); return; }
  if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox__close')) closeLightbox();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ==========================================
   10. VIDEO HOVER
   ========================================== */
function initVideoHover() {
  document.querySelectorAll('.gallery__item--video').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play());
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

/* ==========================================
   11. GALLERY STICKY ZOOM
   ========================================== */
function initGalleryZoom() {
  document.querySelectorAll('.gallery').forEach(gallery => {
    let zoomedItem = null;

    gallery.addEventListener('mousemove', (e) => {
      const item = e.target.closest('.gallery__item');
      if (item && item !== zoomedItem) {
        if (zoomedItem) zoomedItem.classList.remove('is-zoomed');
        item.classList.add('is-zoomed');
        zoomedItem = item;
      }
    });

    gallery.addEventListener('mouseleave', () => {
      if (zoomedItem) {
        zoomedItem.classList.remove('is-zoomed');
        zoomedItem = null;
      }
    });
  });
}

/* ==========================================
   Initialize
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initHeroAnimation();
  initCursor();
  initReveals();
  initParallax();
  initCountUp();
  initVideoHover();
  initGalleryZoom();
});
