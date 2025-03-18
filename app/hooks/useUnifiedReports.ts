import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface UnifiedReportData {
  id?: string;
  country: string;
  countryCode: string;
  state: string;
  financialYear: string;
  currency: string;
  currencySymbol: string;
  actualOSR: string | number;
  budgetedOSR: string | number;
  population: string | number;
  gdpPerCapita: string | number;
  propertyTax?: any;
  license?: any;
  shortTerm?: any;
}

interface UseUnifiedReportsReturn {
  reports: any[];
  loading: boolean;
  error: string | null;
  saveReport: (data: UnifiedReportData) => Promise<any>;
  getReports: () => Promise<void>;
  getReport: (id: string) => Promise<any>;
  updateReport: (id: string, data: Partial<UnifiedReportData>) => Promise<any>;
  deleteReport: (id: string) => Promise<boolean>;
  updatePropertyTaxData: (reportId: string, propertyTaxData: any) => Promise<any>;
  updateLicenseData: (reportId: string, licenseData: any) => Promise<any>;
  updateShortTermData: (reportId: string, shortTermData: any) => Promise<any>;
  updateLongTermData: (reportId: string, longTermData: any) => Promise<any>;
  updateMixedChargeData: (reportId: string, mixedChargeData: any) => Promise<any>;
}

