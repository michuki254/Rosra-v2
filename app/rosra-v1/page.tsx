'use client'

import Navbar from '../components/Navbar'
import Image from 'next/image'
import { useState } from 'react'
import MethodologyDrawer from '../components/MethodologyDrawer'

export default function RosraV1Page() {
  const [activeTab, setActiveTab] = useState('General')
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)
  
  const tabs = [
    { id: "1", name: "General" },
    { id: "2", name: "Performance" },
    { id: "3", name: "Performance Analysis" },
    { id: "4", name: "Problem" },
    { id: "5", name: "Problem Analysis" },
  ]

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 mb-8">
        <div className="bg-gradient-to-br from-blue-900 via-black to-black py-12 rounded-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
          </div>
          
          {/* Hero Content */}
          <div className="px-8">
            <div className="flex justify-between items-start">
              {/* Left side - Headings */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Sample Report V1
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed">
                  A comprehensive analysis of your local government's revenue performance and optimization opportunities.
                </p>
              </div>

              {/* Right side - Buttons */}
              <div className="flex gap-4">
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Download PDF
                </button>
                <button 
                  className="px-4 py-2 border border-blue-600 text-blue-400 hover:bg-blue-600/10 rounded-lg font-medium transition-colors"
                >
                  Share Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-end gap-4">
        <button
          onClick={() => setIsMethodologyOpen(true)}
          className="px-4 py-2 text-sm font-medium text-primary-light dark:text-primary-dark border border-primary-light dark:border-primary-dark rounded-lg hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors"
        >
          Methodology Guide
        </button>
        <button
          onClick={() => console.log('Export PDF - To be implemented')}
          className="px-4 py-2 text-sm font-medium text-primary-light dark:text-primary-dark border border-primary-light dark:border-primary-dark rounded-lg hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors"
        >
          Export PDF
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-t border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center overflow-x-auto no-scrollbar py-6">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <button
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center px-8 py-2 transition-colors ${
                    activeTab === tab.name
                      ? 'text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    activeTab === tab.name
                      ? 'bg-blue-400 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.id}
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab.name}
                  </span>
                </button>
                {index < tabs.length - 1 && (
                  <div className="h-[2px] w-16 bg-gray-300 dark:bg-gray-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology Drawer */}
      <MethodologyDrawer 
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === 'General' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              General Overview
            </h2>
            {/* Sample Report Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Revenue Overview Card */}
              <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
                <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                  Revenue Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-text-dark">Total Revenue</span>
                    <span className="text-primary-light dark:text-primary-dark font-semibold">$1,234,567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-text-dark">OSR Revenue</span>
                    <span className="text-primary-light dark:text-primary-dark font-semibold">$567,890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-text-dark">Growth Rate</span>
                    <span className="text-green-500 font-semibold">+12.5%</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Card */}
              <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
                <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                  Performance Metrics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-text-dark">Collection Efficiency</span>
                    <span className="text-primary-light dark:text-primary-dark font-semibold">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-text-dark">Coverage Ratio</span>
                    <span className="text-primary-light dark:text-primary-dark font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-text-dark">Compliance Rate</span>
                    <span className="text-primary-light dark:text-primary-dark font-semibold">78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Section */}
            <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-8 mb-12">
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-6">
                Detailed Analysis
              </h2>
              <div className="space-y-6">
                <p className="text-text-light dark:text-text-dark">
                  This sample report demonstrates the comprehensive analysis capabilities of ROSRA V1, 
                  showcasing key metrics and insights for local government revenue optimization.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                    <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-2">Revenue Sources</h3>
                    <p className="text-sm text-text-light dark:text-text-dark">Analysis of primary and secondary revenue streams</p>
                  </div>
                  <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                    <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-2">Collection Methods</h3>
                    <p className="text-sm text-text-light dark:text-text-dark">Evaluation of current collection processes and efficiency</p>
                  </div>
                  <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                    <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-2">Improvement Areas</h3>
                    <p className="text-sm text-text-light dark:text-text-dark">Identified opportunities for revenue optimization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-6">
                Recommendations
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark">Digitize Collection Systems</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Implement digital payment solutions to improve collection efficiency</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark">Update Revenue Database</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Modernize database systems for better tracking and management</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark">Enhance Staff Training</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Invest in capacity building for revenue administration staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Performance' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              Performance Metrics
            </h2>
            {/* Performance content */}
          </div>
        )}

        {activeTab === 'Performance Analysis' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              Performance Analysis
            </h2>
            {/* Performance Analysis content */}
          </div>
        )}

        {activeTab === 'Problem' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              Problem Identification
            </h2>
            {/* Problem content */}
          </div>
        )}

        {activeTab === 'Problem Analysis' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              Problem Analysis
            </h2>
            {/* Problem Analysis content */}
          </div>
        )}
      </div>
    </main>
  )
}

// Add this to your globals.css
// @layer utilities {
//   .no-scrollbar::-webkit-scrollbar {
//     display: none;
//   }
//   .no-scrollbar {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
// } 