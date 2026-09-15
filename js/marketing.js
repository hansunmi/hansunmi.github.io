/* ── GATE (notification intro) ── */
(function () {
  const gate = document.getElementById('gate');
  const gallery = document.getElementById('gallery');
  const bellWrap = document.getElementById('bellWrap');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lockScroll(on) {
    const v = on ? 'hidden' : '';
    document.body.style.overflow = v;
    document.documentElement.style.overflow = v;
    if (on) window.scrollTo(0, 0);
  }

  function setPhase(p) {
    gate.dataset.phase = String(p);
    if (p >= 4) gallery.classList.add('is-open');
  }

  let started = false;
  let initialTimer = null;

  function openGallery() {
    if (started) return;
    started = true;
    if (initialTimer) clearTimeout(initialTimer);
    setPhase(1);
    setTimeout(() => setPhase(2), 620);
    setTimeout(() => setPhase(3), 1120);
    setTimeout(() => { setPhase(4); lockScroll(false); }, 1720);
    setTimeout(() => window.dispatchEvent(new Event('gallery:open')), 1900);
  }

  if (reduce) {
    setPhase(4);
  } else {
    lockScroll(true);
    initialTimer = setTimeout(openGallery, 700);
    bellWrap.addEventListener('click', () => {
      if (gate.dataset.phase === '0') openGallery();
    });
  }
})();

/* ── CAROUSELS ── */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const carousels = Array.from(document.querySelectorAll('[data-carousel]'));

  carousels.forEach((el, i) => {
    const track = el.querySelector('.carousel-track');
    const prevBtn = el.querySelector('[data-dir="-1"]');
    const nextBtn = el.querySelector('[data-dir="1"]');
    let paused = false;
    let autoTimer = null;

    function slide(dir) {
      const step = Math.max(360, track.clientWidth * 0.7);
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: dir * step, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => slide(-1));
    nextBtn.addEventListener('click', () => slide(1));
    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });

    function startAuto() {
      if (reduce) return;
      autoTimer = setInterval(() => { if (!paused) slide(1); }, 4200 + i * 900);
    }

    window.addEventListener('gallery:open', startAuto, { once: true });
  });
})();
