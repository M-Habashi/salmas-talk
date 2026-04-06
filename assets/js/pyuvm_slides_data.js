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

  const slides = [
    t.titleHeroSlide({
      index: 1,
      badge: '',
      title: '<span class="accent">Py</span>UVM<br><span class="serif">UVM Methodology</span><br>in <span class="accent-cyan">Python</span>',
      author: 'By: Salma Sultan',
      subtitle: '',
      chips: ['pyuvm', 'cocotb', 'Icarus Verilog', 'Verilator', 'GHDL', 'GTKWave']
    }),
    t.agendaSlide({
      index: 2,
      tag: 'Agenda',
      title: 'Table of <span class="tone-cyan">Contents</span>',
      items: ['What is UVM?', 'Advantages of UVM in Verification', 'The Problem with Traditional UVM', 'What is PyUVM?', 'Advantages of PyUVM over Traditional UVM', 'The Structure of PyUVM', 'What Are Phases? With Example', 'What is TLM and How to Use It', 'Types of TLM with Figure and Code', 'What is Factory', 'PyUVM Testbench Architecture', 'What is cocotb?', 'How PyUVM Uses cocotb', 'Open-Source Simulation Tools', 'The Complete Open-Source Verification Stack', 'PyUVM Code Example', 'How to Extend This Example', 'Summary']
    }),
    t.lectureBulletSlide({
      index: 3,
      title: 'What is <span class="tone-blue">UVM</span>?',
      lead: 'UVM = Universal Verification Methodology',
      bullets: [
        'A standardized verification methodology for hardware design verification',
        'Built on top of <strong>SystemVerilog</strong>',
        'Used to create <strong>structured, reusable, and scalable</strong> testbenches based on object-oriented programming concepts',
        'It also includes a set of <strong>guidelines</strong> and <strong>best practices</strong> for developing testbenches, as well as a methodology for running simulations and analyzing results.',
        'Widely adopted by the semiconductor industry'
      ]
    }),
    t.revealCardGridSlide({
      index: 4,
      tag: 'Benefits',
      title: 'Advantages of UVM <span class="serif tone-cyan">in Verification</span>',
      cards: [{ icon: '01', title: 'Reuse', body: h.paragraph('Drivers, monitors, agents, and sequences can be reused across blocks and projects.') }, { icon: '02', title: 'Scalability', body: h.paragraph('A common hierarchy makes it easier to grow from one interface to many interfaces and full-chip environments.') }, { icon: '03', title: 'Separation of Concerns', body: h.paragraph('Sequences generate stimulus, drivers drive pins, monitors observe behavior, and scoreboards check results.') }, { icon: '04', title: 'Constrained Random', body: h.paragraph('Randomized transactions help find corner cases that directed tests often miss.') }, { icon: '05', title: 'Coverage-Driven Flow', body: h.paragraph('Functional coverage and scoreboards help answer whether the design was tested well enough.') }, { icon: '06', title: 'Team Standardization', body: h.paragraph('Because the architecture is standardized, new engineers can read an unfamiliar testbench faster.') }]
    }),
    t.infoSplitSlide({
      index: 5,
      tag: 'Motivation',
      title: 'The Problem with <span class="tone-rose">Traditional UVM</span>',
      bullets: ['<strong>Commercial simulator cost</strong> is often the first barrier for students, startups, and open-source projects.', '<strong>SystemVerilog syntax</strong> is powerful, but it is also verbose and harder to learn for many software-oriented engineers.', '<strong>Macros and boilerplate</strong> can make beginner UVM code feel heavier than the verification idea itself.', '<strong>Open-source workflows</strong> are less natural in a traditional UVM setup.', '<strong>Python ecosystems and CI tooling</strong> are easier to plug into than many classic simulator-centered flows.'],
      aside: [h.heading('h3', 'Cost and Access', 'anim-up d3'), h.compareItem({ label: 'X', text: 'Traditional UVM often depends on licensed simulators.' }), h.compareItem({ label: 'X', text: 'Learning SystemVerilog + UVM together can slow onboarding.' }), h.compareItem({ label: 'OK', text: 'PyUVM + cocotb + Icarus/Verilator/GHDL can be used in a zero-license flow.', positive: true }), h.wrap('div', '', 'spacer'), h.card({ body: [h.wrap('h4', 'Why that matters', 'tone-green'), h.paragraph('Open-source verification lowers the barrier for teaching, prototyping, CI automation, and community-driven hardware development.')] })]
    }),
    t.infoSplitSlide({
      index: 6, tag: 'Core Technology', title: 'What is <span class="tone-blue">Py</span><span class="tone-cyan">UVM</span>?',
      bullets: ['<strong>PyUVM</strong> is a Python implementation of the UVM methodology.', 'It keeps the familiar ideas of <strong>components, phasing, sequences, TLM, config_db, and factory</strong>.', 'It uses <strong>cocotb</strong> to talk to the simulator and the DUT.', 'It lets verification engineers write UVM-style environments in Python instead of SystemVerilog.', 'That means easier scripting, faster iteration, simpler packaging, and access to the broader Python ecosystem.'],
      aside: [h.heading('h3', 'In This Repository', 'anim-up d3'), h.card({ body: [h.paragraph('This project verifies a small ALU with:'), h.list(['<strong>rtl/alu.sv</strong> as the DUT', '<strong>tb/alu_bfm.py</strong> as the cocotb bus functional model', '<strong>tb/alu_env.py</strong> for agent, driver, monitor, scoreboard, and environment', '<strong>tb/alu_test.py</strong> for UVM-style tests', '<strong>tb/sequences/alu_sequences.py</strong> for the transaction and sequences'], { classes: 'bullet-list mt-sm' })] }), h.wrap('div', '', 'spacer'), h.card({ body: [h.wrap('h4', 'One-line description', 'tone-cyan'), h.paragraph('PyUVM gives us the structure of UVM and the productivity of Python.')] })]
    }),
    t.comparisonRowsSlide({
      index: 7, tag: 'Comparison', title: 'Advantages of <span class="tone-blue">PyUVM</span> <span class="serif">over Traditional UVM</span>',
      rows: [[{ label: 'SV', text: 'More boilerplate and heavier syntax.' }, { label: 'PY', text: 'Cleaner Python code with less ceremony.', positive: true }], [{ label: 'SV', text: 'Commonly tied to licensed tools and vendor flows.' }, { label: 'PY', text: 'Fits open-source simulators and standard Python tooling.', positive: true }], [{ label: 'SV', text: 'Harder for software engineers and students to learn quickly.' }, { label: 'PY', text: 'Python lowers the learning curve for many teams.', positive: true }], [{ label: 'SV', text: 'Integrating data science or automation libraries is less natural.' }, { label: 'PY', text: 'Easy access to pytest, pandas, NumPy, CI, and scripting.', positive: true }]],
      cards: [h.card({ cardTone: 'blue', body: [h.wrap('h4', 'Faster to write', 'tone-blue'), h.paragraph('Sequences and tests look like normal Python classes and coroutines.')] }), h.card({ cardTone: 'cyan', body: [h.wrap('h4', 'Faster to teach', 'tone-cyan'), h.paragraph('Students can focus on methodology before getting stuck in language details.')] }), h.card({ cardTone: 'green', body: [h.wrap('h4', 'Faster to automate', 'tone-green'), h.paragraph('Python testbenches fit naturally into scripts, CI pipelines, and package management.')] })]
    }),
    t.hierarchySlide({
      index: 8, tag: 'Hierarchy', title: 'The Structure of <span class="tone-blue">PyUVM</span>',
      leftTitle: 'Main Class Family', leftContent: hierarchyTree, rightTitle: 'How the Pieces Fit',
      bullets: ['<strong>uvm_test</strong> is the top-level test case.', '<strong>uvm_env</strong> groups the verification components.', '<strong>uvm_agent</strong> usually contains the sequencer, driver, and monitor for one interface.', '<strong>uvm_sequence_item</strong> models one transaction.', '<strong>uvm_sequence</strong> generates streams of transactions.', '<strong>uvm_scoreboard</strong> checks expected versus observed behavior.', '<strong>ConfigDB</strong>, <strong>TLM</strong>, and the <strong>factory</strong> support communication and configurability.'],
      footerCard: h.card({ body: [h.wrap('h4', 'Repo mapping', 'tone-cyan'), h.paragraph('<strong>AluSeqItem</strong>, <strong>AddSequence</strong>, <strong>AluDriver</strong>, <strong>AluMonitor</strong>, <strong>AluScoreboard</strong>, <strong>AluAgent</strong>, <strong>AluEnv</strong>, and <strong>AluBaseTest</strong> mirror this structure directly.')] })
    }),
    t.phaseExampleSlide({
      index: 9, tag: 'Phases', title: 'What Are <span class="tone-cyan">Phases</span>? With Example',
      phases: ['build', 'connect', 'run', 'check', 'report'],
      bullets: ['<strong>Phases</strong> are ordered steps in the UVM testbench lifecycle.', '<strong>build_phase</strong> creates components and sets configuration.', '<strong>connect_phase</strong> wires ports, exports, or references together.', '<strong>run_phase</strong> drives and monitors simulation-time activity.', '<strong>check_phase</strong> evaluates correctness after run-time activity finishes.', '<strong>report_phase</strong> prints final status and statistics.'],
      codeTitle: 'Example from this ALU project',
      code: ['class AluEnv(uvm_env):', '    def build_phase(self):', '        ConfigDB().set(self, "*", "BFM", AluBfm())', '        self.agent = AluAgent("agent", self)', '        self.scoreboard = AluScoreboard("scoreboard", self)', '', '    def connect_phase(self):', '        self.agent.monitor.scoreboard = self.scoreboard', '', 'class AluBaseTest(uvm_test):', '    async def run_phase(self):', '        self.raise_objection()', '        await AddSequence().start(self.env.agent.seqr)', '        self.drop_objection()', '', 'class AluScoreboard(uvm_scoreboard):', '    def check_phase(self):', '        ...', '', '    def report_phase(self):', '        self.logger.info("ALU scoreboard checked")']
    }),
    t.tlmOverviewSlide({
      index: 10, tag: 'Communication', title: 'What is <span class="tone-rose">TLM</span> and How to Use It',
      bullets: ['<strong>TLM</strong> means Transaction-Level Modeling.', 'Instead of passing raw signals, components communicate using <strong>transactions</strong>.', 'That makes verification code more reusable and easier to reason about.', 'Common TLM usage includes <strong>sequencer to driver</strong>, <strong>monitor to scoreboard</strong>, and <strong>FIFO-style channels</strong>.', 'In PyUVM, TLM ports and exports are used to connect producers and consumers of transactions.'],
      callout: h.card({ body: [h.wrap('h4', 'In this repo', 'tone-cyan'), h.paragraph('The current code already uses the standard sequence-item handshake between <strong>sequencer</strong> and <strong>driver</strong>. The monitor then forwards completed items to the scoreboard with a direct Python call.')] }),
      codeTitle: 'How to use it',
      code: ['class AluAgent(uvm_agent):', '    def build_phase(self):', '        self.seqr = uvm_sequencer("seqr", self)', '        self.driver = AluDriver("driver", self)', '', '    def connect_phase(self):', '        self.driver.seq_item_port.connect(', '            self.seqr.seq_item_export', '        )', '', 'class AluDriver(uvm_driver):', '    async def run_phase(self):', '        while True:', '            item = await self.seq_item_port.get_next_item()', '            await bfm.send_op(item.a, item.b, item.op)', '            self.seq_item_port.item_done()'],
      footerCard: h.card({ body: [h.wrap('h4', 'Good mental model', 'tone-green'), h.paragraph('Sequence creates the transaction. Sequencer hands it over. Driver consumes it. Monitor publishes observed transactions. Scoreboard checks them.')] })
    }),
    t.tlmTypesSlide({
      index: 11, tag: 'Communication Patterns', title: 'Types of <span class="tone-rose">TLM</span> with Figure and Code',
      intro: 'PyUVM also provides blocking and nonblocking put/get/peek/transport interfaces. These three patterns are the easiest ones to teach first and show up often in real verification code.',
      cards: [{ chip: 'seq_item', tone: 'violet', title: '1. Sequencer to Driver', copy: 'Use a sequence-item handshake when the driver must pull ordered stimulus from the sequencer.', figure: h.wrap('div', [h.wrap('div', 'Sequence', 'diagram-box violet'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Sequencer', 'diagram-box amber'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Driver', 'diagram-box rose')].join(''), 'tlm-mini-figure'), code: ['self.driver.seq_item_port.connect(', '    self.seqr.seq_item_export', ')', '', 'item = await self.seq_item_port.get_next_item()', 'self.seq_item_port.item_done()'] }, { chip: 'analysis', tone: 'cyan', title: '2. Monitor Broadcast', copy: 'Use analysis TLM when one observed transaction should fan out to a scoreboard, coverage collector, or logger.', figure: h.wrap('div', [h.wrap('div', 'Monitor', 'diagram-box green'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'analysis_port', 'diagram-box cyan'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Scoreboard', 'diagram-box amber'), h.wrap('div', 'Coverage', 'diagram-box blue')].join(''), 'tlm-mini-figure tlm-broadcast-figure'), code: ['class CoverageCollector(uvm_subscriber):', '    def write(self, item):', '        self.coverage.sample(item.op)', '', 'self.monitor.ap.connect(self.coverage.analysis_export)', 'self.monitor.ap.write(item)'] }, { chip: 'fifo', tone: 'green', title: '3. Put/Get Channel', copy: 'Use a FIFO when producer and consumer run at different rates and you need buffering between them.', figure: h.wrap('div', [h.wrap('div', 'Producer', 'diagram-box blue'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'uvm_tlm_fifo', 'diagram-box cyan'), h.wrap('div', '&rarr;', 'diagram-arrow'), h.wrap('div', 'Consumer', 'diagram-box amber')].join(''), 'tlm-mini-figure'), code: ['self.req_fifo = uvm_tlm_fifo(', '    "req_fifo", self, size=8', ')', '', 'await self.req_fifo.put(item)', 'item = await self.req_fifo.get()'] }]
    }),
    t.conceptSplitSlide({
      index: 12, tag: 'Customization', title: 'What is the <span class="tone-amber">Factory</span>?',
      bullets: ['The <strong>factory</strong> is UVM\'s object creation mechanism.', 'It lets you create components and objects <strong>indirectly</strong> so you can replace them later without rewriting the environment.', 'This is useful for <strong>overrides</strong>, such as swapping in a tracing driver, error-injection driver, or alternative sequence.', 'In PyUVM, user classes are registered automatically, so there is no SystemVerilog-style registration macro burden.'],
      callout: h.card({ body: [h.wrap('h4', 'Why engineers like it', 'tone-amber'), h.paragraph('You can keep the environment stable and change behavior from the test layer, which is cleaner than editing the environment every time.')] }),
      rightTitle: 'Example override pattern',
      code: ['class LoggingDriver(AluDriver):', '    async def run_phase(self):', '        self.logger.info("Tracing transactions")', '        await super().run_phase()', '', 'class FactoryOverrideTest(uvm_test):', '    def build_phase(self):', '        uvm_factory().set_type_override_by_type(', '            AluDriver,', '            LoggingDriver', '        )', '        self.env = AluEnv("env", self)', '', 'class AluAgent(uvm_agent):', '    def build_phase(self):', '        self.driver = AluDriver.create("driver", self)'],
      note: 'Note: this repository currently instantiates the driver directly. The slide shows the factory-enabled pattern you would use when you want runtime overrides.'
    }),
    t.architectureSlide({
      index: 13, tag: 'Architecture', title: 'PyUVM Testbench <span class="serif tone-cyan">Architecture</span>',
      diagram: architectureDiagram,
      bullets: ['<strong>Sequence</strong> generates ALU operations such as add, subtract, multiply, and divide.', '<strong>Sequencer</strong> arbitrates sequence items for the driver.', '<strong>Driver</strong> converts each transaction into BFM calls.', '<strong>BFM</strong> drives DUT inputs and samples DUT outputs through cocotb.', '<strong>Monitor</strong> rebuilds observed transactions.', '<strong>Scoreboard</strong> predicts expected outputs and checks actual results.', '<strong>Test</strong> selects which sequence or set of sequences will run.'],
      footerCard: h.card({ body: [h.wrap('h4', 'Project-specific detail', 'tone-green'), h.paragraph('The divide sequence deliberately injects a divide-by-zero case so the scoreboard can verify both the result and the error flag.')] })
    }),
    t.conceptSplitSlide({
      index: 14, tag: 'Interface Layer', title: 'What is <span class="tone-cyan">cocotb</span>?',
      bullets: ['<strong>cocotb</strong> is a coroutine-based cosimulation framework for verifying HDL designs in Python.', 'It gives Python code access to simulator objects and DUT signals.', 'Testbenches use <strong>async/await</strong> and simulation triggers such as timers and clock edges.', 'It works with multiple simulators, which makes it a strong bridge between Python code and RTL simulation.'],
      callout: h.card({ body: [h.wrap('h4', 'Plain-English definition', 'tone-cyan'), h.paragraph('cocotb is the part that lets Python act like a verification language inside the simulator.')] }),
      rightTitle: 'Small cocotb-style example',
      code: ['from cocotb.triggers import Timer', '', 'async def send_op(self, a, b, op):', '    self.dut.a.value = a', '    self.dut.b.value = b', '    self.dut.op.value = op', '    await Timer(1, units="ns")', '', '    observed = {', '        "result": int(self.dut.result.value),', '        "div_by_zero": int(self.dut.div_by_zero.value),', '    }'],
      note: 'That is exactly the style used by <strong>tb/alu_bfm.py</strong> in this repository.',
      noteClass: 'fine-print tone-muted'
    }),
    t.stackWorkflowSlide({
      index: 15, tag: 'Integration', title: 'How PyUVM Uses <span class="tone-cyan">cocotb</span>',
      layers: [{ title: 'PyUVM', label: 'test, env, agent, sequences, phasing, TLM' }, { title: 'cocotb BFM', label: 'drive and sample DUT through Python coroutines' }, { title: 'Simulator', label: 'Icarus, Verilator, or GHDL execute the HDL' }, { title: 'RTL DUT', label: 'the hardware design under verification' }],
      bullets: ['PyUVM does <strong>methodology and organization</strong>.', 'cocotb does <strong>signal-level interaction with the simulator</strong>.', 'In this project, the driver never touches raw simulator APIs directly. It calls the <strong>AluBfm</strong>.', 'The BFM writes DUT inputs, waits for time to pass, then captures output values and queues them for the monitor.', 'This split keeps the testbench clean: PyUVM handles transactions while cocotb handles timing and signal access.'],
      code: ['bfm = ConfigDB().get(self, "", "BFM")', 'item = await self.seq_item_port.get_next_item()', 'await bfm.send_op(item.a, item.b, item.op)', 'self.seq_item_port.item_done()']
    }),
    t.toolGridSlide({
      index: 16, tag: 'Tools', title: 'Open-Source RTL <span class="serif tone-violet">Simulation Tools</span>',
      tools: [{ title: 'Icarus Verilog', tone: 'tone-blue', subtitle: 'Great for small Verilog/SystemVerilog teaching projects', items: ['Easy to install and widely used in examples', 'Works well with cocotb', 'Used by default in this repository\'s runner flow'] }, { title: 'Verilator', tone: 'tone-cyan', subtitle: 'Fast compiled simulation for many Verilog designs', items: ['Often preferred when simulation speed matters', 'Strong fit for CI pipelines and large regressions', 'Works with cocotb for supported flows'] }, { title: 'GHDL', tone: 'tone-violet', subtitle: 'Open-source simulator for VHDL users', items: ['Useful when the DUT or environment is VHDL-centric', 'Lets the same Python methodology reach VHDL designs', 'Pairs well with cocotb in mixed toolchains'] }],
      bottomCards: [h.card({ body: [h.wrap('h4', 'Waveform viewer', 'tone-green'), h.paragraph('<strong>GTKWave</strong> is not a simulator, but it completes the debug loop by viewing VCD/FST waveform traces.')] }), h.card({ body: [h.wrap('h4', 'Practical advice', 'tone-amber'), h.paragraph('Pick the simulator based on HDL language support, speed needs, and the maturity of your specific DUT flow.')] })]
    }),
    t.stackWorkflowSlide({
      index: 17, tag: 'Full Stack', title: 'The Complete <span class="tone-green">Open-Source</span> <span class="serif">Verification Stack</span>',
      layers: [{ title: 'PyUVM', label: 'verification architecture, tests, sequences, scoreboards' }, { title: 'cocotb', label: 'Python simulator bridge and coroutine scheduling' }, { title: 'Open-source simulator', label: 'Icarus Verilog, Verilator, or GHDL' }, { title: 'RTL', label: 'Verilog or VHDL design under test' }, { title: 'GTKWave + CI', label: 'debug waveforms and automate regressions' }],
      rightTitle: 'Typical workflow',
      bullets: ['Write or import the RTL.', 'Create PyUVM components and sequences in Python.', 'Use cocotb to drive and sample the DUT.', 'Run on an open-source simulator.', 'Inspect failures in logs and waveforms.', 'Automate regressions with scripts or CI.'],
      code: ['pip install -r requirements.txt', 'python run.py', 'python run.py --test AluDivideTest'],
      codeOptions: { lang: 'bash' }
    }),
    t.codePairSlide({
      index: 18, tag: 'Example', title: 'PyUVM <span class="serif tone-green">Code Example</span>',
      leftTitle: 'Sequence item and sequence',
      leftCode: ['class AluSeqItem(uvm_sequence_item):', '    OPS = {"add": 0, "sub": 1, "mul": 2, "div": 3}', '', '    def __init__(self, name="alu_seq_item", a=0, b=0, op=0):', '        super().__init__(name)', '        self.a = a', '        self.b = b', '        self.op = op', '        self.result = 0', '        self.div_by_zero = 0', '', 'class AddSequence(BaseAluSequence):', '    OP_NAME = "add"'],
      rightTitle: 'Environment and test',
      rightCode: ['class AluEnv(uvm_env):', '    def build_phase(self):', '        ConfigDB().set(self, "*", "WIDTH", 16)', '        ConfigDB().set(self, "*", "BFM", AluBfm())', '        self.agent = AluAgent("agent", self)', '        self.scoreboard = AluScoreboard("scoreboard", self)', '', 'class AluAllOpsTest(AluBaseTest):', '    SEQUENCES = (', '        AddSequence,', '        SubtractSequence,', '        MultiplySequence,', '        DivideSequence,', '    )'],
      bottomCards: [h.card({ body: [h.wrap('h4', 'What this teaches', 'tone-cyan'), h.paragraph('The transaction object holds data. The sequence generates items. The environment instantiates the architecture. The test chooses which sequences to run.')] }), h.card({ body: [h.wrap('h4', 'Good classroom demo', 'tone-green'), h.paragraph('This ALU example is small enough to understand quickly but still shows real verification structure, phasing, sequencing, checking, and open-source execution.')] })]
    }),
    t.roadmapSlide({
      index: 19, tag: 'Next Steps', title: 'How to <span class="tone-amber">Extend</span> This Example',
      bullets: ['Add more <strong>directed and random sequences</strong> to stress edge cases beyond simple arithmetic paths.', 'Track <strong>functional coverage</strong> for operations, corner values, sign behavior, and divide-by-zero scenarios.', 'Make the scoreboard more powerful by comparing against a reusable <strong>reference model</strong>.', 'Run <strong>regressions in CI</strong> so every RTL or testbench change is checked automatically.', 'Scale the same structure to a larger DUT by adding agents, interfaces, and more layered environments.'],
      rightTitle: 'Why this matters',
      cards: [h.card({ body: [h.wrap('h4', 'From demo to real flow', 'tone-green'), h.paragraph('This ALU project is a teaching example, but the next steps are the same ones used in production verification: better stimulus, measurable coverage, stronger checking, and automated regressions.')] }), h.wrap('div', '', 'spacer'), h.card({ body: [h.wrap('h4', 'Practical roadmap', 'tone-cyan'), h.paragraph('Start with one new sequence, add coverage points, connect the results to a regression script, and let the PyUVM structure grow with the design.')] })]
    }),
    t.summarySlide({
      index: 20, tag: 'Recap', title: 'Summary',
      topCards: [h.card({ cardTone: 'blue', body: [h.wrap('h4', 'UVM', 'tone-blue'), h.paragraph('A proven methodology for building reusable, scalable verification environments.')] }), h.card({ cardTone: 'cyan', body: [h.wrap('h4', 'PyUVM', 'tone-cyan'), h.paragraph('Brings those ideas into Python while keeping the structure verification teams already know.')] }), h.card({ cardTone: 'green', body: [h.wrap('h4', 'cocotb + open tools', 'tone-green'), h.paragraph('Provide the simulator bridge and execution layer needed for a practical zero-license flow.')] })],
      bullets: ['Use <strong>phases</strong> to organize lifecycle behavior.', 'Use <strong>TLM</strong> to pass transactions cleanly between components.', 'Use the <strong>factory</strong> when you want clean overrides and more flexible tests.', 'Use <strong>cocotb</strong> to interact with signals and simulation time.', 'Use <strong>PyUVM + cocotb + open-source simulators</strong> for an accessible modern verification stack.']
    }),
    t.resourcesSlide({
      index: 21,
      tag: 'Q&amp;A',
      title: 'Thank <span class="serif tone-cyan">You</span>',
      subtitle: 'Questions and Discussion',
      resourcesTitle: 'Resources',
      resources: [{ label: 'Repo', value: 'PyUVM_Example' }, { label: 'PyUVM', value: 'pyuvm.github.io/pyuvm' }, { label: 'cocotb', value: 'docs.cocotb.org' }, { label: 'Run', value: 'python run.py' }, { label: 'Single test', value: 'python run.py --test AluAddTest' }]
    })
  ];

  window.PYUVM_SLIDES = slides;
})();
