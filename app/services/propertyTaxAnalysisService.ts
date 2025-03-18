import { connectToDatabase } from '@/lib/mongoose';
import PropertyTaxAnalysis, { IPropertyTaxAnalysis, ICategory } from '@/models/PropertyTaxAnalysis';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

// Interface for creating a new PropertyTaxAnalysis
export interface CreatePropertyTaxAnalysisInput {
  userId: string;
  reportId: string;
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
  categories: ICategory[];
}

// Interface for updating an existing PropertyTaxAnalysis
export interface UpdatePropertyTaxAnalysisInput {
  totalEstimatedTaxPayers?: number;
  registeredTaxPayers?: number;
  categories?: ICategory[];
}

// Ensure each category has an id field and correct field names
function ensureCategoryIds(categories: ICategory[] = []): ICategory[] {
  return categories.map(category => {
    // Create a new object without _id field to avoid conflicts
    const { _id, ...categoryWithoutId } = category as any;
    
    // Use existing id, or convert _id to string if it exists, or generate a new UUID
    const id = category.id || (_id ? _id.toString() : randomUUID());
    
    // Handle field name conversion
    const result: any = {
      ...categoryWithoutId,
      id
    };
    
    // Convert field names if needed - using type assertions to handle field name differences
    if ((category as any).actualLandValue !== undefined && (category as any).averageLandValue === undefined) {
      result.averageLandValue = (category as any).actualLandValue;
      delete result.actualLandValue; // Remove the old field name
    }
    
    if ((category as any).estimatedLandValue !== undefined && (category as any).estimatedAverageValue === undefined) {
      result.estimatedAverageValue = (category as any).estimatedLandValue;
      delete result.estimatedLandValue; // Remove the old field name
    }
    
    return result as ICategory;
  });
}

/**
 * Create a new PropertyTaxAnalysis record
 */
export async function createPropertyTaxAnalysis(
  data: CreatePropertyTaxAnalysisInput
): Promise<IPropertyTaxAnalysis> {
  try {
    await connectToDatabase();
    
    const propertyTaxAnalysis = new PropertyTaxAnalysis({
      userId: new mongoose.Types.ObjectId(data.userId),
      reportId: new mongoose.Types.ObjectId(data.reportId),
      totalEstimatedTaxPayers: data.totalEstimatedTaxPayers,
      registeredTaxPayers: data.registeredTaxPayers,
      categories: ensureCategoryIds(data.categories)
    });
    
    await propertyTaxAnalysis.save();
    return propertyTaxAnalysis;
  } catch (error) {
    console.error('Error creating PropertyTaxAnalysis:', error);
    throw error;
  }
}

/**
 * Get PropertyTaxAnalysis by report ID
 */
export async function getPropertyTaxAnalysisByReportId(
  reportId: string
): Promise<IPropertyTaxAnalysis | null> {
  try {
    await connectToDatabase();
    
    const propertyTaxAnalysis = await PropertyTaxAnalysis.findOne({
      reportId: new mongoose.Types.ObjectId(reportId)
    });
    
    return propertyTaxAnalysis;
  } catch (error) {
    console.error('Error fetching PropertyTaxAnalysis:', error);
    throw error;
  }
}

/**
 * Update an existing PropertyTaxAnalysis record
 */
export async function updatePropertyTaxAnalysis(
  reportId: string,
  data: UpdatePropertyTaxAnalysisInput
): Promise<IPropertyTaxAnalysis | null> {
  try {
    await connectToDatabase();
    
    // Ensure categories have IDs if they exist
    if (data.categories) {
      data.categories = ensureCategoryIds(data.categories);
    }
    
    const propertyTaxAnalysis = await PropertyTaxAnalysis.findOneAndUpdate(
      { reportId: new mongoose.Types.ObjectId(reportId) },
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return propertyTaxAnalysis;
  } catch (error) {
    console.error('Error updating PropertyTaxAnalysis:', error);
    throw error;
  }
}

/**
 * Delete a PropertyTaxAnalysis record
 */
export async function deletePropertyTaxAnalysis(
  reportId: string
): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const result = await PropertyTaxAnalysis.deleteOne({
      reportId: new mongoose.Types.ObjectId(reportId)
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting PropertyTaxAnalysis:', error);
    throw error;
  }
}

/**
 * Add a new category to an existing PropertyTaxAnalysis
 */
export async function addCategory(
  reportId: string,
  category: ICategory
): Promise<IPropertyTaxAnalysis | null> {
  try {
    await connectToDatabase();
    
    // Ensure the category has an id
    const processedCategory = ensureCategoryIds([category])[0];
    
    const propertyTaxAnalysis = await PropertyTaxAnalysis.findOneAndUpdate(
      { reportId: new mongoose.Types.ObjectId(reportId) },
      { $push: { categories: processedCategory } },
      { new: true, runValidators: true }
    );
    
    return propertyTaxAnalysis;
  } catch (error) {
    console.error('Error adding category to PropertyTaxAnalysis:', error);
    throw error;
  }
}

/**
 * Update a specific category in a PropertyTaxAnalysis
 */
export async function updateCategory(
  reportId: string,
  categoryIndex: number,
  categoryData: Partial<ICategory>
): Promise<IPropertyTaxAnalysis | null> {
  try {
    await connectToDatabase();
    
    // Ensure the category data has an id if it's being updated
    if (categoryData.id === undefined) {
      // Fetch the current category to get its id
      const analysis = await PropertyTaxAnalysis.findOne({
        reportId: new mongoose.Types.ObjectId(reportId)
      });
      
      if (analysis && analysis.categories && analysis.categories[categoryIndex]) {
        categoryData.id = analysis.categories[categoryIndex].id;
      } else {
        // Generate a new id if we can't find the existing one
        categoryData.id = randomUUID();
      }
    }
    
    // Create the update query
    const updateQuery: any = {};
    
    // Update each field in the category
    for (const [key, value] of Object.entries(categoryData)) {
      updateQuery[`categories.${categoryIndex}.${key}`] = value;
    }
    
    const propertyTaxAnalysis = await PropertyTaxAnalysis.findOneAndUpdate(
      { reportId: new mongoose.Types.ObjectId(reportId) },
      { $set: updateQuery },
      { new: true, runValidators: true }
    );
    
    return propertyTaxAnalysis;
  } catch (error) {
    console.error('Error updating category in PropertyTaxAnalysis:', error);
    throw error;
  }
}

/**
 * Remove a category from a PropertyTaxAnalysis
 */
export async function removeCategory(
  reportId: string,
  categoryIndex: number
): Promise<IPropertyTaxAnalysis | null> {
  try {
    await connectToDatabase();
    
    // First get the document to ensure we have the correct category
    const propertyTaxAnalysis = await PropertyTaxAnalysis.findOne({
      reportId: new mongoose.Types.ObjectId(reportId)
    });
    
    if (!propertyTaxAnalysis) {
      return null;
    }
    
    // Remove the category at the specified index
    propertyTaxAnalysis.categories.splice(categoryIndex, 1);
    
    // Save the updated document
    await propertyTaxAnalysis.save();
    
    return propertyTaxAnalysis;
  } catch (error) {
    console.error('Error removing category from PropertyTaxAnalysis:', error);
    throw error;
  }
} 