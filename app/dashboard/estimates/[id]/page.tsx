'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePotentialEstimates } from '@/app/hooks/usePotentialEstimates';
import Link from 'next/link';

export default function EstimateDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { getEstimate, updateEstimate, deleteEstimate, loading, error } = usePotentialEstimates();
  const [estimate, setEstimate] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (session) {
      fetchEstimate();
    }
  }, [session, params.id]);

  const fetchEstimate = async () => {
    const data = await getEstimate(params.id);
    if (data) {
      setEstimate(data);
      setFormData({
        country: data.country,
        countryCode: data.countryCode,
        state: data.state,
        financialYear: data.financialYear,
        currency: data.currency,
        currencySymbol: data.currencySymbol,
        actualOSR: data.actualOSR.toString(),
        budgetedOSR: data.budgetedOSR.toString(),
        population: data.population.toString(),
        gdpPerCapita: data.gdpPerCapita.toString(),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateEstimate(params.id, formData);
    
    if (result) {
      setEstimate(result);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this estimate? This action cannot be undone.')) {
      const result = await deleteEstimate(params.id);
      
      if (result) {
        router.push('/dashboard/estimates');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view estimate details.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !estimate) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link
            href="/dashboard/estimates"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Estimates
          </Link>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Estimate Not Found</h2>
          <p>The estimate you're looking for could not be found.</p>
          <Link
            href="/dashboard/estimates"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Estimates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            href="/dashboard/estimates"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Estimates
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {isEditing ? 'Edit Estimate' : 'Estimate Details'}
          </h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg">
          Estimate updated successfully!
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Financial Year
                </label>
                <input
                  type="text"
                  name="financialYear"
                  value={formData.financialYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                    {formData.currencySymbol}
                  </span>
                  <input
                    type="text"
                    value={formData.currency}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700"
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Actual OSR
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {formData.currencySymbol}
                  </span>
                  <input
                    type="text"
                    name="actualOSR"
                    value={formData.actualOSR}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budgeted OSR
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {formData.currencySymbol}
                  </span>
                  <input
                    type="text"
                    name="budgetedOSR"
                    value={formData.budgetedOSR}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Population
                </label>
                <input
                  type="text"
                  name="population"
                  value={formData.population}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GDP per capita
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {formData.currencySymbol}
                  </span>
                  <input
                    type="text"
                    name="gdpPerCapita"
                    value={formData.gdpPerCapita}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{estimate.country}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">State/Province</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{estimate.state}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Financial Year</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{estimate.financialYear}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Currency</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {estimate.currency} ({estimate.currencySymbol})
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Actual OSR</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {estimate.currencySymbol}{estimate.actualOSR.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budgeted OSR</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {estimate.currencySymbol}{estimate.budgetedOSR.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Population</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {estimate.population.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">GDP per capita</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {estimate.currencySymbol}{estimate.gdpPerCapita.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {new Date(estimate.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {new Date(estimate.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 