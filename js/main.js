// ── Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .work-card, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.width = '56px';
    ring.style.height = '56px';
    ring.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.opacity = '0.5';
  });
});

// ── 새로고침 시 hash로 인한 자동 스크롤 방지
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ── 앵커 클릭: URL에 hash 남기지 않고 smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
  });
});

// ── Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Scroll reveal
const reveals = document.querySelectorAll(
  '.intro-tagline, .about-name, .exp-item, .work-card, .contact-heading, .contact-item, .edu-item, .skill-group, .ending-quote'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

// ── Works card — notion link placeholder
document.querySelectorAll('.work-card[data-notion]').forEach(card => {
  card.addEventListener('click', e => {
    if (card.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

// ── Text Scramble (intro tagline, 1회 실행)
(function scrambleIntro() {
  const el = document.querySelector('.intro-tagline');
  if (!el) return;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

  // HTML 구조를 유지하면서 텍스트 노드만 수집
  const textNodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.replace(/\s/g, '').length > 0) {
      textNodes.push({ node, original: node.textContent });
    }
  }

  const duration = 1500;
  const startTime = Date.now();

  function tick() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOut: 앞부터 순서대로 확정
    const eased = 1 - Math.pow(1 - progress, 2);

    textNodes.forEach(({ node, original }) => {
      let result = '';
      for (let i = 0; i < original.length; i++) {
        if (/\s/.test(original[i])) {
          result += original[i];
        } else if (i / original.length < eased) {
          result += original[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      node.textContent = result;
    });

    if (progress < 1) requestAnimationFrame(tick);
  }

  setTimeout(tick, 400);
})();

// ── Works card 3D tilt
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const rotX = ((e.clientY - r.top) / r.height - 0.5) * -14;
    const rotY = ((e.clientX - r.left) / r.width - 0.5) * 14;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    card.style.transition = 'transform 0.08s ease';
    card.style.zIndex = '2';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.zIndex = '';
  });
});

// ── Magnetic effect
// JS는 transition을 절대 건드리지 않음 — CSS .is-tracking 클래스로만 제어
function initMagnetic(selector, sx, sy = sx) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => el.classList.add('is-tracking'));

    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * sx;
      const dy = (e.clientY - (r.top + r.height / 2)) * sy;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.classList.remove('is-tracking'); // CSS spring-back 트랜지션 복원
      el.style.transform = 'translate(0, 0)';
    });
  });
}

initMagnetic('.tag', 0.28);
initMagnetic('.contact-item', 0.05, 0);
