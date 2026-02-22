# Specification

## Summary
**Goal:** Add fraction input support for door dimensions and display actual entered sizes (not rounded) throughout the application.

**Planned changes:**
- Add support for inch fractions (0, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8) in height and width input fields
- Accept input as decimal (78.25) or fraction notation (78 2/8)
- Display actual entered door size (e.g., "79 1/4 × 30 1/8") in table and PDF, not rounded size
- Store both actual entered dimensions and rounded dimensions in backend
- Remove Rate and Quantity columns from door entries table
- Update totals section to show: Single Coating Total, Double Coating Total, Double Coating + Sagwan Patti Total, Laminate Total, and Total Square Feet
- Fix WhatsApp PDF sharing to generate actual downloadable PDF file using native share intent
- Update confirmation message to display: "Quotation generated based on actual size."
- Ensure PDF matches updated UI structure with actual dimensions

**User-visible outcome:** Users can enter door dimensions with inch fractions, see their exact entered dimensions (not rounded) in the table and PDF quotations, and successfully share PDF quotations via WhatsApp as file attachments.
