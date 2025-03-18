import { useState, useEffect, useCallback } from 'react';
import { ILicenseCategory } from '@/models/LicenseAnalysis';
import { toast } from 'react-hot-toast';

interface LicenseData {
  _id?: string;
  country?: string;
  state?: string;
  reportId?: string;
  totalEstimatedLicensees: number; // Total estimated No of Licensees
  categories: ILicenseCategory[];
  metrics?: { // Analysis metrics
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
    analysisMessage?: string;
  };
  saveData?: {
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

interface UseLicenseDataProps {
  reportId?: string;
  analysisId?: string;
}

export function useLicenseData({ reportId, analysisId }: UseLicenseDataProps = {}) {
  const [data, setData] = useState<LicenseData>({
    totalEstimatedLicensees: 0,
    categories: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch license data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (analysisId) {
        // Fetch by analysis ID
        response = await fetch(`/api/license/${analysisId}`);
      } else if (reportId) {
        // Fetch by report ID
        response = await fetch(`/api/reports/${reportId}/license`);
      } else {
        // No ID provided, try to fetch the most recent analysis
        response = await fetch('/api/license');
        
        if (response.ok) {
          const result = await response.json();
          if (result.analyses && result.analyses.length > 0) {
            // Use the most recent analysis
            setData(result.analyses[0]);
            setLoading(false);
            return;
          }
        }
        
        // If no analyses found or error, set empty data
        setData({
          totalEstimatedLicensees: 0,
          categories: []
        });
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        // If 404, it means no data exists yet, which is fine for new reports/analyses
        if (response.status === 404) {
          setData({
            totalEstimatedLicensees: 0,
            categories: []
          });
          setLoading(false);
          return;
        }
        
        throw new Error(`Failed to fetch license data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching license data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      
      toast.error('Failed to load license data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [reportId, analysisId]);

  // Save license data
  const saveData = async (newData: LicenseData): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    
    try {
      let response;
      let method = 'POST';
      let url = '/api/license';
      
      // If we have an analysis ID, we're updating an existing analysis
      if (analysisId) {
        url = `/api/license/${analysisId}`;
        method = 'PUT';
      } 
      // If we have a report ID but no analysis ID, we're creating/updating a report-specific analysis
      else if (reportId) {
        // Check if data already exists for this report
        const checkResponse = await fetch(`/api/reports/${reportId}/license`);
        method = checkResponse.status === 404 ? 'POST' : 'PUT';
        url = `/api/reports/${reportId}/license`;
        
        // Add reportId to the data
        newData.reportId = reportId;
      }
      // Otherwise, we're creating a new standalone analysis
      
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save license data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      
      toast.success('License data saved successfully');
      
      return true;
    } catch (err) {
      console.error('Error saving license data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving data');
      
      toast.error('Failed to save license data. Please try again.');
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update data locally
  const updateData = (newData: Partial<LicenseData>) => {
    setData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  // Add a new category
  const addCategory = (category: ILicenseCategory) => {
    setData(prevData => ({
      ...prevData,
      categories: [...prevData.categories, category]
    }));
  };

  // Update a category
  const updateCategory = (index: number, categoryData: Partial<ILicenseCategory>) => {
    setData(prevData => {
      const updatedCategories = [...prevData.categories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        ...categoryData
      };
      
      return {
        ...prevData,
        categories: updatedCategories
      };
    });
  };

  // Remove a category
  const removeCategory = (index: number) => {
    setData(prevData => {
      const updatedCategories = [...prevData.categories];
      updatedCategories.splice(index, 1);
      
      return {
        ...prevData,
        categories: updatedCategories
      };
    });
  };

  // Load data on initial render
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isSaving,
    fetchData,
    saveData,
    updateData,
    addCategory,
    updateCategory,
    removeCategory
  };
} 