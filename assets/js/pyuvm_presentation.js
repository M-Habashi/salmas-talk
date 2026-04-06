let slides = [];
let totalSlides = 0;
let currentSlide = 0;
let isEditMode = false;
let selectedElement = null;
let historyRecordingPaused = false;
let historyTimer = null;
let fileHandle = null;
let suppressClickReveal = false;
let stackingCardsAnimating = false;
let stackingCardAnimations = [];
let stackingCardsAnimationToken = 0;

const historyStack = [];
const maxHistoryEntries = 100;

const editableSelectors = [
  '.slide-tag',
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'li',
  '.chip',
  '.arch-label',
  '.arch-box',
  '.phase',
  '.layer-label',
  '.stack-layer strong',
  '.tool-sub',
  '.tool-card li',
  '.r-label',
  '.r-value',
  '.node-name',
  '.code-block'
];

const movableSelectors = [
  ...editableSelectors,
  '.card',
  '.tool-card',
  '.compare-item',
  '.arch-diagram',
  '.stack-diagram',
  '.class-tree',
  'img'
];

function renderPresentationFromData() {
  const presentation = document.querySelector('.presentation');
  if (!presentation || presentation.querySelector('.slide')) return;
  if (!window.PYUVM_PRESENTATION || typeof window.PYUVM_PRESENTATION.render !== 'function') return;

  presentation.innerHTML = window.PYUVM_PRESENTATION.render();
}

function refreshSlideReferences() {
  slides = Array.from(document.querySelectorAll('.slide'));
  totalSlides = slides.length;
  document.getElementById('totalSlides').textContent = String(totalSlides).padStart(2, '0');

  if (currentSlide >= totalSlides) {
    currentSlide = Math.max(0, totalSlides - 1);
  }

  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
}

function updateUI() {
  const progress = totalSlides > 0 ? ((currentSlide + 1) / totalSlides) * 100 : 0;
  document.getElementById('progressBar').style.width = progress + '%';
  document.getElementById('currentSlide').textContent = String(currentSlide + 1).padStart(2, '0');
}

function getStackingCardsSlide(slide = slides[currentSlide]) {
  if (!slide || slide.dataset.stackingCards !== 'true') return null;
  return slide;
}

function getStackingCards(slide = slides[currentSlide]) {
  const stackingSlide = getStackingCardsSlide(slide);
  if (!stackingSlide) return [];
  return Array.from(stackingSlide.querySelectorAll('.stacking-card'))
    .sort((left, right) => Number(left.dataset.cardIndex) - Number(right.dataset.cardIndex));
}

function getStackingCardsRegions(slide = slides[currentSlide]) {
  const stackingSlide = getStackingCardsSlide(slide);
  if (!stackingSlide) return null;

  return {
    container: stackingSlide.querySelector('.stacking-cards-container'),
    stackArea: stackingSlide.querySelector('.stacking-stack-area'),
    stage: stackingSlide.querySelector('.stacking-stage')
  };
}

function stopStackingCardsAnimations() {
  stackingCardsAnimationToken += 1;
  stackingCardAnimations.forEach((animation) => animation.cancel());
  stackingCardAnimations = [];
  stackingCardsAnimating = false;
}

function canAnimateStackingCards() {
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches &&
    typeof document.createElement('div').animate === 'function';
}

function playStackingCardsAnimation(element, keyframes, options) {
  if (!canAnimateStackingCards() || !element?.animate) return null;
  const animation = element.animate(keyframes, options);
  stackingCardAnimations = [animation];
  return animation;
}

