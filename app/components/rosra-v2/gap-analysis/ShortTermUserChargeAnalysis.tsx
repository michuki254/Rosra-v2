'use client';

import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useShortTerm } from '@/app/context/ShortTermContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { MainInputs } from './MainInputs';
import { CategorySection } from './CategorySection';
import { RevenueAnalysisChart } from './RevenueAnalysisChart';
import { RevenueSummaryCards } from './RevenueSummaryCards';
import { GapAnalysisChart } from './GapAnalysisChart';
import { useShortTermData } from '@/app/hooks/useShortTermData';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { ShortTermCategory } from '@/app/hooks/useShortTermCalculations';
import { useParams, useSearchParams } from 'next/navigation';
import { ShortTermCompleteData } from './GapAnalysis';

// Import the LOCAL_STORAGE_KEY constant from the hook
const LOCAL_STORAGE_KEY = 'shortTermAnalysisData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Update the props interface to include ref
interface ShortTermUserChargeAnalysisProps {
  onDataChange?: (data: any) => void;
  initialData?: any;
}

// Export the component with forwardRef
const ShortTermUserChargeAnalysis = forwardRef(({ onDataChange, initialData }: ShortTermUserChargeAnalysisProps, ref): React.ReactElement => {
  const {
    categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
    setCategories,
    totalEstimatedDailyFees,
    totalActualDailyFees,
    setTotalEstimatedDailyFees,
    setTotalActualDailyFees
  } = useShortTerm();

  const [showFormulas, setShowFormulas] = useState(false);
  const [showGapFormulas, setShowGapFormulas] = useState(false);

  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';
  const currency = selectedCountry?.currency || 'KES';
  const { data: session } = useSession();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract reportId from initialData, URL params, or search params
  const reportIdFromInitialData = initialData?._id || initialData?.reportId;
  const reportIdFromParams = params?.reportId as string;
  const reportIdFromSearch = searchParams?.get('reportId');
  
  // Use the first available reportId
  const reportId = reportIdFromInitialData || reportIdFromParams || reportIdFromSearch;
  
  console.log('ShortTermUserChargeAnalysis - Debug reportId sources:', {
    fromInitialData: reportIdFromInitialData,
    fromParams: reportIdFromParams,
    fromSearch: reportIdFromSearch,
    finalReportId: reportId,
    initialDataExists: !!initialData,
    initialDataKeys: initialData ? Object.keys(initialData) : [],
    initialDataRaw: initialData,
    initialDataId: initialData?._id,
    initialDataReportId: initialData?.reportId
  });

  // Use our hook for database operations with reportId
  const {
    data: savedData,
    loading: isLoading,
    error,
    isSaving,
    loadData,
    saveData
  } = useShortTermData({ providedReportId: reportId });
  
  // Add a ref to store the previous data
  const previousDataRef = useRef<any>(null);
  
  // Add a ref to track if data has been loaded
  const dataLoadedRef = useRef<boolean>(false);

  // Notify parent component of metrics changes only (no auto-save)
  useEffect(() => {
    // Create a complete data object that includes both metrics and raw data for saving
    const completeData: ShortTermCompleteData = {
      // Analysis metrics for display
      metrics: {
        totalEstimatedRevenue: Number(metrics.potential) || 0,
        totalActualRevenue: Number(metrics.actual) || 0,
        totalGap: Number(metrics.gap) || 0,
        potentialLeveraged: Number(metrics.potentialLeveraged) || 0,
        currencySymbol: currencySymbol || '$',
        gapBreakdown: {
          registrationGap: Number(metrics.gapBreakdown?.registrationGap) || 0,
          registrationGapPercentage: Number(metrics.gapBreakdown?.registrationGapPercentage) || 0,
          complianceGap: Number(metrics.gapBreakdown?.complianceGap) || 0,
          complianceGapPercentage: Number(metrics.gapBreakdown?.complianceGapPercentage) || 0,
          rateGap: Number(metrics.gapBreakdown?.rateGap) || 0,
          rateGapPercentage: Number(metrics.gapBreakdown?.rateGapPercentage) || 0,
          combinedGaps: Number(metrics.gapBreakdown?.combinedGaps) || 0,
          combinedGapsPercentage: Number(metrics.gapBreakdown?.combinedGapsPercentage) || 0
        },
        totalEstimatedDailyFees: Number(totalEstimatedDailyFees) || 0,
        totalActualDailyFees: Number(totalActualDailyFees) || 0
      },
      
      // Raw data for saving to database
      saveData: {
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          estimatedDailyFees: cat.estimatedDailyFees,
          actualDailyFees: cat.actualDailyFees,
          potentialRate: cat.potentialRate,
          actualRate: cat.actualRate,
          daysInYear: 365,
          isExpanded: cat.isExpanded
        })),
        totalEstimatedDailyFees: Number(totalEstimatedDailyFees) || 0,
        totalActualDailyFees: Number(totalActualDailyFees) || 0
      }
    };
    
    // Check if the data has actually changed before notifying parent
    if (JSON.stringify(completeData) !== JSON.stringify(previousDataRef.current)) {
      console.log('ShortTermUserChargeAnalysis sending data to parent:', completeData);
      
      // Pass the complete data to the parent component
      if (onDataChange) {
        onDataChange(completeData);
      }
      
      // Update the previous data reference
      previousDataRef.current = completeData;
    }
  }, [metrics, categories, onDataChange, totalEstimatedDailyFees, totalActualDailyFees, currencySymbol, selectedCountry]);

  // Update the clearAllCategories function
  const clearAllCategories = () => {
    // Instead of removing categories one by one, set an empty array directly
    setCategories([]);
  };

  // Modify the useEffect that loads data from savedData
  useEffect(() => {
    if (!isLoading && savedData && !dataLoadedRef.current) {
      console.log('Loading short term data from savedData:', savedData);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Clear existing categories before loading new ones
        clearAllCategories();
        
        // Update metrics if they exist in savedData
        if (savedData.metrics) {
          // Use type assertion to avoid TypeScript errors
          const metricsData = savedData.metrics as any;
          
          // No need to update metrics manually as they will be recalculated based on categories
        }
        
        // Load categories from savedData
        if (savedData.categories && Array.isArray(savedData.categories) && savedData.categories.length > 0) {
          console.log('Loading categories from savedData:', savedData.categories);
          
          // Map the saved categories to the format expected by the component
          const mappedCategories = savedData.categories.map((cat: any) => ({
            id: cat.id || crypto.randomUUID(),
            name: cat.name || 'Unnamed Category',
            estimatedDailyFees: cat.estimatedDailyFees || 0,
            actualDailyFees: cat.actualDailyFees || 0,
            potentialRate: cat.potentialRate || 0,
            actualRate: cat.actualRate || 0,
            isExpanded: false
          }));
          
          // Set all categories at once
          setCategories(mappedCategories);
        } else {
          console.log('No categories found in savedData, using default categories');
          
          // Set default categories
          const defaultCategories = [
            {
              id: crypto.randomUUID(),
              name: 'Parking Fees',
              estimatedDailyFees: 600,
              actualDailyFees: 500,
              potentialRate: 100,
              actualRate: 10,
              isExpanded: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Market Fees',
              estimatedDailyFees: 100,
              actualDailyFees: 50,
              potentialRate: 50,
              actualRate: 5,
              isExpanded: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Bus Park Fees',
              estimatedDailyFees: 300,
              actualDailyFees: 150,
              potentialRate: 150,
              actualRate: 20,
              isExpanded: false
            }
          ];
          
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Error loading short term data:', error);
        toast.error('Failed to load short term data');
      }
    }
  }, [isLoading, savedData, clearAllCategories, setCategories]);

  // Update the useEffect that loads initialData
  useEffect(() => {
    if (initialData && !dataLoadedRef.current) {
      console.log('Loading initial short term data:', initialData);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Clear existing categories before loading new ones
        clearAllCategories();
        
        // Check for saveData structure
        if (initialData.saveData) {
          // Update categories from saveData if available
          if (initialData.saveData.categories && initialData.saveData.categories.length > 0) {
            // Format categories to match the expected structure
            const formattedCategories = initialData.saveData.categories.map((cat: any) => ({
              id: cat.id || crypto.randomUUID(),
              name: cat.name || 'Unnamed Category',
              estimatedDailyFees: cat.estimatedDailyFees || 0,
              actualDailyFees: cat.actualDailyFees || 0,
              potentialRate: cat.potentialRate || 0,
              actualRate: cat.actualRate || 0,
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
            id: cat.id || crypto.randomUUID(),
            name: cat.name || 'Unnamed Category',
            estimatedDailyFees: cat.estimatedDailyFees || 0,
            actualDailyFees: cat.actualDailyFees || 0,
            potentialRate: cat.potentialRate || 0,
            actualRate: cat.actualRate || 0,
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
              name: 'Parking Fees',
              estimatedDailyFees: 600,
              actualDailyFees: 500,
              potentialRate: 100,
              actualRate: 10,
              isExpanded: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Market Fees',
              estimatedDailyFees: 100,
              actualDailyFees: 50,
              potentialRate: 50,
              actualRate: 5,
              isExpanded: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Bus Park Fees',
              estimatedDailyFees: 300,
              actualDailyFees: 150,
              potentialRate: 150,
              actualRate: 20,
              isExpanded: false
            }
          ];
          
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Error loading initial short term data:', error);
      }
    }
  }, [initialData, clearAllCategories, setCategories]);

  // Function to save data to the database
  const handleSaveData = async (): Promise<boolean> => {
    if (!session) {
      toast.error('Please sign in to save data');
      return false;
    }

    if (!reportId) {
      toast.error('Please save the main report first');
      return false;
    }

    try {
      console.log('=== START: handleSaveData ===');
      console.log('ReportId:', reportId);
      console.log('Session:', session?.user?.id);
      console.log('Categories:', categories);
      console.log('Metrics:', metrics);

      // Create a data object that matches the property tax structure
      const dataToSave = {
        metrics: {
          actual: Number(metrics.actual) || 0,
          potential: Number(metrics.potential) || 0,
          gap: Number(metrics.gap) || 0,
          potentialLeveraged: Number(metrics.potentialLeveraged) || 0,
          gapBreakdown: {
            registrationGap: Number(metrics.gapBreakdown?.registrationGap) || 0,
            registrationGapPercentage: Number(metrics.gapBreakdown?.registrationGapPercentage) || 0,
            complianceGap: Number(metrics.gapBreakdown?.complianceGap) || 0,
            complianceGapPercentage: Number(metrics.gapBreakdown?.complianceGapPercentage) || 0,
            rateGap: Number(metrics.gapBreakdown?.rateGap) || 0,
            rateGapPercentage: Number(metrics.gapBreakdown?.rateGapPercentage) || 0,
            combinedGaps: Number(metrics.gapBreakdown?.combinedGaps) || 0,
            combinedGapsPercentage: Number(metrics.gapBreakdown?.combinedGapsPercentage) || 0
          },
          totalEstimatedDailyFees: Number(totalEstimatedDailyFees) || 0,
          totalActualDailyFees: Number(totalActualDailyFees) || 0
        },
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          estimatedDailyFees: Number(cat.estimatedDailyFees) || 0,
          actualDailyFees: Number(cat.actualDailyFees) || 0,
          potentialRate: Number(cat.potentialRate) || 0,
          actualRate: Number(cat.actualRate) || 0,
          daysInYear: 365
        }))
      };

      console.log('Data to save:', JSON.stringify(dataToSave, null, 2));

      // Save to database
      console.log('Calling saveData...');
      const result = await saveData(dataToSave);
      console.log('Save result:', result);
      
      if (result) {
        console.log('Save successful, result:', result);
        toast.success('Short term data saved successfully');
        
        // Reset the data loaded flag to force a reload on next load
        dataLoadedRef.current = false;
        
        // Refresh the data to ensure we have the latest
        console.log('Reloading data...');
        await loadData();
        
        // Update the parent component with the latest data
        if (onDataChange) {
          const completeData = {
            metrics: dataToSave.metrics,
            categories: dataToSave.categories
          };
          console.log('Updating parent with latest data:', completeData);
          onDataChange(completeData);
        }
        
        console.log('=== END: handleSaveData - Success ===');
        return true;
      } else {
        console.warn('Save function returned falsy result:', result);
        toast.error('Failed to save data');
        console.log('=== END: handleSaveData - Failed ===');
        return false;
      }
      
    } catch (error) {
      console.error('Error saving short term data:', error);
      toast.error('Failed to save short term data');
      console.log('=== END: handleSaveData - Error ===');
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
        await loadData();
      } else {
        // If save failed but didn't throw an error
        toast.error('Category deleted but changes could not be saved');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to save changes after deleting category');
      
      // Refresh data to ensure UI is in sync with database
      loadData();
    }
  };

  const formatLargeNumber = (value: number): string => {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    
    let formattedNumber: string;
    if (absValue >= 1000000000) {
      formattedNumber = `${(absValue / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
      formattedNumber = `${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      formattedNumber = `${(absValue / 1000).toFixed(1)}K`;
    } else {
      formattedNumber = absValue.toString();
    }

    return isNegative ? `-${formattedNumber}` : formattedNumber;
  };

  const formatCurrency = (value: number): string => {
    return `${currencySymbol} ${formatLargeNumber(value)}`;
  };

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Actual Revenue',
        data: categories.map(cat => cat.actualDailyFees * cat.actualRate * 365),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Potential Revenue',
        data: categories.map(cat => cat.estimatedDailyFees * cat.potentialRate * 365),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `Amount (${currency})`,
        },
      },
    },
  };

  // Log metrics for debugging
  console.log('ShortTermUserChargeAnalysis metrics:', {
    metrics,
    actualRevenue: metrics.actual,
    totalGapShortTermFees: metrics.gap,
    complianceGap: metrics.gapBreakdown.complianceGap,
    rateGap: metrics.gapBreakdown.rateGap,
    combinedGaps: metrics.gapBreakdown.combinedGaps,
    totalPotentialRevenue: metrics.potential
  });

  const actualRevenue = metrics.actual;
  const totalGapShortTermFees = metrics.gap;
  const complianceGap = metrics.gapBreakdown.complianceGap;
  const rateGap = metrics.gapBreakdown.rateGap;
  const combinedGaps = metrics.gapBreakdown.combinedGaps;
  const totalPotentialRevenue = metrics.potential;

  // Expose the handleSaveData function to the parent component
  useImperativeHandle(ref, () => ({
    saveData: handleSaveData,
    getCurrentData: () => {
      // Return the current data in the same format as completeData
      return {
        metrics: {
          actual: metrics.actual,
          potential: metrics.potential,
          gap: metrics.gap,
          potentialLeveraged: metrics.potentialLeveraged,
          gapBreakdown: metrics.gapBreakdown,
          totalEstimatedDailyFees: metrics.totalEstimatedDailyFees,
          totalActualDailyFees: metrics.totalActualDailyFees
        },
        saveData: {
          categories: categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            estimatedDailyFees: cat.estimatedDailyFees,
            actualDailyFees: cat.actualDailyFees,
            potentialRate: cat.potentialRate,
            actualRate: cat.actualRate,
            daysInYear: 365,
            isExpanded: false
          })),
          totalEstimatedDailyFees: Number(totalEstimatedDailyFees) || 0,
          totalActualDailyFees: Number(totalActualDailyFees) || 0
        }
      };
    }
  }));

  // Initialize data and send to parent on component mount and when data changes
  useEffect(() => {
    console.log('Initializing data with:', {
      initialData,
      savedData,
      reportId
    });
    console.log('Categories in ShortTermUserChargeAnalysis:', categories);
    
    // Create a default data structure to ensure parent always has data
    const defaultData = {
      // This matches exactly how propertyTax data is structured
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        estimatedDailyFees: Number(cat.estimatedDailyFees) || 0,
        actualDailyFees: Number(cat.actualDailyFees) || 0,
        potentialRate: Number(cat.potentialRate) || 0,
        actualRate: Number(cat.actualRate) || 0,
        daysInYear: 365,
        isExpanded: cat.isExpanded || false
      })),
      totalEstimatedDailyFees: Number(totalEstimatedDailyFees) || 0,
      totalActualDailyFees: Number(totalActualDailyFees) || 0,
      country: selectedCountry?.name || 'Not specified',
      state: 'Not specified',
      metrics: {
        totalEstimatedRevenue: calculateTotalEstimatedRevenue(),
        totalActualRevenue: calculateTotalActualRevenue(),
        totalGap: calculateTotalEstimatedRevenue() - calculateTotalActualRevenue(),
        potentialLeveraged: calculateTotalActualRevenue() / (calculateTotalEstimatedRevenue() || 1) * 100,
        currencySymbol: currencySymbol,
        gapBreakdown: {
          registrationGap: Number(metrics.gapBreakdown?.registrationGap) || 0,
          registrationGapPercentage: Number(metrics.gapBreakdown?.registrationGapPercentage) || 0,
          complianceGap: Number(metrics.gapBreakdown?.complianceGap) || 0,
          complianceGapPercentage: Number(metrics.gapBreakdown?.complianceGapPercentage) || 0,
          rateGap: Number(metrics.gapBreakdown?.rateGap) || 0,
          rateGapPercentage: Number(metrics.gapBreakdown?.rateGapPercentage) || 0,
          combinedGaps: Number(metrics.gapBreakdown?.combinedGaps) || 0,
          combinedGapsPercentage: Number(metrics.gapBreakdown?.combinedGapsPercentage) || 0
        },
        totalEstimatedDailyFees: Number(totalEstimatedDailyFees) || 0,
        totalActualDailyFees: Number(totalActualDailyFees) || 0
      }
    };
    
    console.log('Initialized data in ShortTermUserChargeAnalysis:', defaultData);
    
    // Send the data to the parent component
    if (onDataChange) {
      console.log('Sending data to parent from ShortTermUserChargeAnalysis');
      onDataChange(defaultData);
    }
  }, [categories, totalEstimatedDailyFees, totalActualDailyFees, currencySymbol, selectedCountry, onDataChange, metrics]);

  // Helper functions to calculate totals
  const calculateTotalEstimatedRevenue = () => {
    return categories.reduce((total, category) => {
      return total + (category.estimatedDailyFees * 365);
    }, 0);
  };
  
  const calculateTotalActualRevenue = () => {
    return categories.reduce((total, category) => {
      return total + (category.actualDailyFees * 365);
    }, 0);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="md:w-1/3 space-y-4">
          <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            {/* Main Inputs */}
            <MainInputs 
              estimatedDailyFees={totalEstimatedDailyFees}
              actualDailyFees={totalActualDailyFees}
              onChange={(field, value) => {
                if (field === 'estimatedDailyFees') {
                  setTotalEstimatedDailyFees(value);
                } else {
                  setTotalActualDailyFees(value);
                }
                
                // Update all categories proportionally
                const ratio = value / (field === 'estimatedDailyFees' 
                  ? totalEstimatedDailyFees || 1
                  : totalActualDailyFees || 1);
                
                categories.forEach(cat => {
                  updateCategory(cat.id, field as keyof ShortTermCategory, 
                    field === 'estimatedDailyFees' 
                      ? cat.estimatedDailyFees * ratio
                      : cat.actualDailyFees * ratio
                  );
                });
              }}
            />

            {/* Categories Section */}
            <CategorySection
              categories={categories}
              addCategory={addCategory}
              handleCategoryNameChange={(id, value) => updateCategory(id, 'name', value)}
              handleCategoryInputChange={(id, field, value) => updateCategory(id, field as keyof ShortTermCategory, value)}
              toggleCategory={toggleCategory}
              deleteCategory={(index) => {
                const categoryId = categories[index].id;
                handleDeleteCategory(categoryId);
              }}
            />
          </div>
        </div>

        <div className="md:w-2/3 space-y-4">
          <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            {/* Revenue Analysis Chart */}
            <RevenueAnalysisChart
              actualRevenue={actualRevenue}
              totalGapShortTermFees={totalGapShortTermFees}
              totalPotentialRevenue={totalPotentialRevenue}
              percentage={metrics.gapBreakdown.registrationGapPercentage}
              chartOptions={chartOptions}
              showFormulas={showFormulas}
              setShowFormulas={setShowFormulas}
              formatCurrency={formatCurrency}
            />

            {/* Revenue Summary Cards */}
            <RevenueSummaryCards
              actualRevenue={actualRevenue}
              totalPotentialRevenue={totalPotentialRevenue}
              totalGapShortTermFees={totalGapShortTermFees}
              formatCurrency={formatCurrency}
            />

            {/* Gap Analysis Chart */}
            <GapAnalysisChart
              complianceGap={complianceGap}
              rateGap={rateGap}
              combinedGaps={combinedGaps}
              actualRevenue={actualRevenue}
              totalPotentialRevenue={totalPotentialRevenue}
              totalGapShortTermFees={totalGapShortTermFees}
              percentage={metrics.gapBreakdown.registrationGapPercentage}
              chartOptions={chartOptions}
              showGapFormulas={showGapFormulas}
              setShowGapFormulas={setShowGapFormulas}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </div>
      
      {/* Tooltips */}
      <ReactTooltip
        id="revenue-tooltip"
        place="top"
        className="max-w-xs text-sm bg-gray-900"
      />
      <ReactTooltip
        id="gap-tooltip"
        place="top"
        className="max-w-xs text-sm bg-gray-900"
      />
    </div>
  );
});

export default ShortTermUserChargeAnalysis;