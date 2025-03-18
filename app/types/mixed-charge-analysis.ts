export interface MixedUserInputs {
  estimatedDailyUsers: number;
  actualDailyUsers: number;
  averageDailyUserFee: number;
  actualDailyUserFee: number;
  availableMonthlyUsers: number;
  payingMonthlyUsers: number;
  averageMonthlyRate: number;
  actualMonthlyRate: number;
}

export interface MixedChargeMetrics {
  actual: number;
  potential: number;
  gap: number;
  gapBreakdown: {
    complianceGap: number;
    rateGap: number;
    combinedGaps: number;
    registrationGapPercentage?: number;
  };
}

export interface ChartOptions {
  scales: {
    x: any;
    y: any;
  };
}

export type MixedChargeData = MixedUserInputs;

export interface MixedChargeCompleteData {
  metrics: MixedChargeMetrics;
  data: MixedChargeData;
}
