(function () {
  const { helpers: h, slideTemplates: t } = window.PYUVM_TEMPLATES;

  const demoArchitecture = [
    '<div class="arch-diagram">',
    '  <div class="arch-level"><div class="arch-box tone-frame tone-frame--blue arch-box--wide">Header</div></div>',
    '  <div class="arch-connector">|</div>',
    '  <div class="arch-container tone-dash tone-dash--cyan"><span class="arch-label tone-cyan">Container</span><div class="arch-container-inner">',
    '    <div class="arch-row"><div class="arch-box tone-frame tone-frame--amber arch-box--micro">Left</div><div class="arch-box tone-frame tone-frame--green arch-box--micro">Right</div></div>',
    '  </div></div>',
    '  <div class="arch-connector">|</div>',
    '  <div class="arch-level"><div class="arch-box tone-frame tone-frame--muted arch-box--wide">Footer</div></div>',
    '</div>'
  ].join('');

  const slides = [
    t.titleHeroSlide({
      index: 1,
      badge: 'LAYOUT TEMPLATE',
      title: 'titleHeroSlide',
      author: 'Hero layout template',
      subtitle: 'Use this for title pages, section openers, and branded introductions.',
      chips: ['badge', 'author', 'subtitle', 'chips']
    }),
    t.agendaSlide({
      index: 2,
      tag: 'Template',
      title: 'agendaSlide',
      items: ['Ordered list layout', 'Good for table of contents', 'Supports long lists', 'Keeps typography consistent', 'Best for navigation slides']
    }),
    t.focusCardsSlide({
      index: 3,
      title: 'focusCardsSlide',
      lead: 'One focused card at a time',
      cards: [
        { icon: '01', title: 'Focused Progression', body: h.paragraph('Presents a single card in the center, then collapses prior cards into a compact stack.') },
        { icon: '02', title: 'Good For Definitions', body: h.paragraph('Useful for concept introductions, step-by-step teaching, or any slide that should stay visually concentrated.') },
        { icon: '03', title: 'Built For Click Through', body: h.paragraph('Each click advances to the next card while keeping previous points visible as compressed context.') }
      ]
    }),
    t.infoSplitSlide({
      index: 4,
      tag: 'Template',
      title: 'infoSplitSlide',
      bullets: ['Left column uses standard bullet rhythm.', 'Right column can hold any stacked content blocks.', 'Good for concept + example or explanation + callout.'],
      aside: [h.heading('h3', 'Right Side Stack', 'anim-up d3'), h.card({ body: [h.wrap('h4', 'Primary callout', 'tone-blue'), h.paragraph('Place one or more cards, code samples, or explanatory blocks here.')] })]
    }),
    t.revealCardGridSlide({
      index: 5,
      tag: 'Template',
      title: 'revealCardGridSlide',
      cards: [
        { icon: '01', title: 'Card One', body: h.paragraph('Reveal cards sequentially.') },
        { icon: '02', title: 'Card Two', body: h.paragraph('Good for benefits or principles.') },
        { icon: '03', title: 'Card Three', body: h.paragraph('Balanced grid layout.') },
        { icon: '04', title: 'Card Four', body: h.paragraph('Uses click-reveal behavior.') }
      ]
    }),
    t.comparisonRowsSlide({
      index: 6,
      tag: 'Template',
      title: 'comparisonRowsSlide',
      rows: [
        [{ label: 'A', text: 'Left comparison row.' }, { label: 'B', text: 'Right comparison row.', positive: true }],
        [{ label: 'A', text: 'Repeat as needed.' }, { label: 'B', text: 'Works well for before/after.', positive: true }]
      ],
      cards: [
        h.card({ cardTone: 'blue', body: [h.wrap('h4', 'Summary A', 'tone-blue'), h.paragraph('Bottom supporting card.')] }),
        h.card({ cardTone: 'cyan', body: [h.wrap('h4', 'Summary B', 'tone-cyan'), h.paragraph('Bottom supporting card.')] }),
        h.card({ cardTone: 'green', body: [h.wrap('h4', 'Summary C', 'tone-green'), h.paragraph('Bottom supporting card.')] })
      ]
    }),
    t.hierarchySlide({
      index: 7,
      tag: 'Template',
      title: 'hierarchySlide',
      leftTitle: 'Left Structure',
      leftContent: h.classTree([{ name: 'Root', tone: 'blue' }, { name: 'Branch', tone: 'cyan', branch: '|- ', level: 1 }, { name: 'Leaf', tone: 'green', branch: '`- ', level: 2 }]),
      rightTitle: 'Right Explanation',
      bullets: ['Great for trees, taxonomies, and layered explanations.', 'Left side can be any custom structure block.', 'Right side keeps a consistent explanatory rhythm.'],
      footerCard: h.card({ body: [h.wrap('h4', 'Footer Card', 'tone-cyan'), h.paragraph('Optional supporting note or mapping.')] })
    }),
    t.phaseExampleSlide({
      index: 8,
      tag: 'Template',
      title: 'phaseExampleSlide',
      phases: ['one', 'two', 'three', 'four', 'five'],
      bullets: ['Top timeline/phase strip anchors the flow.', 'Left column explains each phase.', 'Right column carries the concrete example.'],
      codeTitle: 'Example block',
      code: ['step_one()', 'step_two()', 'step_three()']
    }),
    t.tlmOverviewSlide({
      index: 9,
      tag: 'Template',
      title: 'tlmOverviewSlide',
      bullets: ['Left column handles the explanation.', 'Middle spacer is built in.', 'Right column pairs code with a supporting card.'],
      callout: h.card({ body: [h.wrap('h4', 'Left Callout', 'tone-cyan'), h.paragraph('Use this to spotlight a repo-specific or product-specific detail.')] }),
      codeTitle: 'Code pattern',
      code: ['producer.connect(consumer)', 'await producer.send(item)'],
      footerCard: h.card({ body: [h.wrap('h4', 'Mental model', 'tone-green'), h.paragraph('Short conceptual summary at the end.')] })
    }),
    t.tlmTypesSlide({
      index: 10,
      tag: 'Template',
      title: 'tlmTypesSlide',
      intro: 'Use this for any 3-up pattern comparison with a chip, explanation, figure, and code snippet.',
      cards: [
        { chip: 'alpha', tone: 'violet', title: 'Pattern One', copy: 'Card layout for first pattern.', figure: h.wrap('div', [h.wrap('div', 'A', 'diagram-box violet'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'B', 'diagram-box cyan')].join(''), 'tlm-mini-figure'), code: ['alpha()', 'beta()'] },
        { chip: 'beta', tone: 'cyan', title: 'Pattern Two', copy: 'Card layout for second pattern.', figure: h.wrap('div', [h.wrap('div', 'B', 'diagram-box cyan'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'C', 'diagram-box amber')].join(''), 'tlm-mini-figure'), code: ['gamma()', 'delta()'] },
        { chip: 'gamma', tone: 'green', title: 'Pattern Three', copy: 'Card layout for third pattern.', figure: h.wrap('div', [h.wrap('div', 'C', 'diagram-box green'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'D', 'diagram-box blue')].join(''), 'tlm-mini-figure'), code: ['epsilon()', 'zeta()'] }
      ]
    }),
    t.architectureSlide({
      index: 11,
      tag: 'Template',
      title: 'architectureSlide',
      diagram: demoArchitecture,
      bullets: ['Use when the left side needs a composed architecture or system diagram.', 'Right side remains a clean bullet explanation column.', 'Footer card is optional but recommended.'],
      footerCard: h.card({ body: [h.wrap('h4', 'Diagram Note', 'tone-green'), h.paragraph('Explain one key takeaway from the structure.')] })
    }),
    t.conceptSplitSlide({
      index: 12,
      tag: 'Template',
      title: 'conceptSplitSlide',
      bullets: ['Good for concept on the left and code on the right.', 'Supports a left-side callout card.', 'Optional note under the code block.'],
      callout: h.card({ body: [h.wrap('h4', 'Concept Callout', 'tone-amber'), h.paragraph('Use for rationale, warning, or explanation.')] }),
      rightTitle: 'Code Example',
      code: ['function example() {', '  return true;', '}'],
      note: 'Optional note text under the code block.'
    }),
    t.stackWorkflowSlide({
      index: 13,
      tag: 'Template',
      title: 'stackWorkflowSlide',
      layers: [{ title: 'Layer 1', label: 'Top level' }, { title: 'Layer 2', label: 'Second level' }, { title: 'Layer 3', label: 'Third level' }],
      rightTitle: 'Workflow Notes',
      bullets: ['Left side renders a vertical stack.', 'Right side pairs bullets with a code block.', 'Useful for architecture stacks and process flows.'],
      code: ['stepA()', 'stepB()', 'stepC()']
    }),
    t.toolGridSlide({
      index: 14,
      tag: 'Template',
      title: 'toolGridSlide',
      tools: [
        { title: 'Tool A', tone: 'tone-blue', subtitle: 'Short descriptor', items: ['Point one', 'Point two', 'Point three'] },
        { title: 'Tool B', tone: 'tone-cyan', subtitle: 'Short descriptor', items: ['Point one', 'Point two', 'Point three'] },
        { title: 'Tool C', tone: 'tone-violet', subtitle: 'Short descriptor', items: ['Point one', 'Point two', 'Point three'] }
      ],
      bottomCards: [
        h.card({ body: [h.wrap('h4', 'Bottom Card A', 'tone-green'), h.paragraph('Two supporting cards under the grid.')] }),
        h.card({ body: [h.wrap('h4', 'Bottom Card B', 'tone-amber'), h.paragraph('Good for advice, caveats, or summary.')] })
      ]
    }),
    t.codePairSlide({
      index: 15,
      tag: 'Template',
      title: 'codePairSlide',
      leftTitle: 'Left Code',
      leftCode: ['const left = true;', 'renderLeft(left);'],
      rightTitle: 'Right Code',
      rightCode: ['const right = true;', 'renderRight(right);'],
      bottomCards: [
        h.card({ body: [h.wrap('h4', 'Teaching Point', 'tone-cyan'), h.paragraph('Use paired snippets for comparison or mapping.')] }),
        h.card({ body: [h.wrap('h4', 'Use Case', 'tone-green'), h.paragraph('Great for before/after code or two related modules.')] })
      ]
    }),
    t.roadmapSlide({
      index: 16,
      tag: 'Template',
      title: 'roadmapSlide',
      bullets: ['Left side holds next steps or roadmap bullets.', 'Right side stacks one or more cards.', 'Good for action plans and recommendations.'],
      rightTitle: 'Right Stack',
      cards: [
        h.card({ body: [h.wrap('h4', 'Roadmap Card 1', 'tone-green'), h.paragraph('First supporting card.')] }),
        h.wrap('div', '', 'spacer'),
        h.card({ body: [h.wrap('h4', 'Roadmap Card 2', 'tone-cyan'), h.paragraph('Second supporting card.')] })
      ]
    }),
    t.summarySlide({
      index: 17,
      tag: 'Template',
      title: 'summarySlide',
      topCards: [
        h.card({ cardTone: 'blue', body: [h.wrap('h4', 'Top Card 1', 'tone-blue'), h.paragraph('Summary card.')] }),
        h.card({ cardTone: 'cyan', body: [h.wrap('h4', 'Top Card 2', 'tone-cyan'), h.paragraph('Summary card.')] }),
        h.card({ cardTone: 'green', body: [h.wrap('h4', 'Top Card 3', 'tone-green'), h.paragraph('Summary card.')] })
      ],
      bullets: ['Bottom summary bullets reinforce the key messages.', 'Use this as a closing or recap slide.', 'Maintains the same visual rhythm as the main deck.']
    }),
    t.resourcesSlide({
      index: 18,
      tag: 'Template',
      title: 'resourcesSlide',
      subtitle: 'Resource and closing layout',
      resourcesTitle: 'Resources',
      resources: [{ label: 'Label', value: 'Value' }, { label: 'Doc', value: 'docs.example.com' }, { label: 'Run', value: 'npm run demo' }]
    })
  ];

  window.PYUVM_SLIDES = slides;
})();
