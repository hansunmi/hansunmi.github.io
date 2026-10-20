/* 로테이션 메모 (S17) — 다음 상대는 참가자가 고르지 않는다.
   진행자가 운영 화면에서 '다음 라운드'를 누르면 앱이 저절로 넘어가며 다음 상대(번호 · 성+○○)를 공개한다.
   정적 목업이라 진행자 신호는 ① 라운드 타이머가 0이 되거나 ② 아래 '시연' 버튼으로 흉내 낸다.
   진행이 꼬였을 때를 위한 예비: '상대가 달라요? 번호로 바꾸기' */
(function () {
  'use strict';
  const { esc, openLayer, closeLayer } = window.IEUM;

  const TOTAL = 12;
  const ROUND_SEC = 8 * 60;
  // 이 회차의 대화 순서 (번호 · 이름 · 사진) — 목업
  const order = [
    { no: 12, name: '김○○', photo: 'images/profile-m1.jpg' },
    { no: 3, name: '이○○', photo: 'images/profile-m2.jpg' },
    { no: 9, name: '박○○', photo: 'images/profile-m6.jpg' },
    { no: 5, name: '최○○', photo: 'images/profile-m7.jpg' },
    { no: 8, name: '정○○', photo: 'images/profile-m8.jpg' },
    { no: 1, name: '강○○', photo: 'images/profile-m3.jpg' },
    { no: 11, name: '윤○○', photo: 'images/profile-m4.jpg' },
    { no: 4, name: '서○○', photo: 'images/profile-m9.jpg' },
    { no: 6, name: '임○○', photo: 'images/profile-m10.jpg' },
    { no: 10, name: '조○○', photo: 'images/profile-m5.jpg' },
    { no: 2, name: '한○○', photo: 'images/profile-m11.jpg' },
    { no: 7, name: '오○○', photo: 'images/profile-m12.jpg' },
  ];
  const byNo = Object.fromEntries(order.map((p) => [p.no, p]));

  const state = {
    cur: 3, // 0부터 — 지금 4번째 대화
    left: 160, // 다음 라운드까지 남은 초
    people: order.map((p) => ({ ...p })),
    memos: { 12: '고양이 키움, LP 수집. 다음엔 레코드 가게 얘기!', 3: '같은 동네, 말이 잘 통함' },
    liked: new Set([12]),
  };

  /* ---------- 조각 ---------- */
  const heart = (on) => on
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="#B5562F" stroke="#B5562F" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"></path></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5E6270" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"></path></svg>';
  const likeBtn = (p) => {
    const on = state.liked.has(p.no);
    return `<button type="button" data-memo-like="${p.no}" aria-label="다시 보고 싶어요${on ? ' 취소' : ''}" aria-pressed="${on}" class="${on ? 'p-s17-m-22' : 'p-s17-m-24'}">${heart(on)}</button>`;
  };
  const head = (p, imgCls, sub, subCls = 'p-s17-m-21') => `<div class="p-s17-m-16">
      <span class="p-s17-m-17"><img src="${esc(p.photo)}" alt="" class="${imgCls}"><span class="p-s17-m-19">${p.no}</span></span>
      <div class="p-s17-m-20"><span class="p-s17-m-5">${esc(p.name)}</span><span class="${subCls}">${sub}</span></div>
      ${likeBtn(p)}
    </div>`;

  /* ---------- 그리기 ---------- */
  const list = document.querySelector('[data-memo-list]');
  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  function renderHero() {
    const n = state.cur + 1;
    document.querySelector('[data-memo-round]').textContent = n;
    document.querySelector('[data-memo-now]').textContent = `지금 ${n}번째 대화 중`;
    document.querySelector('[data-memo-ring]').setAttribute('aria-label', `${TOTAL}번 중 ${n}번째 대화`);
    const c = 2 * Math.PI * 36;
    document.querySelector('[data-memo-arc]').setAttribute('stroke-dasharray', `${Math.round((n / TOTAL) * c)} ${Math.round(c)}`);
    renderTimer();
  }
  function renderTimer() {
    const el = document.querySelector('[data-memo-timer]');
    el.innerHTML = state.cur < TOTAL - 1 ? `다음 대화까지 <b>${fmt(state.left)}</b>` : `마지막 대화예요 · <b>${fmt(state.left)}</b> 남음`;
  }

  function render(focusNew) {
    const html = [];
    state.people.forEach((p, i) => {
      if (i < state.cur) {
        const memo = state.memos[p.no];
        html.push(`<article class="p-s17-m-15">${head(p, 'p-s17-m-18', `${i + 1}번째 대화`)}${memo ? `<span class="p-s17-m-23">${esc(memo)}</span>` : ''}</article>`);
      } else if (i === state.cur) {
        html.push(`<article class="p-s17-m-25${focusNew ? ' is-new' : ''}" data-memo-current>
          ${head(p, 'p-s17-m-26', `${i + 1}번째 대화 · 지금`, 'p-s17-m-27')}
          <label class="p-s17-m-28"><span class="p-s17-m-29">지금 대화 중인 사람 메모</span><textarea rows="2" placeholder="기억하고 싶은 이야기를 짧게 적어두세요" class="p-s17-m-30" data-memo-input>${esc(state.memos[p.no] || '')}</textarea></label>
          <button type="button" class="p-mm-swap" data-memo-swap>상대가 달라요? 번호로 바꾸기</button>
        </article>`);
      } else if (i === state.cur + 1) {
        // 다음 상대는 진행자가 넘기기 전까지 공개되지 않는다
        html.push(`<article class="p-s17-m-31"><div class="p-s17-m-16">
          <span class="p-s17-m-17"><span class="p-s17-m-32"></span><span class="p-s17-m-19">-</span></span>
          <div class="p-s17-m-20"><span class="p-s17-m-5">다음 상대</span><span class="p-s17-m-21">${i + 1}번째 대화 · 진행자가 넘기면 공개돼요</span></div>
        </div></article>`);
      }
    });
    list.innerHTML = html.join('');
    renderHero();
    document.querySelector('[data-memo-advance]').hidden = state.cur >= TOTAL - 1;
    if (focusNew) document.querySelector('[data-memo-current]').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- 다음 라운드 (진행자 신호) ---------- */
  const toast = document.createElement('div');
  toast.className = 'p-mm-toast';
  toast.setAttribute('role', 'status');
  document.querySelector('.p-s17-m-root').appendChild(toast);
  let toastTimer;

  function saveCurrentMemo() {
    const input = document.querySelector('[data-memo-input]');
    const p = state.people[state.cur];
    if (input && p) {
      const v = input.value.trim();
      if (v) state.memos[p.no] = v; else delete state.memos[p.no];
    }
  }
  function advance() {
    if (state.cur >= TOTAL - 1) return;
    saveCurrentMemo();
    state.cur += 1;
    state.left = ROUND_SEC;
    const p = state.people[state.cur];
    render(true);
    toast.innerHTML = `<b>다음 라운드가 시작됐어요</b><span>${p.no}번 ${esc(p.name)}님 자리로 옮겨 주세요</span>`;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 4000);
  }

  setInterval(() => {
    if (state.left > 0) { state.left -= 1; renderTimer(); }
    if (state.left === 0) advance();
  }, 1000);

  /* ---------- 번호로 바꾸기 (예비) ---------- */
  document.body.insertAdjacentHTML('beforeend', `<div class="c-dim" id="ov-memo-swap">
    <form class="c-sheet p-mm-sheet" role="dialog" aria-modal="true" aria-labelledby="ov-memo-swap-t" novalidate>
      <span class="c-sheet__handle" aria-hidden="true"></span>
      <h2 class="p-mm-sheet__title" id="ov-memo-swap-t">지금 앞에 앉은 사람 번호</h2>
      <p class="p-mm-sheet__desc">명찰에 적힌 번호를 넣어 주세요. 진행 순서가 바뀌었을 때만 쓰면 돼요.</p>
      <input class="p-mm-sheet__input" type="number" inputmode="numeric" min="1" max="${TOTAL}" placeholder="예) 8" aria-label="상대 번호" data-memo-no>
      <p class="p-mm-sheet__error" data-memo-error hidden></p>
      <div class="c-btn-pair">
        <button type="button" class="c-btn c-btn--line c-btn--52" data-close>취소</button>
        <button type="submit" class="c-btn c-btn--primary c-btn--52">바꾸기</button>
      </div>
    </form>
  </div>`);
  const swap = document.getElementById('ov-memo-swap');
  const swapForm = swap.querySelector('form');
  swapForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const no = Number(swap.querySelector('[data-memo-no]').value);
    const err = swap.querySelector('[data-memo-error]');
    const done = state.people.slice(0, state.cur).some((p) => p.no === no);
    if (!byNo[no]) { err.textContent = `1~${TOTAL} 사이 번호를 넣어 주세요`; err.hidden = false; return; }
    if (done) { err.textContent = '이미 대화를 마친 번호예요'; err.hidden = false; return; }
    saveCurrentMemo();
    // 지금 자리와 그 번호의 자리를 서로 바꾼다 (뒤 순서도 함께 맞춰짐)
    const j = state.people.findIndex((p) => p.no === no);
    [state.people[state.cur], state.people[j]] = [state.people[j], state.people[state.cur]];
    closeLayer(swap);
    render();
  });

  /* ---------- 클릭 ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-memo-advance]')) { advance(); return; }
    if (e.target.closest('[data-memo-swap]')) {
      swap.querySelector('[data-memo-no]').value = '';
      swap.querySelector('[data-memo-error]').hidden = true;
      openLayer(swap);
      swap.querySelector('[data-memo-no]').focus();
      return;
    }
    const like = e.target.closest('[data-memo-like]');
    if (like) {
      saveCurrentMemo();
      const no = Number(like.dataset.memoLike);
      if (state.liked.has(no)) state.liked.delete(no); else state.liked.add(no);
      render();
    }
  });

  render();
})();
