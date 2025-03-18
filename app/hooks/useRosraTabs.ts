import { useState, useMemo } from 'react';

export interface Tab {
  id: string;
  number: string;
  name: string;
  current: boolean;
}

export function useRosraTabs() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = useMemo(() => [
    { id: 'tab-1', number: '1', name: 'Potential Estimates', current: selectedTab === 0 },
    { id: 'tab-2', number: '2', name: 'Gap Analysis', current: selectedTab === 1 },
    { id: 'tab-3', number: '3', name: 'Causes Analysis', current: selectedTab === 2 },
    { id: 'tab-4', number: '4', name: 'Recommendations', current: selectedTab === 3 },
  ], [selectedTab]);

  const currentTabName = useMemo(() => tabs[selectedTab].name, [selectedTab, tabs]);
  const isGapAnalysisTab = useMemo(() => selectedTab === 1, [selectedTab]);

  return {
    selectedTab,
    setSelectedTab,
    tabs,
    currentTabName,
    isGapAnalysisTab
  };
}
