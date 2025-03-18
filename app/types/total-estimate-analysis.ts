export interface RevenueMetrics {
  actual: number;
  potential: number;
  gap: number;
}

export interface GapBreakdown {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  rateGap: number;
  combinedGaps: number;
}

export interface RevenueStream {
  name: string;
  type: string;
  actual: number;
  potential: number;
  gap: number;
  gapBreakdown?: GapBreakdown;
}

export interface RevenueData {
  name: string;
  'Total Revenue': number;
  'Mixed User Charges': number;
  'Short-Term User Charges': number;
  'Long-Term User Charges': number;
  'License Fees': number;
  'Property Tax': number;
}

export interface OSRData {
  revenueSource: string;
  revenueType: string;
  actualRevenue: number;
}

export interface TotalEstimateMetrics {
  totalActualRevenue: number;
  totalPotentialRevenue: number;
  totalGap: number;
  budgetedOSR: number;
  totalPotentialOtherOSRs: number;
  revenueStreams: RevenueStream[];
  gapBreakdown: GapBreakdown;
  revenueData: RevenueData[];
  osrData: OSRData[];
}
