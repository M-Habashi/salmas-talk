# Agent Notes

- Always verify that slide indices in `assets/js/pyuvm_slides_data.js` are contiguous and match the visual slide count/order after adding, removing, or reordering slides.
- If a slide is removed visually, remove its corresponding slide object and update all following `index` values plus any matching agenda/table-of-contents entries.
- For SVG arrows in presentation figures, use one source of truth: draw connectors with SVG `marker-end` on lines/paths and avoid separate manual arrowhead polygons.
- When verifying animated diagrams, check the final revealed state in Chromium/Playwright after the animation completes.
- For SVG-heavy slides that should fill the slide area, prefer tightening the SVG `viewBox` to crop unused internal whitespace instead of relying on CSS `scale()`.
- If an SVG slide must avoid overlapping the fixed page counter, reserve bottom space from the actual rendered counter metrics via shared CSS variables or runtime measurement, not hardcoded padding guesses.
