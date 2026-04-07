renderPresentationFromData();
applyEditorEnhancements();
resizePenLayer({ preserveInk: false });
syncPenLayer();
setupFigureDragging();
updateSlideCounterMetrics();
setSlideState(slides[currentSlide], SLIDE_STATE.RESET);
recordHistory();
