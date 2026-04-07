(function () {
  const { helpers, slideTemplates } = window.PYUVM_TEMPLATES;
  const { createDeckBuilder, validateSlideIndices } = window.PYUVM_SLIDE_SUPPORT;
  const sectionBuilders = window.PYUVM_SLIDE_SECTION_BUILDERS || [];
  const deck = createDeckBuilder();
  const assets = window.PYUVM_SLIDE_ASSETS || {};

  const slides = sectionBuilders.flatMap((buildSection) =>
    buildSection({
      deck,
      helpers,
      templates: slideTemplates,
      assets
    })
  );

  const indices = validateSlideIndices(slides);

  window.PYUVM_SLIDES = slides;
  window.PYUVM_SLIDE_METADATA = {
    count: deck.getCount(),
    indices
  };
})();