function animateStackingCardsLayoutChange(element, mutate, options = {}) {
  const before = element?.getBoundingClientRect();
  mutate();

  if (!canAnimateStackingCards() || !element?.animate || !before) {
    return null;
  }

  const after = element.getBoundingClientRect();
  if (!after.width || !after.height) {
    return null;
  }

  const deltaX = before.left - after.left;
  const deltaY = before.top - after.top;
  const scaleX = before.width / after.width;
  const scaleY = before.height / after.height;

  if (
    Math.abs(deltaX) < 1 &&
    Math.abs(deltaY) < 1 &&
    Math.abs(scaleX - 1) < 0.01 &&
    Math.abs(scaleY - 1) < 0.01
  ) {
    return null;
  }

  const animation = element.animate(
    [
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
        transformOrigin: 'top left'
      },
      {
        transform: 'translate(0, 0) scale(1, 1)',
        transformOrigin: 'top left'
      }
    ],
    {
      duration: options.duration ?? 320,
      easing: options.easing ?? 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    }
  );

  stackingCardAnimations = [animation];
  return animation;
}

async function waitForStackingCardsAnimation(animation) {
  if (!animation) return;
  try {
    await animation.finished;
  } catch {
    return;
  }
}

function finishStackingCardsAnimation(token) {
  if (token !== stackingCardsAnimationToken) return;
  stackingCardAnimations = [];
  stackingCardsAnimating = false;
}

function resetStackingCards(slide) {
  const regions = getStackingCardsRegions(slide);
  if (!regions) return;

  stopStackingCardsAnimations();
  const cards = getStackingCards(slide);
  regions.container.classList.remove('all-stacked');

  cards.forEach((card, index) => {
    card.classList.remove('is-active', 'is-stacked');
    regions.stage.appendChild(card);

    if (index === 0) {
      card.classList.add('is-active');
    }
  });
}

function advanceStackingCards() {
  const slide = getStackingCardsSlide();
  if (!slide) return false;
  if (stackingCardsAnimating) return true;

  const regions = getStackingCardsRegions(slide);
  const cards = getStackingCards(slide);
  const activeCard = cards.find((card) => card.classList.contains('is-active'));
  if (!activeCard) return false;

  const nextCard = cards.find((card) => Number(card.dataset.cardIndex) === Number(activeCard.dataset.cardIndex) + 1);

  const token = stackingCardsAnimationToken + 1;
  stackingCardsAnimationToken = token;
  stackingCardsAnimating = true;

  (async () => {
    const shrinkAnimation = animateStackingCardsLayoutChange(activeCard, () => {
      activeCard.classList.remove('is-active');
      activeCard.classList.add('is-stacked');
      regions.stackArea.appendChild(activeCard);

      if (!nextCard) {
        regions.container.classList.add('all-stacked');
      }
    }, {
      duration: 860,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });
    await waitForStackingCardsAnimation(shrinkAnimation);
    if (token !== stackingCardsAnimationToken) return;
    shrinkAnimation?.cancel();

    if (nextCard) {
      nextCard.classList.remove('is-stacked');
      nextCard.classList.add('is-active');
      regions.stage.appendChild(nextCard);

      const enterAnimation = playStackingCardsAnimation(
        nextCard,
        [
          { transform: 'translateX(96px)', opacity: 0, offset: 0 },
          { transform: 'translateX(0) scale(1)', opacity: 1, offset: 1 }
        ],
        {
          duration: 820,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards'
        }
      );
      await waitForStackingCardsAnimation(enterAnimation);
      if (token !== stackingCardsAnimationToken) return;
      enterAnimation?.cancel();
      finishStackingCardsAnimation(token);
      return;
    }

    finishStackingCardsAnimation(token);
  })();

  return true;
}

