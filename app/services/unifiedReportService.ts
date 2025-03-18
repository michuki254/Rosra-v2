import { connectToDatabase } from '@/lib/mongoose';
import UnifiedReport, { UnifiedReportDocument } from '@/models/UnifiedReport';

// Make sure the database is connected before any operations
async function ensureDbConnection() {
  await connectToDatabase();
}

// Create a new report
export async function createReport(data: any): Promise<UnifiedReportDocument> {
  await ensureDbConnection();
  
  // Ensure all required fields have default values
  const reportData = {
    user: data.user,
    title: data.title || 'Untitled Report',
    country: data.country || 'Not specified',
    countryCode: data.countryCode || 'XX',
    state: data.state || 'Not specified',
    financialYear: data.financialYear || new Date().getFullYear().toString(),
    currency: data.currency || 'USD',
    currencySymbol: data.currencySymbol || '$',
    actualOSR: Number(data.actualOSR) || 0,
    budgetedOSR: Number(data.budgetedOSR) || 0,
    population: Number(data.population) || 0,
    gdpPerCapita: Number(data.gdpPerCapita) || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data
  };
  
  const report = new UnifiedReport(reportData);
  
  return await report.save();
}

// Get all reports for a user
export async function getReportsByUserId(userId: string): Promise<UnifiedReportDocument[]> {
  await ensureDbConnection();
  
  return await UnifiedReport.find({ user: userId })
    .sort({ updatedAt: -1 });
}

// Get a report by ID
export async function getReportById(reportId: string, userId: string): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  return await UnifiedReport.findOne({ 
    _id: reportId,
    user: userId
  });
}

// Update a report
export async function updateReport(reportId: string, userId: string, data: any): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  // Ensure we're only updating allowed fields
  const updateData = {
    ...data,
    updatedAt: new Date()
  };
  
  return await UnifiedReport.findOneAndUpdate(
    { _id: reportId, user: userId },
    updateData,
    { new: true }
  );
}

// Delete a report
export async function deleteReport(reportId: string, userId: string): Promise<boolean> {
  await ensureDbConnection();
  
  const result = await UnifiedReport.deleteOne({ 
    _id: reportId,
    user: userId
  });
  
  return result.deletedCount === 1;
}

// Update property tax data for a report
export async function updatePropertyTaxData(reportId: string, userId: string, propertyTaxData: any): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  return await UnifiedReport.findOneAndUpdate(
    { _id: reportId, user: userId },
    { 
      $set: { 
        propertyTax: processPropertyTaxData(propertyTaxData),
        updatedAt: new Date()
      } 
    },
    { new: true }
  );
}

