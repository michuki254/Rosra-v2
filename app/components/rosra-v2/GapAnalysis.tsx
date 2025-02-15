'use client'

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyTaxAnalysis from './gap-analysis/PropertyTaxAnalysis';
import LicenseAnalysis from './gap-analysis/LicenseAnalysis';
import MixedUserChargeAnalysis from './gap-analysis/MixedUserChargeAnalysis';
import ShortTermUserChargeAnalysis from './gap-analysis/ShortTermUserChargeAnalysis';
import LongTermUserChargeAnalysis from './gap-analysis/LongTermUserChargeAnalysis';
import TotalEstimateAnalysis from './gap-analysis/TotalEstimateAnalysis';

interface GapAnalysisProps {
  className?: string;
  inputs?: AnalysisInputs;
  onInputChange?: (newInputs: AnalysisInputs) => void;
}

const GapAnalysis = ({ className, inputs, onInputChange }: GapAnalysisProps) => {
  const [activeSubTab, setActiveSubTab] = useState('property-tax');
  const [metrics, setMetrics] = useState({
    propertyTax: { actualRevenue: 0, potentialRevenue: 0, gap: 0 },
    license: { actualRevenue: 0, potentialRevenue: 0, gap: 0 },
    mixedUser: { actualRevenue: 0, potentialRevenue: 0, gap: 0 },
    shortTerm: { actualRevenue: 0, potentialRevenue: 0, gap: 0 },
    longTerm: { actualRevenue: 0, potentialRevenue: 0, gap: 0 }
  });

  const handleMetricsChange = (type: keyof typeof metrics, newMetrics: any) => {
    setMetrics(prev => ({
      ...prev,
      [type]: newMetrics
    }));
  };

  const subTabs = [
    { id: 'property-tax', name: 'Property Tax' },
    { id: 'license', name: 'License' },
    { id: 'mixed-user', name: 'Mixed User' },
    { id: 'short-term', name: 'Short Term' },
    { id: 'long-term', name: 'Long Term' },
    { id: 'total-estimate', name: 'Total Estimate' }
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'property-tax':
        return <PropertyTaxAnalysis onMetricsChange={(m) => handleMetricsChange('propertyTax', m)} />;
      
      case 'license':
        return <LicenseAnalysis onMetricsChange={(m) => handleMetricsChange('license', m)} />;
      
      case 'mixed-user':
        return <MixedUserChargeAnalysis onMetricsChange={(m) => handleMetricsChange('mixedUser', m)} />;
      
      case 'short-term':
        return <ShortTermUserChargeAnalysis onMetricsChange={(m) => handleMetricsChange('shortTerm', m)} />;
      
      case 'long-term':
        return <LongTermUserChargeAnalysis onMetricsChange={(m) => handleMetricsChange('longTerm', m)} />;
      
      case 'total-estimate':
        return (
          <TotalEstimateAnalysis
            revenueStreams={[
              {
                name: 'Property Tax',
                type: 'Property Tax',
                ...metrics.propertyTax,
                categories: []
              },
              {
                name: 'License',
                type: 'License',
                ...metrics.license,
                categories: []
              },
              {
                name: 'Mixed User Charge',
                type: 'Mixed User Charge',
                ...metrics.mixedUser,
                categories: []
              },
              {
                name: 'Short Term User Charge',
                type: 'Short-term User Charge',
                ...metrics.shortTerm,
                categories: []
              },
              {
                name: 'Long Term User Charge',
                type: 'Long-term User Charge',
                ...metrics.longTerm,
                categories: []
              }
            ]}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`${className} bg-white dark:bg-gray-900 rounded-lg shadow-lg`}>
      <Tabs defaultValue={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          {subTabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeSubTab} className="p-6 dark:bg-gray-900">
          {renderSubTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GapAnalysis;