function rewindStackingCards() {
  const slide = getStackingCardsSlide();
  if (!slide) return false;
  if (stackingCardsAnimating) return true;

  const regions = getStackingCardsRegions(slide);
  const cards = getStackingCards(slide);
  const stackedCards = cards.filter((card) => card.classList.contains('is-stacked'));
  if (!stackedCards.length) return false;

  const activeCard = cards.find((card) => card.classList.contains('is-active'));
  const lastStackedCard = stackedCards[stackedCards.length - 1];

  regions.container.classList.remove('all-stacked');

  const token = stackingCardsAnimationToken + 1;
  stackingCardsAnimationToken = token;
  stackingCardsAnimating = true;

  (async () => {
    if (activeCard) {
      const exitAnimation = playStackingCardsAnimation(
        activeCard,
        [
          { transform: 'translateX(0)', opacity: 1, offset: 0 },
          { transform: 'translateX(96px)', opacity: 0, offset: 1 }
        ],
        {
          duration: 720,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards'
        }
      );
      await waitForStackingCardsAnimation(exitAnimation);
      if (token !== stackingCardsAnimationToken) return;
      exitAnimation?.cancel();

      activeCard.classList.remove('is-active');
      regions.stage.appendChild(activeCard);
    }

    const expandAnimation = animateStackingCardsLayoutChange(lastStackedCard, () => {
      lastStackedCard.classList.remove('is-stacked');
      lastStackedCard.classList.add('is-active');
      regions.stage.appendChild(lastStackedCard);
    }, {
      duration: 840,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });
    await waitForStackingCardsAnimation(expandAnimation);
    if (token !== stackingCardsAnimationToken) return;
    expandAnimation?.cancel();
    finishStackingCardsAnimation(token);
  })();

  return true;
}

function getClickRevealItems(slide = slides[currentSlide]) {
  if (!slide || slide.dataset.clickReveal !== 'true') return [];
  return Array.from(slide.querySelectorAll('.click-reveal-item'));
}

function resetClickReveal(slide) {
  getClickRevealItems(slide).forEach((item) => {
    item.classList.remove('revealed');
  });
}

function revealNextItem() {
  const nextItem = getClickRevealItems().find((item) => !item.classList.contains('revealed'));
  if (!nextItem) return false;
  nextItem.classList.add('revealed');
  return true;
}

