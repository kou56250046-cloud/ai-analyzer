import {
  TOOLS, TOOLS_BY_ID, SCORE_LABELS, CAP_LABELS, USECASES,
  CATEGORIES, WORKFLOWS, NEWS, CATEGORY_LABELS, META,
  MODELS, MODEL_CAP_LABELS, CODING_TOOLS, CHANGELOGS,
} from './data.js';

/* ── state ─────────────────────────────────────────────────────────── */
let plan = 'free';
let activeCap = 'long_text';
let activeScene = '社内';
let activeModelCap = 'reasoning';
let activeChangelogTool = 'all';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const safeUrl = (u) => /^https?:\/\//i.test(String(u ?? '')) ? u : '#';

const VALID_NEWS_CATS = new Set(['new_feature', 'update', 'pricing', 'integration', 'deprecation']);
const safeClass = (c) => VALID_NEWS_CATS.has(c) ? c : 'update';

function heatColor(v) {
  const t = Math.max(0, Math.min(100, v)) / 100;
  return `rgba(79,214,255,${(0.12 + t * 0.85).toFixed(2)})`;
}

/* ── SimpleIcons アイコン HTML ──────────────────────────────────────── */
function toolIconHtml(t, size = 22) {
  if (t.icon) {
    // data-icon / data-letter を使い、onerror はあとで addEventListener で付与
    return `<img class="tool-icon" data-icon="${esc(t.icon)}" data-letter="${esc(t.name[0])}" src="https://cdn.simpleicons.org/${esc(t.icon)}/c0c8e0" width="${size}" height="${size}" alt="${esc(t.name)}" loading="lazy" /><span class="tool-icon-letter" style="display:none">${esc(t.name[0])}</span>`;
  }
  return `<span class="tool-icon-letter">${esc(t.name[0])}</span>`;
}

function wireIconFallbacks(root = document) {
  root.querySelectorAll('img.tool-icon').forEach((img) => {
    if (img.dataset.bound) return;
    img.dataset.bound = '1';
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const sib = img.nextElementSibling;
      if (sib && sib.classList.contains('tool-icon-letter')) sib.style.display = 'flex';
    }, { once: true });
  });
}

/* ── META ───────────────────────────────────────────────────────────── */
$$('[data-meta="updated"]').forEach((n) => (n.textContent = META.updated));
$$('[data-meta="year"]').forEach((n) => (n.textContent = new Date().getFullYear()));
$$('[data-meta="count"]').forEach((n) => {
  if (!n.hasAttribute('data-count')) n.textContent = META.toolCount;
});

/* ── SCROLL PROGRESS BAR ────────────────────────────────────────────── */
function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    bar.style.width = ((scrollTop / (scrollHeight - clientHeight)) * 100) + '%';
  }, { passive: true });
}

/* ── HERO PARTICLES ─────────────────────────────────────────────────── */
function initHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLORS = ['#4fd6ff', '#4fd6ff', '#4fd6ff', '#a48bff', '#57e3a6'];
  let W, H;
  const particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.5,
      vy:    (Math.random() - 0.5) * 0.5,
      r:     Math.random() * 1.8 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      a:     Math.random() * 0.5 + 0.15,
    };
  }

  resize();
  for (let i = 0; i < 55; i++) particles.push(mkParticle());

  window.addEventListener('resize', resize, { passive: true });

  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  (function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#4fd6ff';
          ctx.globalAlpha = (1 - d / 115) * 0.13;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const d  = Math.hypot(dx, dy);
      if (d < 160) {
        const f = ((160 - d) / 160) * 0.04;
        p.vx += dx * f;
        p.vy += dy * f;
      }
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x  += p.vx;
      p.y  += p.vy;
      if (p.x < -10)      p.x = W + 10;
      if (p.x > W + 10)   p.x = -10;
      if (p.y < -10)      p.y = H + 10;
      if (p.y > H + 10)   p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.a;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
}

/* ── COUNTER ANIMATION ──────────────────────────────────────────────── */
function initCounters() {
  const nodes = $$('[data-count]');
  if (!nodes.length) return;
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const n = e.target;
      const target = parseInt(n.dataset.count, 10);
      const dur = 1200;
      const t0  = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        n.textContent = Math.round(easeOut(p) * target);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      io.unobserve(n);
    });
  }, { threshold: 0.5 });

  nodes.forEach((n) => io.observe(n));
}

