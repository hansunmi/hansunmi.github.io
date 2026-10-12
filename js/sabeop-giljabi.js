// 사법길잡이 기획서: 오른쪽 목차에 지금 보고 있는 섹션을 표시한다
(function () {
  const links = Array.from(document.querySelectorAll('.sbg-toc a'));
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!sections.length) return;

  const update = () => {
    const line = window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= line) current = s.id;
    });
    links.forEach((a) => {
      if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
