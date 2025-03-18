interface Category {
  id: string;
  name: string;
  isExpanded: boolean;
  estimatedDailyFees: number;
  actualDailyFees: number;
  potentialRate: number;
  actualRate: number;
}

interface CategorySectionProps {
  categories: Category[];
  addCategory: () => void;
  handleCategoryNameChange: (id: string, value: string) => void;
  handleCategoryInputChange: (id: string, field: string, value: number) => void;
  toggleCategory: (id: string) => void;
  deleteCategory: (id: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  addCategory,
  handleCategoryNameChange,
  handleCategoryInputChange,
  toggleCategory,
  deleteCategory,
}) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-base font-medium">Categories</h5>
        <button
          onClick={addCategory}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <span className="text-lg mr-2">+</span>
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div
            key={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-white/10"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                  className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none w-full"
                  placeholder="Category Name"
                />
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${category.isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {category.isExpanded && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estimated Number of Daily Fees
                    </label>
                    <input
                      type="number"
                      value={category.estimatedDailyFees}
                      onChange={(e) => handleCategoryInputChange(category.id, 'estimatedDailyFees', Number(e.target.value))}
                      className="block w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actual Number of Daily Fees
                    </label>
                    <input
                      type="number"
                      value={category.actualDailyFees}
                      onChange={(e) => handleCategoryInputChange(category.id, 'actualDailyFees', Number(e.target.value))}
                      className="block w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Potential Rate payable by Leasees
                    </label>
                    <input
                      type="number"
                      value={category.potentialRate}
                      onChange={(e) => handleCategoryInputChange(category.id, 'potentialRate', Number(e.target.value))}
                      className="block w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actual Rate paid by Leasees
                    </label>
                    <input
                      type="number"
                      value={category.actualRate}
                      onChange={(e) => handleCategoryInputChange(category.id, 'actualRate', Number(e.target.value))}
                      className="block w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={() => deleteCategory(category.id)}
                  className="flex items-center text-red-600 hover:text-red-700 text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete Category
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
