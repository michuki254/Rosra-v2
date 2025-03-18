'use client';

import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useOSR } from '@/app/context/OSRContext';
import { useAnalysis } from '@/app/context/AnalysisContext';
import { OSRData, RevenueType, REVENUE_TYPES } from '@/app/types/osr';
import { useOSRData } from '@/app/hooks/useOSRData';
import { calculateTotalTop5, calculateOtherRevenue, formatCurrency } from '@/app/services/osrService';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

interface TopOSRConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: string;
  onSave?: (budgetedOSR: number, totalTop5: number, otherRevenue: number, topOSRData: OSRData[]) => void;
}

const parseNumber = (value: string): number => {
  // Remove commas and any other non-numeric characters except decimal point
  const numStr = value.replace(/[^0-9.-]/g, '');
  return parseFloat(numStr) || 0;
};

export default function TopOSRConfigModal({ 
  isOpen, 
  onClose, 
  selectedYear,
  onSave 
}: TopOSRConfigModalProps) {
  const { osrData, updateOSRData } = useOSR();
  const { inputs, updateInputs } = useAnalysis();
  
  const budgetedOSR = useMemo(() => {
    if (!inputs.budgetedOSR) return 0;
    return parseNumber(inputs.budgetedOSR);
  }, [inputs.budgetedOSR]);

  const actualOSR = useMemo(() => {
    if (!inputs.actualOSR) return 0;
    return parseNumber(inputs.actualOSR);
  }, [inputs.actualOSR]);
  
  const {
    data: localData,
    errors,
    isDirty,
    validateData,
    handleRevenueTypeChange,
    handleRevenueSourceChange,
    resetData,
    setLocalData,
    setIsDirty
  } = useOSRData(osrData);

  const revenueTypeOptions = useMemo(() => Object.values(REVENUE_TYPES), []);

  const totalTop5 = useMemo(() => calculateTotalTop5(localData), [localData]);
  const otherRevenue = useMemo(() => calculateOtherRevenue(actualOSR, totalTop5), [actualOSR, totalTop5]);

  const isUpdating = useRef(false);
  const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] = useState(false);

  const handleActualRevenueChange = useCallback((index: number, value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    const parsedValue = numericValue ? parseFloat(numericValue) : 0;
    
    if (!isNaN(parsedValue)) {
      const newData = localData.map((item, i) => 
        i === index ? { ...item, actualRevenue: parsedValue } : item
      );
      
      // Update both local state and context
      setLocalData(newData);
      updateOSRData(newData); // This will update the context and trigger updates in other components
      setIsDirty(true);
      
      // Calculate new values
      const newTotalTop5 = calculateTotalTop5(newData);
      const newOtherRevenue = calculateOtherRevenue(actualOSR, newTotalTop5);
      
      // Only update parent if values actually changed
      if (newTotalTop5 !== totalTop5) {
        onSave?.(budgetedOSR, newTotalTop5, newOtherRevenue, newData);
      }
    }
  }, [localData, updateOSRData, budgetedOSR, totalTop5, actualOSR, onSave]);

  const handleSave = () => {
    try {
      const newData = osrData.map((item, index) => ({
        ...item,
        actualRevenue: localData[index]?.actualRevenue || 0,
      }));

      const newTotalTop5 = calculateTotalTop5(newData);
      const newOtherRevenue = calculateOtherRevenue(actualOSR, newTotalTop5);

      if (onSave) {
        onSave(budgetedOSR, newTotalTop5, newOtherRevenue, newData);
      }
      updateOSRData(newData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      setIsUnsavedChangesDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    resetData();
    onClose();
    setIsUnsavedChangesDialogOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <ConfirmationDialog
        isOpen={isUnsavedChangesDialogOpen}
        onClose={() => setIsUnsavedChangesDialogOpen(false)}
        onConfirm={handleConfirmClose}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close?"
        confirmButtonText="Yes, Close"
        cancelButtonText="Cancel"
        type="warning"
      />
      
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-lg font-medium">
              Top 5 OSR Last Fiscal Year {selectedYear}
            </Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {localData?.map((item, index) => (
                    <tr key={`osr-item-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={item.revenueSource}
                            onChange={(e) => handleRevenueSourceChange(index, e.target.value)}
                            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                              errors[index]?.revenueSource ? 'border-red-500' : ''
                            }`}
                          />
                          {errors[index]?.revenueSource && (
                            <p className="text-red-500 text-xs">{errors[index].revenueSource}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <select
                            value={item.revenueType}
                            onChange={(e) => handleRevenueTypeChange(index, e.target.value as RevenueType)}
                            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                              errors[index]?.revenueType ? 'border-red-500' : ''
                            }`}
                          >
                            {revenueTypeOptions.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {errors[index]?.revenueType && (
                            <p className="text-red-500 text-xs">{errors[index].revenueType}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={formatCurrency(item.actualRevenue)}
                            onChange={(e) => handleActualRevenueChange(index, e.target.value)}
                            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                              errors[index]?.actualRevenue ? 'border-red-500' : ''
                            }`}
                          />
                          {errors[index]?.actualRevenue && (
                            <p className="text-red-500 text-xs">{errors[index].actualRevenue}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-left font-medium">
                      Total Top 5:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                      {formatCurrency(totalTop5)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-left font-medium">
                      Other Revenue:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                      {formatCurrency(otherRevenue)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-left font-medium">
                      Total Budgeted OSR:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">
                      {formatCurrency(budgetedOSR)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}