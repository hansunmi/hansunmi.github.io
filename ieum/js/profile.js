/* 매칭 상대 프로필 — data/matches.json의 ?id 항목을 그린다 */
(async function () {
  'use strict';
  const { esc, loadJSON, param } = window.IEUM;

  const matches = await loadJSON('matches');
  const id = matches[param('id')] ? param('id') : 'm1';
  const m = matches[id];
  document.title = `이음 · ${m.name} 프로필`;

  const back = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#24252B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>';
  const pen = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6F7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19l1-4L16 5l3 3L9 18z"></path></svg>';
  const check = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>';
  const chat = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path></svg>';

  const status = m.online
    ? '<span class="p-pf__status p-pf__status--on"><span aria-hidden="true"></span>접속 중</span>'
    : '<span class="p-pf__status"><span aria-hidden="true"></span>오프라인</span>';

  /* 사진 · 정보 · 행동 세 영역 — 모바일은 위아래, PC는 왼쪽(사진 + 행동) · 오른쪽(정보) */
  document.getElementById('profile').innerHTML = `
    <div class="p-pf__top">
      <a class="p-pf__back" href="chat.html?id=${id}">${back}<span>대화로 돌아가기</span></a>
    </div>
    <div class="p-pf__body">
      <div class="p-pf__photo">
        <img src="${esc(m.photo)}" alt="${esc(m.name)}님 사진">
      </div>

      <div class="p-pf__info">
        <header class="p-pf__who">
          <div class="p-pf__name-row"><h1 class="p-pf__name">${esc(m.name)}</h1>${status}</div>
          <span class="p-pf__age">${esc(m.age)} · ${esc(m.gender)}</span>
          <p class="p-pf__quote">“${esc(m.oneliner)}”</p>
        </header>

        <dl class="p-pf__met">
          <div><dt>만난 소개팅</dt><dd>${esc(m.event)}</dd></div>
          <div><dt>매칭된 날</dt><dd>${esc(m.matched)}</dd></div>
        </dl>

        <section class="p-pf__sec" aria-labelledby="pf-info-title">
          <h2 class="p-pf__sec-title" id="pf-info-title">프로필</h2>
          <dl class="p-pf__list">
            <div class="p-pf__row"><dt>사는 곳</dt><dd>${esc(m.area)}</dd></div>
            <div class="p-pf__row"><dt>직업군</dt><dd>${esc(m.job)}${m.jobVerified ? `<span class="p-pf__verified">${check}직업 인증</span>` : ''}</dd></div>
            <div class="p-pf__row"><dt>취미</dt><dd>${m.hobbies.map(esc).join(' · ')}</dd></div>
          </dl>
        </section>

        <section class="p-pf__sec" aria-labelledby="pf-memo-title">
          <div class="p-pf__sec-head">
            <h2 class="p-pf__sec-title" id="pf-memo-title">내 메모</h2>
            <span class="p-pf__sec-aside">나만 보여요</span>
          </div>
          <div class="p-pf__memo">
            <p>${esc(m.memo)}</p>
            <a class="p-pf__memo-edit" href="chat.html?id=${id}" aria-label="메모 고치기">${pen}</a>
          </div>
        </section>
      </div>

      <div class="p-pf__actions">
        <a class="c-btn c-btn--primary c-btn--block c-btn--52" href="chat.html?id=${id}">${chat}대화하기</a>
        <div class="p-pf__safety">
          <button type="button" data-open="#ov-report">신고하기</button>
          <span aria-hidden="true"></span>
          <button type="button" data-open="#ov-block">차단하기</button>
        </div>
      </div>
    </div>`;
})();
