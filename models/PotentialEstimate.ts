import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IPotentialEstimate extends Document {
  user: IUser['_id'];
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
  createdAt: Date;
  updatedAt: Date;
}

const PotentialEstimateSchema = new Schema<IPotentialEstimate>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    countryCode: {
      type: String,
      required: [true, 'Country code is required'],
      trim: true,
    },
    state: {
      type: String,
      required: false,
      default: 'Not specified',
      trim: true,
    },
    financialYear: {
      type: String,
      required: [true, 'Financial year is required'],
      trim: true,
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
    },
    currencySymbol: {
      type: String,
      required: [true, 'Currency symbol is required'],
      trim: true,
    },
    actualOSR: {
      type: Number,
      required: [true, 'Actual OSR is required'],
    },
    budgetedOSR: {
      type: Number,
      required: [true, 'Budgeted OSR is required'],
    },
    population: {
      type: Number,
      required: [true, 'Population is required'],
    },
    gdpPerCapita: {
      type: Number,
      required: [true, 'GDP per capita is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the PotentialEstimate model
export const PotentialEstimate = mongoose.models.PotentialEstimate || 
  mongoose.model<IPotentialEstimate>('PotentialEstimate', PotentialEstimateSchema);

export default PotentialEstimate; 