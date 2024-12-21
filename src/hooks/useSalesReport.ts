import { useState, useCallback } from 'react';
import { parseMultiDayReport } from '../services/reportParser';
import { salesDataSchema } from '../types/sales';
import type { SalesData } from '../types/sales';

export function useSalesReport() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseReport = useCallback(async (report: string): Promise<SalesData[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedData = parseMultiDayReport(report);
      
      // Validate each sales data entry
      parsedData.forEach(data => {
        const result = salesDataSchema.safeParse(data);
        if (!result.success) {
          throw new Error('Invalid data format in report');
        }
      });
      
      return parsedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse report';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    error,
    isLoading,
    parseReport
  };
}