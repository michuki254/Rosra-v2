'use client';

import React from 'react';

export default function PerformanceTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
        Performance Metrics
      </h2>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">Revenue Collection</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">87%</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Percentage of projected revenue collected in the last fiscal year
          </p>
        </div>
        
        <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">Growth Rate</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+12.3%</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Year-over-year revenue growth compared to previous fiscal period
          </p>
        </div>
        
        <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">Cost Efficiency</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">0.15</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ratio of collection cost to revenue collected (lower is better)
          </p>
        </div>
      </div>
      
      {/* Performance Trends */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6 mb-8">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Performance Trends</h3>
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Revenue Trend Chart Placeholder</p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <h4 className="font-medium text-primary-light dark:text-primary-dark mb-1">Q1</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">$245,890</p>
          </div>
          <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <h4 className="font-medium text-primary-light dark:text-primary-dark mb-1">Q2</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">$267,234</p>
          </div>
          <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <h4 className="font-medium text-primary-light dark:text-primary-dark mb-1">Q3</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">$312,567</p>
          </div>
          <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <h4 className="font-medium text-primary-light dark:text-primary-dark mb-1">Q4</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">$408,876</p>
          </div>
        </div>
      </div>
      
      {/* Revenue Composition */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Revenue Composition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500 dark:text-gray-400">Revenue Composition Chart</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Property Taxes</span>
              </div>
              <span className="text-sm font-medium text-primary-light dark:text-primary-dark">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Business Licenses</span>
              </div>
              <span className="text-sm font-medium text-primary-light dark:text-primary-dark">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-text-light dark:text-text-dark">User Fees</span>
              </div>
              <span className="text-sm font-medium text-primary-light dark:text-primary-dark">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Other Sources</span>
              </div>
              <span className="text-sm font-medium text-primary-light dark:text-primary-dark">12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 