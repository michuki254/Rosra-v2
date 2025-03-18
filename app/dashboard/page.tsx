'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUnifiedReports } from '@/app/hooks/useUnifiedReports'
import { ArrowPathIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import ReportCard from '@/app/components/ReportCard'

// Country flag mapping
const countryFlags: Record<string, string> = {
  'Kenya': '🇰🇪',
  'Algeria': '🇩🇿',
  'Albania': '🇦🇱',
  'Nigeria': '🇳🇬',
  'Ghana': '🇬🇭',
  'South Africa': '🇿🇦',
  'Tanzania': '🇹🇿',
  'Uganda': '🇺🇬',
  'Rwanda': '🇷🇼',
  'Ethiopia': '🇪🇹',
  'Egypt': '🇪🇬',
  'Morocco': '🇲🇦',
  'Tunisia': '🇹🇳',
  'Senegal': '🇸🇳',
  'Cameroon': '🇨🇲',
};

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { reports, loading, error, getReports, deleteReport } = useUnifiedReports()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // Fetch reports when authenticated
    if (status === 'authenticated') {
      console.log('Session data:', JSON.stringify(session, null, 2))
      getReports()
    }
  }, [status, router, getReports, session])

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    await deleteReport(id)
    setIsDeleting(null)
  }

  const handleRefresh = () => {
    console.log('Refreshing reports...')
    getReports()
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your saved reports.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Saved Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your saved OSR potential estimates.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          <Link
            href="/rosra-v2"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Report
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="text-center p-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No reports found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You haven't saved any reports yet. Create your first report to get started.
          </p>
          <div className="mt-6">
            <Link
              href="/rosra-v2"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Report
            </Link>
          </div>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            // Determine if report is submitted (this is just for demo, replace with actual status)
            const isSubmitted = Math.random() > 0.5;
            
            return (
              <ReportCard
                key={report._id}
                report={report}
                onDelete={handleDelete}
                isDeleting={isDeleting === report._id}
                isSubmitted={isSubmitted}
              />
            );
          })}
        </div>
      )}
    </div>
  )
} 