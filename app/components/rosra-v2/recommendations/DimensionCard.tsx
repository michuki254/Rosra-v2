'use client'

import React from 'react';
import { Recommendation, Dimension } from './types';

interface DimensionCardProps {
  dimension: Dimension;
  filteredRecommendations: Recommendation[];
}

export default function DimensionCard({ dimension, filteredRecommendations }: DimensionCardProps) {
  const Icon = dimension.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {dimension.name}
        </h3>
      </div>
      
      <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
        {filteredRecommendations.map(recommendation => (
          <li key={recommendation.id}>
            {recommendation.text}
          </li>
        ))}
      </ul>
    </div>
  );
} 