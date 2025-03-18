'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { ChevronUpIcon, ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/app/context/CurrencyContext';
import { usePropertyTax } from '@/app/context/PropertyTaxContext';
import { usePropertyTaxCalculations } from '@/app/hooks/usePropertyTaxCalculations';
import { formatCurrency, formatNumber, formatPercentage, formatRoundedCurrency } from '@/app/utils/formatters';
import { InputField } from '@/app/components/common/InputField';
import { Card } from '@/app/components/common/Card';
import { MetricCard } from '@/app/components/common/MetricCard';
import { CategoryForm } from './CategoryForm';
import { GapBreakdownChart } from './GapBreakdownChart';
import { PropertyTaxGapChart } from './PropertyTaxGapChart';
import { FormulaSection } from './FormulaSection';
import { AnalysisMessage } from './AnalysisMessage';
import { BreakdownAnalysisMessage } from './BreakdownAnalysisMessage';
import { usePropertyTaxData } from '@/app/hooks/usePropertyTaxData';
import { useSession } from 'next-auth/react';
import { ICategory } from '@/models/PropertyTaxAnalysis';
import { toast } from 'react-hot-toast';
import { Category } from '@/app/types/propertyTax';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define a new interface for the complete data object
interface PropertyTaxCompleteData {
  metrics: {
    totalEstimatedTaxPayers: number;
    registeredTaxPayers: number;
    categories: Array<any>;
    actual: number;
    potential: number;
    gap: number;
    gapBreakdown: {
      registrationGap: number;
      complianceGap: number;
      assessmentGap: number;
      combinedGaps: number;
    };
  };
  saveData: {
    totalEstimatedTaxPayers: number;
    registeredTaxPayers: number;
    categories: Array<{
      id: string;
      name: string;
      registeredTaxpayers: number;
      compliantTaxpayers: number;
      averageLandValue: number;
      estimatedAverageValue: number;
      taxRate: number;
    }>;
  };
}

// Update the props interface to include initialData
interface PropertyTaxAnalysisProps {
  onDataChange?: (data: any) => void;
  initialData?: any;
}

