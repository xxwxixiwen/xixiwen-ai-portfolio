'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

// Persistent across routes: owns smooth scrolling, curtain transitions and hover effects.
export default function MotionRuntime({ children }) {
  const pathname = usePathname();
  const [introRevision, setIntroRevision] = useState(0);
  useEffect(() => {
    const ready = () => setIntroRevision(value => value + 1);
    window.addEventListener('portfolio:intro-ready', ready);
    return () => window.removeEventListener('portfolio:intro-ready', ready);
  }, []);
  const router = useRouter();
  const curtain = useRef(null);
  const progress = useRef(null);
  const navigating = useRef(false);
  const smooth = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: .085, smoothWheel: true, anchors: { offset: -100 } });
      smooth.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const open = () => lenis.stop();
      const close = () => lenis.start();
      window.addEventListener('portfolio:overlay-open', open);
      window.addEventListener('portfolio:overlay-close', close);
      if (document.querySelector('.opening-video')) lenis.stop();
      return () => {
        window.removeEventListener('portfolio:overlay-open', open);
        window.removeEventListener('portfolio:overlay-close', close);
        gsap.ticker.remove(tick);
        lenis.destroy();
        smooth.current = null;
      };
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = [];
      // Split only headings; preserve the complete accessible text.
      document.querySelectorAll('main h1, main h2').forEach(heading => {
        if (heading.querySelector('.motion-word')) return;
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
          const fragment = document.createDocumentFragment();
          const chars = [...node.textContent];
          chars.forEach(char => {
            if (/\s/.test(char)) { fragment.appendChild(document.createTextNode(char)); return; }
            const span = document.createElement('span');
            span.className = 'motion-word'; span.textContent = char;
            fragment.appendChild(span); targets.push(span);
          });
          node.replaceWith(fragment);
        });
      });
      const context = gsap.context(() => {
        document.querySelectorAll('main > .section, main > .hero').forEach(section => {
          const text = section.querySelectorAll('h1 .motion-word, h2 .motion-word');
          const content = section.querySelectorAll('.section-label, .body-copy, .muted-copy, .hero-intro, .hero-actions, .profile-card, .capabilities article, .project-card, .contact-row, .background-grid article, .case-sections article');
          const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 84%', once: true } });
          if (text.length) timeline.fromTo(text, { yPercent: 110, rotateX: -65, opacity: 0, filter: 'blur(9px)' }, { yPercent: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)', stagger: .032, duration: 1.05, ease: 'power4.out' }, 0);
          if (content.length) timeline.fromTo(content, { y: 40, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', stagger: .075, duration: .9, ease: 'power3.out' }, .15);
        });
        // Match the original cinematic scroll-out: previous scene blurs and recedes.
        document.querySelectorAll('main > .hero, main > .section:not(.standalone):not(.contact-section)').forEach(section => {
          const content = section.querySelector('.hero-content, .about-grid, .capabilities, .project-grid');
          if (content) gsap.to(content, { y: -70, opacity: .08, filter: 'blur(9px)', ease: 'none', scrollTrigger: { trigger: section, start: 'bottom 45%', end: 'bottom top', scrub: .8 } });
        });
        gsap.fromTo('.site-nav', { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out' });
      });
      const update = () => {
        const total = document.documentElement.scrollHeight - innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
        document.querySelector('.site-nav')?.classList.toggle('is-scrolled', scrollY > 40);
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
        context.revert();
        window.removeEventListener('scroll', update);
        // Avoid React owning an unexpected subtree on later rerenders.
        document.querySelectorAll('.motion-word').forEach(span => span.replaceWith(document.createTextNode(span.textContent)));
      };
    });
    gsap.to(curtain.current, { scaleY: 0, transformOrigin: 'top', duration: .7, ease: 'power4.inOut', onComplete: () => { navigating.current = false; } });
    return () => media.revert();
  }, [pathname, introRevision]);

  useEffect(() => {
    const follow = event => {
      if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
      const card = event.target.closest('[data-tilt]');
      if (card) {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        gsap.to(card, { rotationY: x * 18, rotationX: -y * 14, transformPerspective: 900, duration: .45, ease: 'power3.out', overwrite: 'auto' });
        card.style.setProperty('--shine-x', `${(x + .5) * 100}%`);
        card.style.setProperty('--shine-y', `${(y + .5) * 100}%`);
      }
      const button = event.target.closest('.button, .nav-contact');
      if (button) {
        const box = button.getBoundingClientRect();
        gsap.to(button, { x: (event.clientX - box.left - box.width/2) * .2, y: (event.clientY - box.top - box.height/2) * .25, duration: .35, overwrite: 'auto' });
      }
    };
    const reset = event => {
      const element = event.target.closest('[data-tilt], .button, .nav-contact');
      if (element && !element.contains(event.relatedTarget)) gsap.to(element, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: .7, ease: 'elastic.out(1,.6)', overwrite: 'auto' });
    };
    const navigate = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download') || !anchor.href.startsWith(location.origin) || anchor.getAttribute('href').startsWith('#')) return;
      const url = new URL(anchor.href);
      if (url.pathname === location.pathname || url.hash || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      gsap.fromTo(curtain.current, { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: .42, ease: 'power4.inOut', onComplete: () => router.push(url.pathname + url.search) });
    };
    document.addEventListener('pointermove', follow, { passive: true });
    document.addEventListener('pointerout', reset);
    document.addEventListener('click', navigate, true);
    return () => {
      document.removeEventListener('pointermove', follow);
      document.removeEventListener('pointerout', reset);
      document.removeEventListener('click', navigate, true);
    };
  }, [router]);

  return <>{children}<div className="motion-grain" aria-hidden="true"/><div ref={progress} className="scroll-progress" aria-hidden="true"/><div ref={curtain} className="route-curtain" aria-hidden="true"><span>西西文<span className="orange">.</span></span><small>AI PRODUCT NOTES</small></div></>;
}
