'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import MethodologyDrawer from '../components/MethodologyDrawer'
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

export default function RosraV2Page() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)
  
  // Handle opening the methodology drawer from the RosraV2Main component
  useEffect(() => {
    // Add a custom event listener for opening the methodology drawer
    const handleOpenMethodology = () => setIsMethodologyOpen(true)
    window.addEventListener('openMethodology', handleOpenMethodology)
    
    return () => {
      window.removeEventListener('openMethodology', handleOpenMethodology)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <MethodologyDrawer 
        isOpen={isMethodologyOpen} 
        onClose={() => setIsMethodologyOpen(false)} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RosraV2Main />
      </div>
    </div>
  )
}