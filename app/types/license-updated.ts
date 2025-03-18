// This file contains the updated LicenseAnalysisProps interface
// Copy the contents of this file to app/types/license.ts

export interface LicenseAnalysisProps {
  onMetricsChange?: (data: {
    metrics: {
      actual: number;
      potential: number;
      gap: number;
      potentialLeveraged: number;
      gapBreakdown: {
        registrationGap: number;
        complianceGap: number;
        assessmentGap: number;
        rateGap: number;
        combinedGaps: number;
      };
      name: string;
      type: string;
    };
    saveData: {
      totalEstimatedBusinesses: number;
      registeredBusinesses: number;
      categories: Array<{
        name: string;
        registeredBusinesses: number;
        compliantBusinesses: number;
        averageFee: number;
        estimatedAverageFee: number;
        complianceRate: number;
      }>;
    };
  }) => void;
} 