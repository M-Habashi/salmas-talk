(function () {
  const registry = window.PYUVM_SLIDE_SECTION_BUILDERS || [];

  function registerSlideSection(builder) {
    registry.push(builder);
    window.PYUVM_SLIDE_SECTION_BUILDERS = registry;
  }

  function createDeckBuilder() {
    let index = 0;

    return {
      slide(buildSlide) {
        index += 1;
        return buildSlide(index);
      },
      getCount() {
        return index;
      }
    };
  }

  function buildOutlineSlide({ helpers, index, tag, title, topics }) {
    const cards = topics.map((topic, topicIndex) =>
      `<div class="outline-item anim-up d${topicIndex + 2}">` +
        `<span class="outline-num">${topic.num}</span>` +
        `<div class="outline-body"><strong>${topic.title}</strong></div>` +
      '</div>'
    ).join('');

    return helpers.standardSlide({
      index,
      tag,
      title,
      content: `<div class="outline-grid">${cards}</div>`
    });
  }

  function buildProblemGridSlide({ helpers, index, tag, title, problems }) {
    const cards = problems.map((problem) =>
      '<div class="problem-card click-reveal-item">' +
        `<span class="problem-num">${problem.num}</span>` +
        '<div class="problem-content">' +
          `<strong>${problem.title}</strong>` +
          `<span class="problem-desc">${problem.desc}</span>` +
        '</div>' +
      '</div>'
    ).join('');

    return helpers.standardSlide({
      index,
      tag,
      title,
      clickReveal: true,
      slideClass: 'problem-grid-slide',
      content: `<div class="problem-grid anim-up d2">${cards}</div>`
    });
  }

  function extractSlideIndex(slideMarkup) {
    const match = slideMarkup.match(/\bdata-slide="(\d+)"/);
    return match ? Number(match[1]) : NaN;
  }

  function validateSlideIndices(slides) {
    const indices = slides.map(extractSlideIndex);
    const contiguous = indices.every((index, position) => index === position + 1);

    if (!contiguous) {
      throw new Error('Slide indices must stay contiguous and aligned with rendered slide order.');
    }

    return indices;
  }

  window.PYUVM_SLIDE_SECTION_BUILDERS = registry;
  window.PYUVM_SLIDE_SUPPORT = {
    registerSlideSection,
    createDeckBuilder,
    buildOutlineSlide,
    buildProblemGridSlide,
    validateSlideIndices
  };
})();
