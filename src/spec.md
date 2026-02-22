# Specification

## Summary
**Goal:** Automatically clear customer name and mobile number fields after successfully generating and printing a quotation.

**Planned changes:**
- Reset customer name and mobile number input fields in CustomerInfoForm after successful PDF generation
- Update App.tsx to clear customer data state, coordinating with existing door entries clearing behavior
- Ensure fields only clear on successful generation, not on failure

**User-visible outcome:** After generating and printing a quotation, the customer name and mobile number fields automatically clear, ready for the next customer entry without manual clearing.
