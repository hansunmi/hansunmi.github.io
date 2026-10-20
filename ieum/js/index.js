/* S01 소개팅 탐색 — 전체 소개팅 카드 · PC 테마 카드 렌더링 */
(async function () {
  'use strict';
  const { esc, loadJSON, param, FEE, openLayer, closeLayer } = window.IEUM;

  /* 카드 상태(kind) → 배지 수정자 */
  const badgeClass = { mine: 'p-s01-card__badge--mine', urgent: 'p-s01-card__badge--urgent' };

  function card(c) {
    const badge = c.hasBadge
      ? `<span class="p-s01-card__badge ${badgeClass[c.kind] || ''}">${esc(c.badge)}</span>` : '';
    const age = c.age ? `<span class="p-s01-card__age">${esc(c.age)}</span>` : '';
    const ineligible = c.ineligible ? '<span class="p-s01-card__warn">나이 조건이 맞지 않아요</span>' : '';
    return `<a class="p-s01-card${c.ineligible ? ' is-ineligible' : ''}" href="event.html?id=${esc(c.id)}">
      <span class="p-s01-card__media">
        <img src="${esc(c.img)}" alt="">
        <span class="p-s01-card__dim"></span>
        ${badge}
      </span>
      <span class="p-s01-card__body">
        <span class="p-s01-card__tag">${esc(c.tag)} · ${esc(c.size)}</span>
        <span class="p-s01-card__title">${esc(c.title)}</span>
        <span class="p-s01-card__meta">${esc(c.meta)}</span>
        ${age}
        ${ineligible}
        <span class="p-s01-card__foot">
          <span class="p-s01-card__fee">${esc(FEE)}</span>
          <span class="p-s01-card__seats${c.seatHot ? ' is-hot' : ''}">${esc(c.seats)}</span>
        </span>
      </span>
    </a>`;
  }

  function theme(t) {
    return `<a class="p-s01-theme" href="#">
      <span class="p-s01-theme__title">${esc(t.title)}</span>
      <span class="p-s01-theme__desc">${esc(t.desc)}</span>
      <span class="p-s01-theme__photo"><img src="${esc(t.img)}" alt=""></span>
    </a>`;
  }

  /* ---------- 곧 마감되는 소개팅 캐러셀 (모바일 · PC 공통 상태) ----------
     슬라이드 i가 대표 아치 카드, i+1이 옆 카드, i+2가 흐린 카드. 5개가 돌아가며 자동으로 넘어간다 (임시 목업 값) */
  const slides = [
    { id: 'book', img: 'images/photo-book.jpg', title: '이런 책 어때요?\n북클럽 로테이션', name: '북클럽 로테이션', date: '11.09 (일) 16:00', area: '마포구', seat: '여 1자리 남음', rate: '95%' },
    { id: 'wine', img: 'images/photo-wine.jpg', title: '토요일 밤,\n와인 파티', name: '토요일 와인 파티', date: '11.15 (토) 19:00', area: '성동구', seat: '남 2자리 남음', rate: '92%' },
    { id: 'film', img: 'images/photo-film-camera.jpg', title: '이런 사진 어때요?\n필름카메라 로테이션', name: '필름카메라 로테이션', date: '11.08 (토) 15:00', area: '성동구', seat: '여 1자리 남음', rate: '94%' },
    { id: 'calm', img: 'images/photo-candle.jpg', title: '금요일 저녁,\n차분한 로테이션', name: '차분한 로테이션', date: '11.14 (금) 19:30', area: '강남구', seat: '남 1자리 남음', rate: '96%' },
    { id: 'jazz', img: 'images/photo-piano.jpg', title: '이런 음악 어때요?\n재즈 로테이션', name: '재즈 로테이션', date: '11.16 (일) 17:00', area: '종로구', seat: '여 2자리 남음', rate: '88%' },
  ];
  const AUTOPLAY_MS = 5000;
  const pad = (n) => String(n).padStart(2, '0');

  const arch = (s, pc) => `<a class="p-s01-arch${pc ? ' p-s01-arch--pc' : ''}" href="event.html?id=${esc(s.id)}">
      <img src="${esc(s.img)}" alt="">
      <span class="p-s01-arch__dim${pc ? ' p-s01-arch__dim--flat' : ''}"></span>
      <span class="p-s01-arch__text">
        <span class="p-s01-arch__title">${esc(s.title).replace('\n', '<br>')}</span>
        <span class="p-s01-arch__meta">${esc(s.date)} · ${esc(s.area)}</span>
      </span>
      <span class="p-s01-arch__seat">${esc(s.seat)}</span>
    </a>`;
  const peek = (s, pc) => `<a class="p-s01-peek${pc ? ' p-s01-peek--pc' : ''}" href="event.html?id=${esc(s.id)}">
      <img src="${esc(s.img)}" alt="">
      <span class="p-s01-peek__dim"></span>
      <span class="p-s01-peek__text">
        <span class="p-s01-peek__title">${esc(s.name)}</span>
        <span class="p-s01-peek__meta">${pc ? esc(s.date) + ' · ' : ''}신청률 ${esc(s.rate)}</span>
      </span>
    </a>`;
  const ghost = (s, pc) => `<span class="p-s01-peek${pc ? ' p-s01-peek--pc' : ''} p-s01-peek--ghost" aria-hidden="true"><img src="${esc(s.img)}" alt=""></span>`;

  const roots = [...document.querySelectorAll('[data-carousel]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let paused = false; // 사용자가 일시정지 버튼으로 멈춤
  let held = false; // 마우스 오버 · 포커스 중 잠시 멈춤
  let timer = null;

  function render(dir) {
    const at = (k) => slides[(current + k) % slides.length];
    roots.forEach((root) => {
      const pc = root.dataset.carousel === 'pc';
      const track = root.querySelector('[data-carousel-track]');
      track.innerHTML = arch(at(0), pc) + peek(at(1), pc) + ghost(at(2), pc);
      track.classList.remove('is-slide-next', 'is-slide-prev');
      if (dir && !reduceMotion) track.classList.add(dir > 0 ? 'is-slide-next' : 'is-slide-prev');
      root.querySelectorAll('[data-carousel-now]').forEach((el) => { el.textContent = pad(current + 1); });
      root.querySelectorAll('[data-carousel-total]').forEach((el) => { el.textContent = pad(slides.length); });
      const more = root.querySelector('[data-carousel-more]');
      if (more) more.href = `event.html?id=${at(0).id}`;
    });
  }

  /* 진행 막대: 자동 넘김 시간만큼 차오른다 */
  function restartProgress() {
    roots.forEach((root) => {
      const bar = root.querySelector('[data-carousel-progress]');
      if (!bar) return;
      bar.classList.remove('is-running');
      void bar.offsetWidth;
      if (!paused && !held) {
        bar.style.animationDuration = AUTOPLAY_MS + 'ms';
        bar.classList.add('is-running');
      }
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (!paused && !held) timer = setTimeout(() => go(1), AUTOPLAY_MS);
    restartProgress();
  }

  function go(dir) {
    current = (current + dir + slides.length) % slides.length;
    render(dir);
    schedule();
  }

  function setPaused(value) {
    paused = value;
    roots.forEach((root) => {
      const btn = root.querySelector('[data-carousel-pause]');
      if (!btn) return;
      btn.setAttribute('aria-label', paused ? '자동 넘김 재생' : '자동 넘김 일시정지');
      btn.innerHTML = paused
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#24252B" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"></path></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#24252B" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6v12M15 6v12"></path></svg>';
    });
    schedule();
  }

  roots.forEach((root) => {
    root.querySelector('[data-carousel-prev]').addEventListener('click', () => go(-1));
    root.querySelector('[data-carousel-next]').addEventListener('click', () => go(1));
    const pause = root.querySelector('[data-carousel-pause]');
    if (pause) pause.addEventListener('click', () => setPaused(!paused));

    // 카드 위에 마우스를 올리거나 카드에 포커스가 있으면 잠시 멈춤
    const track = root.querySelector('[data-carousel-track]');
    const hold = (v) => { held = v; schedule(); };
    track.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) hold(true); });
    track.addEventListener('mouseleave', () => hold(false));
    track.addEventListener('focusin', () => hold(true));
    track.addEventListener('focusout', (e) => { if (!track.contains(e.relatedTarget)) hold(false); });

    // 모바일: 좌우 스와이프
    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });
  });

  // 다른 탭으로 가면 멈췄다가 돌아오면 다시
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else schedule();
  });

  render(0);
  schedule();

  /* ---------- 전체 소개팅: 리스트 / 달력 전환 (위 콘텐츠는 그대로, ?view=calendar로 기억) ---------- */
  function setView(view) {
    document.querySelectorAll('[data-view]').forEach((el) => { el.hidden = el.dataset.view !== view; });
    document.querySelectorAll('[data-view-btn]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.viewBtn === view));
    });
    const url = new URL(location.href);
    if (view === 'calendar') url.searchParams.set('view', 'calendar');
    else url.searchParams.delete('view');
    history.replaceState(null, '', url);
  }

  document.querySelectorAll('[data-view-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.dataset.viewBtn));
  });
  if (param('view') === 'calendar') setView('calendar');

  /* ---------- 전체 소개팅: 필터 (팝업 · 적용된 태그 · 초기화) ----------
     목록을 실제로 거르지는 않는 목업 — 팝업에서 고른 값이 '적용하기'로 태그가 되고,
     태그 ×(하나 빼기) · 초기화(모두 빼기) · '필터 N' 숫자가 함께 움직인다 */
  const DEFAULT_FILTER = { period: '이번 주', regions: ['서울'], size: '20~30명', themes: [], age: false };
  const AGE_LABEL = '내 나이 조건';
  const empty = () => ({ period: null, regions: [], size: null, themes: [], age: false });
  const clone = (f) => ({ ...f, regions: [...f.regions], themes: [...f.themes] });
  let filter = clone(DEFAULT_FILTER);
  let draft = clone(filter);

  /* 태그 순서: 날짜 → 지역 → 인원 → 테마 → 나이 */
  const tagsOf = (f) => [
    ...(f.period ? [{ key: 'period', value: f.period }] : []),
    ...f.regions.map((v) => ({ key: 'regions', value: v })),
    ...(f.size ? [{ key: 'size', value: f.size }] : []),
    ...f.themes.map((v) => ({ key: 'themes', value: v })),
    ...(f.age ? [{ key: 'age', value: AGE_LABEL }] : []),
  ];
  const without = (f, key, value) => {
    const next = clone(f);
    if (Array.isArray(next[key])) next[key] = next[key].filter((v) => v !== value);
    else next[key] = key === 'age' ? false : null;
    return next;
  };

  const xIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  const genderToggles = () => document.querySelectorAll('.p-s01-filters [data-toggle]');

  function renderFilters() {
    const tags = tagsOf(filter);
    const chips = tags.map((t) => `<button type="button" class="p-s01-filter-tag" data-filter-remove="${t.key}" data-filter-value="${esc(t.value)}" aria-label="${esc(t.value)} 필터 빼기">${esc(t.value)}${xIcon}</button>`).join('');
    document.querySelectorAll('[data-filter-chips]').forEach((el) => { el.innerHTML = chips; });
    document.querySelectorAll('[data-filter-count]').forEach((el) => { el.textContent = tags.length ? ` ${tags.length}` : ''; });
    const dirty = tags.length > 0 || [...genderToggles()].some((t) => t.getAttribute('aria-pressed') === 'true');
    document.querySelectorAll('[data-filter-reset]').forEach((el) => { el.hidden = !dirty; });
    document.querySelectorAll('[data-filter-applied]').forEach((el) => { el.hidden = !dirty; });
  }

  /* 팝업 안 — draft를 그린다 (닫으면 버려지고, 적용하기를 눌러야 filter가 된다) */
  const sheet = document.getElementById('ov-filter');
  const form = sheet.querySelector('[data-filter-form]');
  function renderDraft() {
    form.querySelectorAll('[data-filter-group]').forEach((group) => {
      const key = group.dataset.filterGroup;
      group.querySelectorAll('[data-value]').forEach((opt) => {
        const v = opt.dataset.value;
        const on = Array.isArray(draft[key]) ? draft[key].includes(v) : draft[key] === v;
        opt.setAttribute('aria-pressed', String(on));
      });
    });
    form.querySelector('[data-filter-age]').checked = draft.age;
    const n = tagsOf(draft).length;
    form.querySelector('[data-filter-apply-label]').textContent = n ? `필터 ${n}개 적용하기` : '적용하기';
  }

  form.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-value]');
    if (opt) {
      const group = opt.closest('[data-filter-group]');
      const key = group.dataset.filterGroup;
      const v = opt.dataset.value;
      if (group.hasAttribute('data-filter-single')) draft[key] = draft[key] === v ? null : v; // 한 번 더 누르면 해제
      else draft[key] = draft[key].includes(v) ? draft[key].filter((x) => x !== v) : [...draft[key], v];
      renderDraft();
      return;
    }
    if (e.target.closest('[data-filter-draft-reset]')) { draft = empty(); renderDraft(); }
  });
  form.querySelector('[data-filter-age]').addEventListener('change', (e) => { draft.age = e.target.checked; renderDraft(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    filter = clone(draft);
    renderFilters();
    closeLayer(sheet);
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-filter-open]')) {
      draft = clone(filter);
      renderDraft();
      openLayer(sheet);
      return;
    }
    const remove = e.target.closest('[data-filter-remove]');
    if (remove) {
      filter = without(filter, remove.dataset.filterRemove, remove.dataset.filterValue);
      renderFilters();
      return;
    }
    if (e.target.closest('[data-filter-reset]')) {
      filter = empty();
      genderToggles().forEach((t) => t.setAttribute('aria-pressed', 'false'));
      renderFilters();
      return;
    }
    // '내 성별 자리만' 토글(common.js가 aria-pressed를 바꾼 뒤) — 초기화 버튼 표시만 갱신
    if (e.target.closest('.p-s01-filters [data-toggle]')) renderFilters();
  });
  renderFilters();

  const [mobile, pc] = await Promise.all([loadJSON('S01-Mobile'), loadJSON('S01-PC')]);
  document.getElementById('list-mobile').innerHTML = mobile.cards.map(card).join('');
  document.getElementById('list-pc').innerHTML = pc.cards.map(card).join('');
  document.getElementById('themes-pc').innerHTML = pc.themes.map(theme).join('');
})();
