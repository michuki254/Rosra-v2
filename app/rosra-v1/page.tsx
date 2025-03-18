'use client'

import { useState } from 'react'
import MethodologyDrawer from '../components/MethodologyDrawer'
import TabContainer from '../components/rosra-v1/tabs/TabContainer'

export default function RosraV1Page() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
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
                  onClick={() => setIsMethodologyOpen(true)}
                  className="px-4 py-2 border border-blue-600 text-blue-400 hover:bg-blue-600/10 rounded-lg font-medium transition-colors"
                >
                  View Methodology
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs and Content */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <TabContainer />
      </div>
      
      {/* Methodology Drawer */}
      <MethodologyDrawer 
        isOpen={isMethodologyOpen} 
        onClose={() => setIsMethodologyOpen(false)} 
      />
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