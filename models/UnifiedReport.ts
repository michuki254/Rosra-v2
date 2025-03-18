import mongoose, { Schema, Document } from 'mongoose';

// Define the property tax metrics schema
const PropertyTaxMetricsSchema = new Schema({
  actual: { type: Number, default: 0 },
  potential: { type: Number, default: 0 },
  gap: { type: Number, default: 0 },
  potentialLeveraged: { type: Number, default: 0 },
  gapBreakdown: {
    registrationGap: { type: Number, default: 0 },
    complianceGap: { type: Number, default: 0 },
    assessmentGap: { type: Number, default: 0 },
    rateGap: { type: Number, default: 0 },
    combinedGaps: { type: Number, default: 0 }
  },
  analysisMessage: { type: String, default: '' }
});

// Define the license metrics schema
const LicenseMetricsSchema = new Schema({
  actual: { type: Number, default: 0 },
  potential: { type: Number, default: 0 },
  gap: { type: Number, default: 0 },
  potentialLeveraged: { type: Number, default: 0 },
  gapBreakdown: {
    registrationGap: { type: Number, default: 0 },
    complianceGap: { type: Number, default: 0 },
    assessmentGap: { type: Number, default: 0 },
    combinedGaps: { type: Number, default: 0 }
  },
  analysisMessage: { type: String, default: '' }
});

// Define the short term metrics schema
const ShortTermMetricsSchema = new Schema({
  totalEstimatedRevenue: { type: Number, default: 0 },
  totalActualRevenue: { type: Number, default: 0 },
  totalGap: { type: Number, default: 0 },
  currencySymbol: { type: String, default: '$' },
  gapBreakdown: {
    registrationGap: { type: Number, default: 0 },
    registrationGapPercentage: { type: Number, default: 0 },
    complianceGap: { type: Number, default: 0 },
    complianceGapPercentage: { type: Number, default: 0 },
    rateGap: { type: Number, default: 0 },
    rateGapPercentage: { type: Number, default: 0 },
    combinedGaps: { type: Number, default: 0 },
    combinedGapsPercentage: { type: Number, default: 0 }
  },
  totalEstimatedDailyFees: { type: Number, default: 0 },
  totalActualDailyFees: { type: Number, default: 0 }
});

// Define the category schema for property tax
const PropertyTaxCategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  registeredTaxpayers: { type: Number, default: 0 },
  compliantTaxpayers: { type: Number, default: 0 },
  averageLandValue: { type: Number, default: 0 },
  estimatedAverageValue: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  isExpanded: { type: Boolean, default: false }
});

// Define the category schema for license
const LicenseCategorySchema = new Schema({
  name: { type: String, required: true },
  registeredLicensees: { type: Number, default: 0 },
  compliantLicensees: { type: Number, default: 0 },
  estimatedLicensees: { type: Number, default: 0 },
  licenseFee: { type: Number, default: 0 },
  averagePaidLicenseFee: { type: Number, default: 0 }
});

// Define the category schema for short term
const ShortTermCategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  estimatedDailyFees: { type: Number, default: 0 },
  actualDailyFees: { type: Number, default: 0 },
  potentialRate: { type: Number, default: 0 },
  actualRate: { type: Number, default: 0 },
  daysInYear: { type: Number, default: 365 },
  isExpanded: { type: Boolean, default: false }
});

// Define the long term metrics schema
const LongTermMetricsSchema = new Schema({
  actual: { type: Number, default: 0 },
  potential: { type: Number, default: 0 },
  gap: { type: Number, default: 0 },
  potentialLeveraged: { type: Number, default: 0 },
  gapBreakdown: {
    registrationGapPercentage: { type: Number, default: 0 },
    complianceGap: { type: Number, default: 0 },
    rateGap: { type: Number, default: 0 },
    combinedGaps: { type: Number, default: 0 }
  }
});

// Define the mixed charge metrics schema
const MixedChargeMetricsSchema = new Schema({
  actual: { type: Number, default: 0 },
  potential: { type: Number, default: 0 },
  gap: { type: Number, default: 0 },
  gapBreakdown: {
    complianceGap: { type: Number, default: 0 },
    rateGap: { type: Number, default: 0 },
    combinedGaps: { type: Number, default: 0 }
  }
});

// Define the mixed charge data schema
const MixedChargeDataSchema = new Schema({
  estimatedDailyUsers: { type: Number, default: 0 },
  actualDailyUsers: { type: Number, default: 0 },
  averageDailyUserFee: { type: Number, default: 0 },
  actualDailyUserFee: { type: Number, default: 0 },
  availableMonthlyUsers: { type: Number, default: 0 },
  payingMonthlyUsers: { type: Number, default: 0 },
  averageMonthlyRate: { type: Number, default: 0 },
  actualMonthlyRate: { type: Number, default: 0 }
});

// Define the category schema for long term
const LongTermCategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  estimatedLeases: { type: Number, default: 0 },
  registeredLeases: { type: Number, default: 0 },
  potentialRate: { type: Number, default: 0 },
  actualRate: { type: Number, default: 0 },
  isExpanded: { type: Boolean, default: false }
});

