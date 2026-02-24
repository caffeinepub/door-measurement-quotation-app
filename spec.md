# Specification

## Summary
**Goal:** Fix backend and frontend errors that cause "Error loading door entries" and "Error loading totals" on app load.

**Planned changes:**
- Fix the backend Motoko actor so that `getDoorEntries` and `getTotals` (or equivalent) methods return valid responses without trapping or throwing
- Fix the frontend React Query hooks in `useQueries.ts` to correctly initialize the actor before queries run and ensure queries are only enabled when the actor is non-null
- Ensure error handling in the query hooks does not incorrectly treat a successful response as an error

**User-visible outcome:** On app load, the door entries list and totals section render without error states (showing an empty list/zero totals or actual data), and the Retry buttons resolve successfully.
