/* ============================================================
   NXT SOFTWARES — CONSULTATION + BOOKING
   ============================================================ */
'use strict';

(function () {

  /* ---------- 17/18 · CONSULTATION (5 conversational steps) ---------- */
  const STEPS = [
    { q: 'WHAT DO YOU WANT TO BUILD?', opts: ['Website', 'App', 'AI System', 'Automation', 'Custom Software', 'Not sure'] },
    { q: 'TELL US ABOUT YOUR IDEA.', textarea: true, placeholder: 'Describe your idea in a few lines…' },
    { q: 'WHAT STAGE ARE YOU AT?', opts: ['Just an idea', 'Planning', 'Existing product', 'Need improvements', 'Need ongoing development'] },
    { q: 'WHEN WOULD YOU LIKE TO START?', opts: ['ASAP', 'This month', 'Next 1–3 months', 'Just exploring'] },
    { q: 'HOW CAN WE CONTACT YOU?', contact: true },
  ];
  const CAPS_MASTER = ['Product Strategy', 'UI/UX', 'Full-Stack Development', 'AI Integration', 'Deployment', 'Ongoing Support'];
  const CAPS_BY_NEED = {
    'Website': ['Full-Stack Development', 'UI/UX'],
    'App': ['Product Strategy', 'Full-Stack Development'],
    'AI System': ['AI Integration', 'Data Intelligence'],
    'Automation': ['Process Automation', 'Systems Integration'],
    'Custom Software': ['Product Strategy', 'Full-Stack Development'],
    'Not sure': ['Product Strategy', 'Technical Consulting'],
  };
  const CAPS_BY_STAGE = {
    'Just an idea': 'Product Strategy',
    'Planning': 'Product Strategy',
    'Existing product': 'System Upgrades',
    'Need improvements': 'System Upgrades',
    'Need ongoing development': 'Ongoing Support',
  };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  const flow = $('#consFlow');
  if (!flow) return;
  const optsEl = $('#consOpts');
  const qEl = $('#consQ');
  const next = $('#consNext');
  const back = $('#consBack');
  const stepEl = $('#consStep');
  const dots = $$('#consDots .cons__dot');
  const result = $('#consResult');
  const caps = $('#consCaps');
  const summary = $('#consSummary');
  const state = { answers: ['', '', '', ''], contact: { name: '', email: '' }, step: 0 };
  let swapTimer = 0;

  function render() {
    const s = STEPS[state.step];
    qEl.textContent = s.q;

    if (s.textarea) {
      next.textContent = 'Continue';
      next.disabled = false;
      optsEl.innerHTML = `<textarea id="consMsg" class="cons__textarea" rows="4" placeholder="${s.placeholder}"></textarea>`;
      const ta = $('#consMsg');
      ta.value = state.answers[1] || '';
      ta.addEventListener('input', () => { state.answers[1] = ta.value; });
    } else if (s.contact) {
      next.textContent = 'See My Result';
      next.disabled = false;
      optsEl.innerHTML = `
        <div class="cons__contact">
          <input id="consName" type="text" placeholder="Your name" autocomplete="name" value="${esc(state.contact.name)}">
          <input id="consEmail" type="email" placeholder="Email address" autocomplete="email" value="${esc(state.contact.email)}">
          <p class="cons__err" id="consErr"></p>
        </div>`;
      const n = $('#consName'), em = $('#consEmail');
      n.addEventListener('input', () => { state.contact.name = n.value; n.classList.remove('is-err'); $('#consErr').textContent = ''; });
      em.addEventListener('input', () => { state.contact.email = em.value; em.classList.remove('is-err'); $('#consErr').textContent = ''; });
    } else {
      next.textContent = 'Continue';
      next.disabled = !state.answers[state.step];
      optsEl.innerHTML = s.opts.map(o => {
        const sel = state.answers[state.step] === o;
        return `<button type="button" class="cons__opt${sel ? ' is-sel' : ''}" role="radio" aria-checked="${sel}">${o}</button>`;
      }).join('');
      $$('button', optsEl).forEach(b => b.addEventListener('click', () => {
        state.answers[state.step] = b.textContent;
        $$('button', optsEl).forEach(x => { x.classList.remove('is-sel'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('is-sel');
        b.setAttribute('aria-checked', 'true');
        next.disabled = false;
        clearTimeout(swapTimer);
        swapTimer = setTimeout(() => { state.step < 4 ? go(state.step + 1) : finish(); }, 420);
      }));
    }
    back.hidden = state.step === 0;
    stepEl.textContent = `${state.step + 1} / 5`;
    dots.forEach((d, i) => d.classList.toggle('is-on', i <= state.step));
  }

  function go(i) {
    flow.classList.add('is-swap');
    setTimeout(() => {
      state.step = i;
      render();
      flow.classList.remove('is-swap');
    }, 260);
  }

  function finish() {
    const n = $('#consName'), em = $('#consEmail'), err = $('#consErr');
    const name = (n && n.value.trim()) || '';
    const email = (em && em.value.trim()) || '';
    let ok = true;
    if (!name) { n.classList.add('is-err'); ok = false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { em.classList.add('is-err'); ok = false; }
    if (!ok) { err.textContent = 'Please add your name and a valid email so we can reach you.'; return; }

    const set = new Set(CAPS_BY_NEED[state.answers[0]] || ['Product Strategy']);
    if (CAPS_BY_STAGE[state.answers[2]]) set.add(CAPS_BY_STAGE[state.answers[2]]);
    set.add('Deployment');
    const ordered = CAPS_MASTER.filter(m => set.has(m));
    const rest = [...set].filter(x => !ordered.includes(x));
    caps.innerHTML = [...ordered, ...rest].slice(0, 6).map(c => `<li>${c}</li>`).join('');
    summary.textContent = [state.answers[0], state.answers[2], state.answers[3]].filter(Boolean).join('  ·  ');
    clearTimeout(swapTimer);
    flow.hidden = true;
    $('#consDots').hidden = true;
    result.hidden = false;
  }

  next.addEventListener('click', () => { state.step < 4 ? go(state.step + 1) : finish(); });
  back.addEventListener('click', () => go(Math.max(0, state.step - 1)));
  $('#consRestart').addEventListener('click', () => {
    state.answers = ['', '', '', ''];
    state.contact = { name: '', email: '' };
    state.step = 0;
    result.hidden = true;
    $('#consDots').hidden = false;
    flow.hidden = false;
    render();
  });
  render();

  /* ---------- 19 · BOOKING — dates + times + details ---------- */
  const slots = $$('#bookSlots .slot');
  const form = $('#bookForm');
  const err = $('#bookErr');
  const done = $('#bookDone');
  const bwrap = $('.book__wrap');
  const datesEl = $('#bookDates');
  let slot = '', bookDate = '';

  (function buildDates() {
    if (!datesEl) return;
    const now = new Date();
    let html = '';
    for (let i = 1; i <= 6; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      const wd = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const md = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() + ' ' + d.getDate();
      html += `<button type="button" class="date" data-label="${wd} · ${md}"><b>${wd}</b><span>${md}</span></button>`;
    }
    datesEl.innerHTML = html;
    $$('.date', datesEl).forEach(b => b.addEventListener('click', () => {
      bookDate = b.dataset.label;
      $$('.date', datesEl).forEach(x => x.classList.toggle('is-sel', x === b));
      err.hidden = true;
    }));
  })();

  slots.forEach(s => s.addEventListener('click', () => {
    slot = s.dataset.time;
    slots.forEach(x => x.classList.toggle('is-sel', x === s));
    err.hidden = true;
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#bName').value.trim();
    const email = $('#bEmail').value.trim();
    if (!bookDate) { err.textContent = 'Please choose a date.'; err.hidden = false; return; }
    if (!slot) { err.textContent = 'Please choose a time slot.'; err.hidden = false; return; }
    if (!name) { err.textContent = 'Please tell us your name.'; err.hidden = false; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; err.hidden = false; return; }
    err.hidden = true;
    $('#bookSummary').textContent = `${bookDate} · ${slot} · we'll confirm at ${email}`;
    bwrap.hidden = true;
    done.hidden = false;
    done.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
  });
})();
