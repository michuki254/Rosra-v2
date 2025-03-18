import { OSRData } from '../types/osr';

/**
 * Calculates the total revenue from the top 5 OSR sources
 * @param osrData Array of OSR data entries
 * @returns Total revenue from top 5 sources
 */
export const calculateTotalTop5 = (osrData: OSRData[] | undefined): number => {
  if (!osrData || !Array.isArray(osrData)) return 0;
  return osrData.slice(0, 5).reduce((sum, item) => sum + (item?.actualRevenue || 0), 0);
};

/**
 * Calculates the remaining revenue after top 5 sources
 * @param actualOSR Total actual OSR
 * @param totalTop5 Total from top 5 sources
 * @returns Remaining revenue
 */
export const calculateOtherRevenue = (actualOSR: number, totalTop5: number): number => {
  return Math.max(0, actualOSR - totalTop5);
};

/**
 * Formats a number as currency in KES format
 * @param value Number to format
 * @returns Formatted string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Parses a string input to a number, removing non-numeric characters
 * @param value String to parse
 * @returns Parsed number
 */
export const parseNumericInput = (value: string): number => {
  const numericValue = value.replace(/[^\d.]/g, '');
  return numericValue ? parseFloat(numericValue) : 0;
};