// Define the unified report schema
const UnifiedReportSchema = new Schema({
  // User and metadata
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Report' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Basic estimate data
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  state: { type: String, default: 'Not specified' },
  financialYear: { type: String, required: true },
  currency: { type: String, required: true },
  currencySymbol: { type: String, required: true },
  actualOSR: { type: Number, required: true },
  budgetedOSR: { type: Number, required: true },
  population: { type: Number, required: true },
  gdpPerCapita: { type: Number, required: true },
  
  // Property Tax Analysis
  propertyTax: {
    metrics: PropertyTaxMetricsSchema,
    categories: [PropertyTaxCategorySchema],
    totalEstimatedTaxPayers: { type: Number, default: 0 },
    registeredTaxPayers: { type: Number, default: 0 }
  },
  
  // License Analysis
  license: {
    metrics: LicenseMetricsSchema,
    categories: [LicenseCategorySchema],
    totalEstimatedLicensees: { type: Number, default: 0 },
    registeredLicensees: { type: Number, default: 0 },
    licenseRegistrationRate: { type: Number, default: 0 },
    averageLicenseFee: { type: Number, default: 0 },
    complianceRate: { type: Number, default: 0 },
    assessmentAccuracy: { type: Number, default: 0 },
    notes: { type: String, default: '' }
  },
  
  // Short Term Analysis
  shortTerm: {
    metrics: ShortTermMetricsSchema,
    categories: [ShortTermCategorySchema],
    country: { type: String, default: 'Not specified' },
    state: { type: String, default: 'Not specified' },
    totalEstimatedDailyFees: { type: Number, default: 0 },
    totalActualDailyFees: { type: Number, default: 0 }
  },
  
  // Long Term Analysis
  longTerm: {
    metrics: LongTermMetricsSchema,
    categories: [LongTermCategorySchema],
    country: { type: String, default: 'Not specified' },
    state: { type: String, default: 'Not specified' },
    countryCode: { type: String, default: '' }
  },
  
  // Mixed Charge Analysis
  mixedCharge: {
    metrics: MixedChargeMetricsSchema,
    data: MixedChargeDataSchema
  }
});

// Create and export the model
export interface UnifiedReportDocument extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  country: string;
  countryCode: string;
  state: string;
  financialYear: string;
  currency: string;
  currencySymbol: string;
  actualOSR: number;
  budgetedOSR: number;
  population: number;
  gdpPerCapita: number;
  propertyTax: {
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
      analysisMessage: string;
    };
    categories: Array<{
      id: string;
      name: string;
      registeredTaxpayers: number;
      compliantTaxpayers: number;
      averageLandValue: number;
      estimatedAverageValue: number;
      taxRate: number;
      isExpanded: boolean;
    }>;
    totalEstimatedTaxPayers: number;
    registeredTaxPayers: number;
  };
  license: {
    metrics: {
      actual: number;
      potential: number;
      gap: number;
      potentialLeveraged: number;
      gapBreakdown: {
        registrationGap: number;
        complianceGap: number;
        assessmentGap: number;
        combinedGaps: number;
      };
      analysisMessage: string;
    };
    categories: Array<{
      name: string;
      registeredLicensees: number;
      compliantLicensees: number;
      estimatedLicensees: number;
      licenseFee: number;
      averagePaidLicenseFee: number;
    }>;
    totalEstimatedLicensees: number;
    registeredLicensees: number;
    licenseRegistrationRate: number;
    averageLicenseFee: number;
    complianceRate: number;
    assessmentAccuracy: number;
    notes: string;
  };
  shortTerm: {
    metrics: {
      totalEstimatedRevenue: number;
      totalActualRevenue: number;
      totalGap: number;
      currencySymbol: string;
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
      totalEstimatedDailyFees: number;
      totalActualDailyFees: number;
    };
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      estimatedDailyFees: number;
      actualDailyFees: number;
      potentialRate: number;
      actualRate: number;
      daysInYear: number;
      isExpanded?: boolean;
    }>;
    country: string;
    state: string;
    totalEstimatedDailyFees: number;
    totalActualDailyFees: number;
  };
  longTerm?: {
    metrics: {
      actual: number;
      potential: number;
      gap: number;
      potentialLeveraged: number;
      gapBreakdown: {
        registrationGapPercentage: number;
        complianceGap: number;
        rateGap: number;
        combinedGaps: number;
      };
    };
    categories: Array<{
      id: string;
      name: string;
      estimatedLeases: number;
      registeredLeases: number;
      potentialRate: number;
      actualRate: number;
      isExpanded: boolean;
    }>;
    country: string;
    state: string;
    countryCode: string;
  };
  mixedCharge?: {
    metrics: {
      actual: number;
      potential: number;
      gap: number;
      gapBreakdown: {
        complianceGap: number;
        rateGap: number;
        combinedGaps: number;
      };
    };
    data: {
      estimatedDailyUsers: number;
      actualDailyUsers: number;
      averageDailyUserFee: number;
      actualDailyUserFee: number;
      availableMonthlyUsers: number;
      payingMonthlyUsers: number;
      averageMonthlyRate: number;
      actualMonthlyRate: number;
    };
  };
}

// Check if the model already exists to prevent overwriting
export default mongoose.models.UnifiedReport || mongoose.model<UnifiedReportDocument>('UnifiedReport', UnifiedReportSchema); 