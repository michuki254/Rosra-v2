import { useState, useMemo } from 'react';
import { RevenueType } from '../types/analysis';

interface UseGapAnalysisProps {
  initialTab?: RevenueType;
}

export const useGapAnalysis = ({ initialTab = 'propertyTax' }: UseGapAnalysisProps = {}) => {
  const [activeTab, setActiveTab] = useState<RevenueType>(initialTab);
  const [inputs, setInputs] = useState({
    financialYear: new Date().getFullYear().toString(),
    country: '',
    state: '',
    actualOSR: '',
    budgetedOSR: '',
    gdp: '',
    population: ''
  });

  const handleTabChange = (tab: RevenueType) => {
    setActiveTab(tab);
  };

  const handleInputChange = (newInputs: typeof inputs) => {
    setInputs(newInputs);
  };

  const isTabActive = (tab: RevenueType) => activeTab === tab;

  return {
    activeTab,
    inputs,
    handleTabChange,
    handleInputChange,
    isTabActive
  };
};
