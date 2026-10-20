/* 매칭 상대 관련 동작 — 대화방 더보기(⋮) 메뉴 · 신고 · 차단 · 나가기 알림창 (chat.html · profile.html 공통)
   대상은 ?id=m1|m2|m3, 이름은 data/matches.json */
(async function () {
  'use strict';
  const { esc, loadJSON, param } = window.IEUM;

  const matches = await loadJSON('matches');
  const id = matches[param('id')] ? param('id') : 'm1';
  const m = matches[id];
  const name = esc(m.name);

  const icon = {
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 4.5-5 8-5s6.5 1 8 5"></path></svg>',
    bellOff: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"></path><path d="M10 20a2 2 0 0 0 4 0"></path><path d="M3 3l18 18"></path></svg>',
    flag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4h11l-1.5 4L16 12H5"></path></svg>',
    block: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M5.6 5.6l12.8 12.8"></path></svg>',
    leave: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"></path><path d="M10 16l-4-4 4-4M6 12h10"></path></svg>',
  };

  /* 메뉴 항목 — 가벼운 것 → 되돌릴 수 없는 것 순서 */
  const items = (withProfile) => [
    withProfile ? `<a class="p-mx-item" href="profile.html?id=${id}" role="menuitem">${icon.user}프로필 보기</a>` : '',
    `<button class="p-mx-item" type="button" role="menuitemcheckbox" aria-pressed="false" data-toggle>${icon.bellOff}<span class="p-mx-item__off">알림 끄기</span><span class="p-mx-item__on">알림 켜기</span></button>`,
    `<button class="p-mx-item" type="button" role="menuitem" data-open="#ov-report">${icon.flag}신고하기</button>`,
    '<span class="p-mx-sep" role="separator"></span>',
    `<button class="p-mx-item p-mx-item--danger" type="button" role="menuitem" data-open="#ov-block">${icon.block}차단하기</button>`,
    `<button class="p-mx-item p-mx-item--danger" type="button" role="menuitem" data-open="#ov-leave">${icon.leave}대화방 나가기</button>`,
  ].join('');

  const reasons = ['불쾌한 말이나 행동을 했어요', '연락처 · 돈을 요구했어요', '사진이나 프로필이 본인이 아닌 것 같아요', '기타'];

  document.body.insertAdjacentHTML('beforeend', `
  <div class="c-dim" id="ov-chat-sheet">
    <div class="c-sheet p-mx-sheet" role="menu" aria-label="${name}님과의 대화 메뉴">
      <span class="c-sheet__handle" aria-hidden="true"></span>
      <div class="p-mx-sheet__who"><img src="${esc(m.thumb)}" alt=""><span><b>${name}</b><span>${esc(m.event)}에서 만났어요</span></span></div>
      <div class="p-mx-list">${items(true)}</div>
      <button class="c-btn c-btn--line c-btn--block c-btn--48" type="button" data-close>닫기</button>
    </div>
  </div>

  <div class="c-dim" id="ov-report">
    <form class="c-sheet p-mx-report" role="dialog" aria-labelledby="ov-report-t">
      <span class="c-sheet__handle" aria-hidden="true"></span>
      <div class="p-mx-head"><h2 id="ov-report-t" class="p-mx-title">${name}님을 신고할까요?</h2><p class="p-mx-desc">신고 내용은 상대에게 알리지 않아요. 운영팀이 확인 후 조치해요.</p></div>
      <fieldset class="p-mx-reasons"><legend class="u-sr-only">신고 사유</legend>
        ${reasons.map((r, i) => `<label class="p-mx-reason"><input type="radio" name="reason"${i === 0 ? ' checked' : ''}><span>${r}</span></label>`).join('')}
      </fieldset>
      <label class="p-mx-also"><input type="checkbox" checked><span>신고하면서 차단도 할게요</span></label>
      <div class="c-btn-pair"><button class="c-btn c-btn--line c-btn--48" type="button" data-close>취소</button><button class="c-btn c-btn--accent c-btn--48" type="button" data-close>신고하기</button></div>
    </form>
  </div>

  <div class="c-dim" id="ov-block">
    <div class="c-dialog" role="alertdialog" aria-labelledby="ov-block-t" aria-describedby="ov-block-d">
      <span class="c-dialog__icon c-dialog__icon--accent">${icon.block.replace('width="18" height="18"', 'width="28" height="28"').replace('currentColor', '#B5562F')}</span>
      <h2 id="ov-block-t" class="c-dialog__title">${name}님을 차단할까요?</h2>
      <p id="ov-block-d" class="c-dialog__body">대화방이 닫히고, 다음부터 같은 회차에 배정되지 않아요.<br>상대에게는 차단 사실을 알리지 않아요.</p>
      <div class="c-dialog__actions c-btn-pair"><button class="c-btn c-btn--line c-btn--48" type="button" data-close>취소</button><a class="c-btn c-btn--accent c-btn--48" href="after.html">차단하기</a></div>
    </div>
  </div>

  <div class="c-dim" id="ov-leave">
    <div class="c-dialog" role="alertdialog" aria-labelledby="ov-leave-t" aria-describedby="ov-leave-d">
      <span class="c-dialog__icon">${icon.leave.replace('width="18" height="18"', 'width="28" height="28"').replace('currentColor', '#2F3B63')}</span>
      <h2 id="ov-leave-t" class="c-dialog__title">대화방을 나갈까요?</h2>
      <p id="ov-leave-d" class="c-dialog__body">나가면 대화 내용을 다시 볼 수 없어요.<br>${name}님에게는 ‘상대가 대화방을 나갔어요’가 보여요.</p>
      <div class="c-dialog__actions c-btn-pair"><button class="c-btn c-btn--line c-btn--48" type="button" data-close>취소</button><a class="c-btn c-btn--primary c-btn--48" href="after.html">나가기</a></div>
    </div>
  </div>`);

  /* PC 드롭다운: <button data-menu> 바로 옆에 붙인다 */
  document.querySelectorAll('[data-menu]').forEach((btn) => {
    const menu = document.createElement('div');
    menu.className = 'p-mx-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    menu.innerHTML = items(false);
    btn.parentElement.classList.add('p-mx-anchor');
    btn.insertAdjacentElement('afterend', menu);

    const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    // 메뉴 안에서 알림창을 열거나 바깥을 누르면 닫기 (알림 끄기 토글은 열어 둔다)
    document.addEventListener('click', (e) => {
      if (menu.hidden) return;
      if (menu.contains(e.target) && e.target.closest('[data-toggle]')) return;
      close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { close(); btn.focus(); } });
  });
})();
