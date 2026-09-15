// ── Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
})();

function bindCursorHover(el) {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.width = '56px';
    ring.style.height = '56px';
    ring.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.opacity = '0.5';
  });
}
document.querySelectorAll('a, button').forEach(bindCursorHover);

// ── 새로고침 시 hash로 인한 자동 스크롤 방지
history.scrollRestoration = 'manual';

// ── 앵커 클릭: URL에 hash 남기지 않고 smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
  });
});

// ── Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ══════════════ INTRO SEQUENCE ══════════════ */
(function initIntro() {
  const hero = document.getElementById('hero');
  const hTile = document.getElementById('introHTile');
  const tilesEl = document.getElementById('introTiles');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 35-tile decorative grid behind the "H" app icon
  const cols = 7, rows = 5, cx = 3, cy = 2;
  const glyphs = ['A','B','C','D','E','F','G','K','L','M','N','O','P','R','S','T','U','V','W','X','Y','Z','&','@','#','+','/','•','J','Q'];
  const hues = [214, 232, 256, 276, 300, 340, 8, 24, 190, 168];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = Math.max(Math.abs(r - cy), Math.abs(c - cx));
      const isCenter = r === cy && c === cx;
      const fade = Math.max(0.1, 0.5 - d * 0.11);
      const seed = (r * cols + c) * 7;
      const h1 = hues[seed % hues.length];
      const h2 = (h1 + 34) % 360;
      const char = isCenter ? '' : glyphs[(seed + r * 3) % glyphs.length];
      const tile = document.createElement('div');
      tile.className = 'intro-tile' + (isCenter ? ' is-center' : '');
      tile.textContent = char;
      tile.style.background = `linear-gradient(145deg, hsl(${h1} 62% 56% / ${fade}), hsl(${h2} 58% 42% / ${fade}))`;
      tile.style.color = `rgba(255,255,255,${fade * 0.85})`;
      tile.style.filter = `blur(${(d * 0.7).toFixed(2)}px) saturate(0.8)`;
      tile.style.animationDelay = `${(0.04 * d + 0.02 * c).toFixed(2)}s`;
      if (isCenter) tile.style.animation = 'none';
      tilesEl.appendChild(tile);
    }
  }

  function setPhase(p) {
    hero.dataset.phase = String(p);
    hTile.classList.toggle('is-pressed', p === 2);
  }

  let skip = false;
  try { skip = sessionStorage.getItem('introPlayed') === '1'; } catch (e) {}

  if (skip || reduceMotion) {
    hero.classList.add('intro-skipped');
    setPhase(4);
    nav.classList.add('is-visible');
    try { sessionStorage.setItem('introPlayed', '1'); } catch (e) {}
    return;
  }

  document.documentElement.classList.add('intro-lock');
  document.body.classList.add('intro-lock', 'intro-active');
  window.scrollTo(0, 0);

  setTimeout(() => setPhase(1), 500);
  setTimeout(() => setPhase(2), 1900);
  setTimeout(() => setPhase(3), 2120);
  setTimeout(() => { setPhase(4); nav.classList.add('is-visible'); }, 2750);
  setTimeout(() => {
    document.documentElement.classList.remove('intro-lock');
    document.body.classList.remove('intro-lock', 'intro-active');
    try { sessionStorage.setItem('introPlayed', '1'); } catch (e) {}
  }, 3500);
})();

/* ══════════════ SELECTED WORKS — hover preview ══════════════ */
(function initWorks() {
  const section = document.getElementById('works');
  if (!section) return;
  const rows = section.querySelectorAll('.work-row');
  const preview = document.getElementById('workPreview');
  const previewSlots = preview.querySelectorAll('.work-preview-inner [data-idx]');
  const detailLabel = document.getElementById('detailLabel');
  const detailRole = document.getElementById('detailRole');
  const detailDesc = document.getElementById('detailDesc');
  const detailTags = document.getElementById('detailTags');
  const detailIndex = document.getElementById('detailIndex');

  const WORKS = [
    { name: 'CRM', role: 'Design', desc: '서비스 전반 UI/UX 디자인 — 개선 및 신규 기능 설계', tags: ['UX/UI', 'FLOW', 'DESIGN SYSTEM'] },
    { name: 'CRM Admin', role: 'Admin Design', desc: '관리자 페이지 전체 디자인 및 퍼블리싱', tags: ['UI', 'PUBLISHING', 'TABLE UX'] },
    { name: 'App', role: 'App Design', desc: '트레이드잇 신규 상품 앱 디자인 — 출시 전, 디자인 완료 단계', tags: ['MOBILE', 'UI', 'PROTOTYPE'] },
    { name: 'Marketing', role: '마케팅 지원 디자인', desc: 'SNS 콘텐츠 · 배너 · 브로슈어 · 인쇄물 디자인', tags: ['SNS', 'BANNER', 'LANDING'] }
  ];

  let hoverIdx = -1;

  function setHover(idx) {
    hoverIdx = idx;
    const d = WORKS[idx] || null;

    rows.forEach(row => row.classList.toggle('is-active', Number(row.dataset.idx) === idx));

    detailLabel.textContent = d ? d.name.toUpperCase() : 'HOVER A PROJECT';
    detailRole.textContent = d ? d.role : '';
    detailRole.classList.toggle('has-hover', !!d);
    detailDesc.textContent = d ? d.desc : '리스트를 올려보면 각 프로젝트의 미리보기와 상세가 표시됩니다.';

    detailTags.innerHTML = '';
    (d ? d.tags : ['UX/UI', 'PUBLISHING', 'DESIGN SYSTEM']).forEach(t => {
      const span = document.createElement('span');
      span.textContent = t;
      detailTags.appendChild(span);
    });
    detailIndex.textContent = (d ? String(idx + 1).padStart(2, '0') : '—') + ' / 04';

    previewSlots.forEach(el => el.toggleAttribute('data-active', Number(el.dataset.idx) === idx));
    preview.classList.toggle('is-on', !!d);
  }

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => setHover(Number(row.dataset.idx)));
  });
  section.addEventListener('mouseleave', () => setHover(-1));

  section.addEventListener('mousemove', e => {
    if (hoverIdx < 0) return;
    const r = section.getBoundingClientRect();
    const smx = e.clientX - r.left, smy = e.clientY - r.top;
    const sw = r.width, sh = r.height;
    const isApp = hoverIdx === 2;
    const pw = isApp ? Math.min(230, Math.max(160, sw * 0.15)) : Math.min(380, Math.max(240, sw * 0.24));
    const ph = isApp ? pw * 1.9 : pw * 0.7;
    let px = smx + 26;
    if (px + pw > sw - 24) px = smx - pw - 26;
    px = Math.max(24, Math.min(px, sw - pw - 24));
    const py = Math.max(24, Math.min(smy - ph * 0.5, sh - ph - 24));
    preview.style.width = pw + 'px';
    preview.style.height = ph + 'px';
    preview.style.transform = `translate(${px}px,${py}px) rotate(-3deg) scale(1)`;
  });
})();

/* ══════════════ CONTACT — reveal on scroll-into-view ══════════════ */
(function initContact() {
  const section = document.getElementById('contact');
  if (!section) return;
  let seen = false;

  const reveal = () => {
    if (seen) return;
    seen = true;
    section.classList.add('is-seen');
    setTimeout(() => section.classList.add('is-dismissed'), 1400);
  };

  if (!('IntersectionObserver' in window)) { reveal(); return; }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal();
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });
  io.observe(section);
})();
