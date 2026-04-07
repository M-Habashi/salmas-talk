(function () {
  const { registerSlideSection } = window.PYUVM_SLIDE_SUPPORT;

  registerSlideSection(({ deck, helpers: h, templates: t, assets }) => [
    deck.slide((index) => h.standardSlide({
      index,
      tag: 'Architecture',
      title: 'PyUVM Testbench Architecture',
      clickReveal: true,
      slideClass: 'uvm-architecture-slide',
      content: assets.diagrams.pyuvmTestbenchArchitectureDiagram
    })),
    deck.slide((index) => h.standardSlide({
      index,
      tag: 'Classes',
      title: '<span class="components-objects-title-components">Components</span> VS <span class="components-objects-title-objects">Objects</span>:',
      clickReveal: true,
      attributes: 'data-auto-reveal="true" data-reveal-mode="step-groups"',
      slideClass: 'components-objects-slide',
      content: assets.diagrams.componentsVsObjectsContent
    })),
    deck.slide((index) => t.codeExampleSlide({
      index,
      tag: 'Example',
      title: 'Code Example',
      fileName: 'alu_pyuvm_example.py',
      breadcrumb: 'tb <span>/</span> pyuvm <span>/</span> alu_pyuvm_example.py',
      lines: assets.examples.pyuvmCodeExampleLines
    })),
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: '<span class="tone-rose">Phases</span>',
      slideClass: 'pyuvm-points-slide phases-checklist-slide',
      items: [
        'Synchronization between testbench components.',
        'Methods that do not consume simulation time are <strong>functions</strong> and methods that consume simulation time are <strong>tasks</strong>.',
        'User has the ability to add a user defined phase.',
        'phases is defined inside the component classes only.',
        'Phases can be grouped into three categories:'
      ],
      extraContent: assets.examples.phasesTimeline
    })),
    deck.slide((index) => h.standardSlide({
      index,
      tag: 'Phases',
      title: '<span class="tone-rose">Phases Diagram</span>',
      clickReveal: true,
      slideClass: 'phases-diagram-slide',
      content: assets.examples.phasesDiagramContent
    })),
    deck.slide((index) => h.standardSlide({
      index,
      tag: 'Phases',
      title: '<span class="tone-blue">Phases Table</span>',
      clickReveal: true,
      slideClass: 'phases-table-slide',
      content: assets.examples.phasesTableContent
    })),
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: 'Objections Management',
      slideClass: 'pyuvm-points-slide cocotb-checklist-slide',
      items: [
        'UVM objections are used to synchronize between the UVM phases.',
        '<strong>run_phase</strong> runs in parallel in all components and consumes time in each one, so objections synchronize this process.',
        'As long as the objection is raised on a certain phase, for example the <strong>run_phase</strong>, other phases after it are blocked.',
        'Once the objection is dropped, other phases can start.',
        'It is used in the <strong>test class only</strong>.'
      ]
    })),
    deck.slide((index) => t.codeExampleSlide({
      index,
      tag: 'Example',
      title: 'Objections Management',
      fileName: 'pyuvm_test.py',
      breadcrumb: 'tb <span>/</span> tests <span>/</span> pyuvm_test.py',
      lines: assets.examples.objectionsManagementExampleLines
    }))
  ]);
})();
