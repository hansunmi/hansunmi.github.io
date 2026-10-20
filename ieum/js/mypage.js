/* 마이 — 열람 기록 숫자를 참가자 명단 · 열람 기록 페이지와 같은 기준으로 센다
   (data/participants.json의 viewed · viewedMe + 이 탭에서 새로 연 사람) */
(async function () {
  'use strict';
  const { loadJSON } = window.IEUM;

  const data = await loadJSON('participants');
  let sessionViewed = {};
  try { sessionViewed = (JSON.parse(sessionStorage.getItem('ieum-participants')) || {}).viewed || {}; } catch (e) { /* 기본값 */ }

  const mine = new Set([
    ...data.people.filter((p) => p.viewed && !p.me).map((p) => p.id),
    ...Object.keys(sessionViewed),
  ]);
  const counts = { me: data.viewedMe.length, mine: mine.size };
  document.querySelectorAll('[data-view-count]').forEach((el) => { el.textContent = counts[el.dataset.viewCount]; });
})();
