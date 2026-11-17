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

  // 실제 새로고침(F5, 주소창 엔터 등)일 때는 세션 플래그를 무시하고 항상 다시 재생.
  // 내부 링크 클릭(뒤로가기/목록 버튼 등)으로 들어온 경우에는 이 값이 'reload'가 아니므로
  // 아래 sessionStorage 스킵 로직이 그대로 적용된다.
  let isReload = false;
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length) {
      isReload = navEntries[0].type === 'reload';
    } else if (performance.navigation) {
      isReload = performance.navigation.type === 1;
    }
  } catch (e) {}

  let skip = false;
  try { skip = !isReload && sessionStorage.getItem('introPlayed') === '1'; } catch (e) {}

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
    { name: 'CRM', role: 'Design', desc: '신규 B2B SaaS 0→1 — 영업 흐름 설계부터 React 퍼블리싱까지', tags: ['UX/UI', 'FLOW', 'DESIGN SYSTEM'] },
    { name: 'CRM Admin', role: 'Admin Design', desc: '관리자 페이지 전체 디자인 및 퍼블리싱', tags: ['UI', 'PUBLISHING', 'TABLE UX'] },
    { name: 'App', role: 'App Design', desc: '트레이드잇 B2B 명함 앱 X4 디자인 — iOS · Android 출시', tags: ['MOBILE', 'UI', 'MOTION'] },
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

  // 터치 기기(모바일 · 태블릿)는 미리보기 없이 눌러서 바로 이동
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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

/* ── 개인 프로젝트 가로 레일: 화살표 · 드래그 · 현재 번호 ── */
(() => {
  const rail = document.getElementById('personalRail');
  if (!rail) return;
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const count = document.getElementById('railCount');
  const cards = Array.from(rail.querySelectorAll('.personal-card'));
  const total = String(cards.length).padStart(2, '0');

  const step = () => {
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  };
  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth - 2;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max;
    const idx = rail.scrollLeft >= max ? cards.length - 1 : Math.round(rail.scrollLeft / step());
    count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + total;
  };
  prev.addEventListener('click', () => rail.scrollBy({ left: -step() }));
  next.addEventListener('click', () => rail.scrollBy({ left: step() }));
  rail.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); rail.scrollBy({ left: step() }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); rail.scrollBy({ left: -step() }); }
  });

  // 마우스로 끌어서 넘기기. 조금이라도 끌었으면 카드 클릭으로 처리하지 않는다.
  let down = false, moved = false, startX = 0, startLeft = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; rail.classList.add('is-dragging'); }
    if (moved) rail.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    if (moved) {
      rail.classList.remove('is-dragging');
      const i = Math.round(rail.scrollLeft / step());
      rail.scrollTo({ left: i * step() });
    }
  });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  rail.addEventListener('dragstart', (e) => e.preventDefault());

  update();
})();
