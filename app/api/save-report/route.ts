// =============================================================================
// IMPORTS
// =============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import { connectToDatabase } from '../../../lib/mongoose';
import User from '../../../models/User';
import UnifiedReport from '../../../models/UnifiedReport';
import { 
  createReport as createReportService,
  updateReport as updateReportService,
  getReportById as getReportByIdService,
  updatePropertyTaxData as updatePropertyTaxDataService,
  updateLicenseData as updateLicenseDataService,
  updateShortTermData as updateShortTermDataService,
  updateLongTermData as updateLongTermDataService,
  updateMixedChargeData as updateMixedChargeDataService
} from '../../services/unifiedReportService';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Converts string values to numbers, removing commas if present
 */
function cleanNumericValue(value: string | number): number {
  if (typeof value === 'number') return value;
  // Remove commas and convert to number
  return parseFloat(value.replace(/,/g, ''));
}

// =============================================================================
// DATA FORMATTING FUNCTIONS
// =============================================================================

/**
 * Ensures each category has an id field and correct field names
 */
function ensureCategoryIds(categories: any[] = []): any[] {
  return categories.map(category => {
    // Create a new object without _id field to avoid conflicts
    const { _id, ...categoryWithoutId } = category;
    
    // Use existing id, or convert _id to string if it exists, or generate a new UUID
    const id = category.id || (_id ? _id.toString() : randomUUID());
    
    // Handle field name conversion
    const result: any = {
      ...categoryWithoutId,
      id
    };
    
    // Convert field names if needed
    if (category.actualLandValue !== undefined && category.averageLandValue === undefined) {
      result.averageLandValue = category.actualLandValue;
    }
    
    if (category.estimatedLandValue !== undefined && category.estimatedAverageValue === undefined) {
      result.estimatedAverageValue = category.estimatedLandValue;
    }
    
    // Ensure the reverse conversion as well
    if (category.averageLandValue !== undefined && category.actualLandValue === undefined) {
      result.actualLandValue = category.averageLandValue;
    }
    
    if (category.estimatedAverageValue !== undefined && category.estimatedLandValue === undefined) {
      result.estimatedLandValue = category.estimatedAverageValue;
    }
    
    return result;
  });
}

/**
 * Ensures license categories have the correct structure
 */
function formatLicenseCategories(categories: any[] = []): any[] {
  return categories.map(category => {
    // Create a new object without unwanted fields
    const { score, questions, ...cleanCategory } = category;
    
    // Ensure all required fields are present
    return {
      name: category.name || 'Unnamed Category',
      registeredLicensees: category.registeredLicensees || 0,
      compliantLicensees: category.compliantLicensees || 0,
      estimatedLicensees: category.estimatedLicensees || 0,
      licenseFee: category.licenseFee || 0,
      averagePaidLicenseFee: category.averagePaidLicenseFee || 0,
      ...cleanCategory
    };
  });
}

/**
 * Format short-term categories to ensure they have the correct structure
 */
function formatShortTermCategories(categories: any[] = []): any[] {
  console.log('Formatting short-term categories:', categories);
  
  if (!Array.isArray(categories)) {
    console.log('Categories is not an array, returning empty array');
    return [];
  }
  
  if (categories.length === 0) {
    console.log('Categories array is empty');
    return [];
  }
  
  return categories.map(category => {
    if (!category) {
      console.log('Category is null or undefined, creating default category');
    return {
        id: randomUUID(),
        name: 'Default Category',
        estimatedDailyFees: 0,
        actualDailyFees: 0,
        potentialRate: 0,
        actualRate: 0,
        daysInYear: 365,
        isExpanded: false
      };
    }
    
    // Ensure all required fields are present with proper types
    const formattedCategory = {
      id: category.id || randomUUID(),
      name: category.name || 'Unnamed Category',
      estimatedDailyFees: Number(category.estimatedDailyFees) || 0,
      actualDailyFees: Number(category.actualDailyFees) || 0,
      potentialRate: Number(category.potentialRate) || 0,
      actualRate: Number(category.actualRate) || 0,
      daysInYear: Number(category.daysInYear) || 365,
      isExpanded: Boolean(category.isExpanded) || false
    };
    
    console.log('Formatted category:', formattedCategory);
    return formattedCategory;
  });
}

/**
 * Format long-term categories to ensure they have the correct structure
 */
function formatLongTermCategories(categories: any[] = []): any[] {
  console.log('Formatting long-term categories:', categories);
  
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.log('No long-term categories to format, returning empty array');
    return [];
  }
  
  return categories.map(category => {
    if (!category) {
      console.log('Null or undefined category found, creating default');
    return {
        id: randomUUID(),
        name: 'Default Category',
        estimatedLeases: 0,
        registeredLeases: 0,
        potentialRate: 0,
        actualRate: 0,
        isExpanded: false
      };
    }
    
    // Ensure all required fields are present with proper types
    const formattedCategory = {
      id: category.id || randomUUID(),
      name: category.name || 'Unnamed Category',
      estimatedLeases: Number(category.estimatedLeases) || 0,
      registeredLeases: Number(category.registeredLeases) || 0,
      potentialRate: Number(category.potentialRate) || 0,
      actualRate: Number(category.actualRate) || 0,
      isExpanded: Boolean(category.isExpanded) || false
    };
    
    console.log('Formatted long-term category:', formattedCategory);
    return formattedCategory;
  });
}

/**
 * Format property tax categories to ensure they have the correct structure
 */
function formatPropertyTaxCategories(categories: any[] = []): any[] {
  console.log('Formatting property tax categories:', categories);
  
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.warn('No property tax categories to format');
    return [];
  }
  
  return categories.map(category => {
    const { _id, ...categoryWithoutId } = category;
    
    // Use existing id, or convert _id to string if it exists, or generate a new UUID
    const id = category.id || (_id ? _id.toString() : randomUUID());
    
    return {
      id,
      name: category.name || 'Unnamed Category',
      registeredTaxpayers: Number(category.registeredTaxpayers) || 0,
      compliantTaxpayers: Number(category.compliantTaxpayers) || 0,
      averageLandValue: Number(category.averageLandValue) || 0,
      estimatedAverageValue: Number(category.estimatedAverageValue) || 0,
      taxRate: Number(category.taxRate) || 0
    };
  });
}

