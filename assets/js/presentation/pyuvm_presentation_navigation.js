function getClickRevealItems(slide = slides[currentSlide]) {
  if (!slide || slide.dataset.clickReveal !== 'true') return [];
  return Array.from(slide.querySelectorAll('.click-reveal-item'));
}

function stopAutoReveal() {
  if (!autoRevealTimer) return;
  clearTimeout(autoRevealTimer);
  autoRevealTimer = null;
}

function setClickRevealState(slide, revealed) {
  getClickRevealItems(slide).forEach((item) => {
    item.classList.toggle('revealed', revealed);
  });
}

function getNextRevealBatch(slide = slides[currentSlide]) {
  const items = getClickRevealItems(slide).filter((item) => !item.classList.contains('revealed'));
  if (!items.length) return [];

  if (slide?.dataset.revealMode !== 'step-groups') {
    return [items[0]];
  }

  const firstStep = Number(items[0].dataset.autoRevealStep || Number.MAX_SAFE_INTEGER);
  return items.filter((item) => Number(item.dataset.autoRevealStep || Number.MAX_SAFE_INTEGER) === firstStep);
}

function revealNextItem() {
  const nextBatch = getNextRevealBatch();
  if (!nextBatch.length) return false;
  nextBatch.forEach((item) => item.classList.add('revealed'));
  return true;
}

function restartIntrinsicAnimations(slide) {
  if (!slide) return;

  const animatedElements = Array.from(slide.querySelectorAll('.anim-block, .anim-line'));
  if (!animatedElements.length) return;

  animatedElements.forEach((element) => {
    const clone = element.cloneNode(true);
    element.replaceWith(clone);
  });
}

function setSlideState(slide, state) {
  if (!slide) return;
  stopStackingCardsAnimations();
  stopAutoReveal();

  if (state === SLIDE_STATE.FINAL) {
    setStackingCardsStableState(slide, null);
    setClickRevealState(slide, true);
    return;
  }

  resetStackingCards(slide);
  setClickRevealState(slide, false);
  restartIntrinsicAnimations(slide);
}

function scheduleAutoReveal(slide) {
  if (!slide || slide.dataset.autoReveal !== 'true' || slide.dataset.clickReveal !== 'true') return;

  const revealStep = () => {
    if (slides[currentSlide] !== slide) {
      stopAutoReveal();
      return;
    }

    const nextBatch = getNextRevealBatch(slide);
    if (!nextBatch.length) {
      stopAutoReveal();
      return;
    }

    nextBatch.forEach((item) => item.classList.add('revealed'));
    autoRevealTimer = setTimeout(revealStep, 320);
  };

  autoRevealTimer = setTimeout(revealStep, 320);
}

function goToSlide(index, options = {}) {
  if (index < 0 || index >= totalSlides) return;
  const previousSlide = slides[currentSlide];
  const previousIndex = currentSlide;
  const targetState = options.state ?? (index < previousIndex ? SLIDE_STATE.FINAL : SLIDE_STATE.RESET);

  stopPenStroke();
  clearPenInk();
  stopStackingCardsAnimations();
  clearSelection();
  previousSlide?.classList.remove('active');
  currentSlide = index;
  const targetSlide = slides[currentSlide];
  targetSlide.classList.add('active');
  setSlideState(targetSlide, targetState);
  if (targetState === SLIDE_STATE.RESET) {
    scheduleAutoReveal(targetSlide);
  }
  updateUI();
}

function ensureOverviewUI() {
  if (overviewRoot) return;

  overviewRoot = document.createElement('div');
  overviewRoot.className = 'slides-overview';
  overviewRoot.id = 'slidesOverview';
  overviewRoot.setAttribute('aria-hidden', 'true');

  overviewRoot.innerHTML = `
    <div class="slides-overview__backdrop"></div>
    <div class="slides-overview__panel" role="dialog" aria-modal="true" aria-label="Slide overview">
      <div class="slides-overview__grid" id="slidesOverviewGrid"></div>
    </div>
  `;

  document.body.appendChild(overviewRoot);
  overviewGrid = overviewRoot.querySelector('#slidesOverviewGrid');

  overviewRoot.addEventListener('click', (event) => {
    const card = event.target.closest('.slides-overview__card');
    if (card) {
      closeOverview({ targetIndex: Number(card.dataset.slideIndex) });
      return;
    }

    if (event.target === overviewRoot || event.target.classList.contains('slides-overview__backdrop')) {
      closeOverview();
    }
  });
}

