function setupFigureDragging() {
  let dragState = null;

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (event.target.closest('.style-toolbar')) return;
    rememberLaserPointerPosition(event.clientX, event.clientY);

    if (startPenStroke(event)) {
      event.preventDefault();
      return;
    }

    if (!isEditMode && !isOverviewMode && event.ctrlKey) {
      if (startTransientLaserPointer(event)) {
        event.preventDefault();
        return;
      }
    }

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
    if (continuePenStroke(event)) {
      event.preventDefault();
      return;
    }
    handleLaserPointerMove(event);
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
    stopPenStroke();
    stopTransientLaserPointer();
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
  if (closeStackingCardsPreview()) {
    return handleForwardStep();
  }

  if (finishOngoingStackingCardsTransition()) {
    return handleForwardStep();
  }

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
  goToSlide(currentSlide - 1, { state: SLIDE_STATE.FINAL });
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

  if ((event.ctrlKey || event.metaKey) && key === 'l') {
    event.preventDefault();
    disablePenTool();
    toggleLaserPointer();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && key === 'p') {
    event.preventDefault();
    togglePenTool();
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
      event.preventDefault();
      if (isOverviewMode) {
        closeOverview();
        return;
      }

      if (penToolEnabled) {
        disablePenTool();
        return;
      }

      if (laserPointerEnabled || laserPointerTransient) {
        disableLaserPointer();
        return;
      }

      document.activeElement?.blur?.();
      clearSelection();
    toggleOverview();
    return;
  }

  if (isOverviewMode) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
      event.preventDefault();
      highlightOverviewSelection();
      goToSlide(Math.min(totalSlides - 1, currentSlide + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      goToSlide(Math.max(0, currentSlide - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      goToSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goToSlide(totalSlides - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      closeOverview();
    }
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

document.addEventListener('keyup', (event) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    stopTransientLaserPointer();
  }
});

document.addEventListener('touchend', (event) => {
  const diff = touchStartX - event.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) handleForwardStep();
    else handleBackwardStep();
  }
});

document.addEventListener('click', (event) => {
  if (isOverviewMode) return;
  if (penToolEnabled) return;
  if (laserPointerEnabled || laserPointerTransient) return;

  const block = event.target.closest('.movable-figure');
  if (isEditMode && block && !event.target.closest('.style-toolbar')) {
    selectElement(block);
  }

  if (isEditingText()) return;
  if (event.target.closest('.slide-counter, .style-toolbar')) return;
  if (suppressClickReveal) {
    suppressClickReveal = false;
    return;
  }

  const activeSlide = slides[currentSlide];
  if (!activeSlide) return;
  if (!event.target.closest('.slide.active')) return;
  if (event.target.closest('[contenteditable="true"]')) return;

  if (activeSlide.dataset.stackingCards === 'true') {
    const clickedCard = event.target.closest('.stacking-card');
    if (clickedCard && clickedCard.classList.contains('is-preview')) {
      closeStackingCardsPreview(activeSlide);
      return;
    }

    if (clickedCard && clickedCard.classList.contains('is-stacked') && isStackingCardsFullyStacked(activeSlide)) {
      openStackingCardsPreview(clickedCard);
      return;
    }

    if (!clickedCard && getOpenStackingCardsPreview(activeSlide)) {
      closeStackingCardsPreview(activeSlide);
      return;
    }

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

window.addEventListener('resize', () => {
  updateSlideCounterMetrics();
  resizePenLayer();
  syncPenLayer();
});

window.addEventListener('blur', () => {
  stopPenStroke();
  stopTransientLaserPointer();
  if (laserPointerEnabled) {
    hideLaserPointer();
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  stopPenStroke();
  stopTransientLaserPointer();
  if (laserPointerEnabled) {
    hideLaserPointer();
  }
});

window.PYUVM_EDITOR = {
  getSelectedElement: () => selectedElement,
  isEditMode: () => isEditMode,
  scheduleHistoryRecord
};

