export interface GapBreakdown {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
}

export interface GapAnalysisMetrics {
  actualRevenue: number;
  potentialRevenue: number;
  totalGap: number;
  potentialLeveraged: number;
  gapBreakdown: GapBreakdown;
}
