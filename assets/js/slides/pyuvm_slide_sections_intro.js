(function () {
  const { registerSlideSection, buildOutlineSlide, buildProblemGridSlide } = window.PYUVM_SLIDE_SUPPORT;

  registerSlideSection(({ deck, helpers: h, templates: t, assets }) => [
    deck.slide((index) => t.titleHeroSlide({
      index,
      title: '<span class="accent">Py</span>UVM<br>UVM Methodology<br>in <span class="accent-cyan">Python</span>',
      author: 'By: Salma Sultan',
      subtitle: 'Digital Design Engineer at Pearl Semiconductor',
      chips: ['pyuvm', 'cocotb', 'Icarus Verilog', 'Verilator', 'GHDL', 'GTKWave']
    })),
    deck.slide((index) => buildOutlineSlide({
      helpers: h,
      index,
      tag: 'Overview',
      title: '<span class="tone-cyan">Outline</span>',
      topics: [
        { num: '01', title: 'UVM Fundamentals' },
        { num: '02', title: 'Advantages &amp; Challenges' },
        { num: '03', title: 'Introducing PyUVM' },
        { num: '04', title: 'Architecture &amp; Components' },
        { num: '05', title: 'Phases, TLM &amp; Configuration' },
        { num: '06', title: 'Cocotb' }
      ]
    })),
    deck.slide((index) => t.focusCardsSlide({
      index,
      title: 'What is <span class="tone-blue">UVM</span>?',
      lead: 'UVM = Universal Verification Methodology',
      slideClass: 'stacking-slide--two-column stacking-slide--two-column-large',
      cards: [
        { icon: '01', title: 'Standardized Methodology', body: h.paragraph('A standardized verification methodology for <strong>hardware design verification</strong>.') },
        { icon: '02', title: 'Built on SystemVerilog', body: h.paragraph('Built on top of <strong>SystemVerilog</strong>, combining its power with a proven methodology framework.') },
        { icon: '03', title: 'Structured Testbenches', body: h.paragraph('Used to create <strong>structured, reusable, and scalable</strong> testbenches based on object-oriented programming concepts.') },
        { icon: '04', title: 'Guidelines & Best Practices', body: h.paragraph('Includes a set of <strong>guidelines</strong> and <strong>best practices</strong> for developing testbenches, running simulations, and analyzing results.') },
        { icon: '05', title: 'Industry Standard', body: h.paragraph('Widely adopted by the <strong>semiconductor industry</strong> as the go-to verification methodology.') }
      ]
    })),
    deck.slide((index) => h.standardSlide({
      index,
      tag: 'Architecture',
      title: 'UVM Testbench Architecture',
      clickReveal: true,
      slideClass: 'uvm-architecture-slide',
      content: assets.diagrams.uvmTestbenchArchitectureDiagram
    })),
    deck.slide((index) => t.focusCardsSlide({
      index,
      title: 'UVM Hierarchy',
      lead: 'Core building blocks and what each one does in the testbench',
      slideClass: 'stacking-slide--two-column',
      cards: [
        { icon: '01', title: 'Sequence Item', body: h.paragraph('A transaction object communicated between the class-based environment and the DUT-facing part of the testbench.') },
        { icon: '02', title: 'Sequencer', body: h.paragraph('Generates the transaction stream and sends ordered items to the driver.') },
        { icon: '03', title: 'Driver', body: h.paragraph('Receives transactions from the sequencer and drives that data onto the virtual interface connected to the DUT.') },
        { icon: '04', title: 'Monitor', body: h.paragraph('Captures signal activity from the virtual interface connected to the DUT and rebuilds observed transactions.') },
        {
          icon: '05',
          title: 'Agent',
          body: [
            h.paragraph('Contains the sequencer, driver, and monitor. More than one agent can exist in an environment, and each agent usually connects to a separate interface.'),
            h.list([
              '<strong>Active agent</strong>: drives sequences to the DUT and monitors them.',
              '<strong>Passive agent</strong>: only monitors DUT behavior.'
            ], { classes: 'bullet-list mt-sm' })
          ].join('')
        },
        { icon: '06', title: 'Environment', body: h.paragraph('Collects all agents into one component and can also include smaller sub-environments integrated from verified blocks.') },
        { icon: '07', title: 'Scoreboard', body: h.paragraph('Checker that determines whether the test passed or failed by comparing expected and observed behavior.') },
        { icon: '08', title: 'Subscriber', body: h.paragraph('Consumes broadcast analysis transactions, often for coverage collection, logging, or statistics.') }
      ]
    })),
    deck.slide((index) => buildProblemGridSlide({
      helpers: h,
      index,
      tag: 'Motivation',
      title: 'The Problem with <span class="tone-rose">Traditional UVM</span>',
      problems: [
        { num: '01', title: 'Expensive Commercial Tools', desc: 'Synopsys VCS, Cadence Xcelium, and Siemens Questa all require costly licenses.' },
        { num: '02', title: 'SystemVerilog OOP Knowledge', desc: 'Requires strong familiarity with object-oriented SystemVerilog concepts.' },
        { num: '03', title: 'High Learning Curve', desc: 'Students and new verification engineers often need significant ramp-up time.' },
        { num: '04', title: 'Debugging Difficulty', desc: 'Debugging complex UVM environments can be difficult and time-consuming.' },
        { num: '05', title: 'Less Software-Friendly', desc: 'The flow is less friendly for software-oriented engineers.' },
        { num: '06', title: 'Python Integration Friction', desc: 'Integrating Python models, data processing, or ML logic is less natural.' },
        { num: '07', title: 'Harder Open-Source Flow', desc: 'Running a pure open-source verification flow is harder than with Python-based verification.' }
      ]
    })),
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: 'What is PyUVM?',
      slideClass: 'pyuvm-points-slide',
      items: [
        'Python implementation of the UVM 1800.2 standard.',
        'Fully open-source under the Apache 2.0 license.',
        'Leverages Python’s object-oriented features to implement the UVM class hierarchy.',
        'Works on top of cocotb for RTL signal interaction.',
        'Removes much of the SystemVerilog complexity.',
        'Especially useful for education, research, prototyping, and open-source verification flows.'
      ]
    })),
    deck.slide((index) => t.revealChecklistSlide({
      index,
      title: 'Advantages of PyUVM over Traditional UVM',
      slideClass: 'pyuvm-points-slide',
      items: [
        '<strong>Open Source:</strong> no expensive licenses; free for academia, startups, and hobbyists.',
        '<strong>Python-Based:</strong> cleaner syntax and faster development cycles.',
        '<strong>Rich Ecosystem:</strong> access NumPy, SciPy, ML libraries, and Python packages.',
        '<strong>Faster Iteration:</strong> no compilation step for testbench code.',
        '<strong>Better Debugging:</strong> pdb, IDE debuggers, rich logging, and REPL exploration.',
        '<strong>Lower Learning Curve:</strong> Python is more accessible to new engineers.',
        '<strong>Large Community:</strong> abundant resources, examples, and support.'
      ]
    }))
  ]);
})();
