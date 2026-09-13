(function () {
  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const show = (el) => {
    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
    setTimeout(() => el.classList.add('is-visible'), delay);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        show(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => io.observe(el));
})();
