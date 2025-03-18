import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MixedChargeData, MixedChargeMetrics } from '../types/mixed-charge-analysis';

interface MixedChargeCompleteData {
  metrics: MixedChargeMetrics;
  data: MixedChargeData;
}

export const useMixedChargeData = (reportId?: string) => {
  const { data: session } = useSession();
  const [data, setData] = useState<MixedChargeCompleteData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load data from the API
  const loadData = useCallback(async () => {
    if (!session?.user?.id || !reportId) {
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/unified-reports/${reportId}/mixed-charge`);
      
      if (!response.ok) {
        setError(`Failed to load data: ${response.statusText}`);
        return null;
      }

      const result = await response.json();
      setData(result.mixedCharge || null);
      return result.mixedCharge || null;
    } catch (err) {
      setError('An error occurred while loading data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, reportId]);

  // Save data to the API
  const saveData = useCallback(async (dataToSave: MixedChargeCompleteData): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('You must be logged in to save data');
      return false;
    }

    if (!reportId) {
      setError('Report ID is required to save data');
      return false;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/unified-reports/${reportId}/mixed-charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Failed to save data: ${response.statusText}`);
        return false;
      }

      const result = await response.json();
      setData(result.mixedCharge || null);
      return true;
    } catch (err) {
      setError('An error occurred while saving data');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [session?.user?.id, reportId]);

  return {
    data,
    loading,
    error,
    isSaving,
    loadData,
    saveData
  };
};
