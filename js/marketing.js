const items = document.querySelectorAll('.bento-item');
const modal = document.getElementById('modal');
const wrap = document.getElementById('modalImgWrap');
const modalLabel = document.getElementById('modalLabel');
const modalCounter = document.getElementById('modalCounter');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalClose = document.getElementById('modalClose');

let currentSlides = [];
let currentIndex = 0;

function openModal(slides, label) {
  currentSlides = slides;
  currentIndex = 0;
  modalLabel.textContent = label;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderSlide(false);
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderSlide(animate = true) {
  const slide = currentSlides[currentIndex];
  const total = currentSlides.length;

  const draw = () => {
    wrap.className = 'modal-img-wrap';
    wrap.innerHTML = '';

    if (slide.type === 'composite') {
      const grid = document.createElement('div');
      grid.className = 'composite-grid';
      slide.srcs.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        grid.appendChild(img);
      });
      wrap.appendChild(grid);

    } else {
      const img = document.createElement('img');
      img.className = 'modal-img';
      img.src = slide.src;
      img.alt = modalLabel.textContent;

      if (slide.type === 'large') {
        wrap.classList.add('large');
      } else if (slide.type === 'scroll') {
        wrap.classList.add('scrollable');
      }

      wrap.appendChild(img);
    }

    wrap.style.opacity = '1';
  };

  if (animate) {
    wrap.style.opacity = '0';
    setTimeout(draw, 180);
  } else {
    draw();
  }

  /* nav 업데이트 */
  if (total > 1) {
    modalCounter.textContent = `${currentIndex + 1} / ${total}`;
    modalPrev.classList.remove('hidden');
    modalNext.classList.remove('hidden');
    modalPrev.disabled = currentIndex === 0;
    modalNext.disabled = currentIndex === total - 1;
  } else {
    modalCounter.textContent = '';
    modalPrev.classList.add('hidden');
    modalNext.classList.add('hidden');
  }
}

/* 카드 클릭 */
items.forEach(item => {
  item.addEventListener('click', () => {
    const slides = JSON.parse(item.dataset.slides);
    openModal(slides, item.dataset.label);
  });
});

/* 이전 / 다음 */
modalPrev.addEventListener('click', () => {
  if (currentIndex > 0) { currentIndex--; renderSlide(); }
});
modalNext.addEventListener('click', () => {
  if (currentIndex < currentSlides.length - 1) { currentIndex++; renderSlide(); }
});

/* 닫기 */
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* 키보드 */
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; renderSlide(); }
  if (e.key === 'ArrowRight' && currentIndex < currentSlides.length - 1) { currentIndex++; renderSlide(); }
});
