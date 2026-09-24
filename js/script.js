(() => {
  'use strict';
  const header = document.querySelector('.header');
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeader();
  let headerFrame = 0;
  window.addEventListener('scroll', () => {
    if (headerFrame) return;
    headerFrame = requestAnimationFrame(() => { headerFrame = 0; updateHeader(); });
  }, { passive: true });
  document.querySelector('#year').textContent = new Date().getFullYear();
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  menu.hidden = false;
  menu.inert = true;
  function closeMenu() {
    menu.classList.remove('is-open');
    menu.inert = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }
  menuButton.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) {
      closeMenu();
      return;
    }
    menu.inert = false;
    menu.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fechar menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.querySelectorAll('.browser img').forEach(img => {
    function handleError() { img.style.display = 'none'; }
    img.addEventListener('error', handleError);
    if (img.complete && !img.naturalWidth) handleError();
  });
  const copyButton = document.querySelector('.copy-email');
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('giuliazacbel@gmail.com');
      status.textContent = 'E-mail copiado! Vamos conversar.';
    } catch {
      status.textContent = 'Selecione e copie: giuliazacbel@gmail.com';
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email'));
      selection.removeAllRanges(); selection.addRange(range);
    }
  });
  const ticker = document.querySelector('.ticker-track');
  if (ticker && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      ticker.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
    observer.observe(ticker);
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || navigator.connection?.saveData) return;
  const scriptBase = new URL('.', document.currentScript.src);
  const loadScript = file => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(file, scriptBase).href;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  const startMotion = () => {
    if (reducedMotion.matches) return;
    Promise.all([loadScript('vendor/gsap.min.js'), loadScript('vendor/ScrollTrigger.min.js')])
      .then(() => loadScript('motion.js?v=20260924-1'))
      .catch(() => { /* Content remains visible if optional animation scripts fail. */ });
  };
  // Give the initial render and essential controls priority over decorative motion.
  requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(startMotion, { timeout: 1500 });
    else setTimeout(startMotion, 100);
  });
})();
