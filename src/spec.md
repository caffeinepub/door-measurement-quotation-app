# Specification

## Summary
**Goal:** Fix the loading errors preventing door entries and grand totals from displaying in the door size calculator application.

**Planned changes:**
- Debug and resolve the "Error loading door entries" issue in the DoorEntryList component by fixing the useQuery hook implementation
- Debug and resolve the "Error loading totals" issue in the GrandTotals component by fixing the totals calculation query
- Verify backend actor methods (getAllTypes and getTotalSquareFeet) are accessible and responding correctly to frontend queries
- Implement proper error handling with retry capability for failed queries
- Ensure loading states display appropriate UI indicators

**User-visible outcome:** Door entries and grand totals load successfully without error messages, allowing users to view their door size entries and calculated totals.
