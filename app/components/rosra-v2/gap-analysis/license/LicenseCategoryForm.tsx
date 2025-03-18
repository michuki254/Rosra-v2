'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { LicenseCategory } from '@/app/types/license';
import { Input } from '@/app/components/common/Input';

interface LicenseCategoryFormProps {
  categories: LicenseCategory[];
  onAddCategory: () => void;
  onUpdateCategory: (id: string, field: keyof LicenseCategory, value: number | string) => void;
  onDeleteCategory: (id: string) => void;
  onToggleCategory: (id: string) => void;
}

export const LicenseCategoryForm = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onToggleCategory,
}: LicenseCategoryFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-3">
              <Input
                type="text"
                value={category.name}
                onChange={(e) => onUpdateCategory(category.id, 'name', e.target.value)}
                className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none w-full"
              />
              <button
                onClick={() => onToggleCategory(category.id)}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full"
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
            
            {category.isExpanded && (
              <div className="p-3 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Registered Licensees"
                    type="number"
                    value={category.registeredLicensees}
                    onChange={(e) => onUpdateCategory(category.id, 'registeredLicensees', Number(e.target.value))}
                  />
                  <Input
                    label="Compliant Licensees"
                    type="number"
                    value={category.compliantLicensees}
                    onChange={(e) => onUpdateCategory(category.id, 'compliantLicensees', Number(e.target.value))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Estimated Licensees"
                    type="number"
                    value={category.estimatedLicensees}
                    onChange={(e) => onUpdateCategory(category.id, 'estimatedLicensees', Number(e.target.value))}
                  />
                  <Input
                    label="License Fee"
                    type="number"
                    value={category.licenseFee}
                    onChange={(e) => onUpdateCategory(category.id, 'licenseFee', Number(e.target.value))}
                  />
                </div>

                <Input
                  label="Average Paid License Fee"
                  type="number"
                  value={category.averagePaidLicenseFee}
                  onChange={(e) => onUpdateCategory(category.id, 'averagePaidLicenseFee', Number(e.target.value))}
                />

                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="w-full mt-3 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Category
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Add Category Button */}
      <button
        onClick={onAddCategory}
        className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center justify-center transition-colors duration-200"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add New Category
      </button>
    </div>
  );
};

export default LicenseCategoryForm;
