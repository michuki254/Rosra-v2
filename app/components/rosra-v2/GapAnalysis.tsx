'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
// Comment out problematic imports for now
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
// import { Card } from '@/app/components/ui/card';
import { useGapAnalysis } from '@/app/hooks/useGapAnalysis';
import { GapAnalysisProps, TabConfig } from '@/app/types/analysis';
import PropertyTaxAnalysis from './gap-analysis/property-tax/PropertyTaxAnalysis';
import LicenseAnalysis from './gap-analysis/license/LicenseAnalysis';
import ShortTermUserChargeAnalysis from './gap-analysis/ShortTermUserChargeAnalysis';
import LongTermUserChargeAnalysis from './gap-analysis/LongTermUserChargeAnalysis';
import MixedUserChargeAnalysis from './gap-analysis/MixedUserChargeAnalysis';
import TotalEstimateAnalysis from './gap-analysis/TotalEstimateAnalysis';
import TabButton from '@/app/components/ui/TabButton';

// Configuration for tabs
const TABS: TabConfig[] = [
  {
    id: 'propertyTax',
    label: 'Property Tax',
    component: PropertyTaxAnalysis
  },
  {
    id: 'license',
    label: 'License',
    component: LicenseAnalysis
  },
  {
    id: 'shortTermUserCharge',
    label: 'Short Term User Charge',
    component: ShortTermUserChargeAnalysis
  },
  {
    id: 'longTermUserCharge',
    label: 'Long Term User Charge',
    component: LongTermUserChargeAnalysis
  },
  {
    id: 'mixedUserCharge',
    label: 'Mixed User Charge',
    component: MixedUserChargeAnalysis
  },
  {
    id: 'totalEstimate',
    label: 'Total Estimate',
    component: TotalEstimateAnalysis
  }
];

// Update the props interface to include the new callbacks and initial data
interface ExtendedGapAnalysisProps extends GapAnalysisProps {
  onPropertyTaxData?: (data: any) => void;
  onLicenseData?: (data: any) => void;
  initialPropertyTaxData?: any;
  initialLicenseData?: any;
}

export default function GapAnalysis({ 
  className = '', 
  onPropertyTaxData,
  onLicenseData,
  initialPropertyTaxData,
  initialLicenseData
}: ExtendedGapAnalysisProps) {
  const {
    activeTab,
    inputs,
    handleTabChange,
    handleInputChange,
    isTabActive
  } = useGapAnalysis();

  // Add state to store data from child components
  const [propertyTaxData, setPropertyTaxData] = useState<any>(initialPropertyTaxData || null);
  const [licenseData, setLicenseData] = useState<any>(initialLicenseData || null);
  
  // Add refs to track if initial data has been set
  const initialPropertyTaxDataSetRef = useRef<boolean>(false);
  const initialLicenseDataSetRef = useRef<boolean>(false);

  // Update state when initial data changes
  useEffect(() => {
    if (initialPropertyTaxData && !initialPropertyTaxDataSetRef.current) {
      console.log('Initializing property tax data in GapAnalysis:', initialPropertyTaxData);
      setPropertyTaxData(initialPropertyTaxData);
      initialPropertyTaxDataSetRef.current = true;
    }
  }, [initialPropertyTaxData]);

  useEffect(() => {
    if (initialLicenseData && !initialLicenseDataSetRef.current) {
      console.log('Initializing license data in GapAnalysis:', initialLicenseData);
      setLicenseData(initialLicenseData);
      initialLicenseDataSetRef.current = true;
    }
  }, [initialLicenseData]);

  // Memoize the handlers to prevent unnecessary re-renders
  const handlePropertyTaxDataChange = useCallback((data: any) => {
    console.log('PropertyTaxAnalysis data received in GapAnalysis:', data);
    setPropertyTaxData(data);
  }, []); // Empty dependency array since it only uses setState

  const handleLicenseDataChange = useCallback((data: any) => {
    console.log('LicenseAnalysis data received in GapAnalysis:', data);
    setLicenseData(data);
  }, []); // Empty dependency array since it only uses setState

  // Memoize the parent callbacks to prevent unnecessary re-renders
  const memoizedPropertyTaxCallback = useCallback((data: any) => {
    if (onPropertyTaxData) {
      onPropertyTaxData(data);
    }
  }, [onPropertyTaxData]);

  const memoizedLicenseCallback = useCallback((data: any) => {
    if (onLicenseData) {
      onLicenseData(data);
    }
  }, [onLicenseData]);

  // Log data changes for debugging and notify parent
  useEffect(() => {
    if (propertyTaxData) {
      console.log('GapAnalysis received propertyTaxData:', propertyTaxData);
      memoizedPropertyTaxCallback(propertyTaxData);
    }
  }, [propertyTaxData, memoizedPropertyTaxCallback]);

  useEffect(() => {
    if (licenseData) {
      console.log('GapAnalysis received licenseData:', licenseData);
      memoizedLicenseCallback(licenseData);
    }
  }, [licenseData, memoizedLicenseCallback]);

  // Find the active component
  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={`gap-analysis-container ${className}`}>
      <div className="flex flex-col h-full">
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              active={isTabActive(tab.id)}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
        
        <div className="flex-1 overflow-auto">
          {ActiveComponent === PropertyTaxAnalysis && (
            <PropertyTaxAnalysis
              onDataChange={handlePropertyTaxDataChange}
              initialData={propertyTaxData}
            />
          )}
          {ActiveComponent === LicenseAnalysis && (
            <LicenseAnalysis
              onMetricsChange={handleLicenseDataChange}
              initialData={licenseData}
            />
          )}
          {ActiveComponent && ActiveComponent !== PropertyTaxAnalysis && ActiveComponent !== LicenseAnalysis && (
            <ActiveComponent />
          )}
        </div>
      </div>
    </div>
  );
}