# Specification

## Summary
**Goal:** Refactor door quotation system to use size-based grouping with coating columns instead of separate entries per coating.

**Planned changes:**
- Change door count logic to count only unique door sizes (height × width), not individual coating selections
- Replace door entries table with new structure: Sr No | Size | Single Coating | Double Coating | Double Coating + Sagwan Patti | Laminate | Sq.Ft.
- Display one row per unique door size with coating amounts in separate columns
- Remove all rate (₹/sq.ft) displays from UI and PDF, show only final calculated amounts
- Update totals section to show Total Square Feet and separate totals for each coating type only (remove Grand Total and Total Quantity)
- Update calculation formulas: Sq.Ft = (Rounded Height × Rounded Width) / 144, Amount = Sq.Ft × coating rate
- Refactor backend data model to group entries by unique size with coating selections as properties
- Update confirmation message to display "Quotation generated for X door size(s)" based on unique size count
- Ensure consistent table layout and totals between app preview UI and generated PDF

**User-visible outcome:** Users can create door quotations where each unique door size appears as a single row with coating types shown in separate columns, making it easier to compare coating options for the same door size. The quotation shows only calculated amounts without rates, and totals are broken down by coating type.
