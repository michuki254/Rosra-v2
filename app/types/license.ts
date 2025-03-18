export interface LicenseCategory {
  id: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  estimatedLicensees: number;
  registeredLicensees: number;
  compliantLicensees: number;
  licenseFee: number;
  averagePaidLicenseFee: number;
  isExpanded: boolean;
}

export interface GapBreakdown {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
}

export interface LicenseMetrics {
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: GapBreakdown;
  analysisMessage?: string;
}

export interface LicenseAnalysisProps {
  onMetricsChange?: (metrics: LicenseMetrics) => void;
}

export interface LicenseContextState {
  categories: LicenseCategory[];
  metrics: LicenseMetrics;
  totalEstimatedLicensees: number;
  setTotalEstimatedLicensees: (value: number) => void;
  addCategory: () => void;
  updateCategory: (index: number, field: keyof LicenseCategory, value: number | string) => void;
  deleteCategory: (index: number) => void;
  toggleCategory: (id: string) => void;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }>;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: 'bottom';
      labels: {
        usePointStyle: boolean;
        padding: number;
        font: {
          size: number;
        };
      };
    };
    title: {
      display: boolean;
      color: string;
      font: {
        size: number;
      };
      padding: {
        bottom: number;
      };
    };
    tooltip: {
      callbacks: {
        label: (context: any) => string;
      };
    };
  };
  scales: {
    x: {
      display?: boolean;
      grid: {
        display: boolean;
      };
      stacked: boolean;
    };
    y: {
      grid: {
        color: string;
      };
      ticks: {
        callback: (value: any) => string;
        font: {
          size: number;
        };
      };
      stacked: boolean;
      beginAtZero: boolean;
    };
  };
}
