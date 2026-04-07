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

function usesPlainCollapsedStackingAnimation(slide = slides[currentSlide]) {
  return Boolean(getStackingCardsSlide(slide)?.classList.contains('stacking-slide--plain-collapsed'));
}

function getOpenStackingCardsPreview(slide = slides[currentSlide]) {
  return getStackingCards(slide).find((card) => card.classList.contains('is-preview')) || null;
}

function isStackingCardsFullyStacked(slide = slides[currentSlide]) {
  return Boolean(getStackingCardsRegions(slide)?.container.classList.contains('all-stacked'));
}

function stopStackingCardsAnimations() {
  stackingCardsAnimationToken += 1;
  stackingCardAnimations.forEach((animation) => animation.cancel());
  stackingCardAnimations = [];
  stackingCardsAnimating = false;
  stackingCardsTransitionState = null;
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

function createStackingCardGhost(card, rect, kind = 'full') {
  if (!card || !rect) return null;

  let ghost;
  if (kind === 'box') {
    ghost = document.createElement('div');
    ghost.className = 'stacking-card-ghost stacking-card-ghost--box';
  } else if (kind === 'text') {
    ghost = document.createElement('div');
    ghost.className = 'stacking-card-ghost stacking-card-ghost--text';
    ghost.innerHTML = card.querySelector('.stacking-card-body')?.innerHTML || '';
  } else {
    ghost = card.cloneNode(true);
    ghost.classList.remove('is-stacked', 'is-preview');
    ghost.classList.add('is-active');
  }

  ghost.style.position = 'fixed';
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.style.margin = '0';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '10001';
  ghost.style.transformOrigin = 'top left';
  document.body.appendChild(ghost);
  return ghost;
}

function removeStackingCardGhost(ghost) {
  ghost?.remove();
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
  stackingCardsTransitionState = null;
}

function setStackingCardsStableState(slide, activeIndex) {
  const regions = getStackingCardsRegions(slide);
  if (!regions) return;

  const cards = getStackingCards(slide);
  const hasActiveCard = typeof activeIndex === 'number' && activeIndex >= 0;
  regions.container.classList.toggle('all-stacked', !hasActiveCard);

  cards.forEach((card, index) => {
    card.classList.remove('is-active', 'is-stacked', 'is-preview');
    card.style.transform = '';
    card.style.opacity = '';
    card.style.visibility = '';

    if (hasActiveCard && index === activeIndex) {
      card.classList.add('is-active');
      regions.stage.appendChild(card);
      return;
    }

    if (!hasActiveCard || index < activeIndex) {
      card.classList.add('is-stacked');
      regions.stackArea.appendChild(card);
      return;
    }

    regions.stage.appendChild(card);
  });
}

function openStackingCardsPreview(card) {
  const slide = getStackingCardsSlide();
  if (!slide || !card || !isStackingCardsFullyStacked(slide)) return false;

  const previewIndex = Number(card.dataset.cardIndex);
  const existingPreview = getOpenStackingCardsPreview(slide);
  if (existingPreview && Number(existingPreview.dataset.cardIndex) === previewIndex) {
    return closeStackingCardsPreview(slide);
  }

  stopStackingCardsAnimations();
  setStackingCardsStableState(slide, null);

  const previewCard = getStackingCards(slide).find((item) => Number(item.dataset.cardIndex) === previewIndex);
  const regions = getStackingCardsRegions(slide);
  if (!previewCard || !regions) return false;

  animateStackingCardsLayoutChange(previewCard, () => {
    previewCard.classList.remove('is-stacked');
    previewCard.classList.add('is-preview');
    regions.stage.appendChild(previewCard);
  }, {
    duration: 420,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  });

  return true;
}

function closeStackingCardsPreview(slide = slides[currentSlide]) {
  const stackingSlide = getStackingCardsSlide(slide);
  const previewCard = getOpenStackingCardsPreview(stackingSlide);
  if (!stackingSlide || !previewCard) return false;

  stopStackingCardsAnimations();
  animateStackingCardsLayoutChange(previewCard, () => {
    setStackingCardsStableState(stackingSlide, null);
  }, {
    duration: 360,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  });

  return true;
}

function finishOngoingStackingCardsTransition() {
  if (!stackingCardsAnimating || !stackingCardsTransitionState) return false;

  const slide = getStackingCardsSlide();
  const activeIndex = stackingCardsTransitionState.direction === 'forward'
    ? stackingCardsTransitionState.nextActiveIndex
    : stackingCardsTransitionState.activeIndex;

  stopStackingCardsAnimations();
  setStackingCardsStableState(slide, activeIndex);
  return true;
}

function resetStackingCards(slide) {
  const regions = getStackingCardsRegions(slide);
  if (!regions) return;

  stopStackingCardsAnimations();
  setStackingCardsStableState(slide, 0);
}

function advanceStackingCards() {
  const slide = getStackingCardsSlide();
  if (!slide) return false;

  const regions = getStackingCardsRegions(slide);
  const cards = getStackingCards(slide);
  const activeCard = cards.find((card) => card.classList.contains('is-active'));
  if (!activeCard) return false;

  const nextCard = cards.find((card) => Number(card.dataset.cardIndex) === Number(activeCard.dataset.cardIndex) + 1);
  const nextActiveIndex = nextCard ? Number(nextCard.dataset.cardIndex) : null;

  const token = stackingCardsAnimationToken + 1;
  stackingCardsAnimationToken = token;
  stackingCardsAnimating = true;
  stackingCardsTransitionState = {
    direction: 'forward',
    nextActiveIndex
  };

  if (usesPlainCollapsedStackingAnimation(slide)) {
    const tokenForPlain = token;

    (async () => {
      const activeRect = activeCard.getBoundingClientRect();
      const boxGhost = createStackingCardGhost(activeCard, activeRect, 'box');
      const textGhost = createStackingCardGhost(activeCard, activeRect, 'text');

      activeCard.classList.remove('is-active');
      activeCard.classList.add('is-stacked');
      regions.stackArea.appendChild(activeCard);
      activeCard.style.opacity = '0';
      activeCard.classList.add('is-animating-in');

      if (!nextCard) {
        regions.container.classList.add('all-stacked');
      }

      const targetRect = activeCard.getBoundingClientRect();
      const deltaX = targetRect.left - activeRect.left;
      const deltaY = targetRect.top - activeRect.top;
      const scaleX = targetRect.width / activeRect.width;
      const scaleY = targetRect.height / activeRect.height;

      const boxAnimation = playStackingCardsAnimation(
        boxGhost,
        [
          { opacity: 1, transform: 'translate(0, 0) scale(1, 1)', offset: 0 },
          { opacity: 0, transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`, offset: 1 }
        ],
        {
          duration: 820,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        }
      );

      const textAnimation = playStackingCardsAnimation(
        textGhost,
        [
          { opacity: 1, transform: 'translate(0, 0) scale(1, 1)', offset: 0 },
          { opacity: 1, transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`, offset: 0.84 },
          { opacity: 0, transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`, offset: 1 }
        ],
        {
          duration: 820,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        }
      );

      await waitForStackingCardsAnimation(boxAnimation);
      if (tokenForPlain !== stackingCardsAnimationToken) {
        removeStackingCardGhost(boxGhost);
        removeStackingCardGhost(textGhost);
        return;
      }
      boxAnimation?.cancel();
      textAnimation?.cancel();
      removeStackingCardGhost(boxGhost);
      removeStackingCardGhost(textGhost);
      activeCard.classList.remove('is-animating-in');
      activeCard.style.opacity = '';

      if (!nextCard) {
        finishStackingCardsAnimation(tokenForPlain);
        return;
      }

      nextCard.classList.remove('is-stacked');
      nextCard.classList.add('is-active');
      regions.stage.appendChild(nextCard);

      const enterAnimation = playStackingCardsAnimation(
        nextCard,
        [
          { opacity: 0, transform: 'translateY(10px) scale(0.99)', offset: 0 },
          { opacity: 1, transform: 'translateY(0) scale(1)', offset: 1 }
        ],
        {
          duration: 620,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards'
        }
      );
      await waitForStackingCardsAnimation(enterAnimation);
      if (tokenForPlain !== stackingCardsAnimationToken) return;
      enterAnimation?.cancel();
      finishStackingCardsAnimation(tokenForPlain);
    })();

    return true;
  }

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