/* ── NAV ────────────────────────────────────────────────────────────── */
function initNavScroll() {
  const nav = $('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initNavActiveLink() {
  const sections = $$('section[id], header[id]');
  const links    = $$('.nav-links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { threshold: 0.4, rootMargin: '-10% 0px -55% 0px' });
  sections.forEach((s) => io.observe(s));
}

/* ── CONSOLE ────────────────────────────────────────────────────────── */
function buildCapTags() {
  const box = $('#capTags');
  Object.entries(CAP_LABELS).forEach(([key, label]) => {
    const b = el('button', 'cap-tag' + (key === activeCap ? ' active' : ''), label);
    b.dataset.cap = key;
    b.addEventListener('click', () => {
      activeCap = key;
      $$('.cap-tag').forEach((t) => t.classList.toggle('active', t.dataset.cap === key));
      b.classList.remove('ripple-out');
      void b.offsetWidth;
      b.classList.add('ripple-out');
      b.addEventListener('animationend', () => b.classList.remove('ripple-out'), { once: true });
      renderBars();
    });
    box.appendChild(b);
  });
}

function renderBars(animate = true) {
  const host   = $('#bars');
  const ranked = [...TOOLS]
    .map((t) => ({ t, v: t.caps[plan][activeCap] ?? 0 }))
    .sort((a, b) => b.v - a.v);

  host.innerHTML = '';
  ranked.forEach((row, i) => {
    const r = el('div', 'bar-row');
    r.innerHTML = `
      <div class="bar-rank">${String(i + 1).padStart(2, '0')}</div>
      <div class="bar-name">${esc(row.t.name)}</div>
      <div class="bar-track"><div class="bar-fill ${esc(row.t.id)}${i === 0 ? ' top-bar' : ''}"></div></div>
      <div class="bar-val">${row.v}%</div>`;
    host.appendChild(r);
    const fill = r.querySelector('.bar-fill');
    const pct  = row.v;
    if (animate) {
      fill.style.transitionDelay = `${i * 0.045}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct + '%'; }));
    } else {
      fill.style.width = pct + '%';
    }
  });
}

/* ── MODEL BENCHMARK ────────────────────────────────────────────────── */
function buildModelCapTags() {
  const box = $('#modelCapTags');
  if (!box) return;
  Object.entries(MODEL_CAP_LABELS).forEach(([key, label]) => {
    const b = el('button', 'cap-tag' + (key === activeModelCap ? ' active' : ''), label);
    b.dataset.cap = key;
    b.addEventListener('click', () => {
      activeModelCap = key;
      $$('#modelCapTags .cap-tag').forEach((t) => t.classList.toggle('active', t.dataset.cap === key));
      b.classList.remove('ripple-out');
      void b.offsetWidth;
      b.classList.add('ripple-out');
      b.addEventListener('animationend', () => b.classList.remove('ripple-out'), { once: true });
      renderModelBars();
    });
    box.appendChild(b);
  });
}

function renderModelBars(animate = true) {
  const host = $('#modelBars');
  if (!host) return;
  const ranked = [...MODELS]
    .map((m) => ({ m, v: m.caps[activeModelCap] ?? 0 }))
    .sort((a, b) => b.v - a.v);

  host.innerHTML = '';
  ranked.forEach((row, i) => {
    const r = el('div', 'bar-row');
    r.innerHTML = `
      <div class="bar-rank">${String(i + 1).padStart(2, '0')}</div>
      <div class="bar-name">${esc(row.m.name)}</div>
      <div class="bar-track"><div class="bar-fill ${esc(row.m.vendor)}${i === 0 ? ' top-bar' : ''}"></div></div>
      <div class="bar-val">${row.v}%</div>`;
    host.appendChild(r);
    const fill = r.querySelector('.bar-fill');
    if (animate) {
      fill.style.transitionDelay = `${i * 0.045}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = row.v + '%'; }));
    } else {
      fill.style.width = row.v + '%';
    }
  });
}

/* ── PLAN TOGGLES ───────────────────────────────────────────────────── */
function syncPlanButtons() {
  $$('[data-plan]').forEach((b) => b.classList.toggle('on', b.dataset.plan === plan));
}

function wirePlanToggles() {
  $$('[data-plan]').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.plan === plan) return;
      plan = b.dataset.plan;
      syncPlanButtons();
      $$('.bar-fill').forEach((f) => { f.style.transitionDelay = '0s'; f.style.width = '0'; });
      setTimeout(() => { renderBars(); renderHeatmap(); }, 460);
    })
  );
  syncPlanButtons();
}

