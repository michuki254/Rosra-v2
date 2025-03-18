export interface LongTermCategory {
  id: string;
  name: string;
  isExpanded: boolean;
  estimatedLeases: number;
  registeredLeases: number;
  potentialRate: number;
  actualRate: number;
  errors?: {
    estimatedLeases?: string;
    registeredLeases?: string;
    potentialRate?: string;
    actualRate?: string;
    name?: string;
  };
}

export interface LongTermMetrics {
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: {
    registrationGap: number;
    registrationGapPercentage: number;
    complianceGap: number;
    complianceGapPercentage: number;
    rateGap: number;
    rateGapPercentage: number;
    combinedGaps: number;
    combinedGapsPercentage: number;
  };
}

export interface LongTermContextType {
  categories: LongTermCategory[];
  metrics: LongTermMetrics;
  addCategory: () => void;
  updateCategory: (id: string, field: keyof LongTermCategory, value: number | string) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
}
