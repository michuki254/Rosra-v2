import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

interface LongTermCategory {
  id: string;
  name: string;
  estimatedLeases: number;
  registeredLeases: number;
  potentialRate: number;
  actualRate: number;
  isExpanded: boolean;
}

interface LongTermData {
  _id?: string;
  userId?: string;
  reportId?: string;
  country?: string;
  state?: string;
  categories: LongTermCategory[];
  metrics?: {
    actual: number;
    potential: number;
    gap: number;
    potentialLeveraged: number;
    gapBreakdown: {
      registrationGapPercentage: number;
      complianceGap: number;
      rateGap: number;
      combinedGaps: number;
    };
  };
}

interface UseLongTermDataProps {
  providedReportId?: string;
}

// Local storage key for saving data when no reportId is available
const LOCAL_STORAGE_KEY = 'longTermAnalysisData';

export const useLongTermData = ({ providedReportId }: UseLongTermDataProps = {}) => {
  const [data, setData] = useState<LongTermData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const params = useParams();
  const urlReportId = params?.reportId as string;
  // Use the provided reportId if available, otherwise use the one from URL params
  const reportId = providedReportId || urlReportId;
  const analysisId = data?._id;

  console.log('useLongTermData hook - providedReportId:', providedReportId);
  console.log('useLongTermData hook - urlReportId:', urlReportId);
  console.log('useLongTermData hook - reportId:', reportId);

  // Load data from API or local storage
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If we have a reportId, try to load from API
      if (reportId) {
        console.log(`Loading long term data from API for reportId: ${reportId}`);
        // First try to get data from the unified-reports API
        const response = await fetch(`/api/unified-reports/${reportId}/long-term`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // If not found in unified-reports, try the standalone API
            const fallbackResponse = await fetch(`/api/reports/${reportId}/long-term`);
            
            if (!fallbackResponse.ok) {
              if (fallbackResponse.status === 404) {
                // Not found in either API is not an error, just means we need to create new data
                console.log('No long term data found for this report, starting fresh');
                setData(null);
                return;
              }
              throw new Error(`Failed to load data: ${fallbackResponse.statusText}`);
            }
            
            const fallbackResult = await fallbackResponse.json();
            console.log('Loaded long term data from fallback API:', fallbackResult);
            setData(fallbackResult);
            return;
          }
          throw new Error(`Failed to load data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Loaded long term data from API:', result);
        setData(result.longTerm || result); // Handle both formats
      } else {
        console.log('No reportId available, using local storage fallback');
        // No reportId, try to load from local storage
        try {
          if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              console.log('Loaded long term data from local storage:', parsedData);
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
      console.error('Error loading long term data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading data');
      toast.error('Failed to load long term data');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Save data to API or local storage
  const saveData = useCallback(
    async (dataToSave: LongTermData) => {
      setLoading(true);
      setIsSaving(true);
      setError(null);

      console.log('Starting save operation with data:', dataToSave);
      console.log('ReportId available:', !!reportId);
      console.log('ProvidedReportId:', providedReportId);
      console.log('UrlReportId:', urlReportId);

      try {
        // If we have a reportId, save to API
        if (reportId) {
          // Always save to the unified-reports API
          const url = `/api/unified-reports/${reportId}/long-term`;
          const method = 'POST'; // POST will handle both create and update

          console.log(`Saving long term data with ${method} to ${url}`);
          console.log('Data to save:', JSON.stringify(dataToSave, null, 2));

          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave),
          });

          console.log('API response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            
            // If unauthorized, try saving to local storage as fallback
            if (response.status === 401) {
              console.log('Unauthorized, falling back to local storage');
              return saveToLocalStorage(dataToSave);
            }
            
            throw new Error(`Failed to save data: ${response.statusText}. Details: ${errorText}`);
          }

          const result = await response.json();
          console.log('Save result from API (full):', JSON.stringify(result, null, 2));
          
          // Check if the response has the expected structure
          if (result.longTerm) {
            console.log('longTerm property found in result');
            setData(result.longTerm);
            return result.longTerm;
          } else if (result.message && result.message.includes('success')) {
            // If the API doesn't return the data but indicates success, use the data we sent
            console.log('API indicated success but did not return data, using sent data');
            setData(dataToSave);
            return dataToSave;
          } else {
            console.warn('API response missing longTerm property:', result);
            throw new Error('API response missing expected data structure');
          }
        } else {
          // No reportId, save to local storage
          return saveToLocalStorage(dataToSave);
        }
      } catch (err) {
        console.error('Error saving long term data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error saving data');
        
        // Try saving to local storage as a last resort
        console.log('Error occurred, trying to save to local storage as fallback');
        try {
          return saveToLocalStorage(dataToSave);
        } catch (localStorageErr) {
          console.error('Failed to save to local storage fallback:', localStorageErr);
          return null;
        }
      } finally {
        setLoading(false);
        setIsSaving(false);
      }
    },
    [reportId, providedReportId, urlReportId]
  );
  
  // Helper function to save to local storage
  const saveToLocalStorage = useCallback((dataToSave: LongTermData) => {
    try {
      if (typeof window !== 'undefined') {
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
        console.log('Saved long term data to local storage:', formattedData);
        
        // Verify the data was saved correctly
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        console.log('Verification - data in local storage:', savedData ? 'exists' : 'missing');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setData(parsedData);
          return parsedData;
        } else {
          throw new Error('Failed to save to local storage - verification failed');
        }
      } else {
        console.warn('Window object not available, cannot use localStorage');
        throw new Error('Cannot save to local storage - window object not available');
      }
    } catch (localStorageErr) {
      console.error('Error saving to local storage:', localStorageErr);
      throw new Error('Failed to save to local storage');
    }
  }, []);

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    isSaving,
    saveData,
    loadData
  };
}; 