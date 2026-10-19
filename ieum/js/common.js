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

  /* 주 메뉴 — 마이 탭은 시안 범위 밖(6.2)이라 # */
  const menus = [
    { key: 'explore', label: '탐색', href: 'index.html', tabIcon: icon.tabExplore },
    { key: 'my', label: '내 소개팅', href: 'my.html', tabIcon: icon.tabMy },
    { key: 'after', label: '애프터', href: 'after.html', tabIcon: icon.tabAfter },
    { key: 'me', label: '마이', href: '#', tabIcon: icon.tabMe },
  ];

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* 알림 버튼 — data-bell="new"면 점 표시 */
  const bellLink = (hasNew, size) => hasNew
    ? `<a class="c-icon-btn" href="notifications.html" aria-label="알림, 새 알림 있음">${icon.bell(size)}<span class="c-icon-btn__dot"></span></a>`
    : `<a class="c-icon-btn" href="notifications.html" aria-label="알림">${icon.bell(size)}</a>`;

  /* ---------- PC 헤더: <header data-pc-header data-current="explore" data-after-count="2" data-bell="new" data-profile="empty"> ---------- */
  function renderPcHeader(el) {
    const d = el.dataset;
    const nav = menus.map((m) => {
      const current = m.key === d.current ? ' aria-current="page"' : '';
      const count = m.key === 'after' && d.afterCount ? `<span class="c-count">${esc(d.afterCount)}</span>` : '';
      return `<a class="l-header__menu" href="${m.href}"${current}>${m.label}${count}</a>`;
    }).join('');
    const profile = d.profile === 'empty'
      ? '<span class="c-avatar c-avatar--36 c-avatar--placeholder" aria-hidden="true"></span>'
      : '<img class="c-avatar c-avatar--36" src="images/profile-me.jpg" alt="내 프로필">';
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

  document.addEventListener('click', (e) => {
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

  /* ---------- 시작 ---------- */
  function init() {
    applyVariants();
    // ?open=alert-login → #ov-alert-login 열기 (알림창 · 시트 시연용)
    const open = param('open');
    if (open && document.getElementById('ov-' + open)) openLayer(document.getElementById('ov-' + open));
    document.querySelectorAll('[data-pc-header]').forEach(renderPcHeader);
    document.querySelectorAll('[data-tabbar]').forEach(renderTabbar);
    document.querySelectorAll('[data-m-home]').forEach(renderMobileHome);
    document.querySelectorAll('[role="tablist"]').forEach(initTabs);
  }

  window.IEUM = { esc, icon, logo, param, loadJSON, isPc, openLayer, closeLayer, FEE };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
