/* ============================================================
   NXT SOFTWARES — WELCOME GATE (AnimatedText port)
   letter-by-letter spring reveal + gradient underline draw
   ============================================================ */
'use strict';

(function () {
  const gate = $('#welcome');
  const title = $('#welcomeTitle');
  const enter = $('#enterBtn');
  if (!gate || !title || gate.dataset.bound) return;
  gate.dataset.bound = '1';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- split into letters (AnimatedText: Array.from(text)) ---- */
  const text = title.textContent;
  title.textContent = '';
  const letters = Array.from(text).map((ch, i) => {
    const s = document.createElement('span');
    s.className = 'wl';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    if (i >= 11) s.classList.add('wl--accent'); /* the "NXT" part of "Welcome to NXT" */
    s.style.setProperty('--i', i);
    title.appendChild(s);
    return s;
  });

  const LETTER_STAGGER_MS = 40; /* AnimatedText stagger */

  function reveal() {
    if (title.dataset.revealed) return;
    title.dataset.revealed = '1';
    if (REDUCED) {
      letters.forEach(s => s.classList.add('wl-in'));
      gate.classList.add('wl-done');
      return;
    }
    void title.offsetWidth; /* flush hidden state so the transition runs */
    letters.forEach((s, i) => setTimeout(() => {
      s.classList.add('wl-in');
      if (i === letters.length - 1) setTimeout(() => gate.classList.add('wl-done'), 120);
    }, i * LETTER_STAGGER_MS));
  }

  /* unhide + play (script is deferred, DOM is ready) */
  gate.hidden = false;
  reveal();

  /* ---- underline draws after the last letter (lineVariants) ---- */
  /* handled in CSS via .wl-done on the gate */

  /* ---- enter: popup shrinks → site expands → hero plays ---- */
  function enterSite() {
    if (document.body.classList.contains('has-entered')) return;
    document.body.classList.add('has-entered');
    document.body.classList.remove('welcome-hold');
    gate.classList.add('is-leaving');
    if (window.NXHeroEnter) NXHeroEnter();
    setTimeout(() => gate.remove(), 700);
  }
  enter.addEventListener('click', enterSite);
  gate.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.defaultPrevented) enterSite(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !document.body.classList.contains('has-entered')) enterSite(); });
  /* a scroll attempt also opens the site ("just exploring") */
  addEventListener('wheel', onWheelish, { passive: true });
  addEventListener('touchmove', onWheelish, { passive: true });
  let first = true;
  function onWheelish() {
    if (!first) return;
    first = false;
    if (!document.body.classList.contains('has-entered')) enterSite();
  }
})();
