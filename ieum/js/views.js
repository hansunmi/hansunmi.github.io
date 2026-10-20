/* 열람 기록 — 내 정보를 열람한 사람(viewedMe) · 내가 열람한 사람(viewed + 이 탭에서 연 사람)
   참가자 명단(js/participants.js)과 같은 sessionStorage 열람 상태를 읽고 쓴다.
   PC: 줄을 누르면 오른쪽 상세 패널이 바뀌고, 안 연 사람은 패널에서 바로 1크레딧으로 열람
   모바일: 상세 화면(participant.html)으로 이동 · 안 연 사람은 참가자 명단의 열람 확인 창으로 */
(async function () {
  'use strict';
  const { esc, loadJSON, param, isPc, credit, openCharge } = window.IEUM;

  const data = await loadJSON('participants');
  const byId = Object.fromEntries(data.people.map((p) => [p.id, p]));
  const metBy = Object.fromEntries(data.viewedMe.map((v) => [v.id, v.at]));

  /* ---------- 열람 상태 ---------- */
  const KEY = 'ieum-participants';
  const readSaved = () => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  };
  const viewed = Object.assign(
    Object.fromEntries(data.people.filter((p) => p.viewed).map((p) => [p.id, p.viewed])),
    readSaved().viewed || {}
  );
  const today = () => {
    const d = new Date();
    return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`;
  };
  function unlock(id) {
    viewed[id] = today();
    const saved = readSaved();
    saved.viewed = Object.assign(saved.viewed || {}, { [id]: viewed[id] });
    try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* 화면만 갱신 */ }
  }

  // 'MM.DD' 또는 'MM.DD HH:MM' — 최근 순 정렬용
  const key = (at) => at.replace(/\D/g, '').padEnd(8, '0');

  /* ---------- 조각 ---------- */
  const coin = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v8M9.5 10.5h5"></path></svg>';
  const chev = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>';
  const lock = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';
  const check = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>';
  const photo = (p, cls) => p.photo
    ? `<img class="${cls}" src="${esc(p.photo)}" alt="">`
    : `<span class="${cls} p-pt-ph" aria-hidden="true">${esc(p.name.charAt(0))}</span>`;
  const genderAge = (p) => `${p.gender === 'm' ? '남성' : '여성'} · ${esc(p.age)}`;

  const who = (p, at) => `${photo(p, 'p-vw__photo')}
    <span class="p-vw__who">
      <span class="p-vw__name"><b>${esc(p.name)}</b><span>${genderAge(p)}</span></span>
      <span class="p-vw__quote">"${esc(p.quote)}"</span>
      <span class="p-vw__meta">${esc(at)} 열람</span>
    </span>`;

  /* ---------- 목록 ---------- */
  let selected = null;
  const sel = (id) => (id === selected ? ' is-selected' : '');

  function meRows() {
    return data.viewedMe
      .slice().sort((a, b) => key(b.at).localeCompare(key(a.at)))
      .map(({ id, at }) => {
        const p = byId[id];
        const action = viewed[id]
          ? `<a class="p-vw__action" href="participant.html?user=${id}" data-vw-pick="${id}">상세 보기${chev}</a>`
          : `<a class="p-vw__action p-vw__action--unlock" href="participants.html?user=${id}" data-vw-pick="${id}">${coin}나도 열람하기</a>`;
        return `<li class="p-vw__row${sel(id)}"><a class="p-vw__link" href="${viewed[id] ? 'participant.html' : 'participants.html'}?user=${id}" data-vw-pick="${id}">${who(p, at)}</a>${action}</li>`;
      });
  }
  const fresh = () => readSaved().viewed || {};
  const rank = ([id, at]) => (fresh()[id] ? '9' : '0') + key(at);
  function mineRows() {
    return Object.entries(viewed)
      .filter(([id]) => byId[id] && !byId[id].me)
      // 이 탭에서 방금 연 사람이 맨 위 (목업 날짜가 오늘보다 뒤라 날짜만으로는 아래로 밀린다)
      .sort((a, b) => rank(b).localeCompare(rank(a)))
      .map(([id, at]) => `<li class="p-vw__row${sel(id)}"><a class="p-vw__link" href="participant.html?user=${id}" data-vw-pick="${id}">${who(byId[id], at)}<span class="p-vw__go">${chev}</span></a></li>`);
  }

  /* ---------- PC 상세 ---------- */
  const detail = document.querySelector('[data-vw-detail]');
  function renderDetail() {
    const p = byId[selected];
    if (!p) { detail.innerHTML = '<p class="p-vw-d__empty">목록에서 사람을 고르면 여기에 보여요</p>'; return; }
    const open = Boolean(viewed[p.id]);
    const notes = [
      metBy[p.id] ? `<li>${esc(metBy[p.id])}에 내 정보를 열람했어요</li>` : '',
      open ? `<li>${esc(viewed[p.id])}에 내가 열람했어요</li>` : '',
    ].join('');
    const info = open
      ? `<dl class="p-vw-d__list">
          <div><dt>사는 곳</dt><dd>${esc(p.area.split(' ').slice(0, 2).join(' '))}</dd></div>
          <div><dt>취미</dt><dd>${p.hobbies.map(esc).join(' · ')}</dd></div>
          <div><dt>직업</dt><dd>${esc(p.job)}${p.verified ? `<span class="p-pt-verified">${check}직업 인증</span>` : ''}</dd></div>
        </dl>`
      : `<div class="p-vw-d__lock">
          <dl class="p-vw-d__list">
            <div><dt>사는 곳</dt><dd class="is-blur">서울 ○○구</dd></div>
            <div><dt>취미</dt><dd class="is-blur">○○ · ○○ · ○○</dd></div>
            <div><dt>직업</dt><dd class="is-blur">○○ · ○○</dd></div>
          </dl>
          <button type="button" class="c-btn c-btn--primary c-btn--48 c-btn--block" data-vw-unlock="${p.id}">${coin}1크레딧으로 열람하기</button>
          <p class="p-vw-d__hint">지금 크레딧 <b data-credit-value>${credit.get()}</b> · 열람하면 ${esc(p.name)}님에게 알림이 가요</p>
        </div>`;
    detail.innerHTML = `
      ${photo(p, 'p-vw-d__photo')}
      <div class="p-vw-d__body">
        <p class="p-vw-d__event">${esc(data.event)}</p>
        <p class="p-vw-d__name"><b>${esc(p.name)}</b><span>${genderAge(p)}</span></p>
        <p class="p-vw-d__quote">"${esc(p.quote)}"</p>
        ${info}
        ${notes ? `<ul class="p-vw-d__notes">${notes}</ul>` : ''}
        <div class="p-vw-d__safety"><button type="button">신고하기</button><span aria-hidden="true"></span><button type="button">차단하기</button></div>
      </div>`;
  }

  /* ---------- 그리기 ---------- */
  const empty = (text) => `<li class="p-vw__empty">${text}</li>`;
  const activeTab = () => (document.getElementById('vw-tab-mine').getAttribute('aria-selected') === 'true' ? 'mine' : 'me');
  function firstOf(tab) {
    const el = document.querySelector(`[data-vw-list="${tab}"] [data-vw-pick]`);
    return el ? el.dataset.vwPick : null;
  }
  function render() {
    const me = meRows();
    const mine = mineRows();
    document.querySelector('[data-vw-list="me"]').innerHTML = me.join('') || empty('아직 내 정보를 열람한 사람이 없어요.');
    document.querySelector('[data-vw-list="mine"]').innerHTML = mine.join('') || empty('아직 열람한 사람이 없어요. 참가자 명단에서 1크레딧으로 열람할 수 있어요.');
    document.querySelector('[data-vw-count="me"]').textContent = me.length;
    document.querySelector('[data-vw-count="mine"]').textContent = mine.length;
    renderDetail();
  }

  // 소개팅 이름은 한 회차뿐이라 목록 위에 한 번만
  document.querySelectorAll('.p-vw__list').forEach((list) => {
    list.insertAdjacentHTML('beforebegin', `<p class="p-vw__event">${esc(data.event)}</p>`);
  });

  /* ---------- 동작 ---------- */
  document.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-vw-pick]');
    if (pick && isPc()) {
      e.preventDefault();
      selected = pick.dataset.vwPick;
      render();
      return;
    }
    const tab = e.target.closest('.p-vw__tab');
    if (tab) {
      // 탭을 바꾸면 그 탭의 첫 사람을 보여 준다 (initTabs가 aria-selected를 바꾼 뒤)
      requestAnimationFrame(() => { selected = firstOf(activeTab()); render(); });
      return;
    }
    const btn = e.target.closest('[data-vw-unlock]');
    if (btn) {
      if (credit.get() < 1) { openCharge(); return; }
      credit.set(credit.get() - 1);
      unlock(btn.dataset.vwUnlock);
      render();
    }
  });
  document.addEventListener('ieum:credit', renderDetail);

  render();
  if (param('tab') === 'mine') document.getElementById('vw-tab-mine').click();
  else { selected = firstOf('me'); render(); }
})();