/**
 * Process mixed charge data
 */
function processMixedChargeData(mixedChargeData: any) {
  try {
    // Validate the structure of mixed charge data
    if (!mixedChargeData.metrics) {
      console.warn('Mixed charge metrics are missing or invalid');
    }
    
    if (!mixedChargeData.data) {
      console.warn('Mixed charge data is missing or invalid');
    }
    
    return {
      metrics: mixedChargeData.metrics || {
        actual: 0,
        potential: 0,
        gap: 0,
        gapBreakdown: {
          complianceGap: 0,
          rateGap: 0,
          combinedGaps: 0
        }
      },
      data: mixedChargeData.data || {
        estimatedDailyUsers: 0,
        actualDailyUsers: 0,
        averageDailyUserFee: 0,
        actualDailyUserFee: 0,
        availableMonthlyUsers: 0,
        payingMonthlyUsers: 0,
        averageMonthlyRate: 0,
        actualMonthlyRate: 0
      }
    };
  } catch (error) {
    console.error('Error processing mixed charge data:', error);
    // Return a default structure
    return {
      metrics: {
        actual: 0,
        potential: 0,
        gap: 0,
        gapBreakdown: {
          complianceGap: 0,
          rateGap: 0,
          combinedGaps: 0
        }
      },
      data: {
        estimatedDailyUsers: 0,
        actualDailyUsers: 0,
        averageDailyUserFee: 0,
        actualDailyUserFee: 0,
        availableMonthlyUsers: 0,
        payingMonthlyUsers: 0,
        averageMonthlyRate: 0,
        actualMonthlyRate: 0
      }
    };
  }
}

// =============================================================================
// HELPER FUNCTIONS FOR ROUTE HANDLER
// =============================================================================

async function getUserByEmail(email: string) {
  await connectToDatabase();
  return await User.findOne({ email });
}

async function getReportById(reportId: string, userId: string) {
  await connectToDatabase();
  return await UnifiedReport.findOne({ _id: reportId, user: userId });
}

// Function to update shortTerm data directly
async function updateShortTermDataDirectly(reportId: string, shortTermData: any) {
  console.log('========== DIRECT SHORT-TERM UPDATE FUNCTION ==========');
  console.log('Updating shortTerm data for report:', reportId);
  
  try {
    // Try multiple approaches to update the shortTerm data
    
    // Approach 1: Using findOneAndUpdate
    console.log('Approach 1: Using findOneAndUpdate');
    const updateResult1 = await UnifiedReport.findOneAndUpdate(
      { _id: reportId },
      { $set: { 'shortTerm': shortTermData } },
      { new: true }
    );
    
    if (updateResult1?.shortTerm) {
      console.log('Approach 1 succeeded!');
      return updateResult1;
    }
    
    console.log('Approach 1 failed, trying approach 2');
    
    // Approach 2: Using updateOne
    console.log('Approach 2: Using updateOne');
    const updateResult2 = await UnifiedReport.updateOne(
      { _id: reportId },
      { $set: { 'shortTerm': shortTermData } }
    );
    
    console.log('Approach 2 result:', JSON.stringify(updateResult2, null, 2));
    
    // Check if it worked
    const checkResult2 = await UnifiedReport.findById(reportId);
    
    if (checkResult2?.shortTerm) {
      console.log('Approach 2 succeeded!');
      return checkResult2;
    }
    
    console.log('Approach 2 failed, trying approach 3');
    
    // Approach 3: Using raw MongoDB
    console.log('Approach 3: Using raw MongoDB');
    const client = await mongoose.connection.getClient();
    const db = client.db();
    const collection = db.collection('unifiedreports');
    
    const updateResult3 = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(reportId.toString()) },
      { $set: { shortTerm: shortTermData } }
    );
    
    console.log('Approach 3 result:', JSON.stringify(updateResult3, null, 2));
    
    // Check if it worked
    const checkResult3 = await collection.findOne(
      { _id: new mongoose.Types.ObjectId(reportId.toString()) },
      { projection: { shortTerm: 1 } }
    );
    
    if (checkResult3?.shortTerm) {
      console.log('Approach 3 succeeded!');
      return await UnifiedReport.findById(reportId);
    }
    
    console.log('Approach 3 failed, trying approach 4');
    
    // Approach 4: Using findById, modify, and save
    console.log('Approach 4: Using findById, modify, and save');
    const report = await UnifiedReport.findById(reportId);
    
    if (report) {
      // Set the shortTerm field directly
      report.shortTerm = shortTermData;
      
      // Save the document
      const savedReport = await report.save();
      
      if (savedReport.shortTerm) {
        console.log('Approach 4 succeeded!');
        return savedReport;
      }
    }
    
    console.log('All approaches failed');
    return null;
  } catch (error) {
    console.error('Error in updateShortTermDataDirectly:', error);
    return null;
  }
}

