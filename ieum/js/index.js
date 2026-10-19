/* S01 소개팅 탐색 — 전체 소개팅 카드 · PC 테마 카드 렌더링 */
(async function () {
  'use strict';
  const { esc, loadJSON, FEE } = window.IEUM;

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

  const [mobile, pc] = await Promise.all([loadJSON('S01-Mobile'), loadJSON('S01-PC')]);
  document.getElementById('list-mobile').innerHTML = mobile.cards.map(card).join('');
  document.getElementById('list-pc').innerHTML = pc.cards.map(card).join('');
  document.getElementById('themes-pc').innerHTML = pc.themes.map(theme).join('');
})();
