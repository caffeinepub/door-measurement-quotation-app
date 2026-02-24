// Coating rates per square foot (in Rupees)
export const SINGLE_COATING_RATE = 185;
export const DOUBLE_COATING_RATE = 220;
export const DOUBLE_SAGWAN_RATE = 270;
export const LAMINATE_RATE = 450;

import { CoatingType } from "../backend";

/**
 * Get the rate for a specific coating type
 */
export function getCoatingRate(coatingType: CoatingType): number {
  // Handle both enum values and string values
  const typeStr = typeof coatingType === 'string' ? coatingType : String(coatingType);
  
  if (typeStr === 'single' || typeStr === CoatingType.single) {
    return SINGLE_COATING_RATE;
  }
  if (typeStr === 'double' || typeStr === CoatingType.double_ || typeStr === 'double_') {
    return DOUBLE_COATING_RATE;
  }
  if (typeStr === 'doubleSagwan' || typeStr === CoatingType.doubleSagwan) {
    return DOUBLE_SAGWAN_RATE;
  }
  if (typeStr === 'laminate' || typeStr === CoatingType.laminate) {
    return LAMINATE_RATE;
  }
  
  return 0;
}

/**
 * Calculate all coating type amounts for a given square footage
 */
export interface AllCoatingAmounts {
  singleCoating: number;
  doubleCoating: number;
  doubleSagwan: number;
  laminate: number;
}

export function calculateAllCoatingAmounts(squareFeet: number): AllCoatingAmounts {
  return {
    singleCoating: Math.round(squareFeet * SINGLE_COATING_RATE),
    doubleCoating: Math.round(squareFeet * DOUBLE_COATING_RATE),
    doubleSagwan: Math.round(squareFeet * DOUBLE_SAGWAN_RATE),
    laminate: Math.round(squareFeet * LAMINATE_RATE),
  };
}
