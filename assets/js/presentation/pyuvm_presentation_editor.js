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

  if (isEditMode) {
    disableLaserPointer();
    disablePenTool();
  }

  if (!isEditMode) {
    document.activeElement?.blur?.();
    clearSelection();
  }

  makeSlidesEditable();
  makeBlocksMovable();
  document.body.classList.toggle('edit-mode', isEditMode);
  syncPenLayer();
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

