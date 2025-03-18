import { useState, useEffect, useCallback } from 'react';
import { ICategory } from '@/models/PropertyTaxAnalysis';
import { toast } from 'react-hot-toast';

interface PropertyTaxData {
  _id?: string;
  country?: string;
  state?: string;
  reportId?: string;
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
  categories: ICategory[];
  metrics?: {
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
    totalEstimatedTaxPayers: number;
    registeredTaxPayers: number;
    categories: Array<{
      name: string;
      registeredTaxpayers: number;
      compliantTaxpayers: number;
      averageLandValue: number;
      estimatedAverageValue: number;
      taxRate: number;
    }>;
  };
}

interface UsePropertyTaxDataProps {
  reportId?: string;
  analysisId?: string;
}

export function usePropertyTaxData({ reportId, analysisId }: UsePropertyTaxDataProps = {}) {
  const [data, setData] = useState<PropertyTaxData>({
    totalEstimatedTaxPayers: 0,
    registeredTaxPayers: 0,
    categories: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch property tax data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (reportId) {
        // Fetch by report ID from unified reports API
        response = await fetch(`/api/unified-reports/${reportId}/property-tax`);
      } else {
        // No ID provided, set empty data
        setData({
          totalEstimatedTaxPayers: 0,
          registeredTaxPayers: 0,
          categories: []
        });
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        // If 404, it means no data exists yet, which is fine for new reports
        if (response.status === 404) {
          setData({
            totalEstimatedTaxPayers: 0,
            registeredTaxPayers: 0,
            categories: []
          });
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch property tax data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching property tax data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      
      toast.error('Failed to load property tax data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Save property tax data
  const saveData = async (newData: PropertyTaxData): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    
    try {
      let response;
      let method = 'POST';
      let url = '/api/property-tax';
      
      // If we have an analysis ID, we're updating an existing analysis
      if (analysisId) {
        url = `/api/property-tax/${analysisId}`;
        method = 'PUT';
      } 
      // If we have a report ID but no analysis ID, we're creating/updating a report-specific analysis
      else if (reportId) {
        // Check if data already exists for this report
        const checkResponse = await fetch(`/api/reports/${reportId}/property-tax`);
        method = checkResponse.status === 404 ? 'POST' : 'PUT';
        url = `/api/reports/${reportId}/property-tax`;
        
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
        throw new Error(`Failed to save property tax data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      
      toast.success('Property tax data saved successfully');
      
      return true;
    } catch (err) {
      console.error('Error saving property tax data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving data');
      
      toast.error('Failed to save property tax data. Please try again.');
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update data locally
  const updateData = (newData: Partial<PropertyTaxData>) => {
    setData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  // Add a new category
  const addCategory = (category: ICategory) => {
    setData(prevData => ({
      ...prevData,
      categories: [...prevData.categories, category]
    }));
  };

  // Update a category
  const updateCategory = (index: number, categoryData: Partial<ICategory>) => {
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