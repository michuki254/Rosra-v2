'use client';

import React, { useState, useEffect, useRef } from 'react';
import GapAnalysisLayout from './GapAnalysisLayout';
import ShortTermUserChargeAnalysis from './ShortTermUserChargeAnalysis';
import LongTermUserChargeAnalysis from './LongTermUserChargeAnalysis';
import PropertyTaxAnalysis from './property-tax/PropertyTaxAnalysis';
import LicenseAnalysis from './license/LicenseAnalysis';
import MixedUserChargeAnalysis from './mixed-user-charge/MixedUserChargeAnalysis';
import TotalEstimateAnalysis from './TotalEstimateAnalysis';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { PropertyTaxMetrics } from '@/app/types/propertyTax';
import { LicenseMetrics } from '@/app/types/license';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/app/context/CurrencyContext';

// Define interfaces for the complete data objects
interface PropertyTaxCompleteData {
  metrics: any; // Use any to avoid type conflicts
  saveData: {
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

interface LicenseCompleteData {
  metrics: any; // Use any to avoid type conflicts
  saveData: {
    totalEstimatedBusinesses: number;
    registeredBusinesses: number;
    categories: Array<{
      name: string;
      registeredBusinesses: number;
      compliantBusinesses: number;
      averageFee: number;
      estimatedAverageFee: number;
    }>;
  };
}

// Define the interface for short-term data
export interface ShortTermCompleteData {
  metrics: {
    totalEstimatedRevenue: number;
    totalActualRevenue: number;
    totalGap: number;
    potentialLeveraged: number;
    currencySymbol: string;
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
  saveData: {
    categories: any[];
    country: string;
    state: string;
    totalEstimatedDailyFees: number;
    totalActualDailyFees: number;
  };
}

interface GapAnalysisProps {
  reportData?: {
    selectedCountry?: any;
    selectedYear?: string;
    actualOSR?: string | number;
    budgetedOSR?: string | number;
    population?: string | number;
    gdpPerCapita?: string | number;
  };
  onSaveReport?: (reportData: any) => Promise<any>;
  className?: string;
  onPropertyTaxData?: (data: any) => void;
  onLicenseData?: (data: any) => void;
  onShortTermData?: (data: any) => void;
  onLongTermData?: (data: any) => void;
  onMixedChargeData?: (data: any) => void;
  initialPropertyTaxData?: any;
  initialLicenseData?: any;
  initialShortTermData?: any;
  initialLongTermData?: any;
  initialMixedChargeData?: any;
}

export default function GapAnalysis({
  reportData, 
  onSaveReport,
  className,
  onPropertyTaxData,
  onLicenseData,
  onShortTermData,
  onLongTermData,
  onMixedChargeData,
  initialPropertyTaxData,
  initialLicenseData,
  initialShortTermData,
  initialLongTermData,
  initialMixedChargeData
}: GapAnalysisProps) {
  // State for each OSR component's metrics
  const [shortTermMetrics, setShortTermMetrics] = useState<ShortTermCompleteData>(
    initialShortTermData || {
      metrics: {
        totalEstimatedRevenue: 0,
        totalActualRevenue: 0,
        totalGap: 0,
        potentialLeveraged: 0,
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
      },
      saveData: {
        categories: [],
        country: 'Not specified',
        state: 'Not specified',
        totalEstimatedDailyFees: 0,
        totalActualDailyFees: 0
      }
    }
  );
  const [longTermMetrics, setLongTermMetrics] = useState<any>(initialLongTermData || null);
  
  // Update state to store both metrics and save data
  const [propertyTaxData, setPropertyTaxData] = useState<PropertyTaxCompleteData | null>(initialPropertyTaxData || null);
  const [licenseData, setLicenseData] = useState<LicenseCompleteData | null>(initialLicenseData || null);
  
  // State for mixed charge metrics
  const [mixedChargeMetrics, setMixedChargeMetrics] = useState<any>({
    metrics: {
      actual: 0,
      potential: 0,
      gap: 0,
      gapBreakdown: {
        complianceGap: 0,
        rateGap: 0,
        combinedGaps: 0
      }
    },
    data: {
      estimatedDailyUsers: 0,
      actualDailyUsers: 0,
      averageDailyUserFee: 0,
      actualDailyUserFee: 0,
      availableMonthlyUsers: 0,
      payingMonthlyUsers: 0,
      averageMonthlyRate: 0,
      actualMonthlyRate: 0
    }
  });
  
  // Add activeTab state
  const [activeTab, setActiveTab] = useState<string>('short-term-user-charge');
  
  // Create refs for child components
  const shortTermRef = useRef<any>(null);
  const longTermRef = useRef<any>(null);
  
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');
  
  // Variable to store initial data from API
  const [initialData, setInitialData] = useState<any>(null);
  
  const router = useRouter();
  
  // Get currency data from context
  const { selectedCountry, selectedState } = useCurrency();
  
  // Add state for saving status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Show a toast notification if no reportId is available
  useEffect(() => {
    if (!reportId) {
      toast.error('No report selected. Please create a report to save your analysis.', {
        duration: 5000,
        position: 'top-center',
      });
    }
  }, [reportId]);

  // Load initial data if reportId is available
  useEffect(() => {
    if (reportId) {
      console.log('GapAnalysis - reportId from URL:', reportId);
      
      // Fetch report data from API
      const fetchReportData = async () => {
        try {
          toast.loading('Loading report data...');
          const response = await fetch(`/api/unified-reports/${reportId}`);
          toast.dismiss();
          
          if (response.ok) {
            const data = await response.json();
            console.log('GapAnalysis - Fetched initial data:', data);
            setInitialData(data);
            toast.success('Report data loaded successfully');
          } else {
            console.error('GapAnalysis - Failed to fetch report data:', response.statusText);
            
            if (response.status === 404) {
              toast.error('Report not found. Creating a new report...');
              // If report not found, create a new one
              setTimeout(() => {
                createSampleReport();
              }, 2000);
            } else {
              toast.error('Failed to load report data');
            }
          }
        } catch (error) {
          toast.dismiss();
          console.error('GapAnalysis - Error fetching report data:', error);
          toast.error('Error loading report data');
        }
      };
      
      fetchReportData();
    } else {
      console.log('GapAnalysis - No reportId available from URL');
    }
  }, [reportId]);

  // Function to handle saving the report
  const handleSaveReport = async () => {
    try {
      setIsSaving(true);
      
      // Collect all data
      const dataToSave: any = {
        // Required fields for UnifiedReport model
        title: "Report " + new Date().toLocaleDateString(),
        country: selectedCountry?.name || "Not specified",
        countryCode: selectedCountry?.iso2 || "XX",
        state: selectedState || "Not specified",
        financialYear: new Date().getFullYear().toString(),
        currency: selectedCountry?.currency || "USD",
        currencySymbol: selectedCountry?.currency_symbol || "$",
        actualOSR: reportData?.actualOSR || 0,
        budgetedOSR: reportData?.budgetedOSR || 0,
        population: reportData?.population || 0,
        gdpPerCapita: reportData?.gdpPerCapita || 0,
        
        // Optional data fields
        propertyTax: propertyTaxData,
        license: licenseData,
        shortTerm: shortTermMetrics,
        longTerm: longTermMetrics,
        mixedCharge: {
          metrics: mixedChargeMetrics,
          data: mixedChargeData
        },
        
        // Include report ID if it exists (for updates)
        reportId: reportId
      };
      
      console.log('Data to save in GapAnalysis:', JSON.stringify(dataToSave, null, 2));
      
      // Call parent's onSaveReport if provided
      if (onSaveReport) {
        await onSaveReport(dataToSave);
      }
      
      // Send data to parent components
      if (onPropertyTaxData) {
        onPropertyTaxData(dataToSave.propertyTax);
      }
      
      if (onLicenseData) {
        onLicenseData(dataToSave.license);
      }
      
      if (onShortTermData) {
        onShortTermData(dataToSave.shortTerm);
      }
      
      if (onLongTermData) {
        onLongTermData(dataToSave.longTerm);
      }
      
      if (onMixedChargeData && mixedChargeMetrics && mixedChargeData) {
        console.log('Sending mixed charge data to parent:', dataToSave.mixedCharge);
        onMixedChargeData(dataToSave.mixedCharge);
      } else {
        console.warn('No mixed charge data to send or onMixedChargeData not provided');
      }
      
      toast.success("Report data saved successfully!");
    } catch (error) {
      console.error("Error saving report:", error);
      if (error instanceof Error) {
        toast.error(`Failed to save report: ${error.message}`);
      } else {
        toast.error("Failed to save report");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Add a function to save a simplified report with just the mixed charge data
  const handleSaveSimplifiedReport = async () => {
    try {
      setIsSaving(true);
      
      // Set sample mixed charge data
      const sampleData = {
          metrics: {
          actual: 180000,
          potential: 950000,
          gap: 770000,
            gapBreakdown: {
            complianceGap: 320000,
            rateGap: 280000,
            combinedGaps: 170000
          }
        },
        data: {
          estimatedDailyUsers: 1000,
          actualDailyUsers: 500,
          averageDailyUserFee: 1.5,
          actualDailyUserFee: 1,
          availableMonthlyUsers: 200,
          payingMonthlyUsers: 190,
          averageMonthlyRate: 70,
          actualMonthlyRate: 12
        }
      };
      
      // Prepare a simplified data object to save
      const dataToSave: any = {
        title: "Simplified Test Report",
        country: selectedCountry?.name || "Kenya",
        countryCode: selectedCountry?.iso2 || "KE",
        state: selectedState || "Nairobi",
        financialYear: new Date().getFullYear().toString(),
        currency: selectedCountry?.currency || "KES",
        currencySymbol: selectedCountry?.currency_symbol || "KSh",
        actualOSR: reportData?.actualOSR || 1000000,
        budgetedOSR: reportData?.budgetedOSR || 1500000,
        population: reportData?.population || 5000000,
        gdpPerCapita: reportData?.gdpPerCapita || 2000,
        hasMixedCharge: true,
        mixedCharge: sampleData
      };
      
      // Add reportId if it exists (for updates)
      if (reportId) {
        dataToSave.reportId = reportId;
      }
      
      console.log("Simplified data to save:", JSON.stringify(dataToSave, null, 2));
      
      const response = await fetch("/api/save-report", {
        method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        });

        if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save simplified report. Status:", response.status);
        console.error("Error response:", errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error JSON:", errorJson);
        } catch (e) {
          console.error("Error response is not JSON:", errorText);
        }
        
        throw new Error(`Failed to save simplified report: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
      console.log("Simplified report saved successfully:", result);
      
      // Update the reportId if this was a new report
      if (!reportId && result.report?._id) {
        setReportId(result.report._id);
      }
      
      toast.success("Simplified report saved successfully!");
    } catch (error) {
      console.error("Error saving simplified report:", error);
      if (error instanceof Error) {
        toast.error(`Failed to save simplified report: ${error.message}`);
      } else {
        toast.error("Failed to save simplified report");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Function to directly save the report to the API
  const handleDirectSave = async () => {
    try {
      setIsSaving(true);
      
      // Collect all data
      const dataToSave: any = {
        // Required fields for UnifiedReport model
        title: "Direct Save Report " + new Date().toLocaleDateString(),
        country: selectedCountry?.name || "Not specified",
        countryCode: selectedCountry?.iso2 || "XX",
        state: selectedState || "Not specified",
        financialYear: new Date().getFullYear().toString(),
        currency: selectedCountry?.currency || "USD",
        currencySymbol: selectedCountry?.currency_symbol || "$",
        actualOSR: reportData?.actualOSR || 0,
        budgetedOSR: reportData?.budgetedOSR || 0,
        population: reportData?.population || 0,
        gdpPerCapita: reportData?.gdpPerCapita || 0,
        
        // Optional data fields
        hasPropertyTax: Boolean(propertyTaxData),
        hasLicense: Boolean(licenseData),
        hasShortTerm: Boolean(shortTermMetrics),
        hasLongTerm: Boolean(longTermMetrics),
        hasMixedCharge: Boolean(mixedChargeMetrics),
        
        // Data objects
        propertyTax: propertyTaxData,
        license: licenseData,
        shortTerm: shortTermMetrics,
        longTerm: longTermMetrics,
        mixedCharge: {
          metrics: mixedChargeMetrics,
          data: mixedChargeData
        },
        
        // Include report ID if it exists (for updates)
        reportId: reportId
      };
      
      console.log('Direct save data:', JSON.stringify(dataToSave, null, 2));
      
      const response = await fetch("/api/save-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save report directly. Status:", response.status);
        console.error("Error response:", errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error JSON:", errorJson);
        } catch (e) {
          console.error("Error response is not JSON:", errorText);
        }
        
        throw new Error(`Failed to save report directly: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Direct save result:", result);
      
      // Update the reportId if this was a new report
      if (!reportId && result.report?._id) {
        setReportId(result.report._id);
      }
      
      toast.success("Report saved directly to API!");
    } catch (error) {
      console.error("Error saving report directly:", error);
      if (error instanceof Error) {
        toast.error(`Failed to save report directly: ${error.message}`);
      } else {
        toast.error("Failed to save report directly");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Function to create a sample report if none exists
  const createSampleReport = async () => {
    try {
      toast.loading('Creating sample report...');
      
      // Create a basic report with minimal data
      const sampleData = {
        estimate: {
          country: selectedCountry?.name || 'Kenya',
          countryCode: selectedCountry?.iso2 || 'KE',
          state: 'Not specified',
          financialYear: new Date().getFullYear().toString(),
          currency: selectedCountry?.currency || 'KES',
          currencySymbol: selectedCountry?.currency_symbol || 'KSh',
          actualOSR: 1000000,
          budgetedOSR: 1200000,
          population: 500000,
          gdpPerCapita: 2000
        }
      };
      
      // Save the sample report
      const response = await fetch('/api/save-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create sample report: ${response.statusText}`);
      }
      
      const result = await response.json();
      toast.dismiss();
      toast.success('Sample report created successfully');
      
      // Redirect to the new report
      if (result.reportId) {
        router.push(`/rosra-v2?id=${result.reportId}`);
      }
      
      return result;
    } catch (error) {
      toast.dismiss();
      console.error('Error creating sample report:', error);
      toast.error('Failed to create sample report');
      return null;
    }
  };

  // Add a function to set sample mixed charge data
  const setSampleMixedChargeData = () => {
    const sampleData = {
      metrics: {
        actual: 180000,
        potential: 950000,
        gap: 770000,
        gapBreakdown: {
          complianceGap: 320000,
          rateGap: 280000,
          combinedGaps: 170000
        }
      },
      data: {
        estimatedDailyUsers: 1000,
        actualDailyUsers: 500,
        averageDailyUserFee: 1.5,
        actualDailyUserFee: 1,
        availableMonthlyUsers: 200,
        payingMonthlyUsers: 190,
        averageMonthlyRate: 70,
        actualMonthlyRate: 12
      }
    };
    
    console.log("Setting sample mixed charge data:", sampleData);
    setMixedChargeMetrics(sampleData);
  };

  // Function to view mixed charge data for a report
  const handleViewMixedChargeData = async () => {
    if (!reportId) {
      toast.error('No report ID available');
      return;
    }
    
    try {
      const response = await fetch(`/api/unified-reports/${reportId}/mixed-charge`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch mixed charge data. Status:", response.status);
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch mixed charge data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Mixed charge data from API:", data);
      
      if (data.mixedCharge) {
        console.log("Mixed charge metrics:", data.mixedCharge.metrics);
        console.log("Mixed charge data:", data.mixedCharge.data);
        toast.success("Mixed charge data retrieved successfully!");
      } else {
        console.log("No mixed charge data found for this report");
        toast.error("No mixed charge data found for this report");
      }
    } catch (error) {
      console.error("Error fetching mixed charge data:", error);
      if (error instanceof Error) {
        toast.error(`Failed to fetch mixed charge data: ${error.message}`);
      } else {
        toast.error("Failed to fetch mixed charge data");
      }
    }
  };

  // Function to view short term data for a report
  const handleViewShortTermData = async () => {
    if (!reportId) {
      toast.error('No report ID available');
      return;
    }
    
    try {
      // First try the regular endpoint
      const response = await fetch(`/api/unified-reports/${reportId}/short-term`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch short term data. Status:", response.status);
        console.error("Error response:", errorText);
        toast.error(`Failed to fetch short term data: ${response.status} ${response.statusText}`);
        
        // If the regular endpoint fails, try the debug endpoint
        console.log("Trying debug endpoint instead...");
        const debugResponse = await fetch(`/api/unified-reports/${reportId}/short-term/debug`);
        
        if (!debugResponse.ok) {
          const debugErrorText = await debugResponse.text();
          console.error("Debug endpoint also failed. Status:", debugResponse.status);
          console.error("Debug error response:", debugErrorText);
          throw new Error(`Debug endpoint also failed: ${debugResponse.status} ${debugResponse.statusText}`);
        }
        
        const debugData = await debugResponse.json();
        console.log("Short term debug data from API:", debugData);
        toast.success("Retrieved debug information for short term data");
        return;
      }
      
      const data = await response.json();
      console.log("Short term data from API:", data);
      
      if (data && (data.categories || data.metrics)) {
        console.log("Short term categories:", data.categories?.length || 0);
        console.log("Short term metrics:", data.metrics);
        toast.success("Short term data retrieved successfully!");
      } else {
        console.log("No short term data found for this report");
        toast.error("No short term data found for this report");
      }
    } catch (error) {
      console.error("Error fetching short term data:", error);
      if (error instanceof Error) {
        toast.error(`Failed to fetch short term data: ${error.message}`);
      } else {
        toast.error("Failed to fetch short term data");
      }
    }
  };

  // Call the callback handlers when data changes
  useEffect(() => {
    if (onPropertyTaxData && propertyTaxData) {
      onPropertyTaxData(propertyTaxData);
    }
  }, [propertyTaxData, onPropertyTaxData]);
  
  useEffect(() => {
    if (onLicenseData && licenseData) {
      onLicenseData(licenseData);
    }
  }, [licenseData, onLicenseData]);
  
  useEffect(() => {
    if (onShortTermData && shortTermMetrics) {
      onShortTermData(shortTermMetrics);
    }
  }, [shortTermMetrics, onShortTermData]);
  
  useEffect(() => {
    if (onLongTermData && longTermMetrics) {
      onLongTermData(longTermMetrics);
    }
  }, [longTermMetrics, onLongTermData]);

  useEffect(() => {
    if (onMixedChargeData && mixedChargeMetrics) {
      onMixedChargeData(mixedChargeMetrics);
    }
  }, [mixedChargeMetrics, onMixedChargeData]);

  return (
    <GapAnalysisLayout onSaveReport={handleSaveReport} onSaveSimplifiedReport={handleSaveSimplifiedReport} onDirectSave={handleDirectSave} onViewMixedChargeData={handleViewMixedChargeData} onViewShortTermData={handleViewShortTermData}>
      {!reportId && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-700">
              <strong>No report selected.</strong> You can still analyze data, but to save your analysis, you need to create a report first.
            </p>
            <button
              onClick={createSampleReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Sample Report
            </button>
          </div>
        </div>
      )}
      
      {/* Debug button - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                <strong>Debug Info:</strong> ReportId: {reportId || 'None'}
              </p>
              <button
                onClick={() => {
                  console.log('Debug - reportId:', reportId);
                  console.log('Debug - initialData:', initialData);
                  console.log('Debug - shortTermRef:', shortTermRef.current);
                  console.log('Debug - longTermRef:', longTermRef.current);
                  console.log('Debug - shortTermMetrics:', shortTermMetrics);
                  console.log('Debug - longTermMetrics:', longTermMetrics);
                  
                  // Check if the reportId is valid
                  if (reportId) {
                    fetch(`/api/unified-reports/${reportId}`)
                      .then(response => {
                        console.log('Debug - Report exists:', response.ok);
                        if (response.ok) {
                          return response.json();
                        }
                        throw new Error('Report not found');
                      })
                      .then(data => {
                        console.log('Debug - Report data:', data);
                        toast.success('Report exists and data loaded');
                      })
                      .catch(error => {
                        console.error('Debug - Error checking report:', error);
                        toast.error('Report does not exist or error loading');
                      });
                  }
                  
                  toast.success('Debug info logged to console');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm"
              >
                Debug: Log Info
              </button>
            </div>
            
            {/* Manual reportId input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter report ID manually"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  // Store the value in a variable for the button to use
                  (window as any).manualReportId = e.target.value;
                }}
              />
              <button
                onClick={() => {
                  const manualId = (window as any).manualReportId;
                  if (manualId) {
                    console.log('Setting manual reportId:', manualId);
                    router.push(`/rosra-v2/gap-analysis/${manualId}`);
                  } else {
                    toast.error('Please enter a report ID');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Set ID
              </button>
            </div>
            
            {/* Create sample report button */}
            <button
              onClick={createSampleReport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create New Sample Report
            </button>
            
            {/* Set sample mixed charge data button */}
            <button
              onClick={() => {
                setSampleMixedChargeData();
                handleSaveReport();
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Set Sample Mixed Charge Data and Save
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Property Tax Analysis */}
        <PropertyTaxAnalysis 
          onDataChange={(data: PropertyTaxCompleteData) => {
            console.log('Property Tax data received from PropertyTaxAnalysis:', JSON.stringify(data, null, 2));
            setPropertyTaxData(data);
          }}
          initialData={{
            reportId: reportId,
            ...initialData?.propertyTax
          }} 
        />

        {/* License Analysis */}
        <LicenseAnalysis 
          onMetricsChange={(data: any) => {
            console.log('License data received from LicenseAnalysis:', JSON.stringify(data, null, 2));
            setLicenseData(data);
          }}
          initialData={{
            reportId: reportId,
            ...initialData?.license
          }} 
        />

        {/* Mixed User Charge Analysis */}
        <MixedUserChargeAnalysis 
          onMetricsChange={(data) => {
            console.log('Mixed Charge data received:', JSON.stringify(data, null, 2));
            setMixedChargeMetrics(data);
          }} 
          reportId={reportId || undefined}
          initialData={{
            reportId: reportId,
            ...initialData?.mixedCharge,
            ...initialMixedChargeData
          }}
        />

        {/* Short Term User Charge Analysis */}
        <div id="short-term-user-charge" className={activeTab === 'short-term-user-charge' ? 'block' : 'hidden'}>
          <ShortTermUserChargeAnalysis
            ref={shortTermRef}
            onDataChange={(data) => {
              console.log('Short Term data received from ShortTermUserChargeAnalysis:', JSON.stringify(data, null, 2));
              // Ensure data has the correct structure before setting it
              if (data && data.metrics && data.saveData) {
                setShortTermMetrics(data as ShortTermCompleteData);
              } else {
                console.error('Invalid data structure received from ShortTermUserChargeAnalysis:', data);
              }
            }}
            initialData={{
              reportId: reportId,
              ...initialData?.shortTerm
            }}
          />
        </div>

        {/* Long Term User Charge Analysis */}
        <LongTermUserChargeAnalysis 
          ref={longTermRef}
          onMetricsChange={setLongTermMetrics}
          initialData={{
            reportId: reportId,
            ...initialData?.longTerm
          }}
        />

        {/* Total Estimate Analysis - Shows combined metrics */}
        <TotalEstimateAnalysis 
          onMetricsChange={(metrics) => {
            // Handle total metrics if needed
          }}
        />
      </div>
    </GapAnalysisLayout>
  );
}
