# Specification

## Summary
**Goal:** Display only actual entered dimensions (with fractions) in all user-facing outputs, while keeping rounded dimensions for internal calculations only.

**Planned changes:**
- Update PDF generation to show entered dimensions exactly as typed (including fractions like 1/8, 5/8)
- Remove or replace the "All calculations are based on rounded dimensions..." note in PDF with "Calculations are done as per standard carpenter rules. Entered sizes are shown for reference."
- Update WhatsApp share message to display entered dimensions instead of rounded dimensions
- Update web view table to show entered dimensions with fractions
- Verify print view shows entered dimensions consistently with PDF output
- Keep rounded dimensions for internal square feet calculations only

**User-visible outcome:** Users will see their exact entered door dimensions (including fractions) in the PDF, web view, print view, and WhatsApp messages, while calculations continue to work correctly using rounded values internally.