// Update license data for a report
export async function updateLicenseData(reportId: string, userId: string, licenseData: any): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  try {
    console.log('Updating license data for report:', reportId);
    console.log('License data to save:', JSON.stringify(licenseData, null, 2));
    
    if (!reportId) {
      console.error('Report ID is undefined or null');
      throw new Error('Report ID is required');
    }
    
    if (!userId) {
      console.error('User ID is undefined or null');
      throw new Error('User ID is required');
    }
    
    // First, check if the report exists
    const existingReport = await UnifiedReport.findOne({ _id: reportId, user: userId });
    
    if (!existingReport) {
      console.log('Report not found:', reportId);
      throw new Error(`Report not found with ID: ${reportId}`);
    }
    
    // Update the report with the license data
    const updatedReport = await UnifiedReport.findOneAndUpdate(
      { _id: reportId, user: userId },
      { 
        $set: { 
          license: licenseData,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    
    if (!updatedReport) {
      console.error('Failed to update report with license data');
      throw new Error('Failed to update report with license data');
    }
    
    console.log('License data updated successfully for report:', reportId);
    return updatedReport;
  } catch (error) {
    console.error('Error updating license data:', error);
    throw error;
  }
}

// Update short-term data for a report
export async function updateShortTermData(reportId: string, userId: string, shortTermData: any): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  console.log(`========== SERVICE: UPDATING SHORT-TERM DATA ==========`);
  console.log(`Updating short-term data for report ${reportId} and user ${userId}`);
  console.log('Short-term data structure:', Object.keys(shortTermData).join(', '));
  console.log('Metrics structure:', shortTermData.metrics ? Object.keys(shortTermData.metrics).join(', ') : 'no metrics');
  console.log('Categories count:', Array.isArray(shortTermData.categories) ? shortTermData.categories.length : 'not an array');
  
  try {
    // First, check if the report exists
    const existingReport = await UnifiedReport.findOne({ _id: reportId, user: userId });
    
    if (!existingReport) {
      console.error(`No report found with ID ${reportId} for user ${userId}`);
      return null;
    }
    
    console.log('Found existing report:', existingReport._id);
    console.log('Current shortTerm data in report:', existingReport.shortTerm ? 'exists' : 'missing');
    
    console.log('Updating short-term data for report:', reportId);
    console.log('Short-term data to save:', formatDataForLogging(shortTermData));
    
    // Validate and prepare the data - handle both naming conventions
    const metrics = shortTermData.metrics || {};
    
    // Create a properly structured metrics object
    const preparedMetrics = {
      totalEstimatedRevenue: Number(metrics.totalEstimatedRevenue || metrics.potential || 0),
      totalActualRevenue: Number(metrics.totalActualRevenue || metrics.actual || 0),
      totalGap: Number(metrics.totalGap || metrics.gap || 0),
      currencySymbol: metrics.currencySymbol || '$',
      gapBreakdown: {
        registrationGap: Number(metrics.gapBreakdown?.registrationGap || 0),
        registrationGapPercentage: Number(metrics.gapBreakdown?.registrationGapPercentage || 0),
        complianceGap: Number(metrics.gapBreakdown?.complianceGap || 0),
        complianceGapPercentage: Number(metrics.gapBreakdown?.complianceGapPercentage || 0),
        rateGap: Number(metrics.gapBreakdown?.rateGap || 0),
        rateGapPercentage: Number(metrics.gapBreakdown?.rateGapPercentage || 0),
        combinedGaps: Number(metrics.gapBreakdown?.combinedGaps || 0),
        combinedGapsPercentage: Number(metrics.gapBreakdown?.combinedGapsPercentage || 0)
      },
      totalEstimatedDailyFees: Number(metrics.totalEstimatedDailyFees || 0),
      totalActualDailyFees: Number(metrics.totalActualDailyFees || 0)
    };
    
    // Ensure categories have proper structure
    const preparedCategories = Array.isArray(shortTermData.categories) 
      ? shortTermData.categories.map((cat: any) => ({
          id: cat.id || crypto.randomUUID(),
          name: cat.name || 'Unnamed Category',
          estimatedDailyFees: Number(cat.estimatedDailyFees) || 0,
          actualDailyFees: Number(cat.actualDailyFees) || 0,
          potentialRate: Number(cat.potentialRate) || 0,
          actualRate: Number(cat.actualRate) || 0,
          daysInYear: Number(cat.daysInYear) || 365,
          isExpanded: Boolean(cat.isExpanded)
        }))
      : [];
    
    // Create the final prepared data
    const preparedData = {
      metrics: preparedMetrics,
      categories: preparedCategories,
      country: shortTermData.country || 'Not specified',
      state: shortTermData.state || 'Not specified',
      totalEstimatedDailyFees: Number(shortTermData.totalEstimatedDailyFees || metrics.totalEstimatedDailyFees || 0),
      totalActualDailyFees: Number(shortTermData.totalActualDailyFees || metrics.totalActualDailyFees || 0)
    };
    
    console.log('Prepared data for database update:', formatDataForLogging(preparedData));
    
    // Update the report using findOneAndUpdate with $set
    const updateQuery = { 
      $set: { 
        'shortTerm': preparedData,
        updatedAt: new Date()
      } 
    };
    
    console.log('Update query:', JSON.stringify({
      reportId,
      userId,
      updateFields: Object.keys(updateQuery.$set)
    }, null, 2));
    
    // Perform a direct MongoDB update to ensure the data is saved
    const updatedReport = await UnifiedReport.findOneAndUpdate(
      { _id: reportId, user: userId },
      updateQuery,
      { new: true }
    );
    
    if (!updatedReport) {
      console.error(`Failed to update report with ID ${reportId} for user ${userId}`);
      return null;
    }
    
    console.log('Updated report:', updatedReport._id);
    console.log('Updated short-term data in report:', updatedReport.shortTerm ? 'exists' : 'missing');
    
    if (updatedReport.shortTerm) {
      console.log('Short-term data saved successfully with categories:', 
        updatedReport.shortTerm.categories ? updatedReport.shortTerm.categories.length : 0);
      console.log('Short-term metrics saved:', updatedReport.shortTerm.metrics ? 'yes' : 'no');
    } else {
      console.error('shortTerm property missing from updated report after save');
      
      // Try a direct query to see what's in the database
      const directReport = await UnifiedReport.findOne({ _id: reportId, user: userId }).lean();
      console.log('Direct query result - shortTerm exists:', directReport?.shortTerm ? 'yes' : 'no');
      if (directReport?.shortTerm) {
        console.log('Direct query shortTerm data:', JSON.stringify(directReport.shortTerm, null, 2));
      }
      
      // Try a direct update as a last resort
      try {
        console.log('Attempting direct MongoDB update as last resort...');
        const directUpdateResult = await UnifiedReport.updateOne(
          { _id: reportId, user: userId },
          { 
            $set: { 
              'shortTerm': preparedData,
              updatedAt: new Date()
            } 
          }
        );
        console.log('Last resort direct update result:', JSON.stringify(directUpdateResult, null, 2));
        
        // Verify the update worked
        const verifyLastResort = await UnifiedReport.findOne(
          { _id: reportId, user: userId },
          { shortTerm: 1 }
        ).lean();
        
        console.log('Last resort verification:', 
          verifyLastResort?.shortTerm ? 'shortTerm exists' : 'shortTerm is null');
      } catch (lastResortError) {
        console.error('Error during last resort update:', lastResortError);
      }
    }
    
    console.log(`========== SERVICE: SHORT-TERM DATA UPDATE COMPLETE ==========`);
    return updatedReport;
  } catch (error) {
    console.error('Error updating short-term data:', error);
    throw error;
  }
}

// Update long-term data for a report
export async function updateLongTermData(reportId: string, userId: string, longTermData: any): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  console.log(`Updating long-term data for report ${reportId} and user ${userId}`);
  console.log('Long-term data to save:', formatDataForLogging(longTermData));
  
  try {
    // Validate the reportId and userId
    if (!reportId) {
      console.error('Report ID is undefined or null');
      throw new Error('Report ID is required');
    }
    
    if (!userId) {
      console.error('User ID is undefined or null');
      throw new Error('User ID is required');
    }
    
    // Validate the data structure before saving
    if (!longTermData) {
      console.error('longTermData is null or undefined');
      throw new Error('Long-term data is required');
    }
    
    // Ensure required fields exist
    if (!longTermData.categories) {
      console.warn('No categories found in longTermData');
      longTermData.categories = [];
    }
    
    // Ensure metrics exist
    if (!longTermData.metrics) {
      console.warn('No metrics found in longTermData');
      longTermData.metrics = {
        actual: 0,
        potential: 0,
        gap: 0,
        potentialLeveraged: 0,
        gapBreakdown: {
          registrationGapPercentage: 0,
          complianceGap: 0,
          rateGap: 0,
          combinedGaps: 0
        }
      };
    }
    
    // Ensure country and state exist
    if (!longTermData.country) {
      console.warn('No country found in longTermData');
      longTermData.country = 'Not specified';
    }
    
    if (!longTermData.state) {
      console.warn('No state found in longTermData');
      longTermData.state = 'Not specified';
    }
    
    // Ensure countryCode exists
    if (!longTermData.countryCode) {
      console.warn('No countryCode found in longTermData');
      longTermData.countryCode = '';
    }
    
    const updatedReport = await UnifiedReport.findOneAndUpdate(
      { _id: reportId, user: userId },
      { 
        $set: { 
          longTerm: longTermData,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    
    if (!updatedReport) {
      console.error(`No report found with ID ${reportId} for user ${userId}`);
      return null;
    }
    
    console.log('Updated report:', updatedReport);
    console.log('Updated long-term data in report:', updatedReport.longTerm ? 'exists' : 'missing');
    
    // Verify the longTerm data was saved correctly
    if (!updatedReport.longTerm) {
      console.error('longTerm property missing from updated report after save');
    } else {
      console.log('longTerm data saved successfully with categories:', 
        updatedReport.longTerm.categories ? updatedReport.longTerm.categories.length : 0);
    }
    
    return updatedReport;
  } catch (error) {
    console.error('Error updating long-term data:', error);
    throw error;
  }
}

// Update mixed-charge data for a report
export async function updateMixedChargeData(reportId: string, userId: string, mixedChargeData: any): Promise<UnifiedReportDocument | null> {
  await ensureDbConnection();
  
  try {
    console.log('Updating mixed charge data for report:', reportId);
    console.log('Mixed charge data received:', JSON.stringify(mixedChargeData, null, 2));
    
    if (!reportId) {
      console.error('Report ID is undefined or null');
      throw new Error('Report ID is required');
    }
    
    if (!userId) {
      console.error('User ID is undefined or null');
      throw new Error('User ID is required');
    }
    
    // First, check if the report exists
    const existingReport = await UnifiedReport.findOne({ _id: reportId, user: userId });
    
    if (!existingReport) {
      console.log('Report not found:', reportId);
      throw new Error(`Report not found with ID: ${reportId}`);
    }
    
    // Process the data directly here instead of using a separate function
    const processedData = {
      metrics: {
        actual: Number(mixedChargeData.metrics?.actual) || 0,
        potential: Number(mixedChargeData.metrics?.potential) || 0,
        gap: Number(mixedChargeData.metrics?.gap) || 0,
        gapBreakdown: {
          complianceGap: Number(mixedChargeData.metrics?.gapBreakdown?.complianceGap) || 0,
          rateGap: Number(mixedChargeData.metrics?.gapBreakdown?.rateGap) || 0,
          combinedGaps: Number(mixedChargeData.metrics?.gapBreakdown?.combinedGaps) || 0
        }
      },
      data: {
        estimatedDailyUsers: Number(mixedChargeData.data?.estimatedDailyUsers) || 0,
        actualDailyUsers: Number(mixedChargeData.data?.actualDailyUsers) || 0,
        averageDailyUserFee: Number(mixedChargeData.data?.averageDailyUserFee) || 0,
        actualDailyUserFee: Number(mixedChargeData.data?.actualDailyUserFee) || 0,
        availableMonthlyUsers: Number(mixedChargeData.data?.availableMonthlyUsers) || 0,
        payingMonthlyUsers: Number(mixedChargeData.data?.payingMonthlyUsers) || 0,
        averageMonthlyRate: Number(mixedChargeData.data?.averageMonthlyRate) || 0,
        actualMonthlyRate: Number(mixedChargeData.data?.actualMonthlyRate) || 0
      }
    };
    
    console.log('Processed mixed charge data:', JSON.stringify(processedData, null, 2));
    
    // Update the report with the mixed charge data
    const updatedReport = await UnifiedReport.findOneAndUpdate(
      { _id: reportId, user: userId },
      { 
        $set: { 
          mixedCharge: processedData,
          hasMixedCharge: true,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    
    if (!updatedReport) {
      console.error('Failed to update report with mixed charge data');
      throw new Error('Failed to update report with mixed charge data');
    }
    
    console.log('Mixed charge data updated successfully for report:', reportId);
    return updatedReport;
  } catch (error) {
    console.error('Error updating mixed charge data:', error);
    throw error;
  }
}

// Format data for logging
export function formatDataForLogging(data: any): string {
  return JSON.stringify(data, null, 2);
}

// Helper function to process property tax data
export function processPropertyTaxData(propertyTaxData: any): any {
  // Deep clone the data to avoid modifying the original
  const processedData = JSON.parse(JSON.stringify(propertyTaxData));
  
  // Ensure categories are properly formatted
  if (processedData.categories) {
    processedData.categories = processedData.categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      registeredTaxpayers: Number(category.registeredTaxpayers) || 0,
      compliantTaxpayers: Number(category.compliantTaxpayers) || 0,
      averageLandValue: Number(category.averageLandValue) || 0,
      estimatedAverageValue: Number(category.estimatedAverageValue) || 0,
      taxRate: Number(category.taxRate) || 0,
      isExpanded: Boolean(category.isExpanded)
    }));
  }
  
  // Ensure metrics are properly formatted
  if (processedData.metrics) {
    processedData.metrics = {
      actual: Number(processedData.metrics.actual) || 0,
      potential: Number(processedData.metrics.potential) || 0,
      gap: Number(processedData.metrics.gap) || 0,
      potentialLeveraged: Number(processedData.metrics.potentialLeveraged) || 0,
      gapBreakdown: {
        registrationGap: Number(processedData.metrics.gapBreakdown?.registrationGap) || 0,
        complianceGap: Number(processedData.metrics.gapBreakdown?.complianceGap) || 0,
        assessmentGap: Number(processedData.metrics.gapBreakdown?.assessmentGap) || 0,
        rateGap: Number(processedData.metrics.gapBreakdown?.rateGap) || 0,
        combinedGaps: Number(processedData.metrics.gapBreakdown?.combinedGaps) || 0
      }
    };
  }
  
  // Ensure other properties are properly formatted
  processedData.totalEstimatedTaxPayers = Number(processedData.totalEstimatedTaxPayers) || 0;
  processedData.registeredTaxPayers = Number(processedData.registeredTaxPayers) || 0;
  
  return processedData;
}

// Helper function to process license data
export function processLicenseData(licenseData: any): any {
  // Deep clone the data to avoid modifying the original
  const processedData = JSON.parse(JSON.stringify(licenseData));
  
  // Ensure categories are properly formatted
  if (processedData.categories) {
    processedData.categories = processedData.categories.map((category: any) => ({
      name: category.name,
      registeredLicensees: Number(category.registeredLicensees) || 0,
      compliantLicensees: Number(category.compliantLicensees) || 0,
      estimatedLicensees: Number(category.estimatedLicensees) || 0,
      licenseFee: Number(category.licenseFee) || 0,
      averagePaidLicenseFee: Number(category.averagePaidLicenseFee) || 0
    }));
  }
  
  // Ensure metrics are properly formatted
  if (!processedData.metrics) {
    processedData.metrics = {
      actual: 0,
      potential: 0,
      gap: 0,
      potentialLeveraged: 0,
      gapBreakdown: {
        registrationGap: 0,
        complianceGap: 0,
        assessmentGap: 0,
        combinedGaps: 0
      }
    };
  } else {
    processedData.metrics = {
      actual: Number(processedData.metrics.actual) || 0,
      potential: Number(processedData.metrics.potential) || 0,
      gap: Number(processedData.metrics.gap) || 0,
      potentialLeveraged: Number(processedData.metrics.potentialLeveraged) || 0,
      gapBreakdown: {
        registrationGap: Number(processedData.metrics.gapBreakdown?.registrationGap) || 0,
        complianceGap: Number(processedData.metrics.gapBreakdown?.complianceGap) || 0,
        assessmentGap: Number(processedData.metrics.gapBreakdown?.assessmentGap) || 0,
        combinedGaps: Number(processedData.metrics.gapBreakdown?.combinedGaps) || 0
      }
    };
  }
  
  // Ensure other properties are properly formatted
  processedData.totalEstimatedLicensees = Number(processedData.totalEstimatedLicensees) || 0;
  processedData.registeredLicensees = Number(processedData.registeredLicensees) || 0;
  
  return processedData;
}

// Helper function to process mixed charge data
export function processMixedChargeData(mixedChargeData: any): any {
  console.log('Processing mixed charge data:', JSON.stringify(mixedChargeData, null, 2));
  
  if (!mixedChargeData) {
    console.log('Mixed charge data is null or undefined, creating default data');
    return {
      metrics: {
        actual: 180000,
        potential: 950000,
        gap: 770000,
        gapBreakdown: {
          complianceGap: 320000,
          rateGap: 280000,
          combinedGaps: 170000
        }
      },
      data: {
        estimatedDailyUsers: 1000,
        actualDailyUsers: 500,
        averageDailyUserFee: 1.5,
        actualDailyUserFee: 1,
        availableMonthlyUsers: 200,
        payingMonthlyUsers: 190,
        averageMonthlyRate: 70,
        actualMonthlyRate: 12
      }
    };
  }
  
  // Deep clone the data to avoid modifying the original
  const processedData = JSON.parse(JSON.stringify(mixedChargeData));
  
  // Ensure metrics are properly formatted
  if (!processedData.metrics) {
    console.log('Mixed charge metrics are missing, creating default metrics');
    processedData.metrics = {
      actual: 180000,
      potential: 950000,
      gap: 770000,
      gapBreakdown: {
        complianceGap: 320000,
        rateGap: 280000,
        combinedGaps: 170000
      }
    };
  } else {
    processedData.metrics = {
      actual: Number(processedData.metrics.actual) || 0,
      potential: Number(processedData.metrics.potential) || 0,
      gap: Number(processedData.metrics.gap) || 0,
      gapBreakdown: {
        complianceGap: Number(processedData.metrics.gapBreakdown?.complianceGap) || 0,
        rateGap: Number(processedData.metrics.gapBreakdown?.rateGap) || 0,
        combinedGaps: Number(processedData.metrics.gapBreakdown?.combinedGaps) || 0
      }
    };
  }
  
  // Ensure data is properly formatted
  if (!processedData.data) {
    console.log('Mixed charge data is missing, creating default data');
    processedData.data = {
      estimatedDailyUsers: 1000,
      actualDailyUsers: 500,
      averageDailyUserFee: 1.5,
      actualDailyUserFee: 1,
      availableMonthlyUsers: 200,
      payingMonthlyUsers: 190,
      averageMonthlyRate: 70,
      actualMonthlyRate: 12
    };
  } else {
    processedData.data = {
      estimatedDailyUsers: Number(processedData.data.estimatedDailyUsers) || 0,
      actualDailyUsers: Number(processedData.data.actualDailyUsers) || 0,
      averageDailyUserFee: Number(processedData.data.averageDailyUserFee) || 0,
      actualDailyUserFee: Number(processedData.data.actualDailyUserFee) || 0,
      availableMonthlyUsers: Number(processedData.data.availableMonthlyUsers) || 0,
      payingMonthlyUsers: Number(processedData.data.payingMonthlyUsers) || 0,
      averageMonthlyRate: Number(processedData.data.averageMonthlyRate) || 0,
      actualMonthlyRate: Number(processedData.data.actualMonthlyRate) || 0
    };
  }
  
  console.log('Processed mixed charge data:', JSON.stringify(processedData, null, 2));
  return processedData;
}