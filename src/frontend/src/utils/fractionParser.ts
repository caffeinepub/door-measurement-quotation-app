/**
 * Utility functions for parsing and handling fraction inputs for door dimensions
 * Supports Indian fractions: 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8
 */

/**
 * Parse a dimension input that can be in decimal or fraction format
 * Examples: "78.25", "78 2/8", "78 1/4", "79 3/8"
 * Returns the decimal value and the original entered format
 */
export function parseDimensionInput(input: string): {
  decimal: number;
  enteredFormat: string;
  isValid: boolean;
} {
  const trimmed = input.trim();
  
  // Try to parse as decimal first
  const decimalMatch = trimmed.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    const decimal = parseFloat(decimalMatch[1]);
    if (!isNaN(decimal) && decimal > 0) {
      return {
        decimal,
        enteredFormat: trimmed,
        isValid: true,
      };
    }
  }
  
  // Try to parse as fraction format: "78 2/8" or "78 1/4"
  const fractionMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const whole = parseInt(fractionMatch[1], 10);
    const numerator = parseInt(fractionMatch[2], 10);
    const denominator = parseInt(fractionMatch[3], 10);
    
    if (denominator === 0) {
      return { decimal: 0, enteredFormat: trimmed, isValid: false };
    }
    
    const fractionValue = numerator / denominator;
    const decimal = whole + fractionValue;
    
    // Validate that the fraction is allowed (must be in eighths: 1/8 through 7/8)
    const eighthValue = Math.round(fractionValue * 8);
    if (eighthValue >= 1 && eighthValue <= 7 && Math.abs(fractionValue - eighthValue / 8) < 0.001) {
      return {
        decimal,
        enteredFormat: trimmed,
        isValid: true,
      };
    }
  }
  
  return { decimal: 0, enteredFormat: trimmed, isValid: false };
}

/**
 * Convert a decimal to fraction format for display
 * Returns format like "78 2/8" or "78"
 */
export function decimalToFractionDisplay(decimal: number): string {
  const whole = Math.floor(decimal);
  const fraction = decimal - whole;
  
  // Round to nearest eighth
  const eighths = Math.round(fraction * 8);
  
  if (eighths === 0) {
    return whole.toString();
  }
  
  if (eighths === 8) {
    return (whole + 1).toString();
  }
  
  return `${whole} ${eighths}/8`;
}

/**
 * Validate if a dimension input is valid
 */
export function isValidDimension(input: string): boolean {
  const result = parseDimensionInput(input);
  return result.isValid && result.decimal > 0;
}
