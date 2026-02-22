/**
 * Utility functions for rounding door dimensions according to Indian carpenter standards
 */

/**
 * Round height to standard sizes based on threshold rules
 * ≤72 → 72
 * ≤75 → 75
 * ≤78 → 78
 * ≤80 → 80
 * >80 → 84
 */
export function roundHeight(height: number): number {
  if (height <= 72) return 72;
  if (height <= 75) return 75;
  if (height <= 78) return 78;
  if (height <= 80) return 80;
  return 84;
}

/**
 * Round width to standard sizes based on threshold rules
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
  if (width <= 30) return 30;
  if (width <= 32) return 32;
  if (width <= 34) return 34;
  if (width <= 36) return 36;
  if (width <= 38) return 38;
  if (width <= 40) return 40;
  if (width <= 42) return 42;
  return 48;
}
