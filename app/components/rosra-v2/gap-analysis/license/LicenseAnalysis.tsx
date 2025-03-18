'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLicense } from '@/app/context/LicenseContext';
import { LicenseAnalysisService } from '@/app/services/license-analysis.service';
import LicenseCategoryForm from './LicenseCategoryForm';
import GapAnalysisSummary from './GapAnalysisSummary';
import LicenseGapChart from './LicenseGapChart';
import GapAnalysisBreakdownChart from './GapAnalysisBreakdownChart';
import { Input } from '@/app/components/common/Input';
import GapAnalysisMessage from './GapAnalysisMessage';
import RevenuePerformanceMessage from './RevenuePerformanceMessage';
import RevenueSummary from './RevenueSummary';
import RevenueFormulas from './RevenueFormulas';
import GapFormulas from './GapFormulas';
import { useLicenseData } from '@/app/hooks/useLicenseData';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useCurrency } from '@/app/context/CurrencyContext';
import { Card } from '@/app/components/common/Card';
import { InputField } from '@/app/components/common/InputField';

// Define a new interface for the complete data object
interface LicenseCompleteData {
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
  };
  saveData: {
    totalEstimatedLicensees: number;
    categories: Array<{
      name: string;
      registeredLicensees: number;
      compliantLicensees: number;
      estimatedLicensees: number;
      licenseFee: number;
      averagePaidLicenseFee: number;
    }>;
  };
}

// Define a Category type
interface Category {
  name: string;
  registeredLicensees: number;
  compliantLicensees: number;
  estimatedLicensees: number;
  licenseFee: number;
  averagePaidLicenseFee: number;
}

// Update the props interface to include initialData
interface LicenseAnalysisProps {
  onMetricsChange?: (data: LicenseCompleteData) => void;
  initialData?: any;
  reportId?: string;
}

