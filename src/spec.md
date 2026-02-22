# Specification

## Summary
**Goal:** Build a door measurement and quotation calculator for door manufacturers and carpenters that accepts decimal door dimensions, applies industry-standard rounding rules, calculates square footage and pricing, and manages multiple door entries with grand totals.

**Planned changes:**
- Create backend data model for door entries with height, width, rate, rounded dimensions, square feet, and amount calculations
- Implement height rounding logic (72, 75, 78, 80, or 84 inches based on input thresholds)
- Implement width rounding logic (30, 32, 34, 36, 38, 40, 42, or 48 inches based on input thresholds)
- Calculate square feet as (rounded height × rounded width) / 144, rounded to 2 decimals
- Calculate amount as square feet × rate, rounded to nearest integer
- Store multiple door entries in backend stable storage
- Create input form with decimal fields for height, width, and rate (default 185)
- Display each door entry with rounded size (height × width format), square feet, and amount
- Show grand total square feet and grand total amount across all entries
- Add delete functionality for individual entries with automatic total recalculation
- Design professional interface with warm wood-inspired tones (browns, natural tans, forest greens) suitable for construction industry

**User-visible outcome:** Users can enter door dimensions in decimal inches, see automatically rounded sizes with calculated square footage and pricing at $185/sq.ft (customizable), manage multiple door entries in a list, and view running totals in a professional, carpenter-friendly interface.
