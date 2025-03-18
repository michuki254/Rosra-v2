'use client'

import { useState } from 'react'
import MethodologyDrawer from '../components/MethodologyDrawer'
import Navbar from '../components/Navbar'
import RosraV2Main from '../components/rosra-v2/RosraV2Main'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisInputs {
  financialYear: string
  currency: string
  state: string
  actualOSR: string
  budgetedOSR: string
  population: string
  gdp: string
}

export default function RosraV2Page() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)
  const [inputs, setInputs] = useState<AnalysisInputs>({
    financialYear: '2019',
    currency: 'KSH',
    state: 'Nairobi',
    actualOSR: '10000000',
    budgetedOSR: '10000000',
    population: '1000000',
    gdp: '1710.5',  // Default Kenya GDP per capita in 2019
  })

  const handleInputChange = (newInputs: AnalysisInputs) => {
    setInputs(newInputs)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              ROSRA Analysis V2
            </h1>
            <p className="text-xl text-blue-100">
              Advanced revenue analysis with enhanced visualization tools.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            {/* Main Analysis Component */}
            <RosraV2Main />
          </div>
        </div>
      </main>

      {/* Modals and Drawers */}
      <MethodologyDrawer
        isOpen={isMethodologyOpen}
        setIsOpen={setIsMethodologyOpen}
      />
    </div>
  )
}