const LicenseAnalysis: React.FC<LicenseAnalysisProps> = ({ onMetricsChange, initialData, reportId }) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';
  const { data: session } = useSession();
  
  // Correctly use the useLicense hook
  const { 
    categories, 
    metrics, 
    totalEstimatedLicensees,
    setTotalEstimatedLicensees,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics,
    setCategories
  } = useLicense();
  
  // Correctly use the useLicenseData hook
  const { 
    data: savedData, 
    loading: isLoading,
    saveData,
    fetchData
  } = useLicenseData();
  
  const [isFormulaVisible, setIsFormulaVisible] = useState(false);
  const [isGapFormulaVisible, setIsGapFormulaVisible] = useState(false);
  const previousDataRef = useRef<any>(null);
  
  // Add a ref to track if data has been loaded
  const dataLoadedRef = useRef<boolean>(false);

  // Notify parent component of metrics changes
  useEffect(() => {
    // Create a complete data object that includes both metrics and raw data for saving
    const completeData: LicenseCompleteData = {
      // Analysis metrics for display
      metrics: {
        actual: metrics.actual,
        potential: metrics.potential,
        gap: metrics.gap,
        gapBreakdown: metrics.gapBreakdown,
        potentialLeveraged: metrics.potentialLeveraged
      },
      
      // Raw data for saving to database
      saveData: {
        totalEstimatedLicensees: totalEstimatedLicensees,
        categories: categories.map(cat => ({
          name: cat.name,
          registeredLicensees: cat.registeredLicensees,
          compliantLicensees: cat.compliantLicensees,
          estimatedLicensees: cat.estimatedLicensees,
          licenseFee: cat.licenseFee,
          averagePaidLicenseFee: cat.averagePaidLicenseFee
        }))
      }
    };
    
    // Check if the data has actually changed
    if (JSON.stringify(completeData) !== JSON.stringify(previousDataRef.current)) {
      console.log('LicenseAnalysis sending data to parent:', JSON.stringify(completeData, null, 2));
      
      // Pass the complete data to the parent component
      if (onMetricsChange) {
        onMetricsChange(completeData);
      }
      
      // Update the previous data
      previousDataRef.current = completeData;
    }
  }, [metrics, categories, totalEstimatedLicensees, onMetricsChange]);

  // Update the clearAllCategories function
  const clearAllCategories = () => {
    // Set an empty array directly
    setCategories([]);
  };

  // Modify the useEffect that loads data from savedData
  useEffect(() => {
    if (!isLoading && savedData && !dataLoadedRef.current) {
      console.log('Loading saved license data:', savedData);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Clear existing categories before loading new ones
        clearAllCategories();
        
        // Update total estimated licensees
        if (savedData.totalEstimatedLicensees) {
          setTotalEstimatedLicensees(savedData.totalEstimatedLicensees);
        }
        
        // Update metrics if they exist in savedData
        if (savedData.metrics) {
          // Use type assertion to avoid TypeScript errors
          const metricsData = savedData.metrics as any;
          
          updateMetrics('actual', metricsData.actual || 0);
          updateMetrics('potential', metricsData.potential || 0);
          updateMetrics('gap', metricsData.gap || 0);
          updateMetrics('potentialLeveraged', metricsData.potentialLeveraged || 0);
          
          if (metricsData.gapBreakdown) {
            updateMetrics('gapBreakdown', metricsData.gapBreakdown);
          }
        }
        
        // Convert saved categories to the format expected by the component
        if (savedData.categories && savedData.categories.length > 0) {
          // Map the saved categories to the format expected by the component
          const formattedCategories = savedData.categories.map((cat: any) => ({
            id: cat._id ? cat._id.toString() : crypto.randomUUID(),
            _id: cat._id ? cat._id.toString() : undefined,
            name: cat.name || 'Unnamed Category',
            registeredLicensees: cat.registeredLicensees || 0,
            compliantLicensees: cat.compliantLicensees || 0,
            estimatedLicensees: cat.estimatedLicensees || 0,
            licenseFee: cat.licenseFee || 0,
            averagePaidLicenseFee: cat.averagePaidLicenseFee || 0,
            isExpanded: false
          }));
          
          // Set all categories at once
          setCategories(formattedCategories);
        } else {
          console.log('No categories found in savedData, using default categories');
          
          // Set default categories
          const defaultCategories = [
            {
              id: crypto.randomUUID(),
              name: "Business Permits",
              registeredLicensees: 15001,
              compliantLicensees: 10000,
              estimatedLicensees: 700003,
              licenseFee: 353,
              averagePaidLicenseFee: 30,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Health Licenses",
              registeredLicensees: 3001,
              compliantLicensees: 2500,
              estimatedLicensees: 500034,
              licenseFee: 1534,
              averagePaidLicenseFee: 10,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Operating Licenses",
              registeredLicensees: 2004,
              compliantLicensees: 1500,
              estimatedLicensees: 5000,
              licenseFee: 1034,
              averagePaidLicenseFee: 53,
              isExpanded: false,
            }
          ];
          
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Error loading license data:', error);
        toast.error('Failed to load license data');
      }
    }
  }, [isLoading, savedData, setTotalEstimatedLicensees, updateMetrics, clearAllCategories, setCategories]);

  // Update the useEffect that loads initialData
  useEffect(() => {
    if (initialData && !dataLoadedRef.current) {
      console.log('Loading initial license data:', initialData);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Clear existing categories before loading new ones
        clearAllCategories();
        
        // Update metrics if available
        if (initialData.metrics) {
          // Use the metrics directly
          const { actual, potential, gap, potentialLeveraged, gapBreakdown } = initialData.metrics;
          
          // Update the metrics state
          updateMetrics('actual', actual || 0);
          updateMetrics('potential', potential || 0);
          updateMetrics('gap', gap || 0);
          updateMetrics('potentialLeveraged', potentialLeveraged || 0);
          
          if (gapBreakdown) {
            updateMetrics('gapBreakdown', gapBreakdown);
          }
        }
        
        // Update other fields if available
        if (initialData.totalEstimatedLicensees) {
          setTotalEstimatedLicensees(initialData.totalEstimatedLicensees);
        }
        
        // Check for saveData structure
        if (initialData.saveData) {
          // Update totalEstimatedLicensees from saveData if not already set
          if (initialData.saveData.totalEstimatedLicensees !== undefined && initialData.totalEstimatedLicensees === undefined) {
            setTotalEstimatedLicensees(initialData.saveData.totalEstimatedLicensees);
          }
          
          // Update categories from saveData if available
          if (initialData.saveData.categories && initialData.saveData.categories.length > 0) {
            // Format categories to match the expected structure
            const formattedCategories = initialData.saveData.categories.map((cat: any) => ({
              id: cat._id ? cat._id.toString() : crypto.randomUUID(),
              _id: cat._id ? cat._id.toString() : undefined,
              name: cat.name || 'Unnamed Category',
              registeredLicensees: cat.registeredLicensees || 0,
              compliantLicensees: cat.compliantLicensees || 0,
              estimatedLicensees: cat.estimatedLicensees || 0,
              licenseFee: cat.licenseFee || 0,
              averagePaidLicenseFee: cat.averagePaidLicenseFee || 0,
              isExpanded: false
            }));
            
            // Set all categories at once
            setCategories(formattedCategories);
            
            return; // Skip the direct categories loading if we've loaded from saveData
          }
        }
        
        // Update categories if available directly (only if not already loaded from saveData)
        if (initialData.categories && initialData.categories.length > 0) {
          // Format categories to match the expected structure
          const formattedCategories = initialData.categories.map((cat: any) => ({
            id: cat._id ? cat._id.toString() : crypto.randomUUID(),
            _id: cat._id ? cat._id.toString() : undefined,
            name: cat.name || 'Unnamed Category',
            registeredLicensees: cat.registeredLicensees || 0,
            compliantLicensees: cat.compliantLicensees || 0,
            estimatedLicensees: cat.estimatedLicensees || 0,
            licenseFee: cat.licenseFee || 0,
            averagePaidLicenseFee: cat.averagePaidLicenseFee || 0,
            isExpanded: false
          }));
          
          // Set all categories at once
          setCategories(formattedCategories);
        } else {
          console.log('No categories found in initialData, using default categories');
          
          // Set default categories
          const defaultCategories = [
            {
              id: crypto.randomUUID(),
              name: "Business Permits",
              registeredLicensees: 15001,
              compliantLicensees: 10000,
              estimatedLicensees: 700003,
              licenseFee: 353,
              averagePaidLicenseFee: 30,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Health Licenses",
              registeredLicensees: 3001,
              compliantLicensees: 2500,
              estimatedLicensees: 500034,
              licenseFee: 1534,
              averagePaidLicenseFee: 10,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Operating Licenses",
              registeredLicensees: 2004,
              compliantLicensees: 1500,
              estimatedLicensees: 5000,
              licenseFee: 1034,
              averagePaidLicenseFee: 53,
              isExpanded: false,
            }
          ];
          
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Error loading initial license data:', error);
      }
    }
  }, [initialData, updateMetrics, setTotalEstimatedLicensees, clearAllCategories, setCategories]);

  const handleAddCategory = () => {
    // Use the addCategory function from the context
    // This will properly update the categories in the context state
    addCategory();
  };

  // Function to save data to the database
  const handleSaveData = async (): Promise<boolean> => {
    if (!session) {
      toast.error('Please sign in to save data');
      return false;
    }

    try {
      // Calculate potentialLeveraged
      const potentialLeveraged = metrics.potential > 0 
        ? (metrics.actual / metrics.potential) * 100 
        : 0;

      // Log the current state before saving
      console.log('Current metrics before saving:', metrics);
      console.log('Current categories before saving:', categories);

      // Create the data object to save
      const dataToSave = {
        // Ensure these fields are explicitly included at the top level
        totalEstimatedLicensees: totalEstimatedLicensees || 0,
        categories: categories.map(cat => {
          // Create a clean category object for saving
          const categoryToSave: any = {
            name: cat.name,
            registeredLicensees: cat.registeredLicensees,
            compliantLicensees: cat.compliantLicensees,
            estimatedLicensees: cat.estimatedLicensees,
            licenseFee: cat.licenseFee,
            averagePaidLicenseFee: cat.averagePaidLicenseFee
          };
          
          // Only include _id if it's a MongoDB ObjectId (doesn't contain hyphens)
          if (cat._id && !cat._id.includes('-')) {
            categoryToSave._id = cat._id;
          } else if (cat.id && !cat.id.includes('-')) {
            categoryToSave._id = cat.id;
          }
          
          return categoryToSave;
        }),
        metrics: {
          actual: metrics.actual,
          potential: metrics.potential,
          gap: metrics.gap,
          potentialLeveraged: potentialLeveraged,
          gapBreakdown: metrics.gapBreakdown
        }
      };

      console.log('Saving license data:', JSON.stringify(dataToSave, null, 2));

      // Save to database
      const result = await saveData(dataToSave);
      
      if (result) {
        toast.success('License data saved successfully');
        
        // Reset the data loaded flag to force a reload on next load
        dataLoadedRef.current = false;
        
        // Refresh the data to ensure we have the latest
        await fetchData();
        
        // Call onMetricsChange with the saved data
        if (onMetricsChange) {
          onMetricsChange({
            metrics: {
              actual: dataToSave.metrics.actual,
              potential: dataToSave.metrics.potential,
              gap: dataToSave.metrics.gap,
              potentialLeveraged: dataToSave.metrics.potentialLeveraged,
              gapBreakdown: dataToSave.metrics.gapBreakdown
            },
            saveData: dataToSave
          });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving license data:', error);
      toast.error('Failed to save license data');
      return false;
    }
  };

  // Function to handle category deletion and save changes
  const handleDeleteCategory = async (id: string) => {
    try {
      // Delete the category from the context state
      deleteCategory(id);
      
      if (!reportId) {
        // If there's no reportId, we're working with local storage only
        toast.success('Category deleted');
        return;
      }
      
      // Save the changes to the database
      const saveResult = await handleSaveData();
      
      if (saveResult) {
        // Show success message
        toast.success('Category deleted and changes saved');
        
        // Refresh data to ensure UI is in sync with database
        dataLoadedRef.current = false;
        await fetchData();
      } else {
        // If save failed but didn't throw an error
        toast.error('Category deleted but changes could not be saved');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to save changes after deleting category');
      
      // Refresh data to ensure UI is in sync with database
      fetchData();
    }
  };

  // Add a useEffect to log metrics whenever they change
  useEffect(() => {
    console.log('Current metrics state:', {
      actual: metrics.actual,
      potential: metrics.potential,
      gap: metrics.gap,
      potentialLeveraged: metrics.potentialLeveraged,
      gapBreakdown: metrics.gapBreakdown
    });
  }, [metrics]);

  // Modify the useEffect that recalculates metrics
  useEffect(() => {
    console.log('Recalculating metrics based on categories:', categories);
    
    // Calculate actual revenue
    const actual = categories.reduce((total, category) => {
      return total + (category.compliantLicensees * category.averagePaidLicenseFee);
    }, 0);
    
    // Calculate potential revenue
    const categoryRevenue = categories.reduce((total, category) => {
      return total + (category.estimatedLicensees * category.licenseFee);
    }, 0);
    
    const totalRegistered = categories.reduce((sum, cat) => sum + cat.registeredLicensees, 0);
    const unregisteredLicensees = Math.max(0, totalEstimatedLicensees - totalRegistered);
    const averageLicenseFee = categories.length > 0
      ? categories.reduce((sum, cat) => sum + cat.licenseFee, 0) / categories.length
      : 0;
    
    const potential = categoryRevenue + (unregisteredLicensees * averageLicenseFee);
    
    // Calculate gap
    const gap = Math.max(0, potential - actual);
    
    // Calculate potentialLeveraged
    const potentialLeveraged = potential > 0 ? (actual / potential) * 100 : 0;
    
    // Calculate gap breakdown
    const registrationGap = Math.max(0, (totalEstimatedLicensees - totalRegistered) * averageLicenseFee);
    
    const complianceGap = categories.reduce((sum, category) => {
      const complianceDiff = Math.max(0, category.registeredLicensees - category.compliantLicensees);
      return sum + (complianceDiff * category.averagePaidLicenseFee);
    }, 0);
    
    const assessmentGap = categories.reduce((sum, category) => {
      const estimatedRevenue = category.estimatedLicensees * category.averagePaidLicenseFee;
      const compliantRevenue = category.compliantLicensees * category.averagePaidLicenseFee;
      const categoryComplianceGap = Math.max(0, category.registeredLicensees - category.compliantLicensees) * category.averagePaidLicenseFee;
      return sum + Math.max(0, estimatedRevenue - compliantRevenue - categoryComplianceGap);
    }, 0);
    
    const combinedGaps = Math.max(0, gap - (registrationGap + complianceGap + assessmentGap));
    
    // Update metrics
    updateMetrics('actual', actual);
    updateMetrics('potential', potential);
    updateMetrics('gap', gap);
    updateMetrics('potentialLeveraged', potentialLeveraged);
    updateMetrics('gapBreakdown', {
      registrationGap,
      complianceGap,
      assessmentGap,
      rateGap: 0, // Not applicable for licenses
      combinedGaps
    });
    
    console.log('Updated metrics:', {
      actual,
      potential,
      gap,
      potentialLeveraged,
      gapBreakdown: {
        registrationGap,
        complianceGap,
        assessmentGap,
        combinedGaps
      }
    });
  }, [categories, totalEstimatedLicensees, updateMetrics]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Column - Input Section */}
      <div className="lg:w-1/3 space-y-4">
        <Card>
          {/* Total Estimated Licensees Input */}
          <div className="space-y-4">
            <InputField
              label="Total estimated No of Licensees"
              value={totalEstimatedLicensees}
              onChange={(value) => {
                setTotalEstimatedLicensees(parseInt(value) || 0);
              }}
              type="number"
              min={0}
              step={1}
            />
          </div>

          {/* Categories Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h3>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>
            </div>

            <div className="space-y-3">
              <LicenseCategoryForm
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={(id, field, value) => {
                  updateCategory(id, field, value);
                }}
                onDeleteCategory={handleDeleteCategory}
                onToggleCategory={(id) => {
                  toggleCategory(id);
                }}
              />
            </div>
          </div>

          {/* Add a note about saving */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            All data is saved automatically when you click the "Save Report" button at the top of the page.
          </div>
        </Card>
      </div>

      {/* Right Column - Analysis Section */}
      <div className="lg:w-2/3 space-y-4">
        <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          {/* License Gap Chart */}
          <div className="mb-8">
            <LicenseGapChart
              actual={metrics.actual}
              gap={metrics.gap}
            />
          </div>
        
          {/* Revenue Performance Text */}
          <div className="mb-8">
            <RevenueFormulas />
          </div>
        
          {/* Summary Cards */}
          <div className="mb-8">
            <RevenueSummary
              actualRevenue={metrics.actual}
              potentialRevenue={metrics.potential}
              totalGap={metrics.gap}
            />
          </div>
          <div className="mb-8">
            <h4 className="text-base font-medium text-gray-900 mb-3">Revenue Performance Analysis</h4>
            <RevenuePerformanceMessage
              actualRevenue={metrics.actual}
              potentialRevenue={metrics.potential}
              potentialLeveraged={metrics.potentialLeveraged}
            />
          </div>

          {/* Gap Analysis Breakdown */}
          <div className="mb-8">
            <GapAnalysisBreakdownChart
              registrationGap={metrics.gapBreakdown.registrationGap}
              complianceGap={metrics.gapBreakdown.complianceGap}
              assessmentGap={metrics.gapBreakdown.assessmentGap}
              combinedGaps={metrics.gapBreakdown.combinedGaps}
            />
          </div>
        
          {/* Gap Analysis Section */}
          <div className="mb-8">
            <GapFormulas />
          </div>
          <div className="mb-8">
            <GapAnalysisSummary
              registrationGap={metrics.gapBreakdown.registrationGap}
              complianceGap={metrics.gapBreakdown.complianceGap}
              assessmentGap={metrics.gapBreakdown.assessmentGap}
              combinedGaps={metrics.gapBreakdown.combinedGaps}
            />
          </div>
          <div className="mb-8">
            <h4 className="text-base font-medium text-gray-900 mb-3">Gap Analysis</h4>
            <GapAnalysisMessage
              registrationGap={metrics.gapBreakdown.registrationGap}
              complianceGap={metrics.gapBreakdown.complianceGap}
              assessmentGap={metrics.gapBreakdown.assessmentGap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseAnalysis;
