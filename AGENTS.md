# Agent Notes

- Always verify that slide indices in `assets/js/pyuvm_slides_data.js` are contiguous and match the visual slide count/order after adding, removing, or reordering slides.
- If a slide is removed visually, remove its corresponding slide object and update all following `index` values plus any matching agenda/table-of-contents entries.
