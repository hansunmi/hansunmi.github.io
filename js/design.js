(function () {
  const tabs  = Array.from(document.querySelectorAll('.player-tab'));
  const slots = Array.from(document.querySelectorAll('.video-slot'));
  const fills = tabs.map(t => t.querySelector('.tab-fill'));

  let current   = 0;
  let rafId     = null;
  let startTime = null;

  /* ── 탭 전환 핵심 함수 ── */
  function switchTo(index) {
    // 이전 애니메이션 / 영상 정리
    cancelAnimationFrame(rafId);
    slots[current].querySelector('video')?.pause();

    // 모두 리셋
    tabs.forEach(t => t.classList.remove('active'));
    slots.forEach(s => s.classList.remove('active'));
    fills.forEach(f => { f.style.transition = 'none'; f.style.width = '0%'; });

    current = index;
    tabs[current].classList.add('active');
    slots[current].classList.add('active');

    const video = slots[current].querySelector('video');
    const hasSrc = video && video.getAttribute('src') && video.getAttribute('src') !== '';

    if (hasSrc) {
      /* ── 실제 영상 모드 ──
         영상 삽입 후 video src를 채우면 이 경로가 자동으로 실행됩니다. */
      video.currentTime = 0;
      video.play().catch(() => {});

      function onUpdate() {
        if (!video.duration) return;
        fills[current].style.width = (video.currentTime / video.duration * 100) + '%';
      }
      function onEnd() {
        video.removeEventListener('timeupdate', onUpdate);
        video.removeEventListener('ended', onEnd);
        switchTo((current + 1) % tabs.length);
      }
      video.addEventListener('timeupdate', onUpdate);
      video.addEventListener('ended', onEnd);

    } else {
      /* ── 플레이스홀더 타이머 모드 ──
         data-ph-duration(초) 동안 프로그레스 바를 채운 뒤 다음 탭으로 전환. */
      const duration = parseFloat(slots[current].dataset.phDuration) * 1000;
      startTime = performance.now();

      function tick(now) {
        const pct = Math.min((now - startTime) / duration * 100, 100);
        fills[current].style.width = pct + '%';

        if (pct < 100) {
          rafId = requestAnimationFrame(tick);
        } else {
          /* 100% 도달 후 잠깐 머물다 다음 탭으로 */
          setTimeout(() => switchTo((current + 1) % tabs.length), 180);
        }
      }
      rafId = requestAnimationFrame(tick);
    }
  }

  /* ── 탭 클릭 ── */
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (i !== current) switchTo(i);
    });
  });

  /* ── 시작 ── */
  switchTo(0);
})();
