(() => {
  'use strict';
  const gallery = document.querySelector('.drone-gallery');
  if (!gallery) return;
  const track = gallery.querySelector('.drone-track');
  const slides = [...gallery.querySelectorAll('.drone-slide')];
  const thumbs = [...gallery.querySelectorAll('[data-slide]')];
  const previous = gallery.querySelector('[data-direction="-1"]');
  const next = gallery.querySelector('[data-direction="1"]');
  const names = thumbs.map(button => button.dataset.name || button.getAttribute('aria-label').replace(/^Ver página /, ''));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const thumbnailStrip = gallery.querySelector('#netglobe-thumbnails');
  let current = 0;
  let frame = 0;
  const position = index => slides[index].offsetLeft - slides[0].offsetLeft;
  let resizeFrame = 0;
  function resize() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      const height = `${slides[current].offsetHeight + 24}px`;
      if (track.style.height !== height) track.style.height = height;
    });
  }
  function update(index) {
    current = index;
    thumbs.forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
    gallery.querySelector('.drone-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    gallery.querySelector('.drone-active-name').textContent = names[current];
    if (thumbnailStrip) {
      const stripBounds = thumbnailStrip.getBoundingClientRect();
      const thumbBounds = thumbs[current].getBoundingClientRect();
      let shift = 0;
      if (thumbBounds.left < stripBounds.left + 4) shift = thumbBounds.left - stripBounds.left - 4;
      else if (thumbBounds.right > stripBounds.right - 4) shift = thumbBounds.right - stripBounds.right + 4;
      if (shift) thumbnailStrip.scrollBy({ left: shift, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
    resize();
  }
  function go(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: position(target), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  previous?.addEventListener('click', () => go(current - 1));
  next?.addEventListener('click', () => go(current + 1));
  thumbs.forEach((button, index) => button.addEventListener('click', () => go(index)));
  slides.forEach((slide, index) => {
    slide.querySelector('img').draggable = false;
    slide.addEventListener('click', () => {
      if (index !== current) go(index);
    });
  });
  track.addEventListener('keydown', event => {
    const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    go(targets[event.key]);
  });
  track.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      let nearest = 0;
      let distance = Infinity;
      const scrollLeft = track.scrollLeft;
      const firstLeft = slides[0].offsetLeft;
      slides.forEach((slide, index) => {
        const delta = Math.abs(slide.offsetLeft - firstLeft - scrollLeft);
        if (delta < distance) { nearest = index; distance = delta; }
      });
      if (nearest !== current) update(nearest);
    });
  }, { passive: true });
  slides.forEach(slide => slide.querySelector('img').addEventListener('load', resize));
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    slides.forEach(slide => observer.observe(slide));
  } else window.addEventListener('resize', resize);
  update(0);
})();
