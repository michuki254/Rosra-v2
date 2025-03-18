'use client';

import React, { createContext, useContext, useReducer, useMemo, useCallback, useRef, useEffect } from 'react';
import { LicenseCategory, LicenseMetrics as LicenseMetricsType } from '@/app/types/license';
import { useLicenseCalculations } from '@/app/hooks/useLicenseCalculations';

// Define the GapBreakdown type
export interface GapBreakdown {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
}

// Define the metrics type
export interface LicenseMetrics {
  categories: LicenseCategory[];
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: GapBreakdown;
  analysisMessage?: string;
}

// Define action types
type LicenseAction = 
  | { type: 'UPDATE_CATEGORY'; id: string; field: string; value: any }
  | { type: 'ADD_CATEGORY' }
  | { type: 'DELETE_CATEGORY'; id: string }
  | { type: 'TOGGLE_CATEGORY'; id: string }
  | { type: 'UPDATE_METRICS'; field: string; value: any }
  | { type: 'SET_TOTAL_ESTIMATED_LICENSEES'; value: number }
  | { type: 'SET_CATEGORIES'; categories: LicenseCategory[] };

// Define state interface
interface LicenseState {
  categories: LicenseCategory[];
  totalEstimatedLicensees: number;
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: GapBreakdown;
  analysisMessage?: string;
}

// Define context interface
interface LicenseContextState {
  categories: LicenseCategory[];
  metrics: LicenseMetrics;
  totalEstimatedLicensees: number;
  updateCategory: (id: string, field: string, value: any) => void;
  addCategory: (category?: Partial<LicenseCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  updateMetrics: (field: string, value: any) => void;
  setTotalEstimatedLicensees: (value: number) => void;
  setCategories: (categories: LicenseCategory[]) => void;
}

// Define default categories to use when none are provided
const defaultCategories: LicenseCategory[] = [
  {
    id: crypto.randomUUID(),
    name: "Business Permits",
    registeredLicensees: 15001,
    compliantLicensees: 10000,
    estimatedLicensees: 700003,
    licenseFee: 353,
    averagePaidLicenseFee: 30,
    isExpanded: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Health Licenses",
    registeredLicensees: 3001,
    compliantLicensees: 2500,
    estimatedLicensees: 500034,
    licenseFee: 1534,
    averagePaidLicenseFee: 10,
    isExpanded: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Operating Licenses",
    registeredLicensees: 2004,
    compliantLicensees: 1500,
    estimatedLicensees: 5000,
    licenseFee: 1034,
    averagePaidLicenseFee: 53,
    isExpanded: false,
  }
];

// Create initial state with empty categories by default
const initialState: LicenseState = {
  categories: [], // Start with empty categories
  totalEstimatedLicensees: 800005,
  actual: 0,
  potential: 0,
  gap: 0,
  potentialLeveraged: 0,
  gapBreakdown: {
    registrationGap: 0,
    complianceGap: 0,
    assessmentGap: 0,
    combinedGaps: 0,
  }
};

// Create reducer function
function licenseReducer(state: LicenseState, action: LicenseAction): LicenseState {
  switch (action.type) {
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.id 
            ? { ...category, [action.field]: action.value }
            : category
        )
      };
    
    case 'ADD_CATEGORY':
      const newCategory: LicenseCategory = {
        id: crypto.randomUUID(),
        _id: undefined, // No MongoDB ObjectId for new categories
        name: `Category ${state.categories.length + 1}`,
        registeredLicensees: 1000,
        compliantLicensees: 800,
        estimatedLicensees: 5000,
        licenseFee: 500,
        averagePaidLicenseFee: 400,
        isExpanded: true,
      };
      return {
        ...state,
        categories: [...state.categories, newCategory]
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.id)
      };
    
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.id 
            ? { ...category, isExpanded: !category.isExpanded }
            : category
        )
      };
    
    case 'UPDATE_METRICS':
      return {
        ...state,
        [action.field]: action.value
      };
    
    case 'SET_TOTAL_ESTIMATED_LICENSEES':
      return {
        ...state,
        totalEstimatedLicensees: action.value
      };
    
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
      };
    
    default:
      return state;
  }
}

// Create context
const LicenseContext = createContext<LicenseContextState | undefined>(undefined);

// Create hook for using the context
export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
};

// Create provider component
export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add a ref to track if we've already initialized
  const isInitializedRef = useRef(false);
  const [state, dispatch] = useReducer(licenseReducer, initialState);
  
  // Only initialize with default categories once and only if categories are empty
  useEffect(() => {
    if (!isInitializedRef.current && state.categories.length === 0) {
      isInitializedRef.current = true;
      // Add default categories only if none exist
      dispatch({ type: 'SET_CATEGORIES', categories: defaultCategories });
    }
  }, [state.categories.length]);
  
  // Create memoized action creators
  const updateCategory = useCallback((id: string, field: string, value: any) => {
    dispatch({ type: 'UPDATE_CATEGORY', id, field, value });
  }, []);
  
  const addCategory = useCallback((category?: Partial<LicenseCategory>) => {
    if (category) {
      const newCategory: LicenseCategory = {
        id: category._id || crypto.randomUUID(),
        _id: category._id,
        name: category.name || `Category ${state.categories.length + 1}`,
        registeredLicensees: category.registeredLicensees || 1000,
        compliantLicensees: category.compliantLicensees || 800,
        estimatedLicensees: category.estimatedLicensees || 5000,
        licenseFee: category.licenseFee || 500,
        averagePaidLicenseFee: category.averagePaidLicenseFee || 400,
        isExpanded: true,
      };
      dispatch({ type: 'SET_CATEGORIES', categories: [...state.categories, newCategory] });
    } else {
      dispatch({ type: 'ADD_CATEGORY' });
    }
  }, [state.categories]);
  
  const deleteCategory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', id });
  }, []);
  
  const toggleCategory = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY', id });
  }, []);
  
  const updateMetrics = useCallback((field: string, value: any) => {
    dispatch({ type: 'UPDATE_METRICS', field, value });
  }, []);
  
  const setTotalEstimatedLicensees = useCallback((value: number) => {
    dispatch({ type: 'SET_TOTAL_ESTIMATED_LICENSEES', value });
  }, []);
  
  const setCategories = useCallback((categories: LicenseCategory[]) => {
    dispatch({ type: 'SET_CATEGORIES', categories });
  }, []);
  
  // Create memoized metrics object
  const metrics = useMemo<LicenseMetrics>(() => ({
    categories: state.categories,
    actual: state.actual,
    potential: state.potential,
    gap: state.gap,
    potentialLeveraged: state.potentialLeveraged,
    gapBreakdown: state.gapBreakdown,
    analysisMessage: state.analysisMessage
  }), [state]);
  
  // Create memoized context value
  const contextValue = useMemo<LicenseContextState>(() => ({
    categories: state.categories,
    metrics,
    totalEstimatedLicensees: state.totalEstimatedLicensees,
    updateCategory,
    addCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics,
    setTotalEstimatedLicensees,
    setCategories
  }), [
    state.categories,
    metrics,
    state.totalEstimatedLicensees,
    updateCategory,
    addCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics,
    setTotalEstimatedLicensees,
    setCategories
  ]);
  
  return (
    <LicenseContext.Provider value={contextValue}>
      {children}
    </LicenseContext.Provider>
  );
};
