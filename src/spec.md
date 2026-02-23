# Specification

## Summary
**Goal:** Fix coating calculation bug so all four coating types are calculated and displayed for every door entry.

**Planned changes:**
- Update DoorEntryList.tsx to calculate and display all four coating type amounts (Single Coating, Double Coating, Double + Sagwan Patti, Laminate) for every door row using their respective rates (₹185, ₹220, ₹270, ₹450)
- Remove conditional logic that causes '-' placeholders in coating columns
- Update GrandTotals.tsx to calculate correct totals for all coating types by summing (sqFt × rate) across all doors
- Update pdfGenerator.ts to include all four coating calculations in PDF exports
- Update whatsappShare.ts to include all four coating calculations in WhatsApp share messages
- Review and update coatingRates.ts utility functions to support calculating all coating types simultaneously
- Ensure all amounts are formatted with ₹ symbol, comma separators, and two decimal places

**User-visible outcome:** Users will see calculated amounts for all four coating types in every door row, with correct totals displayed in the summary, PDF exports, and WhatsApp shares. No more '-' placeholders will appear.
