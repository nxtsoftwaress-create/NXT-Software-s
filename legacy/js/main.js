/* ============================================================
   NXT SOFTWARES — BOOT
   ============================================================ */
'use strict';

(function () {
  initReveals();
  initCursor();
  initNav();

  /* ---------- cinematic footer: curtain reveal ---------- */
  const curtain = $('#footerCurtain');
  if (curtain) {
    new IntersectionObserver((es, io) => {
      for (const e of es) {
        if (e.isIntersecting) { curtain.classList.add('is-in'); io.disconnect(); }
      }
    }, { threshold: 0.18 }).observe(curtain);
  }

  /* ---------- magnetic glass pills ---------- */
  if (!TOUCH && !REDUCED) {
    $$('.pill').forEach(el => {
      let raf = 0;
      el.addEventListener('mousemove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          el.style.transform =
            `translate(${(dx * 0.25).toFixed(1)}px,${(dy * 0.25).toFixed(1)}px) ` +
            `rotateX(${(-dy * 0.12).toFixed(2)}deg) rotateY(${(dx * 0.12).toFixed(2)}deg) scale(1.05)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 900);
      });
    });
  }

  /* ---------- back to top ---------- */
  const backTop = $('#backTop');
  if (backTop) backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  });
})();
