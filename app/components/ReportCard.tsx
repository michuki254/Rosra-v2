'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import CountryBadge from './CountryBadge';
import ConfirmationDialog from './ui/ConfirmationDialog';

interface ReportCardProps {
  report: {
    _id: string;
    title?: string;
    state: string;
    country: string;
    countryCode: string;
    financialYear: string;
    currency: string;
    currencySymbol: string;
    createdAt: string;
    updatedAt?: string;
  };
  onDelete?: (id: string) => Promise<void>;
  isDeleting?: boolean;
  isSubmitted?: boolean;
}

export default function ReportCard({ 
  report, 
  onDelete, 
  isDeleting = false,
  isSubmitted = false
}: ReportCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const updatedAt = new Date(report.updatedAt || report.createdAt);
  const timeAgo = formatDistanceToNow(updatedAt, { addSuffix: false });
  
  // Generate a more descriptive title
  const reportTitle = report.title || (report.state ? `${report.state} Report` : `${report.country} Report`);
  
  // Check if state might be mismatched with country
  // This is a simple check - you might want to implement a more sophisticated validation
  const isStateMismatch = checkStateMismatch(report.state, report.country);
  
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(report._id);
    }
  };
  
  // Helper function to check if state might be mismatched with country
  function checkStateMismatch(state: string, country: string): boolean {
    // Define known states for specific countries
    const countryStates: Record<string, string[]> = {
      'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri'],
      'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
      'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
      // Add more countries and their states as needed
    };
    
    // If we have a list of states for this country, check if the state is in the list
    if (countryStates[country] && state && state !== 'Not specified') {
      return !countryStates[country].includes(state);
    }
    
    // If we don't have a list for this country, don't show a mismatch
    return false;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Report"
        message={`Are you sure you want to delete "${reportTitle}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        type="danger"
      />
      
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated {timeAgo} ago</span>
        </div>
        <div className="flex items-center space-x-2">
          {isSubmitted && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Submitted
            </span>
          )}
          {onDelete && (
            <div className="flex space-x-1">
              <button
                onClick={openDeleteDialog}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500"
                aria-label="Delete report"
                title="Delete report"
              >
                {isDeleting ? (
                  <div className="animate-spin h-5 w-5 border-b-2 border-red-500 rounded-full"></div>
                ) : (
                  <TrashIcon className="h-5 w-5" />
                )}
              </button>
              <Link 
                href={`/rosra-v2?id=${report._id}`} 
                className="text-gray-400 hover:text-blue-500"
                aria-label="Open report"
                title="Open report"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 py-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {reportTitle}
        </h3>
        
        <div className="flex items-center mt-4">
          <div className="mr-3">
            <CountryBadge countryCode={report.countryCode} size="lg" />
          </div>
          <div>
            {report.state && report.state !== 'Not specified' ? (
              <p className="text-lg font-medium">
                <span className="text-gray-600 dark:text-gray-400 text-sm">State/Region:</span> {report.state}, {report.country}
                {isStateMismatch && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg className="mr-1 h-3 w-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Possible mismatch
                  </span>
                )}
              </p>
            ) : (
              <p className="text-lg font-medium">
                {report.country}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Last Financial Year Ending in {report.financialYear}
            </p>
            <p className="text-sm text-gray-500">
              Currency: {report.currency} ({report.currencySymbol})
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/rosra-v2?id=${report._id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <span>OPEN</span>
        </Link>
      </div>
    </div>
  );
} 