/* ── USE CASES ──────────────────────────────────────────────────────── */
function renderCategories() {
  const host = $('#catGrid');
  host.innerHTML = '';
  CATEGORIES[activeScene].forEach((c, idx) => {
    const card = el('div', 'cat-card');
    card.style.setProperty('--i', idx);
    const tools = c.tools.map((id, j) => {
      const t = TOOLS_BY_ID[id];
      if (!t) return '';
      return `<div class="cat-tool"><span class="pin${j === 0 ? ' best' : ''}">${j === 0 ? '★' : '·'}</span>${esc(t.name)}</div>`;
    }).join('');
    card.innerHTML = `<span class="scene">${esc(activeScene)}</span><h3>${esc(c.name)}</h3><div class="cat-tools">${tools}</div>`;
    host.appendChild(card);
  });
}

function wireTabs() {
  $$('#sceneTabs button').forEach((b) =>
    b.addEventListener('click', () => {
      activeScene = b.dataset.scene;
      $$('#sceneTabs button').forEach((x) => x.classList.toggle('on', x === b));
      renderCategories();
    })
  );
}

/* ── TOOL SEARCH ────────────────────────────────────────────────────── */
function initToolSearch() {
  const input = $('#toolSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    $$('.tool-card').forEach((card) => {
      const name    = (card.dataset.name    || '').toLowerCase();
      const vendor  = (card.dataset.vendor  || '').toLowerCase();
      const type    = (card.dataset.type    || '').toLowerCase();
      const tags    = (card.dataset.tags    || '').toLowerCase();
      const summary = (card.dataset.summary || '').toLowerCase();
      const match = !q || name.includes(q) || vendor.includes(q) || type.includes(q) || tags.includes(q) || summary.includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
}

/* ── TOOL GRID ──────────────────────────────────────────────────────── */
function renderTools() {
  const host = $('#toolGrid');
  TOOLS.forEach((t, i) => {
    const card = el('div', 'tool-card');
    card.dataset.accent  = t.accent;
    card.dataset.name    = t.name;
    card.dataset.vendor  = t.vendor;
    card.dataset.type    = t.type;
    card.dataset.tags    = t.tags.join(' ');
    card.dataset.summary = t.summary;
    card.style.setProperty('--i', i);

    card.innerHTML = `
      <div class="accentline"></div>
      <div class="t-top">
        <div class="t-icon-name">
          ${toolIconHtml(t, 20)}
          <h3>${esc(t.name)}</h3>
        </div>
        <span class="vendor">${esc(t.vendor)}</span>
      </div>
      <span class="type">${esc(t.type)}</span>
      <p>${esc(t.summary)}</p>
      <div class="chips">${t.tags.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>
      <button class="expand-btn" aria-expanded="false">詳細 <span class="expand-arrow">▼</span></button>
      <div class="expand-body" hidden>
        <div class="plan-row">
          <div class="plan-mini free">
            <div class="plan-mini-label">無料</div>
            <div class="plan-mini-name">${esc(t.plans.free.plan)}</div>
            <div class="plan-mini-note">${esc(t.plans.free.note)}</div>
          </div>
          <div class="plan-mini paid">
            <div class="plan-mini-label">有料</div>
            <div class="plan-mini-name">${esc(t.plans.paid.plan)}</div>
            <div class="plan-mini-note">${esc(t.plans.paid.note)}</div>
          </div>
        </div>
        <div class="expand-actions">
          <a class="expand-link" href="${safeUrl(t.url)}" target="_blank" rel="noopener noreferrer">公式サイト →</a>
          <button class="expand-chart-btn">6軸チャート →</button>
        </div>
      </div>`;

    const expandBtn  = card.querySelector('.expand-btn');
    const expandBody = card.querySelector('.expand-body');
    const chartBtn   = card.querySelector('.expand-chart-btn');

    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !expandBody.hidden;
      expandBody.hidden = isOpen;
      expandBtn.setAttribute('aria-expanded', String(!isOpen));
      card.classList.toggle('expanded', !isOpen);
    });

    chartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(t.id);
    });

    host.appendChild(card);
  });
}

