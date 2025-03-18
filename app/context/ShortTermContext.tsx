'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';
import { ShortTermCategory, ShortTermMetrics } from '../hooks/useShortTermCalculations';

// Define state interface
interface ShortTermState {
  categories: ShortTermCategory[];
  totalEstimatedDailyFees: number;
  totalActualDailyFees: number;
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: {
    registrationGap: number;
    registrationGapPercentage: number;
    complianceGap: number;
    complianceGapPercentage: number;
    assessmentGap: number;
    combinedGaps: number;
    combinedGapsPercentage: number;
  };
}

// Define context interface
interface ShortTermContextType {
  categories: ShortTermCategory[];
  metrics: ShortTermMetrics;
  totalEstimatedDailyFees: number;
  totalActualDailyFees: number;
  addCategory: () => void;
  updateCategory: (id: string, field: keyof ShortTermCategory, value: number | string) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  updateMetrics: (field: string, value: any) => void;
  setCategories: (categories: ShortTermCategory[]) => void;
  setTotalEstimatedDailyFees: (value: number) => void;
  setTotalActualDailyFees: (value: number) => void;
}

// Create initial state with default values
const initialState: ShortTermState = {
  categories: [],
  totalEstimatedDailyFees: 1000, // Total from Excel
  totalActualDailyFees: 700, // Total from Excel
  actual: 0,
  potential: 0,
  gap: 0,
  potentialLeveraged: 0,
  gapBreakdown: {
    registrationGap: 0,
    registrationGapPercentage: 0,
    complianceGap: 0,
    complianceGapPercentage: 0,
    assessmentGap: 0,
    combinedGaps: 0,
    combinedGapsPercentage: 0
  }
};

// Define default categories to use when none are provided
const defaultCategories: ShortTermCategory[] = [
  {
    id: crypto.randomUUID(),
    name: 'Parking Fees',
    isExpanded: false,
    estimatedDailyFees: 600,
    actualDailyFees: 500,
    potentialRate: 100,
    actualRate: 10
  },
  {
    id: crypto.randomUUID(),
    name: 'Market Fees',
    isExpanded: false,
    estimatedDailyFees: 100,
    actualDailyFees: 50,
    potentialRate: 50,
    actualRate: 5
  },
  {
    id: crypto.randomUUID(),
    name: 'Bus Park Fees',
    isExpanded: false,
    estimatedDailyFees: 300,
    actualDailyFees: 150,
    potentialRate: 150,
    actualRate: 20
  }
];

// Define action types
type ShortTermAction =
  | { type: 'ADD_CATEGORY' }
  | { type: 'UPDATE_CATEGORY'; id: string; field: keyof ShortTermCategory; value: number | string }
  | { type: 'DELETE_CATEGORY'; id: string }
  | { type: 'TOGGLE_CATEGORY'; id: string }
  | { type: 'UPDATE_METRICS'; field: string; value: any }
  | { type: 'SET_CATEGORIES'; categories: ShortTermCategory[] };

// Define reducer function
const shortTermReducer = (state: ShortTermState, action: ShortTermAction): ShortTermState => {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [
          ...state.categories,
          {
            id: crypto.randomUUID(),
            name: `Revenue Source ${state.categories.length + 1}`,
            isExpanded: true,
            estimatedDailyFees: 0,
            actualDailyFees: 0,
            potentialRate: 0,
            actualRate: 0
          }
        ]
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.id ? { ...cat, [action.field]: action.value } : cat
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.id)
      };
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.id ? { ...cat, isExpanded: !cat.isExpanded } : cat
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
};

// Create context
const ShortTermContext = createContext<ShortTermContextType | undefined>(undefined);

// Create hook for using the context
export function useShortTerm() {
  const context = useContext(ShortTermContext);
  if (context === undefined) {
    throw new Error('useShortTerm must be used within a ShortTermProvider');
  }
  return context;
}

