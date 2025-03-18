import { useState, useCallback, useRef, useEffect } from 'react';
import { OSRData, RevenueType, REVENUE_TYPES } from '../types/osr';

interface ValidationErrors {
  [key: string]: {
    revenueSource?: string;
    revenueType?: string;
    actualRevenue?: string;
  }
}

const defaultOSRData: OSRData[] = [
  { revenueSource: '', revenueType: REVENUE_TYPES.PROPERTY_TAX, actualRevenue: 0 },
  { revenueSource: '', revenueType: REVENUE_TYPES.LICENSE, actualRevenue: 0 },
  { revenueSource: '', revenueType: REVENUE_TYPES.SHORT_TERM_USER_CHARGE, actualRevenue: 0 },
  { revenueSource: '', revenueType: REVENUE_TYPES.MIXED_USER_CHARGE, actualRevenue: 0 },
  { revenueSource: '', revenueType: REVENUE_TYPES.LONG_TERM_USER_CHARGE, actualRevenue: 0 }
];

export const useOSRData = (initialData?: OSRData[]) => {
  const [localData, setLocalData] = useState<OSRData[]>(initialData || defaultOSRData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const isUpdating = useRef(false);

  // Only update local data when initial data changes and we're not in the middle of an update
  useEffect(() => {
    if (!isUpdating.current && initialData) {
      setLocalData(initialData);
      setIsDirty(false);
    }
  }, [initialData]);

  const validateData = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    localData.forEach((item, index) => {
      newErrors[index] = {};
      
      if (!item.revenueSource.trim()) {
        newErrors[index].revenueSource = 'Revenue source is required';
        isValid = false;
      }

      if (!item.revenueType) {
        newErrors[index].revenueType = 'Revenue type is required';
        isValid = false;
      }

      if (item.actualRevenue < 0) {
        newErrors[index].actualRevenue = 'Revenue must be non-negative';
        isValid = false;
      }
    });

    // Only update errors if they've changed
    setErrors(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newErrors)) {
        return newErrors;
      }
      return prev;
    });
    
    return isValid;
  }, [localData]);

  const handleRevenueTypeChange = useCallback((index: number, newType: RevenueType) => {
    setIsDirty(true);
    isUpdating.current = true;
    setLocalData(prev => {
      const newData = [...prev];
      newData[index].revenueType = newType;
      return newData;
    });
    isUpdating.current = false;
  }, []);

  const handleRevenueSourceChange = useCallback((index: number, value: string) => {
    setIsDirty(true);
    isUpdating.current = true;
    setLocalData(prev => {
      const newData = [...prev];
      newData[index].revenueSource = value;
      return newData;
    });
    isUpdating.current = false;
  }, []);

  const resetData = useCallback(() => {
    if (initialData) {
      setLocalData(initialData);
    }
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    data: localData,
    errors,
    isDirty,
    validateData,
    handleRevenueTypeChange,
    handleRevenueSourceChange,
    resetData,
    setLocalData,
    setIsDirty
  };
};
