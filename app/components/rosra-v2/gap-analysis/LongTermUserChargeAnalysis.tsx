'use client';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useLongTerm } from '@/app/context/LongTermContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { MainInputs } from './MainInputs';
import { CategorySection } from './CategorySection';
import LongTermGapAnalysisChart from './LongTermGapAnalysisChart';
import LongTermRevenueAnalysisChart from './LongTermRevenueAnalysisChart';
import { RevenueSummaryCards } from './RevenueSummaryCards';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLongTermData } from '@/app/hooks/useLongTermData';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LongTermUserChargeAnalysisProps {
  onMetricsChange?: (metrics: any) => void;
  initialData?: any;
}

const LongTermUserChargeAnalysis = forwardRef<any, LongTermUserChargeAnalysisProps>(({ onMetricsChange, initialData }, ref) => {
  const {
    categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics
  } = useLongTerm();

  const [showFormulas, setShowFormulas] = useState(false);
  const [showGapFormulas, setShowGapFormulas] = useState(false);
  const [showRevenueFormulas, setShowRevenueFormulas] = useState(false);
  const dataLoadedRef = useRef<boolean>(false);

  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';
  const currency = selectedCountry?.currency || 'KES';
  const { data: session } = useSession();

  // Use the useLongTermData hook
  const { 
    data: savedData, 
    loading: isLoading,
    saveData,
    loadData
  } = useLongTermData({ providedReportId: initialData?.reportId });

  // Log initialData for debugging
  useEffect(() => {
    console.log('LongTermUserChargeAnalysis - initialData:', initialData);
    console.log('LongTermUserChargeAnalysis - reportId from initialData:', initialData?.reportId);
    
    // Check if initialData has changed from undefined to a value
    if (initialData && !dataLoadedRef.current) {
      console.log('LongTermUserChargeAnalysis - initialData changed from undefined to a value');
      console.log('LongTermUserChargeAnalysis - forcing reload of data');
      
      // Force reload data
      dataLoadedRef.current = false;
      loadData();
    }
  }, [initialData, loadData]);

  // Add a debug function to log API endpoint information
  const logApiEndpointInfo = () => {
    const reportId = initialData?.reportId;
    console.log('API Endpoint Information:');
    console.log(`- Component: LongTermUserChargeAnalysis`);
    console.log(`- ReportId: ${reportId || 'Not available'}`);
    console.log(`- API Endpoint: ${reportId ? `/api/unified-reports/${reportId}/long-term` : 'Using local storage'}`);
    console.log(`- Data will be saved to: ${reportId ? 'Database via unified-reports API' : 'Local storage'}`);
    
    toast.success('API endpoint info logged to console');
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    saveData: handleSaveData
  }));

  // Function to save data to the database
  const handleSaveData = async (): Promise<boolean> => {
    if (!session) {
      toast.error('Please sign in to save data');
      return false;
    }

    try {
      // Log the current state before saving
      console.log('Current metrics before saving:', metrics);
      console.log('Current categories before saving:', categories);
      console.log('ReportId available for saving:', initialData?.reportId);

      // Check if reportId is available
      if (!initialData?.reportId) {
        console.warn('No reportId available for saving. Data will be saved to local storage only.');
        toast.custom((t) => (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-yellow-700">No report selected. Data will be saved to local storage only.</span>
            </div>
          </div>
        ), { duration: 4000 });
      } else {
        console.log(`Using API endpoint: /api/unified-reports/${initialData.reportId}/long-term`);
      }

      // Calculate potentialLeveraged
      const potentialLeveraged = metrics.potential > 0 
        ? (metrics.actual / metrics.potential) * 100 
        : 0;

      // Create the data object to save
      const dataToSave = {
        metrics: {
          actual: metrics.actual,
          potential: metrics.potential,
          gap: metrics.gap,
          potentialLeveraged: potentialLeveraged,
          gapBreakdown: metrics.gapBreakdown
        },
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          estimatedLeases: cat.estimatedLeases,
          registeredLeases: cat.registeredLeases,
          potentialRate: cat.potentialRate,
          actualRate: cat.actualRate,
          isExpanded: cat.isExpanded
        })),
        country: selectedCountry?.name || 'Not specified',
        state: 'Not specified'
      };

      console.log('Saving long term data:', JSON.stringify(dataToSave, null, 2));

      // Save to database or local storage
      const result = await saveData(dataToSave);
      console.log('Save result:', result);
      
      if (result) {
        if (initialData?.reportId) {
          toast.success('Long term data saved successfully to database');
        } else {
          toast.success('Long term data saved to local storage');
        }
        
        // Reset the data loaded flag to force a reload on next load
        dataLoadedRef.current = false;
        
        // Refresh the data to ensure we have the latest
        await loadData();
        
        // Call onMetricsChange with the saved data
        if (onMetricsChange) {
          onMetricsChange({
            metrics: {
              ...dataToSave.metrics
            },
            saveData: dataToSave
          });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving long term data:', error);
      toast.error('Failed to save long term data');
      return false;
    }
  };

  // Function to handle category deletion and save changes
  const handleDeleteCategory = async (id: string) => {
    try {
      // Delete the category from the context state
      deleteCategory(id);
      
      if (!initialData?.reportId) {
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

  // Load data from initialData or savedData
  useEffect(() => {
    if ((initialData || savedData) && !dataLoadedRef.current) {
      const dataToLoad = initialData || savedData;
      console.log('Loading long term data:', dataToLoad);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Load categories if available
        if (dataToLoad.categories && dataToLoad.categories.length > 0) {
          const formattedCategories = dataToLoad.categories.map((cat: any) => ({
            id: cat.id || crypto.randomUUID(),
            name: cat.name || 'Unnamed Category',
            estimatedLeases: Number(cat.estimatedLeases) || 0,
            registeredLeases: Number(cat.registeredLeases) || 0,
            potentialRate: Number(cat.potentialRate) || 0,
            actualRate: Number(cat.actualRate) || 0,
            isExpanded: false // Always set to false regardless of saved state
          }));
          
          // Update the context with the loaded categories
          formattedCategories.forEach((cat: any) => {
            // Check if category already exists
            const existingCat = categories.find(c => c.id === cat.id);
            if (existingCat) {
              // Update existing category
              Object.keys(cat).forEach(key => {
                if (key !== 'id') {
                  updateCategory(cat.id, key as any, cat[key]);
                }
              });
            } else {
              // Add new category
              addCategory();
              // Update the newly added category
              const newCat = categories[categories.length - 1];
              Object.keys(cat).forEach(key => {
                if (key !== 'id') {
                  updateCategory(newCat.id, key as any, cat[key]);
                }
              });
            }
          });
        } else {
          console.log('No categories found in data, using default categories');
          
          // Set default categories
          const defaultCategories = [
            {
              id: crypto.randomUUID(),
              name: "Residential Leases",
              estimatedLeases: 5000,
              registeredLeases: 3000,
              potentialRate: 1200,
              actualRate: 800,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Commercial Leases",
              estimatedLeases: 2000,
              registeredLeases: 1500,
              potentialRate: 2500,
              actualRate: 1800,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Agricultural Leases",
              estimatedLeases: 1500,
              registeredLeases: 800,
              potentialRate: 900,
              actualRate: 600,
              isExpanded: false,
            }
          ];
          
          // Add default categories
          defaultCategories.forEach(cat => {
            addCategory();
            // Update the newly added category
            const newCat = categories[categories.length - 1];
            Object.keys(cat).forEach(key => {
              if (key !== 'id') {
                updateCategory(newCat.id, key as any, cat[key as keyof typeof cat]);
              }
            });
          });
        }
        
        // Load metrics if available
        if (dataToLoad.metrics) {
          // Update metrics in the context
          updateMetrics('actual', Number(dataToLoad.metrics.actual) || 0);
          updateMetrics('potential', Number(dataToLoad.metrics.potential) || 0);
          updateMetrics('gap', Number(dataToLoad.metrics.gap) || 0);
          updateMetrics('potentialLeveraged', Number(dataToLoad.metrics.potentialLeveraged) || 0);
          
          if (dataToLoad.metrics.gapBreakdown) {
            updateMetrics('gapBreakdown', {
              registrationGapPercentage: Number(dataToLoad.metrics.gapBreakdown.registrationGapPercentage) || 0,
              complianceGap: Number(dataToLoad.metrics.gapBreakdown.complianceGap) || 0,
              rateGap: Number(dataToLoad.metrics.gapBreakdown.rateGap) || 0,
              combinedGaps: Number(dataToLoad.metrics.gapBreakdown.combinedGaps) || 0
            });
          }
        }
      } catch (error) {
        console.error('Error loading long term data:', error);
        toast.error('Failed to load long term data');
      }
    }
  }, [initialData, savedData, categories, addCategory, updateCategory, updateMetrics]);

  // Notify parent component of metrics changes
  useEffect(() => {
    if (onMetricsChange) {
      const completeData = {
        metrics: {
          actual: metrics.actual,
          potential: metrics.potential,
          gap: metrics.gap,
          potentialLeveraged: metrics.potentialLeveraged,
          gapBreakdown: metrics.gapBreakdown
        },
        saveData: {
          categories: categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            estimatedLeases: cat.estimatedLeases,
            registeredLeases: cat.registeredLeases,
            potentialRate: cat.potentialRate,
            actualRate: cat.actualRate,
            isExpanded: cat.isExpanded
          })),
          country: selectedCountry?.name || 'Not specified',
          state: 'Not specified'
        }
      };
      
      console.log('LongTermUserChargeAnalysis sending data to parent:', JSON.stringify(completeData, null, 2));
      onMetricsChange(completeData);
    }
  }, [metrics, categories, onMetricsChange, selectedCountry]);

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

  // Map long-term categories to the format expected by CategorySection
  const mappedCategories = categories.map(cat => ({
    ...cat,
    estimatedDailyFees: cat.estimatedLeases,
    actualDailyFees: cat.registeredLeases,
    isExpanded: false // Force all categories to be collapsed in the UI
  }));

  const handleCategoryInputChange = (id: string, field: string, value: number) => {
    // Map the CategorySection fields back to LongTerm fields
    const fieldMapping: { [key: string]: string } = {
      'estimatedDailyFees': 'estimatedLeases',
      'actualDailyFees': 'registeredLeases',
      'potentialRate': 'potentialRate',
      'actualRate': 'actualRate'
    };

    updateCategory(id, fieldMapping[field] as any, value);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Long-term Revenue Analysis',
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

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="md:w-1/3 space-y-4">
          <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            {/* Main Inputs */}
            <MainInputs 
              estimatedDailyFees={categories.reduce((sum, cat) => sum + cat.estimatedLeases, 0)}
              actualDailyFees={categories.reduce((sum, cat) => sum + cat.registeredLeases, 0)}
              onChange={(field, value) => {
                // Update all categories proportionally
                const ratio = value / (field === 'estimatedDailyFees' 
                  ? categories.reduce((sum, cat) => sum + cat.estimatedLeases, 0) || 1
                  : categories.reduce((sum, cat) => sum + cat.registeredLeases, 0) || 1);
                
                categories.forEach(cat => {
                  updateCategory(cat.id, 
                    field === 'estimatedDailyFees' ? 'estimatedLeases' : 'registeredLeases', 
                    field === 'estimatedDailyFees' 
                      ? cat.estimatedLeases * ratio
                      : cat.registeredLeases * ratio
                  );
                });
              }}
            />

            {/* Categories Section */}
            <CategorySection
              categories={mappedCategories}
              addCategory={addCategory}
              handleCategoryNameChange={(id, value) => updateCategory(id, 'name', value)}
              handleCategoryInputChange={handleCategoryInputChange}
              toggleCategory={toggleCategory}
              deleteCategory={handleDeleteCategory}
            />

            {/* Add a save button */}
            <div className="mt-4">
              <button
                onClick={handleSaveData}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Long Term Data
              </button>
            </div>
            
            {/* Debug button - only visible in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    console.log('Current metrics:', metrics);
                    console.log('Current categories:', categories);
                    console.log('Saved data:', savedData);
                    
                    // Check local storage
                    if (typeof window !== 'undefined') {
                      const localData = localStorage.getItem('longTermAnalysisData');
                      console.log('Local storage data:', localData ? JSON.parse(localData) : 'None');
                    }
                    
                    // Create the complete data object that would be sent to the parent
                    const completeData = {
                      metrics: {
                        actual: metrics.actual,
                        potential: metrics.potential,
                        gap: metrics.gap,
                        potentialLeveraged: metrics.potentialLeveraged,
                        gapBreakdown: metrics.gapBreakdown
                      },
                      saveData: {
                        categories: categories.map(cat => ({
                          id: cat.id,
                          name: cat.name,
                          estimatedLeases: cat.estimatedLeases,
                          registeredLeases: cat.registeredLeases,
                          potentialRate: cat.potentialRate,
                          actualRate: cat.actualRate,
                          isExpanded: cat.isExpanded
                        })),
                        country: selectedCountry?.name || 'Not specified',
                        state: 'Not specified'
                      }
                    };
                    
                    console.log('Complete data for parent:', JSON.stringify(completeData, null, 2));
                    logApiEndpointInfo();
                    
                    // Force reload data
                    dataLoadedRef.current = false;
                    loadData();
                  }}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm"
                >
                  Debug: Log Data & API Info
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-2/3 space-y-4">
          <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
               

                {/* Revenue Analysis Chart */}
                <LongTermRevenueAnalysisChart
                  actualRevenue={metrics.actual}
                  totalPotentialRevenue={metrics.potential}
                  totalGapLongTermFees={metrics.gap}
                  percentage={metrics.gapBreakdown.registrationGapPercentage}
                  chartOptions={chartOptions}
                  formatCurrency={formatCurrency}
                />
    {/* Gap Analysis Formula Section */}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <button
                      onClick={() => setShowGapFormulas(!showGapFormulas)}
                      className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                        <span>Long-term user charge Gap Analysis Formulas</span>
                      </div>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                          showGapFormulas ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {showGapFormulas && (
                      <div className="mt-3 space-y-3 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <h4 className="font-medium text-gray-500 mb-2">Compliance Gap</h4>
                          <div className="pl-3 border-l-2 border-gray-500">
                            <p className="text-gray-600 dark:text-gray-400">Revenue loss due to difference between estimated and actual number of leasees</p>
                            <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                              <span className="text-purple-600 dark:text-purple-400">Compliance Gap</span> = Σ [(<span className="text-green-600 dark:text-green-400">Estimated Monthly Leasees</span> - <span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span>) × <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>]
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <h4 className="font-medium text-gray-500 mb-2">Rate Gap</h4>
                          <div className="pl-3 border-l-2 border-gray-500">
                            <p className="text-gray-600 dark:text-gray-400">Revenue loss due to difference between potential and actual rates</p>
                            <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                              <span className="text-purple-600 dark:text-purple-400">Rate Gap</span> = Σ [<span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span> × (<span className="text-green-600 dark:text-green-400">Potential Rate</span> - <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>)]
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <h4 className="font-medium text-gray-500 mb-2">Combined Gaps</h4>
                          <div className="pl-3 border-l-2 border-gray-500">
                            <p className="text-gray-600 dark:text-gray-400">Revenue loss from both compliance and rate gaps combined</p>
                            <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                              <span className="text-purple-600 dark:text-purple-400">Combined Gaps</span> = Σ [(<span className="text-green-600 dark:text-green-400">Estimated Monthly Leasees</span> - <span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span>) × (<span className="text-green-600 dark:text-green-400">Potential Rate</span> - <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>)]
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

 {/* Revenue Summary Cards */}
 <div className="grid grid-cols-3 gap-6 mt-8">
                  {/* Actual Revenue Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                    <h3 className="text-gray-600 dark:text-gray-400 text-base">Actual Revenue</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(metrics.actual)}
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Current collected revenue</p>
                  </div>

                  {/* Total Potential Revenue Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-green-500 shadow-sm">
                    <h3 className="text-gray-600 dark:text-gray-400 text-base">Total Potential Revenue</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(metrics.potential)}
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">Maximum possible revenue</p>
                  </div>

                  {/* Total Gap Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
                    <h3 className="text-gray-600 dark:text-gray-400 text-base">Total Gap</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(Math.abs(metrics.gap))}
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">Revenue improvement potential</p>
                  </div>
                </div>

                {/* Revenue Analysis Text */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      Revenue Performance Analysis
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {metrics.gapBreakdown.registrationGapPercentage < 30 ? (
                          <span>
                            The Long-term User Charge Revenue Collection faces a <span className="text-red-600 dark:text-red-400">significant challenge</span> as the percentage 
                            of potential leveraged revenue falls <span className="text-red-600 dark:text-red-400">below 30%</span> at the value <span className="text-red-600 dark:text-red-400">
                            {metrics.gapBreakdown.registrationGapPercentage.toFixed(2)}%</span>. This indicates a <span className="text-gray-900 dark:text-white font-medium">substantial gap</span> between 
                            the revenue collected ({formatCurrency(metrics.actual)}) and the total estimated potential revenue ({formatCurrency(metrics.potential)}). 
                            To close the gap, a <span className="text-gray-900 dark:text-white font-medium">comprehensive analysis</span> of existing revenue channels and pricing structures may be required.
                          </span>
                        ) : metrics.gapBreakdown.registrationGapPercentage >= 30 && metrics.gapBreakdown.registrationGapPercentage < 70 ? (
                          <span>
                            The Long-term User Charge Revenue Collection shows <span className="text-yellow-600 dark:text-yellow-400">moderate performance</span> with <span className="text-yellow-600 dark:text-yellow-400">
                            {metrics.gapBreakdown.registrationGapPercentage.toFixed(2)}%</span> of potential revenue being leveraged. While this indicates <span className="text-gray-900 dark:text-white font-medium">some success</span> in 
                            revenue collection ({formatCurrency(metrics.actual)} out of {formatCurrency(metrics.potential)}), there remains <span className="text-gray-900 dark:text-white font-medium">room for improvement</span>. 
                            Strategic initiatives to optimize revenue collection processes could help bridge the remaining gap.
                          </span>
                        ) : (
                          <span>
                            The Long-term User Charge Revenue Collection demonstrates <span className="text-green-600 dark:text-green-400">strong performance</span> with <span className="text-green-600 dark:text-green-400">
                            {metrics.gapBreakdown.registrationGapPercentage.toFixed(2)}%</span> of potential revenue being leveraged. This <span className="text-gray-900 dark:text-white font-medium">high percentage</span> indicates 
                            effective revenue collection practices, with {formatCurrency(metrics.actual)} collected out of a potential {formatCurrency(metrics.potential)}. 
                            Maintaining current strategies while monitoring for optimization opportunities is recommended.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
{/* Gap Analysis Chart */}
<LongTermGapAnalysisChart
                  complianceGap={metrics.gapBreakdown.complianceGap}
                  rateGap={metrics.gapBreakdown.rateGap}
                  combinedGaps={metrics.gapBreakdown.combinedGaps}
                  actualRevenue={metrics.actual}
                  totalPotentialRevenue={metrics.potential}
                  totalGapLongTermFees={metrics.gap}
                  percentage={metrics.gapBreakdown.registrationGapPercentage}
                  chartOptions={chartOptions}
                  formatCurrency={formatCurrency}
                />

           

               {/* Formula Sections */}
               <div className="space-y-6 mt-8">
              

              {/* Revenue Formula Section */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <button
                  onClick={() => setShowRevenueFormulas(!showRevenueFormulas)}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                    <span>Long-term User Charge Breakdown Analysis Formulas</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                      showRevenueFormulas ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {showRevenueFormulas && (
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <h4 className="font-medium text-gray-500 mb-2">Actual Revenue</h4>
                      <div className="pl-3 border-l-2 border-gray-500">
                        <p className="text-gray-600 dark:text-gray-400">Sum of (Actual Monthly Leasees × Actual Rate) for each category</p>
                        <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                          <span className="text-purple-600 dark:text-purple-400">Actual Revenue</span> = Σ (<span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span> × <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>)
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <h4 className="font-medium text-gray-500 mb-2">Potential Revenue</h4>
                      <div className="pl-3 border-l-2 border-gray-500">
                        <p className="text-gray-600 dark:text-gray-400">Sum of (Estimated Monthly Leasees × Potential Rate) for each category</p>
                        <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                          <span className="text-purple-600 dark:text-purple-400">Potential Revenue</span> = Σ (<span className="text-green-600 dark:text-green-400">Estimated Monthly Leasees</span> × <span className="text-green-600 dark:text-green-400">Potential Rate</span>)
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <h4 className="font-medium text-gray-500 mb-2">Total Gap</h4>
                      <div className="pl-3 border-l-2 border-gray-500">
                        <p className="text-gray-600 dark:text-gray-400">Difference between Potential Revenue and Actual Revenue</p>
                        <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                          <span className="text-purple-600 dark:text-purple-400">Total Gap</span> = <span className="text-green-600 dark:text-green-400">Potential Revenue</span> - <span className="text-blue-600 dark:text-blue-400">Actual Revenue</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <h4 className="font-medium text-gray-500 mb-2">% of Potential Leveraged</h4>
                      <div className="pl-3 border-l-2 border-gray-500">
                        <p className="text-gray-600 dark:text-gray-400">Percentage of Potential Revenue that is currently being collected</p>
                        <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
                          <span className="text-purple-600 dark:text-purple-400">% of Potential Leveraged</span> = (<span className="text-blue-600 dark:text-blue-400">Actual Revenue</span> ÷ <span className="text-green-600 dark:text-green-400">Potential Revenue</span>) × 100
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
      {/* Gap Breakdown Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">
              {/* Compliance Gap Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-purple-500 shadow-sm">
                <h3 className="text-gray-600 dark:text-gray-400 text-base">Compliance Gap</h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(Math.abs(metrics.gapBreakdown.complianceGap))}
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Loss from unregistered leases</p>
              </div>

              {/* Rate Gap Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-gray-600 dark:text-gray-400 text-base">Rate Gap</h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(Math.abs(metrics.gapBreakdown.rateGap))}
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Loss from lower rates</p>
              </div>

              {/* Combined Gaps Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-indigo-500 shadow-sm">
                <h3 className="text-gray-600 dark:text-gray-400 text-base">Combined Gaps</h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(Math.abs(metrics.gapBreakdown.combinedGaps))}
                </div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">Additional combined loss</p>
              </div>
            </div>
                  {/* Gap Breakdown Analysis */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      Gap Analysis Breakdown
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {(() => {
                          const gaps = [
                            { type: 'Compliance Gap', value: Math.abs(metrics.gapBreakdown.complianceGap) },
                            { type: 'Rate Gap', value: Math.abs(metrics.gapBreakdown.rateGap) },
                            { type: 'Combined Gaps', value: Math.abs(metrics.gapBreakdown.combinedGaps) }
                          ];

                          const largestGap = gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);

                          if (largestGap.value <= 0) {
                            return (
                              <span>
                                The gaps in long-term user charge revenue collection are <span className="text-gray-900 dark:text-white font-medium">relatively balanced</span>, with no single gap type significantly outweighing the others. 
                                The total gap of {formatCurrency(metrics.gap)} suggests a need for a <span className="text-gray-900 dark:text-white font-medium">comprehensive approach</span> to address all aspects of revenue collection equally.
                              </span>
                            );
                          }

                          switch (largestGap.type) {
                            case 'Compliance Gap':
                              return (
                                <span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Compliance gap</span> is identified as the largest gap contributing to the total gap in long-term user charge revenue collection, 
                                  at <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(metrics.gapBreakdown.complianceGap)}</span>. This indicates a <span className="text-gray-900 dark:text-white font-medium">significant discrepancy</span> between the number of 
                                  potential users and actual users paying the charges.
                                </span>
                              );
                            case 'Rate Gap':
                              return (
                                <span>
                                  <span className="text-violet-600 dark:text-violet-400 font-medium">Rate gap</span> is identified as the largest gap contributing to the total gap in long-term user charge revenue collection, 
                                  at <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(metrics.gapBreakdown.rateGap)}</span>. This suggests that the <span className="text-gray-900 dark:text-white font-medium">current rates</span> being charged may need to be 
                                  reviewed and adjusted to better align with market values or service costs.
                                </span>
                              );
                            case 'Combined Gaps':
                              return (
                                <span>
                                  <span className="text-rose-600 dark:text-rose-400 font-medium">Combined gaps</span> represent the largest portion of revenue loss in long-term user charge collection, 
                                  at <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(metrics.gapBreakdown.combinedGaps)}</span>. This indicates <span className="text-gray-900 dark:text-white font-medium">multiple factors</span> contributing to the revenue gap 
                                  that require a comprehensive approach to address.
                                </span>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

             
               

                
              </div>
            </div>

           
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

LongTermUserChargeAnalysis.displayName = 'LongTermUserChargeAnalysis';

export default LongTermUserChargeAnalysis;