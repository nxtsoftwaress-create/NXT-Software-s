/* ============================================================
   NXT SOFTWARES — CORE
   utilities · scroll hub · reveal engine · cursor · nav
   ============================================================ */
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = window.matchMedia('(pointer: coarse)').matches;
const vh = () => window.innerHeight;

/* ---------- scroll hub: one rAF loop, many subscribers ---------- */
const ScrollHub = (() => {
  const fns = [];
  let lastY = -1;
  function loop() {
    const y = window.scrollY;
    if (y !== lastY) { lastY = y; for (const f of fns) f(y, vh()); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  return {
    add(fn) { fns.push(fn); fn(window.scrollY, vh()); },
  };
})();

/* ---------- reveal engine ---------- */
function initReveals() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  // hero reveals are choreographed by NXHeroEnter (plays on load)
  $$('[data-reveal]').forEach(el => { if (!el.closest('#hero')) io.observe(el); });
  // about media: revealed through a mask via the same engine
  const media = $('.about__media');
  if (media) io.observe(media);
}

/* ---------- custom cursor ---------- */
function initCursor() {
  if (TOUCH || REDUCED) return;
  const root = $('#cursor');
  if (!root) return;
  document.documentElement.classList.add('has-cursor');
  const dot = $('.cursor__dot', root);
  const ring = $('.cursor__ring', root);
  const HOVER_SEL = 'a, button, input, textarea, select, [role="tab"], [role="radio"], .slot, .tech';

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  let state = 'default';

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    root.classList.remove('cursor--hidden');
  });
  document.addEventListener('mouseleave', () => root.classList.add('cursor--hidden'));

  document.addEventListener('mouseover', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest(HOVER_SEL)) state = 'hover';
    else state = 'default';
    if (t.closest('input, textarea')) root.classList.add('cursor--hidden');
    else root.classList.remove('cursor--hidden');
  });

  (function raf() {
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);
    const s = state === 'hover' ? 1.7 : 1;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${s})`;
    requestAnimationFrame(raf);
  })();
}

/* ---------- nav ---------- */
function initNav() {
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#mobileMenu');
  if (!nav) return;

  ScrollHub.add(y => nav.classList.toggle('is-scrolled', y > 40));

  // active section highlight
  const links = $$('.nav__links a');
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const secIO = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const a = byId.get(e.target.id);
      if (!a) continue;
      links.forEach(l => l.classList.remove('is-active'));
      a.classList.add('is-active');
    }
  }, { rootMargin: '-38% 0px -55% 0px' });
  byId.forEach((a, id) => { const s = document.getElementById(id); if (s) secIO.observe(s); });

  function closeMenu() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    setTimeout(() => { menu.hidden = true; }, 460);
    document.body.classList.remove('no-scroll');
  }
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    if (open) {
      menu.hidden = false;
      void menu.offsetWidth; /* flush style so the transition runs even in throttled tabs */
      menu.classList.add('is-open');
      document.body.classList.add('no-scroll');
    } else closeMenu();
  });
  $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });
}
