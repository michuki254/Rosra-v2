'use client'

import { Fragment, useState, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface TopOSRConfigModalProps {
  isOpen: boolean
  onClose: () => void
  selectedYear: string
  budgetedOSR: number
}

interface OSRData {
  revenueSource: string
  revenueType: string
  actualRevenue: number
}

let otherRevenue: number;

const calculateOtherRevenue = (budgetedOSR: number, totalTop5: number) => {
  const other = budgetedOSR - totalTop5;
  console.log('Budgeted OSR:', budgetedOSR);
  console.log('Other Revenue:', other);
  return other;
};

export default function TopOSRConfigModal({ isOpen, onClose, selectedYear, budgetedOSR }: TopOSRConfigModalProps) {
  const revenueTypes = [
    'Property Tax',
    'License',
    'Mixed User Charge (Markets / Parking)',
    'Long-term User Charge (Government)',
    'Short-term User Charge',
    'Other'
  ]

  const [topOSRData, setTopOSRData] = useState<OSRData[]>([
    {
      revenueSource: 'Land Rates',
      revenueType: 'Property Tax',
      actualRevenue: 1500000
    },
    {
      revenueSource: 'Single Business Permit',
      revenueType: 'License',
      actualRevenue: 375000
    },
    {
      revenueSource: 'Market Fees',
      revenueType: 'Mixed User Charge (Markets / Parking)',
      actualRevenue: 209860
    },
    {
      revenueSource: 'Sign Board Promotion',
      revenueType: 'Long-term User Charge (Government)',
      actualRevenue: 3011250
    },
    {
      revenueSource: 'Rent',
      revenueType: 'Long-term User Charge (Government)',
      actualRevenue: 492000
    }
  ])

  const handleRevenueTypeChange = (index: number, newType: string) => {
    const newData = [...topOSRData]
    newData[index].revenueType = newType
    setTopOSRData(newData)
  }

  const handleActualRevenueChange = (index: number, value: string) => {
    const newData = [...topOSRData]
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '')
    newData[index].actualRevenue = numericValue ? parseFloat(numericValue) : 0
    setTopOSRData(newData)
  }

  // Calculate totals using the Excel formulas:
  // Total of Top 5 = SUM(C4:C8)
  const totalTop5 = useMemo(() => {
    const total = topOSRData.slice(0, 5).reduce((sum, item) => sum + item.actualRevenue, 0);
    console.log('Total of Top 5:', total);
    return total;
  }, [topOSRData]);

  otherRevenue = calculateOtherRevenue(budgetedOSR, totalTop5);
  

  // Let's also log the individual values that make up the total
  console.log('Individual revenues:', topOSRData.slice(0, 5).map(item => ({
    source: item.revenueSource,
    revenue: item.actualRevenue
  })));

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-primary-light dark:text-primary-dark mb-8">
                      Top 5 OSR Last Fiscal Year {selectedYear}
                    </Dialog.Title>
                    
                    <div className="mt-4">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Revenue Source
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Revenue Type
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actual Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {topOSRData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.revenueSource}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                <select
                                  value={item.revenueType}
                                  onChange={(e) => handleRevenueTypeChange(index, e.target.value)}
                                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                >
                                  {revenueTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                                <input
                                  type="text"
                                  value={item.actualRevenue.toLocaleString()}
                                  onChange={(e) => handleActualRevenueChange(index, e.target.value)}
                                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              Total of Top 5
                            </td>
                            <td className="px-6 py-4"></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              {totalTop5.toLocaleString()}
                            </td>
                          </tr>
                          <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              Other Revenue
                            </td>
                            <td className="px-6 py-4"></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              {otherRevenue.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export { calculateOtherRevenue, otherRevenue };