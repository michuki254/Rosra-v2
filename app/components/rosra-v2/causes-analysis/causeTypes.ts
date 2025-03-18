// Common interface for causes across all OSR types
export interface Cause {
  id: string;
  category: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  recommendations: string[];
} 