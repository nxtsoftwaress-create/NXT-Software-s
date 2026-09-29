/* ============================================================
   NXT SOFTWARES — SECTIONS
   what-we-build · philosophy · solutions · industries
   process · technology · ai demo · about · why · journey · final
   ============================================================ */
'use strict';

(function () {

  /* ---------- 05 · WHAT WE BUILD (6 services) ---------- */
  const WWB = [
    { title: 'DIGITAL PRODUCTS', desc: 'From idea → architecture → deployment. We take products end to end.', chips: ['UI', 'Backend', 'Database', 'Cloud', 'Analytics'] },
    { title: 'AI SOLUTIONS', desc: 'Agents, copilots and automation built around your data — not generic wrappers.', chips: ['LLMs', 'RAG', 'Agents', 'Pipelines', 'Evaluation'] },
    { title: 'WEB APPLICATIONS', desc: 'Fast, scalable web apps that feel effortless to use.', chips: ['React / Next.js', 'APIs', 'CMS', 'SEO', 'Performance'] },
    { title: 'MOBILE APPLICATIONS', desc: 'Native-quality apps for iOS and Android your customers carry everywhere.', chips: ['iOS', 'Android', 'Cross-platform', 'Offline-first', 'Push'] },
    { title: 'AUTOMATION', desc: 'Manual process → AI / automation → integrated system → less repetitive work.', chips: ['Workflows', 'Integrations', 'Dashboards', 'RPA', 'Reports'] },
    { title: 'CONSULTING', desc: 'Architecture, strategy and technical direction — before a single line of code.', chips: ['Architecture', 'Tech selection', 'AI strategy', 'Product planning', 'Audit'] },
  ];

  function initWWB() {
    const panel = $('#wwbPanel');
    const items = $$('.wwb__item');
    if (!panel || !items.length) return;
    const list = $('.wwb__list');
    const title = $('#wwbTitle');
    const desc = $('#wwbDesc');
    const chips = $('#wwbChips');
    let idx = 0, timer = 0;

    function set(i) {
      idx = i;
      items.forEach((b, j) => {
        b.classList.toggle('is-active', j === i);
        b.setAttribute('aria-selected', String(j === i));
      });
      panel.dataset.v = String(i);
      const d = WWB[i];
      title.textContent = d.title;
      desc.textContent = d.desc;
      chips.innerHTML = d.chips.map(c => `<li>${c}</li>`).join('');
    }
    function stop() { clearInterval(timer); }
    function auto() { stop(); if (!REDUCED) timer = setInterval(() => set((idx + 1) % items.length), 4600); }

    items.forEach(b => {
      b.addEventListener('click', () => { set(+b.dataset.i); auto(); });
      b.addEventListener('mouseenter', () => set(+b.dataset.i));
    });
    list.addEventListener('mouseenter', stop);
    list.addEventListener('mouseleave', auto);
    panel.addEventListener('mouseenter', stop);
    panel.addEventListener('mouseleave', auto);
    set(0);
    auto();
  }

  /* ---------- 06 · PHILOSOPHY + NXT finale ---------- */
  function initPhilosophy() {
    const sec = $('#philosophy');
    if (!sec) return;
    new IntersectionObserver((es, io) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        sec.classList.add('is-run');
        io.disconnect();
        setTimeout(() => sec.classList.add('is-fin'), REDUCED ? 400 : 4200);
      }
    }, { threshold: 0.35 }).observe(sec);
  }

  /* ---------- 07 · SOLUTIONS ---------- */
  const SOL = {
    website:  { kicker: 'WEBSITE', title: 'A website that works as hard as you do.', flow: ['Strategy', 'Design', 'Build', 'Launch & SEO'], note: 'Designed around your customers and built for speed, search and conversions from day one.' },
    app:      { kicker: 'APP', title: 'Your product, in every pocket.', flow: ['Concept', 'Prototype', 'Build', 'Store release'], note: 'iOS and Android apps with native feel — offline-ready, push-enabled and store-approved.' },
    ai:       { kicker: 'AI SYSTEM', title: 'AI that understands your business.', flow: ['Problem', 'AI System', 'Integration', 'Business result'], note: 'We start from the business problem, design the AI system around it, integrate it with your tools — and measure the result.' },
    automate: { kicker: 'WORKFLOW AUTOMATION', title: 'Less repetitive work, more real progress.', flow: ['Manual process', 'AI / Automation', 'Integrated system', 'Less repetitive work'], note: 'We map how your business actually operates, then connect the tools you already use into one automated system.' },
    upgrade:  { kicker: 'SYSTEM UPGRADE', title: 'Modern foundations, zero downtime.', flow: ['Audit', 'Refactor', 'Migration', 'Modern stack'], note: 'We assess what you have, keep what works, and rebuild what holds you back — while the business keeps running.' },
    idea:     { kicker: 'FROM IDEA TO PRODUCT', title: 'Bring the idea. We build the rest.', flow: ['Validation', 'MVP build', 'Feedback loop', 'Market-ready release'], note: 'We pressure-test the concept, ship an MVP fast, and iterate with real users until it earns its place in the market.' },
  };

  function initSolutions() {
    const opts = $$('.sol__opt');
    const panel = $('#solPanel');
    if (!panel || !opts.length) return;
    const K = $('#solKicker'), T = $('#solTitle'), F = $('#solFlow'), N = $('#solNote');

    function render(key) {
      const d = SOL[key];
      if (!d) return;
      K.textContent = d.kicker;
      T.textContent = d.title;
      N.textContent = d.note;
      F.innerHTML = d.flow.map((s, i) => `<li><i>0${i + 1}</i>${s}</li>`).join('');
      F.classList.remove('is-anim');
      void F.offsetWidth; /* restart the step-in animation */
      F.classList.add('is-anim');
    }
    function apply(key) {
      panel.classList.add('is-swap');
      setTimeout(() => { render(key); panel.classList.remove('is-swap'); }, 240);
    }

    opts.forEach(o => o.addEventListener('click', () => {
      if (o.classList.contains('is-active')) return;
      opts.forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-checked', 'false'); });
      o.classList.add('is-active');
      o.setAttribute('aria-checked', 'true');
      apply(o.dataset.s);
    }));

    render('ai'); /* default view, no swap */
  }

  /* ---------- 08 · INDUSTRIES — horizontal slide ---------- */
  function initIndustries() {
    const sec = $('#industries');
    const track = $('#indTrack');
    const panels = $$('.ind__panel');
    const dotsWrap = $('#indDots');
    if (!track || !panels.length) return;

    track.style.height = (panels.length * 90) + 'vh';
    panels.forEach(() => dotsWrap.insertAdjacentHTML('beforeend', '<span></span>'));
    const dots = $$('span', dotsWrap);
    let lastX = -1;

    ScrollHub.add(() => {
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - vh();
      const x = clamp(-r.top / total, 0, 1) * (panels.length - 1); /* 0 .. N-1 */
      if (Math.abs(x - lastX) < 0.001) return;
      lastX = x;
      panels.forEach((pn, i) => {
        const d = i - x;
        pn.style.transform = `translateX(${(d * 100).toFixed(2)}%)`;
        pn.style.opacity = clamp(1 - Math.abs(d) * 1.15, 0, 1).toFixed(3);
        pn.style.visibility = Math.abs(d) > 1.5 ? 'hidden' : 'visible';
        pn.style.pointerEvents = Math.abs(d) < 0.5 ? 'auto' : 'none';
      });
      const active = Math.round(x);
      dots.forEach((dot, j) => dot.classList.toggle('is-on', j === active));
    });
  }  /* ---------- 11 · PROCESS — line activates each stage ---------- */
  function initProcess() {
    const tl = $('#timeline');
    const fill = $('#timelineFill');
    const stages = $$('.stage');
    if (!tl) return;
    stages.forEach(s => {
      const head = $('.stage__head', s);
      head.addEventListener('click', () => {
        const open = s.classList.toggle('is-open');
        head.setAttribute('aria-expanded', String(open));
      });
    });
    if (!REDUCED) {
      ScrollHub.add(() => {
        const r = tl.getBoundingClientRect();
        const p = clamp((vh() * 0.72 - r.top) / r.height, 0, 1);
        fill.style.height = (p * 100).toFixed(1) + '%';
        const fillY = r.top + p * r.height;
        stages.forEach(s => {
          const sr = $('.stage__head', s).getBoundingClientRect();
          s.classList.toggle('is-lit', sr.top + sr.height * 0.5 <= fillY);
        });
      });
    } else {
      fill.style.height = '100%';
      stages.forEach(s => s.classList.add('is-lit'));
    }
  }

  /* ---------- 12 · TECHNOLOGY — repel + brighten near cursor ---------- */
  function initTech() {
    const cloud = $('#techCloud');
    const chips = $$('.tech');
    chips.forEach(t => {
      t.tabIndex = 0;
      t.setAttribute('aria-label', `${t.textContent} — ${t.dataset.tip}`);
    });
    if (!cloud || TOUCH || REDUCED) return;
    let raf = 0, mx = -1e4, my = -1e4;

    cloud.addEventListener('mousemove', e => {
      const cr = cloud.getBoundingClientRect();
      mx = e.clientX - cr.left;
      my = e.clientY - cr.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        chips.forEach(c => {
          const r = c.getBoundingClientRect();
          if (!r.width) return;
          const cx = r.left + r.width / 2 - cr.left;
          const cy = r.top + r.height / 2 - cr.top;
          const dx = cx - mx, dy = cy - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0.01) {
            const f = (130 - dist) / 130 * 26;
            c.style.setProperty('--tx', (dx / dist * f).toFixed(1) + 'px');
            c.style.setProperty('--ty', (dy / dist * f).toFixed(1) + 'px');
            c.classList.add('is-near');
          } else {
            c.style.setProperty('--tx', '0px');
            c.style.setProperty('--ty', '0px');
            c.classList.remove('is-near');
          }
        });
      });
    });
    cloud.addEventListener('mouseleave', () => {
      chips.forEach(c => {
        c.style.setProperty('--tx', '0px');
        c.style.setProperty('--ty', '0px');
        c.classList.remove('is-near');
      });
    });
  }

  /* ---------- 13 · AI DEMO ---------- */
  function initAI() {
    const chat = $('#chatWindow');
    const pipe = $('#aiPipeline');
    const replay = $('#aiReplay');
    if (!chat || !pipe) return;
    const nodes = $$('.pipe__node', pipe);
    const links = $$('.pipe__link', pipe);
    const SCRIPT = [
      { who: 'user', text: 'I want to automate customer support.' },
      { who: 'ai', text: "Let's design the workflow." },
      { who: 'ai', text: 'The agent answers from your knowledge base, logs context to your CRM, and escalates edge cases to your team.' },
    ];
    let timers = [];

    function clear() {
      timers.forEach(clearTimeout);
      timers = [];
      chat.innerHTML = '';
      nodes.forEach(n => n.classList.remove('is-on'));
      links.forEach(l => l.classList.remove('is-on'));
    }
    function wait(ms) { return new Promise(r => timers.push(setTimeout(r, ms))); }
    function typeMsg(who, text) {
      const el = document.createElement('div');
      el.className = `chat__msg chat__msg--${who}`;
      el.innerHTML = `<span>${who === 'user' ? 'USER' : 'NXT AI'}</span>`;
      const p = document.createElement('p');
      el.appendChild(p);
      chat.appendChild(el);
      if (REDUCED) { p.textContent = text; return Promise.resolve(); }
      return new Promise(res => {
        let i = 0;
        (function step() {
          p.textContent = text.slice(0, ++i);
          if (i < text.length) timers.push(setTimeout(step, 15));
          else res();
        })();
      });
    }
    function typingDots(ms) {
      if (REDUCED) return wait(ms);
      const el = document.createElement('div');
      el.className = 'chat__typing';
      el.innerHTML = '<i></i><i></i><i></i>';
      chat.appendChild(el);
      return wait(ms).then(() => { el.remove(); });
    }
    async function play() {
      clear();
      if (replay) replay.disabled = true;
      for (const m of SCRIPT) {
        if (m.who === 'ai') await typingDots(750);
        await typeMsg(m.who, m.text);
        await wait(350);
      }
      for (let i = 0; i < nodes.length; i++) {
        await wait(430);
        nodes[i].classList.add('is-on');
        if (links[i]) links[i].classList.add('is-on');
      }
      if (replay) replay.disabled = false;
    }
    if (replay) replay.addEventListener('click', play);
    new IntersectionObserver((es, io) => {
      for (const e of es) if (e.isIntersecting) { play(); io.disconnect(); }
    }, { threshold: 0.3 }).observe(chat);
  }

  /* ---------- 13 · WHY NXT ---------- */
  function initWhy() {
    const rows = $$('#whyRows .why__row');
    if (!rows.length) return;
    const io = new IntersectionObserver(es => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        const i = +e.target.dataset.i;
        setTimeout(() => e.target.classList.add('is-on'), i * 140);
        io.unobserve(e.target);
      }
    }, { threshold: 0.4 });
    rows.forEach(r => io.observe(r));
  }

  /* ---------- 20 · FINAL CTA ---------- */
  function initFinal() {
    const sec = $('#final');
    const glow = $('#finalGlow');
    if (!sec) return;
    if (window.NXTParticles) {
      NXTParticles.create($('#finalCanvas'), { count: 42, speed: 0.12, drift: -0.16 });
    }
    if (!TOUCH && glow) {
      let tx = innerWidth / 2, ty = innerHeight / 2, gx = tx, gy = ty;
      sec.addEventListener('mousemove', e => {
        const r = sec.getBoundingClientRect();
        tx = e.clientX - r.left;
        ty = e.clientY - r.top;
      });
      (function loop() {
        gx = lerp(gx, tx, 0.07);
        gy = lerp(gy, ty, 0.07);
        glow.style.left = gx.toFixed(1) + 'px';
        glow.style.top = gy.toFixed(1) + 'px';
        requestAnimationFrame(loop);
      })();
    } else if (glow) glow.style.display = 'none';
  }

  /* ---------- boot ---------- */
  initWWB();
  initPhilosophy();
  initSolutions();
  initIndustries();
  initProcess();
  initTech();
  initAI();
  initWhy();
  initFinal();
})();
