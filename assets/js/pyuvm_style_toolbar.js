(function () {
  const FONT_PRESETS = {
    body: { fontFamily: 'var(--font-display)', fontStyle: 'normal', fontWeight: '400' },
    display: { fontFamily: 'var(--font-display)', fontStyle: 'normal', fontWeight: '700' },
    serif: { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400' },
    mono: { fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontWeight: '500' }
  };
  const FONT_SIZES = {
    14: '14px',
    16: '16px',
    18: '18px',
    20: '20px',
    24: '24px'
  };

  const COLOR_TOKENS = [
    { name: 'primary', value: 'var(--text-primary)' },
    { name: 'secondary', value: 'var(--text-secondary)' },
    { name: 'blue', value: 'var(--accent-blue)' },
    { name: 'cyan', value: 'var(--accent-cyan)' },
    { name: 'violet', value: 'var(--accent-violet)' },
    { name: 'amber', value: 'var(--accent-amber)' },
    { name: 'rose', value: 'var(--accent-rose)' },
    { name: 'green', value: 'var(--accent-green)' }
  ];

  let toolbar;
  let presetSelect;
  let sizeSelect;
  let boldButton;
  let italicButton;
  let underlineButton;
  let colorToggleButton;
  let alignToggleButton;
  let swatchContainer;
  let alignmentContainer;
  let currentElement = null;
  let savedRange = null;

  function readStyle(element) {
    const style = window.getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
      fontSize: style.fontSize,
      color: style.color,
      textDecorationLine: style.textDecorationLine
    };
  }

  function positionToolbar(element) {
    const rect = element.getBoundingClientRect();
    const top = Math.max(16, rect.top - toolbar.offsetHeight - 14);
    const left = Math.min(window.innerWidth - toolbar.offsetWidth - 16, Math.max(16, rect.left + (rect.width - toolbar.offsetWidth) / 2));
    toolbar.style.transform = `translate(${left}px, ${top}px)`;
  }

  function setActiveSwatch(color) {
    Array.from(swatchContainer.querySelectorAll('.style-swatch')).forEach((button) => {
      button.classList.toggle('is-active', button.dataset.color === color);
    });
  }

  function setActiveAlignment(value) {
    Array.from(alignmentContainer.querySelectorAll('.style-align-btn')).forEach((button) => {
      button.classList.toggle('is-active', button.dataset.align === value);
    });
  }

  function getSelectionRange() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!currentElement) return null;
    const common = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    return common && currentElement.contains(common) ? range : null;
  }

  function captureSelection() {
    const range = getSelectionRange();
    savedRange = range ? range.cloneRange() : null;
  }

  function restoreSelection() {
    if (!savedRange) return false;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
    return true;
  }

  function exec(command, value) {
    if (!currentElement) return;
    currentElement.focus();
    restoreSelection();
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(command, false, value);
    captureSelection();
    notifyHistory();
  }

  function resolveTokenValue(tokenValue) {
    const match = tokenValue.match(/var\((--[^)]+)\)/);
    return match ? getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() : tokenValue;
  }

  function syncControls(element) {
    const style = readStyle(element);
    presetSelect.value = element.dataset.fontPreset ||
      (style.fontFamily.includes('JetBrains Mono') ? 'mono' :
      style.fontFamily.includes('Instrument Serif') ? 'serif' :
      Number(style.fontWeight) >= 700 ? 'display' : 'body');
    sizeSelect.value = element.dataset.fontSizePreset ||
      (parseFloat(style.fontSize) >= 22 ? '24' :
      parseFloat(style.fontSize) >= 19 ? '20' :
      parseFloat(style.fontSize) >= 17 ? '18' :
      parseFloat(style.fontSize) <= 15 ? '14' : '16');
    boldButton.classList.toggle('is-active', Number(style.fontWeight) >= 700);
    italicButton.classList.toggle('is-active', style.fontStyle === 'italic');
    underlineButton.classList.toggle('is-active', style.textDecorationLine.includes('underline'));
    setActiveSwatch(element.dataset.colorToken || '');
    setActiveAlignment(element.dataset.textAlign || style.textAlign || 'left');
  }

  function hideToolbar() {
    toolbar.classList.add('is-hidden');
    swatchContainer.classList.add('is-hidden');
    colorToggleButton.classList.remove('is-active');
    alignmentContainer.classList.add('is-hidden');
    alignToggleButton.classList.remove('is-active');
    currentElement = null;
    savedRange = null;
  }

  function notifyHistory() {
    window.PYUVM_EDITOR?.scheduleHistoryRecord?.();
  }

  function applyPreset(value) {
    if (!currentElement || !FONT_PRESETS[value]) return;
    exec('fontName', resolveTokenValue(FONT_PRESETS[value].fontFamily));
    currentElement.dataset.fontPreset = value;
    syncControls(currentElement);
  }

  function applySize(value) {
    if (!currentElement || !FONT_SIZES[value]) return;
    exec('fontSize', '7');
    currentElement.querySelectorAll('font[size="7"]').forEach((node) => {
      node.removeAttribute('size');
      node.style.fontSize = FONT_SIZES[value];
    });
    currentElement.dataset.fontSizePreset = value;
    syncControls(currentElement);
  }

  function toggleInlineStyle(command, button) {
    if (!currentElement) return;
    exec(command);
    captureSelection();
    syncControls(currentElement);
    button.classList.toggle('is-active', !button.classList.contains('is-active'));
  }

  function applyColor(color) {
    if (!currentElement) return;
    exec('foreColor', resolveTokenValue(color));
    currentElement.dataset.colorToken = COLOR_TOKENS.find((entry) => entry.value === color)?.name || currentElement.dataset.colorToken || '';
    setActiveSwatch(currentElement.dataset.colorToken);
    swatchContainer.classList.add('is-hidden');
    colorToggleButton.classList.remove('is-active');
  }

  function applyAlignment(value) {
    if (!currentElement) return;
    currentElement.style.textAlign = value;
    currentElement.dataset.textAlign = value;
    setActiveAlignment(value);
    alignmentContainer.classList.add('is-hidden');
    alignToggleButton.classList.remove('is-active');
    notifyHistory();
  }

  function buildSwatches() {
    swatchContainer.innerHTML = COLOR_TOKENS.map((token) =>
      `<button type="button" class="style-swatch" data-color="${token.name}" aria-label="${token.name}" style="background:${token.value}"></button>`
    ).join('');

    swatchContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.style-swatch');
      if (!button) return;
      const token = COLOR_TOKENS.find((entry) => entry.name === button.dataset.color);
      if (token) applyColor(token.value);
    });
  }

  function handleSelectionChange(event) {
    const { element, isEditMode } = event.detail || {};
    if (!isEditMode || !element || element.tagName === 'IMG') {
      hideToolbar();
      return;
    }

    currentElement = element;
    toolbar.classList.remove('is-hidden');
    positionToolbar(element);
    syncControls(element);
    captureSelection();
  }

  function togglePalette() {
    const willShow = swatchContainer.classList.contains('is-hidden');
    swatchContainer.classList.toggle('is-hidden', !willShow);
    colorToggleButton.classList.toggle('is-active', willShow);
    alignmentContainer.classList.add('is-hidden');
    alignToggleButton.classList.remove('is-active');
  }

  function toggleAlignments() {
    const willShow = alignmentContainer.classList.contains('is-hidden');
    alignmentContainer.classList.toggle('is-hidden', !willShow);
    alignToggleButton.classList.toggle('is-active', willShow);
    swatchContainer.classList.add('is-hidden');
    colorToggleButton.classList.remove('is-active');
  }

  function init() {
    toolbar = document.getElementById('styleToolbar');
    presetSelect = document.getElementById('stylePreset');
    sizeSelect = document.getElementById('styleSize');
    boldButton = document.getElementById('styleBold');
    italicButton = document.getElementById('styleItalic');
    underlineButton = document.getElementById('styleUnderline');
    colorToggleButton = document.getElementById('styleColorToggle');
    alignToggleButton = document.getElementById('styleAlignToggle');
    swatchContainer = document.getElementById('styleSwatches');
    alignmentContainer = document.getElementById('styleAlignments');
    if (!toolbar || !presetSelect || !sizeSelect || !boldButton || !italicButton || !underlineButton || !colorToggleButton || !alignToggleButton || !swatchContainer || !alignmentContainer) return;

    buildSwatches();
    toolbar.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      if (event.target.closest('button')) {
        event.preventDefault();
      }
    });
    toolbar.addEventListener('click', (event) => event.stopPropagation());
    presetSelect.addEventListener('change', (event) => applyPreset(event.target.value));
    sizeSelect.addEventListener('change', (event) => applySize(event.target.value));
    boldButton.addEventListener('click', () => toggleInlineStyle('bold', boldButton));
    italicButton.addEventListener('click', () => toggleInlineStyle('italic', italicButton));
    underlineButton.addEventListener('click', () => toggleInlineStyle('underline', underlineButton));
    colorToggleButton.addEventListener('click', togglePalette);
    alignToggleButton.addEventListener('click', toggleAlignments);
    alignmentContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.style-align-btn');
      if (!button) return;
      applyAlignment(button.dataset.align);
    });

    document.addEventListener('pyuvm-selection-change', handleSelectionChange);
    document.addEventListener('pyuvm-edit-mode-change', (event) => {
      if (!event.detail?.isEditMode) hideToolbar();
    });
    document.addEventListener('click', () => {
      swatchContainer.classList.add('is-hidden');
      colorToggleButton.classList.remove('is-active');
      alignmentContainer.classList.add('is-hidden');
      alignToggleButton.classList.remove('is-active');
    });
    window.addEventListener('resize', () => {
      if (currentElement && !toolbar.classList.contains('is-hidden')) positionToolbar(currentElement);
    });
    document.addEventListener('selectionchange', captureSelection);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
