(function () {
  const FONT_PRESETS = {
    body: { fontFamily: 'var(--font-display)', fontStyle: 'normal', fontWeight: '400' },
    display: { fontFamily: 'var(--font-display)', fontStyle: 'normal', fontWeight: '700' },
    serif: { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400' },
    mono: { fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontWeight: '500' }
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
  let boldButton;
  let italicButton;
  let underlineButton;
  let swatchContainer;
  let currentElement = null;

  function readStyle(element) {
    const style = window.getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
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

  function syncControls(element) {
    const style = readStyle(element);
    presetSelect.value = element.dataset.fontPreset ||
      (style.fontFamily.includes('JetBrains Mono') ? 'mono' :
      style.fontFamily.includes('Instrument Serif') ? 'serif' :
      Number(style.fontWeight) >= 700 ? 'display' : 'body');
    boldButton.classList.toggle('is-active', Number(style.fontWeight) >= 700);
    italicButton.classList.toggle('is-active', style.fontStyle === 'italic');
    underlineButton.classList.toggle('is-active', style.textDecorationLine.includes('underline'));
    setActiveSwatch(element.dataset.colorToken || '');
  }

  function hideToolbar() {
    toolbar.classList.add('is-hidden');
    currentElement = null;
  }

  function notifyHistory() {
    window.PYUVM_EDITOR?.scheduleHistoryRecord?.();
  }

  function applyPreset(value) {
    if (!currentElement || !FONT_PRESETS[value]) return;
    Object.assign(currentElement.style, FONT_PRESETS[value]);
    currentElement.dataset.fontPreset = value;
    syncControls(currentElement);
    notifyHistory();
  }

  function toggleInlineStyle(key, activeValue, inactiveValue, button) {
    if (!currentElement) return;
    const current = window.getComputedStyle(currentElement)[key];
    currentElement.style[key] = current === activeValue ? inactiveValue : activeValue;
    button.classList.toggle('is-active', currentElement.style[key] === activeValue);
    notifyHistory();
  }

  function applyColor(color) {
    if (!currentElement) return;
    currentElement.style.color = color;
    currentElement.dataset.colorToken = COLOR_TOKENS.find((entry) => entry.value === color)?.name || '';
    setActiveSwatch(currentElement.dataset.colorToken);
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
  }

  function init() {
    toolbar = document.getElementById('styleToolbar');
    presetSelect = document.getElementById('stylePreset');
    boldButton = document.getElementById('styleBold');
    italicButton = document.getElementById('styleItalic');
    underlineButton = document.getElementById('styleUnderline');
    swatchContainer = document.getElementById('styleSwatches');
    if (!toolbar || !presetSelect || !boldButton || !italicButton || !underlineButton || !swatchContainer) return;

    buildSwatches();
    presetSelect.addEventListener('change', (event) => applyPreset(event.target.value));
    boldButton.addEventListener('click', () => toggleInlineStyle('fontWeight', '700', '400', boldButton));
    italicButton.addEventListener('click', () => toggleInlineStyle('fontStyle', 'italic', 'normal', italicButton));
    underlineButton.addEventListener('click', () => toggleInlineStyle('textDecorationLine', 'underline', 'none', underlineButton));

    document.addEventListener('pyuvm-selection-change', handleSelectionChange);
    document.addEventListener('pyuvm-edit-mode-change', (event) => {
      if (!event.detail?.isEditMode) hideToolbar();
    });
    window.addEventListener('resize', () => {
      if (currentElement && !toolbar.classList.contains('is-hidden')) positionToolbar(currentElement);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
