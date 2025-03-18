import { useState, useEffect, useCallback } from 'react';
import { ShortTermCategory } from './useShortTermCalculations';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useUnifiedReports } from './useUnifiedReports';

interface ShortTermData {
  _id?: string;
  userId?: string;
  reportId?: string;
  country?: string;
  state?: string;
  categories: Array<{
    id: string;
    name: string;
    estimatedDailyFees: number;
    actualDailyFees: number;
    potentialRate: number;
    actualRate: number;
    daysInYear?: number;
  }>;
  metrics: {
    actual: number;
    potential: number;
    gap: number;
    potentialLeveraged: number;
    gapBreakdown: {
      registrationGap: number;
      registrationGapPercentage: number;
      complianceGap: number;
      complianceGapPercentage: number;
      rateGap: number;
      rateGapPercentage: number;
      combinedGaps: number;
      combinedGapsPercentage: number;
    };
    totalEstimatedDailyFees: number;
    totalActualDailyFees: number;
  };
}

interface UseShortTermDataProps {
  providedReportId?: string;
}

// Local storage key for saving data when no reportId is available
const LOCAL_STORAGE_KEY = 'shortTermAnalysisData';

export const useShortTermData = ({ providedReportId }: UseShortTermDataProps = {}) => {
  const [data, setData] = useState<ShortTermData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const params = useParams();
  const urlReportId = params?.reportId as string;
  // Use the provided reportId if available, otherwise use the one from URL params
  const reportId = providedReportId || urlReportId;
  const analysisId = data?._id;
  const { updateShortTermData: updateUnifiedShortTermData } = useUnifiedReports();

  console.log('useShortTermData hook - reportId:', reportId);

  // Load data from API or local storage
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If we have a reportId, load from unified-reports API
      if (reportId) {
        console.log(`Loading short term data from API for reportId: ${reportId}`);
        const response = await fetch(`/api/unified-reports/${reportId}/short-term`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Not found means we need to create new data
            console.log('No short term data found for this report, starting fresh');
            setData(null);
            return;
          }
          throw new Error(`Failed to load data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Loaded short term data from API:', result);
        setData(result);
      } else {
        console.log('No reportId available, using local storage fallback');
        // No reportId, try to load from local storage
        try {
          if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              console.log('Loaded short term data from local storage:', parsedData);
              setData(parsedData);
            } else {
              console.log('No data found in local storage');
              setData(null);
            }
          }
        } catch (localStorageErr) {
          console.error('Error loading from local storage:', localStorageErr);
          setData(null);
        }
      }
    } catch (err) {
      console.error('Error loading short term data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading data');
      toast.error('Failed to load short term data');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Save data to API or local storage
  const saveData = useCallback(
    async (dataToSave: ShortTermData) => {
      setLoading(true);
      setIsSaving(true);
      setError(null);

      console.log('=== START: useShortTermData.saveData ===');
      console.log('ReportId:', reportId);
      console.log('Data to save:', dataToSave);

      try {
        // If we have a reportId, save to API
        if (reportId) {
          // Ensure the data has the correct structure
          const formattedData = {
            categories: Array.isArray(dataToSave.categories) ? dataToSave.categories.map(cat => ({
              id: cat.id,
              name: cat.name || 'Unnamed Category',
              estimatedDailyFees: Number(cat.estimatedDailyFees) || 0,
              actualDailyFees: Number(cat.actualDailyFees) || 0,
              potentialRate: Number(cat.potentialRate) || 0,
              actualRate: Number(cat.actualRate) || 0,
              daysInYear: Number(cat.daysInYear) || 365,
            })) : [],
            metrics: {
              actual: Number(dataToSave.metrics?.actual) || 0,
              potential: Number(dataToSave.metrics?.potential) || 0,
              gap: Number(dataToSave.metrics?.gap) || 0,
              potentialLeveraged: Number(dataToSave.metrics?.potentialLeveraged) || 0,
              gapBreakdown: {
                registrationGap: Number(dataToSave.metrics?.gapBreakdown?.registrationGap) || 0,
                registrationGapPercentage: Number(dataToSave.metrics?.gapBreakdown?.registrationGapPercentage) || 0,
                complianceGap: Number(dataToSave.metrics?.gapBreakdown?.complianceGap) || 0,
                complianceGapPercentage: Number(dataToSave.metrics?.gapBreakdown?.complianceGapPercentage) || 0,
                rateGap: Number(dataToSave.metrics?.gapBreakdown?.rateGap) || 0,
                rateGapPercentage: Number(dataToSave.metrics?.gapBreakdown?.rateGapPercentage) || 0,
                combinedGaps: Number(dataToSave.metrics?.gapBreakdown?.combinedGaps) || 0,
                combinedGapsPercentage: Number(dataToSave.metrics?.gapBreakdown?.combinedGapsPercentage) || 0
              },
              totalEstimatedDailyFees: Number(dataToSave.metrics?.totalEstimatedDailyFees) || 0,
              totalActualDailyFees: Number(dataToSave.metrics?.totalActualDailyFees) || 0
            },
            country: dataToSave.country || 'Not specified',
            state: dataToSave.state || 'Not specified',
          };

          console.log('Calling updateUnifiedShortTermData with formatted data:', formattedData);
          const result = await updateUnifiedShortTermData(reportId, formattedData);
          
          if (!result) {
            console.error('No result returned from updateUnifiedShortTermData');
            throw new Error('Failed to save data - no result returned');
          }

          console.log('Save successful, result:', result);
          setData(result);
          toast.success('Short term data saved successfully');
          console.log('=== END: useShortTermData.saveData - Success ===');
          return result;
        } else {
          // No reportId, save to local storage
          try {
            if (typeof window !== 'undefined') {
              console.log('No reportId available, using local storage fallback');
              console.log('Saving to local storage with key:', LOCAL_STORAGE_KEY);
              
              // Format the data to match what would be saved to the database
              const formattedData = {
                _id: crypto.randomUUID(), // Generate a fake ID for consistency
                userId: 'local-user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...dataToSave
              };
              
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formattedData));
              console.log('Saved short term data to local storage:', formattedData);
              
              // Verify the data was saved correctly
              const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
              console.log('Verification - data in local storage:', savedData ? 'exists' : 'missing');
              
              if (savedData) {
                const parsedData = JSON.parse(savedData);
                setData(parsedData);
                toast.success('Short term data saved to browser storage');
                console.log('=== END: useShortTermData.saveData - Local Storage Success ===');
                return parsedData;
              }
            }
          } catch (localStorageErr) {
            console.error('Error saving to local storage:', localStorageErr);
            throw localStorageErr;
          }
        }
      } catch (err) {
        console.error('Error in useShortTermData.saveData:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while saving');
        toast.error('Failed to save short term data');
        console.log('=== END: useShortTermData.saveData - Error ===');
        return null;
      } finally {
        setLoading(false);
        setIsSaving(false);
      }
    },
    [reportId, updateUnifiedShortTermData]
  );

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    isSaving,
    loadData,
    saveData
  };
}; 