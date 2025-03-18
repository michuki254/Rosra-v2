'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { useSearchParams } from 'next/navigation';
import PotentialEstimates from './PotentialEstimates';
import GapAnalysis from './GapAnalysis';
import CausesAnalysis from './CausesAnalysis';
import Recommendations from './Recommendations';
import TopOSRConfigModal from './TopOSRConfigModal';
import { useRosraTabs } from '../../hooks/useRosraTabs';
import { useRosra } from '../../context/RosraContext';
import { RosraButton } from './ui/RosraButton';
import { classNames } from '../../utils/classNames';
import { PropertyTaxProvider } from '@/app/context/PropertyTaxContext';
import { ShortTermProvider } from '@/app/context/ShortTermContext';
import { LongTermProvider } from '@/app/context/LongTermContext';
import { MixedChargeProvider } from '@/app/context/MixedChargeContext';
import { TotalEstimateProvider } from '@/app/context/TotalEstimateContext';
import { useSession } from 'next-auth/react';
import { useUnifiedReports } from '../../hooks/useUnifiedReports';
import { useCurrency } from '../../context/CurrencyContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { toast } from 'react-hot-toast';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { randomUUID } from 'crypto';

// Icons
const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
  </svg>
);

const ConfigureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function RosraV2Main() {
  const { selectedTab, setSelectedTab, tabs, isGapAnalysisTab } = useRosraTabs();
  const { inputs, updateInputs } = useRosra();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const { 
    saveReport, 
    getReport, 
    updatePropertyTaxData, 
    updateLicenseData,
    updateShortTermData,
    updateLongTermData,
    updateMixedChargeData
  } = useUnifiedReports();
  const { selectedCountry, setSelectedCountry, countries } = useCurrency();
  const { inputs: analysisInputs, updateInputs: updateAnalysisInputs } = useAnalysis();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const loadedReportRef = useRef(false);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [propertyTaxData, setPropertyTaxData] = useState<any>(null);
  const [licenseData, setLicenseData] = useState<any>(null);
  const [shortTermData, setShortTermData] = useState<any>(null);
  const [longTermData, setLongTermData] = useState<any>(null);
  const [mixedChargeData, setMixedChargeData] = useState<any>(null);
  const propertyTaxRef = useRef<any>(null);
  const licenseRef = useRef<any>(null);
  const hasAttemptedCreateRef = useRef(false);

  // Function to handle property tax data from the GapAnalysis component
  const handlePropertyTaxData = useCallback((data: any) => {
    console.log('Received property tax data in RosraV2Main:', data);
    setPropertyTaxData(data);
  }, []);

  // Function to handle license data from the GapAnalysis component
  const handleLicenseData = useCallback((data: any) => {
    console.log('Received license data in RosraV2Main:', data);
    setLicenseData(data);
  }, []);

  // Function to handle short term data from the GapAnalysis component
  const handleShortTermData = useCallback((data: any) => {
    console.log('Received short term data in RosraV2Main:', data);
    setShortTermData(data);
  }, []);

  // Function to handle long term data from the GapAnalysis component
  const handleLongTermData = useCallback((data: any) => {
    console.log('Received long term data in RosraV2Main:', data);
    setLongTermData(data);
  }, []);

  // Function to handle mixed charge data from the GapAnalysis component
  const handleMixedChargeData = useCallback((data: any) => {
    console.log('Received mixed charge data in RosraV2Main:', data);
    setMixedChargeData(data);
  }, []);

  // Load report data if reportId is provided
  useEffect(() => {
    if (reportId && session && !loadedReportRef.current && !isLoading) {
      // Validate reportId format (MongoDB ObjectId is a 24-character hex string)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(reportId);
      
      if (!isValidObjectId) {
        console.error('Invalid report ID format:', reportId);
        toast.error('Invalid report ID format. Please check the URL and try again.');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const loadReportData = async () => {
        try {
          console.log('Loading report data for ID:', reportId);
          
          // Load the report data from the unified reports API
          console.log('Attempting to fetch from unified-reports API:', `/api/unified-reports/${reportId}`);
          const response = await fetch(`/api/unified-reports/${reportId}`);
          
          if (!response.ok) {
            console.log(`Unified API returned status: ${response.status}`);
            // Try the old API endpoint as a fallback
            console.log('Report not found in unified system, trying legacy endpoint');
            console.log('Attempting to fetch from legacy API:', `/api/potential-estimates/${reportId}`);
            
            const legacyResponse = await fetch(`/api/potential-estimates/${reportId}`);
            
            if (!legacyResponse.ok) {
              console.error(`Failed to load report from legacy API. Status: ${legacyResponse.status}`);
              
              // Check if this is an authentication issue
              if (legacyResponse.status === 401) {
                console.error('Authentication error - user may not be logged in');
                toast.error('You must be logged in to access this report.');
              } else if (legacyResponse.status === 404) {
                console.error('Report not found - it may have been deleted or the ID is invalid');
                toast.error('Report not found. It may have been deleted or the ID is invalid.');
              } else {
                console.error('Unknown error loading report');
                toast.error(`Failed to load report: ${legacyResponse.status}`);
              }
              
              setIsLoading(false);
              return;
            }
            
            const legacyData = await legacyResponse.json();
            const legacyReport = legacyData.estimate;
            
            if (legacyReport) {
              // Update the form with the loaded data
              updateAnalysisInputs({
                country: legacyReport.country,
                state: legacyReport.state,
                financialYear: legacyReport.financialYear,
                currency: legacyReport.currency,
                currency_symbol: legacyReport.currencySymbol,
                actualOSR: legacyReport.actualOSR.toString(),
                budgetedOSR: legacyReport.budgetedOSR.toString(),
                population: legacyReport.population.toString(),
                gdp: legacyReport.gdpPerCapita.toString()
              });
              
              // Find the country in the list
              const country = countries.find(c => c.name === legacyReport.country);
              if (country) {
                setSelectedCountry(country);
              }
              
              toast.success('Report loaded successfully from legacy system');
            } else {
              throw new Error('Report not found in legacy system');
            }
          } else {
            const data = await response.json();
            console.log('API response:', data);
            
            const report = data.report;
            
            if (report) {
              console.log('Loaded report data:', report);
              
              // Update the form with the loaded data
              updateAnalysisInputs({
                country: report.country,
                state: report.state,
                financialYear: report.financialYear,
                currency: report.currency,
                currency_symbol: report.currencySymbol,
                actualOSR: report.actualOSR.toString(),
                budgetedOSR: report.budgetedOSR.toString(),
                population: report.population.toString(),
                gdp: report.gdpPerCapita.toString()
              });
              
              // Find the country in the list
              const country = countries.find(c => c.name === report.country);
              if (country) {
                setSelectedCountry(country);
              }
              
              // Load property tax data if available
              if (report.propertyTax) {
                console.log('Setting property tax data from report:', report.propertyTax);
                setPropertyTaxData(report.propertyTax);
              }
              
              // Load license data if available
              if (report.license) {
                console.log('Setting license data from report:', report.license);
                setLicenseData(report.license);
              }
              
              // Load short term data if available
              if (report.shortTerm) {
                console.log('Setting short term data from report:', report.shortTerm);
                setShortTermData(report.shortTerm);
              }
              
              // Load long term data if available
              if (report.longTerm) {
                console.log('Setting long term data from report:', report.longTerm);
                setLongTermData(report.longTerm);
              }
              
              // Load mixed charge data if available
              if (report.mixedCharge) {
                console.log('Setting mixed charge data from report:', report.mixedCharge);
                setMixedChargeData(report.mixedCharge);
              }
              
              toast.success('Report loaded successfully');
            } else {
              throw new Error('Report not found in unified system');
            }
          }
          
        } catch (error) {
          console.error('Error loading report:', error);
          toast.error('Failed to load report: ' + (error instanceof Error ? error.message : 'Unknown error'));
          
          // Don't redirect, just show error message
          // window.location.href = '/rosra-v2';
        } finally {
          // Always mark as loaded to prevent infinite loop
          loadedReportRef.current = true;
          setIsLoading(false);
        }
      };
      
      loadReportData();
    }
  }, [reportId, session, updateAnalysisInputs, countries, setSelectedCountry, isLoading, setPropertyTaxData, setLicenseData, setShortTermData, setLongTermData, setMixedChargeData]);

  // Function to create a sample report if none exists
  const createSampleReport = async () => {
    try {
      // Check if user is logged in
      if (!session?.user?.email) {
        console.log('No user session found, cannot create sample report');
        return;
      }
      
      console.log('Creating sample report for user:', session.user);
      
      // Create a sample report
      const reportData = {
        title: 'Sample Revenue Analysis Report',
        description: 'This is a sample report to demonstrate the ROSRA system',
        country: 'Kenya',
        state: 'Nairobi',
        year: new Date().getFullYear()
      };
      
      console.log('Sending report data:', reportData);
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to create sample report: ${response.status} ${response.statusText}`);
      }
      
      const newReport = await response.json();
      console.log('Sample report created successfully:', newReport);
      toast.success('Sample report created! You can now save your analysis data.');
      
      // Redirect to the new report
      window.location.href = `/rosra-v2?id=${newReport._id}`;
    } catch (error) {
      console.error('Error creating sample report:', error);
      toast.error('Failed to create sample report');
    }
  };
  
  // Check for reports on initial load
  useEffect(() => {
    // Remove the useRef from here and use the one defined at the top level level
    const checkAndCreateSampleReport = async () => {
      // If we've already attempted to create a report or there's no user session, do nothing
      if (hasAttemptedCreateRef.current || !session?.user?.email) {
        return;
      }
      
      // Mark that we've attempted to create a report
      hasAttemptedCreateRef.current = true;
      
      try {
        // Check if any reports exist first
        const reportsResponse = await fetch('/api/reports');
        if (!reportsResponse.ok) {
          console.error('Failed to fetch reports:', reportsResponse.statusText);
          return;
        }
        
        const reports = await reportsResponse.json();
        
        // Only create a sample report if no reports exist
        if (!Array.isArray(reports) || reports.length === 0) {
          console.log('No reports found, creating a sample report');
          createSampleReport();
        } else {
          console.log('Reports already exist, not creating a sample');
        }
      } catch (error) {
        console.error('Error checking for existing reports:', error);
      }
    };
    
    if (session?.user?.email && !reportId) {
      checkAndCreateSampleReport();
    }
  }, [session?.user?.email, reportId]);

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked');
  };

  // Handle saving the report
  const handleSaveReport = async () => {
    if (!session) {
      toast.error('You must be logged in to save a report');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get the current analysis inputs
      const estimateData = {
        id: reportId || undefined,
        country: analysisInputs.country || selectedCountry?.name || 'Default Country',
        countryCode: selectedCountry?.iso2 || 'XX',
        state: analysisInputs.state || '',
        financialYear: analysisInputs.financialYear || new Date().getFullYear().toString(),
        currency: analysisInputs.currency || selectedCountry?.currency || 'USD',
        currencySymbol: analysisInputs.currency_symbol || selectedCountry?.currency_symbol || '$',
        actualOSR: analysisInputs.actualOSR || '0',
        budgetedOSR: analysisInputs.budgetedOSR || '0',
        population: analysisInputs.population || '0',
        gdpPerCapita: analysisInputs.gdp || '0'
      };
      
      // Log the estimate data to verify required fields are set
      console.log('Estimate data for saving:', JSON.stringify(estimateData, null, 2));
      
      // Log the raw data received from the UI components
      console.log('Raw propertyTaxData:', propertyTaxData);
      console.log('Raw licenseData:', licenseData);
      console.log('Raw shortTermData:', shortTermData);
      console.log('Raw longTermData:', longTermData);
      console.log('Raw mixedChargeData:', mixedChargeData);
      
      // Prepare property tax payload - directly use the saveData if available
      let propertyTaxPayload: any = null;
      if (propertyTaxData) {
        console.log('Property tax data to save:', propertyTaxData);
        
        // Create a properly structured payload
        propertyTaxPayload = {
          totalEstimatedTaxPayers: propertyTaxData.saveData?.totalEstimatedTaxPayers || propertyTaxData.metrics?.totalEstimatedTaxPayers || 0,
          registeredTaxPayers: propertyTaxData.saveData?.registeredTaxPayers || propertyTaxData.metrics?.registeredTaxPayers || 0,
          categories: propertyTaxData.saveData?.categories || [],
          metrics: propertyTaxData.metrics || {}
        };
        
        // Log the property tax payload
        console.log('Property tax payload:', JSON.stringify(propertyTaxPayload, null, 2));
      }
      
      // Prepare license payload - directly use the saveData if available
      let licensePayload: any = null;
      if (licenseData && licenseData.saveData) {
        licensePayload = licenseData.saveData;
      }
      
      // Prepare short term payload
      let shortTermPayload: any = null;
      if (shortTermData) {
        console.log('Short term data to save:', shortTermData);
        
        // Create a properly structured payload that matches exactly what the API expects
        shortTermPayload = {
          // Use the data directly as it's already in the correct format
          categories: shortTermData.categories || [],
          totalEstimatedDailyFees: Number(shortTermData.totalEstimatedDailyFees) || 0,
          totalActualDailyFees: Number(shortTermData.totalActualDailyFees) || 0,
          metrics: shortTermData.metrics || {},
          country: shortTermData.country || selectedCountry?.name || 'Not specified',
          state: shortTermData.state || 'Not specified'
        };
        
        // Log the short term payload
        console.log('Short term payload:', JSON.stringify(shortTermPayload, null, 2));
      }
      
      // Prepare long term payload
      let longTermPayload: any = null;
      if (longTermData) {
        longTermPayload = longTermData;
        console.log('Long term payload:', JSON.stringify(longTermPayload, null, 2));
      }
      
      // Prepare mixed charge payload
      let mixedChargePayload: any = null;
      if (mixedChargeData) {
        mixedChargePayload = mixedChargeData;
        console.log('Mixed charge payload:', JSON.stringify(mixedChargePayload, null, 2));
      }
      
      // Save all data in one request
      if (reportId) {
        // If we have a report ID, update each section individually
        if (propertyTaxPayload) {
          await updatePropertyTaxData(reportId, propertyTaxPayload);
        }
        if (licensePayload) {
          await updateLicenseData(reportId, licensePayload);
        }
        if (shortTermPayload) {
          await updateShortTermData(reportId, shortTermPayload);
        }
        if (longTermPayload) {
          await updateLongTermData(reportId, longTermPayload);
        }
        if (mixedChargePayload) {
          await updateMixedChargeData(reportId, mixedChargePayload);
        }
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        toast.success('Report updated successfully');
      } else {
        // For new reports, save everything in one request
        const combinedPayload = {
          estimate: estimateData,
          propertyTax: propertyTaxPayload,
          license: licensePayload,
          shortTerm: shortTermPayload,
          longTerm: longTermPayload,
          mixedCharge: mixedChargePayload
        };
        
        console.log('Combined payload for saving:', JSON.stringify(combinedPayload, null, 2));
        
        const saveResponse = await fetch('/api/save-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(combinedPayload),
        });
        
        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => null);
          console.error('Failed to save report:', {
            status: saveResponse.status,
            statusText: saveResponse.statusText,
            errorData
          });
          toast.error('Failed to save report');
        } else {
          const savedData = await saveResponse.json();
          console.log('Successfully saved report:', savedData);
          
          // Update the URL with the new report ID
          if (savedData.id) {
            router.push(`/rosra-v2?id=${savedData.id}`);
          }
          
          // Show success message
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          toast.success('Report saved successfully');
        }
      }
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to save report');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full">
      <PropertyTaxProvider>
        <ShortTermProvider>
          <LongTermProvider>
            <MixedChargeProvider>
              <TotalEstimateProvider>
                <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-sm">
                  {/* Top Buttons Container */}
                  <div className="flex justify-end mb-4 gap-2 p-4 border-b">
                    {!reportId && (
                      <RosraButton
                        variant="primary"
                        icon={<DocumentTextIcon className="w-5 h-5" />}
                        onClick={createSampleReport}
                      >
                        Create Sample Report
                      </RosraButton>
                    )}
                    
                    <RosraButton
                      variant="primary"
                      icon={<SaveIcon />}
                      onClick={handleSaveReport}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : reportId ? 'Update Report' : 'Save Report'}
                    </RosraButton>
                    
                    <RosraButton
                      variant="export"
                      icon={<ExportIcon />}
                      onClick={handleExport}
                    >
                      Export Analysis
                    </RosraButton>

                    {isGapAnalysisTab && (
                      <RosraButton
                        variant="configure"
                        icon={<ConfigureIcon />}
                        onClick={() => setIsConfigModalOpen(true)}
                      >
                        Configure Top 5 OSR
                      </RosraButton>
                    )}
                  </div>
                  
                  {/* Tabs - Restored to original design */}
                  <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex items-center justify-between mb-8 px-4 relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      {tabs.map((tab, index) => (
                        <div key={tab.id} className="flex items-center flex-1">
                          <Tab className="flex items-center group focus:outline-none relative z-10 w-full">
                            <div className="flex items-center">
                              {/* Number Circle - Enhanced visibility */}
                              <div className={classNames(
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 shadow-sm',
                                selectedTab >= index 
                                  ? 'bg-blue-600 text-white border-2 border-blue-600 dark:bg-blue-500 dark:border-blue-400' 
                                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300'
                              )}>
                                {tab.number}
                              </div>
                              {/* Tab Name - Enhanced visibility */}
                              <span className={classNames(
                                'ml-2 text-sm font-medium transition-all duration-200 relative z-10 px-2 py-1 rounded',
                                selectedTab >= index 
                                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                              )}>
                                {tab.name}
                              </span>
                            </div>
                          </Tab>

                          {/* Connecting Line - Enhanced visibility */}
                          {index < tabs.length - 1 && (
                            <div className="flex-1 mx-4">
                              <div className={classNames(
                                'h-[2px] transition-all duration-200',
                                selectedTab > index 
                                  ? 'bg-blue-500 dark:bg-blue-400' 
                                  : 'bg-gray-200 dark:bg-gray-600'
                              )} />
                            </div>
                          )}
                        </div>
                      ))}
                    </Tab.List>

                    <Tab.Panels className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <Tab.Panel>
                        <PotentialEstimates />
                      </Tab.Panel>

                      <Tab.Panel>
                        <GapAnalysis 
                          className="h-full"
                          onPropertyTaxData={handlePropertyTaxData} 
                          onLicenseData={handleLicenseData}
                          onShortTermData={handleShortTermData}
                          onLongTermData={handleLongTermData}
                          onMixedChargeData={handleMixedChargeData}
                          initialPropertyTaxData={propertyTaxData}
                          initialLicenseData={licenseData}
                          initialShortTermData={shortTermData}
                          initialLongTermData={longTermData}
                          initialMixedChargeData={mixedChargeData}
                        />
                      </Tab.Panel>

                      <Tab.Panel>
                        <CausesAnalysis />
                      </Tab.Panel>

                      <Tab.Panel>
                        <Recommendations />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </TotalEstimateProvider>
            </MixedChargeProvider>
          </LongTermProvider>
        </ShortTermProvider>
      </PropertyTaxProvider>
      
      <TopOSRConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        selectedYear={analysisInputs.financialYear || '2023'}
      />
    </div>
  );
}
