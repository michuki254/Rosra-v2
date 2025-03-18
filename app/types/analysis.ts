export type RevenueType = 
  | 'propertyTax'
  | 'license'
  | 'shortTermUserCharge'
  | 'longTermUserCharge'
  | 'mixedUserCharge'
  | 'totalEstimate';

export interface TabConfig {
  id: RevenueType;
  label: string;
  component: React.ComponentType<any>;
}

export interface AnalysisInputs {
  financialYear: string;
  country: string;
  state: string;
  actualOSR: string;
  budgetedOSR: string;
  gdp: string;
  population: string;
}

export interface GapAnalysisProps {
  className?: string;
}
