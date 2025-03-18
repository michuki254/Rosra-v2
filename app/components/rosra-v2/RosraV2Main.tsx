'use client'

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import PotentialEstimates from './PotentialEstimates';
import GapAnalysis from './GapAnalysis';
import CausesAnalysis from './CausesAnalysis';
import Recommendations from './Recommendations';
import TopOsrConfigModal from './TopOsrConfigModal';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function RosraV2Main() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [inputs, setInputs] = useState({
    financialYear: '2019',
    currency: 'KSH',
    state: 'Nairobi',
    actualOSR: '10000000',
    budgetedOSR: '10000000',
    population: '1000000',
    gdp: '1710.5',  // Default Kenya GDP per capita in 2019
  });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleInputChange = (newInputs: typeof inputs) => {
    setInputs(newInputs);
  };

  const tabs = [
    { number: '1', name: 'Potential Estimates', current: selectedTab === 0 },
    { number: '2', name: 'Gap Analysis', current: selectedTab === 1 },
    { number: '3', name: 'Causes Analysis', current: selectedTab === 2 },
    { number: '4', name: 'Recommendations', current: selectedTab === 3 },
  ];

  return (
    <div className="w-full">
      {/* Top Buttons Container */}
      <div className="flex justify-end mb-4 gap-2">
        {/* Export Button - Visible for all tabs */}
        <button
          onClick={() => {
            // TODO: Implement export functionality
            console.log('Export clicked');
          }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Analysis
        </button>

        {/* Configure Button - Only visible for Gap Analysis */}
        {selectedTab === 1 && (
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Configure Top 5 OSR
          </button>
        )}
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex items-center justify-between mb-8 px-4 relative">
          {tabs.map((tab, index) => (
            <div key={tab.name} className="flex items-center flex-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'flex items-center group focus:outline-none relative z-10'
                  )
                }
              >
                <div className="flex items-center">
                  {/* Number Circle */}
                  <div className={classNames(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 bg-white border-2 relative z-10',
                    selectedTab >= index 
                      ? 'border-blue-500 text-blue-500' 
                      : 'border-gray-300 text-gray-500'
                  )}>
                    {tab.number}
                  </div>
                  {/* Tab Name */}
                  <span className={classNames(
                    'ml-2 text-sm transition-colors duration-200 relative z-10 px-1 bg-white',
                    selectedTab >= index ? 'text-blue-500 font-medium' : 'text-gray-500'
                  )}>
                    {tab.name}
                  </span>
                </div>
              </Tab>

              {/* Connecting Line */}
              {index < tabs.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={classNames(
                    'h-[2px] transition-colors duration-200',
                    selectedTab > index ? 'bg-blue-500' : 'bg-gray-200'
                  )} />
                </div>
              )}
            </div>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-8">
          {/* Potential Estimates Panel */}
          <Tab.Panel>
            <PotentialEstimates 
              inputs={inputs}
              onInputChange={handleInputChange}
              activeTab={tabs[selectedTab].name}
            />
          </Tab.Panel>

          {/* Gap Analysis Panel */}
          <Tab.Panel>
            <GapAnalysis />
          </Tab.Panel>

          {/* Causes Analysis Panel */}
          <Tab.Panel>
            <CausesAnalysis />
          </Tab.Panel>

          {/* Recommendations Panel */}
          <Tab.Panel>
            <Recommendations />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Config Modal */}
      {isConfigModalOpen && (
        <TopOsrConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          selectedYear={inputs.financialYear}
          budgetedOSR={parseFloat(inputs.budgetedOSR) || 0}
        />
      )}
    </div>
  );
}
