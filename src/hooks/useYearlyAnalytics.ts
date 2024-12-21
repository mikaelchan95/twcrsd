import { useState, useEffect } from 'react';
import { SalesData } from '../types/sales';
import { YearlyAnalytics, calculateYearlyAnalytics, calculateYearOverYearGrowth } from '../utils/yearlyAnalytics';

export function useYearlyAnalytics(data: SalesData[], year: string) {
  const [analytics, setAnalytics] = useState<YearlyAnalytics | null>(null);
  const [previousYearAnalytics, setPreviousYearAnalytics] = useState<YearlyAnalytics | null>(null);
  const [growth, setGrowth] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateAnalytics = () => {
      try {
        setIsLoading(true);
        
        // Calculate current year analytics
        const currentYearAnalytics = calculateYearlyAnalytics(data, year);
        setAnalytics(currentYearAnalytics);

        // Calculate previous year analytics
        const previousYear = (parseInt(year) - 1).toString();
        const previousYearAnalytics = calculateYearlyAnalytics(data, previousYear);
        setPreviousYearAnalytics(previousYearAnalytics);

        // Calculate growth metrics
        if (previousYearAnalytics.totalSales > 0) {
          const growthMetrics = calculateYearOverYearGrowth(
            currentYearAnalytics,
            previousYearAnalytics
          );
          setGrowth(growthMetrics);
        }

        setError(null);
      } catch (err) {
        console.error('Error calculating yearly analytics:', err);
        setError('Failed to calculate yearly analytics');
      } finally {
        setIsLoading(false);
      }
    };

    if (data.length > 0 && year) {
      calculateAnalytics();
    }
  }, [data, year]);

  return {
    analytics,
    previousYearAnalytics,
    growth,
    isLoading,
    error
  };
}