function hideLastRevealedItem() {
  const revealedItems = getClickRevealItems().filter((item) => item.classList.contains('revealed'));
  const lastItem = revealedItems[revealedItems.length - 1];
  if (!lastItem) return false;
  lastItem.classList.remove('revealed');
  return true;
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  clearSelection();
  slides[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  resetStackingCards(slides[currentSlide]);
  resetClickReveal(slides[currentSlide]);
  updateUI();
}

function makeSlidesEditable() {
  document.querySelectorAll(editableSelectors.join(', ')).forEach((element) => {
    element.setAttribute('contenteditable', isEditMode ? 'true' : 'false');
    element.setAttribute('spellcheck', 'false');
  });
}

function makeBlocksMovable() {
  document.querySelectorAll([...new Set(movableSelectors)].join(', ')).forEach((element) => {
    element.classList.add('movable-figure');
    element.setAttribute('tabindex', isEditMode ? '0' : '-1');
    element.dataset.translateX = element.dataset.translateX || '0';
    element.dataset.translateY = element.dataset.translateY || '0';

    if (!element.style.transform && (element.dataset.translateX !== '0' || element.dataset.translateY !== '0')) {
      element.style.transform = `translate(${element.dataset.translateX}px, ${element.dataset.translateY}px)`;
    }
  });
}

function applyEditorEnhancements() {
  makeSlidesEditable();
  makeBlocksMovable();
  document.body.classList.toggle('edit-mode', isEditMode);
  refreshSlideReferences();
  updateUI();
}

function setBlockPosition(element, x, y) {
  element.dataset.translateX = String(x);
  element.dataset.translateY = String(y);
  element.style.transform = `translate(${x}px, ${y}px)`;
  if (selectedElement === element) {
    document.dispatchEvent(new CustomEvent('pyuvm-selection-change', { detail: { element: selectedElement, isEditMode } }));
  }
}

function isEditingText() {
  const activeElement = document.activeElement;
  return activeElement && activeElement.isContentEditable;
}

function getActiveEditableBlock() {
  const activeElement = document.activeElement;
  if (!activeElement || !activeElement.isContentEditable) return null;
  return activeElement.closest('.movable-figure');
}

function clearSelection() {
  if (selectedElement) {
    selectedElement.classList.remove('selected-block');
    selectedElement = null;
  }
  document.dispatchEvent(new CustomEvent('pyuvm-selection-change', { detail: { element: null, isEditMode } }));
}

function setEditMode(enabled) {
  isEditMode = enabled;

  if (!isEditMode) {
    document.activeElement?.blur?.();
    clearSelection();
  }

  makeSlidesEditable();
  makeBlocksMovable();
  document.body.classList.toggle('edit-mode', isEditMode);
  document.dispatchEvent(new CustomEvent('pyuvm-edit-mode-change', { detail: { isEditMode } }));
}

function selectElement(element) {
  if (!isEditMode || !element) return;

  if (selectedElement === element) {
    return;
  }

  if (selectedElement) {
    selectedElement.classList.remove('selected-block');
  }

  selectedElement = element;
  selectedElement.classList.add('selected-block');
  document.dispatchEvent(new CustomEvent('pyuvm-selection-change', { detail: { element: selectedElement, isEditMode } }));
}

function buildSnapshot() {
  const presentation = document.querySelector('.presentation');
  return {
    presentationHTML: presentation ? presentation.innerHTML : '',
    currentSlide
  };
}

function snapshotsEqual(left, right) {
  return left && right &&
    left.presentationHTML === right.presentationHTML &&
    left.currentSlide === right.currentSlide;
}

function recordHistory() {
  if (historyRecordingPaused) return;

  const snapshot = buildSnapshot();
  const previous = historyStack[historyStack.length - 1];
  if (snapshotsEqual(previous, snapshot)) return;

  historyStack.push(snapshot);
  if (historyStack.length > maxHistoryEntries) {
    historyStack.shift();
  }
}

function scheduleHistoryRecord() {
  if (historyRecordingPaused) return;
  clearTimeout(historyTimer);
  historyTimer = setTimeout(recordHistory, 250);
}

function restoreSnapshot(snapshot) {
  if (!snapshot) return;

  historyRecordingPaused = true;
  clearSelection();
  document.querySelector('.presentation').innerHTML = snapshot.presentationHTML;
  currentSlide = snapshot.currentSlide;
  applyEditorEnhancements();
  historyRecordingPaused = false;
}

function undoLastChange() {
  if (historyStack.length <= 1) return;
  historyStack.pop();
  restoreSnapshot(historyStack[historyStack.length - 1]);
}

function removeSelectedElement() {
  if (!isEditMode) return;
  if (!selectedElement) return;
  const elementToRemove = selectedElement;
  clearSelection();
  elementToRemove.remove();
  recordHistory();
}

function serializeDocument() {
  const clone = document.documentElement.cloneNode(true);

  clone.querySelectorAll('.selected-block, .dragging').forEach((element) => {
    element.classList.remove('selected-block', 'dragging');
  });
  clone.querySelector('#styleToolbar')?.classList.add('is-hidden');

  return '<!DOCTYPE html>\n' + clone.outerHTML;
}

async function savePresentation() {
  const html = serializeDocument();

  try {
    if ('showSaveFilePicker' in window) {
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: 'pyuvm_presentation.html',
          types: [
            {
              description: 'HTML files',
              accept: { 'text/html': ['.html'] }
            }
          ]
        });
      }

      const writable = await fileHandle.createWritable();
      await writable.write(html);
      await writable.close();
      return;
    }
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    throw error;
  }

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pyuvm_presentation.html';
  link.click();
  URL.revokeObjectURL(url);
}

function setupFigureDragging() {
  let dragState = null;

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (event.target.closest('.style-toolbar')) return;

    const block = event.target.closest('.movable-figure');
    if (!isEditMode) {
      if (!block) {
        clearSelection();
      }
      return;
    }

    if (!block) {
      clearSelection();
      return;
    }

    dragState = {
      element: block,
      startX: event.clientX,
      startY: event.clientY,
      originX: Number(block.dataset.translateX || 0),
      originY: Number(block.dataset.translateY || 0),
      hasMoved: false
    };

    selectElement(block);
    block.classList.add('dragging');
    block.setPointerCapture?.(event.pointerId);
  });

  document.addEventListener('pointermove', (event) => {
    if (!dragState) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.hasMoved && Math.abs(deltaX) + Math.abs(deltaY) > 4) {
      dragState.hasMoved = true;
    }
    if (!dragState.hasMoved) return;

    setBlockPosition(dragState.element, dragState.originX + deltaX, dragState.originY + deltaY);
  });

  function stopDragging(event) {
    if (!dragState) return;

    const moved = dragState.hasMoved;
    dragState.element.classList.remove('dragging');
    dragState.element.releasePointerCapture?.(event.pointerId);
    dragState = null;

    if (moved) {
      suppressClickReveal = true;
      recordHistory();
    }
  }

  document.addEventListener('pointerup', stopDragging);
  document.addEventListener('pointercancel', stopDragging);
}

