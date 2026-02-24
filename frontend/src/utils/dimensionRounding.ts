/**
 * Utility functions for rounding door dimensions according to custom carpenter standards
 */

/**
 * Round height to standard sizes based on custom threshold rules
 * >78 and ≤80 → 80
 * >80 and ≤84 → 84
 * Otherwise apply standard rules:
 * ≤72 → 72
 * ≤75 → 75
 * ≤78 → 78
 */
export function roundHeight(height: number): number {
  // Custom rounding rules
  if (height > 78 && height <= 80) return 80;
  if (height > 80 && height <= 84) return 84;

  // Standard rules for other ranges
  if (height <= 72) return 72;
  if (height <= 75) return 75;
  if (height <= 78) return 78;

  // For heights > 84
  return 84;
}

/**
 * Round width to standard sizes based on custom threshold rules
 * >78 and ≤80 → 80
 * >80 and ≤84 → 84
 * Otherwise apply standard rules:
 * ≤30 → 30
 * ≤32 → 32
 * ≤34 → 34
 * ≤36 → 36
 * ≤38 → 38
 * ≤40 → 40
 * ≤42 → 42
 * >42 → 48
 */
export function roundWidth(width: number): number {
  // Custom rounding rules (same as height)
  if (width > 78 && width <= 80) return 80;
  if (width > 80 && width <= 84) return 84;

  // Standard rules for other ranges
  if (width <= 30) return 30;
  if (width <= 32) return 32;
  if (width <= 34) return 34;
  if (width <= 36) return 36;
  if (width <= 38) return 38;
  if (width <= 40) return 40;
  if (width <= 42) return 42;

  // For widths > 42 and ≤78, or > 84
  if (width > 84) return 84;
  return 48;
}

/**
 * Round both dimensions together, applying custom combined rules in priority order.
 *
 * RULE 1 — Highest priority (40×80 rule):
 *   IF (actualWidth > 38 AND actualWidth < 40)
 *   OR (actualWidth === 40 AND actualHeight < 80)
 *   → roundedWidth = 40, roundedHeight = 80
 *
 * RULE 2 — Second priority (38×78 rule):
 *   IF actualWidth > 36 AND actualWidth <= 38 AND actualHeight < 78
 *   → roundedWidth = 38, roundedHeight = 78
 *
 * RULE 3 — Default: apply individual roundHeight / roundWidth functions.
 *
 * Actual entered dimensions are always preserved separately from rounded dimensions.
 * Rounded dimensions are INTERNAL ONLY — used for sq ft and amount calculations.
 * Display must always use actual entered dimensions.
 */
export function roundDimensions(
  width: number,
  height: number
): { widthRounded: number; heightRounded: number } {
  // RULE 1: Advanced 40×80 rule — must be evaluated FIRST (highest priority)
  // Condition: (width > 38 AND width < 40) OR (width === 40 AND height < 80)
  if ((width > 38 && width < 40) || (width === 40 && height < 80)) {
    return { widthRounded: 40, heightRounded: 80 };
  }

  // RULE 2: Custom 38×78 combined rule — evaluated second
  // Condition: width > 36 AND width <= 38 AND height < 78
  if (width > 36 && width <= 38 && height < 78) {
    return { widthRounded: 38, heightRounded: 78 };
  }

  // RULE 3: Default — apply individual rounding functions
  return {
    widthRounded: roundWidth(width),
    heightRounded: roundHeight(height),
  };
}
