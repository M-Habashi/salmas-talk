(function () {
  const { helpers: h, slideTemplates: t } = window.PYUVM_TEMPLATES;

  const hierarchyTree = h.classTree([
    { name: 'uvm_object', tone: 'blue' },
    { name: 'uvm_component', tone: 'cyan', branch: '|- ', level: 1 },
    { name: 'uvm_test', tone: 'violet', branch: '|- ', level: 2 },
    { name: 'uvm_env', tone: 'violet', branch: '|- ', level: 2 },
    { name: 'uvm_agent', tone: 'violet', branch: '|- ', level: 2 },
    { name: 'uvm_driver', tone: 'amber', branch: '|- ', level: 2 },
    { name: 'uvm_monitor', tone: 'amber', branch: '|- ', level: 2 },
    { name: 'uvm_sequencer', tone: 'amber', branch: '|- ', level: 2 },
    { name: 'uvm_scoreboard', tone: 'amber', branch: '`- ', level: 2 },
    { name: 'uvm_sequence_item', tone: 'green', branch: '|- ', level: 1 },
    { name: 'uvm_sequence', tone: 'green', branch: '`- ', level: 1 }
  ]);

  const architectureDiagram = [
    '<div class="arch-diagram">',
    '  <div class="arch-level"><div class="arch-box tone-frame tone-frame--blue arch-box--wide">AluBaseTest</div></div>',
    '  <div class="arch-connector">|</div>',
    '  <div class="arch-container tone-dash tone-dash--cyan"><span class="arch-label tone-cyan">AluEnv</span><div class="arch-container-inner">',
    '    <div class="arch-container tone-dash tone-dash--violet arch-agent-shell"><span class="arch-label tone-violet">AluAgent</span><div class="arch-container-inner arch-agent-inner"><div class="arch-row">',
    '      <div class="arch-box tone-frame tone-frame--amber arch-box--micro">seqr</div><div class="arch-box tone-frame tone-frame--rose arch-box--micro">driver</div><div class="arch-box tone-frame tone-frame--green arch-box--micro">monitor</div>',
    '    </div></div></div>',
    '    <div class="arch-row arch-scoreboard-row"><div class="arch-box tone-frame tone-frame--amber arch-box--micro">scoreboard</div></div>',
    '  </div></div>',
    '  <div class="arch-connector">| cocotb BFM |</div>',
    '  <div class="arch-level"><div class="arch-box tone-frame tone-frame--muted arch-box--wide">rtl/alu.sv</div></div>',
    '</div>'
  ].join('');

  const uvmTestbenchArchitectureDiagram = [
    '<div class="uvm-architecture-reveal click-reveal-item click-reveal-item--collapse">',
    '  <svg viewBox="0 0 1200 860" xmlns="http://www.w3.org/2000/svg" aria-label="UVM Testbench Architecture diagram" role="img">',
    '    <defs>',
    '      <marker id="uvm-arch-arrow-end" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse" overflow="visible">',
    '        <path d="M 0 2.5 L 10 5 L 0 7.5 z" fill="#ffffff" />',
    '      </marker>',
    '    </defs>',
    '    <g class="anim-line" style="animation-delay: 0.0s;">',
    '      <rect x="5" y="5" width="1190" height="850" class="crop-mark" />',
    '      <path d="M 5 40 L 5 5 L 40 5 M 1160 5 L 1195 5 L 1195 40 M 5 820 L 5 855 L 40 855 M 1160 855 L 1195 855 L 1195 820" class="crop-edge" />',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.2s;">',
    '      <rect x="20" y="20" width="1160" height="810" class="neon-border-grey" />',
    '      <text x="600" y="45" class="txt-title txt-title--grey">Test bench</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.3s;">',
    '      <rect x="40" y="60" width="1120" height="580" class="neon-border-blue" />',
    '      <text x="600" y="85" class="txt-title txt-title--blue">Test</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.4s;">',
    '      <rect x="60" y="160" width="1080" height="460" class="neon-border-purple" />',
    '      <text x="600" y="185" class="txt-title txt-title--purple">Verification Environment</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.5s;">',
    '      <rect x="80" y="200" width="330" height="400" class="neon-border-cyan" />',
    '      <text x="260" y="225" class="txt-title txt-title--cyan">Agent 1</text>',
    '      <rect x="340" y="208" width="50" height="25" class="box-white" />',
    '      <text x="365" y="226" class="txt-small">CFG</text>',
    '      <rect x="790" y="200" width="330" height="400" class="neon-border-cyan" />',
    '      <text x="940" y="225" class="txt-title txt-title--cyan">Agent 2</text>',
    '      <rect x="810" y="208" width="50" height="25" class="box-white" />',
    '      <text x="835" y="226" class="txt-small">CFG</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.6s;">',
    '      <rect x="100" y="100" width="140" height="40" class="box-yellow" />',
    '      <text x="170" y="126" class="txt-box">Sequence</text>',
    '      <rect x="960" y="100" width="140" height="40" class="box-yellow" />',
    '      <text x="1030" y="126" class="txt-box">Sequence</text>',
    '      <rect x="100" y="260" width="140" height="40" class="box-yellow" />',
    '      <text x="170" y="286" class="txt-box">Sequencer</text>',
    '      <rect x="960" y="260" width="140" height="40" class="box-yellow" />',
    '      <text x="1030" y="286" class="txt-box">Sequencer</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.7s;">',
    '      <rect x="110" y="350" width="120" height="130" class="box-orange" />',
    '      <text x="170" y="420" class="txt-box">Driver</text>',
    '      <rect x="260" y="350" width="120" height="130" class="box-peach" />',
    '      <text x="320" y="420" class="txt-box">Monitor</text>',
    '      <rect x="820" y="350" width="120" height="130" class="box-peach" />',
    '      <text x="880" y="420" class="txt-box">Monitor</text>',
    '      <rect x="970" y="350" width="120" height="130" class="box-orange" />',
    '      <text x="1030" y="420" class="txt-box">Diver</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.8s;">',
    '      <rect x="500" y="240" width="200" height="60" class="box-green" />',
    '      <text x="600" y="276" class="txt-box">Scoreboard</text>',
    '      <rect x="500" y="340" width="200" height="80" class="box-green" />',
    '      <text x="600" y="375" class="txt-box"><tspan x="600" dy="0">Functional</tspan><tspan x="600" dy="24">Coverage</tspan></text>',
    '      <rect x="570" y="500" width="60" height="30" class="box-white" />',
    '      <text x="600" y="521" class="txt-small">CFG</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 0.9s;">',
    '      <rect x="120" y="530" width="100" height="50" class="box-blue" />',
    '      <text x="170" y="552" class="txt-small"><tspan x="170" dy="0">Virtual</tspan><tspan x="170" dy="16">Interface</tspan></text>',
    '      <rect x="270" y="530" width="100" height="50" class="box-blue" />',
    '      <text x="320" y="552" class="txt-small"><tspan x="320" dy="0">Virtual</tspan><tspan x="320" dy="16">Interface</tspan></text>',
    '      <rect x="830" y="530" width="100" height="50" class="box-blue" />',
    '      <text x="880" y="552" class="txt-small"><tspan x="880" dy="0">Virtual</tspan><tspan x="880" dy="16">Interface</tspan></text>',
    '      <rect x="980" y="530" width="100" height="50" class="box-blue" />',
    '      <text x="1030" y="552" class="txt-small"><tspan x="1030" dy="0">Virtual</tspan><tspan x="1030" dy="16">Interface</tspan></text>',
    '      <rect x="100" y="680" width="260" height="40" class="box-grey" />',
    '      <text x="230" y="707" class="txt-box txt-box--dark">Interface</text>',
    '      <rect x="840" y="680" width="260" height="40" class="box-grey" />',
    '      <text x="970" y="707" class="txt-box txt-box--dark">Interface</text>',
    '    </g>',
    '    <g class="anim-block" style="animation-delay: 1.0s;">',
    '      <rect x="200" y="760" width="800" height="60" class="box-red" />',
    '      <text x="600" y="798" class="txt-box txt-box--dut">DUT</text>',
    '    </g>',
    '    <g class="anim-line" style="animation-delay: 1.3s;">',
    '      <line x1="160" y1="140" x2="160" y2="260" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="180" y1="260" x2="180" y2="140" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1020" y1="140" x2="1020" y2="260" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1040" y1="260" x2="1040" y2="140" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="160" y1="300" x2="160" y2="350" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="180" y1="350" x2="180" y2="300" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1020" y1="300" x2="1020" y2="350" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1040" y1="350" x2="1040" y2="300" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="160" y1="480" x2="160" y2="530" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="180" y1="530" x2="180" y2="480" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1020" y1="480" x2="1020" y2="530" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1040" y1="530" x2="1040" y2="480" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="320" y1="530" x2="320" y2="480" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="880" y1="530" x2="880" y2="480" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="160" y1="580" x2="160" y2="680" class="line-dashed" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="180" y1="680" x2="180" y2="580" class="line-dashed" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1020" y1="580" x2="1020" y2="680" class="line-dashed" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="1040" y1="680" x2="1040" y2="580" class="line-dashed" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="320" y1="680" x2="320" y2="580" class="line-dashed" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="880" y1="680" x2="880" y2="580" class="line-dashed" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="220" y1="720" x2="220" y2="760" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="240" y1="760" x2="240" y2="720" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="960" y1="720" x2="960" y2="760" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <line x1="980" y1="760" x2="980" y2="720" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <path d="M 380 370 L 440 370 L 440 270 L 500 270" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <path d="M 380 430 L 440 430 L 440 380 L 500 380" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <path d="M 820 370 L 760 370 L 760 270 L 700 270" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '      <path d="M 820 430 L 760 430 L 760 380 L 700 380" class="line-solid" marker-end="url(#uvm-arch-arrow-end)" />',
    '    </g>',
    '  </svg>',
    '</div>'
  ].join('');

  const slides = [
    t.titleHeroSlide({
      index: 1,
      badge: '',
      title: '<span class="accent">Py</span>UVM<br>UVM Methodology<br>in <span class="accent-cyan">Python</span>',
      author: 'By: Salma Sultan',
      subtitle: '',
      chips: ['pyuvm', 'cocotb', 'Icarus Verilog', 'Verilator', 'GHDL', 'GTKWave']
    }),
    t.agendaSlide({
      index: 2,
      tag: 'Agenda',
      title: 'Table of <span class="tone-cyan">Contents</span>',
      items: ['What is UVM?', 'UVM Testbench Architecture', 'UVM Hierarchy', 'Advantages of UVM in Verification', 'The Problem with Traditional UVM', 'What is PyUVM?', 'Advantages of PyUVM over Traditional UVM', 'The Structure of PyUVM', 'What Are Phases? With Example', 'What is TLM and How to Use It', 'Types of TLM with Figure and Code', 'What is Factory', 'What is cocotb?', 'How PyUVM Uses cocotb', 'Open-Source Simulation Tools', 'The Complete Open-Source Verification Stack', 'PyUVM Code Example', 'How to Extend This Example', 'Summary']
    }),
    t.focusCardsSlide({
      index: 3,
      title: 'What is <span class="tone-blue">UVM</span>?',
      lead: 'UVM = Universal Verification Methodology',
      cards: [
        { icon: '01', title: 'Standardized Methodology', body: h.paragraph('A standardized verification methodology for <strong>hardware design verification</strong>.') },
        { icon: '02', title: 'Built on SystemVerilog', body: h.paragraph('Built on top of <strong>SystemVerilog</strong>, combining its power with a proven methodology framework.') },
        { icon: '03', title: 'Structured Testbenches', body: h.paragraph('Used to create <strong>structured, reusable, and scalable</strong> testbenches based on object-oriented programming concepts.') },
        { icon: '04', title: 'Guidelines & Best Practices', body: h.paragraph('Includes a set of <strong>guidelines</strong> and <strong>best practices</strong> for developing testbenches, running simulations, and analyzing results.') },
        { icon: '05', title: 'Industry Standard', body: h.paragraph('Widely adopted by the <strong>semiconductor industry</strong> as the go-to verification methodology.') }
      ]
    }),
    h.standardSlide({
      index: 4,
      tag: 'Architecture',
      title: 'UVM Testbench Architecture',
      clickReveal: true,
      slideClass: 'uvm-architecture-slide',
      content: uvmTestbenchArchitectureDiagram
    }),
    t.focusCardsSlide({
      index: 5,
      title: 'UVM Hierarchy',
      lead: 'Core building blocks and what each one does in the testbench',
      slideClass: 'stacking-slide--two-column',
      cards: [
        {
          icon: '01',
          title: 'Sequence Item',
          body: h.paragraph('A transaction object communicated between the class-based environment and the DUT-facing part of the testbench.')
        },
        {
          icon: '02',
          title: 'Sequencer',
          body: h.paragraph('Generates the transaction stream and sends ordered items to the driver.')
        },
        {
          icon: '03',
          title: 'Driver',
          body: h.paragraph('Receives transactions from the sequencer and drives that data onto the virtual interface connected to the DUT.')
        },
        {
          icon: '04',
          title: 'Monitor',
          body: h.paragraph('Captures signal activity from the virtual interface connected to the DUT and rebuilds observed transactions.')
        },
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
        {
          icon: '06',
          title: 'Environment',
          body: h.paragraph('Collects all agents into one component and can also include smaller sub-environments integrated from verified blocks.')
        },
        {
          icon: '07',
          title: 'Scoreboard',
          body: h.paragraph('Checker that determines whether the test passed or failed by comparing expected and observed behavior.')
        },
        {
          icon: '08',
          title: 'Subscriber',
          body: h.paragraph('Consumes broadcast analysis transactions, often for coverage collection, logging, or statistics.')
        }
      ]
    }),
    t.revealCardGridSlide({
      index: 6,
      tag: 'Benefits',
      title: 'Advantages of UVM in Verification',
      cards: [
        { icon: '01', title: 'Reusability', body: h.paragraph('The same agent can be reused across multiple projects.') },
        { icon: '02', title: 'Scalability', body: h.paragraph('Works for small blocks up to large SoCs.') },
        { icon: '03', title: 'Standard Structure', body: h.paragraph('Engineers can understand each other’s testbenches faster.') },
        { icon: '04', title: 'Constrained-Random Testing', body: h.paragraph('Generates many legal stimulus scenarios automatically.') },
        { icon: '05', title: 'Functional Coverage', body: h.paragraph('Shows which scenarios were actually tested.') },
        { icon: '06', title: 'TLM Communication', body: h.paragraph('Components exchange transactions cleanly.') },
        { icon: '07', title: 'Factory Mechanism', body: h.paragraph('Allows easy component replacement without changing base code.') },
        { icon: '08', title: 'Better Maintainability', body: h.paragraph('Easier to extend than ad hoc testbenches.') }
      ]
    }),
    t.revealCardGridSlide({
      index: 7,
      tag: 'Motivation',
      title: 'The Problem with <span class="tone-rose">Traditional UVM</span>',
      cards: [
        { icon: '01', title: 'Expensive Commercial Tools', body: h.paragraph('Synopsys VCS, Cadence Xcelium, and Siemens Questa all require costly licenses.') },
        { icon: '02', title: 'SystemVerilog OOP Knowledge', body: h.paragraph('Requires strong familiarity with object-oriented SystemVerilog concepts.') },
        { icon: '03', title: 'High Learning Curve', body: h.paragraph('Students and new verification engineers often need significant ramp-up time.') },
        { icon: '04', title: 'Debugging Difficulty', body: h.paragraph('Debugging complex UVM environments can be difficult and time-consuming.') },
        { icon: '05', title: 'Less Software-Friendly', body: h.paragraph('The flow is less friendly for software-oriented engineers.') },
        { icon: '06', title: 'Python Integration Friction', body: h.paragraph('Integrating Python models, data processing, or ML logic is less natural.') },
        { icon: '07', title: 'Harder Open-Source Flow', body: h.paragraph('Running a pure open-source verification flow is harder than with Python-based verification.') }
      ]
    }),
    t.focusCardsSlide({
      index: 8,
      title: 'What is <span class="tone-blue">Py</span><span class="tone-cyan">UVM</span>?',
      lead: 'Python-first UVM methodology built for open and practical verification flows',
      slideClass: 'stacking-slide--plain-collapsed',
      cards: [
        {
          body: h.paragraph('Python implementation of the UVM 1800.2 standard.')
        },
        {
          body: h.paragraph('Fully open-source under the Apache 2.0 license.')
        },
        {
          body: h.paragraph('Leverages Python’s object-oriented features to implement the UVM class hierarchy.')
        },
        {
          body: h.paragraph('Works on top of cocotb for RTL signal interaction.')
        },
        {
          body: h.paragraph('Removes much of the SystemVerilog complexity.')
        },
        {
          body: [
            h.paragraph('Especially useful for education, research, prototyping, and open-source verification flows.')
          ].join('')
        }
      ]
    }),
    t.comparisonRowsSlide({
      index: 9, tag: 'Comparison', title: 'Advantages of <span class="tone-blue">PyUVM</span> over Traditional UVM',
      rows: [[{ label: 'SV', text: 'More boilerplate and heavier syntax.' }, { label: 'PY', text: 'Cleaner Python code with less ceremony.', positive: true }], [{ label: 'SV', text: 'Commonly tied to licensed tools and vendor flows.' }, { label: 'PY', text: 'Fits open-source simulators and standard Python tooling.', positive: true }], [{ label: 'SV', text: 'Harder for software engineers and students to learn quickly.' }, { label: 'PY', text: 'Python lowers the learning curve for many teams.', positive: true }], [{ label: 'SV', text: 'Integrating data science or automation libraries is less natural.' }, { label: 'PY', text: 'Easy access to pytest, pandas, NumPy, CI, and scripting.', positive: true }]],
      cards: [h.card({ cardTone: 'blue', body: [h.wrap('h4', 'Faster to write', 'tone-blue'), h.paragraph('Sequences and tests look like normal Python classes and coroutines.')] }), h.card({ cardTone: 'cyan', body: [h.wrap('h4', 'Faster to teach', 'tone-cyan'), h.paragraph('Students can focus on methodology before getting stuck in language details.')] }), h.card({ cardTone: 'green', body: [h.wrap('h4', 'Faster to automate', 'tone-green'), h.paragraph('Python testbenches fit naturally into scripts, CI pipelines, and package management.')] })]
    }),
    t.hierarchySlide({
      index: 10, tag: 'Hierarchy', title: 'The Structure of <span class="tone-blue">PyUVM</span>',
      leftTitle: 'Main Class Family', leftContent: hierarchyTree, rightTitle: 'How the Pieces Fit',
      bullets: ['<strong>uvm_test</strong> is the top-level test case.', '<strong>uvm_env</strong> groups the verification components.', '<strong>uvm_agent</strong> usually contains the sequencer, driver, and monitor for one interface.', '<strong>uvm_sequence_item</strong> models one transaction.', '<strong>uvm_sequence</strong> generates streams of transactions.', '<strong>uvm_scoreboard</strong> checks expected versus observed behavior.', '<strong>ConfigDB</strong>, <strong>TLM</strong>, and the <strong>factory</strong> support communication and configurability.'],
      footerCard: h.card({ body: [h.wrap('h4', 'Repo mapping', 'tone-cyan'), h.paragraph('<strong>AluSeqItem</strong>, <strong>AddSequence</strong>, <strong>AluDriver</strong>, <strong>AluMonitor</strong>, <strong>AluScoreboard</strong>, <strong>AluAgent</strong>, <strong>AluEnv</strong>, and <strong>AluBaseTest</strong> mirror this structure directly.')] })
    }),
    t.phaseExampleSlide({
      index: 11, tag: 'Phases', title: 'What Are <span class="tone-cyan">Phases</span>? With Example',
      phases: ['build', 'connect', 'run', 'check', 'report'],
      bullets: ['<strong>Phases</strong> are ordered steps in the UVM testbench lifecycle.', '<strong>build_phase</strong> creates components and sets configuration.', '<strong>connect_phase</strong> wires ports, exports, or references together.', '<strong>run_phase</strong> drives and monitors simulation-time activity.', '<strong>check_phase</strong> evaluates correctness after run-time activity finishes.', '<strong>report_phase</strong> prints final status and statistics.'],
      codeTitle: 'Example from this ALU project',
      code: ['class AluEnv(uvm_env):', '    def build_phase(self):', '        ConfigDB().set(self, "*", "BFM", AluBfm())', '        self.agent = AluAgent("agent", self)', '        self.scoreboard = AluScoreboard("scoreboard", self)', '', '    def connect_phase(self):', '        self.agent.monitor.scoreboard = self.scoreboard', '', 'class AluBaseTest(uvm_test):', '    async def run_phase(self):', '        self.raise_objection()', '        await AddSequence().start(self.env.agent.seqr)', '        self.drop_objection()', '', 'class AluScoreboard(uvm_scoreboard):', '    def check_phase(self):', '        ...', '', '    def report_phase(self):', '        self.logger.info("ALU scoreboard checked")']
    }),
    t.tlmOverviewSlide({
      index: 12, tag: 'Communication', title: 'What is <span class="tone-rose">TLM</span> and How to Use It',
      bullets: ['<strong>TLM</strong> means Transaction-Level Modeling.', 'Instead of passing raw signals, components communicate using <strong>transactions</strong>.', 'That makes verification code more reusable and easier to reason about.', 'Common TLM usage includes <strong>sequencer to driver</strong>, <strong>monitor to scoreboard</strong>, and <strong>FIFO-style channels</strong>.', 'In PyUVM, TLM ports and exports are used to connect producers and consumers of transactions.'],
      callout: h.card({ body: [h.wrap('h4', 'In this repo', 'tone-cyan'), h.paragraph('The current code already uses the standard sequence-item handshake between <strong>sequencer</strong> and <strong>driver</strong>. The monitor then forwards completed items to the scoreboard with a direct Python call.')] }),
      codeTitle: 'How to use it',
      code: ['class AluAgent(uvm_agent):', '    def build_phase(self):', '        self.seqr = uvm_sequencer("seqr", self)', '        self.driver = AluDriver("driver", self)', '', '    def connect_phase(self):', '        self.driver.seq_item_port.connect(', '            self.seqr.seq_item_export', '        )', '', 'class AluDriver(uvm_driver):', '    async def run_phase(self):', '        while True:', '            item = await self.seq_item_port.get_next_item()', '            await bfm.send_op(item.a, item.b, item.op)', '            self.seq_item_port.item_done()'],
      footerCard: h.card({ body: [h.wrap('h4', 'Good mental model', 'tone-green'), h.paragraph('Sequence creates the transaction. Sequencer hands it over. Driver consumes it. Monitor publishes observed transactions. Scoreboard checks them.')] })
    }),
    t.tlmTypesSlide({
      index: 13, tag: 'Communication Patterns', title: 'Types of <span class="tone-rose">TLM</span> with Figure and Code',
      intro: 'PyUVM also provides blocking and nonblocking put/get/peek/transport interfaces. These three patterns are the easiest ones to teach first and show up often in real verification code.',
      cards: [{ chip: 'seq_item', tone: 'violet', title: '1. Sequencer to Driver', copy: 'Use a sequence-item handshake when the driver must pull ordered stimulus from the sequencer.', figure: h.wrap('div', [h.wrap('div', 'Sequence', 'diagram-box violet'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Sequencer', 'diagram-box amber'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Driver', 'diagram-box rose')].join(''), 'tlm-mini-figure'), code: ['self.driver.seq_item_port.connect(', '    self.seqr.seq_item_export', ')', '', 'item = await self.seq_item_port.get_next_item()', 'self.seq_item_port.item_done()'] }, { chip: 'analysis', tone: 'cyan', title: '2. Monitor Broadcast', copy: 'Use analysis TLM when one observed transaction should fan out to a scoreboard, coverage collector, or logger.', figure: h.wrap('div', [h.wrap('div', 'Monitor', 'diagram-box green'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'analysis_port', 'diagram-box cyan'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Scoreboard', 'diagram-box amber'), h.wrap('div', 'Coverage', 'diagram-box blue')].join(''), 'tlm-mini-figure tlm-broadcast-figure'), code: ['class CoverageCollector(uvm_subscriber):', '    def write(self, item):', '        self.coverage.sample(item.op)', '', 'self.monitor.ap.connect(self.coverage.analysis_export)', 'self.monitor.ap.write(item)'] }, { chip: 'fifo', tone: 'green', title: '3. Put/Get Channel', copy: 'Use a FIFO when producer and consumer run at different rates and you need buffering between them.', figure: h.wrap('div', [h.wrap('div', 'Producer', 'diagram-box blue'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'uvm_tlm_fifo', 'diagram-box cyan'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Consumer', 'diagram-box amber')].join(''), 'tlm-mini-figure'), code: ['self.req_fifo = uvm_tlm_fifo(', '    "req_fifo", self, size=8', ')', '', 'await self.req_fifo.put(item)', 'item = await self.req_fifo.get()'] }]
    }),
    t.conceptSplitSlide({
      index: 14, tag: 'Customization', title: 'What is the <span class="tone-amber">Factory</span>?',
      bullets: ['The <strong>factory</strong> is UVM\'s object creation mechanism.', 'It lets you create components and objects <strong>indirectly</strong> so you can replace them later without rewriting the environment.', 'This is useful for <strong>overrides</strong>, such as swapping in a tracing driver, error-injection driver, or alternative sequence.', 'In PyUVM, user classes are registered automatically, so there is no SystemVerilog-style registration macro burden.'],
      callout: h.card({ body: [h.wrap('h4', 'Why engineers like it', 'tone-amber'), h.paragraph('You can keep the environment stable and change behavior from the test layer, which is cleaner than editing the environment every time.')] }),
      rightTitle: 'Example override pattern',
      code: ['class LoggingDriver(AluDriver):', '    async def run_phase(self):', '        self.logger.info("Tracing transactions")', '        await super().run_phase()', '', 'class FactoryOverrideTest(uvm_test):', '    def build_phase(self):', '        uvm_factory().set_type_override_by_type(', '            AluDriver,', '            LoggingDriver', '        )', '        self.env = AluEnv("env", self)', '', 'class AluAgent(uvm_agent):', '    def build_phase(self):', '        self.driver = AluDriver.create("driver", self)'],
      note: 'Note: this repository currently instantiates the driver directly. The slide shows the factory-enabled pattern you would use when you want runtime overrides.'
    }),
    t.conceptSplitSlide({
      index: 15, tag: 'Interface Layer', title: 'What is <span class="tone-cyan">cocotb</span>?',
      bullets: ['<strong>cocotb</strong> is a coroutine-based cosimulation framework for verifying HDL designs in Python.', 'It gives Python code access to simulator objects and DUT signals.', 'Testbenches use <strong>async/await</strong> and simulation triggers such as timers and clock edges.', 'It works with multiple simulators, which makes it a strong bridge between Python code and RTL simulation.'],
      callout: h.card({ body: [h.wrap('h4', 'Plain-English definition', 'tone-cyan'), h.paragraph('cocotb is the part that lets Python act like a verification language inside the simulator.')] }),
      rightTitle: 'Small cocotb-style example',
      code: ['from cocotb.triggers import Timer', '', 'async def send_op(self, a, b, op):', '    self.dut.a.value = a', '    self.dut.b.value = b', '    self.dut.op.value = op', '    await Timer(1, units="ns")', '', '    observed = {', '        "result": int(self.dut.result.value),', '        "div_by_zero": int(self.dut.div_by_zero.value),', '    }'],
      note: 'That is exactly the style used by <strong>tb/alu_bfm.py</strong> in this repository.',
      noteClass: 'fine-print tone-muted'
    }),
    t.stackWorkflowSlide({
      index: 16, tag: 'Integration', title: 'How PyUVM Uses <span class="tone-cyan">cocotb</span>',
      layers: [{ title: 'PyUVM', label: 'test, env, agent, sequences, phasing, TLM' }, { title: 'cocotb BFM', label: 'drive and sample DUT through Python coroutines' }, { title: 'Simulator', label: 'Icarus, Verilator, or GHDL execute the HDL' }, { title: 'RTL DUT', label: 'the hardware design under verification' }],
      bullets: ['PyUVM does <strong>methodology and organization</strong>.', 'cocotb does <strong>signal-level interaction with the simulator</strong>.', 'In this project, the driver never touches raw simulator APIs directly. It calls the <strong>AluBfm</strong>.', 'The BFM writes DUT inputs, waits for time to pass, then captures output values and queues them for the monitor.', 'This split keeps the testbench clean: PyUVM handles transactions while cocotb handles timing and signal access.'],
      code: ['bfm = ConfigDB().get(self, "", "BFM")', 'item = await self.seq_item_port.get_next_item()', 'await bfm.send_op(item.a, item.b, item.op)', 'self.seq_item_port.item_done()']
    }),
    t.toolGridSlide({
      index: 17, tag: 'Tools', title: 'Open-Source RTL <span class="tone-violet">Simulation Tools</span>',
      tools: [{ title: 'Icarus Verilog', tone: 'tone-blue', subtitle: 'Great for small Verilog/SystemVerilog teaching projects', items: ['Easy to install and widely used in examples', 'Works well with cocotb', 'Used by default in this repository\'s runner flow'] }, { title: 'Verilator', tone: 'tone-cyan', subtitle: 'Fast compiled simulation for many Verilog designs', items: ['Often preferred when simulation speed matters', 'Strong fit for CI pipelines and large regressions', 'Works with cocotb for supported flows'] }, { title: 'GHDL', tone: 'tone-violet', subtitle: 'Open-source simulator for VHDL users', items: ['Useful when the DUT or environment is VHDL-centric', 'Lets the same Python methodology reach VHDL designs', 'Pairs well with cocotb in mixed toolchains'] }],
      bottomCards: [h.card({ body: [h.wrap('h4', 'Waveform viewer', 'tone-green'), h.paragraph('<strong>GTKWave</strong> is not a simulator, but it completes the debug loop by viewing VCD/FST waveform traces.')] }), h.card({ body: [h.wrap('h4', 'Practical advice', 'tone-amber'), h.paragraph('Pick the simulator based on HDL language support, speed needs, and the maturity of your specific DUT flow.')] })]
    }),
    t.stackWorkflowSlide({
      index: 18, tag: 'Full Stack', title: 'The Complete <span class="tone-green">Open-Source</span> Verification Stack',
      layers: [{ title: 'PyUVM', label: 'verification architecture, tests, sequences, scoreboards' }, { title: 'cocotb', label: 'Python simulator bridge and coroutine scheduling' }, { title: 'Open-source simulator', label: 'Icarus Verilog, Verilator, or GHDL' }, { title: 'RTL', label: 'Verilog or VHDL design under test' }, { title: 'GTKWave + CI', label: 'debug waveforms and automate regressions' }],
      rightTitle: 'Typical workflow',
      bullets: ['Write or import the RTL.', 'Create PyUVM components and sequences in Python.', 'Use cocotb to drive and sample the DUT.', 'Run on an open-source simulator.', 'Inspect failures in logs and waveforms.', 'Automate regressions with scripts or CI.'],
      code: ['pip install -r requirements.txt', 'python run.py', 'python run.py --test AluDivideTest'],
      codeOptions: { lang: 'bash' }
    }),
    t.codePairSlide({
      index: 19, tag: 'Example', title: 'PyUVM <span class="tone-green">Code Example</span>',
      leftTitle: 'Sequence item and sequence',
      leftCode: ['class AluSeqItem(uvm_sequence_item):', '    OPS = {"add": 0, "sub": 1, "mul": 2, "div": 3}', '', '    def __init__(self, name="alu_seq_item", a=0, b=0, op=0):', '        super().__init__(name)', '        self.a = a', '        self.b = b', '        self.op = op', '        self.result = 0', '        self.div_by_zero = 0', '', 'class AddSequence(BaseAluSequence):', '    OP_NAME = "add"'],
      rightTitle: 'Environment and test',
      rightCode: ['class AluEnv(uvm_env):', '    def build_phase(self):', '        ConfigDB().set(self, "*", "WIDTH", 16)', '        ConfigDB().set(self, "*", "BFM", AluBfm())', '        self.agent = AluAgent("agent", self)', '        self.scoreboard = AluScoreboard("scoreboard", self)', '', 'class AluAllOpsTest(AluBaseTest):', '    SEQUENCES = (', '        AddSequence,', '        SubtractSequence,', '        MultiplySequence,', '        DivideSequence,', '    )'],
      bottomCards: [h.card({ body: [h.wrap('h4', 'What this teaches', 'tone-cyan'), h.paragraph('The transaction object holds data. The sequence generates items. The environment instantiates the architecture. The test chooses which sequences to run.')] }), h.card({ body: [h.wrap('h4', 'Good classroom demo', 'tone-green'), h.paragraph('This ALU example is small enough to understand quickly but still shows real verification structure, phasing, sequencing, checking, and open-source execution.')] })]
    }),
    t.roadmapSlide({
      index: 20, tag: 'Next Steps', title: 'How to <span class="tone-amber">Extend</span> This Example',
      bullets: ['Add more <strong>directed and random sequences</strong> to stress edge cases beyond simple arithmetic paths.', 'Track <strong>functional coverage</strong> for operations, corner values, sign behavior, and divide-by-zero scenarios.', 'Make the scoreboard more powerful by comparing against a reusable <strong>reference model</strong>.', 'Run <strong>regressions in CI</strong> so every RTL or testbench change is checked automatically.', 'Scale the same structure to a larger DUT by adding agents, interfaces, and more layered environments.'],
      rightTitle: 'Why this matters',
      cards: [h.card({ body: [h.wrap('h4', 'From demo to real flow', 'tone-green'), h.paragraph('This ALU project is a teaching example, but the next steps are the same ones used in production verification: better stimulus, measurable coverage, stronger checking, and automated regressions.')] }), h.wrap('div', '', 'spacer'), h.card({ body: [h.wrap('h4', 'Practical roadmap', 'tone-cyan'), h.paragraph('Start with one new sequence, add coverage points, connect the results to a regression script, and let the PyUVM structure grow with the design.')] })]
    }),
    t.summarySlide({
      index: 21, tag: 'Recap', title: 'Summary',
      topCards: [h.card({ cardTone: 'blue', body: [h.wrap('h4', 'UVM', 'tone-blue'), h.paragraph('A proven methodology for building reusable, scalable verification environments.')] }), h.card({ cardTone: 'cyan', body: [h.wrap('h4', 'PyUVM', 'tone-cyan'), h.paragraph('Brings those ideas into Python while keeping the structure verification teams already know.')] }), h.card({ cardTone: 'green', body: [h.wrap('h4', 'cocotb + open tools', 'tone-green'), h.paragraph('Provide the simulator bridge and execution layer needed for a practical zero-license flow.')] })],
      bullets: ['Use <strong>phases</strong> to organize lifecycle behavior.', 'Use <strong>TLM</strong> to pass transactions cleanly between components.', 'Use the <strong>factory</strong> when you want clean overrides and more flexible tests.', 'Use <strong>cocotb</strong> to interact with signals and simulation time.', 'Use <strong>PyUVM + cocotb + open-source simulators</strong> for an accessible modern verification stack.']
    }),
    t.resourcesSlide({
      index: 22,
      tag: 'Q&amp;A',
      title: 'Thank <span class="tone-cyan">You</span>',
      subtitle: 'Questions and Discussion',
      resourcesTitle: 'Resources',
      resources: [{ label: 'Repo', value: 'PyUVM_Example' }, { label: 'PyUVM', value: 'pyuvm.github.io/pyuvm' }, { label: 'cocotb', value: 'docs.cocotb.org' }, { label: 'Run', value: 'python run.py' }, { label: 'Single test', value: 'python run.py --test AluAddTest' }]
    })
  ];

  window.PYUVM_SLIDES = slides;
})();
