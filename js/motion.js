(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.remove('motion-ready');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'max', scrub: true } });
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const small = () => window.innerWidth <= 700;
    const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
    intro.fromTo('.hero-top > *', { y: 12 }, { y: 0, duration: .8, stagger: .12 })
      .fromTo('.hero h1 > span', { y: () => small() ? 20 : 36 }, { y: 0, duration: 1.05, stagger: .16 }, .15)
      .fromTo('.hero-skills > span', { y: 9 }, { y: 0, duration: .65, stagger: .055 }, .55)
      .fromTo('.orb-scene', { scale: .94 }, { scale: 1, duration: 1.1 }, .25)
      .fromTo('.hero-bottom > *', { y: 15 }, { y: 0, duration: .85, stagger: .12 }, .7);
    const sectionTransition = gsap.timeline({
      scrollTrigger: {
        trigger: '.ticker',
        start: () => {
          const tickerTop = document.querySelector('.ticker').getBoundingClientRect().top + window.scrollY;
          if (small()) return Math.max(1, tickerTop - window.innerHeight * .96);
          // Keep the hero fully visible through the first scroll on tall screens.
          return Math.max(window.innerHeight * .2, tickerTop - window.innerHeight * .6);
        },
        end: () => small() ? 'bottom 38%' : `+=${Math.max(280, window.innerHeight * .45)}`,
        scrub: .6,
        invalidateOnRefresh: true
      }
    });
    sectionTransition
      .fromTo('.hero-top, .hero-bottom', { y: 0, opacity: 1 }, {
        y: () => small() ? -8 : -18,
        opacity: .35,
        ease: 'none',
        duration: 1
      }, 0)
      .fromTo('.hero-title', { y: 0, scale: 1, opacity: 1 }, {
        y: () => small() ? -12 : -28,
        scale: () => small() ? .99 : .97,
        opacity: .48,
        transformOrigin: '50% 100%',
        ease: 'none',
        duration: 1
      }, 0)
      .fromTo('.projects .section-heading > div', {
        x: () => small() ? -24 : -70,
        y: () => small() ? 18 : 28,
        opacity: 0
      }, {
        x: 0,
        y: 0,
        opacity: 1,
        ease: 'power1.out',
        duration: .8
      }, .18)
      .fromTo('.projects .section-heading > p', {
        x: () => small() ? 24 : 70,
        y: () => small() ? 18 : 28,
        opacity: 0
      }, {
        x: 0,
        y: 0,
        opacity: 1,
        ease: 'power1.out',
        duration: .8
      }, .18);
    const entrances = [];
    const reveal = (container, targets, options = {}, start = 'top 92%') => {
      const { x = 0, y = () => small() ? 16 : 28, scale = 1, ...timing } = options;
      const animation = gsap.fromTo(targets, { x, y, scale, opacity: 0 }, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        stagger: .12,
        ease: 'power1.out',
        ...timing,
        scrollTrigger: {
          trigger: container,
          start,
          once: true,
          invalidateOnRefresh: true
        }
      });
      entrances.push({ container, animation });
    };
    document.querySelectorAll('.section-heading').forEach(el => {
      if (el.closest('.projects')) return;
      reveal(el, el.children, { stagger: .14 });
    });
    const projects = Array.from(document.querySelectorAll('.project'));
    projects.forEach((project, index) => {
      const visual = project.querySelector('.project-visual');
      const details = Array.from(project.children).filter(child => child !== visual);
      const fromLeft = index % 2 === 0;
      reveal(project, visual, {
        x: () => small() ? 0 : fromLeft ? -22 : 22,
        y: () => small() ? 18 : 26,
        scale: .98,
        duration: 1.45
      }, 'top 90%');
      reveal(project, details, {
        y: () => small() ? 12 : 18,
        duration: 1.15,
        stagger: .11,
        delay: .18
      }, 'top 90%');
    });
    media.add('(min-width: 701px)', () => {
      const visuals = projects.map(project => project.querySelector('.project-visual'));
      for (let index = 0; index < projects.length; index += 2) {
        const pair = visuals.slice(index, index + 2);
        ScrollTrigger.create({
          trigger: pair[0],
          start: 'top 50%',
          end: 'bottom 50%',
          toggleClass: { targets: pair, className: 'is-scroll-active' }
        });
      }
      return () => visuals.forEach(visual => visual.classList.remove('is-scroll-active'));
    });
    media.add('(max-width: 700px)', () => {
      projects.forEach(project => {
        const visual = project.querySelector('.project-visual');
        ScrollTrigger.create({
          trigger: visual,
          start: 'top 50%',
          end: 'bottom 50%',
          toggleClass: { targets: visual, className: 'is-scroll-active' }
        });
      });
      return () => projects.forEach(project => project.querySelector('.project-visual').classList.remove('is-scroll-active'));
    });
    reveal(document.querySelector('.about-art'), '.about-art', {
      x: () => small() ? 0 : -28,
      y: () => small() ? 18 : 0,
      scale: .985,
      duration: 1.45
    });
    reveal(document.querySelector('.about-copy'), '.about-copy > *', {
      x: () => small() ? 0 : 22,
      y: () => small() ? 16 : 0,
      stagger: .13
    });
    media.add('(min-width: 701px)', () => {
      reveal(document.querySelector('.process-grid'), '.process-grid > div > *', {
        y: 23,
        stagger: .22,
        duration: 1
      }, 'top 85%');
    });
    media.add('(max-width: 700px)', () => {
      document.querySelectorAll('.process-grid > div').forEach(step => {
        reveal(step, step.children, { y: 15, stagger: .16, duration: 1 });
      });
    });
    reveal(document.querySelector('.contact-top'), '.contact-top > *', { stagger: .13 });
    reveal(document.querySelector('.contact h2'), '.contact h2', { y: () => small() ? 20 : 38, duration: 1.45 });
    reveal(document.querySelector('.contact-bottom'), '.contact-bottom > *', { stagger: .13 });
    reveal(document.querySelector('.footer'), '.footer > *', { y: 12, stagger: .1 });

    gsap.to('.orb-scene', {
      y: () => small() ? 14 : 48,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.8, invalidateOnRefresh: true }
    });
    gsap.to('.about-art .monogram', {
      y: () => small() ? -12 : -34,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.8, invalidateOnRefresh: true }
    });
    gsap.to('.about-art .code-card', {
      y: () => small() ? 8 : 22,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.8, invalidateOnRefresh: true }
    });
    const codeCard = document.querySelector('.about-art .code-card');
    const codeWalker = document.createTreeWalker(codeCard, NodeFilter.SHOW_TEXT);
    const codeParts = [];
    while (codeWalker.nextNode()) {
      codeParts.push({ node: codeWalker.currentNode, characters: Array.from(codeWalker.currentNode.textContent) });
    }
    const codeLength = codeParts.reduce((length, part) => length + part.characters.length, 0);
    codeCard.style.minHeight = `${codeCard.offsetHeight}px`;
    let visibleCharacters = -1;
    const writeCode = progress => {
      const count = Math.round(progress * codeLength);
      if (count === visibleCharacters) return;
      visibleCharacters = count;
      let remaining = count;
      codeParts.forEach(part => {
        part.node.textContent = part.characters.slice(0, Math.max(0, remaining)).join('');
        remaining -= part.characters.length;
      });
    };
    const codeProgress = { value: 0 };
    const codeAnimation = gsap.to(codeProgress, {
      value: 1,
      ease: 'none',
      onUpdate: () => writeCode(codeProgress.value),
      scrollTrigger: {
        trigger: codeCard,
        start: 'top 115%',
        end: 'bottom 55%',
        scrub: .35,
        invalidateOnRefresh: true
      }
    });
    writeCode(codeProgress.value);
    const processStar = document.querySelector('.process-star');
    const flyingStar = processStar.cloneNode(true);
    flyingStar.style.cssText = 'position:absolute;left:0;top:0;display:block;width:max-content;margin:0;opacity:1;visibility:visible;color:var(--pink);pointer-events:none;z-index:30;will-change:transform';
    document.body.appendChild(flyingStar);
    processStar.style.visibility = 'hidden';
    const aboutSection = document.querySelector('.about');
    const contactTarget = document.querySelector('.contact-star-target');
    const rootStyles = getComputedStyle(document.documentElement);
    const starPink = rootStyles.getPropertyValue('--pink').trim();
    const starDark = rootStyles.getPropertyValue('--ink').trim();
    let starStart;
    let starEnd;
    let starContactEnd;
    const measureStar = () => {
      flyingStar.style.fontSize = getComputedStyle(processStar).fontSize;
      const art = document.querySelector('.about-art').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(processStar);
      const target = range.getBoundingClientRect();
      starStart = {
        x: art.right + window.scrollX - flyingStar.offsetWidth * (small() ? 1.5 : .5),
        y: art.top + window.scrollY - flyingStar.offsetHeight / 2
      };
      starEnd = {
        x: target.left + window.scrollX + (target.width - flyingStar.offsetWidth) / 2,
        y: target.top + window.scrollY + (target.height - flyingStar.offsetHeight) / 2 - (Number(gsap.getProperty(processStar, 'y')) || 0)
      };
      const contact = contactTarget.getBoundingClientRect();
      starContactEnd = {
        x: contact.left + window.scrollX - flyingStar.offsetWidth / 2,
        y: contact.top + window.scrollY - flyingStar.offsetHeight / 2
      };
    };
    const moveStar = progress => {
      const x = starStart.x + (starEnd.x - starStart.x) * progress;
      const y = starStart.y + (starEnd.y - starStart.y) * progress;
      flyingStar.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${120 * progress - 25}deg)`;
    };
    const starProgress = { value: 0 };
    measureStar();
    const starAnimation = gsap.to(starProgress, {
      value: 1,
      ease: 'none',
      onUpdate: () => moveStar(starProgress.value),
      scrollTrigger: {
        trigger: codeCard,
        start: 'top 78%',
        endTrigger: '.process',
        end: 'top 20%',
        scrub: .6,
        invalidateOnRefresh: true,
        onRefresh: () => measureStar()
      }
    });
    moveStar(starProgress.value);
    const contactProgress = { value: 0 };
    const moveStarToContact = progress => {
      if (progress === 0 && starProgress.value < .999) return;
      const x = starEnd.x + (starContactEnd.x - starEnd.x) * progress;
      const y = starEnd.y + (starContactEnd.y - starEnd.y) * progress;
      flyingStar.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${120 + 100 * progress}deg)`;
      flyingStar.style.color = gsap.utils.interpolate(starPink, starDark, progress);
    };
    const contactStarAnimation = gsap.to(contactProgress, {
      value: 1,
      ease: 'none',
      onUpdate: () => moveStarToContact(contactProgress.value),
      scrollTrigger: {
        trigger: processStar,
        start: 'top 18%',
        endTrigger: '.contact',
        end: 'top 25%',
        scrub: .65,
        invalidateOnRefresh: true,
        onRefresh: () => measureStar()
      }
    });

    const revealFocused = event => {
      entrances.forEach(({ container, animation }) => {
        if (container.contains(event.target)) animation.progress(1);
      });
    };
    document.addEventListener('focusin', revealFocused);
    const float = gsap.to('.orb', { y: -13, rotation: -9, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    const orbit = gsap.to('.orbit-one', { rotation: 325, duration: 28, repeat: -1, ease: 'none' });
    ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: self => { float.paused(!self.isActive); orbit.paused(!self.isActive); } });
    return () => {
      document.removeEventListener('focusin', revealFocused);
      codeParts.forEach(part => { part.node.textContent = part.characters.join(''); });
      codeCard.style.minHeight = '';
      sectionTransition.scrollTrigger?.kill();
      sectionTransition.kill();
      codeAnimation.kill();
      starAnimation.kill();
      contactStarAnimation.kill();
      flyingStar.remove();
      processStar.style.visibility = '';
      float.kill(); orbit.kill();
    };
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];
    document.querySelectorAll('.magnetic').forEach(el => {
      const move = event => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (event.clientX - r.left - r.width / 2) * .12, y: (event.clientY - r.top - r.height / 2) * .15, duration: .35 }); };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' });
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { x: 0, y: 0 }); });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  });
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