function initToolCard3D() {
  $$('.tool-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (card.classList.contains('expanded')) return;
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -7;
      const ry = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * 7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

function initToolCardReveal() {
  $$('.tool-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.055}s`;
    card.classList.add('card-reveal');
  });
}

/* ── CODING SPECIAL ─────────────────────────────────────────────────── */
function renderCodingSpecial() {
  const host = $('#codingGrid');
  if (!host) return;
  CODING_TOOLS.forEach((c) => {
    const t = TOOLS_BY_ID[c.id];
    if (!t) return;
    const codingScore = t.caps.paid.coding;
    const agentScore  = t.caps.paid.agent;
    const card = el('div', 'coding-card');
    card.innerHTML = `
      <div class="coding-card-top">
        <div class="coding-icon-name">
          ${toolIconHtml(t, 28)}
          <div>
            <div class="coding-name">${esc(t.name)}</div>
            <div class="coding-strength">${esc(c.strength)}</div>
          </div>
        </div>
      </div>
      <p class="coding-detail">${esc(c.detail)}</p>
      <div class="coding-scores">
        <div class="coding-score-item">
          <div class="coding-score-label">コーディング</div>
          <div class="coding-score-bar-wrap">
            <div class="coding-score-bar" data-target="${codingScore}"></div>
          </div>
          <div class="coding-score-val">${codingScore}%</div>
        </div>
        <div class="coding-score-item">
          <div class="coding-score-label">エージェント</div>
          <div class="coding-score-bar-wrap">
            <div class="coding-score-bar agent" data-target="${agentScore}"></div>
          </div>
          <div class="coding-score-val">${agentScore}%</div>
        </div>
      </div>
      <a class="expand-link" href="${safeUrl(t.url)}" target="_blank" rel="noopener noreferrer">公式サイト →</a>`;
    host.appendChild(card);
  });
}

function initCodingBars() {
  $$('.coding-score-bar').forEach((bar) => {
    const target = (bar.dataset.target ?? '0') + '%';
    bar.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.width = target;
    }));
  });
}

/* ── PRICING TABLE ──────────────────────────────────────────────────── */
function renderPricing() {
  const host = $('#pricingTable');
  if (!host) return;
  const rows = TOOLS.map((t) => {
    const free = t.price ? esc(t.price.free) : '—';
    const paid = t.price ? esc(t.price.paid) : '—';
    return `
      <tr>
        <td class="pricing-tool">
          <div class="pricing-tool-inner">
            ${toolIconHtml(t, 18)}
            <span>${esc(t.name)}</span>
          </div>
        </td>
        <td class="pricing-type">${esc(t.type)}</td>
        <td class="pricing-free"><span class="price-badge free">${free}</span></td>
        <td class="pricing-paid"><span class="price-badge paid">${paid}</span></td>
        <td class="pricing-link"><a href="${safeUrl(t.url)}" target="_blank" rel="noopener noreferrer" class="pricing-site-link">→</a></td>
      </tr>`;
  }).join('');

  host.innerHTML = `
    <table class="pricing-tbl">
      <thead>
        <tr>
          <th>ツール</th>
          <th>カテゴリ</th>
          <th>無料プラン</th>
          <th>有料プラン</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* ── HEATMAP ────────────────────────────────────────────────────────── */
function renderHeatmap() {
  const host = $('#heatWrap');
  const head = `<tr><th>用途 \\ ツール</th>${TOOLS.map((t) => `<th>${esc(t.name)}</th>`).join('')}</tr>`;
  const rows = USECASES.map((u, ri) =>
    `<tr><th>${esc(u.name)}</th>${TOOLS.map((t, ci) => {
      const v = t.fit[plan][u.key] ?? 0;
      return `<td><span class="heat-cell" style="background:${heatColor(v)}" data-row="${ri}" data-col="${ci}" title="${esc(t.name)} × ${esc(u.name)}: ${esc(String(v))}%">${esc(String(v))}%</span></td>`;
    }).join('')}</tr>`
  ).join('');
  host.innerHTML = `<table class="heat"><thead>${head}</thead><tbody>${rows}</tbody></table>`;
}

function initHeatReveal() {
  const wrap = $('#heatWrap');
  if (!wrap) return;
  $$('.heat-cell').forEach((c) => {
    c.style.setProperty('--row', c.dataset.row);
    c.style.setProperty('--col', c.dataset.col);
    c.classList.add('cell-reveal');
  });
}

/* ── NEWS ───────────────────────────────────────────────────────────── */
function renderNews() {
  const host = $('#newsList');
  host.innerHTML = '';
  NEWS.forEach((n, i) => {
    const item = el('div', 'news-item');
    item.style.setProperty('--i', i);
    const cat = safeClass(n.category);
    const catLabel = esc(CATEGORY_LABELS[n.category] || n.category);
    const titleHtml = n.url && n.url !== '#'
      ? `<a href="${safeUrl(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.title)}</a>`
      : esc(n.title);
    item.innerHTML = `
      <div class="news-meta">
        <div>${esc(n.date)}</div><div>${esc(n.tool)}</div>
        <span class="news-cat ${cat}">${catLabel}</span>
      </div>
      <div>
        <h4>${titleHtml}</h4>
        <p>${esc(n.summary)}</p>
      </div>`;
    host.appendChild(item);
  });
  $$('.news-item').forEach((item) => { item.style.opacity = '0'; });
}