export function useUnifiedReports(): UseUnifiedReportsReturn {
  const { data: session } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get all reports
  const getReports = useCallback(async () => {
    if (!session) {
      setError('You must be logged in to view reports');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/unified-reports');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch reports');
      }

      setReports(result.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get a specific report
  const getReport = useCallback(async (id: string) => {
    if (!session) {
      setError('You must be logged in to view reports');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unified-reports/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch report');
      }

      return result.report;
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Save a new report
  const saveReport = useCallback(async (data: UnifiedReportData) => {
    if (!session) {
      setError('You must be logged in to save reports');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the save-report endpoint for backward compatibility
      const response = await fetch('/api/save-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estimate: {
            id: data.id,
            country: data.country,
            countryCode: data.countryCode,
            state: data.state,
            financialYear: data.financialYear,
            currency: data.currency,
            currencySymbol: data.currencySymbol,
            actualOSR: data.actualOSR,
            budgetedOSR: data.budgetedOSR,
            population: data.population,
            gdpPerCapita: data.gdpPerCapita
          },
          propertyTax: data.propertyTax,
          license: data.license,
          shortTerm: data.shortTerm
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save report');
      }

      // Refresh the reports list
      getReports();

      return result;
    } catch (err) {
      console.error('Error saving report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session, getReports]);

  // Update an existing report
  const updateReport = useCallback(async (id: string, data: Partial<UnifiedReportData>) => {
    if (!session) {
      setError('You must be logged in to update reports');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unified-reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update report');
      }

      // Update the report in the list
      setReports((prev) =>
        prev.map((report) => (report._id === id ? result.report : report))
      );

      return result.report;
    } catch (err) {
      console.error('Error updating report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Delete a report
  const deleteReport = useCallback(async (id: string) => {
    if (!session) {
      setError('You must be logged in to delete reports');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unified-reports/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete report');
      }

      // Remove the report from the list
      setReports((prev) => prev.filter((report) => report._id !== id));

      return true;
    } catch (err) {
      console.error('Error deleting report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update property tax data
  const updatePropertyTaxData = useCallback(async (reportId: string, propertyTaxData: any) => {
    if (!session) {
      setError('You must be logged in to update property tax data');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unified-reports/${reportId}/property-tax`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyTaxData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update property tax data');
      }

      return result.propertyTax;
    } catch (err) {
      console.error('Error updating property tax data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update license data
  const updateLicenseData = useCallback(async (reportId: string, licenseData: any) => {
    if (!session) {
      setError('You must be logged in to update license data');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unified-reports/${reportId}/license`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(licenseData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update license data');
      }

      return result.license;
    } catch (err) {
      console.error('Error updating license data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update short-term data for a report
  const updateShortTermData = useCallback(async (reportId: string, shortTermData: any) => {
    if (!session) {
      setError('You must be logged in to update short-term data');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('=== START: useUnifiedReports.updateShortTermData ===');
      console.log('ReportId:', reportId);
      console.log('Session:', session?.user?.id);
      console.log('Data:', shortTermData);

      // Format the data to match the expected structure
      const formattedData = {
        categories: Array.isArray(shortTermData.categories) 
          ? shortTermData.categories.map((cat: any) => ({
              id: cat.id || crypto.randomUUID(),
              name: cat.name || 'Unnamed Category',
              estimatedDailyFees: Number(cat.estimatedDailyFees) || 0,
              actualDailyFees: Number(cat.actualDailyFees) || 0,
              potentialRate: Number(cat.potentialRate) || 0,
              actualRate: Number(cat.actualRate) || 0,
              daysInYear: Number(cat.daysInYear) || 365
            }))
          : [],
        metrics: {
          actual: Number(shortTermData.metrics?.actual) || 0,
          potential: Number(shortTermData.metrics?.potential) || 0,
          gap: Number(shortTermData.metrics?.gap) || 0,
          potentialLeveraged: Number(shortTermData.metrics?.potentialLeveraged) || 0,
          gapBreakdown: {
            registrationGap: Number(shortTermData.metrics?.gapBreakdown?.registrationGap) || 0,
            registrationGapPercentage: Number(shortTermData.metrics?.gapBreakdown?.registrationGapPercentage) || 0,
            complianceGap: Number(shortTermData.metrics?.gapBreakdown?.complianceGap) || 0,
            complianceGapPercentage: Number(shortTermData.metrics?.gapBreakdown?.complianceGapPercentage) || 0,
            rateGap: Number(shortTermData.metrics?.gapBreakdown?.rateGap) || 0,
            rateGapPercentage: Number(shortTermData.metrics?.gapBreakdown?.rateGapPercentage) || 0,
            combinedGaps: Number(shortTermData.metrics?.gapBreakdown?.combinedGaps) || 0,
            combinedGapsPercentage: Number(shortTermData.metrics?.gapBreakdown?.combinedGapsPercentage) || 0
          },
          totalEstimatedDailyFees: Number(shortTermData.metrics?.totalEstimatedDailyFees) || 0,
          totalActualDailyFees: Number(shortTermData.metrics?.totalActualDailyFees) || 0
        }
      };

      console.log('Sending formatted data to API:', formattedData);

      const response = await fetch(`/api/unified-reports/${reportId}/short-term`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('API Response status:', response.status);
      const result = await response.json();
      console.log('API Response data:', result);

      if (!response.ok) {
        console.error('API returned error:', result.error);
        throw new Error(result.error || 'Failed to update short-term data');
      }

      console.log('=== END: useUnifiedReports.updateShortTermData - Success ===');
      return result.shortTerm;
    } catch (err) {
      console.error('Error in useUnifiedReports.updateShortTermData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.log('=== END: useUnifiedReports.updateShortTermData - Error ===');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update long-term data for a report
  const updateLongTermData = useCallback(async (reportId: string, longTermData: any) => {
    if (!session) {
      setError('You must be logged in to update long-term data');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('=== START: useUnifiedReports.updateLongTermData ===');
      console.log('ReportId:', reportId);
      console.log('Session:', session?.user?.id);
      console.log('Data:', longTermData);

      const response = await fetch(`/api/unified-reports/${reportId}/long-term`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(longTermData),
      });

      console.log('API Response status:', response.status);
      const result = await response.json();
      console.log('API Response data:', result);

      if (!response.ok) {
        console.error('API returned error:', result.error);
        throw new Error(result.error || 'Failed to update long-term data');
      }

      console.log('=== END: useUnifiedReports.updateLongTermData - Success ===');
      return result.longTerm;
    } catch (err) {
      console.error('Error in useUnifiedReports.updateLongTermData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.log('=== END: useUnifiedReports.updateLongTermData - Error ===');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update mixed charge data for a report
  const updateMixedChargeData = useCallback(async (reportId: string, mixedChargeData: any) => {
    if (!session) {
      setError('You must be logged in to update mixed charge data');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('=== START: useUnifiedReports.updateMixedChargeData ===');
      console.log('ReportId:', reportId);
      console.log('Session:', session?.user?.id);
      console.log('Data:', mixedChargeData);

      const response = await fetch(`/api/unified-reports/${reportId}/mixed-charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mixedChargeData),
      });

      console.log('API Response status:', response.status);
      const result = await response.json();
      console.log('API Response data:', result);

      if (!response.ok) {
        console.error('API returned error:', result.error);
        throw new Error(result.error || 'Failed to update mixed charge data');
      }

      console.log('=== END: useUnifiedReports.updateMixedChargeData - Success ===');
      return result.mixedCharge;
    } catch (err) {
      console.error('Error in useUnifiedReports.updateMixedChargeData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.log('=== END: useUnifiedReports.updateMixedChargeData - Error ===');
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  return {
    reports,
    loading,
    error,
    saveReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    updatePropertyTaxData,
    updateLicenseData,
    updateShortTermData,
    updateLongTermData,
    updateMixedChargeData
  };
}