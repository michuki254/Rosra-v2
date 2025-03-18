'use client';

import React, { createContext, useContext, useReducer, useMemo, useCallback, useRef, useEffect } from 'react';
import { Category, PropertyTaxMetrics, GapBreakdown } from '@/app/types/propertyTax';

// Define action types
type PropertyTaxAction = 
  | { type: 'UPDATE_CATEGORY'; id: string; field: string; value: any }
  | { type: 'UPDATE_CATEGORY_NAME'; id: string; name: string }
  | { type: 'ADD_CATEGORY' }
  | { type: 'DELETE_CATEGORY'; id: string }
  | { type: 'TOGGLE_CATEGORY'; id: string }
  | { type: 'UPDATE_METRICS'; field: string; value: any }
  | { type: 'SET_CATEGORIES'; categories: Category[] };

// Define state interface
interface PropertyTaxState {
  categories: Category[];
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: GapBreakdown;
}

// Define context interface
interface PropertyTaxContextState {
  categories: Category[];
  metrics: PropertyTaxMetrics;
  updateCategory: (id: string, field: string, value: any) => void;
  updateCategoryName: (id: string, name: string) => void;
  addCategory: () => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  updateMetrics: (field: string, value: any) => void;
  setCategories: (categories: Category[]) => void;
}

// Create initial state with empty categories by default
const initialState: PropertyTaxState = {
  categories: [], // Start with empty categories
  totalEstimatedTaxPayers: 70000,
  registeredTaxPayers: 50000,
  actual: 0,
  potential: 0,
  gap: 0,
  potentialLeveraged: 0,
  gapBreakdown: {
    registrationGap: 0,
    complianceGap: 0,
    assessmentGap: 0,
    rateGap: 0,
    combinedGaps: 0,
  }
};

// Define default categories to use when none are provided
const defaultCategories: Category[] = [
  {
    id: crypto.randomUUID(),
    name: "Residential Properties",
    registeredTaxpayers: 30000,
    compliantTaxpayers: 20000,
    averageLandValue: 10000,
    estimatedAverageValue: 30000,
    taxRate: 0.007,
    isExpanded: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Commercial Properties",
    registeredTaxpayers: 15000,
    compliantTaxpayers: 5000,
    averageLandValue: 20000,
    estimatedAverageValue: 60000,
    taxRate: 0.006,
    isExpanded: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Industrial Properties",
    registeredTaxpayers: 5000,
    compliantTaxpayers: 1000,
    averageLandValue: 30000,
    estimatedAverageValue: 40000,
    taxRate: 0.005,
    isExpanded: false,
  }
];

// Create reducer function
function propertyTaxReducer(state: PropertyTaxState, action: PropertyTaxAction): PropertyTaxState {
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
    
    case 'UPDATE_CATEGORY_NAME':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.id 
            ? { ...category, name: action.name }
            : category
        )
      };
    
    case 'ADD_CATEGORY':
      const newCategory = {
        id: crypto.randomUUID(),
        name: `Category ${state.categories.length + 1}`,
        registeredTaxpayers: 5000,
        compliantTaxpayers: 3000,
        averageLandValue: 20000,
        estimatedAverageValue: 30000,
        taxRate: 0.006,
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
const PropertyTaxContext = createContext<PropertyTaxContextState | undefined>(undefined);

// Create hook for using the context
export const usePropertyTax = () => {
  const context = useContext(PropertyTaxContext);
  if (!context) {
    throw new Error('usePropertyTax must be used within a PropertyTaxProvider');
  }
  return context;
};

// Create provider component
export const PropertyTaxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add a ref to track if we've already initialized
  const isInitializedRef = useRef(false);
  const [state, dispatch] = useReducer(propertyTaxReducer, {
    ...initialState,
    categories: defaultCategories // Initialize with default categories immediately
  });
  
  // Ensure default categories are applied if categories are empty
  useEffect(() => {
    if (!isInitializedRef.current && state.categories.length === 0) {
      console.log('Initializing property tax with default categories');
      isInitializedRef.current = true;
      // Add default categories only if none exist
      dispatch({ type: 'SET_CATEGORIES', categories: defaultCategories });
    }
  }, [state.categories.length]);
  
  // Create memoized action creators
  const updateCategory = useCallback((id: string, field: string, value: any) => {
    dispatch({ type: 'UPDATE_CATEGORY', id, field, value });
  }, []);
  
  const updateCategoryName = useCallback((id: string, name: string) => {
    dispatch({ type: 'UPDATE_CATEGORY_NAME', id, name });
  }, []);
  
  const addCategory = useCallback(() => {
    dispatch({ type: 'ADD_CATEGORY' });
  }, []);
  
  const deleteCategory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', id });
  }, []);
  
  const toggleCategory = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY', id });
  }, []);
  
  const updateMetrics = useCallback((field: string, value: any) => {
    dispatch({ type: 'UPDATE_METRICS', field, value });
  }, []);
  
  const setCategories = useCallback((categories: Category[]) => {
    dispatch({ type: 'SET_CATEGORIES', categories });
  }, []);
  
  // Create memoized metrics object
  const metrics = useMemo<PropertyTaxMetrics>(() => ({
    categories: state.categories,
    totalEstimatedTaxPayers: state.totalEstimatedTaxPayers,
    registeredTaxPayers: state.registeredTaxPayers,
    actual: state.actual,
    potential: state.potential,
    gap: state.gap,
    potentialLeveraged: state.potentialLeveraged,
    gapBreakdown: state.gapBreakdown
  }), [state]);
  
  // Create memoized context value
  const contextValue = useMemo<PropertyTaxContextState>(() => ({
    categories: state.categories,
    metrics,
    updateCategory,
    updateCategoryName,
    addCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics,
    setCategories
  }), [
    state.categories,
    metrics,
    updateCategory,
    updateCategoryName,
    addCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics,
    setCategories
  ]);
  
  return (
    <PropertyTaxContext.Provider value={contextValue}>
      {children}
    </PropertyTaxContext.Provider>
  );
};
