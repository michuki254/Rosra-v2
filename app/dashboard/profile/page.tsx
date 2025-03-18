'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization?: string;
  role: string;
  lastLogin?: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // Fetch user profile if authenticated
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile(session.user.id)
    }
  }, [status, session, router])

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}`)
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch user profile')
      }
      
      const data = await res.json()
      setUserProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <Link 
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {userProfile && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{userProfile.firstName} {userProfile.lastName}</h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                userProfile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {userProfile.role}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-2">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">{userProfile.organization || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{new Date(userProfile.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">{userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-x-4">
            <Link 
              href="/dashboard/change-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Password
            </Link>
            
            {userProfile.role === 'admin' && (
              <Link 
                href="/admin/users"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Manage Users
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 