import mongoose, { Schema, Document } from 'mongoose';

// Interface for Category
export interface ICategory {
  id: string;
  name: string;
  registeredTaxpayers: number;
  compliantTaxpayers: number;
  averageLandValue: number;
  estimatedAverageValue: number;
  taxRate: number;
  isExpanded: boolean;
}

// Interface for GapBreakdown
export interface IGapBreakdown {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  rateGap: number;
  combinedGaps: number;
}

// Interface for Metrics
export interface IMetrics {
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: IGapBreakdown;
}

// Interface for PropertyTaxAnalysis
export interface IPropertyTaxAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  reportId?: mongoose.Types.ObjectId;
  country: string;
  state: string;
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
  categories: ICategory[];
  metrics: IMetrics;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for GapBreakdown
const GapBreakdownSchema = new Schema<IGapBreakdown>({
  registrationGap: {
    type: Number,
    default: 0
  },
  complianceGap: {
    type: Number,
    default: 0
  },
  assessmentGap: {
    type: Number,
    default: 0
  },
  rateGap: {
    type: Number,
    default: 0
  },
  combinedGaps: {
    type: Number,
    default: 0
  }
});

// Schema for Metrics
const MetricsSchema = new Schema<IMetrics>({
  actual: {
    type: Number,
    default: 0
  },
  potential: {
    type: Number,
    default: 0
  },
  gap: {
    type: Number,
    default: 0
  },
  potentialLeveraged: {
    type: Number,
    default: 0
  },
  gapBreakdown: {
    type: GapBreakdownSchema,
    default: () => ({
      registrationGap: 0,
      complianceGap: 0,
      assessmentGap: 0,
      rateGap: 0,
      combinedGaps: 0
    })
  }
});

// Schema for Category
const CategorySchema = new Schema<ICategory>({
  id: {
    type: String,
    required: [true, 'Category ID is required']
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  registeredTaxpayers: {
    type: Number,
    required: [true, 'Number of registered taxpayers is required'],
    min: 0,
    default: 0
  },
  compliantTaxpayers: {
    type: Number,
    required: [true, 'Number of compliant taxpayers is required'],
    min: 0,
    default: 0
  },
  averageLandValue: {
    type: Number,
    required: [true, 'Average land value is required'],
    min: 0,
    default: 0
  },
  estimatedAverageValue: {
    type: Number,
    required: [true, 'Estimated average value is required'],
    min: 0,
    default: 0
  },
  taxRate: {
    type: Number,
    required: [true, 'Tax rate is required'],
    min: 0,
    default: 0
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
});

// Schema for PropertyTaxAnalysis
const PropertyTaxAnalysisSchema = new Schema<IPropertyTaxAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: false
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'Not specified'
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      default: 'Not specified'
    },
    totalEstimatedTaxPayers: {
      type: Number,
      required: [true, 'Total estimated taxpayers is required'],
      min: 0,
      default: 0
    },
    registeredTaxPayers: {
      type: Number,
      required: [true, 'Registered taxpayers is required'],
      min: 0,
      default: 0
    },
    categories: {
      type: [CategorySchema],
      default: []
    },
    metrics: {
      type: MetricsSchema,
      default: () => ({
        actual: 0,
        potential: 0,
        gap: 0,
        potentialLeveraged: 0,
        gapBreakdown: {
          registrationGap: 0,
          complianceGap: 0,
          assessmentGap: 0,
          rateGap: 0,
          combinedGaps: 0
        }
      })
    }
  },
  {
    timestamps: true
  }
);

// Create or retrieve the PropertyTaxAnalysis model
export const PropertyTaxAnalysis = mongoose.models.PropertyTaxAnalysis || 
  mongoose.model<IPropertyTaxAnalysis>('PropertyTaxAnalysis', PropertyTaxAnalysisSchema);

export default PropertyTaxAnalysis; 