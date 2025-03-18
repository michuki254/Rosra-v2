'use client'

import React, { useState, useEffect } from 'react';
import { FormulaSection } from './mixed-charge/FormulaSection';
import { RevenueSummaryCards, GapBreakdownCards } from './mixed-charge/SummaryCards';
import { RevenueAnalysisText, GapAnalysisText } from './mixed-charge/AnalysisText';
import { MixedRevenueAnalysisChart, MixedGapAnalysisChart } from './mixed-charge/Charts';
import { InputsSection } from './mixed-charge/InputsSection';
import { useMixedCharge } from '@/app/context/MixedChargeContext';
import { useCurrency } from '@/app/context/CurrencyContext';

// Define the props interface
interface MixedUserChargeAnalysisProps {
  onMetricsChange?: (metrics: any) => void;
}

// Default metrics structure
const defaultMetrics = {
  actual: 0,
  potential: 0,
  gap: 0,
  gapBreakdown: {
    complianceGap: 0,
    rateGap: 0,
    combinedGaps: 0
  }
};

// Default data structure
const defaultData = {
  estimatedDailyUsers: 0,
  actualDailyUsers: 0,
  averageDailyUserFee: 0,
  actualDailyUserFee: 0,
  availableMonthlyUsers: 0,
  payingMonthlyUsers: 0,
  averageMonthlyRate: 0,
  actualMonthlyRate: 0
};

export default function MixedUserChargeAnalysis({ onMetricsChange }: MixedUserChargeAnalysisProps) {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const {
    data,
    metrics,
    updateData,
    showGapFormulas,
    showRevenueFormulas,
    toggleGapFormulas,
    toggleRevenueFormulas,
    formatCurrency
  } = useMixedCharge();

  // Log the metrics and data from the hook
  useEffect(() => {
    console.log('MixedUserChargeAnalysis - metrics from hook:', metrics);
    console.log('MixedUserChargeAnalysis - data from hook:', data);
  }, [metrics, data]);

  // Update parent metrics when our metrics change
  useEffect(() => {
    if (onMetricsChange) {
      console.log('MixedUserChargeAnalysis - Sending metrics to parent:', metrics);
      console.log('MixedUserChargeAnalysis - Sending data to parent:', data);
      
      // Create a properly formatted data object
      const formattedData = {
        metrics: {
          actual: metrics.actual || 0,
          potential: metrics.potential || 0,
          gap: metrics.gap || 0,
          gapBreakdown: {
            complianceGap: metrics.gapBreakdown?.complianceGap || 0,
            rateGap: metrics.gapBreakdown?.rateGap || 0,
            combinedGaps: metrics.gapBreakdown?.combinedGaps || 0
          }
        },
        data: {
          estimatedDailyUsers: data.estimatedDailyUsers || 0,
          actualDailyUsers: data.actualDailyUsers || 0,
          averageDailyUserFee: data.averageDailyUserFee || 0,
          actualDailyUserFee: data.actualDailyUserFee || 0,
          availableMonthlyUsers: data.availableMonthlyUsers || 0,
          payingMonthlyUsers: data.payingMonthlyUsers || 0,
          averageMonthlyRate: data.averageMonthlyRate || 0,
          actualMonthlyRate: data.actualMonthlyRate || 0
        }
      };
      
      console.log('MixedUserChargeAnalysis - Formatted data for parent:', formattedData);
      onMetricsChange(formattedData);
    }
  }, [metrics, data, onMetricsChange]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Inputs */}
          <div className="w-full md:w-1/3">
            <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <InputsSection />
            </div>
          </div>

          {/* Right side - Charts and Analysis */}
          <div className="w-full md:w-2/3">
            <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <div className="space-y-8">
                {/* Revenue Analysis Chart */}
                <MixedRevenueAnalysisChart />
 {/* Formula Sections */}
 <div className="space-y-6">
                  <FormulaSection type="gap" />
                  </div>
                {/* Revenue Summary Cards */}
                <RevenueSummaryCards />

                {/* Analysis Text Sections */}
                <div className="space-y-6">
                  <RevenueAnalysisText />
                 
                </div>

              

                {/* Gap Analysis Chart */}
                <MixedGapAnalysisChart />
  {/* Formula Sections */}
  <div className="space-y-6">
                  
                  <FormulaSection type="revenue" />
                </div>
                  {/* Gap Breakdown Cards */}
                  <GapBreakdownCards />
                <div className="space-y-6">
                <GapAnalysisText />
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
