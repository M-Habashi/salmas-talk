(function () {
  const { registerSlideSection } = window.PYUVM_SLIDE_SUPPORT;

  registerSlideSection(({ deck, helpers: h, templates: t, assets }) => [
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: 'TLM',
      slideClass: 'pyuvm-points-slide',
      items: [
        'TLM means Transaction-Level Modeling.',
        'Instead of passing raw signals, components communicate using transactions.',
        'That makes verification code more reusable and easier to reason about.',
        'Common TLM usage includes sequencer to driver, monitor to scoreboard, monitor to subscriber, and FIFO-style channels.',
        'In PyUVM, TLM ports and exports are used to connect producers and consumers of transactions.'
      ]
    })),
    deck.slide((index) => h.standardSlide({
      index,
      title: 'TLM',
      slideClass: 'tlm-animation-slide',
      content: assets.diagrams.tlmAnimationDiagram
    })),
    deck.slide((index) => h.standardSlide({
      index,
      title: 'Sequence TLM UVM',
      slideClass: 'sequence-tlm-slide',
      content: assets.diagrams.sequenceTlmDiagram
    })),
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: 'Configuration',
      clickReveal: true,
      slideClass: 'pyuvm-points-slide config-slide',
      items: [
        'ConfigDB passes shared settings down the PyUVM hierarchy.',
        '<strong>set()</strong> stores a value using a component, path pattern, and field name.',
        '<strong>get()</strong> retrieves that value from a matching child scope.',
        'Typical values include BFMs, widths, and environment knobs.'
      ],
      extraContent: h.sectionStack([
        h.heading('h3', 'Simple Example'),
        h.codeEditorMockup({
          fileName: 'config_db_example.py',
          breadcrumb: 'tb <span>/</span> pyuvm <span>/</span> config_db_example.py',
          lines: assets.examples.configDbExampleLines,
          classes: 'code-editor-shell--fit-content'
        })
      ], 'config-slide-example click-reveal-item')
    })),
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: 'What is <span class="tone-cyan">cocotb</span>?',
      slideClass: 'pyuvm-points-slide cocotb-checklist-slide',
      items: [
        '<strong>cocotb</strong> is a coroutine-based cosimulation framework for verifying HDL designs in Python.',
        'Testbenches use <strong>async/await</strong> and simulation triggers such as timers and clock edges.',
        'It works with multiple simulators, which makes it a strong bridge between Python code and RTL simulation.'
      ]
    })),
    deck.slide((index) => t.codeExampleSlide({
      index,
      tag: 'Example',
      title: '<span class="tone-cyan">cocotb</span> Example',
      fileName: 'alu_cocotb_example.py',
      breadcrumb: 'tb <span>/</span> cocotb <span>/</span> alu_cocotb_example.py',
      lines: assets.examples.cocotbControlExampleLines
    })),
    deck.slide((index) => t.stackWorkflowSlide({
      index,
      tag: 'Integration',
      title: 'How PyUVM Uses <span class="tone-cyan">cocotb</span>',
      layers: [
        { title: 'PyUVM', label: 'test, env, agent, sequences, phasing, TLM' },
        { title: 'cocotb BFM', label: 'drive and sample DUT through Python coroutines' },
        { title: 'Simulator', label: 'Icarus, Verilator, or GHDL execute the HDL' },
        { title: 'RTL DUT', label: 'the hardware design under verification' }
      ],
      bullets: [
        'PyUVM does <strong>methodology and organization</strong>.',
        'cocotb does <strong>signal-level interaction with the simulator</strong>.',
        'In this project, the driver never touches raw simulator APIs directly. It calls the <strong>AluBfm</strong>.',
        'The BFM writes DUT inputs, waits for time to pass, then captures output values and queues them for the monitor.',
        'This split keeps the testbench clean: PyUVM handles transactions while cocotb handles timing and signal access.'
      ],
      code: [
        'bfm = ConfigDB().get(self, "", "BFM")',
        'item = await self.seq_item_port.get_next_item()',
        'await bfm.send_op(item.a, item.b, item.op)',
        'self.seq_item_port.item_done()'
      ]
    })),
    deck.slide((index) => t.resourcesSlide({
      index,
      tag: 'Q&amp;A',
      title: 'Thank <span class="tone-cyan">You</span>',
      subtitle: 'Questions and Discussion'
    }))
  ]);
})();
