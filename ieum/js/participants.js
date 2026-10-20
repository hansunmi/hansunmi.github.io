/* 참가자 명단 (S08) · 상세 열람 (S09-Unlock) — data/participants.json을 성별 탭별로 그린다.
   열람하지 않은 사람을 누르면 확인 창 → 확인하면 1크레딧을 쓰고
   PC는 오른쪽 상세가 그 사람으로 바뀌고, 모바일은 참가자 상세(participant.html)로 간다.
   열람 상태는 목업이라 이 탭(sessionStorage)에만 남는다. 크레딧 잔액 · 충전은 common.js */
(async function () {
  'use strict';
  const { esc, loadJSON, param, isPc, openLayer, closeLayer, credit, openCharge } = window.IEUM;

  const data = await loadJSON('participants');
  const people = data.people;
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));

  /* ---------- 상태 (열람한 사람 · 크레딧) ---------- */
  const KEY = 'ieum-participants';
  const saved = (() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  })();
  const state = {
    viewed: Object.assign(
      Object.fromEntries(people.filter((p) => p.viewed).map((p) => [p.id, p.viewed])),
      saved.viewed || {}
    ),
    gender: 'm',
    selected: 'u2',
  };
  const save = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ viewed: state.viewed })); } catch (e) { /* 저장 못 해도 화면은 동작 */ }
  };
  const isOpen = (p) => p.me || Boolean(state.viewed[p.id]);
  const today = () => {
    const d = new Date();
    return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`;
  };

  /* ---------- 조각 ---------- */
  const coin = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v8M9.5 10.5h5"></path></svg>';
  const lock = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';
  const check = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>';

  /* 사진이 아직 없는 사람(photo: null)은 성 한 글자 자리표시 */
  const photo = (p, cls) => p.photo
    ? `<img src="${esc(p.photo)}" alt="" class="${cls}">`
    : `<span class="${cls} p-pt-ph" aria-hidden="true">${esc(p.name.charAt(0))}</span>`;

  /* ---------- PC 목록 · 상세 ---------- */
  function pcCard(p) {
    const on = p.id === state.selected;
    let foot;
    if (p.me) foot = `<span class="p-s08-pc-25">나${on ? ' · 보는 중' : ''}</span>`;
    else if (isOpen(p)) foot = `<span class="p-s08-pc-25">열람함${on ? ' · 보는 중' : ''}</span>`;
    else foot = `<span class="p-s08-pc-27">${coin}상세 열람 · 1크레딧</span>`;
    return `<button type="button" data-pt-id="${p.id}" aria-pressed="${on}" class="${on ? 'p-s08-pc-26' : 'p-s08-pc-17'}"><span class="p-s08-pc-18">${photo(p, 'p-s08-pc-19')}</span><span class="p-s08-pc-20"><span class="p-s08-pc-21"><span class="p-s08-pc-22">${esc(p.name)}</span><span class="p-s08-pc-23">${esc(p.age)}</span></span><span class="p-s08-pc-24">"${esc(p.quote)}"</span>${foot}</span></button>`;
  }

  function pcAside(p) {
    const gender = p.gender === 'm' ? '남성' : '여성';
    const head = `<div class="p-s08-pc-30">${photo(p, 'p-s08-pc-31')}<span class="p-s08-pc-32"></span><span class="p-s08-pc-33"><span class="p-s08-pc-34"><span class="p-s08-pc-35">${esc(p.name)}</span><span class="p-s08-pc-36">${gender} · ${esc(p.age)}</span></span><span class="p-s08-pc-37">"${esc(p.quote)}"</span></span></div>`;
    const safety = p.me ? '' : '<div class="p-s08-pc-48"><button type="button" class="p-s08-pc-49">신고하기</button><button type="button" class="p-s08-pc-49">차단하기</button></div>';

    if (isOpen(p)) {
      const pill = p.me ? '내 프로필' : `열람함 · ${esc(state.viewed[p.id])}`;
      const verified = p.verified ? ` <span class="p-pt-verified">${check}직업 인증</span>` : '';
      return `${head}<div class="p-s08-pc-38">
        <div class="p-s08-pc-39"><span class="p-s08-pc-22">상세 정보</span><span class="p-s08-pc-40">${pill}</span></div>
        <dl class="p-s08-pc-41"><dt class="p-s08-pc-42">사는 곳</dt><dd class="p-s08-pc-43">${esc(p.area.split(' ').slice(0, 2).join(' '))}</dd><dt class="p-s08-pc-42">직업군</dt><dd class="p-s08-pc-43">${esc(p.job)}${verified}</dd><dt class="p-s08-pc-42">취미</dt><dd class="p-s08-pc-45">${p.hobbies.map((h) => `<span class="p-s08-pc-46">${esc(h)}</span>`).join('')}</dd></dl>
        ${safety}</div>`;
    }
    return `${head}<div class="p-s08-pc-38">
      <div class="p-s08-pc-39"><span class="p-s08-pc-22">상세 정보</span><span class="p-s08-pc-40 p-pt-pill-lock">${lock}잠김</span></div>
      <dl class="p-pt-locked" aria-label="열람하면 볼 수 있는 정보">
        <div><dt>사는 곳</dt><dd><span></span></dd></div>
        <div><dt>직업군</dt><dd><span></span></dd></div>
        <div><dt>취미</dt><dd><span></span><span></span><span></span></dd></div>
      </dl>
      <button type="button" class="c-btn c-btn--primary c-btn--48 c-btn--block" data-pt-unlock="${p.id}">${coin}1크레딧으로 열람하기</button>
      <p class="p-pt-locked__note">열람하면 ${esc(p.name)}님에게 알림이 가요</p>
      ${safety}</div>`;
  }

  /* ---------- 모바일 목록 ---------- */
  function mCard(p) {
    const badge = p.me ? '<span class="p-s08-m-23">나</span>' : isOpen(p) ? '<span class="p-s08-m-23">열람함</span>' : '';
    const top = `<span class="p-s08-m-20">${photo(p, 'p-s08-m-21')}<span class="p-s08-m-22"></span>${badge}<span class="p-s08-m-24"><span class="p-s08-m-25">${esc(p.name)}</span><span class="p-s08-m-26">${esc(p.age)}</span></span></span><span class="p-s08-m-27">"${esc(p.quote)}"</span>`;
    if (p.me) return `<a href="mypage.html" class="p-s08-m-19">${top}<span class="p-s08-m-28">내 프로필</span></a>`;
    if (isOpen(p)) return `<a href="participant.html?user=${p.id}" class="p-s08-m-19">${top}<span class="p-s08-m-28">상세 보기</span></a>`;
    return `<a href="#ov-unlock" data-pt-unlock="${p.id}" class="p-s08-m-19">${top}<span class="p-s08-m-29">${coin}상세 열람 · 1</span></a>`;
  }

  /* ---------- 그리기 ---------- */
  const listPc = document.querySelector('[data-pt-list="pc"]');
  const listM = document.querySelector('[data-pt-list="m"]');
  const aside = document.querySelector('[data-pt-aside]');

  function render() {
    const list = people.filter((p) => p.gender === state.gender);
    if (!list.some((p) => p.id === state.selected)) {
      state.selected = (list.find((p) => isOpen(p) && !p.me) || list[0]).id;
    }
    listPc.innerHTML = list.map(pcCard).join('');
    listM.innerHTML = list.map(mCard).join('');
    aside.innerHTML = pcAside(byId[state.selected]);
    document.querySelectorAll('[data-pt-credit]').forEach((el) => { el.textContent = `크레딧 ${credit.get()}`; });
    document.querySelectorAll('[data-pt-gender]').forEach((tab) => {
      const on = tab.dataset.ptGender === state.gender;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      const pc = tab.classList.contains('p-s08-pc-14') || tab.classList.contains('p-s08-pc-15');
      tab.className = pc ? (on ? 'p-s08-pc-14' : 'p-s08-pc-15') : (on ? 'p-s08-m-15' : 'p-s08-m-16');
    });
  }

  /* ---------- 열람 확인 창 ---------- */
  const dlg = document.getElementById('ov-unlock');
  let pending = null;

  function askUnlock(p) {
    pending = p;
    dlg.querySelector('[data-pt-dlg-photo]').innerHTML = photo(p, 'p-s09-unlock-m-7');
    dlg.querySelectorAll('[data-pt-dlg-name]').forEach((el) => { el.textContent = p.name; });
    dlg.querySelector('[data-pt-dlg-sub]').textContent = `${p.age} · "${p.quote}"`;
    const enough = credit.get() >= 1;
    dlg.querySelector('[data-pt-dlg-left]').textContent = enough ? credit.get() - 1 : 0;
    dlg.querySelector('[data-pt-confirm-label]').textContent = enough ? '1 크레딧으로 열람하기' : '크레딧 충전하기';
    dlg.querySelector('[data-pt-dlg-foot]').textContent = enough
      ? `지금 크레딧 ${credit.get()} · 열람하면 ${credit.get() - 1} 남아요`
      : '크레딧이 부족해요. 충전하면 바로 열람할 수 있어요';
    openLayer(dlg);
    dlg.querySelector('[data-pt-confirm]').focus();
  }

  dlg.querySelector('[data-pt-confirm]').addEventListener('click', (e) => {
    e.preventDefault();
    const p = pending;
    if (!p) return;
    if (credit.get() < 1) { openCharge(); return; } // 부족하면 그 자리에서 충전 팝업
    credit.set(credit.get() - 1);
    state.viewed[p.id] = today();
    state.selected = p.id;
    save();
    closeLayer(dlg);
    pending = null;
    if (isPc()) render();
    else location.href = `participant.html?user=${p.id}`;
  });

  /* ---------- 클릭 ---------- */
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-pt-gender]');
    if (tab) { state.gender = tab.dataset.ptGender; render(); return; }

    const unlock = e.target.closest('[data-pt-unlock]');
    if (unlock) { e.preventDefault(); askUnlock(byId[unlock.dataset.ptUnlock]); return; }

    const card = e.target.closest('[data-pt-id]');
    if (card) {
      const p = byId[card.dataset.ptId];
      if (isOpen(p)) { state.selected = p.id; render(); } else askUnlock(p);
    }
  });

  // 충전하면 잔액 표시 갱신
  document.addEventListener('ieum:credit', render);

  /* ?user=u3 — 열람 기록에서 넘어올 때: 열람한 사람이면 고르고, 아니면 열람 확인 창 */
  const target = byId[param('user')];
  if (target) {
    state.gender = target.gender;
    if (isOpen(target)) state.selected = target.id;
  }
  render();
  if (target && !isOpen(target)) askUnlock(target);
})();
