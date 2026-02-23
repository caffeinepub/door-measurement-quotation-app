# Specification

## Summary
**Goal:** Fix duplicate door size entries being merged or overwritten by implementing unique ID-based storage.

**Planned changes:**
- Replace size-based HashMap storage with array-based storage using unique IDs in backend
- Generate unique IDs for each door entry regardless of dimensions
- Remove all size-based keying logic from frontend form, list display, and state management
- Display all door entries as individual rows without grouping by size
- Update totals calculation to sum all entries including those with identical dimensions
- Update PDF and WhatsApp outputs to list all entries separately without grouping

**User-visible outcome:** Users can add multiple door entries with identical dimensions and coating types, and each will appear as a separate row in the list, totals, PDF, and WhatsApp outputs.
