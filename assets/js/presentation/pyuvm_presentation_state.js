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
let stackingCardsTransitionState = null;
let isOverviewMode = false;
let overviewRoot = null;
let overviewGrid = null;
let autoRevealTimer = null;
let laserPointerEnabled = false;
let laserPointerTransient = false;
let laserPointerVisible = false;
let laserPointerHasPosition = false;
let laserPointerX = 0;
let laserPointerY = 0;
let penToolEnabled = false;
let penHasInk = false;
let penIsDrawing = false;
let penLastPoint = null;

const SLIDE_STATE = Object.freeze({
  RESET: 'reset',
  FINAL: 'final'
});

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
  updateSlideCounterMetrics();

  if (isOverviewMode) {
    highlightOverviewSelection();
  }
}

function updateSlideCounterMetrics() {
  const counter = document.querySelector('.slide-counter');
  if (!counter) return;

  const computed = window.getComputedStyle(counter);
  const rootStyle = document.documentElement.style;
  const bottom = computed.bottom;
  const right = computed.right;
  const height = `${counter.getBoundingClientRect().height}px`;

  rootStyle.setProperty('--slide-counter-bottom-actual', bottom);
  rootStyle.setProperty('--slide-counter-right-actual', right);
  rootStyle.setProperty('--slide-counter-height-actual', height);
}

function getLaserPointerElement() {
  return document.getElementById('laserPointer');
}

function getPenLayerElement() {
  return document.getElementById('penLayer');
}

function canUseLaserPointer() {
  return !isEditMode && !isOverviewMode;
}

function canUsePenTool() {
  return !isEditMode && !isOverviewMode;
}

function setLaserPointerPosition(x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;

  laserPointerX = x;
  laserPointerY = y;

  const pointer = getLaserPointerElement();
  if (!pointer) return;
  pointer.style.left = `${x}px`;
  pointer.style.top = `${y}px`;
}

function rememberLaserPointerPosition(x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  laserPointerHasPosition = true;
  setLaserPointerPosition(x, y);
}

function syncLaserPointer() {
  const pointer = getLaserPointerElement();
  if (!pointer) return;

  const isActive = canUseLaserPointer() && (laserPointerEnabled || laserPointerTransient);
  const isVisible = isActive && laserPointerVisible && laserPointerHasPosition;

  document.body.classList.toggle('laser-pointer-active', isVisible);
  pointer.classList.toggle('is-visible', isVisible);
  pointer.hidden = !isVisible;

  if (isVisible) {
    setLaserPointerPosition(laserPointerX, laserPointerY);
  }
}

function showLaserPointer(x = null, y = null) {
  if (Number.isFinite(x) && Number.isFinite(y)) {
    rememberLaserPointerPosition(x, y);
  }

  laserPointerVisible = laserPointerHasPosition;
  syncLaserPointer();
}

function hideLaserPointer() {
  laserPointerVisible = false;
  syncLaserPointer();
}

function disableLaserPointer() {
  laserPointerEnabled = false;
  laserPointerTransient = false;
  laserPointerVisible = false;
  syncLaserPointer();
}

function toggleLaserPointer() {
  if (!canUseLaserPointer()) return;

  laserPointerEnabled = !laserPointerEnabled;
  laserPointerTransient = false;

  if (laserPointerEnabled) {
    showLaserPointer();
    return;
  }

  hideLaserPointer();
}

function startTransientLaserPointer(event) {
  if (!canUseLaserPointer()) return false;

  laserPointerTransient = true;
  suppressClickReveal = true;
  showLaserPointer(event.clientX, event.clientY);
  return true;
}

function stopTransientLaserPointer() {
  if (!laserPointerTransient) return;

  laserPointerTransient = false;
  if (laserPointerEnabled) {
    syncLaserPointer();
    return;
  }

  hideLaserPointer();
}

