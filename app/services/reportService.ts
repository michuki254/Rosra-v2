import { connectToDatabase } from '@/lib/mongoose';
import Report, { IReport } from '@/models/Report';
import mongoose from 'mongoose';

// Interface for creating a new Report
export interface CreateReportInput {
  userId: string;
  title: string;
  description?: string;
  country: string;
  state: string;
  year: number;
  status?: 'draft' | 'published';
}

// Interface for updating an existing Report
export interface UpdateReportInput {
  title?: string;
  description?: string;
  country?: string;
  state?: string;
  year?: number;
  status?: 'draft' | 'published';
}

/**
 * Create a new Report
 */
export async function createReport(
  data: CreateReportInput
): Promise<IReport> {
  try {
    await connectToDatabase();
    
    const report = new Report({
      userId: new mongoose.Types.ObjectId(data.userId),
      title: data.title,
      description: data.description,
      country: data.country,
      state: data.state,
      year: data.year,
      status: data.status || 'draft'
    });
    
    await report.save();
    return report;
  } catch (error) {
    console.error('Error creating Report:', error);
    throw error;
  }
}

/**
 * Get Report by ID
 */
export async function getReportById(
  reportId: string
): Promise<IReport | null> {
  try {
    await connectToDatabase();
    
    const report = await Report.findById(reportId);
    
    return report;
  } catch (error) {
    console.error('Error fetching Report:', error);
    throw error;
  }
}

/**
 * Get Reports by user ID
 */
export async function getReportsByUserId(
  userId: string
): Promise<IReport[]> {
  try {
    await connectToDatabase();
    
    const reports = await Report.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ updatedAt: -1 });
    
    return reports;
  } catch (error) {
    console.error('Error fetching Reports by user ID:', error);
    throw error;
  }
}

/**
 * Update an existing Report
 */
export async function updateReport(
  reportId: string,
  data: UpdateReportInput
): Promise<IReport | null> {
  try {
    await connectToDatabase();
    
    const report = await Report.findByIdAndUpdate(
      reportId,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return report;
  } catch (error) {
    console.error('Error updating Report:', error);
    throw error;
  }
}

/**
 * Delete a Report
 */
export async function deleteReport(
  reportId: string
): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const result = await Report.deleteOne({
      _id: new mongoose.Types.ObjectId(reportId)
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting Report:', error);
    throw error;
  }
}

/**
 * Publish a Report
 */
export async function publishReport(
  reportId: string
): Promise<IReport | null> {
  try {
    await connectToDatabase();
    
    const report = await Report.findByIdAndUpdate(
      reportId,
      { $set: { status: 'published' } },
      { new: true, runValidators: true }
    );
    
    return report;
  } catch (error) {
    console.error('Error publishing Report:', error);
    throw error;
  }
} 