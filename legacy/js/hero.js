/* ============================================================
   NXT SOFTWARES — HERO
   orbital object · tilt parallax · floating cards · scroll exit
   ============================================================ */
'use strict';

/* hero entrance — self-starts on load (no welcome gate anymore) */
window.NXHeroEnter = function () {
  /* heading: word-by-word blur reveal (HeroSection6 text variant) */
  const h = $('.hero__title');
  if (h && !h.dataset.split) {
    h.dataset.split = '1';
    let w = 0;
    const lines = $$('.hero__line', h);
    lines.forEach(line => {
      const words = line.textContent.trim().split(/\s+/);
      line.innerHTML = words.map(word => `<span class="hw" style="--w:${w++}"><span class="hw-in">${word}</span></span>`).join(' ');
    });
    if (!REDUCED) {
      h.classList.add('is-armed');
      void h.offsetWidth; /* commit the hidden state so the transition runs reliably */
      h.classList.add('is-live');
    }
  }
  $$('#hero [data-reveal]').forEach(el => el.classList.add('is-in'));
};

(function () {
  const hero = $('#hero');
  const inner = $('#heroInner');
  const visual = $('#heroVisual');
  if (!hero) return;

  /* play the entrance now — unless the welcome gate owns it */
  const gate = $('#welcome');
  if (gate && !gate.dataset.bound) {
    /* safety: if welcome.js never binds, self-enter after 3.5s */
    setTimeout(() => {
      const g = $('#welcome');
      if (g && !g.dataset.bound) {
        g.remove();
        document.body.classList.remove('welcome-hold');
        NXHeroEnter();
      }
    }, 3500);
  } else {
    NXHeroEnter();
  }

  /* mouse → tilt + card parallax */
  if (!TOUCH) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.setProperty('--mx', x.toFixed(3));
      visual.style.setProperty('--my', y.toFixed(3));
      visual.style.setProperty('--rx', (x * 6).toFixed(2) + 'deg');
      visual.style.setProperty('--ry', (y * -6).toFixed(2) + 'deg');
    });
  }

  /* scroll: text drifts up, object expands toward the background */
  if (!REDUCED) {
    const hint = $('.hero__scroll');
    ScrollHub.add((y, h) => {
      if (y > h * 1.25) return;
      inner.style.transform = `translateY(${(y * -0.22).toFixed(1)}px)`;
      inner.style.opacity = clamp(1 - y / (h * 0.85), 0, 1).toFixed(3);
      visual.style.transform = `scale(${(1 + clamp(y / h, 0, 1) * 0.22).toFixed(3)})`;
      if (hint) hint.style.opacity = clamp(1 - y / (h * 0.3), 0, 1).toFixed(3);
    });
  }
})();
