export interface OSRData {
  revenueSource: string;
  revenueType: RevenueType;
  actualRevenue: number;
}

export const REVENUE_TYPES = {
  PROPERTY_TAX: 'Property Tax',
  LICENSE: 'License',
  MIXED_USER_CHARGE: 'Mixed User Charge (Markets / Parking)',
  LONG_TERM_USER_CHARGE: 'Long-term User Charge (Government)',
  SHORT_TERM_USER_CHARGE: 'Short-term User Charge',
  OTHER: 'Other'
} as const;

export type RevenueType = typeof REVENUE_TYPES[keyof typeof REVENUE_TYPES];
