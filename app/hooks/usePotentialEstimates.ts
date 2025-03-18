import { useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface PotentialEstimateData {
  country: string;
  countryCode: string;
  state: string;
  financialYear: string;
  currency: string;
  currencySymbol: string;
  actualOSR: string;
  budgetedOSR: string;
  population: string;
  gdpPerCapita: string;
}

interface UsePotentialEstimatesReturn {
  estimates: any[];
  loading: boolean;
  error: string | null;
  saveEstimate: (data: PotentialEstimateData) => Promise<any>;
  getEstimates: () => Promise<void>;
  getEstimate: (id: string) => Promise<any>;
  updateEstimate: (id: string, data: PotentialEstimateData) => Promise<any>;
  deleteEstimate: (id: string) => Promise<any>;
}

export function usePotentialEstimates(): UsePotentialEstimatesReturn {
  const { data: session } = useSession();
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add a cache for estimates
  const estimateCache = useRef<Record<string, any>>({});

  // Save a new estimate
  const saveEstimate = useCallback(async (data: PotentialEstimateData) => {
    if (!session) {
      setError('You must be logged in to save estimates');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Sending data to API:', JSON.stringify(data, null, 2));
      
      const response = await fetch('/api/potential-estimates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API error response:', result);
        throw new Error(result.error || 'Failed to save estimate');
      }

      // Add the new estimate to the list
      setEstimates((prev) => [result.estimate, ...prev]);
      
      // Add to cache
      if (result.estimate._id) {
        estimateCache.current[result.estimate._id] = result.estimate;
      }
      
      return result.estimate;
    } catch (err) {
      console.error('Error in saveEstimate:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get all estimates for the current user
  const getEstimates = useCallback(async () => {
    if (!session) {
      setError('You must be logged in to view estimates');
      return;
    }

    console.log('Getting estimates for user:', session.user?.id);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/potential-estimates');
      const result = await response.json();

      console.log('API response status:', response.status);
      console.log('API response data:', JSON.stringify(result, null, 2));

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch estimates');
      }

      setEstimates(result.estimates);
      
      // Update cache with all estimates
      result.estimates.forEach((estimate: any) => {
        if (estimate._id) {
          estimateCache.current[estimate._id] = estimate;
        }
      });
    } catch (err) {
      console.error('Error in getEstimates:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get a specific estimate by ID
  const getEstimate = useCallback(async (id: string) => {
    if (!session) {
      setError('You must be logged in to view estimates');
      return null;
    }

    // Check if we have this estimate in the cache
    if (estimateCache.current[id]) {
      console.log(`Using cached data for estimate ${id}`);
      return estimateCache.current[id];
    }
    
    // Check if we've already tried to fetch this ID and it failed
    if (estimateCache.current[`error_${id}`]) {
      console.log(`Previously failed to fetch estimate ${id}, not retrying`);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching estimate ${id} for user: ${session.user?.id}`);
      const response = await fetch(`/api/potential-estimates/${id}`);
      
      // Handle 404 specifically
      if (response.status === 404) {
        console.error(`Estimate with ID ${id} not found (404)`);
        // Mark this ID as not found in the cache to prevent future attempts
        estimateCache.current[`error_${id}`] = true;
        return null;
      }
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch estimate');
      }

      // Store in cache
      estimateCache.current[id] = result.estimate;
      
      return result.estimate;
    } catch (err) {
      console.error(`Error fetching estimate ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Mark this ID as errored in the cache to prevent future attempts
      estimateCache.current[`error_${id}`] = true;
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update an existing estimate
  const updateEstimate = useCallback(async (id: string, data: PotentialEstimateData) => {
    if (!session) {
      setError('You must be logged in to update estimates');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/potential-estimates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update estimate');
      }

      // Update the estimate in the list
      setEstimates((prev) =>
        prev.map((est) => (est._id === id ? result.estimate : est))
      );
      
      // Update the cache
      estimateCache.current[id] = result.estimate;

      return result.estimate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Delete an estimate
  const deleteEstimate = useCallback(async (id: string) => {
    if (!session) {
      setError('You must be logged in to delete estimates');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/potential-estimates/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete estimate');
      }

      // Remove the estimate from the list
      setEstimates((prev) => prev.filter((est) => est._id !== id));
      
      // Remove from cache
      if (estimateCache.current[id]) {
        delete estimateCache.current[id];
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  return {
    estimates,
    loading,
    error,
    saveEstimate,
    getEstimates,
    getEstimate,
    updateEstimate,
    deleteEstimate,
  };
} 