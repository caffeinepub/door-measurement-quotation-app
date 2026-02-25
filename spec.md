# Specification

## Summary
**Goal:** Add carpenter-style rounding rules for door size calculation so that oversized doors are calculated using standard rounded dimensions, while actual entered dimensions remain visible everywhere in the UI, PDF, and WhatsApp share.

**Planned changes:**
- Create `frontend/src/utils/dimensionRounding.ts` implementing two priority-ordered rounding rules:
  - Rule 1: width > 38 AND height < 80 → use 40×80 for calculation
  - Rule 2: width > 36 AND height < 78 → use 38×78 for calculation
  - If neither rule matches, return actual dimensions unchanged
- Update `frontend/src/utils/squareFeetCalculator.ts` to apply rounding rules before computing square footage using `(roundedHeight × roundedWidth) / 144`
- Update `frontend/src/utils/pdfGenerator.ts` to display actual entered dimensions in the table while using rounded square footage for amounts and totals
- Update `frontend/src/components/DoorEntryList.tsx` and `GrandTotals.tsx` to show actual dimensions in the table while computing amounts from rounded square footage
- Update `frontend/src/components/QuotationActions.tsx` and `frontend/src/utils/whatsappShare.ts` to show actual dimensions in share text while using rounded amounts
- Apply rounding rules uniformly across all four coating types (Single, Double, Double + Sagwan Patti, Laminate)

**User-visible outcome:** Door amounts and totals in the table, PDF, and WhatsApp share are calculated using rounded standard dimensions for oversized doors, but the user always sees the actual dimensions they entered — never the rounded values.