// Create provider component
export function ShortTermProvider({ children }: { children: ReactNode }) {
  // Add a ref to track if we've already initialized
  const isInitializedRef = useRef(false);
  const [state, dispatch] = useReducer(shortTermReducer, initialState);
  
  // Only initialize with default categories once and only if categories are empty
  useEffect(() => {
    if (!isInitializedRef.current && state.categories.length === 0) {
      isInitializedRef.current = true;
      // Add default categories only if none exist
      dispatch({ type: 'SET_CATEGORIES', categories: defaultCategories });
    }
  }, [state.categories.length]);
  
  // Create memoized action creators
  const updateCategory = useCallback((id: string, field: keyof ShortTermCategory, value: number | string) => {
    dispatch({ type: 'UPDATE_CATEGORY', id, field, value });
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
  
  const setCategories = useCallback((categories: ShortTermCategory[]) => {
    dispatch({ type: 'SET_CATEGORIES', categories });
  }, []);

  // Calculate total estimated and actual daily fees
  const totalEstimatedDailyFees = useMemo(() => {
    return state.categories.reduce((total, category) => total + (Number(category.estimatedDailyFees) || 0), 0);
  }, [state.categories]);

  const totalActualDailyFees = useMemo(() => {
    return state.categories.reduce((total, category) => total + (Number(category.actualDailyFees) || 0), 0);
  }, [state.categories]);

  // Calculate metrics based on categories
  const metrics = useMemo(() => {
    // Calculate actual revenue
    const actual = state.categories.reduce((total, category) => {
      return total + (Number(category.actualDailyFees) * Number(category.actualRate) * 365);
    }, 0);

    // Calculate potential revenue
    const potential = state.categories.reduce((total, category) => {
      return total + (Number(category.estimatedDailyFees) * Number(category.potentialRate) * 365);
    }, 0);

    // Calculate gap
    const gap = potential - actual;

    // Calculate potentialLeveraged
    const potentialLeveraged = potential > 0 ? (actual / potential) * 100 : 0;

    // Calculate gap breakdown
    const complianceGap = state.categories.reduce((total, category) => {
      const nonCompliantUsers = Number(category.estimatedDailyFees) - Number(category.actualDailyFees);
      return total + (nonCompliantUsers * Number(category.actualRate) * 365);
    }, 0);

    const registrationGap = gap;
    const assessmentGap = state.categories.reduce((total, category) => {
      const rateDiff = Number(category.potentialRate) - Number(category.actualRate);
      return total + (Number(category.actualDailyFees) * rateDiff * 365);
    }, 0);
    const combinedGaps = gap - complianceGap - assessmentGap;

    // Calculate percentages
    const complianceGapPercentage = potential > 0 ? (complianceGap / potential) * 100 : 0;
    const registrationGapPercentage = potential > 0 ? ((potential - actual) / potential) * 100 : 0;
    const combinedGapsPercentage = potential > 0 ? (combinedGaps / potential) * 100 : 0;

    console.log('Calculated metrics:', {
      actual,
      potential,
      gap,
      complianceGap,
      combinedGaps
    });

    return {
      categories: state.categories,
      totalEstimatedDailyFees,
      totalActualDailyFees,
      actual,
      potential,
      gap,
      potentialLeveraged,
      gapBreakdown: {
        registrationGap,
        registrationGapPercentage,
        complianceGap,
        complianceGapPercentage,
        assessmentGap,
        combinedGaps,
        combinedGapsPercentage
      }
    };
  }, [state.categories, totalEstimatedDailyFees, totalActualDailyFees]);

  // Update state metrics when calculated metrics change
  useEffect(() => {
    dispatch({ type: 'UPDATE_METRICS', field: 'actual', value: metrics.actual });
    dispatch({ type: 'UPDATE_METRICS', field: 'potential', value: metrics.potential });
    dispatch({ type: 'UPDATE_METRICS', field: 'gap', value: metrics.gap });
    dispatch({ type: 'UPDATE_METRICS', field: 'potentialLeveraged', value: metrics.potentialLeveraged });
    dispatch({ 
      type: 'UPDATE_METRICS', 
      field: 'gapBreakdown', 
      value: metrics.gapBreakdown 
    });
  }, [metrics]);

  // Create the context value
  const contextValue = {
    ...state,
    updateCategory,
    addCategory,
    deleteCategory,
    toggleCategory,
    updateMetrics,
    setCategories,
    totalEstimatedDailyFees,
    totalActualDailyFees,
    setTotalEstimatedDailyFees: (value: number) => dispatch({ type: 'UPDATE_METRICS', field: 'totalEstimatedDailyFees', value }),
    setTotalActualDailyFees: (value: number) => dispatch({ type: 'UPDATE_METRICS', field: 'totalActualDailyFees', value }),
    metrics
  };
  
  return (
    <ShortTermContext.Provider value={contextValue}>
      {children}
    </ShortTermContext.Provider>
  );
}