/* ── NEWS TIMELINE TOGGLE ───────────────────────────────────────────── */
function initNewsTimeline() {
  const btn  = $('#newsTimelineToggle');
  const list = $('#newsList');
  if (!btn || !list) return;
  let isTimeline = false;
  btn.addEventListener('click', () => {
    isTimeline = !isTimeline;
    list.classList.toggle('timeline', isTimeline);
    btn.classList.toggle('active', isTimeline);
    btn.textContent = isTimeline ? '≡ リスト表示' : '○ タイムライン';
  });
}

/* ── WORKFLOWS ──────────────────────────────────────────────────────── */
function renderWorkflows() {
  const host = $('#wfGrid');
  WORKFLOWS.forEach((w, wi) => {
    const card = el('div', 'wf-card');
    card.style.setProperty('--i', wi);
    const steps = w.steps.map((s, i) => `
      <div class="wf-step">
        <div class="wf-n">${i + 1}</div>
        <div><div class="wf-tool">${esc(s.tool)}</div><div class="wf-do">${esc(s.do)}</div></div>
      </div>`).join('');
    card.innerHTML = `<span class="scene">${esc(w.scene)}</span><h3>${esc(w.title)}</h3>${steps}`;
    host.appendChild(card);
  });
}

/* ── CHANGELOG ──────────────────────────────────────────────────────── */
function renderChangelog() {
  const host      = $('#changelogList');
  const tabsHost  = $('#changelogTabs');
  if (!host || !tabsHost) return;

  const toolNames = ['all', ...new Set(CHANGELOGS.map((c) => c.tool))];

  tabsHost.innerHTML = '';
  toolNames.forEach((name) => {
    const b = el('button', 'cl-tab' + (name === 'all' ? ' active' : ''), name === 'all' ? 'すべて' : esc(name));
    b.dataset.tool = name;
    b.addEventListener('click', () => {
      activeChangelogTool = name;
      $$('.cl-tab').forEach((x) => x.classList.toggle('active', x.dataset.tool === name));
      drawChangelog();
    });
    tabsHost.appendChild(b);
  });

  drawChangelog();
}

function drawChangelog() {
  const host = $('#changelogList');
  if (!host) return;
  const items = activeChangelogTool === 'all'
    ? CHANGELOGS
    : CHANGELOGS.filter((c) => c.tool === activeChangelogTool);

  host.innerHTML = '';
  items.forEach((c, i) => {
    const row = el('div', 'cl-item');
    row.style.setProperty('--i', i);
    row.innerHTML = `
      <div class="cl-header">
        <span class="cl-date">${esc(c.date)}</span>
        <span class="cl-tool">${esc(c.tool)}</span>
      </div>
      <div class="cl-content">${esc(c.content)}</div>`;
    host.appendChild(row);
  });
}

/* ── MODAL ──────────────────────────────────────────────────────────── */
let radarChart = null;

function openModal(id) {
  const t    = TOOLS_BY_ID[id];
  const back = $('#modalBack');
  $('#mName').textContent    = t.name;
  $('#mVendor').textContent  = `${t.vendor} ・ ${t.type}`;
  $('#mSummary').textContent = t.summary;
  $('#mFreeName').textContent = t.plans.free.plan;
  $('#mFreeNote').textContent = t.plans.free.note;
  $('#mPaidName').textContent = t.plans.paid.plan;
  $('#mPaidNote').textContent = t.plans.paid.note;
  $('#mVisit').href = safeUrl(t.url);
  back.classList.add('show');
  document.body.style.overflow = 'hidden';
  drawRadar(t);
}

function closeModal() {
  $('#modalBack').classList.remove('show');
  document.body.style.overflow = '';
  if (radarChart) { radarChart.destroy(); radarChart = null; }
}

