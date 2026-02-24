/**
 * Calculate square feet from rounded dimensions
 * Formula: Sq.Ft = (roundedHeight × roundedWidth) / 144
 */
export function calculateSquareFeet(roundedHeight: number, roundedWidth: number): number {
  return (roundedHeight * roundedWidth) / 144;
}
