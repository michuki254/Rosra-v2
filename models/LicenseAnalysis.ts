import mongoose, { Schema, Document } from 'mongoose';

// Interface for License Category
export interface ILicenseCategory {
  name: string;
  registeredLicensees: number;
  compliantLicensees: number;
  estimatedLicensees: number;
  licenseFee: number;
  averagePaidLicenseFee: number;
  complianceRate?: number;
}

// Interface for LicenseAnalysis
export interface ILicenseAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  reportId?: mongoose.Types.ObjectId;
  country: string;
  state: string;
  totalEstimatedLicensees: number; // Total estimated No of Licensees
  categories: ILicenseCategory[];
  metrics?: { // Analysis metrics
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
    analysisMessage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema for License Category
const LicenseCategorySchema = new Schema<ILicenseCategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  registeredLicensees: {
    type: Number,
    required: [true, 'Number of registered licensees is required'],
    min: 0,
    default: 0
  },
  compliantLicensees: {
    type: Number,
    required: [true, 'Number of compliant licensees is required'],
    min: 0,
    default: 0
  },
  estimatedLicensees: {
    type: Number,
    required: [true, 'Number of estimated licensees is required'],
    min: 0,
    default: 0
  },
  licenseFee: {
    type: Number,
    required: [true, 'License fee is required'],
    min: 0,
    default: 0
  },
  averagePaidLicenseFee: {
    type: Number,
    required: [true, 'Average paid license fee is required'],
    min: 0,
    default: 0
  },
  complianceRate: {
    type: Number,
    required: false,
    min: 0,
    max: 1,
    default: 0
  }
});

// Schema for LicenseAnalysis
const LicenseAnalysisSchema = new Schema<ILicenseAnalysis>(
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
    totalEstimatedLicensees: {
      type: Number,
      required: [true, 'Total estimated licensees is required'],
      min: 0,
      default: 0
    },
    categories: {
      type: [LicenseCategorySchema],
      default: []
    },
    metrics: {
      type: {
        actual: Number,
        potential: Number,
        gap: Number,
        potentialLeveraged: Number,
        gapBreakdown: {
          registrationGap: Number,
          complianceGap: Number,
          assessmentGap: Number,
          rateGap: Number,
          combinedGaps: Number
        },
        analysisMessage: String
      },
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Create or retrieve the LicenseAnalysis model
export const LicenseAnalysis = mongoose.models.LicenseAnalysis || 
  mongoose.model<ILicenseAnalysis>('LicenseAnalysis', LicenseAnalysisSchema);

export default LicenseAnalysis; 