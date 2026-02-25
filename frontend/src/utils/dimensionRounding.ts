/**
 * Utility functions for rounding door dimensions according to carpenter-style standards.
 *
 * Two rules are evaluated in strict priority order (Rule 1 first, then Rule 2).
 * Rounded dimensions are INTERNAL ONLY — used for sq ft and amount calculations.
 * Display must always use actual entered dimensions.
 *
 * RULE 1 (highest priority):
 *   IF actualWidth > 38 AND actualHeight < 80
 *   → roundedWidth = 40, roundedHeight = 80
 *
 * RULE 2 (second priority):
 *   IF actualWidth > 36 AND actualHeight < 78
 *   → roundedWidth = 38, roundedHeight = 78
 *
 * If neither rule matches, actual dimensions are returned unchanged.
 *
 * Acceptance criteria:
 *   WIDTH=39,   HEIGHT=79  → Rule 1 fires → 40 × 80
 *   WIDTH=37,   HEIGHT=77  → Rule 2 fires → 38 × 78
 *   WIDTH=39,   HEIGHT=80  → No rule fires → actual dims
 *   WIDTH=36,   HEIGHT=77  → No rule fires → actual dims
 *   WIDTH=38.5, HEIGHT=75  → Rule 1 fires → 40 × 80
 */
export function roundDimensions(
  width: number,
  height: number
): { widthRounded: number; heightRounded: number } {
  // RULE 1: WIDTH > 38 AND HEIGHT < 80 → 40 × 80
  if (width > 38 && height < 80) {
    return { widthRounded: 40, heightRounded: 80 };
  }

  // RULE 2: WIDTH > 36 AND HEIGHT < 78 → 38 × 78
  if (width > 36 && height < 78) {
    return { widthRounded: 38, heightRounded: 78 };
  }

  // No rule matched — use actual dimensions for calculation
  return { widthRounded: width, heightRounded: height };
}
