/* 참가자 상세 (S09) — ?user=u2. 열람하지 않은 사람이면 명단으로 돌려보낸다 */
(async function () {
  'use strict';
  const { esc, loadJSON, param } = window.IEUM;

  const data = await loadJSON('participants');
  const p = data.people.find((x) => x.id === param('user')) || data.people.find((x) => x.id === 'u2');

  let viewed = {};
  try { viewed = (JSON.parse(sessionStorage.getItem('ieum-participants')) || {}).viewed || {}; } catch (e) { /* 기본값 사용 */ }
  const date = viewed[p.id] || p.viewed;
  if (!date && !p.me) { location.replace('participants.html'); return; }

  const $ = (sel) => document.querySelector(sel);
  const img = $('.p-s09-m-2');
  if (p.photo) { img.src = p.photo; img.alt = `${p.name}님 프로필 사진`; }
  else img.replaceWith(Object.assign(document.createElement('span'), { className: 'p-s09-m-2 p-pt-ph', textContent: p.name.charAt(0) }));
  // 사진 넘김 점(시안의 '사진 1 / 3')은 사진이 여러 장일 때만 — 지금 데이터는 한 장씩
  const photos = p.photos || (p.photo ? [p.photo] : []);
  if (photos.length < 2) $('.p-s09-m-12').remove();
  $('.p-s09-m-9').textContent = p.name;
  $('.p-s09-m-10').textContent = `${p.gender === 'm' ? '남성' : '여성'} · ${p.age}`;
  $('.p-s09-m-11').textContent = `"${p.quote}"`;
  $('.p-s09-m-16').textContent = `${data.event}에 만나요`;
  $('.p-s09-m-20').textContent = `열람함 · ${date}`;
  const values = document.querySelectorAll('.p-s09-m-25');
  values[0].textContent = p.area.split(' ').slice(0, 2).join(' ');
  values[1].innerHTML = esc(p.job) + (p.verified ? ' <span class="p-s09-m-26">직업 인증</span>' : '');
  $('.p-s09-m-29').innerHTML = p.hobbies.map((h) => `<span class="p-s09-m-30">${esc(h)}</span>`).join('');
  document.title = `이음 · ${p.name} 상세`;
})();
