# Presentation Review Notes

This file records content, accuracy, spelling, and grammar issues found in the web presentation. No presentation files were changed.

## Findings

1. Slide 7 overstates PyUVM as a full implementation of IEEE 1800.2.
   - File reference: [assets/js/pyuvm_slides_data.js#L888](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L888)
   - Current text: `Python implementation of the UVM 1800.2 standard.`
   - Issue: This is too broad. The official PyUVM docs describe it as implementing the most-used parts of IEEE 1800.2, not the entire standard.
   - Suggested change: `Python implementation of the most commonly used parts of the UVM IEEE 1800.2 standard.`

2. Slides 12 and 13 are not accurate about PyUVM phasing.
   - File references:
   - [assets/js/pyuvm_slides_data.js#L942](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L942)
   - [assets/js/pyuvm_slides_data.js#L943](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L943)
   - [assets/js/pyuvm_slides_data.js#L624](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L624)
   - [assets/js/pyuvm_slides_data.js#L637](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L637)
   - Issues:
   - The deck says users can add a user-defined phase.
   - The diagram shows `reset`, `configure`, `main`, and `shutdown` as if they are part of the PyUVM phase set.
   - This conflicts with the official docs, which say PyUVM supports the common phases and does not implement the full custom phasing system.
   - This also conflicts with the phase table later in the deck, which lists only the common phases.
   - Suggested change:
   - On slide 12, replace `User has the ability to add a user-defined phase.` with `PyUVM supports the common UVM phases used in practice.`
   - On slide 12, replace `phases is defined inside the component classes only.` with `These phases are implemented as methods on component classes.`
   - On slide 13, remove or replace `reset`, `configure`, `main`, and `shutdown` so the diagram matches the common phases shown in slide 14.

3. Slide 15 says objections are used in the test class only.
   - File reference: [assets/js/pyuvm_slides_data.js#L973](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L973)
   - Current text: `It is used in the test class only.`
   - Issue: In PyUVM, `raise_objection()` is a `uvm_component` method, so this is not limited to the test class.
   - Suggested change: `Objections are commonly raised and dropped in the test, but they are available on uvm_component.`

4. Slide 5 assigns the wrong responsibility to the sequencer.
   - File references:
   - [assets/js/pyuvm_slides_data.js#L814](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L814)
   - [assets/js/pyuvm_slides_data.js#L815](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L815)
   - Current text: `Generates the transaction stream and sends ordered items to the driver.`
   - Issue: In PyUVM, sequences create sequence items. The sequencer queues and arbitrates them, then passes them to the driver.
   - Suggested change: `Arbitrates and delivers sequence items from sequences to the driver.`

5. Slide 22's cocotb example is internally inconsistent.
   - File references:
   - [assets/js/pyuvm_slides_data.js#L536](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L536)
   - [assets/js/pyuvm_slides_data.js#L537](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L537)
   - [assets/js/pyuvm_slides_data.js#L540](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L540)
   - [assets/js/pyuvm_slides_data.js#L546](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L546)
   - Issue: The comment says reset is applied, two edges are waited, and reset is released, but the code never waits two edges and never deasserts reset. It then drives inputs and checks output while reset remains asserted.
   - Suggested change:
   - Either update the code to match the comment by adding two awaited clock edges and deasserting reset before driving inputs,
   - Or simplify the comment to match the current code.
   - Recommended final intent: assert reset, wait two rising edges, deassert reset, then drive inputs and check the result.

6. Slide 4 has a visible typo in the architecture diagram.
   - File reference: [assets/js/pyuvm_slides_data.js#L85](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L85)
   - Current text: `Diver`
   - Issue: Should be `Driver`.
   - Suggested change: Replace `Diver` with `Driver`.

7. Slide 10 has multiple grammar and style problems.
   - File references:
   - [assets/js/pyuvm_slides_data.js#L921](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L921)
   - [assets/js/pyuvm_slides_data.js#L469](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L469)
   - [assets/js/pyuvm_slides_data.js#L471](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L471)
   - [assets/js/pyuvm_slides_data.js#L472](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L472)
   - [assets/js/pyuvm_slides_data.js#L473](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L473)
   - Issues:
   - `VS` is awkward in the title.
   - `Components :` has an incorrect space before the colon.
   - `test bench` should be `testbench`.
   - `Model TB hierarchy` is not grammatical.
   - `run time` should be `runtime`.
   - `Static-like (Quasi-Static)` is awkwardly phrased.
   - Suggested change:
   - Title: replace `Components VS Objects:` with `Components vs. Objects`
   - Heading: replace `Components :` with `Components:`
   - Bullet: replace `Used to build the test bench structure` with `Used to build the testbench structure`
   - Bullet: replace `Model TB hierarchy` with `Model the testbench hierarchy`
   - Bullet: replace `Static-like (Quasi-Static) structures created during run time and persistent throughout simulation` with `Quasi-static structures created during runtime and kept throughout the simulation`

8. Slides 15 and 16 use the wrong title form.
   - File references:
   - [assets/js/pyuvm_slides_data.js#L966](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L966)
   - [assets/js/pyuvm_slides_data.js#L979](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L979)
   - Current text: `Objections Management`
   - Issue: `Objection Management` is the correct form.
   - Suggested change: Replace `Objections Management` with `Objection Management` on both slides.

9. Slide 12 has grammar and capitalization mistakes.
   - File references:
   - [assets/js/pyuvm_slides_data.js#L940](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L940)
   - [assets/js/pyuvm_slides_data.js#L942](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L942)
   - [assets/js/pyuvm_slides_data.js#L943](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L943)
   - Issues:
   - `Synchronization between testbench components.` is a fragment.
   - `user defined` should be `user-defined`.
   - `phases is defined` should be `Phases are defined`.
   - Suggested change:
   - Replace `Synchronization between testbench components.` with `Phases synchronize testbench components.`
   - Replace `User has the ability to add a user defined phase.` with `PyUVM supports the common UVM phases used in practice.`
   - Replace `phases is defined inside the component classes only.` with `Phases are defined as methods inside component classes.`

10. Slides 18, 19, and 22 contain minor wording problems.
    - File references:
    - [assets/js/pyuvm_slides_data.js#L315](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L315)
    - [assets/js/pyuvm_slides_data.js#L1004](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L1004)
    - [assets/js/pyuvm_slides_data.js#L533](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js#L533)
    - Issues:
    - `FIFOS` should be `FIFOs`.
    - `Sequence TLM UVM` is awkward English.
    - `# waiting rising edge` is ungrammatical.
    - Suggested change:
    - Replace `UVM TLM FIFOS` with `UVM TLM FIFOs`
    - Replace `Sequence TLM UVM` with `Sequence TLM Flow`
    - Replace `# waiting rising edge` with `# Wait for a rising edge`

## Verified

- Slide indices in [assets/js/pyuvm_slides_data.js](/C:/Users/Victus/Desktop/folder_working/d_ai/z_soso/assets/js/pyuvm_slides_data.js) are contiguous from `1` through `24`.
- The rendered presentation also shows `24` total slides.

## Sources

- [pyuvm README](https://github.com/pyuvm/pyuvm)
- [pyuvm API docs](https://pyuvm.github.io/pyuvm/pyuvm.html)
- [cocotb docs](https://docs.cocotb.org/en/stable/)