function drawRadar(t) {
  const ctx    = $('#radar').getContext('2d');
  const labels = Object.values(SCORE_LABELS);
  const keys   = Object.keys(SCORE_LABELS);
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: '無料プラン',
          data: keys.map((k) => t.scores.free[k]),
          borderColor: '#4fd6ff', backgroundColor: 'rgba(79,214,255,0.18)',
          pointBackgroundColor: '#4fd6ff', borderWidth: 2,
        },
        {
          label: '有料プラン',
          data: keys.map((k) => t.scores.paid[k]),
          borderColor: '#ffb24d', backgroundColor: 'rgba(255,178,77,0.14)',
          pointBackgroundColor: '#ffb24d', borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeOutQuart' },
      plugins: {
        legend: { labels: { color: '#e7ecf6', font: { family: 'Space Mono', size: 11 } } },
      },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { stepSize: 20, color: '#5b6480', backdropColor: 'transparent', font: { size: 9 } },
          grid: { color: 'rgba(255,255,255,0.10)' },
          angleLines: { color: 'rgba(255,255,255,0.10)' },
          pointLabels: { color: '#8a94ad', font: { family: 'Noto Sans JP', size: 12 } },
        },
      },
    },
  });
}

/* ── REVEAL ON SCROLL ───────────────────────────────────────────────── */
function wireReveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');

      const id = e.target.id;
      if (id === 'console')   renderBars(true);
      if (id === 'tools')     initToolCardReveal();
      if (id === 'heatmap')   initHeatReveal();
      if (id === 'models')    renderModelBars(true);
      if (id === 'coding')    initCodingBars();
      if (id === 'usecases')  $('#catGrid').classList.add('animated');
      if (id === 'workflows') $('#wfGrid').classList.add('animated');
      if (id === 'news') {
        $$('.news-item').forEach((item, i) => {
          if (item.classList.contains('news-hidden')) return;
          setTimeout(() => {
            item.style.opacity = '';
            item.classList.add('news-reveal');
          }, i * 80);
        });
      }

      io.unobserve(e.target);
    }),
    { threshold: 0.1 }
  );
  $$('.reveal').forEach((n) => io.observe(n));
}

/* ── NEWS TOGGLE ────────────────────────────────────────────────────── */
const COLLAPSED_COUNT = 4;

function initNewsToggle() {
  const items = $$('.news-item');
  const fold  = $('#newsFold');
  const btn   = $('#newsToggle');
  const lbl   = $('#newsToggleLabel');

  if (!fold || !btn) return;
  if (items.length <= COLLAPSED_COUNT) { fold.hidden = true; return; }

  items.forEach((item, i) => {
    if (i >= COLLAPSED_COUNT) item.classList.add('news-hidden');
  });

  let isOpen = false;
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    btn.classList.toggle('expanded', isOpen);
    lbl.textContent = isOpen ? '折りたたむ' : 'もっと見る';

    items.forEach((item, i) => {
      if (i < COLLAPSED_COUNT) return;
      const rel = i - COLLAPSED_COUNT;
      if (isOpen) {
        item.classList.remove('news-hidden');
        item.classList.remove('news-reveal');
        item.style.setProperty('--i', rel);
        void item.offsetWidth;
        setTimeout(() => {
          item.style.opacity = '';
          item.classList.add('news-reveal');
        }, rel * 80);
      } else {
        item.classList.add('news-hidden');
        item.style.opacity = '0';
        item.classList.remove('news-reveal');
      }
    });
  });
}

/* ── NAV BURGER ─────────────────────────────────────────────────────── */
function wireNav() {
  const burger = $('#burger');
  const links  = $('#navLinks');
  burger.addEventListener('click', () => links.classList.toggle('open'));
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ── INIT ───────────────────────────────────────────────────────────── */
initScrollBar();
buildCapTags();
renderBars(false);
buildModelCapTags();
renderModelBars(false);
wirePlanToggles();
renderCategories();
wireTabs();
renderTools();
initToolCard3D();
initToolSearch();
renderCodingSpecial();
renderPricing();
renderHeatmap();
renderNews();
initNewsToggle();
initNewsTimeline();
renderWorkflows();
renderChangelog();
wireReveal();
wireNav();
initHeroParticles();
initCounters();
initNavScroll();
initNavActiveLink();
wireIconFallbacks();

$('#modalClose').addEventListener('click', closeModal);
$('#modalBack').addEventListener('click', (e) => { if (e.target.id === 'modalBack') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