const PropertyTaxAnalysis = ({ onDataChange, initialData }: PropertyTaxAnalysisProps): React.ReactElement => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';
  const { data: session } = useSession();
  
  const {
    metrics,
    updateMetrics,
    updateCategory,
    updateCategoryName,
    addCategory,
    deleteCategory,
    toggleCategory,
    setCategories
  } = usePropertyTax();

  // Extract reportId from initialData if available
  const reportId = initialData?.reportId || initialData?._id;

  // Use our hook for database operations
  const {
    data: savedData,
    loading: isLoading,
    isSaving,
    saveData,
    fetchData
  } = usePropertyTaxData({ reportId });

  const propertyTaxMetrics = usePropertyTaxCalculations(metrics);

  // Add a ref to store the previous data
  const previousDataRef = useRef<any>(null);
  
  // Add a ref to track if data has been loaded
  const dataLoadedRef = useRef<boolean>(false);

  // Notify parent component of metrics changes
  useEffect(() => {
    // Create a complete data object that includes both metrics and raw data for saving
    const completeData = {
      // Analysis metrics for display
      metrics: {
        ...metrics,  // Include all properties from the original metrics
        actual: propertyTaxMetrics.actualRevenue,
        potential: propertyTaxMetrics.potentialRevenue,
        gap: propertyTaxMetrics.gap,
        gapBreakdown: propertyTaxMetrics.gapBreakdown,
        // Ensure these fields are explicitly included
        totalEstimatedTaxPayers: metrics.totalEstimatedTaxPayers,
        registeredTaxPayers: metrics.registeredTaxPayers,
        categories: metrics.categories // Explicitly include categories in metrics
      },
      
      // Raw data for saving to database
      saveData: {
        totalEstimatedTaxPayers: metrics.totalEstimatedTaxPayers,
        registeredTaxPayers: metrics.registeredTaxPayers,
        categories: metrics.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          registeredTaxpayers: cat.registeredTaxpayers,
          compliantTaxpayers: cat.compliantTaxpayers,
          averageLandValue: cat.averageLandValue,
          estimatedAverageValue: cat.estimatedAverageValue,
          taxRate: cat.taxRate
        }))
      },
      // Include categories at the top level as well for backward compatibility
      categories: metrics.categories,
      totalEstimatedTaxPayers: metrics.totalEstimatedTaxPayers,
      registeredTaxPayers: metrics.registeredTaxPayers
    };
    
    // Check if the data has actually changed before notifying parent
    if (JSON.stringify(completeData) !== JSON.stringify(previousDataRef.current)) {
      console.log('PropertyTaxAnalysis sending data to parent:', completeData);
      
      // Log the structure of the data
      console.log('Data structure:', {
        hasMetrics: !!completeData.metrics,
        hasSaveData: !!completeData.saveData,
        metricsHasTotalEstimatedTaxPayers: completeData.metrics && typeof completeData.metrics.totalEstimatedTaxPayers !== 'undefined',
        metricsHasRegisteredTaxPayers: completeData.metrics && typeof completeData.metrics.registeredTaxPayers !== 'undefined',
        saveDataHasTotalEstimatedTaxPayers: completeData.saveData && typeof completeData.saveData.totalEstimatedTaxPayers !== 'undefined',
        saveDataHasRegisteredTaxPayers: completeData.saveData && typeof completeData.saveData.registeredTaxPayers !== 'undefined'
      });
      
      // Pass the complete data to the parent component
      if (onDataChange) {
        onDataChange(completeData);
      }
      
      // Update the previous data reference
      previousDataRef.current = completeData;
    }
  }, [propertyTaxMetrics, metrics, onDataChange]);

  const [isFormulaVisible, setIsFormulaVisible] = useState(false);
  const [isGapFormulaVisible, setIsGapFormulaVisible] = useState(false);

  // Update the clearAllCategories function
  const clearAllCategories = () => {
    // Instead of removing categories one by one, set an empty array directly
    setCategories([]);
  };

  // Modify the useEffect that loads data from savedData
  useEffect(() => {
    if (!isLoading && savedData && !dataLoadedRef.current) {
      console.log('Loading property tax data from savedData:', savedData);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Clear existing categories before loading new ones
        clearAllCategories();
        
        // Update total estimated taxpayers - ensure we parse it as a number
        if (savedData.totalEstimatedTaxPayers) {
          const estimatedTaxPayers = typeof savedData.totalEstimatedTaxPayers === 'string' 
            ? parseInt(savedData.totalEstimatedTaxPayers, 10) 
            : savedData.totalEstimatedTaxPayers;
          
          console.log('Setting totalEstimatedTaxPayers to:', estimatedTaxPayers);
          updateMetrics('totalEstimatedTaxPayers', estimatedTaxPayers);
        }
        
        // Update registered taxpayers - ensure we parse it as a number
        if (savedData.registeredTaxPayers) {
          const registeredTaxPayers = typeof savedData.registeredTaxPayers === 'string' 
            ? parseInt(savedData.registeredTaxPayers, 10) 
            : savedData.registeredTaxPayers;
          
          console.log('Setting registeredTaxPayers to:', registeredTaxPayers);
          updateMetrics('registeredTaxPayers', registeredTaxPayers);
        }
        
        // Load categories from savedData
        if (savedData.categories && Array.isArray(savedData.categories) && savedData.categories.length > 0) {
          console.log('Loading categories from savedData:', savedData.categories);
          
          // Map the saved categories to the format expected by the component
          const mappedCategories = savedData.categories.map((cat: any) => ({
            id: cat.id || crypto.randomUUID(),
            name: cat.name || 'Unnamed Category',
            registeredTaxpayers: cat.registeredTaxpayers || 0,
            compliantTaxpayers: cat.compliantTaxpayers || 0,
            averageLandValue: cat.averageLandValue || cat.actualLandValue || 0,
            estimatedAverageValue: cat.estimatedAverageValue || cat.estimatedLandValue || 0,
            taxRate: cat.taxRate || 0,
            isExpanded: false
          }));
          
          // Set all categories at once
          setCategories(mappedCategories);
        } else {
          console.log('No categories found in savedData, keeping default categories from context');
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
          
          if (metricsData.analysisMessage) {
            updateMetrics('analysisMessage', metricsData.analysisMessage);
          }
        }
      } catch (error) {
        console.error('Error loading property tax data:', error);
        toast.error('Failed to load property tax data');
      }
    }
  }, [isLoading, savedData, updateMetrics, clearAllCategories, setCategories]);

  // Add a useEffect to ensure we have categories
  useEffect(() => {
    // If we don't have any categories and data loading is complete, add default categories
    if (metrics.categories.length === 0 && !isLoading && !dataLoadedRef.current) {
      console.log('No categories found in context, adding default categories');
      
      // Default categories
      const defaultCategories = [
        {
          id: crypto.randomUUID(),
          name: "Residential Properties",
          registeredTaxpayers: 30000,
          compliantTaxpayers: 20000,
          averageLandValue: 10000,
          estimatedAverageValue: 30000,
          taxRate: 0.007,
          isExpanded: false,
        },
        {
          id: crypto.randomUUID(),
          name: "Commercial Properties",
          registeredTaxpayers: 15000,
          compliantTaxpayers: 5000,
          averageLandValue: 20000,
          estimatedAverageValue: 60000,
          taxRate: 0.006,
          isExpanded: false,
        },
        {
          id: crypto.randomUUID(),
          name: "Industrial Properties",
          registeredTaxpayers: 5000,
          compliantTaxpayers: 1000,
          averageLandValue: 30000,
          estimatedAverageValue: 40000,
          taxRate: 0.005,
          isExpanded: false,
        }
      ];
      
      setCategories(defaultCategories);
      dataLoadedRef.current = true;
    }
  }, [metrics.categories.length, isLoading, setCategories]);

  // Update the category loading logic in the useEffect for initialData
  useEffect(() => {
    if (initialData && !dataLoadedRef.current) {
      console.log('Loading initial property tax data:', initialData);
      
      // Mark data as loaded to prevent infinite loops
      dataLoadedRef.current = true;
      
      try {
        // Clear existing categories before loading new ones
        clearAllCategories();
        
        // Update metrics if available
        if (initialData.metrics) {
          // Use the metrics directly
          const { actual, potential, gap, potentialLeveraged, gapBreakdown, analysisMessage } = initialData.metrics;
          
          // Update the metrics state
          updateMetrics('actual', actual || 0);
          updateMetrics('potential', potential || 0);
          updateMetrics('gap', gap || 0);
          updateMetrics('potentialLeveraged', potentialLeveraged || 0);
          
          if (gapBreakdown) {
            updateMetrics('gapBreakdown', gapBreakdown);
          }
          
          if (analysisMessage) {
            updateMetrics('analysisMessage', analysisMessage);
          }
        }
        
        // Check for direct properties first
        if (initialData.totalEstimatedTaxPayers !== undefined) {
          updateMetrics('totalEstimatedTaxPayers', initialData.totalEstimatedTaxPayers);
        }
        
        if (initialData.registeredTaxPayers !== undefined) {
          updateMetrics('registeredTaxPayers', initialData.registeredTaxPayers);
        }
        
        // Check for saveData structure
        if (initialData.saveData) {
          // Update totalEstimatedTaxPayers and registeredTaxPayers from saveData if not already set
          if (initialData.saveData.totalEstimatedTaxPayers !== undefined && initialData.totalEstimatedTaxPayers === undefined) {
            updateMetrics('totalEstimatedTaxPayers', initialData.saveData.totalEstimatedTaxPayers);
          }
          
          if (initialData.saveData.registeredTaxPayers !== undefined && initialData.registeredTaxPayers === undefined) {
            updateMetrics('registeredTaxPayers', initialData.saveData.registeredTaxPayers);
          }
          
          // Update categories from saveData if available
          if (initialData.saveData.categories && initialData.saveData.categories.length > 0) {
            // Format categories to match the expected structure
            const formattedCategories = initialData.saveData.categories.map((cat: any) => ({
              id: cat.id || crypto.randomUUID(),
              name: cat.name || 'Unnamed Category',
              registeredTaxpayers: cat.registeredTaxpayers || 0,
              compliantTaxpayers: cat.compliantTaxpayers || 0,
              averageLandValue: cat.averageLandValue || cat.actualLandValue || 0,
              estimatedAverageValue: cat.estimatedAverageValue || cat.estimatedLandValue || 0,
              taxRate: cat.taxRate || 0,
              isExpanded: false
            }));
            
            // Set all categories at once
            setCategories(formattedCategories);
            
            return; // Skip the direct categories loading if we've loaded from saveData
          } else {
            console.log('No categories found in initialData.saveData');
          }
        }
        
        // Update categories if available directly (only if not already loaded from saveData)
        if (initialData.categories && initialData.categories.length > 0) {
          // Format categories to match the expected structure
          const formattedCategories = initialData.categories.map((cat: any) => ({
            id: cat.id || crypto.randomUUID(),
            name: cat.name || 'Unnamed Category',
            registeredTaxpayers: cat.registeredTaxpayers || 0,
            compliantTaxpayers: cat.compliantTaxpayers || 0,
            averageLandValue: cat.averageLandValue || cat.actualLandValue || 0,
            estimatedAverageValue: cat.estimatedAverageValue || cat.estimatedLandValue || 0,
            taxRate: cat.taxRate || 0,
            isExpanded: false
          }));
          
          // Set all categories at once
          setCategories(formattedCategories);
        } else {
          console.log('No categories found in initialData, using default categories');
          
          // Default categories
          const defaultCategories = [
            {
              id: crypto.randomUUID(),
              name: "Residential Properties",
              registeredTaxpayers: 30000,
              compliantTaxpayers: 20000,
              averageLandValue: 10000,
              estimatedAverageValue: 30000,
              taxRate: 0.007,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Commercial Properties",
              registeredTaxpayers: 15000,
              compliantTaxpayers: 5000,
              averageLandValue: 20000,
              estimatedAverageValue: 60000,
              taxRate: 0.006,
              isExpanded: false,
            },
            {
              id: crypto.randomUUID(),
              name: "Industrial Properties",
              registeredTaxpayers: 5000,
              compliantTaxpayers: 1000,
              averageLandValue: 30000,
              estimatedAverageValue: 40000,
              taxRate: 0.005,
              isExpanded: false,
            }
          ];
          
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Error loading initial property tax data:', error);
      }
    }
  }, [initialData, updateMetrics, clearAllCategories, setCategories]);

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
      const potentialLeveraged = propertyTaxMetrics.potentialRevenue > 0 
        ? (propertyTaxMetrics.actualRevenue / propertyTaxMetrics.potentialRevenue) * 100 
        : 0;

      // Log the current state before saving
      console.log('Current metrics before saving:', metrics);
      console.log('Current categories before saving:', metrics.categories);

      // Calculate average values for property tax fields
      const totalRegisteredTaxpayers = metrics.categories.reduce((sum, cat) => sum + (cat.registeredTaxpayers || 0), 0);
      const totalCompliantTaxpayers = metrics.categories.reduce((sum, cat) => sum + (cat.compliantTaxpayers || 0), 0);
      const avgActualLandValue = metrics.categories.length > 0 
        ? metrics.categories.reduce((sum, cat) => sum + (cat.averageLandValue || 0), 0) / metrics.categories.length 
        : 0;
      const avgEstimatedLandValue = metrics.categories.length > 0 
        ? metrics.categories.reduce((sum, cat) => sum + (cat.estimatedAverageValue || 0), 0) / metrics.categories.length 
        : 0;
      const avgTaxRate = metrics.categories.length > 0 
        ? metrics.categories.reduce((sum, cat) => sum + (cat.taxRate || 0), 0) / metrics.categories.length 
        : 0;
      
      // Calculate property registration rate
      const propertyRegistrationRate = metrics.totalEstimatedTaxPayers > 0 
        ? (totalRegisteredTaxpayers / metrics.totalEstimatedTaxPayers) * 100 
        : 0;
      
      // Calculate valuation ratio
      const valuationRatio = avgEstimatedLandValue > 0 
        ? (avgActualLandValue / avgEstimatedLandValue) * 100 
        : 0;
      
      // Calculate billing and collection rates
      const billingRate = totalRegisteredTaxpayers > 0 
        ? (totalCompliantTaxpayers / totalRegisteredTaxpayers) * 100 
        : 0;
      
      // Create the data object to save
      const dataToSave = {
        // Ensure these fields are explicitly included at the top level
        totalEstimatedTaxPayers: metrics.totalEstimatedTaxPayers || 0,
        registeredTaxPayers: metrics.registeredTaxPayers || 0,
        categories: metrics.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          registeredTaxpayers: cat.registeredTaxpayers,
          compliantTaxpayers: cat.compliantTaxpayers,
          averageLandValue: cat.averageLandValue,
          estimatedAverageValue: cat.estimatedAverageValue,
          taxRate: cat.taxRate,
          isExpanded: cat.isExpanded
        })),
        metrics: {
          actual: propertyTaxMetrics.actualRevenue,
          potential: propertyTaxMetrics.potentialRevenue,
          gap: propertyTaxMetrics.gap,
          potentialLeveraged: potentialLeveraged,
          gapBreakdown: {
            registrationGap: propertyTaxMetrics.gapBreakdown.registrationGap,
            complianceGap: propertyTaxMetrics.gapBreakdown.complianceGap,
            assessmentGap: propertyTaxMetrics.gapBreakdown.assessmentGap,
            rateGap: propertyTaxMetrics.gapBreakdown.rateGap,
            combinedGaps: propertyTaxMetrics.gapBreakdown.combinedGaps
          }
        }
      };

      console.log('Saving property tax data:', JSON.stringify(dataToSave, null, 2));

      // Save to database
      const result = await saveData(dataToSave);
      
      if (result) {
        toast.success('Property tax data saved successfully');
        
        // Reset the data loaded flag to force a reload on next load
        dataLoadedRef.current = false;
        
        // Refresh the data to ensure we have the latest
        await fetchData();
        
        // Call onDataChange with the saved data
        if (onDataChange) {
          onDataChange({
            metrics: {
              ...dataToSave.metrics,
              totalEstimatedTaxPayers: dataToSave.totalEstimatedTaxPayers,
              registeredTaxPayers: dataToSave.registeredTaxPayers,
              categories: dataToSave.categories
            },
            saveData: dataToSave
          });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving property tax data:', error);
      toast.error('Failed to save property tax data');
      return false;
    }
  };

  // Function to handle category deletion and save changes
  const handleDeleteCategory = async (id: string) => {
    try {
      // Delete the category from the context state
      deleteCategory(id);
      
      // Show success message immediately
      toast.success('Category removed successfully');
      
      // Try to save the changes to the database
      try {
        const saveResult = await handleSaveData();
      } catch (saveError) {
        // Silently log the error but don't show to user
        console.error('Error saving changes after deleting category:', saveError);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred while removing the category');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Column - Input Section */}
      <div className="lg:w-1/3 space-y-4">
        <Card>
          {/* Total Estimated and Registered Taxpayers Inputs */}
          <div className="space-y-4">
            <InputField
              label="Total estimated number of Properties"
              value={metrics.totalEstimatedTaxPayers}
              onChange={(value) => {
                updateMetrics('totalEstimatedTaxPayers', parseInt(value) || 0);
              }}
              type="number"
              min={0}
              step={1}
            />

            <InputField
              label="Registered Property Tax Payers"
              value={metrics.registeredTaxPayers}
              onChange={(value) => {
                updateMetrics('registeredTaxPayers', parseInt(value) || 0);
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
              {metrics.categories.map((category) => (
                <CategoryForm
                  key={category.id}
                  category={category}
                  onUpdate={(field, value) => {
                    // @ts-ignore - Ignoring type mismatch for now
                    updateCategory(category.id, field, value);
                  }}
                  onDelete={() => {
                    handleDeleteCategory(category.id);
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Analysis Section */}
      <div className="lg:w-2/3">
        <Card>
          {/* Property Tax Gap Analysis Chart */}
          <div className="mb-8">
            <PropertyTaxGapChart data={propertyTaxMetrics} />
          </div>
          {/* Formula Sections */}
          <div className="mb-8">
            <FormulaSection
              title="Property Tax Revenue Analysis Formulas"
              isVisible={isFormulaVisible}
              onToggle={() => setIsFormulaVisible(!isFormulaVisible)}
              formulas={[
                {
                  title: 'Actual Revenue',
                  formula: (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-500">=</span>
                        <span className="text-blue-600">Compliant Taxpayers</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-emerald-600">Average Land Value</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-emerald-600">Actual Tax Rate</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: 'Total Potential Revenue',
                  formula: (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-500">=</span>
                        <span className="text-blue-600">Estimated Taxpayers</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-emerald-600">Average Land Value</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-emerald-600">Potential Tax Rate</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-500">+</span>
                        <span className="text-gray-500">(</span>
                        <span className="text-blue-600">Unregistered Taxpayers</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-emerald-600">Average Land Value</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-emerald-600">Potential Tax Rate</span>
                        <span className="text-gray-500">)</span>
                      </div>
                      <div className="pl-4 mt-2">
                        <div className="text-gray-500">where:</div>
                        <div className="flex items-baseline gap-2 ml-4">
                          <span className="text-blue-600">Unregistered Taxpayers</span>
                          <span className="text-gray-500">=</span>
                          <span className="text-blue-600">Total Estimated</span>
                          <span className="text-gray-500">-</span>
                          <span className="text-blue-600">Sum of Registered Taxpayers</span>
                        </div>
                        <div className="flex items-baseline gap-2 ml-4">
                          <span className="text-emerald-600">Average Land Value</span>
                          <span className="text-gray-500">=</span>
                          <span className="text-gray-600">Average of all category land values</span>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  title: 'Total Gap Property Tax',
                  formula: (
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500">=</span>
                      <span className="text-blue-600">Total Potential Revenue</span>
                      <span className="text-gray-500">-</span>
                      <span className="text-blue-600">Actual Revenue</span>
                    </div>
                  )
                },
                {
                  title: '% of Potential Leveraged',
                  formula: (
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500">=</span>
                      <span className="text-gray-500">(</span>
                      <span className="text-blue-600">Actual Revenue</span>
                      <span className="text-gray-500">÷</span>
                      <span className="text-purple-600">Total Potential Revenue</span>
                      <span className="text-gray-500">)</span>
                      <span className="text-gray-500">×</span>
                      <span className="text-gray-600">100</span>
                    </div>
                  )
                }
              ]}
            />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Actual Revenue"
              value={formatRoundedCurrency(propertyTaxMetrics.actualRevenue, currencySymbol)}
              description="Current collected revenue"
              color="blue"
            />
            <MetricCard
              title="Potential Revenue"
              value={formatRoundedCurrency(propertyTaxMetrics.potentialRevenue, currencySymbol)}
              description="Maximum possible revenue"
              color="emerald"
            />
            <MetricCard
              title="Revenue Gap"
              value={formatRoundedCurrency(propertyTaxMetrics.gap, currencySymbol)}
              description="Revenue improvement opportunity"
              color="red"
            />
          </div>

         

          {/* Gap Analysis Text */}
          <div className="mt-4">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">Property Tax Gap Analysis</h4>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-md p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <AnalysisMessage metrics={propertyTaxMetrics} />
              </div>
            </div>
          </div>

          {/* Gap Breakdown Chart */}
          <div className="mb-8">
            <GapBreakdownChart
              gapBreakdown={propertyTaxMetrics.gapBreakdown}
              currencySymbol={currencySymbol}
            />
          </div>

          <FormulaSection
            title="Gap Breakdown Formulas"
            isVisible={isGapFormulaVisible}
            onToggle={() => setIsGapFormulaVisible(!isGapFormulaVisible)}
            formulas={[
              {
                title: 'Registration Gap',
                formula: (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500">=</span>
                      <span className="text-gray-500">(</span>
                      <span className="text-blue-600">Sum of (Compliant × Land Value × Tax Rate) for each category</span>
                      <span className="text-gray-500">)</span>
                      <span className="text-gray-500">÷</span>
                      <span className="text-gray-500">(</span>
                      <span className="text-blue-600">Registered</span>
                      <span className="text-gray-500">÷</span>
                      <span className="text-blue-600">Total Estimated</span>
                      <span className="text-gray-500">)</span>
                      <span className="text-gray-500">-</span>
                      <span className="text-blue-600">Actual Revenue</span>
                    </div>
                    <div className="pl-4 mt-2">
                      <div className="text-gray-500">In Excel format:</div>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-gray-600">= ((B18*B21*B27)+(B19*B22*B28)+(B20*B23*B29))/(B14/B13) - Actual Revenue</span>
                      </div>
                      <div className="text-gray-500 mt-2">where:</div>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-gray-600">B18, B19, B20: Compliant Taxpayers for each category</span>
                      </div>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-gray-600">B21, B22, B23: Average Land Value for each category</span>
                      </div>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-gray-600">B27, B28, B29: Tax Rate for each category</span>
                      </div>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-gray-600">B14: Total Registered Taxpayers</span>
                      </div>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-gray-600">B13: Total Estimated Taxpayers</span>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                title: 'Compliance Gap',
                formula: (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500">=</span>
                      <span className="text-blue-600">(Registered - Compliant)</span>
                      <span className="text-gray-500">×</span>
                      <span className="text-emerald-600">Land Value</span>
                      <span className="text-gray-500">×</span>
                      <span className="text-emerald-600">Tax Rate</span>
                      <span className="text-gray-500">for each category</span>
                    </div>
                  </div>
                )
              },
              {
                title: 'Assessment/Valuation Gap',
                formula: (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500">=</span>
                      <span className="text-blue-600">(Estimated - Actual Value)</span>
                      <span className="text-gray-500">×</span>
                      <span className="text-blue-600">Compliant</span>
                      <span className="text-gray-500">×</span>
                      <span className="text-emerald-600">Tax Rate</span>
                      <span className="text-gray-500">for each category</span>
                    </div>
                  </div>
                )
              },
              {
                title: 'Combined Gaps',
                formula: (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500">=</span>
                      <span className="text-blue-600">Total Gap</span>
                      <span className="text-gray-500">-</span>
                      <span className="text-gray-500">(</span>
                      <span className="text-emerald-600">Registration Gap</span>
                      <span className="text-gray-500">+</span>
                      <span className="text-emerald-600">Compliance Gap</span>
                      <span className="text-gray-500">+</span>
                      <span className="text-emerald-600">Assessment/Valuation Gap</span>
                      <span className="text-gray-500">)</span>
                    </div>
                  </div>
                )
              }
            ]}
          />
{/* Gap Breakdown Analysis */}
<div className="mt-8">
            {/* Gap Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Registration Gap"
                value={formatRoundedCurrency(propertyTaxMetrics.gapBreakdown.registrationGap, currencySymbol)}
                description="Unregistered property value"
                color="blue"
              />
              <MetricCard
                title="Compliance Gap"
                value={formatRoundedCurrency(propertyTaxMetrics.gapBreakdown.complianceGap, currencySymbol)}
                description="Non-compliant revenue loss"
                color="orange"
              />
              <MetricCard
                title="Assessment Gap"
                value={formatRoundedCurrency(propertyTaxMetrics.gapBreakdown.assessmentGap, currencySymbol)}
                description="Valuation difference"
                color="gray"
              />
              <MetricCard
                title="Combined Gaps"
                value={formatRoundedCurrency(propertyTaxMetrics.gapBreakdown.combinedGaps, currencySymbol)}
                description="Other revenue gaps"
                color="yellow"
              />
            </div>
          </div>
          {/* Breakdown Analysis Text */}
          <div className="mt-4">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">Property Tax Breakdown Analysis</h4>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-md p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <BreakdownAnalysisMessage metrics={propertyTaxMetrics} />
              </div>
            </div>
          </div>

          
        </Card>
      </div>
    </div>
  );
};

export default PropertyTaxAnalysis;