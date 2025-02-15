export default function InputsAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Inputs & Analysis
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Last Financial Year Ending in
            </span>
            <select 
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              <option className="dark:bg-gray-800">2019</option>
              {/* ... other options ... */}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Currency
            </span>
            <select 
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              <option className="dark:bg-gray-800">KES - Kenyan shilling (KSh)</option>
              {/* ... other options ... */}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Population in 2019
            </span>
            <input
              type="number"
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Country
            </span>
            <select 
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              <option className="dark:bg-gray-800">Kenya</option>
              {/* ... other options ... */}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              OSR in 2019
            </span>
            <input
              type="number"
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              GDP in 2019
            </span>
            <input
              type="number"
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              State, Province, Region, or County
            </span>
            <select 
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              <option className="dark:bg-gray-800">Select county</option>
              {/* ... other options ... */}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Budgeted OSR in 2019
            </span>
            <input
              type="number"
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 
                text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700
                focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </label>
        </div>
      </div>
    </div>
  )
} 