'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [tokenChecked, setTokenChecked] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    // Validate the token when the component mounts
    const validateToken = async () => {
      if (!token || !email) {
        setIsValidToken(false)
        setTokenChecked(true)
        return
      }

      try {
        // Verify the token with the API
        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        })

        const data = await response.json()
        setIsValidToken(response.ok && data.valid)
      } catch (err) {
        setIsValidToken(false)
      } finally {
        setTokenChecked(true)
      }
    }

    validateToken()
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }
      
      // Set success state
      setSuccess(true)
      
      // Clear the form
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An error occurred while resetting your password')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!tokenChecked) {
    return (
      <div className="w-full max-w-md p-8">
        <div className="text-center">
          <p>Validating your reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-center text-primary-light dark:text-primary-dark mb-4">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The password reset link is invalid or has expired.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            Request a new password reset link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-8">
      <div>
        <h2 className="text-3xl font-bold text-center text-primary-light dark:text-primary-dark">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      {success ? (
        <div className="mt-8">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-green-700 dark:text-green-300">
            <p>Your password has been successfully reset.</p>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-primary-light dark:text-primary-dark hover:underline"
            >
              Sign in with your new password
            </Link>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-primary-light/90 dark:hover:bg-primary-dark/90 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  )
} 