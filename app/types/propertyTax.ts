export interface Category {
  id: string;
  name: string;
  registeredTaxpayers: number;
  compliantTaxpayers: number;
  averageLandValue: number;
  estimatedAverageValue: number;
  taxRate: number;
  isExpanded: boolean;
}

export interface Metrics {
  categories: Category[];
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
}

export interface GapBreakdown {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  rateGap: number;
  combinedGaps: number;
}

export interface PropertyTaxMetrics {
  categories: Category[];
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number; // Percentage of potential revenue that is leveraged
  gapBreakdown: GapBreakdown;
}

export interface PropertyTaxAnalysisProps {
  onMetricsChange?: (data: {
    metrics: PropertyTaxMetrics;
    saveData: {
      totalEstimatedTaxPayers: number;
      registeredTaxPayers: number;
      categories: Array<{
        name: string;
        registeredTaxpayers: number;
        compliantTaxpayers: number;
        averageLandValue: number;
        estimatedAverageValue: number;
        taxRate: number;
      }>;
    };
  }) => void;
}
