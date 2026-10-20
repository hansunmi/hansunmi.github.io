/* 이음 공통 동작 — 공통 크롬(PC 헤더 · 모바일 하단 탭), 바텀시트 · 알림창, 토글, 탭, 데이터 로드
   스타일 값은 넣지 않고 클래스 · aria 속성만 바꾼다 */
(function () {
  'use strict';

  /* ---------- 아이콘 (reference HTML의 SVG 그대로) ---------- */
  const icon = {
    bell: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#24252B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"></path><path d="M10 20a2 2 0 0 0 4 0"></path></svg>`,
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#24252B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>',
    chevronRight: (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>`,
    chevronLeft: (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>`,
    tabExplore: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="M20 20l-4.5-4.5"></path></svg>',
    tabMy: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-linecap="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M4 10h16M9 3v4M15 3v4"></path></svg>',
    tabAfter: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg>',
    tabMe: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 4.5-5 8-5s6.5 1 8 5"></path></svg>',
  };

  /* 로고 심볼 (2.4) — 끊김 구간은 .c-logo__gap, 색은 CSS 변수 --logo-bg */
  const logo = (w, h) => `<svg class="c-logo" width="${w}" height="${h}" viewBox="0 0 340 212" role="img" aria-label="이음 로고"><circle cx="134" cy="106" r="60" fill="none" stroke="#2F3B63" stroke-width="20"></circle><path class="c-logo__gap" d="M156.9 71.6 A60 60 0 0 1 187.5 48.9" fill="none" stroke="#FFFFFF" stroke-width="36"></path><circle cx="206" cy="106" r="60" fill="none" stroke="#B5562F" stroke-width="20"></circle><path class="c-logo__gap" d="M183.1 140.4 A60 60 0 0 1 152.5 163.1" fill="none" stroke="#FFFFFF" stroke-width="36"></path><path d="M186.4 134.2 A60 60 0 0 1 149.5 164" fill="none" stroke="#2F3B63" stroke-width="20"></path></svg>`;

  /* 주 메뉴 — 마이는 모바일 하단 탭에만 두고, PC는 헤더 프로필 사진으로 들어간다 */
  const menus = [
    { key: 'explore', label: '탐색', href: 'index.html', tabIcon: icon.tabExplore },
    { key: 'my', label: '내 소개팅', href: 'my.html', tabIcon: icon.tabMy },
    { key: 'after', label: '애프터', href: 'after.html', tabIcon: icon.tabAfter },
    { key: 'me', label: '마이', href: 'mypage.html', tabIcon: icon.tabMe, pc: false },
  ];

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* 알림 버튼 — data-bell="new"면 점 표시. PC에서는 페이지 이동 대신 알림 팝업(S14-PC)을 띄운다 */
  const bellLink = (hasNew, size) => hasNew
    ? `<a class="c-icon-btn" href="notifications.html" data-notify aria-haspopup="dialog" aria-label="알림, 새 알림 있음">${icon.bell(size)}<span class="c-icon-btn__dot"></span></a>`
    : `<a class="c-icon-btn" href="notifications.html" data-notify aria-haspopup="dialog" aria-label="알림">${icon.bell(size)}</a>`;

  /* ---------- PC 헤더: <header data-pc-header data-current="explore" data-after-count="2" data-bell="new"> ----------
     data-current-when="id=it:my" — 쿼리가 id=it이면 현재 메뉴를 my로 (한 파일에 여러 화면이 있을 때) */
  function renderPcHeader(el) {
    const d = el.dataset;
    let currentKey = d.current;
    if (d.currentWhen) {
      const [cond, key] = d.currentWhen.split(':');
      const [name, value] = cond.split('=');
      if (param(name) === value) currentKey = key;
    }
    const nav = menus.filter((m) => m.pc !== false).map((m) => {
      const current = m.key === currentKey ? ' aria-current="page"' : '';
      const count = m.key === 'after' && d.afterCount ? `<span class="c-count">${esc(d.afterCount)}</span>` : '';
      return `<a class="l-header__menu" href="${m.href}"${current}>${m.label}${count}</a>`;
    }).join('');
    const meCurrent = currentKey === 'me' ? ' aria-current="page"' : '';
    const profile = `<a class="l-header__profile" href="mypage.html"${meCurrent}><img class="c-avatar c-avatar--36" src="images/profile-me.jpg" alt="마이 페이지"></a>`;
    el.classList.add('l-header', 'l-only-pc');
    el.innerHTML = `<div class="l-header__inner">
      <div class="l-header__left">
        <a class="l-header__brand" href="index.html">${logo(40, 25)}<span class="c-wordmark c-wordmark--23">이음</span></a>
        <nav class="l-header__nav" aria-label="주 메뉴">${nav}</nav>
      </div>
      <div class="l-header__right">${bellLink(d.bell === 'new', 22)}${profile}</div>
    </div>`;
  }

  /* ---------- 모바일 하단 탭: <nav data-tabbar data-current="explore"> ---------- */
  function renderTabbar(el) {
    el.classList.add('l-tabbar', 'l-only-mobile');
    el.setAttribute('aria-label', '하단 메뉴');
    el.innerHTML = menus.map((m) => {
      const current = m.key === el.dataset.current ? ' aria-current="page"' : '';
      return `<a class="l-tabbar__item" href="${m.href}"${current}>${m.tabIcon}${m.label}</a>`;
    }).join('');
  }

  /* ---------- 모바일 홈 헤더 (로고 + 알림): <header data-m-home data-bell="new"> ---------- */
  function renderMobileHome(el) {
    el.classList.add('l-mhead', 'l-only-mobile');
    el.innerHTML = `<div class="l-mhead__brand">${logo(36, 22)}<span class="c-wordmark c-wordmark--21">이음</span></div>${bellLink(el.dataset.bell === 'new', 23)}`;
  }

  /* ---------- 바텀시트 · 알림창 ---------- */
  let lastFocus = null;

  function openLayer(layer) {
    if (!layer) return;
    // 시트 안에서 다른 알림창을 열면 앞의 시트는 닫는다 (한 번에 하나만)
    document.querySelectorAll('.c-dim.is-open').forEach((l) => { if (l !== layer) l.classList.remove('is-open'); });
    lastFocus = document.activeElement;
    layer.classList.add('is-open');
    layer.removeAttribute('hidden');
    const focusable = layer.querySelector('[autofocus], a[href], button, input, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeLayer(layer) {
    if (!layer) return;
    layer.classList.remove('is-open');
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- 알림 팝업 (S14-PC): 어느 화면이든 알림 버튼 아래에 뜬다 ---------- */
  const notifyHTML = `<div class="c-dim p-s14-pc-dim" id="ov-notify">
    <div class="p-cb p-s14-pc-31">
    <section role="dialog" aria-labelledby="s14-pc-nt" class="p-s14-pc-33">
    <div class="p-s14-pc-34"><h2 id="s14-pc-nt" class="p-s14-pc-35">알림</h2><button type="button" class="p-s14-pc-36">모두 읽음</button></div>
    <div class="p-s14-pc-37"><div role="tablist" aria-label="알림 종류" class="p-s14-pc-38"><span role="tab" aria-selected="true" class="p-s14-pc-39">전체</span><span role="tab" aria-selected="false" class="p-s14-pc-40">소개팅</span><span role="tab" aria-selected="false" class="p-s14-pc-40">애프터</span><span role="tab" aria-selected="false" class="p-s14-pc-40">계정</span></div></div>
    <div class="p-s14-pc-list">
    <span class="p-s14-pc-41">오늘</span>
    <a href="today.html?id=citypop" class="p-s14-pc-42"><span class="p-s14-pc-43"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"></path></svg></span><span class="p-s14-pc-44"><span class="p-s14-pc-45"><span class="p-s14-pc-46">당일</span><span class="p-s14-pc-47">18:30</span></span><span class="p-s14-pc-48">곧 시작해요, 도착하면 체크인해 주세요</span><span class="p-s14-pc-49">시티팝 로테이션 · 19:15까지 체크인</span></span><span aria-label="안 읽음" class="p-s14-pc-50"></span></a><a href="after-select.html?id=friwine" class="p-s14-pc-42"><span class="p-s14-pc-51"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg></span><span class="p-s14-pc-44"><span class="p-s14-pc-45"><span class="p-s14-pc-52">애프터</span><span class="p-s14-pc-47">17:30</span></span><span class="p-s14-pc-48">애프터 선택이 곧 마감돼요</span><span class="p-s14-pc-49">금요일 와인 로테이션 파티 · 1명 더 고를 수 있어요</span></span><span aria-label="안 읽음" class="p-s14-pc-50"></span></a><a href="chat.html?id=m1" class="p-s14-pc-53"><span class="p-s14-pc-51"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path></svg></span><span class="p-s14-pc-44"><span class="p-s14-pc-45"><span class="p-s14-pc-52">메시지</span><span class="p-s14-pc-47">13:02</span></span><span class="p-s14-pc-54">새 메시지가 왔어요</span><span class="p-s14-pc-49">김도현 · 가을 피크닉 로테이션</span></span></a>
    <span class="p-s14-pc-41">이번 주</span>
    <a href="apply.html?id=book&amp;step=3" class="p-s14-pc-53"><span class="p-s14-pc-51"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg></span><span class="p-s14-pc-44"><span class="p-s14-pc-45"><span class="p-s14-pc-52">대기</span><span class="p-s14-pc-47">10.30</span></span><span class="p-s14-pc-54">자리가 났어요, 1시간 안에 결제해 주세요</span><span class="p-s14-pc-49">금요일 저녁, 차분한 로테이션 · 대기 1번 차례</span><span class="p-s14-pc-55">카카오톡으로도 보냈어요</span></span></a><a href="participants.html?id=it" class="p-s14-pc-53"><span class="p-s14-pc-43"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg></span><span class="p-s14-pc-44"><span class="p-s14-pc-45"><span class="p-s14-pc-46">열람</span><span class="p-s14-pc-47">10.29</span></span><span class="p-s14-pc-54">박○○님이 내 상세 정보를 열람했어요</span><span class="p-s14-pc-49">IT 업계 로테이션 소개팅 참가자</span></span></a>
    </div>
    <a href="notifications.html" class="p-s14-pc-56">알림 전체 보기</a>
    </section>
    </div>
  </div>`;

  let notifyBell = null;

  /* 누른 알림 버튼 바로 아래에 팝업 위치를 맞춘다 */
  function placeNotify() {
    const layer = document.getElementById('ov-notify');
    if (!layer || !notifyBell || !layer.classList.contains('is-open')) return;
    const panel = layer.querySelector('.p-s14-pc-31');
    const rect = notifyBell.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const top = Math.max(rect.bottom + 4, 16);
    const right = Math.max(24, window.innerWidth - center - 72);
    panel.style.top = top + 'px';
    panel.style.right = right + 'px';
    panel.style.maxHeight = (window.innerHeight - top - 24) + 'px';
  }

  function openNotify(bell) {
    let layer = document.getElementById('ov-notify');
    if (!layer) {
      document.body.insertAdjacentHTML('beforeend', notifyHTML);
      layer = document.getElementById('ov-notify');
    }
    notifyBell = bell;
    openLayer(layer);
    placeNotify();
  }

  window.addEventListener('resize', () => {
    const layer = document.getElementById('ov-notify');
    if (layer && layer.classList.contains('is-open') && !isPc()) closeLayer(layer);
    else placeNotify();
  });
  window.addEventListener('scroll', placeNotify, { passive: true });

  document.addEventListener('click', (e) => {
    const bell = e.target.closest('[data-notify]');
    if (bell && isPc()) {
      e.preventDefault();
      openNotify(bell);
      return;
    }
    const opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      openLayer(document.querySelector(opener.dataset.open));
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      e.preventDefault();
      closeLayer(closer.closest('.c-dim'));
      return;
    }
    // 딤 바깥 클릭으로 닫기
    if (e.target.classList && e.target.classList.contains('c-dim')) closeLayer(e.target);

    // aria-pressed 토글 버튼
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      const pressed = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!pressed));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.c-dim.is-open').forEach(closeLayer);
  });

  /* ---------- 탭 (role="tablist") ---------- */
  function initTabs(list) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    };
    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab && !tab.getAttribute('href')) select(tab);
    });
    list.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length]
        : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
      if (next) { next.focus(); select(next); }
    });
  }

  /* ---------- 데이터 ---------- */
  const param = (name) => new URLSearchParams(location.search).get(name);

  async function loadJSON(name) {
    const res = await fetch(`data/${name}.json`);
    if (!res.ok) throw new Error(`data/${name}.json ${res.status}`);
    return res.json();
  }

  const isPc = () => window.matchMedia('(min-width: 1024px)').matches;

  /* 자리표시자(D) 치환값 — 시안의 [참가비]. 실제 가격이 정해지면 여기만 바꾼다 (임시값) */
  const FEE = '39,000원';

  /* ---------- 상태별 화면: data-when="step=2" — 쿼리 값과 맞는 것만 보이고, 없으면 data-default ---------- */
  function applyVariants() {
    const groups = {};
    document.querySelectorAll('[data-when]').forEach((el) => {
      const [key, value] = el.dataset.when.split('=');
      (groups[key] = groups[key] || []).push({ el, value });
    });
    Object.entries(groups).forEach(([key, items]) => {
      const v = param(key);
      const hit = items.some((i) => i.value === v);
      items.forEach((i) => {
        const show = hit ? i.value === v : i.el.hasAttribute('data-default');
        i.el.classList.toggle('u-hidden', !show);
      });
    });
  }

  /* ---------- 크레딧 — 잔액은 목업이라 이 탭(sessionStorage)에만 남는다 ----------
     [data-credit-value]는 숫자를 자동으로 채우고, [data-credit-charge]를 누르면 충전 팝업이 뜬다 */
  const CREDIT_KEY = 'ieum-credit';
  const CREDIT_START = 5;
  const credit = {
    get() {
      try {
        const v = sessionStorage.getItem(CREDIT_KEY);
        if (v !== null && !Number.isNaN(Number(v))) return Number(v);
      } catch (e) { /* 저장소를 못 쓰면 기본값 */ }
      return CREDIT_START;
    },
    set(n) {
      try { sessionStorage.setItem(CREDIT_KEY, String(n)); } catch (e) { /* 화면만 갱신 */ }
      renderCredit();
      document.dispatchEvent(new CustomEvent('ieum:credit', { detail: n }));
    },
  };
  function renderCredit() {
    document.querySelectorAll('[data-credit-value]').forEach((el) => { el.textContent = credit.get(); });
  }

  const PACKS = [
    { amount: 1, price: 1000 },
    { amount: 5, price: 4500, save: '10% 할인' },
    { amount: 10, price: 8000, save: '20% 할인', best: true },
  ];
  const won = (n) => `${n.toLocaleString('ko-KR')}원`;
  const chargeHTML = () => `<div class="c-dim" id="ov-credit">
    <form class="c-sheet p-cr" role="dialog" aria-modal="true" aria-labelledby="ov-credit-t">
      <span class="c-sheet__handle" aria-hidden="true"></span>
      <div class="p-cr__choose">
        <header class="p-cr__head">
          <div>
            <h2 class="p-cr__title" id="ov-credit-t">크레딧 충전</h2>
            <p class="p-cr__now">지금 <b data-credit-value>${credit.get()}</b> 크레딧</p>
          </div>
          <button type="button" class="c-icon-btn" data-close aria-label="닫기"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#24252B" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
        </header>
        <div class="p-cr__packs" role="radiogroup" aria-label="충전할 크레딧">
          ${PACKS.map((p) => `<label class="p-cr__pack">
            <input type="radio" name="credit-pack" value="${p.amount}"${p.amount === 5 ? ' checked' : ''}>
            <span class="p-cr__amount"><b>${p.amount}</b> 크레딧</span>
            ${p.save ? `<span class="p-cr__save${p.best ? ' p-cr__save--best' : ''}">${p.save}</span>` : ''}
            <span class="p-cr__price">${won(p.price)}</span>
          </label>`).join('')}
        </div>
        <p class="p-cr__note">1크레딧으로 참가자 한 명의 지역 · 직업 · 취미를 열람할 수 있어요. 쓰지 않은 크레딧은 7일 안에 환불돼요.</p>
        <button type="submit" class="c-btn c-btn--primary c-btn--52 c-btn--block"><span data-credit-pay>${won(4500)} 결제하기</span></button>
      </div>
      <div class="p-cr__done" hidden>
        <span class="p-cr__done-icon" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"></path></svg></span>
        <h2 class="p-cr__done-title" data-credit-done-title>크레딧을 충전했어요</h2>
        <p class="p-cr__now">지금 <b data-credit-value>${credit.get()}</b> 크레딧</p>
        <button type="button" class="c-btn c-btn--primary c-btn--52 c-btn--block" data-close>확인</button>
      </div>
    </form>
  </div>`;

  function openCharge() {
    let layer = document.getElementById('ov-credit');
    if (!layer) {
      document.body.insertAdjacentHTML('beforeend', chargeHTML());
      layer = document.getElementById('ov-credit');
      const form = layer.querySelector('form');
      const pick = () => PACKS.find((p) => p.amount === Number(form.querySelector('input:checked').value));
      form.addEventListener('change', () => { form.querySelector('[data-credit-pay]').textContent = `${won(pick().price)} 결제하기`; });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const p = pick();
        credit.set(credit.get() + p.amount);
        form.querySelector('[data-credit-done-title]').textContent = `${p.amount} 크레딧을 충전했어요`;
        form.querySelector('.p-cr__choose').hidden = true;
        form.querySelector('.p-cr__done').hidden = false;
        form.querySelector('.p-cr__done [data-close]').focus();
      });
    }
    // 열 때마다 고르는 화면부터
    layer.querySelector('.p-cr__choose').hidden = false;
    layer.querySelector('.p-cr__done').hidden = true;
    renderCredit();
    openLayer(layer);
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-credit-charge]');
    if (!opener) return;
    e.preventDefault();
    openCharge();
  });

  /* ---------- 시작 ---------- */
  function init() {
    renderCredit();
    applyVariants();
    // ?open=alert-login → #ov-alert-login 열기 (알림창 · 시트 시연용)
    const open = param('open');
    if (open && document.getElementById('ov-' + open)) openLayer(document.getElementById('ov-' + open));
    document.querySelectorAll('[data-pc-header]').forEach(renderPcHeader);
    document.querySelectorAll('[data-tabbar]').forEach(renderTabbar);
    document.querySelectorAll('[data-m-home]').forEach(renderMobileHome);
    document.querySelectorAll('[role="tablist"]').forEach(initTabs);
  }

  window.IEUM = { esc, icon, logo, param, loadJSON, isPc, openLayer, closeLayer, FEE, credit, openCharge };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
