'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCountryInfo } from '../services/countryApi';
import { Tooltip } from './ui/Tooltip';

interface CountryBadgeProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const CountryBadge: React.FC<CountryBadgeProps> = ({
  countryCode,
  size = 'md',
  showTooltip = true,
}) => {
  const [countryData, setCountryData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchCountryData = async () => {
      if (!countryCode) {
        setLoading(false);
        setError('No country code provided');
        return;
      }

      try {
        const data = await getCountryInfo(countryCode);
        
        if (isMounted) {
          setCountryData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in CountryBadge:', err);
        if (isMounted) {
          setError(`Failed to load country data: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setLoading(false);
        }
      }
    };

    fetchCountryData();

    return () => {
      isMounted = false;
    };
  }, [countryCode]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md font-semibold text-gray-800 dark:text-gray-200 p-1">
        <span className="animate-pulse">{countryCode}</span>
      </div>
    );
  }

  // With country data
  const badge = (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-md overflow-hidden border border-gray-200 dark:border-gray-600`}>
      {countryData && countryData.flag ? (
        <Image 
          src={countryData.flag} 
          alt={`${countryData.name} flag`}
          fill 
          style={{ objectFit: 'cover' }} 
          onError={(e) => {
            // Fallback if flag image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
            setError('Flag image failed to load');
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-200">
          {countryCode}
        </div>
      )}
    </div>
  );

  // If tooltip is disabled or we have an error, just return the badge
  if (!showTooltip || error || !countryData) {
    return badge;
  }

  // With tooltip
  return (
    <Tooltip
      content={
        <div className="p-2 max-w-xs">
          <div className="font-semibold mb-1">{countryData.name}</div>
          <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
            <span className="text-gray-500">Capital:</span>
            <span>{countryData.capital || 'N/A'}</span>
            
            <span className="text-gray-500">Region:</span>
            <span>{countryData.region || 'N/A'}</span>
            
            <span className="text-gray-500">Population:</span>
            <span>{countryData.population?.toLocaleString() || 'N/A'}</span>
            
            <span className="text-gray-500">Currency:</span>
            <span>{countryData.currency || 'N/A'}</span>
          </div>
        </div>
      }
    >
      {badge}
    </Tooltip>
  );
};

export default CountryBadge; 