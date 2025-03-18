'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FixShortTermPage() {
  const [reportId, setReportId] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get report ID from URL if available
    const id = searchParams.get('id');
    if (id) {
      setReportId(id);
      fetchReportData(id);
    }
  }, [searchParams]);
  
  const fetchReportData = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      setMessage('Fetching report data...');
      
      const response = await fetch(`/api/test-fix?reportId=${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setReportData(data.report);
        setMessage('Report data fetched successfully');
      } else {
        setError(data.error || 'Failed to fetch report data');
      }
    } catch (err) {
      setError('An error occurred while fetching report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportId) {
      setError('Report ID is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('Fixing short term data...');
      
      // Create a basic short term data structure
      const shortTermData = {
        categories: [],
        country: 'Not specified',
        state: 'Not specified',
        totalEstimatedDailyFees: 0,
        totalActualDailyFees: 0,
        metrics: {
          totalEstimatedRevenue: 0,
          totalActualRevenue: 0,
          totalGap: 0,
          currencySymbol: '$',
          gapBreakdown: {
            registrationGap: 0,
            registrationGapPercentage: 0,
            complianceGap: 0,
            complianceGapPercentage: 0,
            rateGap: 0,
            rateGapPercentage: 0,
            combinedGaps: 0,
            combinedGapsPercentage: 0
          },
          totalEstimatedDailyFees: 0,
          totalActualDailyFees: 0
        }
      };
      
      const response = await fetch('/api/test-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          shortTermData
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setReportData(data.report);
        setMessage('Short term data fixed successfully');
      } else {
        setError(data.error || 'Failed to fix short term data');
      }
    } catch (err) {
      setError('An error occurred while fixing short term data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fix Short Term Data</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="reportId" className="block mb-2">Report ID:</label>
          <input
            type="text"
            id="reportId"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Fix Short Term Data'}
        </button>
      </form>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {reportData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Report Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 