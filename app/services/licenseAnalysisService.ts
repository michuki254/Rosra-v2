import { connectToDatabase } from '@/lib/mongoose';
import LicenseAnalysis, { ILicenseAnalysis, ILicenseCategory } from '@/models/LicenseAnalysis';
import mongoose from 'mongoose';

// Interface for creating a new LicenseAnalysis
export interface CreateLicenseAnalysisInput {
  userId: string;
  reportId: string;
  totalEstimatedLicensees: number;
  categories: ILicenseCategory[];
  metrics?: {
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
  };
}

// Interface for updating an existing LicenseAnalysis
export interface UpdateLicenseAnalysisInput {
  totalEstimatedLicensees?: number;
  categories?: ILicenseCategory[];
  metrics?: {
    actual?: number;
    potential?: number;
    gap?: number;
    potentialLeveraged?: number;
    gapBreakdown?: {
      registrationGap?: number;
      complianceGap?: number;
      assessmentGap?: number;
      rateGap?: number;
      combinedGaps?: number;
    };
  };
}

/**
 * Create a new LicenseAnalysis record
 */
export async function createLicenseAnalysis(
  data: CreateLicenseAnalysisInput
): Promise<ILicenseAnalysis> {
  try {
    await connectToDatabase();
    
    const licenseAnalysis = new LicenseAnalysis({
      userId: new mongoose.Types.ObjectId(data.userId),
      reportId: new mongoose.Types.ObjectId(data.reportId),
      totalEstimatedLicensees: data.totalEstimatedLicensees,
      categories: data.categories,
      metrics: data.metrics
    });
    
    await licenseAnalysis.save();
    return licenseAnalysis;
  } catch (error) {
    console.error('Error creating LicenseAnalysis:', error);
    throw error;
  }
}

/**
 * Get LicenseAnalysis by report ID
 */
export async function getLicenseAnalysisByReportId(
  reportId: string
): Promise<ILicenseAnalysis | null> {
  try {
    await connectToDatabase();
    
    const licenseAnalysis = await LicenseAnalysis.findOne({
      reportId: new mongoose.Types.ObjectId(reportId)
    });
    
    return licenseAnalysis;
  } catch (error) {
    console.error('Error fetching LicenseAnalysis:', error);
    throw error;
  }
}

/**
 * Update an existing LicenseAnalysis record
 */
export async function updateLicenseAnalysis(
  reportId: string,
  data: UpdateLicenseAnalysisInput
): Promise<ILicenseAnalysis | null> {
  try {
    await connectToDatabase();
    
    const licenseAnalysis = await LicenseAnalysis.findOneAndUpdate(
      { reportId: new mongoose.Types.ObjectId(reportId) },
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return licenseAnalysis;
  } catch (error) {
    console.error('Error updating LicenseAnalysis:', error);
    throw error;
  }
}

/**
 * Delete a LicenseAnalysis record
 */
export async function deleteLicenseAnalysis(
  reportId: string
): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const result = await LicenseAnalysis.deleteOne({
      reportId: new mongoose.Types.ObjectId(reportId)
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting LicenseAnalysis:', error);
    throw error;
  }
}

/**
 * Add a new category to an existing LicenseAnalysis
 */
export async function addCategory(
  reportId: string,
  category: ILicenseCategory
): Promise<ILicenseAnalysis | null> {
  try {
    await connectToDatabase();
    
    const licenseAnalysis = await LicenseAnalysis.findOneAndUpdate(
      { reportId: new mongoose.Types.ObjectId(reportId) },
      { $push: { categories: category } },
      { new: true, runValidators: true }
    );
    
    return licenseAnalysis;
  } catch (error) {
    console.error('Error adding category to LicenseAnalysis:', error);
    throw error;
  }
}

/**
 * Update a specific category in a LicenseAnalysis
 */
export async function updateCategory(
  reportId: string,
  categoryIndex: number,
  categoryData: Partial<ILicenseCategory>
): Promise<ILicenseAnalysis | null> {
  try {
    await connectToDatabase();
    
    // Create update object with proper dot notation for array updates
    const updateObj: Record<string, any> = {};
    
    // For each property in categoryData, create the proper update path
    Object.entries(categoryData).forEach(([key, value]) => {
      updateObj[`categories.${categoryIndex}.${key}`] = value;
    });
    
    const licenseAnalysis = await LicenseAnalysis.findOneAndUpdate(
      { reportId: new mongoose.Types.ObjectId(reportId) },
      { $set: updateObj },
      { new: true, runValidators: true }
    );
    
    return licenseAnalysis;
  } catch (error) {
    console.error('Error updating category in LicenseAnalysis:', error);
    throw error;
  }
}

/**
 * Remove a category from a LicenseAnalysis
 */
export async function removeCategory(
  reportId: string,
  categoryIndex: number
): Promise<ILicenseAnalysis | null> {
  try {
    await connectToDatabase();
    
    // First get the document to ensure we have the correct category
    const licenseAnalysis = await LicenseAnalysis.findOne({
      reportId: new mongoose.Types.ObjectId(reportId)
    });
    
    if (!licenseAnalysis) {
      return null;
    }
    
    // Remove the category at the specified index
    licenseAnalysis.categories.splice(categoryIndex, 1);
    
    // Save the updated document
    await licenseAnalysis.save();
    
    return licenseAnalysis;
  } catch (error) {
    console.error('Error removing category from LicenseAnalysis:', error);
    throw error;
  }
} 