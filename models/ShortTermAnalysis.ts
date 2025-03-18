import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a category
interface Category {
  id: string;
  name: string;
  description?: string;
  estimatedDailyFees: number;
  actualDailyFees: number;
  potentialRate: number;
  actualRate: number;
  daysInYear: number;
  isExpanded: boolean;
}

// Define the interface for metrics
interface Metrics {
  totalEstimatedRevenue?: number;
  totalActualRevenue?: number;
  totalGap?: number;
  potentialLeveraged?: number;
  currencySymbol?: string;
  gapBreakdown?: {
    registrationGap?: number;
    registrationGapPercentage?: number;
    complianceGap?: number;
    complianceGapPercentage?: number;
    rateGap?: number;
    rateGapPercentage?: number;
    combinedGaps?: number;
    combinedGapsPercentage?: number;
  };
}

// Define the interface for ShortTermAnalysis document
export interface ShortTermAnalysisDocument extends Document {
  userId: string;
  reportId?: string;
  country: string;
  state: string;
  categories: Category[];
  metrics: Metrics;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for a category
const CategorySchema = new Schema({
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

// Define the schema for metrics
const MetricsSchema = new Schema({
  totalEstimatedRevenue: { type: Number, default: 0 },
  totalActualRevenue: { type: Number, default: 0 },
  totalGap: { type: Number, default: 0 },
  potentialLeveraged: { type: Number, default: 0 },
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
  }
}, { _id: false });

// Define the schema for ShortTermAnalysis
const ShortTermAnalysisSchema = new Schema({
  userId: { type: String, required: true },
  reportId: { type: String, index: true },
  country: { type: String, default: 'Not specified' },
  state: { type: String, default: 'Not specified' },
  categories: [CategorySchema],
  metrics: { type: MetricsSchema, default: {} }
}, { timestamps: true });

// Create compound index for userId and reportId
ShortTermAnalysisSchema.index({ userId: 1, reportId: 1 });

// Check if the model already exists to prevent overwriting
const ShortTermAnalysis = mongoose.models.ShortTermAnalysis || 
  mongoose.model<ShortTermAnalysisDocument>('ShortTermAnalysis', ShortTermAnalysisSchema);

export default ShortTermAnalysis; 