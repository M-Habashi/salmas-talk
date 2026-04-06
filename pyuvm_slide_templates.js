(function () {
  function cx() {
    return Array.from(arguments).flat().filter(Boolean).join(' ');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function wrap(tag, content, classes, attrs) {
    const classAttr = classes ? ` class="${classes}"` : '';
    const extraAttrs = attrs ? ` ${attrs}` : '';
    return `<${tag}${classAttr}${extraAttrs}>${content}</${tag}>`;
  }

  function sectionStack(parts, classes) {
    return wrap('div', parts.filter(Boolean).join(''), cx('section-stack', classes));
  }

  function list(items, options) {
    const config = options || {};
    const tag = config.ordered ? 'ol' : 'ul';
    return wrap(tag, items.map((item) => wrap('li', item)).join(''), config.classes || (config.ordered ? '' : 'bullet-list'));
  }

  function codeBlock(lines, options) {
    const config = options || {};
    const code = Array.isArray(lines) ? lines.join('\n') : String(lines);
    return wrap('pre', `<span class="lang-tag">${escapeHtml(config.lang || 'python')}</span>${escapeHtml(code)}`, cx('code-block', config.classes));
  }

  function paragraph(content, classes) {
    return wrap('p', content, classes);
  }

  function heading(level, content, classes) {
    return wrap(level, content, classes);
  }

  function card(config) {
    const body = Array.isArray(config.body) ? config.body.join('') : config.body;
    const icon = config.icon ? `<span class="card-icon">${config.icon}</span>` : '';
    const title = config.title ? wrap('h4', config.title, config.titleTone || '') : '';
    const classes = cx('card', config.reveal && 'click-reveal-item', config.cardTone && `card--${config.cardTone}`, config.classes);
    return wrap('div', `${icon}${title}${body || ''}`, classes);
  }

  function cardGrid(cards, classes) {
    return wrap('div', cards.join(''), cx('card-grid', classes));
  }

  function split(left, right, classes) {
    return wrap('div', `${left}${right}`, classes || 'two-col');
  }

  function compareItem(config) {
    const badgeClass = config.positive ? 'check' : 'cross';
    return wrap('div', `<span class="${badgeClass}">${escapeHtml(config.label)}</span><span>${config.text}</span>`, cx('compare-item', config.positive && 'positive', config.classes));
  }

  function compareRow(left, right) {
    return wrap('div', `${left}${right}`, 'compare-row');
  }

  function phaseBar(phases) {
    return wrap('div', phases.map((phase, index) => wrap('div', phase, `phase p${index + 1}`)).join(''), 'phase-bar anim-up d2');
  }

  function classTree(nodes) {
    return wrap('div', nodes.map((node) => {
      const branch = node.branch ? wrap('span', escapeHtml(node.branch), 'branch') : '';
      const name = wrap('span', escapeHtml(node.name), `node-name ${node.tone}`);
      return wrap('div', `${branch}${name}`, `node ${node.level ? `l${node.level}` : ''}`.trim());
    }).join(''), 'class-tree');
  }

  function stackDiagram(layers) {
    return wrap('div', layers.map((layer, index) => {
      const box = wrap('div', `<strong>${layer.title}</strong>${wrap('span', layer.label, 'layer-label')}`, `stack-layer l${index + 1}`);
      return `${index > 0 ? wrap('div', '|', 'stack-connector') : ''}${box}`;
    }).join(''), 'stack-diagram');
  }

  function toolCard(config) {
    return wrap('div', `${wrap('h4', config.title, config.tone || '')}${wrap('div', config.subtitle, 'tool-sub')}${wrap('ul', config.items.map((item) => wrap('li', item)).join(''))}`, 'tool-card');
  }

  function resources(entries) {
    return wrap('ul', entries.map((entry) => wrap('li', `${wrap('span', escapeHtml(entry.label), 'r-label')}${wrap('span', escapeHtml(entry.value), 'r-value')}`)).join(''), 'resource-list');
  }

  function tlmTypeCard(config) {
    return wrap('div', [
      wrap('div', config.chip, `tlm-type-chip tone-chip tone-chip--${config.tone}`),
      wrap('h3', config.title),
      paragraph(config.copy, 'tlm-type-copy'),
      config.figure,
      codeBlock(config.code, { lang: 'python', classes: 'tlm-mini-code' })
    ].join(''), 'tlm-type-card');
  }

  function standardSlide(config) {
    const titleTag = config.titleTag || 'h2';
    return wrap('div', [
      wrap('div', config.tag, 'slide-tag anim-up'),
      wrap(titleTag, config.title, 'anim-up d1'),
      config.intro || '',
      config.content
    ].join(''), cx('slide', config.slideClass), `${config.clickReveal ? 'data-click-reveal="true" ' : ''}data-slide="${config.index}"`);
  }

  const helpers = {
    cx, escapeHtml, wrap, sectionStack, list, codeBlock, paragraph, heading, card, cardGrid, split,
    compareItem, compareRow, phaseBar, classTree, stackDiagram, toolCard, resources, tlmTypeCard, standardSlide
  };

  const slideTemplates = {
    titleHeroSlide(config) {
      return wrap('div', [
        wrap('div', `<span class="dot"></span>${config.badge}`, 'title-badge anim-up'),
        wrap('h1', config.title, 'anim-up d1'),
        paragraph(config.author, 'subtitle anim-up d2'),
        paragraph(config.subtitle, 'subtitle hero-subtitle anim-up d3'),
        wrap('div', config.chips.map((chip) => wrap('span', chip, 'chip')).join(''), 'title-decoration anim-up d4')
      ].join(''), 'slide title-slide active', `data-slide="${config.index}"`);
    },
    agendaSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: list(config.items, { ordered: true, classes: 'toc-list anim-up d2' }) });
    },
    infoSplitSlide(config) {
      return standardSlide({
        index: config.index, tag: config.tag, title: config.title,
        content: split(wrap('div', list(config.bullets), 'content-section anim-up d2'), sectionStack(config.aside, 'anim-up d3'))
      });
    },
    revealCardGridSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, clickReveal: true, content: cardGrid(config.cards.map((cardConfig) => card({ ...cardConfig, reveal: true })), 'anim-up d2') });
    },
    comparisonRowsSlide(config) {
      return standardSlide({
        index: config.index, tag: config.tag, title: config.title,
        content: [wrap('div', config.rows.map((row) => compareRow(compareItem(row[0]), compareItem(row[1]))).join(''), 'anim-up d2'), wrap('div', '', 'spacer'), cardGrid(config.cards.map(card), 'grid-3 anim-up d3')].join('')
      });
    },
    hierarchySlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: split(sectionStack([heading('h3', config.leftTitle, 'anim-up d2'), config.leftContent]), sectionStack([heading('h3', config.rightTitle, 'anim-up d3'), list(config.bullets), wrap('div', '', 'spacer'), config.footerCard], 'content-section')) });
    },
    phaseExampleSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: [phaseBar(config.phases), split(wrap('div', list(config.bullets), 'content-section anim-up d3'), sectionStack([heading('h3', config.codeTitle), codeBlock(config.code)], 'anim-up d3'))].join('') });
    },
    tlmOverviewSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: split(sectionStack([list(config.bullets), wrap('div', '', 'spacer'), config.callout], 'content-section anim-up d2'), sectionStack([heading('h3', config.codeTitle, 'anim-up d3'), codeBlock(config.code), wrap('div', '', 'spacer'), config.footerCard], 'anim-up d3')) });
    },
    tlmTypesSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, intro: paragraph(config.intro, 'tlm-intro anim-up d2'), content: wrap('div', config.cards.map(tlmTypeCard).join(''), 'tlm-type-grid anim-up d3') });
    },
    architectureSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: split(wrap('div', config.diagram, 'anim-up d2'), sectionStack([list(config.bullets), wrap('div', '', 'spacer'), config.footerCard], 'content-section anim-up d3')) });
    },
    conceptSplitSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: split(sectionStack([list(config.bullets), wrap('div', '', 'spacer'), config.callout], 'content-section anim-up d2'), sectionStack([heading('h3', config.rightTitle, 'anim-up d3'), codeBlock(config.code), config.note ? paragraph(config.note, config.noteClass || 'fine-print') : ''], 'anim-up d3')) });
    },
    stackWorkflowSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: split(wrap('div', stackDiagram(config.layers), 'anim-up d2'), sectionStack([config.rightTitle ? heading('h3', config.rightTitle, 'anim-up d3') : '', list(config.bullets), wrap('div', '', 'spacer'), codeBlock(config.code, config.codeOptions)], 'content-section anim-up d3')) });
    },
    toolGridSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: [cardGrid(config.tools.map(toolCard), 'anim-up d2'), wrap('div', '', 'spacer'), cardGrid(config.bottomCards.map(card), 'grid-2 anim-up d3')].join('') });
    },
    codePairSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: [split(sectionStack([heading('h3', config.leftTitle), codeBlock(config.leftCode)]), sectionStack([heading('h3', config.rightTitle), codeBlock(config.rightCode)]), 'two-col anim-up d2'), wrap('div', '', 'spacer'), cardGrid(config.bottomCards.map(card), 'grid-2 anim-up d3')].join('') });
    },
    roadmapSlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: split(wrap('div', list(config.bullets), 'content-section anim-up d2'), sectionStack([heading('h3', config.rightTitle, 'anim-up d3'), ...config.cards], 'anim-up d3')) });
    },
    summarySlide(config) {
      return standardSlide({ index: config.index, tag: config.tag, title: config.title, content: [cardGrid(config.topCards.map(card), 'grid-3 anim-up d2'), wrap('div', '', 'spacer anim-up d3'), list(config.bullets, { classes: 'bullet-list anim-up d3' })].join('') });
    },
    resourcesSlide(config) {
      return wrap('div', [
        wrap('div', config.tag, 'slide-tag anim-up slide-tag--center'),
        wrap('h1', config.title, 'anim-up d1 thanks-title'),
        paragraph(config.subtitle, 'subtitle subtitle--center anim-up d2'),
        wrap('div', [heading('h3', config.resourcesTitle, 'resources-heading'), resources(config.resources)].join(''), 'anim-up d3 resource-panel')
      ].join(''), 'slide thankyou-slide', `data-slide="${config.index}"`);
    }
  };

  window.PYUVM_TEMPLATES = { helpers, slideTemplates };
})();
