import React from 'react';

// OSR Types
export type OsrType = 'propertyTax' | 'license' | 'shortTermUserCharge' | 'longTermUserCharge' | 'mixedUserCharge';

// OSR types for tab navigation
export const osrTypes = [
  { id: 'propertyTax', label: 'Property Tax' },
  { id: 'license', label: 'License' },
  { id: 'shortTermUserCharge', label: 'Short Term User Charge' },
  { id: 'longTermUserCharge', label: 'Long Term User Charge' },
  { id: 'mixedUserCharge', label: 'Mixed User Charge' },
];

interface OSRTypeSidebarProps {
  activeOsrType: OsrType;
  setActiveOsrType: (osrType: OsrType) => void;
}

export default function OSRTypeSidebar({ activeOsrType, setActiveOsrType }: OSRTypeSidebarProps) {
  return (
    <div className="md:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          OSR Types
        </h3>
        <div className="flex flex-col gap-2">
          {osrTypes.map(osrType => (
            <button
              key={osrType.id}
              className={`px-4 py-2 rounded-md text-left transition-colors ${
                activeOsrType === osrType.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveOsrType(osrType.id as OsrType)}
            >
              {osrType.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 