function handleForwardStep() {
  if (advanceStackingCards()) {
    return true;
  }

  if (revealNextItem()) {
    return true;
  }

  goToSlide(currentSlide + 1);
  return true;
}

function handleBackwardStep() {
  if (rewindStackingCards()) {
    return true;
  }

  if (hideLastRevealedItem()) {
    return true;
  }

  goToSlide(currentSlide - 1);
  return true;
}

document.addEventListener('keydown', async (event) => {
  const key = event.key.toLowerCase();

  if ((event.ctrlKey || event.metaKey) && key === 'e') {
    event.preventDefault();
    setEditMode(!isEditMode);
    return;
  }

  if ((event.ctrlKey || event.metaKey) && key === 's') {
    event.preventDefault();
    await savePresentation();
    return;
  }

  if (isEditMode && (event.ctrlKey || event.metaKey) && key === 'z' && !isEditingText()) {
    event.preventDefault();
    undoLastChange();
    return;
  }

  if (isEditMode && (event.ctrlKey || event.metaKey) && (event.key === 'Delete' || event.key === 'Backspace')) {
    const activeBlock = getActiveEditableBlock();
    if (activeBlock) {
      event.preventDefault();
      selectElement(activeBlock);
      removeSelectedElement();
      return;
    }
  }

  if (event.key === 'Escape') {
    document.activeElement?.blur?.();
    clearSelection();
    return;
  }

  if (isEditMode && selectedElement && !isEditingText() && (event.key === 'Delete' || event.key === 'Backspace')) {
    event.preventDefault();
    removeSelectedElement();
    return;
  }

  if (isEditingText()) return;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
    event.preventDefault();
    handleForwardStep();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    handleBackwardStep();
  } else if (event.key === 'Home') {
    event.preventDefault();
    goToSlide(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    goToSlide(totalSlides - 1);
  }
});

let touchStartX = 0;
document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

document.addEventListener('touchend', (event) => {
  const diff = touchStartX - event.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) handleForwardStep();
    else handleBackwardStep();
  }
});

document.addEventListener('click', (event) => {
  const block = event.target.closest('.movable-figure');
  if (isEditMode && block && !event.target.closest('.style-toolbar')) {
    selectElement(block);
  }

  if (isEditingText()) return;
  if (event.target.closest('.nav-hint, .slide-counter, .style-toolbar')) return;
  if (suppressClickReveal) {
    suppressClickReveal = false;
    return;
  }

  const activeSlide = slides[currentSlide];
  if (!activeSlide) return;
  if (!event.target.closest('.slide.active')) return;
  if (event.target.closest('[contenteditable="true"]')) return;

  if (activeSlide.dataset.stackingCards === 'true') {
    advanceStackingCards();
    return;
  }

  if (activeSlide.dataset.clickReveal === 'true') {
    revealNextItem();
  }
});

document.addEventListener('input', (event) => {
  if (event.target.isContentEditable) {
    scheduleHistoryRecord();
  }
});

document.addEventListener('focusin', (event) => {
  if (!isEditMode) return;
  const block = event.target.closest('.movable-figure');
  if (block) {
    selectElement(block);
  }
});

window.PYUVM_EDITOR = {
  getSelectedElement: () => selectedElement,
  isEditMode: () => isEditMode,
  scheduleHistoryRecord
};

renderPresentationFromData();
applyEditorEnhancements();
setupFigureDragging();
resetStackingCards(slides[currentSlide]);
resetClickReveal(slides[currentSlide]);
recordHistory();


