/* ========================================
   Portfolio — Hover · Lightbox · Zoom
   ======================================== */

/* ==========================================
   1. CUSTOM CURSOR
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

  document.querySelectorAll('[data-cursor]').forEach(el => {
    const text = el.dataset.cursor;
    el.addEventListener('mouseenter', () => {
      cursorText.textContent = text === 'view' ? '查看' : text === 'play' ? '播放' : text;
      cursor.classList.add('has-text');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('has-text');
    });
  });
}

/* ==========================================
   2. LIGHTBOX
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
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const video = document.getElementById('lightbox-video');
  const img = document.getElementById('lightbox-img');

  lightbox.classList.remove('active');
  video.pause();
  video.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery__item[data-src]');
  if (item) { openLightbox(item); return; }
  if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox__close')) closeLightbox();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ==========================================
   3. VIDEO HOVER
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
   4. GALLERY STICKY ZOOM
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
  initCursor();
  initVideoHover();
  initGalleryZoom();
});
