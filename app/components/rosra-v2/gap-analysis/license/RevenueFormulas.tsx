'use client';

import { useState } from 'react';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export const RevenueFormulas = () => {
  const [showFormulas, setShowFormulas] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onClick={() => setShowFormulas(!showFormulas)}
    >
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">License Revenue Analysis Formulas</h3>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            showFormulas ? 'transform rotate-180' : ''
          }`}
        />
      </div>
      {showFormulas && (
        <div className="px-4 py-3 text-sm text-gray-600 border-t space-y-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Actual Revenue</h5>
            <div className="pl-4 font-mono text-sm">
              = <span className="text-blue-600">Compliant Licensees</span> × <span className="text-emerald-600">Average Paid License Fee</span>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Total Potential Revenue</h5>
            <div className="pl-4 font-mono text-sm">
              = <span className="text-blue-600">Estimated Licensees</span> × <span className="text-emerald-600">License Fee</span>
              <br />
              + (<span className="text-blue-600">Unregistered Licensees</span> × <span className="text-emerald-600">Average License Fee</span>)
              <br />
              <span className="pl-4 text-gray-500">where:</span>
              <br />
              <span className="pl-8 text-blue-600">Unregistered Licensees</span> = <span className="text-blue-600">Total Estimated</span> - <span className="text-blue-600">Sum of Registered Licensees</span>
              <br />
              <span className="pl-8 text-emerald-600">Average License Fee</span> = Average of all category license fees
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Total Gap</h5>
            <div className="pl-4 font-mono text-sm">
              = <span className="text-purple-600">Total Potential Revenue</span> - <span className="text-blue-600">Actual Revenue</span>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2">% of Potential Leveraged</h5>
            <div className="pl-4 font-mono text-sm">
              = (<span className="text-blue-600">Actual Revenue</span> ÷ <span className="text-purple-600">Total Potential Revenue</span>) × 100
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueFormulas;
