/**
 * Embedded source document for <SemanticBloom />.
 *
 * semantic-bloom.tsx patches this string at runtime (title, theme colors,
 * pause/resume controls), so the anchors below are contractual:
 *   - `<title vid="4">Organic Semantic Explorer</title>`
 *   - `ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';`
 *   - `ctx.strokeStyle = 'rgba(120, 120, 120, 0.15)';`
 *   - `function animate() {` + newline + 12 spaces + `ctx.clearRect(...)`
 *   - exactly one `requestAnimationFrame(animate);`
 *   - top-level globals: editor, scanText, updateWordCoords, animate
 */
export const semanticExplorerSource = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title vid="4">Organic Semantic Explorer</title>
<style>
  :root {
    --bg-color: #030303;
    --text-color: #555555;
    --highlight-color: #e0e0e0;
    --sf-semantic-size: 1;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: var(--bg-color); width: 100%; height: 100%; overflow: hidden; }
  .query-container, .status-hud { display: none; }
  #field { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
  .interface-layer {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: clamp(2rem, 8vw, 8rem);
  }
  .journal-area {
    display: flex; align-items: center; justify-content: center;
    width: 100%; overflow: visible;
    color: var(--text-color);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    font-size: clamp(4rem, calc(12vw * var(--sf-semantic-size)), 11rem);
    font-weight: 300; line-height: 1; letter-spacing: -0.065em;
    text-align: center; white-space: pre-wrap; caret-color: transparent;
    outline: none; user-select: none;
  }
  .journal-area .word { display: inline-block; color: var(--text-color); }
  #cursor-follower {
    position: fixed; z-index: 3; left: 0; top: 0;
    width: 34px; height: 34px; border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    pointer-events: none; transform: translate(-50%, -50%);
    opacity: 0; transition: opacity 0.3s ease;
  }
  @media (max-width: 640px) {
    .interface-layer { padding: 1.5rem; }
    .journal-area { font-size: clamp(3rem, calc(19vw * var(--sf-semantic-size)), 7rem); }
  }
</style>
</head>
<body>
<div class="query-container" aria-hidden="true"></div>
<div class="status-hud" aria-hidden="true"></div>
<canvas id="field"></canvas>
<div class="interface-layer">
  <div class="journal-area">
    <div id="editor" contenteditable="false" data-processed="false">Codex</div>
  </div>
</div>
<div id="cursor-follower" aria-hidden="true"></div>
<script>
var editor = document.getElementById('editor');
var canvas = document.getElementById('field');
var ctx = canvas.getContext('2d');
var follower = document.getElementById('cursor-follower');
var width = 0;
var height = 0;
var charRects = [];
var particles = [];
var mouse = { x: -9999, y: -9999 };
var range = document.createRange();
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  updateWordCoords();
  seedParticles();
  if (reduceMotion) staticRender();
}

function scanText() {
  var raw = (editor.textContent || 'Codex').trim().slice(0, 72) || 'Codex';
  var words = raw.split(/\\s+/);
  editor.textContent = '';
  for (var i = 0; i < words.length; i++) {
    var span = document.createElement('span');
    span.className = 'word';
    span.textContent = words[i];
    editor.appendChild(span);
    if (i < words.length - 1) editor.appendChild(document.createTextNode(' '));
  }
  editor.dataset.processed = 'true';
  updateWordCoords();
  seedParticles();
  if (reduceMotion) staticRender();
}

function updateWordCoords() {
  charRects = [];
  var words = editor.querySelectorAll('.word');
  for (var w = 0; w < words.length; w++) {
    var node = words[w].firstChild;
    while (node) {
      if (node.nodeType === 3) {
        var text = node.nodeValue || '';
        for (var c = 0; c < text.length; c++) {
          if (text.charAt(c) === ' ') continue;
          try {
            range.setStart(node, c);
            range.setEnd(node, c + 1);
            var r = range.getBoundingClientRect();
            if (r.width > 0 || r.height > 0) {
              charRects.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height });
            }
          } catch (err) { /* range on empty node — skip */ }
        }
      }
      node = node.nextSibling;
    }
  }
}

function seedParticles() {
  particles = [];
  if (!charRects.length) return;
  var count = Math.min(220, Math.max(48, charRects.length * 18));
  for (var i = 0; i < count; i++) {
    var target = i % charRects.length;
    var base = charRects[target];
    particles.push({
      x: base.x + (Math.random() - 0.5) * 300,
      y: base.y + (Math.random() - 0.5) * 300,
      vx: 0,
      vy: 0,
      target: target,
      orbit: base.h * 0.6 + Math.random() * 110,
      speed: 0.22 + Math.random() * 0.65,
      phase: Math.random() * 6.283,
      size: 1.6 + Math.random() * 2.6
    });
  }
}

function renderFrame(t) {
  ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
  var i;
  for (i = 0; i < particles.length; i++) {
    var p = particles[i];
    var base = p.target < charRects.length ? charRects[p.target] : null;
    var tx = base ? base.x : width / 2;
    var ty = base ? base.y : height / 2;
    var ox = Math.cos(t * p.speed + p.phase) * p.orbit;
    var oy = Math.sin(t * p.speed * 0.8 + p.phase * 1.7) * p.orbit * 0.6;
    p.vx = (p.vx + (tx + ox - p.x) * 0.012) * 0.9;
    p.vy = (p.vy + (ty + oy - p.y) * 0.012) * 0.9;
    var mdx = p.x - mouse.x;
    var mdy = p.y - mouse.y;
    var md = Math.sqrt(mdx * mdx + mdy * mdy);
    if (md < 110 && md > 0.01) {
      var push = ((110 - md) / 110) * 0.6;
      p.vx += (mdx / md) * push;
      p.vy += (mdy / md) * push;
    }
    p.x += p.vx;
    p.y += p.vy;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.strokeStyle = 'rgba(120, 120, 120, 0.15)';
  ctx.lineWidth = 1;
  for (i = 0; i < particles.length; i++) {
    var a = particles[i];
    for (var j = i + 1; j < particles.length; j++) {
      var b = particles[j];
      var ddx = a.x - b.x;
      var ddy = a.y - b.y;
      var dd = ddx * ddx + ddy * ddy;
      if (dd < 4096) {
        ctx.globalAlpha = 1 - Math.sqrt(dd) / 64;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function staticRender() {
  ctx.clearRect(0, 0, width, height);
  renderFrame(1.35);
}

function animate() {
            ctx.clearRect(0, 0, width, height);
      if (reduceMotion) { staticRender(); return; }
      renderFrame(performance.now() / 1000);
      requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  follower.style.left = e.clientX + 'px';
  follower.style.top = e.clientY + 'px';
  follower.style.opacity = '1';
});
window.addEventListener('mouseout', function () {
  mouse.x = -9999;
  mouse.y = -9999;
  follower.style.opacity = '0';
});
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () {
    updateWordCoords();
    seedParticles();
    if (reduceMotion) staticRender();
  });
}
scanText();
resize();
if (!reduceMotion) window.setTimeout(animate, 40);
</script>
</body>
</html>
`
