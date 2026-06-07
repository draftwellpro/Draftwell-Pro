/* Draftwell Pro marketing site — main.js */

/* ── Sticky nav ───────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── Scroll reveal ────────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    // Animate any data-width bars inside this element
    el.querySelectorAll('[data-w]').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.w; }, 150);
    });
    revealObs.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Analytics tab switcher ───────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    if (!panel) return;
    panel.classList.add('active');
    // trigger reveals / bar animations that weren't visible yet
    panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
      el.querySelectorAll('[data-w]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.w; }, 100);
      });
    });
    // bars already visible but not yet animated (tab was hidden at scroll time)
    panel.querySelectorAll('[data-w]').forEach(bar => {
      if (bar.style.width === '0px' || bar.style.width === '' || bar.style.width === '0%') {
        setTimeout(() => { bar.style.width = bar.dataset.w; }, 100);
      }
    });
  });
});

/* ── Generate writing activity heatmap ───────────────────────── */
(function buildHeatmap() {
  const grid = document.getElementById('heatmap-grid');
  if (!grid) return;

  const WEEKS = 52, DPW = 7, TOTAL = WEEKS * DPW;

  // Park-Miller LCG — deterministic, full-period, no Math.random
  let s = 0xdead1;
  function rng() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  }

  // Per-month base writing probability — mimics a real author's year:
  // slow Jan start, building spring, summer lull, strong fall push, Dec wind-down
  const base = [0.28, 0.40, 0.55, 0.50, 0.60, 0.32, 0.24, 0.18, 0.50, 0.65, 0.72, 0.30];

  // Generate levels in chronological order, with streak momentum
  const timeData = new Array(TOTAL); // timeData[w * DPW + d] = level
  let momentum = 0;

  for (let w = 0; w < WEEKS; w++) {
    const mIdx = Math.min(11, Math.floor(w / WEEKS * 12));

    for (let d = 0; d < DPW; d++) {
      const p = Math.min(0.85, base[mIdx] + momentum * 0.055);
      let level = 0;
      if (rng() < p) {
        const q = rng();
        if      (q > 0.92) level = 4; // marathon day  (~8% of writing days)
        else if (q > 0.77) level = 3; // heavy session (~15%)
        else if (q > 0.46) level = 2; // moderate      (~31%)
        else               level = 1; // light          (~46%)
        momentum = Math.min(4, momentum + 1);
      } else {
        momentum = Math.max(0, momentum - 1);
      }
      timeData[w * DPW + d] = level;
    }
  }

  // The grid is repeat(52, 1fr) — cells fill row-first (day-of-week × week).
  // Grid index for week w, day d = d * WEEKS + w.
  const gridCells = new Array(TOTAL);
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DPW; d++) {
      gridCells[d * WEEKS + w] = timeData[w * DPW + d];
    }
  }

  gridCells.forEach(function(level) {
    const cell = document.createElement('div');
    cell.className = level ? 'hmap-cell l' + level : 'hmap-cell';
    grid.appendChild(cell);
  });
})();

/* ── Generate story structure bar chart ──────────────────────── */
(function buildStructureChart() {
  const container = document.getElementById('structure-chart');
  if (!container) return;
  const chapters = [
    { label: 'Ch. 1',  words: 4200, act: 1 },
    { label: 'Ch. 2',  words: 3800, act: 1 },
    { label: 'Ch. 3',  words: 5100, act: 1 },
    { label: 'Ch. 4',  words: 3400, act: 1 },
    { label: 'Ch. 5',  words: 4600, act: 2 },
    { label: 'Ch. 6',  words: 2900, act: 2 },
    { label: 'Ch. 7',  words: 5800, act: 2 },
    { label: 'Ch. 8',  words: 4100, act: 2 },
    { label: 'Ch. 9',  words: 3700, act: 2 },
    { label: 'Ch. 10', words: 6200, act: 3 },
    { label: 'Ch. 11', words: 4900, act: 3 },
    { label: 'Ch. 12', words: 3100, act: 3 },
  ];
  const colors = { 1: 'var(--blue)', 2: 'var(--teal)', 3: 'var(--purple)' };
  const max = 6200;
  chapters.forEach(ch => {
    const pct = Math.round((ch.words / max) * 100);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <span class="bar-label">${ch.label}</span>
      <div class="bar-outer">
        <div class="bar-inner" style="background:${colors[ch.act]};width:0" data-w="${pct}%">
          <span class="bar-val-lbl">${(ch.words / 1000).toFixed(1)}k</span>
        </div>
      </div>`;
    container.appendChild(row);
  });

  // Observe the chart container and animate when visible
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    container.querySelectorAll('[data-w]').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.w; }, 150);
    });
    obs.disconnect();
  }, { threshold: 0.2 });
  obs.observe(container);
})();

/* ── Radar chart fade-in ──────────────────────────────────────── */
(function initRadar() {
  const polygon = document.getElementById('radar-data');
  if (!polygon) return;
  polygon.style.opacity = '0';
  polygon.style.transformOrigin = '150px 150px';
  polygon.style.transform = 'scale(0.3)';
  polygon.style.transition = 'opacity 1.1s ease, transform 1.1s ease';

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    setTimeout(() => {
      polygon.style.opacity = '1';
      polygon.style.transform = 'scale(1)';
    }, 300);
    obs.disconnect();
  }, { threshold: 0.3 });

  const section = document.getElementById('analytics');
  if (section) obs.observe(section);
})();

/* ── Image carousels ─────────────────────────────────────────── */
function initCarousel(container) {
  const slides  = Array.from(container.querySelectorAll('.hc-slide'));
  const dots    = Array.from(container.querySelectorAll('.hc-dot'));
  const prevBtn = container.querySelector('.hc-prev');
  const nextBtn = container.querySelector('.hc-next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function start() { timer = setInterval(next, 4000); }
  function reset() { clearInterval(timer); start(); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.idx, 10));
      reset();
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); reset(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); reset(); });

  start();
}

document.querySelectorAll('.hero-carousel').forEach(initCarousel);

/* ── Lightbox ────────────────────────────────────────────────── */
(function initLightbox() {
  const lb     = document.getElementById('lightbox');
  const lbImg  = lb && lb.querySelector('.lb-img');
  const lbClose = lb && lb.querySelector('.lb-close');
  if (!lb) return;

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (!lb.classList.contains('open')) lbImg.src = ''; }, 300);
  }

  document.querySelectorAll('.screenshot').forEach(img => {
    img.addEventListener('click', () => open(img.src, img.alt));
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── Smooth scroll for all anchor links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
