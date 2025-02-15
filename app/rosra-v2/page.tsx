'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MethodologyDrawer from '../components/MethodologyDrawer'
import Navbar from '../components/Navbar'
import Tabs from '../components/Tabs'
import PotentialEstimates from '../components/rosra-v2/PotentialEstimates'
import GapAnalysis from '../components/rosra-v2/GapAnalysis'
import CausesAnalysis from '../components/rosra-v2/CausesAnalysis'
import Recommendations from '../components/rosra-v2/Recommendations'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import TopOSRConfigModal from '../components/rosra-v2/TopOSRConfigModal'
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
  const [activeTab, setActiveTab] = useState('potential')
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  
  // Move inputs state up to parent
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

  const tabs = [
    { id: 'potential', name: 'OSR Potential Estimates' },
    { id: 'gap', name: 'Bottom-Up Gap Analysis' },
    { id: 'causes', name: 'Analysis of Underlying Causes' },
    { id: 'recommendations', name: 'Recommendations' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'potential':
        return (
          <PotentialEstimates 
            inputs={inputs}
            onInputChange={handleInputChange}
          />
        )
      case 'gap':
        return (
          <GapAnalysis 
            inputs={inputs}
            onInputChange={handleInputChange}
          />
        )
      case 'causes':
        return <CausesAnalysis />
      case 'recommendations':
        return <Recommendations />
      default:
        return null
    }
  }

  // Get the selected year from the active tab content
  const getSelectedYear = () => {
    if (activeTab === 'gap') {
      const potentialEstimates = document.querySelector('[name="financialYear"]') as HTMLSelectElement
      return potentialEstimates?.value || '2019'
    }
    return '2019'
  }

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
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  ROSRA Analysis V2
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Advanced revenue analysis with enhanced visualization tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <GapAnalysis 
          inputs={inputs}
          onInputChange={handleInputChange}
        />
      </div>
    </main>
  )
} 