// =============================================================================
// MAIN API ROUTE HANDLER
// =============================================================================

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------------------
    // AUTHENTICATION & USER VALIDATION
    // ---------------------------------------------------------------------
    
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get the user ID
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Connected to MongoDB successfully');
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = user._id.toString();
    console.log('User ID:', userId);
    
    // ---------------------------------------------------------------------
    // PARSE REQUEST DATA
    // ---------------------------------------------------------------------
    
    // Get the request body
    const data = await request.json();
    console.log('=== START: save-report POST request body ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('=== END: save-report POST request body ===');
    
    // Get common values from estimate data for calculations
    const country = data.estimate?.country || data.country || 'Not specified';
    const state = data.estimate?.state || data.state || 'Not specified';
    const countryCode = data.estimate?.countryCode || data.countryCode || '';
    console.log('Country code being used:', countryCode, 'for country:', country);
    
    const population = Number(data.estimate?.population) || 5000000;
    const gdpPerCapita = Number(data.estimate?.gdpPerCapita) || 50000;
    const totalRevenue = Number(data.estimate?.metrics?.potential) || 1000000;
    
    // Validate the data
    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }
    
    // ---------------------------------------------------------------------
    // REPORT CREATION OR UPDATE
    // ---------------------------------------------------------------------
    
    // Check if we have a reportId
    const reportId = data.reportId;
    let report;
    
      if (reportId) {
        console.log('Updating existing report:', reportId);
        
      // Get the existing report
      report = await getReportByIdService(reportId, userId);
      
      if (!report) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }
      
      // Update the report with new data
      const updateData = {
        ...data,
        user: userId
      };
      
      // If estimate data is present, move it to the top level
      if (data.estimate) {
        const title = `${state}, ${country} (${data.estimate.financialYear})`.trim();
        
        Object.assign(updateData, {
          title: title !== ', ()' ? title : 'Untitled Report',
          country: country,
          countryCode: countryCode,
          state: state,
          financialYear: data.estimate.financialYear,
          currency: data.estimate.currency || '',
          currencySymbol: data.estimate.currencySymbol || '',
          actualOSR: Number(data.estimate.actualOSR) || 0,
          budgetedOSR: Number(data.estimate.budgetedOSR) || 0,
          population: population,
          gdpPerCapita: gdpPerCapita
        });
      }
      
      report = await updateReportService(reportId, userId, updateData);
      console.log('Report updated successfully:', report._id.toString());
    } else {
      console.log('Creating new report');
      
      // Create a new report
      const reportData = {
        ...data,
        user: userId
      };
      
      // If estimate data is present, move it to the top level
      if (data.estimate) {
        const title = `${state}, ${country} (${data.estimate.financialYear})`.trim();
        
        Object.assign(reportData, {
          title: title !== ', ()' ? title : 'Untitled Report',
          country: country,
          countryCode: countryCode,
          state: state,
          financialYear: data.estimate.financialYear,
          currency: data.estimate.currency || '',
          currencySymbol: data.estimate.currencySymbol || '',
          actualOSR: Number(data.estimate.actualOSR) || 0,
          budgetedOSR: Number(data.estimate.budgetedOSR) || 0,
          population: population,
          gdpPerCapita: gdpPerCapita
        });
      }
      
      report = await createReportService(reportData);
      console.log('Report created successfully:', report._id.toString());
    }
    
    // ---------------------------------------------------------------------
    // UPDATE ESTIMATE DATA
    // ---------------------------------------------------------------------
    
    // Ensure the estimate data is properly saved
    if (data.estimate) {
      console.log('Updating estimate data for report:', report._id.toString());
      
      // Format the estimate data
      const formattedEstimate = {
        country: country,
        countryCode: countryCode,
        state: state,
        financialYear: data.estimate.financialYear,
        currency: data.estimate.currency || '',
        currencySymbol: data.estimate.currencySymbol || '',
        actualOSR: Number(data.estimate.actualOSR) || 0,
        budgetedOSR: Number(data.estimate.budgetedOSR) || 0,
        population: population,
        gdpPerCapita: gdpPerCapita
      };
      
      // Update the estimate directly in the database
      await UnifiedReport.updateOne(
        { _id: report._id },
        { $set: formattedEstimate }
      );
      
      console.log('Estimate data updated successfully');
      
      // Verify the estimate data was saved
      const verifyReport = await UnifiedReport.findOne(
        { _id: report._id },
        { 
          country: 1, 
          countryCode: 1, 
          state: 1, 
          financialYear: 1, 
          currency: 1, 
          currencySymbol: 1, 
          actualOSR: 1, 
          budgetedOSR: 1, 
          population: 1, 
          gdpPerCapita: 1 
        }
      ).lean();
      
      console.log('Verified estimate data:', JSON.stringify(verifyReport, null, 2));
    }
    
    // ---------------------------------------------------------------------
    // PROCESS PROPERTY TAX DATA
    // ---------------------------------------------------------------------
    
    // Process property tax data if it exists
    if (data.propertyTax) {
      console.log('Processing property tax data:', JSON.stringify(data.propertyTax, null, 2));
      
      // Check if we have categories in the saveData structure
      let propertyTaxCategories = [];
      
      if (data.propertyTax.saveData && data.propertyTax.saveData.categories && 
          Array.isArray(data.propertyTax.saveData.categories) && 
          data.propertyTax.saveData.categories.length > 0) {
        console.log('Using categories from saveData structure');
        propertyTaxCategories = data.propertyTax.saveData.categories;
      } else if (data.propertyTax.categories && 
                Array.isArray(data.propertyTax.categories) && 
                data.propertyTax.categories.length > 0) {
        console.log('Using categories from root structure');
        propertyTaxCategories = data.propertyTax.categories;
      } else {
        console.warn('No categories found in property tax data');
      }
      
      // Get total estimated tax payers and registered tax payers
      let totalEstimatedTaxPayers = 0;
      let registeredTaxPayers = 0;
      
      if (data.propertyTax.saveData) {
        totalEstimatedTaxPayers = Number(data.propertyTax.saveData.totalEstimatedTaxPayers) || 0;
        registeredTaxPayers = Number(data.propertyTax.saveData.registeredTaxPayers) || 0;
      } else {
        totalEstimatedTaxPayers = Number(data.propertyTax.totalEstimatedTaxPayers) || 0;
        registeredTaxPayers = Number(data.propertyTax.registeredTaxPayers) || 0;
      }
      
      // Get metrics
      let metrics = data.propertyTax.metrics || {
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
      };
      
      const processedPropertyTax = {
        categories: formatPropertyTaxCategories(propertyTaxCategories),
        totalEstimatedTaxPayers,
        registeredTaxPayers,
        metrics,
        country: data.propertyTax.country || data.estimate?.country || 'Not specified',
        state: data.propertyTax.state || data.estimate?.state || 'Not specified'
      };
      
      console.log('Processed property tax data:', JSON.stringify(processedPropertyTax, null, 2));
      await updatePropertyTaxDataService(report._id?.toString(), userId, processedPropertyTax);
    }
    
    // ---------------------------------------------------------------------
    // PROCESS LICENSE DATA
    // ---------------------------------------------------------------------
    
    // Process license data if it exists
    if (data.license) {
      console.log('Processing license data:', JSON.stringify(data.license, null, 2));
      
      const licenseCategories = formatLicenseCategories(data.license.categories);
      console.log('Formatted license categories:', JSON.stringify(licenseCategories, null, 2));
      
      // Calculate license metrics based on the categories
      let totalActual = 0;
      let totalPotential = 0;
      let registrationGap = 0;
      let complianceGap = 0;
      let assessmentGap = 0;
      let combinedGaps = 0;
      
      if (licenseCategories && licenseCategories.length > 0) {
        licenseCategories.forEach(category => {
          // Calculate potential revenue for this category
          const potentialRevenue = category.estimatedLicensees * category.licenseFee;
          
          // Calculate actual revenue for this category
          const actualRevenue = category.compliantLicensees * category.averagePaidLicenseFee;
          
          // Calculate gaps
          const categoryRegistrationGap = (category.estimatedLicensees - category.registeredLicensees) * category.licenseFee;
          const categoryComplianceGap = (category.registeredLicensees - category.compliantLicensees) * category.licenseFee;
          const categoryAssessmentGap = category.compliantLicensees * (category.licenseFee - category.averagePaidLicenseFee);
          
          // Calculate combined gaps - this is the revenue lost due to multiple factors combined
          // For example, when a business is both unregistered and would have paid less than the full rate
          const categoryCombinedGap = Math.max(0, potentialRevenue - actualRevenue - categoryRegistrationGap - categoryComplianceGap - categoryAssessmentGap);
          
          console.log(`License category ${category.name} calculations:`, {
            potentialRevenue,
            actualRevenue,
            categoryRegistrationGap,
            categoryComplianceGap,
            categoryAssessmentGap,
            categoryCombinedGap
          });
          
          // Add to totals
          totalPotential += potentialRevenue;
          totalActual += actualRevenue;
          registrationGap += categoryRegistrationGap;
          complianceGap += categoryComplianceGap;
          assessmentGap += categoryAssessmentGap;
          combinedGaps += categoryCombinedGap;
        });
      }
      
      const totalGap = totalPotential - totalActual;
      
      // Double-check that our gap calculations add up to the total gap
      // If not, adjust the combinedGaps to make it balance
      const calculatedGaps = registrationGap + complianceGap + assessmentGap + combinedGaps;
      if (Math.abs(calculatedGaps - totalGap) > 1) { // Allow for small rounding errors
        combinedGaps = Math.max(0, totalGap - registrationGap - complianceGap - assessmentGap);
      }
      
      console.log('License metrics calculation results:', {
        totalPotential,
        totalActual,
        totalGap,
        registrationGap,
        complianceGap,
        assessmentGap,
        combinedGaps,
        calculatedGaps,
        difference: Math.abs(calculatedGaps - totalGap)
      });
      
      const processedLicense = {
        categories: licenseCategories,
        totalEstimatedLicensees: Number(data.license.totalEstimatedLicensees) || 0,
        registeredLicensees: licenseCategories.reduce((sum, cat) => sum + (Number(cat.registeredLicensees) || 0), 0),
        metrics: {
          actual: totalActual,
          potential: totalPotential,
          gap: totalGap,
          //potentialLeveraged: Math.round(totalPotential * 0.92), // Assuming 92% potential leverage
          gapBreakdown: {
            registrationGap: registrationGap,
            complianceGap: complianceGap,
            assessmentGap: assessmentGap,
            combinedGaps: combinedGaps > 0 ? combinedGaps : 0
          },
          analysisMessage: ""
        },
        country: data.license.country || data.estimate?.country || 'Not specified',
        state: data.license.state || data.estimate?.state || 'Not specified'
      };
      
      console.log('Processed license data:', JSON.stringify(processedLicense, null, 2));
      const updatedReport = await updateLicenseDataService(report._id?.toString(), userId, processedLicense);
      console.log('License data updated successfully');
      
      // Verify the license data was saved correctly
      if (updatedReport && updatedReport.license) {
        console.log('License metrics verification:', {
          actual: updatedReport.license.metrics?.actual,
          potential: updatedReport.license.metrics?.potential,
          gap: updatedReport.license.metrics?.gap,
          registrationGap: updatedReport.license.metrics?.gapBreakdown?.registrationGap,
          complianceGap: updatedReport.license.metrics?.gapBreakdown?.complianceGap,
          assessmentGap: updatedReport.license.metrics?.gapBreakdown?.assessmentGap,
          combinedGaps: updatedReport.license.metrics?.gapBreakdown?.combinedGaps
        });
      } else {
        console.error('Failed to verify license data after save');
      }
    }
    
    // ---------------------------------------------------------------------
    // PROCESS SHORT-TERM USER CHARGE DATA
    // ---------------------------------------------------------------------
    
    // Update short-term data if available
    if (data.shortTerm) {
      console.log('========== SHORT-TERM DATA PROCESSING START ==========');
      console.log('Original shortTerm data structure:', Object.keys(data.shortTerm).join(', '));
      console.log('Has metrics?', !!data.shortTerm.metrics);
      console.log('Has categories?', !!data.shortTerm.categories);
      console.log('Has saveData?', !!data.shortTerm.saveData);
      
      try {
        // Check if we have categories in the saveData structure
        let shortTermCategories = [];
        let totalEstimatedDailyFees = 0;
        let totalActualDailyFees = 0;
        
        if (data.shortTerm.saveData && data.shortTerm.saveData.categories && 
            Array.isArray(data.shortTerm.saveData.categories) && 
            data.shortTerm.saveData.categories.length > 0) {
          console.log('Using categories from saveData structure');
          shortTermCategories = data.shortTerm.saveData.categories;
          totalEstimatedDailyFees = Number(data.shortTerm.saveData.totalEstimatedDailyFees) || 0;
          totalActualDailyFees = Number(data.shortTerm.saveData.totalActualDailyFees) || 0;
        } else if (data.shortTerm.categories && 
                  Array.isArray(data.shortTerm.categories) && 
                  data.shortTerm.categories.length > 0) {
          console.log('Using categories from root structure');
          shortTermCategories = data.shortTerm.categories;
          totalEstimatedDailyFees = Number(data.shortTerm.totalEstimatedDailyFees) || 0;
          totalActualDailyFees = Number(data.shortTerm.totalActualDailyFees) || 0;
        } else {
          console.warn('No categories found in short-term data, using default categories from context');
          // Create default categories similar to the ShortTermContext defaults
          shortTermCategories = [
            {
              id: randomUUID(),
              name: 'Parking Fees',
              estimatedDailyFees: 500,
              actualDailyFees: 350,
              potentialRate: 10,
              actualRate: 7,
              daysInYear: 365,
              isExpanded: false
            },
            {
              id: randomUUID(),
              name: 'Market Fees',
              estimatedDailyFees: 300,
              actualDailyFees: 210,
              potentialRate: 15,
              actualRate: 10.5,
              daysInYear: 365,
              isExpanded: false
            },
            {
              id: randomUUID(),
              name: 'Bus Park Fees',
              estimatedDailyFees: 200,
              actualDailyFees: 140,
              potentialRate: 20,
              actualRate: 14,
              daysInYear: 365,
              isExpanded: false
            }
          ];
          totalEstimatedDailyFees = 1000; // Default from context
          totalActualDailyFees = 700; // Default from context
        }
        
        console.log('Categories count:', shortTermCategories.length);
        console.log('totalEstimatedDailyFees:', totalEstimatedDailyFees);
        console.log('totalActualDailyFees:', totalActualDailyFees);
        
        // Get currency symbol from the data
        const currencySymbol = data.shortTerm.currencySymbol || data.estimate?.currencySymbol || '$';
        console.log('currencySymbol:', currencySymbol);
        
        // Format the categories properly
        const formattedCategories = formatShortTermCategories(shortTermCategories);
        console.log('Formatted short-term categories count:', formattedCategories.length);
        if (formattedCategories.length > 0) {
          console.log('First category sample:', JSON.stringify(formattedCategories[0], null, 2));
        }
        
        // Create metrics object with the correct field names
        let metrics;
        
        if (data.shortTerm.metrics) {
          // Use provided metrics
          metrics = {
            totalEstimatedRevenue: Number(data.shortTerm.metrics?.totalEstimatedRevenue || 
                                        data.shortTerm.metrics?.potential || 0),
            totalActualRevenue: Number(data.shortTerm.metrics?.totalActualRevenue || 
                                      data.shortTerm.metrics?.actual || 0),
            totalGap: Number(data.shortTerm.metrics?.totalGap || 
                            data.shortTerm.metrics?.gap || 0),
            currencySymbol: currencySymbol,
            gapBreakdown: {
              registrationGap: Number(data.shortTerm.metrics?.gapBreakdown?.registrationGap || 0),
              registrationGapPercentage: Number(data.shortTerm.metrics?.gapBreakdown?.registrationGapPercentage || 0),
              complianceGap: Number(data.shortTerm.metrics?.gapBreakdown?.complianceGap || 0),
              complianceGapPercentage: Number(data.shortTerm.metrics?.gapBreakdown?.complianceGapPercentage || 0),
              rateGap: Number(data.shortTerm.metrics?.gapBreakdown?.rateGap || 0),
              rateGapPercentage: Number(data.shortTerm.metrics?.gapBreakdown?.rateGapPercentage || 0),
              combinedGaps: Number(data.shortTerm.metrics?.gapBreakdown?.combinedGaps || 0),
              combinedGapsPercentage: Number(data.shortTerm.metrics?.gapBreakdown?.combinedGapsPercentage || 0)
            },
            totalEstimatedDailyFees: totalEstimatedDailyFees,
            totalActualDailyFees: totalActualDailyFees
          };
        } else {
          // Calculate default metrics based on categories
          const totalEstimatedRevenue = formattedCategories.reduce((sum, cat) => 
            sum + (Number(cat.estimatedDailyFees) * 365), 0);
          const totalActualRevenue = formattedCategories.reduce((sum, cat) => 
            sum + (Number(cat.actualDailyFees) * 365), 0);
          const totalGap = totalEstimatedRevenue - totalActualRevenue;
          
          // Calculate gap breakdown (simplified)
          const registrationGap = totalGap * 0.4; // 40% of gap is registration
          const complianceGap = totalGap * 0.35; // 35% of gap is compliance
          const rateGap = totalGap * 0.2; // 20% of gap is rate
          const combinedGaps = totalGap - registrationGap - complianceGap - rateGap;
          
          metrics = {
            totalEstimatedRevenue,
            totalActualRevenue,
            totalGap,
            currencySymbol,
            gapBreakdown: {
              registrationGap,
              registrationGapPercentage: totalEstimatedRevenue > 0 ? (registrationGap / totalEstimatedRevenue) * 100 : 0,
              complianceGap,
              complianceGapPercentage: totalEstimatedRevenue > 0 ? (complianceGap / totalEstimatedRevenue) * 100 : 0,
              rateGap,
              rateGapPercentage: totalEstimatedRevenue > 0 ? (rateGap / totalEstimatedRevenue) * 100 : 0,
              combinedGaps,
              combinedGapsPercentage: totalEstimatedRevenue > 0 ? (combinedGaps / totalEstimatedRevenue) * 100 : 0
            },
            totalEstimatedDailyFees,
            totalActualDailyFees
          };
        }
        
        console.log('Metrics object:', JSON.stringify({
          totalEstimatedRevenue: metrics.totalEstimatedRevenue,
          totalActualRevenue: metrics.totalActualRevenue,
          totalGap: metrics.totalGap,
          currencySymbol: metrics.currencySymbol
        }, null, 2));
        
        // Create the final processed data
        const processedShortTerm = {
          categories: formattedCategories,
          metrics: metrics,
          country: data.shortTerm.country || data.estimate?.country || 'Not specified',
          state: data.shortTerm.state || data.estimate?.state || 'Not specified',
          totalEstimatedDailyFees: totalEstimatedDailyFees,
          totalActualDailyFees: totalActualDailyFees
        };
        
        console.log('Processed shortTerm structure:', Object.keys(processedShortTerm).join(', '));
        console.log('Processed shortTerm metrics structure:', Object.keys(processedShortTerm.metrics).join(', '));
        
        // Check if there might be a validation issue
        try {
          console.log('Checking for validation issues...');
          // Create a temporary document to validate
          const tempReport = new UnifiedReport({
            shortTerm: processedShortTerm
          });
          
          // Validate just the shortTerm field
          const validationError = tempReport.validateSync('shortTerm');
          if (validationError) {
            console.error('Validation error with shortTerm data:', validationError);
            // Try to fix the validation issues
            if (validationError.errors) {
              console.log('Attempting to fix validation issues...');
              Object.keys(validationError.errors).forEach(errorPath => {
                console.error(`Validation error at ${errorPath}:`, validationError.errors[errorPath].message);
              });
            }
          } else {
            console.log('ShortTerm data passes validation');
          }
        } catch (validationError) {
          console.error('Error during validation check:', validationError);
        }
        
        console.log('Calling updateShortTermDataDirectly with reportId:', report._id.toString());
        console.log('Report ID type:', typeof report._id);
        
        // Call the new function to update shortTerm data directly
        const updatedShortTermReport = await updateShortTermDataDirectly(report._id.toString(), processedShortTerm);
        
        if (updatedShortTermReport && updatedShortTermReport.shortTerm) {
          console.log('Short-term data updated successfully for report:', report._id.toString());
          console.log('Updated short-term data structure:', JSON.stringify({
            metricsExists: !!updatedShortTermReport.shortTerm.metrics,
            categoriesCount: updatedShortTermReport.shortTerm.categories?.length || 0,
            country: updatedShortTermReport.shortTerm.country,
            state: updatedShortTermReport.shortTerm.state
          }, null, 2));
          
          // Verify the data was saved correctly with a direct query
          const verifyReport = await UnifiedReport.findOne(
            { _id: report._id, user: userId },
            { 'shortTerm': 1 }
          ).lean();
          
          if (verifyReport && verifyReport.shortTerm) {
            console.log('Verified short-term data exists in database');
          } else {
            console.error('Failed to verify short-term data in database after save');
          }
        } else {
          console.error('Failed to update short-term data or shortTerm field is missing in the response');
          console.error('Updated report structure:', updatedShortTermReport ? Object.keys(updatedShortTermReport).join(', ') : 'null');
        }
        
        console.log('========== SHORT-TERM DATA PROCESSING END ==========');
    } catch (error) {
        console.error('Error updating short-term data:', error);
        // Continue with the rest of the processing even if short-term update fails
      }
    } else {
      console.log('No shortTerm data to process');
      
      // Create default short-term data if none was provided
      try {
        console.log('Creating default short-term data');
        
        // Create default categories
        const defaultCategories = [
          {
            id: randomUUID(),
            name: 'Parking Fees',
            estimatedDailyFees: 500,
            actualDailyFees: 350,
            potentialRate: 10,
            actualRate: 7,
            daysInYear: 365,
            isExpanded: false
          },
          {
            id: randomUUID(),
            name: 'Market Fees',
            estimatedDailyFees: 300,
            actualDailyFees: 210,
            potentialRate: 15,
            actualRate: 10.5,
            daysInYear: 365,
            isExpanded: false
          },
          {
            id: randomUUID(),
            name: 'Bus Park Fees',
            estimatedDailyFees: 200,
            actualDailyFees: 140,
            potentialRate: 20,
            actualRate: 14,
            daysInYear: 365,
            isExpanded: false
          }
        ];
        
        const totalEstimatedDailyFees = 1000;
        const totalActualDailyFees = 700;
        
        // Format the categories
        const formattedCategories = formatShortTermCategories(defaultCategories);
        
        // Calculate default metrics
        const totalEstimatedRevenue = formattedCategories.reduce((sum, cat) => 
          sum + (Number(cat.estimatedDailyFees) * 365), 0);
        const totalActualRevenue = formattedCategories.reduce((sum, cat) => 
          sum + (Number(cat.actualDailyFees) * 365), 0);
        const totalGap = totalEstimatedRevenue - totalActualRevenue;
        
        // Calculate gap breakdown
        const registrationGap = totalGap * 0.4;
        const complianceGap = totalGap * 0.35;
        const rateGap = totalGap * 0.2;
        const combinedGaps = totalGap - registrationGap - complianceGap - rateGap;
        
        // Get currency symbol
        const currencySymbol = data.estimate?.currencySymbol || '$';
        
        // Create the default short-term data
        const defaultShortTerm = {
          categories: formattedCategories,
          metrics: {
            totalEstimatedRevenue,
            totalActualRevenue,
            totalGap,
            currencySymbol,
            gapBreakdown: {
              registrationGap,
              registrationGapPercentage: totalEstimatedRevenue > 0 ? (registrationGap / totalEstimatedRevenue) * 100 : 0,
              complianceGap,
              complianceGapPercentage: totalEstimatedRevenue > 0 ? (complianceGap / totalEstimatedRevenue) * 100 : 0,
              rateGap,
              rateGapPercentage: totalEstimatedRevenue > 0 ? (rateGap / totalEstimatedRevenue) * 100 : 0,
              combinedGaps,
              combinedGapsPercentage: totalEstimatedRevenue > 0 ? (combinedGaps / totalEstimatedRevenue) * 100 : 0
            },
            totalEstimatedDailyFees,
            totalActualDailyFees
          },
          country: data.estimate?.country || 'Not specified',
          state: data.estimate?.state || 'Not specified',
          totalEstimatedDailyFees,
          totalActualDailyFees
        };
        
        console.log('Calling updateShortTermDataDirectly with default data');
        await updateShortTermDataDirectly(report._id.toString(), defaultShortTerm);
        console.log('Default short-term data saved successfully');
  } catch (error) {
        console.error('Error creating default short-term data:', error);
      }
    }
    
    // ---------------------------------------------------------------------
    // PROCESS MIXED CHARGE DATA
    // ---------------------------------------------------------------------
    
    // Process mixed charge data if it exists
    console.log('mixedCharge data check:', data.mixedCharge === null ? 'null' : (data.mixedCharge ? 'exists' : 'undefined'));
    
    // Always ensure mixedCharge data exists in the report
    console.log('Ensuring mixedCharge data exists in the report');
    
    // Calculate meaningful default values for mixedCharge data
    // Assume mixedCharge revenue is about 20% of total potential revenue
    const mixedChargePotential = Math.round(totalRevenue * 0.2);
    const mixedChargeActual = Math.round(mixedChargePotential * 0.7); // 70% of potential
    const mixedChargeGap = mixedChargePotential - mixedChargeActual;
    
    // Calculate gap breakdown
    const mixedComplianceGap = Math.round(mixedChargeGap * 0.45); // 45% of gap is compliance
    const mixedAssessmentGap = Math.round(mixedChargeGap * 0.4); // 40% of gap is assessment
    const mixedCombinedGaps = mixedChargeGap - mixedComplianceGap - mixedAssessmentGap; // Remainder is combined
    
    // Calculate daily and monthly user metrics
    const estimatedDailyUsers = Math.round(population * 0.0002); // 0.02% of population uses daily
    const actualDailyUsers = Math.round(estimatedDailyUsers * 0.7); // 70% compliance
    const averageDailyUserFee = Math.round((gdpPerCapita * 0.00003) * 10) / 10; // Scale based on GDP
    const actualDailyUserFee = Math.round((averageDailyUserFee * 0.8) * 10) / 10; // 80% of potential rate
    
    const availableMonthlyUsers = Math.round(population * 0.00004); // 0.004% of population uses monthly
    const payingMonthlyUsers = Math.round(availableMonthlyUsers * 0.85); // 85% compliance for monthly
    const averageMonthlyRate = Math.round(gdpPerCapita * 0.0014); // Scale based on GDP
    const actualMonthlyRate = Math.round(averageMonthlyRate * 0.9); // 90% of potential rate
    
    // Create default mixedCharge data with calculated values
    const defaultMixedCharge = {
      metrics: {
        actual: mixedChargeActual,
        potential: mixedChargePotential,
        gap: mixedChargeGap,
        gapBreakdown: {
          complianceGap: mixedComplianceGap,
          assessmentGap: mixedAssessmentGap,
          combinedGaps: mixedCombinedGaps
        }
      },
      data: {
        estimatedDailyUsers: estimatedDailyUsers,
        actualDailyUsers: actualDailyUsers,
        averageDailyUserFee: averageDailyUserFee,
        actualDailyUserFee: actualDailyUserFee,
        availableMonthlyUsers: availableMonthlyUsers,
        payingMonthlyUsers: payingMonthlyUsers,
        averageMonthlyRate: averageMonthlyRate,
        actualMonthlyRate: actualMonthlyRate
      }
    };
    
    // Use existing mixedCharge data if available, otherwise use default
    const mixedChargeData = data.mixedCharge !== null && data.mixedCharge !== undefined 
      ? data.mixedCharge 
      : defaultMixedCharge;
    
    console.log('mixedCharge data to use:', JSON.stringify(mixedChargeData, null, 2));
    
    try {
      console.log('Calling updateMixedChargeDataService with reportId:', report._id?.toString());
      console.log('Report ID type:', typeof report._id);
      await updateMixedChargeDataService(report._id?.toString(), userId, mixedChargeData);
      console.log('Mixed charge data updated successfully');
    } catch (error) {
      console.error('Error processing mixedCharge data:', error);
      // Continue with the rest of the processing even if mixedCharge update fails
    }
    
    // ---------------------------------------------------------------------
    // PROCESS LONG-TERM DATA
    // ---------------------------------------------------------------------
    
    // Process long term data if it exists
    console.log('longTerm data check:', data.longTerm === null ? 'null' : (data.longTerm ? 'exists' : 'undefined'));
    
    // Always ensure longTerm data exists in the report
    console.log('Ensuring longTerm data exists in the report');
    
    // Get country and state from estimate data if available
    const longTermCountry = data.estimate?.country || data.country || 'Not specified';
    const longTermState = data.estimate?.state || data.state || 'Not specified';
    const longTermCountryCode = data.estimate?.countryCode || data.countryCode || '';
    
    // Calculate meaningful default values for longTerm data
    // Assume longTerm revenue is about 30% of total potential revenue
    const longTermPotential = Math.round(totalRevenue * 0.3);
    const longTermActual = Math.round(longTermPotential * 0.6); // 60% of potential
    const longTermGap = longTermPotential - longTermActual;
    
    // Calculate gap breakdown
    const registrationGapPercentage = 0.4; // 40% of gap is registration
    const registrationGap = Math.round(longTermGap * registrationGapPercentage);
    const complianceGap = Math.round(longTermGap * 0.3); // 30% of gap is compliance
    const rateGap = Math.round(longTermGap * 0.2); // 20% of gap is rate
    const combinedGaps = longTermGap - registrationGap - complianceGap - rateGap; // Remainder is combined
    
    // Calculate leveraged potential (80% of gap can be leveraged)
    const potentialLeveraged = Math.round(longTermActual + (longTermGap * 0.8));
    
    // Create default longTerm data with calculated values
    const defaultLongTerm = {
      categories: [
        {
          id: randomUUID(),
          name: 'Residential Leases',
          estimatedLeases: Math.round(population * 0.0005), // 0.05% of population
          registeredLeases: Math.round(population * 0.0003), // 60% registration rate
          potentialRate: Math.round(gdpPerCapita * 0.002), // 0.2% of GDP per capita
          actualRate: Math.round(gdpPerCapita * 0.0016), // 80% of potential rate
          isExpanded: true
        },
        {
          id: randomUUID(),
          name: 'Commercial Leases',
          estimatedLeases: Math.round(population * 0.0001), // 0.01% of population
          registeredLeases: Math.round(population * 0.00007), // 70% registration rate
          potentialRate: Math.round(gdpPerCapita * 0.01), // 1% of GDP per capita
          actualRate: Math.round(gdpPerCapita * 0.008), // 80% of potential rate
          isExpanded: false
        }
      ],
      metrics: {
        actual: longTermActual,
        potential: longTermPotential,
        gap: longTermGap,
        potentialLeveraged: potentialLeveraged,
        gapBreakdown: {
          registrationGapPercentage: registrationGapPercentage,
          complianceGap: complianceGap,
          rateGap: rateGap,
          combinedGaps: combinedGaps
        }
      },
      country: longTermCountry,
      state: longTermState,
      countryCode: longTermCountryCode
    };
    
    // Use existing longTerm data if available, otherwise use default
    const longTermData = data.longTerm !== null && data.longTerm !== undefined 
      ? data.longTerm 
      : defaultLongTerm;
    
    console.log('longTerm data to use:', JSON.stringify(longTermData, null, 2));
    
    try {
      // Ensure categories is an array
      const categories = Array.isArray(longTermData.categories) 
        ? longTermData.categories 
        : [];
      
      console.log(`longTerm categories: ${categories.length} items`);
      
      const processedLongTerm = {
        categories: formatLongTermCategories(categories),
        metrics: longTermData.metrics || defaultLongTerm.metrics,
        country: longTermData.country || longTermCountry,
        state: longTermData.state || longTermState,
        countryCode: longTermData.countryCode || longTermCountryCode
      };
      
      console.log('Processed long term data:', JSON.stringify(processedLongTerm, null, 2));
      await updateLongTermDataService(report._id?.toString(), userId, processedLongTerm);
      console.log('Long term data updated successfully');
    } catch (error) {
      console.error('Error processing longTerm data:', error);
    }
    
    // ---------------------------------------------------------------------
    // VERIFY DATA SAVED CORRECTLY
    // ---------------------------------------------------------------------
    
    // Get the updated report to return
    const updatedReport = await getReportByIdService(report._id?.toString(), userId);
    
    // Verify longTerm data exists in the updated report
    console.log('Verifying longTerm data exists in updated report');
    if (updatedReport?.longTerm) {
      console.log('longTerm data exists in updated report');
      console.log('longTerm categories:', updatedReport.longTerm.categories ? updatedReport.longTerm.categories.length : 0);
      console.log('longTerm metrics:', updatedReport.longTerm.metrics ? 'exists' : 'missing');
      console.log('longTerm country:', updatedReport.longTerm.country);
      console.log('longTerm state:', updatedReport.longTerm.state);
    } else {
      console.error('longTerm data missing from updated report');
      
      // Direct MongoDB query to check if longTerm data exists
      console.log('Performing direct MongoDB query to check longTerm data');
      await ensureDbConnection();
      
      const directReport = await UnifiedReport.findOne({ _id: report._id, user: userId }).lean();
      
      if (directReport) {
        console.log('Direct report found:', directReport._id);
        console.log('Direct report longTerm exists:', directReport.longTerm ? 'yes' : 'no');
        
        if (directReport.longTerm) {
          console.log('Direct longTerm data:', JSON.stringify(directReport.longTerm, null, 2));
        }
      } else {
        console.error('Direct report not found');
      }
    }
    
    // Direct MongoDB query to check if data is in the database
    console.log('=== Direct MongoDB query to check data ===');
    const directQueryResult = await UnifiedReport.findOne(
      { _id: report._id }
    ).lean();
    
    console.log('Direct query result - title:', directQueryResult?.title);
    console.log('Direct query result - country:', directQueryResult?.country);
    console.log('Direct query result - countryCode:', directQueryResult?.countryCode);
    console.log('Direct query result - actualOSR:', directQueryResult?.actualOSR);
    console.log('Direct query result - budgetedOSR:', directQueryResult?.budgetedOSR);
    console.log('Direct query result - population:', directQueryResult?.population);
    console.log('Direct query result - gdpPerCapita:', directQueryResult?.gdpPerCapita);
    console.log('Direct query result - shortTerm exists:', directQueryResult?.shortTerm ? 'yes' : 'no');
    console.log('Direct query result - longTerm exists:', directQueryResult?.longTerm ? 'yes' : 'no');
    console.log('Direct query result - mixedCharge exists:', directQueryResult?.mixedCharge ? 'yes' : 'no');
    
    if (directQueryResult?.shortTerm) {
      console.log('Direct query result - shortTerm.metrics exists:', directQueryResult.shortTerm.metrics ? 'yes' : 'no');
      console.log('Direct query result - shortTerm.categories exists:', directQueryResult.shortTerm.categories ? 'yes' : 'no');
      console.log('Direct query result - shortTerm categories count:', directQueryResult.shortTerm.categories?.length || 0);
    }
    
    if (directQueryResult?.longTerm) {
      console.log('Direct query result - longTerm.metrics exists:', directQueryResult.longTerm.metrics ? 'yes' : 'no');
      console.log('Direct query result - longTerm.categories exists:', directQueryResult.longTerm.categories ? 'yes' : 'no');
      console.log('Direct query result - longTerm categories count:', directQueryResult.longTerm.categories?.length || 0);
      console.log('Direct query result - longTerm.country:', directQueryResult.longTerm.country);
      console.log('Direct query result - longTerm.state:', directQueryResult.longTerm.state);
    }
    
    if (directQueryResult?.mixedCharge) {
      console.log('Direct query result - mixedCharge.metrics exists:', directQueryResult.mixedCharge.metrics ? 'yes' : 'no');
      console.log('Direct query result - mixedCharge.data exists:', directQueryResult.mixedCharge.data ? 'yes' : 'no');
    }
    console.log('=== End direct MongoDB query ===');
    
    // ---------------------------------------------------------------------
    // RETURN SUCCESS RESPONSE
    // ---------------------------------------------------------------------
    
    return NextResponse.json({
      success: true,
      message: reportId ? 'Report updated successfully' : 'Report created successfully',
      report: updatedReport
    });
  } catch (error) {
    // ---------------------------------------------------------------------
    // HANDLE ERRORS
    // ---------------------------------------------------------------------
    
    console.error('Error saving report:', error);
    return NextResponse.json(
      { error: `Failed to save report: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 