function handleLaserPointerMove(event) {
  rememberLaserPointerPosition(event.clientX, event.clientY);
  if (!canUseLaserPointer()) return;
  if (!laserPointerEnabled && !laserPointerTransient) return;
  showLaserPointer(event.clientX, event.clientY);
}

function getPenContext() {
  const layer = getPenLayerElement();
  return layer ? layer.getContext('2d') : null;
}

function resizePenLayer({ preserveInk = true } = {}) {
  const layer = getPenLayerElement();
  if (!layer) return;

  const previousWidth = layer.width;
  const previousHeight = layer.height;
  const snapshot = preserveInk && penHasInk && previousWidth > 0 && previousHeight > 0
    ? (() => {
        const buffer = document.createElement('canvas');
        buffer.width = previousWidth;
        buffer.height = previousHeight;
        buffer.getContext('2d')?.drawImage(layer, 0, 0);
        return buffer;
      })()
    : null;

  const devicePixelRatio = window.devicePixelRatio || 1;
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;

  layer.width = Math.max(1, Math.round(cssWidth * devicePixelRatio));
  layer.height = Math.max(1, Math.round(cssHeight * devicePixelRatio));
  layer.style.width = `${cssWidth}px`;
  layer.style.height = `${cssHeight}px`;

  const context = layer.getContext('2d');
  if (!context) return;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(devicePixelRatio, devicePixelRatio);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = '#ff3b3b';
  context.fillStyle = '#ff3b3b';
  context.lineWidth = 4;

  if (snapshot) {
    context.drawImage(snapshot, 0, 0, previousWidth, previousHeight, 0, 0, cssWidth, cssHeight);
  }
}

function syncPenLayer() {
  const layer = getPenLayerElement();
  if (!layer) return;

  const shouldShow = !isOverviewMode && !isEditMode && (penToolEnabled || penHasInk);
  layer.hidden = !shouldShow;
  layer.classList.toggle('is-visible', shouldShow);
  layer.classList.toggle('is-active', shouldShow && penToolEnabled);
  document.body.classList.toggle('pen-tool-active', shouldShow && penToolEnabled);
}

function clearPenInk() {
  const layer = getPenLayerElement();
  const context = getPenContext();
  if (layer && context) {
    context.clearRect(0, 0, layer.width, layer.height);
  }

  penHasInk = false;
  penIsDrawing = false;
  penLastPoint = null;
  syncPenLayer();
}

function disablePenTool({ clearInk = false } = {}) {
  penToolEnabled = false;
  penIsDrawing = false;
  penLastPoint = null;

  if (clearInk) {
    clearPenInk();
    return;
  }

  syncPenLayer();
}

function togglePenTool() {
  if (!canUsePenTool()) return;

  penToolEnabled = !penToolEnabled;
  penIsDrawing = false;
  penLastPoint = null;

  if (penToolEnabled) {
    disableLaserPointer();
  }

  syncPenLayer();
}

function drawPenSegment(fromPoint, toPoint) {
  const context = getPenContext();
  if (!context || !fromPoint || !toPoint) return;

  context.beginPath();
  context.moveTo(fromPoint.x, fromPoint.y);
  context.lineTo(toPoint.x, toPoint.y);
  context.stroke();
  penHasInk = true;
}

function startPenStroke(event) {
  if (!penToolEnabled || !canUsePenTool() || event.button !== 0) return false;
  if (event.target.closest('.style-toolbar')) return false;

  const point = { x: event.clientX, y: event.clientY };
  penIsDrawing = true;
  penLastPoint = point;
  penHasInk = true;
  suppressClickReveal = true;

  drawPenSegment(point, point);
  syncPenLayer();
  return true;
}

function continuePenStroke(event) {
  if (!penToolEnabled || !penIsDrawing) return false;

  const point = { x: event.clientX, y: event.clientY };
  drawPenSegment(penLastPoint, point);
  penLastPoint = point;
  return true;
}

function stopPenStroke() {
  if (!penIsDrawing) return;
  penIsDrawing = false;
  penLastPoint = null;
  syncPenLayer();
}

