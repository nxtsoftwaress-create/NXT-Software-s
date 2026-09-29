/* ============================================================
   NXT SOFTWARES — PARTICLE FIELD
   shared canvas engine (loader / hero / final CTA)
   ============================================================ */
'use strict';

window.NXTParticles = (function () {
  class Field {
    constructor(canvas, opts = {}) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({
        count: 60,
        speed: 0.16,
        drift: -0.12,        // gentle upward drift
        lines: false,
        linkDist: 120,
        mouse: false,
        size: [0.6, 1.8],
      }, opts);
      this.parts = [];
      this.mouse = { x: -9999, y: -9999 };
      this.running = false;
      this.raf = 0;
      this.dpr = 1;

      this._resize = this.resize.bind(this);
      this._tick = this.tick.bind(this);
      addEventListener('resize', this._resize);

      if (this.o.mouse && canvas.parentElement) {
        canvas.parentElement.addEventListener('mousemove', e => {
          const r = canvas.getBoundingClientRect();
          this.mouse.x = e.clientX - r.left;
          this.mouse.y = e.clientY - r.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => {
          this.mouse.x = -9999; this.mouse.y = -9999;
        });
      }

      // pause when offscreen
      new IntersectionObserver(entries => {
        for (const e of entries) e.isIntersecting ? this.start() : this.stop();
      }, { rootMargin: '80px' }).observe(canvas);

      this.resize();
    }

    resize() {
      const r = this.c.getBoundingClientRect();
      if (!r.width || !r.height) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.c.width = Math.round(r.width * this.dpr);
      this.c.height = Math.round(r.height * this.dpr);
      this.w = r.width;
      this.h = r.height;
      this.seed();
      if (REDUCED) this.drawFrame();
    }

    seed() {
      const [s0, s1] = this.o.size;
      this.parts = Array.from({ length: this.o.count }, () => ({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * this.o.speed,
        vy: (Math.random() - 0.5) * this.o.speed + this.o.drift * Math.random(),
        r: s0 + Math.random() * (s1 - s0),
        a: 0.22 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2,
        ts: 0.008 + Math.random() * 0.02,
      }));
    }

    start() {
      if (this.running) return;
      if (REDUCED) { this.drawFrame(); return; }
      this.running = true;
      this.raf = requestAnimationFrame(this._tick);
    }

    stop() {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }

    tick() {
      if (!this.running) return;
      this.step();
      this.drawFrame();
      this.raf = requestAnimationFrame(this._tick);
    }

    step() {
      const o = this.o;
      for (const p of this.parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.ts;
        if (p.x < -12) p.x = this.w + 12;
        if (p.x > this.w + 12) p.x = -12;
        if (p.y < -12) p.y = this.h + 12;
        if (p.y > this.h + 12) p.y = -12;
        if (o.mouse) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 126) * 0.55;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
      }
    }

    drawFrame() {
      const { ctx } = this;
      const o = this.o;
      if (!this.w) return;
      ctx.clearRect(0, 0, this.c.width, this.c.height);
      ctx.save();
      ctx.scale(this.dpr, this.dpr);
      for (const p of this.parts) {
        const twinkle = 0.6 + 0.4 * Math.sin(p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = `rgba(139,114,244,${(p.a * twinkle).toFixed(3)})`;
        ctx.fill();
      }
      if (o.lines) {
        ctx.lineWidth = 1;
        const max = o.linkDist * o.linkDist;
        for (let i = 0; i < this.parts.length; i++) {
          for (let j = i + 1; j < this.parts.length; j++) {
            const a = this.parts[i], b = this.parts[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < max) {
              const al = (1 - Math.sqrt(d2) / o.linkDist) * 0.15;
              ctx.strokeStyle = `rgba(139,114,244,${al.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.restore();
    }
  }

  return { create: (canvas, opts) => new Field(canvas, opts) };
})();
