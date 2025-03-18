'use client';

import React from 'react';
import { LongTermProvider } from '@/app/context/LongTermContext';
import { ShortTermProvider } from '@/app/context/ShortTermContext';
import { MixedChargeProvider } from '@/app/context/MixedChargeContext';
import { toast } from 'react-hot-toast';

interface GapAnalysisLayoutProps {
  children: React.ReactNode;
  onSaveReport?: () => Promise<any>;
  onSaveSimplifiedReport?: () => Promise<any>;
  onDirectSave?: () => Promise<any>;
  onViewMixedChargeData?: () => Promise<any>;
  onViewShortTermData?: () => Promise<any>;
}

export default function GapAnalysisLayout({ 
  children, 
  onSaveReport,
  onSaveSimplifiedReport,
  onDirectSave,
  onViewMixedChargeData,
  onViewShortTermData
}: GapAnalysisLayoutProps) {
  const handleSave = async () => {
    if (onSaveReport) {
      try {
        toast.loading('Saving report...');
        await onSaveReport();
        toast.dismiss();
        toast.success('Report saved successfully');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to save report');
        console.error('Error saving report:', error);
      }
    } else {
      toast.error('Save function not available');
    }
  };

  const handleSaveSimplified = async () => {
    if (onSaveSimplifiedReport) {
      try {
        toast.loading('Saving simplified report...');
        await onSaveSimplifiedReport();
        toast.dismiss();
        toast.success('Simplified report saved successfully');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to save simplified report');
        console.error('Error saving simplified report:', error);
      }
    } else {
      toast.error('Simplified save function not available');
    }
  };

  const handleDirectSave = async () => {
    if (onDirectSave) {
      try {
        toast.loading('Saving directly...');
        await onDirectSave();
        toast.dismiss();
        toast.success('Saved directly successfully');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to save directly');
        console.error('Error saving directly:', error);
      }
    } else {
      toast.error('Direct save function not available');
    }
  };

  const handleViewMixedChargeData = async () => {
    if (onViewMixedChargeData) {
      try {
        toast.loading('Viewing mixed charge data...');
        await onViewMixedChargeData();
        toast.dismiss();
        toast.success('Mixed charge data viewed successfully');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to view mixed charge data');
        console.error('Error viewing mixed charge data:', error);
      }
    } else {
      toast.error('View mixed charge data function not available');
    }
  };

  const handleViewShortTermData = async () => {
    if (onViewShortTermData) {
      try {
        toast.loading('Viewing short term data...');
        await onViewShortTermData();
        toast.dismiss();
        toast.success('Short term data viewed successfully');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to view short term data');
        console.error('Error viewing short term data:', error);
      }
    } else {
      toast.error('View short term data function not available');
    }
  };

  return (
    <ShortTermProvider>
      <LongTermProvider>
        <MixedChargeProvider>
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Save Report
            </button>
            <button
              onClick={handleSaveSimplified}
              className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Save Simplified Report
            </button>
            <button
              onClick={handleDirectSave}
              className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Save Directly
            </button>
            <button
              onClick={handleViewMixedChargeData}
              className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              View Mixed Charge Data
            </button>
            <button
              onClick={handleViewShortTermData}
              className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              View Short Term Data
            </button>
          </div>
          {children}
        </MixedChargeProvider>
      </LongTermProvider>
    </ShortTermProvider>
  );
}
