'use client';

import React, { useEffect, useState } from 'react';
import { usePotentialEstimates } from '@/app/hooks/usePotentialEstimates';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { TrashIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function SavedEstimates() {
  const { data: session } = useSession();
  const { estimates, loading, error, getEstimates, deleteEstimate } = usePotentialEstimates();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      getEstimates();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      setIsDeleting(id);
      await deleteEstimate(id);
      setIsDeleting(null);
    }
  };

  const handleRefresh = () => {
    getEstimates();
  };

  if (!session) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to view your saved estimates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Saved Estimates
        </h3>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading estimates...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && estimates.length === 0 && (
        <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            You haven't saved any estimates yet.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-500">
            Fill out the form and click "Save Estimate" to store your data.
          </p>
        </div>
      )}

      {!loading && estimates.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actual OSR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Budgeted OSR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {estimates.map((estimate) => (
                <tr key={estimate._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {estimate.state}, {estimate.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {estimate.financialYear}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {estimate.currencySymbol}{estimate.actualOSR.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {estimate.currencySymbol}{estimate.budgetedOSR.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(estimate.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/estimates/${estimate._id}`}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(estimate._id)}
                        disabled={isDeleting === estimate._id}
                        className={`text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 ${
                          isDeleting === estimate._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isDeleting === estimate._id ? (
                          <div className="animate-spin h-5 w-5 border-b-2 border-red-500 rounded-full"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 