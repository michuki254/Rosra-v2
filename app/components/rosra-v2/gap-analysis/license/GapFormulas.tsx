'use client';

import { useState } from 'react';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export const GapFormulas = () => {
  const [showFormulas, setShowFormulas] = useState(false);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200">
      <button
        onClick={() => setShowFormulas(!showFormulas)}
        className="w-full flex items-center justify-between p-4"
      >
        <span className="flex items-center gap-2">
          <DocumentTextIcon className="h-4 w-4 text-gray-500" />
          <h5 className="text-sm font-medium text-gray-900">License Breakdown Gap Formulas</h5>
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform ${showFormulas ? 'rotate-180' : ''}`}
        />
      </button>

      {showFormulas && (
        <div className="p-4 pt-0 space-y-4">
          <div className="space-y-2">
            <h6 className="text-xs font-medium text-blue-600">Registration Gap</h6>
            <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
              = (Total Estimated - SUM(Registered Licenses)) × AVERAGE(License Fees)
            </p>
          </div>

          <div className="space-y-2">
            <h6 className="text-xs font-medium text-orange-600">Compliance Gap</h6>
            <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
              = SUM((Registered - Compliant) × Average Fee) for each category
            </p>
          </div>

          <div className="space-y-2">
            <h6 className="text-xs font-medium text-green-600">Assessment Gap</h6>
            <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
              = SUM(Estimated × Average Fee) - SUM(Compliant × Average Fee) - Compliance Gap
            </p>
          </div>

          <div className="space-y-2">
            <h6 className="text-xs font-medium text-indigo-600">Combined Gaps</h6>
            <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
              = Total Gap - (Registration Gap + Compliance Gap + Assessment Gap)
            </p>
          </div>

          <div className="space-y-2">
            <h6 className="text-xs font-medium text-purple-600">Category Gap</h6>
            <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
              = (Estimated × Average Fee) - (Compliant × Average Fee) for each category
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GapFormulas;