function createSlideThumbnail(slide, index) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'slides-overview__card';
  card.dataset.slideIndex = String(index);
  card.setAttribute('aria-label', `Open slide ${index + 1}`);

  const number = document.createElement('span');
  number.className = 'slides-overview__index';
  number.textContent = String(index + 1).padStart(2, '0');

  const viewport = document.createElement('span');
  viewport.className = 'slides-overview__viewport';

  const clone = slide.cloneNode(true);
  clone.classList.add('active', 'slide--thumbnail-final');
  clone.removeAttribute('id');
  finalizeThumbnailSlideState(clone);

  viewport.appendChild(clone);
  clone.style.width = `${window.innerWidth}px`;
  clone.style.height = `${window.innerHeight}px`;

  requestAnimationFrame(() => {
    const scale = Math.min(
      viewport.clientWidth / window.innerWidth,
      viewport.clientHeight / window.innerHeight
    );
    clone.style.transform = `scale(${scale})`;
  });

  card.append(number, viewport);
  return card;
}

function finalizeThumbnailSlideState(slide) {
  stripAnimationClasses(slide);
  setClickRevealState(slide, true);
  finalizeStackingCardsSlide(slide);
}

function stripAnimationClasses(root) {
  root.querySelectorAll('*').forEach((element) => {
    element.classList.remove('anim-up', 'anim-fade');
    Array.from(element.classList)
      .filter((className) => /^d\d+$/.test(className))
      .forEach((className) => element.classList.remove(className));
  });
}

function finalizeStackingCardsSlide(root) {
  const stackingSlides = root.classList?.contains('stacking-slide')
    ? [root, ...root.querySelectorAll('.stacking-slide')]
    : Array.from(root.querySelectorAll('.stacking-slide'));

  stackingSlides.forEach((stackingSlide) => {
    const container = stackingSlide.querySelector('.stacking-cards-container');
    const stackArea = stackingSlide.querySelector('.stacking-stack-area');
    const stage = stackingSlide.querySelector('.stacking-stage');
    if (!container || !stackArea) return;

    const cards = Array.from(stackingSlide.querySelectorAll('.stacking-card'))
      .sort((left, right) => Number(left.dataset.cardIndex) - Number(right.dataset.cardIndex));

    container.classList.add('all-stacked');

    cards.forEach((cardElement) => {
      cardElement.classList.remove('is-active');
      cardElement.classList.add('is-stacked');
      cardElement.style.transform = '';
      cardElement.style.opacity = '';
      cardElement.style.visibility = '';
      stackArea.appendChild(cardElement);
    });

    if (stage) {
      stage.remove();
    }
  });
}

function renderOverviewThumbnails() {
  ensureOverviewUI();
  overviewGrid.innerHTML = '';
  slides.forEach((slide, index) => {
    overviewGrid.appendChild(createSlideThumbnail(slide, index));
  });
  highlightOverviewSelection();
}

function highlightOverviewSelection() {
  if (!overviewGrid) return;
  overviewGrid.querySelectorAll('.slides-overview__card').forEach((card) => {
    const isActive = Number(card.dataset.slideIndex) === currentSlide;
    card.classList.toggle('is-current', isActive);
    if (isActive) {
      card.setAttribute('aria-current', 'true');
    } else {
      card.removeAttribute('aria-current');
    }
  });
}

function openOverview() {
  if (isOverviewMode) return;
  ensureOverviewUI();
  disableLaserPointer();
  disablePenTool();
  document.activeElement?.blur?.();
  clearSelection();
  renderOverviewThumbnails();
  isOverviewMode = true;
  document.body.classList.add('overview-mode');
  overviewRoot.classList.add('is-visible');
  overviewRoot.setAttribute('aria-hidden', 'false');
  syncPenLayer();
}

function closeOverview({ targetIndex = null } = {}) {
  if (!isOverviewMode) return;
  isOverviewMode = false;
  document.body.classList.remove('overview-mode');
  overviewRoot?.classList.remove('is-visible');
  overviewRoot?.setAttribute('aria-hidden', 'true');
  syncPenLayer();

  if (typeof targetIndex === 'number' && !Number.isNaN(targetIndex)) {
    goToSlide(targetIndex);
  } else {
    updateUI();
  }
}

function toggleOverview() {
  if (isOverviewMode) {
    closeOverview();
    return;
  }

  openOverview();
}

